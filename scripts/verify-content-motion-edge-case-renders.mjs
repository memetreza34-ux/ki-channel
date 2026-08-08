import {access, readFile, readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {getEdgeCaseSourceFingerprint} from './edge-case-release-utils.mjs';
import {
  assertMasterplanMp4,
  assertMasterplanPng,
} from './masterplan-content-release-utils.mjs';

const requestedMode = process.argv[2] ?? 'full';
const VALID_MODES = new Set(['smoke', 'full']);
if (!VALID_MODES.has(requestedMode)) {
  throw new Error(
    'Aufruf: node scripts/verify-content-motion-edge-case-renders.mjs [smoke|full]',
  );
}

const outputRoot = resolve('out/content-motion-edge-cases');
const summaryPath = resolve(outputRoot, 'edge-case-render-summary.json');
const edgeConfigPath = resolve(
  'ki/src/animation-library/content-motion-edge-cases.json',
);
const renderConfigPath = resolve(
  'ki/src/animation-library/prototype-render-config.json',
);

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const [summary, edgeConfig, renderConfig, currentSourceFingerprint] =
  await Promise.all([
    readJson(summaryPath),
    readJson(edgeConfigPath),
    readJson(renderConfigPath),
    getEdgeCaseSourceFingerprint(),
  ]);

if (
  summary.version !== 1 ||
  !Array.isArray(summary.cases) ||
  !Array.isArray(edgeConfig.cases)
) {
  throw new Error('Edge-Case-Render-Summary oder Edge-Case-Config ist ungültig.');
}
if (!summary.generatedAt || Number.isNaN(Date.parse(summary.generatedAt))) {
  throw new Error('Edge-Case-Render-Summary benötigt einen gültigen generatedAt-Zeitstempel.');
}
if (summary.sourceFingerprint !== currentSourceFingerprint) {
  throw new Error(
    'Edge-Case-Render-Artefakte sind veraltet: Source-Fingerprint stimmt nicht mit dem aktuellen Edge-Case-/Produktionspfad überein.',
  );
}
if (edgeConfig.cases.length !== 6) {
  throw new Error(
    `Edge-Case-Config benötigt exakt 6 Fälle, gefunden: ${edgeConfig.cases.length}.`,
  );
}
if (summary.caseCount !== 6 || summary.cases.length !== 6) {
  throw new Error(
    `Edge-Case-Render benötigt 6 Fälle, gefunden: ${summary.caseCount}/${summary.cases.length}.`,
  );
}

const expectedMode = requestedMode === 'full' ? 'all' : 'smoke';
if (summary.mode !== expectedMode) {
  throw new Error(
    `Edge-Case-Render-Verifikation erwartet mode=${expectedMode}, gefunden: ${summary.mode}.`,
  );
}

const checkpointKey = requestedMode === 'full'
  ? 'checkpoints'
  : 'smokeCheckpoints';
const expectedCheckpoints = renderConfig?.defaults?.[checkpointKey];
if (!Array.isArray(expectedCheckpoints) || expectedCheckpoints.length === 0) {
  throw new Error(`Render-Config enthält keine gültigen ${checkpointKey}.`);
}
const expectedFrameNames = expectedCheckpoints.map(
  (frame) => `frame-${String(frame).padStart(3, '0')}.png`,
);

const expectedById = new Map(
  edgeConfig.cases.map((edgeCase) => [edgeCase.id, edgeCase]),
);
const seen = new Set();
let checkedPngs = 0;
let checkedVideos = 0;

for (const result of summary.cases) {
  if (!result?.id || seen.has(result.id)) {
    throw new Error(`Ungültige oder doppelte Edge-Case-ID: ${result?.id}.`);
  }
  seen.add(result.id);

  const expected = expectedById.get(result.id);
  if (!expected) {
    throw new Error(`Unbekannter Edge Case im Render-Summary: ${result.id}.`);
  }
  if (result.animationId !== expected.animationId) {
    throw new Error(
      `${result.id}: animationId ${result.animationId} statt ${expected.animationId}.`,
    );
  }
  if (result.mode !== expectedMode) {
    throw new Error(
      `${result.id}: Summary-Modus ${result.mode} statt ${expectedMode}.`,
    );
  }

  const caseOutputRoot = resolve(result.outputRoot);
  const propsPath = resolve(outputRoot, '.inputs', `${result.id}.json`);
  const inputProps = await readJson(propsPath);
  if (JSON.stringify(inputProps?.content) !== JSON.stringify(expected.content)) {
    throw new Error(`${result.id}: gespeicherte Edge-Case-Props sind veraltet.`);
  }

  const normalizedProps = await readJson(
    resolve(caseOutputRoot, 'render-props.json'),
  );
  if (JSON.stringify(normalizedProps?.content) !== JSON.stringify(expected.content)) {
    throw new Error(`${result.id}: normalisierte Render-Props stimmen nicht.`);
  }

  const request = await readJson(resolve(caseOutputRoot, 'render-request.json'));
  if (
    request.animationId !== expected.animationId ||
    request.mode !== expectedMode
  ) {
    throw new Error(`${result.id}: Render-Request stimmt nicht mit dem Edge Case überein.`);
  }

  const actualFrameNames = (await readdir(caseOutputRoot))
    .filter((fileName) => /^frame-\d+\.png$/i.test(fileName))
    .sort();
  if (JSON.stringify(actualFrameNames) !== JSON.stringify([...expectedFrameNames].sort())) {
    throw new Error(
      `${result.id}: Frame-Menge stimmt nicht mit ${checkpointKey} überein. Erwartet ${expectedFrameNames.join(', ')}, gefunden ${actualFrameNames.join(', ')}.`,
    );
  }
  for (const frameName of expectedFrameNames) {
    await assertMasterplanPng(resolve(caseOutputRoot, frameName));
    checkedPngs += 1;
  }

  const videoPath = resolve(caseOutputRoot, 'content-matched.mp4');
  const hasVideo = await exists(videoPath);
  if (requestedMode === 'full') {
    if (!hasVideo) {
      throw new Error(`${result.id}: Full-Release-Video fehlt.`);
    }
    await assertMasterplanMp4(videoPath);
    checkedVideos += 1;
  } else if (hasVideo) {
    throw new Error(
      `${result.id}: Smoke-Render enthält unerwartetes Video; möglicher Stale-Artifact-Leak.`,
    );
  }
}

for (const edgeCase of edgeConfig.cases) {
  if (!seen.has(edgeCase.id)) {
    throw new Error(`Edge-Case-Render fehlt für ${edgeCase.id}.`);
  }
}

console.log(
  `[edge-case-render] ${requestedMode}-Verifikation bestanden: Source-Fingerprint ${summary.sourceFingerprint}, ${seen.size} Fälle, ${checkedPngs} PNGs, ${checkedVideos} Videos.`,
);
