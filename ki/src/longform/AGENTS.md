# Longform Source Contract

Gilt für `ki/src/longform/`.

## Format und Determinismus

- 1920×1080 / 30 FPS als aktueller Standard.
- Dauer nach echtem Voiceover final auf 5:00–6:00 Minuten halten.
- `REMOTION_NATIVE_MAXIMUM`: möglichst alle sichtbaren Visuals direkt in React/SVG/CSS/Canvas/WebGL/Remotion bauen.
- keine Bitmap-Icons, Screenshot-UI oder generierte Interface-Bilder, wenn Code dieselbe Aussage sauber darstellen kann.
- keine externen Medien erfinden oder generieren; nur vom Nutzer bereitgestellte Medien verwenden.
- `useCurrentFrame`, `interpolate`, `spring`, `Sequence`; kein `Math.random()`.
- direkte Frame-Seeks müssen deterministisch funktionieren.

## Verbindlicher Creative-Director-Pfad

- Jedes in `ki/src/ProductionRoot.tsx` registrierte Longform-Produktionsmodul benötigt `visualProfiles.ts`.
- Die Kapitelreihenfolge im Production-Contract und die Scene-IDs in `visualProfiles.ts` müssen exakt übereinstimmen.
- Authored Longform-Visuals müssen über `assertAuthoredVisualDiversity(...)` geprüft werden.
- Eine andere Komponenten- oder Animation-ID allein zählt nicht als visuelle Vielfalt.
- Verglichen werden mindestens `primaryPrimitive`, `cameraMotion`, `depthStyle`, `entryMechanism`, `medium`, `direction`, `visualFamily`, `layoutFamily` und `motionSignature`.
- Direkt benachbarte Kapitel dürfen nicht dieselbe Layout-Family oder Motion-Signature wiederholen.
- Keine drei Kapitel hintereinander mit demselben Primary Primitive, ausschließlich locked Kamera oder ausschließlich flacher Tiefe, wenn der Inhalt eine bessere Inszenierung zulässt.
- Card-/Panel-/AppWindow-/Chip-Grammatiken dürfen nicht zum Default mehrerer Kapitel werden. UI ist nur zulässig, wenn ein echter UI-Zustandswechsel erklärt wird.
- Neue Visuals zuerst aus semantisch passenden React/SVG/Paths/Shapes/pseudo-3D-Mechaniken bauen. Three/Lottie/Rive nur mit echtem Mehrwert und bei Lottie/Rive nur mit real vorhandenem Asset.

## Production-Wahrheit

- `ki/src/ProductionRoot.tsx` ist die einzige Registrierungsquelle für echte Short-Form-/Longform-Production-Compositions.
- Echte Production-Renders laufen über `ki/src/production-entry.tsx`, das ausschließlich `ProductionRoot` registriert.
- `ki/src/Root.tsx` ist der Studio-Root und darf Production nur über `<ProductionRoot />` einbinden; `MotionPreviewRoot` bleibt dort eine reine Preview-Erweiterung.
- Production-Renderpfade dürfen nicht von `MotionPreviewRoot` oder `src/motion-system/` abhängen.
- Pro Longform-Komposition gibt es genau einen aktiven Production-Visual-Layer.
- Ein Legacy-/Referenz-Layer darf im Branch verbleiben, aber die Production-Komposition darf ihn nicht parallel oder zufällig auswählen.
- `LongformAIAppWorkflow.tsx` bzw. die jeweilige Hauptkomposition ist die ausführbare Visual-Wahrheit innerhalb ihres Production-Moduls; Tests müssen den aktiven Importpfad absichern.
- Keine Imports aus `src/motion-system/` in Longform-Production.
- Gemeinsame Library-/Creative-Recipe-Runtime verwenden, wenn ein Longform-Kapitel eine Library-Animation oder einen NEW_BUILD-Recipe nutzt; keine lokale Kopie von Meaning → Deriver → Sanitizer → Association → Props bauen.
- Optionales Phase-2-Voiceover niemals statisch in `ProductionRoot.tsx` importieren; Audio wird erst in Phase 3 explizit als Prop gebunden.

## Inhalt und Text

- pro Kapitel klare Zustandsentwicklung statt permanenter Dekobewegung.
- Text knapp halten: Kapitelmarker, Objektlabels, echte UI-Begriffe; kein Transcript im Bild.
- Thumbnail-Komposition darf im selben Source-Ordner liegen, ist aber eine eigene Composition.

## Prüfung

- `ki/tsconfig.motion.json` muss `src/longform/**/*.ts`, `src/longform/**/*.tsx`, `src/ProductionRoot.tsx` und `src/production-entry.tsx` explizit erfassen.
- `scripts/check-production-visual-contracts.mjs` muss jedes in `ProductionRoot.tsx` registrierte Longform-Modul erfassen und die Studio-/Production-Entry-Trennung prüfen.
- nach Source-Änderung alten Render nicht als aktuelle Freigabe verwenden.
- Visual Profiles, TypeScript, Tests, Smoke-Frames und finalen Render getrennt prüfen.
- Ein bestandenes Diversity-Gate ersetzt keinen visuellen Review realer Frames/Videos.
- TypeScript/Test/Render/Review nur behaupten, wenn tatsächlich ausgeführt.
