#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/resolve-reel-sfx.mjs <reel-package-dir>');
  process.exit(1);
}

const fail = (message) => {
  console.error(`SFX AUTO-RESOLUTION FAILED: ${message}`);
  process.exit(1);
};
const reelDir = path.resolve(rawReelDir);
const reelPath = path.join(reelDir, '06-projektdateien', 'reel.json');
if (!existsSync(reelPath)) fail(`reel.json missing: ${reelPath}`);

let reel;
try { reel = JSON.parse(await readFile(reelPath, 'utf8')); }
catch (error) { fail(`invalid reel.json: ${error.message}`); }

if (reel?.sfx?.enabled !== true) {
  console.log('SFX AUTO-RESOLUTION: SKIPPED (reel.sfx.enabled !== true)');
  process.exit(0);
}

const fps = Number(reel?.format?.fps);
const finalDuration = Number(reel?.format?.finalDurationInFrames);
if (!Number.isFinite(fps) || fps <= 0) fail('format.fps missing/invalid.');
if (!Number.isFinite(finalDuration) || finalDuration <= 0) {
  fail('final scene timing is not locked yet. Run align-reel-local.mjs first so SFX can follow the real scene frames.');
}

const scenes = Array.isArray(reel?.scenes) ? reel.scenes : [];
if (!scenes.length) fail('reel.json scenes missing.');
for (const scene of scenes) {
  if (!scene?.sceneId || !Number.isFinite(scene.startFrame) || !Number.isFinite(scene.endFrame) || scene.endFrame <= scene.startFrame) {
    fail(`scene timing is not locked for ${scene?.sceneId || 'unknown scene'}.`);
  }
}

const eventsRelative = reel?.sfx?.eventsFile || '06-projektdateien/sfx-events.json';
const resolvedRelative = reel?.sfx?.resolvedFile || '06-projektdateien/sfx-resolved.json';
const eventsPath = path.resolve(reelDir, eventsRelative);
const resolvedPath = path.resolve(reelDir, resolvedRelative);
if (!existsSync(eventsPath)) fail(`semantic SFX event file missing: ${eventsPath}`);

let semantic;
try { semantic = JSON.parse(await readFile(eventsPath, 'utf8')); }
catch (error) { fail(`invalid semantic SFX event file: ${error.message}`); }
const events = Array.isArray(semantic?.events) ? semantic.events : [];
if (!events.length) fail('semantic SFX event file contains no events.');

const indexPath = path.resolve(reel?.sfx?.libraryIndex || 'public/reel-sfx/sfx-index.json');
const run = (label, command, args) => {
  const result = spawnSync(command, args, {encoding: 'utf8', stdio: 'inherit'});
  if (result.error || result.status !== 0) fail(`${label} failed${result.error ? `: ${result.error.message}` : ''}.`);
};
if (!existsSync(indexPath)) {
  console.log('Local CC0 SFX library is missing; running one-time setup.');
  run('SFX library setup', process.execPath, [path.resolve('ki/scripts/setup-reel-sfx-library.mjs')]);
}
if (!existsSync(indexPath)) fail(`SFX library index still missing after setup: ${indexPath}`);

let index;
try { index = JSON.parse(await readFile(indexPath, 'utf8')); }
catch (error) { fail(`invalid SFX library index: ${error.message}`); }
if (index?.status !== 'LOCAL_CC0_SFX_LIBRARY_READY') fail('SFX library is not in LOCAL_CC0_SFX_LIBRARY_READY state.');
const libraryItems = Array.isArray(index?.items) ? index.items : [];
if (!libraryItems.length) fail('SFX library contains no indexed items.');

const normalize = (value) => String(value ?? '')
  .normalize('NFKC')
  .toLocaleLowerCase('en-US')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();
const hashFloat = (value) => {
  const hex = createHash('sha256').update(String(value)).digest('hex').slice(0, 8);
  return Number.parseInt(hex, 16) / 0xffffffff;
};
const sha256Text = (value) => createHash('sha256').update(value).digest('hex');

const roleFamily = (role) => {
  const r = String(role || '');
  if (r.startsWith('ui-')) return 'ui';
  if (r.includes('impact')) return 'impact';
  if (r.includes('transition')) return 'transition';
  if (r.includes('tech') || r.includes('digital')) return 'tech';
  return r || 'generic';
};
const maxVolumeForRole = (role) => {
  const family = roleFamily(role);
  if (family === 'impact') return 0.20;
  if (family === 'ui') return 0.14;
  if (family === 'tech') return 0.12;
  if (family === 'transition') return 0.10;
  return 0.10;
};

const resolveFrame = (event) => {
  const scene = scenes.find((item) => item.sceneId === event.sceneId);
  if (!scene) fail(`${event.id}: unknown sceneId ${event.sceneId}.`);
  const anchor = event?.anchor || {};
  let frame;
  if (anchor.type === 'SCENE_OFFSET') {
    const offset = Number(anchor.frame);
    if (!Number.isFinite(offset) || offset < 0) fail(`${event.id}: invalid SCENE_OFFSET frame.`);
    frame = scene.startFrame + Math.round(offset);
  } else if (anchor.type === 'SCENE_END_OFFSET') {
    const offset = Number(anchor.frame);
    if (!Number.isFinite(offset) || offset > 0) fail(`${event.id}: SCENE_END_OFFSET must be <= 0.`);
    frame = scene.endFrame + Math.round(offset);
  } else if (anchor.type === 'ABSOLUTE') {
    frame = Math.round(Number(anchor.frame));
  } else {
    fail(`${event.id}: unsupported anchor type ${anchor.type ?? 'missing'}.`);
  }
  if (!Number.isFinite(frame) || frame < scene.startFrame || frame >= scene.endFrame || frame < 0 || frame >= finalDuration) {
    fail(`${event.id}: resolved frame ${frame} is outside ${event.sceneId} (${scene.startFrame}-${scene.endFrame}).`);
  }
  return frame;
};

const used = new Set();
const resolvedEvents = [];
for (const event of events) {
  if (!event?.id || !event?.sceneId) fail('every SFX event needs id + sceneId.');
  const roles = Array.isArray(event.roles) ? event.roles.filter(Boolean) : [];
  if (!roles.length) fail(`${event.id}: at least one role is required.`);
  const keywords = Array.isArray(event.keywords) ? event.keywords.map(normalize).filter(Boolean) : [];
  const preferredDuration = Number(event.preferredDurationSeconds || 0.25);
  if (!Number.isFinite(preferredDuration) || preferredDuration <= 0 || preferredDuration > 2.5) fail(`${event.id}: preferredDurationSeconds invalid.`);

  const ranked = libraryItems
    .filter((item) => item?.license === 'CC0-1.0' && item?.staticFile && item?.runtimeFile && existsSync(path.resolve(item.runtimeFile)))
    .map((item) => {
      const role = String(item.role || 'generic');
      const roleIndex = roles.indexOf(role);
      const familyIndex = roles.findIndex((wanted) => roleFamily(wanted) === roleFamily(role));
      if (roleIndex < 0 && familyIndex < 0) return null;

      const haystack = normalize(`${item.id} ${item.originalFile} ${item.packId} ${role}`);
      let score = roleIndex >= 0 ? 500 - roleIndex * 35 : 290 - familyIndex * 20;
      for (const keyword of keywords) if (haystack.includes(keyword)) score += 28;
      const duration = Number(item.durationSeconds || 0);
      if (!Number.isFinite(duration) || duration <= 0) return null;
      const durationDelta = Math.abs(duration - preferredDuration);
      score += Math.max(0, 110 - durationDelta * 90);
      if (duration > 2.2) score -= 100;
      if (used.has(item.id)) score -= 180;
      score += hashFloat(`${reel.reelId}:${event.id}:${item.id}`) * 0.01;
      return {item, score, durationDelta};
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.durationDelta - b.durationDelta || a.item.id.localeCompare(b.item.id));

  if (!ranked.length) fail(`${event.id}: no usable CC0 candidate found for roles ${roles.join(', ')}.`);
  const winner = ranked[0].item;
  used.add(winner.id);

  const startFrame = resolveFrame(event);
  const rawDurationFrames = Math.max(1, Math.ceil(Number(winner.durationSeconds) * fps));
  const durationInFrames = Math.min(rawDurationFrames, finalDuration - startFrame);
  const requestedVolume = Number(event.volume ?? 0.1);
  if (!Number.isFinite(requestedVolume) || requestedVolume <= 0) fail(`${event.id}: volume must be > 0.`);
  const safeVolume = Math.min(requestedVolume, maxVolumeForRole(winner.role));

  resolvedEvents.push({
    id: event.id,
    sceneId: event.sceneId,
    purpose: String(event.purpose || ''),
    startFrame,
    durationInFrames,
    volume: Number(safeVolume.toFixed(3)),
    requestedRoles: roles,
    selectedRole: winner.role,
    soundId: winner.id,
    staticFile: winner.staticFile,
    durationSeconds: winner.durationSeconds,
    packId: winner.packId,
    creator: winner.creator,
    license: winner.license,
    officialUrl: winner.officialUrl,
    originalFile: winner.originalFile,
  });
}

resolvedEvents.sort((a, b) => a.startFrame - b.startFrame || a.id.localeCompare(b.id));
for (let i = 1; i < resolvedEvents.length; i++) {
  const prev = resolvedEvents[i - 1];
  const current = resolvedEvents[i];
  if (current.startFrame - prev.startFrame < 4 && current.sceneId === prev.sceneId) {
    fail(`${current.id}: SFX events are too dense (${current.startFrame - prev.startFrame} frames after ${prev.id}).`);
  }
}

const eventsRaw = await readFile(eventsPath, 'utf8');
const indexRaw = await readFile(indexPath, 'utf8');
const payload = {
  version: 1,
  status: 'SFX_RESOLVED_CC0_AUTO',
  selectionMode: 'DETERMINISTIC_ROLE_KEYWORD_DURATION_RANKING',
  compositionId: reel.compositionId,
  fps,
  finalDurationInFrames: finalDuration,
  generatedAt: new Date().toISOString(),
  library: {
    status: index.status,
    totalSounds: index.totalSounds,
    mirror: index.mirror,
    indexSha256: sha256Text(indexRaw),
  },
  sourceEventsSha256: sha256Text(eventsRaw),
  rules: {
    license: 'CC0-1.0_ONLY',
    randomness: false,
    soundReusePenalty: true,
    sceneAnchorsFollowFinalSceneFrames: true,
    voiceFirstVolumeCaps: true,
  },
  events: resolvedEvents,
};
await writeFile(resolvedPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log('SFX AUTO-RESOLUTION: PASSED');
console.log(`events: ${resolvedEvents.length}`);
console.log(`library candidates: ${libraryItems.length}`);
console.log(`resolved: ${resolvedPath}`);
for (const event of resolvedEvents) {
  console.log(`- ${event.id} @ ${event.startFrame}f -> ${event.soundId} (${event.selectedRole}, vol ${event.volume})`);
}
