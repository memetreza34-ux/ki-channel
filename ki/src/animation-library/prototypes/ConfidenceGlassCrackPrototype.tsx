import React from 'react';
import {useCurrentFrame} from 'remotion';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const CRACKS = [
  'M 470 410 L 510 520 L 455 610 L 500 760',
  'M 510 520 L 640 480 L 720 560',
  'M 455 610 L 330 655 L 250 760',
  'M 500 760 L 620 835 L 690 930',
] as const;

export const ConfidenceGlassCrackPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const statement = prototypeProgress(frame, 0, 34);
  const polish = prototypeProgress(frame, 24, 66);
  const pressure = prototypeProgress(frame, 58, 108);
  const crack = prototypeProgress(frame, 98, 145);
  const evidence = prototypeProgress(frame, 136, 174);

  return (
    <PrototypeShell
      family="RISK CONTRAST"
      title="Confidence Glass Crack"
      subtitle="Eine überzeugend formulierte Aussage zerbricht, sobald Belege und Quellen fehlen."
    >
      <GlassSurface style={{position: 'absolute', left: 74, right: 74, top: 390, bottom: 190, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 120, right: 120, top: 215, height: 560, borderRadius: 40, background: 'linear-gradient(145deg, rgba(255,255,255,.78), rgba(198,168,255,.16))', border: '3px solid rgba(255,255,255,.92)', boxShadow: `0 28px 85px rgba(55,38,83,${0.14 + pressure * 0.12})`, backdropFilter: 'blur(18px)', opacity: statement, transform: `scale(${0.92 + statement * 0.08 + pressure * 0.025})`, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: -220 + polish * 1050, top: -140, width: 180, height: 850, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.8), transparent)', transform: 'rotate(18deg)', opacity: 0.8}} />
          <div style={{position: 'absolute', left: 58, right: 58, top: 115, textAlign: 'center', fontSize: 24, fontWeight: 900, letterSpacing: 3, color: PROTOTYPE_PALETTE.accent}}>SEHR SICHER FORMULIERT</div>
          <div style={{position: 'absolute', left: 60, right: 60, top: 190, textAlign: 'center', fontSize: 46, lineHeight: 1.12, fontWeight: 900, color: PROTOTYPE_PALETTE.foreground}}>„Diese Aussage ist definitiv korrekt.“</div>
          <div style={{position: 'absolute', left: 115, right: 115, bottom: 80, height: 22, borderRadius: 999, background: 'rgba(135,87,232,.10)', overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${88 + pressure * 10}%`, background: `linear-gradient(90deg, ${PROTOTYPE_PALETTE.accentSoft}, ${PROTOTYPE_PALETTE.accent})`, boxShadow: '0 0 20px rgba(135,87,232,.42)'}} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 30, textAlign: 'center', fontFamily: 'monospace', fontSize: 22, fontWeight: 900, color: PROTOTYPE_PALETTE.accent}}>CONFIDENCE 98%</div>
        </div>

        <svg width="932" height="1080" viewBox="0 0 932 1080" style={{position: 'absolute', inset: 0, zIndex: 8}}>
          {CRACKS.map((path, index) => {
            const reveal = prototypeProgress(frame, 102 + index * 7, 135 + index * 7);
            return <path key={path} d={path} fill="none" stroke={PROTOTYPE_PALETTE.danger} strokeWidth={8 - index} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={500} strokeDashoffset={500 * (1 - reveal)} opacity={crack} style={{filter: 'drop-shadow(0 0 8px rgba(255,93,108,.45))'}} />;
          })}
        </svg>

        {['QUELLE?', 'DATUM?', 'BELEG?'].map((label, index) => {
          const show = prototypeProgress(frame, 64 + index * 12, 90 + index * 12);
          return <div key={label} style={{position: 'absolute', left: 150 + index * 300, top: 875 + (index % 2) * 40, width: 190, padding: '18px 20px', borderRadius: 24, background: 'rgba(255,93,108,.10)', border: '2px solid rgba(255,93,108,.38)', color: PROTOTYPE_PALETTE.danger, textAlign: 'center', fontSize: 24, fontWeight: 900, letterSpacing: 2, opacity: show * (1 - evidence * 0.65), transform: `translateY(${(1 - show) * 55}px) scale(${0.85 + show * 0.15})`}}>{label}</div>;
        })}

        <div style={{position: 'absolute', left: 130, right: 130, bottom: 58, padding: '28px 32px', borderRadius: 30, background: PROTOTYPE_PALETTE.foreground, color: PROTOTYPE_PALETTE.white, textAlign: 'center', opacity: evidence, transform: `translateY(${(1 - evidence) * 58}px)`, zIndex: 12}}>
          <div style={{fontSize: 20, fontWeight: 900, letterSpacing: 3, color: PROTOTYPE_PALETTE.danger}}>WARNUNG</div>
          <div style={{marginTop: 12, fontSize: 34, lineHeight: 1.18, fontWeight: 900}}>Sicherheit im Ton ist kein Beweis für Wahrheit.</div>
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
