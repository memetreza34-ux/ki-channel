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

const VoiceOrb:React.FC<{x:number;y:number;size:number;progress:number;dark?:boolean}>=({x,y,size,progress,dark=false})=>{
  const frame=useCurrentFrame();
  const pulse=1+Math.sin(frame/6)*.035*progress;
  return <div style={{position:'absolute',left:x,top:y,width:size,height:size,borderRadius:'50%',background:dark?'radial-gradient(circle at 35% 28%,#E9D8FF 0%,#9C6CEB 35%,#5D31B9 70%,#1A1328 100%)':'radial-gradient(circle at 35% 28%,#fff 0%,#E7D9FF 38%,#B98CFF 72%,#6E45C9 100%)',boxShadow:dark?'0 0 0 22px rgba(185,140,255,.09),0 40px 120px rgba(0,0,0,.45)':'0 0 0 22px rgba(110,69,201,.07),0 35px 100px rgba(110,69,201,.22)',scale:`${(.72+.28*progress)*pulse}`,opacity:progress,display:'grid',placeItems:'center'}}>
    <div style={{display:'flex',alignItems:'center',gap:8,height:size*.34}}>{[.36,.72,1,.58,.9,.42].map((h,i)=><div key={i} style={{width:10,height:size*.24*h,borderRadius:10,background:dark?'#fff':'#fff',opacity:.82+Math.sin(frame/5+i)*.12}}/>)}</div>
  </div>;
};

const ObjectMorph:React.FC<{progress:number}>=({progress})=>{
  const stage=progress<.34?0:progress<.67?1:2;
  const labels=['DOC','SLIDES','SHEET'] as const;
  const aspect=[.72,1.45,1.08][stage];
  const width=430;
  const height=width/aspect;
  return <div data-remotion-capability="object-transformation" style={{position:'absolute',left:215,top:145,width,height,translate:`0px ${Math.sin(progress*Math.PI*4)*-10}px`,rotate:`${interpolate(progress,[0,1],[-8,7],clamp)}deg`,scale:`${.88+.12*progress}`,transition:'none'}}>
    <div style={{position:'absolute',inset:0,borderRadius:stage===0?28:stage===1?36:18,background:stage===0?'linear-gradient(155deg,#FFFFFF,#E8DCFF)':stage===1?'linear-gradient(135deg,#1E1730,#6E45C9)':'linear-gradient(155deg,#FFFFFF,#EDE8F7)',border:'4px solid rgba(110,69,201,.24)',boxShadow:'0 38px 90px rgba(45,30,68,.22)',overflow:'hidden'}}>
      {stage===0?<><div style={{position:'absolute',left:44,top:52,width:210,height:18,borderRadius:18,background:BRAND.accentDk}}/>{[0,1,2,3].map(i=><div key={i} style={{position:'absolute',left:44,top:105+i*48,width:300-i*22,height:10,borderRadius:10,background:'rgba(26,26,46,.16)'}}/>)}</>:null}
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
  const field=ease(frame,46,150);
  return <AbsoluteFill style={{background:'#100D1A',overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 62% 56%,rgba(110,69,201,.42),transparent 34%),radial-gradient(circle at 20% 22%,rgba(185,140,255,.18),transparent 32%)'}}/>
    <BrandAnchor brand="chatgpt" x={56} y={70} compact accent/>
    <KineticType text="VOICE" x={92} y={260} width={900} fontSize={132} color="#fff" delay={2}/>
    <KineticType text="→ WORKFLOW" x={92} y={405} width={920} fontSize={116} color="#B98CFF" delay={16}/>
    <VoiceOrb x={310} y={760} size={460} progress={intro} dark/>
    <div style={{position:'absolute',left:540,top:990,width:2,height:2,scale:`${field}`}}>
      {[0,1,2].map(i=><div key={i} style={{position:'absolute',left:-7,top:-7,width:14,height:14,borderRadius:'50%',background:'#fff',boxShadow:`0 0 ${26+i*12}px rgba(185,140,255,.85)`,translate:`${[-330,0,330][i]*burst}px ${[-190,280,-150][i]*burst}px`,opacity:burst}}/>)}
    </div>
    <ShapeSignal x={76} y={970} size={118} delay={28} direction="right" label="APP"/>
    <ShapeSignal x={708} y={850} size={118} delay={38} direction="right" label="TOOL"/>
    <ShapeSignal x={680} y={1150} size={118} delay={48} direction="right" label="TASK"/>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:520,background:'linear-gradient(180deg,transparent,rgba(0,0,0,.48))'}}/>
  </AbsoluteFill>;
};

// REMOTION_BEAT: voice-02-devices
const DeviceScene:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const enter=pop(frame,fps,6);
  const rotation=Math.sin(frame/34)*.18;
  const lift=ease(frame,20,95);
  return <AbsoluteFill style={{background:'linear-gradient(180deg,#FFFEFF,#F3EEFB 72%,#ECE4FA)',overflow:'hidden'}}>
    <SceneHeader text="WEB · iOS · ANDROID"/>
    <div style={{position:'absolute',left:0,top:250,width:1080,height:1020,opacity:enter}}>
      <ThreeCanvas width={1080} height={1020} camera={{position:[0,0,8],fov:42}}>
        <ambientLight intensity={1.15}/>
        <directionalLight position={[4,6,8]} intensity={2.1}/>
        <group rotation={[.08,rotation,0]} position={[0,-.15,0]}>
          {[-2.7,0,2.7].map((x,i)=>{
            const p=Math.max(0,Math.min(1,lift*1.7-i*.18));
            return <mesh key={x} position={[x,-1.2+(1-p)*-1.2,i===1?.45:0]} rotation={[0,(i-1)*-.22,0]} scale={[.8+.2*p,.8+.2*p,.8+.2*p]}>
              <boxGeometry args={[1.8,i===0?2.8:3.3,.28]}/>
              <meshStandardMaterial color={i===1?'#6E45C9':i===2?'#B98CFF':'#E8DBFF'} roughness={.28} metalness={.12}/>
            </mesh>;
          })}
          <mesh position={[0,2.25,-.4]} rotation={[0,0,rotation*.4]} scale={[.92+.08*lift,.92+.08*lift,.92+.08*lift]}>
            <sphereGeometry args={[.72,48,48]}/>
            <meshStandardMaterial color="#B98CFF" emissive="#6E45C9" emissiveIntensity={.4}/>
          </mesh>
        </group>
      </ThreeCanvas>
    </div>
    {['WEB','iOS','ANDROID'].map((label,i)=><div key={label} style={{position:'absolute',left:[128,425,740][i],top:1190,width:210,textAlign:'center',fontSize:34,fontWeight:950,color:i===1?BRAND.accentDk:BRAND.ink,opacity:Math.max(0,Math.min(1,lift*1.6-i*.18)),translate:`0px ${(1-lift)*28}px`}}>{label}</div>)}
    <div style={{position:'absolute',left:190,top:1330,width:700,textAlign:'center',fontSize:44,fontWeight:950,color:BRAND.ink,opacity:ease(frame,105,170)}}>EIN VOICE-SIGNAL · DREI OBERFLÄCHEN</div>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:500,background:'linear-gradient(180deg,transparent,rgba(22,15,34,.7))'}}/>
  </AbsoluteFill>;
};

// REMOTION_BEAT: voice-03-plugins
const PluginNetworkScene:React.FC=()=>{
  const frame=useCurrentFrame();
  const core=ease(frame,0,34);
  const labels=[{x:86,y:520,label:'MAIL',icon:'workflow' as const},{x:758,y:470,label:'KALENDER',icon:'calendar' as const},{x:92,y:1030,label:'DATEIEN',icon:'git-branch' as const},{x:744,y:1060,label:'ACTION',icon:'zap' as const}];
  return <AbsoluteFill style={{background:'#15101F',overflow:'hidden'}}>
    <SceneHeader text="VOICE TRIFFT DEINE TOOLS" dark/>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 50%,rgba(110,69,201,.34),transparent 32%)'}}/>
    <AnimatedDataPath x={0} y={270} width={1080} height={950} path="M540 430 C430 330 280 260 170 250" delay={16} duration={72} stroke="#B98CFF" payloadSize={18}/>
    <AnimatedDataPath x={0} y={270} width={1080} height={950} path="M540 430 C650 315 780 250 880 220" delay={28} duration={74} stroke="#9B72E8" payloadSize={18}/>
    <AnimatedDataPath x={0} y={270} width={1080} height={950} path="M540 430 C430 570 300 690 170 760" delay={40} duration={82} stroke="#B98CFF" payloadSize={18}/>
    <AnimatedDataPath x={0} y={270} width={1080} height={950} path="M540 430 C650 570 760 720 865 790" delay={52} duration={84} stroke="#9B72E8" payloadSize={18}/>
    <VoiceOrb x={360} y={500} size={360} progress={core} dark/>
    {labels.map((item,i)=><div key={item.label} style={{position:'absolute',left:item.x,top:item.y,width:230,height:126,display:'flex',alignItems:'center',gap:18,color:'#fff',opacity:ease(frame,48+i*12,96+i*12)}}><div style={{width:74,height:74,borderRadius:'50%',display:'grid',placeItems:'center',background:'rgba(185,140,255,.14)',border:'2px solid rgba(185,140,255,.32)'}}><TechIcon name={item.icon} size={38} color="#DCC8FF"/></div><div style={{fontSize:28,fontWeight:950}}>{item.label}</div></div>)}
    <ShapeSignal x={390} y={1110} size={112} delay={115} direction="down" label="AKTION"/>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:500,background:'linear-gradient(180deg,transparent,rgba(0,0,0,.55))'}}/>
  </AbsoluteFill>;
};

// REMOTION_BEAT: voice-04-work
const WorkScene:React.FC=()=>{
  const frame=useCurrentFrame();
  const morph=ease(frame,24,170);
  const fan=ease(frame,72,182);
  return <AbsoluteFill style={{background:'linear-gradient(180deg,#FFFDF8,#F8F3FF 68%,#EEE6FB)',overflow:'hidden'}}>
    <SceneHeader text="IN WORK WIRD ES PRAKTISCH"/>
    <DepthStage x={110} y={300} width={860} height={1000} rotateX={6} rotateY={-7} delay={6}>
      <div style={{position:'absolute',inset:0,borderRadius:76,background:'radial-gradient(circle at 50% 40%,rgba(185,140,255,.20),transparent 48%)'}}/>
      <ObjectMorph progress={morph}/>
      <div style={{position:'absolute',left:40,top:690,width:250,height:330,borderRadius:28,background:'#fff',border:'3px solid rgba(110,69,201,.16)',boxShadow:'0 24px 60px rgba(45,30,68,.12)',opacity:fan,translate:`${(1-fan)*-120}px 0px`,rotate:'-7deg'}}><div style={{margin:30,width:150,height:18,borderRadius:18,background:BRAND.accentDk}}/>{[0,1,2,3].map(i=><div key={i} style={{margin:'28px 30px',width:170-i*15,height:8,borderRadius:8,background:'rgba(26,26,46,.15)'}}/>)}</div>
      <div style={{position:'absolute',left:305,top:760,width:300,height:200,borderRadius:34,background:'linear-gradient(135deg,#21172F,#6E45C9)',boxShadow:'0 30px 75px rgba(45,30,68,.20)',opacity:fan,translate:`0px ${(1-fan)*90}px`}}><div style={{position:'absolute',left:26,top:26,width:120,height:70,borderRadius:18,background:'#B98CFF'}}/><div style={{position:'absolute',right:30,bottom:30,color:'#fff',fontSize:28,fontWeight:950}}>SLIDES</div></div>
      <div style={{position:'absolute',right:20,top:680,width:230,height:300,borderRadius:22,background:'#fff',border:'3px solid rgba(110,69,201,.16)',boxShadow:'0 24px 60px rgba(45,30,68,.12)',opacity:fan,translate:`${(1-fan)*120}px 0px`,backgroundImage:'linear-gradient(rgba(110,69,201,.15) 2px,transparent 2px),linear-gradient(90deg,rgba(110,69,201,.15) 2px,transparent 2px)',backgroundSize:'46px 42px'}}/>
    </DepthStage>
    <div style={{position:'absolute',left:175,top:1330,width:730,textAlign:'center',fontSize:42,fontWeight:950,color:BRAND.ink,opacity:ease(frame,116,180)}}>STIMME → ARTEFAKTE → ARBEIT</div>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:490,background:'linear-gradient(180deg,transparent,rgba(20,14,30,.72))'}}/>
  </AbsoluteFill>;
};

// REMOTION_BEAT: voice-05-continue
const ContinueScene:React.FC=()=>{
  const frame=useCurrentFrame();
  const call=ease(frame,0,46);
  const close=ease(frame,70,130);
  const continueP=ease(frame,52,182);
  return <AbsoluteFill style={{background:'#120D1C',overflow:'hidden'}}>
    <SceneHeader text="DER TASK LÄUFT WEITER" dark/>
    <div style={{position:'absolute',left:112,top:500,width:300,height:300,borderRadius:'50%',border:'12px solid #B98CFF',boxShadow:'0 0 0 30px rgba(185,140,255,.08)',opacity:call*(1-close*.88),scale:`${1-close*.45}`,display:'grid',placeItems:'center'}}><TechIcon name="workflow" size={96} color="#fff"/></div>
    <KineticType text="CALL ENDE" x={92} y={300} width={720} fontSize={76} color="#fff" delay={20}/>
    <AnimatedDataPath x={0} y={360} width={1080} height={820} path="M250 310 C390 120 520 230 590 390 C670 570 790 560 940 410" delay={56} duration={128} stroke="#B98CFF" strokeWidth={12} payloadSize={22}/>
    <div style={{position:'absolute',left:820,top:730,width:168,height:168,borderRadius:32,background:'#fff',display:'grid',placeItems:'center',opacity:continueP,scale:`${.74+.26*continueP}`,boxShadow:'0 28px 80px rgba(185,140,255,.22)'}}><TechIcon name="terminal" size={76} color={BRAND.accentDk}/></div>
    <KineticType text="TASK LÄUFT" x={120} y={1030} width={840} fontSize={94} color="#fff" delay={104}/>
    <KineticType text="ALS TEXT WEITER" x={120} y={1140} width={860} fontSize={80} color="#B98CFF" delay={126}/>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:500,background:'linear-gradient(180deg,transparent,rgba(0,0,0,.58))'}}/>
  </AbsoluteFill>;
};

// REMOTION_BEAT: voice-06-limits
const LimitsScene:React.FC=()=>{
  const frame=useCurrentFrame();
  const rings=ease(frame,10,118);
  const lock=ease(frame,88,160);
  return <AbsoluteFill style={{background:'linear-gradient(180deg,#FFF,#F5F0FC 74%,#EDE4FA)',overflow:'hidden'}}>
    <SceneHeader text="DEINE GRENZEN BLEIBEN"/>
    <KineticType text="BERECHTIGUNGEN" x={105} y={280} width={870} fontSize={74} color={BRAND.ink} delay={8}/>
    <div style={{position:'absolute',left:540,top:850,width:1,height:1}}>{[260,390,520].map((size,i)=><div key={size} style={{position:'absolute',left:-size/2,top:-size/2,width:size,height:size,borderRadius:'50%',border:`${7-i}px solid rgba(110,69,201,${.32-i*.06})`,scale:`${.7+.3*Math.max(0,Math.min(1,rings*1.5-i*.22))}`,opacity:rings}}/>)}</div>
    <VoiceOrb x={390} y={700} size={300} progress={rings}/>
    <ShapeSignal x={88} y={610} size={100} delay={38} direction="right" label="ZUGRIFF"/>
    <ShapeSignal x={692} y={620} size={100} delay={54} direction="left" label="LIMIT"/>
    <ShapeSignal x={378} y={1080} size={100} delay={68} direction="up" label="REGELN"/>
    {[{x:210,y:970},{x:806,y:940},{x:500,y:520}].map((p,i)=><div key={i} style={{position:'absolute',left:p.x,top:p.y,width:90,height:90,borderRadius:'50%',display:'grid',placeItems:'center',background:'#fff',border:'3px solid rgba(110,69,201,.20)',boxShadow:'0 18px 44px rgba(45,30,68,.12)',opacity:lock,scale:`${.7+.3*lock}`}}><TechIcon name="lock" size={44} color={BRAND.accentDk}/></div>)}
    <KineticType text="LIMITS" x={290} y={1260} width={500} fontSize={94} color={BRAND.accentDk} align="center" delay={112}/>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:480,background:'linear-gradient(180deg,transparent,rgba(20,14,30,.70))'}}/>
  </AbsoluteFill>;
};

// REMOTION_BEAT: voice-07-verdict
const VerdictScene:React.FC=()=>{
  const frame=useCurrentFrame();
  const resolve=ease(frame,10,150);
  return <AbsoluteFill style={{background:'#100D18',overflow:'hidden'}}>
    <SceneHeader text="VOICE WIRD ZUR STEUERUNG" dark/>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 52%,rgba(110,69,201,.38),transparent 36%)'}}/>
    {[0,1,2,3,4,5,6,7,8].map(i=>{const h=80+Math.abs(Math.sin(frame/7+i*.8))*190*resolve;return <div key={i} style={{position:'absolute',left:164+i*94,top:760-h/2,width:28,height:h,borderRadius:22,background:i%2===0?'#B98CFF':'#fff',opacity:.35+.65*resolve,scale:`${.7+.3*resolve}`}}/>})}
    <KineticType text="VOICE" x={108} y={280} width={864} fontSize={120} color="#fff" delay={4}/>
    <KineticType text="IST NICHT NUR EINGABE" x={108} y={410} width={864} fontSize={66} color="rgba(255,255,255,.72)" delay={18}/>
    <ShapeSignal x={120} y={920} size={106} delay={48} direction="right" label="APP"/>
    <ShapeSignal x={690} y={900} size={106} delay={64} direction="left" label="TASK"/>
    <KineticType text="WORKFLOW-" x={105} y={1110} width={870} fontSize={104} color="#B98CFF" delay={82}/>
    <KineticType text="STEUERUNG" x={105} y={1220} width={870} fontSize={112} color="#fff" delay={100}/>
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
