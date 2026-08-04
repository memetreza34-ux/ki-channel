import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell, TokenCapsule} from '../components/SceneShell';
import {fadeWindow, palette, progress, springProgress} from '../visualUtils';

const WORDS = ['KI', 'liest', 'deinen', 'Satz', 'nicht', 'wie', 'du'] as const;

const FAN_POSITIONS = [
  {x: -305, y: 155, rotate: -8},
  {x: -205, y: 12, rotate: 5},
  {x: -92, y: 118, rotate: -3},
  {x: 20, y: -18, rotate: 6},
  {x: 155, y: 122, rotate: -5},
  {x: 268, y: 24, rotate: 7},
  {x: 332, y: 172, rotate: -4},
] as const;

export const SentenceTokenShatterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entry = springProgress({frame, fps, delay: 0, damping: 17, stiffness: 160});
  const boundaryReveal = progress(frame, 15, 16);
  const fanOut = progress(frame, 34, 30);
  const scannerPull = progress(frame, 74, 32);
  const humanRead = progress(frame, 6, 24) * (1 - progress(frame, 32, 11));
  const machineLabel = progress(frame, 58, 20);

  return (
    <SceneShell sceneId="scene-01">
      <div
        style={{
          position: 'absolute',
          left: 82,
          right: 82,
          top: 390,
          height: 990,
          perspective: 1200,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 850,
            fontSize: 24,
            letterSpacing: 4,
            color: palette.muted,
            opacity: fadeWindow(frame, 1, 10, 35, 47),
          }}
        >
          MENSCH · EIN SATZ, EINE BEDEUTUNG
        </div>

        <div
          style={{
            position: 'absolute',
            top: 92,
            left: 62,
            right: 62,
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
              boxShadow: '0 0 20px rgba(125,73,223,.38)',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: 180,
            left: 0,
            right: 0,
            height: 470,
            transform: `translateZ(${interpolate(entry, [0, 1], [-380, 0])}px) scale(${interpolate(entry, [0, 1], [0.76, 1])})`,
            opacity: entry,
          }}
        >
          {WORDS.map((word, index) => {
            const fan = FAN_POSITIONS[index];
            const rowX = (index - 3) * 116;
            const rowY = 80;
            const stackX = 0;
            const stackY = (index - 3) * 82;
            const xBeforeStack = interpolate(fanOut, [0, 1], [rowX, fan.x]);
            const yBeforeStack = interpolate(fanOut, [0, 1], [rowY, fan.y]);
            const rotationBeforeStack = interpolate(fanOut, [0, 1], [0, fan.rotate]);
            const x = interpolate(scannerPull, [0, 1], [xBeforeStack, stackX]);
            const y = interpolate(scannerPull, [0, 1], [yBeforeStack, stackY]);
            const rotation = interpolate(scannerPull, [0, 1], [rotationBeforeStack, 0]);
            const tokenIndexOpacity = boundaryReveal * (1 - scannerPull * 0.5);

            return (
              <div
                key={word}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 150,
                  transform: `translate3d(${x - 62}px, ${y}px, ${fanOut * (index % 2 === 0 ? 36 : -28)}px) rotate(${rotation}deg) scale(${1 - scannerPull * 0.06})`,
                  zIndex: index === 3 ? 6 : 4,
                }}
              >
                <TokenCapsule
                  text={word}
                  accent={word === 'KI' || word === 'Satz'}
                  style={{
                    minWidth: word.length > 5 ? 146 : 92,
                    borderRadius: interpolate(boundaryReveal, [0, 1], [13, 22]),
                  }}
                />
                <div
                  style={{
                    marginTop: 7,
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    fontSize: 17,
                    color: palette.accent,
                    opacity: tokenIndexOpacity,
                  }}
                >
                  T{String(index + 1).padStart(2, '0')}
                </div>
              </div>
            );
          })}

          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 150,
              width: 650,
              height: 210,
              borderRadius: '50%',
              border: '2px dashed rgba(125,73,223,.20)',
              transform: `translate(-50%, 5px) scale(${fanOut * (1 - scannerPull)})`,
              opacity: fanOut * (1 - scannerPull),
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: interpolate(scannerPull, [0, 1], [745, 240]),
            width: 170,
            height: 13,
            borderRadius: 999,
            transform: `translateX(-50%) scaleX(${scannerPull})`,
            background: palette.accent,
            boxShadow: '0 0 30px rgba(125,73,223,.46)',
            opacity: scannerPull * 0.62,
            zIndex: 2,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 730,
            minWidth: 620,
            padding: '20px 28px',
            borderRadius: 24,
            background: 'rgba(255,255,255,.80)',
            border: '1px solid rgba(125,73,223,.17)',
            transform: `translateX(-50%) translateY(${(1 - machineLabel) * 35}px)`,
            textAlign: 'center',
            opacity: machineLabel,
          }}
        >
          <div style={{fontFamily: 'Arial, sans-serif', fontSize: 24, fontWeight: 900, letterSpacing: 3.2, color: palette.accent}}>MASCHINE · EINZELNE TOKENS</div>
          <div style={{fontFamily: 'Arial, sans-serif', fontSize: 20, fontWeight: 760, color: palette.muted, marginTop: 8}}>Die Wortfolge wird in getrennte Recheneinheiten zerlegt.</div>
        </div>
      </div>
    </SceneShell>
  );
};
