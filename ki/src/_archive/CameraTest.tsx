import React from 'react';
import { AbsoluteFill } from 'remotion';
import {
  ThemeProvider, LivingBackground, Vignette,
  KenBurns, ParallaxLayer, WhipIn, ZoomPunch, PushThrough,
  C, a, FONT,
} from '@studio/core';
import { BRAND } from '../../brand/brand';

const Pill: React.FC<{ label: string; top: number }> = ({ label, top }) => (
  <div style={{ position: 'absolute', top, left: 140, width: 800, padding: '30px 40px', borderRadius: 26,
    background: a(BRAND.accent, 0.12), border: `2px solid ${a(BRAND.accent, 0.55)}`,
    boxShadow: `0 0 40px ${a(BRAND.accent, 0.2)}`, textAlign: 'center',
    fontFamily: FONT.title, fontSize: 64, color: C.white }}>{label}</div>
);

export const CameraTest: React.FC = () => (
  <ThemeProvider value={{ accent: BRAND.accent, accentDk: BRAND.accentDk, bg: BRAND.bg, bgDeep: BRAND.bgDeep }}>
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <LivingBackground />
      <KenBurns durFrames={120} style={{ position: 'absolute', inset: 0 }}><Pill label="KEN BURNS" top={230} /></KenBurns>
      <ParallaxLayer depth={1.4} style={{ position: 'absolute', inset: 0 }}><Pill label="PARALLAX" top={520} /></ParallaxLayer>
      <WhipIn at={6} dir="left" style={{ position: 'absolute', inset: 0 }}><Pill label="WHIP-IN" top={810} /></WhipIn>
      <ZoomPunch at={16} style={{ position: 'absolute', inset: 0 }}><Pill label="ZOOM-PUNCH" top={1100} /></ZoomPunch>
      <PushThrough at={28} style={{ position: 'absolute', inset: 0 }}><Pill label="PUSH-THROUGH" top={1390} /></PushThrough>
      <Vignette />
    </AbsoluteFill>
  </ThemeProvider>
);
