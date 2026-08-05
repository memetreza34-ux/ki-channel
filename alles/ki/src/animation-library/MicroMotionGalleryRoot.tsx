import React from 'react';
import {Composition, Folder} from 'remotion';
import {MICRO_MOTION_CATALOG} from './microMotionCatalog';
import {SemanticMicroMotion} from './microMotionRuntime';

export const toMicroMotionCompositionId = (mechanismId: string): string =>
  `Micro-${mechanismId}`;

export const MicroMotionGalleryRoot: React.FC = () => (
  <Folder name="Semantic-Micro-Motions">
    {MICRO_MOTION_CATALOG.map((mechanism) => (
      <Composition
        key={mechanism.mechanismId}
        id={toMicroMotionCompositionId(mechanism.mechanismId)}
        component={SemanticMicroMotion}
        defaultProps={{
          mechanismId: mechanism.mechanismId,
          text: mechanism.roles.includes('risk') ? 'FALSCH' : 'WICHTIG',
          secondaryText: mechanism.roles.includes('comparison') ? 'BESSER' : 'ERGEBNIS',
          value: 73,
        }}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
    ))}
  </Folder>
);
