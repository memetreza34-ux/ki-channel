#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const reelsRoot = path.resolve(root, 'ki', 'reels');
const failures = [];
const checkedPackages = [];

const fail = (message) => failures.push(message);
const forbiddenPathPattern = /(?:ki[\\/]public[\\/]showcase|public[\\/]showcase|(?:staticFile\s*\(\s*|staticSrc\s*=\s*)["'`]showcase[\\/])/i;

const walk = async (dir, visitor) => {
  if (!existsSync(dir)) return;
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, visitor);
    else await visitor(full, entry.name);
  }
};

const reelJsonFiles = [];
await walk(reelsRoot, async (full, name) => {
  if (name === 'reel.json' && path.basename(path.dirname(full)) === '06-projektdateien') reelJsonFiles.push(full);
});

for (const reelJsonPath of reelJsonFiles) {
  let reel;
  try {
    reel = JSON.parse(await readFile(reelJsonPath, 'utf8'));
  } catch (error) {
    fail(`${path.relative(root, reelJsonPath)}: reel.json ist ungültig: ${error instanceof Error ? error.message : String(error)}`);
    continue;
  }

  const reelDir = path.dirname(path.dirname(reelJsonPath));
  const label = path.relative(root, reelDir);
  checkedPackages.push(label);

  const sourceDirRaw = String(reel?.sourceDir || '').trim();
  if (!sourceDirRaw) {
    fail(`${label}: reel.sourceDir fehlt.`);
    continue;
  }
  const sourceDir = path.resolve(root, sourceDirRaw);
  if (!existsSync(sourceDir)) {
    fail(`${label}: sourceDir existiert nicht: ${sourceDirRaw}`);
    continue;
  }

  await walk(sourceDir, async (full, name) => {
    if (!/\.(?:ts|tsx|js|jsx)$/i.test(name)) return;
    const text = await readFile(full, 'utf8');
    if (forbiddenPathPattern.test(text)) {
      fail(`${path.relative(root, full)}: Produktionssource referenziert Testmaterial aus showcase/.`);
    }
  });

  const projectFilesDir = path.join(reelDir, '06-projektdateien');
  for (const name of ['visual-assets.json', 'visual-assets-resolved.json', 'GENERATED-MEDIA.json']) {
    const file = path.join(projectFilesDir, name);
    if (!existsSync(file)) continue;
    const text = await readFile(file, 'utf8');
    if (/(?:ki[\\/]public[\\/]showcase|public[\\/]showcase|["'`]showcase[\\/])/i.test(text)) {
      fail(`${path.relative(root, file)}: Produktionsmanifest referenziert Testmaterial aus showcase/.`);
    }
  }
}

if (failures.length) {
  console.error('SHOWCASE ISOLATION FAILED:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SHOWCASE ISOLATION PASSED: ${checkedPackages.length} Produktions-Reel-Pakete geprüft.`);
console.log('ki/public/showcase/* bleibt ausschließlich Testmaterial und darf nicht in Produktionsreels referenziert werden.');
