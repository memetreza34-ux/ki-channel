import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const BRANCHES = [
  {label: 'günstig?', x: 185, y: 485, valid: true, start: 24},
  {label: 'schnell?', x: 715, y: 485, valid: true, start: 35},
  {label: 'unsicher?', x: 145, y: 835, valid: false, start: 52},
  {label: 'skalierbar?', x: 460, y: 920, valid: true, start: 62},
  {label: 'zu komplex?', x: 755, y: 830, valid: false, start: 72},
] as const;

export const DecisionTreeBurstPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const core = prototypeProgress(frame, 0, 24);
  const prune = prototypeProgress(frame, 104, 142);
  const route = prototypeProgress(frame, 126, 170);

  return (
    <PrototypeShell
      family="DECISION LOGIC"
      title="Decision Tree Burst"
      subtitle="Eine Frage öffnet mehrere Wege. Unpassende Äste verschwinden, der begründete Pfad bleibt sichtbar."
    >
      <div style={{position: 'absolute', left: 82, right: 82, top: 390, bottom: 170}}>
        <GlassSurface style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <svg width="916" height="1270" viewBox="0 0 916 1270" style={{position: 'absolute', inset: 0}}>
            {BRANCHES.map((branch, index) => {
              const reveal = prototypeProgress(frame, branch.start, branch.start + 28);
              const faded = branch.valid ? 1 : 1 - prune;
              const controlX = 458 + (branch.x - 458) * 0.32;
              const controlY = 350 + (branch.y - 350) * 0.58;
              const dash = 920;
              return (
                <path
                  key={branch.label}
                  d={`M 458 350 Q ${controlX} ${controlY} ${branch.x} ${branch.y}`}
                  fill="none"
                  stroke={branch.valid ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.danger}
                  strokeWidth={branch.valid ? 10 : 7}
                  strokeLinecap="round"
                  strokeDasharray={dash}
                  strokeDashoffset={dash * (1 - reveal)}
                  opacity={(branch.valid ? 0.78 : 0.55) * faded}
                  style={{filter: branch.valid && route > 0.4 ? 'drop-shadow(0 0 10px rgba(135,87,232,.42))' : undefined}}
                />
              );
            })}

            <path
              d="M 460 920 C 470 1010, 470 1085, 458 1155"
              fill="none"
              stroke={PROTOTYPE_PALETTE.success}
              strokeWidth={13}
              strokeLinecap="round"
              strokeDasharray="600"
              strokeDashoffset={600 * (1 - route)}
              opacity={route}
              style={{filter: 'drop-shadow(0 0 12px rgba(53,197,138,.45))'}}
            />
          </svg>

          <div
            style={{
              position: 'absolute',
              left: 458,
              top: 350,
              transform: `translate(-50%, -50%) scale(${0.65 + core * 0.35})`,
              width: 285,
              height: 190,
              borderRadius: 36,
              background: `linear-gradient(145deg, ${PROTOTYPE_PALETTE.accent}, #6B39D0)`,
              color: 'white',
              border: '4px solid rgba(255,255,255,.45)',
              boxShadow: '0 24px 60px rgba(135,87,232,.35)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: 24,
              boxSizing: 'border-box',
              zIndex: 5,
            }}
          >
            <div style={{fontSize: 20, fontWeight: 900, letterSpacing: 3, opacity: 0.8}}>ENTSCHEIDUNG</div>
            <div style={{fontSize: 37, lineHeight: 1.05, fontWeight: 900, marginTop: 12}}>Welches Tool passt?</div>
          </div>

          {BRANCHES.map((branch, index) => {
            const reveal = prototypeProgress(frame, branch.start + 8, branch.start + 30);
            const remove = branch.valid ? 0 : prune;
            const validGlow = branch.valid ? route * (index === 3 ? 1 : 0.35) : 0;
            return (
              <div
                key={branch.label}
                style={{
                  position: 'absolute',
                  left: branch.x,
                  top: branch.y,
                  transform: `translate(-50%, -50%) scale(${0.75 + reveal * 0.25 - remove * 0.25}) rotate(${remove * (index % 2 ? 13 : -13)}deg)`,
                  width: 225,
                  minHeight: 120,
                  borderRadius: 28,
                  background: branch.valid ? 'white' : 'rgba(255,93,108,.08)',
                  border: `3px solid ${branch.valid ? (validGlow > 0.4 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.accentSoft) : PROTOTYPE_PALETTE.danger}`,
                  boxShadow: branch.valid
                    ? `0 16px ${35 + validGlow * 25}px rgba(135,87,232,.16)`
                    : '0 14px 34px rgba(255,93,108,.13)',
                  opacity: reveal * (1 - remove),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: 29,
                  fontWeight: 900,
                  color: branch.valid ? PROTOTYPE_PALETTE.foreground : PROTOTYPE_PALETTE.danger,
                  zIndex: 4,
                }}
              >
                {branch.label}
              </div>
            );
          })}

          <div
            style={{
              position: 'absolute',
              left: 458,
              top: 1155,
              transform: `translate(-50%, -50%) scale(${0.72 + route * 0.28})`,
              width: 390,
              padding: '28px 32px',
              borderRadius: 30,
              background: 'rgba(53,197,138,.12)',
              border: '3px solid rgba(53,197,138,.55)',
              boxShadow: '0 20px 52px rgba(53,197,138,.20)',
              opacity: route,
              textAlign: 'center',
            }}
          >
            <div style={{fontSize: 21, fontWeight: 900, letterSpacing: 3, color: PROTOTYPE_PALETTE.success}}>GEWÄHLTER PFAD</div>
            <div style={{fontSize: 34, lineHeight: 1.08, fontWeight: 900, marginTop: 12}}>günstig + schnell + skalierbar</div>
          </div>

          <div
            style={{
              position: 'absolute',
              left: 70,
              right: 70,
              bottom: 32,
              display: 'flex',
              justifyContent: 'space-between',
              opacity: prune,
              fontSize: 20,
              fontWeight: 850,
              color: PROTOTYPE_PALETTE.muted,
            }}
          >
            <span><b style={{color: PROTOTYPE_PALETTE.danger}}>2</b> Äste verworfen</span>
            <span><b style={{color: PROTOTYPE_PALETTE.success}}>1</b> begründeter Weg</span>
          </div>
        </GlassSurface>
      </div>
    </PrototypeShell>
  );
};
