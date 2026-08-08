import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const read = (path) => readFileSync(resolve(path), 'utf8');
const failures = [];
const requireContains = (source, fragment, label) => {
  if (!source.includes(fragment)) {
    failures.push(`${label}: erwartet "${fragment}"`);
  }
};

const runner = read('scripts/run-content-release.mjs');
const verifier = read('scripts/verify-content-release-summary.mjs');

for (const required of [
  "['status', '--porcelain', '--untracked-files=no']",
  'const trackedWorktreeClean = trackedWorktreeStatus ===',
  'trackedWorktreeClean,',
  'if (!trackedWorktreeClean)',
  'Content-Release benötigt einen sauberen tracked Worktree',
  "await writeSummary({status: 'running'});",
]) {
  requireContains(runner, required, 'run-content-release clean-worktree contract');
}

const runningIndex = runner.indexOf("await writeSummary({status: 'running'});");
const cleanGuardIndex = runner.indexOf('if (!trackedWorktreeClean)');
const firstChildLoopIndex = runner.indexOf('for (const step of requestedSteps)');
if (
  runningIndex < 0 ||
  cleanGuardIndex <= runningIndex ||
  firstChildLoopIndex <= cleanGuardIndex
) {
  failures.push(
    'run-content-release: erst alten Report invalidieren, dann clean-worktree prüfen, dann Child-Schritte starten',
  );
}

for (const required of [
  "['status', '--porcelain', '--untracked-files=no']",
  'currentTrackedWorktreeStatus',
  'dirty tracked Worktree',
  'summary.trackedWorktreeClean !== true',
  'Release-Summary wurde nicht auf einem sauberen tracked Worktree erzeugt',
]) {
  requireContains(verifier, required, 'verify-content-release-summary clean-worktree contract');
}

if (failures.length > 0) {
  console.error('Content-Release-Worktree-Gate fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  'Content-Release-Worktree-Gate bestanden: Release-Reports werden nur auf sauberem tracked Worktree erzeugt und bestätigt; untracked Renderartefakte bleiben davon unberührt.',
);
