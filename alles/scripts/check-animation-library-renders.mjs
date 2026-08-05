import {readFile, stat, writeFile} from 'node:fs/promises';
import {extname, resolve} from 'node:path';
import {
  describeMotionArtifactFailure,
  inspectMotionArtifactBuffer,
} from './motion-artifact-validation.mjs';
import {
  ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT,
  ANIMATION_LIBRARY_RENDER_CONFIG,
  ANIMATION_LIBRARY_SOURCE_FINGERPRINT,
} from './animation-library-render-config.mjs';

const OUTPUT_DIR =
  process.env.ANIMATION_LIBRARY_OUTPUT_DIR ??
  ANIMATION_LIBRARY_RENDER_CONFIG.outputDir;

const readJson = async (path, label) => {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${label} konnte nicht gelesen werden: ${message}`);
  }
};

const planPath = resolve(OUTPUT_DIR, 'render-plan.json');
const plan = await readJson(planPath, 'Animation-Library-Renderplan');
const planProblems = [];

if (plan.mode !== 'all' && plan.mode !== 'stills' && plan.mode !== 'videos') {
  planProblems.push(
    'Renderplan stammt nicht aus einem vollständigen Still-/Video-Lauf.',
  );
}
if (plan.sourceFingerprint !== ANIMATION_LIBRARY_SOURCE_FINGERPRINT) {
  planProblems.push(
    'Renderplan stammt aus einem älteren Animation-Library-Quellstand.',
  );
}
if (
  !Array.isArray(plan.prototypes) ||
  plan.prototypes.length !== ANIMATION_LIBRARY_RENDER_CONFIG.prototypes.length
) {
  planProblems.push('Renderplan enthält nicht alle registrierten Prototypen.');
}

const expectedArtifacts = ANIMATION_LIBRARY_RENDER_CONFIG.prototypes.flatMap(
  (prototype) => {
    const directory = resolve(OUTPUT_DIR, prototype.animationId);
    return [
      ...ANIMATION_LIBRARY_RENDER_CONFIG.defaults.checkpoints.map((frame) => ({
        kind: 'still',
        animationId: prototype.animationId,
        compositionId: prototype.compositionId,
        frame,
        path: resolve(
          directory,
          `frame-${String(frame).padStart(3, '0')}.png`,
        ),
      })),
      {
        kind: 'video',
        animationId: prototype.animationId,
        compositionId: prototype.compositionId,
        frame: null,
        path: resolve(directory, 'prototype.mp4'),
      },
    ];
  },
);

if (expectedArtifacts.length !== ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT) {
  throw new Error(
    `Interner Artefaktvertrag ist inkonsistent: ${expectedArtifacts.length} statt ${ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT}.`,
  );
}

const results = [];
for (const artifact of expectedArtifacts) {
  try {
    const metadata = await stat(artifact.path);
    const bytes = await readFile(artifact.path);
    const inspection = inspectMotionArtifactBuffer({
      extension: extname(artifact.path),
      sizeBytes: metadata.size,
      header: bytes.subarray(0, 64),
    });
    results.push({
      ...artifact,
      sizeBytes: metadata.size,
      ...inspection,
      failure: inspection.valid
        ? null
        : describeMotionArtifactFailure(inspection),
    });
  } catch (error) {
    results.push({
      ...artifact,
      sizeBytes: 0,
      mediaType: artifact.kind === 'still' ? 'png' : 'mp4',
      signatureValid: false,
      dimensionsValid: artifact.kind === 'still' ? false : null,
      minimumSizeValid: false,
      width: null,
      height: null,
      valid: false,
      failure: error instanceof Error ? error.message : String(error),
    });
  }
}

const passedArtifacts = results.filter((result) => result.valid).length;
const failedArtifacts = results.length - passedArtifacts;
const prototypeReports = ANIMATION_LIBRARY_RENDER_CONFIG.prototypes.map(
  (prototype) => {
    const prototypeArtifacts = results.filter(
      (result) => result.animationId === prototype.animationId,
    );
    const passed = prototypeArtifacts.filter((artifact) => artifact.valid).length;
    return {
      animationId: prototype.animationId,
      compositionId: prototype.compositionId,
      expectedArtifacts: prototypeArtifacts.length,
      passedArtifacts: passed,
      failedArtifacts: prototypeArtifacts.length - passed,
      passed: passed === prototypeArtifacts.length,
    };
  },
);

const report = {
  version: 1,
  sourceFingerprint: ANIMATION_LIBRARY_SOURCE_FINGERPRINT,
  expectedArtifacts: expectedArtifacts.length,
  passedArtifacts,
  failedArtifacts,
  planValid: planProblems.length === 0,
  passed: planProblems.length === 0 && failedArtifacts === 0,
  planProblems,
  prototypes: prototypeReports,
  artifacts: results,
};

await writeFile(
  resolve(OUTPUT_DIR, 'release-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8',
);

if (!report.passed) {
  for (const problem of planProblems) console.error(`- ${problem}`);
  for (const result of results.filter((artifact) => !artifact.valid)) {
    console.error(`- ${result.path}: ${result.failure}`);
  }
  console.error(
    `Animation-Library-Freigabe fehlgeschlagen: ${passedArtifacts}/${expectedArtifacts.length} Artefakte gültig.`,
  );
  process.exit(1);
}

console.log(
  `Animation-Library technisch bestanden: ${passedArtifacts}/${expectedArtifacts.length} Artefakte gültig.`,
);
