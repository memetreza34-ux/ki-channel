import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const source = readFileSync(resolve('scripts/content-release-status.mjs'), 'utf8');
const failures = [];
const requireContains = (fragment) => {
  if (!source.includes(fragment)) failures.push(`erwartet "${fragment}"`);
};

for (const required of [
  'getMasterplanContentSourceFingerprint',
  'getEdgeCaseSourceFingerprint',
  "['status', '--porcelain', '--untracked-files=no']",
  'verify-summary.json',
  'smoke-summary.json',
  'full-summary.json',
  'review-manifest.json',
  'visual-review.json',
  'finalization.json',
  "code: 'commit-tracked-changes'",
  "code: 'run-full-release'",
  "code: 'rebuild-full-artifacts'",
  "code: 'complete-visual-review'",
  "code: 'finalize-release'",
  "code: 'release-complete'",
  'node scripts/run-content-release.mjs full',
  'node scripts/finalize-content-release.mjs',
  '28/28 Karten',
  '--json',
]) {
  requireContains(required);
}

const dirtyIndex = source.indexOf("code: 'commit-tracked-changes'");
const fullIndex = source.indexOf("code: 'run-full-release'");
const artifactsIndex = source.indexOf("code: 'rebuild-full-artifacts'");
const visualIndex = source.indexOf("code: 'complete-visual-review'");
const finalizeIndex = source.indexOf("code: 'finalize-release'");
const completeIndex = source.indexOf("code: 'release-complete'");
if (
  dirtyIndex < 0 ||
  fullIndex <= dirtyIndex ||
  artifactsIndex <= fullIndex ||
  visualIndex <= artifactsIndex ||
  finalizeIndex <= visualIndex ||
  completeIndex <= finalizeIndex
) {
  failures.push(
    'Next-Action-Reihenfolge muss dirty -> full -> artifacts -> visual review -> finalize -> complete bleiben',
  );
}

if (failures.length > 0) {
  console.error('Content-Release-Status-Gate fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  'Content-Release-Status-Gate bestanden: Statusbericht prüft Git/Full-Freshness, Production-/Edge-Fingerprints, 28er Review und Finalisierung in fester Reihenfolge.',
);
