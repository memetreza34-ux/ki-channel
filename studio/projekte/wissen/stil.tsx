import React, {useMemo} from 'react';
import type {Caption} from '@remotion/captions';
import {createTikTokStyleCaptions} from '@remotion/captions';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AKZENT, BG, HELL, STAHL, clamp, outQuint} from './bausteine';

/**
 * Text-Bausteine nach dem Regelwerk vom 2026-11-08 (Skill `wissens-short`, Abschnitt „Look und Regelwerk“).
 * Grundsatz: Das Bild erzählt. Text nur, wo er etwas hinzufügt, was die Stimme nicht kann.
 */

const MONO = 'JetBrains Mono, monospace';
const SPACE = 'Space Grotesk, sans-serif';
const INTER = 'Inter, sans-serif';
const ein = (f: number, ab: number, dauer = 12) => interpolate(f, [ab, ab + dauer], [0, 1], {...clamp, easing: outQuint});

/* ───────────── Überschrift ───────────── */

/**
 * Überschrift im Welt-Stil (schraffuren-Art): steht ab Frame 0, verschwindet bei `bis`
 * (typisch: wenn der erste Satz gesprochen ist, 60–150 Frames). Im Technik-Stil gar keine Überschrift.
 */
export const TitelStart: React.FC<{text: React.ReactNode; bis?: number; top?: number}> = ({text, bis = 120, top = 230}) => {
  const f = useCurrentFrame();
  const raus = interpolate(f, [bis, bis + 10], [1, 0], clamp);
  if (raus <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 80, right: 160, top, fontFamily: SPACE, fontWeight: 700, fontSize: 68, lineHeight: 1.06, letterSpacing: '-0.025em', color: HELL, opacity: raus, transform: `translateY(${(1 - raus) * -10}px)`, textShadow: '0 2px 24px rgba(0,0,0,0.35)'}}>
      {text}
    </div>
  );
};

/* ───────────── Untertitel ───────────── */

type Stueck = {text: string; startMs: number; endMs: number};

/** Wortzeiten zu Satzstücken bündeln: Schnitt an Satzzeichen, Pausen > `pauseMs` oder nach `maxWoerter`. */
export const satzstuecke = (captions: Caption[], maxWoerter = 6, pauseMs = 350): Stueck[] => {
  const out: Stueck[] = [];
  let akt: Caption[] = [];
  const schliessen = () => {
    if (!akt.length) return;
    out.push({text: akt.map((c) => c.text.trim()).join(' '), startMs: akt[0].startMs, endMs: akt[akt.length - 1].endMs});
    akt = [];
  };
  captions.forEach((c, i) => {
    akt.push(c);
    const naechste = captions[i + 1];
    const satzende = /[.!?:;,]$/.test(c.text.trim());
    const pause = naechste ? naechste.startMs - c.endMs > pauseMs : true;
    if (satzende || pause || akt.length >= maxWoerter) schliessen();
  });
  schliessen();
  return out;
};

/**
 * Untertitel im Welt-Stil (schraffuren-Art): ganze Satzstücke (3–6 Wörter) erscheinen auf einmal,
 * kleiner dunkler Kasten, keine Hervorhebung. Steht bis zum Beginn des nächsten Stücks (höchstens 600 ms Nachlauf).
 */
export const UntertitelSatz: React.FC<{captions: Caption[]; top?: number; maxWoerter?: number}> = ({captions, top = 1300, maxWoerter = 6}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stuecke = useMemo(() => satzstuecke(captions, maxWoerter), [captions, maxWoerter]);
  const jetzt = (f / fps) * 1000;
  const i = stuecke.findIndex((s, k) => jetzt >= s.startMs && jetzt < Math.min(stuecke[k + 1]?.startMs ?? Infinity, s.endMs + 600));
  if (i < 0) return null;
  const s = stuecke[i];
  const rein = interpolate(jetzt - s.startMs, [0, 90], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
      <div style={{maxWidth: 820, padding: '10px 22px 12px', borderRadius: 10, background: 'rgba(8,12,22,0.82)', fontFamily: INTER, fontWeight: 600, fontSize: 46, lineHeight: 1.2, color: HELL, textAlign: 'center', opacity: rein, transform: `scale(${0.97 + 0.03 * rein})`}}>
        {s.text}
      </div>
    </div>
  );
};

/**
 * Untertitel im Technik-Stil (scroll.engineer-Art): 3–5 Wörter, das gerade gesprochene Wort weiß hinterlegt.
 * `gross` = Wörter, die als Betonung in GROSSBUCHSTABEN stehen (höchstens eins pro Satz, im Skript markieren);
 * Wörter, die schon in Großbuchstaben in den Wortzeiten stehen, bleiben so. `unterstrichen` = Schlüsselbegriffe.
 */
export const UntertitelWort: React.FC<{captions: Caption[]; top?: number; gross?: string[]; unterstrichen?: string[]; seiteMs?: number}> = ({captions, top = 1430, gross = [], unterstrichen = [], seiteMs = 800}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {pages} = useMemo(() => createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: seiteMs}), [captions, seiteMs]);
  const jetzt = (f / fps) * 1000;
  const seite = pages.find((p) => jetzt >= p.startMs && jetzt < p.startMs + p.durationMs);
  if (!seite) return null;
  const grossSet = new Set(gross.map((w) => w.toLowerCase()));
  const unterSet = new Set(unterstrichen.map((w) => w.toLowerCase()));
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 12px', pointerEvents: 'none', fontFamily: INTER, fontWeight: 700, fontSize: 54, lineHeight: 1.25}}>
      {seite.tokens.map((t, i) => {
        const roh = t.text.trim();
        if (!roh) return null;
        const schluessel = roh.replace(/[.,!?;:„“"]/g, '').toLowerCase();
        const text = grossSet.has(schluessel) ? roh.toUpperCase() : roh;
        const aktiv = jetzt >= t.fromMs && jetzt < t.toMs;
        return (
          <span key={i} style={{padding: '0 10px', borderRadius: 8, background: aktiv ? HELL : 'transparent', color: aktiv ? BG : HELL, textShadow: aktiv ? 'none' : '0 2px 10px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)', textDecoration: unterSet.has(schluessel) ? `underline ${AKZENT} 5px` : 'none', textUnderlineOffset: 8}}>
            {text}
          </span>
        );
      })}
    </div>
  );
};

/* ───────────── Kleine Angaben am Objekt ───────────── */

/**
 * Maßangabe direkt am Objekt (scroll.engineer-Art): Maßlinie mit Endstrichen von `von` nach `bis`,
 * winziges Label mittig darüber („13 mm“, „40 µm“). Zeichnet sich ab `ab` auf.
 */
export const Mass: React.FC<{von: [number, number]; bis: [number, number]; text: string; ab: number; versatz?: number}> = ({von, bis, text, ab, versatz = -34}) => {
  const f = useCurrentFrame();
  const t = ein(f, ab, 14);
  if (t <= 0) return null;
  const [x1, y1] = von;
  const [x2, y2] = bis;
  const mx = x1 + (x2 - x1) * 0.5;
  const my = y1 + (y2 - y1) * 0.5;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * 12;
  const ny = (dx / len) * 12;
  const ax = mx - (dx / 2) * t;
  const ay = my - (dy / 2) * t;
  const bx = mx + (dx / 2) * t;
  const by = my + (dy / 2) * t;
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}}>
        <line x1={ax} y1={ay} x2={bx} y2={by} stroke={HELL} strokeWidth={3} />
        <line x1={ax - nx} y1={ay - ny} x2={ax + nx} y2={ay + ny} stroke={HELL} strokeWidth={3} />
        <line x1={bx - nx} y1={by - ny} x2={bx + nx} y2={by + ny} stroke={HELL} strokeWidth={3} />
      </svg>
      <div style={{position: 'absolute', left: mx - 160, width: 320, top: my + versatz - 22, display: 'flex', justifyContent: 'center', opacity: interpolate(f, [ab + 8, ab + 16], [0, 1], clamp)}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 30, color: HELL, padding: '4px 12px', borderRadius: 6, background: 'rgba(8,12,22,0.85)', border: `2px solid ${HELL}55`}}>{text}</div>
      </div>
    </>
  );
};

/**
 * Zwei Zahlen zum Vergleich oben links (schraffuren-Art: „79,0 ↔ 83,3“). Jede mit kleinem Label darüber.
 * Die zweite kommt bei `abRechts`; `akzent` färbt die wichtigere.
 */
export const ZahlPaar: React.FC<{links: {wert: string; label: string}; rechts: {wert: string; label: string}; ab: number; abRechts: number; einheit?: string; akzent?: 'links' | 'rechts'; top?: number; aufHell?: boolean}> = ({links, rechts, ab, abRechts, einheit = '', akzent = 'rechts', top = 420, aufHell = false}) => {
  const text = aufHell ? '#1F2533' : HELL;
  const label = aufHell ? '#1F2533CC' : STAHL;
  const f = useCurrentFrame();
  const block = (z: {wert: string; label: string}, start: number, hervor: boolean) => {
    const t = ein(f, start);
    return (
      <div style={{opacity: t, transform: `translateY(${(1 - t) * 14}px)`}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: '0.04em', color: label}}>{z.label}</div>
        <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 96, letterSpacing: '-0.04em', color: hervor ? AKZENT : text, fontVariantNumeric: 'tabular-nums'}}>
          {z.wert}
          <span style={{fontSize: 40, marginLeft: 8, color: text}}>{einheit}</span>
        </div>
      </div>
    );
  };
  return (
    <div style={{position: 'absolute', left: 80, top, display: 'flex', gap: 60}}>
      {block(links, ab, akzent === 'links')}
      {block(rechts, abRechts, akzent === 'rechts')}
    </div>
  );
};

/** Winziger Hinweis oben links („NACHGEBAUT“). Nur, wenn das Bild wie ein Foto oder ein echtes Produkt wirkt. */
export const Hinweis: React.FC<{text?: string; top?: number}> = ({text = 'nachgebaut', top = 150}) => (
  <div style={{position: 'absolute', left: 80, top, display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 24, letterSpacing: '0.12em', color: `${HELL}AA`, textTransform: 'uppercase'}}>
    <div style={{width: 10, height: 10, borderRadius: 5, background: `${HELL}AA`}} />
    {text}
  </div>
);

/** Quelle winzig unten links (darf die ganze Zeit stehen). */
export const QuelleKlein: React.FC<{text: string; top?: number}> = ({text, top = 1430}) => (
  <div style={{position: 'absolute', left: 80, right: 160, top, fontFamily: MONO, fontSize: 24, letterSpacing: '0.04em', color: `${STAHL}CC`}}>{text}</div>
);

/** Wortzeiten für Beispiele ohne Aufnahme: Text gleichmäßig über `startMs`–`endMs` verteilen (nur für Kataloge/Tests). */
export const probeZeiten = (text: string, startMs: number, msProWort = 330): Caption[] =>
  text.split(' ').map((w, i) => ({text: (i ? ' ' : '') + w, startMs: startMs + i * msProWort, endMs: startMs + (i + 1) * msProWort - 30, timestampMs: null, confidence: 1}));
