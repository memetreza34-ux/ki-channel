import React from 'react';
import {useCurrentFrame} from 'remotion';
import {REEL_COPY} from '../copy';
import {Panel, ResultStrip, SceneFrame, progress, useEnter} from '../components/ReelChrome';
import {palette} from '../style';

export const Scene04MissingContext: React.FC = () => {
  const frame=useCurrentFrame();
  const copy=REEL_COPY['scene-04'];
  const missing=new Set([1,3,5]);
  const labels=['FAKT','LÜCKE','FAKT','LÜCKE','FAKT','LÜCKE'];
  return <SceneFrame sceneNumber={4} kicker={copy.kicker} heading={copy.heading} captions={copy.captions}><div style={{position:'absolute',inset:0}}><div style={{position:'absolute',left:120,right:120,top:38,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:22}}>{labels.map((label,index)=>{const isMissing=missing.has(index);const fill=useEnter(frame,78+(index%3)*26);return <Panel key={index} tone={isMissing?'warning':'neutral'} style={{height:176,display:'flex',alignItems:'center',justifyContent:'center',fontSize:27,fontWeight:950,borderStyle:isMissing&&fill<.95?'dashed':'solid',opacity:isMissing?.35+.65*fill:1,transform:isMissing?`scale(${.88+.12*fill})`:'none',background:isMissing&&fill>.05?palette.warningSoft:undefined}}>{isMissing?fill>.45?`ANNAHME ${Math.ceil(index/2)}`:'KONTEXT FEHLT':label}</Panel>;})}</div><Panel style={{position:'absolute',left:150,right:150,top:455,height:130,padding:'26px 30px'}}><div style={{display:'flex',justifyContent:'space-between',fontSize:24,fontWeight:900,marginBottom:18}}><span style={{color:palette.success}}>FAKTEN</span><span style={{color:palette.warning}}>ANNAHMEN</span></div><div style={{height:26,borderRadius:99,background:palette.line,overflow:'hidden'}}><div style={{height:'100%',width:`${40+45*progress(frame,72,146)}%`,marginLeft:'auto',background:palette.warning,borderRadius:99}}/></div></Panel><ResultStrip text="FEHLENDER KONTEXT WIRD DURCH ANNAHMEN ERSETZT" visible={progress(frame,150,173)} tone="warning"/></div></SceneFrame>;
};
