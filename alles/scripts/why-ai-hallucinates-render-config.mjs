import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const reelRoot=resolve('..','reels','2026-08-03_bis_2026-08-09','mittwoch','reel-01_warum-ki-halluziniert');
const contract=JSON.parse(readFileSync(resolve(reelRoot,'timeline','reel.json'),'utf8'));

export const HALLUCINATION_RENDER_CONFIG=Object.freeze({
  reelRoot,
  entryPoint:'ki/src/reels/why-ai-hallucinates/remotion-entry.tsx',
  compositionId:contract.compositionId,
  width:contract.format.width,
  height:contract.format.height,
  fps:contract.format.fps,
  durationInFrames:contract.format.durationInFrames,
  checkpoints:Object.freeze([...contract.checkpoints]),
  smokeCheckpoints:Object.freeze([0,214,484,754,1030,1079]),
  stillOutput:resolve(reelRoot,'render'),
  videoOutput:resolve(reelRoot,'06-video','warum-ki-halluziniert.mp4'),
  reportOutput:resolve(reelRoot,'timeline','release-report.json'),
});
