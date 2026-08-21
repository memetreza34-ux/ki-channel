# KI-Kanal — Plattform- und Publishing-Gehirn

Diese Datei regelt, wie ein fertiger Inhalt auf einzelne Plattformen verteilt wird. Sie ergänzt `MASTER.md`, `KANAL.md`, `REELS.md` und `PRODUKTIONSABLAUF.md`.

## Grundprinzip: Content einmal, Publishing mehrfach

Short-Form wird **nicht pro Plattform neu produziert**.

Kanonische Quelle:

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/
```

Kanonischer ausführbarer Source:

```text
ki/src/reels/<slug>/
```

Für Short-Form wird nur angepasst, was technisch zwingend ist. Inhaltlich gelten überall:

- derselbe freigegebene Master
- dieselbe direkt kopierbare Caption
- genau dieselben fünf Hashtags
- keine PDF

Cover-/Startframe-Auswahl oder Exportformat dürfen nur bei technischer Notwendigkeit abweichen.

Keine zweite Kopie des Skripts, der Szenenlogik oder des Remotion-Sources anlegen.

## Plattformen

Der aktuelle Publishing-Bereich liegt unter:

```text
ki/plattformen/
├── youtube/
├── instagram/
├── tiktok/
├── facebook/
└── snapchat/
```

Diese Ordner enthalten Regeln und Templates, **nicht** duplizierte Reel- oder Longform-Masterdateien.

## Reel-Publishing-Metadaten

Jedes neue Reel erhält in Phase 1:

```text
03-caption/platform-copy.md
```

Darin steht ausschließlich eine gemeinsame, kopierfertige Caption für YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat. Sie endet mit genau fünf thematisch passenden Hashtags. Keine Überschriften, Labels oder Plattformvarianten in dieser Datei.

## YouTube Shorts

- verwendet den freigegebenen vertikalen Reel-Master aus `05-export/`
- kein zweiter Source-Ordner
- als Upload-Titel den freigegebenen Reel-Titel verwenden
- die universelle Caption unverändert als Beschreibung verwenden
- Thumbnail/Cover nur separat erzeugen, wenn es einen echten Mehrwert hat
- keine erfundenen Superlative oder irreführenden Versprechen

Details: `../plattformen/youtube/SHORTS.md`.

## YouTube Longform — aktiv

Longform ist **ein eigenes aktives Format** und darf nicht automatisch aus einem Reel aufgeblasen werden.

Kanonisches Produktionspaket:

```text
ki/youtube-longform/YYYY-MM-DD/NN_Video-Titel/
```

Kanonischer Source:

```text
ki/src/longform/<slug>/
```

Für die aktuelle Startphase werden Longform-Videos auf **5:00 bis 6:00 Minuten** geplant und final gehalten. Das ist eine bewusste Kanalentscheidung; längere Laufzeiten erst verwenden, wenn der Nutzer diese Vorgabe ausdrücklich ändert.

Vor jeder Longform-Produktion zuerst `ki/plattformen/youtube/LONGFORM.md`, danach `ki/youtube-longform/AGENTS.md` und den lokalen Paketvertrag lesen.

Aktives erstes Video:

```text
ki/youtube-longform/2026-08-16/01_Mit-KI-eine-App-bauen/
```

Longform besitzt eigenes Skript, Kapitel, Visualplan, Thumbnail, Metadaten, Export und Source. Der Plattformordner `ki/plattformen/youtube/` bleibt Regel-/Template-Ebene und darf keine zweite Produktionswahrheit anlegen.

## Instagram / TikTok / Facebook / Snapchat

Diese Plattformen verwenden denselben freigegebenen Short-Form-Master und dieselbe universelle Caption mit genau fünf Hashtags. Keine eigenen Hook-, Caption- oder CTA-Varianten anlegen.

## Aktualitätsregel

Plattformregeln, Upload-Limits, Monetarisierungsbedingungen und Produktfunktionen können sich ändern. Solche aktuellen Plattformfakten **nicht** als dauerhafte Repo-Wahrheit festschreiben, wenn sie zeitabhängig sind. Vor einer konkreten Veröffentlichung bei Bedarf aktuell prüfen.

## Qualitätsregel

Publishing ist erst sauber, wenn:

- nur ein kanonischer Master pro Format existiert
- keine Plattformkopie die Produktionswahrheit ersetzt
- Reel-Titel und universelle Caption keine falschen Versprechen enthalten
- `platform-copy.md` direkt kopierbar ist und genau fünf Hashtags enthält
- Cover/Thumbnail der tatsächlichen Aussage entspricht
- Plattformtexte nicht unnötig denselben Sprechertext vollständig wiederholen
- bei Longform finale Kapitelzeitstempel aus dem tatsächlich verwendeten Audio stammen
- aktuelle Plattformregeln bei Bedarf separat verifiziert wurden
