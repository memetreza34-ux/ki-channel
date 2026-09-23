import reelJson from '../../../reels/2026-09-21_bis_2026-09-27/02_Warum-KI-deine-PDF-manchmal-falsch-beantwortet/06-projektdateien/reel.json';
import subtitleJson from '../../../reels/2026-09-21_bis_2026-09-27/02_Warum-KI-deine-PDF-manchmal-falsch-beantwortet/03-caption/subtitle-cues.json';
import {assertAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {PDF_RETRIEVAL_VISUAL_PROFILES} from './visualProfiles';

export type PdfRetrievalScene={sceneId:string;startFrame:number;endFrame:number;headline:string;icon:string;implementation:'NEW_BUILD';spokenText:string;beatIds:readonly string[]};
export type PdfRetrievalCue={sceneId:string;startFrame:number;endFrame:number;text:string;words?:Array<{text:string;startFrame:number;endFrame:number}>};
const reel=reelJson as {slug:string;format:{width:number;height:number;fps:number;durationInFrames:number};captionZoneStartY:number;visualBeatCount:number;scenes:PdfRetrievalScene[]};
const subtitles=subtitleJson as {fps:number;cues:PdfRetrievalCue[]};
export const PDF_RETRIEVAL_COMPOSITION_ID='KI-PdfRetrieval';
export const PDF_RETRIEVAL_WIDTH=reel.format.width;
export const PDF_RETRIEVAL_HEIGHT=reel.format.height;
export const PDF_RETRIEVAL_FPS=reel.format.fps;
export const PDF_RETRIEVAL_DURATION_IN_FRAMES=reel.format.durationInFrames;
export const PDF_RETRIEVAL_SCENES=Object.freeze(reel.scenes.map((scene)=>Object.freeze({...scene,beatIds:Object.freeze([...scene.beatIds])})));
export const PDF_RETRIEVAL_SUBTITLES=Object.freeze(subtitles.cues.map((cue)=>Object.freeze({...cue})));
export const normalizePdfText=(value:string)=>value.toLocaleLowerCase('de-DE').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[–—]/g,'-').replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ');
export const assertPdfRetrievalContract=():void=>{
  if(reel.slug!=='pdf-retrieval')throw new Error('unexpected reel slug');
  if(PDF_RETRIEVAL_WIDTH!==1080||PDF_RETRIEVAL_HEIGHT!==1920||PDF_RETRIEVAL_FPS!==30)throw new Error('format must be 1080x1920 @30fps');
  if(reel.captionZoneStartY!==1450)throw new Error('caption zone must start at y=1450');
  if(PDF_RETRIEVAL_SCENES.length!==5)throw new Error('reel must contain five scenes');
  if(reel.visualBeatCount!==15)throw new Error('reel must contain fifteen visual beats');
  let cursor=0;const ids=new Set<string>();const beats=new Set<string>();
  for(const scene of PDF_RETRIEVAL_SCENES){if(scene.startFrame!==cursor||scene.endFrame<=scene.startFrame)throw new Error(`invalid scene range: ${scene.sceneId}`);if(ids.has(scene.sceneId))throw new Error(`duplicate scene: ${scene.sceneId}`);if(scene.implementation!=='NEW_BUILD')throw new Error(`scene is not NEW_BUILD: ${scene.sceneId}`);scene.beatIds.forEach((beat)=>{if(beats.has(beat))throw new Error(`duplicate beat: ${beat}`);beats.add(beat)});ids.add(scene.sceneId);cursor=scene.endFrame;}
  if(cursor!==PDF_RETRIEVAL_DURATION_IN_FRAMES)throw new Error('scenes do not cover composition');
  if(beats.size!==15)throw new Error('expected fifteen unique beats');
  for(const scene of PDF_RETRIEVAL_SCENES){const cues=PDF_RETRIEVAL_SUBTITLES.filter((cue)=>cue.sceneId===scene.sceneId).sort((a,b)=>a.startFrame-b.startFrame);if(cues.length<2)throw new Error(`too few cues: ${scene.sceneId}`);if(cues.some((cue)=>cue.startFrame<scene.startFrame||cue.endFrame>scene.endFrame))throw new Error(`subtitle outside scene: ${scene.sceneId}`);if(normalizePdfText(cues.map((cue)=>cue.text).join(' '))!==normalizePdfText(scene.spokenText))throw new Error(`subtitle mismatch: ${scene.sceneId}`);}
  const planned=PDF_RETRIEVAL_SCENES.map((scene)=>scene.sceneId).join('|');const profiled=PDF_RETRIEVAL_VISUAL_PROFILES.map((profile)=>profile.sceneId).join('|');if(planned!==profiled)throw new Error('visual profiles must cover scene order');
  assertAuthoredVisualDiversity(PDF_RETRIEVAL_VISUAL_PROFILES);
};
assertPdfRetrievalContract();
