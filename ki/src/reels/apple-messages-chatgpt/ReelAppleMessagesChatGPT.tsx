import React from 'react';
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  Check,
  CheckCircle2,
  LockKeyhole,
  MessageCircle,
  Monitor,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import {REEL_CAPTION_GLASS_STYLE, REEL_CAPTION_WRAPPER_STYLE} from '../captionSafe';
import {ReelSfxTrack} from '../ReelSfxTrack';
import {APPLE_MESSAGES_CUES, APPLE_MESSAGES_SCENES, APPLE_MESSAGES_SFX} from './contract';

type Props = {voiceoverSrc: string; showCaptions?: boolean; showSfx?: boolean};
const FONT = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const Shell: React.FC<React.PropsWithChildren<{accent:string; eyebrow:string}>> = ({accent,eyebrow,children}) => (
  <AbsoluteFill style={{fontFamily:FONT,color:'#102033',background:'linear-gradient(180deg,#FAFCFF 0%,#EEF5FA 100%)',padding:'112px 82px 0',overflow:'hidden'}}>
    <div style={{alignSelf:'flex-start',padding:'12px 18px',borderRadius:999,background:'rgba(255,255,255,.82)',border:'1px solid rgba(16,32,51,.08)',boxShadow:'0 10px 30px rgba(16,32,51,.08)',fontSize:23,fontWeight:850,letterSpacing:'.04em',color:accent}}>{eyebrow}</div>
    {children}
  </AbsoluteFill>
);

const Title: React.FC<React.PropsWithChildren<{maxWidth?:number}>> = ({children,maxWidth=900}) => (
  <div style={{fontSize:75,lineHeight:1.02,fontWeight:950,letterSpacing:'-.045em',maxWidth,marginTop:50}}>{children}</div>
);

const Card: React.FC<React.PropsWithChildren<{style?:React.CSSProperties}>> = ({children,style}) => (
  <div style={{background:'rgba(255,255,255,.86)',border:'1px solid rgba(16,32,51,.08)',boxShadow:'0 28px 90px rgba(20,42,70,.13)',borderRadius:36,...style}}>{children}</div>
);

const Bubble: React.FC<{side:'left'|'right'; text:string; accent?:string; opacity?:number; y?:number}> = ({side,text,accent='#E7EEF6',opacity=1,y=0}) => (
  <div style={{alignSelf:side==='left'?'flex-start':'flex-end',maxWidth:610,padding:'18px 24px',borderRadius:28,background:side==='left'?'#E9EEF5':accent,color:side==='left'?'#24344A':'white',fontSize:28,fontWeight:720,opacity,transform:`translateY(${y}px)`}}>{text}</div>
);

const Scene1: React.FC<{accent:string}> = ({accent}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const card=spring({frame,fps,config:{damping:17,stiffness:150}});
  const connect=spring({frame:frame-18,fps,config:{damping:16,stiffness:180}});
  const success=spring({frame:frame-48,fps,config:{damping:15,stiffness:180}});
  return <Shell accent={accent} eyebrow="NEU IN CHATGPT">
    <Title>ChatGPT kann jetzt mit Apple Messages arbeiten.</Title>
    <div style={{display:'grid',gridTemplateColumns:'1fr 120px 1fr',alignItems:'center',marginTop:105}}>
      <Card style={{height:390,padding:32,transform:`scale(${.9+.1*card})`}}>
        <div style={{display:'flex',gap:16,alignItems:'center',fontSize:29,fontWeight:900}}><MessageCircle size={44} color={accent}/> Messages</div>
        <div style={{display:'grid',gap:14,marginTop:44}}><Bubble side="left" text="Bist du später da?"/><Bubble side="right" text="Ich prüfe kurz." accent={accent}/></div>
      </Card>
      <div style={{height:5,background:`linear-gradient(90deg,${accent},#2E90FA)`,borderRadius:99,transform:`scaleX(${connect})`,transformOrigin:'left'}}/>
      <Card style={{height:390,padding:34,display:'grid',placeItems:'center',textAlign:'center',transform:`scale(${.9+.1*card})`}}>
        <div><Sparkles size={74} color="#111827"/><div style={{fontSize:38,fontWeight:950,marginTop:20}}>ChatGPT</div><div style={{fontSize:25,opacity:.6,marginTop:8}}>Apple Messages Plug-in</div></div>
        <div style={{position:'absolute',marginTop:300,opacity:success,transform:`scale(${success})`,color:accent,fontSize:24,fontWeight:900}}>VERBUNDEN</div>
      </Card>
    </div>
  </Shell>;
};

const Scene2: React.FC<{accent:string}> = ({accent}) => {
  const frame=useCurrentFrame();
  const focus=interpolate(frame,[10,24],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const scan=interpolate(frame,[22,70],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const rows=['iMessage','SMS','RCS'];
  return <Shell accent={accent} eyebrow="LESEN + SUCHEN">
    <Title>Nachrichten lesen und durchsuchen.</Title>
    <Card style={{marginTop:84,height:690,padding:34,position:'relative',overflow:'hidden'}}>
      <div style={{height:86,borderRadius:24,border:`2px solid rgba(46,144,250,${.16+.36*focus})`,background:'#F8FAFD',display:'flex',alignItems:'center',padding:'0 24px',gap:16,fontSize:28,fontWeight:750}}><Search size={34} color={accent}/> Suche in Messages…</div>
      <div style={{position:'absolute',left:34,right:34,top:142,height:3,background:accent,transform:`scaleX(${scan})`,transformOrigin:'left',opacity:.45}}/>
      <div style={{display:'grid',gap:18,marginTop:48}}>
        {rows.map((label,i)=>{const p=interpolate(frame,[38+i*14,54+i*14],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <div key={label} style={{height:128,borderRadius:28,background:'#F3F7FB',display:'flex',alignItems:'center',padding:'0 28px',transform:`translateY(${(1-p)*22}px)`,opacity:p}}><MessageCircle size={40} color={accent}/><div style={{marginLeft:20}}><div style={{fontSize:31,fontWeight:900}}>{label}</div><div style={{fontSize:22,opacity:.52,marginTop:4}}>Treffer aus deinem verbundenen Verlauf</div></div><CheckCircle2 size={34} color={accent} style={{marginLeft:'auto'}}/></div>})}
      </div>
    </Card>
  </Shell>;
};

const Scene3: React.FC<{accent:string}> = ({accent}) => {
  const frame=useCurrentFrame();
  const draft=interpolate(frame,[12,44],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const send=spring({frame:frame-66,fps:30,config:{damping:15,stiffness:180}});
  return <Shell accent={accent} eyebrow="ANTWORTEN VORBEREITEN">
    <Title>Entwurf erstellen. Auf Wunsch senden.</Title>
    <Card style={{marginTop:90,height:660,padding:36,position:'relative'}}>
      <div style={{display:'flex',gap:14,alignItems:'center',fontSize:27,fontWeight:850}}><Sparkles size={34} color={accent}/> Antwortentwurf</div>
      <div style={{marginTop:42,borderRadius:28,background:'#F4F1FF',padding:30,minHeight:210,fontSize:32,lineHeight:1.35,fontWeight:720}}>
        <span style={{opacity:draft}}>„Ja, ich bin später da. Ich melde mich, sobald ich losfahre.“</span>
      </div>
      <div style={{marginTop:42,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:25,opacity:.56}}>Bereit für Messages</div>
        <div style={{width:180,height:76,borderRadius:24,background:accent,color:'white',display:'flex',alignItems:'center',justifyContent:'center',gap:12,fontSize:27,fontWeight:900,transform:`scale(${.84+.16*send})`,opacity:send}}><Send size={31}/> SENDEN</div>
      </div>
      <div style={{position:'absolute',left:36,right:36,bottom:44,display:'flex',justifyContent:'center',fontSize:25,fontWeight:850,color:accent}}>VORBEREITEN → SENDEN</div>
    </Card>
  </Shell>;
};

const Scene4: React.FC<{accent:string}> = ({accent}) => {
  const frame=useCurrentFrame();
  const sheet=spring({frame:frame-18,fps:30,config:{damping:17,stiffness:155}});
  const c1=spring({frame:frame-40,fps:30,config:{damping:16,stiffness:175}});
  const c2=spring({frame:frame-54,fps:30,config:{damping:16,stiffness:175}});
  const approved=spring({frame:frame-64,fps:30,config:{damping:15,stiffness:185}});
  return <Shell accent={accent} eyebrow="NICHT EINFACH ABSCHICKEN">
    <Title>Vor dem Senden kommt deine Freigabe.</Title>
    <div style={{marginTop:74,display:'grid',gap:24}}>
      <Card style={{height:132,padding:'0 30px',display:'flex',alignItems:'center',gap:20}}><LockKeyhole size={44} color="#D92D20"/><div><div style={{fontSize:29,fontWeight:900}}>Senden gesperrt</div><div style={{fontSize:22,opacity:.54,marginTop:4}}>Freigabe fehlt</div></div></Card>
      <Card style={{height:520,padding:34,transform:`translateY(${(1-sheet)*58}px)`,opacity:sheet}}>
        <div style={{fontSize:31,fontWeight:950}}>Vor dem Senden bestätigen</div>
        {[['Nachricht prüfen',c1],['Empfänger prüfen',c2]].map(([label,p],i)=><div key={String(label)} style={{height:112,marginTop:i?16:30,borderRadius:26,background:'#F8FAFC',display:'flex',alignItems:'center',padding:'0 24px',fontSize:27,fontWeight:820}}><div style={{width:46,height:46,borderRadius:14,background:accent,color:'white',display:'grid',placeItems:'center',transform:`scale(${p as number})`,opacity:p as number}}><Check size={28}/></div><span style={{marginLeft:18}}>{String(label)}</span></div>)}
        <div style={{marginTop:26,height:82,borderRadius:24,background:approved>.5?'#12B76A':'#E9EEF5',color:approved>.5?'white':'#667085',display:'flex',alignItems:'center',justifyContent:'center',gap:12,fontSize:27,fontWeight:950,transform:`scale(${.96+.04*approved})`}}><ShieldCheck size={34}/> SENDEN FREIGEGEBEN</div>
      </Card>
    </div>
  </Shell>;
};

const Scene5: React.FC<{accent:string}> = ({accent}) => {
  const frame=useCurrentFrame();
  const mac=spring({frame:frame-12,fps:30,config:{damping:17,stiffness:160}});
  const plans=spring({frame:frame-24,fps:30,config:{damping:17,stiffness:160}});
  const hold=interpolate(frame,[48,62],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <Shell accent={accent} eyebrow="VERFÜGBARKEIT">
    <Title>Laut OpenAI: macOS Desktop, alle Tarife.</Title>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginTop:110}}>
      <Card style={{height:360,padding:34,display:'grid',placeItems:'center',textAlign:'center',transform:`scale(${.86+.14*mac})`,opacity:mac}}><Monitor size={90} color={accent}/><div><div style={{fontSize:36,fontWeight:950}}>macOS DESKTOP</div><div style={{fontSize:22,opacity:.55,marginTop:8}}>ChatGPT App</div></div></Card>
      <Card style={{height:360,padding:34,display:'grid',placeItems:'center',textAlign:'center',transform:`scale(${.86+.14*plans})`,opacity:plans}}><Smartphone size={90} color={accent}/><div><div style={{fontSize:36,fontWeight:950}}>ALLE TARIFE</div><div style={{fontSize:22,opacity:.55,marginTop:8}}>laut OpenAI Release Notes</div></div></Card>
    </div>
    <div style={{marginTop:64,textAlign:'center',fontSize:42,fontWeight:950,color:accent,opacity:hold}}>VERBINDEN → PRÜFEN → SENDEN</div>
  </Shell>;
};

const CaptionLayer: React.FC = () => {const frame=useCurrentFrame(); const cue=APPLE_MESSAGES_CUES.find((item)=>frame>=item.startFrame&&frame<item.endFrame); if(!cue)return null; return <div style={REEL_CAPTION_WRAPPER_STYLE}><div style={{...REEL_CAPTION_GLASS_STYLE,fontFamily:FONT,fontSize:48,lineHeight:1.12,fontWeight:850,letterSpacing:'-.025em',color:'#102033'}}>{cue.text}</div></div>;};

export const ReelAppleMessagesChatGPT: React.FC<Props> = ({voiceoverSrc,showCaptions=true,showSfx=true}) => {
  if(!voiceoverSrc?.trim()) throw new Error('KI-AppleMessagesChatGPT requires verified local voiceoverSrc.');
  const scenes=[Scene1,Scene2,Scene3,Scene4,Scene5];
  return <AbsoluteFill style={{background:'#FAFCFF'}}>
    <Html5Audio src={voiceoverSrc}/>
    {APPLE_MESSAGES_SCENES.map((scene,index)=>{const Component=scenes[index]; const start=Number(scene.startFrame??0); const end=Number(scene.endFrame??start+1); return <Sequence key={scene.sceneId} from={start} durationInFrames={Math.max(1,end-start)}><Component accent={scene.accent}/></Sequence>;})}
    <ReelSfxTrack events={APPLE_MESSAGES_SFX} enabled={showSfx}/>
    {showCaptions?<CaptionLayer/>:null}
  </AbsoluteFill>;
};
