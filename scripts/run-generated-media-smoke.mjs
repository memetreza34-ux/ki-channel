#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {copyFile, mkdir, readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const mode = process.argv[2] || 'verify';
if (!['verify', 'materialize'].includes(mode)) {
  console.error('Usage: node scripts/run-generated-media-smoke.mjs <verify|materialize>');
  process.exit(1);
}
if (Number(process.versions.node.split('.')[0]) !== 20) {
  console.error(`GENERATED MEDIA SMOKE BLOCKED: Node 20 required, got ${process.versions.node}.`);
  process.exit(1);
}

const root = process.cwd();
const smokeDir = path.resolve(root, 'out', 'generated-media-smoke');
const projectDir = path.join(smokeDir, '06-projektdateien');
const template = path.resolve(root, 'scripts', 'generated-media-smoke-request.json');
const request = path.join(projectDir, 'GENERATED-MEDIA-REQUESTS.json');
const manifest = path.join(projectDir, 'GENERATED-MEDIA.json');
const materializer = path.resolve(root, 'scripts', 'materialize-generated-media.mjs');

if (!existsSync(template) || !existsSync(materializer)) {
  console.error('GENERATED MEDIA SMOKE BLOCKED: template or materializer missing.');
  process.exit(1);
}
await mkdir(projectDir, {recursive: true});
await copyFile(template, request);

const result = spawnSync(process.execPath, [materializer, mode, smokeDir], {stdio: 'inherit', env: process.env});
if (result.error || result.status !== 0) {
  console.error(`GENERATED MEDIA SMOKE: ${mode.toUpperCase()} FAILED`);
  process.exit(result.status ?? 1);
}

if (mode === 'verify') {
  console.log('GENERATED MEDIA SMOKE: REQUEST VERIFIED — no API credits were used.');
  process.exit(0);
}

if (!existsSync(manifest)) {
  console.error('GENERATED MEDIA SMOKE FAILED: materialize returned success but GENERATED-MEDIA.json is missing.');
  process.exit(1);
}
const data = JSON.parse(await readFile(manifest, 'utf8'));
const items = Array.isArray(data?.items) ? data.items : [];
if (items.length !== 2) {
  console.error(`GENERATED MEDIA SMOKE FAILED: expected 2 manifest items, got ${items.length}.`);
  process.exit(1);
}
for (const item of items) {
  if (item.generated !== true || item.syntheticMedia !== true || item.evidenceAllowed !== false) {
    console.error(`GENERATED MEDIA SMOKE FAILED: truth flags invalid for ${item.id}.`);
    process.exit(1);
  }
  if (!/^[a-f0-9]{64}$/i.test(String(item.sha256 || ''))) {
    console.error(`GENERATED MEDIA SMOKE FAILED: SHA256 missing for ${item.id}.`);
    process.exit(1);
  }
  const localFile = path.resolve(root, String(item.localFile || ''));
  if (!existsSync(localFile)) {
    console.error(`GENERATED MEDIA SMOKE FAILED: local file missing for ${item.id}: ${item.localFile}`);
    process.exit(1);
  }
  if (item.kind === 'BROLL' && item.audioPolicy !== 'MUTE_GENERATED_AUDIO') {
    console.error(`GENERATED MEDIA SMOKE FAILED: B-roll audio policy invalid for ${item.id}.`);
    process.exit(1);
  }
}
console.log('GENERATED MEDIA SMOKE: MATERIALIZED — image + B-roll files, hashes and truth flags verified.');
console.log(`Manifest: ${path.relative(root, manifest)}`);
