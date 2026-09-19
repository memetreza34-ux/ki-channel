import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {BRAND} from '../../../brand/brand';
import {ThemeProvider} from '@studio/core';
import {SzeneFlaechen} from './SzeneFlaechen';
import {SzeneIcons} from './SzeneIcons';
import {SzeneLoop} from './SzeneLoop';

/**
 * Baukasten-Demo — stummer Funktionsnachweis.
 *
 * Kein Voiceover, keine Wort-Anker: Diese Komposition zeigt nur, dass die
 * Bausteine tun, was sie sollen. Drei Szenen, verbunden mit echten Uebergaengen
 * aus `@remotion/transitions` statt selbstgebauter Blenden.
 *
 * Aufbau nach der offiziellen Empfehlung fuer Mehr-Szenen-Videos: jede Szene in
 * einer eigenen Datei, zusammengesetzt ueber `<TransitionSeries>`. Dadurch
 * laesst sich jede Szene einzeln im Studio oeffnen und pruefen.
 */

export const DEMO_FPS = 30;
export const DEMO_SZENE = 170;   // Frames je Szene
export const DEMO_BLENDE = 22;   // Frames je Uebergang

/** Gesamtlaenge: Szenen minus die Ueberlappung der Blenden. */
export const DEMO_DAUER = DEMO_SZENE * 3 - DEMO_BLENDE * 2;

export const BaukastenDemo: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <ThemeProvider value={{
      accent: BRAND.accent, accentDk: BRAND.accentDk,
      bg: BRAND.bg, bgDeep: BRAND.bgDeep,
    }}>
      <AbsoluteFill style={{background: '#FFFFFF'}}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={DEMO_SZENE} name="Icons">
            <SzeneIcons />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={slide({direction: 'from-right'})}
            timing={linearTiming({durationInFrames: DEMO_BLENDE})}
          />

          <TransitionSeries.Sequence durationInFrames={DEMO_SZENE} name="Flächen">
            <SzeneFlaechen />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({durationInFrames: DEMO_BLENDE})}
          />

          <TransitionSeries.Sequence durationInFrames={DEMO_SZENE} name="Loop">
            <SzeneLoop />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </ThemeProvider>
  );
};
