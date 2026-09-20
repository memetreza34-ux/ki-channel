import React from 'react';
import {Composition, Folder} from 'remotion';
import {
  CREATIVE_RECIPE_IDS,
  type CreativeRecipeId,
} from './creativeRecipeCatalog';
import {CreativeRecipeRuntime} from './creativeRecipeRuntime';
import type {AnimationBuildSpec} from './proposalCompiler';

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1100;
const DURATION = 180;

const titleByRecipe: Record<CreativeRecipeId, string> = {
  'object-morph-stage': 'Object Morph Stage',
  'path-trace-field': 'Path Trace Field',
  'network-bloom': 'Network Bloom',
  'xray-overlay': 'X-Ray Overlay',
  'typographic-construct': 'Typographic Construct',
  'cutaway-stack': 'Cutaway Stack',
  'depth-corridor': 'Depth Corridor',
  'ui-state-machine': 'UI State Machine',
};

const directionByRecipe: Record<CreativeRecipeId, AnimationBuildSpec['primaryDirection']> = {
  'object-morph-stage': 'center-out',
  'path-trace-field': 'left-to-right',
  'network-bloom': 'center-out',
  'xray-overlay': 'outside-in',
  'typographic-construct': 'mixed',
  'cutaway-stack': 'depth-forward',
  'depth-corridor': 'depth-forward',
  'ui-state-machine': 'left-to-right',
};

const specForRecipe = (recipeId: CreativeRecipeId): AnimationBuildSpec => ({
  proposalId: `gallery-${recipeId}`,
  animationId: `creative-recipe-gallery-${recipeId}-v1`,
  title: titleByRecipe[recipeId],
  visualFamily: 'creative-recipe-gallery',
  layoutFamily: `gallery-${recipeId}`,
  motionSignature: `gallery-${recipeId}-runtime`,
  noveltyGroup: `gallery-${recipeId}`,
  creativeRecipeId: recipeId,
  runtimeMechanisms: [],
  semanticTags: ['idee', 'verarbeiten', 'ergebnis'],
  explanationPatterns: ['visible-transformation'],
  primitiveTags: ['semantic-object', 'cause-path', 'result-state'],
  transitionInTags: ['hard-cut'],
  transitionOutTags: ['result-hold'],
  cameraStyle: 'recipe-runtime-camera',
  primaryDirection: directionByRecipe[recipeId],
  energy: 'dynamic',
  density: 'balanced',
  complexity: 'medium',
  durationSeconds: {min: 4, max: 6},
  phases: [
    {
      phaseId: 'establish',
      purpose: 'Establish the starting concept.',
      startRatio: 0,
      endRatio: 0.2,
      semanticTrigger: 'Idee',
    },
    {
      phaseId: 'explain',
      purpose: 'Make the transformation visible.',
      startRatio: 0.18,
      endRatio: 0.68,
      semanticTrigger: 'verarbeiten',
    },
    {
      phaseId: 'resolve',
      purpose: 'Hold the result.',
      startRatio: 0.68,
      endRatio: 1,
      semanticTrigger: 'Ergebnis',
    },
  ],
  forbiddenLayoutFamilies: [],
  forbiddenMotionSignatures: [],
  contentContract: {
    communicationGoal: 'show-transformation',
    startState: 'Eine rohe Idee ist noch ungeordnet.',
    visibleChange: 'Die Idee wird sichtbar verarbeitet und in eine klare Form überführt.',
    endState: 'Ein verständliches Ergebnis ist klar erkennbar.',
    subjectTerms: ['Idee'],
    actionTerms: ['verarbeiten'],
    resultTerms: ['Ergebnis'],
    requiredVisualCues: ['sichtbarer Startzustand', 'sichtbare Veränderung', 'klarer Endzustand'],
    forbiddenVisualCues: ['generische Karten ohne Bedeutungswechsel'],
    preferredVisualFamilies: ['data-transformation'],
    preferredExplanationPatterns: ['visible-transformation'],
  },
  implementationRules: [
    'Gallery fixture only; preserve recipe grammar and deterministic frame timing.',
  ],
});

const RecipeGalleryComposition: React.FC<{spec: AnimationBuildSpec}> = ({spec}) => (
  <CreativeRecipeRuntime spec={spec} showRecipeLabel />
);

export const CreativeRecipeGalleryRoot: React.FC = () => (
  <Folder name="Creative-Recipe-Runtime">
    {CREATIVE_RECIPE_IDS.map((recipeId) => {
      const spec = specForRecipe(recipeId);
      return (
        <Composition
          key={recipeId}
          id={`CreativeRecipe-${recipeId}`}
          component={RecipeGalleryComposition}
          defaultProps={{spec}}
          durationInFrames={DURATION}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      );
    })}
  </Folder>
);

export const CREATIVE_RECIPE_GALLERY_COMPOSITION_IDS = Object.freeze(
  CREATIVE_RECIPE_IDS.map((recipeId) => `CreativeRecipe-${recipeId}`),
);
