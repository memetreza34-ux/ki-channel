import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {
  HALLUCINATION_COMPOSITION_ID,
  HALLUCINATION_DURATION,
  HALLUCINATION_FPS,
  HALLUCINATION_HEIGHT,
  HALLUCINATION_WIDTH,
} from './contract';
import {ReelWhyAIHallucinates} from './ReelWhyAIHallucinates';

const HallucinationReelRoot: React.FC = () => (
  <Composition
    id={HALLUCINATION_COMPOSITION_ID}
    component={ReelWhyAIHallucinates}
    durationInFrames={HALLUCINATION_DURATION}
    fps={HALLUCINATION_FPS}
    width={HALLUCINATION_WIDTH}
    height={HALLUCINATION_HEIGHT}
    defaultProps={{showDebugTimeline:false,muteVoiceover:false}}
  />
);

registerRoot(HallucinationReelRoot);
