import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

export const getMisunderstandsRenderConfig=(projectArg)=>{
  const reelRoot=projectArg
    ? resolve(projectArg)
    : resolve('..','reels','2026-08-03_bis_2026-08-09','donnerstag','reel-01_warum-ki-dich-missversteht');
  const contract=JSON.parse(readFileSync(resolve(reelRoot,'timeline','codex-reel-package.json'),'utf8'));
  return Object.freeze({
    reelRoot,
    entryPoint:'ki/src/reels/why-ai-misunderstands-you/remotion-entry.tsx',
    compositionId:contract.composition.id,
    coverId:contract.composition.coverId,
    width:contract.composition.width,
    height:contract.composition.height,
    fps:contract.composition.fps,
    durationInFrames:contract.composition.durationInFrames,
    checkpoints:Object.freeze([...contract.checkpoints]),
    smokeCheckpoints:Object.freeze([0,274,499,759,973,1208,1448,1659,1873,1949]),
    stillOutput:resolve(reelRoot,'render'),
    videoOutput:resolve(reelRoot,'06-video','final-reel.mp4'),
    coverOutput:resolve(reelRoot,'00-cover','final-cover.png'),
    contactSheetOutput:resolve(reelRoot,'05-review','contact-sheet.png'),
    reportOutput:resolve(reelRoot,'05-review','codex-render-qa.json'),
  });
};
