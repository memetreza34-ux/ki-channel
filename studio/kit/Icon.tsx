import React from 'react';
import type {IconNode} from 'lucide';
import type {SimpleIcon} from 'simple-icons';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, mix, pop, progress} from './motion';
import {COLORS, SHADOW} from './theme';

export type {IconNode};
export type {SimpleIcon};

const camel = (key: string) => key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

type IconProps = {
  /** Icon aus `lucide`, z. B. `import {Brain} from 'lucide'`. */
  icon: IconNode;
  size?: number;
  color?: string;
  strokeWidth?: number;
  delay?: number;
  /** Frames für das Zeichnen aller Linien. */
  duration?: number;
  /** `draw` zeichnet die Linien nacheinander, `pop` federt das ganze Icon ein. */
  animate?: 'draw' | 'pop' | 'none';
  style?: React.CSSProperties;
};

export const Icon: React.FC<IconProps> = ({
  icon,
  size = 96,
  color = COLORS.ink,
  strokeWidth = 2,
  delay = 0,
  duration = 22,
  animate = 'draw',
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const children = icon[2] ?? [];
  const p = animate === 'draw' ? progress(frame, delay, duration, 'soft') : 1;
  const s = animate === 'pop' ? pop(frame, fps, delay, 'snappy') : 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        overflow: 'visible',
        transform: animate === 'pop' ? `scale(${s})` : undefined,
        opacity: animate === 'pop' ? clamp01(s * 2) : 1,
        ...style,
      }}
    >
      {children.map(([tag, attrs], i) => {
        // Linien nacheinander: jede startet etwas später und braucht 65 % der Zeit.
        const start = children.length > 1 ? (i / (children.length - 1)) * 0.35 : 0;
        const local = clamp01((p - start) / 0.65);
        const props: Record<string, string | number> = {};
        for (const [k, v] of Object.entries(attrs)) props[camel(k)] = v;
        return React.createElement(tag, {
          key: i,
          ...props,
          pathLength: 1,
          strokeDasharray: 1,
          strokeDashoffset: 1 - local,
          opacity: local > 0.001 ? 1 : 0,
        });
      })}
    </svg>
  );
};

const TONES = {
  accent: [COLORS.accentTint, COLORS.accentDeep],
  good: [COLORS.goodTint, COLORS.good],
  bad: [COLORS.badTint, COLORS.bad],
  warn: [COLORS.warnTint, COLORS.warn],
  info: [COLORS.infoTint, COLORS.info],
  white: [COLORS.surface, COLORS.ink],
  dark: [COLORS.darkSoft, '#FFFFFF'],
  solid: [COLORS.accentDeep, '#FFFFFF'],
} as const;

export type Tone = keyof typeof TONES;

type IconBadgeProps = {
  icon: IconNode;
  size?: number;
  tone?: Tone;
  delay?: number;
  shape?: 'rounded' | 'circle';
  shadow?: boolean;
  style?: React.CSSProperties;
};

/** Icon auf getönter Fläche: Fläche federt ein, danach zeichnet sich das Icon. */
export const IconBadge: React.FC<IconBadgeProps> = ({
  icon,
  size = 168,
  tone = 'accent',
  delay = 0,
  shape = 'rounded',
  shadow = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay, 'snappy');
  const [bg, fg] = TONES[tone];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: shape === 'circle' ? '50%' : size * 0.3,
        background: bg,
        boxShadow: shadow ? SHADOW.soft : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${mix(0.4, 1, s)})`,
        opacity: clamp01(s * 2),
        flexShrink: 0,
        ...style,
      }}
    >
      <Icon icon={icon} size={size * 0.5} color={fg} strokeWidth={2.1} delay={delay + 5} />
    </div>
  );
};

type BrandLogoProps = {
  /** Logo aus `simple-icons`, z. B. `import {siClaude} from 'simple-icons'`. */
  logo: SimpleIcon;
  size?: number;
  /** `brand` = offizielle Markenfarbe. */
  color?: 'brand' | string;
  delay?: number;
  /** Logo auf weißer App-Kachel statt frei. */
  tile?: boolean;
  style?: React.CSSProperties;
};

export const BrandLogo: React.FC<BrandLogoProps> = ({logo, size = 120, color = 'brand', delay = 0, tile = false, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay, 'snappy');
  const fill = color === 'brand' ? `#${logo.hex}` : color;
  const mark = (
    <svg width={tile ? size * 0.56 : size} height={tile ? size * 0.56 : size} viewBox="0 0 24 24" role="img" aria-label={logo.title}>
      <path d={logo.path} fill={fill} />
    </svg>
  );
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: tile ? size * 0.26 : 0,
        background: tile ? COLORS.surface : undefined,
        boxShadow: tile ? SHADOW.soft : undefined,
        transform: `scale(${mix(0.4, 1, s)})`,
        opacity: clamp01(s * 2),
        flexShrink: 0,
        ...style,
      }}
    >
      {mark}
    </div>
  );
};
