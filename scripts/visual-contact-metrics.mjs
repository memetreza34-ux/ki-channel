export const whitePixelRatio = (buffer, channels = 4, threshold = 245) => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) return 0;
  const stride = Math.max(3, channels);
  let white = 0;
  let pixels = 0;
  for (let i = 0; i + 2 < buffer.length; i += stride) {
    pixels += 1;
    if (buffer[i] >= threshold && buffer[i + 1] >= threshold && buffer[i + 2] >= threshold) {
      white += 1;
    }
  }
  return pixels === 0 ? 0 : white / pixels;
};

export const edgeDensity = (buffer, width, height, channels = 4, threshold = 34) => {
  if (!Buffer.isBuffer(buffer) || width <= 1 || height <= 1) return 0;
  const stride = Math.max(3, channels);
  const luminance = (index) =>
    0.2126 * buffer[index] + 0.7152 * buffer[index + 1] + 0.0722 * buffer[index + 2];
  let edges = 0;
  let comparisons = 0;
  for (let y = 0; y < height - 1; y += 1) {
    for (let x = 0; x < width - 1; x += 1) {
      const index = (y * width + x) * stride;
      const right = index + stride;
      const down = index + width * stride;
      const current = luminance(index);
      const horizontal = Math.abs(current - luminance(right));
      const vertical = Math.abs(current - luminance(down));
      comparisons += 2;
      if (horizontal >= threshold) edges += 1;
      if (vertical >= threshold) edges += 1;
    }
  }
  return comparisons === 0 ? 0 : edges / comparisons;
};

export const meanAbsoluteRgbDifference = (left, right, channels = 4) => {
  if (!Buffer.isBuffer(left) || !Buffer.isBuffer(right) || left.length !== right.length || left.length === 0) {
    return 0;
  }
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

export const classifyVisualFrame = ({whiteRatio, edgeRatio}) => {
  const warnings = [];
  if (whiteRatio > 0.9) warnings.push('VERY_HIGH_WHITESPACE');
  else if (whiteRatio > 0.84) warnings.push('HIGH_WHITESPACE');
  if (edgeRatio < 0.012) warnings.push('VERY_LOW_VISUAL_COMPLEXITY');
  else if (edgeRatio < 0.022) warnings.push('LOW_VISUAL_COMPLEXITY');
  return warnings;
};

export const classifyFramePair = (difference) => {
  if (difference < 3.5) return ['NEAR_STATIC_SAMPLE_PAIR'];
  if (difference < 7) return ['LOW_VISUAL_CHANGE'];
  return [];
};
