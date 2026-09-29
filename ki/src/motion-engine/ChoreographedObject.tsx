import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {bezierPoint, bezierTangentAngle, cinematicPhase, dampedOscillation, springProgress} from './motionMath';

export type MotionPoint = readonly [number, number];

export type ChoreographedObjectProps = React.PropsWithChildren<{
  path: readonly [MotionPoint, MotionPoint, MotionPoint, MotionPoint];
  anticipationStart: number;
  launchFrame: number;
  impactFrame: number;
  settleFrame: number;
  endFrame: number;
  baseScale?: number;
  faceVelocity?: boolean;
  anticipationDistance?: number;
  impactScale?: number;
  settleRotation?: number;
  aliveAmplitude?: number;
  zIndex?: number;
  style?: React.CSSProperties;
}>;

export const ChoreographedObject: React.FC<ChoreographedObjectProps> = ({
  path,
  anticipationStart,
  launchFrame,
  impactFrame,
  settleFrame,
  endFrame,
  baseScale = 1,
  faceVelocity = false,
  anticipationDistance = 26,
  impactScale = 1.08,
  settleRotation = 0,
  aliveAmplitude = 2.5,
  zIndex = 10,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const phase = cinematicPhase({
    frame,
    anticipationStart,
    launchFrame,
    impactFrame,
    settleFrame,
    endFrame,
  });

  const travelT = Math.min(1, Math.max(0, phase.travel));
  const position = bezierPoint(travelT, path[0], path[1], path[2], path[3]);
  const tangent = faceVelocity ? bezierTangentAngle(travelT, path[0], path[1], path[2], path[3]) : 0;
  const dx = path[1][0] - path[0][0];
  const dy = path[1][1] - path[0][1];
  const length = Math.max(1, Math.hypot(dx, dy));
  const anticipationX = (-dx / length) * anticipationDistance * phase.anticipation * (1 - phase.travel);
  const anticipationY = (-dy / length) * anticipationDistance * phase.anticipation * (1 - phase.travel);

  const settleSpring = springProgress({
    frame,
    fps,
    startFrame: impactFrame,
    damping: 11,
    stiffness: 210,
    mass: 0.66,
  });
  const impactPulse = interpolate(
    settleSpring,
    [0, 0.62, 1],
    [1, impactScale, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const impactRotation = dampedOscillation({
    frame,
    startFrame: impactFrame,
    amplitude: 7,
    decay: 0.17,
    frequency: 1.1,
  });
  const alive = frame >= settleFrame
    ? Math.sin((frame - settleFrame) / 13) * aliveAmplitude * (0.35 + phase.hold * 0.65)
    : 0;

  return (
    <div
      data-motion-engine="choreographed-object"
      style={{
        position: 'absolute',
        left: position.x + anticipationX,
        top: position.y + anticipationY + alive,
        transform: `translate(-50%, -50%) rotate(${tangent + settleRotation + impactRotation}deg) scale(${baseScale * impactPulse})`,
        transformOrigin: '50% 50%',
        willChange: 'transform,left,top',
        zIndex,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
