#!/usr/bin/env node
import {existsSync, statSync} from 'node:fs';
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const rawPackage=process.argv[2];
if(!rawPackage){console.error('Usage: node scripts/render-ki-longform-master.mjs <longform-package>');process.exit(1);}
const root=path.resolve(rawPackage);
const fail=(m)=>{console.error(`LONGFORM RENDER FAILED: ${m}`);process.exit(1);};
if(!existsSync(root)||!statSync(root).isDirectory()) fail(`package missing: ${root}`);
const run=(cmd,args,{inherit=false,allowFailure=false}={})=>{
  const r=spawnSync(cmd,args,{encoding:'utf8',stdio:inherit?'inherit':['ignore','pipe','pipe'],maxBuffer:64*1024*1024});
  if(r.error) fail(`${cmd} could not start: ${r.error.message}`);
  if(!allowFailure&&r.status!==0) fail(`${cmd} failed:\n${r.stderr||r.stdout||''}`);
  return r;
};
const node=(script,args=[])=>run(process.execPath,[path.resolve(script),...args],{inherit:true});
node('scripts/check-ki-longform-render-readiness.mjs',[root]);
node('scripts/create-ki-longform-render-lock.mjs',[root]);
const version=JSON.parse(await readFile(path.join(root,'06-projektdateien','LONGFORM-VERSION.json'),'utf8'));
const compositionId=version.compositionId;
if(!compositionId) fail('compositionId missing after readiness gate.');
const outDir=path.join(root,'05-export','review-candidate');
const reviewDir=path.join(root,'06-projektdateien','review');
await mkdir(outDir,{recursive:true}); await mkdir(reviewDir,{recursive:true});
const raw=path.join(outDir,'video.raw.mp4');
const master=path.join(outDir,'video.review.mp4');
const audioReport=path.join(reviewDir,'AUDIO-MASTER.json');
const qaReport=path.join(reviewDir,'MASTER-QA.json');
const npx=process.platform==='win32'?'npx.cmd':'npx';
run(npx,[
  'remotion','render','ki/src/index.ts',compositionId,raw,
  '--codec=h264','--crf=18','--pixel-format=yuv420p','--audio-codec=aac','--audio-bitrate=320k','--overwrite'
],{inherit:true});
if(!existsSync(raw)||statSync(raw).size<1024) fail('raw Remotion render missing or too small.');
node('ki/scripts/master-reel-video.mjs',[raw,master,audioReport]);
if(!existsSync(master)||statSync(master).size<1024) fail('mastered review video missing or too small.');
node('scripts/check-ki-longform-master.mjs',[master,qaReport]);
const sheetsPattern=path.join(reviewDir,'CONTACT-SHEET-%03d.jpg');
run('ffmpeg',[
  '-hide_banner','-loglevel','error','-y','-i',master,
  '-vf','fps=1/8,scale=384:216,tile=5x4:padding=6:margin=6:color=white',
  '-fps_mode','vfr','-q:v','2',sheetsPattern
],{inherit:true});
const payload={
  status:'LONGFORM_REVIEW_CANDIDATE_READY_NOT_RELEASED',
  compositionId,
  package:path.relative(process.cwd(),root).split(path.sep).join('/'),
  master:path.relative(process.cwd(),master).split(path.sep).join('/'),
  render:{codec:'h264',crf:18,pixelFormat:'yuv420p'},
  audioTarget:{integratedLufs:-16,truePeakDbtp:-1.5},
  qaReport:path.relative(process.cwd(),qaReport).split(path.sep).join('/'),
  contactSheets:path.relative(process.cwd(),path.join(reviewDir,'CONTACT-SHEET-*.jpg')).split(path.sep).join('/'),
  humanReviewRequired:true,
  releaseStatus:'NOT_READY_UNTIL_1X_REVIEW_AND_RELEASE_GATE',
  generatedAt:new Date().toISOString(),
};
await writeFile(path.join(reviewDir,'RENDER-RESULT.json'),`${JSON.stringify(payload,null,2)}\n`,'utf8');
await rm(raw,{force:true});
console.log('LONGFORM REVIEW CANDIDATE READY — NOT RELEASED');
console.log(`master: ${master}`);
console.log(`qa: ${qaReport}`);
console.log(`contact sheets: ${sheetsPattern}`);
console.log('Next: inspect exact mastered MP4 at 1x and all contact sheets, then update RELEASE-PLAN and run release gate.');
