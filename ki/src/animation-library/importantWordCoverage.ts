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

const chooseMechanism = ({
  role,
  usedMechanismIds,
  recentMechanismIds,
  allowStrong,
}: {
  role: SemanticBeatRole;
  usedMechanismIds: ReadonlySet<string>;
  recentMechanismIds: ReadonlySet<string>;
  allowStrong: boolean;
}): MicroMotionMechanism => {
  const candidates = getMicroMotionMechanismsForRole(role);
  const ranked = [...candidates].sort((left, right) => {
    const penalty = (candidate: MicroMotionMechanism): number =>
      (usedMechanismIds.has(candidate.mechanismId) ? 100 : 0) +
      (recentMechanismIds.has(candidate.mechanismId) ? 24 : 0) +
      (!allowStrong && candidate.intensity === 'strong' ? 80 : 0) +
      (allowStrong && candidate.intensity === 'quiet' ? 8 : 0);
    return penalty(left) - penalty(right) ||
      left.maximumDurationFrames - right.maximumDurationFrames ||
      left.mechanismId.localeCompare(right.mechanismId);
  });
  const selected = ranked.find(
    (candidate) => allowStrong || candidate.intensity !== 'strong',
  ) ?? ranked[0];
  if (selected) return selected;
  const generic = getMicroMotionMechanismsForRole('emphasis')[0];
  if (!generic) throw new Error('no micro-motion mechanism is available');
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
  const recent = new Set(recentMechanismIds.slice(-12));
  const used = new Set<string>();
  const beats: SemanticMotionBeat[] = [];
  const activeDuration = Math.max(
    1,
    durationInFrames - base.startHoldFrames - base.endHoldFrames,
  );
  let strongMotionCount = 0;

  for (const classification of important) {
    const allowStrong = strongMotionCount < base.maximumStrongMotions;
    const mechanism = chooseMechanism({
      role: classification.role,
      usedMechanismIds: used,
      recentMechanismIds: recent,
      allowStrong,
    });
    used.add(mechanism.mechanismId);
    if (mechanism.intensity === 'strong') strongMotionCount += 1;
    const ratio = base.tokens.length <= 1
      ? 0.5
      : classification.token.tokenIndex / (base.tokens.length - 1);
    beats.push({
      beatId: `${sceneId}-important-${String(beats.length + 1).padStart(2, '0')}`,
      tokenIndex: classification.token.tokenIndex,
      text: classification.token.text,
      role: classification.role,
      importance: 85,
      critical: true,
      atFrame: Math.min(
        durationInFrames - base.endHoldFrames - 1,
        base.startHoldFrames + Math.round(activeDuration * ratio),
      ),
      mechanismId: mechanism.mechanismId,
      layer: mechanism.layer,
      intensity: mechanism.intensity,
      soundCue: mechanism.soundCue,
      semanticPurpose: `${mechanism.semanticPurpose} Coverage reason: ${classification.reason}.`,
    });
  }

  if (beats.length === 0 && base.tokens.length > 0) {
    const fallbackToken = base.tokens[Math.floor(base.tokens.length / 2)];
    const mechanism = chooseMechanism({
      role: 'emphasis',
      usedMechanismIds: used,
      recentMechanismIds: recent,
      allowStrong: false,
    });
    beats.push({
      beatId: `${sceneId}-sentence-focus`,
      tokenIndex: fallbackToken.tokenIndex,
      text: fallbackToken.text,
      role: 'emphasis',
      importance: 65,
      critical: false,
      atFrame: base.startHoldFrames + Math.round(activeDuration * 0.5),
      mechanismId: mechanism.mechanismId,
      layer: mechanism.layer,
      intensity: mechanism.intensity,
      soundCue: mechanism.soundCue,
      semanticPurpose: 'Provide one restrained sentence focus while the full scene animation carries the explanation.',
    });
  }

  const coveredImportantCount = important.filter((classification) =>
    beats.some((beat) => beat.tokenIndex === classification.token.tokenIndex),
  ).length;
  const importantBeatCoverage = important.length === 0
    ? 1
    : coveredImportantCount / important.length;
  const warnings: string[] = [];
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
    sentenceHasDominantMotion:
      base.sentenceHasDominantMotion || strongMotionCount > 0,
    strongMotionCount,
    valid:
      importantBeatCoverage === 1 &&
      strongMotionCount <= base.maximumStrongMotions,
    warnings,
  };
};
