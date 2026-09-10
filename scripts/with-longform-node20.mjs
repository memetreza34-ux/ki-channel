#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
if (!args.length) {
  console.error('Usage: node scripts/with-longform-node20.mjs <script.mjs> [...args]');
  process.exit(1);
}

const [target, ...targetArgs] = args;
if (!existsSync(target)) {
  console.error(`LONGFORM NODE20 WRAPPER FAILED: target script missing: ${target}`);
  process.exit(1);
}

const commonBinDirs = ['/opt/homebrew/bin','/usr/local/bin','/opt/local/bin','/usr/bin','/bin'].filter(existsSync);
const pathParts = String(process.env.PATH || '').split(path.delimiter).filter(Boolean);
for (const dir of commonBinDirs.reverse()) if (!pathParts.includes(dir)) pathParts.unshift(dir);
const env = {...process.env, PATH: pathParts.join(path.delimiter), KI_LONGFORM_RUNTIME_WRAPPER: '1'};
const major = Number(process.versions.node.split('.')[0]);

const run = (command, commandArgs) => {
  const result = spawnSync(command, commandArgs, {stdio:'inherit', env});
  if (result.error) {
    console.error(`LONGFORM NODE20 WRAPPER FAILED: ${result.error.message}`);
    process.exit(1);
  }
  process.exit(result.status ?? 1);
};

if (major === 20) {
  run(process.execPath, [target, ...targetArgs]);
}

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
console.log(`LONGFORM NODE20 WRAPPER: system Node ${process.versions.node}; executing target with npx node@20.`);
run(npx, ['-y', 'node@20', target, ...targetArgs]);
