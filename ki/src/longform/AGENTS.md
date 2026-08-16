# Longform Source Contract

Gilt für `ki/src/longform/`.

- 1920×1080 / 30 FPS als aktueller Standard.
- Dauer nach echtem Voiceover final auf 5:00–6:00 Minuten halten.
- `REMOTION_NATIVE_MAXIMUM`: möglichst alle sichtbaren Visuals direkt in React/SVG/CSS/Canvas/WebGL/Remotion bauen.
- keine Bitmap-Icons, Screenshot-UI oder generierte Interface-Bilder, wenn Code dieselbe Aussage sauber darstellen kann.
- keine externen Medien erfinden oder generieren; nur vom Nutzer bereitgestellte Medien verwenden.
- `useCurrentFrame`, `interpolate`, `spring`, `Sequence`; kein `Math.random()`.
- direkte Frame-Seeks müssen deterministisch funktionieren.
- pro Kapitel klare Zustandsentwicklung statt permanenter Dekobewegung.
- Text knapp halten: Kapitelmarker, Objektlabels, echte UI-Begriffe; kein Transcript im Bild.
- Thumbnail-Komposition darf im selben Source-Ordner liegen, ist aber eine eigene Composition.
- nach Source-Änderung alter Render nicht als aktuelle Freigabe verwenden.
- TypeScript/Test/Render/Review nur behaupten, wenn tatsächlich ausgeführt.