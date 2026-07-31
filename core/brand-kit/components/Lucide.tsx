import React from 'react';
import { useCurrentFrame } from 'remotion';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { C, a, prog, E } from '../tokens';

// ════════════════════════════════════════════════════════════════════════════
//  <Lucide name="…"> — verdrahtet die 1735 Lucide-Icons (core/gehirn/assets/icons).
//  Discovery-Liste: core/gehirn/assets/icons.json (npm run icons-index).
//  Name = kebab-case wie im Ordner ("arrow-right", "brain-circuit", "trending-up").
//  Themed: übernimmt die Akzentfarbe (var(--accent)), optional Glow — wie <Icon>.
//
//  Konsistenz-Regel: EINE Icon-Familie fürs ganze Video. <Lucide> ist der
//  Default für alles außerhalb des handkuratierten <Icon>-Sets.
// ════════════════════════════════════════════════════════════════════════════
const REGISTRY = LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>;

const toPascal = (name: string) =>
  name.split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');

/** Löst einen kebab-case-Namen zur Lucide-Komponente auf (inkl. „…Icon"-Alias). */
export function resolveLucide(name: string): React.ComponentType<LucideProps> | null {
  const p = toPascal(name.trim());
  return REGISTRY[p] ?? REGISTRY[`${p}Icon`] ?? null;
}

export const Lucide: React.FC<{
  name: string;                  // kebab-case, z.B. "brain-circuit"
  size?: number;
  color?: string;
  stroke?: number;
  glow?: boolean;
  style?: React.CSSProperties;
}> = ({ name, size = 64, color = 'var(--accent)', stroke = 2, glow = true, style }) => {
  const Cmp = resolveLucide(name);
  if (!Cmp) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`<Lucide>: unbekanntes Icon "${name}" — siehe core/gehirn/assets/icons.json`);
    }
    return null;
  }
  return (
    <Cmp
      size={size}
      color={color}
      strokeWidth={stroke}
      style={{ filter: glow ? `drop-shadow(0 0 ${size * 0.12}px ${color}99)` : undefined, ...style }}
    />
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  <IconStrike> — Icon poppt rein, dann wird's durchgestrichen. Für "das NICHT
//  tun"-Momente an genau einer Stelle im Bild (z.B. "nicht panisch verkaufen").
//  Für Listen mit mehreren Punkten stattdessen <DontDoInstead> (PremiumFinance.tsx).
//    <IconStrike name="trending-down" size={90} at={30} strikeAt={50} />
// ════════════════════════════════════════════════════════════════════════════
export const IconStrike: React.FC<{
  name: string; size: number; at: number; strikeAt: number; color?: string;
}> = ({ name, size, at, strikeAt, color = C.negativeLt }) => {
  const f = useCurrentFrame();
  const pop = prog(f, at, at + 14, E.spring);
  const strike = prog(f, strikeAt, strikeAt + 15, E.inOut);
  return (
    <div style={{ position: 'relative', opacity: pop, transform: `scale(${0.7 + pop * 0.3})` }}>
      <Lucide name={name} size={size} color={color} />
      <div style={{
        position: 'absolute', left: '10%', top: '48%', width: `${strike * 80}%`, height: 6,
        background: a(C.negative, 0.9), borderRadius: 3, transform: 'rotate(-18deg)',
        boxShadow: `0 0 14px ${a(C.negative, 0.7)}`,
      }} />
    </div>
  );
};
