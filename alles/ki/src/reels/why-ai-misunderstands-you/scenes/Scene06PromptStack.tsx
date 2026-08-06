import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {REEL_COPY} from '../copy';
import {Panel, ResultStrip, SceneFrame, progress, useEnter} from '../components/ReelChrome';
import {palette} from '../style';

const modules=[
  {label:'1 · ZIEL',sub:'Was soll entstehen?',delay:18},
  {label:'2 · KONTEXT',sub:'Was muss die KI wissen?',delay:70},
  {label:'3 · FORMAT + TON',sub:'Wie soll die Antwort aussehen?',delay:124},
  {label:'4 · GRENZEN',sub:'Was darf sich nicht ändern?',delay:172},
] as const;

export const Scene06PromptStack: React.FC = () => {
  const frame=useCurrentFrame();
  const copy=REEL_COPY['scene-06'];
  const compress=progress(frame,202,224);
  return <SceneFrame sceneNumber={6} kicker={copy.kicker} heading={copy.heading} captions={copy.captions}><div style={{position:'absolute',inset:0}}><div style={{position:'absolute',left:170,right:170,top:16}}>{modules.map((module,index)=>{const enter=useEnter(frame,module.delay);const y=index*145;return <Panel key={module.label} tone="accent" style={{position:'absolute',left:0,right:0,top:y,height:118,padding:'20px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',opacity:enter,transform:`translateY(${(1-enter)*34-compress*y*.08}px) scale(${1-compress*.035*index})`}}><div style={{fontSize:29,fontWeight:950,color:palette.accent}}>{module.label}</div><div style={{fontSize:22,fontWeight:760,color:palette.muted,maxWidth:350,textAlign:'right'}}>{module.sub}</div></Panel>;})}</div><div style={{position:'absolute',left:502,top:102,width:6,height:430,background:palette.accent,opacity:progress(frame,50,190),zIndex:-1}}/><ResultStrip text="ZIEL → KONTEXT → FORMAT → GRENZEN" visible={progress(frame,210,228)} tone="success"/></div></SceneFrame>;
};
