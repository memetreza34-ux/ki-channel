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

const scoreForLabel = (spokenText: string, label: string): number | null => {
  const text = normalize(spokenText);
  const normalizedLabel = normalize(label);
  if (normalizedLabel.length < 2) return null;
  const escapedLabel = escapeRegex(normalizedLabel).replace(/\s+/g, '\\s+');
  const score = '(-?\\d+(?:[.,]\\d+)?)';
  const labelBefore = new RegExp(
    `(?:^|\\b)${escapedLabel}(?:\\b|$)[^0-9,.!?;]{0,24}${score}\\s*(?:punkte?|points?|%|prozent)\\b`,
  );
  const scoreBefore = new RegExp(
    `${score}\\s*(?:punkte?|points?|%|prozent)\\b[^,.!?;]{0,18}\\b(?:fur|bei|von)\\b\\s+(?:^|\\b)${escapedLabel}(?:\\b|$)`,
  );
  const match = labelBefore.exec(text) ?? scoreBefore.exec(text);
  if (!match) return null;
  const parsed = parseNumber(match[1]);
  return parsed !== null && parsed >= 0 && parsed <= 100 ? parsed : null;
};

const associateRankingScores = (
  spokenText: string,
  content: AssociatablePrototypeRuntimeContent,
): AssociatablePrototypeRuntimeContent => {
  const values = {...content.values};
  const exactScores = [1, 2, 3].map((index) =>
    scoreForLabel(spokenText, content.labels[`candidate${index}`] ?? ''),
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
  const exactScores = [1, 2].map((index) =>
    scoreForLabel(spokenText, content.labels[`competitor${index}`] ?? ''),
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

const costUnitPattern = (unit: string): string | null => {
  if (unit === 'ct') return '(?:cent|ct)';
  if (unit === '€') return '(?:€|euro)';
  if (unit === '$') return '(?:\\$|dollar|usd)';
  if (unit === 'Credits') return 'credits?';
  if (unit === 'Token') return 'tokens?';
  return null;
};

const orderedCostMeasurements = (
  spokenText: string,
  unit: string,
): number[] => {
  const unitPattern = costUnitPattern(unit);
  if (!unitPattern) return [];
  const number = '(-?\\d+(?:[.,]\\d+)?)';
  const suffix = new RegExp(`${number}\\s*${unitPattern}\\b?`, 'gi');
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
  if (animationId === 'cost-efficiency-budget-leak-meter-v1') {
    return enforceCostReductionDirection(spokenText, content);
  }
  return content;
};
