# Storytelling Motion — KI-Reels

## Ziel

KI-Reels sollen nicht wie statische Präsentationen wirken. Der Zuschauer soll einer klaren visuellen Geschichte folgen: **Hook → Problem/Änderung → Beweis → Konsequenz → Payoff**. Jede wichtige gesprochene Aussage löst eine sichtbare Reaktion aus.

## Harte Regeln für neue Reels

- 60–75 Sekunden tatsächliche Voice-Locked-Laufzeit.
- mindestens **15 konkrete Visual Beats** pro Standard-Reel.
- kein weitgehend unveränderter Visual State länger als **4,5 Sekunden**, solange Voiceover aktiv ist, außer eine bewusst dokumentierte Lesepause ist nötig.
- jede zentrale Aussage bekommt mindestens eine semantisch passende sichtbare Reaktion.
- jede Szene braucht mindestens zwei erkennbare visuelle Zustandsänderungen.
- Kamera, Zoom, Transition und SFX müssen erklären, fokussieren, verbinden oder einen Payoff verstärken — kein Effekt-Spam.
- ungefähr 70–80 % Remotion-native Motion/UI/Diagramm/Typografie, ungefähr 20–30 % reale Visuals; typischerweise 1–2 starke externe Momente.
- externe Medien vor Render lokal auflösen. Keine Render-Time-HTTP-Downloads.
- Produktions-SFX bleiben im bestehenden lokalen CC0-System. `@remotion/sfx` ist eine verfügbare Referenz-/Prototyping-Bibliothek, ersetzt aber nicht automatisch den CC0-Lock.

## Story-Rollen

Jeder Beat erhält eine Funktion:

- `HOOK` — Aufmerksamkeit und Ausgangslage.
- `PROBLEM` — Konflikt, Einschränkung oder überraschender Unterschied.
- `PROOF` — Quelle, Screenshot, echte Zahl oder sichtbarer Beleg.
- `CHANGE` — Zustand verändert sich sichtbar.
- `CONSEQUENCE` — zeigt, was die Änderung praktisch bedeutet.
- `PAYOFF` — klarer Abschluss, Vergleich oder Aha-Moment.

Nicht jedes Reel braucht jede Rolle gleich oft. Für neue Standard-Reels müssen mindestens `HOOK`, `PROOF`, `CONSEQUENCE` und `PAYOFF` vorhanden sein.

## Kanonische Story-Komponenten

### `ki/src/reels/StoryMotion.tsx`

- `StoryBeat` — role-aware Reveal/Exit für einzelne visuelle Beats.
- `StoryCamera` — kontrollierter Push/Pan/Reframe.
- `ImpactNumber` — Zahlen-Punch für Kernwerte.
- `StoryProgressRail` — sichtbare Veränderung/Vergleich.
- `StoryCutFlash` — kurzer Übergangsimpuls.
- `StoryChapterLabel` — Kapitel-/Story-Kontext.
- `StoryTexture` — dezente `@remotion/effects/paper`-Textur, kein Dauerfilter-Spam.

### `ki/src/reels/StoryMediaLayers.tsx`

- `StoryThreeHero` — 3D-Hero-Momente über `@remotion/three`.
- `StoryLottieLayer` — lokal eingebundene Lottie-Micro-Motion.
- `StoryRiveLayer` — lokal eingebundene Rive-Animation; Remote-URLs werden bewusst abgelehnt.
- `StorySkiaBackdrop` — organische Skia-Hintergrundbewegung.

### `ki/src/motion-system/StoryTransitionShowcase.tsx`

Referenz für echte `TransitionSeries`-Übergänge. Verwende `slide`, `wipe`, `bookFlip` oder andere Remotion-Presentations nur dort, wo der Übergang semantisch zum Szenenwechsel passt.

## Remotion-Stack

Der KI-Workspace pinnt die Story-Bausteine auf die bestehende Remotion-Version `4.0.488`:

- `@remotion/transitions`
- `@remotion/effects`
- `@remotion/sfx`
- `@remotion/shapes`
- `@remotion/lottie`
- `@remotion/rive`
- `@remotion/three`
- `@remotion/skia`
- `@shopify/react-native-skia`

`remotion.config.ts` setzt ANGLE, weil Effects/Three/Skia WebGL-kompatibles Rendering benötigen.

## Agent Skills

Remotion empfiehlt 2026 Agent Skills für Coding Agents. In einer ausführbaren lokalen Umgebung können sie installiert/aktualisiert werden mit:

```bash
npx -y skills@latest add remotion-dev/skills -g -y
```

oder projektbezogen:

```bash
npx remotion skills add
```

Diese Skills liefern aktuelle Remotion-Best-Practices. Die kanonischen KI-Kanal-Regeln in diesem Repository bleiben trotzdem vorrangig: Nutzer-Audio, lokale Medien, Story-Gates, Provenance und Final-Review dürfen nicht umgangen werden.

## Phase 1

Zusätzlich zu Skript, Scene-Voice-Map, SFX und Visual-Plan muss für neue Reels existieren:

`06-projektdateien/story-beats.json`

Pflichtfelder pro Beat:

- eindeutige `id`
- `sceneId`
- `atRatio` innerhalb der Szene
- Story-`role`
- konkrete `visualAction`
- konkrete `motion`

Das Gate:

```bash
node ki/scripts/validate-storytelling-motion.mjs <reel-package-dir>
```

prüft die Story-Struktur fail-closed.

## Phase 2

Unverändert: **Nur der Nutzer erstellt das Produktions-Voiceover.** Story-Komponenten dürfen niemals TTS/Voiceover erzeugen oder Audio remote herunterladen.

## Phase 3

Nach lokalem Forced Alignment werden die Beat-Zeitpunkte auf echte Szenen-/Voice-Zeiten angepasst. Danach müssen Storytelling-Gate, Repo-/Motion-Gates, Render-Provenance, SFX-/Visual-Gates und der echte 1x-Review bestehen.

Beim 1x-Review ausdrücklich prüfen:

- entsteht eine nachvollziehbare visuelle Geschichte?
- bleiben lange statische Präsentationszustände aus?
- reagiert das Bild auf Kernwörter/Kernaussagen?
- wirken Zooms/Transitions motiviert statt zufällig?
- unterstützen SFX exakt sichtbare Events?
- gibt es mindestens einen starken Proof-/Real-Visual-Moment, wenn das Thema einen solchen sinnvoll erlaubt?

## Anti-Patterns

Nicht zulässig als Standard:

- 8–15 Sekunden dieselbe Karte mit nur kleinen Zahlenänderungen.
- permanente CameraPush-Bewegung ohne neuen Informationszustand.
- zufällige Film-Burn-/Glitch-/Zoom-Effekte nur für Energie.
- 3D nur als Dekoration ohne Bezug zum Sprechertext.
- externe Bilder als Füllmaterial.
- Lottie/Rive per Remote-URL während des Renders.
- Soundeffekte ohne sichtbaren Auslöser.
- Überschrift + Caption + Objekttext, die alle denselben Satz wiederholen.
