#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {createReadStream, existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';

const [rawReelDir, rawVideo] = process.argv.slice(2);
if (!rawReelDir || !rawVideo) {
  console.error('Usage: node ki/scripts/validate-motion-readability-review.mjs <reel-package-dir> <reviewed-video.mp4>');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const video = path.resolve(rawVideo);
const review = path.join(reelDir, '06-projektdateien', 'MOTION-READABILITY-REVIEW.md');
const reelPath = path.join(reelDir, '06-projektdateien', 'reel.json');
const fail = (message) => { console.error(`MOTION READABILITY GATE FAILED: ${message}`); process.exit(1); };

if (!existsSync(review)) fail(`missing ${review}`);
if (!existsSync(reelPath)) fail(`missing ${reelPath}`);
if (!existsSync(video)) fail(`reviewed video missing: ${video}`);

const reviewText = await readFile(review, 'utf8');
let reel;
try { reel = JSON.parse(await readFile(reelPath, 'utf8')); }
catch (error) { fail(`invalid reel.json: ${error.message}`); }

const get = (key) => {
  const match = reviewText.match(new RegExp(`^${key}:\\s*(.+)$`, 'mi'));
  return match?.[1]?.trim() ?? null;
};
const requirePass = (key, reason) => {
  if (get(key) !== 'PASS') fail(`${key} must be PASS${reason ? ` (${reason})` : ''}.`);
};

requirePass('STATUS');
requirePass('LIGHT_FIRST');
requirePass('POST_RENDER_1X_REVIEW', 'the exact mastered MP4 must be watched at 1x');
requirePass('CAPTION_SYNC_1X_REVIEW', 'caption/voice sync must be checked on the mastered MP4');
requirePass('CAMERA_EFFECTS_1X_REVIEW', 'zoom/pan/focus/parallax/scan must remain readable and purposeful');
requirePass('AUDIO_MIX_1X_REVIEW', 'voice and total social mix must be listened to');

if (reel?.sfx?.enabled === true) {
  requirePass('SFX_1X_REVIEW', 'enabled SFX must actually be listened to');
  requirePass('VOICE_PRIORITY_OVER_SFX', 'SFX may not mask the voiceover');
}
if (reel?.visuals?.enabled === true) {
  requirePass('VISUAL_ASSETS_1X_REVIEW', 'resolved external/source visuals must be checked for relevance, crop and readability');
}
if (reel?.storytelling?.enabled === true) {
  requirePass('STORY_FLOW_1X_REVIEW', 'the mastered Reel must feel like a coherent visual story rather than a slide deck');
  requirePass('VISUAL_REACTION_1X_REVIEW', 'core spoken claims must visibly trigger meaningful visual reactions');
  requirePass('TRANSITIONS_PURPOSE_1X_REVIEW', 'scene/subscene transitions must feel motivated rather than decorative');
  const staticViolations = Number(get('STATIC_STATE_OVER_LIMIT_VIOLATIONS'));
  if (!Number.isFinite(staticViolations) || staticViolations !== 0) fail('STATIC_STATE_OVER_LIMIT_VIOLATIONS must be 0 for storytelling-enabled reels.');
}

const publishDate = String(reel?.publishDate || '');
const levelUpEnabled = reel?.levelUp?.enabled === true || (/^\d{4}-\d{2}-\d{2}$/.test(publishDate) && publishDate >= '2026-09-01');
const levelUpV3 = Number(reel?.levelUp?.standardVersion) >= 3 || (/^\d{4}-\d{2}-\d{2}$/.test(publishDate) && publishDate >= '2026-09-03');
const levelUpV4 = Number(reel?.levelUp?.standardVersion) >= 4 || (/^\d{4}-\d{2}-\d{2}$/.test(publishDate) && publishDate >= '2026-09-05');
if (levelUpEnabled) {
  requirePass('COVER_FRAME_READY', 'a finished cover candidate must exist inside the first second');
  requirePass('COVER_FRAME_CLEAN', 'cover must be caption-free, readable and screenshot-ready');
  requirePass('BRAND_FIDELITY', 'central named brands/products must be visually recognizable');
  requirePass('REAL_PROOF_MOMENT', 'at least one useful real official proof moment must be visible where planned');
  requirePass('REAL_MEDIA_MIX', 'planned real/official media moments must materially appear or have an approved exception');
  requirePass('NO_FAKE_BRAND_ICON', 'generic functional icons may not impersonate brands');
  requirePass('WORD_LOCKED_MAJOR_REVEALS', 'major names/dates/numbers/states must land with the spoken phrase');
  requirePass('SCENE_DENSITY', 'active voiceover should meaningfully develop roughly every 1.5–3 seconds without frantic cutting');
  requirePass('NO_VISUAL_OVERLAP', 'one primary focus at a time; captions and critical visuals must not collide');
  requirePass('MOTION_GRAMMAR_DIVERSITY', 'major beats must use varied meaningful motion families');
  requirePass('NO_CARD_DECK_FEEL', 'reel must not read like stacked presentation cards');
  requirePass('FULL_VERTICAL_STAGE_USE', 'usable 9:16 stage should be intentionally occupied');
  requirePass('MICRODETAILS_PHONE_READABLE', 'important dates/status/source labels must remain phone-readable');
  requirePass('SFX_SEMANTIC_DENSITY', 'sound density must follow visible semantic event density');
}
if (levelUpV3) {
  requirePass('BRAND_RECOGNIZABLE_WITHOUT_CAPTION', 'the primary brand/product should be visually recognizable even without reading captions');
  requirePass('PRIMARY_BRAND_REAPPEARS', 'a central brand must not exist only in the opening hook');
  requirePass('REAL_BRAND_ASSET_USED_OR_EXCEPTION', 'use a genuine logo/wordmark/product-UI moment or explicitly approved exception');
  requirePass('REAL_MEDIA_NOT_JUST_SOURCE_CARDS', 'real-media mix must include genuine UI/image/video, not only homemade source cards');
  requirePass('VISUAL_WORLD_VARIETY', 'the reel must contain multiple clearly distinct visual worlds/grammars');
  requirePass('MID_REEL_REFRAMES', 'the middle of the reel must contain planned visual-world/reframe breaks');
}
if (levelUpV4) {
  requirePass('BRAND_ASSET_VISIBLE_OR_JUSTIFIED', 'planned official/local brand media must actually be visible or have a legitimate documented exception');
  requirePass('BRAND_COLOR_COHERENCE', 'scene palettes must remain coherent with the planned brand/reference palette');
  requirePass('FUNCTIONAL_ICONS_ARE_NOT_FAKE_LOGOS', 'functional icons must remain clearly separate from brand identity');
  requirePass('MOTION_NOT_TEMPLATE_LOCKED', 'animation should not appear constrained to a repetitive template grammar');
  requirePass('ANIMATION_TECHNIQUE_FITS_STORY', 'new or existing motion techniques must serve story/clarity/payoff rather than novelty');
  requirePass('NO_ACCIDENTAL_COLOR_DRIFT', 'off-brand color changes must be intentional semantic choices, not accidental drift');
  requirePass('REAL_MEDIA_MATERIALIZED_OR_JUSTIFIED', 'planned real/official media must be materialized locally or have an approved exception');
}

const darkScenes = Number(get('DARK_FULL_FRAME_SCENES'));
if (!Number.isFinite(darkScenes) || darkScenes < 0) fail('DARK_FULL_FRAME_SCENES must be a non-negative number.');
const darkApproved = get('DARK_EXCEPTION_APPROVED');
if (darkScenes > 0 && darkApproved !== 'YES') fail('dark fullscreen scenes require DARK_EXCEPTION_APPROVED: YES.');
if (darkScenes > 0 && !get('DARK_EXCEPTION_REASON')) fail('dark fullscreen exception requires DARK_EXCEPTION_REASON.');
if (darkScenes === 0 && darkApproved !== 'NO') fail('with zero dark fullscreen scenes, DARK_EXCEPTION_APPROVED must be NO.');

const fast = Number(get('TOO_FAST_BEATS'));
if (!Number.isFinite(fast) || fast !== 0) fail('TOO_FAST_BEATS must be 0.');
const overloads = Number(get('SIMULTANEOUS_INFO_OVERLOADS'));
if (!Number.isFinite(overloads) || overloads !== 0) fail('SIMULTANEOUS_INFO_OVERLOADS must be 0.');
const minHold = Number(get('MIN_CRITICAL_HOLD_FRAMES'));
if (!Number.isFinite(minHold) || minHold < 12) fail('MIN_CRITICAL_HOLD_FRAMES must be at least 12 at 30 fps.');

const expectedHash = get('REVIEWED_VIDEO_SHA256');
if (!expectedHash || !/^[a-f0-9]{64}$/i.test(expectedHash)) fail('REVIEWED_VIDEO_SHA256 must contain the exact reviewed MP4 hash.');

const hash = createHash('sha256');
await new Promise((resolve, reject) => {
  const stream = createReadStream(video);
  stream.on('data', (chunk) => hash.update(chunk));
  stream.on('end', resolve);
  stream.on('error', reject);
});
const actualHash = hash.digest('hex');
if (actualHash.toLowerCase() !== expectedHash.toLowerCase()) fail('review file belongs to a different MP4/source render (SHA256 mismatch).');

const probe = spawnSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',video],{encoding:'utf8'});
if (probe.error) fail(`ffprobe could not start: ${probe.error.message}`);
if (probe.status !== 0) fail(`ffprobe failed: ${probe.stderr || probe.stdout}`);
const actualDuration = Number(probe.stdout.trim());
const reviewedDuration = Number(get('REVIEWED_VIDEO_DURATION_SECONDS'));
if (!Number.isFinite(reviewedDuration) || reviewedDuration <= 0) fail('REVIEWED_VIDEO_DURATION_SECONDS missing/invalid.');
if (!Number.isFinite(actualDuration) || Math.abs(actualDuration-reviewedDuration) > 0.12) fail(`reviewed duration ${reviewedDuration}s does not match MP4 ${actualDuration}s.`);

console.log('MOTION READABILITY GATE PASSED');
console.log(`review: ${review}`);
console.log(`video: ${video}`);
console.log(`sha256: ${actualHash}`);
console.log(`duration: ${actualDuration.toFixed(3)} s`);
console.log(`dark fullscreen scenes: ${darkScenes}`);
console.log(`minimum critical hold: ${minHold} frames`);
console.log(`SFX review: ${reel?.sfx?.enabled === true ? 'required + passed' : 'not applicable'}`);
console.log(`visual asset review: ${reel?.visuals?.enabled === true ? 'required + passed' : 'not applicable'}`);
console.log(`storytelling review: ${reel?.storytelling?.enabled === true ? 'required + passed' : 'not applicable'}`);
console.log(`Level-Up review: ${levelUpEnabled ? (levelUpV4 ? 'v4 required + passed' : levelUpV3 ? 'v3 required + passed' : 'v2 required + passed') : 'not applicable'}`);
