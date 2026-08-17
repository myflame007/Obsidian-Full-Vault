# WorkOS - Claude Instructions

Obsidian-Vault für persönliches/geteiltes Wissensmanagement (Dynamics 365 / Power Platform / XRM-Themen, Kunden-Notizen, Arbeitsnotizen). Kein Code-Projekt — es werden keine Anwendungen gebaut oder deployed.

Aufbau folgt Steph Angos Vault-Konventionen (stephango.com/vault): flache Struktur, Frontmatter-Properties statt Ordner-Hierarchien, `YYYY-MM-DD`-Daten, großzügiges Linking.

## Architektur / Dateien
- `Notes/` — persönliche/technische Notizen (Git-Workflows, XRM-Plugins, Power Platform, Kundenspezifisches)
- `Notes/XRM Plugins/` — Dynamics-365-Plugin-Dokumentation
- `Categories/` — Übersichtsseiten (MOCs) pro Thema
- `Public/` — Team-Notizen, wird nach GitHub gesynct (`publish: true`)
- `Clippings/` — von anderen verfasste Artikel
- `Templates/` — ein Template pro Notiztyp, immer als Ausgangspunkt nutzen
- `Customer/`, `Attachments/*` — privat, per `.gitignore` von Sync ausgeschlossen
- `.obsidian/` — Obsidian-Konfiguration (Plugins, Themes)

## Notiz-Konventionen
- YAML-Frontmatter mit mind. `categories` (`[[Category]]`-Links) und `created` (`YYYY-MM-DD`); je nach Typ zusätzlich `tags`, `author`, `url`.
- Interne Links (`[[Note]]`) großzügig setzen, auch auf noch nicht existierende Notizen.
- Sprache: Deutsch mit unübersetzten englischen Fachbegriffen.

## Arbeitsweise / Git
- Änderungen sind i.d.R. reine Markdown-Notizen, keine Code-Reviews nötig.
- Kein automatisches `git push` — nur nach expliziter Aufforderung.
