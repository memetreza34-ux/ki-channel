import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {GlassPanel, SceneShell, TokenCapsule} from '../components/SceneShell';
import {palette, progress} from '../visualUtils';

const NODES = [
  {id: 'ki', label: 'KI', x: 245, y: 330, accent: true},
  {id: 'liest', label: 'liest', x: 610, y: 260},
  {id: 'text', label: 'Text', x: 715, y: 585, accent: true},
  {id: 'anders', label: 'anders', x: 355, y: 730},
  {id: 'kontext', label: 'Kontext', x: 170, y: 570},
] as const;

const EDGES = [
  {from: 'ki', to: 'liest', strength: 0.95, start: 16},
  {from: 'liest', to: 'text', strength: 0.88, start: 28},
  {from: 'text', to: 'anders', strength: 0.72, start: 42},
  {from: 'ki', to: 'kontext', strength: 0.42, start: 50},
  {from: 'kontext', to: 'text', strength: 0.61, start: 58},
  {from: 'ki', to: 'text', strength: 1, start: 72},
] as const;

export const AttentionThreadWeaveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const nodesEnter = progress(frame, 0, 26);
  const pulse = Math.max(0, Math.sin((frame - 82) / 5)) * progress(frame, 80, 16);
  const collapse = progress(frame, 111, 22);

  return (
    <SceneShell sceneId="scene-04" background="radial-gradient(circle at 48% 50%, #FFFFFF 0%, #F5F1FC 50%, #E9E3F4 100%)">
      <div style={{position: 'absolute', left: 90, right: 90, top: 365, bottom: 350}}>
        <GlassPanel style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <div
            style={{
              position: 'absolute',
              left: 32,
              top: 26,
              fontFamily: 'monospace',
              fontSize: 19,
              fontWeight: 800,
              letterSpacing: 2,
              color: palette.muted,
            }}
          >
            ATTENTION MAP · CONNECTION WEIGHTS
          </div>

          <svg width="900" height="930" viewBox="0 0 900 930" style={{position: 'absolute', inset: 0}}>
            {EDGES.map((edge) => {
              const from = NODES.find((node) => node.id === edge.from)!;
              const to = NODES.find((node) => node.id === edge.to)!;
              const reveal = progress(frame, edge.start, 24);
              const dash = 1100;
              const midpointX = (from.x + to.x) / 2 + (edge.strength > 0.8 ? 55 : -35);
              const midpointY = (from.y + to.y) / 2 - 60 + edge.strength * 90;
              const strong = edge.strength >= 0.85;
              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={`M ${from.x} ${from.y} Q ${midpointX} ${midpointY} ${to.x} ${to.y}`}
                  fill="none"
                  stroke={strong ? palette.accent : palette.accentSoft}
                  strokeWidth={(5 + edge.strength * 12) * (1 + pulse * (strong ? 0.18 : 0.05))}
                  strokeLinecap="round"
                  strokeDasharray={dash}
                  strokeDashoffset={dash * (1 - reveal)}
                  opacity={(0.2 + edge.strength * 0.75) * (1 - collapse)}
                  style={{filter: strong ? 'drop-shadow(0 0 12px rgba(135,87,232,.42))' : undefined}}
                />
              );
            })}
          </svg>

          {NODES.map((node, index) => {
            const entry = progress(frame, index * 4, 18) * nodesEnter;
            const targetX = 450 + (index - 2) * 8;
            const targetY = 480 + (index - 2) * 6;
            const x = interpolate(collapse, [0, 1], [node.x, targetX]);
            const y = interpolate(collapse, [0, 1], [node.y, targetY]);
            const isStrong = node.id === 'ki' || node.id === 'text';
            return (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  transform: `translate(-50%, -50%) scale(${0.78 + entry * 0.22 + (isStrong ? pulse * 0.06 : 0)})`,
                  opacity: entry,
                  zIndex: 4,
                }}
              >
                <TokenCapsule text={node.label} accent={isStrong} />
                <div
                  style={{
                    marginTop: 10,
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    fontSize: 17,
                    fontWeight: 800,
                    color: isStrong ? palette.accent : palette.muted,
                    opacity: progress(frame, 72 + index * 2, 12) * (1 - collapse),
                  }}
                >
                  {isStrong ? 'HIGH WEIGHT' : 'CONTEXT'}
                </div>
              </div>
            );
          })}

          <div
            style={{
              position: 'absolute',
              left: 66,
              bottom: 38,
              right: 66,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: progress(frame, 64, 18) * (1 - collapse),
            }}
          >
            <span style={{fontFamily: 'Arial, sans-serif', fontSize: 22, fontWeight: 900, color: palette.foreground}}>SCHWACHE VERBINDUNG</span>
            <div style={{flex: 1, margin: '0 22px', height: 8, borderRadius: 999, background: `linear-gradient(90deg, ${palette.accentSoft}, ${palette.accent})`}} />
            <span style={{fontFamily: 'Arial, sans-serif', fontSize: 22, fontWeight: 900, color: palette.accent}}>STARKE VERBINDUNG</span>
          </div>
        </GlassPanel>
      </div>
    </SceneShell>
  );
};
