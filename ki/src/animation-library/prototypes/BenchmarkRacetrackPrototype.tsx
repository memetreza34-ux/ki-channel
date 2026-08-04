import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const COMPETITORS = [
  {label: 'MODELL A', color: '#8757E8'},
  {label: 'MODELL B', color: '#35C58A'},
] as const;

const positionAt = (frame: number, index: number): number => {
  const race = prototypeProgress(frame, 28, 150);
  if (index === 0) {
    return interpolate(race, [0, 0.34, 0.68, 1], [0, 0.39, 0.61, 1]);
  }
  return interpolate(race, [0, 0.34, 0.68, 1], [0, 0.29, 0.76, 0.92]);
};

export const BenchmarkRacetrackPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const track = prototypeProgress(frame, 0, 36);
  const finish = prototypeProgress(frame, 142, 174);

  return (
    <PrototypeShell
      family="COMPARISON"
      title="Benchmark Racetrack"
      subtitle="Tempo, Kosten und Qualität beeinflussen verschiedene Abschnitte — kein Modell gewinnt automatisch überall."
    >
      <GlassSurface style={{position: 'absolute', left: 72, right: 72, top: 390, bottom: 190, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 46, right: 46, top: 65, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, opacity: track}}>
          {[
            {label: 'TEMPO', color: '#8757E8'},
            {label: 'KOSTEN', color: '#FFB648'},
            {label: 'QUALITÄT', color: '#35C58A'},
          ].map((metric) => (
            <div key={metric.label} style={{padding: '16px 18px', borderRadius: 20, background: `${metric.color}12`, border: `2px solid ${metric.color}44`, color: metric.color, textAlign: 'center', fontSize: 19, fontWeight: 900, letterSpacing: 2.5}}>{metric.label}</div>
          ))}
        </div>

        {COMPETITORS.map((competitor, index) => {
          const y = 390 + index * 300;
          const position = positionAt(frame, index);
          const x = interpolate(position, [0, 1], [115, 822]);
          return (
            <React.Fragment key={competitor.label}>
              <div style={{position: 'absolute', left: 85, right: 80, top: y - 78, height: 156, borderRadius: 78, background: 'rgba(255,255,255,.58)', border: `5px solid ${competitor.color}44`, overflow: 'hidden', opacity: track}}>
                {[0, 1, 2].map((zone) => (
                  <div key={zone} style={{position: 'absolute', left: `${zone * 33.333}%`, width: '33.333%', top: 0, bottom: 0, background: zone === 0 ? 'rgba(135,87,232,.08)' : zone === 1 ? 'rgba(255,182,72,.08)' : 'rgba(53,197,138,.08)', borderRight: zone < 2 ? '3px dashed rgba(116,109,128,.18)' : undefined}} />
                ))}
                {Array.from({length: 12}, (_, marker) => (
                  <div key={marker} style={{position: 'absolute', left: 28 + marker * 63, top: '50%', width: 28, height: 5, borderRadius: 999, background: `${competitor.color}35`, transform: 'translateY(-50%)'}} />
                ))}
              </div>
              <div style={{position: 'absolute', left: 94, top: y - 128, padding: '10px 15px', borderRadius: 15, background: 'rgba(255,255,255,.94)', border: `2px solid ${competitor.color}55`, color: competitor.color, fontSize: 18, fontWeight: 900, letterSpacing: 2}}>{competitor.label}</div>
              <div style={{position: 'absolute', left: x, top: y, width: 76, height: 76, borderRadius: index === 0 ? 24 : 999, background: competitor.color, border: '8px solid white', boxShadow: `0 0 38px ${competitor.color}66`, transform: `translate(-50%, -50%) rotate(${index === 0 ? position * 450 : 0}deg)`, zIndex: 7}} />
            </React.Fragment>
          );
        })}

        <div style={{position: 'absolute', left: 822, top: 250, bottom: 215, width: 14, borderRadius: 999, background: `repeating-linear-gradient(180deg, ${PROTOTYPE_PALETTE.foreground} 0 20px, white 20px 40px)`, opacity: track}} />

        <div style={{position: 'absolute', left: 100, right: 100, bottom: 52, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, opacity: finish, transform: `translateY(${(1 - finish) * 46}px)`}}>
          <div style={{padding: '22px 24px', borderRadius: 26, background: 'rgba(135,87,232,.10)', border: '2px solid rgba(135,87,232,.34)'}}><div style={{fontSize: 19, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.accent}}>MODELL A</div><div style={{marginTop: 10, fontSize: 27, fontWeight: 900}}>Gesamtsieger</div><div style={{marginTop: 7, fontSize: 19, color: PROTOTYPE_PALETTE.muted, fontWeight: 800}}>stark bei Tempo + Qualität</div></div>
          <div style={{padding: '22px 24px', borderRadius: 26, background: 'rgba(53,197,138,.10)', border: '2px solid rgba(53,197,138,.34)'}}><div style={{fontSize: 19, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.success}}>MODELL B</div><div style={{marginTop: 10, fontSize: 27, fontWeight: 900}}>Kostensieger</div><div style={{marginTop: 7, fontSize: 19, color: PROTOTYPE_PALETTE.muted, fontWeight: 800}}>günstiger, aber langsamer</div></div>
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
