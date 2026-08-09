import type {ComponentType} from 'react';
import {enhanceSceneMeaning} from '../../animation-library/extendedMeaningContract';
import {associatePrototypeRuntimeContent} from '../../animation-library/prototypeRuntimeContentAssociation';
import {derivePrototypeRuntimeContent} from '../../animation-library/prototypeRuntimeContentDeriver';
import {createPrototypeRenderProps} from '../../animation-library/prototypeRenderPayload';
import {sanitizePrototypeRuntimeContent} from '../../animation-library/prototypeRuntimeContentSanitizer';
import {
  ANIMATION_PROTOTYPE_REGISTRY,
  type AnimationPrototypeRegistration,
} from '../../animation-library/prototypes/registry';
import type {PrototypeRenderProps} from '../../animation-library/prototypes/PrototypeContentContext';
import type {ContextOverloadScene} from './contract';

export type ContextOverloadSceneRuntime = {
  scene: ContextOverloadScene;
  registration: AnimationPrototypeRegistration;
  component: ComponentType<PrototypeRenderProps>;
  renderProps: PrototypeRenderProps;
};

const registrationByAnimationId = new Map(
  ANIMATION_PROTOTYPE_REGISTRY.map((registration) => [
    registration.animationId,
    registration,
  ] as const),
);

export const buildContextOverloadSceneRuntime = (
  scene: ContextOverloadScene,
): ContextOverloadSceneRuntime => {
  const registration = registrationByAnimationId.get(scene.animationId);
  if (!registration) {
    throw new Error(`missing production-ready animation: ${scene.animationId}`);
  }
  if (
    registration.durationInFrames !== 180 ||
    registration.fps !== 30 ||
    registration.width !== 1080 ||
    registration.height !== 1920
  ) {
    throw new Error(`incompatible production registration: ${scene.animationId}`);
  }

  const meaningContract = enhanceSceneMeaning(scene.spokenText);
  const derived = derivePrototypeRuntimeContent({
    animationId: scene.animationId,
    spokenText: scene.spokenText,
    meaningContract,
  });
  const sanitized = sanitizePrototypeRuntimeContent({
    animationId: scene.animationId,
    spokenText: scene.spokenText,
    derived,
  });
  const associated = associatePrototypeRuntimeContent({
    animationId: scene.animationId,
    spokenText: scene.spokenText,
    content: sanitized,
  });

  // Values remain fully grounded by the content pipeline. Only the visible copy is
  // curated per reel so animation labels explain the mechanism instead of echoing
  // the spoken sentence word-for-word.
  const labels = {
    ...associated.labels,
    ...scene.visualLabels,
  };

  const renderProps = createPrototypeRenderProps({
    spokenText: scene.spokenText,
    meaningContract,
    title: scene.headline,
    labels,
    values: associated.values,
  });

  return {
    scene,
    registration,
    component: registration.component,
    renderProps,
  };
};
