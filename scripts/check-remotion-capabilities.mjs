#!/usr/bin/env node
import {access,readdir,readFile} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
import {futureReelNeedsV3} from './visual-quality-v3-contract.mjs';
import {findMissingCapabilityEvidence,validateRemotionCapabilityManifest} from './remotion-capability-contract.mjs';

const root=resolve('.');
const reelsRoot=resolve('ki/reels');
const failures=[];
const display=(path)=>relative(root,path)||'.';
const exists=async(path)=>{try{await access(path);return true}catch{return false}};
const read=async(path)=>{try{return await readFile(path,'utf8')}catch{return ''}};
const phase1Finished=(text)=>{
  const block=text.match(/## Phase 1[^\n]*\n([\s\S]*?)(?=\n## Phase 2|$)/i)?.[0]??'';
  return /\*\*Status:\*\*\s*FERTIG\b/i.test(block) || /\*\*FERTIG(?:\s*\/[^*]+)?\*\*/i.test(block);
};

for (const week of await readdir(reelsRoot,{withFileTypes:true})) {
  if (!week.isDirectory() || !/^\d{4}-\d{2}-\d{2}_bis_/.test(week.name)) continue;
  const weekRoot=resolve(reelsRoot,week.name);
  for (const reel of await readdir(weekRoot,{withFileTypes:true})) {
    if (!reel.isDirectory() || !/^\d{2}_/.test(reel.name) || !futureReelNeedsV3(week.name,reel.name)) continue;
    const project=resolve(weekRoot,reel.name,'06-projektdateien');
    const phase=await read(resolve(project,'PHASE-STATUS.md'));
    if (!phase1Finished(phase)) continue;

    const manifestPath=resolve(project,'remotion-capabilities-v1.json');
    if (!(await exists(manifestPath))) {
      failures.push(`${display(manifestPath)} fehlt. Neue fertige Phase-1-Reels brauchen einen echten Remotion-Capability-Plan. Siehe ki/gehirn/REMOTION_CAPABILITY_GATE.md.`);
      continue;
    }

    let manifest;
    try{manifest=JSON.parse(await read(manifestPath));}
    catch(error){failures.push(`${display(manifestPath)} ist ungültiges JSON: ${error instanceof Error?error.message:String(error)}`);continue;}

    failures.push(...validateRemotionCapabilityManifest(manifest,{label:display(manifestPath)}));

    if (Array.isArray(manifest.sourceFiles) && manifest.sourceFiles.length>0) {
      let sourceText='';
      for (const sourceFile of manifest.sourceFiles) {
        if (typeof sourceFile!=='string' || !sourceFile.trim()) {failures.push(`${display(manifestPath)}: sourceFiles enthält einen ungültigen Pfad.`);continue;}
        const sourcePath=resolve(sourceFile);
        if (!(await exists(sourcePath))) {failures.push(`${display(manifestPath)}: sourceFile fehlt: ${sourceFile}`);continue;}
        sourceText+=`\n/* SOURCE ${sourceFile} */\n${await read(sourcePath)}`;
      }
      for (const failure of findMissingCapabilityEvidence(manifest,sourceText)) failures.push(`${display(manifestPath)}: ${failure}`);
    }

    const strategy=await read(resolve(project,'visual-strategy.md'));
    for (const marker of ['Primary Remotion capability','Capability rationale']) {
      if (!strategy.includes(marker)) failures.push(`${display(resolve(project,'visual-strategy.md'))}: Capability-Gate Marker fehlt: "${marker}".`);
    }
  }
}

if (failures.length) {
  console.error('REMOTION CAPABILITY GATE: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('REMOTION CAPABILITY GATE: PASS — geplante Remotion-Mechaniken sind ausgewählt und im Source nachweisbar implementiert.');
