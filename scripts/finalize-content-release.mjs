import {execFileSync, spawn} from 'node:child_process';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {CONTENT_REVIEW_COUNTS} from './content-review-contract.mjs';

const visualReviewPath = process.argv[2]
  ? resolve(process.argv[2])
  : resolve('out/content-review-gallery/visual-review.json');
const outputRoot = resolve('out/content-release-run');
await mkdir(outputRoot, {recursive: true});
const finalizationPath = resolve(outputRoot, 'finalization.json');
const currentGitHead = execFileSync('git', ['rev-parse', 'HEAD'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'ignore'],
}).trim();
const startedAt = new Date().toISOString();
const steps = [];

const writeFinalization = async ({status, error = null, reviewId = null}) => {
  await writeFile(
    finalizationPath,
    `${JSON.stringify({
      version: 2,
      status,
      gitHead: currentGitHead,
      reviewId,
      reviewCardCount: CONTENT_REVIEW_COUNTS.total,
      creativeRecipeReviewRequired: true,
      visualReviewPath,
      startedAt,
      completedAt: status === 'running' ? null : new Date().toISOString(),
      error,
      steps,
    }, null, 2)}\n`,
    'utf8',
  );
};

const run = (args, label) =>
  new Promise((resolvePromise, reject) => {
    const step = {
      label,
      command: [process.execPath, ...args].join(' '),
      status: 'running',
      startedAt: new Date().toISOString(),
      completedAt: null,
    };
    steps.push(step);
    console.log(`\n[content-finalize] ${label}`);
    console.log(`[content-finalize] > ${step.command}`);
    const child = spawn(process.execPath, args, {
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

await writeFinalization({status: 'running'});

try {
  await run(
    ['scripts/verify-content-release-summary.mjs', 'full'],
    'Frischen technischen Full-Release-Report für aktuellen Git-HEAD prüfen',
  );
  await writeFinalization({status: 'running'});

  await run(
    ['scripts/verify-all-content-release.mjs'],
    'Aktuelle Production- und Edge-Release-Artefakte erneut gegen Source-Fingerprints, Props und Dateisignaturen prüfen',
  );
  await writeFinalization({status: 'running'});

  await run(
    ['scripts/check-creative-recipe-renders.mjs'],
    'Aktuelle Creative-Recipe-Artefakte erneut gegen Runtime-Fingerprint und Dateisignaturen prüfen',
  );
  await writeFinalization({status: 'running'});

  await run(
    ['scripts/verify-content-review-gallery.mjs', 'full'],
    `Aktuelle ${CONTENT_REVIEW_COUNTS.total}-Karten Full-Review-Galerie prüfen`,
  );
  const manifest = JSON.parse(
    await readFile(resolve('out/content-review-gallery/review-manifest.json'), 'utf8'),
  );
  await writeFinalization({status: 'running', reviewId: manifest.reviewId ?? null});

  await run(
    ['scripts/verify-content-visual-review.mjs', visualReviewPath],
    `${CONTENT_REVIEW_COUNTS.total}/${CONTENT_REVIEW_COUNTS.total} manuelle Visual-Review-Entscheidungen inklusive Creative Recipes prüfen`,
  );

  if (steps.length !== 5 || steps.some((step) => step.status !== 'passed')) {
    throw new Error(`Finalisierung inkonsistent: ${steps.filter((step) => step.status === 'passed').length}/5 Schritte passed.`);
  }

  const [technicalSummary, visualReview] = await Promise.all([
    readFile(resolve('out/content-release-run/full-summary.json'), 'utf8').then(JSON.parse),
    readFile(visualReviewPath, 'utf8').then(JSON.parse),
  ]);

  await writeFile(
    finalizationPath,
    `${JSON.stringify({
      version: 2,
      status: 'passed',
      gitHead: currentGitHead,
      reviewId: manifest.reviewId,
      reviewCardCount: CONTENT_REVIEW_COUNTS.total,
      creativeRecipeReviewRequired: true,
      creativeRecipeReviewVerified: true,
      visualReviewPath,
      technicalCompletedAt: technicalSummary.completedAt,
      reviewedAt: visualReview.reviewedAt,
      finalizedAt: new Date().toISOString(),
      technicalArtifactsReverified: true,
      manualVisualReviewRequired: true,
      manualVisualReviewVerified: true,
      steps,
    }, null, 2)}\n`,
    'utf8',
  );

  console.log('\n[content-finalize] FINALISIERUNG BESTANDEN.');
  console.log(`[content-finalize] Git-HEAD: ${currentGitHead}`);
  console.log(`[content-finalize] Review-ID: ${manifest.reviewId}`);
  console.log(`[content-finalize] Review: ${CONTENT_REVIEW_COUNTS.total} Karten inklusive ${CONTENT_REVIEW_COUNTS.recipe} Creative Recipes.`);
  console.log(`[content-finalize] Nachweis: ${finalizationPath}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  let reviewId = null;
  try {
    const manifest = JSON.parse(
      await readFile(resolve('out/content-review-gallery/review-manifest.json'), 'utf8'),
    );
    reviewId = manifest.reviewId ?? null;
  } catch {
    // Review manifest may not exist yet.
  }
  await writeFinalization({status: 'failed', error: message, reviewId});
  console.error(`\n[content-finalize] Finalisierung fehlgeschlagen: ${message}`);
  console.error(`[content-finalize] Nachweis: ${finalizationPath}`);
  process.exitCode = 1;
}
