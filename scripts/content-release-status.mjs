import {execFileSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {getEdgeCaseSourceFingerprint} from './edge-case-release-utils.mjs';
import {getMasterplanContentSourceFingerprint} from './masterplan-content-release-utils.mjs';

const jsonOnly = process.argv.includes('--json');

const git = (args) => {
  try {
    return execFileSync('git', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
};

const readJsonIfExists = async (path) => {
  try {
    return JSON.parse(await readFile(resolve(path), 'utf8'));
  } catch {
    return null;
  }
};

const gitHead = git(['rev-parse', 'HEAD']);
const trackedStatus = git(['status', '--porcelain', '--untracked-files=no']);
const trackedWorktreeClean = trackedStatus === '';

const [
  currentMasterplanFingerprint,
  currentEdgeFingerprint,
  verifySummary,
  smokeSummary,
  fullSummary,
  masterplanManifest,
  edgeSummary,
  reviewManifest,
  visualReview,
  finalization,
] = await Promise.all([
  getMasterplanContentSourceFingerprint(),
  getEdgeCaseSourceFingerprint(),
  readJsonIfExists('out/content-release-run/verify-summary.json'),
  readJsonIfExists('out/content-release-run/smoke-summary.json'),
  readJsonIfExists('out/content-release-run/full-summary.json'),
  readJsonIfExists('out/masterplan-content-release/manifest.json'),
  readJsonIfExists('out/content-motion-edge-cases/edge-case-render-summary.json'),
  readJsonIfExists('out/content-review-gallery/review-manifest.json'),
  readJsonIfExists('out/content-review-gallery/visual-review.json'),
  readJsonIfExists('out/content-release-run/finalization.json'),
]);

const classifySummary = (summary, expectedMode) => {
  if (!summary) return {state: 'missing'};
  if (summary.mode !== expectedMode) {
    return {state: 'invalid', reason: `mode=${summary.mode}`};
  }
  if (summary.status !== 'passed') {
    return {state: summary.status ?? 'invalid', reason: summary.error ?? null};
  }
  if (summary.gitHead !== gitHead) {
    return {
      state: 'stale',
      reason: `gitHead=${summary.gitHead ?? 'null'} current=${gitHead ?? 'null'}`,
    };
  }
  if (summary.trackedWorktreeClean !== true || !trackedWorktreeClean) {
    return {state: 'stale', reason: 'tracked worktree is not clean'};
  }
  return {state: 'passed', completedAt: summary.completedAt ?? null};
};

const summaries = {
  verify: classifySummary(verifySummary, 'verify'),
  smoke: classifySummary(smokeSummary, 'smoke'),
  full: classifySummary(fullSummary, 'full'),
};

const masterplanState = !masterplanManifest
  ? {state: 'missing'}
  : masterplanManifest.sourceFingerprint !== currentMasterplanFingerprint
    ? {state: 'stale', mode: masterplanManifest.mode ?? null}
    : {
        state: 'current',
        mode: masterplanManifest.mode ?? null,
        prototypeCount: masterplanManifest.prototypeCount ?? null,
        generatedAt: masterplanManifest.generatedAt ?? null,
      };

const edgeState = !edgeSummary
  ? {state: 'missing'}
  : edgeSummary.sourceFingerprint !== currentEdgeFingerprint
    ? {state: 'stale', mode: edgeSummary.mode ?? null}
    : {
        state: 'current',
        mode: edgeSummary.mode ?? null,
        caseCount: edgeSummary.caseCount ?? null,
        generatedAt: edgeSummary.generatedAt ?? null,
      };

const reviewState = !reviewManifest
  ? {state: 'missing'}
  : reviewManifest.upstreamMode !== 'all'
    ? {
        state: 'not-full',
        upstreamMode: reviewManifest.upstreamMode ?? null,
        reviewId: reviewManifest.reviewId ?? null,
      }
    : reviewManifest.masterplanGeneratedAt !== masterplanManifest?.generatedAt ||
        reviewManifest.edgeGeneratedAt !== edgeSummary?.generatedAt ||
        reviewManifest.sourceFingerprint !== currentMasterplanFingerprint
      ? {state: 'stale', reviewId: reviewManifest.reviewId ?? null}
      : {
          state: 'current-full',
          reviewId: reviewManifest.reviewId ?? null,
          cardCount: reviewManifest.cards?.length ?? null,
          totalFrames: reviewManifest.totalFrames ?? null,
          totalVideos: reviewManifest.totalVideos ?? null,
          generatedAt: reviewManifest.generatedAt ?? null,
        };

const visualReviewState = !visualReview
  ? {state: 'missing'}
  : visualReview.reviewId !== reviewManifest?.reviewId
    ? {
        state: 'stale',
        reviewId: visualReview.reviewId ?? null,
        expectedReviewId: reviewManifest?.reviewId ?? null,
      }
    : visualReview.completedCardCount !== 28 || visualReview.cardCount !== 28
      ? {
          state: 'incomplete',
          completedCardCount: visualReview.completedCardCount ?? 0,
          cardCount: visualReview.cardCount ?? null,
        }
      : {
          state: 'complete',
          reviewId: visualReview.reviewId,
          reviewedAt: visualReview.reviewedAt ?? null,
        };

const finalizationState = !finalization
  ? {state: 'missing'}
  : finalization.status !== 'passed'
    ? {state: finalization.status ?? 'invalid', error: finalization.error ?? null}
    : finalization.gitHead !== gitHead ||
        finalization.reviewId !== reviewManifest?.reviewId ||
        finalization.technicalArtifactsReverified !== true ||
        finalization.manualVisualReviewVerified !== true
      ? {
          state: 'stale',
          gitHead: finalization.gitHead ?? null,
          reviewId: finalization.reviewId ?? null,
        }
      : {
          state: 'passed',
          gitHead: finalization.gitHead,
          reviewId: finalization.reviewId,
          finalizedAt: finalization.finalizedAt ?? null,
        };

let nextAction;
if (!gitHead) {
  nextAction = {
    code: 'git-required',
    command: null,
    message: 'Release-Status benötigt ein Git-Repository mit auflösbarem HEAD.',
  };
} else if (!trackedWorktreeClean) {
  nextAction = {
    code: 'commit-tracked-changes',
    command: 'git status --short',
    message: 'Getrackte Änderungen committen oder verwerfen, bevor ein Release-Nachweis erzeugt wird.',
  };
} else if (summaries.full.state !== 'passed') {
  nextAction = {
    code: 'run-full-release',
    command: 'node scripts/run-content-release.mjs full',
    message: 'Frischen technischen Full-Release für den aktuellen Git-HEAD erzeugen.',
  };
} else if (
  masterplanState.state !== 'current' ||
  masterplanState.mode !== 'all' ||
  masterplanState.prototypeCount !== 22 ||
  edgeState.state !== 'current' ||
  edgeState.mode !== 'all' ||
  edgeState.caseCount !== 6 ||
  reviewState.state !== 'current-full'
) {
  nextAction = {
    code: 'rebuild-full-artifacts',
    command: 'node scripts/run-content-release.mjs full',
    message: 'Full-Artefakte oder Review-Galerie sind unvollständig/veraltet und müssen neu erzeugt werden.',
  };
} else if (visualReviewState.state !== 'complete') {
  nextAction = {
    code: 'complete-visual-review',
    command: null,
    message: 'out/content-review-gallery/index.html öffnen, 28/28 Karten prüfen und visual-review.json exportieren.',
  };
} else if (finalizationState.state !== 'passed') {
  nextAction = {
    code: 'finalize-release',
    command: 'node scripts/finalize-content-release.mjs',
    message: 'Technischen Full-Nachweis und 28/28 Visual Review gemeinsam finalisieren.',
  };
} else {
  nextAction = {
    code: 'release-complete',
    command: null,
    message: 'Technischer Full-Release und 28/28 Visual Review sind für den aktuellen Git-HEAD finalisiert.',
  };
}

const report = {
  version: 1,
  gitHead,
  trackedWorktreeClean,
  summaries,
  masterplan: masterplanState,
  edgeCases: edgeState,
  reviewGallery: reviewState,
  visualReview: visualReviewState,
  finalization: finalizationState,
  nextAction,
};

if (jsonOnly) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

console.log('Content Release Status');
console.log('======================');
console.log(`Git HEAD: ${gitHead ?? 'nicht verfügbar'}`);
console.log(`Tracked Worktree: ${trackedWorktreeClean ? 'sauber' : 'DIRTY'}`);
console.log(`Technical Full: ${summaries.full.state}`);
console.log(`Masterplan: ${masterplanState.state}${masterplanState.mode ? ` · ${masterplanState.mode}` : ''}`);
console.log(`Edge Cases: ${edgeState.state}${edgeState.mode ? ` · ${edgeState.mode}` : ''}`);
console.log(`Review Gallery: ${reviewState.state}`);
console.log(`Visual Review: ${visualReviewState.state}`);
console.log(`Finalization: ${finalizationState.state}`);
console.log('');
console.log(`Nächster Schritt: ${nextAction.message}`);
if (nextAction.command) console.log(`Befehl: ${nextAction.command}`);
console.log('');
console.log('JSON: node scripts/content-release-status.mjs --json');
