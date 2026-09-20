import type {SceneMeaningContract} from './meaningContract';

export type DerivedPrototypeRuntimeContent = {
  labels: Record<string, string>;
  values: Record<string, string | number>;
};

type DeriverInput = {
  animationId: string;
  spokenText: string;
  meaningContract: SceneMeaningContract;
};

type RuntimeDeriver = (
  input: Omit<DeriverInput, 'animationId'>,
) => DerivedPrototypeRuntimeContent;

const unique = (values: readonly string[]): string[] =>
  [...new Set(values.map((value) => value.trim()).filter(Boolean))];

const compact = (value: string, maximum = 54): string => {
  const normalized = value.trim().replace(/\s+/g, ' ');
  return normalized.length <= maximum
    ? normalized
    : `${normalized.slice(0, maximum - 1).trim()}…`;
};

const humanize = (value: string): string =>
  value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalize = (value: string): string =>
  value
    .toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss');

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const STOPWORDS = new Set([
  'aber', 'als', 'also', 'am', 'an', 'auch', 'auf', 'aus', 'bei', 'beim',
  'bis', 'das', 'dass', 'dem', 'den', 'der', 'des', 'die', 'dies', 'diese',
  'dieser', 'durch', 'ein', 'eine', 'einem', 'einen', 'einer', 'er', 'es',
  'für', 'im', 'in', 'ist', 'mit', 'nach', 'nur', 'oder', 'ohne', 'sich',
  'sie', 'sind', 'so', 'und', 'von', 'vor', 'während', 'weil', 'wenn', 'wie',
  'wird', 'werden', 'zu', 'zum', 'zur', 'the', 'a', 'and', 'from', 'into',
  'of', 'to', 'with',
  // Meta-Begriffe: benennen die Messgroesse oder das Konzept selbst und sind
  // deshalb nie eine konkrete Option. Ohne sie wird aus 'die Wahrscheinlichkeit
  // fuer Antwort A' ein Kandidat namens 'Wahrscheinlichkeit'.
  'kontext', 'kontextsignal', 'kontextsignale', 'kontextsignalen',
  'wahrscheinlichkeit', 'wahrscheinlichkeiten', 'prozent', 'vergleich',
  'wert', 'werte', 'werten',
]);

const contentWords = (spokenText: string): string[] =>
  unique(
    spokenText
      .replace(/[“”„"']/g, ' ')
      .split(/[^\p{L}\p{N}.-]+/u)
      .map((word) => word.trim())
      .filter((word) => {
        const normalized = normalize(word);
        return normalized.length >= 3 && !STOPWORDS.has(normalized) && !/^\d/.test(word);
      }),
  );

const sentenceClauses = (spokenText: string): string[] =>
  spokenText
    .split(/[,;:.!?]|\b(?:während|wobei|weil|bevor|danach|anschließend|aber|hingegen)\b/iu)
    .map((part) => compact(part, 48))
    .filter((part) => part.length >= 3);

const contractTerms = (contract: SceneMeaningContract): string[] =>
  unique([
    ...contract.subjectTerms,
    ...contract.actionTerms,
    ...contract.resultTerms,
  ].map(humanize));

const semanticPool = (
  spokenText: string,
  contract: SceneMeaningContract,
): string[] => unique([...contractTerms(contract), ...contentWords(spokenText)]);

const occurrenceCount = (spokenText: string, value: string): number => {
  const haystack = normalize(spokenText);
  const needle = normalize(value).trim();
  if (!needle) return 0;
  return haystack.split(needle).length - 1;
};

const isNegatedNear = (spokenText: string, term: string): boolean => {
  const text = normalize(spokenText);
  const needle = normalize(term);
  const index = text.indexOf(needle);
  if (index < 0) return false;
  const before = text.slice(Math.max(0, index - 28), index);
  const after = text.slice(index + needle.length, index + needle.length + 30);
  return /\b(nicht|kein|keine|keinen|ohne|falsch|unsicher|ungeeignet|irrelevant|verworfen|scheitert|fehlt)\b/.test(
    `${before} ${after}`,
  );
};

const germanBasic: Record<string, number> = {
  null: 0,
  ein: 1,
  eins: 1,
  eine: 1,
  einen: 1,
  zwei: 2,
  drei: 3,
  vier: 4,
  funf: 5,
  sechs: 6,
  sieben: 7,
  acht: 8,
  neun: 9,
  zehn: 10,
  elf: 11,
  zwolf: 12,
  dreizehn: 13,
  vierzehn: 14,
  funfzehn: 15,
  sechzehn: 16,
  siebzehn: 17,
  achtzehn: 18,
  neunzehn: 19,
  zwanzig: 20,
  dreissig: 30,
  vierzig: 40,
  funfzig: 50,
  sechzig: 60,
  siebzig: 70,
  achtzig: 80,
  neunzig: 90,
};

const parseGermanNumberWord = (rawWord: string): number | null => {
  const word = normalize(rawWord).replace(/[^a-z]/g, '');
  if (!word) return null;
  if (germanBasic[word] !== undefined) return germanBasic[word];

  const hundredIndex = word.indexOf('hundert');
  if (hundredIndex >= 0) {
    const prefix = word.slice(0, hundredIndex) || 'ein';
    const suffix = word.slice(hundredIndex + 'hundert'.length);
    const hundreds = germanBasic[prefix];
    if (hundreds === undefined || hundreds < 1 || hundreds > 9) return null;
    if (!suffix) return hundreds * 100;
    const rest = parseGermanNumberWord(suffix);
    return rest === null ? null : hundreds * 100 + rest;
  }

  const undIndex = word.indexOf('und');
  if (undIndex > 0) {
    const onesWord = word.slice(0, undIndex);
    const tensWord = word.slice(undIndex + 3);
    const ones = germanBasic[onesWord];
    const tens = germanBasic[tensWord];
    if (
      ones !== undefined &&
      ones >= 1 &&
      ones <= 9 &&
      tens !== undefined &&
      tens >= 20 &&
      tens % 10 === 0
    ) {
      return tens + ones;
    }
  }

  return null;
};

const extractNumbers = (spokenText: string): number[] => {
  const values: number[] = [];
  for (const match of spokenText.matchAll(/-?\d+(?:[.,]\d+)?/g)) {
    const parsed = Number(match[0].replace(',', '.'));
    if (Number.isFinite(parsed)) values.push(parsed);
  }
  for (const token of spokenText.split(/[^\p{L}]+/u)) {
    const parsed = parseGermanNumberWord(token);
    if (parsed !== null && !values.includes(parsed)) values.push(parsed);
  }
  return values;
};

const explicitYears = (spokenText: string): string[] =>
  unique([...spokenText.matchAll(/\b(?:19|20)\d{2}\b/g)].map((match) => match[0]));

const capitalizedEntities = (spokenText: string): string[] => {
  const tokens = spokenText.match(/\b[\p{Lu}][\p{L}\d-]*(?:\s+[A-ZÄÖÜ0-9])?\b/gu) ?? [];
  return unique(
    tokens.filter((token, index) => {
      const normalized = normalize(token);
      if (STOPWORDS.has(normalized)) return false;
      if (index === 0 && /^(die|der|das|ein|eine)$/i.test(token)) return false;
      return token.length >= 2;
    }),
  );
};

const stableUnit = (value: string): number => {
  let hash = 2166136261;
  for (const char of normalize(value)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 1001) / 1000;
};

const stableSignedVector = (value: string): string =>
  ((stableUnit(value) * 2 - 1) * 0.92).toFixed(2);

const pick = (
  values: readonly string[],
  index: number,
  fallback: string,
): string => compact(values[index] ?? fallback, 36);

// Kandidaten muessen disjunkt sein. Steht "antwort" neben "Antwort A", matchen
// beide dieselbe Zahl im Sprechertext, und die Anteile summieren sich auf ueber
// 100 Prozent. Der laengere, spezifischere Begriff gewinnt.
const withoutOverlaps = (values: readonly string[]): string[] => {
  const sorted = [...values].sort((left, right) => right.length - left.length);
  const kept: string[] = [];
  for (const value of sorted) {
    const normalized = normalize(value).trim();
    if (!normalized) continue;
    if (kept.some((other) => normalize(other).includes(normalized))) continue;
    kept.push(value);
  }
  return values.filter((value) => kept.includes(value));
};

const withoutMetaTerms = (values: readonly string[]): string[] =>
  values.filter((value) => {
    const normalized = normalize(value).trim();
    if (!normalized) return false;
    // Auch zusammengesetzte Formen wie "Kontextsignalen" aussortieren.
    return !normalized.split(/\s+/).every((part) => STOPWORDS.has(part));
  });

const labelRecord = (
  prefix: string,
  values: readonly string[],
  count: number,
  fallbacks: readonly string[],
): Record<string, string> =>
  Object.fromEntries(
    Array.from({length: count}, (_, index) => [
      `${prefix}${index + 1}`,
      pick(values, index, fallbacks[index] ?? `${prefix} ${index + 1}`),
    ]),
  );

const deriveRetrieval: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const pool = semanticPool(spokenText, meaningContract).slice(0, 6);
  const sources = pool.length >= 2 ? pool : ['Beleg', 'Quelle'];
  const labels: Record<string, string> = {
    query: compact(spokenText, 58),
    ...labelRecord('source', sources, 6, ['Beleg', 'Quelle', 'Dokument', 'Hinweis', 'Archiv', 'Kommentar']),
    resultLabel: compact(meaningContract.endState, 60),
  };
  const values: Record<string, string | number> = {};
  let relevantCount = 0;
  for (let index = 0; index < 6; index += 1) {
    const source = labels[`source${index + 1}`];
    const relevant =
      index < sources.length &&
      occurrenceCount(spokenText, source) > 0 &&
      !isNegatedNear(spokenText, source);
    values[`source${index + 1}Relevant`] = relevant ? 1 : 0;
    if (relevant) relevantCount += 1;
  }
  const numbers = extractNumbers(spokenText);
  const derivedEvidenceCount =
    numbers[0] ?? (relevantCount || Math.min(3, sources.length));
  values.evidenceCount = Math.max(1, Math.min(6, derivedEvidenceCount));
  return {labels, values};
};

const deriveCost: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const clauses = sentenceClauses(spokenText);
  const pool = unique([...clauses, ...semanticPool(spokenText, meaningContract)]);
  const numbers = extractNumbers(spokenText);
  const labels = {
    leak1: pick(pool, 0, 'Kostenfaktor 1'),
    leak2: pick(pool, 1, 'Kostenfaktor 2'),
    leak3: pick(pool, 2, 'Kostenfaktor 3'),
    meterLabel: pick(meaningContract.subjectTerms.map(humanize), 0, 'Kosten'),
    resultText: compact(meaningContract.endState, 66),
  };
  const values: Record<string, string | number> = {};
  if (numbers.length >= 2) {
    const initial = Math.max(numbers[0], numbers[1]);
    const optimized = Math.min(numbers[0], numbers[1]);
    values.initialCost = initial;
    values.optimizedCost = optimized;
    const delta = Math.max(0, initial - optimized);
    const weights = [labels.leak1, labels.leak2, labels.leak3].map(
      (label) => 1 + occurrenceCount(spokenText, label),
    );
    const weightSum = weights.reduce((sum, value) => sum + value, 0);
    weights.forEach((weight, index) => {
      values[`leak${index + 1}Amount`] = Math.round((delta * weight) / weightSum);
    });
  }
  return {labels, values};
};

const deriveContextWindow: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const pool = semanticPool(spokenText, meaningContract);
  const numbers = extractNumbers(spokenText);
  const labels = {
    ...labelRecord('message', pool, 6, ['Frage', 'Antwort', 'Regel', 'Beispiel', 'Neue Frage', 'Neue Antwort']),
    contextLabel: pick(meaningContract.subjectTerms.map(humanize), 0, 'Aktiver Kontext'),
    pinnedResult: compact(meaningContract.endState, 62),
  };
  const importantIndex = pool.findIndex((term) =>
    /wichtig|regel|priorit|behalt|pin|angeheft/i.test(term),
  );
  return {
    labels,
    values: {
      capacity: Math.max(2, Math.min(6, numbers[0] ?? Math.max(3, Math.min(5, pool.length)))),
      pinnedIndex: Math.max(0, Math.min(5, importantIndex >= 0 ? importantIndex : 0)),
    },
  };
};

const deriveDecisionTree: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const pool = semanticPool(spokenText, meaningContract);
  const branches = pool.slice(0, 5);
  const labels = {
    question: compact(spokenText, 54),
    ...labelRecord('branch', branches, 5, ['Bedingung 1', 'Bedingung 2', 'Bedingung 3', 'Bedingung 4', 'Bedingung 5']),
    selectedPath: compact(meaningContract.endState, 62),
  };
  const values: Record<string, string | number> = {};
  for (let index = 0; index < 5; index += 1) {
    const term = branches[index];
    values[`branch${index + 1}Valid`] =
      term && occurrenceCount(spokenText, term) > 0 && !isNegatedNear(spokenText, term)
        ? 1
        : 0;
  }
  if (!Object.values(values).some((value) => value === 1)) values.branch1Valid = 1;
  return {labels, values};
};

const deriveHumanAi: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const clauses = sentenceClauses(spokenText);
  return {
    labels: {
      ...labelRecord('stage', clauses, 4, ['Ziel', 'Entwurf', 'Prüfung', 'Ausführung']),
      taskLabel: pick(meaningContract.subjectTerms.map(humanize), 0, 'Aufgabe'),
      resultTitle: pick(meaningContract.resultTerms.map(humanize), 0, 'Ergebnis'),
      resultText: compact(meaningContract.endState, 78),
    },
    values: {},
  };
};

const deriveKnowledgeUpdate: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const pool = semanticPool(spokenText, meaningContract);
  const numbers = extractNumbers(spokenText);
  const normalized = normalize(spokenText);
  const explicitConfidence = numbers.find((number) => number >= 0 && number <= 100);
  const confidence = explicitConfidence ??
    (/nicht verifiziert|unverifiziert|unsicher|zweifel|unklar/.test(normalized)
      ? 45
      : /verifiziert|belegt|bestatigt|primarquelle/.test(normalized)
        ? 90
        : 70);
  return {
    labels: {
      oldState1: pick(pool, 0, 'Alter Stand'),
      oldState2: pick(pool, 1, 'Bisheriger Stand'),
      oldState3: pick(pool, 2, 'Unsicher'),
      newInformation: pick(pool, 3, meaningContract.resultTerms[0] ?? 'Neue Information'),
      sourceDetail: /quelle|beleg|studie|bericht|archiv/i.test(spokenText)
        ? compact(spokenText, 48)
        : 'Quelle im Sprechertext prüfen',
      conclusion: compact(meaningContract.endState, 72),
    },
    values: {
      confidence,
      verificationThreshold: 70,
      revisionStart: 1,
      revisionEnd: confidence >= 70 ? 2 : 1,
    },
  };
};

const deriveTokenization: RuntimeDeriver = ({meaningContract}) => ({
  labels: {
    lanePrimary: pick(meaningContract.subjectTerms.map(humanize), 0, 'Text'),
    laneMeaning: pick(meaningContract.resultTerms.map(humanize), 0, 'Bedeutung'),
    laneContext: pick(meaningContract.actionTerms.map(humanize), 0, 'Kontext'),
  },
  values: {},
});

const deriveVector: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const pool = semanticPool(spokenText, meaningContract);
  const input = pick(meaningContract.subjectTerms.map(humanize), 0, pool[0] ?? 'Input');
  const dimensions = unique([
    ...meaningContract.resultTerms.map(humanize),
    ...meaningContract.actionTerms.map(humanize),
    ...pool,
  ]).filter((term) => normalize(term) !== normalize(input));
  const labels = {
    input,
    dimension1: pick(dimensions, 0, 'Dimension 1'),
    dimension2: pick(dimensions, 1, 'Dimension 2'),
    dimension3: pick(dimensions, 2, 'Dimension 3'),
  };
  return {
    labels,
    values: {
      vector1: stableSignedVector(`${input}:${labels.dimension1}`),
      vector2: stableSignedVector(`${input}:${labels.dimension2}`),
      vector3: stableSignedVector(`${input}:${labels.dimension3}`),
    },
  };
};

const deriveRanking: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const entities = capitalizedEntities(spokenText);
  const pool = semanticPool(spokenText, meaningContract);
  const candidates = entities.length >= 2 ? entities : pool.slice(0, 3);
  const criteria = unique([
    ...meaningContract.subjectTerms.map(humanize),
    ...meaningContract.resultTerms.map(humanize),
  ]).filter((term) => !candidates.some((candidate) => normalize(candidate) === normalize(term)));
  const numbers = extractNumbers(spokenText).filter((number) => number >= 0 && number <= 100);
  const labels: Record<string, string> = {
    ...labelRecord('candidate', candidates, 3, ['Option A', 'Option B', 'Option C']),
    ...labelRecord('criterion', criteria, 3, ['Kriterium 1', 'Kriterium 2', 'Kriterium 3']),
    resultLabel: compact(meaningContract.endState, 60),
  };
  const values: Record<string, string | number> = {};
  for (let index = 0; index < 3; index += 1) {
    const candidate = labels[`candidate${index + 1}`];
    const final = numbers[index] ?? Math.round(58 + stableUnit(`${spokenText}:${candidate}`) * 38);
    values[`candidate${index + 1}Start`] = Math.max(10, final - 18 + index * 4);
    values[`candidate${index + 1}Middle`] = Math.max(10, final - 7 + (2 - index) * 3);
    values[`candidate${index + 1}End`] = final;
  }
  return {labels, values};
};

const deriveProcessFlow: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const stages = unique([
    ...meaningContract.actionTerms.map(humanize),
    ...sentenceClauses(spokenText),
    ...meaningContract.resultTerms.map(humanize),
  ]);
  const normalized = normalize(spokenText);
  return {
    labels: {
      ...labelRecord('station', stages, 5, ['Input', 'Prüfen', 'Planen', 'Ausführen', 'Ergebnis']),
      resultText: compact(meaningContract.endState, 74),
      alternativeText: /fehler|retry|zuruck|wiederhol|abzweig/.test(normalized)
        ? compact(spokenText, 60)
        : 'Keine Rückfallroute nötig',
    },
    values: {
      showAlternative: /fehler|retry|zuruck|wiederhol|abzweig/.test(normalized) ? 1 : 0,
    },
  };
};

const deriveFunnel: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const pool = semanticPool(spokenText, meaningContract).slice(0, 6);
  const labels = {
    ...labelRecord('input', pool, 6, ['Quelle 1', 'Quelle 2', 'Quelle 3', 'Quelle 4', 'Quelle 5', 'Quelle 6']),
    outputLabel: pick(meaningContract.resultTerms.map(humanize), 0, 'Ergebnis'),
    outputTitle: compact(meaningContract.endState, 58),
    outputDetail: compact(meaningContract.visibleChange, 68),
  };
  const values: Record<string, string | number> = {};
  for (let index = 0; index < 6; index += 1) {
    const term = pool[index];
    values[`input${index + 1}Keep`] =
      term && occurrenceCount(spokenText, term) > 0 && !isNegatedNear(spokenText, term)
        ? 1
        : 0;
  }
  return {labels, values};
};

const deriveError: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const stages = unique([...sentenceClauses(spokenText), ...semanticPool(spokenText, meaningContract)]);
  const normalizedText = normalize(spokenText);
  const errorIndex = stages.findIndex((stage) => {
    const stageNormalized = normalize(stage);
    return /fehler|bug|ursache|scheit|problem|anomal/.test(stageNormalized) ||
      (normalizedText.includes(stageNormalized) && isNegatedNear(spokenText, stage));
  });
  return {
    labels: {
      ...labelRecord('step', stages, 4, ['Input', 'Prüfung', 'Verarbeitung', 'Output']),
      isolatedText: compact(meaningContract.visibleChange, 72),
      repairedText: compact(meaningContract.endState, 72),
    },
    values: {errorStep: Math.max(0, Math.min(3, errorIndex >= 0 ? errorIndex : 1))},
  };
};

const deriveSemanticSpace: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const entities = capitalizedEntities(spokenText);
  const pool = unique([...entities, ...semanticPool(spokenText, meaningContract)]).slice(0, 6);
  const contrastIndex = normalize(spokenText).indexOf(' als ');
  const labels: Record<string, string> = {
    ...labelRecord('concept', pool, 6, ['Begriff 1', 'Begriff 2', 'Begriff 3', 'Begriff 4', 'Begriff 5', 'Begriff 6']),
    cluster1: pick(meaningContract.subjectTerms.map(humanize), 0, 'Cluster 1'),
    cluster2: pick(meaningContract.resultTerms.map(humanize), 0, 'Cluster 2'),
  };
  const values: Record<string, string | number> = {};
  for (let index = 0; index < 6; index += 1) {
    const concept = labels[`concept${index + 1}`];
    const location = normalize(spokenText).indexOf(normalize(concept));
    values[`concept${index + 1}Cluster`] =
      contrastIndex >= 0 && location >= 0
        ? location < contrastIndex
          ? 1
          : 2
        : index < Math.ceil(pool.length / 2)
          ? 1
          : 2;
  }
  return {labels, values};
};

const deriveRelationship: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const pool = semanticPool(spokenText, meaningContract);
  const numbers = extractNumbers(spokenText).filter((number) => number >= 0 && number <= 100);
  const normalized = normalize(spokenText);
  const strong = /stark|hohe|hoch|dominant|wichtig/.test(normalized);
  const weak = /schwach|niedrig|gering|verworfen/.test(normalized);
  return {
    labels: {
      ...labelRecord('node', pool, 3, ['Knoten A', 'Knoten B', 'Knoten C']),
      strongRelationship: compact(meaningContract.visibleChange, 58),
      weakRelationship: weak ? 'schwache Verbindung' : 'geringere Verbindung',
      conclusion: compact(meaningContract.endState, 68),
    },
    values: {
      weight12: numbers[0] !== undefined ? numbers[0] / 100 : strong ? 0.86 : 0.68,
      weight23: numbers[1] !== undefined ? numbers[1] / 100 : strong ? 0.72 : 0.58,
      weakWeight: numbers[2] !== undefined ? numbers[2] / 100 : weak ? 0.18 : 0.32,
    },
  };
};

const deriveProbability: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const entities = capitalizedEntities(spokenText);
  const pool = semanticPool(spokenText, meaningContract);
  const candidates = withoutOverlaps(withoutMetaTerms(unique([...entities, ...meaningContract.resultTerms.map(humanize), ...pool]))).slice(0, 3);
  const signals = unique([...meaningContract.subjectTerms.map(humanize), ...meaningContract.actionTerms.map(humanize)]);
  const numbers = extractNumbers(spokenText).filter((number) => number >= 0 && number <= 100);
  const primaryEnd = Math.max(1, Math.min(98, numbers[0] ?? 60));
  const remaining = 100 - primaryEnd;
  const secondEnd = Math.max(1, Math.round(remaining * 0.65));
  const thirdEnd = Math.max(1, 100 - primaryEnd - secondEnd);
  const ends = [primaryEnd, secondEnd, thirdEnd];
  const labels = {
    ...labelRecord('candidate', candidates, 3, ['Kandidat A', 'Kandidat B', 'Kandidat C']),
    ...labelRecord('signal', signals, 3, ['Signal 1', 'Signal 2', 'Kontext']),
  };
  const values: Record<string, string | number> = {};
  ends.forEach((end, index) => {
    values[`candidate${index + 1}Start`] = Math.max(1, Math.round((100 / 3) + (index - 1) * 5));
    values[`candidate${index + 1}End`] = end;
  });
  return {labels, values};
};

const deriveModelProcessing: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const pool = semanticPool(spokenText, meaningContract);
  return {
    labels: {
      inputLabel: pick(meaningContract.subjectTerms.map(humanize), 0, 'Input'),
      inputValue: compact(meaningContract.startState, 48),
      ...labelRecord('layer', pool, 3, ['Schicht 1', 'Schicht 2', 'Schicht 3']),
      outputLabel: pick(meaningContract.resultTerms.map(humanize), 0, 'Output'),
      outputValue: compact(meaningContract.endState, 48),
    },
    values: {},
  };
};

const deriveGeneration: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const pool = semanticPool(spokenText, meaningContract);
  const clauses = sentenceClauses(spokenText);
  return {
    labels: {
      ...labelRecord('thread', pool, 4, ['Kontext', 'Thema', 'Grammatik', 'Ton']),
      answer: compact(clauses[clauses.length - 1] ?? meaningContract.endState, 74),
    },
    values: {},
  };
};

const deriveRisk: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const normalized = normalize(spokenText);
  const numbers = extractNumbers(spokenText).filter((number) => number >= 0 && number <= 100);
  const confidence = numbers[0] ??
    (/sehr sicher|definitiv|hundertprozent|100 prozent/.test(normalized)
      ? 96
      : /unsicher|zweifel|unklar/.test(normalized)
        ? 42
        : 78);
  const checks = unique([
    ...meaningContract.requiredVisualCues.map(humanize),
    ...meaningContract.subjectTerms.map(humanize),
  ]);
  return {
    labels: {
      claim: compact(spokenText, 66),
      ...labelRecord('check', checks, 3, ['Quelle?', 'Datum?', 'Beleg?']),
      warningText: compact(meaningContract.endState, 76),
    },
    values: {confidence},
  };
};

const deriveSecurity: RuntimeDeriver = ({meaningContract}) => {
  const layers = unique([
    ...meaningContract.actionTerms.map(humanize),
    ...meaningContract.requiredVisualCues.map(humanize),
  ]);
  return {
    labels: {
      dataLabel: pick(meaningContract.subjectTerms.map(humanize), 0, 'Daten'),
      ...labelRecord('securityLayer', layers, 3, ['Transport', 'Verschlüsselung', 'Berechtigung']),
      resultLabel: pick(meaningContract.resultTerms.map(humanize), 0, 'Geschützt'),
      resultText: compact(meaningContract.endState, 72),
    },
    values: {},
  };
};

const deriveLatency: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const clauses = sentenceClauses(spokenText);
  const numbers = extractNumbers(spokenText).filter((number) => number >= 0);
  const slowLatency = numbers.length >= 2 ? Math.max(numbers[0], numbers[1]) : numbers[0];
  const fastLatency = numbers.length >= 2 ? Math.min(numbers[0], numbers[1]) : undefined;
  const labels = {
    slowPath: compact(clauses[0] ?? pick(meaningContract.subjectTerms.map(humanize), 0, 'Langsamer Pfad'), 34),
    fastPath: compact(clauses[1] ?? pick(meaningContract.resultTerms.map(humanize), 0, 'Schneller Pfad'), 34),
    bottleneckLabel: pick(meaningContract.subjectTerms.map(humanize), 1, 'Engpass'),
    optimizedLabel: compact(meaningContract.endState, 42),
  };
  const values: Record<string, string | number> = {};
  if (slowLatency !== undefined) values.slowLatency = slowLatency;
  if (fastLatency !== undefined) values.fastLatency = fastLatency;
  return {labels, values};
};

const deriveTimeline: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const years = explicitYears(spokenText);
  const versionMatches = spokenText.match(/\b(?:v(?:ersion)?\s*)?\d+(?:\.\d+)?\b/gi) ?? [];
  const milestones = unique([...years, ...versionMatches, ...capitalizedEntities(spokenText)]);
  const changes = unique([...meaningContract.actionTerms.map(humanize), ...meaningContract.resultTerms.map(humanize), ...sentenceClauses(spokenText)]);
  return {
    labels: {
      ...labelRecord('milestone', milestones, 5, ['Früher', 'Zwischenstand', 'Update', 'Neu', 'Heute']),
      ...labelRecord('change', changes, 3, ['Änderung 1', 'Änderung 2', 'Änderung 3']),
    },
    values: {},
  };
};

const deriveComparison: RuntimeDeriver = ({spokenText, meaningContract}) => {
  const entities = capitalizedEntities(spokenText);
  const pool = semanticPool(spokenText, meaningContract);
  const competitors = entities.length >= 2 ? entities : pool.slice(0, 2);
  const metrics = unique([
    ...meaningContract.subjectTerms.map(humanize),
    ...meaningContract.resultTerms.map(humanize),
    ...pool,
  ]).filter((term) => !competitors.some((competitor) => normalize(competitor) === normalize(term)));
  const numbers = extractNumbers(spokenText).filter((number) => number >= 0 && number <= 100);
  const competitor1 = pick(competitors, 0, 'Option A');
  const competitor2 = pick(competitors, 1, 'Option B');
  const normalized = normalize(spokenText);
  const firstPattern = new RegExp(`${escapeRegex(normalize(competitor1))}.*(?:gewinnt|besser|schneller|starker)`);
  const secondPattern = new RegExp(`${escapeRegex(normalize(competitor2))}.*(?:gewinnt|besser|schneller|starker)`);
  const firstWins = firstPattern.test(normalized);
  const secondWins = secondPattern.test(normalized);
  const firstFinal = numbers[0] ?? (firstWins ? 100 : secondWins ? 88 : 96);
  const secondFinal = numbers[1] ?? (secondWins ? 100 : firstWins ? 88 : 92);
  return {
    labels: {
      competitor1,
      competitor2,
      ...labelRecord('metric', metrics, 3, ['Kriterium 1', 'Kriterium 2', 'Kriterium 3']),
      competitor1Result: firstWins ? 'führt insgesamt' : 'Ergebnis A',
      competitor2Result: secondWins ? 'führt insgesamt' : 'Ergebnis B',
    },
    values: {
      competitor1Final: firstFinal,
      competitor2Final: secondFinal,
    },
  };
};

const DERIVERS: Readonly<Record<string, RuntimeDeriver>> = {
  'retrieval-search-knowledge-magnet-v1': deriveRetrieval,
  'cost-efficiency-budget-leak-meter-v1': deriveCost,
  'context-window-context-window-train-v1': deriveContextWindow,
  'decision-logic-decision-tree-burst-v1': deriveDecisionTree,
  'human-ai-collaboration-human-ai-relay-v1': deriveHumanAi,
  'learning-update-knowledge-tree-graft-v1': deriveKnowledgeUpdate,
  'tokenization-magnetic-phrase-slicer-v1': deriveTokenization,
  'data-transformation-vector-prism-converter-v1': deriveVector,
  'ranking-dynamic-podium-rise-v1': deriveRanking,
  'process-flow-subway-workflow-map-v1': deriveProcessFlow,
  'input-output-funnel-compression-output-v1': deriveFunnel,
  'error-detection-anomaly-xray-scanner-v1': deriveError,
  'semantic-space-meaning-terrain-v1': deriveSemanticSpace,
  'relationship-network-dependency-bridge-builder-v1': deriveRelationship,
  'probability-probability-fluid-columns-v1': deriveProbability,
  'model-processing-residual-river-v1': deriveModelProcessing,
  'generation-answer-loom-v1': deriveGeneration,
  'risk-contrast-confidence-glass-crack-v1': deriveRisk,
  'security-privacy-encryption-vault-layers-v1': deriveSecurity,
  'scale-performance-latency-tunnel-race-v1': deriveLatency,
  'time-change-timeline-microscope-v1': deriveTimeline,
  'comparison-benchmark-racetrack-v1': deriveComparison,
};

export const PROTOTYPE_RUNTIME_CONTENT_DERIVER_IDS = Object.freeze(
  Object.keys(DERIVERS).sort(),
);

export const derivePrototypeRuntimeContent = ({
  animationId,
  spokenText,
  meaningContract,
}: DeriverInput): DerivedPrototypeRuntimeContent => {
  const deriver = DERIVERS[animationId];
  if (!deriver) return {labels: {}, values: {}};
  return deriver({spokenText, meaningContract});
};
