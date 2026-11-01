import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Sfx} from '../../kit/Stage';
import type {Project} from '../types';
import {AKZENT, BG, Titel, clamp, pulsBei, zahl} from './bausteine';
import {Callout, EckTag, MessPanel, projiziere3D, roentgen, type KameraStand} from './technik-bausteine';

/**
 * Probe Bildwelt „Technik“: Wie misst ein Fahrrad-Tacho das Tempo?
 * Mechanik (Reed-Sensor-Tacho): Ein Magnet an der Speiche läuft einmal pro Umdrehung am Sensor an der Gabel vorbei.
 * Tempo = Radumfang ÷ Zeit pro Umdrehung. Beispiel: 2,1 m ÷ 0,30 s = 7 m/s ≈ 25 km/h (eigene Rechnung, Umfang als Beispiel).
 * Gezeigt in Zeitlupe ×4: eine Umdrehung = 36 Frames statt 9.
 */

const DAUER = 180;
const UMDREHUNG = 36; // Frames, Zeitlupe ×4
const ERSTER = 60; // erster Durchgang am Sensor
const ZWEITER = ERSTER + UMDREHUNG;
const R_MAGNET = 1.6;

// Gabelbein von der Nabe schräg nach oben; Sensor sitzt darauf im Abstand R_MAGNET
const GABEL: [number, number] = [-0.6, 4.6];
const GABEL_WINKEL = Math.atan2(GABEL[0], GABEL[1]);
const gl = Math.hypot(...GABEL);
const SENSOR: [number, number, number] = [(GABEL[0] / gl) * R_MAGNET, (GABEL[1] / gl) * R_MAGNET, 0.42];

const radWinkel = (f: number) => GABEL_WINKEL + (2 * Math.PI * (f - ERSTER)) / UMDREHUNG;
const magnetPunkt = (f: number): [number, number, number] => {
  const t = radWinkel(f);
  return [R_MAGNET * Math.sin(t), R_MAGNET * Math.cos(t), 0.24];
};

const kamera = (f: number): KameraStand => {
  // Totale → ran an Sensor und Magnet → nach dem Ergebnis wieder etwas zurück
  const rein = interpolate(f, [0, 42], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const raus = interpolate(f, [128, 172], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const m = (a: number, b: number, c: number) => a + (b - a) * rein + (c - b) * raus;
  const schweben = Math.sin(f / 40) * 0.15;
  return {pos: [m(2.5, 3.4, 2.8) + schweben, m(0.4, 2.0, 0.9), m(27, 11, 17)], ziel: [m(0, -0.1, 0), m(-0.6, 0.8, 0.1), 0], fov: 32};
};

const Kamera: React.FC<{f: number}> = ({f}) => {
  const {camera} = useThree();
  const k = kamera(f);
  camera.position.set(...k.pos);
  camera.lookAt(...k.ziel);
  return null;
};

/** Puls am Sensor bei jedem Vorbeilauf des Magneten. */
const sensorPuls = (f: number) => {
  let p = 0;
  for (let d = ERSTER; d < DAUER; d += UMDREHUNG) p = Math.max(p, pulsBei(f, d));
  return p;
};

const Rad: React.FC<{f: number}> = ({f}) => {
  const reifen = useMemo(() => roentgen('#A9C2FF', 1.5, 2.0), []);
  const felge = useMemo(() => roentgen('#7F9BE0', 1.2, 1.6), []);
  const nabe = useMemo(() => roentgen('#C9D6FF', 1.2, 1.4), []);
  const gabelMat = useMemo(() => roentgen('#B4C4EE', 1.6, 1.4), []);
  const puls = sensorPuls(f);
  return (
    <>
      <Kamera f={f} />
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 6]} intensity={30} color="#FFD9C8" />
      {/* drehendes Rad */}
      <group rotation={[0, 0, -radWinkel(f)]}>
        <mesh material={reifen}>
          <torusGeometry args={[3.45, 0.24, 24, 120]} />
        </mesh>
        <mesh material={felge}>
          <torusGeometry args={[3.2, 0.09, 12, 120]} />
        </mesh>
        {Array.from({length: 24}, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.sin(a) * 1.6, Math.cos(a) * 1.6, 0]} rotation={[0, 0, -a]}>
              <cylinderGeometry args={[0.018, 0.018, 3.2, 6]} />
              <meshBasicMaterial color="#5E6E96" transparent opacity={0.55} />
            </mesh>
          );
        })}
        {/* Magnet an der Speiche (oben = Winkel 0) */}
        <mesh position={[0, R_MAGNET, 0.24]}>
          <boxGeometry args={[0.32, 0.22, 0.24]} />
          <meshStandardMaterial color={AKZENT} emissive={AKZENT} emissiveIntensity={0.8} />
        </mesh>
      </group>
      <mesh material={nabe} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.7, 24]} />
      </mesh>
      {/* Gabel: zwei Beine */}
      {[0.42, -0.42].map((z) => (
        <mesh key={z} material={gabelMat} position={[GABEL[0] / 2, GABEL[1] / 2, z]} rotation={[0, 0, -GABEL_WINKEL]}>
          <cylinderGeometry args={[0.11, 0.13, gl, 16]} />
        </mesh>
      ))}
      {/* Sensor am vorderen Gabelbein */}
      <mesh position={SENSOR} rotation={[0, 0, -GABEL_WINKEL]}>
        <boxGeometry args={[0.36, 0.5, 0.2]} />
        <meshStandardMaterial color="#DDE5FF" emissive={AKZENT} emissiveIntensity={0.15 + puls * 2.5} />
      </mesh>
      {puls > 0.02 ? (
        <mesh position={SENSOR}>
          <sphereGeometry args={[0.3 + puls * 0.3, 24, 16]} />
          <meshBasicMaterial color={AKZENT} transparent opacity={puls * 0.22} depthWrite={false} />
        </mesh>
      ) : null}
    </>
  );
};

const TachoProbe: React.FC = () => {
  const f = useCurrentFrame();
  const k = kamera(f);
  const sensorPx = projiziere3D(SENSOR, k);
  const magnetPx = projiziere3D(magnetPunkt(f), k);
  // Stoppuhr: läuft vom ersten bis zum zweiten Vorbeilauf (echte Zeit = Zeitlupe ÷ 4)
  const zeit = f < ERSTER ? 0 : Math.min(f, ZWEITER) - ERSTER;
  const sekunden = zeit / 30 / 4;
  const tempo = f >= ZWEITER ? 25 : null;
  const PULS = ZWEITER;
  return (
    <AbsoluteFill style={{background: `radial-gradient(1100px 900px at 50% 48%, #18244A 0%, ${BG} 70%)`}}>
      <ThreeCanvas width={1080} height={1920} camera={{fov: 32, position: kamera(0).pos, near: 0.1, far: 200}}>
        <Rad f={f} />
      </ThreeCanvas>
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${BG}F2 0%, ${BG}99 14%, ${BG}00 24%)`}} />
      <Titel text={<>So misst dein Tacho das <span style={{color: AKZENT}}>Tempo</span></>} />
      <EckTag texte={['Illustration', 'Zeitlupe ×4']} top={130} />
      <Callout punkt={sensorPx} text="Sensor" ab={36} versatz={[-170, -190]} />
      <Callout punkt={magnetPx} text="Magnet" ab={44} bis={104} versatz={[150, 130]} akzent />
      <MessPanel
        zeilen={[
          {label: 'Zeit pro Umdrehung', wert: `${zahl(sekunden, 2)} s`},
          {label: 'Radumfang (Beispiel)', wert: '2,1 m'},
          {label: 'Tempo', wert: tempo === null ? '–' : `${tempo} km/h`, akzent: true, puls: pulsBei(f, PULS)},
        ]}
      />
      <Sfx name="kWhoosh" at={0} volume={0.35} />
      {[ERSTER, ZWEITER, ZWEITER + UMDREHUNG].map((d) => (
        <Sfx key={d} name="kTick" at={d} volume={0.35} />
      ))}
      <Sfx name="kDing" at={PULS} volume={0.5} />
    </AbsoluteFill>
  );
};

export const tachoProbe: Project[] = [{id: 'Tacho-Probe-Technik', component: TachoProbe, format: 'vertical', durationInFrames: DAUER, ordner: 'Wissen'}];
