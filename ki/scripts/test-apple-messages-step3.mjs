#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {createReadStream, existsSync} from 'node:fs';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const reelDir = path.resolve('ki/reels/2026-08-24_bis_2026-08-30/05_ChatGPT-Apple-Messages-auf-dem-Mac');
const compositionId = 'KI-AppleMessagesChatGPT';
const outputDir = path.resolve('out/step3-apple-messages-test');
const video = path.join(outputDir, `${compositionId}-step3-test.mp4`);
const contactSheet = path.join(outputDir, `${compositionId}-step3-contact-sheet.jpg`);
const reportPath = path.join(outputDir, 'STEP3-TEST-REPORT.json');
const voiceover = path.join(reelDir, '01-script-audio', 'voiceover.mp3');
const audioSource = path.join(reelDir, '01-script-audio', 'audio-source.json');

const fail = (message) => {
  console.error(`STEP3 APPLE-MESSAGES TEST FAILED: ${message}`);
  process.exit(1);
};

const run = (label, command, args, options = {}) => {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, {encoding: 'utf8', stdio: 'inherit', ...options});
  if (result.error || result.status !== 0) {
    fail(`${label}${result.error ? `: ${result.error.message}` : ` exited with ${result.status}`}`);
  }
};

const sha256File = async (file) => {
  const hash = createHash('sha256');
  await new Promise((resolve, reject) => {
    const stream = createReadStream(file);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', resolve);
    stream.on('error', reject);
  });
  return hash.digest('hex');
};

for (const binary of ['ffmpeg', 'ffprobe']) {
  const probe = spawnSync(binary, ['-version'], {encoding: 'utf8'});
  if (probe.error || probe.status !== 0) fail(`${binary} is required.`);
}
if (!existsSync(path.resolve('node_modules/.bin/remotion'))) {
  fail('node_modules/remotion missing. Run npm install once, then rerun this test.');
}

await mkdir(outputDir, {recursive: true});

// 1) Recreate the exact canonical local voice source when the ignored MP3 is missing.
if (!existsSync(voiceover)) {
  run('Download generated voiceover', process.execPath, [
    path.resolve('ki/scripts/fetch-generated-voiceover.mjs'),
    audioSource,
    voiceover,
  ]);
}

// 2) Recreate the pause-compressed PCM runtime authority from the canonical voiceover.
run('Prepare pause-compressed runtime audio', process.execPath, [
  path.resolve('ki/scripts/prepare-reel-audio.mjs'),
  reelDir,
]);

// 3) Do not rerun ML alignment for a pure Step-3 visual test; verify the committed lock instead.
run('Validate committed forced alignment', process.execPath, [
  path.resolve('ki/scripts/validate-local-forced-alignment.mjs'),
  reelDir,
]);
run('Validate scene/voice map', process.execPath, [
  path.resolve('ki/scripts/validate-scene-voice-map.mjs'),
  reelDir,
]);
run('Validate voice-locked captions', process.execPath, [
  path.resolve('ki/scripts/validate-voice-locked-captions.mjs'),
  reelDir,
]);

// 4) Restore/verify the complete local CC0 library, then resolve the nine semantic events.
if (!existsSync(path.resolve('public/reel-sfx/sfx-index.json'))) {
  run('Setup local CC0 SFX library', process.execPath, [path.resolve('ki/scripts/setup-reel-sfx-library.mjs')]);
}
run('Validate local CC0 SFX library', process.execPath, [path.resolve('ki/scripts/validate-reel-sfx-library.mjs')]);
run('Resolve reel SFX against final scene frames', process.execPath, [path.resolve('ki/scripts/resolve-reel-sfx.mjs'), reelDir]);
run('Validate resolved SFX', process.execPath, [path.resolve('ki/scripts/validate-reel-sfx-plan.mjs'), reelDir]);

// 5) Step-3 visual/source contract.
run('Validate Step-3 visual assets', process.execPath, [path.resolve('ki/scripts/validate-reel-visual-assets.mjs'), reelDir]);
run('Validate source isolation', process.execPath, [path.resolve('ki/scripts/validate-reel-source-isolation.mjs'), reelDir]);

// 6) Compile/test the actual Remotion reel before rendering.
run('Typecheck Remotion source', 'npm', ['run', 'typecheck:motion']);
run('Apple Messages contract test', 'npx', [
  '--no-install',
  'vitest',
  'run',
  'ki/src/reels/apple-messages-chatgpt/contract.test.ts',
]);

// 7) TEST render. This deliberately bypasses the production provenance/final-review gate.
// It is for visual comparison only and may never be handed off as FINAL.
run('Render Step-3 comparison MP4', 'npx', [
  '--no-install',
  'remotion',
  'render',
  'ki/src/index.ts',
  compositionId,
  video,
  '--overwrite',
]);
run('Technical A/V gate on test MP4', process.execPath, [path.resolve('ki/scripts/validate-final-video.mjs'), video]);

// 8) Create an immediate visual overview for the 1x review.
run('Create Step-3 contact sheet', 'ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-i', video,
  '-vf', 'fps=1/3,scale=270:-1,tile=2x5',
  '-frames:v', '1',
  contactSheet,
]);

const probe = spawnSync('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration',
  '-of', 'default=noprint_wrappers=1:nokey=1', video,
], {encoding: 'utf8'});
if (probe.error || probe.status !== 0) fail('could not read rendered test duration.');
const durationSeconds = Number(String(probe.stdout).trim());
const videoSha256 = await sha256File(video);

const sfx = JSON.parse(await readFile(path.join(reelDir, '06-projektdateien', 'sfx-resolved.json'), 'utf8'));
const visualAssets = JSON.parse(await readFile(path.join(reelDir, '06-projektdateien', 'visual-assets.json'), 'utf8'));
const report = {
  status: 'STEP3_TEST_RENDER_READY_FOR_HUMAN_REVIEW_NOT_FINAL',
  compositionId,
  video,
  contactSheet,
  durationSeconds: Number(durationSeconds.toFixed(6)),
  videoSha256,
  sfxEvents: Array.isArray(sfx.events) ? sfx.events.length : 0,
  visualAssets: Array.isArray(visualAssets.assets) ? visualAssets.assets.length : 0,
  checksPassed: [
    'pause-compressed runtime audio',
    'committed forced-alignment contract',
    'scene/voice mapping',
    'voice-locked captions',
    'local CC0 SFX library',
    'deterministic SFX resolution',
    'visual asset rights/local-render gate',
    'source isolation',
    'TypeScript motion typecheck',
    'Apple Messages contract test',
    'technical final-video A/V gate',
  ],
  humanReviewRequired: [
    'pacing',
    'caption sync',
    'SFX timing',
    'SFX loudness',
    'zoom strength',
    'focus halo quality',
    'visual overload',
    'source-proof readability',
  ],
  finalizationAllowed: false,
  note: 'This test intentionally does not create a production render lock or overwrite MOTION-READABILITY-REVIEW.md. Review the exact MP4 first.',
  generatedAt: new Date().toISOString(),
};
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log('\nSTEP3 TEST RENDER READY — NOT FINAL');
console.log(`video: ${video}`);
console.log(`contact sheet: ${contactSheet}`);
console.log(`sha256: ${videoSha256}`);
console.log(`duration: ${durationSeconds.toFixed(3)} s`);
console.log(`SFX events: ${report.sfxEvents}`);
console.log('Next: watch this exact MP4 at 1x and fill MOTION-READABILITY-REVIEW.md only after the review.');
