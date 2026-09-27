export const REMOTION_CAPABILITIES = [
  'react-svg-css',
  'paths',
  'shapes',
  'three',
  'depth-2.5d',
  'kinetic-typography',
  'terminal-code',
  'data-visualization',
  'object-transformation',
  'motion-blur',
  'transitions',
  'noise',
  'real-capture',
  'lottie',
  'rive',
] as const;

export type RemotionCapability = (typeof REMOTION_CAPABILITIES)[number];

/**
 * Capabilities that may count toward the "advanced visual" quota.
 *
 * Utility/workflow skills such as captions, Studio, rendering, docs, multimedia
 * metadata, upgrades and SaaS architecture deliberately do not live here: they
 * are useful Remotion skills, but they are not a semantic visual mechanism for a
 * beat and therefore must never inflate the visual-quality score.
 */
export const ADVANCED_REMOTION_CAPABILITIES = [
  'paths',
  'shapes',
  'three',
  'depth-2.5d',
  'kinetic-typography',
  'terminal-code',
  'data-visualization',
  'object-transformation',
  'motion-blur',
  'transitions',
  'noise',
  'real-capture',
  'lottie',
  'rive',
] as const satisfies readonly RemotionCapability[];

export const isSafeRemotionReelSourceFile = (sourceFile: string): boolean => {
  const normalized = sourceFile.replace(/\\/g, '/');
  if (!normalized || normalized.startsWith('/') || normalized.includes('://')) return false;
  if (normalized.split('/').includes('..')) return false;
  return normalized.startsWith('ki/src/reels/') && /\.(?:ts|tsx)$/.test(normalized);
};

export type RemotionCapabilityBeat = {
  beatId: string;
  sourceFile: string;
  isHook?: boolean;
  isHero?: boolean;
  continuationOfPrevious?: boolean;
  primaryCapability: RemotionCapability;
  capabilities: readonly RemotionCapability[];
  primaryPrimitive: 'object' | 'path' | 'shape' | 'space' | 'code' | 'chart' | 'capture' | 'typography' | 'ui' | 'animation' | 'card';
  rationale: string;
  semanticCardReason?: string;
};

export type RemotionCapabilityPlan = {
  version: 1;
  sourceFiles: readonly string[];
  beats: readonly RemotionCapabilityBeat[];
};

const advanced = new Set<RemotionCapability>(ADVANCED_REMOTION_CAPABILITIES);

export const assertRemotionCapabilityPlan = (plan: RemotionCapabilityPlan): void => {
  if (plan.version !== 1) throw new Error('Remotion capability plan version must be 1');
  if (plan.sourceFiles.length < 1) throw new Error('Remotion capability plan needs at least one reel source file');
  if (plan.beats.length < 4) throw new Error('Remotion capability plan needs at least four beats');

  const sourceFiles = new Set<string>();
  for (const sourceFile of plan.sourceFiles) {
    if (!isSafeRemotionReelSourceFile(sourceFile)) {
      throw new Error(`unsafe Remotion capability source file: ${sourceFile}`);
    }
    if (sourceFiles.has(sourceFile)) throw new Error(`duplicate Remotion capability source file: ${sourceFile}`);
    sourceFiles.add(sourceFile);
  }

  const ids = new Set<string>();
  let advancedBeats = 0;
  let heroBeats = 0;

  for (const beat of plan.beats) {
    if (!beat.beatId.trim()) throw new Error('Remotion capability beatId must not be empty');
    if (ids.has(beat.beatId)) throw new Error(`duplicate Remotion capability beat: ${beat.beatId}`);
    ids.add(beat.beatId);

    if (!isSafeRemotionReelSourceFile(beat.sourceFile) || !sourceFiles.has(beat.sourceFile)) {
      throw new Error(`beat ${beat.beatId}: sourceFile must be a declared .ts/.tsx file below ki/src/reels/`);
    }
    if (!beat.capabilities.includes(beat.primaryCapability)) {
      throw new Error(`beat ${beat.beatId}: capabilities must include primaryCapability ${beat.primaryCapability}`);
    }
    if (beat.rationale.trim().length < 20) {
      throw new Error(`beat ${beat.beatId}: explain why the selected Remotion mechanism is the best visual explanation`);
    }
    if (beat.primaryPrimitive === 'card' && !beat.semanticCardReason?.trim()) {
      throw new Error(`beat ${beat.beatId}: card is forbidden as an abstract default; document the semantic UI/document/data role`);
    }
    if (advanced.has(beat.primaryCapability)) advancedBeats += 1;
    if (beat.isHero) heroBeats += 1;
    if (beat.isHook && !advanced.has(beat.primaryCapability)) {
      throw new Error(`beat ${beat.beatId}: hook must use a meaningfully expressive Remotion capability, not plain React/CSS alone`);
    }
  }

  if (heroBeats < 1) throw new Error('Remotion capability plan needs at least one hero/memorable beat');
  if (advancedBeats / plan.beats.length < 0.5) {
    throw new Error('at least 50% of beats must use an advanced Remotion capability as the primary mechanism');
  }

  const uniquePrimary = new Set(plan.beats.map((beat) => beat.primaryCapability)).size;
  if (uniquePrimary < Math.min(3, plan.beats.length)) {
    throw new Error('use at least three different primary Remotion capabilities across the reel');
  }

  for (let index = 2; index < plan.beats.length; index += 1) {
    const a = plan.beats[index - 2];
    const b = plan.beats[index - 1];
    const c = plan.beats[index];
    if (
      a.primaryCapability === b.primaryCapability &&
      b.primaryCapability === c.primaryCapability &&
      !b.continuationOfPrevious &&
      !c.continuationOfPrevious
    ) {
      throw new Error(`beats ${a.beatId}, ${b.beatId}, ${c.beatId}: same primary capability repeated three times without a continuous-process reason`);
    }
  }
};
