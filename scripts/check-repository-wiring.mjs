import {access, readFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';

const failures = [];
const warnings = [];

const readJson = async (path) => {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    failures.push(`${path} fehlt oder enthält ungültiges JSON: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
};

const readText = async (path) => {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    failures.push(`${path} fehlt oder ist nicht lesbar: ${error instanceof Error ? error.message : String(error)}`);
    return '';
  }
};

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const assertFile = async (path) => {
  if (!(await exists(path))) failures.push(`Pflichtdatei fehlt: ${path}`);
};

const requireMarkers = (label, text, markers) => {
  for (const marker of markers) {
    if (!text.includes(marker)) failures.push(`${label}: Pflichtmarker fehlt: ${marker}`);
  }
};

const forbidMarkers = (label, text, markers) => {
  for (const marker of markers) {
    if (text.includes(marker)) failures.push(`${label}: veralteter/unerlaubter Marker gefunden: ${marker}`);
  }
};

const walkSourceFiles = async (directory) => {
  const files = [];
  const entries = await readdir(directory, {withFileTypes: true});
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walkSourceFiles(path));
    else if (/\.(?:ts|tsx)$/.test(entry.name)) files.push(path);
  }
  return files;
};

const root = await readJson('package.json');
const core = await readJson('core/package.json');
const ki = await readJson('ki/package.json');
const vitest = await readText('vitest.config.ts');
const repoState = await readText('REPO-STATE.md');
const rootReadme = await readText('README.md');
const kiReadme = await readText('ki/README.md');
const agents = await readText('AGENTS.md');
const kiAgents = await readText('ki/AGENTS.md');
const reelAgents = await readText('ki/reels/AGENTS.md');
const sourceReelAgents = await readText('ki/src/reels/AGENTS.md');
const platformAgents = await readText('ki/plattformen/AGENTS.md');
const gemini = await readText('GEMINI.md');
const master = await readText('ki/gehirn/MASTER.md');
const channel = await readText('ki/gehirn/KANAL.md');
const production = await readText('ki/gehirn/PRODUKTIONSABLAUF.md');
const reels = await readText('ki/gehirn/REELS.md');
const platforms = await readText('ki/gehirn/PLATTFORMEN.md');
const imageStyle = await readText('ki/BILDSTIL.md');
const remotionCapabilities = await readText('ki/gehirn/REMOTION_ANIMATION_CAPABILITIES.md');
const youtubeReadme = await readText('ki/plattformen/youtube/README.md');
const youtubeShorts = await readText('ki/plattformen/youtube/SHORTS.md');
const youtubeLongform = await readText('ki/plattformen/youtube/LONGFORM.md');
const youtubeThumbnails = await readText('ki/plattformen/youtube/THUMBNAILS.md');
const youtubeUpload = await readText('ki/plattformen/youtube/UPLOAD.md');
const codexWorkflow = await readText('docs/CODEX_REEL_WORKFLOW.md');
const contextIndex = await readText('docs/CODEX_CONTEXT_INDEX.md');
const generator = await readText('scripts/new-ki-reel.mjs');
const phase3Skill = await readText('.agents/skills/build-context-overload-reel/SKILL.md');
const creativeRecipeCatalog = await readText('ki/src/animation-library/creativeRecipeCatalog.ts');
const creativeRecipeRuntime = await readText('ki/src/animation-library/creativeRecipeRuntime.tsx');
const productionSceneRuntime = await readText('ki/src/animation-library/productionSceneRuntime.tsx');
const creativeRecipeRender = await readText('scripts/render-creative-recipes.mjs');
const creativeRecipeCheck = await readText('scripts/check-creative-recipe-renders.mjs');

if (root) {
  const expectedWorkspaces = ['core', 'ki'];
  if (JSON.stringify(root.workspaces) !== JSON.stringify(expectedWorkspaces)) {
    failures.push(`package.json workspaces müssen exakt ${expectedWorkspaces.join(', ')} sein.`);
  }
  if (root.name !== 'ki-channel') failures.push('package.json name muss ki-channel sein.');
  if (root.engines?.node !== '>=20 <21') failures.push('package.json muss Node 20 festlegen (>=20 <21).');

  const requiredScripts = {
    'ki:reel:structure-check': 'node scripts/check-ki-reel-folder-structure.mjs',
    'repo:wiring-check': 'node scripts/check-repository-wiring.mjs',
    'content:runtime:verify': 'node scripts/verify-content-matched-runtime.mjs',
    'release:verify': 'node scripts/run-content-release.mjs verify',
    'release:smoke': 'node scripts/run-content-release.mjs smoke',
    'release:full': 'node scripts/run-content-release.mjs full',
    'creative-recipes:verify': 'node --check scripts/render-creative-recipes.mjs && node --check scripts/check-creative-recipe-renders.mjs && npm run typecheck:animation-library && npm run creative-recipes:test && npm run creative-recipes:plan',
    'creative-recipes:plan': 'node scripts/render-creative-recipes.mjs plan',
    'creative-recipes:smoke': 'node scripts/render-creative-recipes.mjs smoke',
    'creative-recipes:render': 'node scripts/render-creative-recipes.mjs all',
    'creative-recipes:check': 'node scripts/check-creative-recipe-renders.mjs',
    'creative-recipes:full-release-check': 'npm run creative-recipes:verify && npm run creative-recipes:render && npm run creative-recipes:check',
    'new-video': 'node scripts/new-ki-reel.mjs',
  };
  for (const [name, command] of Object.entries(requiredScripts)) {
    if (root.scripts?.[name] !== command) failures.push(`package.json script ${name} muss exakt "${command}" sein.`);
  }

  const serializedScripts = JSON.stringify(root.scripts ?? {});
  for (const target of ['validate-worktree-rules.mjs','validate-channels.mjs','validate-studio-skills.mjs','scripts/typecheck.mjs','scripts/new-channel.sh','prepare-voiceover.mjs','transcribe.mjs']) {
    if (serializedScripts.includes(target)) failures.push(`Totes Legacy-Skript ist wieder eingetragen: ${target}`);
  }
}

if (core) {
  if (core.name !== '@studio/core') failures.push('core/package.json name muss @studio/core sein.');
  if (core.exports?.['.']?.import !== './brand-kit/index.ts') failures.push('core/package.json muss @studio/core auf ./brand-kit/index.ts exportieren.');
}
if (ki) {
  if (ki.name !== '@studio/ki') failures.push('ki/package.json name muss @studio/ki sein.');
  if (ki.dependencies?.['@studio/core'] !== '*') failures.push('ki/package.json muss @studio/core als Workspace-Abhängigkeit deklarieren.');
}

if (!vitest.includes("'ki/**/*.{test,spec}.{ts,tsx}'")) failures.push('vitest.config.ts muss Tests unter ki/** einschließen.');
if (vitest.includes("'channels/**/*.{test,spec}.{ts,tsx}'")) failures.push('vitest.config.ts enthält wieder channels/**.');

requireMarkers('REPO-STATE.md', repoState, ['`main` ist der einzige kanonische Produktionsstand','PHASE 1 — ChatGPT','PHASE 2 — Mensch','PHASE 3 — Codex / Antigravity','ki/plattformen/','03-caption/platform-copy.md']);
requireMarkers('README.md', rootReadme, ['REPO-STATE.md','ki/plattformen/','YouTube Shorts','platform-copy.md']);
requireMarkers('ki/README.md', kiReadme, ['kanonischer Einstieg','gehirn/MASTER.md','plattformen/youtube/','Short-Form ist format-first']);
requireMarkers('AGENTS.md', agents, ['Phase 1 — ChatGPT','Phase 2 — Mensch','Phase 3 — Codex / Antigravity','VOICEOVER-ZUM-KOPIEREN.txt','nicht von Null neu bauen','platform-copy.md']);
requireMarkers('ki/AGENTS.md', kiAgents, ['ki/gehirn/MASTER.md','PLATTFORMEN.md','01-script-audio/','02-bilder/','06-projektdateien/','Phase 2 ist nur das menschliche Voiceover','REMOTION_ANIMATION_CAPABILITIES.md']);
requireMarkers('ki/reels/AGENTS.md', reelAgents, ['PHASE-STATUS.md','VOICEOVER-ZUM-KOPIEREN.txt','image-prompts.md','platform-copy.md','Ein Skript-/Plan-only Paket ist nicht Phase-1-fertig']);
requireMarkers('ki/src/reels/AGENTS.md', sourceReelAgents, ['Verbindlicher Creative-Director-Pfad','assertAuthoredVisualDiversity','ProductionSceneRuntimeRenderer','CreativeRecipeRuntime','primaryPrimitive','motionSignature','kein alternativer Produktionsweg']);
requireMarkers('REMOTION_ANIMATION_CAPABILITIES.md', remotionCapabilities, ['Visual Fingerprint','Lottie','Rive','Three','Card']);
requireMarkers('creativeRecipeCatalog.ts', creativeRecipeCatalog, ['CREATIVE_RECIPE_IDS','runtimeMechanisms','object-morph-stage','depth-corridor','ui-state-machine']);
requireMarkers('creativeRecipeRuntime.tsx', creativeRecipeRuntime, ['CreativeRecipeRuntime','assertCreativeRecipeRuntimeContract','ObjectMorphStage','PathTraceField','NetworkBloom','XRayOverlay','TypographicConstruct','CutawayStack','DepthCorridor','UIStateMachine']);
requireMarkers('productionSceneRuntime.tsx', productionSceneRuntime, ['buildProductionSceneRuntime','ProductionSceneRuntimeRenderer','CreativeRecipeRuntime','ANIMATION_PROTOTYPE_REGISTRY']);
requireMarkers('render-creative-recipes.mjs', creativeRecipeRender, ['CreativeRecipe-','CREATIVE_RECIPE_IDS','smoke','stills','videos','render-plan.json']);
requireMarkers('check-creative-recipe-renders.mjs', creativeRecipeCheck, ['technical-check.json','1080','1100','ftyp','PNG_SIGNATURE']);
requireMarkers('ki/plattformen/AGENTS.md', platformAgents, ['Keine zweite Produktionswahrheit','ki/reels/','youtube/README.md']);
requireMarkers('GEMINI.md', gemini, ['REPO-STATE.md','Audio darf in Phase 1 fehlen','Nicht von Null neu bauen','PHASE 2 AUDIO FEHLT']);
requireMarkers('ki/gehirn/MASTER.md', master, ['ÜBERSCHRIFT','ANIMATIONSTEXT','CAPTION','Phase 1 — ChatGPT','PLATTFORMEN.md']);
requireMarkers('KANAL.md', channel, ['YouTube Shorts','Instagram Reels','TikTok','Facebook Reels','PLATTFORMEN.md']);
requireMarkers('PRODUKTIONSABLAUF.md', production, ['VOICEOVER-ZUM-KOPIEREN.txt','alles außer echtem Audio','nur Voiceover','PHASE 2 AUDIO FEHLT','platform-copy.md']);
requireMarkers('REELS.md', reels, ['Text-Hierarchie — keine Dopplung','niemals interner `goal`','BILDER NICHT ERFORDERLICH']);
requireMarkers('PLATTFORMEN.md', platforms, ['Content einmal, Publishing mehrfach','03-caption/platform-copy.md','YouTube Shorts','YouTube Longform']);
requireMarkers('BILDSTIL.md', imageStyle, ['Prompt wird standardmäßig **auf Englisch**','REMOTION WILL ADD','Qualitätsgate']);
requireMarkers('YouTube README', youtubeReadme, ['YouTube — Kanalstruktur','SHORTS.md','LONGFORM.md','THUMBNAILS.md','UPLOAD.md']);
requireMarkers('YouTube SHORTS', youtubeShorts, ['03-caption/platform-copy.md','kein eigenes Produktionsprojekt','UPLOAD.md']);
requireMarkers('YouTube LONGFORM', youtubeLongform, ['eigenes Content-Format','nicht automatisch aus einem Reel verlängert','THUMBNAILS.md']);
requireMarkers('YouTube THUMBNAILS', youtubeThumbnails, ['faceless','#B98CFF','Kein visuelles Rätsel']);
requireMarkers('YouTube UPLOAD', youtubeUpload, ['03-caption/platform-copy.md','Zeitabhängige Plattformfakten','freigegebenen Master']);
requireMarkers('CODEX_REEL_WORKFLOW.md', codexWorkflow, ['beschreibt **nur Phase 3**','implementiert das Reel nicht erneut von Null','PHASE 2 AUDIO FEHLT']);
requireMarkers('CODEX_CONTEXT_INDEX.md', contextIndex, ['`main` ist kanonisch','Phase 2','vorhandenen Phase-1-Source']);
requireMarkers('Phase-3-Skill', phase3Skill, ['not** a from-scratch builder','PHASE 2 AUDIO FEHLT','do not rebuild the reel from zero']);

forbidMarkers('AGENTS.md', agents, ['channels/ki','--workspaces=false']);
forbidMarkers('GEMINI.md', gemini, ['channels/ki','--workspaces=false','Only after preflight may executable implementation be created']);
forbidMarkers('ki/README.md', kiReadme, ['channels/ki','agent/ki-reel-builder-v1','CHATGPT_START_HIER.md','Draft-PR']);
forbidMarkers('CODEX_REEL_WORKFLOW.md', codexWorkflow, ['_codex-hybrid-template']);

for (const marker of ["'02-bilder'", 'image-prompts.md', "'03-caption'", 'platform-copy.md', "'05-export'", 'PHASE-STATUS.md']) {
  if (!generator.includes(marker)) failures.push(`new-ki-reel.mjs: kanonischer Generator-Marker fehlt: ${marker}`);
}

for (const path of [
  'REPO-STATE.md','AGENTS.md','GEMINI.md','README.md',
  'core/brand-kit/index.ts','ki/brand/brand.ts','ki/README.md','ki/AGENTS.md','ki/reels/AGENTS.md','ki/src/reels/AGENTS.md',
  'ki/gehirn/MASTER.md','ki/gehirn/KANAL.md','ki/gehirn/REELS.md','ki/gehirn/PLATTFORMEN.md','ki/gehirn/PRODUKTIONSABLAUF.md','ki/gehirn/REMOTION_ANIMATION_CAPABILITIES.md','ki/BILDSTIL.md',
  'ki/src/animation-library/visualFingerprint.ts','ki/src/animation-library/authoredProductionGate.ts','ki/src/animation-library/productionCatalog.ts','ki/src/animation-library/creativeMotionPrimitives.tsx','ki/src/animation-library/creativeRecipeCatalog.ts','ki/src/animation-library/creativeRecipeRuntime.tsx','ki/src/animation-library/CreativeRecipeGalleryRoot.tsx','ki/src/animation-library/productionSceneRuntime.tsx',
  'ki/plattformen/AGENTS.md','ki/plattformen/README.md',
  'ki/plattformen/youtube/README.md','ki/plattformen/youtube/SHORTS.md','ki/plattformen/youtube/LONGFORM.md','ki/plattformen/youtube/THUMBNAILS.md','ki/plattformen/youtube/UPLOAD.md',
  'ki/plattformen/instagram/README.md','ki/plattformen/tiktok/README.md','ki/plattformen/facebook/README.md','ki/plattformen/snapchat/README.md',
  'docs/CODEX_REEL_WORKFLOW.md','docs/CODEX_CONTEXT_INDEX.md',
  'ki/tsconfig.motion.json','ki/tsconfig.animation-library.json',
  'scripts/check-ki-reel-folder-structure.mjs','scripts/prepare-codex-reel.mjs','scripts/verify-content-matched-runtime.mjs','scripts/run-content-release.mjs','scripts/render-creative-recipes.mjs','scripts/check-creative-recipe-renders.mjs',
  '.agents/skills/build-context-overload-reel/SKILL.md'
]) await assertFile(path);

if (await exists('ki/src/reels')) {
  for (const path of await walkSourceFiles('ki/src/reels')) {
    const source = await readText(path);
    if (/from\s+['"][^'"]*motion-system\//.test(source) || /import\s*\(['"][^'"]*motion-system\//.test(source)) {
      failures.push(`${path}: Production-Reel darf den Legacy motion-system-Pfad nicht importieren.`);
    }
  }
}

if (await exists('ki/reels/_codex-hybrid-template')) failures.push('Veralteter ki/reels/_codex-hybrid-template darf nicht mehr existieren.');
if (await exists('ki/reels/2026-08-03_bis_2026-08-09/01_Warum-KI-Text-anders-liest/06-projektdateien/PHASE-2-IMPLEMENTATION.md')) failures.push('Legacy-Datei PHASE-2-IMPLEMENTATION.md darf nicht mehr existieren.');

if (!(await exists('package-lock.json'))) warnings.push('package-lock.json fehlt noch; erst nach echtem npm-Installationslauf vertrauenswürdig erzeugen.');

for (const warning of warnings) console.warn(`WARN: ${warning}`);
if (failures.length > 0) {
  console.error('Repository-Wiring/Agent-Contract fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Repository-Wiring und Agent-Contract konsistent: Workspaces, kanonische Pfade, 3-Phasen-Modell, Creative Director, Visual-Diversity-Gates, Creative-Recipe-Runtime, kanonischer Scene-Renderer, Creative-Recipe-Render-Gates, Remotion-Fähigkeiten, Plattformstruktur und Agent-Verträge stimmen überein.');