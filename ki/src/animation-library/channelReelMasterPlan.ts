import type {ChannelContentModePlan} from './channelContentModes';
import {resolveChannelContentMode} from './channelContentModeResolver';
import {
  compileReelImplementationBrief,
  type ReelImplementationBrief,
} from './implementationBrief';
import type {PreparedReelProduction} from './reelLifecycle';
import {
  createUniversalReelMotionPlan,
  type UniversalReelMotionPlan,
} from './universalMotionPlan';

export type ChannelSceneMasterPlan = {
  sceneId: string;
  spokenText: string;
  durationInFrames: number;
  contentMode: ChannelContentModePlan;
  fullAnimationId: string;
  fullAnimationSource: 'library' | 'new-build';
  visualFamily: string;
  layoutFamily: string;
  motionSignature: string;
  importantWordCount: number;
  importantWordMechanisms: string[];
  requiredVisualSources: string[];
  requiredMotionLayers: string[];
  valid: boolean;
  warnings: string[];
};

export type ChannelReelMasterPlan = {
  version: 1;
  reelId: string;
  reelIndex: number;
  sceneCount: number;
  implementationBrief: ReelImplementationBrief;
  universalMotion: UniversalReelMotionPlan;
  scenes: ChannelSceneMasterPlan[];
  modeDistribution: Array<{modeId: string; sceneCount: number}>;
  animateEverythingAsFarAsUseful: boolean;
  blockers: string[];
  warnings: string[];
};

const unique = (values: readonly string[]): string[] => [...new Set(values)];

export const createChannelReelMasterPlan = ({
  prepared,
  durationBySceneId,
}: {
  prepared: PreparedReelProduction;
  durationBySceneId: Readonly<Record<string, number>>;
}): ChannelReelMasterPlan => {
  const implementationBrief = compileReelImplementationBrief(prepared);
  const analysisByScene = new Map(
    prepared.plan.analyses.map((analysis) => [analysis.sceneId, analysis]),
  );
  const universalInputs = prepared.plan.productionPlan.scenes.map((scene) => {
    const analysis = analysisByScene.get(scene.sceneId);
    if (!analysis) throw new Error(`missing analysis for ${scene.sceneId}`);
    const durationInFrames = durationBySceneId[scene.sceneId];
    if (!Number.isInteger(durationInFrames) || durationInFrames < 45) {
      throw new Error(
        `scene ${scene.sceneId} needs an integer duration of at least 45 frames`,
      );
    }
    return {
      sceneId: scene.sceneId,
      spokenText: analysis.spokenText,
      durationInFrames,
      animationId: scene.animationId,
      visualFamily: scene.catalogEntry.visualFamily,
      layoutFamily: scene.catalogEntry.layoutFamily,
      motionSignature: scene.catalogEntry.motionSignature,
      transitionInTags: scene.catalogEntry.transitionInTags,
      transitionOutTags: scene.catalogEntry.transitionOutTags,
    };
  });
  const universalMotion = createUniversalReelMotionPlan({
    reelId: prepared.plan.reelId,
    scenes: universalInputs,
  });
  const universalByScene = new Map(
    universalMotion.scenes.map((scene) => [scene.sceneId, scene]),
  );

  const scenes = prepared.plan.productionPlan.scenes.map((scene) => {
    const analysis = analysisByScene.get(scene.sceneId)!;
    const motion = universalByScene.get(scene.sceneId)!;
    const contentMode = resolveChannelContentMode(analysis.spokenText);
    return {
      sceneId: scene.sceneId,
      spokenText: analysis.spokenText,
      durationInFrames: motion.durationInFrames,
      contentMode,
      fullAnimationId: scene.animationId,
      fullAnimationSource: scene.source,
      visualFamily: scene.catalogEntry.visualFamily,
      layoutFamily: scene.catalogEntry.layoutFamily,
      motionSignature: scene.catalogEntry.motionSignature,
      importantWordCount: motion.sentenceCoverage.criticalBeatCount,
      importantWordMechanisms: motion.importantWordBeats.map(
        (beat) => beat.mechanismId,
      ),
      requiredVisualSources: [...contentMode.visualSources],
      requiredMotionLayers: unique([
        ...contentMode.primaryMode.requiredMotionLayers,
        ...motion.layers.filter((layer) => layer.required).map((layer) => layer.layerId),
      ]),
      valid: motion.valid,
      warnings: unique([
        ...motion.warnings,
        ...contentMode.secondaryModes.map(
          (mode) => `secondary content mode: ${mode.modeId}`,
        ),
      ]),
    } satisfies ChannelSceneMasterPlan;
  });

  const modeCounts = new Map<string, number>();
  for (const scene of scenes) {
    const modeId = scene.contentMode.primaryMode.modeId;
    modeCounts.set(modeId, (modeCounts.get(modeId) ?? 0) + 1);
  }
  const modeDistribution = [...modeCounts.entries()]
    .map(([modeId, sceneCount]) => ({modeId, sceneCount}))
    .sort((left, right) => right.sceneCount - left.sceneCount || left.modeId.localeCompare(right.modeId));
  const blockers = unique([
    ...implementationBrief.blockers,
    ...universalMotion.blockers,
  ]);
  const warnings = unique([
    ...implementationBrief.warnings,
    ...universalMotion.warnings,
    ...scenes.flatMap((scene) => scene.warnings.map(
      (warning) => `${scene.sceneId}: ${warning}`,
    )),
  ]);

  return {
    version: 1,
    reelId: prepared.plan.reelId,
    reelIndex: prepared.plan.reelIndex,
    sceneCount: scenes.length,
    implementationBrief,
    universalMotion,
    scenes,
    modeDistribution,
    animateEverythingAsFarAsUseful:
      prepared.readyForImplementation &&
      implementationBrief.readyForImplementation &&
      universalMotion.everythingAnimatedAsFarAsUseful &&
      scenes.every((scene) => scene.valid) &&
      blockers.length === 0,
    blockers,
    warnings,
  };
};

const list = (values: readonly string[]): string =>
  values.length === 0 ? '- keine' : values.map((value) => `- ${value}`).join('\n');

export const renderChannelReelMasterPlanMarkdown = (
  plan: ChannelReelMasterPlan,
): string => {
  const scenes = plan.scenes.map((scene, index) =>
    `## Szene ${index + 1}: ${scene.sceneId}\n\n` +
    `**Sprechtext:** ${scene.spokenText}\n\n` +
    `**Content-Modus:** ${scene.contentMode.primaryMode.modeId}\n\n` +
    `**Vollanimation:** \`${scene.fullAnimationId}\` (${scene.fullAnimationSource})\n\n` +
    `**Familie / Layout / Bewegung:** ${scene.visualFamily} / ${scene.layoutFamily} / ${scene.motionSignature}\n\n` +
    `**Wichtige Wörter:** ${scene.importantWordCount}\n\n` +
    `### Wortmechanismen\n${list(scene.importantWordMechanisms)}\n\n` +
    `### Visuelle Quellen\n${list(scene.requiredVisualSources)}\n\n` +
    `### Pflicht-Layer\n${list(scene.requiredMotionLayers)}\n\n` +
    `### Warnungen\n${list(scene.warnings)}\n`,
  ).join('\n---\n\n');

  return `# KI-Kanal Masterplan: ${plan.reelId}\n\n` +
    `**Szenen:** ${plan.sceneCount}  \n` +
    `**Alles sinnvoll animiert:** ${plan.animateEverythingAsFarAsUseful ? 'JA' : 'NEIN'}  \n` +
    `**Satzabdeckung:** ${Math.round(plan.universalMotion.sentenceCoverage * 100)} %  \n` +
    `**Wichtige-Wörter-Abdeckung:** ${Math.round(plan.universalMotion.importantWordCoverage * 100)} %\n\n` +
    `## Blocker\n${list(plan.blockers)}\n\n` +
    `## Warnungen\n${list(plan.warnings)}\n\n` +
    `${scenes}\n`;
};
