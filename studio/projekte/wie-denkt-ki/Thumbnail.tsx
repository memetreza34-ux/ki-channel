import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {Project} from '../types';
import {KANAL, SERIEN, StilContext, Toki} from '../kanal-look/stil';

/** YouTube-Thumbnail im Pop-Stil: großer Text, dicke Linien, Toki groß. */

const Wort: React.FC<{children: React.ReactNode; bg?: string; color?: string; rot?: number}> = ({children, bg, color = '#15181D', rot = 0}) => (
  <span
    style={{
      display: 'inline-block',
      padding: bg ? '0 26px' : 0,
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

const Chip: React.FC<{text: string; x: number; y: number; bg: string; color: string; rot: number}> = ({text, x, y, bg, color, rot}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      padding: '10px 26px',
      borderRadius: 22,
      background: bg,
      color,
      border: '6px solid #15181D',
      boxShadow: '8px 8px 0 #15181D',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 900,
      fontSize: 72,
      transform: `rotate(${rot}deg)`,
    }}
  >
    {text}
  </div>
);

const Bild: React.FC = () => (
  <StilContext.Provider value={{...KANAL, outline: 7, hardShadow: true}}>
    <AbsoluteFill style={{background: SERIEN.erklaert.tint}}>
      <div style={{position: 'absolute', right: -200, top: -260, width: 1100, height: 1100, borderRadius: '50%', background: '#FFE4D9'}} />
      <div style={{position: 'absolute', left: 90, top: 150, fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 168, lineHeight: 1.08, letterSpacing: '-0.05em', color: '#15181D'}}>
        Wie denkt
        <br />
        <Wort bg={KANAL.ki} color="#FFFFFF" rot={-3}>
          eine KI?
        </Wort>
      </div>
      <Chip text="Him" x={150} y={760} bg="#E1EAFF" color="#2E5BC4" rot={-6} />
      <Chip text="mel" x={400} y={800} bg="#E2F4EA" color="#1F8A55" rot={4} />
      <Chip text="62 %" x={680} y={760} bg="#FFF0C2" color="#8A6400" rot={-3} />
      <Toki x={1450} y={1010} k={3.0} gesicht="staunen" armL={70} armR={150} look={[-0.6, -0.4]} idle={false} blink={0} />
    </AbsoluteFill>
  </StilContext.Provider>
);

export const thumbnail: Project = {id: 'Wie-Denkt-Ki-Thumbnail', component: Bild, format: 'landscape', durationInFrames: 1, ordner: 'Kanal-Look'};
