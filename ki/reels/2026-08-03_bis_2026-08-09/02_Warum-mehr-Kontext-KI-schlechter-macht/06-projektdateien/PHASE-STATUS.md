# Produktionsstatus — Warum mehr Kontext eine KI schlechter machen kann

## Aktueller Stand

**Phase 1 — CODE- UND PLANUNGSGRUNDLAGE: VOLLSTÄNDIG ANGELEGT UND TEXT-HIERARCHIE ÜBERARBEITET**

Die Reel-Grundlage besteht aus:

- finalem Sprechertext
- 5 Szenen mit fester Reihenfolge
- 5 eindeutigen production-ready Animationen
- 1080 × 1920, 30 FPS, 900 Frames als Audio-unabhängiger Basisvertrag
- Subtitle-Grundcues
- Asset-Manifest ohne externe Bilder/Videos
- Remotion-Source unter `ki/src/reels/antigravity-context-overload/`
- Content-Grounding über Meaning → Derive → Sanitize → Associate → Render-Props
- Caption-Layer
- optionalem Voiceover-Slot für Phase 3
- registrierter Remotion-Composition `KI-ContextOverload`
- fokussiertem Contract-Test
- dependency-freiem Phase-1-Source-Check
- Phase-1-Check als Teil des Reel-Preflights

### Nach visueller Review korrigiert

Die erste gerenderte Fassung hatte eine zu starke Text-Dopplung. Deshalb wurde Phase 1 überarbeitet:

- interne `goal`-Texte werden nicht mehr als Zuschauer-Überschrift verwendet
- jede Szene besitzt jetzt eine kurze, eigene `headline`
- der Sprechertext wird im Production-Modus nicht mehr automatisch ein zweites Mal direkt unter der Überschrift angezeigt
- Bottom-Captions bleiben die wortgetreue Text-Ebene
- Animationen verwenden kuratierte `visualLabels` für Objekte, Zustände und Prozessschritte statt langer Sprechertext-Kopien
- die Anti-Dopplungs-Regel ist in `ki/gehirn/REELS.md` dauerhaft festgeschrieben
- Phase-3-Agenten müssen diese Hierarchie bei Smoke-Review und Final-Render erhalten

**Prüfstatus:** Die geänderten Dateien und die Verdrahtung sind im Repository angelegt. Ein neuer echter TypeScript-/Vitest-/Remotion-Lauf sowie ein neuer Smoke-/Final-Render nach dieser visuellen Korrektur sind noch **nicht** behauptet. Die bisherige MP4-Fassung gilt für diese Text-Hierarchie als veraltet und muss in Phase 3 neu gerendert werden.

---

## Nächster manueller Schritt

# PHASE 2 — NUR AUDIO

Öffne:

`01-script-audio/voiceover.md`

Erzeuge daraus **ein zusammenhängendes Voiceover ohne Textänderungen** und lege es bevorzugt hier ab:

`01-script-audio/voiceover.wav`

Alternativ akzeptiert der Phase-3-Agent:

`01-script-audio/voiceover.mp3`

Du musst in Phase 2 **nichts programmieren** und keine JSON-, Caption- oder Animationsdatei ändern.

---

## Danach

# PHASE 3 — CODEX ODER ANTIGRAVITY

Der Coding-Agent übernimmt:

1. Audio prüfen und integrieren
2. tatsächliche Audio-Dauer bestimmen
3. Caption-/Timing-Abgleich mit dem echten Audio
4. Struktur- und Reel-Checks
5. fokussierte Tests und TypeScript-Prüfung
6. 15 Smoke-Frames rendern und visuell prüfen
7. insbesondere Überschrift, fehlende Doppel-Unterzeile und Animation-vs.-Caption-Dopplung prüfen
8. Probleme beheben
9. finales MP4 neu rendern
10. finales MP4 technisch prüfen und ansehen
11. Review-Checkliste und Exportstatus aktualisieren

Phase 3 darf den freigegebenen Sprechertext, die fünf Animation-IDs oder die neue Text-Hierarchie nicht ohne echten Fehlergrund neu erfinden.
