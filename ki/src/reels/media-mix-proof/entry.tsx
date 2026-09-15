import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {
  MEDIA_MIX_PROOF_DURATION_IN_FRAMES,
  MEDIA_MIX_PROOF_FPS,
  MEDIA_MIX_PROOF_HEIGHT,
  MEDIA_MIX_PROOF_ID,
  MEDIA_MIX_PROOF_WIDTH,
  MediaMixProof,
} from './MediaMixProof';

const MediaMixProofRoot: React.FC = () => (
  <Composition
    id={MEDIA_MIX_PROOF_ID}
    component={MediaMixProof}
    durationInFrames={MEDIA_MIX_PROOF_DURATION_IN_FRAMES}
    fps={MEDIA_MIX_PROOF_FPS}
    width={MEDIA_MIX_PROOF_WIDTH}
    height={MEDIA_MIX_PROOF_HEIGHT}
  />
);

registerRoot(MediaMixProofRoot);
