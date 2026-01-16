---
tags:
  - home
---

# Welcome to the Vault

> *"Embrace the chaos. Let your notes be messy. Trust the links."*
> — Inspired by [Steph Ango](https://stephango.com/vault)

---

## Quick Navigation


[[Hanna]] arbeitet bei [[Avanade]]

| Action | Shortcut |
|--------|----------|
| Quick Switcher (find anything) | `Cmd/Ctrl + O` |
| New Note | `Cmd/Ctrl + N` |
| Today's Daily Note | `Cmd/Ctrl + D` |
| Insert Template | `Cmd/Ctrl + Shift + T` |
| Add Internal Link | `Cmd/Ctrl + L` |

---

## Categories

Navigate by topic, not by folder:

![[Categories.base]]

---

## Philosophy

### Embrace the Chaos

Dieser Vault folgt einem **Bottom-Up Ansatz**. Wir organisieren nicht von oben herab, sondern lassen Struktur organisch entstehen.

**Kernprinzipien:**

1. **Notizen zuerst, Organisation spater** — Schreib einfach. Sortieren kommt von allein durch Links.
2. **Links sind alles** — Jede Verbindung zwischen Notizen macht den Vault wertvoller.
3. **Categories statt Ordner** — Wir navigieren uber `[[Links]]`, nicht uber den File Explorer.
4. **Templates fur Konsistenz** — Schneller starten, weniger nachdenken.

### Personal + Company in einem Vault

Dieser Vault kombiniert personliche und geteilte Notizen:

| Bereich | Beschreibung | Git Sync |
|---------|--------------|----------|
| `Notes/` | Alle Notizen (personal + work) | Nein |
| `Public/` | Geteilte Notizen fur das Team | Ja |
| `Categories/` | Ubersichtsseiten mit Bases | Nein |
| `References/` | Externe Infos (Bucher, Personen) | Nein |
| `Templates/` | Vorlagen | Nein |

**So teilst du eine Notiz:**
```yaml
---
publish: true
publication_date: 2026-01-09
categories:
  - "[[Meetings]]"
---
```

---

## How It Works

### 1. Notizen erstellen

Alles beginnt mit einer Notiz. Verwende Templates fur Konsistenz:

- **Meeting** → `Meeting Template`
- **Person** → `People Template`
- **Projekt** → `Project Template`
- **Idee** → Einfach schreiben!

### 2. Verlinken

Links machen Obsidian machtig:

```markdown
Heute habe ich mit [[Max Mustermann]] uber [[Projekt Alpha]] gesprochen.
Die Idee basiert auf [[Evergreen notes turn ideas into objects]].
```

### 3. Kategorisieren

Jede Notiz bekommt eine Category im Frontmatter:

```yaml
---
categories:
  - "[[Meetings]]"
  - "[[Customers]]"
tags:
  - calculation
  - proposal
---
```

### 4. Finden

Vergiss den File Explorer. Nutze:
- **Quick Switcher** (`Cmd+O`) — Findet alles
- **Categories** — Ubersichtsseiten mit Filtern
- **Graph View** — Visuelle Verbindungen

---

## Automations (Plugin)

Das **Vault Automation Plugin** bietet folgende Commands (`Cmd + P`):

| Command | Beschreibung |
|---------|--------------|
| **Sync Categories** | Erstellt fehlende Category-Dateien automatisch |
| **Publish Current Note** | Kopiert aktuelle Note zu `Public/` |
| **Sync All Public Notes** | Synchronisiert alle publishable Notes |

Siehe [[Obsidian Plugin Development Guide]] fur Details.

---

## Folder Structure

```
Vault/
├── Notes/           # Alle Notizen leben hier
├── Categories/      # Ubersichtsseiten (MOCs)
├── References/      # Externe Referenzen (Bucher, Personen, etc.)
├── Templates/       # Vorlagen
│   └── Bases/       # Base-Dateien fur Category-Views
├── Attachments/     # Bilder, PDFs, etc.
├── Clippings/       # Web-Artikel
├── Daily/           # Tagliche Notizen
└── Public/          # Geteilte Notizen (Git synced)
```

---

## Getting Started

1. **Offne den Quick Switcher** mit `Cmd/Ctrl + O`
2. **Erstelle deine erste Notiz** mit `Cmd/Ctrl + N`
3. **Wende ein Template an** mit `Cmd/Ctrl + Shift + T`
4. **Verlinke zu anderen Notizen** mit `[[Note Name]]`

> Tipp: Du musst nicht alles verstehen. Fang einfach an zu schreiben!

---

## Resources

- [[Embrace Chaos]] — Die Philosophie hinter diesem Vault
- [[Obsidian Plugin Development Guide]] — Plugin-Entwicklung
- [[Testing Guide]] — Plugin testen
- [Steph Ango's Vault](https://stephango.com/vault) — Original-Inspiration
