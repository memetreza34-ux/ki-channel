#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const projectArg = process.argv[2];
if (!projectArg) {
  console.error('Nutzung: node scripts/validate-v3-caption-coverage.mjs <reel-ordner>');
  process.exit(1);
}

const projectRoot = path.resolve(projectArg);
const syncFile = path.join(projectRoot, 'timeline', 'final-sync.json');
if (!fs.existsSync(syncFile)) throw new Error(`final-sync.json fehlt: ${syncFile}`);

const sync = JSON.parse(fs.readFileSync(syncFile, 'utf8'));
const scenes = Array.isArray(sync.scenes) ? sync.scenes : [];
const pairs = Array.isArray(sync.captionPairs) ? sync.captionPairs : [];
const errors = [];

if (pairs.length !== scenes.length) {
  errors.push(`Untertitelpaare ${pairs.length} stimmen nicht mit Szenen ${scenes.length} überein.`);
}

for (const [index, scene] of scenes.entries()) {
  const pair = pairs[index];
  if (!pair) continue;
  if (pair.sceneId !== scene.id) errors.push(`${pair.id}: sceneId ${pair.sceneId} statt ${scene.id}.`);
  if (Number(pair.startFrame) !== Number(scene.startFrame)) errors.push(`${pair.id}: beginnt nicht am ersten Szenenframe.`);
  if (Number(pair.endFrame) !== Number(scene.endFrame)) errors.push(`${pair.id}: endet nicht am letzten Szenenframe.`);
  if (!Array.isArray(pair.sentences) || pair.sentences.length !== 2) errors.push(`${pair.id}: exakt zwei Sätze erforderlich.`);
  if (pair.mode !== 'dual-sentence-active-word') errors.push(`${pair.id}: falscher Caption-Modus.`);

  for (const sentence of pair.sentences ?? []) {
    if (Number(sentence.startFrame) < Number(pair.startFrame) || Number(sentence.endFrame) > Number(pair.endFrame)) {
      errors.push(`${sentence.id}: Sprachzeit liegt außerhalb des sichtbaren Satzpaars.`);
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`FEHLER: ${error}`);
  process.exit(1);
}

console.log(`✓ ${pairs.length} Untertitelpaare decken ihre vollständigen Szenen ab.`);
