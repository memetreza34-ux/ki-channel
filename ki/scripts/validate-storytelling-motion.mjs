#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/validate-storytelling-motion.mjs <reel-package-dir>');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const reelPath = path.join(reelDir, '06-projektdateien', 'reel.json');
const fail = (message) => { console.error(`STORYTELLING MOTION FAILED: ${message}`); process.exit(1); };

const requiredStackFiles = [
  'ki/gehirn/STORYTELLING_MOTION.md',
  'ki/src/reels/StoryMotion.tsx',
  'ki/src/reels/StoryShapes.tsx',
  'ki/src/reels/StoryMediaLayers.tsx',
  'ki/src/motion-system/StoryTransitionShowcase.tsx',
  'ki/src/index.ts',
  '.agents/skills/remotion-storytelling/SKILL.md',
  'scripts/sync-remotion-agent-skills.mjs',
  'remotion.config.ts',
];
for (const file of requiredStackFiles) if (!existsSync(path.resolve(file))) fail(`storytelling stack file missing: ${file}`);

let kiPackage;
try { kiPackage = JSON.parse(await readFile(path.resolve('ki/package.json'), 'utf8')); }
catch (error) { fail(`ki/package.json missing/invalid: ${error instanceof Error ? error.message : error}`); }
const requiredPackages = {
  '@remotion/effects':'4.0.488',
  '@remotion/lottie':'4.0.488',
  '@remotion/rive':'4.0.488',
  '@remotion/shapes':'4.0.488',
  '@remotion/skia':'4.0.488',
  '@remotion/sfx':'4.0.488',
  '@remotion/three':'4.0.488',
  '@remotion/transitions':'4.0.488',
  '@shopify/react-native-skia':'1.12.4',
};
for (const [name, version] of Object.entries(requiredPackages)) {
  if (kiPackage?.dependencies?.[name] !== version) fail(`ki/package.json must pin ${name}=${version}.`);
}

const remotionConfig = await readFile(path.resolve('remotion.config.ts'), 'utf8');
if (!remotionConfig.includes("Config.setChromiumOpenGlRenderer('angle')")) fail('remotion.config.ts must enable ANGLE for Effects/Three/Skia rendering.');
if (!remotionConfig.includes("import {enableSkia} from '@remotion/skia/enable'")) fail('remotion.config.ts must import enableSkia().');
if (!remotionConfig.includes('Config.overrideWebpackConfig') || !remotionConfig.includes('enableSkia(currentConfiguration)')) fail('remotion.config.ts must apply enableSkia() to the webpack config.');
const entrySource = await readFile(path.resolve('ki/src/index.ts'), 'utf8');
if (!entrySource.includes('LoadSkia') || !entrySource.includes('@shopify/react-native-skia/src/web')) fail('ki/src/index.ts must load Skia WebAssembly before registering the Remotion root.');
if (!entrySource.includes("await import('./Root')") || !entrySource.includes('registerRoot(RemotionRoot)')) fail('ki/src/index.ts must dynamically import Root only after LoadSkia resolves.');

const storyMotionSource = await readFile(path.resolve('ki/src/reels/StoryMotion.tsx'), 'utf8');
for (const token of ['StoryBeat','StoryCamera','ImpactNumber','StoryTexture','paper(']) if (!storyMotionSource.includes(token)) fail(`StoryMotion.tsx missing ${token}.`);
const storyShapesSource = await readFile(path.resolve('ki/src/reels/StoryShapes.tsx'), 'utf8');
for (const token of ['StoryFlowArrow','StoryPulseArrow','@remotion/shapes','<Arrow']) if (!storyShapesSource.includes(token)) fail(`StoryShapes.tsx missing ${token}.`);
const storyMediaSource = await readFile(path.resolve('ki/src/reels/StoryMediaLayers.tsx'), 'utf8');
for (const token of ['StoryThreeHero','StoryLottieLayer','StoryRiveLayer','StorySkiaBackdrop','ThreeCanvas','SkiaCanvas']) if (!storyMediaSource.includes(token)) fail(`StoryMediaLayers.tsx missing ${token}.`);
if (!storyMediaSource.includes('forbids render-time remote URLs')) fail('StoryRiveLayer must reject render-time remote URLs.');
const transitionSource = await readFile(path.resolve('ki/src/motion-system/StoryTransitionShowcase.tsx'), 'utf8');
for (const token of ['TransitionSeries','slide','wipe','bookFlip']) if (!transitionSource.includes(token)) fail(`StoryTransitionShowcase.tsx missing ${token}.`);
const skillSyncSource = await readFile(path.resolve('scripts/sync-remotion-agent-skills.mjs'), 'utf8');
for (const token of ['remotion', 'skills', "['add', 'update']"]) if (!skillSyncSource.includes(token)) fail(`Remotion skill sync wrapper missing ${token}.`);

if (!existsSync(reelPath)) fail(`reel.json missing: ${reelPath}`);
let reel;
try { reel = JSON.parse(await readFile(reelPath, 'utf8')); }
catch (error) { fail(`invalid reel.json: ${error instanceof Error ? error.message : error}`); }

const cutoff = '2026-08-29';
const publishDate = String(reel?.publishDate || '');
const enabled = reel?.storytelling?.enabled === true;
if (!enabled) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(publishDate) && publishDate >= cutoff) {
    fail(`new reel ${publishDate} must define reel.json.storytelling.enabled=true and a story-beats contract.`);
  }
  console.log('STORYTELLING MOTION: stack valid; legacy/non-enabled reel needs no narrative beat gate.');
  process.exit(0);
}

const storyFile = String(reel?.storytelling?.file || '06-projektdateien/story-beats.json');
const storyPath = path.resolve(reelDir, storyFile);
if (!existsSync(storyPath)) fail(`story contract missing: ${storyPath}`);
let story;
try { story = JSON.parse(await readFile(storyPath, 'utf8')); }
catch (error) { fail(`invalid story contract JSON: ${error instanceof Error ? error.message : error}`); }

const beats = Array.isArray(story?.beats) ? story.beats : [];
const minVisualBeats = Number(reel?.storytelling?.minVisualBeats ?? story?.rules?.minVisualBeats ?? 15);
const maxStaticSeconds = Number(reel?.storytelling?.maxStaticSeconds ?? story?.rules?.maxStaticSeconds ?? 4.5);
if (!Number.isFinite(minVisualBeats) || minVisualBeats < 12) fail('minVisualBeats must be at least 12 for a 60–75 second narrative reel.');
if (!Number.isFinite(maxStaticSeconds) || maxStaticSeconds <= 0 || maxStaticSeconds > 5) fail('maxStaticSeconds must be >0 and <=5 seconds.');
if (beats.length < minVisualBeats) fail(`only ${beats.length} visual beats; required at least ${minVisualBeats}.`);

const sceneIds = new Set((Array.isArray(reel?.scenes) ? reel.scenes : []).map((scene) => String(scene.sceneId)));
if (sceneIds.size === 0) fail('reel.json scenes missing.');
const ids = new Set();
const roles = new Set();
for (const [index, beat] of beats.entries()) {
  const id = String(beat?.id || '').trim();
  const sceneId = String(beat?.sceneId || '').trim();
  const role = String(beat?.role || '').trim().toUpperCase();
  const atRatio = Number(beat?.atRatio);
  const action = String(beat?.visualAction || '').trim();
  const motion = String(beat?.motion || '').trim();
  if (!id) fail(`beat ${index + 1} has no id.`);
  if (ids.has(id)) fail(`duplicate beat id: ${id}`);
  ids.add(id);
  if (!sceneIds.has(sceneId)) fail(`beat ${id} references unknown sceneId ${sceneId}.`);
  if (!Number.isFinite(atRatio) || atRatio < 0 || atRatio > 1) fail(`beat ${id} has invalid atRatio.`);
  if (action.length < 12) fail(`beat ${id} needs a concrete visualAction.`);
  if (motion.length < 3) fail(`beat ${id} needs a motion description.`);
  roles.add(role);
}

const requiredArc = reel?.storytelling?.requiredArc ?? ['HOOK','PROOF','CONSEQUENCE','PAYOFF'];
for (const role of requiredArc) if (!roles.has(String(role).toUpperCase())) fail(`story arc is missing required role ${role}.`);
for (const sceneId of sceneIds) {
  const count = beats.filter((beat) => String(beat.sceneId) === sceneId).length;
  if (count < 2) fail(`${sceneId} has only ${count} story beats; every scene needs at least two visible story changes.`);
}

const sourceDir = String(reel?.sourceDir || '').trim();
if (!sourceDir) fail('reel.json.sourceDir missing.');
const absoluteSourceDir = path.resolve(sourceDir);
if (!existsSync(absoluteSourceDir)) fail(`sourceDir does not exist: ${sourceDir}`);
const chunks = [];
const walk = async (dir) => {
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (/\.(?:ts|tsx)$/i.test(entry.name)) chunks.push(await readFile(full, 'utf8'));
  }
};
await walk(absoluteSourceDir);
const sourceText = chunks.join('\n');
const requiredTokens = reel?.storytelling?.sourceRequiredTokens ?? ['StoryBeat','StoryTexture','ImpactNumber'];
for (const token of requiredTokens) if (!sourceText.includes(String(token))) fail(`story source is missing required motion token: ${token}`);

if (story?.rules?.everySpokenCoreClaimNeedsVisualReaction !== true) fail('story contract must require every spoken core claim to receive a visual reaction.');
if (story?.rules?.cameraMotionMustHaveMeaning !== true) fail('story contract must require meaningful camera motion.');
if (story?.rules?.sfxMustMatchVisibleEvent !== true) fail('story contract must require visible-event-linked SFX.');

console.log('STORYTELLING MOTION PASSED');
console.log(`visual beats: ${beats.length}`);
console.log(`max static target: ${maxStaticSeconds.toFixed(1)} s`);
console.log(`story roles: ${[...roles].filter(Boolean).join(', ')}`);
console.log(`source tokens: ${requiredTokens.join(', ')}`);
console.log('stack: transitions + effects + sfx capability + shapes + lottie + rive + three + skia pinned; ANGLE + enableSkia + LoadSkia wired; official Remotion skills sync wrapper present');
