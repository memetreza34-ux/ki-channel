#!/usr/bin/env node
import {existsSync, statSync} from 'node:fs';
import {mkdir, rm, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const outDir = path.resolve('out','longform-capability-smoke','motion');
const publicDir = path.resolve('public','longform-capability-smoke');
await mkdir(outDir,{recursive:true});
await mkdir(publicDir,{recursive:true});
const entry = path.resolve('ki','src','longform-capability-smoke','index.ts');
const remotionBin = path.resolve('node_modules','.bin',process.platform === 'win32' ? 'remotion.cmd' : 'remotion');
const report = {
  version:1,
  status:'RUNNING',
  runtime:{node:process.versions.node,execPath:process.execPath,wrapper:process.env.KI_LONGFORM_RUNTIME_WRAPPER === '1'},
  startedAt:new Date().toISOString(),
  capabilities:{
    base:null,effects:null,noise:null,gsap:null,charts:null,transitions:null,skia:null,threeR3f:null,sfx:null,lottie:{status:'CONFIGURED_NOT_EXECUTED',reason:'No canonical local Lottie fixture in this smoke harness.'},rive:{status:'CONFIGURED_NOT_EXECUTED',reason:'No canonical local Rive fixture in this smoke harness.'},
  },
  errors:[],
};
const save = async () => writeFile(path.join(outDir,'report.json'),`${JSON.stringify(report,null,2)}\n`,'utf8');
const failGlobal = async (message) => { report.errors.push(message); report.status='BLOCKED'; await save(); console.error(`LONGFORM MOTION SMOKE BLOCKED: ${message}`); process.exit(1); };
if (!existsSync(entry)) await failGlobal(`entry missing: ${entry}`);
if (!existsSync(remotionBin)) await failGlobal('local Remotion CLI missing; run npm install --package-lock=false --no-audit --no-fund.');
if (Number(process.versions.node.split('.')[0]) !== 20) await failGlobal(`smoke must run on Node 20; got ${process.versions.node}. Use scripts/with-longform-node20.mjs.`);

const run = (cmd,args,{allowFailure=false}={}) => {
  const result = spawnSync(cmd,args,{encoding:'utf8',env:process.env,maxBuffer:64*1024*1024});
  if (result.error) return {ok:false,text:result.error.message,status:null};
  const text = `${result.stdout || ''}\n${result.stderr || ''}`.trim();
  return {ok:result.status === 0 || allowFailure,text,status:result.status};
};
const renderComposition = (id) => {
  const output = path.join(outDir,`${id}.mp4`);
  rm(output,{force:true}).catch(()=>{});
  const args = ['render',entry,id,output,'--codec=h264','--crf=24','--pixel-format=yuv420p','--overwrite','--gl=angle','--concurrency=1'];
  const result = process.platform === 'win32' ? run(remotionBin,args) : run(process.execPath,[remotionBin,...args]);
  if (!result.ok || !existsSync(output) || statSync(output).size < 1024) return {status:'EXECUTED_FAIL',output:null,error:result.text || `exit ${result.status}`};
  const probe = run('ffprobe',['-v','error','-show_entries','format=duration:stream=codec_type,codec_name,width,height,avg_frame_rate','-of','json',output]);
  if (!probe.ok) return {status:'EXECUTED_FAIL',output,error:`render succeeded but ffprobe failed: ${probe.text}`};
  let parsed;
  try { parsed=JSON.parse(probe.text); } catch (error) { return {status:'EXECUTED_FAIL',output,error:`invalid ffprobe JSON: ${error.message}`}; }
  const video = parsed.streams?.find((s)=>s.codec_type==='video');
  if (!video || Number(video.width)!==1920 || Number(video.height)!==1080) return {status:'EXECUTED_FAIL',output,error:'render is not 1920x1080.'};
  return {status:'EXECUTED_PASS',output:path.relative(process.cwd(),output).split(path.sep).join('/'),durationSeconds:Number(parsed.format?.duration || 0),codec:video.codec_name};
};

const base = renderComposition('LongformSmokeBase');
for (const key of ['base','effects','noise','gsap','charts','transitions']) report.capabilities[key] = {...base};
await save();

const skia = renderComposition('LongformSmokeSkia');
report.capabilities.skia = skia;
await save();

const three = renderComposition('LongformSmokeThree');
report.capabilities.threeR3f = three;
await save();

// Exercise the actual @remotion/sfx export, but localize/transcode it before render so final Remotion source never hotlinks audio.
let sfxPrepared = false;
try {
  const module = await import('@remotion/sfx');
  const sourceUrl = String(module.whoosh || '');
  if (!/^https:\/\//i.test(sourceUrl)) throw new Error('@remotion/sfx whoosh export did not return an HTTPS URL.');
  const response = await fetch(sourceUrl,{signal:AbortSignal.timeout(15000)});
  if (!response.ok) throw new Error(`SFX download failed: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 512) throw new Error('SFX response unexpectedly small.');
  const incoming = path.join(outDir,'whoosh-source.bin');
  const finalSfx = path.join(publicDir,'whoosh.mp3');
  await writeFile(incoming,bytes);
  const transcode = run('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',incoming,'-vn','-c:a','libmp3lame','-b:a','192k',finalSfx]);
  await rm(incoming,{force:true});
  if (!transcode.ok || !existsSync(finalSfx) || statSync(finalSfx).size < 512) throw new Error(`SFX transcode failed: ${transcode.text}`);
  sfxPrepared = true;
} catch (error) {
  report.capabilities.sfx = {status:'EXECUTED_FAIL',error:error.message};
}
if (sfxPrepared) report.capabilities.sfx = renderComposition('LongformSmokeSfx');
await save();

const hardKeys = ['base','effects','noise','gsap','charts','transitions','skia','threeR3f','sfx'];
const failed = hardKeys.filter((key)=>report.capabilities[key]?.status !== 'EXECUTED_PASS');
report.status = failed.length ? 'FAILED' : 'PASSED';
report.failedCapabilities = failed;
report.finishedAt = new Date().toISOString();
await save();

console.log(JSON.stringify(report,null,2));
if (failed.length) {
  console.error(`LONGFORM MOTION SMOKE: FAILED — ${failed.join(', ')}`);
  process.exit(1);
}
console.log('LONGFORM MOTION SMOKE: PASSED');
