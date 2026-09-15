# YouTube Longform — harte Render-Gates

Gilt für Longform v1 ab 2026-09-05.

## Grundsatz

Ein technisch renderbares Remotion-Projekt ist **noch kein zulässiger Produktionsrender**. Longform darf für Review/Release nur über den kanonischen, gegateten Renderpfad erzeugt werden.

Direkte Befehle wie `npx remotion render ...` sind für Experimente erlaubt, aber ihr Ergebnis darf niemals als Review-Master, Freigabe oder Release-Artefakt behandelt werden.

## Kanonischer Render

```bash
node scripts/render-ki-longform-master.mjs <longform-package>
```

Der Befehl führt zwingend aus:

1. `check-ki-longform-render-readiness.mjs`
2. `create-ki-longform-render-lock.mjs`
3. Remotion H.264 / CRF 18 / yuv420p
4. Zwei-Pass-Audio-Mastering auf ca. -16 LUFS / -1.5 dBTP
5. `check-ki-longform-master.mjs`
6. automatische Kontaktbögen alle ca. 8 Sekunden
7. `RENDER-RESULT.json`

Das Ergebnis ist nur:

`LONGFORM_REVIEW_CANDIDATE_READY_NOT_RELEASED`

Erst kompletter 1x-Review + Release-Gate dürfen daraus einen finalen Upload-Master machen.

## Pre-Render Readiness — harte Sperren

Render wird blockiert, wenn mindestens eines zutrifft:

- Nutzer-Voiceover fehlt
- Kapitel sind nicht `VOICE_LOCKED`/`READY`
- letzte Kapitelzeit passt nicht zum echten Voiceover
- Claims sind nicht fact-checked/ready
- notwendige Medien sind nicht `APPROVED`
- lokale Mediendatei fehlt
- Medien-SHA256 stimmt nicht
- Rechteprüfung fehlt
- generiertes Medium soll einen realen Claim beweisen
- `compositionId` fehlt
- Composition ist nicht in `ki/src/Root.tsx` registriert
- Source-Ordner hat keine TSX-Implementierung
- Source enthält sichtbare Platzhalter wie `TODO`, `TBD`, `PLACEHOLDER`, `Payoff Visual`, `Demo Visual`, `B-Roll here`
- Source bindet direkte Remote-Bild-/Video-URLs
- Longform-Source besitzt uncommitted/untracked Änderungen

Damit darf ein README-only-, Placeholder- oder Fake-Media-Prototyp nicht mehr zum Produktionsrender werden.

## Render-Lock

Vor dem Render entsteht:

```text
06-projektdateien/RENDER-LOCK.json
```

Er bindet mindestens:

- Git-HEAD
- Composition-ID
- Voiceover
- Kapitel
- Claims
- Media-Plan
- Thumbnail-Plan
- Visual-Plan, falls vorhanden
- alle tatsächlich benötigten Medien
- Longform-TS/TSX-Source
- Composition-Registry

Alle Dateien werden mit SHA-256 gebunden. Dadurch ist nachvollziehbar, **welche exakten Bytes** gerendert wurden.

## Post-Render Master-QA

`check-ki-longform-master.mjs` prüft den exakten gemasterten MP4-Review-Kandidaten.

Harte Gates:

- H.264
- 1920x1080
- 30 FPS
- yuv420p
- AAC / 48 kHz / Stereo
- absurd niedrige 1080p-Videobitrate blockieren
- Audio-/Video-Dauer dürfen nicht deutlich auseinanderlaufen
- Tail-Stille > 2 Sekunden blockieren
- statische/Freeze-Strecke >= 15 Sekunden blockieren
- statische Strecke ab 8 Sekunden erzeugt Warnung
- Integrated Loudness muss ungefähr -16 LUFS sein
- True Peak <= -1 dBTP
- sehr hohe Loudness Range blockieren

QA-Report:

```text
06-projektdateien/review/MASTER-QA.json
```

## Visueller Review

Automatisch werden Kontaktbögen erzeugt:

```text
06-projektdateien/review/CONTACT-SHEET-*.jpg
```

Sie sind Pflicht für schnellen Makro-Review auf:

- wiederholte Layouts
- leere Placeholder-Flächen
- ungewollte Standbilder
- fehlende Visual-World-Wechsel
- abgeschnittene Titel
- Farbdrift
- zu häufiges Wiederverwenden desselben Screenshots/B-Rolls

Der Kontaktbogen ersetzt nicht den kompletten 1x-Review.

## Fehlrender-Regression 2026-09-06

Der hochgeladene Astra-Test zeigte genau die Fehler, die diese Gates künftig abfangen müssen:

- ca. 84,5 Sekunden Stille am Ende
- mehrere statische Blöcke von ca. 33 bis 67 Sekunden
- sichtbare Platzhalter wie `Astra praktisch Visual` / `Payoff Visual`
- extrem niedrige 1080p-Videobitrate
- Audio deutlich unter Ziel-Lautheit und gleichzeitig stark übersteuernde Peaks
- geplante reale Medien nicht materialisiert
- Source im kanonischen Branch noch nicht als echte TSX-Composition vorhanden

Dieser Test darf nicht repariert oder als Basis weiterverwendet werden. Er ist ein Negativbeispiel für die Render-Gates.

## Statusbegriffe

```text
PROTOTYPE_RENDER
REVIEW_CANDIDATE
MASTER_QA_PASSED
HUMAN_1X_REVIEW_PASSED
RELEASE_READY
```

Diese Begriffe dürfen niemals gleichgesetzt werden.
