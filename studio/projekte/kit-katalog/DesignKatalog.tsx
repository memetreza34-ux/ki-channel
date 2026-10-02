import React from 'react';
import {AbsoluteFill} from 'remotion';
import {
  Background,
  BodyText,
  Checklist,
  Headline,
  IconBadge,
  Lottie,
  Pill,
  THEME_NAMES,
  THEMES,
  ThemeProvider,
  useTheme,
} from '../../kit';
import type {Project} from '../types';

const W = 640;
const H = 540;

const Zelle: React.FC = () => {
  const t = useTheme();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Background seed={t.name} />
      <div style={{position: 'absolute', left: 36, top: 30}}>
        <Pill icon="ph:sparkle-duotone" size={22} delay={0}>
          {t.label}
        </Pill>
      </div>
      <div style={{position: 'absolute', left: 36, top: 100, width: 380}}>
        <Headline text="So lernt eine KI" size={52} highlight={['KI']} marker delay={4} />
        <BodyText text="Daten rein, Muster raus." size={24} delay={14} style={{marginTop: 10}} />
      </div>
      <div style={{position: 'absolute', left: 36, top: 290}}>
        <Checklist items={['Daten sammeln', 'Muster finden']} size={26} width={300} delay={20} step={8} />
      </div>
      <div style={{position: 'absolute', right: 34, top: 96, display: 'grid', gridTemplateColumns: 'repeat(2, 92px)', gap: 16}}>
        <IconBadge icon="ph:brain-duotone" size={92} delay={10} />
        <IconBadge icon="tabler:robot" size={92} tone="solid" delay={14} />
        <IconBadge icon="fluent-emoji-flat:rocket" size={92} tone="white" delay={18} loop="float" />
        <IconBadge icon="logos:openai-icon" size={92} tone="white" delay={22} />
      </div>
      <div style={{position: 'absolute', right: 40, bottom: 26}}>
        <Lottie name="emoji/gluehbirne" size={130} delay={24} loop />
      </div>
      <div style={{position: 'absolute', left: 360, bottom: 40}}>
        <Lottie name="ui/checkmark" size={90} delay={30} color="accent" />
      </div>
    </AbsoluteFill>
  );
};

/** Dieselbe Mini-Szene in allen Designs nebeneinander – zum Aussuchen. */
const DesignKatalog: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {THEME_NAMES.map((name, i) => (
      <div key={name} style={{position: 'absolute', left: (i % 3) * W, top: Math.floor(i / 3) * H, width: W, height: H, overflow: 'hidden'}}>
        <ThemeProvider theme={THEMES[name]}>
          <Zelle />
        </ThemeProvider>
      </div>
    ))}
  </AbsoluteFill>
);

export const projekt: Project = {
  id: 'Design-Katalog',
  component: DesignKatalog,
  format: 'landscape',
  durationInFrames: 120,
};
