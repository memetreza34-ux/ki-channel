#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const input=process.argv[2];
if(!input){console.error('Usage: node ki/scripts/validate-final-video.mjs <final-video.mp4>');process.exit(1);}
const file=path.resolve(input); if(!existsSync(file)){console.error(`Final video not found: ${file}`);process.exit(1);}
const run=(cmd,args)=>{const r=spawnSync(cmd,args,{encoding:'utf8'});if(r.error){console.error(`${cmd} could not be started: ${r.error.message}`);process.exit(1);}if(r.status!==0){console.error(`${cmd} failed:\n${r.stderr||r.stdout}`);process.exit(r.status||1);}return `${r.stdout||''}\n${r.stderr||''}`;};
const probeRaw=run('ffprobe',['-v','error','-show_streams','-show_format','-of','json',file]);
let probe; try{probe=JSON.parse(probeRaw.trim());}catch{console.error('Could not parse ffprobe output.');process.exit(1);}
const video=probe.streams?.find((s)=>s.codec_type==='video'); const audio=probe.streams?.find((s)=>s.codec_type==='audio');
if(!video){console.error('FINAL GATE FAILED: no video stream found.');process.exit(1);} if(!audio){console.error('FINAL GATE FAILED: no audio stream found. Do not hand this video to the user.');process.exit(1);}
const duration=Number(probe.format?.duration||0); if(!Number.isFinite(duration)||duration<=0){console.error('FINAL GATE FAILED: invalid container duration.');process.exit(1);}
const volumeRaw=run('ffmpeg',['-hide_banner','-nostats','-i',file,'-map','0:a:0','-af','volumedetect','-f','null','-']);
const meanMatch=volumeRaw.match(/mean_volume:\s*(-?inf|[-+]?\d+(?:\.\d+)?)\s*dB/i); const maxMatch=volumeRaw.match(/max_volume:\s*(-?inf|[-+]?\d+(?:\.\d+)?)\s*dB/i);
if(!meanMatch||!maxMatch){console.error('FINAL GATE FAILED: audio exists, but loudness could not be verified.');process.exit(1);}
const parseDb=(v)=>v.toLowerCase()==='-inf'?-Infinity:Number(v); const meanDb=parseDb(meanMatch[1]); const maxDb=parseDb(maxMatch[1]);
if(!Number.isFinite(maxDb)||maxDb<-50){console.error(`FINAL GATE FAILED: audio is silent or practically inaudible (max ${maxMatch[1]} dB).`);process.exit(1);} if(!Number.isFinite(meanDb)||meanDb<-60){console.error(`FINAL GATE FAILED: average audio level is practically inaudible (mean ${meanMatch[1]} dB).`);process.exit(1);}
console.log('FINAL VIDEO GATE PASSED'); console.log(`file: ${file}`); console.log(`duration: ${duration.toFixed(3)} s`); console.log(`video: ${video.codec_name||'unknown'} ${video.width||'?'}x${video.height||'?'}`); console.log(`audio: ${audio.codec_name||'unknown'} ${audio.sample_rate||'?'} Hz`); console.log(`mean volume: ${meanDb.toFixed(1)} dB`); console.log(`max volume: ${maxDb.toFixed(1)} dB`);
