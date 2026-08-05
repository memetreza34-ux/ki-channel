import React from 'react';
import {Composition, Folder} from 'remotion';
import {COMPLETE_PROTOTYPE_REGISTRY} from './completePrototypeRegistry';

export const CompletePrototypeGalleryRoot: React.FC = () => (
  <Folder name="Complete-Animation-Library">
    {COMPLETE_PROTOTYPE_REGISTRY.map((registration) => (
      <Composition
        key={registration.compositionId}
        id={registration.compositionId}
        component={registration.component}
        durationInFrames={registration.durationInFrames}
        fps={registration.fps}
        width={registration.width}
        height={registration.height}
      />
    ))}
  </Folder>
);
