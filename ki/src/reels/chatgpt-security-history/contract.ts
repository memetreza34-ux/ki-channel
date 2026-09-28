import reelJson from '../../../reels/2026-09-28_bis_2026-10-04/01_ChatGPT-Sicherheitsverlauf/06-projektdateien/reel.json';
import subtitleJson from '../../../reels/2026-09-28_bis_2026-10-04/01_ChatGPT-Sicherheitsverlauf/03-caption/subtitle-cues.json';
import {assertAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {assertSceneRichness} from '../../visual-system/sceneRichness';
import {REEL_CAPTION_SAFE} from '../captionSafe';
import {CHATGPT_SECURITY_SCENE_RICHNESS} from './richness';
import {CHATGPT_SECURITY_VISUAL_PROFILES} from './visualProfiles';
import './visualQuality';

export type ChatGPTSecurityScene={sceneId:string;startFrame:number;endFrame:number;headline:string;icon:string;implementation:'NEW_BUILD';spokenText:string;beatIds:readonly string[]};
export type ChatGPTSecurityCue={sceneId:string;startFrame:number;endFrame:number;text:string};
const reel=reelJson as {slug:string;format:{width:number;height:number;fps:number;durationInFrames:number};captionZoneStartY:number;visualBeatCount:number;scenes:ChatGPTSecurityScene[]};
const subtitles=subtitleJson as {fps:number;cues:ChatGPTSecurityCue[]};

export const CHATGPT_SECURITY_COMPOSITION_ID='KI-ChatGPTSecurityHistory';
export const CHATGPT_SECURITY_WIDTH=reel.format.width;
export const CHATGPT_SECURITY_HEIGHT=reel.format.height;
export const CHATGPT_SECURITY_FPS=reel.format.fps;
export const CHATGPT_SECURITY_DURATION_IN_FRAMES=reel.format.durationInFrames;
export const CHATGPT_SECURITY_SCENES=Object.freeze(reel.scenes.map((scene)=>Object.freeze({...scene,beatIds:Object.freeze([...scene.beatIds])})));
export const CHATGPT_SECURITY_SUBTITLES=Object.freeze(subtitles.cues.map((cue)=>Object.freeze({...cue})));

const normalize=(value:string)=>value.toLocaleLowerCase('de-DE').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[–—]/g,'-').replace(/[^\p{L}\p{N}.+-]+/gu,' ').trim().replace(/\s+/g,' ');
const wordCount=(value:string)=>value.trim().split(/\s+/).filter(Boolean).length;

export const assertChatGPTSecurityContract=():void=>{
  if(reel.slug!=='chatgpt-security-history')throw new Error('unexpected reel slug');
  if(CHATGPT_SECURITY_WIDTH!==1080||CHATGPT_SECURITY_HEIGHT!==1920||CHATGPT_SECURITY_FPS!==30)throw new Error('format must be 1080x1920 @30fps');
  if(CHATGPT_SECURITY_DURATION_IN_FRAMES!==720)throw new Error('V4 probe must be 720 frames');
  if(reel.captionZoneStartY>REEL_CAPTION_SAFE.preferredVisualEndYMax)throw new Error('caption zone exceeds canonical visual end');
  if(CHATGPT_SECURITY_SCENES.length!==4)throw new Error('V4 probe must contain four scenes');
  if(reel.visualBeatCount!==4)throw new Error('V4 probe must contain four primary visual beats');
  let cursor=0;const ids=new Set<string>();
  for(const scene of CHATGPT_SECURITY_SCENES){if(scene.startFrame!==cursor||scene.endFrame<=scene.startFrame)throw new Error(`invalid scene range: ${scene.sceneId}`);if(ids.has(scene.sceneId))throw new Error(`duplicate scene: ${scene.sceneId}`);ids.add(scene.sceneId);cursor=scene.endFrame;}
  if(cursor!==CHATGPT_SECURITY_DURATION_IN_FRAMES)throw new Error('scenes do not cover composition');
  for(const scene of CHATGPT_SECURITY_SCENES){const cues=CHATGPT_SECURITY_SUBTITLES.filter((cue)=>cue.sceneId===scene.sceneId).sort((a,b)=>a.startFrame-b.startFrame);if(cues.length<2)throw new Error(`too few subtitle cues: ${scene.sceneId}`);if(cues.some((cue)=>cue.startFrame<scene.startFrame||cue.endFrame>scene.endFrame))throw new Error(`subtitle outside scene: ${scene.sceneId}`);if(cues.some((cue)=>wordCount(cue.text)>REEL_CAPTION_SAFE.maxWordsPerGroup))throw new Error(`caption group too long: ${scene.sceneId}`);}
  const planned=CHATGPT_SECURITY_SCENES.map((scene)=>scene.sceneId).join('|');
  if(planned!==CHATGPT_SECURITY_VISUAL_PROFILES.map((scene)=>scene.sceneId).join('|'))throw new Error('visual profiles must cover scene order');
  if(planned!==CHATGPT_SECURITY_SCENE_RICHNESS.map((scene)=>scene.sceneId).join('|'))throw new Error('scene richness must cover scene order');
  assertAuthoredVisualDiversity(CHATGPT_SECURITY_VISUAL_PROFILES);
  assertSceneRichness(CHATGPT_SECURITY_SCENE_RICHNESS,{requireBrandAnchorInHook:true,minBrandCoverageRatio:1,minAverageSupportElements:5,minAverageMicroBeats:3});
};

assertChatGPTSecurityContract();
