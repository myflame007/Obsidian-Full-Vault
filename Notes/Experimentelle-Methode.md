---
categories:
  - "[[Psychologie]]"
tags:
    - methodenlehre
    - experiment
    - kausalitaet
source: "[[Psychologie_Literatur 3.pdf]]"
---

# Die experimentelle Methode

> Der Königsweg zum Kausalschluss

---

## Warum Experimente?

> Nur das Experiment erlaubt **eindeutige Kausalschlüsse**

| Methode            | Kausalschluss möglich? | Grund                                     |
| ------------------ | ---------------------- | ----------------------------------------- |
| Beobachtung        | Nein                   | Keine Manipulation, keine Kontrolle       |
| Korrelationsstudie | Nein                   | Keine Manipulation                        |
| Quasi-Experiment   | Eingeschränkt          | Keine Randomisierung                      |
| **Experiment**     | Ja                     | Manipulation + Randomisierung + Kontrolle |

---

## Die 2 Kernmerkmale eines Experiments

```
1. Systematische VARIATION einer Variable (UV)
                    +
2. KONTROLLE von Störvariablen
                    =
      → Kausalschluss möglich
```

---

## Variablenarten im Experiment

### Die 3 Hauptvariablen

| Variable                 | Abk. | Rolle                           | Beispiel                     |
| ------------------------ | ---- | ------------------------------- | ---------------------------- |
| **Unabhängige Variable** | UV   | Wird manipuliert (Ursache)      | Medikament vs. Placebo       |
| **Abhängige Variable**   | AV   | Wird gemessen (Wirkung)         | Symptomstärke                |
| **Störvariable**         | SV   | Potenzielle Alternativerklärung | Alter, Geschlecht, Erwartung |

### Merkhilfe

```
UV ──────────────→ AV
(unabhängig)       (abhängig)
"Was ich ändere"   "Was ich messe"
     ↑
     │
    SV (was dazwischenfunken könnte)
```

### Beispiel

**Forschungsfrage:** Hilft Koffein bei der Konzentration?

| Variable | Konkret                              |
| -------- | ------------------------------------ |
| **UV**   | Koffein (ja/nein)                    |
| **AV**   | Anzahl gelöster Aufgaben             |
| **SV**   | Schlafmenge, Vorerfahrung, Tageszeit |

---

## Experimental- vs. Kontrollgruppe

| Gruppe                      | Behandlung                          | Funktion            |
| --------------------------- | ----------------------------------- | ------------------- |
| **Experimentalgruppe (EG)** | UV ist gegeben (z.B. Medikament)    | Zeigt Effekt der UV |
| **Kontrollgruppe (KG)**     | UV ist nicht gegeben (z.B. Placebo) | Vergleichsstandard  |

### Warum eine Kontrollgruppe?

```
Ohne Kontrollgruppe:
Medikament → Symptome ↓
           ?
Ist das der Medikamenteneffekt oder...
- natürliche Besserung über Zeit?
- Placeboeffekt?
- Regression zur Mitte?

Mit Kontrollgruppe:
EG (Medikament): Symptome ↓↓
KG (Placebo):    Symptome ↓
                 → Differenz = Medikamenteneffekt
```

---

## Studiendesigns

### Between-Subjects-Design

> Verschiedene Personen in verschiedenen Bedingungen

```
Stichprobe
    │
    ├──→ Gruppe A → Bedingung 1 → Messung
    │
    └──→ Gruppe B → Bedingung 2 → Messung
```

| Vorteile                  | Nachteile                   |
| ------------------------- | --------------------------- |
| Keine Übertragungseffekte | Mehr Versuchspersonen nötig |
| Keine Übung/Ermüdung      | Gruppendifferenzen möglich  |

### Within-Subjects-Design

> Dieselben Personen durchlaufen alle Bedingungen

```
Person A → Bedingung 1 → Bedingung 2 → ...
Person B → Bedingung 1 → Bedingung 2 → ...
```

| Vorteile                             | Nachteile                   |
| ------------------------------------ | --------------------------- |
| Weniger Versuchspersonen             | Übertragungseffekte möglich |
| Kontrolle individueller Unterschiede | Reihenfolgeeffekte          |
| Höhere statistische Power            | Nicht immer möglich         |

### Kontrolle von Reihenfolgeeffekten

**Counterbalancing:**

-   Gruppe 1: Bedingung A → B
-   Gruppe 2: Bedingung B → A

---

## Kontrolle von Störvariablen

### Übersicht der Methoden

| Methode              | Beschreibung                        | Beispiel                                          |
| -------------------- | ----------------------------------- | ------------------------------------------------- |
| **Konstanthaltung**  | Gleiche Bedingungen für alle        | Alle zur gleichen Tageszeit testen                |
| **Randomisierung**   | Zufällige Zuweisung zu Gruppen      | Per Münzwurf EG oder KG                           |
| **Balancierung**     | Gleiche Verteilung in allen Gruppen | 50% Männer in jeder Gruppe                        |
| **Parallelisierung** | Gezielte Zuweisung nach Merkmal     | Paare mit gleichem IQ auf beide Gruppen verteilen |

### Randomisierung - Das zentrale Element

> **Randomisierung ist DAS Kernmerkmal eines echten Experiments!**

**Warum so wichtig?**

```
Ohne Randomisierung:
- Nur bekannte Störvariablen können kontrolliert werden
- Unbekannte Störvariablen bleiben unkontrolliert

Mit Randomisierung:
- ALLE Störvariablen (bekannte UND unbekannte)
  verteilen sich zufällig auf die Gruppen
- Systematische Unterschiede werden unwahrscheinlich
```

---

## Quasi-Experiment

> Alle Kriterien erfüllt, ABER keine Randomisierung möglich

### Wann nötig?

| Situation                | Beispiel                |
| ------------------------ | ----------------------- |
| Ethisch nicht vertretbar | Rauchen verursachen     |
| Praktisch unmöglich      | Geschlecht manipulieren |
| Natürliche Gruppen       | Depressive vs. Gesunde  |

### Einschränkung

```
Quasi-Experiment
      ↓
Keine echte Randomisierung
      ↓
Gruppen könnten sich systematisch unterscheiden
      ↓
Kein eindeutiger Kausalschluss!
```

---

## Konfundierung

> Die größte Gefahr für den Kausalschluss

### Definition

**Konfundierung:** UV und Störvariable sind vermischt (variieren gemeinsam)

### Beispiel

```
Studie: "Kaffeetrinker sind produktiver"

UV: Kaffeekonsum
AV: Produktivität
SV: Nachteulen-Typ (trinken mehr Kaffee UND arbeiten länger)

→ Konfundierung! Ist es der Kaffee oder der Chronotyp?
```

### Vermeidung von Konfundierung

| Strategie              | Umsetzung               |
| ---------------------- | ----------------------- |
| Randomisierung         | Zufällige Zuweisung     |
| Konstanthaltung        | SV für alle gleich      |
| Matching               | Parallelisieren nach SV |
| Statistische Kontrolle | SV als Kovariate        |

---

## Interne vs. Externe Validität

| Validitätsart         | Frage                         | Erhöht durch                           | Trade-off         |
| --------------------- | ----------------------------- | -------------------------------------- | ----------------- |
| **Interne Validität** | Eindeutiger Kausalschluss?    | Kontrolle, Randomisierung, Labor       | Weniger natürlich |
| **Externe Validität** | Übertragbar auf "echte Welt"? | Repräsentative Stichprobe, Feldstudien | Weniger Kontrolle |

### Das Dilemma

```
Mehr Kontrolle (Labor)
    ↓
+ Höhere interne Validität
- Niedrigere externe Validität

Mehr Natürlichkeit (Feld)
    ↓
+ Höhere externe Validität
- Niedrigere interne Validität
```

---

## Prüfungsrelevanz

**Must-Know:**

-   2 Kernmerkmale des Experiments
-   UV, AV, SV mit Beispielen
-   EG vs. KG
-   Between vs. Within-Subjects
-   Randomisierung als zentrales Element
-   4 Methoden zur Kontrolle von Störvariablen
-   Quasi-Experiment (ohne Randomisierung)
-   Konfundierung
-   Interne vs. externe Validität

---

## Verknüpfungen

-   [[Methodenlehre]]
-   [[Theorien-und-Hypothesen]]
-   [[Operationalisierung]]
-   [[Deskriptive-Statistik]]
