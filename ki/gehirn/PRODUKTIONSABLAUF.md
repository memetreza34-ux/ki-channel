# KI-Kanal — verbindlicher 3-Phasen-Produktionsablauf

Dieser Ablauf ist der Normalfall für jedes neue Short-Form-Reel.

## Phase 1 — ChatGPT: komplette Grundlage

Ziel: Nach Phase 1 muss der Mensch **nur noch das Voiceover erzeugen**.

Phase 1 erstellt:

- Thema, Titel und stabilen Slug
- Fakten-/Quellenprüfung, wenn Aktualität oder Genauigkeit es verlangt
- Wochenpaket mit 01–06-Struktur
- finalen Sprechertext in `01-script-audio/voiceover.md`
- denselben Sprechertext **ohne Szenen, Überschriften oder Anweisungen** als `01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt`
- Short-Form standardmäßig ausführlicher planen: ungefähr **50–60 Sekunden** und meist ungefähr **120–150 gesprochene Wörter**, wenn der Inhalt das trägt
- Szenenplan
- Sprechertext in bedeutungstragende **Visual Beats** zerlegen
- für jeden Visual Beat zuerst die individuelle visuelle Mechanik bestimmen
- für jeden Beat `REUSE_EXACT` oder `NEW_BUILD` begründen; bestehende Animation nur bei exaktem semantischem Fit
- `animation-plan.md` mit Sprecherstelle → Bedeutung → Startzustand → sichtbare Veränderung → Endzustand → Umsetzung → Timing
- Zuschauer-Überschriften und kurze Animationslabels ohne Caption-Dopplung
- Bildbedarf pro Szene
- bei Bildbedarf hochwertige `02-bilder/image-prompts.md` nach `ki/BILDSTIL.md`
- `02-bilder/asset-manifest.json`, auch wenn bewusst keine externen Assets nötig sind
- `03-caption/subtitle-cues.json` als Audio-unabhängige Basis
- `03-caption/platform-copy.md` für YouTube Shorts, Instagram, TikTok, Facebook und ggf. Snapchat
- `06-projektdateien/reel.json`
- Assembly-Auftrag und Review-Checkliste
- ausführbaren Remotion-Source unter `ki/src/reels/<slug>/`
- individuelle Micro-Animationen im Source, wenn Sprecherinhalt innerhalb einer Szene mehrere sichtbare Beats verlangt
- Content-Grounding: Sprechertext → Meaning → Visual Beats → Mechanik → Render-Props
- Composition-Registrierung
- harte Caption-Zone berücksichtigen: bei 1080 × 1920 keine sichtbare Animation ab ungefähr `y=1440`
- fokussierte Source-/Contract-Checks
- `PHASE-STATUS.md`

**Phase 1 darf kein echtes Voiceover vortäuschen.** Fehlendes Audio ist hier normal.

**Verboten:** erst eine vorhandene Library-Animation wählen und dann den Inhalt darauf anpassen. Die Library wird erst nach der inhaltlichen Visual-Beat-Planung geprüft.

Plattform-Copy ist Packaging und darf die fachliche Aussage des Reels nicht verändern. Regeln: `PLATTFORMEN.md`.

### Phase-1-Fertigkriterium

Planung und Code-Grundlage sind vorhanden; der einzige normale manuelle nächste Schritt lautet:

> **PHASE 2: Voiceover erzeugen.**

Nur Skript/Plan ohne ausführbaren Source ist nicht Phase-1-fertig.

---

## Phase 2 — Mensch: nur Voiceover

1. `01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt` öffnen.
2. Text wortgetreu mit der gewünschten Stimme erzeugen.
3. bevorzugt `voiceover.wav`, alternativ `voiceover.mp3` speichern.
4. Datei in `01-script-audio/` ablegen.
5. keine JSON-, Caption-, Szenen-, Prompt-, Plattform-Copy- oder TS/TSX-Datei ändern.

Wenn der Text geändert werden soll, zurück zu Phase 1.

### Phase-2-Fertigkriterium

Echte Audiodatei liegt neben dem finalen Skript.

---

## Phase 3 — Codex oder Antigravity: Assembly und Release

Phase 3 verwendet die vorhandene Phase-1-Grundlage und baut nicht neu von Null.

### Timeline-Prinzip — natürliches Audio, perfekte Synchronität

Das echte Voiceover ist der akustische Master. Die Timeline wird **an der realen Stimme feinjustiert**; die Stimme muss aber nicht starr unverändert bleiben, wenn einzelne Stellen hörbar zu schnell oder zu langsam für die geplanten Visual Beats sind.

Reihenfolge für jeden problematischen Abschnitt:

1. zuerst Visual-Beat-, Szenen-, Hold- und Animations-Timing an die echte Stimme anpassen
2. natürliche Pausen an Satz-/Phrasengrenzen leicht verkürzen oder verlängern
3. wenn danach ein lokaler Abschnitt noch sichtbar zu schnell/zu langsam ist: **pitch-erhaltendes Time-Stretching auf Phrase-/Cue-Ebene** verwenden
4. Captions und Wort-Timestamps anschließend exakt auf das tatsächlich verwendete Audio legen

Regeln für Audio-Retiming:

- niemals mitten in einem Wort die Geschwindigkeit wechseln
- keine abrupten Speed-Sprünge; nur an natürlichen Phrasen-/Pausengrenzen
- Pitch/Stimmhöhe erhalten
- Wortlaut, Wortreihenfolge und Bedeutung niemals verändern
- keine Wörter abschneiden, verschlucken, duplizieren oder künstlich ergänzen
- normale Korrektur möglichst ungefähr `0.97x–1.03x`
- bei Bedarf bis ungefähr `0.94x–1.06x`; stärkere Änderung gilt als Qualitätswarnung und soll normalerweise durch neues Voiceover/Phase 2 gelöst werden statt die Stimme hörbar zu verzerren
- nicht auf eine exakte Gesamtlänge zwingen, wenn dadurch die Stimme unnatürlich klingt
- Ziel ist eine **natürliche Stimme + semantisch perfekte Visual-Beat-Timeline**, nicht eine mathematisch starre Sekundenmarke

Wenn ein Abschnitt retimed wurde, muss Phase 3 im Abschlussbericht kurz nennen, **welcher Abschnitt und welcher Faktor** verwendet wurde.

### Phase-3-Preflight — verbindlich vor jeder anderen Handlung

Phase 3 beginnt **immer** mit diesem Befehl:

```bash
npm run phase3:check -- <paket-pfad>
```

Meldet er einen Blocker, ist Phase 3 beendet, bevor sie beginnt. Dann wird
exakt der gemeldete Blocker zurückgegeben — bei fehlendem Audio also
`PHASE 2 AUDIO FEHLT` — und **keine** Datei angefasst.

Kein Anlegen von Platzhalter-Audio, kein „ich baue schon mal die Timeline
vor", kein Umschreiben von Phase-1-Dateien, um den Check zufriedenzustellen.
Der Preflight ist eine Startbedingung, kein Hinweis.

Pflichten:

1. `npm run phase3:check -- <paket-pfad>` ausführen. Bei Blocker: stoppen.
2. Branch/Status prüfen.
3. `PHASE-STATUS.md` und Reel-Verträge lesen.
4. Struktur-/Preflight-Checks ausführen.
5. reale Audio-Dauer messen.
6. Audio render-sicher integrieren.
7. Timeline nach obigem Prinzip an reales Audio anpassen; Sprechertext nicht umschreiben. **WICHTIG:** Keine rein mathematische/lineare Aufteilung der Gesamt-Frames auf die Szenen oder Cues! Die Szenen-Grenzen und Cues (in `reel.json` und `subtitle-cues.json`) müssen zwingend auf Basis einer Audio-Analyse (z.B. Extrahieren der Timestamps aus den Audio-Metadaten oder einem ersten Test-Render) an die realen Sprechpausen und -geschwindigkeit gekoppelt werden.
8. Visual Beats am echten Sprecher ausrichten; sichtbare Zustandswechsel müssen zur gemeinten Phrase/Satzstelle passen.
9. lokale Pausen/Speed nur dort korrigieren, wo die audiovisuelle Timeline dadurch klarer wird; danach Caption-/Wort-Timestamps exakt und asymmetrisch (anhand der realen Sprechpausen) neu ausrichten.
10. genehmigte `REUSE_EXACT`-/`NEW_BUILD`-Entscheidungen erhalten; keine bequemere Library-Animation einsetzen.
11. prüfen, dass **ab ungefähr y=1440 keinerlei Animation sichtbar ist** und die Caption die unterste Inhaltsebene bleibt.
12. falls der technische Clip-Guard wichtigen Inhalt abschneidet: Animation neu layouten, nicht als bestanden akzeptieren.
13. Strukturcheck, fokussierte Tests und TypeScript ausführen.
14. pro Szene Opening/Mid/End-Hold sowie relevante Beat-Wechsel in Smoke-Frames rendern.
15. Smoke-Frames tatsächlich visuell prüfen und Fehler beheben.
16. finales MP4 rendern.
17. MP4 technisch validieren und normal/auf Smartphone-Größe ansehen.
18. bei normaler Wiedergabe zusätzlich prüfen, dass Voiceover-Retiming nirgends künstlich, hektisch oder gedehnt klingt.
19. Review-Checkliste und Status nur für tatsächlich abgeschlossene Punkte aktualisieren.
20. finalen Master und `platform-copy.md` als Publishing-Handoff bereitstellen; Veröffentlichung selbst nur ausführen, wenn ausdrücklich beauftragt.

## Stop-Bedingungen

**Nicht starten** bei rotem `npm run phase3:check`. Ein Blocker beendet Phase 3
sofort; er wird gemeldet, nicht umgangen.

Nicht als fertig melden bei:

- fehlendem Audio
- fehlender Phase-1-Source
- fehlgeschlagenen Tests/Strukturchecks
- Text-/Caption-Mismatch
- hörbar künstlichem oder abruptem Voiceover-Speedwechsel
- Audio-Retiming außerhalb des Qualitätskorridors ohne neue Phase-2-Aufnahme
- überlappender oder abgeschnittener Typografie
- internen Regie-/Goal-Texten im Video
- unnötiger Caption-/Animations-Textdopplung
- ungrounded Zahlen
- einer Animation, die nur „ungefähr“ statt exakt zum Sprecherinhalt passt
- fehlenden Visual Beats für bedeutungstragende Sprecherstellen
- sichtbarer Animation in/unter der Caption-Zone
- wichtigem Inhalt, der vom Caption-Clip abgeschnitten wird
- ungeprüften Smoke-Frames
- nicht angesehenem finalen MP4
- fehlender/irreführender Plattform-Copy bei behaupteter Publishing-Bereitschaft

## Kurzform

```text
PHASE 1 — ChatGPT
Inhalt + individuelle Visual Beats + Source, alles außer echtem Audio
        ↓
PHASE 2 — Mensch
nur Voiceover
        ↓
PHASE 3 — Codex / Antigravity
Audio analysieren → Timeline/Visual Beats anpassen → bei Bedarf lokal natürlich retimen → Captions exakt synchronisieren → prüfen → rendern
        ↓
PUBLISHING
freigegebenen Master plattformgerecht verpacken
```
