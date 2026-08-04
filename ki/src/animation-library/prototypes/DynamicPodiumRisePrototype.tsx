import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const CANDIDATES = [
  {label: 'Tool A', color: '#8757E8', start: 58, middle: 74, end: 91},
  {label: 'Tool B', color: '#35C58A', start: 72, middle: 68, end: 76},
  {label: 'Tool C', color: '#FFB648', start: 64, middle: 81, end: 69},
] as const;

const scoreAt = (frame: number, candidate: (typeof CANDIDATES)[number]): number => {
  if (frame <= 90) {
    return interpolate(frame, [20, 90], [candidate.start, candidate.middle], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }
  return interpolate(frame, [90, 150], [candidate.middle, candidate.end], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

export const DynamicPodiumRisePrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const intro = prototypeProgress(frame, 0, 28);
  const lock = prototypeProgress(frame, 140, 170);

  return (
    <PrototypeShell
      family="RANKING"
      title="Dynamic Podium Rise"
      subtitle="Die Reihenfolge verändert sich sichtbar, sobald neue Kriterien einfließen."
    >
      <GlassSurface
        style={{
          position: 'absolute',
          left: 76,
          right: 76,
          top: 390,
          bottom: 190,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 50,
            right: 50,
            top: 65,
            display: 'flex',
            justifyContent: 'space-between',
            opacity: intro,
          }}
        >
          {['PREIS', 'TEMPO', 'QUALITÄT'].map((criterion, index) => {
            const active = prototypeProgress(frame, 32 + index * 34, 52 + index * 34) *
              (1 - prototypeProgress(frame, 62 + index * 34, 76 + index * 34));
            return (
              <div
                key={criterion}
                style={{
                  width: 230,
                  padding: '17px 18px',
                  borderRadius: 22,
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 900,
                  letterSpacing: 2.5,
                  color: active > 0.1 ? PROTOTYPE_PALETTE.white : PROTOTYPE_PALETTE.muted,
                  background: active > 0.1
                    ? `linear-gradient(135deg, ${PROTOTYPE_PALETTE.accent}, #6A39D0)`
                    : 'rgba(135,87,232,.07)',
                  border: '1px solid rgba(135,87,232,.18)',
                  transform: `scale(${1 + active * 0.08})`,
                  boxShadow: active > 0.1 ? '0 12px 35px rgba(135,87,232,.3)' : 'none',
                }}
              >
                {criterion}
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: 'absolute',
            left: 70,
            right: 70,
            bottom: 96,
            height: 760,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            gap: 24,
          }}
        >
          {CANDIDATES.map((candidate, index) => {
            const score = scoreAt(frame, candidate);
            const height = interpolate(score, [50, 95], [270, 650]);
            const reveal = prototypeProgress(frame, 14 + index * 8, 38 + index * 8);
            const isWinner = index === 0 && lock > 0.35;
            return (
              <div
                key={candidate.label}
                style={{
                  width: 230,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  opacity: reveal,
                  transform: `translateY(${(1 - reveal) * 90}px)`,
                }}
              >
                <div
                  style={{
                    marginBottom: 18,
                    padding: '15px 20px',
                    borderRadius: 20,
                    background: isWinner ? candidate.color : 'rgba(255,255,255,.92)',
                    border: `2px solid ${candidate.color}55`,
                    color: isWinner ? PROTOTYPE_PALETTE.white : PROTOTYPE_PALETTE.foreground,
                    fontSize: 30,
                    fontWeight: 900,
                    boxShadow: isWinner
                      ? `0 18px 50px ${candidate.color}55`
                      : '0 12px 34px rgba(50,34,80,.1)',
                    transform: `scale(${1 + (isWinner ? lock * 0.12 : 0)})`,
                  }}
                >
                  {candidate.label}
                </div>
                <div
                  style={{
                    width: '100%',
                    height,
                    borderRadius: '30px 30px 10px 10px',
                    background: `linear-gradient(180deg, ${candidate.color}, ${candidate.color}44)`,
                    border: `2px solid ${candidate.color}88`,
                    boxShadow: `0 20px 55px ${candidate.color}33`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: 30,
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: 18,
                      background: 'rgba(255,255,255,.9)',
                      color: candidate.color,
                      fontFamily: 'monospace',
                      fontSize: 34,
                      fontWeight: 900,
                    }}
                  >
                    {Math.round(score)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 36,
            transform: `translateX(-50%) translateY(${(1 - lock) * 34}px)`,
            opacity: lock,
            padding: '16px 26px',
            borderRadius: 22,
            background: PROTOTYPE_PALETTE.foreground,
            color: PROTOTYPE_PALETTE.white,
            fontSize: 23,
            fontWeight: 900,
            letterSpacing: 2,
          }}
        >
          RANKING NACH ALLEN KRITERIEN
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
