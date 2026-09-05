# 05 — Final Export

Noch kein neuer Final-Export nach dem Review-Fix vorhanden.

## Verbindliche Reihenfolge

1. Struktur-, Storytelling-, Level-Up-v4- und Visual-Gates ausführen.
2. Nutzer-Audio vorbereiten: Pause-Kompression → 1,10× pitch-preserving → Forced Alignment.
3. Szenen/Captions auf echte Word-Timings locken.
4. SFX lokal auflösen und Render-Lock erzeugen.
5. **Nicht manuell irgendein MP4 als Upload-Master verwenden.** Den Review-Master über den kanonischen Renderer erzeugen:

```bash
node ki/scripts/render-social-reel.mjs ki/reels/2026-08-31_bis_2026-09-06/06_Samstag/01_OpenAI-DseWiki-Agenten
```

Der Renderer erzeugt bewusst:
- H.264 mit CRF 18,
- AAC-Audio,
- anschließend automatisch den Social-Audio-Master auf ca. -16 LUFS / -1,5 dBTP,
- Audio-/Container-Validierung,
- einen `*.render-report.json`-Sidecar mit SHA256.

6. **Genau dieses gemasterte Review-MP4** bei 1x visuell und akustisch prüfen. Nach jeder Source-Änderung ist der alte Review ungültig.
7. Erst nach PASS den bestehenden Finalize-/Export-Package-Workflow auf das geprüfte gemasterte MP4 anwenden.

## Review-Schwerpunkte dieses Reels

- Cover bei Frame 15 / 0,5 s: Headline bleibt primärer Fokus, die erste Recent-Changes-Zeile darf bereits sichtbar sein.
- Captions müssen die gemeinsame Sans-Serif-Brandtypografie verwenden.
- Szene 3 darf nicht wie eine statische Carousel-Folie wirken; Indizien müssen sichtbar in die Einordnung fließen.
- Szene 4 muss Forscherbefund und OpenAI-Reaktion klar getrennt und visuell ausgewogen zeigen.
- Die letzten 24 Frames (0,8 s bei 30 FPS) sind ein ruhiger End-Hold; keine späte UI-Bewegung mehr.

Der Cover-Hold bleibt caption-frei.
