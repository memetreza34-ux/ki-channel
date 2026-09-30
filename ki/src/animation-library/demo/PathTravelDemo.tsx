import React from 'react';
import {useCurrentFrame} from 'remotion';
import {
  evolvePath,
  getLength,
  getPointAtLength,
  getTangentAtLength,
} from '@remotion/paths';
import {makeCircle} from '@remotion/shapes';
import {staggerDelay} from '../../motion/easing';
import {
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from '../prototypes/PrototypeShell';

/**
 * Demo: eine Anfrage faehrt eine echte Kurve entlang und dreht sich korrekt mit.
 *
 * Die bisherigen Prototypen lassen Linien wachsen und Objekte geradeaus
 * wandern. Hier liefert @remotion/paths die Position UND die Tangente, also
 * kippt das Objekt in die Kurve wie ein Fahrzeug.
 *
 * Genutzt: evolvePath (Pfad zeichnet sich auf), getPointAtLength (Position),
 * getTangentAtLength (Ausrichtung), makeCircle (Stationen).
 */

const PIPELINE =
  'M 90 470 C 250 470, 250 170, 410 170 S 570 470, 730 470 S 890 200, 990 200';

const PIPELINE_LENGTH = getLength(PIPELINE);
const STATION = makeCircle({radius: 17});
const PIPELINE_START = {x: 90, y: 470};

const STATIONS = [
  {at: 0.0, label: 'ANFRAGE'},
  {at: 0.34, label: 'KONTEXT'},
  {at: 0.66, label: 'MODELL'},
  {at: 1.0, label: 'ANTWORT'},
] as const;

export const PathTravelDemo: React.FC = () => {
  const frame = useCurrentFrame();

  const draw = prototypeProgress(frame, 0, 54);
  const travel = prototypeProgress(frame, 50, 158, 'move');
  const {strokeDasharray, strokeDashoffset} = evolvePath(draw, PIPELINE);

  const at = Math.max(0.0001, travel) * PIPELINE_LENGTH;
  const point = getPointAtLength(PIPELINE, at) ?? PIPELINE_START;
  const tangent = getTangentAtLength(PIPELINE, at) ?? {x: 1, y: 0};
  const angle = (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;

  return (
    <PrototypeShell
      family="process-flow"
      title="Path Travel"
      subtitle="Der Pfad zeichnet sich auf, dann fährt die Anfrage ihn ab — und kippt dabei in die Kurve, weil die Tangente die Ausrichtung liefert."
    >
      <div style={{position: 'absolute', left: 0, right: 0, top: 520}}>
        <svg width="1080" height="620" viewBox="0 0 1080 620">
          <defs>
            <linearGradient id="pipeStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C6A8FF" />
              <stop offset="100%" stopColor="#6E45C9" />
            </linearGradient>
          </defs>

          <path
            d={PIPELINE}
            fill="none"
            stroke="url(#pipeStroke)"
            strokeWidth={16}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />

          {STATIONS.map((station, index) => {
            const reveal = prototypeProgress(
              frame,
              10 + staggerDelay(index, 7),
              32 + staggerDelay(index, 7),
            );
            const stationPoint =
              getPointAtLength(PIPELINE, station.at * PIPELINE_LENGTH) ?? PIPELINE_START;
            const passed = travel >= station.at - 0.02;
            return (
              <g key={station.label} opacity={reveal}>
                <g transform={`translate(${stationPoint.x - 17}, ${stationPoint.y - 17})`}>
                  <path
                    d={STATION.path}
                    fill={passed ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.white}
                    stroke={PROTOTYPE_PALETTE.accent}
                    strokeWidth={5}
                  />
                </g>
                <text
                  x={stationPoint.x}
                  y={stationPoint.y - 40}
                  textAnchor="middle"
                  fontSize={21}
                  fontWeight={900}
                  letterSpacing={2}
                  fill={passed ? PROTOTYPE_PALETTE.accent : PROTOTYPE_PALETTE.muted}
                >
                  {station.label}
                </text>
              </g>
            );
          })}

          <g
            transform={`translate(${point.x}, ${point.y}) rotate(${angle})`}
            opacity={draw > 0.9 ? 1 : 0}
          >
            <rect
              x={-34}
              y={-19}
              width={68}
              height={38}
              rx={13}
              fill={PROTOTYPE_PALETTE.foreground}
            />
            <path d="M 14 0 L -6 -10 L -6 10 Z" fill={PROTOTYPE_PALETTE.white} />
          </g>
        </svg>
      </div>
    </PrototypeShell>
  );
};
