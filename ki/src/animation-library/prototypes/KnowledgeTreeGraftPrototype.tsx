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

const DEFAULT_BRANCHES = [
  {label: 'Stand 2024', angle: -2.3, length: 245},
  {label: 'Stand 2025', angle: -0.95, length: 270},
  {label: 'unsicher', angle: 0.35, length: 220},
] as const;

const numericValue = (
  value: string | number,
  fallback: number,
): number => {
  const parsed = typeof value === 'number'
    ? value
    : Number(String(value).replace(',', '.').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : fallback;
};

const compactText = (value: string, maximum: number): string =>
  value.length <= maximum ? value : `${value.slice(0, maximum - 1).trim()}…`;

export const KnowledgeTreeGraftPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const grow = prototypeProgress(frame, 0, 48);
  const newFact = prototypeProgress(frame, 42, 88);
  const verify = prototypeProgress(frame, 80, 118);
  const graft = prototypeProgress(frame, 108, 154);
  const supersede = prototypeProgress(frame, 142, 176);
  const rootX = 454;
  const terms = content
    ? [...new Set([
        ...content.meaningContract.subjectTerms,
        ...content.meaningContract.resultTerms,
        ...content.meaningContract.actionTerms,
      ])]
    : [];
  const oldBranches = DEFAULT_BRANCHES.map((branch, index) => ({
    ...branch,
    label: getPrototypeLabel({
      content,
      key: `oldState${index + 1}`,
      fallback: terms[index] ?? branch.label,
    }),
    uncertain: index === 2,
  }));
  const newInformationLabel = getPrototypeLabel({
    content,
    key: 'newInformationLabel',
    fallback: 'NEUE INFORMATION',
  });
  const newInformation = getPrototypeLabel({
    content,
    key: 'newInformation',
    fallback: terms[3] ?? 'Stand 2026',
  });
  const sourceDetail = getPrototypeLabel({
    content,
    key: 'sourceDetail',
    fallback: 'Quelle + Datum + Vertrauen',
  });
  const confidence = numericValue(
    getPrototypeValue({content, key: 'confidence', fallback: 92}),
    92,
  );
  const verifiedLabel = getPrototypeLabel({
    content,
    key: 'verifiedLabel',
    fallback: 'VERIFIZIERT',
  });
  const oldStatementLabel = getPrototypeLabel({
    content,
    key: 'oldStatementLabel',
    fallback: 'ALTE AUSSAGE',
  });
  const oldStatementResult = getPrototypeLabel({
    content,
    key: 'oldStatementResult',
    fallback: 'markiert, nicht heimlich gelöscht',
  });
  const knowledgeLabel = getPrototypeLabel({
    content,
    key: 'knowledgeLabel',
    fallback: 'WISSEN',
  });
  const revisionStart = numericValue(
    getPrototypeValue({content, key: 'revisionStart', fallback: 3}),
    3,
  );
  const revisionEnd = numericValue(
    getPrototypeValue({content, key: 'revisionEnd', fallback: 4}),
    4,
  );
  const conclusion = getPrototypeLabel({
    content,
    key: 'conclusion',
    fallback: content
      ? compactText(content.meaningContract.endState, 105)
      : `${knowledgeLabel} wurde nachvollziehbar aktualisiert.`,
  });

  return (
    <PrototypeShell
      family="LEARNING UPDATE"
      title="Knowledge Tree Graft"
      subtitle="Neue Informationen werden geprüft, versioniert und eingefügt – stärkere Fakten ersetzen schwächere nicht heimlich."
    >
      <div style={{position: 'absolute', left: 82, right: 82, top: 390, bottom: 170}}>
        <GlassSurface style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <svg width="916" height="1270" viewBox="0 0 916 1270" style={{position: 'absolute', inset: 0}}>
            <path d={`M ${rootX} 1120 C 430 1010, 485 910, ${rootX} 760 C 430 650, 490 540, 458 390`} fill="none" stroke={PROTOTYPE_PALETTE.foreground} strokeWidth={34} strokeLinecap="round" strokeDasharray="1200" strokeDashoffset={1200 * (1 - grow)} opacity={grow} />

            {oldBranches.map((branch, index) => {
              const startY = 780 - index * 150;
              const endX = rootX + Math.cos(branch.angle) * branch.length;
              const endY = startY + Math.sin(branch.angle) * branch.length;
              const reveal = Math.max(0, Math.min(1, (grow - index * 0.14) / 0.66));
              const fade = branch.uncertain ? 1 - supersede * 0.82 : 1;
              return (
                <React.Fragment key={`${branch.label}-${index}`}>
                  <path d={`M ${rootX} ${startY} Q ${(rootX + endX) / 2} ${startY - 50} ${endX} ${endY}`} fill="none" stroke={branch.uncertain ? PROTOTYPE_PALETTE.warning : PROTOTYPE_PALETTE.accentSoft} strokeWidth={18 - index * 2} strokeLinecap="round" strokeDasharray="520" strokeDashoffset={520 * (1 - reveal)} opacity={reveal * fade} />
                  <circle cx={endX} cy={endY} r={31} fill={branch.uncertain ? PROTOTYPE_PALETTE.warning : PROTOTYPE_PALETTE.accent} opacity={reveal * fade} />
                </React.Fragment>
              );
            })}

            <path d="M 740 265 C 680 315, 640 370, 600 455 C 565 530, 520 600, 458 690" fill="none" stroke={PROTOTYPE_PALETTE.success} strokeWidth={22} strokeLinecap="round" strokeDasharray="780" strokeDashoffset={780 * (1 - graft)} opacity={graft} style={{filter: 'drop-shadow(0 0 12px rgba(53,197,138,.42))'}} />
          </svg>

          {oldBranches.map((branch, index) => {
            const startY = 780 - index * 150;
            const endX = rootX + Math.cos(branch.angle) * branch.length;
            const endY = startY + Math.sin(branch.angle) * branch.length;
            const reveal = Math.max(0, Math.min(1, (grow - index * 0.14) / 0.66));
            const fade = branch.uncertain ? 1 - supersede * 0.82 : 1;
            return (
              <div key={`${branch.label}-label-${index}`} style={{position: 'absolute', left: endX, top: endY + 62, transform: 'translateX(-50%)', maxWidth: 230, padding: '12px 18px', borderRadius: 18, background: 'white', border: `2px solid ${branch.uncertain ? PROTOTYPE_PALETTE.warning : PROTOTYPE_PALETTE.accentSoft}`, boxShadow: '0 12px 30px rgba(45,31,70,.10)', fontSize: branch.label.length > 17 ? 15 : 20, fontWeight: 900, color: branch.uncertain ? '#A66B00' : PROTOTYPE_PALETTE.foreground, opacity: reveal * fade, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{branch.label}</div>
            );
          })}

          <div style={{position: 'absolute', left: 740, top: 240, width: 270, minHeight: 175, transform: `translate(-50%, -50%) scale(${0.7 + newFact * 0.3}) rotate(${(1 - newFact) * 8}deg)`, borderRadius: 30, background: 'white', border: `4px solid ${verify > 0.65 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.accent}`, boxShadow: verify > 0.65 ? '0 20px 55px rgba(53,197,138,.25)' : '0 20px 55px rgba(135,87,232,.24)', opacity: newFact, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 22, boxSizing: 'border-box', textAlign: 'center', zIndex: 5}}>
            <div style={{fontSize: newInformationLabel.length > 22 ? 14 : 18, fontWeight: 900, letterSpacing: 2, color: verify > 0.65 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.accent, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 230}}>{newInformationLabel.toLocaleUpperCase('de-DE')}</div>
            <div style={{fontSize: newInformation.length > 24 ? 21 : 29, lineHeight: 1.08, fontWeight: 900, marginTop: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{newInformation}</div>
            <div style={{fontSize: sourceDetail.length > 28 ? 14 : 18, fontWeight: 750, color: PROTOTYPE_PALETTE.muted, marginTop: 11, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{sourceDetail}</div>
          </div>

          <div style={{position: 'absolute', left: 585, top: 390, width: 215, padding: '16px 20px', borderRadius: 22, background: 'rgba(53,197,138,.10)', border: '2px solid rgba(53,197,138,.42)', opacity: verify, transform: `scale(${0.75 + verify * 0.25})`, textAlign: 'center', fontSize: verifiedLabel.length > 18 ? 15 : 20, fontWeight: 900, color: PROTOTYPE_PALETTE.success, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{verifiedLabel.toLocaleUpperCase('de-DE')} · {confidence}%</div>

          <div style={{position: 'absolute', left: 95, right: 95, bottom: 66, display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 18, alignItems: 'center', opacity: supersede}}>
            <div style={{height: 3, background: 'linear-gradient(90deg, transparent, rgba(255,182,72,.55))'}} />
            <div style={{maxWidth: 500, padding: '20px 26px', borderRadius: 24, background: 'rgba(255,182,72,.12)', border: '2px solid rgba(255,182,72,.40)', textAlign: 'center'}}>
              <div style={{fontSize: oldStatementLabel.length > 20 ? 15 : 20, fontWeight: 900, color: '#A66B00'}}>{oldStatementLabel.toLocaleUpperCase('de-DE')}</div>
              <div style={{fontSize: oldStatementResult.length > 42 ? 18 : 25, fontWeight: 900, marginTop: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{oldStatementResult}</div>
            </div>
            <div style={{height: 3, background: 'linear-gradient(90deg, rgba(255,182,72,.55), transparent)'}} />
          </div>

          <div style={{position: 'absolute', left: rootX, top: 1130, maxWidth: 650, transform: `translate(-50%, -50%) scale(${0.8 + graft * 0.2})`, padding: '18px 26px', borderRadius: 24, background: PROTOTYPE_PALETTE.foreground, color: 'white', fontSize: conclusion.length > 55 ? 16 : 22, fontWeight: 900, letterSpacing: 2, opacity: grow, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{conclusion.toLocaleUpperCase('de-DE')} · REVISION {Math.round(interpolate(graft, [0, 1], [revisionStart, revisionEnd]))}</div>
        </GlassSurface>
      </div>
    </PrototypeShell>
  );
};
