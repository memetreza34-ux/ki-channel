import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { ThemeProvider, PulseDotsLoader, AccordionReveal, AutoCarousel, SwitchToggle, Kicker } from '@studio/core';
import { BRAND } from '../../brand/brand';

const Scene: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', background: '#0A0A14' }}>
      <div style={{ position: 'absolute', top: 100, left: 0, right: 0, textAlign: 'center', opacity: Math.min(f / 12, 1) }}>
        <Kicker>{title}</Kicker>
      </div>
      {children}
    </AbsoluteFill>
  );
};

export const AnimationShowcaseFillerKI: React.FC = () => (
  <ThemeProvider value={BRAND}>
    <AbsoluteFill style={{ background: '#0A0A14' }}>
      <Sequence from={0} durationInFrames={90}>
        <Scene title="PULSE DOTS LOADER">
          <PulseDotsLoader />
        </Scene>
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <Scene title="ACCORDION REVEAL">
          <AccordionReveal title="Was ist ein Prompt?" at={10} width={800}>
            Die Anweisung, die du der KI gibst — je klarer, desto besser das Ergebnis.
          </AccordionReveal>
        </Scene>
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <Scene title="AUTO CAROUSEL">
          <AutoCarousel
            width={800}
            perCard={35}
            cards={[
              { title: 'Regel 1', sub: 'Rolle zuerst definieren' },
              { title: 'Regel 2', sub: 'Format explizit vorgeben' },
              { title: 'Regel 3', sub: 'Beispiele mitliefern' },
            ]}
          />
        </Scene>
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Scene title="SWITCH TOGGLE">
          <SwitchToggle label="Web-Suche" at={10} width={550} />
        </Scene>
      </Sequence>
    </AbsoluteFill>
  </ThemeProvider>
);

export const ANIMATION_SHOWCASE_FILLER_KI_FRAMES = 360;
