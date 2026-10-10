import React from 'react';
import {AbsoluteFill, Audio, interpolateColors, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, EASE, Icon, mix, Music, pop, progress, Sfx, type SfxName} from '../../kit';
import type {Project} from '../types';
import {Karte, Stempel} from '../kanal-look/Serien';
import {KANAL, SERIEN, StilContext, Toki, useStil, type Blick, type Gesicht} from '../kanal-look/stil';
import piperZeiten from './absaetze-piper.json';
import zeitAnker from './zeitanker.json';
import piperWoerter from './untertitel-piper.json';
import untertitel from './untertitel.json';

/**
 * „Warum KI lügt – und wie du es merkst“ – zweites Kanal-Video (Serie KI erklärt).
 * Eine durchgehende Welt mit 15 Stationen, Kamera fährt mit, Toki führt.
 *
 * Zeitraster: Alle Zeiten sind in „Raster-Sekunden“ geschrieben (geschätztes Sprechtempo,
 * absaetze-piper.json / untertitel-piper.json – nur Zeiten, keine Stimme im Video).
 * Sobald Armans Aufnahme da ist (absaetze.json neu), wird jede Zeit absatzweise umgerechnet.
 */

const FPS = 30;
const ENDSCREEN = 16;
const ENDE_RASTER = piperZeiten[piperZeiten.length - 1].ende + ENDSCREEN;

/** Wortgenaue Zuordnung Raster-Zeit → Armans Aufnahme (aus dem Abgleich beider Wortlisten). */
const ANKER: [number, number][] = (() => {
  const a = (zeitAnker as [number, number][]).map(([x, y]) => [x, y] as [number, number]);
  const [lp, ln] = a[a.length - 1];
  a.push([ENDE_RASTER, ln + (ENDE_RASTER - lp)]);
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
const echt = (sec: number) => umrechnen(sec, 0, 1);
const rasterZeit = (sec: number) => umrechnen(sec, 1, 0);
const DAUER = echt(ENDE_RASTER);

/** Phase 2: Armans Aufnahme hier eintragen, z. B. 'projekte/warum-ki-luegt/voiceover.wav'. */
const VOICEOVER: string | null = 'projekte/warum-ki-luegt/voiceover.wav';
/** Arman will keine Musik (2026-10-10). Bei Bedarf: 'projekte/warum-ki-luegt/musik.wav'. */
const MUSIK: string | null = null;

const fr = (sec: number) => Math.round(echt(sec) * FPS);
const frDauer = (sec: number) => Math.round(sec * FPS);

/* ───────────── Zeitpunkte aus dem Skript ───────────── */

const P = (n: number) => piperZeiten[n - 1].start;
const E = (n: number) => piperZeiten[n - 1].ende;
const norm = (w: string) => w.toLowerCase().replace(/[^a-zäöüß0-9]/g, '');
/** Zeitpunkt des k-ten Worts (Anfang) in Absatz n. */
const c = (n: number, wort: string, k = 1): number => {
  const von = P(n) - 1.2;
  const bis = E(n) + 0.6;
  const w = norm(wort);
  let gefunden = 0;
  for (const x of piperWoerter) {
    const t = x.startMs / 1000;
    if (t < von || t > bis) continue;
    if (norm(x.text).startsWith(w) && ++gefunden === k) return t;
  }
  throw new Error(`Wort „${wort}“ (${k}.) nicht in Absatz ${n} gefunden`);
};

const useZeit = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = rasterZeit(frame / FPS);
  return {
    frame,
    t,
    p: (start: number, dauer = 0.4, ease: keyof typeof EASE = 'out') => progress(frame, fr(start), Math.max(1, frDauer(dauer)), ease),
    federn: (start: number, art: 'snappy' | 'smooth' | 'bouncy' = 'snappy') => pop(frame, fps, fr(start), art),
  };
};

const GELB = SERIEN.erklaert.farbe;
const GELB_TINT = SERIEN.erklaert.tint;
const GELB_INK = '#8A6400';
const ROT_TINT = '#FDE3E4';
const GRUEN_TINT = '#DDF4E9';

/* ───────────── Stationen und Kamera ───────────── */

const W = 2400;
const BODEN = 935;

/** Station → erster Absatz. */
const STATION_AB = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 19];

const FAHRTEN = STATION_AB.slice(1).map((n, i) => ({von: E(n - 1) + 0.05, bis: P(n) + 0.55, nach: i + 1}));

const stationAt = (t: number) => {
  let pos = 0;
  for (const f of FAHRTEN) {
    if (t >= f.bis) pos = f.nach;
    else if (t > f.von) return mix(pos, f.nach, EASE.inOut((t - f.von) / (f.bis - f.von)));
  }
  return pos;
};

/* ───────────── Kapitel-Schild ───────────── */

type Kap = {t: number; text: string; rot?: boolean};
const KAPITEL: Kap[] = [
  {t: 0, text: 'Echter Fall · 2023', rot: true},
  {t: P(2), text: 'KI erklärt'},
  {t: P(3), text: 'Rückblick'},
  {t: P(4), text: 'Grund 1'},
  {t: P(5), text: 'Grund 2'},
  {t: P(6), text: 'Grund 3'},
  {t: P(7), text: 'Grund 4'},
  {t: P(8), text: 'Selbsttest'},
  {t: P(9), text: 'Echter Fall · 2023', rot: true},
  {t: P(10), text: 'Echter Fall · 2024', rot: true},
  {t: P(11), text: 'Vorsicht'},
  {t: P(12), text: 'Wird es besser?'},
  {t: P(13), text: 'Falle', rot: true},
  {t: P(14), text: '5 Regeln'},
  {t: P(19), text: 'Merksatz'},
];

const KapitelSchild: React.FC = () => {
  const s = useStil();
  const {t, federn} = useZeit();
  const k = [...KAPITEL].reverse().find((x) => t >= x.t) ?? KAPITEL[0];
  const q = federn(k.t);
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        top: 64,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 26px 12px 20px',
        borderRadius: 999,
        background: k.rot ? ROT_TINT : GELB_TINT,
        fontFamily: s.body,
        fontSize: 30,
        fontWeight: 800,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: k.rot ? s.fehler : GELB_INK,
        transform: `scale(${mix(0.85, 1, clamp01(q))})`,
        transformOrigin: 'left center',
        boxShadow: '0 6px 16px rgba(30,35,50,0.06)',
      }}
    >
      <div style={{width: 16, height: 16, borderRadius: '50%', background: k.rot ? s.fehler : GELB}} />
      {k.text}
    </div>
  );
};

/* ───────────── Welt ───────────── */

const WOLKEN = Array.from({length: 30}, (_, i) => ({
  x: i * 560 + random(`w-x-${i}`) * 300,
  y: random(`w-y-${i}`) > 0.5 ? -260 + random(`w-yy-${i}`) * 160 : 640 + random(`w-yy-${i}`) * 160,
  r: 260 + random(`w-r-${i}`) * 220,
  c: [SERIEN.erklaert.tint2, SERIEN.news.tint2, SERIEN.recht.tint2, SERIEN.test.tint2][i % 4],
}));
const STEINE = Array.from({length: 160}, (_, i) => ({x: i * 230 + random(`s-${i}`) * 120, w: 30 + random(`sw-${i}`) * 60, y: 968 + random(`sy-${i}`) * 50}));

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

/** Überschrift einer Station, Wort für Wort. */
const Kopf: React.FC<{text: string; at: number; mark?: string[]; markFarbe?: string; top?: number; size?: number}> = ({text, at, mark = [], markFarbe, top = 150, size = 70}) => {
  const s = useStil();
  const {p} = useZeit();
  return (
    <div style={{position: 'absolute', left: 120, top, fontFamily: s.head, fontWeight: 800, fontSize: size, letterSpacing: '-0.035em', color: s.ink, whiteSpace: 'nowrap'}}>
      {text.split(' ').map((w, i) => {
        const q = p(at + i * 0.07, 0.45);
        return (
          <span key={i} style={{display: 'inline-block', marginRight: '0.24em', opacity: q, transform: `translateY(${(1 - q) * 24}px)`, color: mark.includes(w) ? markFarbe ?? GELB_INK : undefined}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Einblenden mit Feder. */
const Auf: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number; art?: 'snappy' | 'smooth' | 'bouncy'; aus?: number}> = ({at, children, style, dy = 26, art = 'smooth', aus}) => {
  const {federn, p} = useZeit();
  const q = federn(at, art);
  const weg = aus === undefined ? 0 : p(aus, 0.35, 'in');
  return <div style={{position: 'absolute', opacity: clamp01(q * 1.6) * (1 - weg), transform: `translateY(${(1 - q) * dy}px) scale(${mix(0.96, 1, clamp01(q))})`, ...style}}>{children}</div>;
};

const Kachel: React.FC<{icon: string; farbe: string; tint: string; size?: number}> = ({icon, farbe, tint, size = 76}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.29, background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
    <Icon icon={icon} size={size * 0.58} color={farbe} animate="none" />
  </div>
);

const Rund: React.FC<{gut: boolean; size?: number; q?: number}> = ({gut, size = 54, q = 1}) => {
  const s = useStil();
  return (
    <div style={{width: size, height: size, borderRadius: '50%', background: gut ? s.gut : s.fehler, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: `scale(${Math.max(0, q)})`}}>
      <Icon icon={gut ? 'ph:check-bold' : 'ph:x-bold'} size={size * 0.6} color="#FFFFFF" animate="none" />
    </div>
  );
};

/** Handschriftliche Notiz. */
const Notiz: React.FC<{x: number; y: number; text: string; at: number; farbe?: string; size?: number; rot?: number}> = ({x, y, text, at, farbe = KANAL.inkSoft, size = 58, rot = -4}) => {
  const {p} = useZeit();
  const q = p(at, 0.35);
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: q, fontFamily: 'Caveat, cursive', fontWeight: 700, fontSize: size, color: farbe, transform: `rotate(${rot}deg) translateY(${(1 - q) * 10}px)`, whiteSpace: 'nowrap'}}>{text}</div>
  );
};

const NutzerBlase: React.FC<{text: string; at: number; size?: number}> = ({text, at, size = 40}) => {
  const s = useStil();
  const {federn} = useZeit();
  const q = federn(at);
  return (
    <div style={{display: 'flex', justifyContent: 'flex-end', opacity: clamp01(q * 2), transform: `translateY(${(1 - q) * 20}px) scale(${mix(0.9, 1, clamp01(q))})`, transformOrigin: 'right bottom'}}>
      <div style={{padding: `${size * 0.45}px ${size * 0.7}px`, borderRadius: size * 0.8, borderBottomRightRadius: size * 0.2, background: s.ink, color: '#FFFFFF', fontFamily: s.body, fontSize: size, fontWeight: 600, maxWidth: 760}}>{text}</div>
    </div>
  );
};

/** KI-Antwort, Wörter erscheinen im gleichmäßigen Takt. */
const KiBlase: React.FC<{text: string; at: number; bis: number; size?: number; maxWidth?: number; fehlerAb?: number; markiert?: number}> = ({text, at, bis, size = 40, maxWidth = 820, fehlerAb, markiert}) => {
  const s = useStil();
  const {t, federn, p} = useZeit();
  const words = text.split(' ');
  const q = federn(at - 0.15);
  const shown = Math.floor(clamp01((t - at) / Math.max(0.1, bis - at)) * words.length + 0.0001);
  const rot = markiert === undefined ? 0 : p(markiert, 0.5);
  return (
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 16, opacity: clamp01(q * 2), transform: `translateY(${(1 - q) * 20}px)`}}>
      <div style={{width: 64, height: 64, borderRadius: '50%', background: '#FFE4D9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
        <div style={{width: 30, height: 25, borderRadius: 9, background: s.ki}} />
      </div>
      <div
        style={{
          padding: `${size * 0.45}px ${size * 0.7}px`,
          borderRadius: size * 0.8,
          borderBottomLeftRadius: size * 0.2,
          background: s.surface,
          border: `4px solid ${interpolateColors(rot, [0, 1], [s.ki, s.fehler])}`,
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
          <span key={i} style={{opacity: i < shown ? 1 : 0, color: fehlerAb !== undefined && i >= fehlerAb && rot > 0 ? interpolateColors(rot, [0, 1], [s.ink, s.fehler]) : undefined}}>
            {w}
          </span>
        ))}
      </div>
    </div>
  );
};

/** Balken für „nächstes Wort?“. */
const Balken: React.FC<{rows: {w: string; v: number; at: number}[]; pickAt?: number; max?: number; labelW?: number; barW?: number; grau?: boolean}> = ({rows, pickAt, max = 70, labelW = 210, barW = 320, grau}) => {
  const s = useStil();
  const {p, t} = useZeit();
  const pick = pickAt === undefined ? 0 : p(pickAt, 0.25);
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
      {rows.map((r, i) => {
        const g = p(r.at, 0.45);
        const win = i === 0;
        return (
          <div key={`${r.w}-${i}`} style={{display: 'flex', alignItems: 'center', gap: 18, height: 70, opacity: (win ? 1 : mix(1, 0.32, pick)) * (t >= r.at - 0.5 ? 1 : 0)}}>
            <div style={{width: labelW, fontFamily: s.head, fontSize: 44, fontWeight: 800, color: win && pick > 0 ? s.ki : s.ink, whiteSpace: 'nowrap'}}>{r.w}</div>
            <div style={{width: barW, height: 38, borderRadius: 19, background: s.line, overflow: 'hidden'}}>
              <div style={{width: `${(r.v / max) * 100 * g}%`, height: '100%', borderRadius: 19, background: win && !grau ? s.ki : win && pick > 0 ? s.ki : '#B9BDC6'}} />
            </div>
            <div style={{width: 90, fontFamily: s.body, fontSize: 34, fontWeight: 700, color: s.inkSoft}}>{Math.round(r.v * g)} %</div>
          </div>
        );
      })}
    </div>
  );
};

const Klein: React.FC<{text: string; at: number; style?: React.CSSProperties}> = ({text, at, style}) => {
  const s = useStil();
  const {p} = useZeit();
  return <div style={{position: 'absolute', fontFamily: s.body, fontSize: 28, fontWeight: 600, color: s.inkSoft, opacity: 0.9 * p(at, 0.4), ...style}}>{text}</div>;
};

const Zaehler: React.FC<{von?: number; bis: number; at: number; dauer?: number; tausender?: boolean}> = ({von = 0, bis, at, dauer = 1.2, tausender}) => {
  const {p} = useZeit();
  const v = Math.round(mix(von, bis, p(at, dauer, 'out')));
  return <>{tausender ? v.toLocaleString('de-DE') : v}</>;
};

/* ───────────── Station 0 · Hook: Gerichtssaal ───────────── */

const FAELLE = ['Varghese v. China Southern Airlines', 'Shaboon v. EgyptAir', 'Petersen v. Iran Air'];

const Station0: React.FC = () => {
  const s = useStil();
  const {t, p, federn} = useZeit();
  const urteileAt = 0.4;
  const kippt = c(1, 'gibt', 1);
  const erfunden = c(1, 'erfunden');
  const k = p(kippt, 0.4);
  const strafe = federn(c(1, 'strafe'), 'bouncy');
  return (
    <>
      <Karte x={150} y={170} w={900} h={730} delay={-30} style={{padding: '44px 52px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <Kachel icon="ph:gavel-fill" farbe={s.ink} tint="#EEF0F3" size={84} />
          <div style={{fontFamily: s.body}}>
            <div style={{fontSize: 44, fontWeight: 800, color: s.ink}}>Schriftsatz</div>
            <div style={{fontSize: 30, fontWeight: 600, color: s.inkSoft}}>Mata gegen Avianca · New York</div>
          </div>
        </div>
        <div style={{height: 3, background: s.line, margin: '32px 0 28px', borderRadius: 2}} />
        <div style={{fontFamily: s.body, fontSize: 30, fontWeight: 700, color: s.inkSoft, marginBottom: 18, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: p(urteileAt - 0.3, 0.3)}}>Zitierte Urteile</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
          {FAELLE.map((f, i) => {
            const at = urteileAt + i * 0.25;
            const q = federn(at);
            const kipp = p(kippt + i * 0.18, 0.3);
            return (
              <div key={f} style={{display: 'flex', alignItems: 'center', gap: 20, opacity: clamp01(q * 2), transform: `translateX(${(1 - q) * -20}px)`}}>
                <Rund gut={kipp < 0.5} size={50} q={kipp < 0.5 ? q : mix(0.6, 1, kipp)} />
                <div style={{position: 'relative', fontFamily: s.body, fontSize: 36, fontWeight: 600, color: kipp > 0.5 ? s.inkSoft : s.ink}}>
                  {f}
                  <div style={{position: 'absolute', left: 0, top: '54%', height: 4, borderRadius: 2, background: s.fehler, width: `${kipp * 100}%`}} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 30, fontFamily: s.body, fontSize: 30, fontWeight: 600, color: s.inkSoft, opacity: p(urteileAt + 1, 0.4) * (1 - k * 0.6)}}>… und weitere</div>
        <Stempel text="ERFUNDEN" delay={fr(erfunden)} style={{right: 60, bottom: 70, fontSize: 64, color: s.fehler, borderColor: s.fehler, borderWidth: 6, padding: '10px 26px'}} />
      </Karte>
      <div style={{position: 'absolute', left: 1130, top: 200, width: 680, opacity: 1 - p(c(1, 'heraussuchen') - 0.8, 0.4, 'in'), fontFamily: s.head, fontWeight: 800, letterSpacing: '-0.035em', color: s.ink}}>
        <div style={{fontSize: 92, lineHeight: 1.02}}>Ein Anwalt.</div>
        <div style={{fontSize: 92, lineHeight: 1.02, opacity: p(c(1, 'gericht'), 0.4)}}>Ein Gericht.</div>
        <div style={{fontSize: 92, lineHeight: 1.02, color: s.fehler, opacity: p(kippt, 0.4)}}>Erfundene Urteile.</div>
      </div>
      <Karte x={1130} y={170} w={660} delay={fr(c(1, 'heraussuchen') - 0.2)} style={{padding: '34px 36px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26, fontFamily: s.body, fontSize: 30, fontWeight: 700, color: s.inkSoft}}>
          <Icon icon="logos:openai-icon" size={40} animate="none" />
          ChatGPT
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
          <NutzerBlase text="Finde Urteile, die meinen Fall stützen." at={c(1, 'heraussuchen')} size={34} />
          <KiBlase text="Gerne! Hier sind passende Urteile: Varghese v. China Southern …" at={c(1, 'heraussuchen') + 0.6} bis={c(1, 'heraussuchen') + 1.8} size={34} maxWidth={520} markiert={erfunden} fehlerAb={4} />
        </div>
      </Karte>
      <div style={{position: 'absolute', left: 1130, top: 640, display: 'flex', gap: 16}}>
        {[
          ['Namen', 'namen'],
          ['Aktenzeichen', 'aktenzeichen'],
          ['Zitate', 'zitaten'],
        ].map(([label, w]) => {
          const q = federn(c(1, w), 'bouncy');
          return (
            <div key={label} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '14px 22px', borderRadius: 999, background: ROT_TINT, color: s.fehler, fontFamily: s.body, fontSize: 32, fontWeight: 800, transform: `scale(${Math.max(0, q)})`}}>
              <Icon icon="ph:x-bold" size={28} color={s.fehler} animate="none" />
              {label}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 1130, top: 760, display: 'flex', alignItems: 'baseline', gap: 22, opacity: clamp01(strafe * 2), transform: `scale(${mix(0.7, 1, clamp01(strafe))})`, transformOrigin: 'left center'}}>
        <div style={{fontFamily: s.head, fontSize: 118, fontWeight: 900, letterSpacing: '-0.04em', color: s.fehler}}>
          <Zaehler bis={5000} at={c(1, 'strafe')} tausender /> $
        </div>
        <div style={{fontFamily: s.body, fontSize: 40, fontWeight: 700, color: s.ink}}>Strafe</div>
      </div>
      {t < 0.3 ? null : null}
    </>
  );
};

/* ───────────── Station 1 · Titel ───────────── */

const Station1: React.FC = () => {
  const s = useStil();
  const {p, federn} = useZeit();
  const a = P(2);
  const t1 = p(a + 0.1, 0.5);
  const t2 = p(a + 0.5, 0.5);
  const punkte = [
    {icon: 'ph:question-fill', text: 'Warum?', at: c(2, 'warum')},
    {icon: 'ph:map-pin-fill', text: 'Wo?', at: c(2, 'wo')},
    {icon: 'ph:shield-check-fill', text: '5 Regeln', at: c(2, 'regeln')},
  ];
  return (
    <>
      <div style={{position: 'absolute', left: 120, top: 170, fontFamily: s.head, fontWeight: 900, fontSize: 150, letterSpacing: '-0.05em', color: s.ink, lineHeight: 1, opacity: t1, transform: `translateY(${(1 - t1) * 30}px)`}}>
        Warum KI <span style={{color: s.fehler}}>lügt</span>
      </div>
      <div style={{position: 'absolute', left: 126, top: 340, fontFamily: s.head, fontWeight: 700, fontSize: 58, letterSpacing: '-0.03em', color: s.inkSoft, opacity: t2}}>– und wie du es merkst</div>
      <Karte x={120} y={470} w={980} delay={fr(c(2, 'halluzinieren') - 0.1)} style={{padding: '30px 40px', display: 'flex', alignItems: 'center', gap: 28}}>
        <Kachel icon="ph:seal-warning-fill" farbe={s.fehler} tint={ROT_TINT} size={96} />
        <div style={{fontFamily: s.body}}>
          <div style={{fontSize: 48, fontWeight: 800, color: s.ink}}>Halluzination</div>
          <div style={{fontSize: 34, fontWeight: 600, color: s.inkSoft, marginTop: 4}}>
            falsch – aber <span style={{color: s.ink, fontWeight: 800}}>völlig überzeugt</span> gesagt
          </div>
        </div>
      </Karte>
      <div style={{position: 'absolute', left: 120, top: 720, display: 'flex', gap: 24}}>
        {punkte.map((x) => {
          const q = federn(x.at, 'bouncy');
          return (
            <div key={x.text} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '20px 30px 20px 20px', borderRadius: 28, background: s.surface, boxShadow: '0 14px 30px rgba(30,35,50,0.08)', transform: `scale(${Math.max(0, q)})`, opacity: clamp01(q * 2)}}>
              <Kachel icon={x.icon} farbe={GELB_INK} tint={GELB_TINT} size={64} />
              <div style={{fontFamily: s.head, fontSize: 40, fontWeight: 800, color: s.ink}}>{x.text}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

/* ───────────── Station 2 · Rückblick ───────────── */

const Station2: React.FC = () => {
  const s = useStil();
  const {federn, p} = useZeit();
  const a = P(3);
  const nichts = c(3, 'nichts');
  const vier = c(3, 'vier');
  const kreuz = p(nichts + 0.2, 0.4, 'inOut');
  return (
    <>
      <Kopf text="Eine KI sagt das nächste Wort vorher" at={a} mark={['nächste', 'Wort']} />
      <Karte x={120} y={300} w={980} delay={fr(a + 0.3)} style={{padding: '40px 48px'}}>
        <div style={{fontFamily: s.head, fontSize: 64, fontWeight: 700, letterSpacing: '-0.03em', color: s.ink, marginBottom: 26}}>
          Der Himmel ist <span style={{display: 'inline-block', width: 190, borderBottom: `6px dashed ${s.ki}`}}>&nbsp;</span>
        </div>
        <Balken
          rows={[
            {w: 'blau', v: 62, at: P(3) + 1.0},
            {w: 'grau', v: 21, at: P(3) + 1.25},
            {w: 'schön', v: 9, at: P(3) + 1.5},
          ]}
          pickAt={c(3, 'wahrscheinlichsten')}
        />
        <div style={{fontFamily: s.body, fontSize: 28, fontWeight: 600, color: s.inkSoft, marginTop: 10}}>Beispielwerte</div>
      </Karte>
      <Auf at={nichts - 0.2} style={{left: 1190, top: 300}}>
        <div style={{position: 'relative', width: 300, height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Icon icon="fluent-emoji-flat:books" size={160} animate="none" />
          <div style={{fontFamily: s.body, fontSize: 34, fontWeight: 700, color: s.inkSoft}}>Nachschlagen</div>
          <svg width={300} height={220} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <line x1={40} y1={20} x2={mix(40, 260, kreuz)} y2={mix(20, 170, kreuz)} stroke={s.fehler} strokeWidth={12} strokeLinecap="round" />
          </svg>
        </div>
      </Auf>
      <div style={{position: 'absolute', left: 1190, top: 640}}>
        <div style={{fontFamily: s.body, fontSize: 34, fontWeight: 700, color: s.inkSoft, opacity: p(vier, 0.3), marginBottom: 14}}>Daraus entstehen Fehler – aus</div>
        <div style={{display: 'flex', gap: 18, alignItems: 'center'}}>
          {[0, 1, 2, 3].map((i) => {
            const q = federn(vier + i * 0.12, 'bouncy');
            return (
              <div key={i} style={{width: 76, height: 76, borderRadius: '50%', background: GELB, color: '#FFFFFF', fontFamily: s.head, fontSize: 42, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${Math.max(0, q)})`}}>
                {i + 1}
              </div>
            );
          })}
          <div style={{fontFamily: s.head, fontSize: 44, fontWeight: 800, color: s.ink, opacity: p(vier + 0.5, 0.3), marginLeft: 6}}>Gründen</div>
        </div>
      </div>
    </>
  );
};

/* ───────────── Station 3 · Grund 1: Wissen verschwimmt ───────────── */

const Station3: React.FC = () => {
  const s = useStil();
  const {p, federn} = useZeit();
  const a = P(4);
  const tausend = c(4, 'tausendfach');
  const berlin = c(4, 'berlin');
  const selten = c(4, 'selten');
  const blur = p(c(4, 'verschwimmen'), 1.2, 'inOut');
  const items = [
    {text: 'Geburtstag einer wenig bekannten Person', at: c(4, 'geburtstag')},
    {text: 'Aktenzeichen eines bestimmten Urteils', at: c(4, 'aktenzeichen')},
  ];
  return (
    <>
      <Kopf text="Grund 1: Seltenes Wissen verschwimmt" at={a} mark={['verschwimmt']} />
      <Karte x={120} y={290} w={700} h={600} delay={fr(tausend - 0.3)} style={{padding: '34px 40px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <Kachel icon="ph:files-fill" farbe={s.gut} tint={GRUEN_TINT} size={66} />
          <div style={{fontFamily: s.body, fontSize: 38, fontWeight: 800, color: s.ink}}>Steht tausendfach im Netz</div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 10, margin: '30px 0'}}>
          {Array.from({length: 48}, (_, i) => {
            const q = p(tausend + i * 0.025, 0.25);
            return <div key={i} style={{height: 34, borderRadius: 6, background: '#D5EDE1', opacity: q, transform: `scale(${mix(0.4, 1, q)})`}} />;
          })}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: p(berlin, 0.4)}}>
          <Rund gut q={federn(c(4, 'deutschland'), 'bouncy')} />
          <div style={{fontFamily: s.body, fontSize: 38, fontWeight: 700, color: s.ink, lineHeight: 1.25}}>Berlin ist die Hauptstadt von Deutschland.</div>
        </div>
        <div style={{marginTop: 22, fontFamily: s.body, fontSize: 32, fontWeight: 700, color: s.gut, opacity: p(c(4, 'sitzen'), 0.4)}}>→ sitzt fest</div>
      </Karte>
      <Karte x={880} y={290} w={700} h={600} delay={fr(selten - 0.2)} style={{padding: '34px 40px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <Kachel icon="ph:file-text-fill" farbe={s.fehler} tint={ROT_TINT} size={66} />
          <div style={{fontFamily: s.body, fontSize: 38, fontWeight: 800, color: s.ink}}>Kommt selten vor</div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 10, margin: '30px 0'}}>
          {Array.from({length: 48}, (_, i) => (
            <div key={i} style={{height: 34, borderRadius: 6, background: i < 2 ? '#F6C9CB' : '#F1F1F3', opacity: p(selten + (i < 2 ? i * 0.2 : 0.4), 0.3)}} />
          ))}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
          {items.map((x) => (
            <div key={x.text} style={{display: 'flex', alignItems: 'center', gap: 18, opacity: p(x.at, 0.4)}}>
              <div style={{width: 54, height: 54, borderRadius: '50%', background: '#F1F1F3', color: s.inkSoft, fontFamily: s.head, fontSize: 34, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>?</div>
              <div style={{fontFamily: s.body, fontSize: 36, fontWeight: 700, color: s.ink, lineHeight: 1.25, filter: `blur(${blur * 5}px)`}}>{x.text}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop: 22, fontFamily: s.body, fontSize: 32, fontWeight: 700, color: s.fehler, opacity: p(c(4, 'ungefähre'), 0.4)}}>→ nur eine ungefähre Vorstellung</div>
      </Karte>
    </>
  );
};

/* ───────────── Station 4 · Grund 2: Sie muss immer weiterreden ───────────── */

const Station4: React.FC = () => {
  const s = useStil();
  const {p, federn} = useZeit();
  const a = P(5);
  const bars = c(5, 'wahrscheinlichkeiten');
  const waehlt = c(5, 'wählt');
  const keine = c(5, 'keine');
  const satz = c(5, 'satz');
  const stimmt = c(5, 'stimmt');
  const flug = p(waehlt + 0.3, 0.6, 'inOut');
  return (
    <>
      <Kopf text="Grund 2: Sie muss immer weiterreden" at={a} mark={['weiterreden']} />
      <Karte x={120} y={290} w={1420} h={600} delay={fr(a + 0.4)} style={{padding: '40px 48px'}}>
        <div style={{fontFamily: s.head, fontSize: 56, fontWeight: 700, letterSpacing: '-0.03em', color: s.ink, display: 'flex', alignItems: 'center', gap: 20}}>
          Beispiel-Person wurde geboren am
          <div style={{position: 'relative', width: 230, height: 76, borderRadius: 18, border: flug < 1 ? `5px dashed ${s.ki}` : 'none', background: flug >= 1 ? '#FFE4D9' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span style={{color: s.ki, fontWeight: 800, opacity: flug >= 1 ? 1 : 0}}>3. Mai</span>
          </div>
          <span style={{opacity: p(satz, 0.3)}}>.</span>
        </div>
        <div style={{display: 'flex', gap: 60, marginTop: 40}}>
          <div>
            <Balken
              rows={[
                {w: '3. Mai', v: 14, at: bars},
                {w: '12. Juni', v: 12, at: bars + 0.25},
                {w: '27. März', v: 11, at: bars + 0.5},
              ]}
              pickAt={waehlt}
              max={70}
              labelW={230}
              barW={360}
              grau
            />
            <div style={{display: 'flex', alignItems: 'center', gap: 18, height: 70, marginTop: 8, opacity: p(keine, 0.4)}}>
              <div style={{width: 230, fontFamily: s.head, fontSize: 40, fontWeight: 800, color: s.inkSoft, textDecoration: 'line-through', textDecorationColor: s.fehler, textDecorationThickness: 5, whiteSpace: 'nowrap'}}>„weiß nicht“</div>
              <div style={{width: 360, height: 38, borderRadius: 19, border: `4px dashed ${s.faint}`, boxSizing: 'border-box'}} />
              <Icon icon="ph:lock-fill" size={40} color={s.inkSoft} animate="none" />
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 10}}>
            <Auf at={c(5, 'keines')} style={{position: 'relative'}}>
              <div style={{padding: '22px 30px', borderRadius: 24, background: '#F1F1F3', fontFamily: s.body, fontSize: 34, fontWeight: 700, color: s.inkSoft, maxWidth: 440}}>Keine Option ist wirklich sicher</div>
            </Auf>
            <Auf at={keine + 0.4} style={{position: 'relative'}}>
              <div style={{padding: '22px 30px', borderRadius: 24, background: ROT_TINT, fontFamily: s.body, fontSize: 34, fontWeight: 700, color: s.fehler, maxWidth: 440}}>Kein eingebautes „Hier weiß ich nichts“</div>
            </Auf>
          </div>
        </div>
        <Stempel text="STIMMT DAS?" delay={fr(stimmt)} style={{right: 60, top: 44, fontSize: 40, color: s.fehler, borderColor: s.fehler}} />
        <div style={{position: 'absolute', left: 48, bottom: 26, fontFamily: s.body, fontSize: 28, fontWeight: 600, color: s.inkSoft, opacity: p(bars, 0.4)}}>Beispielwerte</div>
      </Karte>
      {flug > 0 && flug < 1 ? (
        <div style={{position: 'absolute', left: mix(520, 1210, flug), top: mix(520, 335, flug) - Math.sin(flug * Math.PI) * 80, fontFamily: s.head, fontSize: 44, fontWeight: 800, color: s.ki, padding: '6px 18px', borderRadius: 16, background: '#FFE4D9'}}>3. Mai</div>
      ) : null}
      {federn(0) > 2 ? null : null}
    </>
  );
};

/* ───────────── Station 5 · Grund 3: Raten wird belohnt ───────────── */

const Station5: React.FC = () => {
  const s = useStil();
  const {p, federn} = useZeit();
  const a = P(6);
  const forscher = c(6, 'forscher');
  const regeln = [
    {text: 'Richtig', punkte: '+1', gut: true, at: c(6, 'richtige')},
    {text: '„Weiß ich nicht“', punkte: '0', gut: false, at: c(6, 'weiß', 1)},
    {text: 'Falsch', punkte: '0', gut: false, at: c(6, 'falsche')},
  ];
  const raten = c(6, 'raten', 2);
  const geburtstag = c(6, 'geburtstag');
  const tafel = c(6, 'tausende');
  const wechsel = p(tafel - 0.2, 0.4, 'inOut');
  return (
    <>
      <Kopf text="Grund 3: Tests belohnen das Raten" at={a} mark={['Raten']} />
      <Auf at={forscher} style={{left: 120, top: 250}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderRadius: 999, background: s.surface, boxShadow: '0 8px 20px rgba(30,35,50,0.08)', fontFamily: s.body, fontSize: 28, fontWeight: 700, color: s.inkSoft}}>
          <Icon icon="logos:openai-icon" size={30} animate="none" />
          Studie von OpenAI · September 2025
        </div>
      </Auf>
      <Karte x={120} y={340} w={640} h={550} delay={fr(c(6, 'prüfung') - 0.2)} style={{padding: '34px 40px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 26}}>
          <Kachel icon="ph:exam-fill" farbe={GELB_INK} tint={GELB_TINT} size={66} />
          <div style={{fontFamily: s.body, fontSize: 40, fontWeight: 800, color: s.ink}}>Punkte im Test</div>
        </div>
        {regeln.map((r) => {
          const q = federn(r.at);
          return (
            <div key={r.text} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 92, borderTop: `3px solid ${s.line}`, opacity: clamp01(q * 2), transform: `translateX(${(1 - q) * -16}px)`}}>
              <div style={{fontFamily: s.body, fontSize: 38, fontWeight: 700, color: s.ink}}>{r.text}</div>
              <div style={{fontFamily: s.head, fontSize: 52, fontWeight: 900, color: r.gut ? s.gut : s.inkSoft}}>{r.punkte}</div>
            </div>
          );
        })}
        <div style={{marginTop: 18, display: 'flex', alignItems: 'center', gap: 16, opacity: p(raten, 0.3)}}>
          <div style={{fontFamily: s.body, fontSize: 36, fontWeight: 700, color: s.inkSoft}}>Was lohnt sich?</div>
          <div style={{padding: '8px 22px', borderRadius: 16, background: s.ki, color: '#FFFFFF', fontFamily: s.head, fontSize: 42, fontWeight: 900, transform: `scale(${Math.max(0, federn(raten, 'bouncy'))})`}}>Raten</div>
        </div>
      </Karte>
      <Karte x={820} y={340} w={740} h={550} delay={fr(geburtstag - 0.2)} style={{padding: '34px 40px', overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: '34px 40px', opacity: 1 - wechsel}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <Icon icon="fluent-emoji-flat:birthday-cake" size={90} animate="none" />
            <div style={{fontFamily: s.body, fontSize: 38, fontWeight: 800, color: s.ink, lineHeight: 1.2}}>Geburtstag unbekannt – trotzdem raten?</div>
          </div>
          <div style={{display: 'flex', gap: 30, marginTop: 50}}>
            <div style={{flex: 1, padding: '28px 26px', borderRadius: 26, background: GRUEN_TINT, opacity: p(c(6, 'liegt', 1), 0.4)}}>
              <div style={{fontFamily: s.body, fontSize: 30, fontWeight: 700, color: s.gut}}>Raten</div>
              <div style={{fontFamily: s.head, fontSize: 64, fontWeight: 900, color: s.ink, marginTop: 6}}>1 : 365</div>
              <div style={{fontFamily: s.body, fontSize: 28, fontWeight: 600, color: s.inkSoft}}>Chance auf einen Punkt</div>
            </div>
            <div style={{flex: 1, padding: '28px 26px', borderRadius: 26, background: '#F1F1F3', opacity: p(c(6, 'weiß', 2), 0.4)}}>
              <div style={{fontFamily: s.body, fontSize: 30, fontWeight: 700, color: s.inkSoft}}>„Weiß nicht“</div>
              <div style={{fontFamily: s.head, fontSize: 64, fontWeight: 900, color: s.ink, marginTop: 6}}>0</div>
              <div style={{fontFamily: s.body, fontSize: 28, fontWeight: 600, color: s.inkSoft}}>Punkte – immer</div>
            </div>
          </div>
        </div>
        <div style={{position: 'absolute', inset: '34px 40px', opacity: wechsel}}>
          <div style={{fontFamily: s.body, fontSize: 38, fontWeight: 800, color: s.ink}}>Punktetafel nach 1.000 Fragen</div>
          {[
            {name: 'Rät immer', punkte: 601, fehler: 399, at: tafel + 0.2, win: true},
            {name: 'Sagt „weiß nicht“', punkte: 600, fehler: 0, at: tafel + 0.5, win: false},
          ].map((r) => (
            <div key={r.name} style={{display: 'flex', alignItems: 'center', gap: 20, height: 120, borderBottom: `3px solid ${s.line}`, marginTop: 10}}>
              <div style={{width: 300, fontFamily: s.body, fontSize: 36, fontWeight: 700, color: s.ink}}>{r.name}</div>
              <div style={{width: 170, fontFamily: s.head, fontSize: 56, fontWeight: 900, color: r.win ? s.ki : s.ink}}>
                <Zaehler bis={r.punkte} at={r.at} dauer={1.4} />
              </div>
              <div style={{fontFamily: s.body, fontSize: 30, fontWeight: 700, color: r.fehler ? s.fehler : s.gut, opacity: p(c(6, 'besser'), 0.4)}}>{r.fehler} Fehler</div>
              {r.win ? (
                <div style={{opacity: p(c(6, 'besser'), 0.3), transform: `scale(${Math.max(0, federn(c(6, 'besser'), 'bouncy'))})`}}>
                  <Icon icon="ph:trophy-fill" size={46} color={GELB} animate="none" />
                </div>
              ) : null}
            </div>
          ))}
          <div style={{marginTop: 24, fontFamily: s.body, fontSize: 28, fontWeight: 600, color: s.inkSoft}}>Beispielrechnung: Die KI kennt 600 Antworten und rät 400-mal.</div>
        </div>
      </Karte>
    </>
  );
};

/* ───────────── Station 6 · Grund 4: Tonfall ───────────── */

const Station6: React.FC = () => {
  const s = useStil();
  const {p, federn} = useZeit();
  const a = P(7);
  const richtig = c(7, 'richtige');
  const erfunden = c(7, 'erfundene');
  const sicher = c(7, 'selbstsicher');
  const menschen = c(7, 'menschen');
  const warn = c(7, 'warnsignal');
  const antworten = [
    {text: 'Der Mount Everest ist 8.849 Meter hoch.', at: richtig, gut: true},
    {text: 'Der Mount Everest ist 9.120 Meter hoch.', at: erfunden, gut: false},
  ];
  return (
    <>
      <Kopf text="Grund 4: Der Tonfall verrät nichts" at={a} mark={['nichts']} />
      {antworten.map((x, i) => (
        <Karte key={x.text} x={120 + i * 720} y={300} w={680} delay={fr(x.at)} style={{padding: '30px 34px'}}>
          <KiBlase text={x.text} at={x.at + 0.2} bis={x.at + 1} size={38} maxWidth={520} />
          <div style={{marginTop: 26, fontFamily: s.body, fontSize: 28, fontWeight: 700, color: s.inkSoft}}>Selbstsicherheit</div>
          <div style={{marginTop: 10, height: 26, borderRadius: 13, background: s.line, overflow: 'hidden'}}>
            <div style={{width: `${100 * p(sicher - 0.6 + i * 0.15, 0.8)}%`, height: '100%', background: s.ki, borderRadius: 13}} />
          </div>
          <div style={{marginTop: 22, display: 'flex', alignItems: 'center', gap: 14, opacity: p(c(7, 'menschen') - 0.6, 0.4)}}>
            <Rund gut={x.gut} size={46} q={federn(menschen - 0.6 + i * 0.15, 'bouncy')} />
            <div style={{fontFamily: s.body, fontSize: 32, fontWeight: 800, color: x.gut ? s.gut : s.fehler}}>{x.gut ? 'stimmt' : 'erfunden'}</div>
          </div>
        </Karte>
      ))}
      <Auf at={menschen} style={{left: 120, top: 700}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <div style={{width: 64, height: 64, borderRadius: '50%', background: '#E1EAFF', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon icon="ph:user-fill" size={38} color="#2E5BC4" animate="none" />
          </div>
          <div style={{padding: '20px 30px', borderRadius: 30, borderBottomLeftRadius: 8, background: s.surface, boxShadow: '0 10px 24px rgba(30,35,50,0.08)', fontFamily: s.body, fontSize: 38, fontWeight: 600, color: s.ink}}>
            Ähm … <span style={{color: '#2E5BC4', fontWeight: 800}}>ich glaube</span>, so 8.800 Meter?
          </div>
        </div>
      </Auf>
      <Notiz x={160} y={810} text="Zögern = Warnsignal" at={c(7, 'zögern')} farbe="#2E5BC4" size={54} />
      <Auf at={warn} style={{left: 880, top: 700}} art="bouncy">
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '18px 28px', borderRadius: 26, background: ROT_TINT}}>
          <Icon icon="ph:warning-fill" size={48} color={s.fehler} animate="none" />
          <div style={{fontFamily: s.body, fontSize: 36, fontWeight: 800, color: s.fehler}}>Bei der KI fehlt dieses Signal</div>
        </div>
      </Auf>
    </>
  );
};

/* ───────────── Station 7 · Selbsttest Eiffelturm ───────────── */

const Eiffel: React.FC<{h: number; farbe: string}> = ({h, farbe}) => (
  <svg width={h * 0.62} height={h} viewBox="0 0 62 100">
    <path d="M31 0 L33 14 L36 34 L42 56 L52 84 L58 100 L46 100 Q31 74 16 100 L4 100 L10 84 L20 56 L26 34 L29 14 Z" fill={farbe} />
    <rect x={20} y={54} width={22} height={4} rx={1} fill="#FFFFFF" opacity={0.5} />
    <rect x={25} y={32} width={12} height={3} rx={1} fill="#FFFFFF" opacity={0.5} />
  </svg>
);

const Station7: React.FC = () => {
  const s = useStil();
  const {t, p, federn} = useZeit();
  const a = P(8);
  const satzA = c(8, 'satz', 1);
  const satzB = c(8, 'satz', 2);
  const frage = c(8, 'oder');
  const aufl = c(8, 'richtig');
  const korrektur = c(8, 'eröffnet', 2);
  const saetze = [
    {k: 'A', text: 'Der Eiffelturm ist rund 330 Meter hoch.', at: satzA, gut: true},
    {k: 'B', text: 'Der Eiffelturm wurde 1902 eröffnet.', at: satzB, gut: false},
  ];
  const tick = t > frage && t < aufl ? clamp01((t - frage) / (aufl - frage)) : t >= aufl ? 1 : 0;
  return (
    <>
      <Kopf text="Mach den Test: Welcher Satz stimmt?" at={a} mark={['Test:']} />
      {saetze.map((x, i) => {
        const r = p(aufl + i * 0.3, 0.4);
        const farbe = r > 0.5 ? (x.gut ? s.gut : s.fehler) : s.ink;
        return (
          <Karte key={x.k} x={120 + i * 720} y={300} w={680} h={460} delay={fr(x.at - 0.1)} style={{padding: '34px 40px', border: r > 0.5 ? `5px solid ${farbe}` : '5px solid transparent'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <div style={{width: 84, height: 84, borderRadius: 24, background: GELB_TINT, color: GELB_INK, fontFamily: s.head, fontSize: 52, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{x.k}</div>
              <Eiffel h={150} farbe="#9AA3B2" />
            </div>
            <div style={{marginTop: 28, fontFamily: s.head, fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em', color: s.ink, lineHeight: 1.2}}>{x.text}</div>
            <div style={{position: 'absolute', right: 40, top: 40}}>
              <Rund gut={x.gut} size={84} q={federn(aufl + i * 0.3, 'bouncy')} />
            </div>
            {!x.gut ? (
              <div style={{marginTop: 22, display: 'flex', alignItems: 'center', gap: 12, fontFamily: s.body, fontSize: 36, fontWeight: 800, color: s.gut, opacity: p(korrektur, 0.4)}}>
                <Icon icon="ph:arrow-right-bold" size={34} color={s.gut} animate="none" />
                Eröffnet wurde er 1889.
              </div>
            ) : null}
          </Karte>
        );
      })}
      <Auf at={frage - 0.4} aus={aufl} style={{left: 120, top: 800}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <svg width={70} height={70}>
            <circle cx={35} cy={35} r={28} fill="none" stroke={s.line} strokeWidth={8} />
            <circle cx={35} cy={35} r={28} fill="none" stroke={GELB} strokeWidth={8} strokeDasharray={`${tick * 176} 176`} transform="rotate(-90 35 35)" strokeLinecap="round" />
          </svg>
          <div style={{fontFamily: s.body, fontSize: 40, fontWeight: 700, color: s.ink}}>Beide klingen gleich sicher …</div>
        </div>
      </Auf>
      <Notiz x={150} y={790} text="Man sieht einer Halluzination den Fehler nicht an." at={c(8, 'fehler')} farbe={s.fehler} size={60} rot={-2} />
    </>
  );
};

/* ───────────── Station 8 · Echter Fall: Google Bard ───────────── */

const Station8: React.FC = () => {
  const s = useStil();
  const {p} = useZeit();
  const a = P(9);
  const falsch = c(9, 'falsch');
  const boerse = c(9, 'börse');
  const linie = p(boerse - 0.6, 1.4, 'inOut');
  const kurve = 'M 0 40 L 60 46 L 120 38 L 180 50 L 240 44 L 300 140 L 360 210 L 420 230';
  return (
    <>
      <Kopf text="Teurer Fehler im Werbevideo" at={a} mark={['Teurer']} markFarbe={KANAL.fehler} />
      <Karte x={120} y={290} w={940} h={600} delay={fr(c(9, 'februar') - 0.2)} style={{padding: '36px 44px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <Icon icon="logos:google-icon" size={58} animate="none" />
          <div style={{fontFamily: s.body}}>
            <div style={{fontSize: 38, fontWeight: 800, color: s.ink}}>Google Bard</div>
            <div style={{fontSize: 28, fontWeight: 600, color: s.inkSoft}}>Werbevideo · Februar 2023</div>
          </div>
          <div style={{marginLeft: 'auto'}}>
            <Icon icon="fluent-emoji-flat:telescope" size={96} animate="none" />
          </div>
        </div>
        <div style={{marginTop: 30}}>
          <KiBlase text="Das James-Webb-Teleskop hat die ersten Fotos eines Planeten außerhalb unseres Sonnensystems gemacht." at={c(9, 'behauptete')} bis={c(9, 'gemacht')} size={38} maxWidth={760} markiert={falsch} fehlerAb={0} />
        </div>
        <div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 18, opacity: p(falsch + 0.2, 0.4)}}>
          <Rund gut={false} size={52} />
          <div style={{fontFamily: s.body, fontSize: 34, fontWeight: 700, color: s.ink, lineHeight: 1.3}}>
            Falsch: Erste Fotos gab es schon <b>2004</b>
            <div style={{fontSize: 28, fontWeight: 600, color: s.inkSoft}}>mit dem Very Large Telescope der ESO</div>
          </div>
        </div>
      </Karte>
      <Karte x={1120} y={290} w={480} h={600} delay={fr(c(9, 'selben') - 0.2)} style={{padding: '34px 36px'}}>
        <div style={{fontFamily: s.body, fontSize: 32, fontWeight: 800, color: s.ink}}>Börsenwert Alphabet</div>
        <div style={{fontFamily: s.body, fontSize: 26, fontWeight: 600, color: s.inkSoft}}>am selben Tag · schematisch</div>
        <svg width={420} height={260} style={{marginTop: 30, overflow: 'visible'}}>
          <line x1={0} y1={250} x2={420} y2={250} stroke={s.line} strokeWidth={3} />
          <path d={kurve} fill="none" stroke={s.fehler} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - linie} />
        </svg>
        <div style={{marginTop: 20, fontFamily: s.head, fontSize: 64, fontWeight: 900, color: s.fehler, letterSpacing: '-0.03em', opacity: p(c(9, 'milliarden'), 0.4)}}>≈ −100 Mrd. $</div>
      </Karte>
    </>
  );
};

/* ───────────── Station 9 · Echter Fall: Air Canada ───────────── */

const Station9: React.FC = () => {
  const s = useStil();
  const {p} = useZeit();
  const a = P(10);
  const stimmte = c(10, 'stimmte');
  const meinte = c(10, 'meinte');
  const gericht = c(10, 'schiedsgericht');
  return (
    <>
      <Kopf text="Der Chatbot einer Fluglinie" at={a} mark={['Chatbot']} />
      <Karte x={120} y={290} w={860} h={600} delay={fr(a + 0.4)} style={{padding: '36px 40px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 30}}>
          <Kachel icon="ph:airplane-tilt-fill" farbe="#2E5BC4" tint="#E1EAFF" size={66} />
          <div style={{fontFamily: s.body, fontSize: 34, fontWeight: 800, color: s.ink}}>Air Canada · Chat</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
          <NutzerBlase text="Gibt es einen Rabatt bei einem Trauerfall?" at={c(10, 'kunden') - 0.4} size={34} />
          <KiBlase text="Ja! Den Rabatt kannst du auch nachträglich beantragen." at={c(10, 'könne')} bis={c(10, 'beantragen')} size={36} maxWidth={620} markiert={stimmte} fehlerAb={4} />
        </div>
        <div style={{marginTop: 34, display: 'flex', alignItems: 'center', gap: 16, opacity: p(stimmte, 0.4)}}>
          <Rund gut={false} size={52} />
          <div style={{fontFamily: s.body, fontSize: 36, fontWeight: 800, color: s.fehler}}>Stimmte nicht.</div>
        </div>
      </Karte>
      <Karte x={1040} y={290} w={560} delay={fr(meinte - 0.2)} style={{padding: '30px 34px'}}>
        <div style={{fontFamily: s.body, fontSize: 28, fontWeight: 700, color: s.inkSoft}}>Die Airline sagte:</div>
        <div style={{marginTop: 10, fontFamily: s.head, fontSize: 40, fontWeight: 700, color: s.ink, lineHeight: 1.25}}>„Der Chatbot ist selbst verantwortlich.“</div>
      </Karte>
      <Karte x={1040} y={560} w={560} h={330} delay={fr(gericht - 0.2)} style={{padding: '30px 34px', border: `5px solid ${s.gut}`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <Kachel icon="ph:scales-fill" farbe={s.gut} tint={GRUEN_TINT} size={62} />
          <div style={{fontFamily: s.body, fontSize: 30, fontWeight: 800, color: s.ink}}>Schiedsgericht · 2024</div>
        </div>
        <div style={{marginTop: 18, fontFamily: s.head, fontSize: 38, fontWeight: 700, color: s.ink, lineHeight: 1.25, opacity: p(c(10, 'teil'), 0.4)}}>Der Chatbot ist Teil der Webseite.</div>
        <div style={{marginTop: 12, fontFamily: s.head, fontSize: 40, fontWeight: 900, color: s.gut, opacity: p(c(10, 'haftet'), 0.4)}}>→ Die Firma haftet.</div>
      </Karte>
    </>
  );
};

/* ───────────── Station 10 · Hier erfindet KI oft ───────────── */

const ZONEN = [
  {icon: 'ph:link-break-bold', titel: 'Quellen & Links', text: 'Studien, Bücher, Zitate', w: 'quellen'},
  {icon: 'ph:calendar-dots-fill', titel: 'Zahlen & Daten', text: 'genaue Werte, Jahre', w: 'zahlen'},
  {icon: 'ph:magnifying-glass-fill', titel: 'Nischenwissen', text: 'wenig darüber geschrieben', w: 'nischen'},
  {icon: 'ph:newspaper-fill', titel: 'Ganz Aktuelles', text: 'nach dem Training passiert', w: 'aktuellen'},
  {icon: 'ph:user-fill', titel: 'Personen', text: 'Fragen zu bestimmten Menschen', w: 'personen'},
];

const Station10: React.FC = () => {
  const s = useStil();
  const {federn} = useZeit();
  const a = P(11);
  return (
    <>
      <Kopf text="Hier erfindet KI besonders oft" at={a} mark={['besonders', 'oft']} markFarbe={KANAL.fehler} />
      {ZONEN.map((z, i) => {
        const at = c(11, z.w);
        const q = federn(at - 0.15, 'bouncy');
        const reihe = i < 3 ? 0 : 1;
        const x = reihe === 0 ? 120 + i * 480 : 360 + (i - 3) * 480;
        const y = reihe === 0 ? 290 : 610;
        return (
          <div key={z.titel} style={{position: 'absolute', left: x, top: y, width: 450, height: 290, boxSizing: 'border-box', padding: '30px 34px', borderRadius: 32, background: s.surface, boxShadow: '0 24px 50px rgba(30,35,50,0.10)', opacity: clamp01(q * 2), transform: `translateY(${(1 - clamp01(q)) * 30}px) scale(${mix(0.85, 1, clamp01(q))})`}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <Kachel icon={z.icon} farbe={s.fehler} tint={ROT_TINT} size={84} />
              <div style={{fontFamily: s.head, fontSize: 60, fontWeight: 900, color: '#F6C9CB'}}>{i + 1}</div>
            </div>
            <div style={{marginTop: 22, fontFamily: s.head, fontSize: 44, fontWeight: 800, color: s.ink, letterSpacing: '-0.02em'}}>{z.titel}</div>
            <div style={{marginTop: 6, fontFamily: s.body, fontSize: 30, fontWeight: 600, color: s.inkSoft}}>{z.text}</div>
          </div>
        );
      })}
    </>
  );
};

/* ───────────── Station 11 · Wird es besser? ───────────── */

const Station11: React.FC = () => {
  const s = useStil();
  const {p} = useZeit();
  const a = P(12);
  const ja = c(12, 'ja');
  const hersteller = c(12, 'hersteller');
  const nullAt = c(12, 'null');
  const balken = [0.9, 0.72, 0.5, 0.36, 0.28];
  return (
    <>
      <Kopf text="Wird das besser?" at={a} />
      <div style={{position: 'absolute', left: 120, top: 300, display: 'flex', flexDirection: 'column', gap: 26}}>
        {[
          {icon: 'ph:globe-fill', titel: 'Suche im Internet', text: 'mit Quellen zum Nachklicken', at: c(12, 'internet')},
          {icon: 'ph:brain-fill', titel: 'Länger nachdenken', text: 'neuere Modelle erfinden seltener', at: c(12, 'denken')},
        ].map((x) => (
          <Auf key={x.titel} at={x.at - 0.2} style={{position: 'relative'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 24, width: 700, padding: '28px 34px', borderRadius: 32, background: s.surface, boxShadow: '0 24px 50px rgba(30,35,50,0.10)', boxSizing: 'border-box'}}>
              <Kachel icon={x.icon} farbe={s.gut} tint={GRUEN_TINT} size={88} />
              <div>
                <div style={{fontFamily: s.head, fontSize: 44, fontWeight: 800, color: s.ink}}>{x.titel}</div>
                <div style={{fontFamily: s.body, fontSize: 30, fontWeight: 600, color: s.inkSoft}}>{x.text}</div>
              </div>
            </div>
          </Auf>
        ))}
        <Auf at={hersteller} style={{position: 'relative'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, width: 700, padding: '24px 32px', borderRadius: 28, background: ROT_TINT, boxSizing: 'border-box'}}>
            <Icon icon="ph:warning-fill" size={50} color={s.fehler} animate="none" />
            <div style={{fontFamily: s.body, fontSize: 34, fontWeight: 700, color: s.fehler, lineHeight: 1.25}}>Hersteller: Halluzinationen kommen weiter vor.</div>
          </div>
        </Auf>
      </div>
      <Karte x={880} y={300} w={650} h={590} delay={fr(ja - 0.1)} style={{padding: '34px 40px'}}>
        <div style={{fontFamily: s.body, fontSize: 34, fontWeight: 800, color: s.ink}}>Erfundene Antworten</div>
        <div style={{fontFamily: s.body, fontSize: 26, fontWeight: 600, color: s.inkSoft}}>ältere → neuere Modelle · schematisch</div>
        <div style={{position: 'absolute', left: 40, right: 40, bottom: 70, height: 340, display: 'flex', alignItems: 'flex-end', gap: 26}}>
          {balken.map((h, i) => (
            <div key={i} style={{flex: 1, height: `${h * 100 * p(ja + i * 0.25, 0.6)}%`, borderRadius: '16px 16px 6px 6px', background: i === balken.length - 1 ? s.ki : '#C9CDD5'}} />
          ))}
          <div style={{position: 'absolute', left: -10, right: -10, bottom: -4, borderTop: `5px dashed ${s.fehler}`, opacity: p(nullAt - 0.2, 0.3)}} />
        </div>
        <div style={{position: 'absolute', left: 40, bottom: 20, fontFamily: s.body, fontSize: 30, fontWeight: 800, color: s.fehler, opacity: p(nullAt, 0.3)}}>Null? Nicht so schnell.</div>
      </Karte>
    </>
  );
};

/* ───────────── Station 12 · Falle „Bist du sicher?“ ───────────── */

const Station12: React.FC = () => {
  const s = useStil();
  const {p} = useZeit();
  const a = P(13);
  const sicher = c(13, 'sicher');
  const entschuldigt = c(13, 'entschuldigt');
  const falsche = c(13, 'falsche');
  const nachfragen = c(13, 'nachfragen', 2);
  return (
    <>
      <Kopf text="Falle: „Bist du sicher?“" at={a} mark={['„Bist', 'du', 'sicher?“']} markFarbe={KANAL.fehler} />
      <Karte x={120} y={290} w={1000} h={600} delay={fr(a + 0.3)} style={{padding: '36px 40px'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 28}}>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 16}}>
            <div style={{flex: 1}}>
              <KiBlase text="Der Eiffelturm ist rund 330 Meter hoch." at={a + 0.6} bis={a + 1.4} size={36} maxWidth={700} />
            </div>
            <div style={{opacity: p(a + 1.6, 0.3), paddingBottom: 12}}>
              <Rund gut size={46} />
            </div>
          </div>
          <NutzerBlase text="Bist du sicher?" at={sicher - 0.3} size={38} />
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 16}}>
            <div style={{flex: 1}}>
              <KiBlase text="Entschuldigung, du hast recht! Er ist nur 300 Meter hoch." at={entschuldigt} bis={entschuldigt + 1.6} size={36} maxWidth={700} markiert={falsche} fehlerAb={5} />
            </div>
            <div style={{opacity: p(falsche, 0.3), paddingBottom: 12}}>
              <Rund gut={false} size={46} />
            </div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 40, bottom: 30, fontFamily: s.body, fontSize: 30, fontWeight: 700, color: s.fehler, opacity: p(c(13, 'gefallen'), 0.4)}}>Sie will dir gefallen – und gibt nach.</div>
      </Karte>
      <Karte x={1180} y={290} w={420} h={600} delay={fr(nachfragen - 0.2)} style={{padding: '40px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
        <div style={{fontFamily: s.head, fontSize: 50, fontWeight: 800, color: s.inkSoft}}>Nachfragen</div>
        <div style={{fontFamily: s.head, fontSize: 110, fontWeight: 900, color: s.fehler, lineHeight: 0.8}}>≠</div>
        <div style={{fontFamily: s.head, fontSize: 50, fontWeight: 800, color: s.gut}}>Nachprüfen</div>
      </Karte>
    </>
  );
};

/* ───────────── Station 13 · Fünf Regeln ───────────── */

const REGELN = [
  {titel: 'Quellen öffnen', n: 14},
  {titel: '„Weiß nicht“ erlauben', n: 15},
  {titel: 'Text selbst geben', n: 16},
  {titel: 'Zweite Quelle prüfen', n: 17},
  {titel: 'Fachperson fragen', n: 18},
];

const BUEHNE = {x: 840, y: 290, w: 760, h: 600};

const Regel1: React.FC = () => {
  const s = useStil();
  const {p} = useZeit();
  const oeffne = c(14, 'öffne');
  const warn = c(14, 'funktioniert');
  const seite = p(oeffne + 0.5, 0.3);
  return (
    <div style={{padding: '40px 44px'}}>
      <KiBlase text="Laut einer Studie von 2021 … Quelle: studie-ki-beispiel.de/2021" at={P(14) + 0.3} bis={P(14) + 1.2} size={34} maxWidth={640} />
      <div style={{marginTop: 36, borderRadius: 24, border: `3px solid ${s.line}`, overflow: 'hidden', opacity: p(oeffne, 0.3)}}>
        <div style={{height: 52, background: '#F1F1F3', display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', fontFamily: s.body, fontSize: 24, fontWeight: 600, color: s.inkSoft}}>
          {['#FF6159', '#FFBD2E', '#28C941'].map((cc) => (
            <div key={cc} style={{width: 14, height: 14, borderRadius: '50%', background: cc}} />
          ))}
          <span style={{marginLeft: 12}}>studie-ki-beispiel.de/2021</span>
        </div>
        <div style={{height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, opacity: seite}}>
          <div style={{fontFamily: s.head, fontSize: 96, fontWeight: 900, color: s.fehler}}>404</div>
          <div style={{fontFamily: s.body, fontSize: 32, fontWeight: 700, color: s.inkSoft}}>Seite nicht gefunden</div>
        </div>
      </div>
      <div style={{marginTop: 26, display: 'flex', alignItems: 'center', gap: 14, fontFamily: s.body, fontSize: 34, fontWeight: 800, color: s.fehler, opacity: p(warn, 0.4)}}>
        <Icon icon="ph:warning-fill" size={42} color={s.fehler} animate="none" />
        Toter Link = Warnzeichen
      </div>
    </div>
  );
};

const Regel2: React.FC = () => {
  const s = useStil();
  const {t, p} = useZeit();
  const schreib = c(15, 'schreib');
  const text = 'Wenn du dir nicht sicher bist, sag es.';
  const n = Math.floor(clamp01((t - schreib - 0.3) / 2.2) * text.length);
  return (
    <div style={{padding: '40px 44px'}}>
      <div style={{fontFamily: s.body, fontSize: 30, fontWeight: 700, color: s.inkSoft, marginBottom: 16}}>Schreib in deine Frage:</div>
      <div style={{minHeight: 150, padding: '26px 30px', borderRadius: 26, border: `4px solid ${GELB}`, background: '#FFFDF5', fontFamily: s.body, fontSize: 42, fontWeight: 700, color: s.ink, lineHeight: 1.3}}>
        {text.slice(0, n)}
        <span style={{opacity: Math.floor(t * 2.5) % 2 === 0 && n < text.length ? 1 : 0, color: GELB}}>|</span>
      </div>
      <div style={{marginTop: 36, opacity: p(c(15, 'senkt') - 0.4, 0.3)}}>
        <KiBlase text="Da bin ich mir nicht sicher – das solltest du prüfen." at={c(15, 'senkt') - 0.3} bis={c(15, 'senkt') + 0.9} size={36} maxWidth={620} />
      </div>
    </div>
  );
};

const Regel3: React.FC = () => {
  const s = useStil();
  const {p} = useZeit();
  const fuege = c(16, 'füge');
  const flug = p(fuege, 0.8, 'inOut');
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: mix(60, 300, flug), top: mix(50, 330, flug) - Math.sin(flug * Math.PI) * 60, transform: `scale(${mix(1, 0.7, flug)})`, opacity: p(c(16, 'dokument') - 0.3, 0.3)}}>
        <Icon icon="fluent-emoji-flat:page-facing-up" size={150} animate="none" />
      </div>
      <div style={{position: 'absolute', left: 44, right: 44, top: 390, height: 110, borderRadius: 30, border: `4px solid ${flug >= 1 ? s.gut : s.line}`, display: 'flex', alignItems: 'center', padding: '0 30px', fontFamily: s.body, fontSize: 32, fontWeight: 600, color: s.inkSoft, background: '#FFFFFF'}}>
        {flug >= 1 ? <span style={{color: s.ink}}>📄 bericht.pdf · Fasse das zusammen.</span> : 'Nachricht an die KI …'}
      </div>
      <div style={{position: 'absolute', left: 44, top: 530, display: 'flex', alignItems: 'center', gap: 14, fontFamily: s.body, fontSize: 34, fontWeight: 800, color: s.gut, opacity: p(c(16, 'fakten') - 0.4, 0.4)}}>
        <Icon icon="ph:check-circle-fill" size={42} color={s.gut} animate="none" />
        arbeitet mit echten Fakten
      </div>
      <div style={{position: 'absolute', right: 44, top: 60, width: 300, fontFamily: 'Caveat, cursive', fontSize: 50, fontWeight: 700, color: s.inkSoft, transform: 'rotate(-4deg)', opacity: p(c(16, 'gedächtnis'), 0.4)}}>statt aus dem Gedächtnis</div>
    </div>
  );
};

const Regel4: React.FC = () => {
  const s = useStil();
  const {federn} = useZeit();
  const items = [
    {text: 'Eine Zahl', w: 'zahl'},
    {text: 'Ein Datum', w: 'datum'},
    {text: 'Ein Name', w: 'name'},
  ];
  const check = c(17, 'gegen');
  return (
    <div style={{padding: '44px 48px'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
        {items.map((x, i) => {
          const q = federn(c(17, x.w), 'smooth');
          return (
            <div key={x.text} style={{display: 'flex', alignItems: 'center', gap: 22, height: 96, padding: '0 26px', borderRadius: 26, background: '#F7F7F9', opacity: clamp01(q * 2), transform: `translateX(${(1 - q) * -20}px)`}}>
              <div style={{flex: 1, fontFamily: s.head, fontSize: 44, fontWeight: 800, color: s.ink}}>{x.text}</div>
              <Icon icon="ph:magnifying-glass-bold" size={40} color={s.inkSoft} animate="none" />
              <Rund gut size={52} q={federn(check + i * 0.2, 'bouncy')} />
            </div>
          );
        })}
      </div>
      <div style={{marginTop: 34, display: 'flex', alignItems: 'center', gap: 16, fontFamily: s.body, fontSize: 36, fontWeight: 800, color: s.gut, opacity: clamp01(federn(c(17, 'minute')) * 2)}}>
        <Icon icon="ph:timer-fill" size={44} color={s.gut} animate="none" />
        dauert eine Minute
      </div>
    </div>
  );
};

const Regel5: React.FC = () => {
  const s = useStil();
  const {federn, p} = useZeit();
  const felder = [
    {icon: 'ph:stethoscope-fill', text: 'Gesundheit', w: 'gesundheit'},
    {icon: 'ph:scales-fill', text: 'Recht', w: 'recht'},
    {icon: 'ph:coins-fill', text: 'Geld', w: 'geld'},
  ];
  return (
    <div style={{padding: '44px 48px'}}>
      <div style={{display: 'flex', gap: 22}}>
        {felder.map((f) => {
          const q = federn(c(18, f.w), 'bouncy');
          return (
            <div key={f.text} style={{flex: 1, height: 190, borderRadius: 28, background: GELB_TINT, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, transform: `scale(${Math.max(0, q)})`}}>
              <Icon icon={f.icon} size={70} color={GELB_INK} animate="none" />
              <div style={{fontFamily: s.head, fontSize: 36, fontWeight: 800, color: s.ink}}>{f.text}</div>
            </div>
          );
        })}
      </div>
      <div style={{marginTop: 30, fontFamily: s.body, fontSize: 34, fontWeight: 700, color: s.inkSoft, opacity: p(c(18, 'startpunkt') - 0.3, 0.4)}}>KI = höchstens ein Startpunkt</div>
      <div style={{marginTop: 24, display: 'flex', alignItems: 'center', gap: 20, opacity: p(c(18, 'fachperson') - 0.4, 0.4)}}>
        <Kachel icon="ph:user-check-fill" farbe={s.gut} tint={GRUEN_TINT} size={84} />
        <div style={{fontFamily: s.head, fontSize: 44, fontWeight: 800, color: s.ink}}>Entscheidung mit Fachperson</div>
      </div>
    </div>
  );
};

const REGEL_BILDER = [Regel1, Regel2, Regel3, Regel4, Regel5];

const Station13: React.FC = () => {
  const s = useStil();
  const {t, p, federn} = useZeit();
  const a = P(14);
  const aktiv = REGELN.reduce((acc, r, i) => (t >= P(r.n) - 0.3 ? i : acc), -1);
  return (
    <>
      <Kopf text="5 Regeln gegen Halluzinationen" at={a} mark={['5', 'Regeln']} />
      <div style={{position: 'absolute', left: 120, top: 290, display: 'flex', flexDirection: 'column', gap: 18}}>
        {REGELN.map((r, i) => {
          const start = i === 0 ? c(14, 'regel', 1) : P(r.n);
          const q = federn(start - 0.2);
          const istAktiv = i === aktiv;
          const fertig = i < aktiv;
          return (
            <div
              key={r.titel}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                width: 660,
                height: 104,
                boxSizing: 'border-box',
                padding: '0 26px',
                borderRadius: 28,
                background: istAktiv ? GELB_TINT : s.surface,
                boxShadow: istAktiv ? '0 18px 36px rgba(233,168,0,0.18)' : '0 10px 24px rgba(30,35,50,0.06)',
                opacity: clamp01(q * 2) * (fertig || istAktiv ? 1 : 0.9),
                transform: `translateX(${(1 - clamp01(q)) * -30}px) scale(${istAktiv ? 1.03 : 1})`,
                transformOrigin: 'left center',
              }}
            >
              {fertig ? (
                <Rund gut size={60} />
              ) : (
                <div style={{width: 60, height: 60, borderRadius: '50%', background: istAktiv ? GELB : '#EEF0F3', color: istAktiv ? '#FFFFFF' : s.inkSoft, fontFamily: s.head, fontSize: 34, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
              )}
              <div style={{fontFamily: s.head, fontSize: 40, fontWeight: 800, color: s.ink}}>{r.titel}</div>
            </div>
          );
        })}
      </div>
      <Karte x={BUEHNE.x} y={BUEHNE.y} w={BUEHNE.w} h={BUEHNE.h} delay={fr(a + 0.2)} style={{overflow: 'hidden'}}>
        {REGEL_BILDER.map((Bild, i) => {
          const start = P(REGELN[i].n) - 0.4;
          const ende = i < 4 ? P(REGELN[i + 1].n) - 0.4 : ENDE_RASTER + 10;
          if (t < start - 0.1 || t > ende + 0.5) return null;
          const ein = p(start, 0.4);
          const aus = p(ende, 0.35, 'in');
          return (
            <div key={i} style={{position: 'absolute', inset: 0, opacity: ein * (1 - aus), transform: `translateX(${(1 - ein) * 40 - aus * 40}px)`}}>
              <Bild />
            </div>
          );
        })}
      </Karte>
    </>
  );
};

/* ───────────── Station 14 · Merksatz + Abspann ───────────── */

const Station14: React.FC = () => {
  const s = useStil();
  const {t, p, federn} = useZeit();
  const a = P(19);
  const vorher = c(19, 'vorhersager');
  const pruefst = c(19, 'prüft');
  const abo = c(19, 'abonnieren');
  const ende = E(19) + 0.3;
  const raus = p(ende, 0.5);
  const knopf = federn(abo - 0.2, 'bouncy');
  const ring = t > abo ? (((t - abo) % 1.2) + 1.2) % 1.2 / 1.2 : 0;
  return (
    <>
      <div style={{position: 'absolute', left: 120, top: 170, opacity: 1 - raus}}>
        <Auf at={c(19, 'lügt')} style={{position: 'relative'}}>
          <div style={{fontFamily: s.head, fontSize: 64, fontWeight: 800, letterSpacing: '-0.03em', color: s.inkSoft}}>
            Eine KI lügt nicht <span style={{color: s.ink}}>absichtlich.</span>
          </div>
        </Auf>
        <div style={{display: 'flex', gap: 30, marginTop: 50}}>
          <Karte x={0} y={0} w={600} delay={fr(vorher - 0.2)} style={{position: 'relative', padding: '36px 40px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <div style={{width: 84, height: 84, borderRadius: 24, background: '#FFE4D9', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: 40, height: 33, borderRadius: 11, background: s.ki}} />
              </div>
              <div style={{fontFamily: s.head, fontSize: 56, fontWeight: 900, color: s.ink}}>KI</div>
            </div>
            <div style={{marginTop: 20, fontFamily: s.head, fontSize: 46, fontWeight: 800, color: s.ki}}>sagt vorher.</div>
          </Karte>
          <Karte x={0} y={0} w={600} delay={fr(pruefst - 0.4)} style={{position: 'relative', padding: '36px 40px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <Kachel icon="ph:user-fill" farbe="#2E5BC4" tint="#E1EAFF" size={84} />
              <div style={{fontFamily: s.head, fontSize: 56, fontWeight: 900, color: s.ink}}>Du</div>
            </div>
            <div style={{marginTop: 20, fontFamily: s.head, fontSize: 46, fontWeight: 800, color: s.gut}}>prüfst.</div>
          </Karte>
        </div>
        <div style={{marginTop: 60, position: 'relative', display: 'inline-block', transform: `scale(${Math.max(0, knopf)})`, transformOrigin: 'left center'}}>
          {ring > 0 ? <div style={{position: 'absolute', inset: -8, borderRadius: 999, border: `5px solid ${s.ki}`, opacity: 1 - ring, transform: `scale(${1 + ring * 0.25})`}} /> : null}
          <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '24px 48px', borderRadius: 999, background: s.ki, color: '#FFFFFF', fontFamily: s.head, fontSize: 52, fontWeight: 800, boxShadow: '0 16px 30px rgba(255,122,89,0.35)'}}>
            <Icon icon="ph:bell-ringing-fill" size={48} color="#FFFFFF" animate="none" />
            Abonnieren
          </div>
        </div>
      </div>
      {/* Abspann: Platz für die YouTube-Endkarten (Video + Playlist) */}
      <div style={{position: 'absolute', left: 120, top: 150, opacity: p(ende + 0.3, 0.6)}}>
        <div style={{fontFamily: s.head, fontSize: 76, fontWeight: 800, letterSpacing: '-0.035em', color: s.ink}}>Danke fürs Zuschauen!</div>
        <div style={{fontFamily: s.body, fontSize: 36, fontWeight: 600, color: s.inkSoft, marginTop: 10}}>Schau als Nächstes:</div>
      </div>
      {[0, 1].map((i) => {
        const q = federn(ende + 0.5 + i * 0.2, 'smooth');
        return (
          <div key={i} style={{position: 'absolute', left: 120 + i * 720, top: 400, width: 680, height: 382, borderRadius: 28, border: `4px dashed ${s.faint}`, background: 'rgba(255,255,255,0.6)', opacity: clamp01(q * 2), transform: `translateY(${(1 - clamp01(q)) * 30}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: s.body, fontSize: 30, fontWeight: 700, color: s.faint}}>
            {i === 0 ? 'Nächstes Video' : 'Wie denkt eine KI?'}
          </div>
        );
      })}
    </>
  );
};

const STATIONEN = [Station0, Station1, Station2, Station3, Station4, Station5, Station6, Station7, Station8, Station9, Station10, Station11, Station12, Station13, Station14];

/* ───────────── Toki ───────────── */

const TOKI_HOME = [-400, 1620, 1720, 1790, 1720, 1760, 1720, 1720, 1760, 1760, 1720, 1700, 1760, 1760, 1680];
const TOKI_K = 1.12;
const TOKI_AB = c(2, 'toki');

type TokiZustand = {gesicht: Gesicht; armL?: number; armR?: number; look?: Blick; smile?: number; mouthO?: number};
const nachLinks: Blick = [-1, -0.3];

const AUSDRUCK: [number, TokiZustand][] = [
  [0, {gesicht: 'freude', armL: 150, armR: 150}],
  [TOKI_AB + 0.8, {gesicht: 'neutral', smile: 0.9, armR: 140, look: [-0.5, -0.2]}],
  [E(2) - 0.4, {gesicht: 'neutral', look: [1, 0]}],
  // Rückblick
  [P(3) + 0.6, {gesicht: 'neutral', smile: 0.6, look: nachLinks}],
  [c(3, 'nichts'), {gesicht: 'ernst', look: [-1, -0.5]}],
  [c(3, 'vier'), {gesicht: 'neutral', smile: 0.8, armL: 95, look: [-1, 0.1]}],
  [E(3) - 0.2, {gesicht: 'neutral', look: [1, 0]}],
  // Grund 1
  [P(4) + 0.6, {gesicht: 'denken'}],
  [c(4, 'berlin'), {gesicht: 'freude'}],
  [c(4, 'selten'), {gesicht: 'verwirrt', look: [-1, -0.3]}],
  [c(4, 'ungefähre'), {gesicht: 'verwirrt', armL: 75, armR: 75}],
  [E(4) - 0.2, {gesicht: 'neutral', look: [1, 0]}],
  // Grund 2
  [P(5) + 0.6, {gesicht: 'staunen', mouthO: 0.6, look: nachLinks}],
  [c(5, 'wahrscheinlichkeiten'), {gesicht: 'denken', look: [-0.9, -0.6]}],
  [c(5, 'wählt'), {gesicht: 'neutral', smile: 0.5, armL: 70, look: nachLinks}],
  [c(5, 'keine'), {gesicht: 'traurig'}],
  [c(5, 'stimmt'), {gesicht: 'verwirrt', armL: 150}],
  [E(5) - 0.2, {gesicht: 'neutral', look: [1, 0]}],
  // Grund 3
  [P(6) + 0.6, {gesicht: 'staunen', look: nachLinks}],
  [c(6, 'prüfung'), {gesicht: 'neutral', smile: 0.6, look: nachLinks}],
  [c(6, 'raten', 2), {gesicht: 'freude', armL: 150, armR: 40}],
  [c(6, 'geburtstag'), {gesicht: 'denken', look: [-0.8, -0.8]}],
  [c(6, 'tausende'), {gesicht: 'ernst', look: nachLinks}],
  [E(6) - 0.2, {gesicht: 'neutral', look: [1, 0]}],
  // Grund 4
  [P(7) + 0.6, {gesicht: 'neutral', smile: 0.9, armR: 60, look: nachLinks}],
  [c(7, 'menschen'), {gesicht: 'denken', look: [-1, 0.2]}],
  [c(7, 'warnsignal'), {gesicht: 'ernst', look: nachLinks}],
  [E(7) - 0.2, {gesicht: 'neutral', look: [1, 0]}],
  // Test
  [P(8) + 0.6, {gesicht: 'freude', armL: 160, armR: 160}],
  [c(8, 'satz', 1), {gesicht: 'denken', look: [-0.9, -0.5]}],
  [c(8, 'oder'), {gesicht: 'verwirrt', look: nachLinks}],
  [c(8, 'richtig'), {gesicht: 'staunen', armL: 65, armR: 65, look: nachLinks}],
  [c(8, 'genau'), {gesicht: 'ernst'}],
  [E(8) - 0.2, {gesicht: 'neutral', look: [1, 0]}],
  // Bard
  [P(9) + 0.6, {gesicht: 'neutral', look: nachLinks}],
  [c(9, 'falsch'), {gesicht: 'staunen', mouthO: 0.8, armL: 65, armR: 65, look: nachLinks}],
  [c(9, 'börse'), {gesicht: 'traurig'}],
  [E(9) - 0.2, {gesicht: 'neutral', look: [1, 0]}],
  // Air Canada
  [P(10) + 0.6, {gesicht: 'neutral', smile: 0.4, look: nachLinks}],
  [c(10, 'stimmte'), {gesicht: 'ernst', look: nachLinks}],
  [c(10, 'meinte'), {gesicht: 'verwirrt', armL: 150}],
  [c(10, 'haftet'), {gesicht: 'freude', armL: 150, armR: 150}],
  [E(10) - 0.2, {gesicht: 'neutral', look: [1, 0]}],
  // Vorsicht
  [P(11) + 0.6, {gesicht: 'ernst', look: nachLinks}],
  [c(11, 'zahlen'), {gesicht: 'denken', look: [-0.8, -0.6]}],
  [c(11, 'personen'), {gesicht: 'ernst', armL: 80, look: nachLinks}],
  [E(11) - 0.2, {gesicht: 'neutral', look: [1, 0]}],
  // Besser?
  [P(12) + 0.6, {gesicht: 'denken', look: [-0.6, -0.9]}],
  [c(12, 'ja'), {gesicht: 'freude', armL: 150, armR: 150}],
  [c(12, 'hersteller'), {gesicht: 'ernst', look: nachLinks}],
  [E(12) - 0.2, {gesicht: 'neutral', look: [1, 0]}],
  // Falle
  [P(13) + 0.6, {gesicht: 'neutral', smile: 0.6, look: nachLinks}],
  [c(13, 'entschuldigt'), {gesicht: 'staunen', mouthO: 0.7, look: nachLinks}],
  [c(13, 'falsche'), {gesicht: 'traurig'}],
  [c(13, 'nachfragen', 2), {gesicht: 'ernst', armL: 95, look: nachLinks}],
  [E(13) - 0.2, {gesicht: 'neutral', look: [1, 0]}],
  // Regeln
  [P(14) + 0.6, {gesicht: 'freude', armL: 150, armR: 150}],
  [c(14, 'regel'), {gesicht: 'neutral', smile: 0.8, armL: 95, look: nachLinks}],
  [c(14, 'funktioniert'), {gesicht: 'ernst', look: nachLinks}],
  [P(15), {gesicht: 'neutral', smile: 0.8, armL: 95, look: nachLinks}],
  [c(15, 'senkt'), {gesicht: 'freude'}],
  [P(16), {gesicht: 'neutral', smile: 0.8, armL: 95, look: nachLinks}],
  [c(16, 'fakten'), {gesicht: 'freude'}],
  [P(17), {gesicht: 'denken', look: [-0.8, -0.6]}],
  [c(17, 'gegen'), {gesicht: 'freude', armL: 150}],
  [P(18), {gesicht: 'ernst', look: nachLinks}],
  [c(18, 'fachperson'), {gesicht: 'neutral', smile: 0.9, armL: 95, look: nachLinks}],
  [E(18) - 0.2, {gesicht: 'neutral', look: [1, 0]}],
  // Schluss
  [P(19) + 0.6, {gesicht: 'neutral', smile: 0.7, look: nachLinks}],
  [c(19, 'prüft'), {gesicht: 'freude', armL: 150, armR: 150}],
  [c(19, 'abonnieren'), {gesicht: 'neutral', smile: 1, armR: 140}],
  [E(19) + 0.3, {gesicht: 'freude', armL: 160, armR: 160}],
];

const tokiAusdruck = (t: number): TokiZustand => {
  let z = AUSDRUCK[0][1];
  for (const [at, zz] of AUSDRUCK) if (t >= at) z = zz;
  return z;
};

const TokiFigur: React.FC = () => {
  const {t, frame} = useZeit();
  const {fps} = useVideoConfig();
  if (t < TOKI_AB) return null;
  let x = TOKI_HOME[1];
  let hop = 0;
  for (const f of FAHRTEN.slice(1)) {
    if (t >= f.bis) x = TOKI_HOME[f.nach];
    else if (t > f.von) {
      const q = (t - f.von) / (f.bis - f.von);
      x = mix(x, TOKI_HOME[f.nach], EASE.inOut(q));
      hop = Math.abs(Math.sin(q * Math.PI * 3)) * 70;
      break;
    }
  }
  // Abspann: in die Mitte zwischen die Endkarten-Felder (unten)
  const ende = E(19) + 0.3;
  if (t >= ende) {
    const q = clamp01((t - ende) / 0.7);
    x = mix(TOKI_HOME[14], 1740, EASE.inOut(q));
    hop = Math.sin(q * Math.PI) * 100;
  }
  const auftritt = clamp01((t - TOKI_AB) / 0.45);
  const landeAt = TOKI_AB + 0.45;
  const landen = t >= landeAt ? 1 - spring({frame: frame - fr(landeAt), fps, config: {damping: 9, stiffness: 180, mass: 0.6}}) : 0;
  const yAuftritt = t < landeAt ? (1 - auftritt) * 300 - Math.sin(auftritt * Math.PI) * 140 : 0;
  // Winken bei Begrüßung und Abo
  const z = tokiAusdruck(t);
  const winkt = (t > TOKI_AB + 0.8 && t < E(2) - 0.4) || (t > c(19, 'abonnieren') && t < E(19));
  const armR = winkt ? 140 + 22 * Math.sin(t * 9.5) : z.armR;
  const jubel = t >= ende + 0.8 ? Math.abs(Math.sin((t - ende) * 5)) * 36 * Math.max(0, 1 - (t - ende - 0.8) / 3) : 0;
  return <Toki x={x} y={BODEN + yAuftritt - hop - jubel} k={TOKI_K * mix(0.5, 1, auftritt)} sx={1 + landen * 0.16} sy={1 - landen * 0.2} gesicht={z.gesicht} armL={z.armL} armR={armR} look={z.look} smile={z.smile} mouthO={z.mouthO} />;
};

/* ───────────── Töne ───────────── */

type Ton = [number, SfxName, number];
const TOENE: Ton[] = [
  [0.05, 'kPop', 0.3],
  ...[0, 1, 2].map((i) => [0.4 + i * 0.25, 'kTick', 0.3] as Ton),
  ...[0, 1, 2].map((i) => [c(1, 'gibt', 1) + i * 0.18, 'kFalsch', 0.22] as Ton),
  [c(1, 'heraussuchen'), 'kPop', 0.3],
  [c(1, 'erfunden'), 'kLanden', 0.45],
  [c(1, 'namen'), 'kTipp', 0.3],
  [c(1, 'aktenzeichen'), 'kTipp', 0.3],
  [c(1, 'zitaten'), 'kTipp', 0.3],
  [c(1, 'strafe'), 'kMuenzen', 0.4],
  [P(2), 'kLogoKurz', 0.5],
  [c(2, 'halluzinieren'), 'kPop', 0.3],
  [c(2, 'warum'), 'kTick1', 0.35],
  [c(2, 'wo'), 'kTick3', 0.35],
  [c(2, 'regeln'), 'kTick5', 0.35],
  [TOKI_AB, 'kSprung', 0.45],
  [TOKI_AB + 0.45, 'kLanden', 0.5],
  [TOKI_AB + 0.7, 'kHallo', 0.45],
  ...FAHRTEN.map((f) => [f.von, 'kWhoosh', 0.35] as Ton),
  [c(3, 'wahrscheinlichsten'), 'kDing', 0.25],
  [c(3, 'nichts'), 'kFalsch', 0.25],
  ...[0, 1, 2, 3].map((i) => [c(3, 'vier') + i * 0.12, (['kTick1', 'kTick2', 'kTick3', 'kTick4'] as SfxName[])[i], 0.35] as Ton),
  [c(4, 'tausendfach'), 'kTipp', 0.25],
  [c(4, 'deutschland'), 'kDing', 0.3],
  [c(4, 'selten'), 'kPop', 0.3],
  [c(4, 'verschwimmen'), 'kHmm', 0.4],
  [c(5, 'wählt') + 0.3, 'kSwish', 0.3],
  [c(5, 'keine'), 'kFalsch', 0.25],
  [c(5, 'stimmt'), 'kLanden', 0.35],
  [c(6, 'forscher'), 'kPop', 0.3],
  [c(6, 'richtige'), 'kTick1', 0.35],
  [c(6, 'weiß', 1), 'kTick3', 0.35],
  [c(6, 'falsche'), 'kTick5', 0.35],
  [c(6, 'raten', 2), 'kDing', 0.35],
  [c(6, 'geburtstag'), 'kPop', 0.3],
  [c(6, 'tausende') + 0.2, 'kAnstieg', 0.22],
  [c(6, 'besser'), 'kErfolg', 0.3],
  [c(7, 'richtige'), 'kPop', 0.3],
  [c(7, 'erfundene'), 'kPop', 0.3],
  [c(7, 'menschen') - 0.6, 'kDing', 0.25],
  [c(7, 'menschen'), 'kHmm', 0.35],
  [c(7, 'warnsignal'), 'kFalsch', 0.25],
  [c(8, 'satz', 1), 'kPop', 0.3],
  [c(8, 'satz', 2), 'kPop', 0.3],
  [c(8, 'richtig'), 'kErfolg', 0.35],
  [c(8, 'richtig') + 0.3, 'kFalsch', 0.3],
  [c(9, 'falsch'), 'kFalsch', 0.35],
  [c(9, 'börse') - 0.4, 'kAnstieg', 0.2],
  [c(9, 'milliarden'), 'kLanden', 0.35],
  [c(10, 'stimmte'), 'kFalsch', 0.35],
  [c(10, 'meinte'), 'kPop', 0.3],
  [c(10, 'schiedsgericht'), 'kPop', 0.3],
  [c(10, 'haftet'), 'kErfolg', 0.35],
  ...ZONEN.map((z, i) => [c(11, z.w) - 0.15, (['kTick1', 'kTick2', 'kTick3', 'kTick4', 'kTick5'] as SfxName[])[i], 0.35] as Ton),
  [c(12, 'ja'), 'kYay', 0.4],
  [c(12, 'hersteller'), 'kHmm', 0.35],
  [c(13, 'sicher') - 0.3, 'kPop', 0.3],
  [c(13, 'falsche'), 'kFalsch', 0.35],
  [c(13, 'nachfragen', 2), 'kLanden', 0.35],
  ...REGELN.map((r, i) => [(i === 0 ? c(14, 'regel', 1) : P(r.n)) - 0.2, 'kPop', 0.35] as Ton),
  [c(14, 'öffne'), 'kTipp', 0.35],
  [c(14, 'funktioniert'), 'kFalsch', 0.3],
  [c(15, 'senkt') - 0.3, 'kPop', 0.3],
  [c(16, 'füge') + 0.8, 'kLanden', 0.3],
  [c(17, 'gegen'), 'kDing', 0.3],
  [c(18, 'fachperson') - 0.4, 'kErfolg', 0.3],
  [c(19, 'prüft'), 'kYay', 0.4],
  [c(19, 'abonnieren') - 0.2, 'kPop', 0.45],
  [E(19) + 0.3, 'kLogo', 0.6],
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
      {VOICEOVER ? <Audio src={staticFile(VOICEOVER)} /> : null}
      {MUSIK ? <Music src={MUSIK} loop={false} volume={0.15} duckTo={0.3} captions={untertitel} /> : null}
    </AbsoluteFill>
  );
};

const Video: React.FC = () => (
  <StilContext.Provider value={KANAL}>
    <Inhalt />
  </StilContext.Provider>
);

export const projekt: Project = {
  id: 'Warum-Ki-Luegt',
  component: Video,
  format: 'landscape',
  durationInFrames: Math.round(DAUER * FPS),
};
