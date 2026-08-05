import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const DOCUMENTS = [
  {label: 'Quelle A', x: 145, y: 450, relevant: false},
  {label: 'Studie 2026', x: 730, y: 430, relevant: true},
  {label: 'Blog', x: 120, y: 760, relevant: false},
  {label: 'Dokument', x: 770, y: 760, relevant: true},
  {label: 'Archiv', x: 235, y: 1050, relevant: true},
  {label: 'Kommentar', x: 685, y: 1080, relevant: false},
] as const;

export const KnowledgeMagnetPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const field = prototypeProgress(frame, 16, 58);
  const attraction = prototypeProgress(frame, 54, 128);
  const ranking = prototypeProgress(frame, 118, 160);

  return (
    <PrototypeShell
      family="RETRIEVAL SEARCH"
      title="Knowledge Magnet"
      subtitle="Die Anfrage zieht nur passende Belege aus einem großen Dokumentraum an."
    >
      <div style={{position: 'absolute', left: 86, right: 86, top: 380, bottom: 170}}>
        <GlassSurface style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <svg width="908" height="1260" viewBox="0 0 908 1260" style={{position: 'absolute', inset: 0}}>
            {[0, 1, 2, 3].map((index) => {
              const radius = 130 + index * 95;
              const dash = 2 * Math.PI * radius;
              return (
                <circle
                  key={index}
                  cx="454"
                  cy="640"
                  r={radius}
                  fill="none"
                  stroke={index === 0 ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.accentSoft}
                  strokeWidth={index === 0 ? 7 : 3}
                  strokeDasharray={dash}
                  strokeDashoffset={dash * (1 - field)}
                  opacity={(0.7 - index * 0.1) * field}
                />
              );
            })}
            {DOCUMENTS.filter((document) => document.relevant).map((document, index) => {
              const pull = Math.min(1, Math.max(0, (attraction - index * 0.12) / 0.65));
              const endX = 454 + (index - 1) * 105;
              const endY = 640 + 205;
              const x = interpolate(pull, [0, 1], [document.x, endX]);
              const y = interpolate(pull, [0, 1], [document.y, endY]);
              return (
                <path
                  key={document.label}
                  d={`M ${document.x} ${document.y} Q 454 640 ${x} ${y}`}
                  fill="none"
                  stroke={PROTOTYPE_PALETTE.accent}
                  strokeWidth={5}
                  strokeLinecap="round"
                  opacity={field * (1 - pull * 0.4)}
                  strokeDasharray="18 16"
                />
              );
            })}
          </svg>

          <div
            style={{
              position: 'absolute',
              left: 454,
              top: 640,
              transform: `translate(-50%, -50%) scale(${0.72 + field * 0.28})`,
              width: 255,
              height: 255,
              borderRadius: 999,
              background: `radial-gradient(circle, ${PROTOTYPE_PALETTE.white} 0%, #EFE7FF 58%, ${PROTOTYPE_PALETTE.accentSoft} 100%)`,
              border: `5px solid ${PROTOTYPE_PALETTE.accent}`,
              boxShadow: `0 0 ${35 + field * 45}px rgba(135,87,232,.42)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: 30,
              boxSizing: 'border-box',
              zIndex: 5,
            }}
          >
            <div>
              <div style={{fontSize: 23, fontWeight: 900, letterSpacing: 3, color: PROTOTYPE_PALETTE.accent}}>ANFRAGE</div>
              <div style={{marginTop: 12, fontSize: 34, lineHeight: 1.05, fontWeight: 900}}>„Welche Quelle belegt das?“</div>
            </div>
          </div>

          {DOCUMENTS.map((document, index) => {
            const relevantIndex = DOCUMENTS.filter((item) => item.relevant).findIndex(
              (item) => item.label === document.label,
            );
            const pull = document.relevant
              ? Math.min(1, Math.max(0, (attraction - relevantIndex * 0.12) / 0.65))
              : 0;
            const repel = document.relevant ? 0 : prototypeProgress(frame, 88 + index * 3, 142);
            const endX = 454 + (relevantIndex - 1) * 105;
            const endY = 845;
            const x = document.relevant
              ? interpolate(pull, [0, 1], [document.x, endX])
              : document.x + (document.x < 454 ? -1 : 1) * repel * 135;
            const y = document.relevant
              ? interpolate(pull, [0, 1], [document.y, endY])
              : document.y + repel * 30;
            const selected = document.relevant && pull > 0.75;

            return (
              <div
                key={document.label}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: selected ? 150 : 132,
                  minHeight: selected ? 118 : 98,
                  borderRadius: 22,
                  transform: `translate(-50%, -50%) rotate(${document.relevant ? (index - 2) * 2 : (index % 2 ? 7 : -7)}deg) scale(${selected ? 1.05 : 1})`,
                  background: selected ? '#F1EAFF' : 'white',
                  border: `2px solid ${selected ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.line}`,
                  boxShadow: selected
                    ? '0 18px 45px rgba(135,87,232,.27)'
                    : '0 12px 30px rgba(48,34,74,.10)',
                  opacity: document.relevant ? 1 : 1 - repel * 0.78,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: 16,
                  boxSizing: 'border-box',
                  fontSize: 21,
                  fontWeight: 850,
                  color: selected ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.foreground,
                  zIndex: selected ? 8 : 2,
                }}
              >
                {document.label}
              </div>
            );
          })}

          <div
            style={{
              position: 'absolute',
              left: 184,
              right: 184,
              bottom: 62,
              padding: '22px 28px',
              borderRadius: 26,
              background: 'rgba(53,197,138,.10)',
              border: '2px solid rgba(53,197,138,.34)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 15,
              opacity: ranking,
              transform: `translateY(${(1 - ranking) * 38}px)`,
              fontSize: 27,
              fontWeight: 900,
            }}
          >
            <span style={{color: PROTOTYPE_PALETTE.success}}>3 BELEGE</span>
            <span style={{color: PROTOTYPE_PALETTE.muted}}>nach Relevanz geordnet</span>
          </div>
        </GlassSurface>
      </div>
    </PrototypeShell>
  );
};
