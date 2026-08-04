import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const INPUTS = ['Dokumente', 'Notizen', 'Webseiten', 'Chats', 'Tabellen', 'Berichte'];

export const FunnelCompressionOutputPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const inputsEnter = prototypeProgress(frame, 0, 46);
  const funnelActivate = prototypeProgress(frame, 36, 88);
  const compress = prototypeProgress(frame, 76, 132);
  const output = prototypeProgress(frame, 122, 170);

  return (
    <PrototypeShell
      family="INPUT OUTPUT"
      title="Funnel Compression Output"
      subtitle="Viele unübersichtliche Quellen werden gefiltert, gruppiert und zu einem klaren Ergebnis verdichtet."
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
        {INPUTS.map((label, index) => {
          const angle = (index / INPUTS.length) * Math.PI * 2;
          const startX = 466 + Math.cos(angle) * 350;
          const startY = 270 + Math.sin(angle) * 175;
          const targetX = 466 + (index - 2.5) * 38;
          const targetY = 430 + (index % 2) * 34;
          const x = interpolate(compress, [0, 1], [startX, targetX]);
          const y = interpolate(compress, [0, 1], [startY, targetY]);
          const reveal = prototypeProgress(frame, index * 5, 22 + index * 5) * inputsEnter;
          return (
            <div
              key={label}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                minWidth: 145,
                padding: '14px 18px',
                borderRadius: 20,
                background: 'rgba(255,255,255,.92)',
                border: '2px solid rgba(135,87,232,.18)',
                boxShadow: '0 14px 38px rgba(50,34,80,.10)',
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 900,
                color: index % 2 === 0 ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.foreground,
                opacity: reveal * (1 - output * 0.75),
                transform: `translate(-50%, -50%) rotate(${(index - 2.5) * 2 * (1 - compress)}deg) scale(${0.88 + reveal * 0.12})`,
                zIndex: 4,
              }}
            >
              {label}
            </div>
          );
        })}

        <svg width="932" height="1060" viewBox="0 0 932 1060" style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="funnel-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#C6A8FF" stopOpacity="0.35" />
              <stop offset="1" stopColor="#8757E8" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <path
            d="M 170 390 L 762 390 L 570 690 L 570 810 L 362 810 L 362 690 Z"
            fill="url(#funnel-fill)"
            stroke={PROTOTYPE_PALETTE.accent}
            strokeWidth={7}
            opacity={funnelActivate}
            style={{filter: 'drop-shadow(0 22px 35px rgba(135,87,232,.2))'}}
          />
          {[0, 1, 2].map((index) => (
            <line
              key={index}
              x1={260 + index * 105}
              y1={515 + index * 75}
              x2={675 - index * 105}
              y2={515 + index * 75}
              stroke={index === 1 ? PROTOTYPE_PALETTE.white : PROTOTYPE_PALETTE.accentSoft}
              strokeWidth={10}
              strokeLinecap="round"
              opacity={prototypeProgress(frame, 52 + index * 12, 84 + index * 12)}
            />
          ))}
        </svg>

        {Array.from({length: 16}, (_, index) => {
          const phase = prototypeProgress(frame, 70 + index * 2, 124 + index * 2);
          const x = interpolate(phase, [0, 1], [260 + (index % 8) * 60, 466]);
          const y = interpolate(phase, [0, 1], [450 + Math.floor(index / 8) * 60, 845]);
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: 12 + (index % 3) * 5,
                height: 12 + (index % 3) * 5,
                borderRadius: 999,
                background: index % 3 === 0 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.accent,
                opacity: phase * (1 - output * 0.5),
                transform: `translate(-50%, -50%) scale(${0.6 + phase * 0.4})`,
                boxShadow: '0 0 18px rgba(135,87,232,.35)',
                zIndex: 7,
              }}
            />
          );
        })}

        <div
          style={{
            position: 'absolute',
            left: 170,
            right: 170,
            bottom: 60,
            padding: '30px 34px',
            borderRadius: 32,
            background: `linear-gradient(135deg, ${PROTOTYPE_PALETTE.foreground}, #342747)`,
            color: PROTOTYPE_PALETTE.white,
            textAlign: 'center',
            opacity: output,
            transform: `translateY(${(1 - output) * 80}px) scale(${0.88 + output * 0.12})`,
            boxShadow: '0 24px 70px rgba(20,18,26,.24)',
          }}
        >
          <div style={{fontSize: 20, fontWeight: 900, letterSpacing: 3, color: PROTOTYPE_PALETTE.accentSoft}}>VERDICHTETES ERGEBNIS</div>
          <div style={{marginTop: 14, fontSize: 38, lineHeight: 1.1, fontWeight: 900}}>Eine klare Zusammenfassung</div>
          <div style={{marginTop: 12, fontSize: 21, lineHeight: 1.3, fontWeight: 700, color: '#DAD2E9'}}>Nur relevante Informationen bleiben erhalten.</div>
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
