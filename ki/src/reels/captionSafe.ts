export const REEL_CAPTION_SAFE = Object.freeze({
  // User-reviewed 9:16 placement: captions sit clearly above the platform UI zone
  // and leave a continuous visual stage between headline and subtitle.
  bottom: 330,
  horizontalInset: 76,
  maxWidth: 928,
  maxVisibleLines: 2,
  maxWordsPerGroup: 6,
  lowerCriticalDeadZone: 220,
  lowerBufferEnd: 300,
  preferredVisualEndY: 1435,
  preferredVisualEndYMax: 1485,
} as const);

export const REEL_COVER_HOOK = Object.freeze({
  // Standard 30-fps cover candidate: frame 18 (~0.6 s) with 15-frame clean hold.
  // Level-Up reels may choose another candidate, but it must stay inside the first second.
  defaultCandidateFrame: 18,
  maxCandidateFrame: 30,
  minHoldFrames: 12,
  defaultHoldFrames: 15,
  defaultCaptionSuppressUntilFrame: 33,
} as const);

export const shouldShowReelCaption = (
  frame: number,
  suppressUntilFrame = REEL_COVER_HOOK.defaultCaptionSuppressUntilFrame,
) => frame >= Math.max(0, suppressUntilFrame);

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
  color: '#102033',
  fontSize: 40,
  lineHeight: 1.14,
  fontWeight: 900,
  letterSpacing: '-.018em',
  background: 'rgba(255,255,255,.76)',
  border: '1px solid rgba(255,255,255,.82)',
  borderRadius: 28,
  padding: '18px 26px 20px',
  boxShadow: '0 16px 42px rgba(16,32,51,.13)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
} as const);
