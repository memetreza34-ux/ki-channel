import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ThemeProvider, TokenStream, AiCanvasReveal, BeforeAfterSlider, AiThinking, LivingBackground } from '@studio/core';
import { BRAND } from '../../brand/brand';

export const AI_TOOLS_TEST_FRAMES = 240;

const PIC = 'https://picsum.photos/id/237/900/600';
const PIC2 = 'https://picsum.photos/id/238/900/600';

export const AiToolsTest: React.FC = () => (
  <ThemeProvider value={BRAND}>
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <LivingBackground />
      <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, padding: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TokenStream text="Erkläre mir Zinseszins" start={0} w={800} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AiCanvasReveal src={PIC} w={700} h={460} revealFrom={20} revealTo={110} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BeforeAfterSlider before={PIC} after={PIC2} w={700} h={460} start={20} holdFrom={110} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AiThinking start={0} end={240} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  </ThemeProvider>
);
