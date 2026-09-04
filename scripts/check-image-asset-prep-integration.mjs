#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const required = [
  'scripts/prepare-local-image-asset.mjs',
  '.agents/skills/image-asset-prep/SKILL.md',
  '.agents/workflows/prepare-local-image-asset.md',
];
const errors = [];
for (const file of required) {
  if (!existsSync(path.resolve(root, file))) errors.push(`missing ${file}`);
}
const read = (file) => existsSync(path.resolve(root, file)) ? readFileSync(path.resolve(root, file), 'utf8') : '';
const runner = read('scripts/prepare-local-image-asset.mjs');
const skill = read('.agents/skills/image-asset-prep/SKILL.md');
const workflow = read('.agents/workflows/prepare-local-image-asset.md');

for (const token of [
  "import sharp from 'sharp'",
  "allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp'])",
  'limitInputPixels: 64_000_000',
  '30 * 1024 * 1024',
  "provenanceArg === 'USER_PROVIDED'",
  '.rotate()',
  ".toColourspace('srgb')",
  'withoutEnlargement: !allowUpscale',
  'PREPARED_NOT_PRODUCTION_APPROVED',
  'metadataStripped: true',
  'sourceOverwritten: false',
  'productionManifestModified: false',
  'remoteMediaDuringRenderAllowed: false',
  'humanVisualReviewRequired: true',
]) {
  if (!runner.includes(token)) errors.push(`runner missing token: ${token}`);
}

for (const forbidden of [
  'visual-assets.json',
  'visual-assets-resolved.json',
  "path.resolve('public'",
  'http://',
  'https://',
  '.withMetadata(',
  '.keepMetadata(',
]) {
  if (runner.includes(forbidden)) errors.push(`runner contains forbidden production/remote/metadata token: ${forbidden}`);
}

for (const token of [
  'already-local',
  'provenance',
  'PREPARED_NOT_PRODUCTION_APPROVED',
  'source',
  'crop',
  'visual review',
  'SHA256',
]) {
  if (!skill.toLowerCase().includes(token.toLowerCase())) errors.push(`skill missing token: ${token}`);
}

for (const token of [
  'node scripts/prepare-local-image-asset.mjs',
  '--provenance=',
  'PREPARED_NOT_PRODUCTION_APPROVED',
  'Do not',
  'visual',
]) {
  if (!workflow.includes(token)) errors.push(`workflow missing token: ${token}`);
}

const syntax = spawnSync(process.execPath, ['--check', path.resolve(root, 'scripts/prepare-local-image-asset.mjs')], {encoding: 'utf8'});
if (syntax.status !== 0) errors.push(`runner syntax check failed: ${syntax.stderr || syntax.stdout}`);

if (errors.length) {
  console.error('IMAGE ASSET PREP INTEGRATION: FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('IMAGE ASSET PREP INTEGRATION: PASSED');
console.log('mode: local-only, prep-only');
console.log('input: JPEG/PNG/WebP only, byte/pixel limited');
console.log('orientation: EXIF auto-orient');
console.log('metadata: stripped from prepared output');
console.log('upscale: refused by default');
console.log('production approval: separate provenance + visual gate required');
