import React from 'react';
import {random} from 'remotion';

/**
 * Figuren-Baukasten: Menschen im flachen Erklärvideo-Stil (großer Kopf, einfacher Körper).
 * Alles ist SVG, Ursprung = Mitte zwischen den Füßen am Boden. Höhe bei k = 1 ca. 450 px.
 * Gelenke: Schulter/Ellbogen, Hüfte/Knie. Laufzyklus über `gehen` (Phase in Radiant).
 */

export type Frisur = 'kurz' | 'bob' | 'dutt' | 'seiten' | 'locken';
export type Kleidung = 'anzug' | 'jacke' | 'kleid' | 'pulli';
export type Ausdruck = 'neutral' | 'froh' | 'lachen' | 'staunen' | 'sorge' | 'stolz';

export type Look = {
  haut: string;
  haar: string;
  frisur: Frisur;
  oben: string;
  unten: string;
  schuhe: string;
  kleidung: Kleidung;
  krawatte?: string;
  brille?: boolean;
};

export const LOOKS = {
  politiker: {haut: '#F3C9A8', haar: '#9AA3AE', frisur: 'seiten', oben: '#2F3A4F', unten: '#2F3A4F', schuhe: '#1E2430', kleidung: 'anzug', krawatte: '#E5484D'},
  frau: {haut: '#C98B62', haar: '#3B2A22', frisur: 'bob', oben: '#FFC93C', unten: '#3C5A99', schuhe: '#2B2B2B', kleidung: 'jacke'},
  rentnerin: {haut: '#F1CBB0', haar: '#E8E8EE', frisur: 'dutt', oben: '#9B7FD4', unten: '#9B7FD4', schuhe: '#5A4A6E', kleidung: 'kleid', brille: true},
  junge: {haut: '#8D5A3B', haar: '#1E1A18', frisur: 'locken', oben: '#2EC4B6', unten: '#3A3F55', schuhe: '#F2F2F2', kleidung: 'pulli'},
} satisfies Record<string, Look>;

type Pose = {
  /** Schulterwinkel (0 = hängt, 90 = waagrecht nach außen, 170 = hoch) und Ellbogenbeugung. */
  armL?: number;
  armR?: number;
  ellL?: number;
  ellR?: number;
  /** Laufphase in Radiant; undefined = steht. */
  gehen?: number;
  /** Blickrichtung des Körpers: 1 = nach rechts, −1 = nach links. */
  richtung?: 1 | -1;
  /** Kopfneigung in Grad. */
  neigung?: number;
};

type FigurProps = Pose & {
  look: Look;
  x: number;
  y: number;
  k?: number;
  ausdruck?: Ausdruck;
  blick?: [number, number];
  frame: number;
  seed?: string;
  schweiss?: number;
  sx?: number;
  sy?: number;
};

const S = 12; // Gliederstärke-Basis

/** Glied aus zwei Segmenten (Ober-/Unterteil) als runde Linien. */
const Glied: React.FC<{x: number; y: number; w1: number; w2: number; l1: number; l2: number; farbe: string; farbe2?: string; ende?: React.ReactNode}> = ({x, y, w1, w2, l1, l2, farbe, farbe2, ende}) => {
  const r1 = (w1 * Math.PI) / 180;
  const r2 = ((w1 + w2) * Math.PI) / 180;
  const kx = x + Math.sin(r1) * l1;
  const ky = y + Math.cos(r1) * l1;
  const ex = kx + Math.sin(r2) * l2;
  const ey = ky + Math.cos(r2) * l2;
  return (
    <g>
      <path d={`M${x},${y} L${kx},${ky} L${ex},${ey}`} stroke={farbe} strokeWidth={S * 2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {farbe2 ? <path d={`M${kx},${ky} L${ex},${ey}`} stroke={farbe2} strokeWidth={S * 2.2} strokeLinecap="round" fill="none" /> : null}
      <g transform={`translate(${ex},${ey}) rotate(${-(w1 + w2)})`}>{ende}</g>
    </g>
  );
};

const Haare: React.FC<{look: Look; hinten?: boolean}> = ({look, hinten}) => {
  const c = look.haar;
  const cy = -372;
  if (hinten) {
    if (look.frisur === 'bob') return <path d={`M-78,${cy - 6} Q-80,${cy + 70} -50,${cy + 64} L50,${cy + 64} Q80,${cy + 70} 78,${cy - 6} Z`} fill={c} />;
    if (look.frisur === 'dutt') return <circle cx={0} cy={cy - 82} r={30} fill={c} />;
    return null;
  }
  switch (look.frisur) {
    case 'kurz':
      return <path d={`M-70,${cy - 4} Q-72,${cy - 76} 0,${cy - 78} Q72,${cy - 76} 70,${cy - 4} Q50,${cy - 40} 0,${cy - 44} Q-40,${cy - 46} -70,${cy - 4} Z`} fill={c} />;
    case 'bob':
      return <path d={`M-74,${cy + 30} Q-82,${cy - 80} 0,${cy - 80} Q82,${cy - 80} 74,${cy + 30} L60,${cy + 30} Q62,${cy - 30} 20,${cy - 34} Q-30,${cy - 20} -56,${cy - 30} Q-62,${cy} -60,${cy + 30} Z`} fill={c} />;
    case 'dutt':
      return <path d={`M-70,${cy} Q-70,${cy - 74} 0,${cy - 76} Q70,${cy - 74} 70,${cy} Q50,${cy - 46} 0,${cy - 48} Q-50,${cy - 46} -70,${cy} Z`} fill={c} />;
    case 'seiten':
      return (
        <g fill={c}>
          <path d={`M-72,${cy + 14} Q-76,${cy - 46} -44,${cy - 62} Q-58,${cy - 20} -56,${cy + 14} Z`} />
          <path d={`M72,${cy + 14} Q76,${cy - 46} 44,${cy - 62} Q58,${cy - 20} 56,${cy + 14} Z`} />
          <path d={`M-30,${cy - 68} Q0,${cy - 84} 34,${cy - 66} Q4,${cy - 72} -30,${cy - 68} Z`} />
        </g>
      );
    case 'locken':
      return (
        <g fill={c}>
          {Array.from({length: 9}, (_, i) => {
            const a = Math.PI * (1.05 + (i / 8) * 0.9);
            return <circle key={i} cx={Math.cos(a) * 62} cy={cy + Math.sin(a) * 60 - 6} r={24} />;
          })}
        </g>
      );
  }
};

const Gesicht: React.FC<{ausdruck: Ausdruck; blick: [number, number]; blink: number; brille?: boolean}> = ({ausdruck, blick, blink, brille}) => {
  const ey = -380;
  const dunkel = '#2B2118';
  const augen = (cx: number) =>
    ausdruck === 'lachen' ? (
      <path d={`M${cx - 13},${ey + 4} Q${cx},${ey - 12} ${cx + 13},${ey + 4}`} stroke={dunkel} strokeWidth={6} fill="none" strokeLinecap="round" />
    ) : (
      <g>
        <ellipse cx={cx} cy={ey} rx={13} ry={(ausdruck === 'staunen' ? 18 : 15) * Math.max(0.1, 1 - blink)} fill="#FFFFFF" />
        {blink < 0.6 ? <circle cx={cx + blick[0] * 5} cy={ey + 1 + blick[1] * 5} r={8} fill={dunkel} /> : null}
        {blink < 0.6 ? <circle cx={cx + blick[0] * 5 + 3} cy={ey - 2 + blick[1] * 5} r={2.5} fill="#FFFFFF" /> : null}
      </g>
    );
  const braue = (cx: number, innen: 1 | -1) => {
    const hoch = ausdruck === 'staunen' ? 10 : ausdruck === 'sorge' ? 4 : 0;
    const neig = ausdruck === 'sorge' ? -6 : ausdruck === 'stolz' ? 3 : 0;
    const by = ey - 26 - hoch;
    return <path d={`M${cx - innen * 13},${by - neig} L${cx + innen * 13},${by + neig}`} stroke={dunkel} strokeWidth={5} strokeLinecap="round" />;
  };
  const my = -342;
  let mund: React.ReactNode;
  if (ausdruck === 'lachen' || ausdruck === 'froh') {
    mund = (
      <g>
        <path d={`M-20,${my - 2} Q0,${my + 26} 20,${my - 2} Z`} fill={dunkel} />
        <path d={`M-10,${my + 10} Q0,${my + 4} 10,${my + 10} Q0,${my + 18} -10,${my + 10} Z`} fill="#FF8A8A" />
      </g>
    );
  } else if (ausdruck === 'staunen') {
    mund = <ellipse cx={0} cy={my + 4} rx={9} ry={12} fill={dunkel} />;
  } else if (ausdruck === 'sorge') {
    mund = <path d={`M-16,${my + 6} q5,-6 10,0 t10,0 t10,0`} stroke={dunkel} strokeWidth={5} fill="none" strokeLinecap="round" />;
  } else {
    mund = <path d={`M-14,${my} Q0,${my + (ausdruck === 'stolz' ? 14 : 9)} 14,${my}`} stroke={dunkel} strokeWidth={5} fill="none" strokeLinecap="round" />;
  }
  return (
    <g>
      {augen(-24)}
      {augen(24)}
      {braue(-24, 1)}
      {braue(24, -1)}
      <path d={`M-3,${ey + 16} Q2,${ey + 22} 4,${ey + 16}`} stroke="rgba(0,0,0,0.25)" strokeWidth={4} fill="none" strokeLinecap="round" />
      <ellipse cx={-44} cy={ey + 26} rx={11} ry={7} fill="#FF7B7B" opacity={0.35} />
      <ellipse cx={44} cy={ey + 26} rx={11} ry={7} fill="#FF7B7B" opacity={0.35} />
      {mund}
      {brille ? (
        <g stroke={dunkel} strokeWidth={4} fill="none">
          <circle cx={-24} cy={ey} r={19} />
          <circle cx={24} cy={ey} r={19} />
          <path d={`M-5,${ey - 2} L5,${ey - 2}`} />
        </g>
      ) : null}
    </g>
  );
};

/** Ein Mensch. Ursprung: Mitte zwischen den Füßen. */
export const Figur: React.FC<FigurProps> = ({look, x, y, k = 1, ausdruck = 'neutral', blick = [0, 0], frame, seed = 'f', armL = 8, armR = 8, ellL = 6, ellR = 6, gehen, richtung = 1, neigung = 0, schweiss = 0, sx = 1, sy = 1}) => {
  // Laufzyklus: Beine gegenläufig, Knie beugen sich in der Schwungphase, Arme pendeln gegen.
  const g = gehen ?? 0;
  const laeuft = gehen !== undefined;
  const bein = (phase: number) => {
    const s = Math.sin(phase);
    return {o: laeuft ? s * 26 * richtung : 0, u: laeuft ? Math.max(0, -Math.cos(phase)) * -34 * richtung : 0};
  };
  const bL = bein(g);
  const bR = bein(g + Math.PI);
  const pendel = laeuft ? Math.sin(g) * 22 : 0;
  const huepf = laeuft ? -Math.abs(Math.cos(g)) * 8 : 0;
  // Atmen + Blinzeln
  const atem = Math.sin(frame / 16 + random(`${seed}-a`) * 6) * 2;
  const zyk = 110;
  const zi = Math.floor(frame / zyk);
  const blinkAt = zi * zyk + 20 + random(`${seed}-b-${zi}`) * 70;
  const blink = Math.max(0, 1 - Math.abs(frame - blinkAt) / 3);

  const hipY = -150;
  const schulterY = -286;
  const kleid = look.kleidung === 'kleid';
  const hand = <circle cx={0} cy={0} r={15} fill={look.haut} />;
  const schuh = <ellipse cx={richtung * 10} cy={4} rx={24} ry={12} fill={look.schuhe} />;

  return (
    <g transform={`translate(${x},${y}) scale(${k * sx},${k * sy})`}>
      <ellipse cx={0} cy={6} rx={70} ry={12} fill="rgba(30,60,40,0.14)" />
      <g transform={`translate(0,${huepf})`}>
        {/* Beine */}
        <Glied x={-22} y={hipY} w1={bL.o} w2={bL.u} l1={78} l2={72} farbe={look.unten} ende={schuh} />
        <Glied x={22} y={hipY} w1={bR.o} w2={bR.u} l1={78} l2={72} farbe={look.unten} ende={schuh} />
        {/* Arme hinter dem Körper ansetzen */}
        <Glied x={-50} y={schulterY + 10} w1={-armL + (laeuft ? -pendel * richtung : 0)} w2={-ellL} l1={68} l2={62} farbe={look.oben} ende={hand} />
        <Glied x={50} y={schulterY + 10} w1={armR + (laeuft ? pendel * richtung : 0)} w2={ellR} l1={68} l2={62} farbe={look.oben} ende={hand} />
        {/* Rumpf */}
        <g transform={`translate(0,${-atem})`}>
          {kleid ? (
            <path d={`M-58,${schulterY} Q-62,${schulterY - 14} -44,${schulterY - 16} L44,${schulterY - 16} Q62,${schulterY - 14} 58,${schulterY} L82,${hipY + 70} Q0,${hipY + 84} -82,${hipY + 70} Z`} fill={look.oben} />
          ) : (
            <path d={`M-58,${schulterY} Q-62,${schulterY - 14} -44,${schulterY - 16} L44,${schulterY - 16} Q62,${schulterY - 14} 58,${schulterY} L52,${hipY + 4} Q0,${hipY + 14} -52,${hipY + 4} Z`} fill={look.oben} />
          )}
          {look.kleidung === 'anzug' ? (
            <g>
              <path d={`M-22,${schulterY - 16} L0,${schulterY + 40} L22,${schulterY - 16} Z`} fill="#FFFFFF" />
              {look.krawatte ? <path d={`M-7,${schulterY - 6} L7,${schulterY - 6} L10,${schulterY + 60} L0,${schulterY + 74} L-10,${schulterY + 60} Z`} fill={look.krawatte} /> : null}
              <path d={`M-22,${schulterY - 16} L-8,${schulterY + 58}`} stroke="rgba(0,0,0,0.25)" strokeWidth={4} />
              <path d={`M22,${schulterY - 16} L8,${schulterY + 58}`} stroke="rgba(0,0,0,0.25)" strokeWidth={4} />
            </g>
          ) : null}
          {look.kleidung === 'jacke' ? <path d={`M0,${schulterY - 14} L0,${hipY + 8}`} stroke="rgba(0,0,0,0.18)" strokeWidth={4} /> : null}
          {look.kleidung === 'pulli' ? <path d={`M-24,${schulterY - 16} Q0,${schulterY + 6} 24,${schulterY - 16}`} stroke="rgba(0,0,0,0.18)" strokeWidth={5} fill="none" /> : null}
          {/* Hals + Kopf */}
          <rect x={-14} y={schulterY - 30} width={28} height={20} rx={8} fill={look.haut} />
          <g transform={`rotate(${neigung}, 0, ${schulterY - 30})`}>
            <Haare look={look} hinten />
            <circle cx={-70} cy={-372} r={14} fill={look.haut} />
            <circle cx={70} cy={-372} r={14} fill={look.haut} />
            <circle cx={0} cy={-372} r={72} fill={look.haut} />
            <Haare look={look} />
            <Gesicht ausdruck={ausdruck} blick={blick} blink={blink} brille={look.brille} />
            {schweiss > 0 ? (
              <path
                d={`M66,${-430 + schweiss * 10} q12,18 0,26 q-12,-8 0,-26 Z`}
                fill="#7CC8FF"
                stroke="#4BA3E3"
                strokeWidth={2}
                opacity={Math.min(1, schweiss * 2)}
              />
            ) : null}
          </g>
        </g>
      </g>
    </g>
  );
};
