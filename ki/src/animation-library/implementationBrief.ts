import type {PreparedReelProduction} from './reelLifecycle';
import type {SceneMeaningContract} from './meaningContract';

export type ImplementationPhaseBrief = {
  phaseId: string;
  startRatio: number;
  endRatio: number;
  purpose: string;
  semanticTrigger: string;
};

export type SceneImplementationBrief = {
  sceneId: string;
  spokenText: string;
  source: 'library' | 'new-build';
  animationId: string;
  title: string;
  visualFamily: string;
  layoutFamily: string;
  motionSignature: string;
  primaryDirection: string;
  energy: string;
  semanticTags: string[];
  explanationPatterns: string[];
  primitiveTags: string[];
  transitionInTags: string[];
  transitionOutTags: string[];
  avoidWhen: string[];
  selectionReasons: string[];
  meaningContract: SceneMeaningContract;
  implementationRules: string[];
  phases: ImplementationPhaseBrief[];
};

export type ReelImplementationBrief = {
  version: 1;
  reelId: string;
  reelIndex: number;
  sceneCount: number;
  readyForImplementation: boolean;
  blockers: string[];
  warnings: string[];
  globalRules: string[];
  reviewGates: string[];
  scenes: SceneImplementationBrief[];
};

const LIBRARY_ADAPTATION_RULES = [
  'Preserve the semantic mechanism of the selected animation, but adapt labels, timing, object count, and emphasis to this exact spoken sentence.',
  'Do not copy a previous reel scene frame-for-frame; the selected library entry is a motion grammar, not a frozen template.',
  'Keep one dominant explanatory movement per beat and remove decorative motion that does not explain the sentence.',
  'Synchronize visible state changes to important spoken words and keep title, animation, and subtitles in separate safe zones.',
  'Use deterministic Remotion motion only and render start, peak, transition, and final-hold checkpoints.',
] as const;

const phasesForMeaning = (
  contract: SceneMeaningContract,
): ImplementationPhaseBrief[] => [
  {
    phaseId: 'establish',
    startRatio: 0,
    endRatio: 0.2,
    purpose: `Show the exact starting state: ${contract.startState}.`,
    semanticTrigger: contract.subjectTerms[0] ?? 'first key phrase',
  },
  {
    phaseId: 'explain',
    startRatio: 0.18,
    endRatio: 0.62,
    purpose: `Make this exact visible change happen: ${contract.visibleChange}.`,
    semanticTrigger: contract.actionTerms[0] ?? 'main action word',
  },
  {
    phaseId: 'resolve',
    startRatio: 0.58,
    endRatio: 1,
    purpose: `Hold the exact result state: ${contract.endState}.`,
    semanticTrigger: contract.resultTerms[0] ?? 'result phrase',
  },
];

const unique = (values: readonly string[]): string[] => [...new Set(values)];

const contentRules = (
  spokenText: string,
  contract: SceneMeaningContract,
): string[] => [
  `Build and judge the animation against this exact spoken sentence: “${spokenText}”.`,
  `Communication goal: ${contract.communicationGoal}.`,
  `Opening state: ${contract.startState}.`,
  `Required visible change: ${contract.visibleChange}.`,
  `Required final state: ${contract.endState}.`,
  `Required visual cues: ${contract.requiredVisualCues.join(', ')}.`,
  `Forbidden shortcuts: ${contract.forbiddenVisualCues.join(', ')}.`,
  'Reject the scene when the viewer could swap in an unrelated caption without changing the animation.',
];

export const compileReelImplementationBrief = (
  prepared: PreparedReelProduction,
): ReelImplementationBrief => {
  const analysisByScene = new Map(
    prepared.plan.analyses.map((analysis) => [analysis.sceneId, analysis]),
  );
  const blockers = prepared.diagnostics.diagnostics
    .filter((diagnostic) => diagnostic.severity === 'blocker')
    .map((diagnostic) => diagnostic.message);
  const warnings = unique([
    ...prepared.plan.productionPlan.qualityWarnings,
    ...prepared.diagnostics.diagnostics
      .filter((diagnostic) => diagnostic.severity === 'warning')
      .map((diagnostic) => diagnostic.message),
  ]);

  const scenes = prepared.plan.productionPlan.scenes.map((scene) => {
    const analysis = analysisByScene.get(scene.sceneId);
    if (!analysis) throw new Error(`missing scene analysis for ${scene.sceneId}`);
    const spec = scene.buildSpec;
    const meaningContract = spec?.contentContract ?? analysis.meaningContract;
    return {
      sceneId: scene.sceneId,
      spokenText: analysis.spokenText,
      source: scene.source,
      animationId: scene.animationId,
      title: scene.catalogEntry.title,
      visualFamily: scene.catalogEntry.visualFamily,
      layoutFamily: scene.catalogEntry.layoutFamily,
      motionSignature: scene.catalogEntry.motionSignature,
      primaryDirection: scene.catalogEntry.primaryDirection,
      energy: scene.catalogEntry.energy,
      semanticTags: [...analysis.semanticTags],
      explanationPatterns: [...scene.catalogEntry.explanationPatterns],
      primitiveTags: [...scene.catalogEntry.primitiveTags],
      transitionInTags: [...scene.catalogEntry.transitionInTags],
      transitionOutTags: [...scene.catalogEntry.transitionOutTags],
      avoidWhen: [...scene.catalogEntry.avoidWhen],
      selectionReasons: [...scene.selectionReasons],
      meaningContract,
      implementationRules: unique([
        ...contentRules(analysis.spokenText, meaningContract),
        ...(spec ? spec.implementationRules : LIBRARY_ADAPTATION_RULES),
      ]),
      phases: spec
        ? spec.phases.map((phase) => ({...phase}))
        : phasesForMeaning(meaningContract),
    } satisfies SceneImplementationBrief;
  });

  return {
    version: 1,
    reelId: prepared.plan.reelId,
    reelIndex: prepared.plan.reelIndex,
    sceneCount: scenes.length,
    readyForImplementation:
      prepared.readyForImplementation && blockers.length === 0,
    blockers,
    warnings,
    globalRules: [
      'Never repeat a complete animation inside the same reel.',
      'Never place the same layout family or motion signature in consecutive scenes.',
      'Spoken meaning, visible state change, and final result outrank novelty and transition smoothness.',
      'Build a new animation when no library choice expresses the exact sentence strongly enough.',
      'Treat library entries as adaptable motion grammars rather than identical reusable scene templates.',
      'Every dominant movement must explain a spoken word, relationship, transformation, contrast, or result.',
      'Use hard cuts as the default; add a transition only when an object, direction, or semantic state can continue into the next scene.',
      'Keep mobile safe zones, readable subtitles, deterministic timing, and a stable final hold.',
    ],
    reviewGates: [
      'TypeScript and tests pass without disabled assertions or ignore directives.',
      'All planned checkpoint PNGs and the MP4 are technically valid and use the current source fingerprint.',
      'The opening frame, visible change, and final hold satisfy the scene meaning contract.',
      'The scene remains understandable without sound and readable at smartphone size.',
      'No overflow, accidental empty frame, repeated full animation, or meaningless decorative motion remains.',
      'A reviewer cannot replace the spoken sentence with an unrelated sentence while keeping the same animation.',
      'Semantic clarity is at least 82, novelty at least 72, and production confidence at least 75.',
      'Only a scene that passes both technical and manual review may become verified.',
    ],
    scenes,
  };
};

const bulletList = (values: readonly string[]): string =>
  values.length === 0 ? '- none' : values.map((value) => `- ${value}`).join('\n');

export const renderReelImplementationBriefMarkdown = (
  brief: ReelImplementationBrief,
): string => {
  const sceneSections = brief.scenes.map((scene, index) => {
    const phases = scene.phases
      .map(
        (phase) =>
          `- **${phase.phaseId}** (${Math.round(phase.startRatio * 100)}–${Math.round(phase.endRatio * 100)} %): ${phase.purpose} Trigger: ${phase.semanticTrigger}.`,
      )
      .join('\n');
    const meaning = scene.meaningContract;
    return `## Szene ${index + 1}: ${scene.sceneId}\n\n` +
      `**Sprechtext:** ${scene.spokenText}\n\n` +
      `**Quelle:** ${scene.source}\n\n` +
      `**Animation:** \`${scene.animationId}\` — ${scene.title}\n\n` +
      `**Familie / Layout / Bewegung:** ${scene.visualFamily} / ${scene.layoutFamily} / ${scene.motionSignature}\n\n` +
      `**Richtung / Energie:** ${scene.primaryDirection} / ${scene.energy}\n\n` +
      `### Bedeutungsvertrag\n` +
      `- **Kommunikationsziel:** ${meaning.communicationGoal}\n` +
      `- **Startzustand:** ${meaning.startState}\n` +
      `- **Sichtbare Veränderung:** ${meaning.visibleChange}\n` +
      `- **Endzustand:** ${meaning.endState}\n` +
      `- **Pflicht-Cues:** ${meaning.requiredVisualCues.join(', ')}\n` +
      `- **Verbotene Abkürzungen:** ${meaning.forbiddenVisualCues.join(', ')}\n\n` +
      `### Semantik\n${bulletList(scene.semanticTags)}\n\n` +
      `### Erklärmuster\n${bulletList(scene.explanationPatterns)}\n\n` +
      `### Grundbausteine\n${bulletList(scene.primitiveTags)}\n\n` +
      `### Choreografiephasen\n${phases}\n\n` +
      `### Implementierungsregeln\n${bulletList(scene.implementationRules)}\n\n` +
      `### Auswahlbegründung\n${bulletList(scene.selectionReasons)}\n\n` +
      `### Übergang hinein\n${bulletList(scene.transitionInTags)}\n\n` +
      `### Übergang hinaus\n${bulletList(scene.transitionOutTags)}\n`;
  }).join('\n---\n\n');

  return `# Reel-Implementierungsbrief: ${brief.reelId}\n\n` +
    `**Reel-Index:** ${brief.reelIndex}  \n` +
    `**Szenen:** ${brief.sceneCount}  \n` +
    `**Bereit zur Umsetzung:** ${brief.readyForImplementation ? 'JA' : 'NEIN'}\n\n` +
    `## Blocker\n${bulletList(brief.blockers)}\n\n` +
    `## Warnungen\n${bulletList(brief.warnings)}\n\n` +
    `## Globale Regeln\n${bulletList(brief.globalRules)}\n\n` +
    `## Review-Gates\n${bulletList(brief.reviewGates)}\n\n` +
    `${sceneSections}\n`;
};
