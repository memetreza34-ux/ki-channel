# Geschlossener Reel-Produktionszyklus

## Ziel

Ein Reel soll nicht nur geplant und gerendert werden. Auswahl, Umsetzung, technische Prüfung, visuelle Bewertung und Lernergebnis müssen als ein nachvollziehbarer Zyklus verbunden sein.

Der zentrale Code liegt in:

```text
ki/src/animation-library/reelLifecycle.ts
ki/src/animation-library/implementationBrief.ts
```

## 1. Rohtext analysieren

`prepareReelAnimationProduction()` erhält:

- Reel-ID und fortlaufenden Reel-Index
- deutschen Sprechtext pro Szene
- aktuellen Animationskatalog
- aktuellen Creative-Brain-Zustand
- maximal erlaubten Anteil neuer Animationen

Der Szenenanalyzer erkennt semantische Familien, Erklärmuster, Energie, Komplexität und Fälle, in denen zwingend eine neue Animation gebaut werden muss.

## 2. Gesamtchoreografie planen

Der Planer betrachtet das komplette Reel und erzeugt pro Szene:

- eine vorhandene Bibliotheksanimation oder einen New-Build-Vertrag
- eindeutige Animation-ID
- visuelle Familie
- Layoutfamilie
- Bewegungssignatur
- Auswahlwert und Auswahlbegründung
- gegebenenfalls vier konkrete Build-Phasen

Direkte Wiederholungen, schwache Auswahlen und zu geringe Familienvielfalt werden als Diagnosen ausgegeben.

## 3. Implementierungsqueue erzeugen

Die Implementierungsqueue unterscheidet klar:

```text
reuse-and-adapt
build-new-animation
```

`reuse-and-adapt` bedeutet nicht, eine alte Szene unverändert zu kopieren. Der Katalogeintrag dient als Motion-Grammatik. Text, Timing, Objektzahl, Betonung und Anschluss an die Nachbarszenen werden an den aktuellen Inhalt angepasst.

`build-new-animation` enthält einen vollständigen Build-Vertrag mit neuen Layout- und Bewegungssignaturen sowie verbindlichen Choreografiephasen.

## 4. Agentenbrief erstellen

`compileReelImplementationBrief()` erzeugt einen strukturierten Produktionsvertrag. `renderReelImplementationBriefMarkdown()` übersetzt ihn in einen direkt lesbaren Auftrag für Codex oder Claude Code.

Enthalten sind:

- Sprechtext je Szene
- Quelle `library` oder `new-build`
- Animation, Familie, Layout und Bewegung
- semantische Tags und Erklärmuster
- Grundbausteine
- Übergangsverträge
- Choreografiephasen
- Implementierungsregeln
- globale Anti-Wiederholungsregeln
- technische und manuelle Review-Gates
- alle noch offenen Blocker und Warnungen

Blocker werden nicht versteckt. Ein geblockter Plan wird im Brief ausdrücklich als nicht umsetzungsbereit gekennzeichnet.

## 5. Render und manuelle Sichtprüfung

Für jede Szene muss ein vollständiger Review-Datensatz vorliegen:

- erwartete und gültige Artefakte
- ungültige Artefaktpfade
- aktueller Quellfingerprint
- semantische Verständlichkeit
- Neuheit
- Produktionssicherheit
- Verständlichkeit ohne Ton
- mobile Lesbarkeit
- deterministische Bewegung
- kein Überlauf
- keine Wiederholung einer vollständigen Animation
- Prüfernotizen

Fehlende Szenenreviews, doppelte Szenen-IDs oder doppelte Observation-IDs blockieren die Finalisierung.

## 6. Finalisierung

`finalizeReelAnimationProduction()` darf nur laufen, wenn keine Planblocker vorhanden sind.

Die Funktion:

1. gleicht neue Build-Einträge mit dem Katalog ab,
2. bewertet jeden technischen und manuellen Review,
3. setzt den empfohlenen Katalogstatus,
4. schreibt eine Renderreview-Beobachtung in das Creative Brain,
5. registriert die tatsächliche Animationsnutzung,
6. aktiviert Cooldowns gegen schnelle Wiederholung,
7. aktualisiert Verständlichkeit, Neuheit und Produktionssicherheit,
8. liefert einen transparenten Reel-Freigabestatus.

## Freigaberegel

Ein Reel besteht nur, wenn jede Szene `accepted` ist.

```text
alle Szenen accepted → releasePassed = true
mindestens eine Szene reworked oder rejected → releasePassed = false
```

Ein technisch korrektes MP4 genügt nicht. Die manuelle Sichtprüfung bleibt verpflichtend.

## Sicherheitsregeln

- Keine Freigabe bei Planblockern.
- Keine Statuspromotion ohne vollständigen Review.
- Keine unbekannten oder fehlenden Szenenreviews.
- Keine doppelte Observation-Verarbeitung.
- Neue Animationen werden vor dem Lernen in den Brain-Katalog aufgenommen.
- Auch abgelehnte Render werden als Nutzung und Lernbeobachtung gespeichert.
- `retired`-Animationen werden durch einen Review nicht reaktiviert.

## Tests

```text
ki/src/animation-library/__tests__/reelLifecycle.test.ts
ki/src/animation-library/__tests__/implementationBrief.test.ts
```

Die Tests decken Planung, Implementierungsqueue, Agentenbrief, erfolgreiche Freigabe, abgelehnte Render, Brain-Updates, Nutzungscooldowns, fehlende Reviews, doppelte IDs und Planblocker ab.

## Status

Der geschlossene Produktionszyklus ist als Code und Testvertrag vorhanden. Er gilt erst nach tatsächlichem TypeScript- und Vitest-Lauf als technisch bestätigt. Renderqualität kann ausschließlich durch echte PNG- und MP4-Prüfung bestätigt werden.
