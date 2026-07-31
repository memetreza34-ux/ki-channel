import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import {
  ThemeProvider, Background, Vignette, NeonFlicker, StampImpact, ParticleAssemble,
  CurtainReveal, Perspective3DFlip, C, FONT,
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

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
);

export const PremiumMotionDemo2: React.FC = () => (
  <ThemeProvider value={THEME}>
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <Background />

      <Sequence from={0 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <Label name="NeonFlicker" index={0} total={5} />
          <Center><NeonFlicker text="JETZT LIVE" at={10} size={110} /></Center>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={1 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <Label name="StampImpact" index={1} total={5} />
          <Center>
            <StampImpact at={20}>
              <span style={{ fontFamily: FONT.title, fontSize: 130, color: C.white }}>ACHTUNG</span>
            </StampImpact>
          </Center>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={2 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <Label name="ParticleAssemble" index={2} total={5} />
          <Center><ParticleAssemble text="ZUKUNFT" at={10} size={100} /></Center>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={3 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <Label name="CurtainReveal" index={3} total={5} />
          <CurtainReveal at={15} dur={26}>
            <Center><span style={{ fontFamily: FONT.title, fontSize: 110, color: 'var(--accent)' }}>ENTHÜLLT</span></Center>
          </CurtainReveal>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={4 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <Label name="Perspective3DFlip" index={4} total={5} />
          <Center>
            <Perspective3DFlip at={10}>
              <div style={{ padding: '50px 70px', borderRadius: 28, background: 'rgba(0,210,106,0.1)',
                border: '2px solid var(--accent)' }}>
                <span style={{ fontFamily: FONT.title, fontSize: 90, color: C.white }}>KARTE</span>
              </div>
            </Perspective3DFlip>
          </Center>
        </AbsoluteFill>
      </Sequence>

      <Vignette />
    </AbsoluteFill>
  </ThemeProvider>
);

export const PREMIUM_MOTION_DEMO2_FRAMES = 5 * PER;
