import React from 'react';
import {AbsoluteFill, Audio, interpolateColors, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, EASE, Icon, mix, Music, pop, progress, Scramble, Sfx, type SfxName} from '../../kit';
import type {Project} from '../types';
import {Karte} from '../kanal-look/Serien';
import {KANAL, rounded, SERIEN, Shape, StilContext, Toki, useStil, type Blick, type Gesicht} from '../kanal-look/stil';
import piperZeiten from './absaetze-piper.json';
import stimmZeiten from './absaetze.json';
import untertitel from './untertitel.json';

/**
 * „Wie denkt eine KI?“ – erstes Kanal-Video.
 * Eine durchgehende Welt: 8 Stationen nebeneinander, die Kamera fährt mit, Toki hüpft mit.
 * Alle Zeiten in Sekunden, abgeleitet aus absaetze.json / untertitel.json (Piper-Stimme).
 */

const FPS = 30;
/** Die Animation ist auf die Piper-Zeiten gebaut (absaetze-piper.json). Liegt eine andere Aufnahme vor
 * (absaetze.json), wird jede Zeit absatzweise linear auf die neue Aufnahme umgerechnet. */
const ENDE_PIPER = 117;
const ANKER: [number, number][] = (() => {
  const a: [number, number][] = [[0, 0]];
  piperZeiten.forEach((pz, i) => {
    const n = stimmZeiten[i];
    a.push([pz.start, n.start], [pz.ende, n.ende]);
  });
  const [lp, ln] = a[a.length - 1];
  a.push([ENDE_PIPER, ln + (ENDE_PIPER - lp)]);
  return a;
})();
const umrechnen = (x: number, von: 0 | 1, nach: 0 | 1) => {
  for (let i = 1; i < ANKER.length; i++) {
    const [a0, a1] = [ANKER[i - 1][von], ANKER[i][von]];
    if (x <= a1 || i === ANKER.length - 1) {
      const q = a1 === a0 ? 0 : (x - a0) / (a1 - a0);
      return ANKER[i - 1][nach] + q * (ANKER[i][nach] - ANKER[i - 1][nach]);
    }
  }
  return x;
};
/** Piper-Zeit → Zeit in der echten Aufnahme. */
const echt = (sec: number) => umrechnen(sec, 0, 1);
/** Zeit in der echten Aufnahme → Piper-Zeit (in dieser Zeit sind alle Animationen geschrieben). */
const piperZeit = (sec: number) => umrechnen(sec, 1, 0);
const DAUER = echt(ENDE_PIPER);
const VOICEOVER = 'projekte/wie-denkt-ki/voiceover.wav';
const MUSIK = 'projekte/wie-denkt-ki/musik.wav';

const W = 2400; // Abstand der Stationen in der Welt
const BODEN = 935; // Fußlinie

/** Zeitpunkt (Piper-Zeit) → Frame im fertigen Video. */
const fr = (sec: number) => Math.round(echt(sec) * FPS);
/** Dauer in Sekunden → Frames (nicht umgerechnet). */
const frDauer = (sec: number) => Math.round(sec * FPS);

/** Zeit-Helfer in Sekunden. */
const useZeit = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = piperZeit(frame / FPS);
  return {
    frame,
    t,
    /** 0→1 ab `start` über `dauer` Sekunden. */
    p: (start: number, dauer = 0.4, ease: keyof typeof EASE = 'out') => progress(frame, fr(start), Math.max(1, frDauer(dauer)), ease),
    /** Feder ab `start`. */
    federn: (start: number, art: 'snappy' | 'smooth' | 'bouncy' = 'snappy') => pop(frame, fps, fr(start), art),
  };
};

const PASTELL = ['#FFE4D9', '#E1EAFF', '#E2F4EA', '#FFF0C2', '#ECE4FD', '#D9F1EC'];
const PASTELL_INK = ['#C24E2E', '#2E5BC4', '#1F8A55', '#8A6400', '#6B46C1', '#0E7F72'];
const GELB = SERIEN.erklaert.farbe;

/* ───────────── Kamera ───────────── */

const FAHRTEN: {von: number; bis: number; nach: number}[] = [
  {von: 9.8, bis: 11.0, nach: 1},
  {von: 21.0, bis: 22.1, nach: 2},
  {von: 36.4, bis: 37.5, nach: 3},
  {von: 50.3, bis: 51.4, nach: 4},
  {von: 71.4, bis: 72.5, nach: 5},
  {von: 90.0, bis: 91.0, nach: 6},
  {von: 97.2, bis: 98.2, nach: 7},
];

const stationAt = (t: number) => {
  let pos = 0;
  for (const f of FAHRTEN) {
    if (t >= f.bis) pos = f.nach;
    else if (t > f.von) {
      const q = EASE.inOut((t - f.von) / (f.bis - f.von));
      return mix(pos, f.nach, q);
    }
  }
  return pos;
};

/* ───────────── Kapitel-Schild ───────────── */

const KAPITEL: {t: number; text: string; farbe?: string}[] = [
  {t: 0, text: 'KI erklärt'},
  {t: 10.6, text: '1 · Tokens'},
  {t: 22.0, text: '2 · Zahlen'},
  {t: 37.4, text: '3 · Training'},
  {t: 51.3, text: '4 · Vorhersage'},
  {t: 60.8, text: '5 · Token für Token'},
  {t: 72.4, text: 'Achtung · Halluzination', farbe: KANAL.fehler},
  {t: 91.0, text: 'Merksatz'},
  {t: 98.2, text: 'Tipp'},
  {t: 107.4, text: 'KI erklärt'},
];

const KapitelSchild: React.FC = () => {
  const s = useStil();
  const {t, federn} = useZeit();
  const k = [...KAPITEL].reverse().find((x) => t >= x.t) ?? KAPITEL[0];
  const farbe = k.farbe ?? GELB;
  const q = federn(k.t);
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        top: 70,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 26px 12px 20px',
        borderRadius: 999,
        background: k.farbe ? '#FDE3E4' : SERIEN.erklaert.tint,
        fontFamily: s.body,
        fontSize: 30,
        fontWeight: 800,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: k.farbe ? farbe : '#8A6400',
        transform: `scale(${mix(0.85, 1, clamp01(q))})`,
        transformOrigin: 'left center',
        boxShadow: '0 6px 16px rgba(30,35,50,0.06)',
      }}
    >
      <div style={{width: 16, height: 16, borderRadius: '50%', background: farbe}} />
      {k.text}
    </div>
  );
};

/* ───────────── Welt: Hintergrund und Boden ───────────── */

const WOLKEN = Array.from({length: 22}, (_, i) => ({
  x: i * 560 + random(`w-x-${i}`) * 300,
  y: random(`w-y-${i}`) > 0.5 ? -260 + random(`w-yy-${i}`) * 160 : 640 + random(`w-yy-${i}`) * 160,
  r: 260 + random(`w-r-${i}`) * 220,
  c: [SERIEN.erklaert.tint2, SERIEN.news.tint2, SERIEN.recht.tint2, SERIEN.test.tint2][i % 4],
}));

const STEINE = Array.from({length: 90}, (_, i) => ({x: i * 230 + random(`s-${i}`) * 120, w: 30 + random(`sw-${i}`) * 60, y: 968 + random(`sy-${i}`) * 50}));

const Hinten: React.FC<{camX: number}> = ({camX}) => {
  const s = useStil();
  return (
    <AbsoluteFill style={{background: s.bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: camX * 0.45, top: 0}}>
        {WOLKEN.map((w, i) => (
          <div key={i} style={{position: 'absolute', left: w.x - w.r, top: w.y, width: w.r * 2, height: w.r * 2, borderRadius: '50%', background: w.c}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: BODEN, bottom: 0, background: '#EFECE4', borderTop: '4px solid #E3DFD4'}} />
      <div style={{position: 'absolute', left: camX, top: 0}}>
        {STEINE.map((st, i) => (
          <div key={i} style={{position: 'absolute', left: st.x, top: st.y, width: st.w, height: 12, borderRadius: 6, background: '#E3DFD4'}} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── Bausteine ───────────── */

const Chip: React.FC<{text: string; i: number; size?: number; style?: React.CSSProperties}> = ({text, i, size = 64, style}) => {
  const s = useStil();
  return (
    <div
      style={{
        fontFamily: s.head,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        padding: `${size * 0.16}px ${size * 0.3}px`,
        borderRadius: size * 0.32,
        background: PASTELL[i % PASTELL.length],
        color: PASTELL_INK[i % PASTELL.length],
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Handschriftliche Notiz (Caveat) mit optionalem Pfeil. */
const Notiz: React.FC<{x: number; y: number; text: string; at: number; farbe?: string; pfeil?: {dx: number; dy: number}; size?: number}> = ({x, y, text, at, farbe = KANAL.inkSoft, pfeil, size = 56}) => {
  const {p} = useZeit();
  const q = p(at, 0.35);
  const draw = p(at + 0.15, 0.4, 'inOut');
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: q}}>
      <div style={{fontFamily: 'Caveat, cursive', fontWeight: 700, fontSize: size, color: farbe, transform: `rotate(-4deg) translateY(${(1 - q) * 10}px)`, whiteSpace: 'nowrap'}}>{text}</div>
      {pfeil ? (
        <svg width={1} height={1} style={{position: 'absolute', left: 20, top: size * 0.6, overflow: 'visible'}}>
          <path
            d={`M0,10 Q${pfeil.dx * 0.2},${pfeil.dy * 0.7} ${pfeil.dx},${pfeil.dy}`}
            stroke={farbe}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - draw}
          />
          <circle cx={pfeil.dx} cy={pfeil.dy} r={7} fill={farbe} opacity={draw > 0.95 ? 1 : 0} />
        </svg>
      ) : null}
    </div>
  );
};

const NutzerBlase: React.FC<{text: string; at: number; size?: number}> = ({text, at, size = 44}) => {
  const s = useStil();
  const {federn} = useZeit();
  const q = federn(at);
  return (
    <div style={{display: 'flex', justifyContent: 'flex-end', opacity: clamp01(q * 2), transform: `translateY(${(1 - q) * 20}px) scale(${mix(0.9, 1, q)})`, transformOrigin: 'right bottom'}}>
      <div style={{padding: `${size * 0.5}px ${size * 0.7}px`, borderRadius: size * 0.8, borderBottomRightRadius: size * 0.2, background: s.ink, color: '#FFFFFF', fontFamily: s.body, fontSize: size, fontWeight: 600}}>
        {text}
      </div>
    </div>
  );
};

/** KI-Antwort: Wörter erscheinen nacheinander (gleichmäßiger Takt → linear). */
const KiBlase: React.FC<{words: string[]; at: number; bis: number; size?: number; markIndex?: number; markAt?: number; maxWidth?: number}> = ({words, at, bis, size = 44, markIndex, markAt, maxWidth = 860}) => {
  const s = useStil();
  const {t, federn, p} = useZeit();
  const q = federn(at - 0.15);
  const shown = Math.floor(clamp01((t - at) / Math.max(0.1, bis - at)) * words.length + 0.0001);
  const mark = markAt === undefined ? 0 : p(markAt, 0.5, 'inOut');
  return (
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 16, opacity: clamp01(q * 2), transform: `translateY(${(1 - q) * 20}px)`}}>
      <div style={{width: 70, height: 70, borderRadius: '50%', background: '#FFE4D9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
        <div style={{width: 34, height: 28, borderRadius: 10, background: s.ki}} />
      </div>
      <div
        style={{
          padding: `${size * 0.5}px ${size * 0.7}px`,
          borderRadius: size * 0.8,
          borderBottomLeftRadius: size * 0.2,
          background: s.surface,
          border: `4px solid ${s.ki}`,
          fontFamily: s.body,
          fontSize: size,
          fontWeight: 600,
          color: s.ink,
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: size * 0.26,
          maxWidth,
          minHeight: size * 1.3,
        }}
      >
        {words.map((w, i) => (
          <span key={i} style={{opacity: i < shown ? 1 : 0, position: 'relative', display: 'inline-block', color: i === markIndex && mark > 0 ? interpolateColors(mark, [0, 1], [s.ink, s.fehler]) : undefined}}>
            {w}
            {i === markIndex && mark > 0 ? (
              <svg width={1} height={1} style={{position: 'absolute', left: -18, top: -10, overflow: 'visible'}}>
                <ellipse cx={74} cy={34} rx={92} ry={44} stroke={s.fehler} strokeWidth={6} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - mark} transform="rotate(-4 74 34)" />
              </svg>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
};

/** Balkenliste für „nächstes Wort?“ – jeder Balken wächst zu seiner eigenen Zeit. */
const Balken: React.FC<{rows: {w: string; v: number; at: number}[]; pickAt?: number; versteckt?: number[]; labelW?: number; barW?: number; sichtbarAb?: number}> = ({rows, pickAt, versteckt = [], labelW = 210, barW = 300, sichtbarAb}) => {
  const s = useStil();
  const {p, t} = useZeit();
  const pick = pickAt === undefined ? 0 : p(pickAt, 0.25);
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
      {rows.map((r, i) => {
        const g = p(r.at, 0.45);
        const win = i === 0;
        const hidden = versteckt.includes(i);
        return (
          <div key={`${r.w}-${i}`} style={{display: 'flex', alignItems: 'center', gap: 18, height: 74, opacity: (win ? 1 : mix(1, 0.32, pick)) * (t >= Math.min(r.at - 0.6, sichtbarAb ?? Infinity) ? 1 : 0)}}>
            <div style={{width: labelW, fontFamily: s.head, fontSize: 46, fontWeight: 800, color: win && pick > 0 ? s.ki : s.ink, opacity: hidden ? 0 : 1, whiteSpace: 'nowrap'}}>{r.w}</div>
            <div style={{width: barW, height: 40, borderRadius: 20, background: s.line, overflow: 'hidden'}}>
              <div style={{width: `${(r.v / 70) * 100 * g}%`, height: '100%', borderRadius: 20, background: win ? s.ki : '#B9BDC6'}} />
            </div>
            <div style={{width: 90, fontFamily: s.body, fontSize: 34, fontWeight: 700, color: s.inkSoft}}>{Math.round(r.v * g)} %</div>
          </div>
        );
      })}
    </div>
  );
};

const Hinweis: React.FC<{text: string; at: number; style?: React.CSSProperties}> = ({text, at, style}) => {
  const s = useStil();
  const {p} = useZeit();
  return <div style={{fontFamily: s.body, fontSize: 28, fontWeight: 600, color: s.inkSoft, opacity: 0.85 * p(at, 0.4), ...style}}>{text}</div>;
};

/* ───────────── Station 0: Chat ───────────── */

const Station0: React.FC = () => {
  const s = useStil();
  const {p} = useZeit();
  const frage = p(5.2, 0.4);
  return (
    <>
      <Karte x={200} y={220} w={1160} h={500} delay={-20} style={{overflow: 'hidden'}}>
        <div style={{height: 64, background: '#F1F1F3', display: 'flex', alignItems: 'center', gap: 12, padding: '0 26px'}}>
          {['#FF6159', '#FFBD2E', '#28C941'].map((c) => (
            <div key={c} style={{width: 16, height: 16, borderRadius: '50%', background: c}} />
          ))}
        </div>
        <div style={{padding: '40px 50px', display: 'flex', flexDirection: 'column', gap: 34}}>
          <NutzerBlase text="Welche Farbe hat der Himmel?" at={-1} size={54} />
          <KiBlase words={'Der Himmel ist blau, weil Sonnenlicht in der Luft gestreut wird.'.split(' ')} at={2.7} bis={4.5} size={50} maxWidth={940} />
        </div>
      </Karte>
      <div
        style={{
          position: 'absolute',
          left: 1420,
          top: 220,
          fontFamily: s.head,
          fontWeight: 900,
          fontSize: 220,
          color: s.ki,
          opacity: frage,
          transform: `rotate(${mix(-30, 10, frage)}deg) scale(${mix(0.3, 1, frage)})`,
        }}
      >
        ?
      </div>
      <Notiz x={1180} y={760} text="Toki" at={7.6} farbe={s.ki} size={72} pfeil={{dx: 190, dy: -10}} />
    </>
  );
};

/* ───────────── Station 1: Tokens ───────────── */

const TOKENS = ['Wel', 'che', ' Farbe', ' hat', ' der', ' Him', 'mel', '?'];
const GANZE = [2, 3, 4];
const TEILE = [0, 1, 5, 6];

/** Satz, der in Token-Chips zerfällt. */
const TokenSatz: React.FC<{splitAt?: number; size?: number; pulsGanz?: number; pulsTeil?: number}> = ({splitAt, size = 92, pulsGanz, pulsTeil}) => {
  const s = useStil();
  const {p, t} = useZeit();
  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      {TOKENS.map((tok, i) => {
        const q = splitAt === undefined ? 1 : p(splitAt + i * 0.13, 0.5);
        const space = tok.startsWith(' ') ? size * 0.26 : 0;
        const puls =
          (pulsGanz !== undefined && GANZE.includes(i) ? Math.sin(clamp01((t - pulsGanz) / 0.6) * Math.PI) : 0) +
          (pulsTeil !== undefined && TEILE.includes(i) ? Math.sin(clamp01((t - pulsTeil) / 0.6) * Math.PI) : 0);
        return (
          <div
            key={i}
            style={{
              marginLeft: i === 0 ? 0 : mix(space, 20, q),
              fontFamily: s.head,
              fontWeight: 800,
              fontSize: size,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              padding: `${mix(0, size * 0.14, q)}px ${mix(0, size * 0.24, q)}px`,
              borderRadius: size * 0.28,
              background: interpolateColors(q, [0, 1], ['rgba(255,255,255,0)', PASTELL[i % 6]]),
              color: interpolateColors(q, [0, 1], [s.ink, PASTELL_INK[i % 6]]),
              transform: `translateY(${Math.sin(q * Math.PI) * -16}px) scale(${1 + puls * 0.1})`,
              boxShadow: puls > 0.05 ? `0 0 0 ${puls * 6}px ${s.ki}` : undefined,
            }}
          >
            {tok.trim()}
          </div>
        );
      })}
    </div>
  );
};

const Station1: React.FC = () => {
  const s = useStil();
  const {p, federn} = useZeit();
  const himmel = federn(19.0);
  const teilen = p(20.2, 0.5);
  return (
    <>
      <Karte x={140} y={330} w={1640} h={250} delay={fr(10.6)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <TokenSatz splitAt={13.6} pulsGanz={16.9} pulsTeil={17.6} size={80} />
      </Karte>
      <Notiz x={560} y={620} text="Tokens" at={15.5} farbe={s.ki} size={70} pfeil={{dx: -60, dy: -70}} />
      <div style={{position: 'absolute', left: 300, top: 760, display: 'flex', alignItems: 'center', gap: 28, opacity: clamp01(himmel * 2), transform: `translateY(${(1 - himmel) * 30}px)`}}>
        <div style={{fontFamily: s.head, fontWeight: 800, fontSize: 64, color: s.ink}}>Himmel</div>
        <Icon icon="ph:arrow-right-bold" size={52} color={s.inkSoft} animate="none" />
        <div style={{display: 'flex', gap: mix(0, 18, teilen)}}>
          <Chip text="Him" i={5} />
          <Chip text="mel" i={6} />
        </div>
        <Hinweis text="vereinfacht" at={20.4} style={{marginLeft: 10}} />
      </div>
    </>
  );
};

/* ───────────── Station 2: Zahlen + Landkarte ───────────── */

const Zahlenreihe: React.FC<{i: number; at: number}> = ({i, at}) => {
  const s = useStil();
  const {p} = useZeit();
  return (
    <div style={{position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', paddingTop: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
      {[0, 1, 2, 3, 4].map((k) => {
        const q = p(at + k * 0.08, 0.3);
        const v = random(`z-${i}-${k}`) * 2 - 1;
        return (
          <div key={k} style={{fontFamily: s.body, fontVariantNumeric: 'tabular-nums', fontSize: 38, fontWeight: 700, color: k === 0 ? PASTELL_INK[i % 6] : s.inkSoft, opacity: q * (k === 4 ? 0.5 : 1)}}>
            {k === 4 ? '…' : v.toFixed(2).replace('.', ',')}
          </div>
        );
      })}
    </div>
  );
};

const KartenPunkt: React.FC<{x: number; y: number; icon: string; text: string; at: number}> = ({x, y, icon, text, at}) => {
  const s = useStil();
  const {federn} = useZeit();
  const q = federn(at, 'bouncy');
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${Math.max(0, q)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
      <Icon icon={icon} size={92} animate="none" />
      <div style={{fontFamily: s.body, fontSize: 34, fontWeight: 800, color: s.ink, background: s.surface, padding: '4px 14px', borderRadius: 12}}>{text}</div>
    </div>
  );
};

const Station2: React.FC = () => {
  const s = useStil();
  const {p} = useZeit();
  const raus = p(29.6, 0.5);
  const karte = p(30.3, 0.6);
  const kreis = p(33.6, 0.6, 'inOut');
  const linie = p(35.1, 0.7, 'inOut');
  const koenig = {x: 690, y: 430};
  const koenigin = {x: 830, y: 500};
  const banane = {x: 1250, y: 690};
  return (
    <>
      <div style={{position: 'absolute', left: 140, top: 250, opacity: 1 - raus}}>
        <div style={{display: 'flex', gap: 22}}>
          {TOKENS.map((tok, i) => (
            <div key={i} style={{position: 'relative'}}>
              <Chip text={tok.trim()} i={i} size={72} />
              <Zahlenreihe i={i} at={23.2 + i * 0.16} />
            </div>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 140, top: 720, display: 'flex', gap: 30, opacity: (1 - raus) * p(25.2, 0.3)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 999, background: '#FDE3E4', fontFamily: s.body, fontSize: 36, fontWeight: 800, color: s.fehler}}>
          <Icon icon="ph:x-bold" size={32} color={s.fehler} animate="none" /> lesen
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 999, background: '#DDF4E8', fontFamily: s.body, fontSize: 36, fontWeight: 800, color: s.gut, opacity: p(26.8, 0.3)}}>
          <Icon icon="ph:check-bold" size={32} color={s.gut} animate="none" /> rechnen
        </div>
      </div>
      <div style={{position: 'absolute', left: 360, top: 190, width: 1100, height: 660, opacity: karte, transform: `scale(${mix(0.94, 1, karte)})`}}>
        <svg width={1100} height={660} style={{position: 'absolute', inset: 0}}>
          <Shape d={rounded(0, 0, 1100, 660, 40)} fill="#F3F8FF" seed={40} elevate />
          {Array.from({length: 10}, (_, i) => (
            <line key={`v${i}`} x1={110 * (i + 0.5)} y1={20} x2={110 * (i + 0.5)} y2={640} stroke="#E1E9F5" strokeWidth={2} />
          ))}
          {Array.from({length: 6}, (_, i) => (
            <line key={`h${i}`} x1={20} y1={110 * (i + 0.5)} x2={1080} y2={110 * (i + 0.5)} stroke="#E1E9F5" strokeWidth={2} />
          ))}
          <ellipse cx={360} cy={260} rx={260} ry={170} fill="#E3F1E6" />
          <ellipse cx={850} cy={480} rx={220} ry={140} fill="#FFF0C2" />
          <ellipse cx={420 + (kreis > 0 ? 0 : 0)} cy={275} rx={190 * kreis} ry={120 * kreis} fill="none" stroke={s.ki} strokeWidth={6} strokeDasharray="16 12" />
          <line x1={830 - 360} y1={500 - 190} x2={mix(830 - 360, banane.x - 360, linie)} y2={mix(500 - 190, banane.y - 190, linie)} stroke={s.inkSoft} strokeWidth={5} strokeDasharray="3 14" strokeLinecap="round" />
        </svg>
        <Hinweis text="Skizze" at={30.8} style={{position: 'absolute', right: 34, top: 24}} />
      </div>
      <KartenPunkt x={koenig.x} y={koenig.y} icon="fluent-emoji-flat:prince" text="König" at={32.3} />
      <KartenPunkt x={koenigin.x} y={koenigin.y} icon="fluent-emoji-flat:princess" text="Königin" at={32.9} />
      <KartenPunkt x={banane.x} y={banane.y} icon="fluent-emoji-flat:banana" text="Banane" at={34.8} />
      <Notiz x={980} y={300} text="nah beieinander" at={33.8} farbe={s.ki} size={54} />
    </>
  );
};

/* ───────────── Station 3: Training ───────────── */

const STAPEL = Array.from({length: 9}, (_, i) => ({rot: (random(`st-${i}`) - 0.5) * 10, dx: (random(`sx-${i}`) - 0.5) * 30}));
const QUELLEN = [
  {icon: 'fluent-emoji-flat:books', text: 'Bücher', at: 43.9},
  {icon: 'fluent-emoji-flat:globe-showing-europe-africa', text: 'Webseiten', at: 44.7},
  {icon: 'fluent-emoji-flat:newspaper', text: 'Artikel', at: 45.2},
];
const TOKI3: Blick = [900, BODEN];

const Station3: React.FC = () => {
  const s = useStil();
  const {t, p, federn} = useZeit();
  const fressen = t >= 41.4 && t < 46.2;
  return (
    <>
      {STAPEL.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 170 + b.dx,
            top: BODEN - 56 - i * 50,
            width: 360,
            height: 54,
            borderRadius: 10,
            background: s.surface,
            border: `3px solid ${s.line}`,
            transform: `rotate(${b.rot}deg)`,
            boxShadow: '0 4px 10px rgba(30,35,50,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 20px',
          }}
        >
          {[0.5, 0.3, 0.6].map((w, k) => (
            <div key={k} style={{height: 8, width: `${w * 100}%`, borderRadius: 4, background: s.line}} />
          ))}
        </div>
      ))}
      {fressen
        ? Array.from({length: 14}, (_, i) => {
            const zyklus = 0.7;
            const local = t - 41.5 - i * 0.18;
            if (local < 0) return null;
            const q = (local % zyklus) / zyklus;
            if (t > 46.0 && q < 0.1) return null;
            const x = mix(400, TOKI3[0], EASE.inOut(q));
            const y = mix(BODEN - 300 - (i % 4) * 60, TOKI3[1] - 120, q) - Math.sin(q * Math.PI) * 140;
            return (
              <div key={i} style={{position: 'absolute', left: x - 30, top: y - 30, opacity: Math.min(1, (1 - q) * 4), transform: `rotate(${q * 220}deg) scale(${mix(1, 0.4, q)})`}}>
                <Icon icon="ph:file-text-duotone" size={60} color={s.inkSoft} animate="none" />
              </div>
            );
          })
        : null}
      <div style={{position: 'absolute', left: 150, top: 180, display: 'flex', gap: 20}}>
        {QUELLEN.map((q) => {
          const k = federn(q.at, 'bouncy');
          return (
            <div key={q.text} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '14px 24px 14px 16px', borderRadius: 24, background: s.surface, boxShadow: '0 10px 24px rgba(30,35,50,0.08)', transform: `scale(${Math.max(0, k)})`}}>
              <Icon icon={q.icon} size={58} animate="none" />
              <div style={{fontFamily: s.body, fontSize: 36, fontWeight: 800, color: s.ink}}>{q.text}</div>
            </div>
          );
        })}
      </div>
      <Karte x={1180} y={470} w={600} delay={fr(47.3)} style={{padding: '34px 40px', display: 'flex', alignItems: 'center', gap: 20}}>
        <div style={{fontFamily: s.head, fontSize: 56, fontWeight: 800, color: s.ink, whiteSpace: 'nowrap'}}>Der Himmel ist</div>
        <div style={{width: 130, height: 90, borderRadius: 22, border: `5px dashed ${s.ki}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: s.head, fontSize: 64, fontWeight: 900, color: s.ki, opacity: 0.75 + 0.25 * Math.sin(t * 5)}}>?</div>
      </Karte>
      <Notiz x={1240} y={380} text="Welches Wort kommt als Nächstes?" at={48.0} size={46} />
      <div style={{position: 'absolute', left: TOKI3[0] + 120, top: 600, fontFamily: s.head, fontWeight: 900, fontSize: 120, color: s.ki, opacity: p(37.6, 0.3) * (1 - p(40.3, 0.3)), transform: 'rotate(12deg)'}}>?</div>
    </>
  );
};

/* ───────────── Station 4+5: Vorhersage, Token für Token ───────────── */

const SATZ_Y = 270;
const SATZ_SIZE = 52;
const SLOT_GAP = 14;
const START_TEXT_W = 440;
const SLOTS = ['blau', ',', 'weil', 'Licht', 'gestreut', 'wird.'];
const slotW = (w: string) => Math.max(70, Math.round(w.length * SATZ_SIZE * 0.58 + SATZ_SIZE * 0.6));
const slotX = (i: number) => 150 + START_TEXT_W + SLOT_GAP + SLOTS.slice(0, i).reduce((a, w) => a + slotW(w) + SLOT_GAP, 0);

type Runde = {start: number; pick: number; fly: number; rows: {w: string; v: number}[]};
const RUNDEN: Runde[] = [
  {start: 55.6, pick: 61.0, fly: 61.6, rows: [{w: 'blau', v: 62}, {w: 'grau', v: 21}, {w: 'schön', v: 9}]},
  {start: 63.0, pick: 63.75, fly: 64.0, rows: [{w: ',', v: 48}, {w: '.', v: 40}, {w: 'und', v: 7}]},
  {start: 64.9, pick: 65.4, fly: 65.5, rows: [{w: 'weil', v: 55}, {w: 'denn', v: 30}, {w: 'wenn', v: 6}]},
  {start: 66.0, pick: 66.4, fly: 66.5, rows: [{w: 'Licht', v: 44}, {w: 'Sonne', v: 39}, {w: 'die', v: 9}]},
  {start: 66.9, pick: 67.25, fly: 67.35, rows: [{w: 'gestreut', v: 51}, {w: 'gebrochen', v: 32}, {w: 'blau', v: 4}]},
  {start: 67.7, pick: 67.95, fly: 68.0, rows: [{w: 'wird.', v: 66}, {w: 'ist.', v: 14}, {w: '…', v: 5}]},
];
const BALKEN_ZEITEN0 = [57.0, 58.4, 59.4];
const FERTIG = 68.4;
const PANEL = {x: 960, y: 420};

const Station4: React.FC = () => {
  const s = useStil();
  const {t, p, federn} = useZeit();
  const rundeIdx = RUNDEN.reduce((acc, r, i) => (t >= r.start - 0.2 ? i : acc), 0);
  const runde = RUNDEN[rundeIdx];
  const panelIn = p(53.4, 0.5);
  const panelOut = p(FERTIG + 0.2, 0.4);
  const rows = runde.rows.map((r, i) => ({...r, at: rundeIdx === 0 ? BALKEN_ZEITEN0[i] : runde.start + i * 0.07}));
  const chatIn = p(68.8, 0.3);
  return (
    <>
      <div style={{position: 'absolute', left: 150, top: SATZ_Y, height: 96, display: 'flex', alignItems: 'center', fontFamily: s.head, fontSize: SATZ_SIZE, fontWeight: 800, color: s.ink, letterSpacing: '-0.02em'}}>
        Der Himmel ist
      </div>
      {SLOTS.map((w, i) => {
        const r = RUNDEN[i];
        const sichtbar = p(r.start - 0.3, 0.25);
        const fly = p(r.fly, i === 0 ? 0.6 : 0.3, 'inOut');
        const landed = t >= r.fly + (i === 0 ? 0.6 : 0.3);
        const bump = landed ? 1 - spring({frame: frDauer(t - r.fly - (i === 0 ? 0.6 : 0.3)), fps: FPS, config: {damping: 9, stiffness: 200, mass: 0.5}}) : 0;
        const sx = slotX(i);
        const fromX = PANEL.x + 40 - sx;
        const fromY = PANEL.y + 120 - SATZ_Y;
        return (
          <div key={w + i} style={{position: 'absolute', left: sx, top: SATZ_Y, width: slotW(w), height: 96, opacity: sichtbar}}>
            {!landed ? (
              <div style={{position: 'absolute', inset: 0, borderRadius: 22, border: `4px dashed ${s.ki}`, opacity: 1 - fly}} />
            ) : null}
            {t >= r.fly ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: landed ? `scale(${1 + bump * 0.18}, ${1 - bump * 0.18})` : `translate(${mix(fromX, 0, fly)}px, ${mix(fromY, 0, fly) - Math.sin(fly * Math.PI) * 120}px)`,
                }}
              >
                <Chip text={w} i={i} size={SATZ_SIZE} style={{width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0}} />
              </div>
            ) : null}
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: slotX(SLOTS.length) + 6,
          top: SATZ_Y + 6,
          width: 84,
          height: 84,
          borderRadius: '50%',
          background: s.gut,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${Math.max(0, federn(FERTIG, 'bouncy'))})`,
        }}
      >
        <Icon icon="ph:check-bold" size={52} color="#FFFFFF" animate="none" />
      </div>
      <Karte x={PANEL.x} y={PANEL.y} w={820} delay={fr(53.4)} style={{padding: '30px 40px', opacity: panelIn * (1 - panelOut)}}>
        <div style={{fontFamily: s.body, fontSize: 32, fontWeight: 700, color: s.inkSoft, marginBottom: 12}}>
          nächstes Wort? {rundeIdx > 0 ? <span style={{color: s.ki}}>· Runde {rundeIdx + 1}</span> : null}
        </div>
        <Balken key={rundeIdx} rows={rows} pickAt={runde.pick} versteckt={t >= runde.fly ? [0] : []} labelW={240} barW={290} sichtbarAb={rundeIdx === 0 ? 54.2 : undefined} />
        <Hinweis text="Beispielwerte" at={57.2} style={{marginTop: 8}} />
      </Karte>
      <div style={{position: 'absolute', left: PANEL.x, top: PANEL.y + 60, opacity: chatIn}}>
        <KiBlase words={'Der Himmel ist blau, weil Licht gestreut wird.'.split(' ')} at={68.9} bis={70.6} size={42} maxWidth={760} />
      </div>
    </>
  );
};

/* ───────────── Station 6: Halluzination ───────────── */

const Station6: React.FC = () => {
  const s = useStil();
  const {p, federn} = useZeit();
  const panel = p(76.6, 0.4) * (1 - p(80.4, 0.4));
  const mess = p(83.0, 0.7, 'inOut');
  const label = federn(83.5);
  const fehler = federn(81.3, 'bouncy');
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <path d={`M1140,${BODEN} L1500,250 L1860,${BODEN} Z`} fill="#CFDAEA" />
        <path d={`M1500,250 L1860,${BODEN} L1600,${BODEN} Z`} fill="#BCCADF" />
        <path d="M1500,250 L1590,370 L1550,350 L1515,390 L1480,352 L1440,372 Z" fill="#FFFFFF" />
        <path d={`M1220,${BODEN} L1380,640 L1540,${BODEN} Z`} fill="#DCE5F1" />
        <line x1={1500} y1={250} x2={1500} y2={mix(250, BODEN, mess)} stroke={s.gut} strokeWidth={6} strokeDasharray="14 10" opacity={mess > 0 ? 1 : 0} />
        <line x1={1470} y1={250} x2={1530} y2={250} stroke={s.gut} strokeWidth={6} opacity={mess > 0 ? 1 : 0} />
      </svg>
      <div style={{position: 'absolute', left: 1560, top: 520, transform: `scale(${Math.max(0, label)})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 22px', borderRadius: 999, background: '#DDF4E8', fontFamily: s.body, fontSize: 34, fontWeight: 800, color: s.gut}}>
        <Icon icon="ph:check-bold" size={30} color={s.gut} animate="none" /> rund 8.849 m
      </div>
      <div style={{position: 'absolute', left: 150, top: 190, width: 980, display: 'flex', flexDirection: 'column', gap: 26}}>
        <NutzerBlase text="Wie hoch ist der Mount Everest?" at={72.6} size={42} />
        <KiBlase words={'Der Mount Everest ist 9.214 Meter hoch.'.split(' ')} at={74.0} bis={75.4} size={42} markIndex={4} markAt={80.8} />
      </div>
      <div style={{position: 'absolute', left: 520, top: 480, transform: `scale(${Math.max(0, fehler)})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 22px', borderRadius: 999, background: '#FDE3E4', fontFamily: s.body, fontSize: 34, fontWeight: 800, color: s.fehler}}>
        <Icon icon="ph:x-bold" size={30} color={s.fehler} animate="none" /> erfunden
      </div>
      <Karte x={160} y={590} w={640} delay={fr(76.6)} style={{padding: '24px 32px', opacity: panel}}>
        <div style={{fontFamily: s.body, fontSize: 30, fontWeight: 700, color: s.inkSoft, marginBottom: 6}}>nächste Zahl?</div>
        <Balken
          rows={[
            {w: '9.214', v: 25, at: 77.0},
            {w: '8.611', v: 24, at: 77.15},
            {w: '8.849', v: 23, at: 77.3},
          ]}
          pickAt={79.5}
          labelW={170}
          barW={240}
        />
        <Hinweis text="Beispielwerte · alle fast gleich unsicher" at={77.8} style={{marginTop: 4}} />
      </Karte>
      <div style={{position: 'absolute', left: 160, top: 640, opacity: p(84.6, 0.3)}}>
        <Scramble text="Halluzination" delay={fr(84.6)} duration={22} size={96} font="heading" color={s.fehler} seed="hallu" />
      </div>
    </>
  );
};

/* ───────────── Station 7: Merksatz ───────────── */

const Station7: React.FC = () => {
  const s = useStil();
  const {p} = useZeit();
  const kreuz = p(92.6, 0.5, 'inOut');
  const glow = p(95.0, 0.5);
  return (
    <>
      <Karte x={120} y={260} w={600} h={520} delay={fr(91.2)} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, opacity: mix(1, 0.5, kreuz)}}>
        <Icon icon="fluent-emoji-flat:books" size={170} animate="none" />
        <div style={{fontFamily: s.head, fontSize: 60, fontWeight: 800, color: s.ink}}>Lexikon</div>
        <div style={{fontFamily: s.body, fontSize: 36, fontWeight: 600, color: s.inkSoft}}>schlägt Fakten nach</div>
      </Karte>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={170} y1={300} x2={mix(170, 670, kreuz)} y2={mix(300, 740, kreuz)} stroke={s.fehler} strokeWidth={14} strokeLinecap="round" opacity={kreuz > 0 ? 1 : 0} />
      </svg>
      <Karte
        x={800}
        y={260}
        w={600}
        h={520}
        delay={fr(93.7)}
        style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, boxShadow: glow > 0 ? `0 0 0 ${glow * 6}px ${s.gut}, 0 24px 50px rgba(30,35,50,0.10)` : undefined}}
      >
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 14, height: 170}}>
          {[0.95, 0.35, 0.15].map((h, i) => (
            <div key={i} style={{width: 54, height: 160 * h * p(93.9 + i * 0.12, 0.4), borderRadius: 14, background: i === 0 ? s.ki : '#C9CDD5'}} />
          ))}
        </div>
        <div style={{fontFamily: s.head, fontSize: 60, fontWeight: 800, color: s.ink}}>Vorhersager</div>
        <div style={{fontFamily: s.body, fontSize: 36, fontWeight: 600, color: s.inkSoft}}>für das nächste Wort</div>
      </Karte>
    </>
  );
};

/* ───────────── Station 8: Tipp + Abschluss ───────────── */

const Station8: React.FC = () => {
  const s = useStil();
  const {t, p, federn} = useZeit();
  const raus = p(107.2, 0.5);
  const knopf = federn(104.0, 'bouncy');
  const ring = t > 104.4 ? (((t - 104.4) % 1.2) + 1.2) % 1.2 / 1.2 : 0;
  const danke = p(108.7, 0.6);
  const punkte = [107.6 + 0.28, 107.6 + 0.42, 107.6 + 0.56];
  return (
    <>
      <Karte x={180} y={240} w={880} delay={fr(98.3)} style={{padding: '40px 48px', opacity: 1 - raus}}>
        <div style={{fontFamily: s.head, fontSize: 58, fontWeight: 800, color: s.ink, letterSpacing: '-0.03em'}}>Wichtiges selbst prüfen</div>
        <div style={{marginTop: 26, display: 'flex', flexDirection: 'column', gap: 18}}>
          {[
            {text: 'Quelle ansehen', at: 100.0},
            {text: 'Zahlen nachprüfen', at: 100.9},
          ].map((item) => {
            const q = federn(item.at);
            return (
              <div key={item.text} style={{display: 'flex', alignItems: 'center', gap: 18, opacity: clamp01(q * 2), transform: `translateX(${(1 - q) * -20}px)`}}>
                <div style={{width: 52, height: 52, borderRadius: '50%', background: s.gut, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Icon icon="ph:check-bold" size={32} color="#FFFFFF" animate="none" />
                </div>
                <div style={{fontFamily: s.body, fontSize: 42, fontWeight: 600, color: s.ink}}>{item.text}</div>
              </div>
            );
          })}
        </div>
      </Karte>
      <div style={{position: 'absolute', left: 430, top: 660, opacity: 1 - raus, transform: `scale(${Math.max(0, knopf)})`}}>
        {ring > 0 ? <div style={{position: 'absolute', inset: -8, borderRadius: 999, border: `5px solid ${s.ki}`, opacity: 1 - ring, transform: `scale(${1 + ring * 0.25})`}} /> : null}
        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '24px 48px', borderRadius: 999, background: s.ki, color: '#FFFFFF', fontFamily: s.head, fontSize: 52, fontWeight: 800, boxShadow: '0 16px 30px rgba(255,122,89,0.35)'}}>
          <Icon icon="ph:bell-ringing-fill" size={48} color="#FFFFFF" animate="none" />
          Abonnieren
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', gap: 34}}>
        {[SERIEN.news.farbe, SERIEN.test.farbe, SERIEN.erklaert.farbe].map((c, i) => {
          const q = federn(punkte[i], 'bouncy');
          return <div key={c} style={{width: 64, height: 64, borderRadius: '50%', background: c, transform: `scale(${Math.max(0, q)})`}} />;
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center', fontFamily: s.head, fontSize: 80, fontWeight: 800, letterSpacing: '-0.035em', color: s.ink, opacity: danke, transform: `translateY(${(1 - danke) * 20}px)`}}>
        Danke fürs Zuschauen!
      </div>
    </>
  );
};

const STATIONEN = [Station0, Station1, Station2, Station3, Station4, Station6, Station7, Station8];

/* ───────────── Toki: Weg und Ausdruck ───────────── */

/** Bildschirm-x von Toki je Station (Kamera folgt der Welt, Toki läuft mit). */
const TOKI_HOME = [1580, 1640, 1660, TOKI3[0], 470, 1080, 1640, 1520];
const TOKI_K = 1.3;

type TokiZustand = {gesicht: Gesicht; armL?: number; armR?: number; look?: Blick; smile?: number; mouthO?: number};

const tokiAusdruck = (t: number): TokiZustand => {
  const wink = 140 + 22 * Math.sin(t * 9.5);
  if (t < 7.4) return {gesicht: 'freude', armL: 150, armR: 150};
  if (t < 8.5) return {gesicht: 'neutral', smile: 0.9, armR: wink, look: [-0.6, -0.3]};
  if (t < 9.8) return {gesicht: 'neutral', smile: 0.9, armR: 95, look: [1, -0.2]};
  if (t < 11.0) return {gesicht: 'neutral', smile: 0.7, look: [1, 0]};
  // Station 1
  if (t < 13.4) return {gesicht: 'neutral', look: [-1, -0.4]};
  if (t < 14.6) return {gesicht: 'denken', look: [-0.8, -0.8]};
  if (t < 16.4) return {gesicht: 'staunen', armL: 65, armR: 65, look: [-0.9, -0.5]};
  if (t < 18.9) return {gesicht: 'neutral', smile: 0.6, look: [-1, -0.4]};
  if (t < 21.0) return {gesicht: 'neutral', smile: 0.9, armL: 95, look: [-1, 0.2]};
  if (t < 22.1) return {gesicht: 'neutral', smile: 0.7, look: [1, 0]};
  // Station 2
  if (t < 25.1) return {gesicht: 'staunen', look: [-1, -0.6]};
  if (t < 27.8) return {gesicht: 'denken'};
  if (t < 32.2) return {gesicht: 'neutral', smile: 0.6, look: [-1, -0.3]};
  if (t < 34.7) return {gesicht: 'freude', armL: 120, armR: 30};
  if (t < 36.4) return {gesicht: 'verwirrt', armL: 150, look: [-1, 0]};
  if (t < 37.5) return {gesicht: 'neutral', look: [1, 0]};
  // Station 3
  if (t < 40.4) return {gesicht: 'verwirrt', armL: 150};
  if (t < 41.4) return {gesicht: 'neutral', look: [-1, -0.3]};
  if (t < 46.2) return {gesicht: 'staunen', mouthO: 0.5 + 0.4 * Math.abs(Math.sin(t * 7)), armL: 60, look: [-1, -0.4]};
  if (t < 50.3) return {gesicht: 'denken', look: [1, -0.3]};
  if (t < 51.4) return {gesicht: 'neutral', look: [1, 0]};
  // Station 4/5
  if (t < 56.9) return {gesicht: 'denken', look: [0.9, -0.7]};
  if (t < 58.3) return {gesicht: 'staunen', look: [0.9, -0.5]};
  if (t < 60.9) return {gesicht: 'neutral', smile: 0.6, look: [0.9, -0.5]};
  if (t < 62.6) return {gesicht: 'freude', armL: 150, armR: 150};
  if (t < FERTIG) return {gesicht: 'neutral', smile: 0.7, look: [0.2, -1], armR: 60};
  if (t < 69.8) return {gesicht: 'freude', armL: 160, armR: 160};
  if (t < 71.4) return {gesicht: 'neutral', smile: 0.8, look: [1, -0.3]};
  if (t < 72.5) return {gesicht: 'neutral', look: [1, 0]};
  // Station 6
  if (t < 76.6) return {gesicht: 'freude'};
  if (t < 80.6) return {gesicht: 'denken', look: [-0.9, -0.4]};
  if (t < 84.5) return {gesicht: 'staunen', armL: 65, armR: 65, look: [-0.6, -0.8]};
  if (t < 86.0) return {gesicht: 'traurig'};
  if (t < 90.0) return {gesicht: 'verwirrt', armL: 75, armR: 75};
  if (t < 91.0) return {gesicht: 'neutral', look: [1, 0]};
  // Station 7
  if (t < 93.6) return {gesicht: 'ernst', look: [-1, -0.2]};
  if (t < 94.9) return {gesicht: 'neutral', smile: 0.8, look: [-1, -0.2]};
  if (t < 97.2) return {gesicht: 'freude', armL: 160, armR: 160};
  if (t < 98.2) return {gesicht: 'neutral', look: [1, 0]};
  // Station 8
  if (t < 101.4) return {gesicht: 'denken', armR: 70, look: [-0.8, -0.6]};
  if (t < 103.9) return {gesicht: 'neutral', smile: 0.8, look: [-0.6, -0.2]};
  if (t < 104.7) return {gesicht: 'neutral', smile: 0.9, armL: 95, look: [-1, 0.2]};
  if (t < 107.6) return {gesicht: 'neutral', smile: 0.9, armR: wink};
  if (t < 108.1) return {gesicht: 'neutral', smile: 0.8};
  return {gesicht: 'freude', armL: 160, armR: 160};
};

const TokiFigur: React.FC = () => {
  const {t, frame} = useZeit();
  const {fps} = useVideoConfig();
  if (t < 6.9) return null;

  // Grundposition: zwischen den Stationen mitlaufen (hüpfen), sonst stehen.
  let x = TOKI_HOME[0];
  let hop = 0;
  for (const f of FAHRTEN) {
    if (t >= f.bis) x = TOKI_HOME[f.nach];
    else if (t > f.von) {
      const q = (t - f.von) / (f.bis - f.von);
      x = mix(x, TOKI_HOME[f.nach], EASE.inOut(q));
      hop = Math.abs(Math.sin(q * Math.PI * 3)) * 70;
      break;
    }
  }
  // Schluss: in die Mitte hüpfen
  if (t >= 107.6) {
    const q = clamp01((t - 107.6) / 0.6);
    x = mix(TOKI_HOME[7], 960, EASE.inOut(q));
    hop = Math.sin(q * Math.PI) * 120;
  }
  // Auftritt: von unten hineinspringen
  const auftritt = clamp01((t - 6.9) / 0.45);
  const landen = t >= 7.35 ? 1 - spring({frame: frame - fr(7.35), fps, config: {damping: 9, stiffness: 180, mass: 0.6}}) : 0;
  const yAuftritt = t < 7.35 ? (1 - auftritt) * 300 - Math.sin(auftritt * Math.PI) * 140 : 0;
  const jubelHop = t >= 108.3 ? Math.abs(Math.sin((t - 108.3) * 5)) * 40 * Math.max(0, 1 - (t - 108.3) / 3) : 0;

  const z = tokiAusdruck(t);
  return (
    <>
      <Toki
        x={x}
        y={BODEN + yAuftritt - hop - jubelHop}
        k={TOKI_K * mix(0.5, 1, auftritt)}
        sx={1 + landen * 0.16}
        sy={1 - landen * 0.2}
        gesicht={z.gesicht}
        armL={z.armL}
        armR={z.armR}
        look={z.look}
        smile={z.smile}
        mouthO={z.mouthO}
      />
      {t >= 98.2 && t < 101.4 ? (
        <div style={{position: 'absolute', left: x + 120, top: BODEN - 300, transform: `rotate(-12deg) scale(${clamp01((t - 98.2) / 0.3)})`}}>
          <Icon icon="fluent-emoji-flat:magnifying-glass-tilted-left" size={130} animate="none" />
        </div>
      ) : null}
    </>
  );
};

/* ───────────── Töne ───────────── */

const TOENE: [number, SfxName, number][] = [
  [0.1, 'kPop', 0.3],
  [2.7, 'kPop', 0.35],
  [5.2, 'kPop', 0.4],
  [6.9, 'kSprung', 0.45],
  [7.35, 'kLanden', 0.5],
  [9.55, 'kHallo', 0.5],
  ...FAHRTEN.map((f) => [f.von, 'kWhoosh', 0.4] as [number, SfxName, number]),
  ...TOKENS.map((_, i) => [13.6 + i * 0.13, (['kTick1', 'kTick2', 'kTick3', 'kTick4', 'kTick5', 'kTick6', 'kTick6', 'kTick6'] as SfxName[])[i], 0.35] as [number, SfxName, number]),
  [15.5, 'kPop', 0.35],
  [19.0, 'kPop', 0.35],
  [20.2, 'kSwish', 0.35],
  ...TOKENS.map((_, i) => [23.2 + i * 0.16, 'kTipp', 0.3] as [number, SfxName, number]),
  [30.3, 'kPop', 0.35],
  [32.3, 'kTick3', 0.4],
  [32.9, 'kTick5', 0.4],
  [33.7, 'kDing', 0.3],
  [34.8, 'kPop', 0.4],
  [36.35, 'kHmm', 0.5],
  [41.5, 'kWhoosh', 0.3],
  [43.9, 'kTick1', 0.4],
  [44.7, 'kTick3', 0.4],
  [45.2, 'kTick5', 0.4],
  [47.3, 'kPop', 0.4],
  [57.0, 'kTick5', 0.4],
  [58.4, 'kTick3', 0.4],
  [59.4, 'kTick1', 0.4],
  ...RUNDEN.map((r) => [r.pick, 'kDing', 0.25] as [number, SfxName, number]),
  ...RUNDEN.map((r, i) => [r.fly + (i === 0 ? 0.6 : 0.3), (['kTick1', 'kTick2', 'kTick3', 'kTick4', 'kTick5', 'kTick6'] as SfxName[])[i], 0.4] as [number, SfxName, number]),
  [61.6, 'kSwish', 0.35],
  [FERTIG, 'kErfolg', 0.4],
  [68.9, 'kPop', 0.3],
  [71.45, 'kYay', 0.5],
  [72.6, 'kPop', 0.3],
  [74.0, 'kPop', 0.3],
  [76.8, 'kTick', 0.35],
  [79.5, 'kTipp', 0.4],
  [80.9, 'kFalsch', 0.4],
  [83.5, 'kPop', 0.35],
  [84.6, 'kAnstieg', 0.25],
  [90.05, 'kHuch', 0.5],
  [91.2, 'kPop', 0.35],
  [92.6, 'kFalsch', 0.3],
  [93.7, 'kPop', 0.35],
  [95.0, 'kDing', 0.3],
  [97.2, 'kYay', 0.5],
  [100.0, 'kTick3', 0.4],
  [100.9, 'kTick5', 0.4],
  [104.0, 'kPop', 0.45],
  [106.95, 'kHallo', 0.45],
  [107.6, 'kLogo', 0.65],
  [108.4, 'kYay', 0.45],
];

/* ───────────── Video ───────────── */

const Inhalt: React.FC = () => {
  const {t} = useZeit();
  const pos = stationAt(t);
  const camX = -pos * W;
  return (
    <AbsoluteFill>
      <Hinten camX={camX} />
      <div style={{position: 'absolute', left: camX, top: 0}}>
        {STATIONEN.map((Station, i) =>
          Math.abs(pos - i) < 1.05 ? (
            <div key={i} style={{position: 'absolute', left: i * W, top: 0, width: 1920, height: 1080}}>
              <Station />
            </div>
          ) : null,
        )}
      </div>
      <TokiFigur />
      <KapitelSchild />
      {TOENE.map(([at, name, vol], i) => (
        <Sfx key={i} name={name} at={fr(at)} volume={vol} />
      ))}
      <Audio src={staticFile(VOICEOVER)} />
      <Music src={MUSIK} loop={false} volume={0.55} duckTo={0.5} captions={untertitel} />
    </AbsoluteFill>
  );
};

const Video: React.FC = () => (
  <StilContext.Provider value={KANAL}>
    <Inhalt />
  </StilContext.Provider>
);

export const projekt: Project = {
  id: 'Wie-Denkt-Ki',
  component: Video,
  format: 'landscape',
  durationInFrames: Math.round(DAUER * FPS),
};

