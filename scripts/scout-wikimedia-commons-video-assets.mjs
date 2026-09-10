#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {mkdir, readFile, stat, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const query = args.find((arg) => !arg.startsWith('--'))?.trim();
const option = (name, fallback) => {
  const prefix = `--${name}=`;
  const found = args.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
};
if (!query) {
  console.error('Usage: node scripts/scout-wikimedia-commons-video-assets.mjs "search query" [--orientation=landscape|portrait|auto] [--limit=30] [--top=6]');
  process.exit(1);
}

const orientation = option('orientation','landscape').toLowerCase();
const limit = Math.min(50, Math.max(10, Number(option('limit','30')) || 30));
const top = Math.min(limit, Math.max(1, Number(option('top','6')) || 6));
if (!['landscape','portrait','auto'].includes(orientation)) throw new Error(`Unsupported orientation ${orientation}`);

const api = 'https://commons.wikimedia.org/w/api.php';
const acceptedMimes = new Set(['video/webm']);
const acceptedRights = new Set(['CC0-1.0','PUBLIC_DOMAIN','CC-BY-4.0']);
const clean = (value) => String(value || '')
  .replace(/<[^>]*>/g,' ')
  .replace(/&nbsp;/gi,' ')
  .replace(/&amp;/gi,'&')
  .replace(/&quot;/gi,'"')
  .replace(/&#39;/gi,"'")
  .replace(/\s+/g,' ')
  .trim();
const tokens = (value) => [...new Set((clean(value).toLowerCase().normalize('NFKD').match(/[a-z0-9]+/g) || []).filter((token) => token.length >= 3))];
const queryTokens = tokens(query);
const safeSlug = (value) => clean(value).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,70) || 'search';
const rightsMap = (raw) => {
  const value = clean(raw).toLowerCase();
  if (value.includes('cc0') || value.includes('creative commons zero')) return 'CC0-1.0';
  if (value.includes('public domain')) return 'PUBLIC_DOMAIN';
  if (value.includes('cc by 4.0') || value.includes('attribution 4.0')) return 'CC-BY-4.0';
  return null;
};
const orientationScore = (width,height) => {
  const ratio = Number(width) / Math.max(1, Number(height));
  if (orientation === 'auto') return ratio >= 0.5 && ratio <= 2.4 ? 15 : 0;
  const target = orientation === 'landscape' ? 16/9 : 9/16;
  const distance = Math.abs(Math.log(Math.max(0.001, ratio) / target));
  return Math.max(-15, 28 - distance * 35);
};
const resolutionScore = (width,height) => {
  const longEdge = Math.max(Number(width),Number(height));
  const shortEdge = Math.min(Number(width),Number(height));
  return Math.min(25,longEdge/120) + Math.min(15,shortEdge/120);
};

const params = new URLSearchParams({
  action:'query',
  generator:'search',
  gsrsearch:query,
  gsrnamespace:'6',
  gsrlimit:String(limit),
  prop:'imageinfo',
  iiprop:'url|size|mime|extmetadata',
  format:'json',
  origin:'*',
});
const requestIdentity = `${api}?${params.toString()}`;
const cacheKey = createHash('sha256').update(requestIdentity).digest('hex');
const cacheDir = path.resolve('out','asset-scout','cache','wikimedia-commons-video');
const cachePath = path.join(cacheDir,`${cacheKey}.json`);
const cacheMaxAgeMs = 6 * 60 * 60 * 1000;
await mkdir(cacheDir,{recursive:true});

let payload;
let fromCache = false;
if (existsSync(cachePath)) {
  const cacheStat = await stat(cachePath);
  if (Date.now() - cacheStat.mtimeMs < cacheMaxAgeMs) {
    payload = JSON.parse(await readFile(cachePath,'utf8')).payload;
    fromCache = true;
  }
}
if (!payload) {
  const response = await fetch(requestIdentity,{headers:{'User-Agent':'ki-channel-wikimedia-video-discovery/1.0'}});
  if (!response.ok) {
    console.error(`WIKIMEDIA VIDEO SCOUT FAILED: ${response.status} ${response.statusText}`);
    process.exit(1);
  }
  payload = await response.json();
  await writeFile(cachePath,`${JSON.stringify({cachedAt:new Date().toISOString(),requestIdentity,payload},null,2)}\n`,'utf8');
}

const pages = Object.values(payload?.query?.pages || {}).sort((a,b)=>Number(a?.index ?? 9999)-Number(b?.index ?? 9999));
const candidates = [];
for (const page of pages) {
  const info = page?.imageinfo?.[0];
  const metadata = info?.extmetadata || {};
  const mime = String(info?.mime || '').toLowerCase();
  if (!acceptedMimes.has(mime)) continue;
  const rightsStatus = rightsMap(metadata?.LicenseShortName?.value || metadata?.UsageTerms?.value);
  if (!rightsStatus || !acceptedRights.has(rightsStatus)) continue;
  const width = Number(info?.width || 0);
  const height = Number(info?.height || 0);
  if (width < 640 || height < 360) continue;
  const title = clean(page?.title || '');
  const description = clean(metadata?.ImageDescription?.value || metadata?.ObjectName?.value || '');
  const categories = clean(metadata?.Categories?.value || '');
  const artist = clean(metadata?.Artist?.value || '');
  const credit = clean(metadata?.Credit?.value || '');
  const attribution = clean(metadata?.Attribution?.value || '') || credit || artist;
  const corpus = `${title} ${description} ${categories}`.toLowerCase();
  const relevance = Math.min(42, queryTokens.filter((token)=>corpus.includes(token)).length * 8);
  const rank = Math.max(0, 15 - Number(page?.index ?? 15));
  const rightsBonus = rightsStatus === 'CC0-1.0' || rightsStatus === 'PUBLIC_DOMAIN' ? 18 : 7;
  const score = relevance + rank + rightsBonus + orientationScore(width,height) + resolutionScore(width,height);
  candidates.push({
    id:String(page?.pageid ?? title),
    pageId:page?.pageid,
    mediaType:'video',
    title,
    score:Number(score.toFixed(3)),
    sourceUrl:`https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g,'_'))}`,
    originalUrl:info?.url || null,
    mime,
    width,
    height,
    bytes:Number(info?.size || 0),
    description,
    categories,
    artist:artist || null,
    credit:credit || null,
    attribution:attribution || null,
    rightsStatus,
    licenseShortName:clean(metadata?.LicenseShortName?.value || '') || null,
    licenseUrl:metadata?.LicenseUrl?.value || null,
    usageTerms:clean(metadata?.UsageTerms?.value || '') || null,
    attributionRequired:rightsStatus === 'CC-BY-4.0',
    nonCopyrightRestrictionsReviewRequired:true,
  });
}

candidates.sort((a,b)=>b.score-a.score || a.title.localeCompare(b.title));
const selected = candidates.slice(0,top);
const result = {
  version:1,
  status:'DISCOVERY_ONLY_NOT_PRODUCTION_APPROVED',
  provider:'WIKIMEDIA_COMMONS',
  mediaType:'video',
  query,
  requested:{orientation,limit,top},
  retrievedAt:new Date().toISOString(),
  apiEndpoint:api,
  cache:{ttlHours:6,fromCache,cacheFile:path.relative(process.cwd(),cachePath).split(path.sep).join('/')},
  acceptedRights:[...acceptedRights],
  license:{name:'Wikimedia per-file license',url:'https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia'},
  safety:{
    downloadsPerformed:false,
    productionManifestModified:false,
    renderSourceModified:false,
    remoteMediaDuringRenderAllowed:false,
    requiresExplicitSelectionBeforeDownload:true,
    requiresLocalFileAndSha256BeforeProductionRender:true,
    personalityPrivacyTrademarkReviewRequiredWhereRelevant:true,
  },
  candidates:selected,
};

const outDir = path.resolve('out','asset-scout','wikimedia-commons-video');
await mkdir(outDir,{recursive:true});
const stamp = new Date().toISOString().replace(/[:.]/g,'-');
const outPath = path.join(outDir,`${stamp}_${safeSlug(query)}.json`);
await writeFile(outPath,`${JSON.stringify(result,null,2)}\n`,'utf8');

console.log(`WIKIMEDIA VIDEO SCOUT: OK — DISCOVERY ONLY${fromCache ? ' — CACHE HIT' : ''}`);
console.log(`query: ${query}`);
console.log(`candidates: ${selected.length}`);
console.log(`output: ${path.relative(process.cwd(),outPath)}`);
for (const [index,candidate] of selected.entries()) {
  console.log(`${index+1}. ${candidate.rightsStatus} | ${candidate.width}x${candidate.height} | score ${candidate.score} | ${candidate.title}`);
}
console.log('No video was downloaded and no MEDIA-PLAN was modified.');
