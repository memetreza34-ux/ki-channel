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

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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

const structuredEntities = (spokenText: string): string[] =>
  unique(
    spokenText.match(
      /\b[\p{Lu}][\p{L}\d-]{1,}\s+[A-ZÄÖÜ0-9]\b/gu,
    ) ?? [],
  );

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
  const priorityEntityAnimations = new Set([
    'ranking-dynamic-podium-rise-v1',
    'probability-probability-fluid-columns-v1',
    'comparison-benchmark-racetrack-v1',
  ]);
  const patterns = entityKeyPatterns[animationId] ?? [];
  if (patterns.length === 0) return labels;

  const genericCandidates = capitalizedEntities(spokenText);
  const preferredCandidates = priorityEntityAnimations.has(animationId)
    ? unique([...structuredEntities(spokenText), ...genericCandidates])
    : genericCandidates;

  let suspiciousReplacementIndex = 0;
  return Object.fromEntries(
    Object.entries(labels).map(([key, value]) => {
      if (!patterns.some((pattern) => pattern.test(key))) return [key, value];

      if (priorityEntityAnimations.has(animationId)) {
        const numericIndex = Number(key.match(/\d+/)?.[0] ?? '0') - 1;
        const preferred = preferredCandidates[numericIndex];
        if (preferred) return [key, preferred];
      }

      if (!suspiciousArticleFragment(value)) return [key, value];
      const replacement = preferredCandidates[suspiciousReplacementIndex];
      suspiciousReplacementIndex += 1;
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

const percentageForLabel = (
  spokenText: string,
  label: string,
): number | null => {
  const text = normalize(spokenText);
  const normalizedLabel = normalize(label);
  if (normalizedLabel.length < 2) return null;
  const escapedLabel = escapeRegex(normalizedLabel).replace(/\s+/g, '\\s+');
  const number = '(\\d{1,3}(?:[.,]\\d+)?)';
  const after = new RegExp(`(?:^|\\b)${escapedLabel}(?:\\b|$)[^0-9,.!?;]{0,28}${number}\\s*(?:%|prozent)\\b`);
  const before = new RegExp(`${number}\\s*(?:%|prozent)\\b[^,.!?;]{0,18}\\b(?:fur|bei|auf)\\b\\s+(?:^|\\b)${escapedLabel}(?:\\b|$)`);
  const match = after.exec(text) ?? before.exec(text);
  if (!match) return null;
  const parsed = Number(match[1].replace(',', '.'));
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 100
    ? parsed
    : null;
};

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

const winnerCueIndex = ({
  spokenText,
  labels,
  prefix,
  count,
}: {
  spokenText: string;
  labels: Record<string, string>;
  prefix: string;
  count: number;
}): number => {
  const text = normalize(spokenText);
  const cue = '(?:gewinnt|gewinner|sieger|fuhrt|vorne|platz\\s*1|erster|erste|bestes|beste|besten)';
  const negative = '(?:nicht|kein|keine|keinen|keiner|keinem|weder|nie|niemals)';
  const safeGap = `(?:(?!\\b${negative}\\b)[^,.!?;]){0,18}`;
  const notNegatedAfterCue = `(?!\\s+${negative}\\b)`;
  for (let index = 0; index < count; index += 1) {
    const label = normalize(labels[`${prefix}${index + 1}`] ?? '');
    if (label.length < 2) continue;
    const escapedLabel = escapeRegex(label).replace(/\s+/g, '\\s+');
    const labelBeforeCue = new RegExp(`(?:^|\\b)${escapedLabel}(?:\\b|$)${safeGap}\\b${cue}\\b${notNegatedAfterCue}`);
    const cueBeforeLabel = new RegExp(`\\b${cue}\\b${notNegatedAfterCue}${safeGap}(?:^|\\b)${escapedLabel}(?:\\b|$)`);
    if (labelBeforeCue.test(text) || cueBeforeLabel.test(text)) return index;
  }
  return -1;
};

const distributeProbabilityRemainder = ({
  exactValues,
  fallbackValues,
}: {
  exactValues: readonly (number | null)[];
  fallbackValues: readonly number[];
}): number[] => {
  const exactSum = exactValues.reduce(
    (sum, value) => sum + (value ?? 0),
    0,
  );
  const missing = exactValues
    .map((value, index) => (value === null ? index : -1))
    .filter((index) => index >= 0);
  if (missing.length === 0 || exactSum > 100) {
    return exactValues.map((value, index) => value ?? fallbackValues[index]);
  }
  const remaining = 100 - exactSum;
  const fallbackWeight = missing.reduce(
    (sum, index) => sum + Math.max(1, fallbackValues[index]),
    0,
  );
  const distributed = exactValues.map((value) => value ?? 0);
  let assigned = 0;
  missing.forEach((index, missingIndex) => {
    const value = missingIndex === missing.length - 1
      ? remaining - assigned
      : Math.round(
          remaining * (Math.max(1, fallbackValues[index]) / fallbackWeight),
        );
    distributed[index] = Math.max(0, value);
    assigned += value;
  });
  return distributed;
};

const sanitizeProbability = (
  spokenText: string,
  labels: Record<string, string>,
  values: Record<string, string | number>,
): Record<string, string | number> => {
  const sequentialPercentages = explicitPercentages(spokenText);
  const candidateLabels = [labels.candidate1, labels.candidate2, labels.candidate3];
  let exactValues = candidateLabels.map((label) =>
    label ? percentageForLabel(spokenText, label) : null,
  );
  const associatedCount = exactValues.filter((value) => value !== null).length;
  if (associatedCount === 0 && sequentialPercentages.length > 0) {
    exactValues = exactValues.map((_, index) => sequentialPercentages[index] ?? null);
  }
  const fallbackValues = [1, 2, 3].map((index) =>
    Number(values[`candidate${index}End`] ?? 0),
  );
  const resolvedEnds = distributeProbabilityRemainder({
    exactValues,
    fallbackValues,
  });
  const fallbackPercentage = explicitPercentage(spokenText);
  const winnerCue = winnerCueIndex({spokenText, labels, prefix: 'candidate', count: 3});
  const nextValues = {...values};

  for (let index = 0; index < 3; index += 1) {
    const exact = exactValues[index] !== null;
    nextValues[`candidate${index + 1}ProbabilityExact`] = exact ? 1 : 0;
    if (associatedCount > 0 || sequentialPercentages.length > 0) {
      nextValues[`candidate${index + 1}End`] = resolvedEnds[index];
    }
  }
  nextValues.probabilityOutcomeGrounded =
    associatedCount > 0 || sequentialPercentages.length > 0 ||
    fallbackPercentage !== null || winnerCue >= 0
      ? 1
      : 0;

  if (
    associatedCount === 0 &&
    sequentialPercentages.length === 0 &&
    fallbackPercentage !== null
  ) {
    const primaryEnd = Math.max(0, Math.min(100, fallbackPercentage));
    const remaining = 100 - primaryEnd;
    const secondEnd = remaining === 0 ? 0 : Math.round(remaining * 0.65);
    const thirdEnd = Math.max(0, 100 - primaryEnd - secondEnd);
    nextValues.candidate1End = primaryEnd;
    nextValues.candidate2End = secondEnd;
    nextValues.candidate3End = thirdEnd;
    nextValues.candidate1ProbabilityExact = 1;
    return nextValues;
  }
  if (
    associatedCount === 0 &&
    sequentialPercentages.length === 0 &&
    winnerCue >= 0
  ) {
    for (let index = 0; index < 3; index += 1) {
      nextValues[`candidate${index + 1}End`] = index === winnerCue ? 68 : 16;
    }
  }
  return nextValues;
};

const sanitizeRanking = (
  spokenText: string,
  labels: Record<string, string>,
  values: Record<string, string | number>,
): Record<string, string | number> => {
  const scores = scoreMeasurements(spokenText);
  const winnerCue = winnerCueIndex({spokenText, labels, prefix: 'candidate', count: 3});
  const nextValues = {
    ...values,
    rankingOutcomeGrounded: scores.length >= 2 || winnerCue >= 0 ? 1 : 0,
  };
  for (let index = 0; index < 3; index += 1) {
    const score = scores[index];
    nextValues[`candidate${index + 1}ScoreExact`] = score === undefined ? 0 : 1;
    if (score === undefined) continue;
    nextValues[`candidate${index + 1}End`] = score;
    nextValues[`candidate${index + 1}Start`] = Math.max(10, score - 18 + index * 4);
    nextValues[`candidate${index + 1}Middle`] = Math.max(10, score - 7 + (2 - index) * 3);
  }
  if (scores.length < 2 && winnerCue >= 0) {
    for (let index = 0; index < 3; index += 1) {
      const end = index === winnerCue ? 92 : 66 - index * 4;
      nextValues[`candidate${index + 1}End`] = end;
      nextValues[`candidate${index + 1}Start`] = Math.max(10, end - 18 + index * 4);
      nextValues[`candidate${index + 1}Middle`] = Math.max(10, end - 7 + (2 - index) * 3);
    }
  }
  return nextValues;
};

const sanitizeComparison = (
  spokenText: string,
  labels: Record<string, string>,
  values: Record<string, string | number>,
): Record<string, string | number> => {
  const scores = scoreMeasurements(spokenText);
  const winnerCue = winnerCueIndex({spokenText, labels, prefix: 'competitor', count: 2});
  const nextValues = {
    ...values,
    comparisonOutcomeGrounded: scores.length >= 2 || winnerCue >= 0 ? 1 : 0,
  };
  for (let index = 0; index < 2; index += 1) {
    const score = scores[index];
    nextValues[`competitor${index + 1}ScoreExact`] = score === undefined ? 0 : 1;
    if (score !== undefined) nextValues[`competitor${index + 1}Final`] = score;
  }
  if (scores.length < 2 && winnerCue >= 0) {
    nextValues.competitor1Final = winnerCue === 0 ? 100 : 0.88;
    nextValues.competitor2Final = winnerCue === 1 ? 100 : 0.88;
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
    nextValues.slowLatency = boundMeasurements[0];
    nextValues.fastLatency = boundMeasurements[1];
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
    values = sanitizeProbability(spokenText, repairedLabels, values);
  }
  if (animationId === 'ranking-dynamic-podium-rise-v1') {
    values = sanitizeRanking(spokenText, repairedLabels, values);
  }
  if (animationId === 'comparison-benchmark-racetrack-v1') {
    values = sanitizeComparison(spokenText, repairedLabels, values);
  }
  if (animationId === 'cost-efficiency-budget-leak-meter-v1') {
    return sanitizeCost(spokenText, repairedLabels, values);
  }
  if (animationId === 'scale-performance-latency-tunnel-race-v1') {
    return sanitizeLatency(spokenText, repairedLabels, values);
  }

  return {labels: repairedLabels, values};
};
