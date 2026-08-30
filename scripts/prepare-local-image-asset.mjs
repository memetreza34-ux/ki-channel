#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {lstat, mkdir, readFile, stat, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const args = process.argv.slice(2);
const inputArg = args.find((arg) => !arg.startsWith('--'));
const option = (name, fallback = null) => {
  const prefix = `--${name}=`;
  const found = args.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
};
const flag = (name) => args.includes(`--${name}`) || option(name, '0') === '1';

const fail = (message, code = 1) => {
  console.error(`IMAGE ASSET PREP FAILED: ${message}`);
  process.exit(code);
};

if (!inputArg) {
  fail('Usage: node scripts/prepare-local-image-asset.mjs <local.jpg|png|webp> --provenance=<path|USER_PROVIDED> [--width=1080] [--height=1920] [--fit=cover|contain] [--position=attention|entropy|centre] [--format=webp|jpeg|png] [--quality=88] [--allow-upscale]');
}
if (/^https?:\/\//i.test(inputArg)) fail('remote URLs are forbidden; prepare only an already-local approved asset.', 2);

const source = path.resolve(inputArg);
if (!existsSync(source)) fail(`input not found: ${source}`, 2);
const sourceLstat = await lstat(source);
if (!sourceLstat.isFile()) fail('input must be a regular local file.', 2);
if (sourceLstat.isSymbolicLink()) fail('symbolic-link input is not accepted.', 2);

const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const sourceExt = path.extname(source).toLowerCase();
if (!allowedExtensions.has(sourceExt)) fail('only local JPEG, PNG and WebP inputs are accepted.', 2);

const provenanceArg = String(option('provenance', '') || '').trim();
if (!provenanceArg) fail('explicit --provenance=<path|USER_PROVIDED> is required before image preparation.', 2);
let provenanceRef;
if (provenanceArg === 'USER_PROVIDED') {
  provenanceRef = 'USER_PROVIDED';
} else {
  const provenancePath = path.resolve(provenanceArg);
  if (!existsSync(provenancePath)) fail(`provenance reference not found: ${provenancePath}`, 2);
  const provenanceStat = await stat(provenancePath);
  if (!provenanceStat.isFile()) fail('provenance reference must be a file.', 2);
  provenanceRef = path.relative(process.cwd(), provenancePath).split(path.sep).join('/');
}

const sourceStat = await stat(source);
const maxInputBytes = 30 * 1024 * 1024;
if (sourceStat.size <= 0) fail('input is empty.', 2);
if (sourceStat.size > maxInputBytes) fail(`input exceeds ${maxInputBytes} byte safety limit.`, 2);

const numberOption = (name, fallback, min, max) => {
  const raw = Number(option(name, String(fallback)));
  if (!Number.isFinite(raw)) fail(`--${name} must be numeric.`, 2);
  return Math.round(Math.min(max, Math.max(min, raw)));
};
const width = numberOption('width', 1080, 64, 3840);
const height = numberOption('height', 1920, 64, 3840);
const quality = numberOption('quality', 88, 60, 100);
const fit = String(option('fit', 'cover')).toLowerCase();
if (!['cover', 'contain'].includes(fit)) fail('--fit must be cover or contain.', 2);
const positionName = String(option('position', 'attention')).toLowerCase();
const positions = {
  attention: sharp.strategy.attention,
  entropy: sharp.strategy.entropy,
  centre: 'centre',
  center: 'centre',
  north: 'north',
  south: 'south',
  east: 'east',
  west: 'west',
};
if (!(positionName in positions)) fail('--position must be attention, entropy, centre, north, south, east or west.', 2);
const format = String(option('format', 'webp')).toLowerCase();
if (!['webp', 'jpeg', 'png'].includes(format)) fail('--format must be webp, jpeg or png.', 2);
const allowUpscale = flag('allow-upscale');

const sourceBytes = await readFile(source);
const sourceSha256 = createHash('sha256').update(sourceBytes).digest('hex');
const sourceImage = sharp(source, {
  limitInputPixels: 64_000_000,
  failOn: 'error',
  sequentialRead: true,
});
const metadata = await sourceImage.metadata();
if (!metadata.width || !metadata.height) fail('input dimensions could not be read.', 2);
if ((metadata.pages ?? 1) > 1) fail('animated/multipage images are not accepted in the automatic path.', 2);
if (!['jpeg', 'png', 'webp'].includes(String(metadata.format || '').toLowerCase())) fail(`decoded input format ${metadata.format || 'unknown'} is not allowlisted.`, 2);

const orientationSwapsAxes = [5, 6, 7, 8].includes(Number(metadata.orientation || 1));
const orientedWidth = orientationSwapsAxes ? metadata.height : metadata.width;
const orientedHeight = orientationSwapsAxes ? metadata.width : metadata.height;
const coverScale = Math.max(width / orientedWidth, height / orientedHeight);
const containScale = Math.min(width / orientedWidth, height / orientedHeight);
const requiredScale = fit === 'cover' ? coverScale : containScale;
if (requiredScale > 1.0001 && !allowUpscale) {
  fail(`requested ${width}x${height} ${fit} output would upscale the source (${orientedWidth}x${orientedHeight}). Use a larger source or explicitly pass --allow-upscale for a reviewed exception.`, 2);
}

const safeName = path.basename(source, sourceExt).replace(/[^A-Za-z0-9._-]+/g, '-').slice(0, 80) || 'image';
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.resolve('out', 'asset-prep', 'images', `${stamp}_${safeName}`);
await mkdir(outDir, {recursive: true});
const extension = format === 'jpeg' ? '.jpg' : format === 'png' ? '.png' : '.webp';
const output = path.join(outDir, `${safeName}.prepared${extension}`);
const manifestPath = path.join(outDir, 'manifest.json');

let pipeline = sharp(source, {
  limitInputPixels: 64_000_000,
  failOn: 'error',
  sequentialRead: true,
})
  .rotate()
  .toColourspace('srgb')
  .resize({
    width,
    height,
    fit,
    position: positions[positionName],
    withoutEnlargement: !allowUpscale,
    background: {r: 10, g: 10, b: 12, alpha: 1},
  });

if (format === 'webp') pipeline = pipeline.webp({quality, effort: 5, smartSubsample: true});
if (format === 'jpeg') pipeline = pipeline.flatten({background: '#0a0a0c'}).jpeg({quality, mozjpeg: true, chromaSubsampling: '4:4:4'});
if (format === 'png') pipeline = pipeline.png({compressionLevel: 9, adaptiveFiltering: true});

// Sharp strips EXIF/XMP/IPTC metadata by default because withMetadata()/keepMetadata() is intentionally not called.
const outputInfo = await pipeline.toFile(output);
const outputBytes = await readFile(output);
const outputSha256 = createHash('sha256').update(outputBytes).digest('hex');
const outputMetadata = await sharp(output, {limitInputPixels: 64_000_000, failOn: 'error'}).metadata();
if (outputMetadata.width !== width || outputMetadata.height !== height) {
  fail(`prepared dimensions are ${outputMetadata.width}x${outputMetadata.height}, expected ${width}x${height}.`, 3);
}
if ((outputMetadata.pages ?? 1) > 1) fail('prepared output unexpectedly became multipage/animated.', 3);

const manifest = {
  version: 1,
  status: 'PREPARED_NOT_PRODUCTION_APPROVED',
  generatedAt: new Date().toISOString(),
  tool: 'sharp',
  source: {
    file: path.relative(process.cwd(), source).split(path.sep).join('/'),
    bytes: sourceStat.size,
    sha256: sourceSha256,
    decodedFormat: metadata.format,
    width: metadata.width,
    height: metadata.height,
    exifOrientation: metadata.orientation ?? null,
    orientedWidth,
    orientedHeight,
    pages: metadata.pages ?? 1,
  },
  provenance: {
    reference: provenanceRef,
    rightsAreNotChangedByImagePreparation: true,
    rightsReviewStillRequiredBeforeProduction: true,
  },
  preparation: {
    targetWidth: width,
    targetHeight: height,
    fit,
    position: positionName,
    format,
    quality: format === 'png' ? null : quality,
    autoOrientApplied: true,
    outputColourspace: 'srgb',
    metadataStripped: true,
    allowUpscale,
    inputByteLimit: maxInputBytes,
    inputPixelLimit: 64_000_000,
  },
  output: {
    file: path.relative(process.cwd(), output).split(path.sep).join('/'),
    bytes: outputInfo.size,
    sha256: outputSha256,
    width: outputMetadata.width,
    height: outputMetadata.height,
    format: outputMetadata.format,
  },
  safety: {
    sourceOverwritten: false,
    productionManifestModified: false,
    remoteMediaDuringRenderAllowed: false,
    automaticProductionApproval: false,
    humanVisualReviewRequired: true,
    cropReviewRequiredWhenFitCover: fit === 'cover',
  },
};
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

console.log('IMAGE ASSET PREP: OK — PREPARED_NOT_PRODUCTION_APPROVED');
console.log(`source: ${manifest.source.file}`);
console.log(`output: ${manifest.output.file}`);
console.log(`manifest: ${path.relative(process.cwd(), manifestPath).split(path.sep).join('/')}`);
console.log(`crop/fit: ${fit} / ${positionName}`);
console.log('Source was not modified. Production manifests were not changed.');
console.log('Next: visually compare crop/content, then explicitly bind the approved local output through the normal asset/provenance contract.');
