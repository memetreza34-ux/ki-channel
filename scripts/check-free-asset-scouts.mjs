#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const errors = [];
const required = [
  'scripts/scout-pexels-assets.mjs',
  'scripts/scout-pixabay-assets.mjs',
  'scripts/check-pexels-scout-integration.mjs',
  'scripts/check-pixabay-scout-integration.mjs',
  '.agents/skills/pexels-asset-scout/SKILL.md',
  '.agents/skills/pixabay-asset-scout/SKILL.md',
  '.agents/workflows/scout-pexels-assets.md',
  '.agents/workflows/scout-pixabay-assets.md',
  '.agents/workflows/scout-free-assets.md',
  '.env.example',
];
for (const file of required) if (!existsSync(path.resolve(root, file))) errors.push(`missing ${file}`);

const run = (script) => {
  const result = spawnSync(process.execPath, [path.resolve(root, script)], {cwd: root, encoding: 'utf8'});
  if (result.status !== 0) errors.push(`${script} failed: ${result.stderr || result.stdout}`);
};
run('scripts/check-pexels-scout-integration.mjs');
run('scripts/check-pixabay-scout-integration.mjs');

const read = (file) => existsSync(path.resolve(root, file)) ? readFileSync(path.resolve(root, file), 'utf8') : '';
const combined = read('.agents/workflows/scout-free-assets.md');
for (const token of ['Pexels first', 'Pixabay', '24-hour API cache', 'DISCOVERY_ONLY_NOT_PRODUCTION_APPROVED', 'Do not:', 'compute SHA256']) {
  if (!combined.includes(token)) errors.push(`combined workflow missing token: ${token}`);
}
const envExample = read('.env.example');
for (const token of ['PEXELS_API_KEY=', 'PIXABAY_API_KEY=']) if (!envExample.includes(token)) errors.push(`.env.example missing ${token}`);

if (errors.length) {
  console.error('FREE ASSET SCOUTS: FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('FREE ASSET SCOUTS: PASSED');
console.log('providers: Pexels + Pixabay');
console.log('mode: discovery-only');
console.log('production resolver: untouched');
console.log('remote render media: forbidden');
console.log('automatic downloads: forbidden');
