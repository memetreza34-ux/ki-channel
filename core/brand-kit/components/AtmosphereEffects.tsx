import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, a, E, prog } from '../tokens';
import { FONT } from '../fonts';
import { useTheme } from '../theme';

// ════════════════════════════════════════════════════════════════════════════
//  EXTRAS — kuratierte Lücken-Füller (Remotion-nativ, theme-fähig).
//  Inspiriert von remocn/RemotionUI, aber sauber selbst gebaut (kein CLI/Tailwind).
// ════════════════════════════════════════════════════════════════════════════

// ─── Background: bewegter Mesh-Verlauf im Kanal-Akzent ───────────────────────
export const MeshGradientBG: React.FC<{ speed?: number }> = ({ speed = 1 }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const t = f * 0.012 * speed;
  const x1 = 50 + Math.sin(t) * 22, y1 = 40 + Math.cos(t * 0.8) * 20;
  const x2 = 70 + Math.cos(t * 0.6) * 18, y2 = 76 + Math.sin(t * 1.1) * 16;
  return (
    <AbsoluteFill style={{ background:
      `radial-gradient(50% 45% at ${x1}% ${y1}%, ${a(th.accent, 0.22)} 0%, transparent 60%),
       radial-gradient(46% 50% at ${x2}% ${y2}%, ${a(th.accentDk ?? th.accent, 0.18)} 0%, transparent 55%),
       ${th.bg}` }} />
  );
};

// ─── Text: blurt rein und schärft sich ein (premium, ruhig) ──────────────────
export const FocusBlurResolve: React.FC<{
  text: string; at?: number; dur?: number; size?: number; color?: string; weight?: number;
}> = ({ text, at = 0, dur = 20, size = 120, color = 'var(--accent)', weight = 800 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.out);
  return (
    <div style={{ fontFamily: FONT.title, fontSize: size, fontWeight: weight, color,
      filter: `blur(${(1 - p) * 18}px)`, opacity: Math.min(p * 1.4, 1),
      transform: `translateY(${(1 - p) * 28}px)`, lineHeight: 1 }}>
      {text}
    </div>
  );
};

// ─── Effekt: RGB-Chromatic-Aberration, die sich auflöst ──────────────────────
export const ChromaticReveal: React.FC<{ at?: number; dur?: number; children: React.ReactNode }> = ({
  at = 0, dur = 16, children,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.out);
  const off = (1 - p) * 14;
  return (
    <div style={{ position: 'relative', opacity: Math.min(p * 1.6, 1),
      filter: `drop-shadow(${off}px 0 0 ${a('#FF0040', 0.5)}) drop-shadow(${-off}px 0 0 ${a('#00E5FF', 0.5)})` }}>
      {children}
    </div>
  );
};

// ─── Tech: Glas-Code-Panel mit zeilenweisem Reveal (KI/E-Technik) ────────────
export const GlassCodeBlock: React.FC<{
  lines: string[]; at?: number; perLine?: number; title?: string; width?: number; fontSize?: number;
}> = ({ lines, at = 0, perLine = 7, title = 'main.ts', width = 860, fontSize = 26 }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  return (
    <div style={{ width, borderRadius: 18, overflow: 'hidden',
      background: a('#0B0F14', 0.72), border: `1px solid ${a(th.accent, 0.3)}`,
      boxShadow: `0 0 60px ${a(th.accent, 0.18)}, inset 0 1px 0 ${a('#FFFFFF', 0.08)}`,
      backdropFilter: 'blur(8px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
        borderBottom: `1px solid ${a('#FFFFFF', 0.08)}` }}>
        {['#FF5F56', '#FFBD2E', '#27C93F'].map((c) => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: 12, background: c }} />
        ))}
        <span style={{ marginLeft: 10, fontFamily: 'monospace', fontSize: 18, color: a('#FFFFFF', 0.55) }}>{title}</span>
      </div>
      <div style={{ padding: '20px 24px', fontFamily: 'monospace', fontSize, lineHeight: 1.6 }}>
        {lines.map((ln, i) => {
          const lp = prog(f, at + i * perLine, at + i * perLine + 6, E.out);
          return (
            <div key={i} style={{ opacity: lp, transform: `translateX(${(1 - lp) * 12}px)`,
              color: a('#FFFFFF', 0.9), whiteSpace: 'pre' }}>
              <span style={{ color: a(th.accent, 0.9) }}>{String(i + 1).padStart(2, ' ')}</span>{'  '}{ln}
            </div>
          );
        })}
      </div>
    </div>
  );
};
