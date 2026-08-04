import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const LEAKS = [
  {label: 'zu langer Prompt', x: 210, y: 790, amount: 18},
  {label: 'unnötiger Kontext', x: 450, y: 885, amount: 27},
  {label: 'falsches Modell', x: 690, y: 760, amount: 21},
] as const;

export const BudgetLeakMeterPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = prototypeProgress(frame, 0, 34);
  const leakOpen = prototypeProgress(frame, 30, 72);
  const optimize = prototypeProgress(frame, 102, 148);
  const saved = prototypeProgress(frame, 142, 174);
  const drain = leakOpen * (1 - optimize);
  const level = Math.max(0.26, fill * (0.88 - drain * 0.42 + optimize * 0.26));
  const cost = Math.round(interpolate(level, [0.26, 0.88], [94, 28]));

  return (
    <PrototypeShell
      family="COST EFFICIENCY"
      title="Budget Leak Meter"
      subtitle="Kosten werden nicht nur gezählt – die Animation zeigt sichtbar, wo Budget verloren geht."
    >
      <div style={{position: 'absolute', left: 90, right: 90, top: 380, bottom: 170}}>
        <GlassSurface style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <div
            style={{
              position: 'absolute',
              left: 175,
              right: 175,
              top: 120,
              height: 690,
              borderRadius: '42px 42px 90px 90px',
              border: `5px solid ${PROTOTYPE_PALETTE.foreground}`,
              background: 'rgba(255,255,255,.65)',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 60px rgba(61,42,94,.08), 0 24px 60px rgba(45,31,70,.12)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: `${level * 100}%`,
                background: `linear-gradient(180deg, ${PROTOTYPE_PALETTE.accentSoft}, ${PROTOTYPE_PALETTE.accent})`,
                boxShadow: '0 -10px 34px rgba(135,87,232,.35)',
              }}
            >
              {Array.from({length: 8}, (_, index) => (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    left: 45 + index * 72,
                    top: 25 + Math.sin((frame + index * 13) / 8) * 13,
                    width: 16 + (index % 3) * 8,
                    height: 16 + (index % 3) * 8,
                    borderRadius: 999,
                    border: '2px solid rgba(255,255,255,.65)',
                    opacity: 0.3 + (index % 4) * 0.12,
                  }}
                />
              ))}
            </div>

            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: level > 0.52 ? 'white' : PROTOTYPE_PALETTE.foreground,
                textShadow: level > 0.52 ? '0 2px 12px rgba(60,35,100,.35)' : 'none',
              }}
            >
              <div style={{fontSize: 22, fontWeight: 900, letterSpacing: 3}}>KOSTEN PRO REEL</div>
              <div style={{fontSize: 96, lineHeight: 1, fontWeight: 900, letterSpacing: -5, marginTop: 18}}>{cost} €</div>
            </div>
          </div>

          {LEAKS.map((leak, index) => {
            const localOpen = Math.max(0, Math.min(1, (leakOpen - index * 0.12) / 0.68));
            const seal = Math.max(0, Math.min(1, (optimize - index * 0.1) / 0.72));
            const stream = localOpen * (1 - seal);
            return (
              <React.Fragment key={leak.label}>
                <div
                  style={{
                    position: 'absolute',
                    left: leak.x,
                    top: leak.y,
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    background: seal > 0.7 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.danger,
                    border: '6px solid white',
                    boxShadow: `0 0 28px ${seal > 0.7 ? 'rgba(53,197,138,.5)' : 'rgba(255,93,108,.5)'}`,
                    transform: `translate(-50%, -50%) scale(${0.6 + localOpen * 0.4})`,
                    zIndex: 6,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: leak.x - 10,
                    top: leak.y + 22,
                    width: 20,
                    height: 250 * stream,
                    borderRadius: '0 0 14px 14px',
                    background: `linear-gradient(180deg, ${PROTOTYPE_PALETTE.accent}, transparent)`,
                    opacity: stream,
                    filter: 'blur(1px)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: leak.x,
                    top: leak.y + 92,
                    transform: 'translateX(-50%)',
                    width: 210,
                    padding: '14px 18px',
                    borderRadius: 18,
                    background: 'rgba(255,255,255,.94)',
                    border: `2px solid ${seal > 0.7 ? 'rgba(53,197,138,.38)' : 'rgba(255,93,108,.32)'}`,
                    boxShadow: '0 12px 30px rgba(40,28,64,.10)',
                    opacity: localOpen,
                    textAlign: 'center',
                    fontSize: 19,
                    lineHeight: 1.15,
                    fontWeight: 850,
                  }}
                >
                  <div>{leak.label}</div>
                  <div style={{marginTop: 8, color: seal > 0.7 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.danger, fontWeight: 900}}>
                    {seal > 0.7 ? 'ABGEDICHTET' : `−${leak.amount} €`}
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          <div
            style={{
              position: 'absolute',
              left: 150,
              right: 150,
              bottom: 58,
              padding: '22px 28px',
              borderRadius: 25,
              background: 'rgba(53,197,138,.10)',
              border: '2px solid rgba(53,197,138,.36)',
              opacity: saved,
              transform: `translateY(${(1 - saved) * 42}px) scale(${0.94 + saved * 0.06})`,
              display: 'flex',
              justifyContent: 'center',
              gap: 14,
              fontSize: 28,
              fontWeight: 900,
            }}
          >
            <span style={{color: PROTOTYPE_PALETTE.success}}>66 € GESPART</span>
            <span style={{color: PROTOTYPE_PALETTE.muted}}>durch drei konkrete Optimierungen</span>
          </div>
        </GlassSurface>
      </div>
    </PrototypeShell>
  );
};
