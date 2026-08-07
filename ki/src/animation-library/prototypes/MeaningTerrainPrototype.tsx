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

const DEFAULT_CONCEPTS = ['Hund', 'Katze', 'Tier', 'Auto', 'Zug', 'Reise'] as const;
const START_POSITIONS = [
  {x: 185, y: 380},
  {x: 390, y: 350},
  {x: 710, y: 390},
  {x: 250, y: 690},
  {x: 520, y: 720},
  {x: 790, y: 675},
] as const;
const CLUSTER_OFFSETS = [
  {x: -90, y: -85},
  {x: 90, y: -55},
  {x: 0, y: 105},
  {x: -100, y: 95},
  {x: 105, y: 90},
  {x: 0, y: -125},
] as const;

const compactText = (value: string, maximum: number): string =>
  value.length <= maximum ? value : `${value.slice(0, maximum - 1).trim()}…`;

const clusterValue = (value: string | number, fallback: number): 1 | 2 => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return parsed === 2 ? 2 : parsed === 1 ? 1 : fallback === 2 ? 2 : 1;
};

export const MeaningTerrainPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const terrain = prototypeProgress(frame, 0, 45);
  const clusterForm = prototypeProgress(frame, 30, 108);
  const labels = prototypeProgress(frame, 54, 112);
  const relation = prototypeProgress(frame, 102, 160);
  const contractTerms = content
    ? [...new Set([
        ...content.meaningContract.subjectTerms,
        ...content.meaningContract.resultTerms,
      ])].filter((term) => term.length >= 3)
    : [];
  const rawConcepts = DEFAULT_CONCEPTS.map((fallback, index) => ({
    label: getPrototypeLabel({
      content,
      key: `concept${index + 1}`,
      fallback: contractTerms[index] ?? fallback,
    }),
    cluster: clusterValue(
      getPrototypeValue({
        content,
        key: `concept${index + 1}Cluster`,
        fallback: index < 3 ? 1 : 2,
      }),
      index < 3 ? 1 : 2,
    ),
    start: START_POSITIONS[index],
  }));
  const concepts = rawConcepts.map((concept, index) => {
    const clusterMembers = rawConcepts.filter((item) => item.cluster === concept.cluster);
    const localIndex = clusterMembers.findIndex((item) => item === concept);
    const offset = CLUSTER_OFFSETS[localIndex % CLUSTER_OFFSETS.length];
    const center = concept.cluster === 1 ? {x: 285, y: 575} : {x: 690, y: 575};
    return {
      ...concept,
      index,
      targetX: center.x + offset.x,
      targetY: center.y + offset.y,
    };
  });
  const firstCluster = getPrototypeLabel({
    content,
    key: 'cluster1',
    fallback: content?.meaningContract.subjectTerms[0]
      ? `${content.meaningContract.subjectTerms[0]}-BEREICH`
      : 'TIER-BEREICH',
  });
  const secondCluster = getPrototypeLabel({
    content,
    key: 'cluster2',
    fallback: content?.meaningContract.resultTerms[0]
      ? `${content.meaningContract.resultTerms[0]}-BEREICH`
      : 'REISE-BEREICH',
  });
  const conclusion = content
    ? compactText(content.meaningContract.endState, 115)
    : 'Abstand zeigt Bedeutungsähnlichkeit — nicht geografische Nähe.';

  return (
    <PrototypeShell
      family="SEMANTIC SPACE"
      title="Meaning Terrain"
      subtitle="Begriffe starten verteilt und rücken entsprechend ihrer tatsächlichen Cluster-Zugehörigkeit zusammen. Nähe steht für Bedeutungsähnlichkeit."
    >
      <GlassSurface style={{position: 'absolute', left: 72, right: 72, top: 390, bottom: 190, overflow: 'hidden'}}>
        <svg width="936" height="1080" viewBox="0 0 936 1080" style={{position: 'absolute', inset: 0}}>
          {Array.from({length: 7}, (_, index) => {
            const y = 260 + index * 105;
            return <line key={index} x1="80" y1={y} x2="860" y2={y} stroke="rgba(135,87,232,.10)" strokeWidth={2} strokeDasharray="12 18" opacity={terrain} />;
          })}
          <ellipse cx="285" cy="575" rx="225" ry="300" fill="rgba(135,87,232,.07)" stroke={PROTOTYPE_PALETTE.accentSoft} strokeWidth={4} opacity={clusterForm} />
          <ellipse cx="690" cy="575" rx="225" ry="300" fill="rgba(53,197,138,.06)" stroke="rgba(53,197,138,.42)" strokeWidth={4} opacity={clusterForm} />
          {concepts.map((concept) => {
            const center = concept.cluster === 1 ? {x: 285, y: 575} : {x: 690, y: 575};
            return <line key={`relation-${concept.index}`} x1={center.x} y1={center.y} x2={concept.targetX} y2={concept.targetY} stroke={concept.cluster === 1 ? PROTOTYPE_PALETTE.accentSoft : PROTOTYPE_PALETTE.success} strokeWidth={3} strokeDasharray="10 12" opacity={relation * 0.48} />;
          })}
        </svg>

        {concepts.map((concept, index) => {
          const enter = prototypeProgress(frame, 10 + index * 5, 34 + index * 5);
          const x = interpolate(clusterForm, [0, 1], [concept.start.x, concept.targetX]);
          const y = interpolate(clusterForm, [0, 1], [concept.start.y, concept.targetY]);
          const color = concept.cluster === 1 ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.success;
          return (
            <div key={`${concept.label}-${index}`} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${0.72 + enter * 0.28 + relation * 0.04})`, opacity: enter, zIndex: 4}}>
              <div style={{width: 34, height: 34, borderRadius: 999, background: color, boxShadow: `0 0 28px ${concept.cluster === 1 ? 'rgba(135,87,232,.55)' : 'rgba(53,197,138,.5)'}`, margin: '0 auto 10px'}} />
              <div style={{maxWidth: 185, padding: '10px 16px', borderRadius: 16, background: 'rgba(255,255,255,.94)', border: `2px solid ${color}44`, fontSize: concept.label.length > 12 ? 16 : 22, fontWeight: 900, color: PROTOTYPE_PALETTE.foreground, opacity: labels, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{concept.label}</div>
              <div style={{marginTop: 6, textAlign: 'center', fontFamily: 'monospace', fontSize: 11, fontWeight: 900, color}}>CLUSTER {concept.cluster}</div>
            </div>
          );
        })}

        <div style={{position: 'absolute', left: 105, top: 860, width: 360, textAlign: 'center', color: PROTOTYPE_PALETTE.accent, fontSize: firstCluster.length > 18 ? 16 : 22, fontWeight: 900, letterSpacing: 2, opacity: relation, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{firstCluster.toLocaleUpperCase('de-DE')} · {concepts.filter((concept) => concept.cluster === 1).length}</div>
        <div style={{position: 'absolute', right: 80, top: 860, width: 385, textAlign: 'center', color: PROTOTYPE_PALETTE.success, fontSize: secondCluster.length > 18 ? 16 : 22, fontWeight: 900, letterSpacing: 2, opacity: relation, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{secondCluster.toLocaleUpperCase('de-DE')} · {concepts.filter((concept) => concept.cluster === 2).length}</div>
        <div style={{position: 'absolute', left: 145, right: 145, bottom: 72, padding: '22px 26px', borderRadius: 26, background: PROTOTYPE_PALETTE.foreground, color: PROTOTYPE_PALETTE.white, textAlign: 'center', fontSize: conclusion.length > 85 ? 20 : 25, lineHeight: 1.25, fontWeight: 900, opacity: relation, transform: `translateY(${(1 - relation) * 45}px)`, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{conclusion}</div>
      </GlassSurface>
    </PrototypeShell>
  );
};
