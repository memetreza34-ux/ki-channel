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

type RankingCandidate = {
  label: string;
  color: string;
  start: number;
  middle: number;
  end: number;
};

const COLORS = ['#8757E8', '#35C58A', '#FFB648'] as const;
const DEFAULT_CANDIDATES = [
  {label: 'Tool A', start: 58, middle: 74, end: 91},
  {label: 'Tool B', start: 72, middle: 68, end: 76},
  {label: 'Tool C', start: 64, middle: 81, end: 69},
] as const;

const numericScore = (
  value: string | number,
  fallback: number,
): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed)
    ? Math.max(0, Math.min(100, parsed))
    : fallback;
};

const scoreAt = (frame: number, candidate: RankingCandidate): number => {
  if (frame <= 90) {
    return interpolate(frame, [20, 90], [candidate.start, candidate.middle], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }
  return interpolate(frame, [90, 150], [candidate.middle, candidate.end], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

export const DynamicPodiumRisePrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const intro = prototypeProgress(frame, 0, 28);
  const lock = prototypeProgress(frame, 140, 170);
  const terms = content
    ? [...new Set([
        ...content.meaningContract.subjectTerms,
        ...content.meaningContract.resultTerms,
      ])]
    : [];
  const candidates: RankingCandidate[] = DEFAULT_CANDIDATES.map(
    (candidate, index) => ({
      label: getPrototypeLabel({
        content,
        key: `candidate${index + 1}`,
        fallback: terms[index] ?? candidate.label,
      }),
      color: COLORS[index],
      start: numericScore(
        getPrototypeValue({
          content,
          key: `candidate${index + 1}Start`,
          fallback: candidate.start,
        }),
        candidate.start,
      ),
      middle: numericScore(
        getPrototypeValue({
          content,
          key: `candidate${index + 1}Middle`,
          fallback: candidate.middle,
        }),
        candidate.middle,
      ),
      end: numericScore(
        getPrototypeValue({
          content,
          key: `candidate${index + 1}End`,
          fallback: candidate.end,
        }),
        candidate.end,
      ),
    }),
  );
  const criteria = ['PREIS', 'TEMPO', 'QUALITÄT'].map((fallback, index) =>
    getPrototypeLabel({
      content,
      key: `criterion${index + 1}`,
      fallback:
        content?.meaningContract.preferredExplanationPatterns[index] ?? fallback,
    }),
  );
  const winnerIndex = candidates.reduce(
    (best, candidate, index, all) =>
      candidate.end > all[best].end ? index : best,
    0,
  );
  const resultLabel = getPrototypeLabel({
    content,
    key: 'resultLabel',
    fallback: 'RANKING NACH ALLEN KRITERIEN',
  });

  return (
    <PrototypeShell
      family="RANKING"
      title="Dynamic Podium Rise"
      subtitle="Die Reihenfolge verändert sich sichtbar, sobald neue Kriterien einfließen."
    >
      <GlassSurface style={{position: 'absolute', left: 76, right: 76, top: 390, bottom: 190, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 50, right: 50, top: 65, display: 'flex', justifyContent: 'space-between', opacity: intro}}>
          {criteria.map((criterion, index) => {
            const active = prototypeProgress(frame, 32 + index * 34, 52 + index * 34) *
              (1 - prototypeProgress(frame, 62 + index * 34, 76 + index * 34));
            return (
              <div key={`${criterion}-${index}`} style={{width: 230, padding: '17px 18px', borderRadius: 22, textAlign: 'center', fontSize: criterion.length > 16 ? 14 : 20, fontWeight: 900, letterSpacing: 2.5, color: active > 0.1 ? PROTOTYPE_PALETTE.white : PROTOTYPE_PALETTE.muted, background: active > 0.1 ? `linear-gradient(135deg, ${PROTOTYPE_PALETTE.accent}, #6A39D0)` : 'rgba(135,87,232,.07)', border: '1px solid rgba(135,87,232,.18)', transform: `scale(${1 + active * 0.08})`, boxShadow: active > 0.1 ? '0 12px 35px rgba(135,87,232,.3)' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{criterion.toLocaleUpperCase('de-DE')}</div>
            );
          })}
        </div>

        <div style={{position: 'absolute', left: 70, right: 70, bottom: 96, height: 760, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 24}}>
          {candidates.map((candidate, index) => {
            const score = scoreAt(frame, candidate);
            const height = interpolate(score, [50, 95], [270, 650], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const reveal = prototypeProgress(frame, 14 + index * 8, 38 + index * 8);
            const isWinner = index === winnerIndex && lock > 0.35;
            return (
              <div key={`${candidate.label}-${index}`} style={{width: 230, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', opacity: reveal, transform: `translateY(${(1 - reveal) * 90}px)`}}>
                <div style={{maxWidth: 230, marginBottom: 18, padding: '15px 20px', borderRadius: 20, background: isWinner ? candidate.color : 'rgba(255,255,255,.92)', border: `2px solid ${candidate.color}55`, color: isWinner ? PROTOTYPE_PALETTE.white : PROTOTYPE_PALETTE.foreground, fontSize: candidate.label.length > 15 ? 20 : 30, fontWeight: 900, boxShadow: isWinner ? `0 18px 50px ${candidate.color}55` : '0 12px 34px rgba(50,34,80,.1)', transform: `scale(${1 + (isWinner ? lock * 0.12 : 0)})`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{candidate.label}</div>
                <div style={{width: '100%', height, borderRadius: '30px 30px 10px 10px', background: `linear-gradient(180deg, ${candidate.color}, ${candidate.color}44)`, border: `2px solid ${candidate.color}88`, boxShadow: `0 20px 55px ${candidate.color}33`, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 30, boxSizing: 'border-box'}}>
                  <div style={{padding: '12px 16px', borderRadius: 18, background: 'rgba(255,255,255,.9)', color: candidate.color, fontFamily: 'monospace', fontSize: 34, fontWeight: 900}}>{Math.round(score)}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{position: 'absolute', left: '50%', bottom: 36, maxWidth: 760, transform: `translateX(-50%) translateY(${(1 - lock) * 34}px)`, opacity: lock, padding: '16px 26px', borderRadius: 22, background: PROTOTYPE_PALETTE.foreground, color: PROTOTYPE_PALETTE.white, fontSize: resultLabel.length > 40 ? 17 : 23, fontWeight: 900, letterSpacing: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{resultLabel.toLocaleUpperCase('de-DE')} · {candidates[winnerIndex].label}</div>
      </GlassSurface>
    </PrototypeShell>
  );
};
