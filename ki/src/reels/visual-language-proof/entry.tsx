import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {
  VISUAL_LANGUAGE_PROOF_DURATION_IN_FRAMES,
  VISUAL_LANGUAGE_PROOF_FPS,
  VISUAL_LANGUAGE_PROOF_HEIGHT,
  VISUAL_LANGUAGE_PROOF_ID,
  VISUAL_LANGUAGE_PROOF_WIDTH,
  VisualLanguageProof,
} from './VisualLanguageProof';

const VisualLanguageProofRoot: React.FC = () => (
  <Composition
    id={VISUAL_LANGUAGE_PROOF_ID}
    component={VisualLanguageProof}
    durationInFrames={VISUAL_LANGUAGE_PROOF_DURATION_IN_FRAMES}
    fps={VISUAL_LANGUAGE_PROOF_FPS}
    width={VISUAL_LANGUAGE_PROOF_WIDTH}
    height={VISUAL_LANGUAGE_PROOF_HEIGHT}
  />
);

registerRoot(VisualLanguageProofRoot);
