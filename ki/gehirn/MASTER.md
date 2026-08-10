# 🧠 KI-Channel — MASTER-GEHIRN

Diese Datei verbindet Identität, Reel-Logik, Bildstil, Plattformen und Produktionsablauf zu einem einzigen Entscheidungsrahmen.

## Autoritative Quellen

1. `REPO-STATE.md` — Repository-Wahrheit und Branch
2. `AGENTS.md` / `ki/AGENTS.md` — technische und strukturelle Regeln
3. **diese Datei** — kanalweite Entscheidungslogik
4. `KANAL.md` — Identität, Zielgruppe, Ton
5. `REELS.md` — Reel-Struktur, Text-Hierarchie, Visualisierung
6. `PLATTFORMEN.md` — Publishing und YouTube/Instagram/TikTok/Facebook/Snapchat
7. `PRODUKTIONSABLAUF.md` — Phase 1/2/3
8. `../BILDSTIL.md` — Bild- und Prompt-Qualität
9. named reel package — konkrete Inhalte

Wenn zwei ältere Dokumente kollidieren, gilt diese Reihenfolge. Nicht raten.

## Kernziel

> Komplexe KI so erklären, dass ein normaler deutschsprachiger Zuschauer den Mechanismus innerhalb weniger Sekunden versteht — visuell stark, sachlich geerdet und ohne Hype-Lärm.

## Kanalprinzipien

- deutsch
- vollständig faceless
- verständlich vor technisch beeindruckend
- Nutzen/Aha vor Feature-Liste
- Wahrheit vor Reichweitenversprechen
- ein kanonischer Content-Master; Plattformen sind Packaging, keine zweite Produktionswahrheit

## Entscheidungsreihenfolge für jede Reel-Szene

```text
1. Was ist die eine Aussage?
2. Was muss sich sichtbar verändern, damit man sie versteht?
3. Reicht Remotion/UI/Diagramm?
4. Wenn nein: welches Bild erklärt die räumliche/illustrative Komplexität besser?
5. Welche vorhandene production-ready Animation passt semantisch wirklich?
6. Welche kurze Zwischenüberschrift ordnet ein, ohne den Sprecher zu kopieren?
7. Welches semantisch passende Icon gehört zu dieser Zwischenüberschrift?
8. Welche 0–3 Animationslabels sind wirklich nötig?
9. Ist alles auf Smartphone-Größe lesbar und innerhalb der Safe Zones?
```

## Visual Hierarchy

```text
ZWISCHENÜBERSCHRIFT + ICON
= oben mittig; kompakter Kapitel-/Kerngedanke
= keine zusätzliche Unterzeile darunter

ANIMATION / BILD
= Mechanismus oder Zustandsänderung

ANIMATIONSTEXT
= nur Objekt-/Zustandslabels, keine Satzkopie

UNTERTITEL
= unten in sicherer Zone, ohne Hintergrundkarte
= exakt am echten Sprecher ausgerichtet
= aktives Wort / aktive Wortgruppe in Marken-Lila
```

Interne Regie-, `goal`-, Debug- und Planner-Texte sind niemals Zuschauertext.

## Reel-Safe-Zone-Grundsatz

Bei vertikalem 1080 × 1920 Short-Form gilt:

- wichtige Texte niemals direkt an obere oder untere Displaykante setzen
- Zwischenüberschrift + Icon oben mittig in der sicheren Kopfzone
- Untertitel deutlich oberhalb der unteren Plattform-UI halten
- ungefähr die untersten 220 px nicht für kritischen Text nutzen
- Untertitel ohne weißen Kasten oder andere flächige Caption-Card
- finale Wort-/Cue-Synchronität wird in Phase 3 gegen das echte Voiceover geprüft

Die Detailwerte und Qualitätschecks stehen in `REELS.md`.

## Remotion oder Bild?

**Remotion zuerst**, wenn die Aussage mit UI, Diagramm, Prozess, Vergleich, Daten, Text, Karten, Pfeilen, Netzwerk oder Motion-Mechanismus klar erklärt werden kann.

**Bild-KI**, wenn eine hochwertige räumliche 3D-Editorial-Szene, Objektgruppe oder Alltagssituation die Aussage deutlich besser und schneller verständlich macht.

Kein Bild nur, weil ein Bild hübsch aussieht.

## Markenakzent

- Hintergrund: weiß/nahezu weiß
- Text: `#1A1A2E`
- primärer KI-/Fokus-Akzent: `#B98CFF`
- Tiefe/Kontrast: `#6E45C9`
- Grün: Vorteil/Lösung
- Rot: Risiko/Fehler/Grenze
- Blau: seltene Info-/Tech-Semantik

Lila wird gezielt akzentuiert, nicht flächig überall verteilt. Bei Untertiteln ist die aktive Sprecherposition ein erlaubter und gewünschter Lila-Fokus.

## Qualitätsregel

Eine Szene ist nicht gut, weil sie viel Bewegung hat. Sie ist gut, wenn Startzustand → sichtbare Veränderung → Ergebnis ohne Erklärung neben dem Video verstanden werden können.

Jede Szene braucht:

- klare Startlage
- eine dominante Veränderung
- lesbaren End-Hold
- eindeutige Beziehung zum Sprechertext
- keine unnötige Textdopplung
- keine erfundenen Fakten

## Publishing-Modell

Short-Form wird einmal unter `ki/reels/` produziert. YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat verwenden denselben freigegebenen Master, solange keine technisch notwendige Anpassung erforderlich ist.

Plattform-spezifische Titel/Captions gehören in `03-caption/platform-copy.md`. Strategie: `PLATTFORMEN.md` und `ki/plattformen/`.

YouTube Longform ist ein eigenes Format und darf nicht automatisch aus Reels aufgeblasen werden.

## Produktionsmodell

```text
Phase 1 — ChatGPT: alles außer echtem Audio
Phase 2 — Mensch: nur Voiceover
Phase 3 — Codex/Antigravity: Audio + Verifikation + Render
```

Phase 3 darf die Phase-1-Kreativentscheidung nur ändern, wenn ein nachweisbarer technischer oder visueller Fehler vorliegt.
