import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {REEL_COPY} from '../copy';
import {Panel, ResultStrip, SceneFrame, progress, useEnter} from '../components/ReelChrome';
import {palette} from '../style';

export const Scene01MeaningSplit: React.FC = () => {
  const frame=useCurrentFrame();
  const copy=REEL_COPY['scene-01'];
  const promptIn=useEnter(frame,8);
  const split=progress(frame,38,112);
  const lock=progress(frame,118,160);
  const leftX=interpolate(split,[0,1],[0,-245]);
  const rightX=interpolate(split,[0,1],[0,245]);
  return <SceneFrame sceneNumber={1} kicker={copy.kicker} heading={copy.heading} captions={copy.captions}><div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}><Panel tone="accent" style={{position:'absolute',top:44,width:480,height:112,display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,fontWeight:950,transform:`translateY(${(1-promptIn)*44}px) scale(${.92+.08*promptIn})`,opacity:promptIn}}>DEINE NACHRICHT</Panel><div style={{position:'absolute',top:250,width:164,height:164,transform:'rotate(45deg)',borderRadius:34,border:`4px solid ${palette.accent}`,background:'rgba(255,255,255,.76)',boxShadow:'0 24px 70px rgba(125,73,223,.24)'}}/><div style={{position:'absolute',top:320,left:'50%',width:6,height:310,background:palette.line,transform:'translateX(-50%)'}}/><Panel tone="accent" style={{position:'absolute',top:560,left:'50%',width:330,height:130,marginLeft:-165,transform:`translateX(${leftX}px)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:31,fontWeight:950}}>GEMEINT</Panel><Panel tone="danger" style={{position:'absolute',top:560,left:'50%',width:330,height:130,marginLeft:-165,transform:`translateX(${rightX}px)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:31,fontWeight:950}}>VERSTANDEN</Panel><div style={{position:'absolute',top:602,left:'50%',fontSize:74,fontWeight:950,color:palette.danger,opacity:lock,transform:`translateX(-50%) scale(${.7+.3*lock})`}}>≠</div><ResultStrip text="GEMEINT ≠ VERSTANDEN" visible={progress(frame,154,176)} tone="danger"/></div></SceneFrame>;
};
