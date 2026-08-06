import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {contextFont, contextPalette, contextShadows} from './style';

export const clampProgress = (frame: number, start: number, end: number): number =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const useSoftEnter = (delay = 0): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: {damping: 18, stiffness: 150, mass: 0.82},
  });
};

export const SceneShell: React.FC<React.PropsWithChildren<{
  title: string;
  titleWidth?: number;
}>> = ({title, titleWidth = 930, children}) => {
  const enter = useSoftEnter(2);

  return (
    <AbsoluteFill
      style={{
        background: contextPalette.background,
        color: contextPalette.foreground,
        fontFamily: contextFont,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: [
            'radial-gradient(circle at 50% 43%, rgba(109,58,219,0.16), transparent 46%)',
            'linear-gradient(90deg, rgba(109,58,219,0.035) 1px, transparent 1px)',
            'linear-gradient(rgba(109,58,219,0.035) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: 'auto, 86px 86px, 86px 86px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 74,
          right: 74,
          top: 82,
          zIndex: 40,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 20}px)`,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: titleWidth,
            fontSize: 66,
            lineHeight: 0.98,
            fontWeight: 970,
            letterSpacing: -3.2,
            textAlign: 'center',
          }}
        >
          {title}
        </div>
      </div>
      <div style={{position: 'absolute', left: 34, right: 34, top: 258, bottom: 500, zIndex: 10}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

export type MessageTone = 'active' | 'inactive' | 'danger' | 'warning' | 'success' | 'dark';

export const MessageCard: React.FC<{
  width?: number;
  height?: number;
  tone?: MessageTone;
  label?: string;
  sublabel?: string;
  opacity?: number;
  scale?: number;
  blurPx?: number;
  rotateDeg?: number;
  style?: React.CSSProperties;
}> = ({
  width = 330,
  height = 185,
  tone = 'active',
  label,
  sublabel,
  opacity = 1,
  scale = 1,
  blurPx = 0,
  rotateDeg = 0,
  style,
}) => {
  const border = tone === 'danger'
    ? contextPalette.danger
    : tone === 'warning'
      ? contextPalette.warning
      : tone === 'success'
        ? contextPalette.success
        : tone === 'inactive'
          ? contextPalette.lineStrong
          : tone === 'dark'
            ? contextPalette.foreground
            : contextPalette.accent;
  const background = tone === 'danger'
    ? contextPalette.dangerSoft
    : tone === 'warning'
      ? contextPalette.warningSoft
      : tone === 'success'
        ? contextPalette.successSoft
        : tone === 'inactive'
          ? contextPalette.surfaceMuted
          : tone === 'dark'
            ? contextPalette.foreground
            : contextPalette.surface;
  const foreground = tone === 'dark' ? '#FFFFFF' : border;
  const shadow = tone === 'danger'
    ? contextShadows.danger
    : tone === 'success'
      ? contextShadows.success
      : tone === 'active'
        ? contextShadows.accent
        : contextShadows.soft;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 34,
        border: `4px solid ${border}`,
        background,
        boxShadow: shadow,
        opacity,
        transform: `scale(${scale}) rotate(${rotateDeg}deg)`,
        filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '28px 32px',
        gap: 16,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {label ? (
        <div style={{fontSize: 30, lineHeight: 1, fontWeight: 970, color: foreground, letterSpacing: -0.5}}>
          {label}
        </div>
      ) : null}
      {sublabel ? (
        <div style={{fontSize: 21, lineHeight: 1.18, fontWeight: 780, color: tone === 'dark' ? '#E8E2F0' : contextPalette.muted}}>
          {sublabel}
        </div>
      ) : null}
      <div style={{height: 18, width: '88%', borderRadius: 99, background: foreground, opacity: 0.24}} />
      <div style={{height: 18, width: '62%', borderRadius: 99, background: foreground, opacity: 0.16}} />
    </div>
  );
};

export const ContextWindow: React.FC<React.PropsWithChildren<{
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  emphasis?: number;
  label?: string;
  overflowHidden?: boolean;
  style?: React.CSSProperties;
}>> = ({
  left = 50,
  top = 38,
  width = 944,
  height = 760,
  emphasis = 0.35,
  label = 'AKTIVER KONTEXT',
  overflowHidden = true,
  style,
  children,
}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width,
      height,
      borderRadius: 54,
      border: `6px solid rgba(109,58,219,${0.55 + emphasis * 0.45})`,
      background: overflowHidden
        ? 'linear-gradient(180deg, rgba(255,255,255,0.97), rgba(250,247,255,0.92))'
        : 'linear-gradient(180deg, rgba(255,255,255,0.30), rgba(250,247,255,0.18))',
      boxShadow: `0 34px 100px rgba(109,58,219,${0.18 + emphasis * 0.18})`,
      overflow: overflowHidden ? 'hidden' : 'visible',
      boxSizing: 'border-box',
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 30,
        top: 26,
        padding: '12px 20px',
        borderRadius: 999,
        background: contextPalette.accentSoft,
        color: contextPalette.accentDark,
        fontSize: 21,
        fontWeight: 970,
        letterSpacing: 1.2,
        zIndex: 10,
      }}
    >
      {label}
    </div>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: overflowHidden
          ? 'radial-gradient(circle at 50% 50%, rgba(169,124,255,0.12), transparent 54%)'
          : 'radial-gradient(circle at 50% 50%, rgba(169,124,255,0.07), transparent 60%)',
        pointerEvents: 'none',
      }}
    />
    {children}
  </div>
);

export const Rail: React.FC<React.PropsWithChildren<{
  left?: number;
  top?: number;
  width?: number;
  offsetX?: number;
  opacity?: number;
  gap?: number;
}>> = ({left = -320, top = 300, width = 1900, offsetX = 0, opacity = 1, gap = 40, children}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width,
      height: 220,
      transform: `translateX(${offsetX}px)`,
      opacity,
      display: 'flex',
      alignItems: 'center',
      gap,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        height: 18,
        borderRadius: 99,
        background: `linear-gradient(90deg, ${contextPalette.lineStrong}, ${contextPalette.accent}, ${contextPalette.lineStrong})`,
        transform: 'translateY(-50%)',
        opacity: 0.58,
      }}
    />
    {children}
  </div>
);

export const BoundaryGate: React.FC<{
  left: number;
  top?: number;
  height?: number;
  progress?: number;
  label?: string;
}> = ({left, top = 70, height = 680, progress = 1, label = 'AUSSERHALB'}) => (
  <div style={{position: 'absolute', left, top, width: 18, height}}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 99,
        background: contextPalette.danger,
        boxShadow: '0 0 28px rgba(224,68,88,0.42)',
        transform: `scaleY(${progress})`,
        transformOrigin: 'center',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: -118,
        top: 18,
        width: 100,
        textAlign: 'right',
        color: contextPalette.dangerDark,
        fontSize: 20,
        fontWeight: 970,
        letterSpacing: 0.8,
        opacity: progress,
      }}
    >
      {label}
    </div>
  </div>
);

export const StateBadge: React.FC<{
  text: string;
  tone?: 'accent' | 'danger' | 'warning' | 'success';
  visible?: number;
  style?: React.CSSProperties;
}> = ({text, tone = 'accent', visible = 1, style}) => {
  const color = tone === 'danger'
    ? contextPalette.danger
    : tone === 'warning'
      ? contextPalette.warning
      : tone === 'success'
        ? contextPalette.success
        : contextPalette.accent;
  return (
    <div
      style={{
        padding: '16px 24px',
        borderRadius: 999,
        border: `3px solid ${color}`,
        background: `${color}18`,
        color,
        fontSize: 24,
        fontWeight: 970,
        letterSpacing: 0.7,
        opacity: visible,
        transform: `scale(${0.92 + visible * 0.08})`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export const CapacityMeter: React.FC<{fill: number; label?: string}> = ({fill, label = 'KONTEXT'}) => {
  const clamped = Math.max(0, Math.min(1, fill));
  const color = clamped > 0.88 ? contextPalette.danger : clamped > 0.68 ? contextPalette.warning : contextPalette.accent;
  return (
    <div style={{position: 'absolute', right: 38, top: 118, width: 72, height: 520}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 36, background: contextPalette.surfaceMuted, border: `3px solid ${contextPalette.lineStrong}`, overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: `${clamped * 100}%`,
            background: color,
            boxShadow: `0 0 32px ${color}88`,
          }}
        />
      </div>
      <div style={{position: 'absolute', right: -16, top: -54, fontSize: 20, fontWeight: 970, color}}>{Math.round(clamped * 100)}%</div>
      <div style={{position: 'absolute', left: -36, right: -36, bottom: -52, textAlign: 'center', fontSize: 18, fontWeight: 900, color: contextPalette.muted}}>{label}</div>
    </div>
  );
};
