import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowUp, BrainCircuit, ChartBar, MessageSquare, MessageSquareText, Scissors, Sparkles} from 'lucide';
import {
  Arrow,
  Background,
  BarList,
  BodyText,
  CameraRig,
  Caption,
  ChatBubble,
  COLORS,
  FONT,
  Headline,
  Icon,
  IconBadge,
  mix,
  PhoneMockup,
  Pill,
  pop,
  progress,
  SHADOW,
  Sfx,
  TokenChips,
} from '../../kit';
import type {Project} from '../types';

const QUESTION = 'Warum ist der Himmel blau?';
const ANSWER = 'Das Sonnenlicht wird in der Luft gestreut – blaues Licht am stärksten. Darum wirkt der Himmel blau.';

const SCENES = {
  hook: {from: 0, duration: 96},
  frage: {from: 96, duration: 124},
  tokens: {from: 220, duration: 120},
  wahrscheinlichkeit: {from: 340, duration: 140},
  antwort: {from: 480, duration: 140},
  outro: {from: 620, duration: 84},
};

const center: React.CSSProperties = {position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'center'};

// ── 1 · Hook ────────────────────────────────────────────────────────────
const Hook: React.FC = () => {
  const row = [
    {icon: MessageSquare, label: 'Frage', x: 180, tone: 'white' as const, at: 30},
    {icon: BrainCircuit, label: 'KI', x: 540, tone: 'solid' as const, at: 44},
    {icon: MessageSquareText, label: 'Antwort', x: 900, tone: 'accent' as const, at: 58},
  ];
  const y = 1250;
  const badge = 220;
  return (
    <AbsoluteFill>
      <div style={{...center, top: 360}}>
        <Pill icon={Sparkles} delay={-8}>KI einfach erklärt</Pill>
      </div>
      <div style={{...center, top: 500, padding: '0 70px'}}>
        <Headline text="Was passiert, wenn du eine KI fragst?" size={118} align="center" highlight={['KI']} marker delay={-12} />
      </div>
      {row.map((r) => (
        <React.Fragment key={r.label}>
          <div style={{position: 'absolute', left: r.x - badge / 2, top: y - badge / 2}}>
            <IconBadge icon={r.icon} size={badge} tone={r.tone} delay={r.at} />
          </div>
          <div style={{position: 'absolute', left: r.x - 150, width: 300, top: y + badge / 2 + 30, textAlign: 'center'}}>
            <BodyText text={r.label} size={48} weight={800} color={COLORS.ink} align="center" delay={r.at + 6} />
          </div>
        </React.Fragment>
      ))}
      <Arrow from={[180, y]} to={[540, y]} inset={132} bend={-0.34} delay={38} duration={18} width={10} />
      <Arrow from={[540, y]} to={[900, y]} inset={132} bend={-0.34} delay={52} duration={18} width={10} />
      <Sfx name="whoosh" at={0} volume={0.35} />
      <Sfx name="pop" at={30} volume={0.4} />
      <Sfx name="pop" at={44} volume={0.4} />
      <Sfx name="pop" at={58} volume={0.4} />
    </AbsoluteFill>
  );
};

// ── Telefon mit Chat (Szene 2 und 5 teilen sich das Gerät) ───────────────
const PHONE = {width: 600, left: 240, top: 300};
/** Kameraposition, in der der Chat bildfüllend ist (Ende Szene 2 = Anfang Szene 5). */
const CHAT_ZOOM = {zoom: 1.45, y: 330};

const InputBar: React.FC<{text: string; sendPulse: number}> = ({text, sendPulse}) => (
  <div
    style={{
      position: 'absolute',
      left: 18,
      right: 18,
      bottom: 22,
      height: 92,
      borderRadius: 46,
      background: COLORS.surface,
      border: `2px solid ${COLORS.line}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px 0 30px',
      fontFamily: FONT.sans,
      fontSize: 30,
      fontWeight: 600,
      color: text ? COLORS.ink : COLORS.inkFaint,
    }}
  >
    <div style={{flex: 1, whiteSpace: 'nowrap', overflow: 'hidden'}}>{text || 'Nachricht …'}</div>
    <div
      style={{
        width: 68,
        height: 68,
        borderRadius: '50%',
        background: COLORS.accentDeep,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${1 - sendPulse * 0.18})`,
        boxShadow: sendPulse > 0 ? `0 0 0 ${sendPulse * 14}px ${COLORS.accent}44` : undefined,
      }}
    >
      <Icon icon={ArrowUp} size={38} color="#FFFFFF" strokeWidth={2.8} animate="none" />
    </div>
  </div>
);

const ChatPhone: React.FC<{children: React.ReactNode; delay?: number; input?: string; sendPulse?: number}> = ({
  children,
  delay = 0,
  input = '',
  sendPulse = 0,
}) => (
  <div style={{position: 'absolute', left: PHONE.left, top: PHONE.top}}>
    <PhoneMockup width={PHONE.width} delay={delay} title="KI-Chat">
      <div style={{display: 'flex', flexDirection: 'column', gap: 26, padding: '30px 22px'}}>{children}</div>
      <InputBar text={input} sendPulse={sendPulse} />
    </PhoneMockup>
  </div>
);

// ── 2 · Frage ───────────────────────────────────────────────────────────
const Frage: React.FC = () => {
  const frame = useCurrentFrame();
  // Tippen in konstantem Takt.
  const typed = Math.floor(interpolate(frame, [8, 32], [0, QUESTION.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const sent = frame >= 38;
  const pulse = Math.max(0, 1 - Math.abs(frame - 36) / 4);
  return (
    <AbsoluteFill>
      <CameraRig keys={[{at: 90, zoom: 1, y: 0}, {at: 124, ...CHAT_ZOOM}]}>
        <div style={{...center, top: 205}}>
          <Pill icon={MessageSquare} tone="white">Deine Frage</Pill>
        </div>
        <ChatPhone delay={0} input={sent ? '' : QUESTION.slice(0, typed)} sendPulse={pulse}>
          {sent ? <ChatBubble role="user" text={QUESTION} delay={38} size={36} maxWidth={440} /> : null}
          {frame >= 58 ? <ChatBubble role="ai" text={ANSWER} delay={58} typing={999} size={36} maxWidth={430} /> : null}
        </ChatPhone>
      </CameraRig>
      <Caption text="Du tippst eine Frage ein." delay={4} />
      <Sfx name="typing" at={8} volume={0.25} />
      <Sfx name="click" at={36} volume={0.6} />
      <Sfx name="whoosh" at={38} volume={0.35} />
      <Sfx name="think" at={60} volume={0.3} />
    </AbsoluteFill>
  );
};

// ── 3 · Tokens ──────────────────────────────────────────────────────────
const Tokens: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = pop(frame, fps, 10, 'smooth');
  const split = progress(frame, 34, 12, 'in');
  return (
    <AbsoluteFill>
      <div style={{...center, top: 230}}>
        <Pill icon={Scissors}>Schritt 1</Pill>
      </div>
      <div style={{...center, top: 340, padding: '0 90px'}}>
        <Headline text="Text wird in Tokens zerlegt" size={96} align="center" highlight={['Tokens']} delay={4} />
      </div>
      <div style={{...center, top: 700}}>
        <div
          style={{
            padding: '30px 46px',
            borderRadius: 32,
            background: COLORS.surface,
            boxShadow: SHADOW.soft,
            fontFamily: FONT.sans,
            fontSize: 60,
            fontWeight: 700,
            color: COLORS.ink,
            letterSpacing: '-0.02em',
            opacity: card * (1 - split * 0.55),
            transform: `translateY(${(1 - card) * 40}px) scale(${mix(0.92, 1, card) - split * 0.04})`,
          }}
        >
          {QUESTION}
        </div>
      </div>
      <Arrow from={[540, 840]} to={[540, 1000]} bend={0} delay={30} duration={14} width={10} />
      <div style={{...center, top: 1030}}>
        <TokenChips tokens={['Warum', 'ist', 'der', 'Himmel', 'blau', '?']} delay={44} step={6} size={70} maxWidth={960} />
      </div>
      <div style={{...center, top: 1380}}>
        <Pill tone="white" size={28} delay={88}>vereinfachte Darstellung</Pill>
      </div>
      <Caption text="Zuerst zerlegt die KI deinen Text in Tokens." delay={2} />
      <Sfx name="glitch" at={34} volume={0.3} />
      <Sfx name="pop" at={44} volume={0.3} />
      <Sfx name="pop" at={74} volume={0.3} />
    </AbsoluteFill>
  );
};

// ── 4 · Wahrscheinlichkeit ──────────────────────────────────────────────
const Wahrscheinlichkeit: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const line = pop(frame, fps, 14, 'smooth');
  const fill = pop(frame, fps, 98, 'snappy');
  return (
    <AbsoluteFill>
      <div style={{...center, top: 230}}>
        <Pill icon={ChartBar}>Schritt 2</Pill>
      </div>
      <div style={{...center, top: 340, padding: '0 90px'}}>
        <Headline text="Sie schätzt das nächste Wort" size={96} align="center" highlight={['nächste']} delay={4} />
      </div>
      <div
        style={{
          ...center,
          top: 690,
          alignItems: 'center',
          gap: 22,
          fontFamily: FONT.sans,
          fontSize: 58,
          fontWeight: 800,
          color: COLORS.ink,
          opacity: line,
          transform: `translateY(${(1 - line) * 30}px)`,
        }}
      >
        <span style={{color: COLORS.inkSoft}}>Antwort:</span>
        <span
          style={{
            minWidth: 190,
            height: 96,
            borderRadius: 24,
            border: `4px dashed ${fill > 0.05 ? 'transparent' : COLORS.accent}`,
            background: fill > 0.05 ? COLORS.accentDeep : 'transparent',
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 30px',
            transform: `scale(${fill > 0.05 ? mix(0.6, 1, fill) : 1})`,
          }}
        >
          {fill > 0.05 ? 'Das' : ''}
        </span>
        <span style={{color: COLORS.inkFaint}}>…</span>
      </div>
      <div style={{...center, top: 900}}>
        <BarList
          items={[
            {label: 'Das', value: 58},
            {label: 'Weil', value: 27},
            {label: 'Blau', value: 9},
          ]}
          delay={32}
          step={7}
          width={880}
          labelWidth={170}
          rowHeight={96}
          highlight={{index: 0, at: 78}}
        />
      </div>
      <div style={{...center, top: 1290}}>
        <Pill tone="white" size={28} delay={60}>Beispielwerte</Pill>
      </div>
      <Caption text="Dann schätzt sie, welches Wort am wahrscheinlichsten folgt." delay={2} />
      <Sfx name="reveal" at={78} volume={0.35} />
      <Sfx name="pop" at={98} volume={0.45} />
    </AbsoluteFill>
  );
};

// ── 5 · Antwort ─────────────────────────────────────────────────────────
const Antwort: React.FC = () => (
  <AbsoluteFill>
    <CameraRig keys={[{at: 0, ...CHAT_ZOOM}, {at: 140, zoom: CHAT_ZOOM.zoom + 0.05, y: CHAT_ZOOM.y + 20}]}>
      <ChatPhone delay={-60}>
        <ChatBubble role="user" text={QUESTION} delay={-60} size={36} maxWidth={440} />
        <ChatBubble role="ai" text={ANSWER} delay={-60} typing={66} stream={96} size={36} maxWidth={430} />
      </ChatPhone>
    </CameraRig>
    <div style={{...center, top: 205}}>
      <Pill icon={MessageSquareText}>Schritt 3</Pill>
    </div>
    <Caption text="Wort für Wort – bis die Antwort steht." delay={2} />
    <Sfx name="notify" at={0} volume={0.4} />
  </AbsoluteFill>
);

// ── 6 · Outro ───────────────────────────────────────────────────────────
const Outro: React.FC = () => (
  <AbsoluteFill>
    <Background variant="accent" seed="outro" />
    <div style={{...center, top: 500, padding: '0 90px'}}>
      <Headline text="Eine KI schreibt Wort für Wort." size={118} align="center" highlight={['Wort']} marker delay={2} step={4} />
    </div>
    <div style={{...center, top: 930, gap: 56}}>
      {[
        {icon: Scissors, label: 'Tokens'},
        {icon: ChartBar, label: 'Schätzen'},
        {icon: MessageSquareText, label: 'Schreiben'},
      ].map((r, i) => (
        <div key={r.label} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
          <IconBadge icon={r.icon} size={170} tone={i === 2 ? 'solid' : 'white'} delay={22 + i * 6} />
          <BodyText text={r.label} size={40} weight={800} color={COLORS.ink} delay={28 + i * 6} />
        </div>
      ))}
    </div>
    <div style={{...center, top: 1330}}>
      <BodyText text="Mehr KI, einfach erklärt." size={50} weight={700} align="center" delay={46} />
    </div>
    <Sfx name="success" at={20} volume={0.4} />
  </AbsoluteFill>
);

const Video: React.FC = () => (
  <AbsoluteFill style={{background: COLORS.bg}}>
    <Background seed="so-antwortet-ki" />
    <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.duration} name="1 Hook">
      <Hook />
    </Sequence>
    <Sequence from={SCENES.frage.from} durationInFrames={SCENES.frage.duration} name="2 Frage">
      <Frage />
    </Sequence>
    <Sequence from={SCENES.tokens.from} durationInFrames={SCENES.tokens.duration} name="3 Tokens">
      <Tokens />
    </Sequence>
    <Sequence from={SCENES.wahrscheinlichkeit.from} durationInFrames={SCENES.wahrscheinlichkeit.duration} name="4 Wahrscheinlichkeit">
      <Wahrscheinlichkeit />
    </Sequence>
    <Sequence from={SCENES.antwort.from} durationInFrames={SCENES.antwort.duration} name="5 Antwort">
      <Antwort />
    </Sequence>
    <Sequence from={SCENES.outro.from} durationInFrames={SCENES.outro.duration} name="6 Outro">
      <Outro />
    </Sequence>
  </AbsoluteFill>
);

export const projekt: Project = {
  id: 'So-Antwortet-KI',
  component: Video,
  format: 'vertical',
  durationInFrames: SCENES.outro.from + SCENES.outro.duration,
};
