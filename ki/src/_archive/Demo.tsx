import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { C, FONT, Background, Vignette, ThemeProvider } from '@studio/core';
import { BRAND } from '../../brand/brand';

export const Demo: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f, fps, config: { damping: 14, stiffness: 200 } });
  return (
    <ThemeProvider value={{ accent: BRAND.accent, accentDk: BRAND.accentDk, bg: BRAND.bg, bgDeep: BRAND.bgDeep }}>
      <AbsoluteFill style={{ background: BRAND.bg }}>
        <Background />
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: FONT.title, fontSize: 170, color: BRAND.accent,
            transform: `scale(${0.8 + pop * 0.2})`, textShadow: `0 0 70px ${BRAND.accent}55` }}>
            {BRAND.name.toUpperCase()}
          </div>
          <div style={{ fontFamily: FONT.body, fontSize: 46, fontWeight: 700, color: C.white, marginTop: 12 }}>
            neutraler Core + eigene Brand ✓
          </div>
        </AbsoluteFill>
        <Vignette />
      </AbsoluteFill>
    </ThemeProvider>
  );
};
