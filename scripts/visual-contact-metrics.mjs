export const whitePixelRatio = (buffer, channels = 4, threshold = 245) => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) return 0;
  const stride = Math.max(3, channels);
  let white = 0;
  let pixels = 0;
  for (let i = 0; i + 2 < buffer.length; i += stride) {
    pixels += 1;
    if (buffer[i] >= threshold && buffer[i + 1] >= threshold && buffer[i + 2] >= threshold) white += 1;
  }
  return pixels === 0 ? 0 : white / pixels;
};

export const edgeDensity = (buffer, width, height, channels = 4, threshold = 34) => {
  if (!Buffer.isBuffer(buffer) || width <= 1 || height <= 1) return 0;
  const stride = Math.max(3, channels);
  const luminance = (index) => 0.2126 * buffer[index] + 0.7152 * buffer[index + 1] + 0.0722 * buffer[index + 2];
  let edges = 0;
  let comparisons = 0;
  for (let y = 0; y < height - 1; y += 1) {
    for (let x = 0; x < width - 1; x += 1) {
      const index = (y * width + x) * stride;
      const right = index + stride;
      const down = index + width * stride;
      const current = luminance(index);
      comparisons += 2;
      if (Math.abs(current - luminance(right)) >= threshold) edges += 1;
      if (Math.abs(current - luminance(down)) >= threshold) edges += 1;
    }
  }
  return comparisons === 0 ? 0 : edges / comparisons;
};

export const meanAbsoluteRgbDifference = (left, right, channels = 4) => {
  if (!Buffer.isBuffer(left) || !Buffer.isBuffer(right) || left.length !== right.length || left.length === 0) return 0;
  const stride = Math.max(3, channels);
  let total = 0;
  let samples = 0;
  for (let i = 0; i + 2 < left.length; i += stride) {
    total += Math.abs(left[i] - right[i]);
    total += Math.abs(left[i + 1] - right[i + 1]);
    total += Math.abs(left[i + 2] - right[i + 2]);
    samples += 3;
  }
  return samples === 0 ? 0 : total / samples;
};

export const luminanceStdDev = (buffer, channels = 4) => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) return 0;
  const stride = Math.max(3, channels);
  const values = [];
  for (let i = 0; i + 2 < buffer.length; i += stride) values.push(0.2126 * buffer[i] + 0.7152 * buffer[i + 1] + 0.0722 * buffer[i + 2]);
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
};

export const meanChroma = (buffer, channels = 4) => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) return 0;
  const stride = Math.max(3, channels);
  let total = 0;
  let pixels = 0;
  for (let i = 0; i + 2 < buffer.length; i += stride) {
    const max = Math.max(buffer[i], buffer[i + 1], buffer[i + 2]);
    const min = Math.min(buffer[i], buffer[i + 1], buffer[i + 2]);
    total += max - min;
    pixels += 1;
  }
  return pixels === 0 ? 0 : total / pixels;
};

export const classifyVisualFrame = ({whiteRatio, edgeRatio, luminanceDeviation, chroma}) => {
  const warnings = [];
  if (whiteRatio > 0.9) warnings.push('VERY_HIGH_WHITESPACE');
  else if (whiteRatio > 0.8) warnings.push('HIGH_WHITESPACE');
  if (edgeRatio < 0.012) warnings.push('VERY_LOW_VISUAL_COMPLEXITY');
  else if (edgeRatio < 0.022) warnings.push('LOW_VISUAL_COMPLEXITY');
  if (Number.isFinite(luminanceDeviation) && luminanceDeviation < 24 && whiteRatio > 0.58) warnings.push('LOW_CONTRAST_WASHED_OUT');
  if (Number.isFinite(chroma) && chroma < 10 && whiteRatio > 0.68) warnings.push('VERY_LOW_COLOR_SEPARATION');
  return warnings;
};

export const classifyFramePair = (difference) => {
  if (difference < 3.5) return ['NEAR_STATIC_SAMPLE_PAIR'];
  if (difference < 7) return ['LOW_VISUAL_CHANGE'];
  return [];
};
