#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import {getGitState, renderContractSha256, renderLockPath, resolveSourceDir, runtimeAudioPath, safeCompositionId, sha256Directory, sha256File} from './lib/render-provenance.mjs';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/prepare-reel-render.mjs <reel-package-dir>');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const fail = (message) => { console.error(`REEL RENDER PREP FAILED: ${message}`); process.exit(1); };
const reelPath = path.join(reelDir, '06-projektdateien', 'reel.json');
const captionPath = path.join(reelDir, '03-caption', 'subtitle-cues.json');
const wordTimingsPath = path.join(reelDir, '01-script-audio', 'WORD-TIMINGS.json');
if (!existsSync(reelPath)) fail(`reel.json missing: ${reelPath}`);
if (!existsSync(captionPath)) fail(`subtitle-cues.json missing: ${captionPath}`);
if (!existsSync(wordTimingsPath)) fail(`WORD-TIMINGS.json missing: ${wordTimingsPath}. Run align-reel-local.mjs first.`);

let reel;
try { reel = JSON.parse(await readFile(reelPath, 'utf8')); }
catch (error) { fail(`invalid reel.json: ${error.message}`); }

const sceneVoiceMapRelative = reel?.sceneVoiceMap?.file || '01-script-audio/SCENE-VOICE-MAP.json';
const sceneVoiceMapPath = path.resolve(reelDir, sceneVoiceMapRelative);
if (!existsSync(sceneVoiceMapPath)) fail(`scene voice map missing: ${sceneVoiceMapPath}`);

const sfxEnabled = reel?.sfx?.enabled === true;
const sfxResolvedPath = sfxEnabled
  ? path.resolve(reelDir, reel?.sfx?.resolvedFile || '06-projektdateien/sfx-resolved.json')
  : null;
if (sfxEnabled && !existsSync(sfxResolvedPath)) fail(`resolved SFX plan missing: ${sfxResolvedPath}. Run align-reel-local.mjs first.`);

const visualsEnabled = reel?.visuals?.enabled === true;
const visualManifestPath = visualsEnabled
  ? path.resolve(reelDir, reel?.visuals?.manifestFile || '06-projektdateien/visual-assets.json')
  : null;
const visualResolvedPath = visualsEnabled
  ? path.resolve(reelDir, reel?.visuals?.resolvedFile || '06-projektdateien/visual-assets-resolved.json')
  : null;
if (visualsEnabled && !existsSync(visualManifestPath)) fail(`visual asset manifest missing: ${visualManifestPath}`);
if (visualsEnabled && !existsSync(visualResolvedPath)) fail(`resolved visual asset manifest missing: ${visualResolvedPath}. Run resolve-reel-visual-assets.mjs first.`);

const fps = Number(reel?.format?.fps);
const finalDuration = Number(reel?.format?.finalDurationInFrames);
if (!Number.isFinite(fps) || fps <= 0) fail('format.fps missing/invalid.');
if (!Number.isFinite(finalDuration) || finalDuration <= 0) fail('format.finalDurationInFrames is not locked. Planning duration may not be used for a production render.');

const targetMinSecondsRaw = reel?.scriptBudget?.targetMinSeconds;
const targetMaxSecondsRaw = reel?.scriptBudget?.targetMaxSeconds;
if ((targetMinSecondsRaw == null) !== (targetMaxSecondsRaw == null)) fail('scriptBudget.targetMinSeconds and targetMaxSeconds must either both be set or both be omitted.');
if (targetMinSecondsRaw != null && targetMaxSecondsRaw != null) {
  const targetMinSeconds = Number(targetMinSecondsRaw);
  const targetMaxSeconds = Number(targetMaxSecondsRaw);
  if (!Number.isFinite(targetMinSeconds) || !Number.isFinite(targetMaxSeconds) || targetMinSeconds <= 0 || targetMaxSeconds < targetMinSeconds) {
    fail('scriptBudget target duration is invalid.');
  }
  const actualDurationSeconds = finalDuration / fps;
  const allowDurationOutsideTarget = reel?.scriptBudget?.allowDurationOutsideTarget === true;
  const durationExceptionReason = String(reel?.scriptBudget?.durationExceptionReason || '').trim();
  if ((actualDurationSeconds < targetMinSeconds || actualDurationSeconds > targetMaxSeconds) && !(allowDurationOutsideTarget && durationExceptionReason.length >= 12)) {
    fail(`voice-locked duration ${actualDurationSeconds.toFixed(3)} s is outside required ${targetMinSeconds}-${targetMaxSeconds} s. Regenerate/adjust the script+voiceover or document a deliberate duration exception.`);
  }
}

const scenes = reel?.scenes;
if (!Array.isArray(scenes) || scenes.length === 0) fail('reel.json scenes missing.');
let cursor = 0;
for (const [index, scene] of scenes.entries()) {
  if (!Number.isFinite(scene.startFrame) || !Number.isFinite(scene.endFrame) || scene.endFrame <= scene.startFrame) fail(`scene ${index + 1} has invalid bounds.`);
  if (scene.startFrame !== cursor) fail(`scene ${index + 1} starts at ${scene.startFrame}, expected ${cursor}.`);
  if (String(scene.timingStatus || '').toUpperCase() !== 'VOICE_LOCKED') fail(`scene ${index + 1} timingStatus must be VOICE_LOCKED.`);
  cursor = scene.endFrame;
}
if (cursor !== finalDuration) fail(`last scene ends at ${cursor}, finalDurationInFrames is ${finalDuration}.`);

let git;
try { git = getGitState(); } catch (error) { fail(error.message); }
if (git.dirty) fail('working tree is dirty. Commit source/contract/timing/SFX/visual changes before a production render. Ignored runtime media may remain local.');

const run = (label, script, args) => {
  if (!existsSync(script)) fail(`${label} script missing: ${script}`);
  const result = spawnSync(process.execPath, [script, ...args], {encoding: 'utf8'});
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) fail(`${label} could not start: ${result.error.message}`);
  if (result.status !== 0) fail(`${label} failed.`);
};

run('script budget gate', path.resolve('ki/scripts/validate-reel-script-budget.mjs'), [reelDir]);
run('storytelling motion gate', path.resolve('ki/scripts/validate-storytelling-motion.mjs'), [reelDir]);
run('runtime audio preparation', path.resolve('ki/scripts/prepare-reel-audio.mjs'), [reelDir]);
run('local forced-alignment gate', path.resolve('ki/scripts/validate-local-forced-alignment.mjs'), [reelDir]);
run('scene/voice map gate', path.resolve('ki/scripts/validate-scene-voice-map.mjs'), [reelDir]);
run('entertainment gate', path.resolve('ki/scripts/validate-entertainment-review.mjs'), [reelDir]);
run('voice-lock gate', path.resolve('ki/scripts/validate-voice-locked-captions.mjs'), [reelDir]);
if (sfxEnabled) run('SFX plan gate', path.resolve('ki/scripts/validate-reel-sfx-plan.mjs'), [reelDir]);
if (visualsEnabled) run('visual asset gate', path.resolve('ki/scripts/validate-reel-visual-assets.mjs'), [reelDir]);
const isolationConfig = path.join(reelDir, '06-projektdateien', 'source-isolation.json');
if (existsSync(isolationConfig)) run('source-isolation gate', path.resolve('ki/scripts/validate-reel-source-isolation.mjs'), [reelDir]);

const compositionId = safeCompositionId(reel.compositionId);
if (!compositionId) fail('compositionId missing.');
const canonicalAudio = path.resolve(reelDir, reel?.audio?.targetFile || '');
const runtimeAudio = runtimeAudioPath(compositionId);
if (!existsSync(canonicalAudio)) fail(`canonical audio missing: ${canonicalAudio}`);
if (!existsSync(runtimeAudio)) fail(`runtime audio missing: ${runtimeAudio}`);

let sourceDir;
try { sourceDir = await resolveSourceDir(reelDir, reel); } catch (error) { fail(`could not resolve sourceDir: ${error.message}`); }
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
    renderContractSha256: renderContractSha256(reel),
    reelJsonSha256AtLock: await sha256File(reelPath),
    sceneVoiceMapSha256: await sha256File(sceneVoiceMapPath),
    wordTimingsSha256: await sha256File(wordTimingsPath),
    captionJsonSha256: await sha256File(captionPath),
    sfxResolvedSha256: sfxEnabled ? await sha256File(sfxResolvedPath) : null,
    visualManifestSha256: visualsEnabled ? await sha256File(visualManifestPath) : null,
    visualResolvedSha256: visualsEnabled ? await sha256File(visualResolvedPath) : null,
    canonicalAudioSha256: await sha256File(canonicalAudio),
    runtimeAudioSha256: await sha256File(runtimeAudio),
  },
};
const lockPath = renderLockPath(compositionId);
await writeFile(lockPath, `${JSON.stringify(lock, null, 2)}\n`, 'utf8');

console.log('REEL RENDER PREP PASSED');
console.log(`compositionId: ${compositionId}`);
console.log(`final duration: ${finalDuration} frames / ${(finalDuration / fps).toFixed(3)} s`);
console.log(`git commit: ${git.commitSha}`);
console.log(`source tree sha256: ${lock.hashes.sourceTreeSha256}`);
console.log(`scene voice map sha256: ${lock.hashes.sceneVoiceMapSha256}`);
console.log(`word timings sha256: ${lock.hashes.wordTimingsSha256}`);
if (sfxEnabled) console.log(`sfx resolved sha256: ${lock.hashes.sfxResolvedSha256}`);
if (visualsEnabled) {
  console.log(`visual manifest sha256: ${lock.hashes.visualManifestSha256}`);
  console.log(`visual resolved sha256: ${lock.hashes.visualResolvedSha256}`);
}
console.log(`render contract sha256: ${lock.hashes.renderContractSha256}`);
console.log(`render lock: ${lockPath}`);
console.log('Production render may now use the registered composition and all locked audio/SFX/visual inputs.');
