#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync, readFileSync} from 'node:fs';
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
  console.error('Usage: node scripts/scout-pixabay-assets.mjs "search query" [--type=video|photo] [--orientation=portrait|landscape|square|all] [--lang=en|de] [--per-page=20] [--top=6]');
  process.exit(1);
}

const loadSimpleEnv = (file) => {
  if (!existsSync(file)) return;
  for (const rawLine of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const index = line.indexOf('=');
    if (index <= 0) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
};

loadSimpleEnv(path.resolve('.env.local'));
loadSimpleEnv(path.resolve('.env'));

const apiKey = process.env.PIXABAY_API_KEY;
if (!apiKey) {
  console.error('PIXABAY ASSET SCOUT: PIXABAY_API_KEY fehlt.');
  console.error('Kostenlosen Pixabay API-Key erstellen und nur lokal in .env.local speichern:');
  console.error('PIXABAY_API_KEY=dein_key');
  console.error('Die Datei .env.local ist durch .gitignore geschützt und darf nie committed werden.');
  process.exit(2);
}

const type = option('type', 'video').toLowerCase();
const orientation = option('orientation', 'portrait').toLowerCase();
const lang = option('lang', 'en').toLowerCase();
const perPage = Math.min(40, Math.max(3, Number(option('per-page', '20')) || 20));
const top = Math.min(perPage, Math.max(1, Number(option('top', '6')) || 6));

if (!['video', 'photo'].includes(type)) throw new Error(`Unsupported --type=${type}`);
if (!['portrait', 'landscape', 'square', 'all'].includes(orientation)) throw new Error(`Unsupported --orientation=${orientation}`);
if (!['de', 'en'].includes(lang)) throw new Error(`Unsupported --lang=${lang}. Keep the scout focused on de/en search terms.`);
if (query.length > 100) throw new Error('Pixabay query may not exceed 100 characters.');

const targetRatio = orientation === 'portrait' ? 9 / 16 : orientation === 'landscape' ? 16 / 9 : orientation === 'square' ? 1 : null;
const orientationScore = (width, height) => {
  if (!targetRatio) return 20;
  const ratio = Number(width) / Math.max(1, Number(height));
  const distance = Math.abs(Math.log(Math.max(0.001, ratio) / targetRatio));
  return Math.max(0, 50 - distance * 42);
};
const resolutionScore = (width, height) => Math.min(30, Math.max(0, Math.min(Number(width), Number(height)) / 36));
const clean = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const tokens = (value) => [...new Set(clean(value).toLowerCase().normalize('NFKD').match(/[a-z0-9]+/g) || [])].filter((token) => token.length >= 3);
const safeSlug = (value) => clean(value).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70) || 'search';
const queryTokens = tokens(query);
const relevanceScore = (tags) => {
  const corpus = clean(tags).toLowerCase();
  const matches = queryTokens.filter((token) => corpus.includes(token));
  return {score: Math.min(28, matches.length * 7), matches};
};
const popularityScore = (hit) => {
  const likes = Math.log10(1 + Number(hit?.likes || 0)) * 4;
  const views = Math.log10(1 + Number(hit?.views || 0)) * 2;
  return Math.min(16, likes + views);
};
const profileUrl = (user, userId) => user && userId ? `https://pixabay.com/users/${encodeURIComponent(user)}-${userId}/` : null;

const params = new URLSearchParams({
  q: query,
  lang,
  per_page: String(perPage),
  safesearch: 'true',
  order: 'popular',
});
if (type === 'photo') {
  params.set('image_type', 'photo');
  params.set('orientation', orientation === 'portrait' ? 'vertical' : orientation === 'landscape' ? 'horizontal' : 'all');
}

const endpointBase = type === 'video' ? 'https://pixabay.com/api/videos/' : 'https://pixabay.com/api/';
const requestIdentity = `${endpointBase}?${params.toString()}`;
const cacheKey = createHash('sha256').update(requestIdentity).digest('hex');
const cacheDir = path.resolve('out', 'asset-scout', 'cache', 'pixabay');
const cachePath = path.join(cacheDir, `${cacheKey}.json`);
const cacheMaxAgeMs = 24 * 60 * 60 * 1000;
await mkdir(cacheDir, {recursive: true});

let payload;
let fromCache = false;
let rateLimit = {limit: null, remaining: null, reset: null};
if (existsSync(cachePath)) {
  const cacheStat = await stat(cachePath);
  if (Date.now() - cacheStat.mtimeMs < cacheMaxAgeMs) {
    const cached = JSON.parse(await readFile(cachePath, 'utf8'));
    payload = cached.payload;
    fromCache = true;
  }
}

if (!payload) {
  const requestUrl = new URL(endpointBase);
  requestUrl.search = params.toString();
  requestUrl.searchParams.set('key', apiKey);
  const response = await fetch(requestUrl, {headers: {'User-Agent': 'ki-channel-pixabay-discovery/1.0'}});
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    console.error(`PIXABAY ASSET SCOUT FAILED: ${response.status} ${response.statusText}`);
    if (body) console.error(body.slice(0, 500));
    process.exit(1);
  }
  payload = await response.json();
  rateLimit = {
    limit: response.headers.get('x-ratelimit-limit'),
    remaining: response.headers.get('x-ratelimit-remaining'),
    reset: response.headers.get('x-ratelimit-reset'),
  };
  await writeFile(cachePath, `${JSON.stringify({cachedAt: new Date().toISOString(), requestIdentity, payload}, null, 2)}\n`, 'utf8');
}

const chooseVideoFile = (videos = {}) => {
  const candidates = Object.entries(videos)
    .map(([quality, file]) => ({quality, ...file}))
    .filter((file) => file?.url && Number(file?.width) > 0 && Number(file?.height) > 0)
    .map((file) => ({
      ...file,
      score: Number((orientationScore(file.width, file.height) + resolutionScore(file.width, file.height) + (file.quality === 'medium' ? 5 : file.quality === 'large' ? 7 : 0)).toFixed(3)),
    }))
    .sort((a, b) => b.score - a.score || Number(b.width) * Number(b.height) - Number(a.width) * Number(a.height));
  return candidates[0] || null;
};

const candidates = (payload?.hits || []).map((hit) => {
  const relevance = relevanceScore(hit.tags);
  if (type === 'video') {
    const bestFile = chooseVideoFile(hit.videos);
    const totalScore = orientationScore(bestFile?.width || 1, bestFile?.height || 1) + resolutionScore(bestFile?.width || 0, bestFile?.height || 0) + relevance.score + popularityScore(hit);
    return {
      id: String(hit.id),
      mediaType: 'video',
      score: Number(totalScore.toFixed(3)),
      sourceUrl: hit.pageURL,
      creator: clean(hit.user),
      creatorUrl: profileUrl(hit.user, hit.user_id),
      tags: clean(hit.tags),
      matchedQueryTokens: relevance.matches,
      durationSeconds: Number(hit.duration || 0),
      likes: Number(hit.likes || 0),
      views: Number(hit.views || 0),
      recommendedFile: bestFile ? {
        url: bestFile.url,
        fileType: 'video/mp4',
        quality: bestFile.quality,
        width: Number(bestFile.width || 0),
        height: Number(bestFile.height || 0),
        bytes: Number(bestFile.size || 0),
        thumbnail: bestFile.thumbnail || null,
      } : null,
    };
  }

  const width = Number(hit.imageWidth || hit.webformatWidth || 0);
  const height = Number(hit.imageHeight || hit.webformatHeight || 0);
  const totalScore = orientationScore(width, height) + resolutionScore(width, height) + relevance.score + popularityScore(hit);
  return {
    id: String(hit.id),
    mediaType: 'photo',
    score: Number(totalScore.toFixed(3)),
    sourceUrl: hit.pageURL,
    creator: clean(hit.user),
    creatorUrl: profileUrl(hit.user, hit.user_id),
    tags: clean(hit.tags),
    matchedQueryTokens: relevance.matches,
    likes: Number(hit.likes || 0),
    views: Number(hit.views || 0),
    sourceWidth: width,
    sourceHeight: height,
    recommendedFile: {
      url: hit.largeImageURL || hit.webformatURL || null,
      fileType: 'image/jpeg',
      width: hit.largeImageURL ? Math.min(width, 1280) : Number(hit.webformatWidth || 0),
      height: hit.largeImageURL ? Math.min(height, 1280) : Number(hit.webformatHeight || 0),
      note: 'Discovery URL only. Re-resolve selected asset before local production download; do not hotlink in Remotion.',
    },
  };
});

candidates.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
const selected = candidates.slice(0, top);

const result = {
  version: 1,
  status: 'DISCOVERY_ONLY_NOT_PRODUCTION_APPROVED',
  provider: 'PIXABAY',
  query,
  requested: {type, orientation, lang, perPage, top},
  retrievedAt: new Date().toISOString(),
  apiEndpoint: endpointBase,
  cache: {
    requiredByProvider: true,
    ttlHours: 24,
    fromCache,
    cacheFile: path.relative(process.cwd(), cachePath).split(path.sep).join('/'),
  },
  rateLimit,
  license: {
    name: 'Pixabay Content License',
    url: 'https://pixabay.com/service/license-summary/',
    apiGuidelinesUrl: 'https://pixabay.com/api/docs/',
    searchResultCredit: 'When API search results are displayed, identify Pixabay as the source. Keep creator/source metadata with selected production assets.',
  },
  safety: {
    downloadsPerformed: false,
    productionManifestModified: false,
    renderSourceModified: false,
    systematicMassDownloadsAllowed: false,
    requiresExplicitSelectionBeforeDownload: true,
    requiresLocalFileAndSha256BeforeProductionRender: true,
    remoteMediaDuringRenderAllowed: false,
  },
  candidates: selected,
};

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.resolve('out', 'asset-scout', 'pixabay');
await mkdir(outDir, {recursive: true});
const outPath = path.join(outDir, `${stamp}_${type}_${safeSlug(query)}.json`);
await writeFile(outPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');

console.log(`PIXABAY ASSET SCOUT: OK — DISCOVERY ONLY${fromCache ? ' — 24H CACHE HIT' : ''}`);
console.log(`query: ${query}`);
console.log(`type: ${type}, orientation target: ${orientation}`);
console.log(`candidates: ${selected.length}`);
console.log(`output: ${path.relative(process.cwd(), outPath)}`);
if (!fromCache && rateLimit.remaining) console.log(`Pixabay requests remaining: ${rateLimit.remaining}/${rateLimit.limit || '?'}`);
for (const [index, candidate] of selected.entries()) {
  const dims = candidate.recommendedFile?.width && candidate.recommendedFile?.height ? `${candidate.recommendedFile.width}x${candidate.recommendedFile.height}` : 'unknown';
  console.log(`${index + 1}. ${candidate.mediaType} ${candidate.id} | score ${candidate.score} | ${dims} | ${candidate.creator || 'unknown creator'} | ${candidate.sourceUrl}`);
}
console.log('No asset was downloaded or added to the production manifest.');
