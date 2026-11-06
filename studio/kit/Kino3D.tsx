import React from 'react';
import {Environment, Lightformer} from '@react-three/drei';
import {Bloom, EffectComposer, TiltShift2, Vignette} from '@react-three/postprocessing';

/**
 * Kino-Look für <ThreeCanvas>-Szenen: Leuchten (Bloom), Miniatur-Unschärfe (Tilt-Shift), Vignette
 * und weiches Studiolicht für Spiegelungen – alles lokal, ohne HDR-Download.
 * Als letztes Kind in die Szene setzen (vor `SzeneBereit`).
 */
export const Kino: React.FC<{bloom?: number; schwelle?: number; tiltShift?: number; vignette?: number}> = ({bloom = 0.8, schwelle = 0.55, tiltShift = 0, vignette = 0.5}) => (
  <EffectComposer multisampling={4}>
    <Bloom intensity={bloom} luminanceThreshold={schwelle} luminanceSmoothing={0.2} mipmapBlur />
    {tiltShift > 0 ? <TiltShift2 blur={tiltShift} /> : <></>}
    <Vignette offset={0.3} darkness={vignette} />
  </EffectComposer>
);

/** Weiches Studiolicht (Umgebung für Spiegelungen auf Lack, Glas, Metall). */
export const Studiolicht: React.FC<{staerke?: number}> = ({staerke = 1}) => (
  <Environment resolution={256} frames={1}>
    <Lightformer intensity={2 * staerke} position={[0, 6, -8]} scale={[12, 4, 1]} />
    <Lightformer intensity={1.2 * staerke} position={[-8, 3, 4]} scale={[4, 6, 1]} rotation={[0, Math.PI / 2, 0]} color="#FFD9C8" />
    <Lightformer intensity={0.8 * staerke} position={[8, 2, 4]} scale={[4, 6, 1]} rotation={[0, -Math.PI / 2, 0]} color="#A9C2FF" />
  </Environment>
);
