#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {createReadStream, existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';

const [rawReelDir, rawVideo] = process.argv.slice(2);
if (!rawReelDir || !rawVideo) {
  console.error('Usage: node ki/scripts/validate-motion-readability-review.mjs <reel-package-dir> <reviewed-video.mp4>');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const video = path.resolve(rawVideo);
const review = path.join(reelDir, '06-projektdateien', 'MOTION-READABILITY-REVIEW.md');
const fail = (message) => { console.error(`MOTION READABILITY GATE FAILED: ${message}`); process.exit(1); };

if (!existsSync(review)) fail(`missing ${review}`);
if (!existsSync(video)) fail(`reviewed video missing: ${video}`);

const text = await readFile(review, 'utf8');
const get = (key) => {
  const match = text.match(new RegExp(`^${key}:\\s*(.+)$`, 'mi'));
  return match?.[1]?.trim() ?? null;
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

const expectedHash = get('REVIEWED_VIDEO_SHA256');
if (!expectedHash || !/^[a-f0-9]{64}$/i.test(expectedHash)) fail('REVIEWED_VIDEO_SHA256 must contain the exact reviewed MP4 hash.');

const hash = createHash('sha256');
await new Promise((resolve, reject) => {
  const stream = createReadStream(video);
  stream.on('data', (chunk) => hash.update(chunk));
  stream.on('end', resolve);
  stream.on('error', reject);
});
const actualHash = hash.digest('hex');
if (actualHash.toLowerCase() !== expectedHash.toLowerCase()) {
  fail('review file belongs to a different MP4/source render (SHA256 mismatch).');
}

const probe = spawnSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',video],{encoding:'utf8'});
if (probe.error) fail(`ffprobe could not start: ${probe.error.message}`);
if (probe.status !== 0) fail(`ffprobe failed: ${probe.stderr || probe.stdout}`);
const actualDuration = Number(probe.stdout.trim());
const reviewedDuration = Number(get('REVIEWED_VIDEO_DURATION_SECONDS'));
if (!Number.isFinite(reviewedDuration) || reviewedDuration <= 0) fail('REVIEWED_VIDEO_DURATION_SECONDS missing/invalid.');
if (!Number.isFinite(actualDuration) || Math.abs(actualDuration-reviewedDuration) > 0.12) {
  fail(`reviewed duration ${reviewedDuration}s does not match MP4 ${actualDuration}s.`);
}

console.log('MOTION READABILITY GATE PASSED');
console.log(`review: ${review}`);
console.log(`video: ${video}`);
console.log(`sha256: ${actualHash}`);
console.log(`duration: ${actualDuration.toFixed(3)} s`);
console.log(`dark fullscreen scenes: ${darkScenes}`);
console.log(`minimum critical hold: ${minHold} frames`);
