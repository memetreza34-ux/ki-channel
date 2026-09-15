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
const fail = (message) => { console.error(`SFX AUTO-RESOLUTION FAILED: ${message}`); process.exit(1); };
const reelDir = path.resolve(rawReelDir);
const reelPath = path.join(reelDir,'06-projektdateien','reel.json');
if (!existsSync(reelPath)) fail(`reel.json missing: ${reelPath}`);
let reel;
try { reel = JSON.parse(await readFile(reelPath,'utf8')); } catch (error) { fail(`invalid reel.json: ${error.message}`); }
if (reel?.sfx?.enabled !== true) { console.log('SFX AUTO-RESOLUTION: SKIPPED (SFX disabled)'); process.exit(0); }
const fps = Number(reel?.format?.fps);
const finalDuration = Number(reel?.format?.finalDurationInFrames);
if (!Number.isFinite(fps) || fps <= 0) fail('format.fps missing/invalid.');
if (!Number.isFinite(finalDuration) || finalDuration <= 0) fail('final scene timing is not locked yet. Run align-reel-local.mjs first.');
const scenes = Array.isArray(reel?.scenes) ? reel.scenes : [];
for (const scene of scenes) if (!scene?.sceneId || !Number.isFinite(scene.startFrame) || !Number.isFinite(scene.endFrame) || scene.endFrame <= scene.startFrame) fail(`scene timing is not locked for ${scene?.sceneId || 'unknown scene'}.`);
const eventsPath = path.resolve(reelDir,reel?.sfx?.eventsFile || '06-projektdateien/sfx-events.json');
const resolvedPath = path.resolve(reelDir,reel?.sfx?.resolvedFile || '06-projektdateien/sfx-resolved.json');
if (!existsSync(eventsPath)) fail(`semantic SFX event file missing: ${eventsPath}`);
const semantic = JSON.parse(await readFile(eventsPath,'utf8'));
const events = Array.isArray(semantic?.events) ? semantic.events : [];
if (!events.length) fail('semantic SFX event file contains no events.');
const indexPath = path.resolve(reel?.sfx?.libraryIndex || 'public/reel-sfx/sfx-index.json');
const run = (label, command, args) => { const result = spawnSync(command,args,{encoding:'utf8',stdio:'inherit'}); if (result.error || result.status !== 0) fail(`${label} failed${result.error ? `: ${result.error.message}` : ''}.`); };
if (!existsSync(indexPath)) { console.log('Local CC0 SFX library missing; running one-time setup.'); run('SFX library setup',process.execPath,[path.resolve('ki/scripts/setup-reel-sfx-library.mjs')]); }
if (!existsSync(indexPath)) fail(`SFX library index missing: ${indexPath}`);
const indexRaw=await readFile(indexPath,'utf8');
const index = JSON.parse(indexRaw);
if (index?.status !== 'LOCAL_CC0_SFX_LIBRARY_READY') fail('SFX library is not ready.');
const baseItems = Array.isArray(index?.items) ? index.items : [];
if (!baseItems.length) fail('SFX library contains no items.');

let supplement = null;
let supplementRaw = null;
let supplementItems = [];
const supplementEnabled = reel?.sfx?.allowRemotionCc0Supplement === true;
const supplementIndexPath = path.resolve(reel?.sfx?.remotionCc0SupplementIndex || 'public/reel-sfx/remotion-cc0-index.json');
if (supplementEnabled) {
  if (!existsSync(supplementIndexPath)) {
    fail('Remotion CC0 supplement was explicitly enabled but its local index is missing. Run node ki/scripts/setup-remotion-cc0-sfx-supplement.mjs first.');
  }
  supplementRaw = await readFile(supplementIndexPath, 'utf8');
  supplement = JSON.parse(supplementRaw);
  if (supplement?.status !== 'LOCAL_REMOTION_CC0_SFX_SUPPLEMENT_READY') fail('Remotion CC0 supplement index is not ready.');
  if (supplement?.policy?.license !== 'CC0-1.0_ONLY') fail('Remotion CC0 supplement license policy mismatch.');
  supplementItems = Array.isArray(supplement?.items) ? supplement.items : [];
  for (const item of supplementItems) {
    if (item?.license !== 'CC0-1.0') fail(`Remotion supplement contains non-CC0 item: ${item?.id || 'unknown'}.`);
    if (!item?.runtimeFile || !existsSync(path.resolve(item.runtimeFile))) fail(`Remotion supplement runtime file missing: ${item?.id || 'unknown'}.`);
  }
}
const items = [...baseItems, ...supplementItems];

const normalize = (value) => String(value ?? '').normalize('NFKC').toLocaleLowerCase('en-US').replace(/[^a-z0-9]+/g,' ').trim();
const hashFloat = (value) => Number.parseInt(createHash('sha256').update(String(value)).digest('hex').slice(0,8),16) / 0xffffffff;
const sha256Text = (value) => createHash('sha256').update(value).digest('hex');
const family = (role) => String(role||'').startsWith('ui-') ? 'ui' : String(role||'').includes('impact') ? 'impact' : String(role||'').includes('transition') ? 'transition' : /tech|digital/.test(String(role||'')) ? 'tech' : String(role||'generic');
const maxVolume = (role) => family(role)==='impact' ? 0.20 : family(role)==='ui' ? 0.14 : family(role)==='tech' ? 0.12 : family(role)==='transition' ? 0.10 : 0.10;
const resolveFrame = (event) => {
  const scene = scenes.find((item)=>item.sceneId===event.sceneId);
  if (!scene) fail(`${event.id}: unknown sceneId ${event.sceneId}.`);
  const anchor = event?.anchor || {};
  let frame;
  if (anchor.type==='SCENE_OFFSET') frame = scene.startFrame + Math.round(Number(anchor.frame));
  else if (anchor.type==='SCENE_END_OFFSET') frame = scene.endFrame + Math.round(Number(anchor.frame));
  else if (anchor.type==='ABSOLUTE') frame = Math.round(Number(anchor.frame));
  else fail(`${event.id}: unsupported anchor type ${anchor.type ?? 'missing'}.`);
  if (!Number.isFinite(frame) || frame < scene.startFrame || frame >= scene.endFrame || frame < 0 || frame >= finalDuration) fail(`${event.id}: resolved frame ${frame} outside scene.`);
  return frame;
};
const used = new Set();
const resolvedEvents=[];
for (const event of events) {
  if (!event?.id || !event?.sceneId) fail('every SFX event needs id + sceneId.');
  const roles = Array.isArray(event.roles) ? event.roles.filter(Boolean) : [];
  if (!roles.length) fail(`${event.id}: at least one role required.`);
  const keywords = Array.isArray(event.keywords) ? event.keywords.map(normalize).filter(Boolean) : [];
  const target = Number(event.preferredDurationSeconds || 0.25);
  const ranked = items.filter((item)=>item?.license==='CC0-1.0' && item?.staticFile && item?.runtimeFile && existsSync(path.resolve(item.runtimeFile))).map((item)=>{
    const role=String(item.role||'generic');
    const exact=roles.indexOf(role);
    const fam=roles.findIndex((wanted)=>family(wanted)===family(role));
    if (exact<0 && fam<0) return null;
    const haystack=normalize(`${item.id} ${item.originalFile} ${item.packId} ${role}`);
    let score=exact>=0 ? 500-exact*35 : 290-fam*20;
    for (const keyword of keywords) if (haystack.includes(keyword)) score+=28;
    const duration=Number(item.durationSeconds||0); if (!Number.isFinite(duration)||duration<=0) return null;
    const delta=Math.abs(duration-target); score+=Math.max(0,110-delta*90); if (duration>2.2) score-=100; if (used.has(item.id)) score-=180; score+=hashFloat(`${reel.reelId}:${event.id}:${item.id}`)*0.01;
    return {item,score,delta};
  }).filter(Boolean).sort((a,b)=>b.score-a.score || a.delta-b.delta || a.item.id.localeCompare(b.item.id));
  if (!ranked.length) fail(`${event.id}: no usable CC0 candidate found.`);
  const winner=ranked[0].item; used.add(winner.id);
  const startFrame=resolveFrame(event);
  const durationInFrames=Math.min(Math.max(1,Math.ceil(Number(winner.durationSeconds)*fps)),finalDuration-startFrame);
  const requestedVolume=Number(event.volume ?? 0.1); if (!Number.isFinite(requestedVolume)||requestedVolume<=0) fail(`${event.id}: volume invalid.`);
  resolvedEvents.push({id:event.id,sceneId:event.sceneId,purpose:String(event.purpose||''),startFrame,durationInFrames,volume:Number(Math.min(requestedVolume,maxVolume(winner.role)).toFixed(3)),requestedRoles:roles,selectedRole:winner.role,soundId:winner.id,staticFile:winner.staticFile,durationSeconds:winner.durationSeconds,packId:winner.packId,creator:winner.creator,license:winner.license,officialUrl:winner.officialUrl,originalFile:winner.originalFile});
}
resolvedEvents.sort((a,b)=>a.startFrame-b.startFrame || a.id.localeCompare(b.id));
for (let i=1;i<resolvedEvents.length;i++) if (resolvedEvents[i].sceneId===resolvedEvents[i-1].sceneId && resolvedEvents[i].startFrame-resolvedEvents[i-1].startFrame<4) fail(`${resolvedEvents[i].id}: SFX events are too dense.`);
const eventsRaw=await readFile(eventsPath,'utf8');
const payload={version:1,status:'SFX_RESOLVED_CC0_AUTO',selectionMode:'DETERMINISTIC_ROLE_KEYWORD_DURATION_RANKING',compositionId:reel.compositionId,fps,finalDurationInFrames:finalDuration,generatedAt:new Date().toISOString(),library:{status:index.status,totalSounds:items.length,baseSounds:baseItems.length,mirror:index.mirror,indexSha256:sha256Text(indexRaw),remotionCc0Supplement:{enabled:supplementEnabled,totalSounds:supplementItems.length,indexSha256:supplementRaw ? sha256Text(supplementRaw) : null}},sourceEventsSha256:sha256Text(eventsRaw),rules:{license:'CC0-1.0_ONLY',randomness:false,soundReusePenalty:true,sceneAnchorsFollowFinalSceneFrames:true,voiceFirstVolumeCaps:true,remoteRenderMedia:false,remotionSupplementRequiresExplicitOptIn:true},events:resolvedEvents};
await writeFile(resolvedPath,`${JSON.stringify(payload,null,2)}\n`,'utf8');
console.log('SFX AUTO-RESOLUTION: PASSED');
console.log(`events: ${resolvedEvents.length}`);
console.log(`library candidates: ${items.length} (base ${baseItems.length} + Remotion CC0 ${supplementItems.length})`);
console.log(`resolved: ${resolvedPath}`);
