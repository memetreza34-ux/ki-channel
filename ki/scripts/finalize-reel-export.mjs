#!/usr/bin/env node
import {copyFile, mkdir, readFile, rename, rm, stat, writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import {getGitState, renderContractSha256, renderLockPath, resolveSourceDir, runtimeAudioPath, safeCompositionId, sha256Directory, sha256File} from './lib/render-provenance.mjs';

const [rawReelDir, rawVideo, rawCoverTime] = process.argv.slice(2);
if (!rawReelDir || !rawVideo) {
  console.error('Usage: node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4> [cover-time-seconds]');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const sourceVideo = path.resolve(rawVideo);
const exportDir = path.join(reelDir, '05-export');
const reelJsonPath = path.join(reelDir, '06-projektdateien', 'reel.json');
const captionJsonPath = path.join(reelDir, '03-caption', 'subtitle-cues.json');
const captionSource = path.join(reelDir, '03-caption', 'FINAL-CAPTION.txt');

const scripts = {
  entertainment: path.resolve('ki','scripts','validate-entertainment-review.mjs'),
  sceneVoiceMap: path.resolve('ki','scripts','validate-scene-voice-map.mjs'),
  voiceLock: path.resolve('ki','scripts','validate-voice-locked-captions.mjs'),
  motion: path.resolve('ki','scripts','validate-motion-readability-review.mjs'),
  sourceIsolation: path.resolve('ki','scripts','validate-reel-source-isolation.mjs'),
  finalVideo: path.resolve('ki','scripts','validate-final-video.mjs'),
};

const fail = (message) => {
  console.error(`FINALIZE EXPORT FAILED: ${message}`);
  process.exit(1);
};

if (!existsSync(reelDir)) fail(`reel package not found: ${reelDir}`);
if (!existsSync(sourceVideo)) fail(`rendered video not found: ${sourceVideo}`);
if (!existsSync(exportDir)) fail(`05-export missing: ${exportDir}`);
if (!existsSync(reelJsonPath) || !existsSync(captionJsonPath)) fail('reel.json or subtitle-cues.json missing.');
for (const [name, script] of Object.entries(scripts)) {
  if (name === 'sourceIsolation') continue;
  if (!existsSync(script)) fail(`required validator missing: ${script}`);
}

let reelConfig;
try { reelConfig = JSON.parse(await readFile(reelJsonPath,'utf8')); }
catch (error) { fail(`could not parse reel.json: ${error.message}`); }
const compositionId = safeCompositionId(reelConfig?.compositionId);
if (!compositionId) fail('compositionId missing in reel.json.');
const sceneVoiceMapRelative = reelConfig?.sceneVoiceMap?.file || '01-script-audio/SCENE-VOICE-MAP.json';
const sceneVoiceMapPath = path.resolve(reelDir, sceneVoiceMapRelative);
if (!existsSync(sceneVoiceMapPath)) fail(`scene voice map missing: ${sceneVoiceMapPath}`);

const runGate = (label, script, args) => {
  const gate = spawnSync(process.execPath, [script, ...args], {encoding:'utf8'});
  if (gate.stdout) process.stdout.write(gate.stdout);
  if (gate.stderr) process.stderr.write(gate.stderr);
  if (gate.error) fail(`${label} could not start: ${gate.error.message}`);
  if (gate.status !== 0) fail(`${label} failed. No final export package was created.`);
};

runGate('entertainment gate', scripts.entertainment, [reelDir]);
runGate('scene/voice map gate', scripts.sceneVoiceMap, [reelDir]);
runGate('voice-lock gate', scripts.voiceLock, [reelDir]);
runGate('motion-readability gate', scripts.motion, [reelDir, sourceVideo]);
const isolationConfig = path.join(reelDir, '06-projektdateien', 'source-isolation.json');
if (existsSync(isolationConfig)) runGate('source-isolation gate', scripts.sourceIsolation, [reelDir]);
runGate('video/audio gate', scripts.finalVideo, [sourceVideo]);

const lockPath = renderLockPath(compositionId);
if (!existsSync(lockPath)) fail(`render provenance lock missing: ${lockPath}. Run prepare-reel-render.mjs before rendering.`);
let renderLock;
try { renderLock = JSON.parse(await readFile(lockPath,'utf8')); }
catch (error) { fail(`render provenance lock is invalid: ${error.message}`); }
if (renderLock.status !== 'RENDER_LOCKED' || renderLock.compositionId !== compositionId) fail('render provenance lock does not match this composition.');
if (Number(renderLock.finalDurationInFrames) !== Number(reelConfig?.format?.finalDurationInFrames)) fail('final duration changed after render preparation.');

let git;
try { git = getGitState(); } catch (error) { fail(error.message); }
if (git.dirty) fail('working tree is dirty. Commit review/metadata changes before finalizing the export.');

let sourceDir;
try { sourceDir = await resolveSourceDir(reelDir,reelConfig); } catch (error) { fail(`could not resolve sourceDir: ${error.message}`); }
if (!sourceDir || sourceDir !== renderLock.sourceDir) fail('sourceDir changed or is missing since render preparation.');
const canonicalAudio = path.resolve(reelDir,reelConfig?.audio?.targetFile || '');
const runtimeAudio = runtimeAudioPath(compositionId);
if (!existsSync(canonicalAudio) || !existsSync(runtimeAudio)) fail('canonical/runtime audio missing during provenance verification.');

const currentHashes = {
  sourceTreeSha256: await sha256Directory(path.resolve(sourceDir)),
  renderContractSha256: renderContractSha256(reelConfig),
  reelJsonSha256AtFinalization: await sha256File(reelJsonPath),
  sceneVoiceMapSha256: await sha256File(sceneVoiceMapPath),
  captionJsonSha256: await sha256File(captionJsonPath),
  canonicalAudioSha256: await sha256File(canonicalAudio),
  runtimeAudioSha256: await sha256File(runtimeAudio),
};
for (const key of ['sourceTreeSha256','renderContractSha256','sceneVoiceMapSha256','captionJsonSha256','canonicalAudioSha256','runtimeAudioSha256']) {
  if (renderLock?.hashes?.[key] !== currentHashes[key]) fail(`${key} changed after render preparation. Rerun prepare + render.`);
}
const sourceVideoStat = await stat(sourceVideo);
if (sourceVideoStat.mtimeMs + 1000 < Number(renderLock.createdAtMs || 0)) fail('rendered video predates the render lock; stale render rejected.');
const sourceVideoSha256 = await sha256File(sourceVideo);

const configuredCover = reelConfig?.export?.coverTimeSeconds;
const coverInput = rawCoverTime != null && rawCoverTime !== '' ? rawCoverTime : configuredCover;
if (coverInput == null || coverInput === '') fail('cover time missing. Set reel.json -> export.coverTimeSeconds after Hero/Contact-Sheet review or pass it as the third argument.');
const coverTime = Number(coverInput);
if (!Number.isFinite(coverTime) || coverTime < 0) fail('cover time is invalid. Set a non-negative number of seconds after Hero/Contact-Sheet review.');

if (!existsSync(captionSource)) fail(`canonical caption missing: ${captionSource}`);
const caption = (await readFile(captionSource, 'utf8')).trim();
if (caption.length < 20 || /\b(?:OFFEN|TODO|TBD|PLATZHALTER)\b/i.test(caption)) fail('FINAL-CAPTION.txt is empty or still contains a placeholder.');

const videoName = `${compositionId}.mp4`;
const coverName = `${compositionId}-cover.png`;
const captionName = `${compositionId}-caption.txt`;
const manifestName = `${compositionId}-export-manifest.json`;
const stageDir = path.join(exportDir, `.finalize-${process.pid}-${Date.now()}`);
await mkdir(stageDir, {recursive: true});

const stageVideo = path.join(stageDir, videoName);
const stageCover = path.join(stageDir, coverName);
const stageCaption = path.join(stageDir, captionName);
const stageManifest = path.join(stageDir, manifestName);

try {
  await copyFile(sourceVideo, stageVideo);

  const ffmpeg = spawnSync('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-ss', String(coverTime),
    '-i', sourceVideo,
    '-frames:v', '1',
    '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2',
    stageCover,
  ], {encoding: 'utf8'});
  if (ffmpeg.error) throw new Error(`ffmpeg could not start: ${ffmpeg.error.message}`);
  if (ffmpeg.status !== 0) throw new Error(`cover render failed: ${ffmpeg.stderr || ffmpeg.stdout}`);

  await writeFile(stageCaption, `${caption}\n`, 'utf8');

  const videoStat = await stat(stageVideo);
  const coverStat = await stat(stageCover);
  if (videoStat.size < 1024) throw new Error('staged final video is unexpectedly small.');
  if (coverStat.size < 1024) throw new Error('generated cover is unexpectedly small.');

  const artifactHashes = {
    videoSha256: await sha256File(stageVideo),
    coverSha256: await sha256File(stageCover),
    captionSha256: await sha256File(stageCaption),
  };
  if (artifactHashes.videoSha256 !== sourceVideoSha256) throw new Error('staged video hash differs from reviewed source video.');

  const manifest = {
    status: 'FINAL_EXPORT_READY',
    compositionId,
    exportedVideo: videoName,
    cover: coverName,
    coverTimeSeconds: coverTime,
    caption: captionName,
    gates: {
      entertainment: 'PASSED',
      sceneVoiceMap: 'PASSED_EXACT_SCENE_TEXT_AND_ANCHORS',
      voiceLock: 'PASSED',
      motionReadability: 'PASSED_EXACT_VIDEO_HASH',
      sourceIsolation: existsSync(isolationConfig) ? 'PASSED' : 'NOT_APPLICABLE',
      audioVideo: 'PASSED',
      renderProvenance: 'PASSED_LOCKED_INPUT_HASHES',
    },
    provenance: {
      renderSourceCommitSha: renderLock.gitCommitSha,
      finalizationCommitSha: git.commitSha,
      renderLockCreatedAt: renderLock.createdAt,
      sourceDir,
      sourceTreeSha256: currentHashes.sourceTreeSha256,
      renderContractSha256: currentHashes.renderContractSha256,
      reelJsonSha256AtRenderLock: renderLock.hashes.reelJsonSha256AtLock,
      reelJsonSha256AtFinalization: currentHashes.reelJsonSha256AtFinalization,
      sceneVoiceMapSha256: currentHashes.sceneVoiceMapSha256,
      captionJsonSha256: currentHashes.captionJsonSha256,
      canonicalAudioSha256: currentHashes.canonicalAudioSha256,
      runtimeAudioSha256: currentHashes.runtimeAudioSha256,
      reviewedVideoSha256: sourceVideoSha256,
    },
    artifacts: artifactHashes,
    generatedAt: new Date().toISOString(),
  };
  await writeFile(stageManifest, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  const finals = [videoName, coverName, captionName, manifestName];
  for (const name of finals) await rm(path.join(exportDir, name), {force: true});
  await rename(stageVideo, path.join(exportDir, videoName));
  await rename(stageCover, path.join(exportDir, coverName));
  await rename(stageCaption, path.join(exportDir, captionName));
  await rename(stageManifest, path.join(exportDir, manifestName));
  await rm(stageDir, {recursive: true, force: true});

  console.log('FINAL EXPORT PACKAGE READY');
  console.log(`video: ${path.join(exportDir, videoName)}`);
  console.log(`cover: ${path.join(exportDir, coverName)}`);
  console.log(`caption: ${path.join(exportDir, captionName)}`);
  console.log(`manifest: ${path.join(exportDir, manifestName)}`);
  console.log(`render source commit: ${renderLock.gitCommitSha}`);
  console.log(`reviewed video sha256: ${sourceVideoSha256}`);
} catch (error) {
  await rm(stageDir, {recursive: true, force: true});
  fail(error.message);
}
