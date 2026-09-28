#!/usr/bin/env node
import {spawn} from 'node:child_process';

const isWin = process.platform === 'win32';

const run = (command, args, label) => new Promise((resolve, reject) => {
  console.log(`\n=== ${label} ===`);
  console.log(`$ ${command} ${args.join(' ')}`);
  const child = spawn(command, args, {stdio: 'inherit', shell: isWin, env: process.env});
  child.on('error', reject);
  child.on('exit', (code, signal) => {
    if (code === 0) resolve();
    else reject(new Error(`${label} fehlgeschlagen (code=${code ?? 'null'}, signal=${signal ?? 'none'}).`));
  });
});

const steps = [
  ['node', ['--check', 'scripts/new-ki-reel.mjs'], 'New reel generator syntax'],
  ['node', ['--check', 'scripts/init-art-direction-calibration.mjs'], 'Art-direction calibration initializer syntax'],
  ['node', ['--check', 'scripts/check-channel-art-direction.mjs'], 'Channel art-direction gate syntax'],
  ['node', ['--check', 'scripts/channel-art-direction-contract.mjs'], 'Channel art-direction contract syntax'],
  ['node', ['--check', 'scripts/sync-reel-word-timings.mjs'], 'Exact word-sync script syntax'],
  ['node', ['--check', 'scripts/render-first-real-ki-reel.mjs'], 'First real reel render script syntax'],
  ['node', ['--check', 'scripts/render-visual-contact-sheet.mjs'], 'Visual contact-sheet script syntax'],
  ['node', ['--check', 'scripts/render-visual-quality-v4-review.mjs'], 'Visual Quality V4 render-review syntax'],
  ['node', ['--check', 'scripts/run-changed-v4-visual-reviews.mjs'], 'Visual Quality V4 changed-review runner syntax'],
  ['node', ['--check', 'scripts/check-visual-quality-v3.mjs'], 'Visual Quality V3 script syntax'],
  ['node', ['--check', 'scripts/check-visual-quality-v4.mjs'], 'Visual Quality V4 script syntax'],
  ['node', ['--check', 'scripts/visual-quality-v4-contract.mjs'], 'Visual Quality V4 contract syntax'],
  ['node', ['--check', 'scripts/visual-quality-v4-review-contract.mjs'], 'Visual Quality V4 review-contract syntax'],
  ['node', ['--check', 'scripts/check-remotion-capabilities.mjs'], 'Remotion capability gate script syntax'],
  ['node', ['--check', 'scripts/remotion-capability-contract.mjs'], 'Remotion capability contract syntax'],
  ['node', ['--test', 'scripts/__tests__/channel-art-direction-contract.test.mjs'], 'Channel art-direction contract tests'],
  ['node', ['--test', 'scripts/__tests__/new-ki-reel-capability-template.test.mjs'], 'New reel V4/capability wiring tests'],
  ['node', ['--test', 'scripts/__tests__/remotion-skill-matrix.test.mjs'], 'Remotion skill/package/capability matrix tests'],
  ['node', ['--test', 'scripts/__tests__/remotion-capability-threshold.test.mjs'], 'Remotion capability V3/V4 threshold regression test'],
  ['node', ['--test', 'scripts/__tests__/reel-word-sync.test.mjs'], 'Exact word-sync unit tests'],
  ['node', ['--test', 'scripts/__tests__/visual-contact-metrics.test.mjs'], 'Visual contact-sheet metric tests'],
  ['node', ['--test', 'scripts/__tests__/visual-contact-metrics-v4.test.mjs'], 'Visual Quality V4 footprint metric tests'],
  ['node', ['--test', 'scripts/__tests__/visual-quality-v3-contract.test.mjs'], 'Visual Quality V3 legacy contract tests'],
  ['node', ['--test', 'scripts/__tests__/visual-quality-v4-contract.test.mjs'], 'Visual Quality V4 contract tests'],
  ['node', ['--test', 'scripts/__tests__/visual-quality-v4-review-contract.test.mjs'], 'Visual Quality V4 rendered-review tests'],
  ['node', ['--test', 'scripts/__tests__/remotion-capability-contract.test.mjs'], 'Remotion capability contract tests'],
  ['node', ['scripts/check-caption-contract.mjs'], 'Canonical caption geometry contract'],
  ['node', ['scripts/check-channel-art-direction.mjs'], 'Channel Physical AI art-direction calibration gate'],
  ['node', ['scripts/check-visual-quality-v3.mjs'], 'Visual Quality V3 legacy reel gate'],
  ['node', ['scripts/check-visual-quality-v4.mjs'], 'Visual Quality V4 future-reel gate'],
  ['node', ['scripts/check-remotion-capabilities.mjs'], 'Remotion capability implementation gate'],
  ['node', ['scripts/verify-remotion-integration.mjs'], 'Remotion integration'],
  ['npx', ['--no-install', 'remotion', 'versions'], 'Remotion package versions'],
  ['npm', ['run', 'repo:verify'], 'Repository verify'],
  ['node', ['scripts/check-production-visual-contracts.mjs'], 'Production visual contracts'],
  ['npm', ['run', 'motion:verify'], 'Motion verify'],
];

try {
  for (const [command, args, label] of steps) await run(command, args, label);
  console.log('\nREMOTION READINESS: PASS');
  console.log('Channel Physical AI art direction + calibration gate: PASS');
  console.log('New reel V4/capability template wiring: PASS');
  console.log('Remotion skill/package/capability matrix: PASS');
  console.log('Remotion capability threshold across V3/V4: PASS');
  console.log('Caption geometry contract: PASS');
  console.log('Visual Quality V3 legacy gate: PASS');
  console.log('Visual Quality V4 story/semantic gate: PASS');
  console.log('Visual Quality V4 scene-local review tooling: PASS');
  console.log('Remotion capability implementation gate: PASS');
  console.log('Exact Word Sync tooling: PASS');
  console.log('Legacy visual contact-sheet tooling: PASS');
  console.log('First real reel E2E command: PASS');
  console.log('Naechster Schritt: vor Vollproduktion zuerst Hook + Mechanism + Payoff in der Physical-AI-Welt kalibrieren und menschlich freigeben; erst danach V4/Capabilities auf das komplette Reel anwenden.');
} catch (error) {
  console.error('\nREMOTION READINESS: FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
