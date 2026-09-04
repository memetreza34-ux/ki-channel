#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {mkdir, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const [rawInput, rawOutput, rawReport] = process.argv.slice(2);
if (!rawInput || !rawOutput) {
  console.error('Usage: node ki/scripts/master-reel-video.mjs <rendered-input.mp4> <mastered-output.mp4> [report.json]');
  process.exit(1);
}

const input = path.resolve(rawInput);
const output = path.resolve(rawOutput);
const report = rawReport ? path.resolve(rawReport) : `${output}.audio-master.json`;
const fail = (message) => { console.error(`SOCIAL AUDIO MASTER FAILED: ${message}`); process.exit(1); };
if (!existsSync(input)) fail(`input video missing: ${input}`);
if (input === output) fail('input and output must be different files.');
await mkdir(path.dirname(output), {recursive: true});
await mkdir(path.dirname(report), {recursive: true});

const run = (command, args) => {
  const result = spawnSync(command, args, {encoding: 'utf8', maxBuffer: 32 * 1024 * 1024});
  if (result.error) fail(`${command} could not start: ${result.error.message}`);
  if (result.status !== 0) fail(`${command} failed:\n${result.stderr || result.stdout}`);
  return `${result.stdout || ''}\n${result.stderr || ''}`;
};

const probe = (file) => {
  const result = spawnSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'stream=index,codec_name,codec_type,sample_rate,channels,duration:format=duration',
    '-of', 'json', file,
  ], {encoding: 'utf8'});
  if (result.error || result.status !== 0) fail(`ffprobe failed for ${file}: ${result.stderr || result.stdout || result.error?.message}`);
  try { return JSON.parse(result.stdout); }
  catch (error) { fail(`invalid ffprobe JSON for ${file}: ${error.message}`); }
};

const parseLoudnorm = (text) => {
  const matches = [...text.matchAll(/\{[\s\S]*?"input_i"[\s\S]*?\}/g)];
  if (!matches.length) fail('could not parse loudnorm JSON.');
  try { return JSON.parse(matches[matches.length - 1][0]); }
  catch (error) { fail(`invalid loudnorm JSON: ${error.message}`); }
};
const numeric = (value, label) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) fail(`invalid loudnorm value ${label}: ${value}`);
  return parsed;
};

const targetI = -16;
const targetTP = -1.5;
const targetLRA = 7;

const beforeProbe = probe(input);
const beforeVideo = beforeProbe.streams?.find((stream) => stream.codec_type === 'video');
const beforeAudio = beforeProbe.streams?.find((stream) => stream.codec_type === 'audio');
if (!beforeVideo) fail('input has no video stream.');
if (!beforeAudio) fail('input has no audio stream.');

const firstPass = run('ffmpeg', [
  '-hide_banner', '-nostats', '-i', input,
  '-map', '0:a:0',
  '-af', `loudnorm=I=${targetI}:TP=${targetTP}:LRA=${targetLRA}:print_format=json`,
  '-f', 'null', '-',
]);
const measured = parseLoudnorm(firstPass);
const inputI = numeric(measured.input_i, 'input_i');
const inputTP = numeric(measured.input_tp, 'input_tp');
const inputLRA = numeric(measured.input_lra, 'input_lra');
const inputThresh = numeric(measured.input_thresh, 'input_thresh');
const offset = numeric(measured.target_offset, 'target_offset');

const filter = [
  `loudnorm=I=${targetI}`,
  `TP=${targetTP}`,
  `LRA=${targetLRA}`,
  `measured_I=${inputI}`,
  `measured_TP=${inputTP}`,
  `measured_LRA=${inputLRA}`,
  `measured_thresh=${inputThresh}`,
  `offset=${offset}`,
  'linear=true',
  'print_format=summary',
].join(':');

run('ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-i', input,
  '-map', '0:v:0', '-map', '0:a:0',
  '-map_metadata', '0',
  '-c:v', 'copy',
  '-af', filter,
  '-ar', '48000', '-ac', '2',
  '-c:a', 'aac', '-b:a', '256k',
  '-movflags', '+faststart',
  output,
]);

if (!existsSync(output)) fail('mastered output was not created.');
const afterProbe = probe(output);
const afterVideo = afterProbe.streams?.find((stream) => stream.codec_type === 'video');
const afterAudio = afterProbe.streams?.find((stream) => stream.codec_type === 'audio');
if (!afterVideo || !afterAudio) fail('mastered output lost video or audio stream.');
if (afterVideo.codec_name !== beforeVideo.codec_name) fail(`video codec changed from ${beforeVideo.codec_name} to ${afterVideo.codec_name}; video must be stream-copied.`);
if (afterAudio.codec_name !== 'aac') fail(`mastered audio codec must be AAC, got ${afterAudio.codec_name}.`);
if (Number(afterAudio.sample_rate) !== 48000) fail(`mastered audio sample rate must be 48000 Hz, got ${afterAudio.sample_rate}.`);
if (Number(afterAudio.channels) !== 2) fail(`mastered audio must be stereo, got ${afterAudio.channels} channels.`);

const beforeDuration = Number(beforeProbe?.format?.duration);
const afterDuration = Number(afterProbe?.format?.duration);
if (!Number.isFinite(beforeDuration) || !Number.isFinite(afterDuration)) fail('container duration missing before/after mastering.');
if (Math.abs(afterDuration - beforeDuration) > 0.15) fail(`mastering changed duration too much: ${beforeDuration.toFixed(3)}s -> ${afterDuration.toFixed(3)}s.`);

const verificationText = run('ffmpeg', [
  '-hide_banner', '-nostats', '-i', output,
  '-map', '0:a:0',
  '-af', `loudnorm=I=${targetI}:TP=${targetTP}:LRA=${targetLRA}:print_format=json`,
  '-f', 'null', '-',
]);
const verified = parseLoudnorm(verificationText);
const outputI = numeric(verified.input_i, 'verified input_i');
const outputTP = numeric(verified.input_tp, 'verified input_tp');
const outputLRA = numeric(verified.input_lra, 'verified input_lra');
if (outputI < -16.7 || outputI > -15.3) fail(`mastered loudness ${outputI.toFixed(2)} LUFS is outside -16 ±0.7 LU.`);
if (outputTP > -1.0) fail(`mastered true peak ${outputTP.toFixed(2)} dBTP is too high.`);
if (outputLRA > 12) fail(`mastered loudness range ${outputLRA.toFixed(2)} LU is too wide.`);

const payload = {
  status: 'SOCIAL_AUDIO_MASTER_PASSED',
  target: {integratedLufs: targetI, truePeakDbtp: targetTP, lra: targetLRA},
  input: {
    file: input,
    integratedLufs: inputI,
    truePeakDbtp: inputTP,
    lra: inputLRA,
    durationSeconds: Number(beforeDuration.toFixed(6)),
    videoCodec: beforeVideo.codec_name,
    audioCodec: beforeAudio.codec_name,
  },
  output: {
    file: output,
    integratedLufs: outputI,
    truePeakDbtp: outputTP,
    lra: outputLRA,
    durationSeconds: Number(afterDuration.toFixed(6)),
    videoCodec: afterVideo.codec_name,
    audioCodec: afterAudio.codec_name,
    sampleRate: Number(afterAudio.sample_rate),
    channels: Number(afterAudio.channels),
  },
  videoHandling: 'STREAM_COPY_NO_VIDEO_REENCODE',
  audioHandling: 'AAC_256K_48KHZ_STEREO_TWO_PASS_LOUDNORM',
  generatedAt: new Date().toISOString(),
};
await writeFile(report, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log('SOCIAL AUDIO MASTER PASSED');
console.log(`input: ${input}`);
console.log(`output: ${output}`);
console.log(`before: ${inputI.toFixed(2)} LUFS / ${inputTP.toFixed(2)} dBTP`);
console.log(`after: ${outputI.toFixed(2)} LUFS / ${outputTP.toFixed(2)} dBTP / LRA ${outputLRA.toFixed(2)} LU`);
console.log('video stream: copied without re-encoding');
console.log('audio: AAC 256k / 48 kHz stereo');
console.log(`report: ${report}`);
