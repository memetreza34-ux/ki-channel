import React, {useMemo} from 'react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {AI_APP_CAPTION_ZONE_Y, AI_APP_SCENES, AI_APP_SUBTITLES, type AIAppCue, type AIAppScene} from './contract';
import {CodeAssemblyVisual, IdeaToPrototypeVisual, StructurePlanVisual, TestFixVisual, WorkflowVisual} from './Visuals';

const visualByScene:Record<string,React.FC>={
  'app-01':IdeaToPrototypeVisual,
  'app-02':StructurePlanVisual,
  'app-03':CodeAssemblyVisual,
  'app-04':TestFixVisual,
  'app-05':WorkflowVisual,
};

const iconPaths:Record<string,React.ReactNode>={
  spark:<><path d="M16 3l2.4 6.6L25 12l-6.6 2.4L16 21l-2.4-6.6L7 12l6.6-2.4z"/><path d="M25 21l1.2 3.2L29 25.5l-2.8 1.1L25 30l-1.2-3.4-2.8-1.1 2.8-1.3z"/></>,
  plan:<><rect x="5" y="5" width="22" height="22" rx="4"/><path d="M10 11h12M10 16h8M10 21h10"/></>,
  blocks:<><rect x="4" y="5" width="10" height="10" rx="2"/><rect x="18" y="5" width="10" height="10" rx="2"/><rect x="11" y="18" width="10" height="10" rx="2"/><path d="M9 15v4h7M23 15v4h-7"/></>,
  test:<><path d="M7 5h18v22H7z"/><path d="M11 11l2 2 4-4M11 18l2 2 4-4M20 11h2M20 18h2"/></>,
  check:<><circle cx="16" cy="16" r="12"/><path d="M10 16l4 4 8-9"/></>,
};

const Header:React.FC<{scene:AIAppScene}>=({scene})=>{const frame=useCurrentFrame();const enter=interpolate(frame,[0,15],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <div style={{position:'absolute',left:64,right:64,top:92,zIndex:50,display:'flex',justifyContent:'center',alignItems:'center',gap:22,opacity:.35+.65*enter,transform:`translateY(${(1-enter)*-14}px)`}}><div style={{width:74,height:74,borderRadius:23,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(185,140,255,.16)',border:'1.5px solid rgba(110,69,201,.25)',color:BRAND.accentDk,boxShadow:'0 12px 30px rgba(110,69,201,.12)'}}><svg width="44" height="44" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{iconPaths[scene.icon]??iconPaths.plan}</svg></div><div style={{maxWidth:820,textAlign:'center',fontFamily:BRAND.font,fontSize:scene.headline.length>25?50:58,lineHeight:1.02,fontWeight:900,letterSpacing:-1.8,color:BRAND.accentDk,textShadow:'0 7px 22px rgba(110,69,201,.11)'}}>{scene.headline}</div></div>};

const activeWordIndex=(frame:number,cue:AIAppCue,count:number):number=>{if(count<=1)return 0;if(cue.words?.length===count){const exact=cue.words.findIndex((w)=>frame>=w.startFrame&&frame<w.endFrame);if(exact>=0)return exact;}const prog=interpolate(frame,[cue.startFrame,Math.max(cue.startFrame+1,cue.endFrame-1)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return Math.min(count-1,Math.floor(prog*count));};

const Captions:React.FC=()=>{const frame=useCurrentFrame();const cue=AI_APP_SUBTITLES.find((c)=>frame>=c.startFrame&&frame<c.endFrame);if(!cue)return null;const words=cue.words?.length?cue.words.map((w)=>w.text):cue.text.trim().split(/\s+/).filter(Boolean);const active=activeWordIndex(frame,cue,words.length);const fade=Math.min(interpolate(frame,[cue.startFrame,cue.startFrame+4],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),interpolate(frame,[cue.endFrame-4,cue.endFrame],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}));return <div style={{position:'absolute',left:104,right:104,bottom:520,zIndex:200,display:'flex',justifyContent:'center',opacity:fade,pointerEvents:'none'}}><div style={{width:'100%',maxWidth:820,textAlign:'center',fontFamily:BRAND.font,fontSize:47,fontWeight:850,lineHeight:1.18,letterSpacing:-.8,color:BRAND.ink,textShadow:'0 2px 0 rgba(255,255,255,.98),0 0 15px rgba(255,255,255,.98),0 8px 30px rgba(26,26,46,.10)'}}>{words.map((word,i)=><React.Fragment key={`${cue.sceneId}-${cue.startFrame}-${i}`}><span style={{display:'inline-block',color:i===active?BRAND.accentDk:BRAND.ink,transform:`scale(${i===active?1.035:1})`,transformOrigin:'50% 70%'}}>{word}</span>{i<words.length-1?' ':null}</React.Fragment>)}</div></div>};

const SceneLayer:React.FC<{scene:AIAppScene}>=({scene})=>{const Visual=visualByScene[scene.sceneId];if(!Visual)throw new Error(`missing NEW_BUILD visual for ${scene.sceneId}`);return <AbsoluteFill><Header scene={scene}/><div style={{position:'absolute',left:0,right:0,top:225,height:AI_APP_CAPTION_ZONE_Y-225-30,overflow:'hidden',zIndex:20}}><Visual/></div></AbsoluteFill>};

export type ReelAIAppPrototypeProps={voiceoverSrc?:string;showCaptions?:boolean};
export const ReelAIAppPrototype:React.FC<ReelAIAppPrototypeProps>=({voiceoverSrc,showCaptions=true})=>{const scenes=useMemo(()=>AI_APP_SCENES,[]);return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 35%, #FFFFFF 0%, #FAF8FC 58%, #F1EDF6 100%)',color:BRAND.ink,overflow:'hidden',fontFamily:BRAND.font}}><div style={{position:'absolute',inset:0,background:'linear-gradient(rgba(110,69,201,.025) 1px, transparent 1px),linear-gradient(90deg,rgba(110,69,201,.025) 1px,transparent 1px)',backgroundSize:'72px 72px',maskImage:'linear-gradient(to bottom,transparent 0%,black 14%,black 72%,transparent 88%)'}}/>{scenes.map((scene)=><Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame-scene.startFrame} name={`${scene.sceneId}-NEW_BUILD`}><SceneLayer scene={scene}/></Sequence>)}{voiceoverSrc?<Html5Audio src={voiceoverSrc}/>:null}{showCaptions?<Captions/>:null}</AbsoluteFill>};
