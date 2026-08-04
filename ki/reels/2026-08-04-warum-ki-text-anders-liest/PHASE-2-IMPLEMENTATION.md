# Phase 2 – individuelle Remotion-Umsetzung

## Aktueller Status

Für eine frühere Codefassung wurden Typecheck, Tests, 32 Prüfframes und ein vollständiges MP4 erfolgreich erzeugt. Dieses MP4 wurde anschließend als echtes Video und als Kontaktbogen geprüft.

Die Prüfung zeigte:

- Die Animationen sind grundsätzlich brauchbar und verständlich.
- Das synthetische Sounddesign passt stilistisch nicht zum Reel.
- Mehrere Szenen besaßen zu große leere Flächen oder schwache Zwischenzustände.
- Die Untertitel reservierten Platz für noch unsichtbare Wörter.
- Der frühe Zustand der letzten Szene schnitt Kartentext während der Bewegung ab.
- Szene 2 erklärte zwar Zahlenvektoren, aber die Umwandlung `Token → Vektor → Punkt` war visuell nicht deutlich genug.
- Szene 3 zeigte Cluster, erklärte aber den Unterschied zwischen kleiner und großer semantischer Distanz zu wenig konkret.

Diese Punkte wurden im Code überarbeitet. **Der aktuelle Post-Review-Stand wurde noch nicht erneut typegecheckt oder gerendert.** Frühere grüne Berichte dürfen deshalb nicht als Freigabe für den aktuellen Quellstand verwendet werden.

## Tatsächlich analysiertes Video

```text
why-ai-reads-differently.mp4
36.05 Sekunden
1080 × 1920
30 FPS
H.264 + AAC
```

Die Tonspur enthielt keine Sprachaufnahme, sondern hauptsächlich kurze synthetische Soundeffekte mit langen stillen Zwischenräumen.

## Verbesserungen nach der Videoanalyse

### Sound

`SynthSoundtrack.tsx` wurde vollständig reduziert:

- Standard: `soundMode: "off"`
- keine Noise-Sounds
- keine hohen Pieptöne
- keine 21 verteilten Synth-Cues mehr
- optionaler Modus `minimal` mit nur vier leisen, tiefen Akzenten
- Voiceover bleibt unabhängig und optional über `voiceoverSrc`

Die stumme Version ist die Standardfassung. Die minimale Soundfassung darf nur nach einem echten A/B-Vergleich verwendet werden.

### Untertitel

`ReelChrome.tsx` verwendet nun ein kompaktes rollendes Untertitelfenster:

- nur bereits gesprochene Wörter werden dargestellt
- maximal neun Wörter gleichzeitig
- zukünftige unsichtbare Wörter belegen keinen Platz mehr
- kleinere Untertitelbox
- weniger Licht- und Skalierungseffekt
- aktuelles Schlüsselwort bleibt deutlich, ohne den gesamten Satz hektisch zu animieren

### Kontrast

`visualUtils.ts` verwendet dunklere Sekundärtexte, sichtbarere Linien und klarere Akzentfarben für mobile Anzeige.

### Szene 1

Die zufällige Streuung wurde entfernt. Neuer Ablauf:

```text
Satz als geordnete Wortfolge
→ Token-Grenzen werden sichtbar
→ kontrollierter Fächer
→ vertikaler Token-Stack für den Scanner
```

Dadurch ist die Bewegung nachvollziehbarer und die Bildmitte besser genutzt.

### Szene 2

Die Scanner-Szene wurde als klarer Transformationsprozess neu organisiert:

```text
TOKEN
→ drei sichtbare Zahlen-Koordinaten
→ räumlicher Punkt
```

Verbesserungen:

- alle vier Zeilen sind bereits als schwache Struktur sichtbar
- der Scanner aktiviert die Zeilen nacheinander
- jede Zahl erhält ein eigenes lesbares Koordinatenfeld
- jede Zeile endet mit einer eindeutigen Punktdarstellung
- `TOKEN → VEKTOR → PUNKT` bleibt als stabile Erklärung sichtbar
- deutlich weniger ungenutzte Fläche und keine anonymen Platzhalterboxen

### Szene 3

Der Bedeutungsraum wurde stärker auf Verständnis statt 3D-Dekoration ausgerichtet:

- Clusterflächen sind bereits früh als Orientierung sichtbar
- Begriffe kommen kontrolliert aus einem gemeinsamen Datenstrom
- Verbindungen innerhalb der Cluster werden sichtbar gezeichnet
- die Kameradrehung wurde entfernt, damit mobile Lesbarkeit stabil bleibt
- konkrete Distanzbeispiele erklären das Prinzip:
  - `Hund ↔ Katze = 0,18`
  - `Hund ↔ Zug = 0,82`
- der feste Hinweis `kleine Distanz = ähnliche Bedeutung` erklärt die Aussage ohne Ton

### Szene 5

- Wahrscheinlichkeiten summieren sich in allen Phasen zu 100 Prozent.
- Der spätere Gewinner liegt nicht mehr zunächst sichtbar hinter einem anderen Kandidaten.
- Die Anzeige ist als `LIVE-ZWISCHENSTAND` gekennzeichnet.
- Der Gewinnerzustand erhält einen längeren lesbaren Hold.

### Szene 6

- Alle vier Modellschichten sind bereits im Anfangszustand sichtbar.
- Die fast leere Phase zu Beginn wurde entfernt.
- Der aktive Verarbeitungsschritt wird stärker markiert.
- Abgeschlossene Schichten erhalten einen sichtbaren Status.
- Der Ausgang `Muster → nächstes Wort` ist klarer.

### Szene 7

Die bisherige räumliche Wortstreuung wurde vollständig ersetzt:

```text
mögliche nächste Wörter
→ Prozentwerte verändern sich
→ Gewinner wird übernommen
→ Satz wächst sichtbar
→ stabiler vollständiger Endzustand
```

Damit erklärt die Szene tatsächlich das autoregressive Prinzip und nutzt die verfügbare Fläche besser.

### Szene 8

- Karten werden nicht mehr über Clip-Paths innerhalb einer gedrehten Fläche enthüllt.
- Beide Karten bleiben während der gesamten Bewegung innerhalb der Safe-Zone.
- `95 % sicher formuliert` wird sichtbar von `Quelle fehlt` getrennt.
- Die Waage kippt kontrollierter.
- Der Abschluss zeigt die drei Prüfanker `Quelle`, `Datum`, `Beleg`.

## Zusammensetzung

```text
ki/src/reels/why-ai-reads-differently/
├── contract.ts
├── visualUtils.ts
├── ReelWhyAIReadsDifferently.tsx
├── components/
├── scenes/
└── __tests__/
```

## Verbindliche erneute Prüfung

```bash
npm run reel:why-ai:verify
npm run reel:why-ai:smoke
npm run reel:why-ai:stills
npm run reel:why-ai:video
npm run reel:why-ai:check
npm run motion:verify
```

Danach visuell prüfen:

- Szene 1: Token-Fächer und Scanner-Übergabe
- Szene 2: alle vier Zeilen, Koordinatenfelder, Scanbalken und Punkt-Handoff
- Szene 3: Clusterverbindungen, Distanzkarten und mobile Lesbarkeit
- Szene 5: alle Zwischenstände und Gewinner-Hold
- Szene 6: erster Frame, Layer-Aktivierung und Ausgang
- Szene 7: jede Kandidatenphase und vollständiger Satz
- Szene 8: Karten während des Einfliegens, Waage und CTA
- Untertitelbox bei kurzen und langen Sätzen

## Freigaberegel

Der aktuelle Stand gilt erst als freigegeben, wenn:

- TypeScript erfolgreich ist
- alle Reel-Tests erfolgreich sind
- 32 aktuelle PNG-Prüfframes existieren
- das aktuelle MP4 gerendert wurde
- `release-report.json` den aktuellen Quellfingerprint enthält
- die stumme Version in normaler Geschwindigkeit visuell geprüft wurde
- eine optionale Minimal-SFX-Version nur bei eindeutig besserem Ergebnis gewählt wird

```text
Status: ZWEITE VISUELLE POLITUR UMGESETZT, ERNEUTE PRÜFUNG UND NEUER RENDER AUSSTEHEND
```
