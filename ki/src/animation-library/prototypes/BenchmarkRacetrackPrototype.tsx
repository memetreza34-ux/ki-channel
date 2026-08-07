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

type Competitor = {
  label: string;
  color: string;
  checkpoints: [number, number, number, number];
};

const numericRatio = (
  value: string | number,
  fallback: number,
): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed)
    ? Math.max(0, Math.min(1, parsed > 1 ? parsed / 100 : parsed))
    : fallback;
};

const positionAt = (race: number, competitor: Competitor): number =>
  interpolate(
    race,
    [0, 0.34, 0.68, 1],
    competitor.checkpoints,
  );

export const BenchmarkRacetrackPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const track = prototypeProgress(frame, 0, 36);
  const race = prototypeProgress(frame, 28, 150);
  const finish = prototypeProgress(frame, 142, 174);
  const terms = content
    ? [...new Set([
        ...content.meaningContract.subjectTerms,
        ...content.meaningContract.resultTerms,
      ])]
    : [];
  const competitors: Competitor[] = [
    {
      label: getPrototypeLabel({
        content,
        key: 'competitor1',
        fallback: terms[0] ?? 'MODELL A',
      }),
      color: '#8757E8',
      checkpoints: [
        0,
        numericRatio(getPrototypeValue({content, key: 'competitor1Metric1', fallback: 0.39}), 0.39),
        numericRatio(getPrototypeValue({content, key: 'competitor1Metric2', fallback: 0.61}), 0.61),
        numericRatio(getPrototypeValue({content, key: 'competitor1Final', fallback: 1}), 1),
      ],
    },
    {
      label: getPrototypeLabel({
        content,
        key: 'competitor2',
        fallback: terms[1] ?? 'MODELL B',
      }),
      color: '#35C58A',
      checkpoints: [
        0,
        numericRatio(getPrototypeValue({content, key: 'competitor2Metric1', fallback: 0.29}), 0.29),
        numericRatio(getPrototypeValue({content, key: 'competitor2Metric2', fallback: 0.76}), 0.76),
        numericRatio(getPrototypeValue({content, key: 'competitor2Final', fallback: 0.92}), 0.92),
      ],
    },
  ];
  const metrics = ['TEMPO', 'KOSTEN', 'QUALITÄT'].map((fallback, index) =>
    getPrototypeLabel({
      content,
      key: `metric${index + 1}`,
      fallback:
        content?.meaningContract.preferredExplanationPatterns[index] ?? fallback,
    }),
  );
  const metricCheckpointIndex = Math.min(3, Math.max(1, Math.ceil(race * 3)));
  const activeMetricIndex = Math.min(2, Math.floor(race * 3));
  const metricLeaders = metrics.map((_, metricIndex) => {
    const checkpoint = metricIndex + 1;
    return competitors.reduce(
      (best, competitor, index, all) =>
        competitor.checkpoints[checkpoint] > all[best].checkpoints[checkpoint]
          ? index
          : best,
      0,
    );
  });
  const winnerIndex = competitors.reduce(
    (best, competitor, index, all) =>
      competitor.checkpoints[3] > all[best].checkpoints[3] ? index : best,
    0,
  );
  const summaryLabels = competitors.map((competitor, index) => ({
    title: getPrototypeLabel({
      content,
      key: `competitor${index + 1}Result`,
      fallback: index === winnerIndex ? 'Gesamtsieger' : 'Stärkste Alternative',
    }),
    detail: getPrototypeLabel({
      content,
      key: `competitor${index + 1}Detail`,
      fallback:
        index === winnerIndex
          ? 'höchster Gesamtwert'
          : 'stark bei einzelnen Kriterien',
    }),
    competitor,
  }));

  return (
    <PrototypeShell
      family="COMPARISON"
      title="Benchmark Racetrack"
      subtitle="Jeder Streckenabschnitt steht für eine Metrik. Nach Tempo, Kosten und Qualität ist sichtbar, welches Modell jeweils führt und wer insgesamt vorne liegt."
    >
      <GlassSurface style={{position: 'absolute', left: 72, right: 72, top: 390, bottom: 190, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 46, right: 46, top: 65, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, opacity: track}}>
          {metrics.map((label, index) => {
            const color = ['#8757E8', '#FFB648', '#35C58A'][index];
            const reached = race >= index / 3;
            const completed = race >= (index + 1) / 3;
            const active = index === activeMetricIndex && race < 1;
            const leader = competitors[metricLeaders[index]];
            return (
              <div key={`${label}-${index}`} style={{padding: '14px 16px', borderRadius: 20, background: active ? `${color}22` : `${color}12`, border: `2px solid ${active ? color : `${color}44`}`, color, textAlign: 'center', fontSize: label.length > 16 ? 14 : 19, fontWeight: 900, letterSpacing: 2, transform: `scale(${active ? 1.04 : 1})`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                <div>{label.toLocaleUpperCase('de-DE')}</div>
                <div style={{marginTop: 5, fontSize: 11, letterSpacing: 1.1, color: completed ? PROTOTYPE_PALETTE.success : reached ? color : PROTOTYPE_PALETTE.muted}}>{completed ? `FÜHRT: ${leader.label}` : active ? 'WIRD GEMESSEN' : 'WARTET'}</div>
              </div>
            );
          })}
        </div>

        {competitors.map((competitor, index) => {
          const y = 390 + index * 300;
          const position = positionAt(race, competitor);
          const x = interpolate(position, [0, 1], [115, 822]);
          const currentCheckpointValue = competitor.checkpoints[metricCheckpointIndex];
          return (
            <React.Fragment key={`${competitor.label}-${index}`}>
              <div style={{position: 'absolute', left: 85, right: 80, top: y - 78, height: 156, borderRadius: 78, background: 'rgba(255,255,255,.58)', border: `5px solid ${competitor.color}44`, overflow: 'hidden', opacity: track}}>
                {[0, 1, 2].map((zone) => (
                  <div key={zone} style={{position: 'absolute', left: `${zone * 33.333}%`, width: '33.333%', top: 0, bottom: 0, background: zone === 0 ? 'rgba(135,87,232,.08)' : zone === 1 ? 'rgba(255,182,72,.08)' : 'rgba(53,197,138,.08)', borderRight: zone < 2 ? '3px dashed rgba(116,109,128,.18)' : undefined}} />
                ))}
                {Array.from({length: 12}, (_, marker) => (
                  <div key={marker} style={{position: 'absolute', left: 28 + marker * 63, top: '50%', width: 28, height: 5, borderRadius: 999, background: `${competitor.color}35`, transform: 'translateY(-50%)'}} />
                ))}
              </div>
              <div style={{position: 'absolute', left: 94, top: y - 128, maxWidth: 260, padding: '10px 15px', borderRadius: 15, background: 'rgba(255,255,255,.94)', border: `2px solid ${competitor.color}55`, color: competitor.color, fontSize: competitor.label.length > 16 ? 14 : 18, fontWeight: 900, letterSpacing: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{competitor.label.toLocaleUpperCase('de-DE')}</div>
              <div style={{position: 'absolute', right: 95, top: y - 128, padding: '9px 12px', borderRadius: 14, background: 'rgba(255,255,255,.94)', border: `2px solid ${competitor.color}44`, color: competitor.color, fontFamily: 'monospace', fontSize: 16, fontWeight: 900}}>{Math.round(currentCheckpointValue * 100)}</div>
              <div style={{position: 'absolute', left: x, top: y, width: 76, height: 76, borderRadius: index === 0 ? 24 : 999, background: competitor.color, border: '8px solid white', boxShadow: `0 0 38px ${competitor.color}66`, transform: 'translate(-50%, -50%)', zIndex: 7}} />
            </React.Fragment>
          );
        })}

        <div style={{position: 'absolute', left: 822, top: 250, bottom: 215, width: 14, borderRadius: 999, background: `repeating-linear-gradient(180deg, ${PROTOTYPE_PALETTE.foreground} 0 20px, white 20px 40px)`, opacity: track}} />

        <div style={{position: 'absolute', left: 85, right: 85, bottom: 52, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, opacity: finish, transform: `translateY(${(1 - finish) * 46}px)`}}>
          {summaryLabels.map(({competitor, title, detail}, index) => (
            <div key={`${competitor.label}-summary`} style={{padding: '22px 24px', borderRadius: 26, background: `${competitor.color}12`, border: `2px solid ${competitor.color}55`}}>
              <div style={{fontSize: competitor.label.length > 16 ? 14 : 19, fontWeight: 900, letterSpacing: 2, color: competitor.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{competitor.label.toLocaleUpperCase('de-DE')}</div>
              <div style={{marginTop: 10, fontSize: title.length > 22 ? 20 : 27, fontWeight: 900, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{title}</div>
              <div style={{marginTop: 7, fontSize: detail.length > 38 ? 16 : 19, color: PROTOTYPE_PALETTE.muted, fontWeight: 800, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{detail}</div>
              <div style={{marginTop: 8, color: index === winnerIndex ? competitor.color : PROTOTYPE_PALETTE.muted, fontWeight: 900}}>{index === winnerIndex ? 'FINAL VORN' : `FINAL ${Math.round(competitor.checkpoints[3] * 100)}`}</div>
            </div>
          ))}
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
