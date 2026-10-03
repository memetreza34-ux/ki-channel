import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background, Footage, Illustration, Objekt3D, ScreenFocus, ThemeProvider, useTheme, type ThemeName} from '../../kit';
import type {Project} from '../types';

const Label: React.FC<{children: React.ReactNode; x: number; y: number}> = ({children, x, y}) => {
  const t = useTheme();
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: t.font.mono, fontSize: 22, color: t.c.inkSoft}}>{children}</div>;
};

/**
 * Medien-Bausteine: 3D-Objekte, B-Roll mit Ken-Burns, Zoom in Screenshots,
 * Illustration in Designfarbe. Das Standbild ist ein eigener Render (kein Stock).
 */
const Seite: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <div style={{position: 'absolute', left: 40, top: 40, display: 'flex', gap: 10}}>
      {(['wuerfel', 'kugel', 'ring', 'chip'] as const).map((f, i) => (
        <Objekt3D key={f} form={f} size={300} delay={i * 6} />
      ))}
    </div>
    <Label x={60} y={340}>Objekt3D: wuerfel · kugel · ring · chip</Label>
    <div style={{position: 'absolute', left: 60, top: 420}}>
      <Footage src="beispiel/standbild.jpg" width={560} height={315} framed tint={0.25} vignette />
    </div>
    <Label x={60} y={750}>Footage (Ken-Burns, Einfärbung, Vignette)</Label>
    <div style={{position: 'absolute', left: 680, top: 420}}>
      <ScreenFocus
        src="beispiel/standbild.jpg"
        width={560}
        height={315}
        contentWidth={1920}
        contentHeight={1080}
        keys={[
          {at: 0, x: 0, y: 0, w: 1920, h: 1080},
          {at: 60, x: 1280, y: 0, w: 640, h: 540, highlight: true},
        ]}
      />
    </div>
    <Label x={680} y={750}>ScreenFocus mit Bild/Aufnahme</Label>
    <div style={{position: 'absolute', left: 1320, top: 400}}>
      <Illustration src="beispiel/illustration-test.svg" width={520} delay={10} />
    </div>
    <Label x={1320} y={800}>Illustration (Akzent → Designfarbe)</Label>
  </AbsoluteFill>
);

const mit = (design: ThemeName) => {
  const K: React.FC = () => (
    <ThemeProvider theme={design}>
      <Seite />
    </ThemeProvider>
  );
  return K;
};

export const medienHell: Project = {id: 'Medien-Katalog', component: mit('editorial'), format: 'landscape', durationInFrames: 120, ordner: 'Kataloge'};
export const medienNacht: Project = {id: 'Medien-Katalog-Nacht', component: mit('nacht'), format: 'landscape', durationInFrames: 120, ordner: 'Kataloge'};
