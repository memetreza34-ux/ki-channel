#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const [rawReelDir, ...rawRest] = process.argv.slice(2);
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/align-reel-synced.mjs <reel-package-dir> [--backend=auto|mlx-qwen3|ctc-german]');
  process.exit(2);
}
const reelDir = path.resolve(rawReelDir);
const explicitBackend = rawRest.find((arg) => arg.startsWith('--backend='));
const rest = [...rawRest];
if (!explicitBackend && process.platform === 'darwin' && process.arch === 'arm64') rest.push('--backend=mlx-qwen3');

const run = (label, script, args) => {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(process.execPath, [script, ...args], {encoding: 'utf8', stdio: 'inherit'});
  if (result.error || result.status !== 0) {
    console.error(`STRICT SYNC PIPELINE FAILED: ${label}${result.error ? `: ${result.error.message}` : ''}`);
    process.exit(result.status || 1);
  }
};

run('1/9 normalize scene/voice schema', path.resolve('ki/scripts/normalize-scene-voice-map.mjs'), [reelDir]);
run('2/9 primary forced alignment', path.resolve('ki/scripts/align-reel-local.mjs'), [reelDir, ...rest]);
run('3/9 independent CTC alignment consensus', path.resolve('ki/scripts/verify-reel-alignment-consensus.mjs'), [reelDir]);
run('4/9 build pause-aware master timeline', path.resolve('ki/scripts/build-reel-master-timeline-v2.mjs'), [reelDir]);
run('5/9 resolve SFX on exact master events', path.resolve('ki/scripts/resolve-reel-sfx.mjs'), [reelDir]);
run('6/9 validate alignment quality', path.resolve('scripts/validate-reel-alignment-quality.mjs'), [reelDir]);
run('7/9 validate master timeline', path.resolve('scripts/validate-reel-master-timeline.mjs'), [reelDir]);
run('8/9 finalize timing sync', path.resolve('ki/scripts/finalize-reel-timing-sync.mjs'), [reelDir]);
run('9/9 final timing + master gates', path.resolve('scripts/validate-reel-timing-sync.mjs'), [reelDir]);
run('final alignment quality gate', path.resolve('scripts/validate-reel-alignment-quality.mjs'), [reelDir]);
run('final master timeline gate', path.resolve('scripts/validate-reel-master-timeline.mjs'), [reelDir]);

console.log('\nSTRICT AUDIO-FIRST REEL SYNC COMPLETE');
console.log('Primary forced alignment + independent CTC verification passed.');
console.log('One master timeline controls captions, pause-aware scene cuts, semantic animation events, SFX and final duration.');
console.log('Production timing has no approximate phrase fallback.');
console.log('Commit generated timing files before production render.');
