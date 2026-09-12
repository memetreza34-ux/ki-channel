import {execFileSync, spawnSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const reportDir = resolve(projectRoot, 'out', 'test-readiness');
const reportPath = resolve(reportDir, 'summary.json');
const startedAtMs = Date.now();

const git = (...args) => execFileSync('git', args, {
  cwd: projectRoot,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
}).trim();

const initialBranch = git('rev-parse', '--abbrev-ref', 'HEAD');
const initialHead = git('rev-parse', 'HEAD');
const initialTrackedStatus = git('status', '--porcelain', '--untracked-files=no');

const report = {
  schemaVersion: 1,
  status: 'running',
  startedAt: new Date(startedAtMs).toISOString(),
  completedAt: null,
  durationMs: null,
  branch: initialBranch,
  head: initialHead,
  node: process.version,
  platform: `${process.platform}-${process.arch}`,
  steps: [],
  failure: null,
};

const persistReport = () => {
  mkdirSync(reportDir, {recursive: true});
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
};

const finishFailure = (message, exitCode = 1) => {
  report.status = 'failed';
  report.failure = message;
  report.completedAt = new Date().toISOString();
  report.durationMs = Date.now() - startedAtMs;
  persistReport();
  console.error(`\nTEST READINESS FAILED: ${message}`);
  console.error(`Report: ${reportPath}`);
  process.exit(exitCode || 1);
};

const nodeMajor = Number(process.versions.node.split('.')[0]);
if (nodeMajor !== 20) {
  finishFailure(`Node 20 ist Pflicht, aktiv ist ${process.version}.`);
}

if (initialTrackedStatus) {
  finishFailure('Tracked Worktree ist nicht sauber. Änderungen zuerst committen oder zurücksetzen.');
}

const steps = [
  ['generated-media-script', 'node --check scripts/materialize-generated-media.mjs'],
  ['antigravity', 'npm run antigravity:verify'],
  ['repository', 'npm run repo:verify'],
  ['motion', 'npm run motion:verify'],
  ['release-static', 'npm run release:verify'],
];

console.log(`Test readiness for ${initialBranch}@${initialHead}`);
console.log(`Node ${process.version}`);

for (const [name, command] of steps) {
  const stepStartedAt = Date.now();
  console.log(`\n=== ${name}: ${command} ===`);

  const result = spawnSync(command, {
    cwd: projectRoot,
    env: process.env,
    shell: true,
    stdio: 'inherit',
  });

  const step = {
    name,
    command,
    status: result.error || result.status !== 0 ? 'failed' : 'passed',
    exitCode: result.status ?? null,
    durationMs: Date.now() - stepStartedAt,
  };
  report.steps.push(step);
  persistReport();

  if (result.error) {
    finishFailure(`${name} konnte nicht gestartet werden: ${result.error.message}`);
  }
  if (result.status !== 0) {
    finishFailure(`${name} ist mit Exit-Code ${result.status ?? 'unknown'} fehlgeschlagen.`, result.status ?? 1);
  }

  const currentHead = git('rev-parse', 'HEAD');
  if (currentHead !== initialHead) {
    finishFailure(`HEAD hat sich während des Pre-Tests geändert: ${initialHead} -> ${currentHead}.`);
  }
}

const finalTrackedStatus = git('status', '--porcelain', '--untracked-files=no');
if (finalTrackedStatus) {
  finishFailure('Tracked Worktree wurde während des Pre-Tests verändert.');
}

const finalHead = git('rev-parse', 'HEAD');
if (finalHead !== initialHead) {
  finishFailure(`HEAD stimmt am Ende nicht mehr mit dem Start-Commit überein: ${initialHead} -> ${finalHead}.`);
}

report.status = 'passed';
report.completedAt = new Date().toISOString();
report.durationMs = Date.now() - startedAtMs;
persistReport();

console.log(`\nTEST READINESS PASSED for ${initialBranch}@${initialHead}`);
console.log(`Report: ${reportPath}`);
