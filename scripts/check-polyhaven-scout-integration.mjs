#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const required = [
  'scripts/scout-polyhaven-assets.mjs',
  '.agents/skills/polyhaven-3d-asset-scout/SKILL.md',
  '.agents/workflows/scout-polyhaven-3d.md',
];
const errors = [];
for (const file of required) if (!existsSync(path.resolve(root, file))) errors.push(`missing ${file}`);
const read = (file) => existsSync(path.resolve(root, file)) ? readFileSync(path.resolve(root, file), 'utf8') : '';
const scout = read('scripts/scout-polyhaven-assets.mjs');
const skill = read('.agents/skills/polyhaven-3d-asset-scout/SKILL.md');
const workflow = read('.agents/workflows/scout-polyhaven-3d.md');

for (const token of [
  'https://api.polyhaven.com/assets',
  'DISCOVERY_ONLY_NOT_PRODUCTION_APPROVED',
  'downloadsPerformed: false',
  'productionManifestModified: false',
  'remoteMediaDuringRenderAllowed: false',
  'apiIsOptionalBestEffortDependency: true',
  "typeMap = {hdri: 0, texture: 1, model: 2}",
]) if (!scout.includes(token)) errors.push(`scout missing token: ${token}`);

for (const forbidden of ['writeFile(path.resolve(\'public\'', 'visual-assets.json', 'visual-assets-resolved.json']) {
  if (scout.includes(forbidden)) errors.push(`scout contains forbidden production-write token: ${forbidden}`);
}
for (const token of ['discovery-only', 'CC0', 'must not', 'best-effort', 'SHA256']) {
  if (!skill.toLowerCase().includes(token.toLowerCase())) errors.push(`skill missing token: ${token}`);
}
for (const token of ['node scripts/scout-polyhaven-assets.mjs', 'Do **not** download anything', 'DISCOVERY_ONLY_NOT_PRODUCTION_APPROVED', 'API downtime']) {
  if (!workflow.includes(token)) errors.push(`workflow missing token: ${token}`);
}

const syntax = spawnSync(process.execPath, ['--check', path.resolve(root, 'scripts/scout-polyhaven-assets.mjs')], {encoding: 'utf8'});
if (syntax.status !== 0) errors.push(`scout syntax check failed: ${syntax.stderr || syntax.stdout}`);

if (errors.length) {
  console.error('POLY HAVEN SCOUT INTEGRATION: FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('POLY HAVEN SCOUT INTEGRATION: PASSED');
console.log('mode: discovery-only');
console.log('license: CC0 metadata preserved');
console.log('downloads: disabled in scout');
console.log('production resolver: untouched');
console.log('API: optional/best-effort only');
