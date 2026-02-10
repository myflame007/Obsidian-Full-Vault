---
categories:
    - "[[Buchart58]]"
tags:
    - Shop
created: 2026-02-08
---

# Idee: Zentrale User- & Interaktionsprofile (Customer Journey Plattform)

## Ziel der Idee

Alle relevanten Web- und Plattform-Interaktionen sollen in **zentralen
Profilen** zusammengeführt werden, um:

- Nutzer besser zu verstehen
- personalisierte Angebote auszuspielen
- langfristig eine B2C-Lead- & Journey-Plattform aufzubauen

---

**Siehe auch:** [[Marketing Strategien]]

---

## 1. Klassische User-Profile (registrierte Nutzer)

### Eigenschaften

- Nutzer erstellt aktiv ein Konto im Webshop
- Authentifizierter Zugriff (Login)

### Funktionen im Profil

- Übersicht gekaufter Produkte
- Zugriff auf digitale Inhalte
    - z. B. Wanderkarten
    - Tickets
    - Buchungsdetails
- Download & erneute Anzeige bereits erhaltener Inhalte
- Historie:
    - Käufe
    - Buchungen
    - Bewertungen

### Zweck

- Komfort für Nutzer
- Grundlage für personalisierte Kommunikation
- Rechtlich klare Datennutzung (Account-basiert)

---

## 2. Interaktionen & Bewertungen

### Eigene Plattform

- Bewertungen von Produkten
- Bewertungen von Erlebnissen (Führungen, Wanderungen, etc.)
- Kommentare oder Feedback

Diese Interaktionen werden:

- dem User-Profil zugeordnet (falls eingeloggt)
- ansonsten als eigenständige Interaktion gespeichert

---

## 3. Erweiterte User-Typen („Shadow User“ / Passive Profile)

### Grundidee

Auch Personen ohne aktives Konto sollen **als Profile in der Datenbank
existieren**, basierend auf externen Interaktionen.

> Arbeitstitel: **Shadow User** (Name noch offen)

---

### Quellen für Shadow User

#### 3.1 Google-Interaktionen

- Google-Bewertungen
- Google Maps Rezensionen
- Öffentliche Profildaten (sofern verfügbar & erlaubt)

#### 3.2 Social Media

- Instagram:
    - Likes
    - Kommentare
    - ggf. Erwähnungen
- (später erweiterbar auf andere Plattformen)

---

### Eigenschaften von Shadow Usern

- Kein Login
- Kein direktes Kundenkonto
- Profil basiert auf:
    - Plattform-ID
    - Nutzernamen
    - Interaktionsdaten
- Kann später mit einem echten User-Profil „gemerged“ werden

---

## 4. Zusammenführung & Profil-Hierarchie

### Profil-Typen

- **User**
    - registriert
    - authentifiziert
- **Shadow User**
    - extern
    - passiv
    - plattformbasiert

### Langfristige Idee

- Shadow User → kann zu echtem User werden
- Mehrere Plattform-Identitäten → ein internes Profil

---

## 5. Customer Journeys & Lead-Generation (B2C)

### Ziel

Auf Basis gesammelter Daten sollen **dynamische Journeys** entstehen.

### Datengrundlage

- Kaufverhalten
- Buchungen
- Bewertungen
- Social Media Interaktionen
- Google-Interaktionen

---

### Beispiele für Journeys

- User bewertet Wein positiv → Angebot für ähnliche Produkte
- User liked Wander-Post → Angebot für Führung
- Wiederkehrender Käufer → exklusives Angebot
- Besucher ohne Kauf → Reminder / Mehrwertinhalt

---

## 6. Micro-Targeting & Angebotslogik

- Zielgruppen basierend auf Verhalten statt nur Demografie
- Feingranulare Segmentierung:
    - Interessen
    - Aktivitätslevel
    - Kaufhistorie
- Ausspielung über:
    - E-Mail
    - ggf. Social Ads (später)
    - Onsite-Personalisierung

---

## 7. Datenschutz & Umsetzbarkeit

### Grundsätzliche Einschätzung

- Idee ist **gut, modern und umsetzbar**
- Liegt im Bereich **Customer Data Platform (CDP) / CRM-light**
- Erfordert klare Grenzen zwischen:
    - Daten, die man **dürfen und sollen**
    - Daten, die man **nicht einfach speichern darf**

---

### Umgang mit „öffentlich einsehbaren“ Daten

- Öffentliche Google-Bewertungen, Instagram-Likes usw. **dürfen nicht
  automatisch für Marketingzwecke genutzt werden**
- Datenschutzrelevant ist der **Zweck der Verarbeitung**, nicht die Sichtbarkeit

---

### Safe-Zonen

- Username / Plattform-ID
- Art der Interaktion (Like, Kommentar, Bewertung)
- Zeitstempel
- **Keine direkten Kontaktdaten oder Cross-Plattform-Verknüpfung ohne
  Einwilligung**

---

### Kritische Punkte

- Shadow User → direkte Marketingansprache = problematisch
- Profil-Merging ohne aktive Zustimmung = problematisch
- DSGVO-konforme Speicherung und Zweckbindung zwingend

---

### Empfohlene Architektur

1. **Registrierte Nutzer**: Volle Personalisierung möglich
2. **Shadow User / Interaktions-Entities**: Nur Analyse & Insights
3. **Aggregierte Trends / Muster**: Nutzung für Journeys, keine direkte
   Ansprache
4. **Cross-Plattform-Verknüpfung**: Nur nach aktiver Einwilligung durch den
   Nutzer

---

### Fazit

- Stufenweise Umsetzung sinnvoll (Phase 1–4)
- Shadow User liefern **Signale, keine direkten Targets**
- System bleibt wertvoll, auch wenn Shadow User nie direkt angesprochen werden
- Datenschutz bleibt kontrollierbar

---

## 8. Offene Punkte (für nächste Iterationen)

- DSGVO-konforme Einwilligungen & Opt-ins
- Profil-Merging-Logik
- Plattform-API-Verfügbarkeit
- Feinkonzeption von Customer Journeys & Triggern
