#!/usr/bin/env node
import {readFile, readdir} from 'node:fs/promises';
import {resolve, relative} from 'node:path';

const [rawPackage] = process.argv.slice(2);
if (!rawPackage) {
  console.error('Usage: node ki/scripts/validate-reel-source-isolation.mjs <reel-package-dir>');
  process.exit(1);
}

const repoRoot = resolve('.');
const packageDir = resolve(rawPackage);
const configPath = resolve(packageDir, '06-projektdateien', 'source-isolation.json');
const config = JSON.parse(await readFile(configPath, 'utf8'));
const sourceDir = resolve(repoRoot, config.sourceDir);
const rootPath = resolve(repoRoot, 'ki/src/Root.tsx');
const errors = [];

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(path));
    else if (/\.(?:ts|tsx|json|md)$/i.test(entry.name)) out.push(path);
  }
  return out;
};

let files = [];
try {
  files = await walk(sourceDir);
} catch (error) {
  console.error(`SOURCE ISOLATION FAILED: source directory missing: ${relative(repoRoot, sourceDir)}`);
  process.exit(1);
}

if (!files.some((file) => file.endsWith('.tsx'))) errors.push('source directory contains no TSX visual/composition file');
const sourceText = (await Promise.all(files.map(async (file) => `\n/* ${relative(repoRoot, file)} */\n${await readFile(file, 'utf8')}`))).join('\n');
const rootText = await readFile(rootPath, 'utf8');

if (!rootText.includes(config.compositionId)) errors.push(`Root.tsx does not register compositionId ${config.compositionId}`);
if (config.rootImportNeedle && !rootText.includes(config.rootImportNeedle)) errors.push(`Root.tsx missing expected source import ${config.rootImportNeedle}`);

for (const token of config.requiredStrings ?? []) {
  if (!sourceText.includes(token)) errors.push(`required teen-specific source token missing: ${token}`);
}
for (const token of config.forbiddenStrings ?? []) {
  if (sourceText.toLocaleLowerCase('de-DE').includes(String(token).toLocaleLowerCase('de-DE'))) errors.push(`forbidden legacy/off-topic token found in source: ${token}`);
}

if (errors.length) {
  console.error('SOURCE ISOLATION: FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('SOURCE ISOLATION: PASSED');
console.log(`composition: ${config.compositionId}`);
console.log(`source: ${relative(repoRoot, sourceDir)}`);
console.log(`files scanned: ${files.length}`);
