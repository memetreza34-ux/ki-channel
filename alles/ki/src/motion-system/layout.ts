export const MOTION_CANVAS = {
  width: 1080,
  height: 1920,
} as const;

export const MOTION_SAFE_ZONES = {
  horizontalPadding: 70,
  titleTop: 96,
  captionBottom: 195,
  captionMinHeight: 120,
} as const;

export const MOTION_CONTENT_BOUNDS = {
  left: MOTION_SAFE_ZONES.horizontalPadding,
  right: MOTION_CANVAS.width - MOTION_SAFE_ZONES.horizontalPadding,
  top: 180,
  bottom:
    MOTION_CANVAS.height -
    MOTION_SAFE_ZONES.captionBottom -
    MOTION_SAFE_ZONES.captionMinHeight,
} as const;
