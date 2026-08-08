export type AssociatablePrototypeRuntimeContent = {
  labels: Record<string, string>;
  values: Record<string, string | number>;
};

export type PrototypeRuntimeContentAssociationInput = {
  animationId: string;
  spokenText: string;
  content: AssociatablePrototypeRuntimeContent;
};

const normalize = (value: string): string =>
  value
    .toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .trim();

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parseNumber = (value: string): number | null => {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
};

const toNumber = (value: string | number | undefined, fallback: number): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizedLabelPattern = (label: string): string =>
  escapeRegex(normalize(label)).replace(/\s+/g, '\\s+');

const safeGap = (otherLabels: readonly string[], maxChars: number): string => {
  const patterns = otherLabels
    .map(normalize)
    .filter((label) => label.length >= 2)
    .map((label) => escapeRegex(label).replace(/\s+/g, '\\s+'));
  const otherLabelGuard = patterns.length > 0
    ? `(?!\\b(?:${patterns.join('|')})\\b)`
    : '';
  return `(?:${otherLabelGuard}[^0-9,.!?;]){0,${maxChars}}`;
};

const scoreForLabel = (
  spokenText: string,
  label: string,
  otherLabels: readonly string[],
): number | null => {
  const text = normalize(spokenText);
  const normalizedLabel = normalize(label);
  if (normalizedLabel.length < 2) return null;
  const escapedLabel = normalizedLabelPattern(label);
  const gap = safeGap(otherLabels, 24);
  const score = '(-?\\d+(?:[.,]\\d+)?)';
  const labelBefore = new RegExp(
    `(?:^|\\b)${escapedLabel}(?:\\b|$)${gap}${score}\\s*(?:punkte?|points?|%|prozent)\\b`,
  );
  const scoreBefore = new RegExp(
    `${score}\\s*(?:punkte?|points?|%|prozent)\\b${safeGap(otherLabels, 18)}\\b(?:fur|bei|von)\\b\\s+(?:^|\\b)${escapedLabel}(?:\\b|$)`,
  );
  const match = labelBefore.exec(text) ?? scoreBefore.exec(text);
  if (!match) return null;
  const parsed = parseNumber(match[1]);
  return parsed !== null && parsed >= 0 && parsed <= 100 ? parsed : null;
};

const percentageForLabel = (
  spokenText: string,
  label: string,
  otherLabels: readonly string[],
): number | null => {
  const text = normalize(spokenText);
  const normalizedLabel = normalize(label);
  if (normalizedLabel.length < 2) return null;
  const escapedLabel = normalizedLabelPattern(label);
  const number = '(\\d{1,3}(?:[.,]\\d+)?)';
  const labelBefore = new RegExp(
    `(?:^|\\b)${escapedLabel}(?:\\b|$)${safeGap(otherLabels, 28)}${number}\\s*(?:%|prozent)\\b`,
  );
  const percentageBefore = new RegExp(
    `${number}\\s*(?:%|prozent)\\b${safeGap(otherLabels, 20)}\\b(?:fur|bei|auf|entfallen\\s+auf|fallen\\s+auf)\\b\\s+(?:^|\\b)${escapedLabel}(?:\\b|$)`,
  );
  const match = labelBefore.exec(text) ?? percentageBefore.exec(text);
  if (!match) return null;
  const parsed = parseNumber(match[1]);
  return parsed !== null && parsed >= 0 && parsed <= 100 ? parsed : null;
};

const associateRankingScores = (
  spokenText: string,
  content: AssociatablePrototypeRuntimeContent,
): AssociatablePrototypeRuntimeContent => {
  const values = {...content.values};
  const labels = [1, 2, 3].map(
    (index) => content.labels[`candidate${index}`] ?? '',
  );
  const exactScores = labels.map((label, index) =>
    scoreForLabel(
      spokenText,
      label,
      labels.filter((_, labelIndex) => labelIndex !== index),
    ),
  );
  const associatedCount = exactScores.filter((value) => value !== null).length;

  if (associatedCount > 0) {
    exactScores.forEach((score, index) => {
      const keyIndex = index + 1;
      values[`candidate${keyIndex}ScoreExact`] = score === null ? 0 : 1;
      if (score === null) return;
      values[`candidate${keyIndex}End`] = score;
      values[`candidate${keyIndex}Start`] = Math.max(
        10,
        score - 18 + index * 4,
      );
      values[`candidate${keyIndex}Middle`] = Math.max(
        10,
        score - 7 + (2 - index) * 3,
      );
    });
    if (associatedCount >= 2) values.rankingOutcomeGrounded = 1;
  }

  return {labels: content.labels, values};
};

const associateComparisonScores = (
  spokenText: string,
  content: AssociatablePrototypeRuntimeContent,
): AssociatablePrototypeRuntimeContent => {
  const values = {...content.values};
  const labels = [1, 2].map(
    (index) => content.labels[`competitor${index}`] ?? '',
  );
  const exactScores = labels.map((label, index) =>
    scoreForLabel(
      spokenText,
      label,
      labels.filter((_, labelIndex) => labelIndex !== index),
    ),
  );
  const associatedCount = exactScores.filter((value) => value !== null).length;

  if (associatedCount > 0) {
    exactScores.forEach((score, index) => {
      const keyIndex = index + 1;
      values[`competitor${keyIndex}ScoreExact`] = score === null ? 0 : 1;
      if (score !== null) values[`competitor${keyIndex}Final`] = score;
    });
    if (associatedCount >= 2) values.comparisonOutcomeGrounded = 1;
  }

  return {labels: content.labels, values};
};

const distributeProbabilityRemainder = (
  exactValues: readonly (number | null)[],
  fallbackValues: readonly number[],
): number[] | null => {
  const exactSum = exactValues.reduce(
    (sum, value) => sum + (value ?? 0),
    0,
  );
  if (exactSum > 100) return null;
  const missing = exactValues
    .map((value, index) => (value === null ? index : -1))
    .filter((index) => index >= 0);
  if (missing.length === 0) return exactValues.map((value) => value ?? 0);

  const remaining = 100 - exactSum;
  const fallbackWeight = missing.reduce(
    (sum, index) => sum + Math.max(1, fallbackValues[index]),
    0,
  );
  const result = exactValues.map((value) => value ?? 0);
  let assigned = 0;
  missing.forEach((index, missingIndex) => {
    const value = missingIndex === missing.length - 1
      ? remaining - assigned
      : Math.round(
          remaining * (Math.max(1, fallbackValues[index]) / fallbackWeight),
        );
    result[index] = Math.max(0, value);
    assigned += value;
  });
  return result;
};

const associateProbabilityPercentages = (
  spokenText: string,
  content: AssociatablePrototypeRuntimeContent,
): AssociatablePrototypeRuntimeContent => {
  const values = {...content.values};
  const labels = [1, 2, 3].map(
    (index) => content.labels[`candidate${index}`] ?? '',
  );
  const exactValues = labels.map((label, index) =>
    percentageForLabel(
      spokenText,
      label,
      labels.filter((_, labelIndex) => labelIndex !== index),
    ),
  );
  const associatedCount = exactValues.filter((value) => value !== null).length;
  if (associatedCount === 0) return content;

  for (let index = 0; index < 3; index += 1) {
    values[`candidate${index + 1}ProbabilityExact`] =
      exactValues[index] === null ? 0 : 1;
  }

  const fallbackValues = [1, 2, 3].map((index) =>
    toNumber(values[`candidate${index}End`], 100 / 3),
  );
  const distributed = distributeProbabilityRemainder(
    exactValues,
    fallbackValues,
  );
  if (!distributed) {
    for (let index = 0; index < 3; index += 1) {
      values[`candidate${index + 1}ProbabilityExact`] = 0;
    }
    values.probabilityOutcomeGrounded = 0;
    return {labels: content.labels, values};
  }

  distributed.forEach((value, index) => {
    values[`candidate${index + 1}End`] = value;
  });
  values.probabilityOutcomeGrounded = 1;
  return {labels: content.labels, values};
};

const costUnitPattern = (unit: string): string | null => {
  if (unit === 'ct') return '(?:cent\\b|ct\\b)';
  if (unit === '€') return '(?:€|euro\\b)';
  if (unit === '$') return '(?:\\$|dollar\\b|usd\\b)';
  if (unit === 'Credits') return 'credits?\\b';
  if (unit === 'Token') return 'tokens?\\b';
  return null;
};

const orderedCostMeasurements = (
  spokenText: string,
  unit: string,
): number[] => {
  const unitPattern = costUnitPattern(unit);
  if (!unitPattern) return [];
  const number = '(-?\\d+(?:[.,]\\d+)?)';
  const suffix = new RegExp(`${number}\\s*${unitPattern}`, 'gi');
  const prefix = new RegExp(`${unitPattern}\\s*${number}`, 'gi');
  const measurements: Array<{index: number; value: number}> = [];

  for (const pattern of [suffix, prefix]) {
    for (const match of spokenText.matchAll(pattern)) {
      const raw = match.slice(1).find(Boolean);
      if (!raw || match.index === undefined) continue;
      const value = parseNumber(raw);
      if (value === null) continue;
      measurements.push({index: match.index, value});
    }
  }

  return measurements
    .sort((left, right) => left.index - right.index)
    .filter(
      (entry, index, all) =>
        index === 0 ||
        entry.index !== all[index - 1].index ||
        entry.value !== all[index - 1].value,
    )
    .map((entry) => entry.value);
};

const enforceCostReductionDirection = (
  spokenText: string,
  content: AssociatablePrototypeRuntimeContent,
): AssociatablePrototypeRuntimeContent => {
  const values = {...content.values};
  const unit = content.labels.currency;
  const measurements = unit
    ? orderedCostMeasurements(spokenText, unit)
    : [];

  if (measurements.length < 2) return content;
  const initial = measurements[0];
  const optimized = measurements[1];

  if (optimized >= initial) {
    values.measurementExact = 0;
    delete values.initialCost;
    delete values.optimizedCost;
    delete values.savedAmount;
    for (let index = 1; index <= 3; index += 1) {
      delete values[`leak${index}Amount`];
    }
    return {labels: content.labels, values};
  }

  values.measurementExact = 1;
  values.initialCost = initial;
  values.optimizedCost = optimized;
  const delta = initial - optimized;
  const first = Math.round(delta * 0.34);
  const second = Math.round(delta * 0.33);
  values.leak1Amount = first;
  values.leak2Amount = second;
  values.leak3Amount = Math.max(0, delta - first - second);
  return {labels: content.labels, values};
};

export const associatePrototypeRuntimeContent = ({
  animationId,
  spokenText,
  content,
}: PrototypeRuntimeContentAssociationInput): AssociatablePrototypeRuntimeContent => {
  if (animationId === 'ranking-dynamic-podium-rise-v1') {
    return associateRankingScores(spokenText, content);
  }
  if (animationId === 'comparison-benchmark-racetrack-v1') {
    return associateComparisonScores(spokenText, content);
  }
  if (animationId === 'probability-probability-fluid-columns-v1') {
    return associateProbabilityPercentages(spokenText, content);
  }
  if (animationId === 'cost-efficiency-budget-leak-meter-v1') {
    return enforceCostReductionDirection(spokenText, content);
  }
  return content;
};
