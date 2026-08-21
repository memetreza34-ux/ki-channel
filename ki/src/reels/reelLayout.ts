import standard from '../../reels/production-standard.json';

const {layout} = standard;

export const REEL_LAYOUT_SAFE = Object.freeze({
  header: Object.freeze({
    top: layout.header.topPx,
    horizontalInset: layout.header.horizontalInsetPx,
    height: layout.header.heightPx,
    headingFontSize: layout.header.headingFontSizePx,
    iconSize: layout.header.iconSizePx,
    gap: layout.header.gapPx,
  }),
  animation: Object.freeze({
    top: layout.animation.topPx,
    endY: layout.animation.endYPx,
    horizontalInset: layout.animation.horizontalInsetPx,
    minimumCaptionGap: layout.animation.minimumCaptionGapPx,
  }),
} as const);
