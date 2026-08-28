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
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Code2,
  KeyRound,
  ListChecks,
  Server,
  Settings2,
  Sparkles,
  X,
} from 'lucide-react';
import {REEL_CAPTION_GLASS_STYLE, REEL_CAPTION_WRAPPER_STYLE} from '../captionSafe';
import {ReelSfxTrack} from '../ReelSfxTrack';
import {CameraPush, FocusHalo, ParallaxFloat, ScanSweep, SourceProofCard} from '../ReelVisualMotion';
import {ReelExternalVisual} from '../ReelExternalVisual';
import {
  CODEX_SUNSET_CUES,
  CODEX_SUNSET_SCENES,
  CODEX_SUNSET_SFX,
  CODEX_SUNSET_VISUALS,
} from './contract';

type Props = {voiceoverSrc: string; showCaptions?: boolean; showSfx?: boolean};
const FONT = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};

const Shell: React.FC<React.PropsWithChildren<{accent:string; eyebrow:string}>> = ({accent,eyebrow,children}) => (
  <AbsoluteFill style={{fontFamily:FONT,color:'#102033',background:'linear-gradient(180deg,#FAFCFF 0%,#EEF5FA 100%)',padding:'112px 82px 0',overflow:'hidden'}}>
    <div style={{position:'absolute',width:540,height:540,borderRadius:999,right:-190,top:270,background:`radial-gradient(circle,${accent}14 0%, transparent 68%)`}}/>
    <div style={{position:'absolute',width:440,height:440,borderRadius:999,left:-220,bottom:250,background:`radial-gradient(circle,${accent}0D 0%, transparent 68%)`}}/>
    <div style={{alignSelf:'flex-start',padding:'12px 18px',borderRadius:999,background:'rgba(255,255,255,.86)',border:'1px solid rgba(16,32,51,.08)',boxShadow:'0 10px 30px rgba(16,32,51,.08)',fontSize:23,fontWeight:900,letterSpacing:'.035em',color:accent,zIndex:5}}>{eyebrow}</div>
    <div style={{position:'relative',zIndex:2}}>{children}</div>
  </AbsoluteFill>
);

const Title: React.FC<React.PropsWithChildren<{maxWidth?:number}>> = ({children,maxWidth=920}) => (
  <div style={{fontSize:75,lineHeight:1.02,fontWeight:950,letterSpacing:'-.045em',maxWidth,marginTop:50}}>{children}</div>
);

const Card: React.FC<React.PropsWithChildren<{style?:React.CSSProperties}>> = ({children,style}) => (
  <div style={{background:'rgba(255,255,255,.89)',border:'1px solid rgba(16,32,51,.08)',boxShadow:'0 28px 90px rgba(20,42,70,.13)',borderRadius:36,...style}}>{children}</div>
);

const ModelPill: React.FC<{name:string; sub?:string; accent:string; danger?:boolean; progress?:number}> = ({name,sub,accent,danger=false,progress=1}) => (
  <div style={{height:150,borderRadius:30,background:'#fff',border:`2px solid ${danger?'rgba(217,45,32,.2)':'rgba(16,32,51,.07)'}`,display:'flex',alignItems:'center',padding:'0 28px',position:'relative',overflow:'hidden',opacity:.55+.45*progress,transform:`translateY(${(1-progress)*18}px)`}}>
    <div style={{width:54,height:54,borderRadius:18,background:`${accent}14`,display:'grid',placeItems:'center'}}><Code2 size={32} color={accent}/></div>
    <div style={{marginLeft:18}}><div style={{fontSize:32,fontWeight:950}}>{name}</div>{sub?<div style={{fontSize:21,opacity:.52,marginTop:4}}>{sub}</div>:null}</div>
    {danger?<div style={{marginLeft:'auto',width:48,height:48,borderRadius:16,background:'#FEE4E2',display:'grid',placeItems:'center'}}><X size={30} color="#D92D20"/></div>:null}
  </div>
);

const Scene1: React.FC<{accent:string}> = ({accent}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const stamp=spring({frame:frame-14,fps,config:{damping:15,stiffness:180}});
  const remove=interpolate(frame,[52,82],[0,1],clamp);
  return <Shell accent={accent} eyebrow="CODEX • DEADLINE">
    <Title>Am 31. August fliegen zwei Modelle aus Codex.</Title>
    <div style={{position:'relative',marginTop:74}}>
      <CameraPush startFrame={6} endFrame={84} fromScale={1} toScale={1.045} origin="50% 48%">
        <div style={{display:'grid',gridTemplateColumns:'260px 1fr',gap:24}}>
          <Card style={{height:330,padding:28,display:'grid',placeItems:'center',textAlign:'center',transform:`scale(${.84+.16*stamp})`,border:'2px solid rgba(217,45,32,.14)'}}>
            <Clock3 size={64} color={accent}/>
            <div><div style={{fontSize:25,fontWeight:850,opacity:.55}}>DEADLINE</div><div style={{fontSize:48,fontWeight:950,lineHeight:1,marginTop:8}}>31. AUGUST</div></div>
          </Card>
          <div style={{display:'grid',gap:18}}>
            <ModelPill name="GPT-5.4" sub="Codex mit ChatGPT-Login" accent={accent} danger progress={1-remove*.2}/>
            <ModelPill name="GPT-5.4 mini" sub="Codex mit ChatGPT-Login" accent={accent} danger progress={1-remove*.2}/>
          </div>
        </div>
      </CameraPush>
      <FocusHalo left={295} top={4} width="calc(100% - 305px)" height={328} startFrame={46} endFrame={92} accent={accent} radius={34}/>
    </div>
    <div style={{marginTop:34,fontSize:28,fontWeight:900,color:accent,opacity:interpolate(frame,[62,76],[0,1],clamp),textAlign:'center'}}>CHATGPT-LOGIN BETROFFEN</div>
  </Shell>;
};

const ReplacementRow: React.FC<{from:string;to:string;accent:string;progress:number}> = ({from,to,accent,progress}) => (
  <Card style={{height:210,padding:'0 34px',display:'grid',gridTemplateColumns:'1fr 92px 1fr',alignItems:'center',opacity:progress,transform:`translateY(${(1-progress)*24}px)`}}>
    <div><div style={{fontSize:21,opacity:.48,fontWeight:800}}>BISHER</div><div style={{fontSize:34,fontWeight:950,marginTop:8}}>{from}</div></div>
    <div style={{display:'grid',placeItems:'center'}}><ArrowRight size={52} color={accent}/></div>
    <div><div style={{fontSize:21,color:accent,fontWeight:900}}>EMPFOHLEN</div><div style={{fontSize:34,fontWeight:950,marginTop:8,color:accent}}>{to}</div></div>
  </Card>
);

const Scene2: React.FC<{accent:string}> = ({accent}) => {
  const frame=useCurrentFrame();
  const a=interpolate(frame,[12,34],[0,1],clamp);
  const b=interpolate(frame,[56,80],[0,1],clamp);
  return <Shell accent={accent} eyebrow="ERSATZMODELLE">
    <Title>OpenAI nennt direkt zwei Ersatzmodelle.</Title>
    <div style={{position:'relative',marginTop:80,display:'grid',gap:24}}>
      <CameraPush startFrame={8} endFrame={96} fromScale={1} toScale={1.04} origin="56% 50%">
        <div style={{display:'grid',gap:24}}>
          <ReplacementRow from="GPT-5.4" to="GPT-5.6 Terra" accent={accent} progress={a}/>
          <ReplacementRow from="GPT-5.4 mini" to="GPT-5.6 Luna" accent={accent} progress={b}/>
        </div>
      </CameraPush>
      <ScanSweep startFrame={20} endFrame={92} accent={accent} top={218} left={90} width="calc(100% - 180px)"/>
      <FocusHalo left={18} top={0} width="calc(100% - 36px)" height={210} startFrame={18} endFrame={52} accent={accent} radius={34}/>
      <FocusHalo left={18} top={234} width="calc(100% - 36px)" height={210} startFrame={62} endFrame={104} accent={accent} radius={34}/>
    </div>
  </Shell>;
};

const Scene3: React.FC<{accent:string}> = ({accent}) => {
  const frame=useCurrentFrame();
  const api=spring({frame:frame-46,fps:30,config:{damping:16,stiffness:170}});
  const external=CODEX_SUNSET_VISUALS.find((asset)=>asset.id==='scene3-api-server-photo');
  return <Shell accent={accent} eyebrow="WICHTIGE AUSNAHME">
    <Title>Die API bleibt verfügbar.</Title>
    <div style={{marginTop:82,display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,position:'relative'}}>
      <Card style={{height:560,padding:30,position:'relative',overflow:'hidden'}}>
        <div style={{display:'flex',gap:14,alignItems:'center',fontSize:24,fontWeight:900,color:'#D92D20'}}><AlertTriangle size={34}/> CHATGPT-LOGIN</div>
        <div style={{fontSize:46,fontWeight:950,lineHeight:1.05,marginTop:54}}>5.4 / 5.4 mini</div>
        <div style={{fontSize:25,opacity:.55,marginTop:14}}>werden am 31. August entfernt</div>
        <div style={{position:'absolute',left:30,right:30,bottom:34,height:86,borderRadius:26,background:'#FEE4E2',display:'flex',alignItems:'center',justifyContent:'center',gap:12,color:'#D92D20',fontSize:27,fontWeight:950}}><X size={34}/> BETROFFEN</div>
      </Card>
      <div style={{height:560,position:'relative'}}>
        {external?.staticFile ? <ReelExternalVisual staticSrc={external.staticFile} endFrame={120} fromScale={1.02} toScale={1.10} fromX={-8} toX={8} focalX={52} focalY={48} credit={external.attribution || undefined} style={{position:'absolute',inset:0}}/> : <Card style={{position:'absolute',inset:0,display:'grid',placeItems:'center'}}><Server size={110} color={accent}/></Card>}
        <div style={{position:'absolute',inset:18,borderRadius:30,background:'linear-gradient(180deg,rgba(6,22,34,.12),rgba(6,22,34,.68))'}}/>
        <div style={{position:'absolute',left:30,right:30,top:30,color:'white',display:'flex',alignItems:'center',gap:12,fontSize:24,fontWeight:900}}><KeyRound size={34}/> API-KEY</div>
        <div style={{position:'absolute',left:30,right:30,bottom:32,height:92,borderRadius:26,background:'rgba(18,183,106,.94)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',gap:12,fontSize:27,fontWeight:950,transform:`scale(${.94+.06*api})`}}><CheckCircle2 size={36}/> BLEIBT VERFÜGBAR</div>
      </div>
      <FocusHalo left="51%" top={422} width="47%" height={116} startFrame={48} endFrame={104} accent={accent} radius={30}/>
    </div>
  </Shell>;
};

const Scene4: React.FC<{accent:string}> = ({accent}) => {
  const frame=useCurrentFrame();
  const items=[
    ['Workspace-Standards',Settings2],
    ['gespeicherte Modelleinstellungen',Code2],
    ['benutzerdefinierte Agenten',Sparkles],
    ['geplante Aufgaben',ListChecks],
  ] as const;
  return <Shell accent={accent} eyebrow="JETZT PRÜFEN">
    <Title>Diese Workflows solltest du vor dem 31. August umstellen.</Title>
    <div style={{position:'relative',marginTop:68}}>
      <CameraPush startFrame={10} endFrame={126} fromScale={1} toScale={1.035} origin="50% 45%">
        <Card style={{height:690,padding:30}}>
          <div style={{fontSize:28,fontWeight:950}}>MIGRATIONS-CHECKLISTE</div>
          <div style={{display:'grid',gap:16,marginTop:30}}>
            {items.map(([label,Icon],i)=>{const p=spring({frame:frame-(20+i*24),fps:30,config:{damping:17,stiffness:175}});return <div key={label} style={{height:124,borderRadius:28,background:'#F8FAFC',display:'flex',alignItems:'center',padding:'0 26px',opacity:p,transform:`translateX(${(1-p)*24}px)`}}><div style={{width:48,height:48,borderRadius:16,background:`${accent}14`,display:'grid',placeItems:'center'}}><Icon size={29} color={accent}/></div><div style={{fontSize:27,fontWeight:880,marginLeft:18}}>{label}</div><div style={{marginLeft:'auto',width:46,height:46,borderRadius:15,background:accent,color:'white',display:'grid',placeItems:'center',transform:`scale(${p})`}}><Check size={28}/></div></div>})}
          </div>
        </Card>
      </CameraPush>
      <FocusHalo left={18} top={334} width="calc(100% - 36px)" height={274} startFrame={72} endFrame={132} accent={accent} radius={32}/>
    </div>
  </Shell>;
};

const Scene5: React.FC<{accent:string}> = ({accent}) => {
  const frame=useCurrentFrame();
  const hold=interpolate(frame,[40,58],[0,1],clamp);
  return <Shell accent={accent} eyebrow="KURZ GESAGT">
    <Title>ChatGPT-Login wechselt. API-Key kann bleiben.</Title>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginTop:92}}>
      <ParallaxFloat amplitude={4} phase={.3}><Card style={{height:330,padding:30,display:'grid',placeItems:'center',textAlign:'center'}}><div><X size={72} color="#D92D20"/><div style={{fontSize:34,fontWeight:950,marginTop:20}}>CHATGPT-LOGIN</div><div style={{fontSize:22,opacity:.55,marginTop:8}}>5.4 → neues Modell</div></div></Card></ParallaxFloat>
      <ParallaxFloat amplitude={4} phase={1.8}><Card style={{height:330,padding:30,display:'grid',placeItems:'center',textAlign:'center'}}><div><KeyRound size={72} color={accent}/><div style={{fontSize:34,fontWeight:950,marginTop:20}}>API-KEY</div><div style={{fontSize:22,opacity:.55,marginTop:8}}>5.4 bleibt verfügbar</div></div></Card></ParallaxFloat>
    </div>
    <div style={{marginTop:32,display:'flex',justifyContent:'center'}}><SourceProofCard source="openai.com" date="31. Juli 2026" label="OpenAI Release Notes" accent={accent} startFrame={28}/></div>
    <div style={{marginTop:32,textAlign:'center',fontSize:37,fontWeight:950,color:accent,opacity:hold}}>VOR DEM 31. AUGUST WORKFLOWS PRÜFEN</div>
  </Shell>;
};

const CaptionLayer: React.FC = () => {
  const frame=useCurrentFrame();
  const cue=CODEX_SUNSET_CUES.find((item)=>frame>=item.startFrame&&frame<item.endFrame);
  if(!cue)return null;
  return <div style={REEL_CAPTION_WRAPPER_STYLE}><div style={{...REEL_CAPTION_GLASS_STYLE,fontFamily:FONT,fontSize:48,lineHeight:1.12,fontWeight:850,letterSpacing:'-.025em',color:'#102033'}}>{cue.text}</div></div>;
};

export const ReelCodexGPT54Sunset: React.FC<Props> = ({voiceoverSrc,showCaptions=true,showSfx=true}) => {
  if(!voiceoverSrc?.trim()) throw new Error('KI-CodexGPT54Sunset requires verified local voiceoverSrc.');
  const scenes=[Scene1,Scene2,Scene3,Scene4,Scene5];
  return <AbsoluteFill style={{background:'#FAFCFF'}}>
    <Html5Audio src={voiceoverSrc}/>
    {CODEX_SUNSET_SCENES.map((scene,index)=>{const Component=scenes[index]; const start=Number(scene.startFrame??0); const end=Number(scene.endFrame??start+1); return <Sequence key={scene.sceneId} from={start} durationInFrames={Math.max(1,end-start)}><Component accent={scene.accent}/></Sequence>;})}
    <ReelSfxTrack events={CODEX_SUNSET_SFX} enabled={showSfx}/>
    {showCaptions?<CaptionLayer/>:null}
  </AbsoluteFill>;
};
