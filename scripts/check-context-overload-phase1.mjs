import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const SOURCE_ROOT = 'ki/src/reels/antigravity-context-overload';
const PACKAGE_ROOT =
  'ki/reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht';
const failures = [];
const fail = (message) => failures.push(message);
const read = (path) => readFileSync(resolve(path), 'utf8');

const requiredSourceFiles = [
  'contract.ts',
  'runtime.ts',
  'Captions.tsx',
  'ReelContextOverload.tsx',
  'index.ts',
  '__tests__/contract.test.ts',
];

for (const file of requiredSourceFiles) {
  const path = `${SOURCE_ROOT}/${file}`;
  if (!existsSync(resolve(path))) {
    fail(`${path} fehlt`);
    continue;
  }
  if (!read(path).trim()) fail(`${path} ist leer`);
}

const requiredPackageFiles = [
  '01-script-audio/voiceover.md',
  '06-projektdateien/PHASE-STATUS.md',
  '06-projektdateien/reel.json',
  '03-caption/subtitle-cues.json',
];
for (const file of requiredPackageFiles) {
  const path = `${PACKAGE_ROOT}/${file}`;
  if (!existsSync(resolve(path))) fail(`${path} fehlt`);
}

if (existsSync(resolve(`${SOURCE_ROOT}/runtime.ts`))) {
  const runtime = read(`${SOURCE_ROOT}/runtime.ts`);
  for (const stage of [
    'enhanceSceneMeaning',
    'derivePrototypeRuntimeContent',
    'sanitizePrototypeRuntimeContent',
    'associatePrototypeRuntimeContent',
    'createPrototypeRenderProps',
  ]) {
    if (!runtime.includes(stage)) fail(`runtime.ts: Grounding-Stufe ${stage} fehlt`);
  }
  if (!runtime.includes('ANIMATION_PROTOTYPE_REGISTRY')) {
    fail('runtime.ts: production-ready Prototype-Registry wird nicht verwendet');
  }
}

if (existsSync(resolve(`${SOURCE_ROOT}/ReelContextOverload.tsx`))) {
  const reelSource = read(`${SOURCE_ROOT}/ReelContextOverload.tsx`);
  if (!reelSource.includes('CONTEXT_OVERLOAD_SCENES.map')) {
    fail('ReelContextOverload.tsx: kanonische Szenen werden nicht sequenziert');
  }
  if (!reelSource.includes('voiceoverSrc ? <Audio')) {
    fail('ReelContextOverload.tsx: optionaler Phase-2-Voiceover-Slot fehlt');
  }
  if (!reelSource.includes('ContextOverloadCaptions')) {
    fail('ReelContextOverload.tsx: Caption-Layer fehlt');
  }
}

const rootPath = 'ki/src/Root.tsx';
if (!existsSync(resolve(rootPath))) {
  fail(`${rootPath} fehlt`);
} else {
  const root = read(rootPath);
  if (!root.includes('KI-ContextOverload') && !root.includes('CONTEXT_OVERLOAD_COMPOSITION_ID')) {
    fail('Root.tsx: KI-ContextOverload Composition ist nicht registriert');
  }
  if (!root.includes("./reels/antigravity-context-overload")) {
    fail('Root.tsx: Phase-1-Reel-Source ist nicht importiert');
  }
}

const workflowPath = 'ki/gehirn/PRODUKTIONSABLAUF.md';
if (!existsSync(resolve(workflowPath))) {
  fail(`${workflowPath} fehlt`);
} else {
  const workflow = read(workflowPath);
  for (const phase of ['Phase 1', 'Phase 2', 'Phase 3']) {
    if (!workflow.includes(phase)) fail(`${workflowPath}: ${phase} fehlt`);
  }
}

const voiceoverPath = `${PACKAGE_ROOT}/01-script-audio/voiceover.md`;
if (existsSync(resolve(voiceoverPath))) {
  const voiceover = read(voiceoverPath);
  if (!voiceover.includes('PHASE 2')) fail('voiceover.md: Phase-2-Hinweis fehlt');
  if (!voiceover.includes('voiceover.wav')) fail('voiceover.md: kanonischer Audio-Dateiname fehlt');
}

if (failures.length > 0) {
  console.error('Context-Overload Phase-1-Check fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  'Context-Overload Phase 1 vollständig verdrahtet: Wochenpaket, klarer Audio-Handoff, content-grounded Remotion-Source, Caption-Layer, Tests und Composition-Registrierung sind vorhanden.',
);
