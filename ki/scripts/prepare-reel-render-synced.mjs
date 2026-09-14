#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/prepare-reel-render-synced.mjs <reel-package-dir>');
  process.exit(2);
}
const reelDir = path.resolve(rawReelDir);
const run = (label, script, args) => {
  const result = spawnSync(process.execPath, [script, ...args], {encoding: 'utf8', stdio: 'inherit'});
  if (result.error || result.status !== 0) {
    console.error(`SYNCED RENDER PREP FAILED: ${label}${result.error ? `: ${result.error.message}` : ''}`);
    process.exit(result.status || 1);
  }
};

run('alignment consensus gate', path.resolve('scripts/validate-reel-alignment-quality.mjs'), [reelDir]);
run('master timeline gate', path.resolve('scripts/validate-reel-master-timeline.mjs'), [reelDir]);
run('timing sync gate', path.resolve('scripts/validate-reel-timing-sync.mjs'), [reelDir]);
run('standard production render preparation', path.resolve('ki/scripts/prepare-reel-render.mjs'), [reelDir]);

console.log('\nSTRICT SYNCED RENDER PREP PASSED');
console.log('Render lock created only after independent alignment consensus + master timeline + timing validation.');
