#!/usr/bin/env node
import {copyFile, mkdir, readFile, rename, rm, stat, writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const [rawReelDir, rawVideo, rawCoverTime] = process.argv.slice(2);
if (!rawReelDir || !rawVideo) {
  console.error('Usage: node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4> [cover-time-seconds]');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const sourceVideo = path.resolve(rawVideo);
const exportDir = path.join(reelDir, '05-export');
const reelJsonPath = path.join(reelDir, '06-projektdateien', 'reel.json');
const captionSource = path.join(reelDir, '03-caption', 'FINAL-CAPTION.txt');
const finalValidator = path.resolve('ki', 'scripts', 'validate-final-video.mjs');

const fail = (message) => {
  console.error(`FINALIZE EXPORT FAILED: ${message}`);
  process.exit(1);
};

if (!existsSync(reelDir)) fail(`reel package not found: ${reelDir}`);
if (!existsSync(sourceVideo)) fail(`rendered video not found: ${sourceVideo}`);
if (!existsSync(exportDir)) fail(`05-export missing: ${exportDir}`);
if (!existsSync(finalValidator)) fail(`final-video validator missing: ${finalValidator}`);

// HARD AUDIO GATE: nothing is copied into the final export package before this passes.
const gate = spawnSync(process.execPath, [finalValidator, sourceVideo], {encoding: 'utf8'});
if (gate.stdout) process.stdout.write(gate.stdout);
if (gate.stderr) process.stderr.write(gate.stderr);
if (gate.status !== 0) fail('video/audio gate failed. No final export package was created.');

let reelConfig = {};
if (existsSync(reelJsonPath)) {
  try {
    reelConfig = JSON.parse(await readFile(reelJsonPath, 'utf8'));
  } catch (error) {
    fail(`could not parse reel.json: ${error.message}`);
  }
}

const configuredCover = reelConfig?.export?.coverTimeSeconds;
const coverInput = rawCoverTime != null && rawCoverTime !== '' ? rawCoverTime : configuredCover;
if (coverInput == null || coverInput === '') {
  fail('cover time missing. Set reel.json -> export.coverTimeSeconds after Hero/Contact-Sheet review or pass it as the third argument.');
}
const coverTime = Number(coverInput);
if (!Number.isFinite(coverTime) || coverTime < 0) {
  fail('cover time is invalid. Set a non-negative number of seconds after Hero/Contact-Sheet review.');
}

if (!existsSync(captionSource)) {
  fail(`canonical caption missing: ${captionSource}`);
}
const caption = (await readFile(captionSource, 'utf8')).trim();
if (caption.length < 20 || /\b(?:OFFEN|TODO|TBD|PLATZHALTER)\b/i.test(caption)) {
  fail('FINAL-CAPTION.txt is empty or still contains a placeholder.');
}

const compositionId = String(reelConfig?.compositionId || path.basename(reelDir)).replace(/[^A-Za-z0-9._-]+/g, '-');
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

  const manifest = {
    status: 'FINAL_EXPORT_READY',
    compositionId,
    sourceVideo,
    exportedVideo: videoName,
    cover: coverName,
    coverTimeSeconds: coverTime,
    caption: captionName,
    audioGate: 'PASSED_BEFORE_EXPORT',
    generatedAt: new Date().toISOString(),
  };
  await writeFile(stageManifest, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  const finals = [videoName, coverName, captionName, manifestName];
  for (const name of finals) {
    await rm(path.join(exportDir, name), {force: true});
  }
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
} catch (error) {
  await rm(stageDir, {recursive: true, force: true});
  fail(error.message);
}
