---
categories:
  - "[[D365]]"
  - "[[Knowledge]]"
tags:
  - XrmToolBox
  - Plugin
created: 2026-03-06
---
# Restore deleted records

## Einordnung

- Bereich: Recovery & Diagnostics
- Hersteller: Nguyen Nhu Hieu
- Version: 1.2023.4.11

## Kurzbeschreibung

Retrieve the deleted records from audit by table, user, and date and time range, and then restore those records with the same GUID. 

Praktisch vor allem dann, wenn der Standardweg in Dataverse zu langsam oder zu umstaendlich ist.

## Wann ich es nutze

- Wenn ich Fehler, Logs oder historische Aenderungen untersuchen muss.
- Wenn ich Daten oder technische Artefakte aus einer problematischen Situation wiederherstellen will.
- Wenn ich einen Supportfall oder Incident sauber nachvollziehen moechte.

## Links

- [[XRM - Plugins Overview]]
- [[XRM Plugin - Assembly Recovery Tool|Assembly Recovery Tool]]
- [[XRM Plugin - Bulk Audit Rollback|Bulk Audit Rollback]]
- [[XRM Plugin - Flow Execution History|Flow Execution History]]

## Technische Notizen

- Plugin Type: `NNH.XrmToolBox.DeleteRecordRecovery.MyPlugin`
- XrmToolBox-Beschreibung: Retrieve the deleted records from audit by table, user, and date and time range, and then restore those records with the same GUID. 
- Eigene Einordnung: Praktisch vor allem dann, wenn der Standardweg in Dataverse zu langsam oder zu umstaendlich ist.

## Eigene Notizen

