#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import process from 'node:process';

const mode = process.argv[2] ?? 'add';
if (!['add', 'update'].includes(mode)) {
  console.error('Usage: node scripts/sync-remotion-agent-skills.mjs [add|update]');
  process.exit(1);
}

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
console.log(`Syncing official Remotion Agent Skills with: npx remotion skills ${mode}`);
console.log('The project must already have its pinned Remotion dependencies installed.');

const result = spawnSync(npx, ['remotion', 'skills', mode], {
  stdio: 'inherit',
  shell: false,
});

if (result.error) {
  console.error(`Could not start Remotion skills command: ${result.error.message}`);
  process.exit(1);
}
if (result.status !== 0) {
  console.error(`Remotion skills ${mode} failed with exit code ${result.status}.`);
  process.exit(result.status ?? 1);
}

console.log('Official Remotion Agent Skills synced into .agents/skills/.');
console.log('Repository-specific KI-channel rules still take precedence over generic skill guidance.');
