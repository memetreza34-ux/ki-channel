import React from 'react';
import {Composition} from 'remotion';
import {ThreeDemo} from '@studio/core/three';
import {BRAND} from '../brand/brand';
import {MotionPreviewRoot} from './motion-system/MotionPreviewRoot';
import {
  HALLUCINATION_COMPOSITION_ID,
  HALLUCINATION_DURATION,
  HALLUCINATION_FPS,
  HALLUCINATION_HEIGHT,
  HALLUCINATION_WIDTH,
  ReelWhyAIHallucinates,
} from './reels/why-ai-hallucinates';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Three3D"
      component={ThreeDemo as React.FC}
      defaultProps={{color: BRAND.accent}}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id={HALLUCINATION_COMPOSITION_ID}
      component={ReelWhyAIHallucinates}
      defaultProps={{showDebugTimeline:false,muteVoiceover:false}}
      durationInFrames={HALLUCINATION_DURATION}
      fps={HALLUCINATION_FPS}
      width={HALLUCINATION_WIDTH}
      height={HALLUCINATION_HEIGHT}
    />
    <MotionPreviewRoot />
  </>
);
