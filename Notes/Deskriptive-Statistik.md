---
Categories: Psychologie
tags:
    - methodenlehre
    - statistik
    - deskriptiv
source: "[[Psychologie_Literatur 3.pdf]]"
---

# Deskriptive Statistik

> Daten beschreiben und zusammenfassen

---

## Überblick

| Bereich              | Frage                           | Kennwerte                        |
| -------------------- | ------------------------------- | -------------------------------- |
| **Häufigkeiten**     | Wie oft kommt etwas vor?        | Absolut, relativ, prozentual     |
| **Zentrale Tendenz** | Was ist der "typische" Wert?    | Modalwert, Median, Mittelwert    |
| **Streuung**         | Wie stark variieren die Werte?  | IQA, Varianz, Standardabweichung |
| **Zusammenhang**     | Hängen zwei Variablen zusammen? | Kovarianz, Korrelation           |

---

## Häufigkeiten

### Arten von Häufigkeiten

| Art            | Symbol | Berechnung | Beispiel     |
| -------------- | ------ | ---------- | ------------ |
| **Absolut**    | f      | Anzählen   | 10 Personen  |
| **Relativ**    | p      | f / N      | 10/20 = 0,50 |
| **Prozentual** | %      | p × 100    | 50%          |

### Häufigkeitsverteilung

```
Häufigkeitstabelle:
Kategorie | Absolut | Relativ | Prozent
A         |   10    |   0,50  |   50%
B         |    6    |   0,30  |   30%
C         |    4    |   0,20  |   20%
Summe     |   20    |   1,00  |  100%
```

### Verteilungsformen

| Form               | Beschreibung                                |
| ------------------ | ------------------------------------------- |
| **Normalverteilt** | Symmetrisch, glockenförmig                  |
| **Rechtsschief**   | Langer "Schwanz" nach rechts, Häufung links |
| **Linksschief**    | Langer "Schwanz" nach links, Häufung rechts |

---

## Maße der zentralen Tendenz

### Übersicht

| Maß                       | Definition           | Symbol | Ab Skalenniveau |
| ------------------------- | -------------------- | ------ | --------------- |
| **Modalwert**             | Häufigster Wert      | Mo     | Nominal         |
| **Median**                | Mittlerer Wert (50%) | Md     | Ordinal         |
| **Arithmetisches Mittel** | Summe / Anzahl       | M, x̄   | Intervall       |

### Modalwert (Modus)

> Der Wert, der am häufigsten vorkommt

**Beispiel:** 1, 2, 2, 2, 3, 4, 5 → **Mo = 2**

-   Einziges Maß für Nominaldaten
-   Kann mehrere Modi haben (bimodal, multimodal)

### Median

> Der Wert, der die Verteilung in zwei gleiche Hälften teilt (50. Perzentil)

**Berechnung:**

1. Werte der Größe nach ordnen
2. Mittleren Wert finden

**Beispiel (ungerade Anzahl):** 1, 2, 3, **4**, 5, 6, 7 → **Md = 4**

**Beispiel (gerade Anzahl):** 1, 2, 3, 4, 5, 6 → **Md = (3+4)/2 = 3,5**

### Arithmetisches Mittel

> Die Summe aller Werte geteilt durch ihre Anzahl

$$M = \frac{\sum_{i=1}^{N} x_i}{N} = \frac{x_1 + x_2 + ... + x_N}{N}$$

**Beispiel:** Werte: 2, 4, 6, 8, 10
$$M = \frac{2+4+6+8+10}{5} = \frac{30}{5} = 6$$

### Vergleich: Wann welches Maß?

| Situation                          | Empfohlenes Maß | Grund                          |
| ---------------------------------- | --------------- | ------------------------------ |
| Nominaldaten                       | Modalwert       | Einzig mögliches               |
| Ordinaldaten                       | Median          | Abstände nicht interpretierbar |
| Metrische Daten (symmetrisch)      | Mittelwert      | Nutzt alle Information         |
| Metrische Daten (schief/Ausreißer) | **Median**      | Robust gegen Ausreißer         |

### Ausreißer-Empfindlichkeit

**Beispiel:** Gehälter in einer Firma

| Ohne Chef               | Mit Chef (1 Mio €)                 |
| ----------------------- | ---------------------------------- |
| 30k, 35k, 40k, 45k, 50k | 30k, 35k, 40k, 45k, 50k, **1000k** |
| M = 40k                 | M = 200k                           |
| Md = 40k                | Md = 42,5k                         |

> **Median ist robust gegen Ausreißer, Mittelwert nicht!**

---

## Maße der Streuung

### Übersicht

| Maß                            | Definition                     | Ab Skalenniveau |
| ------------------------------ | ------------------------------ | --------------- |
| **Spannweite**                 | Max - Min                      | Ordinal         |
| **Interquartilsabstand (IQA)** | Q3 - Q1                        | Ordinal         |
| **Varianz**                    | Mittlere quadrierte Abweichung | Intervall       |
| **Standardabweichung (SD)**    | Wurzel der Varianz             | Intervall       |

### Quartile und Interquartilsabstand

```
      25%      25%      25%      25%
  ├────────┼────────┼────────┼────────┤
 Min      Q1      Q2       Q3       Max
          │   (=Median)    │
          └───────────────┘
               IQA = Q3 - Q1
```

**IQA:** Bereich der mittleren 50% der Werte

### Varianz

> Die mittlere quadrierte Abweichung vom Mittelwert

$$Var = \frac{\sum_{i=1}^{N}(x_i - M)^2}{N}$$

**Schritt für Schritt:**

1. Mittelwert berechnen
2. Abweichungen vom Mittelwert berechnen
3. Abweichungen quadrieren
4. Summe der Quadrate bilden
5. Durch N teilen

**Beispiel:** Werte: 2, 4, 6

| Wert    | Abweichung (x-M) | Quadrat      |
| ------- | ---------------- | ------------ |
| 2       | 2-4 = -2         | 4            |
| 4       | 4-4 = 0          | 0            |
| 6       | 6-4 = 2          | 4            |
| **M=4** | Summe: 0         | **Summe: 8** |

$$Var = \frac{8}{3} = 2,67$$

### Standardabweichung

> Die Wurzel der Varianz - in der Originaleinheit

$$SD = \sqrt{Var}$$

**Beispiel:** $$SD = \sqrt{2,67} ≈ 1,63$$

### Warum Quadrieren?

| Problem                                  | Lösung durch Quadrieren           |
| ---------------------------------------- | --------------------------------- |
| Negative Abweichungen heben sich auf     | Werden positiv                    |
| Große Abweichungen sollen stärker wiegen | Werden überproportional gewichtet |

---

## Zusammenhangsmaße

### Kovarianz

> Maß für den gemeinsamen Variationsanteil zweier Variablen

$$Cov(x,y) = \frac{\sum_{i=1}^{N}(x_i - M_x) \cdot (y_i - M_y)}{N}$$

**Problem:** Kovarianz ist nicht standardisiert (abhängig von Einheiten)

### Korrelationskoeffizient (Pearson's r)

> Standardisiertes Maß für den linearen Zusammenhang

$$r = \frac{Cov(x,y)}{SD_x \cdot SD_y}$$

### Eigenschaften von r

| Eigenschaft       | Wert      |
| ----------------- | --------- |
| Wertebereich      | -1 bis +1 |
| Kein Zusammenhang | r = 0     |
| Perfekt positiv   | r = +1    |
| Perfekt negativ   | r = -1    |

### Interpretation von r

| r-Wert    | Interpretation        |
| --------- | --------------------- |
| 0,0 - 0,1 | Kein/vernachlässigbar |
| 0,1 - 0,3 | Schwach               |
| 0,3 - 0,5 | Mittel                |
| 0,5 - 0,7 | Stark                 |
| > 0,7     | Sehr stark            |

### Wichtige Einschränkung

> **r misst nur LINEARE Zusammenhänge!**

Kurvilinearer Zusammenhang kann r ≈ 0 ergeben, obwohl starker Zusammenhang
besteht!

---

## Übersicht: Kennwerte nach Skalenniveau

| Skalenniveau   | Zentrale Tendenz | Streuung        | Zusammenhang    |
| -------------- | ---------------- | --------------- | --------------- |
| **Nominal**    | Modalwert        | -               | Kontingenz      |
| **Ordinal**    | Median           | IQA, Spannweite | Rangkorrelation |
| **Intervall**  | Mittelwert       | Varianz, SD     | Pearson r       |
| **Verhältnis** | Mittelwert       | Varianz, SD     | Pearson r       |

---

## Prüfungsrelevanz

**Must-Know:**

-   Absolute, relative, prozentuale Häufigkeit
-   Modalwert, Median, Mittelwert - wann welches?
-   Mittelwert vs. Median bei Ausreißern
-   Varianz und Standardabweichung (Formeln!)
-   Korrelationskoeffizient r (Wertebereich, Interpretation)
-   r misst nur lineare Zusammenhänge
-   Korrelation ≠ Kausalität

---

## Verknüpfungen

-   [[Methodenlehre]]
-   [[Operationalisierung]]
-   [[Theorien-und-Hypothesen]]
