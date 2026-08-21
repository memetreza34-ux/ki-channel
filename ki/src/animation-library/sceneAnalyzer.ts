import type {AnimationLibraryEntry} from './schema';
import type {ReelSceneBrief} from './planner';
import {
  analyzeSceneMeaning,
  estimateSpokenDurationSeconds,
  type SceneMeaningContract,
} from './meaningContract';

export type AnimationFamilyName =
  | 'tokenization'
  | 'data-transformation'
  | 'semantic-space'
  | 'relationship-network'
  | 'probability'
  | 'model-processing'
  | 'generation'
  | 'risk-contrast'
  | 'comparison'
  | 'ranking'
  | 'input-output'
  | 'process-flow'
  | 'error-detection'
  | 'retrieval-search'
  | 'security-privacy'
  | 'scale-performance'
  | 'cost-efficiency'
  | 'time-change'
  | 'human-ai-collaboration'
  | 'decision-logic'
  | 'context-window'
  | 'learning-update';

export type AnimationFamilyScore = {
  visualFamily: AnimationFamilyName;
  score: number;
  lexicalScore: number;
  matchedTerms: string[];
  matchedPhrases: string[];
  explanationPatterns: string[];
};

export type SceneAnimationAnalysis = {
  sceneId: string;
  spokenText: string;
  normalizedText: string;
  semanticTags: string[];
  meaningContract: SceneMeaningContract;
  familyScores: AnimationFamilyScore[];
  preferredVisualFamilies: AnimationFamilyName[];
  forbiddenVisualFamilies: AnimationFamilyName[];
  preferredEnergy: AnimationLibraryEntry['energy'];
  maximumComplexity: AnimationLibraryEntry['complexity'];
  mustBeNew: boolean;
  brief: ReelSceneBrief;
};

type FamilyRule = {
  family: AnimationFamilyName;
  terms: Record<string, number>;
  phrases: Record<string, number>;
  patterns: string[];
  defaultEnergy: AnimationLibraryEntry['energy'];
};

const FAMILY_RULES: readonly FamilyRule[] = [
  {family: 'tokenization', terms: {token: 8, tokens: 8, wortteil: 7, textbaustein: 7, zerlegen: 5, splitten: 5}, phrases: {'in tokens': 12, 'text wird zerlegt': 11, 'kleine textbausteine': 12}, patterns: ['segmentation', 'part-to-whole'], defaultEnergy: 'dynamic'},
  {family: 'data-transformation', terms: {zahl: 6, zahlen: 7, zahlenvektor: 14, vektor: 9, umwandeln: 6, umgewandelt: 8, übersetzen: 5, konvertieren: 7, datenformat: 7}, phrases: {'wird zu zahlen': 13, 'in einen vektor': 13, 'format umwandeln': 11}, patterns: ['visible-transformation', 'representation-change'], defaultEnergy: 'dynamic'},
  {family: 'semantic-space', terms: {bedeutung: 8, ähnlich: 6, nähe: 6, embedding: 10, begriff: 4, cluster: 8}, phrases: {'bedeutungsraum': 14, 'liegen näher': 11, 'ähnliche begriffe': 12}, patterns: ['semantic-proximity', 'clustering'], defaultEnergy: 'calm'},
  {family: 'relationship-network', terms: {attention: 12, beziehung: 8, verbinden: 6, zusammenhang: 7, abhängig: 7, netzwerk: 6}, phrases: {'wörter zusammengehören': 13, 'starke verbindung': 11, 'gewichtete beziehung': 13}, patterns: ['relationship-weighting', 'dependency'], defaultEnergy: 'dynamic'},
  {family: 'probability', terms: {wahrscheinlichkeit: 12, wahrscheinlich: 10, kandidat: 7, prozent: 5, vorhersagen: 7, nächstes: 4}, phrases: {'nächstes wort': 13, 'am wahrscheinlichsten': 14, 'mehrere kandidaten': 10}, patterns: ['candidate-selection', 'probability-shift'], defaultEnergy: 'dynamic'},
  {family: 'model-processing', terms: {modell: 5, layer: 9, schicht: 8, transformer: 11, verarbeiten: 6, inference: 9, expert: 7}, phrases: {'durch mehrere schichten': 13, 'im modell': 8, 'schrittweise verarbeiten': 11}, patterns: ['layered-processing', 'iterative-refinement'], defaultEnergy: 'measured'},
  {family: 'generation', terms: {antwort: 7, generieren: 9, erzeugen: 7, output: 6, wortweise: 9, vervollständigen: 8}, phrases: {'wort für wort': 14, 'antwort entsteht': 12, 'text generieren': 11}, patterns: ['sequential-generation', 'construction'], defaultEnergy: 'measured'},
  {family: 'risk-contrast', terms: {falsch: 10, halluzination: 13, risiko: 9, prüfen: 6, wahrheit: 9, überzeugend: 5, unsicher: 7}, phrases: {'kann falsch sein': 14, 'klingt richtig': 11, 'quelle prüfen': 12}, patterns: ['appearance-vs-reality', 'verification'], defaultEnergy: 'impact'},
  {family: 'comparison', terms: {vergleich: 9, verglichen: 12, versus: 10, besser: 6, schlechter: 6, unterschied: 8, schneller: 5, alternative: 5}, phrases: {'im vergleich': 11, 'a gegen b': 12, 'zwei optionen': 10}, patterns: ['comparison', 'tradeoff'], defaultEnergy: 'dynamic'},
  {family: 'ranking', terms: {ranking: 12, top: 6, reihenfolge: 9, platz: 6, score: 8, priorität: 8, beste: 6}, phrases: {'top drei': 12, 'auf platz': 10, 'nach priorität': 11}, patterns: ['ordering', 'priority'], defaultEnergy: 'impact'},
  {family: 'input-output', terms: {input: 8, output: 8, eingabe: 7, ergebnis: 5, verdichten: 7, zusammenfassen: 8, quellen: 5}, phrases: {'viele zu einem': 12, 'eingabe zu ausgabe': 13, 'zu einem ergebnis': 10}, patterns: ['many-to-one', 'input-to-output'], defaultEnergy: 'dynamic'},
  {family: 'process-flow', terms: {prozess: 9, workflow: 11, schritt: 6, station: 7, ablauf: 8, pipeline: 9, automation: 7}, phrases: {'schritt für schritt': 12, 'mehrere stationen': 11, 'automatischer ablauf': 12}, patterns: ['process', 'handoff'], defaultEnergy: 'dynamic'},
  {family: 'error-detection', terms: {fehler: 11, bug: 10, debug: 10, ursache: 7, anomalie: 10, reparieren: 7, scheitert: 7}, phrases: {'fehler finden': 12, 'ursache isolieren': 13, 'wo es scheitert': 11}, patterns: ['root-cause', 'diagnosis'], defaultEnergy: 'impact'},
  {family: 'retrieval-search', terms: {suche: 9, suchen: 8, dokument: 7, quelle: 7, rag: 12, abrufen: 8, belege: 9, wissen: 5}, phrases: {'passende dokumente': 12, 'quellen durchsuchen': 12, 'belege finden': 13}, patterns: ['retrieval', 'relevance-filtering'], defaultEnergy: 'dynamic'},
  {family: 'security-privacy', terms: {sicherheit: 9, datenschutz: 11, verschlüsseln: 11, encryption: 11, berechtigung: 9, zugriff: 7, privat: 7, sensible: 6}, phrases: {'private daten': 12, 'zugriff schützen': 12, 'daten verschlüsseln': 14}, patterns: ['protection-layers', 'access-control'], defaultEnergy: 'impact'},
  {family: 'scale-performance', terms: {performance: 10, latenz: 11, skalieren: 10, throughput: 10, last: 6, geschwindigkeit: 7, kapazität: 8}, phrases: {'schneller werden': 11, 'unter hoher last': 12, 'mehr anfragen': 10}, patterns: ['performance', 'bottleneck'], defaultEnergy: 'impact'},
  {family: 'cost-efficiency', terms: {kosten: 10, preis: 8, budget: 9, sparen: 8, effizient: 7, tokenkosten: 11, ressourcen: 6}, phrases: {'geld sparen': 12, 'kosten senken': 13, 'weniger ressourcen': 10}, patterns: ['cost-optimization', 'efficiency'], defaultEnergy: 'measured'},
  {family: 'time-change', terms: {zeit: 5, timeline: 10, version: 8, entwicklung: 8, früher: 6, heute: 6, update: 6, verändert: 6}, phrases: {'mit der zeit': 11, 'von früher bis heute': 13, 'neue version': 10}, patterns: ['change-over-time', 'evolution'], defaultEnergy: 'measured'},
  {family: 'human-ai-collaboration', terms: {mensch: 7, zusammenarbeit: 10, team: 7, feedback: 7, copilot: 10, agent: 6, übergeben: 6}, phrases: {'mensch und ki': 14, 'human in the loop': 14, 'gemeinsam arbeiten': 12}, patterns: ['human-in-the-loop', 'division-of-labor'], defaultEnergy: 'dynamic'},
  {family: 'decision-logic', terms: {entscheidung: 10, entscheiden: 8, wenn: 4, regel: 7, bedingung: 9, logik: 9, auswahl: 6}, phrases: {'wenn dann': 13, 'welcher weg': 10, 'entscheidung treffen': 12}, patterns: ['branching-logic', 'rule-evaluation'], defaultEnergy: 'dynamic'},
  {family: 'context-window', terms: {kontextfenster: 14, kontext: 7, erinnerung: 7, speicher: 6, prompt: 5, limit: 7, vergessen: 8, nachricht: 5}, phrases: {'aus dem kontext': 12, 'alte nachrichten': 11, 'begrenzter speicher': 12}, patterns: ['bounded-memory', 'context-retention'], defaultEnergy: 'measured'},
  {family: 'learning-update', terms: {lernen: 8, wissen: 5, aktualisieren: 9, update: 7, neu: 3, veralten: 8, revision: 7, trainieren: 8}, phrases: {'neue information': 11, 'wissen aktualisieren': 13, 'altes wissen': 10}, patterns: ['knowledge-update', 'versioned-learning'], defaultEnergy: 'calm'},
] as const;

const normalize = (value: string): string =>
  value
    .toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (value: string): string[] => normalize(value).split(' ').filter(Boolean);
const unique = <T,>(values: readonly T[]): T[] => [...new Set(values)];

const tokenMatches = (token: string, term: string): boolean => {
  const normalizedTerm = normalize(term);
  return token === normalizedTerm ||
    (normalizedTerm.length >= 5 && token.startsWith(normalizedTerm)) ||
    (token.length >= 5 && normalizedTerm.startsWith(token));
};

const complexityForText = (
  text: string,
): AnimationLibraryEntry['complexity'] => {
  const wordCount = tokenize(text).length;
  if (wordCount <= 9) return 'low';
  if (wordCount <= 20) return 'medium';
  return 'high';
};

export const analyzeSceneForAnimation = ({
  sceneId,
  spokenText,
  forceNewAnimation = false,
}: {
  sceneId: string;
  spokenText: string;
  forceNewAnimation?: boolean;
}): SceneAnimationAnalysis => {
  const normalizedText = normalize(spokenText);
  if (!sceneId.trim()) throw new Error('scene analyzer requires sceneId');
  if (!normalizedText) throw new Error('scene analyzer requires spokenText');
  const tokenList = tokenize(spokenText);
  const meaningContract = analyzeSceneMeaning(spokenText);
  const hasCostReductionSignal =
    /\b(?:spar\w*|senk\w*|weniger|günstig\w*|gunstig\w*|reduzier\w*|verringer\w*|halbier\w*|einspar\w*|nur\s+noch)\b/i.test(
      normalizedText,
    );

  const familyScores = FAMILY_RULES.map((rule) => {
    const ruleActive =
      rule.family !== 'cost-efficiency' || hasCostReductionSignal;
    const matchedTerms = ruleActive ? Object.keys(rule.terms)
      .map((term) => tokenList.find((token) => tokenMatches(token, term)))
      .filter((token): token is string => Boolean(token)) : [];
    const matchedRuleTerms = ruleActive ? Object.keys(rule.terms).filter((term) =>
      tokenList.some((token) => tokenMatches(token, term)),
    ) : [];
    const matchedPhrases = ruleActive ? Object.keys(rule.phrases).filter((phrase) =>
      normalizedText.includes(normalize(phrase)),
    ) : [];
    const meaningBonus = meaningContract.preferredVisualFamilies.indexOf(rule.family);
    const lexicalScore =
      matchedRuleTerms.reduce((sum, term) => sum + rule.terms[term], 0) +
      matchedPhrases.reduce((sum, phrase) => sum + rule.phrases[phrase], 0);
    const score = Math.min(
      100,
      lexicalScore + (meaningBonus === 0 ? 22 : meaningBonus > 0 ? 12 : 0),
    );
    return {
      visualFamily: rule.family,
      score,
      lexicalScore,
      matchedTerms: unique(matchedTerms),
      matchedPhrases,
      explanationPatterns: [...rule.patterns],
    };
  }).sort((left, right) =>
    right.score - left.score || left.visualFamily.localeCompare(right.visualFamily),
  );

  const hasDirectEvidence = familyScores.some(
    (family) => family.matchedTerms.length > 0 || family.matchedPhrases.length > 0,
  );
  const positive = familyScores.filter((family) => family.score > 0);
  const directlyMatchedFamilies = familyScores
    .filter(
      (family) =>
        family.matchedTerms.length > 0 || family.matchedPhrases.length > 0,
    )
    .sort((left, right) =>
      right.lexicalScore - left.lexicalScore ||
      left.visualFamily.localeCompare(right.visualFamily),
    );
  const rankedPreferredFamilies = directlyMatchedFamilies.length > 0
    ? directlyMatchedFamilies
    : positive;
  const validFamilies = new Set(FAMILY_RULES.map((rule) => rule.family));
  const fallback: AnimationFamilyName = 'input-output';
  const preferredVisualFamilies = unique([
    ...rankedPreferredFamilies.map((family) => family.visualFamily),
    ...meaningContract.preferredVisualFamilies.filter(
      (family): family is AnimationFamilyName => validFamilies.has(family as AnimationFamilyName),
    ),
  ]).slice(0, 3);
  if (preferredVisualFamilies.length === 0) preferredVisualFamilies.push(fallback);

  const dominantRule = FAMILY_RULES.find(
    (rule) => rule.family === preferredVisualFamilies[0],
  )!;
  const semanticTags = unique([
    ...meaningContract.subjectTerms,
    ...meaningContract.actionTerms,
    ...meaningContract.resultTerms,
    ...positive.slice(0, 4).flatMap(
      (family) => [...family.matchedTerms, ...family.matchedPhrases],
    ),
    ...dominantRule.patterns,
  ]).slice(0, 16);
  const safeSemanticTags = semanticTags.length >= 2
    ? semanticTags
    : [preferredVisualFamilies[0], 'explanation'];
  const forbiddenVisualFamilies = familyScores
    .filter(
      (family) =>
        family.score === 0 &&
        !preferredVisualFamilies.includes(family.visualFamily),
    )
    .slice(0, 3)
    .map((family) => family.visualFamily);
  const topScore = familyScores[0]?.score ?? 0;
  const secondScore = familyScores[1]?.score ?? 0;
  const mustBeNew =
    forceNewAnimation ||
    !hasDirectEvidence ||
    topScore < 18 ||
    (topScore === secondScore && topScore < 28);
  const maximumComplexity = complexityForText(spokenText);
  const durationSeconds = estimateSpokenDurationSeconds(spokenText);

  const brief: ReelSceneBrief = {
    sceneId,
    spokenText,
    semanticTags: safeSemanticTags,
    explanationPatterns: unique([
      ...meaningContract.preferredExplanationPatterns,
      ...dominantRule.patterns,
    ]),
    preferredVisualFamilies,
    forbiddenVisualFamilies,
    preferredEnergy: dominantRule.defaultEnergy,
    maximumComplexity,
    durationSeconds,
    meaningContract,
    mustBeNew,
  };

  return {
    sceneId,
    spokenText,
    normalizedText,
    semanticTags: safeSemanticTags,
    meaningContract,
    familyScores,
    preferredVisualFamilies,
    forbiddenVisualFamilies,
    preferredEnergy: dominantRule.defaultEnergy,
    maximumComplexity,
    mustBeNew,
    brief,
  };
};

export const analyzeScenesForAnimation = (
  scenes: readonly {sceneId: string; spokenText: string; forceNewAnimation?: boolean}[],
): SceneAnimationAnalysis[] =>
  scenes.map((scene) => analyzeSceneForAnimation(scene));
