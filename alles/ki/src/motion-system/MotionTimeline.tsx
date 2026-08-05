import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {MotionScene} from './MotionScene';
import type {MotionTimeline} from './timeline';

export type MotionTimelineCompositionProps = {
  timeline: MotionTimeline;
};

export const MotionTimelineComposition: React.FC<MotionTimelineCompositionProps> = ({
  timeline,
}) => (
  <AbsoluteFill style={{background: '#FFFFFF', overflow: 'hidden'}}>
    {timeline.scenes.map((scene) => (
      <Sequence
        key={`${scene.storyboard.id}-${scene.index}`}
        from={scene.startFrame}
        durationInFrames={scene.durationInFrames}
      >
        <MotionScene storyboard={scene.storyboard} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
