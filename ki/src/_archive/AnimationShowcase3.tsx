import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import {
  ThemeProvider, ChatUI, NeuralNet, RetroGrid, Meteors, BorderBeam, Kicker,
} from '@studio/core';
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

export const AnimationShowcase3KI: React.FC = () => (
  <ThemeProvider value={BRAND}>
    <AbsoluteFill style={{ background: '#0A0A14' }}>
      <Sequence from={0} durationInFrames={90}>
        <Scene title="CHAT UI">
          <ChatUI
            width={800}
            messages={[
              { role: 'user', text: 'Erklär mir Prompting.', at: 5 },
              { role: 'ai', text: 'Klar — der richtige Prompt ist wie eine klare Anweisung.', at: 30, cps: 30 },
            ]}
          />
        </Scene>
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <Scene title="NEURAL NET">
          <NeuralNet layers={[4, 6, 6, 2]} w={800} h={600} wave={0.5} dir="fwd" />
        </Scene>
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <AbsoluteFill style={{ background: '#0A0A14' }}>
          <RetroGrid />
          <Meteors count={10} />
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: 100, left: 0, right: 0, textAlign: 'center' }}>
              <Kicker>TECH-DECK BACKGROUND</Kicker>
            </div>
            <div style={{ position: 'relative', width: 500, height: 300 }}>
              <BorderBeam width={500} height={300} />
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  </ThemeProvider>
);

export const ANIMATION_SHOWCASE3KI_FRAMES = 270;
