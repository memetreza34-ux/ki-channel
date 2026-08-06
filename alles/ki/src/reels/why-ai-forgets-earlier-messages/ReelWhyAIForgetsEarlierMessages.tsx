import React from 'react';
import {AbsoluteFill, Audio, Sequence} from 'remotion';
import {DualSentenceKaraokeCaption} from '../../components/DualSentenceKaraokeCaption';
import {contextWindowAsset} from './assets';
import {CONTEXT_SCENE_COMPONENTS} from './scenes';
import {
  CONTEXT_CAPTION_PAIRS,
  CONTEXT_SCENES,
  CONTEXT_SYNC_STATUS,
  type ContextSceneId,
} from './sync';
import {contextFont, contextPalette} from './style';

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

      <DualSentenceKaraokeCaption
        cues={CONTEXT_CAPTION_PAIRS}
        accentColor={contextPalette.accentBright}
        fontFamily={contextFont}
        fontSizePx={44}
      />

      {playFinalVoiceover ? (
        <Audio src={voiceoverSrc ?? contextWindowAsset('voiceover')} playbackRate={1} volume={1} />
      ) : null}
    </AbsoluteFill>
  );
};
