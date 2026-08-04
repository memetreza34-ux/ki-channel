import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {GlassPanel, SceneShell, TokenCapsule} from '../components/SceneShell';
import {palette, progress} from '../visualUtils';

const LAYERS = [
  {label: 'KONTEXT', detail: 'Was kam vorher?', color: '#C6A8FF'},
  {label: 'MUSTER', detail: 'Welche Form passt?', color: '#8757E8'},
  {label: 'GEWICHTUNG', detail: 'Was ist relevant?', color: '#35C58A'},
  {label: 'AUSWAHL', detail: 'Welches Wort gewinnt?', color: '#FFB648'},
] as const;

export const TransformerLayerElevatorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const platformEntry = progress(frame, 0, 24);
  const elevator = progress(frame, 18, 94);
  const release = progress(frame, 104, 27);
  const tokenY = interpolate(elevator, [0, 1], [850, 230]);

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
            TRANSFORMER · LAYER PROCESSING
          </div>

          <div
            style={{
              position: 'absolute',
              left: 430,
              top: 160,
              bottom: 90,
              width: 40,
              borderRadius: 999,
              background: 'linear-gradient(180deg, rgba(135,87,232,.08), rgba(135,87,232,.28), rgba(135,87,232,.08))',
              border: '1px solid rgba(135,87,232,.16)',
            }}
          />

          {LAYERS.map((layer, index) => {
            const y = 190 + index * 205;
            const reveal = progress(frame, index * 8, 18) * platformEntry;
            const layerPhase = Math.max(0, 1 - Math.abs(elevator * 3.2 - (3 - index)));
            return (
              <div
                key={layer.label}
                style={{
                  position: 'absolute',
                  left: 80,
                  right: 80,
                  top: y,
                  height: 142,
                  display: 'grid',
                  gridTemplateColumns: '265px 1fr',
                  gap: 34,
                  alignItems: 'center',
                  padding: '0 34px',
                  borderRadius: 30,
                  background: `linear-gradient(90deg, ${layer.color}16, rgba(255,255,255,.86))`,
                  border: `2px solid ${layer.color}${layerPhase > 0.35 ? '99' : '35'}`,
                  boxShadow: layerPhase > 0.35 ? `0 0 42px ${layer.color}44` : '0 14px 38px rgba(45,28,75,.08)',
                  opacity: reveal,
                  transform: `translateX(${(1 - reveal) * (index % 2 === 0 ? -70 : 70)}px) scale(${1 + layerPhase * 0.025})`,
                }}
              >
                <div>
                  <div style={{fontFamily: 'Arial, sans-serif', fontSize: 29, fontWeight: 900, letterSpacing: 1.5, color: layer.color}}>{layer.label}</div>
                  <div style={{fontFamily: 'Arial, sans-serif', fontSize: 20, fontWeight: 700, color: palette.muted, marginTop: 7}}>{layer.detail}</div>
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: 12, opacity: Math.min(1, layerPhase * 1.5)}}>
                  {Array.from({length: 4}, (_, marker) => (
                    <div
                      key={marker}
                      style={{
                        width: 20 + marker * 4,
                        height: 20 + marker * 4,
                        borderRadius: marker % 2 === 0 ? 999 : 7,
                        background: layer.color,
                        opacity: 0.35 + marker * 0.15,
                        transform: `rotate(${marker * 18 + layerPhase * 45}deg)`,
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          <div
            style={{
              position: 'absolute',
              left: 450,
              top: tokenY,
              transform: `translate(-50%, -50%) scale(${1 + release * 0.2})`,
              zIndex: 5,
            }}
          >
            <TokenCapsule
              text="Text"
              accent
              style={{
                minWidth: 150,
                boxShadow: `0 0 ${28 + elevator * 30}px rgba(135,87,232,.5)`,
              }}
            />
            <div
              style={{
                marginTop: 12,
                textAlign: 'center',
                fontFamily: 'monospace',
                fontSize: 17,
                fontWeight: 800,
                color: palette.accent,
              }}
            >
              CONTEXTUALIZED
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              left: 510,
              right: 58,
              top: 120,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              justifyContent: 'flex-end',
              opacity: release,
              transform: `translateY(${(1 - release) * 50}px)`,
            }}
          >
            {['Text', 'wird', 'Muster'].map((word, index) => (
              <TokenCapsule
                key={word}
                text={word}
                accent={index === 0}
                style={{transform: `translateY(${index * 10}px) scale(${0.82 + release * 0.18})`}}
              />
            ))}
          </div>

          <div
            style={{
              position: 'absolute',
              left: 72,
              bottom: 30,
              right: 72,
              padding: '18px 24px',
              borderRadius: 22,
              background: 'rgba(255,93,108,.08)',
              border: '1px solid rgba(255,93,108,.22)',
              color: palette.foreground,
              fontFamily: 'Arial, sans-serif',
              fontSize: 23,
              fontWeight: 850,
              textAlign: 'center',
              opacity: progress(frame, 72, 22),
            }}
          >
            Die Schichten erkennen <span style={{color: palette.accent}}>Muster</span> — kein menschliches Verständnis.
          </div>
        </GlassPanel>
      </div>
    </SceneShell>
  );
};
