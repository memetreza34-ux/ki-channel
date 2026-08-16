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

Plattformen verändern nur, was wirklich plattformspezifisch ist:

- Titel
- Beschreibung / Caption
- Hashtags / Keywords
- Cover-/Thumbnail-Auswahl
- CTA, falls sinnvoll
- ggf. technisch notwendiger Export, wenn eine Plattform ihn verlangt

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

Darin werden getrennt vorbereitet:

- neutraler Kerntitel
- YouTube-Shorts-Titel/Beschreibung
- Instagram-Caption
- TikTok-Caption
- Facebook-Reels-Caption
- Snapchat-Kurztext, falls genutzt
- optionale Hashtags/Keywords

Plattformtexte dürfen die inhaltliche Aussage nicht verändern oder sensationeller machen als das Reel selbst.

## YouTube Shorts

- verwendet den freigegebenen vertikalen Reel-Master aus `05-export/`
- kein zweiter Source-Ordner
- Titel soll die Kernfrage oder den Aha-Effekt klar machen
- Beschreibung ergänzt knapp, statt den Sprechertext vollständig zu kopieren
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

Diese Plattformen dürfen denselben freigegebenen Short-Form-Master verwenden. Unterschiedlich sind primär Hook-Verpackung, Caption und CTA. Die fachliche Aussage, Animation und Voiceover-Wahrheit bleiben gleich.

## Aktualitätsregel

Plattformregeln, Upload-Limits, Monetarisierungsbedingungen und Produktfunktionen können sich ändern. Solche aktuellen Plattformfakten **nicht** als dauerhafte Repo-Wahrheit festschreiben, wenn sie zeitabhängig sind. Vor einer konkreten Veröffentlichung bei Bedarf aktuell prüfen.

## Qualitätsregel

Publishing ist erst sauber, wenn:

- nur ein kanonischer Master pro Format existiert
- keine Plattformkopie die Produktionswahrheit ersetzt
- Titel/Captions keine falschen Versprechen enthalten
- Cover/Thumbnail der tatsächlichen Aussage entspricht
- Plattformtexte nicht unnötig denselben Sprechertext vollständig wiederholen
- bei Longform finale Kapitelzeitstempel aus dem tatsächlich verwendeten Audio stammen
- aktuelle Plattformregeln bei Bedarf separat verifiziert wurden
