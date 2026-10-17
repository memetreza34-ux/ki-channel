import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, mix, progress} from './motion';
import {useTheme} from './themes';

/**
 * Atmosphäre und Effekte. Endlos-Bewegungen laufen hier bewusst gleichmäßig
 * (linear) – das ist bei Schleifen (Partikel, Strahlen, Raster) richtig.
 */

type LightRaysProps = {
  /** Ursprung der Strahlen in %, z. B. "50%" / "30%". */
  x?: string;
  y?: string;
  rays?: number;
  color?: string;
  /** Deckkraft im eingeblendeten Zustand. */
  opacity?: number;
  delay?: number;
  /** Grad pro Frame. */
  speed?: number;
};

/** Lichtstrahlen aus einem Punkt – für Enthüllungen, Hooks, "das Ergebnis". */
export const LightRays: React.FC<LightRaysProps> = ({x = '50%', y = '35%', rays = 14, color, opacity, delay = 0, speed = 0.12}) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const c = color ?? t.c.accent;
  const op = opacity ?? (t.isDark ? 0.45 : 0.35);
  const appear = progress(frame, delay, 24, 'out');
  const period = 360 / rays;
  const angle = (frame - delay) * speed;
  const mask = `radial-gradient(circle at ${x} ${y}, black 0%, rgba(0,0,0,0.6) 25%, transparent 70%)`;
  return (
    <AbsoluteFill
      style={{
        background: `repeating-conic-gradient(from ${angle}deg at ${x} ${y}, ${c} 0deg ${period * 0.18}deg, transparent ${period * 0.42}deg ${period}deg)`,
        maskImage: mask,
        WebkitMaskImage: mask,
        opacity: op * appear,
        pointerEvents: 'none',
      }}
    />
  );
};

type ParticlesProps = {count?: number; color?: string; size?: number; speed?: number; seed?: string; opacity?: number};

/** Schwebende Lichtpunkte über die ganze Fläche (Hintergrund-Atmosphäre). */
export const Particles: React.FC<ParticlesProps> = ({count = 40, color, size = 6, speed = 1, seed = 'p', opacity = 0.7}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const t = useTheme();
  const c = color ?? t.c.accent;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: count}, (_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const s = size * (0.4 + r('s') * 0.9);
        const travel = height + 100;
        const y = height + 50 - ((r('y') * travel + frame * speed * (0.6 + r('v') * 1.2)) % travel);
        const x = r('x') * width + Math.sin(frame / (40 + r('w') * 40) + r('p') * 6) * 30;
        const twinkle = 0.5 + 0.5 * Math.sin(frame / (12 + r('t') * 20) + r('o') * 6);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: '50%',
              background: c,
              opacity: opacity * (0.35 + twinkle * 0.65),
              boxShadow: t.isDark ? `0 0 ${s * 2}px ${c}` : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

type MeteorsProps = {count?: number; angle?: number; color?: string; seed?: string; loop?: number};

/** Diagonale Sternschnuppen – wirkt am besten in dunklen Designs. */
export const Meteors: React.FC<MeteorsProps> = ({count = 10, angle = 215, color, seed = 'm', loop = 90}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const t = useTheme();
  const c = color ?? (t.isDark ? '#FFFFFF' : t.c.accentDeep);
  const rad = (angle * Math.PI) / 180;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {Array.from({length: count}, (_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const offset = Math.floor(r('o') * loop);
        const p = ((frame + offset) % loop) / loop;
        const dist = Math.hypot(width, height) * 0.8;
        const x0 = r('x') * width * 1.2;
        const y0 = -100 + r('y') * height * 0.3;
        const x = x0 + Math.cos(rad) * dist * p;
        const y = y0 - Math.sin(rad) * dist * p;
        const len = 180 + r('l') * 160;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: len,
              height: 3,
              transformOrigin: '0 50%',
              transform: `rotate(${-angle}deg)`,
              background: `linear-gradient(90deg, ${c}, ${c}00)`,
              opacity: Math.sin(p * Math.PI) * 0.9,
              borderRadius: 3,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

type PerspectiveGridProps = {color?: string; cell?: number; tilt?: number; speed?: number; horizon?: number};

/** Perspektivischer Boden, der auf den Betrachter zuläuft (Tech-Bühne). */
export const PerspectiveGrid: React.FC<PerspectiveGridProps> = ({color, cell = 90, tilt = 64, speed = 1.2, horizon = 0.45}) => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();
  const t = useTheme();
  const c = color ?? (t.isDark ? 'rgba(169,139,255,0.45)' : `${t.c.accentDeep}55`);
  const mask = 'linear-gradient(to bottom, transparent 0%, black 35%)';
  return (
    <AbsoluteFill style={{perspective: 700, perspectiveOrigin: `50% ${horizon * 100}%`, overflow: 'hidden', pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: '-50%',
          right: '-50%',
          top: height * horizon,
          height: height * 2,
          transformOrigin: '50% 0%',
          transform: `rotateX(${tilt}deg)`,
          backgroundImage: `linear-gradient(${c} 2px, transparent 2px), linear-gradient(90deg, ${c} 2px, transparent 2px)`,
          backgroundSize: `${cell}px ${cell}px`,
          backgroundPosition: `0px ${(frame * speed) % cell}px`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
    </AbsoluteFill>
  );
};

type ConfettiProps = {
  /** Frame des Knalls. */
  at?: number;
  /** Ursprung in px; Standard: Bildmitte, etwas oberhalb. */
  x?: number;
  y?: number;
  count?: number;
  seed?: string;
  /** Wie weit die Teile fliegen (1 = normal). */
  power?: number;
};

/** Konfetti-Explosion – für Ergebnis, Erfolg, Endkarte. */
export const Confetti: React.FC<ConfettiProps> = ({at = 0, x, y, count = 70, seed = 'c', power = 1}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const t = useTheme();
  const local = frame - at;
  if (local < 0) return null;
  const sec = local / fps;
  const colors = [t.c.accentDeep, t.c.accent, t.c.good, t.c.warn, t.c.info, t.c.bad];
  const ox = x ?? width / 2;
  const oy = y ?? height * 0.42;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: count}, (_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const ang = -Math.PI / 2 + (r('a') - 0.5) * Math.PI * 1.4;
        const v = (900 + r('v') * 1300) * power;
        const drag = Math.exp(-sec * 1.6);
        const px = ox + Math.cos(ang) * v * (1 - drag) / 1.6;
        const py = oy + Math.sin(ang) * v * (1 - drag) / 1.6 + 900 * sec * sec * 0.5;
        const rot = r('r') * 360 + local * (8 + r('s') * 14);
        const w = 14 + r('w') * 14;
        const fade = 1 - clamp01((sec - 1.4) / 0.8);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: w,
              height: w * (r('h') > 0.5 ? 0.45 : 1),
              borderRadius: r('h') > 0.8 ? '50%' : 3,
              background: colors[i % colors.length],
              transform: `rotate(${rot}deg) scaleX(${Math.cos(local / (4 + r('f') * 4))})`,
              opacity: fade,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

type RippleProps = {
  children?: React.ReactNode;
  size?: number;
  rings?: number;
  color?: string;
  /** Frames pro Welle. */
  loop?: number;
  delay?: number;
};

/** Wellenringe um ein Element – "KI denkt", "Signal", "live". */
export const Ripple: React.FC<RippleProps> = ({children, size = 220, rings = 3, color, loop = 54, delay = 0}) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const c = color ?? t.c.accent;
  const appear = progress(frame, delay, 12, 'out');
  return (
    <div style={{position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {Array.from({length: rings}, (_, i) => {
        const p = ((((frame - delay) / loop + i / rings) % 1) + 1) % 1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: `${Math.max(2, size * 0.02)}px solid ${c}`,
              transform: `scale(${mix(0.55, 1.6, p)})`,
              opacity: (1 - p) * appear * 0.9,
            }}
          />
        );
      })}
      <div style={{position: 'relative', opacity: appear}}>{children}</div>
    </div>
  );
};
