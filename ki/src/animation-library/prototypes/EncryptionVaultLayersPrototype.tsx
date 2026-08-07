import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  getPrototypeLabel,
  usePrototypeContent,
} from './PrototypeContentContext';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const DEFAULT_SHELLS = [
  {label: 'TRANSPORT', size: 610, color: '#C6A8FF', start: 24},
  {label: 'VERSCHLÜSSELUNG', size: 470, color: '#8757E8', start: 52},
  {label: 'BERECHTIGUNG', size: 330, color: '#35C58A', start: 82},
] as const;

const compactText = (value: string, maximum: number): string =>
  value.length <= maximum ? value : `${value.slice(0, maximum - 1).trim()}…`;

export const EncryptionVaultLayersPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const dataEnter = prototypeProgress(frame, 0, 42);
  const vaultReveal = prototypeProgress(frame, 28, 72);
  const lock = prototypeProgress(frame, 108, 158);
  const result = prototypeProgress(frame, 148, 176);
  const dataTravel = prototypeProgress(frame, 12, 104);
  const dataX = interpolate(dataTravel, [0, 1], [90, 466]);
  const terms = content
    ? [...new Set([
        ...content.meaningContract.subjectTerms,
        ...content.meaningContract.actionTerms,
        ...content.meaningContract.resultTerms,
      ])]
    : [];
  const shells = DEFAULT_SHELLS.map((shell, index) => ({
    ...shell,
    label: getPrototypeLabel({
      content,
      key: `securityLayer${index + 1}`,
      fallback: terms[index + 1] ?? shell.label,
    }),
    progress: prototypeProgress(frame, shell.start, shell.start + 36),
  }));
  const allLayersActive = Math.min(...shells.map((shell) => shell.progress));
  const locked = allLayersActive > 0.78 && lock > 0.55;
  const routeLabel = getPrototypeLabel({
    content,
    key: 'routeLabel',
    fallback: 'ZERO-TRUST DATA ROUTE',
  });
  const dataLabel = getPrototypeLabel({
    content,
    key: 'dataLabel',
    fallback: terms[0] ?? 'DATA',
  });
  const vaultLabel = getPrototypeLabel({
    content,
    key: 'vaultLabel',
    fallback: 'VAULT',
  });
  const verifyingLabel = getPrototypeLabel({
    content,
    key: 'verifyingLabel',
    fallback: 'VERIFYING',
  });
  const lockedLabel = getPrototypeLabel({
    content,
    key: 'lockedLabel',
    fallback: 'LOCKED',
  });
  const resultLabel = getPrototypeLabel({
    content,
    key: 'resultLabel',
    fallback: 'ZUGRIFF GESCHÜTZT',
  });
  const resultText = getPrototypeLabel({
    content,
    key: 'resultText',
    fallback: content
      ? compactText(content.meaningContract.endState, 100)
      : 'Nur berechtigte Systeme erreichen die Daten.',
  });

  return (
    <PrototypeShell
      family="SECURITY PRIVACY"
      title="Encryption Vault Layers"
      subtitle="Die Daten passieren die Schutzschichten nacheinander. Erst wenn Transport, Verschlüsselung und Berechtigung aktiv sind, verriegelt der Tresor."
    >
      <GlassSurface style={{position: 'absolute', left: 72, right: 72, top: 390, bottom: 190, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 45, right: 45, top: 68, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'monospace', fontSize: 18, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.muted}}>
          <span style={{maxWidth: 520, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{routeLabel.toLocaleUpperCase('de-DE')}</span>
          <span style={{color: locked ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.accent}}>{shells.filter((shell) => shell.progress > 0.78).length}/3 SCHICHTEN AKTIV</span>
        </div>

        <div style={{position: 'absolute', left: dataX, top: 540, transform: `translate(-50%, -50%) scale(${0.82 + dataEnter * 0.18 - allLayersActive * 0.08})`, opacity: dataEnter * (1 - result * 0.35), zIndex: 10}}>
          <div style={{width: 112, height: 112, borderRadius: 28, background: `linear-gradient(135deg, ${PROTOTYPE_PALETTE.foreground}, #382A52)`, border: `6px solid ${locked ? PROTOTYPE_PALETTE.success : 'white'}`, boxShadow: locked ? '0 0 42px rgba(53,197,138,.38)' : '0 0 40px rgba(20,18,26,.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: PROTOTYPE_PALETTE.white, fontSize: dataLabel.length > 10 ? 18 : 35, fontWeight: 900, textAlign: 'center', padding: 8, boxSizing: 'border-box', overflow: 'hidden'}}>{dataLabel.toLocaleUpperCase('de-DE')}</div>
        </div>

        <div style={{position: 'absolute', left: 466, top: 540, width: 690, height: 690, transform: 'translate(-50%, -50%)', opacity: vaultReveal}}>
          {shells.map((shell, index) => {
            const active = shell.progress > 0.72;
            return (
              <div key={`${shell.label}-${index}`} style={{position: 'absolute', left: '50%', top: '50%', width: shell.size, height: shell.size, borderRadius: '50%', transform: `translate(-50%, -50%) scale(${1.18 - shell.progress * 0.18})`, border: `${8 - index}px solid ${shell.color}`, background: active ? `${shell.color}12` : `${shell.color}08`, boxShadow: active ? `0 0 45px ${shell.color}44 inset, 0 0 34px ${shell.color}33` : 'none', opacity: shell.progress}}>
                <div style={{position: 'absolute', left: '50%', top: -42, minWidth: 190, maxWidth: 280, transform: 'translateX(-50%)', padding: '10px 15px', borderRadius: 15, background: 'rgba(255,255,255,.96)', border: `2px solid ${shell.color}66`, color: shell.color, textAlign: 'center', fontSize: shell.label.length > 18 ? 12 : 16, fontWeight: 900, letterSpacing: 1.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  <div>{shell.label.toLocaleUpperCase('de-DE')}</div>
                  <div style={{marginTop: 5, fontSize: 11, letterSpacing: 1.3}}>{active ? 'AKTIV ✓' : 'PRÜFUNG'}</div>
                </div>
                {Array.from({length: 6}, (_, marker) => {
                  const angle = (marker / 6) * Math.PI * 2;
                  return <div key={marker} style={{position: 'absolute', left: `${50 + Math.cos(angle) * 48}%`, top: `${50 + Math.sin(angle) * 48}%`, width: 18, height: 18, borderRadius: 999, background: active ? shell.color : 'rgba(255,255,255,.78)', border: `3px solid ${shell.color}`, boxShadow: active ? `0 0 18px ${shell.color}66` : 'none', transform: 'translate(-50%, -50%)'}} />;
                })}
              </div>
            );
          })}

          <div style={{position: 'absolute', left: '50%', top: '50%', width: 210, height: 245, transform: `translate(-50%, -50%) scale(${0.9 + lock * 0.1})`, borderRadius: '34px 34px 24px 24px', background: `linear-gradient(145deg, ${PROTOTYPE_PALETTE.foreground}, #3B2B56)`, border: `5px solid ${locked ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.accentSoft}`, boxShadow: `0 22px 65px rgba(20,18,26,.28), 0 0 ${locked ? 42 : lock * 18}px rgba(53,197,138,.4)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: PROTOTYPE_PALETTE.white}}>
            <div style={{width: 72, height: 62, borderRadius: '42px 42px 0 0', border: `14px solid ${locked ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.accentSoft}`, borderBottom: 0, transform: `translateY(${locked ? 0 : -18}px)`}} />
            <div style={{marginTop: 16, maxWidth: 175, fontSize: vaultLabel.length > 12 ? 17 : 25, fontWeight: 900, letterSpacing: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{vaultLabel.toLocaleUpperCase('de-DE')}</div>
            <div style={{marginTop: 9, maxWidth: 175, fontFamily: 'monospace', fontSize: 18, fontWeight: 900, color: locked ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.accentSoft, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{(locked ? lockedLabel : verifyingLabel).toLocaleUpperCase('de-DE')}</div>
          </div>
        </div>

        <div style={{position: 'absolute', left: 105, right: 105, bottom: 54, padding: '24px 28px', borderRadius: 28, background: 'rgba(53,197,138,.11)', border: '2px solid rgba(53,197,138,.35)', textAlign: 'center', opacity: result * (locked ? 1 : 0.35), transform: `translateY(${(1 - result) * 52}px)`}}>
          <div style={{fontSize: resultLabel.length > 25 ? 15 : 20, fontWeight: 900, letterSpacing: 2.5, color: PROTOTYPE_PALETTE.success, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{resultLabel.toLocaleUpperCase('de-DE')}</div>
          <div style={{marginTop: 10, fontSize: resultText.length > 72 ? 21 : 30, lineHeight: 1.18, fontWeight: 900, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{resultText}</div>
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
