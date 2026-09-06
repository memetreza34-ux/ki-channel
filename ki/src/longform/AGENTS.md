# Longform Source Contract

Gilt für `ki/src/longform/`.

- Standard: 1920×1080 / 30 FPS / 16:9.
- Dauer folgt Thema und finalem Voiceover; keine künstliche Streckung. Neue Longform-v1-Pakete sind nicht mehr technisch auf 5:00–6:00 Minuten begrenzt.
- `OPEN_ENDED_STORY_DRIVEN`: keine feste Animationstechnik-Whitelist. React/SVG/CSS/Canvas/WebGL/Three/Skia/Rive/Lottie/GSAP/Remotion sowie neue geeignete Techniken dürfen genutzt werden, wenn sie Story, Lesbarkeit oder Beweisführung verbessern.
- vorhandenen Stack, Repo-Komponenten, relevante Remotion-Skills und Remotion Bits zuerst prüfen; neue Dependencies nur bei echtem Capability-Gap.
- native Remotion-Visuals bevorzugen, wenn sie die Aussage besser und klarer tragen; reale Medien bevorzugen, wenn reale Bildinformation selbst Teil der Aussage ist.
- externe Bilder/Videos sind erlaubt, wenn sie im zugehörigen `MEDIA-PLAN.json` mit Quelle/Rechten/Attribution dokumentiert, lokal materialisiert und vor Produktion geprüft wurden.
- keine Remote-Downloads zur Renderzeit.
- keine generierten Fake-Screenshots oder generierten Medien als Beleg realer Ereignisse/Claims.
- User-Media bleibt zulässig und wird ebenfalls lokal/provenance-seitig gebunden.
- `useCurrentFrame`, `interpolate`, `spring`, `Sequence`; kein `Math.random()` im deterministischen Renderpfad.
- direkte Frame-Seeks müssen deterministisch funktionieren.
- pro Kapitel klare Zustandsentwicklung statt permanenter Dekobewegung.
- Motion-Dichte folgt der Story: Cold Open dichter, Proof ruhiger, Reveals gezielt, Kapitelwechsel klar, Payoff mit Raum.
- Text knapp halten: Kapitelmarker, Objektlabels, echte UI-Begriffe, Zahlen/Claims bei Bedarf; kein dauerhaft eingebranntes Transcript.
- Thumbnail-Komposition darf im selben Source-Ordner liegen, ist aber eine eigene Composition.
- nach Source-Änderung alten Render nicht als aktuelle Freigabe verwenden.
- TypeScript/Test/Render/Review nur behaupten, wenn tatsächlich ausgeführt.

Für neue Pakete ab 2026-09-05 ist zusätzlich `ki/youtube-longform/LONGFORM-V1.md` verbindlich.