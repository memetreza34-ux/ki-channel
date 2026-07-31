import React from 'react';
import { Composition } from 'remotion';
import { ThreeDemo } from '@studio/core/three';
import { BRAND } from '../brand/brand';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Three3D"
      component={ThreeDemo as React.FC}
      defaultProps={{ color: BRAND.accent }}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
