import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {REEL_CAPTION_SAFE, REEL_CAPTION_WRAPPER_STYLE} from '../captionSafe';
import {CHATGPT_ADS_GERMANY_SCENES, CHATGPT_ADS_GERMANY_SUBTITLES, type ChatGPTAdsCue, type ChatGPTAdsScene} from './contract';
import {ChannelVisual, LaunchVisual, PlansVisual, PrivacyVisual, SeparationVisual} from './Visuals';

const font='Inter, Arial, sans-serif';
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const visualByScene:Record<string,React.FC>={
  'ads-01':LaunchVisual,
  'ads-02':SeparationVisual,
  'ads-03':PlansVisual,
  'ads-04':PrivacyVisual,
  'ads-05':ChannelVisual,
};

const Header:React.FC<{scene:ChatGPTAdsScene}>=({scene})=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const enter=spring({frame,fps,config:{damping:16,stiffness:140}});
  return <div style={{position:'absolute',left:60,right:60,top:72,zIndex:80,display:'flex',justifyContent:'center',alignItems:'center',gap:18,opacity:enter,transform:`translateY(${(1-enter)*-28}px) scale(${.94+.06*enter})`}}>
    <div style={{width:72,height:72,borderRadius:22,background:'linear-gradient(135deg,rgba(185,140,255,.24),rgba(110,69,201,.13))',border:'2px solid rgba(110,69,201,.20)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:31,fontWeight:950,color:BRAND.accentDk,boxShadow:'0 15px 34px rgba(110,69,201,.12)'}}>{scene.icon==='launch'?'↗':scene.icon==='split'?'⇵':scene.icon==='plans'?'◫':scene.icon==='privacy'?'◈':'◎'}</div>
    <div style={{fontFamily:font,fontSize:scene.headline.length>26?47:54,fontWeight:950,letterSpacing:-1.5,lineHeight:1,color:BRAND.accentDk,textAlign:'center',textShadow:'0 8px 24px rgba(110,69,201,.10)'}}>{scene.headline}</div>
  </div>;
};

const buildGroups=(words:string[],max=REEL_CAPTION_SAFE.maxWordsPerGroup)=>{
  const groups:number[][]=[];let current:number[]=[];
  words.forEach((word,i)=>{current.push(i);const hard=/[.!?][”"')\]]?$/.test(word);const soft=/[,;:][”"')\]]?$/.test(word)&&current.length>=3;if(hard||soft||current.length>=max){groups.push(current);current=[];}});
  if(current.length)groups.push(current);return groups;
};

const activeIndex=(frame:number,cue:ChatGPTAdsCue,count:number)=>{
  if(cue.words?.length===count){const exact=cue.words.findIndex(w=>frame>=w.startFrame&&frame<w.endFrame);if(exact>=0)return exact;}
  const x=interpolate(frame,[cue.startFrame,Math.max(cue.startFrame+1,cue.endFrame-1)],[0,1],clamp);
  return Math.min(count-1,Math.max(0,Math.floor(x*count)));
};

const Captions:React.FC=()=>{
  const frame=useCurrentFrame();
  const cue=CHATGPT_ADS_GERMANY_SUBTITLES.find(c=>frame>=c.startFrame&&frame<c.endFrame);
  if(!cue)return null;
  const words=cue.words?.length?cue.words.map(w=>w.text):cue.text.trim().split(/\s+/).filter(Boolean);
  const active=activeIndex(frame,cue,words.length);const groups=buildGroups(words);const visible=groups.find(g=>g.includes(active))??groups[0]??[];
  const fade=Math.min(interpolate(frame,[cue.startFrame,cue.startFrame+4],[0,1],clamp),interpolate(frame,[cue.endFrame-4,cue.endFrame],[1,0],clamp));
  return <div style={{...REEL_CAPTION_WRAPPER_STYLE,opacity:fade,zIndex:100}}><div style={{width:'100%',maxWidth:REEL_CAPTION_SAFE.maxWidth,textAlign:'center',fontFamily:font,fontSize:50,fontWeight:870,lineHeight:1.13,letterSpacing:-.8,color:BRAND.ink,textShadow:'0 2px 0 rgba(255,255,255,.98),0 0 16px rgba(255,255,255,.98),0 8px 30px rgba(26,26,46,.10)'}}>{visible.map((i,j)=><React.Fragment key={`${cue.sceneId}-${cue.startFrame}-${i}`}><span style={{display:'inline-block',color:i===active?BRAND.accentDk:BRAND.ink,transform:`scale(${i===active?1.045:1})`}}>{words[i]}</span>{j<visible.length-1?' ':null}</React.Fragment>)}</div></div>;
};

const SceneLayer:React.FC<{scene:ChatGPTAdsScene}>=({scene})=>{
  const Visual=visualByScene[scene.sceneId];
  if(!Visual)throw new Error(`Missing high-energy visual for ${scene.sceneId}`);
  return <AbsoluteFill><Header scene={scene}/><div style={{position:'absolute',left:0,right:0,top:190,height:REEL_CAPTION_SAFE.preferredVisualEndYMax-190,overflow:'hidden',zIndex:20}}><Visual/></div></AbsoluteFill>;
};

export type ReelChatGPTAdsGermanyProps={voiceoverSrc?:string;showCaptions?:boolean};

export const ReelChatGPTAdsGermany:React.FC<ReelChatGPTAdsGermanyProps>=({voiceoverSrc,showCaptions=true})=>{
  const frame=useCurrentFrame();
  const drift=Math.sin(frame/70)*14;
  return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 27%,#FFFFFF 0%,#FBF9FD 54%,#F0ECF6 100%)',color:BRAND.ink,overflow:'hidden',fontFamily:font}}>
    <div style={{position:'absolute',inset:-80,transform:`translateY(${drift}px)`,background:'radial-gradient(circle at 18% 28%,rgba(185,140,255,.13),transparent 25%),radial-gradient(circle at 82% 48%,rgba(71,120,208,.09),transparent 28%)'}}/>
    {CHATGPT_ADS_GERMANY_SCENES.map(scene=><Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame-scene.startFrame} name={`${scene.sceneId}-HIGH_ENERGY_NEW_BUILD`}><SceneLayer scene={scene}/></Sequence>)}
    {voiceoverSrc?<Html5Audio src={voiceoverSrc}/>:null}
    {showCaptions?<Captions/>:null}
  </AbsoluteFill>;
};
