# Longform Source Contract

Gilt für `ki/src/longform/`.

Source setzt die vorher getroffenen inhaltlichen und visuellen Entscheidungen um. Die Bildsprache wird nicht erst beim Coden gewählt.

## Kanonische Bildsprache

Verbindlich:

- `ki/gehirn/YOUTUBE_VISUAL_LANGUAGE.md`
- `ki/gehirn/APPROVED_KI_VISUALS.md`
- `ki/src/longform/visualLanguage.ts`
- `ki/src/motion/easing.ts`
- `ki/src/motion/choreography.ts`

Longform nutzt **Cinematic Editorial Tech**. Ein einzelnes Video darf eigene Art Direction besitzen, aber nicht die kanalweite Typografie-, Farb-, Motion- und Wahrheitslogik brechen.

## Format und Determinismus

- 1920×1080 / 30 FPS
- Dauer folgt Inhalt und echtem Voiceover
- keine externen Medien erfinden
- `useCurrentFrame`, `interpolate`, `spring`, `Sequence`; kein `Math.random()`
- direkte Frame-Seeks deterministisch
- keine Render-Time-Netzwerkaufrufe

## 100-%-Remotion

Jeder finale Frame wird in Remotion komponiert.

### `REMOTION_NATIVE`

Standard für:

- Hero Objects
- Prozesse/Systeme
- UI-Illustrationen
- Daten/Diagramme
- Code/Terminal
- Nodes/Pfade
- 2D/2.5D
- Three.js nur bei echter Tiefenlogik

### `REAL_CAPTURE`

Wenn reales Tool-/Produktverhalten selbst Beweis ist:

- reale Datei verwenden
- in Remotion croppen, fokussieren, maskieren und erklären
- sensible Daten entfernen
- keine Fake-UI als Beweis ausgeben

### `HYBRID`

Echter Capture + Remotion-Erklärung.

Externe generierte Still-/Motion-Medien sind kein normaler Longform-Ausweg für fehlende Visual-Ideen.

## Verbindlicher Creative-Director-Pfad

- jedes registrierte Longform-Produktionsmodul benötigt `visualProfiles.ts`
- Kapitelreihenfolge und Scene-IDs müssen übereinstimmen
- `assertAuthoredVisualDiversity(...)` bleibt Pflicht
- unterschiedliche Komponenten-IDs allein zählen nicht als Vielfalt
- direkt benachbarte Kapitel sollen nicht ohne Grund gleiche Layout-Family oder Motion-Signature wiederholen
- keine drei Kapitel hintereinander mit identischem Primary Primitive oder Panel-/AppWindow-/Chip-Grammatik
- große Visuals/Objekte vor Karten
- Grid nicht als permanenter Standardhintergrund
- Dark Reset bewusst und selten
- `SignalThread` nur semantisch, nicht als permanente Deko

## Typografie

Für neue KI-Longform-Source:

- Display: `YOUTUBE_VISUAL_LANGUAGE.typography.display`
- Body/UI: `YOUTUBE_VISUAL_LANGUAGE.typography.body`
- Code: `YOUTUBE_VISUAL_LANGUAGE.typography.code`

Bebas Neue ist keine neue Longform-Display-Vorgabe.

## Production-Wahrheit

- `ki/src/ProductionRoot.tsx` ist einzige Registrierungsquelle für echte Production-Compositions
- `ki/src/production-entry.tsx` registriert ausschließlich `ProductionRoot`
- `ki/src/Root.tsx` bleibt Studio/Preview
- Production darf nicht von `MotionPreviewRoot` oder `src/motion-system/` abhängen
- pro Longform-Composition genau ein aktiver Production-Visual-Layer
- keine optionalen Voiceover-Dateien statisch in `ProductionRoot.tsx` importieren

## Inhalt und Motion

- jede längere Szene braucht echte Zustandsentwicklung
- Startzustand → sichtbare Veränderung → Endzustand
- Hero / Support / Texture
- Hard Cut Standard
- Objektkontinuität bevorzugen
- keine Partikel/Glow/Kamerafahrt als Ersatz für Erklärung
- keine Idle-Motion nur gegen Leerlauf
- End-Holds bewusst
- lange Kapitel in semantische Micro-Beats teilen
- Voiceover bestimmt Timeline

## Prüfung

- `ki/tsconfig.motion.json` muss Longform erfassen
- Production-Visual-Contracts müssen jedes registrierte Longform-Modul erfassen
- nach Source-Änderung alten Render nie als aktuelle Freigabe verwenden
- Visual Profiles, TypeScript, Tests, Smoke-Frames, Contact Sheet, Thumbnail und finalen Render getrennt prüfen
- automatisches Diversity-Gate ersetzt keine visuelle Prüfung echter Frames
- TypeScript/Test/Render/Review nur behaupten, wenn tatsächlich ausgeführt
