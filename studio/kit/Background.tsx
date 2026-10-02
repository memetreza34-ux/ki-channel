import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {noise2D} from '@remotion/noise';
import {COLORS} from './theme';

const VARIANTS = {
  light: {base: COLORS.bg, blobs: ['#E9DCFF', '#DCEBFF', '#F6E3F4'], dots: 'rgba(110,69,201,0.13)'},
  dark: {base: COLORS.dark, blobs: ['#3B2470', '#1E2F5C', '#40204A'], dots: 'rgba(185,140,255,0.16)'},
  accent: {base: '#EEE5FF', blobs: ['#D9C2FF', '#C9DEFF', '#F3D2F0'], dots: 'rgba(110,69,201,0.16)'},
} as const;

type BackgroundProps = {
  variant?: keyof typeof VARIANTS;
  /** Punktraster im Hintergrund. */
  dots?: boolean;
  seed?: string;
};

/**
 * Ruhige Bühne: Grundfarbe, langsam treibende Farbwolken, feines Punktraster.
 * Bewegt sich kaum sichtbar, damit das Bild nie "eingefroren" wirkt.
 */
export const Background: React.FC<BackgroundProps> = ({variant = 'light', dots = true, seed = 'bg'}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const v = VARIANTS[variant];
  const t = frame / 300;
  const size = Math.max(width, height) * 0.95;
  const anchors = [
    [0.15, 0.12],
    [0.9, 0.55],
    [0.25, 0.95],
  ];

  return (
    <AbsoluteFill style={{background: v.base, overflow: 'hidden'}}>
      {anchors.map(([ax, ay], i) => {
        const x = ax * width + noise2D(`${seed}-x${i}`, t, i) * width * 0.12 - size / 2;
        const y = ay * height + noise2D(`${seed}-y${i}`, i, t) * height * 0.08 - size / 2;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${v.blobs[i]} 0%, ${v.blobs[i]}00 62%)`,
              opacity: variant === 'dark' ? 0.75 : 0.9,
            }}
          />
        );
      })}
      {dots ? (
        <AbsoluteFill
          style={{
            backgroundImage: `radial-gradient(circle, ${v.dots} 1.6px, transparent 2px)`,
            backgroundSize: '44px 44px',
            backgroundPosition: `0px ${-frame * 0.15}px`,
            maskImage: 'radial-gradient(ellipse 75% 60% at 50% 45%, black 20%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 60% at 50% 45%, black 20%, transparent 85%)',
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
