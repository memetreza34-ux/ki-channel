import React from 'react';
import {Composition, Folder} from 'remotion';
import {MotionScene} from './MotionScene';
import {MOTION_EXAMPLES} from './examples';
import type {MotionVisualType} from './schema';

const TYPES = Object.keys(MOTION_EXAMPLES) as MotionVisualType[];

const toCompositionId = (type: MotionVisualType) =>
  `Motion-${type}`.replace(/(^|-)([a-z])/g, (_, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`);

export const MotionPreviewRoot: React.FC = () => (
  <Folder name="Motion-System-Preview">
    {TYPES.map((type) => {
      const storyboard = MOTION_EXAMPLES[type];
      return (
        <Composition
          key={type}
          id={toCompositionId(type)}
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
