import os
import json
import logging
from typing import Optional, Dict, List

import openai
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from supabase import create_client, Client
from dotenv import load_dotenv

# =================================================================
# 1. CONFIGURATION & INITIALISATION
# =================================================================

load_dotenv(".env")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Agent Pédagogique Autonome",
    description="Système d'analyse de notes pour la plateforme éducative",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En production, remplacez par l'URL de votre site Lovable
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialisation des clients
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)
openai.api_key = str(os.getenv("OPENAI_API_KEY"))
#print(os.getenv("OPENAI_API_KEY"))

# =================================================================
# 2. MODÈLES DE DONNÉES (PYDANTIC)
# =================================================================

class NoteRequest(BaseModel):
    """Schéma de validation pour les requêtes de notes."""
    note_id: str
    student_id: str
    content: str

    @field_validator('content')
    def validate_content(cls, v):
        if len(v.strip()) < 50:
            raise ValueError('La note doit contenir au moins 50 caractères')
        if len(v) > 10000:
            raise ValueError('La note ne peut pas dépasser 10000 caractères')
        return v.strip()

# =================================================================
# 3. ENDPOINTS API
# =================================================================

@app.post("/process-note")
async def process_note_endpoint(request: NoteRequest, background_tasks: BackgroundTasks):
    """Point d'entrée principal pour l'analyse d'une note."""
    logger.info(f"Nouvelle note reçue: {request.note_id}")
    
    # Lancement du traitement lourd en arrière-plan
    background_tasks.add_task(agent_orchestrator, request)
    
    return {
        "status": "processing",
        "message": "L'agent pédagogique analyse votre note...",
        "note_id": request.note_id
    }

@app.get("/health")
async def health_check():
    """Endpoint de monitoring."""
    health_status = {"status": "healthy", "service": "agent-pedagogique", "checks": {}}
    try:
        supabase.table("student_notes").select("id").limit(1).execute()
        health_status["checks"]["supabase"] = "ok"
    except Exception:
        health_status["checks"]["supabase"] = "error"
        health_status["status"] = "degraded"
    
    try:
        openai.Model.list()
        health_status["checks"]["openai"] = "ok"
    except Exception:
        health_status["checks"]["openai"] = "error"
        health_status["status"] = "degraded"
    
    return health_status


