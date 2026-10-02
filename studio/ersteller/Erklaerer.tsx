import React from 'react';
import {AbsoluteFill, type CalculateMetadataFunction} from 'remotion';
import {
  BeforeAfter,
  Background,
  BodyText,
  Caption,
  ChatBubble,
  Checklist,
  Counter,
  Donut,
  EndCard,
  FPS,
  Headline,
  IconBadge,
  Pill,
  SafeArea,
  Scenes,
  scenesDuration,
  Sfx,
  Steps,
  ThemeProvider,
  TokenChips,
  useLayout,
  useTheme,
  type SceneItem,
} from '../kit';
import {Held, Medien, sizeOf, useScale} from './gemeinsam';
import type {ErklaererProps, Szene} from './schema';

/**
 * Erklärvideo aus einer Liste von Szenen. Jede Szene ist ein bewährter Aufbau
 * (Titel, Liste, Schritte, Vergleich, Zahl, Chat, Icons, Tokens, Ende).
 */

type Ctx = {sounds: boolean; ohneUntertitel: boolean; kanalname?: string; handle?: string};

const Titel: React.FC<{titel: string; hervorheben?: string[]; delay?: number}> = ({titel, hervorheben, delay = 0}) => {
  const u = useScale();
  return <Headline text={titel} size={88 * u} align="center" highlight={hervorheben ?? []} marker delay={delay} />;
};

const Panel: React.FC<{text: string; gut: boolean}> = ({text, gut}) => {
  const t = useTheme();
  const u = useScale();
  return (
    <AbsoluteFill
      style={{
        background: gut ? t.c.goodTint : t.c.bg,
        padding: `${110 * u}px ${48 * u}px ${48 * u}px`,
        fontFamily: t.font.body,
        fontWeight: 700,
        fontSize: 44 * u,
        lineHeight: 1.3,
        color: gut ? t.c.ink : t.c.inkFaint,
      }}
    >
      {text}
    </AbsoluteFill>
  );
};

const SzeneInhalt: React.FC<{s: Szene; ctx: Ctx}> = ({s, ctx}) => {
  const u = useScale();
  const {isWide, width} = useLayout();
  const t = useTheme();
  const snd = ctx.sounds;
  const inner = (() => {
    switch (s.typ) {
      case 'titel':
        return (
          <SafeArea gap={44 * u} style={isWide ? {flexDirection: 'row'} : undefined}>
            <Held icon={s.icon} lottie={s.lottie} size={(isWide ? 320 : 300) * u} delay={4} />
            <div style={{display: 'flex', flexDirection: 'column', alignItems: isWide ? 'flex-start' : 'center', gap: 28 * u}}>
              {s.kicker ? (
                <Pill size={34 * u} delay={-6}>
                  {s.kicker}
                </Pill>
              ) : null}
              <Headline text={s.titel} size={108 * u} align={isWide ? 'left' : 'center'} highlight={s.hervorheben ?? []} marker delay={-8} maxWidth={isWide ? 1000 : undefined} />
            </div>
            {snd ? <Sfx name="whoosh" at={0} volume={0.35} /> : null}
          </SafeArea>
        );
      case 'aussage':
        return (
          <SafeArea gap={44 * u}>
            {s.icon || s.lottie ? <Held icon={s.icon} lottie={s.lottie} size={220 * u} delay={2} /> : null}
            <Headline text={s.text} size={100 * u} align="center" highlight={s.hervorheben ?? []} marker delay={4} step={4} />
            {snd ? <Sfx name="impact" at={4} volume={0.4} /> : null}
          </SafeArea>
        );
      case 'liste':
        return (
          <SafeArea gap={52 * u}>
            <Titel titel={s.titel} />
            <Checklist items={s.punkte} tone={s.ton === 'gut' ? 'good' : 'bad'} size={56 * u} width={Math.min(width - 160, 820 * u)} delay={16} step={14} />
            {snd ? s.punkte.map((_, i) => <Sfx key={i} name={s.ton === 'gut' ? 'tink' : 'wrong'} at={16 + i * 14} volume={0.3} />) : null}
          </SafeArea>
        );
      case 'schritte': {
        const step = 18;
        return (
          <SafeArea gap={52 * u}>
            <Titel titel={s.titel} />
            <Steps steps={s.schritte.map((x) => ({title: x.titel, text: x.text}))} size={48 * u} width={Math.min(width - 160, 820 * u)} delay={14} step={step} />
            {snd ? s.schritte.map((_, i) => <Sfx key={i} name="blip" at={14 + i * step} volume={0.35} />) : null}
          </SafeArea>
        );
      }
      case 'vergleich': {
        const w = Math.min(width - 160, isWide ? 1100 : 860 * u);
        return (
          <SafeArea gap={48 * u}>
            <Titel titel={s.titel} />
            <BeforeAfter width={w} height={w * (isWide ? 0.45 : 0.62)} at={30} duration={36} before={<Panel text={s.vorher} gut={false} />} after={<Panel text={s.nachher} gut />} />
            {snd ? <Sfx name="swipe" at={30} volume={0.4} /> : null}
          </SafeArea>
        );
      }
      case 'zahl':
        return (
          <SafeArea gap={40 * u}>
            <Titel titel={s.titel} />
            {s.ring ? (
              <Donut value={s.wert} size={460 * u} thickness={52 * u} delay={18} label={s.text} />
            ) : (
              <>
                <Counter to={s.wert} delay={18} duration={40} size={240 * u} suffix={s.einheit ? ` ${s.einheit}` : ''} color={t.c.accentDeep} />
                {s.text ? <BodyText text={s.text} size={48 * u} align="center" delay={40} /> : null}
              </>
            )}
            {s.beispiel ? (
              <Pill tone="white" size={28 * u} delay={50}>
                Beispielwert
              </Pill>
            ) : null}
            {snd ? (
              <>
                <Sfx name="riseShort" at={18} volume={0.35} />
                <Sfx name="ding" at={58} volume={0.35} />
              </>
            ) : null}
          </SafeArea>
        );
      case 'chat':
        return (
          <SafeArea gap={36 * u} align="stretch">
            <div style={{width: '100%', maxWidth: 900, alignSelf: 'center', display: 'flex', flexDirection: 'column', gap: 36 * u}}>
              <ChatBubble role="user" text={s.frage} delay={6} size={44 * u} maxWidth={720 * u} />
              <ChatBubble role="ai" text={s.antwort} delay={28} typing={26} stream={Math.max(30, s.sekunden * FPS - 90)} size={42 * u} maxWidth={760 * u} />
            </div>
            {snd ? (
              <>
                <Sfx name="pop" at={6} volume={0.4} />
                <Sfx name="notify" at={54} volume={0.35} />
              </>
            ) : null}
          </SafeArea>
        );
      case 'icons': {
        const cols = s.icons.length <= 3 ? s.icons.length : s.icons.length === 4 ? 2 : 3;
        const size = (s.icons.length <= 3 ? 210 : 180) * u;
        return (
          <SafeArea gap={56 * u}>
            <Titel titel={s.titel} />
            <div style={{display: 'grid', gridTemplateColumns: `repeat(${isWide ? Math.min(s.icons.length, 6) : cols}, ${size + 40 * u}px)`, gap: 36 * u, justifyContent: 'center'}}>
              {s.icons.map((it, i) => (
                <div key={it.text} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 * u}}>
                  <IconBadge icon={it.icon} size={size} tone={i % 2 === 0 ? 'accent' : 'white'} delay={14 + i * 7} />
                  <BodyText text={it.text} size={36 * u} weight={800} color={t.c.ink} align="center" delay={18 + i * 7} />
                </div>
              ))}
            </div>
            {snd ? s.icons.slice(0, 4).map((_, i) => <Sfx key={i} name="pop" at={14 + i * 7} volume={0.3} />) : null}
          </SafeArea>
        );
      }
      case 'tokens':
        return (
          <SafeArea gap={56 * u}>
            <Titel titel={s.titel} />
            <TokenChips tokens={s.tokens} size={66 * u} maxWidth={Math.min(width - 160, 960)} delay={16} step={6} />
            {snd ? <Sfx name="glitch" at={16} volume={0.3} /> : null}
          </SafeArea>
        );
      case 'ende':
        return (
          <AbsoluteFill>
            <Background variant="accent" seed="erklaerer-ende" />
            <SafeArea>
              <EndCard title={s.titel} button={s.knopf ?? 'Folgen'} name={ctx.kanalname} handle={ctx.handle} size={u * 1.1} />
            </SafeArea>
            {snd ? <Sfx name="jingleSteel" at={20} volume={0.45} /> : null}
          </AbsoluteFill>
        );
    }
  })();
  return (
    <AbsoluteFill>
      {inner}
      {s.untertitel && !ctx.ohneUntertitel ? <Caption text={s.untertitel} delay={2} /> : null}
    </AbsoluteFill>
  );
};

const szenen = (p: ErklaererProps): SceneItem[] => {
  const ctx: Ctx = {sounds: p.sounds, ohneUntertitel: Boolean(p.wortzeiten), kanalname: p.kanalname, handle: p.handle};
  return p.szenen.map((s, i) => ({
    name: `${i + 1} ${s.typ}`,
    duration: Math.round(s.sekunden * FPS),
    content: <SzeneInhalt s={s} ctx={ctx} />,
    transition: i === 0 ? undefined : p.uebergang,
  }));
};

export const Erklaerer: React.FC<ErklaererProps> = (p) => (
  <ThemeProvider theme={p.design}>
    <AbsoluteFill>
      <Background seed="erklaerer" />
      <Scenes items={szenen(p)} />
      <Medien voiceover={p.voiceover} musik={p.musik} wortzeiten={p.wortzeiten} />
    </AbsoluteFill>
  </ThemeProvider>
);

export const erklaererMetadata: CalculateMetadataFunction<ErklaererProps> = ({props}) => ({
  ...sizeOf(props.format),
  durationInFrames: scenesDuration(szenen(props)),
});
