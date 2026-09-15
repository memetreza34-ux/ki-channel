#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/sync-reel-sfx-to-captions.mjs <reel-package-dir>');
  process.exit(1);
}

const fail = (message) => {
  console.error(`SFX CAPTION SYNC FAILED: ${message}`);
  process.exit(1);
};

const reelDir = path.resolve(rawReelDir);
const reelPath = path.join(reelDir, '06-projektdateien', 'reel.json');
if (!existsSync(reelPath)) fail(`reel.json missing: ${reelPath}`);
const reel = JSON.parse(await readFile(reelPath, 'utf8'));
const captionsPath = path.resolve(reelDir, reel?.captions?.file || '03-caption/subtitle-cues.json');
const eventsPath = path.resolve(reelDir, reel?.sfx?.eventsFile || '06-projektdateien/sfx-events.json');
if (!existsSync(captionsPath)) fail(`caption file missing: ${captionsPath}`);
if (!existsSync(eventsPath)) fail(`SFX event file missing: ${eventsPath}`);

const captions = JSON.parse(await readFile(captionsPath, 'utf8'));
const semantic = JSON.parse(await readFile(eventsPath, 'utf8'));
const cues = Array.isArray(captions?.cues) ? captions.cues : [];
const scenes = Array.isArray(reel?.scenes) ? reel.scenes : [];
const events = Array.isArray(semantic?.events) ? semantic.events : [];
if (!cues.length) fail('caption file contains no cues.');
if (!events.length) fail('SFX event file contains no events.');

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
let syncedCount = 0;
const syncedEvents = events.map((event) => {
  const sync = event?.sync;
  if (!sync) return event;
  if (sync.type !== 'SENTENCE_PROGRESS') fail(`${event.id}: unsupported sync type ${sync.type}.`);
  const sentenceId = String(sync.sentenceId || '').trim();
  if (!sentenceId) fail(`${event.id}: sync.sentenceId missing.`);
  const scene = scenes.find((item) => item.sceneId === event.sceneId);
  if (!scene) fail(`${event.id}: unknown sceneId ${event.sceneId}.`);
  const matches = cues.filter((cue) => cue.sceneId === event.sceneId && cue.sentenceId === sentenceId);
  if (!matches.length) fail(`${event.id}: no caption cues found for ${sentenceId} in ${event.sceneId}.`);
  const sentenceStart = Math.min(...matches.map((cue) => Number(cue.startFrame)));
  const sentenceEnd = Math.max(...matches.map((cue) => Number(cue.endFrame)));
  if (!Number.isFinite(sentenceStart) || !Number.isFinite(sentenceEnd) || sentenceEnd <= sentenceStart) fail(`${event.id}: invalid caption range for ${sentenceId}.`);
  const progress = clamp(Number(sync.progress ?? 0), 0, 1);
  const offsetFrames = Math.round(Number(sync.offsetFrames ?? 0));
  const absoluteFrame = Math.round(sentenceStart + (sentenceEnd - sentenceStart) * progress) + offsetFrames;
  const localFrame = absoluteFrame - Number(scene.startFrame);
  const maxLocal = Number(scene.endFrame) - Number(scene.startFrame) - 1;
  if (!Number.isFinite(localFrame) || localFrame < 0 || localFrame > maxLocal) fail(`${event.id}: synced frame ${absoluteFrame} falls outside ${event.sceneId}.`);
  syncedCount += 1;
  return {
    ...event,
    anchor: {type: 'SCENE_OFFSET', frame: localFrame},
    sync: {
      ...sync,
      progress,
      offsetFrames,
      resolvedAbsoluteFrame: absoluteFrame,
      resolvedSceneOffsetFrame: localFrame,
    },
  };
});

const statusText = String(captions?.status || '').toUpperCase();
const finalish = /VOICE|ALIGN|FINAL|LOCK/.test(statusText) && !statusText.includes('REQUIRED') && !statusText.includes('PREVIEW');
const payload = {
  ...semantic,
  status: finalish ? 'VOICE_SYNCED_TO_CAPTIONS' : 'PREVIEW_SYNCED_TO_CAPTIONS_ALIGNMENT_REQUIRED',
  captionSync: {
    sourceFile: path.relative(reelDir, captionsPath).split(path.sep).join('/'),
    sourceStatus: captions?.status || null,
    syncedEvents: syncedCount,
    rule: 'SENTENCE_PROGRESS_TO_SCENE_OFFSET',
    finalVoiceTimingRequiredBeforeProductionResolution: true,
  },
  events: syncedEvents,
};

await writeFile(eventsPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log('SFX CAPTION SYNC: PASSED');
console.log(`synced events: ${syncedCount}/${events.length}`);
console.log(`caption status: ${captions?.status || 'unknown'}`);
console.log(`event status: ${payload.status}`);
console.log('Next after final forced alignment: run this sync again, then resolve-reel-sfx.mjs.');
