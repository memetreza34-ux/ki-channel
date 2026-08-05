#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {mkdir, readFile, readdir, rm, stat, writeFile} from 'node:fs/promises';
import {extname, join, resolve} from 'node:path';
import sharp from 'sharp';

const defaultRoot=resolve('..','reels','2026-08-03_bis_2026-08-09','mittwoch','reel-01_warum-ki-halluziniert');
const projectArg=process.argv.slice(2).find((arg)=>!arg.startsWith('--'));
const reelRoot=projectArg?resolve(projectArg):defaultRoot;
const packageFile=join(reelRoot,'timeline','codex-reel-package.json');
const contract=JSON.parse(await readFile(packageFile,'utf8'));
const publicRoot=resolve('ki','public','reels','why-ai-hallucinates');
const imageRoot=join(publicRoot,'images');
const audioRoot=join(publicRoot,'audio');
const supportedImages=new Set(contract.media.supportedImageExtensions.map((value)=>value.toLowerCase()));
const supportedAudio=new Set(contract.media.supportedAudioExtensions.map((value)=>value.toLowerCase()));

const discoverFiles=async(folder,extensions)=>{
  const entries=await readdir(folder,{withFileTypes:true});
  return entries.filter((entry)=>entry.isFile()&&extensions.has(extname(entry.name).toLowerCase())).map((entry)=>join(folder,entry.name));
};
const requireExactlyOne=async(folder,extensions,label)=>{
  const files=await discoverFiles(folder,extensions);
  if(files.length!==1)throw new Error(`${label}: genau eine unterstützte Datei erwartet, gefunden ${files.length}. Ordner: ${folder}`);
  const metadata=await stat(files[0]);
  if(metadata.size===0)throw new Error(`${label}: Datei ist leer: ${files[0]}`);
  return {file:files[0],bytes:metadata.size};
};

await rm(publicRoot,{recursive:true,force:true});
await mkdir(imageRoot,{recursive:true});
await mkdir(audioRoot,{recursive:true});
const report={version:2,generatedAt:new Date().toISOString(),projectRoot:reelRoot,passed:false,audio:null,images:[]};

try{
  const audio=await requireExactlyOne(join(reelRoot,contract.audio.sourceFolder),supportedAudio,'Voiceover');
  const runtimeAudio=join(audioRoot,'voiceover.wav');
  const ffmpeg=spawnSync('ffmpeg',['-y','-i',audio.file,'-vn','-ar','48000','-ac','1','-c:a','pcm_s16le',runtimeAudio],{stdio:'inherit',shell:process.platform==='win32'});
  if(ffmpeg.status!==0)throw new Error(`FFmpeg konnte das Voiceover nicht vorbereiten. Exit-Code: ${ffmpeg.status}`);
  report.audio={source:audio.file,publicFile:'reels/why-ai-hallucinates/audio/voiceover.wav',sourceBytes:audio.bytes,runtimeBytes:(await stat(runtimeAudio)).size};

  const outputNames={
    'scene-01':'scene-01-confident-answer.png',
    'scene-03':'scene-03-pattern-gap-machine.png',
    'scene-04':'scene-04-risk-documents.png',
    'scene-08':'scene-08-verification-desk.png',
  };
  for(const sceneId of contract.media.requiredImageScenes){
    const folder=join(reelRoot,contract.media.sceneRoot,sceneId);
    const image=await requireExactlyOne(folder,supportedImages,sceneId);
    const target=join(imageRoot,outputNames[sceneId]);
    await sharp(image.file).rotate().png({compressionLevel:9}).toFile(target);
    report.images.push({sceneId,source:image.file,publicFile:`reels/why-ai-hallucinates/images/${outputNames[sceneId]}`,sourceBytes:image.bytes,runtimeBytes:(await stat(target)).size});
  }
  report.passed=true;
}catch(error){
  report.error=error instanceof Error?error.message:String(error);
}

const reportFile=join(reelRoot,'05-review','asset-stage-report.json');
await mkdir(join(reelRoot,'05-review'),{recursive:true});
await writeFile(reportFile,`${JSON.stringify(report,null,2)}\n`,'utf8');
if(!report.passed){console.error(report.error);process.exit(1);}
console.log(`✓ Voiceover und ${report.images.length} Bildassets vorbereitet.`);
console.log(`✓ Bericht: ${reportFile}`);
