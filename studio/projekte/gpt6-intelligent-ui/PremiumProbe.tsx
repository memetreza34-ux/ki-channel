import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, EASE, mix, Sfx} from '../../kit';
import type {Project} from '../types';
import {KANAL, SERIEN, StilContext, Toki, type Gesicht} from '../kanal-look/stil';
import {at, fussFuer, p, puls} from './Video';

/**
 * Probe „Premium“: Sparrechner-Ausschnitt (2:20–2:46) im ruhigeren Stil.
 * Gleiche Stimme, gleicher Kanal-Look mit Toki – aber: ein Blickfang pro
 * Moment, eine Akzentfarbe, Zahlen rollen statt zu springen, Linien werden
 * gezeichnet statt Pillen zu poppen, Kamera schwebt, feines Korn.
 */

const FPS = 30;
const VON = 140.4;
const BIS = 166.3;
const DAUER = Math.round((BIS - VON) * FPS);

const INK = KANAL.ink;
const SOFT = KANAL.inkSoft;
const BLAU = SERIEN.news.farbe;
const BLAU_T = SERIEN.news.tint;
const ROT = KANAL.fehler;
const BODEN = 935;

const T = {
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
  leicht: at('leicht'),
  mehrwert: at('Mehrwert'),
  ursache: at('Ursache'),
  auswirkung: at('Auswirkung'),
  gleichzeitig: at('gleichzeitig'),
};

/** Monatsbetrag: Toki schiebt 20 → 30, bei „gleichzeitig“ kurz auf 32 und zurück. */
const betrag = (t: number) => {
  const tipp = clamp01((t - T.gleichzeitig) / 1.1);
  return 20 + 10 * p(t, T.monatsbetrag, T.dreissig + 0.3 - T.monatsbetrag, 'inOut') + 2 * Math.sin(tipp * Math.PI);
};
/** Monat i füllt sich beim Zählen „10 Monate lang …“. */
const monat = (t: number, i: number) => p(t, T.zehn + i * 0.31, 0.4, 'out');

// Regler
const REG = {x: 220, y: 795, w: 860};
const knopfX = (a: number) => REG.x + (a / 50) * REG.w;
const K = 1.1;
const fuss = (a: number) => fussFuer(knopfX(a) - 26, REG.y, 1, 118, K);

// Diagramm
const DIA = {x: 1190, basis: 720, w: 600, h: 300};
const balkenX = (i: number) => DIA.x + i * 60;

/* ───────────── Bausteine ───────────── */

/** Ziffern rollen wie ein Zählwerk. */
const Zaehlwerk: React.FC<{wert: number; size: number; farbe?: string; unschaerfe?: number}> = ({wert, size, farbe = INK, unschaerfe = 0}) => {
  const stellen = String(Math.floor(Math.max(0, wert) + 1e-6)).length;
  const spalten: number[] = [];
  for (let s = stellen - 1; s >= 0; s--) {
    const pot = 10 ** s;
    if (s === 0) {
      spalten.push(((wert % 10) + 10) % 10);
    } else {
      const basis = Math.floor(wert / pot);
      const rest = wert - basis * pot;
      spalten.push((basis + clamp01(rest - (pot - 1))) % 10);
    }
  }
  return (
    <span style={{display: 'inline-flex', fontVariantNumeric: 'tabular-nums', color: farbe, filter: unschaerfe > 0.2 ? `blur(${unschaerfe}px)` : undefined}}>
      {spalten.map((pos, i) => (
        <span key={i} style={{display: 'inline-block', height: size, overflow: 'hidden', lineHeight: `${size}px`}}>
          <span style={{display: 'flex', flexDirection: 'column', transform: `translateY(${-pos * size}px)`}}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, k) => (
              <span key={k} style={{height: size}}>
                {d}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
};

const Kapitälchen: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontSize: 24, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: SOFT, ...style}}>{children}</div>
);

/** Wort, das bei `at` mit einer gezeichneten Linie durchgestrichen wird. */
const Gestrichen: React.FC<{t: number; at: number; children: React.ReactNode}> = ({t, at: start, children}) => {
  const q = p(t, start, 0.35, 'inOut');
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      {children}
      <span style={{position: 'absolute', left: -4, top: '54%', height: 4, width: `calc(${q * 100}% + 8px)`, background: ROT, borderRadius: 2}} />
    </span>
  );
};

/** Feines, lebendiges Filmkorn. */
const Korn: React.FC<{frame: number}> = ({frame}) => (
  <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'multiply', pointerEvents: 'none'}}>
    <filter id="korn-probe">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={Math.floor(frame / 2) % 40} />
      <feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.2  0 0 0 0 0.25  0 0 0 0.9 0" />
    </filter>
    <rect width="1920" height="1080" filter="url(#korn-probe)" />
  </svg>
);

/* ───────────── Szene ───────────── */

const Szene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = VON + frame / FPS;
  const lokal = frame / FPS;
  const a = betrag(t);
  const kx = knopfX(a);
  const unschaerfe = Math.min(3, Math.abs(betrag(t + 1 / FPS) - a) * FPS * 0.35);

  // Kamera: schwebt langsam heran, beim Mehrwert etwas näher
  const z = 1 + 0.025 * (lokal / (BIS - VON)) + 0.035 * p(t, T.mehrwert, 1.6, 'inOut');
  const camX = -14 * Math.sin(lokal * 0.22) - 40 * p(t, T.mehrwert, 1.6, 'inOut');
  const camY = -6 * Math.sin(lokal * 0.17 + 1);

  const ergebnisRein = p(t, T.zweihundert - 0.35, 0.45, 'out');
  const unterstrich = p(t, T.zwanzig, 0.5, 'inOut') * (1 - p(t, T.zwanzig + 1.4, 0.4, 'in'));
  const fertigLinie = p(t, T.dreihundert, 0.6, 'inOut');
  const ohneLinie = p(t, T.ohne - 0.2, 0.4) * mix(1, 0.35, p(t, T.zehn - 0.3, 0.6)) * (1 - p(t, T.mehrwert, 0.6));
  const verbindung = p(t, T.ursache - 0.2, 0.9, 'inOut');

  // Toki
  const gehen = p(t, T.aenderst, 0.7, 'inOut');
  const startX = 150;
  const vorKnopf = fuss(20);
  let tokiX = mix(startX, vorKnopf.x, gehen);
  if (t >= T.monatsbetrag) tokiX = fuss(a).x;
  const huepf = gehen > 0 && gehen < 1 ? Math.abs(Math.sin(gehen * Math.PI * 3)) * 22 : 0;
  const schiebt = t > T.aenderst + 0.5 && t < T.dreihundert;
  const jubel = t >= T.dreihundert && t < T.leicht;
  const armR = jubel ? 150 : schiebt || (t > T.gleichzeitig - 0.2 && t < T.gleichzeitig + 1.3) ? 118 : 20;
  const armL = jubel ? 150 : 20;
  const gesicht: Gesicht = jubel ? 'freude' : t > T.ohne && t < T.zehn ? 'ernst' : 'neutral';
  const blick: [number, number] = t > T.auswirkung ? [0.9, -0.7] : t > T.ursache ? [0.3, -0.4] : [0.6, -0.8];

  return (
    <AbsoluteFill style={{background: KANAL.bg, fontFamily: KANAL.body, color: INK, overflow: 'hidden'}}>
      {/* Licht im Raum statt harter Kreise */}
      <div style={{position: 'absolute', left: 1050 - lokal * 4, top: -380, width: 1300, height: 1100, borderRadius: '50%', background: `radial-gradient(closest-side, ${BLAU_T} 0%, rgba(228,237,255,0) 100%)`}} />
      <div style={{position: 'absolute', left: -420 + lokal * 3, top: 420, width: 1200, height: 900, borderRadius: '50%', background: 'radial-gradient(closest-side, #FFF1E6 0%, rgba(255,241,230,0) 100%)'}} />

      <div style={{position: 'absolute', inset: 0, transformOrigin: '50% 55%', transform: `translate(${camX}px, ${camY}px) scale(${z})`}}>
        {/* Boden: weich statt Kieselsteine */}
        <div style={{position: 'absolute', left: -200, right: -200, top: BODEN, height: 400, background: 'linear-gradient(180deg, #EEEBE3 0%, #F3F1EB 100%)'}} />
        <div style={{position: 'absolute', left: -200, right: -200, top: BODEN, height: 2, background: '#E2DED3'}} />

        {/* Links: Ursache */}
        <Kapitälchen style={{position: 'absolute', left: 220, top: 178}}>Monatsbetrag</Kapitälchen>
        <div style={{position: 'absolute', left: 208, top: 214, display: 'flex', alignItems: 'baseline', fontSize: 210, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1}}>
          <Zaehlwerk wert={a} size={210} unschaerfe={unschaerfe} />
          <span style={{fontWeight: 300, marginLeft: 18, color: SOFT}}>€</span>
        </div>
        <div style={{position: 'absolute', left: 222, top: 440, height: 8, width: 400 * unterstrich, background: BLAU, borderRadius: 4}} />
        <div style={{position: 'absolute', left: 222, top: 478, fontSize: 46, fontWeight: 300, color: SOFT}}>
          × <span style={{fontWeight: 800, color: INK}}>10</span> Monate
        </div>

        {/* Ohne Rendite, Steuern, Gebühren */}
        <div style={{position: 'absolute', left: 222, top: 570, fontSize: 32, fontWeight: 500, color: SOFT, opacity: ohneLinie}}>
          ohne <Gestrichen t={t} at={T.rendite}>Rendite</Gestrichen>, <Gestrichen t={t} at={T.steuern}>Steuern</Gestrichen>, <Gestrichen t={t} at={T.gebuehren}>Gebühren</Gestrichen>
          <span style={{opacity: p(t, T.prognose - 0.1, 0.4), color: INK, fontWeight: 700}}> · keine Prognose</span>
        </div>

        {/* Regler */}
        <div style={{position: 'absolute', left: REG.x, top: REG.y - 3, width: REG.w, height: 6, borderRadius: 3, background: '#DCDFE5'}} />
        <div style={{position: 'absolute', left: REG.x, top: REG.y - 3, width: kx - REG.x, height: 6, borderRadius: 3, background: BLAU}} />
        {[0, 10, 20, 30, 40, 50].map((v) => (
          <div key={v} style={{position: 'absolute', left: knopfX(v) - 40, width: 80, top: REG.y + 30, textAlign: 'center', fontSize: 24, fontWeight: 600, color: '#9AA0AB', fontVariantNumeric: 'tabular-nums'}}>
            {v}
          </div>
        ))}
        <div style={{position: 'absolute', left: kx - 26, top: REG.y - 26, width: 52, height: 52, borderRadius: '50%', background: '#FFFFFF', border: `6px solid ${BLAU}`, boxSizing: 'border-box', boxShadow: `0 8px 20px rgba(61,123,255,0.25), 0 0 0 ${puls(t, T.zwanzig, 0.9) * 14}px rgba(61,123,255,0.15)`}} />

        {/* Rechts: Wirkung */}
        <Kapitälchen style={{position: 'absolute', left: DIA.x, top: 178, opacity: ergebnisRein}}>Ersparnis</Kapitälchen>
        <div style={{position: 'absolute', left: DIA.x - 6, top: 214, height: 170, overflow: 'hidden'}}>
          <div style={{display: 'flex', alignItems: 'baseline', fontSize: 170, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, transform: `translateY(${(1 - ergebnisRein) * 170}px)`}}>
            <Zaehlwerk wert={a} size={170} farbe={BLAU} unschaerfe={unschaerfe} />
            <span style={{color: BLAU}}>0</span>
            <span style={{fontWeight: 300, marginLeft: 14, color: SOFT}}>€</span>
          </div>
        </div>
        <div style={{position: 'absolute', left: DIA.x, top: 396, height: 6, width: 470 * fertigLinie, background: BLAU, borderRadius: 3, opacity: 1 - p(t, T.leicht, 0.5)}} />

        {/* Diagramm: zehn Monate */}
        {Array.from({length: 10}, (_, i) => {
          const f = monat(t, i);
          const aw = betrag(t - i * 0.05); // Welle von links nach rechts
          const h = ((aw * (i + 1)) / 330) * DIA.h;
          return (
            <React.Fragment key={i}>
              <div style={{position: 'absolute', left: balkenX(i), top: DIA.basis - h, width: 34, height: h, borderRadius: 17, background: '#E4E8F0'}} />
              <div style={{position: 'absolute', left: balkenX(i), top: DIA.basis - h * f, width: 34, height: h * f, borderRadius: 17, background: `linear-gradient(180deg, ${i === 9 ? BLAU : '#8FB3FF'} 0%, ${i === 9 ? '#2F64DB' : '#B9CFFF'} 100%)`}} />
              <div style={{position: 'absolute', left: balkenX(i) + 11, top: DIA.basis + 22, width: 12, height: 12, borderRadius: 6, background: f > 0.5 ? BLAU : '#D3D7DF'}} />
            </React.Fragment>
          );
        })}
        <Kapitälchen style={{position: 'absolute', left: DIA.x, top: DIA.basis + 56, opacity: p(t, T.zehn, 0.4)}}>10 Monate</Kapitälchen>

        {/* Ursache → Wirkung: gezeichnete Linie mit wanderndem Punkt */}
        {verbindung > 0 ? (
          <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <path id="ursache-wirkung" d={`M${kx},${REG.y - 40} C${kx + 120},${REG.y - 260} 1050,560 ${DIA.x - 30},540`} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="1200" strokeDashoffset={1200 * (1 - verbindung)} strokeLinecap="round" />
            {t > T.gleichzeitig - 0.1 && t < T.gleichzeitig + 1.2
              ? (() => {
                  const q = EASE.inOut(clamp01((t - T.gleichzeitig + 0.1) / 1.0));
                  const x0 = kx;
                  const y0 = REG.y - 40;
                  const bez = (u: number, p0: number, p1: number, p2: number, p3: number) => (1 - u) ** 3 * p0 + 3 * (1 - u) ** 2 * u * p1 + 3 * (1 - u) * u ** 2 * p2 + u ** 3 * p3;
                  return <circle cx={bez(q, x0, kx + 120, 1050, DIA.x - 30)} cy={bez(q, y0, REG.y - 260, 560, 540)} r={10} fill={BLAU} />;
                })()
              : null}
          </svg>
        ) : null}
        <Kapitälchen style={{position: 'absolute', left: kx - 80, width: 160, textAlign: 'center', top: REG.y - 96, color: INK, opacity: p(t, T.ursache - 0.1, 0.4)}}>Ursache</Kapitälchen>
        <Kapitälchen style={{position: 'absolute', left: DIA.x - 210, top: 470, color: INK, opacity: p(t, T.auswirkung - 0.1, 0.4)}}>Wirkung</Kapitälchen>

        <Toki x={tokiX} y={BODEN - huepf} k={K} gesicht={gesicht} armL={armL} armR={armR} look={blick} smile={t > T.leicht ? 1 : undefined} />
      </div>

      {/* Ruhiger Kapitel-Marker und Hinweis */}
      <div style={{position: 'absolute', left: 64, top: 48, display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 700}}>
        <div style={{width: 12, height: 12, borderRadius: 6, background: BLAU}} />
        <span style={{letterSpacing: '0.14em', textTransform: 'uppercase', color: BLAU}}>Beispiel 1</span>
        <span style={{color: SOFT}}>Sparrechner</span>
      </div>
      <div style={{position: 'absolute', left: 64, bottom: 30, fontSize: 22, fontWeight: 600, color: '#9AA0AB', letterSpacing: '0.04em'}}>Schematische Illustration · kein ChatGPT-Screenshot</div>

      {/* sehr leichte Vignette + Korn */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 60%, rgba(30,35,50,0.07) 100%)', pointerEvents: 'none'}} />
      <Korn frame={frame} />

      <Sfx name="kTipp" at={Math.round((T.aenderst + 0.6 - VON) * FPS)} volume={0.25} />
      <Sfx name="kMuenze" at={Math.round((T.zweihundert - VON) * FPS)} volume={0.22} />
      <Sfx name="kErfolg" at={Math.round((T.dreihundert - VON) * FPS)} volume={0.25} />
      <Audio src={staticFile('projekte/gpt6-intelligent-ui/voiceover.wav')} trimBefore={Math.round(VON * FPS)} />
    </AbsoluteFill>
  );
};

export const PremiumProbe: React.FC = () => (
  <StilContext.Provider value={KANAL}>
    <Szene />
  </StilContext.Provider>
);

export const premiumProbe: Project = {
  id: 'Gpt6IntelligentUi-Premium-Probe',
  component: PremiumProbe,
  format: 'landscape',
  durationInFrames: DAUER,
  fps: FPS,
};
