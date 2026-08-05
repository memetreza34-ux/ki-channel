import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const PROTOTYPE_PALETTE = {
  background: '#F8F7FB',
  foreground: '#14121A',
  accent: '#8757E8',
  accentSoft: '#C6A8FF',
  success: '#35C58A',
  warning: '#FFB648',
  danger: '#FF5D6C',
  muted: '#746D80',
  white: '#FFFFFF',
  line: '#DED7EA',
} as const;

export const prototypeProgress = (
  frame: number,
  start: number,
  end: number,
): number =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const PrototypeShell: React.FC<{
  family: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({family, title, subtitle, children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = prototypeProgress(frame, 0, durationInFrames - 1);
  const titleEnter = prototypeProgress(frame, 0, 18);

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 50% 38%, #FFFFFF 0%, #F8F7FB 48%, #EDE8F5 100%)',
        color: PROTOTYPE_PALETTE.foreground,
        overflow: 'hidden',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(rgba(135,87,232,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(135,87,232,.035) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 18%, black 84%, transparent 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 88,
          right: 88,
          top: 105,
          opacity: titleEnter,
          transform: `translateY(${(1 - titleEnter) * -30}px)`,
          zIndex: 20,
        }}
      >
        <div
          style={{
            color: PROTOTYPE_PALETTE.accent,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          ANIMATION LIBRARY · {family}
        </div>
        <div
          style={{
            marginTop: 12,
            fontFamily: 'Arial Narrow, Arial, sans-serif',
            fontSize: 60,
            lineHeight: 0.96,
            fontWeight: 900,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 25,
            lineHeight: 1.25,
            fontWeight: 700,
            color: PROTOTYPE_PALETTE.muted,
            maxWidth: 820,
          }}
        >
          {subtitle}
        </div>
      </div>

      {children}

      <div
        style={{
          position: 'absolute',
          left: 74,
          right: 74,
          bottom: 72,
          height: 8,
          borderRadius: 999,
          background: 'rgba(135,87,232,.10)',
          overflow: 'hidden',
          zIndex: 20,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            borderRadius: 999,
            background: `linear-gradient(90deg, ${PROTOTYPE_PALETTE.accentSoft}, ${PROTOTYPE_PALETTE.accent})`,
            boxShadow: '0 0 20px rgba(135,87,232,.45)',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const GlassSurface: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({children, style}) => (
  <div
    style={{
      borderRadius: 36,
      background: 'rgba(255,255,255,.84)',
      border: '1px solid rgba(135,87,232,.16)',
      boxShadow: '0 24px 75px rgba(51,35,82,.14)',
      backdropFilter: 'blur(20px)',
      ...style,
    }}
  >
    {children}
  </div>
);
