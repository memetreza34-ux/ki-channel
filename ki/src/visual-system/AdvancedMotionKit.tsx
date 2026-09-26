import React from 'react';
import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {Circle, Triangle} from '@remotion/shapes';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../brand/brand';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const AnimatedDataPath: React.FC<{
  path: string;
  x: number;
  y: number;
  width: number;
  height: number;
  delay?: number;
  duration?: number;
  stroke?: string;
  strokeWidth?: number;
  showPayload?: boolean;
  payloadSize?: number;
}> = ({path,x,y,width,height,delay=0,duration=42,stroke=BRAND.accentDk,strokeWidth=9,showPayload=true,payloadSize=24}) => {
  const frame=useCurrentFrame();
  const progress=interpolate(frame,[delay,delay+duration],[0,1],clamp);
  const evolution=evolvePath(progress,path);
  const totalLength=getLength(path);
  const point=getPointAtLength(path,totalLength*progress);

  return <div data-remotion-capability="paths" style={{position:'absolute',left:x,top:y,width,height,pointerEvents:'none'}}>
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} style={{overflow:'visible'}}>
      <path d={path} fill="none" stroke="rgba(110,69,201,.13)" strokeWidth={strokeWidth+6} strokeLinecap="round"/>
      <path d={path} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={evolution.strokeDasharray} strokeDashoffset={evolution.strokeDashoffset}/>
      {showPayload && point ? <circle cx={point.x} cy={point.y} r={payloadSize} fill="#fff" stroke={stroke} strokeWidth={7}/>:null}
    </svg>
  </div>;
};

export const KineticType: React.FC<{
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  delay?: number;
  color?: string;
  align?: 'left'|'center'|'right';
  width?: number;
}> = ({text,x,y,fontSize=92,delay=0,color=BRAND.ink,align='left',width=900}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const enter=spring({frame:Math.max(0,frame-delay),fps,config:{damping:15,stiffness:180,mass:.7}});
  const overshoot=interpolate(enter,[0,.7,1],[.72,1.08,1],clamp);
  return <div data-remotion-capability="kinetic-typography" style={{position:'absolute',left:x,top:y,width,fontSize,fontWeight:950,lineHeight:.92,letterSpacing:-3,textAlign:align,color,transform:`translateY(${(1-enter)*54}px) scale(${overshoot})`,transformOrigin:align==='left'?'left center':align==='right'?'right center':'center',opacity:enter}}>{text}</div>;
};

export const DepthStage: React.FC<{
  x:number;
  y:number;
  width:number;
  height:number;
  children: React.ReactNode;
  rotateX?:number;
  rotateY?:number;
  delay?:number;
}> = ({x,y,width,height,children,rotateX=5,rotateY=-8,delay=0}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const enter=spring({frame:Math.max(0,frame-delay),fps,config:{damping:18,stiffness:120,mass:1}});
  const parallax=Math.sin((frame-delay)/26)*8;
  return <div data-remotion-capability="depth-2.5d" style={{position:'absolute',left:x,top:y,width,height,perspective:1100,transformStyle:'preserve-3d'}}>
    <div style={{position:'absolute',inset:0,transformStyle:'preserve-3d',transform:`rotateX(${rotateX*enter}deg) rotateY(${rotateY*enter}deg) translate3d(${parallax}px,${(1-enter)*34}px,0)`,opacity:enter}}>{children}</div>
  </div>;
};

export const ShapeSignal: React.FC<{
  x:number;
  y:number;
  size?:number;
  delay?:number;
  direction?:'left'|'right'|'up'|'down';
  label?:string;
}> = ({x,y,size=150,delay=0,direction='right',label}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const enter=spring({frame:Math.max(0,frame-delay),fps,config:{damping:13,stiffness:190,mass:.62}});
  const spin=interpolate(enter,[0,1],[-35,0],clamp);
  return <div data-remotion-capability="shapes" style={{position:'absolute',left:x,top:y,width:size*2.2,height:size*1.25,display:'flex',alignItems:'center',gap:20,transform:`scale(${.55+.45*enter}) rotate(${spin}deg)`,opacity:enter}}>
    <div style={{position:'relative',width:size,height:size}}>
      <Circle radius={size*.47} fill="rgba(185,140,255,.17)" stroke={BRAND.accentDk} strokeWidth={5}/>
      <div style={{position:'absolute',left:size*.33,top:size*.27}}><Triangle length={size*.5} direction={direction} fill={BRAND.accentDk}/></div>
    </div>
    {label?<div style={{fontSize:34,fontWeight:950,color:BRAND.ink,lineHeight:1}}>{label}</div>:null}
  </div>;
};

export const ObjectTransformation: React.FC<{
  fromLabel:string;
  toLabel:string;
  x:number;
  y:number;
  width?:number;
  delay?:number;
}> = ({fromLabel,toLabel,x,y,width=720,delay=0}) => {
  const frame=useCurrentFrame();
  const progress=interpolate(frame,[delay,delay+34],[0,1],clamp);
  const firstOpacity=interpolate(progress,[0,.42,.62],[1,1,0],clamp);
  const secondOpacity=interpolate(progress,[.38,.7,1],[0,1,1],clamp);
  const cut=interpolate(progress,[.25,.6],[0,width],clamp);
  return <div data-remotion-capability="object-transformation" style={{position:'absolute',left:x,top:y,width,height:250}}>
    <div style={{position:'absolute',inset:0,borderRadius:54,background:'linear-gradient(145deg,#171421,#6E45C9)',boxShadow:'0 40px 110px rgba(26,26,46,.32)',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,display:'grid',placeItems:'center',fontSize:72,fontWeight:950,color:'#fff',opacity:firstOpacity,transform:`translateX(${-progress*90}px) scale(${1-progress*.08})`}}>{fromLabel}</div>
      <div style={{position:'absolute',inset:0,display:'grid',placeItems:'center',fontSize:82,fontWeight:950,color:'#fff',opacity:secondOpacity,transform:`translateX(${(1-progress)*110}px) scale(${.88+.12*progress})`}}>{toLabel}</div>
      <div style={{position:'absolute',left:cut-14,top:-30,width:28,height:310,background:'#fff',boxShadow:'0 0 28px rgba(255,255,255,.9)',transform:'rotate(8deg)'}}/>
    </div>
  </div>;
};
