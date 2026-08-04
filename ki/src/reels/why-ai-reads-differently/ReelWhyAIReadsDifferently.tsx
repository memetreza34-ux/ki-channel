import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {SceneTransitionBridge} from './components/SceneTransitionBridge';
import {SynthSoundtrack} from './components/SynthSoundtrack';
import {WHY_AI_DURATION_IN_FRAMES, WHY_AI_SCENES} from './contract';
import {AnswerWordAssemblyScene} from './scenes/AnswerWordAssemblyScene';
import {AttentionThreadWeaveScene} from './scenes/AttentionThreadWeaveScene';
import {BrilliantWrongSplitBalanceScene} from './scenes/BrilliantWrongSplitBalanceScene';
import {EmbeddingClusterOrbitScene} from './scenes/EmbeddingClusterOrbitScene';
import {NextTokenBranchRaceScene} from './scenes/NextTokenBranchRaceScene';
import {SentenceTokenShatterScene} from './scenes/SentenceTokenShatterScene';
import {TokenVectorScannerScene} from './scenes/TokenVectorScannerScene';
import {TransformerLayerElevatorScene} from './scenes/TransformerLayerElevatorScene';
import {palette} from './visualUtils';

export type ReelWhyAIReadsDifferentlyProps = {
  voiceoverSrc?: string;
  showDebugTimeline?: boolean;
};

const SCENE_COMPONENTS = [
  SentenceTokenShatterScene,
  TokenVectorScannerScene,
  EmbeddingClusterOrbitScene,
  AttentionThreadWeaveScene,
  NextTokenBranchRaceScene,
  TransformerLayerElevatorScene,
  AnswerWordAssemblyScene,
  BrilliantWrongSplitBalanceScene,
] as const;

const GlobalProgress: React.FC<{debug: boolean}> = ({debug}) => {
  const frame = useCurrentFrame();
  const width = interpolate(frame, [0, WHY_AI_DURATION_IN_FRAMES - 1], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const activeScene = WHY_AI_SCENES.findIndex(
    (scene) => frame >= scene.startFrame && frame < scene.endFrameExclusive,
  );

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 9,
          background: 'rgba(135,87,232,.10)',
          zIndex: 120,
        }}
      >
        <div
          style={{
            width: `${width}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${palette.accentSoft}, ${palette.accent})`,
            boxShadow: '0 0 20px rgba(135,87,232,.5)',
          }}
        />
      </div>
      {debug ? (
        <div
          style={{
            position: 'absolute',
            right: 30,
            top: 30,
            zIndex: 130,
            padding: '10px 14px',
            borderRadius: 12,
            background: 'rgba(20,18,26,.82)',
            color: 'white',
            fontFamily: 'monospace',
            fontSize: 18,
          }}
        >
          F{frame} · S{activeScene + 1}
        </div>
      ) : null}
    </>
  );
};

export const ReelWhyAIReadsDifferently: React.FC<ReelWhyAIReadsDifferentlyProps> = ({
  voiceoverSrc,
  showDebugTimeline = false,
}) => (
  <AbsoluteFill style={{background: palette.background}}>
    {WHY_AI_SCENES.map((scene, index) => {
      const Component = SCENE_COMPONENTS[index];
      return (
        <Sequence
          key={scene.sceneId}
          from={scene.startFrame}
          durationInFrames={scene.durationInFrames}
          name={`${scene.sceneId}-${scene.animationId}`}
        >
          <Component />
        </Sequence>
      );
    })}
    <SceneTransitionBridge />
    <SynthSoundtrack voiceoverSrc={voiceoverSrc} />
    <GlobalProgress debug={showDebugTimeline} />
  </AbsoluteFill>
);
