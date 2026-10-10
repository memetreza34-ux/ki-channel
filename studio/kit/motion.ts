import {Easing, interpolate, spring, type SpringConfig} from 'remotion';

/**
 * Kurven nach Bewegungsbedeutung. Lineare Zeitachsen nur für Endlos-Schleifen.
 */
export const EASE = {
  /** Standard-Eintritt: schneller Antritt, langer weicher Auslauf. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Ruhiger Eintritt für Text und kleine Marken. */
  soft: Easing.bezier(0.2, 0, 0, 1),
  /** Bewegung auf der Bühne (A nach B, Kamera). */
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  /** Austritt: sanft los, schnell weg. */
  in: Easing.bezier(0.5, 0, 0.75, 0),
} as const;

export type EaseName = keyof typeof EASE;

/**
 * Federn. `smooth` hat keinen Überschwinger, `snappy` einen kaum sichtbaren,
 * `bouncy` nur für bewusst verspielte Momente (Werbung, Belohnung).
 */
export const SPRING = {
  smooth: {damping: 200, mass: 0.8},
  snappy: {damping: 16, stiffness: 170, mass: 0.6},
  bouncy: {damping: 10, stiffness: 140, mass: 0.7},
  heavy: {damping: 24, stiffness: 80, mass: 1.4},
} satisfies Record<string, Partial<SpringConfig>>;

export type SpringName = keyof typeof SPRING;

/** 0 → 1 zwischen `start` und `start + duration`, geclampt und mit Kurve. */
export const progress = (frame: number, start: number, duration: number, ease: EaseName = 'out') =>
  interpolate(frame, [start, start + Math.max(1, duration)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE[ease],
  });

/** Feder ab `delay`, Ergebnis ungefähr 0 → 1 (bei `bouncy` kurz darüber). */
export const pop = (frame: number, fps: number, delay = 0, preset: SpringName = 'snappy') =>
  spring({frame: frame - delay, fps, config: SPRING[preset]});

/** Eintritt mal (1 − Austritt): für Elemente, die wieder verschwinden. */
export const visible = (frame: number, enterAt: number, exitAt: number, enterDur = 14, exitDur = 10) =>
  progress(frame, enterAt, enterDur, 'out') * (1 - progress(frame, exitAt, exitDur, 'in'));

export const mix = (from: number, to: number, t: number) => from + (to - from) * t;

/** Startversatz für das i-te Element einer Gruppe. */
export const stagger = (index: number, step = 4) => index * step;

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
