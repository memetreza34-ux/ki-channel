import React from 'react';
import {AbsoluteFill, Audio, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, Confetti, EASE, Icon, mix, Music, pop, progress, Sfx, type SfxName} from '../../kit';
import type {Project} from '../types';
import zeiten from './absaetze.json';
import untertitel from './untertitel.json';

/**
 * Kinderkanal-Probe: „Zählen mit Pip“ (1 bis 5) für 2–4 Jahre.
 * Langsam, groß, wiederholend. Pip spricht selbst (Schnabel bewegt sich während jeder Zeile).
 * Alle Einsätze kommen aus absaetze.json (eine Zeile je Satz, siehe zeilen.json).
 */

const FPS = 30;
const ENDE = zeiten[zeiten.length - 1].ende + 3.0;
const BODEN = 880;
const FONT = 'Nunito, sans-serif';

const Z = (nr: number) => zeiten[nr - 1];
const fr = (sec: number) => Math.round(sec * FPS);

const useZeit = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {
    frame,
    t: frame / FPS,
    p: (start: number, dauer = 0.4, ease: keyof typeof EASE = 'out') => progress(frame, fr(start), Math.max(1, fr(dauer)), ease),
    federn: (start: number, art: 'snappy' | 'smooth' | 'bouncy' = 'bouncy') => pop(frame, fps, fr(start), art),
  };
};

const ZAHLEN = [
  {zahl: 1, wort: 'eins', ding: 'fluent-emoji-flat:red-apple', farbe: '#FF5D5D', zeile: 2},
  {zahl: 2, wort: 'zwei', ding: 'fluent-emoji-flat:soccer-ball', farbe: '#3D8BFF', zeile: 3},
  {zahl: 3, wort: 'drei', ding: 'fluent-emoji-flat:glowing-star', farbe: '#FFA800', zeile: 4},
  {zahl: 4, wort: 'vier', ding: 'fluent-emoji-flat:tropical-fish', farbe: '#14B8A6', zeile: 5},
  {zahl: 5, wort: 'fünf', ding: 'fluent-emoji-flat:sunflower', farbe: '#A86BFF', zeile: 6},
];

/* ───────────── Pip ───────────── */

type PipProps = {x: number; y: number; k?: number; look?: [number, number]; mund?: number; froh?: boolean; fluegelL?: number; fluegelR?: number; sx?: number; sy?: number};

const Pip: React.FC<PipProps> = ({x, y, k = 1, look = [0.5, 0], mund = 0, froh = false, fluegelL = 10, fluegelR = 10, sx = 1, sy = 1}) => {
  const {frame} = useZeit();
  // Atmen + natürliches Blinzeln (deterministisch)
  const atem = Math.sin(frame / 14);
  const zyklus = 100;
  const i = Math.floor(frame / zyklus);
  const blinkAt = i * zyklus + 20 + random(`pip-${i}`) * 60;
  const blink = Math.max(0, 1 - Math.abs(frame - blinkAt) / 3);
  const auge = (cx: number) =>
    froh ? (
      <path d={`M${cx - 22},148 Q${cx},120 ${cx + 22},148`} stroke="#2B2118" strokeWidth={9} fill="none" strokeLinecap="round" />
    ) : (
      <g>
        <ellipse cx={cx} cy={140} rx={27} ry={31 * Math.max(0.1, 1 - blink)} fill="#FFFFFF" />
        {blink < 0.6 ? <circle cx={cx + look[0] * 9} cy={142 + look[1] * 10} r={16} fill="#2B2118" /> : null}
        {blink < 0.6 ? <circle cx={cx + look[0] * 9 + 6} cy={136 + look[1] * 10} r={6} fill="#FFFFFF" /> : null}
      </g>
    );
  const o = mund * 16;
  const fluegel = (seite: 1 | -1, winkel: number) => (
    <g transform={`translate(${seite < 0 ? 58 : 242},175) rotate(${seite < 0 ? winkel : -winkel})`}>
      <ellipse cx={0} cy={32} rx={24} ry={42} fill="#FFC21A" />
    </g>
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 150,
        top: y - 285,
        width: 300,
        height: 300,
        transform: `scale(${sx * k * (1 - atem * 0.012)}, ${sy * k * (1 + atem * 0.02)})`,
        transformOrigin: '50% 95%',
      }}
    >
      <svg width={300} height={300} style={{overflow: 'visible'}}>
        <ellipse cx={150} cy={284} rx={90} ry={12} fill="rgba(40,80,40,0.15)" />
        <ellipse cx={125} cy={276} rx={22} ry={10} fill="#FF8C1A" />
        <ellipse cx={175} cy={276} rx={22} ry={10} fill="#FF8C1A" />
        {fluegel(-1, fluegelL)}
        {fluegel(1, fluegelR)}
        <circle cx={150} cy={168} r={108} fill="#FFD43B" />
        <ellipse cx={150} cy={205} rx={66} ry={56} fill="#FFE98F" />
        <path d="M150,62 q-6,-30 -24,-34 M150,62 q2,-34 16,-40 M150,62 q10,-24 30,-22" stroke="#F4B400" strokeWidth={9} fill="none" strokeLinecap="round" />
        <ellipse cx={86} cy={182} rx={18} ry={11} fill="#FF8FA3" opacity={0.6} />
        <ellipse cx={214} cy={182} rx={18} ry={11} fill="#FF8FA3" opacity={0.6} />
        {auge(116)}
        {auge(184)}
        {o > 1 ? <ellipse cx={150} cy={182 + o / 2} rx={11} ry={o / 2 + 2} fill="#7A2E0E" /> : null}
        <path d={`M132,174 L168,174 L150,190 Z`} fill="#FF8C1A" />
        <path d={`M136,${180 + o} L164,${180 + o} L150,${194 + o} Z`} fill="#E8710A" />
      </svg>
    </div>
  );
};

/* ───────────── Welt ───────────── */

const Himmel: React.FC = () => {
  const {t} = useZeit();
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #A9DEFF 0%, #DDF3FF 65%, #F2FBFF 100%)'}}>
      <div style={{position: 'absolute', right: 120, top: 60, transform: `rotate(${Math.sin(t * 0.8) * 6}deg)`}}>
        <Icon icon="fluent-emoji-flat:sun-with-face" size={230} animate="none" />
      </div>
      {[
        {x: 180, y: 110, s: 200, v: 9},
        {x: 820, y: 60, s: 150, v: 6},
        {x: 1180, y: 170, s: 120, v: 11},
      ].map((w, i) => (
        // Gleichmäßiges Ziehen der Wolken: Hintergrund-Drift, daher linear.
        <div key={i} style={{position: 'absolute', left: ((w.x + t * w.v) % 2100) - 150, top: w.y, opacity: 0.95}}>
          <Icon icon="fluent-emoji-flat:cloud" size={w.s} animate="none" />
        </div>
      ))}
      <div style={{position: 'absolute', left: 700, top: 760, width: 1800, height: 700, borderRadius: '50%', background: '#8FDB8A'}} />
      <div style={{position: 'absolute', left: -500, top: 790, width: 1700, height: 700, borderRadius: '50%', background: '#A8E6A3'}} />
      {[
        {x: 120, y: 905},
        {x: 640, y: 940},
        {x: 1500, y: 905},
        {x: 1820, y: 960},
      ].map((b, i) => (
        <div key={i} style={{position: 'absolute', left: b.x, top: b.y}}>
          <Icon icon="fluent-emoji-flat:blossom" size={64} animate="none" />
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* ───────────── Zählen ───────────── */

const GROSS = {x: 1100, y: 330};
const REIHE_Y = 640;

const ZahlBild: React.FC<{z: (typeof ZAHLEN)[number]; bis: number}> = ({z, bis}) => {
  const {t, federn, p} = useZeit();
  const start = Z(z.zeile).start;
  const q = federn(start - 0.05);
  const weg = p(bis - 0.35, 0.3, 'in');
  if (t < start - 0.1 || t > bis) return null;
  return (
    <>
      <div style={{position: 'absolute', left: GROSS.x, top: GROSS.y, transform: `translate(-50%, -50%) scale(${Math.max(0, q) * (1 - weg)}) rotate(${(1 - clamp01(q)) * -12}deg)`, textAlign: 'center'}}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 300,
            lineHeight: 1,
            color: z.farbe,
            WebkitTextStroke: '16px #FFFFFF',
            paintOrder: 'stroke fill',
            textShadow: '0 12px 0 rgba(0,0,0,0.08)',
          }}
        >
          {z.zahl}
        </div>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 72, color: z.farbe, marginTop: -6}}>{z.wort}</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: REIHE_Y, display: 'flex', justifyContent: 'center', paddingLeft: 280, gap: 30}}>
        {Array.from({length: z.zahl}, (_, j) => {
          const at = Z(z.zeile).ende + 0.05 + j * 0.42;
          const d = federn(at);
          return (
            <div key={j} style={{transform: `translateY(${(1 - clamp01(d)) * -380}px) scale(${Math.max(0, mix(0.4, 1, d)) * (1 - weg)})`, opacity: t >= at ? 1 : 0}}>
              <Icon icon={z.ding} size={170} animate="none" />
            </div>
          );
        })}
      </div>
    </>
  );
};

const ALLE_START = Z(7).start;
const REIHE_X = [760, 1000, 1240, 1480, 1720];

const AlleZusammen: React.FC = () => {
  const {t, federn, p} = useZeit();
  if (t < ALLE_START + 0.2) return null;
  const runter = p(Z(13).start - 0.1, 0.5, 'inOut');
  return (
    <>
      {ZAHLEN.map((z, i) => {
        const auf = federn(ALLE_START + 0.3 + i * 0.12, 'snappy');
        const sag = Z(8 + i).start;
        const hupf = t >= sag ? Math.sin(clamp01((t - sag) / 0.45) * Math.PI) : 0;
        const aktiv = t >= sag;
        return (
          <div key={z.zahl} style={{position: 'absolute', left: REIHE_X[i], top: mix(470, 660, runter), transform: `translate(-50%, -50%) translateY(${-hupf * 60}px) scale(${Math.max(0, auf) * (1 + hupf * 0.3)})`, textAlign: 'center'}}>
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 170, lineHeight: 1, color: aktiv ? z.farbe : '#B9C7D4', WebkitTextStroke: '12px #FFFFFF', paintOrder: 'stroke fill'}}>{z.zahl}</div>
            <div style={{marginTop: 10, opacity: aktiv ? 1 : 0.35}}>
              <Icon icon={z.ding} size={96} animate="none" />
            </div>
          </div>
        );
      })}
    </>
  );
};

const Super: React.FC = () => {
  const {federn, t} = useZeit();
  const start = Z(13).start;
  if (t < start) return null;
  const q = federn(start);
  return (
    <div style={{position: 'absolute', left: GROSS.x, top: 300, transform: `translate(-50%, -50%) scale(${Math.max(0, q)}) rotate(${Math.sin(t * 3) * 3}deg)`, display: 'flex', alignItems: 'center', gap: 20}}>
      <Icon icon="fluent-emoji-flat:glowing-star" size={140} animate="none" />
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 200, color: '#FF7A59', WebkitTextStroke: '16px #FFFFFF', paintOrder: 'stroke fill', textShadow: '0 12px 0 rgba(0,0,0,0.08)'}}>Super!</div>
      <Icon icon="fluent-emoji-flat:glowing-star" size={140} animate="none" />
    </div>
  );
};

/* ───────────── Pip-Regie ───────────── */

const PipRegie: React.FC = () => {
  const {t, frame} = useZeit();
  const {fps} = useVideoConfig();
  // Auftritt: von links hineinhüpfen
  const rein = clamp01(t / 0.9);
  let x = mix(-200, 330, EASE.out(rein));
  let y = BODEN - Math.abs(Math.sin(rein * Math.PI * 2)) * 90;
  // Spricht gerade? → Schnabel auf/zu
  const zeile = zeiten.find((z) => t >= z.start && t <= z.ende);
  const mund = zeile ? 0.35 + 0.65 * Math.abs(Math.sin(t * 13)) : 0;
  // Freudenhüpfer bei jeder Zahl
  const hupfStarts = [...ZAHLEN.map((z) => Z(z.zeile).start), ...[8, 9, 10, 11, 12].map((n) => Z(n).start), Z(13).start];
  const letzter = [...hupfStarts].reverse().find((s) => t >= s);
  if (letzter !== undefined && t - letzter < 0.5 && t > 1) y -= Math.sin(((t - letzter) / 0.5) * Math.PI) * 45;
  const land = letzter !== undefined && t - letzter >= 0.5 && t - letzter < 1.0 ? 1 - spring({frame: frame - fr(letzter + 0.5), fps, config: {damping: 9, stiffness: 200, mass: 0.5}}) : 0;

  // Flügel: winken bei „Hallo“ und „Tschüss“, jubeln bei „zusammen“ und „Super“
  const winken = 120 + Math.sin(t * 10) * 25;
  let fl = 12;
  let fr2 = 12;
  let froh = false;
  let look: [number, number] = [0.8, -0.1];
  if (t >= Z(1).start && t < Z(1).start + 1.0) fr2 = winken;
  if (t >= Z(1).start + 2.0 && t < Z(1).ende + 0.5) {
    fl = 70;
    fr2 = 70;
  }
  if (t >= Z(7).start && t < Z(7).ende) {
    fl = 140;
    fr2 = 140;
    froh = true;
  }
  if (t >= Z(13).start) {
    froh = t < Z(13).start + 1.4;
    fl = froh ? 150 : 12;
    fr2 = froh ? 150 : winken;
    look = [0.2, 0];
  }
  if (t < 1) look = [1, 0];
  return <Pip x={x} y={y} k={1.45} look={look} mund={mund} froh={froh} fluegelL={fl} fluegelR={fr2} sx={1 + land * 0.12} sy={1 - land * 0.15} />;
};

/* ───────────── Töne ───────────── */

const TICKS: SfxName[] = ['kTick1', 'kTick2', 'kTick3', 'kTick4', 'kTick5'];
const TOENE: [number, SfxName, number][] = [
  [0.05, 'kSprung', 0.4],
  [0.85, 'kLanden', 0.45],
  ...ZAHLEN.map((z) => [Z(z.zeile).start - 0.05, 'kPop', 0.45] as [number, SfxName, number]),
  ...ZAHLEN.flatMap((z) => Array.from({length: z.zahl}, (_, j) => [Z(z.zeile).ende + 0.05 + j * 0.42, TICKS[j], 0.5] as [number, SfxName, number])),
  ...[8, 9, 10, 11, 12].map((n, i) => [Z(n).start, TICKS[i], 0.45] as [number, SfxName, number]),
  [Z(13).start, 'kErfolg', 0.5],
];

/* ───────────── Video ───────────── */

const Video: React.FC = () => (
  <AbsoluteFill>
    <Himmel />
    {ZAHLEN.map((z, i) => (
      <ZahlBild key={z.zahl} z={z} bis={i < ZAHLEN.length - 1 ? Z(ZAHLEN[i + 1].zeile).start : ALLE_START} />
    ))}
    <AlleZusammen />
    <Super />
    <PipRegie />
    <Confetti at={fr(Z(13).start)} x={GROSS.x} y={300} count={90} seed="pip" />
    {TOENE.map(([at, name, vol], i) => (
      <Sfx key={i} name={name} at={fr(at)} volume={vol} />
    ))}
    <Audio src={staticFile('projekte/kinder-zaehlen/voiceover.wav')} />
    <Music src="projekte/kinder-zaehlen/musik.wav" loop={false} volume={0.5} duckTo={0.45} captions={untertitel} />
  </AbsoluteFill>
);

export const projekt: Project = {
  id: 'Kinder-Zaehlen',
  component: Video,
  format: 'landscape',
  durationInFrames: Math.round(ENDE * FPS),
  ordner: 'Kinderkanal',
};
