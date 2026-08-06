import React from 'react';
import {useCurrentFrame} from 'remotion';

export type SingleCaptionWordCue = {
  text: string;
  startFrame: number;
  endFrame: number;
};

export type SingleCaptionSentence = {
  id: string;
  text: string;
  startFrame: number;
  endFrame: number;
  words: readonly SingleCaptionWordCue[];
};

export type SingleSentenceCaptionCue = {
  id: string;
  sceneId: string;
  startFrame: number;
  endFrame: number;
  bottomPx: number;
  mode: 'single-sentence-active-word';
  sentence: SingleCaptionSentence;
};

export const getSingleCaptionActiveWordIndex = (
  words: readonly SingleCaptionWordCue[],
  frame: number,
): number => words.findIndex((word) => frame >= word.startFrame && frame < word.endFrame);

export const SingleSentenceKaraokeCaption: React.FC<{
  cues: readonly SingleSentenceCaptionCue[];
  accentColor?: string;
  fontFamily?: string;
  fontSizePx?: number;
}> = ({
  cues,
  accentColor = '#B98CFF',
  fontFamily = 'Inter, ui-sans-serif, system-ui, sans-serif',
  fontSizePx = 48,
}) => {
  const frame = useCurrentFrame();
  const cue = cues.find((item) => frame >= item.startFrame && frame < item.endFrame);
  if (!cue) return null;

  const activeIndex = getSingleCaptionActiveWordIndex(cue.sentence.words, frame);

  return (
    <div
      style={{
        position: 'absolute',
        left: 58,
        right: 58,
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
          maxWidth: 960,
          textAlign: 'center',
          fontFamily,
          fontSize: fontSizePx,
          lineHeight: 1.12,
          fontWeight: 880,
          letterSpacing: -0.9,
          color: '#FFFFFF',
          WebkitTextStroke: '2.7px rgba(18, 12, 26, 0.98)',
          paintOrder: 'stroke fill',
          textShadow: '0 5px 12px rgba(18, 12, 26, 0.82)',
        }}
      >
        {cue.sentence.words.map((word, index) => {
          const active = index === activeIndex;
          return (
            <React.Fragment key={`${cue.id}-${index}-${word.text}`}>
              <span
                style={{
                  color: active ? accentColor : '#FFFFFF',
                  fontWeight: active ? 950 : 880,
                  textShadow: active
                    ? `0 0 20px ${accentColor}AA, 0 5px 12px rgba(18, 12, 26, 0.82)`
                    : '0 5px 12px rgba(18, 12, 26, 0.82)',
                }}
              >
                {word.text}
              </span>
              {index < cue.sentence.words.length - 1 ? ' ' : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
