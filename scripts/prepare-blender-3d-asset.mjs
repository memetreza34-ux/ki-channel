#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const inputArg = args.find((arg) => !arg.startsWith('--'));
const option = (name, fallback) => {
  const prefix = `--${name}=`;
  const found = args.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
};

if (!inputArg) {
  console.error('Usage: node scripts/prepare-blender-3d-asset.mjs <input.glb|input.gltf> [--target-faces=80000] [--min-ratio=0.35]');
  process.exit(1);
}

const source = path.resolve(inputArg);
if (!existsSync(source)) {
  console.error(`BLENDER ASSET PREP: input not found: ${source}`);
  process.exit(2);
}
if (!['.glb', '.gltf'].includes(path.extname(source).toLowerCase())) {
  console.error('BLENDER ASSET PREP: only local .glb/.gltf input is accepted.');
  process.exit(2);
}

const targetFaces = Math.max(1000, Number(option('target-faces', '80000')) || 80000);
const minRatio = Math.min(1, Math.max(0.1, Number(option('min-ratio', '0.35')) || 0.35));
const blender = process.env.BLENDER_BIN || 'blender';

const version = spawnSync(blender, ['--version'], {encoding: 'utf8'});
if (version.status !== 0) {
  console.error('BLENDER ASSET PREP: Blender executable unavailable.');
  console.error('Install an official Blender release and optionally set BLENDER_BIN=/path/to/blender.');
  process.exit(3);
}

const safeName = path.basename(source, path.extname(source)).replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 80) || 'asset';
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.resolve('out', 'asset-prep', 'blender', `${stamp}_${safeName}`);
await mkdir(outDir, {recursive: true});
const output = path.join(outDir, `${safeName}.optimized.glb`);
const manifest = path.join(outDir, 'manifest.json');
const helper = path.resolve('scripts', 'blender_optimize_glb.py');

if (!existsSync(helper)) {
  console.error(`BLENDER ASSET PREP: helper missing: ${helper}`);
  process.exit(4);
}

console.log(`BLENDER ASSET PREP: source=${path.relative(process.cwd(), source)}`);
console.log(`BLENDER ASSET PREP: Blender=${String(version.stdout || version.stderr).split(/\r?\n/)[0]}`);
console.log('BLENDER ASSET PREP: running background + offline + autoexec disabled');

const run = spawnSync(
  blender,
  [
    '--background',
    '--offline-mode',
    '--disable-autoexec',
    '--python-exit-code',
    '7',
    '--python',
    helper,
    '--',
    '--input',
    source,
    '--output',
    output,
    '--manifest',
    manifest,
    '--target-faces',
    String(targetFaces),
    '--min-ratio',
    String(minRatio),
  ],
  {encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']},
);

if (run.status !== 0) {
  console.error('BLENDER ASSET PREP: FAILED');
  if (run.stdout) console.error(run.stdout.slice(-4000));
  if (run.stderr) console.error(run.stderr.slice(-4000));
  process.exit(run.status || 1);
}

if (!existsSync(output) || !existsSync(manifest)) {
  console.error('BLENDER ASSET PREP: Blender exited successfully but expected output/manifest is missing.');
  process.exit(5);
}

console.log('BLENDER ASSET PREP: OK — PREPARED_NOT_PRODUCTION_APPROVED');
console.log(`output: ${path.relative(process.cwd(), output)}`);
console.log(`manifest: ${path.relative(process.cwd(), manifest)}`);
console.log('Source asset was not modified. Nothing was added to production manifests or Remotion source.');
console.log('Next: inspect the optimized GLB visually before any explicit production-resolution step.');
