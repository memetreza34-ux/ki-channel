import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {GlassPanel, SceneShell, TokenCapsule} from '../components/SceneShell';
import {palette, progress} from '../visualUtils';

const LAYERS = [
  {label: 'KONTEXT', detail: 'Was kam vorher?', color: '#B996FA'},
  {label: 'MUSTER', detail: 'Welche Form passt?', color: '#7D49DF'},
  {label: 'GEWICHTUNG', detail: 'Was ist relevant?', color: '#28B87E'},
  {label: 'AUSWAHL', detail: 'Welches Wort gewinnt?', color: '#F2A83B'},
] as const;

export const TransformerLayerElevatorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const elevator = progress(frame, 8, 88);
  const release = progress(frame, 92, 28);
  const tokenY = interpolate(elevator, [0, 1], [790, 238]);

  return (
    <SceneShell sceneId="scene-06" background="radial-gradient(circle at 50% 48%, #FFFFFF 0%, #F3EFFA 50%, #E8E1F4 100%)">
      <div style={{position: 'absolute', left: 90, right: 90, top: 350, bottom: 345}}>
        <GlassPanel style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <div
            style={{
              position: 'absolute',
              left: 38,
              top: 28,
              fontFamily: 'monospace',
              fontSize: 19,
              fontWeight: 800,
              color: palette.muted,
              letterSpacing: 2,
            }}
          >
            TRANSFORMER · SICHTBARE VERARBEITUNGSSCHRITTE
          </div>

          <div
            style={{
              position: 'absolute',
              left: 430,
              top: 140,
              bottom: 92,
              width: 40,
              borderRadius: 999,
              background: 'linear-gradient(180deg, rgba(125,73,223,.08), rgba(125,73,223,.30), rgba(125,73,223,.08))',
              border: '1px solid rgba(125,73,223,.20)',
            }}
          />

          {LAYERS.map((layer, index) => {
            const y = 170 + index * 202;
            const reveal = 0.24 + progress(frame, index * 3, 14) * 0.76;
            const layerPhase = Math.max(0, 1 - Math.abs(elevator * 3 - (3 - index)));
            const completed = elevator * 3 > 3 - index + 0.55;
            return (
              <div
                key={layer.label}
                style={{
                  position: 'absolute',
                  left: 70,
                  right: 70,
                  top: y,
                  height: 144,
                  display: 'grid',
                  gridTemplateColumns: '280px 1fr',
                  gap: 30,
                  alignItems: 'center',
                  padding: '0 32px',
                  borderRadius: 28,
                  background: `linear-gradient(90deg, ${layer.color}${completed ? '24' : '12'}, rgba(255,255,255,.92))`,
                  border: `2px solid ${layer.color}${layerPhase > 0.3 ? 'B5' : completed ? '68' : '42'}`,
                  boxShadow: layerPhase > 0.3
                    ? `0 0 44px ${layer.color}42`
                    : '0 12px 30px rgba(45,28,75,.08)',
                  opacity: reveal,
                  transform: `translateX(${(1 - reveal) * (index % 2 === 0 ? -34 : 34)}px) scale(${1 + layerPhase * 0.035})`,
                }}
              >
                <div>
                  <div style={{fontFamily: 'Arial, sans-serif', fontSize: 29, fontWeight: 900, letterSpacing: 1.3, color: layer.color}}>{layer.label}</div>
                  <div style={{fontFamily: 'Arial, sans-serif', fontSize: 21, fontWeight: 760, color: palette.muted, marginTop: 7}}>{layer.detail}</div>
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12}}>
                  {Array.from({length: 4}, (_, marker) => (
                    <div
                      key={marker}
                      style={{
                        width: 19 + marker * 4,
                        height: 19 + marker * 4,
                        borderRadius: marker % 2 === 0 ? 999 : 7,
                        background: layer.color,
                        opacity: 0.12 + layerPhase * (0.45 + marker * 0.11) + (completed ? 0.18 : 0),
                        transform: `rotate(${marker * 18 + layerPhase * 50}deg) scale(${0.86 + layerPhase * 0.18})`,
                      }}
                    />
                  ))}
                  <div
                    style={{
                      marginLeft: 10,
                      width: 24,
                      height: 24,
                      borderRadius: 999,
                      border: `3px solid ${layer.color}`,
                      background: completed ? layer.color : palette.white,
                      opacity: completed ? 1 : 0.32,
                    }}
                  />
                </div>
              </div>
            );
          })}

          <div
            style={{
              position: 'absolute',
              left: 450,
              top: tokenY,
              transform: `translate(-50%, -50%) scale(${1 + release * 0.12})`,
              zIndex: 5,
              opacity: progress(frame, 0, 7),
            }}
          >
            <TokenCapsule
              text="Text"
              accent
              style={{
                minWidth: 150,
                boxShadow: `0 0 ${22 + elevator * 28}px rgba(125,73,223,.42)`,
              }}
            />
            <div
              style={{
                marginTop: 10,
                textAlign: 'center',
                fontFamily: 'monospace',
                fontSize: 16,
                fontWeight: 800,
                color: palette.accent,
              }}
            >
              SIGNAL
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              left: 500,
              right: 54,
              top: 98,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              justifyContent: 'flex-end',
              opacity: release,
              transform: `translateY(${(1 - release) * 32}px)`,
            }}
          >
            {['Muster', '→', 'nächstes Wort'].map((word, index) => (
              <TokenCapsule
                key={word}
                text={word}
                accent={index === 2}
                style={{
                  minWidth: word === '→' ? 68 : word.length > 8 ? 190 : 130,
                  transform: `translateY(${index === 1 ? 7 : 0}px) scale(${0.86 + release * 0.14})`,
                }}
              />
            ))}
          </div>

          <div
            style={{
              position: 'absolute',
              left: 66,
              bottom: 28,
              right: 66,
              padding: '17px 24px',
              borderRadius: 20,
              background: 'rgba(242,80,97,.075)',
              border: '1px solid rgba(242,80,97,.24)',
              color: palette.foreground,
              fontFamily: 'Arial, sans-serif',
              fontSize: 22,
              fontWeight: 830,
              textAlign: 'center',
              opacity: progress(frame, 42, 20),
            }}
          >
            Die Schichten erkennen <span style={{color: palette.accent}}>Muster</span> — kein menschliches Verständnis.
          </div>
        </GlassPanel>
      </div>
    </SceneShell>
  );
};
