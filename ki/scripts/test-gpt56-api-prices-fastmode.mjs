#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {createReadStream, existsSync} from 'node:fs';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const reelDir = path.resolve('ki/reels/2026-08-24_bis_2026-08-30/05_GPT-5-6-API-Preise-und-Fast-Mode');
const compositionId = 'KI-GPT56APIPricesFastMode';
const outputDir = path.resolve('out/gpt56-api-transfer-test');
const rawVideo = path.join(outputDir, `${compositionId}-raw-test.mp4`);
const masteredVideo = path.join(outputDir, `${compositionId}-mastered-test.mp4`);
const contactSheet = path.join(outputDir, `${compositionId}-contact-sheet.jpg`);
const reportPath = path.join(outputDir, 'TRANSFER-TEST-REPORT.json');
const voiceover = path.join(reelDir, '01-script-audio', 'voiceover.mp3');
const audioSource = path.join(reelDir, '01-script-audio', 'audio-source.json');

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

for (const binary of ['ffmpeg', 'ffprobe', 'git']) {
  const probe = spawnSync(binary, ['--version'], {encoding: 'utf8'});
  if (binary === 'git') {
    const gitProbe = spawnSync('git', ['--version'], {encoding: 'utf8'});
    if (gitProbe.error || gitProbe.status !== 0) fail('git is required.');
    continue;
  }
  if (probe.error || probe.status !== 0) fail(`${binary} is required.`);
}
if (!existsSync(path.resolve('node_modules/.bin/remotion'))) fail('node_modules/remotion missing. Run npm install once, then rerun.');
await mkdir(outputDir, {recursive: true});

// 0. Phase-1 duration contract must pass before any expensive work starts.
run('Validate Phase-1 script budget', process.execPath, [path.resolve('ki/scripts/validate-reel-script-budget.mjs'), reelDir]);

// 1. Exact generated voice source.
if (!existsSync(voiceover)) {
  run('Download generated voiceover', process.execPath, [path.resolve('ki/scripts/fetch-generated-voiceover.mjs'), audioSource, voiceover]);
}

// 2. Local CC0 library is needed because align-reel-local resolves SFX after scene lock.
if (!existsSync(path.resolve('public/reel-sfx/sfx-index.json'))) {
  run('Setup local CC0 SFX library', process.execPath, [path.resolve('ki/scripts/setup-reel-sfx-library.mjs')]);
}
run('Validate local CC0 SFX library', process.execPath, [path.resolve('ki/scripts/validate-reel-sfx-library.mjs')]);

// 3. Full fresh timing path: pause compression -> forced alignment -> captions/scenes -> SFX.
run('Full local forced alignment + scene/caption/SFX lock', process.execPath, [path.resolve('ki/scripts/align-reel-local.mjs'), reelDir]);

// 4. Ranked visual resolver: multiple candidates -> rights/quality/crop ranking -> local asset + SHA.
run('Resolve ranked visual assets', process.execPath, [path.resolve('ki/scripts/resolve-reel-visual-assets.mjs'), reelDir]);
run('Validate visual assets', process.execPath, [path.resolve('ki/scripts/validate-reel-visual-assets.mjs'), reelDir]);
run('Validate source isolation', process.execPath, [path.resolve('ki/scripts/validate-reel-source-isolation.mjs'), reelDir]);

// 5. Global contracts and focused source tests.
run('Global production contract audit', 'npm', ['run', 'production:contracts']);
run('Typecheck Remotion source', 'npm', ['run', 'typecheck:motion']);
run('GPT-5.6 reel contract test', 'npx', ['--no-install', 'vitest', 'run', 'ki/src/reels/gpt56-api-prices-fastmode/contract.test.ts']);

// Production provenance deliberately requires tracked timing/contract files to be committed.
// A fresh alignment commonly changes tracked JSON. Do not bypass this with a dirty-worktree flag.
const trackedStatus = capture('git', ['status', '--porcelain', '--untracked-files=no']);
if (trackedStatus) {
  const preparedReport = {
    status: 'PREPARED_REQUIRES_COMMIT_BEFORE_PRODUCTION_RENDER',
    compositionId,
    reelDir,
    trackedChanges: trackedStatus.split(/\r?\n/).filter(Boolean),
    checksPassed: [
      'script budget',
      'generated voice availability',
      'local CC0 SFX library',
      'pause compression',
      'fresh local forced alignment',
      'scene/voice lock',
      'voice-locked captions',
      'deterministic CC0 SFX resolution',
      'ranked visual resolution',
      'visual rights/local-file/SHA256 gate',
      'source isolation',
      'global production contract audit',
      'TypeScript motion typecheck',
      'focused reel contract test',
    ],
    nextStep: 'Review the generated tracked timing/contract files, commit them on the test branch, then rerun this same command. The second run must reach prepare-reel-render.mjs on a clean worktree.',
    generatedAt: new Date().toISOString(),
  };
  await writeFile(reportPath, `${JSON.stringify(preparedReport, null, 2)}\n`, 'utf8');
  console.log('\nTRANSFER TEST PREPARED — COMMIT REQUIRED BEFORE PRODUCTION RENDER');
  console.log(trackedStatus);
  console.log(`report: ${reportPath}`);
  console.log('After reviewing and committing these generated tracked files, rerun the same command.');
  process.exit(2);
}

// 6. Real production pre-render gate including render provenance lock.
run('Production pre-render + provenance lock', process.execPath, [path.resolve('ki/scripts/prepare-reel-render.mjs'), reelDir]);

// 7. Raw Remotion render. Not final; audio master happens next.
run('Render raw transfer-test MP4', 'npx', ['--no-install', 'remotion', 'render', 'ki/src/index.ts', compositionId, rawVideo, '--overwrite']);

// 8. Full-mix social master.
run('Master complete Voice + SFX mix', process.execPath, [path.resolve('ki/scripts/master-reel-video.mjs'), rawVideo, masteredVideo]);
run('Validate -16 LUFS social master', process.execPath, [path.resolve('ki/scripts/validate-social-audio-master.mjs'), masteredVideo]);
run('Technical A/V gate on mastered MP4', process.execPath, [path.resolve('ki/scripts/validate-final-video.mjs'), masteredVideo]);

// 9. Contact sheet from the exact mastered video that must be reviewed.
run('Create mastered contact sheet', 'ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-i', masteredVideo,
  '-vf', 'fps=1/4,scale=270:-1,tile=2x5',
  '-frames:v', '1',
  contactSheet,
]);

const probe = spawnSync('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration',
  '-of', 'default=noprint_wrappers=1:nokey=1', masteredVideo,
], {encoding: 'utf8'});
if (probe.error || probe.status !== 0) fail('could not read mastered duration.');
const durationSeconds = Number(String(probe.stdout).trim());
const videoSha256 = await sha256File(masteredVideo);

const sfx = JSON.parse(await readFile(path.join(reelDir, '06-projektdateien', 'sfx-resolved.json'), 'utf8'));
const visuals = JSON.parse(await readFile(path.join(reelDir, '06-projektdateien', 'visual-assets-resolved.json'), 'utf8'));
const external = (visuals.assets || []).filter((asset) => asset.localFile);
const report = {
  status: 'PRODUCTION_PATH_MASTERED_READY_FOR_1X_REVIEW_NOT_FINAL',
  compositionId,
  rawVideo,
  masteredVideo,
  contactSheet,
  durationSeconds: Number(durationSeconds.toFixed(6)),
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
    'generated voice download',
    'pause compression',
    'fresh local forced alignment',
    'scene/voice lock',
    'voice-locked captions',
    'deterministic CC0 SFX resolution',
    'ranked Wikimedia visual resolution',
    'visual rights/local-file/SHA256 gate',
    'source isolation',
    'global production contract audit',
    'TypeScript motion typecheck',
    'focused reel contract test',
    'clean tracked worktree',
    'production pre-render gate',
    'render provenance lock',
    'raw Remotion render',
    '-16 LUFS social audio master',
    'technical final-video gate on mastered MP4',
  ],
  humanReviewRequired: [
    'pacing',
    'caption sync',
    'SFX timing and loudness',
    'native/external visual balance',
    'selected real image relevance and crop',
    'camera push/pan/focus/parallax readability',
    '2.5x speed beat',
    '2x cost tradeoff',
    'priority routing',
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
console.log(`duration: ${durationSeconds.toFixed(3)} s`);
console.log(`SFX events: ${report.sfxEvents}`);
console.log(`external visuals: ${report.externalVisuals.length}`);
console.log('Next: review exactly the mastered MP4 at 1x, bind MOTION-READABILITY-REVIEW.md to this SHA256, then use the normal finalizer/export gates.');
