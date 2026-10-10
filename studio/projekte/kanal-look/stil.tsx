import React, {createContext, useContext} from 'react';
import rough from 'roughjs';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';

/**
 * Kanal-Stil: Farben, Formen, Hintergrund und das Token-Wesen.
 * Farben mit fester Bedeutung: ki = was die KI erzeugt (Token-Wesen),
 * mensch = Eingabe, gut = richtig, fehler = falsch.
 */

export type Stil = {
  label: string;
  bg: string;
  surface: string;
  ink: string;
  inkSoft: string;
  faint: string;
  line: string;
  mensch: string;
  ki: string;
  kiInk: string;
  gut: string;
  fehler: string;
  head: string;
  headWeight: number;
  body: string;
  hand: string;
  /** Handgezeichnete, leicht zitternde Linien. */
  rough: boolean;
  /** Konturstärke um Flächen (0 = keine). */
  outline: number;
  /** Harter, versetzter Schatten (Pop). */
  hardShadow: boolean;
  /** Weicher Schatten als CSS drop-shadow. */
  softShadow: string | null;
  pattern: 'none' | 'korn' | 'raster' | 'punkte' | 'blobs' | 'verlauf' | 'vignette';
  blobs?: string[];
  titleStyle: 'farbe' | 'marker' | 'block';
  /** Versetzter Farbschatten auf Schrift (Riso-Druck). */
  misprint?: string;
  kiGradient?: [string, string];
};

export const BASIS = {
  body: 'Inter, sans-serif',
  rough: false,
  outline: 0,
  hardShadow: false,
  softShadow: null,
  pattern: 'none',
  titleStyle: 'farbe',
} as const;

/** Der Kanal-Look: hell und klar, warme Pastell-Akzente, Koralle = KI. */
export const KANAL: Stil = {
  ...BASIS,
  label: 'Kanal',
  bg: '#F7F6F2',
  surface: '#FFFFFF',
  ink: '#15181D',
  inkSoft: '#5B6270',
  faint: '#C5C9CF',
  line: '#E8E8EA',
  mensch: '#15181D',
  ki: '#FF7A59',
  kiInk: '#FFFFFF',
  gut: '#1FA971',
  fehler: '#E5484D',
  head: 'Inter, sans-serif',
  headWeight: 800,
  hand: 'Caveat, cursive',
  softShadow: '0 18px 34px rgba(30,35,50,0.10)',
  pattern: 'blobs',
};

/** Serien: Erkennungsfarbe + helle Tönung für Hintergrundformen. */
export const SERIEN = {
  news: {label: 'KI-News', farbe: '#3D7BFF', tint: '#E4EDFF', tint2: '#EEF3FF'},
  test: {label: 'Tool-Test', farbe: '#8B5CF6', tint: '#EFE8FE', tint2: '#F5F1FE'},
  erklaert: {label: 'KI erklärt', farbe: '#E9A800', tint: '#FFF2C8', tint2: '#FFF7DE'},
  recht: {label: 'Recht & Gesellschaft', farbe: '#0E9F8E', tint: '#DBF3EF', tint2: '#ECF8F5'},
} as const;
export type SerieName = keyof typeof SERIEN;

export const StilContext = createContext<Stil>(KANAL);
export const useStil = () => useContext(StilContext);

/* ───────────── Formen ───────────── */

const gen = rough.generator();

export const rounded = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x + r} Q${x},${y + h} ${x},${y + h - r} V${y + r} Q${x},${y} ${x + r},${y} Z`;

type ShapeProps = {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  dashed?: boolean;
  seed: number;
  opacity?: number;
  /** Fläche mit Schatten des Designs (Objekte, nicht Linien). */
  elevate?: boolean;
};

/** Pfad im Stil des Designs – glatt oder handgezeichnet ("boiling", alle 4 Frames neu). */
export const Shape: React.FC<ShapeProps> = ({d, fill, stroke, strokeWidth = 4, dashed, seed, opacity = 1, elevate}) => {
  const s = useStil();
  const frame = useCurrentFrame();
  const hard = elevate && s.hardShadow && fill ? <path d={d} transform="translate(8,8)" fill={s.ink} /> : null;
  const style = elevate && s.softShadow ? {filter: `drop-shadow(${s.softShadow})`} : undefined;
  if (!s.rough) {
    return (
      <g opacity={opacity} style={style}>
        {hard}
        <path d={d} fill={fill ?? 'none'} stroke={stroke ?? 'none'} strokeWidth={strokeWidth} strokeDasharray={dashed ? '18 14' : undefined} strokeLinecap="round" />
      </g>
    );
  }
  const drawable = gen.path(d, {
    seed: seed * 7 + (Math.floor(frame / 4) % 3),
    roughness: 1.1,
    bowing: 0.8,
    stroke: stroke ?? 'none',
    strokeWidth,
    fill,
    fillStyle: 'solid',
    disableMultiStroke: dashed,
  });
  return (
    <g opacity={opacity} style={style}>
      {hard}
      {gen.toPaths(drawable).map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          fill={p.fill ?? 'none'}
          strokeDasharray={dashed && p.stroke !== 'none' ? '18 14' : undefined}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
};

/* ───────────── Token-Wesen ───────────── */

export type Blick = [x: number, y: number];

/** Gesichtsausdrücke. Einzelne Props (smile, look …) überschreiben die Vorgabe. */
export type Gesicht = 'neutral' | 'freude' | 'staunen' | 'denken' | 'ernst' | 'verwirrt' | 'traurig';

type Mund = 'linie' | 'flach' | 'offen' | 'o' | 'welle' | 'klein';
type GesichtVorgabe = {
  smile: number;
  mund: Mund;
  mouthO?: number;
  /** Augenbrauen [links, rechts]: Neigung (+ = böse/ernst, − = traurig) und Höhe (+ = hochgezogen). */
  brauen?: {neigung: [number, number]; hoch: [number, number]};
  froh?: number;
  augenGross?: number;
  look?: Blick;
};

const GESICHTER: Record<Gesicht, GesichtVorgabe> = {
  neutral: {smile: 0.4, mund: 'linie'},
  freude: {smile: 1, mund: 'offen', froh: 1},
  staunen: {smile: 0, mund: 'o', mouthO: 0.8, brauen: {neigung: [0, 0], hoch: [1, 1]}, augenGross: 1.15},
  denken: {smile: 0, mund: 'klein', brauen: {neigung: [0, 0], hoch: [0.7, 0]}, look: [0.6, -0.9]},
  ernst: {smile: 0, mund: 'flach', brauen: {neigung: [1, 1], hoch: [0, 0]}},
  verwirrt: {smile: 0, mund: 'welle', brauen: {neigung: [0, 0.7], hoch: [1, 0]}, look: [-0.3, -0.2]},
  traurig: {smile: -0.6, mund: 'linie', brauen: {neigung: [-1, -1], hoch: [0.3, 0.3]}, look: [0, 0.6]},
};

type TokiProps = {
  /** Fußpunkt (unten Mitte) in Bildkoordinaten. */
  x: number;
  y: number;
  sx?: number;
  sy?: number;
  rot?: number;
  gesicht?: Gesicht;
  look?: Blick;
  /** Blinzeln von außen (0–1). Ohne Angabe blinzelt das Wesen von selbst. */
  blink?: number;
  /** −1 = traurig, 0 = neutral, 1 = breites Lächeln. */
  smile?: number;
  label?: string;
  labelIn?: number;
  /** Offener Mund (staunen, rufen, sprechen). */
  mouthO?: number;
  /** Arme in Grad: 0 = hängt, 90 = waagrecht zur Seite, 170 = nach oben. */
  armL?: number;
  armR?: number;
  /** Atmen und Wippen im Stand (Standard an). */
  idle?: boolean;
  seed?: string;
  /** Gesamtgröße. */
  k?: number;
};

export const SVG_W = 300;
export const SVG_H = 290;
export const FOOT_Y = 262;
export const BODY = {x: 45, y: 62, w: 210, h: 172};
const DUNKEL_TINTE = '#16130E';

/** Natürliches Blinzeln alle 3–5 s, deterministisch. */
const autoBlink = (frame: number, seed: string) => {
  const cycle = 120;
  const i = Math.floor(frame / cycle);
  const at = i * cycle + 25 + random(`${seed}-blink-${i}`) * 80;
  return Math.max(0, 1 - Math.abs(frame - at) / 3);
};

export const Toki: React.FC<TokiProps> = ({
  x,
  y,
  sx = 1,
  sy = 1,
  rot = 0,
  gesicht = 'neutral',
  look,
  blink,
  smile,
  label,
  labelIn = 1,
  mouthO,
  armL = 18,
  armR = 18,
  idle = true,
  seed = 'toki',
  k = 1,
}) => {
  const s = useStil();
  const frame = useCurrentFrame();
  const g = GESICHTER[gesicht];
  const lookF = look ?? g.look ?? [0, 0];
  const smileF = smile ?? g.smile;
  const mouthOF = mouthO ?? g.mouthO ?? 0;
  const blinkF = blink ?? autoBlink(frame, seed);
  const froh = g.froh ?? 0;
  const augenGross = g.augenGross ?? 1;

  // Atmen: Körper wird minimal höher/schmaler. Endlos-Schleife, daher Sinus.
  const breath = idle ? Math.sin(frame / 16 + random(`${seed}-atem`) * 6) : 0;
  const bx = 1 - breath * 0.012;
  const by = 1 + breath * 0.02;

  const outlineW = s.rough ? 4.5 : s.outline;
  const outline = outlineW > 0 ? s.ink : undefined;
  const fill = s.kiGradient ? 'url(#toki-verlauf)' : s.ki;
  const eyeY = BODY.y + 52;
  const eyeOpen = 1 - blinkF;

  const auge = (cx: number) =>
    froh > 0.5 ? (
      <path d={`M${cx - 20},${eyeY + 8} Q${cx},${eyeY - 18} ${cx + 20},${eyeY + 8}`} stroke={DUNKEL_TINTE} strokeWidth={8} fill="none" strokeLinecap="round" />
    ) : (
      <g>
        <ellipse cx={cx} cy={eyeY} rx={22 * augenGross} ry={27 * augenGross * Math.max(0.08, eyeOpen)} fill="#FFFFFF" stroke={outline} strokeWidth={outlineW > 0 ? Math.min(3.5, outlineW) : 0} />
        {eyeOpen > 0.3 ? <circle cx={cx + lookF[0] * 9} cy={eyeY + lookF[1] * 11} r={augenGross > 1 ? 9 : 11} fill={DUNKEL_TINTE} /> : null}
        {eyeOpen > 0.3 ? <circle cx={cx + lookF[0] * 9 + 4} cy={eyeY + lookF[1] * 11 - 4} r={3.5} fill="#FFFFFF" /> : null}
      </g>
    );

  const braue = (cx: number, innen: 1 | -1, neigung: number, hoch: number) => {
    const base = eyeY - 40 - hoch * 12;
    const yOuter = base - neigung * 6;
    const yInner = base + neigung * 6;
    const x1 = cx - innen * 20;
    const x2 = cx + innen * 20;
    return <path d={`M${x1},${yOuter} L${x2},${yInner}`} stroke={DUNKEL_TINTE} strokeWidth={7} strokeLinecap="round" />;
  };

  const mouthY = BODY.y + (label ? 92 : 108);
  const mundFarbe = s.kiInk === '#FFFFFF' ? DUNKEL_TINTE : s.kiInk;
  let mund: React.ReactNode;
  if (mouthOF > 0.05) {
    mund = <ellipse cx={150} cy={mouthY + 4} rx={9 + mouthOF * 4} ry={7 + mouthOF * 8} fill={mundFarbe} />;
  } else if (g.mund === 'offen' && !label) {
    mund = (
      <g>
        <path d={`M${124},${mouthY - 4} Q150,${mouthY + 40} ${176},${mouthY - 4} Z`} fill={mundFarbe} />
        <path d={`M${136},${mouthY + 16} Q150,${mouthY + 6} ${164},${mouthY + 16} Q150,${mouthY + 30} ${136},${mouthY + 16} Z`} fill="#FF9E9E" />
      </g>
    );
  } else if (g.mund === 'welle') {
    mund = <path d={`M128,${mouthY + 4} q7,-8 11,0 t11,0 t11,0 t11,0`} stroke={mundFarbe} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
  } else if (g.mund === 'flach') {
    mund = <path d={`M132,${mouthY + 6} L168,${mouthY + 6}`} stroke={mundFarbe} strokeWidth={6} strokeLinecap="round" />;
  } else if (g.mund === 'klein') {
    mund = <path d={`M152,${mouthY + 6} L172,${mouthY + 3}`} stroke={mundFarbe} strokeWidth={6} strokeLinecap="round" />;
  } else {
    const w = 16 + Math.max(0, smileF) * 14;
    mund = <path d={`M${150 - w},${mouthY + (smileF < 0 ? 10 : 0)} Q150,${mouthY + 6 + smileF * 16} ${150 + w},${mouthY + (smileF < 0 ? 10 : 0)}`} stroke={mundFarbe} strokeWidth={6} fill="none" strokeLinecap="round" />;
  }

  // Arme: Kapsel ab der Schulter, hinter dem Körper gezeichnet; Hand als Kreis.
  const arm = (seite: 1 | -1, winkel: number) => {
    const sxp = seite < 0 ? BODY.x + 6 : BODY.x + BODY.w - 6;
    const syp = BODY.y + 104;
    const deg = seite < 0 ? winkel : -winkel;
    return (
      <g transform={`translate(${sxp},${syp}) rotate(${deg})`}>
        <Shape d={rounded(-13, -6, 26, 70, 13)} fill={fill} stroke={outline} strokeWidth={outlineW} seed={seite < 0 ? 13 : 14} />
        <circle cx={0} cy={66} r={17} fill={fill} stroke={outline} strokeWidth={outlineW} />
      </g>
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: x - SVG_W / 2,
        top: y - FOOT_Y,
        width: SVG_W,
        height: SVG_H,
        transform: `rotate(${rot}deg) scale(${sx * k * bx}, ${sy * k * by})`,
        transformOrigin: `50% ${(FOOT_Y / SVG_H) * 100}%`,
      }}
    >
      <svg width={SVG_W} height={SVG_H} style={{overflow: 'visible'}}>
        {s.kiGradient ? (
          <defs>
            <linearGradient id="toki-verlauf" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0" stopColor={s.kiGradient[0]} />
              <stop offset="1" stopColor={s.kiGradient[1]} />
            </linearGradient>
          </defs>
        ) : null}
        {arm(-1, armL)}
        {arm(1, armR)}
        <Shape d={rounded(98, 222, 34, 40, 14)} fill={fill} stroke={outline} strokeWidth={outlineW} seed={11} />
        <Shape d={rounded(168, 222, 34, 40, 14)} fill={fill} stroke={outline} strokeWidth={outlineW} seed={12} />
        <Shape d={rounded(BODY.x, BODY.y, BODY.w, BODY.h, 46)} fill={fill} stroke={outline} strokeWidth={outlineW} seed={10} elevate />
        {s.rough || s.hardShadow ? null : <path d={rounded(BODY.x + 18, BODY.y + 10, BODY.w - 36, 24, 12)} fill="#FFFFFF" opacity={s.kiGradient ? 0.32 : 0.2} />}
        {froh > 0.5 ? (
          <>
            <ellipse cx={150 - 62} cy={eyeY + 34} rx={16} ry={10} fill="#FF4F6D" opacity={0.25} />
            <ellipse cx={150 + 62} cy={eyeY + 34} rx={16} ry={10} fill="#FF4F6D" opacity={0.25} />
          </>
        ) : null}
        {auge(150 - 38)}
        {auge(150 + 38)}
        {g.brauen ? braue(150 - 38, 1, g.brauen.neigung[0], g.brauen.hoch[0]) : null}
        {g.brauen ? braue(150 + 38, -1, g.brauen.neigung[1], g.brauen.hoch[1]) : null}
        {mund}
        {label ? (
          <text x={150} y={BODY.y + 150} textAnchor="middle" fontFamily={s.rough ? s.hand : s.head} fontWeight={s.rough ? 700 : s.headWeight} fontSize={s.rough ? 58 : 44} fill={s.kiInk} opacity={labelIn}>
            {label}
          </text>
        ) : null}
      </svg>
    </div>
  );
};

/* ───────────── Hintergrund ───────────── */

/** Bühne im Stil des Designs. `blobs` überschreibt die Farben der Hintergrundformen (z. B. Serien-Tönung). */
export const Hintergrund: React.FC<{blobs?: string[]}> = ({blobs: blobsProp}) => {
  const s = useStil();
  const p = s.pattern;
  const blobs = blobsProp ?? s.blobs;
  return (
    <AbsoluteFill style={{background: p === 'verlauf' ? `linear-gradient(160deg, ${s.bg} 0%, ${s.surface} 70%)` : s.bg}}>
      {p === 'korn' ? (
        <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.35, mixBlendMode: 'multiply'}}>
          <filter id="korn">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} />
            <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.28  0 0 0 0.35 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#korn)" />
        </svg>
      ) : null}
      {p === 'raster' ? (
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${s.line} 2px, transparent 2px), linear-gradient(90deg, ${s.line} 2px, transparent 2px)`,
            backgroundSize: '48px 48px',
            backgroundPosition: '-1px -1px',
          }}
        />
      ) : null}
      {p === 'punkte' ? <AbsoluteFill style={{backgroundImage: `radial-gradient(${s.faint} 2.2px, transparent 2.6px)`, backgroundSize: '36px 36px', opacity: 0.55}} /> : null}
      {p === 'blobs' && blobs ? (
        <>
          <div style={{position: 'absolute', left: -220, top: 560, width: 900, height: 900, borderRadius: '50%', background: blobs[0]}} />
          <div style={{position: 'absolute', right: -160, top: -300, width: 760, height: 760, borderRadius: '50%', background: blobs[1]}} />
          {blobs[2] ? <div style={{position: 'absolute', right: 380, bottom: -440, width: 620, height: 620, borderRadius: '50%', background: blobs[2]}} /> : null}
        </>
      ) : null}
      {p === 'vignette' ? <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 60% at 50% 45%, #171920 0%, rgba(14,15,19,0) 70%)'}} /> : null}
    </AbsoluteFill>
  );
};
