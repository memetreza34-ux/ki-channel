import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {Project} from '../types';
import {KANAL, SERIEN, StilContext, Toki} from '../kanal-look/stil';

/** YouTube-Thumbnail „Warum KI lügt“ im Pop-Stil wie Video 1. */

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
      <div style={{position: 'absolute', right: -220, top: -260, width: 1150, height: 1150, borderRadius: '50%', background: '#FDE3E4'}} />
      <div style={{position: 'absolute', left: 90, top: 130, fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 150, lineHeight: 1.1, letterSpacing: '-0.05em', color: '#15181D'}}>
        Warum
        <br />
        <Wort bg={KANAL.fehler} color="#FFFFFF" rot={-3}>
          KI lügt
        </Wort>
      </div>
      <Chip text="ERFUNDEN" x={120} y={720} bg="#FFFFFF" color={KANAL.fehler} rot={-6} />
      <Chip text="−100 Mrd. $" x={560} y={800} bg="#FFF0C2" color="#8A6400" rot={4} />
      <Toki x={1420} y={1010} k={3.0} gesicht="staunen" armL={150} armR={150} look={[-0.6, -0.4]} idle={false} blink={0} />
    </AbsoluteFill>
  </StilContext.Provider>
);

export const thumbnail: Project = {id: 'Warum-Ki-Luegt-Thumbnail', component: Bild, format: 'landscape', durationInFrames: 1, ordner: 'Kanal-Look'};
