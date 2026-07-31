# Brand-Kit — genehmigte Komponenten-Quellen

Fundus, aus dem wir Bausteine **gezielt** nach `core/brand-kit/` übernehmen (nie Bulk-Dump).
Immer: in unsere Token-/API-Konvention einpassen + auf Brand-Farben umfärben.

## ✅ RemotionUI  (remotionui.com · `riaz37/remotion-ui`)
Shadcn-artiges Registry, „source you own". ~70 Komponenten. **Lücken-Füller** für unser Kit:
- **Captions:** `karaoke-captions`, `caption-highlight`, `caption-scene` → Gold für Shorts
- **Transitions:** `light-leak`, `chromatic-aberration-wipe`, `zoom-through`, `spatial-push`, `clock-wipe`
- **Daten/Audio:** `line-chart-draw`, `audiogram-bars`, `waveform-line`, `audio-pulse`
- **Maps:** `map-flight`, `map-route`, `map-markers` → Erklär/KI/E-Technik
- **Sonstiges:** `device-mockup-zoom`, `simulated-cursor`, `confetti-burst`, `mesh-gradient-bg`, `dynamic-grid`

### Katalog ansehen / Komponente prüfen (NICHT blind `add`)
```bash
npx remotion-ui@latest list            # alle Komponenten
npx remotion-ui@latest view <name>     # Code/Deps einer Komponente ansehen
```

### Integration (manuell, sauber)
1. `view <name>` → Code lesen, Abhängigkeiten notieren.
2. Datei nach `core/brand-kit/components/` kopieren, Imports auf unsere Tokens (`../tokens`, `../fonts`) umstellen, Farben → `C`/Kanal-Akzent.
3. Nötige `@remotion/*`-Deps **im Root `package.json`** pinnen (Version `^4.0.473`), dann `npm install`.
4. Export in `core/brand-kit/index.ts` ergänzen.
5. ❌ NICHT `npx remotion-ui init/add` im Repo laufen lassen — legt in `src/` ab + installiert ungepinnte Deps (Peer-Konflikt react 18/19).

## ✅ Onda  (onda.video · `degueba/onda`)
Open-source Motion-Graphics für Remotion, „copy-paste, fully yours". 70 Komponenten + 18 Transitions
in 8 Kategorien. **Standout für KI/E-Technik:** Interface-Kategorie:
- `code-block`, `terminal`, `browser-frame`, `device-frame` → Code/Terminals/UIs zeigen
- Entrances (reveal/fade/slide/scale/rotate/mask/blur/typewriter), 18 Transitions

### Katalog / Integration (gleiche Regel wie RemotionUI)
```bash
npx ondajs list            # Katalog (bzw. onda.video/components)
npx ondajs add <name>      # NUR zum Ansehen in Scratch, NICHT ins Repo-root
```
→ Code lesen, nach `core/brand-kit/components/` einpassen, auf unsere Tokens/Farben umstellen,
nötige Deps im Root pinnen, in `index.ts` exportieren. ❌ Kein CLI-Auto-Install im Monorepo.

## ✅ Remotion Bits  (`av/remotion-bits`, npm `remotion-bits`)
Sauberes Remotion-npm-Paket. **NICHT ganz installieren** — zieht 2. `three`-Version (0.182 vs. unsere 0.171),
`prism-react-renderer`, `@modelcontextprotocol/sdk`; und Text/Counter/Code/Matrix/Gradient/Stagger haben wir schon (themed).
**Einzigartig & wert zu portieren (bei Bedarf, themed):**
- `ParticleSystem/` (Spawner+Behavior+Particles) — echte Partikel-Engine (Höhepunkte/CTA).
- `Scene3D/` (Element3D, Step, StepResponsive) — 3D-Szenen mit Schritten (nutzt `three`, haben wir).

## ✅ Remocn  (`Remocn/remocn` · remocn-Registry)
Shadcn-artige Registry: production-ready Animations, Transitions, Backgrounds, Scenes.
(Auch `remocn-studio` = Browser-Editor + Server-Render — nur als Inspiration, wir bleiben code-first.)

## ✅ React Video Editor  (`reactvideoeditor/remotion-templates` · MIT)
81 freie Templates: Charts & Data, Text, Content, Background, Cinematic, Transition, Logo, Intro/Outro
(z.B. Ken Burns, Blinds, Animated Text). Self-contained, frame-basiert. **Teils schon lokal** (altes gehirn).

## ✅ SwiftClip  (`zz41354899/SwiftClip`)
Production-ready Remotion-Templates + **Claude-Code-Storyboard-Workflow** — passt direkt zu unserer
4-Agenten-Pipeline. Gut als Referenz für Pipeline-Aufbau UND als Template-Fundus.

> Alle oben: **gleiche Integration** — Code ansehen, gezielt nach `core/brand-kit` einpassen,
> auf unsere Tokens/Farben umstellen, Deps im Root pinnen, in `index.ts` exportieren. Kein CLI-Auto-Install.

## 🎞️ Asset-Quellen (Animationen, keine Komponenten)

### LottieFiles  (lottiefiles.com)
Kostenlose + kostenpflichtige Lottie/GIF/MP4-Animationen.
**Gut für:** animierte Icons, technische Symbole, kleine Erklär-Animationen, UI-Elemente,
Ladeanimationen, Pfeile, Prozesse, Daten-/Business-Symbole.
- **Abspielen:** Lottie-JSON nach `channels/<name>/public/lottie/`, dann `LottieBox` aus `@studio/core`.
- ⚠️ **SPARSAM einsetzen.** Zu viele Lottie-Illustrationen lassen das Video wie eine *billige Erklär-App*
  aussehen. Nicht in jeder Szene. Für Zahlen/Konzepte → eigene Motion-Graphics + echte Lucide-Icons
  (siehe VIDEO-STIL-REGELN), Lottie nur als gezielter Akzent.

### Rive  (rive.app)  — offiziell in Remotion via `@remotion/rive` ✅
Vektor-Animationen mit visuellem Editor, **State Machines** & Runtimes. **Besser als Lottie** für:
hochwertige Vektorfiguren, animierte Objekte, **wiederverwendbare Charaktere**, Zustands-Animationen,
komplexere Illustrationen.
- **Abspielen:** `.riv` nach `channels/<name>/public/rive/`, dann `<Rive>` aus `@remotion/rive`
  (frame-synchron, render-sicher). Deps installiert: `@remotion/rive` + `@rive-app/canvas-advanced`.
- **Erstellen:** nur im **Rive-Editor** (rive.app) — das macht **Arman** (Account) oder lädt freie
  `.riv` aus der Rive-Community. Ich kann `.riv` nicht selbst zeichnen, aber voll einbinden.
- **→ Was Arman liefert:** eine `.riv`-Datei (oder Community-Link). Dann wire + verifiziere ich.

## 🆓 Kostenlose Asset-Quellen (zuerst hier suchen, bevor Abo!)
Arman lädt → in `channels/<name>/public/{broll,music,sfx,photos}/` → ich baue ein.
**Pflicht:** Quelle+Lizenz in `public/ASSETS.md` notieren (asset-curator-Regel). Dateinamen normalisieren.

| Quelle | Was | Lizenz-Hinweis |
|---|---|---|
| **Pexels** | B-Roll + Fotos (Doku/Tech/Business) | frei, kommerziell, keine Attribution. Modell-/Markenrechte selbst prüfen |
| **Pixabay** | Fotos, Videos, **Musik, SFX** (alles aus einer Quelle) | frei, kommerziell, ohne Attribution. Kein Standalone-Weiterverkauf |
| **Unsplash** | hochwertige Fotos (Editorial/Lifestyle) | frei inkl. kommerziell. Kein Video/SFX |
| **Mixkit** | Stockvideos, Musik, SFX, Templates | ⚠️ pro Asset Lizenz prüfen — nur „Free License" automatisch nutzen |
| **YouTube Audio Library** | Musik + SFX (in YouTube Studio) | einfachster YT-Standard; CC-Tracks brauchen Credit → in Beschreibung |
| **Google Fonts** | offene Fonts | **bevorzugen** vor proprietär; self-hosten (woff2 in `core/brand-kit/fonts`), kein CDN-Fetch |

→ **Reihenfolge:** erst kostenlos (oben) prüfen, Abo (unten) nur wenn nötig.

## 💰 Abo-Asset-Plattformen (Arman abonniert + lädt; ich baue ein)
Kein API/Login für mich — Arman lädt Assets, legt sie in den Kanal (oder gibt Link), ich integriere.
**Asset-Ordner pro Kanal:** `channels/<name>/public/{broll,music,sfx,photos}/`.

### ⭐ Envato Elements  (empfohlen — EIN Abo deckt am meisten)
Stockvideos, **Musik**, **Soundeffekte**, Fotos, Fonts, Grafiken, Motion Graphics.
- ✅ Nutzbar: B-Roll, Musik, SFX, Fotos, Fonts → direkt im Remotion-Video.
- ⚠️ „Video-Templates" sind meist AE/Premiere → **nicht** Remotion; wir nehmen nur die Roh-Assets.

### Motion Array  (Alternative — nur EINE nötig)
Stock-Footage, Motion Graphics, Musik, SFX, Templates, LUTs. Stärker auf klassischen Videoschnitt.
Nur wählen, wenn Fokus auf viel Footage/LUTs statt All-in-one.

### After-Effects-Templates → nur als gerendertes Footage
AE-Templates (Envato/Motion Array) sind **kein** React/Remotion. Aber Umweg:
1. In AE öffnen/anpassen → exportieren als **transparentes Video**:
   - **ProRes 4444** (`.mov`, Alpha) oder **VP9/WebM mit Alpha**.
2. Datei nach `channels/<name>/public/overlays/` → in Remotion via `<OffthreadVideo>` als
   Overlay/Hintergrund/Übergang einbauen.
Gut für: Overlays, Backgrounds, Übergänge, fertige Effekt-Animationen.

## 🌐 Nur fürs Web/App-Standbein (NICHT Video-Core)
- **Taste Skill** (`Leonxlnx/taste-skill`, MIT) — Anti-Slop-Framework für **Frontend/UI** (React/Next/Tailwind/Framer Motion).
  Exzellent, aber medium-fremd: einige Regeln widersprechen Video (Lila-Ban, Inter-Ban, Glow-Ban, kein großes H1).
  → Heimat = `~/web-studio` (Premium-Webseiten/digitale Produkte), dort installieren wenn wir daran arbeiten.
  Universelle Anti-Slop-Prinzipien sind im Video-Gerüst bereits abgedeckt (VIDEO-STIL-REGELN + stage + motion-quality-reviewer).

## ❌ Bewusst (vorerst) NICHT genutzt
- **Theatre.js** — visuelles Keyframe-Studio (HTML/SVG/Three/R3F). Verkompliziert das Setup;
  Kamerafahrten lösen wir nativ (`interpolate`/`spring` + `@remotion/three`). Nur reaktivieren, wenn
  eine sehr komplexe 3D-Kamerafahrt im Code zu fummelig wird.

## Weitere lokale Quellen (aus altem gehirn)
- magic-ui (60 Komp.), react-bits, 81 Remotion-Templates — siehe `core/gehirn/WEBSITE-BAUSTEINE-PORTIERUNG.md`.
