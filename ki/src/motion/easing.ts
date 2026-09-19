import {Easing, interpolate} from 'remotion';

/**
 * Zentrale Easing-Kurven fuer das gesamte Motion-System.
 *
 * Grundregel: Lineare Bewegung liest das Auge als mechanisch. `linear` ist
 * ausschliesslich fuer Endlos-Schleifen (Spinner, Marquee) zulaessig, nie fuer
 * ein einzelnes Ereignis.
 *
 * Kurvenwerte nach animation-principles (.claude/skills/animation-principles).
 */
export const MOTION_EASING = {
  /** Eintritt: schnell los, sanft einschwingen. Sicherer Standard. */
  enter: Easing.bezier(0.33, 1, 0.68, 1),
  /** Eintritt mit Nachdruck: Hero-Momente, grosse Flaechen. */
  enterEmphasis: Easing.bezier(0.16, 1, 0.3, 1),
  /** Austritt: sanft los, schnell weg. */
  exit: Easing.bezier(0.5, 0, 0.75, 0),
  /** Bewegung auf der Buehne, Element bleibt sichtbar. */
  move: Easing.bezier(0.65, 0, 0.35, 1),
  /** Gebrandeter Pop: schiesst ueber das Ziel und schwingt ein. */
  pop: Easing.bezier(0.34, 1.56, 0.64, 1),
  /** Anlauf gegen die Bewegungsrichtung vor dem Start. */
  anticipate: Easing.bezier(0.36, 0, 0.66, -0.56),
  /** Nur fuer Endlos-Schleifen. */
  loop: Easing.linear,
} as const;

export type MotionEasingName = keyof typeof MOTION_EASING;

/**
 * Normalisierter Fortschritt 0..1 zwischen zwei Frames, mit Easing-Kurve.
 * Ersetzt rohes lineares `interpolate` fuer alle wahrnehmbaren Ereignisse.
 */
export const easedProgress = (
  frame: number,
  start: number,
  end: number,
  easing: MotionEasingName = 'enter',
): number =>
  interpolate(frame, [start, Math.max(start + 1, end)], [0, 1], {
    easing: MOTION_EASING[easing],
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/**
 * Startversatz fuer Gruppen-Reveals. Ohne Staffelung liest eine Liste als ein
 * einziges flaches Ereignis.
 *
 * Gesamtdauer wird bei `capFrames` gedeckelt, damit der Schwanz nicht schleppt.
 */
export const staggerDelay = (
  index: number,
  offsetFrames = 3,
  capFrames = 21,
): number => {
  if (index <= 0) return 0;
  const effective = Math.min(offsetFrames, Math.max(1, capFrames / index));
  return Math.round(index * effective);
};

/**
 * Dauer nach Weg skalieren, damit die wahrgenommene Geschwindigkeit konstant
 * bleibt. Eine kleine Marke und eine volle Flaeche duerfen nicht dieselbe
 * Dauer teilen - sonst wirkt die grosse Flaeche gewichtslos.
 */
export const durationForDistance = (
  baseFrames: number,
  distancePx: number,
  baseDistancePx = 200,
): number => {
  const ratio = Math.max(0.25, distancePx / Math.max(1, baseDistancePx));
  return Math.max(1, Math.round(baseFrames * Math.sqrt(ratio)));
};

/**
 * Nachlauf: angehaengte Elemente (Schatten, Label, Beschriftung) kommen spaeter
 * zur Ruhe als der Hauptkoerper. Ohne Versatz stoppt alles auf demselben Frame,
 * was unphysikalisch wirkt.
 */
export const followThrough = (startFrame: number, layer = 1): number =>
  startFrame + Math.round(layer * 2);
