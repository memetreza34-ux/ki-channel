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

if (Number(plan?.version) < 2) fail('LEVEL-UP-PLAN version must be >= 2 for reels from 2026-09-01.');
if (!['PHASE1_PLANNED','VOICE_LOCKED','RENDER_REVIEWED'].includes(String(plan?.status || ''))) {
  fail('LEVEL-UP-PLAN status must be PHASE1_PLANNED, VOICE_LOCKED or RENDER_REVIEWED.');
}

// Cover-first contract: first second must already contain a finished cover candidate.
const cover = plan?.coverHook || {};
if (cover?.enabled !== true) fail('coverHook.enabled must be true.');
const candidateFrame = Number(cover?.candidateFrame);
const holdFrames = Number(cover?.holdFrames);
if (!Number.isFinite(candidateFrame) || candidateFrame < 0 || candidateFrame > 30) fail('coverHook.candidateFrame must be 0..30.');
if (!Number.isFinite(holdFrames) || holdFrames < 12) fail('coverHook.holdFrames must be at least 12.');
if (candidateFrame + holdFrames > 30) fail('coverHook candidateFrame + holdFrames must be <=30 so the clean cover hold stays inside the first second.');
if (cover?.captionFree !== true) fail('coverHook.captionFree must be true.');
if (cover?.headlineRequired !== true) fail('coverHook.headlineRequired must be true.');
if (cover?.primarySubjectRequired !== true) fail('coverHook.primarySubjectRequired must be true.');
if (cover?.coverMatchesStory !== true) fail('coverHook.coverMatchesStory must be true.');
const coverTime = Number(reel?.export?.coverTimeSeconds);
if (!Number.isFinite(coverTime) || coverTime < 0 || coverTime > 1) fail('reel.export.coverTimeSeconds must point into the first second for Level-Up reels.');
const coverFrameFromTime = Math.round(coverTime * Number(reel?.format?.fps || 30));
if (Math.abs(coverFrameFromTime - candidateFrame) > 2) fail('reel.export.coverTimeSeconds must point to the planned coverHook.candidateFrame (within 2 frames).');

// Brand fidelity.
const brandMoments = Array.isArray(plan?.brandMoments) ? plan.brandMoments : [];
if (plan?.currentNewsBrandStory === true && brandMoments.length < 1) fail('current-news branded reel needs at least one brandMoment.');
const allowedBrandStrategies = new Set(['OFFICIAL_LOGO','OFFICIAL_PRODUCT_UI','OFFICIAL_SOURCE_CROP','TYPOGRAPHIC_NAME']);
for (const [index, item] of brandMoments.entries()) {
  if (!String(item?.brand || '').trim()) fail(`brandMoments[${index}] missing brand.`);
  if (!allowedBrandStrategies.has(String(item?.strategy || ''))) fail(`brandMoments[${index}] has unsupported strategy.`);
  if (item?.genericIconAsBrand !== false) fail(`brandMoments[${index}] must set genericIconAsBrand=false.`);
  if (!String(item?.sceneId || '').trim()) fail(`brandMoments[${index}] missing sceneId.`);
}

// Official proof.
const proof = Array.isArray(plan?.realProofMoments) ? plan.realProofMoments : [];
if (plan?.currentNewsBrandStory === true && proof.length < 1) fail('current-news branded reel needs at least one realProofMoment.');
for (const [index, item] of proof.entries()) {
  if (!String(item?.sceneId || '').trim()) fail(`realProofMoments[${index}] missing sceneId.`);
  if (!String(item?.sourceUrl || '').startsWith('http')) fail(`realProofMoments[${index}] needs sourceUrl.`);
  if (!['OFFICIAL_SOURCE_CROP','OFFICIAL_PRODUCT_UI','OFFICIAL_DOCUMENT'].includes(String(item?.type || ''))) fail(`realProofMoments[${index}] has unsupported type.`);
  if (item?.remoteRenderAllowed !== false) fail(`realProofMoments[${index}] must set remoteRenderAllowed=false.`);
}

// Real-media mix: normally at least two purposeful real/official moments.
const mediaMix = plan?.realMediaMix || {};
const mediaMoments = Array.isArray(mediaMix?.moments) ? mediaMix.moments : [];
const minMedia = Number(mediaMix?.minimumMoments);
if (!Number.isFinite(minMedia) || minMedia < 2) fail('realMediaMix.minimumMoments must be at least 2.');
const allowedMediaTypes = new Set(['OFFICIAL_LOGO','OFFICIAL_WORDMARK','OFFICIAL_PRODUCT_UI','OFFICIAL_SOURCE_CROP','REAL_IMAGE','REAL_VIDEO']);
for (const [index, item] of mediaMoments.entries()) {
  if (!String(item?.sceneId || '').trim()) fail(`realMediaMix.moments[${index}] missing sceneId.`);
  if (!allowedMediaTypes.has(String(item?.type || ''))) fail(`realMediaMix.moments[${index}] has unsupported type.`);
  if (!String(item?.purpose || '').trim()) fail(`realMediaMix.moments[${index}] missing purpose.`);
  if (item?.remoteRenderAllowed !== false) fail(`realMediaMix.moments[${index}] must set remoteRenderAllowed=false.`);
}
const mediaException = String(mediaMix?.exceptionReason || '').trim();
if (mediaMoments.length < minMedia && !mediaException) fail(`realMediaMix needs at least ${minMedia} planned moments or exceptionReason.`);
if (mediaMix?.videoPreferredWhenMotionIsClaim !== true) fail('realMediaMix.videoPreferredWhenMotionIsClaim must be true.');

// Semantic reveal timing.
const reveals = Array.isArray(plan?.majorReveals) ? plan.majorReveals : [];
if (reveals.length < 4) fail('majorReveals needs at least four semantic reveal anchors.');
for (const [index, item] of reveals.entries()) {
  if (!String(item?.sceneId || '').trim() || !String(item?.sentenceId || '').trim()) fail(`majorReveals[${index}] needs sceneId + sentenceId.`);
  if (!String(item?.anchorPhrase || '').trim()) fail(`majorReveals[${index}] needs anchorPhrase.`);
  const fallback = Number(item?.fallbackProgress);
  if (!Number.isFinite(fallback) || fallback < 0 || fallback > 1) fail(`majorReveals[${index}] fallbackProgress must be 0..1.`);
}
if (String(plan?.timingAuthority || '') !== 'WORD_TIMINGS_AFTER_FORCED_ALIGNMENT') fail('timingAuthority must be WORD_TIMINGS_AFTER_FORCED_ALIGNMENT.');

// Motion grammar.
const families = Array.isArray(plan?.motionFamilies) ? plan.motionFamilies.map(String).filter(Boolean) : [];
if (new Set(families).size < 5) fail('at least five unique motionFamilies required.');
if (Number(plan?.maxConsecutiveSameMajorGrammar) > 2 || Number(plan?.maxConsecutiveSameMajorGrammar) < 1) fail('maxConsecutiveSameMajorGrammar must be 1 or 2.');
const fullFrame = Array.isArray(plan?.fullFrameSceneIds) ? plan.fullFrameSceneIds.filter(Boolean) : [];
if (fullFrame.length < 1) fail('at least one fullFrameSceneId required.');

// Scene density.
const density = plan?.sceneDensity || {};
const targetMin = Number(density?.targetMeaningfulChangeSecondsMin);
const targetMax = Number(density?.targetMeaningfulChangeSecondsMax);
const maxUnchanged = Number(density?.maxPracticallyUnchangedSeconds);
if (!Number.isFinite(targetMin) || targetMin < 1 || targetMin > 2) fail('sceneDensity.targetMeaningfulChangeSecondsMin must be 1..2.');
if (!Number.isFinite(targetMax) || targetMax < 2 || targetMax > 3.5 || targetMax <= targetMin) fail('sceneDensity.targetMeaningfulChangeSecondsMax must be > min and <= 3.5.');
if (!Number.isFinite(maxUnchanged) || maxUnchanged > 4 || maxUnchanged < targetMax) fail('sceneDensity.maxPracticallyUnchangedSeconds must be between target max and 4.0.');
if (density?.hardCutRequiredEveryChange !== false) fail('sceneDensity.hardCutRequiredEveryChange must be false.');

// Overlap discipline.
const overlap = plan?.overlapPolicy || {};
if (overlap?.onePrimaryFocusAtATime !== true) fail('overlapPolicy.onePrimaryFocusAtATime must be true.');
const supporting = Number(overlap?.maxSupportingDetails);
if (!Number.isFinite(supporting) || supporting < 0 || supporting > 2) fail('overlapPolicy.maxSupportingDetails must be 0..2.');
if (overlap?.captionMayCoverCriticalVisual !== false) fail('overlapPolicy.captionMayCoverCriticalVisual must be false.');
if (overlap?.progressiveRevealRequired !== true) fail('overlapPolicy.progressiveRevealRequired must be true.');

// Caption/readability.
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
console.log(`cover candidate: frame ${candidateFrame}, hold ${holdFrames} frames, export @ ${coverTime}s`);
console.log(`brand moments: ${brandMoments.length}`);
console.log(`real proof moments: ${proof.length}`);
console.log(`real/official media moments: ${mediaMoments.length}`);
console.log(`major reveal anchors: ${reveals.length}`);
console.log(`motion families: ${new Set(families).size}`);
console.log(`full-frame scenes: ${fullFrame.length}`);
console.log(`scene density target: ${targetMin}-${targetMax}s, max unchanged ${maxUnchanged}s`);
console.log('timing authority: WORD_TIMINGS_AFTER_FORCED_ALIGNMENT');
