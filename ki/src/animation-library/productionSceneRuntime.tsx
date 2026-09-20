import React, {type ComponentType} from 'react';
import {CreativeRecipeRuntime} from './creativeRecipeRuntime';
import {enhanceSceneMeaning} from './extendedMeaningContract';
import {associatePrototypeRuntimeContent} from './prototypeRuntimeContentAssociation';
import {derivePrototypeRuntimeContent} from './prototypeRuntimeContentDeriver';
import {createPrototypeRenderProps} from './prototypeRenderPayload';
import {sanitizePrototypeRuntimeContent} from './prototypeRuntimeContentSanitizer';
import type {ProductionSceneAnimationPlan} from './productionPlanner';
import {
  ANIMATION_PROTOTYPE_REGISTRY,
  type AnimationPrototypeRegistration,
} from './prototypes/registry';
import type {PrototypeRenderProps} from './prototypes/PrototypeContentContext';

export type ProductionSceneRuntimeInput = {
  scenePlan: ProductionSceneAnimationPlan;
  spokenText: string;
  title?: string;
  labels?: Record<string, string>;
  values?: Record<string, string | number>;
};

export type LibraryProductionSceneRuntime = {
  source: 'library';
  sceneId: string;
  animationId: string;
  registration: AnimationPrototypeRegistration;
  component: ComponentType<PrototypeRenderProps>;
  renderProps: PrototypeRenderProps;
};

export type NewBuildProductionSceneRuntime = {
  source: 'new-build';
  sceneId: string;
  animationId: string;
  component: typeof CreativeRecipeRuntime;
  renderProps: React.ComponentProps<typeof CreativeRecipeRuntime>;
};

export type ProductionSceneRuntime =
  | LibraryProductionSceneRuntime
  | NewBuildProductionSceneRuntime;

const registrationByAnimationId = new Map(
  ANIMATION_PROTOTYPE_REGISTRY.map((registration) => [
    registration.animationId,
    registration,
  ] as const),
);

const buildLibraryRuntime = ({
  scenePlan,
  spokenText,
  title,
  labels,
  values,
}: ProductionSceneRuntimeInput): LibraryProductionSceneRuntime => {
  const registration = registrationByAnimationId.get(scenePlan.animationId);
  if (!registration) {
    throw new Error(
      `library production scene ${scenePlan.sceneId} is missing registered runtime ${scenePlan.animationId}`,
    );
  }
  if (scenePlan.buildSpec !== null) {
    throw new Error(
      `library production scene ${scenePlan.sceneId} must not carry a new-build specification`,
    );
  }

  const meaningContract = enhanceSceneMeaning(spokenText);
  const derived = derivePrototypeRuntimeContent({
    animationId: scenePlan.animationId,
    spokenText,
    meaningContract,
  });
  const sanitized = sanitizePrototypeRuntimeContent({
    animationId: scenePlan.animationId,
    spokenText,
    derived,
  });
  const associated = associatePrototypeRuntimeContent({
    animationId: scenePlan.animationId,
    spokenText,
    content: sanitized,
  });
  const renderProps = createPrototypeRenderProps({
    spokenText,
    meaningContract,
    title: title?.trim() || scenePlan.catalogEntry.title,
    labels: {...associated.labels, ...labels},
    values: {...associated.values, ...values},
  });

  return {
    source: 'library',
    sceneId: scenePlan.sceneId,
    animationId: scenePlan.animationId,
    registration,
    component: registration.component,
    renderProps,
  };
};

const buildNewBuildRuntime = ({
  scenePlan,
}: ProductionSceneRuntimeInput): NewBuildProductionSceneRuntime => {
  if (!scenePlan.buildSpec) {
    throw new Error(
      `new-build production scene ${scenePlan.sceneId} is missing its build specification`,
    );
  }
  if (scenePlan.buildSpec.animationId !== scenePlan.animationId) {
    throw new Error(
      `new-build production scene ${scenePlan.sceneId} has mismatched runtime id ${scenePlan.buildSpec.animationId}`,
    );
  }

  return {
    source: 'new-build',
    sceneId: scenePlan.sceneId,
    animationId: scenePlan.animationId,
    component: CreativeRecipeRuntime,
    renderProps: {
      spec: scenePlan.buildSpec,
      showRecipeLabel: false,
    },
  };
};

export const buildProductionSceneRuntime = (
  input: ProductionSceneRuntimeInput,
): ProductionSceneRuntime => {
  if (!input.spokenText.trim()) {
    throw new Error(`production scene ${input.scenePlan.sceneId} requires spokenText`);
  }
  return input.scenePlan.source === 'library'
    ? buildLibraryRuntime(input)
    : buildNewBuildRuntime(input);
};

export const ProductionSceneRuntimeRenderer: React.FC<
  ProductionSceneRuntimeInput
> = (input) => {
  const runtime = buildProductionSceneRuntime(input);
  if (runtime.source === 'library') {
    const LibraryComponent = runtime.component;
    return <LibraryComponent {...runtime.renderProps} />;
  }
  const NewBuildComponent = runtime.component;
  return <NewBuildComponent {...runtime.renderProps} />;
};