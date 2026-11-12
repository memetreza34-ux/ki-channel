import React, {useMemo} from 'react';
import {RoundedBox} from '@react-three/drei';
import {geoEquirectangular, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
import type {GeometryCollection, Topology} from 'topojson-specification';
import {CanvasTexture, SRGBColorSpace, Vector3} from 'three';
import {AKZENT} from './bausteine';
import land from 'world-atlas/land-50m.json';
import {roentgen} from './technik-bausteine';

/**
 * 3D-Requisiten für GPS (und alles mit Erde, Satellit, Handy, Uhr). Stilisiert, aber mit Licht, Metall und Glas.
 * Maßstab: Erde R = 5 Einheiten. Positionen auf der Erde mit `vonGeo(lat, lon, r)`.
 */

const RAD = Math.PI / 180;
export const BLAU3D = '#8FB0FF';

/** Breite/Länge → Punkt auf einer Kugel mit Radius r (passend zur UV-Abbildung der SphereGeometry). */
export const vonGeo = (lat: number, lon: number, r: number) => {
  const th = (90 - lat) * RAD;
  const ph = (lon + 180) * RAD;
  return new Vector3(-Math.cos(ph) * Math.sin(th) * r, Math.cos(th) * r, Math.sin(ph) * Math.sin(th) * r);
};

/* ───────────── Erde ───────────── */

const useErdTextur = () =>
  useMemo(() => {
    const W = 4096;
    const H = 2048;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const x = c.getContext('2d')!;
    const meer = x.createLinearGradient(0, 0, 0, H);
    meer.addColorStop(0, '#0C1838');
    meer.addColorStop(0.5, '#132A5C');
    meer.addColorStop(1, '#0C1838');
    x.fillStyle = meer;
    x.fillRect(0, 0, W, H);
    x.strokeStyle = 'rgba(143,176,255,0.10)';
    x.lineWidth = 1.5;
    for (let lon = 0; lon <= 360; lon += 15) {
      x.beginPath();
      x.moveTo((lon / 360) * W, 0);
      x.lineTo((lon / 360) * W, H);
      x.stroke();
    }
    for (let lat = 0; lat <= 180; lat += 15) {
      x.beginPath();
      x.moveTo(0, (lat / 180) * H);
      x.lineTo(W, (lat / 180) * H);
      x.stroke();
    }
    const topo = land as unknown as Topology;
    const geo = feature(topo, topo.objects.land as GeometryCollection);
    const proj = geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2]);
    const pfad = geoPath(proj, x);
    x.beginPath();
    pfad(geo);
    x.fillStyle = '#3B5B95';
    x.fill();
    x.strokeStyle = '#A9C2FF';
    x.lineWidth = 2;
    x.stroke();
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);

const useWolken = () =>
  useMemo(() => {
    const W = 1024;
    const H = 512;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const x = c.getContext('2d')!;
    for (let i = 0; i < 260; i++) {
      const z = (n: number) => {
        const v = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
        return v - Math.floor(v);
      };
      const cx = z(1) * W;
      const cy = H * (0.15 + z(2) * 0.7);
      const r = 10 + z(3) ** 2 * 60;
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(235,242,255,0.55)');
      g.addColorStop(1, 'rgba(235,242,255,0)');
      x.fillStyle = g;
      x.beginPath();
      x.ellipse(cx, cy, r * 2.2, r, 0, 0, Math.PI * 2);
      x.fill();
    }
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);

/** Erde mit Kontinenten (Natural Earth 1:50 Mio.), Gradnetz, zarten Wolken und leuchtendem Atmosphärenrand. */
export const Erde3D: React.FC<{R?: number; drehung?: number; wolken?: number}> = ({R = 5, drehung = 0, wolken = 0}) => {
  const textur = useErdTextur();
  const wolkenTextur = useWolken();
  const rand = useMemo(() => roentgen('#6F9BFF', 1.6, 2.6), []);
  return (
    <group rotation={[0, drehung, 0]}>
      <mesh>
        <sphereGeometry args={[R, 128, 96]} />
        <meshStandardMaterial map={textur} roughness={0.85} metalness={0.05} emissive="#0A1430" emissiveIntensity={0.4} />
      </mesh>
      <mesh rotation={[0, wolken, 0]} scale={1.012}>
        <sphereGeometry args={[R, 96, 64]} />
        <meshStandardMaterial map={wolkenTextur} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh scale={1.035}>
        <sphereGeometry args={[R, 64, 48]} />
        <primitive object={rand} attach="material" />
      </mesh>
    </group>
  );
};

/** Leuchtender Standort auf der Erde (oder auf dem Handy): Punkt + pulsierender Ring. */
export const Pin3D: React.FC<{position: Vector3 | [number, number, number]; normale?: Vector3; groesse?: number; puls?: number}> = ({position, normale = new Vector3(0, 1, 0), groesse = 0.12, puls = 0}) => {
  const quat = useMemo(() => {
    const v = normale.clone().normalize();
    const q = new Vector3(0, 0, 1);
    const achse = q.clone().cross(v).normalize();
    const winkel = Math.acos(Math.min(1, Math.max(-1, q.dot(v))));
    return {achse, winkel};
  }, [normale]);
  return (
    <group position={position as [number, number, number]}>
      <mesh>
        <sphereGeometry args={[groesse, 24, 16]} />
        <meshStandardMaterial color={AKZENT} emissive={AKZENT} emissiveIntensity={3} />
      </mesh>
      <mesh quaternion={[...quat.achse.clone().multiplyScalar(Math.sin(quat.winkel / 2)).toArray(), Math.cos(quat.winkel / 2)] as [number, number, number, number]} scale={1 + puls * 2.5}>
        <ringGeometry args={[groesse * 1.8, groesse * 2.2, 48]} />
        <meshBasicMaterial color={AKZENT} transparent opacity={0.9 * (1 - puls)} />
      </mesh>
    </group>
  );
};

/* ───────────── Satellit ───────────── */

const usePanelTextur = () =>
  useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const x = c.getContext('2d')!;
    const g = x.createLinearGradient(0, 0, 256, 128);
    g.addColorStop(0, '#2E4FA8');
    g.addColorStop(1, '#14275E');
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 128);
    x.strokeStyle = '#0A1430';
    x.lineWidth = 4;
    for (let i = 0; i <= 8; i++) {
      x.beginPath();
      x.moveTo(i * 32, 0);
      x.lineTo(i * 32, 128);
      x.stroke();
    }
    for (let j = 0; j <= 4; j++) {
      x.beginPath();
      x.moveTo(0, j * 32);
      x.lineTo(256, j * 32);
      x.stroke();
    }
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);

const useFolie = () =>
  useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const x = c.getContext('2d')!;
    x.fillStyle = '#C99A3A';
    x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 90; i++) {
      const z = (n: number) => {
        const v = Math.sin(i * 91.7 + n * 13.1) * 43758.5453;
        return v - Math.floor(v);
      };
      x.fillStyle = z(4) > 0.5 ? 'rgba(255,230,160,0.35)' : 'rgba(90,60,10,0.35)';
      x.beginPath();
      x.moveTo(z(1) * 256, z(2) * 256);
      x.lineTo(z(3) * 256, z(5) * 256);
      x.lineTo(z(6) * 256, z(7) * 256);
      x.fill();
    }
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);

/**
 * GPS-Satellit (stilisiert nach Block IIF/III): Körper mit Goldfolie, weiße Radiatoren, Antennenfeld nach unten (−y),
 * zwei gegliederte Solarflügel an Auslegern. `durchsicht` 0–1 zeigt die Atomuhr innen (gekreuzte Leuchtringe, `uhr` dreht),
 * `leuchten` hebt ihn mit Akzentlicht hervor, `blick` dreht das Antennenfeld zu einem Punkt (z. B. zur Erde).
 */
export const Satellit3D: React.FC<{position?: Vector3 | [number, number, number]; s?: number; durchsicht?: number; uhr?: number; leuchten?: number; blick?: Vector3}> = ({position = [0, 0, 0], s = 1, durchsicht = 0, uhr = 0, leuchten = 0, blick}) => {
  const panel = usePanelTextur();
  const folie = useFolie();
  const xray = useMemo(() => roentgen(BLAU3D, 1.8, 2), []);
  const quat = useMemo(() => {
    if (!blick) return [0, 0, 0, 1] as [number, number, number, number];
    const p = position instanceof Vector3 ? position : new Vector3(...position);
    const d = blick.clone().sub(p).normalize();
    const unten = new Vector3(0, -1, 0);
    const achse = unten.clone().cross(d);
    const l = achse.length();
    if (l < 1e-6) return [0, 0, 0, 1] as [number, number, number, number];
    achse.divideScalar(l);
    const w = Math.acos(Math.min(1, Math.max(-1, unten.dot(d))));
    return [...achse.multiplyScalar(Math.sin(w / 2)).toArray(), Math.cos(w / 2)] as [number, number, number, number];
  }, [blick, position]);
  const deck = 1 - 0.9 * durchsicht;
  return (
    <group position={position as [number, number, number]} scale={s} quaternion={quat}>
      {/* Körper mit Goldfolie */}
      <mesh>
        <boxGeometry args={[0.7, 0.8, 0.7]} />
        <meshStandardMaterial map={folie} color="#FFE2A0" metalness={0.75} roughness={0.38} emissive={AKZENT} emissiveIntensity={leuchten * 0.35} transparent opacity={deck} depthWrite={durchsicht < 0.5} />
      </mesh>
      {/* Radiatoren an zwei Seiten */}
      {[-1, 1].map((sz) => (
        <mesh key={`r${sz}`} position={[0, 0.05, sz * 0.36]}>
          <boxGeometry args={[0.6, 0.55, 0.02]} />
          <meshStandardMaterial color="#EEF1F6" metalness={0.2} roughness={0.5} transparent opacity={deck} />
        </mesh>
      ))}
      {durchsicht > 0 ? (
        <mesh scale={1.01}>
          <boxGeometry args={[0.7, 0.8, 0.7]} />
          <primitive object={xray} attach="material" />
        </mesh>
      ) : null}
      {/* Atomuhr: zwei gekreuzte Leuchtringe um einen pulsierenden Kern */}
      <group visible={durchsicht > 0.05} rotation={[uhr * 0.5, uhr, 0]}>
        <mesh>
          <torusGeometry args={[0.22, 0.025, 12, 48]} />
          <meshStandardMaterial color={AKZENT} emissive={AKZENT} emissiveIntensity={3 * durchsicht} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.025, 12, 48]} />
          <meshStandardMaterial color={AKZENT} emissive={AKZENT} emissiveIntensity={3 * durchsicht} />
        </mesh>
      </group>
      <mesh visible={durchsicht > 0.05} scale={0.85 + 0.15 * Math.sin(uhr * 4)}>
        <sphereGeometry args={[0.09, 20, 14]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={3 * durchsicht} />
      </mesh>
      {/* Antennenfeld nach unten: Platte mit 12 Wendelantennen */}
      <mesh position={[0, -0.42, 0]}>
        <boxGeometry args={[0.62, 0.04, 0.62]} />
        <meshStandardMaterial color="#DDE2EC" metalness={0.6} roughness={0.35} />
      </mesh>
      {Array.from({length: 12}, (_, i) => {
        const w = (i / 12) * Math.PI * 2;
        const r = i % 2 ? 0.2 : 0.12;
        return (
          <mesh key={`a${i}`} position={[Math.cos(w) * r, -0.52, Math.sin(w) * r]}>
            <cylinderGeometry args={[0.025, 0.025, 0.16, 10]} />
            <meshStandardMaterial color="#F6F7FA" metalness={0.3} roughness={0.4} />
          </mesh>
        );
      })}
      {/* Solarflügel: Ausleger, Joch, drei Paneele je Seite */}
      {[-1, 1].map((sx) => (
        <group key={sx}>
          <mesh position={[sx * 0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.022, 0.022, 0.5, 8]} />
            <meshStandardMaterial color="#C9CFDD" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[sx * 0.88, 0, 0]}>
            <boxGeometry args={[0.05, 0.05, 0.7]} />
            <meshStandardMaterial color="#C9CFDD" metalness={0.9} roughness={0.3} />
          </mesh>
          {[0, 1, 2].map((k) => (
            <mesh key={k} position={[sx * (1.2 + k * 0.62), 0, 0]}>
              <boxGeometry args={[0.58, 0.025, 0.95]} />
              <meshStandardMaterial map={panel} metalness={0.55} roughness={0.22} emissive="#1A2E6E" emissiveIntensity={0.25} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

/* ───────────── Handy ───────────── */

const useBildschirm = () =>
  useMemo(() => {
    const W = 512;
    const H = 1040;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const x = c.getContext('2d')!;
    x.fillStyle = '#1E2B52';
    x.fillRect(0, 0, W, H);
    x.lineCap = 'round';
    const strasse = (pts: Array<[number, number]>, b: number, farbe: string) => {
      x.strokeStyle = farbe;
      x.lineWidth = b;
      x.beginPath();
      pts.forEach(([px, py], i) => (i ? x.lineTo(px, py) : x.moveTo(px, py)));
      x.stroke();
    };
    // Fluss, Park, Häuserblöcke, Straßen, Hauptstraßen
    strasse([[-20, 300], [140, 380], [260, 330], [420, 420], [540, 380]], 46, '#2F64B0');
    x.fillStyle = '#2E6B57';
    x.fillRect(300, 620, 170, 150);
    x.fillStyle = '#2A3A68';
    for (let i = 0; i < 40; i++) x.fillRect(20 + ((i * 97) % 470), 20 + ((i * 173) % 1000), 60, 46);
    for (let i = 0; i < 10; i++) strasse([[-20, 60 + i * 110], [W + 20, 30 + i * 110 + (i % 2) * 30]], 9, '#3E5A9E');
    for (let i = 0; i < 6; i++) strasse([[40 + i * 95, -20], [70 + i * 95, H + 20]], 9, '#3E5A9E');
    strasse([[-20, 560], [W + 20, 500]], 18, '#6A88D0');
    strasse([[190, -20], [240, H + 20]], 18, '#6A88D0');
    strasse([[60, H - 40], [160, 760], [230, 600], [256, 528]], 14, '#FF6B4ACC');
    x.fillStyle = '#05080F';
    x.fillRect(W / 2 - 70, 24, 140, 36);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);

/**
 * Handy aus Titan und Glas, liegt flach (Bildschirm nach +y): Rahmen, Glasplatte mit Klarlack-Spiegelung,
 * Kartenbildschirm, Kameramodul auf der Rückseite, Tasten. `pin` = Pin-Versatz auf dem Bildschirm (x, z in Einheiten),
 * `geist` zeigt den echten Ort als Ring, `puls` 0–1 pulsiert den Pin.
 */
export const Handy3D: React.FC<{puls?: number; pin?: [number, number]; geist?: number}> = ({puls = 0, pin = [0, 0.02], geist = 0}) => {
  const bild = useBildschirm();
  return (
    <group>
      <RoundedBox args={[0.78, 0.08, 1.6]} radius={0.038} smoothness={6} position={[0, 0.04, 0]} castShadow>
        <meshPhysicalMaterial color="#4A505E" metalness={0.95} roughness={0.22} clearcoat={0.6} />
      </RoundedBox>
      {/* Tasten an der Seite */}
      {[[-0.3, 0.16], [-0.1, 0.12]].map(([z, l], i) => (
        <mesh key={i} position={[-0.395, 0.045, z]}>
          <boxGeometry args={[0.012, 0.03, l]} />
          <meshStandardMaterial color="#5A6070" metalness={0.95} roughness={0.25} />
        </mesh>
      ))}
      <mesh position={[0.395, 0.045, -0.2]}>
        <boxGeometry args={[0.012, 0.03, 0.22]} />
        <meshStandardMaterial color="#5A6070" metalness={0.95} roughness={0.25} />
      </mesh>
      {/* Kameramodul unten */}
      <group position={[0.18, -0.012, -0.52]}>
        <RoundedBox args={[0.3, 0.02, 0.3]} radius={0.009} smoothness={4}>
          <meshPhysicalMaterial color="#3A3F4B" metalness={0.8} roughness={0.3} clearcoat={1} />
        </RoundedBox>
        {[[-0.07, -0.07], [0.07, -0.07], [-0.07, 0.07]].map(([x, z], i) => (
          <mesh key={i} position={[x, -0.012, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.012, 24]} />
            <meshPhysicalMaterial color="#0A0C12" metalness={0.5} roughness={0.05} clearcoat={1} />
          </mesh>
        ))}
      </group>
      {/* Bildschirm und Glas */}
      <mesh position={[0, 0.0815, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.72, 1.54]} />
        <meshStandardMaterial map={bild} emissiveMap={bild} emissive="#FFFFFF" emissiveIntensity={1.1} roughness={0.5} />
      </mesh>
      {geist > 0 ? (
        <mesh position={[0, 0.088, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.05, 0.065, 40]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={geist} />
        </mesh>
      ) : null}
      <Pin3D position={[pin[0], 0.1, pin[1]]} normale={new Vector3(0, 1, 0)} groesse={0.035} puls={puls} />
    </group>
  );
};

/* ───────────── Uhr ───────────── */

/** Wanduhr aus Metall: Zifferblatt, 12 Striche, Sekundenzeiger (`winkel` rad). `akzent` färbt Rand und Zeiger. */
export const Uhr3D: React.FC<{position?: [number, number, number]; winkel: number; akzent?: boolean; r?: number}> = ({position = [0, 0, 0], winkel, akzent = false, r = 1}) => {
  const farbe = akzent ? AKZENT : BLAU3D;
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r, r, 0.12, 64]} />
        <meshStandardMaterial color="#1A2140" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <torusGeometry args={[r, 0.06, 16, 64]} />
        <meshStandardMaterial color={farbe} emissive={farbe} emissiveIntensity={1.6} metalness={0.6} roughness={0.3} />
      </mesh>
      {Array.from({length: 12}, (_, i) => {
        const w = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(w) * r * 0.82, Math.cos(w) * r * 0.82, 0.07]} rotation={[0, 0, -w]}>
            <boxGeometry args={[0.04, i % 3 === 0 ? 0.18 : 0.1, 0.02]} />
            <meshStandardMaterial color="#F3EFE7" emissive="#F3EFE7" emissiveIntensity={0.6} />
          </mesh>
        );
      })}
      <mesh position={[0, 0, 0.09]} rotation={[0, 0, -winkel]}>
        <boxGeometry args={[0.05, r * 1.5, 0.02]} />
        <meshStandardMaterial color={farbe} emissive={farbe} emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.07, 0.07, 0.04, 24]} />
        <meshStandardMaterial color={farbe} emissive={farbe} emissiveIntensity={2} />
      </mesh>
    </group>
  );
};
