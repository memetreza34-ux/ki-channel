import React from 'react';
import {Composition, Folder} from 'remotion';
import voiceoverContext from '../reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/01-script-audio/voiceover.wav';
import voiceoverHallucination from '../reels/2026-08-10_bis_2026-08-16/01_Warum-KI-Dinge-erfindet/01-script-audio/voiceover.mp4';
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

export const RemotionRoot: React.FC = () => (
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
  </Folder>
);
