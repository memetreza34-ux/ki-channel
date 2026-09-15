#!/usr/bin/env node
import {existsSync, statSync} from 'node:fs';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import {
  getGitState,
  renderContractSha256,
  renderLockPath,
  resolveSourceDir,
  safeCompositionId,
  sha256Directory,
  sha256File,
} from '../ki/scripts/lib/render-provenance.mjs';
import {resolveGeneratedMediaRenderProps} from './lib/generated-media-render-props.mjs';

const [rawReelDir, rawOutput] = process.argv.slice(2);
if (!rawReelDir) {
  console.error('Usage: node scripts/render-production-reel.mjs <reel-package-dir> [output.mp4]');
  process.exit(2);
}

const fail = (message) => {
  console.error(`PRODUCTION REEL RENDER BLOCKED: ${message}`);
  process.exit(1);
};

if (Number(process.versions.node.split('.')[0]) !== 20) {
  fail(`Node 20 required, got ${process.versions.node}.`);
}

const reelDir = path.resolve(rawReelDir);
const reelPath = path.join(reelDir, '06-projektdateien', 'reel.json');
if (!existsSync(reelPath)) fail(`reel.json missing: ${reelPath}`);

let reel;
try {
  reel = JSON.parse(await readFile(reelPath, 'utf8'));
} catch (error) {
  fail(`invalid reel.json: ${error.message}`);
}

const compositionId = safeCompositionId(reel?.compositionId);
if (!compositionId) fail('reel.json compositionId missing.');
const fps = Number(reel?.format?.fps);
const width = Number(reel?.format?.width);
const height = Number(reel?.format?.height);
const finalDurationInFrames = Number(reel?.format?.finalDurationInFrames);
if (![fps, width, height, finalDurationInFrames].every((value) => Number.isFinite(value) && value > 0)) {
  fail('reel format is not production-locked. Run npm run reel:sync -- <reel-package-dir> first.');
}

let git;
try {
  git = getGitState();
} catch (error) {
  fail(error.message);
}
if (git.dirty) fail('working tree is dirty. Commit tracked source/timing/contract changes before rendering.');

const lockPath = renderLockPath(compositionId);
if (!existsSync(lockPath)) {
  fail(`render lock missing: ${lockPath}. Run npm run reel:prepare-render -- <reel-package-dir> first.`);
}
let lock;
try {
  lock = JSON.parse(await readFile(lockPath, 'utf8'));
} catch (error) {
  fail(`invalid render lock: ${error.message}`);
}
if (lock?.status !== 'RENDER_LOCKED') fail('render lock status is not RENDER_LOCKED.');
if (String(lock.gitCommitSha || '') !== git.commitSha) {
  fail(`render lock belongs to commit ${lock.gitCommitSha || '(missing)'}, current HEAD is ${git.commitSha}. Re-run reel:prepare-render.`);
}
if (String(lock.compositionId || '') !== compositionId) fail('render lock compositionId does not match reel.json.');
if (Number(lock.finalDurationInFrames) !== finalDurationInFrames) fail('render lock duration does not match reel.json.');

const currentReelSha = await sha256File(reelPath);
if (lock?.hashes?.reelJsonSha256AtLock !== currentReelSha) fail('reel.json changed after render lock. Re-run reel:prepare-render.');
if (lock?.hashes?.renderContractSha256 !== renderContractSha256(reel)) fail('render contract changed after render lock.');

let sourceDir;
try {
  sourceDir = await resolveSourceDir(reelDir, reel);
} catch (error) {
  fail(`could not resolve sourceDir: ${error.message}`);
}
if (!sourceDir) fail('sourceDir missing.');
const absoluteSourceDir = path.resolve(sourceDir);
if (!existsSync(absoluteSourceDir)) fail(`sourceDir missing: ${absoluteSourceDir}`);
if (lock?.hashes?.sourceTreeSha256 !== await sha256Directory(absoluteSourceDir)) {
  fail('Remotion source tree changed after render lock. Re-run reel:prepare-render.');
}

const bindings = reel?.visuals?.generatedMediaBindings;
const hasGeneratedBindings = bindings && typeof bindings === 'object' && !Array.isArray(bindings) && Object.keys(bindings).length > 0;
let generated;
try {
  generated = await resolveGeneratedMediaRenderProps({
    reelDir,
    reel,
    requireManifest: Boolean(hasGeneratedBindings),
  });
} catch (error) {
  fail(error.message);
}

if (generated.manifestSha256) {
  if (lock?.hashes?.generatedMediaManifestSha256 !== generated.manifestSha256) {
    fail('generated-media manifest is not the one bound by the render lock. Re-run reel:prepare-render.');
  }
  const lockedAssets = new Map((lock.generatedMediaAssets || []).map((asset) => [String(asset.id), asset]));
  for (const asset of generated.assets) {
    const locked = lockedAssets.get(asset.id);
    if (!locked || String(locked.sha256) !== asset.sha256 || String(locked.publicPath) !== asset.publicPath) {
      fail(`generated-media asset ${asset.id} is not identically bound by the render lock.`);
    }
  }
}

const entry = path.resolve('ki', 'src', 'index.ts');
const remotionBin = path.resolve('node_modules', '.bin', process.platform === 'win32' ? 'remotion.cmd' : 'remotion');
if (!existsSync(entry)) fail(`Remotion entry missing: ${entry}`);
if (!existsSync(remotionBin)) fail('local Remotion CLI missing. Run npm install first.');

const slug = String(reel.slug || reel.reelId || compositionId).replace(/[^A-Za-z0-9._-]+/g, '-');
const output = rawOutput
  ? path.resolve(rawOutput)
  : path.join(reelDir, '05-export', `${slug}-raw.mp4`);
await mkdir(path.dirname(output), {recursive: true});

const auditDir = path.resolve('out', 'production-reels', slug);
await mkdir(auditDir, {recursive: true});
const propsAuditPath = path.join(auditDir, 'input-props.json');
await writeFile(propsAuditPath, `${JSON.stringify({
  compositionId,
  gitCommitSha: git.commitSha,
  renderLock: path.relative(process.cwd(), lockPath),
  generatedMediaStatus: generated.status,
  generatedMediaAssets: generated.assets,
  inputProps: generated.props,
}, null, 2)}\n`, 'utf8');

const args = [
  'render',
  entry,
  compositionId,
  output,
  '--codec=h264',
  '--crf=18',
  '--pixel-format=yuv420p',
  '--audio-codec=aac',
  '--overwrite',
  '--concurrency=1',
];
if (Object.keys(generated.props).length > 0) {
  args.push(`--props=${JSON.stringify(generated.props)}`);
}

console.log(`PRODUCTION REEL RENDER: ${compositionId}`);
console.log(`commit: ${git.commitSha}`);
console.log(`generated-media props: ${Object.keys(generated.props).length}`);
console.log(`output: ${path.relative(process.cwd(), output)}`);

const result = process.platform === 'win32'
  ? spawnSync(remotionBin, args, {stdio: 'inherit', env: process.env})
  : spawnSync(process.execPath, [remotionBin, ...args], {stdio: 'inherit', env: process.env});
if (result.error || result.status !== 0) fail(`Remotion render failed${result.error ? `: ${result.error.message}` : ''}.`);
if (!existsSync(output) || statSync(output).size < 1024) fail('render output is missing or implausibly small.');

const probe = spawnSync('ffprobe', [
  '-v', 'error',
  '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height,avg_frame_rate,pix_fmt,sample_rate,channels',
  '-of', 'json',
  output,
], {encoding: 'utf8'});
if (probe.error || probe.status !== 0) fail(`ffprobe failed${probe.error ? `: ${probe.error.message}` : ''}.`);

let metadata;
try {
  metadata = JSON.parse(probe.stdout);
} catch (error) {
  fail(`ffprobe returned invalid JSON: ${error.message}`);
}
const video = metadata.streams?.find((stream) => stream.codec_type === 'video');
const audio = metadata.streams?.find((stream) => stream.codec_type === 'audio');
const duration = Number(metadata.format?.duration || 0);
const expectedDuration = finalDurationInFrames / fps;
if (!video) fail('render has no video stream.');
if (!audio) fail('render has no audio stream.');
if (Number(video.width) !== width || Number(video.height) !== height) {
  fail(`render dimensions ${video.width}x${video.height} do not match ${width}x${height}.`);
}
if (!Number.isFinite(duration) || Math.abs(duration - expectedDuration) > 0.45) {
  fail(`render duration ${duration.toFixed(3)} s does not match locked ${expectedDuration.toFixed(3)} s.`);
}

const resultPath = path.join(auditDir, 'render-result.json');
await writeFile(resultPath, `${JSON.stringify({
  status: 'TECHNICALLY_RENDERED',
  renderedAt: new Date().toISOString(),
  gitCommitSha: git.commitSha,
  compositionId,
  sourceDir,
  output: path.relative(process.cwd(), output).split(path.sep).join('/'),
  bytes: statSync(output).size,
  expected: {width, height, fps, durationSeconds: expectedDuration},
  observed: {durationSeconds: duration, video, audio},
  generatedMedia: {
    status: generated.status,
    manifestSha256: generated.manifestSha256,
    assets: generated.assets,
  },
  renderLock: path.relative(process.cwd(), lockPath).split(path.sep).join('/'),
}, null, 2)}\n`, 'utf8');

console.log(`PRODUCTION REEL RENDER: TECHNICALLY RENDERED — ${path.relative(process.cwd(), output)}`);
console.log(`audit: ${path.relative(process.cwd(), resultPath)}`);
console.log('Next: master audio, validate final video, then review the mastered MP4 at 1x before visual approval.');
