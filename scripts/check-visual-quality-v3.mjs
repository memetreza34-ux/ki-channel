#!/usr/bin/env node
import {access,readdir,readFile} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
import {futureReelNeedsV3,validateVisualQualityV3Manifest} from './visual-quality-v3-contract.mjs';

const root=resolve('.'); const reelsRoot=resolve('ki/reels'); const failures=[]; const display=(p)=>relative(root,p)||'.';
const exists=async(p)=>{try{await access(p);return true}catch{return false}};
const read=async(p)=>{try{return await readFile(p,'utf8')}catch{return ''}};
const phase1Finished=(text)=>/## Phase 1[^\n]*\n[\s\S]*?\*\*Status:\*\*\s*FERTIG/i.test(text) || /Phase 1[^\n]*\*\*FERTIG\*\*/i.test(text);

for (const week of await readdir(reelsRoot,{withFileTypes:true})) {
  if (!week.isDirectory() || !/^\d{4}-\d{2}-\d{2}_bis_/.test(week.name)) continue;
  const weekRoot=resolve(reelsRoot,week.name);
  for (const reel of await readdir(weekRoot,{withFileTypes:true})) {
    if (!reel.isDirectory() || !/^\d{2}_/.test(reel.name) || !futureReelNeedsV3(week.name,reel.name)) continue;
    const project=resolve(weekRoot,reel.name,'06-projektdateien');
    const phase=await read(resolve(project,'PHASE-STATUS.md'));
    if (!phase1Finished(phase)) continue;

    const manifestPath=resolve(project,'visual-quality-v3.json');
    if (!(await exists(manifestPath))) {failures.push(`${display(manifestPath)} fehlt. Neue Phase-1-Reels ab Reel 05 / Woche 2026-09-28 benötigen Visual Quality V3.`);continue;}
    let manifest;
    try{manifest=JSON.parse(await read(manifestPath));}catch(error){failures.push(`${display(manifestPath)} ist ungültiges JSON: ${error instanceof Error?error.message:String(error)}`);continue;}
    failures.push(...validateVisualQualityV3Manifest(manifest,{label:display(manifestPath)}));

    const sourceContract=manifest?.sourceQualityContract;
    if (typeof sourceContract==='string') {
      const sourcePath=resolve(sourceContract);
      if (!(await exists(sourcePath))) failures.push(`${display(manifestPath)}: sourceQualityContract fehlt: ${sourceContract}`);
      else {
        const source=await read(sourcePath);
        if (!source.includes('assertVisualQualityV3(')) failures.push(`${sourceContract}: muss assertVisualQualityV3(...) ausführen.`);
        if (!source.includes('VISUAL_QUALITY_V3')) failures.push(`${sourceContract}: exportiere einen klar benannten VISUAL_QUALITY_V3 Contract.`);
      }
    }

    const review=await read(resolve(project,'creative-review.md'));
    for (const marker of ['Hook score','Visual Variety score','Motion score','Icon/Illustration score','Readability score','Overall score']) {
      if (!review.includes(marker)) failures.push(`${display(resolve(project,'creative-review.md'))}: V3-Scorecard fehlt Marker "${marker}".`);
    }
  }
}

if (failures.length){console.error('VISUAL QUALITY V3: FAIL');for(const failure of failures)console.error(`- ${failure}`);process.exit(1)}
console.log('VISUAL QUALITY V3: PASS — zukünftige Phase-1-Reels erzwingen Hook-Druck, große Hero-Visuals, semantische Icons/Illustrationen, Shot-Archetypen und >=8/10 Creative-Ziele.');
