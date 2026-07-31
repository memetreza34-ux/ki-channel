import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import {
  ThemeProvider, Background, Vignette, CinematicGrade, InkSplash, MorphShape,
  HexGrid, Toast, LoadingPulse, C, FONT,
} from '@studio/core';
import { BRAND } from '../../brand/brand';

const THEME = { accent: BRAND.accent, accentDk: BRAND.accentDk, bg: BRAND.bg, bgDeep: BRAND.bgDeep };
const PER = 110;

const Label: React.FC<{ name: string; index: number; total: number }> = ({ name, index, total }) => (
  <div style={{ position: 'absolute', top: 40, left: 0, width: '100%', textAlign: 'center', zIndex: 50,
    fontFamily: FONT.body, fontSize: 30, color: C.white, fontWeight: 700 }}>
    {index + 1}/{total} — {name}
  </div>
);

export const PremiumMotionDemo3: React.FC = () => (
  <ThemeProvider value={THEME}>
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <Background />

      <Sequence from={0 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: FONT.title, fontSize: 100, color: C.white }}>SZENE</span>
          </div>
          <CinematicGrade mood="scifi" />
          <Label name="CinematicGrade (scifi)" index={0} total={6} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={1 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <Label name="InkSplash" index={1} total={6} />
          <InkSplash cx={960} cy={560} at={10} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={2 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <Label name="MorphShape" index={2} total={6} />
          <MorphShape cx={960} cy={560} size={220} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={3 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <Label name="HexGrid" index={3} total={6} />
          <HexGrid />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={4 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <Label name="Toast" index={4} total={6} />
          <Toast text="Video gerendert" at={10} dur={80} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={5 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <Label name="LoadingPulse" index={5} total={6} />
          <LoadingPulse cx={960} cy={560} />
        </AbsoluteFill>
      </Sequence>

      <Vignette />
    </AbsoluteFill>
  </ThemeProvider>
);

export const PREMIUM_MOTION_DEMO3_FRAMES = 6 * PER;
