import {spawn} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const steps = [
  {
    id: 'folder-structure',
    command: 'node',
    args: ['scripts/check-ki-reel-folder-structure.mjs'],
  },
  {
    id: 'grounding-system',
    command: 'node',
    args: ['scripts/run-antigravity-content-test.mjs'],
  },
  {
    id: 'reel-package',
    command: 'node',
    args: ['scripts/check-antigravity-context-overload-reel.mjs'],
  },
  {
    id: 'phase-1-source',
    command: 'node',
    args: ['scripts/check-context-overload-phase1.mjs'],
  },
];

const outputRoot = resolve('out/antigravity-context-overload-preflight');
await mkdir(outputRoot, {recursive: true});
const results = [];

const run = (step) => new Promise((resolvePromise, reject) => {
  const startedAt = new Date().toISOString();
  console.log(`\n[antigravity-reel-preflight] ${step.id}`);
  const child = spawn(step.command, step.args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  });
  child.on('error', reject);
  child.on('exit', (code) => {
    const result = {
      id: step.id,
      command: [step.command, ...step.args].join(' '),
      status: code === 0 ? 'passed' : 'failed',
      exitCode: code,
      startedAt,
      completedAt: new Date().toISOString(),
    };
    results.push(result);
    if (code === 0) resolvePromise();
    else reject(new Error(`${step.id} endete mit Code ${code}.`));
  });
});

let status = 'passed';
let failure = null;
try {
  for (const step of steps) await run(step);
} catch (error) {
  status = 'failed';
  failure = error instanceof Error ? error.message : String(error);
}

const summary = {
  version: 3,
  reelSlug: 'antigravity-context-overload',
  planningPackage:
    'ki/reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht',
  executableSourceTarget: 'ki/src/reels/antigravity-context-overload',
  productionWorkflow: 'ki/gehirn/PRODUKTIONSABLAUF.md',
  status,
  generatedAt: new Date().toISOString(),
  steps: results,
  failure,
  nextAllowedAction: status === 'passed'
    ? 'await-phase-2-voiceover-then-run-phase-3-assembly'
    : 'fix-first-failing-preflight-step',
};
await writeFile(
  resolve(outputRoot, 'summary.json'),
  `${JSON.stringify(summary, null, 2)}\n`,
  'utf8',
);

if (status !== 'passed') {
  console.error(`\n[antigravity-reel-preflight] FEHLGESCHLAGEN: ${failure}`);
  process.exit(1);
}

console.log(
  '\n[antigravity-reel-preflight] BESTANDEN · Planung, Grounding und Phase-1-Source sind verdrahtet. Nächster manueller Schritt: Phase-2-Voiceover; danach übernimmt Phase 3 die Assembly und den Render.',
);
console.log(`[antigravity-reel-preflight] Summary: ${resolve(outputRoot, 'summary.json')}`);
