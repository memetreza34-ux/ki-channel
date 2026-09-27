import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill,Easing,Sequence,interpolate,spring,useCurrentFrame,useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {assertAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {AnimatedDataPath,DepthStage,KineticType,ShapeSignal} from '../../visual-system/AdvancedMotionKit';
import {BrandAnchor,TechIcon} from '../../visual-system/TechVisualKit';
import {REEL_CAPTION_SAFE} from '../captionSafe';
import {VOICE_PLUGIN_SCENES,VOICE_PLUGIN_SUBTITLES} from './contract';
import {VOICE_PLUGIN_VISUAL_PROFILES} from './visualProfiles';
import './visualQuality';

assertAuthoredVisualDiversity(VOICE_PLUGIN_VISUAL_PROFILES);

const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const ease=(frame:number,from:number,to:number)=>interpolate(frame,[from,Math.max(from+1,to)],[0,1],{...clamp,easing:Easing.bezier(.16,1,.3,1)});
const pop=(frame:number,fps:number,delay=0)=>spring({frame:Math.max(0,frame-delay),fps,config:{damping:16,stiffness:150,mass:.72}});

const SceneHeader:React.FC<{text:string;dark?:boolean}>=({text,dark=false})=>{
  const frame=useCurrentFrame();
  const p=ease(frame,0,20);
  return <div style={{position:'absolute',top:76,left:72,right:72,zIndex:70,textAlign:'center',opacity:p,translate:`0px ${(1-p)*-18}px`}}>
    <div style={{fontSize:28,fontWeight:950,letterSpacing:2.6,color:dark?'rgba(255,255,255,.82)':BRAND.accentDk}}>{text}</div>
    <div style={{width:120,height:4,borderRadius:4,background:dark?'#B98CFF':BRAND.accentDk,margin:'18px auto 0'}}/>
  </div>;
};

const MovingConstellation:React.FC<{dark?:boolean;density?:number;speed?:number}>=({dark=false,density=18,speed=1})=>{
  const frame=useCurrentFrame();
  return <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
    {Array.from({length:density},(_,i)=>{
      const x=(83+i*197)%1030;
      const y=180+((i*269)%1120);
      const dx=Math.sin(frame/(17+i%5)*speed+i)*24;
      const dy=Math.cos(frame/(21+i%7)*speed+i*.7)*20;
      const size=5+(i%4)*3;
      return <div key={i} style={{position:'absolute',left:x,top:y,width:size,height:size,borderRadius:'50%',background:dark?'rgba(220,200,255,.54)':'rgba(110,69,201,.26)',boxShadow:dark?'0 0 18px rgba(185,140,255,.46)':'0 0 14px rgba(110,69,201,.14)',translate:`${dx}px ${dy}px`,opacity:.45+(i%3)*.14}}/>;
    })}
    {Array.from({length:7},(_,i)=>{
      const y=290+i*145;
      const drift=Math.sin(frame/(25+i*2))*38;
      return <div key={`line-${i}`} style={{position:'absolute',left:110+drift,top:y,width:860-(i%3)*90,height:1,background:dark?'linear-gradient(90deg,transparent,rgba(185,140,255,.16),transparent)':'linear-gradient(90deg,transparent,rgba(110,69,201,.10),transparent)',rotate:`${-5+i*1.7}deg`}}/>;
    })}
  </div>;
};

const VoiceOrb:React.FC<{x:number;y:number;size:number;progress:number;dark?:boolean}>=({x,y,size,progress,dark=false})=>{
  const frame=useCurrentFrame();
  const pulse=1+Math.sin(frame/6)*.045*progress;
  const halo=1+Math.sin(frame/10)*.08;
  return <div style={{position:'absolute',left:x,top:y,width:size,height:size}}>
    <div style={{position:'absolute',left:-size*.13,top:-size*.13,width:size*1.26,height:size*1.26,borderRadius:'50%',border:`3px solid ${dark?'rgba(185,140,255,.20)':'rgba(110,69,201,.15)'}`,scale:`${halo}`,opacity:progress*.8}}/>
    <div style={{position:'absolute',inset:0,borderRadius:'50%',background:dark?'radial-gradient(circle at 35% 28%,#E9D8FF 0%,#9C6CEB 35%,#5D31B9 70%,#1A1328 100%)':'radial-gradient(circle at 35% 28%,#fff 0%,#E7D9FF 38%,#B98CFF 72%,#6E45C9 100%)',boxShadow:dark?'0 0 0 22px rgba(185,140,255,.09),0 40px 120px rgba(0,0,0,.45)':'0 0 0 22px rgba(110,69,201,.07),0 35px 100px rgba(110,69,201,.22)',scale:`${(.72+.28*progress)*pulse}`,opacity:progress,display:'grid',placeItems:'center'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,height:size*.34}}>{[.36,.72,1,.58,.9,.42].map((h,i)=><div key={i} style={{width:10,height:size*.24*h*(.78+.22*Math.abs(Math.sin(frame/5+i))),borderRadius:10,background:'#fff',opacity:.82+Math.sin(frame/5+i)*.12}}/>)}</div>
    </div>
  </div>;
};

const ArtifactGlyph:React.FC<{kind:'doc'|'slides'|'sheet';x:number;y:number;scale?:number;opacity?:number;rotate?:number}>=({kind,x,y,scale=1,opacity=1,rotate=0})=>{
  const frame=useCurrentFrame();
  const bob=Math.sin(frame/13+x/90)*8;
  return <div style={{position:'absolute',left:x,top:y,width:kind==='slides'?260:210,height:kind==='slides'?170:280,borderRadius:kind==='slides'?32:24,background:kind==='slides'?'linear-gradient(135deg,#21172F,#6E45C9)':'linear-gradient(155deg,#fff,#EEE7FA)',border:'3px solid rgba(110,69,201,.18)',boxShadow:'0 25px 70px rgba(45,30,68,.16)',scale:`${scale}`,opacity,rotate:`${rotate}deg`,translate:`0px ${bob}px`,overflow:'hidden'}}>
    {kind==='doc'?<><div style={{position:'absolute',left:28,top:34,width:122,height:14,borderRadius:14,background:BRAND.accentDk}}/>{[0,1,2,3,4].map(i=><div key={i} style={{position:'absolute',left:28,top:82+i*34,width:145-i*7,height:8,borderRadius:8,background:'rgba(26,26,46,.16)'}}/>)}</>:null}
    {kind==='slides'?<><div style={{position:'absolute',left:24,top:24,right:24,bottom:50,borderRadius:20,background:'radial-gradient(circle at 30% 30%,#CBAAFF,#6E45C9 48%,#241832 100%)'}}/><div style={{position:'absolute',right:24,bottom:16,color:'#fff',fontSize:22,fontWeight:950}}>SLIDES</div></>:null}
    {kind==='sheet'?<div style={{position:'absolute',inset:22,backgroundImage:'linear-gradient(rgba(110,69,201,.18) 2px,transparent 2px),linear-gradient(90deg,rgba(110,69,201,.18) 2px,transparent 2px)',backgroundSize:'42px 36px'}}/>:null}
  </div>;
};

const ObjectMorph:React.FC<{progress:number}>=({progress})=>{
  const stage=progress<.34?0:progress<.67?1:2;
  const labels=['DOC','SLIDES','SHEET'] as const;
  const aspect=[.72,1.45,1.08][stage];
  const width=470;
  const height=width/aspect;
  return <div data-remotion-capability="object-transformation" style={{position:'absolute',left:195,top:120,width,height,translate:`0px ${Math.sin(progress*Math.PI*4)*-14}px`,rotate:`${interpolate(progress,[0,1],[-8,7],clamp)}deg`,scale:`${.86+.14*progress}`}}>
    <div style={{position:'absolute',inset:0,borderRadius:stage===0?28:stage===1?36:18,background:stage===0?'linear-gradient(155deg,#FFFFFF,#E8DCFF)':stage===1?'linear-gradient(135deg,#1E1730,#6E45C9)':'linear-gradient(155deg,#FFFFFF,#EDE8F7)',border:'4px solid rgba(110,69,201,.24)',boxShadow:'0 38px 90px rgba(45,30,68,.22)',overflow:'hidden'}}>
      {stage===0?<><div style={{position:'absolute',left:44,top:52,width:230,height:18,borderRadius:18,background:BRAND.accentDk}}/>{[0,1,2,3,4].map(i=><div key={i} style={{position:'absolute',left:44,top:105+i*48,width:330-i*22,height:10,borderRadius:10,background:'rgba(26,26,46,.16)'}}/>)}</>:null}
      {stage===1?<><div style={{position:'absolute',left:32,top:32,right:32,bottom:66,borderRadius:24,background:'radial-gradient(circle at 30% 30%,#B98CFF,#6E45C9 46%,#20162F 100%)'}}/><div style={{position:'absolute',left:42,bottom:24,fontSize:28,fontWeight:950,color:'#fff'}}>PRESENTATION</div></>:null}
      {stage===2?<div style={{position:'absolute',inset:30,backgroundImage:'linear-gradient(rgba(110,69,201,.18) 2px,transparent 2px),linear-gradient(90deg,rgba(110,69,201,.18) 2px,transparent 2px)',backgroundSize:'54px 42px'}}/>:null}
    </div>
    <div style={{position:'absolute',right:-26,top:-24,padding:'12px 18px',borderRadius:18,background:BRAND.accentDk,color:'#fff',fontWeight:950,fontSize:24}}>{labels[stage]}</div>
  </div>;
};

const CaptionLayer:React.FC=()=>{
  const frame=useCurrentFrame();
  const cue=VOICE_PLUGIN_SUBTITLES.find(item=>frame>=item.startFrame&&frame<item.endFrame);
  if(!cue)return null;
  const local=frame-cue.startFrame;
  const p=ease(local,0,8);
  return <div style={{position:'absolute',left:REEL_CAPTION_SAFE.horizontalInset,right:REEL_CAPTION_SAFE.horizontalInset,bottom:REEL_CAPTION_SAFE.bottom,zIndex:200,textAlign:'center',pointerEvents:'none'}}>
    <div style={{fontSize:48,fontWeight:950,lineHeight:1.08,letterSpacing:-1.1,color:'#fff',textShadow:'0 3px 14px rgba(0,0,0,.9),0 0 28px rgba(0,0,0,.8)',opacity:p,translate:`0px ${(1-p)*18}px`}}>{cue.text}</div>
  </div>;
};

// REMOTION_BEAT: voice-01-hook
const HookScene:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const intro=pop(frame,fps,0);
  const burst=ease(frame,8,70);
  const field=ease(frame,30,120);
  const orbit=frame*1.15;
  return <AbsoluteFill style={{background:'#100D1A',overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 62% 56%,rgba(110,69,201,.42),transparent 34%),radial-gradient(circle at 20% 22%,rgba(185,140,255,.18),transparent 32%)'}}/>
    <MovingConstellation dark density={24} speed={1.25}/>
    <BrandAnchor brand="chatgpt" x={56} y={70} compact accent/>
    <KineticType text="VOICE" x={92} y={245} width={900} fontSize={136} color="#fff" delay={2}/>
    <KineticType text="→ WORKFLOW" x={92} y={395} width={920} fontSize={118} color="#B98CFF" delay={16}/>
    <VoiceOrb x={310} y={735} size={460} progress={intro} dark/>
    <div style={{position:'absolute',left:540,top:965,width:2,height:2,scale:`${field}`}}>
      {[0,1,2].map(i=><div key={i} style={{position:'absolute',left:-7,top:-7,width:14,height:14,borderRadius:'50%',background:'#fff',boxShadow:`0 0 ${26+i*12}px rgba(185,140,255,.85)`,translate:`${[-330,0,330][i]*burst}px ${[-190,280,-150][i]*burst}px`,opacity:burst}}/>)}
      {[0,1,2,3,4,5].map(i=>{const a=(orbit+i*60)*Math.PI/180;return <div key={`orbit-${i}`} style={{position:'absolute',left:Math.cos(a)*300-7,top:Math.sin(a)*210-7,width:14,height:14,borderRadius:'50%',background:i%2?'#fff':'#B98CFF',boxShadow:'0 0 24px rgba(185,140,255,.7)',opacity:.55+.45*field}}/>})}
    </div>
    <ShapeSignal x={76} y={945} size={118} delay={28} direction="right" label="APP"/>
    <ShapeSignal x={708} y={825} size={118} delay={38} direction="right" label="TOOL"/>
    <ShapeSignal x={680} y={1125} size={118} delay={48} direction="right" label="TASK"/>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:520,background:'linear-gradient(180deg,transparent,rgba(0,0,0,.48))'}}/>
  </AbsoluteFill>;
};

// REMOTION_BEAT: voice-02-devices
const DeviceScene:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const enter=pop(frame,fps,2);
  const rotation=Math.sin(frame/26)*.22;
  const lift=ease(frame,6,72);
  return <AbsoluteFill style={{background:'linear-gradient(180deg,#FFFEFF,#F3EEFB 72%,#ECE4FA)',overflow:'hidden'}}>
    <MovingConstellation density={20} speed={.7}/>
    <SceneHeader text="WEB · iOS · ANDROID"/>
    {[0,1,2].map(i=><div key={i} style={{position:'absolute',left:95+i*315,top:300,width:260,height:780,borderRadius:80,border:'2px solid rgba(110,69,201,.10)',background:'linear-gradient(180deg,rgba(185,140,255,.08),transparent)',rotate:`${-5+i*5}deg`,opacity:.7}}/>)}
    <div style={{position:'absolute',left:0,top:220,width:1080,height:1030,opacity:enter}}>
      <ThreeCanvas width={1080} height={1030} camera={{position:[0,0,8],fov:42}}>
        <ambientLight intensity={1.18}/>
        <directionalLight position={[4,6,8]} intensity={2.2}/>
        <group rotation={[.08,rotation,0]} position={[0,-.05,0]}>
          {[-2.7,0,2.7].map((x,i)=>{
            const p=Math.max(0,Math.min(1,lift*1.75-i*.12));
            return <mesh key={x} position={[x,-1+(1-p)*-1.1,i===1?.45:0]} rotation={[0,(i-1)*-.22,0]} scale={[.82+.18*p,.82+.18*p,.82+.18*p]}>
              <boxGeometry args={[1.8,i===0?2.8:3.3,.28]}/>
              <meshStandardMaterial color={i===1?'#6E45C9':i===2?'#B98CFF':'#E8DBFF'} roughness={.28} metalness={.12}/>
            </mesh>;
          })}
          <mesh position={[0,2.25,-.4]} rotation={[0,0,rotation*.5]} scale={[.92+.08*lift,.92+.08*lift,.92+.08*lift]}>
            <sphereGeometry args={[.72,48,48]}/>
            <meshStandardMaterial color="#B98CFF" emissive="#6E45C9" emissiveIntensity={.48}/>
          </mesh>
          {[-3.1,0,3.1].map((x,i)=><mesh key={`floor-${i}`} position={[x,-2.7,-.2]} rotation={[-1.42,0,0]} scale={[1.2,1.2,1.2]}><circleGeometry args={[1.2,48]}/><meshStandardMaterial color={i===1?'#D8C3FF':'#E9DFFF'} transparent opacity={.42}/></mesh>)}
        </group>
      </ThreeCanvas>
    </div>
    {['WEB','iOS','ANDROID'].map((label,i)=><div key={label} style={{position:'absolute',left:[128,425,740][i],top:1175,width:210,textAlign:'center',fontSize:34,fontWeight:950,color:i===1?BRAND.accentDk:BRAND.ink,opacity:Math.max(.25,Math.min(1,lift*1.8-i*.12)),translate:`0px ${(1-lift)*24}px`}}>{label}</div>)}
    <div style={{position:'absolute',left:190,top:1308,width:700,textAlign:'center',fontSize:44,fontWeight:950,color:BRAND.ink,opacity:ease(frame,70,138)}}>EIN VOICE-SIGNAL · DREI OBERFLÄCHEN</div>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:500,background:'linear-gradient(180deg,transparent,rgba(22,15,34,.7))'}}/>
  </AbsoluteFill>;
};

// REMOTION_BEAT: voice-03-plugins
const PluginNetworkScene:React.FC=()=>{
  const frame=useCurrentFrame();
  const core=ease(frame,0,24);
  const orbit=frame*.024;
  const labels=[{x:86,y:500,label:'MAIL',icon:'workflow' as const},{x:758,y:450,label:'KALENDER',icon:'calendar' as const},{x:92,y:1010,label:'DATEIEN',icon:'git-branch' as const},{x:744,y:1040,label:'ACTION',icon:'zap' as const}];
  return <AbsoluteFill style={{background:'#15101F',overflow:'hidden'}}>
    <MovingConstellation dark density={28} speed={1.15}/>
    <SceneHeader text="VOICE TRIFFT DEINE TOOLS" dark/>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 50%,rgba(110,69,201,.34),transparent 32%)'}}/>
    {[0,1,2,3].map(i=><div key={`ghost-${i}`} style={{position:'absolute',left:540,top:700,width:470,height:2,background:'linear-gradient(90deg,rgba(185,140,255,.36),transparent)',transformOrigin:'0 50%',rotate:`${[-145,-35,145,35][i]}deg`,opacity:.45}}/>)}
    <AnimatedDataPath x={0} y={250} width={1080} height={980} path="M540 430 C430 330 280 260 170 250" delay={4} duration={58} stroke="#B98CFF" payloadSize={20}/>
    <AnimatedDataPath x={0} y={250} width={1080} height={980} path="M540 430 C650 315 780 250 880 220" delay={12} duration={62} stroke="#9B72E8" payloadSize={20}/>
    <AnimatedDataPath x={0} y={250} width={1080} height={980} path="M540 430 C430 570 300 690 170 760" delay={20} duration={70} stroke="#B98CFF" payloadSize={20}/>
    <AnimatedDataPath x={0} y={250} width={1080} height={980} path="M540 430 C650 570 760 720 865 790" delay={28} duration={74} stroke="#9B72E8" payloadSize={20}/>
    <VoiceOrb x={350} y={480} size={380} progress={core} dark/>
    {labels.map((item,i)=>{
      const driftX=Math.cos(orbit+i*Math.PI/2)*12;
      const driftY=Math.sin(orbit+i*Math.PI/2)*12;
      return <div key={item.label} style={{position:'absolute',left:item.x,top:item.y,width:230,height:126,display:'flex',alignItems:'center',gap:18,color:'#fff',opacity:ease(frame,14+i*8,54+i*8),translate:`${driftX}px ${driftY}px`}}><div style={{width:78,height:78,borderRadius:'50%',display:'grid',placeItems:'center',background:'rgba(185,140,255,.14)',border:'2px solid rgba(185,140,255,.36)',boxShadow:'0 0 34px rgba(185,140,255,.12)'}}><TechIcon name={item.icon} size={40} color="#DCC8FF"/></div><div style={{fontSize:28,fontWeight:950}}>{item.label}</div></div>;
    })}
    {[0,1,2,3,4].map(i=>{const a=orbit*2+i*1.256;return <div key={`packet-${i}`} style={{position:'absolute',left:532+Math.cos(a)*270,top:670+Math.sin(a)*220,width:16,height:16,borderRadius:'50%',background:'#fff',boxShadow:'0 0 24px rgba(185,140,255,.9)'}}/>})}
    <ShapeSignal x={390} y={1120} size={112} delay={72} direction="down" label="AKTION"/>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:500,background:'linear-gradient(180deg,transparent,rgba(0,0,0,.55))'}}/>
  </AbsoluteFill>;
};

// REMOTION_BEAT: voice-04-work
const WorkScene:React.FC=()=>{
  const frame=useCurrentFrame();
  const morph=ease(frame,8,160);
  const fan=ease(frame,20,116);
  const sweep=Math.sin(frame/18)*26;
  return <AbsoluteFill style={{background:'linear-gradient(180deg,#FFFDF8,#F8F3FF 68%,#EEE6FB)',overflow:'hidden'}}>
    <MovingConstellation density={24} speed={.85}/>
    <SceneHeader text="IN WORK WIRD ES PRAKTISCH"/>
    <div style={{position:'absolute',left:90+sweep,top:380,width:900,height:2,background:'linear-gradient(90deg,transparent,rgba(110,69,201,.24),transparent)',rotate:'-9deg'}}/>
    <div style={{position:'absolute',left:65-sweep*.6,top:860,width:940,height:2,background:'linear-gradient(90deg,transparent,rgba(110,69,201,.18),transparent)',rotate:'8deg'}}/>
    <DepthStage x={80} y={250} width={920} height={1080} rotateX={6} rotateY={-7} delay={0}>
      <div style={{position:'absolute',inset:0,borderRadius:76,background:'radial-gradient(circle at 50% 40%,rgba(185,140,255,.22),transparent 50%)'}}/>
      <ArtifactGlyph kind="doc" x={12} y={630} scale={.92} opacity={.42+.58*fan} rotate={-9}/>
      <ArtifactGlyph kind="slides" x={305} y={720} scale={.96} opacity={.42+.58*fan} rotate={2}/>
      <ArtifactGlyph kind="sheet" x={670} y={620} scale={.9} opacity={.42+.58*fan} rotate={8}/>
      <ObjectMorph progress={morph}/>
      {[0,1,2,3,4].map(i=><div key={`trail-${i}`} style={{position:'absolute',left:120+i*145,top:560+i%2*55,width:150,height:10,borderRadius:10,background:'linear-gradient(90deg,rgba(110,69,201,.08),rgba(110,69,201,.30),rgba(110,69,201,.08))',translate:`${Math.sin(frame/12+i)*22}px 0px`,opacity:.55}}/>)}
    </DepthStage>
    <div style={{position:'absolute',left:175,top:1320,width:730,textAlign:'center',fontSize:42,fontWeight:950,color:BRAND.ink,opacity:ease(frame,72,145)}}>STIMME → ARTEFAKTE → ARBEIT</div>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:490,background:'linear-gradient(180deg,transparent,rgba(20,14,30,.72))'}}/>
  </AbsoluteFill>;
};

// REMOTION_BEAT: voice-05-continue
const ContinueScene:React.FC=()=>{
  const frame=useCurrentFrame();
  const call=ease(frame,0,34);
  const close=ease(frame,62,126);
  const continueP=ease(frame,42,170);
  const sweep=(frame%90)/90;
  return <AbsoluteFill style={{background:'#120D1C',overflow:'hidden'}}>
    <MovingConstellation dark density={22} speed={1.05}/>
    <SceneHeader text="DER TASK LÄUFT WEITER" dark/>
    <div style={{position:'absolute',left:112,top:500,width:300,height:300,borderRadius:'50%',border:'12px solid #B98CFF',boxShadow:'0 0 0 30px rgba(185,140,255,.08)',opacity:call*(1-close*.88),scale:`${1-close*.45}`,display:'grid',placeItems:'center'}}><TechIcon name="workflow" size={96} color="#fff"/></div>
    <KineticType text="CALL ENDE" x={92} y={300} width={720} fontSize={76} color="#fff" delay={12}/>
    <AnimatedDataPath x={0} y={360} width={1080} height={820} path="M250 310 C390 120 520 230 590 390 C670 570 790 560 940 410" delay={34} duration={112} stroke="#B98CFF" strokeWidth={12} payloadSize={22}/>
    <div style={{position:'absolute',left:220+sweep*690,top:880+Math.sin(sweep*Math.PI*2)*75,width:20,height:20,borderRadius:'50%',background:'#fff',boxShadow:'0 0 28px rgba(185,140,255,.9)',opacity:continueP}}/>
    <div style={{position:'absolute',left:820,top:730,width:168,height:168,borderRadius:32,background:'#fff',display:'grid',placeItems:'center',opacity:continueP,scale:`${.74+.26*continueP}`,boxShadow:'0 28px 80px rgba(185,140,255,.22)'}}><TechIcon name="terminal" size={76} color={BRAND.accentDk}/></div>
    <KineticType text="TASK LÄUFT" x={120} y={1030} width={840} fontSize={94} color="#fff" delay={86}/>
    <KineticType text="ALS TEXT WEITER" x={120} y={1140} width={860} fontSize={80} color="#B98CFF" delay={105}/>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:500,background:'linear-gradient(180deg,transparent,rgba(0,0,0,.58))'}}/>
  </AbsoluteFill>;
};

// REMOTION_BEAT: voice-06-limits
const LimitsScene:React.FC=()=>{
  const frame=useCurrentFrame();
  const rings=ease(frame,4,88);
  const lock=ease(frame,58,126);
  return <AbsoluteFill style={{background:'linear-gradient(180deg,#FFF,#F5F0FC 74%,#EDE4FA)',overflow:'hidden'}}>
    <MovingConstellation density={22} speed={.8}/>
    <SceneHeader text="DEINE GRENZEN BLEIBEN"/>
    <KineticType text="BERECHTIGUNGEN" x={105} y={280} width={870} fontSize={74} color={BRAND.ink} delay={8}/>
    <div style={{position:'absolute',left:540,top:850,width:1,height:1}}>{[260,390,520].map((size,i)=><div key={size} style={{position:'absolute',left:-size/2,top:-size/2,width:size,height:size,borderRadius:'50%',border:`${7-i}px ${i%2?'dashed':'solid'} rgba(110,69,201,${.34-i*.055})`,scale:`${.7+.3*Math.max(0,Math.min(1,rings*1.5-i*.18))}`,opacity:rings,rotate:`${frame*(i%2?-.42:.34)}deg`}}/>)}</div>
    <VoiceOrb x={390} y={700} size={300} progress={rings}/>
    <ShapeSignal x={88} y={610} size={100} delay={26} direction="right" label="ZUGRIFF"/>
    <ShapeSignal x={692} y={620} size={100} delay={38} direction="left" label="LIMIT"/>
    <ShapeSignal x={378} y={1080} size={100} delay={50} direction="up" label="REGELN"/>
    {[{x:210,y:970},{x:806,y:940},{x:500,y:520}].map((p,i)=>{const dx=Math.cos(frame/16+i*2.1)*24;const dy=Math.sin(frame/18+i*2.1)*20;return <div key={i} style={{position:'absolute',left:p.x,top:p.y,width:90,height:90,borderRadius:'50%',display:'grid',placeItems:'center',background:'#fff',border:'3px solid rgba(110,69,201,.20)',boxShadow:'0 18px 44px rgba(45,30,68,.12)',opacity:lock,scale:`${.7+.3*lock}`,translate:`${dx}px ${dy}px`}}><TechIcon name="lock" size={44} color={BRAND.accentDk}/></div>})}
    <KineticType text="LIMITS" x={290} y={1260} width={500} fontSize={94} color={BRAND.accentDk} align="center" delay={82}/>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:480,background:'linear-gradient(180deg,transparent,rgba(20,14,30,.70))'}}/>
  </AbsoluteFill>;
};

// REMOTION_BEAT: voice-07-verdict
const VerdictScene:React.FC=()=>{
  const frame=useCurrentFrame();
  const resolve=ease(frame,6,138);
  const orbit=frame*.032;
  return <AbsoluteFill style={{background:'#100D18',overflow:'hidden'}}>
    <MovingConstellation dark density={26} speed={1.1}/>
    <SceneHeader text="VOICE WIRD ZUR STEUERUNG" dark/>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 52%,rgba(110,69,201,.38),transparent 36%)'}}/>
    {[0,1,2,3,4,5,6,7,8].map(i=>{const h=80+Math.abs(Math.sin(frame/7+i*.8))*190*resolve;return <div key={i} style={{position:'absolute',left:164+i*94,top:760-h/2,width:28,height:h,borderRadius:22,background:i%2===0?'#B98CFF':'#fff',opacity:.35+.65*resolve,scale:`${.7+.3*resolve}`}}/>})}
    {[0,1,2,3].map(i=>{const a=orbit+i*Math.PI/2;return <div key={`v-${i}`} style={{position:'absolute',left:525+Math.cos(a)*330,top:850+Math.sin(a)*170,width:18,height:18,borderRadius:'50%',background:'#B98CFF',boxShadow:'0 0 24px rgba(185,140,255,.72)'}}/>})}
    <KineticType text="VOICE" x={108} y={280} width={864} fontSize={120} color="#fff" delay={4}/>
    <KineticType text="IST NICHT NUR EINGABE" x={108} y={410} width={864} fontSize={66} color="rgba(255,255,255,.72)" delay={18}/>
    <ShapeSignal x={120} y={920} size={106} delay={42} direction="right" label="APP"/>
    <ShapeSignal x={690} y={900} size={106} delay={56} direction="left" label="TASK"/>
    <KineticType text="WORKFLOW-" x={105} y={1110} width={870} fontSize={104} color="#B98CFF" delay={76}/>
    <KineticType text="STEUERUNG" x={105} y={1220} width={870} fontSize={112} color="#fff" delay={94}/>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:520,background:'linear-gradient(180deg,transparent,rgba(0,0,0,.62))'}}/>
  </AbsoluteFill>;
};

export type ReelChatGPTVoicePluginsProps={showCaptions?:boolean};

export const ReelChatGPTVoicePlugins:React.FC<ReelChatGPTVoicePluginsProps>=({showCaptions=true})=>{
  const scenes=[HookScene,DeviceScene,PluginNetworkScene,WorkScene,ContinueScene,LimitsScene,VerdictScene];
  return <AbsoluteFill style={{fontFamily:'Arial, Helvetica, sans-serif',background:'#100D18'}}>
    {VOICE_PLUGIN_SCENES.map((scene,index)=>{
      const Scene=scenes[index];
      return <Sequence key={scene.id} from={scene.from} durationInFrames={scene.duration}><Scene/></Sequence>;
    })}
    {showCaptions?<CaptionLayer/>:null}
  </AbsoluteFill>;
};