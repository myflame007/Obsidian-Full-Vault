# GitHub Copilot Instructions

<!-- AUTO-GENERATED from shared/guidelines — edit source files, not this file -->
<!-- Source: __AI-Workflow__/shared/guidelines/karpathy.md + container-podman.md -->
<!-- To update: bun run bin/setup-project.ts <project-path> -->

## Coding Guidelines

Behavioral guidelines to reduce common LLM coding mistakes.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

---

## Container Runtime

**Podman > Docker** — always. Fully qualify image refs (`docker.io/library/...`).
Use `compose.yaml` not `docker-compose.yml`. When "Docker" is mentioned, use Podman.

---

## Obsidian-Vault-Konventionen

Dieses Repo ist kein Code-Projekt, sondern ein Obsidian-Vault (Wissensmanagement). Es gilt zusätzlich:

### Struktur
- `Public/` — geteilte Team-Notizen, wird nach GitHub gesynct.
- `Notes/` — persönliche/technische Notizen (D365, Power Platform, XRM, Git, …).
- `Categories/` — Übersichtsseiten (MOCs) pro Thema.
- `Templates/` — ein Template pro Kategorie/Notiztyp.
- `Clippings/` — von anderen verfasste Artikel/Blogposts.
- `Attachments/`, `Customer/` — privat, per `.gitignore` von Sync ausgeschlossen.
- Verschachtelte Unterordner vermeiden (Ausnahme: `Notes/XRM Plugins/`). Struktur entsteht bottom-up über Links, nicht über Ordnerhierarchien.

### Frontmatter
- Jede Notiz startet mit YAML-Frontmatter: mind. `categories` (Liste von `[[Category]]`-Links) und `created` (`YYYY-MM-DD`).
- Optional je nach Notiztyp: `tags`, `author`, `url`, `published`, `topics`.
- Passendes Template aus `Templates/` als Ausgangspunkt nehmen, nicht Frontmatter freihändig erfinden.

### Namen & Daten
- Daten überall im Format `YYYY-MM-DD`.
- Dateinamen nach Inhalt/Titel, keine Nummerierungen oder Datums-Präfixe (außer Daily Notes).

### Tags & Links
- Tags und Categories pluralisieren, sofern im Vault bereits so etabliert.
- Interne Links (`[[Note]]`) großzügig setzen, besonders bei Ersterwähnung — auch wenn die Zielnotiz noch nicht existiert.

### Sprache & Stil
- Notizen sind i.d.R. auf Deutsch mit englischen Fachbegriffen (D365/XRM/Dev-Terminologie unübersetzt lassen).
- Keine Fakten erfinden, Quellen (`url`) bei Clippings angeben.
