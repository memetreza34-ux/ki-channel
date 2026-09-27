# Remotion Skills & Capabilities — kanonische Technik-Policy

**Status:** verbindlich für neue Remotion-Arbeit im KI-Kanal  
**Repo-Runtime:** Remotion `4.0.488`  
**Remotion Agent-Skills:** Stand `4.0.506`  
**Wichtig:** Skill-Version und installierte Repo-Paketversion sind zwei verschiedene Dinge.

Diese Datei ist die zentrale technische Landkarte für Remotion im Repository. Sie beantwortet drei Fragen getrennt:

1. **Welcher Remotion Agent-Skill muss für eine Aufgabe benutzt werden?**
2. **Welche Remotion-Technik ist im Repository tatsächlich installiert bzw. verfügbar?**
3. **Welche visuelle Capability muss bei einem Reel-Beat im echten Source nachweisbar sein?**

Die kreative Reihenfolge bleibt unverändert:

```text
Aussage
→ Visual Beat
→ beste visuelle Mechanik
→ passender Remotion-Skill / aktuelle Doku
→ konkrete Runtime-Capability
→ Source
→ Render
→ technischer + kreativer Review
```

Nicht umgekehrt. Ein vorhandenes Paket ist kein Grund, einen Effekt zu benutzen.

---

## 1. Begriffe — nicht mehr vermischen

### Agent-Skill

Ein **Agent-Skill** ist Arbeitswissen / Routing für eine Aufgabe, zum Beispiel `remotion-markup`, `remotion-render` oder `remotion-captions`.

Ein Skill bedeutet **nicht automatisch**, dass jedes dafür denkbare Runtime-Paket bereits im Repository installiert ist.

### Runtime-Paket

Ein **Runtime-Paket** ist eine echte Dependency in `package.json`, zum Beispiel:

- `@remotion/paths`
- `@remotion/shapes`
- `@remotion/three`
- `@remotion/lottie`
- `@remotion/rive`

### Beat-Capability

Eine **Beat-Capability** ist eine semantische visuelle Mechanik, die in `remotion-capabilities-v1.json` geplant und im markierten Source-Abschnitt wirklich implementiert wird.

Beispiele:

- `paths`
- `three`
- `kinetic-typography`
- `object-transformation`
- `lottie`
- `rive`

### Utility / Workflow

Utilities wie Captions, Fonts, Studio, Render-CLI oder Media-Metadaten sind wichtig, dürfen aber **nicht** künstlich als „Advanced Visual“ gezählt werden.

---

## 2. Agent-Skill-Router — welcher Skill wann geladen wird

`remotion-best-practices` ist der Router. Danach gilt:

| Aufgabe | Remotion Skill | Repo-Verwendung |
|---|---|---|
| neues Video / neue Composition | `remotion-create` | bei neuen Compositions / strukturellen Video-Builds |
| React-Markup, Animation, 3D, Effects, Timing, Lottie usw. | `remotion-markup` | **Pflicht** bei echter Scene-/Visual-Implementierung |
| Untertitel / Transkription / Caption-Daten | `remotion-captions` | zusammen mit unserem eigenen Caption-Contract |
| Audio-/Video-Metadaten mit Mediabunny | `remotion-multimedia` | nur bei echter Multimedia-Analyse; Dependency ggf. on-demand |
| Render / Still / Export | `remotion-render` | Phase 3 / Review-Renders / Final-Render |
| Studio starten / Preview | `remotion-studio` | lokale visuelle Kontrolle |
| Studio-editierbares Markup | `remotion-interactivity` | wenn Studio-Editierbarkeit für eine Komponente sinnvoll ist |
| Karten / Routen / Geo / 3D-Geografie | `remotion-maps` | nur bei Geo-Story; Kartenstack ist on-demand |
| aktuelle API nachschlagen | `remotion-docs` | **Pflicht bei API-/Versionsunsicherheit** |
| Player / Lambda / Rendering-Service / Video-SaaS | `remotion-saas` | nicht Teil normaler Reel-Produktion; nur bei Produkt-/Service-Bau |
| Remotion / Pakete / Skills upgraden | `remotion-upgrade` | ausschließlich kontrollierte Upgrade-Arbeit |

### Routing-Regel

Bei jeder echten Remotion-Implementierung:

```text
remotion-best-practices
→ relevanter Spezial-Skill
→ bei API-/Versionsfrage remotion-docs
→ erst dann Source ändern
```

Der Skill-Router ersetzt **nicht** die Repo-Contracts. Beide gelten gleichzeitig.

---

## 3. Versionswahrheit

### Aktuelle Repo-Runtime

Das Repository verwendet Remotion `4.0.488` und hält die meisten `@remotion/*`-Pakete exakt auf derselben Version.

### Aktuelle Agent-Skills

Die verfügbaren Remotion Agent-Skills sind neuer (`4.0.506`). Deshalb gilt:

> Eine API aus einem aktuellen Skill darf nicht blind als in `4.0.488` verfügbar angenommen werden.

Vor Nutzung einer neuen/unsicheren API:

1. aktuelle Remotion-Dokumentation prüfen,
2. Repo-Version berücksichtigen,
3. Typecheck laufen lassen,
4. Still/Smoke-Render prüfen.

Kein stilles Runtime-Upgrade nur deshalb, weil ein Skill neuer ist.

---

## 4. Installierte Remotion-/Visual-Pakete im Repo

| Paket / Stack | Status | Zweck im Kanal |
|---|---|---|
| `remotion` | installiert `4.0.488` | Timeline, Frames, Composition, Sequencing |
| `@remotion/cli` | installiert `4.0.488` | Studio / Still / Render |
| `@remotion/paths` | installiert `4.0.488` | Pfad-Reveal, Route, Datenfluss |
| `@remotion/shapes` | installiert `4.0.488` | native geometrische Formen |
| `@remotion/three` | installiert `4.0.488` | Three/R3F in Remotion |
| `three` + `@react-three/fiber` | installiert | echte 3D-Szenen |
| `@remotion/motion-blur` | installiert `4.0.488` | Trail / kontrollierter Motion Blur |
| `@remotion/transitions` | installiert `4.0.488` | semantische Scene-Transitions |
| `@remotion/noise` | installiert `4.0.488` | deterministische Noise-Felder |
| `@remotion/lottie` | installiert `4.0.488` | echte Lottie-Assets |
| `@remotion/rive` | installiert `4.0.488` | echte `.riv`-Assets |
| `@rive-app/canvas-advanced` | installiert | Rive Runtime |
| `@remotion/captions` | installiert `4.0.488` | Caption-Daten / Caption-Helfer |
| `@remotion/media-utils` | installiert `4.0.488` | Media-Hilfsfunktionen |
| `@remotion/layout-utils` | installiert `4.0.488` | Layout-/Textmessung |
| `@remotion/google-fonts` | installiert `4.0.488` | deterministisches Font Loading |
| `@remotion/light-leaks` | installiert, **deprecated für neue Produktion** | Legacy only |
| `recharts` | installiert | Datenvisualisierung wenn semantisch passend |
| `lucide-react` | installiert | Support-Icons, nicht automatisch Hauptvisual |
| `roughjs` / `rough-notation` | installiert | sparsame Annotation / hand-drawn Semantik |
| `gsap` | installiert | kein unabhängiger Wall-Clock-Production-Ticker |

### Nicht automatisch als „voll eingebaut“ behandeln

Folgende Skill-Bereiche können zusätzliche Dependencies / Infrastruktur verlangen:

- `remotion-multimedia` → Mediabunny ist nicht automatisch Teil unseres aktuellen Runtime-Stacks
- `remotion-maps` → Mapbox / MapLibre / MapTiler / Cesium usw. nur bei echter Geo-Story hinzufügen
- `remotion-saas` → Player/Lambda/Server-Rendering-Infrastruktur ist kein normaler Reel-Dependency-Block

On-demand heißt: **Skill nutzbar, Runtime-Erweiterung kontrolliert hinzufügen, testen und dokumentieren.**

---

## 5. Beat-Capabilities — im Source wirklich nachweisbar

Diese Werte sind für neue V3-Reels in `06-projektdateien/remotion-capabilities-v1.json` erlaubt:

| Capability | Typische Anwendung | Darf Primary sein? | Source-Gate |
|---|---|---:|---|
| `react-svg-css` | einfache native Konstruktion | ja, aber nicht als einziger Hook-Mechanismus | Basis |
| `paths` | Datenfluss, Route, Prozess | ja | AST |
| `shapes` | Formaufbau, Signal, Geometrie | ja | AST |
| `three` | echte räumliche Szene | ja | AST |
| `depth-2.5d` | Perspektive / Parallax ohne volles 3D | ja | AST |
| `kinetic-typography` | Zahl/Text selbst ist Hauptobjekt | ja | AST |
| `terminal-code` | Code / Terminal ist semantisches Objekt | ja | AST |
| `data-visualization` | Chart / Achse / Messvergleich | ja | AST |
| `object-transformation` | sichtbarer Zustandswechsel | ja | AST |
| `motion-blur` | Bewegungsfinish bei echter schneller Motion | ja, aber selten allein sinnvoll | AST |
| `transitions` | semantische Kontinuität zwischen Zuständen | ja, wenn sie die Aussage trägt | AST |
| `noise` | prozedurale Felder / organische Bewegung | ja, wenn bedeutungstragend | AST |
| `real-capture` | echtes Produkt-/UI-/Output-Beweismaterial | ja | AST |
| `lottie` | vorhandenes passendes Lottie-Asset | ja | AST: `<Lottie>` |
| `rive` | vorhandenes passendes `.riv`-Asset | ja | AST: `<RemotionRiveCanvas>` |

### Was bewusst **nicht** als Beat-Capability zählt

Diese Dinge sind wichtig, aber kein Beweis für visuelle Stärke:

- Captions
- Google Fonts
- Layout Utils
- Media Utils
- Studio
- Render-CLI
- Docs-Suche
- Upgrade-Workflow
- Interactivity-Authoring
- SaaS-Architektur
- Multimedia-Metadaten

Sie dürfen nicht benutzt werden, um die `>=50 % Advanced Primary Capabilities` künstlich zu erfüllen.

---

## 6. Capability-Gate — technische Wahrheit

Verbindliche Details stehen in:

```text
ki/gehirn/REMOTION_CAPABILITY_GATE.md
```

Kurzfassung:

- jeder Beat hat `primaryCapability`
- jeder Beat hat `sourceFile`
- jede Source liegt unter `ki/src/reels/`
- jeder Beat hat `// REMOTION_BEAT: <beatId>`
- CI prüft **nur diesen Beat-Abschnitt**
- Capability-Evidence wird über TypeScript-AST geprüft
- Kommentar, String oder bloßer Import zählt nicht
- Capability-Nutzung in einer anderen Szene zählt nicht
- mindestens 50 % der Beats haben eine Advanced Primary Capability
- mindestens drei unterschiedliche Primary Capabilities bei normalen Reels
- Hook darf nicht nur `react-svg-css` sein
- mindestens ein Hero-/Memorable-Beat

### Visual Fingerprint

Capability-Vielfalt allein reicht nicht. Zusätzlich bleibt der **Visual Fingerprint** pro Beat relevant.

Mindestens betrachten:

```text
primaryPrimitive
cameraMotion
depthStyle
entryMechanism
medium
direction
visualFamily
layoutFamily
motionSignature
```

Nicht ausreichend:

```text
Card + locked + flat + slide
Card + locked + flat + fade-slide
Card + locked + flat + scale-slide
```

Verschiedene `animationId` oder verschiedene Capability-Namen machen eine Szene nicht automatisch visuell verschieden. Die wahrnehmbare Grammatik muss sich sinnvoll unterscheiden.

---

## 7. Markup-Regeln aus dem Remotion-Skill

Für Production-Motion gilt:

- Animation über `useCurrentFrame()` und framebasierte Remotion-Timeline
- keine normalen CSS-`transition`-/`animation`-Timings als Production-Motion
- keine Tailwind-Animationsklassen als Render-Timing
- `interpolate()` / Spring / Easing bewusst einsetzen
- Sequencing über Remotion-Timeline statt Wall-Clock
- Assets deterministisch laden
- bei API-Frage aktuelle Doku prüfen

### Three

- Three nur, wenn räumliche Tiefe die Erklärung verbessert
- Production-Motion über Remotion-Frames steuern
- unabhängiger R3F-`useFrame()`-Ticker ist kein gültiger Capability-Nachweis
- 3D nicht als Dekoration über eine weiterhin flache Card-Szene legen

### Paths / Shapes

Vor einer Kartenserie immer prüfen:

```text
Kann ein Weg, Netzwerk, Fluss, Morph oder Formzustand die Aussage direkter zeigen?
```

### Motion Blur

Nur als Finish einer klaren Bewegung. Motion Blur ersetzt keine gute Bewegung.

### Transitions

Hard Cut bleibt Standard, wenn keine semantische Kontinuität existiert.

Transition nur bei:

- Objektkontinuität
- Richtungsfortsetzung
- Formwechsel
- Zustandswechsel
- bewusstem Overlay am Cut

---

## 8. Lottie und Rive — jetzt echte Gate-Capabilities

### Lottie

`@remotion/lottie` ist installiert.

Erlaubt nur wenn:

- ein echtes Lottie-Asset vorhanden ist
- Asset semantisch exakt zum Beat passt
- Lottie nicht nur als zufällige Dekoration eingesetzt wird
- Source im Beat wirklich `<Lottie ... />` rendert

Keine erfundene „Lottie-Nutzung“ im Manifest.

### Rive

`@remotion/rive` + Rive Runtime sind installiert.

Erlaubt nur wenn:

- echtes `.riv`-Asset vorhanden ist
- State-/Interaktionslogik zum Beat passt
- Source im Beat wirklich `<RemotionRiveCanvas ... />` rendert

Rive ist kein Ersatz für einen individuellen nativen Build, wenn kein passendes Asset existiert.

---

## 9. Captions — eigener Produktionsvertrag

`remotion-captions` ist verfügbar und `@remotion/captions` ist installiert.

Für unseren Kanal gilt trotzdem zusätzlich der bestehende Caption-Contract:

- Captions aus JSON / echten Timings
- Voice-Sync in Phase 3
- keine zweite Erklärungsebene
- Safe-Zone beachten
- Wortlaut nicht durch Caption-Design verändern

Caption-Technik zählt **nicht** als Advanced Visual Capability eines Beats.

---

## 10. Media / Real Capture

Wenn reales Produktverhalten selbst der Beweis ist:

```text
REAL_CAPTURE
→ in Remotion einbetten
→ crop / zoom / mask / focus
→ Callout oder Vergleich nur wenn nötig
→ Voice-/Caption-Sync
→ finaler Remotion-Render
```

Fake-UI darf echten Beweis nicht ersetzen.

`real-capture` im Capability-Gate verlangt echte ausführbare Media-Komponenten im Beat-Source, nicht nur einen geplanten Screenshotnamen.

---

## 11. Interactivity — Studio-Authoring, nicht Qualitätsabkürzung

Der `remotion-interactivity` Skill ist sinnvoll, wenn Elemente im Studio auswählbar/editierbar sein sollen.

Das kann Struktur verbessern, ist aber **keine eigene visuelle Qualitäts-Capability**.

Wenn eine Interactivity-API aus dem neueren Skill verwendet werden soll, zuerst prüfen, ob sie in unserer Runtime `4.0.488` tatsächlich verfügbar ist.

---

## 12. Multimedia, Maps und SaaS — on-demand statt blind installiert

### Multimedia

`remotion-multimedia` behandelt Mediabunny-basierte Audio-/Videoanalyse.

Nutzen bei Bedarf für:

- Video-Dauer
- Audio-Dauer
- Dimensionen
- Browser-Mediaanalyse

Wenn dafür eine neue Dependency nötig ist: kontrollierter Dependency-PR, nicht still im Reel-Code.

### Maps

`remotion-maps` bei:

- Karten
- Routen
- Marker
- GeoJSON
- 3D-Flyovers

Keine Map-Library nur „für Abwechslung“ installieren.

### SaaS

`remotion-saas` nur wenn wir tatsächlich einen Player, Rendering-Service, Lambda-/Cloud-Workflow oder ein Video-Produkt bauen.

Nicht Teil der normalen Short-Form-Pipeline.

---

## 13. Deprecated / verboten als neuer Standard

### `@remotion/light-leaks`

Im Repo noch installiert, aber für neue Production-Visuals **nicht verwenden**.

Legacy-Abhängigkeit ist kein Freifahrtschein für neue Nutzung.

### GSAP

`gsap` ist installiert, aber kein unabhängiger Wall-Clock-/Ticker-Animationspfad für Production.

Wenn GSAP künftig gezielt integriert wird, muss die Animation weiterhin deterministisch und framegebunden bleiben.

---

## 14. Auswahlhilfe pro Beat

### Prozess / Datenfluss

Priorität:

1. `paths`
2. `shapes` / Objektbewegung
3. `depth-2.5d`
4. `three` bei echter Tiefenlogik
5. Card nur wenn Card selbst semantisches Objekt ist

### Transformation

Priorität:

1. `object-transformation`
2. `shapes`
3. Mask / Reveal / native SVG
4. `three` bei echter räumlicher Transformation

### Zahl / Preis / Prozent

Priorität:

1. `kinetic-typography`
2. `object-transformation`
3. `data-visualization`
4. nicht automatisch Prozentzahl in Card

### Geschwindigkeit

Priorität:

1. `paths`
2. echte Objektbewegung
3. `motion-blur` als Finish
4. `three` nur wenn Raumbezug hilft

### Code / Agent / Repo

Priorität:

1. `terminal-code`
2. Pfad-/Node-Flow
3. realer Capture, wenn echter Output Beweis ist

### Vergleich / Benchmark

Priorität:

1. `data-visualization`
2. gemeinsame Achse
3. Objekt-/Shape-Vergleich
4. Split-Screen nur wenn semantisch besser

### Vorhandenes hochwertiges Motion-Asset

- Lottie vorhanden + exakt passend → `lottie`
- `.riv` vorhanden + exakt passend → `rive`
- kein passendes Asset → nativer Build, nicht Asset-Suche aus Bequemlichkeit

---

## 15. Phase-Integration

### Phase 1

Vor Source:

1. Story / Claims / VO abschließen
2. Visual Beats definieren
3. pro Beat beste Mechanik wählen
4. passenden Remotion-Skill anwenden
5. `remotion-capabilities-v1.json` ausfüllen
6. Source mit `REMOTION_BEAT`-Markern bauen
7. Visual Quality + Capability Gates bestehen

### Phase 2

- echtes Voiceover
- nur tatsächlich erforderliche reale Assets/Captures

### Phase 3

- Audio/Assets integrieren
- reale Timings
- Typecheck / Tests
- Smoke Frames / Contact Sheet
- Render
- Creative QA

---

## 16. Verifikation

Kanonischer Gesamtcheck:

```bash
npm run remotion:readiness
```

Darin müssen unter anderem laufen:

```bash
node scripts/check-visual-quality-v3.mjs
node scripts/check-remotion-capabilities.mjs
node scripts/verify-remotion-integration.mjs
npm run repo:verify
npm run motion:verify
```

Für tatsächliche Visuals zusätzlich echte Stills / Contact Sheet prüfen.

> Technisch PASS + visuell langweilig = nicht fertig.

---

## 17. Update-Regel

Bei neuen Remotion-Skills, neuen APIs oder Dependency-Upgrades:

1. `remotion-upgrade` / `remotion-docs` verwenden
2. Runtime-Version und Skill-Version getrennt prüfen
3. Paketmatrix in dieser Datei aktualisieren
4. Capability-Gate nur erweitern, wenn es eine echte Beat-Mechanik ist
5. AST-Evidence + Unit-Test ergänzen
6. Full Remotion Readiness laufen lassen
7. erst nach grüner CI mergen

Diese Datei ist die **kanonische technische Remotion-Landkarte des KI-Kanals**. `REMOTION_CAPABILITY_GATE.md` definiert die harte Source-Prüfung; `REMOTION_VISUAL_SYSTEM.md` definiert die visuelle Produktionslogik.
