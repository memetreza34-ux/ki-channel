import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {AstraBeatScene} from './AstraVisualWorlds';
import {ASTRA_COLORS} from './design';
import {assertAstraTimeline, type AstraTimeline} from './types';

export type AstraLongformProps = {
  timeline: AstraTimeline;
  showVoiceover?: boolean;
};

export const AstraLongform: React.FC<AstraLongformProps> = ({timeline, showVoiceover = true}) => {
  assertAstraTimeline(timeline);
  return (
    <AbsoluteFill style={{backgroundColor: ASTRA_COLORS.background}}>
      {timeline.beats.map((beat) => (
        <Sequence
          key={beat.id}
          from={beat.startFrame}
          durationInFrames={beat.endFrame - beat.startFrame}
          layout="absolute-fill"
        >
          <AstraBeatScene beat={beat} />
        </Sequence>
      ))}
      {showVoiceover ? <Audio src={staticFile(timeline.voiceoverStaticPath)} /> : null}
    </AbsoluteFill>
  );
};
