import React, {useMemo} from 'react';
import type {Caption} from '@remotion/captions';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CatmullRomCurve3, Quaternion, Vector3} from 'three';
import {Music} from '../../kit/Music';
import {SzeneBereit, useSzeneLaden} from '../../kit/Modell3D';
import {Sfx} from '../../kit/Stage';
import type {Project} from '../types';
import {AKZENT, HELL, clamp, outQuint} from './bausteine';
import {ErdeFoto, FotoLicht, FotoNach, FotoRenderer, SatellitFoto, Sterne} from './foto-3d';
import {Pin3D, vonGeo} from './gps-3d';
import {Hinweis, UntertitelWort} from './stil';
import untertitelJson from '../gps-kurz/untertitel.json';

/**
 * GPS-Kurzszene (13 s) im Foto-Look direkt in Remotion-3D (~0,25 s pro Bild statt 13–20 s in Blender):
 * nah über Europa mit Pin → hoch ins All → an einen GPS-Satelliten. Erde: NASA Earth Observatory (Blue Marble).
 * Stimme: Klon von Arman (Hörfreigabe nötig), Untertitel im Technik-Stil bei y 1430.
 */

const WORTZEITEN = untertitelJson as Caption[];
const DAUER = 390;

const R = 50;
const PIN = vonGeo(51, 10, R);
const N = PIN.clone().normalize();
const OST = new Vector3(0, 1, 0).cross(N).normalize();
const NORD = N.clone().cross(OST).normalize();
const H = R + 18;
const um = (basis: Vector3, n: number, o: number, no: number) => basis.clone().add(N.clone().multiplyScalar(n)).add(OST.clone().multiplyScalar(o)).add(NORD.clone().multiplyScalar(no));
const HAUPT = um(new Vector3(0, 0, 0), H, 13, 1.5);

const KAMERA = new CatmullRomCurve3([um(PIN, 46, -5, -9), um(PIN, 32, -3.5, -6), um(new Vector3(0, 0, 0), H + 12, 4, -11), um(HAUPT, 4.6, -8.5, -5.5)], false, 'centripetal');
const ZIEL = new CatmullRomCurve3([PIN.clone(), PIN.clone(), HAUPT.clone().sub(N.clone().multiplyScalar(9)), HAUPT.clone().add(N.clone().multiplyScalar(1.2))], false, 'centripetal');
const glatt = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

/** Antennenfeld (−y) zur Erdmitte drehen. */
const zurErde = (ort: Vector3): [number, number, number, number] => {
  const q = new Quaternion().setFromUnitVectors(new Vector3(0, -1, 0), ort.clone().negate().normalize());
  return [q.x, q.y, q.z, q.w];
};
const NEBEN = [[-9, 6], [16, -10], [30, 8], [-20, -14], [42, 2], [8, 18]].map(([a, b]) => um(new Vector3(0, 0, 0), H, a, b).normalize().multiplyScalar(H));

const Kamera: React.FC<{u: number}> = ({u}) => {
  const {camera} = useThree();
  const p = KAMERA.getPoint(u);
  const z = ZIEL.getPoint(u);
  camera.position.copy(p);
  camera.up.copy(N);
  camera.lookAt(z);
  return null;
};

const Szene: React.FC = () => {
  const f = useCurrentFrame();
  const handle = useSzeneLaden();
  // Aufstieg ab „Ohne ein einziges Signal“ (Frame ~110), Satellit ab „Denn über dir“ (~200)
  const u = interpolate(f, [0, 110, 230, DAUER - 1], [0, 1 / 3, 2 / 3, 1], {...clamp, easing: (x) => glatt(x)});
  const fokus = useMemo(() => ZIEL.getPoint(u).toArray() as [number, number, number], [u]);
  const puls = ((f % 30) + 30) % 30 / 30;
  const licht = um(new Vector3(0, 0, 0), 80, -55, -35).toArray() as [number, number, number];
  return (
    <ThreeCanvas width={1080} height={1920} gl={{preserveDrawingBuffer: true}} camera={{fov: 38, near: 0.05, far: 2000}}>
      <FotoRenderer />
      <Kamera u={u} />
      <FotoLicht staerke={0.5} />
      <directionalLight position={licht} intensity={2.6} color="#FFF2E2" />
      <ambientLight intensity={0.05} />
      <Sterne />
      <ErdeFoto R={R} />
      <Pin3D position={PIN.clone().add(N.clone().multiplyScalar(0.12))} normale={N} groesse={0.45} puls={puls} />
      <SatellitFoto position={HAUPT.toArray() as [number, number, number]} quaternion={zurErde(HAUPT)} />
      {NEBEN.map((p, i) => (
        <SatellitFoto key={i} position={p.toArray() as [number, number, number]} quaternion={zurErde(p)} />
      ))}
      <FotoNach fokus={fokus} unschaerfe={1.6} />
      <SzeneBereit handle={handle} />
    </ThreeCanvas>
  );
};

const GpsKurz: React.FC = () => {
  const f = useCurrentFrame();
  const zahl = interpolate(f, [306, 318], [0, 1], {...clamp, easing: outQuint});
  return (
    <AbsoluteFill style={{background: '#020308'}}>
      <Szene />
      <Audio src={staticFile('projekte/gps-kurz/voiceover.wav')} />
      <Music src="musik/technik.wav" volume={0.2} captions={WORTZEITEN} duckTo={0.35} />
      <Hinweis text="Illustration" top={150} />
      {zahl > 0 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 14, opacity: zahl, transform: `scale(${0.94 + 0.06 * zahl})`}}>
          <div style={{fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 150, letterSpacing: '-0.05em', color: HELL, textShadow: '0 4px 30px rgba(0,0,0,0.6)'}}>20.200</div>
          <div style={{fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 60, color: AKZENT}}>km</div>
        </div>
      ) : null}
      <UntertitelWort captions={WORTZEITEN} gross={['einziges']} />
      <Sfx name="kPop" at={18} volume={0.4} />
      <Sfx name="vEinschlag" at={116} volume={0.5} />
      <Sfx name="vVorbei" at={188} volume={0.45} />
      <Sfx name="kTick" at={245} volume={0.3} />
      <Sfx name="kTick" at={259} volume={0.3} />
      <Sfx name="kDing" at={306} volume={0.45} />
    </AbsoluteFill>
  );
};

export const gpsKurz: Project[] = [{id: 'GPS-Kurz', component: GpsKurz, format: 'vertical', durationInFrames: DAUER, ordner: 'Wissen'}];
