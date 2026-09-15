#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {createReadStream, existsSync, statSync} from 'node:fs';
import {readdir, readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {resolve, join, sep} from 'node:path';
import process from 'node:process';

const rawPackage = process.argv[2];
if (!rawPackage) {
  console.error('Usage: node scripts/check-ki-longform-release.mjs <ki/youtube-longform/YYYY-MM-DD/NN_Video-Titel>');
  process.exit(1);
}

const projectRoot = resolve('.');
const root = resolve(rawPackage);
const errors = [];
const posix = (p) => p.split(sep).join('/');
const isFile = (p) => existsSync(p) && statSync(p).isFile();
const nonEmptyFile = (p) => isFile(p) && statSync(p).size > 0;
const fail = (message) => errors.push(message);
const inside = (parent, child) => child === parent || child.startsWith(`${parent}${sep}`);

const sha256File = (file) => new Promise((ok, bad) => {
  const hash = createHash('sha256');
  const stream = createReadStream(file);
  stream.on('data', (chunk) => hash.update(chunk));
  stream.on('end', () => ok(hash.digest('hex')));
  stream.on('error', bad);
});

const readJson = async (relative) => {
  const file = join(root, relative);
  if (!isFile(file)) {
    fail(`Pflichtdatei fehlt: ${posix(file)}`);
    return null;
  }
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (cause) {
    fail(`Ungültiges JSON ${posix(file)}: ${cause instanceof Error ? cause.message : cause}`);
    return null;
  }
};

const git = (...args) => {
  const result = spawnSync('git', args, {encoding: 'utf8'});
  if (result.error || result.status !== 0) return null;
  return String(result.stdout || '').trim();
};

if (!existsSync(root) || !statSync(root).isDirectory()) {
  console.error(`LONGFORM RELEASE FAILED: Paket fehlt: ${posix(root)}`);
  process.exit(1);
}
if (!inside(projectRoot, root)) {
  console.error(`LONGFORM RELEASE FAILED: Paket liegt außerhalb des Repository-Roots: ${posix(root)}`);
  process.exit(1);
}

const version = await readJson('06-projektdateien/LONGFORM-VERSION.json');
const release = await readJson('06-projektdateien/RELEASE-PLAN.json');
const claims = await readJson('01-script-audio/CLAIMS.json');
const chapters = await readJson('01-script-audio/CHAPTERS.json');
const media = await readJson('02-visuals/MEDIA-PLAN.json');
const thumbnail = await readJson('03-thumbnail/THUMBNAIL-PLAN.json');
const renderLock = await readJson('06-projektdateien/RENDER-LOCK.json');
const masterQa = await readJson('06-projektdateien/review/MASTER-QA.json');
const renderResult = await readJson('06-projektdateien/review/RENDER-RESULT.json');

if (version) {
  if (version.version !== 1 || version.contract !== 'LONGFORM_V1') fail('Release-Gate unterstützt nur LONGFORM_V1.');
  if (!version.compositionId) fail('LONGFORM-VERSION.compositionId fehlt.');
}

if (renderLock) {
  if (renderLock.status !== 'LOCKED_FOR_RENDER' || renderLock.contract !== 'LONGFORM_V1_RENDER_LOCK') {
    fail('RENDER-LOCK ist nicht gültig/locked.');
  }
  if (version?.compositionId && renderLock.compositionId !== version.compositionId) {
    fail('RENDER-LOCK compositionId stimmt nicht mit LONGFORM-VERSION überein.');
  }
  if (!Array.isArray(renderLock.files) || renderLock.files.length === 0) {
    fail('RENDER-LOCK.files fehlt.');
  }

  const currentHead = git('rev-parse', 'HEAD');
  if (!currentHead) fail('Aktueller Git-HEAD konnte nicht gelesen werden.');
  if (typeof renderLock.gitHead !== 'string' || !/^[a-f0-9]{40}$/i.test(renderLock.gitHead)) {
    fail('RENDER-LOCK.gitHead fehlt oder ist ungültig.');
  } else if (currentHead) {
    const ancestry = spawnSync('git', ['merge-base', '--is-ancestor', renderLock.gitHead, currentHead], {encoding: 'utf8'});
    if (ancestry.error || ancestry.status !== 0) {
      fail(`Aktueller Git-HEAD enthält den Render-Lock-Commit nicht: lock=${renderLock.gitHead}, current=${currentHead}.`);
    }
  }

  for (const record of renderLock.files ?? []) {
    if (!record || typeof record !== 'object') {
      fail('RENDER-LOCK enthält einen ungültigen Datei-Eintrag.');
      continue;
    }
    if (typeof record.file !== 'string' || !record.file.trim()) {
      fail('RENDER-LOCK-Datei ohne gültigen Pfad.');
      continue;
    }
    const lockedFile = resolve(projectRoot, record.file);
    if (!inside(projectRoot, lockedFile)) {
      fail(`RENDER-LOCK-Datei verlässt Repository-Root: ${record.file}`);
      continue;
    }
    if (!isFile(lockedFile)) {
      fail(`RENDER-LOCK-Datei fehlt: ${record.file}`);
      continue;
    }
    const actualBytes = statSync(lockedFile).size;
    if (!Number.isInteger(record.bytes) || record.bytes < 0 || actualBytes !== record.bytes) {
      fail(`RENDER-LOCK-Dateigröße stimmt nicht: ${record.file}`);
    }
    if (typeof record.sha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(record.sha256)) {
      fail(`RENDER-LOCK-SHA fehlt/ungültig: ${record.file}`);
      continue;
    }
    const actualSha = await sha256File(lockedFile);
    if (actualSha.toLowerCase() !== record.sha256.toLowerCase()) {
      fail(`RENDER-LOCK-SHA stimmt nicht mehr: ${record.file}`);
    }
  }
}

if (masterQa) {
  if (masterQa.status !== 'PASSED') fail('MASTER-QA.status muss PASSED sein.');
  if (Array.isArray(masterQa.errors) && masterQa.errors.length) fail('MASTER-QA enthält Fehler.');
}

let reviewMasterPath = null;
if (renderResult) {
  if (renderResult.status !== 'LONGFORM_REVIEW_CANDIDATE_READY_NOT_RELEASED') fail('RENDER-RESULT hat unerwarteten Status.');
  if (version?.compositionId && renderResult.compositionId !== version.compositionId) fail('RENDER-RESULT compositionId stimmt nicht.');
  if (renderResult.humanReviewRequired !== true) fail('RENDER-RESULT muss humanReviewRequired=true setzen.');
  if (typeof renderResult.master !== 'string' || !renderResult.master.trim()) {
    fail('RENDER-RESULT.master fehlt.');
  } else {
    reviewMasterPath = resolve(projectRoot, renderResult.master);
    if (!inside(root, reviewMasterPath)) fail(`Review-Master liegt außerhalb des Longform-Pakets: ${renderResult.master}`);
    else if (!nonEmptyFile(reviewMasterPath)) fail(`Review-Master fehlt oder ist leer: ${renderResult.master}`);
  }
}

if (release) {
  if (release.status !== 'READY') fail('RELEASE-PLAN.status muss READY sein.');
  for (const field of ['technicalChecksComplete', 'visualReviewComplete', 'audioReviewComplete', 'sourceReviewComplete']) {
    if (release[field] !== true) fail(`RELEASE-PLAN.${field} muss true sein.`);
  }
  if (typeof release.oneXReviewCompletedAt !== 'string' || !release.oneXReviewCompletedAt.trim()) {
    fail('RELEASE-PLAN.oneXReviewCompletedAt fehlt.');
  }
  if (typeof release.reviewedMasterSha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(release.reviewedMasterSha256)) {
    fail('RELEASE-PLAN.reviewedMasterSha256 fehlt/ungültig.');
  }
  if (!Array.isArray(release.requiredDeliverables)) {
    fail('RELEASE-PLAN.requiredDeliverables fehlt.');
  }
  const exportRoot = join(root, '05-export');
  for (const deliverable of release.requiredDeliverables ?? []) {
    if (typeof deliverable !== 'string' || !deliverable.trim()) {
      fail('Ungültiger Eintrag in requiredDeliverables.');
      continue;
    }
    const file = resolve(exportRoot, deliverable);
    if (!inside(exportRoot, file)) {
      fail(`Export-Pfad verlässt 05-export: ${deliverable}`);
      continue;
    }
    if (!nonEmptyFile(file)) fail(`Export fehlt oder ist leer: 05-export/${deliverable}`);
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
    if (asset.requiredForRender === false) continue;
    const id = asset.assetId ?? '?';
    if (asset.status !== 'APPROVED') fail(`Media ${id} ist nicht APPROVED.`);
    if (asset.rightsVerified !== true) fail(`Media ${id} braucht rightsVerified=true.`);
    if (!asset.localFile || /^https?:\/\//i.test(String(asset.localFile))) {
      fail(`Media ${id} braucht eine lokale Datei.`);
      continue;
    }
    if (typeof asset.sha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(asset.sha256)) fail(`Media ${id} braucht SHA-256.`);
    if (!['USER_PROVIDED', 'GENERATED_NON_EVIDENTIARY'].includes(asset.sourceType) && !asset.sourceUrl) {
      fail(`Externes Media ${id} braucht sourceUrl.`);
    }
    if (asset.sourceType === 'GENERATED_NON_EVIDENTIARY' && asset.provesRealWorldClaim === true) {
      fail(`Generiertes Media ${id} darf keinen realen Claim beweisen.`);
    }

    const local = resolve(root, String(asset.localFile));
    if (!inside(root, local)) {
      fail(`Media ${id} localFile verlässt das Longform-Paket: ${asset.localFile}`);
      continue;
    }
    if (!nonEmptyFile(local)) {
      fail(`Lokales Media fehlt/leer: ${asset.localFile}`);
    } else if (typeof asset.sha256 === 'string' && /^[a-f0-9]{64}$/i.test(asset.sha256)) {
      const actual = await sha256File(local);
      if (actual.toLowerCase() !== asset.sha256.toLowerCase()) fail(`Media ${id} SHA-256 stimmt nicht mit lokaler Datei überein.`);
    }
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

const finalMaster = join(root, '05-export', 'video.mp4');
if (nonEmptyFile(finalMaster)) {
  const finalSha = await sha256File(finalMaster);
  if (release?.reviewedMasterSha256 && finalSha.toLowerCase() !== String(release.reviewedMasterSha256).toLowerCase()) {
    fail('05-export/video.mp4 stimmt nicht mit reviewedMasterSha256 überein.');
  }
  if (reviewMasterPath && nonEmptyFile(reviewMasterPath)) {
    const reviewSha = await sha256File(reviewMasterPath);
    if (reviewSha !== finalSha) fail('Finaler video.mp4 ist nicht byte-identisch mit dem technisch geprüften Review-Master.');
  }
  const qaRun = spawnSync(process.execPath, [resolve('scripts', 'check-ki-longform-master.mjs'), finalMaster], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (qaRun.error || qaRun.status !== 0) {
    fail(`Finaler Master besteht Live-QA nicht: ${qaRun.stderr || qaRun.stdout || qaRun.error?.message}`);
  }
} else {
  fail('Finaler Master 05-export/video.mp4 fehlt.');
}

const reviewDir = join(root, '06-projektdateien', 'review');
if (existsSync(reviewDir) && statSync(reviewDir).isDirectory()) {
  const sheets = (await readdir(reviewDir)).filter((name) => /^CONTACT-SHEET-\d+\.jpg$/i.test(name));
  if (sheets.length === 0) fail('Kontaktbogen für visuellen Review fehlt.');
} else {
  fail('Review-Ordner fehlt.');
}

if (errors.length) {
  console.error(`LONGFORM RELEASE FAILED (${errors.length}):`);
  for (const message of errors) console.error(`- ${message}`);
  process.exit(1);
}

console.log('LONGFORM RELEASE: PASSED');
console.log(`package: ${posix(root)}`);
console.log('Render-Lock-Commit ist Teil der aktuellen Historie; gelockte Inputs, finaler Master und menschlicher Review sind gemeinsam verifiziert.');
