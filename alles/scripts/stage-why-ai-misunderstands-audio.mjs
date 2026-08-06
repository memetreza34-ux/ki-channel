import {spawnSync} from 'node:child_process';
import {mkdirSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {extname, resolve} from 'node:path';
import {getMisunderstandsRenderConfig} from './why-ai-misunderstands-render-config.mjs';

const config=getMisunderstandsRenderConfig(process.argv[2]);
const sourceFolder=resolve(config.reelRoot,'02-audio');
const supported=new Set(['.wav','.mp3','.m4a','.aac','.ogg','.mp4','.mov','.webm']);
const files=readdirSync(sourceFolder).filter((name)=>supported.has(extname(name).toLowerCase())&&statSync(resolve(sourceFolder,name)).size>0);
if(files.length!==1)throw new Error(`02-audio muss genau eine nicht leere Mediendatei enthalten; gefunden: ${files.length}`);
const source=resolve(sourceFolder,files[0]);
const target=resolve('ki','public','reels','why-ai-misunderstands-you','audio','voiceover.wav');
mkdirSync(resolve(target,'..'),{recursive:true});
const result=spawnSync('ffmpeg',['-y','-i',source,'-vn','-ac','1','-ar','48000','-c:a','pcm_s16le',target],{stdio:'inherit'});
if(result.error)throw result.error;
if(result.status!==0)throw new Error(`ffmpeg endete mit Code ${result.status}`);
const report={version:1,source,target,normalizedFormat:'wav-pcm-s16le-48khz-mono',createdAt:new Date().toISOString()};
writeFileSync(resolve(config.reelRoot,'05-review','audio-stage-report.json'),`${JSON.stringify(report,null,2)}\n`,'utf8');
console.log(`✓ Voiceover vorbereitet: ${target}`);
