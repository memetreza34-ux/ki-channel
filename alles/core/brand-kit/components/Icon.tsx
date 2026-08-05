import React from 'react';
import { C } from '../tokens';

// ════════════════════════════════════════════════════════════════════════════
//  FLAT VECTOR ICONS (FinanzNeo-Stil) — kuratiertes Set, kein externes Paket.
//  Erweiterbar: neues Icon = neuer Eintrag in PATHS.
//  Stroke-basiert, übernimmt die Akzentfarbe, optional Glow.
// ════════════════════════════════════════════════════════════════════════════

const PATHS: Record<string, React.ReactNode> = {
  euro: <><path d="M17 6.5A6.5 6.5 0 1 0 17 17.5" /><path d="M4 10h9M4 14h9" /></>,
  'chart-up': <><path d="M3 17l5-5 4 4 8-8" /><path d="M15 8h5v5" /></>,
  'chart-bar': <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  hourglass: <><path d="M6 3h12M6 21h12" /><path d="M7 3c0 4 5 5 5 9s-5 5-5 9M17 3c0 4-5 5-5 9s5 5 5 9" /></>,
  shield: <><path d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></>,
  cross: <><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></>,
  coins: <><circle cx="9" cy="9" r="5" /><path d="M15.5 5.3A5 5 0 1 1 15.5 18.7" /></>,
  bank: <><path d="M3 9l9-5 9 5M4 9v9M9 9v9M15 9v9M20 9v9M2 21h20" /></>,
  rocket: <><path d="M5 15c-1 1-2 5-2 5s4-1 5-2M9 11a8 8 0 0 1 8-8c2 0 3 1 3 3a8 8 0 0 1-8 8z" /><circle cx="14.5" cy="9.5" r="1.4" /><path d="M9 11l-2 2 3 3 2-2" /></>,
  wallet: <><path d="M3 7h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12" /><circle cx="16" cy="13" r="1.3" /></>,
  percent: <><circle cx="7" cy="7" r="2.5" /><circle cx="17" cy="17" r="2.5" /><path d="M19 5L5 19" /></>,
  flame: <><path d="M12 3c3 4 6 6 6 10a6 6 0 0 1-12 0c0-2 1-3 2-4 .5 1.5 1.5 2 2 2-1-3 0-6 2-8z" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" /></>,
  bulb: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10c.8.8 1 1.5 1 3h6c0-1.5.2-2.2 1-3a6 6 0 0 0-4-10z" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  trending: <><path d="M3 12l4 4 5-7 4 3 5-8" /></>,
  calendar: <><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M4 9h16M8 3v4M16 3v4" /></>,
  phone: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
  arrowRight: <><path d="M4 12h16M14 6l6 6-6 6" /></>,
};

export type IconName = keyof typeof PATHS;

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  stroke?: number;
  glow?: boolean;
  style?: React.CSSProperties;
}> = ({ name, size = 64, color = 'var(--accent)', stroke = 2, glow = true, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    style={{ filter: glow ? `drop-shadow(0 0 ${size * 0.12}px ${color}99)` : undefined, ...style }}>
    {PATHS[name]}
  </svg>
);
