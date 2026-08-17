# Review Checklist — Wie KI ein Bild versteht

## Inhalt

- [ ] Voiceover exakt dem freigegebenen Text entsprechend
- [ ] „häufig in kleinere Bereiche“ bleibt architektur-neutral
- [ ] keine Behauptung, das Modell sehe/denke wie ein Mensch
- [ ] keine erfundenen Messwerte oder Modellgenauigkeiten

## Visuals

- [ ] erster Frame wirkt nicht leer
- [ ] Foto→Raster→Daten in Szene 1 ohne Mikrotext verständlich
- [ ] Merkmalskarten in Szene 2 groß genug
- [ ] Sprachbrücke in Szene 3 als Beziehung, nicht Dekoration
- [ ] Fehler-Matrix in Szene 4 innerhalb Smartphone-Sicht schnell lesbar
- [ ] Szene 5 entwickelt sich bis zur letzten inhaltlichen Phrase weiter
- [ ] keine externe Bilddatei nötig/versehentlich eingebunden

## Layout

- [ ] 1080×1920 / 30 FPS
- [ ] Überschriften komplett `#6E45C9`, sofern die freigegebene helle Brand-Composition verwendet wird
- [ ] semantisches Icon groß und sichtbar
- [ ] Hauptvisual konkurriert nicht mit dem höheren Caption-Block
- [ ] neue kritische Visuals möglichst bis ungefähr y≈1240–1280 abgeschlossen
- [ ] kein wichtiger Inhalt durch Clip-Guard abgeschnitten
- [ ] kritische Labels etwa ≥28–32 px
- [ ] Hauptvisual nutzt die obere Fläche sinnvoll

## Audio / Captions

- [ ] echte Audio-Dauer gemessen
- [ ] Captions gegen final verwendetes Audio synchron
- [ ] Caption-Wrapper bei 1080×1920 `bottom: 520px`
- [ ] horizontal ungefähr 104px Sicherheitsabstand links/rechts
- [ ] Caption maximal ungefähr 820px breit
- [ ] Caption sichtbar ungefähr bei y≈1260–1400 statt im unteren Plattform-UI-Bereich
- [ ] 4–6 Wörter pro sichtbarem Sinnblock
- [ ] maximal 2 Caption-Zeilen gleichzeitig
- [ ] letzte ungefähr 420px unten frei von Caption und anderer kritischer Information
- [ ] Bereich 420–500px vom unteren Rand nur als Puffer genutzt
- [ ] lila Wort-/Phrasenfokus trifft Sprecher, sofern die kanonische Brand-Caption verwendet wird
- [ ] lokale Retimings, falls nötig, natürlich und dokumentiert

## Feed-/Smartphone-Review

- [ ] Caption wirkt klar oberhalb von Accountname/Beschreibung/CTA
- [ ] rechte Like-/Kommentar-/Share-UI überlagert oder bedrängt keine Caption/kritischen Inhalte
- [ ] Caption und Hauptvisual haben ungefähr 80–120px sichtbare Trennung
- [ ] bei Kollision wurde das Visual geändert, nicht die Caption nach unten verschoben

## Final

- [ ] TypeScript/Tests tatsächlich ausgeführt
- [ ] neuer Smoke-Render **nach** der 520px-Caption-Positionsänderung erstellt
- [ ] Smoke-Frames visuell geprüft
- [ ] finaler Render gehört exakt zum aktuellen Source-Stand
- [ ] MP4 in normaler Geschwindigkeit angesehen
- [ ] Smartphone-/Feed-Größe geprüft
- [ ] ein Render vor der Caption-Revision wird nicht als aktuelle Freigabe verwendet
- [ ] Status nur nach tatsächlicher Prüfung auf gerendert/visuell geprüft/freigegeben setzen
