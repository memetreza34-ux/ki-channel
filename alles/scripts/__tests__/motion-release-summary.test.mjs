import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {RENDER_MANIFEST_FINGERPRINT} from '../motion-render-config.mjs';
import {
  combineMotionReleaseReports,
  EXPECTED_MOTION_RELEASE_COUNTS,
} from '../motion-release-summary.mjs';
import {MOTION_SOURCE_FINGERPRINT} from '../motion-source-fingerprint.mjs';

const createReport = (expectedFiles, invalidFiles = 0) => ({
  generatedAt: '2026-08-03T00:00:00.000Z',
  renderManifestFingerprint: RENDER_MANIFEST_FINGERPRINT,
  motionSourceFingerprint: MOTION_SOURCE_FINGERPRINT,
  summary: {
    expectedFiles,
    validFiles: expectedFiles - invalidFiles,
    invalidFiles,
    passed: invalidFiles === 0,
  },
});

describe('Kombinierter Motion-Freigabebericht', () => {
  it('bestätigt exakt 66 gültige Render-Artefakte', () => {
    const result = combineMotionReleaseReports({
      individual: createReport(EXPECTED_MOTION_RELEASE_COUNTS.individual),
      timeline: createReport(EXPECTED_MOTION_RELEASE_COUNTS.timeline),
    });

    assert.equal(EXPECTED_MOTION_RELEASE_COUNTS.individual, 60);
    assert.equal(EXPECTED_MOTION_RELEASE_COUNTS.timeline, 6);
    assert.equal(result.summary.expectedFiles, 66);
    assert.equal(result.summary.validFiles, 66);
    assert.equal(result.summary.invalidFiles, 0);
    assert.equal(result.summary.passed, true);
    assert.equal(result.renderManifestFingerprint, RENDER_MANIFEST_FINGERPRINT);
    assert.equal(result.motionSourceFingerprint, MOTION_SOURCE_FINGERPRINT);
  });

  it('schlägt fehl, sobald ein Teilbericht ungültige Dateien enthält', () => {
    const result = combineMotionReleaseReports({
      individual: createReport(EXPECTED_MOTION_RELEASE_COUNTS.individual, 1),
      timeline: createReport(EXPECTED_MOTION_RELEASE_COUNTS.timeline),
    });

    assert.equal(result.summary.validFiles, 65);
    assert.equal(result.summary.invalidFiles, 1);
    assert.equal(result.summary.passed, false);
  });

  it('lehnt veraltete Manifest-Fingerprints ab', () => {
    const stale = createReport(EXPECTED_MOTION_RELEASE_COUNTS.individual);
    stale.renderManifestFingerprint = 'stale-manifest';

    assert.throws(
      () =>
        combineMotionReleaseReports({
          individual: stale,
          timeline: createReport(EXPECTED_MOTION_RELEASE_COUNTS.timeline),
        }),
      /anderen Render-Manifest erzeugt/,
    );
  });

  it('lehnt Berichte aus einem anderen Motion-Quellstand ab', () => {
    const stale = createReport(EXPECTED_MOTION_RELEASE_COUNTS.timeline);
    stale.motionSourceFingerprint = 'stale-source';

    assert.throws(
      () =>
        combineMotionReleaseReports({
          individual: createReport(EXPECTED_MOTION_RELEASE_COUNTS.individual),
          timeline: stale,
        }),
      /anderen Motion-Quellstand erzeugt/,
    );
  });

  it('lehnt veraltete oder inkonsistente Datei-Zähler ab', () => {
    assert.throws(
      () =>
        combineMotionReleaseReports({
          individual: createReport(59),
          timeline: createReport(EXPECTED_MOTION_RELEASE_COUNTS.timeline),
        }),
      /laut Render-Manifest müssen es 60 sein/,
    );

    const inconsistent = createReport(EXPECTED_MOTION_RELEASE_COUNTS.individual);
    inconsistent.summary.validFiles = 59;
    assert.throws(
      () =>
        combineMotionReleaseReports({
          individual: inconsistent,
          timeline: createReport(EXPECTED_MOTION_RELEASE_COUNTS.timeline),
        }),
      /inkonsistente Datei-Zähler/,
    );
  });
});
