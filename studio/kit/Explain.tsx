import React from 'react';
import {Check, X} from 'lucide';
import {Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Icon} from './Icon';
import {clamp01, mix, pop, progress} from './motion';
import {useTheme} from './themes';

type ChecklistProps = {
  items: string[];
  delay?: number;
  /** Frames zwischen zwei Punkten. */
  step?: number;
  size?: number;
  /** `good` = Haken, `bad` = Kreuz. */
  tone?: 'good' | 'bad';
  width?: number;
};

/** Liste, deren Punkte nacheinander abgehakt werden. */
export const Checklist: React.FC<ChecklistProps> = ({items, delay = 0, step = 12, size = 50, tone = 'good', width = 860}) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const strong = tone === 'good' ? t.c.good : t.c.bad;
  return (
    <div style={{width, display: 'flex', flexDirection: 'column', gap: size * 0.55}}>
      {items.map((item, i) => {
        const at = delay + i * step;
        const s = pop(frame, fps, at, 'snappy');
        const text = progress(frame, at + 3, 14, 'out');
        return (
          <div key={item} style={{display: 'flex', alignItems: 'center', gap: size * 0.5}}>
            <div
              style={{
                width: size * 1.35,
                height: size * 1.35,
                borderRadius: '50%',
                background: strong,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transform: `scale(${Math.max(0, s)})`,
                boxShadow: t.shadow.soft,
              }}
            >
              <Icon icon={tone === 'good' ? Check : X} size={size * 0.85} color="#FFFFFF" strokeWidth={3.2} delay={at + 4} duration={12} />
            </div>
            <div
              style={{
                fontFamily: t.font.body,
                fontWeight: 700,
                fontSize: size,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: t.c.ink,
                opacity: text,
                transform: `translateX(${(1 - text) * -24}px)`,
              }}
            >
              {item}
            </div>
          </div>
        );
      })}
    </div>
  );
};

type StepsProps = {
  steps: Array<{title: string; text?: string}>;
  delay?: number;
  step?: number;
  /** Index des aktuell hervorgehobenen Schritts und ab wann. */
  active?: {index: number; at: number};
  size?: number;
  width?: number;
};

/** Nummerierte Schritte, durch eine wachsende Linie verbunden. */
export const Steps: React.FC<StepsProps> = ({steps, delay = 0, step = 16, active, size = 48, width = 860}) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dot = size * 1.5;
  const rowGap = size * 0.9;
  const rowHeight = size * 2.4;
  const line = progress(frame, delay + 6, step * (steps.length - 1) + 10, 'inOut');
  return (
    <div style={{position: 'relative', width, display: 'flex', flexDirection: 'column', gap: rowGap}}>
      <div
        style={{
          position: 'absolute',
          left: dot / 2 - 4,
          top: dot / 2,
          width: 8,
          height: (rowHeight + rowGap) * (steps.length - 1) * line,
          borderRadius: 4,
          background: t.c.accent,
        }}
      />
      {steps.map((st, i) => {
        const at = delay + i * step;
        const s = pop(frame, fps, at, 'snappy');
        const text = progress(frame, at + 4, 14, 'out');
        const isActive = active ? active.index === i && frame >= active.at : false;
        const dim = active && frame >= active.at && !isActive ? 0.45 : 1;
        return (
          <div key={st.title} style={{position: 'relative', display: 'flex', alignItems: 'flex-start', gap: size * 0.55, minHeight: rowHeight}}>
            <div
              style={{
                width: dot,
                height: dot,
                borderRadius: '50%',
                background: isActive ? t.c.accentDeep : t.c.surface,
                border: `4px solid ${dim < 1 ? t.c.accent : t.c.accentDeep}`,
                color: isActive ? t.c.onAccent : dim < 1 ? t.c.accent : t.c.accentDeep,
                fontFamily: t.font.body,
                fontWeight: 900,
                fontSize: size * 0.8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transform: `scale(${Math.max(0, s) * (isActive ? 1.08 : 1)})`,
                boxShadow: t.shadow.soft,
              }}
            >
              {i + 1}
            </div>
            <div style={{opacity: text * dim, transform: `translateY(${(1 - text) * 16}px)`, paddingTop: dot * 0.12}}>
              <div style={{fontFamily: t.font.body, fontWeight: 800, fontSize: size, letterSpacing: '-0.025em', color: t.c.ink}}>{st.title}</div>
              {st.text ? (
                <div style={{fontFamily: t.font.body, fontWeight: 600, fontSize: size * 0.68, color: t.c.inkSoft, marginTop: size * 0.15, lineHeight: 1.3}}>{st.text}</div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

type BeforeAfterProps = {
  before: React.ReactNode;
  after: React.ReactNode;
  width: number;
  height: number;
  /** Frame, an dem die Trennlinie losläuft. */
  at?: number;
  duration?: number;
  labels?: [string, string];
  radius?: number;
};

/** Vorher/Nachher: eine Trennlinie wischt vom alten zum neuen Zustand. */
export const BeforeAfter: React.FC<BeforeAfterProps> = ({before, after, width, height, at = 20, duration = 30, labels = ['Vorher', 'Nachher'], radius = 36}) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const p = progress(frame, at, duration, 'inOut');
  const x = width * (1 - p);
  const label = (text: string, side: 'left' | 'right', visible: number, tone: string) => (
    <div
      style={{
        position: 'absolute',
        top: 24,
        [side]: 24,
        padding: '10px 22px',
        borderRadius: 999,
        background: tone,
        color: '#FFFFFF',
        fontFamily: t.font.body,
        fontWeight: 800,
        fontSize: 30,
        opacity: visible,
      }}
    >
      {text}
    </div>
  );
  return (
    <div style={{position: 'relative', width, height, borderRadius: radius, overflow: 'hidden', boxShadow: t.shadow.lift, background: t.c.surface}}>
      <div style={{position: 'absolute', inset: 0}}>{before}</div>
      <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${x}px)`}}>{after}</div>
      {label(labels[0], 'left', 1 - clamp01(p * 1.4), t.c.bad)}
      {label(labels[1], 'right', clamp01((p - 0.3) * 2), t.c.good)}
      {p > 0 && p < 1 ? (
        <div style={{position: 'absolute', top: 0, bottom: 0, left: x - 4, width: 8, background: '#FFFFFF', boxShadow: '0 0 24px rgba(40,24,80,0.35)'}}>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 64,
              height: 64,
              marginLeft: -32,
              marginTop: -32,
              borderRadius: '50%',
              background: '#FFFFFF',
              boxShadow: t.shadow.lift,
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export type FocusKey = {
  at: number;
  /** Fokus-Rechteck in Pixeln des Inhalts. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Rest abdunkeln und Rahmen zeigen. */
  highlight?: boolean;
};

type ScreenFocusProps = {
  /** Sichtfenster auf der Bühne. */
  width: number;
  height: number;
  /** Natürliche Größe des Inhalts (z. B. Screenshot 1920×1080). */
  contentWidth: number;
  contentHeight: number;
  keys: FocusKey[];
  /** Inhalt (Mockup o. Ä.) – oder stattdessen `src`. */
  children?: React.ReactNode;
  /** Screenshot oder Bildschirmaufnahme in studio/public (z. B. "projekte/x/aufnahme.mp4"). */
  src?: string;
  radius?: number;
};

/**
 * Zoomt in einen Screenshot, eine Bildschirmaufnahme oder ein Mockup auf die
 * gerade wichtige Stelle und dunkelt den Rest ab.
 */
export const ScreenFocus: React.FC<ScreenFocusProps> = ({width, height, contentWidth, contentHeight, keys, children, src, radius = 32}) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const sorted = keys.length > 0 ? [...keys].sort((a, b) => a.at - b.at) : [{at: 0, x: 0, y: 0, w: contentWidth, h: contentHeight}];
  let a = sorted[0];
  let b = sorted[0];
  for (let i = 0; i < sorted.length; i++) {
    if (frame >= sorted[i].at) {
      a = sorted[i];
      b = sorted[i + 1] ?? sorted[i];
    }
  }
  const k = b === a ? 0 : progress(frame, b.at - Math.min(24, b.at - a.at), Math.min(24, b.at - a.at), 'inOut');
  const r = {x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), w: mix(a.w, b.w, k), h: mix(a.h, b.h, k)};
  const hl = mix(a.highlight ? 1 : 0, b.highlight ? 1 : 0, k);
  const pad = 1 + 0.25 * hl;
  const zoom = Math.min(width / (r.w * pad), height / (r.h * pad));
  const tx = width / 2 - (r.x + r.w / 2) * zoom;
  const ty = height / 2 - (r.y + r.h / 2) * zoom;
  return (
    <div style={{position: 'relative', width, height, overflow: 'hidden', borderRadius: radius, background: t.c.dark, boxShadow: t.shadow.lift}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: contentWidth, height: contentHeight, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${zoom})`}}>
        {src ? (
          /\.(mp4|mov|webm|m4v)$/i.test(src) ? (
            <OffthreadVideo src={staticFile(src)} muted style={{width: contentWidth, height: contentHeight}} />
          ) : (
            <Img src={staticFile(src)} style={{width: contentWidth, height: contentHeight}} />
          )
        ) : (
          children
        )}
        <div
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            width: r.w,
            height: r.h,
            borderRadius: 14 / zoom,
            border: `${5 / zoom}px solid ${t.c.accent}`,
            boxShadow: `0 0 0 ${4000 / zoom}px rgba(15,10,28,${0.5 * hl})`,
            opacity: interpolate(hl, [0, 0.2, 1], [0, 1, 1]),
          }}
        />
      </div>
    </div>
  );
};
