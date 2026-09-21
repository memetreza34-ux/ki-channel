import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {evolvePath, getPointAtLength, getLength} from '@remotion/paths';
import {makeCircle, makeRect} from '@remotion/shapes';
import {
  MOTION_EASING,
  easedProgress,
  followThrough,
  staggerDelay,
} from '../../motion/easing';

/**
 * "Wie die KI das naechste Wort waehlt" - eine vollstaendige Szene.
 *
 * Gebaut nach ki/gehirn/BEWEGUNG.md: Corporate, ruhig und scharf, kein
 * Ueberschwinger. Ein Held pro Bild, der Rest ist Stuetze oder Textur.
 *
 * Mechanik statt Karten: der Satz liegt als Spur, die Kandidaten wachsen als
 * echte Saeulen daraus hervor, der Gewinner wandert zurueck in die Spur.
 */

const FARBE = {
  grund: '#F8F7FB',
  text: '#1A1A2E',
  akzent: '#6E45C9',
  akzentHell: '#B98CFF',
  gedaempft: '#8B8399',
  weiss: '#FFFFFF',
} as const;

const SATZ = ['Die', 'Katze', 'sitzt', 'auf', 'dem'];

const KANDIDATEN = [
  {wort: 'Sofa', anteil: 62},
  {wort: 'Dach', anteil: 24},
  {wort: 'Mond', anteil: 14},
] as const;

const SPUR = 'M 110 560 L 970 560';
const SPUR_LAENGE = getLength(SPUR);

const SAEULE_BREITE = 190;
const SAEULE_MAX = 400;
const SAEULE_BASIS = 1180;

const Korn: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
      backgroundSize: '180px 180px',
      opacity: 0.035,
      mixBlendMode: 'multiply',
    }}
  />
);

export const NextWordScene: React.FC = () => {
  const frame = useCurrentFrame();

  const titel = easedProgress(frame, 0, 16);
  const spurZeichnen = easedProgress(frame, 10, 46);
  const saeulenStart = 56;
  const gewinnerWandert = easedProgress(frame, 150, 196, 'move');
  const verlierer = easedProgress(frame, 150, 186, 'exit');
  const schluss = easedProgress(frame, 196, 220);

  const {strokeDasharray, strokeDashoffset} = evolvePath(spurZeichnen, SPUR);
  const gewinnerZiel = getPointAtLength(SPUR, SPUR_LAENGE);

  return (
    <AbsoluteFill style={{background: FARBE.grund, fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <Korn />

      <div
        style={{
          position: 'absolute',
          left: 96,
          right: 96,
          top: 150,
          opacity: titel,
          transform: `translateY(${(1 - titel) * -26}px)`,
        }}
      >
        <div style={{fontSize: 24, fontWeight: 900, letterSpacing: 5, color: FARBE.akzent}}>
          NÄCHSTES WORT
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 64,
            lineHeight: 1.02,
            fontWeight: 900,
            letterSpacing: -2,
            color: FARBE.text,
            opacity: easedProgress(frame, followThrough(0, 1), 20),
          }}
        >
          Die KI rät nicht.<br />Sie rechnet.
        </div>
      </div>

      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <path
          d={SPUR}
          fill="none"
          stroke={FARBE.akzentHell}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          opacity={0.55}
        />

        {SATZ.map((wort, index) => {
          const auftritt = easedProgress(
            frame,
            18 + staggerDelay(index, 5),
            34 + staggerDelay(index, 5),
          );
          const x = 150 + index * 165;
          const form = makeRect({width: 140, height: 66, cornerRadius: 18});
          return (
            <g key={wort} opacity={auftritt}>
              <g transform={`translate(${x - 70}, ${527 + (1 - auftritt) * 14})`}>
                <path d={form.path} fill={FARBE.weiss} stroke={FARBE.akzentHell} strokeWidth={3} />
              </g>
              <text
                x={x}
                y={568 + (1 - auftritt) * 14}
                textAnchor="middle"
                fontSize={30}
                fontWeight={800}
                fill={FARBE.text}
              >
                {wort}
              </text>
            </g>
          );
        })}

        {KANDIDATEN.map((kandidat, index) => {
          const start = saeulenStart + staggerDelay(index, 8);
          const wachsen = easedProgress(frame, start, start + 34);
          const istGewinner = index === 0;
          const hoehe = (kandidat.anteil / 100) * SAEULE_MAX * wachsen;
          const x = 250 + index * 290;
          const abgang = istGewinner ? 0 : verlierer;
          const y = SAEULE_BASIS - hoehe;

          const wanderX = istGewinner
            ? interpolate(gewinnerWandert, [0, 1], [x, gewinnerZiel.x + 40])
            : x;
          const wanderY = istGewinner
            ? interpolate(gewinnerWandert, [0, 1], [y, 545])
            : y;
          const schrumpf = istGewinner
            ? interpolate(gewinnerWandert, [0, 1], [1, 0.34], {
                easing: MOTION_EASING.move,
              })
            : 1;

          const punkt = makeCircle({radius: 9});

          return (
            <g key={kandidat.wort} opacity={1 - abgang} transform={`translate(${wanderX - x}, 0)`}>
              <rect
                x={x - SAEULE_BREITE / 2}
                y={wanderY}
                width={SAEULE_BREITE * schrumpf}
                height={Math.max(2, (SAEULE_BASIS - wanderY) * schrumpf)}
                rx={22}
                fill={istGewinner ? FARBE.akzent : FARBE.weiss}
                stroke={FARBE.akzentHell}
                strokeWidth={3}
                transform={`translate(${(SAEULE_BREITE * (1 - schrumpf)) / 2}, 0)`}
              />
              <g opacity={1 - gewinnerWandert * (istGewinner ? 1 : 0)}>
                <text
                  x={x}
                  y={wanderY - 30}
                  textAnchor="middle"
                  fontSize={44}
                  fontWeight={900}
                  fill={istGewinner ? FARBE.akzent : FARBE.text}
                >
                  {Math.round(kandidat.anteil * wachsen)} %
                </text>
                <text
                  x={x}
                  y={SAEULE_BASIS + 58}
                  textAnchor="middle"
                  fontSize={36}
                  fontWeight={900}
                  fill={istGewinner ? FARBE.akzent : FARBE.gedaempft}
                >
                  {kandidat.wort}
                </text>
              </g>
              {istGewinner ? (
                <g
                  transform={`translate(${wanderX - 9}, ${wanderY - 42})`}
                  opacity={gewinnerWandert}
                >
                  <path d={punkt.path} fill={FARBE.akzent} />
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 110,
          right: 110,
          top: 1330,
          opacity: schluss,
          transform: `translateY(${(1 - schluss) * 22}px)`,
          textAlign: 'center',
          fontSize: 38,
          lineHeight: 1.25,
          fontWeight: 800,
          color: FARBE.text,
        }}
      >
        Jedes Wort ist eine <span style={{color: FARBE.akzent}}>Wahrscheinlichkeit</span> — nicht eine Meinung.
      </div>
    </AbsoluteFill>
  );
};
