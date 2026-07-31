import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Background, Vignette, ThemeProvider, BigStat, DramaticNumber } from '@studio/core';
import { BRAND } from '../../brand/brand';

// Theme-Test: BigStat/DramaticNumber OHNE Farb-Prop → müssen den Kanal-Akzent (LILA) zeigen,
// nicht das alte hartcodierte Grün. Beweist: geerbte Bausteine sind jetzt theme-fähig.
export const KitTest: React.FC = () => (
  <ThemeProvider value={{ accent: BRAND.accent, accentDk: BRAND.accentDk, bg: BRAND.bg, bgDeep: BRAND.bgDeep }}>
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <Background />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 40 }}>
        <BigStat value="92 %" label="BigStat — Akzent = Kanal-Theme" at={0} />
        <DramaticNumber to={2024} from={0} startAt={0} durationFrames={60} />
      </AbsoluteFill>
      <Vignette />
    </AbsoluteFill>
  </ThemeProvider>
);
