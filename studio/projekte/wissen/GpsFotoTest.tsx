import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {SzeneBereit, useSzeneLaden} from '../../kit/Modell3D';
import type {Project} from '../types';
import {ErdeFoto, FotoLicht, FotoNach, FotoRenderer, SatellitFoto, Sterne} from './foto-3d';

/** Vergleichstest zum Blender-Bild (gps_test.py): gleiche Kamera, gleicher Aufbau, aber in Remotion-3D. */

const Kamera: React.FC<{f: number}> = ({f}) => {
  const {camera} = useThree();
  camera.position.set(4.6 - f * 0.004, 2.3 + f * 0.002, 7.4 - f * 0.006);
  camera.lookAt(0, -1.4, 0);
  return null;
};

const GpsFotoTest: React.FC = () => {
  const f = useCurrentFrame();
  const handle = useSzeneLaden();
  return (
    <AbsoluteFill style={{background: '#020308'}}>
      <ThreeCanvas width={1080} height={1920} camera={{fov: 50, near: 0.1, far: 2000, position: [4.6, 2.3, 7.4]}}>
        <FotoRenderer />
        <Kamera f={f} />
        <FotoLicht staerke={0.55} />
        <directionalLight position={[8, 6, 9]} intensity={2.4} color="#FFF2E2" />
        <spotLight position={[-5, 4, -6]} intensity={60} angle={0.6} penumbra={1} color="#8FB0FF" />
        <Sterne />
        <ErdeFoto R={50} position={[0, -62, 0]} drehung={[0, -0.6, 0]} />
        <SatellitFoto rotation={[0.14, 0.49 + f * 0.002, 0.24]} />
        <FotoNach fokus={[0, 0, 0]} unschaerfe={3} />
        <SzeneBereit handle={handle} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

export const gpsFotoTest: Project[] = [{id: 'GPS-Foto-Test', component: GpsFotoTest, format: 'vertical', durationInFrames: 90, ordner: 'Wissen'}];
