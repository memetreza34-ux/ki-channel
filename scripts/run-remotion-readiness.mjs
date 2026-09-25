#!/usr/bin/env node
import {spawn} from 'node:child_process';

const isWin = process.platform === 'win32';

const run = (command, args, label) => new Promise((resolve, reject) => {
  console.log(`\n=== ${label} ===`);
  console.log(`$ ${command} ${args.join(' ')}`);
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: isWin,
    env: process.env,
  });
  child.on('error', reject);
  child.on('exit', (code, signal) => {
    if (code === 0) resolve();
    else reject(new Error(`${label} fehlgeschlagen (code=${code ?? 'null'}, signal=${signal ?? 'none'}).`));
  });
});

const steps = [
  ['node', ['--check', 'scripts/sync-reel-word-timings.mjs'], 'Exact word-sync script syntax'],
  ['node', ['--check', 'scripts/render-first-real-ki-reel.mjs'], 'First real reel render script syntax'],
  ['node', ['--check', 'scripts/render-visual-contact-sheet.mjs'], 'Visual contact-sheet script syntax'],
  ['node', ['--test', 'scripts/__tests__/reel-word-sync.test.mjs'], 'Exact word-sync unit tests'],
  ['node', ['--test', 'scripts/__tests__/visual-contact-metrics.test.mjs'], 'Visual contact-sheet metric tests'],
  ['node', ['scripts/check-caption-contract.mjs'], 'Canonical caption geometry contract'],
  ['node', ['scripts/verify-remotion-integration.mjs'], 'Remotion integration'],
  ['npx', ['--no-install', 'remotion', 'versions'], 'Remotion package versions'],
  ['npm', ['run', 'repo:verify'], 'Repository verify'],
  ['node', ['scripts/check-production-visual-contracts.mjs'], 'Production visual contracts'],
  ['npm', ['run', 'motion:verify'], 'Motion verify'],
];

try {
  for (const [command, args, label] of steps) await run(command, args, label);
  console.log('\nREMOTION READINESS: PASS');
  console.log('Caption geometry contract: PASS');
  console.log('Exact Word Sync tooling: PASS');
  console.log('Visual contact-sheet tooling: PASS');
  console.log('First real reel E2E command: PASS');
  console.log('Naechster Schritt: echter End-to-End-Produktions-Test mit dem V2-Reel und echtem Audio.');
} catch (error) {
  console.error('\nREMOTION READINESS: FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
