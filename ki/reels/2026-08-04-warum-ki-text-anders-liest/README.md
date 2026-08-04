# Warum KI deinen Text anders liest

**Reel-ID:** `2026-08-04-warum-ki-text-anders-liest`  
**Composition-ID:** `Reel-WhyAIReadsDifferently`  
**Format:** 1080 × 1920, 30 FPS, 36 Sekunden  
**Zielgruppe:** deutschsprachige KI-Einsteiger, 16–35 Jahre  
**Status:** Ein vollständiges MP4 wurde gerendert und anschließend visuell sowie akustisch geprüft. Darauf basierende Verbesserungen sind jetzt im Code; dieser neue Stand muss erneut getestet und gerendert werden.

## Ziel

Das Reel erklärt, warum ein Sprachmodell Text nicht wie ein Mensch liest. Es zeigt die Kette von Tokens über Zahlen, Bedeutungsraum, Attention und Wahrscheinlichkeiten bis zur erzeugten Antwort.

## Kreatives Prinzip

Jede Szene verwendet eine eigene visuelle Familie und eine eigene Hauptbewegung. Eine vollständige Szenenanimation darf im Reel nicht wiederholt werden.

| Szene | Kernidee | Animation-ID |
|---|---|---|
| 1 | Satz wird geordnet in Tokens zerlegt | `sentence-token-shatter-v1` |
| 2 | Tokens werden Zahlen | `token-vector-scanner-v1` |
| 3 | Zahlen ordnen sich im Bedeutungsraum | `embedding-cluster-orbit-v1` |
| 4 | Attention verbindet wichtige Begriffe | `attention-thread-weave-v1` |
| 5 | mögliche nächste Wörter konkurrieren | `next-token-branch-race-v1` |
| 6 | Modellschichten verfeinern die Auswahl | `transformer-layer-elevator-v1` |
| 7 | jedes nächste Wort wird aus Kandidaten gewählt | `answer-word-assembly-v1` |
| 8 | sicherer Klang wird von Wahrheit getrennt | `brilliant-wrong-split-balance-v1` |

## Änderungen nach der MP4-Analyse

- Die 21 unpassenden Synth-, Noise- und Piepsounds wurden entfernt.
- Soundeffekte sind standardmäßig vollständig deaktiviert.
- Optional existiert nur noch ein minimalistischer Modus mit vier sehr leisen, tiefen Akzenten.
- Die Untertitel zeigen keine unsichtbaren zukünftigen Wörter mehr, die leere weiße Flächen verursachen.
- Untertitel arbeiten jetzt als kompaktes rollendes Wortfenster mit maximal neun sichtbaren Wörtern.
- Kontrast von Sekundärtexten, Linien und Akzentfarben wurde für Smartphone-Anzeige erhöht.
- Szene 1 verwendet keine zufällige Token-Streuung mehr, sondern eine geordnete Satz→Fächer→Stack-Choreografie.
- Szene 5 zeigt konsistente Wahrscheinlichkeiten und kennzeichnet Werte klar als Live-Zwischenstand.
- Szene 6 zeigt alle Modellschichten bereits am Anfang und vermeidet die fast leere Anfangsphase.
- Szene 7 wurde als sichtbare Kandidatenauswahl mit Score-Balken und vollständigem Satzaufbau neu aufgebaut.
- Szene 8 nutzt sichere Kartenpositionen ohne abgeschnittenen Text und erklärt den Unterschied zwischen Sicherheit und Beleg deutlicher.

## Soundregel

Der Standard ist:

```text
soundMode: "off"
```

Optional für einen späteren Vergleich:

```text
soundMode: "minimal"
```

Die minimale Variante enthält höchstens vier leise Akzente. Sie darf nur verwendet werden, wenn der vollständige Vergleichsrender eindeutig besser wirkt als die stumme Fassung.

## Dateien

- `reel.json`: Produktionsvertrag
- `voiceover.md`: Sprechtext und Zeitfenster
- `scene-plan.md`: inhaltliche und visuelle Planung
- `remotion-plan.md`: technische Umsetzung
- `PHASE-2-IMPLEMENTATION.md`: Implementierungs- und Prüfstatus
- `asset-prompts.md`: optionale Asset-Prompts
- `audio-plan.md`: ursprüngliche Audioplanung
- `caption.md`: Social-Media-Caption
- `review-checklist.md`: technische und visuelle Abnahme

## Code

```text
ki/src/reels/why-ai-reads-differently/
```

Die Composition ist in `MotionPreviewRoot.tsx` registriert.

## Nächste verbindliche Prüfung

```bash
npm run reel:why-ai:verify
npm run reel:why-ai:smoke
npm run reel:why-ai:stills
npm run reel:why-ai:video
npm run reel:why-ai:check
npm run motion:verify
```

Danach müssen die neue MP4-Fassung ohne SFX und optional eine zweite Fassung mit `soundMode: "minimal"` in normaler Geschwindigkeit verglichen werden.
