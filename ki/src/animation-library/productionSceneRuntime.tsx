import React, {type ComponentType} from 'react';
import {getAnimationLibraryEntry} from './catalog';
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

export type AuthoredNewBuildRuntime = {
  component: ComponentType<any>;
  renderProps?: Record<string, unknown>;
};

export type ProductionSceneRuntimeInput = {
  scenePlan: ProductionSceneAnimationPlan;
  spokenText: string;
  title?: string;
  labels?: Record<string, string>;
  values?: Record<string, string | number>;
  /**
   * Final NEW_BUILD scenes must provide a reel-specific authored component.
   * This keeps the generic CreativeRecipeRuntime as a planning/scaffold tool,
   * not as the silent release default for hero animation.
   */
  authoredNewBuild?: AuthoredNewBuildRuntime;
  /** Preview/testing escape hatch only. Never use this as the final hero path. */
  allowRecipeScaffold?: boolean;
};

export type LibraryAnimationRuntimeInput = {
  sceneId: string;
  animationId: string;
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
  runtimeMode: 'authored' | 'recipe-scaffold';
  sceneId: string;
  animationId: string;
  component: ComponentType<any>;
  renderProps: Record<string, unknown>;
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

export const buildLibraryAnimationRuntime = ({
  sceneId,
  animationId,
  spokenText,
  title,
  labels,
  values,
}: LibraryAnimationRuntimeInput): LibraryProductionSceneRuntime => {
  if (!spokenText.trim()) {
    throw new Error(`library production scene ${sceneId} requires spokenText`);
  }
  const registration = registrationByAnimationId.get(animationId);
  if (!registration) {
    throw new Error(
      `library production scene ${sceneId} is missing registered runtime ${animationId}`,
    );
  }
  const catalogEntry = getAnimationLibraryEntry(animationId);
  if (!catalogEntry) {
    throw new Error(
      `library production scene ${sceneId} is missing catalog entry ${animationId}`,
    );
  }

  const meaningContract = enhanceSceneMeaning(spokenText);
  const derived = derivePrototypeRuntimeContent({
    animationId,
    spokenText,
    meaningContract,
  });
  const sanitized = sanitizePrototypeRuntimeContent({
    animationId,
    spokenText,
    derived,
  });
  const associated = associatePrototypeRuntimeContent({
    animationId,
    spokenText,
    content: sanitized,
  });
  const renderProps = createPrototypeRenderProps({
    spokenText,
    meaningContract,
    title: title?.trim() || catalogEntry.title,
    labels: {...associated.labels, ...labels},
    values: {...associated.values, ...values},
  });

  return {
    source: 'library',
    sceneId,
    animationId,
    registration,
    component: registration.component,
    renderProps,
  };
};

const buildLibraryRuntime = ({
  scenePlan,
  spokenText,
  title,
  labels,
  values,
}: ProductionSceneRuntimeInput): LibraryProductionSceneRuntime => {
  if (scenePlan.buildSpec !== null) {
    throw new Error(
      `library production scene ${scenePlan.sceneId} must not carry a new-build specification`,
    );
  }
  return buildLibraryAnimationRuntime({
    sceneId: scenePlan.sceneId,
    animationId: scenePlan.animationId,
    spokenText,
    title,
    labels,
    values,
  });
};

const buildNewBuildRuntime = ({
  scenePlan,
  authoredNewBuild,
  allowRecipeScaffold = false,
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

  if (authoredNewBuild) {
    return {
      source: 'new-build',
      runtimeMode: 'authored',
      sceneId: scenePlan.sceneId,
      animationId: scenePlan.animationId,
      component: authoredNewBuild.component,
      renderProps: authoredNewBuild.renderProps ?? {},
    };
  }

  if (!allowRecipeScaffold) {
    throw new Error(
      `new-build production scene ${scenePlan.sceneId} requires authoredNewBuild for final production. ` +
      'CreativeRecipeRuntime is scaffold-only; pass allowRecipeScaffold=true only for preview/testing.',
    );
  }

  return {
    source: 'new-build',
    runtimeMode: 'recipe-scaffold',
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
