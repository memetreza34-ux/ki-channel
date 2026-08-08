import {EXECUTABLE_ANIMATION_MANIFEST_IDS} from './executableAnimationManifest';
import rawPrototypeRenderConfig from './prototype-render-config.json';
import {NATIVE_CONTENT_BOUND_PROTOTYPE_IDS} from './prototypeContentCoverage';
import {PROTOTYPE_RUNTIME_CONTENT_DERIVER_IDS} from './prototypeRuntimeContentDeriver';
import type {AnimationLibraryEntry} from './schema';

const executableIds = new Set(EXECUTABLE_ANIMATION_MANIFEST_IDS);
const contentRenderIds = new Set(
  rawPrototypeRenderConfig.prototypes.map((prototype) => prototype.animationId),
);
const contentDeriverIds = new Set(PROTOTYPE_RUNTIME_CONTENT_DERIVER_IDS);

export const CONTENT_RENDERABLE_ANIMATION_IDS = Object.freeze(
  [...contentRenderIds].sort(),
);

export const CONTENT_DERIVER_ANIMATION_IDS = Object.freeze(
  [...contentDeriverIds].sort(),
);

export const PRODUCTION_READY_LIBRARY_ANIMATION_IDS = Object.freeze(
  [...NATIVE_CONTENT_BOUND_PROTOTYPE_IDS]
    .filter(
      (animationId) =>
        executableIds.has(animationId) &&
        contentRenderIds.has(animationId) &&
        contentDeriverIds.has(animationId),
    )
    .sort(),
);

const productionReadyIds = new Set(PRODUCTION_READY_LIBRARY_ANIMATION_IDS);

export type ProductionRuntimeSceneLike = {
  animationId: string;
  source: 'library' | 'new-build';
  catalogEntry: Pick<AnimationLibraryEntry, 'status'>;
};

const isReusableLibraryStatus = (
  status: AnimationLibraryEntry['status'],
): boolean => status === 'prototype' || status === 'verified';

export const isProductionReadyLibraryAnimation = (
  animationId: string,
): boolean => productionReadyIds.has(animationId);

export const isProductionReadyLibraryEntry = (
  entry: AnimationLibraryEntry,
): boolean =>
  productionReadyIds.has(entry.animationId) &&
  isReusableLibraryStatus(entry.status);

export const getProductionReadyLibraryEntries = (
  entries: readonly AnimationLibraryEntry[],
): AnimationLibraryEntry[] => entries.filter(isProductionReadyLibraryEntry);

export const isProductionRuntimeSceneReady = (
  scene: ProductionRuntimeSceneLike,
): boolean => {
  if (!isProductionReadyLibraryAnimation(scene.animationId)) return false;
  if (scene.source === 'library') {
    return isReusableLibraryStatus(scene.catalogEntry.status);
  }
  // A historical new-build can still carry its old `concept` snapshot while the
  // exact animation ID has already been implemented and registered in the current
  // runtime. It may proceed to its first release review, but a retired build never can.
  return scene.catalogEntry.status !== 'retired';
};

export const areProductionRuntimeScenesReady = (
  scenes: readonly ProductionRuntimeSceneLike[],
): boolean => scenes.every(isProductionRuntimeSceneReady);
