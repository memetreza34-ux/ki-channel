import React from 'react';
import {Composition, Folder} from 'remotion';
import {MOTION_CANVAS} from './layout';
import {MotionScene} from './MotionScene';
import {MotionTimelineComposition} from './MotionTimeline';
import {MOTION_EXAMPLES} from './examples';
import {motionVisualTypeSchema, type MotionVisualType} from './schema';
import {
  MOTION_TIMELINE_COMPOSITION_ID,
  MOTION_TIMELINE_EXAMPLE,
} from './timelineExamples';

export const MOTION_PREVIEW_TYPES = [...motionVisualTypeSchema.options] as MotionVisualType[];

export const toMotionCompositionId = (type: MotionVisualType) =>
  `Motion-${type}`.replace(/(^|-)([a-z])/g, (_, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`);

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
