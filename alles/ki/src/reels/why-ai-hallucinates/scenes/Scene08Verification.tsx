import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {AssetImage, GlassCard, Pill, SceneFrame, clampProgress} from '../components/ReelChrome';
import {palette, shadows} from '../style';

const gates = [
  {label:'GEGENPRÜFEN',start:13},
  {label:'ORIGINALQUELLE',start:41},
  {label:'BELEG VERLANGEN',start:71},
] as const;

export const Scene08Verification: React.FC = () => {
  const frame=useCurrentFrame();
  const verified=clampProgress(frame,99,112);
  const contrast=clampProgress(frame,113,128);
  const travel=clampProgress(frame,13,98);
  return (
    <SceneFrame sceneId="scene-08" kicker="PRÜFEN STATT VERTRAUEN">
      <div style={{position:'absolute',inset:0,borderRadius:42,overflow:'hidden'}}>
        <AssetImage assetId="scene08" objectFit="cover" />
        <div style={{position:'absolute',left:50,right:50,top:225,display:'flex',justifyContent:'space-between'}}>{gates.map((gate,index)=>{const active=clampProgress(frame,gate.start,gate.start+22);return <div key={gate.label} style={{width:270,height:150,borderRadius:30,border:`4px solid ${active>.8?palette.success:palette.line}`,background:'rgba(255,255,255,.92)',boxShadow:shadows.soft,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:14,fontSize:24,fontWeight:950,color:active>.8?palette.success:palette.foreground,transform:`translateY(${(1-active)*24}px)`,opacity:.55+.45*active}}>{gate.label}</div>;})}</div>
        <GlassCard success={verified>.8} style={{position:'absolute',left:interpolate(travel,[0,1],[55,670]),top:650,width:240,height:160,display:'flex',alignItems:'center',justifyContent:'center',background:verified>.8?'rgba(40,184,126,.12)':'rgba(255,255,255,.95)'}}><Pill tone={verified>.8?'success':'accent'}>{verified>.8?'GEPRÜFT':'AUSSAGE'}</Pill></GlassCard>
        <GlassCard style={{position:'absolute',right:75,top:865,width:270,height:155,display:'flex',alignItems:'center',justifyContent:'center',opacity:contrast}}><Pill tone="accent">SICHER</Pill></GlassCard>
        <div style={{position:'absolute',right:98,top:1035,fontSize:50,fontWeight:950,color:palette.danger,opacity:contrast}}>SICHER ≠ WAHR</div>
        <Pill tone="success" style={{position:'absolute',left:'50%',bottom:30,transform:'translateX(-50%)',opacity:clampProgress(frame,118,132)}}>KI-ANTWORTEN PRÜFEN</Pill>
      </div>
    </SceneFrame>
  );
};
