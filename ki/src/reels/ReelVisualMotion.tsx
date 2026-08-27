import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

type CameraPushProps = React.PropsWithChildren<{
  startFrame?: number;
  endFrame?: number;
  fromScale?: number;
  toScale?: number;
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
  origin?: string;
  style?: React.CSSProperties;
}>;

export const CameraPush: React.FC<CameraPushProps> = ({
  children,
  startFrame = 0,
  endFrame = 24,
  fromScale = 1,
  toScale = 1.08,
  fromX = 0,
  toX = 0,
  fromY = 0,
  toY = 0,
  origin = 'center center',
  style,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame,[startFrame,endFrame],[fromScale,toScale],clamp);
  const x = interpolate(frame,[startFrame,endFrame],[fromX,toX],clamp);
  const y = interpolate(frame,[startFrame,endFrame],[fromY,toY],clamp);
  return (
    <div style={{transformOrigin:origin,transform:`translate3d(${x}px,${y}px,0) scale(${scale})`,willChange:'transform',...style}}>
      {children}
    </div>
  );
};

type FocusHaloProps = {
  left: number | string;
  top: number | string;
  width: number | string;
  height: number | string;
  startFrame: number;
  endFrame: number;
  accent: string;
  radius?: number;
};

export const FocusHalo: React.FC<FocusHaloProps> = ({left,top,width,height,startFrame,endFrame,accent,radius=28}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame,[startFrame,startFrame+8],[0,1],clamp);
  const leave = interpolate(frame,[Math.max(startFrame+9,endFrame-8),endFrame],[1,0],clamp);
  const opacity = Math.min(enter,leave);
  const scale = interpolate(enter,[0,1],[1.07,1],clamp);
  if (opacity <= 0) return null;
  return (
    <div style={{position:'absolute',left,top,width,height,borderRadius:radius,border:`3px solid ${accent}`,boxShadow:`0 0 0 7px ${accent}18, 0 16px 42px ${accent}24`,opacity,transform:`scale(${scale})`,pointerEvents:'none',zIndex:30}}/>
  );
};

type ScanSweepProps = {
  startFrame: number;
  endFrame: number;
  accent: string;
  top?: number | string;
  left?: number | string;
  width?: number | string;
};

export const ScanSweep: React.FC<ScanSweepProps> = ({startFrame,endFrame,accent,top=0,left=0,width='100%'}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame,[startFrame,endFrame],[0,1],clamp);
  const opacity = interpolate(frame,[startFrame,startFrame+5,endFrame-5,endFrame],[0,.75,.75,0],clamp);
  return <div style={{position:'absolute',top,left,width,height:3,background:`linear-gradient(90deg,transparent,${accent},transparent)`,opacity,transform:`translateX(${(progress-.5)*80}px)`,filter:`drop-shadow(0 0 8px ${accent})`,pointerEvents:'none',zIndex:25}}/>;
};

export const ParallaxFloat: React.FC<React.PropsWithChildren<{amplitude?:number; speed?:number; phase?:number; style?:React.CSSProperties}>> = ({children,amplitude=6,speed=.045,phase=0,style}) => {
  const frame = useCurrentFrame();
  const y = Math.sin(frame*speed+phase)*amplitude;
  return <div style={{transform:`translate3d(0,${y}px,0)`,willChange:'transform',...style}}>{children}</div>;
};

type SourceProofCardProps = {
  source: string;
  date: string;
  label: string;
  accent: string;
  startFrame?: number;
};

export const SourceProofCard: React.FC<SourceProofCardProps> = ({source,date,label,accent,startFrame=0}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame,[startFrame,startFrame+10],[0,1],clamp);
  const y = interpolate(frame,[startFrame,startFrame+10],[20,0],clamp);
  return (
    <div style={{display:'flex',alignItems:'center',gap:14,padding:'15px 18px',borderRadius:22,background:'rgba(255,255,255,.88)',border:'1px solid rgba(16,32,51,.09)',boxShadow:'0 18px 46px rgba(16,32,51,.10)',opacity,transform:`translateY(${y}px)`}}>
      <div style={{width:12,height:12,borderRadius:999,background:accent,boxShadow:`0 0 0 6px ${accent}18`}}/>
      <div style={{minWidth:0}}>
        <div style={{fontSize:21,fontWeight:900,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{label}</div>
        <div style={{fontSize:17,opacity:.54,marginTop:2}}>{source} • {date}</div>
      </div>
    </div>
  );
};
