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

const DEFAULT_BRANCHES = [
  {label: 'günstig?', x: 185, y: 485, valid: true, start: 24},
  {label: 'schnell?', x: 715, y: 485, valid: true, start: 35},
  {label: 'unsicher?', x: 145, y: 835, valid: false, start: 52},
  {label: 'skalierbar?', x: 460, y: 920, valid: true, start: 62},
  {label: 'zu komplex?', x: 755, y: 830, valid: false, start: 72},
] as const;

const compactText = (value: string, maximum: number): string =>
  value.length <= maximum ? value : `${value.slice(0, maximum - 1).trim()}…`;

const booleanValue = (value: string | number, fallback: boolean): boolean => {
  if (typeof value === 'number') return value !== 0;
  const normalized = value.trim().toLocaleLowerCase('de-DE');
  if (['true', 'ja', 'yes', '1', 'valid'].includes(normalized)) return true;
  if (['false', 'nein', 'no', '0', 'invalid'].includes(normalized)) return false;
  return fallback;
};

export const DecisionTreeBurstPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const core = prototypeProgress(frame, 0, 24);
  const prune = prototypeProgress(frame, 104, 142);
  const route = prototypeProgress(frame, 126, 170);
  const contractTerms = content
    ? [...new Set([
        ...content.meaningContract.actionTerms,
        ...content.meaningContract.resultTerms,
        ...content.meaningContract.subjectTerms,
      ])]
    : [];
  const branches = DEFAULT_BRANCHES.map((branch, index) => ({
    ...branch,
    label: getPrototypeLabel({
      content,
      key: `branch${index + 1}`,
      fallback: contractTerms[index] ?? branch.label,
    }),
    valid: booleanValue(
      getPrototypeValue({
        content,
        key: `branch${index + 1}Valid`,
        fallback: branch.valid ? 1 : 0,
      }),
      branch.valid,
    ),
  }));
  const question = getPrototypeLabel({
    content,
    key: 'question',
    fallback: content
      ? compactText(
          content.meaningContract.startState || content.spokenText,
          62,
        )
      : 'Welches Tool passt?',
  });
  const validBranches = branches.filter((branch) => branch.valid);
  const invalidCount = branches.length - validBranches.length;
  const selectedPath = getPrototypeLabel({
    content,
    key: 'selectedPath',
    fallback: validBranches.length > 0
      ? content
        ? compactText(content.meaningContract.endState, 75)
        : validBranches.map((branch) => branch.label.replace(/\?$/, '')).join(' + ')
      : 'Kein gültiger Pfad',
  });
  const mergeX = 458;
  const mergeY = 1050;
  const routeVisibility = validBranches.length > 0 ? route : 0;

  return (
    <PrototypeShell
      family="DECISION LOGIC"
      title="Decision Tree Burst"
      subtitle="Eine Frage öffnet mehrere Wege. Unpassende Äste verschwinden, die gemeinsam tragenden Kriterien bleiben sichtbar."
    >
      <div style={{position: 'absolute', left: 82, right: 82, top: 390, bottom: 170}}>
        <GlassSurface style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <svg width="916" height="1270" viewBox="0 0 916 1270" style={{position: 'absolute', inset: 0}}>
            {branches.map((branch) => {
              const reveal = prototypeProgress(frame, branch.start, branch.start + 28);
              const faded = branch.valid ? 1 : 1 - prune;
              const controlX = 458 + (branch.x - 458) * 0.32;
              const controlY = 350 + (branch.y - 350) * 0.58;
              const dash = 920;
              return (
                <path
                  key={`${branch.label}-${branch.x}`}
                  d={`M 458 350 Q ${controlX} ${controlY} ${branch.x} ${branch.y}`}
                  fill="none"
                  stroke={branch.valid ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.danger}
                  strokeWidth={branch.valid ? 10 + route * 2 : 7}
                  strokeLinecap="round"
                  strokeDasharray={dash}
                  strokeDashoffset={dash * (1 - reveal)}
                  opacity={(branch.valid ? 0.78 : 0.55) * faded}
                  style={{
                    filter: branch.valid && route > 0.4
                      ? 'drop-shadow(0 0 10px rgba(53,197,138,.30))'
                      : undefined,
                  }}
                />
              );
            })}

            {validBranches.map((branch, index) => {
              const localRoute = Math.max(0, Math.min(1, (route - index * 0.08) / 0.82));
              const controlX = branch.x + (mergeX - branch.x) * 0.5;
              const controlY = branch.y + (mergeY - branch.y) * 0.48;
              return (
                <path
                  key={`survivor-${branch.label}-${index}`}
                  d={`M ${branch.x} ${branch.y} Q ${controlX} ${controlY} ${mergeX} ${mergeY}`}
                  fill="none"
                  stroke={PROTOTYPE_PALETTE.success}
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeDasharray="620"
                  strokeDashoffset={620 * (1 - localRoute)}
                  opacity={localRoute}
                  style={{filter: 'drop-shadow(0 0 10px rgba(53,197,138,.38))'}}
                />
              );
            })}

            <path
              d={`M ${mergeX} ${mergeY} Q 458 1105 458 1155`}
              fill="none"
              stroke={PROTOTYPE_PALETTE.success}
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray="180"
              strokeDashoffset={180 * (1 - routeVisibility)}
              opacity={routeVisibility}
              style={{filter: 'drop-shadow(0 0 12px rgba(53,197,138,.45))'}}
            />
            <circle
              cx={mergeX}
              cy={mergeY}
              r={18 + routeVisibility * 8}
              fill={PROTOTYPE_PALETTE.success}
              opacity={routeVisibility}
            />
          </svg>

          <div style={{position: 'absolute', left: 458, top: 350, transform: `translate(-50%, -50%) scale(${0.65 + core * 0.35})`, width: 305, height: 200, borderRadius: 36, background: `linear-gradient(145deg, ${PROTOTYPE_PALETTE.accent}, #6B39D0)`, color: 'white', border: '4px solid rgba(255,255,255,.45)', boxShadow: '0 24px 60px rgba(135,87,232,.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24, boxSizing: 'border-box', zIndex: 5}}>
            <div style={{fontSize: 20, fontWeight: 900, letterSpacing: 3, opacity: 0.8}}>ENTSCHEIDUNG</div>
            <div style={{fontSize: question.length > 45 ? 24 : 37, lineHeight: 1.05, fontWeight: 900, marginTop: 12, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{question}</div>
          </div>

          {branches.map((branch, index) => {
            const reveal = prototypeProgress(frame, branch.start + 8, branch.start + 30);
            const remove = branch.valid ? 0 : prune;
            const validGlow = branch.valid ? route : 0;
            return (
              <div key={`${branch.label}-${index}`} style={{position: 'absolute', left: branch.x, top: branch.y, transform: `translate(-50%, -50%) scale(${0.75 + reveal * 0.25 - remove * 0.25}) rotate(${remove * (index % 2 ? 13 : -13)}deg)`, width: 225, minHeight: 120, borderRadius: 28, background: branch.valid ? 'white' : 'rgba(255,93,108,.08)', border: `3px solid ${branch.valid ? (validGlow > 0.35 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.accentSoft) : PROTOTYPE_PALETTE.danger}`, boxShadow: branch.valid ? `0 16px ${35 + validGlow * 25}px rgba(53,197,138,.14)` : '0 14px 34px rgba(255,93,108,.13)', opacity: reveal * (1 - remove), display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: branch.label.length > 14 ? 20 : 29, fontWeight: 900, color: branch.valid ? PROTOTYPE_PALETTE.foreground : PROTOTYPE_PALETTE.danger, zIndex: 4, padding: 12, boxSizing: 'border-box', overflow: 'hidden'}}>{branch.label}</div>
            );
          })}

          <div style={{position: 'absolute', left: 458, top: 1155, transform: `translate(-50%, -50%) scale(${0.72 + route * 0.28})`, width: 430, padding: '28px 32px', borderRadius: 30, background: validBranches.length > 0 ? 'rgba(53,197,138,.12)' : 'rgba(255,93,108,.10)', border: `3px solid ${validBranches.length > 0 ? 'rgba(53,197,138,.55)' : 'rgba(255,93,108,.5)'}`, boxShadow: validBranches.length > 0 ? '0 20px 52px rgba(53,197,138,.20)' : '0 20px 52px rgba(255,93,108,.14)', opacity: route, textAlign: 'center'}}>
            <div style={{fontSize: 21, fontWeight: 900, letterSpacing: 3, color: validBranches.length > 0 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.danger}}>{validBranches.length > 0 ? 'BEGRÜNDETER PFAD' : 'KEIN PFAD'}</div>
            <div style={{fontSize: selectedPath.length > 55 ? 22 : 34, lineHeight: 1.08, fontWeight: 900, marginTop: 12, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{selectedPath}</div>
          </div>

          <div style={{position: 'absolute', left: 70, right: 70, bottom: 32, display: 'flex', justifyContent: 'space-between', opacity: prune, fontSize: 20, fontWeight: 850, color: PROTOTYPE_PALETTE.muted}}>
            <span><b style={{color: PROTOTYPE_PALETTE.danger}}>{invalidCount}</b> Äste verworfen</span>
            <span><b style={{color: validBranches.length > 0 ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.danger}}>{validBranches.length}</b> Kriterien tragen den Weg</span>
          </div>
        </GlassSurface>
      </div>
    </PrototypeShell>
  );
};
