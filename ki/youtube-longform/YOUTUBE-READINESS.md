# YouTube Longform — Readiness Gate

Dieses Dokument ist der kurze operative Einstieg, bevor ein neues YouTube-Longform-Video produziert wird.

## 1. Repository zuerst prüfen

Auf dem aktuellen Arbeitsbranch mit Node 20 und installiertem Workspace ausführen:

```bash
node scripts/run-youtube-readiness.mjs
```

Der Gate erzeugt **keinen kostenpflichtigen Media-Call und keinen Produktionsrender**. Er prüft fail-closed:

1. Node 20
2. sauberen tracked Worktree
3. stabilen Git-HEAD während des gesamten Laufs
4. Syntax der Longform-Generator-/Readiness-/Render-/Release-Skripte
5. Antigravity-Longform-Capabilities
6. Longform-v1-Ordnerstruktur
7. Longform-v1-, Master-Gate- und Capability-Contract-Tests
8. expliziten TypeScript-Check für `ki/src/longform/**`
9. Repository-Wiring
10. Produktionsverträge

Maschinenlesbarer Report:

```text
out/youtube-readiness/summary.json
```

Nur `status: "passed"` auf dem tatsächlich verwendeten Commit zählt als technischer Preproduction-PASS.

## 2. Neues Video anlegen

Nach bestandenem Readiness-Gate:

```bash
node scripts/new-ki-longform.mjs "Video Titel" YYYY-MM-DD
```

Das neue Paket folgt `LONGFORM_V1` und liegt unter:

```text
ki/youtube-longform/YYYY-MM-DD/NN_Video-Titel/
```

Ausführbarer Source gehört getrennt nach:

```text
ki/src/longform/<sourceSlug>/
```

## 3. Phase 1

Vor dem Nutzer-Voiceover müssen mindestens fertig sein:

- finales deutsches Skript und Copy-Datei
- `CHAPTERS.json`
- `CLAIMS.json` mit geprüften Claims/Quellen
- `MEDIA-PLAN.json`
- Visual-Story-Plan
- mindestens drei Thumbnail-Konzepte
- Metadaten-Draft
- `LONGFORM-VERSION.json`
- ausführbarer TS/TSX-Source

Keine erfundenen Belege, Fake-Screenshots oder Remote-Medien zur Renderzeit.

## 4. Phase 2

Der Nutzer liefert ausschließlich das finale Produktions-Voiceover als `voiceover.wav` oder `voiceover.mp3`.

Danach werden echte Kapitel-/Wort-Timings erzeugt und die Timeline voice-locked. Keine künstlichen Fix-Dauern als Ersatz für Alignment.

## 5. Phase 3 — Render Readiness

Vor einem Produktionsrender:

```bash
node scripts/check-ki-longform-render-readiness.mjs <longform-package>
```

Dieser Gate blockiert unter anderem bei:

- fehlendem Nutzer-Voiceover
- nicht voice-locked Kapiteln
- ungeprüften Claims
- fehlenden oder nicht freigegebenen Medien
- falscher Rechte-/SHA-Provenance
- generierten Medien als Fake-Evidence
- README-only-/Placeholder-Source
- Remote-Medien im Source
- nicht registrierter Composition
- uncommitted Longform-Source

## 6. Kanonischer Master

Nur dieser Weg erzeugt einen Produktions-Review-Kandidaten:

```bash
node scripts/render-ki-longform-master.mjs <longform-package>
```

Er erzwingt Readiness, Render-Lock, H.264/CRF18, Audio-Mastering, Master-QA und Kontaktbögen.

Ein direkter `remotion render` ist nur Prototype und kein freigegebener Master.

## 7. Menschlicher Review + Release

Den exakt gemasterten Review-MP4 vollständig bei 1x ansehen und die Kontaktbögen prüfen. Danach Release-Plan aktualisieren und ausführen:

```bash
node scripts/check-ki-longform-release.mjs <longform-package>
```

Erst danach darf der Status `freigegeben` verwendet werden.

## Noch offener Repository-Punkt

Ein vertrauenswürdig erzeugter `package-lock.json` fehlt derzeit noch. Er darf nicht erfunden werden. Sobald ein echter Node-20-Installationslauf auf der Produktionsmaschine erfolgreich war, Lockfile committen und die Installation anschließend auf `npm ci` umstellen. Bis dahin bleibt dies eine Reproduzierbarkeitsgrenze, kein Grund für einen falschen PASS.
