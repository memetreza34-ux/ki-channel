// ════════════════════════════════════════════════════════════════════════════
//  PremiumBackgrounds — Hintergrund-Bausteine, inspiriert von magic-ui/react-bits
//  (siehe core/gehirn/templates/README.md), aber NEU gebaut für Remotion:
//  deterministisch (kein Math.random(), kein rAF/useState), frame-basiert via
//  useCurrentFrame(), themefähig (var(--accent)). Reines Overlay, kein Wrapper —
//  als erstes Kind in eine AbsoluteFill legen.
// ════════════════════════════════════════════════════════════════════════════
import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, random } from 'remotion';
import { a } from '../tokens';
import { useTheme } from '../theme';

// deterministischer Pseudo-Zufall (kein Math.random() — sonst flackert jeder Frame anders)
const seeded = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

// ── ParticleField — schwebende Glow-Partikel (vgl. react-bits „Particles"/magic-ui „particles") ──
export const ParticleField: React.FC<{
  count?: number; color?: string; speed?: number; size?: number; opacity?: number;
}> = ({ count = 40, color = 'var(--accent)', speed = 1, size = 4, opacity = 0.6 }) => {
  const f = useCurrentFrame();
  const particles = useMemo(() => Array.from({ length: count }).map((_, i) => ({
    x: seeded(i) * 100,
    y: seeded(i + 100) * 100,
    driftX: (seeded(i + 200) - 0.5) * 40,
    driftY: (seeded(i + 300) - 0.5) * 60,
    phase: seeded(i + 400) * Math.PI * 2,
    scale: 0.5 + seeded(i + 500) * 1,
  })), [count]);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p, i) => {
        const t = (f * speed) / 90 + p.phase;
        const x = p.x + Math.sin(t) * p.driftX;
        const y = p.y + ((f * speed * 0.15) % 140) - 20 + Math.cos(t * 0.7) * p.driftY * 0.2;
        const twinkle = 0.4 + Math.abs(Math.sin(t * 1.3)) * 0.6;
        return (
          <div key={i} style={{
            position: 'absolute', left: `${x}%`, top: `${((y % 120) + 120) % 120}%`,
            width: size * p.scale, height: size * p.scale, borderRadius: '50%',
            background: color, opacity: opacity * twinkle,
            boxShadow: `0 0 ${size * 2.5 * p.scale}px ${color}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// Aurora-Look bewusst NICHT hier — core/brand-kit/components/Effects.tsx hat bereits `AuroraBG`
// (fließende Farbschleier, gleiche Idee). Dopplung beim KATALOG.md-Check entdeckt, verworfen.

// ── HologramGrid — Scanlines + Raster + leichtes Flackern (Hologramm-Look) ──
export const HologramGrid: React.FC<{
  color?: string; gridOpacity?: number; scanOpacity?: number; flicker?: boolean;
}> = ({ color = 'var(--accent)', gridOpacity = 0.12, scanOpacity = 0.08, flicker = true }) => {
  const f = useCurrentFrame();
  const scanY = (f * 6) % 1920;
  const flickerAmt = flicker ? 0.9 + Math.sin(f * 0.4) * 0.05 + (seeded(Math.floor(f / 7)) > 0.94 ? 0.15 : 0) : 1;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: flickerAmt }}>
      {/* statisches Raster */}
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${a(color, gridOpacity)} 1px, transparent 1px),
          linear-gradient(90deg, ${a(color, gridOpacity)} 1px, transparent 1px)`,
        backgroundSize: '54px 54px',
      }} />
      {/* wandernde Scan-Zeile */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: scanY, height: 3,
        background: `linear-gradient(90deg, transparent, ${a(color, scanOpacity * 4)}, transparent)`,
        boxShadow: `0 0 20px ${a(color, scanOpacity * 3)}`,
      }} />
      {/* horizontale Zeilen (feines CRT-Muster) */}
      <AbsoluteFill style={{
        backgroundImage: `repeating-linear-gradient(0deg, ${a(color, scanOpacity * 0.5)} 0px, transparent 1px, transparent 3px)`,
      }} />
    </AbsoluteFill>
  );
};

// ── BorderBeam — wanderndes Lichtband um eine Karte/Box (vgl. magic-ui „border-beam") ──
// Web-Original nutzt CSS offset-path + rAF. Hier: SVG-Stroke mit frame-getriebenem
// strokeDashoffset — deterministisch, kein DOM-Layout-Zugriff nötig.
export const BorderBeam: React.FC<{
  width: number; height: number; radius?: number; duration?: number; beamLength?: number;
  colorFrom?: string; colorTo?: string; reverse?: boolean;
}> = ({ width, height, radius = 22, duration = 90, beamLength = 90, colorFrom, colorTo, reverse = false }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const from = colorFrom ?? th.accent;
  const to = colorTo ?? th.accentDk ?? th.accent;
  const perimeter = 2 * (width + height) - 8 * radius + 2 * Math.PI * radius;
  const t = ((f % duration) / duration) * perimeter;
  const offset = reverse ? t : -t;
  // Bewusst KEIN React.useId() — dessen IDs enthalten ":" und machen `url(#id)`-Referenzen
  // unzuverlässig. Stattdessen deterministisch aus den Props (stabil über Re-Renders).
  const gradId = `beam-${width}x${height}x${radius}`;
  return (
    <svg width={width} height={height} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <defs>
        <linearGradient id={gradId} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={to} stopOpacity={0} />
          <stop offset="55%" stopColor={from} stopOpacity={1} />
          <stop offset="100%" stopColor={to} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={1} y={1} width={width - 2} height={height - 2} rx={radius} ry={radius}
        fill="none" stroke={`url(#${gradId})`} strokeWidth={2}
        strokeDasharray={`${beamLength} ${perimeter - beamLength}`}
        strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  );
};

// ── RetroGrid — perspektivisches Boden-Raster, zum Horizont scrollend (vgl. magic-ui „retro-grid") ──
// Web-Original ist ein WebGL-Shader (Browser-only, nicht render-sicher). Hier: reines
// CSS-3D-Transform + interpolate über useCurrentFrame(), keine WebGL-Abhängigkeit.
export const RetroGrid: React.FC<{
  cellSize?: number; angle?: number; opacity?: number; color?: string; speed?: number;
}> = ({ cellSize = 60, angle = 62, opacity = 0.5, color, speed = 1 }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const lineColor = color ?? th.accent;
  const offset = (f * speed * 1.4) % cellSize;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', perspective: 400, opacity }}>
      <div style={{
        position: 'absolute', inset: '-50% -100% 0 -100%', transformOrigin: '50% 100%',
        transform: `rotateX(${angle}deg)`,
        backgroundImage:
          `linear-gradient(to right, ${a(lineColor, 0.5)} 1px, transparent 1px),` +
          `linear-gradient(to bottom, ${a(lineColor, 0.5)} 1px, transparent 1px)`,
        backgroundSize: `${cellSize}px ${cellSize}px`,
        backgroundPosition: `0 ${-offset}px`,
      }} />
      {/* Horizont-Fade: NUR oben (fern) ins bg auflösen, unten (nah) bleibt sichtbar */}
      <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${th.bg} 0%, transparent 40%)` }} />
    </AbsoluteFill>
  );
};

// ── Meteors — fallende Kometen-Streifen (vgl. magic-ui „meteors") ──────────────
// Web-Original nutzt Math.random() im useEffect (jeder Render anders). Hier:
// deterministisch via Remotion `random(seed)`, sonst instabil beim Rendern.
// `angle`: 0° = senkrecht nach unten, positiv = Neigung nach links (klassischer Meteor-Look).
export const Meteors: React.FC<{
  count?: number; angle?: number; width?: number; height?: number; loopFrames?: number;
}> = ({ count = 14, angle = 25, width = 1080, height = 1920, loopFrames = 140 }) => {
  const f = useCurrentFrame();
  const rad = (angle * Math.PI) / 180;
  // Fallrichtung: dx negativ (leicht links), dy positiv (nach unten) bei angle>0.
  const dxUnit = -Math.sin(rad), dyUnit = Math.cos(rad);
  const rotationDeg = Math.atan2(dyUnit, dxUnit) * (180 / Math.PI);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {Array.from({ length: count }, (_, i) => {
        const startX = random(`meteor-x${i}`) * width;
        const delay = random(`meteor-d${i}`) * loopFrames;
        const dur = loopFrames * (0.6 + random(`meteor-t${i}`) * 0.5);
        const local = (f + delay) % (loopFrames * 1.4);
        if (local > dur) return null;
        const p = Math.max(0, Math.min(1, local / dur));
        const dist = p * (height * 0.9);
        const x = startX + dxUnit * dist;
        const y = -height * 0.1 + dyUnit * dist;
        const opacity = p < 0.1 ? p * 10 : 1 - Math.max(0, (p - 0.7) / 0.3);
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: 3, height: 3,
            borderRadius: 3, background: '#FFFFFF', opacity: opacity * 0.9,
            boxShadow: '0 0 6px 1px rgba(255,255,255,0.5)',
            transform: `rotate(${rotationDeg}deg)` }}>
            <div style={{ position: 'absolute', top: '50%', right: 3, height: 1, width: 60,
              transform: 'translateY(-50%)',
              background: 'linear-gradient(to left, rgba(255,255,255,0.6), transparent)' }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── MatrixRain — fallende Zeichen-Ströme (vgl. remotion-bits „MatrixRain") ────
// War bereits NATIV Remotion (kein Web→Remotion-Umbau nötig, nur eigenen `useViewportRect`-Hook
// gegen explizite width/height-Props getauscht, passend zum Rest des Studios). Deterministisch
// via Remotion `random(seed)`. Unterscheidet sich von der gelöschten `MatrixDecode` (die löste
// EIN Zielwort auf) — hier läuft ein durchgehender Hintergrund-Regen aus Zeichen-Strömen.
export const MatrixRain: React.FC<{
  width: number; height: number; fontSize?: number; color?: string; speed?: number;
  density?: number; streamLength?: number;
}> = ({ width, height, fontSize = 20, color, speed = 1, density = 0.6, streamLength = 20 }) => {
  const frame = useCurrentFrame();
  const th = useTheme();
  const rainColor = color ?? th.accent;
  const cols = Math.floor(width / fontSize);
  const rows = Math.ceil(height / fontSize);
  const charset = '01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ$+-*/=%#&';

  const streams = useMemo(() => Array.from({ length: cols }, (_, i) => ({
    isVisible: random(`mr-vis${i}`) < density,
    speed: speed * (0.5 + random(`mr-spd${i}`) * 1.5),
    offset: random(`mr-off${i}`) * (height + streamLength * fontSize),
  })), [cols, density, height, speed, streamLength, fontSize]);

  return (
    <AbsoluteFill style={{ overflow: 'hidden', fontFamily: 'monospace', fontSize, lineHeight: 1 }}>
      {streams.map((stream, colIndex) => {
        if (!stream.isVisible) return null;
        const effectiveHeight = height + streamLength * fontSize;
        const speedPx = stream.speed * fontSize;
        const headY = (frame * speedPx + stream.offset) % effectiveHeight;
        const chars = [];
        for (let r = 0; r < rows; r++) {
          const y = r * fontSize;
          const distInChars = (headY - y) / fontSize;
          if (distInChars >= 0 && distInChars < streamLength) {
            const isHead = distInChars < 1;
            const charSeed = `mr-ch${colIndex}-${r}-${Math.floor(frame / 4)}`;
            const char = charset[Math.floor(random(charSeed) * charset.length)];
            chars.push(
              <div key={r} style={{
                position: 'absolute', top: y, left: colIndex * fontSize,
                color: isHead ? '#FFFFFF' : rainColor,
                opacity: isHead ? 1 : 1 - distInChars / streamLength,
                textShadow: isHead ? '0 0 8px #FFFFFF' : undefined,
                fontWeight: isHead ? 700 : 400,
              }}>{char}</div>,
            );
          }
        }
        return <React.Fragment key={colIndex}>{chars}</React.Fragment>;
      })}
    </AbsoluteFill>
  );
};

// ── LightRays — Gottesstrahlen aus einem Punkt (vgl. react-bits „LightRays") ──
// CSS-Conic-Gradient statt WebGL — deterministisch, kein `--gl=angle`-Flag nötig (anders als
// ShaderBG/LightLeak). Für dramatische Reveal-Momente, Held-Beleuchtung von oben/hinten.
export const LightRays: React.FC<{
  originX?: string; originY?: string; color?: string; rayCount?: number; speed?: number; opacity?: number;
}> = ({ originX = '50%', originY = '20%', color, rayCount = 12, speed = 0.4, opacity = 0.35 }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const rayColor = color ?? th.accent;
  const rotate = f * speed;
  const stops: string[] = [];
  for (let i = 0; i < rayCount; i++) {
    const a0 = (i / rayCount) * 360;
    const width = 360 / rayCount / 2.4;
    stops.push(`transparent ${a0}deg`, `${a(rayColor, opacity)} ${a0 + width * 0.3}deg`,
      `transparent ${a0 + width}deg`, `transparent ${(i + 1) / rayCount * 360}deg`);
  }
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', left: originX, top: originY, width: '250%', height: '250%',
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        background: `conic-gradient(from 0deg, ${stops.join(', ')})`,
        mixBlendMode: 'screen',
      }} />
    </AbsoluteFill>
  );
};
