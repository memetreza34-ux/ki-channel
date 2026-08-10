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

Diese Ordner enthalten Regeln und Templates, **nicht** duplizierte Reel-Masterdateien.

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

## YouTube Longform

Longform ist **ein eigenes Format** und darf nicht automatisch aus einem Reel aufgeblasen werden.

Für die aktuelle Startphase des Kanals werden Longform-Videos auf **5:00 bis 6:00 Minuten** geplant und final gehalten. Das ist eine bewusste Kanalentscheidung; längere Laufzeiten erst verwenden, wenn der Nutzer diese Vorgabe ausdrücklich ändert.

Wenn der Nutzer ausdrücklich ein längeres YouTube-Video verlangt, zuerst die Longform-Regeln unter `ki/plattformen/youtube/LONGFORM.md` lesen. Erst dann ein eigenes Produktionspaket planen.

Bis ein Longform-Workflow ausdrücklich aktiviert wird, bleibt `ki/reels/` ausschließlich Short-Form.

## Instagram / TikTok / Facebook / Snapchat

Diese Plattformen dürfen denselben freigegebenen Master verwenden. Unterschiedlich sind primär Hook-Verpackung, Caption und CTA. Die fachliche Aussage, Animation und Voiceover-Wahrheit bleiben gleich.

## Aktualitätsregel

Plattformregeln, Upload-Limits, Monetarisierungsbedingungen und Produktfunktionen können sich ändern. Solche aktuellen Plattformfakten **nicht** als dauerhafte Repo-Wahrheit festschreiben, wenn sie zeitabhängig sind. Vor einer konkreten Veröffentlichung bei Bedarf aktuell prüfen.

## Qualitätsregel

Publishing ist erst sauber, wenn:

- nur ein kanonischer Master existiert
- keine Plattformkopie die Produktionswahrheit ersetzt
- Titel/Captions keine falschen Versprechen enthalten
- Cover/Thumbnail der tatsächlichen Aussage entspricht
- Plattformtexte nicht unnötig denselben Sprechertext vollständig wiederholen
- aktuelle Plattformregeln bei Bedarf separat verifiziert wurden
