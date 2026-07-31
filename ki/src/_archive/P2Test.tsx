import React from 'react';
import { AbsoluteFill } from 'remotion';
import {
  ThemeProvider, LivingBackground, FilmGrain, Vignette,
  KineticCenterBuild, Constellation, LiveCodeCompile, WaveWipe, Dissolve,
  C, a, FONT,
} from '@studio/core';
import { BRAND } from '../../brand/brand';

const nodes = [
  { x: 170, y: 120, label: 'Daten' }, { x: 470, y: 66, label: 'Modell' },
  { x: 790, y: 140, label: 'Training' }, { x: 300, y: 340, label: 'Fehler' },
  { x: 630, y: 360, label: 'Gewichte' }, { x: 850, y: 330, label: 'Ausgabe' },
];
const Panel: React.FC<{ label: string; col: string }> = ({ label, col }) => (
  <div style={{ width: 420, height: 220, borderRadius: 24, background: a(col, 0.9),
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: FONT.title, fontSize: 54, color: '#0B0F14' }}>{label}</div>
);

export const P2Test: React.FC = () => (
  <ThemeProvider value={{ accent: BRAND.accent, accentDk: BRAND.accentDk, bg: BRAND.bg, bgDeep: BRAND.bgDeep }}>
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <LivingBackground />
      <FilmGrain opacity={0.05} />
      <div style={{ position: 'absolute', top: 140, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <KineticCenterBuild lines={['LERNEN', 'HEISST', 'WIEDERHOLEN']} at={8} per={12} size={84}
          colors={[C.white, C.white, BRAND.accent]} />
      </div>
      <div style={{ position: 'absolute', top: 560, left: 50, width: 980, height: 460 }}>
        <Constellation nodes={nodes} w={980} h={460} at={20} accent={BRAND.accent} />
      </div>
      <div style={{ position: 'absolute', top: 1080, left: 40, width: 220, textAlign: 'center' }} />
      <div style={{ position: 'absolute', top: 1080, width: '100%', display: 'flex', justifyContent: 'center', gap: 40 }}>
        <WaveWipe at={10} dur={26} dir="up"><Panel label="WaveWipe" col={BRAND.accent} /></WaveWipe>
        <Dissolve at={10} dur={30}><Panel label="Dissolve" col={C.blue} /></Dissolve>
      </div>
      <div style={{ position: 'absolute', top: 1380, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <LiveCodeCompile code={['model = KI()', 'model.train(daten)', 'model.frage("Hund?")']}
          output='Antwort: Hund' at={40} width={880} />
      </div>
      <Vignette />
    </AbsoluteFill>
  </ThemeProvider>
);
