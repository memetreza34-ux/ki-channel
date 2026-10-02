import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {noise2D} from '@remotion/noise';
import {useTheme} from './themes';

type BackgroundProps = {
  /** `accent` = getönte Fläche des Designs (z. B. für Endkarten). */
  variant?: 'base' | 'accent';
  /** Muster (Punkte/Raster/Papierlinien) anzeigen. */
  pattern?: boolean;
  seed?: string;
};

/**
 * Bühne im Stil des aktuellen Designs. Bewegt sich kaum sichtbar, damit das
 * Bild nie "eingefroren" wirkt.
 */
export const Background: React.FC<BackgroundProps> = ({variant = 'base', pattern = true, seed = 'bg'}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const t = useTheme();
  const bg = t.background;
  const base = variant === 'accent' ? t.accentBackground : t.c.bg;
  const time = frame / 300;
  const size = Math.max(width, height) * 0.95;
  const anchors = [
    [0.15, 0.12],
    [0.9, 0.55],
    [0.25, 0.95],
  ];
  const showBlobs = bg.kind === 'blobs' || bg.kind === 'glow' || bg.kind === 'paper';
  const drift = -frame * 0.15;

  const patternStyle: React.CSSProperties | null = !pattern
    ? null
    : bg.kind === 'grid' || bg.kind === 'glow'
      ? {
          backgroundImage: `linear-gradient(${bg.pattern} 1.5px, transparent 1.5px), linear-gradient(90deg, ${bg.pattern} 1.5px, transparent 1.5px)`,
          backgroundSize: '72px 72px',
          backgroundPosition: `0px ${drift}px`,
        }
      : bg.kind === 'paper'
        ? {
            backgroundImage: `linear-gradient(${bg.pattern} 2px, transparent 2px)`,
            backgroundSize: '100% 64px',
            backgroundPosition: `0px ${drift}px`,
          }
        : bg.kind === 'halftone'
          ? {
              backgroundImage: `radial-gradient(circle, ${bg.pattern} 3px, transparent 3.5px)`,
              backgroundSize: '28px 28px',
              backgroundPosition: `0px ${drift}px`,
            }
          : {
              backgroundImage: `radial-gradient(circle, ${bg.pattern} 1.6px, transparent 2px)`,
              backgroundSize: '44px 44px',
              backgroundPosition: `0px ${drift}px`,
            };
  const mask =
    bg.kind === 'paper' || bg.kind === 'grid' ? undefined : 'radial-gradient(ellipse 75% 60% at 50% 45%, black 20%, transparent 85%)';

  return (
    <AbsoluteFill style={{background: base, overflow: 'hidden'}}>
      {showBlobs
        ? anchors.map(([ax, ay], i) => {
            const x = ax * width + noise2D(`${seed}-x${i}`, time, i) * width * 0.12 - size / 2;
            const y = ay * height + noise2D(`${seed}-y${i}`, i, time) * height * 0.08 - size / 2;
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
                  background: `radial-gradient(circle, ${bg.blobs[i]} 0%, ${bg.blobs[i]}00 62%)`,
                  opacity: bg.kind === 'glow' ? 0.7 : 0.9,
                }}
              />
            );
          })
        : null}
      {patternStyle ? <AbsoluteFill style={{...patternStyle, maskImage: mask, WebkitMaskImage: mask}} /> : null}
      {bg.kind === 'paper' ? (
        // Feine Papierstruktur – deterministisches SVG-Rauschen.
        <AbsoluteFill style={{opacity: 0.35, mixBlendMode: 'multiply'}}>
          <svg width={width} height={height}>
            <filter id="papier-korn">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} />
              <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.28  0 0 0 0.35 0" />
            </filter>
            <rect width={width} height={height} filter="url(#papier-korn)" />
          </svg>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
