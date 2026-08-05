import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {AssetImage, Pill, SceneFrame, clampProgress} from '../components/ReelChrome';
import {palette, shadows} from '../style';

export const Scene03PatternFiller: React.FC = () => {
  const frame = useCurrentFrame();
  const gap = clampProgress(frame, 35, 54);
  const feed = clampProgress(frame, 55, 88);
  const press = clampProgress(frame, 89, 108);
  const result = clampProgress(frame, 109, 123);
  return (
    <SceneFrame sceneId="scene-03" kicker="MUSTER STATT BELEG">
      <div style={{position:'absolute',inset:0}}>
        <AssetImage assetId="scene03" objectFit="contain" style={{transform:`scale(${1+Math.sin(Math.PI*press)*.018})`}} />
        <Pill tone="danger" style={{position:'absolute',left:70,top:310,opacity:gap}}>QUELLE FEHLT</Pill>
        <div style={{position:'absolute',left:355,top:390,width:250,height:220,border:`5px dashed ${palette.danger}`,borderRadius:28,opacity:gap,boxShadow:`0 0 30px ${palette.danger}22`}} />
        {[0,1,2].map((index)=>{
          const x=interpolate(feed,[0,1],[90+index*320,430+index*24]);
          const y=interpolate(feed,[0,1],[760-index*90,490+index*42]);
          return <div key={index} style={{position:'absolute',left:x,top:y,width:88,height:88,borderRadius:index===1?999:20,background:index===2?palette.accentSoft:palette.accent,transform:`rotate(${feed*(index-1)*80}deg) scale(${.72+feed*.28})`,boxShadow:shadows.soft}} />;
        })}
        <div style={{position:'absolute',right:65,top:515,width:260,height:170,borderRadius:30,background:'white',border:`2px solid ${palette.line}`,boxShadow:shadows.card,opacity:result,transform:`translateX(${(1-result)*80}px)`,display:'flex',alignItems:'center',justifyContent:'center'}}><Pill tone="accent">PLAUSIBEL</Pill></div>
      </div>
    </SceneFrame>
  );
};
