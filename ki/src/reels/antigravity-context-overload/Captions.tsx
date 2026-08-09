import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {CONTEXT_OVERLOAD_SUBTITLES} from './contract';

const edgeFade = (frame: number, startFrame: number, endFrame: number): number => {
  const fadeFrames = 5;
  return Math.min(
    interpolate(frame, [startFrame, startFrame + fadeFrames], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    interpolate(frame, [endFrame - fadeFrames, endFrame], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
};

export const ContextOverloadCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = CONTEXT_OVERLOAD_SUBTITLES.find(
    (item) => frame >= item.startFrame && frame < item.endFrame,
  );
  if (!cue) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 72,
        right: 72,
        bottom: 92,
        zIndex: 200,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: edgeFade(frame, cue.startFrame, cue.endFrame),
      }}
    >
      <div
        style={{
          maxWidth: 900,
          padding: '18px 28px 20px',
          borderRadius: 24,
          background: 'rgba(255,255,255,0.92)',
          border: `1px solid ${BRAND.bgDeep}`,
          boxShadow: '0 14px 44px rgba(26,26,46,0.10)',
          color: BRAND.ink,
          fontFamily: BRAND.font,
          fontSize: 46,
          fontWeight: 750,
          lineHeight: 1.16,
          letterSpacing: -1.1,
          textAlign: 'center',
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};
