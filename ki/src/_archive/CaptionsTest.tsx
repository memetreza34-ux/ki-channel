import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Background, Vignette, ThemeProvider, Captions, type Caption } from '@studio/core';
import { BRAND } from '../../brand/brand';

// Demo-Captions im @remotion/captions-Format (so liefert es transcribe.mjs).
const demo: Caption[] = [
  { text: 'KI', startMs: 0, endMs: 400 },
  { text: 'verändert', startMs: 400, endMs: 950 },
  { text: 'alles', startMs: 950, endMs: 1500 },
  { text: 'schneller', startMs: 1500, endMs: 2100 },
  { text: 'als', startMs: 2100, endMs: 2350 },
  { text: 'du', startMs: 2350, endMs: 2600 },
  { text: 'denkst', startMs: 2600, endMs: 3200 },
];

export const CaptionsTest: React.FC = () => (
  <ThemeProvider value={{ accent: BRAND.accent, accentDk: BRAND.accentDk, bg: BRAND.bg, bgDeep: BRAND.bgDeep }}>
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <Background />
      <Captions captions={demo} perGroup={3} size={96} bottom={760} />
      <Vignette />
    </AbsoluteFill>
  </ThemeProvider>
);
