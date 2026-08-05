import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const STAGES = [
  {label: 'ZIEL', owner: 'MENSCH', x: 135, color: '#FFB648'},
  {label: 'ENTWURF', owner: 'KI', x: 355, color: '#8757E8'},
  {label: 'PRÜFUNG', owner: 'MENSCH', x: 575, color: '#FFB648'},
  {label: 'AUSFÜHRUNG', owner: 'KI', x: 795, color: '#8757E8'},
] as const;

export const HumanAIRelayPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const track = prototypeProgress(frame, 0, 32);
  const taskProgress = prototypeProgress(frame, 22, 145);
  const finish = prototypeProgress(frame, 138, 174);

  return (
    <PrototypeShell
      family="HUMAN AI COLLABORATION"
      title="Human AI Relay"
      subtitle="Der Mensch gibt Ziel und Urteil. Die KI übernimmt Tempo und Ausführung."
    >
      <div style={{position: 'absolute', left: 78, right: 78, top: 400, bottom: 170}}>
        <GlassSurface style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <div
            style={{
              position: 'absolute',
              left: 78,
              right: 78,
              top: 285,
              height: 16,
              borderRadius: 999,
              background: PROTOTYPE_PALETTE.line,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${track * 100}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${PROTOTYPE_PALETTE.warning}, ${PROTOTYPE_PALETTE.accent}, ${PROTOTYPE_PALETTE.warning}, ${PROTOTYPE_PALETTE.accent})`,
              }}
            />
          </div>

          {STAGES.map((stage, index) => {
            const stageProgress = Math.max(0, Math.min(1, (taskProgress * 4 - index)));
            const active = Math.max(0, 1 - Math.abs(taskProgress * 3.4 - index));
            return (
              <div
                key={stage.label}
                style={{
                  position: 'absolute',
                  left: stage.x,
                  top: 293,
                  transform: `translate(-50%, -50%) scale(${0.7 + stageProgress * 0.3 + active * 0.08})`,
                  width: 145,
                  height: 145,
                  borderRadius: 999,
                  background: stage.color,
                  border: '8px solid white',
                  boxShadow: `0 0 ${25 + active * 35}px ${stage.color}66`,
                  opacity: track,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 23,
                  fontWeight: 900,
                  zIndex: 4,
                }}
              >
                {index + 1}
              </div>
            );
          })}

          {STAGES.map((stage, index) => {
            const reveal = prototypeProgress(frame, 18 + index * 22, 45 + index * 22);
            const active = Math.max(0, 1 - Math.abs(taskProgress * 3.4 - index));
            return (
              <div
                key={`${stage.label}-panel`}
                style={{
                  position: 'absolute',
                  left: stage.x,
                  top: index % 2 === 0 ? 500 : 690,
                  transform: `translateX(-50%) translateY(${(1 - reveal) * 38}px) scale(${1 + active * 0.03})`,
                  width: 185,
                  minHeight: 190,
                  borderRadius: 28,
                  padding: '24px 18px',
                  boxSizing: 'border-box',
                  background: 'white',
                  border: `3px solid ${stage.color}${active > 0.35 ? '' : '55'}`,
                  boxShadow: active > 0.35
                    ? `0 20px 55px ${stage.color}33`
                    : '0 14px 34px rgba(45,31,70,.10)',
                  opacity: reveal,
                  textAlign: 'center',
                }}
              >
                <div style={{fontSize: 18, fontWeight: 900, letterSpacing: 2, color: stage.color}}>{stage.owner}</div>
                <div style={{fontSize: 27, lineHeight: 1.05, fontWeight: 900, marginTop: 15}}>{stage.label}</div>
                <div style={{fontSize: 18, lineHeight: 1.18, fontWeight: 700, color: PROTOTYPE_PALETTE.muted, marginTop: 17}}>
                  {index === 0
                    ? 'Absicht und Grenzen festlegen'
                    : index === 1
                      ? 'schnell mehrere Optionen erzeugen'
                      : index === 2
                        ? 'Qualität und Wahrheit beurteilen'
                        : 'freigegebene Lösung umsetzen'}
                </div>
              </div>
            );
          })}

          <div
            style={{
              position: 'absolute',
              left: interpolate(taskProgress, [0, 1], [135, 795]),
              top: 293,
              transform: 'translate(-50%, -50%)',
              width: 72,
              height: 44,
              borderRadius: 16,
              background: 'white',
              border: `4px solid ${taskProgress < 0.2 || (taskProgress > 0.52 && taskProgress < 0.78) ? PROTOTYPE_PALETTE.warning : PROTOTYPE_PALETTE.accent}`,
              boxShadow: '0 12px 28px rgba(45,31,70,.20)',
              zIndex: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 900,
            }}
          >
            TASK
          </div>

          <div
            style={{
              position: 'absolute',
              left: 135,
              right: 135,
              bottom: 64,
              padding: '26px 30px',
              borderRadius: 28,
              background: `linear-gradient(135deg, ${PROTOTYPE_PALETTE.foreground}, #302741)`,
              color: 'white',
              opacity: finish,
              transform: `translateY(${(1 - finish) * 45}px)`,
              textAlign: 'center',
              boxShadow: '0 22px 58px rgba(20,18,26,.24)',
            }}
          >
            <div style={{fontSize: 34, fontWeight: 900}}>BESSER ALS „MENSCH ODER KI“</div>
            <div style={{fontSize: 23, fontWeight: 750, marginTop: 12, color: PROTOTYPE_PALETTE.accentSoft}}>Die Stärke liegt in der richtigen Übergabe.</div>
          </div>
        </GlassSurface>
      </div>
    </PrototypeShell>
  );
};
