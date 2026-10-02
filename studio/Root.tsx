import React from 'react';
import {Composition} from 'remotion';
import {FORMATS, FPS} from './kit';
import {PROJEKTE} from './projekte';

export const StudioRoot: React.FC = () => (
  <>
    {PROJEKTE.map((p) => (
      <Composition
        key={p.id}
        id={p.id}
        component={p.component}
        durationInFrames={p.durationInFrames}
        fps={p.fps ?? FPS}
        width={FORMATS[p.format].width}
        height={FORMATS[p.format].height}
      />
    ))}
  </>
);
