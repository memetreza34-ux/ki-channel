import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {clockWipe} from '@remotion/transitions/clock-wipe';
import {wipe} from '@remotion/transitions/wipe';
import {Star, Triangle} from '@remotion/shapes';
import {MOTION_EASING} from '../../motion/easing';
import {PROTOTYPE_PALETTE} from '../prototypes/PrototypeShell';

/**
 * Demo: echte Szenenuebergaenge statt harter Schnitt oder Dauer-Blende.
 *
 * Die Bewegungssprache erlaubt einen Uebergang nur bei echter semantischer
 * Kontinuitaet - hier ist sie gegeben: dieselbe Aussage in drei Schaerfegraden.
 *
 * Genutzt: @remotion/transitions (TransitionSeries, clockWipe, wipe) und
 * @remotion/shapes fuer die Formen.
 */

const Panel: React.FC<{
  eyebrow: string;
  headline: string;
  background: string;
  children?: React.ReactNode;
}> = ({eyebrow, headline, background, children}) => (
  <AbsoluteFill
    style={{
      background,
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, Helvetica, sans-serif',
    }}
  >
    <div style={{textAlign: 'center', padding: '0 110px'}}>
      <div
        style={{
          fontSize: 26,
          fontWeight: 900,
          letterSpacing: 6,
          color: PROTOTYPE_PALETTE.accent,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          marginTop: 26,
          fontSize: 76,
          lineHeight: 1.04,
          fontWeight: 900,
          letterSpacing: -2,
          color: PROTOTYPE_PALETTE.foreground,
        }}
      >
        {headline}
      </div>
      <div style={{marginTop: 64, display: 'flex', justifyContent: 'center'}}>
        {children}
      </div>
    </div>
  </AbsoluteFill>
);

export const TransitionDemo: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={54}>
      <Panel
        eyebrow="OHNE KONTEXT"
        headline="Die KI rät"
        background="radial-gradient(circle at 50% 38%, #FFFFFF 0%, #F6F2FF 60%, #EDE4FB 100%)"
      >
        <Triangle
          length={190}
          direction="up"
          fill={PROTOTYPE_PALETTE.warning}
        />
      </Panel>
    </TransitionSeries.Sequence>

    <TransitionSeries.Transition
      presentation={clockWipe({width: 1080, height: 1920})}
      timing={linearTiming({durationInFrames: 22})}
    />

    <TransitionSeries.Sequence durationInFrames={54}>
      <Panel
        eyebrow="MIT KONTEXT"
        headline="Die KI ordnet ein"
        background="radial-gradient(circle at 50% 38%, #FFFFFF 0%, #F2ECFF 60%, #E4D8FB 100%)"
      >
        <Star
          points={5}
          innerRadius={62}
          outerRadius={128}
          fill={PROTOTYPE_PALETTE.accent}
        />
      </Panel>
    </TransitionSeries.Sequence>

    <TransitionSeries.Transition
      presentation={wipe({direction: 'from-bottom'})}
      timing={linearTiming({
        durationInFrames: 22,
        easing: MOTION_EASING.enter,
      })}
    />

    <TransitionSeries.Sequence durationInFrames={58}>
      <Panel
        eyebrow="MIT BELEG"
        headline="Die KI belegt"
        background="radial-gradient(circle at 50% 38%, #FFFFFF 0%, #EEF9F3 60%, #DCF2E6 100%)"
      >
        <Star
          points={6}
          innerRadius={74}
          outerRadius={132}
          fill={PROTOTYPE_PALETTE.success}
        />
      </Panel>
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
