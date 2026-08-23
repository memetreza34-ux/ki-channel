#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, stat} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const exportDir = path.join(reelDir, '05-export');
const reelJsonPath = path.join(reelDir, '06-projektdateien', 'reel.json');
const finalValidator = path.resolve('ki', 'scripts', 'validate-final-video.mjs');
const fail = (message) => { console.error(`EXPORT PACKAGE GATE FAILED: ${message}`); process.exit(1); };

if (!existsSync(reelDir)) fail(`reel package not found: ${reelDir}`);
if (!existsSync(exportDir)) fail('05-export directory is missing.');
if (!existsSync(reelJsonPath)) fail('06-projektdateien/reel.json is missing.');

let reel;
try { reel = JSON.parse(await readFile(reelJsonPath, 'utf8')); }
catch (error) { fail(`reel.json is invalid: ${error.message}`); }

const compositionId = String(reel?.compositionId || '').replace(/[^A-Za-z0-9._-]+/g, '-');
if (!compositionId) fail('compositionId missing in reel.json.');

const names = {
  video: `${compositionId}.mp4`,
  cover: `${compositionId}-cover.png`,
  caption: `${compositionId}-caption.txt`,
  manifest: `${compositionId}-export-manifest.json`,
};
const files = Object.fromEntries(Object.entries(names).map(([key, name]) => [key, path.join(exportDir, name)]));

for (const [kind, file] of Object.entries(files)) {
  if (!existsSync(file)) fail(`${kind} missing: ${file}`);
  const info = await stat(file);
  if (info.size < (kind === 'caption' || kind === 'manifest' ? 20 : 1024)) fail(`${kind} is unexpectedly small: ${file}`);
}

const caption = (await readFile(files.caption, 'utf8')).trim();
if (/\b(?:OFFEN|TODO|TBD|PLATZHALTER)\b/i.test(caption)) fail('export caption still contains a placeholder.');

let manifest;
try { manifest = JSON.parse(await readFile(files.manifest, 'utf8')); }
catch (error) { fail(`export manifest is invalid: ${error.message}`); }
if (manifest.status !== 'FINAL_EXPORT_READY') fail('manifest status is not FINAL_EXPORT_READY.');
if (manifest.audioGate !== 'PASSED_BEFORE_EXPORT') fail('manifest does not confirm the pre-export audio gate.');
if (manifest.exportedVideo !== names.video || manifest.cover !== names.cover || manifest.caption !== names.caption) {
  fail('manifest filenames do not match the canonical export package.');
}

const gate = spawnSync(process.execPath, [finalValidator, files.video], {encoding: 'utf8'});
if (gate.stdout) process.stdout.write(gate.stdout);
if (gate.stderr) process.stderr.write(gate.stderr);
if (gate.status !== 0) fail('exported MP4 failed the final video/audio gate.');

console.log('EXPORT PACKAGE GATE PASSED');
console.log(`video: ${files.video}`);
console.log(`cover: ${files.cover}`);
console.log(`caption: ${files.caption}`);
console.log(`manifest: ${files.manifest}`);
