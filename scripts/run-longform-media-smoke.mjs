#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {createReadStream, existsSync, statSync} from 'node:fs';
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

if (Number(process.versions.node.split('.')[0]) !== 20) {
  console.error(`LONGFORM MEDIA SMOKE BLOCKED: requires Node 20, got ${process.versions.node}. Use scripts/with-longform-node20.mjs.`);
  process.exit(1);
}

const outRoot = path.resolve('out','longform-capability-smoke','media');
const packageRoot = path.join(outRoot,'package');
const planDir = path.join(packageRoot,'02-visuals');
await rm(packageRoot,{recursive:true,force:true});
await mkdir(planDir,{recursive:true});
const reportPath = path.join(outRoot,'report.json');
await mkdir(outRoot,{recursive:true});

const runNode = (script,args=[]) => {
  const result = spawnSync(process.execPath,[path.resolve(script),...args],{encoding:'utf8',env:process.env,maxBuffer:64*1024*1024});
  return {ok:!result.error && result.status===0,text:`${result.stdout || ''}\n${result.stderr || ''}`.trim(),status:result.status,error:result.error?.message || null};
};
const outputPathFrom = (text) => String(text).match(/^output:\s*(.+)$/mi)?.[1]?.trim() || null;
const sha256File = (file) => new Promise((resolveHash,reject)=>{
  const hash=createHash('sha256');
  const stream=createReadStream(file);
  stream.on('data',(chunk)=>hash.update(chunk));
  stream.on('end',()=>resolveHash(hash.digest('hex')));
  stream.on('error',reject);
});

const report = {
  version:1,
  status:'RUNNING',
  runtime:{node:process.versions.node},
  provider:'WIKIMEDIA_COMMONS',
  search:null,
  candidate:null,
  materialization:null,
  errors:[],
  startedAt:new Date().toISOString(),
};
const save = async () => writeFile(reportPath,`${JSON.stringify(report,null,2)}\n`,'utf8');
const fail = async (message) => {report.errors.push(message);report.status='FAILED';report.finishedAt=new Date().toISOString();await save();console.error(`LONGFORM MEDIA SMOKE FAILED: ${message}`);process.exit(1);};

let scoutPath = null;
let scout = null;
const queries = ['computer technology','data center','computer server'];
for (const query of queries) {
  const result = runNode('scripts/scout-wikimedia-commons-video-assets.mjs',[query,'--orientation=landscape','--limit=40','--top=6']);
  if (!result.ok) {
    report.search = {query,status:'EXECUTED_FAIL',error:result.text};
    continue;
  }
  const output = outputPathFrom(result.text);
  if (!output || !existsSync(path.resolve(output))) continue;
  const parsed = JSON.parse(await readFile(path.resolve(output),'utf8'));
  if (Array.isArray(parsed.candidates) && parsed.candidates.length) {
    scoutPath=path.resolve(output);scout=parsed;report.search={query,status:'EXECUTED_PASS',scoutFile:path.relative(process.cwd(),scoutPath).split(path.sep).join('/'),candidateCount:parsed.candidates.length};break;
  }
}
if (!scoutPath || !scout) await fail('Wikimedia Commons video scout returned no usable candidate for fallback queries.');

const candidate = scout.candidates[0];
report.candidate = {
  id:String(candidate.id ?? candidate.pageId ?? candidate.title),
  title:candidate.title || null,
  sourceUrl:candidate.sourceUrl,
  downloadUrl:candidate.originalUrl || null,
  rightsStatus:candidate.rightsStatus || null,
  license:candidate.licenseShortName || null,
  licenseUrl:candidate.licenseUrl || null,
  attribution:candidate.attribution || null,
  width:candidate.width || null,
  height:candidate.height || null,
};

const assetId='wmc-real-broll-smoke';
const mediaPlan = {
  version:1,
  status:'DISCOVERY_COMPLETE',
  assets:[{
    assetId,
    mediaType:'VIDEO',
    sourceType:'WIKIMEDIA_COMMONS',
    sourceProvider:'WIKIMEDIA_COMMONS',
    sourceUrl:candidate.sourceUrl,
    requiredForRender:true,
    provesRealWorldClaim:false,
    rightsVerified:false,
    status:'DISCOVERED',
  }],
};
const planPath=path.join(planDir,'MEDIA-PLAN.json');
await writeFile(planPath,`${JSON.stringify(mediaPlan,null,2)}\n`,'utf8');

const candidateId=String(candidate.id ?? candidate.pageId ?? candidate.title);
const materialize=runNode('scripts/materialize-longform-media.mjs',[
  packageRoot,
  `--asset-id=${assetId}`,
  `--scout=${scoutPath}`,
  `--candidate-id=${candidateId}`,
  '--duration=2',
  '--fit=cover',
  '--allow-upscale',
]);
if (!materialize.ok) await fail(`real Wikimedia video materialization failed: ${materialize.text}`);

const finalPlan=JSON.parse(await readFile(planPath,'utf8'));
const finalAsset=finalPlan.assets.find((asset)=>asset.assetId===assetId);
if (!finalAsset) await fail('materialized asset missing from MEDIA-PLAN.');
if (finalAsset.status!=='MATERIALIZED_PENDING_REVIEW') await fail(`expected MATERIALIZED_PENDING_REVIEW, got ${finalAsset.status}.`);
if (finalAsset.rightsVerified!==false) await fail('materialization must not auto-approve rights.');
if (!finalAsset.localFile || !/^[a-f0-9]{64}$/i.test(String(finalAsset.sha256 || ''))) await fail('materialized asset missing localFile/SHA-256.');
const localFile=path.resolve(packageRoot,finalAsset.localFile);
if (!existsSync(localFile) || !statSync(localFile).isFile() || statSync(localFile).size<1024) await fail('materialized local video missing/empty.');
const actualSha=await sha256File(localFile);
if (actualSha.toLowerCase()!==String(finalAsset.sha256).toLowerCase()) await fail('materialized file SHA does not match MEDIA-PLAN.');

const probe=spawnSync('ffprobe',['-v','error','-show_entries','format=duration:stream=codec_type,codec_name,width,height,avg_frame_rate','-of','json',localFile],{encoding:'utf8',env:process.env});
if (probe.error || probe.status!==0) await fail(`ffprobe failed on materialized B-roll: ${probe.stderr || probe.error?.message}`);
const probeJson=JSON.parse(probe.stdout);
const video=probeJson.streams?.find((stream)=>stream.codec_type==='video');
if (!video || Number(video.width)!==1920 || Number(video.height)!==1080 || video.codec_name!=='h264') await fail('materialized B-roll is not normalized H264 1920x1080.');

report.materialization={
  status:'EXECUTED_PASS_PENDING_REVIEW',
  localFile:path.relative(process.cwd(),localFile).split(path.sep).join('/'),
  sha256:actualSha,
  bytes:statSync(localFile).size,
  width:Number(video.width),height:Number(video.height),fps:video.avg_frame_rate,codec:video.codec_name,durationSeconds:Number(probeJson.format?.duration || 0),
  mediaPlanStatus:finalPlan.status,
  assetStatus:finalAsset.status,
  rightsVerified:finalAsset.rightsVerified,
  approvalPerformed:false,
  note:'Real scout -> remote Wikimedia download -> local normalization -> SHA binding executed. Exact asset still requires source/rights and visual review before APPROVED.',
};
report.status='PASSED_PENDING_HUMAN_OR_AGENT_VISUAL_RIGHTS_REVIEW';
report.finishedAt=new Date().toISOString();
await save();
console.log(JSON.stringify(report,null,2));
console.log('LONGFORM MEDIA SMOKE: PASSED — MATERIALIZED_PENDING_REVIEW');
