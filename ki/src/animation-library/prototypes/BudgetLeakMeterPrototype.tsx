import React from 'react';
import {useCurrentFrame} from 'remotion';
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

const DEFAULT_LEAKS = [
  {label: 'zu langer Prompt', x: 210, y: 790, amount: 18},
  {label: 'unnötiger Kontext', x: 450, y: 885, amount: 27},
  {label: 'falsches Modell', x: 690, y: 760, amount: 21},
] as const;

const numericValue = (
  value: string | number,
  fallback: number,
): number => {
  const parsed = typeof value === 'number'
    ? value
    : Number(String(value).replace(',', '.').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
};

const compactText = (value: string, maximum: number): string =>
  value.length <= maximum ? value : `${value.slice(0, maximum - 1).trim()}…`;

export const BudgetLeakMeterPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const fill = prototypeProgress(frame, 0, 34);
  const leakOpen = prototypeProgress(frame, 30, 72);
  const optimize = prototypeProgress(frame, 96, 154);
  const saved = prototypeProgress(frame, 142, 174);
  const measurementExact = numericValue(
    getPrototypeValue({
      content,
      key: 'measurementExact',
      fallback: content ? 0 : 1,
    }),
    content ? 0 : 1,
  ) >= 0.5;
  const terms = content
    ? [...new Set([
        ...content.meaningContract.actionTerms,
        ...content.meaningContract.subjectTerms,
        ...content.meaningContract.resultTerms,
      ])]
    : [];
  const leaks = DEFAULT_LEAKS.map((leak, index) => ({
    ...leak,
    label: getPrototypeLabel({content, key: `leak${index + 1}`, fallback: terms[index] ?? leak.label}),
    amount: numericValue(getPrototypeValue({content, key: `leak${index + 1}Amount`, fallback: leak.amount}), leak.amount),
    seal: Math.max(0, Math.min(1, (optimize - index * 0.12) / 0.72)),
  }));
  const initialCost = numericValue(getPrototypeValue({content, key: 'initialCost', fallback: 94}), 94);
  const optimizedCost = Math.min(initialCost, numericValue(getPrototypeValue({content, key: 'optimizedCost', fallback: 28}), 28));
  const targetSavings = Math.max(0, initialCost - optimizedCost);
  const requestedSavedAmount = numericValue(
    getPrototypeValue({content, key: 'savedAmount', fallback: targetSavings}),
    targetSavings,
  );
  const savedAmount = Math.abs(requestedSavedAmount - targetSavings) <= 1
    ? requestedSavedAmount
    : targetSavings;
  const totalLeakAmount = Math.max(1, leaks.reduce((sum, leak) => sum + leak.amount, 0));
  const sealedWeight = leaks.reduce((sum, leak) => sum + leak.amount * leak.seal, 0) / totalLeakAmount;
  const currentSavings = targetSavings * sealedWeight;
  const cost = Math.round(initialCost - currentSavings);
  const normalizedCost = targetSavings > 0 ? (cost - optimizedCost) / targetSavings : 0;
  const level = (0.32 + Math.max(0, Math.min(1, normalizedCost)) * 0.56) * fill;
  const currency = getPrototypeLabel({content, key: 'currency', fallback: '€'});
  const meterLabel = getPrototypeLabel({content, key: 'meterLabel', fallback: 'KOSTEN PRO REEL'});
  const resultText = getPrototypeLabel({
    content,
    key: 'resultText',
    fallback: content ? compactText(content.meaningContract.endState, 82) : 'durch drei konkrete Optimierungen',
  });
  const relativeCostLabel = optimize > 0.72
    ? 'NIEDRIGER'
    : optimize > 0.12
      ? 'SINKT'
      : 'HOCH';

  return (
    <PrototypeShell family="COST EFFICIENCY" title="Budget Leak Meter" subtitle="Jedes geschlossene Kostenleck senkt den Gesamtwert proportional zu seinem Anteil. Exakte Zahlen erscheinen nur, wenn sie im Szeneninhalt wirklich genannt werden.">
      <div style={{position: 'absolute', left: 90, right: 90, top: 380, bottom: 170}}>
        <GlassSurface style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 175, right: 175, top: 120, height: 690, borderRadius: '42px 42px 90px 90px', border: `5px solid ${PROTOTYPE_PALETTE.foreground}`, background: 'rgba(255,255,255,.65)', overflow: 'hidden', boxShadow: 'inset 0 0 60px rgba(61,42,94,.08), 0 24px 60px rgba(45,31,70,.12)'}}>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${level * 100}%`, background: `linear-gradient(180deg, ${PROTOTYPE_PALETTE.accentSoft}, ${PROTOTYPE_PALETTE.accent})`, boxShadow: '0 -10px 34px rgba(135,87,232,.35)'}}>
              {[20, 38, 56, 74].map((left, index) => <div key={left} style={{position: 'absolute', left: `${left}%`, top: 32 + index * 45, width: 18 + index * 3, height: 18 + index * 3, borderRadius: 999, border: '2px solid rgba(255,255,255,.65)', opacity: 0.35}} />)}
            </div>
            <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: level > 0.52 ? 'white' : PROTOTYPE_PALETTE.foreground, textShadow: level > 0.52 ? '0 2px 12px rgba(60,35,100,.35)' : 'none'}}>
              <div style={{fontSize: meterLabel.length > 24 ? 16 : 22, fontWeight: 900, letterSpacing: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 520}}>{meterLabel.toLocaleUpperCase('de-DE')}</div>
              <div style={{fontSize: measurementExact ? 96 : 72, lineHeight: 1, fontWeight: 900, letterSpacing: measurementExact ? -5 : 1, marginTop: 18}}>
                {measurementExact ? `${cost} ${currency}` : relativeCostLabel}
              </div>
              <div style={{marginTop: 15, fontFamily: 'monospace', fontSize: 17, fontWeight: 900, opacity: optimize}}>
                {measurementExact
                  ? `−${Math.round(currentSavings)} ${currency} BISHER`
                  : 'KOSTEN WERDEN SICHTBAR GESENKT'}
              </div>
            </div>
          </div>

          {leaks.map((leak, index) => {
            const localOpen = Math.max(0, Math.min(1, (leakOpen - index * 0.12) / 0.68));
            const stream = localOpen * (1 - leak.seal);
            return (
              <React.Fragment key={`${leak.label}-${index}`}>
                <div style={{position: 'absolute', left: leak.x, top: leak.y, width: 42, height: 42, borderRadius: 999, background: leak.seal > 0.7 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.danger, border: '6px solid white', boxShadow: `0 0 28px ${leak.seal > 0.7 ? 'rgba(53,197,138,.5)' : 'rgba(255,93,108,.5)'}`, transform: `translate(-50%, -50%) scale(${0.6 + localOpen * 0.4})`, zIndex: 6}} />
                <div style={{position: 'absolute', left: leak.x - 10, top: leak.y + 22, width: 20, height: 250 * stream, borderRadius: '0 0 14px 14px', background: `linear-gradient(180deg, ${PROTOTYPE_PALETTE.accent}, transparent)`, opacity: stream, filter: 'blur(1px)'}} />
                <div style={{position: 'absolute', left: leak.x, top: leak.y + 92, transform: 'translateX(-50%)', width: 220, padding: '14px 18px', borderRadius: 18, background: 'rgba(255,255,255,.94)', border: `2px solid ${leak.seal > 0.7 ? 'rgba(53,197,138,.38)' : 'rgba(255,93,108,.32)'}`, boxShadow: '0 12px 30px rgba(40,28,64,.10)', opacity: localOpen, textAlign: 'center', fontSize: leak.label.length > 18 ? 15 : 19, lineHeight: 1.15, fontWeight: 850}}>
                  <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{leak.label}</div>
                  <div style={{marginTop: 8, color: leak.seal > 0.7 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.danger, fontWeight: 900}}>
                    {measurementExact
                      ? leak.seal > 0.7
                        ? `−${Math.round(leak.amount)} ${currency} · ABGEDICHTET`
                        : `POTENZIAL −${Math.round(leak.amount)} ${currency}`
                      : leak.seal > 0.7
                        ? 'ABGEDICHTET'
                        : 'KOSTENTREIBER'}
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          <div style={{position: 'absolute', left: 105, right: 105, bottom: 58, padding: '22px 28px', borderRadius: 25, background: 'rgba(53,197,138,.10)', border: '2px solid rgba(53,197,138,.36)', opacity: saved, transform: `translateY(${(1 - saved) * 42}px) scale(${0.94 + saved * 0.06})`, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 900, textAlign: 'center'}}>
            <span style={{color: PROTOTYPE_PALETTE.success, whiteSpace: 'nowrap'}}>
              {measurementExact ? `${Math.round(savedAmount)} ${currency} GESPART` : 'KOSTEN GESENKT'}
            </span>
            <span style={{color: PROTOTYPE_PALETTE.muted, fontSize: resultText.length > 60 ? 17 : 22, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{resultText}</span>
          </div>
        </GlassSurface>
      </div>
    </PrototypeShell>
  );
};
