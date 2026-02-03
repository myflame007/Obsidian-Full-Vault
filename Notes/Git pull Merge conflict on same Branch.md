---
categories:
  - "[[Help]]"
  - "[[Coding]]"
  - "[[Git]]"
tags:
  - kognition
created: 2026-02-03
---
Ich verwende nur einen Branch bei meinem [[Obsidian Vault ]].
Da das [[Git-For-Obsidian Plugin]] noch nicht vollständig eingerichtet ist, kann es zu [[Merge conflicts]] kommen.
Diese kann man zb in der Konsole fixen mit 

```
git add .

git commit -m "WIP: lokale Änderungen"

git pull
```

