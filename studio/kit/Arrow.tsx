import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {evolvePath, getLength, getPointAtLength, getTangentAtLength} from '@remotion/paths';
import {progress} from './motion';
import {useTheme} from './themes';

type Point = [x: number, y: number];

type ArrowProps = {
  from: Point;
  to: Point;
  /** Krümmung: 0 = gerade, positiv/negativ biegt zur Seite. */
  bend?: number;
  /** Abstand zu Start/Ziel in px, damit der Pfeil Objekte nicht berührt. */
  inset?: number;
  color?: string;
  width?: number;
  delay?: number;
  duration?: number;
  head?: boolean;
  /** Nach dem Zeichnen laufen Punkte entlang der Linie (Datenfluss). */
  flow?: boolean;
  dashed?: boolean;
};

/** Gezeichneter Verbindungspfeil in Kompositions-Koordinaten (px). */
export const Arrow: React.FC<ArrowProps> = ({
  from,
  to,
  bend = 0.18,
  inset = 0,
  color: colorProp,
  width = 8,
  delay = 0,
  duration = 22,
  head = true,
  flow = false,
  dashed = false,
}) => {
  const t = useTheme();
  const color = colorProp ?? t.c.accentDeep;
  const frame = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();

  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const a: Point = [from[0] + ux * inset, from[1] + uy * inset];
  const b: Point = [to[0] - ux * inset, to[1] - uy * inset];
  const cx = (a[0] + b[0]) / 2 - uy * dist * bend;
  const cy = (a[1] + b[1]) / 2 + ux * dist * bend;
  const d = `M ${a[0]} ${a[1]} Q ${cx} ${cy} ${b[0]} ${b[1]}`;

  const p = progress(frame, delay, duration, 'inOut');
  const len = getLength(d);
  const evolved = evolvePath(p, d);
  const tip = getPointAtLength(d, len * p) ?? {x: a[0], y: a[1]};
  const tangent = getTangentAtLength(d, Math.max(0.01, len * p)) ?? {x: ux, y: uy};
  const angle = (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;
  const flowOn = flow && p >= 1;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={W} height={H} style={{overflow: 'visible'}}>
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray={dashed ? `${width * 0.1} ${width * 2.6}` : evolved.strokeDasharray}
          strokeDashoffset={dashed ? 0 : evolved.strokeDashoffset}
          opacity={dashed ? p : flowOn ? 0.35 : 1}
        />
        {flowOn ? (
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={width}
            strokeLinecap="round"
            strokeDasharray={`${width * 0.1} ${width * 3.2}`}
            // Endlos-Fluss: lineare Bewegung ist hier semantisch richtig.
            strokeDashoffset={-(frame - delay - duration) * 2.2}
          />
        ) : null}
        {head && p > 0.02 ? (
          <path
            d={`M ${-width * 2.6} ${-width * 2} L 0 0 L ${-width * 2.6} ${width * 2}`}
            fill="none"
            stroke={color}
            strokeWidth={width}
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`translate(${tip.x} ${tip.y}) rotate(${angle})`}
          />
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};
