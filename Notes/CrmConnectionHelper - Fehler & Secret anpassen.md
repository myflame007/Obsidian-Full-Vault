---
categories:
  - "[[D365]]"
  - "[[Help]]"
tags:
  - CRM
  - Azure
  - Troubleshooting
created: 2026-05-07
---
# CrmConnectionHelper – Fehler & Secret anpassen

Wenn der `CrmConnectionHelper` einen Fehler wirft, liegt es häufig am Connection String bzw. dem zugehörigen Secret in Azure.

## Vorgehen

1. **Azure Key Vault** aufrufen und das entsprechende Secret prüfen
2. Entweder ein **neues Secret anlegen** oder ein **bestehendes Secret verwenden**, das noch gültig ist
3. Den **Connection String** in der App Configuration / den App Settings auf das korrekte Secret aktualisieren

## Hinweise

- Fehler tritt oft nach Secret-Rotation oder Ablauf des alten Secrets auf
- Es kann ein bestehendes, noch gültiges Secret geben – erst prüfen, bevor ein neues angelegt wird
