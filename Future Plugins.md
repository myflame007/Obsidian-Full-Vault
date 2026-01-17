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

---

## Local AI Automation Plugin

### Inspiration
Basierend auf [time-garden](https://www.timegarden.app/) von Karlos Obsidian Tutorials - Ein lokales, offline-first AI System für Obsidian.

### Problem
- Manuelle Tag-Vergabe ist zeitaufwendig
- Wiederkehrende Textoperationen (Zusammenfassungen, Kategorisierung)
- Keine AI-Features ohne Cloud-Abhängigkeit und API-Kosten

### Idee
Ein Plugin mit lokaler AI (läuft on-device), das verschiedene Automatisierungen bietet - inspiriert von time-garden's Eternal tier.

### Core Features

#### 1. Automatische Tag-Vergabe
- Analysiert Notiz-Inhalt
- Schlägt relevante Tags basierend auf:
  - Bestehenden Tags im Vault
  - Inhaltlicher Analyse
  - Ähnlichen Notizen
- Optional: Automatische Anwendung oder User Approval

#### 2. Intelligente Kategorisierung
- Erkennt Themengebiete automatisch
- Ordnet Notizen in bestehende Category-Struktur ein
- Erstellt Category-Frontmatter automatisch

#### 3. Auto-Summaries
- Generiert Zusammenfassungen von langen Notizen
- Fügt Summary in Frontmatter ein
- Optional: Separate Summary-Section am Anfang

#### 4. Semantic Search / Q&A
- Beantwortet Fragen basierend auf Vault-Inhalt
- "Frag dein Vault" Feature
- Findet relevante Notizen zu Fragestellungen

#### 5. Content Enhancement
- Grammatik- und Stil-Verbesserungen
- Umformulierungs-Vorschläge
- Erweiterung von Stichpunkten zu Fließtext

#### 6. Relationship Detection
- Findet thematisch verwandte Notizen
- Schlägt Links zwischen Notizen vor
- Erstellt automatisch "Related Notes" Sections

### Technische Umsetzung

#### Local AI Options
1. **Ollama Integration**
   - Läuft lokal auf dem Gerät
   - Verschiedene Modelle (Llama, Mistral, etc.)
   - REST API für einfache Integration

2. **Transformers.js**
   - JavaScript-native ML Models
   - Läuft direkt im Browser/Electron
   - Kleinere Modelle, schnellere Antworten

3. **ONNX Runtime**
   - Cross-platform ML inference
   - Optimiert für Desktop-Performance

#### Privacy First
- **Keine Cloud:** Alle Daten bleiben lokal
- **Keine API Keys:** Kein OpenAI, Anthropic, etc. nötig
- **Offline-fähig:** Funktioniert ohne Internet
- **Dein Gerät:** AI läuft auf deiner Hardware

### Settings & Configuration

```typescript
interface LocalAISettings {
  // Model Selection
  modelProvider: 'ollama' | 'transformers' | 'onnx';
  modelName: string;

  // Auto-Tagging
  autoTagging: {
    enabled: boolean;
    autoApply: boolean; // vs. suggestion mode
    minConfidence: number; // 0-1
    maxTags: number;
  };

  // Categorization
  autoCategorize: {
    enabled: boolean;
    categoryField: string; // frontmatter field name
    autoCreate: boolean; // create category pages
  };

  // Summaries
  autoSummary: {
    enabled: boolean;
    minLength: number; // min words to trigger
    summaryLocation: 'frontmatter' | 'section';
  };

  // Performance
  maxConcurrentRequests: number;
  modelCaching: boolean;
}
```

### User Workflow Examples

#### Example 1: New Note Auto-Enhancement
1. User erstellt neue Notiz über "Behaviorismus in der Psychologie"
2. Plugin analysiert Inhalt
3. Schlägt Tags vor: `#psychologie`, `#behaviorismus`, `#lerntheorie`
4. Kategorisiert als: `categories: [Psychologie, Lerntheorien]`
5. User bestätigt oder passt an

#### Example 2: Semantic Vault Search
1. User fragt: "Was sind die Hauptunterschiede zwischen Behaviorismus und Kognitivismus?"
2. Plugin durchsucht Vault semantisch
3. Findet relevante Notizen
4. Generiert Antwort basierend auf Vault-Content
5. Verlinkt Quellnotizen

#### Example 3: Bulk Processing
1. User selektiert Ordner mit 50 alten Notizen
2. "Batch AI Enhancement" Command
3. Plugin processed alle Notizen:
   - Fügt Tags hinzu
   - Erstellt Summaries
   - Findet Related Notes
4. Progress Bar zeigt Status

### Proof of Concept Scope

**Phase 1: MVP (Minimal Viable Product)**
- [x] Ollama Integration Setup
- [ ] Basic Tag Suggestion (basierend auf Notiz-Inhalt)
- [ ] Einfache Settings UI
- [ ] Test mit 10-20 Notizen

**Phase 2: Core Features**
- [ ] Auto-Kategorisierung
- [ ] Summary Generation
- [ ] Batch Processing
- [ ] Performance Optimierung

**Phase 3: Advanced**
- [ ] Semantic Search / Q&A
- [ ] Relationship Detection
- [ ] Multiple Model Support
- [ ] Fine-tuning für Vault-spezifisches Vokabular

### Research & Resources

- [ ] time-garden GitHub Repository anschauen (falls verfügbar)
- [ ] Ollama API Documentation: https://github.com/ollama/ollama/blob/main/docs/api.md
- [ ] Transformers.js: https://huggingface.co/docs/transformers.js
- [ ] Obsidian AI-Plugins analysieren:
  - [ ] Text Generator Plugin
  - [ ] Smart Connections
  - [ ] Copilot Plugin
- [ ] ML Models evaluieren:
  - [ ] Llama 3.2 (3B) - klein, schnell
  - [ ] Mistral 7B - good balance
  - [ ] Gemma 2B - sehr leichtgewichtig

### Konkurrenzanalyse

**Bestehende Plugins:**
1. **Smart Connections** - Semantic search, aber cloud-basiert
2. **Text Generator** - GPT Integration, braucht API key
3. **Copilot** - OpenAI Integration

**Unser Unterschied:**
- Komplett lokal und privat
- Keine API Costs
- Offline-fähig
- Open Source Models

### Potential Challenges

1. **Performance:** AI models sind rechenintensiv
   - Lösung: Kleinere, optimierte Modelle
   - Lösung: Batch processing im Hintergrund

2. **Model Size:** Große Models brauchen viel Speicher
   - Lösung: Quantisierte Models (4-bit, 8-bit)
   - Lösung: Model downloading on-demand

3. **Accuracy:** Kleinere Models = weniger akkurat
   - Lösung: Multiple model options
   - Lösung: User feedback loop für Verbesserung

### Machbarkeit & Aufwand Einschätzung

#### Machbarkeit: ⭐⭐⭐⭐ (4/5 - Gut machbar)

**Warum machbar:**
- ✅ Ollama hat eine einfache REST API
- ✅ Obsidian Plugin API ist gut dokumentiert
- ✅ Kleinere Modelle (3B-7B) laufen auf modernem Laptop
- ✅ Viele Beispiel-Plugins als Referenz (Smart Connections, Text Generator)
- ✅ Keine komplexe Backend-Infrastruktur nötig

**Potentielle Herausforderungen:**
- ⚠️ Performance auf älteren Geräten
- ⚠️ Model-Download-Größe (2-4 GB pro Modell)
- ⚠️ Accuracy bei sehr kleinen Modellen

#### Aufwand Einschätzung

**Phase 1: MVP (Minimal Viable Product)**
**Aufwand: ~20-30 Stunden**
- Ollama Integration: 5-8h
- Basic Tag Suggestion: 8-12h
- Settings UI: 3-4h
- Testing & Debugging: 4-6h

**Technische Komplexität:** Mittel
- Ollama API calls sind einfach (REST)
- Obsidian Plugin API ist ok dokumentiert
- Größte Herausforderung: Gute Prompts für Tag-Suggestion

**Phase 2: Core Features**
**Aufwand: ~40-60 Stunden**
- Auto-Kategorisierung: 10-15h
- Summary Generation: 8-12h
- Batch Processing: 8-10h
- Performance Optimierung: 8-12h
- UI/UX Polish: 6-10h

**Phase 3: Advanced Features**
**Aufwand: ~60-80 Stunden**
- Semantic Search / Q&A: 20-25h (komplexeste Feature)
- Relationship Detection: 15-20h
- Multiple Model Support: 8-10h
- Fine-tuning: 15-20h (optional, advanced)

**Gesamt für Full Feature Plugin: ~120-170 Stunden**

#### Empfohlener Ansatz: Iterativ & MVP-First

**Woche 1-2: Research & Setup (5-10h)**
```
[ ] Ollama installieren und testen
[ ] Einfache API calls ausprobieren
[ ] Obsidian Plugin Boilerplate aufsetzen
[ ] Erste lokale Tests mit Llama 3.2 3B
```

**Woche 3-4: MVP - Tag Suggestion (15-20h)**
```
[ ] API Integration
[ ] Einfaches UI (Command + Modal)
[ ] Tag Suggestion für aktuelle Notiz
[ ] User approval workflow
[ ] Settings Tab
```

**Woche 5-6: User Testing (5-10h)**
```
[ ] Mit eigenem Vault testen
[ ] Feedback sammeln
[ ] Bugs fixen
[ ] Prompts optimieren
```

**Danach: Schrittweise weitere Features**

#### ROI (Return on Investment)

**Wert:**
- ⭐⭐⭐⭐⭐ Sehr hoch für persönlichen Use-Case
- Spart Zeit bei Tag-Vergabe
- Verbessert Vault-Organisation
- Komplett privat & kostenfrei
- Potentiell als Public Plugin veröffentlichbar

**Lerneffekt:**
- ⭐⭐⭐⭐⭐ Sehr hoch
- Lokale AI Integration
- Obsidian Plugin Development
- TypeScript/JavaScript
- UX für AI-Features

#### Empfehlung: ✅ GO FOR IT!

**Warum:**
1. **Machbar:** Technisch gut umsetzbar, keine Blocker
2. **Nützlich:** Löst echte Pain Points in deinem Workflow
3. **Lernreich:** Gute Erfahrung mit AI + Plugin Dev
4. **Skalierbar:** Start klein (MVP), dann erweitern

**Start-Tipp:**
Beginne mit dem absoluten Minimum:
- Ein Command: "Suggest Tags for Current Note"
- Nutzt Ollama mit Llama 3.2 3B
- Zeigt 3-5 Tag-Vorschläge in einem Modal
- User kann auswählen und einfügen

**Das ist in 1-2 Wochenenden machbar!**

### Next Steps

1. **Research Phase** (diese Woche)
   - YouTube Video von Karlos anschauen
   - time-garden vault analysieren (falls verfügbar)
   - Ollama lokal installieren und testen

2. **Prototype** (nächste Woche)
   - Einfaches Plugin-Setup
   - Ollama API Integration
   - Basic Tag Suggestion implementieren

3. **Testing** (danach)
   - Mit eigenem Vault testen
   - Performance messen
   - Accuracy evaluieren

---

## Plugin Redundancy Analysis

### Analyse der installierten Plugins

Basierend auf der aktuellen Plugin-Konfiguration:

#### Colored Tags Plugin

**Status:** Wahrscheinlich REDUNDANT

**Was es tut:**
- Färbt Tags in unterschiedlichen Farben ein
- Custom color palettes für Tag-Kategorien

**Wird es gebraucht?**
- **Nein, vermutlich nicht**, aus folgenden Gründen:
  1. **Obsidian Theme:** Dein Vicious Theme hat wahrscheinlich bereits Tag-Styling
  2. **Custom CSS:** Du hast bereits `vicious-custom.css` für Anpassungen
  3. **Overlap:** File Color Plugin + Icon Folder Plugin decken visuelle Organisation bereits ab
  4. **Complexity:** Noch ein weiteres Farbsystem macht es unübersichtlich

**Empfehlung:** Deaktivieren für 1 Woche und schauen, ob du es vermisst.

**Alternative:** Tag-Farben per Custom CSS Snippet definieren:
```css
.tag[href="#psychologie"] {
  background-color: #72b043;
  color: black;
}
```

---

#### Templater Plugin

**Status:** BEHALTEN (sehr nützlich)

**Was es tut:**
- Erstellt dynamische Templates mit JavaScript/Templating
- Datum-Funktionen, Variablen, Berechnungen in Templates

**Wird es gebraucht?**
- **JA, definitiv!** Templater ist eines der mächtigsten Plugins
- Du hast einen `Templates/` Ordner mit 61 Items
- Templates sind wahrscheinlich mit Templater-Syntax

**Was Templater besser kann als Core Templates:**
1. **Dynamische Logik:** if/else, loops, Berechnungen
2. **JavaScript:** Volle Programmierbarkeit
3. **Custom Functions:** Eigene Helper-Functions
4. **System Integration:** Dateisystem-Zugriff, Shell-Commands
5. **User Prompts:** Interaktive Template-Eingaben

**Beispiel-Usecases:**
```javascript
// Auto-generiere Wochennummer
<%* tp.file.creation_date("YYYY-[W]ww") %>

// Automatische Kategorien basierend auf Ordner
<%* tp.file.folder() %>

// Custom Berechnungen
<%*
  const today = moment();
  const semester = today.month() >= 9 ? "WS" : "SS";
%>
```

**Empfehlung:** DEFINITIV BEHALTEN! Templater ist essentiell für power users.

---

#### Weitere Plugins - Quick Assessment

**BEHALTEN (essentiell):**
- **obsidian-git:** Auto-backup, Version Control
- **omnisearch:** Bessere Suche als Core
- **obsidian-recall / obsidian-spaced-repetition:** Flashcard System (beide nötig?)
- **homepage:** Custom Dashboard
- **better-word-count:** Nützliche Stats
- **obsidian-icon-folder / obsidian-file-color:** Visuelle Organisation

**PRÜFEN (möglicherweise redundant):**
- **obsidian-recall + obsidian-spaced-repetition:** Zwei Flashcard-Plugins? Brauchst du beide?
- **file-explorer-note-count + file-explorer-plus:** Überschneidung möglich
- **recent-files-obsidian:** Obsidian core hat "Recent files" feature

**CUSTOM PLUGINS (entwickelt von dir):**
- **auto-categories:** Erstellt Category Pages automatisch
- **company-knowledge-hub:** Publishing System
- **customer-tag-sorter:** Sortiert nach Customer-Tag
- **better-gitignore:** Gitignore Management

→ Diese behalten, da sie deine spezifischen Workflows abdecken

---

### Recommendations Summary

**Zu deaktivieren/testen:**
1. **Colored Tags** - Wahrscheinlich redundant, per CSS lösbar
2. **Prüfe:** Brauchst du beide Flashcard-Plugins?

**Definitiv behalten:**
1. **Templater** - Sehr mächtig, nicht ersetzbar
2. **Git, Omnisearch, Homepage** - Core Workflow Tools
3. **Deine Custom Plugins** - Spezifische Workflows

**Faustregel:**
- Plugin behalten, wenn es aktiv genutzt wird
- Plugin deaktivieren für 1 Woche als Test
- Wenn nicht vermisst → löschen

---

## Recent Findings & Fixes

### CSS-Farbproblem: Categories unlesbar (2026-01-16)

**Problem:**
- Categories in Frontmatter waren unlesbar
- Text und Hintergrund in gleicher Farbe (rosa auf rosa)
- Nur beim Hover wurde Text weiß und lesbar

**Root Cause:**
- Vicious Theme "Vibrant Tags" Feature (theme.css:3236-3330)
- Setzt `.multi-select-pill` Textfarbe auf `var(--background-primary)`
- Verwendet nth-child Selektoren für verschiedene Hintergrundfarben
- Result: Text hat gleiche Farbe wie Hintergrund

**Lösung:**
- Custom CSS Override in `vicious-custom.css:92`
- Überschreibt Vibrant Tags mit spezifischeren Selektoren
- Schwarze Textfarbe (Normal), weiße Textfarbe (Hover)
- Remove-Button mit semi-transparentem Hintergrund für Sichtbarkeit

```css
/* Basis-Regel für alle Pills */
.multi-select-pill,
.multi-select-pill-remove-button {
	color: black !important;
}

/* Spezifischere Regeln für nth-child Selektoren */
.multi-select-pill:nth-child(n) {
	color: black !important;
}

/* Hover-State - Weiße Farbe */
.multi-select-pill:hover {
	color: white !important;
}
```

**Status:** ✅ Behoben

---

### Templater: Nicht aufgelöste Template-Syntax in Flashcards (2026-01-16)

**Problem:**
- Flashcard-Dateien enthielten nicht aufgelöste Templater-Syntax
- `<% tp.date.now("YYYY-MM-DD") %>` wurde nicht ersetzt
- `<% tp.file.title %>` blieb als Code stehen

**Root Cause:**
- Dateien wurden kopiert statt über Templater erstellt
- Templater verarbeitet nur bei Template-Insertion, nicht bei bestehenden Files

**Betroffene Dateien:**
- `Flashcards/Was ist Kognition.md`
- Wahrscheinlich weitere Flashcards

**Lösung:**
1. **Bestehende Dateien:** Manuell gefixed (created date eingefügt, Überschrift entfernt)
2. **Template verbessert:** `Templates/Recall Flashcard Template.md`
   - Entfernte unnötige `# <% tp.file.title %>` Überschrift
   - Frage nutzt direkt den Dateinamen mit `?`
   - Syntax: `Q: <% tp.file.title.replace(/\.md$/, '') %>?`

**Vorteile des neuen Formats:**
- Keine redundante Überschrift
- Dateiname wird direkt als Frage verwendet
- Automatisches `?` am Ende
- Cleaner, weniger Boilerplate

**Beispiel:**
```markdown
Dateiname: "Was ist Kognition.md"
↓
Q: Was ist Kognition?
A: [Antwort hier]
```

**Status:** ✅ Behoben

---

### Vicious Theme: "Vibrant Tags" Feature Analyse

**Was macht es:**
- Automatische Färbung von Tags und multi-select Pills
- 11 verschiedene Farben (--C001 bis --C011)
- Verwendet `:nth-child()` für Rotation durch Farbpalette
- Betrifft: Tags, Categories, Hashtags

**Problem:**
- Textfarbe hart auf `var(--background-primary)` gesetzt
- Funktioniert nicht mit allen Hintergrundfarben
- Keine Berücksichtigung von Kontrast/Lesbarkeit

**Lessons Learned:**
- Theme-Features können mit Custom Plugins kollidieren
- Custom CSS Snippets brauchen höhere Spezifität als Theme
- `!important` ist manchmal nötig, aber Spezifität ist besser
- nth-child Selektoren müssen explizit überschrieben werden

**Empfehlung:**
- Bei Custom Themes immer Snippet-Ordner nutzen für Overrides
- Dokumentieren welche Theme-Features man überschreibt
- CSS-Debugging: Browser DevTools nutzen um Spezifität zu prüfen

---

### Colored Tags Plugin - Finale Bewertung

**Nach Analyse:**
- **DEFINITIV REDUNDANT**
- Vicious Theme hat bereits "Vibrant Tags" Feature eingebaut
- Zwei konkurrierende Tag-Färbungssysteme = Probleme
- Colored Tags verursacht wahrscheinlich Konflikte

**Empfehlung:** DEINSTALLIEREN

**Begründung:**
1. Theme hat natives Tag-Coloring
2. Custom CSS kann genutzt werden für spezifische Farben
3. Reduziert Plugin-Overhead
4. Vermeidet CSS-Konflikte
5. Weniger Maintenance

**Alternative:** Wenn spezifische Tag-Farben gewünscht:
```css
/* In vicious-custom.css */
a.tag[href="#psychologie"],
.cm-hashtag-psychologie {
  background-color: #72b043 !important;
  color: black !important;
}
```

---

### Templater Plugin - Finale Bewertung

**Nach Analyse:** ⭐⭐⭐⭐⭐ ABSOLUT ESSENTIELL

**Konkrete Nutzung im Vault:**
- 61 Items im Templates-Ordner
- Aktiv genutzt für Flashcard-Erstellung
- Dynamische Datum-Generierung
- Dateinamen-Manipulation

**Power Features die du nutzen könntest:**
1. **System Commands:** Shell-Befehle aus Templates
2. **JavaScript Functions:** Custom Logic
3. **User Prompts:** Interaktive Template-Felder
4. **File Creation:** Automatische Datei-Generierung

**Best Practices für Templater:**
- `trigger_on_file_creation: true` für Auto-Templates
- `enable_folder_templates: true` für Ordner-spezifische Templates
- User Scripts Folder nutzen für wiederverwendbare Functions

**Beispiel Advanced Usage:**
```javascript
<%*
// Automatische Kategorie basierend auf Ordner
const folder = tp.file.folder();
const category = folder.split('/').pop();

// Vorhandene Tags im Vault finden
const tags = app.vault.getMarkdownFiles()
  .flatMap(f => app.metadataCache.getFileCache(f)?.tags || [])
  .map(t => t.tag);

// Suggest tags
const uniqueTags = [...new Set(tags)];
%>
```

**Status:** BEHALTEN & mehr nutzen!
