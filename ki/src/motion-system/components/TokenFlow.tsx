import React from 'react';
import {useCurrentFrame} from 'remotion';
import {durationForDistance, easedProgress, staggerDelay} from '../../motion/easing';

type Point = {x: number; y: number};

export const TokenFlow: React.FC<{
  from: Point;
  to: Point;
  startFrame: number;
  durationFrames?: number;
  count?: number;
  color?: string;
}> = ({from, to, startFrame, durationFrames, count = 5, color = '#B98CFF'}) => {
  const frame = useCurrentFrame();
  // Reisedauer nach Strecke: gleiche Dauer fuer kurze und lange Wege laesst
  // den langen Weg gehetzt wirken.
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const travelFrames = durationFrames ?? durationForDistance(42, distance, 400);

  return (
    <svg style={{position: 'absolute', inset: 0, overflow: 'visible'}} width="100%" height="100%">
      {Array.from({length: count}).map((_, index) => {
        // Gedeckelte Staffelung: ohne Obergrenze schleppt der Schwanz bei
        // vielen Tokens laenger als die Aussage dauert.
        const stagger = staggerDelay(index, 5);
        // Die Tokens legen eine Strecke zurueck und bleiben dabei sichtbar -
        // also symmetrisch aus der Ruhe heraus und wieder in die Ruhe hinein.
        const progress = easedProgress(
          frame,
          startFrame + stagger,
          startFrame + stagger + travelFrames,
          'move',
        );
        const x = from.x + (to.x - from.x) * progress;
        const y = from.y + (to.y - from.y) * progress;
        const opacity = progress <= 0 || progress >= 1 ? 0 : 1;
        return <circle key={index} cx={x} cy={y} r={8 - index * 0.7} fill={color} opacity={opacity} />;
      })}
    </svg>
  );
};
