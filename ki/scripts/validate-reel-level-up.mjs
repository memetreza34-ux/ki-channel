#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/validate-reel-level-up.mjs <reel-package-dir>');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const fail = (message) => { console.error(`REEL LEVEL-UP FAILED: ${message}`); process.exit(1); };
const readJson = async (file) => {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { fail(`${file} missing/invalid: ${error instanceof Error ? error.message : error}`); }
};

const reelPath = path.join(reelDir, '06-projektdateien', 'reel.json');
if (!existsSync(reelPath)) fail('06-projektdateien/reel.json missing.');
const reel = await readJson(reelPath);
const publishDate = String(reel?.publishDate || '');
const requiredFrom = '2026-09-01';
const explicitlyEnabled = reel?.levelUp?.enabled === true;
const dateRequires = /^\d{4}-\d{2}-\d{2}$/.test(publishDate) && publishDate >= requiredFrom;
if (!explicitlyEnabled && !dateRequires) {
  console.log('REEL LEVEL-UP: SKIPPED (legacy/non-enabled reel)');
  process.exit(0);
}

const planFile = String(reel?.levelUp?.file || '06-projektdateien/LEVEL-UP-PLAN.json');
const planPath = path.resolve(reelDir, planFile);
if (!existsSync(planPath)) fail(`level-up plan missing: ${planPath}`);
const plan = await readJson(planPath);

if (plan?.status !== 'PHASE1_PLANNED' && plan?.status !== 'VOICE_LOCKED' && plan?.status !== 'RENDER_REVIEWED') {
  fail('LEVEL-UP-PLAN status must be PHASE1_PLANNED, VOICE_LOCKED or RENDER_REVIEWED.');
}

const brandMoments = Array.isArray(plan?.brandMoments) ? plan.brandMoments : [];
if (plan?.currentNewsBrandStory === true && brandMoments.length < 1) fail('current-news branded reel needs at least one brandMoment.');
const allowedBrandStrategies = new Set(['OFFICIAL_LOGO','OFFICIAL_PRODUCT_UI','OFFICIAL_SOURCE_CROP','TYPOGRAPHIC_NAME']);
for (const [index, item] of brandMoments.entries()) {
  if (!String(item?.brand || '').trim()) fail(`brandMoments[${index}] missing brand.`);
  if (!allowedBrandStrategies.has(String(item?.strategy || ''))) fail(`brandMoments[${index}] has unsupported strategy.`);
  if (item?.genericIconAsBrand !== false) fail(`brandMoments[${index}] must set genericIconAsBrand=false.`);
  if (!String(item?.sceneId || '').trim()) fail(`brandMoments[${index}] missing sceneId.`);
}

const proof = Array.isArray(plan?.realProofMoments) ? plan.realProofMoments : [];
if (plan?.currentNewsBrandStory === true && proof.length < 1) fail('current-news branded reel needs at least one realProofMoment.');
for (const [index, item] of proof.entries()) {
  if (!String(item?.sceneId || '').trim()) fail(`realProofMoments[${index}] missing sceneId.`);
  if (!String(item?.sourceUrl || '').startsWith('http')) fail(`realProofMoments[${index}] needs sourceUrl.`);
  if (!['OFFICIAL_SOURCE_CROP','OFFICIAL_PRODUCT_UI','OFFICIAL_DOCUMENT'].includes(String(item?.type || ''))) fail(`realProofMoments[${index}] has unsupported type.`);
  if (item?.remoteRenderAllowed !== false) fail(`realProofMoments[${index}] must set remoteRenderAllowed=false.`);
}

const reveals = Array.isArray(plan?.majorReveals) ? plan.majorReveals : [];
if (reveals.length < 4) fail('majorReveals needs at least four semantic reveal anchors.');
for (const [index, item] of reveals.entries()) {
  if (!String(item?.sceneId || '').trim() || !String(item?.sentenceId || '').trim()) fail(`majorReveals[${index}] needs sceneId + sentenceId.`);
  if (!String(item?.anchorPhrase || '').trim()) fail(`majorReveals[${index}] needs anchorPhrase.`);
  const fallback = Number(item?.fallbackProgress);
  if (!Number.isFinite(fallback) || fallback < 0 || fallback > 1) fail(`majorReveals[${index}] fallbackProgress must be 0..1.`);
}
if (String(plan?.timingAuthority || '') !== 'WORD_TIMINGS_AFTER_FORCED_ALIGNMENT') fail('timingAuthority must be WORD_TIMINGS_AFTER_FORCED_ALIGNMENT.');

const families = Array.isArray(plan?.motionFamilies) ? plan.motionFamilies.map(String).filter(Boolean) : [];
if (new Set(families).size < 5) fail('at least five unique motionFamilies required.');
if (Number(plan?.maxConsecutiveSameMajorGrammar) > 2 || Number(plan?.maxConsecutiveSameMajorGrammar) < 1) fail('maxConsecutiveSameMajorGrammar must be 1 or 2.');
const fullFrame = Array.isArray(plan?.fullFrameSceneIds) ? plan.fullFrameSceneIds.filter(Boolean) : [];
if (fullFrame.length < 1) fail('at least one fullFrameSceneId required.');

const caption = plan?.captionTarget || {};
if (Number(caption.bottom) < 320) fail('captionTarget.bottom must be at least 320.');
if (Number(caption.fontSize) < 38) fail('captionTarget.fontSize must be at least 38.');
if (Number(caption.maxWordsPerGroup) > 6 || Number(caption.maxWordsPerGroup) < 1) fail('captionTarget.maxWordsPerGroup must be 1..6.');
if (Number(caption.maxLines) !== 2) fail('captionTarget.maxLines must be 2.');

const micro = plan?.microdetails || {};
if (Number(micro.minimumImportantFontPx) < 22) fail('important microdetails must target at least 22 px.');
if (micro.progressiveReveal !== true) fail('microdetails.progressiveReveal must be true.');

const sfx = plan?.sfxDesign || {};
if (sfx.semanticVisibleTriggerRequired !== true) fail('sfxDesign.semanticVisibleTriggerRequired must be true.');
if (sfx.voicePriorityRequired !== true) fail('sfxDesign.voicePriorityRequired must be true.');

console.log('REEL LEVEL-UP PASSED');
console.log(`brand moments: ${brandMoments.length}`);
console.log(`real proof moments: ${proof.length}`);
console.log(`major reveal anchors: ${reveals.length}`);
console.log(`motion families: ${new Set(families).size}`);
console.log(`full-frame scenes: ${fullFrame.length}`);
console.log('timing authority: WORD_TIMINGS_AFTER_FORCED_ALIGNMENT');
