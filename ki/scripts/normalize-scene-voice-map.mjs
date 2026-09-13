#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/normalize-scene-voice-map.mjs <reel-package-dir>');
  process.exit(2);
}
const reelDir = path.resolve(rawReelDir);
const mapPath = path.join(reelDir, '01-script-audio', 'SCENE-VOICE-MAP.json');
if (!existsSync(mapPath)) {
  console.error(`SCENE VOICE MAP NORMALIZE FAILED: missing ${mapPath}`);
  process.exit(1);
}
let doc;
try { doc = JSON.parse(await readFile(mapPath, 'utf8')); }
catch (error) {
  console.error(`SCENE VOICE MAP NORMALIZE FAILED: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
}
const rows = Array.isArray(doc?.sentences) ? doc.sentences : [];
if (!rows.length) {
  console.error('SCENE VOICE MAP NORMALIZE FAILED: no sentences.');
  process.exit(1);
}
const ids = new Set();
const sentences = rows.map((sentence, index) => {
  const id = String(sentence?.id || sentence?.sentenceId || '').trim();
  if (!id) {
    console.error(`SCENE VOICE MAP NORMALIZE FAILED: sentence ${index + 1} has neither id nor sentenceId.`);
    process.exit(1);
  }
  if (ids.has(id)) {
    console.error(`SCENE VOICE MAP NORMALIZE FAILED: duplicate sentence id ${id}.`);
    process.exit(1);
  }
  ids.add(id);
  return {...sentence, id, sentenceId: id};
});
await writeFile(mapPath, `${JSON.stringify({...doc, sentences}, null, 2)}\n`, 'utf8');
console.log('SCENE VOICE MAP NORMALIZED');
console.log(`sentences: ${sentences.length}`);
