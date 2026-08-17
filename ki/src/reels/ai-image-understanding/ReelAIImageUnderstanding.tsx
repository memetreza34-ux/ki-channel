import React, {useMemo} from 'react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {AI_IMAGE_UNDERSTANDING_CAPTION_ZONE_Y, AI_IMAGE_UNDERSTANDING_SCENES, AI_IMAGE_UNDERSTANDING_SUBTITLES, type AIImageCue, type AIImageScene} from './contract';
import {FeatureVectorVisual, FocusPromptVisual, LimitsVisual, PixelsToDataVisual, VisionLanguageVisual} from './Visuals';

const visualByScene: Record<string, React.FC> = {
  'image-01': PixelsToDataVisual,
  'image-02': FeatureVectorVisual,
  'image-03': VisionLanguageVisual,
  'image-04': LimitsVisual,
  'image-05': FocusPromptVisual,
};

const iconPaths: Record<AIImageScene['icon'], React.ReactNode> = {
  image: <><rect x="4" y="6" width="24" height="20" rx="4"/><circle cx="11" cy="12" r="2.5"/><path d="M7 23l6-6 4 4 3-3 5 5"/></>,
  grid: <><rect x="5" y="5" width="9" height="9" rx="2"/><rect x="18" y="5" width="9" height="9" rx="2"/><rect x="5" y="18" width="9" height="9" rx="2"/><rect x="18" y="18" width="9" height="9" rx="2"/></>,
  link: <><path d="M12 20l-2 2a5 5 0 01-7-7l5-5a5 5 0 017 0"/><path d="M20 12l2-2a5 5 0 017 7l-5 5a5 5 0 01-7 0"/><path d="M11 21l10-10"/></>,
  warning: <><path d="M16 4l13 23H3L16 4z"/><path d="M16 11v7M16 23h.01"/></>,
  target: <><circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="5"/><path d="M16 2v4M16 26v4M2 16h4M26 16h4"/></>,
};

const Header: React.FC<{scene: AIImageScene}> = ({scene}) => {
  const f = useCurrentFrame();
  const enter = interpolate(f, [0, 14], [.4, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{position:'absolute',left:60,right:60,top:92,zIndex:50,display:'flex',justifyContent:'center',alignItems:'center',gap:22,opacity:enter,transform:`translateY(${(1-enter)*-12}px)`}}>
    <div style={{width:76,height:76,borderRadius:23,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(185,140,255,.16)',border:'1.5px solid rgba(110,69,201,.25)',color:BRAND.accentDk,boxShadow:'0 12px 30px rgba(110,69,201,.12)'}}><svg width="45" height="45" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{iconPaths[scene.icon]}</svg></div>
    <div style={{maxWidth:820,textAlign:'center',fontFamily:BRAND.font,fontSize:scene.headline.length>24?49:57,lineHeight:1.02,fontWeight:900,letterSpacing:-1.7,color:BRAND.accentDk,textShadow:'0 7px 22px rgba(110,69,201,.10)'}}>{scene.headline}</div>
  </div>;
};

const activeWordIndex = (frame: number, cue: AIImageCue, count: number) => {
  if (count <= 1) return 0;
  if (cue.words?.length === count) {
    const exact = cue.words.findIndex((word) => frame >= word.startFrame && frame < word.endFrame);
    if (exact >= 0) return exact;
  }
  const progress = interpolate(frame, [cue.startFrame, Math.max(cue.startFrame + 1, cue.endFrame - 1)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return Math.min(count - 1, Math.floor(progress * count));
};

const buildCaptionGroups = (words: string[], maxWords = 6): number[][] => {
  const groups: number[][] = [];
  let current: number[] = [];
  words.forEach((word, index) => {
    current.push(index);
    const hard = /[.!?][”“\"')\]]?$/.test(word);
    const soft = /[,;:][”“\"')\]]?$/.test(word) && current.length >= 4;
    if (hard || soft || current.length >= maxWords) {groups.push(current); current = [];}
  });
  if (current.length) groups.push(current);
  return groups;
};

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = AI_IMAGE_UNDERSTANDING_SUBTITLES.find((item) => frame >= item.startFrame && frame < item.endFrame);
  if (!cue) return null;
  const words = cue.words?.length ? cue.words.map((word) => word.text) : cue.text.trim().split(/\s+/).filter(Boolean);
  const active = activeWordIndex(frame, cue, words.length);
  const visible = buildCaptionGroups(words, 6).find((group) => group.includes(active)) ?? [];
  const fade = Math.min(
    interpolate(frame, [cue.startFrame, cue.startFrame + 4], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'}),
    interpolate(frame, [cue.endFrame - 4, cue.endFrame], [1, 0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'}),
  );
  return <div style={{position:'absolute',left:104,right:104,bottom:520,zIndex:200,display:'flex',justifyContent:'center',opacity:fade,pointerEvents:'none'}}><div style={{width:'100%',maxWidth:820,textAlign:'center',fontFamily:BRAND.font,fontSize:50,fontWeight:850,lineHeight:1.14,letterSpacing:-.9,color:BRAND.ink,textShadow:'0 2px 0 rgba(255,255,255,.98),0 0 15px rgba(255,255,255,.98),0 8px 30px rgba(26,26,46,.10)'}}>{visible.map((idx, i) => <React.Fragment key={`${cue.sceneId}-${cue.startFrame}-${idx}`}><span style={{display:'inline-block',color:idx===active?BRAND.accentDk:BRAND.ink,transform:`scale(${idx===active?1.04:1})`,transformOrigin:'50% 70%'}}>{words[idx]}</span>{i<visible.length-1?' ':null}</React.Fragment>)}</div></div>;
};

const SceneLayer: React.FC<{scene: AIImageScene}> = ({scene}) => {
  const Visual = visualByScene[scene.sceneId];
  if (!Visual) throw new Error(`missing NEW_BUILD visual for ${scene.sceneId}`);
  return <AbsoluteFill><Header scene={scene}/><div style={{position:'absolute',left:0,right:0,top:225,height:AI_IMAGE_UNDERSTANDING_CAPTION_ZONE_Y-225-30,overflow:'hidden',zIndex:20}}><Visual/></div></AbsoluteFill>;
};

export type ReelAIImageUnderstandingProps = {voiceoverSrc?: string; showCaptions?: boolean};

export const ReelAIImageUnderstanding: React.FC<ReelAIImageUnderstandingProps> = ({voiceoverSrc, showCaptions = true}) => {
  const scenes = useMemo(() => AI_IMAGE_UNDERSTANDING_SCENES, []);
  return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 35%, #FFFFFF 0%, #FAF8FC 58%, #F1EDF6 100%)',color:BRAND.ink,overflow:'hidden',fontFamily:BRAND.font}}>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(rgba(110,69,201,.024) 1px, transparent 1px),linear-gradient(90deg,rgba(110,69,201,.024) 1px,transparent 1px)',backgroundSize:'72px 72px',maskImage:'linear-gradient(to bottom,transparent 0%,black 14%,black 72%,transparent 88%)'}}/>
    {scenes.map((scene) => <Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame-scene.startFrame} name={`${scene.sceneId}-NEW_BUILD`}><SceneLayer scene={scene}/></Sequence>)}
    {voiceoverSrc ? <Html5Audio src={voiceoverSrc}/> : null}
    {showCaptions ? <Captions/> : null}
  </AbsoluteFill>;
};
