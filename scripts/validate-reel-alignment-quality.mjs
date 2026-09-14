#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node scripts/validate-reel-alignment-quality.mjs <reel-package-dir>');
  process.exit(2);
}
const reelDir = path.resolve(rawReelDir);
const qualityPath = path.join(reelDir, '06-projektdateien', 'ALIGNMENT-QUALITY.json');
const wordsPath = path.join(reelDir, '01-script-audio', 'WORD-TIMINGS.json');
const fail = (message) => { console.error(`ALIGNMENT QUALITY FAILED: ${message}`); process.exit(1); };
for (const file of [qualityPath, wordsPath]) if (!existsSync(file)) fail(`missing required file: ${file}`);
const quality = JSON.parse(await readFile(qualityPath, 'utf8'));
const wordsBytes = await readFile(wordsPath);
const currentHash = createHash('sha256').update(wordsBytes).digest('hex');
if (quality?.status !== 'ALIGNMENT_CONSENSUS_PASSED') fail(`status is ${quality?.status || 'missing'}`);
if (quality?.authority !== '01-script-audio/WORD-TIMINGS.json') fail('authority mismatch.');
if (quality?.wordTimingsSha256 !== currentHash) fail('WORD-TIMINGS.json changed after consensus verification.');
if (!quality?.primary?.backend || !quality?.verifier?.backend) fail('primary/verifier metadata missing.');
if (quality.primary.backend === quality.verifier.backend) fail('primary and verifier must be independent backends.');
if (!Number.isFinite(Number(quality?.metrics?.maxAnchorDeltaMs))) fail('anchor quality metric missing.');
if (Number(quality.metrics.maxAnchorDeltaMs) > Number(quality?.thresholds?.maxAnchorDeltaMs)) fail('planned anchor delta exceeds threshold.');
console.log('ALIGNMENT QUALITY PASSED');
console.log(`primary: ${quality.primary.backend}`);
console.log(`verifier: ${quality.verifier.backend}`);
console.log(`max planned-anchor delta: ${quality.metrics.maxAnchorDeltaMs} ms`);
