import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {E, Lucide, prog} from '@studio/core';
import {BRAND} from '../../../brand/brand';

/**
 * Szene 1 — die Icon-Familie.
 *
 * Zeigt, dass eine einzige Quelle reicht: alle Zeichen hier kommen aus Lucide
 * ueber `<Lucide>` aus `@studio/core`. Gleiche Strichstaerke, gleiche
 * Rundungen, gleiche Optik — genau das, was selbstgemalte SVGs nicht halten.
 */

const ICONS = [
  'bot', 'brain', 'cpu', 'workflow', 'repeat', 'git-branch',
  'search', 'folder-open', 'file-text', 'terminal', 'database', 'globe',
  'target', 'list-checks', 'square-check-big', 'shield-check', 'lock', 'ban',
  'triangle-alert', 'eye', 'mouse-pointer-click', 'wrench', 'settings-2', 'sparkles',
];

export const SzeneIcons: React.FC = () => {
  const f = useCurrentFrame();
  const titel = prog(f, 4, 26, E.out);

  return (
    <AbsoluteFill style={{
      background: '#FFFFFF',
      fontFamily: BRAND.font.body,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 54,
    }}>
      <div style={{
        fontWeight: 900, fontSize: 62, color: BRAND.accentDk, letterSpacing: -1.6,
        opacity: titel,
        translate: `0px ${(1 - titel) * 22}px`,
      }}>
        Eine Icon-Familie
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 150px)', gap: 30,
      }}>
        {ICONS.map((name, i) => {
          const at = 16 + i * 3.4;
          const p = prog(f, at, at + 22, E.spring);
          // Jedes Icon atmet in eigener Phase — das Raster steht nie still.
          const atem = Math.sin((f / 92) * Math.PI * 2 + i * 0.7) * 0.045;
          return (
            <div key={name} style={{
              width: 150, height: 150, borderRadius: 26,
              background: '#FBFAFD', border: '1px solid rgba(26,26,46,.08)',
              display: 'grid', placeItems: 'center',
              opacity: p,
              scale: (0.6 + p * 0.4) * (1 + atem),
              boxShadow: '0 16px 34px rgba(26,26,46,.06)',
            }}>
              <Lucide name={name} size={62} color={BRAND.accentDk} stroke={1.9} glow={false} />
            </div>
          );
        })}
      </div>

      <div style={{
        fontWeight: 700, fontSize: 27, color: '#8D8197',
        opacity: prog(f, 118, 142, E.out),
      }}>
        3.474 Stück — alle im selben Strich
      </div>
    </AbsoluteFill>
  );
};
