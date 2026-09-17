import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';

/**
 * Wort-getriebene Szene.
 *
 * Ein Kapitel beschreibt nur noch, welches Bild bei welchem Frame erscheint.
 * Die Frames stammen aus der Whisper-Transkription des echten Voiceovers mit
 * Wort-Timestamps — jedes Element sitzt auf dem Wort, das es erklaert.
 *
 * Das Raster ist bewusst grob: drei Spalten, drei Reihen. Es geht darum, dass
 * die Bilder nebeneinander stehen bleiben und mitwachsen, nicht darum, jeden
 * Pixel zu setzen.
 */

const purple = BRAND.accentDk;
const accent = BRAND.accent;
const ink = BRAND.ink;
const muted = '#8D8197';
const green = '#31875A';
const red = '#B64D58';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(110,69,201,.16)',
  borderRadius: 24,
  boxShadow: '0 22px 60px rgba(26,26,46,.09)',
};
const label: React.CSSProperties = {
  fontFamily: BRAND.font.body,
  fontWeight: 850,
  letterSpacing: -0.5,
  color: ink,
};

export type Tone = 'on' | 'off' | 'good' | 'bad';
const toneColor = (t: Tone) => (t === 'good' ? green : t === 'bad' ? red : t === 'off' ? muted : purple);
const toneBg = (t: Tone) =>
  t === 'good' ? '#EAF6EF' : t === 'bad' ? '#FCEEF0' : t === 'off' ? '#F2EEF7' : 'rgba(185,140,255,.16)';

export type WordItem =
  | {at: number; col: number; row: number; kind: 'chip'; text: string; tone?: Tone; icon?: React.ReactNode}
  | {at: number; col: number; row: number; kind: 'card'; title: string; text: string; tone?: Tone; wide?: boolean}
  | {at: number; col: number; row: number; kind: 'flow'; steps: string[]; tone?: Tone; stagger?: number}
  | {at: number; col: number; row: number; kind: 'note'; text: string; tone?: Tone}
  | {at: number; col: number; row: number; kind: 'lines'; title: string; widths?: number[]; tone?: Tone}
  | {at: number; col: number; row: number; kind: 'big'; text: string; tone?: Tone};

// Spalten- und Reihenmitten im 1920x1080-Bild, unterhalb des Kapitelkopfs.
const COL = [330, 960, 1590];
const ROW = [300, 560, 800];

const useEnter = (at: number, duration = 24) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - at, fps, config: {damping: 190, mass: 0.7}, durationInFrames: duration});
};

const Slot: React.FC<{col: number; row: number; children: React.ReactNode}> = ({col, row, children}) => (
  <div style={{
    position: 'absolute',
    left: COL[Math.min(2, Math.max(0, col))],
    top: ROW[Math.min(2, Math.max(0, row))],
    transform: 'translate(-50%, -50%)',
    display: 'flex', justifyContent: 'center',
  }}>
    {children}
  </div>
);

const Enter: React.FC<{at: number; children: React.ReactNode; scale?: boolean}> = ({at, children, scale}) => {
  const e = useEnter(at);
  return (
    <div style={{
      opacity: Math.min(1, e * 1.35),
      transform: scale ? `scale(${0.74 + e * 0.26})` : `translateY(${(1 - e) * 32}px)`,
    }}>
      {children}
    </div>
  );
};

const Item: React.FC<{item: WordItem}> = ({item}) => {
  const frame = useCurrentFrame();
  const tone: Tone = item.tone ?? 'on';

  if (item.kind === 'chip') {
    return (
      <Enter at={item.at} scale>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 11, padding: '15px 24px', borderRadius: 999,
          background: toneBg(tone), border: `1.5px solid ${tone === 'off' ? 'rgba(26,26,46,.10)' : 'rgba(110,69,201,.26)'}`,
        }}>
          {item.icon ? (
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke={toneColor(tone)}
              strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
          ) : null}
          <div style={{...label, fontSize: 24, color: toneColor(tone)}}>{item.text}</div>
        </div>
      </Enter>
    );
  }

  if (item.kind === 'card') {
    return (
      <Enter at={item.at}>
        <div style={{...card, padding: '26px 30px', width: item.wide ? 520 : 380,
          border: tone === 'on' ? '1px solid rgba(110,69,201,.16)' : `1.5px solid ${toneColor(tone)}33`}}>
          <div style={{...label, fontSize: 20, color: toneColor(tone), letterSpacing: 1.5}}>{item.title}</div>
          <div style={{...label, fontSize: 28, marginTop: 13, lineHeight: 1.24}}>{item.text}</div>
        </div>
      </Enter>
    );
  }

  if (item.kind === 'flow') {
    const stagger = item.stagger ?? 14;
    return (
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        {item.steps.map((s, i) => (
          <React.Fragment key={s}>
            <Enter at={item.at + i * stagger} scale>
              <div style={{padding: '13px 19px', borderRadius: 14, background: toneBg(tone),
                border: `1.5px solid ${toneColor(tone)}30`, ...label, fontSize: 21, color: toneColor(tone),
                whiteSpace: 'nowrap'}}>{s}</div>
            </Enter>
            {i < item.steps.length - 1 ? (
              <div style={{...label, fontSize: 22, color: accent,
                opacity: interpolate(frame, [item.at + i * stagger + 8, item.at + i * stagger + 22], [0, 1], clamp)}}>→</div>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (item.kind === 'lines') {
    const widths = item.widths ?? [92, 74, 84];
    return (
      <Enter at={item.at}>
        <div style={{...card, width: 400, padding: '24px 28px', borderStyle: 'dashed',
          borderColor: 'rgba(26,26,46,.18)'}}>
          <div style={{...label, fontSize: 19, color: muted, letterSpacing: 1.5}}>{item.title}</div>
          {widths.map((w, i) => (
            <div key={i} style={{height: 11, width: `${w}%`, borderRadius: 7, background: '#DCD4E4',
              marginTop: i === 0 ? 17 : 10, transformOrigin: 'left',
              transform: `scaleX(${interpolate(frame, [item.at + i * 7, item.at + 20 + i * 7], [0, 1], clamp)})`}} />
          ))}
        </div>
      </Enter>
    );
  }

  if (item.kind === 'big') {
    return (
      <Enter at={item.at}>
        <div style={{...card, padding: '24px 44px', borderRadius: 999,
          background: 'linear-gradient(90deg,#F6F0FF,#fff,#F6F0FF)'}}>
          <div style={{...label, fontSize: 32, color: toneColor(tone), whiteSpace: 'nowrap'}}>{item.text}</div>
        </div>
      </Enter>
    );
  }

  return (
    <Enter at={item.at}>
      <div style={{...label, fontSize: 25, color: toneColor(tone), maxWidth: 520, lineHeight: 1.26,
        textAlign: 'center'}}>{item.text}</div>
    </Enter>
  );
};

export const WordScene: React.FC<{items: WordItem[]}> = ({items}) => (
  <div style={{position: 'absolute', inset: 0}}>
    {items.map((item, i) => (
      <Slot key={i} col={item.col} row={item.row}>
        <Item item={item} />
      </Slot>
    ))}
  </div>
);

/** Kleine Icon-Sammlung fuer die Kapitel. */
export const ICONS = {
  suche: <><circle cx="14" cy="14" r="8" /><path d="M20 20l7 7" /></>,
  datei: <><path d="M4 8a2 2 0 012-2h7l3 4h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2z" /></>,
  code: <><path d="M11 10l-7 6 7 6M21 10l7 6-7 6" /></>,
  browser: <><rect x="3" y="6" width="26" height="20" rx="3" /><path d="M3 12h26M8 9h.01M12 9h.01" /></>,
  modell: <><circle cx="16" cy="16" r="9" /><circle cx="16" cy="16" r="3" /><path d="M16 2v4M16 26v4M2 16h4M26 16h4" /></>,
  ziel: <><circle cx="16" cy="16" r="11" /><circle cx="16" cy="16" r="6" /><circle cx="16" cy="16" r="1.6" /></>,
  check: <><circle cx="16" cy="16" r="12" /><path d="M10 16.5l4 4 8-8.5" /></>,
  warn: <><path d="M16 5L29 27H3z" /><path d="M16 13v6M16 23h.01" /></>,
  schild: <><path d="M16 3l11 4v9c0 7-4.7 11.4-11 13-6.3-1.6-11-6-11-13V7z" /><path d="M11 16l3.5 3.5L21 13" /></>,
  loop: <><path d="M27 16a11 11 0 11-3.6-8.1" /><path d="M27 5v7h-7" /></>,
  stop: <><circle cx="16" cy="16" r="12" /><path d="M11 11l10 10M21 11L11 21" /></>,
  db: <><ellipse cx="16" cy="8" rx="11" ry="4" /><path d="M5 8v16c0 2.2 4.9 4 11 4s11-1.8 11-4V8" /><path d="M5 16c0 2.2 4.9 4 11 4s11-1.8 11-4" /></>,
} as const;
