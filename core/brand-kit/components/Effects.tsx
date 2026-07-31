import React from 'react';
import { AbsoluteFill, useCurrentFrame, random, interpolate } from 'remotion';
import { Trail, CameraMotionBlur } from '@remotion/motion-blur';
import { C, E, prog, lerpF, a, CLAMP } from '../tokens';
import { FONT } from '../fonts';

// ════════════════════════════════════════════════════════════════════════════
//  PREMIUM-ANIMATIONSEFFEKTE
// ════════════════════════════════════════════════════════════════════════════

// ─── ROLLING NUMBER (Odometer) — Ziffern rollen wie Tacho ─────────────────────
export const RollingNumber: React.FC<{
  to: number; start: number; end: number; size?: number; color?: string;
  suffix?: string; style?: React.CSSProperties;
}> = ({ to, start, end, size = 160, color = 'var(--accent)', suffix = ' €', style }) => {
  const f = useCurrentFrame();
  const val = Math.round(lerpF(f, 0, to, start, end, E.out));
  const str = val.toLocaleString('de-DE');
  const digitH = size * 1.1;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', fontFamily: FONT.title, fontSize: size,
      color, lineHeight: 1, textShadow: `0 0 60px ${a(color, 0.5)}`, ...style }}>
      {str.split('').map((ch, i) => {
        if (ch < '0' || ch > '9') return <span key={i} style={{ padding: '0 2px' }}>{ch}</span>;
        const d = parseInt(ch, 10);
        return (
          <span key={i} style={{ display: 'inline-block', height: digitH, overflow: 'hidden', width: size * 0.6 }}>
            <span style={{ display: 'flex', flexDirection: 'column', transform: `translateY(${-d * digitH}px)` }}>
              {Array.from({ length: 10 }, (_, n) => (
                <span key={n} style={{ height: digitH, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
              ))}
            </span>
          </span>
        );
      })}
      <span style={{ marginLeft: 6 }}>{suffix}</span>
    </div>
  );
};

// ─── GELD-REGEN — fallende € Scheine/Münzen ───────────────────────────────────
export const MoneyRain: React.FC<{ width: number; height: number; n?: number; emoji?: string }> = ({
  width, height, n = 26, emoji = '💶',
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {Array.from({ length: n }, (_, i) => {
        const x = random(`mx${i}`) * width;
        const speed = 1.4 + random(`ms${i}`) * 2.2;
        const y = ((f * speed + random(`mo${i}`) * height) % (height + 120)) - 80;
        const rot = (f * (2 + random(`mr${i}`) * 4) + i * 40) % 360;
        const sway = Math.sin((f + i * 12) * 0.05) * 24;
        const sz = 34 + random(`mz${i}`) * 26;
        return <div key={i} style={{ position: 'absolute', left: x + sway, top: y, fontSize: sz,
          transform: `rotate(${rot}deg)`, opacity: 0.85 }}>{emoji}</div>;
      })}
    </AbsoluteFill>
  );
};

// ─── KONFETTI-BURST ───────────────────────────────────────────────────────────
export const Confetti: React.FC<{ width: number; height: number; at: number; n?: number }> = ({
  width, height, at, n = 60,
}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 90) return null;
  const cols = ['var(--accent)', C.gold, C.blue, C.purple, C.white];
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {Array.from({ length: n }, (_, i) => {
        const ang = (random(`ca${i}`) - 0.5) * Math.PI * 1.2 - Math.PI / 2;
        const sp = 8 + random(`cs${i}`) * 16;
        const x = width / 2 + Math.cos(ang) * sp * t;
        const y = height / 2 + Math.sin(ang) * sp * t + 0.5 * 0.9 * t * t;
        const op = interpolate(t, [0, 60, 90], [1, 1, 0], CLAMP);
        const w = 8 + random(`cw${i}`) * 8;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: w, height: w * 1.6,
          background: cols[i % cols.length], opacity: op, transform: `rotate(${t * 12 + i * 30}deg)`,
          borderRadius: 2 }} />;
      })}
    </AbsoluteFill>
  );
};

// ─── SPARKLES — funkelnde Punkte (gezielt) ────────────────────────────────────
export const Sparkles: React.FC<{ width: number; height: number; n?: number; color?: string }> = ({
  width, height, n = 18, color = C.gold,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: n }, (_, i) => {
        const x = random(`sx${i}`) * width, y = random(`sy${i}`) * height;
        const ph = (f * 0.08 + random(`sp${i}`) * 6) % (Math.PI * 2);
        const s = Math.max(0, Math.sin(ph));
        const sz = 4 + s * 10;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: sz, height: sz,
          opacity: s, background: color, borderRadius: '50%', boxShadow: `0 0 ${sz * 2}px ${color}` }} />;
      })}
    </AbsoluteFill>
  );
};

// ─── AURORA-HINTERGRUND — fließende Farbschleier ──────────────────────────────
export const AuroraBG: React.FC<{ colors?: string[] }> = ({ colors = ['var(--accent)', C.blue, 'var(--accent-dk)'] }) => {
  const f = useCurrentFrame();
  // Reine Radial-Gradienten (von Natur aus weich) — KEIN teurer Blur-Filter.
  const layers = colors.map((col, i) => {
    const x = 50 + Math.sin((f * 0.012) + i * 2) * 28;
    const y = 40 + Math.cos((f * 0.01) + i * 1.5) * 28;
    return `radial-gradient(45% 45% at ${x}% ${y}%, ${a(col, 0.3)} 0%, transparent 55%)`;
  });
  return <AbsoluteFill style={{ overflow: 'hidden', background: `${layers.join(',')}, ${C.bg}` }} />;
};

// ─── PULSE-GRID — atmendes Raster ─────────────────────────────────────────────
export const PulseGrid: React.FC<{ color?: string }> = ({ color = 'var(--accent)' }) => {
  const f = useCurrentFrame();
  const op = 0.04 + Math.sin(f * 0.06) * 0.03;
  return (
    <AbsoluteFill style={{
      backgroundImage: `linear-gradient(${a(color, 1)} 1px, transparent 1px), linear-gradient(90deg, ${a(color, 1)} 1px, transparent 1px)`,
      backgroundSize: '80px 80px', opacity: op,
      transform: `scale(${1 + Math.sin(f * 0.04) * 0.02})`,
    }} />
  );
};

// ─── SHINE — Glanz-Sweep über ein Element ─────────────────────────────────────
export const Shine: React.FC<{ children: React.ReactNode; at: number; dur?: number; style?: React.CSSProperties }> = ({
  children, at, dur = 24, style,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.inOut);
  return (
    <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block', ...style }}>
      {children}
      <div style={{ position: 'absolute', top: 0, bottom: 0, width: '40%',
        left: `${-40 + p * 180}%`, transform: 'skewX(-20deg)',
        background: `linear-gradient(90deg, transparent, ${a(C.white, 0.45)}, transparent)`,
        opacity: p > 0 && p < 1 ? 1 : 0 }} />
    </div>
  );
};

// ─── SPOTLIGHT / IRIS-REVEAL — kreisförmige Enthüllung ────────────────────────
export const SpotlightReveal: React.FC<{ children: React.ReactNode; at: number; dur?: number }> = ({
  children, at, dur = 24,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.inOut);
  const r = p * 120;
  return (
    <div style={{ clipPath: `circle(${r}% at 50% 50%)`, WebkitClipPath: `circle(${r}% at 50% 50%)`, width: '100%', height: '100%' }}>
      {children}
    </div>
  );
};

// ─── EMPHASIS — Pop + Wackeln zur Betonung eines Worts ────────────────────────
export const Emphasis: React.FC<{ children: React.ReactNode; at: number; color?: string; size?: number }> = ({
  children, at, color = C.gold, size = 90,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 10, E.spring);
  const wob = f > at && f < at + 20 ? Math.sin((f - at) * 0.8) * 3 * (1 - (f - at) / 20) : 0;
  return (
    <span style={{ display: 'inline-block', fontFamily: FONT.title, fontSize: size, color,
      transform: `scale(${0.5 + p * 0.5}) rotate(${wob}deg)`, textShadow: `0 0 50px ${a(color, 0.6)}` }}>
      {children}
    </span>
  );
};

// ─── PUSH-IN — Kamera fährt langsam in ein Element ────────────────────────────
export const PushIn: React.FC<{ children: React.ReactNode; from?: number; to?: number; durFrames: number }> = ({
  children, from = 1, to = 1.12, durFrames,
}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, durFrames], [from, to], { ...CLAMP, easing: E.inOut });
  return <div style={{ width: '100%', height: '100%', transform: `scale(${s})`, transformOrigin: '50% 50%' }}>{children}</div>;
};

// ─── MOTION BLUR — Bewegungsunschärfe für bewegte Elemente (Premium-Feel) ──────
// Um schnelle Bewegungen legen (Slide-Ins, RollingNumber, Wisch-Übergänge).
// strength: 'subtle' (Text) | 'medium' (Standard) | 'strong' (schnelle Wische)
export const MotionBlur: React.FC<{
  children: React.ReactNode; strength?: 'subtle' | 'medium' | 'strong'; style?: React.CSSProperties;
}> = ({ children, strength = 'medium', style }) => {
  const cfg = {
    subtle: { layers: 5, lagInFrames: 0.6, trailOpacity: 0.5 },
    medium: { layers: 8, lagInFrames: 1.0, trailOpacity: 0.55 },
    strong: { layers: 14, lagInFrames: 1.6, trailOpacity: 0.6 },
  }[strength];
  return (
    <div style={style}>
      <Trail layers={cfg.layers} lagInFrames={cfg.lagInFrames} trailOpacity={cfg.trailOpacity}>
        {children}
      </Trail>
    </div>
  );
};

// ─── CAMERA BLUR — ganze Szene weichzeichnen bei Kamerafahrten/Cuts ────────────
// Kinder müssen absolut positioniert sein (AbsoluteFill). Für Push-Ins / Szenen-Cuts.
export const CameraBlur: React.FC<{
  children: React.ReactNode; shutterAngle?: number; samples?: number;
}> = ({ children, shutterAngle = 180, samples = 8 }) => (
  <CameraMotionBlur shutterAngle={shutterAngle} samples={samples}>
    {children}
  </CameraMotionBlur>
);

// ─── BOUNDING BOX — Rahmen zieht sich live um ein Element ("dieser Button hier") ──
// Absolut über ein UI-Element/Mockup-Ausschnitt legen (x/y/w/h = Zielposition+-größe).
export const BoundingBox: React.FC<{
  x: number; y: number; w: number; h: number; at: number; durFrames?: number;
  color?: string; label?: string;
}> = ({ x, y, w, h, at, durFrames = 16, color = C.gold, label }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + durFrames, E.out);
  const corner = 24;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, pointerEvents: 'none' }}>
      <svg width={w + 16} height={h + 16} style={{ position: 'absolute', left: -8, top: -8, overflow: 'visible' }}>
        {[
          `M 0 ${corner} V 0 H ${corner}`,
          `M ${w + 16 - corner} 0 H ${w + 16} V ${corner}`,
          `M ${w + 16} ${h + 16 - corner} V ${h + 16} H ${w + 16 - corner}`,
          `M ${corner} ${h + 16} H 0 V ${h + 16 - corner}`,
        ].map((d, i) => (
          <path key={i} d={d} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, p * 4 - i * 0.6)}
            style={{ filter: `drop-shadow(0 0 8px ${a(color, 0.6)})` }} />
        ))}
      </svg>
      {label && (
        <div style={{ position: 'absolute', left: 0, top: -46, opacity: prog(f, at + durFrames, at + durFrames + 10, E.out),
          padding: '6px 14px', borderRadius: 10, background: color, fontFamily: FONT.body, fontWeight: 700,
          fontSize: 20, color: C.bgDeep }}>{label}</div>
      )}
    </div>
  );
};
