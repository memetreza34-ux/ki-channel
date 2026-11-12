import React from 'react';
import type {Caption} from '@remotion/captions';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Vector3} from 'three';
import {Music} from '../../kit/Music';
import {Sfx} from '../../kit/Stage';
import type {SfxName} from '../../kit/Stage';
import type {Project} from '../types';
import {AKZENT, HELL, clamp, outQuint, zahl} from './bausteine';
import {HandyMittel, M, MittelBuehne, SatellitMittel, Schild, Signal, UhrMittel, projiziereIso} from './mittel';
import type {IsoKamera} from './mittel';
import {Mass, TitelStart, UntertitelWort} from './stil';
import untertitelJson from '../gps-mittel/untertitel.json';

/**
 * GPS im „Mittelding“-Stil (2026-11-11): eine durchgehende isometrische Bühne, das Handy bleibt Held.
 * Jedes Ereignis hängt an einem Wort der Tonspur (`bei('wort')`), damit Bild und Stimme zusammenpassen.
 * Stimme: Klon von Arman (Hörfreigabe nötig). Fakten: projekte/gps-handy/skript.md.
 */

const WZ = untertitelJson as Caption[];
const FPS = 30;
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, '');
const WOERTER = WZ.map((c) => ({w: norm(c.text), f: Math.round((c.startMs / 1000) * FPS)}));
/** Frame, an dem das n-te Wort beginnt, das mit `wort` anfängt. */
const bei = (wort: string, n = 1) => {
  let k = 0;
  for (const x of WOERTER)
    if (x.w.startsWith(wort)) {
      k++;
      if (k === n) return x.f;
    }
  return 0;
};
const ENDE = Math.round((WZ[WZ.length - 1].endMs / 1000) * FPS) + 45;

/* ───────────── Ereignisse (an Wörtern) ───────────── */

const T = {
  pin: 4,
  titelBis: bei('genau') + 12,
  pfeil: bei('ohne'),
  kreuz: bei('einziges'),
  kreisen: bei('kreisen'),
  dreissig: bei('dreißig') || bei('30'),
  hoehe: bei('kilometern'),
  funken: bei('funken'),
  hier: bei('hier'),
  spaet: bei('spät'),
  atom: bei('atomuhren'),
  trick: bei('trick'),
  signal: bei('signal', 2),
  dir: bei('dir', 2),
  misst: bei('misst'),
  abstand: bei('abstand'),
  kugel: bei('kugel'),
  drei: bei('drei'),
  punkt: bei('punkt'),
  vierter: bei('vierter'),
  du: bei('du', 2),
  verrueckt: bei('verrückt'),
  schneller: bei('schneller'),
  millionstel: bei('millionstel'),
  einstein: bei('einsteins'),
  kilometer: bei('kilometer', 2),
  deshalb: bei('deshalb'),
  langsamer: bei('langsamer'),
  handy: bei('handy', 4),
  ende: ENDE,
};

/* ───────────── Orte ───────────── */

const S1: [number, number, number] = [-2.8, 5.0, -1.6];
const S2: [number, number, number] = [2.6, 5.4, -2.4];
const S3: [number, number, number] = [-0.6, 4.6, 2.8];
const S4: [number, number, number] = [0.2, 5.8, -3.8];
const KLEINE = Array.from({length: 14}, (_, i) => {
  const w = (i / 14) * Math.PI * 2 + 0.3;
  const r = 6.5 + (i % 3) * 0.8;
  return [Math.cos(w) * r, 3.6 + ((i * 7) % 5) * 0.55, Math.sin(w) * r] as [number, number, number];
});
const PIN: [number, number, number] = [0, 3.4, 0.1];
const UHR_X = 16;
const RAMPE_X = -16;

/* ───────────── Kamera: Stationen, weich überblendet ───────────── */

type Station = {f: number; k: IsoKamera};
const STATIONEN: Station[] = [
  {f: 0, k: {ziel: [0, 0.8, 0], zoom: 200}},
  {f: T.kreisen - 10, k: {ziel: [0, 2.8, 0], zoom: 92}},
  {f: T.funken - 6, k: {ziel: [-2.6, 4.6, -1.4], zoom: 190}},
  {f: T.trick - 6, k: {ziel: [-1.4, 2.6, -0.8], zoom: 118}},
  {f: T.misst - 8, k: {ziel: [0, 1.6, 0], zoom: 165}},
  {f: T.abstand + 4, k: {ziel: [0, 2.6, 0], zoom: 110}},
  {f: T.kugel - 6, k: {ziel: [0, 2.5, 0.2], zoom: 86}},
  {f: T.du - 14, k: {ziel: [0, 0.7, 0.1], zoom: 260}},
  {f: T.verrueckt - 4, k: {ziel: [UHR_X, 2.6, 0], zoom: 120}},
  {f: T.einstein - 6, k: {ziel: [0, 0.8, 0], zoom: 195}},
  {f: T.deshalb - 4, k: {ziel: [RAMPE_X, 1.8, 0], zoom: 150}},
  {f: T.handy - 8, k: {ziel: [0, 2.6, 0], zoom: 110}},
];
const glatt = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const kameraBei = (f: number): IsoKamera => {
  let k = STATIONEN[0].k;
  for (let i = 1; i < STATIONEN.length; i++) {
    const s = STATIONEN[i];
    if (f < s.f) break;
    const u = glatt(Math.min(1, (f - s.f) / 26));
    k = {ziel: k.ziel.map((v, j) => v + (s.k.ziel[j] - v) * u) as [number, number, number], zoom: k.zoom + (s.k.zoom - k.zoom) * u};
  }
  return k;
};

const ein = (f: number, ab: number, dauer = 14) => interpolate(f, [ab, ab + dauer], [0, 1], {...clamp, easing: outQuint});
const aus = (f: number, ab: number, dauer = 10) => 1 - interpolate(f, [ab, ab + dauer], [0, 1], clamp);
/** Satelliten nur, wenn die Geschichte sie braucht: sonst verdecken sie Handy und Zahlen. */
const FENSTER: Array<[number, number]> = [
  [T.kreisen - 4, T.misst - 4],
  [T.kugel - 10, T.du - 16],
  [T.handy - 10, T.ende + 99],
];
const satAn = (f: number) => Math.max(...FENSTER.map(([a, b]) => ein(f, a, 12) * aus(f, b, 10)));

/* ───────────── Bühne ───────────── */

const Kugel: React.FC<{mitte: [number, number, number]; t: number; sicht: number}> = ({mitte, t, sicht}) => {
  const r = new Vector3(...mitte).distanceTo(new Vector3(...PIN).setY(0.5)) * glatt(t);
  if (r < 0.02) return null;
  return (
    <mesh position={mitte}>
      <sphereGeometry args={[r, 64, 48]} />
      <meshStandardMaterial color={M.blau} roughness={0.9} transparent opacity={0.13 * sicht} depthWrite={false} />
    </mesh>
  );
};

const Welle: React.FC<{mitte: [number, number, number]; t: number; farbe: string}> = ({mitte, t, farbe}) =>
  t > 0 && t < 1 ? (
    <mesh position={mitte} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.3 + t * 1.4, 0.03, 8, 64]} />
      <meshBasicMaterial color={farbe} transparent opacity={1 - t} toneMapped={false} />
    </mesh>
  ) : null;

const Szene: React.FC<{f: number; k: IsoKamera}> = ({f, k}) => {
  const auseinander = glatt(ein(f, T.misst, 18)) * aus(f, T.abstand + 10, 18);
  const pinFall = 1 - ein(f, T.pin, 16);
  const drift = glatt(ein(f, T.kilometer - 18, 40)) * aus(f, T.deshalb, 12);
  const sats = satAn(f);
  const kleine = (i: number) => ein(f, T.dreissig + i * 2, 8) * sats;
  const kugelSicht = aus(f, T.du - 16, 12);
  const offen = ein(f, T.atom - 6, 18) * aus(f, T.trick, 14);
  const puls = interpolate(f, [T.signal, T.dir + 10], [0, 1], clamp);
  const satUhr = f * 0.12 + interpolate(f, [T.schneller, T.schneller + 70], [0, 2.2], {...clamp, easing: outQuint});
  const rampeUhr = f * 0.12 - interpolate(f, [T.langsamer - 6, T.langsamer + 20], [0, 1.4], {...clamp, easing: outQuint});
  const signaleEnde = ein(f, T.handy, 20);
  return (
    <MittelBuehne kamera={k}>
      {/* Held */}
      <HandyMittel auseinander={auseinander} chipLeuchten={0.6 * ein(f, T.misst + 10)} pinHoehe={pinFall * 2.5} pinVersatz={[0.55 * drift, 0.1 - 1.0 * drift]} geist={drift > 0.02 ? 1 : 0} />
      {/* Hook: Pfeil nach oben als Punktlinie, die wieder verschwindet */}
      {f >= T.pfeil && f < T.kreisen ? <Signal von={[0, 0.9, 0.1]} nach={[0, 4.2, 0.1]} t={ein(f, T.pfeil, 16)} /> : null}
      {/* Satelliten */}
      {sats > 0
        ? [S1, S2, S3].map((p, i) => <SatellitMittel key={i} position={p} s={sats} offen={i === 0 ? offen : 0} uhr={satUhr} leuchten={0} />)
        : null}
      {KLEINE.map((p, i) => (kleine(i) > 0 ? <SatellitMittel key={`k${i}`} position={p} s={0.55 * kleine(i)} /> : null))}
      {f >= T.vierter && sats > 0 ? <SatellitMittel position={S4} s={ein(f, T.vierter - 4, 10) * sats} /> : null}
      {/* Funk vom Satelliten: Ort (blau), Zeit (Akzent) */}
      <Welle mitte={[S1[0], S1[1] - 0.4, S1[2]]} t={interpolate(f, [T.hier, T.hier + 24], [0, 1], clamp)} farbe={M.blau} />
      <Welle mitte={[S1[0], S1[1] - 0.4, S1[2]]} t={interpolate(f, [T.spaet, T.spaet + 24], [0, 1], clamp)} farbe={M.akzent} />
      {/* Signal fliegt zum Handy */}
      {f >= T.signal && f < T.misst ? <Signal von={[S1[0], S1[1] - 0.35, S1[2]]} nach={[0, 0.9, 0.1]} t={puls} teile={18} /> : null}
      {/* Kugeln und vierter Satellit */}
      {f >= T.kugel && f < T.verrueckt ? (
        <>
          <Kugel sicht={kugelSicht} mitte={S1} t={interpolate(f, [T.kugel, T.kugel + 30], [0, 1], clamp)} />
          <Kugel sicht={kugelSicht} mitte={S2} t={interpolate(f, [T.drei, T.drei + 24], [0, 1], clamp)} />
          <Kugel sicht={kugelSicht} mitte={S3} t={interpolate(f, [T.drei + 10, T.drei + 34], [0, 1], clamp)} />
          {f >= T.vierter && f < T.du - 16 ? <Signal von={[S4[0], S4[1] - 0.35, S4[2]]} nach={[0, 0.9, 0.1]} t={ein(f, T.vierter, 20)} /> : null}
        </>
      ) : null}
      {/* Schlussbild: Signale kommen wieder an */}
      {signaleEnde > 0 ? [S1, S2, S3].map((p, i) => <Signal key={`e${i}`} von={[p[0], p[1] - 0.35, p[2]]} nach={[0, 0.9, 0.1]} t={signaleEnde} />) : null}
      {/* Uhren: unten Erde, oben Satellit */}
      <UhrMittel position={[UHR_X - 1.6, 1.3, 0.8]} winkel={f * 0.12} r={0.95} />
      <mesh position={[UHR_X - 1.6, 0.1, 0.8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 0.2, 32]} />
        <meshStandardMaterial color={M.hell} roughness={0.85} />
      </mesh>
      <UhrMittel position={[UHR_X + 1.4, 4.0, -1.2]} winkel={satUhr} r={0.95} akzent />
      <SatellitMittel position={[UHR_X + 1.4, 2.4, -1.2]} s={1.1} />
      {/* Startrampe */}
      <mesh position={[RAMPE_X, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.8, 0.3, 48]} />
        <meshStandardMaterial color={M.hell} roughness={0.85} />
      </mesh>
      <SatellitMittel position={[RAMPE_X, 1.4, 0]} s={1.6} offen={1} uhr={rampeUhr} />
    </MittelBuehne>
  );
};

/* ───────────── Text, Zahlen, Ton ───────────── */

const GrosseZahl: React.FC<{wert: string; einheit: string; sicht: number; akzent?: boolean}> = ({wert, einheit, sicht, akzent = false}) =>
  sicht > 0 ? (
    <div style={{position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 14, opacity: sicht, transform: `scale(${0.94 + 0.06 * sicht})`}}>
      <div style={{fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 150, letterSpacing: '-0.05em', color: akzent ? AKZENT : HELL, fontVariantNumeric: 'tabular-nums'}}>{wert}</div>
      <div style={{fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 56, color: akzent ? HELL : AKZENT}}>{einheit}</div>
    </div>
  ) : null;

const TON: Array<[SfxName, number, number]> = [
  ['kPop', T.pin + 14, 0.45],
  ['kTick', T.pfeil, 0.3],
  ['kFalsch', T.kreuz, 0.4],
  ['vBlaettern', T.kreisen - 10, 0.35],
  ['kTick', T.dreissig, 0.3],
  ['kTick', T.dreissig + 8, 0.25],
  ['kTick', T.dreissig + 16, 0.25],
  ['vScan', T.hoehe, 0.3],
  ['vZap', T.hier, 0.35],
  ['vZap', T.spaet, 0.35],
  ['vStempel', T.atom, 0.45],
  ['vBlaettern', T.trick - 6, 0.3],
  ['kLanden', T.dir + 8, 0.45],
  ['vZahnrad', T.misst, 0.35],
  ['kDing', T.abstand, 0.45],
  ['kAnstieg', T.kugel, 0.3],
  ['kAnstieg', T.drei, 0.3],
  ['vStempel', T.punkt, 0.5],
  ['vZap', T.vierter, 0.35],
  ['kPop', T.du, 0.45],
  ['vBlaettern', T.verrueckt - 4, 0.35],
  ['vZahnrad', T.schneller, 0.35],
  ['kDing', T.millionstel, 0.45],
  ['vBlaettern', T.einstein - 6, 0.3],
  ['kAnstieg', T.kilometer - 18, 0.3],
  ['vBlaettern', T.deshalb - 4, 0.3],
  ['vServo', T.langsamer - 6, 0.4],
  ['kLanden', T.handy + 20, 0.4],
];

const GpsMittel: React.FC = () => {
  const f = useCurrentFrame();
  const k = kameraBei(f);
  const kreuz = ein(f, T.kreuz, 8) * aus(f, T.kreisen - 12, 8);
  const kreuzOrt = projiziereIso([0, 3.0, 0.1], k);
  const hoeheSicht = f >= T.hoehe && f < T.funken;
  const laufzeit = 0.067 * interpolate(f, [T.signal, T.dir + 10], [0, 1], clamp);
  const zeitSicht = ein(f, T.signal, 8) * aus(f, T.abstand - 2, 6);
  const wegSicht = ein(f, T.abstand, 10) * aus(f, T.kugel - 6, 8);
  const plus38 = ein(f, T.millionstel, 10) * aus(f, T.einstein - 8, 8);
  const pfeilZurueck = ein(f, T.langsamer - 8, 8) * aus(f, T.langsamer + 30, 8);
  const rampe = projiziereIso([RAMPE_X, 2.4, 0], k);
  const drift = glatt(ein(f, T.kilometer - 18, 40));
  return (
    <AbsoluteFill style={{background: M.grund}}>
      <Szene f={f} k={k} />
      {/* Hook: Kreuz über dem Pfeil nach oben */}
      {kreuz > 0 ? (
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          {[1, -1].map((s) => (
            <line key={s} x1={kreuzOrt[0] - 110 * s} y1={kreuzOrt[1] - 110} x2={kreuzOrt[0] - 110 * s + 220 * s * kreuz} y2={kreuzOrt[1] - 110 + 220 * kreuz} stroke={AKZENT} strokeWidth={24} strokeLinecap="round" />
          ))}
        </svg>
      ) : null}
      {hoeheSicht ? <Mass von={projiziereIso([0, 0.5, 0.1], k)} bis={projiziereIso([S2[0], S2[1] - 0.4, S2[2]], k)} text="20.200 km" ab={T.hoehe} /> : null}
      {f >= T.atom && f < T.trick ? <Schild punkt={projiziereIso([S1[0], S1[1], S1[2]], k)} text="Atomuhr" akzent richtung="links" laenge={200} /> : null}
      {f >= T.misst + 8 && f < T.abstand ? <Schild punkt={projiziereIso([0.45, 1.58, -1.55], k)} text="GPS-Empfänger" akzent richtung="links" laenge={260} /> : null}
      {f >= T.kilometer - 4 && f < T.deshalb && drift > 0.9 ? <Mass von={projiziereIso([0, 0.3, 0.1], k)} bis={projiziereIso([0.55, 0.3, -0.9], k)} text="10 km" ab={T.kilometer} /> : null}
      <GrosseZahl wert={laufzeit.toFixed(3).replace('.', ',')} einheit="s" sicht={zeitSicht} />
      <GrosseZahl wert={zahl(20200)} einheit="km" sicht={wegSicht} />
      <GrosseZahl wert="+38" einheit="µs pro Tag" sicht={plus38} akzent />
      {pfeilZurueck > 0 ? (
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: pfeilZurueck}}>
          <path d={`M ${rampe[0] + 190} ${rampe[1] + 120} A 220 220 0 0 0 ${rampe[0] + 20} ${rampe[1] - 30}`} fill="none" stroke={AKZENT} strokeWidth={14} strokeLinecap="round" />
          <path d={`M ${rampe[0] + 52} ${rampe[1] - 48} L ${rampe[0] + 20} ${rampe[1] - 30} L ${rampe[0] + 50} ${rampe[1] - 6}`} fill="none" stroke={AKZENT} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      <TitelStart text={<>So findet dich <span style={{color: AKZENT}}>dein Handy</span></>} bis={T.titelBis} />
      <UntertitelWort captions={WZ} gross={['einziges', 'atomuhren', 'verspätung', 'schneller']} />
      <Audio src={staticFile('projekte/gps-mittel/voiceover.wav')} />
      <Music src="musik/wissen.wav" volume={0.2} captions={WZ} duckTo={0.35} />
      {TON.map(([n, at, v], i) => (at > 0 ? <SfxBei key={i} name={n} at={at} volume={v} /> : null))}
    </AbsoluteFill>
  );
};

const SfxBei: React.FC<{name: SfxName; at: number; volume: number}> = ({name, at, volume}) => <Sfx name={name} at={at} volume={volume} />;

export const gpsMittel: Project[] = [{id: 'GPS-Mittel', component: GpsMittel, format: 'vertical', durationInFrames: ENDE, ordner: 'Wissen'}];
