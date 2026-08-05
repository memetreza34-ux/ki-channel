import {readFile, stat, writeFile} from 'node:fs/promises';
import {extname, resolve} from 'node:path';
import {
  describeMotionArtifactFailure,
  inspectMotionArtifactBuffer,
} from './motion-artifact-validation.mjs';
import {
  WHY_AI_REEL_CONFIG,
  WHY_AI_REEL_SOURCE_FINGERPRINT,
} from './why-ai-reel-config.mjs';

const OUTPUT_DIR = process.env.WHY_AI_REEL_OUTPUT_DIR ?? WHY_AI_REEL_CONFIG.outputDir;
const planPath = resolve(OUTPUT_DIR, 'render-plan.json');

const readJson = async (path, label) => {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${label} konnte nicht gelesen werden: ${message}`);
  }
};

const plan = await readJson(planPath, 'Reel-Renderplan');
const planProblems = [];
if (plan.reelId !== WHY_AI_REEL_CONFIG.reelId) {
  planProblems.push('Reel-ID des Renderplans ist falsch.');
}
if (plan.compositionId !== WHY_AI_REEL_CONFIG.compositionId) {
  planProblems.push('Composition-ID des Renderplans ist falsch.');
}
if (plan.sourceFingerprint !== WHY_AI_REEL_SOURCE_FINGERPRINT) {
  planProblems.push('Renderplan stammt aus einem älteren Reel-Quellstand.');
}
if (
  JSON.stringify(plan.checkpoints) !== JSON.stringify(WHY_AI_REEL_CONFIG.checkpoints)
) {
  planProblems.push('Renderplan enthält nicht die vollständigen 32 Prüf-Frames.');
}

const expectedArtifacts = [
  ...WHY_AI_REEL_CONFIG.checkpoints.map((frame) => ({
    kind: 'still',
    frame,
    path: resolve(OUTPUT_DIR, 'stills', `frame-${String(frame).padStart(4, '0')}.png`),
  })),
  {
    kind: 'video',
    frame: null,
    path: resolve(OUTPUT_DIR, 'why-ai-reads-differently.mp4'),
  },
];

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
const report = {
  version: 1,
  reelId: WHY_AI_REEL_CONFIG.reelId,
  compositionId: WHY_AI_REEL_CONFIG.compositionId,
  sourceFingerprint: WHY_AI_REEL_SOURCE_FINGERPRINT,
  expectedArtifacts: expectedArtifacts.length,
  passedArtifacts,
  failedArtifacts,
  planValid: planProblems.length === 0,
  passed: planProblems.length === 0 && failedArtifacts === 0,
  planProblems,
  artifacts: results,
};

await writeFile(
  resolve(OUTPUT_DIR, 'release-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8',
);

if (!report.passed) {
  for (const problem of planProblems) console.error(`- ${problem}`);
  for (const result of results.filter((entry) => !entry.valid)) {
    console.error(`- ${result.path}: ${result.failure}`);
  }
  console.error(
    `Reel-Freigabe fehlgeschlagen: ${passedArtifacts}/${expectedArtifacts.length} Artefakte gültig.`,
  );
  process.exit(1);
}

console.log(
  `Reel-Freigabe technisch bestanden: ${passedArtifacts}/${expectedArtifacts.length} Artefakte gültig.`,
);
