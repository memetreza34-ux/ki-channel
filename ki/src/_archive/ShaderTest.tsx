import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ThemeProvider, Vignette, FilmGrain, MaskReveal, C, FONT } from '@studio/core';
import { ShaderBG } from '@studio/core/three';
import { BRAND } from '../../brand/brand';

export const ShaderTest: React.FC = () => (
  <ThemeProvider value={{ accent: BRAND.accent, accentDk: BRAND.accentDk, bg: BRAND.bg, bgDeep: BRAND.bgDeep }}>
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <ShaderBG accent={BRAND.accent} accent2={C.blue} bg={BRAND.bg} speed={1} />
      <FilmGrain opacity={0.05} />
      <div style={{ position: 'absolute', top: 820, width: '100%', textAlign: 'center' }}>
        <MaskReveal at={6} size={110} style={{ display: 'inline-block' }}>SHADER-BG</MaskReveal>
        <div style={{ fontFamily: FONT.body, fontSize: 40, color: C.white, marginTop: 20 }}>echter WebGL-Verlauf</div>
      </div>
      <Vignette />
    </AbsoluteFill>
  </ThemeProvider>
);
