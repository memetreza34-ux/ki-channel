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

const DEFAULT_MILESTONES = [
  {label: 'V1', x: 145, detail: 'Basis'},
  {label: 'V2', x: 330, detail: 'Tempo'},
  {label: 'V3', x: 520, detail: 'Agenten'},
  {label: 'V4', x: 710, detail: 'Kontext'},
  {label: 'HEUTE', x: 845, detail: 'Multimodal'},
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

export const TimelineMicroscopePrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const line = prototypeProgress(frame, 0, 42);
  const lensMove = prototypeProgress(frame, 36, 104);
  const zoom = prototypeProgress(frame, 92, 142);
  const resolve = prototypeProgress(frame, 136, 174);
  const terms = content
    ? [...new Set([
        ...content.meaningContract.subjectTerms,
        ...content.meaningContract.resultTerms,
        ...content.meaningContract.actionTerms,
      ])]
    : [];
  const milestones = DEFAULT_MILESTONES.map((milestone, index) => ({
    ...milestone,
    label: getPrototypeLabel({
      content,
      key: `milestone${index + 1}`,
      fallback: milestone.label,
    }),
    detail: getPrototypeLabel({
      content,
      key: `milestone${index + 1}Detail`,
      fallback: terms[index] ?? milestone.detail,
    }),
  }));
  const focusIndex = boundedInteger(
    getPrototypeValue({content, key: 'focusMilestone', fallback: 3}),
    3,
    0,
    milestones.length - 1,
  );
  const lensX = interpolate(
    lensMove,
    [0, 1],
    [milestones[0].x + 45, milestones[focusIndex].x],
  );
  const header = getPrototypeLabel({
    content,
    key: 'timelineLabel',
    fallback: 'MODEL EVOLUTION · 2023–2026',
  });
  const zoomLabel = getPrototypeLabel({
    content,
    key: 'zoomLabel',
    fallback: `ZOOM: ${milestones[focusIndex].label}`,
  });
  const changes = ['größeres Fenster', 'bessere Werkzeuge', 'stabilere Planung'].map(
    (fallback, index) =>
      getPrototypeLabel({
        content,
        key: `change${index + 1}`,
        fallback:
          content?.meaningContract.requiredVisualCues[index] ?? fallback,
      }),
  );
  const conclusion = getPrototypeLabel({
    content,
    key: 'conclusion',
    fallback: content
      ? compactText(content.meaningContract.endState, 108)
      : 'Große Sprünge bestehen aus vielen kleinen Änderungen.',
  });

  return (
    <PrototypeShell
      family="TIME CHANGE"
      title="Timeline Microscope"
      subtitle="Eine grobe Entwicklungslinie öffnet sich und zeigt die kleinen Veränderungen zwischen großen Versionen."
    >
      <GlassSurface style={{position: 'absolute', left: 72, right: 72, top: 390, bottom: 190, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 48, right: 48, top: 60, fontFamily: 'monospace', fontSize: header.length > 38 ? 14 : 18, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{header.toLocaleUpperCase('de-DE')}</div>

        <div style={{position: 'absolute', left: 100, right: 75, top: 410, height: 14, borderRadius: 999, background: PROTOTYPE_PALETTE.line, overflow: 'hidden'}}>
          <div style={{width: `${line * 100}%`, height: '100%', background: `linear-gradient(90deg, ${PROTOTYPE_PALETTE.accentSoft}, ${PROTOTYPE_PALETTE.accent})`, boxShadow: '0 0 18px rgba(135,87,232,.4)'}} />
        </div>

        {milestones.map((milestone, index) => {
          const reveal = prototypeProgress(frame, 8 + index * 7, 28 + index * 7);
          const focused = Math.abs(lensX - milestone.x) < 95;
          return (
            <div key={`${milestone.label}-${index}`} style={{position: 'absolute', left: milestone.x, top: 417, transform: `translate(-50%, -50%) scale(${0.75 + reveal * 0.25 + (focused ? 0.12 : 0)})`, opacity: reveal, zIndex: 5}}>
              <div style={{width: 52, height: 52, borderRadius: 999, background: focused ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.white, border: `7px solid ${focused ? PROTOTYPE_PALETTE.white : PROTOTYPE_PALETTE.accentSoft}`, boxShadow: focused ? '0 0 34px rgba(135,87,232,.48)' : '0 12px 28px rgba(55,38,83,.1)'}} />
              <div style={{marginTop: 18, maxWidth: 150, textAlign: 'center', fontSize: milestone.label.length > 10 ? 15 : 22, fontWeight: 900, color: focused ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.foreground, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{milestone.label}</div>
              <div style={{marginTop: 6, maxWidth: 160, textAlign: 'center', fontSize: milestone.detail.length > 13 ? 13 : 17, fontWeight: 800, color: PROTOTYPE_PALETTE.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{milestone.detail}</div>
            </div>
          );
        })}

        <div style={{position: 'absolute', left: lensX, top: 415, width: 230, height: 230, borderRadius: 999, transform: `translate(-50%, -50%) scale(${1 + zoom * 0.25})`, border: `10px solid ${PROTOTYPE_PALETTE.accent}`, background: 'rgba(255,255,255,.28)', boxShadow: '0 0 60px rgba(135,87,232,.28), inset 0 0 40px rgba(135,87,232,.12)', opacity: lensMove, zIndex: 8}}>
          <div style={{position: 'absolute', right: -82, bottom: -68, width: 125, height: 24, borderRadius: 999, background: PROTOTYPE_PALETTE.accent, transform: 'rotate(45deg)', boxShadow: '0 12px 26px rgba(135,87,232,.32)'}} />
        </div>

        <div style={{position: 'absolute', left: 90, right: 90, top: 620, height: 330, borderRadius: 32, background: 'rgba(135,87,232,.06)', border: '2px solid rgba(135,87,232,.18)', opacity: zoom, overflow: 'hidden', transform: `translateY(${(1 - zoom) * 55}px)`}}>
          <div style={{position: 'absolute', left: 34, right: 34, top: 26, fontSize: zoomLabel.length > 28 ? 15 : 19, fontWeight: 900, letterSpacing: 2.5, color: PROTOTYPE_PALETTE.accent, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{zoomLabel.toLocaleUpperCase('de-DE')}</div>
          <div style={{position: 'absolute', left: 40, right: 40, top: 115, height: 8, borderRadius: 999, background: PROTOTYPE_PALETTE.line}} />
          {changes.map((label, index) => {
            const show = prototypeProgress(frame, 104 + index * 10, 125 + index * 10);
            return <div key={`${label}-${index}`} style={{position: 'absolute', left: 145 + index * 275, top: 119, transform: `translate(-50%, -50%) scale(${0.75 + show * 0.25})`, opacity: show}}><div style={{width: 28, height: 28, borderRadius: 999, background: index === 0 ? PROTOTYPE_PALETTE.accent : index === 1 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.warning, boxShadow: '0 0 20px rgba(135,87,232,.3)', margin: '0 auto 18px'}} /><div style={{width: 220, textAlign: 'center', fontSize: label.length > 22 ? 16 : 21, lineHeight: 1.2, fontWeight: 900, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{label}</div></div>;
          })}
        </div>

        <div style={{position: 'absolute', left: 115, right: 115, bottom: 54, padding: '23px 27px', borderRadius: 27, background: PROTOTYPE_PALETTE.foreground, color: PROTOTYPE_PALETTE.white, textAlign: 'center', fontSize: conclusion.length > 85 ? 19 : 25, fontWeight: 900, opacity: resolve, transform: `translateY(${(1 - resolve) * 45}px)`, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{conclusion}</div>
      </GlassSurface>
    </PrototypeShell>
  );
};
