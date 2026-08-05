import React from 'react';
import {useCurrentFrame} from 'remotion';
import {GlassCard, Pill, SceneFrame, clampProgress} from '../components/ReelChrome';
import {VAGUE_PHRASES} from '../sceneData';
import {palette} from '../style';

export const Scene05VagueAnswer: React.FC = () => {
  const frame = useCurrentFrame();
  const answer = clampProgress(frame, 13, 40);
  const scan = clampProgress(frame, 41, 72);
  const questions = clampProgress(frame, 73, 96);
  const collapse = clampProgress(frame, 97, 116);
  return (
    <SceneFrame sceneId="scene-05" kicker="WARNZEICHEN 1 / 3">
      <div style={{position:'absolute',inset:'80px 22px 45px',display:'grid',gridTemplateColumns:'1.45fr .75fr',gap:24}}>
        <GlassCard style={{padding:34,position:'relative',overflow:'hidden'}}>
          <Pill tone="accent">KI-ANTWORT</Pill>
          <div style={{marginTop:34,display:'grid',gap:30}}>{VAGUE_PHRASES.map((phrase,index)=>{const local=clampProgress(frame,13+index*7,26+index*7);return <div key={phrase} style={{fontSize:34,lineHeight:1.18,fontWeight:800,opacity:answer*local,position:'relative'}}>{phrase}<div style={{position:'absolute',left:0,bottom:-8,width:`${scan*82}%`,height:8,borderRadius:999,background:palette.warning}} /></div>;})}</div>
          <div style={{position:'absolute',left:20,right:20,top:`${165+scan*360}px`,height:5,background:palette.accent,opacity:.6}} />
        </GlassCard>
        <GlassCard style={{padding:25,display:'grid',alignContent:'center',gap:28,opacity:questions}}>{['WER?','WELCHE?','WANN?'].map((question)=><div key={question}><div style={{fontSize:28,fontWeight:950,color:palette.danger}}>{question}</div><div style={{height:18,borderRadius:999,background:'#EEEAF3',marginTop:12,overflow:'hidden'}}><div style={{height:'100%',width:`${(1-collapse)*55}%`,background:palette.accentSoft}} /></div></div>)}</GlassCard>
        <Pill tone="danger" style={{position:'absolute',left:'50%',bottom:-10,transform:'translateX(-50%)',opacity:collapse}}>KEINE KONKRETEN DETAILS</Pill>
      </div>
    </SceneFrame>
  );
};
