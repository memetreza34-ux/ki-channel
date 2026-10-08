export const YOUTUBE_VISUAL_LANGUAGE = {
  name: 'Cinematic Editorial Tech',
  colors: {
    surface: '#F6F7FB',
    paper: '#FFFFFF',
    ink: '#141621',
    mutedInk: '#667085',
    purple: '#6E45C9',
    purpleLight: '#B98CFF',
    info: '#3D8BFF',
    success: '#1E835C',
    error: '#D95C6A',
    darkSurface: '#12131A',
    darkRaised: '#1A1C26',
    lightInk: '#F5F7FB',
  },
  typography: {
    display: 'Inter',
    body: 'Inter',
    code: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  layout: {
    width: 1920,
    height: 1080,
    fps: 30,
    outerMarginMin: 80,
    outerMarginMax: 120,
  },
  motion: {
    microFrames: [5, 8] as const,
    standardFrames: [10, 16] as const,
    heroFrames: [18, 28] as const,
    cameraFrames: [24, 60] as const,
    staggerFrames: [2, 4] as const,
  },
} as const;

export type YouTubeVisualFamily =
  | 'HERO_OBJECT'
  | 'PROCESS_SYSTEM'
  | 'PRODUCT_EVIDENCE'
  | 'COMPARISON_DATA'
  | 'KINETIC_TYPE';

export const YOUTUBE_VISUAL_FAMILIES: readonly YouTubeVisualFamily[] = [
  'HERO_OBJECT',
  'PROCESS_SYSTEM',
  'PRODUCT_EVIDENCE',
  'COMPARISON_DATA',
  'KINETIC_TYPE',
] as const;
