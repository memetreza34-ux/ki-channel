import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {REEL_COPY} from '../copy';
import {Badge, Panel, ResultStrip, SceneFrame, progress} from '../components/ReelChrome';
import {palette} from '../style';

export const Scene03MissingGoal: React.FC = () => {
  const frame=useCurrentFrame();
  const copy=REEL_COPY['scene-03'];
  const options=['ERKLÄREN','KÜRZEN','UMSCHREIBEN'];
  const choose=progress(frame,65,132);
  const pointerX=interpolate(choose,[0,.25,.5,.75,1],[70,620,220,760,620]);
  const settled=progress(frame,132,158);
  return <SceneFrame sceneNumber={3} kicker={copy.kicker} heading={copy.heading} captions={copy.captions}><div style={{position:'absolute',inset:0}}><Panel tone="danger" style={{position:'absolute',left:250,right:250,top:28,height:116,display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,fontWeight:950,borderStyle:'dashed'}}>ZIEL: LEER</Panel><div style={{position:'absolute',left:24,right:24,top:270,display:'flex',justifyContent:'space-between'}}>{options.map((option,index)=><Panel key={option} tone={index===1&&settled>.7?'warning':'neutral'} style={{width:280,height:180,display:'flex',alignItems:'center',justifyContent:'center',fontSize:27,fontWeight:950}}>{option}</Panel>)}</div><div style={{position:'absolute',left:78+pointerX,top:218,width:0,height:0,borderLeft:'22px solid transparent',borderRight:'22px solid transparent',borderTop:`34px solid ${palette.warning}`,filter:'drop-shadow(0 8px 12px rgba(217,130,43,.25))'}}/><Badge tone="warning" style={{position:'absolute',left:340,top:520,width:320}}>AUSWAHL OHNE RICHTUNG</Badge><ResultStrip text="ZIEL FEHLT = KI MUSS RATEN" visible={progress(frame,151,170)} tone="warning"/></div></SceneFrame>;
};
