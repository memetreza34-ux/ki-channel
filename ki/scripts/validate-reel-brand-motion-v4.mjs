#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/validate-reel-brand-motion-v4.mjs <reel-package-dir>');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const fail = (message) => { console.error(`REEL BRAND/MOTION V4 FAILED: ${message}`); process.exit(1); };
const readJson = async (file) => {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { fail(`${file} missing/invalid: ${error instanceof Error ? error.message : error}`); }
};
const text = (value) => String(value ?? '').trim();
const asArray = (value) => Array.isArray(value) ? value : [];
const isHex = (value) => /^#[0-9a-f]{6}$/i.test(text(value));

const reelPath = path.join(reelDir, '06-projektdateien', 'reel.json');
if (!existsSync(reelPath)) fail('06-projektdateien/reel.json missing.');
const reel = await readJson(reelPath);
const publishDate = text(reel?.publishDate);
const v4Required = /^\d{4}-\d{2}-\d{2}$/.test(publishDate) && publishDate >= '2026-09-05';
if (!v4Required && Number(reel?.levelUp?.standardVersion || 0) < 4) {
  console.log('REEL BRAND/MOTION V4: SKIPPED');
  process.exit(0);
}
if (Number(reel?.levelUp?.standardVersion || 0) < 4) fail('reel.levelUp.standardVersion must be >=4 for Level-Up v4 reels.');

const levelUpPath = path.join(reelDir, '06-projektdateien', 'LEVEL-UP-PLAN.json');
const brandMotionPath = path.join(reelDir, '06-projektdateien', 'BRAND-MOTION-PLAN.json');
for (const file of [levelUpPath, brandMotionPath]) if (!existsSync(file)) fail(`required v4 file missing: ${file}`);
const levelUp = await readJson(levelUpPath);
const plan = await readJson(brandMotionPath);
if (Number(levelUp?.version) < 4) fail('LEVEL-UP-PLAN.json version must be >=4.');
if (Number(plan?.version) < 1) fail('BRAND-MOTION-PLAN.json version missing/invalid.');
if (!['DRAFT','PHASE1_PLANNED','VOICE_LOCKED','RENDER_REVIEWED'].includes(text(plan?.status))) fail('BRAND-MOTION-PLAN status invalid.');

const brand = plan?.brandIdentity || {};
if (brand?.officialAssetPreferred !== true) fail('brandIdentity.officialAssetPreferred must be true.');
if (brand?.realAssetRequiredOrException !== true) fail('brandIdentity.realAssetRequiredOrException must be true.');
if (brand?.fakeLogoForbidden !== true) fail('brandIdentity.fakeLogoForbidden must be true.');
if (brand?.typographicFallbackAllowed !== true) fail('brandIdentity.typographicFallbackAllowed must be true.');
if (brand?.functionalIconsMayImpersonateBrand !== false) fail('functionalIconsMayImpersonateBrand must be false.');
const primaryBrands = asArray(brand?.primaryBrands).map(text).filter(Boolean);
if (levelUp?.currentNewsBrandStory === true && primaryBrands.length < 1) fail('branded v4 reel needs brandIdentity.primaryBrands.');
const brandAssetException = text(brand?.assetExceptionReason);
const plannedOfficialAssets = asArray(brand?.plannedOfficialAssets);
if (levelUp?.currentNewsBrandStory === true && plannedOfficialAssets.length < 1 && !brandAssetException) {
  fail('branded v4 reel needs at least one planned official brand/product asset or assetExceptionReason.');
}
for (const [index, asset] of plannedOfficialAssets.entries()) {
  if (!text(asset?.sceneId)) fail(`plannedOfficialAssets[${index}] missing sceneId.`);
  if (!text(asset?.role)) fail(`plannedOfficialAssets[${index}] missing role.`);
  if (!/^https:\/\//i.test(text(asset?.sourceUrl))) fail(`plannedOfficialAssets[${index}] needs official https sourceUrl.`);
}

const palette = plan?.brandPalette || {};
if (!/^https:\/\//i.test(text(palette?.referenceUrl)) && levelUp?.currentNewsBrandStory === true) fail('brandPalette.referenceUrl must be an official/reference https URL.');
if (palette?.scenePaletteConsistencyRequired !== true) fail('brandPalette.scenePaletteConsistencyRequired must be true.');
if (palette?.brandColorAccuracyReviewRequired !== true) fail('brandPalette.brandColorAccuracyReviewRequired must be true.');
if (palette?.semanticColorExceptionsAllowed !== true) fail('brandPalette.semanticColorExceptionsAllowed must be true.');
const primaryColors = asArray(palette?.primary).map(text).filter(Boolean);
const neutralColors = asArray(palette?.neutral).map(text).filter(Boolean);
if (levelUp?.currentNewsBrandStory === true && primaryColors.length < 1) fail('brandPalette.primary needs at least one color.');
if (neutralColors.length < 1) fail('brandPalette.neutral needs at least one color.');
for (const color of [...primaryColors, ...neutralColors, ...asArray(palette?.secondary).map(text).filter(Boolean)]) {
  if (!isHex(color)) fail(`brand palette color must be #RRGGBB: ${color}`);
}
if (asArray(palette?.sceneNotes).length < 1) fail('brandPalette.sceneNotes needs at least one scene color note.');

const icons = plan?.functionalIconPolicy || {};
if (icons?.enabled !== true) fail('functionalIconPolicy.enabled must be true.');
if (icons?.brandIconsForbidden !== true) fail('functionalIconPolicy.brandIconsForbidden must be true.');
if (icons?.functionalIconsEncouraged !== true) fail('functionalIconPolicy.functionalIconsEncouraged must be true.');
if (icons?.brandAndFunctionMustStayVisuallyDistinct !== true) fail('brand/function icon separation must be true.');

const motion = plan?.animationFreedom || {};
if (text(motion?.policy) !== 'OPEN_ENDED_STORY_DRIVEN') fail('animationFreedom.policy must be OPEN_ENDED_STORY_DRIVEN.');
if (motion?.noFixedTechniqueAllowlist !== true) fail('animationFreedom.noFixedTechniqueAllowlist must be true.');
if (motion?.anyTechniqueAllowedIfStoryUseful !== true) fail('animationFreedom.anyTechniqueAllowedIfStoryUseful must be true.');
if (motion?.experimentalTechniquesAllowed !== true) fail('animationFreedom.experimentalTechniquesAllowed must be true.');
if (motion?.readabilitySafetyPerformanceGatesRequired !== true) fail('animationFreedom.readabilitySafetyPerformanceGatesRequired must be true.');
if (motion?.fallbackRequiredForFragileTechnique !== true) fail('animationFreedom.fallbackRequiredForFragileTechnique must be true.');
if (motion?.effectSpamForbidden !== true) fail('animationFreedom.effectSpamForbidden must be true.');
const plannedFamilies = asArray(motion?.plannedFamilies).map(text).filter(Boolean);
if (plannedFamilies.length < 5) fail('animationFreedom.plannedFamilies needs at least five meaningful motion families.');

const evolution = plan?.capabilityEvolution || {};
if (evolution?.scanAvailableSkillsBeforeBuild !== true) fail('capabilityEvolution.scanAvailableSkillsBeforeBuild must be true.');
if (evolution?.addCapabilityOnlyWhenMaterialGain !== true) fail('capabilityEvolution.addCapabilityOnlyWhenMaterialGain must be true.');
if (evolution?.doNotAddRedundantTools !== true) fail('capabilityEvolution.doNotAddRedundantTools must be true.');
if (evolution?.preferOfficialFreeLocalFirst !== true) fail('capabilityEvolution.preferOfficialFreeLocalFirst must be true.');

const review = new Set(asArray(plan?.requiredFinalReviewGates).map(text).filter(Boolean));
for (const gate of [
  'BRAND_ASSET_VISIBLE_OR_JUSTIFIED',
  'BRAND_COLOR_COHERENCE',
  'FUNCTIONAL_ICONS_ARE_NOT_FAKE_LOGOS',
  'MOTION_NOT_TEMPLATE_LOCKED',
  'ANIMATION_TECHNIQUE_FITS_STORY',
  'NO_ACCIDENTAL_COLOR_DRIFT',
  'REAL_MEDIA_MATERIALIZED_OR_JUSTIFIED',
]) {
  if (!review.has(gate)) fail(`requiredFinalReviewGates missing ${gate}.`);
}

console.log('REEL BRAND/MOTION V4 PASSED');
console.log(`primary brands: ${primaryBrands.length}`);
console.log(`planned official assets: ${plannedOfficialAssets.length}`);
console.log(`primary colors: ${primaryColors.length}`);
console.log(`planned motion families: ${plannedFamilies.length}`);
console.log('animation policy: OPEN_ENDED_STORY_DRIVEN');
