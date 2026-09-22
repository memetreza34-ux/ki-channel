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
  ['node', ['scripts/verify-remotion-integration.mjs'], 'Remotion integration'],
  ['npx', ['--no-install', 'remotion', 'versions'], 'Remotion package versions'],
  ['npm', ['run', 'repo:verify'], 'Repository verify'],
  ['node', ['scripts/check-production-visual-contracts.mjs'], 'Production visual contracts'],
  ['npm', ['run', 'motion:verify'], 'Motion verify'],
];

try {
  for (const [command, args, label] of steps) await run(command, args, label);
  console.log('\nREMOTION READINESS: PASS');
  console.log('Naechster Schritt: echter End-to-End-Produktions-Test mit einem V2-Reel.');
} catch (error) {
  console.error('\nREMOTION READINESS: FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
