import React from 'react';
import {fitText} from '@remotion/layout-utils';
import {makeStar} from '@remotion/shapes';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {useLayout} from './layout';
import {clamp01, mix, pop, progress} from './motion';
import {COLORS, FONT, SHADOW} from './theme';

export type PunchWord = {
  text: string;
  /** Frame, ab dem das Wort steht (bis zum nächsten Wort). */
  at: number;
  color?: string;
  /** Farbiger Balken hinter dem Wort. */
  bg?: string;
};

type PunchTextProps = {
  words: PunchWord[];
  size?: number;
  /** Alle bisherigen Wörter untereinander stehen lassen statt ersetzen. */
  stack?: boolean;
  font?: 'display' | 'sans';
  align?: 'left' | 'center';
  /** Maximale Breite; längere Wörter werden automatisch kleiner. Standard: sichere Zone. */
  maxWidth?: number;
  style?: React.CSSProperties;
};

/**
 * Werbe-Knaller: ein Wort pro Schlag, kommt groß rein und rastet ein.
 * Mit `stack` bauen sich die Wörter zu einer Zeile pro Wort auf.
 */
export const PunchText: React.FC<PunchTextProps> = ({words, size = 220, stack = false, font = 'display', align = 'center', maxWidth, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {width, safe} = useLayout();
  const limit = maxWidth ?? width - safe.side * 2;
  const visible = words.filter((w) => frame >= w.at);
  const shown = stack ? visible : visible.slice(-1);
  const isDisplay = font === 'display';
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: size * 0.06, ...style}}>
      {shown.map((w, i) => {
        const s = pop(frame, fps, w.at, 'snappy');
        const latest = i === shown.length - 1;
        const padX = w.bg ? size * 0.16 : 0;
        const fitted = fitText({
          text: w.text,
          withinWidth: limit - padX * 2,
          fontFamily: isDisplay ? FONT.display : FONT.sans,
          fontWeight: isDisplay ? 400 : 900,
          letterSpacing: isDisplay ? '0.01em' : '-0.045em',
          textTransform: isDisplay ? 'uppercase' : undefined,
          validateFontIsLoaded: false,
        }).fontSize;
        const fontSize = Math.min(size, fitted);
        return (
          <div
            key={`${w.text}-${w.at}`}
            style={{
              fontFamily: isDisplay ? FONT.display : FONT.sans,
              fontSize,
              fontWeight: isDisplay ? 400 : 900,
              lineHeight: isDisplay ? 0.92 : 1.02,
              letterSpacing: isDisplay ? '0.01em' : '-0.045em',
              textTransform: isDisplay ? 'uppercase' : undefined,
              color: w.bg ? '#FFFFFF' : (w.color ?? COLORS.ink),
              background: w.bg,
              padding: w.bg ? `${fontSize * 0.04}px ${padX}px ${fontSize * 0.01}px` : undefined,
              borderRadius: w.bg ? fontSize * 0.08 : undefined,
              transform: `scale(${mix(1.55, 1, s)}) rotate(${mix(-5, 0, clamp01(s))}deg)`,
              opacity: (clamp01(s * 3)) * (stack && !latest ? 0.35 : 1),
              filter: `blur(${(1 - clamp01(s)) * 6}px)`,
              whiteSpace: 'nowrap',
            }}
          >
            {w.text}
          </div>
        );
      })}
    </div>
  );
};

type StickerProps = {
  text: string;
  /** Kleine Zeile unter dem Haupttext. */
  sub?: string;
  size?: number;
  color?: string;
  textColor?: string;
  delay?: number;
  rotate?: number;
  shape?: 'burst' | 'circle';
  style?: React.CSSProperties;
};

/** Störer/Sticker ("NEU", "GRATIS", "−50 %"): federt rein und wackelt leicht. */
export const Sticker: React.FC<StickerProps> = ({
  text,
  sub,
  size = 260,
  color = COLORS.accentDeep,
  textColor = '#FFFFFF',
  delay = 0,
  rotate = -10,
  shape = 'burst',
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay, 'bouncy');
  // Leichtes Dauerwackeln als Endlos-Schleife.
  const wobble = Math.sin((frame - delay) / 9) * 2.2 * clamp01(s);
  const star = makeStar({points: 16, innerRadius: size * 0.43, outerRadius: size * 0.5, cornerRadius: size * 0.02});
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        transform: `scale(${Math.max(0, s)}) rotate(${rotate + wobble}deg)`,
        opacity: clamp01(s * 3),
        filter: 'drop-shadow(0 14px 24px rgba(40,24,80,0.25))',
        ...style,
      }}
    >
      {shape === 'burst' ? (
        <svg width={size} height={size} viewBox={`0 0 ${star.width} ${star.height}`} style={{position: 'absolute', inset: 0}}>
          <path d={star.path} fill={color} />
        </svg>
      ) : (
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: color}} />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: textColor,
          textAlign: 'center',
        }}
      >
        <div style={{fontFamily: FONT.display, fontSize: size * (text.length > 6 ? 0.2 : 0.27), lineHeight: 0.9, textTransform: 'uppercase'}}>{text}</div>
        {sub ? <div style={{fontFamily: FONT.sans, fontWeight: 800, fontSize: size * 0.075, marginTop: size * 0.03}}>{sub}</div> : null}
      </div>
    </div>
  );
};

type EndCardProps = {
  /** Großer Satz, z. B. "Mehr KI, einfach erklärt." */
  title: string;
  /** Kanalname (optional, erst wenn festgelegt). */
  name?: string;
  /** Social-Handle, z. B. "@kanal". */
  handle?: string;
  /** Text auf dem Knopf. */
  button?: string;
  /** Eigenes Logo-Element (z. B. <Img>), falls vorhanden. */
  logo?: React.ReactNode;
  delay?: number;
  size?: number;
};

/** Abspann / Werbe-Endkarte mit pulsierendem Handlungsknopf. */
export const EndCard: React.FC<EndCardProps> = ({title, name, handle, button = 'Folgen', logo, delay = 0, size = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logoIn = pop(frame, fps, delay, 'snappy');
  const nameIn = progress(frame, delay + (logo ? 5 : 0), 14, 'out');
  const titleAt = delay + (logo ? 5 : 0) + (name ? 7 : 0);
  const titleIn = progress(frame, titleAt, 16, 'out');
  const btnAt = titleAt + 12;
  const btn = pop(frame, fps, btnAt, 'bouncy');
  // Pulsring um den Knopf: Endlos-Schleife.
  const ring = (((frame - btnAt - 10) % 36) + 36) % 36 / 36;
  const showRing = frame > btnAt + 10;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 * size, textAlign: 'center'}}>
      {logo ? <div style={{transform: `scale(${Math.max(0, logoIn)})`, opacity: clamp01(logoIn * 2)}}>{logo}</div> : null}
      {name ? (
        <div style={{opacity: nameIn, transform: `translateY(${(1 - nameIn) * 20}px)`}}>
          <div style={{fontFamily: FONT.sans, fontWeight: 900, fontSize: 64 * size, letterSpacing: '-0.03em', color: COLORS.ink}}>{name}</div>
          {handle ? <div style={{fontFamily: FONT.sans, fontWeight: 700, fontSize: 38 * size, color: COLORS.inkSoft, marginTop: 6 * size}}>{handle}</div> : null}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: FONT.sans,
          fontWeight: 800,
          fontSize: 76 * size,
          lineHeight: 1.08,
          letterSpacing: '-0.035em',
          color: COLORS.ink,
          maxWidth: 900 * size,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 24}px)`,
        }}
      >
        {title}
      </div>
      <div style={{position: 'relative', transform: `scale(${Math.max(0, btn)})`}}>
        {showRing ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 999,
              border: `${6 * size}px solid ${COLORS.accent}`,
              transform: `scale(${1 + ring * 0.35})`,
              opacity: 1 - ring,
            }}
          />
        ) : null}
        <div
          style={{
            padding: `${26 * size}px ${72 * size}px`,
            borderRadius: 999,
            background: COLORS.accentDeep,
            color: '#FFFFFF',
            fontFamily: FONT.sans,
            fontWeight: 900,
            fontSize: 48 * size,
            letterSpacing: '-0.02em',
            boxShadow: SHADOW.lift,
          }}
        >
          {button}
        </div>
      </div>
    </div>
  );
};
