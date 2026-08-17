import React, {useMemo} from 'react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {
  AMBIGUOUS_PROMPTS_CAPTION_ZONE_Y,
  AMBIGUOUS_PROMPTS_SCENES,
  AMBIGUOUS_PROMPTS_SUBTITLES,
  type AmbiguousPromptCue,
  type AmbiguousPromptScene,
} from './contract';
import {BranchingPromptVisual, ChoiceVisual, ConstraintCollapseVisual, ExampleAnchorVisual, ThreeStepPromptVisual} from './Visuals';

const visualByScene: Record<string, React.FC> = {
  'ambiguous-01': BranchingPromptVisual,
  'ambiguous-02': ChoiceVisual,
  'ambiguous-03': ConstraintCollapseVisual,
  'ambiguous-04': ExampleAnchorVisual,
  'ambiguous-05': ThreeStepPromptVisual,
};

const iconPaths: Record<string, React.ReactNode> = {
  branches: <><path d="M8 7h6v6M14 10h5a5 5 0 0 1 5 5v2M14 10H9a5 5 0 0 0-5 5v2"/><circle cx="4" cy="22" r="2.5"/><circle cx="24" cy="22" r="2.5"/></>,
  choice: <><path d="M5 8h8M5 16h12M5 24h8"/><path d="M21 7l5 5-5 5"/></>,
  funnel: <><path d="M4 6h24l-9 10v8l-6 3V16z"/></>,
  example: <><rect x="4" y="5" width="24" height="22" rx="4"/><path d="M9 11h14M9 16h6M17 16h6M9 21h14"/></>,
  checklist: <><path d="M11 7h15M11 16h15M11 25h15"/><path d="M4 7l2 2 3-4M4 16l2 2 3-4M4 25l2 2 3-4"/></>,
};

const Header: React.FC<{scene: AmbiguousPromptScene}> = ({scene}) => {
  const frame=useCurrentFrame(); const enter=interpolate(frame,[0,18],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <div style={{position:'absolute',left:64,right:64,top:92,zIndex:50,display:'flex',justifyContent:'center',alignItems:'center',gap:22,opacity:enter,transform:`translateY(${(1-enter)*-20}px)`}}>
    <div style={{width:72,height:72,borderRadius:22,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(185,140,255,.16)',border:'1.5px solid rgba(110,69,201,.25)',color:BRAND.accentDk,boxShadow:'0 12px 30px rgba(110,69,201,.12)'}}><svg width="42" height="42" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{iconPaths[scene.icon] ?? iconPaths.choice}</svg></div>
    <div style={{maxWidth:820,textAlign:'center',fontFamily:BRAND.font,fontSize:scene.headline.length>25?50:58,lineHeight:1.02,fontWeight:900,letterSpacing:-1.8,color:BRAND.accentDk,textShadow:'0 7px 22px rgba(110,69,201,.11)'}}>{scene.headline}</div>
  </div>;
};

const activeWordIndex=(frame:number,cue:AmbiguousPromptCue,count:number):number=>{
  if(count<=1)return 0;
  if(cue.words?.length===count){const exact=cue.words.findIndex((w)=>frame>=w.startFrame&&frame<w.endFrame);if(exact>=0)return exact;}
  const prog=interpolate(frame,[cue.startFrame,Math.max(cue.startFrame+1,cue.endFrame-1)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return Math.min(count-1,Math.floor(prog*count));
};

const Captions: React.FC = () => {
  const frame=useCurrentFrame(); const cue=AMBIGUOUS_PROMPTS_SUBTITLES.find((c)=>frame>=c.startFrame&&frame<c.endFrame); if(!cue)return null;
  const words=cue.words?.length?cue.words.map((w)=>w.text):cue.text.trim().split(/\s+/).filter(Boolean); const active=activeWordIndex(frame,cue,words.length);
  const fade=Math.min(interpolate(frame,[cue.startFrame,cue.startFrame+4],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),interpolate(frame,[cue.endFrame-4,cue.endFrame],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}));
  return <div style={{position:'absolute',left:104,right:104,bottom:520,zIndex:200,display:'flex',justifyContent:'center',opacity:fade,pointerEvents:'none'}}><div style={{width:'100%',maxWidth:820,textAlign:'center',fontFamily:BRAND.font,fontSize:47,fontWeight:850,lineHeight:1.18,letterSpacing:-.8,color:BRAND.ink,textShadow:'0 2px 0 rgba(255,255,255,.98),0 0 15px rgba(255,255,255,.98),0 8px 30px rgba(26,26,46,.10)'}}>{words.map((word,i)=><React.Fragment key={`${cue.sceneId}-${cue.startFrame}-${i}`}><span style={{display:'inline-block',color:i===active?BRAND.accentDk:BRAND.ink,transform:`scale(${i===active?1.035:1})`,transformOrigin:'50% 70%'}}>{word}</span>{i<words.length-1?' ':null}</React.Fragment>)}</div></div>;
};

const SceneLayer: React.FC<{scene: AmbiguousPromptScene}> = ({scene}) => {const Visual=visualByScene[scene.sceneId]; if(!Visual) throw new Error(`missing NEW_BUILD visual for ${scene.sceneId}`); return <AbsoluteFill><Header scene={scene}/><div style={{position:'absolute',left:0,right:0,top:225,height:AMBIGUOUS_PROMPTS_CAPTION_ZONE_Y-225-30,overflow:'hidden',zIndex:20}}><Visual/></div></AbsoluteFill>};

export type ReelAmbiguousPromptsProps={voiceoverSrc?:string;showCaptions?:boolean};
export const ReelAmbiguousPrompts:React.FC<ReelAmbiguousPromptsProps>=({voiceoverSrc,showCaptions=true})=>{
  const scenes=useMemo(()=>AMBIGUOUS_PROMPTS_SCENES,[]);
  return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 35%, #FFFFFF 0%, #FAF8FC 58%, #F1EDF6 100%)',color:BRAND.ink,overflow:'hidden',fontFamily:BRAND.font}}>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(rgba(110,69,201,.025) 1px, transparent 1px),linear-gradient(90deg,rgba(110,69,201,.025) 1px,transparent 1px)',backgroundSize:'72px 72px',maskImage:'linear-gradient(to bottom,transparent 0%,black 14%,black 72%,transparent 88%)'}}/>
    {scenes.map((scene)=><Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame-scene.startFrame} name={`${scene.sceneId}-NEW_BUILD`}><SceneLayer scene={scene}/></Sequence>)}
    {voiceoverSrc?<Html5Audio src={voiceoverSrc}/>:null}
    {showCaptions?<Captions/>:null}
  </AbsoluteFill>;
};
