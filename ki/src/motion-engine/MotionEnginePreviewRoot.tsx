import React from 'react';
import {Composition} from 'remotion';
import {
  MOTION_ENGINE_LAB_DURATION,
  MOTION_ENGINE_LAB_FPS,
  MOTION_ENGINE_LAB_ID,
  MotionEngineLab,
} from './MotionEngineLab';

export const MotionEnginePreviewRoot: React.FC = () => (
  <Composition
    id={MOTION_ENGINE_LAB_ID}
    component={MotionEngineLab}
    durationInFrames={MOTION_ENGINE_LAB_DURATION}
    fps={MOTION_ENGINE_LAB_FPS}
    width={1080}
    height={1920}
  />
);
