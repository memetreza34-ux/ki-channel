import React from 'react';
import {AbsoluteFill,Easing,Sequence,interpolate,spring,useCurrentFrame,useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {CameraStage} from '../../animation-library/creativeMotionPrimitives';
import {BrandAnchor,GlassPanel,HeroOrb,InfoChip,KineticConnector,SceneBackdrop,TechIcon,type TechIconName} from '../../visual-system/TechVisualKit';
import {REEL_CAPTION_SAFE} from '../captionSafe';
import {GPT55_SCENES,GPT55_SUBTITLES,type Gpt55Cue,type Gpt55Scene} from './contract';

const RISK='#B5415C';
const GOOD='#2B8A68';
const clamp=(value:number)=>Math.max(0,Math.min(1,value));
const ease=(frame:number,from:number,to:number)=>interpolate(frame,[from,Math.max(from+1,to)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(0.16,1,0.3,1)});

const sceneIcon=(icon:string):TechIconName=>({calendar:'calendar',lock:'lock',code:'code',terminal:'terminal',search:'search',workflow:'workflow'}[icon] as TechIconName|undefined)??'sparkles';

const Header:React.FC<{scene:Gpt55Scene}>=({scene})=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();
  const enter=spring({frame,fps,config:{damping:18,stiffness:150,mass:0.75}});
  return <div style={{position:'absolute',left:64,right:64,top:70,zIndex:80,display:'flex',alignItems:'center',justifyContent:'center',gap:16,opacity:enter,transform:`translateY(${(1-enter)*-18}px)`}}>
    <div style={{width:60,height:60,borderRadius:19,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(185,140,255,.15)',border:'2px solid rgba(110,69,201,.18)',color:BRAND.accentDk}}><TechIcon name={sceneIcon(scene.icon)} size={33}/></div>
    <div style={{fontSize:scene.headline.length>30?38:44,lineHeight:1.02,fontWeight:950,letterSpacing:-1.35,color:BRAND.accentDk,textAlign:'center'}}>{scene.headline}</div>
  </div>;
};

const CaptionLayer:React.FC<{showCaptions:boolean}>=({showCaptions})=>{
  const frame=useCurrentFrame();if(!showCaptions)return null;
  const cue=GPT55_SUBTITLES.find((candidate)=>frame>=candidate.startFrame&&frame<candidate.endFrame) as Gpt55Cue|undefined;if(!cue)return null;
  const words=cue.text.trim().split(/\s+/).filter(Boolean);const local=clamp((frame-cue.startFrame)/Math.max(1,cue.endFrame-cue.startFrame));const active=Math.min(words.length-1,Math.floor(local*Math.max(1,words.length)));
  return <div style={{position:'absolute',left:REEL_CAPTION_SAFE.horizontalInset,right:REEL_CAPTION_SAFE.horizontalInset,bottom:REEL_CAPTION_SAFE.bottom,zIndex:200,display:'flex',justifyContent:'center',pointerEvents:'none'}}>
    <div style={{maxWidth:REEL_CAPTION_SAFE.maxWidth,textAlign:'center',fontSize:48,lineHeight:1.08,fontWeight:950,letterSpacing:-1.3,color:BRAND.ink}}>{words.map((word,index)=><React.Fragment key={`${word}-${index}`}><span style={{color:index===active?BRAND.accentDk:BRAND.ink}}>{word}</span>{index<words.length-1?' ':''}</React.Fragment>)}</div>
  </div>;
};

const ModelToken:React.FC<{label:string;x:number;y:number;width?:number;accent?:boolean;risk?:boolean;delay?:number;icon?:TechIconName;scale?:number}>=({label,x,y,width=300,accent=false,risk=false,delay=0,icon='sparkles',scale=1})=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();const enter=spring({frame:Math.max(0,frame-delay),fps,config:{damping:17,stiffness:155,mass:0.75}});
  const bg=risk?'#FFF1F4':accent?'linear-gradient(135deg,#F2E8FF,#DEC8FF)':'rgba(255,255,255,.96)';const color=risk?RISK:accent?BRAND.accentDk:BRAND.ink;
  return <div style={{position:'absolute',left:x,top:y,width,height:104,borderRadius:31,background:bg,border:`3px solid ${risk?'rgba(181,65,92,.28)':accent?'rgba(110,69,201,.28)':'rgba(110,69,201,.14)'}`,boxShadow:'0 22px 58px rgba(45,30,68,.12)',display:'flex',alignItems:'center',justifyContent:'center',gap:14,color,opacity:enter,transform:`translateY(${(1-enter)*28}px) scale(${(0.9+enter*0.1)*scale})`,zIndex:30}}><TechIcon name={icon} size={34} color="currentColor"/><span style={{fontSize:31,fontWeight:950,letterSpacing:-.7}}>{label}</span></div>;
};

const Gate:React.FC<{progress:number;y?:number}>=({progress,y=730})=>{
  const slam=ease(progress*180,70,128);const left=-18+slam*250;const right=1080-250*slam;
  return <>
    <div style={{position:'absolute',left:48,top:y-94,width:984,height:22,borderRadius:22,background:'rgba(181,65,92,.10)'}}/>
    <div style={{position:'absolute',left:110,top:y-150,width:860,height:98,borderRadius:30,background:'#fff',border:'3px solid rgba(181,65,92,.2)',boxShadow:'0 20px 55px rgba(181,65,92,.10)',display:'flex',alignItems:'center',justifyContent:'center',gap:17,color:RISK,opacity:clamp(progress*2)}}><TechIcon name="calendar" size={39} color={RISK}/><span style={{fontSize:36,fontWeight:950}}>14. OKTOBER 2026</span></div>
    <div style={{position:'absolute',left,top:y,width:260,height:360,borderRadius:'0 34px 34px 0',background:'linear-gradient(90deg,#FFE8EC,#F7C8D2)',border:'3px solid rgba(181,65,92,.25)',boxShadow:'0 20px 70px rgba(181,65,92,.14)',transform:`rotateY(${(1-slam)*-28}deg)`}}/>
    <div style={{position:'absolute',left:right,top:y,width:260,height:360,borderRadius:'34px 0 0 34px',background:'linear-gradient(270deg,#FFE8EC,#F7C8D2)',border:'3px solid rgba(181,65,92,.25)',boxShadow:'0 20px 70px rgba(181,65,92,.14)',transform:`rotateY(${(1-slam)*28}deg)`}}/>
    <div style={{position:'absolute',left:505,top:y+126,width:70,height:108,borderRadius:20,background:RISK,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',opacity:slam,transform:`scale(${.75+.25*slam})`}}><TechIcon name="lock" size={42} color="#fff"/></div>
  </>;
};

const DeadlineScene:React.FC=()=>{const frame=useCurrentFrame();const p=frame/180;const travel=ease(frame,12,106);const impact=ease(frame,92,138);return <CameraStage mode="push" startFrame={0} endFrame={170} intensity={.8}>
  <SceneBackdrop intensity={1.05}/><BrandAnchor brand="chatgpt" x={58} y={176} accent delay={3}/><InfoChip label="MODELL-RETIREMENT" icon="calendar" x={664} y={180} width={350} delay={9}/>
  <div style={{position:'absolute',left:150,top:470,width:780,height:20,borderRadius:20,background:'linear-gradient(90deg,rgba(110,69,201,.06),rgba(110,69,201,.18),rgba(181,65,92,.16))',transform:'perspective(700px) rotateX(58deg) scaleY(4)'}}/>
  {[0,1,2,3,4].map(i=><div key={i} style={{position:'absolute',left:190+i*145,top:512+i*31,width:4,height:230,background:'rgba(110,69,201,.11)',transform:'rotate(18deg)'}}/>)}
  <div style={{position:'absolute',left:105+travel*395,top:540+travel*105,transform:`rotate(${travel*4}deg) scale(${1-impact*.08})`}}><ModelToken label="GPT-5.5" x={0} y={0} width={310} risk delay={4} icon="lock"/></div>
  <Gate progress={p} y={720}/>
  <InfoChip label="VORHER PRÜFEN" icon="search" x={365} y={1220} width={350} accent delay={124}/>
</CameraStage>};

const ProductNode:React.FC<{label:string;x:number;y:number;delay:number;lockAt:number;icon:TechIconName}>=({label,x,y,delay,lockAt,icon})=>{const frame=useCurrentFrame();const enter=ease(frame,delay,delay+34);const locked=ease(frame,lockAt,lockAt+30);return <div style={{position:'absolute',left:x,top:y,width:260,height:122,borderRadius:34,background:`linear-gradient(135deg,#fff,${locked>.5?'#FFF1F4':'#F5EFFF'})`,border:`3px solid ${locked>.5?'rgba(181,65,92,.25)':'rgba(110,69,201,.16)'}`,boxShadow:'0 20px 54px rgba(45,30,68,.10)',display:'flex',alignItems:'center',justifyContent:'center',gap:13,opacity:enter,transform:`scale(${.86+.14*enter})`,color:locked>.5?RISK:BRAND.ink}}><TechIcon name={locked>.5?'lock':icon} size={35} color="currentColor"/><span style={{fontSize:28,fontWeight:950}}>{label}</span></div>};

const ProductShutdownScene:React.FC=()=>{const frame=useCurrentFrame();const core=ease(frame,8,42);return <CameraStage mode="pull" startFrame={0} endFrame={170} intensity={.55}>
  <SceneBackdrop intensity={.88}/><BrandAnchor brand="chatgpt" x={58} y={180} compact delay={3}/><InfoChip label="ALLE PLÄNE" icon="gauge" x={760} y={182} width={255} accent delay={100}/>
  <div style={{position:'absolute',left:390,top:430,width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle at 35% 30%,#fff,#F0E6FF 48%,#D4BAFF)',border:'4px solid rgba(110,69,201,.23)',boxShadow:'0 34px 95px rgba(110,69,201,.2)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',opacity:core,transform:`scale(${.78+.22*core})`}}><TechIcon name="lock" size={48} color={RISK}/><div style={{fontSize:43,fontWeight:950,color:BRAND.accentDk,marginTop:12}}>GPT-5.5</div></div>
  <KineticConnector from={{x:540,y:730}} to={{x:230,y:950}} startFrame={34} endFrame={86} width={6}/><KineticConnector from={{x:540,y:730}} to={{x:540,y:1020}} startFrame={46} endFrame={98} width={6}/><KineticConnector from={{x:540,y:730}} to={{x:850,y:950}} startFrame={58} endFrame={110} width={6}/>
  <ProductNode label="ChatGPT" x={100} y={930} delay={42} lockAt={102} icon="bot"/><ProductNode label="WORK" x={410} y={1000} delay={54} lockAt={116} icon="workflow"/><ProductNode label="CODEX" x={720} y={930} delay={66} lockAt={130} icon="terminal"/>
  {[0,1,2].map((i)=><div key={i} style={{position:'absolute',left:188+i*312,top:1126,width:90,height:8,borderRadius:8,background:RISK,opacity:ease(frame,112+i*12,142+i*10)}}/>)}
</CameraStage>};

const RouteLane:React.FC<{y:number;label:string;open:boolean;delay:number;icon:TechIconName}>=({y,label,open,delay,icon})=>{const frame=useCurrentFrame();const draw=ease(frame,delay,delay+86);const confirm=ease(frame,delay+74,delay+124);return <>
  <div style={{position:'absolute',left:110,top:y,width:860,height:118,borderRadius:40,background:open?'rgba(43,138,104,.08)':'rgba(181,65,92,.07)',border:`2px solid ${open?'rgba(43,138,104,.18)':'rgba(181,65,92,.16)'}`}}/>
  <div style={{position:'absolute',left:150,top:y+52,width:690*draw,height:12,borderRadius:12,background:open?`linear-gradient(90deg,#BDE8D8,${GOOD})`:`linear-gradient(90deg,#F4CED7,${RISK})`}}/>
  <div style={{position:'absolute',left:120,top:y+22,width:220,height:74,borderRadius:24,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',gap:11,boxShadow:'0 14px 34px rgba(45,30,68,.08)',fontSize:25,fontWeight:950,color:open?GOOD:BRAND.ink}}><TechIcon name={icon} size={30} color="currentColor"/>{label}</div>
  {open?<div style={{position:'absolute',left:820,top:y+20,width:130,height:78,borderRadius:25,background:GOOD,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:confirm,fontSize:20,fontWeight:950}}><TechIcon name="unlock" size={29} color="#fff"/>OFFEN</div>:<div style={{position:'absolute',left:770,top:y+8,width:32,height:102,borderRadius:16,background:RISK,opacity:confirm,boxShadow:'0 0 0 12px rgba(181,65,92,.09)'}}/>}
</>};

const ApiExceptionScene:React.FC=()=>{const frame=useCurrentFrame();return <CameraStage mode="pan-right" startFrame={0} endFrame={170} intensity={.65}>
  <SceneBackdrop intensity={.82}/><BrandAnchor brand="chatgpt" x={58} y={180} compact delay={3}/><InfoChip label="WICHTIGE AUSNAHME" icon="sparkles" x={635} y={180} width={380} delay={8}/>
  <RouteLane y={480} label="CHAT / WORK / CODEX" open={false} delay={18} icon="workflow"/><RouteLane y={820} label="OPENAI API" open delay={44} icon="code"/>
  <div style={{position:'absolute',left:420,top:660,width:240,height:92,borderRadius:28,background:'#fff',border:'2px solid rgba(110,69,201,.14)',display:'flex',alignItems:'center',justifyContent:'center',gap:12,color:BRAND.accentDk,boxShadow:'0 18px 44px rgba(45,30,68,.08)',opacity:ease(frame,52,90)}}><TechIcon name="arrow-swap" size={34}/><span style={{fontSize:24,fontWeight:950}}>ABER</span></div>
  <InfoChip label="API NICHT BETROFFEN" icon="unlock" x={315} y={1120} width={450} accent delay={112}/>
  <div style={{position:'absolute',left:180,top:1240,width:720,height:12,borderRadius:12,background:'rgba(43,138,104,.1)',overflow:'hidden'}}><div style={{height:'100%',width:`${ease(frame,90,166)*100}%`,background:GOOD}}/></div>
</CameraStage>};

const TerminalRow:React.FC<{label:string;value:string;y:number;active?:boolean;delay:number}>=({label,value,y,active=false,delay})=>{const frame=useCurrentFrame();const enter=ease(frame,delay,delay+36);return <div style={{position:'absolute',left:92,top:y,width:716,height:80,borderRadius:22,background:active?'rgba(110,69,201,.10)':'rgba(26,26,46,.035)',display:'flex',alignItems:'center',padding:'0 24px',opacity:enter,transform:`translateX(${(1-enter)*35}px)`,fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace'}}><span style={{fontSize:20,fontWeight:800,color:'rgba(26,26,46,.48)',width:180}}>{label}</span><span style={{fontSize:24,fontWeight:900,color:active?BRAND.accentDk:BRAND.ink}}>{value}</span></div>};

const CodexMigrationScene:React.FC=()=>{const frame=useCurrentFrame();const eject=ease(frame,58,106);const dock=ease(frame,94,148);return <CameraStage mode="push" startFrame={0} endFrame={170} intensity={.72}>
  <SceneBackdrop intensity={.92}/><BrandAnchor brand="chatgpt" x={58} y={180} compact delay={3}/><InfoChip label="CODEX MIGRATION" icon="terminal" x={690} y={180} width={325} accent delay={8}/>
  <GlassPanel x={86} y={390} width={908} height={590} radius={44} delay={12} rotate={-.8}><div style={{position:'absolute',left:0,right:0,top:0,height:86,borderBottom:'2px solid rgba(110,69,201,.10)',display:'flex',alignItems:'center',padding:'0 32px',gap:13,color:BRAND.ink}}><TechIcon name="terminal" size={35} color={BRAND.accentDk}/><span style={{fontSize:28,fontWeight:950}}>Codex · model config</span></div><TerminalRow label="model" value="gpt-5.5" y={120} active delay={22}/><TerminalRow label="auth" value="ChatGPT sign-in" y={220} delay={34}/><TerminalRow label="status" value={dock>.72?'ready':'migration required'} y={320} active={dock>.72} delay={46}/><div style={{position:'absolute',left:86,top:448,width:736,height:84,borderRadius:24,background:'#151421',display:'flex',alignItems:'center',padding:'0 28px',fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace',fontSize:22,fontWeight:800,color:'#EDE8F7'}}><span style={{color:'#B98CFF',marginRight:12}}>$</span>{dock>.5?'model = gpt-5.6-sol':'model = gpt-5.5'}</div></GlassPanel>
  <div style={{position:'absolute',left:132-eject*330,top:1060,opacity:1-eject*.75,transform:`rotate(${-8*eject}deg)`}}><ModelToken label="GPT-5.5" x={0} y={0} width={300} risk delay={34} icon="lock"/></div>
  <KineticConnector from={{x:530,y:1130}} to={{x:760,y:1130}} startFrame={84} endFrame={132} width={8}/><div style={{position:'absolute',left:610+dock*120,top:1060,opacity:dock,transform:`scale(${.82+.18*dock})`}}><ModelToken label="GPT-5.6 SOL" x={0} y={0} width={350} accent delay={0} icon="zap"/></div>
  <InfoChip label="WECHSELN" icon="arrow-swap" x={365} y={1245} width={350} delay={126}/>
</CameraStage>};

const auditItems=[{label:'Workspace Defaults',icon:'gauge' as TechIconName},{label:'Saved Model',icon:'sliders' as TechIconName},{label:'Custom Agents',icon:'bot' as TechIconName},{label:'Scheduled Tasks',icon:'calendar' as TechIconName},{label:'Scripts',icon:'code' as TechIconName}];
const AuditScene:React.FC=()=>{const frame=useCurrentFrame();const scan=ease(frame,28,152);const scannerY=430+scan*690;return <CameraStage mode="parallax" startFrame={0} endFrame={176} intensity={.55}>
  <SceneBackdrop intensity={.76}/><BrandAnchor brand="chatgpt" x={58} y={180} compact delay={3}/><InfoChip label="GPT-5.5 SUCHEN" icon="search" x={700} y={180} width={315} accent delay={8}/>
  <div style={{position:'absolute',left:150,top:390,width:780,height:790,borderRadius:46,background:'rgba(255,255,255,.74)',border:'2px solid rgba(110,69,201,.13)',boxShadow:'0 28px 80px rgba(45,30,68,.09)'}}/>
  {auditItems.map((item,index)=>{const y=440+index*135;const found=scan>(index+.45)/auditItems.length;const enter=ease(frame,10+index*10,42+index*10);return <div key={item.label} style={{position:'absolute',left:205,top:y,width:670,height:96,borderRadius:29,background:found?'linear-gradient(90deg,#FFF7F8,#F5EFFF)':'#fff',border:`2px solid ${found?'rgba(181,65,92,.18)':'rgba(110,69,201,.11)'}`,display:'flex',alignItems:'center',padding:'0 26px',gap:17,opacity:enter,transform:`translateX(${(1-enter)*28}px)`,boxShadow:'0 14px 36px rgba(45,30,68,.07)'}}><div style={{width:54,height:54,borderRadius:18,background:'#F1E9FF',display:'flex',alignItems:'center',justifyContent:'center',color:BRAND.accentDk}}><TechIcon name={item.icon} size={30}/></div><div style={{fontSize:25,fontWeight:950,color:BRAND.ink,flex:1}}>{item.label}</div><div style={{padding:'10px 14px',borderRadius:15,background:found?'#FFF0F3':'#F4F1F7',color:found?RISK:'rgba(26,26,46,.48)',fontSize:18,fontWeight:900}}>GPT-5.5</div>{found?<div style={{width:48,height:48,borderRadius:16,background:BRAND.accentDk,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}><TechIcon name="search" size={27} color="#fff"/></div>:null}</div>})}
  <div style={{position:'absolute',left:178,top:scannerY,width:724,height:8,borderRadius:8,background:`linear-gradient(90deg,rgba(110,69,201,0),${BRAND.accentDk},rgba(110,69,201,0))`,boxShadow:'0 0 28px rgba(110,69,201,.32)'}}/>
  <InfoChip label="5 STELLEN PRÜFEN" icon="search" x={350} y={1230} width={380} delay={132}/>
</CameraStage>};

const VerdictLane:React.FC<{label:string;y:number;open?:boolean;delay:number;icon:TechIconName}>=({label,y,open=false,delay,icon})=>{const frame=useCurrentFrame();const enter=ease(frame,delay,delay+38);const state=ease(frame,delay+34,delay+80);return <div style={{position:'absolute',left:135,top:y,width:810,height:92,borderRadius:28,background:open?'rgba(43,138,104,.08)':'rgba(181,65,92,.07)',border:`2px solid ${open?'rgba(43,138,104,.18)':'rgba(181,65,92,.15)'}`,display:'flex',alignItems:'center',padding:'0 25px',opacity:enter,transform:`translateX(${(1-enter)*34}px)`}}><TechIcon name={icon} size={32} color={open?GOOD:BRAND.ink}/><span style={{fontSize:25,fontWeight:950,color:BRAND.ink,marginLeft:14,flex:1}}>{label}</span><div style={{height:12,width:260,borderRadius:12,background:'rgba(26,26,46,.07)',overflow:'hidden'}}><div style={{height:'100%',width:`${state*100}%`,background:open?GOOD:RISK}}/></div><div style={{marginLeft:18,width:52,height:52,borderRadius:17,background:open?GOOD:RISK,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',opacity:state}}><TechIcon name={open?'unlock':'lock'} size={29} color="#fff"/></div></div>};

const VerdictScene:React.FC=()=>{const frame=useCurrentFrame();const sol=ease(frame,116,166);return <CameraStage mode="pull" startFrame={0} endFrame={170} intensity={.62}>
  <SceneBackdrop intensity={.9}/><BrandAnchor brand="chatgpt" x={58} y={180} accent delay={3}/><InfoChip label="14. OKTOBER" icon="calendar" x={700} y={180} width={315} delay={8}/>
  <VerdictLane label="ChatGPT" y={410} delay={20} icon="bot"/><VerdictLane label="ChatGPT Work" y={530} delay={32} icon="workflow"/><VerdictLane label="Codex" y={650} delay={44} icon="terminal"/><VerdictLane label="OpenAI API" y={810} delay={62} icon="code" open/>
  <div style={{position:'absolute',left:176,top:965,width:728,height:4,background:'rgba(110,69,201,.12)'}}/><KineticConnector from={{x:300,y:1030}} to={{x:760,y:1030}} startFrame={94} endFrame={144} width={7}/>
  <div style={{position:'absolute',left:145,top:990}}><ModelToken label="GPT-5.5" x={0} y={0} width={300} risk delay={78} icon="lock"/></div><div style={{position:'absolute',left:600,top:990,opacity:sol,transform:`scale(${.84+.16*sol})`}}><ModelToken label="GPT-5.6 SOL" x={0} y={0} width={350} accent delay={0} icon="zap"/></div>
  <InfoChip label="JETZT EINSTELLUNGEN PRÜFEN" icon="search" x={275} y={1218} width={530} accent delay={136}/>
</CameraStage>};

const visualByScene:Record<string,React.FC>={'gpt55-01':DeadlineScene,'gpt55-02':ProductShutdownScene,'gpt55-03':ApiExceptionScene,'gpt55-04':CodexMigrationScene,'gpt55-05':AuditScene,'gpt55-06':VerdictScene};
const Scene:React.FC<{scene:Gpt55Scene}>=({scene})=>{const Visual=visualByScene[scene.sceneId];return <AbsoluteFill style={{backgroundColor:'#fff',overflow:'hidden'}}><Visual/><Header scene={scene}/></AbsoluteFill>};

export type ReelGpt55RetirementProps={showCaptions?:boolean};
export const ReelGpt55Retirement:React.FC<ReelGpt55RetirementProps>=({showCaptions=true})=><AbsoluteFill style={{backgroundColor:'#fff',fontFamily:'Inter,Arial,sans-serif',color:BRAND.ink}}>{GPT55_SCENES.map((scene)=><Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame-scene.startFrame} layout="none"><Scene scene={scene}/></Sequence>)}<CaptionLayer showCaptions={showCaptions}/></AbsoluteFill>;
