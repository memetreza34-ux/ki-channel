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

const DEFAULT_STAGES = [
  {label: 'ZIEL', owner: 'MENSCH', detail: 'Absicht und Grenzen festlegen', x: 135},
  {label: 'ENTWURF', owner: 'KI', detail: 'schnell mehrere Optionen erzeugen', x: 355},
  {label: 'PRÜFUNG', owner: 'MENSCH', detail: 'Qualität und Wahrheit beurteilen', x: 575},
  {label: 'AUSFÜHRUNG', owner: 'KI', detail: 'freigegebene Lösung umsetzen', x: 795},
] as const;

const compactText = (value: string, maximum: number): string =>
  value.length <= maximum ? value : `${value.slice(0, maximum - 1).trim()}…`;

const ownerColor = (owner: string): string =>
  /\b(ki|ai|modell|agent)\b/i.test(owner)
    ? PROTOTYPE_PALETTE.accent
    : PROTOTYPE_PALETTE.warning;

export const HumanAIRelayPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const track = prototypeProgress(frame, 0, 32);
  const taskProgress = prototypeProgress(frame, 22, 145);
  const finish = prototypeProgress(frame, 138, 174);
  const terms = content
    ? [...new Set([
        ...content.meaningContract.actionTerms,
        ...content.meaningContract.subjectTerms,
        ...content.meaningContract.resultTerms,
      ])]
    : [];
  const stages = DEFAULT_STAGES.map((stage, index) => {
    const owner = getPrototypeLabel({
      content,
      key: `stage${index + 1}Owner`,
      fallback: stage.owner,
    });
    return {
      ...stage,
      label: getPrototypeLabel({
        content,
        key: `stage${index + 1}`,
        fallback: terms[index] ?? stage.label,
      }),
      owner,
      color: ownerColor(owner),
      detail: getPrototypeLabel({
        content,
        key: `stage${index + 1}Detail`,
        fallback:
          content?.meaningContract.requiredVisualCues[index] ?? stage.detail,
      }),
    };
  });
  const stageProgresses = stages.map((_, index) =>
    prototypeProgress(frame, 22 + index * 31, 50 + index * 31),
  );
  const completedStages = stageProgresses.filter((value) => value > 0.92).length;
  const currentStageIndex = Math.min(
    stages.length - 1,
    Math.floor(taskProgress * stages.length),
  );
  const segment = Math.min(
    stages.length - 2,
    Math.floor(taskProgress * (stages.length - 1)),
  );
  const local = taskProgress * (stages.length - 1) - segment;
  const packetX = interpolate(
    local,
    [0, 1],
    [stages[segment].x, stages[segment + 1].x],
  );
  const currentOwner = stages[currentStageIndex].owner;
  const currentOwnerColor = stages[currentStageIndex].color;
  const taskLabel = getPrototypeLabel({
    content,
    key: 'taskLabel',
    fallback: content?.meaningContract.subjectTerms[0] ?? 'TASK',
  });
  const resultTitle = getPrototypeLabel({
    content,
    key: 'resultTitle',
    fallback: 'BESSER ALS „MENSCH ODER KI“',
  });
  const resultText = getPrototypeLabel({
    content,
    key: 'resultText',
    fallback: content
      ? compactText(content.meaningContract.endState, 110)
      : 'Die Stärke liegt in der richtigen Übergabe.',
  });

  return (
    <PrototypeShell
      family="HUMAN AI COLLABORATION"
      title="Human AI Relay"
      subtitle="Die Aufgabe wechselt sichtbar zwischen den tatsächlichen Verantwortlichen. Jede Übergabe folgt der in den Szenendaten definierten Rollenverteilung."
    >
      <div style={{position: 'absolute', left: 78, right: 78, top: 400, bottom: 170}}>
        <GlassSurface style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 78, right: 78, top: 285, height: 16, borderRadius: 999, background: PROTOTYPE_PALETTE.line, overflow: 'hidden'}}>
            <div style={{width: `${track * 100}%`, height: '100%', background: `linear-gradient(90deg, ${stages.map((stage) => stage.color).join(', ')})`}} />
          </div>

          {stages.slice(0, -1).map((stage, index) => {
            const handoff = prototypeProgress(frame, 45 + index * 31, 60 + index * 31);
            const nextStage = stages[index + 1];
            return (
              <div key={`handoff-${index}`} style={{position: 'absolute', left: (stage.x + nextStage.x) / 2, top: 235, transform: `translate(-50%, -50%) scale(${0.85 + handoff * 0.15})`, padding: '8px 12px', borderRadius: 14, background: 'rgba(255,255,255,.94)', border: `2px solid ${nextStage.color}55`, color: nextStage.color, fontSize: 12, fontWeight: 900, letterSpacing: 1.3, opacity: handoff}}>
                ÜBERGABE → {nextStage.owner.toLocaleUpperCase('de-DE')}
              </div>
            );
          })}

          {stages.map((stage, index) => {
            const stageProgress = stageProgresses[index];
            const active = index === currentStageIndex && taskProgress < 1;
            const completed = stageProgress > 0.92;
            return (
              <div key={`${stage.label}-${index}`} style={{position: 'absolute', left: stage.x, top: 293, transform: `translate(-50%, -50%) scale(${0.72 + Math.min(1, stageProgress) * 0.28 + (active ? 0.08 : 0)})`, width: 145, height: 145, borderRadius: 999, background: completed ? PROTOTYPE_PALETTE.success : stage.color, border: '8px solid white', boxShadow: active ? `0 0 55px ${stage.color}66` : `0 0 25px ${stage.color}44`, opacity: track, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 23, fontWeight: 900, zIndex: 4}}>{completed ? '✓' : index + 1}</div>
            );
          })}

          {stages.map((stage, index) => {
            const reveal = prototypeProgress(frame, 18 + index * 22, 45 + index * 22);
            const active = index === currentStageIndex && taskProgress < 1;
            const completed = stageProgresses[index] > 0.92;
            return (
              <div key={`${stage.label}-panel-${index}`} style={{position: 'absolute', left: stage.x, top: index % 2 === 0 ? 500 : 690, transform: `translateX(-50%) translateY(${(1 - reveal) * 38}px) scale(${1 + (active ? 0.04 : 0)})`, width: 195, minHeight: 205, borderRadius: 28, padding: '24px 18px', boxSizing: 'border-box', background: 'white', border: `3px solid ${completed ? PROTOTYPE_PALETTE.success : stage.color}${active || completed ? '' : '55'}`, boxShadow: active ? `0 20px 55px ${stage.color}33` : '0 14px 34px rgba(45,31,70,.10)', opacity: reveal, textAlign: 'center'}}>
                <div style={{fontSize: stage.owner.length > 12 ? 14 : 18, fontWeight: 900, letterSpacing: 2, color: completed ? PROTOTYPE_PALETTE.success : stage.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{stage.owner.toLocaleUpperCase('de-DE')}</div>
                <div style={{fontSize: stage.label.length > 13 ? 20 : 27, lineHeight: 1.05, fontWeight: 900, marginTop: 15, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{stage.label}</div>
                <div style={{fontSize: stage.detail.length > 45 ? 15 : 18, lineHeight: 1.18, fontWeight: 700, color: PROTOTYPE_PALETTE.muted, marginTop: 17, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{stage.detail}</div>
                <div style={{marginTop: 10, fontFamily: 'monospace', fontSize: 12, fontWeight: 900, color: completed ? PROTOTYPE_PALETTE.success : active ? stage.color : PROTOTYPE_PALETTE.muted}}>{completed ? 'ABGESCHLOSSEN' : active ? 'AKTIV' : 'WARTET'}</div>
              </div>
            );
          })}

          <div style={{position: 'absolute', left: packetX, top: 293, transform: 'translate(-50%, -50%)', minWidth: 90, maxWidth: 205, minHeight: 48, padding: '7px 12px', borderRadius: 16, background: 'white', border: `4px solid ${currentOwnerColor}`, boxShadow: '0 12px 28px rgba(45,31,70,.20)', zIndex: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: taskLabel.length > 12 ? 14 : 18, fontWeight: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
            <span>{taskLabel.toLocaleUpperCase('de-DE')}</span>
            <span style={{fontSize: 10, marginTop: 3, letterSpacing: 1.2, color: currentOwnerColor}}>BEI {currentOwner.toLocaleUpperCase('de-DE')}</span>
          </div>

          <div style={{position: 'absolute', left: 105, right: 105, bottom: 64, padding: '26px 30px', borderRadius: 28, background: `linear-gradient(135deg, ${PROTOTYPE_PALETTE.foreground}, #302741)`, color: 'white', opacity: finish, transform: `translateY(${(1 - finish) * 45}px)`, textAlign: 'center', boxShadow: '0 22px 58px rgba(20,18,26,.24)'}}>
            <div style={{fontSize: resultTitle.length > 38 ? 23 : 34, fontWeight: 900, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{resultTitle}</div>
            <div style={{fontSize: resultText.length > 78 ? 18 : 23, fontWeight: 750, marginTop: 12, color: PROTOTYPE_PALETTE.accentSoft, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{resultText}</div>
            <div style={{marginTop: 9, fontFamily: 'monospace', fontSize: 13, fontWeight: 900, color: PROTOTYPE_PALETTE.success}}>{completedStages}/{stages.length} ÜBERGABEN ABGESCHLOSSEN</div>
          </div>
        </GlassSurface>
      </div>
    </PrototypeShell>
  );
};
