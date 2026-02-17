---
categories:
  - "[[Help]]"
  - "[[General]]"
tags:
  - VSCode
  - Git
created: 2026-01-23
---
Die globale Git-Ignore Konfiguration:

1. **Git Config gesetzt**: `git config --global core.excludesfile` zeigt jetzt auf `~/.gitignore_global`
2. **`.claude` hinzugefügt**: Der Ordner `.claude` wird jetzt in allen Git-Repos ignoriert

Du musst nichts mehr in die projekt-spezifischen `.gitignore` Dateien schreiben - `.claude` wird global ignoriert.