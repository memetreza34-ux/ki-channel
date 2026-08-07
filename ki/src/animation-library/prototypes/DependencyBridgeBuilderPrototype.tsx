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

const DEFAULT_ISLANDS = [
  {label: 'KI', x: 170, y: 640},
  {label: 'liest', x: 450, y: 410},
  {label: 'Text', x: 755, y: 640},
] as const;

const compactText = (value: string, maximum: number): string =>
  value.length <= maximum ? value : `${value.slice(0, maximum - 1).trim()}…`;

export const DependencyBridgeBuilderPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const islandsEnter = prototypeProgress(frame, 0, 30);
  const bridgeOne = prototypeProgress(frame, 24, 78);
  const bridgeTwo = prototypeProgress(frame, 58, 112);
  const loadTest = prototypeProgress(frame, 102, 145);
  const result = prototypeProgress(frame, 136, 172);
  const terms = content
    ? [...new Set([
        ...content.meaningContract.subjectTerms,
        ...content.meaningContract.actionTerms,
        ...content.meaningContract.resultTerms,
      ])]
    : [];
  const islands = DEFAULT_ISLANDS.map((island, index) => ({
    ...island,
    label: getPrototypeLabel({
      content,
      key: `node${index + 1}`,
      fallback: terms[index] ?? island.label,
    }),
  }));
  const strongRelationship = getPrototypeLabel({
    content,
    key: 'strongRelationship',
    fallback: islands.map((island) => island.label).join(' → '),
  });
  const weakRelationship = getPrototypeLabel({
    content,
    key: 'weakRelationship',
    fallback: 'wird verworfen',
  });
  const conclusion = getPrototypeLabel({
    content,
    key: 'conclusion',
    fallback: content
      ? compactText(content.meaningContract.endState, 105)
      : 'Gewichtete Verbindungen bestimmen den Kontext.',
  });

  return (
    <PrototypeShell
      family="RELATIONSHIP NETWORK"
      title="Dependency Bridge Builder"
      subtitle="Starke Wortbeziehungen tragen stabile Brücken, schwache Verbindungen lösen sich wieder."
    >
      <GlassSurface style={{position: 'absolute', left: 72, right: 72, top: 390, bottom: 190, overflow: 'hidden'}}>
        <svg width="936" height="1080" viewBox="0 0 936 1080" style={{position: 'absolute', inset: 0}}>
          <path d="M 170 640 Q 300 330 450 410" fill="none" stroke={PROTOTYPE_PALETTE.accent} strokeWidth={18} strokeLinecap="round" strokeDasharray={600} strokeDashoffset={600 * (1 - bridgeOne)} style={{filter: 'drop-shadow(0 0 12px rgba(135,87,232,.34))'}} />
          <path d="M 450 410 Q 610 330 755 640" fill="none" stroke={PROTOTYPE_PALETTE.accent} strokeWidth={14} strokeLinecap="round" strokeDasharray={600} strokeDashoffset={600 * (1 - bridgeTwo)} />
          <path d="M 170 640 Q 450 850 755 640" fill="none" stroke={PROTOTYPE_PALETTE.accentSoft} strokeWidth={7} strokeLinecap="round" strokeDasharray="18 16" opacity={(1 - loadTest) * bridgeTwo} />
        </svg>

        {islands.map((island, index) => (
          <div key={`${island.label}-${index}`} style={{position: 'absolute', left: island.x, top: island.y, transform: `translate(-50%, -50%) scale(${0.75 + islandsEnter * 0.25})`, opacity: islandsEnter, zIndex: 5}}>
            <div style={{width: 185, height: 118, borderRadius: '52% 48% 46% 54%', background: index === 1 ? `linear-gradient(135deg, ${PROTOTYPE_PALETTE.accent}, #6938CE)` : 'linear-gradient(135deg, #FFFFFF, #EDE7F8)', border: '3px solid rgba(135,87,232,.28)', boxShadow: index === 1 ? '0 18px 50px rgba(135,87,232,.32)' : '0 16px 42px rgba(55,38,83,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: index === 1 ? PROTOTYPE_PALETTE.white : PROTOTYPE_PALETTE.foreground, fontSize: island.label.length > 12 ? 23 : 34, fontWeight: 900, textAlign: 'center', padding: 12, boxSizing: 'border-box', overflow: 'hidden'}}>{island.label}</div>
          </div>
        ))}

        {[0.22, 0.48, 0.76].map((position, index) => {
          const pulse = prototypeProgress(frame, 82 + index * 10, 105 + index * 10) * (1 - prototypeProgress(frame, 120 + index * 5, 138 + index * 5));
          return <div key={position} style={{position: 'absolute', left: 170 + position * 585, top: 520 - Math.sin(position * Math.PI) * 150, width: 24, height: 24, borderRadius: 999, background: PROTOTYPE_PALETTE.white, border: `7px solid ${PROTOTYPE_PALETTE.accent}`, boxShadow: '0 0 30px rgba(135,87,232,.48)', opacity: pulse, transform: `translate(-50%, -50%) scale(${0.75 + pulse * 0.45})`, zIndex: 8}} />;
        })}

        <div style={{position: 'absolute', left: 85, right: 85, top: 820, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, opacity: loadTest}}>
          <div style={{padding: '22px', borderRadius: 24, background: 'rgba(53,197,138,.10)', border: '2px solid rgba(53,197,138,.35)', textAlign: 'center'}}>
            <div style={{fontSize: 19, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.success}}>STARKE BEZIEHUNG</div>
            <div style={{marginTop: 10, fontSize: strongRelationship.length > 28 ? 20 : 27, fontWeight: 900, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{strongRelationship}</div>
          </div>
          <div style={{padding: '22px', borderRadius: 24, background: 'rgba(255,93,108,.08)', border: '2px solid rgba(255,93,108,.28)', textAlign: 'center'}}>
            <div style={{fontSize: 19, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.danger}}>SCHWACHE DIREKTLINIE</div>
            <div style={{marginTop: 10, fontSize: weakRelationship.length > 25 ? 20 : 27, fontWeight: 900, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{weakRelationship}</div>
          </div>
        </div>

        <div style={{position: 'absolute', left: 145, right: 145, bottom: 54, padding: '20px 26px', borderRadius: 24, background: PROTOTYPE_PALETTE.foreground, color: PROTOTYPE_PALETTE.white, textAlign: 'center', fontSize: conclusion.length > 85 ? 19 : 24, fontWeight: 900, opacity: result, transform: `translateY(${(1 - result) * 40}px)`, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{conclusion}</div>
      </GlassSurface>
    </PrototypeShell>
  );
};
