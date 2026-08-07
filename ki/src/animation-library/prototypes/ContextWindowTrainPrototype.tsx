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

const DEFAULT_MESSAGES = [
  'Frage 1',
  'Antwort 1',
  'Wichtige Regel',
  'Frage 2',
  'Antwort 2',
  'Neue Frage',
] as const;

const compactText = (value: string, maximum: number): string =>
  value.length <= maximum ? value : `${value.slice(0, maximum - 1).trim()}…`;

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

export const ContextWindowTrainPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const trainEnter = prototypeProgress(frame, 0, 42);
  const newMessage = prototypeProgress(frame, 58, 100);
  const overflow = prototypeProgress(frame, 92, 134);
  const pin = prototypeProgress(frame, 118, 156);
  const windowStart = interpolate(overflow, [0, 1], [0, 1]);
  const semanticTerms = content
    ? [...new Set([
        ...content.meaningContract.subjectTerms,
        ...content.meaningContract.actionTerms,
        ...content.meaningContract.resultTerms,
      ])]
    : [];
  const pinnedIndex = boundedInteger(
    getPrototypeValue({content, key: 'pinnedIndex', fallback: 2}),
    2,
    0,
    DEFAULT_MESSAGES.length - 1,
  );
  const capacity = boundedInteger(
    getPrototypeValue({content, key: 'capacity', fallback: 4}),
    4,
    2,
    6,
  );
  const messages = DEFAULT_MESSAGES.map((fallback, index) => ({
    id: `m${index + 1}`,
    label: getPrototypeLabel({
      content,
      key: `message${index + 1}`,
      fallback: semanticTerms[index] ?? fallback,
    }),
    priority: index === pinnedIndex,
  }));
  const contextLabel = getPrototypeLabel({
    content,
    key: 'contextLabel',
    fallback: 'AKTIVER KONTEXT',
  });
  const removedLabel = getPrototypeLabel({
    content,
    key: 'removedLabel',
    fallback: content
      ? compactText(content.meaningContract.startState, 48)
      : 'ÄLTESTE INFO',
  });
  const removedResult = getPrototypeLabel({
    content,
    key: 'removedResult',
    fallback: 'verlässt das Fenster',
  });
  const pinnedLabel = getPrototypeLabel({
    content,
    key: 'pinnedLabel',
    fallback: 'ANGEHEFTET',
  });
  const pinnedResult = getPrototypeLabel({
    content,
    key: 'pinnedResult',
    fallback: content
      ? compactText(content.meaningContract.endState, 56)
      : 'wichtige Regel bleibt aktiv',
  });

  return (
    <PrototypeShell
      family="CONTEXT WINDOW"
      title="Context Window Train"
      subtitle="Neue Nachrichten schieben alte Informationen aus dem begrenzten Kontext – wichtige Regeln können angeheftet bleiben."
    >
      <div style={{position: 'absolute', left: 82, right: 82, top: 405, bottom: 170}}>
        <GlassSurface style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 68, right: 68, top: 150, height: 620, borderRadius: 36, border: `5px solid ${PROTOTYPE_PALETTE.foreground}`, background: 'rgba(248,247,251,.72)', overflow: 'hidden'}}>
            <div style={{position: 'absolute', top: 24, left: 32, right: 32, display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.muted}}>
              <span>{contextLabel.toLocaleUpperCase('de-DE')}</span>
              <span style={{color: PROTOTYPE_PALETTE.accent}}>{capacity} PLÄTZE</span>
            </div>

            <div style={{position: 'absolute', left: 24, right: 24, top: 105, height: 360, display: 'flex', alignItems: 'center', gap: 18, transform: `translateX(${interpolate(trainEnter, [0, 1], [780, 0]) - windowStart * 196}px)`}}>
              {messages.map((message, index) => {
                const appearing = index < 5 ? trainEnter : newMessage;
                const isOldest = index === 0;
                const isPinned = message.priority;
                const opacity = isOldest ? 1 - overflow : appearing;
                const lift = isPinned ? pin * -86 : 0;
                return (
                  <div key={message.id} style={{flex: '0 0 176px', height: 250, borderRadius: 28, background: isPinned ? `linear-gradient(145deg, ${PROTOTYPE_PALETTE.accent}, #6E3CD0)` : 'white', border: `3px solid ${isPinned ? 'rgba(255,255,255,.4)' : PROTOTYPE_PALETTE.line}`, boxShadow: isPinned ? '0 20px 52px rgba(135,87,232,.34)' : '0 16px 38px rgba(48,34,74,.12)', opacity, transform: `translateY(${lift}px) scale(${0.88 + appearing * 0.12})`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 20, boxSizing: 'border-box', color: isPinned ? 'white' : PROTOTYPE_PALETTE.foreground, position: 'relative'}}>
                    <div style={{fontSize: 18, fontWeight: 900, letterSpacing: 2, opacity: 0.72}}>#{index + 1}</div>
                    <div style={{marginTop: 18, fontSize: message.label.length > 15 ? 20 : 28, lineHeight: 1.08, fontWeight: 900, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{message.label}</div>
                    {isPinned ? (
                      <div style={{position: 'absolute', top: -24, width: 54, height: 54, borderRadius: 999, background: PROTOTYPE_PALETTE.warning, border: '5px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, transform: `scale(${0.6 + pin * 0.4})`}}>●</div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div style={{position: 'absolute', left: 34, right: 34, bottom: 42, display: 'grid', gridTemplateColumns: `repeat(${capacity}, 1fr)`, gap: 10}}>
              {Array.from({length: capacity}, (_, slot) => (
                <div key={slot} style={{height: 16, borderRadius: 999, background: slot === Math.min(pinnedIndex, capacity - 1) && pin > 0.5 ? PROTOTYPE_PALETTE.warning : PROTOTYPE_PALETTE.accent, opacity: 0.35 + (slot / Math.max(1, capacity - 1)) * 0.45}} />
              ))}
            </div>
          </div>

          <div style={{position: 'absolute', left: 95, top: 830, width: 315, padding: '22px 24px', borderRadius: 24, background: 'rgba(255,93,108,.10)', border: '2px solid rgba(255,93,108,.34)', opacity: overflow, transform: `translateX(${(1 - overflow) * -60}px)`, textAlign: 'center'}}>
            <div style={{fontSize: removedLabel.length > 20 ? 16 : 21, fontWeight: 900, color: PROTOTYPE_PALETTE.danger, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{removedLabel.toLocaleUpperCase('de-DE')}</div>
            <div style={{fontSize: removedResult.length > 30 ? 20 : 27, fontWeight: 900, marginTop: 9, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{removedResult}</div>
          </div>

          <div style={{position: 'absolute', right: 92, top: 830, width: 355, padding: '22px 24px', borderRadius: 24, background: 'rgba(255,182,72,.12)', border: '2px solid rgba(255,182,72,.38)', opacity: pin, transform: `translateX(${(1 - pin) * 60}px)`, textAlign: 'center'}}>
            <div style={{fontSize: pinnedLabel.length > 20 ? 16 : 21, fontWeight: 900, color: '#B97800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{pinnedLabel.toLocaleUpperCase('de-DE')}</div>
            <div style={{fontSize: pinnedResult.length > 36 ? 19 : 27, fontWeight: 900, marginTop: 9, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{pinnedResult}</div>
          </div>
        </GlassSurface>
      </div>
    </PrototypeShell>
  );
};
