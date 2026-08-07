import React from 'react';
import {useCurrentFrame} from 'remotion';
import {
  getPrototypeLabel,
  usePrototypeContent,
} from './PrototypeContentContext';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const DEFAULT_CONCEPTS = [
  {label: 'Hund', x: 240, y: 540, height: 115},
  {label: 'Katze', x: 350, y: 500, height: 102},
  {label: 'Tier', x: 300, y: 690, height: 72},
  {label: 'Auto', x: 690, y: 470, height: 108},
  {label: 'Zug', x: 770, y: 610, height: 94},
  {label: 'Reise', x: 650, y: 720, height: 68},
] as const;

const compactText = (value: string, maximum: number): string =>
  value.length <= maximum ? value : `${value.slice(0, maximum - 1).trim()}…`;

export const MeaningTerrainPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const rise = prototypeProgress(frame, 0, 72);
  const labels = prototypeProgress(frame, 54, 112);
  const relation = prototypeProgress(frame, 102, 160);
  const contractTerms = content
    ? [...new Set([
        ...content.meaningContract.subjectTerms,
        ...content.meaningContract.resultTerms,
      ])].filter((term) => term.length >= 3)
    : [];
  const concepts = DEFAULT_CONCEPTS.map((concept, index) => ({
    ...concept,
    label: getPrototypeLabel({
      content,
      key: `concept${index + 1}`,
      fallback: contractTerms[index] ?? concept.label,
    }),
  }));
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
      subtitle="Ähnliche Begriffe liegen auf derselben Bedeutungslandschaft näher zusammen."
    >
      <GlassSurface style={{position: 'absolute', left: 72, right: 72, top: 390, bottom: 190, overflow: 'hidden'}}>
        <svg width="936" height="1080" viewBox="0 0 936 1080" style={{position: 'absolute', inset: 0}}>
          {Array.from({length: 7}, (_, index) => {
            const y = 260 + index * 105;
            const wave = 18 + index * 5;
            return <path key={index} d={`M 80 ${y} C 210 ${y - wave}, 350 ${y + wave}, 470 ${y} S 720 ${y - wave}, 860 ${y + wave / 2}`} fill="none" stroke="rgba(135,87,232,.16)" strokeWidth={3} strokeDasharray={1200} strokeDashoffset={1200 * (1 - rise)} />;
          })}
          <path d="M 95 760 C 220 420, 380 420, 480 760 C 565 405, 730 390, 850 760" fill="rgba(135,87,232,.10)" stroke={PROTOTYPE_PALETTE.accentSoft} strokeWidth={4} opacity={rise} />
        </svg>

        {concepts.map((concept, index) => {
          const enter = prototypeProgress(frame, 18 + index * 5, 48 + index * 5);
          const lift = concept.height * rise;
          return (
            <div key={`${concept.label}-${index}`} style={{position: 'absolute', left: concept.x, top: concept.y - lift, transform: `translate(-50%, -50%) scale(${0.72 + enter * 0.28})`, opacity: enter, zIndex: 4}}>
              <div style={{width: 34, height: 34, borderRadius: 999, background: index < 3 ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.success, boxShadow: `0 0 28px ${index < 3 ? 'rgba(135,87,232,.55)' : 'rgba(53,197,138,.5)'}`, margin: '0 auto 10px'}} />
              <div style={{maxWidth: 185, padding: '10px 16px', borderRadius: 16, background: 'rgba(255,255,255,.92)', border: '1px solid rgba(135,87,232,.18)', fontSize: concept.label.length > 12 ? 16 : 22, fontWeight: 900, color: PROTOTYPE_PALETTE.foreground, opacity: labels, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{concept.label}</div>
            </div>
          );
        })}

        <div style={{position: 'absolute', left: 135, top: 830, width: 290, textAlign: 'center', color: PROTOTYPE_PALETTE.accent, fontSize: firstCluster.length > 18 ? 16 : 22, fontWeight: 900, letterSpacing: 2, opacity: relation, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{firstCluster.toLocaleUpperCase('de-DE')}</div>
        <div style={{position: 'absolute', right: 110, top: 830, width: 310, textAlign: 'center', color: PROTOTYPE_PALETTE.success, fontSize: secondCluster.length > 18 ? 16 : 22, fontWeight: 900, letterSpacing: 2, opacity: relation, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{secondCluster.toLocaleUpperCase('de-DE')}</div>
        <div style={{position: 'absolute', left: 145, right: 145, bottom: 72, padding: '22px 26px', borderRadius: 26, background: PROTOTYPE_PALETTE.foreground, color: PROTOTYPE_PALETTE.white, textAlign: 'center', fontSize: conclusion.length > 85 ? 20 : 25, lineHeight: 1.25, fontWeight: 900, opacity: relation, transform: `translateY(${(1 - relation) * 45}px)`, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{conclusion}</div>
      </GlassSurface>
    </PrototypeShell>
  );
};
