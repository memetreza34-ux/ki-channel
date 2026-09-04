#!/usr/bin/env node
import {createHash} from 'node:crypto';
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
const manifestPath = path.join(reelDir, '06-projektdateien', 'visual-assets.json');
const resolvedPath = path.join(reelDir, '06-projektdateien', 'visual-assets-resolved.json');
const reelPath = path.join(reelDir, '06-projektdateien', 'reel.json');
const fail = (message) => { console.error(`VISUAL ASSET GATE FAILED: ${message}`); process.exit(1); };
for (const file of [manifestPath, resolvedPath, reelPath]) if (!existsSync(file)) fail(`required visual file missing: ${file}`);

let manifest;
let resolved;
let reel;
try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')); }
catch (error) { fail(`invalid visual-assets.json: ${error.message}`); }
try { resolved = JSON.parse(await readFile(resolvedPath, 'utf8')); }
catch (error) { fail(`invalid visual-assets-resolved.json: ${error.message}`); }
try { reel = JSON.parse(await readFile(reelPath, 'utf8')); }
catch (error) { fail(`invalid reel.json: ${error.message}`); }

const allowedProviders = new Set(['NATIVE_UI', 'LOCAL_OFFICIAL_MEDIA', 'OFFICIAL_SOURCE_CARD', 'WIKIMEDIA_COMMONS', 'GITHUB_RAW']);
const allowedRights = new Set(['NATIVE_ORIGINAL', 'OFFICIAL_SOURCE_REFERENCE', 'CC0-1.0', 'PUBLIC_DOMAIN', 'CC-BY-4.0', 'MIT', 'Apache-2.0']);
const binaryProviders = new Set(['LOCAL_OFFICIAL_MEDIA', 'WIKIMEDIA_COMMONS', 'GITHUB_RAW']);
const assets = Array.isArray(manifest?.assets) ? manifest.assets : [];
const resolvedAssets = Array.isArray(resolved?.assets) ? resolved.assets : [];
if (!assets.length) fail('visual-assets.json has no assets.');
if (resolved?.status !== 'VISUAL_ASSETS_RESOLVED_LOCAL_LOCK') fail('resolved visual status is not VISUAL_ASSETS_RESOLVED_LOCAL_LOCK.');
if (resolvedAssets.length !== assets.length) fail(`resolved asset count ${resolvedAssets.length} != source manifest ${assets.length}.`);
if (resolved?.policy?.renderTimeRemoteMedia !== false) fail('resolved visual policy must forbid render-time remote media.');
if (resolved?.policy?.googleImageSearchAsLicenseAuthority !== false) fail('Google image search must never be a license authority.');

const maxExternalBinaries = Number(reel?.visuals?.maxExternalBinaries ?? 2);
if (!Number.isInteger(maxExternalBinaries) || maxExternalBinaries < 0 || maxExternalBinaries > 8) {
  fail(`reel.visuals.maxExternalBinaries must be an integer from 0 to 8, got ${reel?.visuals?.maxExternalBinaries ?? 'default'}.`);
}
const manifestExternalCount = assets.filter((asset) => binaryProviders.has(asset?.provider)).length;
const resolvedExternalCount = resolvedAssets.filter((asset) => Boolean(asset?.localFile || asset?.staticFile)).length;
if (manifestExternalCount > maxExternalBinaries) {
  fail(`external binary visual count ${manifestExternalCount} exceeds maxExternalBinaries=${maxExternalBinaries}. Keep the reel native-first or explicitly raise the reviewed limit in reel.json.`);
}
if (resolvedExternalCount !== manifestExternalCount) {
  fail(`resolved external binary count ${resolvedExternalCount} != manifest external binary count ${manifestExternalCount}.`);
}

const hashFile = async (file) => createHash('sha256').update(await readFile(file)).digest('hex');
const ids = new Set();
const resolvedById = new Map(resolvedAssets.map((asset) => [asset.id, asset]));
for (const asset of assets) {
  if (!asset?.id || !asset?.sceneId || !asset?.provider || !asset?.renderMode || !asset?.purpose) fail('asset entry is incomplete.');
  if (ids.has(asset.id)) fail(`duplicate asset id: ${asset.id}`);
  ids.add(asset.id);
  if (!allowedProviders.has(asset.provider)) fail(`provider is not allowlisted: ${asset.provider}`);
  const materialized = resolvedById.get(asset.id);
  if (!materialized) fail(`${asset.id}: missing from resolved visual manifest.`);
  if (materialized.provider !== asset.provider || materialized.sceneId !== asset.sceneId) fail(`${asset.id}: resolved provider/scene mismatch.`);

  if (asset.provider === 'NATIVE_UI') {
    if (asset.rightsStatus !== 'NATIVE_ORIGINAL') fail(`${asset.id}: NATIVE_UI requires NATIVE_ORIGINAL.`);
    if (materialized.localFile || materialized.staticFile) fail(`${asset.id}: NATIVE_UI must not declare an external binary.`);
  }

  if (asset.provider === 'LOCAL_OFFICIAL_MEDIA') {
    if (asset.rightsStatus !== 'OFFICIAL_SOURCE_REFERENCE') fail(`${asset.id}: LOCAL_OFFICIAL_MEDIA requires OFFICIAL_SOURCE_REFERENCE.`);
    if (!String(asset.sourceFile || '').trim()) fail(`${asset.id}: LOCAL_OFFICIAL_MEDIA requires sourceFile.`);
    if (!/^https:\/\//i.test(asset.sourceUrl || '')) fail(`${asset.id}: LOCAL_OFFICIAL_MEDIA requires official https sourceUrl.`);
    if (!['PRESS_KIT','OFFICIAL_WEBSITE','OFFICIAL_PRODUCT_UI','USER_PROVIDED_OFFICIAL_EXPORT'].includes(String(asset.sourceKind || ''))) fail(`${asset.id}: invalid sourceKind.`);
    if (!['LOGO','WORDMARK','PRODUCT_UI','SCREENSHOT','PRODUCT_IMAGE'].includes(String(asset.assetRole || ''))) fail(`${asset.id}: invalid assetRole.`);
    if (String(asset.usageReviewNote || '').trim().length < 12) fail(`${asset.id}: usageReviewNote missing/too short.`);
    if (materialized.manualRightsReviewRequired !== true) fail(`${asset.id}: resolved local official media must retain manualRightsReviewRequired=true.`);
    if (materialized.sourceUrl !== asset.sourceUrl || materialized.sourceKind !== asset.sourceKind || materialized.assetRole !== asset.assetRole) fail(`${asset.id}: resolved official-media provenance mismatch.`);
  }

  if (asset.provider === 'OFFICIAL_SOURCE_CARD') {
    if (asset.rightsStatus !== 'OFFICIAL_SOURCE_REFERENCE') fail(`${asset.id}: OFFICIAL_SOURCE_CARD requires OFFICIAL_SOURCE_REFERENCE.`);
    if (!asset.sourceUrl || !/^https:\/\//i.test(asset.sourceUrl)) fail(`${asset.id}: official source card requires an https sourceUrl.`);
    if (materialized.localFile || materialized.staticFile) fail(`${asset.id}: source proof card must stay native and must not copy a remote page as render media.`);
  }

  if (asset.provider === 'WIKIMEDIA_COMMONS') {
    if (!String(asset.searchQuery || '').trim()) fail(`${asset.id}: Wikimedia Commons requires searchQuery.`);
    if (!/^https:\/\/commons\.wikimedia\.org\//i.test(materialized.sourceUrl || '')) fail(`${asset.id}: selected Wikimedia sourceUrl is invalid.`);
    if (!String(materialized.selectedTitle || '').trim()) fail(`${asset.id}: selected Wikimedia title missing.`);
    if (!Number.isFinite(Number(materialized?.selectionScore?.total))) fail(`${asset.id}: deterministic selectionScore missing.`);
    if (!Array.isArray(materialized.topCandidates) || !materialized.topCandidates.length) fail(`${asset.id}: ranked candidate audit trail missing.`);
  }

  if (asset.provider === 'GITHUB_RAW') {
    if (!/^https:\/\/raw\.githubusercontent\.com\//i.test(asset.sourceUrl || '')) fail(`${asset.id}: GITHUB_RAW source must be raw.githubusercontent.com.`);
    if (!/^[0-9a-f]{40}$/i.test(asset.commitSha || '')) fail(`${asset.id}: GITHUB_RAW requires full commitSha.`);
    if (!String(asset.sourceUrl).toLowerCase().includes(String(asset.commitSha).toLowerCase())) fail(`${asset.id}: GitHub source is not pinned to commitSha.`);
    if (!/^https:\/\/github\.com\//i.test(asset.licenseUrl || '')) fail(`${asset.id}: GitHub asset needs a github.com licenseUrl.`);
  }

  if (binaryProviders.has(asset.provider)) {
    if (!allowedRights.has(materialized.rightsStatus)) fail(`${asset.id}: resolved rightsStatus is not allowlisted: ${materialized.rightsStatus}`);
    if (!materialized.localFile || !materialized.staticFile) fail(`${asset.id}: binary provider did not resolve to a local render file.`);
    const absolute = path.resolve(materialized.localFile);
    if (!absolute.startsWith(path.resolve('public'))) fail(`${asset.id}: local file must live under public/.`);
    if (!existsSync(absolute)) fail(`${asset.id}: resolved local file is missing: ${materialized.localFile}`);
    if (!/^[a-f0-9]{64}$/i.test(materialized.sha256 || '')) fail(`${asset.id}: resolved image SHA256 missing/invalid.`);
    const actualHash = await hashFile(absolute);
    if (actualHash.toLowerCase() !== String(materialized.sha256).toLowerCase()) fail(`${asset.id}: local image SHA256 mismatch.`);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(materialized.mime)) fail(`${asset.id}: unsupported resolved image MIME ${materialized.mime}.`);
    if (materialized.rightsStatus === 'CC-BY-4.0' && !String(materialized.attribution || '').trim()) fail(`${asset.id}: CC-BY-4.0 requires attribution.`);
  }
}

for (const asset of resolvedAssets) if (!ids.has(asset.id)) fail(`resolved manifest contains unknown asset id: ${asset.id}`);

const sourceDir = path.resolve(reel?.sourceDir || '');
if (!reel?.sourceDir || !existsSync(sourceDir)) fail('reel.sourceDir missing or does not exist.');
const sourceFiles = [];
const walk = async (dir) => {
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (/\.(?:ts|tsx)$/i.test(entry.name)) sourceFiles.push(full);
  }
};
await walk(sourceDir);
for (const file of sourceFiles) {
  const sourceText = await readFile(file, 'utf8');
  if (/\bsrc\s*=\s*["'{`]https?:\/\//i.test(sourceText)) fail(`${path.relative(process.cwd(), file)} contains a render-time remote src URL.`);
  if (/\b(?:Img|Html5Video|Video|Audio|Html5Audio)\b[\s\S]{0,160}\bsrc\s*=\s*["'{`]https?:\/\//i.test(sourceText)) fail(`${path.relative(process.cwd(), file)} references remote render media.`);
}

console.log('VISUAL ASSET GATE PASSED');
console.log(`assets: ${assets.length}`);
console.log(`external local binaries: ${resolvedExternalCount}/${maxExternalBinaries} max`);
console.log(`local official media: ${assets.filter((asset) => asset.provider === 'LOCAL_OFFICIAL_MEDIA').length}`);
console.log(`source files scanned: ${sourceFiles.length}`);
console.log('ranked external selection: verified');
console.log('render-time remote URLs: forbidden');
console.log('Google search result as license authority: forbidden');
