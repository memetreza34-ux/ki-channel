import React from 'react';
import {Composition, Folder} from 'remotion';
import {ThreeDemo} from '@studio/core/three';
import {BRAND} from '../brand/brand';
import {MotionPreviewRoot} from './motion-system/MotionPreviewRoot';
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
  AI_BUG_FIX_COMPOSITION_ID,
  AI_BUG_FIX_DURATION_IN_FRAMES,
  AI_BUG_FIX_FPS,
  AI_BUG_FIX_HEIGHT,
  AI_BUG_FIX_WIDTH,
  ReelAIBugFix,
} from './reels/ai-bug-fix';

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="KI-Production-Reels">
      <Composition id={CONTEXT_OVERLOAD_COMPOSITION_ID} component={ReelContextOverload} defaultProps={{showCaptions: true, showDebugTimeline: false}} durationInFrames={CONTEXT_OVERLOAD_DURATION_IN_FRAMES} fps={CONTEXT_OVERLOAD_FPS} width={CONTEXT_OVERLOAD_WIDTH} height={CONTEXT_OVERLOAD_HEIGHT}/>
      <Composition id={HALLUCINATION_COMPOSITION_ID} component={ReelHallucinations} defaultProps={{showCaptions: true}} durationInFrames={HALLUCINATION_DURATION_IN_FRAMES} fps={HALLUCINATION_FPS} width={HALLUCINATION_WIDTH} height={HALLUCINATION_HEIGHT}/>
      <Composition id={AMBIGUOUS_PROMPTS_COMPOSITION_ID} component={ReelAmbiguousPrompts} defaultProps={{showCaptions: true}} durationInFrames={AMBIGUOUS_PROMPTS_DURATION_IN_FRAMES} fps={AMBIGUOUS_PROMPTS_FPS} width={AMBIGUOUS_PROMPTS_WIDTH} height={AMBIGUOUS_PROMPTS_HEIGHT}/>
      <Composition id={AI_AGENTS_COMPOSITION_ID} component={ReelAIAgents} defaultProps={{showCaptions: true}} durationInFrames={AI_AGENTS_DURATION_IN_FRAMES} fps={AI_AGENTS_FPS} width={AI_AGENTS_WIDTH} height={AI_AGENTS_HEIGHT}/>
      <Composition id={AI_APP_COMPOSITION_ID} component={ReelAIAppPrototype} defaultProps={{showCaptions: true}} durationInFrames={AI_APP_DURATION_IN_FRAMES} fps={AI_APP_FPS} width={AI_APP_WIDTH} height={AI_APP_HEIGHT}/>
      <Composition id={AI_PRODUCT_AD_COMPOSITION_ID} component={ReelAIProductAd} defaultProps={{showCaptions: true}} durationInFrames={AI_PRODUCT_AD_DURATION_IN_FRAMES} fps={AI_PRODUCT_AD_FPS} width={AI_PRODUCT_AD_WIDTH} height={AI_PRODUCT_AD_HEIGHT}/>
      <Composition id={AI_BUG_FIX_COMPOSITION_ID} component={ReelAIBugFix} defaultProps={{showCaptions: true}} durationInFrames={AI_BUG_FIX_DURATION_IN_FRAMES} fps={AI_BUG_FIX_FPS} width={AI_BUG_FIX_WIDTH} height={AI_BUG_FIX_HEIGHT}/>
    </Folder>

    <Composition id="Three3D" component={ThreeDemo as React.FC} defaultProps={{color: BRAND.accent}} durationInFrames={150} fps={30} width={1920} height={1080}/>
    <MotionPreviewRoot />
  </>
);
