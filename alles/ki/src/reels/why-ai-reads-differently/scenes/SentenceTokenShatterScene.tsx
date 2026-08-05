import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell, TokenCapsule} from '../components/SceneShell';
import {fadeWindow, palette, progress, seededRange, springProgress} from '../visualUtils';

const WORDS = ['KI', 'liest', 'deinen', 'Satz', 'nicht', 'wie', 'du'];

export const SentenceTokenShatterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entry = springProgress({frame, fps, delay: 0, damping: 15, stiffness: 165});
  const boundaryReveal = progress(frame, 17, 15);
  const scatter = progress(frame, 38, 34);
  const scannerPull = progress(frame, 76, 36);
  const humanRead = progress(frame, 8, 28) * (1 - progress(frame, 34, 12));

  return (
    <SceneShell sceneId="scene-01">
      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          top: 420,
          height: 900,
          perspective: 1200,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 30,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 800,
            fontSize: 25,
            letterSpacing: 4,
            color: palette.muted,
            opacity: fadeWindow(frame, 2, 12, 36, 49),
          }}
        >
          MENSCH: EINE BEDEUTUNG
        </div>

        <div
          style={{
            position: 'absolute',
            top: 112,
            left: 40,
            right: 40,
            height: 8,
            borderRadius: 999,
            background: palette.line,
            overflow: 'hidden',
            opacity: humanRead,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${humanRead * 100}%`,
              background: `linear-gradient(90deg, ${palette.accentSoft}, ${palette.accent})`,
              boxShadow: '0 0 24px rgba(135,87,232,.5)',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: 220,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: interpolate(scatter, [0, 1], [10, 18]),
            transform: `translateZ(${interpolate(entry, [0, 1], [-500, 0])}px) scale(${interpolate(entry, [0, 1], [0.7, 1])})`,
            opacity: entry,
          }}
        >
          {WORDS.map((word, index) => {
            const x = seededRange(index + 10, -290, 290) * scatter * (1 - scannerPull) +
              (index - 3) * -34 * scannerPull;
            const y = seededRange(index + 40, -170, 210) * scatter * (1 - scannerPull) +
              (index - 3) * 92 * scannerPull;
            const rotate = seededRange(index + 80, -18, 18) * scatter * (1 - scannerPull);
            const depth = seededRange(index + 120, -180, 180) * scatter * (1 - scannerPull);
            const tokenIndexOpacity = boundaryReveal * (1 - scannerPull * 0.55);
            return (
              <div
                key={word}
                style={{
                  position: scatter > 0.01 ? 'absolute' : 'relative',
                  left: scatter > 0.01 ? '50%' : undefined,
                  top: scatter > 0.01 ? 80 : undefined,
                  transform: scatter > 0.01
                    ? `translate3d(${x - 70}px, ${y}px, ${depth}px) rotate(${rotate}deg) scale(${1 - scatter * 0.05})`
                    : 'none',
                }}
              >
                <TokenCapsule
                  text={word}
                  accent={word === 'KI' || word === 'Satz'}
                  style={{
                    minWidth: word.length > 5 ? 150 : 94,
                    borderRadius: interpolate(boundaryReveal, [0, 1], [12, 24]),
                  }}
                />
                <div
                  style={{
                    marginTop: 8,
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: 18,
                    color: palette.accent,
                    opacity: tokenIndexOpacity,
                  }}
                >
                  T{String(index + 1).padStart(2, '0')}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: interpolate(scannerPull, [0, 1], [760, 230]),
            width: 180,
            height: 18,
            borderRadius: 999,
            transform: `translateX(-50%) scaleX(${scannerPull})`,
            background: palette.accent,
            boxShadow: '0 0 40px rgba(135,87,232,.75)',
            opacity: scannerPull,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 780,
            transform: `translateX(-50%) translateY(${(1 - scannerPull) * 80}px)`,
            fontFamily: 'Arial, sans-serif',
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: 5,
            color: palette.accent,
            opacity: scannerPull,
          }}
        >
          MASCHINE: EINZELNE TOKENS
        </div>
      </div>
    </SceneShell>
  );
};
