# Motion Reference Selection — Arithmetic Reel

**Status:** SELECTED

Regel: Referenzen liefern Mechanik, nicht Skin/Branding. Keine Runtime-Abhängigkeit wird aus einem Referenzrepo übernommen.

## Query 1 — `number counter terminal word stagger`

**Gewählt:** Onda (`degueba/onda`, MIT)

Nützlich laut Katalog/Repo: Word-Stagger, Terminal, Code-Diff, Counter, Draw-On.

**Übernommene Idee:**
- Zahlwechsel als kurze, gewichtete Einzelereignisse statt 3–4 Sekunden Dauerinterpolation
- Token/Wort-Gruppen gestaffelt
- Terminal als semantisches Objekt, nicht als Card-Deko

**Nicht übernommen:** Farben, Layout, House-Style, fertige Scene Blocks.

## Query 2 — `stat counter comparison progress`

**Gewählt:** React Video Editor Remotion Templates (`reactvideoeditor/remotion-templates`, MIT)

**Übernommene Idee:**
- deterministischer Counter/Bar-Aufbau für Wahrscheinlichkeitskandidaten
- gemeinsame Achse statt mehrere Info-Cards

**Nicht übernommen:** Template-Look oder vollständige Komponenten.

## Interne Motion-Regeln

- zentrale `easedProgress`, `staggerDelay`, `followThrough`
- Objektreaktionen überwiegend 10–24 Frames
- Gruppenentwicklung länger durch Stagger, nicht durch langsame Einzelobjekte
- Shared-Object-Bridge zwischen falscher Gleichung und Token-Flow
- keine dekorativen Scene-Transitions
