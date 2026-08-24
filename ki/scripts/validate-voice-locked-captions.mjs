#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const target=process.argv[2];
if(!target){console.error('Usage: node ki/scripts/validate-voice-locked-captions.mjs <reel-package-dir>');process.exit(1);}

const root=path.resolve(target);
const reelPath=path.join(root,'06-projektdateien','reel.json');
const captionsPath=path.join(root,'03-caption','subtitle-cues.json');
const scriptPath=path.join(root,'01-script-audio','VOICEOVER-ZUM-KOPIEREN.txt');
for(const file of [reelPath,captionsPath,scriptPath]){
  if(!fs.existsSync(file)){console.error(`❌ Missing required file: ${file}`);process.exit(1);}
}

const reel=JSON.parse(fs.readFileSync(reelPath,'utf8'));
const captions=JSON.parse(fs.readFileSync(captionsPath,'utf8'));
const canonicalScript=fs.readFileSync(scriptPath,'utf8');
const issues=[];
const normalize=(v)=>String(v??'').replace(/\s+/g,' ').trim();

if(!String(captions.timingStatus??'').startsWith('VOICE_LOCKED')) issues.push('caption timingStatus is not VOICE_LOCKED');

const fps=Number(reel.format?.fps);
const durationFrames=Number(reel.format?.finalDurationInFrames ?? reel.format?.durationInFrames);
const observedSeconds=Number(reel.audio?.observedAudioDurationSeconds);
if(!Number.isFinite(fps)||fps<=0) issues.push('reel.format.fps missing/invalid');
if(!Number.isFinite(durationFrames)||durationFrames<=0) issues.push('final composition duration is not locked');
if(!Number.isFinite(observedSeconds)||observedSeconds<=0) issues.push('reel.audio.observedAudioDurationSeconds missing/invalid');

const rawScenes=Array.isArray(reel.scenes)?reel.scenes:[];
if(rawScenes.length===0) issues.push('reel.scenes missing');
let sceneCursor=0;
for(const [i,scene] of rawScenes.entries()){
  if(scene.startFrame!==sceneCursor) issues.push(`scene ${i+1} is not continuous (start ${scene.startFrame}, expected ${sceneCursor})`);
  if(!(Number.isFinite(scene.startFrame)&&Number.isFinite(scene.endFrame)&&scene.endFrame>scene.startFrame)) issues.push(`scene ${i+1} has invalid bounds`);
  if(String(scene.timingStatus??'').toUpperCase()!=='VOICE_LOCKED') issues.push(`scene ${i+1} timingStatus is not VOICE_LOCKED`);
  sceneCursor=scene.endFrame;
}
if(Number.isFinite(durationFrames)&&sceneCursor!==durationFrames) issues.push(`last scene ends at ${sceneCursor}, final duration is ${durationFrames}`);

const scenes=new Map(rawScenes.map((s)=>[s.sceneId,s]));
const cues=Array.isArray(captions.cues)?captions.cues:[];
for(const [index,cue] of cues.entries()){
  const prefix=`cue ${index+1} (${cue.sceneId??'unknown'})`;
  const scene=scenes.get(cue.sceneId);
  if(!scene){issues.push(`${prefix}: unknown sceneId`);continue;}
  if(!(Number.isFinite(cue.startFrame)&&Number.isFinite(cue.endFrame)&&cue.endFrame>cue.startFrame)) issues.push(`${prefix}: invalid cue bounds`);
  if(cue.startFrame<scene.startFrame||cue.endFrame>scene.endFrame) issues.push(`${prefix}: cue exceeds scene bounds`);
  if(!Array.isArray(cue.words)||cue.words.length===0){issues.push(`${prefix}: missing word-level timestamps`);continue;}
  const rebuilt=normalize(cue.words.map((w)=>w.text).join(' '));
  if(rebuilt!==normalize(cue.text)) issues.push(`${prefix}: word texts do not rebuild cue text exactly`);
  for(let i=0;i<cue.words.length;i++){
    const w=cue.words[i];
    if(!(Number.isFinite(w.startFrame)&&Number.isFinite(w.endFrame)&&w.endFrame>w.startFrame)){issues.push(`${prefix}: invalid word timing at index ${i}`);continue;}
    if(w.startFrame<cue.startFrame||w.endFrame>cue.endFrame) issues.push(`${prefix}: word ${i} exceeds cue bounds`);
    if(i>0&&w.startFrame<cue.words[i-1].endFrame) issues.push(`${prefix}: word ${i} overlaps previous word`);
  }
}

const rebuiltScript=normalize(cues.map((cue)=>cue.text).join(' '));
if(rebuiltScript!==normalize(canonicalScript)) issues.push('all cue texts together do not exactly match VOICEOVER-ZUM-KOPIEREN.txt');

if(Number.isFinite(fps)&&Number.isFinite(durationFrames)&&Number.isFinite(observedSeconds)){
  const audioFrames=observedSeconds*fps;
  if(durationFrames<audioFrames) issues.push(`composition duration (${durationFrames}f) ends before audio (${audioFrames.toFixed(1)}f)`);
  if(durationFrames-audioFrames>30) issues.push(`composition has an excessive final hold (${(durationFrames-audioFrames).toFixed(1)}f after audio)`);
}

if(issues.length){
  for(const issue of issues)console.error(`❌ ${issue}`);
  console.error(`\n❌ Voice-lock validation failed with ${issues.length} issue(s)`);
  process.exit(1);
}
console.log(`✅ Voice-locked captions valid: ${cues.length} cues`);
console.log(`✅ Final duration: ${durationFrames} frames`);
console.log(`✅ Audio duration: ${observedSeconds.toFixed(3)} s`);
