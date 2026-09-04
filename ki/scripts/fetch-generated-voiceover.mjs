#!/usr/bin/env node

console.error('USER AUDIO ONLY: Dieser KI-Kanal erlaubt keinen automatischen Voiceover-Download und keine Voiceover-Erzeugung durch Agenten.');
console.error('Der Nutzer erstellt das vollständige Voiceover selbst und legt die Datei unter reel.json -> audio.targetFile ab.');
console.error('Danach darf die Pipeline mit prepare-reel-audio.mjs / align-reel-local.mjs fortfahren.');
process.exit(1);
