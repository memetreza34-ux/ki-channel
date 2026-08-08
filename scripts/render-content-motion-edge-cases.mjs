import {spawn} from 'node:child_process';
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {getMasterplanContentSourceFingerprint} from './masterplan-content-release-utils.mjs';

const requestedMode = process.argv[2] ?? 'plan';
const requestedCaseId = process.argv[3] ?? null;
const VALID_MODES = new Set(['plan', 'smoke', 'stills', 'video', 'all']);

if (!VALID_MODES.has(requestedMode)) {
  console.error(
    'Aufruf: node scripts/render-content-motion-edge-cases.mjs [plan|smoke|stills|video|all] [caseId]',
  );
  process.exit(1);
}

const config = JSON.parse(
  await readFile(
    resolve('ki/src/animation-library/content-motion-edge-cases.json'),
    'utf8',
  ),
);

if (!Array.isArray(config.cases) || config.cases.length === 0) {
  throw new Error('Keine Content-Motion-Edge-Cases gefunden.');
}

const selectedCases = requestedCaseId
  ? config.cases.filter((edgeCase) => edgeCase.id === requestedCaseId)
  : config.cases;

if (requestedCaseId && selectedCases.length !== 1) {
  throw new Error(`Unbekannter Edge-Case: ${requestedCaseId}`);
}

const outputRoot = resolve('out/content-motion-edge-cases');
const inputRoot = resolve(outputRoot, '.inputs');
const sourceFingerprint = await getMasterplanContentSourceFingerprint();
await mkdir(inputRoot, {recursive: true});

const run = (command, args, env = process.env) =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env,
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else reject(
        new Error(`${command} ${args.join(' ')} endete mit Code ${code}.`),
      );
    });
  });

await run('node', ['scripts/check-content-motion-edge-cases.mjs']);

const renderSummary = [];
for (const edgeCase of selectedCases) {
  const propsPath = resolve(inputRoot, `${edgeCase.id}.json`);
  await writeFile(
    propsPath,
    `${JSON.stringify({content: edgeCase.content}, null, 2)}\n`,
    'utf8',
  );

  const caseOutputRoot = resolve(outputRoot, edgeCase.id);
  // Keep each render mode isolated from previous artifacts. A smoke run must not
  // inherit an MP4 or additional checkpoints from an earlier full render.
  await rm(caseOutputRoot, {recursive: true, force: true});
  await mkdir(caseOutputRoot, {recursive: true});
  console.log(
    `\n[edge-case-render] ${edgeCase.id} · ${edgeCase.animationId} · ${requestedMode}`,
  );
  console.log(`[edge-case-render] Erwartung: ${edgeCase.expectedBehavior}`);

  await run(
    'node',
    [
      'scripts/render-content-matched-prototype.mjs',
      edgeCase.animationId,
      propsPath,
      requestedMode,
    ],
    {
      ...process.env,
      CONTENT_MATCHED_OUTPUT_DIR: caseOutputRoot,
    },
  );

  renderSummary.push({
    id: edgeCase.id,
    animationId: edgeCase.animationId,
    expectedBehavior: edgeCase.expectedBehavior,
    mode: requestedMode,
    outputRoot: caseOutputRoot,
  });
}

await writeFile(
  resolve(outputRoot, 'edge-case-render-summary.json'),
  `${JSON.stringify(
    {
      version: 1,
      mode: requestedMode,
      sourceFingerprint,
      generatedAt: new Date().toISOString(),
      caseCount: renderSummary.length,
      cases: renderSummary,
    },
    null,
    2,
  )}\n`,
  'utf8',
);

console.log(
  `\n[edge-case-render] ${renderSummary.length} Edge-Case(s) abgeschlossen: ${outputRoot}`,
);
