#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {mkdir, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import process from 'node:process';

const requested = process.argv.find((arg) => arg.startsWith('--backend='))?.split('=')[1] || 'auto';
const allowed = new Set(['auto','mlx-qwen3','ctc-german']);
if (!allowed.has(requested)) {
  console.error('Usage: node ki/scripts/setup-local-forced-aligner.mjs [--backend=auto|mlx-qwen3|ctc-german]');
  process.exit(1);
}

const isAppleSilicon = process.platform === 'darwin' && process.arch === 'arm64';
const backend = requested === 'auto' ? (isAppleSilicon ? 'mlx-qwen3' : 'ctc-german') : requested;
if (backend === 'mlx-qwen3' && !isAppleSilicon) {
  console.error('mlx-qwen3 requires macOS on Apple Silicon. Use --backend=ctc-german on this machine.');
  process.exit(1);
}

const cacheRoot = path.resolve('.cache','reel-aligner-venv');
const markerPath = path.resolve('.cache','reel-aligner-backend.json');
await mkdir(path.dirname(markerPath), {recursive:true});

const findPython = () => {
  const candidates = process.platform === 'win32'
    ? ['py','python','python3']
    : ['python3.11','python3','python'];
  for (const candidate of candidates) {
    const args = candidate === 'py' ? ['-3.11','--version'] : ['--version'];
    const result = spawnSync(candidate,args,{encoding:'utf8'});
    if (!result.error && result.status === 0) return {command:candidate,prefix:candidate === 'py' ? ['-3.11'] : []};
  }
  return null;
};

const systemPython = findPython();
if (!systemPython) {
  console.error('No usable Python found. Install Python 3.10+ (3.11 recommended) and rerun.');
  process.exit(1);
}

const run = (label, command, args) => {
  console.log(`\n[${label}] ${command} ${args.join(' ')}`);
  const result = spawnSync(command,args,{stdio:'inherit'});
  if (result.error || result.status !== 0) {
    console.error(`${label} failed.`);
    process.exit(1);
  }
};

if (!existsSync(cacheRoot)) run('create venv', systemPython.command, [...systemPython.prefix,'-m','venv',cacheRoot]);

const venvPython = process.platform === 'win32'
  ? path.join(cacheRoot,'Scripts','python.exe')
  : path.join(cacheRoot,'bin','python');
if (!existsSync(venvPython)) {
  console.error(`venv python missing: ${venvPython}`);
  process.exit(1);
}

run('upgrade pip', venvPython, ['-m','pip','install','--upgrade','pip']);

let packageSpec;
let model;
let modelLicense;
if (backend === 'mlx-qwen3') {
  packageSpec = 'mlx-audio==0.5.0';
  model = 'mlx-community/Qwen3-ForcedAligner-0.6B-8bit';
  modelLicense = 'Apache-2.0';
  run('install MLX forced aligner', venvPython, ['-m','pip','install',packageSpec]);
} else {
  packageSpec = 'git+https://github.com/MahmoudAshraf97/ctc-forced-aligner.git@11855d1de76af2b490dd2e8e2db2661805ae90a0';
  model = 'facebook/wav2vec2-large-xlsr-53-german';
  modelLicense = 'Apache-2.0';
  run('install CTC forced aligner', venvPython, ['-m','pip','install',packageSpec]);
}

const marker = {
  version:1,
  status:'LOCAL_ALIGNER_INSTALLED',
  backend,
  packageSpec,
  model,
  modelLicense,
  venv:path.relative(process.cwd(),cacheRoot),
  python:path.relative(process.cwd(),venvPython),
  platform:{os:process.platform,arch:process.arch,release:os.release()},
  installedAt:new Date().toISOString(),
  notes:[
    'No cloud API key and no per-minute quota are required.',
    'Model weights download locally on first alignment and are cached by the model runtime.',
    'Do not replace the configured CTC model with the package default MMS model for commercial reels; its default weights are CC-BY-NC.',
  ],
};
await writeFile(markerPath,`${JSON.stringify(marker,null,2)}\n`,'utf8');

console.log('\nLOCAL FORCED ALIGNER INSTALLED');
console.log(`backend: ${backend}`);
console.log(`model: ${model} (${modelLicense})`);
console.log(`marker: ${markerPath}`);
console.log('Next: node ki/scripts/align-reel-local.mjs <reel-package-dir>');
