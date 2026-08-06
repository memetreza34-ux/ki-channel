import React from 'react';
import {AbsoluteFill, Audio, Sequence} from 'remotion';
import {StableSentenceCaption} from '../../components/StableSentenceCaption';
import {contextWindowAsset} from './assets';
import {CONTEXT_SCENE_COMPONENTS} from './scenes';
import {
  CONTEXT_CAPTIONS,
  CONTEXT_SCENES,
  CONTEXT_SYNC_STATUS,
  type ContextSceneId,
} from './sync';
import {contextPalette} from './style';

export type ReelWhyAIForgetsEarlierMessagesProps = {
  voiceoverSrc?: string;
  muteVoiceover?: boolean;
};

export const ReelWhyAIForgetsEarlierMessages: React.FC<ReelWhyAIForgetsEarlierMessagesProps> = ({
  voiceoverSrc,
  muteVoiceover = false,
}) => {
  const playFinalVoiceover = !muteVoiceover && CONTEXT_SYNC_STATUS === 'final-transcript-aligned';

  return (
    <AbsoluteFill style={{background: contextPalette.background}}>
      {CONTEXT_SCENES.map((scene) => {
        const Component = CONTEXT_SCENE_COMPONENTS[scene.id as ContextSceneId];
        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.endFrame - scene.startFrame}
            name={scene.id}
          >
            <Component />
          </Sequence>
        );
      })}

      <StableSentenceCaption cues={CONTEXT_CAPTIONS} accentColor={contextPalette.accent} fontSizePx={50} />

      {playFinalVoiceover ? (
        <Audio src={voiceoverSrc ?? contextWindowAsset('voiceover')} playbackRate={1} volume={1} />
      ) : null}
    </AbsoluteFill>
  );
};