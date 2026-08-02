import React from 'react';
import {Composition, Folder} from 'remotion';
import {MotionScene} from './MotionScene';
import {MOTION_EXAMPLES} from './examples';
import {motionVisualTypeSchema, type MotionVisualType} from './schema';

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
          width={1080}
          height={1920}
        />
      );
    })}
  </Folder>
);
