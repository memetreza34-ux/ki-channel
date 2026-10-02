import React from 'react';
import {Sparkles} from 'lucide';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Icon} from './Icon';
import {clamp01, mix, pop} from './motion';
import {COLORS, FONT, SHADOW} from './theme';

type TypingDotsProps = {color?: string; size?: number};

/** Drei hüpfende Punkte ("KI schreibt …"). */
export const TypingDots: React.FC<TypingDotsProps> = ({color = COLORS.inkFaint, size = 18}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', gap: size * 0.6, alignItems: 'center', height: size * 2}}>
      {[0, 1, 2].map((i) => {
        const wave = Math.sin((frame - i * 5) / 4.5);
        return (
          <div
            key={i}
            style={{
              width: size,
              height: size,
              borderRadius: '50%',
              background: color,
              transform: `translateY(${Math.min(0, wave) * size * 0.5}px)`,
              opacity: 0.5 + Math.max(0, -wave) * 0.5,
            }}
          />
        );
      })}
    </div>
  );
};

type StreamTextProps = {
  text: string;
  /** Frame, ab dem Wörter erscheinen. */
  start?: number;
  /** Frames, bis der ganze Text da ist. 0 = sofort komplett. */
  duration?: number;
  caret?: boolean;
  caretColor?: string;
  /** Platz für den ganzen Text von Anfang an reservieren (sonst wächst der Block mit). */
  reserve?: boolean;
};

/** Text erscheint Wort für Wort wie bei einer KI-Antwort. */
export const StreamText: React.FC<StreamTextProps> = ({
  text,
  start = 0,
  duration = 0,
  caret = true,
  caretColor = COLORS.accentDeep,
  reserve = false,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  // Gleichmäßiger Token-Takt: lineare Zeitachse ist hier semantisch korrekt.
  const shown =
    duration <= 0
      ? words.length
      : Math.floor(interpolate(frame, [start, start + duration], [0, words.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const streaming = caret && duration > 0 && shown < words.length && frame >= start;
  const dot = (
    <span
      style={{
        display: 'inline-block',
        width: '0.5em',
        height: '0.5em',
        margin: '0 0.18em',
        borderRadius: '50%',
        background: caretColor,
        verticalAlign: 'middle',
      }}
    />
  );
  return (
    <span>
      {streaming && shown === 0 ? dot : null}
      {words.slice(0, reserve ? words.length : shown).map((w, i) => (
        <React.Fragment key={i}>
          <span style={{opacity: i < shown ? 1 : 0}}>{w}</span>
          {streaming && i === shown - 1 ? dot : null}
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </span>
  );
};

type ChatBubbleProps = {
  role: 'user' | 'ai';
  text: string;
  delay?: number;
  /** Frames mit Tipp-Punkten, bevor Text erscheint (typisch für KI). */
  typing?: number;
  /** Frames, über die der Text Wort für Wort erscheint. */
  stream?: number;
  maxWidth?: number;
  size?: number;
  /** KI-Avatar links neben der Antwort. */
  avatar?: boolean;
};

/** Chat-Nachricht im Messenger-/KI-Chat-Stil. */
export const ChatBubble: React.FC<ChatBubbleProps> = ({
  role,
  text,
  delay = 0,
  typing = 0,
  stream = 0,
  maxWidth = 760,
  size = 44,
  avatar = true,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay, 'snappy');
  const isUser = role === 'user';
  const textStart = delay + typing;
  const isTyping = typing > 0 && frame < textStart;

  const bubble = (
    <div
      style={{
        maxWidth,
        padding: `${size * 0.55}px ${size * 0.7}px`,
        borderRadius: size * 0.85,
        borderBottomRightRadius: isUser ? size * 0.22 : size * 0.85,
        borderBottomLeftRadius: isUser ? size * 0.85 : size * 0.22,
        background: isUser ? COLORS.accentDeep : COLORS.surface,
        color: isUser ? '#FFFFFF' : COLORS.ink,
        border: isUser ? undefined : `2px solid ${COLORS.line}`,
        boxShadow: SHADOW.soft,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 600,
        lineHeight: 1.32,
        letterSpacing: '-0.01em',
      }}
    >
      {isTyping ? <TypingDots size={size * 0.36} /> : <StreamText text={text} start={textStart} duration={stream} />}
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
        gap: size * 0.4,
        width: '100%',
        opacity: clamp01(s * 2),
        transform: `translateY(${(1 - s) * 30}px) scale(${mix(0.85, 1, s)})`,
        transformOrigin: isUser ? 'right bottom' : 'left bottom',
      }}
    >
      {!isUser && avatar ? (
        <div
          style={{
            width: size * 1.6,
            height: size * 1.6,
            borderRadius: '50%',
            background: COLORS.accentTint,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon icon={Sparkles} size={size * 0.9} color={COLORS.accentDeep} animate="pop" delay={delay} />
        </div>
      ) : null}
      {bubble}
    </div>
  );
};
