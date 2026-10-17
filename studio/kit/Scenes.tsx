import React from 'react';
import {AbsoluteFill} from 'remotion';
import {linearTiming, TransitionSeries, type TransitionPresentation, type TransitionPresentationComponentProps} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {EASE, mix} from './motion';

type NoProps = Record<string, unknown>;

const ZoomThrough: React.FC<TransitionPresentationComponentProps<NoProps>> = ({children, presentationDirection, presentationProgress}) => {
  const entering = presentationDirection === 'entering';
  const p = presentationProgress;
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${entering ? mix(1.18, 1, p) : mix(1, 0.88, p)})`,
        // Kaum Überlappung: alte Szene ist fast weg, bevor die neue kommt.
        opacity: entering ? Math.max(0, Math.min(1, (p - 0.35) / 0.65)) : Math.max(0, 1 - p / 0.55),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Neue Szene kommt aus der Tiefe nach vorn, alte weicht zurück. */
export const zoomThrough = (): TransitionPresentation<NoProps> => ({component: ZoomThrough, props: {}});

export type SceneTransition = 'cut' | 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'wipe' | 'zoom';

export type SceneItem = {
  name?: string;
  /** Länge der Szene in Frames (inklusive Übergangsüberlappung). */
  duration: number;
  content: React.ReactNode;
  /** Übergang VON der vorherigen Szene in diese. Standard: harter Schnitt. */
  transition?: SceneTransition;
  /** Dauer des Übergangs in Frames (Standard 14). */
  transitionFrames?: number;
};

const presentationFor = (t: Exclude<SceneTransition, 'cut'>): TransitionPresentation<Record<string, unknown>> => {
  switch (t) {
    case 'fade':
      return fade() as TransitionPresentation<Record<string, unknown>>;
    case 'slide-left':
      return slide({direction: 'from-right'}) as TransitionPresentation<Record<string, unknown>>;
    case 'slide-right':
      return slide({direction: 'from-left'}) as TransitionPresentation<Record<string, unknown>>;
    case 'slide-up':
      return slide({direction: 'from-bottom'}) as TransitionPresentation<Record<string, unknown>>;
    case 'slide-down':
      return slide({direction: 'from-top'}) as TransitionPresentation<Record<string, unknown>>;
    case 'wipe':
      return wipe({direction: 'from-right'}) as TransitionPresentation<Record<string, unknown>>;
    case 'zoom':
      return zoomThrough();
  }
};

const overlapOf = (item: SceneItem, index: number) =>
  index === 0 || !item.transition || item.transition === 'cut' ? 0 : (item.transitionFrames ?? 14);

/** Gesamtlänge einer Szenenfolge (Übergänge überlappen und kürzen die Summe). */
export const scenesDuration = (items: SceneItem[]) =>
  items.reduce((sum, item, i) => sum + item.duration - overlapOf(item, i), 0);

/**
 * Szenenfolge mit Übergängen. Harter Schnitt ist Standard; Übergänge nur, wenn
 * sie etwas bedeuten (Ortswechsel, Zeitsprung, "und dann …").
 */
export const Scenes: React.FC<{items: SceneItem[]}> = ({items}) => (
  <TransitionSeries>
    {items.flatMap((item, i) => {
      const nodes: React.ReactNode[] = [];
      const overlap = overlapOf(item, i);
      if (overlap > 0 && item.transition && item.transition !== 'cut') {
        nodes.push(
          <TransitionSeries.Transition
            key={`t${i}`}
            presentation={presentationFor(item.transition)}
            timing={linearTiming({durationInFrames: overlap, easing: EASE.inOut})}
          />,
        );
      }
      nodes.push(
        <TransitionSeries.Sequence key={`s${i}`} durationInFrames={item.duration} name={item.name}>
          {item.content}
        </TransitionSeries.Sequence>,
      );
      return nodes;
    })}
  </TransitionSeries>
);
