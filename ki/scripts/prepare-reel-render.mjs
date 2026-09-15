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
if (!existsSync(wordTimingsPath)) fail(`WORD-TIMINGS.json missing: ${wordTimingsPath}. Run npm run reel:sync -- <reel-package-dir> first.`);

let reel;
try { reel = JSON.parse(await readFile(reelPath, 'utf8')); }
catch (error) { fail(`invalid reel.json: ${error.message}`); }

const sceneVoiceMapRelative = reel?.sceneVoiceMap?.file || '01-script-audio/SCENE-VOICE-MAP.json';
const sceneVoiceMapPath = path.resolve(reelDir, sceneVoiceMapRelative);
if (!existsSync(sceneVoiceMapPath)) fail(`scene voice map missing: ${sceneVoiceMapPath}`);

const levelUpRelative = reel?.levelUp?.file || '06-projektdateien/LEVEL-UP-PLAN.json';
const levelUpPath = path.resolve(reelDir, levelUpRelative);
const levelUpEnabled = reel?.levelUp?.enabled === true || (/^\d{4}-\d{2}-\d{2}$/.test(String(reel?.publishDate || '')) && String(reel.publishDate) >= '2026-09-01');
if (levelUpEnabled && !existsSync(levelUpPath)) fail(`Level-Up plan missing: ${levelUpPath}`);

const publishDate = String(reel?.publishDate || '');
const levelUpV4Enabled = Number(reel?.levelUp?.standardVersion || 0) >= 4 || (/^\d{4}-\d{2}-\d{2}$/.test(publishDate) && publishDate >= '2026-09-05');
const brandMotionRelative = reel?.levelUp?.brandMotionPlanFile || '06-projektdateien/BRAND-MOTION-PLAN.json';
const brandMotionPath = path.resolve(reelDir, brandMotionRelative);
if (levelUpV4Enabled && !existsSync(brandMotionPath)) fail(`Level-Up v4 brand/motion plan missing: ${brandMotionPath}`);

const sfxEnabled = reel?.sfx?.enabled === true;
const sfxResolvedPath = sfxEnabled
  ? path.resolve(reelDir, reel?.sfx?.resolvedFile || '06-projektdateien/sfx-resolved.json')
  : null;
if (sfxEnabled && !existsSync(sfxResolvedPath)) fail(`resolved SFX plan missing: ${sfxResolvedPath}. Run npm run reel:sync -- <reel-package-dir> first.`);

const visualsEnabled = reel?.visuals?.enabled === true;
const visualManifestPath = visualsEnabled
  ? path.resolve(reelDir, reel?.visuals?.manifestFile || '06-projektdateien/visual-assets.json')
  : null;
const visualResolvedPath = visualsEnabled
  ? path.resolve(reelDir, reel?.visuals?.resolvedFile || '06-projektdateien/visual-assets-resolved.json')
  : null;
const generatedMediaRequestsRelative = visualsEnabled ? String(reel?.visuals?.generatedMediaRequests || '').trim() : '';
const generatedMediaManifestRelative = visualsEnabled ? String(reel?.visuals?.generatedMediaManifest || '').trim() : '';
const generatedMediaRequestsPath = generatedMediaRequestsRelative ? path.resolve(reelDir, generatedMediaRequestsRelative) : null;
const generatedMediaManifestPath = generatedMediaManifestRelative ? path.resolve(reelDir, generatedMediaManifestRelative) : null;
if (visualsEnabled && !existsSync(visualManifestPath)) fail(`visual asset manifest missing: ${visualManifestPath}`);
if (visualsEnabled && !existsSync(visualResolvedPath)) fail(`resolved visual asset manifest missing: ${visualResolvedPath}. Run resolve-reel-visual-assets.mjs first.`);

const verifyGeneratedMedia = async () => {
  if (!generatedMediaManifestPath || !existsSync(generatedMediaManifestPath)) return null;

  let manifest;
  try { manifest = JSON.parse(await readFile(generatedMediaManifestPath, 'utf8')); }
  catch (error) { fail(`invalid generated media manifest ${generatedMediaManifestPath}: ${error.message}`); }

  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) fail('generated media manifest must be a JSON object.');
  if (!Array.isArray(manifest.assets)) fail('generated media manifest assets must be an array.');
  if (reel?.reelId && manifest.reelId && String(manifest.reelId) !== String(reel.reelId)) {
    fail(`generated media manifest reelId ${manifest.reelId} does not match reel.json reelId ${reel.reelId}.`);
  }

  const publicRoot = path.resolve('public');
  const seenIds = new Set();
  const assets = [];

  for (const [index, asset] of manifest.assets.entries()) {
    const id = String(asset?.id || '').trim();
    const kind = String(asset?.kind || '').trim().toUpperCase();
    const expectedSha256 = String(asset?.sha256 || '').trim().toLowerCase();
    const rawPublicPath = String(asset?.publicPath || '').trim().replace(/\\/g, '/');

    if (!id) fail(`generated media asset ${index + 1} has no id.`);
    if (seenIds.has(id)) fail(`generated media asset id is duplicated: ${id}`);
    seenIds.add(id);
    if (!['IMAGE', 'BROLL'].includes(kind)) fail(`generated media asset ${id} has unsupported kind ${kind || '(empty)'}.`);
    if (!/^[a-f0-9]{64}$/.test(expectedSha256)) fail(`generated media asset ${id} has invalid sha256.`);
    if (!rawPublicPath || path.posix.isAbsolute(rawPublicPath)) fail(`generated media asset ${id} has invalid publicPath.`);

    const normalizedPublicPath = path.posix.normalize(rawPublicPath);
    if (normalizedPublicPath === '..' || normalizedPublicPath.startsWith('../') || !normalizedPublicPath.startsWith('reel-assets/generated/')) {
      fail(`generated media asset ${id} publicPath must stay under public/reel-assets/generated/.`);
    }

    const absolutePath = path.resolve(publicRoot, ...normalizedPublicPath.split('/'));
    const relativeToPublic = path.relative(publicRoot, absolutePath);
    if (!relativeToPublic || relativeToPublic.startsWith('..') || path.isAbsolute(relativeToPublic)) {
      fail(`generated media asset ${id} resolves outside the allowed generated-media root.`);
    }
    if (!existsSync(absolutePath)) fail(`generated media asset ${id} is missing locally: ${absolutePath}`);

    const actualSha256 = await sha256File(absolutePath);
    if (actualSha256 !== expectedSha256) {
      fail(`generated media asset ${id} sha256 mismatch. Re-materialize media before rendering.`);
    }

    assets.push({id, kind, publicPath: normalizedPublicPath, sha256: actualSha256});
  }

  return {manifest, assets};
};

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
run('Level-Up gate', path.resolve('ki/scripts/validate-reel-level-up.mjs'), [reelDir]);
if (levelUpV4Enabled) run('Level-Up v4 brand/motion gate', path.resolve('ki/scripts/validate-reel-brand-motion-v4.mjs'), [reelDir]);
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

const generatedMedia = await verifyGeneratedMedia();
const generatedMediaRequestsSha256 = generatedMediaRequestsPath && existsSync(generatedMediaRequestsPath)
  ? await sha256File(generatedMediaRequestsPath)
  : null;

const createdAtMs = Date.now();
const lock = {
  status: 'RENDER_LOCKED',
  createdAt: new Date(createdAtMs).toISOString(),
  createdAtMs,
  gitCommitSha: git.commitSha,
  compositionId,
  finalDurationInFrames: finalDuration,
  sourceDir,
  levelUpEnabled,
  levelUpV4Enabled,
  generatedMediaAssets: generatedMedia?.assets ?? [],
  hashes: {
    sourceTreeSha256: await sha256Directory(absoluteSourceDir),
    renderContractSha256: renderContractSha256(reel),
    reelJsonSha256AtLock: await sha256File(reelPath),
    levelUpPlanSha256: levelUpEnabled ? await sha256File(levelUpPath) : null,
    brandMotionPlanSha256: levelUpV4Enabled ? await sha256File(brandMotionPath) : null,
    sceneVoiceMapSha256: await sha256File(sceneVoiceMapPath),
    wordTimingsSha256: await sha256File(wordTimingsPath),
    captionJsonSha256: await sha256File(captionPath),
    sfxResolvedSha256: sfxEnabled ? await sha256File(sfxResolvedPath) : null,
    visualManifestSha256: visualsEnabled ? await sha256File(visualManifestPath) : null,
    visualResolvedSha256: visualsEnabled ? await sha256File(visualResolvedPath) : null,
    generatedMediaRequestsSha256,
    generatedMediaManifestSha256: generatedMedia ? await sha256File(generatedMediaManifestPath) : null,
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
if (levelUpEnabled) console.log(`level-up plan sha256: ${lock.hashes.levelUpPlanSha256}`);
if (levelUpV4Enabled) console.log(`brand/motion plan sha256: ${lock.hashes.brandMotionPlanSha256}`);
console.log(`scene voice map sha256: ${lock.hashes.sceneVoiceMapSha256}`);
console.log(`word timings sha256: ${lock.hashes.wordTimingsSha256}`);
if (sfxEnabled) console.log(`sfx resolved sha256: ${lock.hashes.sfxResolvedSha256}`);
if (visualsEnabled) {
  console.log(`visual manifest sha256: ${lock.hashes.visualManifestSha256}`);
  console.log(`visual resolved sha256: ${lock.hashes.visualResolvedSha256}`);
}
if (lock.hashes.generatedMediaRequestsSha256) console.log(`generated media requests sha256: ${lock.hashes.generatedMediaRequestsSha256}`);
if (lock.hashes.generatedMediaManifestSha256) {
  console.log(`generated media manifest sha256: ${lock.hashes.generatedMediaManifestSha256}`);
  console.log(`generated media assets locked: ${lock.generatedMediaAssets.length}`);
}
console.log(`render contract sha256: ${lock.hashes.renderContractSha256}`);
console.log(`render lock: ${lockPath}`);
console.log('Production render may now use the registered composition and all locked audio/SFX/visual/generated-media/Level-Up inputs.');
