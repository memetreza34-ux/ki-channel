import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {REEL_COPY} from '../copy';
import {Panel, ResultStrip, SceneFrame, progress} from '../components/ReelChrome';
import {palette} from '../style';

const tasks=[
  {label:'KÜRZER',x:-330,y:-210},
  {label:'DETAILLIERTER',x:330,y:-210},
  {label:'LOCKER',x:-330,y:210},
  {label:'FORMELL',x:330,y:210},
] as const;

export const Scene05TaskCollision: React.FC = () => {
  const frame=useCurrentFrame();
  const copy=REEL_COPY['scene-05'];
  const collide=progress(frame,35,108);
  const order=progress(frame,132,190);
  return <SceneFrame sceneNumber={5} kicker={copy.kicker} heading={copy.heading} captions={copy.captions}><div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{position:'absolute',width:180,height:520,borderRadius:90,border:`3px solid ${palette.line}`,background:'rgba(255,255,255,.55)'}}/>{tasks.map((task,index)=>{const collisionX=interpolate(collide,[0,1],[task.x,0]);const collisionY=interpolate(collide,[0,1],[task.y,0]);const orderedX=interpolate(order,[0,1],[collisionX,0]);const orderedY=interpolate(order,[0,1],[collisionY,-225+index*150]);return <Panel key={task.label} tone={order>.6?'accent':collide>.75?'danger':'neutral'} style={{position:'absolute',width:300,height:112,display:'flex',alignItems:'center',justifyContent:'center',fontSize:27,fontWeight:950,transform:`translate(${orderedX}px, ${orderedY}px) rotate(${(1-order)*(index%2===0?-4:4)}deg)`,zIndex:10+index}}>{task.label}</Panel>;})}<div style={{position:'absolute',fontSize:92,fontWeight:950,color:palette.danger,opacity:progress(frame,96,126)*(1-order)}}>!</div><ResultStrip text="REIHENFOLGE STATT AUFGABEN-KONFLIKT" visible={progress(frame,188,204)} tone="accent"/></div></SceneFrame>;
};
