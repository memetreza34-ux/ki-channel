export const REEL_CAPTION_SAFE = Object.freeze({
  bottom: 300,
  horizontalInset: 104,
  maxWidth: 820,
  maxVisibleLines: 2,
  maxWordsPerGroup: 6,
  lowerCriticalDeadZone: 220,
  lowerBufferEnd: 280,
  preferredVisualEndY: 1380,
  preferredVisualEndYMax: 1420,
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
