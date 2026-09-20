import React from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export type CameraStageMode =
  | 'locked'
  | 'push'
  | 'pull'
  | 'pan-left'
  | 'pan-right'
  | 'drift-up'
  | 'parallax';

export type CameraStageProps = React.PropsWithChildren<{
  mode?: CameraStageMode;
  startFrame?: number;
  endFrame?: number;
  intensity?: number;
  style?: React.CSSProperties;
}>;

const progress = (
  frame: number,
  startFrame: number,
  endFrame: number,
): number =>
  interpolate(frame, [startFrame, Math.max(startFrame + 1, endFrame)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const CameraStage: React.FC<CameraStageProps> = ({
  mode = 'locked',
  startFrame = 0,
  endFrame = 90,
  intensity = 1,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const t = progress(frame, startFrame, endFrame);
  let x = 0;
  let y = 0;
  let scale = 1;
  let rotate = 0;

  switch (mode) {
    case 'push':
      scale = 1 - 0.055 * intensity + 0.075 * intensity * t;
      y = (1 - t) * 14 * intensity;
      break;
    case 'pull':
      scale = 1 + 0.085 * intensity * (1 - t);
      y = (1 - t) * -10 * intensity;
      break;
    case 'pan-left':
      x = (1 - t) * 46 * intensity;
      scale = 1.012;
      break;
    case 'pan-right':
      x = (1 - t) * -46 * intensity;
      scale = 1.012;
      break;
    case 'drift-up':
      y = (1 - t) * 34 * intensity;
      scale = 0.985 + t * 0.015;
      break;
    case 'parallax':
      x = Math.sin(frame / 42) * 10 * intensity;
      y = Math.cos(frame / 57) * 7 * intensity;
      rotate = Math.sin(frame / 75) * 0.35 * intensity;
      scale = 1.015;
      break;
    case 'locked':
      break;
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformOrigin: '50% 46%',
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export type MotionRevealProps = React.PropsWithChildren<{
  startFrame: number;
  endFrame: number;
  fromX?: number;
  fromY?: number;
  fromScale?: number;
  springy?: boolean;
  style?: React.CSSProperties;
}>;

export const MotionReveal: React.FC<MotionRevealProps> = ({
  startFrame,
  endFrame,
  fromX = 0,
  fromY = 20,
  fromScale = 0.96,
  springy = false,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const linear = progress(frame, startFrame, endFrame);
  const springValue = springy
    ? spring({
        frame: Math.max(0, frame - startFrame),
        fps,
        config: {damping: 18, stiffness: 130, mass: 0.9},
      })
    : linear;
  const t = Math.max(0, Math.min(1, springValue));

  return (
    <div
      style={{
        opacity: linear,
        transform: `translate3d(${(1 - t) * fromX}px, ${(1 - t) * fromY}px, 0) scale(${fromScale + (1 - fromScale) * t})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const animatedStrokeDashoffset = ({
  frame,
  startFrame,
  endFrame,
  length,
}: {
  frame: number;
  startFrame: number;
  endFrame: number;
  length: number;
}): number =>
  length * (1 - progress(frame, startFrame, endFrame));

export type PulseHaloProps = {
  x: number;
  y: number;
  radius?: number;
  color: string;
  startFrame?: number;
  periodFrames?: number;
  strokeWidth?: number;
};

export const PulseHalo: React.FC<PulseHaloProps> = ({
  x,
  y,
  radius = 24,
  color,
  startFrame = 0,
  periodFrames = 54,
  strokeWidth = 10,
}) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - startFrame);
  const phase = (local % Math.max(1, periodFrames)) / Math.max(1, periodFrames);
  const scale = 0.72 + phase * 0.75;
  const opacity = frame < startFrame ? 0 : 1 - phase;

  return (
    <circle
      cx={x}
      cy={y}
      r={radius * scale}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      opacity={opacity * 0.45}
    />
  );
};

export type DepthLayerProps = React.PropsWithChildren<{
  depth: number;
  progress?: number;
  spread?: number;
  style?: React.CSSProperties;
}>;

export const DepthLayer: React.FC<DepthLayerProps> = ({
  depth,
  progress: externalProgress = 1,
  spread = 34,
  style,
  children,
}) => {
  const t = Math.max(0, Math.min(1, externalProgress));
  const z = depth * spread * t;
  const y = depth * -5 * t;
  const scale = 1 + depth * 0.018 * t;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translate3d(0, ${y}px, ${z}px) scale(${scale})`,
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
