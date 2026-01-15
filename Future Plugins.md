# Future Plugins

Ideen für Obsidian Plugins, die ich entwickeln könnte.

---

## Trackpad Gesture Navigation

### Problem
- Mac Zwei-Finger-Swipe-Gesten funktionieren nicht in Obsidian (Electron-App)
- Standard macOS Navigation (vor/zurück) wird nicht unterstützt

### Idee
Ein Plugin, das Trackpad-Gesten erkennt und mit Obsidian-Aktionen verknüpft.

### Features
- **Zwei-Finger-Swipe links** → Navigate Back
- **Zwei-Finger-Swipe rechts** → Navigate Forward
- **Konfigurierbar:** Gesten mit verschiedenen Aktionen belegen
  - Navigation (vor/zurück)
  - Tabs wechseln
  - Sidebar toggle
  - Custom Commands

### Technische Überlegungen
- Electron unterstützt keine nativen Trackpad-Events direkt
- Mögliche Ansätze:
  - `wheel` Event mit `deltaX` für horizontales Scrollen abfangen
  - Native Node-Module für Gesture-Detection
  - Bestehende Lösung: Plugin "Swipe Navigation" als Referenz anschauen

### Recherche
- [ ] Swipe Navigation Plugin Code anschauen
- [ ] Electron Gesture APIs recherchieren
- [ ] Obsidian Plugin API für Navigation Commands prüfen
