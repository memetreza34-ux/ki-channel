#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {createReadStream, existsSync} from 'node:fs';
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const renderLockedMode = process.argv.includes('--render-locked');
const reelDir = path.resolve('ki/reels/2026-08-24_bis_2026-08-30/05_GPT-5-6-API-Preise-und-Fast-Mode');
const compositionId = 'KI-GPT56APIPricesFastMode';
const outputDir = path.resolve('out/gpt56-api-transfer-test');
const bundleDir = path.join(outputDir, 'remotion-bundle');
const rawVideo = path.join(outputDir, `${compositionId}-raw-test.mp4`);
const masteredVideo = path.join(outputDir, `${compositionId}-mastered-test.mp4`);
const contactSheet = path.join(outputDir, `${compositionId}-contact-sheet.jpg`);
const reportPath = path.join(outputDir, 'TRANSFER-TEST-REPORT.json');
const voiceover = path.join(reelDir, '01-script-audio', 'voiceover.mp3');

const fail = (message, exitCode = 1) => {
  console.error(`GPT-5.6 API TRANSFER TEST FAILED: ${message}`);
  process.exit(exitCode);
};

const run = (label, command, args, options = {}) => {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, {encoding: 'utf8', stdio: 'inherit', ...options});
  if (result.error || result.status !== 0) fail(`${label}${result.error ? `: ${result.error.message}` : ` exited with ${result.status}`}`);
};

const capture = (command, args) => {
  const result = spawnSync(command, args, {encoding: 'utf8'});
  if (result.error || result.status !== 0) fail(`${command} ${args.join(' ')} failed: ${result.stderr || result.stdout || result.error?.message}`);
  return String(result.stdout || '').trim();
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
const gitProbe = spawnSync('git', ['--version'], {encoding: 'utf8'});
if (gitProbe.error || gitProbe.status !== 0) fail('git is required.');
if (!existsSync(path.resolve('node_modules/.bin/remotion'))) fail('node_modules/remotion missing. Run npm install once, then rerun.');
await mkdir(outputDir, {recursive: true});

// 0. Phase-1 duration contract must pass before any expensive work starts.
run('Validate Phase-1 script budget', process.execPath, [path.resolve('ki/scripts/validate-reel-script-budget.mjs'), reelDir]);

// 1. Voiceover is USER-ONLY. Agents must never generate or download it.
if (!existsSync(voiceover)) {
  fail(`USER AUDIO REQUIRED: Erstelle das vollständige Voiceover selbst und lege es hier ab: ${voiceover}. Kein Agent darf das Audio erzeugen oder herunterladen.`);
}
const userAudioDuration = Number(capture('ffprobe', [
  '-v', 'error',
  '-show_entries', 'format=duration',
  '-of', 'default=noprint_wrappers=1:nokey=1',
  voiceover,
]));
if (!Number.isFinite(userAudioDuration) || userAudioDuration <= 0) fail(`user-provided voiceover is unreadable: ${voiceover}`);
console.log(`\n=== User audio gate ===\nvoiceover: ${voiceover}\nsource duration: ${userAudioDuration.toFixed(3)} s`);

// 2. Local CC0 library. Binary assets stay local/ignored.
if (!existsSync(path.resolve('public/reel-sfx/sfx-index.json'))) {
  run('Setup local CC0 SFX library', process.execPath, [path.resolve('ki/scripts/setup-reel-sfx-library.mjs')]);
}
run('Validate local CC0 SFX library', process.execPath, [path.resolve('ki/scripts/validate-reel-sfx-library.mjs')]);

if (!renderLockedMode) {
  // PREP MODE intentionally creates/updates tracked timing and resolved-contract files.
  run('Full local forced alignment + scene/caption/SFX lock', process.execPath, [path.resolve('ki/scripts/align-reel-local.mjs'), reelDir]);
  run('Resolve ranked visual assets', process.execPath, [path.resolve('ki/scripts/resolve-reel-visual-assets.mjs'), reelDir]);
} else {
  console.log('\n=== Render-locked mode ===');
  console.log('Skipping alignment and visual resolution so committed timing/contract files remain byte-stable.');
}

run('Validate local forced alignment', process.execPath, [path.resolve('ki/scripts/validate-local-forced-alignment.mjs'), reelDir]);
run('Validate scene/voice map', process.execPath, [path.resolve('ki/scripts/validate-scene-voice-map.mjs'), reelDir]);
run('Validate voice-locked captions', process.execPath, [path.resolve('ki/scripts/validate-voice-locked-captions.mjs'), reelDir]);
run('Validate SFX plan', process.execPath, [path.resolve('ki/scripts/validate-reel-sfx-plan.mjs'), reelDir]);
run('Validate visual assets', process.execPath, [path.resolve('ki/scripts/validate-reel-visual-assets.mjs'), reelDir]);
run('Validate source isolation', process.execPath, [path.resolve('ki/scripts/validate-reel-source-isolation.mjs'), reelDir]);

run('Full canonical repository verification', 'npm', ['run', 'repo:verify']);
run('Full motion-system verification', 'npm', ['run', 'motion:verify']);
run('GPT-5.6 focused reel contract test', 'npx', ['--no-install', 'vitest', 'run', 'ki/src/reels/gpt56-api-prices-fastmode/contract.test.ts']);

const compositionList = capture('npx', ['--no-install', 'remotion', 'compositions', 'ki/src/index.ts', '--quiet']);
const compositionIds = compositionList.split(/\s+/).filter(Boolean);
if (!compositionIds.includes(compositionId)) {
  fail(`Remotion compositions gate did not resolve ${compositionId}. Resolved: ${compositionIds.join(', ') || '(none)'}`);
}
console.log(`\n=== Remotion composition gate ===\nresolved: ${compositionId}`);

await rm(bundleDir, {recursive: true, force: true});
run('Build fresh Remotion bundle', 'npx', ['--no-install', 'remotion', 'bundle', 'ki/src/index.ts', '--out-dir', bundleDir, '--log', 'error']);
if (!existsSync(bundleDir)) fail(`Remotion bundle directory was not created: ${bundleDir}`);

const trackedStatus = capture('git', ['status', '--porcelain', '--untracked-files=no']);
if (trackedStatus) {
  const preparedReport = {
    status: 'PREPARED_REQUIRES_COMMIT_BEFORE_PRODUCTION_RENDER',
    compositionId,
    reelDir,
    mode: renderLockedMode ? 'render-locked' : 'prepare',
    trackedChanges: trackedStatus.split(/\r?\n/).filter(Boolean),
    checksPassed: [
      'script budget',
      'user-provided voiceover availability',
      'local CC0 SFX library',
      'local forced alignment validation',
      'scene/voice map validation',
      'voice-locked captions',
      'deterministic CC0 SFX validation',
      'visual rights/local-file/SHA256 gate',
      'source isolation',
      'full repo:verify',
      'full motion:verify',
      'focused GPT-5.6 reel test',
      'Remotion composition resolution',
      'fresh Remotion bundle',
    ],
    nextStep: renderLockedMode
      ? 'Render-locked mode requires a clean tracked worktree. Review and commit/revert the listed changes, then rerun with --render-locked.'
      : 'Review the generated tracked timing/contract files, commit them on the test branch, then rerun with --render-locked. That mode does not regenerate timing/visual contracts and can reach the provenance lock on a clean worktree.',
    generatedAt: new Date().toISOString(),
  };
  await writeFile(reportPath, `${JSON.stringify(preparedReport, null, 2)}\n`, 'utf8');
  console.log('\nTRANSFER TEST PREPARED — CLEAN COMMIT REQUIRED BEFORE PRODUCTION RENDER');
  console.log(trackedStatus);
  console.log(`report: ${reportPath}`);
  if (!renderLockedMode) console.log('After review + commit: node ki/scripts/test-gpt56-api-prices-fastmode.mjs --render-locked');
  process.exit(2);
}

if (!renderLockedMode) {
  console.log('\nPREP MODE PRODUCED NO TRACKED CHANGES — continuing into render-locked production test.');
}

run('Production pre-render + provenance lock', process.execPath, [path.resolve('ki/scripts/prepare-reel-render.mjs'), reelDir]);
run('Render raw transfer-test MP4', 'npx', ['--no-install', 'remotion', 'render', 'ki/src/index.ts', compositionId, rawVideo, '--overwrite']);
run('Master complete Voice + SFX mix', process.execPath, [path.resolve('ki/scripts/master-reel-video.mjs'), rawVideo, masteredVideo]);
run('Validate -16 LUFS social master', process.execPath, [path.resolve('ki/scripts/validate-social-audio-master.mjs'), masteredVideo]);
run('Technical A/V gate on mastered MP4', process.execPath, [path.resolve('ki/scripts/validate-final-video.mjs'), masteredVideo]);

run('Create mastered contact sheet', 'ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-i', masteredVideo,
  '-vf', 'fps=1/5,scale=270:-1,tile=3x5',
  '-frames:v', '1',
  contactSheet,
]);

const probe = spawnSync('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration',
  '-of', 'default=noprint_wrappers=1:nokey=1', masteredVideo,
], {encoding: 'utf8'});
if (probe.error || probe.status !== 0) fail('could not read mastered duration.');
const durationSeconds = Number(String(probe.stdout).trim());
if (!Number.isFinite(durationSeconds)) fail('mastered duration is invalid.');
if (durationSeconds < 60 || durationSeconds > 75) fail(`mastered duration ${durationSeconds.toFixed(3)} s is outside required 60-75 s.`);
const videoSha256 = await sha256File(masteredVideo);

const sfx = JSON.parse(await readFile(path.join(reelDir, '06-projektdateien', 'sfx-resolved.json'), 'utf8'));
const visuals = JSON.parse(await readFile(path.join(reelDir, '06-projektdateien', 'visual-assets-resolved.json'), 'utf8'));
const external = (visuals.assets || []).filter((asset) => asset.localFile);
const report = {
  status: 'PRODUCTION_PATH_MASTERED_READY_FOR_1X_REVIEW_NOT_FINAL',
  compositionId,
  mode: renderLockedMode ? 'render-locked' : 'prepare-no-diff-auto-continued',
  rawVideo,
  masteredVideo,
  contactSheet,
  bundleDir,
  userSourceAudioDurationSeconds: Number(userAudioDuration.toFixed(6)),
  durationSeconds: Number(durationSeconds.toFixed(6)),
  durationContractSeconds: {min: 60, max: 75},
  masteredVideoSha256: videoSha256,
  gitCommitSha: capture('git', ['rev-parse', 'HEAD']),
  sfxEvents: Array.isArray(sfx.events) ? sfx.events.length : 0,
  externalVisuals: external.map((asset) => ({
    id: asset.id,
    selectedTitle: asset.selectedTitle,
    rightsStatus: asset.rightsStatus,
    selectionScore: asset.selectionScore,
    staticFile: asset.staticFile,
  })),
  checksPassed: [
    'script budget',
    'user-provided voiceover availability',
    'local CC0 SFX library',
    'exact local forced-alignment validation',
    'scene/voice lock',
    'voice-locked captions',
    'deterministic CC0 SFX validation',
    'ranked/local visual validation',
    'visual rights/local-file/SHA256 gate',
    'source isolation',
    'full repo:verify',
    'full motion:verify',
    'focused GPT-5.6 reel test',
    'Remotion composition resolution',
    'fresh Remotion bundle',
    'clean tracked worktree',
    'production pre-render gate',
    '60-75 second voice-locked duration gate',
    'render provenance lock',
    'raw Remotion render',
    '-16 LUFS social audio master',
    'technical final-video gate on mastered MP4',
    '60-75 second mastered-video duration gate',
  ],
  humanReviewRequired: [
    'pacing across the full 60-75 seconds',
    'caption sync',
    'SFX timing and loudness across the full timeline',
    'native/external visual balance',
    'selected real image relevance and crop',
    'camera push/pan/focus/parallax readability',
    'developer workflow beat',
    '2.5x speed beat',
    '2x cost tradeoff',
    'priority routing',
    'integration remains intact beat',
    'final cheaper-versus-faster payoff',
    'source-proof readability',
    'overall mastered loudness',
  ],
  finalizationAllowed: false,
  note: 'Review exactly the mastered MP4 at 1x. After the human motion review is bound to this exact SHA256, run the normal finalizer/export-package gates. Do not review or finalize the raw Remotion render.',
  generatedAt: new Date().toISOString(),
};
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log('\nGPT-5.6 PRODUCTION-PATH TEST READY — MASTERED, NOT FINAL');
console.log(`mastered video: ${masteredVideo}`);
console.log(`contact sheet: ${contactSheet}`);
console.log(`sha256: ${videoSha256}`);
console.log(`duration: ${durationSeconds.toFixed(3)} s (required 60-75 s)`);
console.log(`SFX events: ${report.sfxEvents}`);
console.log(`external visuals: ${report.externalVisuals.length}`);
console.log('Next: review exactly the mastered MP4 at 1x, bind MOTION-READABILITY-REVIEW.md to this SHA256, then use the normal finalizer/export gates.');
