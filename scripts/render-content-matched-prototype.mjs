import {spawn} from 'node:child_process';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const [target, inputPath, requestedMode = 'smoke', requestedSceneId] =
  process.argv.slice(2);
const VALID_MODES = new Set(['plan', 'smoke', 'stills', 'video', 'all']);

const usage = () => {
  console.error(
    'Aufruf: node scripts/render-content-matched-prototype.mjs ' +
      '<animationId|compositionId> <props|scene|masterplan.json> ' +
      '[plan|smoke|stills|video|all] [sceneId]',
  );
};

if (!target || !inputPath || !VALID_MODES.has(requestedMode)) {
  usage();
  process.exit(1);
}

const config = JSON.parse(
  await readFile(
    resolve('ki/src/animation-library/prototype-render-config.json'),
    'utf8',
  ),
);
const prototype = config.prototypes.find(
  (candidate) =>
    candidate.animationId === target || candidate.compositionId === target,
);
if (!prototype) {
  throw new Error(`Unbekannte Animation oder Composition: ${target}`);
}

const sourcePath = resolve(inputPath);
const rawInput = JSON.parse(await readFile(sourcePath, 'utf8'));

const selectScene = (input) => {
  if (!Array.isArray(input?.scenes)) return null;
  if (requestedSceneId) {
    const exact = input.scenes.find(
      (scene) => scene.sceneId === requestedSceneId,
    );
    if (!exact) {
      throw new Error(`Szene ${requestedSceneId} fehlt im Masterplan.`);
    }
    return exact;
  }
  const matching = input.scenes.filter(
    (scene) => scene.fullAnimationId === prototype.animationId,
  );
  if (matching.length === 1) return matching[0];
  if (matching.length > 1) {
    throw new Error(
      `Mehrere Szenen verwenden ${prototype.animationId}; sceneId als viertes Argument angeben.`,
    );
  }
  return null;
};

const selectedScene = selectScene(rawInput);
const props =
  selectedScene?.prototypeRenderProps ??
  rawInput?.prototypeRenderProps ??
  rawInput;
const content = props?.content;
if (!content || typeof content !== 'object') {
  throw new Error('Render-JSON benötigt content oder prototypeRenderProps.content.');
}
if (typeof content.spokenText !== 'string' || !content.spokenText.trim()) {
  throw new Error('Render-JSON benötigt content.spokenText.');
}
const contract = content.meaningContract;
if (!contract || typeof contract !== 'object') {
  throw new Error('Render-JSON benötigt content.meaningContract.');
}
for (const field of ['startState', 'visibleChange', 'endState']) {
  if (typeof contract[field] !== 'string' || !contract[field].trim()) {
    throw new Error(`Render-JSON benötigt meaningContract.${field}.`);
  }
}
if (
  !Array.isArray(contract.requiredVisualCues) ||
  contract.requiredVisualCues.length === 0
) {
  throw new Error('Render-JSON benötigt mindestens einen requiredVisualCue.');
}
if (
  selectedScene?.fullAnimationId &&
  selectedScene.fullAnimationId !== prototype.animationId
) {
  throw new Error(
    `Szene ${selectedScene.sceneId} plant ${selectedScene.fullAnimationId}, nicht ${prototype.animationId}.`,
  );
}

const outputRoot = resolve(
  process.env.CONTENT_MATCHED_OUTPUT_DIR ??
    `out/content-matched/${selectedScene?.sceneId ?? prototype.animationId}`,
);
await mkdir(outputRoot, {recursive: true});
const normalizedPropsPath = resolve(outputRoot, 'render-props.json');
await writeFile(
  normalizedPropsPath,
  `${JSON.stringify(props, null, 2)}\n`,
  'utf8',
);

const checkpoints = requestedMode === 'smoke'
  ? config.defaults.smokeCheckpoints
  : config.defaults.checkpoints;
const request = {
  version: 1,
  mode: requestedMode,
  sourcePath,
  selectedSceneId: selectedScene?.sceneId ?? null,
  animationId: prototype.animationId,
  compositionId: prototype.compositionId,
  entryPoint: config.entryPoint,
  outputRoot,
  propsPath: normalizedPropsPath,
  checkpoints,
};
await writeFile(
  resolve(outputRoot, 'render-request.json'),
  `${JSON.stringify(request, null, 2)}\n`,
  'utf8',
);

if (requestedMode === 'plan') {
  console.log(JSON.stringify(request, null, 2));
  process.exit(0);
}

const run = (args) =>
  new Promise((resolvePromise, reject) => {
    const child = spawn('npx', ['--no-install', 'remotion', ...args], {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`Remotion endete mit Code ${code}.`));
    });
  });

const baseArgs = [
  config.entryPoint,
  prototype.compositionId,
];
const propsFlag = `--props=${normalizedPropsPath}`;

if (new Set(['smoke', 'stills', 'all']).has(requestedMode)) {
  for (const frame of checkpoints) {
    await run([
      'still',
      ...baseArgs,
      resolve(outputRoot, `frame-${String(frame).padStart(3, '0')}.png`),
      `--frame=${frame}`,
      propsFlag,
      '--overwrite',
    ]);
  }
}

if (new Set(['video', 'all']).has(requestedMode)) {
  await run([
    'render',
    ...baseArgs,
    resolve(outputRoot, 'content-matched.mp4'),
    propsFlag,
    '--codec=h264',
    '--crf=18',
    '--overwrite',
  ]);
}

console.log(`Content-Matched-Render abgeschlossen: ${outputRoot}`);
