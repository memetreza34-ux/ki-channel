import React, {useMemo} from 'react';
import {RoundedBox} from '@react-three/drei';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CanvasTexture, SRGBColorSpace, Vector3} from 'three';
import {SzeneBereit, useSzeneLaden} from '../../kit/Modell3D';
import type {Project} from '../types';
import {AKZENT} from './bausteine';
import {TitelStart, UntertitelSatz, probeZeiten} from './stil';

/**
 * Stilprobe GPS im schraffuren-Stil: ein Held (Handy) isometrisch auf ruhigem Dunkelblau, flache Farben,
 * kleine Satelliten darüber, Signale als gestrichelte Linien. Kein Fotolook, kein Weltall.
 */

const GRUND = '#1C2645';
const WEISS = '#EEF0F5';
const HELLGRAU = '#C9CFDC';
const BLAU = '#5B7FD6';

const Kamera: React.FC = () => {
  const {camera} = useThree();
  camera.position.set(10, 11, 10);
  camera.lookAt(0, 1.9, 0);
  camera.updateProjectionMatrix();
  return null;
};

const useKarte = () =>
  useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 400;
    c.height = 820;
    const x = c.getContext('2d')!;
    x.fillStyle = '#E7EBF2';
    x.fillRect(0, 0, 400, 820);
    x.fillStyle = '#CFE3C8';
    x.fillRect(230, 470, 120, 110);
    x.strokeStyle = '#9EC2EA';
    x.lineWidth = 34;
    x.beginPath();
    x.moveTo(-20, 230);
    x.bezierCurveTo(120, 300, 220, 180, 420, 290);
    x.stroke();
    x.strokeStyle = '#FFFFFF';
    x.lineWidth = 16;
    for (let i = 0; i < 7; i++) {
      x.beginPath();
      x.moveTo(-10, 60 + i * 120);
      x.lineTo(410, 40 + i * 120);
      x.stroke();
    }
    for (let i = 0; i < 4; i++) {
      x.beginPath();
      x.moveTo(50 + i * 110, -10);
      x.lineTo(70 + i * 110, 830);
      x.stroke();
    }
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);

const Handy: React.FC = () => {
  const karte = useKarte();
  return (
    <group>
      <RoundedBox args={[2.2, 0.22, 4.4]} radius={0.1} smoothness={4} position={[0, 0.11, 0]}>
        <meshStandardMaterial color={HELLGRAU} roughness={0.9} />
      </RoundedBox>
      <mesh position={[0, 0.226, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 4.2]} />
        <meshBasicMaterial map={karte} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.235, -1.95]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.12]} />
        <meshBasicMaterial color="#2A3352" />
      </mesh>
      {/* Pin */}
      <mesh position={[0, 0.55, 0.1]}>
        <sphereGeometry args={[0.2, 32, 16]} />
        <meshStandardMaterial color={AKZENT} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.36, 0.1]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.13, 0.3, 24]} />
        <meshStandardMaterial color={AKZENT} roughness={0.6} />
      </mesh>
    </group>
  );
};

const Satellit: React.FC<{position: [number, number, number]}> = ({position}) => (
  <group position={position} rotation={[0, Math.PI / 4, 0]}>
    <RoundedBox args={[0.5, 0.5, 0.5]} radius={0.05} smoothness={3}>
      <meshStandardMaterial color={WEISS} roughness={0.9} />
    </RoundedBox>
    {[-1, 1].map((s) => (
      <group key={s}>
        <mesh position={[s * 0.42, 0, 0]}>
          <boxGeometry args={[0.34, 0.04, 0.04]} />
          <meshStandardMaterial color={HELLGRAU} roughness={0.9} />
        </mesh>
        <mesh position={[s * 0.95, 0, 0]}>
          <boxGeometry args={[0.75, 0.04, 0.42]} />
          <meshStandardMaterial color={BLAU} roughness={0.8} />
        </mesh>
      </group>
    ))}
  </group>
);

const Strich: React.FC<{von: [number, number, number]; nach: [number, number, number]}> = ({von, nach}) => {
  const a = new Vector3(...von);
  const b = new Vector3(...nach);
  const teile = 14;
  return (
    <>
      {Array.from({length: teile}, (_, i) => {
        const p = a.clone().lerp(b, (i + 0.5) / teile);
        return (
          <mesh key={i} position={p.toArray() as [number, number, number]}>
            <sphereGeometry args={[0.045, 10, 8]} />
            <meshBasicMaterial color={AKZENT} toneMapped={false} />
          </mesh>
        );
      })}
    </>
  );
};

const SATS: Array<[number, number, number]> = [
  [-2.8, 5.0, -1.6],
  [2.6, 5.4, -2.4],
  [-0.6, 4.6, 2.8],
];

const GpsStilprobe: React.FC = () => {
  useCurrentFrame();
  const handle = useSzeneLaden();
  return (
    <AbsoluteFill style={{background: `radial-gradient(90% 70% at 50% 50%, #26325A 0%, ${GRUND} 70%)`}}>
      <ThreeCanvas width={1080} height={1920} orthographic camera={{position: [10, 11, 10], zoom: 120, near: -100, far: 200}}>
        <Kamera />
        <hemisphereLight args={['#FFFFFF', '#5A6488', 1.6]} />
        <directionalLight position={[4, 10, 6]} intensity={1.6} />
        <Handy />
        {SATS.map((p, i) => (
          <React.Fragment key={i}>
            <Satellit position={p} />
            <Strich von={[p[0], p[1] - 0.35, p[2]]} nach={[0, 0.8, 0.1]} />
          </React.Fragment>
        ))}
        <SzeneBereit handle={handle} />
      </ThreeCanvas>
      <TitelStart text={<>So findet dich <span style={{color: AKZENT}}>dein Handy</span></>} bis={999} />
      <UntertitelSatz captions={probeZeiten('Ohne ein einziges Signal ins All zu schicken.', 0)} top={1380} />
    </AbsoluteFill>
  );
};

export const gpsStilprobe: Project[] = [{id: 'GPS-Stilprobe', component: GpsStilprobe, format: 'vertical', durationInFrames: 60, ordner: 'Wissen'}];
