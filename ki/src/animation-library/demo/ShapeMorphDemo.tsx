import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {interpolatePath} from '@remotion/paths';
import {makeCircle, makePolygon, makeRect} from '@remotion/shapes';
import {MOTION_EASING} from '../../motion/easing';
import {
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from '../prototypes/PrototypeShell';

/**
 * Demo: echtes Form-Morphing statt Karte-blendet-aus, Karte-blendet-ein.
 *
 * Eine einzige Form durchlaeuft drei Zustaende. Das Auge kann die Identitaet
 * die ganze Zeit verfolgen - genau das, was eine Ueberblendung zerstoert.
 *
 * Genutzt: @remotion/shapes fuer die Formen, @remotion/paths fuer den Morph.
 */

const SIZE = 420;

const textShape = makeRect({width: SIZE, height: 150, cornerRadius: 24});
const structureShape = makePolygon({points: 6, radius: SIZE / 2, cornerRadius: 12});
const meaningShape = makeCircle({radius: SIZE / 2});

const STAGES = [
  {label: 'TEXT', caption: 'Ein Satz, wie du ihn schreibst', shape: textShape},
  {label: 'STRUKTUR', caption: 'Zerlegt in zählbare Teile', shape: structureShape},
  {label: 'BEDEUTUNG', caption: 'Ein Punkt im Bedeutungsraum', shape: meaningShape},
] as const;

const centered = (path: string, width: number, height: number): string =>
  `translate(${(SIZE - width) / 2}, ${(SIZE - height) / 2})`;

export const ShapeMorphDemo: React.FC = () => {
  const frame = useCurrentFrame();

  const morphA = prototypeProgress(frame, 34, 84, 'move');
  const morphB = prototypeProgress(frame, 96, 146, 'move');
  const enter = prototypeProgress(frame, 4, 30);

  const stageIndex = morphB > 0.5 ? 2 : morphA > 0.5 ? 1 : 0;
  const stage = STAGES[stageIndex];

  const firstMorph = interpolatePath(
    morphA,
    textShape.path,
    structureShape.path,
  );
  const path = morphB > 0
    ? interpolatePath(morphB, firstMorph, meaningShape.path)
    : firstMorph;

  const transform = morphA > 0.5
    ? centered(path, SIZE, SIZE)
    : centered(path, SIZE, 150);

  const spin = interpolate(morphA + morphB, [0, 2], [0, 18], {
    easing: MOTION_EASING.move,
  });

  return (
    <PrototypeShell
      family="data-transformation"
      title="Shape Morph"
      subtitle="Eine Form wird zu einer anderen. Keine Überblendung, kein Kartentausch — dieselbe Fläche behält ihre Identität über alle drei Zustände."
    >
      <div style={{position: 'absolute', left: 0, right: 0, top: 560}}>
        <svg
          width="1080"
          height="620"
          viewBox="0 0 1080 620"
          style={{position: 'absolute', inset: 0}}
        >
          <defs>
            <linearGradient id="morphFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#B98CFF" />
              <stop offset="100%" stopColor="#6E45C9" />
            </linearGradient>
          </defs>
          <g transform={`translate(${(1080 - SIZE) / 2}, 90) rotate(${spin} ${SIZE / 2} ${SIZE / 2})`}>
            <g transform={transform}>
              <path
                d={path}
                fill="url(#morphFill)"
                opacity={enter}
                style={{filter: 'drop-shadow(0 26px 60px rgba(110,69,201,.32))'}}
              />
            </g>
          </g>
        </svg>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 560,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: 5,
              color: PROTOTYPE_PALETTE.accent,
            }}
          >
            {stage.label}
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 34,
              fontWeight: 800,
              color: PROTOTYPE_PALETTE.foreground,
            }}
          >
            {stage.caption}
          </div>
        </div>
      </div>
    </PrototypeShell>
  );
};
