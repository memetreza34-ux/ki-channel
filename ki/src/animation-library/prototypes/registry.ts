import type {ComponentType} from 'react';
import {z} from 'zod';
import rawRenderConfig from '../prototype-render-config.json';
import {getAnimationLibraryEntry} from '../catalog';
import {BudgetLeakMeterPrototype} from './BudgetLeakMeterPrototype';
import {ContextWindowTrainPrototype} from './ContextWindowTrainPrototype';
import {DecisionTreeBurstPrototype} from './DecisionTreeBurstPrototype';
import {HumanAIRelayPrototype} from './HumanAIRelayPrototype';
import {KnowledgeMagnetPrototype} from './KnowledgeMagnetPrototype';
import {KnowledgeTreeGraftPrototype} from './KnowledgeTreeGraftPrototype';

const renderConfigSchema = z.object({
  version: z.literal(1),
  entryPoint: z.string().min(3),
  outputDir: z.string().min(3),
  defaults: z.object({
    durationInFrames: z.number().int().positive(),
    fps: z.number().int().min(24).max(60),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    checkpoints: z.array(z.number().int().nonnegative()).min(1),
    smokeCheckpoints: z.array(z.number().int().nonnegative()).min(1),
  }),
  prototypes: z.array(z.object({
    compositionId: z.string().min(3),
    animationId: z.string().min(3),
  })).min(1),
});

export const ANIMATION_PROTOTYPE_RENDER_CONFIG = renderConfigSchema.parse(
  rawRenderConfig,
);

export type AnimationPrototypeRegistration = {
  compositionId: string;
  animationId: string;
  component: ComponentType;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  checkpoints: number[];
};

const COMPONENTS: Record<string, ComponentType> = {
  'retrieval-search-knowledge-magnet-v1': KnowledgeMagnetPrototype,
  'cost-efficiency-budget-leak-meter-v1': BudgetLeakMeterPrototype,
  'context-window-context-window-train-v1': ContextWindowTrainPrototype,
  'decision-logic-decision-tree-burst-v1': DecisionTreeBurstPrototype,
  'human-ai-collaboration-human-ai-relay-v1': HumanAIRelayPrototype,
  'learning-update-knowledge-tree-graft-v1': KnowledgeTreeGraftPrototype,
};

export const ANIMATION_PROTOTYPE_REGISTRY: AnimationPrototypeRegistration[] =
  ANIMATION_PROTOTYPE_RENDER_CONFIG.prototypes.map((prototype) => {
    const component = COMPONENTS[prototype.animationId];
    if (!component) {
      throw new Error(
        `missing prototype component for ${prototype.animationId}`,
      );
    }
    if (!getAnimationLibraryEntry(prototype.animationId)) {
      throw new Error(
        `prototype animation is absent from catalog: ${prototype.animationId}`,
      );
    }

    return {
      ...prototype,
      component,
      durationInFrames:
        ANIMATION_PROTOTYPE_RENDER_CONFIG.defaults.durationInFrames,
      fps: ANIMATION_PROTOTYPE_RENDER_CONFIG.defaults.fps,
      width: ANIMATION_PROTOTYPE_RENDER_CONFIG.defaults.width,
      height: ANIMATION_PROTOTYPE_RENDER_CONFIG.defaults.height,
      checkpoints: [
        ...ANIMATION_PROTOTYPE_RENDER_CONFIG.defaults.checkpoints,
      ],
    };
  });
