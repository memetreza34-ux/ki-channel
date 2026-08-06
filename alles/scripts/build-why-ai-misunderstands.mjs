import {spawn} from 'node:child_process';
import {getMisunderstandsRenderConfig} from './why-ai-misunderstands-render-config.mjs';

const config=getMisunderstandsRenderConfig(process.argv[2]);
const run=(command,args)=>new Promise((resolvePromise,reject)=>{
  const child=spawn(command,args,{stdio:'inherit',shell:process.platform==='win32'});
  child.on('error',reject);
  child.on('exit',(code)=>code===0?resolvePromise():reject(new Error(`${command} ${args.join(' ')} endete mit Code ${code}`)));
});

await run(process.execPath,['scripts/validate-future-reel-standard.mjs',config.reelRoot,'--final']);
await run(process.execPath,['scripts/stage-why-ai-misunderstands-audio.mjs',config.reelRoot]);
await run('npm',['run','motion:typecheck']);
await run('npx',['--no-install','vitest','run','ki/src/reels/why-ai-misunderstands-you/__tests__']);
await run(process.execPath,['scripts/render-why-ai-misunderstands.mjs','all',config.reelRoot]);
await run(process.execPath,['scripts/check-why-ai-misunderstands.mjs',config.reelRoot]);
console.log('✓ Gesamtbuild technisch abgeschlossen. Visuelle Prüfung und Nutzerfreigabe bleiben erforderlich.');
