import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';

/**
 * Bewegungs-Bausteine fuer die Longform-Visuals.
 *
 * Grundsatz: ein Visual Beat ist ein sichtbarer Zustandswechsel, kein
 * Ein-/Ausblenden. Reine Opacity liest sich im fertigen Video wie ein
 * Standbild, das langsam heller wird — deshalb traegt hier jeder Baustein
 * eine eigene Mechanik: Richtung, Sprung, Zeichnen oder Zaehlen.
 */

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Fliegt aus einer Richtung ein und rastet ein. */
export const Rise: React.FC<{
  at: number;
  from?: 'bottom' | 'top' | 'left' | 'right';
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({at, from = 'bottom', distance = 34, children, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({
    frame: frame - at,
    fps,
    config: {damping: 190, mass: 0.7},
    durationInFrames: 30,
  });
  const offset = (1 - enter) * distance;
  const shift =
    from === 'bottom' ? `translateY(${offset}px)`
    : from === 'top' ? `translateY(${-offset}px)`
    : from === 'left' ? `translateX(${-offset}px)`
    : `translateX(${offset}px)`;
  return <div style={{...style, opacity: enter, transform: shift}}>{children}</div>;
};

/** Springt auf — fuer Elemente, die eine Entscheidung oder ein Ergebnis markieren. */
export const Pop: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({at, children, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({
    frame: frame - at,
    fps,
    config: {damping: 11, mass: 0.5, stiffness: 120},
    durationInFrames: 34,
  });
  return (
    <div style={{...style, opacity: Math.min(1, enter * 1.6), transform: `scale(${0.72 + enter * 0.28})`}}>
      {children}
    </div>
  );
};

/**
 * Schluesselwort mit eigener Mechanik: Der Marker faehrt unter dem Wort
 * durch, dann nimmt das Wort die Akzentfarbe an. Fuer genau die Begriffe,
 * die der Sprecher an dieser Stelle betont.
 */
export const Keyword: React.FC<{
  at: number;
  children: React.ReactNode;
  tone?: 'accent' | 'warn';
  size?: number;
}> = ({at, children, tone = 'accent', size = 30}) => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [at, at + 20], [0, 1], clamp);
  const colorize = interpolate(frame, [at + 10, at + 26], [0, 1], clamp);
  const lift = interpolate(frame, [at, at + 18], [0, 1], clamp);
  const base = tone === 'warn' ? '#B64D58' : BRAND.accentDk;
  const wash = tone === 'warn' ? 'rgba(182,77,88,.16)' : 'rgba(185,140,255,.30)';
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        fontFamily: BRAND.font.body,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: -0.6,
        color: `color-mix(in srgb, ${base} ${colorize * 100}%, ${BRAND.ink})`,
        transform: `translateY(${(1 - lift) * 6}px)`,
        padding: '0 3px',
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: 0,
          bottom: 2,
          height: size * 0.42,
          width: `${sweep * 100}%`,
          borderRadius: 6,
          background: wash,
          zIndex: -1,
        }}
      />
      {children}
    </span>
  );
};

/** Zeichnet einen SVG-Pfad ein, statt ihn erscheinen zu lassen. */
export const DrawPath: React.FC<{
  at: number;
  d: string;
  length?: number;
  width?: number;
  color?: string;
  duration?: number;
  dashed?: boolean;
}> = ({at, d, length = 600, width = 2.4, color = BRAND.accent, duration = 40, dashed}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [at, at + duration], [0, 1], clamp);
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dashed ? '9 11' : length}
      strokeDashoffset={dashed ? 0 : length * (1 - draw)}
      opacity={dashed ? draw : 1}
    />
  );
};

/** Zaehlt eine Zahl hoch. Nur fuer Werte, die der Sprecher wirklich nennt. */
export const Count: React.FC<{
  at: number;
  to: number;
  suffix?: string;
  duration?: number;
  style?: React.CSSProperties;
}> = ({at, to, suffix = '', duration = 34, style}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [at, at + duration], [0, 1], clamp);
  return (
    <span style={{fontFamily: BRAND.font.body, fontWeight: 900, ...style}}>
      {Math.round(to * progress)}
      {suffix}
    </span>
  );
};

/**
 * Laufender Puls entlang einer Verbindung — zeigt, dass gerade etwas
 * fliesst, ohne Deko zu sein. Nur einsetzen, wo tatsaechlich etwas
 * uebergeben wird.
 */
export const FlowDot: React.FC<{
  at: number;
  from: {x: number; y: number};
  to: {x: number; y: number};
  duration?: number;
  color?: string;
}> = ({at, from, to, duration = 46, color = BRAND.accentDk}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + duration], [0, 1], clamp);
  const visible = frame >= at && t < 1;
  return (
    <circle
      cx={from.x + (to.x - from.x) * t}
      cy={from.y + (to.y - from.y) * t}
      r={7}
      fill={color}
      opacity={visible ? 1 : 0}
    />
  );
};
