import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {bezierPoint, dampedOscillation, segmentProgress} from './motionMath';

type CameraPoint = readonly [number, number];

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
  followPath?: readonly [CameraPoint, CameraPoint, CameraPoint, CameraPoint];
  followStartFrame?: number;
  followEndFrame?: number;
  followStrength?: number;
  followAnchor?: readonly [number, number];
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
  followPath,
  followStartFrame,
  followEndFrame,
  followStrength = 0.62,
  followAnchor = [540, 940],
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
      scale = interpolate(t, [0, 0.82, 1], [0.90, 1.07, 1.045]);
      y = interpolate(t, [0, 1], [52, -18]);
      break;
    case 'pull-back':
      scale = interpolate(t, [0, 0.82, 1], [1.16, 0.93, 0.96]);
      y = interpolate(t, [0, 1], [-32, 22]);
      break;
    case 'track-left':
      x = interpolate(t, [0, 0.86, 1], [150, -100, -82]) * intensity;
      y = Math.sin(t * Math.PI) * -18 * intensity;
      scale = 1.045;
      break;
    case 'track-right':
      x = interpolate(t, [0, 0.86, 1], [-150, 100, 82]) * intensity;
      y = Math.sin(t * Math.PI) * -18 * intensity;
      scale = 1.045;
      break;
    case 'push-through':
      scale = interpolate(t, [0, 0.45, 0.82, 1], [0.80, 1.02, 1.48, 1.86]);
      z = interpolate(t, [0, 0.6, 1], [-160, 80, 360]);
      y = interpolate(t, [0, 0.7, 1], [80, -18, -68]);
      break;
    case 'whip-left': {
      const fast = segmentProgress(frame, startFrame, Math.min(endFrame, startFrame + 12));
      x = interpolate(fast, [0, 0.82, 1], [0, -410, -360]) * intensity;
      rotateZ = interpolate(fast, [0, 0.55, 1], [0, -3.6, -0.4]);
      scale = interpolate(fast, [0, 0.55, 1], [1, 1.10, 1.025]);
      break;
    }
    case 'whip-right': {
      const fast = segmentProgress(frame, startFrame, Math.min(endFrame, startFrame + 12));
      x = interpolate(fast, [0, 0.82, 1], [0, 410, 360]) * intensity;
      rotateZ = interpolate(fast, [0, 0.55, 1], [0, 3.6, 0.4]);
      scale = interpolate(fast, [0, 0.55, 1], [1, 1.10, 1.025]);
      break;
    }
    case 'impact-push': {
      const impact = impactFrame ?? Math.round(startFrame + (endFrame - startFrame) * 0.5);
      const pre = segmentProgress(frame, startFrame, impact);
      const settle = segmentProgress(frame, impact, endFrame);
      if (frame <= impact) {
        scale = interpolate(pre, [0, 0.82, 1], [0.94, 1.055, 1.105]);
        y = interpolate(pre, [0, 1], [36, -16]);
      } else {
        scale = interpolate(settle, [0, 0.7, 1], [1.105, 1.015, 1.025]);
        y = interpolate(settle, [0, 0.75, 1], [-16, 4, 0]);
      }
      const shakeX = dampedOscillation({frame, startFrame: impact, amplitude: 26 * intensity, decay: 0.15, frequency: 1.2});
      const shakeY = dampedOscillation({frame, startFrame: impact + 1, amplitude: 16 * intensity, decay: 0.17, frequency: 1.55});
      x = shakeX;
      y += shakeY;
      rotateZ = dampedOscillation({frame, startFrame: impact, amplitude: 1.4 * intensity, decay: 0.17, frequency: 1.35});
      break;
    }
    case 'orbit-left':
      rotateY = interpolate(t, [0, 0.84, 1], [15, -12, -9]) * intensity;
      x = interpolate(t, [0, 0.84, 1], [68, -50, -38]) * intensity;
      y = Math.sin(t * Math.PI) * -16 * intensity;
      scale = 1.045;
      break;
    case 'orbit-right':
      rotateY = interpolate(t, [0, 0.84, 1], [-15, 12, 9]) * intensity;
      x = interpolate(t, [0, 0.84, 1], [-68, 50, 38]) * intensity;
      y = Math.sin(t * Math.PI) * -16 * intensity;
      scale = 1.045;
      break;
    case 'locked':
      break;
  }

  if (followPath) {
    const followT = segmentProgress(
      frame,
      followStartFrame ?? startFrame,
      followEndFrame ?? endFrame,
    );
    const point = bezierPoint(
      followT,
      followPath[0],
      followPath[1],
      followPath[2],
      followPath[3],
    );
    const followEase = Math.sin(Math.min(1, followT) * Math.PI * 0.5);
    x += (followAnchor[0] - point.x) * followStrength * followEase;
    y += (followAnchor[1] - point.y) * followStrength * followEase;
  }

  return (
    <div
      data-motion-engine="camera-rig"
      data-camera-move={move}
      data-camera-follow={followPath ? 'path' : 'none'}
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
          inset: '-10%',
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
