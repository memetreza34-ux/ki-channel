import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  getPrototypeLabel,
  getPrototypeValue,
  usePrototypeContent,
} from './PrototypeContentContext';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const COLORS = ['#8757E8', '#35C58A', '#FFB648'] as const;
const compactText = (value: string, maximum: number): string =>
  value.length <= maximum ? value : `${value.slice(0, maximum - 1).trim()}…`;
const numberValue = (value: string | number, fallback: number): number => {
  const parsed = typeof value === 'number'
    ? value
    : Number(String(value).replace(',', '.').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : fallback;
};

export const ProbabilityFluidColumnsPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const enter = prototypeProgress(frame, 0, 34);
  const lock = prototypeProgress(frame, 112, 164);
  const defaultTerms = content
    ? [...new Set([
        ...content.meaningContract.resultTerms,
        ...content.meaningContract.subjectTerms,
      ])]
    : [];
  const candidates = [
    {
      label: getPrototypeLabel({content, key: 'candidate1', fallback: defaultTerms[0] ?? 'Text'}),
      color: COLORS[0],
      start: numberValue(getPrototypeValue({content, key: 'candidate1Start', fallback: 38}), 38),
      end: numberValue(getPrototypeValue({content, key: 'candidate1End', fallback: 66}), 66),
    },
    {
      label: getPrototypeLabel({content, key: 'candidate2', fallback: defaultTerms[1] ?? 'Daten'}),
      color: COLORS[1],
      start: numberValue(getPrototypeValue({content, key: 'candidate2Start', fallback: 44}), 44),
      end: numberValue(getPrototypeValue({content, key: 'candidate2End', fallback: 24}), 24),
    },
    {
      label: getPrototypeLabel({content, key: 'candidate3', fallback: defaultTerms[2] ?? 'Antwort'}),
      color: COLORS[2],
      start: numberValue(getPrototypeValue({content, key: 'candidate3Start', fallback: 18}), 18),
      end: numberValue(getPrototypeValue({content, key: 'candidate3End', fallback: 10}), 10),
    },
  ];
  const winnerIndex = candidates.reduce(
    (best, candidate, index, all) =>
      candidate.end > all[best].end ? index : best,
    0,
  );
  const prompt = getPrototypeLabel({
    content,
    key: 'prompt',
    fallback: content?.spokenText
      ? compactText(content.spokenText, 80)
      : 'Die KI liest …',
  });
  const signals = [
    getPrototypeLabel({content, key: 'signal1', fallback: 'THEMA'}),
    getPrototypeLabel({content, key: 'signal2', fallback: 'GRAMMATIK'}),
    getPrototypeLabel({content, key: 'signal3', fallback: 'KONTEXT'}),
  ];
  const signalProgresses = signals.map((_, index) =>
    prototypeProgress(frame, 38 + index * 20, 62 + index * 20),
  );
  const contextProgress = signalProgresses.reduce((sum, value) => sum + value, 0) / signals.length;
  const resultLabel = getPrototypeLabel({
    content,
    key: 'resultLabel',
    fallback: 'Höchste Wahrscheinlichkeit',
  });

  return (
    <PrototypeShell
      family="PROBABILITY"
      title="Probability Fluid Columns"
      subtitle="Jedes neue Kontextsignal verschiebt die Wahrscheinlichkeiten sichtbar, bis ein Kandidat vorne liegt."
    >
      <GlassSurface style={{position: 'absolute', left: 76, right: 76, top: 390, bottom: 190, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 90, right: 90, top: 65, padding: '20px 24px', borderRadius: 26, background: 'rgba(135,87,232,.07)', border: '1px solid rgba(135,87,232,.18)', fontSize: prompt.length > 60 ? 21 : 28, lineHeight: 1.25, fontWeight: 900, textAlign: 'center', opacity: enter, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
          Prompt: „{prompt}“
        </div>

        <div style={{position: 'absolute', left: 115, right: 115, top: 185, height: 64, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, opacity: enter}}>
          {signals.map((label, index) => {
            const arrived = signalProgresses[index];
            return (
              <div key={`${label}-rail-${index}`} style={{borderRadius: 18, border: `2px solid ${COLORS[index]}55`, background: arrived > 0.7 ? `${COLORS[index]}18` : 'rgba(255,255,255,.7)', color: arrived > 0.7 ? COLORS[index] : PROTOTYPE_PALETTE.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: label.length > 11 ? 12 : 15, fontWeight: 900, letterSpacing: 1.4, transform: `scale(${0.96 + arrived * 0.04})`}}>
                <span style={{width: 10, height: 10, borderRadius: 999, background: arrived > 0.7 ? COLORS[index] : PROTOTYPE_PALETTE.line, boxShadow: arrived > 0.7 ? `0 0 14px ${COLORS[index]}88` : 'none'}} />
                {label.toLocaleUpperCase('de-DE')}
              </div>
            );
          })}
        </div>

        <div style={{position: 'absolute', left: 70, right: 70, top: 300, bottom: 170, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 30}}>
          {candidates.map((candidate, index) => {
            const level = interpolate(contextProgress, [0, 1], [candidate.start, candidate.end]);
            const height = interpolate(level, [0, 100], [0, 570]);
            const reveal = prototypeProgress(frame, 12 + index * 7, 34 + index * 7);
            const winner = index === winnerIndex && lock > 0.35;
            const delta = candidate.end - candidate.start;
            const direction = delta > 0 ? '↑' : delta < 0 ? '↓' : '→';
            return (
              <div key={`${candidate.label}-${index}`} style={{width: 225, height: 720, position: 'relative', opacity: reveal, transform: `translateY(${(1 - reveal) * 80}px)`}}>
                <div style={{position: 'absolute', top: 0, left: 0, right: 0, textAlign: 'center', fontSize: candidate.label.length > 12 ? 20 : 30, fontWeight: 900, color: winner ? candidate.color : PROTOTYPE_PALETTE.foreground, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{candidate.label}</div>
                <div style={{position: 'absolute', top: 58, left: '50%', transform: 'translateX(-50%)', padding: '10px 15px', borderRadius: 16, background: 'rgba(255,255,255,.92)', border: `2px solid ${candidate.color}44`, color: candidate.color, fontFamily: 'monospace', fontSize: 29, fontWeight: 900}}>{Math.round(level)}%</div>
                <div style={{position: 'absolute', top: 112, left: 12, right: 12, textAlign: 'center', fontSize: 14, fontWeight: 850, color: delta >= 0 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.danger}}>
                  {candidate.start}% {direction} {candidate.end}% · {delta >= 0 ? '+' : ''}{delta} Pkt.
                </div>
                <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 580, borderRadius: '34px 34px 22px 22px', border: `4px solid ${candidate.color}66`, background: 'rgba(255,255,255,.55)', overflow: 'hidden', boxShadow: winner ? `0 0 45px ${candidate.color}55` : '0 18px 48px rgba(55,38,83,.10)'}}>
                  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height, background: `linear-gradient(180deg, ${candidate.color}AA, ${candidate.color})`, borderRadius: '24px 24px 16px 16px', boxShadow: `0 -12px 28px ${candidate.color}44`, transition: 'none'}}>
                    <div style={{position: 'absolute', left: -30, right: -30, top: -14, height: 32, borderRadius: '50%', background: `${candidate.color}CC`, transform: `translateX(${Math.sin(frame / 8 + index) * 6 * (1 - lock)}px)`}} />
                  </div>
                  {[25, 50, 75].map((mark) => (
                    <div key={mark} style={{position: 'absolute', left: 14, right: 14, bottom: `${mark}%`, height: 1, background: 'rgba(20,18,26,.10)'}} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {signals.map((label, index) => {
          const drop = signalProgresses[index];
          return <div key={`${label}-${index}`} style={{position: 'absolute', left: 205 + index * 260, top: 245 + drop * 65, width: 118, height: 42, borderRadius: 999, background: COLORS[index], color: PROTOTYPE_PALETTE.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: label.length > 10 ? 12 : 15, fontWeight: 900, letterSpacing: 1.4, opacity: drop * (1 - lock), boxShadow: '0 10px 28px rgba(40,26,70,.16)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '0 8px', boxSizing: 'border-box'}}>{label.toLocaleUpperCase('de-DE')}</div>;
        })}

        <div style={{position: 'absolute', left: 150, right: 150, bottom: 50, padding: '21px 26px', borderRadius: 24, background: PROTOTYPE_PALETTE.foreground, color: PROTOTYPE_PALETTE.white, textAlign: 'center', fontSize: 25, fontWeight: 900, opacity: lock, transform: `translateY(${(1 - lock) * 45}px)`}}>
          {resultLabel}: <span style={{color: COLORS[winnerIndex]}}>„{candidates[winnerIndex].label}“</span>
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
