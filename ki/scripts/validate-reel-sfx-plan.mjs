#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/validate-reel-sfx-plan.mjs <reel-package-dir>');
  process.exit(1);
}

const fail = (message) => {
  console.error(`SFX PLAN GATE FAILED: ${message}`);
  process.exit(1);
};
const reelDir = path.resolve(rawReelDir);
const reelPath = path.join(reelDir, '06-projektdateien', 'reel.json');
if (!existsSync(reelPath)) fail(`reel.json missing: ${reelPath}`);

let reel;
try { reel = JSON.parse(await readFile(reelPath, 'utf8')); }
catch (error) { fail(`invalid reel.json: ${error.message}`); }

if (reel?.sfx?.enabled !== true) {
  console.log('SFX PLAN GATE: SKIPPED (SFX disabled)');
  process.exit(0);
}

const finalDuration = Number(reel?.format?.finalDurationInFrames);
if (!Number.isFinite(finalDuration) || finalDuration <= 0) fail('finalDurationInFrames must be locked before SFX validation.');

const eventsRelative = reel?.sfx?.eventsFile || '06-projektdateien/sfx-events.json';
const resolvedRelative = reel?.sfx?.resolvedFile || '06-projektdateien/sfx-resolved.json';
const eventsPath = path.resolve(reelDir, eventsRelative);
const resolvedPath = path.resolve(reelDir, resolvedRelative);
const indexPath = path.resolve(reel?.sfx?.libraryIndex || 'public/reel-sfx/sfx-index.json');
for (const file of [eventsPath, resolvedPath, indexPath]) if (!existsSync(file)) fail(`missing required SFX file: ${file}`);

const semantic = JSON.parse(await readFile(eventsPath, 'utf8'));
const resolved = JSON.parse(await readFile(resolvedPath, 'utf8'));
const index = JSON.parse(await readFile(indexPath, 'utf8'));
const issues = [];

if (resolved.status !== 'SFX_RESOLVED_CC0_AUTO') issues.push(`resolved status is ${resolved.status ?? 'missing'}, expected SFX_RESOLVED_CC0_AUTO`);
if (resolved.selectionMode !== 'DETERMINISTIC_ROLE_KEYWORD_DURATION_RANKING') issues.push('unexpected SFX selectionMode');
if (resolved?.rules?.license !== 'CC0-1.0_ONLY') issues.push('resolved SFX plan is not CC0-only');
if (resolved?.rules?.randomness !== false) issues.push('SFX plan must be deterministic');
if (index?.status !== 'LOCAL_CC0_SFX_LIBRARY_READY') issues.push('local SFX library index is not ready');

const wanted = Array.isArray(semantic?.events) ? semantic.events : [];
const actual = Array.isArray(resolved?.events) ? resolved.events : [];
if (!wanted.length) issues.push('semantic SFX plan contains no events');
if (actual.length !== wanted.length) issues.push(`resolved SFX event count ${actual.length} != semantic ${wanted.length}`);

const semanticById = new Map(wanted.map((event) => [event.id, event]));
const seenIds = new Set();
const libraryById = new Map((Array.isArray(index?.items) ? index.items : []).map((item) => [item.id, item]));
const starts = [];

for (const event of actual) {
  if (!event?.id || seenIds.has(event.id)) issues.push(`missing/duplicate resolved event id: ${event?.id ?? 'missing'}`);
  seenIds.add(event.id);
  const sourceEvent = semanticById.get(event.id);
  if (!sourceEvent) issues.push(`${event.id}: no matching semantic event`);
  if (event.license !== 'CC0-1.0') issues.push(`${event.id}: license is not CC0-1.0`);
  if (!Number.isFinite(event.startFrame) || event.startFrame < 0 || event.startFrame >= finalDuration) issues.push(`${event.id}: startFrame invalid`);
  if (!Number.isFinite(event.durationInFrames) || event.durationInFrames <= 0 || event.startFrame + event.durationInFrames > finalDuration) issues.push(`${event.id}: duration invalid/outside composition`);
  if (!Number.isFinite(event.volume) || event.volume <= 0 || event.volume > 0.20) issues.push(`${event.id}: volume ${event.volume} outside voice-first cap`);
  if (!event.staticFile || !existsSync(path.resolve('public', event.staticFile))) issues.push(`${event.id}: runtime SFX file missing: ${event.staticFile}`);
  const libraryItem = libraryById.get(event.soundId);
  if (!libraryItem) issues.push(`${event.id}: selected soundId not present in current library index`);
  else {
    if (libraryItem.license !== 'CC0-1.0') issues.push(`${event.id}: indexed library item is not CC0`);
    if (libraryItem.staticFile !== event.staticFile) issues.push(`${event.id}: staticFile changed from indexed library item`);
    if (libraryItem.packId !== event.packId) issues.push(`${event.id}: packId mismatch`);
  }
  if (sourceEvent) {
    if (event.sceneId !== sourceEvent.sceneId) issues.push(`${event.id}: sceneId mismatch`);
    const requestedRoles = Array.isArray(sourceEvent.roles) ? sourceEvent.roles : [];
    const selectedFamily = String(event.selectedRole || '').split('-')[0];
    const exact = requestedRoles.includes(event.selectedRole);
    const family = requestedRoles.some((role) => String(role).split('-')[0] === selectedFamily);
    if (!exact && !family) issues.push(`${event.id}: selected role ${event.selectedRole} does not match requested roles`);
  }
  starts.push({id: event.id, sceneId: event.sceneId, frame: event.startFrame});
}

starts.sort((a, b) => a.frame - b.frame);
for (let i = 1; i < starts.length; i++) {
  const gap = starts[i].frame - starts[i - 1].frame;
  if (gap < 4 && starts[i].sceneId === starts[i - 1].sceneId) issues.push(`${starts[i].id}: SFX starts only ${gap} frames after ${starts[i - 1].id}`);
}

if (issues.length) {
  console.error('SFX PLAN GATE: FAILED');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('SFX PLAN GATE: PASSED');
console.log(`events: ${actual.length}`);
console.log('license policy: CC0-1.0 only');
console.log('selection: deterministic');
console.log('voice-first volume cap: <= 0.20');
