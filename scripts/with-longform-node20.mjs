#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const targetWrapper = path.resolve('scripts', 'with-longform-node24.mjs');
console.warn('DEPRECATED: scripts/with-longform-node20.mjs now delegates to Node 24 LTS. Update callers to with-longform-node24.mjs.');
const result = spawnSync(process.execPath, [targetWrapper, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env,
});
if (result.error) {
  console.error(`LEGACY LONGFORM RUNTIME SHIM FAILED: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
