import {readFile, stat, writeFile} from 'node:fs/promises';
import {extname, resolve} from 'node:path';
import {
  describeMotionArtifactFailure,
  inspectMotionArtifactBuffer,
} from './motion-artifact-validation.mjs';
import {
  MAXIMAL_ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT,
  MAXIMAL_ANIMATION_LIBRARY_RENDER_CONFIG as CONFIG,
  MAXIMAL_ANIMATION_LIBRARY_SOURCE_FINGERPRINT,
} from './maximal-animation-library-render-config.mjs';

const OUTPUT_DIR = process.env.MAXIMAL_ANIMATION_LIBRARY_OUTPUT_DIR ?? CONFIG.outputDir;
const planPath = resolve(OUTPUT_DIR, 'render-plan.json');

const readJson = async (path, label) => {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${label} konnte nicht gelesen werden: ${message}`);
  }
};

const plan = await readJson(planPath, 'Renderplan');
const planProblems = [];
if (plan.prototypeCount !== 66) planProblems.push('Renderplan enthält nicht 66 Animationen.');
if (plan.sourceFingerprint !== MAXIMAL_ANIMATION_LIBRARY_SOURCE_FINGERPRINT) {
  planProblems.push('Renderplan stammt aus einem älteren Quellstand.');
}
if (JSON.stringify(plan.checkpoints) !== JSON.stringify(CONFIG.defaults.checkpoints)) {
  planProblems.push('Renderplan enthält nicht die vollständigen sieben Prüfframes.');
}
if (JSON.stringify(plan.prototypes) !== JSON.stringify(CONFIG.prototypes)) {
  planProblems.push('Renderplan und Animationsmanifest unterscheiden sich.');
}

const expectedArtifacts = [];
for (const prototype of CONFIG.prototypes) {
  for (const frame of CONFIG.defaults.checkpoints) {
    expectedArtifacts.push({
      kind: 'still',
      animationId: prototype.animationId,
      frame,
      path: resolve(
        OUTPUT_DIR,
        prototype.animationId,
        'stills',
        `frame-${String(frame).padStart(3, '0')}.png`,
      ),
    });
  }
  expectedArtifacts.push({
    kind: 'video',
    animationId: prototype.animationId,
    frame: null,
    path: resolve(
      OUTPUT_DIR,
      prototype.animationId,
      `${prototype.animationId}.mp4`,
    ),
  });
}

if (expectedArtifacts.length !== MAXIMAL_ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT) {
  throw new Error(
    `Interner Artefaktvertrag falsch: ${expectedArtifacts.length}/${MAXIMAL_ANIMATION_LIBRARY_EXPECTED_ARTIFACT_COUNT}.`,
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
      failure: inspection.valid ? null : describeMotionArtifactFailure(inspection),
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

const perPrototype = CONFIG.prototypes.map((prototype) => {
  const artifacts = results.filter(
    (result) => result.animationId === prototype.animationId,
  );
  return {
    compositionId: prototype.compositionId,
    animationId: prototype.animationId,
    expectedArtifacts: artifacts.length,
    passedArtifacts: artifacts.filter((artifact) => artifact.valid).length,
    failedArtifacts: artifacts.filter((artifact) => !artifact.valid).length,
    passed: artifacts.every((artifact) => artifact.valid),
  };
});

const passedArtifacts = results.filter((result) => result.valid).length;
const report = {
  version: 1,
  prototypeCount: CONFIG.prototypes.length,
  sourceFingerprint: MAXIMAL_ANIMATION_LIBRARY_SOURCE_FINGERPRINT,
  expectedArtifacts: expectedArtifacts.length,
  passedArtifacts,
  failedArtifacts: expectedArtifacts.length - passedArtifacts,
  planValid: planProblems.length === 0,
  passed:
    planProblems.length === 0 &&
    passedArtifacts === expectedArtifacts.length,
  planProblems,
  perPrototype,
  artifacts: results,
};

await writeFile(
  resolve(OUTPUT_DIR, 'release-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8',
);

if (!report.passed) {
  for (const problem of planProblems) console.error(`- ${problem}`);
  for (const prototype of perPrototype.filter((item) => !item.passed)) {
    console.error(
      `- ${prototype.animationId}: ${prototype.passedArtifacts}/${prototype.expectedArtifacts} gültig`,
    );
  }
  console.error(
    `Freigabe fehlgeschlagen: ${passedArtifacts}/${expectedArtifacts.length} Artefakte gültig.`,
  );
  process.exit(1);
}

console.log(
  `Technische Freigabe bestanden: ${passedArtifacts}/${expectedArtifacts.length} Artefakte gültig.`,
);
