import {execFileSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {CONTENT_REVIEW_COUNTS} from './content-review-contract.mjs';

const requestedMode = process.argv[2] ?? 'full';
const VALID_MODES = new Set(['verify', 'smoke', 'full']);
if (!VALID_MODES.has(requestedMode)) {
  throw new Error('Aufruf: node scripts/verify-content-release-summary.mjs [verify|smoke|full]');
}

const expectedStepCounts = {
  verify: 3,
  smoke: 11,
  full: 7,
};

const expectedCommandFragments = {
  verify: [
    'scripts/verify-content-matched-runtime.mjs',
    'animation-library:verify',
    'creative-recipes:verify',
  ],
  smoke: [
    'scripts/verify-content-matched-runtime.mjs',
    'animation-library:verify',
    'creative-recipes:verify',
    'scripts/render-masterplan-content-release.mjs smoke',
    'scripts/verify-masterplan-content-release.mjs',
    'scripts/render-content-motion-edge-cases.mjs smoke',
    'scripts/verify-content-motion-edge-case-renders.mjs smoke',
    'creative-recipes:smoke',
    'creative-recipes:check',
    'scripts/build-content-review-gallery.mjs',
    'scripts/verify-content-review-gallery.mjs smoke',
  ],
  full: [
    'scripts/verify-content-matched-runtime.mjs',
    'animation-library:verify',
    'creative-recipes:verify',
    'creative-recipes:render',
    'creative-recipes:check',
    'scripts/render-all-content-release.mjs',
    'scripts/verify-all-content-release.mjs',
  ],
};

const currentGitHead = execFileSync('git', ['rev-parse', 'HEAD'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'ignore'],
}).trim();
const currentTrackedWorktreeStatus = execFileSync(
  'git',
  ['status', '--porcelain', '--untracked-files=no'],
  {encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']},
).trim();
if (currentTrackedWorktreeStatus) {
  throw new Error(`Release-Summary kann bei dirty tracked Worktree nicht bestätigt werden:\n${currentTrackedWorktreeStatus}`);
}

const summaryPath = resolve('out/content-release-run', `${requestedMode}-summary.json`);
const summary = JSON.parse(await readFile(summaryPath, 'utf8'));
if (summary.version !== 2 || summary.creativeRecipeGateEnabled !== true) {
  throw new Error(`Release-Summary-Version/Gate ungültig: version=${summary.version}, creativeRecipeGateEnabled=${summary.creativeRecipeGateEnabled}.`);
}
if (summary.mode !== requestedMode) throw new Error(`Release-Summary-Modus ist ${summary.mode}, erwartet ${requestedMode}.`);
if (summary.status !== 'passed') throw new Error(`Release-Summary ist nicht bestanden: status=${summary.status}.`);
if (summary.error !== null) throw new Error('Ein bestandener Release-Summary darf keinen Fehler enthalten.');
if (summary.trackedWorktreeClean !== true) throw new Error('Release-Summary wurde nicht auf einem sauberen tracked Worktree erzeugt.');
if (!summary.gitHead || summary.gitHead !== currentGitHead) {
  throw new Error(`Release-Summary ist nicht für den aktuellen Git-HEAD: report=${summary.gitHead ?? 'null'}, current=${currentGitHead}.`);
}
if (!summary.completedAt) throw new Error('Ein bestandener Release-Summary benötigt completedAt.');
if (!Array.isArray(summary.steps)) throw new Error('Release-Summary benötigt ein steps-Array.');

const expectedCount = expectedStepCounts[requestedMode];
if (summary.expectedStepCount !== expectedCount || summary.steps.length !== expectedCount) {
  throw new Error(`Release-Summary enthält ${summary.steps.length}/${summary.expectedStepCount} Schritte; erwartet ${expectedCount}.`);
}

const commandFragments = expectedCommandFragments[requestedMode];
for (let index = 0; index < expectedCount; index += 1) {
  const step = summary.steps[index];
  const expectedCommand = commandFragments[index];
  if (!step || step.status !== 'passed') throw new Error(`Release-Schritt ${index + 1}/${expectedCount} ist nicht passed.`);
  if (!step.command?.includes(expectedCommand)) throw new Error(`Release-Schritt ${index + 1} verwendet nicht den erwarteten Befehlsteil: ${expectedCommand}.`);
  if (!step.startedAt || !step.completedAt) throw new Error(`Release-Schritt ${index + 1} benötigt startedAt und completedAt.`);
  if (
    Number.isNaN(Date.parse(step.startedAt)) ||
    Number.isNaN(Date.parse(step.completedAt)) ||
    Date.parse(step.completedAt) < Date.parse(step.startedAt)
  ) {
    throw new Error(`Release-Schritt ${index + 1} enthält ungültige Zeitstempel.`);
  }
}
if (
  Number.isNaN(Date.parse(summary.startedAt)) ||
  Number.isNaN(Date.parse(summary.completedAt)) ||
  Date.parse(summary.completedAt) < Date.parse(summary.startedAt)
) {
  throw new Error('Release-Summary enthält ungültige Laufzeitstempel.');
}

console.log(`[content-release-summary] ${requestedMode} bestätigt: Git-HEAD ${currentGitHead}, sauberer tracked Worktree, ${expectedCount}/${expectedCount} Schritte passed inklusive Creative-Recipe-Gate.`);
if (requestedMode === 'full') {
  console.log(`[content-release-summary] Technischer Full-Run ist frisch und vollständig; manuelle visuelle ${CONTENT_REVIEW_COUNTS.total}/${CONTENT_REVIEW_COUNTS.total} Freigabe inklusive ${CONTENT_REVIEW_COUNTS.recipe} Creative Recipes bleibt separat erforderlich.`);
}
