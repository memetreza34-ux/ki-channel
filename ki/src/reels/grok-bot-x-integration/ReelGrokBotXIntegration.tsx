import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AtSign, Bookmark, Bot, Check, Cloud, FileText, Folder, Search, Terminal, TrendingUp} from 'lucide-react';
import {REEL_CAPTION_GLASS_STYLE, REEL_CAPTION_WRAPPER_STYLE, shouldShowReelCaption} from '../captionSafe';
import {ReelSfxTrack} from '../ReelSfxTrack';
import {SourceProofCard} from '../ReelVisualMotion';
import {StoryBeat, StoryCamera, StoryChapterLabel, StoryTexture} from '../StoryMotion';
import {GROK_X_CUES, GROK_X_SCENES, GROK_X_SFX, type GrokXCue} from './contract';

type Props = {voiceoverSrc:string; showCaptions?:boolean; showSfx?:boolean};
type Window = {start:number; end:number};
const FONT='Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const sceneFor=(sceneId:string)=>GROK_X_SCENES.find((scene)=>scene.sceneId===sceneId);
const localWindow=(sceneId:string,sentenceId:string,duration:number,fallbackStart:number,fallbackEnd:number):Window=>{
  const scene=sceneFor(sceneId);
  const matches=GROK_X_CUES.filter((cue)=>cue.sceneId===sceneId&&cue.sentenceId===sentenceId);
  if(scene&&matches.length){
    return {start:Math.max(0,Math.min(...matches.map((cue)=>cue.startFrame))-scene.startFrame),end:Math.min(duration,Math.max(...matches.map((cue)=>cue.endFrame))-scene.startFrame)};
  }
  return {start:Math.round(duration*fallbackStart),end:Math.round(duration*fallbackEnd)};
};
const progressIn=(frame:number,window:Window)=>interpolate(frame,[window.start,Math.max(window.start+1,window.end)],[0,1],clamp);

const Stage:React.FC<React.PropsWithChildren<{accent:string;chapter:string}>>=({accent,chapter,children})=>(
  <AbsoluteFill style={{background:'linear-gradient(180deg,#F9FBFE 0%,#EEF4FA 100%)',color:'#101828',fontFamily:FONT,overflow:'hidden'}}>
    <StoryTexture color="#FFFFFF" opacity={0.10}/>
    <div style={{position:'absolute',left:62,top:58,zIndex:40}}><StoryChapterLabel accent={accent}>{chapter}</StoryChapterLabel></div>
    {children}
  </AbsoluteFill>
);

const BrandPill:React.FC<{label:string;dark?:boolean;size?:number}>=({label,dark=false,size=46})=>(
  <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',minWidth:190,padding:'18px 28px',borderRadius:30,background:dark?'#101010':'#FFFFFF',color:dark?'#FFFFFF':'#101828',fontSize:size,fontWeight:950,letterSpacing:'-.045em',boxShadow:'0 18px 52px rgba(16,24,40,.12)',border:'1px solid rgba(16,24,40,.08)'}}>{label}</div>
);

const Scene1:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const coverEnter=interpolate(frame,[0,12],[0,1],clamp);
  const line=interpolate(frame,[54,116],[0,1],clamp);
  const date=localWindow('scene1','s01',duration,.20,.66);
  const account=localWindow('scene1','s02',duration,.66,1);
  return <Stage accent="#101010" chapter="MITTWOCH · UPDATE">
    <StoryCamera startFrame={34} endFrame={duration-20} fromScale={1} toScale={1.045} fromY={0} toY={-16} style={{position:'absolute',inset:0}}>
      <div style={{position:'absolute',left:70,right:70,top:260,textAlign:'center',opacity:coverEnter,transform:`translateY(${(1-coverEnter)*22}px)`}}>
        <div style={{fontSize:52,fontWeight:950,letterSpacing:'.08em',color:'#667085'}}>JETZT DIREKT VERBUNDEN</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:34,marginTop:34}}>
          <BrandPill label="GROK BOT" dark size={56}/>
          <div style={{fontSize:70,fontWeight:950}}>×</div>
          <BrandPill label="X" size={82}/>
        </div>
        <div style={{fontSize:78,lineHeight:1.02,fontWeight:950,letterSpacing:'-.065em',marginTop:42}}>Dein Bot bekommt<br/>einen direkten X-Zugang.</div>
      </div>
      <div style={{position:'absolute',left:180,right:180,top:790,height:8,borderRadius:999,background:'#D0D5DD',overflow:'hidden'}}>
        <div style={{height:'100%',width:`${line*100}%`,background:'#101010',borderRadius:999}}/>
      </div>
      <StoryBeat startFrame={date.start+12} role="PROOF" direction="up" style={{position:'absolute',left:0,right:0,top:880,textAlign:'center'}}>
        <div style={{fontSize:44,fontWeight:950,letterSpacing:'.04em'}}>29 AUG 2026</div>
        <div style={{fontSize:24,fontWeight:850,color:'#667085',marginTop:8}}>OFFIZIELLE GROK-BOT-ANKÜNDIGUNG</div>
      </StoryBeat>
      <StoryBeat startFrame={account.start+16} role="CHANGE" direction="up" style={{position:'absolute',left:160,right:160,top:1040}}>
        <SourceProofCard source="x.ai" date="29.08.2026" label="Grok Bot now works with X" accent="#101010" startFrame={account.start+16}/>
      </StoryBeat>
    </StoryCamera>
  </Stage>;
};

const Scene2:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const s03=localWindow('scene2','s03',duration,.02,.52);
  const s04=localWindow('scene2','s04',duration,.52,1);
  const create=spring({frame:frame-(s03.start+38),fps,config:{damping:14,stiffness:180,mass:.7}});
  const credits=interpolate(frame,[s04.start+18,s04.end-12],[0,1],clamp);
  return <Stage accent="#5B5BD6" chapter="CONNECTOR SETUP">
    <div style={{position:'absolute',left:88,right:88,top:255}}>
      <div style={{fontSize:72,lineHeight:1.02,fontWeight:950,letterSpacing:'-.055em'}}>Verbinden. Account.<br/>Credits. Fertig.</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 160px 1fr',gap:26,alignItems:'center',marginTop:100}}>
        <StoryBeat startFrame={s03.start} role="CHANGE"><BrandPill label="X ACCOUNT" size={38}/></StoryBeat>
        <div style={{height:8,borderRadius:999,background:'#D0D5DD',overflow:'hidden'}}><div style={{height:'100%',width:`${interpolate(frame,[s03.start+5,s03.start+48],[0,100],clamp)}%`,background:'#5B5BD6'}}/></div>
        <StoryBeat startFrame={s03.start+38} role="CHANGE" direction="left"><div style={{transform:`scale(${.7+.3*create})`}}><BrandPill label="DEV ACCOUNT" size={36}/></div></StoryBeat>
      </div>
      <StoryBeat startFrame={s03.start+70} role="PROOF" direction="up" style={{marginTop:50}}>
        <div style={{padding:'26px 32px',borderRadius:28,background:'#FFFFFF',border:'1px solid rgba(16,24,40,.08)',fontSize:30,fontWeight:900,display:'flex',alignItems:'center',gap:18}}><Check size={34}/><span>Fehlt der Developer-Account, wird laut Ankündigung einer erstellt.</span></div>
      </StoryBeat>
      <StoryBeat startFrame={s04.start+8} role="CHANGE" direction="up" style={{marginTop:52}}>
        <div style={{fontSize:30,fontWeight:900,color:'#475467'}}>FÜR BEZAHLTE GROK-BOT-NUTZER</div>
        <div style={{marginTop:18,padding:'36px 38px',borderRadius:34,background:'linear-gradient(135deg,#EEF4FF,#F4F3FF)',border:'1px solid #D9D6FE'}}>
          <div style={{fontSize:57,fontWeight:950,letterSpacing:'-.045em'}}>X API CREDITS</div>
          <div style={{height:16,background:'#D0D5DD',borderRadius:999,overflow:'hidden',marginTop:26}}><div style={{height:'100%',width:`${credits*100}%`,background:'#5B5BD6',borderRadius:999}}/></div>
          <div style={{fontSize:25,fontWeight:850,marginTop:15,color:'#667085'}}>kostenlos zum Start · Betrag im Reel bewusst nicht erfunden</div>
        </div>
      </StoryBeat>
    </div>
  </Stage>;
};

const FeedRow:React.FC<{index:number;active:number}>=({index,active})=>{
  const widths=[72,54,82,63,76];
  return <div style={{padding:'22px 24px',borderBottom:'1px solid #EAECF0',background:index===active?'#EFF8FF':'rgba(255,255,255,.88)',transition:'none'}}>
    <div style={{display:'flex',alignItems:'center',gap:14}}><div style={{width:42,height:42,borderRadius:999,background:index===active?'#1570EF':'#D0D5DD'}}/><div style={{fontSize:22,fontWeight:900}}>POST {String(index+1).padStart(2,'0')}</div></div>
    <div style={{height:10,width:`${widths[index]}%`,background:'#98A2B3',borderRadius:99,marginTop:15}}/><div style={{height:9,width:`${Math.max(38,widths[index]-18)}%`,background:'#D0D5DD',borderRadius:99,marginTop:10}}/>
  </div>;
};

const Scene3:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const s05=localWindow('scene3','s05',duration,.02,.66);
  const s06=localWindow('scene3','s06',duration,.66,1);
  const scan=progressIn(frame,s05);
  const active=Math.min(4,Math.floor(scan*5));
  const bars=[.34,.48,.42,.72,.58].map((value,i)=>interpolate(frame,[s06.start+10+i*8,s06.start+50+i*8],[0,value],clamp));
  return <Stage accent="#1570EF" chapter="X WIRD ARBEITSFLÄCHE">
    <StoryCamera startFrame={0} endFrame={duration} fromScale={1.02} toScale={1} style={{position:'absolute',inset:0}}>
      <div style={{position:'absolute',left:68,right:68,top:220,bottom:500,borderRadius:42,background:'#FFFFFF',border:'1px solid #D0D5DD',boxShadow:'0 28px 80px rgba(16,24,40,.14)',overflow:'hidden'}}>
        <div style={{height:86,display:'flex',alignItems:'center',gap:18,padding:'0 26px',borderBottom:'1px solid #EAECF0'}}><div style={{fontSize:48,fontWeight:950}}>X</div><div style={{fontSize:25,fontWeight:850,color:'#667085'}}>LIVE WORKSPACE</div></div>
        <div style={{position:'relative'}}>{[0,1,2,3,4].map((i)=><FeedRow key={i} index={i} active={active}/>)}</div>
        <div style={{position:'absolute',left:0,right:0,top:`${90+scan*690}px`,height:4,background:'linear-gradient(90deg,transparent,#1570EF,transparent)',boxShadow:'0 0 18px rgba(21,112,239,.45)'}}/>
      </div>
      <div style={{position:'absolute',left:86,right:86,bottom:385,display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12}}>
        {[
          {label:'SEARCH',Icon:Search,start:s05.start+20},
          {label:'TIMELINE',Icon:FileText,start:s05.start+68},
          {label:'MENTIONS',Icon:AtSign,start:s05.start+122},
          {label:'TRENDS',Icon:TrendingUp,start:s06.start+10},
          {label:'SAVED',Icon:Bookmark,start:s06.start+60},
        ].map(({label,Icon,start})=><StoryBeat key={label} startFrame={start} role="CHANGE" direction="up"><div style={{padding:'18px 10px',borderRadius:24,background:'#FFFFFF',border:'1px solid #D0D5DD',textAlign:'center'}}><Icon size={30}/><div style={{fontSize:18,fontWeight:950,marginTop:8}}>{label}</div></div></StoryBeat>)}
      </div>
      <StoryBeat startFrame={s06.start+22} role="CHANGE" direction="left" style={{position:'absolute',right:92,bottom:560,width:240,height:145,padding:18,borderRadius:28,background:'#101828',color:'#FFFFFF'}}>
        <div style={{fontSize:18,fontWeight:900}}>TREND SIGNAL</div><div style={{display:'flex',alignItems:'end',gap:9,height:80,marginTop:12}}>{bars.map((bar,i)=><div key={i} style={{flex:1,height:`${bar*100}%`,background:i===3?'#53B1FD':'#667085',borderRadius:'8px 8px 2px 2px'}}/>)}</div>
      </StoryBeat>
    </StoryCamera>
  </Stage>;
};

const ComputerPanel:React.FC<{title:string;Icon:React.ComponentType<{size?:number}>;active:boolean;children:React.ReactNode}>=({title,Icon,active,children})=>(
  <div style={{borderRadius:26,background:active?'#FFFFFF':'#F2F4F7',border:`2px solid ${active?'#7F56D9':'#EAECF0'}`,boxShadow:active?'0 20px 46px rgba(127,86,217,.15)':'none',padding:22,minHeight:230,transform:`scale(${active?1.025:1})`}}>
    <div style={{display:'flex',alignItems:'center',gap:12,fontSize:22,fontWeight:950}}><Icon size={30}/>{title}</div><div style={{marginTop:18}}>{children}</div>
  </div>
);

const Scene4:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const s07=localWindow('scene4','s07',duration,.02,.20);
  const s08=localWindow('scene4','s08',duration,.20,.78);
  const s09=localWindow('scene4','s09',duration,.78,1);
  const phase=frame<s08.start+90?0:frame<s08.start+180?1:2;
  const cloud=interpolate(frame,[s07.end-10,s08.start+55],[0,1],clamp);
  return <Stage accent="#7F56D9" chapter="NICHT NUR EIN CHAT">
    <div style={{position:'absolute',left:70,right:70,top:215}}>
      <StoryBeat startFrame={s07.start} role="PROBLEM" direction="up"><div style={{fontSize:68,fontWeight:950,letterSpacing:'-.055em'}}>Aus Chat wird<br/>ein echter Arbeitsrechner.</div></StoryBeat>
      <div style={{marginTop:50,borderRadius:40,background:'linear-gradient(150deg,#F4F3FF,#EEF4FF)',border:'1px solid #D9D6FE',padding:34,boxShadow:'0 28px 78px rgba(16,24,40,.12)',opacity:cloud,transform:`scale(${.95+.05*cloud})`}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><div style={{display:'flex',alignItems:'center',gap:16}}><Cloud size={42}/><div><div style={{fontSize:35,fontWeight:950}}>GROK BOT CLOUD COMPUTER</div><div style={{fontSize:22,fontWeight:800,color:'#667085'}}>PERSISTENT · BROWSER · FILESYSTEM · TERMINAL</div></div></div><div style={{display:'flex',alignItems:'center',gap:9,fontSize:21,fontWeight:900,color:'#039855'}}><span style={{width:12,height:12,borderRadius:99,background:'#12B76A'}}/>ONLINE</div></div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18,marginTop:30}}>
          <ComputerPanel title="BROWSER" Icon={Search} active={phase===0}><div style={{height:14,width:'84%',borderRadius:99,background:'#D0D5DD'}}/><div style={{height:12,width:'62%',borderRadius:99,background:'#EAECF0',marginTop:12}}/></ComputerPanel>
          <ComputerPanel title="FILES" Icon={Folder} active={phase===1}><div style={{fontSize:20,fontWeight:850}}>research/</div><div style={{fontSize:18,color:'#667085',marginTop:10}}>x-daily-brief.md</div><div style={{fontSize:18,color:'#667085',marginTop:8}}>mentions.json</div></ComputerPanel>
          <ComputerPanel title="TERMINAL" Icon={Terminal} active={phase===2}><div style={{fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace',fontSize:17,lineHeight:1.65,color:'#475467'}}>$ collect --x<br/>$ summarize<br/><span style={{color:'#039855'}}>✓ done</span></div></ComputerPanel>
        </div>
      </div>
      <StoryBeat startFrame={s08.start+205} role="PROOF" direction="up" style={{marginTop:28}}><SourceProofCard source="docs.x.ai" date="Aug 2026" label="Persistent cloud computer · browser · filesystem · terminal" accent="#7F56D9" startFrame={s08.start+205}/></StoryBeat>
      <StoryBeat startFrame={s09.start+8} role="CONSEQUENCE" direction="up" style={{marginTop:28}}><div style={{padding:'22px 28px',borderRadius:28,background:'#101828',color:'#FFFFFF',fontSize:27,fontWeight:900,display:'flex',alignItems:'center',gap:18}}><Bot size={34}/><span>X-Daten werden Input für echte Tool-Arbeit.</span></div></StoryBeat>
    </div>
  </Stage>;
};

const Scene5:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const s10=localWindow('scene5','s10',duration,.02,.48);
  const s11=localWindow('scene5','s11',duration,.48,.72);
  const s12=localWindow('scene5','s12',duration,.72,1);
  const loop=progressIn(frame,s10);
  return <Stage accent="#039855" chapter="PAYOFF">
    <div style={{position:'absolute',left:75,right:75,top:235,textAlign:'center'}}>
      <div style={{fontSize:68,fontWeight:950,letterSpacing:'-.055em'}}>Aus Feed wird Routine.</div>
      <div style={{position:'relative',height:650,marginTop:55}}>
        <svg viewBox="0 0 900 620" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}><path d="M170 300 C240 90, 650 90, 730 300 C650 520, 240 520, 170 300" fill="none" stroke="#D0D5DD" strokeWidth="9" strokeLinecap="round"/><path d="M170 300 C240 90, 650 90, 730 300 C650 520, 240 520, 170 300" fill="none" stroke="#12B76A" strokeWidth="9" strokeLinecap="round" pathLength="1" strokeDasharray={`${loop} 1`}/></svg>
        <StoryBeat startFrame={s10.start} role="CHANGE" style={{position:'absolute',left:15,top:235}}><BrandPill label="X" size={70}/></StoryBeat>
        <StoryBeat startFrame={s10.start+35} role="CHANGE" style={{position:'absolute',right:10,top:235}}><BrandPill label="GROK BOT" dark size={38}/></StoryBeat>
        <StoryBeat startFrame={s10.start+75} role="PAYOFF" style={{position:'absolute',left:280,right:280,bottom:10}}><div style={{padding:'25px 16px',borderRadius:28,background:'#ECFDF3',border:'1px solid #ABEFC6'}}><FileText size={36}/><div style={{fontSize:24,fontWeight:950,marginTop:8}}>DAILY BRIEF</div></div></StoryBeat>
        <div style={{position:'absolute',left:260,right:260,top:50,display:'flex',justifyContent:'center',gap:14}}>{['POSTS','MENTIONS','TRENDS'].map((label,i)=><StoryBeat key={label} startFrame={s10.start+18+i*28} role="CHANGE"><div style={{padding:'12px 16px',borderRadius:18,background:'#FFFFFF',border:'1px solid #D0D5DD',fontSize:18,fontWeight:900}}>{label}</div></StoryBeat>)}</div>
      </div>
      <StoryBeat startFrame={s11.start+8} role="CONSEQUENCE" direction="up"><div style={{display:'inline-flex',padding:'18px 26px',borderRadius:20,background:'#FFF6ED',border:'1px solid #FEDF89',fontSize:29,fontWeight:950,color:'#B54708'}}>FIRST VERSION</div></StoryBeat>
      <StoryBeat startFrame={s12.start+8} role="PAYOFF" direction="up" style={{marginTop:30}}><div style={{fontSize:54,fontWeight:950,letterSpacing:'-.045em'}}>X → ARBEITSQUELLE</div><div style={{fontSize:25,fontWeight:850,color:'#667085',marginTop:12}}>Wie zuverlässig das im Alltag ist, muss sich noch zeigen.</div></StoryBeat>
    </div>
  </Stage>;
};

const Caption:React.FC<{cue:GrokXCue|null}>=({cue})=>cue?<div style={REEL_CAPTION_WRAPPER_STYLE}><div style={REEL_CAPTION_GLASS_STYLE}>{cue.text}</div></div>:null;

export const ReelGrokBotXIntegration:React.FC<Props>=({voiceoverSrc,showCaptions=true,showSfx=true})=>{
  const frame=useCurrentFrame();
  const activeCue=GROK_X_CUES.find((cue)=>frame>=cue.startFrame&&frame<cue.endFrame)??null;
  const renderScene=(sceneId:string,duration:number)=>sceneId==='scene1'?<Scene1 duration={duration}/>:sceneId==='scene2'?<Scene2 duration={duration}/>:sceneId==='scene3'?<Scene3 duration={duration}/>:sceneId==='scene4'?<Scene4 duration={duration}/>:<Scene5 duration={duration}/>;
  return <AbsoluteFill style={{background:'#F9FBFE'}}>
    {GROK_X_SCENES.map((scene)=>{const duration=scene.endFrame-scene.startFrame;return <Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={duration} name={scene.title}>{renderScene(scene.sceneId,duration)}</Sequence>;})}
    {showCaptions&&shouldShowReelCaption(frame,31)?<Caption cue={activeCue}/>:null}
    {voiceoverSrc?<Html5Audio src={voiceoverSrc}/>:null}
    <ReelSfxTrack events={GROK_X_SFX} enabled={showSfx}/>
  </AbsoluteFill>;
};
