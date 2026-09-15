import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

type CameraPushProps = React.PropsWithChildren<{
  startFrame?: number;
  endFrame?: number;
  fromScale?: number;
  toScale?: number;
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
  origin?: string;
  style?: React.CSSProperties;
}>;

export const CameraPush: React.FC<CameraPushProps> = ({
  children,
  startFrame = 0,
  endFrame = 24,
  fromScale = 1,
  toScale = 1.08,
  fromX = 0,
  toX = 0,
  fromY = 0,
  toY = 0,
  origin = 'center center',
  style,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [startFrame, endFrame], [fromScale, toScale], clamp);
  const x = interpolate(frame, [startFrame, endFrame], [fromX, toX], clamp);
  const y = interpolate(frame, [startFrame, endFrame], [fromY, toY], clamp);
  return (
    <div style={{transformOrigin: origin, transform: `translate3d(${x}px,${y}px,0) scale(${scale})`, willChange: 'transform', ...style}}>
      {children}
    </div>
  );
};

type FocusHaloProps = {
  left: number | string;
  top: number | string;
  width: number | string;
  height: number | string;
  startFrame: number;
  endFrame: number;
  accent: string;
  radius?: number;
};

export const FocusHalo: React.FC<FocusHaloProps> = ({left, top, width, height, startFrame, endFrame, accent, radius = 28}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [startFrame, startFrame + 10], [0, 1], clamp);
  const leave = interpolate(frame, [Math.max(startFrame + 11, endFrame - 10), endFrame], [1, 0], clamp);
  const opacity = Math.min(enter, leave) * 0.52;
  const scale = interpolate(enter, [0, 1], [1.035, 1], clamp);
  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        borderRadius: radius,
        border: `2px solid ${accent}8C`,
        boxShadow: `0 0 0 4px ${accent}0D, 0 10px 28px ${accent}14`,
        opacity,
        transform: `scale(${scale})`,
        pointerEvents: 'none',
        zIndex: 30,
      }}
    />
  );
};

type ScanSweepProps = {
  startFrame: number;
  endFrame: number;
  accent: string;
  top?: number | string;
  left?: number | string;
  width?: number | string;
};

export const ScanSweep: React.FC<ScanSweepProps> = ({startFrame, endFrame, accent, top = 0, left = 0, width = '100%'}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], clamp);
  const opacity = interpolate(frame, [startFrame, startFrame + 5, endFrame - 5, endFrame], [0, 0.75, 0.75, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height: 3,
        background: `linear-gradient(90deg,transparent,${accent},transparent)`,
        opacity,
        transform: `translateX(${(progress - 0.5) * 80}px)`,
        filter: `drop-shadow(0 0 8px ${accent})`,
        pointerEvents: 'none',
        zIndex: 25,
      }}
    />
  );
};

export const ParallaxFloat: React.FC<React.PropsWithChildren<{amplitude?: number; speed?: number; phase?: number; style?: React.CSSProperties}>> = ({
  children,
  amplitude = 6,
  speed = 0.045,
  phase = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const y = Math.sin(frame * speed + phase) * amplitude;
  return <div style={{transform: `translate3d(0,${y}px,0)`, willChange: 'transform', ...style}}>{children}</div>;
};

type SourceProofCardProps = {
  source: string;
  date: string;
  label: string;
  accent: string;
  startFrame?: number;
};

export const SourceProofCard: React.FC<SourceProofCardProps> = ({source, date, label, accent, startFrame = 0}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], clamp);
  const y = interpolate(frame, [startFrame, startFrame + 10], [20, 0], clamp);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 17,
        minWidth: 620,
        padding: '18px 22px',
        borderRadius: 26,
        background: 'rgba(255,255,255,.91)',
        border: '1px solid rgba(16,32,51,.10)',
        boxShadow: '0 18px 46px rgba(16,32,51,.10)',
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div style={{width: 14, height: 14, borderRadius: 999, background: accent, boxShadow: `0 0 0 6px ${accent}14`, flex: '0 0 auto'}} />
      <div style={{minWidth: 0}}>
        <div style={{fontSize: 25, fontWeight: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{label}</div>
        <div style={{fontSize: 20, opacity: 0.58, marginTop: 3}}>{source} • {date}</div>
      </div>
    </div>
  );
};
