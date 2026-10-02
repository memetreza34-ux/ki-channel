import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, mix, pop} from './motion';
import {COLORS, FONT, SHADOW} from './theme';

const useEnter = (delay: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay, 'smooth');
  return {
    opacity: clamp01(s * 1.6),
    transform: `translateY(${(1 - s) * 140}px) scale(${mix(0.94, 1, s)})`,
  };
};

type PhoneMockupProps = {
  children?: React.ReactNode;
  /** Breite des Geräts in px; Höhe ergibt sich (≈ iPhone-Proportion). */
  width?: number;
  delay?: number;
  screen?: string;
  /** Kopfzeile des Chats/der App im Display. */
  title?: string;
  style?: React.CSSProperties;
};

/** Smartphone im neutralen Look (kein echtes Markengerät). */
export const PhoneMockup: React.FC<PhoneMockupProps> = ({children, width = 640, delay = 0, screen = COLORS.bg, title, style}) => {
  const enter = useEnter(delay);
  const height = width * 2.05;
  const bezel = width * 0.035;
  const radius = width * 0.15;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: COLORS.dark,
        padding: bezel,
        boxShadow: `${SHADOW.lift}, inset 0 0 0 3px ${COLORS.darkLine}`,
        ...enter,
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: radius - bezel,
          background: screen,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: width * 0.03,
            left: '50%',
            width: width * 0.3,
            height: width * 0.085,
            transform: 'translateX(-50%)',
            borderRadius: 999,
            background: COLORS.dark,
            zIndex: 2,
          }}
        />
        <div
          style={{
            height: width * 0.15,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${width * 0.09}px`,
            fontFamily: FONT.sans,
            fontSize: width * 0.042,
            fontWeight: 700,
            color: COLORS.ink,
          }}
        >
          <span>9:41</span>
          <span style={{letterSpacing: 2}}>●●●</span>
        </div>
        {title ? (
          <div
            style={{
              flexShrink: 0,
              padding: `${width * 0.02}px 0 ${width * 0.035}px`,
              textAlign: 'center',
              fontFamily: FONT.sans,
              fontSize: width * 0.048,
              fontWeight: 800,
              color: COLORS.ink,
              borderBottom: `2px solid ${COLORS.line}`,
            }}
          >
            {title}
          </div>
        ) : null}
        <div style={{position: 'relative', flex: 1, display: 'flex', flexDirection: 'column'}}>{children}</div>
      </div>
    </div>
  );
};

type BrowserMockupProps = {
  children?: React.ReactNode;
  width?: number;
  height?: number;
  url?: string;
  delay?: number;
  style?: React.CSSProperties;
};

/** Neutrales Browserfenster mit Adresszeile. */
export const BrowserMockup: React.FC<BrowserMockupProps> = ({children, width = 920, height = 640, url = 'beispiel.de', delay = 0, style}) => {
  const enter = useEnter(delay);
  const bar = 72;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 32,
        background: COLORS.surface,
        boxShadow: SHADOW.lift,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: `2px solid ${COLORS.line}`,
        ...enter,
        ...style,
      }}
    >
      <div
        style={{
          height: bar,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '0 26px',
          background: '#F1EEF6',
          borderBottom: `2px solid ${COLORS.line}`,
        }}
      >
        {['#FF6159', '#FFBD2E', '#28C941'].map((c) => (
          <div key={c} style={{width: 18, height: 18, borderRadius: '50%', background: c}} />
        ))}
        <div
          style={{
            flex: 1,
            marginLeft: 18,
            height: 42,
            borderRadius: 999,
            background: COLORS.surface,
            display: 'flex',
            alignItems: 'center',
            padding: '0 22px',
            fontFamily: FONT.sans,
            fontSize: 24,
            fontWeight: 600,
            color: COLORS.inkSoft,
          }}
        >
          {url}
        </div>
      </div>
      <div style={{position: 'relative', flex: 1}}>{children}</div>
    </div>
  );
};

export type TerminalLine = {
  text: string;
  /** Frame (relativ zur Szene), ab dem die Zeile erscheint. */
  at: number;
  kind?: 'cmd' | 'out' | 'ok' | 'err';
};

type TerminalMockupProps = {
  lines: TerminalLine[];
  width?: number;
  height?: number;
  title?: string;
  delay?: number;
  fontSize?: number;
  style?: React.CSSProperties;
};

const LINE_COLORS = {cmd: '#FFFFFF', out: '#B9B2C9', ok: '#5FD3A0', err: '#FF7A8C'} as const;

/** Terminal: Befehle tippen sich Zeichen für Zeichen, Ausgaben erscheinen. */
export const TerminalMockup: React.FC<TerminalMockupProps> = ({
  lines,
  width = 920,
  height = 560,
  title = 'Terminal',
  delay = 0,
  fontSize = 34,
  style,
}) => {
  const frame = useCurrentFrame();
  const enter = useEnter(delay);
  const visible = lines.filter((l) => frame >= l.at);
  const last = visible[visible.length - 1];
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 30,
        background: COLORS.dark,
        boxShadow: SHADOW.lift,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        ...enter,
        ...style,
      }}
    >
      <div
        style={{
          height: 64,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 24px',
          background: COLORS.darkSoft,
          fontFamily: FONT.sans,
          fontSize: 22,
          fontWeight: 700,
          color: '#8D86A0',
        }}
      >
        {['#FF6159', '#FFBD2E', '#28C941'].map((c) => (
          <div key={c} style={{width: 16, height: 16, borderRadius: '50%', background: c}} />
        ))}
        <span style={{marginLeft: 16}}>{title}</span>
      </div>
      <div
        style={{
          padding: '28px 34px',
          fontFamily: FONT.mono,
          fontSize,
          fontWeight: 500,
          lineHeight: 1.55,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {visible.map((line, i) => {
          const kind = line.kind ?? 'out';
          // Tippgeschwindigkeit konstant: lineare Zeitachse ist hier korrekt.
          const chars =
            kind === 'cmd'
              ? Math.floor(interpolate(frame, [line.at, line.at + line.text.length * 1.4], [0, line.text.length], {extrapolateRight: 'clamp'}))
              : line.text.length;
          const isLast = line === last;
          return (
            <div key={i} style={{color: LINE_COLORS[kind], whiteSpace: 'pre-wrap'}}>
              {kind === 'cmd' ? <span style={{color: COLORS.accent}}>$ </span> : null}
              {line.text.slice(0, chars)}
              {isLast && kind === 'cmd' ? (
                <span style={{opacity: Math.floor(frame / 15) % 2 === 0 || chars < line.text.length ? 1 : 0, color: COLORS.accent}}>▍</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
