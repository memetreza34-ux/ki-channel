#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {mkdir, readFile, stat, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const positional = args.filter((arg) => !arg.startsWith('--'));
const query = positional[0]?.trim();
const option = (name, fallback) => {
  const prefix = `--${name}=`;
  const found = args.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
};

if (!query) {
  console.error('Usage: node scripts/scout-polyhaven-assets.mjs "search query" [--type=model|hdri|texture|all] [--top=6]');
  process.exit(1);
}

const type = option('type', 'model').toLowerCase();
const top = Math.min(12, Math.max(1, Number(option('top', '6')) || 6));
if (!['model', 'hdri', 'texture', 'all'].includes(type)) throw new Error(`Unsupported --type=${type}`);

const typeMap = {hdri: 0, texture: 1, model: 2};
const clean = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const normalize = (value) => clean(value).toLowerCase().normalize('NFKD');
const tokens = (value) => [...new Set(normalize(value).match(/[a-z0-9]+/g) || [])].filter((token) => token.length >= 2);
const queryTokens = tokens(query);
const safeSlug = (value) => normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70) || 'search';

const flattenAttributes = (attributes) => {
  if (!attributes || typeof attributes !== 'object') return '';
  return Object.entries(attributes)
    .flatMap(([key, value]) => [key, ...(Array.isArray(value) ? value : [value])])
    .map(clean)
    .join(' ');
};

const scoreAsset = (id, asset) => {
  const fields = {
    id,
    name: clean(asset.name),
    description: clean(asset.description),
    category: clean(asset.category),
    tags: (asset.tags || []).map(clean).join(' '),
    attributes: flattenAttributes(asset.attributes),
  };
  const weighted = [
    [fields.id, 18],
    [fields.name, 18],
    [fields.tags, 12],
    [fields.category, 8],
    [fields.description, 6],
    [fields.attributes, 6],
  ];
  let score = 0;
  const matched = new Set();
  for (const token of queryTokens) {
    for (const [field, weight] of weighted) {
      if (normalize(field).includes(token)) {
        score += weight;
        matched.add(token);
      }
    }
  }
  score += Math.min(18, Math.log10(1 + Number(asset.download_count || 0)) * 3.5);
  if (Number(asset.type) === 2 && Number(asset.polycount) > 0) {
    const polycount = Number(asset.polycount);
    if (polycount <= 150000) score += 8;
    else if (polycount <= 400000) score += 4;
    else score -= 4;
  }
  return {score: Number(score.toFixed(3)), matchedQueryTokens: [...matched]};
};

const cacheDir = path.resolve('out', 'asset-scout', 'cache', 'polyhaven');
const cachePath = path.join(cacheDir, 'assets.json');
const cacheMaxAgeMs = 6 * 60 * 60 * 1000;
await mkdir(cacheDir, {recursive: true});

let payload;
let fromCache = false;
if (existsSync(cachePath)) {
  const info = await stat(cachePath);
  if (Date.now() - info.mtimeMs < cacheMaxAgeMs) {
    payload = JSON.parse(await readFile(cachePath, 'utf8'))?.payload;
    fromCache = Boolean(payload);
  }
}

if (!payload) {
  const response = await fetch('https://api.polyhaven.com/assets', {
    headers: {'User-Agent': 'ki-channel-polyhaven-discovery/1.0'},
  });
  if (!response.ok) {
    console.error(`POLY HAVEN ASSET SCOUT FAILED: ${response.status} ${response.statusText}`);
    process.exit(1);
  }
  payload = await response.json();
  await writeFile(cachePath, `${JSON.stringify({cachedAt: new Date().toISOString(), payload}, null, 2)}\n`, 'utf8');
}

const candidates = Object.entries(payload || {})
  .filter(([, asset]) => type === 'all' || Number(asset?.type) === typeMap[type])
  .map(([id, asset]) => {
    const scored = scoreAsset(id, asset || {});
    return {
      id,
      mediaType: Number(asset?.type) === 0 ? 'hdri' : Number(asset?.type) === 1 ? 'texture' : 'model',
      score: scored.score,
      matchedQueryTokens: scored.matchedQueryTokens,
      name: clean(asset?.name),
      description: clean(asset?.description),
      category: clean(asset?.category),
      tags: (asset?.tags || []).map(clean),
      authors: asset?.authors || {},
      thumbnailUrl: asset?.thumbnail_url || null,
      maxResolution: asset?.max_resolution || null,
      dimensions: asset?.dimensions || null,
      polycount: Number(asset?.polycount || 0) || null,
      lods: Boolean(asset?.lods),
      downloads: Number(asset?.download_count || 0),
      filesHash: asset?.files_hash || null,
      sourceUrl: `https://polyhaven.com/a/${id}`,
      filesApiUrl: `https://api.polyhaven.com/files/${id}`,
    };
  })
  .filter((candidate) => candidate.matchedQueryTokens.length > 0)
  .sort((a, b) => b.score - a.score || b.downloads - a.downloads || a.id.localeCompare(b.id))
  .slice(0, top);

const result = {
  version: 1,
  status: 'DISCOVERY_ONLY_NOT_PRODUCTION_APPROVED',
  provider: 'POLY_HAVEN',
  query,
  requested: {type, top},
  retrievedAt: new Date().toISOString(),
  apiEndpoint: 'https://api.polyhaven.com/assets',
  cache: {ttlHours: 6, fromCache, cacheFile: path.relative(process.cwd(), cachePath).split(path.sep).join('/')},
  license: {
    name: 'CC0',
    url: 'https://polyhaven.com/license',
    apiInfoUrl: 'https://polyhaven.com/our-api',
    commercialUseAllowed: true,
    attributionRequired: false,
    provenanceGuidance: 'Keep Poly Haven asset id, source URL, authors and CC0 metadata with any selected production asset.',
  },
  safety: {
    downloadsPerformed: false,
    productionManifestModified: false,
    renderSourceModified: false,
    requiresExplicitSelectionBeforeDownload: true,
    requiresLocalFileAndSha256BeforeProductionRender: true,
    remoteMediaDuringRenderAllowed: false,
    apiIsOptionalBestEffortDependency: true,
  },
  candidates,
};

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.resolve('out', 'asset-scout', 'polyhaven');
await mkdir(outDir, {recursive: true});
const outPath = path.join(outDir, `${stamp}_${type}_${safeSlug(query)}.json`);
await writeFile(outPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');

console.log(`POLY HAVEN ASSET SCOUT: OK — DISCOVERY ONLY${fromCache ? ' — CACHE HIT' : ''}`);
console.log(`query: ${query}`);
console.log(`type: ${type}`);
console.log(`candidates: ${candidates.length}`);
console.log(`output: ${path.relative(process.cwd(), outPath)}`);
for (const [index, candidate] of candidates.entries()) {
  const extra = candidate.mediaType === 'model' && candidate.polycount ? ` | ${candidate.polycount} tris/poly` : '';
  console.log(`${index + 1}. ${candidate.mediaType} ${candidate.id} | score ${candidate.score}${extra} | ${candidate.sourceUrl}`);
}
console.log('No Poly Haven asset was downloaded or added to production source.');
