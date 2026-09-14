#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {mkdir, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const cacheRoot = path.resolve('.cache', 'reel-aligner-verifier-ctc');
const markerPath = path.resolve('.cache', 'reel-aligner-verifier-ctc.json');
const fail = (message) => { console.error(`CTC ALIGNMENT VERIFIER SETUP FAILED: ${message}`); process.exit(1); };

const findPython = () => {
  const candidates = process.platform === 'win32' ? ['py', 'python', 'python3'] : ['python3.11', 'python3', 'python'];
  for (const candidate of candidates) {
    const args = candidate === 'py' ? ['-3.11', '--version'] : ['--version'];
    const result = spawnSync(candidate, args, {encoding: 'utf8'});
    if (!result.error && result.status === 0) return {command: candidate, prefix: candidate === 'py' ? ['-3.11'] : []};
  }
  return null;
};
const systemPython = findPython();
if (!systemPython) fail('Python 3.10+ missing.');

const run = (label, command, args) => {
  console.log(`[${label}] ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {stdio: 'inherit'});
  if (result.error || result.status !== 0) fail(`${label} failed${result.error ? `: ${result.error.message}` : ''}.`);
};

if (!existsSync(cacheRoot)) {
  await mkdir(path.dirname(cacheRoot), {recursive: true});
  run('create verifier venv', systemPython.command, [...systemPython.prefix, '-m', 'venv', cacheRoot]);
}
const python = process.platform === 'win32' ? path.join(cacheRoot, 'Scripts', 'python.exe') : path.join(cacheRoot, 'bin', 'python');
if (!existsSync(python)) fail(`venv python missing: ${python}`);
run('upgrade pip', python, ['-m', 'pip', 'install', '--upgrade', 'pip']);
const packageSpec = 'git+https://github.com/MahmoudAshraf97/ctc-forced-aligner.git@11855d1de76af2b490dd2e8e2db2661805ae90a0';
run('install CTC verifier', python, ['-m', 'pip', 'install', packageSpec]);

await writeFile(markerPath, `${JSON.stringify({
  version: 1,
  status: 'CTC_ALIGNMENT_VERIFIER_READY',
  backend: 'ctc-german',
  python: path.relative(process.cwd(), python),
  packageSpec,
  model: 'facebook/wav2vec2-large-xlsr-53-german',
  modelLicense: 'Apache-2.0',
  installedAt: new Date().toISOString(),
}, null, 2)}\n`, 'utf8');
console.log(`CTC ALIGNMENT VERIFIER READY: ${markerPath}`);
