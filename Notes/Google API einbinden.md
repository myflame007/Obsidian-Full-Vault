---
categories:
  - "[[Buchart58]]"
tags:
  - Shop
created: 2026-02-08
---
## Zusatzidee: Zentrale Terminverwaltung via Google Kalender

- Terminverwaltung (Führungen, Besichtigungen, Verkostungen) erfolgt **nicht über ein eigenes Kalendersystem**
- Stattdessen Nutzung eines **zentralen Google-Kalenders** über einen dedizierten Firmen-Google-Account

### Konzept
- Admin-System schreibt Termine per **Google Calendar API** in den Firmenkalender
- Jeder Termin entspricht einem Kalendereintrag (Datum, Uhrzeit, Beschreibung, Teilnehmerlimit optional)
- Änderungen oder Absagen werden automatisch im Google Kalender aktualisiert

### Nutzung
- Firmenkalender ist:
  - öffentlich abonnierbar oder
  - für Kunden/Mitarbeiter freigegeben
- Nutzer können den Kalender einfach auf dem eigenen Smartphone hinzufügen
- Termine erscheinen direkt im persönlichen Kalender (read-only)

### Vorteile
- Keine eigene Kalender-UI für Endnutzer nötig
- Hohe Kompatibilität (iOS, Android, Web)
- Einfache Synchronisation & Wartung
- Google übernimmt Benachrichtigungen & Updates