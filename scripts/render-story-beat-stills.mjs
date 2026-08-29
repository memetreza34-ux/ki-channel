#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const reelArg = args.find((arg) => !arg.startsWith('--'));
if (!reelArg) {
  console.error('Usage: node scripts/render-story-beat-stills.mjs <reel-package-dir> [--scale=1] [--output=<dir>]');
  process.exit(1);
}

const option = (name, fallback) => {
  const prefix = `--${name}=`;
  const found = args.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
};

const root = process.cwd();
const reelDir = path.resolve(root, reelArg);
const reelJsonPath = path.join(reelDir, '06-projektdateien', 'reel.json');
if (!existsSync(reelJsonPath)) throw new Error(`reel.json not found: ${reelJsonPath}`);
const reel = JSON.parse(await readFile(reelJsonPath, 'utf8'));
const storyRel = reel?.storytelling?.file || '06-projektdateien/story-beats.json';
const storyPath = path.resolve(reelDir, storyRel);
if (!existsSync(storyPath)) throw new Error(`story-beats file not found: ${storyPath}`);
const story = JSON.parse(await readFile(storyPath, 'utf8'));

const compositionId = String(reel?.compositionId || '').trim();
if (!compositionId) throw new Error('reel.json.compositionId is required.');
const entryPoint = path.resolve(root, 'ki/src/index.ts');
if (!existsSync(entryPoint)) throw new Error(`Remotion entry point missing: ${entryPoint}`);

const scenes = new Map((Array.isArray(reel?.scenes) ? reel.scenes : []).map((scene) => [String(scene.sceneId), scene]));
const beats = Array.isArray(story?.beats) ? story.beats : [];
if (beats.length === 0) throw new Error('No story beats found.');

const scale = Number(option('scale', '1'));
if (!Number.isFinite(scale) || scale <= 0 || scale > 4) throw new Error(`Invalid --scale=${scale}`);
const defaultOutput = path.join('out', 'story-beat-stills', String(reel?.reelId || compositionId));
const outputDir = path.resolve(root, option('output', defaultOutput));
await mkdir(outputDir, {recursive: true});

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const manifest = {
  version: 1,
  compositionId,
  reelPackageDir: path.relative(root, reelDir),
  scale,
  generatedAt: new Date().toISOString(),
  beats: [],
};

for (const beat of beats) {
  const id = String(beat?.id || '').trim();
  const sceneId = String(beat?.sceneId || '').trim();
  const scene = scenes.get(sceneId);
  if (!id || !scene) throw new Error(`Invalid beat ${id || '<missing>'}: unknown scene ${sceneId}.`);
  const start = Number(scene.startFrame);
  const end = Number(scene.endFrame);
  const ratio = Number(beat.atRatio);
  if (![start, end, ratio].every(Number.isFinite) || end <= start || ratio < 0 || ratio > 1) {
    throw new Error(`Invalid timing for beat ${id}.`);
  }
  const frame = Math.min(end - 1, start + Math.round((end - start) * ratio));
  const filename = `${String(frame).padStart(5, '0')}_${id}_${sceneId}.png`;
  const outputPath = path.join(outputDir, filename);
  const commandArgs = [
    'remotion', 'still', entryPoint, compositionId, outputPath,
    `--frame=${frame}`,
    `--scale=${scale}`,
    '--log=warn',
  ];
  console.log(`STORY BEAT STILL ${id}: frame ${frame} -> ${path.relative(root, outputPath)}`);
  const result = spawnSync(npx, commandArgs, {cwd: root, stdio: 'inherit', shell: false});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Remotion still failed for ${id} with exit code ${result.status}.`);
  manifest.beats.push({
    id,
    sceneId,
    role: beat.role || null,
    atRatio: ratio,
    frame,
    visualAction: beat.visualAction || null,
    motion: beat.motion || null,
    file: path.relative(root, outputPath),
  });
}

const manifestPath = path.join(outputDir, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`STORY BEAT STILLS READY: ${manifest.beats.length}`);
console.log(`manifest: ${path.relative(root, manifestPath)}`);
