#!/usr/bin/env node
import {spawn} from 'node:child_process';
import {readdir, readFile} from 'node:fs/promises';
import {dirname, relative, resolve} from 'node:path';

const args = new Map(process.argv.slice(2).map((entry) => {
  const [key, ...rest] = entry.replace(/^--/, '').split('=');
  return [key, rest.join('=') || 'true'];
}));
const changedFileList = args.get('changed-files');
const failOnSevere = args.get('fail-on-severe') !== 'false';
const root = resolve('.');
const reelsRoot = resolve('ki/reels');

const walk = async (dir, names = []) => {
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) await walk(path, names);
    else if (entry.isFile() && entry.name === 'visual-quality-v4.json') names.push(path);
  }
  return names;
};
const manifests = await walk(reelsRoot);
let changed = null;
if (changedFileList) {
  changed = new Set((await readFile(resolve(changedFileList), 'utf8')).split(/\r?\n/).map((line) => line.trim()).filter(Boolean));
}

const globalVisualChange = changed ? [...changed].some((path) =>
  path.startsWith('ki/src/visual-system/') ||
  path === 'scripts/render-visual-quality-v4-review.mjs' ||
  path === 'scripts/visual-quality-v4-review-contract.mjs' ||
  path === 'scripts/visual-contact-metrics.mjs' ||
  path === '.github/workflows/visual-quality-v4.yml') : true;

const targets = [];
for (const manifestPath of manifests) {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const projectDir = dirname(manifestPath);
  const reelRoot = dirname(projectDir);
  const packagePrefix = `${relative(root, reelRoot).replaceAll('\\', '/')}/`;
  const sourcePrefix = typeof manifest.sourceQualityContract === 'string'
    ? `${dirname(manifest.sourceQualityContract).replaceAll('\\', '/')}/`
    : '';
  const touched = globalVisualChange || !changed || [...changed].some((path) => path.startsWith(packagePrefix) || (sourcePrefix && path.startsWith(sourcePrefix)));
  if (touched) targets.push(relative(root, manifestPath).replaceAll('\\', '/'));
}

if (targets.length === 0) {
  console.log('V4 VISUAL REVIEW: no changed V4 reel targets.');
  process.exit(0);
}

const run = (manifest) => new Promise((resolvePromise, reject) => {
  const child = spawn(process.execPath, [
    'scripts/render-visual-quality-v4-review.mjs',
    `--manifest=${manifest}`,
    `--fail-on-severe=${failOnSevere ? 'true' : 'false'}`,
  ], {stdio: 'inherit', shell: process.platform === 'win32', env: process.env});
  child.on('error', reject);
  child.on('exit', (code, signal) => code === 0 ? resolvePromise() : reject(new Error(`${manifest} visual review failed (code=${code ?? 'null'}, signal=${signal ?? 'none'})`)));
});

for (const target of targets) {
  console.log(`\n=== Visual Quality V4 target: ${target} ===`);
  await run(target);
}
console.log(`\nV4 VISUAL REVIEW: PASS (${targets.length} target${targets.length === 1 ? '' : 's'})`);
