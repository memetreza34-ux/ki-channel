import React, {useMemo} from 'react';
import type {Caption} from '@remotion/captions';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {Vector3} from 'three';
import {Sfx} from '../../kit/Stage';
import type {SfxName} from '../../kit/Stage';
import type {Project} from '../types';
import {AKZENT, HELL, STAHL, clamp, outQuint, zahl} from './bausteine';
import {BLAU3D, Erde3D, Handy3D, Pin3D, Satellit3D, Uhr3D, vonGeo} from './gps-3d';
import {Mass, UntertitelWort, probeZeiten} from './stil';
import {projiziere3D, roentgen} from './technik-bausteine';
import type {KameraStand} from './technik-bausteine';
import {Buehne3D, WeltTunnel} from './welten';

/**
 * GPS – Animationstest v2 (Technik-Stil nach scroll.engineer, ohne Stimme/Musik).
 * Neues Skript mit Hook „ohne ein einziges Signal“, 23 Einstellungen à 1,5–3 s, das Handy als wiederkehrender Held
 * (Signal landet im Handy, Schnittpunkt wird zum Pin, Drift auf dem Bildschirm), Loop zurück zu Bild 0.
 * Untertitel = Platzhalter-Wortzeiten (330 ms/Wort) bei y 1430 (gemessen: scroll.engineer 76–78 % Höhe).
 */

const MONO = 'JetBrains Mono, monospace';
const INTER = 'Inter, sans-serif';

/* ───────────── Skript (Platzhalter-Zeiten) ───────────── */

const ABSAETZE: Array<[number, string]> = [
  [6, 'Dein Handy findet dich überall auf der Erde auf wenige Meter genau. Ohne ein EINZIGES Signal ins All zu schicken.'],
  [180, 'Denn über dir kreisen gut dreißig Satelliten. Jeder in 20.200 Kilometern Höhe.'],
  [320, 'Und alle funken pausenlos nur zwei Dinge: Hier bin ich. Und so spät ist es bei mir. Gemessen mit ATOMUHREN.'],
  [515, 'Jetzt kommt der Trick. Das Signal braucht ein paar Hundertstel Sekunden bis zu dir. Dein Handy misst diese VERSPÄTUNG. Und weil Funk mit Lichtgeschwindigkeit fliegt, wird aus Zeit ein Abstand.'],
  [820, 'Ein Abstand heißt: Du bist irgendwo auf einer Kugel um den Satelliten. Drei Kugeln? Nur noch ein Punkt auf der Erde. Ein vierter Satellit stellt die Uhr im Handy. Und dieser Punkt bist DU.'],
  [1155, 'Aber jetzt wird es verrückt. Da oben läuft die Zeit SCHNELLER. Jeden Tag 38 Millionstel Sekunden. Klingt nach nichts.'],
  [1340, 'Doch ohne Einsteins Korrektur läge dein Standort jeden Tag zehn Kilometer daneben.'],
  [1460, 'Deshalb werden die Uhren schon vor dem Start ein winziges bisschen langsamer gestellt. Und dein Handy? Hört einfach weiter ZU.'],
];
const WORTZEITEN: Caption[] = ABSAETZE.flatMap(([ab, text]) => probeZeiten(text, (ab / 30) * 1000, 330));
const GESAMT = 1680;

/* ───────────── Helfer ───────────── */

const glatt = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const ein = (f: number, ab: number, dauer = 12) => interpolate(f, [ab, ab + dauer], [0, 1], {...clamp, easing: outQuint});
const v3 = (v: Vector3) => v.toArray() as [number, number, number];
const t01 = (f: number, a: number, b: number) => Math.min(1, Math.max(0, (f - a) / (b - a)));

type K = {pos: Vector3; ziel: Vector3; fov?: number};
/** Kamerafahrt von a nach b über die Einstellung (weich). */
const fahrt = (a: K, b: K, dauer: number) => (f: number): KameraStand => {
  const u = glatt(t01(f, 0, dauer));
  return {pos: v3(a.pos.clone().lerp(b.pos, u)), ziel: v3(a.ziel.clone().lerp(b.ziel, u)), fov: (a.fov ?? 40) + ((b.fov ?? 40) - (a.fov ?? 40)) * u};
};
const V = (x: number, y: number, z: number) => new Vector3(x, y, z);

/* ───────────── Orte ───────────── */

const PIN = vonGeo(51, 10, 5);
const N = PIN.clone().normalize();
const OST = V(0, 1, 0).cross(N).normalize();
const NORD = N.clone().cross(OST).normalize();
const SAT_A = vonGeo(70, 0, 13);
const SAT_B = vonGeo(38, 42, 13);
const SAT_C = vonGeo(30, -28, 13);
const SAT_D = vonGeo(62, 62, 13);
const BAHNEN = [0, 60, 120, 180, 240, 300];
const um = (basis: Vector3, n: number, o: number, no: number) => basis.clone().add(N.clone().multiplyScalar(n)).add(OST.clone().multiplyScalar(o)).add(NORD.clone().multiplyScalar(no));

/* ───────────── Bühne Handy ───────────── */

const HANDY_START: K = {pos: V(0.05, 3.1, 0.5), ziel: V(0, 0, 0.02), fov: 40};

const HandyBuehne: React.FC<{kamera: KameraStand; ringeAuf?: number[]; ringeAb?: number[]; puls?: number; pin?: [number, number]; geist?: number}> = ({kamera, ringeAuf = [], ringeAb = [], puls = 0, pin, geist = 0}) => {
  const f = useCurrentFrame();
  const ring = (ab: number, auf: boolean, key: string) => {
    const t = t01(f, ab, ab + 30);
    if (t <= 0 || t >= 1) return null;
    const y = auf ? 0.12 + t * 1.3 : 1.6 - t * 1.48;
    const r = auf ? 0.15 + t * 0.5 : 0.65 - t * 0.5;
    const farbe = auf ? '#F3EFE7' : BLAU3D;
    return (
      <mesh key={key} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r, 0.01, 8, 64]} />
        <meshStandardMaterial color={farbe} emissive={farbe} emissiveIntensity={3} transparent opacity={auf ? 1 - t : Math.min(1, t * 3)} />
      </mesh>
    );
  };
  return (
    <Buehne3D hintergrund="#06080E" kamera={kamera} kino={{bloom: 0.9, schwelle: 0.6, vignette: 0.6}}>
      <ambientLight intensity={0.22} />
      <spotLight position={[1.5, 4, 2]} angle={0.5} penumbra={0.9} intensity={45} color="#FFF4EA" castShadow />
      <pointLight position={[-2, 1.2, -1]} intensity={8} color="#7F9BFF" />
      <pointLight position={[2, 0.6, -2]} intensity={5} color="#FFB08A" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0B0E15" metalness={0.8} roughness={0.32} />
      </mesh>
      <Handy3D puls={puls} pin={pin} geist={geist} />
      {ringeAuf.map((ab, i) => ring(ab, true, `a${i}`))}
      {ringeAb.map((ab, i) => ring(ab, false, `b${i}`))}
    </Buehne3D>
  );
};

const pulsSchleife = (f: number, ab: number) => (f < ab ? 0 : (((f - ab) % 30) + 30) % 30 / 30);

/* ───────────── Bühne Orbit ───────────── */

const Kugeln: React.FC<{mitte: Vector3; t: number}> = ({mitte, t}) => {
  const rand = useMemo(() => roentgen(BLAU3D, 1.1, 3), []);
  const r = mitte.distanceTo(PIN) * glatt(t);
  if (r <= 0.01) return null;
  return (
    <group position={v3(mitte)}>
      <mesh>
        <sphereGeometry args={[r, 64, 48]} />
        <meshStandardMaterial color={BLAU3D} emissive={BLAU3D} emissiveIntensity={0.2} transparent opacity={0.045} depthWrite={false} side={2} />
      </mesh>
      <mesh>
        <sphereGeometry args={[r, 64, 48]} />
        <primitive object={rand} attach="material" />
      </mesh>
    </group>
  );
};

const Strahl: React.FC<{von: Vector3; nach: Vector3; t: number; farbe?: string; dicke?: number}> = ({von, nach, t, farbe = AKZENT, dicke = 0.035}) => {
  if (t <= 0) return null;
  const ende = von.clone().lerp(nach, t);
  const mitte = von.clone().lerp(ende, 0.5);
  const d = ende.clone().sub(von);
  const l = d.length();
  const achse = V(0, 1, 0).cross(d.clone().normalize());
  const w = V(0, 1, 0).angleTo(d.clone().normalize());
  const q = achse.length() < 1e-6 ? [0, 0, 0, 1] : [...achse.normalize().multiplyScalar(Math.sin(w / 2)).toArray(), Math.cos(w / 2)];
  return (
    <mesh position={v3(mitte)} quaternion={q as [number, number, number, number]}>
      <cylinderGeometry args={[dicke, dicke, l, 8]} />
      <meshStandardMaterial color={farbe} emissive={farbe} emissiveIntensity={3} />
    </mesh>
  );
};

type OrbitZustand = {xray?: number; wellen?: Array<[number, string]>; puls?: number; kugeln?: [number, number, number]; vierter?: number; strahlA?: number; pinPuls?: number; alleSat?: number; hervor?: boolean};

const OrbitBuehne: React.FC<{kamera: KameraStand; zeit: number; z: OrbitZustand}> = ({kamera, zeit, z}) => {
  const sats = useMemo(() => BAHNEN.flatMap((raan, j) => Array.from({length: 5}, (_, i) => ({raan, j, i}))), []);
  const puls = z.puls ?? 0;
  return (
    <Buehne3D hintergrund="radial-gradient(120% 80% at 50% 40%, #121C3C 0%, #05070D 70%)" kamera={kamera} kino={{bloom: 1, schwelle: 0.55, vignette: 0.6}}>
      <ambientLight intensity={0.08} />
      <directionalLight position={v3(um(V(0, 0, 0), 30, 18, 12))} intensity={2.8} color="#FFF1E0" />
      <pointLight position={[-30, -10, -20]} intensity={40} color="#3050A0" distance={120} />
      {Array.from({length: 220}, (_, i) => {
        const p = vonGeo(((i * 61) % 180) - 90, (i * 137.5) % 360, 120 + (i % 7) * 8);
        return (
          <mesh key={i} position={v3(p)}>
            <sphereGeometry args={[0.15 + (i % 5) * 0.06, 6, 4]} />
            <meshBasicMaterial color="#F3EFE7" transparent opacity={0.35 + (i % 4) * 0.15} />
          </mesh>
        );
      })}
      <Erde3D wolken={zeit * 0.0006} />
      <Pin3D position={PIN} normale={N} groesse={0.12} puls={z.pinPuls ?? 0} />
      {BAHNEN.map((raan) => (
        <group key={raan} rotation={[0, (raan * Math.PI) / 180, 0]}>
          <group rotation={[(35 * Math.PI) / 180, 0, 0]}>
            <mesh>
              <torusGeometry args={[13, 0.02, 6, 220]} />
              <meshBasicMaterial color={BLAU3D} transparent opacity={0.22 * (z.alleSat ?? 1)} />
            </mesh>
          </group>
        </group>
      ))}
      {sats.map(({raan, j, i}) => {
        const sicht = Math.min(1, Math.max(0, (z.alleSat ?? 1) * 32 - (j * 5 + i)));
        if (sicht <= 0) return null;
        const w = (i / 5) * Math.PI * 2 + j * 0.7 + zeit * 0.004;
        const p = V(Math.cos(w) * 13, Math.sin(w) * 13, 0);
        p.applyAxisAngle(V(1, 0, 0), (35 * Math.PI) / 180);
        p.applyAxisAngle(V(0, 1, 0), (raan * Math.PI) / 180);
        return <Satellit3D key={`${j}-${i}`} position={p} s={0.32 * sicht} blick={V(0, 0, 0)} />;
      })}
      <Satellit3D position={SAT_A} s={0.55} durchsicht={z.xray ?? 0} uhr={zeit * 0.25} blick={PIN} leuchten={z.hervor ? 0.6 : 0} />
      {z.hervor ? (
        <>
          <Satellit3D position={SAT_B} s={0.5} blick={PIN} leuchten={0.6} />
          <Satellit3D position={SAT_C} s={0.5} blick={PIN} leuchten={0.6} />
        </>
      ) : null}
      {(z.vierter ?? 0) > 0 ? <Satellit3D position={SAT_D} s={0.5} blick={PIN} leuchten={1} /> : null}
      {(z.wellen ?? []).map(([t, farbe], k) =>
        t > 0 && t < 1 ? (
          <mesh key={k} position={v3(SAT_A)}>
            <sphereGeometry args={[0.4 + t * 2.6, 32, 24]} />
            <meshBasicMaterial color={farbe} transparent opacity={0.4 * (1 - t)} depthWrite={false} wireframe />
          </mesh>
        ) : null,
      )}
      {puls > 0 && puls < 1
        ? Array.from({length: 10}, (_, k) => (
            <mesh key={k} position={v3(SAT_A.clone().lerp(PIN, Math.max(0, glatt(puls) - k * 0.012)))}>
              <sphereGeometry args={[0.08 * (1 - k * 0.07), 16, 12]} />
              <meshStandardMaterial color="#FFFFFF" emissive={BLAU3D} emissiveIntensity={4 * (1 - k * 0.09)} transparent opacity={1 - k * 0.09} />
            </mesh>
          ))
        : null}
      <Strahl von={SAT_A} nach={PIN} t={z.strahlA ?? 0} farbe={BLAU3D} dicke={0.03} />
      {z.kugeln ? (
        <>
          <Kugeln mitte={SAT_A} t={z.kugeln[0]} />
          <Kugeln mitte={SAT_B} t={z.kugeln[1]} />
          <Kugeln mitte={SAT_C} t={z.kugeln[2]} />
        </>
      ) : null}
      <Strahl von={SAT_D} nach={PIN} t={z.vierter ?? 0} />
    </Buehne3D>
  );
};

/* ───────────── Große Zahl oben ───────────── */

const GrosseZahl: React.FC<{wert: string; einheit: string; sicht: number; akzent?: boolean; top?: number}> = ({wert, einheit, sicht, akzent = false, top = 230}) =>
  sicht > 0 ? (
    <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 14, opacity: sicht, transform: `scale(${0.94 + 0.06 * sicht})`}}>
      <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 150, letterSpacing: '-0.05em', color: akzent ? AKZENT : HELL, fontVariantNumeric: 'tabular-nums', textShadow: '0 4px 30px rgba(0,0,0,0.5)'}}>{wert}</div>
      <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 60, color: akzent ? HELL : AKZENT}}>{einheit}</div>
    </div>
  ) : null;

/* ───────────── Einstellungen ───────────── */

type Einstellung = {von: number; bis: number; Bild: React.FC<{d: number}>; ton?: Array<[SfxName, number, number?]>};

const E: Einstellung[] = [
  // P1 · Hook
  {
    von: 0,
    bis: 60,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      return <HandyBuehne kamera={fahrt(HANDY_START, {pos: V(0.05, 2.7, 0.45), ziel: V(0, 0, 0.02)}, d)(f)} puls={pulsSchleife(f, 8)} />;
    },
    ton: [['kPop', 8, 0.45]],
  },
  {
    von: 60,
    bis: 126,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      return <HandyBuehne kamera={fahrt({pos: V(1.6, 1.5, 1.9), ziel: V(0, 0.45, 0)}, {pos: V(1.4, 1.35, 1.7), ziel: V(0, 0.5, 0)}, d)(f)} ringeAuf={[2, 14, 26, 38]} />;
    },
    ton: [['kTick', 2, 0.3], ['kTick', 14, 0.25], ['kTick', 26, 0.25]],
  },
  {
    von: 126,
    bis: 180,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const k = fahrt({pos: V(1.4, 1.35, 1.7), ziel: V(0, 0.5, 0)}, {pos: V(1.3, 1.3, 1.6), ziel: V(0, 0.5, 0)}, d)(f);
      const m = projiziere3D([0, 0.75, 0], k);
      const x = ein(f, 0, 8);
      return (
        <AbsoluteFill>
          <HandyBuehne kamera={k} ringeAuf={[-28, -16, -4]} />
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
            <line x1={m[0] - 150} y1={m[1] - 150} x2={m[0] - 150 + 300 * x} y2={m[1] - 150 + 300 * x} stroke={AKZENT} strokeWidth={26} strokeLinecap="round" />
            <line x1={m[0] + 150} y1={m[1] - 150} x2={m[0] + 150 - 300 * x} y2={m[1] - 150 + 300 * x} stroke={AKZENT} strokeWidth={26} strokeLinecap="round" />
          </svg>
        </AbsoluteFill>
      );
    },
    ton: [['vEinschlag', 0, 0.55], ['kFalsch', 2, 0.35]],
  },
  // P2 · Satelliten
  {
    von: 180,
    bis: 290,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const k = fahrt({pos: um(V(0, 0, 0), 20, 4, -5), ziel: V(0, 0, 0), fov: 42}, {pos: um(V(0, 0, 0), 32, 9, -7), ziel: V(0, 0, 0), fov: 40}, d)(f);
      const boden = projiziere3D(v3(PIN), k);
      const bahn = projiziere3D(v3(N.clone().multiplyScalar(13)), k);
      return (
        <AbsoluteFill>
          <OrbitBuehne kamera={k} zeit={180 + f} z={{alleSat: t01(f, 6, 70)}} />
          <Mass von={boden} bis={bahn} text="20.200 km" ab={70} versatz={-40} />
        </AbsoluteFill>
      );
    },
    ton: [['vVorbei', 0, 0.45], ['kTick', 20, 0.25], ['kTick', 40, 0.25], ['kTick', 60, 0.25], ['vScan', 70, 0.3]],
  },
  {
    von: 290,
    bis: 320,
    Bild: () => {
      const f = useCurrentFrame();
      const k = {pos: v3(SAT_A.clone().add(OST.clone().multiplyScalar(4.5 - f * 0.3)).add(N.clone().multiplyScalar(2.2)).add(NORD.clone().multiplyScalar(-1.5))), ziel: v3(SAT_A), fov: 36};
      return <OrbitBuehne kamera={k} zeit={290 + f} z={{}} />;
    },
    ton: [['vVorbei', 0, 0.5]],
  },
  // P3 · Hier bin ich, so spät, Atomuhren
  {
    von: 320,
    bis: 385,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const unten = PIN.clone().sub(SAT_A).normalize();
      const k = fahrt({pos: SAT_A.clone().add(unten.clone().multiplyScalar(2.2)).add(OST.clone().multiplyScalar(0.9)), ziel: SAT_A}, {pos: SAT_A.clone().add(unten.clone().multiplyScalar(1.9)).add(OST.clone().multiplyScalar(0.6)), ziel: SAT_A}, d)(f);
      return <OrbitBuehne kamera={k} zeit={320 + f} z={{wellen: [[t01(f, 40, 70), BLAU3D]]}} />;
    },
    ton: [['vZap', 40, 0.4]],
  },
  {
    von: 385,
    bis: 450,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const k = fahrt({pos: um(SAT_A, 0.8, 2.8, -0.6), ziel: SAT_A, fov: 36}, {pos: um(SAT_A, 0.6, 2.4, -1.2), ziel: SAT_A, fov: 36}, d)(f);
      return <OrbitBuehne kamera={k} zeit={385 + f} z={{wellen: [[t01(f, 36, 66), AKZENT]]}} />;
    },
    ton: [['vZap', 36, 0.4]],
  },
  {
    von: 450,
    bis: 515,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const k = fahrt({pos: um(SAT_A, 0.9, 1.9, -1.2), ziel: SAT_A, fov: 34}, {pos: um(SAT_A, 0.7, 1.4, -0.9), ziel: SAT_A, fov: 32}, d)(f);
      return <OrbitBuehne kamera={k} zeit={450 + f} z={{xray: t01(f, 18, 40)}} />;
    },
    ton: [['vScan', 18, 0.35], ['kDing', 48, 0.35]],
  },
  // P4 · Trick: Laufzeit
  {
    von: 515,
    bis: 580,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const hinten = SAT_A.clone().sub(PIN).normalize();
      const k = fahrt({pos: SAT_A.clone().add(hinten.clone().multiplyScalar(2.2)).add(OST.clone().multiplyScalar(0.8)), ziel: PIN}, {pos: SAT_A.clone().add(hinten.clone().multiplyScalar(1.6)).add(OST.clone().multiplyScalar(0.6)), ziel: PIN}, d)(f);
      return <OrbitBuehne kamera={k} zeit={515 + f} z={{puls: t01(f, 30, 140) * 0.999}} />;
    },
    ton: [['vVorbei', 28, 0.45]],
  },
  {
    von: 580,
    bis: 650,
    Bild: () => {
      const f = useCurrentFrame();
      const t = t01(f + 50, 30, 140);
      const p = SAT_A.clone().lerp(PIN, glatt(t));
      const hinten = SAT_A.clone().sub(PIN).normalize();
      const k = {pos: v3(p.clone().add(hinten.multiplyScalar(2.6)).add(OST.clone().multiplyScalar(1.4))), ziel: v3(p.clone().lerp(PIN, 0.5)), fov: 40};
      const s = 0.067 * t01(f, 0, 110);
      return (
        <AbsoluteFill>
          <OrbitBuehne kamera={k} zeit={580 + f} z={{puls: Math.min(0.999, t)}} />
          <GrosseZahl wert={s.toFixed(3).replace('.', ',')} einheit="s" sicht={ein(f, 0, 8)} />
        </AbsoluteFill>
      );
    },
  },
  {
    von: 650,
    bis: 720,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const s = 0.067 * t01(f + 70, 0, 110);
      return (
        <AbsoluteFill>
          <HandyBuehne kamera={fahrt({pos: V(1.2, 2.5, 1.6), ziel: V(0, 0.2, 0.05)}, {pos: V(1.0, 2.3, 1.4), ziel: V(0, 0.2, 0.05)}, d)(f)} ringeAb={[0, 10, 20]} puls={pulsSchleife(f, 30)} />
          <GrosseZahl wert={s.toFixed(3).replace('.', ',')} einheit="s" sicht={1} />
        </AbsoluteFill>
      );
    },
    ton: [['kLanden', 30, 0.45], ['kDing', 40, 0.45]],
  },
  {
    von: 720,
    bis: 820,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const k = fahrt({pos: um(PIN, 4, -3, -3), ziel: PIN.clone().add(N.clone().multiplyScalar(3)), fov: 44}, {pos: um(PIN, 14, -9, -8), ziel: PIN.clone().add(N.clone().multiplyScalar(4)), fov: 42}, d)(f);
      const tausch = ein(f, 20, 12);
      return (
        <AbsoluteFill>
          <OrbitBuehne kamera={k} zeit={720 + f} z={{strahlA: t01(f, 10, 50)}} />
          <GrosseZahl wert="0,067" einheit="s" sicht={1 - tausch} />
          <GrosseZahl wert={zahl(20200)} einheit="km" sicht={tausch} />
        </AbsoluteFill>
      );
    },
    ton: [['kAnstieg', 10, 0.3], ['kDing', 20, 0.45]],
  },
  // P5 · Kugeln
  {
    von: 820,
    bis: 900,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const k = fahrt({pos: um(PIN, 18, -22, -16), ziel: PIN.clone().add(N.clone().multiplyScalar(4)), fov: 42}, {pos: um(PIN, 19, -18, -20), ziel: PIN.clone().add(N.clone().multiplyScalar(4)), fov: 42}, d)(f);
      return <OrbitBuehne kamera={k} zeit={820 + f} z={{kugeln: [t01(f, 15, 65), 0, 0], hervor: true}} />;
    },
    ton: [['kAnstieg', 15, 0.3]],
  },
  {
    von: 900,
    bis: 960,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const k = fahrt({pos: um(PIN, 16, 12, -18), ziel: PIN.clone().add(N.clone().multiplyScalar(3)), fov: 44}, {pos: um(PIN, 17, 14, -15), ziel: PIN.clone().add(N.clone().multiplyScalar(3)), fov: 44}, d)(f);
      return <OrbitBuehne kamera={k} zeit={900 + f} z={{kugeln: [1, t01(f, 4, 34), t01(f, 20, 50)], hervor: true}} />;
    },
    ton: [['kAnstieg', 4, 0.3], ['kAnstieg', 20, 0.3]],
  },
  {
    von: 960,
    bis: 1030,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const k = fahrt({pos: um(PIN, 6, -3, -4), ziel: PIN, fov: 42}, {pos: um(PIN, 4.5, -2, -3), ziel: PIN, fov: 42}, d)(f);
      return <OrbitBuehne kamera={k} zeit={960 + f} z={{kugeln: [1, 1, 1], pinPuls: pulsSchleife(f, 15), hervor: true}} />;
    },
    ton: [['vEinschlag', 15, 0.5]],
  },
  {
    von: 1030,
    bis: 1090,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const k = fahrt({pos: um(PIN, 18, -8, -18), ziel: PIN.clone().add(N.clone().multiplyScalar(5)), fov: 44}, {pos: um(PIN, 19, -4, -19), ziel: PIN.clone().add(N.clone().multiplyScalar(5)), fov: 44}, d)(f);
      return <OrbitBuehne kamera={k} zeit={1030 + f} z={{kugeln: [1, 1, 1], vierter: t01(f, 10, 40), pinPuls: pulsSchleife(f, 0), hervor: true}} />;
    },
    ton: [['vZap', 10, 0.4]],
  },
  {
    von: 1090,
    bis: 1135,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const k = fahrt({pos: um(PIN, 10, -2, -3), ziel: PIN, fov: 42}, {pos: um(PIN, 0.7, -0.1, -0.2), ziel: PIN, fov: 42}, d)(f);
      return <OrbitBuehne kamera={k} zeit={1090 + f} z={{pinPuls: pulsSchleife(f, 0)}} />;
    },
    ton: [['vVorbei', 0, 0.4]],
  },
  {
    von: 1135,
    bis: 1155,
    Bild: () => {
      const f = useCurrentFrame();
      return <HandyBuehne kamera={fahrt({pos: V(0.02, 1.0, 0.12), ziel: V(0, 0, 0.02)}, {pos: V(0.02, 1.3, 0.16), ziel: V(0, 0, 0.02)}, 20)(f)} puls={pulsSchleife(f, 0)} />;
    },
    ton: [['kPop', 0, 0.5]],
  },
  // P6 · Uhren
  {
    von: 1155,
    bis: 1215,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const k = fahrt({pos: V(0.6, 1.9, 12), ziel: V(0, 1.9, 0)}, {pos: V(0.3, 1.9, 10.5), ziel: V(0, 1.9, 0)}, d)(f);
      const L = projiziere3D([-1.15, 0.95, 0], k);
      const R = projiziere3D([1.15, 0.95, 0], k);
      return (
        <AbsoluteFill>
          <WeltTunnel kamera={() => k} farbe="#DCE6FF">
            <Uhr3D position={[-1.15, 2.0, 0]} winkel={f * 0.105} r={0.82} />
            <Uhr3D position={[1.15, 2.0, 0]} winkel={f * 0.105 + 0.6 * t01(f, 20, 60)} r={0.82} akzent />
          </WeltTunnel>
          {[[L, 'ERDE', STAHL], [R, 'SATELLIT', AKZENT]].map(([p, t, c]) => (
            <div key={t as string} style={{position: 'absolute', left: (p as number[])[0] - 160, width: 320, top: (p as number[])[1], textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 36, letterSpacing: '0.12em', color: c as string}}>{t as string}</div>
          ))}
        </AbsoluteFill>
      );
    },
    ton: [['vEinschlag', 0, 0.4]],
  },
  {
    von: 1215,
    bis: 1275,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const k = fahrt({pos: V(2.0, 2.3, 4.4), ziel: V(1.15, 2.0, 0)}, {pos: V(1.8, 2.2, 3.8), ziel: V(1.15, 2.0, 0)}, d)(f);
      return (
        <WeltTunnel kamera={() => k} farbe="#FFD2B0">
          <Uhr3D position={[-1.15, 2.0, 0]} winkel={(60 + f) * 0.105} r={0.82} />
          <Uhr3D position={[1.15, 2.0, 0]} winkel={(60 + f) * 0.105 + 0.6 + 1.6 * glatt(t01(f, 5, 55))} r={0.82} akzent />
        </WeltTunnel>
      );
    },
    ton: [['vZahnrad', 5, 0.35]],
  },
  {
    von: 1275,
    bis: 1340,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const k = fahrt({pos: V(0.3, 1.9, 9.5), ziel: V(0, 1.9, 0)}, {pos: V(0.1, 1.9, 9), ziel: V(0, 1.9, 0)}, d)(f);
      const puls = interpolate(f, [5, 11, 22], [0, 1, 0], clamp);
      return (
        <AbsoluteFill>
          <WeltTunnel kamera={() => k} farbe="#DCE6FF">
            <Uhr3D position={[-1.15, 2.0, 0]} winkel={(120 + f) * 0.105} r={0.82} />
            <Uhr3D position={[1.15, 2.0, 0]} winkel={(120 + f) * 0.105 + 2.2} r={0.82} akzent />
          </WeltTunnel>
          <div style={{transform: `scale(${1 + 0.06 * puls})`, transformOrigin: '540px 320px', position: 'absolute', inset: 0}}>
            <GrosseZahl wert="+38" einheit="µs pro Tag" sicht={ein(f, 5, 10)} akzent />
          </div>
        </AbsoluteFill>
      );
    },
    ton: [['kDing', 5, 0.45]],
  },
  // P7 · Drift auf dem Handy
  {
    von: 1340,
    bis: 1460,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const drift = glatt(t01(f, 30, 100));
      const pin: [number, number] = [0.2 * drift, 0.02 - 0.42 * drift];
      const k = fahrt({pos: V(0.05, 2.6, 0.4), ziel: V(0, 0, 0.02)}, {pos: V(0.05, 2.9, 0.42), ziel: V(0, 0, -0.08)}, d)(f);
      const a = projiziere3D([0, 0.1, 0.02], k);
      const b = projiziere3D([pin[0], 0.1, pin[1]], k);
      return (
        <AbsoluteFill>
          <HandyBuehne kamera={k} pin={pin} geist={ein(f, 25, 10)} puls={0} />
          {drift > 0.95 ? <Mass von={a} bis={b} text="10 km" ab={0} versatz={-40} /> : null}
        </AbsoluteFill>
      );
    },
    ton: [['kAnstieg', 30, 0.3], ['vScan', 100, 0.35]],
  },
  // P8 · Uhren vor dem Start zurück, Loop
  {
    von: 1460,
    bis: 1600,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      const k = fahrt({pos: V(2.4, 2.2, 8.2), ziel: V(0, 1.5, 0), fov: 38}, {pos: V(1.6, 2.0, 6.6), ziel: V(0, 1.5, 0), fov: 38}, d)(f);
      const zurueck = interpolate(f, [100, 125], [0, 1.6], {...clamp, easing: outQuint});
      const pfeil = ein(f, 92, 8) * (1 - ein(f, 132, 6));
      const m = projiziere3D([0, 2.4, 0], k);
      return (
        <AbsoluteFill>
          <WeltTunnel kamera={() => k} farbe="#FFD2B0">
            <Satellit3D position={[0, 1.5, 0]} s={1.4} durchsicht={t01(f, 10, 30)} uhr={f * 0.25 - zurueck * 4} blick={V(0, -5, 0)} />
          </WeltTunnel>
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: pfeil}}>
            <path d={`M ${m[0] + 170} ${m[1] + 140} A 220 220 0 0 0 ${m[0]} ${m[1]}`} fill="none" stroke={AKZENT} strokeWidth={14} strokeLinecap="round" />
            <path d={`M ${m[0] + 32} ${m[1] - 22} L ${m[0]} ${m[1]} L ${m[0] + 32} ${m[1] + 26}`} fill="none" stroke={AKZENT} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </AbsoluteFill>
      );
    },
    ton: [['vEinschlag', 0, 0.35], ['vScan', 10, 0.3], ['vServo', 98, 0.45]],
  },
  {
    von: 1600,
    bis: 1680,
    Bild: ({d}) => {
      const f = useCurrentFrame();
      return <HandyBuehne kamera={fahrt({pos: V(0.05, 2.5, 0.42), ziel: V(0, 0, 0.02)}, HANDY_START, d)(f)} ringeAb={[0, 12, 24]} puls={pulsSchleife(f, 40)} />;
    },
    ton: [['vVorbei', 0, 0.35], ['kLanden', 30, 0.4]],
  },
];

const GpsAnimation: React.FC = () => (
  <AbsoluteFill style={{background: '#05070D'}}>
    {E.map(({von, bis, Bild, ton = []}, i) => (
      <Sequence key={i} from={von} durationInFrames={bis - von} layout="none">
        <AbsoluteFill>
          <Bild d={bis - von} />
          {ton.map(([n, at, vol], k) => (
            <Sfx key={k} name={n} at={at} volume={vol ?? 0.4} />
          ))}
        </AbsoluteFill>
      </Sequence>
    ))}
    <UntertitelWort captions={WORTZEITEN} gross={['einziges', 'atomuhren', 'verspätung', 'du', 'schneller', 'zu']} />
  </AbsoluteFill>
);

export const gpsAnimation: Project[] = [{id: 'GPS-Animation', component: GpsAnimation, format: 'vertical', durationInFrames: GESAMT, ordner: 'Wissen'}];
