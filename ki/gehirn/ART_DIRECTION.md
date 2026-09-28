# Kanal-Art-Direction V1 — Physical AI Editorial World

Diese Datei definiert die **eigene Bildwelt des KI-Kanals**. Sie steht vor `VISUAL_STRATEGY.md`, `VISUAL_QUALITY_V4.md` und jeder Remotion-Capability-Auswahl.

## Leitidee

> Abstrakte KI wird als **physische, redaktionelle Welt** inszeniert: wenige große Objekte, echte räumliche Beziehungen, Material, Licht, Gewicht und sichtbare Ursache/Wirkung.

Nicht: `Text → Icon → Card → Glow`.

Sondern: `Objekt → physische Handlung → sichtbare Konsequenz`.

Remotion ist die Ausführungsebene. Die Art Direction entscheidet vorher, **wie die Welt aussieht und sich anfühlt**.

---

## 1. Weltname

Kanonische Welt-ID:

```text
physical-ai-editorial-v1
```

Die Welt soll über viele Reels wiedererkennbar bleiben. Themen ändern sich; Material-, Kamera- und Objektlogik bleiben zusammengehörig.

---

## 2. Materialien

Bevorzugte Materialfamilien:

- `warm-paper` — warmes Editorial-Papier / mineralische Fläche
- `graphite` — dunkles mattes Graphit für Gewicht, Maschinen, Kerne
- `frosted-acrylic` — milchig-transparente Informationskörper
- `clear-glass` — transparente Layer nur bei echter Tiefenfunktion
- `brushed-metal` — technische Gelenke, Gates, Schienen
- `ceramic` — ruhige hochwertige Modell-/Produktkerne

Regel: **maximal drei Materialfamilien pro Szene**, normalerweise zwei.

Nicht als Standard:

- Neon-Plastik
- spiegelnde Cyberpunk-Flächen
- permanentes Glassmorphism
- überall leuchtende Kanten
- zufällige Farbverläufe ohne Materiallogik

---

## 3. Farbrolle

Basis:

```text
Warm Off-White  #F3F0EA
Paper White     #FBFAF7
Graphite        #1A1820
Deep Graphite   #0F0E13
```

Marke:

```text
Purple          #6E45C9
Light Purple    #B98CFF
```

Semantik:

```text
Risk            #B5415C
Solution        #2B8A68
```

### Purple-Regel

Lila ist **Energie, Information oder Fokus** — nicht die komplette Welt.

Richtwert pro normalen Frame:

- Lila-Fläche idealerweise unter ca. 18%
- kein vollflächiger lila/neonfarbener Hintergrund als Standard
- Glow nur punktuell, wenn Energie/Signal selbst die Aussage trägt

---

## 4. Licht

Kanonisch:

- redaktionelles Studio-Licht
- weiches Key-Light von oben/seitlich
- sichtbarer, aber kontrollierter Kontaktschatten
- leichte Ambient-Fill-Beleuchtung
- Materialform muss über Licht lesbar sein

Nicht kanonisch:

- Cyberpunk-Neon
- magenta/cyan Rimlight als Default
- dunkler Serverraum nur weil Thema „KI“ ist
- Glow als Ersatz für Form

---

## 5. Kamera

Bevorzugte Kamera-Sprache:

- `editorial-medium` — ruhige 35–60mm-Anmutung
- `macro-push` — naher Push auf einen Mechanismus
- `controlled-orbit` — kleiner Orbit, wenn räumliche Beziehung erklärt wird
- `top-down-mechanical` — Sortieren, Routing, Assembly
- `cutaway` — physischer Querschnitt / Exploded View

Regeln:

- Kamera erklärt Raum; sie bewegt sich nicht nur zur Dekoration.
- Keine permanente schwebende Kamera.
- Keine extreme Weitwinkel-/HUD-Optik als Default.
- Ein Hero darf bewusst sehr groß in den Frame kommen.

---

## 6. Wiederkehrende Weltobjekte

Diese Objekte bilden ein wiedererkennbares visuelles Vokabular.

### Model Core

Ein Modell/KI-System wird bevorzugt als **schwerer Kern** dargestellt:

- Ceramic oder Graphite
- klare Silhouette
- wenige eingelassene Informationslinien
- keine Roboterfigur

### Token / Data Unit

Information ist ein physischer Körper:

- dünne Acrylic-Tiles
- klare Größe/Gewicht
- kann fliegen, stapeln, brechen, sortieren, komprimieren

### Context / Memory

Kontext/Speicher wird als räumliches System gebaut:

- Trays
- Glasplatten
- Schichten
- Slots
- Schienen

Nicht als „Memory Card“-UI.

### Route / Workflow

Ablauf wird als **Schiene, Kabel, Kanal oder mechanischer Pfad** gezeigt.

Nicht standardmäßig als Node-Dashboard.

### Gate / Permission / Limit

Grenzen werden physisch:

- Aperture
- Iris
- mechanisches Gate
- Slot
- Filter

Nicht als schwebende Badge-Wolke.

### Dokument / Output

Dokumente sind echte Flächen/Körper:

- Papier
- transparente Sheets
- gefaltete Layer
- gestapelte Seiten

### Device

Geräte brauchen erkennbare Hardware-Silhouette und räumliche Dicke. UI ist nur dann Hauptmotiv, wenn die UI selbst die Aussage trägt.

---

## 7. Szenen-Grammatik

Normale Szene:

```text
1 Hero
+ 0–3 Support-Objekte
+ 0–2 kurze Visual-Labels
+ Caption/Header getrennt
```

Ein Frame darf komplex sein, aber nicht aus vielen gleich wichtigen Mini-Elementen bestehen.

### Hero-Dominanz

Der Hero trägt die Szene. Support-Objekte erklären Beziehung, nicht Konkurrenz.

Ziel:

- Hero normalerweise ca. 35–65% der visuellen Aufmerksamkeit
- ein eindeutiger Blickpunkt
- keine sechs ähnlich starken Pills/Badges/Nodes gleichzeitig

---

## 8. Physische Verben

Bevorzugte Handlungssprache:

- kollidiert
- zerbricht
- komprimiert
- stapelt
- sortiert
- rast
- blockiert
- öffnet
- filtert
- klappt auf
- zieht hinein
- stößt aus
- koppelt
- entkoppelt
- faltet
- schneidet
- montiert
- zerlegt
- überholt
- verriegelt

`erscheint`, `zeigt`, `schwebt` oder `pulsiert` allein sind keine tragende Handlung.

---

## 9. UI-/Panel-Regel

UI ist erlaubt, wenn UI **inhaltlich** das Objekt ist.

Nicht als Welt-Grammatik:

- schwebende Rounded-Rectangle-Panels
- Pill-Clouds
- HUD-Rahmen
- Status-Badges ohne Objektbezug
- Dashboard-Gitter als Standard
- Node-Netz nur um „technisch“ auszusehen

Pro normale Szene gilt als Richtwert:

- höchstens ein UI-/Panel-Hauptobjekt
- keine dekorative Panel-Wolke
- bei physischer Metapher möglichst `uiPanelCount = 0`

---

## 10. Text-Regel

Bild erklärt zuerst.

Zusätzlich zu Header/Caption normalerweise:

- 0–2 kurze Visual-Labels
- 1–3 Wörter pro Label
- keine Erklärungssätze im Bild

Kinetic Typography darf selbst der Hero sein — dann ersetzt sie physische Objekte bewusst und muss eine starke typografische Handlung besitzen.

---

## 11. Glow-Regel

Erlaubt:

```text
none
semantic-only
```

`semantic-only` bedeutet: Glow markiert Signal, Energie, aktiven Datenfluss oder einen konkreten Zustandswechsel.

Nicht erlaubt als Stilgrundlage:

- Dauer-Glow auf allen Objekten
- Neon-Ränder um jede Form
- cyan/magenta Cyberpunk-Licht
- Glow um fehlende Hierarchie zu kaschieren

---

## 12. Remotion-Technik kommt danach

Erst:

```text
Bedeutung
→ physische Metapher
→ Hero
→ Material
→ Kamera
→ Handlung
→ Payoff
```

Dann:

```text
Three / CSS 3D / SVG / Paths / Shapes / Motion Blur / Typography / Real Capture
```

Eine Capability ist kein Stil.

---

## 13. Art-Direction-Kalibrierung vor Vollproduktion

Vor einem vollständigen neuen Reel werden **nur drei Kalibrier-Szenen** gebaut:

1. `hook` — stärkster erster Eindruck
2. `mechanism` — schwierigste Erklärszene
3. `payoff` — Finale / Ergebnis

Dafür wird geführt:

```text
06-projektdateien/art-direction-calibration.json
```

Ein vollständiger Reel-Build darf erst weitergehen, wenn:

```text
humanCreativeStatus = APPROVED
fullReelBuildAllowed = true
```

Das automatische System darf diesen Status **nicht selbst vergeben**.

### Warum

Ein technisch korrektes komplettes Reel ist wertlos, wenn die Bildwelt bereits in den ersten drei Test-Szenen falsch ist.

---

## 14. Kalibrier-Szene — Pflichtfelder

Jede der drei Szenen dokumentiert:

- Rolle: `hook`, `mechanism`, `payoff`
- Hero-Objekt
- physische Aktion
- Materialfamilien
- Kamera
- Support-Objekt-Anzahl
- Visual-Label-Anzahl
- UI-Panel-Anzahl
- Glow-Modus
- Purple-Flächenziel
- warum die Szene zur Kanalwelt gehört

Automatisch blockiert werden unter anderem:

- mehr als 3 Support-Objekte
- mehr als 2 Visual-Labels
- mehr als 1 UI-Panel
- Purple-Ziel über 18%
- Neon-/Cyberpunk-Hintergrund
- Dashboard-Grammatik
- Floating-Pill-Cloud

---

## 15. Art-Direction Lab

Studio-Preview:

```text
KI-ArtDirection-PhysicalAIWorld-V1
```

Diese Composition ist **kein Production-Reel**. Sie dient nur dazu, Material, Kamera, Objektmaßstab und physische Motion der Kanalwelt zu kalibrieren.

Production-Root bleibt davon getrennt.

---

## 16. Reihenfolge für neue Reels

```text
Idea Gate
→ Story / Fakten
→ Art Direction Fit
→ Visual Strategy
→ 3 Calibration Scenes
→ Human Creative APPROVED
→ Visual Quality V4
→ Capability-Auswahl
→ restlicher Source
→ Audio
→ Render / QA
```

Der wichtigste Grundsatz lautet:

> **Welt und Bildidee vor Technik. Wenige starke Objekte vor vielen UI-Elementen. Physische Handlung vor Dashboard-Motion.**
