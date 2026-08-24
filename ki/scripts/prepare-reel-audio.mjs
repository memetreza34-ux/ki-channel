#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {mkdir, readFile, rm} from 'node:fs/promises';
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

const probe = spawnSync('ffprobe', ['-v','error','-select_streams','a:0','-show_entries','stream=codec_name,sample_rate,channels:format=duration','-of','json',sourceAudio], {encoding:'utf8'});
if (probe.error) fail(`ffprobe could not start: ${probe.error.message}`);
if (probe.status !== 0) fail(`ffprobe failed: ${probe.stderr || probe.stdout}`);
let info;
try { info = JSON.parse(probe.stdout); } catch { fail('ffprobe output could not be parsed.'); }
if (!info?.streams?.length) fail('canonical voiceover has no audio stream.');
const duration = Number(info?.format?.duration || 0);
if (!Number.isFinite(duration) || duration <= 0) fail('canonical voiceover has invalid duration.');

const runtimeDir = path.resolve('public', 'runtime-audio');
await mkdir(runtimeDir, {recursive:true});
const runtimeAudio = path.join(runtimeDir, `${compositionId}.wav`);
await rm(runtimeAudio, {force:true});

// Runtime audio is always uncompressed PCM WAV. This avoids a second lossy MP3 encode
// and avoids MP3 encoder delay shifting word-level caption timing.
const ffmpeg = spawnSync('ffmpeg', [
  '-hide_banner','-loglevel','error','-y','-i',sourceAudio,
  '-vn','-ac','2','-ar','48000','-c:a','pcm_s16le',runtimeAudio,
], {encoding:'utf8'});
if (ffmpeg.error) fail(`ffmpeg could not start: ${ffmpeg.error.message}`);
if (ffmpeg.status !== 0) fail(`runtime audio conversion failed: ${ffmpeg.stderr || ffmpeg.stdout}`);
if (!existsSync(runtimeAudio)) fail('runtime audio was not created.');

const runtimeProbe = spawnSync('ffprobe', ['-v','error','-select_streams','a:0','-show_entries','stream=codec_name,sample_rate,channels:format=duration','-of','json',runtimeAudio], {encoding:'utf8'});
if (runtimeProbe.error || runtimeProbe.status !== 0) fail(`runtime WAV validation failed: ${runtimeProbe.stderr || runtimeProbe.stdout || runtimeProbe.error?.message}`);
let runtimeInfo;
try { runtimeInfo = JSON.parse(runtimeProbe.stdout); } catch { fail('runtime WAV ffprobe output could not be parsed.'); }
const runtimeDuration = Number(runtimeInfo?.format?.duration || 0);
if (!runtimeInfo?.streams?.length || runtimeInfo.streams[0]?.codec_name !== 'pcm_s16le') fail('runtime audio is not PCM s16le WAV.');
if (Math.abs(runtimeDuration - duration) > 0.03) fail(`runtime audio duration drift is too large (${runtimeDuration.toFixed(3)}s vs ${duration.toFixed(3)}s).`);

console.log('REEL AUDIO PREP PASSED');
console.log(`compositionId: ${compositionId}`);
console.log(`source: ${sourceAudio}`);
console.log(`source duration: ${duration.toFixed(3)} s`);
console.log(`runtime duration: ${runtimeDuration.toFixed(3)} s`);
console.log(`runtime: ${runtimeAudio}`);
console.log(`remotion src: /runtime-audio/${compositionId}.wav`);
