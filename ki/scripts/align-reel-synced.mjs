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
    console.error(`CHOREOGRAPHED SYNC PIPELINE FAILED: ${label}${result.error ? `: ${result.error.message}` : ''}`);
    process.exit(result.status || 1);
  }
};

run('1/13 normalize scene/voice schema', path.resolve('ki/scripts/normalize-scene-voice-map.mjs'), [reelDir]);
run('2/13 primary forced alignment (cached when unchanged)', path.resolve('ki/scripts/align-reel-local.mjs'), [reelDir, ...rest, '--skip-sfx']);
run('3/13 independent CTC alignment consensus (cached when unchanged)', path.resolve('ki/scripts/verify-reel-alignment-consensus.mjs'), [reelDir]);
run('4/13 build pause-aware speech/caption/scene master timeline', path.resolve('ki/scripts/build-reel-master-timeline-v2.mjs'), [reelDir]);
run('5/13 compile explicit speech-to-animation choreography intervals', path.resolve('ki/scripts/compile-reel-choreography.mjs'), [reelDir]);
run('6/13 resolve SFX from choreography beat frames', path.resolve('ki/scripts/resolve-reel-sfx.mjs'), [reelDir]);
run('7/13 write exact human-readable timeline audit', path.resolve('ki/scripts/write-reel-timeline-audit.mjs'), [reelDir]);
run('8/13 validate alignment quality', path.resolve('scripts/validate-reel-alignment-quality.mjs'), [reelDir]);
run('9/13 validate lower-level master timeline', path.resolve('scripts/validate-reel-master-timeline.mjs'), [reelDir]);
run('10/13 validate explicit choreography intervals', path.resolve('scripts/validate-reel-choreography.mjs'), [reelDir]);
run('11/13 finalize timing sync', path.resolve('ki/scripts/finalize-reel-timing-sync.mjs'), [reelDir]);
run('12/13 final timing gate', path.resolve('scripts/validate-reel-timing-sync.mjs'), [reelDir]);
run('13/13 final choreography gate', path.resolve('scripts/validate-reel-choreography.mjs'), [reelDir]);
run('final alignment quality gate', path.resolve('scripts/validate-reel-alignment-quality.mjs'), [reelDir]);
run('final lower-level master timeline gate', path.resolve('scripts/validate-reel-master-timeline.mjs'), [reelDir]);

console.log('\nEXPLICIT REEL CHOREOGRAPHY COMPLETE');
console.log('Audio -> exact words -> captions/scenes -> explicit speech windows -> ENTER/HOLD/EXIT animation windows -> SFX.');
console.log('Unchanged audio/script timing reuses cached primary + verifier alignments instead of loading both models again.');
console.log('TIMELINE-AUDIT.md contains the exact from/to times for scenes, captions, animation phases and SFX.');
console.log('No production animation may be driven by an approximate percentage or a single unbounded trigger frame.');
console.log('Commit generated timing files before production render.');
