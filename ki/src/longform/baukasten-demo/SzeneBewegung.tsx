import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {evolvePath, getPointAtLength, getLength} from '@remotion/paths';
import {Circle, Star, Triangle} from '@remotion/shapes';
import {Trail} from '@remotion/motion-blur';
import {noise2D} from '@remotion/noise';
import {
  Breathe, CLAMP, E, Float, Lucide, PerCharRise, Perspective3DFlip,
  ShapeRing, Shake, StampImpact, WhipIn, ZoomPunch, prog,
} from '@studio/core';
import {BRAND} from '../../../brand/brand';

/**
 * Szene 4 — zwoelf verschiedene Bewegungsarten nebeneinander.
 *
 * Der Punkt dieser Szene ist die Abwechslung selbst: keine Kachel bewegt sich
 * wie die daneben. Ein Video, in dem alles gleich einfaehrt, wirkt tot, auch
 * wenn dauernd etwas passiert.
 *
 * Woher die Mechanik kommt:
 *   @remotion/paths        — Pfad zeichnet sich, Punkt laeuft darauf entlang
 *   @remotion/shapes       — fertige Formen mit sauberen Pfaden
 *   @remotion/motion-blur  — Bewegungsspur
 *   @remotion/noise        — organisches Treiben statt Sinus
 *   @studio/core           — Float, Breathe, WhipIn, ZoomPunch, Shake, Stamp,
 *                            Perspective3DFlip, PerCharRise, ShapeRing
 */

const KACHEL = 268;
const purple = BRAND.accentDk;
const accent = BRAND.accent;

const Kachel: React.FC<{titel: string; at: number; children: React.ReactNode}> = ({
  titel, at, children,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 20, E.out);
  return (
    <div style={{
      width: KACHEL, height: 214, borderRadius: 22,
      background: '#FBFAFD', border: '1px solid rgba(26,26,46,.08)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 10,
      opacity: p, translate: `0px ${(1 - p) * 16}px`,
      boxShadow: '0 14px 30px rgba(26,26,46,.05)',
      overflow: 'hidden', position: 'relative',
    }}>
      <div style={{
        height: 104, display: 'grid', placeItems: 'center', width: '100%',
      }}>{children}</div>
      <div style={{
        fontFamily: BRAND.font.body, fontWeight: 750, fontSize: 19,
        color: '#8D8197', letterSpacing: 0.2,
      }}>{titel}</div>
    </div>
  );
};

/** Ein Pfad, der sich zeichnet — statt zu erscheinen. */
const Zeichnen: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const d = 'M6 46 C 30 6, 58 86, 84 34 S 118 12, 134 48';
  const {strokeDasharray, strokeDashoffset} = evolvePath(prog(f, at, at + 46, E.out), d);
  return (
    <svg width={140} height={92} viewBox="0 0 140 92" fill="none">
      <path d={d} stroke={purple} strokeWidth={5} strokeLinecap="round"
        strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
    </svg>
  );
};

/** Ein Punkt faehrt eine Bahn ab — Bewegung entlang eines Pfades. */
const AufBahn: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const d = 'M10 46 C 42 4, 74 88, 130 40';
  const len = getLength(d);
  const t = (Math.max(0, f - at) / 62) % 1;
  const pt = getPointAtLength(d, len * t);
  return (
    <svg width={140} height={92} viewBox="0 0 140 92" fill="none">
      <path d={d} stroke="rgba(110,69,201,.22)" strokeWidth={3} strokeLinecap="round" strokeDasharray="7 8" />
      <circle cx={pt.x} cy={pt.y} r={9} fill={accent} />
    </svg>
  );
};

/** Formwechsel: Kreis, Dreieck, Stern loesen einander ab. */
const Formen: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const i = Math.floor(Math.max(0, f - at) / 34) % 3;
  const puls = prog(f, at + i * 34, at + i * 34 + 18, E.spring);
  const gemein = {fill: purple};
  return (
    <div style={{scale: 0.82 + puls * 0.18, display: 'grid', placeItems: 'center'}}>
      {i === 0 ? <Circle radius={44} {...gemein} />
        : i === 1 ? <Triangle length={92} direction="up" {...gemein} />
        : <Star innerRadius={22} outerRadius={46} points={5} {...gemein} />}
    </div>
  );
};

/** Organisches Treiben — Rauschen statt Sinus, wirkt nie mechanisch. */
const Treiben: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'relative', width: 140, height: 92}}>
      {[0, 1, 2, 3, 4].map((i) => {
        const x = noise2D('drift-x', i * 3.7, f / 120) * 52;
        const y = noise2D('drift-y', i * 5.1, f / 120) * 32;
        return (
          <div key={i} style={{
            position: 'absolute', left: 62 + x, top: 38 + y,
            width: 17, height: 17, borderRadius: 999,
            background: i % 2 === 0 ? purple : accent, opacity: 0.85,
          }} />
        );
      })}
    </div>
  );
};

/** Bewegungsspur — das Element zieht nach. */
const Spur: React.FC = () => {
  const f = useCurrentFrame();
  const x = Math.sin((f / 44) * Math.PI * 2) * 44;
  return (
    <Trail layers={7} lagInFrames={1.4} trailOpacity={0.55}>
      <div style={{
        width: 52, height: 52, borderRadius: 16, background: purple,
        translate: `${x}px 0px`,
      }} />
    </Trail>
  );
};

/** Zahl laeuft hoch. */
const Zaehlen: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const v = interpolate(prog(f, at, at + 54, E.out), [0, 1], [0, 128], CLAMP);
  return (
    <div style={{
      fontFamily: BRAND.font.body, fontWeight: 900, fontSize: 62,
      color: purple, letterSpacing: -2,
    }}>{Math.round(v)}</div>
  );
};

/** Maske wischt das Bild frei. */
const Wischen: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 40, E.out);
  return (
    <div style={{
      width: 132, height: 78, borderRadius: 14,
      background: `linear-gradient(120deg, ${purple}, ${accent})`,
      clipPath: `inset(0 ${(1 - p) * 100}% 0 0 round 14px)`,
    }} />
  );
};

export const SzeneBewegung: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{
      background: '#FFFFFF', fontFamily: BRAND.font.body,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 34, padding: 60,
    }}>
      <PerCharRise text="Zwölf Bewegungsarten" at={2} per={1.6} size={54}
        color={purple} weight={900} />

      <div style={{display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1740}}>
        <Kachel titel="zeichnen" at={14}><Zeichnen at={22} /></Kachel>

        <Kachel titel="auf Bahn" at={20}><AufBahn at={30} /></Kachel>

        <Kachel titel="Form wechseln" at={26}><Formen at={36} /></Kachel>

        <Kachel titel="treiben" at={32}><Treiben /></Kachel>

        <Kachel titel="Spur ziehen" at={38}><Spur /></Kachel>

        <Kachel titel="zählen" at={44}><Zaehlen at={54} /></Kachel>

        <Kachel titel="wischen" at={50}><Wischen at={60} /></Kachel>

        <Kachel titel="schweben" at={56}>
          <Float amp={13} speed={0.9}>
            <Lucide name="bot" size={62} color={purple} stroke={1.9} glow={false} />
          </Float>
        </Kachel>

        <Kachel titel="atmen" at={62}>
          <Breathe amp={0.09} speed={1.2}>
            <Lucide name="brain" size={62} color={purple} stroke={1.9} glow={false} />
          </Breathe>
        </Kachel>

        <Kachel titel="einschlagen" at={68}>
          <StampImpact at={82}>
            <Lucide name="target" size={62} color={purple} stroke={1.9} glow={false} />
          </StampImpact>
        </Kachel>

        <Kachel titel="kippen" at={74}>
          <Perspective3DFlip at={90} dur={26}>
            <Lucide name="repeat" size={62} color={purple} stroke={1.9} glow={false} />
          </Perspective3DFlip>
        </Kachel>

        <Kachel titel="wackeln" at={80}>
          <Shake at={98} strength={9} durFrames={22}>
            <Lucide name="triangle-alert" size={62} color="#C0485A" stroke={1.9} glow={false} />
          </Shake>
        </Kachel>

        <Kachel titel="hereinpeitschen" at={86}>
          <WhipIn at={102} dir="left" dist={130}>
            <Lucide name="zap" size={62} color={purple} stroke={1.9} glow={false} />
          </WhipIn>
        </Kachel>

        <Kachel titel="Zoom-Schlag" at={92}>
          <ZoomPunch at={108} from={2.2}>
            <Lucide name="sparkles" size={62} color={purple} stroke={1.9} glow={false} />
          </ZoomPunch>
        </Kachel>

        <Kachel titel="Ring dreht" at={98}>
          <svg width={140} height={104} viewBox="0 0 140 104" style={{overflow: 'visible'}}>
            <ShapeRing cx={70} cy={52} radius={40} at={112} color={purple} strokeWidth={4} dashed />
          </svg>
        </Kachel>
      </div>
    </AbsoluteFill>
  );
};
