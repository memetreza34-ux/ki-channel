#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {cp, mkdir, readFile, readdir, rm, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const fail = (message) => { console.error(`SFX LIBRARY SETUP FAILED: ${message}`); process.exit(1); };
const configPath = path.resolve('ki/config/sfx-sources.json');
if (!existsSync(configPath)) fail(`config missing: ${configPath}`);
let config;
try { config = JSON.parse(await readFile(configPath,'utf8')); }
catch (error) { fail(`invalid sfx-sources.json: ${error.message}`); }

const cacheRoot = path.resolve('.cache','reel-sfx-source');
const runtimeRoot = path.resolve(config.runtimeRoot || 'public/reel-sfx');
const packsRoot = path.join(runtimeRoot,'kenney');
const licensesRoot = path.join(runtimeRoot,'licenses');
await mkdir(path.dirname(cacheRoot),{recursive:true});
await mkdir(packsRoot,{recursive:true});
await mkdir(licensesRoot,{recursive:true});

const run = (label, command, args, options={}) => {
  console.log(`[${label}] ${command} ${args.join(' ')}`);
  const result = spawnSync(command,args,{encoding:'utf8',...options});
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error || result.status !== 0) fail(`${label} failed${result.error ? `: ${result.error.message}` : ''}`);
  return result;
};

if (!existsSync(path.join(cacheRoot,'.git'))) {
  await rm(cacheRoot,{recursive:true,force:true});
  run('clone CC0 mirror','git',['clone','--depth','1','--filter=blob:none','--sparse',config.mirror.repository,cacheRoot]);
} else {
  run('refresh CC0 mirror','git',['-C',cacheRoot,'fetch','--depth','1','origin',config.mirror.branch || 'main']);
  run('reset CC0 mirror','git',['-C',cacheRoot,'reset','--hard','FETCH_HEAD']);
}
const dirs = config.packs.map((pack)=>pack.mirrorDir);
run('sparse checkout','git',['-C',cacheRoot,'sparse-checkout','set',...dirs]);
const mirrorCommit = run('read mirror commit','git',['-C',cacheRoot,'rev-parse','HEAD']).stdout.trim();
if (!/^[0-9a-f]{40}$/i.test(mirrorCommit)) fail('could not resolve mirror commit sha.');

const audioExt = /\.(?:wav|ogg|mp3|flac)$/i;
const classify = (filename, packId) => {
  const name = filename.toLowerCase();
  if (/confirm|confirmation|accept|success|complete|positive|check/.test(name)) return 'ui-confirm';
  if (/error|negative|deny|cancel|wrong|fail/.test(name)) return 'ui-error';
  if (/click|tap|button|select/.test(name)) return 'ui-click';
  if (/switch|toggle/.test(name)) return 'ui-toggle';
  if (/open|close|minimize|maximize/.test(name)) return 'ui-open-close';
  if (/impact|hit|heavy|metal|wood|glass|crunch|thud/.test(name)) return 'impact';
  if (/phaser|laser|scan|power|engine|energy|space|sci.?fi/.test(name) || packId.includes('sci-fi')) return 'tech-accent';
  if (/up|rise|riser|charge/.test(name)) return 'transition-rise';
  if (/down|fall|drop/.test(name)) return 'transition-down';
  if (packId.includes('digital')) return 'digital-accent';
  if (packId.includes('impact')) return 'impact';
  if (packId.includes('interface') || packId.includes('ui-audio')) return 'ui-generic';
  return 'generic';
};

const probeDuration = (file) => {
  const probe = spawnSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',file],{encoding:'utf8'});
  if (probe.error || probe.status !== 0) fail(`ffprobe failed for ${file}`);
  const value = Number(String(probe.stdout).trim());
  if (!Number.isFinite(value) || value <= 0) fail(`invalid duration for ${file}`);
  return value;
};

const walk = async (dir) => {
  const out=[];
  for (const entry of await readdir(dir,{withFileTypes:true})) {
    const full=path.join(dir,entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
};

const items=[];
for (const pack of config.packs) {
  if (pack.license !== 'CC0-1.0') fail(`${pack.id} is not allowlisted as CC0-1.0.`);
  const sourcePackDir=path.join(cacheRoot,pack.mirrorDir);
  const sourceAudioDir=path.join(sourcePackDir,'Audio');
  const licenseFile=path.join(sourcePackDir,'License.txt');
  if (!existsSync(sourceAudioDir) || !existsSync(licenseFile)) fail(`pack incomplete: ${pack.id}`);
  const licenseText=await readFile(licenseFile,'utf8');
  if (!/creative commons zero|\bcc0\b/i.test(licenseText)) fail(`included license for ${pack.id} does not prove CC0.`);
  await cp(licenseFile,path.join(licensesRoot,`${pack.id}.txt`));

  const targetPackDir=path.join(packsRoot,pack.id);
  await rm(targetPackDir,{recursive:true,force:true});
  await mkdir(targetPackDir,{recursive:true});
  const sourceFiles=(await walk(sourceAudioDir)).filter((file)=>audioExt.test(file));
  const minimum=Math.max(1,Math.floor(Number(pack.advertisedFiles || 0)*0.8));
  if (sourceFiles.length < minimum) fail(`${pack.id} contains only ${sourceFiles.length} audio files; expected at least ${minimum}.`);

  for (const source of sourceFiles) {
    const relative=path.relative(sourceAudioDir,source);
    const stem=relative.replace(/[\\/]+/g,'__').replace(/\.[^.]+$/,'').replace(/[^A-Za-z0-9._-]+/g,'-');
    const target=path.join(targetPackDir,`${stem}.wav`);
    const ffmpeg=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',source,'-vn','-ac','2','-ar','48000','-c:a','pcm_s16le',target],{encoding:'utf8'});
    if (ffmpeg.error || ffmpeg.status !== 0) fail(`ffmpeg conversion failed for ${source}: ${ffmpeg.stderr || ffmpeg.error?.message}`);
    const duration=probeDuration(target);
    items.push({
      id:`${pack.id}:${stem}`,
      packId:pack.id,
      role:classify(relative,pack.id),
      originalFile:relative.replace(/\\/g,'/'),
      runtimeFile:path.relative(process.cwd(),target).replace(/\\/g,'/'),
      staticFile:path.relative(path.resolve('public'),target).replace(/\\/g,'/'),
      durationSeconds:Number(duration.toFixed(6)),
      creator:pack.creator,
      license:pack.license,
      officialUrl:pack.officialUrl,
    });
  }
}

const index={
  version:1,
  status:'LOCAL_CC0_SFX_LIBRARY_READY',
  generatedAt:new Date().toISOString(),
  mirror:{repository:config.mirror.repository,commit:mirrorCommit},
  totalSounds:items.length,
  packs:config.packs.map((pack)=>({id:pack.id,creator:pack.creator,license:pack.license,officialUrl:pack.officialUrl,advertisedFiles:pack.advertisedFiles})),
  items:items.sort((a,b)=>a.id.localeCompare(b.id)),
};
await writeFile(path.join(runtimeRoot,'sfx-index.json'),`${JSON.stringify(index,null,2)}\n`,'utf8');
console.log('\nREEL SFX LIBRARY READY');
console.log(`sounds: ${items.length}`);
console.log(`runtime: ${runtimeRoot}`);
console.log(`mirror commit: ${mirrorCommit}`);
console.log('license policy: CC0-only automatic library');
