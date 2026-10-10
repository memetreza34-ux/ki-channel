import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {pop} from './motion';
import {useTheme} from './themes';

export type Form3D = 'wuerfel' | 'kugel' | 'ring' | 'chip';

type Objekt3DProps = {
  form?: Form3D;
  /** Größe der Fläche in px (quadratisch). */
  size?: number;
  delay?: number;
  /** Umdrehungen pro 10 Sekunden. */
  speed?: number;
};

const Form: React.FC<{form: Form3D; accent: string; deep: string; light: string}> = ({form, accent, deep, light}) => {
  switch (form) {
    case 'wuerfel':
      return (
        <mesh>
          <boxGeometry args={[1.6, 1.6, 1.6]} />
          <meshStandardMaterial color={accent} roughness={0.35} metalness={0.15} />
        </mesh>
      );
    case 'kugel':
      return (
        <group>
          <mesh>
            <icosahedronGeometry args={[1.05, 1]} />
            <meshStandardMaterial color={deep} roughness={0.25} metalness={0.2} flatShading />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[1.45, 1]} />
            <meshBasicMaterial color={accent} wireframe transparent opacity={0.7} />
          </mesh>
        </group>
      );
    case 'ring':
      return (
        <mesh>
          <torusGeometry args={[1.05, 0.38, 32, 96]} />
          <meshStandardMaterial color={accent} roughness={0.3} metalness={0.25} />
        </mesh>
      );
    case 'chip':
      return (
        <group rotation={[0.5, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.9, 0.28, 1.9]} />
            <meshStandardMaterial color={deep} roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0.17, 0]}>
            <boxGeometry args={[1.1, 0.08, 1.1]} />
            <meshStandardMaterial color={accent} roughness={0.25} metalness={0.4} />
          </mesh>
          {Array.from({length: 6}, (_, i) =>
            [-1, 1].map((side) => (
              <React.Fragment key={`${i}-${side}`}>
                <mesh position={[-0.75 + i * 0.3, 0, side * 1.08]}>
                  <boxGeometry args={[0.12, 0.08, 0.3]} />
                  <meshStandardMaterial color={light} metalness={0.6} roughness={0.3} />
                </mesh>
                <mesh position={[side * 1.08, 0, -0.75 + i * 0.3]}>
                  <boxGeometry args={[0.3, 0.08, 0.12]} />
                  <meshStandardMaterial color={light} metalness={0.6} roughness={0.3} />
                </mesh>
              </React.Fragment>
            )),
          )}
        </group>
      );
  }
};

/** 3D-Objekt in Designfarben, das sich langsam dreht (Hero-Element, Hintergrund-Akzent). */
export const Objekt3D: React.FC<Objekt3DProps> = ({form = 'kugel', size: sizeProp = 600, delay = 0, speed = 1}) => {
  // ThreeCanvas verlangt ganze Pixel.
  const size = Math.round(sizeProp);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTheme();
  const s = pop(frame, fps, delay, 'snappy');
  // Gleichmäßige Drehung: Endlos-Bewegung.
  const rot = ((frame - delay) / (fps * 10)) * Math.PI * 2 * speed;
  return (
    <div style={{width: size, height: size, transform: `scale(${Math.max(0, s)})`, opacity: Math.min(1, Math.max(0, s * 2))}}>
      <ThreeCanvas width={size} height={size} camera={{position: [0, 0, 5], fov: 45}}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} />
        <directionalLight position={[-4, -2, 2]} intensity={0.5} color={t.c.accent} />
        <group rotation={[0.35 + Math.sin(rot * 0.5) * 0.1, rot, 0]}>
          <Form form={form} accent={t.c.accent} deep={t.c.accentDeep} light={t.c.line} />
        </group>
      </ThreeCanvas>
    </div>
  );
};
