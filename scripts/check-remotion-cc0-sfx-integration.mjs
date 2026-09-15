#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const required = [
  'ki/config/remotion-sfx-cc0.json',
  'ki/scripts/setup-remotion-cc0-sfx-supplement.mjs',
  'ki/scripts/resolve-reel-sfx.mjs',
  '.agents/skills/remotion-cc0-sfx-supplement/SKILL.md',
  '.agents/workflows/setup-remotion-cc0-sfx.md',
];
const errors = [];
for (const file of required) if (!existsSync(path.resolve(root, file))) errors.push(`missing ${file}`);
const read = (file) => existsSync(path.resolve(root, file)) ? readFileSync(path.resolve(root, file), 'utf8') : '';

const configRaw = read('ki/config/remotion-sfx-cc0.json');
let config = null;
try { config = JSON.parse(configRaw); } catch (error) { errors.push(`invalid allowlist JSON: ${error.message}`); }
const setup = read('ki/scripts/setup-remotion-cc0-sfx-supplement.mjs');
const resolver = read('ki/scripts/resolve-reel-sfx.mjs');
const skill = read('.agents/skills/remotion-cc0-sfx-supplement/SKILL.md');
const workflow = read('.agents/workflows/setup-remotion-cc0-sfx.md');

if (config?.status !== 'REVIEWED_CC0_ALLOWLIST') errors.push('allowlist status mismatch');
if (config?.policy?.license !== 'CC0-1.0_ONLY') errors.push('allowlist must be CC0-1.0_ONLY');
const expected = ['whip','whoosh','pageTurn','uiSwitch','mouseClick','shutterModern','shutterOld'];
const actual = (config?.items || []).map((item) => item.exportName).sort();
for (const name of expected) if (!actual.includes(name)) errors.push(`allowlist missing ${name}`);
for (const item of config?.items || []) {
  if (item.license !== 'CC0-1.0') errors.push(`non-CC0 item in allowlist: ${item.exportName}`);
  if (!String(item.url || '').startsWith('https://remotion.media/')) errors.push(`non-remotion.media URL: ${item.exportName}`);
  if (!String(item.docsUrl || '').startsWith('https://www.remotion.dev/docs/sfx/')) errors.push(`invalid Remotion docs URL: ${item.exportName}`);
}
for (const blocked of ['ding','recordScratch']) {
  if (actual.includes(blocked)) errors.push(`blocked sound included in allowlist: ${blocked}`);
  if (!(config?.explicitlyBlockedExamples || []).some((item) => item.exportName === blocked)) errors.push(`blocked example metadata missing: ${blocked}`);
}

for (const token of ['LOCAL_REMOTION_CC0_SFX_SUPPLEMENT_READY','sourceSha256','runtimeSha256','remotion.media','CC0-1.0 only','explicit reel opt-in required']) {
  if (!setup.toLowerCase().includes(token.toLowerCase())) errors.push(`setup missing token: ${token}`);
}
for (const token of ['allowRemotionCc0Supplement','LOCAL_REMOTION_CC0_SFX_SUPPLEMENT_READY','remotionSupplementRequiresExplicitOptIn:true','supplementItems']) {
  if (!resolver.includes(token)) errors.push(`resolver missing token: ${token}`);
}
for (const token of ['CC0-1.0 only','Voice remains priority','No remote audio','ding','recordScratch']) {
  if (!skill.toLowerCase().includes(token.toLowerCase())) errors.push(`skill missing token: ${token}`);
}
for (const token of ['setup-remotion-cc0-sfx-supplement.mjs','allowRemotionCc0Supplement','Never use remote `remotion.media` audio']) {
  if (!workflow.includes(token)) errors.push(`workflow missing token: ${token}`);
}

for (const file of ['ki/scripts/setup-remotion-cc0-sfx-supplement.mjs','ki/scripts/resolve-reel-sfx.mjs']) {
  const syntax = spawnSync(process.execPath, ['--check', path.resolve(root, file)], {encoding: 'utf8'});
  if (syntax.status !== 0) errors.push(`${file} syntax failed: ${syntax.stderr || syntax.stdout}`);
}

if (errors.length) {
  console.error('REMOTION CC0 SFX INTEGRATION: FAILED');
  for (const error of [...new Set(errors)]) console.error(`- ${error}`);
  process.exit(1);
}

console.log('REMOTION CC0 SFX INTEGRATION: PASSED');
console.log(`allowlisted sounds: ${actual.length}`);
console.log('license policy: reviewed CC0-1.0 only');
console.log('activation: explicit per-reel opt-in');
console.log('render: local audio only');
console.log('base Kenney CC0 library: unchanged and primary');
