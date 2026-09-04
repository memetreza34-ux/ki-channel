import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {REEL_CAPTION_GLASS_STYLE, REEL_CAPTION_WRAPPER_STYLE, shouldShowReelCaption} from '../captionSafe';
import {ReelSfxTrack} from '../ReelSfxTrack';
import {SourceProofCard} from '../ReelVisualMotion';
import {StoryBeat, StoryCamera, StoryChapterLabel, StoryTexture} from '../StoryMotion';
import {DSEWIKI_CUES, DSEWIKI_SCENES, DSEWIKI_SFX} from './contract';

type Props={voiceoverSrc:string;showCaptions?:boolean;showSfx?:boolean};
type Window={start:number;end:number};
const FONT='Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const PURPLE='#B98CFF';
const DEEP='#6E45C9';
const BLUE='#2563EB';
const AMBER='#F59E0B';
const GREEN='#10B981';
const RED='#EF4444';
const INK='#101828';
const MUTED='#667085';

const sceneFor=(sceneId:string)=>DSEWIKI_SCENES.find((scene)=>scene.sceneId===sceneId);
const sentenceWindow=(sceneId:string,sentenceId:string,duration:number,fallbackStart:number,fallbackEnd:number):Window=>{
  const scene=sceneFor(sceneId);
  const matches=DSEWIKI_CUES.filter((cue)=>cue.sceneId===sceneId&&cue.sentenceId===sentenceId);
  if(scene&&matches.length){
    return {start:Math.max(0,Math.min(...matches.map((cue)=>cue.startFrame))-scene.startFrame),end:Math.min(duration,Math.max(...matches.map((cue)=>cue.endFrame))-scene.startFrame)};
  }
  return {start:Math.round(duration*fallbackStart),end:Math.round(duration*fallbackEnd)};
};
const progressIn=(frame:number,w:Window)=>interpolate(frame,[w.start,Math.max(w.start+1,w.end)],[0,1],clamp);

const Stage:React.FC<React.PropsWithChildren<{accent:string;chapter:string;dark?:boolean}>>=({accent,chapter,dark=false,children})=>(
  <AbsoluteFill style={{background:dark?'linear-gradient(180deg,#151426,#211B35)':'linear-gradient(180deg,#FCFBFF,#F3F0FA)',color:dark?'#FFFFFF':INK,fontFamily:FONT,overflow:'hidden'}}>
    <StoryTexture color="#FFFFFF" opacity={dark ? .08 : .24}/>
    <div style={{position:'absolute',left:62,top:58,zIndex:60}}><StoryChapterLabel accent={accent}>{chapter}</StoryChapterLabel></div>
    {children}
  </AbsoluteFill>
);

const Pill:React.FC<{label:string;accent:string}>=({label,accent})=><div style={{display:'inline-flex',padding:'12px 18px',borderRadius:999,background:`${accent}18`,border:`1px solid ${accent}38`,fontSize:22,fontWeight:900,color:accent}}>{label}</div>;
const Agent:React.FC<{x:number;y:number;accent:string;label?:string}>=({x,y,accent,label})=><div style={{position:'absolute',left:x,top:y,transform:'translate(-50%,-50%)',textAlign:'center'}}><div style={{width:66,height:66,borderRadius:'50%',background:'#FFF',border:`4px solid ${accent}`,display:'grid',placeItems:'center',fontSize:20,fontWeight:950,color:accent,boxShadow:`0 12px 32px ${accent}35`}}>AI</div>{label?<div style={{fontSize:16,fontWeight:850,marginTop:8,whiteSpace:'nowrap'}}>{label}</div>:null}</div>;

const Scene1:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const p1=progressIn(frame,sentenceWindow('scene1','s01',duration,.02,.60));
  const p2=progressIn(frame,sentenceWindow('scene1','s02',duration,.60,.98));
  const count=Math.round(interpolate(p2,[0,.9],[420,15000],clamp));
  return <Stage accent={PURPLE} chapter="DSEWIKI · DEUTSCHLAND">
    <StoryCamera startFrame={0} endFrame={duration} fromScale={1} toScale={1.025}>
      <div style={{position:'absolute',left:58,right:58,top:178,bottom:350}}>
        <StoryBeat startFrame={0} role="HOOK" direction="none"><div style={{textAlign:'center'}}><div style={{fontSize:29,fontWeight:950,letterSpacing:'.09em',color:DEEP}}>OPENAI-AGENTEN?</div><div style={{fontSize:88,fontWeight:950,letterSpacing:'-.06em',lineHeight:.96,marginTop:8}}>DEUTSCHE WIKI<br/>ALS SCHWARZES BRETT</div></div></StoryBeat>
        <div style={{position:'relative',height:820,marginTop:38,borderRadius:50,overflow:'hidden',background:'#FFF',border:'1px solid #EAE5F3',boxShadow:'0 30px 90px rgba(55,35,85,.14)'}}>
          <div style={{height:76,padding:'0 28px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'#FBF9FE',borderBottom:'1px solid #EEE9F4'}}><b style={{fontSize:24}}>DseWiki · Recent Changes</b><span style={{fontSize:18,color:MUTED,fontWeight:800}}>GERMAN PROGRAMMING WIKI</span></div>
          <div style={{position:'absolute',left:34,right:34,top:112}}>{['Agent discussion page','Shared solution notes','Policy workaround thread','Backup coordination page'].map((label,index)=>{const r=interpolate(p1,[.08+index*.12,.22+index*.12],[0,1],clamp);return <div key={label} style={{height:94,marginBottom:18,borderRadius:26,background:index===2?'#F7F2FF':'#FAFAFC',border:'1px solid #ECE7F3',padding:'20px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',opacity:r,transform:`translateY(${(1-r)*18}px)`}}><div><div style={{fontSize:22,fontWeight:950}}>{label}</div><div style={{fontSize:17,color:MUTED,fontWeight:750,marginTop:6}}>autonomous edit stream</div></div><b style={{fontSize:20,color:DEEP}}>+{42+index*31}</b></div>;})}</div>
          <StoryBeat startFrame={Math.round(duration*.22)} role="CHANGE" direction="none"><Agent x={120} y={630} accent={PURPLE}/><Agent x={330} y={690} accent={DEEP}/><Agent x={740} y={690} accent={PURPLE}/><Agent x={940} y={630} accent={DEEP}/></StoryBeat>
          <StoryBeat startFrame={Math.round(duration*.58)} role="PROOF" direction="none" style={{position:'absolute',left:0,right:0,bottom:48,textAlign:'center'}}><div style={{fontSize:116,fontWeight:950,letterSpacing:'-.07em',color:DEEP}}>{count.toLocaleString('de-DE')}+</div><div style={{fontSize:25,fontWeight:900,color:MUTED}}>BERICHTETE AGENTEN-BEARBEITUNGEN</div></StoryBeat>
        </div>
        <StoryBeat startFrame={Math.round(duration*.74)} role="PROOF" style={{marginTop:28}}><SourceProofCard source="Reuters" date="04 SEP 2026" label="DseWiki · researchers report 15,000+ agent edits" accent={PURPLE}/></StoryBeat>
      </div>
    </StoryCamera>
  </Stage>;
};

const Scene2:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const p3=progressIn(frame,sentenceWindow('scene2','s03',duration,.02,.58));
  const p4=progressIn(frame,sentenceWindow('scene2','s04',duration,.58,.98));
  const packet=interpolate(p3,[.05,.95],[0,1],clamp);
  const nodes=[{x:150,y:300},{x:850,y:300},{x:150,y:830},{x:850,y:830}];
  return <Stage accent={DEEP} chapter="AGENTEN KOORDINIEREN" dark><div style={{position:'absolute',left:44,right:44,top:170,bottom:325}}><div style={{position:'relative',height:1110,borderRadius:58,background:'radial-gradient(circle at 50% 45%,#342451,#161323 72%)',overflow:'hidden',border:'1px solid rgba(255,255,255,.08)'}}>
    <div style={{position:'absolute',left:390,top:430,width:220,height:220,borderRadius:50,background:'#FFF',display:'grid',placeItems:'center',textAlign:'center',boxShadow:'0 24px 80px rgba(185,140,255,.24)',opacity:p4>.34?.18:1,transform:`scale(${p4>.34?.88:1})`}}><div><div style={{fontSize:28,fontWeight:950,color:DEEP}}>DseWiki</div><div style={{fontSize:18,fontWeight:800,color:MUTED}}>shared page</div></div></div>
    {nodes.map((node,index)=><Agent key={index} x={node.x} y={node.y} accent={index%2?PURPLE:'#8B5CF6'} label={`AGENT ${index+1}`}/>)}
    {nodes.map((node,index)=>{const angle=Math.atan2(540-node.y,500-node.x);const length=Math.hypot(500-node.x,540-node.y)-110;return <div key={`line-${index}`} style={{position:'absolute',left:node.x,top:node.y,width:length,height:3,background:'rgba(185,140,255,.28)',transformOrigin:'left center',transform:`rotate(${angle}rad)`}}/>;})}
    <div style={{position:'absolute',left:100+800*packet,top:260+260*packet,width:22,height:22,borderRadius:'50%',background:'#FFF',boxShadow:'0 0 28px #B98CFF'}}/>
    <StoryBeat startFrame={Math.round(duration*.20)} role="CONSEQUENCE" style={{position:'absolute',left:330,top:190}}><Pill label="REGEL-GATE" accent={RED}/></StoryBeat>
    {p4>.34?<StoryBeat startFrame={Math.round(duration*.60)} role="CONSEQUENCE" direction="none" style={{position:'absolute',left:400,top:470,width:200,textAlign:'center'}}><div style={{fontSize:72}}>×</div><div style={{fontSize:20,fontWeight:950,color:'#FCA5A5'}}>MODERATOR LÖSCHT</div></StoryBeat>:null}
    {p4>.58?<><StoryBeat startFrame={Math.round(duration*.70)} role="PROOF" style={{position:'absolute',left:250,top:690,width:230,height:120,borderRadius:30,background:'#F4EEFF',display:'grid',placeItems:'center',color:INK}}><b>BACKUP A</b></StoryBeat><StoryBeat startFrame={Math.round(duration*.76)} role="PROOF" style={{position:'absolute',right:250,top:690,width:230,height:120,borderRadius:30,background:'#F4EEFF',display:'grid',placeItems:'center',color:INK}}><b>BACKUP B</b></StoryBeat></>:null}
    <StoryBeat startFrame={Math.round(duration*.84)} role="PROOF" direction="none" style={{position:'absolute',left:0,right:0,bottom:72,textAlign:'center'}}><div style={{fontSize:34,fontWeight:950}}>ERSATZSEITEN NACH LÖSCHUNG</div><div style={{fontSize:20,color:'#D7C9EE',fontWeight:750,marginTop:10}}>laut Forscherbericht</div></StoryBeat>
  </div></div></Stage>;
};

const Scene3:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const p5=progressIn(frame,sentenceWindow('scene3','s05',duration,.02,.62));
  const p6=progressIn(frame,sentenceWindow('scene3','s06',duration,.62,.98));
  const evidence=[['SELBSTGEWÄHLTE NAMEN','OpenAIResearcher',PURPLE],['EDIT-TEMPO','ungewöhnlich schnell',BLUE],['INFRASTRUKTUR','Azure', '#0EA5E9']] as const;
  return <Stage accent={BLUE} chapter="DIE INDIZIEN"><div style={{position:'absolute',left:62,right:62,top:190,bottom:345}}><div style={{fontSize:76,fontWeight:950,letterSpacing:'-.055em',lineHeight:.98}}>WARUM DIE FORSCHER<br/>AUF OPENAI ZEIGEN</div><div style={{marginTop:46,display:'grid',gap:24}}>{evidence.map((item,index)=>{const r=interpolate(p5,[index*.20,.20+index*.20],[0,1],clamp);return <StoryBeat key={item[0]} startFrame={Math.round(duration*(.06+index*.16))} role="PROOF" direction="none"><div style={{height:208,borderRadius:40,background:'#FFF',border:'1px solid #E9EAF0',boxShadow:'0 20px 56px rgba(16,24,40,.08)',display:'grid',gridTemplateColumns:'120px 1fr',alignItems:'center',padding:'0 30px',opacity:r,transform:`translateX(${(1-r)*34}px)`}}><div style={{width:82,height:82,borderRadius:26,background:`${item[2]}16`,display:'grid',placeItems:'center',fontSize:35,fontWeight:950,color:item[2]}}>{index+1}</div><div><div style={{fontSize:21,fontWeight:950,color:item[2]}}>{item[0]}</div><div style={{fontSize:index===0?38:45,fontWeight:950,letterSpacing:'-.035em',marginTop:12}}>{item[1]}</div></div></div></StoryBeat>;})}</div><StoryBeat startFrame={Math.round(duration*.68)} role="CONSEQUENCE" direction="none" style={{marginTop:46}}><div style={{height:250,borderRadius:48,background:'linear-gradient(135deg,#EEF4FF,#F4EEFF)',border:'2px solid #D9D6FE',display:'grid',placeItems:'center',textAlign:'center',transform:`scale(${.94+.06*p6})`}}><div><div style={{fontSize:25,fontWeight:950,color:MUTED}}>EINSCHÄTZUNG DER FORSCHER</div><div style={{fontSize:62,fontWeight:950,letterSpacing:'-.05em',color:DEEP,marginTop:8}}>VERBINDUNG<br/>„SEHR WAHRSCHEINLICH“</div></div></div></StoryBeat></div></Stage>;
};

const Scene4:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const p8=progressIn(frame,sentenceWindow('scene4','s08',duration,.46,.67));
  const p9=progressIn(frame,sentenceWindow('scene4','s09',duration,.67,.98));
  return <Stage accent={AMBER} chapter="WAS IST GESICHERT?"><div style={{position:'absolute',left:56,right:56,top:175,bottom:330}}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:22}}><StoryBeat startFrame={0} role="PROOF" direction="none"><div style={{height:520,borderRadius:42,background:'#F7F2FF',border:'2px solid #DCC8FF',padding:30}}><Pill label="FORSCHERBERICHT" accent={DEEP}/><div style={{fontSize:36,fontWeight:950,lineHeight:1.08,marginTop:28}}>Agenten nutzten DseWiki zur Koordination</div><div style={{fontSize:24,fontWeight:850,color:MUTED,marginTop:22}}>OpenAI-Zuordnung:<br/><b style={{color:DEEP}}>sehr wahrscheinlich</b></div></div></StoryBeat><StoryBeat startFrame={Math.round(duration*.08)} role="PROOF" direction="none"><div style={{height:520,borderRadius:42,background:'#FFF8E8',border:'2px solid #F9D58C',padding:30}}><Pill label="OPENAI-REAKTION" accent={AMBER}/><div style={{fontSize:36,fontWeight:950,lineHeight:1.08,marginTop:28}}>Vollständige Ergebnisse noch nicht geprüft</div><div style={{fontSize:24,fontWeight:850,color:MUTED,marginTop:22}}>„Hacking“-Einordnung:<br/><b style={{color:AMBER}}>widersprochen</b></div></div></StoryBeat></div><StoryBeat startFrame={Math.round(duration*.30)} role="PROOF" direction="none" style={{marginTop:28}}><SourceProofCard source="Reuters · OpenAI response" date="04 SEP 2026" label="Research claims and OpenAI response remain distinct" accent={AMBER}/></StoryBeat><StoryBeat startFrame={Math.round(duration*.48)} role="PROOF" direction="none" style={{marginTop:34}}><div style={{display:'grid',gridTemplateColumns:'1fr 80px 1fr',alignItems:'center',gap:10,opacity:.55+.45*p8}}><div style={{height:142,borderRadius:34,background:'#FFF',border:'1px solid #E8E8EE',display:'grid',placeItems:'center',textAlign:'center'}}><div><b style={{fontSize:30}}>DseWiki</b><div style={{fontSize:18,color:MUTED}}>dieser Fall</div></div></div><div style={{fontSize:42,fontWeight:950,textAlign:'center',color:RED}}>≠</div><div style={{height:142,borderRadius:34,background:'#FFF',border:'1px solid #E8E8EE',display:'grid',placeItems:'center',textAlign:'center'}}><div><b style={{fontSize:30}}>Hugging Face</b><div style={{fontSize:18,color:MUTED}}>separater Vorfall</div></div></div></div></StoryBeat><StoryBeat startFrame={Math.round(duration*.68)} role="CONSEQUENCE" direction="none" style={{marginTop:38}}><div style={{position:'relative',height:210}}><div style={{position:'absolute',left:50,right:50,top:76,height:6,borderRadius:999,background:'#E7E7EC'}}><div style={{height:'100%',width:`${Math.max(0,Math.min(1,p9))*100}%`,borderRadius:999,background:`linear-gradient(90deg,${PURPLE},${AMBER})`}}/></div>{[{x:70,title:'MAI',sub:'Aktivität'},{x:450,title:'ENDE AUG',sub:'entdeckt'},{x:825,title:'04 SEP',sub:'Bericht'}].map((item,index)=><div key={item.title} style={{position:'absolute',left:item.x,top:38,transform:'translateX(-50%)',textAlign:'center',opacity:interpolate(p9,[index*.28,.22+index*.28],[0,1],clamp)}}><div style={{width:30,height:30,borderRadius:'50%',background:index===2?AMBER:DEEP,margin:'0 auto 10px',boxShadow:'0 0 0 8px #FFF'}}/><div style={{fontSize:22,fontWeight:950}}>{item.title}</div><div style={{fontSize:16,fontWeight:750,color:MUTED}}>{item.sub}</div></div>)}</div></StoryBeat></div></Stage>;
};

const Scene5:React.FC<{duration:number}>=({duration})=>{
  const frame=useCurrentFrame();
  const p10=progressIn(frame,sentenceWindow('scene5','s10',duration,.02,.66));
  const p11=progressIn(frame,sentenceWindow('scene5','s11',duration,.66,.98));
  const nodes=Array.from({length:12},(_,index)=>({x:150+(index%4)*250,y:300+Math.floor(index/4)*220}));
  const controls=[['MONITORING',BLUE],['BEGRENZTE RECHTE',AMBER],['AUDIT-TRAIL',GREEN]] as const;
  return <Stage accent={GREEN} chapter="DAS EIGENTLICHE RISIKO" dark><div style={{position:'absolute',left:50,right:50,top:178,bottom:330}}><StoryBeat startFrame={0} role="PAYOFF" direction="none"><div style={{height:155,borderRadius:42,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.10)',display:'flex',alignItems:'center',justifyContent:'center',gap:24}}><div style={{fontSize:29,fontWeight:900,color:'#D1C9DE'}}>NICHT NUR</div><div style={{fontSize:46,fontWeight:950,textDecoration:'line-through',textDecorationColor:RED}}>DIE EINE SUPER-KI</div></div></StoryBeat><div style={{position:'relative',height:720,marginTop:28,borderRadius:52,background:'radial-gradient(circle at 50% 50%,#2A3344,#171925 68%)',overflow:'hidden',border:'1px solid rgba(255,255,255,.08)'}}>{nodes.slice(0,-1).map((node,index)=>{const next=nodes[(index+5)%nodes.length];const angle=Math.atan2(next.y-node.y,next.x-node.x);const length=Math.hypot(next.x-node.x,next.y-node.y);return <div key={`edge-${index}`} style={{position:'absolute',left:node.x,top:node.y,width:length,height:2,background:'rgba(185,140,255,.18)',transformOrigin:'left center',transform:`rotate(${angle}rad) scaleX(${Math.min(1,p10*1.5)})`}}/>;})}{nodes.map((node,index)=>{const r=interpolate(p10,[.08+index*.035,.18+index*.035],[0,1],clamp);return <div key={index} style={{position:'absolute',left:node.x,top:node.y,width:58,height:58,borderRadius:'50%',background:'#FFF',border:`3px solid ${index%3===0?PURPLE:GREEN}`,display:'grid',placeItems:'center',fontSize:16,fontWeight:950,color:INK,opacity:r,transform:`translate(-50%,-50%) scale(${.75+.25*r})`}}>AI</div>;})}<StoryBeat startFrame={Math.round(duration*.36)} role="PAYOFF" direction="none" style={{position:'absolute',left:0,right:0,top:38,textAlign:'center'}}><div style={{fontSize:32,fontWeight:950}}>VIELE AGENTEN · GEMEINSAME WEGE</div></StoryBeat></div><div style={{marginTop:26,display:'grid',gap:14}}>{controls.map((item,index)=>{const r=interpolate(p11,[index*.18,.18+index*.18],[0,1],clamp);return <StoryBeat key={item[0]} startFrame={Math.round(duration*(.68+index*.08))} role={index===2?'PAYOFF':'CONSEQUENCE'} direction="none"><div style={{height:92,borderRadius:28,background:'rgba(255,255,255,.94)',display:'flex',alignItems:'center',padding:'0 28px',gap:20,color:INK,opacity:r,transform:`translateX(${(1-r)*36}px)`}}><div style={{width:48,height:48,borderRadius:16,background:`${item[1]}18`,border:`2px solid ${item[1]}`,display:'grid',placeItems:'center',fontSize:24,fontWeight:950,color:item[1]}}>✓</div><div style={{fontSize:28,fontWeight:950}}>{item[0]}</div></div></StoryBeat>;})}</div></div></Stage>;
};

const CaptionLayer:React.FC<{enabled:boolean}>=({enabled})=>{
  const frame=useCurrentFrame();
  if(!enabled||!shouldShowReelCaption(frame,31))return null;
  const cue=DSEWIKI_CUES.find((item)=>frame>=item.startFrame&&frame<item.endFrame);
  if(!cue)return null;
  return <div style={REEL_CAPTION_WRAPPER_STYLE}><div style={REEL_CAPTION_GLASS_STYLE}>{cue.text}</div></div>;
};

export const ReelOpenAIDseWikiAgents:React.FC<Props>=({voiceoverSrc,showCaptions=true,showSfx=true})=>{
  const frame=useCurrentFrame();
  const {durationInFrames}=useVideoConfig();
  if(!voiceoverSrc)throw new Error('OpenAI DseWiki reel requires the local runtime user voiceover.');
  return <AbsoluteFill style={{background:'#F7F5FB'}}>{DSEWIKI_SCENES.map((scene)=>{const duration=scene.endFrame-scene.startFrame;const Component=scene.sceneId==='scene1'?Scene1:scene.sceneId==='scene2'?Scene2:scene.sceneId==='scene3'?Scene3:scene.sceneId==='scene4'?Scene4:Scene5;return <Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={duration} name={scene.title}><Component duration={duration}/></Sequence>;})}<Html5Audio src={voiceoverSrc}/><ReelSfxTrack events={DSEWIKI_SFX} enabled={showSfx}/><CaptionLayer enabled={showCaptions}/><div style={{position:'absolute',left:0,right:0,bottom:0,height:5,background:'#E8E2F0'}}><div style={{height:'100%',transformOrigin:'left',transform:`scaleX(${Math.max(0,Math.min(1,frame/Math.max(1,durationInFrames-1)))})`,background:`linear-gradient(90deg,${PURPLE},${BLUE},${AMBER},${GREEN})`}}/></div></AbsoluteFill>;
};
