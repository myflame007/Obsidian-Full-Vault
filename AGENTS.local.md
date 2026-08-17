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
