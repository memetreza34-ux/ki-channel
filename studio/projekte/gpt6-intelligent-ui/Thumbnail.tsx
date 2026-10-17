import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {Project} from '../types';
import {KANAL, SERIEN, StilContext, Toki} from '../kanal-look/stil';

/** YouTube-Thumbnail „ChatGPT wird zur App – GPT-6 Intelligent UI“ im Kanal-Look mit Toki. */

const Wort: React.FC<{children: React.ReactNode; bg?: string; color?: string; rot?: number}> = ({
  children,
  bg,
  color = '#15181D',
  rot = 0,
}) => (
  <span
    style={{
      display: 'inline-block',
      padding: bg ? '2px 28px' : 0,
      background: bg,
      color,
      border: bg ? '8px solid #15181D' : undefined,
      borderRadius: 26,
      boxShadow: bg ? '12px 12px 0 #15181D' : undefined,
      transform: `rotate(${rot}deg)`,
    }}
  >
    {children}
  </span>
);

const Chip: React.FC<{text: string; x: number; y: number; bg: string; color: string; rot: number; fontSize?: number}> = ({
  text,
  x,
  y,
  bg,
  color,
  rot,
  fontSize = 56,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      padding: '12px 28px',
      borderRadius: 24,
      background: bg,
      color,
      border: '6px solid #15181D',
      boxShadow: '8px 8px 0 #15181D',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 900,
      fontSize,
      transform: `rotate(${rot}deg)`,
      whiteSpace: 'nowrap',
    }}
  >
    {text}
  </div>
);

export const Bild: React.FC = () => (
  <StilContext.Provider value={{...KANAL, outline: 7, hardShadow: true}}>
    <AbsoluteFill style={{background: SERIEN.news.tint}}>
      {/* Background blobs */}
      <div style={{position: 'absolute', right: -200, top: -240, width: 1100, height: 1100, borderRadius: '50%', background: '#FFF2C8'}} />
      <div style={{position: 'absolute', left: -180, bottom: -280, width: 850, height: 850, borderRadius: '50%', background: '#FFE4DC'}} />

      {/* Main Headline */}
      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 110,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 900,
          fontSize: 140,
          lineHeight: 1.08,
          letterSpacing: '-0.05em',
          color: '#15181D',
        }}
      >
        ChatGPT
        <br />
        wird zur{' '}
        <Wort bg={KANAL.ki} color="#FFFFFF" rot={-3}>
          APP!
        </Wort>
      </div>

      {/* Badge chips – klar getrennt ohne Kollision */}
      <Chip text="GPT-6 INTELLIGENT UI" x={100} y={630} bg="#FFFFFF" color="#3D7BFF" rot={-3} fontSize={56} />
      <Chip text="TEXT → TOOL" x={100} y={770} bg="#FFF0C2" color="#15181D" rot={2} fontSize={56} />
      <Chip text="20 € → 30 € 📊" x={610} y={775} bg="#DDF4E9" color="#1FA971" rot={-2} fontSize={54} />

      {/* Toki with ecstatic joy holding iPad tablet */}
      <Toki x={1460} y={1020} k={2.9} gesicht="staunen" armL={140} armR={140} look={[-0.7, -0.3]} idle={false} blink={0} />
    </AbsoluteFill>
  </StilContext.Provider>
);

export const thumbnail: Project = {
  id: 'Gpt6IntelligentUi-Thumbnail',
  component: Bild,
  format: 'landscape',
  durationInFrames: 1,
};
