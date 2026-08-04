import {readFile, stat, writeFile} from 'node:fs/promises';
import {extname, resolve} from 'node:path';
import {
  describeMotionArtifactFailure,
  inspectMotionArtifactBuffer,
} from './motion-artifact-validation.mjs';
import {
  MICRO_MOTION_EXPECTED_ARTIFACT_COUNT,
  MICRO_MOTION_RENDER_CONFIG as CONFIG,
  MICRO_MOTION_SOURCE_FINGERPRINT,
} from './micro-motion-render-config.mjs';

const OUTPUT_DIR = process.env.MICRO_MOTION_OUTPUT_DIR ?? CONFIG.outputDir;
const plan = JSON.parse(
  await readFile(resolve(OUTPUT_DIR, 'render-plan.json'), 'utf8'),
);
const planProblems = [];
if (plan.mechanismCount !== CONFIG.mechanisms.length) {
  planProblems.push(`Renderplan enthält nicht ${CONFIG.mechanisms.length} Mechanismen.`);
}
if (plan.sourceFingerprint !== MICRO_MOTION_SOURCE_FINGERPRINT) {
  planProblems.push('Renderplan stammt aus einem älteren Quellstand.');
}
if (JSON.stringify(plan.checkpoints) !== JSON.stringify(CONFIG.defaults.checkpoints)) {
  planProblems.push('Renderplan enthält nicht die vollständigen Prüfframes.');
}
if (JSON.stringify(plan.mechanisms) !== JSON.stringify(CONFIG.mechanisms)) {
  planProblems.push('Renderplan und Mechanismenmanifest unterscheiden sich.');
}

const expectedArtifacts = [];
for (const mechanism of CONFIG.mechanisms) {
  for (const frame of CONFIG.defaults.checkpoints) {
    expectedArtifacts.push({
      kind: 'still',
      mechanismId: mechanism.mechanismId,
      frame,
      path: resolve(
        OUTPUT_DIR,
        mechanism.mechanismId,
        'stills',
        `frame-${String(frame).padStart(3, '0')}.png`,
      ),
    });
  }
  expectedArtifacts.push({
    kind: 'video',
    mechanismId: mechanism.mechanismId,
    frame: null,
    path: resolve(
      OUTPUT_DIR,
      mechanism.mechanismId,
      `${mechanism.mechanismId}.mp4`,
    ),
  });
}

if (expectedArtifacts.length !== MICRO_MOTION_EXPECTED_ARTIFACT_COUNT) {
  throw new Error(
    `Interner Mikroanimationsvertrag falsch: ${expectedArtifacts.length}/${MICRO_MOTION_EXPECTED_ARTIFACT_COUNT}.`,
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

const perMechanism = CONFIG.mechanisms.map((mechanism) => {
  const artifacts = results.filter(
    (result) => result.mechanismId === mechanism.mechanismId,
  );
  return {
    compositionId: mechanism.compositionId,
    mechanismId: mechanism.mechanismId,
    expectedArtifacts: artifacts.length,
    passedArtifacts: artifacts.filter((artifact) => artifact.valid).length,
    failedArtifacts: artifacts.filter((artifact) => !artifact.valid).length,
    passed: artifacts.every((artifact) => artifact.valid),
  };
});

const passedArtifacts = results.filter((result) => result.valid).length;
const report = {
  version: 1,
  mechanismCount: CONFIG.mechanisms.length,
  sourceFingerprint: MICRO_MOTION_SOURCE_FINGERPRINT,
  expectedArtifacts: expectedArtifacts.length,
  passedArtifacts,
  failedArtifacts: expectedArtifacts.length - passedArtifacts,
  planValid: planProblems.length === 0,
  passed:
    planProblems.length === 0 &&
    passedArtifacts === expectedArtifacts.length,
  planProblems,
  perMechanism,
  artifacts: results,
};

await writeFile(
  resolve(OUTPUT_DIR, 'release-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8',
);

if (!report.passed) {
  for (const problem of planProblems) console.error(`- ${problem}`);
  for (const mechanism of perMechanism.filter((item) => !item.passed)) {
    console.error(
      `- ${mechanism.mechanismId}: ${mechanism.passedArtifacts}/${mechanism.expectedArtifacts} gültig`,
    );
  }
  console.error(
    `Mikroanimations-Freigabe fehlgeschlagen: ${passedArtifacts}/${expectedArtifacts.length} Artefakte gültig.`,
  );
  process.exit(1);
}

console.log(
  `Mikroanimations-Freigabe bestanden: ${passedArtifacts}/${expectedArtifacts.length} Artefakte gültig.`,
);
