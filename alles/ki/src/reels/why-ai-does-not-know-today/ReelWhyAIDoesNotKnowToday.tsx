import React from 'react';
import {AbsoluteFill, Audio, Sequence} from 'remotion';
import {SingleSentenceKaraokeCaption} from '../../components/SingleSentenceKaraokeCaption';
import {todayKnowledgeAsset} from './assets';
import {TODAY_SCENE_COMPONENTS} from './scenes';
import {TODAY_CAPTION_CUES, TODAY_SCENES, TODAY_SYNC_STATUS, type TodaySceneId} from './sync';
import {todayFont, todayPalette} from './style';

export type ReelWhyAIDoesNotKnowTodayProps = {
  voiceoverSrc?: string;
  muteVoiceover?: boolean;
};

export const ReelWhyAIDoesNotKnowToday: React.FC<ReelWhyAIDoesNotKnowTodayProps> = ({
  voiceoverSrc,
  muteVoiceover = false,
}) => {
  const playVoiceover = !muteVoiceover && TODAY_SYNC_STATUS === 'final-transcript-aligned';

  return (
    <AbsoluteFill style={{background: todayPalette.background}}>
      {TODAY_SCENES.map((scene) => {
        const Component = TODAY_SCENE_COMPONENTS[scene.id as TodaySceneId];
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
      <SingleSentenceKaraokeCaption
        cues={TODAY_CAPTION_CUES}
        accentColor={todayPalette.accentBright}
        fontFamily={todayFont}
        fontSizePx={48}
      />
      {playVoiceover ? (
        <Audio
          src={voiceoverSrc ?? todayKnowledgeAsset('voiceover')}
          playbackRate={1}
          volume={1}
        />
      ) : null}
    </AbsoluteFill>
  );
};
