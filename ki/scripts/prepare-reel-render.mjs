#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import {getGitState, renderLockPath, resolveSourceDir, runtimeAudioPath, safeCompositionId, sha256Directory, sha256File} from './lib/render-provenance.mjs';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/prepare-reel-render.mjs <reel-package-dir>');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const fail = (message) => { console.error(`REEL RENDER PREP FAILED: ${message}`); process.exit(1); };
const reelPath = path.join(reelDir,'06-projektdateien','reel.json');
const captionPath = path.join(reelDir,'03-caption','subtitle-cues.json');
if (!existsSync(reelPath)) fail(`reel.json missing: ${reelPath}`);
if (!existsSync(captionPath)) fail(`subtitle-cues.json missing: ${captionPath}`);

let reel;
try { reel = JSON.parse(await readFile(reelPath,'utf8')); }
catch (error) { fail(`invalid reel.json: ${error.message}`); }

const fps = Number(reel?.format?.fps);
const finalDuration = Number(reel?.format?.finalDurationInFrames);
if (!Number.isFinite(fps) || fps <= 0) fail('format.fps missing/invalid.');
if (!Number.isFinite(finalDuration) || finalDuration <= 0) fail('format.finalDurationInFrames is not locked. Planning duration may not be used for a production render.');

const scenes = reel?.scenes;
if (!Array.isArray(scenes) || scenes.length === 0) fail('reel.json scenes missing.');
let cursor = 0;
for (const [index, scene] of scenes.entries()) {
  if (!Number.isFinite(scene.startFrame) || !Number.isFinite(scene.endFrame) || scene.endFrame <= scene.startFrame) fail(`scene ${index+1} has invalid bounds.`);
  if (scene.startFrame !== cursor) fail(`scene ${index+1} starts at ${scene.startFrame}, expected ${cursor}.`);
  if (String(scene.timingStatus || '').toUpperCase() !== 'VOICE_LOCKED') fail(`scene ${index+1} timingStatus must be VOICE_LOCKED.`);
  cursor = scene.endFrame;
}
if (cursor !== finalDuration) fail(`last scene ends at ${cursor}, finalDurationInFrames is ${finalDuration}.`);

let git;
try { git = getGitState(); } catch (error) { fail(error.message); }
if (git.dirty) fail('working tree is dirty. Commit source/contract changes before a production render. Ignored runtime media may remain local.');

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
if (existsSync(isolationConfig)) run('source-isolation gate', path.resolve('ki/scripts/validate-reel-source-isolation.mjs'), [reelDir]);
run('runtime audio preparation', path.resolve('ki/scripts/prepare-reel-audio.mjs'), [reelDir]);

const compositionId = safeCompositionId(reel.compositionId);
if (!compositionId) fail('compositionId missing.');
const canonicalAudio = path.resolve(reelDir,reel?.audio?.targetFile || '');
const runtimeAudio = runtimeAudioPath(compositionId);
if (!existsSync(canonicalAudio)) fail(`canonical audio missing: ${canonicalAudio}`);
if (!existsSync(runtimeAudio)) fail(`runtime audio missing: ${runtimeAudio}`);

let sourceDir;
try { sourceDir = await resolveSourceDir(reelDir,reel); } catch (error) { fail(`could not resolve sourceDir: ${error.message}`); }
if (!sourceDir) fail('sourceDir missing. Add reel.json.sourceDir or source-isolation.json -> sourceDir before production render.');
const absoluteSourceDir = path.resolve(sourceDir);
if (!existsSync(absoluteSourceDir)) fail(`sourceDir does not exist: ${sourceDir}`);

const createdAtMs = Date.now();
const lock = {
  status: 'RENDER_LOCKED',
  createdAt: new Date(createdAtMs).toISOString(),
  createdAtMs,
  gitCommitSha: git.commitSha,
  compositionId,
  finalDurationInFrames: finalDuration,
  sourceDir,
  hashes: {
    sourceTreeSha256: await sha256Directory(absoluteSourceDir),
    reelJsonSha256: await sha256File(reelPath),
    captionJsonSha256: await sha256File(captionPath),
    canonicalAudioSha256: await sha256File(canonicalAudio),
    runtimeAudioSha256: await sha256File(runtimeAudio),
  },
};
const lockPath = renderLockPath(compositionId);
await writeFile(lockPath,`${JSON.stringify(lock,null,2)}\n`,'utf8');

console.log('REEL RENDER PREP PASSED');
console.log(`compositionId: ${compositionId}`);
console.log(`final duration: ${finalDuration} frames / ${(finalDuration/fps).toFixed(3)} s`);
console.log(`git commit: ${git.commitSha}`);
console.log(`source tree sha256: ${lock.hashes.sourceTreeSha256}`);
console.log(`render lock: ${lockPath}`);
console.log('Production render may now use the registered composition and prepared runtime WAV.');
