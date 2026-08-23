import React from 'react';
import {BookOpenCheck, BrainCircuit, GraduationCap, HelpCircle, Sparkles} from 'lucide-react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {BalancedEndingVisual, GuidedStepsVisual, InstantAnswerVisual, StudySwitchVisual, UnderstandPathVisual} from './Visuals';
import {STUDY_MODE_SCENES, STUDY_MODE_SUBTITLES, STUDY_PALETTE as C, type StudyCue, type StudyScene} from './contract';
import {STUDY_MODE_GENERATED_VOICEOVER_URL} from './audio';

const visualByScene: Record<StudyScene['sceneId'], React.FC> = {
  scene1: StudySwitchVisual,
  scene2: InstantAnswerVisual,
  scene3: GuidedStepsVisual,
  scene4: UnderstandPathVisual,
  scene5: BalancedEndingVisual,
};

const iconByScene: Record<StudyScene['sceneId'], React.ReactNode> = {
  scene1: <Sparkles size={31}/>,
  scene2: <BrainCircuit size={31}/>,
  scene3: <BookOpenCheck size={31}/>,
  scene4: <GraduationCap size={31}/>,
  scene5: <HelpCircle size={31}/>,
};

const FONT = 'Inter, Arial, sans-serif';

const SceneHeader: React.FC<{scene:StudyScene}> = ({scene}) => {
  const frame=useCurrentFrame();
  const enter=interpolate(frame,[0,12],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <div style={{position:'absolute',left:58,right:58,top:112,zIndex:100,display:'flex',justifyContent:'center',opacity:enter,transform:`translateY(${(1-enter)*-14}px)`,pointerEvents:'none'}}>
    <div style={{display:'inline-flex',alignItems:'center',gap:14,padding:'10px 18px 10px 12px',borderRadius:25,background:'rgba(255,255,255,.80)',border:'1px solid rgba(255,255,255,.70)',boxShadow:'0 12px 34px rgba(16,32,51,.10)',backdropFilter:'blur(12px)'}}>
      <div style={{width:58,height:58,borderRadius:19,display:'grid',placeItems:'center',background:scene.surface,color:scene.accent,border:`1px solid ${scene.accent}45`}}>{iconByScene[scene.sceneId]}</div>
      <div style={{fontFamily:FONT,fontSize:scene.headline.length>27?36:42,lineHeight:1.03,fontWeight:950,letterSpacing:-1.35,color:C.ink,textAlign:'center'}}>{scene.headline}</div>
    </div>
  </div>;
};

const activeWord = (frame:number,cue:StudyCue,words:string[]) => {
  if (!cue.words || cue.words.length!==words.length) return -1;
  return cue.words.findIndex((word)=>frame>=word.startFrame && frame<word.endFrame);
};

const Captions: React.FC = () => {
  const frame=useCurrentFrame();
  const cue=STUDY_MODE_SUBTITLES.find((item)=>frame>=item.startFrame && frame<item.endFrame);
  if (!cue) return null;
  const scene=STUDY_MODE_SCENES.find((item)=>item.sceneId===cue.sceneId);
  const words=cue.words?.length?cue.words.map((word)=>word.text):cue.text.trim().split(/\s+/);
  const active=activeWord(frame,cue,words);
  const alpha=Math.min(
    interpolate(frame,[cue.startFrame,cue.startFrame+3],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),
    interpolate(frame,[cue.endFrame-3,cue.endFrame],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),
  );
  const accent=scene?.accent??C.purple;
  return <div style={{position:'absolute',left:104,right:104,bottom:250,zIndex:220,display:'flex',justifyContent:'center',opacity:alpha,pointerEvents:'none'}}>
    <div style={{width:'100%',maxWidth:860,textAlign:'center',fontFamily:FONT,fontSize:44,fontWeight:880,lineHeight:1.16,letterSpacing:-.55,color:C.ink,background:'rgba(255,255,255,.60)',border:'1px solid rgba(255,255,255,.66)',borderRadius:26,padding:'15px 22px 17px',boxShadow:'0 12px 34px rgba(16,32,51,.11)',backdropFilter:'blur(12px)',textShadow:'0 1px 2px rgba(255,255,255,.55),0 8px 24px rgba(16,32,51,.10)'}}>
      {words.map((word,index)=><React.Fragment key={`${cue.id}-${index}`}><span style={{display:'inline-block',color:index===active?accent:C.ink,transform:`scale(${index===active?1.045:1})`}}>{word}</span>{index<words.length-1?' ':null}</React.Fragment>)}
    </div>
  </div>;
};

const SceneLayer: React.FC<{scene:StudyScene}> = ({scene}) => {
  const Visual=visualByScene[scene.sceneId];
  return <AbsoluteFill><Visual/><SceneHeader scene={scene}/></AbsoluteFill>;
};

export type ReelChatGPTStudyModeProps = {voiceoverSrc?:string;showCaptions?:boolean};

export const ReelChatGPTStudyMode: React.FC<ReelChatGPTStudyModeProps> = ({voiceoverSrc=STUDY_MODE_GENERATED_VOICEOVER_URL,showCaptions=true}) => (
  <AbsoluteFill style={{background:C.cloud,color:C.ink,fontFamily:FONT,overflow:'hidden'}}>
    {STUDY_MODE_SCENES.map((scene)=><Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame-scene.startFrame} name={`STUDY-${scene.sceneId}`}><SceneLayer scene={scene}/></Sequence>)}
    <Html5Audio src={voiceoverSrc}/>
    {showCaptions?<Captions/>:null}
  </AbsoluteFill>
);
