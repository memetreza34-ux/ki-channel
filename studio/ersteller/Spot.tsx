import React from 'react';
import {AbsoluteFill, type CalculateMetadataFunction} from 'remotion';
import {
  Background,
  Checklist,
  EndCard,
  Headline,
  PunchText,
  SafeArea,
  Scenes,
  scenesDuration,
  Sfx,
  Sticker,
  ThemeProvider,
  useLayout,
  useTheme,
  type SceneItem,
} from '../kit';
import {Held, Medien, sizeOf, useScale} from './gemeinsam';
import type {SpotProps} from './schema';

/**
 * 8-Sekunden-Spot: Knaller-Hook (2,4 s) → Held mit Nutzen (3,4 s) → Handlungsaufforderung.
 * Gleicher Aufbau in jedem Design und Format.
 */

const HOOK = 78;
const HELD = 102;
const ENDE = 84;
const UEBERGANG = 12;

const Hook: React.FC<{woerter: string[]; sounds: boolean}> = ({woerter, sounds}) => {
  const u = useScale();
  const t = useTheme();
  const step = Math.floor((HOOK - 18) / woerter.length);
  return (
    <AbsoluteFill>
      <SafeArea>
        <PunchText
          size={220 * u}
          words={woerter.map((text, i) => ({text, at: i * step, bg: i === woerter.length - 1 ? t.c.accentDeep : undefined}))}
        />
      </SafeArea>
      {sounds ? woerter.map((_, i) => <Sfx key={i} name={i === woerter.length - 1 ? 'punchHeavy' : 'punch'} at={i * step} volume={0.5} />) : null}
    </AbsoluteFill>
  );
};

const HeldSzene: React.FC<{p: SpotProps}> = ({p}) => {
  const u = useScale();
  const {isWide, width, safe} = useLayout();
  const held = <Held icon={p.held.icon} lottie={p.held.lottie} size={(isWide ? 300 : 260) * u} delay={2} />;
  const text = (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: isWide ? 'flex-start' : 'center', gap: 40 * u}}>
      <Headline text={p.held.titel} size={96 * u} align={isWide ? 'left' : 'center'} highlight={p.held.hervorheben} marker delay={6} maxWidth={isWide ? 900 : undefined} />
      {p.punkte.length > 0 ? <Checklist items={p.punkte} size={50 * u} width={680 * u} delay={26} step={12} /> : null}
    </div>
  );
  return (
    <AbsoluteFill>
      <SafeArea gap={48 * u} style={isWide ? {flexDirection: 'row'} : undefined}>
        {held}
        {text}
      </SafeArea>
      {p.sticker ? (
        <div style={{position: 'absolute', top: safe.top - 10, left: width - safe.side - 190 * u}}>
          <Sticker text={p.sticker} size={210 * u} delay={56} />
        </div>
      ) : null}
      {p.sounds ? (
        <>
          <Sfx name="whoosh" at={0} volume={0.35} />
          {p.punkte.length > 0 ? <Sfx name="success" at={26 + (p.punkte.length - 1) * 12} volume={0.35} /> : null}
          {p.sticker ? <Sfx name="pop" at={56} volume={0.5} /> : null}
        </>
      ) : null}
    </AbsoluteFill>
  );
};

const Ende: React.FC<{p: SpotProps}> = ({p}) => {
  const u = useScale();
  return (
    <AbsoluteFill>
      <Background variant="accent" seed="spot-ende" />
      <SafeArea>
        <EndCard title={p.cta.titel} button={p.cta.knopf} name={p.kanalname} handle={p.handle} size={u * 1.1} />
      </SafeArea>
      {p.sounds ? <Sfx name="jingleSteel" at={20} volume={0.45} /> : null}
    </AbsoluteFill>
  );
};

const szenen = (p: SpotProps): SceneItem[] => [
  {name: 'Hook', duration: HOOK, content: <Hook woerter={p.hook} sounds={p.sounds} />},
  {name: 'Held', duration: HELD, content: <HeldSzene p={p} />, transition: 'slide-up', transitionFrames: UEBERGANG},
  {name: 'Ende', duration: ENDE, content: <Ende p={p} />, transition: 'zoom', transitionFrames: UEBERGANG},
];

export const Spot: React.FC<SpotProps> = (p) => (
  <ThemeProvider theme={p.design}>
    <AbsoluteFill>
      <Background seed="spot" />
      <Scenes items={szenen(p)} />
      <Medien voiceover={p.voiceover} musik={p.musik} wortzeiten={p.wortzeiten} />
    </AbsoluteFill>
  </ThemeProvider>
);

export const spotMetadata: CalculateMetadataFunction<SpotProps> = ({props}) => ({
  ...sizeOf(props.format),
  durationInFrames: scenesDuration(szenen(props)),
});
