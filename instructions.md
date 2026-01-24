# Gemini CLI Workflows

This file contains detailed instructions for complex, multi-step workflows that I can execute.

---

## Workflow: Generate MOC and Flashcards

**Purpose:** Automates the "Digestion" process for a raw note by creating a "Map of Content" (MOC) and associated atomic flashcards.

**Trigger:** "Führe den MOC-Workflow für die Notiz `[[Dateiname]]` aus."

### Steps:

1.  **Analyze Note:**
    *   Read and analyze the content of the source note (e.g., `[[Dateiname]]`).
    *   Identify key concepts, definitions, and facts suitable for flashcards.

2.  **Create Flashcards:**
    *   Create a new sub-folder inside `Flashcards/` named after the note's topic (e.g., `Flashcards/TopicName/`).
    *   For each identified concept, create a new atomic note inside this sub-folder. The note's title should be a question (e.g., `Was ist semantisches Priming?.md`).
    *   The content of the flashcard should be the answer.

3.  **Create MOC:**
    *   Create a new note named `Dateiname MOC.md` in the `Notes/` folder.
    *   Add a `RAW: "[[Dateiname]]"` property to the frontmatter for easy back-linking.
    *   Write a structured summary of the source note into the MOC.
    *   Embed links to the newly created flashcard notes at the appropriate places in the summary.
