#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {lstat, mkdir, readFile, realpath, writeFile} from 'node:fs/promises';
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
const htmlToText = (value) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/\s+/g, ' ').trim();
const words = (value) => (String(value || '').toLocaleLowerCase('de-DE').normalize('NFKD').match(/[\p{L}\p{N}]+/gu) || []).filter((token) => token.length >= 3);
const unique = (values) => [...new Set(values)];
const toPosix = (value) => value.split(path.sep).join('/');
const inside = (child, parent) => child === parent || child.startsWith(`${parent}${path.sep}`);

const detectImageMime = (bytes) => {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return 'image/png';
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 12 && bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP') return 'image/webp';
  return null;
};

const assetDir = path.resolve('public', 'reel-assets', compositionId);
await mkdir(assetDir, {recursive: true});

const materializeBytes = async ({bytes, mime, id}) => {
  if (!acceptedMimes.has(mime)) fail(`${id}: unsupported image MIME ${mime || 'missing'}.`);
  if (bytes.length < 1024) fail(`${id}: image is unexpectedly small (${bytes.length} bytes).`);
  if (bytes.length > 20 * 1024 * 1024) fail(`${id}: image exceeds 20 MB safety limit.`);
  const extension = extForMime(mime);
  const fileName = `${safeId(id)}${extension}`;
  const absolute = path.join(assetDir, fileName);
  await writeFile(absolute, bytes);
  return {
    localFile: toPosix(path.relative(process.cwd(), absolute)),
    staticFile: toPosix(path.relative(path.resolve('public'), absolute)),
    mime,
    bytes: bytes.length,
    sha256: sha256(bytes),
  };
};

const downloadImage = async ({url, id}) => {
  const response = await fetch(url, {redirect: 'follow', headers: {'User-Agent': 'ki-channel-visual-resolver/3.0'}});
  if (!response.ok) fail(`${id}: download failed: ${response.status} ${response.statusText}`);
  const declaredMime = String(response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  const bytes = Buffer.from(await response.arrayBuffer());
  const detectedMime = detectImageMime(bytes);
  const mime = detectedMime || declaredMime;
  return materializeBytes({bytes, mime, id});
};

const resolveLocalOfficialMedia = async (asset) => {
  const provider = sourcePolicy?.providers?.LOCAL_OFFICIAL_MEDIA;
  if (!provider?.enabled) fail(`${asset.id}: LOCAL_OFFICIAL_MEDIA provider is disabled.`);
  const sourceFileRelative = String(asset.sourceFile || '').trim();
  const sourceUrl = String(asset.sourceUrl || '').trim();
  const sourceKind = String(asset.sourceKind || '').trim();
  const assetRole = String(asset.assetRole || '').trim();
  const rightsStatus = String(asset.rightsStatus || '').trim();
  const usageReviewNote = String(asset.usageReviewNote || '').trim();
  if (!sourceFileRelative) fail(`${asset.id}: LOCAL_OFFICIAL_MEDIA requires sourceFile.`);
  if (!/^https:\/\//i.test(sourceUrl)) fail(`${asset.id}: LOCAL_OFFICIAL_MEDIA requires official https sourceUrl.`);
  if (!provider.acceptedSourceKinds?.includes(sourceKind)) fail(`${asset.id}: unsupported sourceKind ${sourceKind || 'missing'}.`);
  if (!provider.acceptedAssetRoles?.includes(assetRole)) fail(`${asset.id}: unsupported assetRole ${assetRole || 'missing'}.`);
  if (!provider.acceptedRights?.includes(rightsStatus)) fail(`${asset.id}: rightsStatus ${rightsStatus || 'missing'} is not accepted.`);
  if (usageReviewNote.length < 12) fail(`${asset.id}: usageReviewNote must document the manual brand/rights review.`);

  const sourceRoot = path.resolve(reelDir, provider.requiredRootInsideReel || '02-bilder');
  const sourceFile = path.resolve(reelDir, sourceFileRelative);
  if (!inside(sourceFile, sourceRoot)) fail(`${asset.id}: sourceFile must stay inside ${toPosix(path.relative(reelDir, sourceRoot))}/.`);
  if (!existsSync(sourceFile)) fail(`${asset.id}: local official media missing: ${sourceFileRelative}`);
  const stats = await lstat(sourceFile);
  if (stats.isSymbolicLink()) fail(`${asset.id}: symlinked official media is forbidden.`);
  if (!stats.isFile()) fail(`${asset.id}: sourceFile is not a regular file.`);
  const [realRoot, realFile] = await Promise.all([realpath(sourceRoot), realpath(sourceFile)]);
  if (!inside(realFile, realRoot)) fail(`${asset.id}: resolved sourceFile escapes 02-bilder/.`);

  const bytes = await readFile(realFile);
  const mime = detectImageMime(bytes);
  if (!mime || !provider.acceptedMimes?.includes(mime)) fail(`${asset.id}: local official media must be JPEG/PNG/WebP.`);
  const materialized = await materializeBytes({bytes, mime, id: asset.id});
  return {
    id: asset.id,
    sceneId: asset.sceneId,
    provider: 'LOCAL_OFFICIAL_MEDIA',
    purpose: asset.purpose,
    sourceFileOriginal: toPosix(path.relative(reelDir, realFile)),
    sourceUrl,
    sourceKind,
    assetRole,
    rightsStatus,
    usageReviewNote,
    manualRightsReviewRequired: true,
    ...materialized,
  };
};

const orientationScore = (width, height, preference) => {
  const ratio = width / Math.max(1, height);
  const target = preference === 'PORTRAIT' ? 0.60 : preference === 'LANDSCAPE' ? 1.55 : preference === 'SQUARE' ? 1 : null;
  if (!target) {
    if (ratio < 0.32 || ratio > 3.2) return -18;
    if (ratio >= 0.55 && ratio <= 1.8) return 8;
    return 3;
  }
  const distance = Math.abs(Math.log(ratio / target));
  return Math.max(-14, 14 - distance * 20);
};

const scoreCommonsCandidate = ({asset, candidate, selection, queryTokens}) => {
  const {page, metadata, rightsStatus, width, height} = candidate;
  const title = htmlToText(page?.title || '');
  const description = htmlToText(metadata?.ImageDescription?.value || '');
  const objectName = htmlToText(metadata?.ObjectName?.value || '');
  const categories = htmlToText(metadata?.Categories?.value || '');
  const corpus = `${title} ${description} ${objectName} ${categories}`.toLocaleLowerCase('de-DE');
  const matched = queryTokens.filter((token) => corpus.includes(token));
  const relevance = Math.min(36, matched.length * 7);
  const rank = Math.max(0, 14 - Number(page?.index ?? 14));
  const longEdge = Math.max(width, height);
  const shortEdge = Math.min(width, height);
  const resolution = Math.min(14, Math.max(0, (longEdge - selection.minimumLongEdge) / 180)) + Math.min(10, Math.max(0, (shortEdge - selection.minimumShortEdge) / 150));
  const orientation = orientationScore(width, height, selection.preferredOrientation);
  const rights = rightsStatus === 'PUBLIC_DOMAIN' || rightsStatus === 'CC0-1.0' ? 18 : 6;
  const lowerTitle = title.toLocaleLowerCase('de-DE');
  const genericVisualPenalty = selection.mediaIntent === 'PHOTO_OR_REAL_VISUAL' && /(logo|icon|symbol|diagram|map|karte|flag|coat of arms|wappen|screenshot|screen shot|illustration|drawing|clipart)/i.test(lowerTitle) ? -22 : 0;
  const veryWidePenalty = width / Math.max(1, height) > 3.4 || height / Math.max(1, width) > 3.4 ? -20 : 0;
  const total = relevance + rank + resolution + orientation + rights + genericVisualPenalty + veryWidePenalty;
  return {
    total: Number(total.toFixed(3)),
    breakdown: {
      relevance: Number(relevance.toFixed(3)),
      searchRank: Number(rank.toFixed(3)),
      resolution: Number(resolution.toFixed(3)),
      cropSuitability: Number(orientation.toFixed(3)),
      rights: Number(rights.toFixed(3)),
      genericVisualPenalty,
      extremeAspectPenalty: veryWidePenalty,
    },
    matchedQueryTokens: matched,
  };
};

const resolveCommons = async (asset) => {
  const provider = sourcePolicy?.providers?.WIKIMEDIA_COMMONS;
  if (!provider?.enabled) fail(`${asset.id}: Wikimedia Commons provider is disabled.`);
  const query = String(asset.searchQuery || '').trim();
  if (!query) fail(`${asset.id}: WIKIMEDIA_COMMONS requires searchQuery.`);
  const defaults = provider.defaultSelection || {};
  const selection = {
    minimumLongEdge: Number(asset?.selection?.minimumLongEdge ?? defaults.minimumLongEdge ?? 1200),
    minimumShortEdge: Number(asset?.selection?.minimumShortEdge ?? defaults.minimumShortEdge ?? 700),
    preferredOrientation: String(asset?.selection?.preferredOrientation ?? defaults.preferredOrientation ?? 'AUTO').toUpperCase(),
    mediaIntent: String(asset?.selection?.mediaIntent ?? defaults.mediaIntent ?? 'PHOTO_OR_REAL_VISUAL').toUpperCase(),
    preferPublicDomainOrCC0: asset?.selection?.preferPublicDomainOrCC0 ?? defaults.preferPublicDomainOrCC0 ?? true,
    candidateLimit: Math.min(50, Math.max(8, Number(asset?.selection?.candidateLimit ?? defaults.candidateLimit ?? 20))),
  };
  if (!['AUTO', 'PORTRAIT', 'LANDSCAPE', 'SQUARE'].includes(selection.preferredOrientation)) fail(`${asset.id}: invalid preferredOrientation ${selection.preferredOrientation}.`);
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6',
    gsrlimit: String(selection.candidateLimit),
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: '1800',
    format: 'json',
    origin: '*',
  });
  const url = `${provider.api}?${params}`;
  const response = await fetch(url, {headers: {'User-Agent': 'ki-channel-visual-resolver/3.0'}});
  if (!response.ok) fail(`${asset.id}: Commons search failed: ${response.status}.`);
  const payload = await response.json();
  const pages = Object.values(payload?.query?.pages || {}).sort((a, b) => Number(a?.index ?? 9999) - Number(b?.index ?? 9999));
  const candidates = [];
  const queryTokens = unique(words(query));
  for (const page of pages) {
    const info = page?.imageinfo?.[0];
    const metadata = info?.extmetadata || {};
    const rightsStatus = rightsMap(metadata?.LicenseShortName?.value || metadata?.UsageTerms?.value);
    if (!rightsStatus || !provider.acceptedRights.includes(rightsStatus)) continue;
    const mime = String(info?.mime || '').toLowerCase();
    if (!acceptedMimes.has(mime)) continue;
    const width = Number(info?.width || 0);
    const height = Number(info?.height || 0);
    if (Math.max(width, height) < selection.minimumLongEdge || Math.min(width, height) < selection.minimumShortEdge) continue;
    const candidate = {page, info, metadata, rightsStatus, mime, width, height};
    const score = scoreCommonsCandidate({asset, candidate, selection, queryTokens});
    if (selection.preferPublicDomainOrCC0 && rightsStatus === 'CC-BY-4.0') score.total -= 5;
    candidates.push({...candidate, score});
  }
  if (!candidates.length) fail(`${asset.id}: no Wikimedia candidate passed license + quality policy for query "${query}".`);
  candidates.sort((a, b) => b.score.total - a.score.total || Number(a.page?.index ?? 9999) - Number(b.page?.index ?? 9999) || String(a.page?.title || '').localeCompare(String(b.page?.title || '')));
  const winner = candidates[0];
  const title = String(winner.page.title || '');
  const sourcePageUrl = `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;
  const attribution = htmlToText(winner.metadata?.Credit?.value || winner.metadata?.Artist?.value || winner.metadata?.Attribution?.value);
  if (winner.rightsStatus === 'CC-BY-4.0' && !attribution) fail(`${asset.id}: selected CC-BY-4.0 file has no usable attribution metadata.`);
  const downloadUrl = winner.info.thumburl || winner.info.url;
  const downloaded = await downloadImage({url: downloadUrl, id: asset.id});
  const topCandidates = candidates.slice(0, 5).map((candidate) => ({
    title: String(candidate.page?.title || ''),
    pageId: candidate.page?.pageid,
    width: candidate.width,
    height: candidate.height,
    rightsStatus: candidate.rightsStatus,
    score: candidate.score,
  }));
  return {
    id: asset.id,
    sceneId: asset.sceneId,
    provider: 'WIKIMEDIA_COMMONS',
    purpose: asset.purpose,
    searchQuery: query,
    selectionPolicy: selection,
    selectedTitle: title,
    pageId: winner.page.pageid,
    sourceUrl: sourcePageUrl,
    downloadUrl,
    rightsStatus: winner.rightsStatus,
    licenseUrl: winner.metadata?.LicenseUrl?.value || null,
    attribution: attribution || null,
    width: winner.width,
    height: winner.height,
    selectionScore: winner.score,
    topCandidates,
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
  } else if (asset.provider === 'LOCAL_OFFICIAL_MEDIA') {
    resolved.push(await resolveLocalOfficialMedia(asset));
  } else if (asset.provider === 'WIKIMEDIA_COMMONS') {
    resolved.push(await resolveCommons(asset));
  } else if (asset.provider === 'GITHUB_RAW') {
    resolved.push(await resolveGithub(asset));
  } else {
    fail(`${asset.id}: unsupported provider ${asset.provider}.`);
  }
}

const payload = {
  version: 3,
  status: 'VISUAL_ASSETS_RESOLVED_LOCAL_LOCK',
  compositionId,
  generatedAt: new Date().toISOString(),
  sourceManifest: toPosix(path.relative(process.cwd(), manifestPath)),
  policy: {
    renderTimeRemoteMedia: false,
    googleImageSearchAsLicenseAuthority: false,
    deterministicAfterResolution: true,
    rankedSelectionBeforeDownload: true,
    localOfficialMediaAutoDownload: false,
  },
  assets: resolved,
};
await writeFile(resolvedPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log('VISUAL ASSET RESOLUTION PASSED');
console.log(`assets: ${resolved.length}`);
console.log(`external local files: ${resolved.filter((asset) => asset.localFile).length}`);
for (const asset of resolved.filter((item) => item.provider === 'WIKIMEDIA_COMMONS')) {
  console.log(`${asset.id}: ${asset.selectedTitle} | score ${asset.selectionScore?.total ?? '?'} | ${asset.rightsStatus}`);
}
for (const asset of resolved.filter((item) => item.provider === 'LOCAL_OFFICIAL_MEDIA')) {
  console.log(`${asset.id}: ${asset.assetRole} | local official media | ${asset.sha256}`);
}
console.log(`resolved manifest: ${resolvedPath}`);
