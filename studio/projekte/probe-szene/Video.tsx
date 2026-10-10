import React from 'react';
import {AbsoluteFill, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, EASE, mix, Music, pop, progress, Sfx, type SfxName} from '../../kit';
import type {Project} from '../types';
import {Figur, LOOKS} from './figuren';

/**
 * Probeszene „Geldeimer“ – reine Motion-Graphics-Probe im flachen Erklärvideo-Stil.
 * Eine durchgehende Welt mit Parallax-Ebenen, Kamera fährt und zoomt. Alles per Code gezeichnet.
 * Zahlen auf der Preistafel sind Beispielwerte.
 */

const FPS = 30;
const DAUER = 20.5;
const BODEN = 830;
const FONT = 'Inter, sans-serif';

const fr = (s: number) => Math.round(s * FPS);

const useZeit = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {
    frame,
    t: frame / FPS,
    p: (start: number, dauer = 0.4, ease: keyof typeof EASE = 'out') => progress(frame, fr(start), Math.max(1, fr(dauer)), ease),
    federn: (start: number, art: 'snappy' | 'smooth' | 'bouncy' = 'snappy') => pop(frame, fps, fr(start), art),
  };
};

/* ───────────── Kamera ───────────── */

const kamera = (t: number) => {
  const io = EASE.inOut;
  if (t < 5.4) return {x: 1000, z: mix(1.3, 1.36, clamp01(t / 5.4)), gy: 905};
  if (t < 7.6) {
    const q = io((t - 5.4) / 2.2);
    return {x: mix(1000, 2885, q), z: mix(1.36, 1.3, q), gy: 905};
  }
  if (t < 13.8) return {x: 2885, z: mix(1.3, 1.35, clamp01((t - 7.6) / 6.2)), gy: 905};
  if (t < 15.6) {
    const q = io((t - 13.8) / 1.8);
    return {x: mix(2885, 1900, q), z: mix(1.35, 0.6, q), gy: mix(905, 790, q)};
  }
  return {x: 1900, z: mix(0.6, 0.612, clamp01((t - 15.6) / 5)), gy: 790};
};

const Ebene: React.FC<{f: number; children: React.ReactNode}> = ({f, children}) => {
  const {t} = useZeit();
  const {x, z, gy} = kamera(t);
  return <g transform={`translate(960, ${gy}) scale(${z}) translate(${-x * f}, ${-BODEN})`}>{children}</g>;
};

/* ───────────── Landschaft ───────────── */

const Wolke: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill="#FFFFFF">
    <rect x={-90} y={-10} width={180} height={50} rx={25} />
    <circle cx={-30} cy={-6} r={40} />
    <circle cx={30} cy={-20} r={48} />
  </g>
);

const Baum: React.FC<{x: number; s?: number; farbe: string}> = ({x, s = 1, farbe}) => (
  <g transform={`translate(${x},${BODEN}) scale(${s})`}>
    <rect x={-9} y={-150} width={18} height={150} rx={8} fill="#B58863" />
    <circle cx={0} cy={-190} r={74} fill={farbe} />
    <circle cx={-22} cy={-212} r={26} fill="#FFFFFF" opacity={0.18} />
  </g>
);

const Busch: React.FC<{x: number; s?: number; farbe?: string}> = ({x, s = 1, farbe = '#7FCB8E'}) => (
  <g transform={`translate(${x},${BODEN + 6}) scale(${s})`} fill={farbe}>
    <circle cx={-46} cy={-26} r={36} />
    <circle cx={0} cy={-40} r={48} />
    <circle cx={46} cy={-26} r={36} />
    <rect x={-80} y={-30} width={160} height={30} rx={15} />
  </g>
);

const Landschaft: React.FC = () => {
  const {t} = useZeit();
  return (
    <>
      <defs>
        <linearGradient id="himmel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B9E6F7" />
          <stop offset="0.75" stopColor="#E6F7F1" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill="url(#himmel)" />
      <Ebene f={0.18}>
        {[
          [200, 150, 1],
          [900, 90, 0.8],
          [1500, 190, 1.1],
          [2300, 120, 0.9],
          [3000, 170, 1],
        ].map(([x, y, s], i) => (
          // Wolken ziehen gleichmäßig: Hintergrund-Drift, daher linear.
          <Wolke key={i} x={x + t * 10} y={y} s={s} />
        ))}
      </Ebene>
      <Ebene f={0.35}>
        <ellipse cx={600} cy={BODEN + 200} rx={1100} ry={420} fill="#CFEBD8" />
        <ellipse cx={2400} cy={BODEN + 230} rx={1300} ry={440} fill="#C6E7D0" />
        <ellipse cx={4200} cy={BODEN + 200} rx={1200} ry={420} fill="#CFEBD8" />
      </Ebene>
      <Ebene f={0.6}>
        <ellipse cx={-200} cy={BODEN + 160} rx={900} ry={300} fill="#B5E2C0" />
        <ellipse cx={1700} cy={BODEN + 190} rx={1100} ry={320} fill="#B9E4C4" />
        <ellipse cx={3800} cy={BODEN + 170} rx={1200} ry={310} fill="#B5E2C0" />
        {[300, 900, 2100, 2700, 3500].map((x, i) => (
          <Baum key={i} x={x} s={0.55} farbe={['#9FD8AE', '#F7B6C8', '#9FD8AE', '#8FD3D0', '#F7B6C8'][i]} />
        ))}
      </Ebene>
    </>
  );
};

/* ───────────── Requisiten ───────────── */

const Parlament: React.FC<{x: number}> = ({x}) => {
  const b = BODEN;
  return (
    <g transform={`translate(${x},0)`}>
      <rect x={-330} y={b - 30} width={660} height={30} fill="#E4DED2" />
      <rect x={-310} y={b - 54} width={620} height={26} fill="#ECE6DA" />
      <path d={`M-170,${b - 330} A170,150 0 0 1 170,${b - 330} Z`} fill="#BFE3F2" />
      {[-120, -60, 0, 60, 120].map((dx) => (
        <path key={dx} d={`M${dx},${b - 330} Q${dx * 0.6},${b - 440} 0,${b - 478}`} stroke="#9CCDE3" strokeWidth={5} fill="none" />
      ))}
      <path d={`M-150,${b - 380} L150,${b - 380}`} stroke="#9CCDE3" strokeWidth={5} />
      <rect x={-290} y={b - 330} width={580} height={276} fill="#F6F1E7" />
      <path d={`M-310,${b - 330} L0,${b - 410} L310,${b - 330} Z`} fill="#EDE5D6" />
      <rect x={-312} y={b - 342} width={624} height={20} fill="#E2D8C6" />
      {[-240, -150, -60, 30, 120, 210].map((cx) => (
        <g key={cx}>
          <rect x={cx} y={b - 316} width={34} height={262} fill="#FFFFFF" />
          <rect x={cx + 22} y={b - 316} width={12} height={262} fill="#E9E3D7" />
        </g>
      ))}
    </g>
  );
};

const Schild: React.FC<{x: number; y: number; text: string; farbe: string; at: number; pfeil?: boolean}> = ({x, y, text, farbe, at, pfeil}) => {
  const {federn} = useZeit();
  const q = federn(at, 'bouncy');
  const w = text.length * 22 + 60;
  return (
    <g transform={`translate(${x},${y}) scale(${Math.max(0, q)})`}>
      {pfeil ? <rect x={-8} y={0} width={16} height={BODEN - y} fill="#8C6A4F" /> : null}
      <path d={pfeil ? `M${-w / 2},-34 L${w / 2 - 10},-34 L${w / 2 + 24},0 L${w / 2 - 10},34 L${-w / 2},34 Z` : `M${-w / 2 + 20},-34 H${w / 2 - 20} Q${w / 2},-34 ${w / 2},-14 V14 Q${w / 2},34 ${w / 2 - 20},34 H${-w / 2 + 20} Q${-w / 2},34 ${-w / 2},14 V-14 Q${-w / 2},-34 ${-w / 2 + 20},-34 Z`} fill={farbe} />
      <text x={pfeil ? -6 : 0} y={13} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill="#FFFFFF">
        {text}
      </text>
    </g>
  );
};

const Muenze: React.FC<{x: number; y: number; dreh: number; s?: number}> = ({x, y, dreh, s = 1}) => {
  const sx = Math.max(0.15, Math.abs(Math.cos(dreh)));
  return (
    <g transform={`translate(${x},${y}) scale(${sx * s},${s})`}>
      <circle r={20} fill="#E9A800" />
      <circle r={16} fill="#FFC93C" />
      <circle r={10} fill="none" stroke="#E9A800" strokeWidth={3} />
      <circle cx={-6} cy={-7} r={4} fill="#FFFFFF" opacity={0.7} />
    </g>
  );
};

const EIMER = {x: 1370, oben: BODEN - 270, breiteO: 300, breiteU: 230};

const Eimer: React.FC<{fuell: number; loch: number}> = ({fuell, loch}) => {
  const {x, oben, breiteO, breiteU} = EIMER;
  const hO = breiteO / 2;
  const hU = breiteU / 2;
  const huegel = fuell * 70;
  return (
    <g transform={`translate(${x},0)`}>
      <path d={`M${-hO + 10},${oben} Q0,${oben - 200} ${hO - 10},${oben}`} stroke="#8D97A6" strokeWidth={10} fill="none" />
      <ellipse cx={0} cy={oben} rx={hO} ry={34} fill="#3B3F58" />
      {fuell > 0.02 ? (
        <g>
          <ellipse cx={0} cy={oben + 2} rx={hO - 14} ry={28} fill="#E9A800" />
          <path d={`M${-hO + 24},${oben + 2} Q0,${oben - huegel * 2} ${hO - 24},${oben + 2} Z`} fill="#FFC93C" />
          {Array.from({length: Math.round(fuell * 9)}, (_, i) => (
            <circle key={i} cx={-100 + i * 25} cy={oben - huegel * 0.55 * Math.sin(((i + 0.5) / 9) * Math.PI) - 4} r={9} fill="#FFE08A" opacity={0.9} />
          ))}
        </g>
      ) : null}
      <path d={`M${-hO},${oben} L${-hU},${BODEN} Q0,${BODEN + 22} ${hU},${BODEN} L${hO},${oben} Q0,${oben + 36} ${-hO},${oben} Z`} fill="#B9C3D0" />
      <path d={`M${-hO},${oben} L${-hU},${BODEN} Q${-hU + 40},${BODEN + 12} ${-hU + 70},${BODEN + 14} L${-hO + 70},${oben + 26} Q${-hO + 30},${oben + 18} ${-hO},${oben} Z`} fill="#D3DBE5" />
      <path d={`M${-hO + 6},${oben + 62} Q0,${oben + 98} ${hO - 6},${oben + 62}`} stroke="#A3AEBD" strokeWidth={6} fill="none" />
      <path d={`M${-hU + 6},${BODEN - 50} Q0,${BODEN - 20} ${hU - 6},${BODEN - 50}`} stroke="#A3AEBD" strokeWidth={6} fill="none" />
      <text x={0} y={oben + 175} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill="#A3AEBD">
        €
      </text>
      {loch > 0 ? (
        <g opacity={loch}>
          <ellipse cx={92} cy={BODEN - 70} rx={22 * loch} ry={15 * loch} fill="#2C2F45" />
          <path d={`M92,${BODEN - 70} l26,-18 m-26,18 l30,10 m-30,-10 l-10,-24`} stroke="#5E6678" strokeWidth={4} strokeLinecap="round" />
        </g>
      ) : null}
    </g>
  );
};

const Zapfsaeule: React.FC<{x: number; farbe: string; label: string}> = ({x, farbe, label}) => (
  <g transform={`translate(${x},0)`}>
    <rect x={-50} y={BODEN - 210} width={100} height={210} rx={18} fill={farbe} />
    <rect x={-34} y={BODEN - 190} width={68} height={52} rx={8} fill="#1F2A44" />
    <rect x={-24} y={BODEN - 180} width={48} height={10} rx={4} fill="#5EEAD4" />
    <rect x={-24} y={BODEN - 162} width={30} height={10} rx={4} fill="#5EEAD4" opacity={0.6} />
    <rect x={-40} y={BODEN - 110} width={80} height={36} rx={10} fill="#FFFFFF" />
    <text x={0} y={BODEN - 84} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={farbe}>
      {label}
    </text>
    <path d={`M50,${BODEN - 150} Q90,${BODEN - 120} 74,${BODEN - 40}`} stroke="#2B2B2B" strokeWidth={8} fill="none" strokeLinecap="round" />
    <rect x={62} y={BODEN - 52} width={22} height={36} rx={6} fill="#2B2B2B" />
  </g>
);

const Dach: React.FC<{x0: number; x1: number}> = ({x0, x1}) => (
  <g>
    <rect x={x0 + 30} y={BODEN - 400} width={24} height={400} fill="#E3E7EE" />
    <rect x={x1 - 54} y={BODEN - 400} width={24} height={400} fill="#E3E7EE" />
    <rect x={x0} y={BODEN - 440} width={x1 - x0} height={60} rx={12} fill="#FFFFFF" />
    <rect x={x0} y={BODEN - 412} width={x1 - x0} height={18} fill="#FF6B6B" />
  </g>
);

/** Rollende Ziffer: alte Ziffer gleitet nach oben weg, neue kommt von unten. */
const Ziffer: React.FC<{x: number; y: number; alt: string; neu: string; q: number; id: string}> = ({x, y, alt, neu, q, id}) => (
  <g>
    <clipPath id={id}>
      <rect x={x - 34} y={y - 92} width={68} height={110} />
    </clipPath>
    <g clipPath={`url(#${id})`}>
      <text x={x} y={y - q * 110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={100} fill="#1F2A44">
        {alt}
      </text>
      <text x={x} y={y + 110 - q * 110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={100} fill="#16A34A">
        {neu}
      </text>
    </g>
  </g>
);

const PREIS_X = 3240;

const Preistafel: React.FC = () => {
  const {p} = useZeit();
  const ty = BODEN - 500;
  const q1 = p(10.4, 0.45, 'inOut');
  const q2 = p(10.75, 0.45, 'inOut');
  const glow = p(11.6, 0.3);
  return (
    <g>
      <rect x={PREIS_X - 12} y={ty + 220} width={24} height={BODEN - ty - 220} fill="#8D97A6" />
      <rect x={PREIS_X - 150} y={ty} width={300} height={240} rx={26} fill="#1F2A44" />
      <rect x={PREIS_X - 136} y={ty + 14} width={272} height={60} rx={16} fill="#FF6B6B" />
      <text x={PREIS_X} y={ty + 58} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill="#FFFFFF">
        Benzin
      </text>
      <rect x={PREIS_X - 136} y={ty + 86} width={272} height={140} rx={16} fill={glow > 0 ? `rgba(220,252,231,${0.4 + glow * 0.6})` : '#FFFFFF'} />
      <text x={PREIS_X - 100} y={ty + 196} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={100} fill={glow > 0.5 ? '#16A34A' : '#1F2A44'}>
        1
      </text>
      <text x={PREIS_X - 66} y={ty + 196} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={100} fill={glow > 0.5 ? '#16A34A' : '#1F2A44'}>
        ,
      </text>
      <Ziffer x={PREIS_X - 18} y={ty + 196} alt="7" neu="6" q={q1} id="z1" />
      <Ziffer x={PREIS_X + 46} y={ty + 196} alt="9" neu="2" q={q2} id="z2" />
      <text x={PREIS_X + 104} y={ty + 150} fontFamily={FONT} fontWeight={800} fontSize={36} fill="#1F2A44">
        €
      </text>
      <text x={PREIS_X} y={ty + 270} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={28} fill="#5B6270">
        Beispielwerte
      </text>
    </g>
  );
};

const AUTO_STOP = 2770;

const Auto: React.FC = () => {
  const {t, frame} = useZeit();
  const {fps} = useVideoConfig();
  const q = clamp01((t - 7.4) / 1.8);
  const cx = mix(4100, AUTO_STOP, EASE.out(q));
  const steht = t >= 9.2;
  const bremsen = steht ? 1 - spring({frame: frame - fr(9.2), fps, config: {damping: 8, stiffness: 160, mass: 0.6}}) : 0;
  const neig = steht ? bremsen * 5 : 0;
  // Rad dreht sich passend zum Weg
  const rad = ((4100 - cx) / 48) * (180 / Math.PI);
  const wy = BODEN + 4;
  return (
    <g transform={`translate(${cx},0)`}>
      <ellipse cx={0} cy={BODEN + 10} rx={170} ry={14} fill="rgba(30,60,40,0.16)" />
      <g transform={`rotate(${-neig}, -80, ${wy})`}>
        <path d={`M-170,${wy - 40} Q-172,${wy - 100} -120,${wy - 108} L-70,${wy - 170} Q-50,${wy - 190} 20,${wy - 190} L70,${wy - 190} Q110,${wy - 188} 130,${wy - 120} L165,${wy - 110} Q180,${wy - 104} 178,${wy - 60} L176,${wy - 36} Q172,${wy - 22} 150,${wy - 22} L-150,${wy - 22} Q-170,${wy - 24} -170,${wy - 40} Z`} fill="#FF7A59" />
        <path d={`M-90,${wy - 112} L-54,${wy - 166} Q-46,${wy - 174} -30,${wy - 174} L0,${wy - 174} L0,${wy - 112} Z`} fill="#CDEBFF" />
        <path d={`M14,${wy - 112} L14,${wy - 174} L66,${wy - 174} Q92,${wy - 172} 108,${wy - 112} Z`} fill="#CDEBFF" />
        <rect x={150} y={wy - 98} width={24} height={18} rx={6} fill="#FFE08A" />
        <rect x={-172} y={wy - 92} width={14} height={18} rx={5} fill="#FF4D4D" />
        <rect x={-10} y={wy - 92} width={30} height={8} rx={4} fill="rgba(0,0,0,0.25)" />
      </g>
      {[-100, 100].map((dx) => (
        <g key={dx} transform={`translate(${dx},${wy - 22}) rotate(${rad})`}>
          <circle r={36} fill="#2B2B2B" />
          <circle r={16} fill="#C9CED6" />
          <rect x={-3} y={-16} width={6} height={32} fill="#8D97A6" />
        </g>
      ))}
      {steht && t < 10.2
        ? [0, 1, 2, 3].map((i) => {
            const s = clamp01((t - 9.2) / 0.9);
            return <circle key={i} cx={-150 - s * (40 + i * 30)} cy={BODEN - 10 - i * 8 - s * 20} r={14 + s * 22} fill="#E6E2D8" opacity={(1 - s) * 0.9} />;
          })
        : null}
    </g>
  );
};

/* ───────────── Münzströme ───────────── */

const REIN = Array.from({length: 18}, (_, i) => ({at: 0.3 + i * 0.26 + random(`m-${i}`) * 0.08, y0: 360 + random(`my-${i}`) * 160, dx: (random(`mx-${i}`) - 0.5) * 120}));
const LANDUNG = (i: number) => REIN[i].at + 0.95;

const MuenzenRein: React.FC = () => {
  const {t} = useZeit();
  return (
    <>
      {REIN.map((m, i) => {
        const q = (t - m.at) / 0.95;
        if (q < 0 || q > 1) return null;
        const x = mix(-120, EIMER.x + m.dx, q);
        const y = mix(m.y0, EIMER.oben - 10, q) - Math.sin(q * Math.PI) * 260;
        return <Muenze key={i} x={x} y={y} dreh={t * 9 + i} s={1.3} />;
      })}
    </>
  );
};

const RAUS = Array.from({length: 22}, (_, i) => ({at: 14.6 + i * 0.17, speed: 520 + random(`r-${i}`) * 160}));

const MuenzenRaus: React.FC = () => {
  const {t} = useZeit();
  return (
    <>
      {RAUS.map((m, i) => {
        const d = t - m.at;
        if (d < 0) return null;
        const startX = EIMER.x + 92;
        const x = Math.min(2470 + (i % 5) * 30, startX + d * m.speed);
        const angekommen = x >= 2470 + (i % 5) * 30;
        const fall = Math.min(1, d / 0.35);
        const y = angekommen ? BODEN - 18 - (i % 3) * 14 : mix(BODEN - 70, BODEN - 18, fall) - Math.abs(Math.sin(d * 9)) * 26 * (1 - Math.min(1, d / 1.5));
        return <Muenze key={i} x={x} y={y} dreh={angekommen ? 0 : d * 14} s={1.6} />;
      })}
    </>
  );
};

/* ───────────── Figuren-Regie ───────────── */

const Politiker: React.FC = () => {
  const {t, frame} = useZeit();
  const laufStart = 9.6;
  const laufEnde = 12.0;
  const lq = clamp01((t - laufStart) / (laufEnde - laufStart));
  const x = mix(1600, 2960, lq);
  const geht = t >= laufStart && t < laufEnde;
  let armL = 38;
  let armR = 38;
  let ellL = 105;
  let ellR = 105;
  let ausdruck: 'stolz' | 'neutral' | 'sorge' | 'staunen' = 'stolz';
  let richtung: 1 | -1 = 1;
  let blick: [number, number] = [0.6, 0];
  let schweiss = 0;
  if (t >= laufStart - 0.3) {
    armL = 8;
    armR = 8;
    ellL = 10;
    ellR = 10;
    ausdruck = 'neutral';
  }
  if (t >= 12.1 && t < 14.4) {
    armR = mix(8, 100, clamp01((t - 12.1) / 0.3));
    ellR = 0;
    ausdruck = 'stolz';
    blick = [1, -0.4];
  }
  if (t >= 14.4) {
    richtung = -1;
    blick = [-1, 0];
    ausdruck = t < 14.9 ? 'staunen' : 'sorge';
    if (t >= 15.0) {
      const h = clamp01((t - 15.0) / 0.35);
      armL = mix(8, 150, h);
      armR = mix(8, 150, h);
      ellL = mix(10, 60, h);
      ellR = mix(10, 60, h);
      schweiss = clamp01((t - 15.2) / 0.6);
    }
  }
  return (
    <Figur
      look={LOOKS.politiker}
      x={x}
      y={BODEN}
      k={0.92}
      frame={frame}
      seed="pol"
      ausdruck={ausdruck}
      blick={blick}
      armL={armL}
      armR={armR}
      ellL={ellL}
      ellR={ellR}
      gehen={geht ? t * 14 : undefined}
      richtung={richtung}
      neigung={t >= 15.0 ? Math.sin(t * 4) * 3 : 0}
      schweiss={schweiss}
    />
  );
};

const Frau: React.FC = () => {
  const {t, frame} = useZeit();
  if (t < 9.35) return null;
  const aus = clamp01((t - 9.35) / 0.7);
  const x = mix(2690, 2545, EASE.out(aus));
  const laeuft = t < 10.05;
  const jubel = t >= 11.8 && t < 13.4;
  const hop = jubel ? Math.abs(Math.sin((t - 11.8) * 7)) * 50 * (1 - (t - 11.8) / 1.6) : 0;
  return (
    <g opacity={clamp01((t - 9.35) / 0.15)}>
      <Figur
        look={LOOKS.frau}
        x={x}
        y={BODEN - hop}
        k={0.86}
        frame={frame}
        seed="frau"
        ausdruck={t >= 11.7 ? (jubel ? 'lachen' : 'froh') : 'neutral'}
        blick={laeuft ? [-1, 0] : t < 14.4 ? [1, -0.5] : [-1, 0.3]}
        armL={jubel ? 160 : 8}
        armR={jubel ? 160 : 8}
        ellL={jubel ? 20 : 8}
        ellR={jubel ? 20 : 8}
        gehen={laeuft ? t * 14 : undefined}
        richtung={laeuft ? -1 : t < 14.4 ? 1 : -1}
      />
    </g>
  );
};

/* ───────────── Titel ───────────── */

const Titel: React.FC = () => {
  const {t, federn} = useZeit();
  if (t < 17.3) return null;
  const q = federn(17.4, 'bouncy');
  const wackel = Math.sin(t * 6) * 6;
  return (
    <g transform={`translate(960, 180) scale(${Math.max(0, q)})`}>
      <text x={-40} y={40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={130} fill="#FFFFFF" stroke="#2F2A5A" strokeWidth={22} paintOrder="stroke" letterSpacing={-4}>
        Wer bezahlt das
      </text>
      <text x={500} y={44} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={160} fill="#FFC93C" stroke="#2F2A5A" strokeWidth={22} paintOrder="stroke" transform={`rotate(${wackel}, 500, 0)`}>
        ?
      </text>
    </g>
  );
};

/* ───────────── Töne ───────────── */

const TOENE: [number, SfxName, number][] = [
  [0.5, 'kPop', 0.4],
  [1.2, 'kPop', 0.4],
  ...REIN.map((_, i) => [LANDUNG(i), 'kMuenze', i % 2 ? 0.25 : 0.35] as [number, SfxName, number]),
  [5.4, 'kWhoosh', 0.45],
  [7.4, 'kWhoosh', 0.35],
  [9.2, 'kLanden', 0.6],
  [9.5, 'kPop', 0.35],
  ...Array.from({length: 10}, (_, i) => [9.7 + i * 0.224, 'kTipp', 0.14] as [number, SfxName, number]),
  [10.4, 'kTick2', 0.4],
  [10.75, 'kTick4', 0.4],
  [11.6, 'kPop', 0.45],
  [11.8, 'kErfolg', 0.45],
  [12.1, 'kTipp', 0.3],
  [13.8, 'kWhoosh', 0.45],
  [14.4, 'kFalsch', 0.45],
  ...[14.7, 15.3, 15.9, 16.5, 17.1, 17.7].map((at) => [at, 'kMuenzen', 0.3] as [number, SfxName, number]),
  [16.6, 'kAnstieg', 0.3],
  [17.4, 'kPop', 0.5],
];

/* ───────────── Video ───────────── */

const Szene: React.FC = () => {
  const {t, p} = useZeit();
  const fuell = clamp01(REIN.filter((_, i) => t >= LANDUNG(i)).length / REIN.length) * (1 - 0.75 * p(14.6, 3.6, 'inOut'));
  const loch = p(14.4, 0.3);
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Landschaft />
        <Ebene f={1}>
          <rect x={-2000} y={BODEN} width={9000} height={800} fill="#A5DCAE" />
          <path d={`M-2000,${BODEN} H7000`} stroke="#93D19D" strokeWidth={6} />
          <rect x={2250} y={BODEN + 18} width={2400} height={70} rx={20} fill="#DADDE3" />
          {Array.from({length: 12}, (_, i) => (
            <rect key={i} x={2300 + i * 200} y={BODEN + 48} width={90} height={10} rx={5} fill="#FFFFFF" opacity={0.8} />
          ))}
          <Baum x={140} farbe="#8ED1A0" />
          <Baum x={1900} s={0.9} farbe="#F7B6C8" />
          <Baum x={3650} farbe="#8FD3D0" />
          <Parlament x={870} />
          <Busch x={560} s={0.9} />
          <Busch x={1215} s={0.75} farbe="#8AD39A" />
          <Schild x={420} y={BODEN - 230} text="Steuern" farbe="#7B61FF" at={0.5} pfeil />
          <Dach x0={2380} x1={3060} />
          <Zapfsaeule x={2620} farbe="#FF6B6B" label="Benzin" />
          <Zapfsaeule x={2920} farbe="#3D8BFF" label="Diesel" />
          <Preistafel />
          <Eimer fuell={fuell} loch={loch} />
          <Schild x={EIMER.x} y={EIMER.oben - 250} text="Staatskasse" farbe="#2F2A5A" at={1.2} />
          <Frau />
          <Auto />
          <MuenzenRaus />
          <Politiker />
          <MuenzenRein />
          <Schild x={PREIS_X} y={BODEN - 585} text="Sprit-Rabatt" farbe="#16A34A" at={11.6} />
        </Ebene>
        <Ebene f={1.25}>
          <Busch x={400} s={1.3} farbe="#6FC283" />
          <Busch x={4300} s={1.2} farbe="#6FC283" />
        </Ebene>
        <Titel />
      </svg>
      {TOENE.map(([at, name, vol], i) => (
        <Sfx key={i} name={name} at={fr(at)} volume={vol} />
      ))}
      <Music src="projekte/probe-szene/musik.wav" loop={false} volume={0.55} />
    </AbsoluteFill>
  );
};

export const projekt: Project = {
  id: 'Probe-Szene',
  component: Szene,
  format: 'landscape',
  durationInFrames: Math.round(DAUER * FPS),
  ordner: 'Tests',
};
