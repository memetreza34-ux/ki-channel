import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
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

const DEFAULT_TOKENS = ['Die', 'KI', 'versteht', 'den', 'Satz'] as const;

const visibleWords = (spokenText: string): string[] => {
  const words = spokenText.match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/gu) ?? [];
  if (words.length <= 5) return words;
  const first = words.slice(0, 4);
  const finalMeaningful = [...words]
    .reverse()
    .find((word) => word.length >= 4 && !first.includes(word));
  return finalMeaningful ? [...first, finalMeaningful] : words.slice(0, 5);
};

export const MagneticPhraseSlicerPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const sentenceEnter = prototypeProgress(frame, 0, 24);
  const blade = prototypeProgress(frame, 28, 72);
  const separate = prototypeProgress(frame, 64, 118);
  const settle = prototypeProgress(frame, 112, 160);
  const contentWords = content?.spokenText
    ? visibleWords(content.spokenText)
    : [];
  const tokenLabels = contentWords.length >= 3
    ? contentWords.slice(0, 5)
    : [...DEFAULT_TOKENS];
  const tokens = tokenLabels.map((label, index) => ({
    label,
    lane: index % 3,
  }));
  const laneLabels = [
    getPrototypeLabel({content, key: 'lanePrimary', fallback: 'SPRACHTEIL'}),
    getPrototypeLabel({content, key: 'laneMeaning', fallback: 'BEDEUTUNG'}),
    getPrototypeLabel({content, key: 'laneContext', fallback: 'KONTEXT'}),
  ];
  const conclusion = content
    ? content.meaningContract.endState
    : 'Token-Grenzen entstehen durch Muster — nicht durch menschliches Lesen.';

  return (
    <PrototypeShell
      family="TOKENIZATION"
      title="Magnetic Phrase Slicer"
      subtitle="Ein ganzer Satz wird sichtbar in wiederverwendbare Sprachbausteine zerlegt."
    >
      <GlassSurface
        style={{
          position: 'absolute',
          left: 78,
          right: 78,
          top: 390,
          bottom: 190,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 60,
            right: 60,
            top: 110,
            height: 180,
            borderRadius: 34,
            background: 'linear-gradient(135deg, #FFFFFF, #F1EBFF)',
            border: '2px solid rgba(135,87,232,.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            opacity: sentenceEnter,
            transform: `translateY(${(1 - sentenceEnter) * 70}px) scale(${0.92 + sentenceEnter * 0.08})`,
            boxShadow: '0 22px 65px rgba(53,35,85,.12)',
          }}
        >
          {tokens.map((token, index) => {
            const centerIndex = (tokens.length - 1) / 2;
            const baseX = (index - centerIndex) * 158;
            const laneY = 480 + token.lane * 170;
            const targetX = 160 + (index % 2) * 510;
            const splitX = baseX + (index - centerIndex) * 14 * separate;
            const x = interpolate(settle, [0, 1], [540 + splitX, targetX]);
            const y = interpolate(settle, [0, 1], [200 + index * 4, laneY]);
            const rotation = interpolate(settle, [0, 1], [(index - centerIndex) * 2, 0]);
            const highlighted = index === 1 || index === tokens.length - 1;
            return (
              <div
                key={`${token.label}-${index}`}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  minWidth: 126,
                  maxWidth: 235,
                  padding: '18px 24px',
                  borderRadius: 24,
                  textAlign: 'center',
                  fontSize: token.label.length > 11 ? 27 : 38,
                  fontWeight: 900,
                  color: highlighted
                    ? PROTOTYPE_PALETTE.white
                    : PROTOTYPE_PALETTE.foreground,
                  background: highlighted
                    ? `linear-gradient(135deg, ${PROTOTYPE_PALETTE.accent}, #6635CE)`
                    : PROTOTYPE_PALETTE.white,
                  border: '2px solid rgba(135,87,232,.2)',
                  boxShadow: highlighted
                    ? '0 18px 48px rgba(135,87,232,.34)'
                    : '0 14px 38px rgba(55,38,83,.11)',
                  transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${0.88 + separate * 0.12})`,
                  zIndex: 5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {token.label}
              </div>
            );
          })}
        </div>

        {Array.from({length: Math.max(2, tokens.length - 1)}, (_, index) => {
          const x = 268 + index * (600 / Math.max(1, tokens.length - 1));
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: x,
                top: 115,
                width: 8,
                height: 170,
                borderRadius: 999,
                background: `linear-gradient(180deg, transparent, ${PROTOTYPE_PALETTE.accent}, white, ${PROTOTYPE_PALETTE.accent}, transparent)`,
                boxShadow: '0 0 28px rgba(135,87,232,.58)',
                opacity: blade,
                transform: `translateY(${interpolate(blade, [0, 1], [-220, 220])}px)`,
                zIndex: 8,
              }}
            />
          );
        })}

        {laneLabels.map((label, lane) => (
          <div
            key={`${label}-${lane}`}
            style={{
              position: 'absolute',
              left: 68,
              right: 68,
              top: 405 + lane * 170,
              height: 118,
              borderRadius: 28,
              border: `2px dashed ${lane === 1 ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.line}`,
              background: lane === 1 ? 'rgba(135,87,232,.06)' : 'rgba(255,255,255,.48)',
              opacity: settle,
              transform: `translateX(${(1 - settle) * (lane % 2 === 0 ? -80 : 80)}px)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 22,
                top: 18,
                fontSize: 17,
                fontWeight: 900,
                letterSpacing: 3,
                color: lane === 1 ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.muted,
              }}
            >
              {label.toLocaleUpperCase('de-DE')}
            </div>
          </div>
        ))}

        <div
          style={{
            position: 'absolute',
            left: 110,
            right: 110,
            bottom: 70,
            textAlign: 'center',
            fontSize: content ? 21 : 25,
            lineHeight: 1.25,
            fontWeight: 800,
            color: PROTOTYPE_PALETTE.foreground,
            opacity: settle,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {conclusion}
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
