import React, {createContext, useContext} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {segmentProgress} from './motionMath';

type ParallaxContextValue = {
  x: number;
  y: number;
  rotateY: number;
  rotateX: number;
  perspective: number;
};

const ParallaxContext = createContext<ParallaxContextValue>({
  x: 0,
  y: 0,
  rotateY: 0,
  rotateX: 0,
  perspective: 1200,
});

export type ParallaxStageProps = React.PropsWithChildren<{
  startFrame?: number;
  endFrame?: number;
  driftX?: number;
  driftY?: number;
  rotateY?: number;
  rotateX?: number;
  perspective?: number;
  style?: React.CSSProperties;
}>;

export const ParallaxStage: React.FC<ParallaxStageProps> = ({
  startFrame = 0,
  endFrame = 120,
  driftX = 42,
  driftY = 24,
  rotateY = 3.5,
  rotateX = 1.8,
  perspective = 1200,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const t = segmentProgress(frame, startFrame, endFrame);
  const x = interpolate(t, [0, 0.55, 1], [-driftX * 0.42, driftX, driftX * 0.18]);
  const y = interpolate(t, [0, 0.5, 1], [driftY * 0.45, -driftY, driftY * 0.1]);
  const yaw = interpolate(t, [0, 0.55, 1], [-rotateY * 0.4, rotateY, rotateY * 0.2]);
  const pitch = interpolate(t, [0, 0.55, 1], [rotateX * 0.35, -rotateX, -rotateX * 0.12]);

  return (
    <ParallaxContext.Provider value={{x, y, rotateY: yaw, rotateX: pitch, perspective}}>
      <div
        data-motion-engine="parallax-stage"
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          perspective,
          transformStyle: 'preserve-3d',
          ...style,
        }}
      >
        {children}
      </div>
    </ParallaxContext.Provider>
  );
};

export type ParallaxLayerProps = React.PropsWithChildren<{
  depth?: number;
  z?: number;
  blur?: number;
  opacity?: number;
  style?: React.CSSProperties;
}>;

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  depth = 0.5,
  z = 0,
  blur = 0,
  opacity = 1,
  style,
  children,
}) => {
  const stage = useContext(ParallaxContext);
  const factor = Math.max(-1.5, Math.min(1.5, depth));
  const x = stage.x * factor;
  const y = stage.y * factor;
  const rotateY = stage.rotateY * factor;
  const rotateX = stage.rotateX * factor;

  return (
    <div
      data-motion-engine="parallax-layer"
      data-depth={depth}
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
        transformStyle: 'preserve-3d',
        willChange: 'transform,filter',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
