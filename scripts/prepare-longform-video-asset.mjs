#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import process from 'node:process';

const [input, ...args] = process.argv.slice(2);
if (!input) {
  console.error('Usage: node scripts/prepare-longform-video-asset.mjs <local-video> --provenance=<path|USER_PROVIDED> [--start=0] [--duration=6] [--fit=cover|contain] [--audio=remove|keep] [--crf=20] [--allow-upscale]');
  process.exit(1);
}

for (const arg of args) {
  if (/^--(?:width|height|fps)=/.test(arg)) {
    console.error('LONGFORM VIDEO PREP FAILED: width/height/fps sind im Longform-v1-Preset fest auf 1920x1080 @ 30 FPS gesetzt.');
    process.exit(1);
  }
}

const target = resolve('scripts', 'prepare-local-video-asset.mjs');
const result = spawnSync(process.execPath, [
  target,
  input,
  '--width=1920',
  '--height=1080',
  '--fps=30',
  ...args,
], {
  encoding: 'utf8',
  stdio: ['inherit', 'pipe', 'pipe'],
});

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) {
  console.error(`LONGFORM VIDEO PREP FAILED: ${result.error.message}`);
  process.exit(1);
}
if (result.status !== 0) process.exit(result.status ?? 1);

console.log('LONGFORM VIDEO PRESET: 1920x1080 @ 30 FPS');
console.log('Hinweis: PREPARED ist noch keine Produktionsfreigabe. Asset erst nach Rechte-, Timing- und Sichtprüfung in MEDIA-PLAN.json auf APPROVED setzen.');
