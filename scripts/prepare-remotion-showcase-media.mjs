#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const publicDir=path.resolve('ki','public','showcase');
const tmpDir=path.resolve('out','remotion-showcase-2026-09-12','media-tmp');
await mkdir(publicDir,{recursive:true});
await mkdir(tmpDir,{recursive:true});

if(Number(process.versions.node.split('.')[0])!==20){
  console.error(`SHOWCASE MEDIA BLOCKED: Node 20 required, got ${process.versions.node}.`);
  process.exit(1);
}

const sources={
  broll:{
    id:'wmc-speed-typing-dvorak',
    pageUrl:'https://commons.wikimedia.org/wiki/File:Speed_typing_with_dvorak.webm',
    downloadUrl:'https://upload.wikimedia.org/wikipedia/commons/a/a3/Speed_typing_with_dvorak.webm',
    author:'Enteryourname0000',
    license:'CC0 1.0',
    role:'Real keyboard typing B-roll for a generic technology/workflow showcase. Not evidence for any real-world claim.',
  },
  image:{
    id:'wmc-laptop-on-desk',
    pageUrl:'https://commons.wikimedia.org/wiki/File:Laptop_on_a_desk.jpg',
    downloadUrl:'https://upload.wikimedia.org/wikipedia/commons/6/61/Laptop_on_a_desk.jpg',
    author:'Radek Grzybowski',
    license:'CC0 1.0',
    role:'Real workspace image used as an editorial image layer. Not evidence for any claim.',
  },
  userScreenshot:{
    id:'user-remotion-studio-screenshot',
    pageUrl:null,
    author:'User-provided in ChatGPT conversation',
    license:'USER_PROVIDED_FOR_PROJECT',
    role:'Actual screenshot supplied by the user, used as a local image/compositing asset.',
  },
};

const fetchBytes=async(url)=>{
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),30000);
  try{
    const response=await fetch(url,{headers:{'User-Agent':'ki-channel-remotion-showcase/1.0 (media materialization; contact via repository owner)','Accept':'*/*'},signal:controller.signal,redirect:'follow'});
    if(!response.ok)throw new Error(`HTTP ${response.status} ${response.statusText}`);
    const bytes=Buffer.from(await response.arrayBuffer());
    if(bytes.length<1024)throw new Error(`download unexpectedly small: ${bytes.length} bytes`);
    return bytes;
  } finally {clearTimeout(timer);}
};

const sha256=(bytes)=>createHash('sha256').update(bytes).digest('hex');
const run=(cmd,args)=>spawnSync(cmd,args,{encoding:'utf8',env:process.env,maxBuffer:64*1024*1024});

const imagePath=path.join(publicDir,'laptop-on-desk.jpg');
const userScreenshotPath=path.join(publicDir,'user-remotion-studio.jpg');
const brollSourcePath=path.join(tmpDir,'speed-typing-dvorak-source.webm');
const brollPath=path.join(publicDir,'speed-typing-dvorak.mp4');
const brollPosterPath=path.join(publicDir,'speed-typing-poster.jpg');

if(!existsSync(userScreenshotPath)){
  console.error(`SHOWCASE MEDIA BLOCKED: committed user screenshot missing: ${userScreenshotPath}`);
  process.exit(1);
}

try{
  const imageBytes=await fetchBytes(sources.image.downloadUrl);
  await writeFile(imagePath,imageBytes);

  const videoBytes=await fetchBytes(sources.broll.downloadUrl);
  await writeFile(brollSourcePath,videoBytes);

  const transcode=run('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss','3','-t','8','-i',brollSourcePath,'-an','-vf','scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',brollPath]);
  if(transcode.status!==0)throw new Error(`ffmpeg B-roll transcode failed: ${transcode.stderr||transcode.stdout}`);

  const poster=run('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss','2.2','-i',brollPath,'-frames:v','1','-q:v','2',brollPosterPath]);
  if(poster.status!==0)throw new Error(`ffmpeg poster extraction failed: ${poster.stderr||poster.stdout}`);

  const probe=run('ffprobe',['-v','error','-show_entries','format=duration:stream=codec_type,codec_name,width,height,avg_frame_rate,pix_fmt','-of','json',brollPath]);
  if(probe.status!==0)throw new Error(`ffprobe failed: ${probe.stderr||probe.stdout}`);
  const metadata=JSON.parse(probe.stdout);
  const video=metadata.streams?.find((stream)=>stream.codec_type==='video');
  if(!video||Number(video.width)!==1920||Number(video.height)!==1080||video.pix_fmt!=='yuv420p')throw new Error('prepared B-roll does not match 1920x1080 yuv420p contract.');

  const [finalVideoBytes,finalImageBytes,userScreenshotBytes,posterBytes]=await Promise.all([
    readFile(brollPath),readFile(imagePath),readFile(userScreenshotPath),readFile(brollPosterPath),
  ]);
  const report={
    version:1,
    status:'MATERIALIZED_FOR_ISOLATED_SHOWCASE',
    generatedAt:new Date().toISOString(),
    note:'These assets are for the isolated Remotion capability test. The two Wikimedia assets were selected from source pages that state CC0 1.0. They are illustrative media, not evidence for claims.',
    assets:[
      {...sources.broll,localFile:'showcase/speed-typing-dvorak.mp4',sha256:sha256(finalVideoBytes),bytes:finalVideoBytes.length,technical:{width:1920,height:1080,fps:30,pixFmt:'yuv420p'}},
      {...sources.image,localFile:'showcase/laptop-on-desk.jpg',sha256:sha256(finalImageBytes),bytes:finalImageBytes.length},
      {...sources.userScreenshot,localFile:'showcase/user-remotion-studio.jpg',sha256:sha256(userScreenshotBytes),bytes:userScreenshotBytes.length},
      {id:'speed-typing-poster',sourceAsset:sources.broll.id,localFile:'showcase/speed-typing-poster.jpg',sha256:sha256(posterBytes),bytes:posterBytes.length},
    ],
  };
  await writeFile(path.join(publicDir,'PROVENANCE.generated.json'),`${JSON.stringify(report,null,2)}\n`,'utf8');
  console.log(JSON.stringify(report,null,2));
} catch(error){
  console.error(`SHOWCASE MEDIA: FAILED — ${error instanceof Error?error.message:String(error)}`);
  process.exit(1);
} finally {
  await rm(brollSourcePath,{force:true}).catch(()=>{});
}
