import reelJson from '../../../reels/2026-09-21_bis_2026-09-27/05_Claude-Opus-5-5-40-Prozent-guenstiger/06-projektdateien/reel.json';
import subtitleJson from '../../../reels/2026-09-21_bis_2026-09-27/05_Claude-Opus-5-5-40-Prozent-guenstiger/03-caption/subtitle-cues.json';
import {assertAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {assertSceneRichness} from '../../visual-system/sceneRichness';
import {REEL_CAPTION_SAFE} from '../captionSafe';
import {CLAUDE_OPUS55_SCENE_RICHNESS} from './richness';
import {CLAUDE_OPUS55_VISUAL_PROFILES} from './visualProfiles';
import './visualQuality';

export type ClaudeOpus55Scene={sceneId:string;startFrame:number;endFrame:number;headline:string;icon:string;implementation:'NEW_BUILD';spokenText:string;beatIds:readonly string[]};
export type ClaudeOpus55Cue={sceneId:string;startFrame:number;endFrame:number;text:string};
const reel=reelJson as {slug:string;format:{width:number;height:number;fps:number;durationInFrames:number};captionZoneStartY:number;visualBeatCount:number;scenes:ClaudeOpus55Scene[]};
const subtitles=subtitleJson as {fps:number;cues:ClaudeOpus55Cue[]};

export const CLAUDE_OPUS55_COMPOSITION_ID='KI-ClaudeOpus55';
export const CLAUDE_OPUS55_WIDTH=reel.format.width;
export const CLAUDE_OPUS55_HEIGHT=reel.format.height;
export const CLAUDE_OPUS55_FPS=reel.format.fps;
export const CLAUDE_OPUS55_DURATION_IN_FRAMES=reel.format.durationInFrames;
export const CLAUDE_OPUS55_SCENES=Object.freeze(reel.scenes.map(scene=>Object.freeze({...scene,beatIds:Object.freeze([...scene.beatIds])})));
export const CLAUDE_OPUS55_SUBTITLES=Object.freeze(subtitles.cues.map(cue=>Object.freeze({...cue})));

const normalize=(value:string)=>value.toLocaleLowerCase('de-DE').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[–—]/g,'-').replace(/[^\p{L}\p{N}.+$%-]+/gu,' ').trim().replace(/\s+/g,' ');
const wordCount=(value:string)=>value.trim().split(/\s+/).filter(Boolean).length;

export const assertClaudeOpus55Contract=():void=>{
  if(reel.slug!=='claude-opus-5-5')throw new Error('unexpected reel slug');
  if(CLAUDE_OPUS55_WIDTH!==1080||CLAUDE_OPUS55_HEIGHT!==1920||CLAUDE_OPUS55_FPS!==30)throw new Error('format must be 1080x1920 @30fps');
  if(reel.captionZoneStartY>REEL_CAPTION_SAFE.preferredVisualEndYMax)throw new Error('caption zone exceeds canonical visual end');
  if(CLAUDE_OPUS55_SCENES.length!==7)throw new Error('reel must contain seven scenes');
  if(reel.visualBeatCount!==14)throw new Error('reel must contain fourteen visual beats');
  let cursor=0;const sceneIds=new Set<string>();const beatIds=new Set<string>();
  for(const scene of CLAUDE_OPUS55_SCENES){
    if(scene.startFrame!==cursor||scene.endFrame<=scene.startFrame)throw new Error(`invalid scene range: ${scene.sceneId}`);
    if(sceneIds.has(scene.sceneId))throw new Error(`duplicate scene: ${scene.sceneId}`);
    if(scene.implementation!=='NEW_BUILD')throw new Error(`scene is not NEW_BUILD: ${scene.sceneId}`);
    scene.beatIds.forEach(beat=>{if(beatIds.has(beat))throw new Error(`duplicate beat: ${beat}`);beatIds.add(beat)});
    sceneIds.add(scene.sceneId);cursor=scene.endFrame;
  }
  if(cursor!==CLAUDE_OPUS55_DURATION_IN_FRAMES)throw new Error('scenes do not cover composition');
  if(beatIds.size!==14)throw new Error('expected fourteen unique beats');
  for(const scene of CLAUDE_OPUS55_SCENES){
    const cues=CLAUDE_OPUS55_SUBTITLES.filter(cue=>cue.sceneId===scene.sceneId).sort((a,b)=>a.startFrame-b.startFrame);
    if(cues.length<3)throw new Error(`too few subtitle cues: ${scene.sceneId}`);
    if(cues.some(cue=>cue.startFrame<scene.startFrame||cue.endFrame>scene.endFrame))throw new Error(`subtitle outside scene: ${scene.sceneId}`);
    if(cues.some(cue=>wordCount(cue.text)>REEL_CAPTION_SAFE.maxWordsPerGroup))throw new Error(`caption too long: ${scene.sceneId}`);
    if(normalize(cues.map(cue=>cue.text).join(' '))!==normalize(scene.spokenText))throw new Error(`subtitle mismatch: ${scene.sceneId}`);
  }
  const planned=CLAUDE_OPUS55_SCENES.map(scene=>scene.sceneId).join('|');
  if(planned!==CLAUDE_OPUS55_VISUAL_PROFILES.map(profile=>profile.sceneId).join('|'))throw new Error('visual profiles must cover scene order');
  if(planned!==CLAUDE_OPUS55_SCENE_RICHNESS.map(scene=>scene.sceneId).join('|'))throw new Error('scene richness must cover scene order');
  assertAuthoredVisualDiversity(CLAUDE_OPUS55_VISUAL_PROFILES);
  assertSceneRichness(CLAUDE_OPUS55_SCENE_RICHNESS,{requireBrandAnchorInHook:true,minBrandCoverageRatio:.85,minAverageSupportElements:5,minAverageMicroBeats:4});
};

assertClaudeOpus55Contract();
