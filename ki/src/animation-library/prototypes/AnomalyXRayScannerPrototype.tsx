import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const STEPS = [
  {label: 'INPUT', status: 'ok'},
  {label: 'FILTER', status: 'ok'},
  {label: 'MODELL', status: 'error'},
  {label: 'OUTPUT', status: 'affected'},
] as const;

export const AnomalyXRayScannerPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const lineReveal = prototypeProgress(frame, 0, 38);
  const scan = prototypeProgress(frame, 38, 108);
  const isolate = prototypeProgress(frame, 100, 144);
  const repair = prototypeProgress(frame, 138, 174);
  const scannerX = interpolate(scan, [0, 1], [120, 820]);

  return (
    <PrototypeShell
      family="ERROR DETECTION"
      title="Anomaly X-Ray Scanner"
      subtitle="Ein normal wirkender Ablauf wird durchleuchtet, bis die versteckte Fehlerquelle sichtbar wird."
    >
      <GlassSurface
        style={{
          position: 'absolute',
          left: 74,
          right: 74,
          top: 390,
          bottom: 190,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 52,
            right: 52,
            top: 70,
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'monospace',
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 2,
            color: PROTOTYPE_PALETTE.muted,
          }}
        >
          <span>PROCESS HEALTH</span>
          <span style={{color: scan > 0.8 ? PROTOTYPE_PALETTE.danger : PROTOTYPE_PALETTE.accent}}>
            {scan > 0.8 ? 'ANOMALY FOUND' : 'SCANNING'}
          </span>
        </div>

        <svg width="932" height="1040" viewBox="0 0 932 1040" style={{position: 'absolute', inset: 0}}>
          <path
            d="M 120 530 C 250 530, 270 360, 385 360 S 550 660, 665 660 S 770 450, 820 450"
            fill="none"
            stroke={PROTOTYPE_PALETTE.line}
            strokeWidth={30}
            strokeLinecap="round"
          />
          <path
            d="M 120 530 C 250 530, 270 360, 385 360 S 550 660, 665 660 S 770 450, 820 450"
            fill="none"
            stroke={repair > 0.2 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.accent}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={1600}
            strokeDashoffset={1600 * (1 - lineReveal)}
            style={{filter: 'drop-shadow(0 0 10px rgba(135,87,232,.28))'}}
          />
        </svg>

        {STEPS.map((step, index) => {
          const points = [
            {x: 120, y: 530},
            {x: 385, y: 360},
            {x: 665, y: 660},
            {x: 820, y: 450},
          ];
          const point = points[index];
          const reveal = prototypeProgress(frame, 8 + index * 7, 28 + index * 7);
          const scanned = scannerX >= point.x;
          const isError = step.status === 'error' && scanned;
          const affected = step.status === 'affected' && scanned && repair < 0.4;
          const statusColor = repair > 0.55
            ? PROTOTYPE_PALETTE.success
            : isError || affected
              ? PROTOTYPE_PALETTE.danger
              : scanned
                ? PROTOTYPE_PALETTE.success
                : PROTOTYPE_PALETTE.accentSoft;
          return (
            <div
              key={step.label}
              style={{
                position: 'absolute',
                left: point.x,
                top: point.y,
                transform: `translate(-50%, -50%) scale(${0.78 + reveal * 0.22 + (isError ? isolate * 0.12 : 0)})`,
                opacity: reveal,
                zIndex: 6,
              }}
            >
              <div
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: 30,
                  background: 'rgba(255,255,255,.94)',
                  border: `5px solid ${statusColor}`,
                  boxShadow: `0 0 ${isError ? 42 : 24}px ${statusColor}55`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 42,
                  fontWeight: 900,
                  color: statusColor,
                }}
              >
                {repair > 0.55 || (!isError && !affected) ? '✓' : '!'}
              </div>
              <div
                style={{
                  marginTop: 12,
                  padding: '10px 14px',
                  borderRadius: 16,
                  background: 'rgba(255,255,255,.92)',
                  border: `1px solid ${statusColor}55`,
                  fontSize: 18,
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  color: statusColor,
                  textAlign: 'center',
                }}
              >
                {step.label}
              </div>
            </div>
          );
        })}

        <div
          style={{
            position: 'absolute',
            left: scannerX,
            top: 155,
            width: 26,
            height: 720,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, transparent, rgba(135,87,232,.7), white, rgba(135,87,232,.7), transparent)',
            boxShadow: '0 0 55px rgba(135,87,232,.68)',
            opacity: scan < 1 ? 0.95 : 0,
            zIndex: 10,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 210,
            right: 210,
            bottom: 95,
            padding: '25px 28px',
            borderRadius: 28,
            background: isolate > 0.2 && repair < 0.55
              ? 'rgba(255,93,108,.10)'
              : 'rgba(53,197,138,.10)',
            border: `2px solid ${repair > 0.55 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.danger}55`,
            textAlign: 'center',
            opacity: isolate,
            transform: `translateY(${(1 - isolate) * 55}px)`,
          }}
        >
          <div style={{fontSize: 20, fontWeight: 900, letterSpacing: 2.5, color: repair > 0.55 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.danger}}>
            {repair > 0.55 ? 'ROUTE REPARIERT' : 'URSACHE ISOLIERT'}
          </div>
          <div style={{marginTop: 12, fontSize: 28, lineHeight: 1.2, fontWeight: 900}}>
            {repair > 0.55 ? 'Alle Schritte laufen wieder stabil.' : 'Fehler entsteht im Modellschritt.'}
          </div>
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
