import React from 'react';
import {useCurrentFrame} from 'remotion';
import {
  getPrototypeLabel,
  getPrototypeValue,
  usePrototypeContent,
} from './PrototypeContentContext';
import {parseExplicitPercentages} from './PrototypeMeasurementGrounding';
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

const relationshipWeight = (
  value: string | number,
  fallback: number,
): number => {
  const parsed = typeof value === 'number'
    ? value
    : Number(String(value).replace(',', '.').replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(parsed)) return fallback;
  const normalized = parsed > 1 ? parsed / 100 : parsed;
  return Math.max(0, Math.min(1, normalized));
};

const qualitativeWeight = (value: number): string =>
  value >= 0.67 ? 'STARK' : value >= 0.4 ? 'MITTEL' : 'SCHWACH';

const hasRelationshipMeasurementContext = (spokenText: string): boolean =>
  /\b(?:verbunden|verbindung|beziehung|gewicht|gewichtet|attention|aufmerksamkeit)\b/i.test(
    spokenText,
  );

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
      fallback: terms[index] ?? (content ? `KNOTEN ${String.fromCharCode(65 + index)}` : island.label),
    }),
  }));
  const relationshipMeasurementContext = content
    ? hasRelationshipMeasurementContext(content.spokenText)
    : true;
  const explicitWeights = content && relationshipMeasurementContext
    ? parseExplicitPercentages(content.spokenText)
    : [];
  const weight12Exact = !content || explicitWeights[0] !== undefined;
  const weight23Exact = !content || explicitWeights[1] !== undefined;
  const weakWeightExact = !content || explicitWeights[2] !== undefined;
  const weight12 = explicitWeights[0] !== undefined
    ? explicitWeights[0] / 100
    : relationshipWeight(
        getPrototypeValue({content, key: 'weight12', fallback: 0.86}),
        0.86,
      );
  const weight23 = explicitWeights[1] !== undefined
    ? explicitWeights[1] / 100
    : relationshipWeight(
        getPrototypeValue({content, key: 'weight23', fallback: 0.72}),
        0.72,
      );
  const weakWeight = explicitWeights[2] !== undefined
    ? explicitWeights[2] / 100
    : relationshipWeight(
        getPrototypeValue({content, key: 'weakWeight', fallback: 0.18}),
        0.18,
      );
  const weight12Label = weight12Exact
    ? `${Math.round(weight12 * 100)}%`
    : qualitativeWeight(weight12);
  const weight23Label = weight23Exact
    ? `${Math.round(weight23 * 100)}%`
    : qualitativeWeight(weight23);
  const weakWeightLabel = weakWeightExact
    ? `${Math.round(weakWeight * 100)}%`
    : qualitativeWeight(weakWeight);
  const strongRelationship = getPrototypeLabel({
    content,
    key: 'strongRelationship',
    fallback: islands.map((island) => island.label).join(' → '),
  });
  const weakRelationship = getPrototypeLabel({
    content,
    key: 'weakRelationship',
    fallback: content ? 'schwächere Verbindung' : 'wird verworfen',
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
      subtitle="Beziehungen werden sichtbar gewichtet. Exakte Prozentwerte erscheinen nur, wenn der Sprechertext Prozente in einem klaren Beziehungs- oder Attention-Kontext nennt."
    >
      <GlassSurface style={{position: 'absolute', left: 72, right: 72, top: 390, bottom: 190, overflow: 'hidden'}}>
        <svg width="936" height="1080" viewBox="0 0 936 1080" style={{position: 'absolute', inset: 0}}>
          <path d="M 170 640 Q 300 330 450 410" fill="none" stroke={PROTOTYPE_PALETTE.accent} strokeWidth={7 + weight12 * 16} strokeLinecap="round" strokeDasharray={600} strokeDashoffset={600 * (1 - bridgeOne)} style={{filter: 'drop-shadow(0 0 12px rgba(135,87,232,.34))'}} />
          <path d="M 450 410 Q 610 330 755 640" fill="none" stroke={PROTOTYPE_PALETTE.accent} strokeWidth={7 + weight23 * 16} strokeLinecap="round" strokeDasharray={600} strokeDashoffset={600 * (1 - bridgeTwo)} style={{filter: 'drop-shadow(0 0 10px rgba(135,87,232,.28))'}} />
          <path d="M 170 640 Q 450 850 755 640" fill="none" stroke={PROTOTYPE_PALETTE.danger} strokeWidth={4 + weakWeight * 12} strokeLinecap="round" strokeDasharray="18 16" opacity={(1 - loadTest) * bridgeTwo * (0.45 + weakWeight)} />
        </svg>

        <div style={{position: 'absolute', left: 300, top: 430, transform: 'translate(-50%, -50%)', padding: '9px 13px', borderRadius: 14, background: 'rgba(255,255,255,.95)', border: '2px solid rgba(135,87,232,.30)', color: PROTOTYPE_PALETTE.accent, fontFamily: 'monospace', fontSize: 20, fontWeight: 900, opacity: bridgeOne, zIndex: 7}}>{weight12Label}</div>
        <div style={{position: 'absolute', left: 610, top: 425, transform: 'translate(-50%, -50%)', padding: '9px 13px', borderRadius: 14, background: 'rgba(255,255,255,.95)', border: '2px solid rgba(135,87,232,.30)', color: PROTOTYPE_PALETTE.accent, fontFamily: 'monospace', fontSize: 20, fontWeight: 900, opacity: bridgeTwo, zIndex: 7}}>{weight23Label}</div>
        <div style={{position: 'absolute', left: 462, top: 792, transform: `translate(-50%, -50%) scale(${0.92 + loadTest * 0.08})`, padding: '9px 13px', borderRadius: 14, background: 'rgba(255,255,255,.95)', border: '2px solid rgba(255,93,108,.30)', color: PROTOTYPE_PALETTE.danger, fontFamily: 'monospace', fontSize: 18, fontWeight: 900, opacity: bridgeTwo * (1 - loadTest * 0.55), zIndex: 7}}>{weakWeightLabel} {loadTest > 0.55 ? '×' : ''}</div>

        {islands.map((island, index) => (
          <div key={`${island.label}-${index}`} style={{position: 'absolute', left: island.x, top: island.y, transform: `translate(-50%, -50%) scale(${0.75 + islandsEnter * 0.25})`, opacity: islandsEnter, zIndex: 5}}>
            <div style={{width: 185, height: 118, borderRadius: '52% 48% 46% 54%', background: index === 1 ? `linear-gradient(135deg, ${PROTOTYPE_PALETTE.accent}, #6938CE)` : 'linear-gradient(135deg, #FFFFFF, #EDE7F8)', border: '3px solid rgba(135,87,232,.28)', boxShadow: index === 1 ? '0 18px 50px rgba(135,87,232,.32)' : '0 16px 42px rgba(55,38,83,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: index === 1 ? PROTOTYPE_PALETTE.white : PROTOTYPE_PALETTE.foreground, fontSize: island.label.length > 12 ? 23 : 34, fontWeight: 900, textAlign: 'center', padding: 12, boxSizing: 'border-box', overflow: 'hidden'}}>{island.label}</div>
          </div>
        ))}

        {[0.22, 0.48, 0.76].map((position, index) => {
          const pulse = prototypeProgress(frame, 82 + index * 10, 105 + index * 10) * (1 - prototypeProgress(frame, 120 + index * 5, 138 + index * 5));
          return <div key={position} style={{position: 'absolute', left: 170 + position * 585, top: 520 - Math.sin(position * Math.PI) * 150, width: 22, height: 22, borderRadius: 999, background: PROTOTYPE_PALETTE.white, border: `6px solid ${PROTOTYPE_PALETTE.accent}`, boxShadow: '0 0 26px rgba(135,87,232,.42)', opacity: pulse, transform: `translate(-50%, -50%) scale(${0.75 + pulse * 0.38})`, zIndex: 8}} />;
        })}

        <div style={{position: 'absolute', left: 85, right: 85, top: 820, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, opacity: loadTest}}>
          <div style={{padding: '22px', borderRadius: 24, background: 'rgba(53,197,138,.10)', border: '2px solid rgba(53,197,138,.35)', textAlign: 'center'}}>
            <div style={{fontSize: 19, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.success}}>STARKE BEZIEHUNG</div>
            <div style={{marginTop: 10, fontSize: strongRelationship.length > 28 ? 20 : 27, fontWeight: 900, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{strongRelationship}</div>
            <div style={{marginTop: 8, fontFamily: 'monospace', fontSize: 16, fontWeight: 900, color: PROTOTYPE_PALETTE.success}}>{weight12Label} · {weight23Label}</div>
          </div>
          <div style={{padding: '22px', borderRadius: 24, background: 'rgba(255,93,108,.08)', border: '2px solid rgba(255,93,108,.28)', textAlign: 'center'}}>
            <div style={{fontSize: 19, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.danger}}>SCHWACHE DIREKTLINIE</div>
            <div style={{marginTop: 10, fontSize: weakRelationship.length > 25 ? 20 : 27, fontWeight: 900, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{weakRelationship}</div>
            <div style={{marginTop: 8, fontFamily: 'monospace', fontSize: 16, fontWeight: 900, color: PROTOTYPE_PALETTE.danger}}>{weakWeightLabel} → {content ? 'SCHWÄCHER' : 'VERWORFEN'}</div>
          </div>
        </div>

        <div style={{position: 'absolute', left: 145, right: 145, bottom: 54, padding: '20px 26px', borderRadius: 24, background: PROTOTYPE_PALETTE.foreground, color: PROTOTYPE_PALETTE.white, textAlign: 'center', fontSize: conclusion.length > 85 ? 19 : 24, fontWeight: 900, opacity: result, transform: `translateY(${(1 - result) * 40}px)`, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{conclusion}</div>
      </GlassSurface>
    </PrototypeShell>
  );
};
