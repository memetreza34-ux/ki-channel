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

const DEFAULT_GATES = [
  {label: 'LAYER 1', x: 250, color: '#8757E8'},
  {label: 'LAYER 2', x: 470, color: '#35C58A'},
  {label: 'LAYER 3', x: 690, color: '#FFB648'},
] as const;

const compactText = (value: string, maximum: number): string =>
  value.length <= maximum ? value : `${value.slice(0, maximum - 1).trim()}…`;

export const ResidualRiverPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const river = prototypeProgress(frame, 0, 42);
  const resolve = prototypeProgress(frame, 142, 174);
  const stageTerms = content
    ? [...new Set([
        ...content.meaningContract.preferredExplanationPatterns,
        ...content.meaningContract.actionTerms,
        ...content.meaningContract.resultTerms,
      ])]
    : [];
  const gates = DEFAULT_GATES.map((gate, index) => ({
    ...gate,
    label: getPrototypeLabel({
      content,
      key: `layer${index + 1}`,
      fallback: stageTerms[index] ?? gate.label,
    }),
    progress: prototypeProgress(frame, 38 + index * 30, 72 + index * 30),
  }));
  const inputLabel = getPrototypeLabel({
    content,
    key: 'inputLabel',
    fallback: 'HAUPTSTROM',
  });
  const inputValue = getPrototypeLabel({
    content,
    key: 'inputValue',
    fallback: content?.meaningContract.subjectTerms[0]
      ? compactText(content.meaningContract.subjectTerms.slice(0, 3).join(' + '), 48)
      : 'Grundinformation',
  });
  const outputLabel = getPrototypeLabel({
    content,
    key: 'outputLabel',
    fallback: 'VERFEINERTER OUTPUT',
  });
  const outputValue = getPrototypeLabel({
    content,
    key: 'outputValue',
    fallback: content
      ? compactText(content.meaningContract.endState, 82)
      : 'Altes Signal + neue Verarbeitung',
  });
  const totalProcessing = gates.reduce((sum, gate) => sum + gate.progress, 0) / gates.length;
  const packetTravel = prototypeProgress(frame, 30, 142);
  const packetX = interpolate(packetTravel, [0, 1], [95, 855]);
  const activeLayerIndex = gates.findIndex((gate) => gate.progress > 0.15 && gate.progress < 0.92);
  const completedLayers = gates.filter((gate) => gate.progress > 0.82).length;

  return (
    <PrototypeShell
      family="MODEL PROCESSING"
      title="Residual River"
      subtitle="Das Eingangssignal passiert die Verarbeitungsschichten nacheinander. Jede Schicht verändert den aktuellen Zustand, bevor er an die nächste weitergegeben wird."
    >
      <GlassSurface style={{position: 'absolute', left: 72, right: 72, top: 390, bottom: 190, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 72, right: 72, top: 72, display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr auto 1fr auto 1fr', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 900, letterSpacing: 1.5, color: PROTOTYPE_PALETTE.muted, opacity: river}}>
          <div style={{textAlign: 'center'}}>INPUT</div>
          <div>→</div>
          {gates.map((gate, index) => (
            <React.Fragment key={`chain-${gate.label}`}>
              <div style={{textAlign: 'center', color: gate.progress > 0.72 ? gate.color : PROTOTYPE_PALETTE.muted}}>LAYER {index + 1}</div>
              <div>→</div>
            </React.Fragment>
          ))}
          <div style={{textAlign: 'center', color: resolve > 0.5 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.muted}}>OUTPUT</div>
        </div>

        <svg width="936" height="1080" viewBox="0 0 936 1080" style={{position: 'absolute', inset: 0}}>
          <path d="M 80 610 C 240 530, 360 680, 520 590 S 760 520, 880 610" fill="none" stroke="rgba(135,87,232,.14)" strokeWidth={118} strokeLinecap="round" />
          <path d="M 80 610 C 240 530, 360 680, 520 590 S 760 520, 880 610" fill="none" stroke={PROTOTYPE_PALETTE.accent} strokeWidth={54} strokeLinecap="round" strokeDasharray={1500} strokeDashoffset={1500 * (1 - river)} style={{filter: 'drop-shadow(0 0 20px rgba(135,87,232,.28))'}} />
          {gates.map((gate, index) => {
            const side = index % 2 === 0 ? -1 : 1;
            const sideY = 610 + side * 230;
            return (
              <React.Fragment key={`${gate.label}-${index}`}>
                <path d={`M ${gate.x} ${sideY} Q ${gate.x + 25} ${610 + side * 75}, ${gate.x + 70} 610`} fill="none" stroke={gate.color} strokeWidth={13} strokeLinecap="round" strokeDasharray={480} strokeDashoffset={480 * (1 - gate.progress)} opacity={gate.progress} />
                <circle cx={gate.x} cy={sideY} r={23} fill={gate.color} opacity={gate.progress} />
              </React.Fragment>
            );
          })}
        </svg>

        {gates.map((gate, index) => {
          const reveal = prototypeProgress(frame, 18 + index * 14, 44 + index * 14);
          const active = gate.progress > 0.12 && gate.progress < 0.92;
          const completed = gate.progress >= 0.92;
          return (
            <div key={`${gate.label}-${index}`} style={{position: 'absolute', left: gate.x, top: 610, transform: `translate(-50%, -50%) scale(${0.82 + reveal * 0.18 + (active ? 0.06 : 0)})`, opacity: reveal, zIndex: 6}}>
              <div style={{width: 145, height: 190, borderRadius: 32, background: completed ? `${gate.color}12` : 'rgba(255,255,255,.92)', border: `4px solid ${active || completed ? gate.color : PROTOTYPE_PALETTE.line}`, boxShadow: active ? `0 0 42px ${gate.color}55` : completed ? `0 0 28px ${gate.color}33` : '0 16px 42px rgba(55,38,83,.10)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 11, padding: 10, boxSizing: 'border-box'}}>
                <div style={{width: 45, height: 45, borderRadius: 14, background: gate.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 22, fontWeight: 900}}>{completed ? '✓' : index + 1}</div>
                <div style={{fontSize: gate.label.length > 15 ? 14 : 18, fontWeight: 900, color: active || completed ? gate.color : PROTOTYPE_PALETTE.muted, textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{gate.label.toLocaleUpperCase('de-DE')}</div>
                <div style={{fontFamily: 'monospace', fontSize: 13, fontWeight: 900, color: active ? gate.color : completed ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.muted}}>{completed ? 'VERARBEITET' : active ? `${Math.round(gate.progress * 100)}%` : 'WARTET'}</div>
              </div>
            </div>
          );
        })}

        <div style={{position: 'absolute', left: packetX, top: 610, width: 34 + totalProcessing * 14, height: 34 + totalProcessing * 14, borderRadius: 999, background: completedLayers === gates.length ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.white, border: `6px solid ${activeLayerIndex >= 0 ? gates[activeLayerIndex].color : PROTOTYPE_PALETTE.accent}`, boxShadow: '0 0 25px rgba(135,87,232,.35)', transform: 'translate(-50%, -50%)', opacity: river, zIndex: 8}} />

        <div style={{position: 'absolute', left: 100, top: 220, width: 275, padding: '20px 24px', borderRadius: 24, background: 'rgba(135,87,232,.08)', border: '2px solid rgba(135,87,232,.2)', opacity: river}}>
          <div style={{fontSize: inputLabel.length > 18 ? 14 : 18, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.accent, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{inputLabel.toLocaleUpperCase('de-DE')}</div>
          <div style={{marginTop: 10, fontSize: inputValue.length > 30 ? 20 : 26, fontWeight: 900, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{inputValue}</div>
          <div style={{marginTop: 8, fontFamily: 'monospace', fontSize: 14, fontWeight: 900, color: PROTOTYPE_PALETTE.muted}}>{completedLayers}/{gates.length} SCHICHTEN</div>
        </div>

        <div style={{position: 'absolute', right: 90, bottom: 70, width: 365, padding: '24px 28px', borderRadius: 28, background: PROTOTYPE_PALETTE.foreground, color: PROTOTYPE_PALETTE.white, opacity: resolve, transform: `translateY(${(1 - resolve) * 55}px)`, boxShadow: '0 22px 60px rgba(20,18,26,.2)'}}>
          <div style={{fontSize: outputLabel.length > 22 ? 14 : 18, fontWeight: 900, letterSpacing: 2.5, color: PROTOTYPE_PALETTE.accentSoft, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{outputLabel.toLocaleUpperCase('de-DE')}</div>
          <div style={{marginTop: 12, fontSize: outputValue.length > 58 ? 21 : 30, lineHeight: 1.18, fontWeight: 900, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{outputValue}</div>
          <div style={{marginTop: 10, fontFamily: 'monospace', fontSize: 14, fontWeight: 900, color: PROTOTYPE_PALETTE.success}}>{completedLayers}/{gates.length} SCHICHTEN VERARBEITET</div>
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
