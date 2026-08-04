# Prototype Review

Kein Prototyp wird wegen eines erfolgreichen Typechecks als visuell gelungen betrachtet.

## Prüfreihenfolge

### 1. Technische Grundlage

```bash
node scripts/verify-animation-library.mjs
```

Erforderlich:

- JavaScript-Syntax gültig
- TypeScript gültig
- Vitest-Tests erfolgreich
- Renderplan gültig

### 2. Smoke-Frames

```bash
node scripts/render-animation-library.mjs smoke
```

Pro Prototyp werden Frame 0, 90 und 179 geprüft.

### 3. Vollständige Prüfframes

```bash
node scripts/render-animation-library.mjs stills
```

Pro Prototyp:

```text
0, 30, 60, 90, 120, 150, 179
```

### 4. Bewegungsprüfung

```bash
node scripts/render-animation-library.mjs videos
```

Jedes MP4 wird in normaler Geschwindigkeit und auf Smartphone-Größe angesehen.

### 5. Technischer Bericht

```bash
node scripts/check-animation-library-renders.mjs
```

Erwartung:

```text
48/48 technisch gültige Artefakte
```

## Allgemeine Abnahme

- [ ] Inhalt ist ohne Ton grundsätzlich verständlich.
- [ ] Die Hauptbewegung erklärt den Satz und ist nicht bloß Dekoration.
- [ ] Anfangsframe wirkt absichtlich gestaltet.
- [ ] Spätestens innerhalb der ersten 20 Frames beginnt eine verständliche Aktion.
- [ ] Der Mittelpunkt besitzt einen klaren visuellen Wendepunkt.
- [ ] Der Endframe zeigt ein stabiles Ergebnis.
- [ ] Keine ungewollte leere Fläche.
- [ ] Keine abgeschnittenen Elemente.
- [ ] Kein Text unterhalb mobiler Mindestgröße.
- [ ] Keine dauerhafte Pulsation ohne Bedeutung.
- [ ] Keine Bewegung bleibt grundlos stehen.
- [ ] Kein Prototyp wirkt wie eine andere Composition mit ausgetauschtem Text.
- [ ] Übergang hinein und hinaus ist konzeptionell möglich.

## Knowledge Magnet

- [ ] Query-Magnet ist sofort als Suchanfrage erkennbar.
- [ ] Relevante Dokumente bewegen sich sichtbar anders als irrelevante.
- [ ] Irrelevante Dokumente verschwinden nicht zu früh.
- [ ] Feldlinien überladen das Bild nicht.
- [ ] Ergebnis `3 Belege` ist mindestens 20 Frames stabil.

## Budget Leak Meter

- [ ] Kostenanzeige ist nicht widersprüchlich zur Füllhöhe.
- [ ] Alle drei Lecks sind einzeln erkennbar.
- [ ] Abdichtung wirkt kausal und nicht wie ein bloßer Farbwechsel.
- [ ] Einsparung erscheint erst nach den Optimierungen.
- [ ] Ströme verursachen keine visuellen Artefakte.

## Context Window Train

- [ ] Begrenztes Fenster mit vier Plätzen ist sofort verständlich.
- [ ] Neue Nachricht schiebt alte Information sichtbar heraus.
- [ ] Angeheftete Regel bleibt nachvollziehbar erhalten.
- [ ] Keine Karte verlässt den sichtbaren Bereich unkontrolliert.
- [ ] Bewegung wirkt wie ein Fenster und nicht nur wie eine normale Liste.

## Decision Tree Burst

- [ ] Frage und Bedingungen sind logisch verbunden.
- [ ] Ungültige Äste werden klar verworfen.
- [ ] Der gewählte Weg bleibt visuell dominant.
- [ ] Das Baumdiagramm bleibt trotz hoher Dichte lesbar.
- [ ] Kein Ast schneidet einen Textknoten ungewollt.

## Human AI Relay

- [ ] Rollenwechsel zwischen Mensch und KI ist ohne Erklärung erkennbar.
- [ ] Task-Marker erreicht jede Station zur richtigen Zeit.
- [ ] Karten wirken nicht wie vier identische Standardkarten.
- [ ] Übergaben sind die Hauptidee, nicht die statische Track-Anzeige.
- [ ] Schlussaussage bleibt mindestens 25 Frames sichtbar.

## Knowledge Tree Graft

- [ ] Altes Wissen, unsicheres Wissen und neue Information unterscheiden sich.
- [ ] Verifikation ist vor der Einfügung sichtbar.
- [ ] Der neue Ast wird tatsächlich an den Baum angeschlossen.
- [ ] Die alte Aussage wird markiert und nicht einfach gelöscht.
- [ ] Revisionserhöhung erscheint erst nach erfolgreicher Aktualisierung.

## Ergebnisdokumentation

Für jeden Prototyp werden gespeichert:

- akzeptierte Frames
- fehlerhafte Frames
- konkrete visuelle Probleme
- vorgenommene Korrekturen
- Ergebnis des MP4-Tests
- Verständlichkeitswert 0–100
- Neuheitswert 0–100
- Produktionssicherheitswert 0–100
- Status `prototype`, `verified` oder `retired`

Diese Werte werden anschließend als `render-review`-Beobachtung an das Creative Brain übergeben.
