export type AssociatablePrototypeRuntimeContent = {
  labels: Record<string, string>;
  values: Record<string, string | number>;
};

export type PrototypeRuntimeContentAssociationInput = {
  animationId: string;
  spokenText: string;
  content: AssociatablePrototypeRuntimeContent;
};

type IndexedMeasurement = {
  index: number;
  value: number;
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

const otherLabelGuard = (otherLabels: readonly string[]): string => {
  const patterns = otherLabels
    .map(normalize)
    .filter((label) => label.length >= 2)
    .map((label) => escapeRegex(label).replace(/\s+/g, '\\s+'));
  return patterns.length > 0
    ? `(?!\\b(?:${patterns.join('|')})\\b)`
    : '';
};

const safeGap = (otherLabels: readonly string[], maxChars: number): string =>
  `(?:${otherLabelGuard(otherLabels)}[^0-9,.!?;]){0,${maxChars}}`;

const winnerGap = (otherLabels: readonly string[], maxChars: number): string => {
  const negative = '(?:nicht|kein|keine|keinen|keiner|keinem|weder|nie|niemals)';
  return `(?:(?!\\b${negative}\\b)${otherLabelGuard(otherLabels)}[^,.!?;]){0,${maxChars}}`;
};

const winnerCueIndex = (
  spokenText: string,
  labels: readonly string[],
): number => {
  const text = normalize(spokenText);
  const cue = '(?:gewinnt|gewinner|sieger|fuhrt(?!\\s+zu\\b)|vorne|(?:auf\\s+)?platz\\s*1|erstplatziert)';
  const negative = '(?:nicht|kein|keine|keinen|keiner|keinem|weder|nie|niemals)';
  const notNegatedAfterCue =
    `(?!\\s+(?:(?:zwar|doch)\\s+)?${negative}\\b)(?!\\s+auf\\s+keinen\\s+fall\\b)`;

  for (let index = 0; index < labels.length; index += 1) {
    const label = labels[index];
    if (normalize(label).length < 2) continue;
    const escapedLabel = normalizedLabelPattern(label);
    const peers = labels.filter((_, labelIndex) => labelIndex !== index);
    // Natural German score phrases such as “Tool A erreicht 96 Punkte und gewinnt”
    // are longer than the old 18-character gap. Other candidate labels,
    // punctuation and explicit negation still terminate the association.
    const gap = winnerGap(peers, 36);
    const labelBeforeCue = new RegExp(
      `(?:^|\\b)${escapedLabel}(?:\\b|$)${gap}\\b${cue}\\b${notNegatedAfterCue}`,
    );
    const cueBeforeLabel = new RegExp(
      `\\b${cue}\\b${notNegatedAfterCue}${gap}(?:^|\\b)${escapedLabel}(?:\\b|$)`,
    );
    if (labelBeforeCue.test(text) || cueBeforeLabel.test(text)) return index;
  }
  return -1;
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

const hasUniqueMaximum = (values: readonly number[]): boolean => {
  if (values.length === 0) return false;
  const maximum = Math.max(...values);
  return values.filter((value) => value === maximum).length === 1;
};

const setRankingMotionValue = (
  values: Record<string, string | number>,
  index: number,
  end: number,
): void => {
  const keyIndex = index + 1;
  values[`candidate${keyIndex}End`] = end;
  values[`candidate${keyIndex}Start`] = Math.max(
    10,
    end - 18 + index * 4,
  );
  values[`candidate${keyIndex}Middle`] = Math.max(
    10,
    end - 7 + (2 - index) * 3,
  );
};

const alignRankingWinner = (
  values: Record<string, string | number>,
  exactScores: readonly (number | null)[],
  winnerIndex: number,
): boolean => {
  const winnerScore = exactScores[winnerIndex];
  const knownOthers = exactScores
    .filter((score, index): score is number => index !== winnerIndex && score !== null);

  if (winnerScore !== null) {
    if (winnerScore <= 0 || knownOthers.some((score) => score >= winnerScore)) {
      return false;
    }
    exactScores.forEach((score, index) => {
      if (index === winnerIndex || score !== null) return;
      setRankingMotionValue(
        values,
        index,
        Math.max(0, winnerScore - 12 - index * 4),
      );
    });
    return true;
  }

  const maximumKnown = knownOthers.length > 0 ? Math.max(...knownOthers) : 0;
  if (maximumKnown >= 100) return false;
  const winnerEnd = Math.min(100, Math.max(84, maximumKnown + 4));
  setRankingMotionValue(values, winnerIndex, winnerEnd);
  exactScores.forEach((score, index) => {
    if (index === winnerIndex || score !== null) return;
    setRankingMotionValue(
      values,
      index,
      Math.max(0, winnerEnd - 12 - index * 4),
    );
  });
  return true;
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

  exactScores.forEach((score, index) => {
    const keyIndex = index + 1;
    values[`candidate${keyIndex}ScoreExact`] = score === null ? 0 : 1;
    if (score !== null) setRankingMotionValue(values, index, score);
  });

  const completeScores = exactScores.every(
    (score): score is number => score !== null,
  );
  const scoreWinnerGrounded =
    completeScores && hasUniqueMaximum(exactScores);
  const explicitWinner = winnerCueIndex(spokenText, labels);
  const explicitWinnerGrounded = explicitWinner >= 0
    ? alignRankingWinner(values, exactScores, explicitWinner)
    : false;

  values.rankingOutcomeGrounded = explicitWinner >= 0
    ? explicitWinnerGrounded ? 1 : 0
    : scoreWinnerGrounded ? 1 : 0;

  return {labels: content.labels, values};
};

const alignComparisonWinner = (
  values: Record<string, string | number>,
  exactScores: readonly (number | null)[],
  winnerIndex: number,
): boolean => {
  const winnerScore = exactScores[winnerIndex];
  const otherIndex = winnerIndex === 0 ? 1 : 0;
  const otherScore = exactScores[otherIndex];

  if (winnerScore !== null) {
    if (winnerScore <= 0 || (otherScore !== null && otherScore >= winnerScore)) {
      return false;
    }
    if (otherScore === null) {
      values[`competitor${otherIndex + 1}Final`] = Math.max(0, winnerScore - 12);
    }
    return true;
  }

  if (otherScore !== null && otherScore >= 100) return false;
  values[`competitor${winnerIndex + 1}Final`] = Math.min(
    100,
    Math.max(84, (otherScore ?? 0) + 4),
  );
  if (otherScore === null) {
    values[`competitor${otherIndex + 1}Final`] = 72;
  }
  return true;
};

const comparisonWinnerFromScores = (
  exactScores: readonly (number | null)[],
): number => {
  if (!exactScores.every((score): score is number => score !== null)) return -1;
  if (!hasUniqueMaximum(exactScores)) return -1;
  const maximum = Math.max(...exactScores);
  return exactScores.findIndex((score) => score === maximum);
};

const associateComparisonScores = (
  spokenText: string,
  content: AssociatablePrototypeRuntimeContent,
): AssociatablePrototypeRuntimeContent => {
  const values = {...content.values};
  const associatedLabels = {...content.labels};
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

  exactScores.forEach((score, index) => {
    const keyIndex = index + 1;
    values[`competitor${keyIndex}ScoreExact`] = score === null ? 0 : 1;
    if (score !== null) values[`competitor${keyIndex}Final`] = score;
  });

  const scoreWinner = comparisonWinnerFromScores(exactScores);
  const explicitWinner = winnerCueIndex(spokenText, labels);
  const explicitWinnerGrounded = explicitWinner >= 0
    ? alignComparisonWinner(values, exactScores, explicitWinner)
    : false;
  const groundedWinner = explicitWinner >= 0
    ? explicitWinnerGrounded ? explicitWinner : -1
    : scoreWinner;

  values.comparisonOutcomeGrounded = groundedWinner >= 0 ? 1 : 0;
  for (let index = 0; index < 2; index += 1) {
    const isWinner = index === groundedWinner;
    associatedLabels[`competitor${index + 1}Result`] = groundedWinner >= 0
      ? isWinner ? 'Gesamtsieger' : 'Vergleichsergebnis'
      : 'Vergleichsergebnis';
    associatedLabels[`competitor${index + 1}Detail`] = groundedWinner < 0
      ? 'kein eindeutiger Gesamtsieger belegt'
      : isWinner
        ? explicitWinner >= 0
          ? 'im Sprechertext als Sieger benannt'
          : 'höchster belegter Gesamtwert'
        : explicitWinner >= 0
          ? 'im Sprechertext nicht als Sieger benannt'
          : 'niedrigerer belegter Gesamtwert';
  }

  return {labels: associatedLabels, values};
};

const distributeProbabilityRemainder = (
  exactValues: readonly (number | null)[],
  fallbackValues: readonly number[],
): number[] | null => {
  const exactSum = exactValues.reduce<number>(
    (sum, value) => sum + (value ?? 0),
    0,
  );
  if (exactSum > 100) return null;
  const missing = exactValues
    .map((value, index) => (value === null ? index : -1))
    .filter((index) => index >= 0);
  if (missing.length === 0) {
    return Math.abs(exactSum - 100) < 0.001
      ? exactValues.map((value) => value ?? 0)
      : null;
  }

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

const exactScoresMajority = (
  exactValues: readonly (number | null)[],
): boolean => exactValues.some(
  (value) => value !== null && value > 50,
);

const alignProbabilityWinner = (
  exactValues: readonly (number | null)[],
  winnerIndex: number,
): number[] | null => {
  const exactSum = exactValues.reduce<number>(
    (sum, value) => sum + (value ?? 0),
    0,
  );
  if (exactSum > 100) return null;

  const result = exactValues.map((value) => value ?? 0);
  const winnerValue = exactValues[winnerIndex];
  const unknownOthers = exactValues
    .map((value, index) => index !== winnerIndex && value === null ? index : -1)
    .filter((index) => index >= 0);
  const knownOthers = exactValues
    .filter((value, index): value is number => index !== winnerIndex && value !== null);
  const maximumKnown = knownOthers.length > 0 ? Math.max(...knownOthers) : 0;

  if (winnerValue !== null) {
    if (winnerValue <= maximumKnown) return null;
    const remaining = 100 - exactSum;
    if (unknownOthers.length === 0) {
      return Math.abs(remaining) < 0.001 ? result : null;
    }
    if (remaining / unknownOthers.length >= winnerValue) return null;
    unknownOthers.forEach((index) => {
      result[index] = remaining / unknownOthers.length;
    });
    return result;
  }

  const remaining = 100 - exactSum;
  if (remaining <= maximumKnown) return null;
  if (unknownOthers.length === 0) {
    result[winnerIndex] = remaining;
    return result;
  }

  const minimumWinner = Math.max(
    maximumKnown + 1,
    remaining / (unknownOthers.length + 1) + 1,
  );
  const chosenWinner = Math.min(remaining, minimumWinner);
  if (chosenWinner <= maximumKnown) return null;
  result[winnerIndex] = chosenWinner;
  const leftover = remaining - chosenWinner;
  unknownOthers.forEach((index) => {
    result[index] = leftover / unknownOthers.length;
  });
  return hasUniqueMaximum(result) ? result : null;
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
  const explicitWinner = winnerCueIndex(spokenText, labels);

  for (let index = 0; index < 3; index += 1) {
    values[`candidate${index + 1}ProbabilityExact`] =
      exactValues[index] === null ? 0 : 1;
  }

  if (associatedCount === 0 && explicitWinner < 0) {
    values.probabilityOutcomeGrounded = 0;
    return {labels: content.labels, values};
  }

  const fallbackValues = [1, 2, 3].map((index) =>
    toNumber(values[`candidate${index}End`], 100 / 3),
  );
  const normalDistribution = distributeProbabilityRemainder(
    exactValues,
    fallbackValues,
  );
  const winnerDistribution = explicitWinner >= 0
    ? alignProbabilityWinner(exactValues, explicitWinner)
    : null;
  const distributed = explicitWinner >= 0
    ? winnerDistribution
    : normalDistribution;

  if (!distributed) {
    if (explicitWinner < 0) {
      for (let index = 0; index < 3; index += 1) {
        values[`candidate${index + 1}ProbabilityExact`] = 0;
      }
    } else {
      exactValues.forEach((value, index) => {
        if (value !== null) values[`candidate${index + 1}End`] = value;
      });
    }
    values.probabilityOutcomeGrounded = 0;
    return {labels: content.labels, values};
  }

  distributed.forEach((value, index) => {
    values[`candidate${index + 1}End`] = value;
  });
  const majorityGrounded = exactScoresMajority(exactValues);
  const enoughKnownValues =
    associatedCount >= 2 && normalDistribution !== null &&
    hasUniqueMaximum(normalDistribution);
  const explicitWinnerGrounded =
    explicitWinner >= 0 && winnerDistribution !== null;
  values.probabilityOutcomeGrounded = explicitWinner >= 0
    ? explicitWinnerGrounded ? 1 : 0
    : majorityGrounded || enoughKnownValues ? 1 : 0;
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

const costMeasurementEntries = (
  spokenText: string,
  unit: string,
): IndexedMeasurement[] => {
  const unitPattern = costUnitPattern(unit);
  if (!unitPattern) return [];
  const number = '(-?\\d+(?:[.,]\\d+)?)';
  const suffix = new RegExp(`${number}\\s*${unitPattern}`, 'gi');
  const prefix = new RegExp(`${unitPattern}\\s*${number}`, 'gi');
  const measurements: IndexedMeasurement[] = [];

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
    );
};

const resolveCostTransition = (
  spokenText: string,
  unit: string,
): {initial: number; optimized: number} | null => {
  const measurements = costMeasurementEntries(spokenText, unit);
  if (measurements.length < 2) return null;
  const first = measurements[0];
  const second = measurements[1];
  const beforeFirst = normalize(
    spokenText.slice(Math.max(0, first.index - 52), first.index),
  );
  const between = normalize(
    spokenText.slice(first.index, Math.min(spokenText.length, second.index + 8)),
  );
  const currentFirst =
    /\b(?:jetzt|nun|aktuell|heute|nur noch|nach der optimierung|nach optimierung|danach|anschliessend)\b/.test(beforeFirst);
  const secondMarkedOld =
    /\b(?:statt\s+)?(?:vorher|zuvor|fruher)\b/.test(between);
  const reverseTemporalOrder =
    /\bstatt\s+(?:vorher|zuvor|fruher)\b/.test(between) ||
    (currentFirst && secondMarkedOld);

  return reverseTemporalOrder
    ? {initial: second.value, optimized: first.value}
    : {initial: first.value, optimized: second.value};
};

const enforceCostReductionDirection = (
  spokenText: string,
  content: AssociatablePrototypeRuntimeContent,
): AssociatablePrototypeRuntimeContent => {
  const values = {...content.values};
  const unit = content.labels.currency;
  const transition = unit ? resolveCostTransition(spokenText, unit) : null;

  if (!transition) return content;
  const {initial, optimized} = transition;

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