<!-- AUTO-GENERATED — edit shared/base/AGENTS.base.md or AGENTS.local.md, not this file -->

# Workspace Instructions

Always read and apply the following shared guidelines:

## Karpathy-Inspired Coding Guidelines

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

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

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## Container Runtime Preference

# Container Runtime Preference

**Podman > Docker** — projektübergreifend, ausnahmslos. Standard für lokale Container, Compose-Files,
Beispielbefehle, Anleitungen, neue Setups. Image-Refs voll qualifizieren (`docker.io/library/...`),
damit Podman ohne `unqualified-search-registries`-Konfig funktioniert. `docker-compose.yml` heißt
`compose.yaml`. Wenn ich „Docker" sage, ist trotzdem Podman gemeint — direkt umsetzen, nicht nachfragen.

## Artelier Guidelines

# Artelier Guidelines

## Linting & Code Quality
Jedes Frontend-Projekt verwendet ESLint (Flat Config, v9+) mit:

- **`eslint-plugin-react-hooks`** — Rules of Hooks + `react-compiler` Rule (deckt Code auf, den der React Compiler nicht optimieren kann: Mutationen im Render, Side-Effects außerhalb Effects, Ref-Zugriffe im Render).
- **`eslint-plugin-react-refresh`** — HMR-Safety: nur Components/Hooks aus Component-Dateien exportieren.
- **`typescript-eslint`** — TS-aware Rules (Type-Imports, ungenutzte Vars, `any`-Eskalation, exhaustive switch).

Standard: `eslint.config.js` mit diesen drei Plugins, `bun lint` Script, CI-Integration. Pre-commit über `lint-staged` empfohlen.

## Documentation Lifecycle
- **live-docs-collection** = Single Source of Truth: `/Users/robert.stickler/Development/__AI-Workflow__/skills/live-docs-collection`
- Bei jeder Task: aktuelle Versionen aus `package.json` checken → Change-Notes der neuen Versionen fetchen → in live-docs-collection ablegen → von dort konsumieren.
- Fehlt Doku oder ist veraltet → erstellen / aktualisieren, nicht umgehen.

## Engineering Discipline
- **Surgical Changes** — keine ungefragten Drive-by-Refactorings.
- **Iterative Refactoring** — wenn ein Ansatz scheitert: sauber zurücksetzen oder refactoren, *nicht* drüber patchen.

## Personal Instructions

# Personal Instructions — flame007

## Package Manager

**Bun first** — `bun` für Installation, Scripts und Runtime. Kein `npm`, kein `yarn`, kein `pnpm` außer explizit anders angegeben.

## AI Anonymity

**Zero AI Footprint** — niemals Spuren von AI-Nutzung in Repos committen, außer explizit erwähnt:
- Keine "Co-Authored-By" Tags in Commit-Messages
- Keine AI-generierten Kommentare oder Signaturen im Code
- Keine Tool-Metadaten oder Prompt-Referenzen (`.agents/`, `.gemini/`, `.claude/`, etc.) committen
- Alle Änderungen sollen aussehen als wären sie direkt vom User geschrieben

## Kein automatischer Push

**Nie von selbst `git push`** — unabhängig vom Tool und unabhängig davon, ob vorher schon committed wurde. Push nur nach expliziter Aufforderung durch den User (z. B. via `/commit-push` oder direkter Ansage). Ein freigegebener Plan oder ein freigegebener Commit ist keine Freigabe für den Push.

## Umlaute

# Umlaute

Umlaute (ä, ö, ü, ß) dürfen immer normal verwendet werden. Keine ASCII-Ersatzschreibweisen wie "ae", "oe", "ue", "ss" erzwingen. Gilt für Commit-Messages, Kommentare, UI-Texte, Dokumentation und Chat-Antworten an den User. Den bestehenden Code-Stil eines Projekts trotzdem respektieren (Surgical Changes).

## Git Worktrees pro Session

# Git Worktrees pro Session

**Neue Claude-Code-Session auf einem Projekt-Repo → eigener Git-Worktree**, sobald plausibel
mehrere Sessions/Chats parallel auf demselben Repo laufen könnten. Verhindert, dass sich
unfertige Änderungen aus verschiedenen Chats gegenseitig überschreiben oder denselben Branch
blockieren.

**Wann anwenden:**
- Zielverzeichnis ist ein Git-Repo (`git rev-parse --is-inside-work-tree`).
- Es ist plausibel, dass parallel eine weitere Session/ein weiterer Chat auf demselben Repo
  arbeitet (typisch bei mehreren offenen Claude-Code-Tabs/-Fenstern).

**Wie:**
- Vor dem Anlegen kurz beim User nachfragen (z. B. "Läuft parallel evtl. noch eine andere
  Session auf diesem Repo? Dann lege ich einen eigenen Worktree an.") — nicht stillschweigend
  anlegen, auch wenn die Bedingung oben plausibel erscheint.
- Nach Bestätigung einen dedizierten Worktree als Sibling-Ordner anlegen, z. B.
  `git worktree add ../<repo>-session-<kurzbeschreibung> -b session/<kurzbeschreibung>`.
- In diesem Worktree arbeiten, committen, pushen — das Haupt-Repo bleibt auf seinem Branch
  unberührt.
- Nach Abschluss: Branch mergen (PR oder direkt), dann `git worktree remove <pfad>` —
  Worktrees nicht anhäufen lassen.

**Nicht anwenden, wenn:**
- Nur eine Session gleichzeitig auf dem Repo aktiv ist (Single-Chat-Workflow) — dann ist der
  Worktree reiner Overhead ohne Nutzen.
- Das Zielverzeichnis noch kein Git-Repo ist — vorher klären, ob `git init` gewünscht ist.

---

<!-- Project-specific instructions are appended below by sync-agents -->


---

## Project-Specific Instructions

## Obsidian-Vault-Konventionen

Dieses Repo ist kein Code-Projekt, sondern ein Obsidian-Vault (Wissensmanagement). Es gilt zusätzlich zu den generischen Guidelines oben:

### Struktur
- `Public/` — geteilte Team-Notizen, wird nach GitHub gesynct.
- `Notes/` — persönliche/technische Notizen (D365, Power Platform, XRM, Git, …).
- `Categories/` — Übersichtsseiten (MOCs) pro Thema.
- `Templates/` — ein Template pro Kategorie/Notiztyp.
- `Clippings/` — von anderen verfasste Artikel/Blogposts.
- `Attachments/`, `Customer/` — privat, per `.gitignore` von Sync ausgeschlossen.
- Verschachtelte Unterordner vermeiden (Ausnahme: `Notes/XRM Plugins/` für eine große, klar abgegrenzte Gruppe). Struktur entsteht bottom-up über Links, nicht über Ordnerhierarchien.

### Frontmatter
- Jede Notiz startet mit YAML-Frontmatter: mind. `categories` (Liste von `[[Category]]`-Links) und `created` (`YYYY-MM-DD`).
- Optional je nach Notiztyp: `tags`, `author`, `url`, `published`, `topics`.
- Immer das passende Template aus `Templates/` als Ausgangspunkt nehmen, nicht Frontmatter freihändig erfinden.

### Namen & Daten
- Daten überall im Format `YYYY-MM-DD`.
- Dateinamen nach Inhalt/Titel, keine Nummerierungen oder Datums-Präfixe (außer bei Daily Notes).

### Tags & Links
- Tags und Categories pluralisieren (z. B. `tags: [XrmToolBox, Plugin]` als Konvention beibehalten, sofern im Vault bereits so etabliert).
- Interne Links (`[[Note]]`) großzügig setzen, besonders bei Ersterwähnung eines Begriffs/Tools — auch wenn die Zielnotiz noch nicht existiert (dient als Breadcrumb für später).

### Sprache & Stil
- Notizen sind i.d.R. auf Deutsch mit englischen Fachbegriffen (D365/XRM/Dev-Terminologie unübersetzt lassen).
- Reine Wissensnotizen brauchen keine Code-Review-Sorgfalt — trotzdem: keine Fakten erfinden, Quellen (`url`) bei Clippings angeben.
