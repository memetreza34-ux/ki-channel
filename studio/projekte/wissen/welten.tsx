import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Object3D} from 'three';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Kino, Studiolicht} from '../../kit/Kino3D';
import {Modell, SzeneBereit, useSzeneLaden} from '../../kit/Modell3D';
import {AKZENT, BG, HELL} from './bausteine';

/**
 * Welten = fertige Bühnen für Wissens-Shorts (Regelwerk 2026-11-08, Skill `wissens-short`).
 * Jede Welt füllt das ganze Bild; der Held kommt als `children` hinein.
 * SVG-Welten: Held als normales HTML/SVG darüber. 3D-Welten: Held als three.js-Knoten (mesh, Modell …).
 * Kamera der 3D-Welten: `kamera(f)` → {pos, ziel, fov?/zoom?}. Ohne Angabe ruhige Standardfahrt.
 */

export type Kamera3D = {pos: [number, number, number]; ziel: [number, number, number]; fov?: number; zoom?: number};

const KameraFuehrung: React.FC<{k: Kamera3D}> = ({k}) => {
  const {camera} = useThree();
  camera.position.set(...k.pos);
  if (k.fov && 'fov' in camera) (camera as unknown as {fov: number}).fov = k.fov;
  if (k.zoom && 'zoom' in camera) camera.zoom = k.zoom;
  camera.lookAt(...k.ziel);
  camera.updateProjectionMatrix();
  return null;
};

/* ───────────── deterministische Zufallszahlen ───────────── */

const zufall = (i: number, n: number) => {
  const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ══════════════ SVG-Welten ══════════════ */

const STERNE = Array.from({length: 140}, (_, i) => ({x: zufall(i, 1) * 1080, y: zufall(i, 2) * 1920, r: 0.6 + zufall(i, 3) ** 3 * 2.8, p: zufall(i, 4) * 6.28, tiefe: zufall(i, 5)}));

/** All: Sternenhimmel mit Tiefe (Sterne driften je nach Tiefe unterschiedlich schnell), Nebelschimmer, Vignette. */
export const WeltAll: React.FC<{drift?: number; children?: React.ReactNode}> = ({drift = 0.15, children}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 80% at 50% 45%, #1A2752 0%, ${BG} 62%)`}}>
      <AbsoluteFill style={{background: 'radial-gradient(40% 25% at 70% 30%, rgba(120,90,200,0.12), transparent 70%), radial-gradient(35% 22% at 25% 70%, rgba(80,140,220,0.10), transparent 70%)'}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {STERNE.map((s, i) => {
          const y = (s.y + f * drift * (0.3 + s.tiefe)) % 1920;
          return <circle key={i} cx={s.x} cy={y} r={s.r} fill={HELL} opacity={(0.15 + 0.5 * s.tiefe) * (0.6 + 0.4 * Math.sin(f / 20 + s.p))} />;
        })}
      </svg>
      {children}
      <AbsoluteFill style={{background: 'radial-gradient(90% 70% at 50% 50%, transparent 55%, rgba(4,7,16,0.75) 100%)', pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

type ZimmerFarben = {wand: string; wandDunkel: string; licht: string; moebel: string; moebelKante: string; boden: string; pflanze: string};
const ZIMMER: Record<'buero' | 'kind' | 'abend', ZimmerFarben> = {
  buero: {wand: '#4F6E6E', wandDunkel: '#3A5555', licht: '#F4E3B5', moebel: '#8A5A3C', moebelKante: '#6E4630', boden: '#5C4636', pflanze: '#5E9C6A'},
  kind: {wand: '#E3B24E', wandDunkel: '#C9962F', licht: '#FFF1C9', moebel: '#5878A8', moebelKante: '#43608C', boden: '#B07A48', pflanze: '#6FAE6B'},
  abend: {wand: '#3D3F6E', wandDunkel: '#2C2D55', licht: '#FFD9A0', moebel: '#6B4A6E', moebelKante: '#523856', boden: '#2E2440', pflanze: '#4E8A73'},
};

/**
 * Zimmer (schraffuren-Art): warme Flach-Illustration – Wand, Lichtkegel hinter dem Held, Bild, Pflanze,
 * Möbel unten (Schreibtisch/Kommode). `stimmung` wechselt Farben (Büro, Kinderzimmer, Abend); `wechsel` 0–1 blendet
 * zur `naechste` Stimmung über (Raum verwandelt sich, Held bleibt).
 */
export const WeltZimmer: React.FC<{stimmung?: keyof typeof ZIMMER; naechste?: keyof typeof ZIMMER; wechsel?: number; children?: React.ReactNode}> = ({stimmung = 'buero', naechste, wechsel = 0, children}) => {
  const raum = (c: ZimmerFarben, opacity: number) => (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity}}>
      <defs>
        <radialGradient id={`licht-${c.wand}`} cx="50%" cy="42%" r="45%">
          <stop offset="0" stopColor={c.licht} stopOpacity="0.55" />
          <stop offset="0.6" stopColor={c.licht} stopOpacity="0.12" />
          <stop offset="1" stopColor={c.licht} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`wand-${c.wand}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.wandDunkel} />
          <stop offset="0.55" stopColor={c.wand} />
          <stop offset="1" stopColor={c.wandDunkel} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill={`url(#wand-${c.wand})`} />
      {/* Nische mit Lichtkegel */}
      <path d="M180 1240 L180 640 A360 360 0 0 1 900 640 L900 1240 Z" fill={c.wandDunkel} opacity={0.35} />
      <ellipse cx={540} cy={800} rx={520} ry={560} fill={`url(#licht-${c.wand})`} />
      {/* Bild an der Wand */}
      <g transform="rotate(-6 140 520)">
        <rect x={60} y={440} width={170} height={130} rx={6} fill="#F6EBD6" />
        <rect x={72} y={452} width={146} height={92} fill="#8EC5D6" />
        <path d="M72 544 L130 500 L170 530 L218 490 L218 544 Z" fill="#E8C27A" />
      </g>
      {/* Pflanze */}
      <path d="M118 1150 C 60 1050, 70 980, 130 1010 C 120 950, 170 930, 175 1000 C 210 950, 250 990, 200 1060 C 240 1040, 250 1100, 190 1150 Z" fill={c.pflanze} />
      <path d="M110 1150 L210 1150 L198 1240 L122 1240 Z" fill="#C8754A" />
      {/* Möbel unten */}
      <rect x={-20} y={1240} width={1120} height={40} rx={8} fill={c.moebelKante} />
      <rect x={0} y={1270} width={1080} height={260} fill={c.moebel} />
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <rect x={60 + k * 330} y={1300} width={300} height={90} rx={10} fill={c.moebelKante} opacity={0.5} />
          <rect x={185 + k * 330} y={1338} width={50} height={14} rx={7} fill="#E9D7B4" />
        </g>
      ))}
      <rect x={0} y={1530} width={1080} height={390} fill={c.boden} />
    </svg>
  );
  const a = ZIMMER[stimmung];
  const b = naechste ? ZIMMER[naechste] : null;
  return (
    <AbsoluteFill style={{background: a.wand}}>
      {raum(a, 1)}
      {b && wechsel > 0 ? raum(b, wechsel) : null}
      {children}
      <AbsoluteFill style={{background: 'radial-gradient(95% 75% at 50% 45%, transparent 60%, rgba(10,8,6,0.35) 100%)', pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

/* ══════════════ 3D-Welten ══════════════ */

/** Hülle für alle 3D-Welten: Canvas, Kamera, Kino-Look, Laden abwarten. */
export const Buehne3D: React.FC<{hintergrund: string; kamera: Kamera3D; orthografisch?: boolean; kino?: React.ComponentProps<typeof Kino>; children: React.ReactNode}> = ({hintergrund, kamera, orthografisch = false, kino, children}) => {
  const handle = useSzeneLaden();
  return (
    <AbsoluteFill style={{background: hintergrund}}>
      <ThreeCanvas width={1080} height={1920} shadows orthographic={orthografisch} camera={orthografisch ? {position: kamera.pos, zoom: kamera.zoom ?? 40, near: -200, far: 400} : {position: kamera.pos, fov: kamera.fov ?? 35, near: 0.1, far: 400}}>
        <KameraFuehrung k={kamera} />
        {children}
        <Kino {...kino} />
        <SzeneBereit handle={handle} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

const STADT = 'modelle/kenney/stadt/';
const AUTO = 'modelle/kenney/auto/';
const NATUR = 'modelle/kenney/natur/';
const MOEBEL = 'modelle/kenney/moebel/';
const BAUMARTEN = ['tree_oak', 'tree_default', 'tree_detailed', 'tree_fat'];

const INSEL_BAEUME = Array.from({length: 46}, (_, i) => {
  const w = zufall(i, 7) * Math.PI * 2;
  const r = 5.2 + zufall(i, 8) * 7;
  return {x: Math.cos(w) * r, z: Math.sin(w) * r, s: 1.3 + zufall(i, 9) * 0.7, art: BAUMARTEN[Math.floor(zufall(i, 10) * BAUMARTEN.length)], rot: zufall(i, 11) * 6.28};
}).filter((b) => (Math.abs(b.x) > 1.8 || Math.abs(b.z) > 1.8) && Math.hypot(b.x + 6.5, b.z - 5.5) > 2.8);

const INSEL_DEKO: Array<[string, number, number, number]> = [
  ['plant_bushLarge', 3.6, 1.2, 1.6],
  ['plant_bush', -3.4, -1.6, 1.6],
  ['plant_bushSmall', 2.2, -3.6, 1.6],
  ['flower_redA', 3.3, -1.4, 1.8],
  ['flower_yellowA', -2.6, 3.1, 1.8],
  ['flower_purpleA', 1.4, 3.6, 1.8],
  ['rock_largeA', -8.6, 4.2, 1.4],
  ['rock_smallA', -4.8, 6.9, 1.6],
  ['lily_large', -6.2, 5.2, 1.6],
  ['grass_large', -2.2, -3.4, 1.8],
  ['grass', 4.1, 3.2, 1.8],
];

/**
 * Insel (schraffuren-Art): isometrisches Diorama – Park mit Wegen, Bäumen, Teich und Häusern am Rand,
 * weiches Sonnenlicht. Der Held steht in der Mitte (Ursprung, ca. 3 × 3 Einheiten Platz).
 * Orthografische Kamera wie bei einem Modell auf dem Tisch; `kamera` ändert Zoom und Blickpunkt.
 */
export const WeltInsel: React.FC<{kamera?: (f: number) => Kamera3D; haeuser?: boolean; children?: React.ReactNode}> = ({kamera, haeuser = true, children}) => {
  const f = useCurrentFrame();
  const k = kamera ? kamera(f) : {pos: [20, 22, 20] as [number, number, number], ziel: [0, 0.5, 0] as [number, number, number], zoom: 62 + f * 0.04};
  return (
    <Buehne3D hintergrund="#CFE3B0" kamera={k} orthografisch kino={{bloom: 0.25, schwelle: 0.9, tiltShift: 0.08, vignette: 0.35}}>
      <hemisphereLight args={['#FFF6E0', '#7FA36A', 1.2]} />
      <directionalLight position={[12, 20, 6]} intensity={2.2} color="#FFE9C8" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} shadow-bias={-0.0004} />
      {/* Rasen bis über den Bildrand */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#86B86A" roughness={1} />
      </mesh>
      {/* Wege */}
      {[
        [0, 0, 1.4, 30],
        [0, 0, 30, 1.4],
      ].map(([x, z, w, d], i) => (
        <mesh key={i} position={[x, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[w, d]} />
          <meshStandardMaterial color="#EAD9B4" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.2, 40]} />
        <meshStandardMaterial color="#EAD9B4" roughness={1} />
      </mesh>
      {/* Teich */}
      <mesh position={[-6.5, 0.02, 5.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 40]} />
        <meshStandardMaterial color="#6FB7D9" roughness={0.2} metalness={0.1} />
      </mesh>
      {INSEL_BAEUME.map((b, i) => (
        <Modell key={i} src={`${NATUR}${b.art}.glb`} position={[b.x, 0, b.z]} rotation={[0, b.rot, 0]} scale={b.s} />
      ))}
      {INSEL_DEKO.map(([n, x, z, s], i) => (
        <Modell key={`d${i}`} src={`${NATUR}${n}.glb`} position={[x, 0.01, z]} rotation={[0, i * 1.3, 0]} scale={s} />
      ))}
      {haeuser
        ? (
            [
              ['building-a', -12, -9, 0],
              ['building-c', -9, -12, Math.PI / 2],
              ['building-e', 12, -9, Math.PI],
              ['building-b', 9, -12, Math.PI / 2],
              ['building-g', 12, 9, Math.PI],
              ['building-d', -12, 9, 0],
            ] as Array<[string, number, number, number]>
          ).map(([n, x, z, r], i) => <Modell key={i} src={`${STADT}${n}.glb`} position={[x, 0, z]} rotation={[0, r, 0]} scale={2.4} />)
        : null}
      {children}
    </Buehne3D>
  );
};

/**
 * Tunnel (scroll.engineer-Art): dunkler Studio-Tunnel mit Lichtleisten an Decke und Wänden, spiegelnder Boden.
 * Für ein Gerät oder Bauteil groß in der Mitte (Ursprung, Boden bei y = 0). `farbe` = Leuchtfarbe der Leisten.
 */
export const WeltTunnel: React.FC<{kamera?: (f: number) => Kamera3D; farbe?: string; children?: React.ReactNode}> = ({kamera, farbe = '#DCE6FF', children}) => {
  const f = useCurrentFrame();
  const k = kamera ? kamera(f) : {pos: [4.5 - f * 0.01, 1.6, 7 - f * 0.012] as [number, number, number], ziel: [0, 0.8, 0] as [number, number, number], fov: 38};
  const B = 9;
  const H = 5;
  const L = 80;
  return (
    <Buehne3D hintergrund="#05070C" kamera={k} kino={{bloom: 1.1, schwelle: 0.6, vignette: 0.6}}>
      <fog attach="fog" args={['#05070C', 10, 45]} />
      <ambientLight intensity={0.15} />
      <spotLight position={[0, H - 0.3, 3]} angle={0.7} penumbra={0.8} intensity={60} color="#FFFFFF" castShadow />
      <pointLight position={[2, 2.5, 5]} intensity={18} color="#FFF4EA" />
      {/* Boden spiegelnd, Wände und Decke dunkel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[B, L]} />
        <meshStandardMaterial color="#0C0F16" metalness={0.85} roughness={0.22} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * B) / 2, H / 2, 0]} rotation={[0, (-s * Math.PI) / 2, 0]}>
          <planeGeometry args={[L, H]} />
          <meshStandardMaterial color="#090B11" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[B, L]} />
        <meshStandardMaterial color="#07090E" roughness={0.7} />
      </mesh>
      {/* Lichtleisten der Länge nach (Deckenkanten, Mitte) und Querrippen */}
      {[-B / 2 + 0.3, -1.2, 1.2, B / 2 - 0.3].map((x, i) => (
        <mesh key={`l${i}`} position={[x, H - 0.05, 0]}>
          <boxGeometry args={[0.12, 0.04, L]} />
          <meshStandardMaterial color={farbe} emissive={farbe} emissiveIntensity={4} />
        </mesh>
      ))}
      {Array.from({length: 16}, (_, i) => (
        <mesh key={`q${i}`} position={[0, H - 0.06, -30 + i * 4]}>
          <boxGeometry args={[B, 0.03, 0.06]} />
          <meshStandardMaterial color={farbe} emissive={farbe} emissiveIntensity={2} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`w${s}`} position={[s * (B / 2 - 0.02), 0.25, 0]}>
          <boxGeometry args={[0.04, 0.05, L]} />
          <meshStandardMaterial color={farbe} emissive={farbe} emissiveIntensity={1.4} />
        </mesh>
      ))}
      <Studiolicht staerke={0.5} />
      {children}
    </Buehne3D>
  );
};

/**
 * Nachtstraße (scroll.engineer-Art): Landstraße bei Nacht mit Leitlinien, Randlinien, Leitplanke, Laternen
 * und Nebel. `tempo` = Einheiten pro Frame, die die Kamera vorwärts fährt; `auto` zeigt ein stilisiertes Auto
 * mit Scheinwerferkegeln vor der Kamera (für Licht-/Verkehrsthemen).
 */
export const WeltNachtstrasse: React.FC<{kamera?: (f: number) => Kamera3D; tempo?: number; auto?: boolean; children?: React.ReactNode}> = ({kamera, tempo = 0.25, auto = true, children}) => {
  const f = useCurrentFrame();
  const z = -f * tempo;
  const k = kamera ? kamera(f) : {pos: [3.8, 6.2, z + 21] as [number, number, number], ziel: [0.8, 0.2, z - 14] as [number, number, number], fov: 38};
  const abschnitt = Math.floor(z / 6) * 6;
  const striche = Array.from({length: 30}, (_, i) => abschnitt + 12 - i * 6);
  const laternen = Array.from({length: 8}, (_, i) => Math.floor(z / 24) * 24 + 24 - i * 24);
  return (
    <Buehne3D hintergrund="#070A12" kamera={k} kino={{bloom: 1.2, schwelle: 0.5, vignette: 0.65}}>
      <fog attach="fog" args={['#0B1020', 12, 90]} />
      <hemisphereLight args={['#2A3558', '#05070C', 0.35]} />
      {/* Gelände und Fahrbahn */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, z]}>
        <planeGeometry args={[200, 400]} />
        <meshStandardMaterial color="#0B0E15" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, z]} receiveShadow>
        <planeGeometry args={[7.5, 400]} />
        <meshStandardMaterial color="#1A1D25" roughness={0.75} metalness={0.15} />
      </mesh>
      {[-3.5, 3.5].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, z]}>
          <planeGeometry args={[0.14, 400]} />
          <meshStandardMaterial color="#D9DEE8" emissive="#D9DEE8" emissiveIntensity={0.25} />
        </mesh>
      ))}
      {striche.map((zz) => (
        <mesh key={zz} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, zz]}>
          <planeGeometry args={[0.14, 3]} />
          <meshStandardMaterial color="#D9DEE8" emissive="#D9DEE8" emissiveIntensity={0.25} />
        </mesh>
      ))}
      {/* Leitplanke rechts */}
      <mesh position={[4.6, 0.55, z]}>
        <boxGeometry args={[0.08, 0.25, 400]} />
        <meshStandardMaterial color="#8C93A3" metalness={0.8} roughness={0.35} />
      </mesh>
      {/* Laternen links mit Lichtkegel auf der Fahrbahn */}
      {laternen.map((zz) => (
        <group key={zz} position={[-4.8, 0, zz]}>
          <mesh position={[0, 3.2, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 6.4, 8]} />
            <meshStandardMaterial color="#3A3F4C" />
          </mesh>
          <mesh position={[0.8, 6.3, 0]}>
            <boxGeometry args={[1.4, 0.12, 0.3]} />
            <meshStandardMaterial color="#FFE7B8" emissive="#FFD58A" emissiveIntensity={3} />
          </mesh>
          <mesh position={[2, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[3.2, 32]} />
            <meshBasicMaterial color="#FFD58A" transparent opacity={0.035} />
          </mesh>
        </group>
      ))}
      {/* Hügel-Silhouetten */}
      {[-60, -20, 25, 70].map((x, i) => (
        <mesh key={x} position={[x, -6, z - 150]} scale={[40 + i * 6, 14 + (i % 2) * 6, 10]}>
          <sphereGeometry args={[1, 16, 8]} />
          <meshStandardMaterial color="#0D1220" />
        </mesh>
      ))}
      {auto ? <AutoStilisiert z={z} /> : null}
      <Studiolicht staerke={0.25} />
      {children}
    </Buehne3D>
  );
};

const ScheinwerferLicht: React.FC = () => {
  const ziel = React.useMemo(() => new Object3D(), []);
  return (
    <>
      <primitive object={ziel} position={[0, 0, -16]} />
      <spotLight position={[0, 0.8, -2.3]} angle={0.42} penumbra={0.9} intensity={140} distance={45} decay={1.2} color="#EEF3FF" target={ziel} />
    </>
  );
};

/**
 * Auto (Kenney Car Kit, CC0) mit Scheinwerfern, Rücklichtern und Lichtkegel. Fährt Richtung −z.
 * `modell`: sedan, suv, suv-luxury, sedan-sports, hatchback-sports, taxi, van, truck, delivery, ambulance, police.
 */
export const AutoStilisiert: React.FC<{z: number; x?: number; modell?: string; licht?: boolean}> = ({z, x = 1.6, modell = 'sedan', licht = true}) => {
  const S = 1.65;
  return (
    <group position={[x, 0, z]}>
      <Modell src={`${AUTO}${modell}.glb`} rotation={[0, Math.PI, 0]} scale={S} />
      {licht
        ? [-0.42, 0.42].map((dx) => (
            <group key={dx}>
              <mesh position={[dx * S, 0.42 * S, -1.29 * S]}>
                <boxGeometry args={[0.26 * S, 0.07 * S, 0.02]} />
                <meshStandardMaterial color="#FFFFFF" emissive="#F2F6FF" emissiveIntensity={5} />
              </mesh>
              <mesh position={[dx * S, 0.45 * S, 1.26 * S]}>
                <boxGeometry args={[0.28 * S, 0.06 * S, 0.02]} />
                <meshStandardMaterial color={AKZENT} emissive={AKZENT} emissiveIntensity={3} />
              </mesh>
            </group>
          ))
        : null}
      {licht ? <ScheinwerferLicht /> : null}
    </group>
  );
};

const WALD = Array.from({length: 70}, (_, i) => {
  const x = -26 + zufall(i, 21) * 52;
  const z = -34 + zufall(i, 22) * 22;
  return {x, z, s: 2.2 + zufall(i, 23) * 1.6, art: zufall(i, 24) > 0.35 ? 'tree_pineRoundA' : zufall(i, 25) > 0.5 ? 'tree_pineDefaultA' : 'tree_cone', rot: zufall(i, 26) * 6.28};
}).filter((b) => Math.abs(b.x) > 3 || b.z < -16);

/**
 * Landschaft (Natur, Biologie, Geografie): Waldrand am Abend, Wiese, Felsen, Zelt mit Lagerfeuer,
 * warmes Gegenlicht und Dunst. Der Held steht vorn in der Mitte (Ursprung). `tageszeit` 0 = Abend, 1 = Tag.
 */
export const WeltLandschaft: React.FC<{kamera?: (f: number) => Kamera3D; tageszeit?: number; feuer?: boolean; children?: React.ReactNode}> = ({kamera, tageszeit = 0, feuer = true, children}) => {
  const f = useCurrentFrame();
  const k = kamera ? kamera(f) : {pos: [6 - f * 0.01, 3.4, 12 - f * 0.015] as [number, number, number], ziel: [0, 1, -2] as [number, number, number], fov: 40};
  const himmel = tageszeit > 0.5 ? 'linear-gradient(180deg, #8EC3E8 0%, #CFE6F2 60%, #E9F1E4 100%)' : 'linear-gradient(180deg, #2B3A66 0%, #C97A5A 62%, #F2B07A 100%)';
  const flackern = 0.85 + 0.15 * Math.sin(f * 0.9) * Math.sin(f * 0.37);
  return (
    <Buehne3D hintergrund={himmel} kamera={k} kino={{bloom: 0.7, schwelle: 0.75, vignette: 0.5}}>
      <fog attach="fog" args={[tageszeit > 0.5 ? '#CFE6F2' : '#B97A68', 14, 60]} />
      <hemisphereLight args={[tageszeit > 0.5 ? '#FFFFFF' : '#FFC8A0', '#3E5A3A', tageszeit > 0.5 ? 1.2 : 0.7]} />
      <directionalLight position={[-10, 8, -20]} intensity={tageszeit > 0.5 ? 2.2 : 1.6} color={tageszeit > 0.5 ? '#FFF6E6' : '#FFB070'} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color={tageszeit > 0.5 ? '#7FAE5E' : '#5E7E46'} roughness={1} />
      </mesh>
      {WALD.map((b, i) => (
        <Modell key={i} src={`${NATUR}${b.art}.glb`} position={[b.x, 0, b.z]} rotation={[0, b.rot, 0]} scale={b.s} />
      ))}
      <Modell src={`${NATUR}rock_largeA.glb`} position={[-4.5, 0, 1]} scale={2.4} rotation={[0, 0.6, 0]} />
      <Modell src={`${NATUR}stone_tallA.glb`} position={[5, 0, -3]} scale={2.6} />
      <Modell src={`${NATUR}log.glb`} position={[2.6, 0, 2.4]} scale={2} rotation={[0, 0.4, 0]} />
      <Modell src={`${NATUR}tent_detailedOpen.glb`} position={[-3.2, 0, -4]} scale={3} rotation={[0, 0.5, 0]} />
      {[['grass_large', 1.5, 4], ['grass', -1.8, 3.4], ['flower_yellowA', 3.4, 4.2], ['flower_redA', -3, 2.6], ['plant_bush', 6, 1.5], ['mushroom_red', -1.2, 5]].map(([n, x, z], i) => (
        <Modell key={`g${i}`} src={`${NATUR}${n}.glb`} position={[x as number, 0, z as number]} scale={2.2} rotation={[0, i, 0]} />
      ))}
      {feuer ? (
        <group position={[0.8, 0, -1.6]}>
          <Modell src={`${NATUR}campfire_logs.glb`} scale={2.2} />
          <mesh position={[0, 0.45, 0]}>
            <coneGeometry args={[0.28, 0.8 * flackern, 10]} />
            <meshStandardMaterial color="#FFB347" emissive="#FF7A1A" emissiveIntensity={4 * flackern} transparent opacity={0.9} />
          </mesh>
          <pointLight position={[0, 0.9, 0]} intensity={25 * flackern} distance={12} color="#FF9A40" castShadow />
        </group>
      ) : null}
      {children}
    </Buehne3D>
  );
};

/**
 * Zimmer 3D (schraffuren-Art als Diorama): aufgeschnittener Raum mit zwei Wänden (eine mit Fenster), Holzboden,
 * Schreibtisch mit Bildschirm, Sofa, Regal, Lampe, Teppich, Pflanze. Orthografische Kamera.
 * Der Held steht auf dem Teppich in der Mitte (Ursprung). `licht` 0 = Abendlampe, 1 = Tageslicht.
 */
export const WeltZimmer3D: React.FC<{kamera?: (f: number) => Kamera3D; licht?: number; wand?: string; children?: React.ReactNode}> = ({kamera, licht = 1, wand = '#E8D6B8', children}) => {
  const f = useCurrentFrame();
  const k = kamera ? kamera(f) : {pos: [14, 13, 14] as [number, number, number], ziel: [0, 1.2, 0] as [number, number, number], zoom: 150 + f * 0.08};
  const W = 6;
  return (
    <Buehne3D hintergrund="#2A2F3F" kamera={k} orthografisch kino={{bloom: 0.4, schwelle: 0.85, vignette: 0.45}}>
      <hemisphereLight args={['#FFF4E0', '#6A5A4A', 0.5 + 0.5 * licht]} />
      <directionalLight position={[-6, 9, 8]} intensity={1.4 + licht} color="#FFE8C8" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0004} />
      <pointLight position={[-2.2, 2.4, -1.6]} intensity={(1 - licht) * 14 + 2} distance={8} color="#FFC27A" />
      {/* Boden als Platte mit Kante, zwei Wände */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[W, 0.3, W]} />
        <meshStandardMaterial color="#B88A5E" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.6, -W / 2 - 0.1]} receiveShadow>
        <boxGeometry args={[W, 3.5, 0.2]} />
        <meshStandardMaterial color={wand} roughness={0.95} />
      </mesh>
      <mesh position={[-W / 2 - 0.1, 1.6, 0]} receiveShadow>
        <boxGeometry args={[0.2, 3.5, W + 0.4]} />
        <meshStandardMaterial color={wand} roughness={0.95} />
      </mesh>
      {/* Fenster in der linken Wand */}
      <mesh position={[-W / 2 + 0.01, 2, 0.6]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.8, 1.3]} />
        <meshStandardMaterial color="#BFE3F5" emissive="#BFE3F5" emissiveIntensity={0.4 + 0.6 * licht} />
      </mesh>
      <Modell src={`${MOEBEL}rugRound.glb`} position={[0, 0.01, 0.4]} scale={4} />
      <Modell src={`${MOEBEL}desk.glb`} position={[0.4, 0, -2.85]} scale={3} />
      <Modell src={`${MOEBEL}computerScreen.glb`} position={[0.9, 1.15, -2.7]} scale={2.6} />
      <Modell src={`${MOEBEL}chairDesk.glb`} position={[1.1, 0, -1.6]} scale={3} rotation={[0, Math.PI, 0]} />
      <Modell src={`${MOEBEL}bookcaseOpen.glb`} position={[-2.9, 0, -2.2]} scale={3} rotation={[0, Math.PI / 2, 0]} />
      <Modell src={`${MOEBEL}loungeSofa.glb`} position={[-2.8, 0, 1.4]} scale={3} rotation={[0, Math.PI / 2, 0]} />
      <Modell src={`${MOEBEL}lampRoundFloor.glb`} position={[-2.6, 0, -0.6]} scale={3} />
      <Modell src={`${MOEBEL}pottedPlant.glb`} position={[2.4, 0, -2.6]} scale={3} />
      <Modell src={`${MOEBEL}tableCoffee.glb`} position={[-1.4, 0, 1.6]} scale={3} rotation={[0, Math.PI / 2, 0]} />
      {children}
    </Buehne3D>
  );
};

/** Kleiner Held für Kataloge: Zahnrad aus Metall mit Kupferkern (stilisiert). */
export const Zahnrad3D: React.FC<{y?: number; winkel?: number; r?: number}> = ({y = 1.2, winkel = 0, r = 1}) => (
  <group position={[0, y, 0]} rotation={[Math.PI / 2, winkel, 0]}>
    <mesh castShadow>
      <cylinderGeometry args={[r, r, 0.35, 48]} />
      <meshStandardMaterial color="#D9DEE8" metalness={0.85} roughness={0.32} />
    </mesh>
    {Array.from({length: 24}, (_, i) => {
      const w = (i / 24) * Math.PI * 2;
      return (
        <mesh key={i} position={[Math.cos(w) * (r + 0.12), 0, Math.sin(w) * (r + 0.12)]} rotation={[0, -w, 0]} castShadow>
          <boxGeometry args={[0.2, 0.35, 0.16]} />
          <meshStandardMaterial color="#D9DEE8" metalness={0.85} roughness={0.32} />
        </mesh>
      );
    })}
    <mesh position={[0, 0.02, 0]}>
      <cylinderGeometry args={[r * 0.38, r * 0.38, 0.4, 32]} />
      <meshStandardMaterial color="#C8743A" metalness={0.9} roughness={0.3} emissive="#7A3A10" emissiveIntensity={0.25} />
    </mesh>
  </group>
);
