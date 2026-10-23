import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {Project} from '../types';
import {KANAL, StilContext, Toki} from '../kanal-look/stil';
import {GRUEN, GRUEN_T, Helm, INK, Kuehlturm, ROT, SOFT} from './bausteine';

/** YouTube-Thumbnail „Wie viel Strom frisst KI wirklich?“ – Premium-Stil: falsche Zahl durchgestrichen, echte Zahl groß. */

export const Bild: React.FC = () => (
  <StilContext.Provider value={KANAL}>
    <AbsoluteFill style={{background: KANAL.bg, fontFamily: KANAL.body, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 700, top: -380, width: 1500, height: 1250, borderRadius: '50%', background: `radial-gradient(closest-side, ${GRUEN_T} 0%, rgba(219,243,239,0) 100%)`}} />
      <div style={{position: 'absolute', left: -300, top: 520, width: 1200, height: 900, borderRadius: '50%', background: 'radial-gradient(closest-side, #FFF1E6 0%, rgba(255,241,230,0) 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 960, bottom: 0, background: '#EEEBE3'}} />
      <Kuehlturm cx={1420} boden={960} h={800} t={1.7} dampf={1.2} seed={8} />

      <div style={{position: 'absolute', left: 96, top: 70, fontSize: 340, fontWeight: 900, letterSpacing: '-0.06em', lineHeight: 1, color: '#B4B9C2'}}>
        10<span style={{fontWeight: 300}}>×</span>
      </div>
      <div style={{position: 'absolute', left: 70, top: 230, width: 610, height: 30, borderRadius: 15, background: ROT, transform: 'rotate(-6deg)'}} />

      <div style={{position: 'absolute', left: 90, top: 420, display: 'flex', alignItems: 'baseline', fontSize: 300, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, color: INK}}>
        0,3
        <span style={{fontSize: 170, fontWeight: 300, color: SOFT, marginLeft: 28}}>Wh</span>
      </div>
      <div style={{position: 'absolute', left: 100, top: 770, padding: '14px 34px', borderRadius: 22, background: GRUEN, color: '#FFFFFF', fontSize: 74, fontWeight: 900, letterSpacing: '-0.02em'}}>pro KI-Frage?</div>

      <Toki x={1560} y={1060} k={2.3} gesicht="staunen" armL={150} armR={30} look={[-0.8, -0.4]} idle={false} blink={0} accessoire={<Helm />} />
    </AbsoluteFill>
  </StilContext.Provider>
);

export const thumbnail: Project = {
  id: 'KiStrom-Thumbnail',
  component: Bild,
  format: 'landscape',
  durationInFrames: 1,
};
