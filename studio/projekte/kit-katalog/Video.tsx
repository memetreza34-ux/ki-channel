import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Brain, Check, Info, Sparkles, TriangleAlert, X} from 'lucide';
import {siClaude, siGithub, siGooglegemini, siHuggingface, siMeta, siMistralai, siPerplexity} from 'simple-icons';
import {
  Background,
  BarList,
  BodyText,
  BrandLogo,
  BrowserMockup,
  COLORS,
  Counter,
  Cursor,
  FONT,
  Headline,
  IconBadge,
  Pill,
  TerminalMockup,
} from '../../kit';
import type {Project} from '../types';

/**
 * Übersicht aller Bausteine auf einer Bühne. Dient als Sichtprüfung:
 * `npm run look -- Kit-Katalog` zeigt, ob das Kit nach Änderungen noch gut aussieht.
 */
const Katalog: React.FC = () => {
  const frame = useCurrentFrame();
  const pressed = frame >= 66 && frame < 72;
  return (
    <AbsoluteFill>
      <Background />
      <div style={{position: 'absolute', left: 80, top: 90}}>
        <BrowserMockup width={880} height={520} url="ki-werkzeug.de" delay={0}>
          <div style={{padding: 44}}>
            <Headline text="Dein KI-Werkzeug" size={60} highlight={['KI-Werkzeug']} delay={8} />
            <BodyText text="Ein Klick – und es läuft." size={32} delay={16} style={{marginTop: 16}} />
            <div
              style={{
                marginTop: 44,
                width: 240,
                height: 80,
                borderRadius: 40,
                background: pressed ? COLORS.ink : COLORS.accentDeep,
                color: '#FFFFFF',
                fontFamily: FONT.sans,
                fontSize: 32,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${pressed ? 0.95 : 1})`,
              }}
            >
              Starten
            </div>
          </div>
        </BrowserMockup>
      </div>
      <div style={{position: 'absolute', left: 1040, top: 90}}>
        <TerminalMockup
          width={800}
          height={360}
          fontSize={28}
          delay={4}
          lines={[
            {text: 'npm run look -- So-Antwortet-KI', at: 14, kind: 'cmd'},
            {text: 'rendere 12 Bilder …', at: 62, kind: 'out'},
            {text: '✓ Kontaktbogen gespeichert', at: 84, kind: 'ok'},
          ]}
        />
      </div>
      <div style={{position: 'absolute', left: 1040, top: 500}}>
        <BarList
          items={[
            {label: 'Claude', value: 72},
            {label: 'Gemini', value: 55},
            {label: 'Mistral', value: 31},
          ]}
          max={100}
          delay={20}
          width={800}
          labelWidth={190}
          rowHeight={70}
          showValues
          highlight={{index: 0, at: 70}}
        />
      </div>
      <div style={{position: 'absolute', left: 80, top: 690, display: 'flex', gap: 28}}>
        {[
          [Brain, 'accent'],
          [Check, 'good'],
          [X, 'bad'],
          [TriangleAlert, 'warn'],
          [Info, 'info'],
          [Sparkles, 'solid'],
        ].map(([icon, tone], i) => (
          <IconBadge key={i} icon={icon as typeof Brain} tone={tone as 'accent'} size={118} delay={24 + i * 4} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 80, top: 860, display: 'flex', gap: 24}}>
        {[siClaude, siGooglegemini, siMistralai, siPerplexity, siMeta, siGithub, siHuggingface].map((logo, i) => (
          <BrandLogo key={logo.slug} logo={logo} size={104} tile delay={40 + i * 4} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 1040, top: 800, display: 'flex', alignItems: 'center', gap: 30}}>
        <Counter to={1284} delay={30} duration={50} size={150} />
        <Pill icon={Sparkles} delay={60}>Counter</Pill>
      </div>
      <Cursor path={[{at: 20, x: 760, y: 620}, {at: 58, x: 250, y: 440}]} clicks={[66]} />
      <div style={{position: 'absolute', right: 40, bottom: 26, fontFamily: FONT.sans, fontSize: 20, fontWeight: 600, color: COLORS.inkFaint}}>
        Werte in diesem Katalog sind Platzhalter
      </div>
    </AbsoluteFill>
  );
};

export const projekt: Project = {
  id: 'Kit-Katalog',
  component: Katalog,
  format: 'landscape',
  durationInFrames: 150,
  ordner: 'Kataloge',
};
