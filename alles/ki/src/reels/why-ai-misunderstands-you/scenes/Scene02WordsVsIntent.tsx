import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {REEL_COPY} from '../copy';
import {Badge, Panel, ResultStrip, SceneFrame, progress, useEnter} from '../components/ReelChrome';
import {palette} from '../style';

export const Scene02WordsVsIntent: React.FC = () => {
  const frame=useCurrentFrame();
  const copy=REEL_COPY['scene-02'];
  const scanner=progress(frame,88,178);
  const intent=useEnter(frame,130);
  const noise=progress(frame,55,100);
  const scannerX=interpolate(scanner,[0,1],[40,760]);
  const words=['WÖRTER','FORMAT','TON'];
  return <SceneFrame sceneNumber={2} kicker={copy.kicker} heading={copy.heading} captions={copy.captions}><div style={{position:'absolute',inset:0}}><Panel style={{position:'absolute',left:28,right:28,top:90,height:410,overflow:'hidden'}}><div style={{position:'absolute',left:54,right:54,top:74,display:'flex',gap:28}}>{words.map((word)=><Panel key={word} tone="accent" style={{width:220,height:110,display:'flex',alignItems:'center',justifyContent:'center',fontSize:27,fontWeight:950}}>{word}</Panel>)}</div><div style={{position:'absolute',left:54,right:54,top:250,height:94,borderRadius:24,border:`2px dashed ${palette.line}`,display:'flex',alignItems:'center',padding:'0 24px',gap:18}}>{[0,1,2,3,4].map((item)=><div key={item} style={{height:16,width:90,borderRadius:99,background:item%2===0?palette.muted:palette.line,opacity:.28+.42*noise}}/>)}</div><div style={{position:'absolute',top:34,bottom:34,left:scannerX,width:8,borderRadius:99,background:palette.accent,boxShadow:'0 0 24px rgba(125,73,223,.55)'}}/><Badge style={{position:'absolute',right:42,bottom:28}}>SCANNER SIEHT TEXT</Badge></Panel><div style={{position:'absolute',left:230,right:230,top:540,height:260,borderRadius:42,background:'rgba(255,255,255,.44)',backdropFilter:'blur(18px)',border:`3px solid ${palette.line}`,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:130,height:130,borderRadius:'50%',background:'radial-gradient(circle at 35% 30%, #D7C5FF, #7D49DF)',boxShadow:'0 0 70px rgba(125,73,223,.45)',opacity:.45+.55*intent}}/><div style={{position:'absolute',bottom:24,fontSize:27,fontWeight:950,color:palette.muted}}>ABSICHT HINTER DER BARRIERE</div></div><ResultStrip text="WÖRTER SICHTBAR · ABSICHT UNSICHTBAR" visible={progress(frame,192,218)} tone="accent"/></div></SceneFrame>;
};
