import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {GlassPanel, SceneShell, TokenCapsule} from '../components/SceneShell';
import {palette, progress} from '../visualUtils';

const CANDIDATES = [
  {word: 'Text', color: palette.accent, path: 'M 150 470 C 300 300, 540 300, 760 220'},
  {word: 'Daten', color: palette.success, path: 'M 150 470 C 340 470, 560 470, 760 470'},
  {word: 'Gedanken', color: palette.warning, path: 'M 150 470 C 310 650, 560 650, 760 720'},
] as const;

const probabilityAt = (frame: number, index: number): number => {
  const first = [42, 34, 24][index];
  const middle = [47, 32, 21][index];
  const end = [57, 26, 17][index];
  if (frame < 88) {
    return interpolate(frame, [18, 88], [first, middle], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }
  return interpolate(frame, [88, 142], [middle, end], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

export const NextTokenBranchRaceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const promptEnter = progress(frame, 0, 20);
  const pathsReveal = progress(frame, 12, 30);
  const raceProgress = progress(frame, 30, 100);
  const winner = progress(frame, 124, 24);

  return (
    <SceneShell sceneId="scene-05" background="radial-gradient(circle at 50% 47%, #FFFFFF 0%, #F5F1FC 52%, #EAE3F6 100%)">
      <div style={{position: 'absolute', left: 86, right: 86, top: 350, bottom: 345}}>
        <GlassPanel style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <div
            style={{
              position: 'absolute',
              left: 40,
              top: 30,
              fontFamily: 'monospace',
              fontSize: 19,
              fontWeight: 800,
              letterSpacing: 2,
              color: palette.muted,
            }}
          >
            NEXT TOKEN · TOP CANDIDATES
          </div>
          <div
            style={{
              position: 'absolute',
              right: 42,
              top: 30,
              padding: '8px 13px',
              borderRadius: 12,
              background: 'rgba(125,73,223,.08)',
              color: palette.accent,
              fontFamily: 'monospace',
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: 1.4,
              opacity: progress(frame, 24, 14),
            }}
          >
            LIVE-ZWISCHENSTAND
          </div>

          <div
            style={{
              position: 'absolute',
              left: 52,
              top: 154,
              right: 52,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              opacity: promptEnter,
              transform: `translateX(${(1 - promptEnter) * -70}px)`,
            }}
          >
            <TokenCapsule text="Die" />
            <TokenCapsule text="KI" accent />
            <TokenCapsule text="liest" />
            <div
              style={{
                width: 86,
                height: 68,
                borderRadius: 20,
                border: `3px dashed ${palette.accent}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Arial, sans-serif',
                fontSize: 42,
                fontWeight: 900,
                color: palette.accent,
                background: palette.accentPale,
              }}
            >
              ?
            </div>
          </div>

          <svg width="908" height="920" viewBox="0 0 908 920" style={{position: 'absolute', left: 0, top: 180}}>
            {CANDIDATES.map((candidate, index) => {
              const dash = 1200;
              return (
                <path
                  key={candidate.word}
                  d={candidate.path}
                  fill="none"
                  stroke={candidate.color}
                  strokeWidth={index === 0 ? 14 : 10}
                  strokeLinecap="round"
                  strokeDasharray={dash}
                  strokeDashoffset={dash * (1 - pathsReveal)}
                  opacity={0.42 + pathsReveal * 0.48}
                  style={{filter: index === 0 ? 'drop-shadow(0 0 11px rgba(125,73,223,.28))' : undefined}}
                />
              );
            })}
          </svg>

          {CANDIDATES.map((candidate, index) => {
            const probability = probabilityAt(frame, index);
            const candidateProgress = Math.min(1, raceProgress * (0.72 + probability / 100 * 0.6));
            const startY = 650;
            const endX = 760;
            const endY = [400, 650, 900][index];
            const x = interpolate(candidateProgress, [0, 1], [150, endX]);
            const curveLift = index === 0 ? -180 : index === 2 ? 180 : 0;
            const y = interpolate(candidateProgress, [0, 1], [startY, endY]) +
              Math.sin(candidateProgress * Math.PI) * curveLift;
            const isWinner = index === 0;
            return (
              <React.Fragment key={candidate.word}>
                <div
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    transform: `translate(-50%, -50%) scale(${1 + (isWinner ? winner * 0.22 : 0)})`,
                    zIndex: 5,
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 999,
                      background: candidate.color,
                      border: '7px solid white',
                      boxShadow: `0 0 30px ${candidate.color}70`,
                    }}
                  />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    right: 42,
                    top: [344, 596, 846][index],
                    width: 240,
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: 14,
                    alignItems: 'center',
                    opacity: progress(frame, 34 + index * 8, 16),
                    transform: `translateX(${isWinner ? winner * -18 : 0}px)`,
                  }}
                >
                  <TokenCapsule text={candidate.word} accent={isWinner && winner > 0.25} />
                  <div
                    style={{
                      minWidth: 82,
                      fontFamily: 'monospace',
                      fontSize: 28,
                      fontWeight: 900,
                      color: candidate.color,
                      textAlign: 'right',
                    }}
                  >
                    {Math.round(probability)}%
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          <div
            style={{
              position: 'absolute',
              left: 80,
              bottom: 38,
              right: 80,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 13,
              padding: '16px 20px',
              borderRadius: 20,
              background: 'rgba(125,73,223,.075)',
              border: '1px solid rgba(125,73,223,.18)',
              opacity: winner,
              transform: `translateY(${(1 - winner) * 22}px)`,
              fontFamily: 'Arial, sans-serif',
              fontSize: 26,
              fontWeight: 900,
              color: palette.foreground,
            }}
          >
            <span style={{color: palette.accent}}>GEWÄHLT:</span>
            <span>„Text“ wird als nächstes Wort übernommen</span>
          </div>
        </GlassPanel>
      </div>
    </SceneShell>
  );
};
