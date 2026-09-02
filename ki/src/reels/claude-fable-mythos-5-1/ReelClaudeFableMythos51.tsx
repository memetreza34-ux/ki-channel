import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Cloud, Code2, Database, LockKeyhole, ShieldCheck} from 'lucide-react';
import {REEL_CAPTION_GLASS_STYLE, REEL_CAPTION_WRAPPER_STYLE, shouldShowReelCaption} from '../captionSafe';
import {ReelSfxTrack} from '../ReelSfxTrack';
import {SourceProofCard} from '../ReelVisualMotion';
import {StoryBeat, StoryCamera, StoryChapterLabel, StoryTexture} from '../StoryMotion';
import {CLAUDE_51_CUES, CLAUDE_51_SCENES, CLAUDE_51_SFX} from './contract';

type Props={voiceoverSrc:string;showCaptions?:boolean;showSfx?:boolean};
type Window={start:number;end:number};
const FONT='Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const ANTHROPIC='#D97757';
const INK='#181614';

const sceneFor=(sceneId:string)=>CLAUDE_51_SCENES.find((scene)=>scene.sceneId===sceneId);
const sentenceWindow=(sceneId:string,sentenceId:string,duration:number,fallbackStart:number,fallbackEnd:number):Window=>{
  const scene=sceneFor(sceneId);
  const matches=CLAUDE_51_CUES.filter((cue)=>cue.sceneId===sceneId&&cue.sentenceId===sentenceId);
  if(scene&&matches.length){
    return {start:Math.max(0,Math.min(...matches.map((cue)=>cue.startFrame))-scene.startFrame),end:Math.min(duration,Math.max(...matches.map((cue)=>cue.endFrame))-scene.startFrame)};
  }
  return {start:Math.round(duration*fallbackStart),end:Math.round(duration*fallbackEnd)};
};
const progressIn=(frame:number,w:Window)=>interpolate(frame,[w.start,Math.max(w.start+1,w.end)],[0,1],clamp);

const Stage:React.FC<React.PropsWithChildren<{accent:string;chapter:string;dark?:boolean}>>=({accent,chapter,dark=false,children})=>(
  <AbsoluteFill style={{background:dark?'linear-gradient(180deg,#151311 0%,#211B18 100%)':'linear-gradient(180deg,#FBF9F5 0%,#F2EDE6 100%)',color:dark?'#FFFFFF':INK,fontFamily:FONT,overflow:'hidden'}}>
    <StoryTexture color="#FFFFFF" opacity={dark?0.08:0.16}/>
    <div style={{position:'absolute',left:62,top:58,zIndex:50}}><StoryChapterLabel accent={accent}>{chapter}</StoryChapterLabel></div>
    {children}
  </AbsoluteFill>
);

const BrandText:React.FC<{children:React.ReactNode;size?:number;inverse?:boolean}>=({children,size=48,inverse=false})=>(
  <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',padding:'18px 28px',borderRadius:28,background:inverse?INK:'#FFFFFF',color:inverse?'#FFFFFF':INK,border:`1px solid ${inverse?'rgba(255,255,255,.16)':'rgba(24,22,20,.10)'}`,boxShadow:'0 18px 50px rgba(24,22,20,.10)',fontSize:size,fontWeight:950,letterSpacing:'-.045em'}}>{children}</div>
);

const CoreOrb:React.FC<{scale:number;label?:string}>=({scale,label='SHARED MODEL CORE'})=>(
  <div style={{width:260,height:260,borderRadius:999,background:`radial-gradient(circle at 35% 30%,#FFD7C7 0%,${ANTHROPIC} 34%,#8D3E27 100%)`,boxShadow:'0 30px 90px rgba(217,119,87,.34)',transform:`scale(${scale})`,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:28,color:'#FFFFFF',fontWeight:950,fontSize:26,letterSpacing:'.04em'}}>{label}</div>
);

const Scene1:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const s01=sentenceWindow('scene1','s01',duration,.02,.50);
  const s02=sentenceWindow('scene1','s02',duration,.50,1);
  const enter=spring({frame,fps,config:{damping:16,stiffness:180,mass:.72}});
  const split=progressIn(frame,s01);
  const core=progressIn(frame,s02);
  return <Stage accent={ANTHROPIC} chapter="DONNERSTAG · CLAUDE 5.1">
    <StoryCamera startFrame={34} endFrame={duration-12} fromScale={1} toScale={1.035} fromY={0} toY={-12} style={{position:'absolute',inset:0}}>
      <div style={{position:'absolute',left:64,right:64,top:220,textAlign:'center',transform:`translateY(${(1-enter)*20}px)`,opacity:enter}}>
        <div style={{fontSize:30,fontWeight:900,letterSpacing:'.14em',color:'#7A6F68'}}>ANTHROPIC · NEW</div>
        <div style={{fontSize:102,lineHeight:.93,fontWeight:950,letterSpacing:'-.075em',marginTop:22}}>CLAUDE 5.1</div>
        <div style={{fontSize:39,fontWeight:900,marginTop:22,color:'#5D514A'}}>ZWEI NAMEN · EIN MODELLKERN</div>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:24,marginTop:64}}>
          <div style={{transform:`translateX(${(1-split)*80}px)`}}><BrandText size={47}>FABLE 5.1</BrandText></div>
          <div style={{fontSize:44,fontWeight:950,color:ANTHROPIC}}>+</div>
          <div style={{transform:`translateX(${-(1-split)*80}px)`}}><BrandText size={47} inverse>MYTHOS 5.1</BrandText></div>
        </div>
      </div>
      <StoryBeat startFrame={s02.start+8} role="PROOF" direction="up" style={{position:'absolute',left:0,right:0,top:860,display:'flex',justifyContent:'center'}}>
        <CoreOrb scale={.7+.3*core}/>
      </StoryBeat>
      <StoryBeat startFrame={s02.start+38} role="PROOF" direction="up" style={{position:'absolute',left:150,right:150,top:1190}}>
        <SourceProofCard source="anthropic.com" date="01.09.2026" label="Fable 5.1 + Mythos 5.1" accent={ANTHROPIC} startFrame={s02.start+38}/>
      </StoryBeat>
      <div style={{position:'absolute',left:124,right:124,bottom:510,textAlign:'center',fontSize:23,fontWeight:850,color:'#7A6F68'}}>OFFICIAL BRAND / PRODUCT CROPS ARE RESOLVED LOCALLY BEFORE PRODUCTION</div>
    </StoryCamera>
  </Stage>;
};

const AccessChip:React.FC<{label:string;delay:number}>=({label,delay})=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const p=spring({frame:frame-delay,fps,config:{damping:18,stiffness:210}});
  return <div style={{opacity:p,transform:`translateY(${(1-p)*18}px) scale(${.93+.07*p})`,padding:'20px 18px',borderRadius:22,background:'#FFFFFF',border:'1px solid #D8D0C8',textAlign:'center',fontSize:23,fontWeight:950,boxShadow:'0 12px 34px rgba(24,22,20,.08)'}}>{label}</div>;
};

const Scene2:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const s03=sentenceWindow('scene2','s03',duration,.02,.34);
  const s04=sentenceWindow('scene2','s04',duration,.34,1);
  const route=progressIn(frame,s04);
  return <Stage accent="#7A5AF8" chapter="FABLE · BREIT VERFÜGBAR">
    <div style={{position:'absolute',left:74,right:74,top:215}}>
      <div style={{fontSize:72,lineHeight:.98,fontWeight:950,letterSpacing:'-.06em'}}>Wer bekommt<br/>Fable 5.1?</div>
      <StoryBeat startFrame={s03.start+18} role="PROOF" direction="up" style={{marginTop:58}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
          <AccessChip label="PRO" delay={s03.start+20}/><AccessChip label="MAX" delay={s03.start+35}/><AccessChip label="TEAM" delay={s03.start+50}/><AccessChip label="ENTERPRISE" delay={s03.start+65}/>
        </div>
      </StoryBeat>
      <StoryBeat startFrame={s04.start+18} role="PROOF" direction="up" style={{marginTop:48}}>
        <div style={{height:390,borderRadius:38,background:'#FFFFFF',border:'1px solid #D8D0C8',boxShadow:'0 24px 70px rgba(24,22,20,.10)',padding:32,position:'relative',overflow:'hidden'}}>
          <div style={{fontSize:25,fontWeight:950,color:'#7A5AF8'}}>OFFICIAL FABLE PRODUCT MOMENT</div>
          <div style={{fontSize:52,fontWeight:950,letterSpacing:'-.045em',marginTop:12}}>CLAUDE FABLE 5.1</div>
          <div style={{fontSize:24,fontWeight:800,color:'#6B625C',marginTop:9}}>Product/UI crop replaces this native proof frame after local provenance resolution.</div>
          <div style={{position:'absolute',left:42,right:42,bottom:54,height:9,borderRadius:999,background:'#E4DDD5'}}><div style={{height:'100%',width:`${route*100}%`,borderRadius:999,background:'#7A5AF8'}}/></div>
        </div>
      </StoryBeat>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginTop:36}}>
        {[{label:'CLAUDE API',Icon:Code2},{label:'AWS',Icon:Cloud},{label:'GOOGLE CLOUD',Icon:Cloud},{label:'MS FOUNDRY',Icon:Database}].map(({label,Icon},i)=><StoryBeat key={label} startFrame={s04.start+70+i*32} role="CHANGE" direction="up"><div style={{padding:'22px 12px',borderRadius:24,background:'#FFFFFF',border:'1px solid #D8D0C8',textAlign:'center'}}><Icon size={30}/><div style={{fontSize:18,fontWeight:950,marginTop:9}}>{label}</div></div></StoryBeat>)}
      </div>
    </div>
  </Stage>;
};

const Scene3:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const s05=sentenceWindow('scene3','s05',duration,.02,.46);
  const s06=sentenceWindow('scene3','s06',duration,.46,1);
  const gate=progressIn(frame,s05);
  const scan=progressIn(frame,s06);
  return <Stage accent="#B54708" chapter="MYTHOS · TRUSTED ACCESS" dark>
    <StoryCamera startFrame={0} endFrame={duration} fromScale={1.025} toScale={1} style={{position:'absolute',inset:0}}>
      <div style={{position:'absolute',left:70,right:70,top:205,textAlign:'center'}}>
        <div style={{fontSize:86,fontWeight:950,letterSpacing:'-.065em'}}>MYTHOS 5.1</div>
        <div style={{fontSize:31,fontWeight:900,color:'#F2B8A0',marginTop:16}}>NICHT FÜR JEDEN FREIGESCHALTET</div>
      </div>
      <div style={{position:'absolute',left:120,right:120,top:485,height:430,borderRadius:46,border:'2px solid rgba(255,255,255,.18)',background:'rgba(255,255,255,.06)',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}><BrandText inverse size={54}>TRUSTED ACCESS</BrandText></div>
        <div style={{position:'absolute',left:0,right:0,top:0,height:`${(1-gate)*100}%`,background:'#312823',borderBottom:'2px solid #B54708'}}/>
        <LockKeyhole size={58} style={{position:'absolute',right:34,top:34,color:'#FEC84B'}}/>
      </div>
      <StoryBeat startFrame={s05.start+80} role="PROOF" direction="up" style={{position:'absolute',left:120,right:120,top:960}}>
        <SourceProofCard source="anthropic.com/claude/mythos" date="01.09.2026" label="Vetted organizations · Trusted Access" accent="#B54708" startFrame={s05.start+80}/>
      </StoryBeat>
      <StoryBeat startFrame={s06.start+8} role="CHANGE" direction="up" style={{position:'absolute',left:86,right:86,top:1190}}>
        <div style={{fontSize:58,fontWeight:950,letterSpacing:'-.05em'}}>WARUM?</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginTop:26}}>
          {[{label:'CYBERSECURITY',p:.38},{label:'BIOLOGIE',p:.68}].map(({label,p})=><div key={label} style={{position:'relative',height:220,borderRadius:32,background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.16)',overflow:'hidden',padding:26}}><div style={{fontSize:25,fontWeight:950}}>{label}</div><div style={{position:'absolute',left:0,right:0,top:`${interpolate(scan,[p-.15,p],[100,0],clamp)}%`,height:4,background:'#F7906A',boxShadow:'0 0 24px #F7906A'}}/><ShieldCheck size={64} style={{position:'absolute',right:24,bottom:24,color:'#FEC84B'}}/></div>)}
        </div>
      </StoryBeat>
    </StoryCamera>
  </Stage>;
};

const Lane:React.FC<{label:string;accent:string;open:boolean;filter:number}>=({label,accent,open,filter})=>(
  <div style={{flex:1,borderRadius:36,background:'#FFFFFF',border:`2px solid ${accent}`,padding:30,minHeight:480,position:'relative',overflow:'hidden',boxShadow:'0 20px 60px rgba(24,22,20,.10)'}}>
    <div style={{fontSize:42,fontWeight:950,letterSpacing:'-.04em'}}>{label}</div>
    <div style={{fontSize:22,fontWeight:850,color:'#6B625C',marginTop:8}}>{open?'TRUSTED ACCESS':'GENERAL ACCESS + SAFEGUARDS'}</div>
    <div style={{height:12,borderRadius:999,background:'#E4DDD5',marginTop:42,overflow:'hidden'}}><div style={{height:'100%',width:`${filter*100}%`,background:accent,borderRadius:999}}/></div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginTop:34}}>{['CYBER','BIO','CHEM','GENERAL'].map((x,i)=><div key={x} style={{padding:'18px 10px',borderRadius:18,textAlign:'center',background:i<3&&!open?'#FEE4E2':'#ECFDF3',color:i<3&&!open?'#B42318':'#027A48',fontSize:18,fontWeight:950}}>{i<3&&!open?'LIMITED':'OPEN'} · {x}</div>)}</div>
  </div>
);

const Scene4:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const s07=sentenceWindow('scene4','s07',duration,.02,.48);
  const s08=sentenceWindow('scene4','s08',duration,.48,1);
  const filter=progressIn(frame,s07);
  const pIn=interpolate(frame,[s08.start+35,s08.start+105],[0,1],clamp);
  const pOut=interpolate(frame,[s08.start+120,s08.end-15],[0,1],clamp);
  return <Stage accent="#D92D20" chapter="GLEICHER KERN · ANDERE GRENZEN">
    <div style={{position:'absolute',left:68,right:68,top:205}}>
      <div style={{display:'flex',justifyContent:'center'}}><CoreOrb scale={.72} label="SAME CORE"/></div>
      <div style={{display:'flex',gap:24,marginTop:36}}><Lane label="FABLE 5.1" accent="#7A5AF8" open={false} filter={filter}/><Lane label="MYTHOS 5.1" accent={ANTHROPIC} open filter={1}/></div>
      <StoryBeat startFrame={s08.start+15} role="CHANGE" direction="up" style={{marginTop:38}}>
        <div style={{borderRadius:34,background:'#171513',color:'#FFFFFF',padding:'32px 34px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
          <div style={{opacity:pIn,transform:`translateY(${(1-pIn)*18}px)`}}><div style={{fontSize:25,fontWeight:850,color:'#F5B79E'}}>INPUT</div><div style={{fontSize:62,fontWeight:950}}>$10 <span style={{fontSize:24}}>/ 1M</span></div></div>
          <div style={{opacity:pOut,transform:`translateY(${(1-pOut)*18}px)`}}><div style={{fontSize:25,fontWeight:850,color:'#F5B79E'}}>OUTPUT</div><div style={{fontSize:62,fontWeight:950}}>$50 <span style={{fontSize:24}}>/ 1M</span></div></div>
        </div>
      </StoryBeat>
    </div>
  </Stage>;
};

const Scene5:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const s09=sentenceWindow('scene5','s09',duration,.02,.24);
  const s10=sentenceWindow('scene5','s10',duration,.24,.58);
  const s11=sentenceWindow('scene5','s11',duration,.58,1);
  const cache=progressIn(frame,s09);
  const save=progressIn(frame,s10);
  const gate=progressIn(frame,s11);
  return <Stage accent="#039855" chapter="PREIS → PRAKTISCHER PAYOFF">
    <div style={{position:'absolute',left:74,right:74,top:215}}>
      <div style={{fontSize:68,fontWeight:950,letterSpacing:'-.055em'}}>Was bringt das<br/>normalen Nutzern?</div>
      <StoryBeat startFrame={s09.start+10} role="PROOF" direction="up" style={{marginTop:48}}>
        <div style={{borderRadius:36,background:'#FFFFFF',border:'1px solid #D8D0C8',padding:34,boxShadow:'0 20px 60px rgba(24,22,20,.09)'}}>
          <div style={{fontSize:24,fontWeight:900,color:'#667085'}}>CACHE READS</div>
          <div style={{fontSize:82,fontWeight:950,letterSpacing:'-.06em',marginTop:8,transform:`scale(${.92+.08*cache})`,transformOrigin:'left center'}}>$0.25 <span style={{fontSize:26}}>/ 1M TOKENS</span></div>
        </div>
      </StoryBeat>
      <StoryBeat startFrame={s10.start+12} role="PROOF" direction="up" style={{marginTop:34}}>
        <div style={{borderRadius:36,background:'#ECFDF3',border:'1px solid #ABEFC6',padding:34}}>
          <div style={{fontSize:24,fontWeight:900,color:'#027A48'}}>ANTHROPIC ESTIMATE · TYPICAL WORKLOADS</div>
          <div style={{fontSize:96,fontWeight:950,letterSpacing:'-.075em',color:'#027A48',marginTop:8}}>-{Math.round(save*25)}%</div>
          <div style={{height:14,borderRadius:999,background:'#D1FADF',overflow:'hidden',marginTop:12}}><div style={{height:'100%',width:`${save*100}%`,background:'#12B76A'}}/></div>
        </div>
      </StoryBeat>
      <StoryBeat startFrame={s11.start+10} role="PAYOFF" direction="up" style={{marginTop:36}}>
        <div style={{height:390,borderRadius:42,background:'#171513',color:'#FFFFFF',padding:34,position:'relative',overflow:'hidden'}}>
          <div style={{fontSize:24,fontWeight:900,color:'#F5B79E'}}>BOTTOM LINE</div>
          <div style={{fontSize:54,lineHeight:1.02,fontWeight:950,letterSpacing:'-.05em',marginTop:14}}>VIEL MYTHOS-INTELLIGENZ.<br/>NICHT JEDER RISIKO-MODUS.</div>
          <div style={{position:'absolute',left:34,right:34,bottom:38,height:82,borderRadius:24,border:'2px solid rgba(255,255,255,.22)',overflow:'hidden'}}>
            <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${gate*100}%`,background:'rgba(217,119,87,.26)',borderRight:'3px solid #F7906A'}}/>
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',gap:12,fontSize:22,fontWeight:950}}><LockKeyhole size={30}/> HIGH-RISK ACCESS · CONTROLLED</div>
          </div>
        </div>
      </StoryBeat>
      <StoryBeat startFrame={s11.start+70} role="PROOF" direction="up" style={{marginTop:28}}><SourceProofCard source="anthropic.com/claude/fable" date="01.09.2026" label="Pricing + cache-read estimate" accent="#039855" startFrame={s11.start+70}/></StoryBeat>
    </div>
  </Stage>;
};

const CaptionLayer:React.FC=()=>{
  const frame=useCurrentFrame();
  const cue=CLAUDE_51_CUES.find((item)=>frame>=item.startFrame&&frame<item.endFrame);
  if(!cue||!shouldShowReelCaption(frame,31))return null;
  return <div style={REEL_CAPTION_WRAPPER_STYLE}><div style={REEL_CAPTION_GLASS_STYLE}>{cue.text}</div></div>;
};

export const ReelClaudeFableMythos51:React.FC<Props>=({voiceoverSrc,showCaptions=true,showSfx=true})=>{
  return <AbsoluteFill>
    {CLAUDE_51_SCENES.map((scene)=>{
      const duration=scene.endFrame-scene.startFrame;
      const component=scene.sceneId==='scene1'?<Scene1 duration={duration}/>:scene.sceneId==='scene2'?<Scene2 duration={duration}/>:scene.sceneId==='scene3'?<Scene3 duration={duration}/>:scene.sceneId==='scene4'?<Scene4 duration={duration}/>:<Scene5 duration={duration}/>;
      return <Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={duration} name={scene.title}>{component}</Sequence>;
    })}
    {voiceoverSrc?<Html5Audio src={voiceoverSrc}/>:null}
    <ReelSfxTrack events={CLAUDE_51_SFX} enabled={showSfx}/>
    {showCaptions?<CaptionLayer/>:null}
  </AbsoluteFill>;
};
