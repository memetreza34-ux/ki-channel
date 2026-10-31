import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, random, Sequence, spring, useCurrentFrame} from 'remotion';
import {Music} from '../../kit/Music';
import {Sfx} from '../../kit/Stage';
import type {Project} from '../types';
import {AKZENT, BG, HELL, STAHL, Titel, Zaehler, clamp, pulsBei, useAuftritt} from './bausteine';
import deutschland from './deutschland.json';

/**
 * Vier Beispiel-Szenen aus verschiedenen Fächern im Denkwürfel-Look:
 * Biologie – ≈ 37 Billionen Zellen (Bianconi u. a. 2013)
 * Geschichte – Erde als ein Tag: Homo sapiens erst 5,7 s vor Mitternacht (4,54 Mrd. J., USGS; ≈ 300.000 J., Hublin u. a. 2017)
 * Politik – 21. Bundestag, 630 Sitze (Bundeswahlleiterin, Feb. 2025)
 * Geographie – Sahara ≈ 9,2 Mio. km² (Britannica) / Deutschland 357.596 km² (Destatis) ≈ 25-mal
 */

const SZENE = 150;

/* ───────────── Biologie: Zellen ───────────── */

const KOERPER = 'M144,92 a56,56 0 1 0 112,0 a56,56 0 1 0 -112,0 Z M150,150 h100 a40,40 0 0 1 40,40 v170 a22,22 0 0 1 -44,0 v-120 h-6 v330 a26,26 0 0 1 -52,0 v-190 h-4 v190 a26,26 0 0 1 -52,0 v-330 h-6 v120 a22,22 0 0 1 -44,0 v-170 a40,40 0 0 1 40,-40 Z';

const Zellen: React.FC = () => {
  const f = useCurrentFrame();
  const skala = useAuftritt();
  const fuell = interpolate(f, [10, 100], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const zellen = useMemo(() => Array.from({length: 520}, (_, i) => ({x: 80 + random(`zx${i}`) * 240, y: 20 + random(`zy${i}`) * 610, r: 5 + random(`zr${i}`) * 7})), []);
  const pegel = 640 - fuell * 640;
  const PULS = 100;
  return (
    <AbsoluteFill>
      <Titel text={<>So viele <span style={{color: AKZENT}}>Zellen</span> stecken in dir</>} />
      <div style={{position: 'absolute', left: 280, top: 455, transform: `scale(${skala * (1 + pulsBei(f, PULS) * 0.02)})`}}>
        <svg width="520" height="700" viewBox="40 30 320 610">
          <defs>
            <clipPath id="koerper">
              <path d={KOERPER} />
            </clipPath>
          </defs>
          <path d={KOERPER} fill="#1A2440" />
          <g clipPath="url(#koerper)">
            {zellen.map((z, i) =>
              z.y > pegel ? (
                <g key={i}>
                  <circle cx={z.x} cy={z.y} r={z.r} fill={AKZENT} opacity={0.35 + (i % 4) * 0.12} />
                  <circle cx={z.x - z.r * 0.2} cy={z.y - z.r * 0.2} r={z.r * 0.32} fill="#FFD7CC" opacity={0.8} />
                </g>
              ) : null,
            )}
          </g>
          <path d={KOERPER} fill="none" stroke={HELL} strokeWidth="4" />
        </svg>
      </div>
      <Zaehler wert={37 * fuell} einheit="Billionen" label="Zellen in einem Erwachsenen" quelle="QUELLE: BIANCONI U. A., 2013" puls={pulsBei(f, PULS)} />
      <Sfx name="kWhoosh" at={0} volume={0.35} />
      <Sfx name="kAnstieg" at={10} volume={0.3} />
      <Sfx name="kDing" at={PULS} volume={0.5} />
    </AbsoluteFill>
  );
};

/* ───────────── Geschichte: Erde als ein Tag ───────────── */

const ErdTag: React.FC = () => {
  const f = useCurrentFrame();
  const skala = useAuftritt();
  // Zeiger: läuft einmal fast ganz herum (0 → 23:59:54), dann Zoom auf den letzten Rest
  const lauf = interpolate(f, [8, 80], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const winkel = lauf * (360 - (5.7 / 86400) * 360 * 600); // letzter Keil zur Sichtbarkeit 600-fach vergrößert
  const keil = interpolate(f, [84, 100], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const R = 330;
  const keilGrad = 4.5;
  const kx = (a: number, r: number) => Math.sin(a * (Math.PI / 180)) * r;
  const ky = (a: number, r: number) => -Math.cos(a * (Math.PI / 180)) * r;
  const PULS = 104;
  return (
    <AbsoluteFill>
      <Titel text={<>Die Erde als ein Tag: so <span style={{color: AKZENT}}>kurz</span> gibt es uns</>} />
      <div style={{position: 'absolute', left: 540 - R - 30, top: 480, transform: `scale(${skala})`}}>
        <svg width={R * 2 + 60} height={R * 2 + 60} viewBox={`${-R - 30} ${-R - 30} ${R * 2 + 60} ${R * 2 + 60}`}>
          <circle r={R} fill="#152039" stroke="#2C3A5E" strokeWidth="6" />
          <path d={`M0,0 L0,${-R + 18} A${R - 18},${R - 18} 0 ${winkel > 180 ? 1 : 0} 1 ${kx(winkel, R - 18)},${ky(winkel, R - 18)} Z`} fill="#24345C" opacity={0.9} />
          {Array.from({length: 24}, (_, i) => (
            <line key={i} x1={kx(i * 15, R - 8)} y1={ky(i * 15, R - 8)} x2={kx(i * 15, R - (i % 6 === 0 ? 46 : 26))} y2={ky(i * 15, R - (i % 6 === 0 ? 46 : 26))} stroke={i % 6 === 0 ? HELL : STAHL} strokeWidth={i % 6 === 0 ? 6 : 3} strokeLinecap="round" />
          ))}
          {[0, 6, 12, 18].map((h) => (
            <text key={h} x={kx(h * 15, R - 92)} y={ky(h * 15, R - 92) + 16} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize="44" fill={STAHL}>
              {h === 0 ? '24' : h}
            </text>
          ))}
          {keil > 0 ? <path d={`M0,0 L${kx(360 - keilGrad * keil, R - 4)},${ky(360 - keilGrad * keil, R - 4)} A${R - 4},${R - 4} 0 0 1 0,${-R + 4} Z`} fill={AKZENT} /> : null}
          <line x1="0" y1="0" x2={kx(winkel, R - 60)} y2={ky(winkel, R - 60)} stroke={HELL} strokeWidth="10" strokeLinecap="round" />
          <circle r="16" fill={HELL} />
        </svg>
      </div>
      <Zaehler wert={5.7} stellen={1} einheit="Sekunden" label="vor Mitternacht kommt der Mensch" quelle="QUELLE: USGS · HUBLIN U. A., 2017" puls={pulsBei(f, PULS)} />
      <Sfx name="kWhoosh" at={0} volume={0.35} />
      <Sfx name="kAnstieg" at={8} volume={0.25} />
      <Sfx name="kDing" at={PULS} volume={0.5} />
    </AbsoluteFill>
  );
};

/* ───────────── Politik: Bundestag ───────────── */

const PARTEIEN: Array<{name: string; sitze: number; farbe: string}> = [
  {name: 'Linke', sitze: 64, farbe: '#C03A7A'},
  {name: 'Grüne', sitze: 85, farbe: '#4FA33A'},
  {name: 'SPD', sitze: 120, farbe: '#E3343A'},
  {name: 'SSW', sitze: 1, farbe: '#2C6CC4'},
  {name: 'CDU/CSU', sitze: 208, farbe: '#D9DCE3'},
  {name: 'AfD', sitze: 152, farbe: '#2BA3E0'},
];

const Bundestag: React.FC = () => {
  const f = useCurrentFrame();
  const skala = useAuftritt();
  // 630 Sitze auf Halbkreis-Reihen, von links nach rechts nach Partei gefärbt
  const sitze = useMemo(() => {
    const reihen = 12;
    const liste: Array<{x: number; y: number; a: number}> = [];
    const radien = Array.from({length: reihen}, (_, i) => 180 + i * 32);
    const umfang = radien.reduce((s, r) => s + r, 0);
    radien.forEach((r) => {
      const n = Math.round((630 * r) / umfang);
      for (let k = 0; k < n; k++) {
        const a = Math.PI - (k / (n - 1)) * Math.PI;
        liste.push({x: Math.cos(a) * r, y: -Math.sin(a) * r, a});
      }
    });
    liste.sort((p, q) => q.a - p.a);
    return liste.slice(0, 630);
  }, []);
  const farben = PARTEIEN.flatMap((p) => Array.from({length: p.sitze}, () => p.farbe));
  const PULS = 96;
  return (
    <AbsoluteFill>
      <Titel text={<>So sitzt der <span style={{color: AKZENT}}>Bundestag</span></>} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${skala})`}}>
        <svg width="1000" height="560" viewBox="-560 -560 1120 600">
          {sitze.map((s, i) => {
            const t = interpolate(f, [6 + (i / 630) * 70, 12 + (i / 630) * 70], [0, 1], clamp);
            return <circle key={i} cx={s.x} cy={s.y} r={10 * t} fill={farben[i] ?? STAHL} />;
          })}
          <line x1="0" y1="-560" x2="0" y2="-150" stroke={HELL} strokeWidth="3" strokeDasharray="8 10" opacity={interpolate(f, [86, 96], [0, 0.8], clamp)} />
        </svg>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px 22px', width: 900, marginTop: 10, opacity: interpolate(f, [70, 82], [0, 1], clamp)}}>
          {PARTEIEN.filter((p) => p.sitze > 1).map((p) => (
            <div key={p.name} style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 32, color: HELL}}>
              <div style={{width: 22, height: 22, borderRadius: 11, background: p.farbe}} />
              {p.name} <span style={{color: STAHL}}>{p.sitze}</span>
            </div>
          ))}
        </div>
      </div>
      <Zaehler wert={interpolate(f, [6, 76], [0, 630], clamp)} einheit="Sitze" label="Mehrheit ab 316 Stimmen" quelle="QUELLE: BUNDESWAHLLEITERIN, 2025" puls={pulsBei(f, PULS)} />
      <Sfx name="kWhoosh" at={0} volume={0.35} />
      <Sfx name="kAnstieg" at={6} volume={0.25} />
      <Sfx name="kDing" at={PULS} volume={0.5} />
    </AbsoluteFill>
  );
};

/* ───────────── Geographie: Deutschland in der Sahara ───────────── */

const umriss = (() => {
  const ringe = deutschland as number[][][];
  const k = Math.cos(51 * (Math.PI / 180));
  const alle = ringe.flat();
  const xs = alle.map((p) => p[0] * k);
  const ys = alle.map((p) => -p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const s = 1 / Math.max(x1 - x0, y1 - y0);
  return {
    pfad: ringe.map((r) => 'M' + r.map(([lo, la]) => `${((lo * k - x0) * s).toFixed(4)},${((-la - y0) * s).toFixed(4)}`).join('L') + 'Z').join(' '),
    breite: (x1 - x0) * s,
    hoehe: (y1 - y0) * s,
  };
})();

const Sahara: React.FC = () => {
  const f = useCurrentFrame();
  const skala = useAuftritt();
  const anzahl = Math.floor(interpolate(f, [14, 90], [0, 25], clamp));
  const groesse = 128;
  const PULS = 92;
  return (
    <AbsoluteFill>
      <Titel text={<>So oft passt Deutschland in die <span style={{color: AKZENT}}>Sahara</span></>} />
      <div style={{position: 'absolute', left: 100, top: 560, width: 880, height: 610, borderRadius: 40, background: 'linear-gradient(160deg, #C99A5B 0%, #A8763E 100%)', transform: `scale(${skala})`, overflow: 'hidden'}}>
        <svg width="880" height="700" style={{position: 'absolute', inset: 0, opacity: 0.18}}>
          {Array.from({length: 9}, (_, i) => (
            <path key={i} d={`M-20,${60 + i * 80} Q220,${20 + i * 80} 440,${60 + i * 80} T900,${60 + i * 80}`} stroke="#FFF1D6" strokeWidth="6" fill="none" />
          ))}
        </svg>
        <div style={{position: 'absolute', left: 80, top: 22, display: 'grid', gridTemplateColumns: `repeat(5, ${groesse + 10}px)`, gap: 6}}>
          {Array.from({length: 25}, (_, i) => {
            const an = i < anzahl;
            const t = an ? spring({frame: f - 14 - i * 3, fps: 30, config: {damping: 14, stiffness: 160}}) : 0;
            return (
              <svg key={i} width={groesse} height={groesse * 0.86} viewBox={`0 0 ${umriss.breite} ${umriss.hoehe}`} style={{transform: `scale(${0.6 + t * 0.4})`, opacity: an ? 1 : 0.15}}>
                <path d={umriss.pfad} fill={an ? BG : 'none'} stroke={an ? HELL : '#5A3F1E'} strokeWidth={0.012} />
              </svg>
            );
          })}
        </div>
      </div>
      <Zaehler wert={anzahl} einheit="mal" label="9,2 Mio. km² gegen 357.596 km²" quelle="QUELLE: BRITANNICA · DESTATIS" puls={pulsBei(f, PULS)} />
      <Sfx name="kWhoosh" at={0} volume={0.35} />
      <Sfx name="kDing" at={PULS} volume={0.5} />
    </AbsoluteFill>
  );
};

const Faecher: React.FC = () => (
  <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
    <AbsoluteFill style={{background: 'radial-gradient(900px 700px at 50% 45%, rgba(90,130,220,0.10), transparent 70%)'}} />
    <Music src="musik/wissen.wav" volume={0.22} fadeInFrames={10} fadeOutFrames={30} />
    {[Zellen, ErdTag, Bundestag, Sahara].map((Szene, i) => (
      <Sequence key={i} from={i * SZENE} durationInFrames={SZENE}>
        <Szene />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const faecher: Project[] = [{id: 'Faecher-Beispiele', component: Faecher, format: 'vertical', durationInFrames: SZENE * 4, ordner: 'Wissen'}];
