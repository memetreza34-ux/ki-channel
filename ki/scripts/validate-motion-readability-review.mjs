#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';

const input = process.argv[2];
if (!input) {
  console.error('Usage: node ki/scripts/validate-motion-readability-review.mjs <reel-package-dir>');
  process.exit(1);
}

const reelDir = path.resolve(input);
const review = path.join(reelDir, '06-projektdateien', 'MOTION-READABILITY-REVIEW.md');
if (!existsSync(review)) {
  console.error(`MOTION READABILITY GATE FAILED: missing ${review}`);
  process.exit(1);
}

const text = await readFile(review, 'utf8');
const get = (key) => {
  const match = text.match(new RegExp(`^${key}:\\s*(.+)$`, 'mi'));
  return match?.[1]?.trim() ?? null;
};
const fail = (message) => {
  console.error(`MOTION READABILITY GATE FAILED: ${message}`);
  process.exit(1);
};

if (get('STATUS') !== 'PASS') fail('STATUS must be PASS.');
if (get('LIGHT_FIRST') !== 'PASS') fail('LIGHT_FIRST must be PASS.');

const darkScenes = Number(get('DARK_FULL_FRAME_SCENES'));
if (!Number.isFinite(darkScenes) || darkScenes < 0) fail('DARK_FULL_FRAME_SCENES must be a non-negative number.');
const darkApproved = get('DARK_EXCEPTION_APPROVED');
if (darkScenes > 0 && darkApproved !== 'YES') fail('dark fullscreen scenes require DARK_EXCEPTION_APPROVED: YES.');
if (darkScenes > 0 && !get('DARK_EXCEPTION_REASON')) fail('dark fullscreen exception requires DARK_EXCEPTION_REASON.');
if (darkScenes === 0 && darkApproved !== 'NO') fail('with zero dark fullscreen scenes, DARK_EXCEPTION_APPROVED must be NO.');

const fast = Number(get('TOO_FAST_BEATS'));
if (!Number.isFinite(fast) || fast !== 0) fail('TOO_FAST_BEATS must be 0.');

const overloads = Number(get('SIMULTANEOUS_INFO_OVERLOADS'));
if (!Number.isFinite(overloads) || overloads !== 0) fail('SIMULTANEOUS_INFO_OVERLOADS must be 0.');

const minHold = Number(get('MIN_CRITICAL_HOLD_FRAMES'));
if (!Number.isFinite(minHold) || minHold < 12) fail('MIN_CRITICAL_HOLD_FRAMES must be at least 12 at 30 fps.');

if (get('POST_RENDER_1X_REVIEW') !== 'PASS') fail('POST_RENDER_1X_REVIEW must be PASS.');

console.log('MOTION READABILITY GATE PASSED');
console.log(`review: ${review}`);
console.log(`dark fullscreen scenes: ${darkScenes}`);
console.log(`minimum critical hold: ${minHold} frames`);
