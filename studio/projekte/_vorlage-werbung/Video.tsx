import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {TriangleAlert} from 'lucide';
import {
  Background,
  CaptionTrack,
  Checklist,
  COLORS,
  EndCard,
  Headline,
  Music,
  Pill,
  PunchText,
  SafeArea,
  Scenes,
  scenesDuration,
  Sfx,
  Sticker,
  useLayout,
  type SceneItem,
} from '../../kit';
import type {Project} from '../types';
import untertitel from './untertitel.json';

/** Dateien in studio/public/projekte/__SLUG__/ ablegen und hier eintragen. */
const VOICEOVER: string | null = null; // z. B. 'projekte/__SLUG__/voiceover.mp3'
const MUSIK: string | null = null; // z. B. 'projekte/__SLUG__/musik.mp3'

/** Im Hochformat ist mehr Platz: dort alles größer. */
const useScale = () => {
  const {u, isTall} = useLayout();
  return u * (isTall ? 1.25 : 1);
};

// 1 · Knaller-Hook: in 2 Sekunden klar machen, worum es geht.
const Hook: React.FC = () => {
  const u = useScale();
  return (
    <AbsoluteFill>
      <SafeArea>
        <PunchText
          size={210 * u}
          words={[
            {text: 'Wort eins', at: -6},
            {text: 'Wort zwei', at: 20},
            {text: 'Die Lösung.', at: 40, bg: COLORS.accentDeep},
          ]}
        />
      </SafeArea>
      <Sfx name="punch" at={0} volume={0.5} />
      <Sfx name="punch" at={20} volume={0.5} />
      <Sfx name="punchHeavy" at={40} volume={0.55} />
    </AbsoluteFill>
  );
};

// 2 · Problem, das die Zielgruppe kennt.
const Problem: React.FC = () => {
  const u = useScale();
  return (
    <AbsoluteFill>
      <SafeArea gap={56 * u}>
        <Pill icon={TriangleAlert} tone="bad" size={40 * u} delay={4}>
          Kennst du das?
        </Pill>
        <Checklist tone="bad" items={['Problem eins', 'Problem zwei', 'Problem drei']} size={58 * u} width={720 * u} delay={12} />
      </SafeArea>
      <Sfx name="swipe" at={0} volume={0.4} />
    </AbsoluteFill>
  );
};

// 3 · Lösung / Nutzen.
const Loesung: React.FC = () => {
  const u = useScale();
  const {width, safe} = useLayout();
  return (
    <AbsoluteFill>
      <SafeArea gap={56 * u}>
        <Headline text="Hier steht das Versprechen." size={104 * u} align="center" highlight={['Versprechen']} marker delay={2} />
        <Checklist items={['Nutzen eins', 'Nutzen zwei', 'Nutzen drei']} size={54 * u} width={720 * u} delay={22} />
      </SafeArea>
      <div style={{position: 'absolute', top: safe.top - 10, left: width - safe.side - 200 * u}}>
        <Sticker text="Neu" size={220 * u} delay={60} />
      </div>
      <Sfx name="whoosh" at={0} volume={0.35} />
      <Sfx name="pop" at={60} volume={0.5} />
    </AbsoluteFill>
  );
};

// 4 · Handlungsaufforderung.
const Ende: React.FC = () => {
  const u = useScale();
  return (
    <AbsoluteFill>
      <Background variant="accent" seed="__SLUG__-ende" />
      <SafeArea>
        <EndCard title="Mehr KI, einfach erklärt." button="Jetzt folgen" size={u} />
      </SafeArea>
      <Sfx name="jingleSteel" at={22} volume={0.45} />
    </AbsoluteFill>
  );
};

const SCENES: SceneItem[] = [
  {name: 'Hook', duration: 66, content: <Hook />},
  {name: 'Problem', duration: 80, content: <Problem />, transition: 'slide-up'},
  {name: 'Lösung', duration: 96, content: <Loesung />, transition: 'zoom'},
  {name: 'Ende', duration: 90, content: <Ende />, transition: 'slide-up'},
];

const Video: React.FC = () => (
  <AbsoluteFill style={{background: COLORS.bg}}>
    <Background seed="__SLUG__" />
    <Scenes items={SCENES} />
    {VOICEOVER ? <Audio src={staticFile(VOICEOVER)} /> : null}
    {VOICEOVER ? <CaptionTrack captions={untertitel} /> : null}
    {MUSIK ? <Music src={MUSIK} volume={0.45} captions={untertitel} /> : null}
  </AbsoluteFill>
);

export const projekt: Project = {
  id: '__ID__',
  component: Video,
  // Werbung meist in mehreren Formaten: 9:16 (Reels/TikTok), 1:1 (Feed), 4:5 (Feed-Ads).
  format: ['vertical', 'square', 'portrait'],
  durationInFrames: scenesDuration(SCENES),
};
