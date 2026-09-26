import React from 'react';
import {
  AlertTriangle, Boxes, Braces, CheckCircle2, Cloud, Cpu, Database, Globe2,
  Image as ImageIcon, Laptop, MessageSquareText, PlugZap, Rocket, Server,
  Settings, ShieldCheck, Smartphone, XCircle, type LucideIcon,
} from 'lucide-react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../brand/brand';

export type SemanticIconName = 'alert'|'api'|'boxes'|'check'|'cloud'|'code'|'cpu'|'database'|'globe'|'image'|'laptop'|'message'|'rocket'|'server'|'settings'|'shield'|'smartphone'|'x';
const ICONS: Record<SemanticIconName, LucideIcon> = {
  alert: AlertTriangle, api: PlugZap, boxes: Boxes, check: CheckCircle2, cloud: Cloud,
  code: Braces, cpu: Cpu, database: Database, globe: Globe2, image: ImageIcon,
  laptop: Laptop, message: MessageSquareText, rocket: Rocket, server: Server,
  settings: Settings, shield: ShieldCheck, smartphone: Smartphone, x: XCircle,
};

export const SemanticIcon: React.FC<{name:SemanticIconName;size?:number;color?:string;strokeWidth?:number}> = ({name,size=42,color=BRAND.accentDk,strokeWidth=2.2}) => {
  const Icon = ICONS[name];
  return <Icon size={size} color={color} strokeWidth={strokeWidth} aria-hidden="true"/>;
};

export const IconTile: React.FC<{name:SemanticIconName;label:string;x:number;y:number;size?:number;delay?:number;strong?:boolean}> = ({name,label,x,y,size=150,delay=0,strong=false}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const enter=spring({frame:Math.max(0,frame-delay),fps,config:{damping:17,stiffness:170,mass:.72}});
  return <div data-semantic-visual="icon-tile" style={{position:'absolute',left:x,top:y,width:size,height:size,borderRadius:34,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14,background:strong?BRAND.ink:'rgba(255,255,255,.97)',color:strong?'#fff':BRAND.ink,border:`3px solid ${strong?'rgba(185,140,255,.78)':'rgba(110,69,201,.22)'}`,boxShadow:'0 24px 60px rgba(26,26,46,.18)',transform:`translateY(${(1-enter)*28}px) scale(${.84+.16*enter})`,opacity:enter}}><SemanticIcon name={name} size={Math.max(44,size*.34)} color={strong?'#fff':BRAND.accentDk}/><div style={{fontSize:Math.max(19,size*.16),fontWeight:900,textAlign:'center'}}>{label}</div></div>;
};

export const AIModelChip: React.FC<{label:string;x:number;y:number;width?:number;height?:number;delay?:number;status?:string;danger?:boolean}> = ({label,x,y,width=430,height=210,delay=0,status,danger=false}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const enter=spring({frame:Math.max(0,frame-delay),fps,config:{damping:16,stiffness:150,mass:.85}});
  const pulse=1+Math.sin((frame-delay)/15)*.012;
  return <div data-semantic-visual="ai-model-chip" style={{position:'absolute',left:x,top:y,width,height,borderRadius:44,background:danger?'linear-gradient(145deg,#2C1830,#1A1A2E)':'linear-gradient(145deg,#201831,#6E45C9)',border:'4px solid rgba(255,255,255,.2)',boxShadow:'0 35px 100px rgba(26,26,46,.32)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',transform:`scale(${(.82+.18*enter)*pulse})`,opacity:enter,overflow:'hidden'}}><div style={{position:'absolute',inset:18,borderRadius:30,border:'2px solid rgba(255,255,255,.16)'}}/><Cpu size={60}/><div style={{marginLeft:22,fontSize:54,fontWeight:950,letterSpacing:-2}}>{label}</div>{status?<div style={{position:'absolute',right:22,top:20,padding:'9px 14px',borderRadius:18,background:danger?'#B4314B':'rgba(255,255,255,.16)',fontSize:18,fontWeight:900}}>{status}</div>:null}</div>;
};

export const TerminalMock: React.FC<{x:number;y:number;width?:number;height?:number;lines:readonly string[];activeLine?:number;delay?:number}> = ({x,y,width=760,height=390,lines,activeLine=0,delay=0}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const enter=spring({frame:Math.max(0,frame-delay),fps,config:{damping:18,stiffness:145,mass:.82}});
  return <div data-semantic-visual="terminal" style={{position:'absolute',left:x,top:y,width,height,borderRadius:32,background:'#171421',color:'#F7F4FF',border:'3px solid rgba(185,140,255,.35)',boxShadow:'0 34px 100px rgba(26,26,46,.3)',overflow:'hidden',transform:`translateY(${(1-enter)*34}px) scale(${.94+.06*enter})`,opacity:enter}}><div style={{height:58,display:'flex',alignItems:'center',padding:'0 22px',gap:10,background:'#221C2E',borderBottom:'1px solid rgba(255,255,255,.1)'}}>{[0,1,2].map(i=><div key={i} style={{width:14,height:14,borderRadius:'50%',background:i===0?'#B4314B':i===1?'#D4A93C':'#4A9B68'}}/>)}<span style={{marginLeft:14,fontWeight:800,fontSize:19,opacity:.75}}>terminal</span></div><div style={{padding:'28px 32px',fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace',fontSize:25,lineHeight:1.6}}>{lines.map((line,i)=><div key={`${line}-${i}`} style={{padding:'4px 10px',borderRadius:12,background:i===activeLine?'rgba(185,140,255,.16)':'transparent',color:i===activeLine?'#D8C1FF':'#F7F4FF'}}><span style={{color:'#B98CFF',marginRight:12}}>$</span>{line}</div>)}</div></div>;
};

export const DeviceMock: React.FC<{kind:'phone'|'laptop';x:number;y:number;width?:number;delay?:number;children?:React.ReactNode}> = ({kind,x,y,width=kind==='phone'?330:720,delay=0,children}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const enter=spring({frame:Math.max(0,frame-delay),fps,config:{damping:18,stiffness:135,mass:.9}}); const height=kind==='phone'?width*1.9:width*.64;
  return <div data-semantic-visual="device" style={{position:'absolute',left:x,top:y,width,height,borderRadius:kind==='phone'?48:32,background:'#171421',padding:kind==='phone'?14:18,boxShadow:'0 38px 100px rgba(26,26,46,.28)',transform:`translateY(${(1-enter)*38}px) rotate(${(1-enter)*-3}deg) scale(${.9+.1*enter})`,opacity:enter}}><div style={{position:'relative',width:'100%',height:'100%',borderRadius:kind==='phone'?36:20,background:'#FBF9FF',overflow:'hidden'}}>{children}</div>{kind==='laptop'?<div style={{position:'absolute',left:-50,right:-50,bottom:-28,height:30,borderRadius:'0 0 22px 22px',background:'#262033'}}/>:null}</div>;
};

export const ServerStack: React.FC<{x:number;y:number;width?:number;rows?:number;delay?:number}> = ({x,y,width=470,rows=4,delay=0}) => {
  const frame=useCurrentFrame();
  return <div data-semantic-visual="server-stack" style={{position:'absolute',left:x,top:y,width}}>{Array.from({length:rows}).map((_,i)=>{const p=interpolate(frame,[delay+i*6,delay+i*6+18],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <div key={i} style={{height:76,marginBottom:12,borderRadius:20,background:i===0?BRAND.ink:'rgba(255,255,255,.96)',border:'2px solid rgba(110,69,201,.22)',boxShadow:'0 16px 42px rgba(26,26,46,.12)',display:'flex',alignItems:'center',padding:'0 22px',gap:18,transform:`translateX(${(1-p)*55}px)`,opacity:p,color:i===0?'#fff':BRAND.ink}}><Server size={34} color={i===0?'#B98CFF':BRAND.accentDk}/><div style={{fontSize:24,fontWeight:900}}>AI SERVER {String(i+1).padStart(2,'0')}</div><div style={{marginLeft:'auto',display:'flex',gap:7}}>{[0,1,2].map(j=><div key={j} style={{width:9,height:9,borderRadius:'50%',background:j===0?'#4A9B68':'rgba(185,140,255,.6)'}}/>)}</div></div>})}</div>;
};
