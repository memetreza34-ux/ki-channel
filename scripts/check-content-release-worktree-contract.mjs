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
  'readTrackedWorktreeStatus',
  'initialTrackedWorktreeStatus',
  'initialTrackedWorktreeClean',
  'if (!initialTrackedWorktreeClean)',
  'const finalTrackedWorktreeStatus = readTrackedWorktreeStatus()',
  "if (finalTrackedWorktreeStatus !== '')",
  'Content-Release hat den tracked Worktree während des Laufs verändert oder dirty hinterlassen',
  "trackedWorktreeClean: trackedWorktreeStatus === ''",
  "await writeSummary({status: 'running'});",
]) {
  requireContains(runner, required, 'run-content-release clean-worktree contract');
}

const runningIndex = runner.indexOf("await writeSummary({status: 'running'});");
const initialGuardIndex = runner.indexOf('if (!initialTrackedWorktreeClean)');
const firstChildLoopIndex = runner.indexOf('for (const step of requestedSteps)');
const finalGuardIndex = runner.indexOf("if (finalTrackedWorktreeStatus !== '')");
const passedSummaryIndex = runner.indexOf("await writeSummary({status: 'passed'});");
if (
  runningIndex < 0 ||
  initialGuardIndex <= runningIndex ||
  firstChildLoopIndex <= initialGuardIndex ||
  finalGuardIndex <= firstChildLoopIndex ||
  passedSummaryIndex <= finalGuardIndex
) {
  failures.push(
    'run-content-release: Reihenfolge muss alten Report invalidieren -> initial clean guard -> Child-Schritte -> final clean guard -> passed summary bleiben',
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
  'Content-Release-Worktree-Gate bestanden: Release startet und endet mit sauberem tracked Worktree; Summary-Verifier bestätigt denselben Zustand, während untracked Renderartefakte erlaubt bleiben.',
);
