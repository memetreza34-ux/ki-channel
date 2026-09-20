# 🎬 Bewegungssprache

Verbindliche Motion-Regeln für den Kanal. Abgeleitet aus dem Ton in `KANAL.md`
und der Methode aus `.claude/skills/motion-art-direction`.

Die Regel darüber: **erst die Sprache festlegen, dann animieren.** Einheitlichkeit
liest sich als Souveränität, Abwechslung als Lärm. Im Zweifel wiederverwenden,
nicht neu erfinden.

## Einordnung

`KANAL.md` sagt: modern, klar, kompetent. Ohne Hype-Lärm, ohne Fake-Wunder,
ohne Panikmache. Weißes Editorial mit Marken-Lila.

Das ergibt in der Ton-Matrix genau eine Zelle:

|  | Weich | **Scharf** |
|---|---|---|
| **Ruhig** | Luxus, Wellness | ← **hier: Premium-Tech, editorial** |
| Kinetisch | verspielt, Lifestyle | Sport, Hype |

**Bewegungspersönlichkeit: Corporate.** Sauber, professionell, vertrauenswürdig.
Nicht „Playful", nicht „Energetic" — ein Kanal, der Fake-Wunder ablehnt, darf
sich nicht wie ein Spielzeug bewegen.

## Die Spezifikation

| Eigenschaft | Festlegung |
|---|---|
| Signaturkurve | `cubic-bezier(0.2, 0, 0, 1)` — `MOTION_EASING.enter` |
| Grundtakt | 12 Frames (0,4 s bei 30 fps) |
| Dauernskala | Mikro 6 · Standard 12 · Hero 18–24 Frames |
| Übergangsfamilie | Harter Schnitt. Überblendung nur bei echter semantischer Kontinuität |
| Staffelrhythmus | `staggerDelay()`, Deckel 21 Frames pro Gruppe |
| Bewegungsintensität | Weg ≤ 1/3 Bildhöhe · Skalierung 0,88 → 1,0 · **Überschwinger 0 %** |
| Ruhedisziplin | ≥ 9 Frames Stillstand nach jedem Beat |

## Erlaubte Kurven

Höchstens zwei Kurven für den Normalfall: eine für Eintritte, eine für Austritte.
Eine dritte muss sich rechtfertigen.

| Kurve | Wofür | Rechtfertigung |
|---|---|---|
| `enter` | Eintritt, Aufzeichnen, Einschwingen | Signaturkurve, ~90 % aller Bewegungen |
| `exit` | Austritt, Abtreten, Verblassen | Die zweite erlaubte Kurve |
| `move` | Versetzen bei sichtbar bleibendem Element | Gerechtfertigt: eine Verschiebung startet und endet in Ruhe, ein Eintritt nicht |
| `loop` | ausschließlich Endlos-Schleifen | Kein wahrnehmbares Einzelereignis |
| `anticipate` | **derzeit ungenutzt** | Anlauf heißt Gegenbewegung unter den Startwert. Die Kurve dippt auf −0,56 und sprengt damit das Intensitätsbudget von 0 % Überschwinger. Bleibt definiert, wird aber nicht eingesetzt, solange die Persönlichkeit Corporate ist |
| `pop` | **gesperrt** | Überschwinger liest sich als Spielzeug. Widerspricht „keine Fake-Wunder" |

## Bewegungshierarchie

Nicht alles verdient Bewegung. Pro Bild gilt genau **ein** Held.

| Ebene | Was | Wie |
|---|---|---|
| Held | Worum das Bild geht | Größte, langsamste, am stärksten geeaste Bewegung |
| Stütze | Kontext, der den Helden tragen hilft | Kleiner, schneller, weicht aus, konkurriert nie |
| Textur | Hintergrund, Korn, Drift | Unterschwellig. Langsam, kontrastarm, kein harter Schnitt |

Konkurrieren zwei Elemente um das Auge, ist die Regie gescheitert — eines wird
zur Stütze zurückgestuft.

## Zurückhaltung

- Nie das ganze Bild gleichzeitig bewegen. Ein Anker bleibt stehen.
- Keinen Übergang übergangen: nicht Wischer **und** Drehung **und** Blende.
- Keine Schleifenbewegung an Text, den der Zuschauer gerade liest.
- Kein Überschwinger bei Erklärinhalten.
- Ein „Wow"-Moment pro Stück. Ein zweiter hebt den ersten auf.

## Prüfung vor dem Rendern

`ki/src/motion/__tests__/bewegungssprache.test.ts` prüft maschinell:
Signaturkurve vorhanden, `pop` nirgends im Produktionscode, Staffelung
gedeckelt, keine rohe lineare Zeitachse.

Was die Maschine nicht prüfen kann und der Mensch prüfen muss: genau ein Held
pro Bild, Ruhedisziplin zwischen den Beats, ein Wow-Moment pro Stück.

## Offene Punkte

- **Fokuspunkt.** Die Bühne der Prototypen sitzt bei ungefähr y=870 auf 1080×1920.
  Der Drittelpunkt läge bei y=640 oder y=1280. Eine Verschiebung würde die
  Komposition aller Prototypen ändern und ist deshalb eine bewusste Entscheidung,
  keine Korrektur nebenbei.
- **Sichere Zonen** sind bereits geregelt, siehe `CAPTION_SAFE_POSITION.md`. Der
  Animations-Cutoff bei y=1440 hält die unteren 480 px frei und liegt damit im
  dort definierten Puffer.
