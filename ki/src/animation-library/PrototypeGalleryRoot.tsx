import React from 'react';
import {Composition, Folder} from 'remotion';
import {ANIMATION_PROTOTYPE_REGISTRY} from './prototypes/registry';

export const PrototypeGalleryRoot: React.FC = () => (
  <Folder name="Animation-Library-Prototypes">
    {ANIMATION_PROTOTYPE_REGISTRY.map((registration) => (
      <Composition
        key={registration.compositionId}
        id={registration.compositionId}
        component={registration.component}
        defaultProps={registration.defaultProps}
        durationInFrames={registration.durationInFrames}
        fps={registration.fps}
        width={registration.width}
        height={registration.height}
      />
    ))}
  </Folder>
);
