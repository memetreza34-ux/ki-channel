# Reel Layout Lock

Diese Werte sind gesperrter Produktionsvertrag:

- Header: `y=110–260`
- Animation: ausschließlich `y=300–1160`
- Caption: `bottom=520px`, `48px`, maximal zwei Zeilen
- Mindestabstand Animation zu konservativer Zwei-Zeilen-Caption: `100px`
- untere kritische Social-UI-Zone: `420px`

Die einzige Datenquelle ist `ki/reels/production-standard.json`. Source bezieht die Werte über `ki/src/reels/reelLayout.ts` und `ki/src/reels/captionSafe.ts`.

`npm run ki:reel:layout-lock` schlägt fehl, wenn Werte, Ableitung, Dokumentation oder das aktuelle Scene-Canvas auseinanderlaufen. Der GitHub-Workflow `Reel Layout Lock` führt diesen Check bei betroffenen Pull Requests und Änderungen an `main` aus.

Die geschützten Dateien stehen zusätzlich in `.github/CODEOWNERS`. Auf GitHub muss für `main` die Branch-Protection-Option **Require review from Code Owners** sowie der Statuscheck **Verify immutable reel layout zones** verpflichtend aktiviert sein. Erst dann kann keine Änderung ohne Armans Freigabe gemergt werden.
