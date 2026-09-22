# Longform Source Contract

Gilt für `ki/src/longform/`.

Source setzt die vorher getroffenen inhaltlichen und visuellen Entscheidungen um. Die Bildsprache wird nicht erst beim Coden gewählt.

## Format und Determinismus

- 1920×1080 / 30 FPS als aktueller Standard
- Dauer richtet sich nach dem freigegebenen Inhalt und echtem Voiceover; 5:00–6:00 Minuten sind eine typische Zielspanne, kein Streckzwang
- keine externen Medien erfinden oder als vorhanden behandeln
- `useCurrentFrame`, `interpolate`, `spring`, `Sequence`; kein `Math.random()`
- direkte Frame-Seeks müssen deterministisch funktionieren
- keine Render-Time-Netzwerkaufrufe

## Visual Modality aus der Planung übernehmen

Je Kapitel/Beat kann die Planung verwenden:

- `REMOTION_NATIVE`
- `REAL_CAPTURE`
- `HYBRID`
- `EXTERNAL_STILL_REQUIRED`
- `EXTERNAL_MOTION_REQUIRED`

### `REMOTION_NATIVE`

Bevorzugt für kontrollierbare technische Erklärung:

- UI
- Prozesse
- Daten/Diagramme
- Code/Terminal
- Nodes/Pfade
- abstrakte Mechanismen
- skalierbare SVG-/2D-/2.5D-/Three.js-Erklärungen

### `REAL_CAPTURE`

Wenn reales Tool-/Produktverhalten Beweis ist:

- reale Datei verwenden
- Crop/Fokus/Zoom kontrollieren
- sensible Daten entfernen/maskieren
- keine Fake-UI aus Bequemlichkeit nachbauen

### `HYBRID` / externe Medien

Wenn räumliche, physische oder organische Bildwirkung die Aussage stärker trägt:

- reales Asset über Repository-/staticFile-Pfad integrieren
- präzise Info-/Text-/Fokus-Ebenen in Remotion kontrollieren
- fehlendes Pflichtasset nicht durch generische Cards ersetzen

## Verbindlicher Creative-Director-Pfad

- Jedes in `ki/src/ProductionRoot.tsx` registrierte Longform-Produktionsmodul benötigt `visualProfiles.ts`.
- Kapitelreihenfolge im Production-Contract und Scene-IDs in `visualProfiles.ts` müssen exakt übereinstimmen.
- Authored Longform-Visuals müssen über `assertAuthoredVisualDiversity(...)` geprüft werden.
- Eine andere Komponenten-/Animation-ID allein zählt nicht als visuelle Vielfalt.
- Verglichen werden mindestens `primaryPrimitive`, `cameraMotion`, `depthStyle`, `entryMechanism`, `medium`, `direction`, `visualFamily`, `layoutFamily` und `motionSignature`.
- Direkt benachbarte Kapitel sollen nicht ohne semantische Begründung dieselbe Layout-Family oder Motion-Signature wiederholen.
- Keine drei Kapitel hintereinander mit demselben Primary Primitive, ausschließlich locked Kamera oder ausschließlich flacher Tiefe, wenn der Inhalt eine bessere Inszenierung zulässt.
- Card-/Panel-/AppWindow-/Chip-Grammatiken dürfen nicht zum Default mehrerer Kapitel werden. UI ist dann sinnvoll, wenn tatsächlich ein UI-Zustand erklärt wird.
- Three/Lottie/Rive nur mit echtem Mehrwert; Lottie/Rive nur mit real vorhandenem Asset.

Die technische Diversity-Prüfung ergänzt die inhaltliche Visual Strategy; sie ersetzt sie nicht.

## Production-Wahrheit

- `ki/src/ProductionRoot.tsx` ist die einzige Registrierungsquelle für echte Short-Form-/Longform-Production-Compositions.
- Echte Production-Renders laufen über `ki/src/production-entry.tsx`, das ausschließlich `ProductionRoot` registriert.
- `ki/src/Root.tsx` ist Studio-Root; `MotionPreviewRoot` bleibt reine Preview-Erweiterung.
- Production-Renderpfade dürfen nicht von `MotionPreviewRoot` oder `src/motion-system/` abhängen.
- Pro Longform-Komposition gibt es genau einen aktiven Production-Visual-Layer.
- Legacy-/Referenz-Layer dürfen bestehen, aber Production darf sie nicht parallel oder zufällig auswählen.
- Die jeweilige Hauptkomposition ist die ausführbare Visual-Wahrheit innerhalb ihres Production-Moduls; Tests sichern den aktiven Importpfad.
- Keine Imports aus `src/motion-system/` in Longform-Production.
- Gemeinsame Library-/Creative-Recipe-Runtime verwenden, wenn ein Kapitel tatsächlich eine passende Library-/NEW_BUILD-Recipe nutzt; keine lokale Kopie der gesamten Meaning→Props-Pipeline bauen.
- Optionales Phase-2-Voiceover niemals statisch in `ProductionRoot.tsx` importieren; Audio wird erst in Phase 3 explizit als Prop gebunden.

## Modality-Treue

Source darf eine geplante Modality nicht aus Bequemlichkeit austauschen.

Beispiele:

- geplantes `REAL_CAPTURE` nicht durch Fake-AppWindow ersetzen
- geplantes `HYBRID` nicht zu reiner Card-Animation vereinfachen
- geplantes `REMOTION_NATIVE` nicht unnötig als generiertes Screenshot-Bild backen

Wenn eine geplante Modality technisch nicht funktioniert, zur Planung zurückkehren und Abweichung begründen.

## Inhalt und Text

- pro Kapitel klare Zustandsentwicklung statt permanenter Dekobewegung
- Text knapp: Kapitelmarker, Objektlabels, echte UI-Begriffe; kein Transcript im Bild
- keine langen Sprecherpassagen als Animationstext duplizieren
- Thumbnail-Komposition darf im selben Source-Ordner liegen, ist aber eine eigene Composition
- sichtbare Zahlen/Claims müssen mit der aktuellen Fakten-/Quellenplanung vereinbar sein

## Motion

- Bewegung dient Bedeutung/Fokus/Zustandswechsel
- Hard Cut Standard; Transition nur bei echter Kontinuität
- keine Partikel/Glow/Kamerafahrt als Ersatz für fehlende Erklärung
- End-Holds bewusst setzen
- lange Kapitel brauchen semantische Micro-Beats, nicht Dauerbewegung

## Prüfung

- `ki/tsconfig.motion.json` muss `src/longform/**/*.ts`, `src/longform/**/*.tsx`, `src/ProductionRoot.tsx` und `src/production-entry.tsx` erfassen.
- `scripts/check-production-visual-contracts.mjs` muss jedes in `ProductionRoot.tsx` registrierte Longform-Modul erfassen und die Studio-/Production-Entry-Trennung prüfen.
- nach Source-Änderung alten Render nicht als aktuelle Freigabe verwenden.
- Visual Profiles, TypeScript, Tests, Smoke-Frames, Thumbnail und finalen Render getrennt prüfen.
- Thumbnail zusätzlich in kleiner Darstellung prüfen.
- Ein bestandenes Diversity-Gate ersetzt keinen visuellen Review realer Frames/Videos.
- TypeScript/Test/Render/Review nur behaupten, wenn tatsächlich ausgeführt.
