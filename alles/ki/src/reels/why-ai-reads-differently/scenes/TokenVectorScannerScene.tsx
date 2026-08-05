import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {GlassPanel, SceneShell, TokenCapsule} from '../components/SceneShell';
import {palette, progress, springProgress} from '../visualUtils';

const TOKENS = [
  {label: 'KI', vector: '[0.18, −0.42, 0.91]'},
  {label: 'liest', vector: '[0.63, 0.11, −0.27]'},
  {label: 'Satz', vector: '[−0.08, 0.77, 0.34]'},
  {label: 'anders', vector: '[0.52, −0.19, 0.68]'},
];

export const TokenVectorScannerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chamberEntry = springProgress({frame, fps, delay: 0, damping: 18});
  const scan = progress(frame, 18, 76);
  const dissolve = progress(frame, 90, 27);

  return (
    <SceneShell sceneId="scene-02" background="radial-gradient(circle at 50% 48%, #FFFFFF 0%, #F4F0FB 55%, #ECE6F7 100%)">
      <div
        style={{
          position: 'absolute',
          left: 112,
          right: 112,
          top: 390,
          bottom: 390,
        }}
      >
        <GlassPanel
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            opacity: chamberEntry,
            transform: `translateY(${(1 - chamberEntry) * 80}px) scale(${0.94 + chamberEntry * 0.06})`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 32,
              left: 36,
              right: 36,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'monospace',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 2,
              color: palette.muted,
            }}
          >
            <span>TOKEN-SCANNER</span>
            <span style={{color: palette.accent}}>VECTORIZATION ACTIVE</span>
          </div>

          {TOKENS.map((token, index) => {
            const rowTop = 118 + index * 192;
            const rowStart = 20 + index * 15;
            const activation = progress(frame, rowStart, 14);
            const vectorReveal = progress(frame, rowStart + 8, 14);
            const pointBreak = progress(frame, 92 + index * 3, 18);
            return (
              <div
                key={token.label}
                style={{
                  position: 'absolute',
                  left: 58,
                  right: 58,
                  top: rowTop,
                  height: 142,
                  display: 'grid',
                  gridTemplateColumns: '210px 1fr',
                  gap: 28,
                  alignItems: 'center',
                  opacity: 1 - dissolve * 0.65,
                  transform: `translateX(${(1 - activation) * -90}px)`,
                }}
              >
                <TokenCapsule
                  text={token.label}
                  accent={index === 0 || index === 2}
                  style={{
                    opacity: activation,
                    transform: `scale(${0.82 + activation * 0.18})`,
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    height: 104,
                    borderRadius: 24,
                    background: 'rgba(135,87,232,.06)',
                    border: '1px solid rgba(135,87,232,.14)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: 30,
                      fontFamily: 'monospace',
                      fontSize: 28,
                      fontWeight: 800,
                      letterSpacing: -0.5,
                      color: palette.foreground,
                      opacity: vectorReveal * (1 - pointBreak),
                      transform: `translateY(${(1 - vectorReveal) * 18}px)`,
                    }}
                  >
                    {token.vector}
                  </div>
                  {Array.from({length: 7}, (_, pointIndex) => {
                    const spread = pointBreak;
                    const x = 48 + pointIndex * 64 + (pointIndex - 3) * 28 * spread;
                    const y = 52 + Math.sin(pointIndex * 1.9) * 32 * spread;
                    return (
                      <div
                        key={pointIndex}
                        style={{
                          position: 'absolute',
                          left: x,
                          top: y,
                          width: 14 + (pointIndex % 3) * 4,
                          height: 14 + (pointIndex % 3) * 4,
                          borderRadius: 999,
                          background: pointIndex % 2 === 0 ? palette.accent : palette.accentSoft,
                          opacity: pointBreak,
                          transform: 'translate(-50%, -50%)',
                          boxShadow: '0 0 22px rgba(135,87,232,.42)',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${interpolate(scan, [0, 1], [10, 92])}%`,
              height: 18,
              background: 'linear-gradient(90deg, transparent, rgba(135,87,232,.35), white, rgba(135,87,232,.6), transparent)',
              boxShadow: '0 0 50px rgba(135,87,232,.75)',
              opacity: scan < 1 ? 0.95 : 0,
            }}
          />
        </GlassPanel>

        <div
          style={{
            position: 'absolute',
            left: 80,
            right: 80,
            bottom: -76,
            display: 'flex',
            justifyContent: 'center',
            gap: 18,
            opacity: dissolve,
            transform: `translateY(${dissolve * 120}px) scale(${1 + dissolve * 0.16})`,
          }}
        >
          {Array.from({length: 14}, (_, index) => (
            <div
              key={index}
              style={{
                width: 14 + (index % 4) * 4,
                height: 14 + (index % 4) * 4,
                borderRadius: 999,
                background: index % 3 === 0 ? palette.accentSoft : palette.accent,
                boxShadow: '0 0 24px rgba(135,87,232,.45)',
                transform: `translateY(${Math.sin(index * 1.7) * 34}px)`,
              }}
            />
          ))}
        </div>
      </div>
    </SceneShell>
  );
};
