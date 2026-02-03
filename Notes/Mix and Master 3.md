---
categories:
  - "[[Music-Production]]"
tags:
  - music-production
  - course
  - sae
  - mixing
  - mastering
created: 2026-01-22
---

# Mix & Master Notizen (Teil 3)

Diese Notizen behandeln fortgeschrittene Konzepte und praktische Tipps für Mixing und Mastering, abgeleitet aus einer Kurssession.

## 1. Dynamik & Lautheit

### 1.1 Pro-Q 4 als Expander
*   Das [[Pro-Q 4]] Plugin kann auch als **[[Expander]]** eingesetzt werden, um die "musikalische Information" (Mitten) eines Sounds zu betonen und herauszuheben.

### 1.2 De-esser
*   **Zweck:** Reduziert störende S-Laute (Zischlaute), besonders bei Vocals.
*   **Plugins:** Der Max4Live [[De-esser]] ist möglicherweise nicht ausreichend; der **[[FabFilter Pro-DS]]** wird empfohlen.
*   **Einstellungen (FabFilter Pro-DS):**
    1.  **Range:** Zuerst den Bereich der Zischlaute einstellen und nur diesen Bereich mittels "Audition"-Funktion anhören.
    2.  **Threshold:** Kann sehr niedrig gestellt werden.
    3.  **Range (dB):** Vorsichtig anpassen, 3 bis 5 dB sind Standardwerte.
*   **"Split S" Funktion:** Versucht, das Signal in S- und Nicht-S-Anteile zu trennen, um sie unabhängig voneinander bearbeiten zu können. Perfekt für die Anwendung vor [[Reverb]] und [[Delay]] auf Vocals oder Backing Vocals, um S-Laute im Hall/Delay zu vermeiden.

### 1.3 Clipping & Limiting

#### Clip to Zero Approach
*   **Konzept:** Hierbei wird auf jede einzelne Spur am Ende der Effektkette (vor dem Summenlimiter) ein leichter **[[Limiter]]** oder **[[Clipper]]** angewendet.
*   **Anwendung:** Ziel ist es, sehr kleine Pegelspitzen (z.B. 0,5 dB) abzufangen, um Headroom zu gewinnen und das Signal zu verdichten, ohne die Dynamik stark zu beeinträchtigen. Dies sollte nicht im Solo-Modus, sondern immer im Kontext des gesamten Mixes beurteilt werden.

#### Allgemeine Clipping-Hinweise
*   **Reihenfolge:** Zuerst **[[Clipper]]**, dann **[[Limiter]]**.
*   **Gain-Reduktion:** 5 dB Clipping sind ein guter Startwert; mehr kann schnell unschön klingen.
*   **Abhängigkeit vom Song:** Die optimale Anwendung hängt stark vom Song und insbesondere dem Low End ab. Was sauberer klingt oder besser funktioniert, ist vom Material abhängig.

#### FabFilter Limiter (Attack-Zeit)
*   **Allgemein:** Eine längere Attack-Zeit bei einem [[Limiter]] lässt Transienten (Anfangsimpulse) stärker durch, was das Signal lauter wirken lassen kann oder mehr "Punch" erzeugt. Eine kürzere Attack-Zeit fängt Transienten schneller ab, was zu einem dichteren, aber potenziell weniger dynamischen Sound führt.
*   **FabFilter:** Die spezifische Wirkweise der Attack-Zeit im FabFilter Limiter kann subtil sein und von der Implementierung abhängen. Es wird empfohlen, dies im Detail zu recherchieren und die verschiedenen Einstellungen genau zu testen.

### 1.4 Gain Staging
*   So früh wie möglich in der Signalkette (z.B. am Gain-Regler der einzelnen Spur) in den Pegel eingreifen, um Übersteuerungen oder zu geringen Pegel zu vermeiden.

## 2. Räumlichkeit & Effekte

### 2.1 Delay
*   **Prinzip:** Simpler als [[Reverb]] und nimmt weniger Platz im Mix ein. Kann als Feedback-Schleife visualisiert werden.
*   **Lead Sounds:** Bei Lead-Sounds kann ein kurzes [[Delay]] oft organischer wirken als ein [[Reverb]], da es weniger Raum beansprucht.
*   **Wortüberlagerung:** Mit einem kurzen [[Delay]] kann man bewirken, dass sich der Beginn von Worten leicht überlagert.
*   **Kreative Anwendung:**
    *   **Einzelne Spur mit Delay & EQ:** Eine separate Spur nur für das Delay kann mit spezifischen EQ-Einstellungen versehen werden (z.B. starke Reduktion der S-Laute).
    *   **Links/Rechts unterschiedlich:** Unterschiedliche Delay-Zeiten für Links und Rechts können interessante Stereoeffekte erzeugen, ohne Automationen nutzen zu müssen.

### 2.2 Reverb
*   **Zweck:** Simuliert die [[Reflexionen]] in einem Raum. Verwendet verschiedene Delay-Algorithmen.
*   **Kurzer Reverb:** Bei Lead-Sounds kann ein kurzer Reverb natürlicher wirken.
*   **"Density" im Reverb:** Beschreibt die Dichte der [[Reflexionen]].
    *   Für die wichtigsten Sounds (Lead, Vocals) eine hohe Density verwenden, um sie hervorzuheben.
    *   Für andere Spuren die Density reduzieren, um mehr Platz im Mix zu schaffen. Das macht im Solo kaum einen Unterschied, ist aber entscheidend im Kontext des vollen Tracks.
*   **Ableton Reverb:**
    *   **[[Early Reflections]]:** Beschreibt Größe und Beschaffenheit des Raumes; prägt den Raumeindruck.
    *   **[[Late Reflections]]:** Beschreibt das Diffuse; gibt primär Auskunft über die Raumgröße.
*   **[[Convolution Reverb]]:** Arbeitet mit Samples (Impulsantworten), die ein Signal aufmodulieren. Ideal zur Simulation von spezifischen Geräten oder Räumen. Ist statisch, da das Audiosample selbst nicht wirklich verändert wird.
*   **[[Pre-Delay]]:** Lässt den Raum größer wirken, aber die Klangquelle gleichzeitig näher. Diesen Effekt kann man für Lead- oder Vocal-Spuren nutzen.
    *   3.4 ms entsprechen ca. 1 Meter.
    *   Ab ca. 40 ms wird das [[Delay]] als Echo wahrnehmbar.
    *   **Hinweis:** Wenn der Hall näher an der Klangquelle (geringes Pre-Delay) ist, wirkt der Sound weiter entfernt, da weniger Tiefenstaffelung generiert wird. (Dies muss noch genauer erklärt werden.)
*   **Reverb auf der Spur:** Nur verwenden, wenn der Sound *überblendet* werden soll und kein dezenter Raumeindruck gewünscht ist.
*   **Standard EQ für Reverb-Send:** Ein Bandpassfilter bei 600 Hz und 6000 Hz ist ein gängiger Ausgangspunkt.
    *   Für Vocals kann bei 1000-1500 Hz etwas reduziert werden, damit die Stimme besser "durchkommt".
    *   Oft ist es schöner, Bässe *vor* dem Reverb wegzuschneiden und einen High-Cut *danach* anzuwenden.

## 3. Frequenzbearbeitung & EQ

### 3.1 Low-Cut / High-Cut
*   **Low-Cut:** Eher steil einstellen (z.B. 24 dB/Oktave).
*   **High-Cut:** Eher flacher einstellen (z.B. 6 dB/Oktave für einen natürlichen Klang).
*   **Achtung bei EQ-Low-Cuts:** Ein EQ-Low-Cut ist keine präzise Noteneinstellung; die Center-Frequenz ist bereits -3 dB.
*   **S-Laute & Percussion:** Bereiche bei 8k bis 9k Hz enthalten oft S-Laute und Percussion-Attack. Diese können bei Bedarf leiser gedreht werden.
*   **Höhen:** Viele Höhen lassen einen Sound näher wirken. Bis 10 kHz reicht es, damit ein Ton hell klingt.

### 3.2 Vocals EQ
*   **Standard Low-Cut:** Bei Gesang immer einen Low-Cut anwenden. Die genaue Frequenz hängt von der Stimmlage ab (Männer/Frauen). Backing Vocals oft ab 200 Hz.
*   **Dynamischer Low Shelf:** Ein dynamischer Low Shelf bei 300 Hz kann als Vocal-EQ-Standard dienen, um den [[Nahbesprechungseffekt]] (Zunahme der Bässe bei geringem Mikrofonabstand) auszugleichen.
*   **Näselnde Stimme:** Bei 800 Hz reduzieren.
*   **Blecherne Stimme:** Optional bei 3 kHz reduzieren.
*   **Höhen:** Anheben, um Präsenz zu geben.

## 4. Sound Design & Kreative Techniken

### 4.1 Oktavierung
*   Wenn zwei Sounds im Mix miteinander konkurrieren, kann es helfen, einen davon eine Oktave höher oder tiefer zu setzen.

### 4.2 Eigene Sounddesign-Gruppe
*   Wenn man in einem Projekt feststeckt, kann eine Sammlung eigener Sounddesign-Experimente als Inspiration dienen.

### 4.3 Frequenzband-Überraschungen
*   Spiele mit dem [[Frequenzband]], um Überraschungen zu erzeugen:
    *   Einen Sound dumpf machen.
    *   Den Bass komplett entfernen.
    *   Einen Sound breiter machen.
    *   Einen Sound mono machen.

### 4.4 Washout Rack (Nachbauen)
*   Ein Effekt-Rack, das typischerweise aus [[Reverb]], [[Delay]] und [[Filter]] besteht, um am Ende eines Verses oder Drops einen "Waschout"-Effekt zu erzeugen.

### 4.5 Resonators (Ableton Plugin)
*   Erzeugt zusätzliche Obertöne, die einen Klangkörper darstellen können.
*   Mit Pitch-Einstellungen können schöne Akkorde gebastelt werden.
*   **Vorsicht:** Bei längerer Anwendung auf Lead-Sounds kann es schnell monoton klingen.

### 4.6 Ende eines Drops
*   **Techniken:**
    *   Bass wegfiltern.
    *   Washout-Rack vollständig zur Geltung kommen lassen.
    *   [[Stereobreite]] reduzieren.

<h2>5. Tipps für Punch & Clarity</h2>
<ul>
<li><strong>Kick &amp; Bass Ausbalancieren:</strong> Entscheidend für maximalen "Punch".</li>
<li><strong>Kick &amp; Clap Verzögern:</strong> Eine minimale Verzögerung von nur 5 ms für Kick und Clap kann den Groove verbessern.</li>
<li><strong>Akkustische Instrumente:</strong> Weniger clippen, lieber komprimieren.</li>
<li><strong>Tiefe Stimme hinzufügen:</strong> Mit Pitch-Shifting kann man eine tiefere Stimme hinzufügen; diese sollte dann aber mit EQ bearbeitet werden.</li>
<li><strong>Reduzieren statt Hinzufügen:</strong> Weniger ist oft mehr. Feineinstellungen bringen sich nicht viel, wenn das Fundament nicht stimmt.</li>
</ul>
<h2>6. Filter Modi (Ableton AutoFilter)</h2>
<ul>
<li><strong>SVF (State Variable Filter):</strong> Ein vielseitiger Filter, der oft als Bandpass, Lowpass, Highpass oder Notch eingesetzt werden kann.</li>
<li><strong>DFM (Diode Filter Model):</strong> Emuliert den Sound eines klassischen Diodenfilters, oft mit einem aggressiveren Charakter.</li>
<li><strong>MS2 (Moog/Mutable Instruments-inspirierter Filter):</strong> Basiert auf Filtern von Moog-Synthesizern oder Mutable Instruments Modulen, bekannt für ihren musikalischen und oft resonant-sahnigen Klang.</li>
<li><strong>PRD (Prd-Filter):</strong> Möglicherweise eine spezifische Ableton-Implementierung oder Emulation eines bestimmten Hardware-Filters.</li>
</ul>
<p><em>(Hinweis: Die genauen Eigenschaften der Ableton AutoFilter-Modi sollten für tiefergehendes Verständnis in der Ableton-Dokumentation nachgeschlagen werden.)</em></p>