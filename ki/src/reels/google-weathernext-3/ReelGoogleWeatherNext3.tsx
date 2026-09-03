import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Cloud, CloudRain, Clock3, Database, Droplets, Grid3X3, MapPin, Plane, Satellite, Search, Snowflake, Sprout, TriangleAlert, Wind, Zap} from 'lucide-react';
import {REEL_CAPTION_GLASS_STYLE, REEL_CAPTION_WRAPPER_STYLE, shouldShowReelCaption} from '../captionSafe';
import {ReelSfxTrack} from '../ReelSfxTrack';
import {SourceProofCard} from '../ReelVisualMotion';
import {StoryBeat, StoryCamera, StoryChapterLabel, StoryTexture} from '../StoryMotion';
import {WEATHER_NEXT_3_CUES, WEATHER_NEXT_3_SCENES, WEATHER_NEXT_3_SFX} from './contract';

type Props={voiceoverSrc:string;showCaptions?:boolean;showSfx?:boolean};
type Window={start:number;end:number};
const FONT='Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const BLUE='#4285F4';
const GREEN='#34A853';
const YELLOW='#FBBC05';
const RED='#EA4335';
const INK='#102033';

const sceneFor=(sceneId:string)=>WEATHER_NEXT_3_SCENES.find((scene)=>scene.sceneId===sceneId);
const sentenceWindow=(sceneId:string,sentenceId:string,duration:number,fallbackStart:number,fallbackEnd:number):Window=>{
  const scene=sceneFor(sceneId);
  const matches=WEATHER_NEXT_3_CUES.filter((cue)=>cue.sceneId===sceneId&&cue.sentenceId===sentenceId);
  if(scene&&matches.length){
    return {start:Math.max(0,Math.min(...matches.map((cue)=>cue.startFrame))-scene.startFrame),end:Math.min(duration,Math.max(...matches.map((cue)=>cue.endFrame))-scene.startFrame)};
  }
  return {start:Math.round(duration*fallbackStart),end:Math.round(duration*fallbackEnd)};
};
const progressIn=(frame:number,w:Window)=>interpolate(frame,[w.start,Math.max(w.start+1,w.end)],[0,1],clamp);

const Stage:React.FC<React.PropsWithChildren<{accent:string;chapter:string;dark?:boolean}>>=({accent,chapter,dark=false,children})=>(
  <AbsoluteFill style={{background:dark?'linear-gradient(180deg,#16324A 0%,#224B67 100%)':'linear-gradient(180deg,#FBFDFF 0%,#EEF7FF 100%)',color:dark?'#FFFFFF':INK,fontFamily:FONT,overflow:'hidden'}}>
    <StoryTexture color="#FFFFFF" opacity={dark?.08:.14}/>
    <div style={{position:'absolute',left:62,top:58,zIndex:50}}><StoryChapterLabel accent={accent}>{chapter}</StoryChapterLabel></div>
    {children}
  </AbsoluteFill>
);

const BrandLock:React.FC<{small?:boolean}>=({small=false})=>(
  <div style={{textAlign:'center'}}>
    <div style={{fontSize:small?24:30,fontWeight:900,letterSpacing:'.08em',color:BLUE}}>GOOGLE DEEPMIND</div>
    <div style={{fontSize:small?62:104,fontWeight:950,letterSpacing:'-.055em',lineHeight:.94,color:INK,marginTop:8}}>WeatherNext 3</div>
  </div>
);

const IconPill:React.FC<{label:string;icon:React.ReactNode;accent:string}>=({label,icon,accent})=>(
  <div style={{display:'flex',alignItems:'center',gap:12,padding:'15px 18px',borderRadius:22,background:'rgba(255,255,255,.90)',border:'1px solid rgba(16,32,51,.08)',boxShadow:'0 12px 32px rgba(16,32,51,.08)',fontSize:24,fontWeight:900,color:INK}}>
    <span style={{display:'grid',placeItems:'center',width:38,height:38,borderRadius:14,background:`${accent}16`,color:accent}}>{icon}</span>{label}
  </div>
);

const Scene1:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const s01=sentenceWindow('scene1','s01',duration,.02,.65);
  const s02=sentenceWindow('scene1','s02',duration,.58,.98);
  const p1=progressIn(frame,s01);
  const p2=progressIn(frame,s02);
  const orbit=interpolate(p1,[0,1],[-110,430],clamp);
  const hour=Math.min(24,Math.max(1,Math.round(interpolate(p1,[.28,.72],[1,24],clamp))));
  return <Stage accent={BLUE} chapter="WEATHERNEXT 3">
    <StoryCamera startFrame={0} endFrame={duration} fromScale={1} toScale={1.035}>
      <div style={{position:'absolute',left:70,right:70,top:190,bottom:360,display:'grid',gridTemplateRows:'auto 1fr auto',gap:36}}>
        <StoryBeat startFrame={0} role="HOOK" direction="none"><BrandLock/></StoryBeat>
        <div style={{position:'relative',minHeight:760,borderRadius:54,overflow:'hidden',background:'radial-gradient(circle at 50% 55%,#C8EDFF 0%,#82C8F5 34%,#3E7FB7 70%,#23577F 100%)',boxShadow:'0 28px 90px rgba(35,87,127,.22)'}}>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 55% 58%,rgba(255,255,255,.36),transparent 42%)'}}/>
          <div style={{position:'absolute',left:'50%',top:'52%',width:430,height:430,transform:'translate(-50%,-50%)',borderRadius:'50%',background:'linear-gradient(145deg,#BFE5C4,#5A9D6B)',boxShadow:'inset -50px -40px 90px rgba(18,78,102,.24),0 22px 60px rgba(13,55,85,.22)'}}/>
          <div style={{position:'absolute',left:'50%',top:'52%',width:590,height:250,transform:'translate(-50%,-50%) rotate(-12deg)',border:'2px solid rgba(255,255,255,.55)',borderRadius:'50%'}}/>
          <div style={{position:'absolute',left:`calc(50% + ${Math.cos((orbit/540)*Math.PI*2)*285}px)`,top:`calc(52% + ${Math.sin((orbit/540)*Math.PI*2)*125}px)`,transform:'translate(-50%,-50%)',color:'#FFFFFF',filter:'drop-shadow(0 8px 18px rgba(0,0,0,.28))'}}><Satellite size={64} strokeWidth={2.2}/></div>
          <StoryBeat startFrame={Math.round(duration*.22)} role="CHANGE" style={{position:'absolute',left:34,top:34}}><IconPill label="LIVE SATELLITE" icon={<Satellite size={25}/>} accent={BLUE}/></StoryBeat>
          <StoryBeat startFrame={Math.round(duration*.34)} role="CHANGE" style={{position:'absolute',right:34,top:34}}><IconPill label={`HOUR ${hour}`} icon={<Clock3 size={25}/>} accent={YELLOW}/></StoryBeat>
          <StoryBeat startFrame={Math.round(duration*.56)} role="PROOF" direction="none" style={{position:'absolute',left:0,right:0,bottom:70,textAlign:'center'}}>
            <div style={{fontSize:110,fontWeight:950,letterSpacing:'-.07em',color:'#FFFFFF',textShadow:'0 14px 36px rgba(16,32,51,.32)'}}>5 KM</div>
            <div style={{fontSize:28,fontWeight:900,color:'#FFFFFF'}}>TEMPERATUR & FEUCHTIGKEIT</div>
          </StoryBeat>
        </div>
        <StoryBeat startFrame={Math.round(duration*.72)} role="PROOF"><SourceProofCard source="Google DeepMind" date="03 SEP 2026" label="WeatherNext 3 · live satellite + hourly forecasts" accent={BLUE}/></StoryBeat>
      </div>
    </StoryCamera>
  </Stage>;
};

const Scene2:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const s03=sentenceWindow('scene2','s03',duration,.02,.40);
  const s04=sentenceWindow('scene2','s04',duration,.36,.72);
  const s05=sentenceWindow('scene2','s05',duration,.68,.98);
  const p3=progressIn(frame,s03);
  const p4=progressIn(frame,s04);
  const p5=progressIn(frame,s05);
  const cells=Math.round(interpolate(p4,[0,1],[5,15],clamp));
  const cellSize=500/cells;
  return <Stage accent={GREEN} chapter="25 KM → 5 KM">
    <div style={{position:'absolute',left:70,right:70,top:190,bottom:350}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:26,alignItems:'start'}}>
        <StoryBeat startFrame={0} role="PROOF">
          <div style={{padding:28,borderRadius:36,background:'#FFFFFF',boxShadow:'0 20px 60px rgba(16,32,51,.10)'}}>
            <div style={{fontSize:27,fontWeight:900,color:'#667085'}}>WEATHERNEXT 2</div>
            <div style={{fontSize:74,fontWeight:950,letterSpacing:'-.06em',marginTop:6}}>25 KM</div>
            <div style={{display:'flex',gap:10,alignItems:'center',fontSize:23,fontWeight:850,color:'#667085'}}><Clock3 size={24}/>6-HOUR STEPS</div>
          </div>
        </StoryBeat>
        <StoryBeat startFrame={Math.round(duration*.18)} role="CHANGE">
          <div style={{padding:28,borderRadius:36,background:'#F0FFF5',border:'2px solid #B9E8C7',boxShadow:'0 20px 60px rgba(52,168,83,.12)'}}>
            <div style={{fontSize:27,fontWeight:900,color:GREEN}}>WEATHERNEXT 3</div>
            <div style={{fontSize:74,fontWeight:950,letterSpacing:'-.06em',marginTop:6,color:GREEN}}>5 KM</div>
            <div style={{display:'flex',gap:10,alignItems:'center',fontSize:23,fontWeight:850,color:'#447255'}}><Clock3 size={24}/>HOURLY</div>
          </div>
        </StoryBeat>
      </div>
      <div style={{position:'relative',height:690,marginTop:34,borderRadius:46,overflow:'hidden',background:'linear-gradient(145deg,#E6F1D5,#A8D4B3 54%,#74A7C2)',boxShadow:'0 24px 70px rgba(16,32,51,.14)'}}>
        <div style={{position:'absolute',left:70,top:80,width:650,height:470,transform:`scale(${1+0.08*p5})`,transformOrigin:'center',borderRadius:'42% 58% 50% 50%',background:'radial-gradient(circle at 30% 30%,#F4E7A7 0%,#72B57C 40%,#43846A 70%,#2C6D72 100%)',filter:`saturate(${1+0.35*p5})`}}/>
        <div style={{position:'absolute',left:250,top:120,width:500,height:500,display:'grid',gridTemplateColumns:`repeat(${cells},1fr)`,gridTemplateRows:`repeat(${cells},1fr)`,opacity:.58}}>
          {Array.from({length:cells*cells}).map((_,i)=><div key={i} style={{border:'1px solid rgba(255,255,255,.55)',width:cellSize,height:cellSize}}/>)}
        </div>
        <StoryBeat startFrame={Math.round(duration*.52)} role="PAYOFF" direction="none" style={{position:'absolute',left:0,right:0,bottom:55,textAlign:'center'}}>
          <div style={{fontSize:116,fontWeight:950,letterSpacing:'-.07em',color:'#FFFFFF',textShadow:'0 14px 30px rgba(16,32,51,.30)'}}>5× SCHÄRFER</div>
          <div style={{fontSize:26,fontWeight:900,color:'#FFFFFF'}}>GOOGLES VERGLEICH ZU WEATHERNEXT 2</div>
        </StoryBeat>
        <StoryBeat startFrame={Math.round(duration*.70)} role="CHANGE" style={{position:'absolute',left:34,top:34}}><IconPill label="MEHR TOPOGRAFIE" icon={<Grid3X3 size={25}/>} accent={GREEN}/></StoryBeat>
      </div>
      <StoryBeat startFrame={Math.round(duration*.78)} role="PROOF" style={{marginTop:28}}><SourceProofCard source="Google Blog · Figure 2" date="03 SEP 2026" label="WeatherNext 2 vs 3 · 25 km vs 5 km" accent={GREEN}/></StoryBeat>
    </div>
  </Stage>;
};

const Scene3:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const s06=sentenceWindow('scene3','s06',duration,.02,.32);
  const s07=sentenceWindow('scene3','s07',duration,.26,.98);
  const p6=progressIn(frame,s06);
  const p7=progressIn(frame,s07);
  const sweep=interpolate(frame,[0,duration],[-260,980],clamp);
  return <Stage accent="#00A8E8" chapter="REGEN & SCHNEE" dark>
    <div style={{position:'absolute',left:56,right:56,top:180,bottom:330}}>
      <div style={{position:'relative',height:1030,borderRadius:52,overflow:'hidden',background:'linear-gradient(145deg,#305E79,#1D415A)',boxShadow:'0 25px 80px rgba(6,34,53,.30)'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)',backgroundSize:'54px 54px'}}/>
        <div style={{position:'absolute',left:sweep,top:120,width:360,height:720,borderRadius:'45%',background:'radial-gradient(ellipse,#45C8FFAA 0%,#2B9BFF77 38%,transparent 72%)',filter:'blur(6px)'}}/>
        <div style={{position:'absolute',left:sweep-220,top:420,width:300,height:410,borderRadius:'50%',background:'radial-gradient(ellipse,#8DE4FF88 0%,transparent 70%)',filter:'blur(7px)'}}/>
        <StoryBeat startFrame={Math.round(duration*.08)} role="PROOF" style={{position:'absolute',left:34,top:34}}><IconPill label="REGEN" icon={<CloudRain size={25}/>} accent="#00A8E8"/></StoryBeat>
        <StoryBeat startFrame={Math.round(duration*.24)} role="PROOF" style={{position:'absolute',right:34,top:34}}><IconPill label="SCHNEE" icon={<Snowflake size={25}/>} accent="#8AD8FF"/></StoryBeat>
        <StoryBeat startFrame={Math.round(duration*.46)} role="PROOF" direction="none" style={{position:'absolute',left:40,right:40,top:420,textAlign:'center'}}>
          <div style={{fontSize:126,fontWeight:950,letterSpacing:'-.075em',color:'#FFFFFF'}}>BIS ZU 50%</div>
          <div style={{fontSize:34,fontWeight:900,color:'#CDEEFF'}}>GENAUER</div>
          <div style={{fontSize:23,fontWeight:800,color:'#CDEEFF',marginTop:12}}>LANGFRISTIGE NIEDERSCHLAGSPROGNOSEN<br/>IN GOOGLE-PRODUKTEN</div>
        </StoryBeat>
        <StoryBeat startFrame={Math.round(duration*.70)} role="CHANGE" style={{position:'absolute',left:34,bottom:34}}><IconPill label="SCHÄRFERE STURMGRENZEN" icon={<Droplets size={25}/>} accent="#72D7FF"/></StoryBeat>
      </div>
      <StoryBeat startFrame={Math.round(duration*.76)} role="PROOF" style={{marginTop:28}}><SourceProofCard source="Google Blog · Figure 3" date="03 SEP 2026" label="WeatherNext 2 · WeatherNext 3 · Ground Truth" accent="#00A8E8"/></StoryBeat>
    </div>
  </Stage>;
};

const Scene4:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const s08=sentenceWindow('scene4','s08',duration,.02,.58);
  const s09=sentenceWindow('scene4','s09',duration,.52,.98);
  const p8=progressIn(frame,s08);
  const p9=progressIn(frame,s09);
  const products=[
    {label:'SEARCH',icon:<Search size={30}/>,accent:BLUE},
    {label:'GEMINI',icon:<Zap size={30}/>,accent:'#7A5AF8'},
    {label:'MAPS',icon:<MapPin size={30}/>,accent:GREEN},
    {label:'WEATHER API',icon:<CloudRain size={30}/>,accent:'#00A8E8'},
    {label:'EARTH ENGINE',icon:<Cloud size={30}/>,accent:YELLOW},
  ];
  const visible=Math.min(products.length,Math.max(1,Math.ceil(interpolate(p8,[.12,.82],[1,products.length],clamp))));
  return <Stage accent={YELLOW} chapter="GOOGLE-PRODUKTE">
    <div style={{position:'absolute',left:66,right:66,top:190,bottom:350}}>
      <StoryBeat startFrame={0} role="CHANGE" direction="none">
        <div style={{fontSize:66,fontWeight:950,letterSpacing:'-.045em',lineHeight:1.02,maxWidth:900}}>NICHT NUR FORSCHUNG.<br/><span style={{color:BLUE}}>DIREKT IN PRODUKTEN.</span></div>
      </StoryBeat>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginTop:44}}>
        {products.slice(0,visible).map((product,index)=><StoryBeat key={product.label} startFrame={Math.round(duration*(.16+index*.09))} role="PROOF"><IconPill label={product.label} icon={product.icon} accent={product.accent}/></StoryBeat>)}
      </div>
      <StoryBeat startFrame={Math.round(duration*.54)} role="CHANGE" direction="none" style={{marginTop:48}}>
        <div style={{padding:30,borderRadius:40,background:'#FFFFFF',boxShadow:'0 22px 65px rgba(16,32,51,.10)'}}>
          <div style={{fontSize:26,fontWeight:900,color:'#667085'}}>DEVELOPER DATA</div>
          <div style={{display:'flex',alignItems:'center',gap:18,marginTop:24}}>
            <IconPill label="BigQuery" icon={<Database size={25}/>} accent={BLUE}/>
            <div style={{fontSize:36,fontWeight:950,color:'#98A2B3'}}>→</div>
            <IconPill label="Earth Engine" icon={<Cloud size={25}/>} accent={GREEN}/>
          </div>
          <div style={{height:10,borderRadius:999,background:'#E9F1F7',margin:'28px 8px 0',overflow:'hidden'}}><div style={{height:'100%',width:`${Math.max(0,Math.min(1,p9))*100}%`,background:`linear-gradient(90deg,${BLUE},${GREEN})`}}/></div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginTop:22,fontSize:27,fontWeight:900}}><Cloud size={28} color={BLUE}/>Cloud Storage · hourly global data</div>
        </div>
      </StoryBeat>
      <StoryBeat startFrame={Math.round(duration*.78)} role="PAYOFF" style={{marginTop:28}}><SourceProofCard source="Google DeepMind" date="03 SEP 2026" label="Search · Gemini · Maps · Weather API · Earth Engine · Cloud" accent={YELLOW}/></StoryBeat>
    </div>
  </Stage>;
};

const Scene5:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const s10=sentenceWindow('scene5','s10',duration,.02,.65);
  const s11=sentenceWindow('scene5','s11',duration,.62,.98);
  const p10=progressIn(frame,s10);
  const p11=progressIn(frame,s11);
  const cases=[
    {label:'REISEN',icon:<Plane size={30}/>,accent:BLUE},
    {label:'LANDWIRTSCHAFT',icon:<Sprout size={30}/>,accent:GREEN},
    {label:'ENERGIE',icon:<Wind size={30}/>,accent:YELLOW},
  ];
  return <Stage accent={RED} chapter="WETTER ALS INFRASTRUKTUR">
    <div style={{position:'absolute',left:60,right:60,top:185,bottom:340}}>
      <StoryBeat startFrame={0} role="CHANGE" direction="none">
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:18}}>
          <IconPill label="BIGQUERY" icon={<Database size={25}/>} accent={BLUE}/><span style={{fontSize:38,fontWeight:950}}>→</span><IconPill label="CLOUD" icon={<Cloud size={25}/>} accent={GREEN}/>
        </div>
      </StoryBeat>
      <div style={{position:'relative',height:520,marginTop:38,borderRadius:50,background:'linear-gradient(145deg,#FFFFFF,#F5FAFE)',boxShadow:'0 24px 70px rgba(16,32,51,.11)',overflow:'hidden'}}>
        <div style={{position:'absolute',left:80,right:80,top:88,height:8,borderRadius:999,background:'#E8EEF4'}}><div style={{height:'100%',width:`${Math.max(0,Math.min(1,p10))*100}%`,background:`linear-gradient(90deg,${BLUE},${GREEN},${YELLOW})`,borderRadius:999}}/></div>
        <div style={{position:'absolute',left:50,right:50,bottom:78,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18}}>
          {cases.map((item,index)=><StoryBeat key={item.label} startFrame={Math.round(duration*(.18+index*.10))} role="CONSEQUENCE"><div style={{height:220,borderRadius:34,background:'#FFFFFF',display:'grid',placeItems:'center',textAlign:'center',boxShadow:'0 15px 45px rgba(16,32,51,.08)'}}><div><div style={{display:'grid',placeItems:'center',width:68,height:68,borderRadius:22,margin:'0 auto 16px',background:`${item.accent}14`,color:item.accent}}>{item.icon}</div><div style={{fontSize:22,fontWeight:950}}>{item.label}</div></div></div></StoryBeat>)}
        </div>
      </div>
      <StoryBeat startFrame={Math.round(duration*.46)} role="PAYOFF" direction="none" style={{marginTop:40,textAlign:'center'}}>
        <div style={{fontSize:38,fontWeight:900,color:'#667085'}}>WETTER-KI</div>
        <div style={{fontSize:96,fontWeight:950,letterSpacing:'-.065em',color:RED,lineHeight:.95}}>WIRD INFRASTRUKTUR</div>
      </StoryBeat>
      <StoryBeat startFrame={Math.round(duration*.68)} role="CONSEQUENCE" direction="none" style={{marginTop:34}}>
        <div style={{padding:'24px 28px',borderRadius:34,background:'#FFF5F3',border:'1px solid #FFD2CC',display:'flex',gap:20,alignItems:'center',opacity:.88+.12*p11}}>
          <div style={{width:64,height:64,borderRadius:22,display:'grid',placeItems:'center',background:'#FFE6E1',color:RED}}><TriangleAlert size={34}/></div>
          <div><div style={{fontSize:27,fontWeight:950,color:RED}}>AMTLICHE UNWETTERWARNUNGEN</div><div style={{fontSize:25,fontWeight:800,marginTop:6,color:INK}}>weiter über den lokalen Wetterdienst</div></div>
        </div>
      </StoryBeat>
      <StoryBeat startFrame={Math.round(duration*.86)} role="PAYOFF" direction="none" style={{marginTop:28}}><BrandLock small/></StoryBeat>
    </div>
  </Stage>;
};

const CaptionLayer:React.FC<{enabled:boolean}>=({enabled})=>{
  const frame=useCurrentFrame();
  if(!enabled||!shouldShowReelCaption(frame,31))return null;
  const cue=WEATHER_NEXT_3_CUES.find((item)=>frame>=item.startFrame&&frame<item.endFrame);
  if(!cue)return null;
  return <div style={REEL_CAPTION_WRAPPER_STYLE}><div style={REEL_CAPTION_GLASS_STYLE}>{cue.text}</div></div>;
};

export const ReelGoogleWeatherNext3:React.FC<Props>=({voiceoverSrc,showCaptions=true,showSfx=true})=>{
  const {durationInFrames}=useVideoConfig();
  if(!voiceoverSrc)throw new Error('WeatherNext 3 requires the local runtime user voiceover.');
  return <AbsoluteFill style={{background:'#F7FBFF'}}>
    {WEATHER_NEXT_3_SCENES.map((scene)=>{
      const duration=scene.endFrame-scene.startFrame;
      const Component=scene.sceneId==='scene1'?Scene1:scene.sceneId==='scene2'?Scene2:scene.sceneId==='scene3'?Scene3:scene.sceneId==='scene4'?Scene4:Scene5;
      return <Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={duration} name={scene.title}><Component duration={duration}/></Sequence>;
    })}
    <Html5Audio src={voiceoverSrc}/>
    <ReelSfxTrack events={WEATHER_NEXT_3_SFX} enabled={showSfx}/>
    <CaptionLayer enabled={showCaptions}/>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:5,background:'#D9E7F2'}}><div style={{height:'100%',width:'100%',transformOrigin:'left',transform:`scaleX(${Math.max(0,Math.min(1,useCurrentFrame()/Math.max(1,durationInFrames-1)))})`,background:`linear-gradient(90deg,${BLUE},${GREEN},${YELLOW},${RED})`}}/></div>
  </AbsoluteFill>;
};
