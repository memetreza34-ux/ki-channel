import React from 'react';
import {useCurrentFrame} from 'remotion';
import {
  getPrototypeLabel,
  getPrototypeValue,
  usePrototypeContent,
} from './PrototypeContentContext';
import {parseExplicitCountNear} from './PrototypeMeasurementGrounding';
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

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

export const ContextWindowTrainPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const trainEnter = prototypeProgress(frame, 0, 42);
  const pin = prototypeProgress(frame, 118, 156);
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
  const inferredCapacity = boundedInteger(
    getPrototypeValue({content, key: 'capacity', fallback: 4}),
    4,
    2,
    6,
  );
  const explicitCapacity = content
    ? parseExplicitCountNear({
        spokenText: content.spokenText,
        terms: ['Plätze', 'Slots', 'Nachrichten', 'Kapazität', 'Kontextfenster'],
        minimum: 2,
        maximum: 6,
      })
    : null;
  const capacityExact = !content || explicitCapacity !== null;
  const capacity = explicitCapacity ?? inferredCapacity;
  const messages = DEFAULT_MESSAGES.map((fallback, index) => ({
    id: `m${index + 1}`,
    label: getPrototypeLabel({
      content,
      key: `message${index + 1}`,
      fallback: semanticTerms[index] ?? fallback,
    }),
    priority: index === pinnedIndex,
  }));
  const overflowCount = Math.max(0, messages.length - capacity);
  const arrivalProgresses = Array.from({length: overflowCount}, (_, index) =>
    prototypeProgress(frame, 54 + index * 26, 82 + index * 26),
  );
  const shiftProgresses = Array.from({length: overflowCount}, (_, index) =>
    prototypeProgress(frame, 72 + index * 26, 102 + index * 26),
  );
  const shiftedSlots = shiftProgresses.reduce((sum, value) => sum + value, 0);
  const overflow = clamp01(shiftedSlots);
  const removedCount = Math.min(overflowCount, Math.round(shiftedSlots));
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
  const viewportWidth = 760;
  const slotGap = capacity >= 6 ? 10 : 14;
  const slotWidth = Math.max(
    112,
    Math.min(176, (viewportWidth - slotGap * (capacity - 1)) / capacity),
  );
  const slotStep = slotWidth + slotGap;
  const firstSlotX = 54 + slotWidth / 2;
  const capacityLabel = capacityExact
    ? `${capacity} PLÄTZE`
    : 'BEGRENZTE KAPAZITÄT';
  const overflowLabel = !content
    ? `${removedCount}/${overflowCount} ÜBERLAUF`
    : 'ÜBERLAUF SICHTBAR';

  return (
    <PrototypeShell
      family="CONTEXT WINDOW"
      title="Context Window Train"
      subtitle="Neue Nachrichten belegen den begrenzten Kontext, ältere rutschen heraus und angeheftete Information bleibt sichtbar. Eine exakte Kapazität wird nur gezeigt, wenn sie im Sprechertext genannt wird."
    >
      <div style={{position: 'absolute', left: 82, right: 82, top: 405, bottom: 170}}>
        <GlassSurface style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 68, right: 68, top: 150, height: 620, borderRadius: 36, border: `5px solid ${PROTOTYPE_PALETTE.foreground}`, background: 'rgba(248,247,251,.72)', overflow: 'hidden'}}>
            <div style={{position: 'absolute', top: 24, left: 32, right: 32, display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.muted}}>
              <span>{contextLabel.toLocaleUpperCase('de-DE')}</span>
              <span style={{color: PROTOTYPE_PALETTE.accent}}>{capacityLabel}</span>
            </div>

            <div style={{position: 'absolute', left: 24, right: 24, top: 105, height: 385, overflow: 'hidden'}}>
              {messages.map((message, index) => {
                const extraIndex = index - capacity;
                const appearing = index < capacity
                  ? trainEnter
                  : arrivalProgresses[extraIndex] ?? 0;
                const naturalSlot = index - shiftedSlots;
                const isPinned = message.priority;
                const keepPinned = isPinned && pin > 0.25 && naturalSlot < 0;
                const displaySlot = keepPinned ? 0 : naturalSlot;
                const withinLeft = clamp01(displaySlot + 1);
                const withinRight = clamp01(capacity - displaySlot);
                const windowVisibility = keepPinned
                  ? Math.max(pin, withinLeft * withinRight)
                  : withinLeft * withinRight;
                const x = firstSlotX + displaySlot * slotStep;
                const lift = isPinned ? pin * -82 : 0;
                const compact = slotWidth < 145;
                return (
                  <div key={message.id} style={{position: 'absolute', left: x, top: 185, width: slotWidth, height: 250, borderRadius: compact ? 22 : 28, background: isPinned ? `linear-gradient(145deg, ${PROTOTYPE_PALETTE.accent}, #6E3CD0)` : 'white', border: `3px solid ${isPinned ? 'rgba(255,255,255,.4)' : PROTOTYPE_PALETTE.line}`, boxShadow: isPinned ? '0 20px 52px rgba(135,87,232,.34)' : '0 16px 38px rgba(48,34,74,.12)', opacity: appearing * windowVisibility, transform: `translate(-50%, -50%) translateY(${lift}px) scale(${0.88 + appearing * 0.12})`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: compact ? 12 : 20, boxSizing: 'border-box', color: isPinned ? 'white' : PROTOTYPE_PALETTE.foreground, zIndex: isPinned ? 8 : 4}}>
                    <div style={{fontSize: compact ? 14 : 18, fontWeight: 900, letterSpacing: 2, opacity: 0.72}}>#{index + 1}</div>
                    <div style={{marginTop: compact ? 12 : 18, fontSize: compact ? (message.label.length > 12 ? 16 : 20) : (message.label.length > 15 ? 20 : 28), lineHeight: 1.08, fontWeight: 900, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{message.label}</div>
                    {isPinned ? (
                      <div style={{position: 'absolute', top: -24, width: 54, height: 54, borderRadius: 999, background: PROTOTYPE_PALETTE.warning, border: '5px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, transform: `scale(${0.6 + pin * 0.4})`}}>●</div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div style={{position: 'absolute', left: 34, right: 34, bottom: 42, display: 'grid', gridTemplateColumns: `repeat(${capacity}, 1fr)`, gap: 10}}>
              {Array.from({length: capacity}, (_, slot) => (
                <div key={slot} style={{height: 16, borderRadius: 999, background: slot === 0 && pin > 0.5 && pinnedIndex - shiftedSlots < 0 ? PROTOTYPE_PALETTE.warning : PROTOTYPE_PALETTE.accent, opacity: 0.35 + (slot / Math.max(1, capacity - 1)) * 0.45}} />
              ))}
            </div>
          </div>

          <div style={{position: 'absolute', left: 95, top: 830, width: 315, padding: '22px 24px', borderRadius: 24, background: 'rgba(255,93,108,.10)', border: '2px solid rgba(255,93,108,.34)', opacity: overflow, transform: `translateX(${(1 - overflow) * -60}px)`, textAlign: 'center'}}>
            <div style={{fontSize: removedLabel.length > 20 ? 16 : 21, fontWeight: 900, color: PROTOTYPE_PALETTE.danger, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{removedLabel.toLocaleUpperCase('de-DE')}</div>
            <div style={{fontSize: removedResult.length > 30 ? 20 : 27, fontWeight: 900, marginTop: 9, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{removedResult}</div>
            <div style={{marginTop: 9, fontFamily: 'monospace', fontSize: 16, fontWeight: 900, color: PROTOTYPE_PALETTE.danger}}>{overflowLabel}</div>
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
