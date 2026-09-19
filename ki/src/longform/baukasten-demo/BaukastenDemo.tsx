import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {clockWipe} from '@remotion/transitions/clock-wipe';
import {BRAND} from '../../../brand/brand';
import {ThemeProvider} from '@studio/core';
import {SzeneBewegung} from './SzeneBewegung';
import {SzeneFlaechen} from './SzeneFlaechen';
import {SzeneIcons} from './SzeneIcons';
import {SzeneInteraktion} from './SzeneInteraktion';
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
export const DEMO_SZENEN = 5;
export const DEMO_DAUER = DEMO_SZENE * DEMO_SZENEN - DEMO_BLENDE * (DEMO_SZENEN - 1);

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

          {/* Jeder Uebergang ein anderer — auch die Schnitte sollen sich nicht
              wiederholen. */}
          <TransitionSeries.Transition
            presentation={wipe({direction: 'from-bottom'})}
            timing={linearTiming({durationInFrames: DEMO_BLENDE})}
          />

          <TransitionSeries.Sequence durationInFrames={DEMO_SZENE} name="Bewegung">
            <SzeneBewegung />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={clockWipe({width: 1920, height: 1080})}
            timing={linearTiming({durationInFrames: DEMO_BLENDE})}
          />

          <TransitionSeries.Sequence durationInFrames={DEMO_SZENE} name="Interaktion">
            <SzeneInteraktion />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </ThemeProvider>
  );
};
