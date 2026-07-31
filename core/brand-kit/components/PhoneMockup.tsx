import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, E, prog, lerpF, a } from '../tokens';

// iPhone-artiges Mockup — für „so sieht die App aus"-Szenen (Trade Republic etc.).
// Inhalt als children (Screenshot via <Img> oder eigene UI).
export const PhoneMockup: React.FC<{
  children?: React.ReactNode;
  at?: number;            // Erscheinen-Frame
  width?: number;
  glowColor?: string;
  style?: React.CSSProperties;
}> = ({ children, at = 0, width = 420, glowColor = 'var(--accent)', style }) => {
  const f = useCurrentFrame();
  const p = at ? prog(f, at, at + 16, E.spring) : 1;
  const h = width * 2.05;
  const bez = width * 0.045;
  return (
    <div style={{
      width, height: h, borderRadius: width * 0.16,
      background: '#05070C',
      border: `${bez}px solid #1A2028`,
      boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 70px ${a(glowColor, 0.25)}, inset 0 0 0 2px #2A323C`,
      position: 'relative', overflow: 'hidden',
      opacity: p, transform: `translateY(${lerpF(f, 50, 0, at, at + 16, E.spring)}px) scale(${0.92 + p * 0.08})`,
      ...style,
    }}>
      {/* Notch / Dynamic Island */}
      <div style={{
        position: 'absolute', top: bez * 1.2, left: '50%', transform: 'translateX(-50%)',
        width: width * 0.32, height: width * 0.085, borderRadius: 999, background: '#05070C',
        zIndex: 5,
      }} />
      {/* Screen */}
      <div style={{ position: 'absolute', inset: bez, borderRadius: width * 0.12, overflow: 'hidden',
        background: C.bgNeutral, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
};

// Einfacher App-Screen-Platzhalter (falls kein Screenshot da ist).
export const AppScreenDemo: React.FC<{ title?: string; value?: string; color?: string }> = ({
  title = 'Dein Depot', value = '12.480 €', color = 'var(--accent)',
}) => (
  <div style={{ flex: 1, padding: 28, fontFamily: '"Inter", Arial', color: C.white }}>
    <div style={{ height: 50 }} />
    <div style={{ fontSize: 26, color: C.gray }}>{title}</div>
    <div style={{ fontSize: 64, fontWeight: 900, color, marginTop: 6 }}>{value}</div>
    <div style={{ display: 'flex', gap: 8, marginTop: 6, color, fontSize: 24, fontWeight: 700 }}>▲ +8,2 %</div>
    {/* fake chart line */}
    <svg width="100%" height="160" style={{ marginTop: 24 }}>
      <polyline points="0,140 60,120 120,128 180,90 240,100 300,50 360,30"
        fill="none" stroke={color} strokeWidth={4} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
    </svg>
    {/* rows */}
    {['ETF World', 'S&P 500', 'Tech'].map((n, i) => (
      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 0', borderTop: `1px solid ${a(C.gray, 0.15)}` }}>
        <span style={{ fontSize: 28, fontWeight: 600 }}>{n}</span>
        <span style={{ fontSize: 26, color: 'var(--accent)', fontWeight: 700 }}>+{(i + 1) * 3}%</span>
      </div>
    ))}
  </div>
);
