import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {misunderstandingAsset} from './assets';
import {MISUNDERSTANDS_AUDIO, MISUNDERSTANDS_DURATION, MISUNDERSTANDS_SCENES} from './contract';
import {Scene01MeaningSplit} from './scenes/Scene01MeaningSplit';
import {Scene02WordsVsIntent} from './scenes/Scene02WordsVsIntent';
import {Scene03MissingGoal} from './scenes/Scene03MissingGoal';
import {Scene04MissingContext} from './scenes/Scene04MissingContext';
import {Scene05TaskCollision} from './scenes/Scene05TaskCollision';
import {Scene06PromptStack} from './scenes/Scene06PromptStack';
import {Scene07BeforeAfter} from './scenes/Scene07BeforeAfter';
import {Scene08SingleCorrection} from './scenes/Scene08SingleCorrection';
import {Scene09ClearInstruction} from './scenes/Scene09ClearInstruction';
import {palette} from './style';

export type ReelWhyAIMisunderstandsYouProps = {
  voiceoverSrc?: string;
  muteVoiceover?: boolean;
  showDebugTimeline?: boolean;
};

const SCENE_COMPONENTS = [
  Scene01MeaningSplit,
  Scene02WordsVsIntent,
  Scene03MissingGoal,
  Scene04MissingContext,
  Scene05TaskCollision,
  Scene06PromptStack,
  Scene07BeforeAfter,
  Scene08SingleCorrection,
  Scene09ClearInstruction,
] as const;

const ProgressBar: React.FC<{debug:boolean}> = ({debug}) => {
  const frame=useCurrentFrame();
  const width=interpolate(frame,[0,MISUNDERSTANDS_DURATION-1],[0,100],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <><div style={{position:'absolute',left:0,right:0,top:0,height:8,zIndex:200,background:'rgba(125,73,223,.12)'}}><div style={{height:'100%',width:`${width}%`,background:palette.accent}}/></div>{debug?<div style={{position:'absolute',right:22,top:22,zIndex:210,padding:'9px 13px',borderRadius:12,background:palette.foreground,color:'white',fontFamily:'monospace',fontSize:18}}>F{frame}</div>:null}</>;
};

export const ReelWhyAIMisunderstandsYou: React.FC<ReelWhyAIMisunderstandsYouProps> = ({voiceoverSrc,muteVoiceover=false,showDebugTimeline=false}) => <AbsoluteFill style={{background:palette.background}}>{MISUNDERSTANDS_SCENES.map((scene,index)=>{const Component=SCENE_COMPONENTS[index];return <Sequence key={scene.id} from={scene.start} durationInFrames={scene.end-scene.start} name={`${scene.id}-${scene.animationId}`}><Component/></Sequence>;})}{!muteVoiceover?<Audio src={voiceoverSrc??misunderstandingAsset('voiceover')} playbackRate={MISUNDERSTANDS_AUDIO.playbackRate} volume={1}/>:null}<ProgressBar debug={showDebugTimeline}/></AbsoluteFill>;
