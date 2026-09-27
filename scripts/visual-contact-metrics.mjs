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

export const activeVisualCellRatio = (buffer, width, height, channels = 4, {columns = 6, rows = 8} = {}) => {
  if (!Buffer.isBuffer(buffer) || width <= 1 || height <= 1) return 0;
  const stride = Math.max(3, channels);
  const rgbAt = (x, y) => {
    const index = (y * width + x) * stride;
    return [buffer[index], buffer[index + 1], buffer[index + 2]];
  };
  const luminance = (rgb) => 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  const corners = [rgbAt(0, 0), rgbAt(width - 1, 0), rgbAt(0, height - 1), rgbAt(width - 1, height - 1)];
  const background = [0, 1, 2].map((channel) => corners.reduce((sum, rgb) => sum + rgb[channel], 0) / corners.length);
  const colorDistance = (rgb) => Math.sqrt((rgb[0] - background[0]) ** 2 + (rgb[1] - background[1]) ** 2 + (rgb[2] - background[2]) ** 2);

  let active = 0;
  let cells = 0;
  for (let row = 0; row < rows; row += 1) {
    const y0 = Math.floor(row * height / rows);
    const y1 = Math.max(y0 + 1, Math.floor((row + 1) * height / rows));
    for (let column = 0; column < columns; column += 1) {
      const x0 = Math.floor(column * width / columns);
      const x1 = Math.max(x0 + 1, Math.floor((column + 1) * width / columns));
      let minLuma = 255;
      let maxLuma = 0;
      let localEdges = 0;
      let comparisons = 0;
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      let samples = 0;
      for (let y = y0; y < y1; y += 2) {
        for (let x = x0; x < x1; x += 2) {
          const rgb = rgbAt(x, y);
          const current = luminance(rgb);
          minLuma = Math.min(minLuma, current);
          maxLuma = Math.max(maxLuma, current);
          sumR += rgb[0]; sumG += rgb[1]; sumB += rgb[2]; samples += 1;
          if (x + 2 < x1) {
            comparisons += 1;
            if (Math.abs(current - luminance(rgbAt(x + 2, y))) >= 26) localEdges += 1;
          }
          if (y + 2 < y1) {
            comparisons += 1;
            if (Math.abs(current - luminance(rgbAt(x, y + 2))) >= 26) localEdges += 1;
          }
        }
      }
      const localEdgeRatio = comparisons === 0 ? 0 : localEdges / comparisons;
      const meanRgb = samples === 0 ? background : [sumR / samples, sumG / samples, sumB / samples];
      const differsFromBackground = colorDistance(meanRgb) >= 34;
      if (differsFromBackground || (maxLuma - minLuma) >= 30 || localEdgeRatio >= 0.045) active += 1;
      cells += 1;
    }
  }
  return cells === 0 ? 0 : active / cells;
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

export const classifyVisualFrameV4 = ({whiteRatio, edgeRatio, luminanceDeviation, chroma, activeCellRatio}) => {
  const warnings = classifyVisualFrame({whiteRatio, edgeRatio, luminanceDeviation, chroma});
  if ((activeCellRatio < 0.08 && edgeRatio < 0.012) || (edgeRatio < 0.006 && luminanceDeviation < 18)) warnings.push('EMPTY_OR_UNDERBUILT_FRAME');
  else if (activeCellRatio < 0.16 && edgeRatio < 0.02) warnings.push('SMALL_VISUAL_FOOTPRINT');
  return [...new Set(warnings)];
};

export const classifyFramePair = (difference) => {
  if (difference < 3.5) return ['NEAR_STATIC_SAMPLE_PAIR'];
  if (difference < 7) return ['LOW_VISUAL_CHANGE'];
  return [];
};
