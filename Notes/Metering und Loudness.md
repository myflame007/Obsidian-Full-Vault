---
categories:
  - "[[Music-Production]]"
created: 2026-01-15
tags:
  - music-production
  - course
  - sae
lesson: 7
---

## Best Practice: Gain Staging

- Beim **Reinziehen eines Samples** gleich das **Gain anpassen**
- Konsistente Pegel von Anfang an = besserer Mix später

---

## Meter verstehen

### Gain Regler / Meter
- **Durchschnittswert**: Der nicht-transparente Teil (gefüllter Bereich)
- **Spitzenwert (Peak)**: Der Ausschlag ganz oben

### RMS (Root Mean Square)
- **Durchschnittswert** der Lautstärke
- Standardisiert über **300ms** Zeitfenster
- Entspricht eher dem wahrgenommenen Lautstärkeeindruck als Peak

---

## EQ 8 Tilt

| Einstellung | Beschreibung |
|-------------|--------------|
| Tilt = 0 | Flach, keine Anpassung |
| Tilt = 4.5 | Entspricht mehr dem **menschlichen Gehör** (Fletcher-Munson-Kurve) |

→ Tilt 4.5 als Standard für natürlicheres Hören beim Mischen

---

## LUFS (Loudness Units Full Scale)

- **Relativ neue Einheit** für wahrgenommene Lautstärke
- 1 Loudness Unit = 1 dB
- Misst die **gehörte Lautstärke**, nicht nur den technischen Pegel
- Berücksichtigt Frequenzgewichtung (tiefe Frequenzen werden anders bewertet)

### Streaming Normalization

| Plattform | Ziel-Loudness |
|-----------|---------------|
| Spotify | **-14 LUFS** |
| Apple Music | -16 LUFS |
| YouTube | -14 LUFS |

**Was passiert bei Spotify:**
- Song zu laut → wird leiser gemacht
- Song zu leise → wird lauter gemacht + **Limiter** drauf (um Übersteuerung zu vermeiden)

→ Lieber selbst auf -14 LUFS mastern als Spotify den Limiter machen lassen

---

## Youlean Loudness Meter

Kostenloses Plugin für Loudness-Messung.

### Werte im Überblick

| Messung | Zielbereich | Wann schauen? |
|---------|-------------|---------------|
| **Integrated LUFS** | -5 bis -9 LUFS | Einmal zum Schluss (Gesamtloudness) |
| **Short-term LUFS** | variabel | Während des Mixens (aktuelle Lautstärke) |

- **Integrated**: Durchschnitt über gesamten Track
- **Short-term**: Gleitender Durchschnitt über ~3 Sekunden

---

## Correlation Meter

- **Multi-Band Correlation Meter / Correlometer**
- Zeigt Phasenbeziehung zwischen L/R Kanal
- **+1** = Mono-kompatibel (identisch L/R)
- **0** = Komplett unterschiedlich (breites Stereo)
- **-1** = Phasenauslöschung (Problem!)

→ Bass sollte immer nahe +1 sein (mono-kompatibel)
