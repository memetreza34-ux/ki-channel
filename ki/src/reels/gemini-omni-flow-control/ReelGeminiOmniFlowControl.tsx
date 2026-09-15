import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowRight, Check, Clapperboard, Expand, FastForward, Film, Frame, Gauge, MonitorUp, MoveRight, Play, Sparkles, Terminal, WandSparkles} from 'lucide-react';
import {REEL_CAPTION_GLASS_STYLE, REEL_CAPTION_WRAPPER_STYLE} from '../captionSafe';
import {ReelSfxTrack} from '../ReelSfxTrack';
import {SourceProofCard} from '../ReelVisualMotion';
import {ImpactNumber, StoryBeat, StoryCamera, StoryChapterLabel, StoryCutFlash, StoryProgressRail, StoryTexture} from '../StoryMotion';
import {GEMINI_OMNI_CUES, GEMINI_OMNI_SCENES, GEMINI_OMNI_SFX, type GeminiOmniCue} from './contract';

type Props = {voiceoverSrc:string; showCaptions?:boolean; showSfx?:boolean};
type SceneProps = {duration:number; accent:string};
type Window = {start:number; end:number};

const FONT='Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const at=(duration:number,ratio:number)=>Math.max(0,Math.round(duration*ratio));
const between=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
const sceneFor=(sceneId:string)=>GEMINI_OMNI_SCENES.find((scene)=>scene.sceneId===sceneId);
const sentenceWindow=(sceneId:string,sentenceId:string,duration:number,fallbackStartRatio:number,fallbackEndRatio:number):Window=>{
  const scene=sceneFor(sceneId);
  const matches=GEMINI_OMNI_CUES.filter((cue)=>cue.sceneId===sceneId&&cue.sentenceId===sentenceId);
  if(scene&&matches.length){
    const start=Math.min(...matches.map((cue)=>cue.startFrame))-scene.startFrame;
    const end=Math.max(...matches.map((cue)=>cue.endFrame))-scene.startFrame;
    return {start:between(Math.round(start),0,Math.max(0,duration-1)),end:between(Math.round(end),1,duration)};
  }
  return {start:at(duration,fallbackStartRatio),end:at(duration,fallbackEndRatio)};
};
const cueAt=(window:Window,progress:number)=>Math.round(window.start+(window.end-window.start)*between(progress,0,1));

const Ambient:React.FC<{accent:string;seed:number}>=({accent,seed})=>{
  const frame=useCurrentFrame();
  const x=Math.sin((frame+seed*11)*0.014)*38;
  const y=Math.cos((frame+seed*17)*0.011)*28;
  return <AbsoluteFill style={{pointerEvents:'none',overflow:'hidden'}}>
    <div style={{position:'absolute',left:-210+x,top:210+y,width:620,height:620,borderRadius:999,background:`radial-gradient(circle,${accent}18,transparent 70%)`,filter:'blur(10px)'}}/>
    <div style={{position:'absolute',right:-260-x,bottom:270-y,width:700,height:700,borderRadius:999,background:`radial-gradient(circle,${accent}12,transparent 72%)`,filter:'blur(12px)'}}/>
    <div style={{position:'absolute',inset:0,opacity:.18,backgroundImage:'linear-gradient(rgba(16,32,51,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(16,32,51,.08) 1px,transparent 1px)',backgroundSize:'54px 54px',backgroundPosition:`${x*.3}px ${y*.3}px`,maskImage:'linear-gradient(180deg,transparent 4%,black 24%,black 82%,transparent 98%)'}}/>
  </AbsoluteFill>;
};

const Shell:React.FC<React.PropsWithChildren<{accent:string;eyebrow:string;seed:number}>>=({accent,eyebrow,seed,children})=><AbsoluteFill style={{fontFamily:FONT,color:'#102033',background:'linear-gradient(180deg,#FCFEFF 0%,#EEF5FA 100%)',padding:'86px 68px 0',overflow:'hidden'}}>
  <StoryTexture seed={seed} opacity={.075}/><Ambient accent={accent} seed={seed}/>
  <div style={{position:'relative',zIndex:5}}><StoryChapterLabel accent={accent}>{eyebrow}</StoryChapterLabel></div>
  <div style={{position:'relative',zIndex:4,flex:1}}>{children}</div>
</AbsoluteFill>;
const Headline:React.FC<React.PropsWithChildren<{size?:number}>>=({children,size=72})=><div style={{fontSize:size,lineHeight:1.01,fontWeight:950,letterSpacing:'-.045em',marginTop:28,maxWidth:940}}>{children}</div>;
const Card:React.FC<React.PropsWithChildren<{style?:React.CSSProperties}>>=({children,style})=><div style={{background:'rgba(255,255,255,.94)',border:'1px solid rgba(16,32,51,.09)',boxShadow:'0 24px 70px rgba(20,42,70,.12)',borderRadius:32,...style}}>{children}</div>;
const BrandText:React.FC<{small?:boolean}>=({small=false})=><div style={{display:'flex',alignItems:'baseline',gap:16,flexWrap:'wrap'}}>
  <div style={{fontSize:small?48:78,fontWeight:950,letterSpacing:'-.055em'}}>Google</div>
  <div style={{fontSize:small?48:78,fontWeight:950,letterSpacing:'-.055em',background:'linear-gradient(90deg,#4285F4,#A142F4,#EA4335,#FBBC04,#34A853)',WebkitBackgroundClip:'text',color:'transparent'}}>Flow</div>
</div>;
const Tag:React.FC<{text:string;accent:string}>=({text,accent})=><div style={{padding:'9px 14px',borderRadius:18,background:`${accent}14`,border:`1px solid ${accent}28`,color:accent,fontSize:20,fontWeight:950,letterSpacing:'.035em'}}>{text}</div>;

const Scene1:React.FC<SceneProps>=({duration,accent})=>{
  const s01=sentenceWindow('scene1','s01',duration,0,.5);const s02=sentenceWindow('scene1','s02',duration,.5,1);
  const brandAt=cueAt(s01,.08), upgradeAt=cueAt(s01,.44), modelAt=cueAt(s02,.12), gaAt=cueAt(s02,.40), controlsAt=cueAt(s02,.62), proofAt=cueAt(s02,.82);
  const controls=['START','ENDE','LÄNGE','AUFLÖSUNG'];
  return <Shell accent={accent} eyebrow="KAPITEL 1 • FLOW UPGRADE" seed={7}>
    <StoryBeat startFrame={brandAt} role="HOOK"><Headline>Google gibt Flow mehr Kontrolle.</Headline></StoryBeat>
    <div style={{position:'relative',height:1160,marginTop:18}}>
      <StoryBeat startFrame={brandAt} direction="left" role="HOOK" style={{position:'absolute',left:8,top:72}}><BrandText/></StoryBeat>
      <StoryBeat startFrame={upgradeAt} direction="up" role="CHANGE" style={{position:'absolute',left:8,top:190}}><div style={{display:'flex',gap:10}}><Tag text="VIDEO CONTROL" accent={accent}/><Tag text="27 AUG 2026" accent="#7A5AF8"/></div></StoryBeat>
      <StoryCamera startFrame={modelAt-3} endFrame={modelAt+38} fromScale={.92} toScale={1.06} origin="50% 50%">
        <StoryBeat startFrame={modelAt} direction="down" role="CHANGE" style={{position:'absolute',left:70,right:70,top:360}}>
          <Card style={{padding:34,background:'linear-gradient(135deg,rgba(255,255,255,.96),rgba(242,246,255,.95))'}}>
            <div style={{fontSize:22,fontWeight:900,opacity:.45}}>PRODUCTION MODEL</div>
            <div style={{fontSize:54,fontWeight:950,letterSpacing:'-.04em',marginTop:10}}>Gemini Omni 1.1 Flash</div>
            <div style={{display:'flex',gap:12,marginTop:20}}><Tag text="GA" accent="#34A853"/><Tag text="VIDEO GENERATION + EDITING" accent="#4285F4"/></div>
          </Card>
        </StoryBeat>
      </StoryCamera>
      <StoryBeat startFrame={gaAt} role="PROOF" style={{position:'absolute',right:26,top:316}}><div style={{width:94,height:94,borderRadius:99,display:'grid',placeItems:'center',background:'#ECFDF3',border:'3px solid #34A853',color:'#34A853'}}><Check size={48}/></div></StoryBeat>
      <div style={{position:'absolute',left:20,right:20,top:700,display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>{controls.map((label,index)=><StoryBeat key={label} startFrame={controlsAt+index*8} direction={index%2===0?'left':'right'} role="CONSEQUENCE"><div style={{height:118,borderRadius:28,background:'rgba(255,255,255,.91)',border:'1px solid rgba(16,32,51,.08)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 26px',fontSize:27,fontWeight:950}}><span>{label}</span><div style={{width:46,height:46,borderRadius:16,background:`${accent}14`,display:'grid',placeItems:'center',color:accent}}>{index===0?<Play size={27}/>:index===1?<Frame size={27}/>:index===2?<FastForward size={27}/>:<Expand size={27}/>}</div></div></StoryBeat>)}</div>
      <StoryBeat startFrame={proofAt} direction="up" role="PROOF" style={{position:'absolute',left:120,right:120,top:985}}><SourceProofCard source="blog.google" date="27.08.2026" label="New creative controls in Google Flow" accent={accent} startFrame={proofAt}/></StoryBeat>
    </div><StoryCutFlash atFrame={Math.max(0,duration-10)} accent="#EEF5FF" durationFrames={7}/>
  </Shell>;
};

const Scene2:React.FC<SceneProps>=({duration,accent})=>{
  const frame=useCurrentFrame(); const s03=sentenceWindow('scene2','s03',duration,0,.4); const s04=sentenceWindow('scene2','s04',duration,.4,1);
  const startAt=cueAt(s03,.18),endAt=cueAt(s03,.68),moveAt=cueAt(s04,.12),middleAt=cueAt(s04,.42),payoffAt=cueAt(s04,.76);
  const progress=interpolate(frame,[moveAt,payoffAt],[0,1],clamp);
  const x=interpolate(progress,[0,1],[145,790],clamp);
  return <Shell accent={accent} eyebrow="KAPITEL 2 • START → ENDE" seed={13}>
    <StoryBeat startFrame={s03.start+1} role="CHANGE"><Headline>Du bestimmst Anfang und Ende.</Headline></StoryBeat>
    <div style={{position:'relative',height:1180,marginTop:10}}>
      <StoryBeat startFrame={startAt} direction="left" role="CHANGE" style={{position:'absolute',left:-18,top:115,width:430,height:720}}><div style={{height:'100%',borderRadius:48,background:'linear-gradient(160deg,#D7F0FF,#7AA7FF 55%,#284C8B)',boxShadow:'0 30px 90px rgba(39,83,148,.22)',overflow:'hidden',position:'relative'}}><div style={{position:'absolute',left:36,top:36}}><Tag text="START FRAME" accent="#175CD3"/></div><div style={{position:'absolute',left:50,right:50,bottom:60,fontSize:42,fontWeight:950,color:'white'}}>SZENE A</div></div></StoryBeat>
      <StoryBeat startFrame={endAt} direction="right" role="CHANGE" style={{position:'absolute',right:-18,top:115,width:430,height:720}}><div style={{height:'100%',borderRadius:48,background:'linear-gradient(160deg,#FFE8D6,#D675FF 52%,#5B2B83)',boxShadow:'0 30px 90px rgba(91,43,131,.20)',overflow:'hidden',position:'relative'}}><div style={{position:'absolute',right:36,top:36}}><Tag text="END FRAME" accent="#9E2FBC"/></div><div style={{position:'absolute',left:50,right:50,bottom:60,fontSize:42,fontWeight:950,color:'white',textAlign:'right'}}>SZENE B</div></div></StoryBeat>
      <StoryBeat startFrame={moveAt} role="PROOF" style={{position:'absolute',left:0,right:0,top:445,height:150}}><div style={{position:'relative',height:150}}><div style={{position:'absolute',left:175,right:175,top:72,height:8,borderRadius:99,background:'linear-gradient(90deg,#4285F4,#A142F4,#EA4335)'}}/><div style={{position:'absolute',left:x,top:44,width:64,height:64,borderRadius:99,background:'#fff',border:`5px solid ${accent}`,boxShadow:`0 0 0 12px ${accent}18,0 12px 28px rgba(16,32,51,.18)`,display:'grid',placeItems:'center',color:accent}}><MoveRight size={32}/></div></div></StoryBeat>
      <StoryBeat startFrame={middleAt} direction="up" role="CHANGE" style={{position:'absolute',left:258,right:258,top:840}}><div style={{display:'flex',justifyContent:'center',gap:12}}>{[0,1,2,3].map((n)=><div key={n} style={{width:104,height:72,borderRadius:16,background:`linear-gradient(135deg,rgba(66,133,244,${.16+n*.06}),rgba(161,66,244,${.12+n*.06}))`,border:'1px solid rgba(16,32,51,.08)',transform:`translateY(${Math.sin((frame+n*6)*.05)*8}px)`}}/>)}</div></StoryBeat>
      <StoryBeat startFrame={payoffAt} direction="up" role="PAYOFF" style={{position:'absolute',left:100,right:100,top:1000,textAlign:'center'}}><div style={{fontSize:38,fontWeight:950}}>MEHR KONTROLLE ÜBER DEN ÜBERGANG</div><div style={{fontSize:23,opacity:.5,marginTop:8,fontWeight:850}}>Start + Ende statt nur „mach daraus ein Video“</div></StoryBeat>
    </div>
  </Shell>;
};

const Scene3:React.FC<SceneProps>=({duration,accent})=>{
  const frame=useCurrentFrame(); const s05=sentenceWindow('scene3','s05',duration,0,.38); const s06=sentenceWindow('scene3','s06',duration,.38,1);
  const stripAt=cueAt(s05,.08),edgeAt=cueAt(s05,.55),extendAt=cueAt(s06,.16),growAt=cueAt(s06,.38),measureAt=cueAt(s06,.78);
  const extend=interpolate(frame,[extendAt,measureAt],[0,1],clamp);
  return <Shell accent={accent} eyebrow="KAPITEL 3 • EXTEND" seed={21}>
    <StoryBeat startFrame={s05.start+1} role="CHANGE"><Headline>Der Clip kann einfach weiterlaufen.</Headline></StoryBeat>
    <div style={{position:'relative',height:1180,marginTop:8}}>
      <StoryBeat startFrame={stripAt} role="PROOF" style={{position:'absolute',left:-34,right:-34,top:170}}><div style={{height:390,borderRadius:38,background:'#111827',padding:'34px 32px',boxShadow:'0 34px 96px rgba(17,24,39,.25)',overflow:'hidden'}}><div style={{display:'flex',gap:14,height:260}}>{Array.from({length:8}).map((_,i)=><div key={i} style={{minWidth:140,borderRadius:20,background:`linear-gradient(150deg,hsl(${205+i*8} 76% 72%),hsl(${240+i*7} 58% 42%))`,position:'relative',overflow:'hidden'}}><div style={{position:'absolute',left:12,bottom:10,color:'white',fontSize:18,fontWeight:900}}>F{i+1}</div></div>)}</div><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:22,color:'white'}}><div style={{fontSize:22,fontWeight:900,opacity:.62}}>ORIGINAL CLIP</div><div style={{display:'flex',alignItems:'center',gap:8,color:'#FDA29B',fontSize:22,fontWeight:950}}>END <ArrowRight size={25}/></div></div></div></StoryBeat>
      <StoryBeat startFrame={edgeAt} role="CHANGE" style={{position:'absolute',right:22,top:290}}><div style={{width:18,height:240,borderRadius:99,background:accent,boxShadow:`0 0 28px ${accent}`}}/></StoryBeat>
      <StoryBeat startFrame={extendAt} direction="right" role="CHANGE" style={{position:'absolute',left:95,right:95,top:640}}><div style={{height:210,borderRadius:34,background:'rgba(255,255,255,.94)',border:`2px solid ${accent}30`,position:'relative',overflow:'hidden'}}><div style={{position:'absolute',left:32,top:28,display:'flex',alignItems:'center',gap:12,fontSize:26,fontWeight:950,color:accent}}><FastForward size={36}/> EXTEND</div><div style={{position:'absolute',left:34,right:34,bottom:45,height:20,borderRadius:99,background:'#F2F4F7'}}><div style={{height:'100%',width:`${extend*100}%`,borderRadius:99,background:`linear-gradient(90deg,${accent},#F97066)`,boxShadow:`0 0 22px ${accent}55`}}/></div></div></StoryBeat>
      <StoryBeat startFrame={growAt} role="CONSEQUENCE" style={{position:'absolute',left:140,right:140,top:885}}><div style={{display:'flex',gap:10,justifyContent:'center'}}>{Array.from({length:6}).map((_,i)=>{const p=between(extend*6-i,0,1);return <div key={i} style={{width:94,height:118,borderRadius:18,background:`linear-gradient(160deg,rgba(234,67,53,${.18+.35*p}),rgba(161,66,244,${.18+.3*p}))`,opacity:.35+.65*p,transform:`scale(${.7+.3*p})`}}/>;})}</div></StoryBeat>
      <StoryBeat startFrame={measureAt} direction="up" role="PAYOFF" style={{position:'absolute',left:80,right:80,top:1050,textAlign:'center'}}><div style={{fontSize:34,fontWeight:950}}>KURZER SHOT → LÄNGERE SZENE</div></StoryBeat>
    </div><StoryCutFlash atFrame={Math.max(0,duration-9)} accent="#FFF1F0" durationFrames={6}/>
  </Shell>;
};

const Scene4:React.FC<SceneProps>=({duration,accent})=>{
  const s07=sentenceWindow('scene4','s07',duration,0,.62); const s08=sentenceWindow('scene4','s08',duration,.62,1);
  const a360=cueAt(s07,.12),a720=cueAt(s07,.25),a1080=cueAt(s07,.39),a4k=cueAt(s07,.52),upscaleAt=cueAt(s07,.76),workflowAt=cueAt(s08,.20),payoffAt=cueAt(s08,.72);
  const boxes=[{label:'360p',w:310,h:180,at:a360,tag:'DRAFT',c:'#667085'},{label:'720p',w:420,h:240,at:a720,tag:'DEFAULT',c:'#4285F4'},{label:'1080p',w:560,h:315,at:a1080,tag:'UPSCALED',c:'#A142F4'},{label:'4K',w:760,h:430,at:a4k,tag:'UPSCALED',c:'#EA4335'}];
  return <Shell accent={accent} eyebrow="KAPITEL 4 • AUFLÖSUNG" seed={28}>
    <StoryBeat startFrame={s07.start+1} role="CHANGE"><Headline>Von schnellem Entwurf bis 4K.</Headline></StoryBeat>
    <div style={{position:'relative',height:1180,marginTop:6}}>
      {boxes.map((box,index)=><StoryBeat key={box.label} startFrame={box.at} direction="up" role={index===3?'PAYOFF':'CHANGE'} style={{position:'absolute',left:70+index*24,top:80+index*138,width:box.w,height:box.h,zIndex:index+1}}><div style={{height:'100%',borderRadius:30,background:'rgba(255,255,255,.96)',border:`3px solid ${box.c}55`,boxShadow:'0 20px 60px rgba(16,32,51,.11)',padding:26,display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}><div><div style={{fontSize:index===3?86:58,fontWeight:950,letterSpacing:'-.06em',color:box.c}}>{box.label}</div><div style={{fontSize:19,fontWeight:950,opacity:.5,marginTop:5}}>{box.tag}</div></div>{index===3?<MonitorUp size={58} color={box.c}/>:<Gauge size={38} color={box.c}/>}</div></StoryBeat>)}
      <StoryBeat startFrame={upscaleAt} direction="right" role="PROOF" style={{position:'absolute',right:30,top:720}}><Tag text="1080p + 4K = UPSCALED" accent="#EA4335"/></StoryBeat>
      <StoryBeat startFrame={workflowAt} direction="up" role="CONSEQUENCE" style={{position:'absolute',left:80,right:80,top:860}}><Card style={{padding:28}}><div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:20}}><div style={{textAlign:'center'}}><div style={{fontSize:52,fontWeight:950,color:'#667085'}}>360p</div><div style={{fontSize:20,fontWeight:900,opacity:.45}}>SCHNELL TESTEN</div></div><ArrowRight size={48} color={accent}/><div style={{textAlign:'center'}}><div style={{fontSize:52,fontWeight:950,color:'#EA4335'}}>BESTE VERSION</div><div style={{fontSize:20,fontWeight:900,opacity:.45}}>GRÖSSER AUSGEBEN</div></div></div></Card></StoryBeat>
      <StoryBeat startFrame={payoffAt} direction="up" role="PAYOFF" style={{position:'absolute',left:110,right:110,top:1080,textAlign:'center'}}><div style={{fontSize:30,fontWeight:950}}>ERST ITERIEREN. DANN QUALITÄT HOCH.</div></StoryBeat>
    </div>
  </Shell>;
};

const Scene5:React.FC<SceneProps>=({duration,accent})=>{
  const frame=useCurrentFrame(); const s09=sentenceWindow('scene5','s09',duration,0,.55); const s10=sentenceWindow('scene5','s10',duration,.55,1);
  const modelAt=cueAt(s09,.20),gaAt=cueAt(s09,.42),timelineAt=cueAt(s09,.58),dateAt=cueAt(s09,.80),proofAt=cueAt(s09,.90),controlsAt=cueAt(s10,.34),payoffAt=cueAt(s10,.72);
  const progress=interpolate(frame,[timelineAt,dateAt],[0,1],clamp);
  const controls=[['ANFANG','#4285F4'],['ENDE','#A142F4'],['LÄNGE','#EA4335'],['AUFLÖSUNG','#34A853']];
  return <Shell accent={accent} eyebrow="KAPITEL 5 • FÜR ENTWICKLER" seed={36}>
    <StoryBeat startFrame={s09.start+1} role="PROOF"><Headline>Stable ist da. Preview läuft aus.</Headline></StoryBeat>
    <div style={{position:'relative',height:1180,marginTop:8}}>
      <StoryBeat startFrame={modelAt} direction="left" role="PROOF" style={{position:'absolute',left:0,right:0,top:75}}><div style={{borderRadius:32,background:'#101828',padding:'30px 34px',boxShadow:'0 26px 80px rgba(16,24,40,.22)',color:'white'}}><div style={{display:'flex',alignItems:'center',gap:12,fontSize:20,fontWeight:850,opacity:.58}}><Terminal size={25}/> MODEL ID</div><div style={{fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace',fontSize:42,fontWeight:850,marginTop:18,color:'#D1FADF'}}>gemini-omni-1.1-flash</div><div style={{display:'flex',gap:10,marginTop:22}}><Tag text="STABLE" accent="#34A853"/><Tag text="GA" accent="#34A853"/></div></div></StoryBeat>
      <StoryBeat startFrame={gaAt} role="CHANGE" style={{position:'absolute',right:22,top:235}}><div style={{width:84,height:84,borderRadius:99,display:'grid',placeItems:'center',background:'#ECFDF3',color:'#34A853',border:'3px solid #34A853'}}><Check size={44}/></div></StoryBeat>
      <StoryBeat startFrame={timelineAt} direction="up" role="CHANGE" style={{position:'absolute',left:80,right:80,top:470}}><Card style={{padding:30}}><div style={{display:'flex',justifyContent:'space-between',fontSize:22,fontWeight:950}}><span>omni-flash-preview</span><span style={{color:'#EA4335'}}>30 SEP 2026</span></div><div style={{marginTop:24}}><StoryProgressRail progress={progress} accent="#EA4335" height={18}/></div><div style={{display:'flex',justifyContent:'space-between',marginTop:11,fontSize:18,fontWeight:850,opacity:.5}}><span>PREVIEW</span><span>SHUTDOWN</span></div></Card></StoryBeat>
      <StoryBeat startFrame={dateAt} direction="right" role="CONSEQUENCE" style={{position:'absolute',right:82,top:630}}><ImpactNumber value="30. SEP" label="PREVIEW ENDE" accent="#EA4335" startFrame={dateAt} size={82}/></StoryBeat>
      <StoryBeat startFrame={proofAt} direction="up" role="PROOF" style={{position:'absolute',left:120,right:120,top:800}}><SourceProofCard source="ai.google.dev" date="27.08.2026" label="Gemini Omni Flash — stable model" accent={accent} startFrame={proofAt}/></StoryBeat>
      <div style={{position:'absolute',left:24,right:24,top:960,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>{controls.map(([label,c],i)=><StoryBeat key={label} startFrame={controlsAt+i*6} direction="up" role="PAYOFF"><div style={{height:122,borderRadius:24,background:'rgba(255,255,255,.94)',border:`2px solid ${c}35`,display:'grid',placeItems:'center',textAlign:'center'}}><div style={{fontSize:20,fontWeight:950,color:c}}>{label}</div></div></StoryBeat>)}</div>
      <StoryBeat startFrame={payoffAt} direction="up" role="PAYOFF" style={{position:'absolute',left:50,right:50,top:1110,textAlign:'center'}}><div style={{fontSize:34,fontWeight:950}}>MEHR KONTROLLE ÜBER EINEN KI-CLIP.</div></StoryBeat>
    </div>
  </Shell>;
};

const sceneComponents=[Scene1,Scene2,Scene3,Scene4,Scene5];
const splitCaption=(cue:GeminiOmniCue,frame:number)=>{const words=cue.text.trim().split(/\s+/).filter(Boolean);if(words.length<=6)return cue.text;const groups:string[][]=[];for(let i=0;i<words.length;i+=6)groups.push(words.slice(i,i+6));const progress=between((frame-cue.startFrame)/Math.max(1,cue.endFrame-cue.startFrame),0,.999999);return groups[Math.min(groups.length-1,Math.floor(progress*groups.length))].join(' ');};
const CaptionLayer:React.FC=()=>{const frame=useCurrentFrame();const cue=GEMINI_OMNI_CUES.find((item)=>frame>=item.startFrame&&frame<item.endFrame);if(!cue)return null;return <div style={{...REEL_CAPTION_WRAPPER_STYLE,zIndex:90}}><div style={{...REEL_CAPTION_GLASS_STYLE,fontFamily:FONT}}>{splitCaption(cue,frame)}</div></div>;};

export const ReelGeminiOmniFlowControl:React.FC<Props>=({voiceoverSrc,showCaptions=true,showSfx=true})=><AbsoluteFill style={{background:'#EEF5FA'}}>
  <Html5Audio src={voiceoverSrc}/>
  {GEMINI_OMNI_SCENES.map((scene,index)=>{const Scene=sceneComponents[index];if(!Scene)return null;return <Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame-scene.startFrame} name={scene.title}><Scene duration={scene.endFrame-scene.startFrame} accent={scene.accent}/></Sequence>;})}
  <ReelSfxTrack events={GEMINI_OMNI_SFX} enabled={showSfx}/>
  {showCaptions?<CaptionLayer/>:null}
</AbsoluteFill>;
