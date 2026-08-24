import React from 'react';
import {Archive,CheckCircle2,Download,Image,Trash2} from 'lucide-react';
import {AbsoluteFill,Html5Audio,Sequence,interpolate,useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {REEL_CAPTION_GLASS_STYLE,REEL_CAPTION_WRAPPER_STYLE} from '../captionSafe';
import {DALLE_ENDS_SCENES,DALLE_ENDS_SUBTITLES,DALLE_PALETTE as C,type DalleCue,type DalleScene} from './contract';
import {BackupVisual,ImagesStayVisual,ShutdownVisual,SummaryVisual,WhatStaysVisual} from './Visuals';

const visualByScene:Record<DalleScene['sceneId'],React.FC>={scene1:ShutdownVisual,scene2:ImagesStayVisual,scene3:BackupVisual,scene4:WhatStaysVisual,scene5:SummaryVisual};
const iconByScene:Record<DalleScene['sceneId'],React.ReactNode>={scene1:<Trash2 size={31}/>,scene2:<Image size={31}/>,scene3:<Download size={31}/>,scene4:<CheckCircle2 size={31}/>,scene5:<Archive size={31}/>};

const SceneHeader:React.FC<{scene:DalleScene}>=({scene})=>{const f=useCurrentFrame();const a=interpolate(f,[0,12],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <div style={{position:'absolute',left:58,right:58,top:112,zIndex:100,display:'flex',justifyContent:'center',opacity:a,transform:`translateY(${(1-a)*-14}px)`,pointerEvents:'none'}}><div style={{display:'inline-flex',alignItems:'center',gap:14,padding:'10px 18px 10px 12px',borderRadius:25,background:'rgba(255,255,255,.80)',border:'1px solid rgba(255,255,255,.72)',boxShadow:'0 12px 34px rgba(16,32,51,.10)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)'}}><div style={{width:58,height:58,borderRadius:19,display:'grid',placeItems:'center',background:`${scene.accent}18`,color:scene.accent}}>{iconByScene[scene.sceneId]}</div><div style={{fontFamily:BRAND.font,fontSize:scene.headline.length>24?37:42,lineHeight:1.03,fontWeight:950,letterSpacing:-1.35,color:C.ink,textAlign:'center'}}>{scene.headline}</div></div></div>};

const activeWordIndex=(frame:number,cue:DalleCue,words:string[])=>{
  if(cue.words?.length===words.length){const exact=cue.words.findIndex((w)=>frame>=w.startFrame&&frame<w.endFrame);if(exact>=0)return exact;}
  const progress=Math.max(0,Math.min(0.999,(frame-cue.startFrame)/Math.max(1,cue.endFrame-cue.startFrame)));
  return Math.min(words.length-1,Math.floor(progress*words.length));
};

const Captions:React.FC=()=>{const frame=useCurrentFrame();const cue=DALLE_ENDS_SUBTITLES.find((c)=>frame>=c.startFrame&&frame<c.endFrame);if(!cue)return null;const scene=DALLE_ENDS_SCENES.find((s)=>s.sceneId===cue.sceneId);const words=cue.words?.length?cue.words.map((w)=>w.text):cue.text.trim().split(/\s+/);const active=activeWordIndex(frame,cue,words);const alpha=Math.min(interpolate(frame,[cue.startFrame,cue.startFrame+3],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),interpolate(frame,[cue.endFrame-3,cue.endFrame],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}));return <div style={{...REEL_CAPTION_WRAPPER_STYLE,opacity:alpha}}><div style={{...REEL_CAPTION_GLASS_STYLE,fontFamily:BRAND.font,fontSize:44,fontWeight:880,lineHeight:1.16,letterSpacing:-.6,color:C.ink,textShadow:'0 1px 2px rgba(255,255,255,.5),0 8px 28px rgba(16,32,51,.14)'}}>{words.map((word,index)=><React.Fragment key={`${cue.id}-${index}`}><span style={{display:'inline-block',color:index===active?(scene?.accent??C.purple):C.ink,transform:`scale(${index===active?1.045:1})`}}>{word}</span>{index<words.length-1?' ':null}</React.Fragment>)}</div></div>};

const SceneLayer:React.FC<{scene:DalleScene}>=({scene})=>{const Visual=visualByScene[scene.sceneId];return <AbsoluteFill><Visual/><SceneHeader scene={scene}/></AbsoluteFill>};
export type ReelDalleGptEndsProps={voiceoverSrc?:string;showCaptions?:boolean};
export const ReelDalleGptEnds:React.FC<ReelDalleGptEndsProps>=({voiceoverSrc,showCaptions=true})=>{if(!voiceoverSrc)throw new Error('KI-DalleGptEnds requires a verified local voiceoverSrc. Run prepare-reel-render.mjs before production render.');return <AbsoluteFill style={{background:C.cloud,color:C.ink,fontFamily:BRAND.font,overflow:'hidden'}}>{DALLE_ENDS_SCENES.map((scene)=><Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame-scene.startFrame}><SceneLayer scene={scene}/></Sequence>)}<Html5Audio src={voiceoverSrc}/>{showCaptions?<Captions/>:null}</AbsoluteFill>};
