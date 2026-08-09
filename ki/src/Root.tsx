import React from 'react';
import {Composition, Folder} from 'remotion';
import {ThreeDemo} from '@studio/core/three';
import {BRAND} from '../brand/brand';
import {MotionPreviewRoot} from './motion-system/MotionPreviewRoot';
import {
  CONTEXT_OVERLOAD_COMPOSITION_ID,
  CONTEXT_OVERLOAD_DURATION_IN_FRAMES,
  CONTEXT_OVERLOAD_FPS,
  CONTEXT_OVERLOAD_HEIGHT,
  CONTEXT_OVERLOAD_WIDTH,
  ReelContextOverload,
} from './reels/antigravity-context-overload';

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="KI-Production-Reels">
      <Composition
        id={CONTEXT_OVERLOAD_COMPOSITION_ID}
        component={ReelContextOverload}
        defaultProps={{
          showCaptions: true,
          showDebugTimeline: false,
        }}
        durationInFrames={CONTEXT_OVERLOAD_DURATION_IN_FRAMES}
        fps={CONTEXT_OVERLOAD_FPS}
        width={CONTEXT_OVERLOAD_WIDTH}
        height={CONTEXT_OVERLOAD_HEIGHT}
      />
    </Folder>

    <Composition
      id="Three3D"
      component={ThreeDemo as React.FC}
      defaultProps={{color: BRAND.accent}}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
    <MotionPreviewRoot />
  </>
);
