# CODEX ASSEMBLY TASK — KI-ChatGPTForTeens

## Status

**FULL VISUAL REBUILD REQUIRED**

Der echte Render wurde geprüft und ist semantisch durchgefallen. Die bisherige Anweisung, den vorhandenen Visual-Source nur technisch zu prüfen, gilt für diesen Stand **nicht mehr**.

## Ziel

Das Teen-Reel visuell neu aufbauen, ohne den Sprechertext in ein altes Werbe-/Produkt-/Motion-Template zu pressen.

Jede sichtbare Mechanik muss direkt zur aktuell gesprochenen Aussage passen.

## Harte Verbote für diesen Rebuild

Nicht wiederverwenden oder sichtbar übernehmen:

- `NOVA`
- `Mach daraus Werbung`
- `PRODUKT`
- `ZIELGRUPPE`
- `STIMMUNG`
- `CREATIVE BRIEF`
- `Produkt bleibt konsistent`
- `KEYFRAME → MOTION`
- `WERBECLIP-CHECK`
- generische `WORKFLOW`-/Werbeclip-Prüfkarten

Auch andere Altkomponenten sind nur zulässig, wenn **alle sichtbaren Labels, Zustände und Mechaniken** exakt zur Teen-Szene passen. Unrelated Reuse ist ein Stop-Fehler.

## Pflichtlektüre

- `ki/skills/entertainment-first-reels/SKILL.md`
- `ki/skills/high-energy-remotion-reels/SKILL.md`
- `ki/skills/voice-locked-captions/SKILL.md`
- `ki/skills/final-video-delivery/SKILL.md`
- `06-projektdateien/ENTERTAINMENT-REVIEW.md`
- `06-projektdateien/POST-RENDER-DIAGNOSIS.md`

## Neuaufbau pro Szene

### Szene 1 — ChatGPT schaltet um

Nur Teen-/ChatGPT-nahe UI:

- große mobile Chatoberfläche
- sichtbarer Account-/Age-State
- `STANDARD` kippt zu `TEEN`
- komplette UI reagiert auf den Switch
- Hero-Moment: halb transformierter Zustand / klarer Teen-Schutz aktiv

### Szene 2 — Altersentscheidung

- Account-/Safety-Oberfläche
- Signale fließen sichtbar in Altersentscheidung
- `<18`-Schwelle
- Teen Experience aktiviert sich
- kein Creative Brief, keine Produkt-Taxonomie

### Szene 3 — Study Mode

- echte Lernfrage im Chat
- Shortcut zur bloßen fertigen Lösung wird gestoppt
- Antwort transformiert in Lernschritte / Rückfrage / Mini-Quiz
- klarer Endzustand: `VERSTEHEN` statt bloß `KOPIEREN`

### Szene 4 — Schutz + Pause

- sensible Anfrage sichtbar
- Safety-Layer blockiert/limitiert die Antwort
- danach separater Break-Reminder
- Schutzfunktion und Pausenfunktion klar voneinander unterscheidbar

### Szene 5 — Eltern steuern, Chats privat

- Parent-Control-Settings links
- Teen-Chat rechts
- Quiet-/Study-Hours veränderbar
- Versuch, Chatinhalt zu öffnen, wird verriegelt
- End-Payoff: Einstellungen steuerbar, Chatinhalt privat

## Semantic Visual Gate

Vor jedem Render für **jedes sichtbare Element** fragen:

1. Welche Sprecherphrase erklärt dieses Element?
2. Würde ein Zuschauer ohne Caption verstehen, warum es hier ist?
3. Stammt Text/Mechanik aus genau diesem Teen-Reel oder aus einem alten Template?

Wenn Frage 1 oder 2 nicht klar beantwortbar ist oder Frage 3 auf Alt-Template zeigt: Element entfernen/neu bauen.

## Render-Reihenfolge

1. echte Audio-Datei im Repo verifizieren
2. Audio-Dauer messen
3. Voice-Lock gegen genau diese Datei erzeugen/validieren
4. neue Teen-spezifische Source implementieren
5. TypeScript + fokussierte Tests
6. Smoke-Frames an Hook, jedem Hero-Moment und Schluss
7. Contact Sheet erzeugen
8. Contact Sheet auf Fremdlabels/Fremdmechaniken prüfen
9. Entertainment-Score erneut vergeben; mindestens 8/10, keine 0-Kategorie
10. finalen MP4 mit Audio rendern
11. `validate-final-video.mjs`
12. vollständigen MP4 ansehen und anhören
13. erst dann `FINAL VIDEO READY`

## Final-Gate

Nicht freigeben, wenn irgendein sichtbares Element nach Werbung, Produktbriefing, Motion-Pipeline oder einem anderen alten Reel aussieht, obwohl der Sprecher über Teen-Schutz spricht.
