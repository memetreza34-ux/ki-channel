import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {REEL_COPY} from '../copy';
import {Badge, Panel, ResultStrip, SceneFrame, progress, useEnter} from '../components/ReelChrome';
import {palette} from '../style';

export const Scene08SingleCorrection: React.FC = () => {
  const frame=useCurrentFrame();
  const copy=REEL_COPY['scene-08'];
  const check=progress(frame,24,72);
  const pass=progress(frame,76,132);
  const converge=progress(frame,126,164);
  const tokenX=interpolate(pass,[0,1],[-260,120]);
  return <SceneFrame sceneNumber={8} kicker={copy.kicker} heading={copy.heading} captions={copy.captions}><div style={{position:'absolute',inset:0}}><Panel tone="neutral" style={{position:'absolute',left:80,top:56,width:360,height:230,padding:28}}><Badge tone="muted">ANTWORT 1</Badge><div style={{marginTop:30,display:'flex',flexDirection:'column',gap:16}}>{[82,96,70].map((width,index)=><div key={index} style={{height:18,width:`${width}%`,borderRadius:99,background:index===1?palette.danger:palette.line,opacity:index===1?.3+.7*check:1}}/>)}</div></Panel><div style={{position:'absolute',left:478,top:120,width:120,height:120,borderRadius:30,border:`4px solid ${palette.accent}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:52,fontWeight:950,color:palette.accent}}>1</div><div style={{position:'absolute',left:500,top:242,width:6,height:250,background:palette.line}}/><div style={{position:'absolute',left:500+tokenX,top:385}}><Badge tone="accent">EINE KORREKTUR</Badge></div><Panel tone="success" style={{position:'absolute',right:80,top:470,width:380,height:230,padding:28,opacity:.25+.75*converge,transform:`translateX(${(1-converge)*44}px)`}}><Badge tone="success">ANTWORT 2</Badge><div style={{marginTop:30,display:'flex',flexDirection:'column',gap:16}}>{[88,92,84].map((width,index)=><div key={index} style={{height:18,width:`${width}%`,borderRadius:99,background:index===1?palette.success:palette.line}}/>)}</div></Panel><ResultStrip text="EINE ÄNDERUNG PRO NACHFRAGE" visible={progress(frame,158,176)} tone="success"/></div></SceneFrame>;
};
