#!/usr/bin/env node
import {access,readdir,readFile} from 'node:fs/promises';
import {relative,resolve,isAbsolute} from 'node:path';
import {getBeatSourceSlice,isSafeReelSourceFile} from './remotion-capability-contract.mjs';
import {validateHeroMotionSource} from './motion-engine-source-contract.mjs';

const root=resolve('.');
const reelsRoot=resolve('ki/reels');
const sourceRoot=resolve('ki/src/reels');
const failures=[];
const display=(path)=>relative(root,path)||'.';
const exists=async(path)=>{try{await access(path);return true}catch{return false}};
const read=async(path)=>{try{return await readFile(path,'utf8')}catch{return ''}};
const phase1Finished=(text)=>{
  const block=text.match(/## Phase 1[^\n]*\n([\s\S]*?)(?=\n## Phase 2|$)/i)?.[0]??'';
  return /\*\*Status:\*\*\s*FERTIG\b/i.test(block)||/\*\*FERTIG(?:\s*\/[^*]+)?\*\*/i.test(block);
};

// Motion Engine V1 becomes the hero-motion quality floor for new reels from
// the V4 generation onward. Existing legacy weeks are intentionally untouched.
const needsHeroMotionQuality=(weekName)=>String(weekName).slice(0,10)>='2026-09-28';

for(const week of await readdir(reelsRoot,{withFileTypes:true})){
  if(!week.isDirectory()||!/^\d{4}-\d{2}-\d{2}_bis_/.test(week.name)||!needsHeroMotionQuality(week.name))continue;
  const weekRoot=resolve(reelsRoot,week.name);
  for(const reel of await readdir(weekRoot,{withFileTypes:true})){
    if(!reel.isDirectory()||!/^\d{2}_.+/.test(reel.name))continue;
    const project=resolve(weekRoot,reel.name,'06-projektdateien');
    const phase=await read(resolve(project,'PHASE-STATUS.md'));
    if(!phase1Finished(phase))continue;

    const manifestPath=resolve(project,'remotion-capabilities-v1.json');
    if(!(await exists(manifestPath)))continue; // Capability gate owns the missing-manifest error.

    let manifest;
    try{manifest=JSON.parse(await read(manifestPath));}
    catch{continue;}

    const sourceCache=new Map();
    const heroBeats=(manifest.beats??[]).filter((beat)=>beat?.isHero===true||beat?.isHook===true);
    if(heroBeats.length===0){
      failures.push(`${display(manifestPath)}: at least one hero/hook beat is required for Motion Engine quality review.`);
      continue;
    }

    for(const beat of heroBeats){
      if(!isSafeReelSourceFile(beat?.sourceFile))continue; // Capability gate reports unsafe paths.
      const sourcePath=resolve(beat.sourceFile);
      const relativeToSource=relative(sourceRoot,sourcePath);
      if(relativeToSource.startsWith('..')||isAbsolute(relativeToSource)||!(await exists(sourcePath)))continue;
      if(!sourceCache.has(beat.sourceFile))sourceCache.set(beat.sourceFile,await read(sourcePath));
      const source=sourceCache.get(beat.sourceFile)??'';
      const slice=getBeatSourceSlice(source,beat.beatId);
      if(slice===null)continue; // Capability gate owns missing marker errors.
      const label=`${display(manifestPath)}:${beat.beatId}`;
      failures.push(...validateHeroMotionSource(slice,{label}));
    }
  }
}

if(failures.length){
  console.error('HERO MOTION QUALITY: FAIL');
  for(const failure of failures)console.error(`- ${failure}`);
  process.exit(1);
}
console.log('HERO MOTION QUALITY: PASS — future hero beats use authored cinematic choreography instead of utility-only fade/slide motion.');
