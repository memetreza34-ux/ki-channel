import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ThemeProvider, Vignette, MeshGradientBG, GlassCodeBlock, FocusBlurResolve, ChromaticReveal, FONT, C, a } from '@studio/core';
import { BRAND } from '../../brand/brand';

export const ExtrasTest: React.FC = () => (
  <ThemeProvider value={{ accent: BRAND.accent, accentDk: BRAND.accentDk, bg: BRAND.bg, bgDeep: BRAND.bgDeep }}>
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <MeshGradientBG />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 36 }}>
        <ChromaticReveal at={0} dur={18}>
          <FocusBlurResolve text="GLASS CODE" at={0} size={90} />
        </ChromaticReveal>
        <GlassCodeBlock
          at={10}
          title="agent.ts"
          lines={[
            'export const studio = {',
            '  core: "@studio/core",',
            '  channels: 4,',
            '  premium: true,',
            '};',
          ]}
        />
      </AbsoluteFill>
      <Vignette />
    </AbsoluteFill>
  </ThemeProvider>
);
