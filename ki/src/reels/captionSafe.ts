import standard from '../../reels/production-standard.json';

const {caption} = standard;

export const REEL_CAPTION_SAFE = Object.freeze({
  bottom: caption.bottomPx,
  horizontalInset: caption.horizontalInsetPx,
  maxWidth: caption.maxWidthPx,
  fontSize: caption.fontSizePx,
  lineHeight: caption.lineHeight,
  maxVisibleLines: caption.maxVisibleLines,
  maxWordsPerGroup: caption.wordsPerVisibleGroup.max,
  lowerCriticalDeadZone: caption.lowerCriticalDeadZonePx,
  lowerBufferEnd: caption.lowerBufferEndPx,
  preferredVisualEndY: caption.preferredVisualEndYPx.min,
  preferredVisualEndYMax: caption.preferredVisualEndYPx.max,
} as const);

export const buildReelCaptionGroups = (
  words: readonly string[],
  maxWords = REEL_CAPTION_SAFE.maxWordsPerGroup,
): number[][] => {
  const groups: number[][] = [];
  let current: number[] = [];

  words.forEach((word, index) => {
    current.push(index);
    const hardBreak = /[.!?][”“\"')\]]?$/.test(word);
    const softBreak = /[,;:][”“\"')\]]?$/.test(word) && current.length >= 4;

    if (hardBreak || softBreak || current.length >= maxWords) {
      groups.push(current);
      current = [];
    }
  });

  if (current.length > 0) groups.push(current);
  return groups;
};

export const getVisibleCaptionWordIndices = (
  words: readonly string[],
  activeIndex: number,
): readonly number[] => {
  const groups = buildReelCaptionGroups(words);
  return groups.find((group) => group.includes(activeIndex)) ?? groups[0] ?? [];
};

export const REEL_CAPTION_WRAPPER_STYLE = Object.freeze({
  position: 'absolute' as const,
  left: REEL_CAPTION_SAFE.horizontalInset,
  right: REEL_CAPTION_SAFE.horizontalInset,
  bottom: REEL_CAPTION_SAFE.bottom,
  zIndex: 200,
  display: 'flex',
  justifyContent: 'center',
  pointerEvents: 'none' as const,
});
