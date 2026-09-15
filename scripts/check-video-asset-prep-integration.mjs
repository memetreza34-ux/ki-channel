#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const fail = [];
const required = [
  'scripts/prepare-local-video-asset.mjs',
  '.agents/skills/video-asset-prep/SKILL.md',
  '.agents/workflows/prepare-local-video-asset.md',
];
for (const file of required) if (!existsSync(path.resolve(root,file))) fail.push(`missing ${file}`);
const read = (file) => readFileSync(path.resolve(root,file),'utf8');
const requireTokens = (file,tokens) => {
  if (!existsSync(path.resolve(root,file))) return;
  const text = read(file);
  for (const token of tokens) if (!text.includes(token)) fail.push(`${file} missing token: ${token}`);
};

requireTokens('scripts/prepare-local-video-asset.mjs', [
  'PREPARED_NOT_PRODUCTION_APPROVED',
  'remote URLs are forbidden',
  "'-map_metadata','-1'",
  "'-c:v','libx264'",
  "'-pix_fmt','yuv420p'",
  "'-movflags','+faststart'",
  "outputRoot: 'out/asset-prep/video'",
  'productionManifestModified: false',
  'humanVisualReviewRequired: true',
  'humanTimingReviewRequired: true',
  '--allow-upscale',
]);
requireTokens('.agents/skills/video-asset-prep/SKILL.md', [
  'already local',
  'provenance',
  'PREPARED_NOT_PRODUCTION_APPROVED',
  'No HTTP/remote input',
  'Never overwrite the source',
]);
requireTokens('.agents/workflows/prepare-local-video-asset.md', [
  '# /prepare-local-video-asset',
  'node scripts/prepare-local-video-asset.mjs',
  '--provenance=',
  'PREPARED_NOT_PRODUCTION_APPROVED',
  'do not modify `visual-assets.json` automatically',
]);

if (fail.length) {
  console.error('VIDEO ASSET PREP INTEGRATION: FAILED');
  for (const issue of fail) console.error(`- ${issue}`);
  process.exit(1);
}
console.log('VIDEO ASSET PREP INTEGRATION: PASSED');
console.log('input: already-local + provenance-backed only');
console.log('output: short H.264 9:16 derivative under out/asset-prep/video');
console.log('production approval: separate visual/provenance review required');
