import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, mix, pop, progress} from './motion';
import {useTheme} from './themes';

type CounterProps = {
  to: number;
  from?: number;
  delay?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
};

/** Zahl zählt weich hoch (deutsches Zahlenformat, feste Ziffernbreite). */
export const Counter: React.FC<CounterProps> = ({
  to,
  from = 0,
  delay = 0,
  duration = 40,
  decimals = 0,
  prefix = '',
  suffix = '',
  size = 160,
  color: colorProp,
  weight = 900,
  style,
}) => {
  const t = useTheme();
  const color = colorProp ?? t.c.ink;
  const frame = useCurrentFrame();
  const value = mix(from, to, progress(frame, delay, duration, 'out'));
  const text = value.toLocaleString('de-DE', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
  const appear = progress(frame, delay - 6, 10, 'soft');
  return (
    <span
      style={{
        display: 'inline-block',
        opacity: appear,
        transform: `translateY(${(1 - appear) * 20}px)`,
        fontFamily: t.font.body,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: '-0.04em',
        fontVariantNumeric: 'tabular-nums',
        color,
        ...style,
      }}
    >
      {prefix}
      {text}
      {suffix}
    </span>
  );
};

type BarItem = {label: string; value: number};

type BarListProps = {
  items: BarItem[];
  /** Wert, der einer vollen Balkenlänge entspricht. */
  max?: number;
  delay?: number;
  step?: number;
  width?: number;
  /** Index des Gewinners und ab wann er hervorgehoben wird. */
  highlight?: {index: number; at: number};
  showValues?: boolean;
  format?: (v: number) => string;
  labelWidth?: number;
  rowHeight?: number;
};

/** Horizontale Balken (Rangliste, Wahrscheinlichkeiten, Vergleich). */
export const BarList: React.FC<BarListProps> = ({
  items,
  max,
  delay = 0,
  step = 5,
  width = 860,
  highlight,
  showValues = false,
  format = (v) => `${Math.round(v)} %`,
  labelWidth = 220,
  rowHeight = 92,
}) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const top = max ?? Math.max(...items.map((i) => i.value));
  const trackWidth = width - labelWidth - (showValues ? 150 : 0) - 24;
  const h = highlight ? pop(frame, fps, highlight.at, 'snappy') : 0;

  return (
    <div style={{width, display: 'flex', flexDirection: 'column', gap: rowHeight * 0.28}}>
      {items.map((item, i) => {
        const grow = progress(frame, delay + i * step, 28, 'out');
        const appear = progress(frame, delay + i * step, 10, 'soft');
        const isWinner = highlight?.index === i;
        const dim = highlight && !isWinner ? mix(1, 0.38, clamp01(h)) : 1;
        const fill = isWinner ? t.c.accentDeep : t.c.accent;
        return (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              height: rowHeight,
              opacity: appear * dim,
              transform: `translateX(${(1 - appear) * -30}px) scale(${isWinner ? mix(1, 1.04, clamp01(h)) : 1})`,
              transformOrigin: 'left center',
            }}
          >
            <div
              style={{
                width: labelWidth,
                fontFamily: t.font.body,
                fontSize: rowHeight * 0.46,
                fontWeight: 800,
                color: t.c.ink,
                letterSpacing: '-0.02em',
                textAlign: 'right',
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                width: trackWidth,
                height: rowHeight * 0.62,
                borderRadius: 999,
                background: t.c.line,
                overflow: 'hidden',
                boxShadow: isWinner && h > 0 ? `0 0 0 ${6 * clamp01(h)}px ${t.c.accent}55` : undefined,
              }}
            >
              <div
                style={{
                  width: (item.value / top) * trackWidth * grow,
                  height: '100%',
                  borderRadius: 999,
                  background: fill,
                }}
              />
            </div>
            {showValues ? (
              <div
                style={{
                  width: 150,
                  fontFamily: t.font.body,
                  fontSize: rowHeight * 0.42,
                  fontWeight: 800,
                  color: isWinner ? t.c.accentDeep : t.c.inkSoft,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {format(item.value * grow)}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

type TokenChipsProps = {
  tokens: string[];
  delay?: number;
  step?: number;
  size?: number;
  maxWidth?: number;
};

/** Text, zerlegt in farbige Token-Bausteine, die nacheinander einrasten. */
export const TokenChips: React.FC<TokenChipsProps> = ({tokens, delay = 0, step = 5, size = 64, maxWidth = 900}) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: size * 0.28, maxWidth, justifyContent: 'center'}}>
      {tokens.map((token, i) => {
        const s = pop(frame, fps, delay + i * step, 'snappy');
        const c = i % t.pastels.length;
        return (
          <div
            key={i}
            style={{
              padding: `${size * 0.22}px ${size * 0.36}px`,
              borderRadius: 24 * t.radius,
              background: t.pastels[c],
              border: `3px solid ${t.pastelInk[c]}33`,
              boxShadow: t.shadow.soft,
              fontFamily: t.font.mono,
              fontSize: size,
              fontWeight: 700,
              color: t.pastelInk[c],
              letterSpacing: '-0.02em',
              transform: `translateY(${(1 - s) * 40}px) scale(${mix(0.6, 1, s)})`,
              opacity: clamp01(s * 2),
              whiteSpace: 'pre',
            }}
          >
            {token}
          </div>
        );
      })}
    </div>
  );
};
