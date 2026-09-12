#!/usr/bin/env node
import {existsSync,statSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const id='RemotionShowcase20260912';
const outDir=path.resolve('out','remotion-showcase-2026-09-12');
const output=path.join(outDir,'remotion-showcase.mp4');
const entry=path.resolve('ki','src','index.ts');
const remotionBin=path.resolve('node_modules','.bin',process.platform==='win32'?'remotion.cmd':'remotion');
await mkdir(outDir,{recursive:true});
if(Number(process.versions.node.split('.')[0])!==20){console.error(`SHOWCASE RENDER BLOCKED: Node 20 required, got ${process.versions.node}. Use scripts/with-longform-node20.mjs.`);process.exit(1);}
if(!existsSync(remotionBin)){console.error('SHOWCASE RENDER BLOCKED: local Remotion CLI missing.');process.exit(1);}
const args=['render',entry,id,output,'--codec=h264','--crf=18','--pixel-format=yuv420p','--overwrite','--gl=angle','--concurrency=1'];
const result=process.platform==='win32'?spawnSync(remotionBin,args,{stdio:'inherit',env:process.env}):spawnSync(process.execPath,[remotionBin,...args],{stdio:'inherit',env:process.env});
if(result.status!==0||!existsSync(output)||statSync(output).size<1024){console.error('SHOWCASE RENDER: FAILED');process.exit(1);}
const probe=spawnSync('ffprobe',['-v','error','-show_entries','format=duration:stream=codec_type,codec_name,width,height,avg_frame_rate,pix_fmt','-of','json',output],{encoding:'utf8'});
if(probe.status!==0){console.error('SHOWCASE RENDER: ffprobe failed');process.exit(1);}
console.log(probe.stdout);
console.log(`SHOWCASE RENDER: READY FOR VISUAL REVIEW — ${path.relative(process.cwd(),output)}`);
