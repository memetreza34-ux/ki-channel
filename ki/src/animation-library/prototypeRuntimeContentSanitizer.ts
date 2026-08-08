export type SanitizablePrototypeRuntimeContent = {
  labels: Record<string, string>;
  values: Record<string, string | number>;
};

export type PrototypeRuntimeContentSanitizerInput = {
  animationId: string;
  spokenText: string;
  derived: SanitizablePrototypeRuntimeContent;
};

const normalize = (value: string): string =>
  value
    .toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .trim();

const unique = (values: readonly string[]): string[] =>
  [...new Set(values.map((value) => value.trim()).filter(Boolean))];

const ENTITY_STOPWORDS = new Set([
  'aber', 'als', 'also', 'am', 'an', 'auch', 'auf', 'aus', 'bei', 'beim',
  'bis', 'das', 'dass', 'dem', 'den', 'der', 'des', 'die', 'dies', 'diese',
  'dieser', 'durch', 'ein', 'eine', 'einem', 'einen', 'einer', 'es', 'für',
  'im', 'in', 'ist', 'mit', 'nach', 'nur', 'oder', 'ohne', 'sich', 'sie',
  'sind', 'so', 'und', 'von', 'vor', 'während', 'weil', 'wenn', 'wie',
  'wird', 'werden', 'zu', 'zum', 'zur',
]);

const capitalizedEntities = (spokenText: string): string[] => {
  const matches =
    spokenText.match(
      /\b[\p{Lu}][\p{L}\d-]{1,}(?:\s+[A-ZÄÖÜ0-9]\b)?/gu,
    ) ?? [];
  return unique(
    matches.filter((value) => {
      const normalized = normalize(value);
      return !ENTITY_STOPWORDS.has(normalized) && value.length >= 2;
    }),
  );
};

const suspiciousArticleFragment = (value: string): boolean =>
  /^(?:die|der|das|ein|eine|einen|einem|einer)\s+[A-ZÄÖÜ0-9]$/iu.test(
    value.trim(),
  );

const repairEntityLabels = ({
  animationId,
  spokenText,
  labels,
}: {
  animationId: string;
  spokenText: string;
  labels: Record<string, string>;
}): Record<string, string> => {
  const entityKeyPatterns: Record<string, RegExp[]> = {
    'ranking-dynamic-podium-rise-v1': [/^candidate\d+$/],
    'probability-probability-fluid-columns-v1': [/^candidate\d+$/],
    'comparison-benchmark-racetrack-v1': [/^competitor\d+$/],
    'semantic-space-meaning-terrain-v1': [/^concept\d+$/],
    'time-change-timeline-microscope-v1': [/^milestone\d+$/],
  };
  const patterns = entityKeyPatterns[animationId] ?? [];
  if (patterns.length === 0) return labels;

  const candidates = capitalizedEntities(spokenText);
  let replacementIndex = 0;
  return Object.fromEntries(
    Object.entries(labels).map(([key, value]) => {
      if (!patterns.some((pattern) => pattern.test(key))) return [key, value];
      if (!suspiciousArticleFragment(value)) return [key, value];
      const replacement = candidates[replacementIndex];
      replacementIndex += 1;
      return [key, replacement ?? value.replace(/^\S+\s+/, '')];
    }),
  );
};

const explicitPercentage = (spokenText: string): number | null => {
  const numeric = spokenText.match(/\b(\d{1,3}(?:[.,]\d+)?)\s*(?:%|prozent)\b/i);
  if (numeric) {
    const parsed = Number(numeric[1].replace(',', '.'));
    if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 100) return parsed;
  }
  const normalized = normalize(spokenText).replace(/\s+/g, ' ');
  if (/\bhundert(?:prozent| prozent)\b/.test(normalized)) return 100;
  if (/\bnull(?:prozent| prozent)\b/.test(normalized)) return 0;
  return null;
};

const detectCostUnit = (spokenText: string): string | null => {
  if (/\b(?:cent|ct)\b/i.test(spokenText)) return 'ct';
  if (/€|\beuro\b/i.test(spokenText)) return '€';
  if (/\$|\b(?:dollar|usd)\b/i.test(spokenText)) return '$';
  if (/\bcredits?\b/i.test(spokenText)) return 'Credits';
  if (/\btokens?\b/i.test(spokenText)) return 'Token';
  return null;
};

const detectLatencyUnit = (spokenText: string): string | null => {
  if (/\b(?:ms|millisekunden?)\b/i.test(spokenText)) return 'ms';
  if (/\b(?:µs|us|mikrosekunden?)\b/i.test(spokenText)) return 'µs';
  if (/\b(?:sekunden?|sek\.?|s)\b/i.test(spokenText)) return 's';
  return null;
};

const parseMeasurement = (value: string): number | null => {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
};

const collectMeasurements = (
  spokenText: string,
  patterns: readonly RegExp[],
): number[] => {
  const values: number[] = [];
  for (const pattern of patterns) {
    for (const match of spokenText.matchAll(pattern)) {
      const raw = match.slice(1).find(Boolean);
      if (!raw) continue;
      const parsed = parseMeasurement(raw);
      if (parsed !== null) values.push(parsed);
    }
  }
  return values;
};

const costMeasurements = (spokenText: string, unit: string): number[] => {
  const number = '(-?\\d+(?:[.,]\\d+)?)';
  if (unit === 'ct') {
    return collectMeasurements(spokenText, [new RegExp(`${number}\\s*(?:cent|ct)\\b`, 'gi')]);
  }
  if (unit === '€') {
    return collectMeasurements(spokenText, [
      new RegExp(`${number}\\s*(?:€|euro\\b)`, 'gi'),
      new RegExp(`€\\s*${number}`, 'gi'),
    ]);
  }
  if (unit === '$') {
    return collectMeasurements(spokenText, [
      new RegExp(`${number}\\s*(?:\\$|dollar\\b|usd\\b)`, 'gi'),
      new RegExp(`\\$\\s*${number}`, 'gi'),
    ]);
  }
  if (unit === 'Credits') {
    return collectMeasurements(spokenText, [new RegExp(`${number}\\s*credits?\\b`, 'gi')]);
  }
  if (unit === 'Token') {
    return collectMeasurements(spokenText, [new RegExp(`${number}\\s*tokens?\\b`, 'gi')]);
  }
  return [];
};

const latencyMeasurements = (spokenText: string, unit: string): number[] => {
  const number = '(-?\\d+(?:[.,]\\d+)?)';
  if (unit === 'ms') {
    return collectMeasurements(spokenText, [new RegExp(`${number}\\s*(?:ms|millisekunden?)\\b`, 'gi')]);
  }
  if (unit === 'µs') {
    return collectMeasurements(spokenText, [new RegExp(`${number}\\s*(?:µs|us|mikrosekunden?)\\b`, 'gi')]);
  }
  if (unit === 's') {
    return collectMeasurements(spokenText, [new RegExp(`${number}\\s*(?:sekunden?|sek\\.?|s)\\b`, 'gi')]);
  }
  return [];
};

const explicitPercentages = (spokenText: string): number[] =>
  collectMeasurements(spokenText, [
    /\b(\d{1,3}(?:[.,]\d+)?)\s*(?:%|prozent)\b/gi,
  ]).filter((value) => value >= 0 && value <= 100);

const scoreMeasurements = (spokenText: string): number[] =>
  collectMeasurements(spokenText, [
    /\bscore(?:\s+von)?\s*(-?\d+(?:[.,]\d+)?)(?:\s*(?:punkte?|points?|%|prozent))?|\b(?:mit|erreicht(?:\s+mit)?|hat)\s*(-?\d+(?:[.,]\d+)?)\s*(?:punkte?|points?|%|prozent)\b|(-?\d+(?:[.,]\d+)?)\s*(?:punkte?|points?)\b/gi,
  ]).filter((value) => value >= 0 && value <= 100);

const numericTokenCount = (spokenText: string): number =>
  [...spokenText.matchAll(/-?\d+(?:[.,]\d+)?/g)].length;

const unitMentionCount = (spokenText: string, unit: string): number => {
  const patterns: Record<string, RegExp> = {
    ct: /\b(?:cent|ct)\b/gi,
    '€': /€|\beuro\b/gi,
    '$': /\$|\b(?:dollar|usd)\b/gi,
    Credits: /\bcredits?\b/gi,
    Token: /\btokens?\b/gi,
    ms: /\b(?:ms|millisekunden?)\b/gi,
    'µs': /\b(?:µs|us|mikrosekunden?)\b/gi,
    s: /\b(?:sekunden?|sek\.?|s)\b/gi,
  };
  return [...spokenText.matchAll(patterns[unit] ?? /$^/g)].length;
};

const sanitizeProbability = (
  spokenText: string,
  values: Record<string, string | number>,
): Record<string, string | number> => {
  const percentages = explicitPercentages(spokenText);
  const fallbackPercentage = percentages[0] ?? explicitPercentage(spokenText);
  const nextValues = {...values};

  for (let index = 0; index < 3; index += 1) {
    nextValues[`candidate${index + 1}ProbabilityExact`] =
      percentages[index] !== undefined ? 1 : 0;
  }
  nextValues.measurementExact = fallbackPercentage === null ? 0 : 1;

  if (percentages.length >= 3) {
    for (let index = 0; index < 3; index += 1) {
      nextValues[`candidate${index + 1}End`] = percentages[index];
    }
    return nextValues;
  }
  if (fallbackPercentage === null) return nextValues;

  const primaryEnd = Math.max(0, Math.min(100, fallbackPercentage));
  const remaining = 100 - primaryEnd;
  const secondEnd = remaining === 0 ? 0 : Math.round(remaining * 0.65);
  const thirdEnd = Math.max(0, 100 - primaryEnd - secondEnd);
  nextValues.candidate1End = primaryEnd;
  nextValues.candidate2End = secondEnd;
  nextValues.candidate3End = thirdEnd;
  nextValues.candidate1ProbabilityExact = 1;
  return nextValues;
};

const sanitizeRanking = (
  spokenText: string,
  values: Record<string, string | number>,
): Record<string, string | number> => {
  const scores = scoreMeasurements(spokenText);
  const nextValues = {...values, measurementExact: scores.length > 0 ? 1 : 0};
  for (let index = 0; index < 3; index += 1) {
    const score = scores[index];
    nextValues[`candidate${index + 1}ScoreExact`] = score === undefined ? 0 : 1;
    if (score === undefined) continue;
    nextValues[`candidate${index + 1}End`] = score;
    nextValues[`candidate${index + 1}Start`] = Math.max(10, score - 18 + index * 4);
    nextValues[`candidate${index + 1}Middle`] = Math.max(10, score - 7 + (2 - index) * 3);
  }
  return nextValues;
};

const sanitizeComparison = (
  spokenText: string,
  values: Record<string, string | number>,
): Record<string, string | number> => {
  const scores = scoreMeasurements(spokenText);
  const nextValues = {...values, measurementExact: scores.length > 0 ? 1 : 0};
  for (let index = 0; index < 2; index += 1) {
    const score = scores[index];
    nextValues[`competitor${index + 1}ScoreExact`] = score === undefined ? 0 : 1;
    if (score !== undefined) nextValues[`competitor${index + 1}Final`] = score;
  }
  return nextValues;
};

const sanitizeCost = (
  spokenText: string,
  labels: Record<string, string>,
  values: Record<string, string | number>,
): SanitizablePrototypeRuntimeContent => {
  const unit = detectCostUnit(spokenText);
  const boundMeasurements = unit ? costMeasurements(spokenText, unit) : [];
  const fallbackExact =
    unit !== null &&
    unitMentionCount(spokenText, unit) >= 2 &&
    numericTokenCount(spokenText) <= 2 &&
    values.initialCost !== undefined &&
    values.optimizedCost !== undefined;
  const exact = boundMeasurements.length >= 2 || fallbackExact;
  const nextValues = {...values, measurementExact: exact ? 1 : 0};

  if (boundMeasurements.length >= 2) {
    const initial = Math.max(boundMeasurements[0], boundMeasurements[1]);
    const optimized = Math.min(boundMeasurements[0], boundMeasurements[1]);
    const delta = Math.max(0, initial - optimized);
    nextValues.initialCost = initial;
    nextValues.optimizedCost = optimized;
    const first = Math.round(delta * 0.34);
    const second = Math.round(delta * 0.33);
    nextValues.leak1Amount = first;
    nextValues.leak2Amount = second;
    nextValues.leak3Amount = Math.max(0, delta - first - second);
  }

  if (!exact) {
    delete nextValues.initialCost;
    delete nextValues.optimizedCost;
    delete nextValues.savedAmount;
    for (let index = 1; index <= 3; index += 1) {
      delete nextValues[`leak${index}Amount`];
    }
  }
  return {
    labels: unit ? {...labels, currency: unit} : labels,
    values: nextValues,
  };
};

const sanitizeLatency = (
  spokenText: string,
  labels: Record<string, string>,
  values: Record<string, string | number>,
): SanitizablePrototypeRuntimeContent => {
  const unit = detectLatencyUnit(spokenText);
  const boundMeasurements = unit ? latencyMeasurements(spokenText, unit) : [];
  const fallbackExact =
    unit !== null &&
    unitMentionCount(spokenText, unit) >= 2 &&
    numericTokenCount(spokenText) <= 2 &&
    values.slowLatency !== undefined &&
    values.fastLatency !== undefined;
  const exact = boundMeasurements.length >= 2 || fallbackExact;
  const nextValues = {...values, measurementExact: exact ? 1 : 0};

  if (boundMeasurements.length >= 2) {
    nextValues.slowLatency = Math.max(boundMeasurements[0], boundMeasurements[1]);
    nextValues.fastLatency = Math.min(boundMeasurements[0], boundMeasurements[1]);
  }
  if (!exact) {
    delete nextValues.slowLatency;
    delete nextValues.fastLatency;
  }
  return {
    labels: unit ? {...labels, latencyUnit: unit} : labels,
    values: nextValues,
  };
};

export const sanitizePrototypeRuntimeContent = ({
  animationId,
  spokenText,
  derived,
}: PrototypeRuntimeContentSanitizerInput): SanitizablePrototypeRuntimeContent => {
  const repairedLabels = repairEntityLabels({
    animationId,
    spokenText,
    labels: {...derived.labels},
  });
  let values = {...derived.values};

  if (animationId === 'probability-probability-fluid-columns-v1') {
    values = sanitizeProbability(spokenText, values);
  }
  if (animationId === 'ranking-dynamic-podium-rise-v1') {
    values = sanitizeRanking(spokenText, values);
  }
  if (animationId === 'comparison-benchmark-racetrack-v1') {
    values = sanitizeComparison(spokenText, values);
  }
  if (animationId === 'cost-efficiency-budget-leak-meter-v1') {
    return sanitizeCost(spokenText, repairedLabels, values);
  }
  if (animationId === 'scale-performance-latency-tunnel-race-v1') {
    return sanitizeLatency(spokenText, repairedLabels, values);
  }

  return {labels: repairedLabels, values};
};
