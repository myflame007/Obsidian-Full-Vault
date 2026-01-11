# Custom CSS fuer Vicious Theme

## Datei-Pfad

`.obsidian/snippets/vicious-custom.css`

## Aktivierung

Einstellungen > Darstellung > CSS-Snippets > `vicious-custom` aktivieren

---

## Anpassungen

### 1. Folder File Count

Das Vicious Theme zeigt die Dateianzahl in Ordnern als Punkt an. Das Snippet
zeigt stattdessen die tatsaechliche Zahl mit fester Breite.

```css
.nav-folder-title[data-count]::after {
	content: attr(data-count) !important;
	min-width: 2.5ch;
	font-variant-numeric: tabular-nums;
}
```

### 2. Interne Link Symbole entfernt

Symbole neben `[[internen Links]]` werden ausgeblendet.

### 3. Externe Links - Hover-Pfeil

Das Standard-Icon (Quadrat mit Pfeil) wird entfernt.

**Wichtig:** Das Icon wird von Obsidian als `background-image` eingefuegt, nicht
ueber `::after`. Daher:

```css
a.external-link {
	background-image: none !important;
	padding-right: 0 !important;
}
```

---
