import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const CANDIDATES = [
  {label: 'Text', color: '#8757E8', start: 38, end: 66},
  {label: 'Daten', color: '#35C58A', start: 44, end: 24},
  {label: 'Antwort', color: '#FFB648', start: 18, end: 10},
] as const;

export const ProbabilityFluidColumnsPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = prototypeProgress(frame, 0, 34);
  const context = prototypeProgress(frame, 34, 92);
  const lock = prototypeProgress(frame, 112, 164);

  return (
    <PrototypeShell
      family="PROBABILITY"
      title="Probability Fluid Columns"
      subtitle="Neue Kontextsignale verschieben die Füllstände möglicher nächster Wörter."
    >
      <GlassSurface style={{position: 'absolute', left: 76, right: 76, top: 390, bottom: 190, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 90, right: 90, top: 75, padding: '20px 24px', borderRadius: 26, background: 'rgba(135,87,232,.07)', border: '1px solid rgba(135,87,232,.18)', fontSize: 28, lineHeight: 1.25, fontWeight: 900, textAlign: 'center', opacity: enter}}>
          Prompt: „Die KI liest …“
        </div>

        <div style={{position: 'absolute', left: 70, right: 70, top: 270, bottom: 170, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 30}}>
          {CANDIDATES.map((candidate, index) => {
            const level = interpolate(context, [0, 1], [candidate.start, candidate.end]);
            const height = interpolate(level, [0, 100], [0, 610]);
            const reveal = prototypeProgress(frame, 12 + index * 7, 34 + index * 7);
            const winner = index === 0 && lock > 0.35;
            return (
              <div key={candidate.label} style={{width: 225, height: 760, position: 'relative', opacity: reveal, transform: `translateY(${(1 - reveal) * 80}px)`}}>
                <div style={{position: 'absolute', top: 0, left: 0, right: 0, textAlign: 'center', fontSize: 30, fontWeight: 900, color: winner ? candidate.color : PROTOTYPE_PALETTE.foreground}}>{candidate.label}</div>
                <div style={{position: 'absolute', top: 62, left: '50%', transform: 'translateX(-50%)', padding: '10px 15px', borderRadius: 16, background: 'rgba(255,255,255,.9)', border: `2px solid ${candidate.color}44`, color: candidate.color, fontFamily: 'monospace', fontSize: 30, fontWeight: 900}}>{Math.round(level)}%</div>
                <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 620, borderRadius: '34px 34px 22px 22px', border: `4px solid ${candidate.color}66`, background: 'rgba(255,255,255,.55)', overflow: 'hidden', boxShadow: winner ? `0 0 45px ${candidate.color}55` : '0 18px 48px rgba(55,38,83,.10)'}}>
                  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height, background: `linear-gradient(180deg, ${candidate.color}AA, ${candidate.color})`, borderRadius: '24px 24px 16px 16px', boxShadow: `0 -12px 28px ${candidate.color}44`}}>
                    <div style={{position: 'absolute', left: -30, right: -30, top: -14, height: 32, borderRadius: '50%', background: `${candidate.color}CC`, transform: `translateX(${Math.sin(frame / 7 + index) * 12}px)`}} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {['THEMA', 'GRAMMATIK', 'KONTEXT'].map((label, index) => {
          const drop = prototypeProgress(frame, 38 + index * 20, 62 + index * 20);
          return <div key={label} style={{position: 'absolute', left: 205 + index * 260, top: 195 + drop * 130, width: 118, height: 46, borderRadius: 999, background: index === 0 ? PROTOTYPE_PALETTE.accent : index === 1 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.warning, color: PROTOTYPE_PALETTE.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, letterSpacing: 1.5, opacity: drop * (1 - lock), boxShadow: '0 10px 28px rgba(40,26,70,.16)'}}>{label}</div>;
        })}

        <div style={{position: 'absolute', left: 180, right: 180, bottom: 50, padding: '21px 26px', borderRadius: 24, background: PROTOTYPE_PALETTE.foreground, color: PROTOTYPE_PALETTE.white, textAlign: 'center', fontSize: 25, fontWeight: 900, opacity: lock, transform: `translateY(${(1 - lock) * 45}px)`}}>
          Höchste Wahrscheinlichkeit: <span style={{color: PROTOTYPE_PALETTE.accentSoft}}>„Text“</span>
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
