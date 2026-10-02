import React from 'react';
import type {IconNode} from 'lucide';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Icon, type Tone} from './Icon';
import {clamp01, mix, pop, progress} from './motion';
import {COLORS, FONT} from './theme';

const normalize = (word: string) => word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

type HeadlineProps = {
  text: string;
  size?: number;
  weight?: number;
  color?: string;
  /** Wörter, die farbig hervorgehoben werden (ohne Satzzeichen, Groß/klein egal). */
  highlight?: string[];
  highlightColor?: string;
  /** Leuchtmarker-Balken unter den hervorgehobenen Wörtern. */
  marker?: boolean;
  delay?: number;
  /** Frames zwischen zwei Wörtern. */
  step?: number;
  align?: 'left' | 'center';
  maxWidth?: number;
  style?: React.CSSProperties;
};

/** Überschrift, deren Wörter nacheinander aus einer Maske nach oben steigen. */
export const Headline: React.FC<HeadlineProps> = ({
  text,
  size = 96,
  weight = 800,
  color = COLORS.ink,
  highlight = [],
  highlightColor = COLORS.accentDeep,
  marker = false,
  delay = 0,
  step = 3,
  align = 'left',
  maxWidth,
  style,
}) => {
  const frame = useCurrentFrame();
  const wanted = new Set(highlight.map(normalize));
  const words = text.split(' ');
  return (
    <div
      style={{
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.08,
        letterSpacing: '-0.035em',
        color,
        textAlign: align,
        maxWidth,
        ...style,
      }}
    >
      {words.map((word, i) => {
        const start = delay + i * step;
        const p = progress(frame, start, 18, 'out');
        const isHot = wanted.has(normalize(word));
        const m = progress(frame, start + 10, 16, 'out');
        return (
          <React.Fragment key={i}>
            <span
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                verticalAlign: 'top',
                paddingBottom: '0.14em',
                marginBottom: '-0.14em',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  transform: `translateY(${(1 - p) * 105}%)`,
                  color: isHot ? highlightColor : undefined,
                }}
              >
                {isHot && marker ? (
                  <span
                    style={{
                      position: 'absolute',
                      left: '-0.06em',
                      right: '-0.06em',
                      bottom: '0.06em',
                      height: '0.34em',
                      borderRadius: '0.08em',
                      background: COLORS.accent,
                      opacity: 0.42,
                      transform: `scaleX(${m})`,
                      transformOrigin: 'left center',
                      zIndex: -1,
                    }}
                  />
                ) : null}
                {word}
              </span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

type BodyTextProps = {
  text: string;
  size?: number;
  color?: string;
  delay?: number;
  align?: 'left' | 'center';
  maxWidth?: number;
  weight?: number;
  style?: React.CSSProperties;
};

/** Ruhiger Fließtext: blendet als Block weich ein. */
export const BodyText: React.FC<BodyTextProps> = ({
  text,
  size = 44,
  color = COLORS.inkSoft,
  delay = 0,
  align = 'left',
  maxWidth,
  weight = 600,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, delay, 16, 'soft');
  return (
    <div
      style={{
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
        color,
        textAlign: align,
        maxWidth,
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

const PILL_TONES: Record<Tone, [string, string]> = {
  accent: [COLORS.accentTint, COLORS.accentDeep],
  good: [COLORS.goodTint, COLORS.good],
  bad: [COLORS.badTint, COLORS.bad],
  warn: [COLORS.warnTint, '#A8650F'],
  info: [COLORS.infoTint, COLORS.info],
  white: [COLORS.surface, COLORS.ink],
  dark: [COLORS.darkSoft, '#FFFFFF'],
  solid: [COLORS.accentDeep, '#FFFFFF'],
};

type PillProps = {
  children: React.ReactNode;
  icon?: IconNode;
  tone?: Tone;
  delay?: number;
  size?: number;
  style?: React.CSSProperties;
};

/** Kleines Label/Kapitel-Schild, federt ein. */
export const Pill: React.FC<PillProps> = ({children, icon, tone = 'accent', delay = 0, size = 34, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay, 'snappy');
  const [bg, fg] = PILL_TONES[tone];
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.4,
        padding: `${size * 0.42}px ${size * 0.8}px`,
        borderRadius: 999,
        background: bg,
        color: fg,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: '-0.01em',
        transform: `translateY(${(1 - s) * 20}px) scale(${mix(0.85, 1, s)})`,
        opacity: clamp01(s * 2),
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon ? <Icon icon={icon} size={size * 1.15} color={fg} strokeWidth={2.4} delay={delay + 4} duration={16} /> : null}
      {children}
    </div>
  );
};

type MarkerProps = {
  children: React.ReactNode;
  delay?: number;
  color?: string;
  duration?: number;
};

/** Leuchtmarker, der von links unter beliebigen Inhalt streicht. */
export const Marker: React.FC<MarkerProps> = ({children, delay = 0, color = COLORS.accent, duration = 16}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, delay, duration, 'out');
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      <span
        style={{
          position: 'absolute',
          left: '-0.08em',
          right: '-0.08em',
          bottom: '0.04em',
          height: '0.4em',
          borderRadius: '0.1em',
          background: color,
          opacity: 0.45,
          transform: `scaleX(${p})`,
          transformOrigin: 'left center',
        }}
      />
      <span style={{position: 'relative'}}>{children}</span>
    </span>
  );
};
