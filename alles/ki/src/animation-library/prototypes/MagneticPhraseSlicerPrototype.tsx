import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const TOKENS = [
  {label: 'Die', lane: 0},
  {label: 'KI', lane: 1},
  {label: 'versteht', lane: 2},
  {label: 'den', lane: 0},
  {label: 'Satz', lane: 1},
] as const;

export const MagneticPhraseSlicerPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const sentenceEnter = prototypeProgress(frame, 0, 24);
  const blade = prototypeProgress(frame, 28, 72);
  const separate = prototypeProgress(frame, 64, 118);
  const settle = prototypeProgress(frame, 112, 160);

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
          {TOKENS.map((token, index) => {
            const baseX = (index - 2) * 158;
            const laneY = 480 + token.lane * 170;
            const targetX = 160 + (index % 2) * 510;
            const splitX = baseX + (index - 2) * 14 * separate;
            const x = interpolate(settle, [0, 1], [540 + splitX, targetX]);
            const y = interpolate(settle, [0, 1], [200 + index * 4, laneY]);
            const rotation = interpolate(settle, [0, 1], [(index - 2) * 2, 0]);
            return (
              <div
                key={token.label}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  minWidth: 126,
                  padding: '18px 24px',
                  borderRadius: 24,
                  textAlign: 'center',
                  fontSize: 38,
                  fontWeight: 900,
                  color: index === 1 || index === 4
                    ? PROTOTYPE_PALETTE.white
                    : PROTOTYPE_PALETTE.foreground,
                  background: index === 1 || index === 4
                    ? `linear-gradient(135deg, ${PROTOTYPE_PALETTE.accent}, #6635CE)`
                    : PROTOTYPE_PALETTE.white,
                  border: '2px solid rgba(135,87,232,.2)',
                  boxShadow: index === 1 || index === 4
                    ? '0 18px 48px rgba(135,87,232,.34)'
                    : '0 14px 38px rgba(55,38,83,.11)',
                  transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${0.88 + separate * 0.12})`,
                  zIndex: 5,
                }}
              >
                {token.label}
              </div>
            );
          })}
        </div>

        {[0, 1, 2, 3].map((index) => {
          const x = 268 + index * 150;
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

        {['GRAMMATIK', 'BEDEUTUNG', 'KONTEXT'].map((label, lane) => (
          <div
            key={label}
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
              {label}
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
            fontSize: 25,
            lineHeight: 1.25,
            fontWeight: 800,
            color: PROTOTYPE_PALETTE.foreground,
            opacity: settle,
          }}
        >
          Token-Grenzen entstehen durch <span style={{color: PROTOTYPE_PALETTE.accent}}>Muster</span> — nicht durch menschliches Lesen.
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
