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
    config: {damping: 20, stiffness: 130, mass: 0.85},
  });
};

export const SceneShell: React.FC<React.PropsWithChildren<{
  title: string;
  result?: string;
  resultVisible?: number;
  resultTone?: 'accent' | 'danger' | 'warning' | 'success';
}>> = ({title, result, resultVisible = 0, resultTone = 'accent', children}) => {
  const enter = useSoftEnter(2);
  const resultColor = resultTone === 'danger'
    ? contextPalette.danger
    : resultTone === 'warning'
      ? contextPalette.warning
      : resultTone === 'success'
        ? contextPalette.success
        : contextPalette.accent;

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
          background: 'radial-gradient(circle at 50% 45%, rgba(125,73,223,0.13), transparent 48%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          top: 104,
          zIndex: 30,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 22}px)`,
          fontSize: 64,
          lineHeight: 1.02,
          fontWeight: 950,
          letterSpacing: -2.8,
          textAlign: 'center',
        }}
      >
        {title}
      </div>
      <div style={{position: 'absolute', left: 54, right: 54, top: 315, bottom: 420, zIndex: 10}}>
        {children}
      </div>
      {result ? (
        <div
          style={{
            position: 'absolute',
            left: 120,
            right: 120,
            bottom: 410,
            height: 92,
            borderRadius: 28,
            border: `2px solid ${resultColor}55`,
            background: `${resultColor}12`,
            color: resultColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 24px',
            fontSize: 30,
            lineHeight: 1.1,
            fontWeight: 950,
            letterSpacing: 0.8,
            opacity: resultVisible,
            transform: `translateY(${(1 - resultVisible) * 16}px)`,
          }}
        >
          {result}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const MessageCard: React.FC<{
  width?: number;
  height?: number;
  tone?: 'active' | 'inactive' | 'danger' | 'warning' | 'success';
  label?: string;
  opacity?: number;
  scale?: number;
  blurPx?: number;
  style?: React.CSSProperties;
}> = ({
  width = 250,
  height = 150,
  tone = 'active',
  label,
  opacity = 1,
  scale = 1,
  blurPx = 0,
  style,
}) => {
  const border = tone === 'danger'
    ? contextPalette.danger
    : tone === 'warning'
      ? contextPalette.warning
      : tone === 'success'
        ? contextPalette.success
        : tone === 'inactive'
          ? contextPalette.line
          : contextPalette.accent;
  const background = tone === 'danger'
    ? contextPalette.dangerSoft
    : tone === 'warning'
      ? contextPalette.warningSoft
      : tone === 'success'
        ? contextPalette.successSoft
        : tone === 'inactive'
          ? contextPalette.surfaceMuted
          : contextPalette.surface;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 30,
        border: `3px solid ${border}66`,
        background,
        boxShadow: tone === 'active' ? contextShadows.accent : contextShadows.soft,
        opacity,
        transform: `scale(${scale})`,
        filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '22px 28px',
        gap: 16,
        ...style,
      }}
    >
      {label ? (
        <div style={{fontSize: 26, fontWeight: 950, color: border, letterSpacing: 0.5}}>{label}</div>
      ) : null}
      <div style={{height: 18, width: '86%', borderRadius: 99, background: border, opacity: 0.28}} />
      <div style={{height: 18, width: '68%', borderRadius: 99, background: border, opacity: 0.2}} />
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
}>> = ({
  left = 86,
  top = 130,
  width = 800,
  height = 650,
  emphasis = 0.35,
  label = 'KONTEXTFENSTER',
  overflowHidden = true,
  children,
}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width,
      height,
      borderRadius: 46,
      border: `5px solid rgba(125,73,223,${0.38 + emphasis * 0.62})`,
      background: 'rgba(255,255,255,0.56)',
      boxShadow: `0 28px 90px rgba(125,73,223,${0.1 + emphasis * 0.18})`,
      overflow: overflowHidden ? 'hidden' : 'visible',
      backdropFilter: 'blur(16px)',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 30,
        top: 24,
        padding: '10px 18px',
        borderRadius: 999,
        background: contextPalette.accentSoft,
        color: contextPalette.accent,
        fontSize: 20,
        fontWeight: 950,
        letterSpacing: 1.4,
        zIndex: 5,
      }}
    >
      {label}
    </div>
    {children}
  </div>
);

export const Rail: React.FC<React.PropsWithChildren<{
  left?: number;
  top?: number;
  width?: number;
  offsetX?: number;
  opacity?: number;
}>> = ({left = -420, top = 300, width = 1800, offsetX = 0, opacity = 1, children}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width,
      height: 190,
      transform: `translateX(${offsetX}px)`,
      opacity,
      display: 'flex',
      alignItems: 'center',
      gap: 34,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        height: 14,
        borderRadius: 99,
        background: contextPalette.line,
        transform: 'translateY(-50%)',
      }}
    />
    {children}
  </div>
);

export const CapacityBar: React.FC<{fill: number}> = ({fill}) => (
  <div
    style={{
      position: 'absolute',
      left: 110,
      right: 110,
      bottom: 70,
      height: 34,
      borderRadius: 99,
      background: contextPalette.line,
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        width: `${Math.max(0, Math.min(1, fill)) * 100}%`,
        height: '100%',
        borderRadius: 99,
        background: fill > 0.86 ? contextPalette.danger : contextPalette.accent,
      }}
    />
  </div>
);
