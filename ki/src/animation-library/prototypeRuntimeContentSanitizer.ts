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
  /^(?:die|der|das|ein|eine|einen|einem|einer)\s+[A-ZÄÖÜ0-9]$/u.test(
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

const sanitizeProbability = (
  spokenText: string,
  values: Record<string, string | number>,
): Record<string, string | number> => {
  const percentage = explicitPercentage(spokenText);
  if (percentage === null) return values;
  const primaryEnd = Math.max(0, Math.min(100, percentage));
  const remaining = 100 - primaryEnd;
  const secondEnd = remaining === 0 ? 0 : Math.round(remaining * 0.65);
  const thirdEnd = Math.max(0, 100 - primaryEnd - secondEnd);
  return {
    ...values,
    candidate1End: primaryEnd,
    candidate2End: secondEnd,
    candidate3End: thirdEnd,
  };
};

const sanitizeCost = (
  spokenText: string,
  labels: Record<string, string>,
  values: Record<string, string | number>,
): SanitizablePrototypeRuntimeContent => {
  const unit = detectCostUnit(spokenText);
  const exact =
    unit !== null &&
    values.initialCost !== undefined &&
    values.optimizedCost !== undefined;
  const nextValues = {...values, measurementExact: exact ? 1 : 0};
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
  const exact =
    unit !== null &&
    values.slowLatency !== undefined &&
    values.fastLatency !== undefined;
  const nextValues = {...values, measurementExact: exact ? 1 : 0};
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
  if (animationId === 'cost-efficiency-budget-leak-meter-v1') {
    return sanitizeCost(spokenText, repairedLabels, values);
  }
  if (animationId === 'scale-performance-latency-tunnel-race-v1') {
    return sanitizeLatency(spokenText, repairedLabels, values);
  }

  return {labels: repairedLabels, values};
};
