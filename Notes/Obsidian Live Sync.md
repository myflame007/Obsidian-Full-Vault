---
categories:
  - "[[Obsidian Plugin]]"
tags:
created: 2026-02-24
---
# ObsidianSync

### Konzept & technische Umsetzung eines Echtzeit-Kollaborations-Plugins für Obsidian

*Version 0.1 · Februar 2026*

  

---

  

## 1. Ausgangslage & Motivation

  

Obsidian ist ein leistungsstarkes, dateibasiertes Notiz-Tool, das auf Markdown-Dateien im lokalen Dateisystem aufbaut. Diese Architektur bietet maximale Kontrolle, Portabilität und Offline-Fähigkeit – ist aber für die gleichzeitige Bearbeitung durch mehrere Personen nicht ausgelegt.

  

Im Consulting-Kontext entsteht der Bedarf, gemeinsame Wissensdatenbanken, Projektdokumentationen und strukturierte Notizen kollaborativ zu pflegen. Dabei soll nicht nur asynchrones Bearbeiten möglich sein, sondern echte Echtzeit-Kollaboration – ähnlich wie in Google Docs oder Notion.

  

> **Kernproblem:** Obsidian hat kein eingebautes Sync-Protokoll für gleichzeitige Edits. Mehrere Personen, die dieselbe Datei gleichzeitig bearbeiten, führen ohne spezielle Synchronisation unweigerlich zu Konflikten und Datenverlust.

  

---

  

## 2. Warum nicht bestehende Lösungen?

  

### 2.1 Git-basierte Synchronisation

  

Git ist der naheliegendste Ansatz: Ein gemeinsames Repository, jeder committet und pullt. Das funktioniert gut für asynchrones Arbeiten, bei dem Personen zu unterschiedlichen Zeiten an Dateien arbeiten.

  

Sobald jedoch zwei Personen gleichzeitig dieselbe Datei bearbeiten, entstehen Merge-Konflikte, die manuell gelöst werden müssen. Für nicht-technische Nutzer ist das eine erhebliche Hürde. Git ist daher für den geplanten Use-Case nicht geeignet.

  

### 2.2 Cloud-Sync (OneDrive, Dropbox, Syncthing)

  

Shared-Filesystem-Lösungen synchronisieren Dateien zwischen Geräten, haben aber keinen Mechanismus zur Konfliktlösung bei gleichzeitigen Edits. Im besten Fall entstehen Konfliktkopien, im schlimmsten Fall gehen Änderungen einfach verloren.

  

### 2.3 obsidian-livesync (CouchDB)

  

obsidian-livesync ist das bekannteste Plugin für Echtzeit-Sync in Obsidian. Es basiert auf CouchDB als Backend und bietet grundlegende Synchronisation. Es hat jedoch wesentliche Limitationen:

  

- CouchDB als einziges mögliches Backend – keine Flexibilität

- Attachment-Sync ist problematisch bei großen Binärdateien

- Keine Presence-Funktionalität – man sieht nicht, wer gerade welche Datei bearbeitet

- Keine selektive Synchronisation einzelner Ordner oder Dateien

- Performance-Probleme bei großen Vaults

- Bus-Factor 1: das Plugin wird von einer einzelnen Person gewartet

- Setup ist für nicht-technische User komplex und fehleranfällig

  

> **Fazit:** Keine bestehende Lösung erfüllt die Anforderungen an robuste Echtzeit-Kollaboration mit guter User Experience. Ein eigenes Plugin bietet die Möglichkeit, genau das zu bauen, was gebraucht wird.

  

---

  

## 3. Anforderungen

  

### 3.1 Muss-Anforderungen

  

- Gleichzeitiges Bearbeiten derselben Datei durch mehrere Personen ohne Konflikte

- Echtzeit-Synchronisation der Änderungen zwischen allen verbundenen Clients

- Robuste Konfliktlösung auf Zeichen-Ebene (nicht auf Datei-Ebene)

- Self-hosted Backend – keine Abhängigkeit von externen Cloud-Diensten

- Obsidian Plugin-Integration über die offizielle Obsidian API

  

### 3.2 Soll-Anforderungen

  

- Presence-Anzeige: Wer hat welche Datei gerade offen?

- Cursor-Sichtbarkeit: Echtzeit-Cursor anderer Nutzer (wie in Google Docs)

- Selektive Synchronisation: Bestimmte Ordner/Dateien ausschließen

- Einfaches Onboarding für nicht-technische User

- Offline-Fähigkeit mit automatischer Synchronisation beim Reconnect

  

### 3.3 Nicht-Anforderungen (vorerst)

  

- Versionierung / History (kann über Git ergänzt werden)

- Mobile-first Support (Desktop-Obsidian hat Priorität)

- Ende-zu-Ende-Verschlüsselung (kann in späteren Versionen ergänzt werden)

  

---

  

## 4. Technische Architektur

  

### 4.1 Das CRDT-Prinzip

  

Das Herzstück der Lösung ist ein **CRDT** – ein *Conflict-free Replicated Data Type*. CRDTs sind Datenstrukturen, die so gestaltet sind, dass gleichzeitige Änderungen von verschiedenen Parteien immer zu einem konsistenten Ergebnis zusammengeführt werden können, ohne manuelle Konfliktlösung.

  

> **Analogie:** Stell dir vor, zwei Personen schreiben gleichzeitig auf einem Whiteboard. Anstatt dass einer den anderen überschreibt, merkt sich das System für jeden Buchstaben genau, wer ihn wann geschrieben hat – und kann so immer einen konsistenten Zustand berechnen.

  

Wir verwenden **Yjs**, eine ausgereifte CRDT-Bibliothek für kollaborative Textbearbeitung. Yjs wird intern von Produkten wie Notion, Linear und Loom verwendet und ist speziell für die Herausforderungen von Echtzeit-Textediting optimiert.

  

### 4.2 Systemkomponenten

  

| Komponente | Beschreibung |

|---|---|

| **Obsidian Plugin (Client)** | TypeScript-Plugin, das in Obsidian läuft. Überwacht Dateiänderungen, kommuniziert mit dem Server via WebSocket, und stellt Presence-Informationen dar. |

| **WebSocket Server (Backend)** | Node.js-Server, der Yjs-Dokumente verwaltet und als Relay zwischen allen verbundenen Clients dient. Leichtgewichtig, einfach zu hosten (Docker). |

| **Persistenz-Layer** | Der Server speichert den aktuellen Dokumentenstatus persistent auf Disk (LevelDB oder SQLite). Bei Reconnect wird der aktuelle Stand sofort übertragen. |

  

### 4.3 Technologie-Stack

  

- **Yjs** – CRDT-Bibliothek für kollaborative Textbearbeitung (MIT-Lizenz)

- **y-websocket** – offizielle Yjs WebSocket-Provider Bibliothek

- **Node.js** – Laufzeitumgebung für den Server

- **TypeScript** – für Plugin und Server (Typsicherheit, bessere Wartbarkeit)

- **LevelDB / SQLite** – persistente Speicherung des Dokumentenstatus am Server

- **Obsidian Plugin API** – offizielle Schnittstelle für die Client-Integration

  

### 4.4 Datenfluss

  

1. User A tippt Text in Obsidian

2. Das Plugin fängt die Änderung ab und kodiert sie als Yjs-Update (CRDT-Datenstruktur)

3. Das Update wird via WebSocket an den Server gesendet

4. Der Server speichert das Update und broadcasted es an alle anderen verbundenen Clients

5. User B's Plugin empfängt das Update, Yjs merged es konfliktfrei in den lokalen Zustand

6. Obsidian zeigt User B die aktualisierte Datei in Echtzeit

  

> **Offline-Verhalten:** Wenn ein Client die Verbindung verliert, arbeitet er lokal weiter. Beim Reconnect sendet er alle lokalen Updates an den Server. Yjs merged diese automatisch korrekt mit den zwischenzeitlichen Änderungen anderer User.

  

---

  

## 5. Vorteile gegenüber obsidian-livesync

  

| Feature | obsidian-livesync | ObsidianSync |

|---|---|---|

| Konfliktlösung | Datei-Ebene (CouchDB) | Zeichen-Ebene (Yjs CRDT) |

| Presence / Awareness | Nicht vorhanden | Wer bearbeitet was? |

| Cursor-Sichtbarkeit | Nicht vorhanden | Echtzeit-Cursor |

| Backend | Nur CouchDB | Einfacher WebSocket-Server |

| Selektive Sync | Nicht möglich | Ordner/Dateien ausschließbar |

| Hosting-Aufwand | CouchDB-Setup nötig | Docker-Container, minimal |

| Wartung | Single-Maintainer | Eigene Kontrolle |

  

---

  

## 6. Umsetzungsplan

  

### Phase 1 – Backend & Grundgerüst (2–3 Wochen)

  

- Node.js WebSocket-Server mit Yjs-Integration aufsetzen

- Persistenz-Layer implementieren (LevelDB)

- Docker-Setup für einfaches Deployment

- Grundlegende Auth (Token-basiert)

- Einfaches Test-Setup mit zwei Browser-Clients zur Validierung

  

### Phase 2 – Obsidian Plugin (2–3 Wochen)

  

- Plugin-Grundgerüst mit Obsidian API

- Dateiänderungen abfangen und als Yjs-Updates kodieren

- WebSocket-Verbindung zum Server

- Eingehende Updates in Obsidian-Editor einspiegeln

- Konfigurationsseite im Plugin (Server-URL, Token)

  

### Phase 3 – Presence & UX (2–3 Wochen)

  

- Awareness-Protokoll: welche User haben welche Datei offen

- Anzeige in der Obsidian-Statusleiste

- Einfaches Onboarding für neue User

- Selektive Sync konfigurierbar machen

- Testing mit mehreren gleichzeitigen Usern

  

### Phase 4 – Stabilisierung (laufend)

  

- Edge Cases: Reconnect-Verhalten, große Dateien, Attachments

- Performance-Optimierung bei vielen gleichzeitigen Änderungen

- Dokumentation für Setup und Benutzung

  

> **Gesamtaufwand:** Realistisch 2–3 Monate für eine produktionstaugliche Version. Ein interner Prototyp für den Consulting-Einsatz ist nach Phase 1 und 2 (ca. 4–6 Wochen) bereits möglich.

  

---

  

## 7. Hosting & Betrieb

  

Der WebSocket-Server ist als Docker-Container konzipiert und kann auf jedem Linux-VPS deployed werden. Für den internen Consulting-Einsatz reicht ein kleiner Server (z.B. Hetzner CX11, ~4 EUR/Monat) vollkommen aus.

  

Der Server benötigt eine Domain mit SSL-Zertifikat (Let's Encrypt) für die WebSocket-Verbindung (`wss://`). Das Setup ist deutlich schlanker als CouchDB und leichter zu warten.

  

- Docker + Docker Compose für einfaches Deployment

- Nginx als Reverse Proxy für SSL-Terminierung

- Let's Encrypt für kostenlose SSL-Zertifikate

- Optional: einfaches Admin-Interface zur Nutzerverwaltung

  

---

  

## 8. Nächste Schritte

  

Als erster konkreter Schritt empfiehlt sich ein **Proof-of-Concept des Backends**: einen minimalen Yjs WebSocket-Server aufsetzen und mit zwei Browser-Tabs validieren, dass gleichzeitige Textänderungen korrekt synchronisiert werden. Das dauert einen halben Tag und gibt sofortige Gewissheit über die technische Machbarkeit.

  

Danach kann mit dem Obsidian Plugin-Grundgerüst begonnen werden, zunächst nur mit einfacher Datei-Synchronisation ohne Presence-Features.

  

> **Bereit zum Start?** Das Konzept ist technisch solide und die verwendeten Bibliotheken (Yjs, y-websocket) sind produktionsbewährt. Der nächste Schritt ist ein konkreter Proof-of-Concept – diesen können wir gemeinsam angehen.