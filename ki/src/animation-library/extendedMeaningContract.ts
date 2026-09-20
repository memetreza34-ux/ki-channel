import {
  analyzeSceneMeaning,
  normalizeMeaningText,
  type SceneCommunicationGoal,
  type SceneMeaningContract,
} from './meaningContract';

export type ExtendedMeaningRuleId =
  | 'ranking'
  | 'input-output'
  | 'error-detection'
  | 'model-processing'
  | 'relationship-network'
  | 'decision-logic'
  | 'cost-efficiency'
  | 'scale-performance'
  | 'time-change';

type ExtendedMeaningRule = {
  id: ExtendedMeaningRuleId;
  terms: string[];
  phrases: string[];
  communicationGoal: SceneCommunicationGoal;
  families: string[];
  patterns: string[];
  cues: string[];
  startState: string;
  visibleChange: string;
  endState: string;
};

const RULES: readonly ExtendedMeaningRule[] = [
  {
    id: 'ranking',
    terms: ['ranking', 'platz', 'reihenfolge', 'prioritat', 'score', 'beste', 'top'],
    phrases: ['top drei', 'auf platz', 'nach prioritat', 'beste option'],
    communicationGoal: 'rank',
    families: ['ranking', 'probability'],
    patterns: ['ordering', 'priority', 'candidate-selection'],
    cues: ['multiple-candidates', 'shared-score-scale', 'visible-reordering', 'final-order'],
    startState: 'multiple labeled candidates begin without a final order',
    visibleChange: 'their values are compared on one shared scale and the order changes visibly',
    endState: 'the final ranking remains readable with the winning criterion still visible',
  },
  {
    id: 'input-output',
    terms: ['eingabe', 'ausgabe', 'input', 'output', 'zusammenfass', 'verdicht', 'ergebnis'],
    phrases: ['viele zu einem', 'eingabe zu ausgabe', 'mehrere quellen', 'zu einem ergebnis'],
    communicationGoal: 'show-transformation',
    families: ['input-output', 'data-transformation'],
    patterns: ['many-to-one', 'input-to-output', 'visible-transformation'],
    cues: ['multiple-inputs', 'traceable-convergence', 'transformation-stage', 'single-result'],
    startState: 'several labeled inputs are separate and their contribution is still visible',
    visibleChange: 'the inputs converge through one traceable transformation without becoming decorative particles',
    endState: 'one readable result remains connected to the information that produced it',
  },
  {
    id: 'error-detection',
    terms: ['bug', 'debug', 'ursache', 'anomalie', 'scheitert', 'reparier', 'fehlerquelle'],
    phrases: ['fehler finden', 'ursache isolieren', 'wo es scheitert', 'root cause'],
    communicationGoal: 'reveal-cause',
    families: ['error-detection', 'risk-contrast'],
    patterns: ['root-cause', 'diagnosis', 'appearance-vs-reality'],
    cues: ['failing-path', 'diagnostic-trace', 'isolated-cause', 'repaired-state'],
    startState: 'a process appears complete but one visible path contains a failure',
    visibleChange: 'a diagnostic trace follows the failure backward until the actual cause is isolated',
    endState: 'the cause, its consequence, and the corrected path are visibly separated',
  },
  {
    id: 'model-processing',
    terms: ['schicht', 'layer', 'transformer', 'inference', 'expert', 'modellverarbeitung'],
    phrases: ['durch mehrere schichten', 'im modell', 'schrittweise verarbeitet', 'mixture of experts'],
    communicationGoal: 'explain-process',
    families: ['model-processing', 'process-flow'],
    patterns: ['layered-processing', 'iterative-refinement', 'process'],
    cues: ['traceable-input', 'ordered-layers', 'intermediate-state', 'processed-output'],
    startState: 'one labeled input waits before the first model layer',
    visibleChange: 'the same traceable object passes through ordered layers and changes at each relevant stage',
    endState: 'the processed output remains visibly connected to the layer sequence',
  },
  {
    id: 'relationship-network',
    terms: ['attention', 'beziehung', 'zusammenhang', 'abhang', 'gewicht', 'verbindung'],
    phrases: ['worter zusammengehoren', 'starke verbindung', 'gewichtete beziehung', 'mehr aufmerksamkeit'],
    communicationGoal: 'reveal-cause',
    families: ['relationship-network', 'semantic-space'],
    patterns: ['relationship-weighting', 'dependency', 'semantic-proximity'],
    cues: ['labeled-nodes', 'weighted-links', 'changing-influence', 'dominant-relationship'],
    startState: 'labeled elements are present but their influence on each other is not yet visible',
    visibleChange: 'connection strength changes and reveals which relationships influence the result most',
    endState: 'the dominant and weak relationships remain distinguishable without visual clutter',
  },
  {
    id: 'decision-logic',
    terms: ['entscheidung', 'entscheid', 'bedingung', 'regel', 'logik', 'auswahl', 'route'],
    phrases: ['wenn dann', 'welcher weg', 'entscheidung treffen', 'regel prufen'],
    communicationGoal: 'explain-process',
    families: ['decision-logic', 'process-flow'],
    patterns: ['branching-logic', 'rule-evaluation', 'process'],
    cues: ['visible-condition', 'branching-paths', 'evaluated-rule', 'chosen-route'],
    startState: 'one input reaches a visible decision point with multiple possible routes',
    visibleChange: 'the relevant condition is evaluated and invalid routes close while one route remains open',
    endState: 'the selected route and the rule that caused it remain visible together',
  },
  {
    id: 'cost-efficiency',
    terms: ['kosten', 'kost', 'preis', 'budget', 'spar', 'ressource', 'tokenkosten', 'effizienz'],
    phrases: ['geld sparen', 'kosten senken', 'weniger ressourcen', 'gunstiger werden', 'kostet nur noch'],
    communicationGoal: 'show-result',
    families: ['cost-efficiency', 'comparison'],
    patterns: ['cost-optimization', 'efficiency', 'tradeoff'],
    cues: ['cost-baseline', 'resource-use', 'visible-reduction', 'savings-result'],
    startState: 'the original cost and resource use are shown on a labeled baseline',
    visibleChange: 'one concrete change reduces resource use while the relevant tradeoff stays visible',
    endState: 'the saved amount and the remaining cost are readable on the same scale',
  },
  {
    id: 'scale-performance',
    terms: ['latenz', 'performance', 'throughput', 'last', 'skalier', 'kapazitat', 'engpass'],
    phrases: ['unter hoher last', 'mehr anfragen', 'latency steigt', 'zum engpass'],
    communicationGoal: 'show-limitation',
    families: ['scale-performance', 'risk-contrast'],
    patterns: ['performance', 'bottleneck', 'capacity-limit'],
    cues: ['load-level', 'request-flow', 'visible-bottleneck', 'latency-or-capacity-result'],
    startState: 'requests move through the system below its visible capacity limit',
    visibleChange: 'load increases until one component becomes a bottleneck and latency or throughput changes',
    endState: 'the limiting component and its measurable performance effect remain visible',
  },
  {
    id: 'time-change',
    terms: ['timeline', 'fruher', 'heute', 'entwicklung', 'version', 'verandert', 'zeitverlauf'],
    phrases: ['mit der zeit', 'von fruher bis heute', 'neue version', 'im zeitverlauf'],
    communicationGoal: 'show-change-over-time',
    families: ['time-change', 'learning-update'],
    patterns: ['change-over-time', 'evolution', 'versioned-learning'],
    cues: ['time-axis', 'old-state', 'change-event', 'current-state'],
    startState: 'the older state is fixed at a clearly labeled point in time',
    visibleChange: 'specific change events move the same subject along a readable time axis',
    endState: 'the current state and its difference from the earlier state remain visible',
  },
] as const;

const STRONG_SINGLE_TERMS = new Set([
  'ranking',
  'prioritat',
  'tokenkosten',
  'kost',
  'latenz',
  'throughput',
  'engpass',
  'transformer',
  'inference',
  'attention',
  'debug',
  'anomalie',
  'timeline',
  'zeitverlauf',
]);

const COST_REDUCTION_SIGNAL =
  /\b(?:spar\w*|senk\w*|weniger|gunstig\w*|reduzier\w*|verringer\w*|halbier\w*|einspar\w*|vermeid\w*|billig\w*|nur\s+noch)\b/;
const PERFORMANCE_IMPROVEMENT_SIGNAL =
  /\b(?:latenz\s+(?:sink\w*|fall\w*|reduzier\w*)|(?:sink\w*|fall\w*|reduzier\w*)\s+(?:die\s+)?latenz|schneller\w*|beschleunig\w*|throughput\s+steig\w*|durchsatz\s+steig\w*|mehr\s+(?:throughput|durchsatz))\b/;

const unique = (values: readonly string[]): string[] => [...new Set(values)];

const tokenMatches = (token: string, term: string): boolean => {
  const normalizedTerm = normalizeMeaningText(term);
  return token === normalizedTerm ||
    (normalizedTerm.length >= 4 && token.startsWith(normalizedTerm));
};

const passesActivationGuard = (
  rule: ExtendedMeaningRule,
  normalizedText: string,
): boolean =>
  rule.id !== 'cost-efficiency' || COST_REDUCTION_SIGNAL.test(normalizedText);

const scoreRule = (
  rule: ExtendedMeaningRule,
  normalizedText: string,
): {
  score: number;
  matchedTerms: string[];
  matchedTermCount: number;
  matchedPhraseCount: number;
  hasStrongSingleTerm: boolean;
} => {
  const tokens = normalizedText.split(' ').filter(Boolean);
  const matchedRuleTerms = rule.terms.filter((term) =>
    tokens.some((token) => tokenMatches(token, term)),
  );
  const matchedPhrases = rule.phrases.filter((phrase) =>
    normalizedText.includes(normalizeMeaningText(phrase)),
  );
  return {
    score: matchedRuleTerms.length * 7 + matchedPhrases.length * 16,
    matchedTerms: unique([...matchedRuleTerms, ...matchedPhrases]),
    matchedTermCount: matchedRuleTerms.length,
    matchedPhraseCount: matchedPhrases.length,
    hasStrongSingleTerm: matchedRuleTerms.some((term) =>
      STRONG_SINGLE_TERMS.has(normalizeMeaningText(term)),
    ),
  };
};

export const enhanceSceneMeaning = (
  spokenText: string,
  existing?: SceneMeaningContract,
): SceneMeaningContract => {
  const base = existing ?? analyzeSceneMeaning(spokenText);
  const normalizedText = normalizeMeaningText(spokenText);
  const matches = RULES
    .map((rule) => ({rule, ...scoreRule(rule, normalizedText)}))
    .filter((match) =>
      passesActivationGuard(match.rule, normalizedText) &&
      (
        match.matchedPhraseCount > 0 ||
        match.matchedTermCount >= 2 ||
        match.hasStrongSingleTerm
      ),
    )
    .sort((left, right) =>
      right.score - left.score || left.rule.id.localeCompare(right.rule.id),
    );
  const dominant = matches[0];
  if (!dominant) return base;

  const selected = matches.filter(
    (match) => match.score >= Math.max(7, dominant.score * 0.55),
  ).slice(0, 2);
  const matchedTerms = unique(selected.flatMap((match) => match.matchedTerms));
  const performanceImproves =
    dominant.rule.id === 'scale-performance' &&
    PERFORMANCE_IMPROVEMENT_SIGNAL.test(normalizedText);
  const selectedCues = selected.flatMap((match) =>
    performanceImproves && match.rule.id === 'scale-performance'
      ? [
          'baseline-performance',
          'optimization-change',
          'latency-or-throughput-improvement',
          'measured-or-relative-result',
        ]
      : match.rule.cues,
  );

  return {
    ...base,
    communicationGoal: performanceImproves
      ? 'show-result'
      : dominant.rule.communicationGoal,
    startState: performanceImproves
      ? 'the original path begins in its slower or more constrained performance state on a shared baseline'
      : dominant.rule.startState,
    visibleChange: performanceImproves
      ? 'the stated optimization changes the same path and visibly reduces latency or increases throughput'
      : dominant.rule.visibleChange,
    endState: performanceImproves
      ? 'the improved performance result remains visible on the same baseline without inventing an unspoken bottleneck'
      : dominant.rule.endState,
    subjectTerms: unique([...base.subjectTerms, ...matchedTerms]).slice(0, 10),
    actionTerms: unique([
      ...base.actionTerms,
      ...matchedTerms.filter((term) =>
        /entscheid|vergleich|verarbeit|skalier|spar|sortier|rank|debug|isolier|verdicht/.test(
          normalizeMeaningText(term),
        ),
      ),
    ]).slice(0, 8),
    resultTerms: unique([...matchedTerms, ...base.resultTerms]).slice(0, 8),
    preferredVisualFamilies: unique([
      ...selected.flatMap((match) => match.rule.families),
      ...base.preferredVisualFamilies,
    ]).slice(0, 5),
    preferredExplanationPatterns: unique([
      ...(performanceImproves ? ['performance-improvement'] : []),
      ...selected.flatMap((match) => match.rule.patterns),
      ...base.preferredExplanationPatterns,
    ]).slice(0, 8),
    requiredVisualCues: unique([
      ...selectedCues,
      ...base.requiredVisualCues,
    ]).slice(0, 12),
    forbiddenVisualCues: unique(base.forbiddenVisualCues),
  };
};

export const EXTENDED_MEANING_RULE_IDS: readonly ExtendedMeaningRuleId[] =
  RULES.map((rule) => rule.id);

/**
 * Löst den Meaning-Contract einer Szene auf, ohne einen redaktionell
 * geschriebenen Contract zu überschreiben.
 *
 * Phase 1 formuliert Meaning-Contracts von Hand. Fehlt einer oder entspricht
 * er exakt der automatischen Basisanalyse, wird er angereichert. Weicht er
 * davon ab, ist er eine bewusste redaktionelle Entscheidung und bleibt
 * unverändert — jede Planungsschicht muss dieselbe Regel anwenden, sonst
 * hebelt eine nachgelagerte Anreicherung die vorgelagerte Entscheidung aus.
 */
export const resolveAuthoredMeaningContract = (
  spokenText: string,
  supplied?: SceneMeaningContract,
): SceneMeaningContract => {
  if (!supplied) return enhanceSceneMeaning(spokenText);
  const automaticBase = analyzeSceneMeaning(spokenText);
  const suppliedLooksAutomatic =
    JSON.stringify(supplied) === JSON.stringify(automaticBase);
  return suppliedLooksAutomatic
    ? enhanceSceneMeaning(spokenText, supplied)
    : supplied;
};
