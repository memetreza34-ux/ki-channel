import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import {
  ThemeProvider, Background, Vignette, WordmarkReveal, LiquidBlob, GlowOrb,
  ShapeRing, DiagonalWipe, CircleReveal, GlitchBurst, MoodGradient, C, FONT,
} from '@studio/core';
import { BRAND } from '../../brand/brand';

// ════════════════════════════════════════════════════════════════════════════
//  DEMO — kanal-neutrale Premium-Motion-Bausteine (core/brand-kit/PremiumMotion)
//  Getestet im KI-Kanal, um zu beweisen: funktioniert für ALLE Kanäle, nicht
//  nur FinanzNeo. Je 4s. Zur Sichtung.
// ════════════════════════════════════════════════════════════════════════════

const THEME = { accent: BRAND.accent, accentDk: BRAND.accentDk, bg: BRAND.bg, bgDeep: BRAND.bgDeep };
const PER = 130;

const Label: React.FC<{ name: string; index: number; total: number }> = ({ name, index, total }) => (
  <div style={{ position: 'absolute', top: 40, left: 0, width: '100%', textAlign: 'center', zIndex: 50,
    fontFamily: FONT.body, fontSize: 30, color: C.white, fontWeight: 700 }}>
    {index + 1}/{total} — {name}
  </div>
);

export const PremiumMotionDemo: React.FC = () => (
  <ThemeProvider value={THEME}>
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <Background />

      <Sequence from={0 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <Label name="WordmarkReveal" index={0} total={8} />
          <WordmarkReveal partA="KI" partB="Kanal" at={10} size={110} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={1 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <Label name="LiquidBlob" index={1} total={8} />
          <LiquidBlob cx={960} cy={560} radius={320} />
          <LiquidBlob cx={1300} cy={800} radius={200} color={C.blue} opacity={0.1} speed={1.4} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={2 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <Label name="GlowOrb" index={2} total={8} />
          <GlowOrb x={700} y={500} size={160} />
          <GlowOrb x={1200} y={650} size={100} color={C.blue} driftY={40} />
          <GlowOrb x={960} y={350} size={70} color={C.purple} driftY={16} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={3 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <Label name="ShapeRing" index={3} total={8} />
          <ShapeRing cx={960} cy={560} radius={220} at={10} />
          <ShapeRing cx={960} cy={560} radius={280} at={0} dashed />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={4 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <Label name="DiagonalWipe" index={4} total={8} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: FONT.title, fontSize: 90, color: C.white }}>VORHER → NACHHER</span>
          </div>
          <DiagonalWipe at={40} dur={20} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={5 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <Label name="CircleReveal" index={5} total={8} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: FONT.title, fontSize: 90, color: C.white }}>NEUE SZENE</span>
          </div>
          <CircleReveal at={5} dur={30} from="open" />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={6 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <Label name="GlitchBurst" index={6} total={8} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GlitchBurst at={30} dur={14}>
              <span style={{ fontFamily: FONT.title, fontSize: 100, color: C.white }}>ACHTUNG</span>
            </GlitchBurst>
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={7 * PER} durationInFrames={PER}>
        <AbsoluteFill>
          <MoodGradient mood="cyber" />
          <Label name="MoodGradient (cyber)" index={7} total={8} />
        </AbsoluteFill>
      </Sequence>

      <Vignette />
    </AbsoluteFill>
  </ThemeProvider>
);

export const PREMIUM_MOTION_DEMO_FRAMES = 8 * PER;
