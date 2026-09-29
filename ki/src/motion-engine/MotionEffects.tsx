import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {dampedOscillation, segmentProgress} from './motionMath';

export const ImpactShake: React.FC<React.PropsWithChildren<{
  impactFrame: number;
  amplitude?: number;
  durationFrames?: number;
  rotation?: number;
  style?: React.CSSProperties;
}>> = ({
  impactFrame,
  amplitude = 20,
  durationFrames = 28,
  rotation = 1.2,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const active = frame >= impactFrame && frame <= impactFrame + durationFrames;
  const x = active
    ? dampedOscillation({frame, startFrame: impactFrame, amplitude, decay: 0.15, frequency: 1.35})
    : 0;
  const y = active
    ? dampedOscillation({frame, startFrame: impactFrame + 1, amplitude: amplitude * 0.62, decay: 0.17, frequency: 1.65})
    : 0;
  const r = active
    ? dampedOscillation({frame, startFrame: impactFrame, amplitude: rotation, decay: 0.16, frequency: 1.2})
    : 0;

  return (
    <div
      data-motion-engine="impact-shake"
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${r}deg)`,
        transformOrigin: '50% 50%',
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const AliveHold: React.FC<React.PropsWithChildren<{
  startFrame: number;
  endFrame?: number;
  amplitudeX?: number;
  amplitudeY?: number;
  rotateAmplitude?: number;
  scaleAmplitude?: number;
  phaseOffset?: number;
  style?: React.CSSProperties;
}>> = ({
  startFrame,
  endFrame,
  amplitudeX = 2.5,
  amplitudeY = 3.5,
  rotateAmplitude = 0.25,
  scaleAmplitude = 0.006,
  phaseOffset = 0,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const enabled = frame >= startFrame && (endFrame === undefined || frame <= endFrame);
  const local = Math.max(0, frame - startFrame);
  const envelope = enabled
    ? endFrame === undefined
      ? segmentProgress(frame, startFrame, startFrame + 18)
      : Math.min(
          segmentProgress(frame, startFrame, startFrame + 18),
          1 - segmentProgress(frame, Math.max(startFrame, endFrame - 18), endFrame),
        )
    : 0;
  const x = Math.sin((local + phaseOffset) / 17) * amplitudeX * envelope;
  const y = Math.cos((local + phaseOffset) / 23) * amplitudeY * envelope;
  const r = Math.sin((local + phaseOffset) / 31) * rotateAmplitude * envelope;
  const s = 1 + Math.sin((local + phaseOffset) / 29) * scaleAmplitude * envelope;

  return (
    <div
      data-motion-engine="alive-hold"
      style={{
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${r}deg) scale(${s})`,
        transformOrigin: '50% 50%',
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const DirectionalBlur: React.FC<React.PropsWithChildren<{
  startFrame: number;
  peakFrame: number;
  endFrame: number;
  maxBlur?: number;
  direction?: 'x' | 'y';
  style?: React.CSSProperties;
}>> = ({
  startFrame,
  peakFrame,
  endFrame,
  maxBlur = 10,
  direction = 'x',
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const inProgress = segmentProgress(frame, startFrame, peakFrame);
  const outProgress = segmentProgress(frame, peakFrame, endFrame);
  const blur = interpolate(
    frame,
    [startFrame, peakFrame, endFrame],
    [0, maxBlur, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const skew = (inProgress - outProgress) * (direction === 'x' ? -2.4 : 0);
  const stretchX = direction === 'x' ? 1 + blur * 0.006 : 1;
  const stretchY = direction === 'y' ? 1 + blur * 0.006 : 1;

  return (
    <div
      data-motion-engine="directional-blur"
      style={{
        filter: `blur(${blur}px)`,
        transform: `skewX(${skew}deg) scaleX(${stretchX}) scaleY(${stretchY})`,
        transformOrigin: '50% 50%',
        willChange: 'filter,transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
