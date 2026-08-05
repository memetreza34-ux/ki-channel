import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {GlassCard, Pill, SceneFrame, clampProgress} from '../components/ReelChrome';
import {PROBABILITY_CANDIDATES} from '../sceneData';
import {palette} from '../style';

export const Scene02ProbabilityRail: React.FC = () => {
  const frame = useCurrentFrame();
  const open = clampProgress(frame, 30, 55);
  const values = clampProgress(frame, 65, 92);
  const gate = clampProgress(frame, 93, 108);
  const winner = clampProgress(frame, 109, 122);
  return (
    <SceneFrame sceneId="scene-02" kicker="WAHRSCHEINLICHKEIT">
      <div style={{position:'absolute',inset:'70px 20px 40px'}}>
        <GlassCard style={{padding:28,fontSize:38,fontWeight:900}}>Die neue KI ist <span style={{color:palette.accent}}>…</span></GlassCard>
        <div style={{position:'absolute',left:20,right:20,top:170,height:660}}>
          {PROBABILITY_CANDIDATES.map((candidate,index)=>{
            const row = clampProgress(frame, 34+index*6, 52+index*6);
            const selected = index===0;
            return (
              <div key={candidate.word} style={{position:'absolute',left:0,right:0,top:index*128,height:102,opacity:row,transform:`translateX(${(1-row)*70}px)`}}>
                <GlassCard success={selected && winner>.5} style={{height:'100%',display:'flex',alignItems:'center',padding:'0 28px',gap:22}}>
                  <div style={{width:210,fontSize:34,fontWeight:900}}>{candidate.word}</div>
                  <div style={{flex:1,height:22,borderRadius:999,background:'#EEEAF3',overflow:'hidden'}}><div style={{height:'100%',width:`${candidate.value*values}%`,background:selected?palette.accent:palette.accentSoft,borderRadius:999}} /></div>
                  <div style={{width:94,textAlign:'right',fontSize:34,fontWeight:950}}>{Math.round(candidate.value*values)}%</div>
                </GlassCard>
              </div>
            );
          })}
        </div>
        <div style={{position:'absolute',left:0,right:0,bottom:36,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{position:'relative',opacity:gate}}><Pill tone="muted">WAHRHEIT</Pill><div style={{position:'absolute',left:-8,right:-8,top:'48%',height:8,background:palette.danger,transform:`rotate(-8deg) scaleX(${gate})`,borderRadius:999}} /></div>
          <Pill tone="accent" style={{opacity:open}}>VEREINFACHTES BEISPIEL · 100 %</Pill>
        </div>
        <div style={{position:'absolute',left:interpolate(winner,[0,1],[70,590]),top:interpolate(winner,[0,1],[195,40]),padding:'16px 26px',borderRadius:22,background:palette.accent,color:'white',fontSize:30,fontWeight:950,opacity:winner}}>schneller</div>
      </div>
    </SceneFrame>
  );
};
