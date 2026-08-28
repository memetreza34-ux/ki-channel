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
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Code2,
  Gauge,
  Server,
  Sparkles,
  Zap,
} from 'lucide-react';
import {REEL_CAPTION_GLASS_STYLE, REEL_CAPTION_WRAPPER_STYLE} from '../captionSafe';
import {ReelSfxTrack} from '../ReelSfxTrack';
import {CameraPush, FocusHalo, ParallaxFloat, ScanSweep, SourceProofCard} from '../ReelVisualMotion';
import {ReelExternalVisual} from '../ReelExternalVisual';
import {GPT56_API_CUES, GPT56_API_SCENES, GPT56_API_SFX, GPT56_API_VISUALS} from './contract';

type Props = {voiceoverSrc: string; showCaptions?: boolean; showSfx?: boolean};
const FONT = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};

const Shell: React.FC<React.PropsWithChildren<{accent:string; eyebrow:string}>> = ({accent,eyebrow,children}) => (
  <AbsoluteFill style={{fontFamily:FONT,color:'#102033',background:'linear-gradient(180deg,#FBFDFF 0%,#EEF5FA 100%)',padding:'112px 82px 0',overflow:'hidden'}}>
    <div style={{position:'absolute',width:540,height:540,borderRadius:999,right:-190,top:260,background:`radial-gradient(circle,${accent}14 0%, transparent 68%)`}}/>
    <div style={{position:'absolute',width:430,height:430,borderRadius:999,left:-210,bottom:250,background:`radial-gradient(circle,${accent}0D 0%, transparent 68%)`}}/>
    <div style={{alignSelf:'flex-start',padding:'12px 18px',borderRadius:999,background:'rgba(255,255,255,.88)',border:'1px solid rgba(16,32,51,.08)',boxShadow:'0 10px 30px rgba(16,32,51,.08)',fontSize:23,fontWeight:900,letterSpacing:'.035em',color:accent,zIndex:5}}>{eyebrow}</div>
    <div style={{position:'relative',zIndex:2}}>{children}</div>
  </AbsoluteFill>
);

const Title: React.FC<React.PropsWithChildren<{maxWidth?:number}>> = ({children,maxWidth=930}) => (
  <div style={{fontSize:75,lineHeight:1.02,fontWeight:950,letterSpacing:'-.045em',maxWidth,marginTop:50}}>{children}</div>
);

const Card: React.FC<React.PropsWithChildren<{style?:React.CSSProperties}>> = ({children,style}) => (
  <div style={{background:'rgba(255,255,255,.9)',border:'1px solid rgba(16,32,51,.08)',boxShadow:'0 28px 90px rgba(20,42,70,.13)',borderRadius:36,...style}}>{children}</div>
);

const Scene1: React.FC<{accent:string}> = ({accent}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const drop=spring({frame:frame-20,fps,config:{damping:15,stiffness:175}});
  const models=interpolate(frame,[48,76],[0,1],clamp);
  return <Shell accent={accent} eyebrow="GPT-5.6 API">
    <Title>OpenAI senkt die API-Preise.</Title>
    <div style={{position:'relative',marginTop:92}}>
      <CameraPush startFrame={6} endFrame={88} fromScale={1} toScale={1.045} origin="50% 54%">
        <Card style={{height:460,padding:36,display:'grid',gridTemplateColumns:'1.1fr .9fr',alignItems:'center'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:16,fontSize:28,fontWeight:900}}><Code2 size={42} color={accent}/> OpenAI API</div>
            <div style={{fontSize:62,fontWeight:950,marginTop:42,lineHeight:1}}>GPT-5.6</div>
            <div style={{fontSize:25,opacity:.55,marginTop:12}}>Luna • Terra • Sol</div>
          </div>
          <div style={{display:'grid',placeItems:'center'}}>
            <div style={{width:260,height:250,borderRadius:40,background:`${accent}12`,display:'grid',placeItems:'center',textAlign:'center',transform:`translateY(${(1-drop)*-30}px) scale(${.88+.12*drop})`,opacity:drop}}>
              <ArrowDown size={76} color={accent}/>
              <div><div style={{fontSize:25,fontWeight:850,opacity:.55}}>API-PREIS</div><div style={{fontSize:43,fontWeight:950,color:accent,marginTop:8}}>RUNTER</div></div>
            </div>
          </div>
        </Card>
      </CameraPush>
      <FocusHalo left="55%" top={75} width="39%" height={290} startFrame={18} endFrame={72} accent={accent} radius={38}/>
    </div>
    <div style={{marginTop:34,textAlign:'center',fontSize:28,fontWeight:900,color:accent,opacity:models}}>DREI MODELLE • NEUE KONDITIONEN</div>
  </Shell>;
};

const PriceDropCard: React.FC<{model:string;drop:string;accent:string;progress:number;strong?:boolean}> = ({model,drop,accent,progress,strong=false}) => (
  <Card style={{height:300,padding:34,position:'relative',overflow:'hidden',opacity:progress,transform:`translateY(${(1-progress)*28}px) scale(${.96+.04*progress})`}}>
    <div style={{fontSize:25,fontWeight:850,opacity:.52}}>{model}</div>
    <div style={{display:'flex',alignItems:'flex-end',gap:12,marginTop:26}}>
      <div style={{fontSize:96,lineHeight:.9,fontWeight:950,color:accent,letterSpacing:'-.06em'}}>{drop}</div>
      <div style={{fontSize:26,fontWeight:900,color:accent,paddingBottom:8}}>WENIGER</div>
    </div>
    <div style={{position:'absolute',left:34,right:34,bottom:34,height:18,borderRadius:99,background:'#EAF0F5',overflow:'hidden'}}>
      <div style={{height:'100%',width:strong?'80%':'20%',background:accent,borderRadius:99,transform:`scaleX(${progress})`,transformOrigin:'left'}}/>
    </div>
  </Card>
);

const Scene2: React.FC<{accent:string}> = ({accent}) => {
  const frame=useCurrentFrame();
  const luna=interpolate(frame,[12,34],[0,1],clamp);
  const terra=interpolate(frame,[68,92],[0,1],clamp);
  return <Shell accent={accent} eyebrow="PREISSENKUNG">
    <Title>Luna fällt viel stärker als Terra.</Title>
    <div style={{position:'relative',marginTop:86,display:'grid',gap:24}}>
      <CameraPush startFrame={8} endFrame={110} fromScale={1} toScale={1.04} origin="50% 50%">
        <div style={{display:'grid',gap:24}}>
          <PriceDropCard model="GPT-5.6 LUNA" drop="80 %" accent={accent} progress={luna} strong/>
          <PriceDropCard model="GPT-5.6 TERRA" drop="20 %" accent="#12B76A" progress={terra}/>
        </div>
      </CameraPush>
      <ScanSweep startFrame={30} endFrame={102} accent={accent} top={308} left={80} width="calc(100% - 160px)"/>
      <FocusHalo left={18} top={0} width="calc(100% - 36px)" height={300} startFrame={18} endFrame={58} accent={accent} radius={36}/>
      <FocusHalo left={18} top={324} width="calc(100% - 36px)" height={300} startFrame={76} endFrame={118} accent="#12B76A" radius={36}/>
    </div>
  </Shell>;
};

const Scene3: React.FC<{accent:string}> = ({accent}) => {
  const frame=useCurrentFrame();
  const speed=interpolate(frame,[34,112],[1,2.5],clamp);
  const external=GPT56_API_VISUALS.find((asset)=>asset.id==='scene3-datacenter-photo');
  const speedProgress=(speed-1)/1.5;
  return <Shell accent={accent} eyebrow="GPT-5.6 SOL • FAST MODE">
    <Title>Bis zu 2,5× schneller.</Title>
    <div style={{position:'relative',marginTop:80}}>
      <div style={{height:610,position:'relative'}}>
        {external?.staticFile ? (
          <ReelExternalVisual
            staticSrc={external.staticFile}
            rightsStatus={external.rightsStatus || undefined}
            credit={external.attribution || undefined}
            endFrame={160}
            fromScale={1.02}
            toScale={1.11}
            fromX={-8}
            toX={10}
            focalX={50}
            focalY={48}
            style={{position:'absolute',inset:0}}
          />
        ) : (
          <Card style={{position:'absolute',inset:0,display:'grid',placeItems:'center'}}><Server size={120} color={accent}/></Card>
        )}
        <div style={{position:'absolute',inset:0,borderRadius:36,background:'linear-gradient(180deg,rgba(7,15,30,.12),rgba(7,15,30,.73))'}}/>
        <div style={{position:'absolute',left:34,right:34,top:32,display:'flex',alignItems:'center',justifyContent:'space-between',color:'white'}}>
          <div style={{display:'flex',gap:12,alignItems:'center',fontSize:25,fontWeight:900}}><Zap size={34}/> FAST MODE</div>
          <div style={{padding:'10px 16px',borderRadius:18,background:'rgba(255,255,255,.14)',fontSize:21,fontWeight:800}}>GPT-5.6 SOL</div>
        </div>
        <div style={{position:'absolute',left:34,right:34,bottom:34,borderRadius:32,background:'rgba(8,16,30,.72)',backdropFilter:'blur(10px)',padding:26,color:'white'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',gap:14,alignItems:'center',fontSize:24,fontWeight:850}}><Gauge size={36}/> STANDARD → FAST</div>
            <div style={{fontSize:62,fontWeight:950,letterSpacing:'-.05em'}}>{speed.toFixed(1).replace('.',',')}×</div>
          </div>
          <div style={{height:16,borderRadius:99,background:'rgba(255,255,255,.18)',marginTop:20,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.max(0,Math.min(100,speedProgress*100))}%`,background:'#A78BFA',borderRadius:99}}/></div>
        </div>
      </div>
      <FocusHalo left="54%" top={430} width="42%" height={140} startFrame={70} endFrame={132} accent={accent} radius={30}/>
    </div>
  </Shell>;
};

const Scene4: React.FC<{accent:string}> = ({accent}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const left=spring({frame:frame-10,fps,config:{damping:17,stiffness:165}});
  const right=spring({frame:frame-28,fps,config:{damping:17,stiffness:165}});
  return <Shell accent={accent} eyebrow="DER TRADE-OFF">
    <Title>Mehr Tempo kostet das Doppelte.</Title>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginTop:110,position:'relative'}}>
      <ParallaxFloat amplitude={4} phase={.3}><Card style={{height:420,padding:34,display:'grid',placeItems:'center',textAlign:'center',transform:`scale(${.86+.14*left})`,opacity:left}}><div><Gauge size={82} color="#7A5AF8"/><div style={{fontSize:78,fontWeight:950,marginTop:24,color:'#7A5AF8'}}>2,5×</div><div style={{fontSize:25,fontWeight:850,opacity:.58,marginTop:10}}>BIS ZU SCHNELLER</div></div></Card></ParallaxFloat>
      <ParallaxFloat amplitude={4} phase={1.8}><Card style={{height:420,padding:34,display:'grid',placeItems:'center',textAlign:'center',transform:`scale(${.86+.14*right})`,opacity:right}}><div><div style={{fontSize:76,fontWeight:950,color:accent}}>2×</div><div style={{fontSize:52,fontWeight:950,marginTop:18}}>$</div><div style={{fontSize:25,fontWeight:850,opacity:.58,marginTop:12}}>PREIS</div></div></Card></ParallaxFloat>
      <FocusHalo left="51%" top={20} width="48%" height={400} startFrame={30} endFrame={88} accent={accent} radius={36}/>
    </div>
    <div style={{marginTop:38,textAlign:'center',fontSize:30,fontWeight:950,color:accent,opacity:interpolate(frame,[42,58],[0,1],clamp)}}>FAST MODE = DOPPELTER PREIS</div>
  </Shell>;
};

const Scene5: React.FC<{accent:string}> = ({accent}) => {
  const frame=useCurrentFrame();
  const route=interpolate(frame,[14,68],[0,1],clamp);
  const confirm=spring({frame:frame-72,fps:30,config:{damping:16,stiffness:175}});
  return <Shell accent={accent} eyebrow="ABWÄRTSKOMPATIBEL">
    <Title>priority wechselt automatisch in Fast Mode.</Title>
    <div style={{position:'relative',marginTop:88}}>
      <CameraPush startFrame={8} endFrame={102} fromScale={1} toScale={1.035} origin="50% 42%">
        <Card style={{height:390,padding:34,display:'grid',gridTemplateColumns:'1fr 130px 1fr',alignItems:'center'}}>
          <div style={{height:190,borderRadius:30,background:'#F4F7FA',display:'grid',placeItems:'center',textAlign:'center'}}><div><Code2 size={52} color="#667085"/><div style={{fontSize:30,fontWeight:950,marginTop:14}}>priority</div><div style={{fontSize:20,opacity:.55,marginTop:5}}>bestehende Anfrage</div></div></div>
          <div style={{position:'relative',height:8,borderRadius:99,background:'#DDE6EF',overflow:'hidden'}}><div style={{position:'absolute',inset:0,background:accent,transform:`scaleX(${route})`,transformOrigin:'left'}}/></div>
          <div style={{height:190,borderRadius:30,background:`${accent}12`,display:'grid',placeItems:'center',textAlign:'center',transform:`scale(${.94+.06*confirm})`}}><div><Zap size={52} color={accent}/><div style={{fontSize:30,fontWeight:950,marginTop:14,color:accent}}>FAST</div><div style={{fontSize:20,opacity:.58,marginTop:5}}>automatisch</div></div></div>
        </Card>
      </CameraPush>
      <FocusHalo left="64%" top={80} width="31%" height={220} startFrame={62} endFrame={106} accent={accent} radius={34}/>
    </div>
    <div style={{marginTop:32,display:'flex',justifyContent:'center'}}><SourceProofCard source="openai.com" date="30. Juli 2026" label="OpenAI Release Notes" accent={accent} startFrame={84}/></div>
    <div style={{marginTop:28,textAlign:'center',fontSize:36,fontWeight:950,color:accent,opacity:interpolate(frame,[92,108],[0,1],clamp)}}><CheckCircle2 size={34} style={{verticalAlign:'middle',marginRight:10}}/>ABWÄRTSKOMPATIBEL</div>
  </Shell>;
};

const CaptionLayer: React.FC = () => {
  const frame=useCurrentFrame();
  const cue=GPT56_API_CUES.find((item)=>frame>=item.startFrame&&frame<item.endFrame);
  if(!cue)return null;
  return <div style={REEL_CAPTION_WRAPPER_STYLE}><div style={{...REEL_CAPTION_GLASS_STYLE,fontFamily:FONT,fontSize:48,lineHeight:1.12,fontWeight:850,letterSpacing:'-.025em',color:'#102033'}}>{cue.text}</div></div>;
};

export const ReelGPT56APIPricesFastMode: React.FC<Props> = ({voiceoverSrc,showCaptions=true,showSfx=true}) => {
  if(!voiceoverSrc?.trim()) throw new Error('KI-GPT56APIPricesFastMode requires verified local voiceoverSrc.');
  const scenes=[Scene1,Scene2,Scene3,Scene4,Scene5];
  return <AbsoluteFill style={{background:'#FAFCFF'}}>
    <Html5Audio src={voiceoverSrc}/>
    {GPT56_API_SCENES.map((scene,index)=>{const Component=scenes[index]; const start=Number(scene.startFrame??0); const end=Number(scene.endFrame??start+1); return <Sequence key={scene.sceneId} from={start} durationInFrames={Math.max(1,end-start)}><Component accent={scene.accent}/></Sequence>;})}
    <ReelSfxTrack events={GPT56_API_SFX} enabled={showSfx}/>
    {showCaptions?<CaptionLayer/>:null}
  </AbsoluteFill>;
};
