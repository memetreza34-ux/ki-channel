import reelJson from '../../../reels/2026-09-21_bis_2026-09-27/04_GPT-5-5-fliegt-aus-ChatGPT-raus/06-projektdateien/reel.json';
import subtitleJson from '../../../reels/2026-09-21_bis_2026-09-27/04_GPT-5-5-fliegt-aus-ChatGPT-raus/03-caption/subtitle-cues.json';
import {assertAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {assertSceneRichness} from '../../visual-system/sceneRichness';
import {REEL_CAPTION_SAFE} from '../captionSafe';
import {GPT55_SCENE_RICHNESS} from './richness';
import {GPT55_VISUAL_PROFILES} from './visualProfiles';

export type Gpt55Scene={sceneId:string;startFrame:number;endFrame:number;headline:string;icon:string;implementation:'NEW_BUILD';spokenText:string;beatIds:readonly string[]};
export type Gpt55Cue={sceneId:string;startFrame:number;endFrame:number;text:string;words?:Array<{text:string;startFrame:number;endFrame:number}>};
const reel=reelJson as {slug:string;format:{width:number;height:number;fps:number;durationInFrames:number};captionZoneStartY:number;visualBeatCount:number;scenes:Gpt55Scene[]};
const subtitles=subtitleJson as {fps:number;cues:Gpt55Cue[]};

export const GPT55_COMPOSITION_ID='KI-Gpt55Retirement';
export const GPT55_WIDTH=reel.format.width;
export const GPT55_HEIGHT=reel.format.height;
export const GPT55_FPS=reel.format.fps;
export const GPT55_DURATION_IN_FRAMES=reel.format.durationInFrames;
export const GPT55_SCENES=Object.freeze(reel.scenes.map((scene)=>Object.freeze({...scene,beatIds:Object.freeze([...scene.beatIds])})));
export const GPT55_SUBTITLES=Object.freeze(subtitles.cues.map((cue)=>Object.freeze({...cue})));

const normalize=(value:string)=>value.toLocaleLowerCase('de-DE').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[–—]/g,'-').replace(/[^\p{L}\p{N}.+-]+/gu,' ').trim().replace(/\s+/g,' ');
const wordCount=(value:string)=>value.trim().split(/\s+/).filter(Boolean).length;

export const assertGpt55Contract=():void=>{
  if(reel.slug!=='gpt-5-5-retirement')throw new Error('unexpected reel slug');
  if(GPT55_WIDTH!==1080||GPT55_HEIGHT!==1920||GPT55_FPS!==30)throw new Error('format must be 1080x1920 @30fps');
  if(reel.captionZoneStartY>REEL_CAPTION_SAFE.preferredVisualEndYMax)throw new Error('caption zone exceeds canonical visual end');
  if(GPT55_SCENES.length!==6)throw new Error('reel must contain six scenes');
  if(reel.visualBeatCount!==12)throw new Error('reel must contain twelve visual beats');
  let cursor=0;const sceneIds=new Set<string>();const beatIds=new Set<string>();
  for(const scene of GPT55_SCENES){
    if(scene.startFrame!==cursor||scene.endFrame<=scene.startFrame)throw new Error(`invalid scene range: ${scene.sceneId}`);
    if(sceneIds.has(scene.sceneId))throw new Error(`duplicate scene: ${scene.sceneId}`);
    if(scene.implementation!=='NEW_BUILD')throw new Error(`scene is not NEW_BUILD: ${scene.sceneId}`);
    scene.beatIds.forEach((beat)=>{if(beatIds.has(beat))throw new Error(`duplicate beat: ${beat}`);beatIds.add(beat)});
    sceneIds.add(scene.sceneId);cursor=scene.endFrame;
  }
  if(cursor!==GPT55_DURATION_IN_FRAMES)throw new Error('scenes do not cover composition');
  if(beatIds.size!==12)throw new Error('expected twelve unique beats');
  for(const scene of GPT55_SCENES){
    const cues=GPT55_SUBTITLES.filter((cue)=>cue.sceneId===scene.sceneId).sort((a,b)=>a.startFrame-b.startFrame);
    if(cues.length<3)throw new Error(`too few subtitle cues: ${scene.sceneId}`);
    if(cues.some((cue)=>cue.startFrame<scene.startFrame||cue.endFrame>scene.endFrame))throw new Error(`subtitle outside scene: ${scene.sceneId}`);
    if(cues.some((cue)=>wordCount(cue.text)>REEL_CAPTION_SAFE.maxWordsPerGroup))throw new Error(`caption group exceeds ${REEL_CAPTION_SAFE.maxWordsPerGroup} words: ${scene.sceneId}`);
    if(cues.some((cue)=>cue.text.split('\n').length>REEL_CAPTION_SAFE.maxVisibleLines))throw new Error(`caption group exceeds ${REEL_CAPTION_SAFE.maxVisibleLines} lines: ${scene.sceneId}`);
    if(normalize(cues.map((cue)=>cue.text).join(' '))!==normalize(scene.spokenText))throw new Error(`subtitle mismatch: ${scene.sceneId}`);
  }
  const planned=GPT55_SCENES.map((scene)=>scene.sceneId).join('|');
  const profiled=GPT55_VISUAL_PROFILES.map((profile)=>profile.sceneId).join('|');
  const rich=GPT55_SCENE_RICHNESS.map((scene)=>scene.sceneId).join('|');
  if(planned!==profiled)throw new Error('visual profiles must cover scene order');
  if(planned!==rich)throw new Error('scene richness manifest must cover scene order');
  assertAuthoredVisualDiversity(GPT55_VISUAL_PROFILES);
  assertSceneRichness(GPT55_SCENE_RICHNESS,{requireBrandAnchorInHook:true,minBrandCoverageRatio:0.8,minAverageSupportElements:4,minAverageMicroBeats:3.5});
};

assertGpt55Contract();
