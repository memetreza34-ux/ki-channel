import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {ShapeMorphDemo} from './ShapeMorphDemo';
import {PathTravelDemo} from './PathTravelDemo';
import {TransitionDemo} from './TransitionDemo';

const DEFAULTS = {fps: 30, width: 1080, height: 1920} as const;

const Root: React.FC = () => (
  <>
    <Composition
      id="Demo-Shape-Morph"
      component={ShapeMorphDemo}
      durationInFrames={180}
      {...DEFAULTS}
    />
    <Composition
      id="Demo-Path-Travel"
      component={PathTravelDemo}
      durationInFrames={180}
      {...DEFAULTS}
    />
    <Composition
      id="Demo-Transitions"
      component={TransitionDemo}
      durationInFrames={166}
      {...DEFAULTS}
    />
  </>
);

registerRoot(Root);
