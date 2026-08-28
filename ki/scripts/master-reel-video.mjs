#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const [rawInput, rawOutput] = process.argv.slice(2);
if (!rawInput || !rawOutput) {
  console.error('Usage: node ki/scripts/master-reel-video.mjs <rendered-input.mp4> <mastered-output.mp4>');
  process.exit(1);
}

const input = path.resolve(rawInput);
const output = path.resolve(rawOutput);
const fail = (message) => { console.error(`SOCIAL AUDIO MASTER FAILED: ${message}`); process.exit(1); };
if (!existsSync(input)) fail(`input video missing: ${input}`);
if (input === output) fail('input and output must be different files.');
await mkdir(path.dirname(output), {recursive: true});

const run = (command, args) => {
  const result = spawnSync(command, args, {encoding: 'utf8', maxBuffer: 16 * 1024 * 1024});
  if (result.error) fail(`${command} could not start: ${result.error.message}`);
  if (result.status !== 0) fail(`${command} failed:\n${result.stderr || result.stdout}`);
  return `${result.stdout || ''}\n${result.stderr || ''}`;
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
  '-ar', '48000',
  '-c:a', 'aac', '-b:a', '256k',
  '-movflags', '+faststart',
  output,
]);

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

console.log('SOCIAL AUDIO MASTER PASSED');
console.log(`input: ${input}`);
console.log(`output: ${output}`);
console.log(`before: ${inputI.toFixed(2)} LUFS / ${inputTP.toFixed(2)} dBTP`);
console.log(`after: ${outputI.toFixed(2)} LUFS / ${outputTP.toFixed(2)} dBTP / LRA ${outputLRA.toFixed(2)} LU`);
console.log('video stream: copied without re-encoding');
