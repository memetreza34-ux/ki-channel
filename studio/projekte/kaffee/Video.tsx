import React from 'react';
import {AbsoluteFill, Audio, interpolateColors, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Flame, Leaf} from 'lucide';
import {
  BodyText,
  Caption,
  CaptionTrack,
  clamp01,
  Confetti,
  Counter,
  EndCard,
  IconBadge,
  Footage,
  Headline,
  LightRays,
  Lottie,
  mix,
  Particles,
  Pill,
  pop,
  progress,
  PunchText,
  SafeArea,
  Scenes,
  scenesDuration,
  Sfx,
  Sticker,
  useTheme,
  type SceneItem,
} from '../../kit';
import {Background} from '../../kit';
import type {Project} from '../types';
import untertitel from './untertitel.json';

/** Voiceover in studio/public/projekte/kaffee/ ablegen und hier eintragen, z. B. 'projekte/kaffee/voiceover.mp3'. */
const VOICEOVER: string | null = null;

const CLIP = {
  bohnen: 'projekte/kaffee/broll/44802.mp4',
  sack: 'projekte/kaffee/broll/88935.mp4',
  pulver: 'projekte/kaffee/broll/15484.mp4',
  giessen: 'projekte/kaffee/broll/329141.mp4',
};

const WHITE = '#FFFFFF';
const BEAN_GREEN = '#8FB35A';
const BEAN_GREEN_DEEP = '#5E7F33';
const BEAN_BROWN = '#5A3519';
const BEAN_BROWN_DEEP = '#2E1A0C';

/** Kaffeebohne von oben: Oval mit S-förmiger Kerbe. */
const Bean: React.FC<{size: number; fill: string; groove: string; rotate?: number}> = ({size, fill, groove, rotate = 0}) => (
  <svg width={size * 0.72} height={size} viewBox="0 0 72 100" style={{transform: `rotate(${rotate}deg)`, overflow: 'visible'}}>
    <ellipse cx="36" cy="50" rx="34" ry="48" fill={fill} />
    <ellipse cx="26" cy="32" rx="9" ry="16" fill="#FFFFFF" opacity="0.18" />
    <path d="M36 6 C 22 30, 50 70, 36 94" stroke={groove} strokeWidth="5" fill="none" strokeLinecap="round" />
  </svg>
);

// ── 1 · Hook ────────────────────────────────────────────────────────────
const Hook: React.FC = () => (
  <AbsoluteFill>
    <Footage src={CLIP.bohnen} zoom={[1.15, 1.3]} dim={0.55} vignette />
    <SafeArea>
      <PunchText
        stack
        size={170}
        words={[
          {text: 'Deine', at: 0, color: WHITE},
          {text: 'Bohne war', at: 10, color: WHITE},
          {text: 'mal eine', at: 22, color: WHITE},
          {text: 'Kirsche', at: 36, color: WHITE, bg: '#C8323F'},
        ]}
      />
    </SafeArea>
    <Sfx name="punch" at={0} volume={0.35} />
    <Sfx name="punchHeavy" at={36} volume={0.4} />
    <Caption text="Wusstest du, dass Kaffee aus einer Frucht kommt?" delay={4} />
  </AbsoluteFill>
);

// ── 2 · Kirsche öffnet sich → zwei Bohnen ───────────────────────────────
const Kirsche: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTheme();
  const cx = 540;
  const cy = 860;
  const r = 230;
  const enter = pop(frame, fps, 6, 'bouncy');
  // Bei Frame 54 platzt die Kirsche auf: Hälften gleiten auseinander.
  const split = progress(frame, 54, 26, 'out');
  const beans = pop(frame, fps, 60, 'snappy');
  const cherryLabel = clamp01(progress(frame, 22, 12, 'soft') - split * 1.4);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 300, left: 70, right: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
        <Pill icon={Leaf} delay={-6}>
          Am Kaffeestrauch
        </Pill>
        <Headline text="Erst Frucht, dann Bohne" size={104} align="center" highlight={['Bohne']} marker delay={-4} />
      </div>

      {/* Zwei Samen, flache Seiten zueinander */}
      <div
        style={{
          position: 'absolute',
          left: cx - 200,
          top: cy - 160,
          width: 400,
          display: 'flex',
          justifyContent: 'center',
          gap: 14,
          transform: `scale(${Math.max(0, beans)})`,
          opacity: clamp01(beans * 2),
        }}
      >
        <Bean size={290} fill={BEAN_GREEN} groove={BEAN_GREEN_DEEP} rotate={-8} />
        <Bean size={290} fill={BEAN_GREEN} groove={BEAN_GREEN_DEEP} rotate={8} />
      </div>

      {/* Kirsche in zwei Hälften */}
      {[-1, 1].map((side) => (
        <div
          key={side}
          style={{
            position: 'absolute',
            left: cx - r,
            top: cy - r,
            width: r * 2,
            height: r * 2,
            clipPath: side < 0 ? 'inset(0 50% 0 0)' : 'inset(0 0 0 50%)',
            transform: `translateX(${side * split * 250}px) rotate(${side * split * 18}deg) scale(${Math.max(0, enter)})`,
            opacity: 1 - progress(frame, 70, 16, 'in') * 0.65,
          }}
        >
          <svg width={r * 2} height={r * 2} viewBox="0 0 200 200">
            <defs>
              <radialGradient id={`kirsche${side}`} cx="0.38" cy="0.35" r="0.7">
                <stop offset="0" stopColor="#F2545B" />
                <stop offset="1" stopColor="#A3161F" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="104" r="92" fill={`url(#kirsche${side})`} />
            <ellipse cx="70" cy="64" rx="22" ry="13" fill="#FFFFFF" opacity="0.35" transform="rotate(-30 70 64)" />
            <path d="M100 14 C 104 4, 112 -2, 124 -4" stroke="#5B3A1E" strokeWidth="7" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      ))}

      <div style={{position: 'absolute', top: cy + r + 50, left: 0, right: 0, textAlign: 'center', opacity: cherryLabel}}>
        <BodyText text="Kaffeekirsche" size={56} weight={800} color={t.c.ink} align="center" />
      </div>
      <div style={{position: 'absolute', top: cy + r + 50, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        {frame >= 72 ? <Pill tone="solid" size={46} delay={72}>2 Samen = 2 Bohnen</Pill> : null}
      </div>

      <Sfx name="pop" at={8} volume={0.35} />
      <Sfx name="swoosh" at={54} volume={0.35} />
      <Sfx name="ding" at={74} volume={0.35} />
      <Caption text="In jeder Kaffeekirsche stecken meist zwei Samen – das sind die Bohnen." delay={4} />
    </AbsoluteFill>
  );
};

// ── 3 · Der Weg ─────────────────────────────────────────────────────────
const WEG = [
  {text: 'Pflücken', icon: 'fluent-emoji-flat:basket'},
  {text: 'Trocknen', icon: 'fluent-emoji-flat:sun'},
  {text: 'Rösten', icon: 'fluent-emoji-flat:fire'},
  {text: 'Aufbrühen', icon: 'fluent-emoji-flat:hot-beverage'},
];

const Weg: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTheme();
  const rowAt = (i: number) => 8 + i * 8;
  // Danach leuchtet Station für Station auf und bleibt auf „Rösten“ stehen.
  const activeAt = (i: number) => 44 + i * 16;
  const active = Math.min(2, Math.floor(Math.max(0, frame - 44) / 16));
  const line = progress(frame, 44, 16 * 2.2, 'inOut');
  const ROW = 210;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 300, left: 70, right: 70, display: 'flex', justifyContent: 'center'}}>
        <Headline text="Der Weg in deine Tasse" size={104} align="center" highlight={['Tasse']} delay={-4} />
      </div>
      <div style={{position: 'absolute', top: 620, left: 150, width: 800}}>
        {/* Fortschrittslinie hinter den Icons */}
        <div style={{position: 'absolute', left: 75 - 5, top: 75, width: 10, height: ROW * 3, borderRadius: 5, background: t.c.line}} />
        <div style={{position: 'absolute', left: 75 - 5, top: 75, width: 10, height: ROW * 3 * line * (2 / 3), borderRadius: 5, background: t.c.accentDeep}} />
        {WEG.map((w, i) => {
          const s = pop(frame, fps, rowAt(i), 'snappy');
          const on = frame >= activeAt(i) && i <= active;
          const current = i === active && frame >= activeAt(i);
          return (
            <div
              key={w.text}
              style={{
                position: 'absolute',
                top: i * ROW,
                left: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 50,
                opacity: clamp01(s * 2) * (frame >= 44 && !on ? 0.45 : 1),
                transform: `translateX(${(1 - Math.min(1, s)) * -60}px) scale(${current ? 1.06 : 1})`,
                transformOrigin: '75px 75px',
              }}
            >
              <IconBadge icon={w.icon} size={150} tone={on ? 'solid' : 'white'} delay={rowAt(i)} />
              <div style={{fontFamily: t.font.body, fontWeight: 800, fontSize: 68, color: t.c.ink, letterSpacing: '-0.02em'}}>{w.text}</div>
            </div>
          );
        })}
      </div>
      {WEG.map((_, i) => (
        <Sfx key={i} name="blip" at={rowAt(i)} volume={0.25} />
      ))}
      <Sfx name="tink" at={activeAt(2)} volume={0.35} />
      <Caption text="Gepflückt, getrocknet, geröstet – und erst ganz am Ende aufgebrüht." delay={4} />
    </AbsoluteFill>
  );
};

// ── 4 · Rösten: grün → braun ────────────────────────────────────────────
const KNACK = 78;

const Roesten: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const heat = progress(frame, 14, 80, 'inOut');
  const fill = interpolateColors(heat, [0, 0.55, 1], [BEAN_GREEN, '#B07A3A', BEAN_BROWN]);
  const groove = interpolateColors(heat, [0, 1], [BEAN_GREEN_DEEP, BEAN_BROWN_DEEP]);
  // Beim Knacken dehnt sich die Bohne kurz aus.
  const crack = pop(frame, fps, KNACK, 'bouncy');
  const scale = 1 + (frame >= KNACK ? 0.12 * Math.min(1, crack) : 0);
  const shake = frame >= KNACK && frame < KNACK + 8 ? Math.sin(frame * 3) * 6 : 0;
  return (
    <AbsoluteFill>
      <Footage src={CLIP.sack} zoom={[1.1, 1.2]} dim={0.72} vignette startAt={1} />
      <LightRays y="48%" color="#F2A65A" opacity={0.18 + heat * 0.25} delay={10} />
      <Particles count={26} color="#F2A65A" seed="glut" opacity={0.25 + heat * 0.5} />
      <SafeArea gap={56}>
        <Pill icon={Flame} tone="white" delay={-6}>
          Im Röster
        </Pill>
        <div style={{transform: `translateX(${shake}px) scale(${scale})`}}>
          <Bean size={380} fill={fill} groove={groove} />
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 20, color: WHITE}}>
          <BodyText text="über" size={64} weight={800} color={WHITE} />
          <Counter from={20} to={200} delay={14} duration={60} suffix=" °C" size={150} color={WHITE} />
        </div>
      </SafeArea>
      <div style={{position: 'absolute', right: 110, top: 640}}>
        <Sticker text="KNACK!" size={250} delay={KNACK} rotate={12} color="#F2A65A" textColor="#2E1A0C" />
      </div>
      <Sfx name="riser" at={14} volume={0.25} />
      <Sfx name="impact" at={KNACK} volume={0.4} />
      <Caption text="Erst beim Rösten wird die grüne Bohne braun – und bekommt ihr Aroma." delay={4} />
    </AbsoluteFill>
  );
};

// ── 5 · Mahlen ──────────────────────────────────────────────────────────
const Mahlen: React.FC = () => (
  <AbsoluteFill>
    <SafeArea gap={56}>
      <Headline text="Gemahlen erst kurz vorher" size={100} align="center" highlight={['kurz', 'vorher']} marker delay={-4} />
      <Footage src={CLIP.pulver} width={900} height={760} framed zoom={[1.05, 1.18]} startAt={1} delay={4} />
    </SafeArea>
    <Sfx name="whoosh" at={4} volume={0.3} />
    <Caption text="Gemahlener Kaffee verliert schnell Aroma – darum frisch mahlen." delay={4} />
  </AbsoluteFill>
);

// ── 6 · Tasse ───────────────────────────────────────────────────────────
const Tasse: React.FC = () => (
  <AbsoluteFill>
    <Footage src={CLIP.giessen} zoom={[1.0, 1.12]} dim={0.35} vignette />
    <SafeArea justify="flex-start" gap={30} style={{paddingTop: 340}}>
      <Lottie name="emoji/herz" size={170} delay={10} loop />
      <Headline text="Vom Strauch in deine Tasse" size={110} align="center" color={WHITE} highlight={['Tasse']} highlightColor="#F2A65A" delay={4} />
    </SafeArea>
    <Confetti at={18} y={700} count={50} seed="tasse" power={0.8} />
    <Sfx name="successBig" at={18} volume={0.3} />
    <Caption text="Und am Ende: dein Kaffee." delay={4} />
  </AbsoluteFill>
);

// ── 7 · Ende ────────────────────────────────────────────────────────────
const Ende: React.FC = () => (
  <AbsoluteFill>
    <Background seed="kaffee-ende" variant="accent" />
    <SafeArea>
      <Lottie name="emoji/winken" size={220} delay={2} />
      <EndCard title="Mehr Alltag, einfach erklärt." button="Folgen" delay={8} size={1.45} />
    </SafeArea>
  </AbsoluteFill>
);

const ITEMS: SceneItem[] = [
  {name: '1 Hook', duration: 72, content: <Hook />},
  {name: '2 Kirsche', duration: 150, content: <Kirsche />, transition: 'zoom'},
  {name: '3 Weg', duration: 130, content: <Weg />, transition: 'slide-up'},
  {name: '4 Rösten', duration: 150, content: <Roesten />, transition: 'zoom'},
  {name: '5 Mahlen', duration: 110, content: <Mahlen />, transition: 'slide-left'},
  {name: '6 Tasse', duration: 110, content: <Tasse />, transition: 'fade'},
  {name: '7 Ende', duration: 84, content: <Ende />, transition: 'slide-up'},
];

const Video: React.FC = () => (
  <AbsoluteFill>
    <Background seed="kaffee" />
    <Scenes items={ITEMS} />
    {VOICEOVER ? <Audio src={staticFile(VOICEOVER)} /> : null}
    {VOICEOVER ? <CaptionTrack captions={untertitel} /> : null}
  </AbsoluteFill>
);

export const projekt: Project = {
  id: 'Kaffee',
  component: Video,
  format: 'vertical',
  durationInFrames: scenesDuration(ITEMS),
};
