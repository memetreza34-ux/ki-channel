import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { C, a, E, prog } from '../tokens';
import { FONT } from '../fonts';
import { useTheme } from '../theme';

// ════════════════════════════════════════════════════════════════════════════
//  PREMIUM MOTION — „immer lebt etwas". Alles frame-basiert (rendert sauber).
//  Inspiriert von remocn/Remotion-Bits-Shadern, aber nativ & theme-fähig gebaut.
// ════════════════════════════════════════════════════════════════════════════

// ─── LivingBackground — dauernd fließender Mesh-Verlauf (5 driftende Blobs) ───
//  Ersetzt den ruhigen Standard-BG: nie statisch, immer in sanfter Bewegung.
export const LivingBackground: React.FC<{ speed?: number }> = ({ speed = 1 }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const t = f * 0.01 * speed;
  const acDk = th.accentDk ?? th.accent;
  const blobs = [
    { c: th.accent, ox: 30, oy: 26, ax: 18, ay: 14, ph: 0.0, op: 0.30 },
    { c: acDk,      ox: 72, oy: 72, ax: 15, ay: 17, ph: 1.7, op: 0.26 },
    { c: C.blue,    ox: 62, oy: 30, ax: 20, ay: 15, ph: 3.1, op: 0.16 },
    { c: th.accent, ox: 24, oy: 74, ax: 13, ay: 19, ph: 4.5, op: 0.22 },
    { c: C.purple,  ox: 50, oy: 50, ax: 22, ay: 22, ph: 2.2, op: 0.14 },
  ];
  const layers = blobs.map((b) => {
    const x = b.ox + Math.sin(t + b.ph) * b.ax;
    const y = b.oy + Math.cos(t * 0.8 + b.ph) * b.ay;
    const pulse = b.op * (0.78 + 0.22 * Math.sin(t * 1.3 + b.ph));
    return `radial-gradient(42% 40% at ${x}% ${y}%, ${a(b.c, pulse)} 0%, transparent 58%)`;
  });
  return <AbsoluteFill style={{ background: `${layers.join(',')}, ${th.bg}` }} />;
};

// ─── FilmGrain — animiertes Korn (feiner Kino-Look, immer in Bewegung) ────────
export const FilmGrain: React.FC<{ opacity?: number; scale?: number }> = ({ opacity = 0.05, scale = 0.9 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity, mixBlendMode: 'overlay' }}>
      <svg width="100%" height="100%">
        <filter id="hf-grain">
          <feTurbulence type="fractalNoise" baseFrequency={scale} numOctaves={2}
            seed={f % 90} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hf-grain)" />
      </svg>
    </AbsoluteFill>
  );
};

// ─── Float — sanfte Dauerbewegung (nach dem Eintritt nie ganz still) ──────────
export const Float: React.FC<{ amp?: number; speed?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  amp = 6, speed = 1, children, style,
}) => {
  const f = useCurrentFrame();
  const y = Math.sin(f * 0.045 * speed) * amp;
  const x = Math.cos(f * 0.032 * speed) * amp * 0.45;
  return <div style={{ transform: `translate(${x}px, ${y}px)`, ...style }}>{children}</div>;
};

// ─── Breathe — dezentes Atmen (Scale-Puls) für Hero-Elemente ──────────────────
export const Breathe: React.FC<{ amp?: number; speed?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  amp = 0.012, speed = 1, children, style,
}) => {
  const f = useCurrentFrame();
  const s = 1 + Math.sin(f * 0.05 * speed) * amp;
  return <div style={{ transform: `scale(${s})`, transformOrigin: '50% 50%', ...style }}>{children}</div>;
};

// ─── SoftBlurIn — Inhalt schärft sich aus dem Unscharfen ein (premium, ruhig) ─
export const SoftBlurIn: React.FC<{
  at: number; dur?: number; y?: number; blur?: number; children: React.ReactNode; style?: React.CSSProperties;
}> = ({ at, dur = 18, y = 26, blur = 16, children, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.out);
  return (
    <div style={{ opacity: Math.min(p * 1.4, 1), filter: `blur(${(1 - p) * blur}px)`,
      transform: `translateY(${(1 - p) * y}px)`, ...style }}>{children}</div>
  );
};

// ─── PerCharRise — Buchstaben steigen einzeln von unten auf ───────────────────
export const PerCharRise: React.FC<{
  text: string; at: number; per?: number; size?: number; color?: string; weight?: number;
  font?: string; style?: React.CSSProperties;
}> = ({ text, at, per = 1.6, size = 84, color = C.white, weight = 800, font = FONT.title, style }) => {
  const f = useCurrentFrame();
  return (
    <span style={{ display: 'inline-flex', whiteSpace: 'pre', ...style }}>
      {text.split('').map((ch, i) => {
        const wf = at + i * per;
        const p = prog(f, wf, wf + 9, E.spring);
        return (
          <span key={i} style={{ display: 'inline-block', fontFamily: font, fontSize: size, fontWeight: weight,
            color, opacity: Math.min(p * 1.5, 1), transform: `translateY(${(1 - p) * 42}px)` }}>
            {ch === ' ' ? ' ' : ch}
          </span>
        );
      })}
    </span>
  );
};

// ─── KineticCaption — Premium-Untertitel: Wörter poppen, Keyword glüht ────────
//  DER Untertitel-Baustein für Reels (kein langweiliges Subtitle-Band). Zeigt
//  den gesprochenen Satz Wort für Wort, Keywords in Akzent + Glow, gut lesbar
//  über bewegtem Hintergrund (Text-Shadow statt Box).
export const KineticCaption: React.FC<{
  text: string; start: number; perWord?: number; size?: number; highlight?: string[];
  color?: string; hlColor?: string; weight?: number; style?: React.CSSProperties;
}> = ({ text, start, perWord = 3.5, size = 58, highlight = [], color = C.white,
  hlColor = 'var(--accent)', weight = 800, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hl = highlight.map((h) => h.toLowerCase());
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline',
      gap: `${Math.round(size * 0.12)}px ${Math.round(size * 0.32)}px`, fontFamily: FONT.body,
      fontSize: size, lineHeight: 1.22, ...style }}>
      {text.split(' ').map((w, i) => {
        const wf = start + i * perWord;
        const p = spring({ frame: f - wf, fps, config: { damping: 12, stiffness: 240 } });
        const clean = w.replace(/[.,!?„"“”:;()–—]/g, '').toLowerCase();
        const isH = hl.includes(clean);
        return (
          <span key={i} style={{ display: 'inline-block',
            fontSize: isH ? size * 1.06 : size, fontWeight: isH ? 900 : weight,
            color: isH ? hlColor : color, opacity: Math.min(p * 1.5, 1),
            transform: `translateY(${(1 - Math.min(p, 1.12)) * 34}px) scale(${Math.min(0.82 + p * 0.18, 1.04)})`,
            textShadow: isH ? `0 0 26px ${a(hlColor, 0.6)}` : `0 3px 20px ${a('#000000', 0.65)}` }}>{w}</span>
        );
      })}
    </div>
  );
};

// ─── ShimmerText — Text mit dauerhaftem Glanz-Sweep (Akzent-Wörter) ───────────
//  Nur für kurzen, EINZEILIGEN Text gedacht: der Sweep blendet (mixBlendMode)
//  gegen die gesamte Box, bei mehrzeiligem/umbrechendem Inhalt entsteht dadurch
//  ein sichtbarer dunkler Kasten in den Zeilenzwischenräumen. Für mehrzeiligen
//  Text stattdessen Underline/MarkerHighlight/Emphasis nutzen.
export const ShimmerText: React.FC<{
  children: React.ReactNode; size?: number; color?: string; period?: number; weight?: number; style?: React.CSSProperties;
}> = ({ children, size = 60, color = 'var(--accent)', period = 70, weight = 900, style }) => {
  const f = useCurrentFrame();
  const p = (f % period) / period;
  return (
    <span style={{ position: 'relative', display: 'inline-block', fontFamily: FONT.title, fontSize: size,
      fontWeight: weight, color, WebkitBackgroundClip: 'text', overflow: 'hidden', ...style }}>
      {children}
      <span style={{ position: 'absolute', inset: 0, transform: `translateX(${-100 + p * 260}%) skewX(-18deg)`,
        background: `linear-gradient(90deg, transparent, ${a(C.white, 0.55)}, transparent)`,
        mixBlendMode: 'overlay', pointerEvents: 'none' }} />
    </span>
  );
};
