#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {createReadStream, existsSync, statSync} from 'node:fs';
import {copyFile, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const packageArg = args.find((arg) => !arg.startsWith('--'));
const option = (name, fallback = null) => {
  const prefix = `--${name}=`;
  const found = args.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
};
const flag = (name) => args.includes(`--${name}`);
const fail = (message) => { console.error(`LONGFORM MEDIA MATERIALIZATION FAILED: ${message}`); process.exit(1); };
const posix = (value) => value.split(path.sep).join('/');
const normalizeUrl = (value) => String(value || '').trim().replace(/\/$/, '');
const safeId = (value) => String(value || '').replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100);
const inside = (parent, child) => child === parent || child.startsWith(`${parent}${path.sep}`);

if (!packageArg) fail('Usage: node scripts/materialize-longform-media.mjs <package> --asset-id=<id> (--scout=<json> --candidate-id=<id> | --local-input=<file>) [--start=0] [--duration=6] [--fit=cover|contain] [--allow-upscale]');
const root = path.resolve(packageArg);
if (!existsSync(root) || !statSync(root).isDirectory()) fail(`package missing: ${root}`);
const assetId = String(option('asset-id', '') || '').trim();
if (!assetId) fail('--asset-id is required.');
const scoutArg = option('scout');
const candidateId = option('candidate-id');
const localInputArg = option('local-input');
if (Boolean(scoutArg) === Boolean(localInputArg)) fail('choose exactly one input mode: --scout + --candidate-id OR --local-input.');
if (scoutArg && !candidateId) fail('--candidate-id is required with --scout.');

const mediaPlanPath = path.join(root, '02-visuals', 'MEDIA-PLAN.json');
if (!existsSync(mediaPlanPath)) fail('02-visuals/MEDIA-PLAN.json missing.');
let mediaPlan;
try { mediaPlan = JSON.parse(await readFile(mediaPlanPath, 'utf8')); }
catch (error) { fail(`invalid MEDIA-PLAN.json: ${error.message}`); }
if (!Array.isArray(mediaPlan.assets)) fail('MEDIA-PLAN.assets must be an array.');
const asset = mediaPlan.assets.find((entry) => String(entry.assetId) === assetId);
if (!asset) fail(`assetId not found in MEDIA-PLAN: ${assetId}`);
if (asset.sourceType === 'GENERATED_NON_EVIDENTIARY' && asset.provesRealWorldClaim === true) fail('generated non-evidentiary media may not prove a real-world claim.');
if (asset.status === 'APPROVED') fail('asset is already APPROVED; do not silently replace an approved SHA. Revert approval intentionally first.');

const providerRules = {
  PEXELS: {hosts: ['pexels.com'], licenseName: 'Pexels License'},
  PIXABAY: {hosts: ['pixabay.com'], licenseName: 'Pixabay Content License'},
  WIKIMEDIA_COMMONS: {hosts: ['wikimedia.org'], licenseName: 'Wikimedia per-file license'},
};
const hostAllowed = (hostname, provider) => {
  const suffixes = providerRules[provider]?.hosts || [];
  const host = String(hostname || '').toLowerCase();
  return suffixes.some((suffix) => host === suffix || host.endsWith(`.${suffix}`));
};
const extFromType = (contentType, fallbackUrl) => {
  const type = String(contentType || '').split(';')[0].trim().toLowerCase();
  if (type === 'video/mp4') return '.mp4';
  if (type === 'video/webm') return '.webm';
  if (type === 'image/jpeg') return '.jpg';
  if (type === 'image/png') return '.png';
  if (type === 'image/webp') return '.webp';
  const ext = path.extname(new URL(fallbackUrl).pathname).toLowerCase();
  if (['.mp4','.webm','.jpg','.jpeg','.png','.webp'].includes(ext)) return ext === '.jpeg' ? '.jpg' : ext;
  return null;
};
const sha256File = (file) => new Promise((resolveHash, reject) => {
  const hash = createHash('sha256');
  const stream = createReadStream(file);
  stream.on('data', (chunk) => hash.update(chunk));
  stream.on('end', () => resolveHash(hash.digest('hex')));
  stream.on('error', reject);
});
const runNode = (script, commandArgs) => {
  const result = spawnSync(process.execPath, [script, ...commandArgs], {encoding:'utf8', maxBuffer:32 * 1024 * 1024});
  if (result.error) fail(`${script} could not start: ${result.error.message}`);
  if (result.status !== 0) fail(`${script} failed:\n${result.stderr || result.stdout}`);
  return `${result.stdout || ''}\n${result.stderr || ''}`;
};
const parseManifestPath = (output) => {
  const match = String(output).match(/^manifest:\s*(.+)$/mi);
  if (!match) fail('asset prep did not report a manifest path.');
  const resolved = path.resolve(match[1].trim());
  if (!existsSync(resolved)) fail(`prep manifest missing: ${resolved}`);
  return resolved;
};

let provenance = {
  version: 1,
  assetId,
  sourceType: asset.sourceType || null,
  sourceUrl: asset.sourceUrl || null,
  materializedAt: new Date().toISOString(),
  rightsVerified: false,
  note: 'Materialization/provenance only. Production rights approval is a separate step.',
};
let rawInput;
let detectedMediaType = String(asset.mediaType || '').toUpperCase();

const provenanceDir = path.join(root, '06-projektdateien', 'media-provenance');
const incomingDir = path.join(root, '02-visuals', '.incoming');
await mkdir(provenanceDir, {recursive:true});
await mkdir(incomingDir, {recursive:true});
const provenancePath = path.join(provenanceDir, `${safeId(assetId)}.json`);

if (scoutArg) {
  const scoutPath = path.resolve(scoutArg);
  if (!existsSync(scoutPath) || !statSync(scoutPath).isFile()) fail(`scout JSON missing: ${scoutPath}`);
  let scout;
  try { scout = JSON.parse(await readFile(scoutPath, 'utf8')); }
  catch (error) { fail(`invalid scout JSON: ${error.message}`); }
  const provider = String(scout.provider || '').toUpperCase();
  if (!providerRules[provider]) fail(`unsupported scout provider for production bridge: ${provider || 'missing'}. Supported: ${Object.keys(providerRules).join(', ')}`);
  if (scout.status !== 'DISCOVERY_ONLY_NOT_PRODUCTION_APPROVED') fail(`unexpected scout status: ${scout.status}`);
  const candidates = Array.isArray(scout.candidates) ? scout.candidates : [];
  const candidate = candidates.find((entry) => String(entry.id ?? entry.pageId ?? entry.title) === String(candidateId));
  if (!candidate) fail(`candidate ${candidateId} not found in scout JSON.`);
  const sourceUrl = String(candidate.sourceUrl || '').trim();
  if (!/^https:\/\//i.test(sourceUrl)) fail('selected candidate requires an https sourceUrl.');
  if (asset.sourceUrl && normalizeUrl(asset.sourceUrl) !== normalizeUrl(sourceUrl)) {
    fail(`MEDIA-PLAN sourceUrl does not match selected scout candidate. plan=${asset.sourceUrl} candidate=${sourceUrl}`);
  }
  const downloadUrl = provider === 'WIKIMEDIA_COMMONS'
    ? String(candidate.originalUrl || candidate.previewUrl || '').trim()
    : String(candidate.recommendedFile?.url || '').trim();
  if (!/^https:\/\//i.test(downloadUrl)) fail('selected candidate has no usable https download URL.');

  let currentUrl = new URL(downloadUrl);
  if (!hostAllowed(currentUrl.hostname, provider)) fail(`download host ${currentUrl.hostname} is not allowlisted for ${provider}.`);
  let response;
  for (let redirectCount = 0; redirectCount <= 5; redirectCount++) {
    response = await fetch(currentUrl, {redirect:'manual', headers:{'User-Agent':'ki-channel-longform-media-materializer/1.0'}});
    if ([301,302,303,307,308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location) fail('redirect response had no Location header.');
      currentUrl = new URL(location, currentUrl);
      if (currentUrl.protocol !== 'https:' || !hostAllowed(currentUrl.hostname, provider)) fail(`redirect escaped provider allowlist: ${currentUrl.href}`);
      continue;
    }
    break;
  }
  if (!response || !response.ok) fail(`download failed: ${response?.status ?? '?'} ${response?.statusText ?? ''}`);
  if (!hostAllowed(new URL(response.url || currentUrl.href).hostname, provider)) fail('final response URL escaped provider allowlist.');
  const declaredLength = Number(response.headers.get('content-length') || 0);
  const maxBytes = detectedMediaType === 'VIDEO' || candidate.mediaType === 'video' ? 300 * 1024 * 1024 : 35 * 1024 * 1024;
  if (declaredLength > maxBytes) fail(`remote asset exceeds byte limit (${declaredLength} > ${maxBytes}).`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 1024 || bytes.length > maxBytes) fail(`downloaded asset size ${bytes.length} is outside allowed range.`);
  const ext = extFromType(response.headers.get('content-type'), currentUrl.href);
  if (!ext) fail(`unsupported downloaded content-type: ${response.headers.get('content-type') || 'missing'}`);
  rawInput = path.join(incomingDir, `${safeId(assetId)}.download${ext}`);
  await writeFile(rawInput, bytes);
  const rawSha256 = createHash('sha256').update(bytes).digest('hex');

  if (!detectedMediaType) detectedMediaType = (candidate.mediaType === 'video' ? 'VIDEO' : 'IMAGE');
  provenance = {
    ...provenance,
    provider,
    scoutFile: posix(path.relative(process.cwd(), scoutPath)),
    scoutRetrievedAt: scout.retrievedAt || null,
    candidateId: String(candidateId),
    sourceUrl,
    creator: candidate.creator || candidate.artist || null,
    creatorUrl: candidate.creatorUrl || null,
    license: scout.license?.name || candidate.licenseShortName || candidate.rightsStatus || providerRules[provider].licenseName,
    licenseUrl: scout.license?.url || candidate.licenseUrl || null,
    attribution: candidate.attribution || candidate.credit || null,
    attributionRequired: candidate.attributionRequired === true,
    nonCopyrightRestrictionsReviewRequired: candidate.nonCopyrightRestrictionsReviewRequired === true || provider === 'WIKIMEDIA_COMMONS',
    selectedDownloadUrl: currentUrl.href,
    rawDownload: {sha256: rawSha256, bytes: bytes.length, contentType: response.headers.get('content-type') || null},
  };
} else {
  rawInput = path.resolve(localInputArg);
  if (!existsSync(rawInput) || !statSync(rawInput).isFile()) fail(`local input missing: ${rawInput}`);
  if (/^https?:\/\//i.test(localInputArg)) fail('--local-input must be a local file, never a URL.');
  if (!detectedMediaType) {
    const ext = path.extname(rawInput).toLowerCase();
    detectedMediaType = ['.mp4','.mov','.m4v','.webm','.mkv'].includes(ext) ? 'VIDEO' : 'IMAGE';
  }
  provenance = {
    ...provenance,
    provider: 'LOCAL_INPUT',
    localInputOriginal: posix(path.relative(process.cwd(), rawInput)),
    localInputSha256: await sha256File(rawInput),
    sourceUrl: asset.sourceUrl || null,
  };
}

if (!['VIDEO','IMAGE'].includes(detectedMediaType)) fail(`unsupported mediaType ${detectedMediaType || 'missing'}; use IMAGE or VIDEO.`);
if (asset.mediaType && String(asset.mediaType).toUpperCase() !== detectedMediaType) fail(`MEDIA-PLAN mediaType ${asset.mediaType} does not match materialized type ${detectedMediaType}.`);

await writeFile(provenancePath, `${JSON.stringify(provenance, null, 2)}\n`, 'utf8');
const fit = String(option('fit', 'cover')).toLowerCase();
if (!['cover','contain'].includes(fit)) fail('--fit must be cover or contain.');
const allowUpscale = flag('allow-upscale');
let prepOutput;
if (detectedMediaType === 'VIDEO') {
  const prepArgs = [rawInput, `--provenance=${provenancePath}`, `--fit=${fit}`, '--audio=remove', '--crf=20'];
  const start = option('start');
  const duration = option('duration');
  if (start !== null) prepArgs.push(`--start=${start}`);
  if (duration !== null) prepArgs.push(`--duration=${duration}`);
  if (allowUpscale) prepArgs.push('--allow-upscale');
  prepOutput = runNode(path.resolve('scripts','prepare-longform-video-asset.mjs'), prepArgs);
} else {
  const prepArgs = [rawInput, `--provenance=${provenancePath}`, '--width=1920', '--height=1080', `--fit=${fit}`, '--position=attention', '--format=webp', '--quality=90'];
  if (allowUpscale) prepArgs.push('--allow-upscale');
  prepOutput = runNode(path.resolve('scripts','prepare-local-image-asset.mjs'), prepArgs);
}
const prepManifestPath = parseManifestPath(prepOutput);
const prepManifest = JSON.parse(await readFile(prepManifestPath, 'utf8'));
const preparedSource = path.resolve(prepManifest.output?.file || '');
if (!existsSync(preparedSource) || !statSync(preparedSource).isFile()) fail('prepared output file missing after asset prep.');

const targetDir = path.join(root, '02-visuals', detectedMediaType === 'VIDEO' ? 'broll' : 'images');
await mkdir(targetDir, {recursive:true});
const targetExt = detectedMediaType === 'VIDEO' ? '.mp4' : '.webp';
const target = path.join(targetDir, `${safeId(assetId)}${targetExt}`);
await copyFile(preparedSource, target);
const finalSha256 = await sha256File(target);
if (prepManifest.output?.sha256 && String(prepManifest.output.sha256).toLowerCase() !== finalSha256.toLowerCase()) fail('copied production derivative SHA differs from prep manifest.');

asset.localFile = posix(path.relative(root, target));
asset.sha256 = finalSha256;
asset.rightsVerified = false;
asset.status = 'MATERIALIZED_PENDING_REVIEW';
asset.materialization = {
  at: new Date().toISOString(),
  provenanceFile: posix(path.relative(root, provenancePath)),
  prepManifest: posix(path.relative(process.cwd(), prepManifestPath)),
  sourceMode: scoutArg ? 'SCOUT_CANDIDATE' : 'LOCAL_INPUT',
  exactFileSha256: finalSha256,
};
if (scoutArg) {
  asset.sourceProvider = provenance.provider;
  asset.creator = asset.creator || provenance.creator || null;
  asset.license = asset.license || provenance.license || null;
  asset.licenseUrl = asset.licenseUrl || provenance.licenseUrl || null;
}
const requiredAssets = mediaPlan.assets.filter((entry) => entry.requiredForRender !== false);
mediaPlan.status = requiredAssets.every((entry) => entry.status === 'APPROVED') ? 'READY_FOR_RENDER' : 'MATERIALIZATION_IN_PROGRESS';
await writeFile(mediaPlanPath, `${JSON.stringify(mediaPlan, null, 2)}\n`, 'utf8');

if (scoutArg && rawInput && inside(incomingDir, rawInput)) await rm(rawInput, {force:true});

console.log('LONGFORM MEDIA MATERIALIZATION: PASSED');
console.log(`asset: ${assetId}`);
console.log(`mediaType: ${detectedMediaType}`);
console.log(`localFile: ${asset.localFile}`);
console.log(`sha256: ${finalSha256}`);
console.log('status: MATERIALIZED_PENDING_REVIEW');
console.log('Next: inspect the exact local derivative, then run approve-longform-media.mjs with specific rights + visual review notes.');
