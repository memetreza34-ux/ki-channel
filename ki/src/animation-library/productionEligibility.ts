import {EXECUTABLE_ANIMATION_MANIFEST_IDS} from './executableAnimationManifest';
import rawPrototypeRenderConfig from './prototype-render-config.json';
import {NATIVE_CONTENT_BOUND_PROTOTYPE_IDS} from './prototypeContentCoverage';
import type {AnimationLibraryEntry} from './schema';

const executableIds = new Set(EXECUTABLE_ANIMATION_MANIFEST_IDS);
const contentRenderIds = new Set(
  rawPrototypeRenderConfig.prototypes.map((prototype) => prototype.animationId),
);

export const CONTENT_RENDERABLE_ANIMATION_IDS = Object.freeze(
  [...contentRenderIds].sort(),
);

export const PRODUCTION_READY_LIBRARY_ANIMATION_IDS = Object.freeze(
  [...NATIVE_CONTENT_BOUND_PROTOTYPE_IDS]
    .filter(
      (animationId) =>
        executableIds.has(animationId) && contentRenderIds.has(animationId),
    )
    .sort(),
);

const productionReadyIds = new Set(PRODUCTION_READY_LIBRARY_ANIMATION_IDS);

export type ProductionRuntimeSceneLike = {
  animationId: string;
  source: 'library' | 'new-build';
  catalogEntry: Pick<AnimationLibraryEntry, 'status'>;
};

export const isProductionReadyLibraryAnimation = (
  animationId: string,
): boolean => productionReadyIds.has(animationId);

export const isProductionReadyLibraryEntry = (
  entry: AnimationLibraryEntry,
): boolean =>
  productionReadyIds.has(entry.animationId) && entry.status !== 'retired';

export const getProductionReadyLibraryEntries = (
  entries: readonly AnimationLibraryEntry[],
): AnimationLibraryEntry[] => entries.filter(isProductionReadyLibraryEntry);

export const isProductionRuntimeSceneReady = (
  scene: ProductionRuntimeSceneLike,
): boolean =>
  scene.catalogEntry.status !== 'retired' &&
  isProductionReadyLibraryAnimation(scene.animationId);

export const areProductionRuntimeScenesReady = (
  scenes: readonly ProductionRuntimeSceneLike[],
): boolean => scenes.every(isProductionRuntimeSceneReady);
