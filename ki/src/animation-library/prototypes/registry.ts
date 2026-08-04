import type {ComponentType} from 'react';
import {BudgetLeakMeterPrototype} from './BudgetLeakMeterPrototype';
import {ContextWindowTrainPrototype} from './ContextWindowTrainPrototype';
import {DecisionTreeBurstPrototype} from './DecisionTreeBurstPrototype';
import {HumanAIRelayPrototype} from './HumanAIRelayPrototype';
import {KnowledgeMagnetPrototype} from './KnowledgeMagnetPrototype';
import {KnowledgeTreeGraftPrototype} from './KnowledgeTreeGraftPrototype';

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

const createRegistration = (
  registration: Omit<AnimationPrototypeRegistration, 'durationInFrames' | 'fps' | 'width' | 'height' | 'checkpoints'>,
): AnimationPrototypeRegistration => ({
  ...registration,
  durationInFrames: 180,
  fps: 30,
  width: 1080,
  height: 1920,
  checkpoints: [0, 30, 60, 90, 120, 150, 179],
});

export const ANIMATION_PROTOTYPE_REGISTRY: AnimationPrototypeRegistration[] = [
  createRegistration({
    compositionId: 'Library-Knowledge-Magnet',
    animationId: 'retrieval-search-knowledge-magnet-v1',
    component: KnowledgeMagnetPrototype,
  }),
  createRegistration({
    compositionId: 'Library-Budget-Leak-Meter',
    animationId: 'cost-efficiency-budget-leak-meter-v1',
    component: BudgetLeakMeterPrototype,
  }),
  createRegistration({
    compositionId: 'Library-Context-Window-Train',
    animationId: 'context-window-context-window-train-v1',
    component: ContextWindowTrainPrototype,
  }),
  createRegistration({
    compositionId: 'Library-Decision-Tree-Burst',
    animationId: 'decision-logic-decision-tree-burst-v1',
    component: DecisionTreeBurstPrototype,
  }),
  createRegistration({
    compositionId: 'Library-Human-AI-Relay',
    animationId: 'human-ai-collaboration-human-ai-relay-v1',
    component: HumanAIRelayPrototype,
  }),
  createRegistration({
    compositionId: 'Library-Knowledge-Tree-Graft',
    animationId: 'learning-update-knowledge-tree-graft-v1',
    component: KnowledgeTreeGraftPrototype,
  }),
];
