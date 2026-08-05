import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const STATIONS = [
  {label: 'INPUT', x: 145, y: 720},
  {label: 'PRÜFEN', x: 340, y: 530},
  {label: 'PLANEN', x: 535, y: 700},
  {label: 'AUSFÜHREN', x: 710, y: 470},
  {label: 'ERGEBNIS', x: 815, y: 250},
] as const;

export const SubwayWorkflowMapPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const mapReveal = prototypeProgress(frame, 0, 48);
  const travel = prototypeProgress(frame, 44, 145);
  const arrive = prototypeProgress(frame, 138, 172);

  const segment = Math.min(STATIONS.length - 2, Math.floor(travel * (STATIONS.length - 1)));
  const local = travel * (STATIONS.length - 1) - segment;
  const current = STATIONS[segment];
  const next = STATIONS[segment + 1];
  const packetX = interpolate(local, [0, 1], [current.x, next.x]);
  const packetY = interpolate(local, [0, 1], [current.y, next.y]);

  return (
    <PrototypeShell
      family="PROCESS FLOW"
      title="Subway Workflow Map"
      subtitle="Ein Prozess wird als Strecke mit Stationen, Übergaben und Ziel sichtbar."
    >
      <GlassSurface
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          top: 385,
          bottom: 190,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 34,
            top: 26,
            fontFamily: 'monospace',
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 2,
            color: PROTOTYPE_PALETTE.muted,
          }}
        >
          AUTOMATION LINE · LIVE ROUTE
        </div>

        <svg width="936" height="1100" viewBox="0 0 936 1100" style={{position: 'absolute', inset: 0}}>
          <path
            d="M 145 720 C 220 720, 270 530, 340 530 S 470 700, 535 700 S 655 470, 710 470 S 790 300, 815 250"
            fill="none"
            stroke={PROTOTYPE_PALETTE.line}
            strokeWidth={28}
            strokeLinecap="round"
          />
          <path
            d="M 145 720 C 220 720, 270 530, 340 530 S 470 700, 535 700 S 655 470, 710 470 S 790 300, 815 250"
            fill="none"
            stroke={PROTOTYPE_PALETTE.accent}
            strokeWidth={13}
            strokeLinecap="round"
            strokeDasharray={1500}
            strokeDashoffset={1500 * (1 - mapReveal)}
            style={{filter: 'drop-shadow(0 0 12px rgba(135,87,232,.35))'}}
          />
          <path
            d="M 535 700 C 660 820, 745 820, 825 880"
            fill="none"
            stroke={PROTOTYPE_PALETTE.warning}
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray="22 18"
            opacity={prototypeProgress(frame, 70, 108)}
          />
        </svg>

        {STATIONS.map((station, index) => {
          const reveal = prototypeProgress(frame, 8 + index * 8, 28 + index * 8);
          const active = travel >= index / (STATIONS.length - 1);
          return (
            <div
              key={station.label}
              style={{
                position: 'absolute',
                left: station.x,
                top: station.y,
                transform: `translate(-50%, -50%) scale(${0.76 + reveal * 0.24})`,
                opacity: reveal,
                zIndex: 4,
              }}
            >
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 999,
                  background: active ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.white,
                  border: `8px solid ${active ? PROTOTYPE_PALETTE.white : PROTOTYPE_PALETTE.accentSoft}`,
                  boxShadow: active
                    ? '0 0 30px rgba(135,87,232,.48)'
                    : '0 10px 26px rgba(55,38,83,.12)',
                }}
              />
              <div
                style={{
                  marginTop: 12,
                  padding: '10px 14px',
                  borderRadius: 15,
                  background: 'rgba(255,255,255,.92)',
                  border: '1px solid rgba(135,87,232,.18)',
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  color: active ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.muted,
                  whiteSpace: 'nowrap',
                }}
              >
                {station.label}
              </div>
            </div>
          );
        })}

        <div
          style={{
            position: 'absolute',
            left: packetX,
            top: packetY,
            width: 54,
            height: 54,
            borderRadius: 18,
            background: `linear-gradient(135deg, ${PROTOTYPE_PALETTE.foreground}, #3A2D55)`,
            border: '5px solid white',
            boxShadow: '0 0 34px rgba(20,18,26,.32)',
            transform: `translate(-50%, -50%) rotate(${travel * 420}deg)`,
            zIndex: 8,
          }}
        />

        <div
          style={{
            position: 'absolute',
            right: 70,
            bottom: 80,
            width: 230,
            padding: '22px 24px',
            borderRadius: 26,
            background: 'rgba(255,182,72,.10)',
            border: '2px solid rgba(255,182,72,.38)',
            opacity: prototypeProgress(frame, 74, 112) * (1 - arrive),
          }}
        >
          <div style={{fontSize: 18, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.warning}}>ALTERNATIVROUTE</div>
          <div style={{marginTop: 10, fontSize: 23, lineHeight: 1.25, fontWeight: 800}}>Fehler führt zur Prüfung zurück.</div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 130,
            right: 130,
            bottom: 58,
            padding: '20px 26px',
            borderRadius: 26,
            background: PROTOTYPE_PALETTE.foreground,
            color: PROTOTYPE_PALETTE.white,
            textAlign: 'center',
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: 2,
            opacity: arrive,
            transform: `translateY(${(1 - arrive) * 48}px)`,
          }}
        >
          WORKFLOW ERFOLGREICH ABGESCHLOSSEN
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
