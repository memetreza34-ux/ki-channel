#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, readdir} from 'node:fs/promises';
import path from 'node:path';

const fail = [];
const mustExist = [
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
  'ki/scripts/lock-scene-timing-from-captions.mjs',
  'ki/scripts/prepare-reel-render.mjs',
  'ki/scripts/validate-scene-voice-map.mjs',
  'ki/scripts/validate-voice-locked-captions.mjs',
  'ki/scripts/validate-motion-readability-review.mjs',
  'ki/scripts/validate-final-video.mjs',
  'ki/scripts/finalize-reel-export.mjs',
  'ki/scripts/validate-reel-export-package.mjs',
];
for (const file of mustExist) if (!existsSync(path.resolve(file))) fail.push(`missing required production file: ${file}`);

const read = async (file) => readFile(path.resolve(file), 'utf8');
const root = await read('ki/src/Root.tsx');
if (/from\s+['"][^'"]+\.(?:mp3|wav|m4a|mp4)['"]/i.test(root)) fail.push('Root.tsx contains a static binary audio/video import.');
if (/https?:\/\//i.test(root)) fail.push('Root.tsx contains a remote media URL.');
if (!root.includes('runtime-audio/') || !root.includes('staticFile') || !root.includes('.wav')) fail.push('Root.tsx is not wired to PCM WAV runtime audio via staticFile.');

const caption = await read('ki/src/reels/captionSafe.ts');
for (const [needle, label] of [
  ['bottom: 250', 'caption bottom 250'],
  ['horizontalInset: 104', 'caption horizontal inset 104'],
  ['maxWidth: 860', 'caption max width 860'],
  ['REEL_CAPTION_GLASS_STYLE', 'shared glass caption style'],
]) if (!caption.includes(needle)) fail.push(`captionSafe.ts missing ${label}.`);

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
  if (text.includes('bottom: 520') || text.includes('bottom: 520px')) fail.push(`${file} still declares legacy bottom:520 caption geometry.`);
}

const ignore = await read('.gitignore');
if (!ignore.includes('public/runtime-audio/')) fail.push('.gitignore does not ignore public/runtime-audio/.');
if (!ignore.includes('public/reel-sfx/')) fail.push('.gitignore does not ignore public/reel-sfx/.');
if (!ignore.includes('public/reel-assets/')) fail.push('.gitignore does not ignore public/reel-assets/.');
if (!ignore.includes('.cache/')) fail.push('.gitignore does not ignore local aligner/model cache work.');

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
  if (/bottom\s*:\s*(?:264|270|360|440|460|500|520)\b/.test(text)) fail.push(`${relative} contains a legacy hard-coded caption bottom value.`);
  if (/from\s+['"][^'"]+\.(?:mp3|wav|m4a|aiff|mp4|mov)['"]/i.test(text)) fail.push(`${relative} directly imports binary media.`);
  if (text.includes('Math.random(')) fail.push(`${relative} uses Math.random() in deterministic render source.`);
}

const audioPrep = await read('ki/scripts/prepare-reel-audio.mjs');
for (const needle of ['pauseCompression', 'silenceremove=', 'maxReductionRatio', 'silencedetect', 'pacing.json']) {
  if (!audioPrep.includes(needle)) fail.push(`prepare-reel-audio.mjs missing pause-compression contract token: ${needle}`);
}
const audioDoc = await read('ki/gehirn/AUDIO_PIPELINE.md');
if (!audioDoc.includes('Pause-Kompression') || !audioDoc.includes('Forced Alignment läuft erst nach dieser Pause-Kompression')) fail.push('AUDIO_PIPELINE.md does not make pause compression precede forced alignment.');

const alignRunner = await read('ki/scripts/python/align_words.py');
if (!alignRunner.includes('mlx-community/Qwen3-ForcedAligner-0.6B-8bit')) fail.push('Apple-Silicon forced aligner model is missing.');
if (!alignRunner.includes('facebook/wav2vec2-large-xlsr-53-german')) fail.push('commercial-safe German CTC fallback model is missing.');
if (alignRunner.includes('MahmoudAshraf/mms-300m-1130-forced-aligner')) fail.push('production aligner references the noncommercial default MMS model.');

const setupAligner = await read('ki/scripts/setup-local-forced-aligner.mjs');
if (!setupAligner.includes('mlx-audio==0.5.0') || !setupAligner.includes('11855d1de76af2b490dd2e8e2db2661805ae90a0')) fail.push('local aligner dependencies are not pinned.');
const localGate = await read('ki/scripts/validate-local-forced-alignment.mjs');
if (!localGate.includes('fuzzyWordMatching') || !localGate.includes('PASSED') || !localGate.includes('Apache-2.0')) fail.push('local forced-alignment gate is incomplete.');

const sfxSources = JSON.parse(await read('ki/config/sfx-sources.json'));
if (!Array.isArray(sfxSources?.packs) || sfxSources.packs.length < 5) fail.push('SFX source allowlist must contain at least five curated packs.');
for (const pack of sfxSources?.packs || []) if (pack.license !== 'CC0-1.0') fail.push(`SFX pack ${pack.id} is not CC0-1.0.`);
const sfxSetup = await read('ki/scripts/setup-reel-sfx-library.mjs');
for (const needle of ['CC0-1.0', 'License.txt', 'sfx-index.json', '48000', 'pcm_s16le']) if (!sfxSetup.includes(needle)) fail.push(`SFX setup missing contract token: ${needle}`);
const sfxResolver = await read('ki/scripts/resolve-reel-sfx.mjs');
for (const needle of ['SFX_RESOLVED_CC0_AUTO', 'DETERMINISTIC_ROLE_KEYWORD_DURATION_RANKING', 'randomness:false', 'voiceFirstVolumeCaps']) if (!sfxResolver.includes(needle)) fail.push(`SFX resolver missing contract token: ${needle}`);
const sfxGate = await read('ki/scripts/validate-reel-sfx-plan.mjs');
for (const needle of ['CC0-1.0', 'SFX_RESOLVED_CC0_AUTO', '0.20']) if (!sfxGate.includes(needle)) fail.push(`SFX gate missing contract token: ${needle}`);
const sfxTrack = await read('ki/src/reels/ReelSfxTrack.tsx');
if (!sfxTrack.includes('staticFile(event.staticFile)') || !sfxTrack.includes('Html5Audio')) fail.push('ReelSfxTrack.tsx does not render local static SFX assets.');

const visualPolicy = JSON.parse(await read('ki/config/visual-asset-sources.json'));
if (visualPolicy?.policy?.remoteMediaDuringRender !== false) fail.push('visual source policy must forbid render-time remote media.');
if (visualPolicy?.policy?.googleImageSearchAsLicenseAuthority !== false) fail.push('visual source policy must reject Google image search as license authority.');
if (!visualPolicy?.providers?.WIKIMEDIA_COMMONS?.enabled || visualPolicy.providers.WIKIMEDIA_COMMONS.requiresApiKey !== false) fail.push('Wikimedia Commons provider must be enabled without an API key.');
const visualResolver = await read('ki/scripts/resolve-reel-visual-assets.mjs');
for (const needle of ['VISUAL_ASSETS_RESOLVED_LOCAL_LOCK', 'selectionScore', 'topCandidates', 'rankedSelectionBeforeDownload', 'PUBLIC_DOMAIN', 'CC0-1.0']) if (!visualResolver.includes(needle)) fail.push(`visual resolver missing contract token: ${needle}`);
const visualGate = await read('ki/scripts/validate-reel-visual-assets.mjs');
for (const needle of ['local image SHA256 mismatch', 'render-time remote URLs: forbidden', 'ranked external selection: verified', 'CC-BY-4.0']) if (!visualGate.includes(needle)) fail.push(`visual gate missing contract token: ${needle}`);
const externalVisual = await read('ki/src/reels/ReelExternalVisual.tsx');
if (!externalVisual.includes('staticFile(staticSrc)') || !externalVisual.includes("rightsStatus === 'CC-BY-4.0'") || !externalVisual.includes('objectFit')) fail.push('ReelExternalVisual.tsx does not enforce local smart-crop and rights-aware credit behavior.');
const visualMotion = await read('ki/src/reels/ReelVisualMotion.tsx');
for (const needle of ['CameraPush', 'FocusHalo', 'ScanSweep', 'ParallaxFloat', 'SourceProofCard']) if (!visualMotion.includes(needle)) fail.push(`ReelVisualMotion.tsx missing ${needle}.`);

const prepare = await read('ki/scripts/prepare-reel-render.mjs');
if (!prepare.includes('RENDER_LOCKED') || !prepare.includes('sourceTreeSha256')) fail.push('prepare-reel-render.mjs does not create a render provenance lock.');
if (!prepare.includes('validate-scene-voice-map.mjs') || !prepare.includes('sceneVoiceMapSha256')) fail.push('prepare-reel-render.mjs does not enforce/hash scene-to-voice mapping.');
if (!prepare.includes('validate-local-forced-alignment.mjs') || !prepare.includes('wordTimingsSha256')) fail.push('prepare-reel-render.mjs does not enforce/hash local forced alignment.');
if (!prepare.includes('validate-reel-sfx-plan.mjs') || !prepare.includes('sfxResolvedSha256')) fail.push('prepare-reel-render.mjs does not enforce/hash resolved SFX.');
if (!prepare.includes('validate-reel-visual-assets.mjs') || !prepare.includes('visualManifestSha256') || !prepare.includes('visualResolvedSha256')) fail.push('prepare-reel-render.mjs does not enforce/hash source + resolved visual assets.');

const lockScenes = await read('ki/scripts/lock-scene-timing-from-captions.mjs');
if (!lockScenes.includes('firstWordFrame') || !lockScenes.includes('finalDurationInFrames') || !lockScenes.includes('VOICE_LOCKED_SCENE_MAPPED')) fail.push('scene timing lock script does not derive final scene timing from real word anchors.');

const finalize = await read('ki/scripts/finalize-reel-export.mjs');
if (!finalize.includes('PASSED_LOCKED_INPUT_HASHES') || !finalize.includes('reviewedVideoSha256')) fail.push('finalize-reel-export.mjs does not enforce render provenance.');
if (!finalize.includes('PASSED_EXACT_SCENE_TEXT_AND_ANCHORS') || !finalize.includes('sceneVoiceMapSha256')) fail.push('finalize-reel-export.mjs does not enforce scene-to-voice provenance.');
if (!finalize.includes('PASSED_EXACT_KNOWN_TRANSCRIPT') || !finalize.includes('wordTimingsSha256')) fail.push('finalize-reel-export.mjs does not enforce local forced-alignment provenance.');
if (!finalize.includes('PASSED_CC0_AUTO_RESOLVED_AND_LOCKED') || !finalize.includes('sfxResolvedSha256')) fail.push('finalize-reel-export.mjs does not enforce SFX provenance.');
if (!finalize.includes('PASSED_RIGHTS_LOCAL_FILE_SHA256_AND_LOCK') || !finalize.includes('visualManifestSha256') || !finalize.includes('visualResolvedSha256')) fail.push('finalize-reel-export.mjs does not enforce visual provenance.');

const generator = await read('scripts/new-ki-reel.mjs');
if (!generator.includes('SCENE-VOICE-MAP.json') || !generator.includes('FIRST_MAPPED_WORD')) fail.push('new reel generator does not create the canonical scene-to-voice mapping contract.');
if (!generator.includes('sfx-events.json') || !generator.includes('sfx-resolved.json') || !generator.includes('AUTO_CC0_DETERMINISTIC')) fail.push('new reel generator does not scaffold automatic SFX files.');
if (!generator.includes('visual-assets.json') || !generator.includes('visual-assets-resolved.json') || !generator.includes('VISUAL-PLAN.md')) fail.push('new reel generator does not scaffold the visual asset pipeline.');

if (fail.length) {
  console.error('PRODUCTION CONTRACT AUDIT: FAILED');
  for (const issue of fail) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('PRODUCTION CONTRACT AUDIT: PASSED');
console.log(`checked required files: ${mustExist.length}`);
console.log(`checked active contracts: ${activeContracts.length}`);
console.log(`scanned reel source files: ${sourceFiles.length}`);
console.log('checked pause-compression + forced-alignment + scene-voice + automatic CC0-SFX + ranked local visual pipeline: yes');
