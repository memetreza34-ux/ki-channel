import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const SHELLS = [
  {label: 'TRANSPORT', size: 610, color: '#C6A8FF', start: 24},
  {label: 'VERSCHLÜSSELUNG', size: 470, color: '#8757E8', start: 52},
  {label: 'BERECHTIGUNG', size: 330, color: '#35C58A', start: 82},
] as const;

export const EncryptionVaultLayersPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const dataEnter = prototypeProgress(frame, 0, 42);
  const vaultReveal = prototypeProgress(frame, 28, 72);
  const lock = prototypeProgress(frame, 108, 158);
  const result = prototypeProgress(frame, 148, 176);
  const dataX = interpolate(prototypeProgress(frame, 12, 104), [0, 1], [90, 466]);

  return (
    <PrototypeShell
      family="SECURITY PRIVACY"
      title="Encryption Vault Layers"
      subtitle="Sensible Daten durchlaufen mehrere Schutzschichten, bevor der Tresor sie freigibt."
    >
      <GlassSurface style={{position: 'absolute', left: 72, right: 72, top: 390, bottom: 190, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 45, top: 68, fontFamily: 'monospace', fontSize: 18, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.muted}}>
          ZERO-TRUST DATA ROUTE
        </div>

        <div style={{position: 'absolute', left: dataX, top: 540, transform: `translate(-50%, -50%) rotate(${frame * 1.8}deg) scale(${0.82 + dataEnter * 0.18})`, opacity: dataEnter, zIndex: 10}}>
          <div style={{width: 104, height: 104, borderRadius: 28, background: `linear-gradient(135deg, ${PROTOTYPE_PALETTE.foreground}, #382A52)`, border: '6px solid white', boxShadow: '0 0 40px rgba(20,18,26,.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: PROTOTYPE_PALETTE.white, fontSize: 35, fontWeight: 900}}>DATA</div>
        </div>

        <div style={{position: 'absolute', left: 466, top: 540, width: 690, height: 690, transform: 'translate(-50%, -50%)', opacity: vaultReveal}}>
          {SHELLS.map((shell, index) => {
            const close = prototypeProgress(frame, shell.start, shell.start + 36);
            return (
              <div key={shell.label} style={{position: 'absolute', left: '50%', top: '50%', width: shell.size, height: shell.size, borderRadius: '50%', transform: `translate(-50%, -50%) scale(${1.18 - close * 0.18}) rotate(${(index % 2 === 0 ? 1 : -1) * frame * 0.22}deg)`, border: `${8 - index}px solid ${shell.color}`, background: `${shell.color}0D`, boxShadow: close > 0.7 ? `0 0 45px ${shell.color}44 inset, 0 0 34px ${shell.color}33` : 'none', opacity: close}}>
                <div style={{position: 'absolute', left: '50%', top: -38, transform: 'translateX(-50%)', padding: '10px 15px', borderRadius: 15, background: 'rgba(255,255,255,.94)', border: `2px solid ${shell.color}66`, color: shell.color, fontSize: 16, fontWeight: 900, letterSpacing: 1.8, whiteSpace: 'nowrap'}}>{shell.label}</div>
                {Array.from({length: 6}, (_, marker) => {
                  const angle = (marker / 6) * Math.PI * 2;
                  return <div key={marker} style={{position: 'absolute', left: `${50 + Math.cos(angle) * 48}%`, top: `${50 + Math.sin(angle) * 48}%`, width: 18, height: 18, borderRadius: 999, background: shell.color, boxShadow: `0 0 18px ${shell.color}66`, transform: 'translate(-50%, -50%)'}} />;
                })}
              </div>
            );
          })}

          <div style={{position: 'absolute', left: '50%', top: '50%', width: 210, height: 245, transform: `translate(-50%, -50%) scale(${0.9 + lock * 0.1})`, borderRadius: '34px 34px 24px 24px', background: `linear-gradient(145deg, ${PROTOTYPE_PALETTE.foreground}, #3B2B56)`, border: `5px solid ${lock > 0.6 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.accentSoft}`, boxShadow: `0 22px 65px rgba(20,18,26,.28), 0 0 ${lock * 40}px rgba(53,197,138,.4)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: PROTOTYPE_PALETTE.white}}>
            <div style={{width: 72, height: 62, borderRadius: '42px 42px 0 0', border: `14px solid ${lock > 0.55 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.accentSoft}`, borderBottom: 0, transform: `translateY(${interpolate(lock, [0, 1], [-18, 0])}px)`}} />
            <div style={{marginTop: 16, fontSize: 25, fontWeight: 900, letterSpacing: 2}}>VAULT</div>
            <div style={{marginTop: 9, fontFamily: 'monospace', fontSize: 18, fontWeight: 900, color: lock > 0.55 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.accentSoft}}>{lock > 0.55 ? 'LOCKED' : 'VERIFYING'}</div>
          </div>
        </div>

        <div style={{position: 'absolute', left: 130, right: 130, bottom: 54, padding: '24px 28px', borderRadius: 28, background: 'rgba(53,197,138,.11)', border: '2px solid rgba(53,197,138,.35)', textAlign: 'center', opacity: result, transform: `translateY(${(1 - result) * 52}px)`}}>
          <div style={{fontSize: 20, fontWeight: 900, letterSpacing: 2.5, color: PROTOTYPE_PALETTE.success}}>ZUGRIFF GESCHÜTZT</div>
          <div style={{marginTop: 10, fontSize: 30, lineHeight: 1.18, fontWeight: 900}}>Nur berechtigte Systeme erreichen die Daten.</div>
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
