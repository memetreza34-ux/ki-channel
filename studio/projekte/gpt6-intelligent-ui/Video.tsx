import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, EASE, Icon, mix, pop, progress, Sfx, type EaseName, type SfxName, type SpringName} from '../../kit';
import type {Project} from '../types';
import {KANAL, SERIEN, StilContext, Toki, type Blick, type Gesicht} from '../kanal-look/stil';
import woerter from './woerter.json';

/**
 * „ChatGPT wird zur App – GPT-6 Intelligent UI“ (Serie KI-News, Kanal-Look)
 *
 * Eine durchgehende Welt mit 8 Stationen. Die Kamera fährt von Station zu
 * Station und zoomt innerhalb einer Station auf das, worüber gerade
 * gesprochen wird. Alle Zeiten kommen aus den Wortzeiten von Armans
 * Aufnahme (`woerter.json`, whisper.cpp) – `at('Wort', abSekunde)`.
 * Toki bedient die Oberflächen selbst (schiebt Regler, springt auf den
 * Schalter, hält die Lupe).
 */

const FPS = 30;
const VOICEOVER = 'projekte/gpt6-intelligent-ui/voiceover.wav';
const DAUER = Math.round(333 * FPS);

/* ───────────── Wortzeiten ───────────── */

type Wort = [start: number, ende: number, text: string];
const WOERTER = woerter as Wort[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, '');

/** Startzeit (s) des ersten Worts ab `ab`, das mit `wort` beginnt. */
const at = (wort: string, ab = 0): number => {
  const q = norm(wort);
  const hit = WOERTER.find(([s, , w]) => s >= ab - 0.05 && norm(w).startsWith(q));
  if (!hit) throw new Error(`Wortzeit fehlt: "${wort}" ab ${ab}s`);
  return hit[0];
};

/* ───────────── Farben & Zeit-Helfer ───────────── */

const BLAU = SERIEN.news.farbe;
const BLAU_T = SERIEN.news.tint;
const BLAU_T2 = SERIEN.news.tint2;
const ROT = KANAL.fehler;
const ROT_T = '#FDE3E4';
const GRUEN = KANAL.gut;
const GRUEN_T = '#DDF4E9';
const KORALLE = KANAL.ki;
const KORALLE_T = '#FFE8E2';
const GELB = '#E9A800';
const GELB_T = '#FFF2C8';
const GELB_INK = '#8A6400';
const INK = KANAL.ink;
const SOFT = KANAL.inkSoft;
const LINIE = KANAL.line;

const useT = () => useCurrentFrame() / FPS;
/** 0 → 1 ab Sekunde `start` über `dur` Sekunden. */
const p = (t: number, start: number, dur = 0.45, ease: EaseName = 'out') => progress(t * FPS, start * FPS, dur * FPS, ease);
/** Feder ab Sekunde `start`. */
const sp = (t: number, start: number, preset: SpringName = 'snappy') => pop(t * FPS, FPS, start * FPS, preset);
/** 1 → 0 ab Sekunde `start`. */
const raus = (t: number, start: number, dur = 0.35) => 1 - p(t, start, dur, 'in');
/** Kurzer Puls (0 → 1 → 0) um Sekunde `start`. */
const puls = (t: number, start: number, dur = 0.6) => {
  const q = (t - start) / dur;
  return q < 0 || q > 1 ? 0 : Math.sin(q * Math.PI);
};
const euro = (v: number) => `${v.toLocaleString('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: 2})} €`;

/* ───────────── Stationen & Welt ───────────── */

const W = 2400;
const BODEN = 935;
const S = [0, at('Nehmen'), at('Wie', 77), at('Beispiel', 124), at('Beispiel', 166), at('Beispiel', 209), at('Was', 252), at('Die', 293)];
const PAN_VOR = 0.7;
const PAN_DAUER = 1.15;

/* ───────────── Bausteine ───────────── */

const Panel: React.FC<{x: number; y: number; w: number; h: number; q?: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({x, y, w, h, q = 1, children, style}) => {
  if (q <= 0.001) return null;
  const qq = clamp01(q);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: 34,
        background: '#FFFFFF',
        boxShadow: '0 26px 60px rgba(30,35,50,0.11), 0 2px 6px rgba(30,35,50,0.05)',
        overflow: 'hidden',
        opacity: clamp01(q * 1.6),
        transform: `translateY(${(1 - qq) * 36}px) scale(${mix(0.94, 1, qq)})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Kopfzeile: React.FC<{icon: string; titel: string; farbe?: string; tint?: string; illu?: boolean; rechts?: React.ReactNode}> = ({icon, titel, farbe = BLAU, tint = BLAU_T, illu, rechts}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16, height: 84, padding: '0 30px', borderBottom: `2px solid ${LINIE}`, boxSizing: 'border-box'}}>
    <div style={{width: 52, height: 52, borderRadius: 15, background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Icon icon={icon} size={34} color={farbe} animate="none" />
    </div>
    <div style={{fontSize: 32, fontWeight: 800, color: INK}}>{titel}</div>
    <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12}}>
      {rechts}
      {illu ? <IlluTag /> : null}
    </div>
  </div>
);

const IlluTag: React.FC = () => (
  <div style={{fontSize: 20, fontWeight: 800, letterSpacing: '0.08em', color: SOFT, padding: '6px 12px', borderRadius: 10, background: '#F1F2F5', textTransform: 'uppercase'}}>Illustration</div>
);

const Chip: React.FC<{text: React.ReactNode; icon?: string; farbe?: string; tint?: string; size?: number; q?: number; strike?: number; style?: React.CSSProperties}> = ({
  text,
  icon,
  farbe = BLAU,
  tint = BLAU_T,
  size = 32,
  q = 1,
  strike = 0,
  style,
}) => {
  if (q <= 0.001) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.4,
        padding: `${size * 0.34}px ${size * 0.68}px`,
        borderRadius: 999,
        background: tint,
        color: farbe,
        fontSize: size,
        fontWeight: 800,
        whiteSpace: 'nowrap',
        opacity: clamp01(q * 1.8),
        transform: `scale(${mix(0.6, 1, clamp01(q))})`,
        ...style,
      }}
    >
      {icon ? <Icon icon={icon} size={size * 1.15} color={farbe} animate="none" /> : null}
      <span style={{position: 'relative'}}>
        {text}
        {strike > 0 ? <span style={{position: 'absolute', left: -6, top: '50%', height: Math.max(4, size * 0.13), width: `calc(${strike * 100}% + 12px)`, background: ROT, borderRadius: 4}} /> : null}
      </span>
    </div>
  );
};

const Rund: React.FC<{gut: boolean; size?: number; q?: number; style?: React.CSSProperties}> = ({gut, size = 80, q = 1, style}) =>
  q <= 0.001 ? null : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: gut ? GRUEN : ROT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transform: `scale(${Math.max(0, q)})`,
        boxShadow: '0 10px 24px rgba(30,35,50,0.15)',
        ...style,
      }}
    >
      <Icon icon={gut ? 'ph:check-bold' : 'ph:x-bold'} size={size * 0.56} color="#FFFFFF" animate="none" />
    </div>
  );

/** Stempel, zentriert auf (x, y). */
const Stempel: React.FC<{text: string; q: number; x: number; y: number; farbe?: string; rot?: number; size?: number}> = ({text, q, x, y, farbe = BLAU, rot = -6, size = 56}) => {
  if (q <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        padding: `${size * 0.22}px ${size * 0.5}px`,
        border: `${Math.max(5, size * 0.1)}px solid ${farbe}`,
        borderRadius: size * 0.3,
        color: farbe,
        background: 'rgba(255,255,255,0.94)',
        fontSize: size,
        fontWeight: 900,
        letterSpacing: '0.05em',
        whiteSpace: 'nowrap',
        opacity: clamp01(q * 2),
        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${mix(1.7, 1, clamp01(q))})`,
        boxShadow: '0 12px 30px rgba(30,35,50,0.12)',
        zIndex: 5,
      }}
    >
      {text}
    </div>
  );
};

/** Großes Kapitel-Schild „Beispiel n“ in der Bildmitte. */
const BeispielSchild: React.FC<{t: number; von: number; bis: number; nr: number; text: string; icon: string; farbe: string}> = ({t, von, bis, nr, text, icon, farbe}) => {
  const q = sp(t, von, 'bouncy') * raus(t, bis, 0.3);
  if (q <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 960,
        top: 500,
        transform: `translate(-50%,-50%) scale(${mix(0.5, 1, clamp01(q))})`,
        opacity: clamp01(q * 2),
        display: 'flex',
        alignItems: 'center',
        gap: 34,
        padding: '34px 60px 34px 40px',
        borderRadius: 48,
        background: '#FFFFFF',
        boxShadow: '0 30px 70px rgba(30,35,50,0.18)',
        zIndex: 20,
      }}
    >
      <div style={{width: 150, height: 150, borderRadius: 40, background: farbe, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Icon icon={icon} size={100} color="#FFFFFF" animate="none" />
      </div>
      <div>
        <div style={{fontSize: 40, fontWeight: 800, color: SOFT, letterSpacing: '0.06em', textTransform: 'uppercase'}}>Beispiel {nr}</div>
        <div style={{fontSize: 92, fontWeight: 900, color: INK, letterSpacing: '-0.03em', lineHeight: 1.05}}>{text}</div>
      </div>
    </div>
  );
};

/** Sprechblase des Nutzers. */
const Frage: React.FC<{text: string; q: number; size?: number; style?: React.CSSProperties}> = ({text, q, size = 34, style}) =>
  q <= 0.001 ? null : (
    <div
      style={{
        display: 'inline-block',
        padding: `${size * 0.55}px ${size * 0.85}px`,
        borderRadius: size * 0.9,
        borderBottomRightRadius: 10,
        background: '#ECEEF3',
        fontSize: size,
        fontWeight: 700,
        color: INK,
        opacity: clamp01(q * 1.8),
        transform: `translateY(${(1 - clamp01(q)) * 20}px) scale(${mix(0.85, 1, clamp01(q))})`,
        transformOrigin: 'right bottom',
        ...style,
      }}
    >
      {text}
    </div>
  );

const zahnrad = (r: number, n: number) => {
  const pts: string[] = [];
  const pt = (a: number, rad: number) => `${(Math.cos(a) * rad).toFixed(1)},${(Math.sin(a) * rad).toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const w = Math.PI / n;
    pts.push(pt(a - w * 0.55, r * 0.78), pt(a - w * 0.32, r), pt(a + w * 0.32, r), pt(a + w * 0.55, r * 0.78));
  }
  return `M${pts.join(' L')} Z`;
};

/** Punkt auf einem Linienzug nach Strecke `d`. */
const punktAuf = (pts: [number, number][], d: number): [number, number] => {
  let rest = d;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    if (rest <= len) return [x1 + ((x2 - x1) * rest) / len, y1 + ((y2 - y1) * rest) / len];
    rest -= len;
  }
  return pts[pts.length - 1];
};
const laenge = (pts: [number, number][]) => pts.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);

/* ═════════════ Station 0 · Hook ═════════════ */

const H = {
  frage: 0.3,
  lesen: at('Früher'),
  werkzeug: at('Werkzeug'),
  rechner: at('Rechner'),
  diagramm: at('Diagramm'),
  vergleich: at('Vergleich'),
  auswahl: at('Auswahlmöglichkeiten'),
  klickst: at('klickst'),
  veraenderst: at('veränderst'),
  siehst: at('siehst'),
  intelligent: at('Intelligent'),
  okt: at('7.'),
  gpt6: at('GPT-6'),
  aber: at('Aber'),
  fabrik: at('App-Fabrik'),
  wirklich: at('wirklich'),
  besser: at('besser'),
  klassisch: at('klassische'),
  wir: at('Wir', 32),
  drei: at('drei'),
  technik: at('Technik'),
  grenzen: at('Grenzen'),
};

// Chatfenster im Hook (Bildschirmkoordinaten)
const HW = {x: 470, y: 135, w: 1290, h: 745};
const HKARTE = {top: 230, w: 380, h: 470, lefts: [40, 455, 870]};
const H_REGLER_Y = 420; // in der Karte
const gaesteBei = (t: number) => 8 + 4 * p(t, H.veraenderst, 1.0, 'inOut');
const knopfX = (g: number) => 30 + ((g - 2) / 14) * 320; // in der Karte
const H_KNOPF_SCREEN = (g: number) => ({x: HW.x + HKARTE.lefts[0] + knopfX(g), y: HW.y + HKARTE.top + H_REGLER_Y});

const menge = (gramm: number) => (gramm >= 1000 ? `${(gramm / 1000).toLocaleString('de-DE', {maximumFractionDigits: 1})} kg` : `${Math.round(gramm)} g`);

const LESE_ZEILEN = [
  'Für 8 Gäste brauchst du etwa 800 g Nudeln,',
  '1,6 kg Tomaten und 400 g Käse. Kommen mehr',
  'Gäste, rechnest du pro Person 100 g Nudeln,',
  '200 g Tomaten und 50 g Käse dazu. Für ein',
  'Menü mit Vorspeise solltest du außerdem …',
];

const Station0: React.FC = () => {
  const t = useT();
  const g = gaesteBei(t);
  const gr = Math.round(g);

  // Fenster schrumpft nach links (ab „Aber“) und verschwindet bei „Wir“
  const klein = p(t, H.aber, 0.8, 'inOut');
  const weg = raus(t, H.wir - 0.1, 0.4);
  const fensterTx = -360 * klein;
  const fensterTy = 120 * klein;
  const fensterS = mix(1, 0.6, klein);

  const lesenWeg = raus(t, H.werkzeug - 0.25, 0.35);
  const live = sp(t, H.siehst);

  return (
    <>
      {/* Chatfenster */}
      {weg > 0.001 ? (
        <div style={{position: 'absolute', left: HW.x, top: HW.y, width: HW.w, height: HW.h, transformOrigin: '0 0', transform: `translate(${fensterTx}px, ${fensterTy + (1 - weg) * 60}px) scale(${fensterS})`, opacity: weg}}>
          <Panel x={0} y={0} w={HW.w} h={HW.h}>
            <Kopfzeile icon="ph:chat-circle-dots-fill" titel="Chat · GPT-6" illu />
            {/* Frage */}
            <div style={{position: 'absolute', right: 40, top: 110}}>
              <Frage text="Plane ein Abendessen für 8 Gäste." q={1} size={36} />
            </div>
            {t < H.lesen + 0.2 ? (
              <div style={{position: 'absolute', left: 50, top: 250, display: 'flex', gap: 14}}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{width: 22, height: 22, borderRadius: 11, background: SOFT, opacity: 0.25 + 0.75 * Math.max(0, Math.sin(t * 7 - i * 0.9))}} />
                ))}
              </div>
            ) : null}
            {/* Früher: Antwort zum Lesen */}
            {lesenWeg > 0.001 ? (
              <div style={{position: 'absolute', left: 50, top: 240, transformOrigin: '50% 0%', transform: `scaleY(${mix(0.2, 1, lesenWeg)})`, opacity: lesenWeg}}>
                {LESE_ZEILEN.map((z, i) => {
                  const q = p(t, H.lesen + 0.15 + i * 0.38, 0.45, 'soft');
                  return (
                    <div key={i} style={{fontSize: 34, lineHeight: '64px', color: SOFT, fontWeight: 500, clipPath: `inset(0 ${(1 - q) * 100}% 0 0)`}}>
                      {z}
                    </div>
                  );
                })}
              </div>
            ) : null}
            {/* Jetzt: drei Werkzeuge */}
            <HookRechner t={t} g={g} gr={gr} />
            <HookDiagramm t={t} g={g} live={live} />
            <HookVergleich t={t} />
          </Panel>
        </div>
      ) : null}

      {/* Klick-Welle am Regler */}
      <Welle t={t} start={H.klickst} x={H_KNOPF_SCREEN(8).x} y={H_KNOPF_SCREEN(8).y} />

      {/* Intelligent UI · Datum · GPT-6 – großer Moment über dem Fenster */}
      {(() => {
        const weg2 = raus(t, H.aber - 0.1, 0.35);
        if (t < H.intelligent - 0.1 || weg2 <= 0.001) return null;
        return (
          <div style={{position: 'absolute', inset: 0, opacity: weg2}}>
            <div style={{position: 'absolute', inset: 0, background: 'rgba(247,246,242,0.6)', opacity: p(t, H.intelligent - 0.1, 0.3)}} />
            <Stempel text="INTELLIGENT UI" q={sp(t, H.intelligent, 'bouncy')} x={1115} y={470} farbe={BLAU} size={104} rot={-5} />
            <div style={{position: 'absolute', left: 1115, top: 640, transform: 'translateX(-50%)', display: 'flex', gap: 22}}>
              <Chip text="7. Oktober 2026" icon="ph:calendar-blank-bold" size={44} q={sp(t, H.okt, 'bouncy')} style={{boxShadow: '0 10px 24px rgba(30,35,50,0.10)'}} />
              <Chip text="mit GPT-6" size={44} farbe="#FFFFFF" tint={INK} q={sp(t, H.gpt6, 'bouncy')} />
            </div>
          </div>
        );
      })()}

      <HookFabrik t={t} />
      <HookWaage t={t} />
      <HookFahrplan t={t} />
    </>
  );
};

const Welle: React.FC<{t: number; start: number; x: number; y: number; farbe?: string}> = ({t, start, x, y, farbe = BLAU}) => {
  const q = (t - start) / 0.6;
  if (q < 0 || q > 1) return null;
  return (
    <div style={{position: 'absolute', left: x - 70, top: y - 70, width: 140, height: 140, borderRadius: '50%', border: `6px solid ${farbe}`, opacity: 1 - q, transform: `scale(${mix(0.3, 1.3, q)})`}} />
  );
};

const KarteKopf: React.FC<{icon: string; titel: string; farbe: string; tint: string; rechts?: React.ReactNode}> = ({icon, titel, farbe, tint, rechts}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
    <div style={{width: 46, height: 46, borderRadius: 13, background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Icon icon={icon} size={28} color={farbe} animate="none" />
    </div>
    <div style={{fontSize: 30, fontWeight: 800, color: INK}}>{titel}</div>
    <div style={{marginLeft: 'auto'}}>{rechts}</div>
  </div>
);

const hookKarte = (q: number, i: number): React.CSSProperties => ({
  position: 'absolute',
  left: HKARTE.lefts[i],
  top: HKARTE.top,
  width: HKARTE.w,
  height: HKARTE.h,
  boxSizing: 'border-box',
  padding: '26px 28px',
  borderRadius: 30,
  background: '#FFFFFF',
  border: `3px solid ${LINIE}`,
  boxShadow: '0 16px 36px rgba(30,35,50,0.08)',
  opacity: clamp01(q * 2),
  transform: `scale(${mix(0.6, 1, clamp01(q))})`,
});

const HookRechner: React.FC<{t: number; g: number; gr: number}> = ({t, g, gr}) => {
  const q = sp(t, H.werkzeug + 0.2, 'bouncy');
  if (q <= 0.001) return null;
  const kx = knopfX(g);
  return (
    <div style={{...hookKarte(q, 0), boxShadow: `0 16px 36px rgba(30,35,50,0.08), 0 0 0 ${puls(t, H.rechner, 0.8) * 12}px ${BLAU}44`}}>
      <KarteKopf icon="ph:sliders-horizontal-bold" titel="Rechner" farbe={BLAU} tint={BLAU_T} />
      <div style={{marginTop: 46, fontSize: 30, fontWeight: 700, color: SOFT}}>Gäste</div>
      <div style={{fontSize: 96, fontWeight: 900, color: INK, letterSpacing: '-0.03em', lineHeight: 1.05}}>{gr}</div>
      <div style={{position: 'absolute', left: 30, top: H_REGLER_Y - 8, width: 320, height: 16, borderRadius: 8, background: '#E6E9EF'}}>
        <div style={{width: kx - 30, height: 16, borderRadius: 8, background: BLAU}} />
      </div>
      <div style={{position: 'absolute', left: kx - 22, top: H_REGLER_Y - 22, width: 44, height: 44, borderRadius: '50%', background: '#FFFFFF', border: `7px solid ${BLAU}`, boxSizing: 'border-box', boxShadow: '0 6px 14px rgba(30,35,50,0.18)'}} />
      <div style={{position: 'absolute', left: 30, top: H_REGLER_Y - 70, fontSize: 24, fontWeight: 700, color: SOFT}}>Beispiel</div>
    </div>
  );
};

const HookDiagramm: React.FC<{t: number; g: number; live: number}> = ({t, g, live}) => {
  const q = sp(t, H.diagramm, 'bouncy');
  if (q <= 0.001) return null;
  const zeilen = [
    {name: 'Nudeln', proPerson: 100, farbe: BLAU},
    {name: 'Tomaten', proPerson: 200, farbe: KORALLE},
    {name: 'Käse', proPerson: 50, farbe: GELB},
  ];
  return (
    <div style={{...hookKarte(q, 1), boxShadow: `0 16px 36px rgba(30,35,50,0.08), 0 0 0 ${puls(t, H.siehst, 0.9) * 10}px ${GRUEN}55`}}>
      <KarteKopf icon="ph:chart-bar-bold" titel="Einkauf" farbe={KORALLE} tint={KORALLE_T} rechts={<Chip text="live" size={22} farbe={GRUEN} tint={GRUEN_T} q={live} />} />
      {zeilen.map((z, i) => {
        const wachs = p(t, H.diagramm + 0.25 + i * 0.12, 0.6);
        const breite = (g / 16) * 320 * wachs;
        return (
          <div key={z.name} style={{marginTop: i === 0 ? 40 : 26}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, fontWeight: 700, color: INK}}>
              <span>{z.name}</span>
              <span style={{fontWeight: 900}}>{menge(Math.round(g) * z.proPerson)}</span>
            </div>
            <div style={{marginTop: 10, height: 30, width: 320, borderRadius: 10, background: '#F0F2F6'}}>
              <div style={{height: 30, width: breite, borderRadius: 10, background: z.farbe}} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const HookVergleich: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, H.vergleich, 'bouncy');
  if (q <= 0.001) return null;
  const wahl = p(t, H.auswahl, 0.35, 'inOut');
  const punkte = [
    ['ph:timer-bold', wahl < 0.5 ? '30 Minuten' : '45 Minuten'],
    ['ph:leaf-bold', 'vegetarisch'],
    ['ph:users-three-bold', 'für alle'],
  ];
  return (
    <div style={hookKarte(q, 2)}>
      <KarteKopf icon="ph:scales-bold" titel="Vergleich" farbe={GRUEN} tint={GRUEN_T} />
      <div style={{position: 'relative', marginTop: 34, height: 70, borderRadius: 18, background: '#F0F2F6'}}>
        <div style={{position: 'absolute', top: 6, left: 6 + wahl * 159, width: 153, height: 58, borderRadius: 14, background: '#FFFFFF', boxShadow: '0 4px 10px rgba(30,35,50,0.10)'}} />
        <div style={{position: 'absolute', inset: 0, display: 'flex'}}>
          {['Pasta', 'Pizza'].map((n, i) => (
            <div key={n} style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 800, color: (i === 0) === wahl < 0.5 ? INK : SOFT}}>
              {n}
            </div>
          ))}
        </div>
      </div>
      {punkte.map(([icon, text], i) => (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: i === 0 ? 34 : 20, fontSize: 28, fontWeight: 700, color: INK}}>
          <Icon icon={icon} size={32} color={GRUEN} animate="none" />
          {text}
        </div>
      ))}
    </div>
  );
};

/** „App-Fabrik?“ – Gebäude mit Fließband voller App-Kacheln. */
const HookFabrik: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, H.fabrik - 0.35, 'bouncy') * raus(t, H.wirklich - 0.1, 0.35);
  if (q <= 0.001) return null;
  const band = (t * 110) % 100;
  const farben = [BLAU, KORALLE, GRUEN, GELB, '#8B5CF6'];
  return (
    <div style={{position: 'absolute', left: 1040, top: 190, width: 760, height: 620, opacity: clamp01(q * 2), transform: `scale(${mix(0.6, 1, clamp01(q))})`, transformOrigin: '50% 90%'}}>
      <svg width={760} height={560} viewBox="0 0 760 560" style={{overflow: 'visible'}}>
        {[0, 1, 2].map((i) => {
          const r = ((t * 0.7 + i * 0.33) % 1);
          return <circle key={i} cx={560 + r * 40} cy={110 - r * 120} r={22 + r * 26} fill="#E3E6EC" opacity={1 - r} />;
        })}
        <rect x={530} y={90} width={64} height={150} rx={8} fill="#FFFFFF" stroke={INK} strokeWidth={7} />
        <path d="M110,250 L110,170 L230,240 L230,170 L350,240 L350,170 L470,240 L470,170 L650,250 Z" fill={BLAU_T} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        <rect x={110} y={240} width={540} height={220} rx={10} fill="#FFFFFF" stroke={INK} strokeWidth={7} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={150 + i * 120} y={280} width={80} height={60} rx={10} fill={BLAU_T2} stroke={INK} strokeWidth={5} />
        ))}
        <rect x={330} y={370} width={100} height={90} rx={8} fill={BLAU_T} stroke={INK} strokeWidth={6} />
        <rect x={40} y={480} width={680} height={34} rx={17} fill="#D9DDE5" stroke={INK} strokeWidth={6} />
        {Array.from({length: 8}, (_, i) => {
          const x = 40 + i * 100 + band - 60;
          if (x < 30 || x > 680) return null;
          return <rect key={i} x={x} y={430} width={52} height={52} rx={14} fill={farben[i % farben.length]} stroke={INK} strokeWidth={5} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 545, textAlign: 'center', fontSize: 60, fontWeight: 900, color: INK, letterSpacing: '-0.02em'}}>App-Fabrik?</div>
      <div style={{position: 'absolute', left: 640, top: 0, width: 120, height: 120, borderRadius: '50%', background: KORALLE, color: '#FFFFFF', fontSize: 86, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${Math.max(0, sp(t, H.fabrik + 0.1, 'bouncy'))})`}}>?</div>
    </div>
  );
};

/** Waage: Textantwort gegen Werkzeug. */
const HookWaage: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, H.wirklich, 'snappy') * raus(t, H.wir - 0.1, 0.35);
  if (q <= 0.001) return null;
  const winkel = mix(0, -9, p(t, H.besser, 0.5, 'inOut')) + mix(0, 16, p(t, H.klassisch, 0.6, 'inOut')) + Math.sin(t * 5) * 1.2;
  const rad = (winkel * Math.PI) / 180;
  const cx = 380;
  const cy = 170;
  const arm = 270;
  const lx = cx - Math.cos(rad) * arm;
  const ly = cy - Math.sin(rad) * arm;
  const rx = cx + Math.cos(rad) * arm;
  const ry = cy + Math.sin(rad) * arm;
  const Schale: React.FC<{x: number; y: number; icon: string; text: string; farbe: string; tint: string}> = ({x, y, icon, text, farbe, tint}) => (
    <div style={{position: 'absolute', left: x - 150, top: y + 30, width: 300, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{width: 6, height: 50, background: INK}} />
      <div style={{width: 300, height: 150, borderRadius: '0 0 150px 150px', background: tint, border: `7px solid ${INK}`, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
        <Icon icon={icon} size={56} color={farbe} animate="none" />
        <div style={{fontSize: 32, fontWeight: 900, color: INK}}>{text}</div>
      </div>
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 1040, top: 200, width: 760, height: 640, opacity: clamp01(q * 2), transform: `scale(${mix(0.7, 1, clamp01(q))})`}}>
      <div style={{position: 'absolute', left: cx - 8, top: cy, width: 16, height: 400, background: INK, borderRadius: 8}} />
      <div style={{position: 'absolute', left: cx - 150, top: cy + 390, width: 300, height: 26, background: INK, borderRadius: 13}} />
      <div style={{position: 'absolute', left: cx - arm, top: cy - 8, width: arm * 2, height: 16, background: INK, borderRadius: 8, transform: `rotate(${winkel}deg)`}} />
      <div style={{position: 'absolute', left: cx - 26, top: cy - 26, width: 52, height: 52, borderRadius: '50%', background: KORALLE, border: `6px solid ${INK}`, boxSizing: 'border-box'}} />
      <Schale x={lx} y={ly} icon="ph:text-align-left-bold" text="Text" farbe={SOFT} tint="#F1F2F5" />
      <Schale x={rx} y={ry} icon="ph:sliders-horizontal-bold" text="Werkzeug" farbe={BLAU} tint={BLAU_T} />
      <div style={{position: 'absolute', left: cx - 55, top: -40, width: 110, height: 110, borderRadius: '50%', background: KORALLE, color: '#FFFFFF', fontSize: 78, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>?</div>
    </div>
  );
};

const FAHRPLAN = [
  {x: 260, icon: 'ph:piggy-bank-fill', text: 'Sparen', farbe: GRUEN},
  {x: 560, icon: 'ph:lightbulb-fill', text: 'Lernen', farbe: GELB},
  {x: 860, icon: 'ph:receipt-fill', text: 'Rechnung', farbe: KORALLE},
  {x: 1260, icon: 'ph:gear-six-fill', text: 'Technik', farbe: BLAU},
  {x: 1640, icon: 'ph:warning-fill', text: 'Grenzen', farbe: ROT},
];

/** Fahrplan des Videos: drei Beispiele, Technik, Grenzen. */
const HookFahrplan: React.FC<{t: number}> = ({t}) => {
  if (t < H.wir - 0.1) return null;
  const zeiten = [H.drei, H.drei + 0.3, H.drei + 0.6, H.technik, H.grenzen];
  const linie = p(t, H.wir, 1.2, 'inOut');
  const klammer = sp(t, H.drei + 0.9);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={160} y1={450} x2={mix(160, 1760, linie)} y2={450} stroke="#D3D7DF" strokeWidth={12} strokeDasharray="4 26" strokeLinecap="round" />
      </svg>
      {klammer > 0.001 ? (
        <div style={{position: 'absolute', left: 230, top: 250, width: 660, height: 70, borderTop: `6px solid ${INK}`, borderLeft: `6px solid ${INK}`, borderRight: `6px solid ${INK}`, borderRadius: '24px 24px 0 0', opacity: clamp01(klammer * 2)}}>
          <div style={{position: 'absolute', left: '50%', top: -36, transform: `translateX(-50%) scale(${mix(0.6, 1, clamp01(klammer))})`}}>
            <Chip text="3 Beispiele" size={34} farbe="#FFFFFF" tint={INK} />
          </div>
        </div>
      ) : null}
      {FAHRPLAN.map((s, i) => {
        const q = sp(t, zeiten[i], 'bouncy');
        if (q <= 0.001) return null;
        return (
          <div key={s.text} style={{position: 'absolute', left: s.x - 95, top: 355, width: 190, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${Math.max(0, q)})`, transformOrigin: '50% 30%'}}>
            <div style={{width: 190, height: 190, borderRadius: '50%', background: '#FFFFFF', border: `8px solid ${s.farbe}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 18px 40px rgba(30,35,50,0.12)'}}>
              <Icon icon={s.icon} size={96} color={s.farbe} animate="none" />
            </div>
            <div style={{marginTop: 14, fontSize: 36, fontWeight: 900, color: INK}}>{s.text}</div>
          </div>
        );
      })}
    </>
  );
};

/* ═════════════ Station 1 · Text oder Darstellung? ═════════════ */

const T1 = {
  frage: at('Frage', 40),
  welche: at('Welche'),
  sinnvoll: at('sinnvoll'),
  eine: at('Eine', 44),
  aufz: at('aufzählen'),
  zwingt: at('zwingt'),
  kopf: at('Kopf'),
  mit: at('Mit', 52),
  neben: at('nebeneinander'),
  wichtige: at('Wichtige'),
  statt: at('statt', 57),
  wort: at('Wort', 61),
  wird: at('wird', 61.5),
  aufgabe: at('Aufgabe', 64),
  wenn: at('Wenn', 65),
  frage2: at('Frage', 65.5),
  kurze: at('kurze', 67),
  beste: at('beste'),
  iui: at('Intelligent', 70),
  entscheidung: at('Entscheidung', 72),
  text: at('Text', 73),
  grafik: at('Grafik'),
  interaktion: at('Interaktion', 74.5),
  hilft: at('hilft'),
};

const T1_FRAGE = 'Welche zwei Tarife sind sinnvoll für mich?';

const ABSATZ =
  'Tarif Basis kostet 19 € im Monat und hat 10 GB Daten. Er läuft 24 Monate und hat kein EU-Roaming. Tarif Pro kostet 29 € im Monat, hat unbegrenzte Daten, ist monatlich kündbar und enthält EU-Roaming.'.split(' ');

// Tabelle (Bildschirmkoordinaten der Zellen)
const TAB = {x: 840, y: 290, w: 760, h: 600};
const TAB_ZEILEN = ['Preis', 'Daten', 'Laufzeit', 'EU-Roaming'];
const zelle = (spalte: 0 | 1, zeile: number) => ({x: TAB.x + (spalte === 0 ? 400 : 610), y: TAB.y + 215 + zeile * 92});
const GEDANKEN: {text: string; spalte: 0 | 1; zeile: number}[] = [
  {text: '19 €', spalte: 0, zeile: 0},
  {text: '29 €', spalte: 1, zeile: 0},
  {text: '10 GB', spalte: 0, zeile: 1},
  {text: '∞ GB', spalte: 1, zeile: 1},
  {text: '24 Mon.', spalte: 0, zeile: 2},
  {text: 'monatlich', spalte: 1, zeile: 2},
];
const T1_TOKI_DENKT = 1250;

const Station1: React.FC = () => {
  const t = useT();
  const zweiWeg = raus(t, T1.wenn, 0.4);
  return (
    <>
      {/* Frage oben */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center', opacity: zweiWeg}}>
        <Frage
          size={38}
          q={sp(t, S[1] - 0.3)}
          text={t < T1.welche ? '…' : T1_FRAGE.slice(0, Math.round(T1_FRAGE.length * p(t, T1.welche, T1.sinnvoll + 0.4 - T1.welche, 'soft')))}
          style={{minWidth: 80, textAlign: 'center'}}
        />
      </div>
      {zweiWeg > 0.001 ? (
        <div style={{opacity: zweiWeg, transform: `scale(${mix(0.94, 1, zweiWeg)})`, transformOrigin: '50% 60%', position: 'absolute', inset: 0}}>
          <T1Textantwort t={t} />
          <T1Tabelle t={t} />
        </div>
      ) : null}
      <T1Gedanken t={t} />
      <T1KurzeAntwort t={t} />
      <T1Auswahl t={t} />
    </>
  );
};

const T1Textantwort: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, T1.eine);
  const blass = mix(1, 0.4, p(t, T1.statt, 0.6));
  const wackel = p(t, T1.wort - 0.2, 0.25) * raus(t, T1.wird + 0.5, 0.3);
  const n = ABSATZ.length;
  return (
    <>
      <Panel x={110} y={290} w={690} h={600} q={q}>
        <Kopfzeile icon="ph:text-align-left-bold" titel="Textantwort" farbe={SOFT} tint="#F1F2F5" rechts={<span style={{fontSize: 22, fontWeight: 700, color: SOFT}}>Beispiel-Tarife</span>} />
        <div style={{padding: '26px 34px', fontSize: 33, lineHeight: 1.5, fontWeight: 500, color: INK, opacity: blass}}>
          {ABSATZ.map((w, i) => {
            const an = p(t, T1.eine + 0.3 + (i / n) * (T1.aufz + 0.6 - T1.eine - 0.3), 0.18);
            const dreh = wackel * Math.sin(t * 22 + i * 1.7) * 9;
            const hoch = wackel * Math.abs(Math.sin(t * 15 + i)) * -12;
            return (
              <span key={i} style={{display: 'inline-block', marginRight: '0.28em', opacity: an, transform: `translateY(${hoch}px) rotate(${dreh}deg)`}}>
                {w}
              </span>
            );
          })}
        </div>
      </Panel>
      <Rund gut={false} size={104} q={sp(t, T1.wird + 0.3, 'bouncy')} style={{position: 'absolute', left: 740, top: 250}} />
    </>
  );
};

const T1Tabelle: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, T1.mit);
  return (
    <>
      <Panel x={TAB.x} y={TAB.y} w={TAB.w} h={TAB.h} q={q}>
        <Kopfzeile icon="ph:table-bold" titel="Darstellung" illu />
        <div style={{position: 'absolute', left: 400 - 90, top: 110, width: 180, textAlign: 'center', fontSize: 32, fontWeight: 900, color: BLAU}}>BASIS</div>
        <div style={{position: 'absolute', left: 610 - 90, top: 110, width: 180, textAlign: 'center', fontSize: 32, fontWeight: 900, color: BLAU}}>PRO</div>
        {TAB_ZEILEN.map((z, i) => {
          const mark = sp(t, T1.wichtige + i * 0.35, 'smooth');
          return (
            <React.Fragment key={z}>
              <div style={{position: 'absolute', left: 20, right: 20, top: 215 + i * 92 - 38, height: 76, borderRadius: 18, background: GELB_T, opacity: clamp01(mark) * 0.9}} />
              <div style={{position: 'absolute', left: 40, top: 215 + i * 92 - 22, fontSize: 32, fontWeight: 700, color: SOFT}}>{z}</div>
            </React.Fragment>
          );
        })}
        {/* EU-Roaming als Symbole */}
        <Rund gut={false} size={58} q={sp(t, T1.neben + 0.5, 'bouncy')} style={{position: 'absolute', left: 400 - 29, top: 215 + 3 * 92 - 29}} />
        <Rund gut size={58} q={sp(t, T1.neben + 0.7, 'bouncy')} style={{position: 'absolute', left: 610 - 29, top: 215 + 3 * 92 - 29}} />
      </Panel>
      <Rund gut size={104} q={sp(t, T1.aufgabe, 'bouncy')} style={{position: 'absolute', left: TAB.x + TAB.w - 64, top: TAB.y - 40}} />
    </>
  );
};

/** Werte kreisen in Tokis Kopf und fliegen dann in die Tabelle. */
const T1Gedanken: React.FC<{t: number}> = ({t}) => {
  if (t < T1.zwingt - 0.1 || t > T1.wenn + 0.5) return null;
  const wolke = sp(t, T1.zwingt - 0.1) * raus(t, T1.mit + 0.2, 0.3);
  const tempo = 0.9 + 1.8 * p(t, T1.kopf, 0.5);
  const cx = T1_TOKI_DENKT;
  const cy = 450;
  const weg = raus(t, T1.wenn, 0.4);
  return (
    <>
      {wolke > 0.001 ? (
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01(wolke * 2)}}>
          <ellipse cx={cx} cy={cy} rx={250 * clamp01(wolke)} ry={130 * clamp01(wolke)} fill="#FFFFFF" stroke="#D3D7DF" strokeWidth={6} strokeDasharray="14 12" />
          <circle cx={cx + 30} cy={cy + 160} r={18} fill="#FFFFFF" stroke="#D3D7DF" strokeWidth={5} />
          <circle cx={cx + 12} cy={cy + 196} r={10} fill="#FFFFFF" stroke="#D3D7DF" strokeWidth={4} />
        </svg>
      ) : null}
      {GEDANKEN.map((g, i) => {
        const q = sp(t, T1.zwingt + i * 0.12);
        if (q <= 0.001) return null;
        const winkel = (i / GEDANKEN.length) * Math.PI * 2 + (t - T1.zwingt) * tempo;
        const ox = cx + Math.cos(winkel) * 190;
        const oy = cy + Math.sin(winkel) * 80;
        const flug = p(t, T1.mit + 0.35 + i * 0.16, 0.7, 'inOut');
        const ziel = zelle(g.spalte, g.zeile);
        const x = mix(ox, ziel.x, flug);
        const y = mix(oy, ziel.y, flug) - Math.sin(flug * Math.PI) * 80;
        return (
          <div key={g.text} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${mix(0.5, 1, clamp01(q))})`, opacity: weg}}>
            <Chip text={g.text} size={flug > 0.98 ? 34 : 30} farbe={flug > 0.98 ? INK : BLAU} tint={flug > 0.98 ? '#FFFFFF' : BLAU_T} />
          </div>
        );
      })}
    </>
  );
};

const T1KurzeAntwort: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, T1.wenn + 0.2) * raus(t, T1.iui - 0.1, 0.35);
  if (q <= 0.001) return null;
  return (
    <Panel x={510} y={250} w={900} h={470} q={q}>
      <Kopfzeile icon="ph:chat-circle-dots-fill" titel="Chat" illu />
      <div style={{position: 'absolute', right: 44, top: 120}}>
        <Frage text="Hauptstadt von Frankreich?" size={38} q={sp(t, T1.frage2)} />
      </div>
      <div style={{position: 'absolute', left: 44, top: 250, display: 'flex', alignItems: 'center', gap: 26}}>
        <div style={{padding: '22px 44px', borderRadius: 34, borderBottomLeftRadius: 10, background: KORALLE_T, fontSize: 72, fontWeight: 900, color: INK, transform: `scale(${Math.max(0, sp(t, T1.kurze, 'bouncy'))})`, transformOrigin: 'left bottom'}}>Paris.</div>
        <Chip text="kurz & passend" icon="ph:check-circle-fill" size={32} farbe={GRUEN} tint={GRUEN_T} q={sp(t, T1.beste)} />
      </div>
    </Panel>
  );
};

// Auswahl Text / Grafik / Interaktion
const T1_SPUR = {x: 360, y: 760, w: 1200, h: 100};
const T1_KNOPF_W = 384;
const auswahlIdx = (t: number) => p(t, T1.grafik, 0.4, 'inOut') + p(t, T1.interaktion, 0.4, 'inOut');
const T1_KNOPF_LINKS = (idx: number) => T1_SPUR.x + 8 + idx * 400;

const T1Auswahl: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, T1.iui + 0.1);
  if (q <= 0.001) return null;
  const idx = auswahlIdx(t);
  const knopf = sp(t, T1.text - 0.3);
  const segs = [
    {icon: 'ph:text-align-left-bold', text: 'Text'},
    {icon: 'ph:chart-bar-bold', text: 'Grafik'},
    {icon: 'ph:hand-tap-bold', text: 'Interaktion'},
  ];
  const aktiv = (i: number) => (knopf > 0.5 ? clamp01(1 - Math.abs(idx - i)) : 0);
  return (
    <>
      {segs.map((s, i) => {
        const a = aktiv(i);
        const qq = sp(t, T1.iui + 0.2 + i * 0.15);
        return (
          <div
            key={s.text}
            style={{
              position: 'absolute',
              left: 380 + i * 400,
              top: 250,
              width: 360,
              height: 330,
              boxSizing: 'border-box',
              borderRadius: 32,
              background: '#FFFFFF',
              border: `5px solid ${a > 0.5 ? BLAU : LINIE}`,
              boxShadow: '0 20px 44px rgba(30,35,50,0.10)',
              opacity: clamp01(qq * 2) * mix(0.5, 1, a),
              transform: `translateY(${(1 - clamp01(qq)) * 40}px) scale(${mix(0.96, 1.06, a)})`,
              padding: 34,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 22,
            }}
          >
            {i === 0
              ? [0.95, 0.8, 0.9, 0.6].map((w, k) => <div key={k} style={{height: 26, width: `${w * 100}%`, borderRadius: 13, background: '#D6DAE2'}} />)
              : null}
            {i === 1 ? (
              <div style={{display: 'flex', alignItems: 'flex-end', gap: 22, height: 220}}>
                {[0.45, 0.7, 0.55, 1].map((h, k) => (
                  <div key={k} style={{flex: 1, height: `${h * 100}%`, borderRadius: 12, background: k === 3 ? KORALLE : '#C9D9FF'}} />
                ))}
              </div>
            ) : null}
            {i === 2 ? (
              <>
                <div style={{position: 'relative', height: 16, borderRadius: 8, background: '#E6E9EF'}}>
                  <div style={{width: `${40 + 30 * Math.sin(t * 2.2) ** 2}%`, height: 16, borderRadius: 8, background: BLAU}} />
                </div>
                <div style={{alignSelf: 'flex-start', padding: '16px 30px', borderRadius: 16, background: BLAU, color: '#FFFFFF', fontSize: 30, fontWeight: 800}}>Berechnen</div>
              </>
            ) : null}
          </div>
        );
      })}
      <div style={{position: 'absolute', left: T1_SPUR.x, top: T1_SPUR.y, width: T1_SPUR.w, height: T1_SPUR.h, borderRadius: 50, background: '#E6E9EF', opacity: clamp01(q * 2)}}>
        {knopf > 0.001 ? (
          <div style={{position: 'absolute', left: T1_KNOPF_LINKS(idx) - T1_SPUR.x, top: 8, width: T1_KNOPF_W, height: 84, borderRadius: 42, background: '#FFFFFF', boxShadow: '0 6px 16px rgba(30,35,50,0.16)', transform: `scale(${mix(0.7, 1, clamp01(knopf))})`}} />
        ) : null}
        <div style={{position: 'absolute', inset: 0, display: 'flex'}}>
          {segs.map((s, i) => (
            <div key={s.text} style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 38, fontWeight: 900, color: aktiv(i) > 0.5 ? BLAU : SOFT}}>
              <Icon icon={s.icon} size={42} color={aktiv(i) > 0.5 ? BLAU : SOFT} animate="none" />
              {s.text}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/* ═════════════ Station 2 · Wie die Oberfläche entsteht ═════════════ */

const T2 = {
  wie: S[2],
  bibliothek: at('Bibliothek'),
  compiler: at('Compiler'),
  modell: at('Modell', 88),
  stellst: at('stellst', 90),
  frage: at('Frage', 91.5),
  entscheidet: at('entscheidet'),
  wichtig: at('wichtig', 94),
  darstellung: at('Darstellung', 95.5),
  danach: at('Danach'),
  bausteine: [at('Textfelder'), at('Diagramme'), at('Regler'), at('Schaltflächen')],
  zusammen: at('zusammengesetzt'),
  bedeutet: at('bedeutet', 104),
  installierbare: at('installierbare'),
  programmiert: at('programmiert'),
  anwendung: at('Anwendung'),
  direkt: at('direkt', 112),
  stueck: at('Stück'),
  fertig: at('fertig'),
  schematische: at('schematische'),
  mitschnitt: at('Mitschnitt'),
};

const REGAL = {x: 90, y: 180, w: 430, h: 690};
const BLOECKE = [
  {icon: 'ph:text-t-bold', text: 'Textfeld', farbe: SOFT},
  {icon: 'ph:chart-bar-bold', text: 'Diagramm', farbe: KORALLE},
  {icon: 'ph:sliders-horizontal-bold', text: 'Regler', farbe: BLAU},
  {icon: 'ph:cursor-click-bold', text: 'Knopf', farbe: GRUEN},
  {icon: 'ph:list-bullets-bold', text: 'Liste', farbe: GELB},
  {icon: 'ph:table-bold', text: 'Tabelle', farbe: '#8B5CF6'},
];
const blockPos = (i: number) => ({x: REGAL.x + 25 + (i % 2) * 200, y: REGAL.y + 70 + Math.floor(i / 2) * 210});
const COMP = {x: 720, y: 520, w: 380, h: 340};
const MODELL = {x: 720, y: 180, w: 380, h: 250};
const ANTWORT = {x: 1190, y: 160, w: 640, h: 730};
const SLOTS = [
  {y: 200, h: 90},
  {y: 310, h: 165},
  {y: 495, h: 70},
  {y: 590, h: 80},
];
const T2_FRAGE = 'Plane ein Abendessen für 8 Gäste.';

const Station2: React.FC = () => {
  const t = useT();
  const dimm = mix(1, 0.22, p(t, T2.bedeutet - 0.2, 0.4) * raus(t, T2.anwendung - 0.2, 0.4));
  return (
    <>
      <T2Einstieg t={t} />
      <div style={{opacity: dimm, position: 'absolute', inset: 0}}>
        <T2Regal t={t} />
        <T2Modell t={t} />
        <T2Compiler t={t} />
      </div>
      <T2Vorauswahl t={t} />
      <T2Antwort t={t} />
      <T2Fluege t={t} />
      <T2Handy t={t} />
      <Stempel text="SCHEMATISCHE ILLUSTRATION" q={sp(t, T2.schematische, 'bouncy')} x={905} y={640} farbe={SOFT} size={46} rot={-7} />
      <div style={{position: 'absolute', left: 905, top: 750, transform: 'translateX(-50%)', zIndex: 6}}>
        <Chip text="kein Mitschnitt der echten Oberfläche" icon="ph:video-camera-slash-bold" size={30} farbe={SOFT} tint="#FFFFFF" q={sp(t, T2.mitschnitt)} style={{boxShadow: '0 10px 26px rgba(30,35,50,0.12)'}} />
      </div>
    </>
  );
};

/** Einstieg: kleine App-Antwort mit Fragezeichen, fliegt dann ins Antwortfenster. */
const T2Einstieg: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, S[2] - 0.4);
  const flug = p(t, T2.bibliothek - 1.0, 0.8, 'inOut');
  const weg = raus(t, T2.bibliothek - 0.3, 0.3);
  if (q * weg <= 0.001) return null;
  const x = mix(960, ANTWORT.x + ANTWORT.w / 2, flug);
  const y = mix(500, ANTWORT.y + ANTWORT.h / 2, flug);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${mix(0.6, 1, clamp01(q)) * mix(1, 0.7, flug)})`, opacity: clamp01(q * 2) * weg}}>
      <div style={{width: 640, height: 360, borderRadius: 40, background: '#FFFFFF', boxShadow: '0 30px 70px rgba(30,35,50,0.16)', padding: 44, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 34}}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 20, height: 150}}>
          {[0.4, 0.75, 0.55, 1, 0.8].map((h, i) => (
            <div key={i} style={{flex: 1, height: `${h * 100}%`, borderRadius: 12, background: i === 3 ? KORALLE : '#C9D9FF'}} />
          ))}
        </div>
        <div style={{position: 'relative', height: 18, borderRadius: 9, background: '#E6E9EF'}}>
          <div style={{width: '62%', height: 18, borderRadius: 9, background: BLAU}} />
        </div>
      </div>
      <div style={{position: 'absolute', right: -50, top: -50, width: 130, height: 130, borderRadius: '50%', background: KORALLE, color: '#FFFFFF', fontSize: 90, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${Math.max(0, sp(t, S[2] + 0.2, 'bouncy'))})`}}>?</div>
    </div>
  );
};

const Block: React.FC<{i: number; scale?: number; style?: React.CSSProperties}> = ({i, scale = 1, style}) => {
  const b = BLOECKE[i];
  return (
    <div
      style={{
        width: 180,
        height: 130,
        borderRadius: 24,
        background: '#FFFFFF',
        border: `4px solid ${b.farbe}`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        boxShadow: '0 10px 22px rgba(30,35,50,0.10)',
        transform: `scale(${scale})`,
        ...style,
      }}
    >
      <Icon icon={b.icon} size={54} color={b.farbe} animate="none" />
      <div style={{fontSize: 28, fontWeight: 800, color: INK}}>{b.text}</div>
    </div>
  );
};

const T2Regal: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, T2.bibliothek - 0.3);
  if (q <= 0.001) return null;
  return (
    <div style={{position: 'absolute', left: REGAL.x, top: REGAL.y, width: REGAL.w, height: REGAL.h, opacity: clamp01(q * 2), transform: `translateY(${(1 - clamp01(q)) * 40}px)`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 28, background: '#F3EEE4', border: '6px solid #D9C7A6', boxSizing: 'border-box'}} />
      {[0, 1, 2].map((r) => (
        <div key={r} style={{position: 'absolute', left: 0, right: 0, top: 70 + r * 210 + 140, height: 18, background: '#D9C7A6'}} />
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: -30, display: 'flex', justifyContent: 'center'}}>
        <Chip text="Bausteine" icon="ph:books-bold" size={32} farbe="#FFFFFF" tint={INK} />
      </div>
      {BLOECKE.map((b, i) => {
        const qq = sp(t, T2.bibliothek + 0.15 + i * 0.22, 'bouncy');
        const pos = blockPos(i);
        return <Block key={b.text} i={i} scale={Math.max(0, qq)} style={{position: 'absolute', left: pos.x - REGAL.x, top: pos.y - REGAL.y}} />;
      })}
    </div>
  );
};

const T2Modell: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, T2.modell - 0.2, 'bouncy');
  if (q <= 0.001) return null;
  const denkt = p(t, T2.entscheidet, 0.3) * raus(t, T2.danach, 0.4);
  return (
    <div style={{position: 'absolute', left: MODELL.x, top: MODELL.y, width: MODELL.w, height: MODELL.h, transform: `scale(${Math.max(0, q)})`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 34, background: '#FFFFFF', border: `5px solid ${BLAU}`, boxSizing: 'border-box', boxShadow: '0 22px 46px rgba(30,35,50,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22}}>
        <div style={{transform: `rotate(${denkt * Math.sin(t * 9) * 8}deg)`}}>
          <Icon icon="ph:brain-duotone" size={120} color={BLAU} animate="none" />
        </div>
        <div style={{fontSize: 44, fontWeight: 900, color: INK}}>Modell</div>
      </div>
      {denkt > 0.05 ? (
        <div style={{position: 'absolute', right: 26, top: 22, display: 'flex', gap: 8, opacity: denkt}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{width: 14, height: 14, borderRadius: 7, background: BLAU, opacity: 0.35 + 0.65 * Math.max(0, Math.sin(t * 8 - i * 0.9))}} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

const T2Compiler: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, T2.compiler - 0.2, 'bouncy');
  if (q <= 0.001) return null;
  const arbeitet = T2.bausteine.some((b) => t > b && t < b + 0.9) || (t > T2.stueck && t < T2.fertig) ? 1 : 0;
  const drehung = t * (40 + arbeitet * 160);
  // Tokenstrom vom Modell in den Compiler
  const strom = t > T2.modell + 0.3 && (t < T2.danach + 6 || (t > T2.stueck && t < T2.fertig));
  return (
    <>
      {strom
        ? Array.from({length: 4}, (_, i) => {
            const r = (t * 1.6 + i / 4) % 1;
            return <div key={i} style={{position: 'absolute', left: MODELL.x + MODELL.w / 2 - 9, top: MODELL.y + MODELL.h + r * (COMP.y - MODELL.y - MODELL.h) - 9, width: 18, height: 18, borderRadius: 9, background: BLAU, opacity: Math.sin(r * Math.PI)}} />;
          })
        : null}
      <div style={{position: 'absolute', left: COMP.x, top: COMP.y, width: COMP.w, height: COMP.h, transform: `scale(${Math.max(0, q)})`, transformOrigin: '50% 100%'}}>
        <svg width={COMP.w} height={COMP.h} style={{overflow: 'visible'}}>
          <path d={`M110,0 L270,0 L240,60 L140,60 Z`} fill={BLAU_T} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          <rect x={10} y={56} width={360} height={230} rx={34} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
          <rect x={366} y={150} width={50} height={60} rx={10} fill={BLAU_T} stroke={INK} strokeWidth={6} />
          <g transform={`translate(120,150) rotate(${drehung})`}>
            <path d={zahnrad(62, 10)} fill={KORALLE} stroke={INK} strokeWidth={5} />
            <circle r={18} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
          </g>
          <g transform={`translate(240,190) rotate(${-drehung * 1.25 + 18})`}>
            <path d={zahnrad(48, 8)} fill={GELB} stroke={INK} strokeWidth={5} />
            <circle r={14} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
          </g>
          <rect x={280} y={80} width={60} height={26} rx={13} fill={arbeitet ? GRUEN : '#D3D7DF'} />
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, top: 296, textAlign: 'center', fontSize: 40, fontWeight: 900, color: INK}}>Compiler</div>
      </div>
    </>
  );
};

/** Vor dem Antwortfenster: was wichtig ist und welche Darstellung passt. */
const T2Vorauswahl: React.FC<{t: number}> = ({t}) => {
  const frageQ = sp(t, T2.stellst) * raus(t, T2.frage + 0.15, 0.25);
  const flug = p(t, T2.frage, 0.55, 'inOut');
  const weg = raus(t, T2.danach - 0.1, 0.35);
  const infos = ['Gäste', 'Zutaten', 'Mengen'];
  const formen = [
    {icon: 'ph:text-align-left-bold', ok: false},
    {icon: 'ph:chart-bar-bold', ok: true},
    {icon: 'ph:sliders-horizontal-bold', ok: true},
  ];
  return (
    <>
      {frageQ > 0.001 && t > T2.stellst ? (
        <div style={{position: 'absolute', left: mix(ANTWORT.x + 130, MODELL.x + 80, flug), top: mix(ANTWORT.y + 104, MODELL.y + 60, flug), transform: `scale(${mix(1, 0.35, flug)})`, transformOrigin: '0 0', opacity: frageQ, zIndex: 8}}>
          <Frage text={T2_FRAGE} q={1} size={30} style={{boxShadow: `0 0 0 ${puls(t, T2.stellst, 0.7) * 10}px ${BLAU}44`}} />
        </div>
      ) : null}
      {weg > 0.001 ? (
        <div style={{position: 'absolute', left: ANTWORT.x + 34, top: ANTWORT.y + 210, width: 580, opacity: weg, zIndex: 3}}>
          <div style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
            {infos.map((x, i) => (
              <Chip key={x} text={x} icon="ph:check-bold" size={34} q={sp(t, T2.wichtig + i * 0.2, 'bouncy')} />
            ))}
          </div>
          <div style={{display: 'flex', gap: 40, marginTop: 50}}>
            {formen.map((f, i) => {
              const q = sp(t, T2.darstellung + i * 0.15, 'bouncy');
              if (q <= 0.001) return null;
              const wahl = p(t, T2.darstellung + 0.6, 0.3);
              return (
                <div key={i} style={{position: 'relative', width: 150, height: 150, borderRadius: 34, background: '#FFFFFF', border: `5px solid ${f.ok && wahl > 0.5 ? GRUEN : LINIE}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${Math.max(0, q)})`, opacity: f.ok ? 1 : mix(1, 0.35, wahl), boxShadow: '0 14px 30px rgba(30,35,50,0.10)'}}>
                  <Icon icon={f.icon} size={76} color={f.ok ? BLAU : SOFT} animate="none" />
                  {f.ok ? <Rund gut size={52} q={sp(t, T2.darstellung + 0.6 + i * 0.1, 'bouncy')} style={{position: 'absolute', right: -16, top: -16}} /> : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
};

const SlotInhalt: React.FC<{i: number; t: number}> = ({i, t}) => {
  if (i === 0)
    return (
      <div style={{height: '100%', borderRadius: 18, border: `3px solid ${LINIE}`, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 32, fontWeight: 700, color: INK, boxSizing: 'border-box'}}>
        8 Gäste · Abendessen
        <div style={{width: 4, height: 38, marginLeft: 6, background: BLAU, opacity: Math.sin(t * 8) > 0 ? 1 : 0}} />
      </div>
    );
  if (i === 1)
    return (
      <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', gap: 22, padding: '0 10px', boxSizing: 'border-box'}}>
        {[0.45, 0.75, 0.6, 1, 0.8].map((h, k) => (
          <div key={k} style={{flex: 1, height: `${h * 100}%`, borderRadius: 12, background: k === 3 ? KORALLE : '#C9D9FF'}} />
        ))}
      </div>
    );
  if (i === 2)
    return (
      <div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
        <div style={{position: 'relative', flex: 1, height: 18, borderRadius: 9, background: '#E6E9EF'}}>
          <div style={{width: '58%', height: 18, borderRadius: 9, background: BLAU}} />
          <div style={{position: 'absolute', left: 'calc(58% - 22px)', top: -13, width: 44, height: 44, borderRadius: 22, background: '#FFFFFF', border: `7px solid ${BLAU}`, boxSizing: 'border-box'}} />
        </div>
      </div>
    );
  return (
    <div style={{height: '100%', borderRadius: 20, background: GRUEN, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 34, fontWeight: 800}}>
      <Icon icon="ph:shopping-cart-bold" size={38} color="#FFFFFF" animate="none" />
      Einkaufsliste erstellen
    </div>
  );
};

const STUECK = [0, 0.5, 0.8, 1.4];
const ankunft = (i: number) => T2.bausteine[i] + 0.95;

const T2Antwort: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, T2.bibliothek - 0.6);
  if (q <= 0.001) return null;
  const tippt = t < T2.wichtig - 0.1;
  const reset = T2.stueck - 0.45;
  const balken = p(t, T2.stueck, T2.fertig - T2.stueck, 'soft');
  const imChat = sp(t, T2.direkt);
  return (
    <>
      <Panel x={ANTWORT.x} y={ANTWORT.y} w={ANTWORT.w} h={ANTWORT.h} q={q} style={{border: `${imChat > 0.5 ? 5 : 0}px solid ${KORALLE}`}}>
        <Kopfzeile icon="ph:chat-circle-dots-fill" titel="Chat" illu />
        <div style={{position: 'absolute', right: 30, top: 104}}>
          <Frage text={T2_FRAGE} q={1} size={30} />
        </div>
        {tippt ? (
          <div style={{position: 'absolute', left: 34, top: 215, display: 'flex', gap: 12}}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{width: 20, height: 20, borderRadius: 10, background: SOFT, opacity: 0.25 + 0.75 * Math.max(0, Math.sin(t * 7 - i * 0.9))}} />
            ))}
          </div>
        ) : null}
        {SLOTS.map((s, i) => {
          const erst = sp(t, ankunft(i), 'bouncy');
          const neu = sp(t, T2.stueck + STUECK[i], 'bouncy');
          const sichtbar = t < reset ? erst : t < T2.stueck + STUECK[i] ? raus(t, reset, 0.25) : neu;
          return (
            <div key={i} style={{position: 'absolute', left: 30, right: 30, top: s.y, height: s.h, opacity: clamp01(sichtbar * 2), transform: `scale(${mix(0.7, 1, clamp01(sichtbar))})`}}>
              <SlotInhalt i={i} t={t} />
            </div>
          );
        })}
        {t > T2.stueck - 0.2 ? (
          <div style={{position: 'absolute', left: 30, right: 30, bottom: 30, display: 'flex', alignItems: 'center', gap: 18, opacity: p(t, T2.stueck - 0.2, 0.3)}}>
            <div style={{flex: 1, height: 16, borderRadius: 8, background: '#E6E9EF'}}>
              <div style={{width: `${balken * 100}%`, height: 16, borderRadius: 8, background: balken >= 1 ? GRUEN : BLAU}} />
            </div>
            <div style={{fontSize: 28, fontWeight: 900, color: balken >= 1 ? GRUEN : SOFT, width: 90, textAlign: 'right'}}>{balken >= 1 ? 'fertig' : `${Math.round(balken * 100)} %`}</div>
          </div>
        ) : null}
      </Panel>
      <Rund gut size={96} q={sp(t, T2.zusammen, 'bouncy') * raus(t, T2.bedeutet, 0.3)} style={{position: 'absolute', left: ANTWORT.x + ANTWORT.w - 70, top: ANTWORT.y - 30}} />
      <div style={{position: 'absolute', left: ANTWORT.x + ANTWORT.w / 2, top: ANTWORT.y - 40, transform: 'translateX(-50%)'}}>
        <Chip text="lebt direkt im Chat" icon="ph:chat-circle-dots-fill" size={30} farbe="#FFFFFF" tint={KORALLE} q={imChat} />
      </div>
    </>
  );
};

/** Bausteine fliegen vom Regal durch den Compiler in die Antwort. */
const T2Fluege: React.FC<{t: number}> = ({t}) => {
  return (
    <>
      {T2.bausteine.map((start, i) => {
        if (t < start || t > start + 1.0) return null;
        const quelle = blockPos(i);
        const trichter = {x: COMP.x + COMP.w / 2 - 90, y: COMP.y - 70};
        const auslass = {x: COMP.x + COMP.w, y: COMP.y + 150};
        const slot = {x: ANTWORT.x + 30 + (ANTWORT.w - 60) / 2 - 90, y: ANTWORT.y + SLOTS[i].y + SLOTS[i].h / 2 - 65};
        const a = p(t, start, 0.42, 'inOut');
        const b = p(t, start + 0.52, 0.42, 'inOut');
        let x: number;
        let y: number;
        let s = 0.8;
        if (t < start + 0.42) {
          x = mix(quelle.x, trichter.x, a);
          y = mix(quelle.y, trichter.y, a) - Math.sin(a * Math.PI) * 120;
        } else if (t < start + 0.52) {
          return null;
        } else {
          x = mix(auslass.x, slot.x, b);
          y = mix(auslass.y, slot.y, b) - Math.sin(b * Math.PI) * 80;
          s = mix(0.5, 0.8, b);
        }
        return <Block key={i} i={i} scale={s} style={{position: 'absolute', left: x, top: y, zIndex: 8}} />;
      })}
    </>
  );
};

const T2Handy: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, T2.bedeutet, 'bouncy') * raus(t, T2.anwendung - 0.4, 0.35);
  if (q <= 0.001) return null;
  const knopf = sp(t, T2.installierbare, 'bouncy');
  return (
    <div style={{position: 'absolute', left: 760, top: 150, width: 330, height: 660, transform: `translateY(${(1 - clamp01(q)) * 80}px)`, opacity: clamp01(q * 2), zIndex: 7}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 54, background: INK, padding: 16, boxSizing: 'border-box'}}>
        <div style={{width: '100%', height: '100%', borderRadius: 40, background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 90, boxSizing: 'border-box', gap: 20}}>
          <div style={{width: 130, height: 130, borderRadius: 34, background: KORALLE, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon icon="ph:cooking-pot-fill" size={80} color="#FFFFFF" animate="none" />
          </div>
          <div style={{fontSize: 32, fontWeight: 900, color: INK}}>Dinner-Planer</div>
          <div style={{marginTop: 40, padding: '18px 40px', borderRadius: 20, background: BLAU, color: '#FFFFFF', fontSize: 30, fontWeight: 800, transform: `scale(${Math.max(0, knopf)})`}}>Installieren</div>
        </div>
      </div>
      <Rund gut={false} size={190} q={sp(t, T2.programmiert, 'bouncy')} style={{position: 'absolute', left: 70, top: 230}} />
    </div>
  );
};

/* ═════════════ Station 3 · Sparrechner ═════════════ */

const T3 = {
  sparen: at('Sparen'),
  formel: at('Formel'),
  betrag: at('Betrag', 132),
  zeitraum: at('Zeitraum'),
  diagramm: at('Diagramm', 135),
  hier: at('Hier', 140),
  ohne: at('Ohne'),
  rendite: at('Rendite'),
  steuern: at('Steuern'),
  gebuehren: at('Gebühren'),
  prognose: at('Anlageprognose'),
  zehn: at('10', 148),
  zwanzig: at('20', 149),
  zweihundert: at('200', 151),
  aenderst: at('Änderst'),
  monatsbetrag: at('Monatsbetrag'),
  dreissig: at('30', 154.5),
  dreihundert: at('300', 156),
  mehrwert: at('Mehrwert'),
  ursache: at('Ursache'),
  auswirkung: at('Auswirkung'),
  gleichzeitig: at('gleichzeitig'),
};

const SR = {x: 200, y: 140, w: 1520, h: 740};
const SR_REGLER_Y = 650; // im Fenster
/** Betrag: kurzes Antippen bei „Betrag“ (20 → 24 → 20), dann Toki schiebt auf 30 €. */
const betragBei = (t: number) => {
  const tipp = clamp01((t - T3.betrag) / 1.4);
  return 20 + 4 * Math.sin(tipp * Math.PI) + 10 * p(t, T3.monatsbetrag, T3.dreissig + 0.3 - T3.monatsbetrag, 'inOut');
};
const srKnopfX = (a: number) => 50 + (a / 50) * 1420; // im Fenster
const SR_KNOPF_SCREEN = (a: number) => ({x: SR.x + srKnopfX(a), y: SR.y + SR_REGLER_Y});

const Station3: React.FC = () => {
  const t = useT();
  const a = betragBei(t);
  const ar = Math.round(a);
  const q = sp(t, S[3] - 0.4);
  const ring = (start: number) => puls(t, start, 0.8);
  const ursache = sp(t, T3.ursache, 'bouncy');
  const wirkung = sp(t, T3.auswirkung, 'bouncy');
  const pfeil = p(t, T3.gleichzeitig - 0.2, 0.6, 'inOut');
  const knopf = SR_KNOPF_SCREEN(a);
  return (
    <>
      <Panel x={SR.x} y={SR.y} w={SR.w} h={SR.h} q={q}>
        <Kopfzeile icon="ph:piggy-bank-fill" titel="Sparrechner" farbe={GRUEN} tint={GRUEN_T} illu rechts={<Chip text="Beispiel" size={24} farbe={GELB_INK} tint={GELB_T} style={{transform: `scale(${1 + ring(T3.hier + 0.8) * 0.25})`}} />} />
        {/* Linke Spalte */}
        <div style={{position: 'absolute', left: 50, top: 115, fontSize: 32, fontWeight: 700, color: SOFT}}>Monatsbetrag</div>
        <div style={{position: 'absolute', left: 46, top: 150, fontSize: 116, fontWeight: 900, color: BLAU, letterSpacing: '-0.03em', transformOrigin: 'left center', transform: `scale(${1 + (ring(T3.betrag) + ring(T3.zwanzig)) * 0.12})`}}>{ar} €</div>
        <div style={{position: 'absolute', left: 50, top: 300, display: 'flex', alignItems: 'center', gap: 14, transformOrigin: 'left center', transform: `scale(${1 + (ring(T3.zeitraum) + ring(T3.zehn)) * 0.14})`}}>
          <span style={{fontSize: 40, fontWeight: 800, color: SOFT}}>×</span>
          <div style={{display: 'flex', alignItems: 'center', borderRadius: 999, border: `4px solid ${LINIE}`, overflow: 'hidden'}}>
            <span style={{padding: '6px 18px', fontSize: 34, fontWeight: 900, color: SOFT, background: '#F1F2F5'}}>−</span>
            <span style={{padding: '6px 24px', fontSize: 36, fontWeight: 900, color: INK}}>10 Monate</span>
            <span style={{padding: '6px 18px', fontSize: 34, fontWeight: 900, color: SOFT, background: '#F1F2F5'}}>+</span>
          </div>
        </div>
        <div style={{position: 'absolute', left: 50, top: 380, fontSize: 32, fontWeight: 700, color: SOFT}}>Ersparnis</div>
        <div style={{position: 'absolute', left: 46, top: 410, fontSize: 100, fontWeight: 900, color: GRUEN, letterSpacing: '-0.03em', transformOrigin: 'left center', transform: `scale(${1 + (ring(T3.zweihundert) + ring(T3.dreihundert)) * 0.14})`}}>{ar * 10} €</div>
        {/* Diagramm */}
        <SrDiagramm t={t} a={a} />
        {/* Regler */}
        <div style={{position: 'absolute', left: 50, top: SR_REGLER_Y - 9, width: 1420, height: 18, borderRadius: 9, background: '#E6E9EF'}}>
          <div style={{width: srKnopfX(a) - 50, height: 18, borderRadius: 9, background: BLAU}} />
        </div>
        {[0, 10, 20, 30, 40, 50].map((v) => (
          <div key={v} style={{position: 'absolute', left: srKnopfX(v) - 40, width: 80, top: SR_REGLER_Y + 34, textAlign: 'center', fontSize: 26, fontWeight: 700, color: SOFT}}>{v} €</div>
        ))}
        <div style={{position: 'absolute', left: srKnopfX(a) - 28, top: SR_REGLER_Y - 28, width: 56, height: 56, borderRadius: '50%', background: '#FFFFFF', border: `8px solid ${BLAU}`, boxSizing: 'border-box', boxShadow: `0 6px 14px rgba(30,35,50,0.18), 0 0 0 ${ring(T3.betrag) * 18}px ${KORALLE}44`}} />
      </Panel>

      {/* Formel – wird ersetzt */}
      {(() => {
        const fq = sp(t, T3.formel - 0.35) * raus(t, T3.betrag - 0.25, 0.3);
        if (fq <= 0.001) return null;
        return (
          <div style={{position: 'absolute', left: 860, top: 330, width: 800, padding: '40px 0', borderRadius: 34, background: '#FFFFFF', boxShadow: '0 26px 60px rgba(30,35,50,0.16)', textAlign: 'center', fontSize: 46, fontWeight: 800, color: SOFT, opacity: clamp01(fq * 2), transform: `scale(${mix(0.8, 1, clamp01(fq))})`, zIndex: 4}}>
            Ersparnis = Betrag × Monate
          </div>
        );
      })()}

      {/* Münzen bei „Sparen“ */}
      {[0, 1, 2].map((i) => {
        const fall = p(t, T3.sparen - 0.3 + i * 0.18, 0.55, 'in');
        if (fall <= 0 || fall >= 1) return null;
        return (
          <div key={i} style={{position: 'absolute', left: 300 + i * 70, top: mix(60, 300, fall), opacity: 1 - fall * 0.6}}>
            <Icon icon="ph:coin-fill" size={70} color={GELB} animate="none" />
          </div>
        );
      })}

      {/* Ohne Rendite, Steuern, Gebühren */}
      <div style={{position: 'absolute', right: 60, top: 36, display: 'flex', gap: 16, opacity: raus(t, T3.zehn - 0.2, 0.35)}}>
        <Chip text="Rendite" size={32} farbe={SOFT} tint="#FFFFFF" q={sp(t, T3.ohne)} strike={p(t, T3.rendite, 0.3)} />
        <Chip text="Steuern" size={32} farbe={SOFT} tint="#FFFFFF" q={sp(t, T3.ohne + 0.15)} strike={p(t, T3.steuern, 0.3)} />
        <Chip text="Gebühren" size={32} farbe={SOFT} tint="#FFFFFF" q={sp(t, T3.ohne + 0.3)} strike={p(t, T3.gebuehren, 0.3)} />
        <Chip text="keine Prognose" icon="ph:prohibit-bold" size={32} farbe={ROT} tint={ROT_T} q={sp(t, T3.prognose, 'bouncy')} />
      </div>

      {/* Ursache → Wirkung */}
      {ursache > 0.001 ? (
        <div style={{position: 'absolute', left: knopf.x, top: knopf.y - 70, transform: `translate(-50%,-100%) scale(${Math.max(0, ursache)})`, transformOrigin: '50% 100%', zIndex: 6}}>
          <Chip text="Ursache" icon="ph:hand-pointing-bold" size={36} farbe="#FFFFFF" tint={KORALLE} />
        </div>
      ) : null}
      {wirkung > 0.001 ? (
        <div style={{position: 'absolute', left: 1500, top: 230, transform: `translate(-50%,-50%) scale(${Math.max(0, wirkung)})`, zIndex: 6}}>
          <Chip text="Wirkung" icon="ph:chart-line-up-bold" size={36} farbe="#FFFFFF" tint={GRUEN} />
        </div>
      ) : null}
      {pfeil > 0.001 ? (
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, zIndex: 5}}>
          <path d={`M${knopf.x + 90},${knopf.y - 140} C${knopf.x + 260},${knopf.y - 330} 1330,420 1430,270`} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 * (1 - pfeil)} />
          {pfeil > 0.95 ? <path d="M1398,262 L1432,268 L1430,302" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" /> : null}
        </svg>
      ) : null}

      <BeispielSchild t={t} von={S[3] - 0.2} bis={at('Du', 126) + 0.2} nr={1} text="Sparrechner" icon="ph:piggy-bank-fill" farbe={GRUEN} />
    </>
  );
};

const SrDiagramm: React.FC<{t: number; a: number}> = ({t, a}) => {
  const basis = 540;
  const hoehe = 330;
  return (
    <>
      <div style={{position: 'absolute', left: 640, top: 108, fontSize: 30, fontWeight: 700, color: SOFT}}>Gespart nach Monat</div>
      {Array.from({length: 10}, (_, i) => {
        const wachs = p(t, S[3] + 0.4 + i * 0.08, 0.5);
        const reagiert = puls(t, T3.diagramm + i * 0.07, 0.6);
        const summe = a * (i + 1);
        const h = (summe / 300) * hoehe * wachs;
        const letzt = i === 9;
        const glow = (letzt ? puls(t, T3.zweihundert, 0.8) + puls(t, T3.dreihundert, 0.8) : 0) + reagiert;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: 650 + i * 82, top: basis - h, width: 58, height: h, borderRadius: '14px 14px 4px 4px', background: letzt ? GRUEN : '#BFE6D3', boxShadow: glow > 0 ? `0 0 0 ${glow * 10}px ${GRUEN}44` : undefined}} />
            <div style={{position: 'absolute', left: 650 + i * 82 - 10, width: 78, top: basis + 8, textAlign: 'center', fontSize: 24, fontWeight: 700, color: SOFT}}>{i + 1}</div>
          </React.Fragment>
        );
      })}
      {p(t, S[3] + 1.2, 0.3) > 0 ? (
        <div style={{position: 'absolute', left: 650 + 9 * 82 - 40, width: 140, top: basis - (a * 10 / 300) * hoehe - 52, textAlign: 'center', fontSize: 36, fontWeight: 900, color: GRUEN, opacity: p(t, S[3] + 1.2, 0.3)}}>{Math.round(a) * 10} €</div>
      ) : null}
      <div style={{position: 'absolute', left: 640, top: basis + 2, width: 830, height: 4, borderRadius: 2, background: LINIE}} />
    </>
  );
};

/* ═════════════ Station 4 · Lernen: Stromkreis ═════════════ */

const T4 = {
  stromkreis: at('Stromkreis'),
  nicht: at('nicht', 172.5),
  absatz: at('Absatz'),
  skizze: at('Skizze'),
  stromquelle: at('Stromquelle'),
  schalter: at('Schalter', 178),
  lampe: at('Lampe'),
  offenem: at('offenem'),
  geschlossenem: at('geschlossenem'),
  klickst: at('Klickst', 184),
  schalter2: at('Schalter', 187),
  aendert: at('ändert', 188),
  illu: at('Illustrationsbeispiel'),
  interaktion: at('Interaktion', 192),
  solche: at('Solche'),
  verhaeltnisse: at('Verhältnisse'),
  informationen: at('Informationen', 200),
  entscheidung: at('Entscheidung', 201.5),
  trotzdem: at('Trotzdem'),
  erklaerung: at('Erklärung', 204.5),
  huebsches: at('hübsches'),
  vermittelt: at('vermittelt'),
};

const KREIS = {l: 420, r: 1480, o: 330, u: 760};
const SCHALTER = {px: 820, kx: 1040, y: 760, laenge: 222};
const hebelWinkel = (t: number) => mix(-30, 0, p(t, T4.schalter2 + 0.02, 0.22, 'in'));
const hebelSpitze = (winkel: number) => ({x: SCHALTER.px + Math.cos((winkel * Math.PI) / 180) * SCHALTER.laenge, y: SCHALTER.y + Math.sin((winkel * Math.PI) / 180) * SCHALTER.laenge});
const STROM_AN = T4.schalter2 + 0.3;

const STROM_PFAD: [number, number][] = [
  [KREIS.l, 455],
  [KREIS.l, KREIS.o],
  [KREIS.r, KREIS.o],
  [KREIS.r, KREIS.u],
  [SCHALTER.kx, KREIS.u],
  [SCHALTER.px, KREIS.u],
  [KREIS.l, KREIS.u],
  [KREIS.l, 640],
];

const Station4: React.FC = () => {
  const t = useT();
  const brett = sp(t, S[4] - 0.4);
  const klein = p(t, T4.solche, 0.8, 'inOut');
  const brettWeg = raus(t, T4.trotzdem - 0.1, 0.4);
  return (
    <>
      {brettWeg > 0.001 ? (
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${mix(0, 70, klein)}px, ${mix(0, 190, klein)}px) scale(${mix(1, 0.5, klein)})`, opacity: brettWeg}}>
          <Panel x={160} y={130} w={1600} h={770} q={brett} style={{backgroundImage: `linear-gradient(${BLAU_T2} 2px, transparent 2px), linear-gradient(90deg, ${BLAU_T2} 2px, transparent 2px)`, backgroundSize: '44px 44px'}}>
            <div style={{background: '#FFFFFF'}}>
              <Kopfzeile icon="ph:lightbulb-fill" titel="Lernansicht · Stromkreis" farbe={GELB_INK} tint={GELB_T} illu />
            </div>
          </Panel>
          {brett > 0.3 ? <Stromkreis t={t} /> : null}
        </div>
      ) : null}
      <T4Absatz t={t} />
      <T4Werkzeuge t={t} />
      <T4Verstaendnis t={t} />
      <BeispielSchild t={t} von={S[4] - 0.2} bis={at('Stell', 169) - 0.2} nr={2} text="Lernen" icon="ph:lightbulb-fill" farbe={GELB} />
    </>
  );
};

const Stromkreis: React.FC<{t: number}> = ({t}) => {
  const winkel = hebelWinkel(t);
  const spitze = hebelSpitze(winkel);
  const an = p(t, STROM_AN, 0.3);
  const licht = p(t, STROM_AN + 0.25, 0.4);
  const draht = an > 0.5 ? '#E9A23B' : INK;
  const ring = (start: number) => puls(t, start, 0.9);
  const L = laenge(STROM_PFAD);
  const offen = sp(t, T4.offenem, 'bouncy');
  const zu = sp(t, T4.geschlossenem, 'bouncy');
  const zuAktiv = p(t, STROM_AN, 0.3);
  const fragezeichen = sp(t, T4.nicht, 'bouncy') * raus(t, T4.schalter2, 0.3);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {/* Draht */}
        <path d={`M${KREIS.l},450 V${KREIS.o} H${KREIS.r} V${KREIS.u} H${SCHALTER.kx} M${SCHALTER.px},${KREIS.u} H${KREIS.l} V640`} fill="none" stroke={draht} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        {/* Strom-Punkte */}
        {an > 0.01
          ? Array.from({length: Math.floor(L / 80)}, (_, i) => {
              const d = (i * 80 + (t - STROM_AN) * 300) % L;
              const [x, y] = punktAuf(STROM_PFAD, d);
              return <circle key={i} cx={x} cy={y} r={11} fill={GELB} stroke="#FFFFFF" strokeWidth={4} opacity={an} />;
            })
          : null}
        {/* Batterie */}
        <g>
          <circle cx={KREIS.l} cy={545} r={150 * ring(T4.stromquelle) + 0.01} fill="none" stroke={BLAU} strokeWidth={6} opacity={ring(T4.stromquelle)} />
          <rect x={KREIS.l - 58} y={440} width={116} height={210} rx={22} fill="#2B3140" />
          <rect x={KREIS.l - 24} y={424} width={48} height={22} rx={6} fill="#2B3140" />
          <text x={KREIS.l} y={515} textAnchor="middle" fontSize={56} fontWeight={900} fill="#FFFFFF">+</text>
          <text x={KREIS.l} y={615} textAnchor="middle" fontSize={56} fontWeight={900} fill="#FFFFFF">−</text>
        </g>
        {/* Lampe */}
        <g>
          {licht > 0.01 ? <circle cx={KREIS.r} cy={545} r={80 + licht * 90} fill={GELB} opacity={0.25 * licht} /> : null}
          <circle cx={KREIS.r} cy={545} r={150 * ring(T4.lampe) + 0.01} fill="none" stroke={BLAU} strokeWidth={6} opacity={ring(T4.lampe)} />
          <circle cx={KREIS.r} cy={545} r={80} fill={licht > 0.3 ? '#FFE27A' : '#FFFFFF'} stroke={INK} strokeWidth={10} />
          <path d={`M${KREIS.r - 30},575 Q${KREIS.r - 15},505 ${KREIS.r},560 Q${KREIS.r + 15},505 ${KREIS.r + 30},575`} fill="none" stroke={licht > 0.3 ? '#E9A23B' : SOFT} strokeWidth={7} strokeLinecap="round" />
          {licht > 0.3
            ? [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const a = (i / 8) * Math.PI * 2;
                return <line key={i} x1={KREIS.r + Math.cos(a) * 110} y1={545 + Math.sin(a) * 110} x2={KREIS.r + Math.cos(a) * (130 + licht * 20)} y2={545 + Math.sin(a) * (130 + licht * 20)} stroke="#E9A23B" strokeWidth={9} strokeLinecap="round" />;
              })
            : null}
        </g>
        {/* Schalter */}
        <circle cx={(SCHALTER.px + SCHALTER.kx) / 2} cy={SCHALTER.y} r={140 * ring(T4.schalter) + 0.01} fill="none" stroke={BLAU} strokeWidth={6} opacity={ring(T4.schalter)} />
        <circle cx={(SCHALTER.px + SCHALTER.kx) / 2} cy={SCHALTER.y} r={150 * ring(T4.offenem) + 0.01} fill="none" stroke={ROT} strokeWidth={7} opacity={ring(T4.offenem)} />
        <line x1={SCHALTER.px} y1={SCHALTER.y} x2={spitze.x} y2={spitze.y} stroke={an > 0.5 ? '#E9A23B' : KORALLE} strokeWidth={18} strokeLinecap="round" />
        <circle cx={SCHALTER.px} cy={SCHALTER.y} r={20} fill="#FFFFFF" stroke={INK} strokeWidth={8} />
        <circle cx={SCHALTER.kx} cy={SCHALTER.y} r={20} fill="#FFFFFF" stroke={INK} strokeWidth={8} />
      </svg>
      {/* Beschriftungen */}
      <div style={{position: 'absolute', left: KREIS.l + 110, top: 520}}>
        <Chip text="Stromquelle" icon="ph:battery-full-bold" size={30} q={sp(t, T4.stromquelle, 'bouncy')} />
      </div>
      <div style={{position: 'absolute', left: (SCHALTER.px + SCHALTER.kx) / 2, top: 800, transform: 'translateX(-50%)'}}>
        <Chip text="Schalter" icon="ph:toggle-left-bold" size={30} q={sp(t, T4.schalter, 'bouncy')} />
      </div>
      <div style={{position: 'absolute', left: KREIS.r - 120, top: 520, transform: 'translateX(-100%)'}}>
        <Chip text="Lampe" icon="ph:lightbulb-bold" size={30} q={sp(t, T4.lampe, 'bouncy')} />
      </div>
      {/* Zustand: offen → geschlossen */}
      <div style={{position: 'absolute', left: 960, top: 390, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 22}}>
        <Chip text="offen" icon="ph:plugs-bold" size={36} farbe={ROT} tint={ROT_T} q={offen} style={{opacity: clamp01(offen * 2) * mix(1, 0.35, zuAktiv)}} />
        {zu > 0.001 ? <Icon icon="ph:arrow-right-bold" size={44} color={SOFT} animate="none" style={{opacity: clamp01(zu * 2)}} /> : null}
        <Chip text="geschlossen" icon="ph:plugs-connected-bold" size={36} farbe={zuAktiv > 0.5 ? '#FFFFFF' : SOFT} tint={zuAktiv > 0.5 ? GRUEN : '#F1F2F5'} q={zu} />
      </div>
      {fragezeichen > 0.001 ? (
        <div style={{position: 'absolute', left: KREIS.r + 40, top: 340, width: 120, height: 120, borderRadius: '50%', background: KORALLE, color: '#FFFFFF', fontSize: 84, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${Math.max(0, fragezeichen)})`}}>?</div>
      ) : null}
      <Welle t={t} start={T4.interaktion} x={spitze.x} y={spitze.y} farbe={GELB} />
    </>
  );
};

const T4Absatz: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, T4.absatz - 0.35) * raus(t, T4.skizze - 0.2, 0.35);
  if (q <= 0.001) return null;
  return (
    <div style={{position: 'absolute', left: 560, top: 420, width: 800, padding: '34px 40px', borderRadius: 30, background: '#FFFFFF', boxShadow: '0 26px 60px rgba(30,35,50,0.18)', fontSize: 31, lineHeight: 1.5, fontWeight: 500, color: SOFT, opacity: clamp01(q * 2), transform: `translateX(${(1 - clamp01(q)) * 120}px)`, zIndex: 4}}>
      Ein Stromkreis leitet nur, wenn er geschlossen ist. Ist der Schalter offen, ist der Weg unterbrochen und die Lampe bleibt aus …
    </div>
  );
};

const T4Werkzeuge: React.FC<{t: number}> = ({t}) => {
  if (t < T4.solche) return null;
  const weg = raus(t, T4.trotzdem - 0.1, 0.4);
  const karten = [
    {at: T4.verhaeltnisse, icon: 'ph:chart-pie-slice-bold', text: 'Verhältnisse vergleichen', farbe: BLAU, tint: BLAU_T},
    {at: T4.informationen, icon: 'ph:sort-ascending-bold', text: 'Informationen sortieren', farbe: GELB_INK, tint: GELB_T},
    {at: T4.entscheidung, icon: 'ph:tree-structure-bold', text: 'Entscheidung durchspielen', farbe: GRUEN, tint: GRUEN_T},
  ];
  return (
    <div style={{opacity: weg, position: 'absolute', inset: 0}}>
      {karten.map((k, i) => {
        const q = sp(t, k.at - 0.2, 'bouncy');
        if (q <= 0.001) return null;
        const lauf = p(t, k.at + 0.2, 0.9, 'inOut');
        return (
          <div key={k.text} style={{position: 'absolute', left: 960, top: 150 + i * 235, width: 860, height: 205, boxSizing: 'border-box', borderRadius: 32, background: '#FFFFFF', boxShadow: '0 20px 46px rgba(30,35,50,0.10)', display: 'flex', alignItems: 'center', gap: 26, padding: '0 34px', transform: `translateX(${(1 - clamp01(q)) * 160}px)`, opacity: clamp01(q * 2)}}>
            <div style={{width: 92, height: 92, borderRadius: 26, background: k.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
              <Icon icon={k.icon} size={56} color={k.farbe} animate="none" />
            </div>
            <div style={{fontSize: 36, fontWeight: 900, color: INK, width: 330, lineHeight: 1.15}}>{k.text}</div>
            <div style={{marginLeft: 'auto', width: 300, height: 150, position: 'relative'}}>
              {i === 0 ? (
                <svg width={300} height={150} viewBox="0 0 300 150">
                  <circle cx={150} cy={75} r={56} fill="none" stroke="#E6E9EF" strokeWidth={30} />
                  <circle cx={150} cy={75} r={56} fill="none" stroke={BLAU} strokeWidth={30} strokeDasharray={`${352 * 0.65 * lauf} 352`} transform="rotate(-90 150 75)" />
                  <text x={150} y={88} textAnchor="middle" fontSize={34} fontWeight={900} fill={INK}>{Math.round(65 * lauf)} %</text>
                </svg>
              ) : null}
              {i === 1
                ? [0.9, 0.4, 0.65].map((w, k2) => {
                    const sortiert = [1, 0.65, 0.4].indexOf(w === 0.9 ? 1 : w);
                    const zeile = mix(k2, w === 0.9 ? 0 : sortiert, lauf);
                    return <div key={k2} style={{position: 'absolute', left: 20, top: 14 + zeile * 44, height: 32, width: `${w * 260}px`, borderRadius: 10, background: w === 0.9 ? GELB : '#F5D98A'}} />;
                  })
                : null}
              {i === 2 ? (
                <svg width={300} height={150} viewBox="0 0 300 150">
                  <path d="M40,75 L150,30 L260,20 M150,30 L260,60 M40,75 L150,120 L260,100 M150,120 L260,135" fill="none" stroke="#D3D7DF" strokeWidth={8} strokeLinecap="round" />
                  <path d="M40,75 L150,120 L260,100" fill="none" stroke={GRUEN} strokeWidth={10} strokeLinecap="round" strokeDasharray="260" strokeDashoffset={260 * (1 - lauf)} />
                  {[[40, 75], [150, 30], [150, 120], [260, 20], [260, 60], [260, 100], [260, 135]].map(([x, y], k3) => (
                    <circle key={k3} cx={x} cy={y} r={12} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
                  ))}
                </svg>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const T4Verstaendnis: React.FC<{t: number}> = ({t}) => {
  if (t < T4.trotzdem) return null;
  const blase = sp(t, T4.erklaerung - 0.3, 'bouncy');
  const diagramm = sp(t, T4.huebsches - 0.2, 'bouncy');
  const nein = sp(t, T4.vermittelt, 'bouncy');
  return (
    <>
      {blase > 0.001 ? (
        <div style={{position: 'absolute', left: 170, top: 220, width: 560, height: 360, transform: `scale(${Math.max(0, blase)})`, transformOrigin: '30% 100%'}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 60, background: '#FFFFFF', border: `7px solid ${BLAU}`, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, boxShadow: '0 24px 54px rgba(30,35,50,0.12)'}}>
            <Icon icon="ph:chalkboard-teacher-bold" size={110} color={BLAU} animate="none" />
            <div style={{fontSize: 56, fontWeight: 900, color: INK}}>Erklärung</div>
          </div>
          <svg width={120} height={90} style={{position: 'absolute', left: 120, top: 352}}>
            <path d="M0,0 L60,80 L100,0" fill="#FFFFFF" stroke={BLAU} strokeWidth={7} strokeLinejoin="round" />
            <rect x={4} y={-6} width={92} height={10} fill="#FFFFFF" />
          </svg>
          <div style={{position: 'absolute', right: -34, top: -34}}>
            <Chip text="entscheidend" icon="ph:star-fill" size={32} farbe="#FFFFFF" tint={GELB} q={sp(t, at('entscheidend', 205) - 0.1, 'bouncy')} />
          </div>
        </div>
      ) : null}
      {diagramm > 0.001 ? (
        <div style={{position: 'absolute', left: 1000, top: 210, width: 720, height: 420, borderRadius: 40, background: '#FFFFFF', boxShadow: '0 24px 54px rgba(30,35,50,0.12)', transform: `scale(${Math.max(0, diagramm)})`, padding: 44, boxSizing: 'border-box', display: 'flex', alignItems: 'flex-end', gap: 26}}>
          {[0.35, 0.6, 0.48, 0.85, 1].map((h, i) => (
            <div key={i} style={{flex: 1, height: `${h * 100}%`, borderRadius: 16, background: `linear-gradient(180deg, ${['#9CC0FF', '#FFB199', '#8EE0BC', '#FFD978', '#C4A8FF'][i]} 0%, ${[BLAU, KORALLE, GRUEN, GELB, '#8B5CF6'][i]} 100%)`}} />
          ))}
          {[0, 1, 2, 3].map((i) => {
            const s = Math.max(0, Math.sin(t * 4 + i * 1.7));
            return (
              <div key={i} style={{position: 'absolute', left: [60, 620, 320, 500][i], top: [30, 60, -30, 10][i], transform: `scale(${s})`}}>
                <Icon icon="ph:sparkle-fill" size={56} color={GELB} animate="none" />
              </div>
            );
          })}
        </div>
      ) : null}
      <div style={{position: 'absolute', left: 1360, top: 700, transform: 'translateX(-50%)'}}>
        <Chip text="≠ Verständnis" icon="ph:brain-bold" size={44} farbe="#FFFFFF" tint={ROT} q={nein} />
      </div>
    </>
  );
};

/* ═════════════ Station 5 · Grenzen ═════════════ */

const T5 = {
  rechnung: at('Rechnung', 210),
  wer: at('Wer', 213),
  tabelle: at('Tabelle'),
  eingabe: at('Eingabefelder'),
  antwort: at('Antwort', 217),
  nutzbar: at('nutzbar'),
  aber: at('Aber', 219),
  grenze: at('Grenze', 221),
  ueberzeugend: at('überzeugend'),
  daten: at('Daten', 224.5),
  annahme: at('Annahme'),
  rechnung2: at('Rechnung', 227.5),
  guete: at('Gütesiegel'),
  inhalt: at('Inhalt'),
  geld: at('Geld'),
  gesundheit: at('Gesundheit'),
  entscheidungen: at('Entscheidungen', 236),
  musst: at('musst'),
  zahlen: at('Zahlen', 238.5),
  quellen: at('Quellen', 239),
  und: at('Und', 240),
  beweis: at('Beweis'),
  account: at('Chat-GPT-Account'),
  eigene: at('eigene', 250.5),
};

const BON = {x: 110, y: 150, w: 470, h: 700};
const TOOL = {x: 650, y: 150, w: 760, h: 490};
const BON_POSTEN: [string, number][] = [
  ['Pizza Margherita', 14],
  ['Pasta Trüffel', 18.5],
  ['2× Getränke', 12],
  ['Trinkgeld 10 %', 4.45],
];
const BON_SUMME = 48.95;
const PRO_PERSON_FALSCH = 19.5;
const PRO_PERSON_RICHTIG = Math.round((BON_SUMME / 3) * 100) / 100; // 16,32
const T5_ERGEBNIS = {x: TOOL.x + TOOL.w - 250, y: TOOL.y + 430};

const Station5: React.FC = () => {
  const t = useT();
  const rot = p(t, T5.grenze - 0.4, 0.8) * 0.55;
  return (
    <>
      {rot > 0.001 ? <div style={{position: 'absolute', left: -300, top: -200, width: 2520, height: 1480, background: `radial-gradient(ellipse at 50% 40%, ${ROT_T} 0%, rgba(253,227,228,0) 70%)`, opacity: rot}} /> : null}
      <T5Bon t={t} />
      <T5Werkzeug t={t} />
      <T5Seitenspalte t={t} />
      <Stempel text="EIGENE DEMO-GRAFIK" q={sp(t, T5.eigene, 'bouncy')} x={TOOL.x + TOOL.w / 2} y={TOOL.y + 150} farbe={BLAU} size={50} rot={-5} />
      <BeispielSchild t={t} von={S[5] - 0.2} bis={T5.rechnung + 0.3} nr={3} text="Rechnung teilen" icon="ph:receipt-fill" farbe={KORALLE} />
    </>
  );
};

const T5Bon: React.FC<{t: number}> = ({t}) => {
  const auf = p(t, T5.rechnung - 0.1, 1.3, 'out');
  if (auf <= 0.001) return null;
  return (
    <div style={{position: 'absolute', left: BON.x, top: BON.y, width: BON.w, height: BON.h, clipPath: `inset(0 0 ${(1 - auf) * 100}% 0)`}}>
      <svg width={BON.w} height={BON.h} style={{position: 'absolute', inset: 0, filter: 'drop-shadow(0 18px 30px rgba(30,35,50,0.12))'}}>
        <path d={`M0,0 H${BON.w} V${BON.h - 24} ${Array.from({length: 12}, (_, i) => `L${BON.w - (i + 0.5) * (BON.w / 12)},${BON.h} L${BON.w - (i + 1) * (BON.w / 12)},${BON.h - 24}`).join(' ')} Z`} fill="#FFFFFF" />
      </svg>
      <div style={{position: 'absolute', left: 40, right: 40, top: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 34, fontWeight: 900, color: INK}}>
        <Icon icon="ph:fork-knife-bold" size={40} color={KORALLE} animate="none" />
        Restaurant
      </div>
      <div style={{position: 'absolute', left: 40, right: 40, top: 92, textAlign: 'center', fontSize: 24, fontWeight: 700, color: SOFT}}>Beispielrechnung</div>
      {BON_POSTEN.map(([name, preis], i) => (
        <div key={name} style={{position: 'absolute', left: 40, right: 40, top: 170 + i * 76, display: 'flex', justifyContent: 'space-between', fontSize: 31, fontWeight: 600, color: INK}}>
          <span>{name}</span>
          <span style={{fontWeight: 800}}>{euro(preis)}</span>
        </div>
      ))}
      <div style={{position: 'absolute', left: 40, right: 40, top: 480, borderTop: `4px dashed ${LINIE}`}} />
      <div style={{position: 'absolute', left: 40, right: 40, top: 510, display: 'flex', justifyContent: 'space-between', fontSize: 42, fontWeight: 900, color: INK}}>
        <span>Gesamt</span>
        <span>{euro(BON_SUMME)}</span>
      </div>
    </div>
  );
};

const T5Werkzeug: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, T5.wer - 0.2);
  if (q <= 0.001) return null;
  const glanz = p(t, T5.ueberzeugend - 0.1, 0.9, 'inOut');
  const falsch = p(t, T5.rechnung2, 0.4);
  const richtig = sp(t, T5.zahlen, 'bouncy');
  const betrag = sp(t, T5.nutzbar);
  const avatare = [KORALLE, BLAU, GRUEN];
  return (
    <>
      <Panel x={TOOL.x} y={TOOL.y} w={TOOL.w} h={TOOL.h} q={q}>
        <Kopfzeile icon="ph:users-three-bold" titel="Rechnung teilen" illu />
        {avatare.map((farbe, i) => (
          <div key={i} style={{position: 'absolute', left: 120 + i * 220, top: 100, width: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${Math.max(0, sp(t, T5.wer + i * 0.15, 'bouncy'))})`}}>
            <div style={{width: 76, height: 76, borderRadius: '50%', background: farbe, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon icon="ph:user-fill" size={46} color="#FFFFFF" animate="none" />
            </div>
            <div style={{marginTop: 6, fontSize: 26, fontWeight: 900, color: betrag > 0.5 ? (falsch > 0.5 ? ROT : INK) : KORALLE}}>{betrag > 0.5 ? euro(PRO_PERSON_FALSCH) : '?'}</div>
          </div>
        ))}
        <div style={{position: 'absolute', left: 40, right: 40, top: 250, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: clamp01(sp(t, T5.tabelle) * 2)}}>
          <span style={{fontSize: 32, fontWeight: 700, color: SOFT}}>Gesamt</span>
          <span style={{fontSize: 38, fontWeight: 900, color: INK}}>{euro(BON_SUMME)}</span>
        </div>
        <div style={{position: 'absolute', left: 40, right: 40, top: 318, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: clamp01(sp(t, T5.eingabe) * 2)}}>
          <span style={{fontSize: 32, fontWeight: 700, color: SOFT}}>Personen</span>
          <div style={{display: 'flex', alignItems: 'center', borderRadius: 16, border: `4px solid ${puls(t, T5.eingabe, 0.9) > 0.1 ? BLAU : LINIE}`, overflow: 'hidden'}}>
            <span style={{padding: '4px 18px', fontSize: 32, fontWeight: 900, color: SOFT, background: '#F1F2F5'}}>−</span>
            <span style={{padding: '4px 28px', fontSize: 36, fontWeight: 900, color: INK}}>3</span>
            <span style={{padding: '4px 18px', fontSize: 32, fontWeight: 900, color: SOFT, background: '#F1F2F5'}}>+</span>
          </div>
        </div>
        <div style={{position: 'absolute', left: 40, top: 405, fontSize: 32, fontWeight: 700, color: SOFT, opacity: clamp01(sp(t, T5.antwort) * 2)}}>Pro Person</div>
        <div style={{position: 'absolute', right: mix(40, 330, clamp01(richtig)), top: mix(388, 400, clamp01(richtig)), fontSize: mix(66, 44, clamp01(richtig)), fontWeight: 900, color: falsch > 0.5 ? ROT : INK, opacity: clamp01(sp(t, T5.antwort) * 2), transform: `scale(${Math.max(0, sp(t, T5.antwort, 'bouncy'))})`, transformOrigin: 'right center'}}>
          <span style={{position: 'relative'}}>
            {euro(PRO_PERSON_FALSCH)}
            {falsch > 0 ? <span style={{position: 'absolute', left: -6, top: '52%', height: 7, width: `calc(${falsch * 100}% + 12px)`, background: ROT, borderRadius: 4}} /> : null}
          </span>
        </div>
        {richtig > 0.001 ? (
          <div style={{position: 'absolute', right: 40, top: 378, textAlign: 'right', transform: `scale(${Math.max(0, richtig)})`, transformOrigin: 'right center'}}>
            <div style={{fontSize: 70, fontWeight: 900, color: GRUEN, lineHeight: 1}}>{euro(PRO_PERSON_RICHTIG)}</div>
            <div style={{fontSize: 24, fontWeight: 700, color: GRUEN}}>= {euro(BON_SUMME)} ÷ 3</div>
          </div>
        ) : null}
        {/* Glanz: sieht überzeugend aus */}
        {glanz > 0 && glanz < 1 ? <div style={{position: 'absolute', top: -100, left: mix(-400, 1000, glanz), width: 160, height: 800, background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%)', transform: 'rotate(18deg)'}} /> : null}
      </Panel>
      {/* Funkeln */}
      {[0, 1, 2, 3].map((i) => {
        const s = puls(t, T5.ueberzeugend + i * 0.25, 0.9);
        if (s <= 0) return null;
        const pos = [
          [TOOL.x - 30, TOOL.y + 40],
          [TOOL.x + TOOL.w - 20, TOOL.y + 90],
          [TOOL.x + 300, TOOL.y + TOOL.h - 10],
          [TOOL.x + TOOL.w - 120, TOOL.y + TOOL.h - 40],
        ][i];
        return (
          <div key={i} style={{position: 'absolute', left: pos[0], top: pos[1], transform: `translate(-50%,-50%) scale(${s})`}}>
            <Icon icon="ph:sparkle-fill" size={70} color={GELB} animate="none" />
          </div>
        );
      })}
      {/* Gütesiegel – und durchgestrichen */}
      <T5Siegel t={t} />
    </>
  );
};

const T5Siegel: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, T5.guete - 0.25, 'bouncy');
  if (q <= 0.001) return null;
  const weg = raus(t, T5.und, 0.4);
  const x = TOOL.x + TOOL.w - 20;
  const y = TOOL.y + 10;
  return (
    <div style={{position: 'absolute', left: x - 90, top: y - 90, width: 180, height: 180, transform: `scale(${Math.max(0, q)}) rotate(${(1 - clamp01(q)) * -40}deg)`, opacity: weg, zIndex: 6}}>
      <svg width={180} height={180} viewBox="-90 -90 180 180">
        <path d={zahnrad(86, 16)} fill={GELB} />
        <circle r={62} fill={GELB_T} stroke={GELB} strokeWidth={6} />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <Icon icon="ph:seal-check-fill" size={64} color={GELB_INK} animate="none" />
        <div style={{fontSize: 22, fontWeight: 900, color: GELB_INK}}>Gütesiegel</div>
      </div>
      <Rund gut={false} size={84} q={sp(t, T5.inhalt - 0.3, 'bouncy')} style={{position: 'absolute', right: -24, top: -24}} />
    </div>
  );
};

const T5Seitenspalte: React.FC<{t: number}> = ({t}) => {
  const ersterTeil = raus(t, T5.und, 0.4);
  const flaggen = [
    {at: T5.daten, icon: 'ph:database-bold', text: 'Daten fehlen?'},
    {at: T5.annahme, icon: 'ph:question-bold', text: 'Annahme falsch?'},
    {at: T5.rechnung2, icon: 'ph:calculator-bold', text: 'Rechnung falsch'},
  ];
  const themen = [
    {at: T5.geld, icon: 'ph:coins-bold', text: 'Geld'},
    {at: T5.gesundheit, icon: 'ph:heartbeat-bold', text: 'Gesundheit'},
    {at: T5.entscheidungen, icon: 'ph:signpost-bold', text: 'Entscheidungen'},
  ];
  return (
    <>
      {ersterTeil > 0.001 ? (
        <div style={{position: 'absolute', left: 1490, top: 230, width: 400, display: 'flex', flexDirection: 'column', gap: 18, opacity: ersterTeil}}>
          {flaggen.map((f, i) => {
            const q = sp(t, f.at - 0.1, 'bouncy');
            if (q <= 0.001) return null;
            return (
              <div key={f.text} style={{alignSelf: 'flex-start', transform: `translateX(${(1 - clamp01(q)) * 80}px)`, opacity: clamp01(q * 2)}}>
                <Chip text={f.text} icon={f.icon} size={34} farbe={ROT} tint={ROT_T} />
                {i === 2 ? <div style={{marginTop: 8, marginLeft: 20, fontSize: 28, fontWeight: 800, color: ROT}}>3 × 19,50 € = 58,50 €</div> : null}
              </div>
            );
          })}
          <div style={{height: 30}} />
          {themen.map((th) => (
            <div key={th.text} style={{alignSelf: 'flex-start'}}>
              <Chip text={th.text} icon={th.icon} size={34} farbe={GELB_INK} tint={GELB_T} q={sp(t, th.at, 'bouncy')} />
            </div>
          ))}
        </div>
      ) : null}
      {/* Zweiter Teil: Nachbau ist kein Beweis */}
      {t > T5.und ? (
        <div style={{position: 'absolute', left: 1450, top: 180, width: 420, display: 'flex', flexDirection: 'column', gap: 26}}>
          {[
            {q: sp(t, T5.beweis - 0.2, 'bouncy'), icon: 'ph:copy-bold', titel: 'Nachbau', sub: '≠ Beweis'},
            {q: sp(t, T5.account - 0.1, 'bouncy'), icon: 'ph:user-circle-bold', titel: 'Dein Account', sub: 'kann anders sein'},
          ].map((k) =>
            k.q > 0.001 ? (
              <div key={k.titel} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '24px 28px', borderRadius: 30, background: '#FFFFFF', boxShadow: '0 18px 40px rgba(30,35,50,0.10)', transform: `scale(${Math.max(0, k.q)})`, transformOrigin: 'left center'}}>
                <Icon icon={k.icon} size={64} color={ROT} animate="none" />
                <div>
                  <div style={{fontSize: 36, fontWeight: 900, color: INK}}>{k.titel}</div>
                  <div style={{fontSize: 30, fontWeight: 800, color: ROT}}>{k.sub}</div>
                </div>
              </div>
            ) : null,
          )}
        </div>
      ) : null}
    </>
  );
};

/* ═════════════ Station 6 · Verfügbarkeit ═════════════ */

const T6 = {
  was: S[6],
  openai: at('OpenAI', 255),
  chatbereich: at('Chatbereich'),
  gpt6: at('GPT-6', 259),
  zugang: at('Zugang'),
  einfuehrung: at('Einführung'),
  okt: at('7.', 265),
  schritt: at('schrittweise', 266),
  modelle: at('Modelle', 268),
  modi: at('Modi'),
  geraete: at('Geräte'),
  pro: at('Pro', 271),
  astra: at('Astra'),
  nichtA: at('nicht', 274.8),
  work: at('Workbereich'),
  voice: at('Voice'),
  nichtWV: at('nicht', 278),
  wenn: at('Wenn', 279),
  kaputt: at('kaputt'),
  update: at('Update'),
  plattform: at('Plattform'),
  modell: at('Modell', 285),
  rollout: at('Rollout'),
  verfuegbarkeit: at('Verfügbarkeit', 288),
  aendern: at('ändern', 288),
  quellen: at('Quellen', 290),
};

const MODI = [
  {an: T6.chatbereich - 0.2, check: T6.gpt6, gut: true, icon: 'ph:chat-circle-dots-bold', titel: 'Chat', sub: 'mit GPT-6 · je nach Zugang & App', farbe: BLAU, tint: BLAU_T},
  {an: T6.pro - 0.1, check: T6.nichtA, gut: false, icon: 'ph:brain-bold', titel: 'Pro-Reasoning', sub: 'GPT-6 Astra', farbe: SOFT, tint: '#F1F2F5'},
  {an: T6.work - 0.1, check: T6.nichtWV, gut: false, icon: 'ph:briefcase-bold', titel: 'Work-Bereich', sub: '', farbe: SOFT, tint: '#F1F2F5'},
  {an: T6.voice - 0.1, check: T6.nichtWV + 0.15, gut: false, icon: 'ph:microphone-bold', titel: 'Voice', sub: 'Sprachmodus', farbe: SOFT, tint: '#F1F2F5'},
];

const Station6: React.FC = () => {
  const t = useT();
  const frage = sp(t, S[6] - 0.3, 'bouncy') * raus(t, T6.chatbereich - 0.4, 0.35);
  const zeitstrahl = raus(t, T6.update - 0.3, 0.35);
  const linie = p(t, T6.einfuehrung, 0.9, 'inOut');
  return (
    <>
      {/* Stand */}
      <div style={{position: 'absolute', right: 60, top: 36, transform: `scale(${1 + puls(t, T6.verfuegbarkeit, 0.9) * 0.18})`, transformOrigin: 'right center'}}>
        <Chip
          text="Stand: 17.10.2026"
          icon="ph:arrows-clockwise-bold"
          size={32}
          farbe={INK}
          tint="#FFFFFF"
          q={sp(t, S[6] - 0.3)}
          style={{boxShadow: '0 10px 24px rgba(30,35,50,0.10)'}}
        />
      </div>
      {/* Einstieg: großes Fragezeichen */}
      {frage > 0.001 ? (
        <div style={{position: 'absolute', left: 760, top: 300, width: 400, height: 400, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 30px 70px rgba(30,35,50,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${Math.max(0, frage)})`}}>
          <Icon icon="ph:list-checks-bold" size={200} color={BLAU} animate="none" />
          <div style={{position: 'absolute', right: -10, top: -10, width: 130, height: 130, borderRadius: '50%', background: KORALLE, color: '#FFFFFF', fontSize: 90, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>?</div>
        </div>
      ) : null}
      {/* Modi */}
      {MODI.map((m, i) => {
        const q = sp(t, m.an);
        if (q <= 0.001) return null;
        return (
          <div key={m.titel} style={{position: 'absolute', left: 110, top: 150 + i * 122, width: 1320, height: 106, boxSizing: 'border-box', borderRadius: 30, background: m.gut ? '#FFFFFF' : '#FBFBFC', boxShadow: '0 14px 32px rgba(30,35,50,0.08)', border: m.gut ? `4px solid ${BLAU}` : `3px solid ${LINIE}`, display: 'flex', alignItems: 'center', gap: 24, padding: '0 30px', opacity: clamp01(q * 2), transform: `translateX(${(1 - clamp01(q)) * -80}px)`}}>
            <div style={{width: 70, height: 70, borderRadius: 20, background: m.tint, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon icon={m.icon} size={44} color={m.farbe} animate="none" />
            </div>
            <div style={{fontSize: 44, fontWeight: 900, color: INK}}>{m.titel}</div>
            {m.sub ? <div style={{fontSize: 30, fontWeight: 700, color: SOFT}}>{m.sub}</div> : null}
            <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16}}>
              <span style={{fontSize: 32, fontWeight: 900, color: m.gut ? GRUEN : ROT, opacity: clamp01(sp(t, m.check) * 2)}}>{m.gut ? 'ja' : 'nein'}</span>
              <Rund gut={m.gut} size={74} q={sp(t, m.check, 'bouncy')} />
            </div>
          </div>
        );
      })}
      {/* Zeitstrahl: schrittweise Einführung */}
      {zeitstrahl > 0.001 && t > T6.einfuehrung - 0.2 ? (
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: zeitstrahl}}>
          <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
            <line x1={150} y1={700} x2={mix(150, 1400, linie)} y2={700} stroke="#D3D7DF" strokeWidth={10} strokeLinecap="round" />
            {linie > 0.98 ? <path d="M1382,684 L1404,700 L1382,716" fill="none" stroke="#D3D7DF" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" /> : null}
          </svg>
          {[
            {x: 200, at: T6.okt, datum: '7. Okt.', wer: 'Plus · Pro · Business · Enterprise', modell: 'GPT-6 Sol'},
            {x: 860, at: T6.schritt, datum: '8. Okt.', wer: 'Free · Go', modell: 'GPT-6 Luna'},
          ].map((e) => {
            const q = sp(t, e.at - 0.1, 'bouncy');
            if (q <= 0.001) return null;
            return (
              <div key={e.datum} style={{position: 'absolute', left: e.x, top: 668, transform: `scale(${Math.max(0, q)})`, transformOrigin: '0 50%'}}>
                <Chip text={e.datum} icon="ph:calendar-check-bold" size={32} farbe="#FFFFFF" tint={BLAU} />
                <div style={{marginTop: 18, fontSize: 34, fontWeight: 900, color: INK}}>{e.wer}</div>
                <div style={{marginTop: 10}}>
                  <Chip text={e.modell} size={28} />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      {/* Unterschiede: Modelle · Modi · Geräte */}
      <div style={{position: 'absolute', left: 1490, top: 160, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start'}}>
        <Chip text="Modelle" icon="ph:cpu-bold" size={32} farbe={SOFT} tint="#FFFFFF" q={sp(t, T6.modelle, 'bouncy')} style={{boxShadow: '0 8px 20px rgba(30,35,50,0.08)'}} />
        <Chip text="Modi" icon="ph:squares-four-bold" size={32} farbe={SOFT} tint="#FFFFFF" q={sp(t, T6.modi, 'bouncy')} style={{boxShadow: '0 8px 20px rgba(30,35,50,0.08)'}} />
        <Chip text="Geräte" icon="ph:devices-bold" size={32} farbe={SOFT} tint="#FFFFFF" q={sp(t, T6.geraete, 'bouncy')} style={{boxShadow: '0 8px 20px rgba(30,35,50,0.08)'}} />
      </div>
      {/* Nur Text – kein Fehler */}
      <div style={{position: 'absolute', left: 1600, top: 380, transform: 'translateX(-50%)'}}>
        <Chip text="kein Fehler" icon="ph:check-circle-fill" size={32} farbe="#FFFFFF" tint={GRUEN} q={sp(t, T6.kaputt, 'bouncy') * raus(t, T6.update, 0.3)} />
      </div>
      {/* Update · Plattform · Modell · Rollout */}
      {t > T6.update - 0.3 ? (
        <div style={{position: 'absolute', left: 110, top: 700, display: 'flex', gap: 22}}>
          {[
            {at: T6.update, icon: 'ph:arrows-clockwise-bold', text: 'Update'},
            {at: T6.plattform, icon: 'ph:devices-bold', text: 'Plattform'},
            {at: T6.modell, icon: 'ph:cpu-bold', text: 'Modell'},
            {at: T6.rollout, icon: 'ph:rocket-launch-bold', text: 'Rollout'},
          ].map((c) => (
            <Chip key={c.text} text={c.text} icon={c.icon} size={38} q={sp(t, c.at - 0.05, 'bouncy')} />
          ))}
        </div>
      ) : null}
      <div style={{position: 'absolute', left: 110, top: 830}}>
        <Chip text="Quellen in der Beschreibung" icon="ph:arrow-down-bold" size={36} farbe="#FFFFFF" tint={INK} q={sp(t, T6.quellen - 0.2, 'bouncy')} style={{transform: `translateY(${Math.abs(Math.sin(t * 5)) * -8}px)`}} />
      </div>
    </>
  );
};

/* ═════════════ Station 7 · Der eigentliche Wandel ═════════════ */

const T7 = {
  schalter: at('Schalter', 296),
  frueheren: at('früheren'),
  mensch: at('Mensch'),
  anpassen1: at('anpassen', 300),
  hier: at('Hier', 301.5),
  aufgabe: at('Aufgabe', 303.5),
  anpassen2: at('anpassen', 304),
  schnellen: at('schnellen'),
  satz: at('Satz'),
  vergleich: at('Vergleich', 307.5),
  gegen: at('Gegenüberstellung'),
  lernen: at('Beim', 309),
  diagramm: at('Diagramm', 311),
  alltag: at('bei', 312),
  werkzeug: at('Werkzeug', 314),
  garantie: at('Garantie'),
  fachwissen: at('ersatzfähiges'),
  aber: at('Aber', 319),
  nichtNur: at('nicht', 322),
  erklaer: at('erklär', 322),
  sondern: at('sondern'),
  gpt6: at('GPT-6', 328),
  blick: at('Blick'),
};

const ZEIG_WOERTER: [string, number][] = (() => {
  const liste = ['„Zeig', 'es', 'mir', 'so,', 'dass', 'ich', 'es', 'ausprobieren', 'kann.“'];
  const suche = ['zeig', 'es', 'mir', 'so', 'dass', 'ich', 'es', 'ausprobieren', 'kann'];
  let ab = at('zeig', 323.8);
  return liste.map((w, i) => {
    const zeit = at(suche[i], ab);
    ab = zeit + 0.05;
    return [w, zeit];
  });
})();

const BOX = {y: 360, w0: 270, w1: 580, h: 540};
const T7_LINKS = T7.schnellen - 0.7;
/** Mitte der Box: erst Bildmitte, dann nach links, wenn die Antwortkarte kommt. */
const boxMitte = (t: number) => mix(960, 620, p(t, T7_LINKS, 0.7, 'inOut'));

const Station7: React.FC = () => {
  const t = useT();
  const teil1 = raus(t, T7.aber - 0.1, 0.4);
  return (
    <>
      {teil1 > 0.001 ? (
        <div style={{position: 'absolute', inset: 0, opacity: teil1}}>
          <T7Schalter t={t} />
          <T7Box t={t} />
          <T7Formen t={t} />
        </div>
      ) : null}
      <T7Zitat t={t} />
    </>
  );
};

const T7Schalter: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, S[7] - 0.3, 'bouncy') * raus(t, T7.frueheren - 0.3, 0.35);
  if (q <= 0.001) return null;
  const an = p(t, T7.schalter, 0.25, 'inOut');
  return (
    <div style={{position: 'absolute', left: 960, top: 470, transform: `translate(-50%,-50%) scale(${Math.max(0, q)})`, display: 'flex', alignItems: 'center', gap: 40, padding: '44px 60px', borderRadius: 48, background: '#FFFFFF', boxShadow: '0 30px 70px rgba(30,35,50,0.14)'}}>
      <div style={{fontSize: 56, fontWeight: 900, color: INK}}>Intelligent UI</div>
      <div style={{width: 200, height: 110, borderRadius: 55, background: an > 0.5 ? BLAU : '#D3D7DF', position: 'relative'}}>
        <div style={{position: 'absolute', top: 10, left: mix(10, 100, an), width: 90, height: 90, borderRadius: 45, background: '#FFFFFF', boxShadow: '0 4px 12px rgba(30,35,50,0.2)'}} />
      </div>
    </div>
  );
};

const T7Box: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, T7.frueheren - 0.2);
  if (q <= 0.001) return null;
  const m = p(t, T7.aufgabe - 0.4, 0.8, 'inOut');
  const w = mix(BOX.w0, BOX.w1, m);
  const farbe = m > 0.5 ? BLAU : '#B9BEC8';
  const links = boxMitte(t) - w / 2;
  return (
    <>
      <div style={{position: 'absolute', left: links, top: BOX.y, width: w, height: BOX.h, boxSizing: 'border-box', borderRadius: mix(14, 46, m), border: `7px ${m > 0.5 ? 'solid' : 'dashed'} ${farbe}`, background: m > 0.5 ? BLAU_T2 : '#FFFFFF', opacity: clamp01(q * 2), transform: `translateY(${(1 - clamp01(q)) * 40}px)`}}>
        {[0.9, 0.75, 0.85, 0.6].map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 26, top: 30 + i * 40, height: 20, width: (BOX.w0 - 52) * l, borderRadius: 10, background: '#D6DAE2', opacity: 1 - m}} />
        ))}
        {m > 0.01 ? (
          <div style={{position: 'absolute', left: 36, right: 36, top: 36, opacity: m}}>
            <div style={{display: 'flex', alignItems: 'flex-end', gap: 14, height: 110}}>
              {[0.5, 0.8, 0.65, 1].map((h, i) => (
                <div key={i} style={{flex: 1, height: `${h * 100}%`, borderRadius: 10, background: i === 3 ? KORALLE : '#C9D9FF'}} />
              ))}
            </div>
            <div style={{marginTop: 26, height: 16, borderRadius: 8, background: '#D8E3FA'}}>
              <div style={{width: `${45 + 25 * Math.sin(t * 2) ** 2}%`, height: 16, borderRadius: 8, background: BLAU}} />
            </div>
          </div>
        ) : null}
      </div>
      <div style={{position: 'absolute', left: links + w / 2, top: BOX.y - 40, transform: 'translate(-50%,-50%)'}}>
        <Chip text={m > 0.5 ? 'Jetzt' : 'Früher'} icon={m > 0.5 ? 'ph:arrows-out-bold' : 'ph:clock-counter-clockwise-bold'} size={34} farbe="#FFFFFF" tint={m > 0.5 ? BLAU : SOFT} q={q} />
      </div>
    </>
  );
};

/** Eine Antwortkarte wechselt ihre Form: Satz → Gegenüberstellung → Diagramm → Werkzeug. */
const T7Formen: React.FC<{t: number}> = ({t}) => {
  const q = sp(t, T7.schnellen - 0.3);
  if (q <= 0.001) return null;
  const phasen = [
    {ab: T7.schnellen - 0.3, inhalt: T7.satz, frage: 'schnelle Frage', form: 'Satz', h: 260},
    {ab: T7.vergleich - 0.1, inhalt: T7.gegen, frage: 'Vergleich', form: 'Gegenüberstellung', h: 420},
    {ab: T7.lernen - 0.1, inhalt: T7.diagramm, frage: 'Lernen', form: 'Diagramm', h: 440},
    {ab: T7.alltag - 0.1, inhalt: T7.werkzeug, frage: 'Alltagsaufgabe', form: 'Werkzeug', h: 470},
  ];
  let idx = 0;
  phasen.forEach((ph, i) => {
    if (t >= ph.ab) idx = i;
  });
  const ph = phasen[idx];
  const vorher = phasen[Math.max(0, idx - 1)];
  const morph = idx === 0 ? 1 : p(t, ph.ab, 0.45, 'inOut');
  const h = mix(vorher.h, ph.h, morph);
  const inhalt = sp(t, ph.inhalt - 0.15, 'bouncy');
  const garantie = sp(t, T7.garantie - 0.1, 'bouncy');
  const fachwissen = sp(t, T7.fachwissen - 0.1, 'bouncy');
  return (
    <>
      <div style={{position: 'absolute', left: 1030, top: 520 - h / 2, width: 740, height: h, boxSizing: 'border-box', borderRadius: 40, background: '#FFFFFF', boxShadow: '0 26px 60px rgba(30,35,50,0.12)', opacity: clamp01(q * 2), padding: '30px 40px', overflow: 'hidden'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <Frage text={ph.frage} q={1} size={30} />
        </div>
        <div style={{position: 'absolute', left: 40, right: 40, top: 120, bottom: 30, opacity: clamp01(inhalt * 2), transform: `scale(${mix(0.85, 1, clamp01(inhalt))})`, transformOrigin: '0 0'}}>
          {idx === 0 ? <div style={{fontSize: 64, fontWeight: 900, color: INK}}>Paris.</div> : null}
          {idx === 1 ? (
            <div style={{display: 'flex', gap: 24}}>
              {['A', 'B'].map((n, i) => (
                <div key={n} style={{flex: 1, borderRadius: 24, background: i === 0 ? BLAU_T2 : KORALLE_T, padding: '20px 26px'}}>
                  <div style={{fontSize: 40, fontWeight: 900, color: INK}}>{n}</div>
                  {[0, 1, 2].map((k) => (
                    <div key={k} style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 12}}>
                      <Rund gut={(k + i) % 2 === 0} size={34} />
                      <div style={{height: 16, flex: 1, borderRadius: 8, background: '#D6DAE2'}} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : null}
          {idx === 2 ? (
            <>
              <div style={{display: 'flex', alignItems: 'flex-end', gap: 18, height: 190}}>
                {[0.3, 0.5, 0.65, 0.8, 1].map((hh, i) => {
                  const regler = 0.55 + 0.45 * Math.sin((t - T7.diagramm) * 2.2) ** 2;
                  return <div key={i} style={{flex: 1, height: `${hh * regler * 100}%`, borderRadius: 12, background: i === 4 ? KORALLE : '#C9D9FF'}} />;
                })}
              </div>
              <div style={{marginTop: 30, height: 18, borderRadius: 9, background: '#E6E9EF'}}>
                <div style={{width: `${(0.55 + 0.45 * Math.sin((t - T7.diagramm) * 2.2) ** 2) * 100}%`, height: 18, borderRadius: 9, background: BLAU}} />
              </div>
            </>
          ) : null}
          {idx === 3 ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 18, border: `4px solid ${LINIE}`, padding: '12px 22px', fontSize: 32, fontWeight: 800, color: INK}}>
                <span>Gäste</span>
                <span>8</span>
              </div>
              <div style={{display: 'flex', gap: 18}}>
                <div style={{flex: 1, borderRadius: 18, background: BLAU, color: '#FFFFFF', fontSize: 32, fontWeight: 800, padding: '16px 0', textAlign: 'center'}}>Berechnen</div>
                <div style={{flex: 1, borderRadius: 18, background: GRUEN_T, color: GRUEN, fontSize: 32, fontWeight: 800, padding: '16px 0', textAlign: 'center'}}>Einkaufsliste</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {/* Form-Name */}
      <div style={{position: 'absolute', left: 1400, top: 820, transform: 'translateX(-50%)', opacity: raus(t, T7.garantie - 0.4, 0.3)}}>
        <Chip key={idx} text={ph.form} size={40} farbe="#FFFFFF" tint={INK} q={inhalt} />
      </div>
      {/* Keine Garantie, kein Ersatz */}
      <div style={{position: 'absolute', left: 1030, top: 790, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start'}}>
        <Chip text="keine Garantie für richtige Ergebnisse" icon="ph:x-circle-fill" size={30} farbe={ROT} tint={ROT_T} q={garantie} />
        <Chip text="kein Ersatz für Fachwissen" icon="ph:x-circle-fill" size={30} farbe={ROT} tint={ROT_T} q={fachwissen} />
      </div>
    </>
  );
};

const T7Zitat: React.FC<{t: number}> = ({t}) => {
  if (t < T7.aber - 0.1) return null;
  const z1 = sp(t, T7.nichtNur - 0.2, 'snappy');
  const zurueck = p(t, T7.sondern, 0.5, 'inOut');
  const marker = p(t, ZEIG_WOERTER[7][1] + 0.3, 0.5, 'inOut');
  const gpt = sp(t, T7.gpt6, 'bouncy');
  const fragen = sp(t, T7.aber + 0.2, 'bouncy') * raus(t, T7.nichtNur - 0.35, 0.3);
  return (
    <>
      {fragen > 0.001 ? (
        <div style={{position: 'absolute', left: 960, top: 420, transform: `translate(-50%,-50%) scale(${Math.max(0, fragen)})`, display: 'flex', alignItems: 'center', gap: 30, padding: '36px 56px', borderRadius: 48, background: '#FFFFFF', boxShadow: '0 30px 70px rgba(30,35,50,0.14)'}}>
          <Icon icon="ph:chats-circle-bold" size={110} color={BLAU} animate="none" />
          <div style={{fontSize: 64, fontWeight: 900, color: INK}}>Wie wir fragen</div>
        </div>
      ) : null}
      <div style={{position: 'absolute', left: 0, right: 0, top: mix(260, 190, zurueck), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, opacity: clamp01(z1 * 2) * mix(1, 0.55, zurueck), transform: `scale(${mix(0.85, 1, clamp01(z1)) * mix(1, 0.8, zurueck)})`}}>
        <Chip text="nicht nur" size={34} farbe={SOFT} tint="#FFFFFF" style={{boxShadow: '0 8px 20px rgba(30,35,50,0.08)'}} />
        <div style={{fontSize: 80, fontWeight: 900, color: INK, letterSpacing: '-0.02em'}}>„Erklär es mir.“</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center'}}>
        <Chip text="sondern auch" size={34} farbe="#FFFFFF" tint={BLAU} q={sp(t, T7.sondern, 'bouncy')} />
      </div>
      <div style={{position: 'absolute', left: 140, right: 140, top: 430, textAlign: 'center', fontSize: 96, fontWeight: 900, color: BLAU, letterSpacing: '-0.03em', lineHeight: 1.2}}>
        {ZEIG_WOERTER.map(([w, zeit], i) => {
          const q = sp(t, zeit - 0.05, 'snappy');
          const istMarker = i === 7;
          return (
            <span key={i} style={{display: 'inline-block', marginRight: '0.25em', opacity: clamp01(q * 2), transform: `translateY(${(1 - clamp01(q)) * 30}px)`, position: 'relative'}}>
              {istMarker ? <span style={{position: 'absolute', left: -10, right: -10, bottom: 8, height: 40, borderRadius: 12, background: '#FFD84D', opacity: 0.75, transformOrigin: 'left center', transform: `scaleX(${marker})`}} /> : null}
              <span style={{position: 'relative'}}>{w}</span>
            </span>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center', gap: 20}}>
        <Chip text="GPT-6" size={40} farbe={INK} tint="#FFFFFF" q={gpt} style={{boxShadow: '0 10px 24px rgba(30,35,50,0.10)'}} />
        <Chip text="im Blick behalten" icon="ph:eye-bold" size={40} q={sp(t, T7.blick - 0.1, 'bouncy')} />
      </div>
    </>
  );
};

/* ═════════════ Toki-Choreografie ═════════════ */

type Zubehoer = 'lupe' | 'handy' | null;
type TK = {
  t: number;
  st?: number;
  x?: number;
  y?: number;
  /** Dauer der Bewegung (s). */
  dur?: number;
  /** Höhe der Hüpfer. */
  hop?: number;
  hops?: number;
  g?: Gesicht;
  aL?: number;
  aR?: number;
  look?: Blick;
  smile?: number;
  mO?: number;
  acc?: Zubehoer;
  k?: number;
  sx?: number;
  sy?: number;
  winkt?: boolean;
};

const K0 = 1.2;

/** Fußpunkt, damit die Hand (Seite, Armwinkel) genau auf (hx, hy) liegt. */
const fussFuer = (hx: number, hy: number, seite: 1 | -1, grad: number, k: number) => {
  const a = (grad * Math.PI) / 180;
  return {x: hx - seite * (99 + 66 * Math.sin(a)) * k, y: hy - (-96 + 66 * Math.cos(a)) * k};
};
const handBei = (x: number, y: number, seite: 1 | -1, grad: number, k: number) => {
  const a = (grad * Math.PI) / 180;
  return {x: x + seite * (99 + 66 * Math.sin(a)) * k, y: y + (-96 + 66 * Math.cos(a)) * k};
};

const st = (n: number, keys: TK[]): TK[] => keys.map((k) => (k.x !== undefined || k.y !== undefined ? {...k, st: n} : k));

// Hook: Toki schiebt den Gäste-Regler
const H_SCHIEB = 118;
const H_FUSS_8 = fussFuer(H_KNOPF_SCREEN(8).x - 24, H_KNOPF_SCREEN(8).y, 1, H_SCHIEB, K0);
const H_FUSS_12 = fussFuer(H_KNOPF_SCREEN(12).x - 24, H_KNOPF_SCREEN(12).y, 1, H_SCHIEB, K0);
// Station 1: Toki schiebt den Auswahl-Knopf
const T1_SCHIEB = 98;
const T1_FUSS = (idx: number) => fussFuer(T1_KNOPF_LINKS(idx), T1_SPUR.y + T1_SPUR.h / 2, 1, T1_SCHIEB, K0);
// Station 3: Toki schiebt den Sparregler
const K3 = 1.1;
const SR_SCHIEB = 118;
const SR_FUSS = (a: number) => fussFuer(SR_KNOPF_SCREEN(a).x - 30, SR_KNOPF_SCREEN(a).y, 1, SR_SCHIEB, K3);
// Station 4: Toki springt auf den Schalterhebel
const HEBEL_OFFEN = hebelSpitze(-30);
const HEBEL_ZU = hebelSpitze(0);

const TOKI: TK[] = [
  // ── Station 0 · Hook
  ...st(0, [
    {t: 0, x: 250, y: BODEN, g: 'neutral', look: [0.8, -0.4], aL: 18, aR: 18, k: K0},
    {t: H.frage, aR: 120},
    {t: H.frage + 1.2, aR: 20},
    {t: H.lesen + 0.8, g: 'verwirrt', look: [0.9, -0.3]},
    {t: H.lesen + 2.2, g: 'denken'},
    {t: H.werkzeug, g: 'staunen', aL: 70, aR: 70},
    {t: H.rechner, g: 'freude', aL: 30, aR: 30},
    {t: H.klickst - 0.75, x: H_FUSS_8.x, y: H_FUSS_8.y, dur: 0.6, hops: 2, hop: 26, g: 'neutral', smile: 0.9, look: [0.6, -0.7]},
    {t: H.klickst - 0.2, aR: H_SCHIEB},
    {t: H.veraenderst, x: H_FUSS_12.x, y: H_FUSS_12.y, dur: 1.0, hop: 0},
    {t: H.siehst + 0.2, g: 'freude', aR: 150, aL: 150},
    {t: H.intelligent, g: 'staunen', look: [0.5, -1], aL: 30, aR: 30},
    {t: H.gpt6 + 0.3, g: 'freude'},
    {t: H.aber, x: 880, y: BODEN, dur: 0.8, hops: 2, g: 'denken', look: [0.9, -0.5]},
    {t: H.fabrik, g: 'verwirrt', aL: 100, aR: 100, mO: 0.5},
    {t: H.wirklich, g: 'denken', aL: 18, aR: 18, mO: 0},
    {t: H.wir, x: 260, y: BODEN, dur: 0.7, hops: 3, g: 'neutral', smile: 0.9, look: [0, -1]},
    {t: H.drei + 0.3, x: 560, y: BODEN, dur: 0.35, hops: 1, aR: 140},
    {t: H.drei + 0.6, x: 860, y: BODEN, dur: 0.35, hops: 1},
    {t: H.technik - 0.2, x: 1260, y: BODEN, dur: 0.5, hops: 2},
    {t: H.grenzen - 0.2, x: 1640, y: BODEN, dur: 0.5, hops: 2, g: 'ernst'},
  ]),
  // ── Station 1 · Text oder Darstellung
  ...st(1, [
    {t: S[1] - PAN_VOR, x: 1745, y: BODEN, dur: PAN_DAUER, hops: 3, hop: 40, g: 'neutral', aL: 18, aR: 18, look: [-0.6, -0.8]},
    {t: T1.eine, look: [-0.9, -0.2]},
    {t: T1.aufz + 0.2, x: T1_TOKI_DENKT, y: BODEN, dur: 0.6, hops: 2},
    {t: T1.zwingt, g: 'verwirrt', aL: 40, aR: 40, look: [0, -1]},
    {t: T1.kopf, mO: 0.6},
    {t: T1.mit, x: 1745, y: BODEN, dur: 0.7, hops: 2, g: 'neutral', mO: 0, aL: 18, aR: 18, look: [-0.9, -0.2]},
    {t: T1.wichtige, g: 'freude'},
    {t: T1.wort, g: 'verwirrt'},
    {t: T1.aufgabe, g: 'freude', aR: 150},
    {t: T1.wenn + 0.3, g: 'neutral', smile: 0.8, aR: 18},
    {t: T1.beste, g: 'freude'},
    {t: T1.entscheidung - 0.6, x: T1_FUSS(0).x, y: T1_FUSS(0).y, dur: 1.0, hops: 3, hop: 50, g: 'neutral', look: [0.6, -0.6]},
    {t: T1.entscheidung + 0.5, aR: T1_SCHIEB},
    {t: T1.grafik, x: T1_FUSS(1).x, y: T1_FUSS(1).y, dur: 0.4, hop: 0},
    {t: T1.interaktion, x: T1_FUSS(2).x, y: T1_FUSS(2).y, dur: 0.4, hop: 0},
    {t: T1.hilft, g: 'freude', aR: 150, aL: 150},
  ]),
  // ── Station 2 · Technik
  ...st(2, [
    {t: S[2] - PAN_VOR, x: 620, y: BODEN, dur: PAN_DAUER, hops: 3, hop: 40, k: 0.95, g: 'neutral', aL: 18, aR: 18, look: [0.3, -0.8]},
    {t: T2.bibliothek, g: 'staunen', look: [-0.9, -0.6]},
    {t: T2.compiler, g: 'neutral', smile: 0.8, look: [0.9, 0]},
    {t: T2.modell, look: [0.6, -0.9]},
    {t: T2.entscheidet, g: 'denken'},
    {t: T2.darstellung, g: 'freude'},
    ...T2.bausteine.flatMap((b): TK[] => [
      {t: b - 0.1, aL: 165, aR: 30, look: [-0.8, -0.8]},
      {t: b + 0.3, aL: 30, aR: 150, look: [0.9, -0.4]},
    ]),
    {t: T2.zusammen, g: 'freude', aL: 150, aR: 150},
    {t: T2.bedeutet, g: 'denken', aL: 18, aR: 18, look: [0.6, -0.6]},
    {t: T2.programmiert, g: 'ernst'},
    {t: T2.anwendung, g: 'freude', look: [0.9, -0.4]},
    {t: T2.stueck, g: 'staunen'},
    {t: T2.fertig, g: 'freude'},
    {t: T2.schematische, g: 'neutral', smile: 0.6},
  ]),
  // ── Station 3 · Sparrechner
  ...st(3, [
    {t: S[3] - PAN_VOR, x: 128, y: BODEN, dur: PAN_DAUER, hops: 3, hop: 40, k: K3, g: 'neutral', aL: 18, aR: 18, look: [0.8, -0.6]},
    {t: T3.sparen, g: 'freude'},
    {t: T3.formel, g: 'verwirrt'},
    {t: T3.betrag, g: 'neutral', smile: 0.7},
    {t: T3.diagramm, g: 'staunen'},
    {t: T3.ohne, g: 'ernst'},
    {t: T3.zweihundert, g: 'freude'},
    {t: T3.aenderst, x: SR_FUSS(20).x, y: SR_FUSS(20).y, dur: 0.75, hops: 3, hop: 30, g: 'neutral', look: [0.6, -0.6]},
    {t: T3.monatsbetrag - 0.3, aR: SR_SCHIEB},
    {t: T3.monatsbetrag, x: SR_FUSS(30).x, y: SR_FUSS(30).y, dur: T3.dreissig + 0.3 - T3.monatsbetrag, hop: 0},
    {t: T3.dreihundert, g: 'freude', aL: 150, aR: 150},
    {t: T3.mehrwert, g: 'neutral', smile: 1, aL: 18, aR: 18},
    {t: T3.ursache, look: [0.4, -0.9]},
    {t: T3.auswirkung, look: [0.9, -0.9], g: 'freude'},
  ]),
  // ── Station 4 · Stromkreis
  ...st(4, [
    {t: S[4] - PAN_VOR, x: 1660, y: BODEN, dur: PAN_DAUER, hops: 3, hop: 40, k: 1.0, g: 'neutral', aL: 18, aR: 18, look: [-0.6, -0.6]},
    {t: T4.nicht, g: 'verwirrt', look: [-0.6, -0.9]},
    {t: T4.absatz, g: 'denken'},
    {t: T4.stromquelle, g: 'neutral', look: [-1, -0.3]},
    {t: T4.lampe, look: [-0.7, -0.7]},
    {t: T4.offenem, g: 'ernst', look: [-0.9, 0.2]},
    {t: T4.klickst + 1.0, g: 'neutral', smile: 0.8, sy: 0.82, sx: 1.1},
    {t: T4.schalter2 - 0.7, x: HEBEL_OFFEN.x, y: HEBEL_OFFEN.y, dur: 0.66, hop: 110, hops: 1, sy: 1, sx: 1, aL: 150, aR: 150},
    {t: T4.schalter2 + 0.02, x: HEBEL_ZU.x, y: HEBEL_ZU.y, dur: 0.22, hop: 0},
    {t: STROM_AN + 0.2, g: 'staunen', aL: 120, aR: 120},
    {t: STROM_AN + 1.0, g: 'freude', aL: 150, aR: 150},
    {t: T4.illu - 0.3, x: 1660, y: BODEN, dur: 0.8, hop: 120, hops: 1, aL: 18, aR: 18},
    {t: T4.solche, x: 520, y: BODEN, dur: 0.9, hops: 4, hop: 36, g: 'neutral', look: [0.9, -0.5]},
    {t: T4.verhaeltnisse, g: 'freude'},
    {t: T4.trotzdem, x: 880, y: BODEN, dur: 0.6, hops: 2, g: 'denken', look: [0, -1]},
    {t: T4.vermittelt, g: 'ernst', look: [0.8, -0.6]},
  ]),
  // ── Station 5 · Grenzen
  ...st(5, [
    {t: S[5] - PAN_VOR, x: 1190, y: BODEN, dur: PAN_DAUER, hops: 3, hop: 40, k: 1.15, g: 'neutral', aL: 18, aR: 18, look: [-0.6, -0.8]},
    {t: T5.wer, g: 'verwirrt', look: [-0.3, -1]},
    {t: T5.nutzbar, g: 'freude'},
    {t: T5.aber, g: 'ernst', acc: 'lupe', aR: 60},
    {t: T5.ueberzeugend, g: 'staunen'},
    {t: T5.daten, g: 'denken', look: [0.9, -0.8]},
    {t: T5.annahme, g: 'verwirrt'},
    {t: T5.rechnung2, g: 'staunen', mO: 0.8},
    {t: T5.guete, g: 'neutral', mO: 0, look: [0.6, -1]},
    {t: T5.inhalt, g: 'ernst'},
    {t: T5.musst - 0.3, aR: 150, look: [0.2, -1]},
    {t: T5.zahlen, g: 'freude'},
    {t: T5.und, aR: 60, g: 'neutral', look: [0.9, -0.5]},
    {t: T5.beweis, g: 'ernst'},
    {t: T5.eigene, g: 'freude'},
  ]),
  // ── Station 6 · Verfügbarkeit
  ...st(6, [
    {t: S[6] - PAN_VOR, x: 1650, y: BODEN, dur: PAN_DAUER, hops: 3, hop: 40, k: K0, g: 'neutral', aL: 18, aR: 18, acc: null, look: [-0.8, -0.6]},
    {t: T6.chatbereich, look: [-0.9, -0.6], aL: 110, smile: 0.8},
    {t: T6.gpt6, g: 'freude'},
    {t: T6.einfuehrung, aL: 18, look: [-0.9, 0.2], g: 'neutral'},
    {t: T6.modelle, look: [0.1, -1]},
    {t: T6.astra, g: 'ernst', look: [-0.9, -0.4]},
    {t: T6.wenn, g: 'verwirrt', acc: 'handy', aL: 150, look: [-0.5, -0.9]},
    {t: T6.kaputt, g: 'freude'},
    {t: T6.update, acc: null, aL: 18, g: 'neutral', look: [-0.9, 0.3]},
    {t: T6.verfuegbarkeit, g: 'denken'},
    {t: T6.quellen, g: 'freude', aL: 100, look: [-0.9, 0.5]},
  ]),
  // ── Station 7 · Wandel
  ...st(7, [
    {t: S[7] - PAN_VOR, x: 1500, y: BODEN, dur: PAN_DAUER, hops: 3, hop: 40, k: 1.1, g: 'neutral', aL: 18, aR: 18, look: [-0.8, -0.6]},
    {t: T7.schalter, g: 'staunen'},
    {t: T7.mensch - 0.4, x: 960, y: BODEN - 35, dur: 0.9, hops: 3, hop: 40, g: 'neutral', look: [0, -1]},
    {t: T7.anpassen1 - 0.6, sx: 0.78, sy: 0.95, g: 'traurig'},
    {t: T7.aufgabe - 0.3, sx: 1, sy: 1},
    {t: T7_LINKS, x: 620, y: BODEN - 35, dur: 0.7, hop: 0},
    {t: T7.anpassen2, g: 'freude', aL: 150, aR: 150},
    {t: T7.schnellen, aL: 18, aR: 18, look: [0.9, -0.3], g: 'neutral', smile: 0.9},
    {t: T7.garantie, g: 'ernst'},
    {t: T7.aber - 0.1, x: 1660, y: BODEN, dur: 0.8, hops: 3, hop: 36, g: 'neutral', look: [-0.9, -0.6]},
    {t: ZEIG_WOERTER[0][1], g: 'staunen'},
    {t: ZEIG_WOERTER[8][1], g: 'freude', aL: 150, aR: 150},
    {t: ZEIG_WOERTER[8][1] + 0.05, x: 1660, y: BODEN, dur: 0.5, hop: 70, hops: 1},
    {t: T7.blick + 0.4, winkt: true, aL: 18, look: [-0.4, -0.2]},
  ]),
].sort((a, b) => a.t - b.t);

/** Wert-Spur: weicher Übergang zwischen Keyframes (jede Taste startet beim aktuellen Wert). */
type Taste = {t: number; v: number; d: number};
const spur = (keys: Taste[], t: number, start: number) => {
  let v = start;
  for (let i = 0; i < keys.length; i++) {
    const kf = keys[i];
    if (kf.t > t) break;
    const tau = Math.min(t, keys[i + 1]?.t ?? Infinity);
    v = mix(v, kf.v, EASE.inOut(clamp01((tau - kf.t) / kf.d)));
  }
  return v;
};

const tasten = (f: (k: TK) => number | undefined, d: (k: TK) => number) =>
  TOKI.filter((k) => f(k) !== undefined).map((k) => ({t: k.t, v: f(k) as number, d: Math.max(0.01, d(k))}));

const bewegDauer = (k: TK) => k.dur ?? 0.5;
const SPUR_X = tasten((k) => (k.x !== undefined ? (k.st ?? 0) * W + k.x : undefined), bewegDauer);
const SPUR_Y = tasten((k) => k.y, bewegDauer);
const SPUR_AL = tasten((k) => k.aL, () => 0.25);
const SPUR_AR = tasten((k) => k.aR, () => 0.25);
const SPUR_K = tasten((k) => k.k, bewegDauer);
const SPUR_SX = tasten((k) => k.sx, () => 0.3);
const SPUR_SY = tasten((k) => k.sy, () => 0.3);
const BEWEGUNGEN = TOKI.filter((k) => k.x !== undefined);

function letzte<T>(t: number, f: (k: TK) => T | undefined, start: T): T {
  let v = start;
  for (const k of TOKI) {
    if (k.t > t) break;
    const w = f(k);
    if (w !== undefined) v = w;
  }
  return v;
}

const tokiZustand = (t: number) => {
  const x = spur(SPUR_X, t, SPUR_X[0].v);
  let y = spur(SPUR_Y, t, BODEN);
  let sx = spur(SPUR_SX, t, 1);
  let sy = spur(SPUR_SY, t, 1);
  // Hüpfen während einer Bewegung, Stauchen beim Landen
  for (let i = 0; i < BEWEGUNGEN.length; i++) {
    const b = BEWEGUNGEN[i];
    const ende = b.t + bewegDauer(b);
    const naechste = BEWEGUNGEN[i + 1]?.t ?? Infinity;
    const hop = b.hop ?? 26;
    if (t >= b.t && t < Math.min(ende, naechste) && hop > 0) {
      const q = (t - b.t) / bewegDauer(b);
      const hops = b.hops ?? 2;
      y -= Math.abs(Math.sin(q * Math.PI * hops)) * hop;
    }
    if (hop > 40 && t >= ende && t < ende + 0.3 && t < naechste) {
      const q = (t - ende) / 0.3;
      sx *= 1 + 0.16 * (1 - q);
      sy *= 1 - 0.18 * (1 - q);
    }
  }
  const winkt = letzte(t, (k) => k.winkt, false);
  const aR = winkt ? 140 + 22 * Math.sin(t * 9.4) : spur(SPUR_AR, t, 18);
  return {
    x,
    y,
    sx,
    sy,
    k: spur(SPUR_K, t, K0),
    aL: spur(SPUR_AL, t, 18),
    aR,
    g: letzte<Gesicht>(t, (k) => k.g, 'neutral'),
    look: letzte<Blick | undefined>(t, (k) => k.look, undefined),
    smile: letzte<number | undefined>(t, (k) => (k.g !== undefined ? k.smile ?? Number.NaN : k.smile), undefined),
    mO: letzte<number | undefined>(t, (k) => k.mO, undefined),
    acc: letzte<Zubehoer>(t, (k) => k.acc, null),
  };
};

// Lupe: Glas zeigt erst neben Toki, dann auf das Ergebnis
const LUPE_RUHE = {x: 5 * W + 1440, y: 770};
const LUPE_ZIEL = [
  {t: T5.aber, x: LUPE_RUHE.x, y: LUPE_RUHE.y},
  {t: T5.musst - 0.3, x: 5 * W + TOOL.x + TOOL.w - 190, y: TOOL.y + 425},
  {t: T5.zahlen + 0.3, x: LUPE_RUHE.x, y: LUPE_RUHE.y},
];
const LUPE_X = LUPE_ZIEL.map((l) => ({t: l.t, v: l.x, d: 0.5}));
const LUPE_Y = LUPE_ZIEL.map((l) => ({t: l.t, v: l.y, d: 0.5}));

const TokiWelt: React.FC = () => {
  const t = useT();
  const z = tokiZustand(t);
  const smile = z.smile !== undefined && !Number.isNaN(z.smile) ? z.smile : undefined;
  const handR = handBei(z.x, z.y, 1, z.aR, z.k * z.sx);
  const handL = handBei(z.x, z.y, -1, z.aL, z.k * z.sx);
  const lupe = z.acc === 'lupe' ? {x: spur(LUPE_X, t, LUPE_ZIEL[0].x), y: spur(LUPE_Y, t, LUPE_ZIEL[0].y)} : null;
  return (
    <>
      {lupe ? (
        <svg style={{position: 'absolute', left: 0, top: 0, width: 1, height: 1, overflow: 'visible', zIndex: 30}}>
          <line x1={handR.x} y1={handR.y} x2={lupe.x} y2={lupe.y} stroke="#8A5A36" strokeWidth={18} strokeLinecap="round" />
          <circle cx={lupe.x} cy={lupe.y} r={92} fill="rgba(220,236,255,0.35)" stroke={INK} strokeWidth={14} />
          <path d={`M${lupe.x - 50},${lupe.y - 40} A60,60 0 0,1 ${lupe.x + 10},${lupe.y - 66}`} fill="none" stroke="#FFFFFF" strokeWidth={9} strokeLinecap="round" />
        </svg>
      ) : null}
      <div style={{position: 'absolute', left: 0, top: 0, zIndex: 31}}>
        <Toki x={z.x} y={z.y} k={z.k} sx={z.sx} sy={z.sy} gesicht={z.g} armL={z.aL} armR={z.aR} look={z.look} smile={smile} mouthO={z.mO} />
      </div>
      {z.acc === 'handy' ? (
        <div style={{position: 'absolute', left: handL.x - 80, top: handL.y - 280, width: 160, height: 270, borderRadius: 30, background: INK, padding: 10, boxSizing: 'border-box', transform: 'rotate(-6deg)', zIndex: 32}}>
          <div style={{width: '100%', height: '100%', borderRadius: 22, background: '#FFFFFF', padding: '30px 16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 14}}>
            {[0.9, 0.7, 0.85, 0.6, 0.8].map((w, i) => (
              <div key={i} style={{height: 14, width: `${w * 100}%`, borderRadius: 7, background: '#C5CAD3'}} />
            ))}
            <div style={{marginTop: 'auto', fontSize: 22, fontWeight: 900, color: SOFT, textAlign: 'center'}}>nur Text</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

/* ═════════════ Kamera ═════════════ */

type Kam = {t: number; st: number; z?: number; fx?: number; fy?: number; d?: number};
const KAMERA: Kam[] = [
  {t: 0, st: 0},
  // Hook: Fokus aufs Werkzeug, dann zurück
  {t: H.klickst - 0.6, st: 0, z: 1.12, fx: 900, fy: 600, d: 0.9},
  {t: H.intelligent - 0.4, st: 0, z: 1, fx: 960, fy: 540, d: 0.9},
  // Sparrechner: Ursache und Wirkung
  {t: T3.aenderst, st: 3, z: 1.1, fx: 900, fy: 560, d: 0.8},
  {t: T3.dreihundert + 0.5, st: 3, z: 1, d: 0.8},
  // Stromkreis: auf den Schalter
  {t: T4.klickst, st: 4, z: 1.18, fx: 1000, fy: 620, d: 0.9},
  {t: T4.illu - 0.2, st: 4, z: 1, d: 0.9},
  // Grenzen: aufs Ergebnis
  {t: T5.musst - 0.4, st: 5, z: 1.12, fx: 1100, fy: 520, d: 0.9},
  {t: T5.und, st: 5, z: 1, d: 0.9},
  ...S.slice(1).map((s, i): Kam => ({t: s - PAN_VOR, st: i + 1, z: 1, fx: 960, fy: 540, d: PAN_DAUER})),
].sort((a, b) => a.t - b.t);

const KAM_X = KAMERA.map((k) => ({t: k.t, v: k.st * W + (k.fx ?? 960), d: k.d ?? 0.8}));
const KAM_Y = KAMERA.map((k) => ({t: k.t, v: k.fy ?? 540, d: k.d ?? 0.8}));
const KAM_Z = KAMERA.map((k) => ({t: k.t, v: k.z ?? 1, d: k.d ?? 0.8}));

const kamera = (t: number) => ({fx: spur(KAM_X, t, 960), fy: spur(KAM_Y, t, 540), z: spur(KAM_Z, t, 1)});

/* ═════════════ Kulisse ═════════════ */

const WOLKEN = Array.from({length: 26}, (_, i) => ({
  x: i * 760 + ((i * 337) % 300),
  y: i % 2 === 0 ? -240 + ((i * 53) % 140) : 640 + ((i * 71) % 160),
  r: 280 + ((i * 97) % 240),
  c: [BLAU_T2, '#FFF5E8', '#EEF6F2', '#F4EFFC'][i % 4],
}));
const STEINE = Array.from({length: 150}, (_, i) => ({x: -1500 + i * 150 + ((i * 41) % 90), w: 24 + ((i * 29) % 40), y: BODEN + 30 + ((i * 17) % 50)}));

const Himmel: React.FC<{fx: number}> = ({fx}) => (
  <AbsoluteFill style={{background: KANAL.bg, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: -(fx - 960) * 0.35, top: 0}}>
      {WOLKEN.map((w, i) => (
        <div key={i} style={{position: 'absolute', left: w.x - w.r, top: w.y, width: w.r * 2, height: w.r * 2, borderRadius: '50%', background: w.c}} />
      ))}
    </div>
  </AbsoluteFill>
);

const Boden: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: -2000, top: BODEN, width: 8 * W + 4000, height: 900, background: '#EFECE4', borderTop: '4px solid #E3DFD4'}} />
    {STEINE.map((s, i) => (
      <div key={i} style={{position: 'absolute', left: s.x, top: s.y, width: s.w, height: 10, borderRadius: 5, background: '#E3DFD4'}} />
    ))}
  </>
);

/* ═════════════ Kapitel-Schild & Hinweis ═════════════ */

const KAPITEL: {ab: number; marke: string; text: string; rot?: boolean}[] = [
  {ab: 0, marke: 'GPT-6', text: 'Ein Chat wird bedienbar'},
  {ab: S[1], marke: 'Format', text: 'Text oder Darstellung?'},
  {ab: S[2], marke: 'Technik', text: 'Wie die Oberfläche entsteht'},
  {ab: S[3], marke: 'Beispiel 1', text: 'Sparrechner'},
  {ab: S[4], marke: 'Beispiel 2', text: 'Lernen'},
  {ab: S[5], marke: 'Beispiel 3', text: 'Die wichtigste Grenze', rot: true},
  {ab: S[6], marke: 'Verfügbarkeit', text: 'Wo gibt es Intelligent UI?'},
  {ab: S[7], marke: 'Fazit', text: 'Der eigentliche Wandel'},
];

const KapitelSchild: React.FC = () => {
  const t = useT();
  const k = [...KAPITEL].reverse().find((x) => t >= x.ab) ?? KAPITEL[0];
  const q = k.ab === 0 ? 1 : sp(t, k.ab, 'snappy');
  const farbe = k.rot ? ROT : BLAU;
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        top: 36,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        padding: '14px 30px 14px 22px',
        borderRadius: 999,
        background: '#FFFFFF',
        boxShadow: '0 10px 26px rgba(30,35,50,0.10)',
        fontSize: 32,
        fontWeight: 800,
        transform: `scale(${mix(0.85, 1, clamp01(q))})`,
        transformOrigin: 'left center',
        zIndex: 50,
      }}
    >
      <div style={{width: 16, height: 16, borderRadius: '50%', background: farbe}} />
      <span style={{color: farbe, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 26}}>{k.marke}</span>
      <span style={{color: INK}}>{k.text}</span>
    </div>
  );
};

const Hinweis: React.FC<{stationen: number}> = ({stationen}) => {
  const sichtbar = clamp01((5.6 - stationen) * 2);
  if (sichtbar <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 60, bottom: 26, display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 700, color: SOFT, opacity: 0.9 * sichtbar, zIndex: 50}}>
      <Icon icon="ph:info-bold" size={28} color={SOFT} animate="none" />
      Schematische Illustration – kein ChatGPT-Screenshot
    </div>
  );
};

/* ═════════════ Töne ═════════════ */

type Ton = [s: number, name: SfxName, vol: number];
const TOENE: Ton[] = [
  [H.lesen + 0.2, 'kTick', 0.2],
  [H.werkzeug - 0.25, 'kSwish', 0.35],
  [H.rechner, 'kPop', 0.35],
  [H.diagramm, 'kPop', 0.35],
  [H.vergleich, 'kPop', 0.35],
  [H.klickst, 'kTipp', 0.4],
  [H.siehst, 'kAnstieg', 0.3],
  [H.intelligent, 'kLanden', 0.35],
  [H.fabrik - 0.3, 'kPop', 0.3],
  [H.wirklich, 'kSwish', 0.3],
  [H.drei, 'kPop', 0.3],
  [H.technik, 'kPop', 0.3],
  [H.grenzen, 'kPop', 0.3],
  [T1.eine, 'kPop', 0.3],
  [T1.mit + 0.4, 'kSwish', 0.3],
  [T1.wird + 0.3, 'kFalsch', 0.3],
  [T1.aufgabe, 'kErfolg', 0.3],
  [T1.kurze, 'kPop', 0.3],
  [T1.grafik, 'kTick', 0.3],
  [T1.interaktion, 'kTick', 0.3],
  [T2.bibliothek, 'kPop', 0.3],
  [T2.compiler, 'kLanden', 0.3],
  [T2.modell, 'kPop', 0.3],
  ...T2.bausteine.map((b): Ton => [b, 'kSwish', 0.28]),
  [T2.zusammen, 'kErfolg', 0.35],
  [T2.programmiert, 'kFalsch', 0.35],
  [T2.fertig, 'kDing', 0.3],
  [T2.schematische, 'kLanden', 0.35],
  [T3.sparen - 0.1, 'kMuenze', 0.35],
  [T3.diagramm, 'kAnstieg', 0.3],
  [T3.prognose, 'kFalsch', 0.25],
  [T3.zweihundert, 'kMuenzen', 0.35],
  [T3.monatsbetrag, 'kSwish', 0.3],
  [T3.dreihundert, 'kErfolg', 0.35],
  [T3.ursache, 'kPop', 0.3],
  [T3.auswirkung, 'kPop', 0.3],
  [T4.nicht, 'kPop', 0.3],
  [T4.schalter2 - 0.7, 'kSprung', 0.35],
  [T4.schalter2, 'kLanden', 0.45],
  [STROM_AN, 'kAnstieg', 0.35],
  [STROM_AN + 0.3, 'kDing', 0.35],
  [T4.verhaeltnisse, 'kPop', 0.3],
  [T4.informationen, 'kPop', 0.3],
  [T4.entscheidung, 'kPop', 0.3],
  [T4.vermittelt, 'kFalsch', 0.3],
  [T5.rechnung, 'kTick', 0.3],
  [T5.wer, 'kPop', 0.3],
  [T5.ueberzeugend, 'kDing', 0.3],
  [T5.daten, 'kPop', 0.3],
  [T5.annahme, 'kPop', 0.3],
  [T5.rechnung2, 'kFalsch', 0.4],
  [T5.guete, 'kLanden', 0.35],
  [T5.inhalt - 0.3, 'kFalsch', 0.35],
  [T5.zahlen, 'kErfolg', 0.35],
  [T5.eigene, 'kLanden', 0.35],
  [T6.gpt6, 'kErfolg', 0.3],
  [T6.okt, 'kPop', 0.3],
  [T6.schritt, 'kPop', 0.3],
  [T6.nichtA, 'kFalsch', 0.3],
  [T6.nichtWV, 'kFalsch', 0.3],
  [T6.kaputt, 'kDing', 0.3],
  [T6.quellen, 'kPop', 0.3],
  [T7.schalter, 'kTipp', 0.35],
  [T7.anpassen1 - 0.6, 'kFalsch', 0.25],
  [T7.anpassen2, 'kErfolg', 0.3],
  [T7.satz, 'kPop', 0.3],
  [T7.gegen, 'kPop', 0.3],
  [T7.diagramm, 'kPop', 0.3],
  [T7.werkzeug, 'kPop', 0.3],
  [ZEIG_WOERTER[8][1], 'kErfolg', 0.35],
  ...S.slice(1).map((s): Ton => [s - PAN_VOR, 'kWhoosh', 0.28]),
];

/* ═════════════ Video ═════════════ */

const STATIONEN = [Station0, Station1, Station2, Station3, Station4, Station5, Station6, Station7];

const Inhalt: React.FC<{voiceoverSrc?: string}> = ({voiceoverSrc = VOICEOVER}) => {
  const t = useT();
  const kam = kamera(t);
  const stationen = (kam.fx - 960) / W;
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: KANAL.body, color: INK}}>
      <Himmel fx={kam.fx} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(960px, 540px) scale(${kam.z}) translate(${-kam.fx}px, ${-kam.fy}px)`}}>
        <Boden />
        {STATIONEN.map((Station, i) =>
          Math.abs(stationen - i) < 1.05 ? (
            <div key={i} style={{position: 'absolute', left: i * W, top: 0, width: 1920, height: 1080}}>
              <Station />
            </div>
          ) : null,
        )}
        <TokiWelt />
      </div>
      <KapitelSchild />
      <Hinweis stationen={stationen} />
      {TOENE.map(([s, name, vol], i) => (
        <Sfx key={i} name={name} at={Math.round(s * FPS)} volume={vol} />
      ))}
      <Audio src={staticFile(voiceoverSrc)} />
    </AbsoluteFill>
  );
};

export const Video: React.FC<{voiceoverSrc?: string}> = ({voiceoverSrc}) => (
  <StilContext.Provider value={KANAL}>
    <Inhalt voiceoverSrc={voiceoverSrc} />
  </StilContext.Provider>
);

export const projekt: Project = {
  id: 'Gpt6IntelligentUi',
  component: Video,
  format: 'landscape',
  durationInFrames: DAUER,
  fps: FPS,
};
