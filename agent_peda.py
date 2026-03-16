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
# =================================================================
# 4. ORCHESTRATION (LOGIQUE MÉTIER)
# =================================================================

async def agent_orchestrator(request: NoteRequest):
    """Coordonne le pipeline complet de traitement."""
    try:
        # 1. GÉNÉRATION DES EMBEDDINGS
        logger.info(f"Génération de l'embedding pour la note {request.note_id}")
        embed_response = openai.Embedding.create(
            input=request.content,
            model="text-embedding-3-small"
        )
        vector = embed_response['data'][0]['embedding']

        supabase.table("student_notes").update({
            "embedding": vector
        }).eq("id", request.note_id).execute()

        # 2. RÉCUPÉRATION DU CONTEXTE
        logger.info("Récupération de l'historique de l'étudiant")
        student_history = fetch_student_history(request.student_id)
        similar_notes = find_similar_notes(vector)

        # 3. PRISE DE DÉCISION
        logger.info("Analyse et prise de décision par l'agent")
        decision = make_decision(request.content, student_history, similar_notes)

        # 4. VÉRIFICATION (GUARDRAIL)
        logger.info("Vérification de la cohérence de la décision")
        is_valid, explanation = verify_decision(
            request.content,
            decision['reasoning'],
            decision['action']
        )

        if is_valid:
            # 5. EXÉCUTION
            logger.info(f"Décision validée: {decision['action']}")
            execute_action(request, decision)
        else:
            logger.warning(f"Décision rejetée: {explanation}")
            flag_for_human_review(request, decision, explanation)

    except Exception as e:
        logger.error(f"Erreur lors du traitement: {str(e)}", exc_info=True)
        handle_processing_error(request, str(e))

# =================================================================
# 5. SERVICES DE CONTEXTE ET IA
# =================================================================

def fetch_student_history(student_id: str) -> Dict:
    """Récupère la progression et les décisions passées."""
    progress = supabase.table("student_progress").select("*").eq("student_id", student_id).execute()
    recent_decisions = supabase.table("agent_decisions")\
        .select("*")\
        .eq("student_id", student_id)\
        .order("created_at", desc=True)\
        .limit(10).execute()
   
    return {
        "progress": progress.data,
        "recent_decisions": recent_decisions.data,
        "student_id": student_id
    }

def find_similar_notes(embedding: List[float], limit: int = 5) -> List[Dict]:
    """Recherche vectorielle via RPC PostgreSQL."""
    embedding_str = f"[{','.join(map(str, embedding))}]"
    result = supabase.rpc(
        'match_notes',
        {'query_embedding': embedding_str, 'match_threshold': 0.7, 'match_count': limit}
    ).execute()
    return result.data

def make_decision(content: str, history: Dict, similar_notes: List[Dict]) -> Dict:
    """Génère une décision structurée via LLM."""
    progress_context = "\n".join([f"- {p['subject']}: {p['mastery_level']}/10" for p in history['progress']]) or "Aucun historique"
    similar_context = "\n".join([f"- {n['title']} (sim: {n['similarity']:.2f})" for n in similar_notes[:3]]) or "Aucune note similaire"

    prompt = f"""
    CONTEXTE ÉTUDIANT:
    {progress_context}
   
    NOTES SIMILAIRES:
    {similar_context}
   
    NOTE À ANALYSER:
    {content}
   
    ACTIONS: VALIDATE_CONCEPT, SUGGEST_REVISION, GENERATE_QUIZ, ALERT_TEACHER.
   
    RÉPONDS EN JSON:
    {{
        "reasoning": "...",
        "action": "...",
        "confidence": 0.0,
        "key_concepts": []
    }}
    """
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Tu es un expert pédagogue spécialisé en IA."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        response_format={"type": "json_object"}
    )
    return json.loads(response.choices[0].message.content)

def verify_decision(content: str, reasoning: str, action: str) -> tuple[bool, str]:
    """Vérification par second modèle (Guardrail)."""
    verification_prompt = f"NOTE: {content}\nDÉCISION: {action}\nRAISON: {reasoning}\nEst-ce valide ? Réponds en JSON {{'is_valid': bool, 'explanation': str}}"
   
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": "Tu es un vérificateur rigoureux."}, {"role": "user", "content": verification_prompt}],
        temperature=0.1,
        response_format={"type": "json_object"}
    )
    result = json.loads(response.choices[0].message.content)
    return result['is_valid'], result['explanation']