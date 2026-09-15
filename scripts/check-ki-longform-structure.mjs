#!/usr/bin/env node
import {existsSync, statSync} from 'node:fs';
import {readdir, readFile} from 'node:fs/promises';
import {join, resolve, sep} from 'node:path';
import process from 'node:process';

const ROOT = resolve('ki', 'youtube-longform');
const SOURCE_ROOT = resolve('ki', 'src', 'longform');
const V1_START = '2026-09-05';
const COMPLETE_PHASE1_SCAFFOLD_START = '2026-09-15';
const errors = [];
const warnings = [];

const error = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const posix = (value) => value.split(sep).join('/');
const isDir = (value) => existsSync(value) && statSync(value).isDirectory();
const isFile = (value) => existsSync(value) && statSync(value).isFile();
const inside = (parent, child) => child === parent || child.startsWith(`${parent}${sep}`);

const readJson = async (file, label) => {
  if (!isFile(file)) {
    error(`${label}: fehlt (${posix(file)})`);
    return null;
  }
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (cause) {
    error(`${label}: ungültiges JSON (${posix(file)}): ${cause instanceof Error ? cause.message : cause}`);
    return null;
  }
};

const requireDir = (root, relative) => {
  const file = join(root, relative);
  if (!isDir(file)) error(`Pflichtordner fehlt: ${posix(file)}`);
};
const requireFile = (root, relative) => {
  const file = join(root, relative);
  if (!isFile(file)) error(`Pflichtdatei fehlt: ${posix(file)}`);
};

if (!isDir(ROOT)) {
  console.error(`LONGFORM STRUCTURE FAILED: Root fehlt: ${posix(ROOT)}`);
  process.exit(1);
}

const dateEntries = (await readdir(ROOT, {withFileTypes: true}))
  .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(entry.name))
  .sort((a, b) => a.name.localeCompare(b.name));

let packageCount = 0;
let v1Count = 0;
for (const dateEntry of dateEntries) {
  const date = dateEntry.name;
  const dateRoot = join(ROOT, date);
  const packages = (await readdir(dateRoot, {withFileTypes: true}))
    .filter((entry) => entry.isDirectory() && /^\d{2}_.+/.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const packageEntry of packages) {
    packageCount += 1;
    const packageRoot = join(dateRoot, packageEntry.name);
    const requiredLegacyDirs = [
      '01-script-audio',
      '02-visuals',
      '03-thumbnail',
      '04-metadata',
      '05-export',
      '06-projektdateien',
    ];
    requiredLegacyDirs.forEach((relative) => requireDir(packageRoot, relative));
    requireFile(packageRoot, 'README.md');

    const versionPath = join(packageRoot, '06-projektdateien', 'LONGFORM-VERSION.json');
    const mustBeV1 = date >= V1_START || isFile(versionPath);
    if (!mustBeV1) continue;

    v1Count += 1;
    const version = await readJson(versionPath, 'LONGFORM-VERSION');
    if (version) {
      if (version.version !== 1 || version.contract !== 'LONGFORM_V1') {
        error(`${posix(versionPath)}: version=1 und contract=LONGFORM_V1 erforderlich.`);
      }
      if (version.publishDate !== date) error(`${posix(versionPath)}: publishDate muss ${date} entsprechen.`);
      if (version?.format?.width !== 1920 || version?.format?.height !== 1080 || version?.format?.fps !== 30) {
        error(`${posix(versionPath)}: Longform-v1-Format muss 1920x1080 @ 30 FPS sein.`);
      }
      if (version.animationFreedom !== 'OPEN_ENDED_STORY_DRIVEN') {
        error(`${posix(versionPath)}: animationFreedom muss OPEN_ENDED_STORY_DRIVEN sein.`);
      }
      if (typeof version.sourceSlug !== 'string' || !/^[a-z0-9][a-z0-9-]{1,159}$/.test(version.sourceSlug)) {
        error(`${posix(versionPath)}: sourceSlug muss ein sicherer lowercase Slug mit 2-160 Zeichen sein.`);
      } else {
        const sourceRoot = resolve(SOURCE_ROOT, version.sourceSlug);
        if (!inside(SOURCE_ROOT, sourceRoot)) error(`${posix(versionPath)}: sourceSlug verlässt ki/src/longform.`);
        else if (!isDir(sourceRoot)) error(`Longform-Source fehlt: ${posix(sourceRoot)}`);
      }
    }

    const requiredV1Dirs = [
      '02-visuals/images',
      '02-visuals/broll',
      '02-visuals/official',
      '02-visuals/generated',
    ];
    requiredV1Dirs.forEach((relative) => requireDir(packageRoot, relative));

    const requiredV1Files = [
      '01-script-audio/SCRIPT.md',
      '01-script-audio/CHAPTERS.json',
      '01-script-audio/CLAIMS.json',
      '02-visuals/MEDIA-PLAN.json',
      '03-thumbnail/THUMBNAIL-PLAN.json',
      '04-metadata/YOUTUBE.md',
      '06-projektdateien/RELEASE-PLAN.json',
      '06-projektdateien/REVIEW-CHECKLIST.md',
    ];
    if (date >= COMPLETE_PHASE1_SCAFFOLD_START) {
      requiredV1Files.push(
        '01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt',
        '02-visuals/VISUAL-STORY-PLAN.md',
      );
    }
    requiredV1Files.forEach((relative) => requireFile(packageRoot, relative));

    const chapters = await readJson(join(packageRoot, '01-script-audio', 'CHAPTERS.json'), 'CHAPTERS');
    if (chapters) {
      if (chapters.version !== 1 || !Array.isArray(chapters.chapters)) {
        error(`${posix(packageRoot)}: CHAPTERS.json braucht version=1 und chapters[].`);
      } else {
        const ids = new Set();
        for (const chapter of chapters.chapters) {
          if (!chapter || typeof chapter.id !== 'string' || !chapter.id.trim()) error(`${posix(packageRoot)}: Kapitel ohne id.`);
          if (!chapter || typeof chapter.title !== 'string' || !chapter.title.trim()) error(`${posix(packageRoot)}: Kapitel ohne title.`);
          if (chapter?.id && ids.has(chapter.id)) error(`${posix(packageRoot)}: doppelte Kapitel-id ${chapter.id}.`);
          if (chapter?.id) ids.add(chapter.id);
        }
      }
    }

    const claims = await readJson(join(packageRoot, '01-script-audio', 'CLAIMS.json'), 'CLAIMS');
    if (claims) {
      if (claims.version !== 1 || !Array.isArray(claims.claims)) {
        error(`${posix(packageRoot)}: CLAIMS.json braucht version=1 und claims[].`);
      } else {
        const ids = new Set();
        for (const claim of claims.claims) {
          if (!claim || typeof claim.claimId !== 'string' || !claim.claimId.trim()) error(`${posix(packageRoot)}: Claim ohne claimId.`);
          if (!claim || typeof claim.chapterId !== 'string' || !claim.chapterId.trim()) error(`${posix(packageRoot)}: Claim ohne chapterId.`);
          if (!claim || typeof claim.claim !== 'string' || !claim.claim.trim()) error(`${posix(packageRoot)}: Claim ohne Text.`);
          if (!claim || typeof claim.sourceType !== 'string' || !claim.sourceType.trim()) error(`${posix(packageRoot)}: Claim ohne sourceType.`);
          if (claim?.claimId && ids.has(claim.claimId)) error(`${posix(packageRoot)}: doppelte claimId ${claim.claimId}.`);
          if (claim?.claimId) ids.add(claim.claimId);
          if (claim?.factChecked === true && (!claim.sourceUrl || typeof claim.sourceUrl !== 'string')) {
            error(`${posix(packageRoot)}: factChecked Claim ${claim.claimId ?? '?'} braucht sourceUrl.`);
          }
        }
      }
    }

    const media = await readJson(join(packageRoot, '02-visuals', 'MEDIA-PLAN.json'), 'MEDIA-PLAN');
    if (media) {
      if (media.version !== 1 || !Array.isArray(media.assets)) {
        error(`${posix(packageRoot)}: MEDIA-PLAN.json braucht version=1 und assets[].`);
      }
      if (media?.policy?.renderTimeRemoteDownloadsAllowed !== false) {
        error(`${posix(packageRoot)}: Remote-Downloads zur Renderzeit müssen verboten sein.`);
      }
      if (media?.policy?.localMaterializationRequired !== true || media?.policy?.rightsVerificationRequired !== true) {
        error(`${posix(packageRoot)}: lokale Materialisierung und Rechteprüfung müssen Pflicht sein.`);
      }
      const approvedSourceTypes = new Set(Array.isArray(media?.policy?.approvedSourceTypes) ? media.policy.approvedSourceTypes : []);
      if (approvedSourceTypes.size === 0) {
        error(`${posix(packageRoot)}: MEDIA-PLAN.policy.approvedSourceTypes darf nicht leer sein.`);
      }
      for (const asset of media.assets ?? []) {
        if (!asset?.assetId || !asset?.chapterId || !asset?.purpose || !asset?.mediaType || !asset?.sourceType) {
          error(`${posix(packageRoot)}: jeder Media-Eintrag braucht assetId, chapterId, purpose, mediaType und sourceType.`);
          continue;
        }
        if (!approvedSourceTypes.has(asset.sourceType)) {
          error(`${posix(packageRoot)}: ${asset.assetId} verwendet nicht freigegebenen sourceType ${asset.sourceType}.`);
        }
        if (typeof asset.localFile === 'string' && /^https?:\/\//i.test(asset.localFile)) {
          error(`${posix(packageRoot)}: ${asset.assetId} localFile darf keine Remote-URL sein.`);
        }
        if (asset.sourceType === 'GENERATED_NON_EVIDENTIARY' && asset.provesRealWorldClaim === true) {
          error(`${posix(packageRoot)}: ${asset.assetId} darf als generiertes Medium keinen realen Claim beweisen.`);
        }
        if (asset.status === 'APPROVED') {
          if (asset.rightsVerified !== true) error(`${posix(packageRoot)}: APPROVED Asset ${asset.assetId} braucht rightsVerified=true.`);
          if (!asset.localFile) error(`${posix(packageRoot)}: APPROVED Asset ${asset.assetId} braucht localFile.`);
          if (typeof asset.sha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(asset.sha256)) {
            error(`${posix(packageRoot)}: APPROVED Asset ${asset.assetId} braucht SHA-256.`);
          }
          if (!['USER_PROVIDED', 'GENERATED_NON_EVIDENTIARY'].includes(asset.sourceType) && !asset.sourceUrl) {
            error(`${posix(packageRoot)}: APPROVED externes Asset ${asset.assetId} braucht sourceUrl.`);
          }
        }
      }
    }

    const thumbnail = await readJson(join(packageRoot, '03-thumbnail', 'THUMBNAIL-PLAN.json'), 'THUMBNAIL-PLAN');
    if (thumbnail) {
      if (thumbnail.version !== 1 || !Array.isArray(thumbnail.variants) || thumbnail.variants.length < 3) {
        error(`${posix(packageRoot)}: THUMBNAIL-PLAN braucht mindestens drei Varianten.`);
      }
    }

    const release = await readJson(join(packageRoot, '06-projektdateien', 'RELEASE-PLAN.json'), 'RELEASE-PLAN');
    if (release) {
      if (release.version !== 1 || !Array.isArray(release.requiredDeliverables)) {
        error(`${posix(packageRoot)}: RELEASE-PLAN.json ist unvollständig.`);
      }
      if (date >= COMPLETE_PHASE1_SCAFFOLD_START) {
        if (!Object.hasOwn(release, 'oneXReviewCompletedAt')) error(`${posix(packageRoot)}: RELEASE-PLAN.oneXReviewCompletedAt fehlt im neuen Scaffold.`);
        if (!Object.hasOwn(release, 'reviewedMasterSha256')) error(`${posix(packageRoot)}: RELEASE-PLAN.reviewedMasterSha256 fehlt im neuen Scaffold.`);
      }
      if (release.status === 'READY') {
        for (const field of ['technicalChecksComplete', 'visualReviewComplete', 'audioReviewComplete', 'sourceReviewComplete']) {
          if (release[field] !== true) error(`${posix(packageRoot)}: READY benötigt ${field}=true.`);
        }
      }
    }
  }
}

if (packageCount === 0) warn('Keine Longform-Produktionspakete gefunden.');
for (const message of warnings) console.warn(`LONGFORM STRUCTURE WARNING: ${message}`);

if (errors.length > 0) {
  console.error(`LONGFORM STRUCTURE FAILED (${errors.length}):`);
  for (const message of errors) console.error(`- ${message}`);
  process.exit(1);
}

console.log('LONGFORM STRUCTURE: PASSED');
console.log(`packages: ${packageCount}`);
console.log(`v1 packages: ${v1Count}`);
console.log(`v1 start: ${V1_START}`);
console.log(`complete phase-1 scaffold start: ${COMPLETE_PHASE1_SCAFFOLD_START}`);
