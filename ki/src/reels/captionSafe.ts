export const REEL_CAPTION_SAFE = Object.freeze({
  bottom: 250,
  horizontalInset: 104,
  maxWidth: 860,
  maxVisibleLines: 2,
  maxWordsPerGroup: 6,
  lowerCriticalDeadZone: 180,
  lowerBufferEnd: 230,
  preferredVisualEndY: 1440,
  preferredVisualEndYMax: 1480,
} as const);

export const REEL_CAPTION_WRAPPER_STYLE = Object.freeze({
  position: 'absolute' as const,
  left: REEL_CAPTION_SAFE.horizontalInset,
  right: REEL_CAPTION_SAFE.horizontalInset,
  bottom: REEL_CAPTION_SAFE.bottom,
  zIndex: 220,
  display: 'flex',
  justifyContent: 'center',
  pointerEvents: 'none' as const,
});

export const REEL_CAPTION_GLASS_STYLE = Object.freeze({
  width: '100%',
  maxWidth: REEL_CAPTION_SAFE.maxWidth,
  textAlign: 'center' as const,
  background: 'rgba(255,255,255,.60)',
  border: '1px solid rgba(255,255,255,.66)',
  borderRadius: 26,
  padding: '15px 22px 17px',
  boxShadow: '0 12px 34px rgba(16,32,51,.11)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
} as const);
