---
categories:
  - "[[Psychologie-Entrance-Exam]]"
tags:
  - notebooklm
  - flashcards
  - instructions
created: 2026-02-17
---
## Ziel
Diese Datei steuert die Flashcard-Erstellung fuer den Psychologie-Aufnahmetest Wien 2026.
Die KI soll nur pruefungsrelevante Inhalte abfragen und unnuetze Details weglassen.

## Eingaben fuer NotebookLM
1. Aktuelle PDF-Quelle 
2. Beispielfragen.
3. Diese Instruktionsdatei.

## Priorisierung (80/20)
Verteile neue Karten ungefaehr so:
- Prioritaet 1: 60%
- Prioritaet 2: 30%
- Prioritaet 3: 10%

Reihenfolge nach Wichtigkeit:
1. Kapitel 3 - Methodenlehre/Forschung
2. Kapitel 4 - Biologische Psychologie
3. Kapitel 2 - Geschichte/Schulen
4. Kapitel 5 - Allgemeine Psychologie
5. Kapitel 7 - Sozialpsychologie
6. Kapitel 6 - Entwicklungspsychologie
7. Kapitel 1 - Grundlagen/Definitionen
8. Kapitel 8 - Differentielle/Persoenlichkeit

## Was soll gefragt werden
- Praezise Definitionen
- Unterschiede und Abgrenzungen (z. B. UV vs. AV, Korrelation vs. Kausalitaet)
- Modelle, Stufen, Kernprinzipien
- Zentrale Experimente und deren Kernaussage
- Kernbegriffe, die in Pruefungen haeufig abgefragt werden

## Was NICHT gefragt werden soll
- Herausgeber, Danksagung, Autor:innenlisten
- Seitenzahlen, Fussnotenmarker, Layoutdetails
- Randbeispiele ohne Lernwert
- Triviale Detailzahlen ohne prufungsrelevante Bedeutung
- Wiederholte Karten mit fast identischer Frage

## Flashcard-Format (verbindlich)
Jede Karte soll genau dieses Format verwenden:

```md
---
tags:
  - flashcard
  - psychology-entrance-exam
  - <kapitel-tag>
created: YYYY-MM-DD
categories:
  - "[[Psychologie-Entrance-Exam-Flashcard]]"
priority: <1-10>
---

Q: <eine klare Frage, genau ein Konzept>
A: <kurz, korrekt, 1-3 Saetze>
Hint: <sehr kurz, Merkanker>
Memo: <optional, wenn hilfreich>
```

## Regeln fuer gute Karten
- Eine Karte = ein Kernkonzept.
- Frage eindeutig und ohne doppelte Verneinung.
- Antwort kurz und fachlich korrekt.
- Keine Ja/Nein-Fragen, wenn offene Recall-Frage moeglich ist.
- Bei Prozessen/Stufen Reihenfolge klar nennen.
- Prioritaet vergeben:
  - `9-10`: absoluter Kernstoff
  - `7-8`: sehr wichtig
  - `5-6`: ergaenzend
  - `1-4`: nur wenn explizit gewuenscht

## Qualitaetscheck vor Ausgabe
Vor jeder Karte intern pruefen:
1. Ist das Thema pruefungsrelevant?
2. Ist die Frage klar und nicht doppelt?
3. Ist die Antwort knapp und korrekt?
4. Ist die Karte kein Duplikat?
5. Passt die Prioritaet zur 80/20-Logik?

## Ausgabevorgabe an die KI
- Gib nur fertige Flashcards aus.
- Keine Erklaertexte ausserhalb der Karten.
- Wenn Inhalt unklar/zu randstaendig ist: weglassen.
