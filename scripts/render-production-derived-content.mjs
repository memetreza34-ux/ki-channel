import {spawn} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {loadPrototypeRuntimeContentDeriver} from './load-prototype-runtime-content-deriver.mjs';
import {
  getFixtureContent,
  getProductionDerivedSourceFingerprint,
  PRODUCTION_DERIVED_OUTPUT_ROOT,
  readJson,
} from './production-derived-release-utils.mjs';

const [requestedMode = 'plan', requestedAnimationId] = process.argv.slice(2);
const VALID_MODES = new Set(['plan', 'smoke', 'stills', 'video', 'all']);
if (!VALID_MODES.has(requestedMode)) {
  throw new Error(
    'Aufruf: node scripts/render-production-derived-content.mjs [plan|smoke|stills|video|all] [animationId]',
  );
}

const config = await readJson(
  'ki/src/animation-library/prototype-render-config.json',
);
const fixtureConfig = await readJson(
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
const sourceFingerprint = await getProductionDerivedSourceFingerprint();
await mkdir(PRODUCTION_DERIVED_OUTPUT_ROOT, {recursive: true});

const run = (args, env) =>
  new Promise((resolvePromise, reject) => {
    const child = spawn('node', args, {
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
  if (!fixture) {
    throw new Error(`Content-Fixture fehlt für ${prototype.animationId}.`);
  }
  const sourceContent = getFixtureContent(fixture);
  if (
    !sourceContent ||
    typeof sourceContent.spokenText !== 'string' ||
    !sourceContent.spokenText.trim() ||
    !sourceContent.meaningContract
  ) {
    throw new Error(
      `Content-Fixture ${prototype.animationId} benötigt spokenText und meaningContract.`,
    );
  }

  const derived = derivePrototypeRuntimeContent({
    animationId: prototype.animationId,
    spokenText: sourceContent.spokenText,
    meaningContract: sourceContent.meaningContract,
  });
  const keyCount =
    Object.keys(derived.labels).length + Object.keys(derived.values).length;
  if (keyCount === 0) {
    throw new Error(
      `Runtime-Deriver liefert keine prototypspezifischen Keys für ${prototype.animationId}.`,
    );
  }

  const outputRoot = resolve(
    PRODUCTION_DERIVED_OUTPUT_ROOT,
    prototype.animationId,
  );
  await mkdir(outputRoot, {recursive: true});
  const propsPath = resolve(outputRoot, 'production-derived-props.json');
  const props = {
    content: {
      ...sourceContent,
      labels: derived.labels,
      values: derived.values,
    },
  };
  await writeFile(
    propsPath,
    `${JSON.stringify(props, null, 2)}\n`,
    'utf8',
  );

  console.log(
    `\n[production-derived] ${prototype.animationId} · ${requestedMode} · ${keyCount} abgeleitete Keys`,
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
    derivedLabelCount: Object.keys(derived.labels).length,
    derivedValueCount: Object.keys(derived.values).length,
  });
}

const manifest = {
  version: 1,
  mode: requestedMode,
  requestedAnimationId: requestedAnimationId ?? null,
  sourceFingerprint,
  generatedAt: new Date().toISOString(),
  prototypeCount: results.length,
  results,
};
await writeFile(
  resolve(PRODUCTION_DERIVED_OUTPUT_ROOT, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);

console.log(
  `\n[production-derived] ${results.length} Production-Derived-Renderaufträge abgeschlossen.`,
);
