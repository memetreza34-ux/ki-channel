import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {GlassPanel, SceneShell} from '../components/SceneShell';
import {palette, progress, seededRange} from '../visualUtils';

const CLUSTERS = [
  {label: 'TIERE', x: 250, y: 500, color: '#8757E8', words: ['Hund', 'Katze', 'Tier']},
  {label: 'REISEN', x: 705, y: 390, color: '#35C58A', words: ['Zug', 'Auto', 'Fahrt']},
  {label: 'DENKEN', x: 635, y: 790, color: '#FFB648', words: ['lernen', 'wissen', 'denken']},
] as const;

export const EmbeddingClusterOrbitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const arrival = progress(frame, 0, 34);
  const clustering = progress(frame, 22, 48);
  const orbit = progress(frame, 58, 52);
  const zoom = progress(frame, 88, 28);
  const rotate = interpolate(orbit, [0, 1], [-5, 9]);

  return (
    <SceneShell sceneId="scene-03" background="radial-gradient(circle at 52% 48%, #FFFFFF 0%, #F3EFFB 46%, #E9E3F5 100%)">
      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          top: 365,
          bottom: 350,
          perspective: 1300,
        }}
      >
        <GlassPanel
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            transform: `rotateY(${rotate}deg) scale(${1 + zoom * 0.05})`,
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 28,
              top: 24,
              fontFamily: 'monospace',
              color: palette.muted,
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            EMBEDDING SPACE · 3D PROJECTION
          </div>

          {Array.from({length: 8}, (_, line) => (
            <div
              key={`h-${line}`}
              style={{
                position: 'absolute',
                left: 40,
                right: 40,
                top: 120 + line * 102,
                height: 1,
                background: 'rgba(135,87,232,.09)',
                transform: `translateZ(${line * -15}px)`,
              }}
            />
          ))}
          {Array.from({length: 8}, (_, line) => (
            <div
              key={`v-${line}`}
              style={{
                position: 'absolute',
                top: 100,
                bottom: 70,
                left: 80 + line * 110,
                width: 1,
                background: 'rgba(135,87,232,.08)',
              }}
            />
          ))}

          {CLUSTERS.map((cluster, clusterIndex) => {
            const clusterPull = clustering;
            return (
              <React.Fragment key={cluster.label}>
                <div
                  style={{
                    position: 'absolute',
                    left: cluster.x,
                    top: cluster.y,
                    width: 240,
                    height: 170,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${cluster.color}22 0%, ${cluster.color}0A 52%, transparent 74%)`,
                    transform: `translate(-50%, -50%) scale(${0.6 + clusterPull * 0.55})`,
                    opacity: clusterPull,
                    border: `2px solid ${cluster.color}30`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: cluster.x,
                    top: cluster.y - 128,
                    transform: 'translateX(-50%)',
                    color: cluster.color,
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 22,
                    fontWeight: 900,
                    letterSpacing: 3,
                    opacity: progress(frame, 48 + clusterIndex * 4, 16),
                  }}
                >
                  {cluster.label}
                </div>
                {cluster.words.map((word, wordIndex) => {
                  const seed = clusterIndex * 10 + wordIndex + 1;
                  const startX = seededRange(seed, 60, 820);
                  const startY = seededRange(seed + 30, 100, 880);
                  const angle = (wordIndex / cluster.words.length) * Math.PI * 2 + clusterIndex;
                  const targetX = cluster.x + Math.cos(angle) * (62 + wordIndex * 12);
                  const targetY = cluster.y + Math.sin(angle) * (54 + wordIndex * 10);
                  const x = interpolate(clusterPull, [0, 1], [startX, targetX]);
                  const y = interpolate(clusterPull, [0, 1], [startY, targetY]);
                  const depth = seededRange(seed + 60, -90, 110);
                  const labelReveal = progress(frame, 54 + clusterIndex * 5 + wordIndex * 3, 14);
                  return (
                    <div
                      key={word}
                      style={{
                        position: 'absolute',
                        left: x,
                        top: y,
                        transform: `translate(-50%, -50%) translateZ(${depth}px) scale(${0.75 + arrival * 0.25})`,
                        opacity: arrival,
                      }}
                    >
                      <div
                        style={{
                          width: 26 + wordIndex * 4,
                          height: 26 + wordIndex * 4,
                          borderRadius: 999,
                          background: cluster.color,
                          boxShadow: `0 0 30px ${cluster.color}66`,
                          margin: '0 auto 10px',
                        }}
                      />
                      <div
                        style={{
                          padding: '7px 13px',
                          borderRadius: 13,
                          background: 'rgba(255,255,255,.9)',
                          border: `1px solid ${cluster.color}44`,
                          color: palette.foreground,
                          fontFamily: 'Arial, sans-serif',
                          fontSize: 22,
                          fontWeight: 800,
                          opacity: labelReveal,
                          transform: `translateY(${(1 - labelReveal) * 12}px)`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {word}
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}

          <div
            style={{
              position: 'absolute',
              right: 36,
              bottom: 30,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontFamily: 'Arial, sans-serif',
              fontSize: 21,
              fontWeight: 800,
              color: palette.foreground,
              opacity: progress(frame, 62, 20),
            }}
          >
            <span style={{color: palette.accent}}>NÄHER</span>
            <div style={{width: 90, height: 4, borderRadius: 9, background: `linear-gradient(90deg, ${palette.accent}, ${palette.accentSoft})`}} />
            <span>ÄHNLICHER</span>
          </div>
        </GlassPanel>
      </div>
    </SceneShell>
  );
};
