import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useLayout} from './layout';
import {EASE, progress} from './motion';

type SafeAreaProps = {
  children: React.ReactNode;
  /** Inhalte vertikal: oben, mittig oder unten anordnen. */
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: number;
  style?: React.CSSProperties;
};

/** Bühne innerhalb der sicheren Zone des aktuellen Formats. */
export const SafeArea: React.FC<SafeAreaProps> = ({children, justify = 'center', align = 'center', gap = 40, style}) => {
  const {safe} = useLayout();
  return (
    <AbsoluteFill
      style={{
        padding: `${safe.top}px ${safe.side}px ${safe.bottom}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: justify,
        alignItems: align,
        gap,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export type CameraKey = {at: number; zoom?: number; x?: number; y?: number; rotate?: number};

type CameraRigProps = {
  keys: CameraKey[];
  children: React.ReactNode;
};

/**
 * Kamerafahrt über die ganze Szene: zwischen Schlüsselbildern wird weich
 * gezoomt/geschwenkt. x/y in px verschieben den Bildinhalt.
 */
export const CameraRig: React.FC<CameraRigProps> = ({keys, children}) => {
  const frame = useCurrentFrame();
  const sorted = [...keys].sort((a, b) => a.at - b.at);
  const value = (k: keyof Omit<CameraKey, 'at'>, fallback: number) => {
    if (sorted.length === 0) return fallback;
    let prev = sorted[0];
    for (const next of sorted) {
      if (frame < next.at) {
        if (next === prev) return prev[k] ?? fallback;
        const t = progress(frame, prev.at, next.at - prev.at, 'inOut');
        return interpolate(t, [0, 1], [prev[k] ?? fallback, next[k] ?? fallback]);
      }
      prev = next;
    }
    return prev[k] ?? fallback;
  };
  const zoom = value('zoom', 1);
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${value('x', 0)}px, ${value('y', 0)}px) scale(${zoom}) rotate(${value('rotate', 0)}deg)`,
        transformOrigin: '50% 50%',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export type CursorKey = {at: number; x: number; y: number};

type CursorProps = {
  path: CursorKey[];
  /** Frames, an denen geklickt wird (Welle + kurzes Eindrücken). */
  clicks?: number[];
  size?: number;
};

/** Mauszeiger, der weich zwischen Punkten fährt und klickt. */
export const Cursor: React.FC<CursorProps> = ({path, clicks = [], size = 64}) => {
  const frame = useCurrentFrame();
  if (path.length === 0) return null;
  const sorted = [...path].sort((a, b) => a.at - b.at);
  let x = sorted[0].x;
  let y = sorted[0].y;
  for (let i = 1; i < sorted.length; i++) {
    const a = sorted[i - 1];
    const b = sorted[i];
    if (frame >= a.at) {
      const t = interpolate(frame, [a.at, b.at], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE.inOut});
      x = a.x + (b.x - a.x) * t;
      y = a.y + (b.y - a.y) * t;
    }
  }
  const appear = progress(frame, sorted[0].at - 8, 8, 'soft');
  const press = clicks.reduce((acc, c) => Math.max(acc, 1 - Math.abs(frame - c - 2) / 4), 0);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {clicks.map((c) => {
        const r = progress(frame, c, 18, 'out');
        if (frame < c || r >= 1) return null;
        return (
          <div
            key={c}
            style={{
              position: 'absolute',
              left: x - 60,
              top: y - 60,
              width: 120,
              height: 120,
              borderRadius: '50%',
              border: '6px solid rgba(110,69,201,0.7)',
              transform: `scale(${0.2 + r})`,
              opacity: 1 - r,
            }}
          />
        );
      })}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{
          position: 'absolute',
          left: x - size * 0.18,
          top: y - size * 0.08,
          opacity: appear,
          transform: `scale(${1 - Math.max(0, press) * 0.15})`,
          transformOrigin: '20% 10%',
          filter: 'drop-shadow(0 6px 10px rgba(20,10,40,0.3))',
        }}
      >
        <path d="M4.5 2.5 L19 13.2 L12.6 14.2 L16.2 21 L13.3 22.4 L9.8 15.6 L4.5 19.8 Z" fill="#FFFFFF" stroke="#16131F" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};

/** Alle Sounds: Kenney.nl, CC0. Anhören: Composition `Sound-Katalog` in `npm run studio`. */
export const SFX_FILES = {
  // Klicks & Bedienung
  click: 'click-ui.ogg',
  tap: 'tap.ogg',
  key: 'click-key.ogg',
  typing: 'keyboard-loop-texture.ogg',
  hover: 'hover.ogg',
  toggle: 'toggle.ogg',
  // Erscheinen & Bewegung
  pop: 'pop-soft.ogg',
  blip: 'blip.ogg',
  whoosh: 'whoosh-soft.ogg',
  whooshFast: 'whoosh-digital.ogg',
  swipe: 'swipe.ogg',
  swipeOut: 'swipe-out.ogg',
  slideIn: 'slide-in.ogg',
  swoosh: 'swoosh.ogg',
  // Treffer & Gewicht
  impact: 'impact-soft.ogg',
  thud: 'thud.ogg',
  punch: 'punch.ogg',
  punchHeavy: 'punch-heavy.ogg',
  boom: 'boom.ogg',
  tink: 'tink.ogg',
  bell: 'bell.ogg',
  // Ergebnis & Rückmeldung
  success: 'chime-success.ogg',
  successBig: 'success-big.ogg',
  notify: 'chime-notification.ogg',
  ding: 'ding.ogg',
  chime: 'chime.ogg',
  levelUp: 'level-up.ogg',
  question: 'question.ogg',
  error: 'error-buzz.ogg',
  wrong: 'wrong.ogg',
  // Spannung & Technik
  riser: 'riser-tension.ogg',
  riseShort: 'rise-short.ogg',
  fall: 'fall.ogg',
  reveal: 'reveal-swell.ogg',
  glitch: 'glitch-blip.ogg',
  think: 'ai-thinking-pulse.ogg',
  computing: 'computing.ogg',
  energy: 'energy.ogg',
  // Kurze Jingles (Endkarte, Logo)
  jingleSteel: 'jingle-steel.ogg',
  jinglePizzi: 'jingle-pizzi.ogg',
  jingleHit: 'jingle-hit.ogg',
} as const;

export type SfxName = keyof typeof SFX_FILES;

type SfxProps = {name: SfxName; at?: number; volume?: number};

/** Soundeffekt aus `studio/public/sfx` (Kenney, CC0) an einem Frame. */
export const Sfx: React.FC<SfxProps> = ({name, at = 0, volume = 0.6}) => (
  <Sequence from={at} name={`sfx:${name}`} layout="none">
    <Audio src={staticFile(`sfx/${SFX_FILES[name]}`)} volume={volume} />
  </Sequence>
);
