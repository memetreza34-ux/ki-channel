import React from 'react';
import {useCurrentFrame} from 'remotion';
import {GlassCard, Pill, SceneFrame, clampProgress} from '../components/ReelChrome';
import {SOURCE_FAILURES} from '../sceneData';
import {palette} from '../style';

export const Scene06DeadSources: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneFrame sceneId="scene-06" kicker="WARNZEICHEN 2 / 3">
      <GlassCard style={{position:'absolute',inset:'70px 20px 40px',overflow:'hidden'}}>
        <div style={{height:82,borderBottom:`2px solid ${palette.line}`,display:'flex',alignItems:'center',gap:12,padding:'0 26px'}}>{[0,1,2].map((dot)=><div key={dot} style={{width:18,height:18,borderRadius:999,background:dot===0?palette.danger:dot===1?palette.warning:palette.success}} />)}<div style={{marginLeft:18,flex:1,height:38,borderRadius:999,background:'#F1EDF5'}} /></div>
        <div style={{padding:30,display:'grid',gap:26}}>{SOURCE_FAILURES.map((source,index)=>{const start=[31,55,79][index];const tested=clampProgress(frame,start,start+22);return <GlassCard key={source.domain} danger={tested>.8} style={{padding:'24px 28px',display:'grid',gridTemplateColumns:'1fr auto',alignItems:'center',opacity:clampProgress(frame,11+index*7,26+index*7)}}><div><div style={{fontSize:29,fontWeight:900}}>{source.domain}</div><div style={{fontSize:23,color:palette.muted,marginTop:6}}>Quelle prüfen</div></div><div style={{minWidth:220,textAlign:'right',fontSize:index===1?20:29,fontWeight:950,color:tested>.8?palette.danger:palette.muted}}>{tested>.8?source.result:'ÖFFNEN …'}</div></GlassCard>;})}</div>
        <Pill tone="danger" style={{position:'absolute',left:'50%',bottom:35,transform:'translateX(-50%)',opacity:clampProgress(frame,103,117)}}>QUELLE NICHT PRÜFBAR</Pill>
      </GlassCard>
    </SceneFrame>
  );
};
