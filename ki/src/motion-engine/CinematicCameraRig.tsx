import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {dampedOscillation, segmentProgress} from './motionMath';

export type CinematicCameraMove =
  | 'locked'
  | 'push-in'
  | 'pull-back'
  | 'track-left'
  | 'track-right'
  | 'push-through'
  | 'whip-left'
  | 'whip-right'
  | 'impact-push'
  | 'orbit-left'
  | 'orbit-right';

export type CinematicCameraRigProps = React.PropsWithChildren<{
  move?: CinematicCameraMove;
  startFrame?: number;
  endFrame?: number;
  intensity?: number;
  impactFrame?: number;
  perspective?: number;
  origin?: string;
  style?: React.CSSProperties;
}>;

export const CinematicCameraRig: React.FC<CinematicCameraRigProps> = ({
  move = 'locked',
  startFrame = 0,
  endFrame = 90,
  intensity = 1,
  impactFrame,
  perspective = 1200,
  origin = '50% 48%',
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const t = segmentProgress(frame, startFrame, endFrame);
  let x = 0;
  let y = 0;
  let z = 0;
  let scale = 1;
  let rotateZ = 0;
  let rotateY = 0;

  switch (move) {
    case 'push-in':
      scale = interpolate(t, [0, 1], [0.91, 1.075]);
      y = interpolate(t, [0, 1], [38, -14]);
      break;
    case 'pull-back':
      scale = interpolate(t, [0, 1], [1.12, 0.94]);
      y = interpolate(t, [0, 1], [-24, 18]);
      break;
    case 'track-left':
      x = interpolate(t, [0, 1], [120, -90]) * intensity;
      scale = 1.035;
      break;
    case 'track-right':
      x = interpolate(t, [0, 1], [-120, 90]) * intensity;
      scale = 1.035;
      break;
    case 'push-through':
      scale = interpolate(t, [0, 0.72, 1], [0.82, 1.14, 1.38]);
      z = interpolate(t, [0, 1], [-120, 180]);
      y = interpolate(t, [0, 1], [65, -38]);
      break;
    case 'whip-left': {
      const fast = segmentProgress(frame, startFrame, Math.min(endFrame, startFrame + 12));
      x = interpolate(fast, [0, 1], [0, -360]) * intensity;
      rotateZ = interpolate(fast, [0, 0.55, 1], [0, -2.8, 0]);
      scale = interpolate(fast, [0, 0.55, 1], [1, 1.08, 1.02]);
      break;
    }
    case 'whip-right': {
      const fast = segmentProgress(frame, startFrame, Math.min(endFrame, startFrame + 12));
      x = interpolate(fast, [0, 1], [0, 360]) * intensity;
      rotateZ = interpolate(fast, [0, 0.55, 1], [0, 2.8, 0]);
      scale = interpolate(fast, [0, 0.55, 1], [1, 1.08, 1.02]);
      break;
    }
    case 'impact-push': {
      const impact = impactFrame ?? Math.round(startFrame + (endFrame - startFrame) * 0.5);
      const pre = segmentProgress(frame, startFrame, impact);
      const settle = segmentProgress(frame, impact, endFrame);
      scale = interpolate(pre, [0, 1], [0.93, 1.08]) + interpolate(settle, [0, 1], [0.05, -0.01]);
      const shakeX = dampedOscillation({frame, startFrame: impact, amplitude: 26 * intensity, decay: 0.15, frequency: 1.2});
      const shakeY = dampedOscillation({frame, startFrame: impact + 1, amplitude: 16 * intensity, decay: 0.17, frequency: 1.55});
      x = shakeX;
      y = interpolate(pre, [0, 1], [32, -18]) + shakeY;
      rotateZ = dampedOscillation({frame, startFrame: impact, amplitude: 1.4 * intensity, decay: 0.17, frequency: 1.35});
      break;
    }
    case 'orbit-left':
      rotateY = interpolate(t, [0, 1], [13, -11]) * intensity;
      x = interpolate(t, [0, 1], [55, -42]) * intensity;
      scale = 1.04;
      break;
    case 'orbit-right':
      rotateY = interpolate(t, [0, 1], [-13, 11]) * intensity;
      x = interpolate(t, [0, 1], [-55, 42]) * intensity;
      scale = 1.04;
      break;
    case 'locked':
      break;
  }

  return (
    <div
      data-motion-engine="camera-rig"
      data-camera-move={move}
      style={{
        position: 'absolute',
        inset: 0,
        perspective,
        transformOrigin: origin,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-8%',
          transformStyle: 'preserve-3d',
          transform: `translate3d(${x}px, ${y}px, ${z}px) scale(${scale}) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
          transformOrigin: origin,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};
