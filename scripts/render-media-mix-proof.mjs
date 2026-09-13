#!/usr/bin/env node
import {existsSync, statSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const id='MediaMixProofVertical';
const outDir=path.resolve('out','media-mix-proof');
const output=path.join(outDir,'media-mix-proof-vertical.mp4');
const entry=path.resolve('ki','src','reels','media-mix-proof','entry.tsx');
const remotionBin=path.resolve('node_modules','.bin',process.platform==='win32'?'remotion.cmd':'remotion');
const mediaPrep=path.resolve('scripts','prepare-remotion-showcase-media.mjs');
const requiredMedia=[
  path.resolve('ki','public','showcase','user-remotion-studio.jpg'),
  path.resolve('ki','public','showcase','laptop-on-desk.jpg'),
  path.resolve('ki','public','showcase','speed-typing-dvorak.mp4'),
  path.resolve('ki','public','showcase','PROVENANCE.generated.json'),
];

await mkdir(outDir,{recursive:true});
if(Number(process.versions.node.split('.')[0])!==20){
  console.error(`MEDIA MIX PROOF BLOCKED: Node 20 required, got ${process.versions.node}. Use scripts/with-longform-node20.mjs.`);
  process.exit(1);
}
if(!existsSync(remotionBin)){
  console.error('MEDIA MIX PROOF BLOCKED: local Remotion CLI missing. Run npm install first.');
  process.exit(1);
}
if(!existsSync(mediaPrep)){
  console.error('MEDIA MIX PROOF BLOCKED: showcase media prep script missing.');
  process.exit(1);
}

console.log('MEDIA MIX PROOF: materializing CC0 image + B-roll first...');
const prep=spawnSync(process.execPath,[mediaPrep],{stdio:'inherit',env:process.env});
if(prep.status!==0){
  console.error('MEDIA MIX PROOF BLOCKED: media materialization failed. No fake placeholder render will be produced.');
  process.exit(1);
}
for(const file of requiredMedia){
  if(!existsSync(file)||statSync(file).size<1024){
    console.error(`MEDIA MIX PROOF BLOCKED: required local media missing/invalid: ${file}`);
    process.exit(1);
  }
}

const args=['render',entry,id,output,'--codec=h264','--crf=18','--pixel-format=yuv420p','--overwrite','--concurrency=1'];
const result=process.platform==='win32'
  ? spawnSync(remotionBin,args,{stdio:'inherit',env:process.env})
  : spawnSync(process.execPath,[remotionBin,...args],{stdio:'inherit',env:process.env});

if(result.status!==0||!existsSync(output)||statSync(output).size<1024){
  console.error('MEDIA MIX PROOF: RENDER FAILED');
  process.exit(1);
}
const probe=spawnSync('ffprobe',['-v','error','-show_entries','format=duration:stream=codec_type,codec_name,width,height,avg_frame_rate,pix_fmt','-of','json',output],{encoding:'utf8'});
if(probe.status!==0){
  console.error('MEDIA MIX PROOF: ffprobe failed');
  process.exit(1);
}
const metadata=JSON.parse(probe.stdout);
const video=metadata.streams?.find((stream)=>stream.codec_type==='video');
const duration=Number(metadata.format?.duration ?? 0);
if(!video||Number(video.width)!==1080||Number(video.height)!==1920||duration<11.8||duration>12.2){
  console.error(`MEDIA MIX PROOF: technical output contract failed — ${probe.stdout}`);
  process.exit(1);
}
console.log(probe.stdout);
console.log(`MEDIA MIX PROOF: READY FOR 1x VISUAL REVIEW — ${path.relative(process.cwd(),output)}`);
