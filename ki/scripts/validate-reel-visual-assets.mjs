#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/validate-reel-visual-assets.mjs <reel-package-dir>');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const manifestPath = path.join(reelDir,'06-projektdateien','visual-assets.json');
const reelPath = path.join(reelDir,'06-projektdateien','reel.json');
const fail = (message) => { console.error(`VISUAL ASSET GATE FAILED: ${message}`); process.exit(1); };
if (!existsSync(manifestPath)) fail(`visual-assets.json missing: ${manifestPath}`);
if (!existsSync(reelPath)) fail(`reel.json missing: ${reelPath}`);

let manifest;
let reel;
try { manifest = JSON.parse(await readFile(manifestPath,'utf8')); }
catch (error) { fail(`invalid visual-assets.json: ${error.message}`); }
try { reel = JSON.parse(await readFile(reelPath,'utf8')); }
catch (error) { fail(`invalid reel.json: ${error.message}`); }

const allowedProviders = new Set(['NATIVE_UI','OFFICIAL_SOURCE_CARD','GITHUB_RAW','DIRECT_HTTPS_REVIEWED']);
const allowedRights = new Set(['NATIVE_ORIGINAL','OFFICIAL_SOURCE_REFERENCE','CC0-1.0','PUBLIC_DOMAIN','CC-BY-4.0','MIT','Apache-2.0']);
const assets = Array.isArray(manifest?.assets) ? manifest.assets : [];
if (!assets.length) fail('visual-assets.json has no assets. Use at least NATIVE_UI entries for scenes that intentionally need no external binary.');

const ids = new Set();
for (const asset of assets) {
  if (!asset?.id || !asset?.sceneId || !asset?.provider || !asset?.renderMode || !asset?.purpose) fail('asset entry is incomplete.');
  if (ids.has(asset.id)) fail(`duplicate asset id: ${asset.id}`);
  ids.add(asset.id);
  if (!allowedProviders.has(asset.provider)) fail(`provider is not allowlisted: ${asset.provider}`);
  if (!allowedRights.has(asset.rightsStatus)) fail(`rightsStatus is not allowlisted for ${asset.id}: ${asset.rightsStatus}`);
  if (asset.provider !== 'NATIVE_UI') {
    if (!asset.sourceUrl || !/^https:\/\//i.test(asset.sourceUrl)) fail(`${asset.id} requires an https sourceUrl.`);
  }
  if (asset.provider === 'OFFICIAL_SOURCE_CARD' && asset.rightsStatus !== 'OFFICIAL_SOURCE_REFERENCE') fail(`${asset.id}: OFFICIAL_SOURCE_CARD requires OFFICIAL_SOURCE_REFERENCE.`);
  if (asset.provider === 'GITHUB_RAW') {
    if (!/github\.com|raw\.githubusercontent\.com/i.test(asset.sourceUrl || '')) fail(`${asset.id}: GITHUB_RAW source is not GitHub.`);
    if (!['CC0-1.0','PUBLIC_DOMAIN','CC-BY-4.0','MIT','Apache-2.0'].includes(asset.rightsStatus)) fail(`${asset.id}: GitHub asset has no accepted license.`);
  }
  if (asset.rightsStatus === 'CC-BY-4.0' && !String(asset.attribution || '').trim()) fail(`${asset.id}: CC-BY-4.0 requires attribution.`);
  if (asset.localFile) {
    const absolute = path.resolve(asset.localFile);
    if (!existsSync(absolute)) fail(`${asset.id}: declared localFile is missing: ${asset.localFile}`);
    if (!absolute.startsWith(path.resolve('public'))) fail(`${asset.id}: localFile must live under public/.`);
  }
}

const sourceDir = path.resolve(reel?.sourceDir || '');
if (!reel?.sourceDir || !existsSync(sourceDir)) fail('reel.sourceDir missing or does not exist.');
const sourceFiles = [];
const walk = async (dir) => {
  for (const entry of await readdir(dir,{withFileTypes:true})) {
    const full = path.join(dir,entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (/\.(?:ts|tsx)$/i.test(entry.name)) sourceFiles.push(full);
  }
};
await walk(sourceDir);
for (const file of sourceFiles) {
  const text = await readFile(file,'utf8');
  if (/\bsrc\s*=\s*["'{`]https?:\/\//i.test(text)) fail(`${path.relative(process.cwd(),file)} contains a render-time remote src URL.`);
  if (/\b(?:Img|Html5Video|Video|Audio|Html5Audio)\b[\s\S]{0,160}\bsrc\s*=\s*["'{`]https?:\/\//i.test(text)) fail(`${path.relative(process.cwd(),file)} references remote render media.`);
}

console.log('VISUAL ASSET GATE PASSED');
console.log(`assets: ${assets.length}`);
console.log(`source files scanned: ${sourceFiles.length}`);
console.log('render-time remote URLs: forbidden');
console.log('Google search result as license authority: forbidden');
