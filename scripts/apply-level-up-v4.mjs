#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node scripts/apply-level-up-v4.mjs <reel-package-dir>');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const reelPath = path.join(reelDir, '06-projektdateien', 'reel.json');
const levelPath = path.join(reelDir, '06-projektdateien', 'LEVEL-UP-PLAN.json');
const brandMotionPath = path.join(reelDir, '06-projektdateien', 'BRAND-MOTION-PLAN.json');
const reviewPath = path.join(reelDir, '06-projektdateien', 'MOTION-READABILITY-REVIEW.md');
const fail = (message) => { console.error(`LEVEL-UP V4 SCAFFOLD FAILED: ${message}`); process.exit(1); };
const readJson = async (file) => {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { fail(`${file} invalid: ${error instanceof Error ? error.message : error}`); }
};

for (const file of [reelPath, levelPath]) if (!existsSync(file)) fail(`required file missing: ${file}`);
const reel = await readJson(reelPath);
const publishDate = String(reel?.publishDate || '');
if (!/^\d{4}-\d{2}-\d{2}$/.test(publishDate) || publishDate < '2026-09-05') {
  console.log('LEVEL-UP V4 SCAFFOLD: SKIPPED');
  process.exit(0);
}

const level = await readJson(levelPath);
level.version = Math.max(4, Number(level.version || 0));
level.brandMotionPlanFile = '06-projektdateien/BRAND-MOTION-PLAN.json';
level.functionalIconPolicy = {
  ...(level.functionalIconPolicy || {}),
  enabled: true,
  brandIconsForbidden: true,
  functionalIconsEncouraged: true,
  brandAndFunctionMustStayVisuallyDistinct: true,
};
await writeFile(levelPath, `${JSON.stringify(level, null, 2)}\n`, 'utf8');

reel.levelUp = {
  ...(reel.levelUp || {}),
  enabled: true,
  file: reel?.levelUp?.file || '06-projektdateien/LEVEL-UP-PLAN.json',
  standardVersion: 4,
  brandMotionPlanFile: '06-projektdateien/BRAND-MOTION-PLAN.json',
};
reel.productionMode = 'LEVEL_UP_V4_BRAND_FIDELITY_OPEN_MOTION';
await writeFile(reelPath, `${JSON.stringify(reel, null, 2)}\n`, 'utf8');

if (!existsSync(brandMotionPath)) {
  const plan = {
    version: 1,
    status: 'DRAFT',
    standard: 'LEVEL_UP_V4',
    brandIdentity: {
      primaryBrands: [],
      officialAssetPreferred: true,
      realAssetRequiredOrException: true,
      fakeLogoForbidden: true,
      typographicFallbackAllowed: true,
      functionalIconsMayImpersonateBrand: false,
      plannedOfficialAssets: [],
      assetExceptionReason: '',
    },
    brandPalette: {
      referenceUrl: '',
      primary: [],
      secondary: [],
      neutral: ['#FFFFFF', '#101828'],
      semanticColorExceptionsAllowed: true,
      scenePaletteConsistencyRequired: true,
      brandColorAccuracyReviewRequired: true,
      sceneNotes: [],
    },
    functionalIconPolicy: {
      enabled: true,
      brandIconsForbidden: true,
      functionalIconsEncouraged: true,
      brandAndFunctionMustStayVisuallyDistinct: true,
      plannedFunctions: [],
    },
    animationFreedom: {
      policy: 'OPEN_ENDED_STORY_DRIVEN',
      noFixedTechniqueAllowlist: true,
      anyTechniqueAllowedIfStoryUseful: true,
      experimentalTechniquesAllowed: true,
      readabilitySafetyPerformanceGatesRequired: true,
      fallbackRequiredForFragileTechnique: true,
      effectSpamForbidden: true,
      plannedFamilies: [],
      experimentalIdeas: [],
    },
    capabilityEvolution: {
      scanAvailableSkillsBeforeBuild: true,
      addCapabilityOnlyWhenMaterialGain: true,
      doNotAddRedundantTools: true,
      preferOfficialFreeLocalFirst: true,
      consideredNewCapabilities: [],
    },
    requiredFinalReviewGates: [
      'BRAND_ASSET_VISIBLE_OR_JUSTIFIED',
      'BRAND_COLOR_COHERENCE',
      'FUNCTIONAL_ICONS_ARE_NOT_FAKE_LOGOS',
      'BRAND_RECOGNIZABLE_WITHOUT_CAPTION',
      'MOTION_NOT_TEMPLATE_LOCKED',
      'ANIMATION_TECHNIQUE_FITS_STORY',
      'NO_ACCIDENTAL_COLOR_DRIFT',
      'REAL_MEDIA_MATERIALIZED_OR_JUSTIFIED',
    ],
  };
  await writeFile(brandMotionPath, `${JSON.stringify(plan, null, 2)}\n`, 'utf8');
}

if (existsSync(reviewPath)) {
  const requiredReviewLines = [
    'BRAND_ASSET_VISIBLE_OR_JUSTIFIED: PENDING',
    'BRAND_COLOR_COHERENCE: PENDING',
    'FUNCTIONAL_ICONS_ARE_NOT_FAKE_LOGOS: PENDING',
    'MOTION_NOT_TEMPLATE_LOCKED: PENDING',
    'ANIMATION_TECHNIQUE_FITS_STORY: PENDING',
    'NO_ACCIDENTAL_COLOR_DRIFT: PENDING',
    'REAL_MEDIA_MATERIALIZED_OR_JUSTIFIED: PENDING',
  ];
  let review = await readFile(reviewPath, 'utf8');
  const missing = requiredReviewLines.filter((line) => !review.includes(`${line.split(':')[0]}:`));
  if (missing.length) {
    const block = `${missing.join('\n')}\n`;
    review = review.includes('REVIEWED_VIDEO_SHA256:')
      ? review.replace('REVIEWED_VIDEO_SHA256:', `${block}REVIEWED_VIDEO_SHA256:`)
      : `${review.trimEnd()}\n${block}`;
    await writeFile(reviewPath, review, 'utf8');
  }
}

console.log('LEVEL-UP V4 SCAFFOLD APPLIED');
console.log(`reel: ${reelDir}`);
console.log(`brand motion plan: ${brandMotionPath}`);
console.log(`review template: ${existsSync(reviewPath) ? 'v4 fields ensured' : 'not present yet'}`);
