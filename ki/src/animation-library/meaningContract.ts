import type {AnimationLibraryEntry} from './schema';

export type SceneCommunicationGoal =
  | 'explain-process'
  | 'show-transformation'
  | 'reveal-cause'
  | 'compare'
  | 'rank'
  | 'warn-or-verify'
  | 'show-limitation'
  | 'show-change-over-time'
  | 'show-collaboration'
  | 'show-result';

export type SceneMeaningContract = {
  communicationGoal: SceneCommunicationGoal;
  startState: string;
  visibleChange: string;
  endState: string;
  subjectTerms: string[];
  actionTerms: string[];
  resultTerms: string[];
  preferredVisualFamilies: string[];
  preferredExplanationPatterns: string[];
  requiredVisualCues: string[];
  forbiddenVisualCues: string[];
};

export type MeaningCompatibilityResult = {
  score: number;
  familyFit: number;
  explanationFit: number;
  termCoverage: number;
  cueCoverage: number;
  avoidancePenalty: number;
  forbiddenCuePenalty: number;
  reasons: string[];
};

type MeaningRule = {
  id: string;
  terms: string[];
  phrases: string[];
  families: string[];
  patterns: string[];
  cues: string[];
  startState: string;
  visibleChange: string;
  endState: string;
};

const MEANING_RULES: readonly MeaningRule[] = [
  {
    id: 'tokenization',
    terms: ['token', 'tokens', 'zerleg', 'wortteil', 'textbaustein', 'split'],
    phrases: ['text wird zerlegt', 'in tokens', 'kleine textbausteine'],
    families: ['tokenization'],
    patterns: ['segmentation', 'part-to-whole'],
    cues: ['text-fragments', 'ordered-pieces', 'split-boundary'],
    startState: 'one continuous text object',
    visibleChange: 'the text separates into ordered meaningful units',
    endState: 'the units remain readable and ready for the next processing step',
  },
  {
    id: 'data-transformation',
    terms: ['vektor', 'zahl', 'zahlen', 'umwandel', 'konvertier', 'embedding'],
    phrases: ['wird zu zahlen', 'in einen vektor', 'text zu zahlen'],
    families: ['data-transformation', 'semantic-space'],
    patterns: ['visible-transformation', 'representation-change'],
    cues: ['source-object', 'conversion-stage', 'numeric-result'],
    startState: 'a human-readable source object',
    visibleChange: 'the source changes representation while its identity stays traceable',
    endState: 'a machine-readable result is visibly linked to the source',
  },
  {
    id: 'semantic-space',
    terms: ['bedeutung', 'ahnlich', 'naehe', 'cluster', 'embedding', 'begriff'],
    phrases: ['liegen naher', 'ahnliche begriffe', 'bedeutungsraum'],
    families: ['semantic-space', 'relationship-network'],
    patterns: ['semantic-proximity', 'clustering', 'relationship-weighting'],
    cues: ['labeled-points', 'distance-change', 'clusters'],
    startState: 'separate labeled concepts without visible relationships',
    visibleChange: 'distance and grouping reveal semantic similarity',
    endState: 'related concepts form a readable spatial structure',
  },
  {
    id: 'probability',
    terms: ['wahrscheinlich', 'wahrscheinlichkeit', 'kandidat', 'vorhersag', 'prozent'],
    phrases: ['nachstes wort', 'am wahrscheinlichsten', 'mehrere kandidaten'],
    families: ['probability', 'ranking', 'decision-logic'],
    patterns: ['candidate-selection', 'probability-shift', 'ordering'],
    cues: ['multiple-candidates', 'changing-confidence', 'selected-result'],
    startState: 'several plausible candidates compete',
    visibleChange: 'their confidence values change and one candidate becomes dominant',
    endState: 'the selected result is separated from the alternatives',
  },
  {
    id: 'generation',
    terms: ['antwort', 'generier', 'erzeug', 'output', 'wortweise', 'vervollstandig'],
    phrases: ['wort fur wort', 'antwort entsteht', 'text generieren'],
    families: ['generation', 'input-output'],
    patterns: ['sequential-generation', 'construction', 'input-to-output'],
    cues: ['growing-output', 'current-token', 'completed-result'],
    startState: 'an incomplete output waits for the next unit',
    visibleChange: 'new units are added in a clear sequence',
    endState: 'the completed output remains visible as the result',
  },
  {
    id: 'risk-verification',
    terms: ['falsch', 'halluzination', 'risiko', 'pruf', 'wahrheit', 'unsicher', 'fehler'],
    phrases: ['kann falsch sein', 'klingt richtig', 'quelle prufen', 'trotzdem prufen'],
    families: ['risk-contrast', 'error-detection'],
    patterns: ['appearance-vs-reality', 'verification', 'diagnosis'],
    cues: ['plausible-claim', 'warning-reveal', 'verification-path'],
    startState: 'a result appears convincing or complete',
    visibleChange: 'a check exposes uncertainty, error, or missing evidence',
    endState: 'verified and unverified parts are clearly separated',
  },
  {
    id: 'retrieval-search',
    terms: ['such', 'quelle', 'dokument', 'beleg', 'abruf', 'rag', 'wissen'],
    phrases: ['belege finden', 'quellen durchsuchen', 'passende dokumente'],
    families: ['retrieval-search', 'process-flow'],
    patterns: ['retrieval', 'relevance-filtering', 'process'],
    cues: ['query-object', 'search-space', 'relevant-evidence'],
    startState: 'a question has no supporting evidence attached',
    visibleChange: 'the search filters many sources down to relevant evidence',
    endState: 'the selected evidence reaches the answer context',
  },
  {
    id: 'context-window',
    terms: ['kontext', 'kontextfenster', 'vergess', 'limit', 'speicher', 'nachricht'],
    phrases: ['aus dem kontext', 'alte nachrichten', 'begrenzter speicher'],
    families: ['context-window', 'time-change'],
    patterns: ['bounded-memory', 'context-retention', 'change-over-time'],
    cues: ['bounded-window', 'incoming-message', 'evicted-content'],
    startState: 'messages occupy a limited visible context area',
    visibleChange: 'new content enters while older content is pushed outside the boundary',
    endState: 'the retained and forgotten information are visibly distinct',
  },
  {
    id: 'process-flow',
    terms: ['prozess', 'workflow', 'schritt', 'pipeline', 'ablauf', 'station', 'automation'],
    phrases: ['schritt fur schritt', 'mehrere stationen', 'automatischer ablauf'],
    families: ['process-flow', 'model-processing', 'tool-orchestration'],
    patterns: ['process', 'handoff', 'layered-processing'],
    cues: ['ordered-stages', 'traveling-object', 'handoff-state'],
    startState: 'an input waits before the first processing stage',
    visibleChange: 'one traceable object moves through ordered stages and changes state',
    endState: 'the final stage produces a visibly completed result',
  },
  {
    id: 'comparison',
    terms: ['vergleich', 'verglich', 'unterschied', 'besser', 'schlechter', 'versus', 'alternative'],
    phrases: ['im vergleich', 'a gegen b', 'zwei optionen'],
    families: ['comparison', 'ranking'],
    patterns: ['comparison', 'tradeoff', 'ordering'],
    cues: ['shared-baseline', 'two-options', 'decisive-difference'],
    startState: 'two options share the same neutral baseline',
    visibleChange: 'the relevant difference is revealed on the same scale',
    endState: 'the conclusion follows visibly from the compared evidence',
  },
  {
    id: 'security',
    terms: ['sicherheit', 'datenschutz', 'verschlussel', 'zugriff', 'berechtigung', 'privat'],
    phrases: ['daten verschlusseln', 'zugriff schutzen', 'private daten'],
    families: ['security-privacy', 'risk-contrast'],
    patterns: ['protection-layers', 'access-control', 'verification'],
    cues: ['protected-object', 'security-boundary', 'blocked-threat'],
    startState: 'sensitive information is exposed to a possible access path',
    visibleChange: 'protection layers close and reject unauthorized access',
    endState: 'the protected information remains inside a clear security boundary',
  },
  {
    id: 'learning-update',
    terms: ['lern', 'aktualisier', 'update', 'trainier', 'veralte', 'revision'],
    phrases: ['wissen aktualisieren', 'neue information', 'altes wissen'],
    families: ['learning-update', 'time-change'],
    patterns: ['knowledge-update', 'versioned-learning', 'change-over-time'],
    cues: ['old-state', 'incoming-knowledge', 'versioned-result'],
    startState: 'an older knowledge state is clearly identified',
    visibleChange: 'new information modifies or extends that state without hiding the change',
    endState: 'the updated version and its difference from the old version remain visible',
  },
  {
    id: 'human-ai-collaboration',
    terms: ['mensch', 'zusammenarbeit', 'feedback', 'copilot', 'team', 'ubergabe'],
    phrases: ['mensch und ki', 'human in the loop', 'gemeinsam arbeiten'],
    families: ['human-ai-collaboration', 'process-flow'],
    patterns: ['human-in-the-loop', 'division-of-labor', 'handoff'],
    cues: ['human-role', 'ai-role', 'feedback-loop'],
    startState: 'the human and AI roles are separate and incomplete',
    visibleChange: 'a task and feedback move between both roles',
    endState: 'the combined result shows what each side contributed',
  },
];

const STOP_WORDS = new Set([
  'aber', 'alle', 'also', 'auch', 'auf', 'aus', 'bei', 'das', 'dass', 'dein',
  'deine', 'dem', 'den', 'der', 'des', 'die', 'dies', 'diese', 'durch', 'ein',
  'eine', 'einer', 'eines', 'er', 'es', 'fur', 'hat', 'hier', 'ich', 'im', 'in',
  'ist', 'kann', 'mit', 'nicht', 'noch', 'oder', 'sein', 'sie', 'so', 'sondern',
  'und', 'vom', 'von', 'warum', 'was', 'wenn', 'wie', 'wird', 'zu', 'zum', 'zur',
]);

const ACTION_ROOTS = [
  'such', 'filter', 'zerleg', 'split', 'umwandel', 'konvertier', 'verbind',
  'vergleich', 'verglich', 'wahl', 'entscheid', 'generier', 'erzeug', 'pruf', 'vergess',
  'aktualisier', 'lern', 'schutz', 'verschlussel', 'skalier', 'verarbeit',
  'sortier', 'rank', 'beweg', 'wachst', 'sink', 'steig',
];

export const normalizeMeaningText = (value: string): string =>
  value
    .toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (value: string): string[] =>
  normalizeMeaningText(value).split(' ').filter(Boolean);

const rootMatches = (token: string, root: string): boolean =>
  token === root || (root.length >= 4 && token.startsWith(root));

const phraseMatches = (normalizedText: string, phrase: string): boolean =>
  normalizedText.includes(normalizeMeaningText(phrase));

const unique = (values: readonly string[]): string[] => [...new Set(values)];

const matchRule = (
  rule: MeaningRule,
  normalizedText: string,
  tokens: readonly string[],
): {score: number; matched: string[]} => {
  const matchedTerms = rule.terms.filter((term) =>
    tokens.some((token) => rootMatches(token, normalizeMeaningText(term))),
  );
  const matchedPhrases = rule.phrases.filter((phrase) =>
    phraseMatches(normalizedText, phrase),
  );
  return {
    score: matchedTerms.length * 7 + matchedPhrases.length * 14,
    matched: unique([...matchedTerms, ...matchedPhrases]),
  };
};

const determineGoal = (
  normalizedText: string,
  topRuleIds: readonly string[],
): SceneCommunicationGoal => {
  if (topRuleIds.includes('risk-verification') || /\b(pruf|falsch|risiko|fehler)/.test(normalizedText)) {
    return 'warn-or-verify';
  }
  if (topRuleIds.includes('comparison')) return 'compare';
  if (/\b(rank|ranking|top|platz|reihenfolge)/.test(normalizedText)) return 'rank';
  if (topRuleIds.includes('context-window')) return 'show-limitation';
  if (topRuleIds.includes('learning-update') || /\b(früher|heute|version|update)/.test(normalizedText)) {
    return 'show-change-over-time';
  }
  if (topRuleIds.includes('human-ai-collaboration')) return 'show-collaboration';
  if (/\b(weil|deshalb|dadurch|grund|verursach|fuhrt)/.test(normalizedText)) return 'reveal-cause';
  if (topRuleIds.some((id) => ['tokenization', 'data-transformation', 'generation'].includes(id))) {
    return 'show-transformation';
  }
  if (topRuleIds.some((id) => ['retrieval-search', 'process-flow'].includes(id))) {
    return 'explain-process';
  }
  return 'show-result';
};

const genericState = (importantTerms: readonly string[]): string =>
  importantTerms.length > 0
    ? `the initial state of ${importantTerms.slice(0, 3).join(', ')}`
    : 'a clearly labeled initial state';

export const analyzeSceneMeaning = (spokenText: string): SceneMeaningContract => {
  const normalizedText = normalizeMeaningText(spokenText);
  if (!normalizedText) throw new Error('scene meaning analysis requires spokenText');
  const tokens = tokenize(spokenText);
  const rankedRules = MEANING_RULES
    .map((rule) => ({rule, ...matchRule(rule, normalizedText, tokens)}))
    .filter((match) => match.score > 0)
    .sort((left, right) => right.score - left.score || left.rule.id.localeCompare(right.rule.id));

  const selected = rankedRules.slice(0, 3);
  const dominant = selected[0]?.rule;
  const actionTerms = unique(
    tokens.filter((token) => ACTION_ROOTS.some((root) => rootMatches(token, root))),
  ).slice(0, 6);
  const subjectTerms = unique(
    tokens.filter(
      (token) => token.length >= 4 && !STOP_WORDS.has(token) && !actionTerms.includes(token),
    ),
  ).slice(0, 8);
  const matchedTerms = unique(selected.flatMap((match) => match.matched)).slice(0, 8);
  const resultTerms = unique([...matchedTerms, ...subjectTerms.slice(-3)]).slice(0, 6);
  const preferredVisualFamilies = unique(selected.flatMap((match) => match.rule.families));
  const preferredExplanationPatterns = unique(selected.flatMap((match) => match.rule.patterns));
  const requiredVisualCues = unique(selected.flatMap((match) => match.rule.cues)).slice(0, 10);
  const communicationGoal = determineGoal(
    normalizedText,
    selected.map((match) => match.rule.id),
  );

  const forbiddenVisualCues = unique([
    ...(communicationGoal !== 'rank' ? ['podium-without-ranking-meaning'] : []),
    ...(communicationGoal !== 'compare' ? ['split-screen-without-comparison'] : []),
    ...(communicationGoal !== 'warn-or-verify' ? ['warning-symbol-without-risk'] : []),
    'decorative-motion-without-semantic-state-change',
    'generic-cards-that-only-repeat-the-caption',
  ]);

  return {
    communicationGoal,
    startState: dominant?.startState ?? genericState(subjectTerms),
    visibleChange:
      dominant?.visibleChange ??
      'one dominant action changes the labeled subject into the stated result',
    endState:
      dominant?.endState ??
      'the final frame makes the spoken conclusion visually unambiguous',
    subjectTerms: unique([...subjectTerms, ...matchedTerms]).slice(0, 10),
    actionTerms,
    resultTerms,
    preferredVisualFamilies:
      preferredVisualFamilies.length > 0 ? preferredVisualFamilies : ['input-output'],
    preferredExplanationPatterns:
      preferredExplanationPatterns.length > 0
        ? preferredExplanationPatterns
        : ['visible-transformation'],
    requiredVisualCues:
      requiredVisualCues.length > 0
        ? requiredVisualCues
        : ['labeled-source', 'visible-change', 'readable-result'],
    forbiddenVisualCues,
  };
};

const scoreCoverage = (
  requestedValues: readonly string[],
  candidateText: string,
): number => {
  if (requestedValues.length === 0) return 70;
  const normalizedCandidate = normalizeMeaningText(candidateText);
  const matched = requestedValues.filter((value) => {
    const normalizedValue = normalizeMeaningText(value);
    const terms = normalizedValue.split(' ').filter((term) => term.length >= 3);
    return terms.some((term) => normalizedCandidate.includes(term));
  }).length;
  return Math.min(100, (matched / requestedValues.length) * 100);
};

const GOAL_FAMILIES: Record<SceneCommunicationGoal, readonly string[]> = {
  'explain-process': ['process-flow', 'model-processing', 'retrieval-search', 'tool-orchestration'],
  'show-transformation': ['tokenization', 'data-transformation', 'generation', 'input-output'],
  'reveal-cause': ['relationship-network', 'process-flow', 'error-detection', 'decision-logic'],
  compare: ['comparison', 'ranking'],
  rank: ['ranking', 'probability'],
  'warn-or-verify': ['risk-contrast', 'error-detection', 'security-privacy'],
  'show-limitation': ['context-window', 'risk-contrast', 'scale-performance'],
  'show-change-over-time': ['time-change', 'learning-update'],
  'show-collaboration': ['human-ai-collaboration', 'process-flow'],
  'show-result': ['input-output', 'generation', 'decision-logic'],
};

const avoidWhenMatches = (
  avoidWhen: readonly string[],
  sceneText: string,
  contract: SceneMeaningContract,
): string[] => {
  const sceneCorpus = normalizeMeaningText(
    [
      sceneText,
      contract.communicationGoal,
      ...contract.subjectTerms,
      ...contract.actionTerms,
      ...contract.resultTerms,
      ...contract.requiredVisualCues,
    ].join(' '),
  );
  return avoidWhen.filter((rule) => {
    const terms = normalizeMeaningText(rule)
      .split(' ')
      .filter((term) => term.length >= 5 && !STOP_WORDS.has(term));
    if (terms.length === 0) return false;
    const overlap = terms.filter((term) => sceneCorpus.includes(term)).length;
    return overlap >= Math.min(2, terms.length);
  });
};

export const scoreMeaningCompatibility = ({
  spokenText,
  contract,
  entry,
}: {
  spokenText: string;
  contract: SceneMeaningContract;
  entry: AnimationLibraryEntry;
}): MeaningCompatibilityResult => {
  const candidateCorpus = [
    entry.title,
    entry.description,
    entry.visualFamily,
    entry.layoutFamily,
    entry.motionSignature,
    ...entry.semanticTags,
    ...entry.explanationPatterns,
    ...entry.primitiveTags,
  ].join(' ');

  const preferredFamilies = new Set(contract.preferredVisualFamilies.map(normalizeMeaningText));
  const goalFamilies = new Set(GOAL_FAMILIES[contract.communicationGoal].map(normalizeMeaningText));
  const normalizedFamily = normalizeMeaningText(entry.visualFamily);
  const familyFit = preferredFamilies.has(normalizedFamily)
    ? 100
    : goalFamilies.has(normalizedFamily)
      ? 78
      : 22;

  const explanationFit = scoreCoverage(
    contract.preferredExplanationPatterns,
    entry.explanationPatterns.join(' '),
  );
  const termCoverage = scoreCoverage(
    unique([
      ...contract.subjectTerms.slice(0, 5),
      ...contract.actionTerms,
      ...contract.resultTerms.slice(0, 3),
    ]),
    candidateCorpus,
  );
  const cueCoverage = scoreCoverage(contract.requiredVisualCues, candidateCorpus);
  const avoidMatches = avoidWhenMatches(entry.avoidWhen, spokenText, contract);
  const avoidancePenalty = Math.min(70, avoidMatches.length * 35);
  const forbiddenMatches = contract.forbiddenVisualCues.filter((cue) =>
    normalizeMeaningText(candidateCorpus).includes(normalizeMeaningText(cue)),
  );
  const forbiddenCuePenalty = Math.min(80, forbiddenMatches.length * 40);

  const raw =
    familyFit * 0.42 +
    explanationFit * 0.23 +
    termCoverage * 0.2 +
    cueCoverage * 0.15 -
    avoidancePenalty -
    forbiddenCuePenalty;
  const score = Math.max(0, Math.min(100, raw));
  const reasons = [
    `meaning family fit ${familyFit.toFixed(1)}`,
    `meaning explanation fit ${explanationFit.toFixed(1)}`,
    `spoken-term coverage ${termCoverage.toFixed(1)}`,
    `visual-cue coverage ${cueCoverage.toFixed(1)}`,
  ];
  if (avoidMatches.length > 0) {
    reasons.push(`avoidWhen matched: ${avoidMatches.join(' | ')}`);
  }
  if (forbiddenMatches.length > 0) {
    reasons.push(`forbidden visual cue matched: ${forbiddenMatches.join(' | ')}`);
  }

  return {
    score,
    familyFit,
    explanationFit,
    termCoverage,
    cueCoverage,
    avoidancePenalty,
    forbiddenCuePenalty,
    reasons,
  };
};

export const estimateSpokenDurationSeconds = (spokenText: string): number =>
  Math.max(1.5, tokenize(spokenText).length / 2.65);
