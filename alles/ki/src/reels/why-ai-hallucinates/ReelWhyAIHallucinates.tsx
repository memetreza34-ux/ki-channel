import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {hallucinationAsset} from './assets';
import {
  HALLUCINATION_AUDIO,
  HALLUCINATION_DURATION,
  HALLUCINATION_SCENES,
} from './contract';
import {Scene01ConfidenceGlass} from './scenes/Scene01ConfidenceGlass';
import {Scene02ProbabilityRail} from './scenes/Scene02ProbabilityRail';
import {Scene03PatternFiller} from './scenes/Scene03PatternFiller';
import {Scene04RiskDocuments} from './scenes/Scene04RiskDocuments';
import {Scene05VagueAnswer} from './scenes/Scene05VagueAnswer';
import {Scene06DeadSources} from './scenes/Scene06DeadSources';
import {Scene07Contradiction} from './scenes/Scene07Contradiction';
import {Scene08Verification} from './scenes/Scene08Verification';
import {palette} from './style';

export type ReelWhyAIHallucinatesProps = {
  voiceoverSrc?: string;
  showDebugTimeline?: boolean;
  muteVoiceover?: boolean;
};

const SCENE_COMPONENTS = [
  Scene01ConfidenceGlass,
  Scene02ProbabilityRail,
  Scene03PatternFiller,
  Scene04RiskDocuments,
  Scene05VagueAnswer,
  Scene06DeadSources,
  Scene07Contradiction,
  Scene08Verification,
] as const;

const Progress: React.FC<{debug: boolean}> = ({debug}) => {
  const frame=useCurrentFrame();
  const width=interpolate(frame,[0,HALLUCINATION_DURATION-1],[0,100],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <><div style={{position:'absolute',left:0,right:0,top:0,height:8,zIndex:150,background:'rgba(125,73,223,.12)'}}><div style={{width:`${width}%`,height:'100%',background:palette.accent}} /></div>{debug?<div style={{position:'absolute',right:24,top:24,zIndex:160,padding:'10px 14px',borderRadius:12,background:'#17121F',color:'white',fontFamily:'monospace',fontSize:18}}>F{frame}</div>:null}</>;
};

export const ReelWhyAIHallucinates: React.FC<ReelWhyAIHallucinatesProps> = ({
  voiceoverSrc,
  showDebugTimeline=false,
  muteVoiceover=false,
}) => (
  <AbsoluteFill style={{background:palette.background}}>
    {HALLUCINATION_SCENES.map((scene,index)=>{
      const Component=SCENE_COMPONENTS[index];
      return <Sequence key={scene.id} from={scene.start} durationInFrames={scene.end-scene.start} name={`${scene.id}-${scene.animationId}`}><Component /></Sequence>;
    })}
    {!muteVoiceover ? <Audio src={voiceoverSrc ?? hallucinationAsset('voiceover')} playbackRate={HALLUCINATION_AUDIO.playbackRate} volume={1} /> : null}
    <Progress debug={showDebugTimeline} />
  </AbsoluteFill>
);
