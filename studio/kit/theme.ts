/**
 * Markenbasis: heller editorialer Look, dunkle Schrift, Lila als Akzent.
 * Jede Farbe hat eine kräftige Variante und eine helle Fläche ("Tint").
 */
export const COLORS = {
  bg: '#F7F5FB',
  surface: '#FFFFFF',
  ink: '#16131F',
  inkSoft: '#5E5870',
  inkFaint: '#9C95AB',
  line: '#E6E0F0',

  accent: '#B98CFF',
  accentDeep: '#6E45C9',
  accentTint: '#EFE6FF',

  good: '#1F9D6B',
  goodTint: '#DDF4EA',
  bad: '#E0485F',
  badTint: '#FCE3E7',
  warn: '#E8962A',
  warnTint: '#FDF0DA',
  info: '#3B7BEA',
  infoTint: '#E1ECFE',

  dark: '#15121D',
  darkSoft: '#241F30',
  darkLine: '#3A3448',
} as const;

export type ColorName = keyof typeof COLORS;

/** Pastelltöne für Gruppen (Tokens, Kategorien) in fester Reihenfolge. */
export const PASTELS = ['#EFE6FF', '#DDF4EA', '#FDF0DA', '#E1ECFE', '#FCE3E7', '#E9F7F9'] as const;
export const PASTEL_INK = ['#6E45C9', '#1F7A55', '#A8650F', '#2A5FBF', '#B8324A', '#1D7D8A'] as const;

export const FPS = 30;

export const FORMATS = {
  /** Reels, Shorts, TikTok */
  vertical: {width: 1080, height: 1920},
  /** YouTube */
  landscape: {width: 1920, height: 1080},
  square: {width: 1080, height: 1080},
  /** Feed-Werbung Instagram/Facebook */
  portrait: {width: 1080, height: 1350},
} as const;

export type FormatName = keyof typeof FORMATS;

/**
 * Sichere Zonen: Plattform-UI (Buttons rechts, Beschreibung unten) verdeckt
 * diese Ränder. Wichtige Inhalte bleiben innerhalb.
 */
export const SAFE = {
  vertical: {top: 200, bottom: 420, side: 80, captionBottom: 300},
  landscape: {top: 80, bottom: 120, side: 120, captionBottom: 90},
  square: {top: 80, bottom: 120, side: 80, captionBottom: 90},
  portrait: {top: 100, bottom: 160, side: 80, captionBottom: 110},
} as const;

export const FONT = {
  sans: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;

export const RADIUS = {sm: 14, md: 24, lg: 36, xl: 56} as const;

export const SHADOW = {
  soft: '0 10px 30px rgba(40, 24, 80, 0.08), 0 2px 6px rgba(40, 24, 80, 0.06)',
  lift: '0 24px 60px rgba(40, 24, 80, 0.14), 0 6px 16px rgba(40, 24, 80, 0.08)',
  glow: (color: string) => `0 0 0 10px ${color}22, 0 18px 50px ${color}55`,
} as const;
