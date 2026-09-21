import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {ShapeMorphDemo} from './ShapeMorphDemo';
import {PathTravelDemo} from './PathTravelDemo';
import {TransitionDemo} from './TransitionDemo';
import {NextWordScene} from './NextWordScene';
import {ReelVomSatzZurAntwort} from './ReelVomSatzZurAntwort';
import {ReelWarumUnsinn} from './ReelWarumUnsinn';
import {REEL_LAENGE_IN_FRAMES} from './reelSkript';
import {REEL_DAUER_IN_FRAMES} from './reelSzenen';

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
      id="Reel-Warum-Unsinn"
      component={ReelWarumUnsinn}
      durationInFrames={REEL_LAENGE_IN_FRAMES}
      {...DEFAULTS}
    />
    <Composition
      id="Reel-Vom-Satz-Zur-Antwort"
      component={ReelVomSatzZurAntwort}
      durationInFrames={REEL_DAUER_IN_FRAMES}
      {...DEFAULTS}
    />
    <Composition
      id="Szene-Naechstes-Wort"
      component={NextWordScene}
      durationInFrames={240}
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
