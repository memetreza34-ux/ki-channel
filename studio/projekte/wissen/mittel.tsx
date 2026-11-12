import React, {useMemo} from 'react';
import {RoundedBox} from '@react-three/drei';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill} from 'remotion';
import {CanvasTexture, OrthographicCamera, SRGBColorSpace, Vector3} from 'three';
import {SzeneBereit, useSzeneLaden} from '../../kit/Modell3D';
import {AKZENT} from './bausteine';

/**
 * „Mittelding“-Stil (Arman, 2026-11-11): schraffuren-Grundlook (isometrisch, matte Tonfigur-Materialien, weiche Schatten,
 * ruhiges Dunkelblau, eine Akzentfarbe) + scroll.engineer-Werkzeuge (Kamera ins Objekt, Explosionsansicht, Beschriftung
 * am Bauteil). Eine Bildsprache für Mechanik, Geschichte und Daten.
 */

export const M = {
  grund: '#1C2645',
  grundHell: '#28345E',
  weiss: '#ECEFF5',
  hell: '#C9D0DE',
  mittel: '#8E98B2',
  dunkel: '#3A4466',
  blau: '#5B7FD6',
  gruen: '#6FAF8C',
  akzent: AKZENT,
};

/** Matte „Tonfigur“-Oberfläche – Grundmaterial des Stils. */
export const Ton: React.FC<{farbe: string; leuchten?: number}> = ({farbe, leuchten = 0}) => <meshStandardMaterial color={farbe} roughness={0.85} metalness={0} emissive={farbe} emissiveIntensity={leuchten} />;

export type IsoKamera = {ziel: [number, number, number]; zoom: number; winkel?: number; hoehe?: number};

const KameraIso: React.FC<{k: IsoKamera}> = ({k}) => {
  const {camera} = useThree();
  const w = k.winkel ?? Math.PI / 4;
  const h = k.hoehe ?? 1.1;
  camera.position.set(k.ziel[0] + Math.sin(w) * 20, k.ziel[1] + h * 20, k.ziel[2] + Math.cos(w) * 20);
  camera.zoom = k.zoom;
  camera.lookAt(...k.ziel);
  camera.updateProjectionMatrix();
  return null;
};

/** Weltpunkt → Bildschirm-px für die isometrische Kamera (für Beschriftungen am Bauteil). */
export const projiziereIso = (punkt: [number, number, number], k: IsoKamera, breite = 1080, hoehe = 1920): [number, number] => {
  const cam = new OrthographicCamera(-breite / 2, breite / 2, hoehe / 2, -hoehe / 2, -200, 400);
  const w = k.winkel ?? Math.PI / 4;
  const h = k.hoehe ?? 1.1;
  cam.position.set(k.ziel[0] + Math.sin(w) * 20, k.ziel[1] + h * 20, k.ziel[2] + Math.cos(w) * 20);
  cam.zoom = k.zoom;
  cam.lookAt(...k.ziel);
  cam.updateMatrixWorld();
  cam.updateProjectionMatrix();
  const v = new Vector3(...punkt).project(cam);
  return [((v.x + 1) / 2) * breite, ((1 - v.y) / 2) * hoehe];
};

/** Bühne: Dunkelblau mit Licht in der Mitte, weiches Himmelslicht, eine Sonne mit weichem Schatten auf einem unsichtbaren Boden. */
export const MittelBuehne: React.FC<{kamera: IsoKamera; boden?: number; children: React.ReactNode}> = ({kamera, boden = 0, children}) => {
  const handle = useSzeneLaden();
  return (
    <AbsoluteFill style={{background: `radial-gradient(80% 55% at 50% 48%, ${M.grundHell} 0%, ${M.grund} 75%)`}}>
      <ThreeCanvas width={1080} height={1920} shadows orthographic camera={{zoom: kamera.zoom, near: -200, far: 400, position: [20, 22, 20]}}>
        <KameraIso k={kamera} />
        <hemisphereLight args={['#FFFFFF', '#56628A', 1.5]} />
        <directionalLight position={[5, 12, 7]} intensity={1.7} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-radius={8} shadow-bias={-0.0004} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, boden, 0]} receiveShadow>
          <planeGeometry args={[80, 80]} />
          <shadowMaterial opacity={0.28} />
        </mesh>
        {children}
        <SzeneBereit handle={handle} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

/* ───────────── Beschriftung am Bauteil (scroll.engineer-Werkzeug im Mittelding-Look) ───────────── */

export const Schild: React.FC<{punkt: [number, number]; text: string; richtung?: 'links' | 'rechts'; akzent?: boolean; laenge?: number}> = ({punkt, text, richtung = 'rechts', akzent = false, laenge = 170}) => {
  const [x, y] = punkt;
  const ex = richtung === 'rechts' ? x + laenge : x - laenge;
  const farbe = akzent ? M.akzent : M.weiss;
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}}>
        <circle cx={x} cy={y} r={9} fill={farbe} />
        <line x1={x} y1={y} x2={ex} y2={y} stroke={farbe} strokeWidth={3} />
      </svg>
      <div style={{position: 'absolute', top: y - 30, ...(richtung === 'rechts' ? {left: ex} : {right: 1080 - ex}), padding: '8px 18px', borderRadius: 30, background: akzent ? M.akzent : 'rgba(236,239,245,0.95)', color: akzent ? '#FFFFFF' : M.grund, fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 36, whiteSpace: 'nowrap'}}>{text}</div>
    </>
  );
};

/* ───────────── Handy im Mittelding-Look (auch auseinandergezogen) ───────────── */

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

/**
 * Handy (liegt flach, 2,2 × 4,4). `auseinander` 0–1 zieht die Schichten nach oben auseinander (Explosionsansicht):
 * Gehäuse → Platine mit GPS-Chip → Akku → Display. `pin` zeigt den Standort auf der Karte.
 */
export const HandyMittel: React.FC<{auseinander?: number; pin?: boolean; chipLeuchten?: number; pinVersatz?: [number, number]; geist?: number; pinHoehe?: number}> = ({auseinander = 0, pin = true, chipLeuchten = 0, pinVersatz = [0, 0.1], geist = 0, pinHoehe = 0}) => {
  const karte = useKarte();
  const a = auseinander;
  return (
    <group>
      {/* Gehäuse (Wanne) */}
      <RoundedBox args={[2.2, 0.18, 4.4]} radius={0.09} smoothness={4} position={[0, 0.09, 0]} castShadow receiveShadow>
        <Ton farbe={M.hell} />
      </RoundedBox>
      {/* Platine mit Chips */}
      <group position={[0, 0.2 + a * 1.3, 0]} visible={a > 0.02}>
        <RoundedBox args={[1.9, 0.06, 2.0]} radius={0.02} smoothness={2} position={[0, 0, -1.0]} castShadow receiveShadow>
          <Ton farbe={M.gruen} />
        </RoundedBox>
        {[[-0.5, -1.5, 0.5], [0.45, -0.6, 0.35], [-0.45, -0.55, 0.3]].map(([x, z, g], i) => (
          <RoundedBox key={i} args={[g, 0.08, g]} radius={0.02} smoothness={2} position={[x, 0.07, z]} castShadow>
            <Ton farbe={M.dunkel} />
          </RoundedBox>
        ))}
        {/* GPS-Empfänger */}
        <RoundedBox args={[0.42, 0.1, 0.42]} radius={0.03} smoothness={2} position={[0.45, 0.08, -1.55]} castShadow>
          <Ton farbe={M.akzent} leuchten={chipLeuchten} />
        </RoundedBox>
      </group>
      {/* Akku */}
      <RoundedBox args={[1.7, 0.12, 2.0]} radius={0.04} smoothness={2} position={[0, 0.22 + a * 1.3, 1.05]} visible={a > 0.02} castShadow receiveShadow>
        <Ton farbe={M.dunkel} />
      </RoundedBox>
      {/* Display */}
      <group position={[0, 0.2 + a * 2.9, 0]}>
        <RoundedBox args={[2.1, 0.06, 4.3]} radius={0.028} smoothness={3} castShadow receiveShadow>
          <Ton farbe={M.dunkel} />
        </RoundedBox>
        <mesh position={[0, 0.034, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.0, 4.2]} />
          <meshBasicMaterial map={karte} toneMapped={false} />
        </mesh>
        {geist > 0 ? (
          <mesh position={[0, 0.045, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.16, 0.22, 40]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={geist} toneMapped={false} />
          </mesh>
        ) : null}
        {pin ? (
          <group position={[pinVersatz[0], 0.04 + pinHoehe, pinVersatz[1]]}>
            <mesh position={[0, 0.32, 0]} castShadow>
              <sphereGeometry args={[0.2, 32, 16]} />
              <Ton farbe={M.akzent} />
            </mesh>
            <mesh position={[0, 0.13, 0]} rotation={[Math.PI, 0, 0]} castShadow>
              <coneGeometry args={[0.13, 0.3, 24]} />
              <Ton farbe={M.akzent} />
            </mesh>
          </group>
        ) : null}
      </group>
    </group>
  );
};

/** Satellit im Mittelding-Look: weißer Körper, blaue Flügel. */
export const SatellitMittel: React.FC<{position: [number, number, number]; s?: number; offen?: number; uhr?: number; leuchten?: number}> = ({position, s = 1, offen = 0, uhr = 0, leuchten = 0}) => (
  <group position={position} rotation={[0, Math.PI / 4, 0]} scale={s}>
    {offen > 0.01 ? (
      <>
        {[-1, 1].map((z) => (
          <RoundedBox key={z} args={[0.5, 0.5, 0.24]} radius={0.05} smoothness={3} position={[0, 0, z * (0.13 + offen * 0.35)]}>
            <Ton farbe={M.weiss} />
          </RoundedBox>
        ))}
        <group scale={0.32 * offen}>
          <UhrMittel winkel={uhr} akzent />
        </group>
      </>
    ) : (
      <RoundedBox args={[0.5, 0.5, 0.5]} radius={0.06} smoothness={3}>
        <Ton farbe={M.weiss} leuchten={leuchten} />
      </RoundedBox>
    )}
    {[-1, 1].map((x) => (
      <group key={x}>
        <mesh position={[x * 0.42, 0, 0]}>
          <boxGeometry args={[0.34, 0.04, 0.04]} />
          <Ton farbe={M.hell} />
        </mesh>
        <RoundedBox args={[0.75, 0.04, 0.42]} radius={0.01} smoothness={2} position={[x * 0.95, 0, 0]}>
          <Ton farbe={M.blau} />
        </RoundedBox>
      </group>
    ))}
  </group>
);

/** Uhr im Mittelding-Look (Zifferblatt zeigt zur Kamera). `winkel` = Zeiger in rad, `akzent` färbt Rand und Zeiger. */
export const UhrMittel: React.FC<{position?: [number, number, number]; winkel: number; akzent?: boolean; r?: number}> = ({position = [0, 0, 0], winkel, akzent = false, r = 1}) => {
  const farbe = akzent ? M.akzent : M.blau;
  return (
    <group position={position} rotation={[0, Math.PI / 4, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[r * 1.12, r * 1.12, 0.22, 64]} />
        <Ton farbe={farbe} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.06]}>
        <cylinderGeometry args={[r, r, 0.14, 64]} />
        <Ton farbe={M.weiss} />
      </mesh>
      {Array.from({length: 12}, (_, i) => {
        const w = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(w) * r * 0.8, Math.cos(w) * r * 0.8, 0.14]} rotation={[0, 0, -w]}>
            <boxGeometry args={[0.06, i % 3 === 0 ? 0.2 : 0.11, 0.02]} />
            <Ton farbe={M.dunkel} />
          </mesh>
        );
      })}
      <group position={[0, 0, 0.16]} rotation={[0, 0, -winkel]}>
        <mesh position={[0, r * 0.36, 0]}>
          <boxGeometry args={[0.08, r * 0.8, 0.03]} />
          <Ton farbe={farbe} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 24]} />
        <Ton farbe={M.dunkel} />
      </mesh>
    </group>
  );
};

/** Gestricheltes Signal (Punkte) von A nach B; `t` 0–1 lässt es vorwärts wachsen. */
export const Signal: React.FC<{von: [number, number, number]; nach: [number, number, number]; t?: number; teile?: number}> = ({von, nach, t = 1, teile = 14}) => {
  const a = new Vector3(...von);
  const b = new Vector3(...nach);
  return (
    <>
      {Array.from({length: teile}, (_, i) => {
        const u = (i + 0.5) / teile;
        if (u > t) return null;
        return (
          <mesh key={i} position={a.clone().lerp(b, u).toArray() as [number, number, number]}>
            <sphereGeometry args={[0.045, 10, 8]} />
            <meshBasicMaterial color={M.akzent} toneMapped={false} />
          </mesh>
        );
      })}
    </>
  );
};
