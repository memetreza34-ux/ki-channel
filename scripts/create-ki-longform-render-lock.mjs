#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {createReadStream, existsSync, statSync} from 'node:fs';
import {mkdir, readdir, readFile, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const rawPackage = process.argv[2];
if (!rawPackage) {
  console.error('Usage: node scripts/create-ki-longform-render-lock.mjs <longform-package>');
  process.exit(1);
}
const root = path.resolve(rawPackage);
const readiness = spawnSync(process.execPath,[path.resolve('scripts','check-ki-longform-render-readiness.mjs'),root],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
if (readiness.stdout) process.stdout.write(readiness.stdout);
if (readiness.stderr) process.stderr.write(readiness.stderr);
if (readiness.error || readiness.status !== 0) process.exit(readiness.status ?? 1);

const readJson = async (relative) => JSON.parse(await readFile(path.join(root,relative),'utf8'));
const version = await readJson('06-projektdateien/LONGFORM-VERSION.json');
const media = await readJson('02-visuals/MEDIA-PLAN.json');
const voice = ['voiceover.wav','voiceover.mp3'].map((n)=>path.join(root,'01-script-audio',n)).find((p)=>existsSync(p)&&statSync(p).isFile()&&statSync(p).size>0);
const sha256File = (file) => new Promise((resolveHash,reject)=>{
  const hash=createHash('sha256'); const s=createReadStream(file);
  s.on('data',(c)=>hash.update(c)); s.on('end',()=>resolveHash(hash.digest('hex'))); s.on('error',reject);
});
const walk = async (dir) => {
  const out=[]; for (const e of await readdir(dir,{withFileTypes:true})) { const p=path.join(dir,e.name); if(e.isDirectory()) out.push(...await walk(p)); else if(e.isFile()) out.push(p); } return out;
};
const rel = (file) => path.relative(process.cwd(),file).split(path.sep).join('/');
const tracked = new Set();
const records=[];
const add = async (file, role) => {
  if (!file || tracked.has(file)) return;
  tracked.add(file);
  const st=statSync(file);
  records.push({role,file:rel(file),sha256:await sha256File(file),bytes:st.size});
};
for (const relative of [
  '01-script-audio/CHAPTERS.json','01-script-audio/CLAIMS.json','02-visuals/MEDIA-PLAN.json','03-thumbnail/THUMBNAIL-PLAN.json','06-projektdateien/LONGFORM-VERSION.json'
]) await add(path.join(root,relative),'contract');
const visualPlan=path.join(root,'02-visuals','VISUAL-STORY-PLAN.md'); if(existsSync(visualPlan)) await add(visualPlan,'visual-plan');
await add(voice,'voiceover');
for (const asset of media.assets ?? []) {
  if (!asset.localFile || asset.requiredForRender === false) continue;
  await add(path.resolve(root,String(asset.localFile)),`media:${asset.assetId ?? '?'}`);
}
const sourceRoot=path.resolve('ki','src','longform',version.sourceSlug);
for (const file of (await walk(sourceRoot)).filter((p)=>/\.(ts|tsx|json)$/i.test(p)).sort()) await add(file,'source');
const rootSource=path.resolve('ki','src','Root.tsx'); if(existsSync(rootSource)) await add(rootSource,'composition-registry');
const head=spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'});
if (head.error || head.status!==0) { console.error('RENDER LOCK FAILED: git rev-parse HEAD failed.'); process.exit(1); }
const payload={
  version:1,
  status:'LOCKED_FOR_RENDER',
  contract:'LONGFORM_V1_RENDER_LOCK',
  compositionId:version.compositionId,
  sourceSlug:version.sourceSlug,
  gitHead:String(head.stdout).trim(),
  generatedAt:new Date().toISOString(),
  files:records,
};
const lockPath=path.join(root,'06-projektdateien','RENDER-LOCK.json');
await mkdir(path.dirname(lockPath),{recursive:true});
await writeFile(lockPath,`${JSON.stringify(payload,null,2)}\n`,'utf8');
console.log('LONGFORM RENDER LOCK: CREATED');
console.log(`lock: ${rel(lockPath)}`);
console.log(`gitHead: ${payload.gitHead}`);
console.log(`files: ${records.length}`);
