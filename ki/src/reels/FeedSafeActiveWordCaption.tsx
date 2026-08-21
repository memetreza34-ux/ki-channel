import React from 'react';
import {useCurrentFrame} from 'remotion';
import {getVisibleCaptionWordIndices, REEL_CAPTION_SAFE} from './captionSafe';

export type FeedSafeCaptionWord = {
  text: string;
  startFrame: number;
  endFrame: number;
};

export type FeedSafeCaptionCue = {
  id: string;
  sceneId?: string;
  startFrame: number;
  endFrame: number;
  words: FeedSafeCaptionWord[];
};

export const findActiveCaptionWordIndex = (
  words: readonly FeedSafeCaptionWord[],
  frame: number,
): number => words.findIndex((word) => frame >= word.startFrame && frame < word.endFrame);

export const findCaptionGroupAnchorIndex = (
  words: readonly FeedSafeCaptionWord[],
  frame: number,
  activeIndex: number,
): number => {
  if (activeIndex >= 0) return activeIndex;
  const previousIndex = words.reduce(
    (lastIndex, word, index) => (word.endFrame <= frame ? index : lastIndex),
    -1,
  );
  return Math.max(0, previousIndex);
};

export const FeedSafeActiveWordCaption: React.FC<{
  cues: readonly FeedSafeCaptionCue[];
  accentColor: string;
  textColor: string;
  fontFamily: string;
  fontSizePx?: number;
}> = ({cues, accentColor, textColor, fontFamily, fontSizePx = REEL_CAPTION_SAFE.fontSize}) => {
  const frame = useCurrentFrame();
  const cue = cues.find((item) => frame >= item.startFrame && frame < item.endFrame);
  if (!cue || cue.words.length === 0) return null;

  const exactIndex = findActiveCaptionWordIndex(cue.words, frame);
  const groupAnchorIndex = findCaptionGroupAnchorIndex(cue.words, frame, exactIndex);
  const words = cue.words.map((word) => word.text);
  const visibleIndices = getVisibleCaptionWordIndices(words, groupAnchorIndex);

  return (
    <div
      style={{
        position: 'absolute',
        left: REEL_CAPTION_SAFE.horizontalInset,
        right: REEL_CAPTION_SAFE.horizontalInset,
        bottom: REEL_CAPTION_SAFE.bottom,
        zIndex: 200,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: REEL_CAPTION_SAFE.maxWidth,
          color: textColor,
          fontFamily,
          fontSize: fontSizePx,
          fontWeight: 850,
          lineHeight: REEL_CAPTION_SAFE.lineHeight,
          letterSpacing: -0.9,
          textAlign: 'center',
          textShadow:
            '0 2px 0 rgba(255,255,255,0.96), 0 0 14px rgba(255,255,255,0.96), 0 8px 30px rgba(26,26,46,0.10)',
        }}
      >
        {visibleIndices.map((index, visibleIndex) => (
          <React.Fragment key={`${cue.id}-${index}`}>
            <span style={{display: 'inline-block', color: index === exactIndex ? accentColor : textColor}}>
              {words[index]}
            </span>
            {visibleIndex < visibleIndices.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
