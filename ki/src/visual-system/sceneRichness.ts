export type SceneRichnessEntry = {
  sceneId: string;
  heroObjects: number;
  supportElements: number;
  brandAnchors: number;
  meaningfulStateChanges: number;
  microBeats: number;
  depthLayers: number;
  cameraMotion: 'locked' | 'push' | 'pull' | 'pan' | 'parallax' | 'orbit' | 'depth';
  visualMechanisms: readonly string[];
  intentionalWhitespace: boolean;
};

export type SceneRichnessOptions = {
  requireBrandAnchorInHook?: boolean;
  minBrandCoverageRatio?: number;
  minAverageSupportElements?: number;
  minAverageMicroBeats?: number;
};

const average = (values: readonly number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);

export const assertSceneRichness = (
  scenes: readonly SceneRichnessEntry[],
  options: SceneRichnessOptions = {},
): void => {
  if (scenes.length === 0) {
    throw new Error('scene richness manifest must contain scenes');
  }

  const {
    requireBrandAnchorInHook = false,
    minBrandCoverageRatio = 0,
    minAverageSupportElements = 3,
    minAverageMicroBeats = 2.5,
  } = options;

  const seen = new Set<string>();
  for (const scene of scenes) {
    if (seen.has(scene.sceneId)) {
      throw new Error(`duplicate scene richness entry: ${scene.sceneId}`);
    }
    seen.add(scene.sceneId);

    if (scene.heroObjects < 1) {
      throw new Error(`scene ${scene.sceneId} needs at least one hero object`);
    }
    if (scene.supportElements < 2) {
      throw new Error(`scene ${scene.sceneId} needs at least two support elements`);
    }
    if (scene.meaningfulStateChanges < 2) {
      throw new Error(`scene ${scene.sceneId} needs at least two meaningful state changes`);
    }
    if (scene.microBeats < 2) {
      throw new Error(`scene ${scene.sceneId} needs at least two micro beats`);
    }
    if (scene.visualMechanisms.length < 2) {
      throw new Error(`scene ${scene.sceneId} needs at least two visual mechanisms`);
    }
    if (
      scene.cameraMotion === 'locked' &&
      scene.depthLayers === 0 &&
      scene.supportElements < 4 &&
      scene.meaningfulStateChanges < 3
    ) {
      throw new Error(`scene ${scene.sceneId} is too flat: locked camera, no depth and too little visual activity`);
    }
  }

  if (requireBrandAnchorInHook && scenes[0].brandAnchors < 1) {
    throw new Error('hook scene requires a visible brand anchor');
  }

  const brandCoverage = scenes.filter((scene) => scene.brandAnchors > 0).length / scenes.length;
  if (brandCoverage < minBrandCoverageRatio) {
    throw new Error(
      `brand anchor coverage ${brandCoverage.toFixed(2)} is below required ${minBrandCoverageRatio.toFixed(2)}`,
    );
  }

  const supportAverage = average(scenes.map((scene) => scene.supportElements));
  if (supportAverage < minAverageSupportElements) {
    throw new Error(
      `average support element count ${supportAverage.toFixed(2)} is below required ${minAverageSupportElements.toFixed(2)}`,
    );
  }

  const microBeatAverage = average(scenes.map((scene) => scene.microBeats));
  if (microBeatAverage < minAverageMicroBeats) {
    throw new Error(
      `average micro beat count ${microBeatAverage.toFixed(2)} is below required ${minAverageMicroBeats.toFixed(2)}`,
    );
  }

  let lockedRun = 0;
  for (const scene of scenes) {
    lockedRun = scene.cameraMotion === 'locked' ? lockedRun + 1 : 0;
    if (lockedRun > 2) {
      throw new Error('more than two locked-camera scenes in a row');
    }
  }
};
