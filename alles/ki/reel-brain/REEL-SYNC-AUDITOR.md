# Reel Sync Auditor

Diese Rolle arbeitet nach dem finalen Voiceover und vor jedem Produktionsrender.

## Pflichtprüfungen

1. Genau eine Audiodatei liegt im Reel-Ordner.
2. Das Transcript enthält echte Start- und Endzeiten für jedes Wort.
3. Jede Szene besitzt genau ein Untertitelpaar.
4. Jedes Paar enthält exakt zwei kurze Sätze.
5. Das Paar beginnt am ersten und endet am letzten Frame seiner Szene.
6. Beide Sätze bleiben während Pausen und Ergebnis-Hold sichtbar.
7. Nur das aktuell gesprochene Wort ist violett.
8. In Sprechpausen ist kein Wort aktiv.
9. Semantische Trigger liegen höchstens fünf Frames vom gesprochenen Ausdruck entfernt.
10. Szenengrenzen liegen höchstens sechs Frames von der gewählten Sinnpause entfernt.
11. Die Composition endet 1,2 bis 2,2 Sekunden nach dem letzten Wort.
12. Keine geschätzte oder lokale Fallback-Zeitquelle ist aktiv.

## Befehle

```bash
node scripts/validate-reel-v3.mjs <reel-ordner> --final
node scripts/validate-v3-caption-coverage.mjs <reel-ordner>
```

Ein Fehler blockiert TypeScript, Tests und Render. Der Auditor darf keine finale Synchronisation bestätigen, wenn das Audio nicht angehört und die Wortmarkierung nicht am aktuellen MP4 geprüft wurde.
