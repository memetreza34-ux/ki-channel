# Skill: Motion Readability + Light-First

## Zweck

Dieser Skill gilt für **jedes zukünftige Short-Form-Reel**. Er verhindert zwei wiederkehrende Qualitätsfehler:

1. Animationen/Zustandswechsel werden so schnell gezeigt, dass sie zwar technisch vorhanden, aber beim normalen Anschauen nicht sauber erfassbar sind.
2. Einzelne dunkle Vollbild-Szenen brechen plötzlich den hellen, sauberen visuellen Stil des restlichen Reels.

High Energy bedeutet **nicht** maximale Geschwindigkeit. Ziel ist hohe visuelle Dichte bei klarer Lesbarkeit.

## Harte Light-First-Regel

Standard für den KI-Kanal ist **LIGHT_FIRST**.

- Vollbild-Hintergründe grundsätzlich hell: Offwhite, Hellgrau, sehr helles Cyan, Mint, Blau, Creme oder vergleichbare helle Töne.
- Dunkle Typografie auf hellem Grund ist der Default.
- Akzentfarben dürfen kräftig sein: Cyan, Blau, Grün, Orange, Rot, Gelb, Lila usw.
- Dunkle Cards/Objekte innerhalb einer hellen Szene sind erlaubt, wenn sie semantisch sinnvoll sind.
- **Dunkle Fullscreen-Szenen sind standardmäßig nicht zulässig.**
- Eine dunkle Fullscreen-Szene ist nur erlaubt, wenn der Nutzer sie ausdrücklich verlangt oder ein zwingendes reales Quellmotiv dies erfordert. Die Ausnahme muss in `MOTION-READABILITY-REVIEW.md` dokumentiert werden.
- Kein einzelner Stilbruch wie `4 helle Szenen → 1 schwarze/dunkelblaue Szene → wieder hell`, nur um künstlich Variation zu erzeugen.

## Motion-Readability-Grundsatz

Jeder wichtige visuelle Zustand braucht drei Phasen:

```text
REVEAL → SETTLE → READABLE HOLD
```

Ein Element gilt nicht als verständlich, nur weil es für wenige Frames sichtbar war.

### Richtwerte bei 30 fps

- einfacher Entrance / Morph: meist ungefähr **8–18 Frames** (`0.27–0.60 s`)
- Settle nach Entrance: ungefähr **4–8 Frames**
- wichtiger neuer Informationszustand: danach mindestens ungefähr **12–24 Frames** klar lesbar (`0.4–0.8 s`)
- Hero-/Payoff-Zustand: meist **18–30 Frames** (`0.6–1.0 s`) halten, sofern Audio/Story es zulassen
- zwischen zwei unabhängigen neuen Informationen normalerweise mindestens **6–12 Frames** Staffelung

Diese Werte sind keine starre Schablone. Wenn ein Label länger oder komplexer ist, braucht es mehr Zeit. Wenn der Sprecherabschnitt zu kurz ist, wird die Visualisierung **vereinfacht**, nicht unlesbar beschleunigt.

## Maximal zwei neue Dinge gleichzeitig

Nicht gleichzeitig neu einführen:

- neue Card
- neue Zahl
- neues Label
- neuer Pfeil
- neuer Status
- neue Kameraaktion

wenn der Zuschauer mehrere davon aktiv lesen/verstehen muss.

Faustregel: **höchstens 1–2 unabhängige neue Informationsobjekte gleichzeitig**. Danach kurzer Settle/Hold, dann nächste Information.

Beispiel schlecht:

```text
Antwort erscheint + SCHNELL-Card + NIEDRIG-Card + Progressbar + Kamera-Zoom gleichzeitig
```

Beispiel besser:

```text
Antwort erscheint
→ kurzer Hold
→ SCHNELL
→ kurzer Hold
→ NIEDRIG
→ gemeinsamer Payoff
```

## Audio ist Timing-Autorität, Lesbarkeit bleibt Gate

Nach echtem Voiceover:

1. Whisper-/Voice-Lock-Timestamps verwenden.
2. Visual Trigger an die gesprochene Phrase binden.
3. Prüfen, ob der entstehende Zeitraum für Reveal + Hold reicht.
4. Wenn nicht: Visual Beat vereinfachen, weniger Elemente zeigen oder Szenenprogression neu verteilen.
5. Nicht mehrere semantische Zustände in einen zu kurzen Audioabschnitt quetschen.

**Verbot:** Ein zu kurzer Sprecherabschnitt darf nicht dadurch „gelöst“ werden, dass drei wichtige Visuals in 5–10 Frames durchblitzen.

## Motion Timing Contract pro Beat

`animation-plan.md` soll für wichtige Beats zusätzlich dokumentieren:

```text
Sprecherphrase
→ Trigger / Start
→ Reveal-Dauer
→ Settle
→ lesbarer Hold
→ nächster semantischer Trigger
→ welche Information muss in diesem Hold verstanden werden?
```

Wenn `lesbarer Hold` für einen kritischen Zustand praktisch `0` ist, ist der Beat nicht freigabefähig.

## Keine künstliche Dauer durch Stillstand

Die Gegenrichtung bleibt ebenfalls falsch:

- nicht 3 Sekunden unverändert stehen, während neue Sprecherbedeutung kommt
- Hold nur so lange, wie zum Erfassen nötig
- danach soll die Story weitergehen

Ziel:

```text
nicht hektisch
+ nicht statisch
= klar kalibrierte Progression
```

## Post-Render-1x-Test

Der tatsächliche MP4 muss bei **normaler Geschwindigkeit (1x)** geprüft werden.

Ein Beat fällt durch, wenn:

- man pausieren oder zurückspulen muss, um ein wichtiges Element zu lesen
- ein wichtiges Element bereits wieder verschwindet, bevor es geistig erfasst werden kann
- mehrere neue Elemente so gleichzeitig erscheinen, dass unklar ist, wohin man schauen soll
- ein Hero-Moment sofort vom nächsten Zustand überschrieben wird
- die Szene formal animiert ist, aber der Ablauf subjektiv gehetzt wirkt

Bei einem Fail:

```text
Timing im Source ändern
→ ggf. Elemente reduzieren
→ Rerender
→ erneut bei 1x prüfen
```

## Pflichtdatei pro neuem Reel

Jedes neue Reel bekommt:

`06-projektdateien/MOTION-READABILITY-REVIEW.md`

Mindestens diese maschinenlesbaren Statuszeilen müssen enthalten sein:

```text
STATUS: PASS
LIGHT_FIRST: PASS
DARK_FULL_FRAME_SCENES: 0
DARK_EXCEPTION_APPROVED: NO
TOO_FAST_BEATS: 0
SIMULTANEOUS_INFO_OVERLOADS: 0
MIN_CRITICAL_HOLD_FRAMES: 12
POST_RENDER_1X_REVIEW: PASS
```

Wenn eine ausdrücklich genehmigte dunkle Fullscreen-Ausnahme existiert:

```text
DARK_FULL_FRAME_SCENES: 1
DARK_EXCEPTION_APPROVED: YES
DARK_EXCEPTION_REASON: <konkrete Begründung>
```

## Freigabe

Ohne bestandenes Motion-Readability-Gate darf ein Reel weder visuell `approved` noch `FINAL VIDEO READY` werden.

Der Maßstab ist nicht, wie viele Animationen eingebaut wurden, sondern wie viele davon der Zuschauer beim ersten normalen Anschauen **klar versteht**.
