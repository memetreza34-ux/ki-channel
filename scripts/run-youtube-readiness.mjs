import {execFileSync, spawnSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const reportDir = resolve(projectRoot, 'out', 'youtube-readiness');
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
  purpose: 'YOUTUBE_LONGFORM_V1_PREPRODUCTION_READINESS',
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
  console.error(`\nYOUTUBE READINESS FAILED: ${message}`);
  console.error(`Report: ${reportPath}`);
  process.exit(exitCode || 1);
};

const nodeMajor = Number(process.versions.node.split('.')[0]);
if (nodeMajor !== 24) finishFailure(`Node 24 LTS ist Pflicht, aktiv ist ${process.version}.`);
if (initialTrackedStatus) finishFailure('Tracked Worktree ist nicht sauber. Änderungen zuerst committen oder zurücksetzen.');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const steps = [
  ['longform-generator-syntax', process.execPath, ['--check', 'scripts/new-ki-longform.mjs']],
  ['longform-structure-syntax', process.execPath, ['--check', 'scripts/check-ki-longform-structure.mjs']],
  ['longform-readiness-syntax', process.execPath, ['--check', 'scripts/check-ki-longform-render-readiness.mjs']],
  ['longform-render-lock-syntax', process.execPath, ['--check', 'scripts/create-ki-longform-render-lock.mjs']],
  ['longform-master-syntax', process.execPath, ['--check', 'scripts/render-ki-longform-master.mjs']],
  ['longform-release-syntax', process.execPath, ['--check', 'scripts/check-ki-longform-release.mjs']],
  ['longform-capabilities', process.execPath, ['scripts/check-antigravity-longform-capabilities.mjs']],
  ['longform-structure', process.execPath, ['scripts/check-ki-longform-structure.mjs']],
  ['longform-contract-tests', process.execPath, ['--test', 'scripts/__tests__/longform-v1-contracts.test.mjs', 'scripts/__tests__/longform-master-gate.test.mjs', 'scripts/__tests__/longform-antigravity-capabilities.test.mjs']],
  ['longform-typecheck', npxCommand, ['--no-install', 'tsc', '--noEmit', '-p', 'ki/tsconfig.longform.json']],
  ['repository-wiring', npmCommand, ['run', 'repo:wiring-check']],
  ['production-contracts', npmCommand, ['run', 'production:contracts']],
];

console.log(`YouTube readiness for ${initialBranch}@${initialHead}`);
console.log(`Node ${process.version}`);
console.log('No paid media generation or production render is executed by this gate.');

for (const [name, command, args] of steps) {
  const stepStartedAt = Date.now();
  const printable = [command, ...args].join(' ');
  console.log(`\n=== ${name}: ${printable} ===`);

  const result = spawnSync(command, args, {
    cwd: projectRoot,
    env: process.env,
    stdio: 'inherit',
    shell: false,
  });

  const step = {
    name,
    command: printable,
    status: result.error || result.status !== 0 ? 'failed' : 'passed',
    exitCode: result.status ?? null,
    durationMs: Date.now() - stepStartedAt,
  };
  report.steps.push(step);
  persistReport();

  if (result.error) finishFailure(`${name} konnte nicht gestartet werden: ${result.error.message}`);
  if (result.status !== 0) finishFailure(`${name} ist mit Exit-Code ${result.status ?? 'unknown'} fehlgeschlagen.`, result.status ?? 1);

  const currentHead = git('rev-parse', 'HEAD');
  if (currentHead !== initialHead) finishFailure(`HEAD hat sich während des YouTube-Readiness-Laufs geändert: ${initialHead} -> ${currentHead}.`);
}

const finalTrackedStatus = git('status', '--porcelain', '--untracked-files=no');
if (finalTrackedStatus) finishFailure('Tracked Worktree wurde während des YouTube-Readiness-Laufs verändert.');
const finalHead = git('rev-parse', 'HEAD');
if (finalHead !== initialHead) finishFailure(`HEAD stimmt am Ende nicht mehr mit dem Start-Commit überein: ${initialHead} -> ${finalHead}.`);

report.status = 'passed';
report.completedAt = new Date().toISOString();
report.durationMs = Date.now() - startedAtMs;
persistReport();

console.log(`\nYOUTUBE READINESS PASSED for ${initialBranch}@${initialHead}`);
console.log(`Report: ${reportPath}`);
console.log('Next: create a LONGFORM_V1 package, complete Phase 1, add the user voiceover, then run the package render-readiness gate.');
