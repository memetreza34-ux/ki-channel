export type SentenceTypography = {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

export const getSentenceTypography = (sentence: string): SentenceTypography => {
  const length = sentence.trim().length;
  const longestToken = sentence
    .trim()
    .split(/\s+/)
    .reduce((longest, token) => Math.max(longest, token.length), 0);

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
