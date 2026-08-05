import React from 'react';
import {useCurrentFrame} from 'remotion';
import {GlassCard, Pill, SceneFrame, clampProgress} from '../components/ReelChrome';
import {CONTRADICTION_EXAMPLE} from '../sceneData';
import {palette} from '../style';

const fields = ['year','name','value'] as const;
const labels = {year:'JAHR',name:'NAME',value:'WERT'} as const;

export const Scene07Contradiction: React.FC = () => {
  const frame = useCurrentFrame();
  const left=clampProgress(frame,0,16);
  const ask=clampProgress(frame,17,40);
  const right=clampProgress(frame,41,66);
  const compare=clampProgress(frame,67,94);
  const delta=clampProgress(frame,95,112);
  const renderAnswer=(side:'answerA'|'answerB',opacity:number)=><GlassCard style={{padding:28,opacity}}><Pill tone={side==='answerA'?'accent':'danger'}>{side==='answerA'?'ANTWORT A':'ANTWORT B'}</Pill><div style={{marginTop:28,display:'grid',gap:24}}>{fields.map((field)=><div key={field}><div style={{fontSize:20,fontWeight:900,letterSpacing:3,color:palette.muted}}>{labels[field]}</div><div style={{fontSize:34,fontWeight:950,marginTop:7,color:compare>.7?palette.danger:palette.foreground}}>{CONTRADICTION_EXAMPLE[side][field]}</div></div>)}</div></GlassCard>;
  return (
    <SceneFrame sceneId="scene-07" kicker="WARNZEICHEN 3 / 3">
      <div style={{position:'absolute',inset:'90px 20px 55px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:34}}>
        {renderAnswer('answerA',left)}{renderAnswer('answerB',right)}
        <Pill tone="muted" style={{position:'absolute',left:'50%',top:'45%',transform:`translate(-50%,-50%) scale(${.8+ask*.2})`,opacity:ask,zIndex:5}}>BIST DU SICHER?</Pill>
        {fields.map((field,index)=><div key={field} style={{position:'absolute',left:430,top:245+index*132,width:104,height:8,borderRadius:999,background:palette.danger,transform:`scaleX(${compare})`,opacity:compare}} />)}
        <Pill tone="danger" style={{position:'absolute',left:'50%',bottom:-14,transform:'translateX(-50%)',opacity:delta}}>{CONTRADICTION_EXAMPLE.contradictionCount} WIDERSPRÜCHE · FIKTIVES BEISPIEL</Pill>
      </div>
    </SceneFrame>
  );
};
