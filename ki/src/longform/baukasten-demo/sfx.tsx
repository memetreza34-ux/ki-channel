import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

/**
 * Tonspur aus dem vorhandenen Effekt-Satz.
 *
 * Unter `ki/public/sfx/` liegen seit Juli vierzehn kuratierte Effekte
 * (Kenney.nl, CC0, siehe `ki/public/ASSETS.md`) — bis jetzt hat sie kein Video
 * benutzt. `Sound.tsx` im Brand-Kit sieht zwar so aus, als koennte es das,
 * gibt aber nur `null` zurueck:
 *
 *     export const Sfx: React.FC = () => null;
 *
 * Deshalb hier eine echte Umsetzung.
 *
 * Grundregel: Ton nur dort, wo im Bild wirklich etwas passiert. Ein Klick, wenn
 * getippt wird; ein Chime, wenn ein Haken gesetzt wird; ein Einschlag, wenn
 * etwas landet. Dauerbeschallung macht ein Erklaervideo billig, nicht lebendig.
 */

export type SfxName =
  | 'click-ui' | 'click-key' | 'whoosh-soft' | 'whoosh-digital' | 'pop-soft'
  | 'chime-success' | 'chime-notification' | 'impact-soft' | 'riser-tension'
  | 'glitch-blip' | 'error-buzz' | 'keyboard-loop-texture' | 'ai-thinking-pulse'
  | 'reveal-swell';

/** Vorgabe-Lautstaerke je Effekt, damit nichts heraussticht. */
const PEGEL: Record<SfxName, number> = {
  'click-ui': 0.3,
  'click-key': 0.22,
  'whoosh-soft': 0.34,
  'whoosh-digital': 0.34,
  'pop-soft': 0.36,
  'chime-success': 0.42,
  'chime-notification': 0.38,
  'impact-soft': 0.44,
  'riser-tension': 0.3,
  'glitch-blip': 0.26,
  'error-buzz': 0.34,
  'keyboard-loop-texture': 0.16,
  'ai-thinking-pulse': 0.2,
  'reveal-swell': 0.34,
};

export type SfxCue = {
  /** Effektname, ohne Endung. */
  name: SfxName;
  /** Frame, an dem er losgeht. */
  at: number;
  /** Abweichende Lautstaerke, 0..1. */
  pegel?: number;
};

/** Spielt einen Effekt an genau einem Frame. */
export const Sfx: React.FC<SfxCue> = ({name, at, pegel}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={90} layout="none">
    <Audio src={staticFile(`sfx/${name}.ogg`)} volume={pegel ?? PEGEL[name]} />
  </Sequence>
);

/** Spielt eine ganze Liste ab. */
export const SfxSpur: React.FC<{cues: SfxCue[]}> = ({cues}) => (
  <>
    {cues.map((c, i) => (
      <Sfx key={`${c.name}-${c.at}-${i}`} {...c} />
    ))}
  </>
);

/**
 * Tastenklicks fuer getippten Text.
 *
 * Nicht je Zeichen — das klingt nach Maschinengewehr. Alle paar Zeichen einer
 * reicht, um den Eindruck von Tippen zu erzeugen.
 */
export const tippen = (ab: number, zeichen: number, cps = 1.8, jedes = 4): SfxCue[] => {
  const cues: SfxCue[] = [];
  for (let i = 0; i < zeichen; i += jedes) {
    cues.push({name: 'click-key', at: Math.round(ab + i / cps), pegel: 0.16});
  }
  return cues;
};
