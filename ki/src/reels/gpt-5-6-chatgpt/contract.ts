import reelJson from '../../../reels/2026-09-21_bis_2026-09-27/03_GPT-5-6-welches-ChatGPT-nutzt-du/06-projektdateien/reel.json';
import subtitleJson from '../../../reels/2026-09-21_bis_2026-09-27/03_GPT-5-6-welches-ChatGPT-nutzt-du/03-caption/subtitle-cues.json';
import {assertAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {REEL_CAPTION_SAFE} from '../captionSafe';
import {GPT56_VISUAL_PROFILES} from './visualProfiles';

export type Gpt56Scene={sceneId:string;startFrame:number;endFrame:number;headline:string;icon:string;implementation:'NEW_BUILD';spokenText:string;beatIds:readonly string[]};
export type Gpt56Cue={sceneId:string;startFrame:number;endFrame:number;text:string;words?:Array<{text:string;startFrame:number;endFrame:number}>};
const reel=reelJson as {slug:string;format:{width:number;height:number;fps:number;durationInFrames:number};captionZoneStartY:number;visualBeatCount:number;scenes:Gpt56Scene[]};
const subtitles=subtitleJson as {fps:number;cues:Gpt56Cue[]};

export const GPT56_COMPOSITION_ID='KI-Gpt56ChatGPT';
export const GPT56_WIDTH=reel.format.width;
export const GPT56_HEIGHT=reel.format.height;
export const GPT56_FPS=reel.format.fps;
export const GPT56_DURATION_IN_FRAMES=reel.format.durationInFrames;
export const GPT56_SCENES=Object.freeze(reel.scenes.map((scene)=>Object.freeze({...scene,beatIds:Object.freeze([...scene.beatIds])})));
export const GPT56_SUBTITLES=Object.freeze(subtitles.cues.map((cue)=>Object.freeze({...cue})));

const normalize=(value:string)=>value.toLocaleLowerCase('de-DE').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[–—]/g,'-').replace(/[^\p{L}\p{N}.+-]+/gu,' ').trim().replace(/\s+/g,' ');
const wordCount=(value:string)=>value.trim().split(/\s+/).filter(Boolean).length;

export const assertGpt56Contract=():void=>{
  if(reel.slug!=='gpt-5-6-chatgpt')throw new Error('unexpected reel slug');
  if(GPT56_WIDTH!==1080||GPT56_HEIGHT!==1920||GPT56_FPS!==30)throw new Error('format must be 1080x1920 @30fps');
  if(reel.captionZoneStartY>REEL_CAPTION_SAFE.preferredVisualEndYMax)throw new Error('caption zone exceeds canonical visual end');
  if(GPT56_SCENES.length!==7)throw new Error('reel must contain seven scenes');
  if(reel.visualBeatCount!==14)throw new Error('reel must contain fourteen visual beats');
  let cursor=0;const sceneIds=new Set<string>();const beatIds=new Set<string>();
  for(const scene of GPT56_SCENES){
    if(scene.startFrame!==cursor||scene.endFrame<=scene.startFrame)throw new Error(`invalid scene range: ${scene.sceneId}`);
    if(sceneIds.has(scene.sceneId))throw new Error(`duplicate scene: ${scene.sceneId}`);
    if(scene.implementation!=='NEW_BUILD')throw new Error(`scene is not NEW_BUILD: ${scene.sceneId}`);
    scene.beatIds.forEach((beat)=>{if(beatIds.has(beat))throw new Error(`duplicate beat: ${beat}`);beatIds.add(beat)});
    sceneIds.add(scene.sceneId);cursor=scene.endFrame;
  }
  if(cursor!==GPT56_DURATION_IN_FRAMES)throw new Error('scenes do not cover composition');
  if(beatIds.size!==14)throw new Error('expected fourteen unique beats');
  for(const scene of GPT56_SCENES){
    const cues=GPT56_SUBTITLES.filter((cue)=>cue.sceneId===scene.sceneId).sort((a,b)=>a.startFrame-b.startFrame);
    if(cues.length<3)throw new Error(`too few subtitle cues: ${scene.sceneId}`);
    if(cues.some((cue)=>cue.startFrame<scene.startFrame||cue.endFrame>scene.endFrame))throw new Error(`subtitle outside scene: ${scene.sceneId}`);
    if(cues.some((cue)=>wordCount(cue.text)>REEL_CAPTION_SAFE.maxWordsPerGroup))throw new Error(`caption group exceeds ${REEL_CAPTION_SAFE.maxWordsPerGroup} words: ${scene.sceneId}`);
    if(cues.some((cue)=>cue.text.split('\n').length>REEL_CAPTION_SAFE.maxVisibleLines))throw new Error(`caption group exceeds ${REEL_CAPTION_SAFE.maxVisibleLines} lines: ${scene.sceneId}`);
    if(normalize(cues.map((cue)=>cue.text).join(' '))!==normalize(scene.spokenText))throw new Error(`subtitle mismatch: ${scene.sceneId}`);
  }
  const planned=GPT56_SCENES.map((scene)=>scene.sceneId).join('|');
  const profiled=GPT56_VISUAL_PROFILES.map((profile)=>profile.sceneId).join('|');
  if(planned!==profiled)throw new Error('visual profiles must cover scene order');
  assertAuthoredVisualDiversity(GPT56_VISUAL_PROFILES);
};

assertGpt56Contract();
