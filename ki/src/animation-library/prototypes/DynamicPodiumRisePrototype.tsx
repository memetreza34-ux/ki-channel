import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {staggerDelay} from '../../motion/easing';
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
  exact: boolean;
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

const booleanValue = (value: string | number, fallback: boolean): boolean => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed >= 0.5 : fallback;
};

const scoreAt = (frame: number, candidate: RankingCandidate): number =>
  interpolate(
    frame,
    [20, 58, 96, 134],
    [50, candidate.start, candidate.middle, candidate.end],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

export const DynamicPodiumRisePrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const intro = prototypeProgress(frame, 0, 28);
  const lock = prototypeProgress(frame, 136, 170);
  const outcomeGrounded = booleanValue(
    getPrototypeValue({
      content,
      key: 'rankingOutcomeGrounded',
      fallback: content ? 0 : 1,
    }),
    !content,
  );
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
      exact: booleanValue(
        getPrototypeValue({
          content,
          key: `candidate${index + 1}ScoreExact`,
          fallback: content ? 0 : 1,
        }),
        !content,
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
  const criterionProgresses = criteria.map((_, index) =>
    prototypeProgress(frame, 28 + staggerDelay(index, 38), 58 + staggerDelay(index, 38)),
  );
  const currentScores = candidates.map((candidate) => scoreAt(frame, candidate));
  const rankedIndices = currentScores
    .map((score, index) => ({score, index}))
    .sort((a, b) => b.score - a.score)
    .map(({index}) => index);
  const currentRanks = candidates.map((_, index) => rankedIndices.indexOf(index) + 1);
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
      subtitle="Kriterien werden nacheinander eingerechnet. Exakte Scores und ein finaler Sieger erscheinen nur, wenn der Sprechertext sie wirklich begründet."
    >
      <GlassSurface style={{position: 'absolute', left: 76, right: 76, top: 390, bottom: 190, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 50, right: 50, top: 58, display: 'flex', justifyContent: 'space-between', gap: 14, opacity: intro}}>
          {criteria.map((criterion, index) => {
            const progress = criterionProgresses[index];
            const active = progress > 0.08 && progress < 0.92;
            const applied = progress >= 0.92;
            return (
              <div key={`${criterion}-${index}`} style={{width: 245, padding: '15px 16px', borderRadius: 22, textAlign: 'center', fontSize: criterion.length > 16 ? 14 : 19, fontWeight: 900, letterSpacing: 2, color: active || applied ? PROTOTYPE_PALETTE.white : PROTOTYPE_PALETTE.muted, background: active ? `linear-gradient(135deg, ${PROTOTYPE_PALETTE.accent}, #6A39D0)` : applied ? PROTOTYPE_PALETTE.success : 'rgba(135,87,232,.07)', border: '1px solid rgba(135,87,232,.18)', transform: `scale(${1 + (active ? 0.07 : 0)})`, boxShadow: active ? '0 12px 35px rgba(135,87,232,.3)' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                <div>{criterion.toLocaleUpperCase('de-DE')}</div>
                <div style={{marginTop: 5, fontSize: 11, letterSpacing: 1.2}}>{applied ? 'EINGERECHNET ✓' : active ? 'WIRD GEWERTET' : 'WARTET'}</div>
              </div>
            );
          })}
        </div>

        <div style={{position: 'absolute', left: 70, right: 70, bottom: 96, height: 760, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 24}}>
          {candidates.map((candidate, index) => {
            const score = currentScores[index];
            const height = interpolate(score, [45, 95], [235, 650], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const reveal = prototypeProgress(frame, 14 + staggerDelay(index, 8), 38 + staggerDelay(index, 8));
            const isWinner = outcomeGrounded && index === winnerIndex && lock > 0.35;
            const valueLabel = candidate.exact && lock > 0.35
              ? `${Math.round(candidate.end)} P`
              : outcomeGrounded
                ? `RANG ${currentRanks[index]}`
                : 'WERTUNG';
            return (
              <div key={`${candidate.label}-${index}`} style={{width: 230, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', opacity: reveal, transform: `translateY(${(1 - reveal) * 90}px)`}}>
                <div style={{marginBottom: 8, padding: '8px 13px', borderRadius: 16, background: outcomeGrounded && currentRanks[index] === 1 ? `${candidate.color}18` : 'rgba(255,255,255,.82)', border: `2px solid ${candidate.color}44`, color: candidate.color, fontFamily: 'monospace', fontSize: 17, fontWeight: 900}}>
                  {outcomeGrounded ? `RANG ${currentRanks[index]}` : 'POSITION OFFEN'}
                </div>
                <div style={{maxWidth: 230, marginBottom: 16, padding: '15px 20px', borderRadius: 20, background: isWinner ? candidate.color : 'rgba(255,255,255,.92)', border: `2px solid ${candidate.color}55`, color: isWinner ? PROTOTYPE_PALETTE.white : PROTOTYPE_PALETTE.foreground, fontSize: candidate.label.length > 15 ? 20 : 30, fontWeight: 900, boxShadow: isWinner ? `0 18px 50px ${candidate.color}55` : '0 12px 34px rgba(50,34,80,.1)', transform: `scale(${1 + (isWinner ? lock * 0.1 : 0)})`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{candidate.label}</div>
                <div style={{width: '100%', height, borderRadius: '30px 30px 10px 10px', background: `linear-gradient(180deg, ${candidate.color}, ${candidate.color}44)`, border: `2px solid ${candidate.color}88`, boxShadow: `0 20px 55px ${candidate.color}33`, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 30, boxSizing: 'border-box'}}>
                  <div style={{padding: '12px 16px', borderRadius: 18, background: 'rgba(255,255,255,.9)', color: candidate.color, fontFamily: 'monospace', fontSize: candidate.exact && lock > 0.35 ? 30 : 20, fontWeight: 900}}>{valueLabel}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{position: 'absolute', left: '50%', bottom: 36, maxWidth: 760, transform: `translateX(-50%) translateY(${(1 - lock) * 34}px)`, opacity: lock, padding: '16px 26px', borderRadius: 22, background: PROTOTYPE_PALETTE.foreground, color: PROTOTYPE_PALETTE.white, fontSize: resultLabel.length > 40 ? 17 : 23, fontWeight: 900, letterSpacing: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          {outcomeGrounded
            ? `${resultLabel.toLocaleUpperCase('de-DE')} · ${candidates[winnerIndex].label}${candidates[winnerIndex].exact ? ` · ${Math.round(candidates[winnerIndex].end)} P` : ''}`
            : 'KRITERIEN VERGLICHEN · KEIN UNBELEGTER SIEGER'}
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
