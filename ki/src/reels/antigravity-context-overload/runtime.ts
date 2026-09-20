import {
  buildLibraryAnimationRuntime,
  type LibraryProductionSceneRuntime,
} from '../../animation-library/productionSceneRuntime';
import type {ContextOverloadScene} from './contract';

export type ContextOverloadSceneRuntime = LibraryProductionSceneRuntime & {
  scene: ContextOverloadScene;
};

export const buildContextOverloadSceneRuntime = (
  scene: ContextOverloadScene,
): ContextOverloadSceneRuntime => {
  const runtime = buildLibraryAnimationRuntime({
    sceneId: scene.sceneId,
    animationId: scene.animationId,
    spokenText: scene.spokenText,
    title: scene.headline,
    labels: scene.visualLabels,
  });

  if (
    runtime.registration.durationInFrames !== 180 ||
    runtime.registration.fps !== 30 ||
    runtime.registration.width !== 1080 ||
    runtime.registration.height !== 1920
  ) {
    throw new Error(`incompatible production registration: ${scene.animationId}`);
  }

  return {
    ...runtime,
    scene,
  };
};
