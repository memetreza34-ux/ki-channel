#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const [rawReelDir, ...rest] = process.argv.slice(2);
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/align-reel-synced.mjs <reel-package-dir> [--backend=auto|mlx-qwen3|ctc-german]');
  process.exit(2);
}

const reelDir = path.resolve(rawReelDir);
const run = (label, script, args) => {
  const result = spawnSync(process.execPath, [script, ...args], {encoding: 'utf8', stdio: 'inherit'});
  if (result.error || result.status !== 0) {
    console.error(`SYNC PIPELINE FAILED: ${label}${result.error ? `: ${result.error.message}` : ''}`);
    process.exit(result.status || 1);
  }
};

run('forced alignment + caption/scene/SFX lock', path.resolve('ki/scripts/align-reel-local.mjs'), [reelDir, ...rest]);
run('timing sync finalization', path.resolve('ki/scripts/finalize-reel-timing-sync.mjs'), [reelDir]);
run('timing sync validation', path.resolve('scripts/validate-reel-timing-sync.mjs'), [reelDir]);

console.log('\nAUDIO-FIRST REEL SYNC COMPLETE');
console.log('Audio is now the master clock for captions, scenes, semantic animation anchors, SFX and final duration.');
console.log('Commit the generated timing files before production render.');
