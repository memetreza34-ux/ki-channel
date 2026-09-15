#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const required = [
  'scripts/scout-wikimedia-commons-assets.mjs',
  '.agents/skills/wikimedia-proof-visual-scout/SKILL.md',
  '.agents/workflows/scout-wikimedia-proof-visuals.md',
  'ki/scripts/resolve-reel-visual-assets.mjs',
  'ki/config/visual-asset-sources.json',
];
const errors = [];
for (const file of required) if (!existsSync(path.resolve(root, file))) errors.push(`missing ${file}`);
const read = (file) => existsSync(path.resolve(root, file)) ? readFileSync(path.resolve(root, file), 'utf8') : '';
const scout = read('scripts/scout-wikimedia-commons-assets.mjs');
const skill = read('.agents/skills/wikimedia-proof-visual-scout/SKILL.md');
const workflow = read('.agents/workflows/scout-wikimedia-proof-visuals.md');
const resolver = read('ki/scripts/resolve-reel-visual-assets.mjs');
const policy = read('ki/config/visual-asset-sources.json');

for (const token of [
  'https://commons.wikimedia.org/w/api.php',
  "iiprop: 'url|size|mime|extmetadata'",
  'DISCOVERY_ONLY_NOT_PRODUCTION_APPROVED',
  'downloadsPerformed: false',
  'productionManifestModified: false',
  'remoteMediaDuringRenderAllowed: false',
  'personalityPrivacyTrademarkReviewRequiredWhereRelevant: true',
  "'CC0-1.0', 'PUBLIC_DOMAIN', 'CC-BY-4.0'",
]) if (!scout.includes(token)) errors.push(`scout missing token: ${token}`);

for (const forbidden of ['visual-assets.json', 'visual-assets-resolved.json']) {
  if (scout.includes(forbidden)) errors.push(`scout contains forbidden production manifest token: ${forbidden}`);
}
for (const token of ['discovery-only', 'CC0-1.0', 'PUBLIC_DOMAIN', 'CC-BY-4.0', 'manual review', 'resolve-reel-visual-assets.mjs']) {
  if (!skill.toLowerCase().includes(token.toLowerCase())) errors.push(`skill missing token: ${token}`);
}
for (const token of ['scout-wikimedia-commons-assets.mjs', 'Do **not** download anything', 'DISCOVERY_ONLY_NOT_PRODUCTION_APPROVED', 'resolve-reel-visual-assets.mjs']) {
  if (!workflow.includes(token)) errors.push(`workflow missing token: ${token}`);
}
for (const token of ['WIKIMEDIA_COMMONS', 'extmetadata', 'downloadImage', 'sha256']) {
  if (!resolver.includes(token)) errors.push(`existing production resolver missing Wikimedia capability token: ${token}`);
}
for (const token of ['"WIKIMEDIA_COMMONS"', '"requiresApiKey": false', '"CC0-1.0"', '"PUBLIC_DOMAIN"', '"CC-BY-4.0"']) {
  if (!policy.includes(token)) errors.push(`visual source policy missing token: ${token}`);
}

const syntax = spawnSync(process.execPath, ['--check', path.resolve(root, 'scripts/scout-wikimedia-commons-assets.mjs')], {encoding: 'utf8'});
if (syntax.status !== 0) errors.push(`scout syntax check failed: ${syntax.stderr || syntax.stdout}`);

if (errors.length) {
  console.error('WIKIMEDIA COMMONS SCOUT INTEGRATION: FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('WIKIMEDIA COMMONS SCOUT INTEGRATION: PASSED');
console.log('mode: discovery-only');
console.log('production resolver: existing local license-filtered SHA path retained');
console.log('automatic scout rights: CC0 / Public Domain / CC BY 4.0 only');
console.log('remote render media: forbidden');
console.log('non-copyright restrictions: manual review required where relevant');
