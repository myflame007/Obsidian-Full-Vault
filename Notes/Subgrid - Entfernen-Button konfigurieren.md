---
categories:
  - "[[D365]]"
  - "[[Power Platform]]"
  - "[[Knowledge]]"
tags:
  - Subgrid
  - RibbonWorkbench
  - XrmToolBox
created: 2026-06-08
source: https://community.powerplatform.com/blogs/post/?postid=ce35abfe-533c-f011-b4cc-7c1e52466c21
---
# Subgrid - Entfernen-Button konfigurieren

## Problem

Der **Entfernen-Button** in einem Subgrid wird nicht angezeigt, obwohl er vorhanden sein sollte.

Ohne Konfiguration loescht der Standard-Button den verknuepften Datensatz aus der Datenbank - anstatt nur die Beziehung aufzuloesen. Das fuehrt dazu, dass Benutzer unbeabsichtigt Datensaetze loeschen.

## Ursache

Der Entfernen-Button benoetigt eine `RelationshipTypeRule` als Display Rule, damit er bei **1:N-Beziehungen** korrekt angezeigt wird. Ohne diese Regel bleibt der Button versteckt oder verhalt sich unerwuenscht.

## Loesung: Ribbon Workbench (via XrmToolBox)

### Benoetigt

- [XrmToolBox](https://www.xrmtoolbox.com/)
- Ribbon Workbench (von Scott Durow)

### Schritte

1. **XrmToolBox oeffnen** und Ribbon Workbench installieren/starten

2. **Unmanaged Solution erstellen** im Power Apps Maker Portal
   - Nur die betroffene Child-Tabelle hinzufuegen (keine Metadaten, keine anderen Tabellen)

3. **Solution in Ribbon Workbench laden**

4. **Subgrid und Remove-Button auswaehlen**
   - Im Ribbon-Editor die Tabelle des Subgrids auswaehlen
   - Den Remove-Button anklicken

5. **Display Rule vom Typ `RelationshipTypeRule` hinzufuegen** mit diesen Werten:

   | Eigenschaft               | Wert          |
   | ------------------------- | ------------- |
   | `AppliesTo`               | SelectedEntity |
   | `RelationshipType`        | OneToMany     |
   | `AllowCustomRelationship` | True          |
   | `AllowSystemRelationship` | True          |
   | `InvertResult`            | False         |
![[Pasted image 20260608113629.png]]

6. **Beziehung pruefen**: Die Child-Tabelle muss einen Lookup auf die Parent-Tabelle haben (1:N)

7. **Publish** klicken und auf Abschluss warten

8. **Testen**: Datensatz im Subgrid entfernen - er sollte nur ausgelinkt, nicht geloescht werden

## Ergebnis

Der Entfernen-Button ist sichtbar und loest nur die Beziehung auf (Lookup wird geleert), der Datensatz bleibt in der Datenbank erhalten.
