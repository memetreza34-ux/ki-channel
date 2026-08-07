import React from 'react';
import {useCurrentFrame} from 'remotion';
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

const CRACKS = [
  'M 470 410 L 510 520 L 455 610 L 500 760',
  'M 510 520 L 640 480 L 720 560',
  'M 455 610 L 330 655 L 250 760',
  'M 500 760 L 620 835 L 690 930',
] as const;

const compactText = (value: string, maximum: number): string =>
  value.length <= maximum ? value : `${value.slice(0, maximum - 1).trim()}…`;

export const ConfidenceGlassCrackPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const statement = prototypeProgress(frame, 0, 34);
  const polish = prototypeProgress(frame, 24, 66);
  const pressure = prototypeProgress(frame, 58, 108);
  const evidence = prototypeProgress(frame, 136, 174);
  const claim = getPrototypeLabel({
    content,
    key: 'claim',
    fallback: content?.spokenText
      ? compactText(content.spokenText, 105)
      : 'Diese Aussage ist definitiv korrekt.',
  });
  const confidence = getPrototypeLabel({
    content,
    key: 'confidenceLabel',
    fallback: 'SEHR SICHER FORMULIERT',
  });
  const checks = [
    getPrototypeLabel({content, key: 'check1', fallback: 'QUELLE?'}),
    getPrototypeLabel({content, key: 'check2', fallback: 'DATUM?'}),
    getPrototypeLabel({content, key: 'check3', fallback: 'BELEG?'}),
  ];
  const warningLabel = getPrototypeLabel({
    content,
    key: 'warningLabel',
    fallback: 'WARNUNG',
  });
  const warningText = getPrototypeLabel({
    content,
    key: 'warningText',
    fallback: content
      ? compactText(content.meaningContract.endState, 125)
      : 'Sicherheit im Ton ist kein Beweis für Wahrheit.',
  });
  const confidenceValue = Number(
    content?.values?.confidence ?? 98,
  );
  const safeConfidence = Number.isFinite(confidenceValue)
    ? Math.max(0, Math.min(100, confidenceValue))
    : 98;
  const checkProgresses = checks.map((_, index) =>
    prototypeProgress(frame, 64 + index * 14, 88 + index * 14),
  );
  const failedChecks = checkProgresses.filter((value) => value > 0.72).length;
  const crackStrength = failedChecks / checks.length;

  return (
    <PrototypeShell
      family="RISK CONTRAST"
      title="Confidence Glass Crack"
      subtitle="Die Behauptung wirkt zunächst sicher. Jede fehlende Verifikation schwächt sie sichtbar, bis die unbelegte Sicherheit zusammenbricht."
    >
      <GlassSurface style={{position: 'absolute', left: 74, right: 74, top: 390, bottom: 190, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 120, right: 120, top: 215, height: 560, borderRadius: 40, background: 'linear-gradient(145deg, rgba(255,255,255,.78), rgba(198,168,255,.16))', border: `3px solid ${failedChecks > 0 ? 'rgba(255,93,108,.32)' : 'rgba(255,255,255,.92)'}`, boxShadow: `0 28px 85px rgba(55,38,83,${0.14 + pressure * 0.12})`, backdropFilter: 'blur(18px)', opacity: statement, transform: `scale(${0.92 + statement * 0.08 - crackStrength * 0.018})`, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: -220 + polish * 1050, top: -140, width: 180, height: 850, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.8), transparent)', transform: 'rotate(18deg)', opacity: 0.8 * (1 - crackStrength)}} />
          <div style={{position: 'absolute', left: 58, right: 58, top: 105, textAlign: 'center', fontSize: confidence.length > 24 ? 19 : 24, fontWeight: 900, letterSpacing: 3, color: failedChecks > 0 ? PROTOTYPE_PALETTE.danger : PROTOTYPE_PALETTE.accent}}>{confidence.toLocaleUpperCase('de-DE')}</div>
          <div style={{position: 'absolute', left: 60, right: 60, top: 180, textAlign: 'center', fontSize: claim.length > 80 ? 31 : claim.length > 50 ? 38 : 46, lineHeight: 1.12, fontWeight: 900, color: PROTOTYPE_PALETTE.foreground, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>„{claim}“</div>
          <div style={{position: 'absolute', left: 115, right: 115, bottom: 80, height: 22, borderRadius: 999, background: 'rgba(135,87,232,.10)', overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${Math.max(0, safeConfidence * (1 - crackStrength * 0.58))}%`, background: failedChecks > 0 ? `linear-gradient(90deg, ${PROTOTYPE_PALETTE.warning}, ${PROTOTYPE_PALETTE.danger})` : `linear-gradient(90deg, ${PROTOTYPE_PALETTE.accentSoft}, ${PROTOTYPE_PALETTE.accent})`, boxShadow: '0 0 20px rgba(135,87,232,.32)'}} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 30, textAlign: 'center', fontFamily: 'monospace', fontSize: 22, fontWeight: 900, color: failedChecks > 0 ? PROTOTYPE_PALETTE.danger : PROTOTYPE_PALETTE.accent}}>CONFIDENCE {safeConfidence}% · {failedChecks}/3 CHECKS FEHLEN</div>
        </div>

        <svg width="932" height="1080" viewBox="0 0 932 1080" style={{position: 'absolute', inset: 0, zIndex: 8}}>
          {CRACKS.map((path, index) => {
            const sourceCheck = Math.min(index, checks.length - 1);
            const reveal = Math.max(0, Math.min(1, (checkProgresses[sourceCheck] - 0.55) / 0.45));
            return <path key={path} d={path} fill="none" stroke={PROTOTYPE_PALETTE.danger} strokeWidth={8 - index} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={500} strokeDashoffset={500 * (1 - reveal)} opacity={reveal} style={{filter: 'drop-shadow(0 0 8px rgba(255,93,108,.45))'}} />;
          })}
        </svg>

        {checks.map((label, index) => {
          const show = checkProgresses[index];
          const failed = show > 0.72;
          return <div key={`${label}-${index}`} style={{position: 'absolute', left: 150 + index * 300, top: 875 + (index % 2) * 40, width: 190, padding: '18px 20px', borderRadius: 24, background: failed ? 'rgba(255,93,108,.13)' : 'rgba(255,182,72,.09)', border: `2px solid ${failed ? 'rgba(255,93,108,.45)' : 'rgba(255,182,72,.30)'}`, color: failed ? PROTOTYPE_PALETTE.danger : PROTOTYPE_PALETTE.warning, textAlign: 'center', fontSize: label.length > 12 ? 18 : 24, fontWeight: 900, letterSpacing: 2, opacity: show * (1 - evidence * 0.65), transform: `translateY(${(1 - show) * 55}px) scale(${0.85 + show * 0.15})`, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
            <div>{label.toLocaleUpperCase('de-DE')}</div>
            <div style={{marginTop: 7, fontSize: 13, letterSpacing: 1.6}}>{failed ? 'FEHLT' : 'PRÜFUNG'}</div>
          </div>;
        })}

        <div style={{position: 'absolute', left: 110, right: 110, bottom: 58, padding: '28px 32px', borderRadius: 30, background: PROTOTYPE_PALETTE.foreground, color: PROTOTYPE_PALETTE.white, textAlign: 'center', opacity: evidence, transform: `translateY(${(1 - evidence) * 58}px)`, zIndex: 12}}>
          <div style={{fontSize: 20, fontWeight: 900, letterSpacing: 3, color: PROTOTYPE_PALETTE.danger}}>{warningLabel.toLocaleUpperCase('de-DE')}</div>
          <div style={{marginTop: 12, fontSize: warningText.length > 90 ? 25 : 34, lineHeight: 1.18, fontWeight: 900, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{warningText}</div>
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
