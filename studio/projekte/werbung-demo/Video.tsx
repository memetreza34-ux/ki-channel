import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TriangleAlert} from 'lucide';
import {
  Background,
  Checklist,
  COLORS,
  EndCard,
  Headline,
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

/**
 * Werbe-Beispiel in drei Formaten auf einmal (9:16, 1:1, 4:5).
 * Aufbau: Knaller-Hook → Problem → Lösung → Endkarte.
 */

/** Im Hochformat ist mehr Platz nach oben/unten: dort alles größer. */
const useScale = () => {
  const {u, isTall} = useLayout();
  return u * (isTall ? 1.25 : 1);
};

const Hook: React.FC = () => {
  const u = useScale();
  return (
    <AbsoluteFill>
      <SafeArea>
        <PunchText
          size={210 * u}
          words={[
            {text: 'Neue KI?', at: 0},
            {text: 'Kein Plan?', at: 22},
            {text: 'Wir erklären’s.', at: 44, bg: COLORS.accentDeep},
          ]}
        />
      </SafeArea>
      <Sfx name="punch" at={0} volume={0.5} />
      <Sfx name="punch" at={22} volume={0.5} />
      <Sfx name="punchHeavy" at={44} volume={0.55} />
    </AbsoluteFill>
  );
};

const Problem: React.FC = () => {
  const u = useScale();
  return (
    <AbsoluteFill>
      <SafeArea gap={56 * u}>
        <Pill icon={TriangleAlert} tone="bad" size={40 * u} delay={4}>
          Kennst du das?
        </Pill>
        <Checklist tone="bad" items={['Fachchinesisch', 'Hype ohne Einordnung', 'Viel zu lang']} size={58 * u} width={720 * u} delay={12} step={12} />
      </SafeArea>
      <Sfx name="swipe" at={0} volume={0.4} />
      <Sfx name="wrong" at={14} volume={0.3} />
    </AbsoluteFill>
  );
};

const Loesung: React.FC = () => {
  const u = useScale();
  const {width, safe} = useLayout();
  return (
    <AbsoluteFill>
      <SafeArea gap={56 * u}>
        <Headline text="Hier: KI einfach erklärt." size={104 * u} align="center" highlight={['einfach']} marker delay={2} />
        <Checklist items={['Kurz auf den Punkt', 'Ehrlich eingeordnet', 'Mit echten Beispielen']} size={54 * u} width={720 * u} delay={22} step={12} />
      </SafeArea>
      <div style={{position: 'absolute', top: safe.top - 10, left: width - safe.side - 200 * u}}>
        <Sticker text="Gratis" size={220 * u} delay={60} />
      </div>
      <Sfx name="whoosh" at={0} volume={0.35} />
      <Sfx name="success" at={46} volume={0.4} />
      <Sfx name="pop" at={60} volume={0.5} />
    </AbsoluteFill>
  );
};

const Ende: React.FC = () => {
  const u = useScale();
  return (
    <AbsoluteFill>
      <Background variant="accent" seed="werbung-ende" />
      <SafeArea>
        <EndCard title="Mehr KI, einfach erklärt." button="Jetzt folgen" size={u} delay={0} />
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
    <Background seed="werbung-demo" />
    <Scenes items={SCENES} />
  </AbsoluteFill>
);

export const projekt: Project = {
  id: 'Werbung-Demo',
  component: Video,
  format: ['vertical', 'square', 'portrait'],
  durationInFrames: scenesDuration(SCENES),
};
