import React, {useEffect, useState} from 'react';
import type {IconNode} from 'lucide';
import type {SimpleIcon} from 'simple-icons';
import type {IconifyJSON} from '@iconify/types';
import {getIconData, iconToSVG} from '@iconify/utils';
import {cancelRender, continueRender, delayRender, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, mix, pop, progress} from './motion';
import {useTheme, type Theme} from './themes';

export type {IconNode};
export type {SimpleIcon};

/**
 * Ein Icon ist entweder ein lucide-Icon (`import {Brain} from 'lucide'`) oder ein
 * Name "set:name" aus einer Iconify-Sammlung:
 *   ph:robot-duotone · ph:brain-fill   Phosphor, 6 Stile (thin/light/regular/bold/fill/duotone)
 *   tabler:brain                       Tabler, Linien-Icons (lassen sich zeichnen)
 *   logos:openai-icon                  farbige Firmenlogos (auch OpenAI, Microsoft)
 *   fluent-emoji-flat:rocket           bunte Emoji-Illustrationen
 *   lucide:brain-circuit               lucide als Name (statt Import)
 * Suchen: `npm run icons -- <wort>`.
 */
export type IconRef = IconNode | string;

const LOADERS: Record<string, () => Promise<{icons: IconifyJSON}>> = {
  lucide: () => import('lucide').then((m) => ({icons: lucideAsIconify(m.icons as Record<string, IconNode>)})),
  ph: () => import('@iconify-json/ph'),
  tabler: () => import('@iconify-json/tabler'),
  logos: () => import('@iconify-json/logos'),
  'fluent-emoji-flat': () => import('@iconify-json/fluent-emoji-flat'),
};

export const ICON_SETS = Object.keys(LOADERS);

const kebab = (pascal: string) => pascal.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();

/** lucide-Icons als Iconify-Sammlung, damit auch "lucide:brain-circuit" als Name geht. */
const lucideAsIconify = (icons: Record<string, IconNode>): IconifyJSON => {
  const out: IconifyJSON = {prefix: 'lucide', width: 24, height: 24, icons: {}};
  for (const [name, node] of Object.entries(icons)) {
    const children = node[2] ?? [];
    const body = children
      .map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`)
      .join('');
    out.icons[kebab(name)] = {
      body: `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</g>`,
    };
  }
  return out;
};

const loaded = new Map<string, IconifyJSON>();
const loading = new Map<string, Promise<IconifyJSON>>();

const loadSet = (prefix: string) => {
  const existing = loading.get(prefix);
  if (existing) return existing;
  const loader = LOADERS[prefix];
  if (!loader) throw new Error(`Unbekannte Icon-Sammlung "${prefix}". Verfügbar: ${ICON_SETS.join(', ')}`);
  const p = loader().then((m) => {
    loaded.set(prefix, m.icons);
    return m.icons;
  });
  loading.set(prefix, p);
  return p;
};

/** Lädt eine Iconify-Sammlung beim ersten Gebrauch; der Render wartet darauf. */
const useIconSet = (prefix: string | null) => {
  const [set, setSet] = useState<IconifyJSON | null>(() => (prefix ? (loaded.get(prefix) ?? null) : null));
  const [handle] = useState(() => (prefix && !loaded.has(prefix) ? delayRender(`Icons ${prefix}`) : null));
  useEffect(() => {
    if (!prefix || handle === null) return;
    loadSet(prefix)
      .then((s) => {
        setSet(s);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [prefix, handle]);
  return set;
};

const camel = (key: string) => key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

export type IconLoop = 'float' | 'pulse' | 'wiggle' | 'spin' | 'bounce';

/** Dauerbewegung als Endlos-Schleife (gleichmäßiger Takt ist hier gewollt). */
const loopTransform = (loop: IconLoop | undefined, frame: number, delay: number) => {
  if (!loop) return '';
  const t = Math.max(0, frame - delay);
  switch (loop) {
    case 'float':
      return `translateY(${Math.sin(t / 14) * 6}%)`;
    case 'pulse':
      return `scale(${1 + Math.sin(t / 8) * 0.06})`;
    case 'wiggle':
      return `rotate(${Math.sin(t / 5) * 8}deg)`;
    case 'spin':
      return `rotate(${t * 4}deg)`;
    case 'bounce':
      return `translateY(${-Math.abs(Math.sin(t / 9)) * 14}%)`;
  }
};

type IconProps = {
  icon: IconRef;
  size?: number;
  /** Farbe für einfarbige Icons; farbige (Logos, Emojis) behalten ihre Farben. */
  color?: string;
  /** Nur lucide-Icons. */
  strokeWidth?: number;
  delay?: number;
  /** Frames für den Auftritt. */
  duration?: number;
  /**
   * Auftritt: `draw` zeichnet Linien-Icons (lucide, tabler) – andere werden
   * stattdessen aufgedeckt; `pop` federt ein; `reveal` öffnet von der Mitte.
   */
  animate?: 'draw' | 'pop' | 'reveal' | 'none';
  /** Dauerbewegung nach dem Auftritt. */
  loop?: IconLoop;
  style?: React.CSSProperties;
};

export const Icon: React.FC<IconProps> = ({icon, size = 96, color, strokeWidth = 2, delay = 0, duration = 22, animate = 'draw', loop, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTheme();
  const isNamed = typeof icon === 'string';
  const prefix = isNamed ? icon.split(':')[0] : null;
  const set = useIconSet(prefix);
  const col = color ?? t.c.ink;

  const s = animate === 'pop' ? pop(frame, fps, delay, 'snappy') : 1;
  const p = animate === 'draw' || animate === 'reveal' ? progress(frame, delay, duration, 'soft') : 1;
  const wrapper: React.CSSProperties = {
    width: size,
    height: size,
    display: 'inline-flex',
    flexShrink: 0,
    color: col,
    transform: `${animate === 'pop' ? `scale(${Math.max(0, s)})` : ''} ${loopTransform(loop, frame, delay + duration)}`,
    opacity: animate === 'pop' ? clamp01(s * 2) : 1,
    ...style,
  };

  if (!isNamed) {
    const children = icon[2] ?? [];
    return (
      <span style={wrapper}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{overflow: 'visible'}}>
          {children.map(([tag, attrs], i) => {
            // Linien nacheinander: jede startet etwas später und braucht 65 % der Zeit.
            const start = children.length > 1 ? (i / (children.length - 1)) * 0.35 : 0;
            const local = animate === 'draw' || animate === 'reveal' ? clamp01((p - start) / 0.65) : 1;
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
      </span>
    );
  }

  const name = icon.slice(prefix!.length + 1);
  const data = set ? getIconData(set, name) : null;
  if (set && !data) throw new Error(`Icon "${icon}" gibt es nicht. Suchen mit: npm run icons -- ${name.split('-')[0]}`);
  if (!data) return <span style={wrapper} />;
  const svg = iconToSVG(data, {height: 'auto'});
  const isStroke = svg.body.includes('stroke="currentColor"') && !svg.body.includes('fill="currentColor"');
  const draw = animate === 'draw' && isStroke;
  const body = draw ? svg.body.replace(/<(path|circle|line|polyline|polygon|rect|ellipse)\b/g, '<$1 pathLength="1"') : svg.body;
  const revealClip = (animate === 'reveal' || (animate === 'draw' && !isStroke)) && p < 1 ? `circle(${p * 75}% at 50% 50%)` : undefined;
  return (
    <span style={wrapper}>
      <svg
        width={size}
        height={size}
        viewBox={svg.attributes.viewBox}
        style={{
          overflow: 'visible',
          clipPath: revealClip,
          strokeDasharray: draw ? 1 : undefined,
          strokeDashoffset: draw ? 1 - p : undefined,
          opacity: draw && p < 0.001 ? 0 : 1,
        }}
        dangerouslySetInnerHTML={{__html: body}}
      />
    </span>
  );
};

/** true, wenn das Icon eigene Farben hat (Logo, Emoji) und nicht eingefärbt wird. */
export const isColorIcon = (icon: IconRef) => typeof icon === 'string' && (icon.startsWith('logos:') || icon.startsWith('fluent-emoji'));

export type Tone = 'accent' | 'good' | 'bad' | 'warn' | 'info' | 'white' | 'dark' | 'solid';

export const toneColors = (t: Theme, tone: Tone): [bg: string, fg: string] => {
  switch (tone) {
    case 'accent':
      return [t.c.accentTint, t.c.accentDeep];
    case 'good':
      return [t.c.goodTint, t.c.good];
    case 'bad':
      return [t.c.badTint, t.c.bad];
    case 'warn':
      return [t.c.warnTint, t.c.warn];
    case 'info':
      return [t.c.infoTint, t.c.info];
    case 'white':
      return [t.c.surface, t.c.ink];
    case 'dark':
      return [t.c.darkSoft, '#FFFFFF'];
    case 'solid':
      return [t.c.accentDeep, t.c.onAccent];
  }
};

type IconBadgeProps = {
  icon: IconRef;
  size?: number;
  tone?: Tone;
  delay?: number;
  shape?: 'rounded' | 'circle';
  shadow?: boolean;
  loop?: IconLoop;
  style?: React.CSSProperties;
};

/** Icon auf getönter Fläche: Fläche federt ein, danach zeichnet sich das Icon. */
export const IconBadge: React.FC<IconBadgeProps> = ({icon, size = 168, tone = 'accent', delay = 0, shape = 'rounded', shadow = true, loop, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTheme();
  const s = pop(frame, fps, delay, 'snappy');
  const [toneBg, fg] = toneColors(t, tone);
  const colored = isColorIcon(icon);
  // Firmenlogos sind oft schwarz: im dunklen Design auf heller Kachel zeigen.
  const bg = colored && t.isDark && typeof icon === 'string' && icon.startsWith('logos:') ? '#FFFFFF' : toneBg;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: shape === 'circle' ? '50%' : size * 0.3 * t.radius,
        background: bg,
        border: t.border ?? undefined,
        boxShadow: shadow ? t.shadow.soft : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${mix(0.4, 1, s)})`,
        opacity: clamp01(s * 2),
        flexShrink: 0,
        ...style,
      }}
    >
      <Icon icon={icon} size={size * (colored ? 0.62 : 0.5)} color={fg} strokeWidth={2.1} delay={delay + 5} animate={colored ? 'pop' : 'draw'} loop={loop} />
    </div>
  );
};

type BrandLogoProps = {
  /** `simple-icons`-Logo (z. B. siClaude) oder Iconify-Name (z. B. 'logos:openai-icon'). */
  logo: SimpleIcon | string;
  size?: number;
  /** `brand` = offizielle Markenfarbe (nur simple-icons). */
  color?: 'brand' | string;
  delay?: number;
  /** Logo auf heller App-Kachel statt frei. */
  tile?: boolean;
  style?: React.CSSProperties;
};

export const BrandLogo: React.FC<BrandLogoProps> = ({logo, size = 120, color = 'brand', delay = 0, tile = false, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTheme();
  const s = pop(frame, fps, delay, 'snappy');
  const inner = tile ? size * 0.56 : size;
  const mark =
    typeof logo === 'string' ? (
      <Icon icon={logo} size={inner} animate="none" />
    ) : (
      <svg width={inner} height={inner} viewBox="0 0 24 24" role="img" aria-label={logo.title}>
        <path d={logo.path} fill={color === 'brand' ? `#${logo.hex}` : color} />
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
        borderRadius: tile ? size * 0.26 * t.radius : 0,
        background: tile ? '#FFFFFF' : undefined,
        border: tile && t.border ? t.border : undefined,
        boxShadow: tile ? t.shadow.soft : undefined,
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
