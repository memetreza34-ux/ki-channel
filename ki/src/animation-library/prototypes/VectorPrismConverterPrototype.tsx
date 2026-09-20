import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {staggerDelay} from '../../motion/easing';
import {
  getPrototypeLabel,
  getPrototypeValue,
  usePrototypeContent,
} from './PrototypeContentContext';
import {parseExplicitVectorTriplet} from './PrototypeMeasurementGrounding';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const COLORS = ['#8757E8', '#35C58A', '#FFB648'] as const;
const SYMBOLS = ['d₁', 'd₂', 'd₃'] as const;
const compactText = (value: string, maximum: number): string =>
  value.length <= maximum ? value : `${value.slice(0, maximum - 1).trim()}…`;

export const VectorPrismConverterPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const input = prototypeProgress(frame, 0, 35);
  const prismCharge = prototypeProgress(frame, 28, 72);
  const refract = prototypeProgress(frame, 66, 124);
  const result = prototypeProgress(frame, 118, 165);
  const inputLabel = getPrototypeLabel({
    content,
    key: 'input',
    fallback: content?.meaningContract.subjectTerms[0] ?? 'KI',
  });
  const explicitVector = content
    ? parseExplicitVectorTriplet(content.spokenText)
    : null;
  const vectorExact = !content || explicitVector !== null;
  const dimensions = [
    {
      label: getPrototypeLabel({content, key: 'dimension1', fallback: 'Bedeutung'}),
      value: explicitVector?.[0] ?? getPrototypeValue({content, key: 'vector1', fallback: '0.82'}),
      color: COLORS[0],
    },
    {
      label: getPrototypeLabel({content, key: 'dimension2', fallback: 'Kontext'}),
      value: explicitVector?.[1] ?? getPrototypeValue({content, key: 'vector2', fallback: '−0.31'}),
      color: COLORS[1],
    },
    {
      label: getPrototypeLabel({content, key: 'dimension3', fallback: 'Ton'}),
      value: explicitVector?.[2] ?? getPrototypeValue({content, key: 'vector3', fallback: '0.47'}),
      color: COLORS[2],
    },
  ];
  const vectorLabel = getPrototypeLabel({
    content,
    key: 'vectorLabel',
    fallback: 'VEKTOR',
  });
  const dimensionReveals = dimensions.map((_, index) =>
    prototypeProgress(frame, 72 + staggerDelay(index, 10), 112 + staggerDelay(index, 10)),
  );
  const vectorOutput = vectorExact
    ? `[${dimensions
        .map((dimension, index) =>
          dimensionReveals[index] > 0.55 ? dimension.value : '·',
        )
        .join(', ')}]`
    : `[${SYMBOLS
        .map((symbol, index) =>
          dimensionReveals[index] > 0.55 ? symbol : '·',
        )
        .join(', ')}]`;
  const explanation = content
    ? compactText(content.meaningContract.endState, 105)
    : 'Ein Begriff wird nicht als Wort gespeichert, sondern als Zahlenmuster.';

  return (
    <PrototypeShell
      family="DATA TRANSFORMATION"
      title="Vector Prism Converter"
      subtitle="Der lesbare Begriff wird sichtbar in mehrere numerische Dimensionen zerlegt und anschließend als Vektor zusammengesetzt. Konkrete Dezimalwerte erscheinen nur bei einem explizit genannten Vektor."
    >
      <GlassSurface style={{position: 'absolute', left: 74, right: 74, top: 390, bottom: 190, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 62, right: 62, top: 62, display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', alignItems: 'center', gap: 16, fontSize: 16, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.muted, opacity: input}}>
          <div style={{textAlign: 'center'}}>WORT</div>
          <div style={{color: PROTOTYPE_PALETTE.accent}}>→</div>
          <div style={{textAlign: 'center'}}>DIMENSIONEN</div>
          <div style={{color: PROTOTYPE_PALETTE.accent}}>→</div>
          <div style={{textAlign: 'center'}}>VEKTOR</div>
        </div>

        <div style={{position: 'absolute', left: 88, top: 470, width: 240, height: 116, borderRadius: 28, background: 'linear-gradient(135deg, #FFFFFF, #EEE6FF)', border: '2px solid rgba(135,87,232,.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: inputLabel.length > 12 ? 28 : 42, fontWeight: 900, color: PROTOTYPE_PALETTE.foreground, boxShadow: '0 18px 48px rgba(55,38,83,.12)', opacity: input * (1 - result * 0.25), transform: `translateX(${(1 - input) * -120}px) scale(${0.88 + input * 0.12 - refract * 0.04})`, padding: 14, boxSizing: 'border-box', textAlign: 'center', overflow: 'hidden'}}>
          <div style={{fontSize: 13, letterSpacing: 2, color: PROTOTYPE_PALETTE.muted, marginBottom: 7}}>LESBARER INPUT</div>
          <div>„{compactText(inputLabel, 20)}“</div>
        </div>

        <svg width="932" height="1050" viewBox="0 0 932 1050" style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="prism-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="1" stopColor="#C6A8FF" stopOpacity="0.32" />
            </linearGradient>
          </defs>
          <path d="M 400 300 L 625 520 L 400 740 Z" fill="url(#prism-fill)" stroke={PROTOTYPE_PALETTE.accent} strokeWidth={6} opacity={prismCharge} style={{filter: 'drop-shadow(0 0 24px rgba(135,87,232,.34))'}} />
          <line x1="328" y1="528" x2="455" y2="528" stroke={PROTOTYPE_PALETTE.accent} strokeWidth={12} strokeLinecap="round" strokeDasharray={170} strokeDashoffset={170 * (1 - prismCharge)} opacity={prismCharge} />
          {dimensions.map((dimension, index) => {
            const targetY = 280 + index * 245;
            const reveal = dimensionReveals[index];
            const particle = Math.max(0, Math.min(1, (reveal - 0.18) / 0.72));
            const particleX = interpolate(particle, [0, 1], [572, 850]);
            const particleY = interpolate(particle, [0, 1], [520, targetY]);
            return (
              <React.Fragment key={`${dimension.label}-${index}`}>
                <line x1="572" y1="520" x2="850" y2={targetY} stroke={dimension.color} strokeWidth={10 - index} strokeLinecap="round" strokeDasharray={430} strokeDashoffset={430 * (1 - reveal)} opacity={reveal} style={{filter: `drop-shadow(0 0 12px ${dimension.color}77)`}} />
                <circle cx={particleX} cy={particleY} r={11 + reveal * 4} fill={dimension.color} opacity={reveal} style={{filter: `drop-shadow(0 0 9px ${dimension.color})`}} />
              </React.Fragment>
            );
          })}
        </svg>

        <div style={{position: 'absolute', left: 405, top: 760, width: 190, padding: '12px 14px', borderRadius: 18, background: 'rgba(135,87,232,.08)', border: '1px solid rgba(135,87,232,.18)', textAlign: 'center', opacity: prismCharge, fontSize: 15, fontWeight: 900, letterSpacing: 1.5, color: PROTOTYPE_PALETTE.accent}}>
          ZERLEGT MERKMALE
        </div>

        {dimensions.map((dimension, index) => {
          const reveal = dimensionReveals[index];
          const y = 246 + index * 245;
          return (
            <div key={`${dimension.label}-${index}`} style={{position: 'absolute', right: 50, top: y, width: 250, minHeight: 130, padding: '22px 24px', borderRadius: 26, background: 'rgba(255,255,255,.9)', border: `2px solid ${dimension.color}55`, boxShadow: `0 18px 50px ${dimension.color}22`, opacity: reveal, transform: `translateX(${(1 - reveal) * 110}px) scale(${0.9 + reveal * 0.1})`}}>
              <div style={{fontSize: dimension.label.length > 12 ? 15 : 19, fontWeight: 900, letterSpacing: 2.5, color: dimension.color, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{dimension.label.toLocaleUpperCase('de-DE')}</div>
              <div style={{marginTop: 12, fontFamily: 'monospace', fontSize: vectorExact ? 38 : 32, fontWeight: 900, color: PROTOTYPE_PALETTE.foreground}}>{vectorExact ? dimension.value : SYMBOLS[index]}</div>
              <div style={{marginTop: 8, fontSize: 13, color: PROTOTYPE_PALETTE.muted, fontWeight: 800}}>{vectorExact ? 'expliziter Vektorwert' : 'relative numerische Dimension'}</div>
            </div>
          );
        })}

        <div style={{position: 'absolute', left: 96, right: 96, bottom: 82, padding: '24px 30px', borderRadius: 28, background: `linear-gradient(135deg, ${PROTOTYPE_PALETTE.foreground}, #302746)`, color: PROTOTYPE_PALETTE.white, textAlign: 'center', opacity: result, transform: `translateY(${(1 - result) * 60}px)`}}>
          <div style={{fontSize: 22, fontWeight: 900, letterSpacing: 3, color: PROTOTYPE_PALETTE.accentSoft}}>{vectorLabel.toLocaleUpperCase('de-DE')}</div>
          <div style={{marginTop: 12, fontFamily: 'monospace', fontSize: vectorOutput.length > 25 ? 27 : 36, fontWeight: 900}}>{vectorOutput}</div>
          {!vectorExact ? (
            <div style={{marginTop: 8, fontSize: 13, fontWeight: 800, color: PROTOTYPE_PALETTE.accentSoft}}>SCHEMATISCH · KEINE DEZIMALWERTE GENANNT</div>
          ) : null}
        </div>

        <div style={{position: 'absolute', left: 340, top: 805, width: 260, textAlign: 'center', fontSize: content ? 18 : 21, lineHeight: 1.3, fontWeight: 800, color: PROTOTYPE_PALETTE.muted, opacity: refract, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{explanation}</div>
      </GlassSurface>
    </PrototypeShell>
  );
};
