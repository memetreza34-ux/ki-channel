import React from 'react';
import {AbsoluteFill} from 'remotion';
import {
  Background,
  CodeWindow,
  Confetti,
  FileTree,
  Flow,
  IconBadge,
  IconOrbit,
  LightRays,
  Meteors,
  Mindmap,
  Notifications,
  Particles,
  PerspectiveGrid,
  Ripple,
  Scramble,
  ThemeProvider,
  useTheme,
  WordRotate,
  type ThemeName,
} from '../../kit';
import type {Project} from '../types';

const W = 960;
const H = 540;

const Zelle: React.FC<{i: number; name: string; children: React.ReactNode; scale?: number}> = ({i, name, children, scale = 0.5}) => {
  const t = useTheme();
  return (
    <div style={{position: 'absolute', left: (i % 2) * W, top: Math.floor(i / 2) * H, width: W, height: H, overflow: 'hidden', outline: `1px solid ${t.c.line}`}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W / scale, height: H / scale, transform: `scale(${scale})`, transformOrigin: '0 0'}}>{children}</div>
      <div style={{position: 'absolute', left: 10, bottom: 8, fontFamily: t.font.mono, fontSize: 18, color: t.c.inkSoft}}>{name}</div>
    </div>
  );
};

const Mitte: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>{children}</AbsoluteFill>;

/** Seite 1: Atmosphäre und Text-Effekte. */
const Seite1: React.FC = () => (
  <AbsoluteFill>
    <Zelle i={0} name="LightRays + Particles">
      <Background />
      <LightRays />
      <Particles count={50} />
      <Mitte>
        <IconBadge icon="fluent-emoji-flat:trophy" size={260} tone="white" delay={4} />
      </Mitte>
    </Zelle>
    <Zelle i={1} name="PerspectiveGrid + Meteors">
      <Background pattern={false} />
      <PerspectiveGrid />
      <Meteors />
    </Zelle>
    <Zelle i={2} name="Scramble + WordRotate">
      <Background />
      <Mitte>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60}}>
          <Scramble text="KI-AGENT 2.0" size={130} />
          <WordRotate prefix="KI für" words={['Texte', 'Bilder', 'Code']} per={22} size={110} />
        </div>
      </Mitte>
    </Zelle>
    <Zelle i={3} name="Ripple + Confetti">
      <Background />
      <Mitte>
        <Ripple size={360}>
          <IconBadge icon="ph:brain-duotone" size={200} tone="solid" shape="circle" />
        </Ripple>
      </Mitte>
      <Confetti at={20} />
    </Zelle>
  </AbsoluteFill>
);

/** Seite 2: Tech und Diagramme. */
const Seite2: React.FC = () => (
  <AbsoluteFill>
    <Zelle i={0} name="CodeWindow">
      <Background />
      <Mitte>
        <CodeWindow
          title="agent.py"
          lines={['# Agent beantwortet eine Frage', 'antwort = ki.frage("Was ist neu?")', {text: 'print(antwort)', diff: 'remove'}, {text: 'zeige(antwort, kurz=True)', diff: 'add'}]}
          output="Antwort erhalten (Beispiel)"
          cps={60}
          width={1500}
          fontSize={44}
        />
      </Mitte>
    </Zelle>
    <Zelle i={1} name="FileTree + Notifications">
      <Background />
      <div style={{position: 'absolute', left: 90, top: 120}}>
        <FileTree
          nodes={[
            {name: 'mein-projekt', tiefe: 0, ordner: true},
            {name: 'src', tiefe: 1, ordner: true},
            {name: 'app.ts', tiefe: 2},
            {name: 'README.md', tiefe: 1},
          ]}
          highlight={{index: 3, at: 50}}
          size={46}
        />
      </div>
      <div style={{position: 'absolute', right: 90, top: 140}}>
        <Notifications
          width={820}
          size={40}
          items={[
            {titel: 'KI-Agent', text: 'Termin für Montag eingetragen', icon: 'ph:calendar-check-fill', at: 10},
            {titel: 'E-Mail', text: 'Antwort an Lisa entworfen', icon: 'ph:envelope-simple-fill', at: 34},
          ]}
        />
      </div>
    </Zelle>
    <Zelle i={2} name="IconOrbit">
      <Background />
      <Mitte>
        <IconOrbit
          icons={['logos:openai-icon', 'logos:claude-icon', 'logos:google-gemini', 'logos:mistral-ai-icon', 'logos:perplexity-icon', 'logos:meta-icon']}
          center={<IconBadge icon="ph:robot-duotone" size={220} tone="solid" shape="circle" />}
          radius={330}
          iconSize={140}
        />
      </Mitte>
    </Zelle>
    <Zelle i={3} name="Mindmap + Flow">
      <Background />
      <div style={{position: 'absolute', left: 40, top: 40}}>
        <Mindmap center="KI" centerIcon="ph:sparkle-fill" nodes={[{text: 'Text', icon: 'ph:text-aa-bold'}, {text: 'Bild', icon: 'ph:image-bold'}, {text: 'Code', icon: 'ph:code-bold'}, {text: 'Audio', icon: 'ph:waveform-bold'}]} width={900} height={900} size={44} />
      </div>
      <div style={{position: 'absolute', right: 60, top: 330}}>
        <Flow steps={[{text: 'Frage', icon: 'ph:chat-circle-dots-duotone'}, {text: 'Modell', icon: 'ph:brain-duotone'}, {text: 'Antwort', icon: 'ph:check-circle-duotone'}]} size={170} active={{index: 1, at: 60}} />
      </div>
    </Zelle>
  </AbsoluteFill>
);

const mitDesign = (Seite: React.FC) => {
  const Komponente: React.FC<{design: ThemeName}> = ({design}) => (
    <ThemeProvider theme={design}>
      <Seite />
    </ThemeProvider>
  );
  return Komponente;
};

export const effekteHell: Project = {id: 'Effekte-Katalog-1', component: () => React.createElement(mitDesign(Seite1), {design: 'editorial'}), format: 'landscape', durationInFrames: 120, ordner: 'Kataloge'};
export const effekteDunkel: Project = {id: 'Effekte-Katalog-1-Nacht', component: () => React.createElement(mitDesign(Seite1), {design: 'nacht'}), format: 'landscape', durationInFrames: 120, ordner: 'Kataloge'};
export const effekte2Hell: Project = {id: 'Effekte-Katalog-2', component: () => React.createElement(mitDesign(Seite2), {design: 'editorial'}), format: 'landscape', durationInFrames: 120, ordner: 'Kataloge'};
export const effekte2Pop: Project = {id: 'Effekte-Katalog-2-Pop', component: () => React.createElement(mitDesign(Seite2), {design: 'pop'}), format: 'landscape', durationInFrames: 120, ordner: 'Kataloge'};
