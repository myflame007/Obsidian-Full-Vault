---
categories:
  - "[[Evergreen]]"
tags:
  - philosophy
  - obsidian
source: https://stephango.com/vault
---

# Embrace the Chaos

> *A bottom-up approach to note-taking and organizing things I am interested in.*
> — [Steph Ango](https://stephango.com/), CEO of Obsidian

---

## Sources

- **Original Post:** [How I use Obsidian](https://stephango.com/vault) by Steph Ango
- **Video:** [YouTube Walkthrough](https://www.youtube.com/watch?v=Dq3R3uS0sQ4)
- **Theme Recommendation:** Vicious (modern design)

---

## Core Philosophy

### Obsidian is Just Text Files

Obsidian ist im Kern nur eine Sammlung von Text-Dateien. Du kannst den Vault jederzeit mit VS Code, LaTeX oder jedem anderen Editor offnen. Keine Vendor Lock-in.

### Optimized for Laziness and Speed

Das System ist darauf ausgelegt, **schnell** und **unkompliziert** zu sein:
- Minimaler Aufwand beim Erstellen von Notizen
- Maximale Auffindbarkeit durch Links und Suche
- Keine komplizierte Ordnerstruktur

---

## How It Works

### Frontmatter (Properties)

Jede Notiz kann **Frontmatter** enthalten — strukturierte Metadaten am Anfang der Datei:

```yaml
---
categories:
  - "[[Meetings]]"
tags:
  - calculation
author: Max Mustermann
date: 2026-01-09
---
```

Diese Properties ermoglichen:
- Suche und Filterung
- Automatische Ubersichten (Bases)
- Konsistente Struktur

### Categories

Categories sind **Ubersichtsseiten** (Maps of Content). Sie enthalten eingebettete **Bases** — dynamische Ansichten, die automatisch passende Notizen anzeigen.

Beispiel: `[[Meetings]]` zeigt alle Notizen mit `categories: [[Meetings]]`

### Navigation

**Nicht uber Ordner navigieren!**

Stattdessen:
- **Quick Switcher** (`Cmd/Ctrl + O`) — Findet alles sofort
- **Categories** — Ubersichtsseiten mit gefilterten Ansichten
- **Links** — Direktverbindungen zwischen Notizen

---

## Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Quick Switcher | `Ctrl + O` | `Cmd + O` |
| New Note | `Ctrl + N` | `Cmd + N` |
| Daily Note | `Ctrl + D` | `Cmd + D` |
| Insert Template | `Ctrl + Shift + T` | `Cmd + Shift + T` |
| Add Link | `Ctrl + L` | `Cmd + L` |

---

## Links — The Power of Obsidian

Links machen Obsidian machtig. Sie werden mit doppelten eckigen Klammern erstellt:

```markdown
[[Note Name]]
[[Person/Max Mustermann]]
[[Category Name]]
```

**Alles kann verlinkt werden:**
- Notizen
- Categories
- Personen
- Projekte
- Ideen

Categories sind selbst auch Links — sie fuhren zu Ubersichtsseiten.

---

## Folder Structure

```
Vault/
├── Notes/           # Eigene Notizen
├── Categories/      # Ubersichtsseiten mit Bases
├── References/      # Externe Referenzen (Bucher, Personen, Orte)
├── Templates/       # Vorlagen
├── Attachments/     # Bilder, PDFs
├── Clippings/       # Web-Artikel
└── Daily/           # Tagliche Notizen (yyyy-mm-dd)
```

**Steph Angos Original-Ansatz:** Alles im Root-Folder, nur externe Referenzen in Unterordnern.

**Unsere Anpassung:** Leichte Ordnerstruktur fur bessere Ubersicht, aber Navigation weiterhin uber Links und Quick Switcher.

---

## Daily Notes

Notizen mit dem Format `yyyy-mm-dd` dienen als Tagesubersicht:
- Was wurde an diesem Tag erstellt?
- Welche Gedanken hatte ich?
- Rueckblick und Reflexion

---

## Composable Templates

Templates sind **kombinierbar**. Eine Notiz kann mehrere Templates enthalten:

1. Meeting Template anwenden
2. People Template hinzufugen
3. Fertig!

So entsteht eine Meeting-Notiz mit Personen-Metadaten.

---

## Evergreen Notes

> *"Evergreen notes turn ideas into objects we can manipulate."*

Evergreen Notes sind zeitlose Ideen — Konzepte, die immer relevant bleiben:
- Gut formuliert
- Atomar (eine Idee pro Note)
- Stark verlinkt

Beispiel: [[Evergreen notes turn ideas into objects that you can manipulate]]

---

## When to Take Notes?

- **Jeden Tag** — Daily Notes
- **Bei jeder Idee** — Sofort festhalten
- **Alle paar Tage** — Ruckblick auf die Woche

Der Schluessel: **Nicht nachdenken, einfach schreiben.**

---

## Expert Level: Second Brain

Fur fortgeschrittene Nutzung:
- Jede erste Erwahnung von etwas wird verlinkt
- References fur alles ausserhalb deiner Welt (Bucher, Personen, Orte)
- Media DB Plugin fur Filme/Serien
- Regelmassige Review-Sessions
