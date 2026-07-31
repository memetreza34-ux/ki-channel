import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { ThemeProvider, Vignette, DynamicGrid, Terminal, ProgressSteps, DataFlowPipes,
  MatrixDecode, MarkerHighlight, SpotlightCard, FONT, C } from '@studio/core';
import { BRAND } from '../../brand/brand';

// Montage: zeigt mehrere neue Premium-Bausteine hintereinander (je ~2s).
export const Extras2Test: React.FC = () => (
  <ThemeProvider value={{ accent: BRAND.accent, accentDk: BRAND.accentDk, bg: BRAND.bg, bgDeep: BRAND.bgDeep }}>
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <DynamicGrid />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Sequence durationInFrames={70}>
          <MatrixDecode text="DECODE" at={0} size={140} />
        </Sequence>
        <Sequence from={70} durationInFrames={80}>
          <Terminal at={0} lines={['npm run new-video', 'rendering scene 01…', 'done ✓']} />
        </Sequence>
        <Sequence from={150} durationInFrames={80}>
          <ProgressSteps steps={['Skript', 'Design', 'Render', 'QA']} at={0} />
        </Sequence>
        <Sequence from={230} durationInFrames={80}>
          <DataFlowPipes nodes={['Audio', 'Whisper', 'Szene', 'MP4']} at={0} />
        </Sequence>
        <Sequence from={310} durationInFrames={70}>
          <SpotlightCard at={0}>
            <div style={{ fontFamily: FONT.title, fontSize: 90, color: C.white }}>
              <MarkerHighlight at={6}>Premium</MarkerHighlight>
            </div>
          </SpotlightCard>
        </Sequence>
      </AbsoluteFill>
      <Vignette />
    </AbsoluteFill>
  </ThemeProvider>
);
