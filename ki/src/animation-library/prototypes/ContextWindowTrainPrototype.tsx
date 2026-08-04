import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const MESSAGES = [
  {id: 'm1', label: 'Frage 1', priority: false},
  {id: 'm2', label: 'Antwort 1', priority: false},
  {id: 'm3', label: 'Wichtige Regel', priority: true},
  {id: 'm4', label: 'Frage 2', priority: false},
  {id: 'm5', label: 'Antwort 2', priority: false},
  {id: 'm6', label: 'Neue Frage', priority: false},
] as const;

export const ContextWindowTrainPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const trainEnter = prototypeProgress(frame, 0, 42);
  const newMessage = prototypeProgress(frame, 58, 100);
  const overflow = prototypeProgress(frame, 92, 134);
  const pin = prototypeProgress(frame, 118, 156);
  const windowStart = interpolate(overflow, [0, 1], [0, 1]);

  return (
    <PrototypeShell
      family="CONTEXT WINDOW"
      title="Context Window Train"
      subtitle="Neue Nachrichten schieben alte Informationen aus dem begrenzten Kontext – wichtige Regeln können angeheftet bleiben."
    >
      <div style={{position: 'absolute', left: 82, right: 82, top: 405, bottom: 170}}>
        <GlassSurface style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <div
            style={{
              position: 'absolute',
              left: 68,
              right: 68,
              top: 150,
              height: 620,
              borderRadius: 36,
              border: `5px solid ${PROTOTYPE_PALETTE.foreground}`,
              background: 'rgba(248,247,251,.72)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 24,
                left: 32,
                right: 32,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: 2,
                color: PROTOTYPE_PALETTE.muted,
              }}
            >
              <span>AKTIVER KONTEXT</span>
              <span style={{color: PROTOTYPE_PALETTE.accent}}>4 PLÄTZE</span>
            </div>

            <div
              style={{
                position: 'absolute',
                left: 24,
                right: 24,
                top: 105,
                height: 360,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                transform: `translateX(${interpolate(trainEnter, [0, 1], [780, 0]) - windowStart * 196}px)`,
              }}
            >
              {MESSAGES.map((message, index) => {
                const appearing = index < 5 ? trainEnter : newMessage;
                const isOldest = index === 0;
                const isPinned = message.priority;
                const opacity = isOldest ? 1 - overflow : appearing;
                const lift = isPinned ? pin * -86 : 0;
                return (
                  <div
                    key={message.id}
                    style={{
                      flex: '0 0 176px',
                      height: 250,
                      borderRadius: 28,
                      background: isPinned
                        ? `linear-gradient(145deg, ${PROTOTYPE_PALETTE.accent}, #6E3CD0)`
                        : 'white',
                      border: `3px solid ${isPinned ? 'rgba(255,255,255,.4)' : PROTOTYPE_PALETTE.line}`,
                      boxShadow: isPinned
                        ? '0 20px 52px rgba(135,87,232,.34)'
                        : '0 16px 38px rgba(48,34,74,.12)',
                      opacity,
                      transform: `translateY(${lift}px) scale(${0.88 + appearing * 0.12})`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      padding: 20,
                      boxSizing: 'border-box',
                      color: isPinned ? 'white' : PROTOTYPE_PALETTE.foreground,
                      position: 'relative',
                    }}
                  >
                    <div style={{fontSize: 18, fontWeight: 900, letterSpacing: 2, opacity: 0.72}}>#{index + 1}</div>
                    <div style={{marginTop: 18, fontSize: 28, lineHeight: 1.08, fontWeight: 900}}>{message.label}</div>
                    {isPinned ? (
                      <div
                        style={{
                          position: 'absolute',
                          top: -24,
                          width: 54,
                          height: 54,
                          borderRadius: 999,
                          background: PROTOTYPE_PALETTE.warning,
                          border: '5px solid white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 28,
                          transform: `scale(${0.6 + pin * 0.4})`,
                        }}
                      >
                        ●
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                position: 'absolute',
                left: 34,
                right: 34,
                bottom: 42,
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10,
              }}
            >
              {[0, 1, 2, 3].map((slot) => (
                <div
                  key={slot}
                  style={{
                    height: 16,
                    borderRadius: 999,
                    background: slot === 2 && pin > 0.5
                      ? PROTOTYPE_PALETTE.warning
                      : PROTOTYPE_PALETTE.accent,
                    opacity: 0.35 + slot * 0.15,
                  }}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              left: 120,
              top: 830,
              width: 270,
              padding: '22px 24px',
              borderRadius: 24,
              background: 'rgba(255,93,108,.10)',
              border: '2px solid rgba(255,93,108,.34)',
              opacity: overflow,
              transform: `translateX(${(1 - overflow) * -60}px)`,
              textAlign: 'center',
            }}
          >
            <div style={{fontSize: 21, fontWeight: 900, color: PROTOTYPE_PALETTE.danger}}>ÄLTESTE INFO</div>
            <div style={{fontSize: 27, fontWeight: 900, marginTop: 9}}>verlässt das Fenster</div>
          </div>

          <div
            style={{
              position: 'absolute',
              right: 112,
              top: 830,
              width: 320,
              padding: '22px 24px',
              borderRadius: 24,
              background: 'rgba(255,182,72,.12)',
              border: '2px solid rgba(255,182,72,.38)',
              opacity: pin,
              transform: `translateX(${(1 - pin) * 60}px)`,
              textAlign: 'center',
            }}
          >
            <div style={{fontSize: 21, fontWeight: 900, color: '#B97800'}}>ANGEHEFTET</div>
            <div style={{fontSize: 27, fontWeight: 900, marginTop: 9}}>wichtige Regel bleibt aktiv</div>
          </div>
        </GlassSurface>
      </div>
    </PrototypeShell>
  );
};
