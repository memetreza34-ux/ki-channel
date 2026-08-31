#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync, lstatSync, statSync} from 'node:fs';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const [rawInput, ...rawArgs] = process.argv.slice(2);
if (!rawInput) {
  console.error('Usage: node scripts/prepare-local-video-asset.mjs <local-video> --provenance=<path|USER_PROVIDED> [--start=0] [--duration=6] [--width=1080] [--height=1920] [--fps=30] [--fit=cover|contain] [--audio=remove|keep] [--crf=20] [--allow-upscale]');
  process.exit(1);
}

const fail = (message) => {
  console.error(`VIDEO ASSET PREP FAILED: ${message}`);
  process.exit(1);
};
const parseArgs = (args) => {
  const out = {};
  for (const arg of args) {
    if (arg === '--allow-upscale') { out.allowUpscale = true; continue; }
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (!match) fail(`unsupported argument: ${arg}`);
    out[match[1]] = match[2];
  }
  return out;
};
const args = parseArgs(rawArgs);
const input = path.resolve(rawInput);
if (/^https?:\/\//i.test(rawInput)) fail('remote URLs are forbidden; input must already be local.');
if (!existsSync(input)) fail(`input missing: ${input}`);
if (lstatSync(input).isSymbolicLink()) fail('symlink inputs are forbidden.');
if (!statSync(input).isFile()) fail('input must be a regular file.');

const allowedExt = new Set(['.mp4','.mov','.m4v','.webm','.mkv']);
const ext = path.extname(input).toLowerCase();
if (!allowedExt.has(ext)) fail(`unsupported input extension ${ext}; allowed: ${[...allowedExt].join(', ')}`);
const sourceStat = statSync(input);
const MAX_INPUT_BYTES = 750 * 1024 * 1024;
if (sourceStat.size <= 0 || sourceStat.size > MAX_INPUT_BYTES) fail('input must be >0 and <=750 MB.');

const provenanceRaw = String(args.provenance || '').trim();
if (!provenanceRaw) fail('--provenance is required. Use an existing provenance/manifest path or USER_PROVIDED.');
let provenance = {type:'USER_PROVIDED', value:'USER_PROVIDED'};
if (provenanceRaw !== 'USER_PROVIDED') {
  const provenancePath = path.resolve(provenanceRaw);
  if (!existsSync(provenancePath) || !statSync(provenancePath).isFile()) fail(`provenance file missing: ${provenancePath}`);
  provenance = {type:'FILE', value:path.relative(process.cwd(), provenancePath).split(path.sep).join('/')};
}

const runCapture = (command, commandArgs) => {
  const result = spawnSync(command, commandArgs, {encoding:'utf8', maxBuffer:16 * 1024 * 1024});
  if (result.error) fail(`${command} could not start: ${result.error.message}`);
  if (result.status !== 0) fail(`${command} failed: ${result.stderr || result.stdout}`);
  return result.stdout;
};
const probeRaw = runCapture('ffprobe', [
  '-v','error',
  '-show_entries','format=duration,size:stream=index,codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate:stream_tags=rotate:stream_side_data=rotation',
  '-of','json',
  input,
]);
let probe;
try { probe = JSON.parse(probeRaw); } catch (error) { fail(`ffprobe JSON invalid: ${error.message}`); }
const videoStream = (probe.streams || []).find((stream) => stream.codec_type === 'video');
if (!videoStream) fail('no video stream found.');
const sourceDuration = Number(probe?.format?.duration);
if (!Number.isFinite(sourceDuration) || sourceDuration <= 0) fail('video duration missing/invalid.');
const rawWidth = Number(videoStream.width);
const rawHeight = Number(videoStream.height);
if (!Number.isFinite(rawWidth) || !Number.isFinite(rawHeight) || rawWidth < 2 || rawHeight < 2) fail('video dimensions missing/invalid.');
const rotation = Number(videoStream?.tags?.rotate ?? videoStream?.side_data_list?.find?.((item)=>Number.isFinite(Number(item?.rotation)))?.rotation ?? 0);
const rotated = Math.abs(rotation) % 180 === 90;
const sourceWidth = rotated ? rawHeight : rawWidth;
const sourceHeight = rotated ? rawWidth : rawHeight;

const width = Number(args.width ?? 1080);
const height = Number(args.height ?? 1920);
const fps = Number(args.fps ?? 30);
const start = Number(args.start ?? 0);
const duration = Number(args.duration ?? Math.min(6, Math.max(0.5, sourceDuration - start)));
const crf = Number(args.crf ?? 20);
const fit = String(args.fit ?? 'cover');
const audio = String(args.audio ?? 'remove');
const allowUpscale = args.allowUpscale === true;
if (!Number.isInteger(width) || width < 320 || width > 2160) fail('--width must be an integer 320..2160.');
if (!Number.isInteger(height) || height < 320 || height > 3840) fail('--height must be an integer 320..3840.');
if (!Number.isFinite(fps) || fps < 12 || fps > 60) fail('--fps must be 12..60.');
if (!Number.isFinite(start) || start < 0 || start >= sourceDuration) fail('--start is outside source duration.');
if (!Number.isFinite(duration) || duration < 0.5 || duration > 15) fail('--duration must be 0.5..15 seconds.');
if (start + duration > sourceDuration + 0.05) fail('requested start+duration exceeds source duration.');
if (!Number.isFinite(crf) || crf < 16 || crf > 28) fail('--crf must be 16..28.');
if (!['cover','contain'].includes(fit)) fail('--fit must be cover or contain.');
if (!['remove','keep'].includes(audio)) fail('--audio must be remove or keep.');

const scaleFactor = fit === 'cover'
  ? Math.max(width / sourceWidth, height / sourceHeight)
  : Math.min(width / sourceWidth, height / sourceHeight);
if (!allowUpscale && scaleFactor > 1.001) fail(`requested ${width}x${height} would upscale source ${sourceWidth}x${sourceHeight}; use a higher-resolution source or --allow-upscale.`);

const sha256File = async (file) => {
  const data = await readFile(file);
  return createHash('sha256').update(data).digest('hex');
};
const sourceSha256 = await sha256File(input);
const base = path.basename(input, ext).replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/^-+|-+$/g,'') || 'video';
const key = createHash('sha256').update(`${sourceSha256}:${start}:${duration}:${width}:${height}:${fps}:${fit}:${audio}:${crf}`).digest('hex').slice(0,12);
const outDir = path.resolve('out','asset-prep','video',`${base}-${key}`);
await mkdir(outDir, {recursive:true});
const output = path.join(outDir, `${base}-${width}x${height}-${fps}fps.mp4`);
const manifestPath = path.join(outDir, 'manifest.json');
if (path.resolve(output) === input) fail('output may not overwrite source.');

const vf = fit === 'cover'
  ? `scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},fps=${fps}`
  : `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black,fps=${fps}`;
const ffmpegArgs = [
  '-hide_banner','-loglevel','error','-nostdin','-y',
  '-i',input,
  '-ss',String(start),
  '-t',String(duration),
  '-map','0:v:0',
];
if (audio === 'keep') ffmpegArgs.push('-map','0:a:0?');
ffmpegArgs.push(
  '-vf',vf,
  '-c:v','libx264',
  '-preset','medium',
  '-crf',String(crf),
  '-pix_fmt','yuv420p',
  '-movflags','+faststart',
  '-map_metadata','-1',
);
if (audio === 'remove') ffmpegArgs.push('-an');
else ffmpegArgs.push('-c:a','aac','-b:a','160k','-ar','48000');
ffmpegArgs.push(output);
const ffmpeg = spawnSync('ffmpeg', ffmpegArgs, {encoding:'utf8', stdio:['ignore','pipe','pipe']});
if (ffmpeg.error) fail(`ffmpeg could not start: ${ffmpeg.error.message}`);
if (ffmpeg.status !== 0) fail(`ffmpeg failed: ${ffmpeg.stderr || ffmpeg.stdout}`);
if (!existsSync(output) || statSync(output).size < 1024) fail('prepared output missing or unexpectedly small.');

const outputProbeRaw = runCapture('ffprobe', [
  '-v','error','-show_entries','format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate','-of','json',output,
]);
let outputProbe;
try { outputProbe = JSON.parse(outputProbeRaw); } catch (error) { fail(`output ffprobe JSON invalid: ${error.message}`); }
const outputVideo = (outputProbe.streams || []).find((stream)=>stream.codec_type === 'video');
if (Number(outputVideo?.width) !== width || Number(outputVideo?.height) !== height) fail('prepared output dimensions do not match target.');
const outputDuration = Number(outputProbe?.format?.duration);
if (!Number.isFinite(outputDuration) || Math.abs(outputDuration-duration) > 0.25) fail('prepared output duration differs unexpectedly from requested duration.');
const outputSha256 = await sha256File(output);

const manifest = {
  version: 1,
  status: 'PREPARED_NOT_PRODUCTION_APPROVED',
  source: {
    file: path.relative(process.cwd(), input).split(path.sep).join('/'),
    sha256: sourceSha256,
    bytes: sourceStat.size,
    codec: videoStream.codec_name || null,
    width: sourceWidth,
    height: sourceHeight,
    durationSeconds: sourceDuration,
    provenance,
  },
  operation: {
    startSeconds: start,
    durationSeconds: duration,
    targetWidth: width,
    targetHeight: height,
    targetFps: fps,
    fit,
    audio,
    crf,
    allowUpscale,
    metadataStripped: true,
  },
  output: {
    file: path.relative(process.cwd(), output).split(path.sep).join('/'),
    sha256: outputSha256,
    bytes: statSync(output).size,
    width,
    height,
    durationSeconds: outputDuration,
    codec: outputVideo?.codec_name || null,
  },
  safety: {
    sourceOverwritten: false,
    remoteInputAllowed: false,
    outputRoot: 'out/asset-prep/video',
    productionManifestModified: false,
    humanVisualReviewRequired: true,
    humanTimingReviewRequired: true,
    productionApprovalSeparate: true,
  },
};
await writeFile(manifestPath, `${JSON.stringify(manifest,null,2)}\n`, 'utf8');

console.log('VIDEO ASSET PREP: PASSED');
console.log(`status: ${manifest.status}`);
console.log(`source: ${manifest.source.file}`);
console.log(`output: ${manifest.output.file}`);
console.log(`duration: ${outputDuration.toFixed(3)} s`);
console.log(`sha256: ${outputSha256}`);
console.log(`manifest: ${path.relative(process.cwd(), manifestPath).split(path.sep).join('/')}`);
console.log('Production approval remains separate: review the exact clip visually/timing-wise, then bind it through the reel visual provenance path.');
