#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const projectArg = process.argv[2];
if (!projectArg) {
  throw new Error('Nutzung: node scripts/finalize-why-ai-forgets-sync.mjs <reel-ordner>');
}

const projectRoot = path.resolve(projectArg);
const syncFile = path.join(projectRoot, 'timeline', 'final-sync.json');
const sync = JSON.parse(fs.readFileSync(syncFile, 'utf8'));

const normalize = (value) => String(value).toLocaleLowerCase('de-DE').replace(/[^a-zäöüß0-9]/gi, '');

const replacements = new Map([
  ['s4-unavailable', 'Antwort'],
  ['s8-visible', 'vergisst'],
]);

for (const beat of sync.beats ?? []) {
  const replacement = replacements.get(beat.id);
  const scene = (sync.scenes ?? []).find((item) => item.id === beat.sceneId);
  const pair = (sync.captionPairs ?? []).find((item) => item.sceneId === beat.sceneId);
  if (!scene || !pair) throw new Error(`Sync-Zuordnung fehlt: ${beat.id}`);

  if (replacement) {
    const word = pair.sentences
      .flatMap((sentence) => sentence.words ?? [])
      .find((item) => normalize(item.text) === normalize(replacement));
    if (!word) throw new Error(`Ersatztrigger fehlt: ${beat.id}/${replacement}`);
    beat.expression = replacement;
    beat.transcriptStartFrame = Number(word.startFrame);
    beat.animationStartFrame = Number(word.startFrame);
    beat.resultFrame = Math.min(Number(scene.endFrame) - 1, Number(word.endFrame) + 35);
  }

  beat.resultFrame = Math.max(
    Number(beat.animationStartFrame),
    Math.min(Number(scene.endFrame) - 1, Number(beat.resultFrame)),
  );
}

fs.writeFileSync(syncFile, `${JSON.stringify(sync, null, 2)}\n`, 'utf8');
console.log(`✓ Späte semantische Trigger stabilisiert: ${syncFile}`);
