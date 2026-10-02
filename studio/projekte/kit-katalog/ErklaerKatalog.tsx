import React from 'react';
import {AbsoluteFill} from 'remotion';
import {
  Background,
  BeforeAfter,
  BrowserMockup,
  Checklist,
  COLORS,
  Donut,
  FONT,
  Headline,
  LineChart,
  ScreenFocus,
  Steps,
} from '../../kit';
import type {Project} from '../types';

const Seite: React.FC = () => (
  <BrowserMockup width={920} height={640} url="ki-werkzeug.de" delay={-60}>
    <div style={{padding: 44}}>
      <Headline text="Dein KI-Werkzeug" size={60} highlight={['KI-Werkzeug']} delay={-60} />
      <div
        style={{
          marginTop: 44,
          width: 240,
          height: 80,
          borderRadius: 40,
          background: COLORS.accentDeep,
          color: '#FFFFFF',
          fontFamily: FONT.sans,
          fontSize: 32,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Starten
      </div>
    </div>
  </BrowserMockup>
);

const prompt = (text: string, good: boolean) => (
  <AbsoluteFill
    style={{
      background: good ? COLORS.goodTint : '#F1EEF6',
      padding: '96px 40px 40px',
      fontFamily: FONT.mono,
      fontWeight: 500,
      fontSize: 30,
      lineHeight: 1.45,
      color: good ? '#14553C' : COLORS.inkFaint,
      whiteSpace: 'pre-wrap',
    }}
  >
    {text}
  </AbsoluteFill>
);

/** Bausteine zum Erklären auf einer Bühne (Sichtprüfung des Kits). */
const ErklaerKatalog: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <div style={{position: 'absolute', left: 80, top: 80}}>
      <Checklist items={['Kurz erklärt', 'Ehrlich eingeordnet', 'Mit Beispielen']} size={40} width={560} delay={6} />
    </div>
    <div style={{position: 'absolute', left: 80, top: 420}}>
      <Steps
        steps={[
          {title: 'Frage stellen', text: 'klar und konkret'},
          {title: 'Antwort prüfen', text: 'Quellen ansehen'},
          {title: 'Nachschärfen'},
        ]}
        size={38}
        width={560}
        delay={20}
        active={{index: 1, at: 90}}
      />
    </div>
    <div style={{position: 'absolute', left: 700, top: 60}}>
      <LineChart values={[12, 18, 15, 26, 31, 44]} labels={['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun']} width={560} height={420} delay={14} endLabel="Beispiel" />
    </div>
    <div style={{position: 'absolute', left: 800, top: 560}}>
      <Donut value={62} size={380} delay={30} label="Beispiel" />
    </div>
    <div style={{position: 'absolute', left: 1330, top: 80}}>
      <ScreenFocus
        width={520}
        height={400}
        contentWidth={920}
        contentHeight={640}
        keys={[
          {at: 0, x: 0, y: 0, w: 920, h: 640},
          {at: 70, x: 30, y: 180, w: 300, h: 130, highlight: true},
          {at: 140, x: 0, y: 0, w: 920, h: 640},
        ]}
      >
        <Seite />
      </ScreenFocus>
    </div>
    <div style={{position: 'absolute', left: 1330, top: 560}}>
      <BeforeAfter
        width={520}
        height={400}
        at={40}
        duration={40}
        before={prompt('mach was mit ki', false)}
        after={prompt('Schreibe 3 Ideen für\nein Reel über KI-Agenten.\nZielgruppe: Einsteiger.\nTon: locker.', true)}
      />
    </div>
    <div style={{position: 'absolute', right: 40, bottom: 26, fontFamily: FONT.sans, fontSize: 20, fontWeight: 600, color: COLORS.inkFaint}}>
      Werte in diesem Katalog sind Platzhalter
    </div>
  </AbsoluteFill>
);

export const projekt: Project = {
  id: 'Kit-Katalog-Erklaeren',
  component: ErklaerKatalog,
  format: 'landscape',
  durationInFrames: 180,
};
