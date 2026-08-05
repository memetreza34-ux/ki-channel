#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';

const projectArg=process.argv.slice(2).find((arg)=>!arg.startsWith('--'));
if(!projectArg){console.error('Nutzung: node scripts/build-why-ai-hallucinates.mjs <reel-ordner> [--skip-tests]');process.exit(1);}
const technicalRoot=process.cwd();
const projectRoot=resolve(projectArg);
const startedAt=new Date().toISOString();
const commands=[];
const run=(command,args,cwd=technicalRoot)=>{
  commands.push({command,args,cwd});
  const result=spawnSync(command,args,{cwd,stdio:'inherit',shell:process.platform==='win32'});
  if(result.status!==0)throw new Error(`${command} ${args.join(' ')} endete mit Code ${result.status}`);
};
const outputs={
  video:join(projectRoot,'06-video','final-reel.mp4'),
  cover:join(projectRoot,'00-cover','cover.png'),
  contactSheet:join(projectRoot,'05-review','contact-sheet.png'),
  qa:join(projectRoot,'05-review','codex-render-qa.json'),
  buildReport:join(projectRoot,'05-review','build-report.json'),
};
const writeReport=(status,error=null)=>{
  mkdirSync(dirname(outputs.buildReport),{recursive:true});
  writeFileSync(outputs.buildReport,`${JSON.stringify({version:1,startedAt,finishedAt:new Date().toISOString(),status,projectRoot,animationsPrebuilt:true,codexAnimationCodingRequired:false,commands,outputs:{video:'06-video/final-reel.mp4',cover:'00-cover/cover.png',contactSheet:'05-review/contact-sheet.png',qa:'05-review/codex-render-qa.json'},manualVisualApprovalRequired:true,...(error?{error:String(error?.stack??error)}:{})},null,2)}\n`);
};
const createContactSheet=()=>{
  const renderDir=join(projectRoot,'render');
  const stills=readdirSync(renderDir).filter((file)=>/^frame-\d+\.png$/i.test(file)).sort().map((file)=>join(renderDir,file));
  if(stills.length===0)throw new Error('Keine Checkpoint-PNGs für den Kontaktbogen gefunden.');
  const selected=stills.filter((_,index)=>index%4===0).slice(0,8);
  const columns=4;const cellW=270;const cellH=480;
  const filters=selected.map((_,index)=>`[${index}:v]scale=${cellW}:${cellH}:force_original_aspect_ratio=decrease,pad=${cellW}:${cellH}:(ow-iw)/2:(oh-ih)/2:color=white[v${index}]`);
  const layout=selected.map((_,index)=>`${(index%columns)*cellW}_${Math.floor(index/columns)*cellH}`).join('|');
  filters.push(`${selected.map((_,index)=>`[v${index}]`).join('')}xstack=inputs=${selected.length}:layout=${layout}:fill=white[out]`);
  run('ffmpeg',['-y',...selected.flatMap((file)=>['-i',file]),'-filter_complex',filters.join(';'),'-map','[out]','-frames:v','1',outputs.contactSheet]);
};
try{
  if(!existsSync(join(projectRoot,'timeline','codex-reel-package.json')))throw new Error('codex-reel-package.json fehlt.');
  run(process.execPath,['scripts/stage-why-ai-hallucinates-assets.mjs',projectRoot]);
  if(!process.argv.includes('--skip-tests')){
    run('npx',['--no-install','vitest','run','ki/src/reels/why-ai-hallucinates/__tests__']);
    run('npx',['--no-install','tsc','--noEmit','-p','ki/tsconfig.motion.json']);
  }
  run(process.execPath,['scripts/render-why-ai-hallucinates.mjs','all',projectRoot]);
  run(process.execPath,['scripts/check-why-ai-hallucinates.mjs',projectRoot]);
  mkdirSync(dirname(outputs.cover),{recursive:true});
  run('npx',['--no-install','remotion','still','ki/src/reels/why-ai-hallucinates/remotion-entry.tsx','Reel-WhyAIHallucinates',outputs.cover,'--frame=0','--overwrite']);
  createContactSheet();
  writeReport('technical-build-completed-awaiting-manual-visual-approval');
  console.log('✓ Technischer Gesamtbuild abgeschlossen. Manuelle visuelle Freigabe bleibt erforderlich.');
}catch(error){writeReport('failed',error);throw error;}
