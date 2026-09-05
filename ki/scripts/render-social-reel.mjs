#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const [rawReelDir, rawOutput] = process.argv.slice(2);
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/render-social-reel.mjs <reel-package-dir> [review-master.mp4]');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const reelPath = path.join(reelDir, '06-projektdateien', 'reel.json');
const fail = (message) => {
  console.error(`SOCIAL REEL RENDER FAILED: ${message}`);
  process.exit(1);
};

if (!existsSync(reelPath)) fail(`reel.json missing: ${reelPath}`);
let reel;
try {
  reel = JSON.parse(await readFile(reelPath, 'utf8'));
} catch (error) {
  fail(`invalid reel.json: ${error instanceof Error ? error.message : String(error)}`);
}

const compositionId = String(reel?.compositionId || '').trim();
if (!/^[A-Za-z0-9_-]+$/.test(compositionId)) fail('reel.json compositionId missing or unsafe.');
const finalDurationInFrames = Number(reel?.format?.finalDurationInFrames);
if (!Number.isFinite(finalDurationInFrames) || finalDurationInFrames <= 0) {
  fail('finalDurationInFrames is not voice-locked yet. Finish pause compression + forced alignment + scene timing lock before the review render.');
}

const runtimeAudio = path.resolve('public', 'runtime-audio', `${compositionId}.wav`);
if (!existsSync(runtimeAudio)) fail(`runtime voiceover missing: ${runtimeAudio}`);
const entryPoint = path.resolve('ki', 'src', 'index.ts');
if (!existsSync(entryPoint)) fail(`Remotion entry point missing: ${entryPoint}`);

const exportDir = path.join(reelDir, '05-export');
await mkdir(exportDir, {recursive: true});
const output = rawOutput
  ? path.resolve(rawOutput)
  : path.join(exportDir, `${compositionId}-review-master.mp4`);
if (path.extname(output).toLowerCase() !== '.mp4') fail('review master output must be an .mp4 file.');
await mkdir(path.dirname(output), {recursive: true});
const rawRender = path.join(path.dirname(output), `.${path.basename(output, '.mp4')}.raw-${process.pid}.mp4`);
const audioReport = `${output}.audio-master.json`;
const renderReport = `${output}.render-report.json`;

const run = (command, args) => {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    shell: process.platform === 'win32',
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) fail(`${command} could not start: ${result.error.message}`);
  if (result.status !== 0) fail(`${command} ${args.join(' ')} exited with code ${result.status}.`);
  return result.stdout || '';
};

const sha256 = async (file) => createHash('sha256').update(await readFile(file)).digest('hex');
const parseFps = (value) => {
  const text = String(value || '');
  const [a, b] = text.split('/').map(Number);
  if (Number.isFinite(a) && Number.isFinite(b) && b !== 0) return a / b;
  const direct = Number(text);
  return Number.isFinite(direct) ? direct : null;
};

await rm(rawRender, {force: true});
await rm(output, {force: true});
await rm(audioReport, {force: true});
await rm(renderReport, {force: true});

console.log('1/4 Remotion review render: H.264 / CRF 18');
run('npx', [
  '--no-install',
  'remotion',
  'render',
  entryPoint,
  compositionId,
  rawRender,
  '--codec=h264',
  '--crf=18',
  '--audio-codec=aac',
  '--overwrite',
]);
if (!existsSync(rawRender)) fail('Remotion raw render was not created.');

console.log('2/4 Social audio master: -16 LUFS / -1.5 dBTP');
run(process.execPath, [
  path.resolve('ki', 'scripts', 'master-reel-video.mjs'),
  rawRender,
  output,
  audioReport,
]);
if (!existsSync(output)) fail('social review master was not created.');

console.log('3/4 Audio + container verification');
run(process.execPath, [path.resolve('ki', 'scripts', 'validate-social-audio-master.mjs'), output]);
run(process.execPath, [path.resolve('ki', 'scripts', 'validate-final-video.mjs'), output]);

const probeResult = spawnSync('ffprobe', [
  '-v', 'error',
  '-show_entries', 'stream=codec_type,codec_name,width,height,r_frame_rate,pix_fmt,bit_rate,sample_rate,channels:format=duration,bit_rate',
  '-of', 'json',
  output,
], {encoding: 'utf8'});
if (probeResult.error || probeResult.status !== 0) fail(`ffprobe failed for review master: ${probeResult.stderr || probeResult.error?.message}`);
let probe;
try {
  probe = JSON.parse(probeResult.stdout);
} catch (error) {
  fail(`invalid ffprobe JSON: ${error instanceof Error ? error.message : String(error)}`);
}
const video = probe.streams?.find((stream) => stream.codec_type === 'video');
const audio = probe.streams?.find((stream) => stream.codec_type === 'audio');
if (!video || !audio) fail('review master is missing video or audio stream.');

const outputSha256 = await sha256(output);
const audioMaster = JSON.parse(await readFile(audioReport, 'utf8'));
const report = {
  status: 'SOCIAL_REVIEW_MASTER_READY',
  compositionId,
  reelPackage: path.relative(process.cwd(), reelDir),
  render: {
    entryPoint: path.relative(process.cwd(), entryPoint),
    codec: 'h264',
    crf: 18,
    audioCodecAtRender: 'aac',
    finalDurationInFrames,
    width: Number(video.width),
    height: Number(video.height),
    fps: parseFps(video.r_frame_rate),
    pixelFormat: video.pix_fmt || null,
    averageVideoBitrate: Number(video.bit_rate || probe.format?.bit_rate || 0) || null,
  },
  socialAudio: {
    targetIntegratedLufs: -16,
    targetTruePeakDbtp: -1.5,
    verifiedIntegratedLufs: audioMaster?.output?.integratedLufs ?? null,
    verifiedTruePeakDbtp: audioMaster?.output?.truePeakDbtp ?? null,
    sampleRate: Number(audio.sample_rate || 0) || null,
    channels: Number(audio.channels || 0) || null,
  },
  output: {
    file: output,
    sha256: outputSha256,
    durationSeconds: Number(probe.format?.duration || 0) || null,
  },
  review: {
    exactOneXVisualAudioReviewRequired: true,
    finalExportAllowedBeforeReview: false,
    instruction: 'Review this exact mastered MP4 at 1x. Any source change requires a new render and a new review hash.',
  },
  generatedAt: new Date().toISOString(),
};
await writeFile(renderReport, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
await rm(rawRender, {force: true});

console.log('4/4 SOCIAL REVIEW MASTER READY');
console.log(`review master: ${output}`);
console.log(`sha256: ${outputSha256}`);
console.log(`render report: ${renderReport}`);
console.log('IMPORTANT: This is a review candidate, not a final export. Review this exact mastered file at 1x before finalization.');
