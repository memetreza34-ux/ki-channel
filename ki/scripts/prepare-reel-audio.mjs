#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>');
  process.exit(1);
}

const fail = (message) => {
  console.error(`REEL AUDIO PREP FAILED: ${message}`);
  process.exit(1);
};

const reelDir = path.resolve(rawReelDir);
const reelJsonPath = path.join(reelDir, '06-projektdateien', 'reel.json');
if (!existsSync(reelJsonPath)) fail(`reel.json missing: ${reelJsonPath}`);

let reel;
try { reel = JSON.parse(await readFile(reelJsonPath, 'utf8')); }
catch (error) { fail(`invalid reel.json: ${error.message}`); }

const compositionId = String(reel?.compositionId || '').replace(/[^A-Za-z0-9._-]+/g, '-');
if (!compositionId) fail('compositionId missing in reel.json.');

const targetFile = reel?.audio?.targetFile;
if (!targetFile || typeof targetFile !== 'string') fail('reel.json -> audio.targetFile missing.');
const sourceAudio = path.resolve(reelDir, targetFile);
if (!existsSync(sourceAudio)) fail(`canonical local voiceover missing: ${sourceAudio}`);

const probeAudio = (file) => {
  const probe = spawnSync('ffprobe', [
    '-v','error','-select_streams','a:0',
    '-show_entries','stream=codec_name,sample_rate,channels:format=duration',
    '-of','json',file,
  ], {encoding:'utf8'});
  if (probe.error) fail(`ffprobe could not start: ${probe.error.message}`);
  if (probe.status !== 0) fail(`ffprobe failed for ${file}: ${probe.stderr || probe.stdout}`);
  try { return JSON.parse(probe.stdout); }
  catch { fail(`ffprobe output could not be parsed for ${file}.`); }
};

const info = probeAudio(sourceAudio);
if (!info?.streams?.length) fail('canonical voiceover has no audio stream.');
const sourceDuration = Number(info?.format?.duration || 0);
if (!Number.isFinite(sourceDuration) || sourceDuration <= 0) fail('canonical voiceover has invalid duration.');

const pauseConfig = reel?.audio?.pauseCompression || {};
const pauseCompressionEnabled = pauseConfig.enabled === true;
const thresholdDb = Number.isFinite(Number(pauseConfig.thresholdDb)) ? Number(pauseConfig.thresholdDb) : -35;
const triggerSeconds = Number.isFinite(Number(pauseConfig.triggerSeconds)) ? Number(pauseConfig.triggerSeconds) : 0.15;
const keepSeconds = Number.isFinite(Number(pauseConfig.keepSeconds)) ? Number(pauseConfig.keepSeconds) : 0.05;
const startKeepSeconds = Number.isFinite(Number(pauseConfig.startKeepSeconds)) ? Number(pauseConfig.startKeepSeconds) : 0.03;
const maxAllowedSilenceSeconds = Number.isFinite(Number(pauseConfig.maxAllowedSilenceSeconds)) ? Number(pauseConfig.maxAllowedSilenceSeconds) : 0.25;
const maxReductionRatio = Number.isFinite(Number(pauseConfig.maxReductionRatio)) ? Number(pauseConfig.maxReductionRatio) : 0.25;

if (pauseCompressionEnabled) {
  if (!(thresholdDb < 0 && thresholdDb >= -80)) fail('audio.pauseCompression.thresholdDb must be between -80 and <0.');
  if (!(triggerSeconds >= 0.08 && triggerSeconds <= 0.6)) fail('audio.pauseCompression.triggerSeconds must be between 0.08 and 0.6.');
  if (!(keepSeconds >= 0.02 && keepSeconds < triggerSeconds)) fail('audio.pauseCompression.keepSeconds must be >=0.02 and smaller than triggerSeconds.');
  if (!(startKeepSeconds >= 0 && startKeepSeconds <= 0.15)) fail('audio.pauseCompression.startKeepSeconds must be between 0 and 0.15.');
  if (!(maxAllowedSilenceSeconds >= triggerSeconds && maxAllowedSilenceSeconds <= 0.6)) fail('audio.pauseCompression.maxAllowedSilenceSeconds is invalid.');
  if (!(maxReductionRatio > 0 && maxReductionRatio <= 0.4)) fail('audio.pauseCompression.maxReductionRatio must be >0 and <=0.4.');
}

const runtimeDir = path.resolve('public', 'runtime-audio');
await mkdir(runtimeDir, {recursive:true});
const runtimeAudio = path.join(runtimeDir, `${compositionId}.wav`);
const pacingReport = path.join(runtimeDir, `${compositionId}.pacing.json`);
await rm(runtimeAudio, {force:true});
await rm(pacingReport, {force:true});

const ffmpegArgs = ['-hide_banner','-loglevel','error','-y','-i',sourceAudio,'-vn'];
if (pauseCompressionEnabled) {
  const filter = [
    'silenceremove=',
    'start_periods=1',
    ':start_duration=0.02',
    `:start_threshold=${thresholdDb}dB`,
    `:start_silence=${startKeepSeconds}`,
    ':stop_periods=-1',
    `:stop_duration=${triggerSeconds}`,
    `:stop_threshold=${thresholdDb}dB`,
    `:stop_silence=${keepSeconds}`,
    ':detection=rms',
  ].join('');
  ffmpegArgs.push('-af', filter);
}
ffmpegArgs.push('-ac','2','-ar','48000','-c:a','pcm_s16le',runtimeAudio);

const ffmpeg = spawnSync('ffmpeg', ffmpegArgs, {encoding:'utf8'});
if (ffmpeg.error) fail(`ffmpeg could not start: ${ffmpeg.error.message}`);
if (ffmpeg.status !== 0) fail(`runtime audio conversion failed: ${ffmpeg.stderr || ffmpeg.stdout}`);
if (!existsSync(runtimeAudio)) fail('runtime audio was not created.');

const runtimeInfo = probeAudio(runtimeAudio);
const runtimeDuration = Number(runtimeInfo?.format?.duration || 0);
if (!runtimeInfo?.streams?.length || runtimeInfo.streams[0]?.codec_name !== 'pcm_s16le') fail('runtime audio is not PCM s16le WAV.');
if (!Number.isFinite(runtimeDuration) || runtimeDuration <= 0) fail('runtime WAV has invalid duration.');

let removedSeconds = Math.max(0, sourceDuration - runtimeDuration);
let reductionRatio = removedSeconds / sourceDuration;

if (pauseCompressionEnabled) {
  if (runtimeDuration > sourceDuration + 0.12) fail('pause-compressed runtime audio unexpectedly became longer than its source.');
  if (reductionRatio > maxReductionRatio) {
    fail(`pause compression removed ${(reductionRatio * 100).toFixed(1)}% of the audio; safety max is ${(maxReductionRatio * 100).toFixed(1)}%.`);
  }

  const silenceCheck = spawnSync('ffmpeg', [
    '-hide_banner','-loglevel','info','-i',runtimeAudio,
    '-af',`silencedetect=noise=${thresholdDb}dB:d=${maxAllowedSilenceSeconds}`,
    '-f','null','-',
  ], {encoding:'utf8'});
  if (silenceCheck.error) fail(`silence validation could not start: ${silenceCheck.error.message}`);
  if (silenceCheck.status !== 0) fail(`silence validation failed: ${silenceCheck.stderr || silenceCheck.stdout}`);
  const longSilences = [...String(silenceCheck.stderr || '').matchAll(/silence_duration:\s*([0-9.]+)/g)]
    .map((match) => Number(match[1]))
    .filter((duration) => Number.isFinite(duration) && duration > maxAllowedSilenceSeconds + 0.03);
  if (longSilences.length) {
    fail(`runtime WAV still contains ${longSilences.length} silence gap(s) longer than ${maxAllowedSilenceSeconds.toFixed(2)}s; longest ${Math.max(...longSilences).toFixed(3)}s.`);
  }
} else if (Math.abs(runtimeDuration - sourceDuration) > 0.12) {
  fail(`runtime audio duration differs too much from source (${runtimeDuration.toFixed(3)}s vs ${sourceDuration.toFixed(3)}s).`);
}

const report = {
  version: 1,
  status: 'RUNTIME_AUDIO_PREPARED',
  compositionId,
  pauseCompression: {
    enabled: pauseCompressionEnabled,
    thresholdDb,
    triggerSeconds,
    keepSeconds,
    startKeepSeconds,
    maxAllowedSilenceSeconds,
    maxReductionRatio,
  },
  sourceDurationSeconds: Number(sourceDuration.toFixed(6)),
  runtimeDurationSeconds: Number(runtimeDuration.toFixed(6)),
  removedSeconds: Number(removedSeconds.toFixed(6)),
  reductionRatio: Number(reductionRatio.toFixed(6)),
  generatedAt: new Date().toISOString(),
};
await writeFile(pacingReport, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log('REEL AUDIO PREP PASSED');
console.log(`compositionId: ${compositionId}`);
console.log(`source: ${sourceAudio}`);
console.log(`source container duration: ${sourceDuration.toFixed(3)} s`);
console.log(`pause compression: ${pauseCompressionEnabled ? 'ENABLED' : 'DISABLED'}`);
if (pauseCompressionEnabled) {
  console.log(`pause policy: trigger >= ${triggerSeconds.toFixed(2)} s → keep about ${keepSeconds.toFixed(2)} s`);
  console.log(`removed silence: ${removedSeconds.toFixed(3)} s (${(reductionRatio * 100).toFixed(1)}%)`);
}
console.log(`runtime timing duration: ${runtimeDuration.toFixed(3)} s`);
console.log(`runtime: ${runtimeAudio}`);
console.log(`pacing report: ${pacingReport}`);
console.log(`forced-alignment timing src: /runtime-audio/${compositionId}.wav`);
