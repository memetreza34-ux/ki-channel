import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {CoverWhyAIForgetsEarlierMessages} from './CoverWhyAIForgetsEarlierMessages';
import {ReelWhyAIForgetsEarlierMessages} from './ReelWhyAIForgetsEarlierMessages';
import {
  CONTEXT_COMPOSITION_ID,
  CONTEXT_COVER_ID,
  CONTEXT_DURATION,
  CONTEXT_FPS,
  CONTEXT_HEIGHT,
  CONTEXT_WIDTH,
} from './sync';

const ContextWindowReelRoot: React.FC = () => (
  <>
    <Composition
      id={CONTEXT_COMPOSITION_ID}
      component={ReelWhyAIForgetsEarlierMessages}
      durationInFrames={CONTEXT_DURATION}
      fps={CONTEXT_FPS}
      width={CONTEXT_WIDTH}
      height={CONTEXT_HEIGHT}
    />
    <Composition
      id={CONTEXT_COVER_ID}
      component={CoverWhyAIForgetsEarlierMessages}
      durationInFrames={1}
      fps={CONTEXT_FPS}
      width={CONTEXT_WIDTH}
      height={CONTEXT_HEIGHT}
    />
  </>
);

registerRoot(ContextWindowReelRoot);