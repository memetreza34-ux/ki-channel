import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {
  CONTEXT_OVERLOAD_SUBTITLES,
  type ContextOverloadSubtitleCue,
} from './contract';

const edgeFade = (frame: number, startFrame: number, endFrame: number): number => {
  const fadeFrames = 4;
  return Math.min(
    interpolate(frame, [startFrame, startFrame + fadeFrames], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    interpolate(frame, [endFrame - fadeFrames, endFrame], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
};

const proportionalActiveWordIndex = ({
  frame,
  startFrame,
  endFrame,
  wordCount,
}: {
  frame: number;
  startFrame: number;
  endFrame: number;
  wordCount: number;
}): number => {
  if (wordCount <= 1) return 0;
  const progress = interpolate(
    frame,
    [startFrame, Math.max(startFrame + 1, endFrame - 1)],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  return Math.min(wordCount - 1, Math.floor(progress * wordCount));
};

const activeWordIndex = ({
  frame,
  cue,
  wordCount,
}: {
  frame: number;
  cue: ContextOverloadSubtitleCue;
  wordCount: number;
}): number => {
  if (cue.words && cue.words.length === wordCount) {
    const exact = cue.words.findIndex(
      (word) => frame >= word.startFrame && frame < word.endFrame,
    );
    if (exact >= 0) return exact;

    let previous = -1;
    for (let index = 0; index < cue.words.length; index += 1) {
      if (frame >= cue.words[index].endFrame) previous = index;
    }
    if (previous >= 0) return previous;
  }

  return proportionalActiveWordIndex({
    frame,
    startFrame: cue.startFrame,
    endFrame: cue.endFrame,
    wordCount,
  });
};

export const ContextOverloadCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = CONTEXT_OVERLOAD_SUBTITLES.find(
    (item) => frame >= item.startFrame && frame < item.endFrame,
  );
  if (!cue) return null;

  const words = cue.words?.length
    ? cue.words.map((word) => word.text)
    : cue.text.trim().split(/\s+/).filter(Boolean);
  const activeIndex = activeWordIndex({frame, cue, wordCount: words.length});

  return (
    <div
      style={{
        position: 'absolute',
        left: 104,
        right: 104,
        bottom: 520,
        zIndex: 200,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: edgeFade(frame, cue.startFrame, cue.endFrame),
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 820,
          color: BRAND.ink,
          fontFamily: BRAND.font,
          fontSize: 48,
          fontWeight: 850,
          lineHeight: 1.18,
          letterSpacing: -0.9,
          textAlign: 'center',
          textShadow:
            '0 2px 0 rgba(255,255,255,0.96), 0 0 14px rgba(255,255,255,0.96), 0 8px 30px rgba(26,26,46,0.10)',
        }}
      >
        {words.map((word, index) => {
          const isActive = index === activeIndex;
          return (
            <React.Fragment key={`${cue.sceneId}-${cue.startFrame}-${index}-${word}`}>
              <span
                style={{
                  display: 'inline-block',
                  color: isActive ? BRAND.accentDk : BRAND.ink,
                  transform: `scale(${isActive ? 1.035 : 1})`,
                  transformOrigin: '50% 70%',
                }}
              >
                {word}
              </span>
              {index < words.length - 1 ? ' ' : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
