import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { C, a, E, prog } from '../tokens';
import { FONT } from '../fonts';
import { Lucide } from './Lucide';

// ════════════════════════════════════════════════════════════════════════════
//  PREMIUMICON — der EINE Standard-Weg, ein Icon zu zeigen. Nie mehr ein
//  nacktes <Lucide> ohne Rahmen/Glow in einer Szene. Gradient-Hintergrund
//  (Kreis/Quadrat) + Border + Glow-Ring + Spring-Scale-In beim Einblenden.
// ════════════════════════════════════════════════════════════════════════════

const PRESETS = {
  sm: { box: 72, icon: 32, stroke: 2 },
  md: { box: 108, icon: 48, stroke: 2 },
  lg: { box: 156, icon: 68, stroke: 1.75 },
} as const;

export type PremiumIconSize = keyof typeof PRESETS;

export const PremiumIcon: React.FC<{
  name: string;
  size?: PremiumIconSize;
  at?: number;
  variant?: 'circle' | 'square';
  color?: string;
  glow?: boolean;
  style?: React.CSSProperties;
}> = ({ name, size = 'md', at = 0, variant = 'circle', color = 'var(--accent)', glow = true, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { box, icon, stroke } = PRESETS[size];
  const enter = spring({ frame: f - at, fps, config: { damping: 11, stiffness: 140, mass: 0.7 } });
  const scale = Math.min(enter, 1.14);
  const p = prog(f, at, at + 10, E.out);
  const pulse = 1 + Math.sin(Math.max(0, f - at - 16) * 0.06) * 0.02;

  return (
    <div
      style={{
        width: box,
        height: box,
        borderRadius: variant === 'circle' ? 999 : box * 0.26,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: p,
        transform: `scale(${scale * pulse})`,
        background: `radial-gradient(circle at 32% 28%, ${a(color, 0.32)}, ${a(color, 0.1)} 60%, ${a(color, 0.04)})`,
        border: `2px solid ${a(color, 0.55)}`,
        boxShadow: glow
          ? `0 0 ${box * 0.5}px ${a(color, 0.35)}, inset 0 0 ${box * 0.2}px ${a(color, 0.15)}`
          : undefined,
        flexShrink: 0,
        ...style,
      }}
    >
      <Lucide name={name} size={icon} color={color} stroke={stroke} glow={false} />
    </div>
  );
};

/** Kleine Zeile: PremiumIcon + Label daneben — Standard-Pattern für Icon-Listen. */
export const PremiumIconLabel: React.FC<{
  name: string;
  label: string;
  size?: PremiumIconSize;
  at?: number;
  variant?: 'circle' | 'square';
  color?: string;
  textColor?: string;
  gap?: number;
  fontSize?: number;
}> = ({ name, label, size = 'sm', at = 0, variant = 'circle', color = 'var(--accent)', textColor = C.white, gap = 20, fontSize = 26 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, E.out);
  const tx = (1 - p) * -16;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap }}>
      <PremiumIcon name={name} size={size} at={at} variant={variant} color={color} />
      <span
        style={{
          fontFamily: FONT.body,
          fontWeight: 700,
          fontSize,
          color: textColor,
          opacity: p,
          transform: `translateX(${tx}px)`,
        }}
      >
        {label}
      </span>
    </div>
  );
};
