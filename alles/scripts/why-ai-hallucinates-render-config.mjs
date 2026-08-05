import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

export const getHallucinationRenderConfig=(projectArg)=>{
  const reelRoot=projectArg
    ? resolve(projectArg)
    : resolve('..','reels','2026-08-03_bis_2026-08-09','mittwoch','reel-01_warum-ki-halluziniert');
  const contract=JSON.parse(readFileSync(resolve(reelRoot,'timeline','codex-reel-package.json'),'utf8'));
  return Object.freeze({
    reelRoot,
    entryPoint:'ki/src/reels/why-ai-hallucinates/remotion-entry.tsx',
    compositionId:contract.composition.id,
    width:contract.composition.width,
    height:contract.composition.height,
    fps:contract.composition.fps,
    durationInFrames:contract.composition.durationInFrames,
    checkpoints:Object.freeze([...contract.checkpoints]),
    smokeCheckpoints:Object.freeze([0,214,484,754,1030,1079]),
    stillOutput:resolve(reelRoot,'render'),
    videoOutput:resolve(reelRoot,'06-video','final-reel.mp4'),
    reportOutput:resolve(reelRoot,'05-review','codex-render-qa.json'),
  });
};
