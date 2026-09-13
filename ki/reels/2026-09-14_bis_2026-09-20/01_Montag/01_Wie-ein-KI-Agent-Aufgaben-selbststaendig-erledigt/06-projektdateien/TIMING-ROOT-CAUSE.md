# Timing-Root-Cause

Der hochgeladene Render `ki-agent-workflow.mp4` ist technisch 1080×1920, 30 fps und ca. 68,05 s lang. Sichtbar funktionieren die Remotion-Szenen, aber der aktuelle Ablauf erlaubt, dass drei getrennte Zeitachsen gleichzeitig existieren:

1. geplante Szenenframes aus `reel.json`,
2. Preview-Untertitel aus `subtitle-cues.json`,
3. echtes Nutzer-Audio mit eigener Sprechgeschwindigkeit und Pausen.

Wenn diese drei Achsen nicht nach dem echten Voiceover neu abgeleitet werden, laufen Caption, Szene und Reveal zwangsläufig auseinander.

Die Lösung ist daher nicht manuelles Verschieben einzelner Animationen, sondern ein Audio-first Timing-Lock: Das echte Voiceover wird einmal aligned; danach werden Captions, Szenen, Reveals, SFX und Gesamtdauer aus derselben Wort-Timeline berechnet.
