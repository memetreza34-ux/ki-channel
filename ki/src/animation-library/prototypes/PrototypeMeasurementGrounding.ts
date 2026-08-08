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

export const parseExplicitPercentages = (spokenText: string): number[] =>
  [...spokenText.matchAll(/\b(\d{1,3}(?:[.,]\d+)?)\s*(?:%|prozent)\b/gi)]
    .map((match) => parseNumber(match[1]))
    .filter((value): value is number =>
      value !== null && value >= 0 && value <= 100,
    );

export const parseExplicitPercentageNear = ({
  spokenText,
  terms,
  maximumGap = 28,
}: {
  spokenText: string;
  terms: readonly string[];
  maximumGap?: number;
}): number | null => {
  const normalizedText = normalize(spokenText);
  const normalizedTerms = terms
    .map(normalize)
    .filter(Boolean)
    .map(escapeRegex);
  if (normalizedTerms.length === 0) return null;

  const termPattern = `(?:${normalizedTerms.join('|')})`;
  const numberPattern = '(\\d{1,3}(?:[.,]\\d+)?)';
  const termBefore = new RegExp(
    `\\b${termPattern}\\b[^0-9,.!?;]{0,${maximumGap}}${numberPattern}\\s*(?:%|prozent)\\b`,
  );
  const numberBefore = new RegExp(
    `${numberPattern}\\s*(?:%|prozent)\\b[^,.!?;]{0,${maximumGap}}\\b${termPattern}\\b`,
  );
  const match = termBefore.exec(normalizedText) ?? numberBefore.exec(normalizedText);
  if (!match) return null;
  const parsed = parseNumber(match[1]);
  return parsed !== null && parsed >= 0 && parsed <= 100 ? parsed : null;
};

export const parseExplicitCountNear = ({
  spokenText,
  terms,
  minimum,
  maximum,
  maximumGap = 20,
}: {
  spokenText: string;
  terms: readonly string[];
  minimum: number;
  maximum: number;
  maximumGap?: number;
}): number | null => {
  const normalizedText = normalize(spokenText);
  const normalizedTerms = terms
    .map(normalize)
    .filter(Boolean)
    .map(escapeRegex);
  if (normalizedTerms.length === 0) return null;

  const termPattern = `(?:${normalizedTerms.join('|')})`;
  const countPattern = '(\\d{1,3})';
  const termBefore = new RegExp(
    `\\b${termPattern}\\b[^0-9,.!?;]{0,${maximumGap}}${countPattern}\\b`,
  );
  const countBefore = new RegExp(
    `\\b${countPattern}\\b[^,.!?;]{0,${maximumGap}}\\b${termPattern}\\b`,
  );
  const match = termBefore.exec(normalizedText) ?? countBefore.exec(normalizedText);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum
    ? parsed
    : null;
};

export const parseExplicitVectorTriplet = (
  spokenText: string,
): [number, number, number] | null => {
  const match = spokenText.match(
    /\[\s*(-?\d+(?:[.,]\d+)?)\s*[,;]\s*(-?\d+(?:[.,]\d+)?)\s*[,;]\s*(-?\d+(?:[.,]\d+)?)\s*\]/,
  );
  if (!match) return null;
  const values = match.slice(1, 4).map(parseNumber);
  if (values.some((value) => value === null)) return null;
  return values as [number, number, number];
};
