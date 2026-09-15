import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Solid,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {paper} from '@remotion/effects/paper';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export type StoryRole = 'HOOK' | 'PROBLEM' | 'PROOF' | 'CHANGE' | 'CONSEQUENCE' | 'PAYOFF';
export type StoryDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export const StoryTexture: React.FC<{
  color?: string;
  opacity?: number;
  seed?: number;
}> = ({color = '#F7FAFC', opacity = 0.16, seed = 6}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      <Solid
        width={width}
        height={height}
        color={color}
        effects={[
          paper({
            amount: 0.42,
            roughness: 0.22,
            fiber: 0.12,
            fiberSize: 0.16,
            crumples: 0.08,
            crumpleSize: 0.42,
            folds: 0.12,
            foldCount: 2,
            drops: 0.05,
            scale: 0.8,
            seed,
          }),
        ]}
      />
    </AbsoluteFill>
  );
};

export const StoryBeat: React.FC<React.PropsWithChildren<{
  startFrame: number;
  endFrame?: number;
  direction?: StoryDirection;
  distance?: number;
  scaleFrom?: number;
  role?: StoryRole;
  style?: React.CSSProperties;
}>> = ({
  children,
  startFrame,
  endFrame,
  direction = 'up',
  distance = 34,
  scaleFrom = 0.96,
  role = 'CHANGE',
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - startFrame, fps, config: {damping: 17, stiffness: role === 'HOOK' || role === 'PAYOFF' ? 190 : 160, mass: 0.8}});
  const exit = endFrame == null
    ? 1
    : interpolate(frame, [Math.max(startFrame + 1, endFrame - 10), endFrame], [1, 0], clamp);
  const opacity = Math.min(enter, exit);
  const offset = (1 - enter) * distance;
  const x = direction === 'left' ? -offset : direction === 'right' ? offset : 0;
  const y = direction === 'up' ? offset : direction === 'down' ? -offset : 0;
  const scale = scaleFrom + (1 - scaleFrom) * enter;
  return (
    <div
      data-story-role={role}
      style={{
        opacity,
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        transformOrigin: 'center',
        willChange: 'transform, opacity',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const StoryCamera: React.FC<React.PropsWithChildren<{
  startFrame: number;
  endFrame: number;
  fromScale?: number;
  toScale?: number;
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
  origin?: string;
  style?: React.CSSProperties;
}>> = ({
  children,
  startFrame,
  endFrame,
  fromScale = 1,
  toScale = 1.08,
  fromX = 0,
  toX = 0,
  fromY = 0,
  toY = 0,
  origin = '50% 50%',
  style,
}) => {
  const frame = useCurrentFrame();
  const eased = Easing.bezier(0.2, 0.72, 0.2, 1);
  const scale = interpolate(frame, [startFrame, endFrame], [fromScale, toScale], {...clamp, easing: eased});
  const x = interpolate(frame, [startFrame, endFrame], [fromX, toX], {...clamp, easing: eased});
  const y = interpolate(frame, [startFrame, endFrame], [fromY, toY], {...clamp, easing: eased});
  return (
    <div style={{transformOrigin: origin, transform: `translate3d(${x}px,${y}px,0) scale(${scale})`, willChange: 'transform', ...style}}>
      {children}
    </div>
  );
};

export const ImpactNumber: React.FC<{
  value: string;
  label?: string;
  accent: string;
  startFrame: number;
  size?: number;
  align?: 'left' | 'center' | 'right';
}> = ({value, label, accent, startFrame, size = 132, align = 'center'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const punch = spring({frame: frame - startFrame, fps, config: {damping: 11, stiffness: 220, mass: 0.62}});
  const flash = interpolate(frame, [startFrame, startFrame + 4, startFrame + 16], [0, 1, 0], clamp);
  return (
    <div style={{position: 'relative', textAlign: align, transform: `scale(${0.72 + 0.28 * punch})`, opacity: punch}}>
      <div style={{position: 'absolute', inset: '-12%', borderRadius: 999, background: `radial-gradient(circle, ${accent}${Math.round(flash * 45).toString(16).padStart(2, '0')} 0%, transparent 70%)`, filter: 'blur(12px)'}} />
      <div style={{position: 'relative', fontSize: size, lineHeight: 0.9, fontWeight: 950, letterSpacing: '-.07em', color: accent}}>{value}</div>
      {label ? <div style={{position: 'relative', marginTop: 14, fontSize: Math.max(22, size * 0.22), fontWeight: 900, letterSpacing: '.04em', color: '#344054'}}>{label}</div> : null}
    </div>
  );
};

export const StoryProgressRail: React.FC<{
  progress: number;
  accent: string;
  height?: number;
  background?: string;
}> = ({progress, accent, height = 16, background = '#E7EEF5'}) => (
  <div style={{height, borderRadius: 999, background, overflow: 'hidden'}}>
    <div style={{height: '100%', width: `${Math.max(0, Math.min(1, progress)) * 100}%`, background: accent, borderRadius: 999}} />
  </div>
);

export const StoryCutFlash: React.FC<{
  atFrame: number;
  accent?: string;
  durationFrames?: number;
}> = ({atFrame, accent = '#FFFFFF', durationFrames = 8}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [atFrame, atFrame + Math.max(1, Math.floor(durationFrames / 2)), atFrame + durationFrames], [0, 0.72, 0], clamp);
  if (opacity <= 0) return null;
  return <AbsoluteFill style={{background: accent, opacity, pointerEvents: 'none', zIndex: 99}} />;
};

export const StoryChapterLabel: React.FC<{
  children: React.ReactNode;
  accent: string;
}> = ({children, accent}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 999, background: 'rgba(255,255,255,.88)', border: '1px solid rgba(16,32,51,.08)', boxShadow: '0 10px 32px rgba(16,32,51,.08)', color: accent, fontSize: 22, fontWeight: 900, letterSpacing: '.04em'}}>
    <span style={{width: 9, height: 9, borderRadius: 999, background: accent, boxShadow: `0 0 0 5px ${accent}18`}} />
    {children}
  </div>
);
