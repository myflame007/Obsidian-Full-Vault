---
categories:
  - "[[Clippings]]"
  - "[[D365]]"
tags:
  - clippings
  - dynamics365
author:
  - Scott Durow
url: ""
created: 2026-08-17
published: 2013-09-09
topics:
  - LINQ
  - OrganizationServiceContext
  - Dataverse SDK
---

# MergeOptions (OrganizationServiceContext)

## Warum ich das wild finde

Der Default-Wert `AppendOnly` sorgt dafür, dass eine zweite LINQ-Query innerhalb desselben `OrganizationServiceContext` **keine frischen Daten** liefert, sondern stillschweigend die bereits getrackte Instanz aus Query 1 zurückgibt — inklusive einer eventuell projizierten (unvollständigen) Attributmenge. Man fragt serverseitig neue/alle Felder ab, bekommt aber intern die alte, ggf. nur teilweise geladene Version zurück. Kein Fehler, keine Warnung — einfach fehlende oder veraltete Daten im Code.

## Die vier MergeOptions

- **NoTracking** — kein Tracking, keine automatischen Re-Updates. `UpdateObject` braucht vorher `Attach`. Jede Query liefert echte, frische Server-Daten.
- **AppendOnly (Default)** — bereits getrackte Records werden bei erneuter Query nicht ersetzt, sondern die getrackte Instanz zurückgegeben. Änderungen auf dem Server seit der ersten Query werden ignoriert.
- **PreserveChanges** — wie AppendOnly, aber nur für Records mit `EntityState != Unchanged`. Unveränderte Records werden bei Re-Query aktualisiert, geänderte nicht.
- **OverwriteChanges** — Query-Verhalten wie NoTracking (immer frische Daten), aber weiterhin Tracking wie AppendOnly. Lokale, ungespeicherte Änderungen gehen dabei verloren.

## Der Gotcha im Detail

Typischer Ablauf mit dem Default `AppendOnly`:
1. Query 1 lädt einen Contact nur mit 4 projizierten Feldern (`FirstName`, `LastName`, `Address1_City`, …) → wird getrackt.
2. Query 2 fragt denselben Contact erneut ab, diesmal ohne Projektion (alle Felder).
3. Ergebnis: Man bekommt trotzdem nur die 4 Felder aus Query 1 zurück, weil der Context die bereits getrackte Instanz zurückgibt statt neuer Serverdaten.

Das kann Daten im Code "verstecken" und zu schwer nachvollziehbaren Bugs führen.

## Empfehlung

`MergeOption.NoTracking` verwenden, sofern man Tracking nicht explizit braucht und die Konsequenzen der anderen Optionen wirklich versteht.

## Quelle

Scott Durow, "Do you understand MergeOptions?", ursprünglich auf Scott Durows PowerPlatform Blog, gespiegelt auf der Dynamics 365 Community (09.09.2013). URL beim Clipping nicht erfasst.
