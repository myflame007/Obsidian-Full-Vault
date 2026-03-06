---
categories:
  - "[[Unsorted]]"
tags:
  - ai
  - prompt-engineering
  - what-if
created: 2026-03-06
updated: 2026-03-06
---
# Tipps zu AI usage

Diese Kontrollfrage ist hilfreich, wenn ein Ergebnis nicht überzeugt.

## Kerntrick: What-if Fragen
What-if Fragen sind ein starker Prompt-Trick, weil sie Alternativen, Trade-offs und blinde Flecken sichtbar machen.

Nutzen:
- öffnet neue Lösungsräume statt nur "besser machen"
- macht Annahmen explizit
- liefert schneller konkrete Verbesserungen

Beispiel-Fragen:
- "What if wir die UI nur für Mobile optimieren müssten?"
- "What if wir den Scope halbieren und nur den größten Hebel liefern?"
- "What if Accessibility (WCAG AA) Pflicht ist?"
- "What if der User komplett neu im Produkt ist?"
- "What if wir nur 2 Stunden für Verbesserungen hätten?"

## Qualitäts-Check für UI-Feedback
Wenn User meine UI hässlich finden, woran könnte das liegen?

Mögliche Ursachen:
- Zu wenig visuelle Hierarchie (alles wirkt gleich wichtig)
- Schwacher Kontrast oder unklare Farbpalette
- Inkonsistente Abstände, Schriftgrößen oder Komponentenstile
- Generisches Layout ohne klare gestalterische Richtung
- Schwache mobile Lesbarkeit und Bedienbarkeit

Gute Anschlussfragen an die KI:
- "Analysiere die UI wie ein Senior Product Designer und nenne die 5 größten Schwächen."
- "Gib mir konkrete Verbesserungen mit Priorität (High/Medium/Low)."
- "Schlage eine visuelle Richtung vor (Typografie, Farben, Layout, Motion)."
- "Nenne die kleinsten Änderungen mit der größten Wirkung."

## Prompt-Pattern (kurz)
1. Kontext geben (Zielgruppe, Produkt, Stil)
2. Artefakt anhängen (Screenshot oder Code)
3. Direkte Kritik erlauben ("sei konkret und kritisch")
4. What-if Variation hinzufügen
5. Ausgabeformat festlegen (Probleme, Begründung, nächste Schritte)

Merksatz:
Wenn die KI feststeckt, stelle eine What-if Frage.
