import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from 'remotion';
import { a } from '../tokens';
import { useTheme } from '../theme';

// ─── Tech: Terminal mit Tipp-Effekt + Cursor ─────────────────────────────────
export const Terminal: React.FC<{
  lines: string[]; at?: number; cps?: number; title?: string; width?: number; fontSize?: number;
}> = ({ lines, at = 0, cps = 28, title = 'zsh', width = 820, fontSize = 26 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const th = useTheme();
  const elapsed = Math.max(0, (f - at) / fps);
  let budget = elapsed * cps; // Zeichen, die bis jetzt getippt sind
  return (
    <div style={{ width, borderRadius: 16, overflow: 'hidden', background: a('#06090D', 0.92),
      border: `1px solid ${a(th.accent, 0.28)}`, boxShadow: `0 0 50px ${a(th.accent, 0.16)}` }}>
      <div style={{ padding: '10px 14px', borderBottom: `1px solid ${a('#FFFFFF', 0.08)}`,
        fontFamily: 'monospace', fontSize: 16, color: a('#FFFFFF', 0.5) }}>{title}</div>
      <div style={{ padding: '18px 22px', fontFamily: 'monospace', fontSize, lineHeight: 1.7, minHeight: 120 }}>
        {lines.map((ln, i) => {
          const shown = Math.max(0, Math.min(ln.length, Math.floor(budget)));
          budget -= ln.length;
          if (shown <= 0 && budget < 0) return null;
          const isTyping = shown < ln.length && shown > 0;
          return (
            <div key={i} style={{ color: a('#FFFFFF', 0.92), whiteSpace: 'pre' }}>
              <span style={{ color: th.accent }}>$ </span>{ln.slice(0, shown)}
              {isTyping && <span style={{ color: th.accent }}>▋</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── BG: dynamisches Grid mit pulsierenden Zellen ────────────────────────────
export const DynamicGrid: React.FC<{ cols?: number; rows?: number }> = ({ cols = 16, rows = 9 }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  return (
    <AbsoluteFill style={{ background: th.bg }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
        {new Array(cols * rows).fill(0).map((_, i) => {
          const pulse = (Math.sin(f * 0.06 + i * 0.5 + random(`g${i}`) * 6) + 1) / 2;
          return <div key={i} style={{ border: `1px solid ${a('#FFFFFF', 0.04)}`,
            background: a(th.accent, pulse * 0.06 * (random(`h${i}`) > 0.85 ? 3 : 1)) }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};
