import React from 'react';
import {Composition, Folder} from 'remotion';
import {
  CONTEXT_OVERLOAD_COMPOSITION_ID,
  CONTEXT_OVERLOAD_DURATION_IN_FRAMES,
  CONTEXT_OVERLOAD_FPS,
  CONTEXT_OVERLOAD_HEIGHT,
  CONTEXT_OVERLOAD_WIDTH,
  ReelContextOverload,
} from './reels/antigravity-context-overload';
import {
  HALLUCINATION_COMPOSITION_ID,
  HALLUCINATION_DURATION_IN_FRAMES,
  HALLUCINATION_FPS,
  HALLUCINATION_HEIGHT,
  HALLUCINATION_WIDTH,
  ReelHallucinations,
} from './reels/ai-hallucinations';
import {
  AMBIGUOUS_PROMPTS_COMPOSITION_ID,
  AMBIGUOUS_PROMPTS_DURATION_IN_FRAMES,
  AMBIGUOUS_PROMPTS_FPS,
  AMBIGUOUS_PROMPTS_HEIGHT,
  AMBIGUOUS_PROMPTS_WIDTH,
  ReelAmbiguousPrompts,
} from './reels/ambiguous-prompts';
import {
  SEMANTIC_EMBEDDINGS_COMPOSITION_ID,
  SEMANTIC_EMBEDDINGS_DURATION_IN_FRAMES,
  SEMANTIC_EMBEDDINGS_FPS,
  SEMANTIC_EMBEDDINGS_HEIGHT,
  SEMANTIC_EMBEDDINGS_WIDTH,
  ReelSemanticEmbeddings,
} from './reels/semantic-embeddings';
import {
  AI_AGENTS_COMPOSITION_ID,
  AI_AGENTS_DURATION_IN_FRAMES,
  AI_AGENTS_FPS,
  AI_AGENTS_HEIGHT,
  AI_AGENTS_WIDTH,
  ReelAIAgents,
} from './reels/ai-agents';
import {
  AI_APP_COMPOSITION_ID,
  AI_APP_DURATION_IN_FRAMES,
  AI_APP_FPS,
  AI_APP_HEIGHT,
  AI_APP_WIDTH,
  ReelAIAppPrototype,
} from './reels/ai-app-prototype';
import {
  AI_PRODUCT_AD_COMPOSITION_ID,
  AI_PRODUCT_AD_DURATION_IN_FRAMES,
  AI_PRODUCT_AD_FPS,
  AI_PRODUCT_AD_HEIGHT,
  AI_PRODUCT_AD_WIDTH,
  ReelAIProductAd,
} from './reels/ai-product-ad';
import {
  WHY_AI_COMPOSITION_ID,
  WHY_AI_DURATION_IN_FRAMES,
  WHY_AI_FPS,
  WHY_AI_HEIGHT,
  WHY_AI_WIDTH,
  ReelWhyAIReadsDifferently,
} from './reels/why-ai-reads-differently';
import {
  AI_SKETCH_WEBSITE_COMPOSITION_ID,
  AI_SKETCH_WEBSITE_DURATION_IN_FRAMES,
  AI_SKETCH_WEBSITE_FPS,
  AI_SKETCH_WEBSITE_HEIGHT,
  AI_SKETCH_WEBSITE_WIDTH,
  ReelAISketchWebsite,
} from './reels/ai-sketch-website';
import {
  GITHUB_REPOSITORY_COMPOSITION_ID,
  GITHUB_REPOSITORY_DURATION_IN_FRAMES,
  GITHUB_REPOSITORY_FPS,
  GITHUB_REPOSITORY_HEIGHT,
  GITHUB_REPOSITORY_WIDTH,
  ReelGitHubRepository,
} from './reels/github-repository-basics';
import {
  AI_APP_WORKFLOW_COMPOSITION_ID,
  AI_APP_WORKFLOW_DURATION_IN_FRAMES,
  AI_APP_WORKFLOW_FPS,
  AI_APP_WORKFLOW_HEIGHT,
  AI_APP_WORKFLOW_THUMBNAIL_ID,
  AI_APP_WORKFLOW_WIDTH,
  LongformAIAppWorkflow,
  ThumbnailAIAppWorkflow,
} from './longform/ai-app-workflow';

export const ProductionRoot: React.FC = () => (
  <>
    <Folder name="KI-Production-Reels">
      <Composition id={CONTEXT_OVERLOAD_COMPOSITION_ID} component={ReelContextOverload} defaultProps={{showCaptions: true, showDebugTimeline: false}} durationInFrames={CONTEXT_OVERLOAD_DURATION_IN_FRAMES} fps={CONTEXT_OVERLOAD_FPS} width={CONTEXT_OVERLOAD_WIDTH} height={CONTEXT_OVERLOAD_HEIGHT}/>
      <Composition id={HALLUCINATION_COMPOSITION_ID} component={ReelHallucinations} defaultProps={{showCaptions: true}} durationInFrames={HALLUCINATION_DURATION_IN_FRAMES} fps={HALLUCINATION_FPS} width={HALLUCINATION_WIDTH} height={HALLUCINATION_HEIGHT}/>
      <Composition id={AMBIGUOUS_PROMPTS_COMPOSITION_ID} component={ReelAmbiguousPrompts} defaultProps={{showCaptions: true}} durationInFrames={AMBIGUOUS_PROMPTS_DURATION_IN_FRAMES} fps={AMBIGUOUS_PROMPTS_FPS} width={AMBIGUOUS_PROMPTS_WIDTH} height={AMBIGUOUS_PROMPTS_HEIGHT}/>
      <Composition id={SEMANTIC_EMBEDDINGS_COMPOSITION_ID} component={ReelSemanticEmbeddings} defaultProps={{showCaptions: true}} durationInFrames={SEMANTIC_EMBEDDINGS_DURATION_IN_FRAMES} fps={SEMANTIC_EMBEDDINGS_FPS} width={SEMANTIC_EMBEDDINGS_WIDTH} height={SEMANTIC_EMBEDDINGS_HEIGHT}/>
      <Composition id={AI_AGENTS_COMPOSITION_ID} component={ReelAIAgents} defaultProps={{showCaptions: true}} durationInFrames={AI_AGENTS_DURATION_IN_FRAMES} fps={AI_AGENTS_FPS} width={AI_AGENTS_WIDTH} height={AI_AGENTS_HEIGHT}/>
      <Composition id={AI_APP_COMPOSITION_ID} component={ReelAIAppPrototype} defaultProps={{showCaptions: true}} durationInFrames={AI_APP_DURATION_IN_FRAMES} fps={AI_APP_FPS} width={AI_APP_WIDTH} height={AI_APP_HEIGHT}/>
      <Composition id={AI_PRODUCT_AD_COMPOSITION_ID} component={ReelAIProductAd} defaultProps={{showCaptions: true}} durationInFrames={AI_PRODUCT_AD_DURATION_IN_FRAMES} fps={AI_PRODUCT_AD_FPS} width={AI_PRODUCT_AD_WIDTH} height={AI_PRODUCT_AD_HEIGHT}/>
      <Composition id={WHY_AI_COMPOSITION_ID} component={ReelWhyAIReadsDifferently} defaultProps={{}} durationInFrames={WHY_AI_DURATION_IN_FRAMES} fps={WHY_AI_FPS} width={WHY_AI_WIDTH} height={WHY_AI_HEIGHT}/>
      <Composition id={AI_SKETCH_WEBSITE_COMPOSITION_ID} component={ReelAISketchWebsite} defaultProps={{showCaptions: true}} durationInFrames={AI_SKETCH_WEBSITE_DURATION_IN_FRAMES} fps={AI_SKETCH_WEBSITE_FPS} width={AI_SKETCH_WEBSITE_WIDTH} height={AI_SKETCH_WEBSITE_HEIGHT}/>
      <Composition id={GITHUB_REPOSITORY_COMPOSITION_ID} component={ReelGitHubRepository} defaultProps={{showCaptions: true}} durationInFrames={GITHUB_REPOSITORY_DURATION_IN_FRAMES} fps={GITHUB_REPOSITORY_FPS} width={GITHUB_REPOSITORY_WIDTH} height={GITHUB_REPOSITORY_HEIGHT}/>
    </Folder>
    <Folder name="KI-YouTube-Longform">
      <Composition id={AI_APP_WORKFLOW_COMPOSITION_ID} component={LongformAIAppWorkflow} defaultProps={{}} durationInFrames={AI_APP_WORKFLOW_DURATION_IN_FRAMES} fps={AI_APP_WORKFLOW_FPS} width={AI_APP_WORKFLOW_WIDTH} height={AI_APP_WORKFLOW_HEIGHT}/>
      <Composition id={AI_APP_WORKFLOW_THUMBNAIL_ID} component={ThumbnailAIAppWorkflow} defaultProps={{}} durationInFrames={1} fps={AI_APP_WORKFLOW_FPS} width={AI_APP_WORKFLOW_WIDTH} height={AI_APP_WORKFLOW_HEIGHT}/>
    </Folder>
  </>
);
