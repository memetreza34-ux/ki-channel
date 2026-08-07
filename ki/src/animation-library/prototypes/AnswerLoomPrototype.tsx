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

const DEFAULT_WORDS = ['KI', 'setzt', 'Muster', 'fort'] as const;
const DEFAULT_THREADS = ['Kontext', 'Thema', 'Grammatik', 'Ton'] as const;

const compactText = (value: string, maximum: number): string =>
  value.length <= maximum ? value : `${value.slice(0, maximum - 1).trim()}…`;

const visibleWords = (value: string): string[] =>
  (value.match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/gu) ?? [])
    .filter((word) => word.length >= 2)
    .slice(0, 4);

export const AnswerLoomPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const threadEnter = prototypeProgress(frame, 0, 42);
  const weave = prototypeProgress(frame, 34, 132);
  const reveal = prototypeProgress(frame, 116, 168);
  const semanticAnswer = content
    ? compactText(content.meaningContract.endState, 105)
    : 'KI setzt Muster fort.';
  const answerText = getPrototypeLabel({
    content,
    key: 'answer',
    fallback: semanticAnswer,
  });
  const extractedWords = visibleWords(answerText);
  const words = DEFAULT_WORDS.map((fallback, index) =>
    getPrototypeLabel({
      content,
      key: `word${index + 1}`,
      fallback: extractedWords[index] ?? fallback,
    }),
  );
  const semanticThreads = content
    ? [...new Set([
        ...content.meaningContract.subjectTerms,
        ...content.meaningContract.actionTerms,
        ...content.meaningContract.preferredExplanationPatterns,
      ])]
    : [];
  const threads = DEFAULT_THREADS.map((fallback, index) =>
    getPrototypeLabel({
      content,
      key: `thread${index + 1}`,
      fallback: semanticThreads[index] ?? fallback,
    }),
  );
  const answerLabel = getPrototypeLabel({
    content,
    key: 'answerLabel',
    fallback: 'ANTWORT',
  });
  const generatedWordCount = words.reduce(
    (count, _, index) =>
      count + (prototypeProgress(frame, 38 + index * 23, 63 + index * 23) > 0.65 ? 1 : 0),
    0,
  );

  return (
    <PrototypeShell
      family="GENERATION"
      title="Answer Loom"
      subtitle="Kontextsignale fließen in die Generierung; daraus erscheint die Antwort Wort für Wort statt den Erklärungssatz einfach zu wiederholen."
    >
      <GlassSurface style={{position: 'absolute', left: 72, right: 72, top: 390, bottom: 190, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 70, top: 120, bottom: 170, width: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
          {threads.map((thread, index) => {
            const enter = prototypeProgress(frame, index * 7, 25 + index * 7);
            return (
              <div key={`${thread}-${index}`} style={{padding: '15px 18px', borderRadius: 20, background: index % 2 === 0 ? 'rgba(135,87,232,.10)' : 'rgba(53,197,138,.10)', border: `2px solid ${index % 2 === 0 ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.success}44`, fontSize: thread.length > 13 ? 16 : 22, fontWeight: 900, color: index % 2 === 0 ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.success, textAlign: 'center', opacity: enter * threadEnter, transform: `translateX(${(1 - enter) * -80}px)`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{thread}</div>
            );
          })}
        </div>

        <svg width="936" height="1080" viewBox="0 0 936 1080" style={{position: 'absolute', inset: 0}}>
          {threads.map((_, index) => {
            const y = 250 + index * 175;
            return <path key={index} d={`M 275 ${y} C 390 ${y}, 390 ${460 + index * 30}, 500 ${460 + index * 30}`} fill="none" stroke={index % 2 === 0 ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.success} strokeWidth={12} strokeLinecap="round" strokeDasharray={560} strokeDashoffset={560 * (1 - threadEnter)} opacity={0.75} />;
          })}
          {Array.from({length: 7}, (_, index) => (
            <line key={index} x1={520 + index * 45} y1="310" x2={520 + index * 45} y2="770" stroke="rgba(135,87,232,.18)" strokeWidth={7} />
          ))}
        </svg>

        <div style={{position: 'absolute', left: 460, top: 270, width: 380, height: 560, borderRadius: 34, background: 'rgba(255,255,255,.68)', border: '3px solid rgba(135,87,232,.22)', boxShadow: '0 22px 60px rgba(55,38,83,.12)', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: interpolate(weave, [0, 1], [70, 475]), height: 38, borderRadius: 999, background: `linear-gradient(90deg, ${PROTOTYPE_PALETTE.accent}, ${PROTOTYPE_PALETTE.success})`, boxShadow: '0 0 28px rgba(135,87,232,.45)'}} />
          <div style={{position: 'absolute', right: 20, top: 18, padding: '8px 11px', borderRadius: 14, background: 'rgba(135,87,232,.08)', color: PROTOTYPE_PALETTE.accent, fontFamily: 'monospace', fontSize: 14, fontWeight: 900}}>
            WORT {generatedWordCount}/{words.length}
          </div>
          {words.map((word, index) => {
            const wordReveal = prototypeProgress(frame, 38 + index * 23, 63 + index * 23);
            return (
              <div key={`${word}-${index}`} style={{position: 'absolute', left: 36 + (index % 2) * 175, top: 95 + index * 105, minWidth: 145, maxWidth: 175, padding: '16px 20px', borderRadius: 21, background: index === 2 ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.white, border: '2px solid rgba(135,87,232,.18)', color: index === 2 ? PROTOTYPE_PALETTE.white : PROTOTYPE_PALETTE.foreground, fontSize: word.length > 11 ? 20 : 30, fontWeight: 900, textAlign: 'center', opacity: wordReveal, transform: `translateY(${(1 - wordReveal) * 35}px) scale(${0.86 + wordReveal * 0.14})`, boxShadow: index === 2 ? '0 16px 44px rgba(135,87,232,.32)' : '0 12px 32px rgba(55,38,83,.09)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{word}</div>
            );
          })}
        </div>

        <div style={{position: 'absolute', left: 100, right: 100, bottom: 58, padding: '28px 32px', borderRadius: 30, background: `linear-gradient(135deg, ${PROTOTYPE_PALETTE.foreground}, #342747)`, color: PROTOTYPE_PALETTE.white, textAlign: 'center', opacity: reveal, transform: `translateY(${(1 - reveal) * 62}px)`, boxShadow: '0 24px 70px rgba(20,18,26,.22)'}}>
          <div style={{fontSize: 20, fontWeight: 900, letterSpacing: 3, color: PROTOTYPE_PALETTE.accentSoft}}>{answerLabel.toLocaleUpperCase('de-DE')}</div>
          <div style={{marginTop: 13, fontSize: answerText.length > 80 ? 27 : 40, lineHeight: 1.12, fontWeight: 900, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>„{answerText}“</div>
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
