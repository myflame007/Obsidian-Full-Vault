---
created: 2026-01-15
tags:
  - music-production
  - sae
  - course
categories:
  - "[[Music-Production]]"
lesson: "9"
---

## Master-Chain Setup

- **Reihenfolge:** Limiter am Master, danach Clipper
- Kick auf richtige LUFS bringen (Referenzwert prüfen)
- Master-Fader auf **0 dB** lassen
- Einzelne Spuren starten bei **-6 dB**, können Richtung 0 gehen
- Bei zu hoher Lautstärke: **Utility am Master** mit z.B. -9 dB verwenden
- **Tail-Out** hinzufügen für Hall/Reverb-Ausklingen
- Master-Lautstärke am Ende auf 0 automatisieren

## Farbcodierung der Spuren

| Farbe  | Instrument       |
| ------ | ---------------- |
| Blau   | Drums            |
| Rot    | Bass             |
| Grün   | Lead             |
| Orange | Vocals           |

## Sidechain-Routing nach Genre

- **Tech House:** Sidechain auf den Gruppen (Bus-Kompression)
- **Drum and Bass:** Zwei separate Sidechains nötig - einer auf Bass, einer auf Snare

## Referencing Setup

- Referenzen auf **External Out** routen (umgeht Master-Effekte)
- Main-Bus frei lassen für Metering-Plugins
- Input auf "In" stellen, Quelle von External und Spotify
- Ziel: ca. **-5 dB** (integrated LUFS) sollte erreichbar sein
  - Falls nicht: Einzelspuren anpassen

## Sidechain-Strategien

### Was wird sidechained?
- Alles mit Anschlägen (z.B. plucky Leads) prüfen, ob Sidechain mit Kick möglich
- Oft nicht möglich → **Rhythmus anpassen**
- **Vocals:** Oft sidechained mit kurzem Attack für Kick und Snare freistellen

### Kompressor-Einstellungen für Sidechain
- **Standard-Vorgehen:** Threshold weit runter, Ratio langsam anpassen
- Ab **10:1 Ratio** = praktisch ein Limiter
- Zerbrechliche Sounds → weniger Limiting
- Heavy/percussive Sounds → mehr Richtung Limiter

## Kompressor: Attack & Release verstehen

### Kurze Attack & Release
- Komprimiert den **Anfang** des Samples (z.B. Kick-Klick)

### Lange Attack & Release
- Kann Bass "aufblasen"
- Release länger als Sample-Länge einstellen
- Komprimiert den **hinteren Teil**, dann Output Gain erhöhen

### Einstellungen nach Anwendung

| Anwendung      | Attack   | Release      |
| -------------- | -------- | ------------ |
| Vocals         | ~50 ms   | 200-400 ms   |
| Nicht-Perc.    | ~50 ms   | ~200 ms      |
| Sound Design   | variabel | variabel     |

### Gain Reduction Richtwerte
- **Sound Design:** bis zu 10 dB möglich
- **Mixing:** weniger als 5 dB
- **Wichtig:** Gain Reduction ist aussagekräftig, nicht Threshold!

## Peak vs. RMS

- **Peak:** Standard für Kompressoren (reagiert auf Spitzen)
- **RMS:** Sonderfall, misst Durchschnittswert
  - *Anmerkung: RMS eignet sich besser für tonale Elemente wie Vocals oder Bass, Peak für Drums/Transients*

## A/B-Vergleich

- Plugin toggeln, damit vorher/nachher ca. gleich laut ist
- **Makeup Gain:** Automatische Gain-Erhöhung, funktioniert oft ungenau (basiert auf RMS)
- Besser: Manuell mit Output Gain oder Utility anpassen

## Clipper vs. Limiter

- **Clipper:** Vereinfachter Limiter
  - Attack & Release = 0
  - Unendliche Ratio (Hard Clipping)
- **Soft Clipping:** Sanftere Verzerrung
- **Hard Clipping:** Aggressivere Verzerrung

### Geschichte
- Kompressor wurde ursprünglich fürs **Radio** erfunden
- Begrenzte Auflösung erforderte Signalvereinfachung

## Spezifische Kompressoren

### Glue Compressor (Ableton)
- Emuliert SSL Bus-Kompressor
- Gut für "Glue" auf Gruppen

### FabFilter Pro-C
- Besseres Lookahead (nur PC/Mac, nicht iOS)
- Verhindert Verzerrungen besser
- **Auto-Release:** Eher für tonale Sachen, nicht für percussive

## Sidechain-Workflow (Detailliert)

### Grundsetup
1. Bass als Audio rendern
2. MIDI-Spur darüber behalten
3. Kick als Sidechain-Input auswählen
4. Mit extremen Einstellungen starten:
   - Threshold weit runter
   - Knee abdrehen
   - Attack & Release sehr kurz

### Feintuning
- Kick schlägt durch, aber verzerrt → Attack länger
- Kick-Anschlag soll durchschlagen → Attack kurz (~1 ms)
- **Lookahead:** ~10 ms

### Release-Einstellung
- Release = zusätzlich zur Kick-Länge
- **Sidechain-Filter:** Lowcut auf Eingangssignal
  - Kick klingt "kürzer" für den Kompressor
  - Kopfhörer-Symbol aktivieren um nur Sidechain-Signal zu hören

## Ghost Tracks

- Visuell weiß/grau markierte Spuren
- Dienen nur als Trigger, nicht hörbar
- Beispiel: Hi-Hat als kurzes Sample für präzise Release-Einstellung

### Ableton vs. Pro-C
- **Ableton Compressor:** Nur MIDI-Notenlänge anpassbar
- **Pro-C:** Hat **Hold-Parameter** für genauere Kontrolle

> **Idee:** Effect Rack bauen um Hold in Ableton nachzubilden?
> → Könnte mit Envelope Follower + Utility möglich sein

## Percussive Elemente sidechainen

- Auch Percussion mit Kick sidechainen
- Kick-Transient startet in höherem Frequenzbereich
- Kurze **Hold-Zeit** (~10 ms oder Transient-Länge)
- Kick wird mit allem sidechained, aber unterschiedlich lang

## Kreative Effekte

- **Reverb + Phaser** auf Lead → interessante Modulationseffekte
- **LFOs** können für Mapping verwendet werden (z.B. Filter, Panning)

## Workflow-Tipp

> Erst machen, dann ein- und ausblenden, um zu prüfen ob es wirklich nötig ist.

---

## Korrekturen & Ergänzungen

**Kleine Anmerkungen zu deinen Notizen:**

1. **LUFS-Zielwerte:** -5 dB integrated LUFS ist relativ laut für Streaming. Spotify normalisiert auf -14 LUFS, aber für Club-Tracks ist lauter durchaus üblich.

2. **Lookahead:** Funktioniert auf allen Plattformen (auch macOS), nicht nur PC. Vielleicht meintest du "nur Desktop, nicht mobile DAWs"?

3. **Hold-Parameter in Ableton:** Du kannst tatsächlich mit einem Audio Effect Rack + Envelope Follower + Utility einen Hold-Effekt nachbauen. Der Envelope Follower hat Rise/Fall-Parameter die ähnlich funktionieren.

4. **Peak vs. RMS:** Gute Erklärung! Ergänzung: Viele moderne Kompressoren bieten auch "True Peak" für Streaming-Kompatibilität.
