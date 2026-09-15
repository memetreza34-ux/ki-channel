import React from 'react';
import {Html5Audio, Sequence, staticFile} from 'remotion';

export type ReelResolvedSfxEvent = {
  id: string;
  sceneId: string;
  startFrame: number;
  durationInFrames: number;
  volume: number;
  staticFile: string;
  selectedRole?: string;
  soundId?: string;
};

type Props = {
  events: ReelResolvedSfxEvent[];
  enabled?: boolean;
};

export const ReelSfxTrack: React.FC<Props> = ({events, enabled = true}) => {
  if (!enabled || !events?.length) return null;
  return (
    <>
      {events.map((event) => (
        <Sequence key={event.id} from={event.startFrame} durationInFrames={event.durationInFrames} name={`SFX ${event.id}`}>
          <Html5Audio src={staticFile(event.staticFile)} volume={event.volume} />
        </Sequence>
      ))}
    </>
  );
};
