import {spawn} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {loadCreatePrototypeRenderProps} from './load-prototype-render-payload.mjs';
import {loadPrototypeRuntimeContentAssociation} from './load-prototype-runtime-content-association.mjs';
import {loadPrototypeRuntimeContentDeriver} from './load-prototype-runtime-content-deriver.mjs';
import {loadPrototypeRuntimeContentSanitizer} from './load-prototype-runtime-content-sanitizer.mjs';
import {
  getMasterplanContentSourceFingerprint,
  getMasterplanFixtureContent,
  MASTERPLAN_CONTENT_OUTPUT_ROOT,
  readMasterplanJson,
} from './masterplan-content-release-utils.mjs';

const [requestedMode = 'plan', requestedAnimationId] = process.argv.slice(2);
const VALID_MODES = new Set(['plan', 'smoke', 'stills', 'video', 'all']);
if (!VALID_MODES.has(requestedMode)) {
  throw new Error(
    'Aufruf: node scripts/render-masterplan-content-release.mjs [plan|smoke|stills|video|all] [animationId]',
  );
}

const config = await readMasterplanJson(
  'ki/src/animation-library/prototype-render-config.json',
);
const fixtureConfig = await readMasterplanJson(
  'ki/src/animation-library/content-render-fixtures.json',
);
if (!Array.isArray(config.prototypes) || !Array.isArray(fixtureConfig.fixtures)) {
  throw new Error('Prototype-Render-Config oder Content-Fixtures sind ungültig.');
}

const prototypes = requestedAnimationId
  ? config.prototypes.filter(
      (prototype) => prototype.animationId === requestedAnimationId,
    )
  : config.prototypes;
if (prototypes.length === 0) {
  throw new Error(`Unbekannte Animation: ${requestedAnimationId}`);
}

const fixtureByAnimationId = new Map(
  fixtureConfig.fixtures.map((fixture) => [fixture.animationId, fixture]),
);
const derivePrototypeRuntimeContent =
  await loadPrototypeRuntimeContentDeriver();
const sanitizePrototypeRuntimeContent =
  await loadPrototypeRuntimeContentSanitizer();
const associatePrototypeRuntimeContent =
  await loadPrototypeRuntimeContentAssociation();
const createPrototypeRenderProps = await loadCreatePrototypeRenderProps();
const sourceFingerprint = await getMasterplanContentSourceFingerprint();
await mkdir(MASTERPLAN_CONTENT_OUTPUT_ROOT, {recursive: true});

const run = (args, env) =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: {...process.env, ...env},
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`Child-Prozess endete mit Code ${code}.`));
    });
  });

const results = [];
for (const prototype of prototypes) {
  const fixture = fixtureByAnimationId.get(prototype.animationId);
  if (!fixture) throw new Error(`Content-Fixture fehlt für ${prototype.animationId}.`);
  const sourceContent = getMasterplanFixtureContent(fixture);
  if (!sourceContent?.spokenText || !sourceContent?.meaningContract) {
    throw new Error(
      `Content-Fixture ${prototype.animationId} benötigt spokenText und meaningContract.`,
    );
  }

  const derived = derivePrototypeRuntimeContent({
    animationId: prototype.animationId,
    spokenText: sourceContent.spokenText,
    meaningContract: sourceContent.meaningContract,
  });
  const sanitized = sanitizePrototypeRuntimeContent({
    animationId: prototype.animationId,
    spokenText: sourceContent.spokenText,
    derived,
  });
  const associated = associatePrototypeRuntimeContent({
    animationId: prototype.animationId,
    spokenText: sourceContent.spokenText,
    content: sanitized,
  });
  const derivedKeyCount =
    Object.keys(associated.labels).length + Object.keys(associated.values).length;
  if (derivedKeyCount === 0) {
    throw new Error(
      `Runtime-Deriver/Sanitizer/Association liefert keine prototypspezifischen Keys für ${prototype.animationId}.`,
    );
  }

  const props = createPrototypeRenderProps({
    spokenText: sourceContent.spokenText,
    meaningContract: sourceContent.meaningContract,
    labels: associated.labels,
    values: associated.values,
  });

  const outputRoot = resolve(
    MASTERPLAN_CONTENT_OUTPUT_ROOT,
    prototype.animationId,
  );
  await mkdir(outputRoot, {recursive: true});
  const propsPath = resolve(outputRoot, 'masterplan-render-props.json');
  await writeFile(
    propsPath,
    `${JSON.stringify(props, null, 2)}\n`,
    'utf8',
  );

  console.log(
    `\n[masterplan-content] ${prototype.animationId} · ${requestedMode} · ${derivedKeyCount} prototypspezifische Keys`,
  );
  await run(
    [
      'scripts/render-content-matched-prototype.mjs',
      prototype.animationId,
      propsPath,
      requestedMode,
    ],
    {CONTENT_MATCHED_OUTPUT_DIR: outputRoot},
  );

  results.push({
    animationId: prototype.animationId,
    compositionId: prototype.compositionId,
    outputRoot,
    propsPath,
    derivedLabelCount: Object.keys(associated.labels).length,
    derivedValueCount: Object.keys(associated.values).length,
  });
}

const manifest = {
  version: 1,
  payloadBuilder:
    'derive+sanitize+associate+createPrototypeRenderProps',
  mode: requestedMode,
  requestedAnimationId: requestedAnimationId ?? null,
  sourceFingerprint,
  generatedAt: new Date().toISOString(),
  prototypeCount: results.length,
  results,
};
await writeFile(
  resolve(MASTERPLAN_CONTENT_OUTPUT_ROOT, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);

console.log(
  `\n[masterplan-content] ${results.length} exakte Masterplan-Renderaufträge abgeschlossen.`,
);
