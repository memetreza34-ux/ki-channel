import React from 'react';
import {Composition, Folder} from 'remotion';
import {MotionPreviewRoot} from './motion-system/MotionPreviewRoot';
import voiceoverContext from '../reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/01-script-audio/voiceover.wav';
import voiceoverHallucination from '../reels/2026-08-10_bis_2026-08-16/01_Warum-KI-Dinge-erfindet/01-script-audio/voiceover.mp4';
import voiceoverAmbiguous from '../reels/2026-08-10_bis_2026-08-16/02_Warum-unklare-Prompts-die-KI-raten-lassen/01-script-audio/voiceover.mp4';
import voiceoverAgents from '../reels/2026-08-10_bis_2026-08-16/03_Warum-KI-Agenten-mehr-als-Chatbots-sind/01-script-audio/voiceover.mp4';
import voiceoverApp from '../reels/2026-08-10_bis_2026-08-16/04_So-baut-KI-aus-einer-Idee-eine-Mini-App/01-script-audio/voiceover.mp4';
import voiceoverProductAd from '../reels/2026-08-10_bis_2026-08-16/05_So-wird-aus-einem-Produktfoto-ein-KI-Werbeclip/01-script-audio/voiceover.mp4';
import voiceoverSketchWebsite from '../reels/2026-08-10_bis_2026-08-16/07_So-wird-aus-einer-Skizze-eine-Website/01-script-audio/voiceover.mp4';
import voiceoverGithubRepo from '../reels/2026-08-10_bis_2026-08-16/08_Was-ist-ein-GitHub-Repository/01-script-audio/voiceover.mp4';
import voiceoverAgentLoop from '../youtube-longform/2026-09-16/01_Wie-KI-Agenten-wirklich-arbeiten/01-script-audio/voiceover.mp3';
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
  AI_APP_WORKFLOW_COMPOSITION_ID,
  AI_APP_WORKFLOW_DURATION_IN_FRAMES,
  AI_APP_WORKFLOW_FPS,
  AI_APP_WORKFLOW_HEIGHT,
  AI_APP_WORKFLOW_THUMBNAIL_ID,
  AI_APP_WORKFLOW_WIDTH,
  LongformAIAppWorkflow,
  ThumbnailAIAppWorkflow,
} from './longform/ai-app-workflow';
import {
  AGENT_LOOP_COMPOSITION_ID,
  AGENT_LOOP_DURATION_IN_FRAMES,
  AGENT_LOOP_FPS,
  AGENT_LOOP_HEIGHT,
  AGENT_LOOP_THUMBNAIL_ID,
  AGENT_LOOP_WIDTH,
  LongformAgentLoop,
  ThumbnailAgentLoop,
} from './longform/agent-loop-explained';
import {
  BaukastenDemo,
  DEMO_DAUER,
  DEMO_FPS,
  SzeneBewegung,
  SzeneFlaechen,
  SzeneIcons,
  SzeneInteraktion,
  SzeneLoop,
} from './longform/baukasten-demo';

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="KI-Production-Reels">
      <Composition
        id={CONTEXT_OVERLOAD_COMPOSITION_ID}
        component={ReelContextOverload}
        defaultProps={{
          voiceoverSrc: voiceoverContext,
          showCaptions: true,
          showDebugTimeline: false,
        }}
        durationInFrames={CONTEXT_OVERLOAD_DURATION_IN_FRAMES}
        fps={CONTEXT_OVERLOAD_FPS}
        width={CONTEXT_OVERLOAD_WIDTH}
        height={CONTEXT_OVERLOAD_HEIGHT}
      />
      <Composition
        id={HALLUCINATION_COMPOSITION_ID}
        component={ReelHallucinations}
        defaultProps={{
          voiceoverSrc: voiceoverHallucination,
          showCaptions: true
        }}
        durationInFrames={HALLUCINATION_DURATION_IN_FRAMES}
        fps={HALLUCINATION_FPS}
        width={HALLUCINATION_WIDTH}
        height={HALLUCINATION_HEIGHT}
      />
      <Composition
        id={AMBIGUOUS_PROMPTS_COMPOSITION_ID}
        component={ReelAmbiguousPrompts}
        defaultProps={{
          voiceoverSrc: voiceoverAmbiguous,
          showCaptions: true
        }}
        durationInFrames={AMBIGUOUS_PROMPTS_DURATION_IN_FRAMES}
        fps={AMBIGUOUS_PROMPTS_FPS}
        width={AMBIGUOUS_PROMPTS_WIDTH}
        height={AMBIGUOUS_PROMPTS_HEIGHT}
      />
      <Composition
        id={AI_AGENTS_COMPOSITION_ID}
        component={ReelAIAgents}
        defaultProps={{
          voiceoverSrc: voiceoverAgents,
          showCaptions: true
        }}
        durationInFrames={AI_AGENTS_DURATION_IN_FRAMES}
        fps={AI_AGENTS_FPS}
        width={AI_AGENTS_WIDTH}
        height={AI_AGENTS_HEIGHT}
      />
      <Composition
        id={AI_APP_COMPOSITION_ID}
        component={ReelAIAppPrototype}
        defaultProps={{
          voiceoverSrc: voiceoverApp,
          showCaptions: true
        }}
        durationInFrames={AI_APP_DURATION_IN_FRAMES}
        fps={AI_APP_FPS}
        width={AI_APP_WIDTH}
        height={AI_APP_HEIGHT}
      />
      <Composition 
        id={AI_PRODUCT_AD_COMPOSITION_ID} 
        component={ReelAIProductAd} 
        defaultProps={{
          voiceoverSrc: voiceoverProductAd,
          showCaptions: true
        }} 
        durationInFrames={AI_PRODUCT_AD_DURATION_IN_FRAMES} 
        fps={AI_PRODUCT_AD_FPS} 
        width={AI_PRODUCT_AD_WIDTH} 
        height={AI_PRODUCT_AD_HEIGHT}
      />
      <Composition
        id={WHY_AI_COMPOSITION_ID}
        component={ReelWhyAIReadsDifferently}
        defaultProps={{}}
        durationInFrames={WHY_AI_DURATION_IN_FRAMES}
        fps={WHY_AI_FPS}
        width={WHY_AI_WIDTH}
        height={WHY_AI_HEIGHT}
      />
      <Composition 
        id={AI_SKETCH_WEBSITE_COMPOSITION_ID} 
        component={ReelAISketchWebsite} 
        defaultProps={{
          voiceoverSrc: voiceoverSketchWebsite,
          showCaptions: true
        }} 
        durationInFrames={AI_SKETCH_WEBSITE_DURATION_IN_FRAMES} 
        fps={AI_SKETCH_WEBSITE_FPS} 
        width={AI_SKETCH_WEBSITE_WIDTH} 
        height={AI_SKETCH_WEBSITE_HEIGHT}
      />
      <Composition 
        id={GITHUB_REPOSITORY_COMPOSITION_ID} 
        component={ReelGitHubRepository} 
        defaultProps={{
          voiceoverSrc: voiceoverGithubRepo,
          showCaptions: true
        }} 
        durationInFrames={GITHUB_REPOSITORY_DURATION_IN_FRAMES} 
        fps={GITHUB_REPOSITORY_FPS} 
        width={GITHUB_REPOSITORY_WIDTH} 
        height={GITHUB_REPOSITORY_HEIGHT}
      />
    </Folder>

    <Folder name="KI-YouTube-Longform">
      <Composition
        id={AI_APP_WORKFLOW_COMPOSITION_ID}
        component={LongformAIAppWorkflow}
        defaultProps={{}}
        durationInFrames={AI_APP_WORKFLOW_DURATION_IN_FRAMES}
        fps={AI_APP_WORKFLOW_FPS}
        width={AI_APP_WORKFLOW_WIDTH}
        height={AI_APP_WORKFLOW_HEIGHT}
      />
      <Composition
        id={AI_APP_WORKFLOW_THUMBNAIL_ID}
        component={ThumbnailAIAppWorkflow}
        defaultProps={{}}
        durationInFrames={1}
        fps={AI_APP_WORKFLOW_FPS}
        width={AI_APP_WORKFLOW_WIDTH}
        height={AI_APP_WORKFLOW_HEIGHT}
      />
      <Composition
        id={AGENT_LOOP_COMPOSITION_ID}
        component={LongformAgentLoop}
        defaultProps={{voiceoverSrc: voiceoverAgentLoop}}
        durationInFrames={AGENT_LOOP_DURATION_IN_FRAMES}
        fps={AGENT_LOOP_FPS}
        width={AGENT_LOOP_WIDTH}
        height={AGENT_LOOP_HEIGHT}
      />
      <Composition
        id={AGENT_LOOP_THUMBNAIL_ID}
        component={ThumbnailAgentLoop}
        defaultProps={{}}
        durationInFrames={1}
        fps={AGENT_LOOP_FPS}
        width={AGENT_LOOP_WIDTH}
        height={AGENT_LOOP_HEIGHT}
      />
      {/* Stummer Funktionsnachweis fuer die Bausteine — kein Voiceover.
          Jede Szene ist zusaetzlich einzeln registriert, damit sie sich im
          Studio per Doppelklick aus der Timeline oeffnen laesst. */}
      <Composition
        id="KI-Baukasten-Demo"
        component={BaukastenDemo}
        defaultProps={{}}
        durationInFrames={DEMO_DAUER}
        fps={DEMO_FPS}
        width={AGENT_LOOP_WIDTH}
        height={AGENT_LOOP_HEIGHT}
      />
      <Composition
        id="KI-Baukasten-Icons"
        component={SzeneIcons}
        defaultProps={{}}
        durationInFrames={170}
        fps={DEMO_FPS}
        width={AGENT_LOOP_WIDTH}
        height={AGENT_LOOP_HEIGHT}
      />
      <Composition
        id="KI-Baukasten-Flaechen"
        component={SzeneFlaechen}
        defaultProps={{}}
        durationInFrames={170}
        fps={DEMO_FPS}
        width={AGENT_LOOP_WIDTH}
        height={AGENT_LOOP_HEIGHT}
      />
      <Composition
        id="KI-Baukasten-Loop"
        component={SzeneLoop}
        defaultProps={{}}
        durationInFrames={170}
        fps={DEMO_FPS}
        width={AGENT_LOOP_WIDTH}
        height={AGENT_LOOP_HEIGHT}
      />
      <Composition
        id="KI-Baukasten-Bewegung"
        component={SzeneBewegung}
        defaultProps={{}}
        durationInFrames={170}
        fps={DEMO_FPS}
        width={AGENT_LOOP_WIDTH}
        height={AGENT_LOOP_HEIGHT}
      />
      <Composition
        id="KI-Baukasten-Interaktion"
        component={SzeneInteraktion}
        defaultProps={{}}
        durationInFrames={170}
        fps={DEMO_FPS}
        width={AGENT_LOOP_WIDTH}
        height={AGENT_LOOP_HEIGHT}
      />
    </Folder>

    <MotionPreviewRoot />
  </>
);
