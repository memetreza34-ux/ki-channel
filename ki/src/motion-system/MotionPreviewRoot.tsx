import React from 'react';
import {Composition, Folder} from 'remotion';
import {
  MOTION_TIMELINE_COMPOSITION_ID,
  toMotionCompositionId,
} from './compositionIds';
import {MOTION_CANVAS} from './layout';
import {MotionScene} from './MotionScene';
import {MotionTimelineComposition} from './MotionTimeline';
import {MOTION_EXAMPLES} from './examples';
import {MOTION_RENDER_CONFIG} from './renderConfig';
import {MOTION_TIMELINE_EXAMPLE} from './timelineExamples';

export {toMotionCompositionId} from './compositionIds';

export const MOTION_PREVIEW_TYPES = [...MOTION_RENDER_CONFIG.visualTypes];

export const MotionPreviewRoot: React.FC = () => (
  <Folder name="Motion-System-Preview">
    {MOTION_PREVIEW_TYPES.map((type) => {
      const storyboard = MOTION_EXAMPLES[type];
      return (
        <Composition
          key={type}
          id={toMotionCompositionId(type)}
          component={MotionScene}
          defaultProps={{storyboard}}
          durationInFrames={storyboard.durationInFrames}
          fps={storyboard.fps}
          width={MOTION_CANVAS.width}
          height={MOTION_CANVAS.height}
        />
      );
    })}

    <Composition
      id={MOTION_TIMELINE_COMPOSITION_ID}
      component={MotionTimelineComposition}
      defaultProps={{timeline: MOTION_TIMELINE_EXAMPLE}}
      durationInFrames={MOTION_TIMELINE_EXAMPLE.totalDurationInFrames}
      fps={MOTION_TIMELINE_EXAMPLE.fps}
      width={MOTION_CANVAS.width}
      height={MOTION_CANVAS.height}
    />
  </Folder>
);
