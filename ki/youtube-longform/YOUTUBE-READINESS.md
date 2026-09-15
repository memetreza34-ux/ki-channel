# YouTube Longform — Readiness Gate

Dieses Dokument ist der kurze operative Einstieg, bevor ein neues YouTube-Longform-Video produziert wird.

## 1. Runtime einmal sauber herstellen

Der kanonische Produktionsstand verwendet **Node 24 LTS** und **npm 11**.

Vor dem ersten Produktionslauf auf einer neuen Maschine:

```bash
npm run runtime:bootstrap
```

Der Bootstrap führt einen echten Workspace-Install aus und erzeugt `package-lock.json`. Wenn der Lockfile neu oder verändert ist, wird der Lauf absichtlich beendet: Lockfile committen und danach ausführen:

```bash
npm run runtime:verify
```

`runtime:verify` verlangt einen committed Lockfile, installiert reproduzierbar mit `npm ci`, führt den YouTube-Readiness-Gate und `test:readiness` aus und erzeugt:

```text
out/pre-youtube-runtime/summary.json
```

Nur `status: "passed"` auf dem tatsächlich verwendeten Commit zählt als Runtime-/Preproduction-PASS.

## 2. Repository-Readiness

Der direkte Gate kann auf einem bereits installierten, sauberen Workspace separat ausgeführt werden:

```bash
node scripts/run-youtube-readiness.mjs
```

Der Gate erzeugt **keinen kostenpflichtigen Media-Call und keinen Produktionsrender**. Er prüft fail-closed:

1. Node 24 LTS
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

## 3. Neues Video anlegen

Nach bestandenem Runtime-/Readiness-Gate:

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

## 4. Phase 1

Vor dem Nutzer-Voiceover müssen mindestens fertig sein:

- finales deutsches Skript und Copy-Datei
- `CHAPTERS.json`
- `CLAIMS.json` mit geprüften Claims/Quellen
- `MEDIA-PLAN.json`
- `VISUAL-STORY-PLAN.md`
- mindestens drei Thumbnail-Konzepte
- Metadaten-Draft
- `LONGFORM-VERSION.json`
- ausführbarer TS/TSX-Source

Keine erfundenen Belege, Fake-Screenshots oder Remote-Medien zur Renderzeit.

## 5. Phase 2

Der Nutzer liefert ausschließlich das finale Produktions-Voiceover als `voiceover.wav` oder `voiceover.mp3`.

Danach werden echte Kapitel-/Wort-Timings erzeugt und die Timeline voice-locked. Keine künstlichen Fix-Dauern als Ersatz für Alignment.

## 6. Phase 3 — Render Readiness

Produktionsbefehle laufen über die Node-24-LTS-Runtime. Vor einem Produktionsrender:

```bash
node scripts/with-longform-node24.mjs scripts/check-ki-longform-render-readiness.mjs <longform-package>
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

## 7. Kanonischer Master

Nur dieser Weg erzeugt einen Produktions-Review-Kandidaten:

```bash
node scripts/with-longform-node24.mjs scripts/render-ki-longform-master.mjs <longform-package>
```

Er erzwingt Readiness, Render-Lock, H.264/CRF18, Audio-Mastering, Master-QA und Kontaktbögen.

Ein direkter `remotion render` ist nur Prototype und kein freigegebener Master.

## 8. Menschlicher Review + Release

Den exakt gemasterten Review-MP4 vollständig bei 1x ansehen und die Kontaktbögen prüfen. Danach Release-Plan aktualisieren und ausführen:

```bash
node scripts/with-longform-node24.mjs scripts/check-ki-longform-release.mjs <longform-package>
```

Erst danach darf der Status `freigegeben` verwendet werden.

## Aktuell noch offener externer Schritt

`package-lock.json` muss einmal durch `npm run runtime:bootstrap` in einer echten Node-24/npm-11-Umgebung erzeugt und committed werden. CI ist bereits auf `npm ci` umgestellt und soll bis dahin bewusst nicht grün werden. Ein fehlender Lockfile ist damit ein sichtbarer Blocker und kein stiller Fallback auf eine unreproduzierbare Installation.
