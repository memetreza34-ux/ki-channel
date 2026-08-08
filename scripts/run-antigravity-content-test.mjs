import {spawn} from 'node:child_process';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const outputRoot = resolve('out/antigravity-content-test');
const summaryPath = resolve(outputRoot, 'summary.json');
await mkdir(outputRoot, {recursive: true});

const steps = [
  ['workspace-contract', ['scripts/check-antigravity-content-test-contract.mjs']],
  ['production-inputs', ['scripts/check-masterplan-production-inputs.mjs']],
  ['first-test-contract', ['scripts/check-first-content-grounding-test-contract.mjs']],
  ['cost-grounding', ['scripts/run-first-content-grounding-test.mjs']],
  [
    'latency-grounding',
    [
      'scripts/run-first-content-grounding-test.mjs',
      'scale-performance-latency-tunnel-race-v1',
    ],
  ],
];

const results = [];
const writeSummary = async (status, failure = null) => {
  await writeFile(
    summaryPath,
    `${JSON.stringify({
      version: 1,
      status,
      generatedAt: new Date().toISOString(),
      expectedStepCount: steps.length,
      completedStepCount: results.length,
      steps: results,
      failure,
      costSummaryPath: resolve(
        'out/first-content-grounding-test/cost-efficiency-budget-leak-meter-v1/test-summary.json',
      ),
      latencySummaryPath: resolve(
        'out/first-content-grounding-test/scale-performance-latency-tunnel-race-v1/test-summary.json',
      ),
    }, null, 2)}\n`,
    'utf8',
  );
};

await writeSummary('running');

const runNode = (args) =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: process.env,
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`node ${args.join(' ')} endete mit Code ${code}.`));
    });
  });

const readJson = async (path) => JSON.parse(await readFile(resolve(path), 'utf8'));

try {
  for (const [name, args] of steps) {
    const startedAt = new Date().toISOString();
    console.log(`\n[antigravity-content-test] ${name}`);
    await runNode(args);
    results.push({
      name,
      status: 'passed',
      command: `node ${args.join(' ')}`,
      startedAt,
      completedAt: new Date().toISOString(),
    });
    await writeSummary('running');
  }

  const cost = await readJson(
    'out/first-content-grounding-test/cost-efficiency-budget-leak-meter-v1/test-summary.json',
  );
  const latency = await readJson(
    'out/first-content-grounding-test/scale-performance-latency-tunnel-race-v1/test-summary.json',
  );

  if (
    cost.status !== 'passed' ||
    cost.values?.measurementExact !== 1 ||
    cost.values?.initialCost !== 94 ||
    cost.values?.optimizedCost !== 28
  ) {
    throw new Error('Kosten-Test-Summary bestätigt 94 -> 28 nicht vollständig.');
  }
  if (
    latency.status !== 'passed' ||
    latency.values?.measurementExact !== 1 ||
    latency.values?.slowLatency !== 780 ||
    latency.values?.fastLatency !== 340
  ) {
    throw new Error('Latenz-Test-Summary bestätigt 780 -> 340 ms nicht vollständig.');
  }

  await writeSummary('passed');
  console.log(
    `\n[antigravity-content-test] BESTANDEN · ${results.length}/${steps.length} Schritte · Summary: ${summaryPath}`,
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  await writeSummary('failed', message);
  console.error(`\n[antigravity-content-test] FEHLGESCHLAGEN · ${message}`);
  console.error(`[antigravity-content-test] Summary: ${summaryPath}`);
  process.exitCode = 1;
}
