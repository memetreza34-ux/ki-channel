import {execFileSync, spawn} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const requestedMode = process.argv[2] ?? 'verify';
const VALID_MODES = new Set(['verify', 'smoke', 'full']);
if (!VALID_MODES.has(requestedMode)) {
  console.error(
    'Aufruf: node scripts/run-content-release.mjs [verify|smoke|full]',
  );
  process.exit(1);
}

const currentGitHead = (() => {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
})();

const outputRoot = resolve('out/content-release-run');
await mkdir(outputRoot, {recursive: true});
const summaryPath = resolve(outputRoot, `${requestedMode}-summary.json`);
const startedAt = new Date().toISOString();
const steps = [];

const verificationSteps = [
  {
    command: process.execPath,
    args: ['scripts/verify-content-matched-runtime.mjs'],
    label: 'Fokussierte Content-Runtime-Verifikation',
  },
  {
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args: ['run', 'animation-library:verify'],
    label: 'Vollständige Animation-Library-Verifikation',
  },
];

const smokeSteps = [
  {
    command: process.execPath,
    args: ['scripts/render-masterplan-content-release.mjs', 'smoke'],
    label: '22 Production-Smoke-Renders',
  },
  {
    command: process.execPath,
    args: ['scripts/verify-masterplan-content-release.mjs'],
    label: '22 Production-Smoke-Artefakte und Runtime-Props prüfen',
  },
  {
    command: process.execPath,
    args: ['scripts/render-content-motion-edge-cases.mjs', 'smoke'],
    label: '6 semantische Edge-Case-Smoke-Renders',
  },
  {
    command: process.execPath,
    args: ['scripts/verify-content-motion-edge-case-renders.mjs', 'smoke'],
    label: '6 Edge-Case-Smoke-Artefakte prüfen',
  },
  {
    command: process.execPath,
    args: ['scripts/build-content-review-gallery.mjs'],
    label: '22+6 Smoke-Review-Galerie erzeugen',
  },
  {
    command: process.execPath,
    args: ['scripts/verify-content-review-gallery.mjs', 'smoke'],
    label: 'Smoke-Review-Galerie auf Vollständigkeit und Stale-Artefakte prüfen',
  },
];

const fullSteps = [
  {
    command: process.execPath,
    args: ['scripts/render-all-content-release.mjs'],
    label: 'Kanonischen vollständigen Content-Release rendern',
  },
  {
    command: process.execPath,
    args: ['scripts/verify-all-content-release.mjs'],
    label: 'Kanonischen vollständigen Content-Release verifizieren',
  },
];

const requestedSteps = [
  ...verificationSteps,
  ...(requestedMode === 'smoke' ? smokeSteps : []),
  ...(requestedMode === 'full' ? fullSteps : []),
];

const writeSummary = async ({status, error = null}) => {
  await writeFile(
    summaryPath,
    `${JSON.stringify(
      {
        version: 1,
        mode: requestedMode,
        status,
        gitHead: currentGitHead,
        expectedStepCount: requestedSteps.length,
        startedAt,
        completedAt: status === 'running' ? null : new Date().toISOString(),
        error,
        steps,
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
};

const run = (command, args, label) =>
  new Promise((resolvePromise, reject) => {
    const step = {
      label,
      command: [command, ...args].join(' '),
      status: 'running',
      startedAt: new Date().toISOString(),
      completedAt: null,
    };
    steps.push(step);
    console.log(`\n[content-release:${requestedMode}] ${label}`);
    console.log(`[content-release:${requestedMode}] > ${step.command}`);

    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: process.env,
    });

    child.on('error', (error) => {
      step.status = 'failed';
      step.completedAt = new Date().toISOString();
      reject(error);
    });
    child.on('exit', (code) => {
      step.completedAt = new Date().toISOString();
      if (code === 0) {
        step.status = 'passed';
        resolvePromise();
        return;
      }
      step.status = 'failed';
      reject(new Error(`${label} endete mit Code ${code}.`));
    });
  });

// Invalidate any older successful report before starting the first child process.
// If this run is interrupted externally, the current summary remains `running`
// instead of leaving a stale `passed` result from an earlier release behind.
await writeSummary({status: 'running'});

try {
  for (const step of requestedSteps) {
    await run(step.command, step.args, step.label);
    await writeSummary({status: 'running'});
  }
  if (
    steps.length !== requestedSteps.length ||
    steps.some((step) => step.status !== 'passed')
  ) {
    throw new Error(
      `Release-Schrittkonsistenz verletzt: ${steps.filter((step) => step.status === 'passed').length}/${requestedSteps.length} Schritte sind passed.`,
    );
  }
  await writeSummary({status: 'passed'});
  console.log(
    `\n[content-release:${requestedMode}] Alle ${requestedSteps.length} Schritte bestanden.`,
  );
  console.log(
    `[content-release:${requestedMode}] Report: ${summaryPath}`,
  );
  if (requestedMode === 'full') {
    console.log(
      '[content-release:full] Technischer Release bestanden. Manuelle visuelle Freigabe der Review-Galerie bleibt weiterhin Pflicht.',
    );
    console.log(
      '[content-release:full] Review: out/content-review-gallery/index.html',
    );
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  await writeSummary({status: 'failed', error: message});
  console.error(`\n[content-release:${requestedMode}] Fehlgeschlagen: ${message}`);
  console.error(`[content-release:${requestedMode}] Report: ${summaryPath}`);
  process.exitCode = 1;
}
