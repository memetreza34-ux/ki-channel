import React from 'react';
import {AbsoluteFill,Audio,Img,OffthreadVideo,Sequence,interpolate,spring,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
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
type IconType='play'|'image'|'cube'|'chart'|'spark'|'code'|'cursor'|'audio';

const Icon:React.FC<{type:IconType;size?:number}> = ({type,size=42}) => {
  const common={width:size,height:size,viewBox:'0 0 48 48',fill:'none',stroke:'currentColor',strokeWidth:3.2,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
  if(type==='play')return <svg {...common}><rect x="5" y="8" width="38" height="32" rx="8"/><path d="m20 17 12 7-12 7Z" fill="currentColor" stroke="none"/></svg>;
  if(type==='image')return <svg {...common}><rect x="6" y="7" width="36" height="34" rx="7"/><circle cx="17" cy="18" r="3" fill="currentColor" stroke="none"/><path d="m10 35 10-10 7 7 5-5 10 9"/></svg>;
  if(type==='cube')return <svg {...common}><path d="m24 5 16 9v19l-16 10L8 33V14Z"/><path d="m8 14 16 10 16-10M24 24v19"/></svg>;
  if(type==='chart')return <svg {...common}><path d="M7 39h35M10 34l9-10 8 5 12-17"/><circle cx="19" cy="24" r="2" fill="currentColor"/><circle cx="27" cy="29" r="2" fill="currentColor"/><circle cx="39" cy="12" r="2" fill="currentColor"/></svg>;
  if(type==='code')return <svg {...common}><path d="m18 14-10 10 10 10M30 14l10 10-10 10M28 8 20 40"/></svg>;
  if(type==='cursor')return <svg {...common}><path d="M10 6v31l9-8 7 13 7-4-7-13h12Z" fill="currentColor" stroke="none"/></svg>;
  if(type==='audio')return <svg {...common}><path d="M9 28h7l10 9V11l-10 9H9ZM32 18c3 3 3 9 0 12M37 13c6 6 6 16 0 22"/></svg>;
  return <svg {...common}><path d="m24 4 3.5 11.5L39 19l-11.5 3.5L24 34l-3.5-11.5L9 19l11.5-3.5Z"/><path d="m38 31 1.5 5L44 38l-4.5 1.5L38 44l-1.5-4.5L32 38l4.5-2Z"/></svg>;
};

const Label:React.FC<{children:React.ReactNode;tone?:string}> = ({children,tone=C.purple}) => <div style={{display:'inline-flex',padding:'10px 16px',borderRadius:999,border:`1px solid ${tone}44`,background:`${tone}12`,color:tone,fontSize:20,fontWeight:800,letterSpacing:1.2,textTransform:'uppercase'}}>{children}</div>;
const Title:React.FC<{children:React.ReactNode;size?:number}> = ({children,size=82}) => <div style={{fontFamily:FONT,fontWeight:900,fontSize:size,lineHeight:.98,letterSpacing:-3.5,color:C.ink}}>{children}</div>;
const SceneShell:React.FC<{children:React.ReactNode}> = ({children}) => <AbsoluteFill style={{backgroundColor:C.bg,fontFamily:FONT,color:C.ink,overflow:'hidden'}}>{children}</AbsoluteFill>;

const Hook:React.FC=()=>{
  const f=useCurrentFrame(); const {fps}=useVideoConfig();
  const enter=spring({fps,frame:f,config:{damping:18,stiffness:135}}); const cut=interpolate(f,[58,100],[0,1],clamp); const drift=noise2D('showcase-hook',f/50,0)*25;
  return <SceneShell>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 65% 35%, rgba(185,140,255,.32), transparent 35%)'}}/>
    {[0,1,2,3,4].map(i=><div key={i} style={{position:'absolute',left:230+i*320+drift,top:120+(i%2)*540,width:170,height:170,borderRadius:42,border:`1px solid ${C.line}`,background:C.white,rotate:`${-12+i*7}deg`,opacity:.35,scale:.8+enter*.2}}/>) }
    <div style={{position:'absolute',left:130,top:170,width:1450,opacity:enter,translate:`0 ${40-enter*40}px`}}><Label>Motion Lab · Test 02</Label><div style={{marginTop:34}}><Title>Echte Medien.<br/><span style={{color:C.purple}}>Echte Motion Layers.</span></Title></div><div style={{marginTop:34,fontSize:31,color:C.muted,maxWidth:1050,lineHeight:1.35}}>Screenshot, CC0-B-Roll, Foto, Icons, Daten, 3D, Skia und Sound in einem 40-Sekunden-Test.</div></div>
    <div style={{position:'absolute',right:125,bottom:100,display:'flex',gap:16,opacity:cut}}>{(['play','image','code','chart','cube','spark'] as IconType[]).map((x,i)=><div key={x} style={{width:86,height:86,borderRadius:24,display:'grid',placeItems:'center',background:i===5?C.purple:C.white,color:i===5?C.white:C.ink,border:`1px solid ${C.line}`,scale:.8+cut*.2}}><Icon type={x}/></div>)}</div>
  </SceneShell>;
};

const StudioScene:React.FC=()=>{
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const enter=spring({fps,frame:f,config:{damping:20,stiffness:120}}); const zoom=interpolate(f,[0,175],[1.02,1.17],clamp); const panX=interpolate(f,[0,175],[0,-72],clamp); const panY=interpolate(f,[0,175],[0,-18],clamp);
  const focusX=interpolate(f,[10,155],[1020,470],clamp); const focusY=interpolate(f,[10,155],[570,445],clamp);
  return <SceneShell>
    <div style={{position:'absolute',left:100,top:65,zIndex:4}}><Label>ECHTER SCREENSHOT</Label><div style={{marginTop:16}}><Title size={58}>Das echte Bild wird zur Kamerafahrt.</Title></div></div>
    <div style={{position:'absolute',left:125,right:125,top:235,bottom:75,borderRadius:34,overflow:'hidden',background:'#10131A',boxShadow:'0 36px 95px rgba(26,26,46,.23)',opacity:enter,scale:.96+enter*.04}}>
      <Img src={staticFile('showcase/user-remotion-studio.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',transform:`translate(${panX}px,${panY}px) scale(${zoom})`,transformOrigin:'center center'}}/>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(10,12,18,.06),rgba(10,12,18,.35))'}}/>
      <div style={{position:'absolute',left:focusX,top:focusY,width:360,height:190,borderRadius:24,border:'4px solid #FFFFFF',boxShadow:'0 0 0 9999px rgba(10,12,18,.30),0 18px 50px rgba(0,0,0,.25)'}}/>
      <div style={{position:'absolute',left:42,bottom:38,display:'flex',gap:12}}>{(['cursor','image','play','code','audio'] as IconType[]).map((type,i)=>{const p=spring({fps,frame:Math.max(0,f-18-i*8),config:{damping:17,stiffness:160}});return <div key={type} style={{width:72,height:72,borderRadius:22,background:i===0?C.purple:'rgba(255,255,255,.93)',color:i===0?C.white:C.ink,display:'grid',placeItems:'center',scale:.75+.25*p,opacity:p,boxShadow:'0 14px 30px rgba(0,0,0,.18)'}}><Icon type={type} size={36}/></div>})}</div>
      <div style={{position:'absolute',right:42,bottom:42,padding:'14px 20px',borderRadius:999,background:'rgba(26,26,46,.88)',color:C.white,fontSize:20,fontWeight:800}}>USER-PROVIDED · LOCAL ASSET</div>
    </div>
  </SceneShell>;
};

const MediaScene:React.FC=()=>{
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const videoScale=interpolate(f,[0,175],[1.04,1.14],clamp); const photoY=interpolate(f,[0,175],[-15,-65],clamp);
  const iconTypes=['play','image','cursor','code','audio','spark'] as IconType[];
  return <SceneShell>
    <div style={{position:'absolute',left:90,top:60,zIndex:10}}><Label>REAL MEDIA COMPOSITING</Label><div style={{marginTop:16}}><Title size={56}>B-Roll, Foto und Icons sind jetzt wirklich im Frame.</Title></div></div>
    <div style={{position:'absolute',left:90,right:90,top:225,bottom:65,display:'grid',gridTemplateColumns:'1.32fr .68fr',gap:24}}>
      <div style={{borderRadius:34,overflow:'hidden',position:'relative',background:C.ink,boxShadow:'0 28px 70px rgba(26,26,46,.18)'}}>
        <OffthreadVideo src={staticFile('showcase/speed-typing-dvorak.mp4')} muted style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${videoScale})`}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent 42%,rgba(10,11,18,.88) 100%)'}}/>
        <div style={{position:'absolute',left:34,top:30}}><Label tone={C.green}>CC0 · ECHTE B-ROLL</Label></div>
        <div style={{position:'absolute',left:42,bottom:38,color:C.white}}><div style={{fontSize:21,color:'#D1D4DC'}}>Wikimedia Commons · Fast Typing on Keyboard</div><div style={{fontSize:43,fontWeight:900,marginTop:7}}>Bewegtes Material als Story-Layer</div></div>
        <div style={{position:'absolute',right:32,bottom:34,display:'flex',gap:10}}>{(['play','code','audio'] as IconType[]).map((type,i)=>{const p=spring({fps,frame:Math.max(0,f-8-i*9),config:{damping:18,stiffness:160}});return <div key={type} style={{width:66,height:66,borderRadius:20,display:'grid',placeItems:'center',background:'rgba(255,255,255,.94)',color:C.ink,scale:.72+.28*p,rotate:`${(1-p)*(i%2?12:-12)}deg`}}><Icon type={type} size={34}/></div>})}</div>
      </div>
      <div style={{display:'grid',gridTemplateRows:'1.15fr .85fr',gap:20}}>
        <div style={{borderRadius:30,overflow:'hidden',position:'relative',background:C.white,border:`1px solid ${C.line}`}}>
          <Img src={staticFile('showcase/laptop-on-desk.jpg')} style={{width:'100%',height:'125%',objectFit:'cover',transform:`translateY(${photoY}px) scale(1.08)`}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent 48%,rgba(10,11,18,.78))'}}/>
          <div style={{position:'absolute',left:25,bottom:24,color:C.white}}><div style={{fontSize:18}}>CC0 FOTO</div><div style={{fontSize:29,fontWeight:900}}>Laptop on a desk</div></div>
          <div style={{position:'absolute',right:22,top:20,width:68,height:68,borderRadius:20,display:'grid',placeItems:'center',background:'rgba(255,255,255,.94)',color:C.purple}}><Icon type="image" size={36}/></div>
        </div>
        <div style={{borderRadius:30,background:C.white,border:`1px solid ${C.line}`,padding:20,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>{iconTypes.map((type,i)=>{const p=spring({fps,frame:Math.max(0,f-26-i*7),config:{damping:15,stiffness:190}});return <div key={type} style={{borderRadius:20,display:'grid',placeItems:'center',background:i===5?C.purple:'#F1ECFC',color:i===5?C.white:C.purple,scale:.62+.38*p,rotate:`${(1-p)*(i%2?14:-14)}deg`}}><Icon type={type} size={42}/></div>})}</div>
      </div>
    </div>
  </SceneShell>;
};

const DataScene:React.FC=()=>{
  const f=useCurrentFrame(); const progress=interpolate(f,[10,145],[0,1],clamp); const data=[{x:'Jan',v:12},{x:'Feb',v:25},{x:'Mär',v:22},{x:'Apr',v:48},{x:'Mai',v:62},{x:'Jun',v:91}]; const count=Math.round(interpolate(progress,[0,1],[18,91]));
  return <SceneShell><div style={{position:'absolute',left:110,top:78}}><Label>Datenvisualisierung</Label><div style={{marginTop:18}}><Title size={64}>Zahlen bekommen Timing.</Title></div></div><div style={{position:'absolute',left:110,right:110,top:285,bottom:100,display:'grid',gridTemplateColumns:'.55fr 1.45fr',gap:36}}><div style={{borderRadius:34,background:C.ink,color:C.white,padding:42,display:'flex',flexDirection:'column',justifyContent:'space-between'}}><Icon type="chart" size={64}/><div><div style={{fontSize:134,fontWeight:900,letterSpacing:-8,color:C.lav}}>{count}%</div><div style={{fontSize:28,fontWeight:780}}>Motion completion</div><div style={{marginTop:14,color:'#AEB2BF',fontSize:20,lineHeight:1.45}}>Counter, Chart und Annotation laufen auf derselben Frame-Timeline.</div></div></div><div style={{borderRadius:34,background:C.white,border:`1px solid ${C.line}`,padding:34,position:'relative',overflow:'hidden'}}><div style={{position:'absolute',left:55,right:55,top:35,bottom:55,clipPath:`inset(0 ${100-progress*100}% 0 0)`}}><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><defs><linearGradient id="showcaseFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.purple} stopOpacity={.35}/><stop offset="100%" stopColor={C.purple} stopOpacity={.02}/></linearGradient></defs><XAxis dataKey="x" axisLine={false} tickLine={false}/><YAxis hide/><Area type="monotone" dataKey="v" stroke={C.purple} strokeWidth={7} fill="url(#showcaseFill)" isAnimationActive={false}/></AreaChart></ResponsiveContainer></div><div style={{position:'absolute',right:52,top:44}}><Label tone={C.green}>LIVE FRAME DATA</Label></div></div></div></SceneShell>;
};

const ThreeObject:React.FC=()=>{const f=useCurrentFrame();const t=f/28;return <><ambientLight intensity={1.4}/><pointLight position={[4,5,6]} intensity={30}/><pointLight position={[-5,-2,4]} intensity={18} color={C.lav}/><mesh rotation={[t*.35,t*.65,t*.18]}><icosahedronGeometry args={[1.55,2]}/><meshStandardMaterial color={C.purple} metalness={.25} roughness={.28}/></mesh>{[[3,1,0],[-3,-1,0],[2.8,-2,0],[-2.8,2,0]].map((p,i)=><mesh key={i} position={p as [number,number,number]} rotation={[0,t*.3+i,0]}><boxGeometry args={[.75,.75,.75]}/><meshStandardMaterial color={i===2?C.green:C.lav} roughness={.5}/></mesh>)}</>};
const ThreeScene:React.FC=()=>{const f=useCurrentFrame();const cam=interpolate(f,[0,170],[7.5,5.7],clamp);return <SceneShell><div style={{position:'absolute',left:110,top:78,zIndex:4}}><Label>Three.js / R3F</Label><div style={{marginTop:18}}><Title size={62}>Tiefe statt flacher Karten.</Title></div></div><div style={{position:'absolute',left:70,right:70,top:235,bottom:45,borderRadius:42,overflow:'hidden',background:'#11131C'}}><ThreeCanvas width={1780} height={800} camera={{position:[0,0,cam],fov:44}}><ThreeObject/></ThreeCanvas><div style={{position:'absolute',left:55,bottom:44,color:C.white,fontSize:26,fontWeight:800}}>Frame-driven 3D · Kamera · Licht · räumliche Hierarchie</div></div></SceneShell>};

const SkiaScene:React.FC=()=>{const f=useCurrentFrame();const x=interpolate(f,[0,170],[280,1640],clamp);const r=interpolate(f,[0,80,170],[80,270,150],clamp);const wave=noise2D('skia',f/30,0)*80;return <SceneShell><SkiaCanvas width={1920} height={1080}><Fill color={C.bg}/><SkiaRect x={0} y={720} width={1920} height={360} color="#EEE9F8"/><SkiaCircle cx={x} cy={520+wave} r={r} color={C.purple}/><SkiaCircle cx={1920-x} cy={650-wave*.4} r={r*.55} color={C.green}/></SkiaCanvas><div style={{position:'absolute',left:110,top:78}}><Label>Skia + Procedural Motion</Label><div style={{marginTop:18}}><Title size={62}>Masken, Formen, organische Bewegung.</Title></div></div><div style={{position:'absolute',right:120,bottom:90,width:280,height:280,display:'grid',placeItems:'center'}}><ShapeCircle radius={115} fill={C.lav} effects={[blur({radius:10})]} pixelDensity={1}/><div style={{position:'absolute',fontSize:30,fontWeight:900}}>FX</div></div></SceneShell>};

const Finale:React.FC=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();const items=[['B-Roll','play'],['Foto','image'],['Daten','chart'],['3D','cube'],['FX','spark']] as const;return <SceneShell><div style={{position:'absolute',left:110,top:110}}><Label>Finale</Label><div style={{marginTop:22}}><Title>Echte Assets.<br/><span style={{color:C.purple}}>Viele visuelle Sprachen.</span></Title></div></div><div style={{position:'absolute',right:110,top:128,width:510,height:300,borderRadius:28,overflow:'hidden',boxShadow:'0 24px 60px rgba(26,26,46,.18)',rotate:'3deg'}}><Img src={staticFile('showcase/laptop-on-desk.jpg')} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div><div style={{position:'absolute',left:110,right:110,bottom:115,display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:18}}>{items.map(([t,icon],i)=>{const p=spring({fps,frame:Math.max(0,f-i*10),config:{damping:17,stiffness:155}});return <div key={t} style={{height:195,borderRadius:30,background:i===4?C.ink:C.white,color:i===4?C.white:C.ink,border:`1px solid ${i===4?'#34374A':C.line}`,padding:26,opacity:p,translate:`0 ${(1-p)*55}px`,scale:.9+p*.1}}><Icon type={icon as IconType} size={50}/><div style={{fontSize:31,fontWeight:880,marginTop:28}}>{t}</div></div>})}</div><div style={{position:'absolute',right:110,bottom:50,fontSize:21,color:C.muted}}>40s · 1920×1080 · 30fps · local media only at render time</div></SceneShell>};

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
