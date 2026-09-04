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
const fail = (message) => { console.error(`SFX PLAN GATE FAILED: ${message}`); process.exit(1); };
const reelDir = path.resolve(rawReelDir);
const reelPath = path.join(reelDir,'06-projektdateien','reel.json');
if (!existsSync(reelPath)) fail(`reel.json missing: ${reelPath}`);
const reel = JSON.parse(await readFile(reelPath,'utf8'));
if (reel?.sfx?.enabled !== true) { console.log('SFX PLAN GATE: SKIPPED (SFX disabled)'); process.exit(0); }
const finalDuration=Number(reel?.format?.finalDurationInFrames);
if (!Number.isFinite(finalDuration)||finalDuration<=0) fail('finalDurationInFrames must be locked before SFX validation.');
const eventsPath=path.resolve(reelDir,reel?.sfx?.eventsFile||'06-projektdateien/sfx-events.json');
const resolvedPath=path.resolve(reelDir,reel?.sfx?.resolvedFile||'06-projektdateien/sfx-resolved.json');
const indexPath=path.resolve(reel?.sfx?.libraryIndex||'public/reel-sfx/sfx-index.json');
for (const file of [eventsPath,resolvedPath,indexPath]) if (!existsSync(file)) fail(`missing required SFX file: ${file}`);
const semantic=JSON.parse(await readFile(eventsPath,'utf8'));
const resolved=JSON.parse(await readFile(resolvedPath,'utf8'));
const index=JSON.parse(await readFile(indexPath,'utf8'));
const issues=[];
if (resolved.status!=='SFX_RESOLVED_CC0_AUTO') issues.push('resolved status is not SFX_RESOLVED_CC0_AUTO');
if (resolved.selectionMode!=='DETERMINISTIC_ROLE_KEYWORD_DURATION_RANKING') issues.push('unexpected SFX selectionMode');
if (resolved?.rules?.license!=='CC0-1.0_ONLY') issues.push('resolved SFX plan is not CC0-only');
if (resolved?.rules?.randomness!==false) issues.push('SFX plan must be deterministic');
if (index?.status!=='LOCAL_CC0_SFX_LIBRARY_READY') issues.push('local SFX library index is not ready');
const wanted=Array.isArray(semantic?.events)?semantic.events:[];
const actual=Array.isArray(resolved?.events)?resolved.events:[];
if (!wanted.length) issues.push('semantic SFX plan contains no events');
if (actual.length!==wanted.length) issues.push(`resolved SFX event count ${actual.length} != semantic ${wanted.length}`);
const semanticById=new Map(wanted.map((event)=>[event.id,event]));
const libraryById=new Map((Array.isArray(index?.items)?index.items:[]).map((item)=>[item.id,item]));
const seen=new Set();
const starts=[];
for (const event of actual) {
  if (!event?.id||seen.has(event.id)) issues.push(`missing/duplicate event id: ${event?.id??'missing'}`);
  seen.add(event.id);
  const source=semanticById.get(event.id);
  if (!source) issues.push(`${event.id}: no semantic source event`);
  if (event.license!=='CC0-1.0') issues.push(`${event.id}: license is not CC0-1.0`);
  if (!Number.isFinite(event.startFrame)||event.startFrame<0||event.startFrame>=finalDuration) issues.push(`${event.id}: invalid startFrame`);
  if (!Number.isFinite(event.durationInFrames)||event.durationInFrames<=0||event.startFrame+event.durationInFrames>finalDuration) issues.push(`${event.id}: invalid duration`);
  if (!Number.isFinite(event.volume)||event.volume<=0||event.volume>0.20) issues.push(`${event.id}: volume outside voice-first cap`);
  if (!event.staticFile||!existsSync(path.resolve('public',event.staticFile))) issues.push(`${event.id}: runtime SFX file missing`);
  const item=libraryById.get(event.soundId);
  if (!item) issues.push(`${event.id}: soundId not found in library`);
  else {
    if (item.license!=='CC0-1.0') issues.push(`${event.id}: indexed item not CC0`);
    if (item.staticFile!==event.staticFile) issues.push(`${event.id}: staticFile mismatch`);
    if (item.packId!==event.packId) issues.push(`${event.id}: packId mismatch`);
  }
  if (source&&event.sceneId!==source.sceneId) issues.push(`${event.id}: sceneId mismatch`);
  starts.push({id:event.id,sceneId:event.sceneId,frame:event.startFrame});
}
starts.sort((a,b)=>a.frame-b.frame);
for (let i=1;i<starts.length;i++) if (starts[i].sceneId===starts[i-1].sceneId&&starts[i].frame-starts[i-1].frame<4) issues.push(`${starts[i].id}: SFX too dense`);
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
