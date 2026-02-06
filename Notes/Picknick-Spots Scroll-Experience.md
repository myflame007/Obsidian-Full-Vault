---
categories:
  - "[[Buchart58]]"
tags:
  - Feature
created: 2026-02-05
---
  

> **Status:** Bereit zur Implementierung

> **Priorität:** TBD

> **Erstellt:** 2026-02-03

> **Ziel-Seite:** `/erlebnisse/picknick` (neue Seite)

  

---

  

## Finale Technologie-Entscheidungen

  

| Komponente | Entscheidung | Begründung |

|------------|--------------|------------|

| **Karte** | Mapbox GL JS | Beste 3D-Kontrolle, eingebaute flyTo(), kostenloser Tier (50k loads/Monat) |

| **360° Viewer** | Pannellum | Leichtgewichtig (21KB), Touch/Gyroscope-Support, einfache API |

| **Scroll-Animation** | GSAP ScrollTrigger | Industriestandard, präzise Snap-Points, perfekte Mapbox-Integration |

| **Übergangs-Stil** | Fade (Karte → Panorama) | Robuster als 3D-Zoom, sieht elegant aus, weniger komplex |

| **360°-Kamera** | Insta360 | Equirectangular-Format (2:1), direkt kompatibel mit Pannellum |

| **Asset-Hosting** | Cloudflare R2 | Günstig, schnell, keine Egress-Kosten |

  

### Mapbox Pricing (Info)

- **Kostenloser Tier:** 50.000 Map Loads/Monat

- **Danach:** $5 pro 1.000 Loads

- Für Entwicklung und moderate Nutzung mehr als ausreichend

- Account erstellen: https://account.mapbox.com/auth/signup/

  

---

  

## 1. Übersicht

  

### Was ist das Feature?

  

Eine immersive, scroll-gesteuerte virtuelle Tour durch die Weingärten des Weinguts. Der Nutzer "wandert" entlang einer Picknick-Route und entdeckt dabei mehrere Spots, an denen er später mit einem Picknickkorb rasten kann.

  

### Geschäftlicher Kontext

  

Das Weingut bietet ein Picknick-Erlebnis an:

1. Kunde holt einen vorbereiteten Picknickkorb ab

2. Kunde fährt zu einem der markierten Spots in den Weingärten

3. Kunde genießt Wein und lokale Spezialitäten mit Aussicht

  

Diese Seite soll das Erlebnis "verkaufen", indem sie die Schönheit der Spots visuell erlebbar macht.

  

---

  

## 2. User Journey (Schritt für Schritt)

  

### Desktop-Erlebnis

  

```

1. EINSTIEG

└── Fullscreen-Ansicht öffnet sich

└── Satellitenkarte zeigt das gesamte Weingut-Areal

└── Route ist als Pfad eingezeichnet

└── 3-5 Spots sind als Marker sichtbar

└── Hinweis: "Scrolle um die Tour zu starten" + "ESC zum Verlassen"

  

2. SCROLL-START

└── Kamera beginnt der Route zu folgen

└── Sanfte Bewegung entlang des Pfades

└── Aktueller Fortschritt wird visualisiert (z.B. Punkt auf der Route)

  

3. SPOT 1 ERREICHT (Scroll-Snap)

└── Kamera zoomt auf den ersten Spot

└── Eleganter Fade-Übergang: Satellitenkarte blendet aus → 360°-Panorama blendet ein

└── Info-Overlay erscheint mit:

- Titel (z.B. "Aussichtspunkt Sonnenhang")

- Beschreibung

- Was man sehen kann

- Beste Tageszeit

- Praktische Infos (Schatten, Tisch, etc.)

- [JETZT BUCHEN] Button

  

4. WEITER-SCROLLEN

└── Overlay verschwindet

└── 360°-Panorama → Zoom-Out → Satellitenkarte

└── Kamera folgt weiter der Route

  

5. SPOT 2, 3, ... (wiederholt sich)

  

6. ENDE DER TOUR

└── Finaler CTA-Bereich

└── Zusammenfassung aller Spots

└── Buchungsmöglichkeit

└── Kontakt für Fragen

```

  

### Mobile-Erlebnis (Vereinfacht)

  

```

1. EINSTIEG

└── Übersichtskarte mit allen Spots

└── Hinweis: "Für das volle Erlebnis am Desktop besuchen"

  

2. INTERAKTION

└── Swipe links/rechts zwischen Spots

└── Oder: Tap auf Spot → 360°-Panorama öffnet sich

└── Gyroscope-Steuerung für 360°-Ansicht (falls verfügbar)

  

3. INFO & BUCHUNG

└── Info-Overlay wie Desktop

└── [JETZT BUCHEN] Button

```

  

---

  

## 3. Technologie-Optionen

  

### 3.1 Karten-Bibliothek

  

| Option | Vorteile | Nachteile | Empfehlung |

|--------|----------|-----------|------------|

| **Google Maps JS API** | Beste Satellitenbilder, bekannte UX | Teuer bei vielen Aufrufen, eingeschränkte 3D-Kontrolle, schwer mit Three.js zu kombinieren | ⚠️ Möglich, aber komplex |

| **Mapbox GL JS** | Exzellente 3D-Unterstützung, Custom Styling, günstiger, `flyTo()` Animation eingebaut | Satellitenbilder etwas weniger detailliert | ✅ **Empfohlen** |

| **CesiumJS** | Echte 3D-Globus, Terrain, Fluganimationen | Overkill für diesen Use Case, schwer, komplex | ❌ Zu viel |

| **Statische Karte + Three.js** | Volle Kontrolle, keine API-Kosten | Keine echte Interaktivität, vorgerendert | 🔄 Fallback-Option |

  

**Empfehlung:** **Mapbox GL JS**

- Hat eingebaute `flyTo()`, `easeTo()` Methoden für Kameraanimationen

- Unterstützt 3D-Terrain-Rendering

- Kann Scroll-Events direkt verarbeiten

- Bessere Integration als Google Maps mit Custom-Animationen

  

### 3.2 360°-Panorama-Viewer

  

| Option | Vorteile | Nachteile | Empfehlung |

|--------|----------|-----------|------------|

| **Pannellum** | Leichtgewichtig (21KB), spezialisiert, gut dokumentiert | Weniger Features | ✅ **Empfohlen für V1** |

| **Photo Sphere Viewer** | Mehr Features, Plugin-System, Marker-Support | Größer (150KB+) | 🔄 Für V2 |

| **Three.js Sphere** | Volle Kontrolle, nahtloser Übergang zur Karte | Mehr Entwicklungsaufwand | 🔄 Wenn nötig |

| **A-Frame** | WebVR-ready, einfache Syntax | Overhead wenn kein VR benötigt | ❌ Overkill |

  

**Empfehlung:** **Pannellum** für V1

- Einfache API: `pannellum.viewer('container', {panorama: 'image.jpg'})`

- Hotspot-Support für interaktive Elemente

- Autorotate-Feature

- Touch & Gyroscope Support für Mobile

  

### 3.3 Scroll-Animation & Steuerung

  

| Option | Vorteile | Nachteile | Empfehlung |

|--------|----------|-----------|------------|

| **GSAP ScrollTrigger** | Industriestandard, robust, präzise Kontrolle, Snap-Support | Zusätzliche Dependency (aber klein) | ✅ **Empfohlen** |

| **Framer Motion + useScroll** | Bereits im Projekt, React-native | Weniger Features für komplexe Scroll-Szenarien | 🔄 Möglich |

| **Native Scroll Snap CSS** | Keine JS-Dependency | Wenig Kontrolle über Animation | ❌ Zu eingeschränkt |

| **Locomotive Scroll** | Smooth Scrolling | Kann Accessibility-Probleme verursachen | ❌ Nicht empfohlen |

  

**Empfehlung:** **GSAP ScrollTrigger**

- Perfekte Integration mit Mapbox

- Präzise Kontrolle über Scroll-Position → Kamera-Position

- Snap-Points eingebaut

- Scrub-Feature für frame-genaue Animationen

  

### 3.4 Performance-Detection

  

```typescript

// Beispiel-Implementierung

interface DeviceCapabilities {

webgl: boolean;

webgl2: boolean;

cpuCores: number;

memory: number | null; // GB, nur in Chrome

connectionType: string | null;

saveData: boolean;

}

  

function detectCapabilities(): DeviceCapabilities {

const canvas = document.createElement('canvas');

const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

  

return {

webgl: !!canvas.getContext('webgl'),

webgl2: !!canvas.getContext('webgl2'),

cpuCores: navigator.hardwareConcurrency || 2,

memory: (navigator as any).deviceMemory || null,

connectionType: (navigator as any).connection?.effectiveType || null,

saveData: (navigator as any).connection?.saveData || false,

};

}

  

function shouldUseFullExperience(caps: DeviceCapabilities): boolean {

// Volle Experience wenn:

// - WebGL2 verfügbar

// - Mindestens 4 CPU-Cores

// - Kein "Save Data" Modus

// - Nicht auf 2G/3G

return (

caps.webgl2 &&

caps.cpuCores >= 4 &&

!caps.saveData &&

!['slow-2g', '2g', '3g'].includes(caps.connectionType || '')

);

}

```

  

---

  

## 4. Datenstruktur

  

### 4.1 GeoJSON für Route

  

```json

{

"type": "FeatureCollection",

"features": [

{

"type": "Feature",

"geometry": {

"type": "LineString",

"coordinates": [

[16.1234, 48.5678],

[16.1240, 48.5680],

...

]

},

"properties": {

"name": "Picknick-Wanderweg",

"totalLength": "2.5km",

"estimatedTime": "45min"

}

}

]

}

```

  

### 4.2 Spot-Daten (TypeScript Interface)

  

```typescript

interface PicknickSpot {

id: string;

  

// Geolocation

coordinates: {

lng: number;

lat: number;

};

  

// Inhalte

title: string;

subtitle?: string;

description: string;

highlights: string[]; // Was man sehen kann

bestTime: string; // z.B. "Nachmittag für Sonnenuntergang"

  

// Praktische Infos

amenities: {

hasTable: boolean;

hasShade: boolean;

hasWaterNearby: boolean;

accessibleByCar: boolean;

walkingDistance: string; // z.B. "10min vom Parkplatz"

};

  

// Medien

panoramaUrl: string; // 360°-Foto (equirectangular)

thumbnailUrl: string; // Vorschaubild für Mobile/Liste

  

// Buchung

bookingUrl?: string;

  

// Animation

cameraConfig: {

zoomLevel: number;

pitch: number;

bearing: number;

};

}

```

  

### 4.3 Beispiel-Spot

  

```typescript

const spot1: PicknickSpot = {

id: "sonnenhang",

coordinates: { lng: 16.1234, lat: 48.5678 },

title: "Aussichtspunkt Sonnenhang",

subtitle: "Der Klassiker mit Weitblick",

description: "Unser beliebtester Spot bietet einen atemberaubenden Blick über die Weinberge bis hin zum Neusiedler See. An klaren Tagen sieht man bis nach Ungarn.",

highlights: [

"Panoramablick über die Weinberge",

"Neusiedler See am Horizont",

"Sonnenuntergang direkt vor Ihnen"

],

bestTime: "Spätnachmittag für den perfekten Sonnenuntergang",

amenities: {

hasTable: true,

hasShade: false,

hasWaterNearby: false,

accessibleByCar: true,

walkingDistance: "Direkt am Parkplatz"

},

panoramaUrl: "/images/panoramas/sonnenhang-360.jpg",

thumbnailUrl: "/images/spots/sonnenhang-thumb.jpg",

cameraConfig: {

zoomLevel: 18,

pitch: 60,

bearing: 45

}

};

```

  

---

  

## 5. UI/UX Details

  

### 5.1 Info-Overlay Design

  

```

┌─────────────────────────────────────────────────────┐

│ [360° Panorama] │

│ │

│ ┌───────────────────────────────────────────────┐ │

│ │ AUSSICHTSPUNKT SONNENHANG │ │

│ │ Der Klassiker mit Weitblick │ │

│ │ │ │

│ │ Unser beliebtester Spot bietet einen... │ │

│ │ │ │

│ │ ✓ Panoramablick über die Weinberge │ │

│ │ ✓ Neusiedler See am Horizont │ │

│ │ ✓ Sonnenuntergang direkt vor Ihnen │ │

│ │ │ │

│ │ ☀️ Beste Zeit: Spätnachmittag │ │

│ │ 🅿️ Direkt am Parkplatz │ │

│ │ 🪑 Tisch vorhanden │ │

│ │ │ │

│ │ ┌─────────────────────────────────────────┐ │ │

│ │ │ PICKNICK BUCHEN │ │ │

│ │ └─────────────────────────────────────────┘ │ │

│ └───────────────────────────────────────────────┘ │

│ │

│ ↓ Weiter scrollen für nächsten Spot │

└─────────────────────────────────────────────────────┘

```

  

### 5.2 Overlay-Positionierung

  

- **Desktop:** Rechte Seite, ca. 400px breit, 80% Höhe, glassmorphism

- **Mobile:** Bottom Sheet, swipeable

  

### 5.3 Navigation-Elemente

  

- **Oben links:** Zurück-Button (← oder X)

- **Oben rechts:** Spot-Counter (z.B. "2/5")

- **Unten:** Progress-Bar oder Dot-Navigation

- **Keyboard:** ESC zum Verlassen, Pfeiltasten für Spots

  

---

  

## 6. Technische Architektur

  

### 6.1 Komponenten-Struktur

  

```

src/

├── components/

│ └── picknick/

│ ├── PicknickExperience.tsx # Haupt-Container

│ ├── MapView.tsx # Mapbox-Integration

│ ├── PanoramaView.tsx # Pannellum-Wrapper

│ ├── SpotOverlay.tsx # Info-Overlay

│ ├── ProgressIndicator.tsx # Fortschrittsanzeige

│ ├── MobileSpotCarousel.tsx # Mobile Swipe-Version

│ └── ExperienceLoader.tsx # Loading & Capability Check

├── data/

│ └── picknick-spots.ts # Spot-Daten

├── hooks/

│ └── useDeviceCapabilities.ts # Performance-Detection

└── pages/

└── erlebnisse/

└── picknick.astro # Seite

```

  

### 6.2 State Management

  

```typescript

// Nanostores für globalen State

import { atom, computed } from 'nanostores';

  

export const $currentSpotIndex = atom<number>(-1); // -1 = Übersicht

export const $isTransitioning = atom<boolean>(false);

export const $viewMode = atom<'map' | 'panorama'>('map');

export const $scrollProgress = atom<number>(0); // 0-1

  

export const $currentSpot = computed(

$currentSpotIndex,

(index) => index >= 0 ? spots[index] : null

);

```

  

### 6.3 Scroll → Kamera Mapping

  

```typescript

// Pseudo-Code für Scroll-zu-Kamera-Mapping

const scrollSections = [

{ start: 0, end: 0.15, type: 'overview' },

{ start: 0.15, end: 0.20, type: 'transition-to-spot', spotIndex: 0 },

{ start: 0.20, end: 0.35, type: 'spot', spotIndex: 0 },

{ start: 0.35, end: 0.40, type: 'transition-to-route' },

{ start: 0.40, end: 0.45, type: 'route-segment', from: 0, to: 1 },

{ start: 0.45, end: 0.50, type: 'transition-to-spot', spotIndex: 1 },

// ... usw.

];

  

function handleScroll(progress: number) {

const section = scrollSections.find(s =>

progress >= s.start && progress < s.end

);

  

switch (section.type) {

case 'overview':

showFullMap();

break;

case 'transition-to-spot':

const localProgress = (progress - section.start) / (section.end - section.start);

zoomToSpot(section.spotIndex, localProgress);

break;

case 'spot':

showPanorama(section.spotIndex);

break;

// ...

}

}

```

  

---

  

## 7. Performance-Strategie

  

### 7.1 Lazy Loading

  

- Panorama-Bilder erst laden wenn Spot fast erreicht

- Mapbox nur laden wenn WebGL verfügbar

- Mobile: Nur Thumbnails initial, 360° on-demand

  

### 7.2 Preloading

  

```typescript

// Nächstes Panorama vorladen wenn aktueller Spot angezeigt wird

useEffect(() => {

if (currentSpotIndex >= 0 && currentSpotIndex < spots.length - 1) {

const nextPanorama = new Image();

nextPanorama.src = spots[currentSpotIndex + 1].panoramaUrl;

}

}, [currentSpotIndex]);

```

  

### 7.3 Fallback-Stufen

  

1. **Volle Experience:** Mapbox + GSAP + Pannellum

2. **Reduzierte Experience:** Statische Karte + Fade-Übergänge + Pannellum

3. **Minimale Experience:** Bildergalerie mit Spot-Infos (kein 3D)

  

---

  

## 8. Mobile-Strategie

  

### 8.1 Erkennung

  

```typescript

const isMobile = () => {

return window.innerWidth < 768 ||

'ontouchstart' in window ||

navigator.maxTouchPoints > 0;

};

```

  

### 8.2 Mobile-spezifische Features

  

- **Swipe-Navigation** zwischen Spots

- **Gyroscope-Steuerung** für 360°-Ansicht

- **Bottom Sheet** statt Side Overlay

- **Reduzierte Animationen** für Akku-Schonung

  

### 8.3 Hinweis-Banner

  

```tsx

const DesktopHint = () => (

<div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm">

Für das volle interaktive Erlebnis besuche uns am Desktop

<button onClick={dismiss}>×</button>

</div>

);

```

  

---

  

## 9. Roadmap

  

### V1 (MVP)

  

- [ ] 3 Spots hardcoded

- [ ] Mapbox GL JS Integration

- [ ] GSAP ScrollTrigger für Scroll-Steuerung

- [ ] Pannellum für 360°-Panoramen

- [ ] Desktop-fokussiert

- [ ] Einfache Mobile-Version (Swipe-Galerie)

- [ ] Buchungs-Button pro Spot

  

### V2

  

- [ ] 4-5 Spots

- [ ] Verbesserter Übergang Karte → Panorama

- [ ] Fortschrittsanzeige

- [ ] Keyboard-Navigation

- [ ] Performance-Optimierungen

  

### V3 (CMS-Integration)

  

- [ ] Admin-Interface zum Hinzufügen/Bearbeiten von Spots

- [ ] Upload von 360°-Fotos

- [ ] Route-Editor auf der Karte

- [ ] Vorschau-Funktion

  

---

  

## 10. Technologie-Details (Finalisiert)

  

### Mapbox GL JS

  

```bash

bun add mapbox-gl

bun add -D @types/mapbox-gl

```

  

- Access Token wird benötigt (kostenlos erstellen)

- Satellite-v9 Style für Satellitenbilder

- `flyTo()` und `easeTo()` für Kamera-Animationen

  

### GSAP ScrollTrigger

  

```bash

bun add gsap

```

  

- ScrollTrigger ist Teil von GSAP (kostenlos für die meisten Anwendungen)

- Snap-Feature für Scroll-Punkte

- Scrub für frame-genaue Animationen

  

### Pannellum

  

```bash

bun add pannellum

```

  

- Oder via CDN für einfacheres Setup

- Equirectangular-Bilder (2:1 Seitenverhältnis)

- Insta360 exportiert direkt in diesem Format

  

### Cloudflare R2 (Asset-Hosting)

  

- Bucket erstellen für Panorama-Bilder

- Public Access aktivieren oder Signed URLs

- Empfohlene Bildgrößen:

- **Full:** 8192x4096px (für Desktop, ~5-10MB)

- **Mobile:** 4096x2048px (für Mobile, ~2-4MB)

- **Thumbnail:** 800x400px (für Vorschau, ~50KB)

  

---

  

## 11. Ressourcen & Referenzen

  

### Ähnliche Implementierungen

  

- [Airbnb Experiences Map](https://www.airbnb.com/experiences) – Karten-Integration

- [Google Earth Voyager](https://earth.google.com/web/) – Storytelling mit Karten

- [Patagonia Worn Wear](https://wornwear.patagonia.com/) – Scroll-basierte Storytelling

  

### Technische Dokumentation

  

- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/)

- [Mapbox flyTo Animation](https://docs.mapbox.com/mapbox-gl-js/example/flyto/)

- [Pannellum Docs](https://pannellum.org/documentation/overview/)

- [GSAP ScrollTrigger](https://greensock.com/scrolltrigger/)

  

### Tutorials

  

- [Scroll-driven animations with Mapbox](https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/)

- [Building a story map](https://docs.mapbox.com/help/tutorials/building-a-store-locator/)

  

---

  

## 12. Umsetzbarkeits-Einschätzung

  

### Komplexität: HOCH ⚠️

  

Dieses Feature kombiniert mehrere komplexe Technologien:

1. WebGL-basierte Kartenrendering (Mapbox)

2. Scroll-Hijacking mit präziser Animation (GSAP)

3. 360°-Panorama-Rendering (Pannellum/WebGL)

4. Übergänge zwischen zwei verschiedenen WebGL-Kontexten

5. Responsive Design mit komplett unterschiedlicher Mobile-UX

6. Performance-Detection und Fallbacks

  

### Geschätzter Aufwand

  

| Phase | Beschreibung | Komplexität |

|-------|--------------|-------------|

| Setup | Dependencies, Mapbox Account, Basis-Struktur | Niedrig |

| Karten-Integration | Mapbox einbinden, Route + Marker anzeigen | Mittel |

| Scroll-Animation | GSAP ScrollTrigger, Kamera-Steuerung | Mittel-Hoch |

| 360°-Integration | Pannellum einbinden, Übergänge | Hoch |

| Info-Overlay | UI-Komponenten, Animationen | Mittel |

| Mobile-Version | Swipe-Galerie, Bottom Sheet | Mittel |

| Performance | Lazy Loading, Fallbacks, Testing | Mittel |

| Polish | Feinschliff, Edge Cases, Bugs | Mittel |

  

### Risiken

  

1. **Übergangs-Animation Karte→Panorama** – Technisch anspruchsvoll, möglicherweise Kompromisse nötig

2. **Performance auf älteren Geräten** – Zwei WebGL-Kontexte gleichzeitig können problematisch sein

3. **Mobile Gyroscope** – Nicht alle Browser unterstützen das gleich gut

4. **Mapbox-Kosten** – Bei hohem Traffic könnten Kosten entstehen

  

### Gewählter Ansatz (V1)

  

**Pragmatischer Fade-Übergang:**

  

1. Karte und Panorama werden **sequenziell** gerendert (nicht gleichzeitig)

2. Bei Spot-Erreichen: Karte ausfaden → Panorama einfaden

3. Das reduziert die Komplexität erheblich und sieht trotzdem elegant aus

  

Dieser Ansatz wurde bewusst gewählt, um:

- Stabilität auf verschiedenen Geräten zu gewährleisten

- Keine zwei WebGL-Kontexte gleichzeitig zu benötigen

- Eine robuste Basis für spätere Erweiterungen zu haben

  

---

  

## Nächste Schritte

  

### Vorbereitung (Du)

  

1. [ ] **Mapbox-Account erstellen** → https://account.mapbox.com/auth/signup/

- Access Token generieren und sicher aufbewahren

2. [ ] **Cloudflare R2 Bucket erstellen** für Panorama-Bilder

3. [ ] **GPS-Daten exportieren** (GeoJSON-Format bevorzugt)

- Route als LineString

- Spots als Points mit Properties (Titel, etc.)

4. [ ] **360°-Fotos erstellen** mit Insta360

- Equirectangular-Format (2:1)

- Empfohlen: 8192x4096px für beste Qualität

- Pro Spot: 1 Panorama + 1 Thumbnail

  

### Implementation (Claude)

  

5. [ ] Dependencies installieren (mapbox-gl, gsap, pannellum)

6. [ ] Basis-Komponenten-Struktur erstellen

7. [ ] Mapbox-Integration mit Route + Markern

8. [ ] GSAP ScrollTrigger Setup

9. [ ] Pannellum 360°-Viewer Integration

10. [ ] Fade-Übergänge implementieren

11. [ ] Info-Overlay UI

12. [ ] Mobile-Version (Swipe-Galerie)

13. [ ] Performance-Detection & Fallbacks

  

### Zum Starten benötigt

  

Bevor die Implementation beginnen kann:

- [ ] Mapbox Access Token

- [ ] Mindestens 1 Test-Panorama (kann Placeholder sein)

- [ ] GPS-Koordinaten für mindestens 1 Spot (zum Testen)