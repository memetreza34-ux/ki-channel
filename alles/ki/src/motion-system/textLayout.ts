export type SentenceTypography = {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

export type LabelTypographyOptions = {
  maxFontSize?: number;
  minFontSize?: number;
};

export type LabelTypography = {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

const longestTokenLength = (value: string): number =>
  value
    .trim()
    .split(/\s+/)
    .reduce((longest, token) => Math.max(longest, token.length), 0);

export const getSentenceTypography = (sentence: string): SentenceTypography => {
  const length = sentence.trim().length;
  const longestToken = longestTokenLength(sentence);

  let fontSize: number;
  let lineHeight: number;

  if (length <= 70) {
    fontSize = 34;
    lineHeight = 1.25;
  } else if (length <= 110) {
    fontSize = 31;
    lineHeight = 1.22;
  } else if (length <= 160) {
    fontSize = 28;
    lineHeight = 1.2;
  } else if (length <= 220) {
    fontSize = 25;
    lineHeight = 1.18;
  } else {
    fontSize = 22;
    lineHeight = 1.15;
  }

  if (longestToken > 28) {
    fontSize = Math.max(20, fontSize - 2);
  }

  return {
    fontSize,
    lineHeight,
    letterSpacing: fontSize >= 31 ? -0.4 : -0.2,
  };
};

export const getLabelTypography = (
  label: string,
  {maxFontSize = 34, minFontSize = 20}: LabelTypographyOptions = {},
): LabelTypography => {
  if (!Number.isFinite(maxFontSize) || !Number.isFinite(minFontSize)) {
    throw new Error('Label-Schriftgrößen müssen endliche Zahlen sein.');
  }
  if (maxFontSize <= 0 || minFontSize <= 0 || minFontSize > maxFontSize) {
    throw new Error('Label-Schriftgrößen müssen positiv sein und min darf max nicht überschreiten.');
  }

  const length = label.trim().length;
  const longestToken = longestTokenLength(label);
  let reduction = 0;

  if (length > 26) reduction += 10;
  else if (length > 20) reduction += 8;
  else if (length > 14) reduction += 5;
  else if (length > 9) reduction += 2;

  if (longestToken > 18) reduction += 3;
  else if (longestToken > 13) reduction += 1;

  const fontSize = Math.max(minFontSize, Math.min(maxFontSize, maxFontSize - reduction));

  return {
    fontSize,
    lineHeight: length > 18 || longestToken > 16 ? 1.08 : 1.15,
    letterSpacing: fontSize >= 32 ? -0.6 : -0.25,
  };
};
