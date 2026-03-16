export const analyzeNoteWithAgent = async (noteId: string, studentId: string, content: string) => {
  try {
    const response = await fetch("http://localhost:8000/process-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        note_id: noteId,
        student_id: studentId,
        content: content,
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'appel à l'agent");
    }

    return await response.json();
  } catch (error) {
    console.error("Agent Error:", error);
    throw error;
  }
};