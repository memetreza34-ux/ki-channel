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

const DEFAULT_INPUTS = [
  'Dokumente',
  'Notizen',
  'Webseiten',
  'Chats',
  'Tabellen',
  'Berichte',
] as const;

const compactText = (value: string, maximum: number): string =>
  value.length <= maximum ? value : `${value.slice(0, maximum - 1).trim()}…`;

const booleanValue = (value: string | number, fallback: boolean): boolean => {
  if (typeof value === 'number') return value !== 0;
  const normalized = String(value).trim().toLocaleLowerCase('de-DE');
  if (['true', 'ja', 'yes', '1', 'keep', 'relevant'].includes(normalized)) return true;
  if (['false', 'nein', 'no', '0', 'drop', 'irrelevant'].includes(normalized)) return false;
  return fallback;
};

const normalizedStem = (value: string): string =>
  value
    .toLocaleLowerCase('de-DE')
    .replace(/[^\p{L}\p{N}]+/gu, '')
    .replace(/(en|ern|e|n|s)$/u, '');

export const FunnelCompressionOutputPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const inputsEnter = prototypeProgress(frame, 0, 46);
  const funnelActivate = prototypeProgress(frame, 36, 88);
  const filterPhase = prototypeProgress(frame, 70, 116);
  const compress = prototypeProgress(frame, 82, 136);
  const output = prototypeProgress(frame, 122, 170);
  const terms = content
    ? [...new Set([
        ...content.meaningContract.subjectTerms,
        ...content.meaningContract.resultTerms,
      ])]
    : [];
  const spokenNormalized = content?.spokenText.toLocaleLowerCase('de-DE') ?? '';
  const inputs = DEFAULT_INPUTS.map((fallback, index) => {
    const label = getPrototypeLabel({
      content,
      key: `input${index + 1}`,
      fallback: terms[index] ?? fallback,
    });
    const stem = normalizedStem(label);
    const inferredKeep = content
      ? stem.length >= 3 && spokenNormalized.includes(stem)
      : true;
    return {
      label,
      keep: booleanValue(
        getPrototypeValue({
          content,
          key: `input${index + 1}Keep`,
          fallback: inferredKeep ? 1 : 0,
        }),
        inferredKeep,
      ),
    };
  });
  const keptInputs = inputs.filter((input) => input.keep);
  const droppedInputs = inputs.length - keptInputs.length;
  const outputLabel = getPrototypeLabel({
    content,
    key: 'outputLabel',
    fallback: 'VERDICHTETES ERGEBNIS',
  });
  const outputTitle = getPrototypeLabel({
    content,
    key: 'outputTitle',
    fallback: content
      ? compactText(content.meaningContract.endState, 72)
      : 'Eine klare Zusammenfassung',
  });
  const outputDetail = getPrototypeLabel({
    content,
    key: 'outputDetail',
    fallback: 'Nur relevante Informationen bleiben erhalten.',
  });
  const droppedLabel = content
    ? 'IRRELEVANTE QUELLEN VERWORFEN'
    : `${droppedInputs} QUELLEN VERWORFEN`;
  const keptLabel = content
    ? 'RELEVANTE QUELLEN BLEIBEN'
    : `${keptInputs.length} QUELLEN BLEIBEN`;

  return (
    <PrototypeShell
      family="INPUT OUTPUT"
      title="Funnel Compression Output"
      subtitle="Viele Quellen werden zuerst auf Relevanz geprüft; nur die passenden Informationen fließen weiter und werden verdichtet. Interne Visualisierungs-Counts werden im Content-Modus nicht als Fakten ausgegeben."
    >
      <GlassSurface style={{position: 'absolute', left: 74, right: 74, top: 390, bottom: 190, overflow: 'hidden'}}>
        {inputs.map((input, index) => {
          const angle = (index / inputs.length) * Math.PI * 2;
          const startX = 466 + Math.cos(angle) * 350;
          const startY = 270 + Math.sin(angle) * 175;
          const keptIndex = keptInputs.findIndex((item) => item === input);
          const targetX = input.keep
            ? 466 + (keptIndex - (keptInputs.length - 1) / 2) * 52
            : index % 2 === 0 ? 100 : 832;
          const targetY = input.keep ? 450 + (keptIndex % 2) * 28 : 660 + (index % 3) * 80;
          const motion = input.keep ? compress : filterPhase;
          const x = interpolate(motion, [0, 1], [startX, targetX]);
          const y = interpolate(motion, [0, 1], [startY, targetY]);
          const reveal = prototypeProgress(frame, index * 5, 22 + index * 5) * inputsEnter;
          const reject = input.keep ? 0 : filterPhase;
          return (
            <div key={`${input.label}-${index}`} style={{position: 'absolute', left: x, top: y, minWidth: 145, maxWidth: 195, padding: '14px 18px', borderRadius: 20, background: input.keep ? 'rgba(255,255,255,.94)' : 'rgba(255,93,108,.09)', border: `2px solid ${input.keep ? 'rgba(135,87,232,.22)' : 'rgba(255,93,108,.35)'}`, boxShadow: input.keep ? '0 14px 38px rgba(50,34,80,.10)' : '0 12px 30px rgba(255,93,108,.10)', textAlign: 'center', fontSize: input.label.length > 15 ? 16 : 22, fontWeight: 900, color: input.keep ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.danger, opacity: reveal * (input.keep ? 1 - output * 0.72 : 1 - reject * 0.62), transform: `translate(-50%, -50%) rotate(${input.keep ? (index - 2.5) * 2 * (1 - compress) : reject * (index % 2 ? 10 : -10)}deg) scale(${0.88 + reveal * 0.12 - reject * 0.08})`, zIndex: input.keep ? 5 : 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
              {input.label}
              <div style={{marginTop: 6, fontSize: 12, letterSpacing: 1.4, fontWeight: 900, color: input.keep ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.danger, opacity: filterPhase}}>
                {input.keep ? 'RELEVANT' : 'VERWORFEN'}
              </div>
            </div>
          );
        })}

        <svg width="932" height="1060" viewBox="0 0 932 1060" style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="funnel-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#C6A8FF" stopOpacity="0.35" />
              <stop offset="1" stopColor="#8757E8" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <path d="M 170 390 L 762 390 L 570 690 L 570 810 L 362 810 L 362 690 Z" fill="url(#funnel-fill)" stroke={PROTOTYPE_PALETTE.accent} strokeWidth={7} opacity={funnelActivate} style={{filter: 'drop-shadow(0 22px 35px rgba(135,87,232,.2))'}} />
          {[0, 1, 2].map((index) => (
            <line key={index} x1={260 + index * 105} y1={515 + index * 75} x2={675 - index * 105} y2={515 + index * 75} stroke={index === 1 ? PROTOTYPE_PALETTE.white : PROTOTYPE_PALETTE.accentSoft} strokeWidth={10} strokeLinecap="round" opacity={prototypeProgress(frame, 52 + index * 12, 84 + index * 12)} />
          ))}
        </svg>

        {keptInputs.flatMap((input, inputIndex) =>
          Array.from({length: 3}, (_, particleIndex) => {
            const index = inputIndex * 3 + particleIndex;
            const phase = prototypeProgress(frame, 88 + index * 2, 132 + index * 2);
            const x = interpolate(phase, [0, 1], [350 + inputIndex * 65, 466]);
            const y = interpolate(phase, [0, 1], [470 + particleIndex * 30, 845]);
            return <div key={`${input.label}-particle-${particleIndex}`} style={{position: 'absolute', left: x, top: y, width: 12 + (particleIndex % 3) * 4, height: 12 + (particleIndex % 3) * 4, borderRadius: 999, background: particleIndex === 0 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.accent, opacity: phase * (1 - output * 0.5), transform: `translate(-50%, -50%) scale(${0.6 + phase * 0.4})`, boxShadow: '0 0 18px rgba(135,87,232,.35)', zIndex: 7}} />;
          }),
        )}

        <div style={{position: 'absolute', left: 90, top: 865, width: 250, padding: '16px 18px', borderRadius: 20, background: 'rgba(255,93,108,.08)', border: '2px solid rgba(255,93,108,.25)', color: PROTOTYPE_PALETTE.danger, textAlign: 'center', opacity: filterPhase * (1 - output), fontSize: 16, fontWeight: 900}}>
          {droppedLabel}
        </div>
        <div style={{position: 'absolute', right: 90, top: 865, width: 250, padding: '16px 18px', borderRadius: 20, background: 'rgba(53,197,138,.08)', border: '2px solid rgba(53,197,138,.25)', color: PROTOTYPE_PALETTE.success, textAlign: 'center', opacity: filterPhase * (1 - output), fontSize: 16, fontWeight: 900}}>
          {keptLabel}
        </div>

        <div style={{position: 'absolute', left: 135, right: 135, bottom: 60, padding: '30px 34px', borderRadius: 32, background: `linear-gradient(135deg, ${PROTOTYPE_PALETTE.foreground}, #342747)`, color: PROTOTYPE_PALETTE.white, textAlign: 'center', opacity: output, transform: `translateY(${(1 - output) * 80}px) scale(${0.88 + output * 0.12})`, boxShadow: '0 24px 70px rgba(20,18,26,.24)'}}>
          <div style={{fontSize: outputLabel.length > 26 ? 15 : 20, fontWeight: 900, letterSpacing: 3, color: PROTOTYPE_PALETTE.accentSoft, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{outputLabel.toLocaleUpperCase('de-DE')}</div>
          <div style={{marginTop: 14, fontSize: outputTitle.length > 55 ? 25 : 38, lineHeight: 1.1, fontWeight: 900, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{outputTitle}</div>
          <div style={{marginTop: 12, fontSize: outputDetail.length > 65 ? 17 : 21, lineHeight: 1.3, fontWeight: 700, color: '#DAD2E9', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{outputDetail}</div>
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
