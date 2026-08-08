import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  getPrototypeLabel,
  getPrototypeValue,
  usePrototypeContent,
} from './PrototypeContentContext';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const DEFAULT_STEPS = ['INPUT', 'FILTER', 'MODELL', 'OUTPUT'] as const;
const STEP_POINTS = [
  {x: 120, y: 530},
  {x: 385, y: 360},
  {x: 665, y: 660},
  {x: 820, y: 450},
] as const;

const boundedInteger = (
  value: string | number,
  fallback: number,
  minimum: number,
  maximum: number,
): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isInteger(parsed)
    ? Math.max(minimum, Math.min(maximum, parsed))
    : fallback;
};

const compactText = (value: string, maximum: number): string =>
  value.length <= maximum ? value : `${value.slice(0, maximum - 1).trim()}…`;

export const AnomalyXRayScannerPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const lineReveal = prototypeProgress(frame, 0, 38);
  const scan = prototypeProgress(frame, 38, 108);
  const isolate = prototypeProgress(frame, 100, 144);
  const repair = prototypeProgress(frame, 138, 174);
  const scannerX = interpolate(scan, [0, 1], [120, 820]);
  const semanticSteps = content
    ? [...new Set([
        ...content.meaningContract.subjectTerms,
        ...content.meaningContract.actionTerms,
        ...content.meaningContract.resultTerms,
      ])]
    : [];
  const errorIndex = boundedInteger(
    getPrototypeValue({content, key: 'errorStep', fallback: 2}),
    2,
    0,
    DEFAULT_STEPS.length - 1,
  );
  const steps = DEFAULT_STEPS.map((fallback, index) => ({
    label: getPrototypeLabel({
      content,
      key: `step${index + 1}`,
      fallback: semanticSteps[index] ?? fallback,
    }),
    status:
      index === errorIndex
        ? 'error'
        : index > errorIndex
          ? 'affected'
          : 'ok',
  } as const));
  const errorScanned = scannerX >= STEP_POINTS[errorIndex].x;
  const healthLabel = getPrototypeLabel({
    content,
    key: 'healthLabel',
    fallback: 'PROCESS HEALTH',
  });
  const scanningLabel = getPrototypeLabel({
    content,
    key: 'scanningLabel',
    fallback: 'SCANNING',
  });
  const foundLabel = getPrototypeLabel({
    content,
    key: 'foundLabel',
    fallback: 'ANOMALY FOUND',
  });
  const isolatedLabel = getPrototypeLabel({
    content,
    key: 'isolatedLabel',
    fallback: 'URSACHE ISOLIERT',
  });
  const repairedLabel = getPrototypeLabel({
    content,
    key: 'repairedLabel',
    fallback: 'ROUTE REPARIERT',
  });
  const isolatedText = getPrototypeLabel({
    content,
    key: 'isolatedText',
    fallback: content
      ? compactText(content.meaningContract.visibleChange, 92)
      : `Fehler entsteht in ${steps[errorIndex].label}.`,
  });
  const repairedText = getPrototypeLabel({
    content,
    key: 'repairedText',
    fallback: content
      ? compactText(content.meaningContract.endState, 92)
      : 'Alle Schritte laufen wieder stabil.',
  });

  return (
    <PrototypeShell
      family="ERROR DETECTION"
      title="Anomaly X-Ray Scanner"
      subtitle="Der Ablauf wird von links nach rechts geprüft; nach der isolierten Ursache breitet sich die Reparatur gezielt durch die betroffenen Folgeschritte aus."
    >
      <GlassSurface style={{position: 'absolute', left: 74, right: 74, top: 390, bottom: 190, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 52, right: 52, top: 70, display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: 18, fontWeight: 800, letterSpacing: 2, color: PROTOTYPE_PALETTE.muted}}>
          <span style={{maxWidth: 420, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{healthLabel.toLocaleUpperCase('de-DE')}</span>
          <span style={{maxWidth: 360, color: errorScanned ? PROTOTYPE_PALETTE.danger : PROTOTYPE_PALETTE.accent, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{(errorScanned ? foundLabel : scanningLabel).toLocaleUpperCase('de-DE')}</span>
        </div>

        <svg width="932" height="1040" viewBox="0 0 932 1040" style={{position: 'absolute', inset: 0}}>
          <path d="M 120 530 C 250 530, 270 360, 385 360 S 550 660, 665 660 S 770 450, 820 450" fill="none" stroke={PROTOTYPE_PALETTE.line} strokeWidth={30} strokeLinecap="round" />
          <path d="M 120 530 C 250 530, 270 360, 385 360 S 550 660, 665 660 S 770 450, 820 450" fill="none" stroke={PROTOTYPE_PALETTE.accent} strokeWidth={12} strokeLinecap="round" strokeDasharray={1600} strokeDashoffset={1600 * (1 - lineReveal)} style={{filter: 'drop-shadow(0 0 10px rgba(135,87,232,.28))'}} />
          <path d="M 120 530 C 250 530, 270 360, 385 360 S 550 660, 665 660 S 770 450, 820 450" fill="none" stroke={PROTOTYPE_PALETTE.success} strokeWidth={12} strokeLinecap="round" strokeDasharray={1600} strokeDashoffset={1600 * (1 - repair)} opacity={repair} style={{filter: 'drop-shadow(0 0 10px rgba(53,197,138,.28))'}} />
        </svg>

        {steps.map((step, index) => {
          const point = STEP_POINTS[index];
          const reveal = prototypeProgress(frame, 8 + index * 7, 28 + index * 7);
          const scanned = scannerX >= point.x;
          const repairOffset = Math.max(0, index - errorIndex);
          const repairAtStep = index < errorIndex
            ? 1
            : prototypeProgress(frame, 138 + repairOffset * 9, 158 + repairOffset * 9);
          const repaired = repairAtStep > 0.65;
          const isError = step.status === 'error' && scanned && !repaired;
          const affected = step.status === 'affected' && scanned && !repaired;
          const statusColor = repaired || (step.status === 'ok' && scanned)
            ? PROTOTYPE_PALETTE.success
            : isError || affected
              ? PROTOTYPE_PALETTE.danger
              : PROTOTYPE_PALETTE.accentSoft;
          const symbol = repaired || (step.status === 'ok' && scanned) ? '✓' : isError || affected ? '!' : '·';
          return (
            <div key={`${step.label}-${index}`} style={{position: 'absolute', left: point.x, top: point.y, transform: `translate(-50%, -50%) scale(${0.78 + reveal * 0.22 + (isError ? isolate * 0.12 : 0)})`, opacity: reveal, zIndex: 6}}>
              <div style={{width: 112, height: 112, borderRadius: 30, background: 'rgba(255,255,255,.94)', border: `5px solid ${statusColor}`, boxShadow: `0 0 ${isError ? 42 : 24}px ${statusColor}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, fontWeight: 900, color: statusColor}}>{symbol}</div>
              <div style={{marginTop: 12, maxWidth: 185, padding: '10px 14px', borderRadius: 16, background: 'rgba(255,255,255,.92)', border: `1px solid ${statusColor}55`, fontSize: step.label.length > 13 ? 14 : 18, fontWeight: 900, letterSpacing: 1.5, color: statusColor, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{step.label.toLocaleUpperCase('de-DE')}</div>
              {index >= errorIndex && repairAtStep > 0 && repairAtStep < 1 ? (
                <div style={{marginTop: 8, fontFamily: 'monospace', fontSize: 13, fontWeight: 900, color: PROTOTYPE_PALETTE.success}}>{content ? 'REPARATUR LÄUFT' : `REPAIR ${Math.round(repairAtStep * 100)}%`}</div>
              ) : null}
            </div>
          );
        })}

        <div style={{position: 'absolute', left: scannerX, top: 155, width: 26, height: 720, transform: 'translateX(-50%)', background: 'linear-gradient(180deg, transparent, rgba(135,87,232,.7), white, rgba(135,87,232,.7), transparent)', boxShadow: '0 0 55px rgba(135,87,232,.68)', opacity: scan < 1 ? 0.95 : 0, zIndex: 10}} />

        <div style={{position: 'absolute', left: 170, right: 170, bottom: 95, padding: '25px 28px', borderRadius: 28, background: isolate > 0.2 && repair < 0.72 ? 'rgba(255,93,108,.10)' : 'rgba(53,197,138,.10)', border: `2px solid ${repair > 0.72 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.danger}55`, textAlign: 'center', opacity: isolate, transform: `translateY(${(1 - isolate) * 55}px)`}}>
          <div style={{fontSize: 20, fontWeight: 900, letterSpacing: 2.5, color: repair > 0.72 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.danger}}>{(repair > 0.72 ? repairedLabel : isolatedLabel).toLocaleUpperCase('de-DE')}</div>
          <div style={{marginTop: 12, fontSize: (repair > 0.72 ? repairedText : isolatedText).length > 70 ? 20 : 28, lineHeight: 1.2, fontWeight: 900, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{repair > 0.72 ? repairedText : isolatedText}</div>
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
