import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {AlertTriangle, ArrowRight, Braces, CheckCircle2, Code2, KeyRound, LockKeyhole, Network, Orbit, Rocket, ShieldCheck, Waypoints} from 'lucide-react';
import {REEL_CAPTION_GLASS_STYLE, REEL_CAPTION_WRAPPER_STYLE} from '../captionSafe';
import {ReelSfxTrack} from '../ReelSfxTrack';
import {SourceProofCard} from '../ReelVisualMotion';
import {ImpactNumber, StoryBeat, StoryCamera, StoryChapterLabel, StoryCutFlash, StoryProgressRail, StoryTexture} from '../StoryMotion';
import {OPENAI_CURSOR_CUES, OPENAI_CURSOR_SCENES, OPENAI_CURSOR_SFX} from './contract';

type Props = {voiceoverSrc:string; showCaptions?:boolean; showSfx?:boolean};
type SceneProps = {duration:number; accent:string};
const FONT='Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const at=(duration:number,ratio:number)=>Math.max(0,Math.round(duration*ratio));

const Shell:React.FC<React.PropsWithChildren<{accent:string;eyebrow:string;seed?:number}>>=({accent,eyebrow,seed=6,children})=><AbsoluteFill style={{fontFamily:FONT,color:'#102033',background:'linear-gradient(180deg,#FCFEFF 0%,#EFF5FA 100%)',padding:'104px 76px 0',overflow:'hidden'}}><StoryTexture seed={seed} opacity={0.10}/><div style={{position:'relative',zIndex:4}}><StoryChapterLabel accent={accent}>{eyebrow}</StoryChapterLabel></div><div style={{position:'relative',zIndex:3,flex:1}}>{children}</div></AbsoluteFill>;
const Card:React.FC<React.PropsWithChildren<{style?:React.CSSProperties}>>=({children,style})=><div style={{background:'rgba(255,255,255,.93)',border:'1px solid rgba(16,32,51,.09)',boxShadow:'0 24px 70px rgba(20,42,70,.12)',borderRadius:34,...style}}>{children}</div>;
const Headline:React.FC<React.PropsWithChildren<{size?:number}>>=({children,size=72})=><div style={{fontSize:size,lineHeight:1.01,fontWeight:950,letterSpacing:'-.045em',marginTop:42,maxWidth:940}}>{children}</div>;
const LogoCard:React.FC<{label:string;sub:string;accent:string;icon:React.ReactNode}>=({label,sub,accent,icon})=><Card style={{padding:28,minHeight:214,display:'flex',alignItems:'center',gap:22}}><div style={{width:72,height:72,borderRadius:24,display:'grid',placeItems:'center',background:`${accent}15`,color:accent}}>{icon}</div><div><div style={{fontSize:35,fontWeight:950}}>{label}</div><div style={{fontSize:22,opacity:.55,marginTop:5}}>{sub}</div></div></Card>;

const Scene1:React.FC<SceneProps>=({duration,accent})=>{
  const frame=useCurrentFrame();
  const fracture=interpolate(frame,[at(duration,.55),at(duration,.78)],[0,1],clamp);
  return <Shell accent={accent} eyebrow="KAPITEL 1 • DER BRUCH" seed={9}>
    <StoryBeat startFrame={0} role="HOOK"><Headline>OpenAI zieht bei Cursor die Reißleine.</Headline></StoryBeat>
    <div style={{position:'relative',height:1040,marginTop:48}}>
      <StoryBeat startFrame={at(duration,.12)} direction="left" role="HOOK" style={{position:'absolute',left:0,top:110,width:410}}><LogoCard label="OpenAI" sub="Modelle" accent="#111827" icon={<Orbit size={42}/>}/></StoryBeat>
      <StoryBeat startFrame={at(duration,.16)} direction="right" role="HOOK" style={{position:'absolute',right:0,top:110,width:410}}><LogoCard label="Cursor" sub="Coding Tool" accent="#2E90FA" icon={<Code2 size={42}/>}/></StoryBeat>
      <StoryBeat startFrame={at(duration,.22)} role="CHANGE" style={{position:'absolute',left:408,right:408,top:200,height:18}}><div style={{height:18,borderRadius:99,background:`linear-gradient(90deg,#111827 0%,${accent} ${Math.max(0,fracture*100)}%,#2E90FA 100%)`,boxShadow:'0 0 26px rgba(46,144,250,.24)'}}/></StoryBeat>
      <StoryCamera startFrame={at(duration,.30)} endFrame={at(duration,.62)} fromScale={.96} toScale={1.08} origin="50% 50%"><StoryBeat startFrame={at(duration,.32)} direction="down" role="CHANGE" style={{position:'absolute',left:240,right:240,top:390}}><Card style={{padding:32,textAlign:'center',border:`2px solid ${accent}55`}}><Rocket size={68} color={accent}/><div style={{fontSize:44,fontWeight:950,marginTop:14}}>SpaceX</div><div style={{fontSize:24,opacity:.58,marginTop:7}}>neuer Eigentümer</div></Card></StoryBeat></StoryCamera>
      <StoryBeat startFrame={at(duration,.63)} direction="up" role="CONSEQUENCE" style={{position:'absolute',left:120,right:120,top:680}}><Card style={{padding:28,display:'flex',alignItems:'center',justifyContent:'center',gap:18}}><AlertTriangle size={46} color={accent}/><div style={{fontSize:34,fontWeight:950}}>VERTRAG WIRD ABGEWICKELT</div></Card></StoryBeat>
    </div><StoryCutFlash atFrame={at(duration,.94)} accent="#FFF4F2" durationFrames={7}/>
  </Shell>;
};

const Scene2:React.FC<SceneProps>=({duration,accent})=>{
  const frame=useCurrentFrame();
  const progress=interpolate(frame,[at(duration,.18),at(duration,.62)],[0,1],clamp);
  return <Shell accent={accent} eyebrow="KAPITEL 2 • DIE FRIST" seed={14}>
    <StoryBeat startFrame={0} role="PROOF"><Headline>Der 12. November ist noch kein finaler Abschalttermin.</Headline></StoryBeat>
    <div style={{position:'relative',height:980,marginTop:70}}>
      <StoryBeat startFrame={at(duration,.06)} direction="left" style={{position:'absolute',left:0,top:70,width:320}}><Card style={{padding:25,textAlign:'center'}}><div style={{fontSize:22,fontWeight:900,opacity:.5}}>ANKÜNDIGUNG</div><div style={{fontSize:48,fontWeight:950,marginTop:10}}>28. AUG</div></Card></StoryBeat>
      <StoryBeat startFrame={at(duration,.20)} role="CHANGE" style={{position:'absolute',left:300,right:280,top:142}}><StoryProgressRail progress={progress} accent={accent} height={20}/><div style={{display:'flex',justifyContent:'space-between',marginTop:13,fontSize:21,fontWeight:850,opacity:.55}}><span>heute verfügbare Modelle</span><span>Übergang</span></div></StoryBeat>
      <StoryBeat startFrame={at(duration,.42)} direction="right" role="PAYOFF" style={{position:'absolute',right:0,top:35,width:300}}><Card style={{padding:25,textAlign:'center',border:`2px solid ${accent}55`}}><ImpactNumber value="12. NOV" label="2026" accent={accent} startFrame={at(duration,.43)} size={72}/></Card></StoryBeat>
      <StoryBeat startFrame={at(duration,.66)} direction="up" role="PROOF" style={{position:'absolute',left:110,right:110,top:430}}><Card style={{padding:34,textAlign:'center'}}><div style={{fontSize:25,fontWeight:950,color:accent}}>VORGESCHLAGENE ÜBERGANGSFRIST</div><div style={{fontSize:32,fontWeight:900,marginTop:18,lineHeight:1.2}}>OpenAI: endgültiges Datum zwischen beiden Unternehmen noch nicht bestätigt.</div></Card></StoryBeat>
      <StoryBeat startFrame={at(duration,.82)} direction="up" role="CONSEQUENCE" style={{position:'absolute',left:185,right:185,bottom:88}}><div style={{padding:'18px 24px',borderRadius:24,background:'#FFF7E8',border:'1px solid #FEDF89',fontSize:27,fontWeight:950,textAlign:'center'}}>CURSOR KANN ZUGANG AUCH FRÜHER BEENDEN</div></StoryBeat>
    </div>
  </Shell>;
};

const Scene3:React.FC<SceneProps>=({duration,accent})=>{
  return <Shell accent={accent} eyebrow="KAPITEL 3 • WARUM?" seed={23}>
    <StoryBeat startFrame={0} role="PROBLEM"><Headline>OpenAI nennt Vertrag und Sicherheit als Grund.</Headline></StoryBeat>
    <div style={{position:'relative',height:1050,marginTop:42}}>
      <StoryBeat startFrame={at(duration,.06)} direction="left" style={{position:'absolute',left:0,top:40,width:430}}><LogoCard label="VERTRAG" sub="Terms & Kontrolle" accent={accent} icon={<Braces size={42}/>}/></StoryBeat>
      <StoryBeat startFrame={at(duration,.18)} direction="right" style={{position:'absolute',right:0,top:40,width:430}}><LogoCard label="SICHERHEIT" sub="Safety at scale" accent="#12B76A" icon={<ShieldCheck size={42}/>}/></StoryBeat>
      <StoryBeat startFrame={at(duration,.31)} direction="up" role="PROOF" style={{position:'absolute',left:70,right:70,top:310}}><Card style={{padding:30}}><div style={{fontSize:22,fontWeight:950,color:accent}}>OPENAIs BEGRÜNDUNG</div><div style={{fontSize:31,fontWeight:900,lineHeight:1.2,marginTop:15}}>Nach dem Eigentümerwechsel könne man die Einhaltung eigener Bedingungen nicht ausreichend sicherstellen.</div><div style={{fontSize:20,opacity:.5,marginTop:15}}>Das ist OpenAIs Darstellung.</div></Card></StoryBeat>
      <StoryBeat startFrame={at(duration,.52)} role="CHANGE" style={{position:'absolute',left:120,right:120,top:610}}><Card style={{padding:30,display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:22}}><div style={{fontSize:34,fontWeight:950}}>ASTRA</div><ArrowRight size={50} color={accent}/><div style={{display:'flex',alignItems:'center',gap:15,justifyContent:'flex-end',fontSize:27,fontWeight:950,color:accent}}><LockKeyhole size={44}/> NICHT ÜBER CURSOR</div></Card></StoryBeat>
      <StoryBeat startFrame={at(duration,.76)} direction="up" role="PROOF" style={{position:'absolute',left:100,right:100,bottom:45}}><SourceProofCard source="openai.com" date="28.08.2026" label="Our decision on Cursor following its acquisition by SpaceX" accent={accent} startFrame={at(duration,.76)}/></StoryBeat>
    </div>
  </Shell>;
};

const Route:React.FC<{title:string;sub:string;accent:string;icon:React.ReactNode}>=({title,sub,accent,icon})=><Card style={{padding:24,display:'grid',gridTemplateColumns:'62px 1fr auto',alignItems:'center',gap:18}}><div style={{width:58,height:58,borderRadius:20,display:'grid',placeItems:'center',background:`${accent}15`,color:accent}}>{icon}</div><div><div style={{fontSize:29,fontWeight:950}}>{title}</div><div style={{fontSize:21,opacity:.55,marginTop:3}}>{sub}</div></div><CheckCircle2 size={34} color="#12B76A"/></Card>;
const Scene4:React.FC<SceneProps>=({duration,accent})=>{
  return <Shell accent={accent} eyebrow="KAPITEL 4 • WAS NUTZER TUN KÖNNEN" seed={31}>
    <StoryBeat startFrame={0} role="CHANGE"><Headline>Cursor bleibt. Und OpenAI nennt drei Umwege.</Headline></StoryBeat>
    <div style={{position:'relative',height:1060,marginTop:40}}>
      <StoryBeat startFrame={at(duration,.04)} direction="down" style={{position:'absolute',left:250,right:250,top:20}}><Card style={{padding:25,textAlign:'center'}}><div style={{fontSize:24,fontWeight:900,opacity:.55}}>CURSOR</div><div style={{fontSize:43,fontWeight:950,marginTop:8}}>APP BLEIBT</div></Card></StoryBeat>
      <StoryBeat startFrame={at(duration,.24)} direction="left" role="CONSEQUENCE" style={{position:'absolute',left:0,right:0,top:260}}><Route title="Eigener API-Key" sub="OpenAI API direkt verbinden" accent={accent} icon={<KeyRound size={36}/>}/></StoryBeat>
      <StoryBeat startFrame={at(duration,.45)} direction="right" role="CONSEQUENCE" style={{position:'absolute',left:0,right:0,top:470}}><Route title="Codex IDE Extension" sub="Codex direkt in Cursor nutzen" accent="#7A5AF8" icon={<Code2 size={36}/>}/></StoryBeat>
      <StoryBeat startFrame={at(duration,.66)} direction="left" role="PAYOFF" style={{position:'absolute',left:0,right:0,top:680}}><Route title="AI Gateway" sub="kompatiblen Anbieter verbinden" accent="#12B76A" icon={<Network size={36}/>}/></StoryBeat>
      <StoryBeat startFrame={at(duration,.84)} direction="up" role="PROOF" style={{position:'absolute',left:100,right:100,bottom:10}}><SourceProofCard source="help.openai.com" date="30.08.2026" label="Using OpenAI models in Cursor" accent={accent} startFrame={at(duration,.84)}/></StoryBeat>
    </div>
  </Shell>;
};

const Gate:React.FC<{label:string;accent:string;icon:React.ReactNode}>=({label,accent,icon})=><div style={{height:210,borderRadius:32,background:'rgba(255,255,255,.94)',border:`2px solid ${accent}35`,boxShadow:'0 18px 52px rgba(16,32,51,.10)',display:'grid',placeItems:'center',textAlign:'center',fontSize:30,fontWeight:950,color:'#102033'}}><div><div style={{color:accent,marginBottom:15}}>{icon}</div>{label}</div></div>;
const Scene5:React.FC<SceneProps>=({duration,accent})=>{
  return <Shell accent={accent} eyebrow="KAPITEL 5 • DER GRÖSSERE PUNKT" seed={41}>
    <StoryBeat startFrame={0} role="PROBLEM"><Headline>Das beste Modell allein entscheidet nicht.</Headline></StoryBeat>
    <div style={{position:'relative',height:1050,marginTop:45}}>
      <StoryBeat startFrame={at(duration,.05)} direction="left" style={{position:'absolute',left:0,top:40,width:285}}><Gate label="MODELL" accent="#2E90FA" icon={<Orbit size={48}/>}/></StoryBeat>
      <StoryBeat startFrame={at(duration,.28)} direction="up" role="CONSEQUENCE" style={{position:'absolute',left:322,top:40,width:285}}><Gate label="VERTRAG" accent="#F79009" icon={<Braces size={48}/>}/></StoryBeat>
      <StoryBeat startFrame={at(duration,.39)} direction="right" role="CONSEQUENCE" style={{position:'absolute',right:0,top:40,width:285}}><Gate label="EIGENTÜMER" accent="#F04438" icon={<Rocket size={48}/>}/></StoryBeat>
      <StoryCamera startFrame={at(duration,.43)} endFrame={at(duration,.68)} fromScale={.98} toScale={1.06}><StoryBeat startFrame={at(duration,.48)} role="CHANGE" style={{position:'absolute',left:90,right:90,top:370}}><Card style={{padding:30,display:'flex',alignItems:'center',justifyContent:'center',gap:24}}><Waypoints size={58} color={accent}/><div style={{fontSize:37,fontWeight:950}}>ALLE DREI BESTIMMEN DEN ZUGANG</div></Card></StoryBeat></StoryCamera>
      <StoryBeat startFrame={at(duration,.64)} direction="up" role="PROOF" style={{position:'absolute',left:100,right:100,top:620}}><SourceProofCard source="OpenAI + Cursor" date="Aug. 2026" label="Primärquellen bestätigen Übernahme, Übergang und Alternativen" accent={accent} startFrame={at(duration,.64)}/></StoryBeat>
      <StoryBeat startFrame={at(duration,.82)} direction="up" role="PAYOFF" style={{position:'absolute',left:40,right:40,bottom:30,textAlign:'center'}}><div style={{fontSize:48,lineHeight:1.05,fontWeight:950,letterSpacing:'-.04em'}}>DEIN KI-TOOL IST AUCH<br/><span style={{color:accent}}>PLATTFORMPOLITIK.</span></div></StoryBeat>
    </div>
  </Shell>;
};

const sceneComponents=[Scene1,Scene2,Scene3,Scene4,Scene5];
const CaptionLayer:React.FC=()=>{const frame=useCurrentFrame();const cue=OPENAI_CURSOR_CUES.find((item)=>frame>=item.startFrame&&frame<item.endFrame);if(!cue)return null;return <div style={{...REEL_CAPTION_WRAPPER_STYLE,zIndex:80}}><div style={{...REEL_CAPTION_GLASS_STYLE,fontFamily:FONT}}>{cue.text}</div></div>;};

export const ReelOpenAICursorSpaceXContract:React.FC<Props>=({voiceoverSrc,showCaptions=true,showSfx=true})=><AbsoluteFill style={{background:'#EFF5FA'}}>
  <Html5Audio src={voiceoverSrc}/>
  {OPENAI_CURSOR_SCENES.map((scene,index)=>{const Scene=sceneComponents[index];if(!Scene)return null;return <Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame-scene.startFrame} name={scene.title}><Scene duration={scene.endFrame-scene.startFrame} accent={scene.accent}/></Sequence>;})}
  <ReelSfxTrack events={OPENAI_CURSOR_SFX} enabled={showSfx}/>
  {showCaptions?<CaptionLayer/>:null}
</AbsoluteFill>;
