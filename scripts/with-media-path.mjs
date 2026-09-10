#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
if (!args.length) {
  console.error('Usage: node scripts/with-media-path.mjs <command> [...args]');
  process.exit(1);
}

const commonBinDirs = [
  '/opt/homebrew/bin',
  '/usr/local/bin',
  '/opt/local/bin',
  '/usr/bin',
  '/bin',
].filter((dir) => existsSync(dir));

const currentPath = String(process.env.PATH || '');
const parts = currentPath.split(path.delimiter).filter(Boolean);
for (const dir of commonBinDirs.reverse()) {
  if (!parts.includes(dir)) parts.unshift(dir);
}
const resolvedPath = parts.join(path.delimiter);

const [command, ...commandArgs] = args;
const result = spawnSync(command, commandArgs, {
  stdio: 'inherit',
  env: {...process.env, PATH: resolvedPath},
});

if (result.error) {
  console.error(`MEDIA PATH WRAPPER FAILED: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
