#!/usr/bin/env node
import {existsSync, statSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {resolve, join, sep} from 'node:path';
import process from 'node:process';

const rawPackage = process.argv[2];
if (!rawPackage) {
  console.error('Usage: node scripts/check-ki-longform-release.mjs <ki/youtube-longform/YYYY-MM-DD/NN_Video-Titel>');
  process.exit(1);
}

const root = resolve(rawPackage);
const errors = [];
const posix = (path) => path.split(sep).join('/');
const isFile = (path) => existsSync(path) && statSync(path).isFile();
const nonEmptyFile = (path) => isFile(path) && statSync(path).size > 0;
const fail = (message) => errors.push(message);

const readJson = async (relative) => {
  const path = join(root, relative);
  if (!isFile(path)) {
    fail(`Pflichtdatei fehlt: ${posix(path)}`);
    return null;
  }
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (cause) {
    fail(`Ungültiges JSON ${posix(path)}: ${cause instanceof Error ? cause.message : cause}`);
    return null;
  }
};

if (!existsSync(root) || !statSync(root).isDirectory()) {
  console.error(`LONGFORM RELEASE FAILED: Paket fehlt: ${posix(root)}`);
  process.exit(1);
}

const version = await readJson('06-projektdateien/LONGFORM-VERSION.json');
const release = await readJson('06-projektdateien/RELEASE-PLAN.json');
const claims = await readJson('01-script-audio/CLAIMS.json');
const chapters = await readJson('01-script-audio/CHAPTERS.json');
const media = await readJson('02-visuals/MEDIA-PLAN.json');
const thumbnail = await readJson('03-thumbnail/THUMBNAIL-PLAN.json');

if (version && (version.version !== 1 || version.contract !== 'LONGFORM_V1')) {
  fail('Release-Gate unterstützt nur LONGFORM_V1.');
}

if (release) {
  if (release.status !== 'READY') fail('RELEASE-PLAN.status muss READY sein.');
  for (const field of ['technicalChecksComplete', 'visualReviewComplete', 'audioReviewComplete', 'sourceReviewComplete']) {
    if (release[field] !== true) fail(`RELEASE-PLAN.${field} muss true sein.`);
  }
  if (!Array.isArray(release.requiredDeliverables)) fail('RELEASE-PLAN.requiredDeliverables fehlt.');
  for (const deliverable of release.requiredDeliverables ?? []) {
    if (typeof deliverable !== 'string' || !deliverable.trim()) {
      fail('Ungültiger Eintrag in requiredDeliverables.');
      continue;
    }
    const path = join(root, '05-export', deliverable);
    if (!nonEmptyFile(path)) fail(`Export fehlt oder ist leer: 05-export/${deliverable}`);
  }
}

if (claims) {
  if (claims.status !== 'READY') fail('CLAIMS.status muss READY sein.');
  if (!Array.isArray(claims.claims)) fail('CLAIMS.claims muss ein Array sein.');
  for (const claim of claims.claims ?? []) {
    if (claim.factChecked !== true) fail(`Claim ${claim.claimId ?? '?'} ist nicht factChecked.`);
    if (!claim.sourceUrl || typeof claim.sourceUrl !== 'string') fail(`Claim ${claim.claimId ?? '?'} braucht sourceUrl.`);
    if (!claim.chapterId) fail(`Claim ${claim.claimId ?? '?'} braucht chapterId.`);
  }
}

if (chapters) {
  if (chapters.status !== 'READY') fail('CHAPTERS.status muss READY sein.');
  if (!Array.isArray(chapters.chapters) || chapters.chapters.length === 0) fail('Mindestens ein Kapitel ist erforderlich.');
  let lastEnd = -1;
  for (const chapter of chapters.chapters ?? []) {
    const start = Number(chapter.startSeconds);
    const end = Number(chapter.endSeconds);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) {
      fail(`Kapitel ${chapter.id ?? '?'} braucht gültige reale startSeconds/endSeconds.`);
      continue;
    }
    if (start < lastEnd - 0.05) fail(`Kapitel ${chapter.id ?? '?'} überlappt unerwartet die vorige Timeline.`);
    lastEnd = end;
  }
}

if (media) {
  if (media.status !== 'READY') fail('MEDIA-PLAN.status muss READY sein.');
  if (!Array.isArray(media.assets)) fail('MEDIA-PLAN.assets muss ein Array sein.');
  for (const asset of media.assets ?? []) {
    if (asset.status !== 'APPROVED') fail(`Media ${asset.assetId ?? '?'} ist nicht APPROVED.`);
    if (asset.rightsVerified !== true) fail(`Media ${asset.assetId ?? '?'} braucht rightsVerified=true.`);
    if (!asset.localFile || /^https?:\/\//i.test(String(asset.localFile))) fail(`Media ${asset.assetId ?? '?'} braucht eine lokale Datei.`);
    if (typeof asset.sha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(asset.sha256)) fail(`Media ${asset.assetId ?? '?'} braucht SHA-256.`);
    if (!['USER_PROVIDED', 'GENERATED_NON_EVIDENTIARY'].includes(asset.sourceType) && !asset.sourceUrl) {
      fail(`Externes Media ${asset.assetId ?? '?'} braucht sourceUrl.`);
    }
    if (asset.sourceType === 'GENERATED_NON_EVIDENTIARY' && asset.provesRealWorldClaim === true) {
      fail(`Generiertes Media ${asset.assetId ?? '?'} darf keinen realen Claim beweisen.`);
    }
    const local = resolve(root, String(asset.localFile || ''));
    if (asset.localFile && !nonEmptyFile(local)) fail(`Lokales Media fehlt/leer: ${asset.localFile}`);
  }
}

if (thumbnail) {
  if (thumbnail.status !== 'READY') fail('THUMBNAIL-PLAN.status muss READY sein.');
  if (!Array.isArray(thumbnail.variants) || thumbnail.variants.length < 3) fail('Mindestens drei Thumbnail-Varianten erforderlich.');
  if (!thumbnail.selectedVariant) fail('THUMBNAIL-PLAN.selectedVariant fehlt.');
  else if (!thumbnail.variants?.some((variant) => variant.id === thumbnail.selectedVariant)) fail('selectedVariant ist nicht in variants vorhanden.');
}

if (!nonEmptyFile(join(root, '01-script-audio', 'voiceover.wav')) && !nonEmptyFile(join(root, '01-script-audio', 'voiceover.mp3'))) {
  fail('Finales Nutzer-Voiceover fehlt (voiceover.wav oder voiceover.mp3).');
}

if (errors.length > 0) {
  console.error(`LONGFORM RELEASE FAILED (${errors.length}):`);
  for (const message of errors) console.error(`- ${message}`);
  process.exit(1);
}

console.log('LONGFORM RELEASE: PASSED');
console.log(`package: ${posix(root)}`);
console.log('Master, Claims, Media, Thumbnail, Voiceover und Review-Vertrag sind release-bereit.');
