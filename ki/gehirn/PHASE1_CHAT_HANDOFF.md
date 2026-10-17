# Phase-1-Handoff: Zwei Links sind IM CHAT Pflicht

Für **jedes** Reel und jedes YouTube-Longform-Video verbindlich. Sobald Phase 1 mit echten Artefakten abgeschlossen und im GitHub-Branch/Commit veröffentlicht wurde, muss die abschließende Chat-Antwort ohne zusätzliche Nachfrage **zwei anklickbare GitHub-Dateilinks** enthalten.

1. **Bildprompt-Link** – Reels: 02-bilder/image-prompts.md; Longform: 02-visuals/image-prompts.md.
2. **Skript-Link** – 01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt.

**Nicht ausreichend:** Nur Ordnerpfade nennen, nur einen PR-Link schicken, Dateien ausschließlich auf GitHub ablegen oder die Links erst bei Phase 2/3 anbieten.

## Pflichtformat in der Chat-Antwort

**Phase 1 abgeschlossen – [Videotitel]**

- **Bildprompt-Link:** [Bildprompts / Bildkonzept öffnen](ECHTER_GITHUB_BLOB_LINK_ZUR_DATEI)
- **Skript-Link:** [Sprechertext öffnen](ECHTER_GITHUB_BLOB_LINK_ZUR_DATEI)

**Bilder:** Externe Bilder erforderlich / nicht erforderlich (Remotion-native oder echte Captures).
**Nächster Schritt:** Phase 2 – Voiceover und nur tatsächlich nötige reale Medien bereitstellen.

## Besonderheit ohne externe Bilder

Der Bildprompt-Link ist auch bei rein in Remotion erzeugten Videos Pflicht. In diesem Fall muss die Bildprompt-Datei ausdrücklich **Status: NICHT BENÖTIGT – REMOTION_NATIVE** oder REAL_CAPTURE enthalten und auf das tatsächliche Bildkonzept verweisen. Niemals unnötige Bilder erfinden. Wenn externe Stills nötig sind, enthält die Datei vollständige, szenenbezogene Prompts inklusive Seitenverhältnis, Stil, Beschriftungen und Zieldateinamen.

Für Longform ist 02-visuals/image-prompts.md der einheitliche Einstieg; ein vorhandener visual-plan.md darf verlinkt werden. Thumbnails liegen weiterhin separat im Thumbnail-Ordner.

## Vor dem Versand prüfen

- Phase 1 ist wirklich fertig: Story, Quellen, Sprechertext, Visualstrategie, notwendige Assets/Prompts und ausführbarer Source/Composition plus relevante Checks. Statusdatei PHASE-STATUS.md bestätigt den Abschluss.
- Beide Dateien existieren mit finalem Inhalt, ohne offene Platzhalter.
- Beide GitHub-Links zeigen auf **existierende remote veröffentlichte Dateien** des richtigen Branches/Commits; ein noch nicht gepushter lokaler Stand reicht nicht.
- Ist es ein Feature-/PR-Branch, im Chat angeben – niemals ungemergten Code als main ausgeben.
- Bei fehlenden Pflichtartefakten Phase 1 nicht als abgeschlossen behaupten, sondern ehrlich den Blocker melden.

## Optionaler Link-Generator

    npm run phase1:links -- "ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/01_Video" --ref="feature/mein-video"
    npm run phase1:links -- "ki/youtube-longform/YYYY-MM-DD/01_Video" --ref="feature/mein-video"

Das Skript prüft die lokalen Dateien, den Phase-1-Status und typische Platzhalter und erstellt die Markdown-Links. Es prüft **nicht selbst die GitHub-Remote-Verfügbarkeit**. Der Agent verifiziert beide URLs auf GitHub und sendet sie anschließend **in derselben Chat-Antwort**.
