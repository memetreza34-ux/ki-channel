import React from 'react';
import {useCurrentFrame} from 'remotion';

export type KaraokeWordCue = {
  text: string;
  startFrame: number;
  endFrame: number;
};

export type KaraokeSentenceCue = {
  id: string;
  text: string;
  startFrame: number;
  endFrame: number;
  words: readonly KaraokeWordCue[];
};

export type DualSentenceCaptionCue = {
  id: string;
  sceneId: string;
  startFrame: number;
  endFrame: number;
  bottomPx: number;
  mode: 'dual-sentence-active-word';
  sentences: readonly [KaraokeSentenceCue, KaraokeSentenceCue];
};

export type DualSentenceKaraokeCaptionProps = {
  cues: readonly DualSentenceCaptionCue[];
  accentColor?: string;
  fontFamily?: string;
  fontSizePx?: number;
  inactiveOpacity?: number;
};

export const getActiveWordIndex = (
  words: readonly KaraokeWordCue[],
  frame: number,
): number => words.findIndex((word) => frame >= word.startFrame && frame < word.endFrame);

const SentenceRow: React.FC<{
  sentence: KaraokeSentenceCue;
  frame: number;
  accentColor: string;
  fontFamily: string;
  fontSizePx: number;
  inactiveOpacity: number;
}> = ({sentence, frame, accentColor, fontFamily, fontSizePx, inactiveOpacity}) => {
  const activeIndex = getActiveWordIndex(sentence.words, frame);
  const sentenceIsActive = frame >= sentence.startFrame && frame < sentence.endFrame;

  return (
    <div
      style={{
        width: '100%',
        textAlign: 'center',
        fontFamily,
        fontSize: fontSizePx,
        lineHeight: 1.12,
        fontWeight: 860,
        letterSpacing: -0.8,
        color: '#FFFFFF',
        WebkitTextStroke: '2.5px rgba(20, 15, 28, 0.96)',
        paintOrder: 'stroke fill',
        textShadow: '0 4px 10px rgba(20, 15, 28, 0.82)',
        opacity: sentenceIsActive ? 1 : inactiveOpacity,
      }}
    >
      {sentence.words.map((word, index) => {
        const active = index === activeIndex;
        return (
          <React.Fragment key={`${sentence.id}-${index}-${word.text}`}>
            <span
              style={{
                display: 'inline-block',
                color: active ? accentColor : '#FFFFFF',
                fontWeight: active ? 950 : 860,
                textShadow: active
                  ? `0 0 18px ${accentColor}88, 0 4px 10px rgba(20, 15, 28, 0.82)`
                  : '0 4px 10px rgba(20, 15, 28, 0.82)',
              }}
            >
              {word.text}
            </span>
            {index < sentence.words.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const DualSentenceKaraokeCaption: React.FC<DualSentenceKaraokeCaptionProps> = ({
  cues,
  accentColor = '#7D49DF',
  fontFamily = 'Inter, ui-sans-serif, system-ui, sans-serif',
  fontSizePx = 44,
  inactiveOpacity = 0.88,
}) => {
  const frame = useCurrentFrame();
  const cue = cues.find((item) => frame >= item.startFrame && frame < item.endFrame);

  if (!cue) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 54,
        right: 54,
        bottom: cue.bottomPx,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 970,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          padding: '18px 24px 20px',
          borderRadius: 28,
          background: 'linear-gradient(180deg, rgba(24, 19, 31, 0.04), rgba(24, 19, 31, 0.14))',
        }}
      >
        {cue.sentences.map((sentence) => (
          <SentenceRow
            key={sentence.id}
            sentence={sentence}
            frame={frame}
            accentColor={accentColor}
            fontFamily={fontFamily}
            fontSizePx={fontSizePx}
            inactiveOpacity={inactiveOpacity}
          />
        ))}
      </div>
    </div>
  );
};
