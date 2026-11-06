import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Kino, Studiolicht} from '../../kit/Kino3D';
import {Modell, SzeneBereit, useSzeneLaden} from '../../kit/Modell3D';
import {Sfx} from '../../kit/Stage';
import type {Project} from '../types';
import {AKZENT, Titel, Zaehler, clamp, pulsBei} from './bausteine';

/**
 * Probe: 3D-Welt aus Kenney-Modellen (CC0) im Denkwürfel-Look.
 * Fakt: 300 km/h ÷ 3,6 = 83,3 m/s – ein Schnellzug fährt in 1 Sekunde rund 83 Meter (eigene Rechnung).
 * Mechanik: Die rote Spur hinter dem Zugkopf wächst genau eine Sekunde lang = Strecke in 1 s.
 */

const DAUER = 150;
const MESS_AB = 30;
const MESS_BIS = MESS_AB + 30; // genau 1 Sekunde bei 30 fps
const ZUG = 'modelle/kenney/zug/';
const STADT = 'modelle/kenney/stadt/';

/** Zugkopf auf der Strecke (z), gleichmäßige Fahrt. */
const kopfZ = (f: number) => -6 + f * 0.25;

const Kamera: React.FC<{f: number}> = ({f}) => {
  const {camera} = useThree();
  const t = f / DAUER;
  camera.position.set(34 - t * 4, 26 - t * 3, 30 - t * 8);
  camera.lookAt(-1.5, 0.5, 2 + t * 6);
  return null;
};

const Zug: React.FC<{z: number}> = ({z}) => {
  // Kopf, drei Wagen, Kopf rückwärts
  const teile: Array<[string, number, number]> = [
    ['train-electric-bullet-a', 0, 0],
    ['train-electric-bullet-b', -2.75, 0],
    ['train-electric-bullet-c', -5.4, 0],
    ['train-electric-bullet-b', -8.05, 0],
    ['train-electric-bullet-a', -10.8, Math.PI],
  ];
  return (
    <group position={[0, 0.12, z]}>
      {teile.map(([name, dz, rot], i) => (
        <Modell key={i} src={`${ZUG}${name}.glb`} position={[0, 0, dz]} rotation={[0, rot, 0]} />
      ))}
    </group>
  );
};

const GLEIS = Array.from({length: 90}, (_, i) => i - 45);

const HAEUSER: Array<[string, number, number, number]> = [
  ['building-a', -4.2, -22, 0],
  ['building-c', -4.4, -17, 0],
  ['building-e', -4.2, -12, 0],
  ['building-b', -4.4, -7, 0],
  ['building-g', -4.2, -2, 0],
  ['building-d', -4.4, 3, 0],
  ['building-h', -4.2, 8, 0],
  ['building-f', -4.4, 13, 0],
  ['building-a', -4.2, 18, 0],
  ['building-c', -4.4, 23, 0],
];

const HOCHHAEUSER: Array<[string, number, number]> = [
  ['building-skyscraper-a', -10, -20],
  ['building-skyscraper-c', -11, -13],
  ['building-skyscraper-b', -10, -6],
  ['building-skyscraper-e', -11.5, 1],
  ['building-skyscraper-d', -10, 8],
  ['building-skyscraper-a', -11, 15],
  ['building-skyscraper-c', -10, 22],
];

const Baum: React.FC<{x: number; z: number; h: number}> = ({x, z, h}) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, 0.25 * h, 0]} castShadow>
      <cylinderGeometry args={[0.08, 0.1, 0.5 * h, 6]} />
      <meshStandardMaterial color="#5B4636" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.95 * h, 0]} castShadow>
      <coneGeometry args={[0.55 * h, 1.3 * h, 7]} />
      <meshStandardMaterial color="#3E7A5A" roughness={0.8} flatShading />
    </mesh>
  </group>
);

const Welt: React.FC<{f: number; handle: number}> = ({f, handle}) => {
  const kopf = kopfZ(f);
  const spurStart = kopfZ(MESS_AB);
  const spurEnde = Math.min(kopf, kopfZ(MESS_BIS));
  const spurLaenge = Math.max(0, spurEnde - spurStart);
  return (
    <>
      <Kamera f={f} />
      <fog attach="fog" args={['#26335A', 50, 110]} />
      <hemisphereLight args={['#B8C6FF', '#2A3048', 1.1]} />
      <directionalLight position={[10, 16, 8]} intensity={2.4} color="#FFE2C4" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={30} shadow-camera-bottom={-30} shadow-bias={-0.0005} />
      {/* Boden, Damm, Straße */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#4C6B5C" roughness={1} />
      </mesh>
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[2.6, 0.08, 120]} />
        <meshStandardMaterial color="#7B8296" roughness={0.95} />
      </mesh>
      <mesh position={[-2.7, 0.02, 0]} receiveShadow>
        <boxGeometry args={[1.8, 0.04, 120]} />
        <meshStandardMaterial color="#5E6475" roughness={0.9} />
      </mesh>
      {GLEIS.map((z) => (
        <Modell key={z} src={`${ZUG}track.glb`} position={[0, 0.08, z]} />
      ))}
      {/* Strecke in 1 Sekunde */}
      {spurLaenge > 0 ? (
        <mesh position={[0, 0.05, spurStart + spurLaenge / 2]}>
          <boxGeometry args={[3.2, 0.12, spurLaenge]} />
          <meshStandardMaterial color={AKZENT} emissive={AKZENT} emissiveIntensity={0.7} />
        </mesh>
      ) : null}
      {/* Start- und Zielpfosten der Messung */}
      {[spurStart, spurLaenge > 0 ? spurEnde : null].map((z, i) =>
        z === null ? null : (
          <mesh key={i} position={[1.9, 0.9, z]} castShadow>
            <boxGeometry args={[0.14, 1.8, 0.14]} />
            <meshStandardMaterial color={AKZENT} emissive={AKZENT} emissiveIntensity={0.6} />
          </mesh>
        ),
      )}
      <Zug z={kopf} />
      {HAEUSER.map(([n, x, z, r], i) => (
        <Modell key={`h${i}`} src={`${STADT}${n}.glb`} position={[x, 0, z]} rotation={[0, Math.PI / 2 + r, 0]} scale={2.6} />
      ))}
      {HOCHHAEUSER.map(([n, x, z], i) => (
        <Modell key={`s${i}`} src={`${STADT}${n}.glb`} position={[x, 0, z]} rotation={[0, Math.PI / 2, 0]} scale={3} />
      ))}
      {Array.from({length: 16}, (_, i) => (
        <Baum key={i} x={2.6 + (i % 3) * 0.9} z={-30 + i * 4 + (i % 2) * 1.3} h={0.9 + ((i * 7) % 5) * 0.12} />
      ))}
      <Studiolicht staerke={0.6} />
      <Kino bloom={0.6} schwelle={0.7} tiltShift={0.12} vignette={0.55} />
      <SzeneBereit handle={handle} />
    </>
  );
};

const ZugProbe: React.FC = () => {
  const f = useCurrentFrame();
  const handle = useSzeneLaden();
  const meter = 83 * interpolate(f, [MESS_AB, MESS_BIS], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #121A33 0%, #26335A 55%, #34446E 100%)'}}>
      <ThreeCanvas width={1080} height={1920} shadows camera={{fov: 30, position: [34, 26, 30], near: 0.1, far: 300}}>
        <Welt f={f} handle={handle} />
      </ThreeCanvas>
      {/* Lesbarkeit für Titel und Zähler */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(14,20,36,0.97) 0%, rgba(14,20,36,0.9) 13%, rgba(14,20,36,0.35) 24%, rgba(14,20,36,0) 32%, rgba(14,20,36,0) 58%, rgba(14,20,36,0.88) 78%)'}} />
      <Titel text={<>So weit fährt ein Schnellzug in <span style={{color: AKZENT}}>1 Sekunde</span></>} />
      <Zaehler wert={meter} einheit="Meter" label="bei 300 km/h" quelle="RECHNUNG: 300 KM/H ÷ 3,6 = 83,3 M/S" puls={pulsBei(f, MESS_BIS)} />
      <Sfx name="kWhoosh" at={0} volume={0.35} />
      <Sfx name="kAnstieg" at={MESS_AB} volume={0.25} />
      <Sfx name="kDing" at={MESS_BIS} volume={0.5} />
    </AbsoluteFill>
  );
};

export const zugProbe: Project[] = [{id: 'Zug-Probe-3D', component: ZugProbe, format: 'vertical', durationInFrames: DAUER, ordner: 'Wissen'}];
