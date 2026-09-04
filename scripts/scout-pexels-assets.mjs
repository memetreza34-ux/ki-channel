#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {mkdir, writeFile} from 'node:fs/promises';
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
  console.error('Usage: node scripts/scout-pexels-assets.mjs "search query" [--type=video|photo] [--orientation=portrait|landscape|square] [--size=medium] [--locale=de-DE] [--per-page=12] [--top=6]');
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

const apiKey = process.env.PEXELS_API_KEY;
if (!apiKey) {
  console.error('PEXELS ASSET SCOUT: PEXELS_API_KEY fehlt.');
  console.error('Kostenlosen Pexels API-Key erstellen und nur lokal in .env.local speichern:');
  console.error('PEXELS_API_KEY=dein_key');
  console.error('Die Datei .env.local ist durch .gitignore geschützt und darf nie committed werden.');
  process.exit(2);
}

const type = option('type', 'video').toLowerCase();
const orientation = option('orientation', 'portrait').toLowerCase();
const size = option('size', 'medium').toLowerCase();
const locale = option('locale', 'de-DE');
const perPage = Math.min(40, Math.max(1, Number(option('per-page', '12')) || 12));
const top = Math.min(perPage, Math.max(1, Number(option('top', '6')) || 6));

if (!['video', 'photo'].includes(type)) throw new Error(`Unsupported --type=${type}`);
if (!['portrait', 'landscape', 'square'].includes(orientation)) throw new Error(`Unsupported --orientation=${orientation}`);
if (!['large', 'medium', 'small'].includes(size)) throw new Error(`Unsupported --size=${size}`);

const targetRatio = orientation === 'portrait' ? 9 / 16 : orientation === 'landscape' ? 16 / 9 : 1;
const orientationScore = (width, height) => {
  const ratio = Number(width) / Math.max(1, Number(height));
  const distance = Math.abs(Math.log(Math.max(0.001, ratio) / targetRatio));
  return Math.max(0, 50 - distance * 42);
};
const resolutionScore = (width, height) => Math.min(35, Math.max(0, Math.min(Number(width), Number(height)) / 32));
const clean = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const safeSlug = (value) => clean(value).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70) || 'search';

const headers = {
  Authorization: apiKey,
  'User-Agent': 'ki-channel-pexels-discovery/1.0',
};

const params = new URLSearchParams({
  query,
  orientation,
  locale,
  per_page: String(perPage),
});
if (type === 'video') params.set('size', size);
const endpoint = type === 'video'
  ? `https://api.pexels.com/v1/videos/search?${params}`
  : `https://api.pexels.com/v1/search?${params}`;

const response = await fetch(endpoint, {headers});
if (!response.ok) {
  const body = await response.text().catch(() => '');
  console.error(`PEXELS ASSET SCOUT FAILED: ${response.status} ${response.statusText}`);
  if (body) console.error(body.slice(0, 500));
  process.exit(1);
}

const payload = await response.json();
const rateLimit = {
  limit: response.headers.get('x-ratelimit-limit'),
  remaining: response.headers.get('x-ratelimit-remaining'),
  reset: response.headers.get('x-ratelimit-reset'),
};

const chooseVideoFile = (files = []) => {
  const candidates = files
    .filter((file) => String(file?.file_type || '').toLowerCase() === 'video/mp4' && file?.link)
    .map((file) => {
      const score = orientationScore(file.width, file.height) + resolutionScore(file.width, file.height) + (file.quality === 'hd' ? 8 : 0);
      return {...file, score: Number(score.toFixed(3))};
    })
    .sort((a, b) => b.score - a.score || (Number(b.height) * Number(b.width)) - (Number(a.height) * Number(a.width)));
  return candidates[0] || null;
};

const candidates = type === 'video'
  ? (payload.videos || []).map((video) => {
      const bestFile = chooseVideoFile(video.video_files);
      const score = orientationScore(video.width, video.height) + resolutionScore(bestFile?.width || video.width, bestFile?.height || video.height) + (bestFile?.quality === 'hd' ? 8 : 0);
      return {
        id: String(video.id),
        mediaType: 'video',
        score: Number(score.toFixed(3)),
        sourceUrl: video.url,
        previewImage: video.image,
        creator: clean(video.user?.name),
        creatorUrl: video.user?.url || null,
        durationSeconds: Number(video.duration || 0),
        sourceWidth: Number(video.width || 0),
        sourceHeight: Number(video.height || 0),
        recommendedFile: bestFile ? {
          url: bestFile.link,
          fileType: bestFile.file_type,
          quality: bestFile.quality,
          width: Number(bestFile.width || 0),
          height: Number(bestFile.height || 0),
          fps: Number(bestFile.fps || 0),
        } : null,
      };
    })
  : (payload.photos || []).map((photo) => {
      const score = orientationScore(photo.width, photo.height) + resolutionScore(photo.width, photo.height) + (orientation === 'portrait' && photo.src?.portrait ? 8 : 0);
      return {
        id: String(photo.id),
        mediaType: 'photo',
        score: Number(score.toFixed(3)),
        sourceUrl: photo.url,
        previewImage: photo.src?.medium || photo.src?.small || null,
        creator: clean(photo.photographer),
        creatorUrl: photo.photographer_url || null,
        alt: clean(photo.alt),
        sourceWidth: Number(photo.width || 0),
        sourceHeight: Number(photo.height || 0),
        recommendedFile: {
          url: orientation === 'portrait' ? (photo.src?.portrait || photo.src?.large2x || photo.src?.original) : orientation === 'landscape' ? (photo.src?.landscape || photo.src?.large2x || photo.src?.original) : (photo.src?.large2x || photo.src?.original),
          fileType: 'image/jpeg',
          width: orientation === 'portrait' ? 800 : null,
          height: orientation === 'portrait' ? 1200 : null,
        },
      };
    });

candidates.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
const selected = candidates.slice(0, top);

const result = {
  version: 1,
  status: 'DISCOVERY_ONLY_NOT_PRODUCTION_APPROVED',
  provider: 'PEXELS',
  query,
  requested: {type, orientation, size: type === 'video' ? size : null, locale, perPage, top},
  retrievedAt: new Date().toISOString(),
  apiEndpoint: type === 'video' ? 'https://api.pexels.com/v1/videos/search' : 'https://api.pexels.com/v1/search',
  rateLimit,
  license: {
    name: 'Pexels License',
    url: 'https://www.pexels.com/license/',
    apiGuidelinesUrl: 'https://www.pexels.com/api/documentation/',
    attributionGuidance: 'Credit Pexels and the creator when possible. Keep sourceUrl + creator metadata with any selected production asset.',
  },
  safety: {
    downloadsPerformed: false,
    productionManifestModified: false,
    renderSourceModified: false,
    requiresExplicitSelectionBeforeDownload: true,
    requiresLocalFileAndSha256BeforeProductionRender: true,
    remoteMediaDuringRenderAllowed: false,
  },
  candidates: selected,
};

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.resolve('out', 'asset-scout', 'pexels');
await mkdir(outDir, {recursive: true});
const outPath = path.join(outDir, `${stamp}_${type}_${safeSlug(query)}.json`);
await writeFile(outPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');

console.log('PEXELS ASSET SCOUT: OK — DISCOVERY ONLY');
console.log(`query: ${query}`);
console.log(`type: ${type}, orientation: ${orientation}`);
console.log(`candidates: ${selected.length}`);
console.log(`output: ${path.relative(process.cwd(), outPath)}`);
if (rateLimit.remaining) console.log(`Pexels requests remaining: ${rateLimit.remaining}/${rateLimit.limit || '?'}`);
for (const [index, candidate] of selected.entries()) {
  const dims = candidate.recommendedFile?.width && candidate.recommendedFile?.height ? `${candidate.recommendedFile.width}x${candidate.recommendedFile.height}` : `${candidate.sourceWidth}x${candidate.sourceHeight}`;
  console.log(`${index + 1}. ${candidate.mediaType} ${candidate.id} | score ${candidate.score} | ${dims} | ${candidate.creator || 'unknown creator'} | ${candidate.sourceUrl}`);
}
console.log('No asset was downloaded or added to the production manifest.');
