#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const rawInput = process.argv[2];
if (!rawInput) {
  console.error('Usage: node ki/scripts/validate-social-audio-master.mjs <video.mp4>');
  process.exit(1);
}
const input = path.resolve(rawInput);
const fail = (message) => { console.error(`SOCIAL AUDIO MASTER GATE FAILED: ${message}`); process.exit(1); };
if (!existsSync(input)) fail(`video missing: ${input}`);

const result = spawnSync('ffmpeg', [
  '-hide_banner', '-nostats', '-i', input,
  '-map', '0:a:0',
  '-af', 'loudnorm=I=-16:TP=-1.5:LRA=7:print_format=json',
  '-f', 'null', '-',
], {encoding: 'utf8', maxBuffer: 16 * 1024 * 1024});
if (result.error) fail(`ffmpeg could not start: ${result.error.message}`);
if (result.status !== 0) fail(`ffmpeg failed: ${result.stderr || result.stdout}`);
const text = `${result.stdout || ''}\n${result.stderr || ''}`;
const matches = [...text.matchAll(/\{[\s\S]*?"input_i"[\s\S]*?\}/g)];
if (!matches.length) fail('loudnorm analysis JSON missing.');
let data;
try { data = JSON.parse(matches[matches.length - 1][0]); }
catch (error) { fail(`invalid loudnorm JSON: ${error.message}`); }
const integrated = Number(data.input_i);
const truePeak = Number(data.input_tp);
const lra = Number(data.input_lra);
if (!Number.isFinite(integrated) || !Number.isFinite(truePeak) || !Number.isFinite(lra)) fail('loudness values are invalid.');
if (integrated < -17.0 || integrated > -15.0) fail(`integrated loudness ${integrated.toFixed(2)} LUFS outside accepted -16 ±1 LU range.`);
if (truePeak > -1.0) fail(`true peak ${truePeak.toFixed(2)} dBTP exceeds -1.0 dBTP ceiling.`);
if (lra > 12) fail(`loudness range ${lra.toFixed(2)} LU is too wide for the reel master.`);

console.log('SOCIAL AUDIO MASTER GATE PASSED');
console.log(`file: ${input}`);
console.log(`integrated: ${integrated.toFixed(2)} LUFS`);
console.log(`true peak: ${truePeak.toFixed(2)} dBTP`);
console.log(`LRA: ${lra.toFixed(2)} LU`);
