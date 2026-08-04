import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const GATES = [
  {label: 'LAYER 1', x: 250, color: '#8757E8'},
  {label: 'LAYER 2', x: 470, color: '#35C58A'},
  {label: 'LAYER 3', x: 690, color: '#FFB648'},
] as const;

export const ResidualRiverPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const river = prototypeProgress(frame, 0, 42);
  const gateFlow = prototypeProgress(frame, 32, 124);
  const merge = prototypeProgress(frame, 92, 150);
  const resolve = prototypeProgress(frame, 142, 174);

  return (
    <PrototypeShell
      family="MODEL PROCESSING"
      title="Residual River"
      subtitle="Ein Hauptstrom wird durch mehrere Verarbeitungsschichten verfeinert, während Seitenkanäle Information zurückführen."
    >
      <GlassSurface style={{position: 'absolute', left: 72, right: 72, top: 390, bottom: 190, overflow: 'hidden'}}>
        <svg width="936" height="1080" viewBox="0 0 936 1080" style={{position: 'absolute', inset: 0}}>
          <path d="M 80 610 C 240 530, 360 680, 520 590 S 760 520, 880 610" fill="none" stroke="rgba(135,87,232,.14)" strokeWidth={118} strokeLinecap="round" />
          <path d="M 80 610 C 240 530, 360 680, 520 590 S 760 520, 880 610" fill="none" stroke={PROTOTYPE_PALETTE.accent} strokeWidth={54} strokeLinecap="round" strokeDasharray={1500} strokeDashoffset={1500 * (1 - river)} style={{filter: 'drop-shadow(0 0 20px rgba(135,87,232,.28))'}} />
          {GATES.map((gate, index) => {
            const side = index % 2 === 0 ? -1 : 1;
            const sideY = 610 + side * 260;
            const reveal = prototypeProgress(frame, 40 + index * 22, 78 + index * 22);
            return (
              <React.Fragment key={gate.label}>
                <path d={`M ${gate.x} ${sideY} Q ${gate.x + 30} ${610 + side * 80}, ${gate.x + 95} 610`} fill="none" stroke={gate.color} strokeWidth={16} strokeLinecap="round" strokeDasharray={520} strokeDashoffset={520 * (1 - reveal)} opacity={merge} />
                <circle cx={gate.x} cy={sideY} r={28} fill={gate.color} opacity={reveal} />
              </React.Fragment>
            );
          })}
        </svg>

        {GATES.map((gate, index) => {
          const reveal = prototypeProgress(frame, 18 + index * 14, 44 + index * 14);
          const active = gateFlow >= (index + 1) / 3;
          return (
            <div key={gate.label} style={{position: 'absolute', left: gate.x, top: 610, transform: `translate(-50%, -50%) scale(${0.82 + reveal * 0.18})`, opacity: reveal, zIndex: 6}}>
              <div style={{width: 126, height: 180, borderRadius: 32, background: 'rgba(255,255,255,.92)', border: `4px solid ${active ? gate.color : PROTOTYPE_PALETTE.line}`, boxShadow: active ? `0 0 38px ${gate.color}55` : '0 16px 42px rgba(55,38,83,.10)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12}}>
                <div style={{width: 45, height: 45, borderRadius: 14, background: gate.color, transform: `rotate(${gateFlow * 90 + index * 18}deg)`}} />
                <div style={{fontSize: 18, fontWeight: 900, color: active ? gate.color : PROTOTYPE_PALETTE.muted, textAlign: 'center'}}>{gate.label}</div>
              </div>
            </div>
          );
        })}

        {Array.from({length: 9}, (_, index) => {
          const travel = Math.min(1, Math.max(0, gateFlow * 1.18 - index * 0.075));
          const x = interpolate(travel, [0, 1], [80, 880]);
          const y = 610 + Math.sin(travel * Math.PI * 3 + index) * 42;
          return <div key={index} style={{position: 'absolute', left: x, top: y, width: 18 + (index % 3) * 5, height: 18 + (index % 3) * 5, borderRadius: 999, background: index % 3 === 0 ? PROTOTYPE_PALETTE.white : PROTOTYPE_PALETTE.accentSoft, border: `4px solid ${PROTOTYPE_PALETTE.accent}`, boxShadow: '0 0 20px rgba(135,87,232,.4)', transform: 'translate(-50%, -50%)', opacity: river, zIndex: 8}} />;
        })}

        <div style={{position: 'absolute', left: 100, top: 220, width: 240, padding: '20px 24px', borderRadius: 24, background: 'rgba(135,87,232,.08)', border: '2px solid rgba(135,87,232,.2)', opacity: river}}>
          <div style={{fontSize: 18, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.accent}}>HAUPTSTROM</div>
          <div style={{marginTop: 10, fontSize: 26, fontWeight: 900}}>Grundinformation</div>
        </div>

        <div style={{position: 'absolute', right: 90, bottom: 70, width: 330, padding: '24px 28px', borderRadius: 28, background: PROTOTYPE_PALETTE.foreground, color: PROTOTYPE_PALETTE.white, opacity: resolve, transform: `translateY(${(1 - resolve) * 55}px)`, boxShadow: '0 22px 60px rgba(20,18,26,.2)'}}>
          <div style={{fontSize: 18, fontWeight: 900, letterSpacing: 2.5, color: PROTOTYPE_PALETTE.accentSoft}}>VERFEINERTER OUTPUT</div>
          <div style={{marginTop: 12, fontSize: 30, lineHeight: 1.18, fontWeight: 900}}>Altes Signal + neue Verarbeitung</div>
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
