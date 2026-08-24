import React from 'react';
import {Composition, Folder, staticFile} from 'remotion';
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
  CHATGPT_TEENS_COMPOSITION_ID,
  CHATGPT_TEENS_DURATION_IN_FRAMES,
  CHATGPT_TEENS_FPS,
  CHATGPT_TEENS_HEIGHT,
  CHATGPT_TEENS_WIDTH,
  ReelChatGPTForTeens,
} from './reels/chatgpt-for-teens';
import {
  STUDY_MODE_COMPOSITION_ID,
  STUDY_MODE_DURATION_IN_FRAMES,
  STUDY_MODE_FPS,
  STUDY_MODE_HEIGHT,
  STUDY_MODE_WIDTH,
  ReelChatGPTStudyMode,
} from './reels/chatgpt-study-mode';
import {
  DALLE_ENDS_COMPOSITION_ID,
  DALLE_ENDS_DURATION_IN_FRAMES,
  DALLE_ENDS_FPS,
  DALLE_ENDS_HEIGHT,
  DALLE_ENDS_WIDTH,
  ReelDalleGptEnds,
} from './reels/dalle-gpt-ends';
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

// Audio binaries are not imported from reel packages. Before a production render,
// `prepare-reel-audio.mjs` creates a deterministic local PCM WAV. This keeps a fresh
// checkout bundle-safe, avoids hidden render-time network downloads and avoids MP3 delay.
const runtimeAudio = (compositionId: string) => staticFile(`runtime-audio/${compositionId}.wav`);

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="KI-Production-Reels">
      <Composition id={CONTEXT_OVERLOAD_COMPOSITION_ID} component={ReelContextOverload} defaultProps={{voiceoverSrc: runtimeAudio(CONTEXT_OVERLOAD_COMPOSITION_ID), showCaptions: true, showDebugTimeline: false}} durationInFrames={CONTEXT_OVERLOAD_DURATION_IN_FRAMES} fps={CONTEXT_OVERLOAD_FPS} width={CONTEXT_OVERLOAD_WIDTH} height={CONTEXT_OVERLOAD_HEIGHT}/>
      <Composition id={HALLUCINATION_COMPOSITION_ID} component={ReelHallucinations} defaultProps={{voiceoverSrc: runtimeAudio(HALLUCINATION_COMPOSITION_ID), showCaptions: true}} durationInFrames={HALLUCINATION_DURATION_IN_FRAMES} fps={HALLUCINATION_FPS} width={HALLUCINATION_WIDTH} height={HALLUCINATION_HEIGHT}/>
      <Composition id={AMBIGUOUS_PROMPTS_COMPOSITION_ID} component={ReelAmbiguousPrompts} defaultProps={{voiceoverSrc: runtimeAudio(AMBIGUOUS_PROMPTS_COMPOSITION_ID), showCaptions: true}} durationInFrames={AMBIGUOUS_PROMPTS_DURATION_IN_FRAMES} fps={AMBIGUOUS_PROMPTS_FPS} width={AMBIGUOUS_PROMPTS_WIDTH} height={AMBIGUOUS_PROMPTS_HEIGHT}/>
      <Composition id={AI_AGENTS_COMPOSITION_ID} component={ReelAIAgents} defaultProps={{voiceoverSrc: runtimeAudio(AI_AGENTS_COMPOSITION_ID), showCaptions: true}} durationInFrames={AI_AGENTS_DURATION_IN_FRAMES} fps={AI_AGENTS_FPS} width={AI_AGENTS_WIDTH} height={AI_AGENTS_HEIGHT}/>
      <Composition id={AI_APP_COMPOSITION_ID} component={ReelAIAppPrototype} defaultProps={{voiceoverSrc: runtimeAudio(AI_APP_COMPOSITION_ID), showCaptions: true}} durationInFrames={AI_APP_DURATION_IN_FRAMES} fps={AI_APP_FPS} width={AI_APP_WIDTH} height={AI_APP_HEIGHT}/>
      <Composition id={AI_PRODUCT_AD_COMPOSITION_ID} component={ReelAIProductAd} defaultProps={{voiceoverSrc: runtimeAudio(AI_PRODUCT_AD_COMPOSITION_ID), showCaptions: true}} durationInFrames={AI_PRODUCT_AD_DURATION_IN_FRAMES} fps={AI_PRODUCT_AD_FPS} width={AI_PRODUCT_AD_WIDTH} height={AI_PRODUCT_AD_HEIGHT}/>
      <Composition id={WHY_AI_COMPOSITION_ID} component={ReelWhyAIReadsDifferently} defaultProps={{}} durationInFrames={WHY_AI_DURATION_IN_FRAMES} fps={WHY_AI_FPS} width={WHY_AI_WIDTH} height={WHY_AI_HEIGHT}/>
      <Composition id={AI_SKETCH_WEBSITE_COMPOSITION_ID} component={ReelAISketchWebsite} defaultProps={{voiceoverSrc: runtimeAudio(AI_SKETCH_WEBSITE_COMPOSITION_ID), showCaptions: true}} durationInFrames={AI_SKETCH_WEBSITE_DURATION_IN_FRAMES} fps={AI_SKETCH_WEBSITE_FPS} width={AI_SKETCH_WEBSITE_WIDTH} height={AI_SKETCH_WEBSITE_HEIGHT}/>
      <Composition id={GITHUB_REPOSITORY_COMPOSITION_ID} component={ReelGitHubRepository} defaultProps={{voiceoverSrc: runtimeAudio(GITHUB_REPOSITORY_COMPOSITION_ID), showCaptions: true}} durationInFrames={GITHUB_REPOSITORY_DURATION_IN_FRAMES} fps={GITHUB_REPOSITORY_FPS} width={GITHUB_REPOSITORY_WIDTH} height={GITHUB_REPOSITORY_HEIGHT}/>
      <Composition id={CHATGPT_TEENS_COMPOSITION_ID} component={ReelChatGPTForTeens} defaultProps={{voiceoverSrc: runtimeAudio(CHATGPT_TEENS_COMPOSITION_ID), showCaptions: true}} durationInFrames={CHATGPT_TEENS_DURATION_IN_FRAMES} fps={CHATGPT_TEENS_FPS} width={CHATGPT_TEENS_WIDTH} height={CHATGPT_TEENS_HEIGHT}/>
      <Composition id={STUDY_MODE_COMPOSITION_ID} component={ReelChatGPTStudyMode} defaultProps={{voiceoverSrc: runtimeAudio(STUDY_MODE_COMPOSITION_ID), showCaptions: true}} durationInFrames={STUDY_MODE_DURATION_IN_FRAMES} fps={STUDY_MODE_FPS} width={STUDY_MODE_WIDTH} height={STUDY_MODE_HEIGHT}/>
      <Composition id={DALLE_ENDS_COMPOSITION_ID} component={ReelDalleGptEnds} defaultProps={{voiceoverSrc: runtimeAudio(DALLE_ENDS_COMPOSITION_ID), showCaptions: true}} durationInFrames={DALLE_ENDS_DURATION_IN_FRAMES} fps={DALLE_ENDS_FPS} width={DALLE_ENDS_WIDTH} height={DALLE_ENDS_HEIGHT}/>
    </Folder>

    <Folder name="KI-YouTube-Longform">
      <Composition id={AI_APP_WORKFLOW_COMPOSITION_ID} component={LongformAIAppWorkflow} defaultProps={{}} durationInFrames={AI_APP_WORKFLOW_DURATION_IN_FRAMES} fps={AI_APP_WORKFLOW_FPS} width={AI_APP_WORKFLOW_WIDTH} height={AI_APP_WORKFLOW_HEIGHT}/>
      <Composition id={AI_APP_WORKFLOW_THUMBNAIL_ID} component={ThumbnailAIAppWorkflow} defaultProps={{}} durationInFrames={1} fps={AI_APP_WORKFLOW_FPS} width={AI_APP_WORKFLOW_WIDTH} height={AI_APP_WORKFLOW_HEIGHT}/>
    </Folder>

    <MotionPreviewRoot />
  </>
);
