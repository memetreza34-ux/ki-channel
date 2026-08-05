import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {hallucinationAsset, type HallucinationAssetId} from '../assets';
import {
  SCENE_BY_ID,
  SUBTITLE_CUES,
  type HallucinationSceneId,
  type SubtitleEmphasis,
} from '../contract';
import {palette, shadows, typography} from '../style';

export const clampProgress = (frame: number, start: number, end: number): number =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const useEnterSpring = (frame: number, delay = 0): number => {
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping: 17, stiffness: 170, mass: 0.72}});
};

export const GlassCard: React.FC<React.PropsWithChildren<{
  style?: React.CSSProperties;
  danger?: boolean;
  success?: boolean;
}>> = ({children, style, danger = false, success = false}) => (
  <div style={{borderRadius:32,border:`2px solid ${danger?palette.danger:success?palette.success:palette.line}`,background:'rgba(255,255,255,0.94)',boxShadow:shadows.card,...style}}>{children}</div>
);

export const Pill: React.FC<React.PropsWithChildren<{
  tone?: 'accent' | 'danger' | 'success' | 'muted';
  style?: React.CSSProperties;
}>> = ({children, tone = 'accent', style}) => {
  const colors={accent:palette.accent,danger:palette.danger,success:palette.success,muted:palette.muted} as const;
  const color=colors[tone];
  return <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',padding:'12px 22px',borderRadius:999,background:`${color}18`,border:`2px solid ${color}55`,color,fontSize:24,fontWeight:900,letterSpacing:1.2,...style}}>{children}</div>;
};

const emphasisColor=(emphasis:SubtitleEmphasis):string=>emphasis==='danger'?palette.danger:emphasis==='success'?palette.success:emphasis==='accent'?palette.accent:palette.foreground;

export const SubtitleWindow: React.FC<{sceneId: HallucinationSceneId}> = ({sceneId}) => {
  const frame=useCurrentFrame();
  const visible=SUBTITLE_CUES[sceneId].filter((cue)=>cue.atFrame<=frame).slice(-9);
  return <div style={{position:'absolute',left:72,right:72,bottom:108,minHeight:162,zIndex:90,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{maxWidth:930,padding:'24px 34px',borderRadius:30,background:'rgba(255,255,255,.92)',border:`1px solid ${palette.line}`,boxShadow:shadows.soft,textAlign:'center'}}>{visible.map((cue,index)=>{const active=index===visible.length-1;return <span key={`${cue.atFrame}-${cue.text}`} style={{display:'inline-block',margin:'5px 7px',fontFamily:typography.fontFamily,fontSize:active?42:38,lineHeight:1.08,fontWeight:active?900:760,color:emphasisColor(cue.emphasis),opacity:active?1:.72,transform:`translateY(${active?-2:0}px) scale(${active?1.04:1})`}}>{cue.text}</span>;})}</div></div>;
};

export const AssetImage: React.FC<{assetId:HallucinationAssetId;objectFit?:'cover'|'contain';style?:React.CSSProperties}> = ({assetId,objectFit='cover',style}) => <Img src={hallucinationAsset(assetId)} style={{width:'100%',height:'100%',objectFit,...style}} />;

export const SceneFrame: React.FC<React.PropsWithChildren<{sceneId:HallucinationSceneId;kicker?:string}>> = ({sceneId,kicker,children}) => {
  const frame=useCurrentFrame();
  const intro=useEnterSpring(frame,2);
  const scene=SCENE_BY_ID[sceneId];
  return <AbsoluteFill style={{background:palette.background,color:palette.foreground,fontFamily:typography.fontFamily,overflow:'hidden'}}><div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 38%, rgba(125,73,223,.10), transparent 43%)'}} /><div style={{position:'absolute',left:72,right:72,top:112,zIndex:75,opacity:intro,transform:`translateY(${(1-intro)*26}px)`}}>{kicker?<div style={{fontSize:24,fontWeight:900,letterSpacing:4,color:palette.accent,marginBottom:14}}>{kicker}</div>:null}<div style={{fontSize:60,lineHeight:1.02,fontWeight:950,letterSpacing:-2.4,maxWidth:930}}>{scene.heading}</div></div><div style={{position:'absolute',left:58,right:58,top:330,bottom:330,zIndex:20}}>{children}</div><SubtitleWindow sceneId={sceneId} /></AbsoluteFill>;
};
