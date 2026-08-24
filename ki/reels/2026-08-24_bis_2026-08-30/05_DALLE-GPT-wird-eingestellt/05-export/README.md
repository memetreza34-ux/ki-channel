# Final Export — KI-DalleGptEnds

Kein finaler Export vor Voice-Lock und echtem Render-Review.

Zielstruktur:

```text
05-export/
├── KI-DalleGptEnds.mp4
├── KI-DalleGptEnds-cover.png
├── KI-DalleGptEnds-caption.txt
└── KI-DalleGptEnds-export-manifest.json
```

Pflicht nach finalem Render:

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

Finalizer darf nur nach bestandenem Entertainment-, Voice-Lock-, Motion-, Source-Isolation-, Provenance- und Audio/Video-Gate exportieren.
