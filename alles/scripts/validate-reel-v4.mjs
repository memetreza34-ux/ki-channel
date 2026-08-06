#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
const finalMode = args.includes('--final');
if (!projectArg) {
  console.error('Nutzung: node scripts/validate-reel-v4.mjs <reel-ordner> [--final]');
  process.exit(1);
}

const projectRoot = path.resolve(projectArg);
const errors = [];
const fail = (message) => errors.push(message);
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const packageFile = path.join(projectRoot, 'timeline', 'codex-reel-package.json');
const syncFile = path.join(projectRoot, 'timeline', 'final-sync.json');

if (!fs.existsSync(packageFile)) fail('timeline/codex-reel-package.json fehlt.');
if (!fs.existsSync(syncFile)) fail('timeline/final-sync.json fehlt.');

let reel = null;
let sync = null;
try { if (fs.existsSync(packageFile)) reel = readJson(packageFile); } catch (error) { fail(`Reel-Vertrag ungültig: ${error.message}`); }
try { if (fs.existsSync(syncFile)) sync = readJson(syncFile); } catch (error) { fail(`final-sync.json ungültig: ${error.message}`); }

if (reel) {
  if (reel.standardId !== 'ki-animation-only-reel-v4') fail(`standardId muss ki-animation-only-reel-v4 sein; gefunden: ${reel.standardId}.`);
  if (reel.captions?.mode !== 'single-sentence-active-word') fail('Caption-Modus muss single-sentence-active-word sein.');
  if (Number(reel.captions?.sentencesVisible) !== 1) fail('Es darf immer nur ein Satz sichtbar sein.');
  if (reel.captions?.fullTextVisibleImmediately !== true) fail('Der Satz muss vollständig sofort sichtbar sein.');
  if (reel.captions?.progressIndicator !== 'none') fail('Eine Fortschrittslinie ist verboten.');
  if (reel.captions?.largeBackgroundBoxAllowed !== false) fail('Eine große Untertitelbox ist verboten.');
  const bottom = Number(reel.captions?.bottomPx);
  if (bottom < 300 || bottom > 350) fail(`Untertitel-Unterkante muss 300 bis 350 px betragen; gefunden: ${bottom}.`);
  if (reel.visual?.headingIconRequired !== true) fail('Jede Überschrift benötigt ein semantisches Icon.');
  if (reel.visual?.headingIconType !== 'semantic-vector') fail('Überschriften-Icons müssen semantische Vektoren sein.');
  if (reel.visual?.repeatedStageFrameAllowed !== false) fail('Die wiederholte weiße Rahmenbühne muss deaktiviert sein.');
  if (Number(reel.visual?.primaryVisualAreaPercentMin) < 65) fail('Das Hauptvisual muss mindestens ungefähr 65 Prozent der Animationsfläche nutzen.');
  const scenes = Array.isArray(reel.scenes) ? reel.scenes : [];
  if (scenes.length < 8 || scenes.length > 9) fail(`8 bis 9 Szenen erforderlich; gefunden: ${scenes.length}.`);
  for (const scene of scenes) {
    if (!scene.headingIcon) fail(`${scene.id}: headingIcon fehlt.`);
    if (!scene.primaryObject || !scene.primaryMotion || !scene.resultState) fail(`${scene.id}: Choreografie-Vertrag unvollständig.`);
  }
}

if (sync) {
  const pairs = Array.isArray(sync.captionPairs) ? sync.captionPairs : [];
  const scenes = Array.isArray(sync.scenes) ? sync.scenes : [];
  if (pairs.length !== scenes.length) fail(`Satzpaare ${pairs.length} stimmen nicht mit Szenen ${scenes.length} überein.`);
  let visibleSentenceCount = 0;
  for (const [index, pair] of pairs.entries()) {
    const scene = scenes[index];
    if (!Array.isArray(pair.sentences) || pair.sentences.length !== 2) fail(`${pair.id}: zwei nacheinander sichtbare Sätze erforderlich.`);
    visibleSentenceCount += pair.sentences?.length ?? 0;
    if (scene && (Number(pair.startFrame) !== Number(scene.startFrame) || Number(pair.endFrame) !== Number(scene.endFrame))) fail(`${pair.id}: Satzspeicher muss die komplette Szene abdecken.`);
    for (const sentence of pair.sentences ?? []) {
      if (!sentence.text || !Array.isArray(sentence.words) || sentence.words.length === 0) fail(`${sentence.id}: Satz oder Wortzeiten fehlen.`);
      let cursor = Number(sentence.startFrame);
      for (const word of sentence.words ?? []) {
        const start = Number(word.startFrame);
        const end = Number(word.endFrame);
        if (!word.text || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) fail(`${sentence.id}: ungültiges Wort-Timing.`);
        if (start < cursor) fail(`${sentence.id}: Wortzeiten sind nicht sequenziell.`);
        cursor = end;
      }
    }
  }
  if (visibleSentenceCount < 16 || visibleSentenceCount > 18) fail(`16 bis 18 Einzel-Satz-Cues erforderlich; gefunden: ${visibleSentenceCount}.`);

  if (finalMode) {
    if (sync.status !== 'final-transcript-aligned') fail('Finaler Modus benötigt status final-transcript-aligned.');
    const beats = Array.isArray(sync.beats) ? sync.beats : [];
    for (const beat of beats) {
      const offset = Math.abs(Number(beat.animationStartFrame) - Number(beat.transcriptStartFrame));
      if (offset > 5) fail(`${beat.id}: Triggerabweichung ${offset} Frames.`);
      if (Number(beat.resultFrame) < Number(beat.animationStartFrame)) fail(`${beat.id}: Ergebnis liegt vor dem Trigger.`);
    }
    const speechEnd = Number(sync.audio?.speechEndSeconds);
    const duration = Number(sync.composition?.durationInFrames) / Number(sync.fps ?? 30);
    const hold = duration - speechEnd;
    if (!Number.isFinite(hold) || hold < 1.2 || hold > 2.2) fail(`Schluss-Hold ${hold.toFixed(2)} s; erlaubt 1,2 bis 2,2 s.`);

    const audioFolder = path.join(projectRoot, '02-audio');
    const supported = new Set(['.wav','.mp3','.m4a','.aac','.ogg','.mp4','.mov','.webm']);
    const audioFiles = fs.existsSync(audioFolder) ? fs.readdirSync(audioFolder).filter((name) => supported.has(path.extname(name).toLowerCase()) && fs.statSync(path.join(audioFolder, name)).size > 0) : [];
    if (audioFiles.length !== 1) fail(`02-audio benötigt genau eine Mediendatei; gefunden: ${audioFiles.length}.`);
  }
}

const report = {version: 1, standardId: reel?.standardId ?? null, mode: finalMode ? 'final' : 'planning', checkedAt: new Date().toISOString(), errors, passed: errors.length === 0};
const reviewDir = path.join(projectRoot, '05-review');
fs.mkdirSync(reviewDir, {recursive: true});
fs.writeFileSync(path.join(reviewDir, 'v4-standard-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
for (const error of errors) console.error(`FEHLER: ${error}`);
if (errors.length > 0) process.exit(1);
console.log('✓ v4-Standard bestanden: Einzel-Satz-Untertitel, Icons und Choreografie-Vertrag sind gültig.');
