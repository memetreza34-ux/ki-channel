#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir=process.argv[2];
if(!rawReelDir){console.error('Usage: node ki/scripts/write-reel-timeline-audit.mjs <reel-package-dir>');process.exit(2);}
const reelDir=path.resolve(rawReelDir);
const p=(...parts)=>path.join(reelDir,...parts);
const fail=(message)=>{console.error(`TIMELINE AUDIT FAILED: ${message}`);process.exit(1);};
const readJson=async(file)=>{try{return JSON.parse(await readFile(file,'utf8'));}catch(error){fail(`${file} missing/invalid: ${error instanceof Error?error.message:error}`);}};

const choreographyPath=p('06-projektdateien','CHOREOGRAPHY-RESOLVED.json');
const captionsPath=p('03-caption','subtitle-cues.json');
const reelPath=p('06-projektdateien','reel.json');
const sfxPath=p('06-projektdateien','sfx-resolved.json');
const outPath=p('06-projektdateien','TIMELINE-AUDIT.md');
for(const file of [choreographyPath,captionsPath,reelPath]) if(!existsSync(file)) fail(`required file missing: ${file}`);
const choreography=await readJson(choreographyPath);
const captions=await readJson(captionsPath);
const reel=await readJson(reelPath);
const sfx=existsSync(sfxPath)?await readJson(sfxPath):{events:[]};
if(choreography?.status!=='CHOREOGRAPHY_LOCKED') fail('choreography is not locked.');
const fps=Number(reel?.format?.fps||30);
const fmt=(frame)=>{const total=Number(frame)/fps;const min=Math.floor(total/60);const sec=total-min*60;return `${String(min).padStart(2,'0')}:${sec.toFixed(3).padStart(6,'0')}`;};
const esc=(value)=>String(value??'').replace(/\|/g,'\\|').replace(/\n/g,' ');
const lines=[
  '# Exakter Reel-Zeitplan',
  '',
  '> Diese Datei ist die menschlich lesbare Kontrollansicht. Alle Zeiten stammen aus dem final ausgerichteten Voiceover.',
  '',
  `- **FPS:** ${fps}`,
  `- **Videolänge:** ${fmt(reel.format.finalDurationInFrames)} (${reel.format.finalDurationInFrames} Frames)`,
  `- **Timing-Authority:** CHOREOGRAPHY-RESOLVED.json`,
  '',
  '## 1. Szenen',
  '',
  '| Szene | Von | Bis | Frames |',
  '|---|---:|---:|---:|'
];
for(const scene of reel.scenes??[]) lines.push(`| ${scene.sceneId} – ${esc(scene.title)} | ${fmt(scene.startFrame)} | ${fmt(scene.endFrame)} | ${scene.startFrame}–${scene.endFrame} |`);

lines.push('', '## 2. Untertitel', '', '| Cue | Szene | Von | Bis | Text |', '|---|---|---:|---:|---|');
for(const cue of captions.cues??[]) lines.push(`| ${cue.id} | ${cue.sceneId} | ${fmt(cue.startFrame)} | ${fmt(cue.endFrame)} | ${esc(cue.text)} |`);

lines.push('', '## 3. Voice ↔ Animation', '', '| Beat | Szene | Gesprochen von–bis | Gesprochener Ausschnitt | ENTER | HOLD | EXIT | Ziel |', '|---|---|---:|---|---:|---:|---:|---|');
for(const beat of choreography.beats??[]){
  lines.push(`| ${beat.id} | ${beat.sceneId} | ${fmt(beat.speech.startFrame)}–${fmt(beat.speech.endFrame)} | ${esc(beat.spokenText)} | ${fmt(beat.visual.startFrame)}–${fmt(beat.visual.enterEndFrame)} | ${fmt(beat.visual.holdStartFrame)}–${fmt(beat.visual.holdEndFrame)} | ${fmt(beat.visual.exitStartFrame)}–${fmt(beat.visual.endFrame)} | ${esc(beat.target)} |`);
}

lines.push('', '## 4. SFX', '', '| SFX | Szene | Beat | Zeitpunkt | Lautstärke |', '|---|---|---|---:|---:|');
for(const event of sfx.events??[]){
  const scene=(reel.scenes??[]).find((item)=>String(item.sceneId)===String(event.sceneId));
  const absolute=scene?Number(scene.startFrame)+Number(event.startFrame??event.anchor?.frame??0):Number(event.startFrame??0);
  lines.push(`| ${event.id} | ${event.sceneId} | ${event.syncEventId??event.sync?.beatId??'—'} | ${fmt(absolute)} | ${event.volume??'—'} |`);
}

lines.push('', '## 5. Produktionsregel', '', '- Untertitel dürfen nur innerhalb ihrer Szene erscheinen.', '- Jede Animation hat einen festen **ENTER-, HOLD- und EXIT-Zeitraum**.', '- SFX werden an denselben Choreography-Beat gekoppelt wie die sichtbare Aktion.', '- Fehlt eine Phrase oder ist ein Zeitfenster unmöglich, wird **nicht gerendert**.', '- Keine prozentualen Timing-Fallbacks im finalen Render.');
await writeFile(outPath,`${lines.join('\n')}\n`,'utf8');
console.log(`TIMELINE AUDIT WRITTEN: ${outPath}`);
