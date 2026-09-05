#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';

const input = process.argv[2];
if (!input) {
  console.error('Usage: node ki/scripts/validate-final-video.mjs <final-video.mp4>');
  process.exit(1);
}

const file = path.resolve(input);
if (!existsSync(file)) {
  console.error(`Final video not found: ${file}`);
  process.exit(1);
}

const run = (command, args) => {
  const result = spawnSync(command, args, {encoding: 'utf8', maxBuffer: 32 * 1024 * 1024});
  if (result.error) {
    console.error(`${command} could not be started: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`${command} failed:\n${result.stderr || result.stdout}`);
    process.exit(result.status || 1);
  }
  return `${result.stdout || ''}\n${result.stderr || ''}`;
};

const probeRaw = run('ffprobe', [
  '-v', 'error',
  '-show_streams',
  '-show_format',
  '-of', 'json',
  file,
]);
let probe;
try {
  probe = JSON.parse(probeRaw.trim());
} catch {
  console.error('Could not parse ffprobe output.');
  process.exit(1);
}

const video = probe.streams?.find((stream) => stream.codec_type === 'video');
const audio = probe.streams?.find((stream) => stream.codec_type === 'audio');
if (!video) {
  console.error('FINAL GATE FAILED: no video stream found.');
  process.exit(1);
}
if (!audio) {
  console.error('FINAL GATE FAILED: no audio stream found. Do not hand this video to the user.');
  process.exit(1);
}

const duration = Number(probe.format?.duration || 0);
if (!Number.isFinite(duration) || duration <= 0) {
  console.error('FINAL GATE FAILED: invalid container duration.');
  process.exit(1);
}

const parseFps = (value) => {
  const raw = String(value || '');
  const [numerator, denominator] = raw.split('/').map(Number);
  if (Number.isFinite(numerator) && Number.isFinite(denominator) && denominator !== 0) {
    return numerator / denominator;
  }
  const direct = Number(raw);
  return Number.isFinite(direct) ? direct : NaN;
};

const fps = parseFps(video.avg_frame_rate || video.r_frame_rate);
const issues = [];
if (video.codec_name !== 'h264') issues.push(`video codec must be H.264, got ${video.codec_name || 'unknown'}`);
if (Number(video.width) !== 1080 || Number(video.height) !== 1920) {
  issues.push(`video dimensions must be 1080x1920, got ${video.width || '?'}x${video.height || '?'}`);
}
if (!Number.isFinite(fps) || Math.abs(fps - 30) > 0.01) {
  issues.push(`video FPS must be 30, got ${Number.isFinite(fps) ? fps.toFixed(3) : 'unknown'}`);
}
if (video.pix_fmt && video.pix_fmt !== 'yuv420p') {
  issues.push(`video pixel format must be yuv420p for broad social-platform compatibility, got ${video.pix_fmt}`);
}
if (audio.codec_name !== 'aac') issues.push(`audio codec must be AAC, got ${audio.codec_name || 'unknown'}`);
if (Number(audio.sample_rate) !== 48000) {
  issues.push(`audio sample rate must be 48000 Hz, got ${audio.sample_rate || 'unknown'}`);
}
if (Number(audio.channels) !== 2) {
  issues.push(`audio must be stereo (2 channels), got ${audio.channels || 'unknown'}`);
}
if (issues.length) {
  console.error('FINAL GATE FAILED: social delivery profile mismatch.');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

const volumeRaw = run('ffmpeg', [
  '-hide_banner', '-nostats', '-i', file,
  '-map', '0:a:0',
  '-af', 'volumedetect',
  '-f', 'null', '-',
]);
const meanMatch = volumeRaw.match(/mean_volume:\s*(-?inf|[-+]?\d+(?:\.\d+)?)\s*dB/i);
const maxMatch = volumeRaw.match(/max_volume:\s*(-?inf|[-+]?\d+(?:\.\d+)?)\s*dB/i);
if (!meanMatch || !maxMatch) {
  console.error('FINAL GATE FAILED: audio exists, but level could not be verified.');
  process.exit(1);
}
const parseDb = (value) => (value.toLowerCase() === '-inf' ? -Infinity : Number(value));
const meanDb = parseDb(meanMatch[1]);
const maxDb = parseDb(maxMatch[1]);
if (!Number.isFinite(maxDb) || maxDb < -50) {
  console.error(`FINAL GATE FAILED: audio is silent or practically inaudible (max ${maxMatch[1]} dB).`);
  process.exit(1);
}
if (!Number.isFinite(meanDb) || meanDb < -60) {
  console.error(`FINAL GATE FAILED: average audio level is practically inaudible (mean ${meanMatch[1]} dB).`);
  process.exit(1);
}

const videoBitrate = Number(video.bit_rate || 0);
console.log('FINAL VIDEO GATE PASSED');
console.log(`file: ${file}`);
console.log(`duration: ${duration.toFixed(3)} s`);
console.log(`video: H.264 1080x1920 @ ${fps.toFixed(2)} fps / ${video.pix_fmt || 'pixel-format-unknown'}`);
console.log(`video bitrate: ${videoBitrate > 0 ? `${Math.round(videoBitrate / 1000)} kbps (informational; CRF is the quality authority)` : 'not reported'}`);
console.log(`audio: AAC ${audio.sample_rate} Hz stereo`);
console.log(`mean volume: ${meanDb.toFixed(1)} dB`);
console.log(`max volume: ${maxDb.toFixed(1)} dB`);
console.log('NOTE: LUFS/true-peak compliance is enforced separately by validate-social-audio-master.mjs.');
