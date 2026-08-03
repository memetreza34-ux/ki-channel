import {
  DEFAULT_CHECKPOINTS,
  RENDER_MANIFEST_FINGERPRINT,
  TIMELINE_TARGET,
  VISUAL_TYPES,
} from './motion-render-config.mjs';

export const EXPECTED_MOTION_RELEASE_COUNTS = Object.freeze({
  individual: VISUAL_TYPES.length * (DEFAULT_CHECKPOINTS.length + 1),
  timeline: TIMELINE_TARGET.checkpoints.length + 1,
});

const assertReportSummary = (report, name, expectedFiles) => {
  if (!report || typeof report !== 'object' || !report.summary) {
    throw new Error(`${name} enthält keine gültige summary.`);
  }

  if (report.renderManifestFingerprint !== RENDER_MANIFEST_FINGERPRINT) {
    throw new Error(
      `${name} wurde mit einem anderen Render-Manifest erzeugt und muss neu erstellt werden.`,
    );
  }

  const {expectedFiles: reportedExpected, validFiles, invalidFiles, passed} = report.summary;
  if (
    !Number.isInteger(reportedExpected) ||
    !Number.isInteger(validFiles) ||
    !Number.isInteger(invalidFiles) ||
    typeof passed !== 'boolean'
  ) {
    throw new Error(`${name} enthält ungültige Summary-Werte.`);
  }

  if (reportedExpected !== expectedFiles) {
    throw new Error(
      `${name} erwartet ${reportedExpected} Dateien, laut Render-Manifest müssen es ${expectedFiles} sein.`,
    );
  }

  if (validFiles + invalidFiles !== reportedExpected) {
    throw new Error(`${name} besitzt inkonsistente Datei-Zähler.`);
  }

  if (passed !== (invalidFiles === 0 && validFiles === reportedExpected)) {
    throw new Error(`${name} besitzt einen inkonsistenten passed-Status.`);
  }

  return {reportedExpected, validFiles, invalidFiles, passed};
};

export const combineMotionReleaseReports = ({individual, timeline}) => {
  const individualSummary = assertReportSummary(
    individual,
    'release-report.json',
    EXPECTED_MOTION_RELEASE_COUNTS.individual,
  );
  const timelineSummary = assertReportSummary(
    timeline,
    'timeline-release-report.json',
    EXPECTED_MOTION_RELEASE_COUNTS.timeline,
  );
  const expectedFiles =
    individualSummary.reportedExpected + timelineSummary.reportedExpected;
  const validFiles = individualSummary.validFiles + timelineSummary.validFiles;
  const invalidFiles = individualSummary.invalidFiles + timelineSummary.invalidFiles;

  return {
    generatedAt: new Date().toISOString(),
    renderManifestFingerprint: RENDER_MANIFEST_FINGERPRINT,
    sources: {
      individualGeneratedAt: individual.generatedAt ?? null,
      timelineGeneratedAt: timeline.generatedAt ?? null,
    },
    reports: {
      individual: individualSummary,
      timeline: timelineSummary,
    },
    summary: {
      expectedFiles,
      validFiles,
      invalidFiles,
      passed:
        individualSummary.passed &&
        timelineSummary.passed &&
        validFiles === expectedFiles &&
        invalidFiles === 0,
    },
  };
};
