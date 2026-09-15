import {access, readFile} from 'node:fs/promises';

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
  for (const marker of markers) if (!text.includes(marker)) failures.push(`${label}: Pflichtmarker fehlt: ${marker}`);
};

const forbidMarkers = (label, text, markers) => {
  for (const marker of markers) if (text.includes(marker)) failures.push(`${label}: veralteter/unerlaubter Marker gefunden: ${marker}`);
};

const extractNumericProperty = (label, source, property) => {
  const match = source.match(new RegExp(`\\b${property}\\s*:\\s*(\\d+(?:\\.\\d+)?)`));
  if (!match) {
    failures.push(`${label}: numerische Property ${property} fehlt.`);
    return null;
  }
  return Number(match[1]);
};

const root = await readJson('package.json');
const core = await readJson('core/package.json');
const ki = await readJson('ki/package.json');
const vitest = await readText('vitest.config.ts');
const repoState = await readText('REPO-STATE.md');
const rootReadme = await readText('README.md');
const agents = await readText('AGENTS.md');
const master = await readText('ki/gehirn/MASTER.md');
const platforms = await readText('ki/gehirn/PLATTFORMEN.md');
const captionDoc = await readText('ki/gehirn/CAPTION_SAFE_POSITION.md');
const captionSource = await readText('ki/src/reels/captionSafe.ts');
const generator = await readText('scripts/new-ki-reel.mjs');
const motionTsconfig = await readText('ki/tsconfig.motion.json');
const longformTsconfig = await readText('ki/tsconfig.longform.json');
const youtubeReadiness = await readText('scripts/run-youtube-readiness.mjs');
const youtubeReadinessDoc = await readText('ki/youtube-longform/YOUTUBE-READINESS.md');
const workflow = await readText('.github/workflows/motion-system-checks.yml');
const nodeVersion = (await readText('NODE-VERSION')).trim();

if (root) {
  const expectedWorkspaces = ['core', 'ki'];
  if (JSON.stringify(root.workspaces) !== JSON.stringify(expectedWorkspaces)) failures.push(`package.json workspaces müssen exakt ${expectedWorkspaces.join(', ')} sein.`);
  if (root.name !== 'ki-channel') failures.push('package.json name muss ki-channel sein.');
  if (root.engines?.node !== '>=24 <25') failures.push('package.json muss Node 24 festlegen (>=24 <25).');
  if (root.engines?.npm !== '>=11 <12') failures.push('package.json muss npm 11 festlegen (>=11 <12).');
  if (root.packageManager !== 'npm@11.19.0') failures.push('package.json packageManager muss npm@11.19.0 sein.');

  const requiredScripts = {
    'runtime:bootstrap': 'node scripts/bootstrap-pre-youtube-runtime.mjs',
    'runtime:verify': 'node scripts/verify-pre-youtube-runtime.mjs',
    'repo:wiring-check': 'node scripts/check-repository-wiring.mjs',
    'production:contracts': 'node ki/scripts/validate-production-contracts.mjs',
    'ki:reel:structure-check': 'node scripts/check-ki-reel-folder-structure.mjs',
    'antigravity:verify': 'node scripts/check-antigravity-integration.mjs',
    'content:runtime:verify': 'node scripts/verify-content-matched-runtime.mjs',
    test: 'npm run repo:wiring-check && npm run ki:reel:structure-check && vitest run',
    'repo:verify': 'npm run production:contracts && npm run typecheck && npm test && npm run content:runtime:verify',
    'test:readiness': 'node scripts/run-test-readiness.mjs',
    'release:verify': 'node scripts/run-content-release.mjs verify',
    'release:smoke': 'node scripts/run-content-release.mjs smoke',
    'release:full': 'node scripts/run-content-release.mjs full',
    'new-video': 'node scripts/new-ki-reel.mjs',
  };
  for (const [name, command] of Object.entries(requiredScripts)) {
    if (root.scripts?.[name] !== command) failures.push(`package.json script ${name} muss exakt "${command}" sein.`);
  }
}

if (nodeVersion !== '24.21.0') failures.push(`NODE-VERSION muss exakt 24.21.0 sein, gefunden: ${nodeVersion || 'leer'}.`);
if (core?.name !== '@studio/core') failures.push('core/package.json name muss @studio/core sein.');
if (core?.exports?.['.']?.import !== './brand-kit/index.ts') failures.push('core/package.json muss @studio/core auf ./brand-kit/index.ts exportieren.');
if (ki?.name !== '@studio/ki') failures.push('ki/package.json name muss @studio/ki sein.');
if (ki?.dependencies?.['@studio/core'] !== '*') failures.push('ki/package.json muss @studio/core als Workspace-Abhängigkeit deklarieren.');

if (!vitest.includes("'ki/**/*.{test,spec}.{ts,tsx}'")) failures.push('vitest.config.ts muss Tests unter ki/** einschließen.');
if (vitest.includes("'channels/**/*.{test,spec}.{ts,tsx}'")) failures.push('vitest.config.ts enthält wieder channels/**.');

requireMarkers('REPO-STATE.md', repoState, [
  'Aktueller Stabilisierungsbranch:',
  'Arbeitsbranch nie still wechseln.',
  'npm run test:readiness',
  'node scripts/run-youtube-readiness.mjs',
  'Woche → Wochentag → Thema/Reel → 01–06',
  'BRAND-MOTION-PLAN.json',
  'WORD-TIMINGS.json',
  'bottom 330 px',
  'horizontal inset 76 px',
  'max width 928 px',
]);
forbidMarkers('REPO-STATE.md', repoState, [
  'Aktueller Testbranch: `feat/remotion-showcase-test-2026-09-12`',
  'fix/repo-stabilisierung-2026-08-24',
  'Draft-PR **#28**',
  '**Status:** 2026-09-04',
]);

requireMarkers('README.md', rootReadme, ['REPO-STATE.md','NN_Wochentag','NN_Reel-Titel','npm run new-video -- "Reel Titel" YYYY-MM-DD','ki/src/reels/captionSafe.ts']);
requireMarkers('AGENTS.md', agents, ['`REPO-STATE.md` bestimmt den aktuell autoritativen Arbeitsstand.','ki/reels/<Woche>/<Wochentag>/<NN_Thema>/','Phase 1 — Inhalt + Source','Phase 2 — Voiceover: ausschließlich Nutzer','Phase 3 — Sync, Review, Render, Export','BRAND-MOTION-PLAN.json']);
requireMarkers('ki/gehirn/MASTER.md', master, ['60–75 Sekunden','150–175 Wörter','ki/src/reels/captionSafe.ts','PHASE 2 — Nutzer erstellt und hinterlegt das Voiceover']);
requireMarkers('ki/gehirn/PLATTFORMEN.md', platforms, ['Content einmal, Publishing mehrfach','NN_Wochentag','NN_Reel-Titel','03-caption/platform-copy.md','technisches Exportprofil']);

requireMarkers('ki/tsconfig.motion.json', motionTsconfig, ['src/longform/**/*.ts','src/longform/**/*.tsx','youtube-longform/**/*.json']);
requireMarkers('ki/tsconfig.longform.json', longformTsconfig, ['src/longform/**/*.ts','src/longform/**/*.tsx','youtube-longform/**/*.json']);
requireMarkers('scripts/run-youtube-readiness.mjs', youtubeReadiness, ['YOUTUBE_LONGFORM_V1_PREPRODUCTION_READINESS','longform-typecheck','longform-contract-tests','repository-wiring','production-contracts','Node 24 LTS']);
requireMarkers('ki/youtube-longform/YOUTUBE-READINESS.md', youtubeReadinessDoc, ['node scripts/run-youtube-readiness.mjs','out/youtube-readiness/summary.json','node scripts/check-ki-longform-render-readiness.mjs','node scripts/render-ki-longform-master.mjs','node scripts/check-ki-longform-release.mjs']);

requireMarkers('.github/workflows/motion-system-checks.yml', workflow, ['node-version: 24','npm ci --no-audit --no-fund','scripts/with-longform-node24.mjs','scripts/bootstrap-pre-youtube-runtime.mjs','scripts/verify-pre-youtube-runtime.mjs']);
forbidMarkers('.github/workflows/motion-system-checks.yml', workflow, ['node-version: 20','npm install --package-lock=false']);

forbidMarkers('README.md', rootReadme, ['ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/','`main` ist der kanonische Produktionsstand.']);
forbidMarkers('PLATTFORMEN.md', platforms, ['ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/']);

const captionBottom = extractNumericProperty('captionSafe.ts', captionSource, 'bottom');
const captionInset = extractNumericProperty('captionSafe.ts', captionSource, 'horizontalInset');
const captionMaxWidth = extractNumericProperty('captionSafe.ts', captionSource, 'maxWidth');
const captionMaxLines = extractNumericProperty('captionSafe.ts', captionSource, 'maxVisibleLines');
const captionMaxWords = extractNumericProperty('captionSafe.ts', captionSource, 'maxWordsPerGroup');
const lowerDeadZone = extractNumericProperty('captionSafe.ts', captionSource, 'lowerCriticalDeadZone');
const lowerBufferEnd = extractNumericProperty('captionSafe.ts', captionSource, 'lowerBufferEnd');
const preferredVisualEndY = extractNumericProperty('captionSafe.ts', captionSource, 'preferredVisualEndY');
const preferredVisualEndYMax = extractNumericProperty('captionSafe.ts', captionSource, 'preferredVisualEndYMax');
if (captionBottom !== null) requireMarkers('CAPTION_SAFE_POSITION.md', captionDoc, [`Caption Bottom Offset: **\`${captionBottom}px\`**`]);
if (captionInset !== null) requireMarkers('CAPTION_SAFE_POSITION.md', captionDoc, [`**\`${captionInset}px\` links/rechts**`]);
if (captionMaxWidth !== null) requireMarkers('CAPTION_SAFE_POSITION.md', captionDoc, [`**\`${captionMaxWidth}px\`**`]);
if (captionMaxLines !== null) requireMarkers('CAPTION_SAFE_POSITION.md', captionDoc, [`maximal **${captionMaxLines} Zeilen gleichzeitig**`]);
if (captionMaxWords !== null) requireMarkers('CAPTION_SAFE_POSITION.md', captionDoc, [`4–${captionMaxWords} Wörter pro Sinnblock`]);
if (lowerDeadZone !== null) requireMarkers('CAPTION_SAFE_POSITION.md', captionDoc, [`lowerCriticalDeadZone: ${lowerDeadZone}`]);
if (lowerBufferEnd !== null) requireMarkers('CAPTION_SAFE_POSITION.md', captionDoc, [`lowerBufferEnd: ${lowerBufferEnd}`]);
if (preferredVisualEndY !== null && preferredVisualEndYMax !== null) requireMarkers('CAPTION_SAFE_POSITION.md', captionDoc, [`y=${preferredVisualEndY}–${preferredVisualEndYMax}`]);

for (const marker of ['01_Montag','07_Sonntag','new-ki-reel-core.mjs']) if (!generator.includes(marker)) failures.push(`new-ki-reel.mjs: aktueller Routing-Marker fehlt: ${marker}`);

for (const path of [
  'NODE-VERSION','REPO-STATE.md','AGENTS.md','GEMINI.md','README.md','core/brand-kit/index.ts','ki/brand/brand.ts','ki/README.md','ki/AGENTS.md','ki/reels/AGENTS.md','ki/youtube-longform/AGENTS.md','ki/youtube-longform/LONGFORM-V1.md','ki/youtube-longform/YOUTUBE-READINESS.md','ki/gehirn/MASTER.md','ki/gehirn/KANAL.md','ki/gehirn/REELS.md','ki/gehirn/STORYTELLING_MOTION.md','ki/gehirn/LEVEL_UP_STANDARD.md','ki/gehirn/VISUAL_ASSETS.md','ki/gehirn/CAPTION_SAFE_POSITION.md','ki/gehirn/PLATTFORMEN.md','ki/gehirn/PRODUKTIONSABLAUF.md','ki/gehirn/AUDIO_PIPELINE.md','ki/BILDSTIL.md','ki/plattformen/AGENTS.md','ki/plattformen/README.md','ki/plattformen/youtube/README.md','ki/plattformen/youtube/SHORTS.md','ki/plattformen/youtube/LONGFORM.md','ki/plattformen/youtube/THUMBNAILS.md','ki/plattformen/youtube/UPLOAD.md','ki/plattformen/instagram/README.md','ki/plattformen/tiktok/README.md','ki/plattformen/facebook/README.md','ki/plattformen/snapchat/README.md','ki/src/reels/captionSafe.ts','ki/tsconfig.motion.json','ki/tsconfig.longform.json','ki/tsconfig.animation-library.json','scripts/bootstrap-pre-youtube-runtime.mjs','scripts/verify-pre-youtube-runtime.mjs','scripts/with-longform-node24.mjs','scripts/new-ki-reel.mjs','scripts/new-ki-reel-core.mjs','scripts/new-ki-longform.mjs','scripts/check-ki-reel-folder-structure.mjs','scripts/check-ki-longform-structure.mjs','scripts/check-ki-longform-render-readiness.mjs','scripts/check-ki-longform-release.mjs','scripts/render-ki-longform-master.mjs','scripts/run-youtube-readiness.mjs','scripts/check-antigravity-integration.mjs','scripts/verify-content-matched-runtime.mjs','scripts/run-content-release.mjs','scripts/run-test-readiness.mjs','ki/scripts/validate-production-contracts.mjs','ki/scripts/validate-storytelling-motion.mjs','ki/scripts/validate-reel-level-up.mjs','ki/scripts/validate-reel-brand-motion-v4.mjs','ki/scripts/validate-reel-visual-assets.mjs'
]) await assertFile(path);

if (await exists('ki/reels/_codex-hybrid-template')) failures.push('Veralteter ki/reels/_codex-hybrid-template darf nicht mehr existieren.');
if (!(await exists('package-lock.json'))) warnings.push('package-lock.json fehlt noch; mit npm run runtime:bootstrap unter Node 24/npm 11 real erzeugen und committen.');

for (const warning of warnings) console.warn(`WARN: ${warning}`);
if (failures.length > 0) {
  console.error('Repository-Wiring/Canonical-Consistency fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Repository-Wiring konsistent: Node-24-LTS-Runtime, Workspaces, Lockfile-CI, Reel-Hierarchie, YouTube-Gates, Caption-Geometrie und Produktionsverträge stimmen überein.');
