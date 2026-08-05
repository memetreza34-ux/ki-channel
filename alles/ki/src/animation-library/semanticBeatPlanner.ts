import {
  getMicroMotionMechanismsForRole,
  type MicroMotionMechanism,
  type SemanticBeatRole,
} from './microMotionCatalog';

export type SemanticWordToken = {
  tokenIndex: number;
  text: string;
  normalized: string;
  startCharacter: number;
  endCharacter: number;
};

export type SemanticMotionBeat = {
  beatId: string;
  tokenIndex: number;
  text: string;
  role: SemanticBeatRole;
  importance: number;
  critical: boolean;
  atFrame: number;
  mechanismId: string;
  layer: MicroMotionMechanism['layer'];
  intensity: MicroMotionMechanism['intensity'];
  soundCue: MicroMotionMechanism['soundCue'];
  semanticPurpose: string;
};

export type SentenceMotionCoveragePlan = {
  sceneId: string;
  spokenText: string;
  durationInFrames: number;
  startHoldFrames: number;
  endHoldFrames: number;
  tokens: SemanticWordToken[];
  beats: SemanticMotionBeat[];
  criticalBeatCount: number;
  coveredCriticalBeatCount: number;
  importantBeatCoverage: number;
  sentenceHasDominantMotion: boolean;
  maximumStrongMotions: number;
  strongMotionCount: number;
  valid: boolean;
  warnings: string[];
};

type RoleRule = {
  role: SemanticBeatRole;
  terms: readonly string[];
  phrases?: readonly string[];
  importance: number;
  critical: boolean;
};

const ROLE_RULES: readonly RoleRule[] = [
  {role:'negation',terms:['nicht','kein','keine','niemals','ohne','weder'],importance:96,critical:true},
  {role:'risk',terms:['falsch','risiko','halluzination','gefährlich','unsicher','fehlerhaft','warnung'],phrases:['kann falsch sein','nicht zuverlässig'],importance:98,critical:true},
  {role:'quantity',terms:['prozent','million','millionen','milliarde','milliarden','sekunde','sekunden','euro','tokens'],importance:91,critical:true},
  {role:'comparison',terms:['besser','schlechter','schneller','langsamer','mehr','weniger','vergleich','versus','gegen'],phrases:['im vergleich','während dagegen'],importance:90,critical:true},
  {role:'cause',terms:['weil','durch','wegen','deshalb','darum','dadurch'],phrases:['führt dazu','aus diesem grund'],importance:89,critical:true},
  {role:'effect',terms:['dadurch','folglich','somit','entsteht','bewirkt','führt'],phrases:['das ergebnis','am ende'],importance:88,critical:true},
  {role:'transformation',terms:['wird','werden','umwandeln','übersetzen','zerlegen','teilen','verwandeln','konvertieren','komprimieren'],phrases:['wird zu','verwandelt sich','teilt sich'],importance:94,critical:true},
  {role:'action',terms:['erstellt','erzeugt','berechnet','prüft','verbindet','sucht','liest','schreibt','analysiert','entscheidet','filtert','sortiert','sendet','speichert','lernt','öffnet','klickt'],importance:93,critical:true},
  {role:'tool',terms:['chatgpt','claude','gemini','midjourney','veo','flow','api','agent','prompt','modell','app','tool'],importance:84,critical:true},
  {role:'source',terms:['quelle','quellen','studie','beleg','dokument','datenbank','bericht'],importance:86,critical:true},
  {role:'time',terms:['heute','früher','später','jetzt','danach','zuerst','sekunde','minute','jahr','version','update'],importance:78,critical:false},
  {role:'sequence',terms:['zuerst','danach','anschließend','dann','schritt','erstens','zweitens','drittens'],phrases:['schritt für schritt','wort für wort'],importance:82,critical:false},
  {role:'result',terms:['ergebnis','antwort','output','fertig','gewinner','lösung','schluss'],phrases:['am ende','das bedeutet'],importance:92,critical:true},
  {role:'definition',terms:['bedeutet','nennt','heißt','ist'],phrases:['das ist','nennt man'],importance:74,critical:false},
  {role:'subject',terms:['ki','modell','agent','mensch','system','daten','text','bild','video','audio'],importance:70,critical:false},
  {role:'emphasis',terms:['wichtig','entscheidend','genau','wirklich','nur','größte','beste'],importance:72,critical:false},
] as const;

const normalize = (value: string): string =>
  value
    .toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9%]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenizeWithPositions = (value: string): SemanticWordToken[] => {
  const tokens: SemanticWordToken[] = [];
  const matcher = /[\p{L}\p{N}%]+/gu;
  let match: RegExpExecArray | null;
  while ((match = matcher.exec(value)) !== null) {
    tokens.push({
      tokenIndex: tokens.length,
      text: match[0],
      normalized: normalize(match[0]),
      startCharacter: match.index,
      endCharacter: match.index + match[0].length,
    });
  }
  return tokens;
};

const isNumericToken = (value: string): boolean =>
  /^\d+(?:[.,]\d+)?%?$/.test(value);

const roleCandidatesForToken = ({
  token,
  normalizedText,
}: {
  token: SemanticWordToken;
  normalizedText: string;
}): Array<{
  role: SemanticBeatRole;
  importance: number;
  critical: boolean;
}> => {
  const candidates: Array<{
    role: SemanticBeatRole;
    importance: number;
    critical: boolean;
  }> = [];
  if (isNumericToken(token.normalized)) {
    candidates.push({role:'quantity',importance:99,critical:true});
  }
  for (const rule of ROLE_RULES) {
    const termMatch = rule.terms.includes(token.normalized);
    const phraseMatch = rule.phrases?.some(
      (phrase) => normalizedText.includes(normalize(phrase)),
    ) ?? false;
    if (termMatch || phraseMatch) {
      candidates.push({
        role: rule.role,
        importance: rule.importance + (termMatch && phraseMatch ? 2 : 0),
        critical: rule.critical,
      });
    }
  }
  return candidates.sort((left, right) => right.importance - left.importance);
};

const chooseMechanism = ({
  role,
  usedMechanismIds,
  strongCount,
  recentMechanismIds,
}: {
  role: SemanticBeatRole;
  usedMechanismIds: Set<string>;
  strongCount: number;
  recentMechanismIds: readonly string[];
}): MicroMotionMechanism => {
  const candidates = getMicroMotionMechanismsForRole(role);
  if (candidates.length === 0) {
    throw new Error(`no micro-motion mechanism exists for role ${role}`);
  }
  const recent = new Set(recentMechanismIds.slice(-8));
  return [...candidates].sort((left, right) => {
    const leftPenalty =
      (usedMechanismIds.has(left.mechanismId) ? 100 : 0) +
      (recent.has(left.mechanismId) ? 30 : 0) +
      (left.intensity === 'strong' && strongCount >= 3 ? 50 : 0);
    const rightPenalty =
      (usedMechanismIds.has(right.mechanismId) ? 100 : 0) +
      (recent.has(right.mechanismId) ? 30 : 0) +
      (right.intensity === 'strong' && strongCount >= 3 ? 50 : 0);
    return leftPenalty - rightPenalty ||
      left.maximumDurationFrames - right.maximumDurationFrames ||
      left.mechanismId.localeCompare(right.mechanismId);
  })[0];
};

const chooseTokenCandidates = (
  tokens: readonly SemanticWordToken[],
  normalizedText: string,
): Array<{
  token: SemanticWordToken;
  role: SemanticBeatRole;
  importance: number;
  critical: boolean;
}> => {
  const candidates = tokens.flatMap((token) => {
    const roles = roleCandidatesForToken({token, normalizedText});
    return roles.length === 0
      ? []
      : [{token, ...roles[0]}];
  });
  const byRole = new Map<SemanticBeatRole, typeof candidates[number]>();
  for (const candidate of candidates) {
    const current = byRole.get(candidate.role);
    if (!current || candidate.importance > current.importance) {
      byRole.set(candidate.role, candidate);
    }
  }
  const mandatory = [...byRole.values()].filter((candidate) => candidate.critical);
  const optional = candidates
    .filter((candidate) => !mandatory.some(
      (item) => item.token.tokenIndex === candidate.token.tokenIndex,
    ))
    .sort((left, right) =>
      right.importance - left.importance ||
      left.token.tokenIndex - right.token.tokenIndex,
    );
  const targetCount = Math.min(8, Math.max(3, Math.ceil(tokens.length / 4)));
  return [...mandatory, ...optional]
    .sort((left, right) =>
      right.importance - left.importance ||
      left.token.tokenIndex - right.token.tokenIndex,
    )
    .filter((candidate, index, values) =>
      values.findIndex((value) => value.token.tokenIndex === candidate.token.tokenIndex) === index,
    )
    .slice(0, Math.max(targetCount, mandatory.length))
    .sort((left, right) => left.token.tokenIndex - right.token.tokenIndex);
};

export const planSentenceMotionCoverage = ({
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
  if (!sceneId.trim()) throw new Error('sentence motion planner requires sceneId');
  if (!spokenText.trim()) throw new Error('sentence motion planner requires spokenText');
  if (!Number.isInteger(durationInFrames) || durationInFrames < 45) {
    throw new Error('sentence motion durationInFrames must be an integer of at least 45');
  }

  const tokens = tokenizeWithPositions(spokenText);
  if (tokens.length === 0) throw new Error('sentence motion planner found no words');
  const normalizedText = normalize(spokenText);
  const candidates = chooseTokenCandidates(tokens, normalizedText);
  const startHoldFrames = Math.min(18, Math.max(8, Math.round(durationInFrames * 0.08)));
  const endHoldFrames = Math.min(24, Math.max(12, Math.round(durationInFrames * 0.12)));
  const activeDuration = Math.max(1, durationInFrames - startHoldFrames - endHoldFrames);
  const usedMechanismIds = new Set<string>();
  let strongCount = 0;

  const beats = candidates.map((candidate, index) => {
    const mechanism = chooseMechanism({
      role: candidate.role,
      usedMechanismIds,
      strongCount,
      recentMechanismIds,
    });
    usedMechanismIds.add(mechanism.mechanismId);
    if (mechanism.intensity === 'strong') strongCount += 1;
    const tokenRatio = tokens.length === 1
      ? 0.5
      : candidate.token.tokenIndex / (tokens.length - 1);
    const atFrame = Math.min(
      durationInFrames - endHoldFrames - 1,
      startHoldFrames + Math.round(activeDuration * tokenRatio),
    );
    return {
      beatId: `${sceneId}-beat-${String(index + 1).padStart(2, '0')}`,
      tokenIndex: candidate.token.tokenIndex,
      text: candidate.token.text,
      role: candidate.role,
      importance: candidate.importance,
      critical: candidate.critical,
      atFrame,
      mechanismId: mechanism.mechanismId,
      layer: mechanism.layer,
      intensity: mechanism.intensity,
      soundCue: mechanism.soundCue,
      semanticPurpose: mechanism.semanticPurpose,
    } satisfies SemanticMotionBeat;
  });

  const criticalCandidates = chooseTokenCandidates(tokens, normalizedText)
    .filter((candidate) => candidate.critical);
  const coveredCriticalBeatCount = criticalCandidates.filter((candidate) =>
    beats.some((beat) => beat.tokenIndex === candidate.token.tokenIndex),
  ).length;
  const criticalBeatCount = criticalCandidates.length;
  const importantBeatCoverage = criticalBeatCount === 0
    ? 1
    : coveredCriticalBeatCount / criticalBeatCount;
  const sentenceHasDominantMotion = beats.some((beat) => beat.intensity === 'strong');
  const warnings: string[] = [];
  if (importantBeatCoverage < 1) {
    warnings.push(`${coveredCriticalBeatCount}/${criticalBeatCount} critical beats are covered`);
  }
  if (!sentenceHasDominantMotion) {
    warnings.push('sentence has no dominant semantic motion');
  }
  if (strongCount > 3) {
    warnings.push(`${strongCount} strong motions exceed the per-scene limit of 3`);
  }
  for (let index = 1; index < beats.length; index += 1) {
    if (beats[index].atFrame - beats[index - 1].atFrame < 6) {
      warnings.push(`beats ${beats[index - 1].beatId} and ${beats[index].beatId} are too close`);
    }
  }

  return {
    sceneId,
    spokenText,
    durationInFrames,
    startHoldFrames,
    endHoldFrames,
    tokens,
    beats,
    criticalBeatCount,
    coveredCriticalBeatCount,
    importantBeatCoverage,
    sentenceHasDominantMotion,
    maximumStrongMotions: 3,
    strongMotionCount: strongCount,
    valid:
      importantBeatCoverage === 1 &&
      sentenceHasDominantMotion &&
      strongCount <= 3 &&
      !warnings.some((warning) => warning.includes('too close')),
    warnings: [...new Set(warnings)],
  };
};

export const planReelSentenceMotionCoverage = (
  scenes: readonly {
    sceneId: string;
    spokenText: string;
    durationInFrames: number;
  }[],
): SentenceMotionCoveragePlan[] => {
  const recentMechanismIds: string[] = [];
  return scenes.map((scene) => {
    const plan = planSentenceMotionCoverage({...scene, recentMechanismIds});
    recentMechanismIds.push(...plan.beats.map((beat) => beat.mechanismId));
    return plan;
  });
};
