# KI-Reel-Produktionsgehirn

Für alle neuen Reels ist `FUTURE-REEL-STANDARD.md` mit `ki-animation-only-reel-v3` verbindlich. Historische v1- und v2-Reels bleiben reproduzierbar, sind aber keine Vorlage.

## Produktionsfluss

```text
Thema und Script mit genau zwei kurzen Sätzen pro Szene
→ Animation Director plant ein großes Hauptobjekt und eine dominante Bewegung
→ Remotion-Vorbau mit Platzhalterframes
→ Voiceover bei 1,00x
→ echtes Wort-Transcript
→ final-sync.json mit Wortzeiten, Szenengrenzen und Sinn-Triggern
→ v3-Validator
→ TypeScript und Tests
→ Smoke-Frames und Animation-Director-Prüfung
→ Checkpoints, Kontaktbogen, Cover und MP4
→ Visual-QA-Prüfung in normaler Geschwindigkeit und Smartphone-Größe
→ Nutzerfreigabe
```

## Untertitel

Beide kurzen Sätze einer Szene stehen vollständig sichtbar. Nur das aktuell gesprochene Wort wird violett. Keine Fortschrittslinie, kein Textaufbau, keine Größenänderung. Standardposition: 260 px über dem unteren Rand.

## Animation

Pro Szene ein großes Hauptobjekt, eine dominante Bewegung, höchstens zwei Helfer und maximal drei Sinnbeats. Bewegungen starten aus echten Wortzeiten. Mini-Dashboards, kleine blasse Kartenansammlungen und rein dekorative Bewegung sind blockiert.

## Wahrheit

Keinen Test, Render, Sync oder Review als bestanden melden, wenn er nicht auf dem aktuellen Commit tatsächlich ausgeführt wurde. `main` nicht verändern und ohne ausdrückliche Freigabe nichts mergen.
