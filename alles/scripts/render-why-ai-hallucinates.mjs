import {spawn} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {getHallucinationRenderConfig} from './why-ai-hallucinates-render-config.mjs';

const mode=process.argv[2]??'plan';
const projectArg=process.argv[3];
if(!new Set(['plan','smoke','stills','video','all']).has(mode))throw new Error(`Unbekannter Modus: ${mode}`);
const config=getHallucinationRenderConfig(projectArg);
const checkpoints=mode==='smoke'?[...config.smokeCheckpoints]:[...config.checkpoints];
const plan={version:2,reelRoot:config.reelRoot,entryPoint:config.entryPoint,compositionId:config.compositionId,width:config.width,height:config.height,fps:config.fps,durationInFrames:config.durationInFrames,checkpoints};
await mkdir(config.stillOutput,{recursive:true});
await writeFile(resolve(config.reelRoot,'timeline','render-plan.json'),`${JSON.stringify(plan,null,2)}\n`,'utf8');
if(mode==='plan'){console.log(JSON.stringify(plan,null,2));process.exit(0);}

const run=(command,args)=>new Promise((resolvePromise,reject)=>{
  const child=spawn(command,args,{stdio:'inherit',shell:process.platform==='win32'});
  child.on('error',reject);
  child.on('exit',(code)=>code===0?resolvePromise():reject(new Error(`${command} ${args.join(' ')} endete mit Code ${code}`)));
});

await run(process.execPath,['scripts/stage-why-ai-hallucinates-assets.mjs',config.reelRoot]);
if(new Set(['smoke','stills','all']).has(mode)){
  for(const frame of checkpoints){
    const output=resolve(config.stillOutput,`frame-${String(frame).padStart(4,'0')}.png`);
    await run('npx',['--no-install','remotion','still',config.entryPoint,config.compositionId,output,`--frame=${frame}`,'--overwrite']);
  }
}
if(new Set(['video','all']).has(mode)){
  await mkdir(dirname(config.videoOutput),{recursive:true});
  await run('npx',['--no-install','remotion','render',config.entryPoint,config.compositionId,config.videoOutput,'--codec=h264','--crf=18','--audio-codec=aac','--overwrite']);
}
console.log(`✓ Render abgeschlossen: ${config.reelRoot}`);
