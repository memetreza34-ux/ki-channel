import React from 'react';
import {useCurrentFrame} from 'remotion';
import {REEL_COPY} from '../copy';
import {Badge, Panel, ResultStrip, SceneFrame, progress, useEnter} from '../components/ReelChrome';
import {palette} from '../style';

const requirements=[
  {label:'ABSATZ VERSTÄNDLICHER',delay:96},
  {label:'ALLE FAKTEN BEHALTEN',delay:142},
  {label:'HÖCHSTENS 5 SÄTZE',delay:176},
] as const;

export const Scene07BeforeAfter: React.FC = () => {
  const frame=useCurrentFrame();
  const copy=REEL_COPY['scene-07'];
  const vague=useEnter(frame,10);
  const clarity=progress(frame,92,206);
  return <SceneFrame sceneNumber={7} kicker={copy.kicker} heading={copy.heading} captions={copy.captions}><div style={{position:'absolute',inset:0}}><Panel tone="danger" style={{position:'absolute',left:24,top:92,width:350,height:310,padding:28,opacity:vague,transform:`scale(${.9+.1*vague})`}}><Badge tone="danger">VAGE</Badge><div style={{fontSize:37,fontWeight:950,marginTop:54}}>„MACH DAS BESSER“</div><div style={{display:'flex',gap:10,marginTop:48}}>{[0,1,2].map((item)=><div key={item} style={{flex:1,height:16,borderRadius:99,background:palette.danger,opacity:.18+item*.1,filter:'blur(4px)'}}/>)}</div></Panel><div style={{position:'absolute',left:410,top:220,fontSize:74,color:palette.accent,fontWeight:950}}>→</div><Panel tone="accent" style={{position:'absolute',right:24,top:34,width:500,height:500,padding:28}}><Badge>KLAR</Badge><div style={{marginTop:26,display:'flex',flexDirection:'column',gap:20}}>{requirements.map((requirement,index)=>{const enter=useEnter(frame,requirement.delay);return <Panel key={requirement.label} tone={index===1?'success':'accent'} style={{height:104,padding:'0 22px',display:'flex',alignItems:'center',fontSize:24,fontWeight:950,opacity:enter,transform:`translateX(${(1-enter)*38}px)`}}>{requirement.label}</Panel>;})}</div></Panel><Panel style={{position:'absolute',left:170,right:170,top:570,height:108,padding:'22px 28px'}}><div style={{fontSize:22,fontWeight:900,marginBottom:14}}>EINDEUTIGKEIT</div><div style={{height:24,borderRadius:99,background:palette.line,overflow:'hidden'}}><div style={{height:'100%',width:`${18+82*clarity}%`,background:palette.success,borderRadius:99}}/></div></Panel><ResultStrip text="KONKRETE ANFORDERUNGEN SCHLAGEN VAGE WÜNSCHE" visible={progress(frame,202,222)} tone="success"/></div></SceneFrame>;
};
