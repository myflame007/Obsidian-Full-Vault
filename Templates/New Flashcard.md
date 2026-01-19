<%*
// Neuen Flashcard-Namen abfragen
const title = await tp.system.prompt("Flashcard Titel:");
if (!title) return;

// Template-Inhalt
const content = `---
tags:
  - flashcards
created: ${tp.date.now("YYYY-MM-DD")}
---

# ${title}

Q:
A:
Hint:
Memo:
Tags:
`;

// Datei im Flashcards-Ordner erstellen
const folder = app.vault.getAbstractFileByPath("Flashcards");
await tp.file.create_new(content, title, true, folder);
-%>
