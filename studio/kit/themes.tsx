import React, {createContext, useContext} from 'react';

/**
 * Designs: dieselben Bausteine, anderer Look. Ein Projekt wählt ein Design mit
 * <ThemeProvider theme="nacht">; alle Kit-Bausteine lesen Farben, Schriften,
 * Rundungen und Schatten von hier.
 */

type Palette = {
  bg: string;
  surface: string;
  ink: string;
  inkSoft: string;
  inkFaint: string;
  line: string;
  accent: string;
  accentDeep: string;
  accentTint: string;
  /** Schriftfarbe auf `accentDeep`. */
  onAccent: string;
  good: string;
  goodTint: string;
  bad: string;
  badTint: string;
  warn: string;
  warnTint: string;
  info: string;
  infoTint: string;
  dark: string;
  darkSoft: string;
  darkLine: string;
};

export type Theme = {
  name: ThemeName;
  label: string;
  /** Dunkles Design (helle Schrift auf dunklem Grund). */
  isDark: boolean;
  c: Palette;
  font: {
    body: string;
    heading: string;
    headingWeight: number;
    headingTracking: string;
    headingCase: 'none' | 'uppercase';
    display: string;
    displayWeight: number;
    displayCase: 'none' | 'uppercase';
    mono: string;
  };
  /** Rundungs-Faktor: 1 = Standard, 0.2 = eckig, 1.5 = sehr rund. */
  radius: number;
  shadow: {soft: string; lift: string};
  /** Rahmen für Karten/Kacheln (z. B. dicker schwarzer Rand im Pop-Design). */
  border: string | null;
  background: {kind: 'blobs' | 'glow' | 'halftone' | 'grid' | 'paper'; blobs: [string, string, string]; pattern: string};
  /** Hintergrund der Endkarte. */
  accentBackground: string;
  /** Pastelltöne für Gruppen (Tokens, Kategorien) und ihre Schriftfarben. */
  pastels: string[];
  pastelInk: string[];
};

const INTER = 'Inter, system-ui, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

const editorial: Theme = {
  name: 'editorial',
  isDark: false,
  label: 'Editorial (Marke)',
  c: {
    bg: '#F7F5FB',
    surface: '#FFFFFF',
    ink: '#16131F',
    inkSoft: '#5E5870',
    inkFaint: '#9C95AB',
    line: '#E6E0F0',
    accent: '#B98CFF',
    accentDeep: '#6E45C9',
    accentTint: '#EFE6FF',
    onAccent: '#FFFFFF',
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
  },
  font: {
    body: INTER,
    heading: INTER,
    headingWeight: 800,
    headingTracking: '-0.035em',
    headingCase: 'none',
    display: '"Bebas Neue", Inter, sans-serif',
    displayWeight: 400,
    displayCase: 'uppercase',
    mono: MONO,
  },
  radius: 1,
  shadow: {
    soft: '0 10px 30px rgba(40, 24, 80, 0.08), 0 2px 6px rgba(40, 24, 80, 0.06)',
    lift: '0 24px 60px rgba(40, 24, 80, 0.14), 0 6px 16px rgba(40, 24, 80, 0.08)',
  },
  border: null,
  background: {kind: 'blobs', blobs: ['#E9DCFF', '#DCEBFF', '#F6E3F4'], pattern: 'rgba(110,69,201,0.13)'},
  accentBackground: '#EEE5FF',
  pastels: ['#EFE6FF', '#DDF4EA', '#FDF0DA', '#E1ECFE', '#FCE3E7', '#E9F7F9'],
  pastelInk: ['#6E45C9', '#1F7A55', '#A8650F', '#2A5FBF', '#B8324A', '#1D7D8A'],
};

const nacht: Theme = {
  name: 'nacht',
  isDark: true,
  label: 'Nacht (dunkel, Tech)',
  c: {
    bg: '#0D0B14',
    surface: '#1A1726',
    ink: '#F4F1FA',
    inkSoft: '#B4ACC8',
    inkFaint: '#7D7591',
    line: '#2E2842',
    accent: '#A98BFF',
    accentDeep: '#7C5CFF',
    accentTint: '#251E40',
    onAccent: '#FFFFFF',
    good: '#3DDC97',
    goodTint: '#123528',
    bad: '#FF5C7A',
    badTint: '#3A1622',
    warn: '#FFB547',
    warnTint: '#3A2A10',
    info: '#4CC9F0',
    infoTint: '#0F2E3A',
    dark: '#07060B',
    darkSoft: '#141120',
    darkLine: '#2E2842',
  },
  font: {
    body: '"Space Grotesk", Inter, sans-serif',
    heading: '"Space Grotesk", Inter, sans-serif',
    headingWeight: 700,
    headingTracking: '-0.03em',
    headingCase: 'none',
    display: '"Space Grotesk", Inter, sans-serif',
    displayWeight: 700,
    displayCase: 'uppercase',
    mono: MONO,
  },
  radius: 0.8,
  shadow: {
    soft: '0 0 0 1px rgba(169,139,255,0.18), 0 12px 30px rgba(0,0,0,0.45)',
    lift: '0 0 0 1px rgba(169,139,255,0.25), 0 0 40px rgba(124,92,255,0.25), 0 24px 60px rgba(0,0,0,0.55)',
  },
  border: null,
  background: {kind: 'glow', blobs: ['#3B2470', '#123A5C', '#40204A'], pattern: 'rgba(169,139,255,0.10)'},
  accentBackground: '#151026',
  pastels: ['#251E40', '#123528', '#3A2A10', '#0F2E3A', '#3A1622', '#16323A'],
  pastelInk: ['#C6B3FF', '#7BEFB8', '#FFCF85', '#8ADCF5', '#FF9DB0', '#7FE3E8'],
};

const pop: Theme = {
  name: 'pop',
  isDark: false,
  label: 'Pop (laut, Werbung)',
  c: {
    bg: '#FFF3D1',
    surface: '#FFFFFF',
    ink: '#111111',
    inkSoft: '#3D3D3D',
    inkFaint: '#7A7466',
    line: '#111111',
    accent: '#FFD23F',
    accentDeep: '#FF4D2E',
    accentTint: '#FFE38A',
    onAccent: '#FFFFFF',
    good: '#00A86B',
    goodTint: '#B8F2D6',
    bad: '#E8202A',
    badTint: '#FFC9C2',
    warn: '#FF9F1C',
    warnTint: '#FFE0AE',
    info: '#2D6BFF',
    infoTint: '#C9DAFF',
    dark: '#111111',
    darkSoft: '#262626',
    darkLine: '#3D3D3D',
  },
  font: {
    body: INTER,
    heading: '"Archivo Black", Inter, sans-serif',
    headingWeight: 400,
    headingTracking: '-0.02em',
    headingCase: 'none',
    display: '"Archivo Black", Inter, sans-serif',
    displayWeight: 400,
    displayCase: 'uppercase',
    mono: MONO,
  },
  radius: 0.55,
  shadow: {soft: '6px 6px 0 #111111', lift: '10px 10px 0 #111111'},
  border: '4px solid #111111',
  background: {kind: 'halftone', blobs: ['#FFE38A', '#FFC9C2', '#C9DAFF'], pattern: 'rgba(17,17,17,0.10)'},
  accentBackground: '#FFD23F',
  pastels: ['#FFE38A', '#B8F2D6', '#FFC9C2', '#C9DAFF', '#FFD8F0', '#D9F99D'],
  pastelInk: ['#111111', '#111111', '#111111', '#111111', '#111111', '#111111'],
};

const pastell: Theme = {
  name: 'pastell',
  isDark: false,
  label: 'Pastell (freundlich, rund)',
  c: {
    bg: '#FFF8F2',
    surface: '#FFFFFF',
    ink: '#2B2340',
    inkSoft: '#6B6385',
    inkFaint: '#A59FB8',
    line: '#F0E6EE',
    accent: '#FFB3CF',
    accentDeep: '#F0548C',
    accentTint: '#FFE6EF',
    onAccent: '#FFFFFF',
    good: '#21B58A',
    goodTint: '#D7F7EC',
    bad: '#F2626B',
    badTint: '#FFE1E3',
    warn: '#F5A524',
    warnTint: '#FFF0D6',
    info: '#5B8DEF',
    infoTint: '#E3ECFF',
    dark: '#2B2340',
    darkSoft: '#3A3156',
    darkLine: '#51476F',
  },
  font: {
    body: 'Nunito, Inter, sans-serif',
    heading: 'Nunito, Inter, sans-serif',
    headingWeight: 900,
    headingTracking: '-0.02em',
    headingCase: 'none',
    display: 'Nunito, Inter, sans-serif',
    displayWeight: 900,
    displayCase: 'none',
    mono: MONO,
  },
  radius: 1.5,
  shadow: {
    soft: '0 12px 30px rgba(240, 84, 140, 0.10), 0 2px 6px rgba(43, 35, 64, 0.05)',
    lift: '0 24px 60px rgba(240, 84, 140, 0.16), 0 6px 16px rgba(43, 35, 64, 0.06)',
  },
  border: null,
  background: {kind: 'blobs', blobs: ['#FFE0EC', '#DDF3FF', '#E8FFE9'], pattern: 'rgba(240,84,140,0.12)'},
  accentBackground: '#FFE6EF',
  pastels: ['#FFE6EF', '#D7F7EC', '#FFF0D6', '#E3ECFF', '#F1E6FF', '#E0F7FA'],
  pastelInk: ['#C23A6E', '#14825F', '#A86A0A', '#3A63B8', '#7A4FC0', '#1D7D8A'],
};

const minimal: Theme = {
  name: 'minimal',
  isDark: false,
  label: 'Minimal (schwarz-weiß, rot)',
  c: {
    bg: '#FFFFFF',
    surface: '#FFFFFF',
    ink: '#0A0A0A',
    inkSoft: '#555555',
    inkFaint: '#999999',
    line: '#E6E6E6',
    accent: '#FF8A80',
    accentDeep: '#E63B2E',
    accentTint: '#FDECEA',
    onAccent: '#FFFFFF',
    good: '#0A0A0A',
    goodTint: '#F0F0F0',
    bad: '#E63B2E',
    badTint: '#FDECEA',
    warn: '#0A0A0A',
    warnTint: '#F0F0F0',
    info: '#0A0A0A',
    infoTint: '#F0F0F0',
    dark: '#0A0A0A',
    darkSoft: '#1C1C1C',
    darkLine: '#333333',
  },
  font: {
    body: INTER,
    heading: INTER,
    headingWeight: 900,
    headingTracking: '-0.05em',
    headingCase: 'none',
    display: INTER,
    displayWeight: 900,
    displayCase: 'none',
    mono: MONO,
  },
  radius: 0.2,
  shadow: {soft: '0 1px 0 #E6E6E6', lift: '0 2px 0 #E6E6E6, 0 20px 40px rgba(0,0,0,0.06)'},
  border: '2px solid #0A0A0A',
  background: {kind: 'grid', blobs: ['#FFFFFF', '#FFFFFF', '#FFFFFF'], pattern: 'rgba(10,10,10,0.06)'},
  accentBackground: '#FFFFFF',
  pastels: ['#F0F0F0', '#FDECEA', '#F0F0F0', '#FDECEA', '#F0F0F0', '#FDECEA'],
  pastelInk: ['#0A0A0A', '#E63B2E', '#0A0A0A', '#E63B2E', '#0A0A0A', '#E63B2E'],
};

const papier: Theme = {
  name: 'papier',
  isDark: false,
  label: 'Papier (Notizbuch, handschriftlich)',
  c: {
    bg: '#F5EFE3',
    surface: '#FFFCF5',
    ink: '#2A241C',
    inkSoft: '#6B6152',
    inkFaint: '#A3988A',
    line: '#E2D7C3',
    accent: '#FFD84D',
    accentDeep: '#1E5BC6',
    accentTint: '#FFF1B8',
    onAccent: '#FFFFFF',
    good: '#2E8B57',
    goodTint: '#DDEFD9',
    bad: '#C8402F',
    badTint: '#F6DCD5',
    warn: '#D08A1E',
    warnTint: '#F8E8C8',
    info: '#1E5BC6',
    infoTint: '#DCE6F8',
    dark: '#2A241C',
    darkSoft: '#3B342A',
    darkLine: '#5A5042',
  },
  font: {
    body: INTER,
    heading: 'Fraunces, Georgia, serif',
    headingWeight: 800,
    headingTracking: '-0.02em',
    headingCase: 'none',
    display: 'Caveat, "Comic Sans MS", cursive',
    displayWeight: 700,
    displayCase: 'none',
    mono: MONO,
  },
  radius: 0.7,
  shadow: {soft: '0 2px 0 rgba(42,36,28,0.12), 0 8px 18px rgba(42,36,28,0.08)', lift: '0 3px 0 rgba(42,36,28,0.15), 0 18px 36px rgba(42,36,28,0.12)'},
  border: '2.5px solid #2A241C',
  background: {kind: 'paper', blobs: ['#FFF6DD', '#EFE6D2', '#F8EEDB'], pattern: 'rgba(30,91,198,0.16)'},
  accentBackground: '#FFF1B8',
  pastels: ['#FFF1B8', '#DDEFD9', '#F6DCD5', '#DCE6F8', '#EFE3F6', '#E3F2EF'],
  pastelInk: ['#7A5B00', '#2E6B44', '#9A3326', '#1E4FA8', '#6B3D8A', '#24706A'],
};

export const THEMES = {editorial, nacht, pop, pastell, minimal, papier} as const;
export type ThemeName = keyof typeof THEMES;
export const THEME_NAMES = Object.keys(THEMES) as ThemeName[];

const ThemeContext = createContext<Theme>(editorial);

export const ThemeProvider: React.FC<{theme: ThemeName | Theme; children: React.ReactNode}> = ({theme, children}) => (
  <ThemeContext.Provider value={typeof theme === 'string' ? THEMES[theme] : theme}>{children}</ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);

/** Rundung im aktuellen Design (Basiswert in px × Rundungs-Faktor). */
export const useRadius = () => {
  const t = useTheme();
  return (px: number) => px * t.radius;
};
