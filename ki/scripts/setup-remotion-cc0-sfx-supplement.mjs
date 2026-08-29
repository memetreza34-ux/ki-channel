#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const fail = (message) => {
  console.error(`REMOTION CC0 SFX SUPPLEMENT FAILED: ${message}`);
  process.exit(1);
};

const configPath = path.resolve('ki/config/remotion-sfx-cc0.json');
if (!existsSync(configPath)) fail(`allowlist missing: ${configPath}`);
let config;
try {
  config = JSON.parse(await readFile(configPath, 'utf8'));
} catch (error) {
  fail(`invalid allowlist: ${error.message}`);
}
if (config?.status !== 'REVIEWED_CC0_ALLOWLIST') fail('allowlist status is not REVIEWED_CC0_ALLOWLIST.');
if (config?.policy?.license !== 'CC0-1.0_ONLY') fail('allowlist policy must be CC0-1.0_ONLY.');
const items = Array.isArray(config?.items) ? config.items : [];
if (!items.length) fail('allowlist has no items.');
for (const item of items) {
  if (item?.license !== 'CC0-1.0') fail(`${item?.id || 'unknown'} is not CC0-1.0.`);
  if (!/^https:\/\/remotion\.media\/[a-z0-9-]+\.wav$/i.test(String(item?.url || ''))) fail(`${item?.id || 'unknown'} has non-allowlisted download host/path.`);
  if (!/^https:\/\/www\.remotion\.dev\/docs\/sfx\//i.test(String(item?.docsUrl || ''))) fail(`${item?.id || 'unknown'} has invalid docs URL.`);
}

const blocked = new Set((config.explicitlyBlockedExamples || []).map((item) => item.exportName));
for (const name of ['ding', 'recordScratch']) if (!blocked.has(name)) fail(`blocked example missing: ${name}`);

const runtimeRoot = path.resolve('public', 'reel-sfx', 'remotion-cc0');
const tempRoot = path.resolve('.cache', 'remotion-cc0-sfx');
const indexPath = path.resolve('public', 'reel-sfx', 'remotion-cc0-index.json');
await mkdir(runtimeRoot, {recursive: true});
await mkdir(tempRoot, {recursive: true});

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');
const probeDuration = (file) => {
  const result = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file], {encoding: 'utf8'});
  if (result.error || result.status !== 0) fail(`ffprobe failed for ${file}: ${result.error?.message || result.stderr || 'unknown error'}`);
  const duration = Number(String(result.stdout).trim());
  if (!Number.isFinite(duration) || duration <= 0 || duration > 10) fail(`invalid/unexpected duration for ${file}: ${duration}`);
  return duration;
};

const resolved = [];
for (const item of items) {
  const stem = String(item.exportName).replace(/[^A-Za-z0-9_-]+/g, '-');
  const tempFile = path.join(tempRoot, `${stem}.source.wav`);
  const runtimeFile = path.join(runtimeRoot, `${stem}.wav`);

  const response = await fetch(item.url, {
    headers: {'User-Agent': 'ki-channel-remotion-cc0-sfx-setup/1.0'},
    redirect: 'follow',
  });
  if (!response.ok) fail(`${item.id} download failed: ${response.status} ${response.statusText}`);
  const finalUrl = String(response.url || item.url);
  if (!/^https:\/\/remotion\.media\//i.test(finalUrl)) fail(`${item.id} redirected outside remotion.media: ${finalUrl}`);
  const contentLength = Number(response.headers.get('content-length') || 0);
  if (contentLength > 5_000_000) fail(`${item.id} exceeds 5 MB safety limit.`);
  const sourceBuffer = Buffer.from(await response.arrayBuffer());
  if (!sourceBuffer.length || sourceBuffer.length > 5_000_000) fail(`${item.id} response size invalid: ${sourceBuffer.length}`);
  await writeFile(tempFile, sourceBuffer);

  const ffmpeg = spawnSync('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-i', tempFile,
    '-vn', '-ac', '2', '-ar', '48000', '-c:a', 'pcm_s16le',
    runtimeFile,
  ], {encoding: 'utf8'});
  if (ffmpeg.error || ffmpeg.status !== 0) fail(`${item.id} ffmpeg conversion failed: ${ffmpeg.error?.message || ffmpeg.stderr || 'unknown error'}`);

  const runtimeBuffer = await readFile(runtimeFile);
  const durationSeconds = probeDuration(runtimeFile);
  resolved.push({
    id: item.id,
    packId: 'remotion-cc0-reviewed',
    role: item.role,
    originalFile: `${item.exportName}.wav`,
    runtimeFile: path.relative(process.cwd(), runtimeFile).replace(/\\/g, '/'),
    staticFile: path.relative(path.resolve('public'), runtimeFile).replace(/\\/g, '/'),
    durationSeconds: Number(durationSeconds.toFixed(6)),
    creator: item.creator,
    license: item.license,
    officialUrl: item.docsUrl,
    originalSource: item.originalSource,
    remotionMediaUrl: item.url,
    sourceSha256: sha256(sourceBuffer),
    runtimeSha256: sha256(runtimeBuffer),
  });
  await rm(tempFile, {force: true});
}

const index = {
  version: 1,
  status: 'LOCAL_REMOTION_CC0_SFX_SUPPLEMENT_READY',
  generatedAt: new Date().toISOString(),
  sourcePackage: config.sourcePackage,
  policy: {
    license: 'CC0-1.0_ONLY',
    explicitReelOptInRequired: true,
    remoteRenderAllowed: false,
    blockedExamples: [...blocked].sort(),
  },
  totalSounds: resolved.length,
  items: resolved.sort((a, b) => a.id.localeCompare(b.id)),
};
await writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

console.log('REMOTION CC0 SFX SUPPLEMENT: READY');
console.log(`sounds: ${index.totalSounds}`);
console.log(`index: ${path.relative(process.cwd(), indexPath)}`);
console.log('license: CC0-1.0 only');
console.log('render: local files only');
console.log('activation: explicit reel opt-in required');
