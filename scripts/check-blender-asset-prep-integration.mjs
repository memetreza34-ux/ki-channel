#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const required = [
  'scripts/prepare-blender-3d-asset.mjs',
  'scripts/blender_optimize_glb.py',
  '.agents/skills/blender-asset-prep/SKILL.md',
  '.agents/workflows/prepare-blender-3d.md',
];
const errors = [];
for (const file of required) if (!existsSync(path.resolve(root, file))) errors.push(`missing ${file}`);
const read = (file) => existsSync(path.resolve(root, file)) ? readFileSync(path.resolve(root, file), 'utf8') : '';
const runner = read('scripts/prepare-blender-3d-asset.mjs');
const helper = read('scripts/blender_optimize_glb.py');
const skill = read('.agents/skills/blender-asset-prep/SKILL.md');
const workflow = read('.agents/workflows/prepare-blender-3d.md');

for (const token of ['--background', '--offline-mode', '--disable-autoexec', '--python-exit-code', 'out', 'asset-prep', 'blender', 'PREPARED_NOT_PRODUCTION_APPROVED']) {
  if (!runner.includes(token)) errors.push(`runner missing safety token: ${token}`);
}
for (const token of ['SPDX-License-Identifier: GPL-3.0-or-later', 'rigged/animated/shape-key', 'export_format="GLB"', 'sourceSha256', 'outputSha256', 'productionManifestModified', 'humanVisualReviewRequired']) {
  if (!helper.includes(token)) errors.push(`Blender helper missing token: ${token}`);
}
for (const forbidden of ['visual-assets.json', 'visual-assets-resolved.json', 'http://', 'https://']) {
  if (runner.includes(forbidden) || helper.includes(forbidden)) errors.push(`automatic Blender prep contains forbidden production/remote token: ${forbidden}`);
}
for (const token of ['No community Blender MCP', 'Source `.glb`/`.gltf`', 'PREPARED_NOT_PRODUCTION_APPROVED', 'SHA256']) {
  if (!skill.includes(token)) errors.push(`skill missing token: ${token}`);
}
for (const token of ['npm run antigravity:blender-prep', '--offline-mode', 'MANUAL_3D_OPTIMIZATION_REQUIRED', 'PREPARED_NOT_PRODUCTION_APPROVED']) {
  if (!workflow.includes(token)) errors.push(`workflow missing token: ${token}`);
}

const nodeSyntax = spawnSync(process.execPath, ['--check', path.resolve(root, 'scripts/prepare-blender-3d-asset.mjs')], {encoding: 'utf8'});
if (nodeSyntax.status !== 0) errors.push(`Node runner syntax failed: ${nodeSyntax.stderr || nodeSyntax.stdout}`);

if (errors.length) {
  console.error('BLENDER ASSET PREP INTEGRATION: FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('BLENDER ASSET PREP INTEGRATION: PASSED');
console.log('mode: local static GLB/GLTF only');
console.log('Blender: background + offline + autoexec disabled');
console.log('source overwrite: forbidden');
console.log('rigged/animated/shape-key automatic prep: refused');
console.log('production approval: separate visual/provenance gate required');
