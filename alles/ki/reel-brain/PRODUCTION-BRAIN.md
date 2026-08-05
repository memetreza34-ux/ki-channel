# KI-Reel-Produktionsgehirn

## Zweck

Dieses Dokument ist die dauerhafte Wahrheit für den gesamten KI-Reel-Workflow. Es verhindert, dass bei jedem Reel erneut geklärt werden muss, wer plant, wer Assets erzeugt, wer programmiert und wann ein Reel wirklich fertig ist.

## Klare Aufgabenverteilung

### Planung und Vorbau

Vor dem Einfügen externer Assets werden vollständig erstellt:

- Thema, Hook und redaktionelle Struktur
- finaler deutscher Voiceover-Text
- Szenenreihenfolge und Kernaussage jeder Szene
- Bildentscheidung pro Szene
- vollständige Bildprompts und exakte Dateinamen
- Überschriften, Untertitelregeln und wichtige Wortreaktionen
- individuelle Hauptanimationen und Übergänge
- ausführbarer Remotion-Code für sämtliche Szenen
- Audiovertrag, Assetvertrag, Tests und Render-Checkpoints
- fertiger Auftrag für Codex

Die Planung ist kein loses Konzept. Der Remotion-Code muss bereits existieren, bevor der Nutzer Bilder und Audio einfügt.

### Nutzer

Der Nutzer muss nur:

1. die freigegebenen Bildprompts verwenden
2. die Bilder unter den exakt vorgegebenen Dateinamen ablegen
3. das Voiceover aus dem finalen Text in normaler Quellgeschwindigkeit erzeugen
4. `voiceover.wav` in den Audioordner legen
5. Codex mit dem vorhandenen Auftrag starten
6. das finale MP4 persönlich freigeben

Der Nutzer muss keine Frames planen, keine Animationen erfinden und keine Remotion-Komponenten schreiben.

### Codex

Codex ist nach dem Einfügen der Assets Produktionsingenieur, nicht Creative Director. Codex:

1. prüft Branch und Arbeitsbaum
2. liest dieses Gehirn und den Reel-Auftrag
3. prüft alle realen Assets
4. kopiert sie in den Remotion-Public-Ordner
5. transkribiert das finale Voiceover mit Wortzeiten
6. rechnet die Wortzeiten auf die tatsächliche Wiedergabe bei 1,10x um
7. ersetzt die vorläufigen Cues durch echte Cues
8. richtet Hauptanimationen, Wortreaktionen und Szenenwechsel an den echten Zeiten aus
9. führt TypeScript und fokussierte Tests aus
10. rendert Smoke- und Checkpoint-Frames
11. prüft jeden Frame groß und in Smartphone-Größe
12. korrigiert Überlappungen, leere Starts, schlechte Holds und schwache Synchronität
13. rendert das vollständige MP4
14. sieht das gesamte MP4 in normaler Videogeschwindigkeit an
15. führt technische Artefaktprüfung aus
16. markiert nur tatsächlich bestandene Review-Punkte

## Audiovertrag

```text
Quelldatei: voiceover.wav bei 1,00x erzeugen
Remotion playbackRate: 1.10
Tonhöhe: natürlich erhalten
Musik: aus
Soundeffekte: aus
```

Das Audio darf nicht vorab extern auf 1,10x beschleunigt werden, sonst entsteht doppelte Beschleunigung. Der endgültige Taktgeber ist immer die reale Audiodatei.

### Transcript-Synchronisierung

Vorläufige Untertitel-Cues dienen nur dem Vorbau. Nach Einfügen von `voiceover.wav` muss Codex echte Wortzeiten ermitteln.

Für einen Wortzeitpunkt `t` in der 1,00x-Quelldatei gilt:

```text
Videosekunde = t / 1.10
Videoframe = round(Videosekunde × 30)
```

Untertitel, wichtige Wortreaktionen und erklärende Zustandswechsel verwenden dieselben berechneten Zeitpunkte. Keine getrennten Schätzsysteme.

### Wenn das Audio nicht in die geplante Dauer passt

Inhalt und Szenenreihenfolge bleiben gesperrt. Framegrenzen dürfen technisch angepasst werden, wenn die finale 1,10x-Tonspur sonst abgeschnitten wäre oder unnatürlich gequetscht werden müsste. Dabei:

- keinen Satz abschneiden
- keine Wörter entfernen
- keine künstlichen Sprechpausen ergänzen
- Ergebnis-Holds erhalten
- `reel.json`, Checkpoints, Tests und Renderplan gemeinsam aktualisieren
- Abweichung im Abschlussbericht nennen

## Bildvertrag

Bilder werden ausschließlich anhand der freigegebenen Prompts erzeugt. Codex darf kein fehlendes Bild ersetzen.

Ein Bild ist nur ein visueller Anker. Remotion übernimmt:

- Überschriften und Untertitel
- Zahlen, Diagramme und Labels
- Fokusrahmen und Quellenstatus
- Masken und regionale Reveals
- Zustandsänderungen
- Connectoren und Übergänge

Ein flaches Bild darf nicht so behandelt werden, als seien seine Objekte echte getrennte Ebenen. Erlaubt sind nur ehrliche Masken, lokale Hervorhebung, leichte Tiefenwirkung und darüberliegende Remotion-Elemente.

## Animationsvertrag

Jede Szene folgt:

```text
lesbarer Startzustand
→ sichtbare Ursache
→ eine dominante Hauptbewegung
→ sichtbare Wirkung
→ stabiler Ergebnis-Hold
```

Regeln:

- eine dominante Erklärung pro Satz
- höchstens drei starke gleichzeitige Bewegungen
- jedes gesprochene Wort im Untertitel
- maximal neun Wörter gleichzeitig
- nur wichtige Wörter stark hervorheben
- kein generischer Dauerzoom
- kein Dauerpuls, kein Partikelteppich, kein zufälliges Wackeln
- Hard Cut als Standard
- Übergang nur bei weitergeführtem Objekt, Form, Richtung oder Zustand
- keine doppelte Vollanimation innerhalb eines Reels
- keine direkt wiederholte Layout- oder Bewegungssignatur

## Qualitätsgates

### Technisch

- korrekte Auflösung, FPS und Dauer
- fortlaufende Szenengrenzen
- gültige Assetpfade
- geordnete Cues innerhalb der Szenen
- TypeScript bestanden
- fokussierte Tests bestanden
- gültige PNG- und MP4-Artefakte

### Visuell

- keine abgeschnittenen Texte
- keine Überlappung von Headline, Hauptvisual und Untertitel
- keine leeren Szenenanfänge
- finaler Zustand vollständig sichtbar
- maximal drei konkurrierende starke Bewegungen
- Bildszenen enthalten echte Erklärung statt bloßem Zoom
- Smartphone-Kontrast und Lesbarkeit bestätigt

### Redaktionell

- Visualisierung entspricht exakt dem gesprochenen Inhalt
- Beispiele sind als Beispiele erkennbar
- Wahrscheinlichkeiten und Messwerte sind nicht irreführend
- Quellenstatus wird nicht als Wahrheit ausgegeben
- Kernaussage ist ohne Ton verständlich

## Statussprache

Diese Begriffe dürfen nicht vermischt werden:

- `planned`: Inhalt und Choreografie stehen
- `implemented`: Code existiert
- `typechecked`: TypeScript wurde wirklich ausgeführt
- `tested`: Tests wurden wirklich ausgeführt
- `rendered`: aktueller Code wurde wirklich gerendert
- `visually-reviewed`: aktueller Render wurde wirklich angesehen
- `approved`: Nutzer hat die Endfassung freigegeben

Eine implementierte Szene ist nicht automatisch getestet oder gerendert.

## Reel-spezifischer Ablauf

```text
Planung + Prompts + Remotion-Vorbau
→ Nutzer fügt Bilder und 1,00x-Audio ein
→ Asset-Staging
→ finales Transcript
→ 1,10x-Zeitumrechnung
→ Synchronisierung
→ Typecheck + Tests
→ Checkpoint-Render
→ visuelle Korrektur
→ MP4-Render
→ vollständige Ansicht
→ technische Prüfung
→ Nutzerfreigabe
```

## Lernregel

Nach jedem freigegebenen Reel werden nur belegte Erkenntnisse übernommen:

- wiederkehrende visuelle Fehler
- tatsächlich bessere Bewegungsrhythmen
- bewährte Schriftgrößen und Safe-Zones
- funktionierende Bildbehandlungen
- verworfene Sound- und Übergangsmuster

Eine subjektive Vermutung wird nicht sofort zur globalen Regel. Änderungen am Gehirn benötigen einen konkreten beobachteten Grund.
