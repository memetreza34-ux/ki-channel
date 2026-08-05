import React from 'react';
import * as Flags from 'country-flag-icons/react/3x2';
import { a } from '../tokens';

// ════════════════════════════════════════════════════════════════════════════
//  <Flag country="DE"> — Länderflaggen (SVG, `country-flag-icons`), für internationale
//  Markt-/Währungs-Szenen (Lucide deckt das nicht ab). ISO-3166-1-alpha-2-Code, GROSS
//  ("DE", "US", "JP", "GB" ...). Gerahmt wie ein Premium-Icon (Border+Glow), passend
//  zum restlichen Bausteinkasten — kein rohes Flaggen-Rechteck.
// ════════════════════════════════════════════════════════════════════════════
const REGISTRY = Flags as unknown as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>;

export function resolveFlag(country: string): React.ComponentType<React.SVGProps<SVGSVGElement>> | null {
  return REGISTRY[country.trim().toUpperCase()] ?? null;
}

export const Flag: React.FC<{
  country: string;               // ISO-3166-1-alpha-2, z.B. "DE", "US", "JP"
  size?: number;                 // Breite (3:2-Seitenverhältnis)
  rounded?: boolean;             // abgerundete Ecken statt scharfer Kante
  bordered?: boolean;            // dezenter Rahmen + Glow (Premium-Rahmung, Default an)
  glowColor?: string;
  style?: React.CSSProperties;
}> = ({ country, size = 96, rounded = true, bordered = true, glowColor = 'var(--accent)', style }) => {
  const Cmp = resolveFlag(country);
  if (!Cmp) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`<Flag>: unbekannter Ländercode "${country}" — ISO-3166-1-alpha-2 erwartet (z.B. "DE")`);
    }
    return null;
  }
  const height = size * (2 / 3);
  return (
    <div style={{
      width: size, height, borderRadius: rounded ? size * 0.08 : 0, overflow: 'hidden',
      border: bordered ? `2px solid ${a(glowColor, 0.5)}` : undefined,
      boxShadow: bordered ? `0 0 ${size * 0.18}px ${a(glowColor, 0.35)}` : undefined,
      ...style,
    }}>
      <Cmp style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
