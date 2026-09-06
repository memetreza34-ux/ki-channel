#!/usr/bin/env node
import {existsSync, statSync} from 'node:fs';
import {mkdir, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const [rawInput, rawReport] = process.argv.slice(2);
if (!rawInput) {
  console.error('Usage: node scripts/check-ki-longform-master.mjs <master.mp4>');
  process.exit(1);
}
const input = path.resolve(rawInput);
const reportPath = rawReport ? path.resolve(rawReport) : null;
const metrics = {freezeSegments: []};
const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
if (!existsSync(input) || !statSync(input).isFile()) {
  console.error(`LONGFORM MASTER FAILED: file missing: ${input}`);
  process.exit(1);
}

const run = (cmd, args, {allowFailure=false}={}) => {
  const result = spawnSync(cmd, args, {encoding:'utf8', maxBuffer:64*1024*1024});
  if (result.error) throw result.error;
  if (!allowFailure && result.status !== 0) throw new Error(`${cmd} failed: ${result.stderr || result.stdout}`);
  return `${result.stdout || ''}\n${result.stderr || ''}`;
};

const probeRaw = run('ffprobe', [
  '-v','error',
  '-show_entries','format=duration,bit_rate,size:stream=index,codec_type,codec_name,width,height,pix_fmt,avg_frame_rate,r_frame_rate,bit_rate,sample_rate,channels,duration',
  '-of','json', input,
]);
let probe;
try { probe = JSON.parse(probeRaw.trim()); }
catch (error) { throw new Error(`invalid ffprobe JSON: ${error.message}`); }
const video = (probe.streams || []).find((s)=>s.codec_type==='video');
const audio = (probe.streams || []).find((s)=>s.codec_type==='audio');
if (!video) fail('video stream missing.');
if (!audio) fail('audio stream missing.');
const duration = Number(probe?.format?.duration);
if (!Number.isFinite(duration) || duration <= 0) fail('container duration missing/invalid.');
if (video) {
  if (video.codec_name !== 'h264') fail(`video codec must be h264, got ${video.codec_name}.`);
  if (Number(video.width) !== 1920 || Number(video.height) !== 1080) fail(`video must be 1920x1080, got ${video.width}x${video.height}.`);
  if (video.pix_fmt && video.pix_fmt !== 'yuv420p') fail(`pixel format must be yuv420p, got ${video.pix_fmt}.`);
  const parseRate = (value) => {
    const [a,b] = String(value || '').split('/').map(Number);
    return Number.isFinite(a) && Number.isFinite(b) && b !== 0 ? a/b : NaN;
  };
  const fps = parseRate(video.avg_frame_rate || video.r_frame_rate);
  if (!Number.isFinite(fps) || Math.abs(fps-30) > 0.01) fail(`video must be 30fps, got ${fps}.`);
  const vBitrate = Number(video.bit_rate);
  metrics.videoBitrate = Number.isFinite(vBitrate) ? vBitrate : null;
  if (Number.isFinite(vBitrate)) {
    if (vBitrate < 500_000) fail(`video bitrate ${Math.round(vBitrate/1000)} kbit/s is implausibly low for 1080p production master.`);
    else if (vBitrate < 1_000_000) warn(`video bitrate ${Math.round(vBitrate/1000)} kbit/s is low; visually inspect compression.`);
  } else warn('video stream bitrate unavailable; CRF/render report must be reviewed.');
}
if (audio) {
  if (audio.codec_name !== 'aac') fail(`audio codec must be aac, got ${audio.codec_name}.`);
  if (Number(audio.sample_rate) !== 48000) fail(`audio sample rate must be 48000Hz, got ${audio.sample_rate}.`);
  if (Number(audio.channels) !== 2) fail(`audio must be stereo, got ${audio.channels} channels.`);
}
const videoDuration = Number(video?.duration);
const audioDuration = Number(audio?.duration);
if (Number.isFinite(videoDuration) && Number.isFinite(audioDuration) && Math.abs(videoDuration-audioDuration) > 0.75) {
  fail(`audio/video stream durations differ by ${Math.abs(videoDuration-audioDuration).toFixed(2)}s (${videoDuration.toFixed(2)} vs ${audioDuration.toFixed(2)}).`);
}

const silenceText = run('ffmpeg', [
  '-hide_banner','-nostats','-i',input,
  '-map','0:a:0',
  '-af','silencedetect=noise=-45dB:d=1.0',
  '-f','null','-'
], {allowFailure:true});
const silenceStarts = [...silenceText.matchAll(/silence_start:\s*([0-9.]+)/g)].map((m)=>Number(m[1]));
const silenceEnds = [...silenceText.matchAll(/silence_end:\s*([0-9.]+)/g)].map((m)=>Number(m[1]));
let trailingSilence = 0;
if (Number.isFinite(duration) && silenceStarts.length) {
  for (let i=0;i<silenceStarts.length;i++) {
    const start = silenceStarts[i];
    const end = silenceEnds[i] ?? duration;
    if (duration - end <= 0.35 || end >= duration - 0.35) trailingSilence = Math.max(trailingSilence, duration-start);
  }
}
metrics.trailingSilenceSeconds = Number(trailingSilence.toFixed(3));
if (trailingSilence > 2.0) fail(`trailing silence is ${trailingSilence.toFixed(2)}s; maximum allowed is 2.0s.`);
else if (trailingSilence > 0.8) warn(`trailing silence is ${trailingSilence.toFixed(2)}s.`);

const freezeText = run('ffmpeg', [
  '-hide_banner','-nostats','-i',input,
  '-map','0:v:0',
  '-vf','freezedetect=noise=0.002:d=8',
  '-an','-f','null','-'
], {allowFailure:true});
const freezeStarts = [...freezeText.matchAll(/freeze_start:\s*([0-9.]+)/g)].map((m)=>Number(m[1]));
const freezeEnds = [...freezeText.matchAll(/freeze_end:\s*([0-9.]+)/g)].map((m)=>Number(m[1]));
const freezeDurations = [...freezeText.matchAll(/freeze_duration:\s*([0-9.]+)/g)].map((m)=>Number(m[1]));
for (let i=0;i<freezeStarts.length;i++) {
  const start = freezeStarts[i];
  const end = freezeEnds[i] ?? (Number.isFinite(duration) ? duration : NaN);
  const dur = freezeDurations[i] ?? (Number.isFinite(end) ? end-start : NaN);
  if (!Number.isFinite(dur)) continue;
  metrics.freezeSegments.push({startSeconds:Number(start.toFixed(3)), endSeconds:Number.isFinite(end)?Number(end.toFixed(3)):null, durationSeconds:Number(dur.toFixed(3))});
  if (dur >= 15) fail(`visual freeze/static segment ${start.toFixed(2)}s–${Number.isFinite(end)?end.toFixed(2):'?'}s lasts ${dur.toFixed(2)}s.`);
  else if (dur >= 8) warn(`long static segment ${start.toFixed(2)}s lasts ${dur.toFixed(2)}s.`);
}

const loudText = run('ffmpeg', [
  '-hide_banner','-nostats','-i',input,
  '-map','0:a:0',
  '-af','loudnorm=I=-16:TP=-1.5:LRA=7:print_format=json',
  '-f','null','-'
], {allowFailure:true});
const loudMatches = [...loudText.matchAll(/\{[\s\S]*?"input_i"[\s\S]*?\}/g)];
if (!loudMatches.length) fail('could not measure loudness with loudnorm.');
else {
  try {
    const loud = JSON.parse(loudMatches[loudMatches.length-1][0]);
    const i = Number(loud.input_i);
    const tp = Number(loud.input_tp);
    const lra = Number(loud.input_lra);
    metrics.integratedLufs = i; metrics.truePeakDbtp = tp; metrics.lra = lra;
    if (!Number.isFinite(i) || i < -16.8 || i > -15.2) fail(`integrated loudness ${i} LUFS is outside -16 ±0.8.`);
    if (!Number.isFinite(tp) || tp > -1.0) fail(`true peak ${tp} dBTP is too high; must be <= -1.0 dBTP.`);
    if (Number.isFinite(lra) && lra > 12) fail(`loudness range ${lra} LU is too wide.`);
  } catch (error) { fail(`invalid loudnorm JSON: ${error.message}`); }
}

metrics.durationSeconds = Number.isFinite(duration) ? Number(duration.toFixed(3)) : null;
metrics.status = errors.length ? 'FAILED' : 'PASSED';
metrics.errors = errors; metrics.warnings = warnings; metrics.file = input; metrics.generatedAt = new Date().toISOString();
if (reportPath) { await mkdir(path.dirname(reportPath), {recursive:true}); await writeFile(reportPath, `${JSON.stringify(metrics,null,2)}\n`, 'utf8'); }
for (const message of warnings) console.warn(`LONGFORM MASTER WARNING: ${message}`);
if (errors.length) {
  console.error(`LONGFORM MASTER FAILED (${errors.length}):`);
  for (const message of errors) console.error(`- ${message}`);
  process.exit(1);
}
console.log('LONGFORM MASTER: PASSED');
console.log(`file: ${input}`);
console.log(`duration: ${duration.toFixed(3)}s`);
