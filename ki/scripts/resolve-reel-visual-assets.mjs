#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/resolve-reel-visual-assets.mjs <reel-package-dir>');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const reelPath = path.join(reelDir, '06-projektdateien', 'reel.json');
const manifestPath = path.join(reelDir, '06-projektdateien', 'visual-assets.json');
const resolvedPath = path.join(reelDir, '06-projektdateien', 'visual-assets-resolved.json');
const sourcePolicyPath = path.resolve('ki/config/visual-asset-sources.json');
const fail = (message) => { console.error(`VISUAL ASSET RESOLUTION FAILED: ${message}`); process.exit(1); };

for (const file of [reelPath, manifestPath, sourcePolicyPath]) {
  if (!existsSync(file)) fail(`missing required file: ${file}`);
}

const reel = JSON.parse(await readFile(reelPath, 'utf8'));
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const sourcePolicy = JSON.parse(await readFile(sourcePolicyPath, 'utf8'));
const compositionId = String(reel?.compositionId || '').replace(/[^A-Za-z0-9._-]+/g, '-');
if (!compositionId) fail('compositionId missing.');

const assets = Array.isArray(manifest?.assets) ? manifest.assets : [];
if (!assets.length) fail('visual-assets.json contains no assets.');

const acceptedMimes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const rightsMap = (raw) => {
  const value = String(raw || '').toLowerCase().replace(/\s+/g, ' ').trim();
  if (value.includes('cc0') || value.includes('creative commons zero')) return 'CC0-1.0';
  if (value.includes('public domain')) return 'PUBLIC_DOMAIN';
  if (value.includes('cc by 4.0') || value.includes('attribution 4.0')) return 'CC-BY-4.0';
  return null;
};
const safeId = (value) => String(value).replace(/[^A-Za-z0-9._-]+/g, '-');
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const extForMime = (mime) => mime === 'image/jpeg' ? '.jpg' : mime === 'image/png' ? '.png' : mime === 'image/webp' ? '.webp' : null;
const htmlToText = (value) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim();

const assetDir = path.resolve('public', 'reel-assets', compositionId);
await mkdir(assetDir, {recursive: true});

const downloadImage = async ({url, id, expectedMime = null}) => {
  const response = await fetch(url, {redirect: 'follow', headers: {'User-Agent': 'ki-channel-visual-resolver/1.0'}});
  if (!response.ok) fail(`${id}: download failed: ${response.status} ${response.statusText}`);
  const mime = String(response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  if (!acceptedMimes.has(mime)) fail(`${id}: unsupported content-type ${mime || 'missing'}. Only JPEG/PNG/WebP are accepted.`);
  if (expectedMime && mime !== expectedMime) fail(`${id}: content-type ${mime} does not match metadata ${expectedMime}.`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 4096) fail(`${id}: downloaded image is unexpectedly small (${bytes.length} bytes).`);
  if (bytes.length > 20 * 1024 * 1024) fail(`${id}: downloaded image exceeds 20 MB safety limit.`);
  const extension = extForMime(mime);
  const fileName = `${safeId(id)}${extension}`;
  const absolute = path.join(assetDir, fileName);
  await writeFile(absolute, bytes);
  return {
    localFile: path.relative(process.cwd(), absolute).split(path.sep).join('/'),
    staticFile: path.relative(path.resolve('public'), absolute).split(path.sep).join('/'),
    mime,
    bytes: bytes.length,
    sha256: sha256(bytes),
  };
};

const resolveCommons = async (asset) => {
  const provider = sourcePolicy?.providers?.WIKIMEDIA_COMMONS;
  if (!provider?.enabled) fail(`${asset.id}: Wikimedia Commons provider is disabled.`);
  const query = String(asset.searchQuery || '').trim();
  if (!query) fail(`${asset.id}: WIKIMEDIA_COMMONS requires searchQuery.`);
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6',
    gsrlimit: '12',
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    format: 'json',
    origin: '*',
  });
  const url = `${provider.api}?${params}`;
  const response = await fetch(url, {headers: {'User-Agent': 'ki-channel-visual-resolver/1.0'}});
  if (!response.ok) fail(`${asset.id}: Commons search failed: ${response.status}.`);
  const payload = await response.json();
  const pages = Object.values(payload?.query?.pages || {}).sort((a, b) => Number(a?.index ?? 9999) - Number(b?.index ?? 9999));
  const candidates = [];
  for (const page of pages) {
    const info = page?.imageinfo?.[0];
    const metadata = info?.extmetadata || {};
    const rightsStatus = rightsMap(metadata?.LicenseShortName?.value || metadata?.UsageTerms?.value);
    if (!rightsStatus || !provider.acceptedRights.includes(rightsStatus)) continue;
    const mime = String(info?.mime || '').toLowerCase();
    if (!acceptedMimes.has(mime)) continue;
    const width = Number(info?.width || 0);
    const height = Number(info?.height || 0);
    if (Math.max(width, height) < 900) continue;
    candidates.push({page, info, metadata, rightsStatus, mime, width, height});
  }
  if (!candidates.length) fail(`${asset.id}: no Wikimedia candidate passed license + image-quality policy for query "${query}".`);
  const winner = candidates[0];
  const title = String(winner.page.title || '');
  const sourcePageUrl = `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;
  const attribution = htmlToText(winner.metadata?.Credit?.value || winner.metadata?.Artist?.value || winner.metadata?.Attribution?.value);
  if (winner.rightsStatus === 'CC-BY-4.0' && !attribution) fail(`${asset.id}: selected CC-BY-4.0 file has no usable attribution metadata.`);
  const downloaded = await downloadImage({url: winner.info.url, id: asset.id, expectedMime: winner.mime});
  return {
    id: asset.id,
    sceneId: asset.sceneId,
    provider: 'WIKIMEDIA_COMMONS',
    purpose: asset.purpose,
    searchQuery: query,
    selectedTitle: title,
    pageId: winner.page.pageid,
    sourceUrl: sourcePageUrl,
    downloadUrl: winner.info.url,
    rightsStatus: winner.rightsStatus,
    licenseUrl: winner.metadata?.LicenseUrl?.value || null,
    attribution: attribution || null,
    width: winner.width,
    height: winner.height,
    ...downloaded,
  };
};

const resolveGithub = async (asset) => {
  const provider = sourcePolicy?.providers?.GITHUB_RAW;
  if (!provider?.enabled) fail(`${asset.id}: GitHub Raw provider is disabled.`);
  const sourceUrl = String(asset.sourceUrl || '');
  const commitSha = String(asset.commitSha || '');
  const rightsStatus = String(asset.rightsStatus || '');
  const licenseUrl = String(asset.licenseUrl || '');
  if (!/^https:\/\/raw\.githubusercontent\.com\//i.test(sourceUrl)) fail(`${asset.id}: GITHUB_RAW requires an exact raw.githubusercontent.com URL.`);
  if (!/^[0-9a-f]{40}$/i.test(commitSha)) fail(`${asset.id}: GITHUB_RAW requires a full 40-character commitSha.`);
  if (!sourceUrl.toLowerCase().includes(commitSha.toLowerCase())) fail(`${asset.id}: sourceUrl is not pinned to commitSha.`);
  if (!provider.acceptedRights.includes(rightsStatus)) fail(`${asset.id}: rightsStatus ${rightsStatus} is not allowlisted for GitHub Raw.`);
  if (!/^https:\/\/github\.com\//i.test(licenseUrl)) fail(`${asset.id}: GitHub Raw requires a github.com licenseUrl.`);
  if (rightsStatus === 'CC-BY-4.0' && !String(asset.attribution || '').trim()) fail(`${asset.id}: CC-BY-4.0 requires attribution.`);
  const downloaded = await downloadImage({url: sourceUrl, id: asset.id});
  return {
    id: asset.id,
    sceneId: asset.sceneId,
    provider: 'GITHUB_RAW',
    purpose: asset.purpose,
    sourceUrl,
    commitSha,
    rightsStatus,
    licenseUrl,
    attribution: String(asset.attribution || '').trim() || null,
    ...downloaded,
  };
};

const resolved = [];
for (const asset of assets) {
  if (!asset?.id || !asset?.sceneId || !asset?.provider || !asset?.purpose) fail('every visual asset needs id, sceneId, provider and purpose.');
  if (asset.provider === 'NATIVE_UI' || asset.provider === 'OFFICIAL_SOURCE_CARD') {
    resolved.push({
      id: asset.id,
      sceneId: asset.sceneId,
      provider: asset.provider,
      purpose: asset.purpose,
      rightsStatus: asset.rightsStatus,
      sourceUrl: asset.sourceUrl || null,
      localFile: null,
      staticFile: null,
      sha256: null,
    });
  } else if (asset.provider === 'WIKIMEDIA_COMMONS') {
    resolved.push(await resolveCommons(asset));
  } else if (asset.provider === 'GITHUB_RAW') {
    resolved.push(await resolveGithub(asset));
  } else {
    fail(`${asset.id}: unsupported provider ${asset.provider}.`);
  }
}

const payload = {
  version: 1,
  status: 'VISUAL_ASSETS_RESOLVED_LOCAL_LOCK',
  compositionId,
  generatedAt: new Date().toISOString(),
  sourceManifest: path.relative(process.cwd(), manifestPath).split(path.sep).join('/'),
  policy: {
    renderTimeRemoteMedia: false,
    googleImageSearchAsLicenseAuthority: false,
    deterministicAfterResolution: true,
  },
  assets: resolved,
};
await writeFile(resolvedPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log('VISUAL ASSET RESOLUTION PASSED');
console.log(`assets: ${resolved.length}`);
console.log(`external local files: ${resolved.filter((asset) => asset.localFile).length}`);
console.log(`resolved manifest: ${resolvedPath}`);
