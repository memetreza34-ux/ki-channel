import React from 'react';
import {Composition} from 'remotion';
import {FORMATS, FPS} from './kit';
import {PROJEKTE} from './projekte';

export const StudioRoot: React.FC = () => (
  <>
    {PROJEKTE.flatMap((p) => {
      const formats = Array.isArray(p.format) ? p.format : [p.format];
      return formats.map((format, i) => {
        const id = i === 0 ? p.id : `${p.id}-${format}`;
        return (
          <Composition
            key={id}
            id={id}
            component={p.component}
            durationInFrames={p.durationInFrames}
            fps={p.fps ?? FPS}
            width={FORMATS[format].width}
            height={FORMATS[format].height}
          />
        );
      });
    })}
  </>
);
