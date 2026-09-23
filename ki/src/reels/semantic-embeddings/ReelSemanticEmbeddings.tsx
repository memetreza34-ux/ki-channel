import React, {useMemo} from 'react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {REEL_CAPTION_SAFE} from '../captionSafe';
import {
  SEMANTIC_EMBEDDINGS_CAPTION_ZONE_Y,
  SEMANTIC_EMBEDDINGS_SCENES,
  SEMANTIC_EMBEDDINGS_SUBTITLES,
  type SemanticEmbeddingCue,
  type SemanticEmbeddingScene,
} from './contract';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const p = (frame: number, from: number, to: number) => clamp((frame - from) / Math.max(1, to - from));
const ease = (value: number) => 1 - Math.pow(1 - clamp(value), 3);

const iconPaths: Record<string, React.ReactNode> = {
  search: <><circle cx="14" cy="14" r="8"/><path d="M20 20l7 7"/></>,
  vector: <><path d="M4 24L13 8l7 10 8-12"/><path d="M24 6h4v4"/></>,
  cluster: <><circle cx="8" cy="10" r="3"/><circle cx="16" cy="7" r="3"/><circle cx="24" cy="12" r="3"/><circle cx="11" cy="22" r="3"/><circle cx="22" cy="23" r="3"/></>,
  target: <><circle cx="16" cy="16" r="12"/><circle cx="16" cy="16" r="6"/><circle cx="16" cy="16" r="2"/></>,
  shield: <><path d="M16 3l11 4v8c0 7-4 11-11 14C9 26 5 22 5 15V7z"/><path d="M10 16l4 4 8-9"/></>,
};

const Header: React.FC<{scene: SemanticEmbeddingScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const enter = ease(p(frame, 0, 16));
  return <div style={{position:'absolute',left:64,right:64,top:92,zIndex:50,display:'flex',justifyContent:'center',alignItems:'center',gap:22,opacity:enter,transform:`translateY(${(1-enter)*-22}px)`}}>
    <div style={{width:72,height:72,borderRadius:22,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(185,140,255,.16)',border:'1.5px solid rgba(110,69,201,.25)',color:BRAND.accentDk,boxShadow:'0 12px 30px rgba(110,69,201,.12)'}}><svg width="42" height="42" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{iconPaths[scene.icon] ?? iconPaths.search}</svg></div>
    <div style={{maxWidth:820,textAlign:'center',fontFamily:BRAND.font,fontSize:scene.headline.length>28?48:56,lineHeight:1.02,fontWeight:900,letterSpacing:-1.7,color:BRAND.accentDk,textShadow:'0 7px 22px rgba(110,69,201,.11)'}}>{scene.headline}</div>
  </div>;
};

const SearchHookVisual: React.FC = () => {
  const frame=useCurrentFrame();
  const result=ease(p(frame,40,88)); const link=ease(p(frame,120,175)); const pulse=1+Math.sin(Math.max(0,frame-175)/7)*0.025;
  return <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:52}}>
    <div style={{width:820,borderRadius:32,padding:'30px 36px',background:'#fff',boxShadow:'0 20px 60px rgba(34,22,57,.10)',border:'2px solid rgba(110,69,201,.18)'}}>
      <div style={{fontSize:26,fontWeight:800,color:BRAND.accentDk,marginBottom:12}}>SUCHE</div>
      <div style={{fontSize:42,fontWeight:800,color:BRAND.ink}}>„Wie bekomme ich den Reifen wieder dicht?“</div>
    </div>
    <div style={{position:'relative',width:820,height:300}}>
      <div style={{position:'absolute',left:80,right:80,top:14,height:6,borderRadius:10,background:'rgba(110,69,201,.13)'}}/>
      <div style={{position:'absolute',left:80,top:14,width:(660*link),height:6,borderRadius:10,background:BRAND.accentDk,transformOrigin:'left center'}}/>
      <div style={{position:'absolute',left:0,right:0,top:74,opacity:result,transform:`translateY(${(1-result)*42}px) scale(${pulse})`,borderRadius:34,padding:'34px 38px',background:'rgba(255,255,255,.98)',border:'2px solid rgba(110,69,201,.30)',boxShadow:'0 24px 70px rgba(110,69,201,.15)'}}>
        <div style={{fontSize:24,fontWeight:850,color:BRAND.accentDk,letterSpacing:1.5}}>SEMANTISCH PASSEND</div>
        <div style={{marginTop:12,fontSize:40,fontWeight:850,color:BRAND.ink}}>„Schlauch flicken nach einem Platten“</div>
        <div style={{marginTop:14,fontSize:28,fontWeight:700,color:'rgba(35,28,48,.58)'}}>wenig Wortüberschneidung · gleiche Richtung</div>
      </div>
    </div>
  </div>;
};

const VectorVisual: React.FC = () => {
  const frame=useCurrentFrame(); const compress=ease(p(frame,30,95)); const fan=ease(p(frame,105,190));
  const dims=['d₁','d₂','d₃','d₄','d₅','…'];
  return <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
    <div style={{position:'absolute',top:180,width:760,padding:'34px 42px',borderRadius:34,background:'#fff',border:'2px solid rgba(110,69,201,.18)',boxShadow:'0 24px 70px rgba(34,22,57,.10)',opacity:1-compress*.8,transform:`translateY(${compress*110}px) scale(${1-compress*.28})`}}>
      <div style={{fontSize:28,fontWeight:800,color:BRAND.accentDk}}>TEXT</div><div style={{fontSize:44,fontWeight:850,color:BRAND.ink,marginTop:12}}>„Eine Katze schläft auf dem Sofa.“</div>
    </div>
    <div style={{position:'absolute',top:490,width:170,height:170,borderRadius:52,background:BRAND.accentDk,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:80,fontWeight:900,opacity:compress,transform:`scale(${.72+.28*compress})`,boxShadow:'0 30px 80px rgba(110,69,201,.24)'}}>V</div>
    <div style={{position:'absolute',top:740,display:'flex',gap:22,opacity:fan}}>{dims.map((d,i)=><div key={d} style={{width:112,height:150,borderRadius:28,background:i===5?'rgba(110,69,201,.08)':'#fff',border:'2px solid rgba(110,69,201,.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:38,fontWeight:900,color:BRAND.accentDk,transform:`translateY(${(1-fan)*(i%2?55:-35)}px)`,boxShadow:'0 16px 44px rgba(34,22,57,.08)'}}>{d}</div>)}</div>
    <div style={{position:'absolute',top:930,fontSize:30,fontWeight:750,color:'rgba(35,28,48,.58)',opacity:fan}}>abstrahierte Dimensionen · keine echten Beispielwerte</div>
  </div>;
};

const ClusterVisual: React.FC = () => {
  const frame=useCurrentFrame(); const gather=ease(p(frame,15,110)); const query=ease(p(frame,150,245));
  const groups=[
    {name:'TIERE',cx:270,cy:440,points:[[0,0],[70,-45],[-60,55],[55,70],[-70,-50]]},
    {name:'ESSEN',cx:760,cy:430,points:[[0,0],[62,-50],[-70,35],[45,70],[-38,-72]]},
    {name:'TECHNIK',cx:540,cy:800,points:[[0,0],[70,-30],[-60,55],[45,75],[-55,-65]]},
  ];
  return <div style={{position:'absolute',inset:0}}>
    <div style={{position:'absolute',right:64,top:55,padding:'10px 18px',borderRadius:999,background:'rgba(110,69,201,.10)',color:BRAND.accentDk,fontSize:24,fontWeight:850}}>2D-VEREINFACHUNG</div>
    {groups.map((g,gi)=><React.Fragment key={g.name}><div style={{position:'absolute',left:g.cx-80,top:g.cy-120,width:160,textAlign:'center',fontSize:24,fontWeight:900,color:BRAND.accentDk,opacity:gather}}>{g.name}</div>{g.points.map(([dx,dy],i)=>{const startX=120+((gi*5+i)*137)%820;const startY=230+((gi*5+i)*89)%700;const x=startX+(g.cx+dx-startX)*gather;const y=startY+(g.cy+dy-startY)*gather;return <div key={`${g.name}-${i}`} style={{position:'absolute',left:x-16,top:y-16,width:32,height:32,borderRadius:'50%',background:gi===0?BRAND.accentDk:gi===1?'#9B6BE8':'#C7A7F3',boxShadow:'0 6px 18px rgba(45,31,70,.14)'}}/>;})}</React.Fragment>)}
    <svg viewBox="0 0 1080 1100" style={{position:'absolute',inset:0,width:'100%',height:'100%',overflow:'visible'}}><path d={`M 940 250 C ${900-180*query} ${280+80*query}, ${440+80*query} ${340+100*query}, ${270} ${440}`} fill="none" stroke={BRAND.accentDk} strokeWidth="7" strokeDasharray="12 14" opacity={query}/></svg>
    <div style={{position:'absolute',left:940+(270-940)*query-25,top:250+(440-250)*query-25,width:50,height:50,borderRadius:'50%',background:'#fff',border:`6px solid ${BRAND.accentDk}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:900,color:BRAND.accentDk,boxShadow:'0 12px 34px rgba(110,69,201,.22)'}}>Q</div>
  </div>;
};

const SimilarityVisual: React.FC = () => {
  const frame=useCurrentFrame(); const form=ease(p(frame,20,75)); const lines=ease(p(frame,80,155)); const win=ease(p(frame,180,235));
  const candidates=[{x:790,y:310,label:'A'},{x:835,y:600,label:'B'},{x:720,y:840,label:'C'}];
  return <div style={{position:'absolute',inset:0}}>
    <div style={{position:'absolute',left:90,top:460,width:330,padding:'30px 32px',borderRadius:30,background:'#fff',border:'2px solid rgba(110,69,201,.18)',boxShadow:'0 20px 55px rgba(35,24,58,.10)',opacity:1-form*.7,transform:`scale(${1-form*.12})`}}><div style={{fontSize:24,fontWeight:800,color:BRAND.accentDk}}>ANFRAGE</div><div style={{fontSize:35,fontWeight:850,marginTop:10,color:BRAND.ink}}>„passender Inhalt“</div></div>
    <div style={{position:'absolute',left:470,top:560,width:90,height:90,borderRadius:'50%',background:BRAND.accentDk,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:38,fontWeight:900,transform:`scale(${.4+.6*form})`,opacity:form}}>Q</div>
    <svg viewBox="0 0 1080 1100" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>{candidates.map((c,i)=><line key={c.label} x1="515" y1="605" x2={c.x} y2={c.y} stroke={i===1?BRAND.accentDk:'rgba(70,58,86,.24)'} strokeWidth={i===1?8:5} strokeDasharray={i===1?'0':'12 14'} opacity={lines}/>)}</svg>
    {candidates.map((c,i)=><div key={c.label} style={{position:'absolute',left:c.x-52,top:c.y-52,width:104,height:104,borderRadius:'50%',background:'#fff',border:`${i===1?6:3}px solid ${i===1?BRAND.accentDk:'rgba(70,58,86,.22)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,fontWeight:900,color:i===1?BRAND.accentDk:BRAND.ink,boxShadow:i===1?`0 0 0 ${18*win}px rgba(110,69,201,.10)`:'0 12px 30px rgba(35,24,58,.08)',transform:`scale(${i===1?1+.1*win:1})`}}>{c.label}{i===1&&<span style={{position:'absolute',top:-48,fontSize:22,whiteSpace:'nowrap'}}>RANG 1</span>}</div>)}
    <div style={{position:'absolute',left:120,right:120,bottom:120,textAlign:'center',fontSize:30,fontWeight:800,color:'rgba(35,28,48,.58)',opacity:lines}}>Ähnlichkeitsvergleich · z. B. Kosinus</div>
  </div>;
};

const UseCasesVisual: React.FC = () => {
  const frame=useCurrentFrame(); const a=ease(p(frame,15,60));const b=ease(p(frame,60,105));const c=ease(p(frame,105,150));const boundary=ease(p(frame,175,225));const payoff=ease(p(frame,235,300));
  const items=[['⌕','SUCHE',a],['◌','CLUSTER',b],['★','EMPFEHLUNG',c]] as const;
  return <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center'}}>
    <div style={{display:'flex',gap:28,marginTop:210}}>{items.map(([icon,label,v])=><div key={label} style={{width:270,height:250,borderRadius:38,background:'#fff',border:'2px solid rgba(110,69,201,.16)',boxShadow:'0 20px 55px rgba(35,24,58,.09)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:18,opacity:v,transform:`translateY(${(1-v)*45}px) scale(${.88+.12*v})`}}><div style={{fontSize:78,fontWeight:900,color:BRAND.accentDk}}>{icon}</div><div style={{fontSize:28,fontWeight:900,color:BRAND.ink}}>{label}</div></div>)}</div>
    <div style={{marginTop:76,padding:'24px 42px',borderRadius:28,background:'rgba(255,245,245,.98)',border:'2px solid rgba(160,55,75,.20)',fontSize:38,fontWeight:900,color:'#8F3347',opacity:boundary,transform:`scale(${.9+.1*boundary})`}}>ÄHNLICHKEIT ≠ WAHRHEIT</div>
    <div style={{marginTop:58,fontSize:54,fontWeight:950,color:BRAND.accentDk,textAlign:'center',opacity:payoff,transform:`translateY(${(1-payoff)*25}px) scale(${.92+.08*payoff})`}}>Bedeutung kann wichtiger sein<br/>als identische Wörter.</div>
  </div>;
};

const visualByScene: Record<string, React.FC> = {'semantic-01':SearchHookVisual,'semantic-02':VectorVisual,'semantic-03':ClusterVisual,'semantic-04':SimilarityVisual,'semantic-05':UseCasesVisual};

const activeWordIndex=(frame:number,cue:SemanticEmbeddingCue,count:number):number=>{
  if(count<=1)return 0;
  if(cue.words?.length===count){const exact=cue.words.findIndex((w)=>frame>=w.startFrame&&frame<w.endFrame);if(exact>=0)return exact;}
  const prog=interpolate(frame,[cue.startFrame,Math.max(cue.startFrame+1,cue.endFrame-1)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return Math.min(count-1,Math.floor(prog*count));
};

const Captions: React.FC=()=>{const frame=useCurrentFrame();const cue=SEMANTIC_EMBEDDINGS_SUBTITLES.find((item)=>frame>=item.startFrame&&frame<item.endFrame);if(!cue)return null;const words=cue.words?.length?cue.words.map((w)=>w.text):cue.text.trim().split(/\s+/).filter(Boolean);const active=activeWordIndex(frame,cue,words.length);return <div style={{position:'absolute',left:REEL_CAPTION_SAFE.horizontalInset,right:REEL_CAPTION_SAFE.horizontalInset,bottom:REEL_CAPTION_SAFE.bottom,zIndex:200,display:'flex',justifyContent:'center',pointerEvents:'none'}}><div style={{width:'100%',maxWidth:REEL_CAPTION_SAFE.maxWidth,textAlign:'center',fontFamily:BRAND.font,fontSize:47,fontWeight:850,lineHeight:1.18,letterSpacing:-.8,color:BRAND.ink,textShadow:'0 2px 0 rgba(255,255,255,.98),0 0 15px rgba(255,255,255,.98),0 8px 30px rgba(26,26,46,.10)'}}>{words.map((word,i)=><React.Fragment key={`${cue.sceneId}-${cue.startFrame}-${i}`}><span style={{display:'inline-block',color:i===active?BRAND.accentDk:BRAND.ink,transform:`scale(${i===active?1.035:1})`,transformOrigin:'50% 70%'}}>{word}</span>{i<words.length-1?' ':null}</React.Fragment>)}</div></div>};

const SceneLayer:React.FC<{scene:SemanticEmbeddingScene}>=({scene})=>{const Visual=visualByScene[scene.sceneId];if(!Visual)throw new Error(`missing NEW_BUILD visual for ${scene.sceneId}`);return <AbsoluteFill><Header scene={scene}/><div style={{position:'absolute',left:0,right:0,top:225,height:SEMANTIC_EMBEDDINGS_CAPTION_ZONE_Y-255,overflow:'hidden',zIndex:20}}><Visual/></div></AbsoluteFill>};

const resolveVoiceoverSrc=(voiceoverSrc?:string):string|undefined=>{if(!voiceoverSrc)return undefined;if(/^(https?:|data:|blob:)/i.test(voiceoverSrc))return voiceoverSrc;return staticFile(voiceoverSrc.replace(/^\/+/,''));};

export type ReelSemanticEmbeddingsProps={voiceoverSrc?:string;showCaptions?:boolean};
export const ReelSemanticEmbeddings:React.FC<ReelSemanticEmbeddingsProps>=({voiceoverSrc,showCaptions=true})=>{const scenes=useMemo(()=>SEMANTIC_EMBEDDINGS_SCENES,[]);const resolved=resolveVoiceoverSrc(voiceoverSrc);return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 34%, #FFFFFF 0%, #FAF8FC 58%, #F1EDF6 100%)',color:BRAND.ink,overflow:'hidden',fontFamily:BRAND.font}}><div style={{position:'absolute',inset:0,background:'linear-gradient(rgba(110,69,201,.025) 1px, transparent 1px),linear-gradient(90deg,rgba(110,69,201,.025) 1px,transparent 1px)',backgroundSize:'72px 72px',maskImage:'linear-gradient(to bottom,transparent 0%,black 14%,black 72%,transparent 88%)'}}/>{scenes.map((scene)=><Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame-scene.startFrame} name={`${scene.sceneId}-NEW_BUILD`}><SceneLayer scene={scene}/></Sequence>)}{resolved?<Html5Audio src={resolved}/>:null}{showCaptions?<Captions/>:null}</AbsoluteFill>};
