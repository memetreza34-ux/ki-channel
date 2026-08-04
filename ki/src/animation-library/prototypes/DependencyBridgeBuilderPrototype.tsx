import React from 'react';
import {useCurrentFrame} from 'remotion';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const ISLANDS = [
  {label: 'KI', x: 170, y: 640},
  {label: 'liest', x: 450, y: 410},
  {label: 'Text', x: 755, y: 640},
] as const;

export const DependencyBridgeBuilderPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const islands = prototypeProgress(frame, 0, 30);
  const bridgeOne = prototypeProgress(frame, 24, 78);
  const bridgeTwo = prototypeProgress(frame, 58, 112);
  const loadTest = prototypeProgress(frame, 102, 145);
  const result = prototypeProgress(frame, 136, 172);

  return (
    <PrototypeShell
      family="RELATIONSHIP NETWORK"
      title="Dependency Bridge Builder"
      subtitle="Starke Wortbeziehungen tragen stabile Brücken, schwache Verbindungen lösen sich wieder."
    >
      <GlassSurface style={{position: 'absolute', left: 72, right: 72, top: 390, bottom: 190, overflow: 'hidden'}}>
        <svg width="936" height="1080" viewBox="0 0 936 1080" style={{position: 'absolute', inset: 0}}>
          <path d="M 170 640 Q 300 330 450 410" fill="none" stroke={PROTOTYPE_PALETTE.accent} strokeWidth={18} strokeLinecap="round" strokeDasharray={600} strokeDashoffset={600 * (1 - bridgeOne)} style={{filter: 'drop-shadow(0 0 12px rgba(135,87,232,.34))'}} />
          <path d="M 450 410 Q 610 330 755 640" fill="none" stroke={PROTOTYPE_PALETTE.accent} strokeWidth={14} strokeLinecap="round" strokeDasharray={600} strokeDashoffset={600 * (1 - bridgeTwo)} />
          <path d="M 170 640 Q 450 850 755 640" fill="none" stroke={PROTOTYPE_PALETTE.accentSoft} strokeWidth={7} strokeLinecap="round" strokeDasharray="18 16" opacity={(1 - loadTest) * bridgeTwo} />
        </svg>

        {ISLANDS.map((island, index) => (
          <div key={island.label} style={{position: 'absolute', left: island.x, top: island.y, transform: `translate(-50%, -50%) scale(${0.75 + islands * 0.25})`, opacity: islands, zIndex: 5}}>
            <div style={{width: 170, height: 118, borderRadius: '52% 48% 46% 54%', background: index === 1 ? `linear-gradient(135deg, ${PROTOTYPE_PALETTE.accent}, #6938CE)` : 'linear-gradient(135deg, #FFFFFF, #EDE7F8)', border: '3px solid rgba(135,87,232,.28)', boxShadow: index === 1 ? '0 18px 50px rgba(135,87,232,.32)' : '0 16px 42px rgba(55,38,83,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: index === 1 ? PROTOTYPE_PALETTE.white : PROTOTYPE_PALETTE.foreground, fontSize: 34, fontWeight: 900}}>
              {island.label}
            </div>
          </div>
        ))}

        {[0.22, 0.48, 0.76].map((position, index) => {
          const pulse = prototypeProgress(frame, 82 + index * 10, 105 + index * 10) * (1 - prototypeProgress(frame, 120 + index * 5, 138 + index * 5));
          return <div key={position} style={{position: 'absolute', left: 170 + position * 585, top: 520 - Math.sin(position * Math.PI) * 150, width: 24, height: 24, borderRadius: 999, background: PROTOTYPE_PALETTE.white, border: `7px solid ${PROTOTYPE_PALETTE.accent}`, boxShadow: '0 0 30px rgba(135,87,232,.48)', opacity: pulse, transform: `translate(-50%, -50%) scale(${0.75 + pulse * 0.45})`, zIndex: 8}} />;
        })}

        <div style={{position: 'absolute', left: 110, right: 110, top: 820, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, opacity: loadTest}}>
          <div style={{padding: '22px', borderRadius: 24, background: 'rgba(53,197,138,.10)', border: '2px solid rgba(53,197,138,.35)', textAlign: 'center'}}>
            <div style={{fontSize: 19, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.success}}>STARKE BEZIEHUNG</div>
            <div style={{marginTop: 10, fontSize: 27, fontWeight: 900}}>KI → liest → Text</div>
          </div>
          <div style={{padding: '22px', borderRadius: 24, background: 'rgba(255,93,108,.08)', border: '2px solid rgba(255,93,108,.28)', textAlign: 'center'}}>
            <div style={{fontSize: 19, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.danger}}>SCHWACHE DIREKTLINIE</div>
            <div style={{marginTop: 10, fontSize: 27, fontWeight: 900}}>wird verworfen</div>
          </div>
        </div>

        <div style={{position: 'absolute', left: 180, right: 180, bottom: 54, padding: '20px 26px', borderRadius: 24, background: PROTOTYPE_PALETTE.foreground, color: PROTOTYPE_PALETTE.white, textAlign: 'center', fontSize: 24, fontWeight: 900, opacity: result, transform: `translateY(${(1 - result) * 40}px)`}}>
          Gewichtete Verbindungen bestimmen den <span style={{color: PROTOTYPE_PALETTE.accentSoft}}>Kontext</span>.
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
