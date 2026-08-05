import React from 'react';
import {useCurrentFrame} from 'remotion';
import {AssetImage, Pill, SceneFrame, clampProgress} from '../components/ReelChrome';
import {palette} from '../style';

const regions = [
  {label:'NAMEN',left:80,top:185},
  {label:'ZAHLEN',left:540,top:185},
  {label:'STUDIEN',left:80,top:620},
  {label:'AKTUELLES',left:540,top:620},
] as const;

export const Scene04RiskDocuments: React.FC = () => {
  const frame = useCurrentFrame();
  const focus = frame<33?0:frame<53?1:frame<75?2:3;
  const meter = clampProgress(frame, 97, 114);
  return (
    <SceneFrame sceneId="scene-04" kicker="HOHES PRÜFRISIKO">
      <div style={{position:'absolute',inset:0,borderRadius:42,overflow:'hidden'}}>
        <AssetImage assetId="scene04" objectFit="cover" />
        {regions.map((region,index)=>{
          const active=focus===index && frame>=13;
          return <div key={region.label} style={{position:'absolute',left:region.left,top:region.top,width:340,height:300,borderRadius:34,border:`${active?7:2}px solid ${active?palette.danger:palette.line}`,boxShadow:active?`0 0 0 10px ${palette.danger}18`:'none',transition:'none'}}><Pill tone={active?'danger':'muted'} style={{position:'absolute',left:18,top:18}}>{region.label}</Pill>{index===3&&frame>=75?<Pill tone="danger" style={{position:'absolute',right:18,bottom:18}}>DATUM PRÜFEN</Pill>:null}</div>;
        })}
        <div style={{position:'absolute',left:145,right:145,bottom:48,height:28,borderRadius:999,background:'#EEEAF3',overflow:'hidden'}}><div style={{width:`${meter*100}%`,height:'100%',background:`linear-gradient(90deg,${palette.warning},${palette.danger})`,borderRadius:999}} /></div>
        <Pill tone="danger" style={{position:'absolute',left:'50%',bottom:86,transform:'translateX(-50%)',opacity:meter}}>RISIKO: HOCH</Pill>
      </div>
    </SceneFrame>
  );
};
