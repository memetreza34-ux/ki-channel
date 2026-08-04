import {
  getMicroMotionMechanismsForRole,
  type MicroMotionMechanism,
  type SemanticBeatRole,
} from './microMotionCatalog';
import {
  planSentenceMotionCoverage,
  type SemanticMotionBeat,
  type SentenceMotionCoveragePlan,
  type SemanticWordToken,
} from './semanticBeatPlanner';

export type ImportantWordClassification = {
  token: SemanticWordToken;
  role: SemanticBeatRole;
  reason: string;
};

const WORD_ROLE_MAP: Readonly<Record<string, SemanticBeatRole>> = Object.freeze({
  nicht: 'negation',
  kein: 'negation',
  keine: 'negation',
  niemals: 'negation',
  falsch: 'risk',
  risiko: 'risk',
  halluzination: 'risk',
  unsicher: 'risk',
  fehler: 'risk',
  besser: 'comparison',
  schlechter: 'comparison',
  schneller: 'comparison',
  langsamer: 'comparison',
  mehr: 'comparison',
  weniger: 'comparison',
  weil: 'cause',
  dadurch: 'cause',
  deshalb: 'effect',
  somit: 'effect',
  entsteht: 'effect',
  wird: 'transformation',
  werden: 'transformation',
  verwandelt: 'transformation',
  übersetzt: 'transformation',
  zerlegt: 'transformation',
  erstellt: 'action',
  erzeugt: 'action',
  berechnet: 'action',
  prüft: 'action',
  verbindet: 'action',
  sucht: 'action',
  liest: 'action',
  analysiert: 'action',
  entscheidet: 'action',
  filtert: 'action',
  sortiert: 'action',
  speichert: 'action',
  lernt: 'action',
  chatgpt: 'tool',
  claude: 'tool',
  gemini: 'tool',
  midjourney: 'tool',
  veo: 'tool',
  flow: 'tool',
  api: 'tool',
  agent: 'tool',
  prompt: 'tool',
  modell: 'tool',
  quelle: 'source',
  quellen: 'source',
  studie: 'source',
  beleg: 'source',
  dokument: 'source',
  zuerst: 'sequence',
  danach: 'sequence',
  anschließend: 'sequence',
  dann: 'sequence',
  antwort: 'result',
  ergebnis: 'result',
  output: 'result',
  lösung: 'result',
  bedeutet: 'definition',
  wichtig: 'emphasis',
  entscheidend: 'emphasis',
  wirklich: 'emphasis',
});

const normalize = (value: string): string =>
  value
    .toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9%]+/g, ' ')
    .trim();

const numeric = (value: string): boolean => /^\d+(?:[.,]\d+)?%?$/.test(value);

export const classifyImportantWords = (
  tokens: readonly SemanticWordToken[],
): ImportantWordClassification[] =>
  tokens.flatMap((token) => {
    const normalized = normalize(token.text);
    if (numeric(normalized)) {
      return [{token, role: 'quantity' as const, reason: 'numeric value'}];
    }
    const role = WORD_ROLE_MAP[normalized];
    return role
      ? [{token, role, reason: `semantic ${role} keyword`}]
      : [];
  });

const chooseSupportMechanism = ({
  role,
  usedMechanismIds,
}: {
  role: SemanticBeatRole;
  usedMechanismIds: ReadonlySet<string>;
}): MicroMotionMechanism => {
  const candidates = getMicroMotionMechanismsForRole(role);
  const support = candidates.find(
    (candidate) =>
      candidate.intensity !== 'strong' &&
      !usedMechanismIds.has(candidate.mechanismId),
  );
  if (support) return support;
  const unused = candidates.find(
    (candidate) => !usedMechanismIds.has(candidate.mechanismId),
  );
  if (unused && unused.intensity !== 'strong') return unused;
  const generic = getMicroMotionMechanismsForRole('emphasis').find(
    (candidate) => candidate.intensity !== 'strong',
  );
  if (!generic) throw new Error('no support micro-motion is available');
  return generic;
};

export const completeImportantWordCoverage = ({
  sceneId,
  spokenText,
  durationInFrames,
  recentMechanismIds = [],
}: {
  sceneId: string;
  spokenText: string;
  durationInFrames: number;
  recentMechanismIds?: readonly string[];
}): SentenceMotionCoveragePlan => {
  const base = planSentenceMotionCoverage({
    sceneId,
    spokenText,
    durationInFrames,
    recentMechanismIds,
  });
  const important = classifyImportantWords(base.tokens);
  const coveredTokenIndices = new Set(base.beats.map((beat) => beat.tokenIndex));
  const usedMechanismIds = new Set(base.beats.map((beat) => beat.mechanismId));
  const start = base.startHoldFrames;
  const active = Math.max(1, durationInFrames - start - base.endHoldFrames);
  const additions: SemanticMotionBeat[] = [];

  for (const classification of important) {
    if (coveredTokenIndices.has(classification.token.tokenIndex)) continue;
    const mechanism = chooseSupportMechanism({
      role: classification.role,
      usedMechanismIds,
    });
    usedMechanismIds.add(mechanism.mechanismId);
    coveredTokenIndices.add(classification.token.tokenIndex);
    const ratio = base.tokens.length <= 1
      ? 0.5
      : classification.token.tokenIndex / (base.tokens.length - 1);
    additions.push({
      beatId: `${sceneId}-important-${String(additions.length + 1).padStart(2, '0')}`,
      tokenIndex: classification.token.tokenIndex,
      text: classification.token.text,
      role: classification.role,
      importance: 85,
      critical: true,
      atFrame: Math.min(
        durationInFrames - base.endHoldFrames - 1,
        start + Math.round(active * ratio),
      ),
      mechanismId: mechanism.mechanismId,
      layer: mechanism.layer,
      intensity: mechanism.intensity,
      soundCue: mechanism.soundCue,
      semanticPurpose: `${mechanism.semanticPurpose} Coverage reason: ${classification.reason}.`,
    });
  }

  const beats = [...base.beats, ...additions].sort(
    (left, right) => left.atFrame - right.atFrame || left.tokenIndex - right.tokenIndex,
  );
  const coveredImportantCount = important.filter((classification) =>
    beats.some((beat) => beat.tokenIndex === classification.token.tokenIndex),
  ).length;
  const importantBeatCoverage = important.length === 0
    ? 1
    : coveredImportantCount / important.length;
  const strongMotionCount = beats.filter((beat) => beat.intensity === 'strong').length;
  const warnings = base.warnings.filter(
    (warning) => !warning.includes('critical beats are covered'),
  );
  if (importantBeatCoverage < 1) {
    warnings.push(`${coveredImportantCount}/${important.length} important words are animated`);
  }
  if (strongMotionCount > base.maximumStrongMotions) {
    warnings.push(
      `${strongMotionCount} strong motions exceed the maximum of ${base.maximumStrongMotions}`,
    );
  }

  return {
    ...base,
    beats,
    criticalBeatCount: important.length,
    coveredCriticalBeatCount: coveredImportantCount,
    importantBeatCoverage,
    strongMotionCount,
    valid:
      importantBeatCoverage === 1 &&
      base.sentenceHasDominantMotion &&
      strongMotionCount <= base.maximumStrongMotions,
    warnings: [...new Set(warnings)],
  };
};
