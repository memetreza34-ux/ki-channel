# Interne Review-Checkliste

Keinen Punkt vor tatsächlicher Ausführung abhaken.

## Assets

- [ ] Vier Bilder existieren unter `04_BILDER/`.
- [ ] `05_AUDIO/voiceover.wav` existiert und ist nicht leer.
- [ ] Keine Platzhalter oder fremden Bilder verwendet.
- [ ] Bilder enthalten keine Menschen, Hände, Logos oder Fantasieschrift.

## Inhalt

- [ ] Acht Szenen entsprechen `03_SZENEN.md`.
- [ ] Voiceover wurde nicht umgeschrieben.
- [ ] Szene 2 kennzeichnet Prozentwerte als Beispiel und ergibt 100 %.
- [ ] Szene 3 endet mit `PLAUSIBEL`, nicht `BELEGT`.
- [ ] Szene 6 verwendet nur `.example`-Domains.
- [ ] Szene 7 kennzeichnet Vergleichsdaten als fiktiv.
- [ ] Szene 8 zeigt alle drei Prüfschritte.

## Animation

- [ ] Jede Szene hat eine eigene Vollanimation.
- [ ] Keine benachbarten Szenen wiederholen Layout oder Bewegungssignatur.
- [ ] Maximal drei starke Bewegungen gleichzeitig.
- [ ] Kein Bild erhält nur einen generischen Dauerzoom.
- [ ] Jede Szene besitzt Startzustand und Ergebnis-Hold.
- [ ] Übergänge verdecken keine Texte.

## Untertitel und Audio

- [ ] Jedes gesprochene Wort erscheint.
- [ ] Nur bereits gesprochene Wörter sind sichtbar.
- [ ] Maximal neun Wörter gleichzeitig.
- [ ] Finale Audiotimestamps ersetzen die Schätzwerte.
- [ ] Nur das Voiceover ist hörbar.
- [ ] Keine Musik und keine Soundeffekte vorhanden.

## Technik

- [ ] Readiness-Validator besteht.
- [ ] TypeScript besteht.
- [ ] Fokussierte Tests bestehen.
- [ ] Composition ist 1080 × 1920, 30 FPS, 1080 Frames.
- [ ] Alle 32 Checkpoint-PNGs wurden aktuell gerendert.
- [ ] Aktuelles MP4 wurde gerendert.
- [ ] PNG- und MP4-Artefaktprüfung besteht.

## Manuelle Prüfung

- [ ] Alle Checkpoints wurden angesehen.
- [ ] MP4 wurde vollständig bei normaler Geschwindigkeit angesehen.
- [ ] Smartphone-Lesbarkeit wurde geprüft.
- [ ] Keine Texte sind abgeschnitten oder überlagert.
- [ ] Keine Szene wirkt leer, hektisch oder unfertig.
- [ ] `SICHER ≠ WAHR` bleibt bis zum letzten Frame sichtbar.

## Aktueller Status

```text
PLANUNG VORHANDEN
BILDER NOCH NICHT EINGEFÜGT
VOICEOVER NOCH NICHT EINGEFÜGT
CODEX-ASSEMBLY NOCH NICHT AUSGEFÜHRT
TESTS NOCH NICHT AUSGEFÜHRT
RENDER NOCH NICHT AUSGEFÜHRT
VISUELLE FREIGABE NOCH NICHT ERTEILT
```
