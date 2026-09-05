#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, readdir} from 'node:fs/promises';
import path from 'node:path';

const failures = [];
const fail = (message) => failures.push(message);
const read = async (file) => readFile(path.resolve(file), 'utf8');

const requiredFiles = [
  'ki/gehirn/AUDIO_PIPELINE.md',
  'ki/gehirn/FORCED_ALIGNMENT.md',
  'ki/gehirn/CAPTION_SAFE_POSITION.md',
  'ki/gehirn/VISUAL_ASSETS.md',
  'ki/src/reels/captionSafe.ts',
  'ki/src/reels/ReelSfxTrack.tsx',
  'ki/src/reels/ReelVisualMotion.tsx',
  'ki/src/reels/ReelExternalVisual.tsx',
  'ki/config/sfx-sources.json',
  'ki/config/visual-asset-sources.json',
  'ki/scripts/lib/render-provenance.mjs',
  'ki/scripts/prepare-reel-audio.mjs',
  'ki/scripts/setup-local-forced-aligner.mjs',
  'ki/scripts/python/align_words.py',
  'ki/scripts/align-reel-local.mjs',
  'ki/scripts/validate-local-forced-alignment.mjs',
  'ki/scripts/setup-reel-sfx-library.mjs',
  'ki/scripts/validate-reel-sfx-library.mjs',
  'ki/scripts/resolve-reel-sfx.mjs',
  'ki/scripts/validate-reel-sfx-plan.mjs',
  'ki/scripts/resolve-reel-visual-assets.mjs',
  'ki/scripts/validate-reel-visual-assets.mjs',
  'ki/scripts/master-reel-video.mjs',
  'ki/scripts/render-social-reel.mjs',
  'ki/scripts/validate-social-audio-master.mjs',
  'ki/scripts/lock-scene-timing-from-captions.mjs',
  'ki/scripts/prepare-reel-render.mjs',
  'ki/scripts/validate-scene-voice-map.mjs',
  'ki/scripts/validate-voice-locked-captions.mjs',
  'ki/scripts/validate-motion-readability-review.mjs',
  'ki/scripts/validate-final-video.mjs',
  'ki/scripts/finalize-reel-export.mjs',
  'ki/scripts/validate-reel-export-package.mjs',
  'scripts/new-ki-reel.mjs',
  'scripts/new-ki-reel-core.mjs',
  'scripts/apply-level-up-v4.mjs',
];
for (const file of requiredFiles) {
  if (!existsSync(path.resolve(file))) fail(`missing required production file: ${file}`);
}

const requireTokens = (label, source, tokens) => {
  for (const token of tokens) {
    if (!source.includes(token)) fail(`${label} missing contract token: ${token}`);
  }
};

const forbidTokens = (label, source, tokens) => {
  for (const token of tokens) {
    if (source.includes(token)) fail(`${label} contains obsolete/forbidden token: ${token}`);
  }
};

const extractNumber = (label, source, property) => {
  const match = source.match(new RegExp(`\\b${property}\\s*:\\s*(\\d+(?:\\.\\d+)?)`));
  if (!match) {
    fail(`${label} missing numeric property ${property}.`);
    return null;
  }
  return Number(match[1]);
};

// Root/runtime media contract.
const root = await read('ki/src/Root.tsx');
if (/from\s+['"][^'"]+\.(?:mp3|wav|m4a|mp4)['"]/i.test(root)) {
  fail('Root.tsx contains a static binary audio/video import.');
}
if (/https?:\/\//i.test(root)) fail('Root.tsx contains a remote media URL.');
requireTokens('Root.tsx', root, ['runtime-audio/', 'staticFile', '.wav']);

// Shared caption truth. Source is authoritative; docs are checked by repo:wiring-check.
const caption = await read('ki/src/reels/captionSafe.ts');
const captionBottom = extractNumber('captionSafe.ts', caption, 'bottom');
const captionInset = extractNumber('captionSafe.ts', caption, 'horizontalInset');
const captionMaxWidth = extractNumber('captionSafe.ts', caption, 'maxWidth');
if (captionBottom !== 330) fail(`captionSafe.ts bottom must be 330, got ${captionBottom}.`);
if (captionInset !== 76) fail(`captionSafe.ts horizontalInset must be 76, got ${captionInset}.`);
if (captionMaxWidth !== 928) fail(`captionSafe.ts maxWidth must be 928, got ${captionMaxWidth}.`);
requireTokens('captionSafe.ts', caption, [
  'REEL_CAPTION_GLASS_STYLE',
  'REEL_CAPTION_FONT_FAMILY',
  'fontFamily: REEL_CAPTION_FONT_FAMILY',
]);
forbidTokens('captionSafe.ts', caption, ['bottom: 250', 'horizontalInset: 104', 'maxWidth: 860']);

const activeContracts = [
  'AGENTS.md',
  'ki/AGENTS.md',
  'ki/gehirn/MASTER.md',
  'ki/gehirn/REELS.md',
  'ki/gehirn/CAPTION_SAFE_POSITION.md',
  'ki/gehirn/PRODUKTIONSABLAUF.md',
  'ki/reels/AGENTS.md',
  'ki/src/reels/AGENTS.md',
];
for (const file of activeContracts) {
  const text = await read(file);
  for (const obsolete of ['bottom: 520', 'bottom: 520px']) {
    if (text.includes(obsolete)) fail(`${file} still declares legacy ${obsolete} caption geometry.`);
  }
}

// Local-only runtime artifacts.
const ignore = await read('.gitignore');
requireTokens('.gitignore', ignore, [
  'public/runtime-audio/',
  'public/reel-sfx/',
  'public/reel-assets/',
  '.cache/',
]);

// Deterministic render-source scan.
const sourceFiles = [];
const walk = async (dir) => {
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (/\.(?:ts|tsx)$/i.test(entry.name)) sourceFiles.push(full);
  }
};
await walk(path.resolve('ki', 'src', 'reels'));
for (const file of sourceFiles) {
  const relative = path.relative(process.cwd(), file);
  const text = await readFile(file, 'utf8');
  if (/bottom\s*:\s*(?:250|264|270|360|440|460|500|520)\b/.test(text)) {
    fail(`${relative} contains a legacy hard-coded caption bottom value.`);
  }
  if (/from\s+['"][^'"]+\.(?:mp3|wav|m4a|aiff|mp4|mov)['"]/i.test(text)) {
    fail(`${relative} directly imports binary media.`);
  }
  if (text.includes('Math.random(')) fail(`${relative} uses Math.random() in deterministic render source.`);
}

// Audio preparation and local forced alignment.
const audioPrep = await read('ki/scripts/prepare-reel-audio.mjs');
requireTokens('prepare-reel-audio.mjs', audioPrep, [
  'pauseCompression',
  'silenceremove=',
  'maxReductionRatio',
  'silencedetect',
  'pacing.json',
]);
const audioDoc = await read('ki/gehirn/AUDIO_PIPELINE.md');
requireTokens('AUDIO_PIPELINE.md', audioDoc, [
  'Pause-Kompression',
  'Forced Alignment läuft erst nach dieser Pause-Kompression',
]);

const alignRunner = await read('ki/scripts/python/align_words.py');
requireTokens('align_words.py', alignRunner, [
  'mlx-community/Qwen3-ForcedAligner-0.6B-8bit',
  'facebook/wav2vec2-large-xlsr-53-german',
]);
if (alignRunner.includes('MahmoudAshraf/mms-300m-1130-forced-aligner')) {
  fail('production aligner references the noncommercial default MMS model.');
}
const setupAligner = await read('ki/scripts/setup-local-forced-aligner.mjs');
requireTokens('setup-local-forced-aligner.mjs', setupAligner, [
  'mlx-audio==0.5.0',
  '11855d1de76af2b490dd2e8e2db2661805ae90a0',
]);
const localGate = await read('ki/scripts/validate-local-forced-alignment.mjs');
requireTokens('validate-local-forced-alignment.mjs', localGate, [
  'fuzzyWordMatching',
  'PASSED',
  'Apache-2.0',
]);

// CC0 SFX pipeline.
const sfxSources = JSON.parse(await read('ki/config/sfx-sources.json'));
if (!Array.isArray(sfxSources?.packs) || sfxSources.packs.length < 5) {
  fail('SFX source allowlist must contain at least five curated packs.');
}
for (const pack of sfxSources?.packs || []) {
  if (pack.license !== 'CC0-1.0') fail(`SFX pack ${pack.id} is not CC0-1.0.`);
}
requireTokens('setup-reel-sfx-library.mjs', await read('ki/scripts/setup-reel-sfx-library.mjs'), [
  'CC0-1.0',
  'License.txt',
  'sfx-index.json',
  '48000',
  'pcm_s16le',
]);
requireTokens('resolve-reel-sfx.mjs', await read('ki/scripts/resolve-reel-sfx.mjs'), [
  'SFX_RESOLVED_CC0_AUTO',
  'DETERMINISTIC_ROLE_KEYWORD_DURATION_RANKING',
  'randomness:false',
  'voiceFirstVolumeCaps',
]);
requireTokens('validate-reel-sfx-plan.mjs', await read('ki/scripts/validate-reel-sfx-plan.mjs'), [
  'CC0-1.0',
  'SFX_RESOLVED_CC0_AUTO',
  '0.20',
]);
requireTokens('ReelSfxTrack.tsx', await read('ki/src/reels/ReelSfxTrack.tsx'), [
  'staticFile(event.staticFile)',
  'Html5Audio',
]);

// Visual provenance pipeline.
const visualPolicy = JSON.parse(await read('ki/config/visual-asset-sources.json'));
if (visualPolicy?.policy?.remoteMediaDuringRender !== false) {
  fail('visual source policy must forbid render-time remote media.');
}
if (visualPolicy?.policy?.googleImageSearchAsLicenseAuthority !== false) {
  fail('visual source policy must reject Google image search as license authority.');
}
if (
  !visualPolicy?.providers?.WIKIMEDIA_COMMONS?.enabled ||
  visualPolicy.providers.WIKIMEDIA_COMMONS.requiresApiKey !== false
) {
  fail('Wikimedia Commons provider must be enabled without an API key.');
}
requireTokens('resolve-reel-visual-assets.mjs', await read('ki/scripts/resolve-reel-visual-assets.mjs'), [
  'VISUAL_ASSETS_RESOLVED_LOCAL_LOCK',
  'selectionScore',
  'topCandidates',
  'rankedSelectionBeforeDownload',
  'PUBLIC_DOMAIN',
  'CC0-1.0',
]);
requireTokens('validate-reel-visual-assets.mjs', await read('ki/scripts/validate-reel-visual-assets.mjs'), [
  'local image SHA256 mismatch',
  'render-time remote URLs: forbidden',
  'ranked external selection: verified',
  'CC-BY-4.0',
]);
requireTokens('ReelExternalVisual.tsx', await read('ki/src/reels/ReelExternalVisual.tsx'), [
  'staticFile(staticSrc)',
  "rightsStatus === 'CC-BY-4.0'",
  'objectFit',
]);
requireTokens('ReelVisualMotion.tsx', await read('ki/src/reels/ReelVisualMotion.tsx'), [
  'CameraPush',
  'FocusHalo',
  'ScanSweep',
  'ParallaxFloat',
  'SourceProofCard',
]);

// Canonical social review render. Raw Remotion MP4 is not upload-ready.
const socialRenderer = await read('ki/scripts/render-social-reel.mjs');
requireTokens('render-social-reel.mjs', socialRenderer, [
  '--codec=h264',
  '--crf=18',
  '--audio-codec=aac',
  'master-reel-video.mjs',
  'validate-social-audio-master.mjs',
  'SOCIAL_REVIEW_MASTER_READY',
  'exactOneXVisualAudioReviewRequired',
]);

const audioMaster = await read('ki/scripts/master-reel-video.mjs');
requireTokens('master-reel-video.mjs', audioMaster, [
  'loudnorm=I=${targetI}',
  'targetI = -16',
  'targetTP = -1.5',
  "'-c:v', 'copy'",
  "'-c:a', 'aac'",
]);
const socialAudioGate = await read('ki/scripts/validate-social-audio-master.mjs');
requireTokens('validate-social-audio-master.mjs', socialAudioGate, [
  'loudnorm=I=-16:TP=-1.5:LRA=7',
  'integrated < -17.0',
  'integrated > -15.0',
  'truePeak > -1.0',
]);

// Render-lock and finalization provenance.
const prepare = await read('ki/scripts/prepare-reel-render.mjs');
requireTokens('prepare-reel-render.mjs', prepare, [
  'RENDER_LOCKED',
  'sourceTreeSha256',
  'validate-scene-voice-map.mjs',
  'sceneVoiceMapSha256',
  'validate-local-forced-alignment.mjs',
  'wordTimingsSha256',
  'validate-reel-sfx-plan.mjs',
  'sfxResolvedSha256',
  'validate-reel-visual-assets.mjs',
  'visualManifestSha256',
  'visualResolvedSha256',
]);

const lockScenes = await read('ki/scripts/lock-scene-timing-from-captions.mjs');
requireTokens('lock-scene-timing-from-captions.mjs', lockScenes, [
  'firstWordFrame',
  'finalDurationInFrames',
  'VOICE_LOCKED_SCENE_MAPPED',
]);

const finalize = await read('ki/scripts/finalize-reel-export.mjs');
requireTokens('finalize-reel-export.mjs', finalize, [
  'PASSED_LOCKED_INPUT_HASHES',
  'reviewedVideoSha256',
  'PASSED_EXACT_SCENE_TEXT_AND_ANCHORS',
  'sceneVoiceMapSha256',
  'PASSED_EXACT_KNOWN_TRANSCRIPT',
  'wordTimingsSha256',
  'PASSED_CC0_AUTO_RESOLVED_AND_LOCKED',
  'sfxResolvedSha256',
  'PASSED_RIGHTS_LOCAL_FILE_SHA256_AND_LOCK',
  'visualManifestSha256',
  'visualResolvedSha256',
  'validate-social-audio-master.mjs',
  'PASSED_MINUS16_LUFS',
]);
const exportGate = await read('ki/scripts/validate-reel-export-package.mjs');
requireTokens('validate-reel-export-package.mjs', exportGate, [
  'PASSED_MINUS16_LUFS',
  'validate-social-audio-master.mjs',
]);

// Generator split: wrapper owns week/day routing + v4 application; core owns scaffold files.
const generatorWrapper = await read('scripts/new-ki-reel.mjs');
requireTokens('new-ki-reel.mjs wrapper', generatorWrapper, [
  'new-ki-reel-core.mjs',
  '01_Montag',
  '06_Samstag',
  '07_Sonntag',
  'apply-level-up-v4.mjs',
  'Kanonisch: Woche → Wochentag',
]);
const generatorCore = await read('scripts/new-ki-reel-core.mjs');
requireTokens('new-ki-reel-core.mjs', generatorCore, [
  'SCENE-VOICE-MAP.json',
  'FIRST_MAPPED_WORD',
  'sfx-events.json',
  'sfx-resolved.json',
  'AUTO_CC0_DETERMINISTIC',
  'visual-assets.json',
  'visual-assets-resolved.json',
  'VISUAL-PLAN.md',
  'bottom 330',
]);

if (failures.length) {
  console.error('PRODUCTION CONTRACT AUDIT: FAILED');
  for (const issue of failures) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('PRODUCTION CONTRACT AUDIT: PASSED');
console.log(`checked required files: ${requiredFiles.length}`);
console.log(`checked active contracts: ${activeContracts.length}`);
console.log(`scanned reel source files: ${sourceFiles.length}`);
console.log('caption source: 330 / 76 / 928 + explicit shared sans-serif font');
console.log('generator: weekday wrapper + scaffold core + Level-Up v4 split verified');
console.log('review render: H.264 CRF18 -> -16 LUFS social master -> exact 1x review candidate');
console.log('forced alignment + scene voice + CC0 SFX + local visual provenance + final export locks: verified');
