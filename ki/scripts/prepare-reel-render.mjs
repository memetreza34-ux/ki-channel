#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/prepare-reel-render.mjs <reel-package-dir>');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const fail = (message) => { console.error(`REEL RENDER PREP FAILED: ${message}`); process.exit(1); };
const reelPath = path.join(reelDir,'06-projektdateien','reel.json');
if (!existsSync(reelPath)) fail(`reel.json missing: ${reelPath}`);

let reel;
try { reel = JSON.parse(await readFile(reelPath,'utf8')); }
catch (error) { fail(`invalid reel.json: ${error.message}`); }

const fps = Number(reel?.format?.fps);
const finalDuration = Number(reel?.format?.finalDurationInFrames);
if (!Number.isFinite(fps) || fps <= 0) fail('format.fps missing/invalid.');
if (!Number.isFinite(finalDuration) || finalDuration <= 0) {
  fail('format.finalDurationInFrames is not locked. Planning duration may not be used for a production render.');
}

const scenes = reel?.scenes;
if (!Array.isArray(scenes) || scenes.length === 0) fail('reel.json scenes missing.');
let cursor = 0;
for (const [index, scene] of scenes.entries()) {
  if (!Number.isFinite(scene.startFrame) || !Number.isFinite(scene.endFrame) || scene.endFrame <= scene.startFrame) {
    fail(`scene ${index+1} has invalid bounds.`);
  }
  if (scene.startFrame !== cursor) fail(`scene ${index+1} starts at ${scene.startFrame}, expected ${cursor}.`);
  if (String(scene.timingStatus || '').toUpperCase() !== 'VOICE_LOCKED') {
    fail(`scene ${index+1} timingStatus must be VOICE_LOCKED.`);
  }
  cursor = scene.endFrame;
}
if (cursor !== finalDuration) fail(`last scene ends at ${cursor}, finalDurationInFrames is ${finalDuration}.`);

const run = (label, script, args) => {
  if (!existsSync(script)) fail(`${label} script missing: ${script}`);
  const result = spawnSync(process.execPath,[script,...args],{encoding:'utf8'});
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) fail(`${label} could not start: ${result.error.message}`);
  if (result.status !== 0) fail(`${label} failed.`);
};

run('entertainment gate', path.resolve('ki/scripts/validate-entertainment-review.mjs'), [reelDir]);
run('voice-lock gate', path.resolve('ki/scripts/validate-voice-locked-captions.mjs'), [reelDir]);
const isolationConfig = path.join(reelDir,'06-projektdateien','source-isolation.json');
if (existsSync(isolationConfig)) {
  run('source-isolation gate', path.resolve('ki/scripts/validate-reel-source-isolation.mjs'), [reelDir]);
}
run('runtime audio preparation', path.resolve('ki/scripts/prepare-reel-audio.mjs'), [reelDir]);

console.log('REEL RENDER PREP PASSED');
console.log(`compositionId: ${reel.compositionId}`);
console.log(`final duration: ${finalDuration} frames / ${(finalDuration/fps).toFixed(3)} s`);
console.log('Production render may now use the registered composition and prepared runtime audio.');
