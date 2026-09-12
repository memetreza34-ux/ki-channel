import React from 'react';
import {AbsoluteFill,Audio,Easing,Img,Sequence,interpolate,spring,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Circle as ShapeCircle} from '@remotion/shapes';
import {blur} from '@remotion/effects/blur';
import {noise2D} from '@remotion/noise';
import {ThreeCanvas} from '@remotion/three';
import {SkiaCanvas} from '@remotion/skia';
import {Circle as SkiaCircle,Fill,Rect as SkiaRect} from '@shopify/react-native-skia';
import {Area,AreaChart,ResponsiveContainer,XAxis,YAxis} from 'recharts';
import {SHOWCASE_SCENES} from './contract';

const C={bg:'#F7F7F5',ink:'#1A1A2E',purple:'#6E45C9',lav:'#B98CFF',green:'#2E8B57',risk:'#D84A4A',muted:'#747787',line:'#D9DAE3',white:'#FFFFFF'};
const FONT='Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};

const Icon:React.FC<{type:'play'|'image'|'cube'|'chart'|'spark';size?:number}> = ({type,size=42}) => {
  const common={width:size,height:size,viewBox:'0 0 48 48',fill:'none',stroke:'currentColor',strokeWidth:3.2,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
  if(type==='play')return <svg {...common}><rect x="5" y="8" width="38" height="32" rx="8"/><path d="m20 17 12 7-12 7Z" fill="currentColor" stroke="none"/></svg>;
  if(type==='image')return <svg {...common}><rect x="6" y="7" width="36" height="34" rx="7"/><circle cx="17" cy="18" r="3" fill="currentColor" stroke="none"/><path d="m10 35 10-10 7 7 5-5 10 9"/></svg>;
  if(type==='cube')return <svg {...common}><path d="m24 5 16 9v19l-16 10L8 33V14Z"/><path d="m8 14 16 10 16-10M24 24v19"/></svg>;
  if(type==='chart')return <svg {...common}><path d="M7 39h35M10 34l9-10 8 5 12-17"/><circle cx="19" cy="24" r="2" fill="currentColor"/><circle cx="27" cy="29" r="2" fill="currentColor"/><circle cx="39" cy="12" r="2" fill="currentColor"/></svg>;
  return <svg {...common}><path d="m24 4 3.5 11.5L39 19l-11.5 3.5L24 34l-3.5-11.5L9 19l11.5-3.5Z"/><path d="m38 31 1.5 5L44 38l-4.5 1.5L38 44l-1.5-4.5L32 38l4.5-2Z"/></svg>;
};

const Label:React.FC<{children:React.ReactNode,tone?:string}> = ({children,tone=C.purple}) => <div style={{display:'inline-flex',padding:'10px 16px',borderRadius:999,border:`1px solid ${tone}44`,background:`${tone}12`,color:tone,fontSize:20,fontWeight:800,letterSpacing:1.2,textTransform:'uppercase'}}>{children}</div>;
const Title:React.FC<{children:React.ReactNode,size?:number}> = ({children,size=82}) => <div style={{fontFamily:FONT,fontWeight:900,fontSize:size,lineHeight:.98,letterSpacing:-3.5,color:C.ink}}>{children}</div>;

const SceneShell:React.FC<{children:React.ReactNode}> = ({children}) => <AbsoluteFill style={{backgroundColor:C.bg,fontFamily:FONT,color:C.ink,overflow:'hidden'}}>{children}</AbsoluteFill>;

const Hook:React.FC=()=>{
  const f=useCurrentFrame(); const {fps}=useVideoConfig();
  const enter=spring({fps,frame:f,config:{damping:18,stiffness:135}});
  const cut=interpolate(f,[58,100],[0,1],clamp);
  const drift=noise2D('showcase-hook',f/50,0)*25;
  return <SceneShell>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 65% 35%, rgba(185,140,255,.32), transparent 35%)'}}/>
    {[0,1,2,3,4].map(i=><div key={i} style={{position:'absolute',left:230+i*320+drift,top:120+(i%2)*540,width:170,height:170,borderRadius:42,border:`1px solid ${C.line}`,background:C.white,rotate:`${-12+i*7}deg`,opacity:.35,scale:.8+enter*.2}}/>) }
    <div style={{position:'absolute',left:130,top:170,width:1450,opacity:enter,translate:`0 ${40-enter*40}px`}}>
      <Label>Motion Lab · Test 01</Label>
      <div style={{marginTop:34}}><Title>Kann Remotion<br/><span style={{color:C.purple}}>mehr als Slides?</span></Title></div>
      <div style={{marginTop:34,fontSize:31,color:C.muted,maxWidth:940,lineHeight:1.35}}>40 Sekunden. UI, Bilder, Daten, 3D, Skia, Sound und echte Szenenregie.</div>
    </div>
    <div style={{position:'absolute',right:125,bottom:100,display:'flex',gap:16,opacity:cut}}>{(['play','image','chart','cube','spark'] as const).map((x,i)=><div key={x} style={{width:86,height:86,borderRadius:24,display:'grid',placeItems:'center',background:i===4?C.purple:C.white,color:i===4?C.white:C.ink,border:`1px solid ${C.line}`,scale:.8+cut*.2}}><Icon type={x}/></div>)}</div>
  </SceneShell>;
};

const StudioScene:React.FC=()=>{
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const enter=spring({fps,frame:f,config:{damping:20,stiffness:120}});
  const zoom=interpolate(f,[0,150],[1.03,1.14],clamp); const pan=interpolate(f,[0,150],[0,-46],clamp);
  return <SceneShell>
    <div style={{position:'absolute',left:100,top:72}}><Label>UI / Screenshot Composition</Label><div style={{marginTop:18}}><Title size={58}>Aus einer Oberfläche wird eine Kamerafahrt.</Title></div></div>
    <div style={{position:'absolute',left:150,right:150,top:255,bottom:92,borderRadius:34,background:'#20242B',boxShadow:'0 35px 80px rgba(26,26,46,.20)',overflow:'hidden',opacity:enter,scale:.94+enter*.06}}>
      <div style={{height:64,background:'#171A20',display:'flex',alignItems:'center',gap:12,padding:'0 22px'}}><i style={{width:16,height:16,borderRadius:99,background:'#FF5F57'}}/><i style={{width:16,height:16,borderRadius:99,background:'#FEBC2E'}}/><i style={{width:16,height:16,borderRadius:99,background:'#28C840'}}/><div style={{marginLeft:28,color:'#B9BDC8',fontSize:18}}>Remotion Studio · Motion Showcase</div></div>
      <div style={{position:'absolute',left:0,top:64,bottom:0,width:290,background:'#1D2128',padding:22,color:'#DDE0E8'}}>
        <div style={{fontSize:14,color:'#8F96A6',fontWeight:800,letterSpacing:1}}>COMPOSITIONS</div>
        {['Hook','StudioCamera','MediaBoard','DataStory','ThreeWorld','SkiaFX','Finale'].map((x,i)=><div key={x} style={{marginTop:13,padding:'12px 14px',borderRadius:10,background:i===1?'#303746':'transparent',fontSize:18}}>{x}</div>)}
      </div>
      <div style={{position:'absolute',left:290,right:0,top:64,bottom:150,background:'#11151A',display:'grid',placeItems:'center',overflow:'hidden'}}>
        <div style={{width:1060,height:560,background:C.bg,borderRadius:20,overflow:'hidden',position:'relative',scale:zoom,translate:`${pan}px 0`,boxShadow:'0 0 0 2px #268DFF'}}>
          <div style={{position:'absolute',left:55,top:48}}><Label>CAMERA MOVE</Label><div style={{marginTop:16,fontSize:52,fontWeight:900,letterSpacing:-2}}>Zoom. Pan. Fokus.</div></div>
          <div style={{position:'absolute',left:56,right:56,top:200,height:250,display:'grid',gridTemplateColumns:'1.15fr .85fr',gap:22}}>
            <div style={{borderRadius:24,background:'linear-gradient(135deg,#EEE7FF,#FFFFFF)',border:`1px solid ${C.line}`,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',left:38,top:38,width:220,height:220,borderRadius:58,background:C.purple}}/><div style={{position:'absolute',left:105,top:105,color:C.white}}><Icon type="play" size={86}/></div>
              <div style={{position:'absolute',right:36,bottom:32,fontWeight:850,fontSize:30}}>Footage + UI</div>
            </div>
            <div style={{display:'grid',gridTemplateRows:'1fr 1fr',gap:18}}><div style={{borderRadius:22,background:C.white,border:`1px solid ${C.line}`,padding:26}}><Icon type="image"/><div style={{fontSize:26,fontWeight:800,marginTop:12}}>Image callout</div></div><div style={{borderRadius:22,background:C.ink,color:C.white,padding:26}}><Icon type="spark"/><div style={{fontSize:26,fontWeight:800,marginTop:12}}>Motion layer</div></div></div>
          </div>
        </div>
      </div>
      <div style={{position:'absolute',left:290,right:0,bottom:0,height:150,background:'#181C22',borderTop:'1px solid #343A45'}}>{[0,1,2,3].map((i)=><div key={i} style={{position:'absolute',left:20+i*110,top:20+i*25,height:24,width:780-i*120,borderRadius:5,background:i===0?'#307FD3':'#31516F'}}/>)}<div style={{position:'absolute',left:340,top:0,bottom:0,width:3,background:'#FF4C4C'}}/></div>
    </div>
  </SceneShell>;
};

const MediaScene:React.FC=()=>{
  const f=useCurrentFrame(); const {fps}=useVideoConfig();
  const cards=[{icon:'image' as const,t:'Bild',s:'Crop + Parallax'},{icon:'play' as const,t:'B‑Roll Slot',s:'lokal + provenance'},{icon:'spark' as const,t:'Icons',s:'SVG + Motion'}];
  return <SceneShell>
    <div style={{position:'absolute',left:110,top:78}}><Label>Media Direction</Label><div style={{marginTop:18}}><Title size={62}>Medien werden inszeniert – nicht nur eingeblendet.</Title></div></div>
    <div style={{position:'absolute',left:110,right:110,top:270,bottom:100,display:'grid',gridTemplateColumns:'1.35fr .65fr',gap:32}}>
      <div style={{borderRadius:34,overflow:'hidden',position:'relative',background:'linear-gradient(135deg,#121722,#2E234C)',border:'1px solid #2F3440'}}>
        <div style={{position:'absolute',inset:0,opacity:.22,backgroundImage:'linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)',backgroundSize:'46px 46px'}}/>
        {[0,1,2,3,4].map(i=>{const p=spring({fps,frame:Math.max(0,f-i*10),config:{damping:20,stiffness:130}});return <div key={i} style={{position:'absolute',left:110+i*150,top:145+(i%2)*120,width:110,height:110,borderRadius:28,background:i===4?C.green:C.lav,opacity:.9*p,scale:.6+.4*p,rotate:`${i*9-14}deg`,boxShadow:'0 24px 50px rgba(0,0,0,.2)'}}/>})}
        <div style={{position:'absolute',left:60,bottom:56,color:C.white}}><div style={{fontSize:22,color:'#C8CAD3'}}>Cinematic insert</div><div style={{fontSize:42,fontWeight:900,marginTop:6}}>Lokale Medien + Motion Layers</div></div>
        <div style={{position:'absolute',right:48,top:42}}><Label>REAL B‑ROLL: FAIL‑CLOSED</Label></div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:18,justifyContent:'center'}}>{cards.map((c,i)=>{const p=spring({fps,frame:Math.max(0,f-i*12),config:{damping:18,stiffness:150}});return <div key={c.t} style={{borderRadius:26,background:C.white,border:`1px solid ${C.line}`,padding:26,display:'grid',gridTemplateColumns:'70px 1fr',gap:18,alignItems:'center',opacity:p,translate:`${(1-p)*40}px 0`}}><div style={{width:66,height:66,borderRadius:20,display:'grid',placeItems:'center',background:'#EFE7FF',color:C.purple}}><Icon type={c.icon}/></div><div><div style={{fontSize:28,fontWeight:850}}>{c.t}</div><div style={{fontSize:20,color:C.muted,marginTop:4}}>{c.s}</div></div></div>})}</div>
    </div>
  </SceneShell>;
};

const DataScene:React.FC=()=>{
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const progress=interpolate(f,[10,145],[0,1],clamp);
  const data=[{x:'Jan',v:12},{x:'Feb',v:25},{x:'Mär',v:22},{x:'Apr',v:48},{x:'Mai',v:62},{x:'Jun',v:91}];
  const count=Math.round(interpolate(progress,[0,1],[18,91]));
  return <SceneShell>
    <div style={{position:'absolute',left:110,top:78}}><Label>Datenvisualisierung</Label><div style={{marginTop:18}}><Title size={64}>Zahlen bekommen Timing.</Title></div></div>
    <div style={{position:'absolute',left:110,right:110,top:285,bottom:100,display:'grid',gridTemplateColumns:'.55fr 1.45fr',gap:36}}>
      <div style={{borderRadius:34,background:C.ink,color:C.white,padding:42,display:'flex',flexDirection:'column',justifyContent:'space-between'}}><Icon type="chart" size={64}/><div><div style={{fontSize:134,fontWeight:900,letterSpacing:-8,color:C.lav}}>{count}%</div><div style={{fontSize:28,fontWeight:780}}>Motion completion</div><div style={{marginTop:14,color:'#AEB2BF',fontSize:20,lineHeight:1.45}}>Counter, Chart und Annotation laufen auf derselben Frame-Timeline.</div></div></div>
      <div style={{borderRadius:34,background:C.white,border:`1px solid ${C.line}`,padding:34,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',left:55,right:55,top:35,bottom:55,clipPath:`inset(0 ${100-progress*100}% 0 0)`}}><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><defs><linearGradient id="showcaseFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.purple} stopOpacity={.35}/><stop offset="100%" stopColor={C.purple} stopOpacity={.02}/></linearGradient></defs><XAxis dataKey="x" axisLine={false} tickLine={false}/><YAxis hide/><Area type="monotone" dataKey="v" stroke={C.purple} strokeWidth={7} fill="url(#showcaseFill)" isAnimationActive={false}/></AreaChart></ResponsiveContainer></div>
        <div style={{position:'absolute',right:52,top:44}}><Label tone={C.green}>LIVE FRAME DATA</Label></div>
      </div>
    </div>
  </SceneShell>;
};

const ThreeObject:React.FC=()=>{const f=useCurrentFrame();const t=f/28;return <><ambientLight intensity={1.4}/><pointLight position={[4,5,6]} intensity={30}/><pointLight position={[-5,-2,4]} intensity={18} color={C.lav}/><mesh rotation={[t*.35,t*.65,t*.18]}><icosahedronGeometry args={[1.55,2]}/><meshStandardMaterial color={C.purple} metalness={.25} roughness={.28}/></mesh>{[[3,1,0],[-3,-1,0],[2.8,-2,0],[-2.8,2,0]].map((p,i)=><mesh key={i} position={p as [number,number,number]} rotation={[0,t*.3+i,0]}><boxGeometry args={[.75,.75,.75]}/><meshStandardMaterial color={i===2?C.green:C.lav} roughness={.5}/></mesh>)}</>};
const ThreeScene:React.FC=()=>{const f=useCurrentFrame();const cam=interpolate(f,[0,170],[7.5,5.7],clamp);return <SceneShell><div style={{position:'absolute',left:110,top:78,zIndex:4}}><Label>Three.js / R3F</Label><div style={{marginTop:18}}><Title size={62}>Tiefe statt flacher Karten.</Title></div></div><div style={{position:'absolute',left:70,right:70,top:235,bottom:45,borderRadius:42,overflow:'hidden',background:'#11131C'}}><ThreeCanvas width={1780} height={800} camera={{position:[0,0,cam],fov:44}}><ThreeObject/></ThreeCanvas><div style={{position:'absolute',left:55,bottom:44,color:C.white,fontSize:26,fontWeight:800}}>Frame-driven 3D · Kamera · Licht · räumliche Hierarchie</div></div></SceneShell>};

const SkiaScene:React.FC=()=>{const f=useCurrentFrame();const x=interpolate(f,[0,170],[280,1640],clamp);const r=interpolate(f,[0,80,170],[80,270,150],clamp);const wave=noise2D('skia',f/30,0)*80;return <SceneShell><SkiaCanvas width={1920} height={1080}><Fill color={C.bg}/><SkiaRect x={0} y={720} width={1920} height={360} color="#EEE9F8"/><SkiaCircle cx={x} cy={520+wave} r={r} color={C.purple}/><SkiaCircle cx={1920-x} cy={650-wave*.4} r={r*.55} color={C.green}/></SkiaCanvas><div style={{position:'absolute',left:110,top:78}}><Label>Skia + Procedural Motion</Label><div style={{marginTop:18}}><Title size={62}>Masken, Formen, organische Bewegung.</Title></div></div><div style={{position:'absolute',right:120,bottom:90,width:280,height:280,display:'grid',placeItems:'center'}}><ShapeCircle radius={115} fill={C.lav} effects={[blur({radius:10})]} pixelDensity={1}/><div style={{position:'absolute',fontSize:30,fontWeight:900}}>FX</div></div></SceneShell>};

const Finale:React.FC=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();const items=[['UI','play'],['Bilder','image'],['Daten','chart'],['3D','cube'],['FX','spark']] as const;return <SceneShell><div style={{position:'absolute',left:110,top:120}}><Label>Finale</Label><div style={{marginTop:22}}><Title>Ein System.<br/><span style={{color:C.purple}}>Viele visuelle Sprachen.</span></Title></div></div><div style={{position:'absolute',left:110,right:110,bottom:130,display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:18}}>{items.map(([t,icon],i)=>{const p=spring({fps,frame:Math.max(0,f-i*10),config:{damping:17,stiffness:155}});return <div key={t} style={{height:205,borderRadius:30,background:i===4?C.ink:C.white,color:i===4?C.white:C.ink,border:`1px solid ${i===4?'#34374A':C.line}`,padding:26,opacity:p,translate:`0 ${(1-p)*55}px`,scale:.9+p*.1}}><Icon type={icon} size={50}/><div style={{fontSize:31,fontWeight:880,marginTop:32}}>{t}</div></div>})}</div><div style={{position:'absolute',right:110,top:145,fontSize:23,color:C.muted}}>40s Motion Showcase · 1920×1080 · 30fps</div></SceneShell>};

export const RemotionShowcase:React.FC=()=> <AbsoluteFill>
  <Sequence from={SHOWCASE_SCENES[0].from} durationInFrames={SHOWCASE_SCENES[0].duration}><Hook/></Sequence>
  <Sequence from={SHOWCASE_SCENES[1].from} durationInFrames={SHOWCASE_SCENES[1].duration}><StudioScene/></Sequence>
  <Sequence from={SHOWCASE_SCENES[2].from} durationInFrames={SHOWCASE_SCENES[2].duration}><MediaScene/></Sequence>
  <Sequence from={SHOWCASE_SCENES[3].from} durationInFrames={SHOWCASE_SCENES[3].duration}><DataScene/></Sequence>
  <Sequence from={SHOWCASE_SCENES[4].from} durationInFrames={SHOWCASE_SCENES[4].duration}><ThreeScene/></Sequence>
  <Sequence from={SHOWCASE_SCENES[5].from} durationInFrames={SHOWCASE_SCENES[5].duration}><SkiaScene/></Sequence>
  <Sequence from={SHOWCASE_SCENES[6].from} durationInFrames={SHOWCASE_SCENES[6].duration}><Finale/></Sequence>
  <Sequence from={110} durationInFrames={35}><Audio src={staticFile('sfx/reveal-swell.ogg')} volume={.18}/></Sequence>
  <Sequence from={300} durationInFrames={35}><Audio src={staticFile('sfx/whoosh-short.ogg')} volume={.2}/></Sequence>
  <Sequence from={650} durationInFrames={35}><Audio src={staticFile('sfx/impact-soft.ogg')} volume={.2}/></Sequence>
  <Sequence from={1010} durationInFrames={35}><Audio src={staticFile('sfx/chime-success.ogg')} volume={.18}/></Sequence>
</AbsoluteFill>;
