import React from 'react';
import {useCurrentFrame} from 'remotion';
import {E, prog} from '@studio/core';
import {BRAND} from '../../../brand/brand';

/**
 * Untertitel zum Mitlesen — Ersatz fuer das Voiceover.
 *
 * Solange kein Ton aufgenommen ist, steht hier, was gesagt wuerde. Damit
 * laesst sich pruefen, ob Bild und Aussage zusammenpassen, ohne vorher ins
 * Studio zu gehen.
 *
 * Das Wort, das gerade "faellt", wird hervorgehoben: Die Zeile laeuft in
 * Lesegeschwindigkeit durch, nicht schlagartig. Dadurch sieht man auch ohne
 * Ton, an welcher Stelle des Satzes welches Bild dazukommt.
 */

export type Beat = {
  /** Was gesagt wird. */
  text: string;
  /** Frame, ab dem der Satz steht. */
  ab: number;
  /** Wie lange er stehen bleibt. */
  dauer: number;
};

/** Frames, die ein Satz zum Lesen braucht — grob 13 Zeichen je Sekunde. */
export const lesedauer = (text: string, fps = 30) =>
  Math.max(2.2 * fps, Math.ceil((text.length / 13) * fps));

/** Baut aus Saetzen eine Kette mit fortlaufenden Startframes. */
export const kette = (saetze: string[], start = 0, pause = 8): Beat[] => {
  const out: Beat[] = [];
  let ab = start;
  for (const text of saetze) {
    const dauer = lesedauer(text);
    out.push({text, ab, dauer});
    ab += dauer + pause;
  }
  return out;
};

export const Untertitel: React.FC<{beats: Beat[]}> = ({beats}) => {
  const f = useCurrentFrame();
  const aktiv = beats.find((b) => f >= b.ab && f < b.ab + b.dauer);
  if (!aktiv) return null;

  const woerter = aktiv.text.split(' ');
  // Wieviele Woerter sind bei diesem Frame "gesprochen"?
  const anteil = (f - aktiv.ab) / (aktiv.dauer * 0.82);
  const bis = Math.min(woerter.length, Math.floor(anteil * woerter.length) + 1);

  const ein = prog(f, aktiv.ab, aktiv.ab + 10, E.out);
  const aus = 1 - prog(f, aktiv.ab + aktiv.dauer - 9, aktiv.ab + aktiv.dauer, E.out);

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 78,
      display: 'flex', justifyContent: 'center',
      opacity: ein * aus,
    }}>
      <div style={{
        maxWidth: 1500, padding: '22px 40px', borderRadius: 18,
        background: 'rgba(255,255,255,.93)',
        border: '1px solid rgba(26,26,46,.08)',
        boxShadow: '0 18px 46px rgba(26,26,46,.10)',
        translate: `0px ${(1 - ein) * 14}px`,
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.34em',
      }}>
        {woerter.map((wort, i) => {
          const da = i < bis;
          const frisch = i === bis - 1;
          return (
            <span key={`${wort}-${i}`} style={{
              fontFamily: BRAND.font.body, fontWeight: 800, fontSize: 41,
              lineHeight: 1.28, letterSpacing: -0.4,
              color: frisch ? BRAND.accentDk : da ? BRAND.ink : 'rgba(26,26,46,.18)',
            }}>{wort}</span>
          );
        })}
      </div>
    </div>
  );
};
