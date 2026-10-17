import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {clamp01, EASE, mix, pop, progress, Sfx} from '../../kit';
import type {Project} from '../types';

/**
 * Doku-Probe „Warum Städte am Fluss entstehen“ – 2.5D-Dokustil, alles per Code.
 * Eine Landschaft aus Ebenen, die Kamera fährt mit Parallax hinein und wieder heraus.
 * Fakt: Frankfurt = „Furt der Franken“ (Ortsname, allgemein belegt).
 */

const FPS = 30;
const DAUER = 18.5;
const HORIZONT = 470;
const fr = (s: number) => Math.round(s * FPS);

const C = {
  himmelOben: '#E9DCC0',
  himmelUnten: '#F4EBD6',
  bergFern: '#B7B6A4',
  bergNah: '#9C9F8C',
  huegel: '#8A9273',
  huegelNah: '#76825F',
  boden: '#A6A374',
  bodenNah: '#8F9363',
  feld: ['#B3AC7C', '#9FA06C', '#C2B485', '#8C935F'],
  fluss: '#557F86',
  flussHell: '#8DB2AE',
  weg: '#D8C59A',
  tinte: '#2B2622',
  rot: '#A9472F',
  rotDunkel: '#7F3322',
  wand: ['#EADBB9', '#E2CFA6', '#D9C39A'],
  baum: '#55664A',
  baumDunkel: '#3E4C38',
};

const SERIF = 'Fraunces, serif';
const SANS = 'Inter, sans-serif';

/* ───────────── Geometrie der Welt ───────────── */

const flussX = (y: number) => 1100 - (y - HORIZONT) * 0.25 + 120 * Math.sin((y - HORIZONT) / 120);
const flussB = (y: number) => (8 + (y - HORIZONT) * 0.5) * (1 - 0.45 * Math.exp(-(((y - 640) / 45) ** 2)));
const tiefe = (y: number) => 0.35 + ((y - HORIZONT) / 610) * 0.9;

const FURT = {x: flussX(640), y: 640};
const MAUER = {x: FURT.x, y: 655, rx: 470, ry: 140};

const flussPfad = (() => {
  const links: string[] = [];
  const rechts: string[] = [];
  for (let y = HORIZONT; y <= 1700; y += 10) {
    const yy = Math.min(y, 1700);
    links.push(`${(flussX(yy) - flussB(yy) / 2).toFixed(1)},${yy}`);
    rechts.unshift(`${(flussX(yy) + flussB(yy) / 2).toFixed(1)},${yy}`);
  }
  return `M ${links.join(' L ')} L ${rechts.join(' L ')} Z`;
})();

const WEG = `M -400 800 Q 520 720 ${FURT.x} ${FURT.y} Q 1750 590 2500 545`;
const WEG_LEN = getLength(WEG);
const wegPunkt = (l: number) => getPointAtLength(WEG, l) ?? {x: 0, y: 0};
const WEG_PKT = Array.from({length: 41}, (_, i) => wegPunkt((WEG_LEN * i) / 40));
const FURT_ANTEIL = getLength(`M -400 800 Q 520 720 ${FURT.x} ${FURT.y}`) / WEG_LEN;

/* ───────────── Kamera ───────────── */

type Key = [t: number, cx: number, cy: number, z: number];
const KAMERA: Key[] = [
  [0, 960, 560, 1.04],
  [4.5, 990, 575, 1.14],
  [6.4, FURT.x, 650, 2.15],
  [9.0, FURT.x + 15, 648, 2.25],
  [10.4, FURT.x - 30, 572, 1.6],
  [13.4, FURT.x - 40, 566, 1.7],
  [15.4, FURT.x - 20, 600, 1.22],
  [DAUER, FURT.x - 20, 596, 1.28],
];

const kamera = (t: number) => {
  for (let i = 0; i < KAMERA.length - 1; i++) {
    const [t0, x0, y0, z0] = KAMERA[i];
    const [t1, x1, y1, z1] = KAMERA[i + 1];
    if (t <= t1 || i === KAMERA.length - 2) {
      const q = EASE.inOut(clamp01((t - t0) / (t1 - t0)));
      return {cx: mix(x0, x1, q), cy: mix(y0, y1, q), z: mix(z0, z1, q)};
    }
  }
  return {cx: 960, cy: 560, z: 1};
};

const useZeit = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {
    frame,
    t: frame / FPS,
    p: (start: number, dauer = 0.5, ease: keyof typeof EASE = 'out') => progress(frame, fr(start), Math.max(1, fr(dauer)), ease),
    feder: (start: number) => pop(frame, fps, fr(start), 'snappy'),
  };
};

/** Projektion eines Weltpunkts der Hauptebene auf den Bildschirm. */
const aufBild = (wx: number, wy: number, t: number) => {
  const {cx, cy, z} = kamera(t);
  return {x: 960 + (wx - cx) * z, y: 540 + (wy - cy) * z};
};

const Ebene: React.FC<{f: number; children: React.ReactNode; filter?: string}> = ({f, children, filter}) => {
  const {t} = useZeit();
  const {cx, cy, z} = kamera(t);
  const s = 1 + (z - 1) * f;
  const ox = 960 + (cx - 960) * f;
  const oy = 540 + (cy - 540) * f;
  return (
    <g transform={`translate(960 540) scale(${s}) translate(${-ox} ${-oy})`} filter={filter}>
      {children}
    </g>
  );
};

/* ───────────── Hintergrund ───────────── */

const bergKette = (basis: number, hoehe: number, seed: string, von = -1600, bis = 3600) => {
  const pkt: string[] = [`${von},${basis + 300}`];
  for (let x = von; x <= bis; x += 60) {
    const n = Math.sin(x / 310 + random(seed) * 6) * 0.5 + Math.sin(x / 140 + random(seed + 'b') * 6) * 0.3 + Math.sin(x / 57) * 0.08;
    pkt.push(`${x},${(basis - hoehe * (0.55 + n)).toFixed(1)}`);
  }
  pkt.push(`${bis},${basis + 300}`);
  return `M ${pkt.join(' L ')} Z`;
};

const BERG_FERN = bergKette(HORIZONT + 10, 150, 'fern');
const BERG_NAH = bergKette(HORIZONT + 20, 80, 'nah');
const HUEGEL = bergKette(HORIZONT + 30, 34, 'huegel');

const Wolke: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#FBF5E8" opacity={0.85}>
    <rect x={-110} y={-6} width={220} height={36} rx={18} />
    <ellipse cx={-30} cy={-6} rx={60} ry={30} />
    <ellipse cx={40} cy={-14} rx={52} ry={34} />
  </g>
);

const Himmel: React.FC = () => {
  const {t} = useZeit();
  const d = t * 6;
  return (
    <>
      <Ebene f={0.04}>
        <rect x={-2000} y={-1500} width={6000} height={HORIZONT + 1600} fill="url(#himmel)" />
        <circle cx={640} cy={330} r={70} fill="#F8EFD9" />
        <circle cx={640} cy={330} r={150} fill="#F8EFD9" opacity={0.35} />
      </Ebene>
      <Ebene f={0.12}>
        <Wolke x={220 + d} y={170} s={1.1} />
        <Wolke x={1500 + d * 0.7} y={120} s={0.8} />
        <Wolke x={2300 + d} y={210} s={1.2} />
        <Wolke x={-500 + d * 0.8} y={240} s={0.9} />
      </Ebene>
      <Ebene f={0.22}>
        <path d={BERG_FERN} fill={C.bergFern} />
      </Ebene>
      <Ebene f={0.4}>
        <path d={BERG_NAH} fill={C.bergNah} />
      </Ebene>
      <Ebene f={0.65}>
        <path d={HUEGEL} fill={C.huegel} />
      </Ebene>
    </>
  );
};

/* ───────────── Hauptebene: Boden, Fluss, Weg, Stadt ───────────── */

const FELDER = Array.from({length: 26}, (_, i) => {
  const y = HORIZONT + 12 + random(`fy${i}`) ** 1.4 * 520;
  const s = tiefe(y);
  const x = -700 + random(`fx${i}`) * 3300;
  const w = (180 + random(`fw${i}`) * 260) * s;
  const h = (40 + random(`fh${i}`) * 50) * s;
  const k = (random(`fk${i}`) - 0.5) * 0.6 * w;
  return {d: `M ${x} ${y} L ${x + w} ${y} L ${x + w + k} ${y + h} L ${x + k} ${y + h} Z`, farbe: C.feld[i % 4]};
});

const imOval = (x: number, y: number, f = 1) => ((x - MAUER.x) / (MAUER.rx * f)) ** 2 + ((y - MAUER.y) / (MAUER.ry * f)) ** 2 < 1;
const amFluss = (x: number, y: number, rand: number) => Math.abs(x - flussX(y)) < flussB(y) / 2 + rand;

const abstandStrecke = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
  const dx = bx - ax;
  const dy = by - ay;
  const q = clamp01(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy));
  return Math.hypot(px - (ax + q * dx), py - (ay + q * dy));
};
const amWeg = (x: number, y: number) => {
  const pts = WEG_PKT;
  return pts.slice(1).some((b, i) => abstandStrecke(x, y, pts[i].x, pts[i].y, b.x, b.y) < 22 * tiefe(y));
};

const ZELTE = [
  {x: FURT.x - 105, y: 672},
  {x: FURT.x - 165, y: 648},
  {x: FURT.x - 60, y: 700},
  {x: FURT.x + 95, y: 615},
];

const BAEUME = (() => {
  const out: {x: number; y: number; r: number}[] = [];
  for (let i = 0; out.length < 70 && i < 600; i++) {
    const y = HORIZONT + 8 + random(`by${i}`) ** 1.2 * 640;
    const x = -800 + random(`bx${i}`) * 3500;
    if (imOval(x, y, 1.15) || amFluss(x, y, 25) || amWeg(x, y)) continue;
    out.push({x, y, r: (16 + random(`br${i}`) * 10) * tiefe(y)});
  }
  return out;
})();

type Haus = {x: number; y: number; w: number; h: number; dach: number; wand: string; rot: string; welle: number; start: number; turm?: boolean};

const HAEUSER: Haus[] = (() => {
  const out: Haus[] = [];
  for (let i = 0; out.length < 46 && i < 2000; i++) {
    const a = random(`ha${i}`) * Math.PI * 2;
    const r = Math.sqrt(random(`hr${i}`)) * 0.93;
    const x = MAUER.x + Math.cos(a) * MAUER.rx * r;
    const y = MAUER.y + Math.sin(a) * MAUER.ry * r;
    if (amFluss(x, y, 22) || amWeg(x, y)) continue;
    if (ZELTE.some((z) => Math.hypot(z.x - x, (z.y - y) * 2) < 60)) continue;
    if (out.some((h) => Math.hypot(h.x - x, (h.y - y) * 2.2) < 46 * tiefe(y))) continue;
    const s = tiefe(y);
    const nah = Math.hypot(x - FURT.x, (y - FURT.y) * 2.5);
    out.push({
      x,
      y,
      w: (40 + random(`hw${i}`) * 26) * s,
      h: (28 + random(`hh${i}`) * 14) * s,
      dach: (22 + random(`hd${i}`) * 10) * s,
      wand: C.wand[i % 3],
      rot: random(`hc${i}`) > 0.3 ? C.rot : C.rotDunkel,
      welle: nah < 330 ? 1 : 2,
      start: 0,
    });
  }
  // Starts staffeln: innen zuerst, dann nach außen
  const w1 = out.filter((h) => h.welle === 1).sort((a, b) => Math.hypot(a.x - FURT.x, a.y - FURT.y) - Math.hypot(b.x - FURT.x, b.y - FURT.y));
  w1.forEach((h, i) => (h.start = 10.6 + i * 0.14));
  const w2 = out.filter((h) => h.welle === 2).sort((a, b) => Math.hypot(a.x - FURT.x, a.y - FURT.y) - Math.hypot(b.x - FURT.x, b.y - FURT.y));
  w2.forEach((h, i) => (h.start = 14.0 + i * 0.06));
  // Kirche auf dem linken Ufer
  out.push({x: FURT.x - 230, y: 610, w: 38, h: 34, dach: 22, wand: C.wand[0], rot: C.rotDunkel, welle: 1, start: 12.4, turm: true});
  return out.sort((a, b) => a.y - b.y);
})();

const Baum: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => (
  <g>
    <ellipse cx={x} cy={y} rx={r * 1.1} ry={r * 0.28} fill="#000" opacity={0.12} />
    <rect x={x - r * 0.12} y={y - r * 1.2} width={r * 0.24} height={r * 1.2} fill="#5A4636" />
    <circle cx={x} cy={y - r * 1.5} r={r} fill={C.baum} />
    <circle cx={x - r * 0.3} cy={y - r * 1.75} r={r * 0.5} fill="#6C7E5C" opacity={0.6} />
  </g>
);

const HausForm: React.FC<{h: Haus}> = ({h}) => {
  const {feder} = useZeit();
  const k = feder(h.start);
  if (k <= 0.001) return null;
  const {x, y, w} = h;
  const hoch = h.turm ? h.h * 1.7 : h.h;
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
      <ellipse cx={x + w * 0.15} cy={y} rx={w * 0.75} ry={w * 0.16} fill="#000" opacity={0.16} />
      <rect x={x - w / 2} y={y - hoch} width={w} height={hoch} fill={h.wand} />
      <rect x={x + w * 0.18} y={y - hoch} width={w * 0.32} height={hoch} fill="#000" opacity={0.1} />
      {h.turm ? (
        <path d={`M ${x - w * 0.55} ${y - hoch} L ${x} ${y - hoch - h.dach * 2.4} L ${x + w * 0.55} ${y - hoch} Z`} fill={h.rot} />
      ) : (
        <path d={`M ${x - w * 0.62} ${y - hoch} L ${x - w * 0.1} ${y - hoch - h.dach} L ${x + w * 0.62} ${y - hoch} Z`} fill={h.rot} />
      )}
      <rect x={x - w * 0.3} y={y - hoch * 0.5} width={w * 0.16} height={hoch * 0.5} fill={C.tinte} opacity={0.7} />
      <rect x={x + 0.02 * w} y={y - hoch * 0.75} width={w * 0.13} height={w * 0.13} fill={C.tinte} opacity={0.55} />
    </g>
  );
};

const Zelt: React.FC<{x: number; y: number; start: number}> = ({x, y, start}) => {
  const {feder} = useZeit();
  const k = feder(start);
  if (k <= 0.001) return null;
  const s = tiefe(y);
  const w = 46 * s;
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
      <ellipse cx={x} cy={y} rx={w * 0.7} ry={w * 0.15} fill="#000" opacity={0.15} />
      <rect x={x - w / 2} y={y - w * 0.45} width={w} height={w * 0.45} fill="#F1E6CC" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x - w / 2 + (i * 2 * w) / 5} y={y - w * 0.45} width={w / 5} height={w * 0.45} fill={C.rot} />
      ))}
      <path d={`M ${x - w * 0.6} ${y - w * 0.45} L ${x} ${y - w * 0.95} L ${x + w * 0.6} ${y - w * 0.45} Z`} fill={C.rotDunkel} />
    </g>
  );
};

const Karren: React.FC = () => {
  const {t} = useZeit();
  const q = EASE.inOut(clamp01((t - 6.2) / 3.4));
  if (t < 5.8 || t > 10.6) return null;
  const anteil = mix(FURT_ANTEIL - 0.12, FURT_ANTEIL + 0.05, q);
  const pt = wegPunkt(WEG_LEN * anteil);
  const s = tiefe(pt.y) * 1.05;
  const rad = (t * 260) % 360;
  const imWasser = Math.abs(pt.x - FURT.x) < flussB(640) / 2 + 4;
  const sichtbar = clamp01((t - 5.8) / 0.4) * clamp01((10.6 - t) / 0.4);
  return (
    <g transform={`translate(${pt.x} ${pt.y + (imWasser ? 3 : 0)}) scale(${s})`} opacity={sichtbar}>
      <ellipse cx={0} cy={0} rx={46} ry={8} fill="#000" opacity={0.18} />
      <circle cx={34} cy={-34} r={9} fill={C.tinte} />
      <rect x={24} y={-26} width={20} height={26} rx={8} fill={C.tinte} />
      <rect x={-40} y={-38} width={56} height={24} rx={3} fill="#9B6B3F" />
      <rect x={-36} y={-50} width={22} height={14} rx={3} fill="#D8B97F" />
      <rect x={-12} y={-48} width={20} height={12} rx={3} fill="#C49A5E" />
      <g transform={`translate(-14 -10) rotate(${rad})`}>
        <circle r={12} fill="none" stroke={C.tinte} strokeWidth={4} />
        <line x1={-12} y1={0} x2={12} y2={0} stroke={C.tinte} strokeWidth={3} />
        <line x1={0} y1={-12} x2={0} y2={12} stroke={C.tinte} strokeWidth={3} />
      </g>
      {imWasser ? <ellipse cx={-14} cy={0} rx={30} ry={5} fill="#FFFFFF" opacity={0.6} /> : null}
    </g>
  );
};

const Mauer: React.FC = () => {
  const {p, feder} = useZeit();
  const q = p(14.4, 2.0, 'inOut');
  if (q <= 0) return null;
  const {x: mx, y: my, rx, ry} = MAUER;
  const d = `M ${mx - rx} ${my} A ${rx} ${ry} 0 0 1 ${mx + rx} ${my} A ${rx} ${ry} 0 0 1 ${mx - rx} ${my}`;
  const ev = evolvePath(q, d);
  const tuerme = Array.from({length: 10}, (_, i) => {
    const a = Math.PI + (i / 10) * Math.PI * 2;
    return {x: MAUER.x + Math.cos(a) * MAUER.rx, y: MAUER.y + Math.sin(a) * MAUER.ry, i};
  });
  return (
    <g>
      <path d={d} fill="none" stroke="#6E6152" strokeWidth={9} strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
      <path d={d} fill="none" stroke="#CDBB98" strokeWidth={4} strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} transform="translate(0 -4)" />
      {tuerme.map((tw) => {
        const k = feder(14.4 + (tw.i / 10) * 2.0);
        if (k <= 0.001) return null;
        const s = tiefe(tw.y);
        return (
          <g key={tw.i} transform={`translate(${tw.x} ${tw.y}) scale(${k * s})`}>
            <rect x={-12} y={-40} width={24} height={40} fill="#BFAE8C" />
            <rect x={2} y={-40} width={10} height={40} fill="#000" opacity={0.12} />
            <path d="M -16 -40 L 0 -62 L 16 -40 Z" fill={C.rotDunkel} />
          </g>
        );
      })}
    </g>
  );
};

const Hauptebene: React.FC = () => {
  const {t, p} = useZeit();
  const weg = evolvePath(p(5.2, 1.6, 'inOut'), WEG);
  const tiefenKey = HAEUSER.map((h) => ({y: h.y, el: <HausForm key={`h${h.x}`} h={h} />}))
    .concat(BAEUME.map((b) => ({y: b.y, el: <Baum key={`b${b.x}`} {...b} />})))
    .concat(ZELTE.map((z, i) => ({y: z.y, el: <Zelt key={`z${i}`} x={z.x} y={z.y} start={9.9 + i * 0.18} />})))
    .sort((a, b) => a.y - b.y);
  const glitzer = (t * 40) % 80;
  return (
    <Ebene f={1}>
      <rect x={-2500} y={HORIZONT} width={7000} height={1600} fill="url(#boden)" />
      {FELDER.map((f, i) => (
        <path key={i} d={f.d} fill={f.farbe} opacity={0.55} />
      ))}
      <path d={flussPfad} fill={C.fluss} />
      <path d={flussPfad} fill="none" stroke={C.flussHell} strokeWidth={3} opacity={0.6} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const y = 700 + i * 70 + (glitzer * (0.5 + i * 0.1)) % 50;
        const x = flussX(y) + (random(`gl${i}`) - 0.5) * flussB(y) * 0.5;
        return <rect key={i} x={x - 14 * tiefe(y)} y={y} width={28 * tiefe(y)} height={3} rx={1.5} fill="#FFFFFF" opacity={0.35} />;
      })}
      <ellipse cx={FURT.x} cy={FURT.y} rx={flussB(640) * 0.62} ry={13} fill={C.flussHell} />
      {[-14, -2, 10].map((dx, i) => (
        <ellipse key={i} cx={FURT.x + dx} cy={FURT.y + (i % 2) * 4 - 2} rx={4} ry={2.2} fill="#D7CDB6" />
      ))}
      <path d={WEG} fill="none" stroke="#B9A77E" strokeWidth={16} strokeLinecap="round" strokeDasharray={weg.strokeDasharray} strokeDashoffset={weg.strokeDashoffset} />
      <path d={WEG} fill="none" stroke={C.weg} strokeWidth={10} strokeLinecap="round" strokeDasharray={weg.strokeDasharray} strokeDashoffset={weg.strokeDashoffset} />
      <Mauer />
      {tiefenKey.map((x) => x.el)}
      <Karren />
      <rect x={-2500} y={HORIZONT - 30} width={7000} height={70} fill="url(#dunst)" />
    </Ebene>
  );
};

/* ───────────── Vordergrund (unscharf, schnellste Ebene) ───────────── */

const Vordergrund: React.FC = () => {
  const {p} = useZeit();
  const o = 1 - p(4.6, 1.2, 'inOut');
  if (o <= 0) return null;
  return (
  <Ebene f={1.6} filter="url(#unscharf)">
    <g fill={C.baumDunkel} opacity={o}>
      <circle cx={-60} cy={980} r={230} />
      <circle cx={140} cy={1080} r={190} />
      <circle cx={2020} cy={1000} r={240} />
      <circle cx={1820} cy={1110} r={170} />
      <rect x={-600} y={1080} width={3200} height={500} />
    </g>
  </Ebene>
  );
};

/* ───────────── Texte ───────────── */

const Kicker: React.FC<{children: React.ReactNode; o: number}> = ({children, o}) => (
  <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: C.rot, textTransform: 'uppercase', opacity: o}}>{children}</div>
);

const Titel: React.FC = () => {
  const {p} = useZeit();
  const ein = 1;
  const aus = p(4.0, 0.5, 'in');
  const z2 = p(0.15, 0.6);
  return (
    <div style={{position: 'absolute', left: 140, top: 120, opacity: ein * (1 - aus), transform: `translateY(${-aus * 30}px)`}}>
      <Kicker o={1}>Eine kurze Geschichte</Kicker>
      <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 104, lineHeight: 1.02, color: C.tinte, marginTop: 18}}>
        Warum Städte
        <br />
        <span style={{opacity: z2, display: 'inline-block', transform: `translateY(${(1 - z2) * 24}px)`}}>
          am <span style={{color: C.fluss}}>Fluss</span> entstehen
        </span>
      </div>
    </div>
  );
};

const Hinweis: React.FC<{start: number; ende: number; wx: number; wy: number; titel: string; text: string; seite?: 'links' | 'rechts'; hoehe?: number}> = ({start, ende, wx, wy, titel, text, seite = 'rechts', hoehe = 230}) => {
  const {t, p} = useZeit();
  if (t < start - 0.1 || t > ende + 0.5) return null;
  const linie = p(start, 0.45, 'inOut');
  const box = p(start + 0.3, 0.45);
  const aus = p(ende, 0.4, 'in');
  const pt = aufBild(wx, wy, t);
  const dx = seite === 'rechts' ? 1 : -1;
  const ex = pt.x + dx * 120;
  const ey = pt.y - hoehe;
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 1 - aus}}>
        <circle cx={pt.x} cy={pt.y} r={9 * linie} fill="none" stroke={C.tinte} strokeWidth={3} />
        <line x1={pt.x} y1={pt.y - 10} x2={mix(pt.x, ex, linie)} y2={mix(pt.y - 10, ey, linie)} stroke={C.tinte} strokeWidth={3} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: seite === 'rechts' ? ex : undefined,
          right: seite === 'links' ? 1920 - ex : undefined,
          top: ey - 120,
          width: 520,
          padding: '26px 32px',
          background: 'rgba(248, 241, 226, 0.94)',
          borderLeft: seite === 'rechts' ? `6px solid ${C.rot}` : undefined,
          borderRight: seite === 'links' ? `6px solid ${C.rot}` : undefined,
          boxShadow: '0 12px 30px rgba(43,38,34,0.18)',
          opacity: box * (1 - aus),
          transform: `translateY(${(1 - box) * 16}px)`,
        }}
      >
        <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 56, color: C.tinte, lineHeight: 1}}>{titel}</div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 32, color: '#4A433C', marginTop: 12, lineHeight: 1.3}}>{text}</div>
      </div>
    </>
  );
};

const Kapitel: React.FC = () => {
  const {t, p} = useZeit();
  if (t < 10.4 || t > 14) return null;
  const ein = p(10.6, 0.5);
  const z2 = p(11.0, 0.5);
  const aus = p(13.2, 0.4, 'in');
  return (
    <div style={{position: 'absolute', left: 140, top: 110, opacity: 1 - aus}}>
      <Kicker o={ein}>Danach</Kicker>
      <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 78, lineHeight: 1.08, color: C.tinte, marginTop: 14}}>
        <div style={{opacity: ein, transform: `translateY(${(1 - ein) * 20}px)`}}>Wo Wege sich kreuzen,</div>
        <div style={{opacity: z2, transform: `translateY(${(1 - z2) * 20}px)`}}>
          entsteht ein <span style={{color: C.rot}}>Markt.</span>
        </div>
      </div>
    </div>
  );
};

const Schluss: React.FC = () => {
  const {t, p} = useZeit();
  if (t < 15.6) return null;
  const ein = p(15.8, 0.6);
  const z2 = p(16.5, 0.6);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center'}}>
      <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 92, color: C.tinte, opacity: ein, transform: `translateY(${(1 - ein) * 24}px)`}}>
        Aus einer Furt wird eine Stadt.
      </div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, color: '#4A433C', marginTop: 14, opacity: z2}}>
        Darum heißt Frankfurt so: „Furt der Franken“.
      </div>
    </div>
  );
};

/* ───────────── Papier & Körnung ───────────── */

const Papier: React.FC = () => {
  const {frame} = useZeit();
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <defs>
        <filter id="korn" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={Math.floor(frame / 2) % 12} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.17  0 0 0 0 0.15  0 0 0 0 0.13  0 0 0 0.55 0" />
        </filter>
        <filter id="faser" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves={3} seed={4} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0 0.2  0 0 0 0.5 -0.1" />
        </filter>
        <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
          <stop offset="55%" stopColor="#2B2622" stopOpacity={0} />
          <stop offset="100%" stopColor="#2B2622" stopOpacity={0.45} />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} filter="url(#faser)" opacity={0.25} style={{mixBlendMode: 'multiply'}} />
      <rect width={1920} height={1080} filter="url(#korn)" opacity={0.22} style={{mixBlendMode: 'multiply'}} />
      <rect width={1920} height={1080} fill="url(#vignette)" />
    </svg>
  );
};

/* ───────────── Video ───────────── */

const Video: React.FC = () => (
  <AbsoluteFill style={{background: C.himmelUnten}}>
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="himmel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DCCDAA" />
          <stop offset="70%" stopColor={C.himmelOben} />
          <stop offset="100%" stopColor={C.himmelUnten} />
        </linearGradient>
        <linearGradient id="boden" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B9B48A" />
          <stop offset="25%" stopColor={C.boden} />
          <stop offset="100%" stopColor={C.bodenNah} />
        </linearGradient>
        <linearGradient id="dunst" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.himmelUnten} stopOpacity={0.7} />
          <stop offset="100%" stopColor={C.himmelUnten} stopOpacity={0} />
        </linearGradient>
        <filter id="unscharf" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={10} />
        </filter>
      </defs>
      <Himmel />
      <Hauptebene />
      <Vordergrund />
    </svg>
    <Titel />
    <Hinweis start={6.5} ende={9.2} wx={FURT.x} wy={FURT.y - 6} titel="Die Furt" text="Hier ist der Fluss flach genug, um ihn zu durchqueren." />
    <Kapitel />
    <Schluss />
    <Papier />
    <Sfx name="whoosh" at={fr(4.5)} volume={0.3} />
    <Sfx name="tink" at={fr(6.8)} volume={0.35} />
    <Sfx name="pop" at={fr(9.9)} volume={0.3} />
    <Sfx name="swoosh" at={fr(13.5)} volume={0.3} />
    <Sfx name="reveal" at={fr(15.8)} volume={0.35} />
  </AbsoluteFill>
);

export const projekt: Project = {
  id: 'Doku-Probe',
  component: Video,
  format: 'landscape',
  durationInFrames: fr(DAUER),
};
