import React from 'react';
import {Composition, Folder} from 'remotion';
import {COMPLETE_PROTOTYPE_REGISTRY} from './completePrototypeRegistry';
import {EXPERIMENTAL_PROTOTYPE_REGISTRY} from './experimentalPrototypeRegistry';

export const ExpandedPrototypeGalleryRoot: React.FC = () => (
  <>
    <Folder name="Animation-Library-Primary-22">
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
    <Folder name="Animation-Library-Alternate-22">
      {EXPERIMENTAL_PROTOTYPE_REGISTRY.map((registration) => (
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
  </>
);
