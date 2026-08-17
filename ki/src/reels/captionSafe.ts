export const REEL_CAPTION_SAFE = Object.freeze({
  bottom: 520,
  horizontalInset: 104,
  maxWidth: 820,
  maxVisibleLines: 2,
  maxWordsPerGroup: 6,
  lowerCriticalDeadZone: 420,
  lowerBufferEnd: 500,
  preferredVisualEndY: 1240,
  preferredVisualEndYMax: 1280,
} as const);

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
