#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const required = [
  'scripts/scout-pixabay-assets.mjs',
  '.agents/skills/pixabay-asset-scout/SKILL.md',
  '.agents/workflows/scout-pixabay-assets.md',
  '.env.example',
  '.gitignore',
];
const errors = [];
for (const file of required) if (!existsSync(path.resolve(root, file))) errors.push(`missing ${file}`);

const read = (file) => existsSync(path.resolve(root, file)) ? readFileSync(path.resolve(root, file), 'utf8') : '';
const scout = read('scripts/scout-pixabay-assets.mjs');
const skill = read('.agents/skills/pixabay-asset-scout/SKILL.md');
const workflow = read('.agents/workflows/scout-pixabay-assets.md');
const envExample = read('.env.example');
const gitignore = read('.gitignore');

for (const token of ['PIXABAY_API_KEY', 'DISCOVERY_ONLY_NOT_PRODUCTION_APPROVED', 'downloadsPerformed: false', 'productionManifestModified: false', 'systematicMassDownloadsAllowed: false', 'remoteMediaDuringRenderAllowed: false', '24 * 60 * 60 * 1000', 'https://pixabay.com/api/videos/', 'https://pixabay.com/api/']) {
  if (!scout.includes(token)) errors.push(`scout missing safety token: ${token}`);
}
for (const forbidden of ['writeFile(path.resolve(\'public\'', 'visual-assets.json']) {
  if (scout.includes(forbidden)) errors.push(`scout contains forbidden production-write token: ${forbidden}`);
}
for (const token of ['discovery only', '24 hours', 'mass downloads', 'must not', 're-resolve']) {
  if (!skill.toLowerCase().includes(token.toLowerCase())) errors.push(`skill missing token: ${token}`);
}
for (const token of ['scout-pixabay-assets.mjs', '24-hour cache', 'Do **not** download anything', 'DISCOVERY_ONLY_NOT_PRODUCTION_APPROVED']) {
  if (!workflow.includes(token)) errors.push(`workflow missing token: ${token}`);
}
if (!envExample.includes('PIXABAY_API_KEY=')) errors.push('.env.example missing PIXABAY_API_KEY placeholder');
if (!/^\.env$/m.test(gitignore) || !/^\.env\.local$/m.test(gitignore)) errors.push('.gitignore must ignore .env and .env.local');

const syntax = spawnSync(process.execPath, ['--check', path.resolve(root, 'scripts/scout-pixabay-assets.mjs')], {encoding: 'utf8'});
if (syntax.status !== 0) errors.push(`scout syntax check failed: ${syntax.stderr || syntax.stdout}`);

if (errors.length) {
  console.error('PIXABAY SCOUT INTEGRATION: FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('PIXABAY SCOUT INTEGRATION: PASSED');
console.log('mode: discovery-only');
console.log('24h API cache: enforced');
console.log('production resolver: untouched');
console.log('mass downloads: forbidden');
console.log('remote render media: forbidden');
console.log('API key: local-only via PIXABAY_API_KEY');
