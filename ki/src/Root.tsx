import React from 'react';
import {Composition, Folder, staticFile} from 'remotion';
import {MotionPreviewRoot} from './motion-system/MotionPreviewRoot';
import {CONTEXT_OVERLOAD_COMPOSITION_ID,CONTEXT_OVERLOAD_DURATION_IN_FRAMES,CONTEXT_OVERLOAD_FPS,CONTEXT_OVERLOAD_HEIGHT,CONTEXT_OVERLOAD_WIDTH,ReelContextOverload} from './reels/antigravity-context-overload';
import {HALLUCINATION_COMPOSITION_ID,HALLUCINATION_DURATION_IN_FRAMES,HALLUCINATION_FPS,HALLUCINATION_HEIGHT,HALLUCINATION_WIDTH,ReelHallucinations} from './reels/ai-hallucinations';
import {AMBIGUOUS_PROMPTS_COMPOSITION_ID,AMBIGUOUS_PROMPTS_DURATION_IN_FRAMES,AMBIGUOUS_PROMPTS_FPS,AMBIGUOUS_PROMPTS_HEIGHT,AMBIGUOUS_PROMPTS_WIDTH,ReelAmbiguousPrompts} from './reels/ambiguous-prompts';
import {AI_AGENTS_COMPOSITION_ID,AI_AGENTS_DURATION_IN_FRAMES,AI_AGENTS_FPS,AI_AGENTS_HEIGHT,AI_AGENTS_WIDTH,ReelAIAgents} from './reels/ai-agents';
import {AI_APP_COMPOSITION_ID,AI_APP_DURATION_IN_FRAMES,AI_APP_FPS,AI_APP_HEIGHT,AI_APP_WIDTH,ReelAIAppPrototype} from './reels/ai-app-prototype';
import {AI_PRODUCT_AD_COMPOSITION_ID,AI_PRODUCT_AD_DURATION_IN_FRAMES,AI_PRODUCT_AD_FPS,AI_PRODUCT_AD_HEIGHT,AI_PRODUCT_AD_WIDTH,ReelAIProductAd} from './reels/ai-product-ad';
import {WHY_AI_COMPOSITION_ID,WHY_AI_DURATION_IN_FRAMES,WHY_AI_FPS,WHY_AI_HEIGHT,WHY_AI_WIDTH,ReelWhyAIReadsDifferently} from './reels/why-ai-reads-differently';
import {AI_SKETCH_WEBSITE_COMPOSITION_ID,AI_SKETCH_WEBSITE_DURATION_IN_FRAMES,AI_SKETCH_WEBSITE_FPS,AI_SKETCH_WEBSITE_HEIGHT,AI_SKETCH_WEBSITE_WIDTH,ReelAISketchWebsite} from './reels/ai-sketch-website';
import {GITHUB_REPOSITORY_COMPOSITION_ID,GITHUB_REPOSITORY_DURATION_IN_FRAMES,GITHUB_REPOSITORY_FPS,GITHUB_REPOSITORY_HEIGHT,GITHUB_REPOSITORY_WIDTH,ReelGitHubRepository} from './reels/github-repository-basics';
import {CHATGPT_TEENS_COMPOSITION_ID,CHATGPT_TEENS_DURATION_IN_FRAMES,CHATGPT_TEENS_FPS,CHATGPT_TEENS_HEIGHT,CHATGPT_TEENS_WIDTH,ReelChatGPTForTeens} from './reels/chatgpt-for-teens';
import {STUDY_MODE_COMPOSITION_ID,STUDY_MODE_DURATION_IN_FRAMES,STUDY_MODE_FPS,STUDY_MODE_HEIGHT,STUDY_MODE_WIDTH,ReelChatGPTStudyMode} from './reels/chatgpt-study-mode';
import {GPT56_API_COMPOSITION_ID,GPT56_API_DURATION_IN_FRAMES,GPT56_API_FPS,GPT56_API_HEIGHT,GPT56_API_WIDTH,ReelGPT56APIPricesFastMode} from './reels/gpt56-api-prices-fastmode';
import {OPENAI_CURSOR_COMPOSITION_ID,OPENAI_CURSOR_DURATION_IN_FRAMES,OPENAI_CURSOR_FPS,OPENAI_CURSOR_HEIGHT,OPENAI_CURSOR_WIDTH,ReelOpenAICursorSpaceXContract} from './reels/openai-cursor-spacex-contract';
import {GEMINI_OMNI_COMPOSITION_ID,GEMINI_OMNI_DURATION_IN_FRAMES,GEMINI_OMNI_FPS,GEMINI_OMNI_HEIGHT,GEMINI_OMNI_WIDTH,ReelGeminiOmniFlowControl} from './reels/gemini-omni-flow-control';
import {GROK_X_COMPOSITION_ID,GROK_X_DURATION_IN_FRAMES,GROK_X_FPS,GROK_X_HEIGHT,GROK_X_WIDTH,ReelGrokBotXIntegration} from './reels/grok-bot-x-integration';
import {CLAUDE_51_COMPOSITION_ID,CLAUDE_51_DURATION_IN_FRAMES,CLAUDE_51_FPS,CLAUDE_51_HEIGHT,CLAUDE_51_WIDTH,ReelClaudeFableMythos51} from './reels/claude-fable-mythos-5-1';
import {WEATHER_NEXT_3_COMPOSITION_ID,WEATHER_NEXT_3_DURATION_IN_FRAMES,WEATHER_NEXT_3_FPS,WEATHER_NEXT_3_HEIGHT,WEATHER_NEXT_3_WIDTH,ReelGoogleWeatherNext3} from './reels/google-weathernext-3';
import {AI_APP_WORKFLOW_COMPOSITION_ID,AI_APP_WORKFLOW_DURATION_IN_FRAMES,AI_APP_WORKFLOW_FPS,AI_APP_WORKFLOW_HEIGHT,AI_APP_WORKFLOW_THUMBNAIL_ID,AI_APP_WORKFLOW_WIDTH,LongformAIAppWorkflow,ThumbnailAIAppWorkflow} from './longform/ai-app-workflow';
import {REMOTION_SHOWCASE_DURATION_IN_FRAMES,REMOTION_SHOWCASE_FPS,REMOTION_SHOWCASE_HEIGHT,REMOTION_SHOWCASE_ID,REMOTION_SHOWCASE_WIDTH,RemotionShowcase} from './longform/remotion-showcase-2026-09-12';

const runtimeAudio=(compositionId:string)=>staticFile(`runtime-audio/${compositionId}.wav`);

export const RemotionRoot:React.FC=()=>(
  <>
    <Folder name="KI-Production-Reels">
      <Composition id={CONTEXT_OVERLOAD_COMPOSITION_ID} component={ReelContextOverload} defaultProps={{voiceoverSrc:runtimeAudio(CONTEXT_OVERLOAD_COMPOSITION_ID),showCaptions:true,showDebugTimeline:false}} durationInFrames={CONTEXT_OVERLOAD_DURATION_IN_FRAMES} fps={CONTEXT_OVERLOAD_FPS} width={CONTEXT_OVERLOAD_WIDTH} height={CONTEXT_OVERLOAD_HEIGHT}/>
      <Composition id={HALLUCINATION_COMPOSITION_ID} component={ReelHallucinations} defaultProps={{voiceoverSrc:runtimeAudio(HALLUCINATION_COMPOSITION_ID),showCaptions:true}} durationInFrames={HALLUCINATION_DURATION_IN_FRAMES} fps={HALLUCINATION_FPS} width={HALLUCINATION_WIDTH} height={HALLUCINATION_HEIGHT}/>
      <Composition id={AMBIGUOUS_PROMPTS_COMPOSITION_ID} component={ReelAmbiguousPrompts} defaultProps={{voiceoverSrc:runtimeAudio(AMBIGUOUS_PROMPTS_COMPOSITION_ID),showCaptions:true}} durationInFrames={AMBIGUOUS_PROMPTS_DURATION_IN_FRAMES} fps={AMBIGUOUS_PROMPTS_FPS} width={AMBIGUOUS_PROMPTS_WIDTH} height={AMBIGUOUS_PROMPTS_HEIGHT}/>
      <Composition id={AI_AGENTS_COMPOSITION_ID} component={ReelAIAgents} defaultProps={{voiceoverSrc:runtimeAudio(AI_AGENTS_COMPOSITION_ID),showCaptions:true}} durationInFrames={AI_AGENTS_DURATION_IN_FRAMES} fps={AI_AGENTS_FPS} width={AI_AGENTS_WIDTH} height={AI_AGENTS_HEIGHT}/>
      <Composition id={AI_APP_COMPOSITION_ID} component={ReelAIAppPrototype} defaultProps={{voiceoverSrc:runtimeAudio(AI_APP_COMPOSITION_ID),showCaptions:true}} durationInFrames={AI_APP_DURATION_IN_FRAMES} fps={AI_APP_FPS} width={AI_APP_WIDTH} height={AI_APP_HEIGHT}/>
      <Composition id={AI_PRODUCT_AD_COMPOSITION_ID} component={ReelAIProductAd} defaultProps={{voiceoverSrc:runtimeAudio(AI_PRODUCT_AD_COMPOSITION_ID),showCaptions:true}} durationInFrames={AI_PRODUCT_AD_DURATION_IN_FRAMES} fps={AI_PRODUCT_AD_FPS} width={AI_PRODUCT_AD_WIDTH} height={AI_PRODUCT_AD_HEIGHT}/>
      <Composition id={WHY_AI_COMPOSITION_ID} component={ReelWhyAIReadsDifferently} defaultProps={{}} durationInFrames={WHY_AI_DURATION_IN_FRAMES} fps={WHY_AI_FPS} width={WHY_AI_WIDTH} height={WHY_AI_HEIGHT}/>
      <Composition id={AI_SKETCH_WEBSITE_COMPOSITION_ID} component={ReelAISketchWebsite} defaultProps={{voiceoverSrc:runtimeAudio(AI_SKETCH_WEBSITE_COMPOSITION_ID),showCaptions:true}} durationInFrames={AI_SKETCH_WEBSITE_DURATION_IN_FRAMES} fps={AI_SKETCH_WEBSITE_FPS} width={AI_SKETCH_WEBSITE_WIDTH} height={AI_SKETCH_WEBSITE_HEIGHT}/>
      <Composition id={GITHUB_REPOSITORY_COMPOSITION_ID} component={ReelGitHubRepository} defaultProps={{voiceoverSrc:runtimeAudio(GITHUB_REPOSITORY_COMPOSITION_ID),showCaptions:true}} durationInFrames={GITHUB_REPOSITORY_DURATION_IN_FRAMES} fps={GITHUB_REPOSITORY_FPS} width={GITHUB_REPOSITORY_WIDTH} height={GITHUB_REPOSITORY_HEIGHT}/>
      <Composition id={CHATGPT_TEENS_COMPOSITION_ID} component={ReelChatGPTForTeens} defaultProps={{voiceoverSrc:runtimeAudio(CHATGPT_TEENS_COMPOSITION_ID),showCaptions:true}} durationInFrames={CHATGPT_TEENS_DURATION_IN_FRAMES} fps={CHATGPT_TEENS_FPS} width={CHATGPT_TEENS_WIDTH} height={CHATGPT_TEENS_HEIGHT}/>
      <Composition id={STUDY_MODE_COMPOSITION_ID} component={ReelChatGPTStudyMode} defaultProps={{voiceoverSrc:runtimeAudio(STUDY_MODE_COMPOSITION_ID),showCaptions:true}} durationInFrames={STUDY_MODE_DURATION_IN_FRAMES} fps={STUDY_MODE_FPS} width={STUDY_MODE_WIDTH} height={STUDY_MODE_HEIGHT}/>
      <Composition id={GPT56_API_COMPOSITION_ID} component={ReelGPT56APIPricesFastMode} defaultProps={{voiceoverSrc:runtimeAudio(GPT56_API_COMPOSITION_ID),showCaptions:true,showSfx:true}} durationInFrames={GPT56_API_DURATION_IN_FRAMES} fps={GPT56_API_FPS} width={GPT56_API_WIDTH} height={GPT56_API_HEIGHT}/>
      <Composition id={OPENAI_CURSOR_COMPOSITION_ID} component={ReelOpenAICursorSpaceXContract} defaultProps={{voiceoverSrc:runtimeAudio(OPENAI_CURSOR_COMPOSITION_ID),showCaptions:true,showSfx:true}} durationInFrames={OPENAI_CURSOR_DURATION_IN_FRAMES} fps={OPENAI_CURSOR_FPS} width={OPENAI_CURSOR_WIDTH} height={OPENAI_CURSOR_HEIGHT}/>
      <Composition id={GEMINI_OMNI_COMPOSITION_ID} component={ReelGeminiOmniFlowControl} defaultProps={{voiceoverSrc:runtimeAudio(GEMINI_OMNI_COMPOSITION_ID),showCaptions:true,showSfx:true}} durationInFrames={GEMINI_OMNI_DURATION_IN_FRAMES} fps={GEMINI_OMNI_FPS} width={GEMINI_OMNI_WIDTH} height={GEMINI_OMNI_HEIGHT}/>
      <Composition id={GROK_X_COMPOSITION_ID} component={ReelGrokBotXIntegration} defaultProps={{voiceoverSrc:runtimeAudio(GROK_X_COMPOSITION_ID),showCaptions:true,showSfx:true}} durationInFrames={GROK_X_DURATION_IN_FRAMES} fps={GROK_X_FPS} width={GROK_X_WIDTH} height={GROK_X_HEIGHT}/>
      <Composition id={CLAUDE_51_COMPOSITION_ID} component={ReelClaudeFableMythos51} defaultProps={{voiceoverSrc:runtimeAudio(CLAUDE_51_COMPOSITION_ID),showCaptions:true,showSfx:true}} durationInFrames={CLAUDE_51_DURATION_IN_FRAMES} fps={CLAUDE_51_FPS} width={CLAUDE_51_WIDTH} height={CLAUDE_51_HEIGHT}/>
      <Composition id={WEATHER_NEXT_3_COMPOSITION_ID} component={ReelGoogleWeatherNext3} defaultProps={{voiceoverSrc:runtimeAudio(WEATHER_NEXT_3_COMPOSITION_ID),showCaptions:true,showSfx:true}} durationInFrames={WEATHER_NEXT_3_DURATION_IN_FRAMES} fps={WEATHER_NEXT_3_FPS} width={WEATHER_NEXT_3_WIDTH} height={WEATHER_NEXT_3_HEIGHT}/>
    </Folder>
    <Folder name="KI-YouTube-Longform">
      <Composition id={AI_APP_WORKFLOW_COMPOSITION_ID} component={LongformAIAppWorkflow} defaultProps={{}} durationInFrames={AI_APP_WORKFLOW_DURATION_IN_FRAMES} fps={AI_APP_WORKFLOW_FPS} width={AI_APP_WORKFLOW_WIDTH} height={AI_APP_WORKFLOW_HEIGHT}/>
      <Composition id={AI_APP_WORKFLOW_THUMBNAIL_ID} component={ThumbnailAIAppWorkflow} defaultProps={{}} durationInFrames={1} fps={AI_APP_WORKFLOW_FPS} width={AI_APP_WORKFLOW_WIDTH} height={AI_APP_WORKFLOW_HEIGHT}/>
    </Folder>
    <Folder name="KI-Motion-Lab">
      <Composition id={REMOTION_SHOWCASE_ID} component={RemotionShowcase} defaultProps={{}} durationInFrames={REMOTION_SHOWCASE_DURATION_IN_FRAMES} fps={REMOTION_SHOWCASE_FPS} width={REMOTION_SHOWCASE_WIDTH} height={REMOTION_SHOWCASE_HEIGHT}/>
    </Folder>
    <MotionPreviewRoot/>
  </>
);
