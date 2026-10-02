import {useVideoConfig} from 'remotion';
import {FORMATS, SAFE, type FormatName} from './theme';

export const formatOf = (width: number, height: number): FormatName => {
  const exact = (Object.keys(FORMATS) as FormatName[]).find((f) => FORMATS[f].width === width && FORMATS[f].height === height);
  if (exact) return exact;
  const ratio = height / width;
  if (ratio > 1.5) return 'vertical';
  if (ratio > 1.05) return 'portrait';
  if (ratio > 0.95) return 'square';
  return 'landscape';
};

/**
 * Maße des aktuellen Formats. `u` = Breite / 1080 – damit skaliert man Größen,
 * die im Hochformat entworfen wurden, für andere Formate mit.
 */
export const useLayout = () => {
  const {width, height} = useVideoConfig();
  const format = formatOf(width, height);
  return {
    width,
    height,
    format,
    safe: SAFE[format],
    isTall: format === 'vertical',
    isWide: format === 'landscape',
    u: Math.min(width, height * 0.75) / 1080,
  };
};
