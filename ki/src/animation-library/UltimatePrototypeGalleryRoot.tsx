import React from 'react';
import {Composition, Folder} from 'remotion';
import {ADVANCED_PROTOTYPE_REGISTRY} from './advancedPrototypeRegistry';
import {COMPLETE_PROTOTYPE_REGISTRY} from './completePrototypeRegistry';
import {EXPERIMENTAL_PROTOTYPE_REGISTRY} from './experimentalPrototypeRegistry';
import {FINAL_PROTOTYPE_REGISTRY} from './finalPrototypeRegistry';

const RegistryFolder: React.FC<{
  name: string;
  registrations: readonly {
    compositionId: string;
    component: React.ComponentType;
    durationInFrames: number;
    fps: number;
    width: number;
    height: number;
  }[];
}> = ({name, registrations}) => (
  <Folder name={name}>
    {registrations.map((registration) => (
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

export const UltimatePrototypeGalleryRoot: React.FC = () => (
  <>
    <RegistryFolder
      name="Animation-Library-Wave-1"
      registrations={COMPLETE_PROTOTYPE_REGISTRY}
    />
    <RegistryFolder
      name="Animation-Library-Wave-2"
      registrations={EXPERIMENTAL_PROTOTYPE_REGISTRY}
    />
    <RegistryFolder
      name="Animation-Library-Wave-3"
      registrations={ADVANCED_PROTOTYPE_REGISTRY}
    />
    <RegistryFolder
      name="Animation-Library-Wave-4"
      registrations={FINAL_PROTOTYPE_REGISTRY}
    />
  </>
);
