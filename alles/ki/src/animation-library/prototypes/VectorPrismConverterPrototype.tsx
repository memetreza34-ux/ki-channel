import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const DIMENSIONS = [
  {label: 'Bedeutung', value: '0.82', color: '#8757E8'},
  {label: 'Kontext', value: '−0.31', color: '#35C58A'},
  {label: 'Ton', value: '0.47', color: '#FFB648'},
] as const;

export const VectorPrismConverterPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const input = prototypeProgress(frame, 0, 35);
  const prismCharge = prototypeProgress(frame, 28, 72);
  const refract = prototypeProgress(frame, 66, 124);
  const result = prototypeProgress(frame, 118, 165);

  return (
    <PrototypeShell
      family="DATA TRANSFORMATION"
      title="Vector Prism Converter"
      subtitle="Lesbare Begriffe werden in mehrere numerische Dimensionen aufgeteilt."
    >
      <GlassSurface
        style={{
          position: 'absolute',
          left: 74,
          right: 74,
          top: 390,
          bottom: 190,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 88,
            top: 470,
            width: 240,
            height: 116,
            borderRadius: 28,
            background: 'linear-gradient(135deg, #FFFFFF, #EEE6FF)',
            border: '2px solid rgba(135,87,232,.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 42,
            fontWeight: 900,
            color: PROTOTYPE_PALETTE.foreground,
            boxShadow: '0 18px 48px rgba(55,38,83,.12)',
            opacity: input,
            transform: `translateX(${(1 - input) * -120}px) scale(${0.88 + input * 0.12})`,
          }}
        >
          „KI“
        </div>

        <svg
          width="932"
          height="1050"
          viewBox="0 0 932 1050"
          style={{position: 'absolute', inset: 0}}
        >
          <defs>
            <linearGradient id="prism-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="1" stopColor="#C6A8FF" stopOpacity="0.32" />
            </linearGradient>
          </defs>
          <path
            d="M 400 300 L 625 520 L 400 740 Z"
            fill="url(#prism-fill)"
            stroke={PROTOTYPE_PALETTE.accent}
            strokeWidth={6}
            opacity={prismCharge}
            style={{filter: 'drop-shadow(0 0 24px rgba(135,87,232,.34))'}}
          />
          <line
            x1="328"
            y1="528"
            x2="455"
            y2="528"
            stroke={PROTOTYPE_PALETTE.accent}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={170}
            strokeDashoffset={170 * (1 - prismCharge)}
            opacity={prismCharge}
          />
          {DIMENSIONS.map((dimension, index) => {
            const targetY = 280 + index * 245;
            const reveal = prototypeProgress(frame, 72 + index * 8, 112 + index * 8);
            return (
              <line
                key={dimension.label}
                x1="572"
                y1="520"
                x2="850"
                y2={targetY}
                stroke={dimension.color}
                strokeWidth={10 - index}
                strokeLinecap="round"
                strokeDasharray={430}
                strokeDashoffset={430 * (1 - reveal)}
                opacity={reveal}
                style={{filter: `drop-shadow(0 0 12px ${dimension.color}77)`}}
              />
            );
          })}
        </svg>

        {DIMENSIONS.map((dimension, index) => {
          const reveal = prototypeProgress(frame, 78 + index * 9, 122 + index * 9);
          const y = 246 + index * 245;
          return (
            <div
              key={dimension.label}
              style={{
                position: 'absolute',
                right: 50,
                top: y,
                width: 250,
                minHeight: 130,
                padding: '22px 24px',
                borderRadius: 26,
                background: 'rgba(255,255,255,.9)',
                border: `2px solid ${dimension.color}55`,
                boxShadow: `0 18px 50px ${dimension.color}22`,
                opacity: reveal,
                transform: `translateX(${(1 - reveal) * 110}px) scale(${0.9 + reveal * 0.1})`,
              }}
            >
              <div style={{fontSize: 19, fontWeight: 900, letterSpacing: 2.5, color: dimension.color}}>
                {dimension.label.toUpperCase()}
              </div>
              <div style={{marginTop: 12, fontFamily: 'monospace', fontSize: 38, fontWeight: 900, color: PROTOTYPE_PALETTE.foreground}}>
                {dimension.value}
              </div>
            </div>
          );
        })}

        <div
          style={{
            position: 'absolute',
            left: 96,
            right: 96,
            bottom: 82,
            padding: '24px 30px',
            borderRadius: 28,
            background: `linear-gradient(135deg, ${PROTOTYPE_PALETTE.foreground}, #302746)`,
            color: PROTOTYPE_PALETTE.white,
            textAlign: 'center',
            opacity: result,
            transform: `translateY(${(1 - result) * 60}px)`,
          }}
        >
          <div style={{fontSize: 22, fontWeight: 900, letterSpacing: 3, color: PROTOTYPE_PALETTE.accentSoft}}>
            VEKTOR
          </div>
          <div style={{marginTop: 12, fontFamily: 'monospace', fontSize: 36, fontWeight: 900}}>
            [0.82, −0.31, 0.47]
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 360,
            top: 790,
            width: 210,
            textAlign: 'center',
            fontSize: 21,
            lineHeight: 1.3,
            fontWeight: 800,
            color: PROTOTYPE_PALETTE.muted,
            opacity: interpolate(refract, [0, 1], [0, 1]),
          }}
        >
          Ein Begriff wird nicht als Wort gespeichert, sondern als Zahlenmuster.
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
