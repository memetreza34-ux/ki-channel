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
  const separate = prototypeProgress(frame, 64, 112);
  const settle = prototypeProgress(frame, 104, 154);
  const resolve = prototypeProgress(frame, 146, 176);
  const contentWords = content?.spokenText
    ? visibleWords(content.spokenText)
    : [];
  const tokenLabels = contentWords.length >= 3
    ? contentWords.slice(0, 5)
    : [...DEFAULT_TOKENS];
  const laneLabels = [
    getPrototypeLabel({content, key: 'lanePrimary', fallback: 'AUSGANGSTEXT'}),
    getPrototypeLabel({content, key: 'laneMeaning', fallback: 'TOKEN-FOLGE'}),
    getPrototypeLabel({content, key: 'laneContext', fallback: 'WEITERVERARBEITUNG'}),
  ];
  const conclusion = content
    ? content.meaningContract.endState
    : 'Die Token-Reihenfolge bleibt erhalten und kann anschließend numerisch verarbeitet werden.';
  const centerIndex = (tokenLabels.length - 1) / 2;
  const startGap = tokenLabels.length >= 5 ? 150 : 175;
  const startPositions = tokenLabels.map((_, index) =>
    458 + (index - centerIndex) * startGap,
  );
  const finalGap = tokenLabels.length > 1
    ? Math.min(165, 650 / (tokenLabels.length - 1))
    : 0;
  const finalPositions = tokenLabels.map((_, index) =>
    458 + (index - centerIndex) * finalGap,
  );

  return (
    <PrototypeShell
      family="TOKENIZATION"
      title="Magnetic Phrase Slicer"
      subtitle="Ein zusammenhängender Satz erhält sichtbare Grenzen und wird in derselben Reihenfolge in einzelne Tokens zerlegt."
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
        {[0, 1, 2].map((lane) => {
          const top = [100, 505, 925][lane];
          const height = [290, 300, 220][lane];
          const show = lane === 0 ? sentenceEnter : lane === 1 ? settle : resolve;
          return (
            <div
              key={laneLabels[lane]}
              style={{
                position: 'absolute',
                left: 58,
                right: 58,
                top,
                height,
                borderRadius: 28,
                border: `2px ${lane === 1 ? 'solid' : 'dashed'} ${lane === 1 ? PROTOTYPE_PALETTE.accentSoft : PROTOTYPE_PALETTE.line}`,
                background: lane === 1 ? 'rgba(135,87,232,.055)' : 'rgba(255,255,255,.44)',
                opacity: show,
                transform: `translateY(${(1 - show) * (lane === 0 ? -35 : 35)}px)`,
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
                {laneLabels[lane].toLocaleUpperCase('de-DE')}
              </div>
            </div>
          );
        })}

        <div
          style={{
            position: 'absolute',
            left: 96,
            right: 96,
            top: 190,
            height: 150,
            borderRadius: 30,
            background: 'linear-gradient(135deg, #FFFFFF, #F1EBFF)',
            border: '2px solid rgba(135,87,232,.18)',
            boxShadow: '0 20px 55px rgba(53,35,85,.10)',
            opacity: sentenceEnter * (1 - settle * 0.72),
            transform: `scale(${0.94 + sentenceEnter * 0.06})`,
          }}
        />

        <svg width="924" height="1260" viewBox="0 0 924 1260" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
          {finalPositions.slice(0, -1).map((x, index) => {
            const nextX = finalPositions[index + 1];
            return (
              <line
                key={`order-${index}`}
                x1={x + 58}
                y1="690"
                x2={nextX - 58}
                y2="690"
                stroke={PROTOTYPE_PALETTE.accentSoft}
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray="220"
                strokeDashoffset={220 * (1 - settle)}
                opacity={settle * 0.9}
              />
            );
          })}
        </svg>

        {tokenLabels.map((label, index) => {
          const startX = startPositions[index];
          const separatedX = startX + (index - centerIndex) * 18 * separate;
          const targetX = finalPositions[index];
          const x = interpolate(settle, [0, 1], [separatedX, targetX]);
          const y = interpolate(settle, [0, 1], [265, 690]);
          const highlighted = index === 1 || index === tokenLabels.length - 1;
          const localReveal = prototypeProgress(frame, 4 + index * 4, 18 + index * 4);
          return (
            <div
              key={`${label}-${index}`}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                minWidth: 118,
                maxWidth: 190,
                padding: '17px 20px',
                borderRadius: 22,
                textAlign: 'center',
                fontSize: label.length > 11 ? 25 : 34,
                fontWeight: 900,
                color: highlighted
                  ? PROTOTYPE_PALETTE.white
                  : PROTOTYPE_PALETTE.foreground,
                background: highlighted
                  ? `linear-gradient(135deg, ${PROTOTYPE_PALETTE.accent}, #6635CE)`
                  : PROTOTYPE_PALETTE.white,
                border: '2px solid rgba(135,87,232,.2)',
                boxShadow: highlighted
                  ? '0 16px 42px rgba(135,87,232,.30)'
                  : '0 12px 34px rgba(55,38,83,.10)',
                transform: `translate(-50%, -50%) scale(${0.88 + localReveal * 0.12 + separate * 0.04})`,
                opacity: localReveal,
                zIndex: 5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
              <div
                style={{
                  marginTop: 7,
                  fontSize: 13,
                  letterSpacing: 1.5,
                  fontWeight: 900,
                  opacity: settle,
                  color: highlighted ? 'rgba(255,255,255,.78)' : PROTOTYPE_PALETTE.muted,
                }}
              >
                TOKEN {index + 1}
              </div>
            </div>
          );
        })}

        {startPositions.slice(0, -1).map((left, index) => {
          const right = startPositions[index + 1];
          const x = (left + right) / 2;
          const localBlade = Math.max(0, Math.min(1, (blade - index * 0.08) / 0.72));
          return (
            <div
              key={`cut-${index}`}
              style={{
                position: 'absolute',
                left: x,
                top: 182 + localBlade * 170,
                width: 7,
                height: 118,
                borderRadius: 999,
                background: `linear-gradient(180deg, transparent, ${PROTOTYPE_PALETTE.accent}, white, ${PROTOTYPE_PALETTE.accent}, transparent)`,
                boxShadow: '0 0 24px rgba(135,87,232,.55)',
                opacity: localBlade * (1 - settle),
                transform: 'translate(-50%, -50%)',
                zIndex: 8,
              }}
            />
          );
        })}

        <div
          style={{
            position: 'absolute',
            left: 130,
            right: 130,
            top: 985,
            padding: '24px 28px',
            borderRadius: 26,
            background: PROTOTYPE_PALETTE.foreground,
            color: PROTOTYPE_PALETTE.white,
            textAlign: 'center',
            opacity: resolve,
            transform: `translateY(${(1 - resolve) * 48}px)`,
          }}
        >
          <div style={{fontSize: 17, fontWeight: 900, letterSpacing: 2.5, color: PROTOTYPE_PALETTE.accentSoft}}>
            REIHENFOLGE BLEIBT ERHALTEN
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: conclusion.length > 85 ? 19 : 24,
              lineHeight: 1.25,
              fontWeight: 850,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {conclusion}
          </div>
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
