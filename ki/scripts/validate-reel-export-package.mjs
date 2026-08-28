#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, stat} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import {safeCompositionId, sha256File} from './lib/render-provenance.mjs';

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

const compositionId = safeCompositionId(reel?.compositionId);
if (!compositionId) fail('compositionId missing in reel.json.');
const sfxEnabled = reel?.sfx?.enabled === true;
const visualsEnabled = reel?.visuals?.enabled === true;

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
if (manifest.exportedVideo !== names.video || manifest.cover !== names.cover || manifest.caption !== names.caption) fail('manifest filenames do not match the canonical export package.');

for (const gate of ['entertainment', 'voiceLock', 'audioVideo']) {
  if (manifest?.gates?.[gate] !== 'PASSED') fail(`manifest gate ${gate} is not PASSED.`);
}
if (manifest?.gates?.localForcedAlignment !== 'PASSED_EXACT_KNOWN_TRANSCRIPT') fail('manifest localForcedAlignment gate is not PASSED_EXACT_KNOWN_TRANSCRIPT.');
if (manifest?.gates?.sceneVoiceMap !== 'PASSED_EXACT_SCENE_TEXT_AND_ANCHORS') fail('manifest sceneVoiceMap gate is not PASSED_EXACT_SCENE_TEXT_AND_ANCHORS.');
if (sfxEnabled && manifest?.gates?.sfx !== 'PASSED_CC0_AUTO_RESOLVED_AND_LOCKED') fail('manifest SFX gate is not PASSED_CC0_AUTO_RESOLVED_AND_LOCKED.');
if (!sfxEnabled && manifest?.gates?.sfx !== 'NOT_APPLICABLE') fail('manifest SFX gate must be NOT_APPLICABLE when SFX is disabled.');
if (visualsEnabled && manifest?.gates?.visuals !== 'PASSED_RIGHTS_LOCAL_FILE_SHA256_AND_LOCK') fail('manifest visual gate is not PASSED_RIGHTS_LOCAL_FILE_SHA256_AND_LOCK.');
if (!visualsEnabled && manifest?.gates?.visuals !== 'NOT_APPLICABLE') fail('manifest visual gate must be NOT_APPLICABLE when visuals are disabled.');
if (manifest?.gates?.motionReadability !== 'PASSED_EXACT_VIDEO_HASH') fail('manifest motionReadability gate is not PASSED_EXACT_VIDEO_HASH.');
if (!['PASSED', 'NOT_APPLICABLE'].includes(manifest?.gates?.sourceIsolation)) fail('manifest sourceIsolation gate is invalid.');
if (manifest?.gates?.renderProvenance !== 'PASSED_LOCKED_INPUT_HASHES') fail('manifest renderProvenance gate is not PASSED_LOCKED_INPUT_HASHES.');

const provenance = manifest?.provenance || {};
const requiredProvenance = ['renderSourceCommitSha', 'finalizationCommitSha', 'sourceDir', 'sourceTreeSha256', 'renderContractSha256', 'reelJsonSha256AtRenderLock', 'reelJsonSha256AtFinalization', 'sceneVoiceMapSha256', 'wordTimingsSha256', 'captionJsonSha256', 'canonicalAudioSha256', 'runtimeAudioSha256', 'reviewedVideoSha256'];
if (sfxEnabled) requiredProvenance.push('sfxResolvedSha256');
if (visualsEnabled) requiredProvenance.push('visualManifestSha256', 'visualResolvedSha256');
for (const key of requiredProvenance) {
  if (!provenance[key] || typeof provenance[key] !== 'string') fail(`manifest provenance field missing: ${key}.`);
}
const artifacts = manifest?.artifacts || {};
for (const key of ['videoSha256', 'coverSha256', 'captionSha256']) {
  if (!artifacts[key] || typeof artifacts[key] !== 'string') fail(`manifest artifact hash missing: ${key}.`);
}

const actualArtifactHashes = {
  videoSha256: await sha256File(files.video),
  coverSha256: await sha256File(files.cover),
  captionSha256: await sha256File(files.caption),
};
for (const [key, value] of Object.entries(actualArtifactHashes)) {
  if (artifacts[key] !== value) fail(`export artifact hash mismatch: ${key}.`);
}
if (provenance.reviewedVideoSha256 !== actualArtifactHashes.videoSha256) fail('exported video is not byte-identical to the reviewed video hash.');

const gate = spawnSync(process.execPath, [finalValidator, files.video], {encoding: 'utf8'});
if (gate.stdout) process.stdout.write(gate.stdout);
if (gate.stderr) process.stderr.write(gate.stderr);
if (gate.status !== 0) fail('exported MP4 failed the final video/audio gate.');

console.log('EXPORT PACKAGE GATE PASSED');
console.log(`video: ${files.video}`);
console.log(`cover: ${files.cover}`);
console.log(`caption: ${files.caption}`);
console.log(`manifest: ${files.manifest}`);
console.log(`sfx: ${sfxEnabled ? 'CC0 AUTO-RESOLVED + LOCKED' : 'NOT_APPLICABLE'}`);
console.log(`visuals: ${visualsEnabled ? 'RIGHTS + LOCAL SHA256 + LOCKED' : 'NOT_APPLICABLE'}`);
console.log(`render source commit: ${provenance.renderSourceCommitSha}`);
console.log(`video sha256: ${actualArtifactHashes.videoSha256}`);
