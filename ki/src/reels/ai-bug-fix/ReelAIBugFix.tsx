import React, {useMemo} from 'react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {AI_BUG_FIX_CAPTION_ZONE_Y, AI_BUG_FIX_SCENES, AI_BUG_FIX_SUBTITLES, type AIBugFixCue, type AIBugFixScene} from './contract';
import {BrokenClickVisual, PatchTestsVisual, ReproduceVisual, TraceVisual, VerifyVisual} from './Visuals';

const visualByScene:Record<string,React.FC>={
  'bug-01':BrokenClickVisual,
  'bug-02':ReproduceVisual,
  'bug-03':TraceVisual,
  'bug-04':PatchTestsVisual,
  'bug-05':VerifyVisual,
};

const iconPaths:Record<string,React.ReactNode>={
  click:<><rect x="6" y="8" width="20" height="16" rx="4"/><path d="M16 12v8M12 16h8"/></>,
  steps:<><circle cx="8" cy="8" r="3"/><circle cx="16" cy="16" r="3"/><circle cx="24" cy="24" r="3"/><path d="M10.5 10.5l3 3M18.5 18.5l3 3"/></>,
  trace:<><path d="M5 24c5-14 10 0 14-12 3-8 6-6 8-5"/><circle cx="6" cy="24" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="27" cy="7" r="2"/></>,
  patch:<><path d="M8 6h16v20H8z"/><path d="M12 12h8M12 17h8M14 22h4"/></>,
  verify:<><circle cx="16" cy="16" r="12"/><path d="M10 16l4 4 8-9"/></>,
};

const Header:React.FC<{scene:AIBugFixScene}>=({scene})=>{const f=useCurrentFrame();const enter=interpolate(f,[0,14],[.35,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <div style={{position:'absolute',left:64,right:64,top:92,zIndex:50,display:'flex',justifyContent:'center',alignItems:'center',gap:22,opacity:enter,transform:`translateY(${(1-enter)*-12}px)`}}><div style={{width:74,height:74,borderRadius:23,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(185,140,255,.16)',border:'1.5px solid rgba(110,69,201,.25)',color:BRAND.accentDk,boxShadow:'0 12px 30px rgba(110,69,201,.12)'}}><svg width="44" height="44" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{iconPaths[scene.icon]??iconPaths.click}</svg></div><div style={{maxWidth:820,textAlign:'center',fontFamily:BRAND.font,fontSize:scene.headline.length>24?49:57,lineHeight:1.02,fontWeight:900,letterSpacing:-1.7,color:BRAND.accentDk,textShadow:'0 7px 22px rgba(110,69,201,.10)'}}>{scene.headline}</div></div>};

const activeWordIndex=(frame:number,cue:AIBugFixCue,count:number)=>{if(count<=1)return 0;if(cue.words?.length===count){const exact=cue.words.findIndex((w)=>frame>=w.startFrame&&frame<w.endFrame);if(exact>=0)return exact;}const prog=interpolate(frame,[cue.startFrame,Math.max(cue.startFrame+1,cue.endFrame-1)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return Math.min(count-1,Math.floor(prog*count));};

const buildCaptionGroups=(words:string[],maxWords=6):number[][]=>{const groups:number[][]=[];let current:number[]=[];words.forEach((word,index)=>{current.push(index);const hard=/[.!?][”“\"')\]]?$/.test(word);const soft=/[,;:][”“\"')\]]?$/.test(word)&&current.length>=4;if(hard||soft||current.length>=maxWords){groups.push(current);current=[];}});if(current.length)groups.push(current);return groups;};

const Captions:React.FC=()=>{const frame=useCurrentFrame();const cue=AI_BUG_FIX_SUBTITLES.find((c)=>frame>=c.startFrame&&frame<c.endFrame);if(!cue)return null;const words=cue.words?.length?cue.words.map((w)=>w.text):cue.text.trim().split(/\s+/).filter(Boolean);const active=activeWordIndex(frame,cue,words.length);const groups=buildCaptionGroups(words,6);const visible=groups.find((g)=>g.includes(active))??groups[0]??[];const fade=Math.min(interpolate(frame,[cue.startFrame,cue.startFrame+4],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),interpolate(frame,[cue.endFrame-4,cue.endFrame],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}));return <div style={{position:'absolute',left:76,right:76,bottom:270,zIndex:200,display:'flex',justifyContent:'center',opacity:fade,pointerEvents:'none'}}><div style={{width:'100%',maxWidth:860,textAlign:'center',fontFamily:BRAND.font,fontSize:52,fontWeight:850,lineHeight:1.14,letterSpacing:-.9,color:BRAND.ink,textShadow:'0 2px 0 rgba(255,255,255,.98),0 0 15px rgba(255,255,255,.98),0 8px 30px rgba(26,26,46,.10)'}}>{visible.map((idx,i)=><React.Fragment key={`${cue.sceneId}-${cue.startFrame}-${idx}`}><span style={{display:'inline-block',color:idx===active?BRAND.accentDk:BRAND.ink,transform:`scale(${idx===active?1.04:1})`,transformOrigin:'50% 70%'}}>{words[idx]}</span>{i<visible.length-1?' ':null}</React.Fragment>)}</div></div>};

const SceneLayer:React.FC<{scene:AIBugFixScene}>=({scene})=>{const Visual=visualByScene[scene.sceneId];if(!Visual)throw new Error(`missing NEW_BUILD visual for ${scene.sceneId}`);return <AbsoluteFill><Header scene={scene}/><div style={{position:'absolute',left:0,right:0,top:225,height:AI_BUG_FIX_CAPTION_ZONE_Y-225-30,overflow:'hidden',zIndex:20}}><Visual/></div></AbsoluteFill>};

export type ReelAIBugFixProps={voiceoverSrc?:string;showCaptions?:boolean};
export const ReelAIBugFix:React.FC<ReelAIBugFixProps>=({voiceoverSrc,showCaptions=true})=>{const scenes=useMemo(()=>AI_BUG_FIX_SCENES,[]);return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 35%, #FFFFFF 0%, #FAF8FC 58%, #F1EDF6 100%)',color:BRAND.ink,overflow:'hidden',fontFamily:BRAND.font}}><div style={{position:'absolute',inset:0,background:'linear-gradient(rgba(110,69,201,.024) 1px, transparent 1px),linear-gradient(90deg,rgba(110,69,201,.024) 1px,transparent 1px)',backgroundSize:'72px 72px',maskImage:'linear-gradient(to bottom,transparent 0%,black 14%,black 72%,transparent 88%)'}}/>{scenes.map((scene)=><Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame-scene.startFrame} name={`${scene.sceneId}-NEW_BUILD`}><SceneLayer scene={scene}/></Sequence>)}{voiceoverSrc?<Html5Audio src={voiceoverSrc}/>:null}{showCaptions?<Captions/>:null}</AbsoluteFill>};
