#!/usr/bin/env node
import {access,readdir,readFile} from 'node:fs/promises';
import {relative,resolve} from 'node:path';
import {validateArtDirectionCalibration} from './channel-art-direction-contract.mjs';

const root=resolve('.');
const reelsRoot=resolve('ki/reels');
const failures=[];
const display=(path)=>relative(root,path)||'.';
const read=async(path)=>{try{return await readFile(path,'utf8')}catch{return ''}};
const exists=async(path)=>{try{await access(path);return true}catch{return false}};
const phase1Finished=(text)=>{const block=text.match(/## Phase 1[^\n]*\n([\s\S]*?)(?=\n## Phase 2|$)/i)?.[0]??'';return /\*\*Status:\*\*\s*FERTIG\b/i.test(block)||/\*\*FERTIG(?:\s*\/[^*]+)?\*\*/i.test(block);};
const needsArtDirection=(weekName)=>String(weekName).slice(0,10)>='2026-09-28';

for(const week of await readdir(reelsRoot,{withFileTypes:true})){
  if(!week.isDirectory()||!/^\d{4}-\d{2}-\d{2}_bis_/.test(week.name)||!needsArtDirection(week.name))continue;
  const weekRoot=resolve(reelsRoot,week.name);
  for(const reel of await readdir(weekRoot,{withFileTypes:true})){
    if(!reel.isDirectory()||!/^\d{2}_/.test(reel.name))continue;
    const project=resolve(weekRoot,reel.name,'06-projektdateien');
    const phase=await read(resolve(project,'PHASE-STATUS.md'));
    if(!phase1Finished(phase))continue;
    const manifestPath=resolve(project,'art-direction-calibration.json');
    if(!(await exists(manifestPath))){failures.push(`${display(manifestPath)} fehlt. Neue Phase-1-fertige Reels brauchen drei Art-Direction-Kalibrier-Szenen.`);continue;}
    let manifest;
    try{manifest=JSON.parse(await read(manifestPath));}catch(error){failures.push(`${display(manifestPath)} ist ungültiges JSON: ${error instanceof Error?error.message:String(error)}`);continue;}
    failures.push(...validateArtDirectionCalibration(manifest,{label:display(manifestPath),requireApproval:true}));
  }
}

if(failures.length){console.error('CHANNEL ART DIRECTION: FAIL');for(const failure of failures)console.error(`- ${failure}`);process.exit(1);}
console.log('CHANNEL ART DIRECTION: PASS — volle Reel-Produktion beginnt erst nach drei geprüften Physical-AI-Calibration-Scenes und expliziter menschlicher Art-Direction-Freigabe.');
