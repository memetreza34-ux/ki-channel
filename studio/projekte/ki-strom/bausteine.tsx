import React from 'react';
import {clamp01} from '../../kit';
import {KANAL, SERIEN} from '../kanal-look/stil';

/**
 * Objekte der Themen-Welt „Stromnetz“ (Premium-Stil): eigene Zeichnungen statt
 * Icon-Kacheln, nur Serienfarbe Grün + Tinte/Grau.
 */

export const GRUEN = SERIEN.recht.farbe;
export const GRUEN_D = '#0B7A6E';
export const GRUEN_T = SERIEN.recht.tint;
export const GRUEN_T2 = SERIEN.recht.tint2;
export const INK = KANAL.ink;
export const SOFT = KANAL.inkSoft;
export const GRAU = '#9AA0AB';
export const FAINT = KANAL.faint;
export const LINIE = KANAL.line;
export const ROT = KANAL.fehler;
const METALL = '#E7E4DD';
const METALL_D = '#D6D2C8';
const DUNKEL = '#1E2228';
const PAPIER = '#FBFAF6';

/* ───────────── Typografie ───────────── */

/** Ziffern rollen wie ein Zählwerk; optional mit Nachkommastellen und Tausenderpunkt. */
export const Zaehlwerk: React.FC<{wert: number; size: number; dezimalen?: number; farbe?: string; unschaerfe?: number; tausender?: boolean}> = ({
  wert,
  size,
  dezimalen = 0,
  farbe = INK,
  unschaerfe = 0,
  tausender,
}) => {
  const skal = Math.round(Math.max(0, wert) * 10 ** dezimalen * 1e6) / 1e6;
  const stellen = Math.max(dezimalen + 1, String(Math.floor(skal + 1e-6)).length);
  const spalten: number[] = [];
  for (let s = stellen - 1; s >= 0; s--) {
    const pot = 10 ** s;
    if (s === 0) {
      spalten.push(((skal % 10) + 10) % 10);
    } else {
      const basis = Math.floor(skal / pot);
      const rest = skal - basis * pot;
      spalten.push((basis + clamp01(rest - (pot - 1))) % 10);
    }
  }
  const ganz = stellen - dezimalen;
  return (
    <span style={{display: 'inline-flex', fontVariantNumeric: 'tabular-nums', color: farbe, filter: unschaerfe > 0.2 ? `blur(${unschaerfe}px)` : undefined}}>
      {spalten.map((pos, i) => (
        <React.Fragment key={i}>
          {dezimalen > 0 && i === ganz ? <span style={{display: 'inline-block', height: size, lineHeight: `${size}px`}}>,</span> : null}
          {tausender && i > 0 && i < ganz && (ganz - i) % 3 === 0 ? <span style={{display: 'inline-block', height: size, lineHeight: `${size}px`}}>.</span> : null}
          <span style={{display: 'inline-block', height: size, overflow: 'hidden', lineHeight: `${size}px`}}>
            <span style={{display: 'flex', flexDirection: 'column', transform: `translateY(${-pos * size}px)`}}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, k) => (
                <span key={k} style={{height: size}}>
                  {d}
                </span>
              ))}
            </span>
          </span>
        </React.Fragment>
      ))}
    </span>
  );
};

/** Große Zahl mit Gewichtskontrast: Zahl 800, Einheit 300. */
export const GrosseZahl: React.FC<{
  wert: number;
  size: number;
  einheit?: string;
  vor?: string;
  dezimalen?: number;
  farbe?: string;
  unschaerfe?: number;
  tausender?: boolean;
  style?: React.CSSProperties;
}> = ({wert, size, einheit, vor, dezimalen = 0, farbe = INK, unschaerfe, tausender, style}) => (
  <div style={{position: 'absolute', display: 'flex', alignItems: 'baseline', fontSize: size, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, whiteSpace: 'nowrap', ...style}}>
    {vor ? <span style={{fontWeight: 300, color: SOFT, marginRight: size * 0.08}}>{vor}</span> : null}
    <Zaehlwerk wert={wert} size={size} dezimalen={dezimalen} farbe={farbe} unschaerfe={unschaerfe} tausender={tausender} />
    {einheit ? <span style={{fontWeight: 300, color: SOFT, marginLeft: size * 0.1, letterSpacing: '-0.02em'}}>{einheit}</span> : null}
  </div>
);

export const Kapitaelchen: React.FC<{children: React.ReactNode; style?: React.CSSProperties; farbe?: string}> = ({children, style, farbe = SOFT}) => (
  <div style={{position: 'absolute', fontSize: 24, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: farbe, whiteSpace: 'nowrap', ...style}}>{children}</div>
);

/** Gezeichnete Linie (Unterstrich, Durchstreichung) – wächst von links. */
export const Strich: React.FC<{x: number; y: number; w: number; q: number; farbe?: string; dicke?: number; rot?: number}> = ({x, y, w, q, farbe = GRUEN, dicke = 6, rot = 0}) =>
  q <= 0 ? null : (
    <div style={{position: 'absolute', left: x, top: y - dicke / 2, width: w * q, height: dicke, borderRadius: dicke / 2, background: farbe, transformOrigin: '0 50%', transform: `rotate(${rot}deg)`}} />
  );

/* ───────────── Atmosphäre ───────────── */

export const Korn: React.FC<{frame: number}> = ({frame}) => (
  <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'multiply', pointerEvents: 'none'}}>
    <filter id="korn-strom">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={Math.floor(frame / 2) % 40} />
      <feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.2  0 0 0 0 0.25  0 0 0 0.9 0" />
    </filter>
    <rect width="1920" height="1080" filter="url(#korn-strom)" />
  </svg>
);

export const Vignette: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 60%, rgba(30,35,50,0.08) 100%)', pointerEvents: 'none'}} />
);

/** Weiches Licht: große radiale Verläufe, ziehen langsam mit der Kamera. */
export const Licht: React.FC<{versatz: number; t: number}> = ({versatz, t}) => (
  <>
    <div style={{position: 'absolute', left: 980 - (versatz % 2400) * 0.06 - t * 3, top: -420, width: 1400, height: 1150, borderRadius: '50%', background: `radial-gradient(closest-side, ${GRUEN_T} 0%, rgba(219,243,239,0) 100%)`}} />
    <div style={{position: 'absolute', left: -460 + t * 2 - (versatz % 2400) * 0.03, top: 430, width: 1300, height: 950, borderRadius: '50%', background: 'radial-gradient(closest-side, #FFF1E6 0%, rgba(255,241,230,0) 100%)'}} />
  </>
);

/* ───────────── Toki-Accessoire ───────────── */

/** Grüner Schutzhelm (Toki-Koordinaten). */
export const Helm: React.FC = () => (
  <g>
    <path d="M66,72 C66,0 234,0 234,72 Z" fill={GRUEN} />
    <path d="M136,22 Q150,16 164,22 V70 H136 Z" fill={GRUEN_D} />
    <path d="M96,58 C100,42 112,32 126,27" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.35} />
    <rect x={44} y={62} width={212} height={18} rx={9} fill={GRUEN_D} />
  </g>
);

/* ───────────── Stromzähler (Held) ───────────── */

export const ZAEHLER = {w: 460, h: 700};

/**
 * Zählerschrank mit mechanischem Zählwerk und drehender Scheibe.
 * `phase` = Winkel der Scheibe (rad), `fluss` = Leuchten bei Stromfluss.
 */
export const Stromzaehler: React.FC<{x: number; boden: number; wert: number; dezimalen?: number; phase: number; fluss?: number; unschaerfe?: number; einheit?: string}> = ({
  x,
  boden,
  wert,
  dezimalen = 2,
  phase,
  fluss = 0,
  unschaerfe = 0,
  einheit = 'Wh',
}) => {
  const {w, h} = ZAEHLER;
  const cx = w / 2;
  const markeX = cx + 128 * Math.sin(phase);
  const vorne = Math.cos(phase) > 0;
  return (
    <div style={{position: 'absolute', left: x, top: boden - h, width: w, height: h}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 38,
          background: `linear-gradient(180deg, #FFFFFF 0%, ${PAPIER} 100%)`,
          border: `3px solid ${METALL_D}`,
          boxShadow: `0 30px 60px rgba(40,45,60,0.10), 0 0 0 ${fluss * 10}px rgba(14,159,142,${0.12 * fluss})`,
        }}
      />
      {/* Glasfront */}
      <div style={{position: 'absolute', left: 36, top: 52, width: w - 72, height: 430, borderRadius: 26, background: '#F2F0EA', border: '2px solid #E3DFD5'}} />
      {/* Zählwerk */}
      <div style={{position: 'absolute', left: 66, top: 96, width: w - 132, height: 156, borderRadius: 16, background: DUNKEL, boxShadow: 'inset 0 6px 14px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14}}>
        <div style={{fontSize: 108, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex'}}>
          <Zaehlwerk wert={wert} size={108} dezimalen={dezimalen} farbe="#FFFFFF" unschaerfe={unschaerfe} />
        </div>
        <div style={{fontSize: 46, fontWeight: 300, color: '#9AA3AE', marginTop: 30}}>{einheit}</div>
      </div>
      {/* Läuferscheibe */}
      <svg width={w} height={h} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <ellipse cx={cx} cy={352} rx={160} ry={44} fill="#E6E2D9" stroke="#D4CFC4" strokeWidth={2} />
        <ellipse cx={cx} cy={352} rx={134} ry={13} fill="#C7C2B6" />
        <ellipse cx={cx} cy={349} rx={130} ry={7} fill="#DCD8CE" />
        {vorne ? <rect x={markeX - 7} y={340} width={14} height={22} rx={3} fill={INK} /> : null}
        <text x={cx} y={438} textAnchor="middle" fontSize={20} fontWeight={600} fill={GRAU} letterSpacing="0.12em" fontFamily={KANAL.body}>
          230 V · 50 Hz
        </text>
        {/* Klemmdeckel mit Schrauben */}
        <rect x={64} y={520} width={w - 128} height={118} rx={16} fill="#EEEBE4" stroke="#E0DCD2" strokeWidth={2} />
        {[
          [92, 546],
          [w - 92, 546],
          [92, 612],
          [w - 92, 612],
        ].map(([sx, sy], i) => (
          <g key={i}>
            <circle cx={sx} cy={sy} r={9} fill={METALL_D} />
            <path d={`M${sx - 5},${sy} H${sx + 5}`} stroke="#B6B1A5" strokeWidth={2.5} />
          </g>
        ))}
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={cx - 40 + i * 40} cy={579} r={10} fill={i === 1 && fluss > 0.05 ? GRUEN : '#D1CCC1'} />
        ))}
      </svg>
    </div>
  );
};

/* ───────────── Kraftwerk ───────────── */

/** Kühlturm (Hyperboloid) mit Dampf; (cx, boden) = Mitte unten. */
export const Kuehlturm: React.FC<{cx: number; boden: number; h: number; t: number; dampf?: number; wachsen?: number; seed?: number}> = ({cx, boden, h, t, dampf = 1, wachsen = 1, seed = 0}) => {
  const hh = h * wachsen;
  if (hh < 2) return null;
  const wb = h * 0.72;
  const ww = h * 0.42;
  const wt = h * 0.5;
  const top = boden - hh;
  const L = (f: number) => boden - hh * f;
  const d = `M${cx - wb / 2},${boden} Q${cx - ww / 2 - 8},${L(0.42)} ${cx - ww / 2},${L(0.72)} Q${cx - ww / 2 + 2},${L(0.9)} ${cx - wt / 2},${top} L${cx + wt / 2},${top} Q${cx + ww / 2 - 2},${L(0.9)} ${cx + ww / 2},${L(0.72)} Q${cx + ww / 2 + 8},${L(0.42)} ${cx + wb / 2},${boden} Z`;
  const id = `turm-${seed}`;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D2CDC2" />
          <stop offset="0.35" stopColor="#E7E3DB" />
          <stop offset="0.75" stopColor="#CDC7BB" />
          <stop offset="1" stopColor="#BAB3A6" />
        </linearGradient>
        <radialGradient id={`${id}-dampf`}>
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="0.65" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={d} fill={`url(#${id})`} />
      {[0.25, 0.5].map((f) => (
        <path key={f} d={`M${cx - ww / 2 - 6},${L(f + 0.28) + 4} H${cx + ww / 2 + 6}`} stroke="#D3CEC4" strokeWidth={2} opacity={0.5} />
      ))}
      <ellipse cx={cx} cy={top} rx={wt / 2} ry={wt * 0.08} fill="#C6C1B6" />
      {wachsen > 0.95
        ? Array.from({length: 7}, (_, i) => {
            const periode = 4.2;
            const q = (((t + i * (periode / 7) + seed * 0.37) % periode) + periode) % periode / periode;
            const r = h * (0.12 + q * 0.32);
            const sx = cx + Math.sin(i * 2.1 + seed) * h * 0.05 + q * h * 0.18;
            const sy = top - q * h * 0.75;
            const o = Math.sin(q * Math.PI) * 0.95 * dampf;
            return <circle key={i} cx={sx} cy={sy} r={r} fill={`url(#${id}-dampf)`} opacity={o} />;
          })
        : null}
    </svg>
  );
};

/* ───────────── Alltagsgeräte ───────────── */

/** Wasserkocher; (cx, boden) = Mitte unten, Grundgröße 260 × 300. */
export const Wasserkocher: React.FC<{cx: number; boden: number; k?: number; an: number; t: number; wasser?: number}> = ({cx, boden, k = 1, an, t, wasser = 0.6}) => (
  <div style={{position: 'absolute', left: cx - 130 * k, top: boden - 300 * k, width: 260 * k, height: 300 * k}}>
    <svg width={260 * k} height={300 * k} viewBox="0 0 260 300" style={{overflow: 'visible'}}>
      {/* Dampf aus der Tülle */}
      {an > 0.05
        ? Array.from({length: 5}, (_, i) => {
            const q = ((t * 0.55 + i / 5) % 1 + 1) % 1;
            return <circle key={i} cx={34 - q * 40 + Math.sin(i * 1.7 + q * 4) * 10} cy={70 - q * 170} r={14 + q * 36} fill="#FFFFFF" opacity={Math.sin(q * Math.PI) * 0.9 * an} />;
          })
        : null}
      {/* Griff */}
      <path d="M200,96 C262,100 262,230 202,240" stroke={METALL_D} strokeWidth={30} fill="none" strokeLinecap="round" />
      <path d="M200,96 C262,100 262,230 202,240" stroke="#F3F1EC" strokeWidth={20} fill="none" strokeLinecap="round" />
      {/* Tülle */}
      <path d="M62,98 L22,82 L30,116 L66,128 Z" fill="#F3F1EC" stroke={METALL_D} strokeWidth={3} strokeLinejoin="round" />
      {/* Körper */}
      <path d="M70,84 L190,84 Q200,84 202,96 L222,262 Q224,280 206,280 L54,280 Q36,280 38,262 L58,96 Q60,84 70,84 Z" fill={PAPIER} stroke={METALL_D} strokeWidth={3} />
      {/* Wasserfenster */}
      <rect x={92} y={120} width={22} height={140} rx={11} fill="#E9EEF0" />
      <rect x={92} y={120 + 140 * (1 - wasser)} width={22} height={140 * wasser} rx={11} fill={GRUEN} opacity={0.75} />
      {/* Deckel */}
      <path d="M64,86 Q130,58 196,86 Z" fill="#F3F1EC" stroke={METALL_D} strokeWidth={3} />
      <rect x={116} y={56} width={28} height={16} rx={8} fill={METALL_D} />
      {/* Schalter */}
      <rect x={196} y={222} width={30} height={20} rx={6} fill={an > 0.5 ? GRUEN : '#D1CCC1'} />
      {/* Sockel */}
      <rect x={24} y={278} width={212} height={22} rx={8} fill="#3A3F47" />
    </svg>
  </div>
);

/** LED-Lampe; (cx, cy) = Mitte des Glases. */
export const LedLampe: React.FC<{cx: number; cy: number; r?: number; an: number}> = ({cx, cy, r = 76, an}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <defs>
      <radialGradient id="led-glow">
        <stop offset="0" stopColor="#FFF4D2" stopOpacity="1" />
        <stop offset="1" stopColor="#FFF4D2" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx={cx} cy={cy} r={r * 2.6} fill="url(#led-glow)" opacity={an} />
    <path d={`M${cx - r * 0.42},${cy + r * 0.82} Q${cx - r},${cy + r * 0.3} ${cx - r},${cy - r * 0.05} A${r},${r} 0 1 1 ${cx + r},${cy - r * 0.05} Q${cx + r},${cy + r * 0.3} ${cx + r * 0.42},${cy + r * 0.82} Z`} fill={an > 0.3 ? '#FFFBEA' : '#FFFFFF'} stroke={METALL_D} strokeWidth={3} />
    {[-1, 0, 1].map((i) => (
      <path key={i} d={`M${cx + i * r * 0.22},${cy + r * 0.62} V${cy - r * 0.15}`} stroke={an > 0.3 ? '#F2C14E' : '#D8D4CA'} strokeWidth={5} strokeLinecap="round" />
    ))}
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={cx - r * 0.4} y={cy + r * 0.84 + i * 14} width={r * 0.8} height={10} rx={4} fill={i === 3 ? '#8F8A80' : '#BDB8AD'} />
    ))}
  </svg>
);

/** Flacher Fernseher; (cx, cy) = Bildschirmmitte. */
export const Fernseher: React.FC<{cx: number; cy: number; w?: number; an: number}> = ({cx, cy, w = 300, an}) => {
  const h = w * 0.58;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <defs>
        <linearGradient id="tv-bild" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={GRUEN} />
          <stop offset="1" stopColor="#8FD9CF" />
        </linearGradient>
      </defs>
      <path d={`M${cx - 26},${cy + h / 2} L${cx - 50},${cy + h / 2 + 46} H${cx + 50} L${cx + 26},${cy + h / 2} Z`} fill="#C9C4B9" />
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={12} fill={DUNKEL} />
      <rect x={cx - w / 2 + 10} y={cy - h / 2 + 10} width={w - 20} height={h - 20} rx={6} fill="url(#tv-bild)" opacity={an} />
      <path d={`M${cx - w / 2 + 30},${cy - h / 2 + 30} L${cx - w / 2 + 110},${cy - h / 2 + 30}`} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.5 * an} />
    </svg>
  );
};

/** Uhrbogen: Ring, der sich im Uhrzeigersinn füllt. */
export const Uhrbogen: React.FC<{cx: number; cy: number; r: number; q: number; sichtbar?: number}> = ({cx, cy, r, q, sichtbar = 1}) => {
  const a = Math.min(0.9999, q) * Math.PI * 2;
  const ex = cx + r * Math.sin(a);
  const ey = cy - r * Math.cos(a);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: sichtbar}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E6E2D9" strokeWidth={8} />
      {q > 0.002 ? <path d={`M${cx},${cy - r} A${r},${r} 0 ${a > Math.PI ? 1 : 0} 1 ${ex},${ey}`} fill="none" stroke={GRUEN} strokeWidth={8} strokeLinecap="round" /> : null}
      <circle cx={cx} cy={cy - r} r={6} fill={GRUEN} />
    </svg>
  );
};

/* ───────────── Requisiten ───────────── */

/** Filmklappe; (x, y) = oben links der Tafel, `offen` 0 = geschlossen, 1 = offen. */
export const Filmklappe: React.FC<{x: number; y: number; w?: number; offen: number; rot?: number}> = ({x, y, w = 150, offen, rot = 0}) => {
  const h = w * 0.72;
  const streifen = 5;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg)`, transformOrigin: '20% 100%'}}>
      <svg width={w} height={h} style={{overflow: 'visible'}}>
        <rect x={0} y={h * 0.22} width={w} height={h * 0.78} rx={8} fill="#2A2F37" />
        {[0.45, 0.62, 0.79].map((f) => (
          <path key={f} d={`M${w * 0.12},${h * f} H${w * 0.88}`} stroke="#FFFFFF" strokeWidth={3} opacity={0.5} />
        ))}
        <g transform={`translate(0, ${h * 0.2}) rotate(${-offen * 28})`}>
          <rect x={0} y={-h * 0.2} width={w} height={h * 0.2} rx={5} fill="#2A2F37" />
          {Array.from({length: streifen}, (_, i) => (
            <path key={i} d={`M${(i * w) / streifen + 10},${-h * 0.2} l${w / streifen / 2},${h * 0.2} h${w / streifen / 2.4} l${-w / streifen / 2},${-h * 0.2} Z`} fill="#FFFFFF" />
          ))}
        </g>
      </svg>
    </div>
  );
};

/** Papierstapel (Dokument). */
export const Papierstapel: React.FC<{x: number; y: number; w?: number; blaetter?: number; rot?: number}> = ({x, y, w = 150, blaetter = 12, rot = 0}) => {
  const h = w * 1.3;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w + blaetter * 3, height: h + blaetter * 3, transform: `rotate(${rot}deg)`}}>
      {Array.from({length: blaetter}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: (blaetter - 1 - i) * 3, top: (blaetter - 1 - i) * 3, width: w, height: h, borderRadius: 6, background: '#FFFFFF', border: '2px solid #DEDAD0'}} />
      ))}
      <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, padding: '18px 16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 9}}>
        {[0.6, 1, 0.92, 1, 0.8, 1, 0.95, 0.7, 1, 0.85].map((f, i) => (
          <div key={i} style={{height: 6, width: `${f * 100}%`, borderRadius: 3, background: i === 0 ? INK : '#D8D5CD'}} />
        ))}
      </div>
    </div>
  );
};

/** Bild (gerahmt) mit Bergen und Sonne. */
export const Bild: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 220}) => {
  const h = w * 0.72;
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
      <rect x={0} y={0} width={w} height={h} rx={14} fill="#FFFFFF" stroke={METALL_D} strokeWidth={3} />
      <rect x={14} y={14} width={w - 28} height={h - 28} rx={8} fill={GRUEN_T2} />
      <circle cx={w * 0.72} cy={h * 0.34} r={w * 0.08} fill={GRUEN} />
      <path d={`M14,${h - 14} L${w * 0.36},${h * 0.42} L${w * 0.56},${h * 0.7} L${w * 0.7},${h * 0.56} L${w - 14},${h - 14} Z`} fill="#BFC4CC" />
    </svg>
  );
};

/** Rechenzentrum (2,5D) mit blinkenden Rack-Lichtern; (x, boden) = links unten. */
export const Serverhalle: React.FC<{x: number; boden: number; w: number; h: number; t: number; reihen?: number; aufbau?: number; licht?: number}> = ({x, boden, w, h, t, reihen = 4, aufbau = 1, licht = 1}) => {
  const tiefe = 60;
  const top = boden - h;
  const sp = 16;
  const reiheH = (h - 90) / reihen;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={`M${x},${top} L${x + tiefe},${top - tiefe * 0.55} H${x + w + tiefe} L${x + w},${top} Z`} fill="#DCD8CF" opacity={aufbau} />
      <path d={`M${x + w},${top} L${x + w + tiefe},${top - tiefe * 0.55} V${boden - tiefe * 0.55} L${x + w},${boden} Z`} fill="#CFCAC0" opacity={aufbau} />
      <rect x={x} y={top} width={w} height={h} fill="#ECE9E2" opacity={aufbau} />
      {Array.from({length: reihen}, (_, r) => {
        const q = clamp01(aufbau * reihen - (reihen - 1 - r));
        const y = top + 40 + r * reiheH;
        const n = Math.floor((w - 60) / sp);
        return (
          <g key={r} opacity={q}>
            <rect x={x + 24} y={y} width={w - 48} height={reiheH - 18} rx={6} fill={DUNKEL} />
            {Array.from({length: n}, (_, i) => {
              const an = 0.5 + 0.5 * Math.sin(t * (1.3 + ((i * 7 + r * 3) % 5) * 0.37) + i * 1.9 + r);
              return <circle key={i} cx={x + 38 + i * sp} cy={y + (reiheH - 18) / 2} r={3.2} fill={an > 0.35 ? GRUEN : '#3C434D'} opacity={licht * (0.45 + 0.55 * an)} />;
            })}
          </g>
        );
      })}
      {[0.2, 0.5, 0.8].map((f) => (
        <rect key={f} x={x + w * f - 26} y={top - tiefe * 0.3 - 18} width={52} height={20} rx={4} fill="#C9C4B9" opacity={aufbau} />
      ))}
    </svg>
  );
};

/** Raster aus Chips, die als Welle aufleuchten. */
export const ChipRaster: React.FC<{x: number; y: number; spalten: number; zeilen: number; size: number; abstand: number; licht: (i: number, j: number) => number; sichtbar?: number}> = ({
  x,
  y,
  spalten,
  zeilen,
  size,
  abstand,
  licht,
  sichtbar = 1,
}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: sichtbar}}>
    {Array.from({length: zeilen}, (_, j) =>
      Array.from({length: spalten}, (_, i) => {
        const cx = x + i * (size + abstand);
        const cy = y + j * (size + abstand);
        const l = licht(i, j);
        return (
          <g key={`${i}-${j}`}>
            {[0.25, 0.5, 0.75].map((f) => (
              <React.Fragment key={f}>
                <path d={`M${cx + size * f},${cy - 5} V${cy}`} stroke="#B9B4A9" strokeWidth={2.5} />
                <path d={`M${cx + size * f},${cy + size} V${cy + size + 5}`} stroke="#B9B4A9" strokeWidth={2.5} />
              </React.Fragment>
            ))}
            <rect x={cx} y={cy} width={size} height={size} rx={5} fill="#2A2F37" />
            <rect x={cx + size * 0.25} y={cy + size * 0.25} width={size * 0.5} height={size * 0.5} rx={3} fill={GRUEN} opacity={0.15 + 0.85 * l} />
          </g>
        );
      }),
    )}
  </svg>
);

/**
 * Punktefeld: genau `spalten × zeilen` Punkte. `q` deckt sie als Welle auf
 * (diagonal von links oben oder radial aus der Mitte).
 */
export const Punktefeld: React.FC<{x: number; y: number; spalten: number; zeilen: number; dx: number; dy: number; r: number; q: number; farbe?: string; radial?: boolean; deckkraft?: number}> = ({
  x,
  y,
  spalten,
  zeilen,
  dx,
  dy,
  r,
  q,
  farbe = '#4A505B',
  radial,
  deckkraft = 1,
}) => {
  if (q <= 0) return null;
  const weich = 10;
  const maske = radial
    ? `radial-gradient(circle at 50% 50%, black ${q * 75 - weich}%, transparent ${q * 75}%)`
    : `linear-gradient(120deg, black ${q * (100 + weich) - weich}%, transparent ${q * (100 + weich)}%)`;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: spalten * dx,
        height: zeilen * dy,
        opacity: deckkraft,
        backgroundImage: `radial-gradient(circle at ${dx / 2}px ${dy / 2}px, ${farbe} ${r}px, transparent ${r + 0.8}px)`,
        backgroundSize: `${dx}px ${dy}px`,
        WebkitMaskImage: q >= 1 ? undefined : maske,
        maskImage: q >= 1 ? undefined : maske,
      }}
    />
  );
};

/* ───────────── Landkarten (vereinfachte Umrisse, Länge/Breite) ───────────── */

type LL = [lon: number, lat: number];

export const DEUTSCHLAND: LL[] = [
  [8.42, 55.03], [9.43, 54.81], [10.0, 54.6], [10.15, 54.33], [11.08, 54.45], [10.88, 53.97], [11.47, 53.9], [12.1, 54.18], [12.5, 54.47], [13.4, 54.68],
  [13.62, 54.12], [14.22, 53.92], [14.27, 53.7], [14.4, 53.3], [14.14, 52.83], [14.62, 52.58], [14.55, 52.34], [14.72, 51.95], [14.98, 51.15], [14.82, 50.87],
  [14.25, 50.9], [13.3, 50.6], [12.45, 50.38], [12.1, 50.25], [12.5, 49.95], [12.9, 49.35], [13.4, 49.02], [13.83, 48.77], [13.47, 48.57], [13.0, 48.25],
  [12.75, 48.08], [12.95, 47.73], [13.0, 47.47], [12.4, 47.68], [11.6, 47.58], [11.1, 47.4], [10.45, 47.55], [10.2, 47.3], [9.75, 47.55], [9.0, 47.68],
  [8.6, 47.65], [8.2, 47.6], [7.6, 47.58], [7.58, 48.03], [7.8, 48.57], [8.23, 48.97], [7.6, 49.08], [7.0, 49.15], [6.36, 49.47], [6.5, 49.75],
  [6.13, 50.13], [6.4, 50.35], [6.03, 50.73], [6.07, 51.2], [6.2, 51.5], [6.1, 51.85], [6.75, 51.92], [7.05, 52.24], [6.7, 52.48], [7.05, 52.65],
  [7.2, 52.95], [7.2, 53.25], [7.2, 53.6], [7.9, 53.72], [8.1, 53.52], [8.55, 53.55], [8.7, 53.87], [9.0, 53.88], [8.85, 54.1], [9.05, 54.48],
  [8.6, 54.55], [8.65, 54.9],
];

/** Republik Irland (ohne Nordirland). */
export const IRLAND: LL[] = [
  [-7.32, 55.0], [-6.98, 55.2], [-6.93, 55.23], [-7.37, 55.38], [-7.63, 55.27], [-8.3, 55.15], [-8.7, 54.85], [-8.75, 54.62], [-8.25, 54.6], [-8.6, 54.3],
  [-9.2, 54.22], [-9.35, 54.32], [-10.1, 54.25], [-10.2, 53.97], [-9.65, 53.8], [-9.85, 53.62], [-10.05, 53.5], [-10.23, 53.4], [-9.6, 53.24], [-9.05, 53.27],
  [-9.27, 53.15], [-9.43, 52.97], [-9.55, 52.75], [-9.92, 52.56], [-9.95, 52.42], [-9.8, 52.25], [-10.2, 52.27], [-10.46, 52.1], [-9.95, 52.08], [-10.38, 51.9],
  [-9.85, 51.8], [-10.15, 51.6], [-9.6, 51.65], [-9.82, 51.44], [-9.37, 51.48], [-8.9, 51.6], [-8.53, 51.6], [-8.28, 51.8], [-7.85, 51.95], [-7.6, 52.08],
  [-6.93, 52.12], [-6.36, 52.17], [-6.37, 52.34], [-6.2, 52.55], [-6.14, 52.8], [-5.99, 52.96], [-6.1, 53.27], [-6.06, 53.38], [-6.22, 53.8], [-6.35, 53.98],
  [-6.1, 54.03], [-6.3, 54.08], [-6.6, 54.08], [-6.85, 54.28], [-6.97, 54.4], [-7.23, 54.18], [-7.45, 54.1], [-7.6, 54.12], [-7.88, 54.3], [-8.09, 54.48],
  [-7.83, 54.55], [-7.47, 54.83],
];

/** Nordirland (nur blass, damit die Insel erkennbar bleibt). */
export const NORDIRLAND: LL[] = [
  [-7.32, 55.0], [-6.98, 55.2], [-6.95, 55.19], [-6.65, 55.21], [-6.15, 55.23], [-6.06, 55.19], [-5.8, 54.85], [-5.65, 54.67], [-5.45, 54.45], [-5.55, 54.36],
  [-5.65, 54.22], [-5.88, 54.21], [-6.1, 54.03], [-6.3, 54.08], [-6.6, 54.08], [-6.85, 54.28], [-6.97, 54.4], [-7.23, 54.18], [-7.45, 54.1], [-7.6, 54.12],
  [-7.88, 54.3], [-8.09, 54.48], [-7.83, 54.55], [-7.47, 54.83],
];

export type Kartenrahmen = {lon: [number, number]; lat: [number, number]; x: number; y: number; h: number};

/** Projiziert Länge/Breite in den Rahmen (Höhe fest, Breite aus cos(Breite)). */
export const projiziere = (r: Kartenrahmen) => {
  const k = Math.cos(((r.lat[0] + r.lat[1]) / 2) * (Math.PI / 180));
  const s = r.h / (r.lat[1] - r.lat[0]);
  return ([lon, lat]: LL): [number, number] => [r.x + (lon - r.lon[0]) * k * s, r.y + (r.lat[1] - lat) * s];
};

export const kartenPfad = (pts: LL[], r: Kartenrahmen) => {
  const pr = projiziere(r);
  return pts.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pr(pt)[0].toFixed(1)},${pr(pt)[1].toFixed(1)}`).join(' ') + ' Z';
};

/* ───────────── Wasser ───────────── */

export const tropfenPfad = (cx: number, cy: number, r: number) => `M${cx},${cy - r * 1.9} C${cx + r * 0.55},${cy - r * 1.05} ${cx + r},${cy - r * 0.55} ${cx + r},${cy} A${r},${r} 0 1 1 ${cx - r},${cy} C${cx - r},${cy - r * 0.55} ${cx - r * 0.55},${cy - r * 1.05} ${cx},${cy - r * 1.9} Z`;

/** Trinkglas; (cx, boden) = Mitte unten, `fuell` 0–1. */
export const Glas: React.FC<{cx: number; boden: number; w?: number; h?: number; fuell: number}> = ({cx, boden, w = 150, h = 190, fuell}) => {
  const top = boden - h;
  const wu = w * 0.78;
  const wf = h * fuell * 0.9;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={`M${cx - w / 2},${top} L${cx - wu / 2},${boden} H${cx + wu / 2} L${cx + w / 2},${top}`} fill="#FFFFFF" fillOpacity={0.55} stroke="#C9CED6" strokeWidth={4} strokeLinejoin="round" />
      {fuell > 0.001 ? (
        <path
          d={`M${cx - wu / 2 - ((w - wu) / 2) * (wf / h)},${boden - wf} L${cx - wu / 2 + 3},${boden - 3} H${cx + wu / 2 - 3} L${cx + wu / 2 + ((w - wu) / 2) * (wf / h)},${boden - wf} Z`}
          fill={GRUEN}
          opacity={0.7}
        />
      ) : null}
      <path d={`M${cx - w / 2 + 16},${top + 18} L${cx - wu / 2 + 16},${boden - 20}`} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
    </svg>
  );
};

/** Wasserflasche (0,5 l); (cx, boden) = Mitte unten. */
export const Flasche: React.FC<{cx: number; boden: number; h?: number; fuell: number}> = ({cx, boden, h = 420, fuell}) => {
  const w = h * 0.34;
  const top = boden - h;
  const schulter = top + h * 0.28;
  const koerper = `M${cx - w / 2},${boden - 18} Q${cx - w / 2},${boden} ${cx - w / 2 + 18},${boden} H${cx + w / 2 - 18} Q${cx + w / 2},${boden} ${cx + w / 2},${boden - 18} V${schulter + 30} Q${cx + w / 2},${schulter} ${cx + w * 0.18},${top + h * 0.12} V${top + 22} H${cx - w * 0.18} V${top + h * 0.12} Q${cx - w / 2},${schulter} ${cx - w / 2},${schulter + 30} Z`;
  const pegel = boden - (h - 40) * fuell;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <defs>
        <clipPath id="flasche-clip">
          <path d={koerper} />
        </clipPath>
      </defs>
      <path d={koerper} fill="#FFFFFF" fillOpacity={0.6} />
      <rect x={cx - w} y={pegel} width={w * 2} height={boden - pegel} fill={GRUEN} opacity={0.7} clipPath="url(#flasche-clip)" />
      <path d={koerper} fill="none" stroke="#C9CED6" strokeWidth={4} strokeLinejoin="round" />
      <rect x={cx - w * 0.22} y={top} width={w * 0.44} height={26} rx={6} fill="#9AA0AB" />
      <path d={`M${cx - w / 2 + 16},${schulter + 40} V${boden - 30}`} stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" opacity={0.8} />
    </svg>
  );
};

/* ───────────── Strom ───────────── */

/** Schuko-Steckdose; (cx, cy) = Mitte. */
export const Steckdose: React.FC<{cx: number; cy: number; s?: number}> = ({cx, cy, s = 150}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <rect x={cx - s / 2} y={cy - s / 2} width={s} height={s} rx={s * 0.18} fill="#FFFFFF" stroke={METALL_D} strokeWidth={3} />
    <circle cx={cx} cy={cy} r={s * 0.34} fill="#F1EFE9" stroke="#E0DCD2" strokeWidth={2} />
    <circle cx={cx - s * 0.13} cy={cy} r={s * 0.055} fill={INK} />
    <circle cx={cx + s * 0.13} cy={cy} r={s * 0.055} fill={INK} />
    <rect x={cx - s * 0.05} y={cy - s * 0.34} width={s * 0.1} height={s * 0.07} rx={2} fill="#C9C4B9" />
    <rect x={cx - s * 0.05} y={cy + s * 0.27} width={s * 0.1} height={s * 0.07} rx={2} fill="#C9C4B9" />
  </svg>
);

/** Stecker mit Kabelansatz; (x, y) = Mitte, Stifte zeigen nach rechts. */
export const Stecker: React.FC<{x: number; y: number; rot?: number; s?: number}> = ({x, y, rot = 0, s = 1}) => (
  <div style={{position: 'absolute', left: x - 50 * s, top: y - 30 * s, width: 100 * s, height: 60 * s, transform: `rotate(${rot}deg)`}}>
    <svg width={100 * s} height={60 * s} viewBox="0 0 100 60" style={{overflow: 'visible'}}>
      <rect x={70} y={20} width={30} height={6} rx={3} fill="#B9B4A9" />
      <rect x={70} y={34} width={30} height={6} rx={3} fill="#B9B4A9" />
      <rect x={10} y={4} width={64} height={52} rx={16} fill="#2F343C" />
      <rect x={0} y={22} width={14} height={16} rx={6} fill="#2F343C" />
    </svg>
  </div>
);

/** Energiequellen als kleine eigene Zeichnungen; (cx, boden) = Mitte unten. */
export const Quelle: React.FC<{art: 'kohle' | 'gas' | 'sonne' | 'wind' | 'atom'; cx: number; boden: number; t: number; farbe: string; s?: number}> = ({art, cx, boden, t, farbe, s = 1}) => {
  const g = (inhalt: React.ReactNode) => (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <g transform={`translate(${cx}, ${boden}) scale(${s})`}>{inhalt}</g>
    </svg>
  );
  if (art === 'kohle') {
    return g(
      <>
        {[0, 1, 2].map((i) => {
          const q = ((t * 0.35 + i / 3) % 1 + 1) % 1;
          return <circle key={i} cx={22 + q * 30} cy={-150 - q * 70} r={14 + q * 18} fill="#C9C5BC" opacity={Math.sin(q * Math.PI) * 0.9} />;
        })}
        <path d="M-60,0 V-60 L-30,-80 V-60 L0,-80 V-60 L30,-80 V0 Z" fill={farbe} />
        <rect x={10} y={-150} width={26} height={150} fill={farbe} />
      </>,
    );
  }
  if (art === 'gas') {
    return g(
      <>
        <path d="M0,-150 C30,-110 52,-86 52,-50 C52,-14 28,0 0,0 C-28,0 -52,-14 -52,-50 C-52,-80 -30,-96 -18,-120 C-12,-96 -4,-90 4,-86 C2,-110 -2,-130 0,-150 Z" fill={farbe} />
        <path d="M0,-62 C14,-46 20,-36 20,-24 C20,-10 10,-4 0,-4 C-10,-4 -20,-10 -20,-24 C-20,-36 -10,-46 0,-62 Z" fill="#FFFFFF" opacity={0.6} />
      </>,
    );
  }
  if (art === 'sonne') {
    return g(
      <>
        <circle cx={0} cy={-78} r={40} fill={farbe} />
        {Array.from({length: 8}, (_, i) => {
          const a = (i * Math.PI) / 4 + t * 0.2;
          return <path key={i} d={`M${Math.cos(a) * 56},${-78 + Math.sin(a) * 56} L${Math.cos(a) * 76},${-78 + Math.sin(a) * 76}`} stroke={farbe} strokeWidth={9} strokeLinecap="round" />;
        })}
      </>,
    );
  }
  if (art === 'wind') {
    return g(
      <>
        <path d="M-6,0 L-3,-130 H3 L6,0 Z" fill={farbe} />
        <g transform={`translate(0,-132) rotate(${t * 80})`}>
          {[0, 120, 240].map((a) => (
            <path key={a} transform={`rotate(${a})`} d="M0,0 C8,-20 8,-70 0,-86 C-6,-70 -6,-20 0,0 Z" fill={farbe} />
          ))}
          <circle r={8} fill={farbe} />
        </g>
      </>,
    );
  }
  return g(
    <>
      <path d="M-50,0 Q-30,-60 -32,-100 Q-30,-130 -36,-150 H36 Q30,-130 32,-100 Q30,-60 50,0 Z" fill={farbe} />
      {[0, 1].map((i) => {
        const q = ((t * 0.3 + i / 2) % 1 + 1) % 1;
        return <circle key={i} cx={q * 20} cy={-165 - q * 50} r={16 + q * 16} fill="#E4E1DA" opacity={Math.sin(q * Math.PI) * 0.9} />;
      })}
    </>,
  );
};

/* ───────────── Oberflächen (echte UI → darf ein Feld sein) ───────────── */

/** Eingabefeld eines Chats (generisch, keine echte App). */
export const Eingabefeld: React.FC<{x: number; y: number; w: number; text: string; tipp: number; senden: number; anhang?: number; t: number}> = ({x, y, w, text, tipp, senden, anhang = 0, t}) => {
  const sichtbar = text.slice(0, Math.round(text.length * clamp01(tipp)));
  const cursor = tipp < 1 && Math.floor(t * 2.2) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: 92, borderRadius: 46, background: '#FFFFFF', border: `2px solid ${LINIE}`, boxShadow: '0 18px 40px rgba(30,35,50,0.08)', display: 'flex', alignItems: 'center', padding: '0 14px 0 34px', boxSizing: 'border-box'}}>
      {anhang > 0 ? (
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginRight: 16, padding: '10px 16px', borderRadius: 18, background: GRUEN_T2, border: `2px solid ${GRUEN_T}`, transform: `scale(${0.6 + 0.4 * anhang})`, opacity: anhang, transformOrigin: '0 50%'}}>
          <div style={{width: 22, height: 28, borderRadius: 4, background: '#FFFFFF', border: `2px solid ${GRUEN}`}} />
          <span style={{fontSize: 26, fontWeight: 700, color: GRUEN_D}}>PDF</span>
        </div>
      ) : null}
      <div style={{flex: 1, fontSize: 32, fontWeight: 500, color: sichtbar ? INK : GRAU, whiteSpace: 'nowrap', overflow: 'hidden'}}>
        {sichtbar || 'Frag irgendwas …'}
        {cursor ? <span style={{color: GRUEN}}>|</span> : null}
      </div>
      <div style={{width: 64, height: 64, borderRadius: 32, background: tipp >= 1 ? GRUEN : '#E3E0D8', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - 0.12 * Math.sin(clamp01(senden) * Math.PI)})`}}>
        <svg width={30} height={30} viewBox="0 0 30 30">
          <path d="M15,24 V7 M8,13 L15,6 L22,13" stroke="#FFFFFF" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

export const AboKnopf: React.FC<{cx: number; cy: number; q: number; gedrueckt: number}> = ({cx, cy, q, gedrueckt}) =>
  q <= 0 ? null : (
    <div
      style={{
        position: 'absolute',
        left: cx - 210,
        top: cy - 52,
        width: 420,
        height: 104,
        borderRadius: 52,
        background: gedrueckt > 0.5 ? INK : GRUEN,
        color: '#FFFFFF',
        fontSize: 42,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: q,
        transform: `translateY(${(1 - q) * 30}px) scale(${1 - 0.06 * Math.sin(clamp01(gedrueckt) * Math.PI)})`,
        boxShadow: '0 20px 40px rgba(14,159,142,0.25)',
      }}
    >
      {gedrueckt > 0.5 ? 'Abonniert ✓' : 'Abonnieren'}
    </div>
  );
