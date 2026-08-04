import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {GlassPanel, SceneShell, TokenCapsule} from '../components/SceneShell';
import {palette, progress} from '../visualUtils';

const TOKENS = [
  {label: 'KI', values: ['0.18', '−0.42', '0.91'], color: palette.accent},
  {label: 'liest', values: ['0.63', '0.11', '−0.27'], color: '#5D6FE8'},
  {label: 'Satz', values: ['−0.08', '0.77', '0.34'], color: palette.success},
  {label: 'anders', values: ['0.52', '−0.19', '0.68'], color: palette.warning},
] as const;

export const TokenVectorScannerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const chamberEntry = progress(frame, 0, 16);
  const scan = progress(frame, 10, 82);
  const handoff = progress(frame, 94, 22);
  const beamTop = interpolate(scan, [0, 1], [124, 850]);

  return (
    <SceneShell sceneId="scene-02" background="radial-gradient(circle at 50% 48%, #FFFFFF 0%, #F4F0FB 55%, #ECE6F7 100%)">
      <div
        style={{
          position: 'absolute',
          left: 92,
          right: 92,
          top: 350,
          bottom: 340,
        }}
      >
        <GlassPanel
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            opacity: chamberEntry,
            transform: `translateY(${(1 - chamberEntry) * 42}px) scale(${0.97 + chamberEntry * 0.03})`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 28,
              left: 34,
              right: 34,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'monospace',
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 1.8,
              color: palette.muted,
            }}
          >
            <span>TOKEN-SCANNER</span>
            <span style={{color: palette.accent}}>VEREINFACHTE VEKTOR-ANSICHT</span>
          </div>

          <div
            style={{
              position: 'absolute',
              left: 44,
              right: 44,
              top: 88,
              display: 'grid',
              gridTemplateColumns: '150px 1fr 150px',
              gap: 24,
              fontFamily: 'Arial, sans-serif',
              fontSize: 17,
              fontWeight: 900,
              letterSpacing: 2.2,
              color: palette.muted,
            }}
          >
            <span>TOKEN</span>
            <span>ZAHLEN-KOORDINATEN</span>
            <span style={{textAlign: 'center'}}>PUNKT</span>
          </div>

          {TOKENS.map((token, index) => {
            const rowTop = 132 + index * 188;
            const rowStart = 14 + index * 18;
            const tokenEnter = progress(frame, rowStart, 12);
            const vectorReveal = progress(frame, rowStart + 7, 18);
            const pointReveal = progress(frame, rowStart + 19, 15);
            const active = progress(frame, rowStart + 5, 12) *
              (1 - progress(frame, rowStart + 31, 14));

            return (
              <div
                key={token.label}
                style={{
                  position: 'absolute',
                  left: 42,
                  right: 42,
                  top: rowTop,
                  height: 154,
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr 150px',
                  gap: 24,
                  alignItems: 'center',
                  padding: '0 18px',
                  boxSizing: 'border-box',
                  borderRadius: 26,
                  background: active > 0.02
                    ? `linear-gradient(90deg, ${token.color}18, rgba(255,255,255,.90))`
                    : 'rgba(255,255,255,.48)',
                  border: `2px solid ${token.color}${active > 0.02 ? '70' : '20'}`,
                  boxShadow: active > 0.02
                    ? `0 15px 38px ${token.color}22`
                    : 'none',
                  transform: `scale(${1 + active * 0.018})`,
                }}
              >
                <div
                  style={{
                    opacity: 0.28 + tokenEnter * 0.72,
                    transform: `translateX(${(1 - tokenEnter) * -36}px)`,
                  }}
                >
                  <TokenCapsule
                    text={token.label}
                    accent={index === 0}
                    style={{minWidth: 116, fontSize: 30}}
                  />
                  <div
                    style={{
                      marginTop: 9,
                      textAlign: 'center',
                      fontFamily: 'monospace',
                      fontSize: 15,
                      fontWeight: 800,
                      color: token.color,
                    }}
                  >
                    T{String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 12,
                  }}
                >
                  {token.values.map((value, valueIndex) => {
                    const cellReveal = progress(frame, rowStart + 7 + valueIndex * 4, 12);
                    return (
                      <div
                        key={value}
                        style={{
                          height: 80,
                          borderRadius: 18,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: `${token.color}0E`,
                          border: `1px solid ${token.color}2E`,
                          fontFamily: 'monospace',
                          fontSize: 22,
                          fontWeight: 900,
                          color: palette.foreground,
                          opacity: 0.18 + cellReveal * 0.82,
                          transform: `translateY(${(1 - cellReveal) * 16}px)`,
                        }}
                      >
                        {value}
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    position: 'relative',
                    height: 112,
                    opacity: 0.18 + pointReveal * 0.82,
                    transform: `scale(${0.72 + pointReveal * 0.28}) translateY(${handoff * 28}px)`,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: 64,
                      height: 64,
                      borderRadius: 999,
                      border: `1px dashed ${token.color}55`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                  {Array.from({length: 4}, (_, pointIndex) => {
                    const angle = pointIndex * (Math.PI / 2) + index * 0.35;
                    const radius = pointIndex === 0 ? 0 : 32;
                    return (
                      <div
                        key={pointIndex}
                        style={{
                          position: 'absolute',
                          left: `calc(50% + ${Math.cos(angle) * radius}px)`,
                          top: `calc(50% + ${Math.sin(angle) * radius}px)`,
                          width: pointIndex === 0 ? 24 : 12,
                          height: pointIndex === 0 ? 24 : 12,
                          borderRadius: 999,
                          background: token.color,
                          opacity: pointIndex === 0 ? 1 : 0.38,
                          transform: 'translate(-50%, -50%)',
                          boxShadow: pointIndex === 0
                            ? `0 0 24px ${token.color}70`
                            : 'none',
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
              top: beamTop,
              height: 12,
              background: 'linear-gradient(90deg, transparent, rgba(125,73,223,.28), white, rgba(125,73,223,.48), transparent)',
              boxShadow: '0 0 34px rgba(125,73,223,.48)',
              opacity: scan < 1 ? 0.82 : 0,
              zIndex: 8,
            }}
          />

          <div
            style={{
              position: 'absolute',
              left: 44,
              right: 44,
              bottom: 28,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderRadius: 18,
              background: 'rgba(125,73,223,.065)',
              border: '1px solid rgba(125,73,223,.16)',
              fontFamily: 'Arial, sans-serif',
              fontSize: 19,
              fontWeight: 780,
              color: palette.foreground,
              opacity: progress(frame, 60, 18),
            }}
          >
            <span>Jedes Token wird zu einer Zahlenposition.</span>
            <span style={{color: palette.accent, fontWeight: 900}}>TOKEN → VEKTOR → PUNKT</span>
          </div>
        </GlassPanel>
      </div>
    </SceneShell>
  );
};
