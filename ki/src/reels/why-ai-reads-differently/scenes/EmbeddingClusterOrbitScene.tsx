import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {GlassPanel, SceneShell} from '../components/SceneShell';
import {palette, progress} from '../visualUtils';

const CLUSTERS = [
  {
    label: 'TIERE',
    x: 250,
    y: 470,
    color: palette.accent,
    words: ['Hund', 'Katze', 'Tier'],
  },
  {
    label: 'REISEN',
    x: 690,
    y: 390,
    color: palette.success,
    words: ['Zug', 'Auto', 'Fahrt'],
  },
  {
    label: 'DENKEN',
    x: 610,
    y: 745,
    color: palette.warning,
    words: ['lernen', 'wissen', 'denken'],
  },
] as const;

const wordPosition = (
  clusterIndex: number,
  wordIndex: number,
): {x: number; y: number} => {
  const cluster = CLUSTERS[clusterIndex];
  const angles = [-2.4, -0.15, 1.9];
  const angle = angles[wordIndex] + clusterIndex * 0.18;
  const radiusX = 72 + wordIndex * 8;
  const radiusY = 54 + wordIndex * 7;
  return {
    x: cluster.x + Math.cos(angle) * radiusX,
    y: cluster.y + Math.sin(angle) * radiusY,
  };
};

export const EmbeddingClusterOrbitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const arrival = progress(frame, 0, 24);
  const clustering = progress(frame, 12, 42);
  const distanceReveal = progress(frame, 48, 24);
  const settle = progress(frame, 78, 28);

  return (
    <SceneShell sceneId="scene-03" background="radial-gradient(circle at 52% 48%, #FFFFFF 0%, #F3EFFB 46%, #E9E3F5 100%)">
      <div
        style={{
          position: 'absolute',
          left: 88,
          right: 88,
          top: 350,
          bottom: 340,
        }}
      >
        <GlassPanel
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            transform: `scale(${1 + settle * 0.012})`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 26,
              fontFamily: 'monospace',
              color: palette.muted,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 1.8,
            }}
          >
            BEDEUTUNGSRAUM · VEREINFACHTE 2D-ANSICHT
          </div>

          <div
            style={{
              position: 'absolute',
              right: 30,
              top: 22,
              padding: '9px 13px',
              borderRadius: 13,
              background: 'rgba(125,73,223,.07)',
              border: '1px solid rgba(125,73,223,.15)',
              color: palette.accent,
              fontFamily: 'Arial, sans-serif',
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: 1.2,
            }}
          >
            KLEINE DISTANZ = ÄHNLICHE BEDEUTUNG
          </div>

          {Array.from({length: 7}, (_, line) => (
            <div
              key={`h-${line}`}
              style={{
                position: 'absolute',
                left: 36,
                right: 36,
                top: 122 + line * 112,
                height: 1,
                background: 'rgba(125,73,223,.075)',
              }}
            />
          ))}
          {Array.from({length: 8}, (_, line) => (
            <div
              key={`v-${line}`}
              style={{
                position: 'absolute',
                top: 104,
                bottom: 104,
                left: 70 + line * 108,
                width: 1,
                background: 'rgba(125,73,223,.065)',
              }}
            />
          ))}

          <svg
            width="904"
            height="980"
            viewBox="0 0 904 980"
            style={{position: 'absolute', inset: 0, zIndex: 2}}
          >
            {CLUSTERS.map((cluster, clusterIndex) => {
              const first = wordPosition(clusterIndex, 0);
              const second = wordPosition(clusterIndex, 1);
              const third = wordPosition(clusterIndex, 2);
              return (
                <React.Fragment key={cluster.label}>
                  <path
                    d={`M ${first.x} ${first.y} Q ${cluster.x} ${cluster.y - 20} ${second.x} ${second.y}`}
                    fill="none"
                    stroke={cluster.color}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="500"
                    strokeDashoffset={500 * (1 - distanceReveal)}
                    opacity={0.58 * distanceReveal}
                  />
                  <path
                    d={`M ${second.x} ${second.y} Q ${cluster.x + 12} ${cluster.y + 16} ${third.x} ${third.y}`}
                    fill="none"
                    stroke={cluster.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="500"
                    strokeDashoffset={500 * (1 - distanceReveal)}
                    opacity={0.34 * distanceReveal}
                  />
                </React.Fragment>
              );
            })}
          </svg>

          {CLUSTERS.map((cluster, clusterIndex) => (
            <React.Fragment key={cluster.label}>
              <div
                style={{
                  position: 'absolute',
                  left: cluster.x,
                  top: cluster.y,
                  width: 260,
                  height: 190,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${cluster.color}25 0%, ${cluster.color}0D 54%, transparent 76%)`,
                  transform: `translate(-50%, -50%) scale(${0.88 + clustering * 0.12})`,
                  opacity: 0.2 + clustering * 0.8,
                  border: `2px solid ${cluster.color}32`,
                  zIndex: 1,
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  left: cluster.x,
                  top: cluster.y - 136,
                  transform: 'translateX(-50%)',
                  padding: '7px 13px',
                  borderRadius: 12,
                  background: `${cluster.color}12`,
                  border: `1px solid ${cluster.color}32`,
                  color: cluster.color,
                  fontFamily: 'Arial, sans-serif',
                  fontSize: 20,
                  fontWeight: 900,
                  letterSpacing: 2.5,
                  opacity: 0.2 + progress(frame, 16 + clusterIndex * 4, 14) * 0.8,
                  zIndex: 4,
                }}
              >
                {cluster.label}
              </div>

              {cluster.words.map((word, wordIndex) => {
                const target = wordPosition(clusterIndex, wordIndex);
                const startX = 450 + (clusterIndex - 1) * 70 + (wordIndex - 1) * 32;
                const startY = 890 + wordIndex * 18;
                const x = interpolate(clustering, [0, 1], [startX, target.x]);
                const y = interpolate(clustering, [0, 1], [startY, target.y]);
                const labelReveal = progress(frame, 18 + clusterIndex * 5 + wordIndex * 4, 14);
                const mainPoint = wordIndex === 0;

                return (
                  <div
                    key={word}
                    style={{
                      position: 'absolute',
                      left: x,
                      top: y,
                      transform: `translate(-50%, -50%) scale(${0.74 + arrival * 0.26})`,
                      opacity: arrival,
                      zIndex: 5,
                    }}
                  >
                    <div
                      style={{
                        width: mainPoint ? 28 : 20,
                        height: mainPoint ? 28 : 20,
                        borderRadius: 999,
                        background: cluster.color,
                        border: '4px solid white',
                        boxShadow: `0 0 ${mainPoint ? 28 : 18}px ${cluster.color}65`,
                        margin: '0 auto 8px',
                      }}
                    />
                    <div
                      style={{
                        padding: '7px 12px',
                        borderRadius: 12,
                        background: 'rgba(255,255,255,.94)',
                        border: `1px solid ${cluster.color}3C`,
                        color: palette.foreground,
                        fontFamily: 'Arial, sans-serif',
                        fontSize: 20,
                        fontWeight: 820,
                        opacity: 0.16 + labelReveal * 0.84,
                        transform: `translateY(${(1 - labelReveal) * 10}px)`,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 8px 22px rgba(40,28,66,.08)',
                      }}
                    >
                      {word}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}

          <div
            style={{
              position: 'absolute',
              left: 42,
              right: 42,
              bottom: 28,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
              opacity: distanceReveal,
              transform: `translateY(${(1 - distanceReveal) * 22}px)`,
              zIndex: 6,
            }}
          >
            <div
              style={{
                padding: '15px 18px',
                borderRadius: 18,
                background: 'rgba(125,73,223,.075)',
                border: '1px solid rgba(125,73,223,.18)',
                fontFamily: 'Arial, sans-serif',
                fontSize: 19,
                fontWeight: 820,
                color: palette.foreground,
              }}
            >
              <span style={{color: palette.accent, fontWeight: 900}}>Hund ↔ Katze</span>
              <span style={{float: 'right', fontFamily: 'monospace'}}>0,18</span>
            </div>
            <div
              style={{
                padding: '15px 18px',
                borderRadius: 18,
                background: 'rgba(242,168,59,.075)',
                border: '1px solid rgba(242,168,59,.20)',
                fontFamily: 'Arial, sans-serif',
                fontSize: 19,
                fontWeight: 820,
                color: palette.foreground,
              }}
            >
              <span style={{color: palette.warning, fontWeight: 900}}>Hund ↔ Zug</span>
              <span style={{float: 'right', fontFamily: 'monospace'}}>0,82</span>
            </div>
          </div>
        </GlassPanel>
      </div>
    </SceneShell>
  );
};
