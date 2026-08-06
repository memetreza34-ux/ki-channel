import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export type StableSentenceCaptionCue = {
  id: string;
  text: string;
  startFrame: number;
  endFrame: number;
  lineCount: 1 | 2;
  bottomPx: number;
  revealMode: 'instant';
  wordHighlight: false;
  progressIndicator: 'single-violet-line';
};

export type StableSentenceCaptionProps = {
  cues: readonly StableSentenceCaptionCue[];
  accentColor?: string;
  fontFamily?: string;
  fontSizePx?: number;
  progressLineHeightPx?: number;
};

const clamp = (frame: number, start: number, end: number): number =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const StableSentenceCaption: React.FC<StableSentenceCaptionProps> = ({
  cues,
  accentColor = '#7D49DF',
  fontFamily = 'Inter, ui-sans-serif, system-ui, sans-serif',
  fontSizePx = 50,
  progressLineHeightPx = 8,
}) => {
  const frame = useCurrentFrame();
  const cue = cues.find((item) => frame >= item.startFrame && frame < item.endFrame);

  if (!cue) return null;

  const progress = clamp(frame, cue.startFrame, cue.endFrame);

  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        right: 64,
        bottom: cue.bottomPx,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div style={{width: '100%', maxWidth: 940, textAlign: 'center'}}>
        <div
          style={{
            fontFamily,
            fontSize: fontSizePx,
            lineHeight: 1.16,
            fontWeight: 850,
            color: '#FFFFFF',
            WebkitTextStroke: '2.5px rgba(20, 15, 28, 0.96)',
            paintOrder: 'stroke fill',
            textShadow: '0 4px 8px rgba(20, 15, 28, 0.82)',
            whiteSpace: 'normal',
          }}
        >
          {cue.text}
        </div>

        <div
          style={{
            width: '100%',
            height: progressLineHeightPx,
            marginTop: 18,
            borderRadius: 999,
            background: 'rgba(125, 73, 223, 0.18)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              borderRadius: 999,
              background: accentColor,
            }}
          />
        </div>
      </div>
    </div>
  );
};
