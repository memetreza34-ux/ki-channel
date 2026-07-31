import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, E, a, prog, lerpF } from '../tokens';
import { FONT } from '../fonts';

// ════════════════════════════════════════════════════════════════════════════
//  PREMIUM-MOTION-BAUSTEINE — kanal-neutral (funktioniert für alle 4 Kanäle).
//  Ergänzt Lücken: generischer Wordmark-Intro, organische Formen, Wipes, Glitch.
// ════════════════════════════════════════════════════════════════════════════

// ─── WORDMARKREVEAL — generischer Marken-Intro (Ring + zweiteiliger Name) ────
//  Ersetzt das FinanzNeo-fest-codierte LogoIntro für andere Kanäle.
export const WordmarkReveal: React.FC<{
  partA: string; partB: string; at?: number; size?: number;
}> = ({ partA, partB, at = 0, size = 120 }) => {
  const f = useCurrentFrame();
  const ring = prog(f, at, at + 20, E.out);
  const textA = prog(f, at + 10, at + 24, E.spring);
  const textB = prog(f, at + 18, at + 30, E.spring);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size * 3} height={size * 3} style={{ position: 'absolute' }}>
        <circle cx={size * 1.5} cy={size * 1.5} r={size * 1.25} fill="none" stroke="var(--accent)" strokeWidth={size * 0.067}
          strokeDasharray={`${2 * Math.PI * size * 1.25}`} strokeDashoffset={`${2 * Math.PI * size * 1.25 * (1 - ring)}`}
          transform={`rotate(-90 ${size * 1.5} ${size * 1.5})`}
          style={{ filter: `drop-shadow(0 0 16px ${a('var(--accent)', 0.7)})` }} />
      </svg>
      <div style={{ display: 'flex', fontFamily: FONT.title, fontSize: size, lineHeight: 1 }}>
        <span style={{ color: C.white, opacity: textA, transform: `translateX(${lerpF(f, -40, 0, at + 10, at + 24)}px)` }}>{partA}</span>
        <span style={{ color: 'var(--accent)', opacity: textB, transform: `translateX(${lerpF(f, 40, 0, at + 18, at + 30)}px)`,
          textShadow: `0 0 40px ${a('var(--accent)', 0.6)}` }}>{partB}</span>
      </div>
    </AbsoluteFill>
  );
};

// ─── LIQUIDBLOB — organische, morphende Blob-Fläche (Hintergrund-Akzent) ─────
export const LiquidBlob: React.FC<{
  cx: number; cy: number; radius?: number; color?: string; opacity?: number; speed?: number;
}> = ({ cx, cy, radius = 300, color = 'var(--accent)', opacity = 0.14, speed = 1 }) => {
  const f = useCurrentFrame();
  const pts = 8;
  const path = Array.from({ length: pts }, (_, i) => {
    const ang = (i / pts) * Math.PI * 2;
    const wobble = Math.sin(f * 0.02 * speed + i * 1.7) * radius * 0.16;
    const r = radius + wobble;
    return [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r];
  });
  const d = path.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x} ${y}`;
    const [px, py] = path[i - 1];
    const [mx, my] = [(px + x) / 2, (py + y) / 2];
    return `${acc} Q ${px} ${py} ${mx} ${my}`;
  }, '') + ' Z';
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
      <path d={d} fill={color} opacity={opacity} style={{ filter: 'blur(60px)' }} />
    </svg>
  );
};

// ─── GLOWORB — schwebende, pulsierende Lichtkugel (Ambient-Akzent) ───────────
export const GlowOrb: React.FC<{
  x: number; y: number; size?: number; color?: string; driftY?: number;
}> = ({ x, y, size = 120, color = 'var(--accent)', driftY = 24 }) => {
  const f = useCurrentFrame();
  const pulse = 0.7 + Math.sin(f * 0.05) * 0.3;
  const dy = Math.sin(f * 0.025) * driftY;
  return (
    <div style={{ position: 'absolute', left: x - size / 2, top: y - size / 2 + dy, width: size, height: size,
      borderRadius: 999, background: color, opacity: 0.5 * pulse,
      filter: `blur(${size * 0.3}px)` }} />
  );
};

// ─── SHAPERING — dekorativer, sich drehender Ring-Akzent (kein Logo) ─────────
export const ShapeRing: React.FC<{
  cx: number; cy: number; radius?: number; at?: number; color?: string; strokeWidth?: number; dashed?: boolean;
}> = ({ cx, cy, radius = 200, at = 0, color = 'var(--accent)', strokeWidth = 4, dashed = false }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 30, E.out);
  const rot = f * 0.3;
  return (
    <svg width={cx * 2} height={cy * 2} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={dashed ? '14 10' : `${2 * Math.PI * radius}`}
        strokeDashoffset={dashed ? 0 : `${2 * Math.PI * radius * (1 - p)}`}
        opacity={dashed ? 0.5 : 1}
        transform={`rotate(${dashed ? rot : -90} ${cx} ${cy})`}
        style={{ filter: `drop-shadow(0 0 10px ${a(color, 0.5)})` }} />
    </svg>
  );
};

// ─── DIAGONALWIPE — harter Szenenwechsel, diagonale Kante wischt durch ───────
//  Als Overlay über der ganzen Szene platzieren: <DiagonalWipe at={frame} />
export const DiagonalWipe: React.FC<{ at: number; dur?: number; color?: string }> = ({
  at, dur = 16, color = C.bgDeep,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.inOut);
  if (p <= 0 || p >= 1) return null;
  const x = lerpF(f, -30, 130, at, at + dur, E.inOut);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${x}%`, width: '40%',
        background: color, transform: 'skewX(-12deg)' }} />
    </div>
  );
};

// ─── CIRCLEREVEAL — Iris-Wischblende, Kreis öffnet/schließt die Szene ────────
export const CircleReveal: React.FC<{ at: number; dur?: number; from?: 'open' | 'close'; color?: string }> = ({
  at, dur = 20, from = 'open', color = C.bgDeep,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.inOut);
  if (p <= 0 || p >= 1) return null;
  const radius = from === 'open' ? lerpF(f, 0, 150, at, at + dur, E.inOut) : lerpF(f, 150, 0, at, at + dur, E.inOut);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
      background: color,
      WebkitMaskImage: `radial-gradient(circle at center, transparent ${radius}%, black ${radius}%)`,
      maskImage: `radial-gradient(circle at center, transparent ${radius}%, black ${radius}%)` }} />
  );
};

// ─── GLITCHBURST — kurzer Aufmerksamkeits-Glitch (RGB-Split-Flackern) ────────
export const GlitchBurst: React.FC<{ at: number; dur?: number; children: React.ReactNode }> = ({
  at, dur = 10, children,
}) => {
  const f = useCurrentFrame();
  const active = f >= at && f <= at + dur;
  if (!active) return <>{children}</>;
  const t = (f - at) / dur;
  const jx = (Math.sin(f * 9) * (1 - t)) * 8;
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${jx}px)`, opacity: 0.7,
        mixBlendMode: 'screen', filter: 'hue-rotate(90deg)' }}>{children}</div>
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${-jx}px)`, opacity: 0.7,
        mixBlendMode: 'screen', filter: 'hue-rotate(-90deg)' }}>{children}</div>
      {children}
    </div>
  );
};

// ─── MOODGRADIENT — konfigurierbarer Farbstimmungs-Hintergrund ──────────────
export type Mood = 'cyber' | 'luxury' | 'minimal' | 'warm';
const MOODS: Record<Mood, [string, string]> = {
  cyber:   ['#0A0E27', '#1A0B3E'],
  luxury:  ['#0F0B05', '#2A1E0A'],
  minimal: ['#0B0F14', '#0B0F14'],
  warm:    ['#150A05', '#2E1608'],
};
export const MoodGradient: React.FC<{ mood: Mood; accentGlow?: boolean }> = ({ mood, accentGlow = true }) => {
  const [c1, c2] = MOODS[mood];
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${c1}, ${c2})` }}>
      {accentGlow && (
        <div style={{ position: 'absolute', top: '20%', left: '60%', width: 700, height: 700, borderRadius: 999,
          background: 'var(--accent)', opacity: 0.08, filter: 'blur(140px)' }} />
      )}
    </AbsoluteFill>
  );
};

// ─── NEONFLICKER — Text flackert wie ein Neonschild an, bevor es stabil leuchtet ─
export const NeonFlicker: React.FC<{ text: string; at: number; size?: number; color?: string }> = ({
  text, at, size = 100, color = 'var(--accent)',
}) => {
  const f = useCurrentFrame();
  const rel = f - at;
  if (rel < 0) return null;
  // Flacker-Muster: unruhig an/aus in den ersten ~18 Frames, dann stabil an.
  const flickerPattern = [0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1];
  const on = rel < flickerPattern.length ? flickerPattern[rel] : 1;
  const glow = on ? 0.75 : 0.15;
  return (
    <div style={{ fontFamily: FONT.title, fontSize: size, color: on ? color : a(color, 0.25),
      textShadow: on ? `0 0 20px ${a(color, glow)}, 0 0 50px ${a(color, glow * 0.7)}, 0 0 90px ${a(color, glow * 0.4)}` : 'none',
      transition: 'none' }}>{text}</div>
  );
};

// ─── STAMPIMPACT — Element knallt mit Wucht rein, wackelt kurz nach ─────────
export const StampImpact: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const f = useCurrentFrame();
  const rel = f - at;
  if (rel < 0) return null;
  const hit = rel < 6;
  const scale = hit ? lerpF(f, 1.6, 0.94, at, at + 6, E.out) : 1 + Math.sin(rel * 2.2) * Math.max(0, 0.03 - rel * 0.001);
  const rot = hit ? 0 : Math.sin(rel * 2.2) * Math.max(0, 1.5 - rel * 0.06);
  const opacity = prog(f, at, at + 3, E.out);
  return (
    <div style={{ opacity, transform: `scale(${scale}) rotate(${rot}deg)`, display: 'inline-block' }}>{children}</div>
  );
};

// ─── PARTICLEASSEMBLE — Punkte fliegen zusammen und formen die Textposition ─
export const ParticleAssemble: React.FC<{ text: string; at: number; size?: number; color?: string; n?: number }> = ({
  text, at, size = 90, color = C.white, n = 40,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 26, E.out);
  const textP = prog(f, at + 18, at + 30, E.out);
  const seeded = Array.from({ length: n }, (_, i) => {
    const ang = (i / n) * Math.PI * 2 + i;
    const dist = 300 + (i % 5) * 60;
    return { sx: Math.cos(ang) * dist, sy: Math.sin(ang) * dist };
  });
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{ fontFamily: FONT.title, fontSize: size, color, opacity: textP }}>{text}</div>
      {p < 1 && seeded.map((pt, i) => (
        <div key={i} style={{ position: 'absolute', left: '50%', top: '50%', width: 6, height: 6, borderRadius: 999,
          background: 'var(--accent)', opacity: (1 - p) * 0.9,
          transform: `translate(${lerpF(f, pt.sx, 0, at, at + 26, E.out)}px, ${lerpF(f, pt.sy, 0, at, at + 26, E.out)}px)` }} />
      ))}
    </div>
  );
};

// ─── CURTAINREVEAL — zwei Panels ziehen sich auseinander, geben Inhalt frei ──
export const CurtainReveal: React.FC<{ at: number; dur?: number; color?: string; children: React.ReactNode }> = ({
  at, dur = 24, color = C.bgDeep, children,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.inOut);
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {children}
      <div style={{ position: 'absolute', top: 0, left: 0, width: `${50 * (1 - p)}%`, height: '100%', background: color }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: `${50 * (1 - p)}%`, height: '100%', background: color }} />
    </div>
  );
};

// ─── PERSPECTIVE3DFLIP — Karte dreht sich um die Y-Achse rein ──────────────
export const Perspective3DFlip: React.FC<{ at: number; dur?: number; children: React.ReactNode }> = ({
  at, dur = 20, children,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.spring);
  const rotY = lerpF(f, -100, 0, at, at + dur, E.spring);
  return (
    <div style={{ perspective: 1200 }}>
      <div style={{ opacity: p, transform: `rotateY(${rotY}deg)`, transformStyle: 'preserve-3d' }}>{children}</div>
    </div>
  );
};

// ─── CINEMATICGRADE — Film-Look-Overlay (Korn + Vignette + Farbstich) ───────
//  Über eine bestehende Szene legen: <CinematicGrade mood="noir" />
export type CineMood = 'action' | 'noir' | 'warm' | 'scifi' | 'epic';
const CINE: Record<CineMood, { tint: string; vig: number }> = {
  action: { tint: 'rgba(255,120,40,0.06)', vig: 0.55 },
  noir:   { tint: 'rgba(255,255,255,0.03)', vig: 0.7 },
  warm:   { tint: 'rgba(255,180,90,0.08)', vig: 0.4 },
  scifi:  { tint: 'rgba(60,180,255,0.07)', vig: 0.5 },
  epic:   { tint: 'rgba(255,210,120,0.06)', vig: 0.6 },
};
export const CinematicGrade: React.FC<{ mood: CineMood; grain?: boolean }> = ({ mood, grain = true }) => {
  const f = useCurrentFrame();
  const cfg = CINE[mood];
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: cfg.tint, mixBlendMode: 'overlay' }} />
      <div style={{ position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,${cfg.vig}) 100%)` }} />
      {grain && (
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '3px 3px', transform: `translate(${(f * 7) % 3}px, ${(f * 5) % 3}px)` }} />
      )}
    </AbsoluteFill>
  );
};

// ─── INKSPLASH — Tinten-/Farbspritzer-Reveal (dramatischer Akzent) ──────────
export const InkSplash: React.FC<{ cx: number; cy: number; at: number; color?: string; size?: number }> = ({
  cx, cy, at, color = 'var(--accent)', size = 260,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 22, E.out);
  const drops = Array.from({ length: 10 }, (_, i) => {
    const ang = (i / 10) * Math.PI * 2 + i * 0.7;
    const dist = size * (0.4 + (i % 3) * 0.22);
    return { x: Math.cos(ang) * dist * p, y: Math.sin(ang) * dist * p, r: (8 + (i % 4) * 6) * p };
  });
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
      <circle cx={cx} cy={cy} r={size * 0.32 * p} fill={color} opacity={0.85 * (1 - p * 0.2)} />
      {drops.map((d, i) => (
        <circle key={i} cx={cx + d.x} cy={cy + d.y} r={d.r} fill={color} opacity={0.7 * (1 - p * 0.3)} />
      ))}
    </svg>
  );
};

// ─── MORPHSHAPE — abstrakte Form morpht zwischen Kreis/Dreieck/Sechseck ─────
export const MorphShape: React.FC<{ cx: number; cy: number; size?: number; color?: string; speed?: number }> = ({
  cx, cy, size = 200, color = 'var(--accent)', speed = 1,
}) => {
  const f = useCurrentFrame();
  const t = (f * 0.012 * speed) % 3;
  const phase = Math.floor(t);
  const localP = t - phase;
  const shape = (sides: number, rot: number) => Array.from({ length: sides }, (_, i) => {
    const ang = (i / sides) * Math.PI * 2 + rot;
    return [cx + Math.cos(ang) * size, cy + Math.sin(ang) * size];
  });
  const shapes = [shape(24, 0), shape(3, -Math.PI / 2), shape(6, 0)]; // Kreis-Approx, Dreieck, Sechseck
  const from = shapes[phase % 3], to = shapes[(phase + 1) % 3];
  const norm = (pts: number[][], n: number) => Array.from({ length: n }, (_, i) => pts[i % pts.length]);
  const N = 24;
  const fromN = norm(from, N), toN = norm(to, N);
  const d = fromN.map(([x, y], i) => {
    const [tx, ty] = toN[i];
    const ep = E.inOut(localP);
    return `${i === 0 ? 'M' : 'L'} ${x + (tx - x) * ep} ${y + (ty - y) * ep}`;
  }).join(' ') + ' Z';
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
      <path d={d} fill="none" stroke={color} strokeWidth={3} opacity={0.5}
        style={{ filter: `drop-shadow(0 0 14px ${a(color, 0.4)})` }} />
    </svg>
  );
};

// ─── HEXGRID — dekoratives Sechseck-Raster (Hintergrund-Textur) ────────────
export const HexGrid: React.FC<{ opacity?: number; color?: string }> = ({ opacity = 0.06, color = C.white }) => {
  const size = 60;
  const rows = 14, cols = 20;
  const hexPoints = (cx: number, cy: number, r: number) => Array.from({ length: 6 }, (_, i) => {
    const ang = (Math.PI / 3) * i;
    return `${cx + r * Math.cos(ang)},${cy + r * Math.sin(ang)}`;
  }).join(' ');
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
      {Array.from({ length: rows }, (_, row) => Array.from({ length: cols }, (_, col) => {
        const x = col * size * 1.5;
        const y = row * size * 0.87 + (col % 2 === 0 ? 0 : size * 0.43);
        return <polygon key={`${row}-${col}`} points={hexPoints(x, y, size * 0.5)} fill="none"
          stroke={color} strokeWidth={1} opacity={opacity} />;
      }))}
    </svg>
  );
};

// ─── TOAST — Benachrichtigungs-Popup, gleitet ein, bleibt kurz stehen ──────
export const Toast: React.FC<{ text: string; at: number; dur?: number; icon?: string; kind?: 'success' | 'info' }> = ({
  text, at, dur = 60, icon, kind = 'success',
}) => {
  const f = useCurrentFrame();
  const inP = prog(f, at, at + 12, E.spring);
  const outP = prog(f, at + dur - 10, at + dur, E.in);
  const col = kind === 'success' ? 'var(--accent)' : C.blue;
  return (
    <div style={{ position: 'absolute', top: 80, right: 80, opacity: inP * (1 - outP),
      transform: `translateY(${lerpF(f, -30, 0, at, at + 12, E.spring)}px)`,
      display: 'flex', alignItems: 'center', gap: 14, padding: '20px 28px', borderRadius: 18,
      background: a(C.bgDeep, 0.9), border: `2px solid ${a(col, 0.5)}`, boxShadow: `0 0 30px ${a(col, 0.2)}` }}>
      <div style={{ width: 12, height: 12, borderRadius: 999, background: col }} />
      <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 24, color: C.white }}>{text}</span>
    </div>
  );
};

// ─── LOADINGPULSE — 3-Punkt-Ladeanimation (Verarbeitung/Warten) ───────────
export const LoadingPulse: React.FC<{ cx: number; cy: number; color?: string; size?: number }> = ({
  cx, cy, color = 'var(--accent)', size = 16,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: cx - size * 3, top: cy - size / 2, display: 'flex', gap: size }}>
      {[0, 1, 2].map((i) => {
        const s = 0.6 + Math.max(0, Math.sin((f - i * 5) * 0.25)) * 0.6;
        return <div key={i} style={{ width: size, height: size, borderRadius: 999, background: color,
          transform: `scale(${s})`, opacity: 0.5 + s * 0.4 }} />;
      })}
    </div>
  );
};

// ─── BUTTONPRESS — Button klickt (Ripple + kurzes Eindrücken) ────────────────
export const ButtonPress: React.FC<{ label: string; cx: number; cy: number; at: number; width?: number }> = ({
  label, cx, cy, at, width = 340,
}) => {
  const f = useCurrentFrame();
  const inP = prog(f, at - 12, at, E.spring);
  const pressed = f >= at && f < at + 8;
  const rippleP = prog(f, at, at + 26, E.out);
  const scale = pressed ? 0.94 : 1;
  return (
    <div style={{ position: 'absolute', left: cx - width / 2, top: cy - 42, width, height: 84, opacity: inP }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 999,
        background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `scale(${scale})`, boxShadow: `0 0 34px ${a('var(--accent)', 0.4)}`, overflow: 'hidden' }}>
        {f >= at && (
          <div style={{ position: 'absolute', width: 20 + rippleP * 340, height: 20 + rippleP * 340, borderRadius: 999,
            background: a(C.white, 0.35 * (1 - rippleP)) }} />
        )}
        <span style={{ position: 'relative', fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: C.bgDeep }}>{label}</span>
      </div>
    </div>
  );
};

// ─── TOGGLESWITCH — Schalter kippt von Aus zu An ────────────────────────────
export const ToggleSwitch: React.FC<{ label: string; cx: number; cy: number; at: number }> = ({
  label, cx, cy, at,
}) => {
  const f = useCurrentFrame();
  const inP = prog(f, at - 10, at, E.spring);
  const on = prog(f, at, at + 14, E.spring);
  const w = 100, h = 52;
  return (
    <div style={{ position: 'absolute', left: cx - 220, top: cy - 26, display: 'flex', alignItems: 'center',
      gap: 24, opacity: inP }}>
      <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 28, color: C.white }}>{label}</span>
      <div style={{ width: w, height: h, borderRadius: 999, background: 'rgba(255,255,255,0.08)',
        border: `2px solid ${a('var(--accent)', 0.3 + on * 0.4)}`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 999,
          background: 'var(--accent)', opacity: on * 0.22 }} />
        <div style={{ position: 'absolute', top: 4, left: 4 + on * (w - h + 8), width: h - 8, height: h - 8, borderRadius: 999,
          background: on > 0.5 ? 'var(--accent)' : C.gray, boxShadow: on > 0.5 ? `0 0 14px ${a('var(--accent)', 0.6)}` : undefined }} />
      </div>
    </div>
  );
};

// ─── DROPDOWNOPEN — Auswahlmenü klappt auf, Optionen erscheinen gestaffelt ──
export const DropdownOpen: React.FC<{
  label: string; options: string[]; cx: number; cy: number; at: number; width?: number;
}> = ({ label, options, cx, cy, at, width = 380 }) => {
  const f = useCurrentFrame();
  const headP = prog(f, at - 10, at, E.spring);
  const openP = prog(f, at, at + 16, E.spring);
  return (
    <div style={{ position: 'absolute', left: cx - width / 2, top: cy - 40, width, opacity: headP }}>
      <div style={{ padding: '20px 26px', borderRadius: 18, background: a(C.white, 0.06),
        border: `2px solid ${a('var(--accent)', 0.4)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 26, color: C.white }}>{label}</span>
        <span style={{ color: 'var(--accent)', fontSize: 22, transform: `rotate(${openP * 180}deg)`, display: 'inline-block' }}>▾</span>
      </div>
      <div style={{ overflow: 'hidden', maxHeight: openP * options.length * 62, marginTop: openP > 0 ? 8 : 0 }}>
        {options.map((opt, i) => {
          const itP = Math.min(1, Math.max(0, (openP - i * 0.15) / 0.6));
          return (
            <div key={opt} style={{ padding: '16px 26px', borderRadius: 14, marginBottom: 6,
              background: a(C.white, 0.04), opacity: itP, transform: `translateY(${(1 - itP) * -10}px)`,
              fontFamily: FONT.body, fontSize: 24, color: C.gray }}>{opt}</div>
          );
        })}
      </div>
    </div>
  );
};

// ─── MODALPOPIN — Dialogfenster erscheint mit abgedunkeltem Hintergrund ─────
export const ModalPopIn: React.FC<{
  title: string; body: string; at: number; width?: number;
}> = ({ title, body, at, width = 760 }) => {
  const f = useCurrentFrame();
  const backdropP = prog(f, at, at + 14, E.out);
  const modalP = prog(f, at + 4, at + 22, E.spring);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: a(C.bgDeep, 0.7 * backdropP) }} />
      <div style={{ width, opacity: modalP, transform: `scale(${lerpF(f, 0.9, 1, at + 4, at + 22, E.spring)})`,
        padding: '46px 52px', borderRadius: 26, background: C.bgDeep,
        border: `2px solid ${a('var(--accent)', 0.5)}`, boxShadow: `0 0 60px ${a('var(--accent)', 0.25)}` }}>
        <div style={{ fontFamily: FONT.title, fontSize: 46, color: C.white, marginBottom: 16 }}>{title}</div>
        <div style={{ fontFamily: FONT.body, fontSize: 26, color: C.gray, lineHeight: 1.5 }}>{body}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── TOOLTIPPOP — kleine Hinweis-Blase poppt neben einem Punkt auf ──────────
export const TooltipPop: React.FC<{ text: string; x: number; y: number; at: number }> = ({
  text, x, y, at,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 12, E.spring);
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: p,
      transform: `translateY(${lerpF(f, 10, 0, at, at + 12, E.spring)}px) scale(${p})`, transformOrigin: 'left bottom' }}>
      <div style={{ padding: '12px 20px', borderRadius: 12, background: a(C.bgDeep, 0.95),
        border: `1.5px solid ${a('var(--accent)', 0.5)}`, whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: FONT.body, fontSize: 20, fontWeight: 600, color: 'var(--accent)' }}>{text}</span>
      </div>
    </div>
  );
};

// ─── CURSOR — animierter Mauszeiger bewegt sich zu Punkten und klickt ─────────
// Für "so klickst du"-UI-Erklärmomente. `path` = Wegpunkte mit Ankunfts-Frame,
// optional `clickAt` löst dort einen Klick-Puls aus.
export const Cursor: React.FC<{
  path: { x: number; y: number; at: number; clickAt?: number }[]; size?: number; color?: string;
}> = ({ path, size = 40, color = C.white }) => {
  const f = useCurrentFrame();
  let x = path[0].x, y = path[0].y, clickP = 0;
  for (let i = 0; i < path.length; i++) {
    const cur = path[i], prev = path[i - 1];
    if (prev && f >= prev.at && f <= cur.at) {
      const seg = prog(f, prev.at, cur.at, E.inOut);
      x = lerpF(f, prev.x, cur.x, prev.at, cur.at, E.inOut);
      y = lerpF(f, prev.y, cur.y, prev.at, cur.at, E.inOut);
      void seg;
    } else if (f > cur.at) { x = cur.x; y = cur.y; }
    if (cur.clickAt && f >= cur.clickAt) clickP = Math.max(clickP, 1 - prog(f, cur.clickAt, cur.clickAt + 16, E.out));
  }
  const enterP = prog(f, 0, 12, E.spring);
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: enterP, zIndex: 50, pointerEvents: 'none' }}>
      {clickP > 0 && <div style={{ position: 'absolute', left: -20 + size / 2, top: -20 + size / 2, width: 40, height: 40,
        borderRadius: '50%', border: `2.5px solid ${color}`, opacity: clickP, transform: `scale(${1.6 - clickP * 0.6})` }} />}
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `scale(${1 - clickP * 0.15})`,
        filter: `drop-shadow(0 2px 6px rgba(0,0,0,0.5))` }}>
        <path d="M4 2l16 8-6.5 1.5L11 18z" fill={color} stroke={C.bgDeep} strokeWidth={1} />
      </svg>
    </div>
  );
};

// ─── SHAKE — kurzes Kamera-/Element-Zittern für Impact-Momente ───────────────
// Um ein Element oder AbsoluteFill legen. `at` = Zeitpunkt des Einschlags.
export const Shake: React.FC<{
  children: React.ReactNode; at: number; strength?: number; durFrames?: number; style?: React.CSSProperties;
}> = ({ children, at, strength = 14, durFrames = 18, style }) => {
  const f = useCurrentFrame();
  const decay = f >= at && f <= at + durFrames ? 1 - (f - at) / durFrames : 0;
  const dx = decay ? Math.sin((f - at) * 3.1) * strength * decay : 0;
  const dy = decay ? Math.cos((f - at) * 2.3) * strength * 0.6 * decay : 0;
  const rot = decay ? Math.sin((f - at) * 2.7) * 1.5 * decay : 0;
  return (
    <div style={{ width: '100%', height: '100%', transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, ...style }}>
      {children}
    </div>
  );
};
