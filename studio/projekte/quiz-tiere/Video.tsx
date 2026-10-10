import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {MessageCircle, Sparkles} from 'lucide';
import {
  Background,
  Caption,
  CaptionTrack,
  clamp01,
  Confetti,
  EndCard,
  Headline,
  Icon,
  Lottie,
  mix,
  Pill,
  pop,
  progress,
  PunchText,
  SafeArea,
  Scenes,
  scenesDuration,
  Sfx,
  Sticker,
  ThemeProvider,
  useTheme,
  type SceneItem,
} from '../../kit';
import type {Project} from '../types';
import untertitel from './untertitel.json';

/** Voiceover in studio/public/projekte/quiz-tiere/ ablegen und hier eintragen. */
const VOICEOVER: string | null = null;

type Frage = {tier: string; satz: string; wahr: boolean; erklaerung: string};

const FRAGEN: Frage[] = [
  {tier: 'fluent-emoji-flat:octopus', satz: 'Ein Oktopus hat drei Herzen.', wahr: true, erklaerung: 'Wahr! Eins pumpt Blut durch den Körper, zwei durch die Kiemen.'},
  {tier: 'fluent-emoji-flat:fish', satz: 'Goldfische vergessen alles nach 3 Sekunden.', wahr: false, erklaerung: 'Falsch! Fische können sich Dinge über Monate merken.'},
  {tier: 'fluent-emoji-flat:flamingo', satz: 'Flamingos sind von Geburt an rosa.', wahr: false, erklaerung: 'Falsch! Küken sind grau – rosa macht sie erst ihr Futter.'},
];

const INK = '#111111';
/** Ablauf einer Frage (Frames). */
const T = {countFrom: 40, reveal: 136, length: 270};
const COUNT = T.reveal - T.countFrom;

// ── Intro ───────────────────────────────────────────────────────────────
const Intro: React.FC = () => {
  const t = useTheme();
  return (
    <AbsoluteFill>
      <SafeArea gap={50}>
        <PunchText
          stack
          size={200}
          words={[
            {text: 'Wahr', at: 0, bg: t.c.good, color: '#FFFFFF'},
            {text: 'oder', at: 12, color: INK},
            {text: 'falsch?', at: 24, bg: t.c.bad, color: '#FFFFFF'},
          ]}
        />
        <Pill icon={Sparkles} tone="solid" size={50} delay={40}>
          Tier-Edition
        </Pill>
        <div style={{display: 'flex', gap: 40}}>
          {FRAGEN.map((f, i) => (
            <Icon key={f.tier} icon={f.tier} size={150} animate="pop" delay={48 + i * 6} loop="bounce" />
          ))}
        </div>
      </SafeArea>
      <Sfx name="punch" at={0} volume={0.35} />
      <Sfx name="punch" at={12} volume={0.3} />
      <Sfx name="punchHeavy" at={24} volume={0.4} />
      <Sfx name="pop" at={48} volume={0.3} />
      <Caption text="Drei Tier-Fakten. Was davon stimmt?" delay={4} />
    </AbsoluteFill>
  );
};

// ── Frage ───────────────────────────────────────────────────────────────
const Button: React.FC<{label: string; color: string; tint: string; x: number; delay: number; result: 'none' | 'right' | 'wrong'; at: number}> = ({
  label,
  color,
  tint,
  x,
  delay,
  result,
  at,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTheme();
  const s = pop(frame, fps, delay, 'bouncy');
  const r = result === 'none' ? 0 : pop(frame, fps, at, 'bouncy');
  const scale = mix(0.6, 1, Math.min(1, Math.max(0, s))) * (result === 'right' ? 1 + 0.1 * r : 1);
  const solid = result === 'right' && frame >= at;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 1160,
        width: 410,
        height: 150,
        borderRadius: 28,
        border: `6px solid ${INK}`,
        boxShadow: `10px 10px 0 ${INK}`,
        background: solid ? color : tint,
        color: solid ? '#FFFFFF' : INK,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: t.font.display,
        fontSize: 74,
        textTransform: 'uppercase',
        transform: `scale(${scale})`,
        opacity: clamp01(s * 2) * (result === 'wrong' && frame >= at ? mix(1, 0.3, clamp01(r)) : 1),
      }}
    >
      {label}
    </div>
  );
};

const QuizFrage: React.FC<{nr: number; frage: Frage}> = ({nr, frage}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTheme();
  const card = pop(frame, fps, 6, 'snappy');
  // Zeitbalken läuft gleichmäßig ab.
  const left = 1 - clamp01((frame - T.countFrom) / COUNT);
  const counting = frame >= T.countFrom && frame < T.reveal;
  const number = Math.max(1, 3 - Math.floor((frame - T.countFrom) / (COUNT / 3)));
  const revealed = frame >= T.reveal;
  const numPop = pop(frame, fps, T.countFrom + (3 - number) * (COUNT / 3), 'bouncy');
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Pill tone="white" size={44} delay={-4}>
          Frage {nr} von {FRAGEN.length}
        </Pill>
      </div>
      {/* Tier */}
      <div style={{position: 'absolute', top: 390, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Icon icon={frage.tier} size={330} animate="pop" delay={0} loop={revealed ? 'bounce' : 'wiggle'} />
      </div>
      {/* Countdown */}
      {counting ? (
        <div
          style={{
            position: 'absolute',
            right: 110,
            top: 420,
            width: 170,
            height: 170,
            borderRadius: '50%',
            background: t.c.accent,
            border: `6px solid ${INK}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: t.font.display,
            fontSize: 110,
            color: INK,
            transform: `scale(${mix(0.7, 1, Math.min(1, numPop))}) rotate(${(1 - Math.min(1, numPop)) * -20}deg)`,
          }}
        >
          {number}
        </div>
      ) : null}
      {/* Aussage */}
      <div
        style={{
          position: 'absolute',
          top: 770,
          left: 90,
          right: 90,
          minHeight: 300,
          padding: '40px 50px 56px',
          background: '#FFFFFF',
          border: `6px solid ${INK}`,
          borderRadius: 32,
          boxShadow: `12px 12px 0 ${INK}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: t.font.heading,
          fontSize: 76,
          lineHeight: 1.12,
          color: INK,
          overflow: 'hidden',
          transform: `scale(${mix(0.85, 1, Math.min(1, Math.max(0, card)))})`,
          opacity: clamp01(card * 2),
        }}
      >
        {frage.satz}
        {/* Zeitbalken */}
        <div style={{position: 'absolute', left: 0, bottom: 0, height: 22, width: `${left * 100}%`, background: frame >= T.countFrom ? t.c.accentDeep : 'transparent'}} />
      </div>
      <Button label="Wahr" color={t.c.good} tint={t.c.goodTint} x={90} delay={14} result={revealed ? (frage.wahr ? 'right' : 'wrong') : 'none'} at={T.reveal} />
      <Button label="Falsch" color={t.c.bad} tint={t.c.badTint} x={580} delay={20} result={revealed ? (frage.wahr ? 'wrong' : 'right') : 'none'} at={T.reveal} />
      {/* Auflösung */}
      {revealed ? (
        <>
          <div style={{position: 'absolute', left: frage.wahr ? 50 : 720, top: 420}}>
            <Sticker text={frage.wahr ? 'WAHR!' : 'FALSCH!'} size={300} delay={T.reveal + 4} rotate={frage.wahr ? -12 : 12} color={frage.wahr ? t.c.good : t.c.bad} textColor="#FFFFFF" />
          </div>
          <Confetti at={T.reveal} y={1230} count={60} seed={`q${nr}`} />
        </>
      ) : null}
      <Sfx name="whoosh" at={0} volume={0.3} />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} name="tap" at={T.countFrom + (i * COUNT) / 3} volume={0.4} />
      ))}
      <Sfx name={frage.wahr ? 'successBig' : 'jingleHit'} at={T.reveal} volume={0.35} />
      <Caption text={['Was meinst du?', 'Und, was sagst du?', 'Letzte Frage!'][nr - 1]} duration={T.reveal} />
      {revealed ? <Caption text={frage.erklaerung} delay={T.reveal + 6} /> : null}
    </AbsoluteFill>
  );
};

// ── Outro ───────────────────────────────────────────────────────────────
const Ergebnis: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTheme();
  return (
    <AbsoluteFill>
      <SafeArea gap={60}>
        <Headline text="Wie viele hattest du richtig?" size={110} align="center" highlight={['richtig?']} marker delay={-4} />
        <div style={{display: 'flex', gap: 26}}>
          {[0, 1, 2, 3].map((n) => {
            const s = pop(frame, fps, 20 + n * 6, 'bouncy');
            return (
              <div
                key={n}
                style={{
                  width: 190,
                  height: 190,
                  borderRadius: 30,
                  border: `6px solid ${INK}`,
                  boxShadow: `8px 8px 0 ${INK}`,
                  background: n === 3 ? t.c.accent : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: t.font.display,
                  fontSize: 80,
                  color: INK,
                  transform: `scale(${Math.max(0, s)})`,
                }}
              >
                {n}/3
              </div>
            );
          })}
        </div>
        <Pill icon={MessageCircle} tone="solid" size={50} delay={50}>
          Schreib's in die Kommentare
        </Pill>
      </SafeArea>
      {[0, 1, 2, 3].map((n) => (
        <Sfx key={n} name="pop" at={20 + n * 6} volume={0.25} />
      ))}
      <Caption text="Wie viele hattest du richtig? Schreib's in die Kommentare!" delay={4} />
    </AbsoluteFill>
  );
};

const Ende: React.FC = () => (
  <AbsoluteFill>
    <Background seed="quiz-ende" variant="accent" />
    <SafeArea>
      <Lottie name="emoji/winken" size={220} delay={2} />
      <EndCard title="Lust auf mehr Quiz?" button="Folgen" delay={8} size={1.45} />
    </SafeArea>
  </AbsoluteFill>
);

const ITEMS: SceneItem[] = [
  {name: 'Intro', duration: 90, content: <Intro />},
  ...FRAGEN.map((f, i): SceneItem => ({name: `Frage ${i + 1}`, duration: T.length, content: <QuizFrage nr={i + 1} frage={f} />, transition: i === 0 ? 'zoom' : 'slide-left'})),
  {name: 'Ergebnis', duration: 140, content: <Ergebnis />, transition: 'slide-up'},
  {name: 'Ende', duration: 80, content: <Ende />, transition: 'slide-up'},
];

const Video: React.FC = () => (
  <ThemeProvider theme="pop">
    <AbsoluteFill>
      <Background seed="quiz-tiere" />
      <Scenes items={ITEMS} />
      {VOICEOVER ? <Audio src={staticFile(VOICEOVER)} /> : null}
      {VOICEOVER ? <CaptionTrack captions={untertitel} /> : null}
    </AbsoluteFill>
  </ThemeProvider>
);

export const projekt: Project = {
  id: 'Quiz-Tiere',
  component: Video,
  format: 'vertical',
  durationInFrames: scenesDuration(ITEMS),
};
