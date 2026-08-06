#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
const finalMode = args.includes('--final');
if (!projectArg) {
  console.error('Nutzung: node scripts/validate-reel-animation-novelty.mjs <reel-ordner> [--final]');
  process.exit(1);
}

const projectRoot = path.resolve(projectArg);
const packageFile = path.join(projectRoot, 'timeline', 'codex-reel-package.json');
const matrixFile = path.join(projectRoot, '05-review', 'anti-repetition-matrix.md');
const errors = [];
const fail = (message) => errors.push(message);

if (!fs.existsSync(packageFile)) fail('timeline/codex-reel-package.json fehlt.');
if (!fs.existsSync(matrixFile)) fail('05-review/anti-repetition-matrix.md fehlt.');

let reel = null;
try {
  if (fs.existsSync(packageFile)) reel = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
} catch (error) {
  fail(`Reel-Vertrag ungültig: ${error.message}`);
}

if (reel) {
  const scenes = Array.isArray(reel.scenes) ? reel.scenes : [];
  const motions = scenes.map((scene) => String(scene.primaryMotion ?? '').trim());
  const icons = scenes.map((scene) => String(scene.headingIcon ?? '').trim());
  const resultStates = scenes.map((scene) => String(scene.resultState ?? '').trim());

  if (reel.visual?.antiRepetitionReviewRequired !== true) {
    fail('antiRepetitionReviewRequired muss true sein.');
  }
  if (Number(reel.motion?.reusedPrimaryMechanismsFromPreviousReel) !== 0) {
    fail('reusedPrimaryMechanismsFromPreviousReel muss 0 sein.');
  }
  if (motions.some((motion) => !motion)) fail('Jede Szene benötigt primaryMotion.');
  if (icons.some((icon) => !icon)) fail('Jede Szene benötigt headingIcon.');
  if (resultStates.some((state) => !state)) fail('Jede Szene benötigt resultState.');
  if (new Set(motions).size !== motions.length) fail('Alle Hauptbewegungen innerhalb des Reels müssen eindeutig sein.');
  if (new Set(icons).size !== icons.length) fail('Alle Überschriften-Icons innerhalb des Reels müssen eindeutig sein.');

  const weakPatterns = ['card-slide', 'bar-grow', 'list-reveal', 'dashboard', 'same-layout'];
  for (const [index, motion] of motions.entries()) {
    if (weakPatterns.some((pattern) => motion.toLowerCase() === pattern)) {
      fail(`${scenes[index].id}: zu generische oder wiederholte Hauptbewegung „${motion}“.`);
    }
  }
}

if (fs.existsSync(matrixFile)) {
  const matrix = fs.readFileSync(matrixFile, 'utf8');
  if (/REPLACE_ME|TODO/i.test(matrix)) fail('Anti-Wiederholungs-Matrix enthält Platzhalter.');
  if (finalMode) {
    const checkedRows = (matrix.match(/\[x\]/gi) ?? []).length;
    if (checkedRows < 8) fail(`Mindestens acht geprüfte Szenenzeilen erforderlich; gefunden: ${checkedRows}.`);
    if (/\[ \]/.test(matrix)) fail('Im finalen Modus enthält die Anti-Wiederholungs-Matrix ungeprüfte Punkte.');
  }
}

const report = {
  version: 1,
  mode: finalMode ? 'final' : 'planning',
  checkedAt: new Date().toISOString(),
  errors,
  passed: errors.length === 0,
};
const reviewDir = path.join(projectRoot, '05-review');
fs.mkdirSync(reviewDir, {recursive: true});
fs.writeFileSync(path.join(reviewDir, 'animation-novelty-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');

for (const error of errors) console.error(`FEHLER: ${error}`);
if (errors.length > 0) process.exit(1);
console.log('✓ Animations-Neuartigkeit und Anti-Wiederholung bestanden.');
