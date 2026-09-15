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
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {ArrowDown, ArrowRight, CheckCircle2, Code2, Gauge, Server, Sparkles, Zap} from 'lucide-react';
import {REEL_CAPTION_GLASS_STYLE, REEL_CAPTION_WRAPPER_STYLE} from '../captionSafe';
import {ReelSfxTrack} from '../ReelSfxTrack';
import {ReelExternalVisual} from '../ReelExternalVisual';
import {SourceProofCard} from '../ReelVisualMotion';
import {
  ImpactNumber,
  StoryBeat,
  StoryCamera,
  StoryChapterLabel,
  StoryCutFlash,
  StoryProgressRail,
  StoryTexture,
} from '../StoryMotion';
import {StorySkiaBackdrop, StoryThreeHero} from '../StoryMediaLayers';
import {GPT56_API_CUES, GPT56_API_SCENES, GPT56_API_SFX, GPT56_API_VISUALS} from './contract';

type Props = {voiceoverSrc:string; showCaptions?:boolean; showSfx?:boolean};
type SceneProps = {accent:string; duration:number};
const FONT = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
const at = (duration:number, ratio:number) => Math.max(0, Math.round(duration * ratio));

const Shell: React.FC<React.PropsWithChildren<{accent:string; eyebrow:string; textureSeed?:number}>> = ({accent,eyebrow,textureSeed=6,children}) => (
  <AbsoluteFill style={{fontFamily:FONT,color:'#102033',background:'linear-gradient(180deg,#FCFEFF 0%,#EEF5FA 100%)',padding:'104px 76px 0',overflow:'hidden'}}>
    <StoryTexture seed={textureSeed} opacity={0.11}/>
    <StorySkiaBackdrop accent={accent}/>
    <div style={{position:'relative',zIndex:5}}><StoryChapterLabel accent={accent}>{eyebrow}</StoryChapterLabel></div>
    <div style={{position:'relative',zIndex:4,flex:1}}>{children}</div>
  </AbsoluteFill>
);

const Card: React.FC<React.PropsWithChildren<{style?:React.CSSProperties}>> = ({children,style}) => (
  <div style={{background:'rgba(255,255,255,.91)',border:'1px solid rgba(16,32,51,.09)',boxShadow:'0 24px 80px rgba(20,42,70,.13)',borderRadius:34,...style}}>{children}</div>
);

const Headline: React.FC<React.PropsWithChildren<{size?:number;maxWidth?:number}>> = ({children,size=70,maxWidth=940}) => (
  <div style={{fontSize:size,lineHeight:1.02,fontWeight:950,letterSpacing:'-.045em',maxWidth,marginTop:42}}>{children}</div>
);

const Scene1: React.FC<SceneProps> = ({accent,duration}) => {
  const frame=useCurrentFrame();
  const priceProgress=interpolate(frame,[at(duration,.38),at(duration,.66)],[0,1],clamp);
  return <Shell accent={accent} eyebrow="KAPITEL 1 • DER PREISFALL" textureSeed={7}>
    <StoryBeat startFrame={0} role="HOOK"><Headline>OpenAI drückt den Preis nach unten.</Headline></StoryBeat>
    <div style={{position:'relative',height:760,marginTop:54}}>
      <StoryCamera startFrame={at(duration,.08)} endFrame={at(duration,.9)} fromScale={1} toScale={1.08} fromX={0} toX={-18} origin="50% 48%">
        <StoryBeat startFrame={at(duration,.12)} direction="right" role="HOOK" style={{position:'absolute',right:-14,top:8,width:620,height:620}}>
          <StoryThreeHero accent={accent} startFrame={0} endFrame={duration}/>
        </StoryBeat>
      </StoryCamera>
      <StoryBeat startFrame={at(duration,.18)} direction="left" role="CHANGE" style={{position:'absolute',left:0,top:120,width:470}}>
        <Card style={{padding:30}}>
          <div style={{display:'flex',alignItems:'center',gap:14,fontSize:25,fontWeight:900}}><Code2 size={38} color={accent}/>OPENAI API</div>
          <div style={{fontSize:64,fontWeight:950,marginTop:24}}>GPT-5.6</div>
          <div style={{fontSize:24,opacity:.55,marginTop:8}}>Luna • Terra • Sol</div>
        </Card>
      </StoryBeat>
      <StoryBeat startFrame={at(duration,.38)} direction="down" role="CHANGE" style={{position:'absolute',left:46,top:420,width:360}}>
        <Card style={{padding:'24px 28px',textAlign:'center',border:`2px solid ${accent}55`}}>
          <ArrowDown size={58} color={accent}/><div style={{fontSize:31,fontWeight:950,color:accent}}>API-PREIS</div>
          <StoryProgressRail progress={priceProgress} accent={accent} height={12}/>
        </Card>
      </StoryBeat>
      <StoryBeat startFrame={at(duration,.68)} direction="up" role="PAYOFF" style={{position:'absolute',left:0,right:0,bottom:5,display:'flex',justifyContent:'center',gap:18}}>
        <div style={{padding:'16px 22px',borderRadius:22,background:'#EAF6FF',fontSize:28,fontWeight:950,color:'#1570EF'}}>LUNA −80 %</div>
        <div style={{padding:'16px 22px',borderRadius:22,background:'#ECFDF3',fontSize:28,fontWeight:950,color:'#039855'}}>TERRA −20 %</div>
      </StoryBeat>
    </div>
    <StoryCutFlash atFrame={at(duration,.92)} durationFrames={8}/>
  </Shell>;
};

const Scene2: React.FC<SceneProps> = ({accent,duration}) => {
  const frame=useCurrentFrame();
  const compare=interpolate(frame,[at(duration,.42),at(duration,.6)],[0,1],clamp);
  return <Shell accent={accent} eyebrow="KAPITEL 2 • DER UNTERSCHIED" textureSeed={12}>
    <StoryBeat startFrame={0} role="PROBLEM"><Headline>Luna fällt viel stärker als Terra.</Headline></StoryBeat>
    <div style={{position:'relative',height:1080,marginTop:38}}>
      <StoryBeat startFrame={at(duration,.06)} direction="left" role="CHANGE" style={{position:'absolute',left:0,top:30,width:'100%'}}>
        <StoryCamera startFrame={at(duration,.07)} endFrame={at(duration,.3)} fromScale={.98} toScale={1.06} origin="24% 50%">
          <Card style={{height:300,padding:32,display:'grid',gridTemplateColumns:'1fr 1fr',alignItems:'center'}}>
            <div><div style={{fontSize:24,fontWeight:900,opacity:.52}}>GPT-5.6 LUNA</div><div style={{fontSize:31,fontWeight:900,marginTop:16}}>Neue API-Kosten</div></div>
            <ImpactNumber value="80 %" label="WENIGER" accent={accent} startFrame={at(duration,.09)} size={122}/>
          </Card>
        </StoryCamera>
      </StoryBeat>
      <StoryBeat startFrame={at(duration,.29)} direction="right" role="CHANGE" style={{position:'absolute',left:0,top:354,width:'100%'}}>
        <Card style={{height:250,padding:32,display:'grid',gridTemplateColumns:'1fr 1fr',alignItems:'center'}}>
          <div><div style={{fontSize:24,fontWeight:900,opacity:.52}}>GPT-5.6 TERRA</div><div style={{fontSize:30,fontWeight:900,marginTop:14}}>Auch günstiger</div></div>
          <ImpactNumber value="20 %" label="WENIGER" accent="#12B76A" startFrame={at(duration,.31)} size={104}/>
        </Card>
      </StoryBeat>
      <StoryBeat startFrame={at(duration,.47)} direction="up" role="PROOF" style={{position:'absolute',left:30,right:30,top:642}}>
        <div style={{fontSize:24,fontWeight:900,opacity:.55,marginBottom:12}}>DIREKTER VERGLEICH</div>
        <StoryProgressRail progress={compare} accent={accent} height={24}/>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:23,fontWeight:900,marginTop:12}}><span>20 %</span><span>80 %</span></div>
      </StoryBeat>
      <StoryBeat startFrame={at(duration,.64)} direction="up" role="CONSEQUENCE" style={{position:'absolute',left:0,right:0,top:780}}>
        <Card style={{height:210,padding:28,display:'flex',alignItems:'center',justifyContent:'space-around'}}>
          {[['APPS',<Code2 key="a" size={40} color={accent}/>],['AUTOMATION',<Sparkles key="b" size={40} color="#12B76A"/>],['WORKFLOWS',<Server key="c" size={40} color="#7A5AF8"/>]].map(([label,icon],i)=><StoryBeat key={String(label)} startFrame={at(duration,.65+i*.07)} direction="up"><div style={{display:'grid',placeItems:'center',gap:12,fontSize:22,fontWeight:950}}>{icon}{label}</div></StoryBeat>)}
        </Card>
      </StoryBeat>
      <StoryBeat startFrame={at(duration,.84)} role="PAYOFF" style={{position:'absolute',left:0,right:0,bottom:0,textAlign:'center',fontSize:34,fontWeight:950,color:accent}}>MEHR SPIELRAUM FÜR VIELE API-JOBS</StoryBeat>
    </div>
    <StoryCutFlash atFrame={at(duration,.95)} durationFrames={8}/>
  </Shell>;
};

const Scene3: React.FC<SceneProps> = ({accent,duration}) => {
  const frame=useCurrentFrame();
  const external=GPT56_API_VISUALS.find((asset)=>asset.id==='scene3-datacenter-photo');
  const speed=interpolate(frame,[at(duration,.28),at(duration,.72)],[1,2.5],clamp);
  const speedProgress=(speed-1)/1.5;
  return <Shell accent={accent} eyebrow="KAPITEL 3 • FAST MODE" textureSeed={21}>
    <StoryBeat startFrame={0} role="CHANGE"><Headline>Sol bekommt einen Schnellmodus.</Headline></StoryBeat>
    <div style={{position:'relative',height:930,marginTop:42}}>
      <StoryBeat startFrame={at(duration,.08)} role="PROOF" style={{position:'absolute',inset:'0 0 210px 0'}}>
        <Card style={{height:'100%',overflow:'hidden',position:'relative',background:'#0B1020'}}>
          {external?.staticFile ? <ReelExternalVisual staticSrc={external.staticFile} rightsStatus={external.rightsStatus||undefined} credit={external.attribution||undefined} endFrame={duration} fromScale={1.02} toScale={1.15} focalX={50} focalY={50} style={{position:'absolute',inset:0}}/> : <StoryThreeHero accent={accent} startFrame={0} endFrame={duration} style={{position:'absolute',left:180,top:20,width:680,height:680}}/>}
          <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(8,14,30,.05),rgba(8,14,30,.78))'}}/>
          <StoryBeat startFrame={at(duration,.15)} direction="left" style={{position:'absolute',left:34,top:34,padding:'12px 18px',borderRadius:18,background:'rgba(255,255,255,.12)',color:'white',fontSize:24,fontWeight:950}}><Zap size={31} style={{verticalAlign:'middle',marginRight:8}}/>GPT-5.6 SOL • FAST</StoryBeat>
          <StoryBeat startFrame={at(duration,.28)} role="PAYOFF" style={{position:'absolute',left:34,right:34,bottom:38}}>
            <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',color:'white'}}><div style={{fontSize:27,fontWeight:900}}>STANDARD → FAST</div><div style={{fontSize:86,fontWeight:950,letterSpacing:'-.06em'}}>{speed.toFixed(1).replace('.',',')}×</div></div>
            <div style={{marginTop:18}}><StoryProgressRail progress={speedProgress} accent="#A78BFA" background="rgba(255,255,255,.16)" height={18}/></div>
          </StoryBeat>
        </Card>
      </StoryBeat>
      <StoryBeat startFrame={at(duration,.72)} direction="up" role="PAYOFF" style={{position:'absolute',left:0,right:0,bottom:0}}><ImpactNumber value="2,5×" label="BIS ZU SCHNELLER" accent={accent} startFrame={at(duration,.73)} size={126}/></StoryBeat>
    </div>
  </Shell>;
};

const Scene4: React.FC<SceneProps> = ({accent,duration}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const seesaw=spring({frame:frame-at(duration,.36),fps,config:{damping:13,stiffness:150}});
  return <Shell accent={accent} eyebrow="KAPITEL 4 • DER PREIS DAFÜR" textureSeed={31}>
    <StoryBeat startFrame={0} role="PROBLEM"><Headline>Mehr Tempo kostet das Doppelte.</Headline></StoryBeat>
    <div style={{position:'relative',height:900,marginTop:52}}>
      <StoryBeat startFrame={at(duration,.08)} direction="left" style={{position:'absolute',left:0,top:42,width:455}}><Card style={{height:380,padding:30,display:'grid',placeItems:'center'}}><div style={{textAlign:'center'}}><Gauge size={80} color="#7A5AF8"/><ImpactNumber value="2,5×" label="TEMPO" accent="#7A5AF8" startFrame={at(duration,.1)} size={100}/></div></Card></StoryBeat>
      <StoryBeat startFrame={at(duration,.24)} direction="right" style={{position:'absolute',right:0,top:42,width:455}}><Card style={{height:380,padding:30,display:'grid',placeItems:'center'}}><div style={{textAlign:'center'}}><ImpactNumber value="2×" label="PREIS" accent={accent} startFrame={at(duration,.26)} size={108}/><div style={{fontSize:50,fontWeight:950,marginTop:12}}>$</div></div></Card></StoryBeat>
      <StoryBeat startFrame={at(duration,.42)} role="CONSEQUENCE" style={{position:'absolute',left:90,right:90,top:485}}>
        <div style={{height:18,borderRadius:99,background:'#D0D5DD',transform:`rotate(${(-7+14*seesaw).toFixed(2)}deg)`,boxShadow:'0 12px 24px rgba(16,24,40,.12)'}}/>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:20,fontSize:28,fontWeight:950}}><span style={{color:'#7A5AF8'}}>SCHNELLER</span><span style={{color:accent}}>TEURER</span></div>
      </StoryBeat>
      <StoryBeat startFrame={at(duration,.66)} direction="up" role="PAYOFF" style={{position:'absolute',left:0,right:0,bottom:70,textAlign:'center',fontSize:38,fontWeight:950}}>DU KAUFST WARTEZEIT WEG.</StoryBeat>
    </div>
    <StoryCutFlash atFrame={at(duration,.92)} accent="#FFF7E8" durationFrames={8}/>
  </Shell>;
};

const RoutePanel: React.FC<{accent:string;kind:'priority'|'route'|'fast'}> = ({accent,kind}) => {
  if(kind==='priority') return <Card style={{height:360,padding:34,display:'grid',placeItems:'center'}}><div style={{textAlign:'center'}}><Code2 size={72} color={accent}/><div style={{fontSize:42,fontWeight:950,marginTop:18}}>priority=true</div><div style={{fontSize:24,opacity:.55,marginTop:10}}>bestehender Request</div></div></Card>;
  if(kind==='route') return <Card style={{height:360,padding:34,display:'grid',placeItems:'center'}}><div style={{textAlign:'center'}}><ArrowRight size={86} color={accent}/><div style={{fontSize:38,fontWeight:950,marginTop:18}}>ROUTING</div><div style={{fontSize:24,opacity:.55,marginTop:10}}>OpenAI übernimmt den Wechsel</div></div></Card>;
  return <Card style={{height:360,padding:34,display:'grid',placeItems:'center',border:`2px solid ${accent}55`}}><div style={{textAlign:'center'}}><Zap size={76} color={accent}/><div style={{fontSize:48,fontWeight:950,color:accent,marginTop:16}}>FAST MODE</div><div style={{fontSize:24,opacity:.55,marginTop:10}}>bestehende Integration bleibt nutzbar</div></div></Card>;
};

const Scene5: React.FC<SceneProps> = ({accent,duration}) => {
  const transitionDuration=Math.max(8,Math.round(duration*.035));
  const segment=Math.max(48,Math.round((duration*.53 + transitionDuration*2)/3));
  return <Shell accent={accent} eyebrow="KAPITEL 5 • DIE KONSEQUENZ" textureSeed={41}>
    <StoryBeat startFrame={0} role="PROOF"><Headline>priority landet automatisch im Fast Mode.</Headline></StoryBeat>
    <StoryBeat startFrame={at(duration,.08)} role="CHANGE" style={{marginTop:54,height:390}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={segment}><RoutePanel accent={accent} kind="priority"/></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({direction:'from-right'})} timing={linearTiming({durationInFrames:transitionDuration})}/>
        <TransitionSeries.Sequence durationInFrames={segment}><RoutePanel accent={accent} kind="route"/></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({direction:'from-left'})} timing={linearTiming({durationInFrames:transitionDuration})}/>
        <TransitionSeries.Sequence durationInFrames={segment}><RoutePanel accent={accent} kind="fast"/></TransitionSeries.Sequence>
      </TransitionSeries>
    </StoryBeat>
    <StoryBeat startFrame={at(duration,.56)} direction="up" role="CONSEQUENCE" style={{marginTop:28}}><Card style={{height:150,padding:'22px 28px',display:'flex',alignItems:'center',justifyContent:'space-between'}}><div style={{fontSize:27,fontWeight:900}}>BESTEHENDE INTEGRATION</div><CheckCircle2 size={54} color="#12B76A"/><div style={{fontSize:31,fontWeight:950,color:'#12B76A'}}>BLEIBT</div></Card></StoryBeat>
    <StoryBeat startFrame={at(duration,.69)} direction="up" role="PAYOFF" style={{marginTop:28}}><Card style={{height:148,padding:'22px 28px',display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:18}}><div style={{textAlign:'center'}}><div style={{fontSize:22,fontWeight:850,opacity:.52}}>NORMAL</div><div style={{fontSize:32,fontWeight:950,color:'#12B76A'}}>GÜNSTIGER</div></div><Sparkles size={34} color={accent}/><div style={{textAlign:'center'}}><div style={{fontSize:22,fontWeight:850,opacity:.52}}>SOL FAST</div><div style={{fontSize:32,fontWeight:950,color:accent}}>SCHNELLER</div></div></Card></StoryBeat>
    <StoryBeat startFrame={at(duration,.81)} role="PROOF" style={{marginTop:24,display:'flex',justifyContent:'center'}}><SourceProofCard source="openai.com" date="30. Juli 2026" label="Offizielle OpenAI-Quelle" accent={accent} startFrame={at(duration,.81)}/></StoryBeat>
    <StoryBeat startFrame={at(duration,.9)} role="PAYOFF" style={{marginTop:24,textAlign:'center',fontSize:34,fontWeight:950,color:accent}}><CheckCircle2 size={31} style={{verticalAlign:'middle',marginRight:9}}/>GÜNSTIGER ODER SCHNELLER — JE NACH BEDARF</StoryBeat>
  </Shell>;
};

const CaptionLayer: React.FC = () => {
  const frame=useCurrentFrame();
  const cue=GPT56_API_CUES.find((item)=>frame>=item.startFrame&&frame<item.endFrame);
  if(!cue)return null;
  return <div style={REEL_CAPTION_WRAPPER_STYLE}><div style={{...REEL_CAPTION_GLASS_STYLE,fontFamily:FONT,fontSize:48,lineHeight:1.12,fontWeight:850,letterSpacing:'-.025em',color:'#102033'}}>{cue.text}</div></div>;
};

export const ReelGPT56APIPricesFastModeStory: React.FC<Props> = ({voiceoverSrc,showCaptions=true,showSfx=true}) => {
  if(!voiceoverSrc?.trim()) throw new Error('KI-GPT56APIPricesFastMode requires verified local voiceoverSrc.');
  const scenes=[Scene1,Scene2,Scene3,Scene4,Scene5];
  return <AbsoluteFill style={{background:'#FAFCFF'}}>
    <Html5Audio src={voiceoverSrc}/>
    {GPT56_API_SCENES.map((scene,index)=>{const Component=scenes[index]; const start=Number(scene.startFrame??0); const end=Number(scene.endFrame??start+1); const duration=Math.max(1,end-start); return <Sequence key={scene.sceneId} from={start} durationInFrames={duration}><Component accent={scene.accent} duration={duration}/></Sequence>;})}
    <ReelSfxTrack events={GPT56_API_SFX} enabled={showSfx}/>
    {showCaptions?<CaptionLayer/>:null}
  </AbsoluteFill>;
};
