import React, {useMemo} from 'react';
import {Environment, RoundedBox} from '@react-three/drei';
import {useLoader, useThree} from '@react-three/fiber';
import {Bloom, DepthOfField, EffectComposer, Vignette} from '@react-three/postprocessing';
import {staticFile} from 'remotion';
import {AgXToneMapping, BufferGeometry, CanvasTexture, Float32BufferAttribute, RepeatWrapping, SRGBColorSpace, TextureLoader, Vector2} from 'three';
import {roentgen} from './technik-bausteine';

/**
 * Foto-Look für Remotion-3D (statt Blender, ~1 s pro Bild): echte NASA-Erdtextur, HDR-Studiolicht für Spiegelungen,
 * Materialien mit Knitter-/Rauheitskarten, Tiefenunschärfe, AgX-Farbwiedergabe, leichtes Filmkorn.
 * Assets: public/projekte/gps-kurz/erde.jpg (NASA Earth Observatory, Credit nennen), studio.hdr (Poly Haven, CC0).
 */

const ERDE = 'projekte/gps-kurz/erde.jpg';
const HDR = 'projekte/gps-kurz/studio.hdr';

/* ───────────── Renderer: filmische Farbwiedergabe ───────────── */

export const FotoRenderer: React.FC<{belichtung?: number}> = ({belichtung = 1}) => {
  const {gl} = useThree();
  gl.toneMapping = AgXToneMapping;
  gl.toneMappingExposure = belichtung;
  return null;
};

/** HDR-Studio nur für Spiegelungen (Hintergrund bleibt Weltraum). */
export const FotoLicht: React.FC<{staerke?: number}> = ({staerke = 0.6}) => <Environment files={staticFile(HDR)} background={false} environmentIntensity={staerke} />;

/** Nachbearbeitung: Tiefenunschärfe auf `fokus` (Weltpunkt), Leuchten, Vignette, Korn. */
export const FotoNach: React.FC<{fokus?: [number, number, number]; unschaerfe?: number}> = ({fokus = [0, 0, 0], unschaerfe = 3}) => (
  <EffectComposer multisampling={4}>
    <DepthOfField target={fokus} focalLength={0.03} bokehScale={unschaerfe} height={960} />
    <Bloom intensity={0.6} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur />
    <Vignette offset={0.3} darkness={0.55} />
  </EffectComposer>
);

/* ───────────── Sterne ───────────── */

export const Sterne: React.FC<{anzahl?: number; radius?: number}> = ({anzahl = 1600, radius = 400}) => {
  const geo = useMemo(() => {
    const g = new BufferGeometry();
    const p: number[] = [];
    for (let i = 0; i < anzahl; i++) {
      const z = (n: number) => {
        const v = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
        return v - Math.floor(v);
      };
      const u = z(1) * 2 - 1;
      const w = z(2) * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      p.push(Math.cos(w) * s * radius, u * radius, Math.sin(w) * s * radius);
    }
    g.setAttribute('position', new Float32BufferAttribute(p, 3));
    return g;
  }, [anzahl, radius]);
  return (
    <points geometry={geo}>
      <pointsMaterial color="#E8ECFF" size={1} sizeAttenuation={false} transparent opacity={0.55} toneMapped={false} />
    </points>
  );
};

/* ───────────── Erde ───────────── */

export const ErdeFoto: React.FC<{R?: number; position?: [number, number, number]; drehung?: [number, number, number]}> = ({R = 50, position = [0, 0, 0], drehung = [0, 0, 0]}) => {
  const tex = useLoader(TextureLoader, staticFile(ERDE));
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 16;
  const rand = useMemo(() => roentgen('#5C8DFF', 1.3, 3.2), []);
  return (
    <group position={position} rotation={drehung}>
      <mesh>
        <sphereGeometry args={[R, 192, 128]} />
        <meshStandardMaterial map={tex} roughness={0.62} metalness={0} />
      </mesh>
      <mesh scale={1.018}>
        <sphereGeometry args={[R, 128, 96]} />
        <primitive object={rand} attach="material" />
      </mesh>
    </group>
  );
};

/* ───────────── Prozedurale Karten (Knitterfolie, Solarzellen) ───────────── */

const rauschen = (W: number, H: number, saat: number) => {
  const gitter = (gx: number, gy: number, s: number) => {
    const v = Math.sin(gx * 127.1 + gy * 311.7 + s * 74.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const out = new Float32Array(W * H);
  for (const [skala, gewicht] of [[6, 0.55], [13, 0.45]] as Array<[number, number]>) {
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const fx = (x / W) * skala;
        const fy = (y / H) * skala;
        const ix = Math.floor(fx);
        const iy = Math.floor(fy);
        const tx = fx - ix;
        const ty = fy - iy;
        const sx = tx * tx * (3 - 2 * tx);
        const sy = ty * ty * (3 - 2 * ty);
        const a = gitter(ix % skala, iy % skala, saat);
        const b = gitter((ix + 1) % skala, iy % skala, saat);
        const c = gitter(ix % skala, (iy + 1) % skala, saat);
        const d = gitter((ix + 1) % skala, (iy + 1) % skala, saat);
        const v = a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
        // Knitter: scharfe Grate durch Betrag
        out[y * W + x] += Math.abs(v * 2 - 1) * gewicht;
      }
  }
  return out;
};

const useFolienKarten = () =>
  useMemo(() => {
    const W = 512;
    const H = 512;
    const h = rauschen(W, H, 3);
    const farbe = document.createElement('canvas');
    const normal = document.createElement('canvas');
    const rau = document.createElement('canvas');
    for (const c of [farbe, normal, rau]) {
      c.width = W;
      c.height = H;
    }
    const fc = farbe.getContext('2d')!.createImageData(W, H);
    const nc = normal.getContext('2d')!.createImageData(W, H);
    const rc = rau.getContext('2d')!.createImageData(W, H);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        const v = h[i];
        const dx = h[y * W + ((x + 1) % W)] - h[y * W + ((x - 1 + W) % W)];
        const dy = h[((y + 1) % H) * W + x] - h[((y - 1 + H) % H) * W + x];
        const k = i * 4;
        const st = 9;
        const nx = -dx * st;
        const ny = -dy * st;
        const l = Math.hypot(nx, ny, 1);
        nc.data[k] = (nx / l * 0.5 + 0.5) * 255;
        nc.data[k + 1] = (ny / l * 0.5 + 0.5) * 255;
        nc.data[k + 2] = (1 / l * 0.5 + 0.5) * 255;
        nc.data[k + 3] = 255;
        fc.data[k] = 150 + v * 105;
        fc.data[k + 1] = 92 + v * 110;
        fc.data[k + 2] = 22 + v * 60;
        fc.data[k + 3] = 255;
        const r = 70 + (1 - v) * 80;
        rc.data[k] = rc.data[k + 1] = rc.data[k + 2] = r;
        rc.data[k + 3] = 255;
      }
    farbe.getContext('2d')!.putImageData(fc, 0, 0);
    normal.getContext('2d')!.putImageData(nc, 0, 0);
    rau.getContext('2d')!.putImageData(rc, 0, 0);
    const mk = (c: HTMLCanvasElement, srgb: boolean) => {
      const t = new CanvasTexture(c);
      t.wrapS = t.wrapT = RepeatWrapping;
      if (srgb) t.colorSpace = SRGBColorSpace;
      return t;
    };
    return {farbe: mk(farbe, true), normal: mk(normal, false), rau: mk(rau, false)};
  }, []);

const useSolarKarte = () =>
  useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 1024;
    const x = c.getContext('2d')!;
    x.fillStyle = '#5E6675';
    x.fillRect(0, 0, 512, 1024);
    for (let i = 0; i < 8; i++)
      for (let j = 0; j < 16; j++) {
        const g = x.createLinearGradient(i * 64, j * 64, i * 64 + 64, j * 64 + 64);
        g.addColorStop(0, '#0B1640');
        g.addColorStop(1, '#13245C');
        x.fillStyle = g;
        x.fillRect(i * 64 + 2, j * 64 + 2, 60, 60);
        x.fillStyle = 'rgba(160,170,190,0.35)';
        for (let k = 1; k < 4; k++) x.fillRect(i * 64 + 2, j * 64 + 2 + k * 15, 60, 1);
      }
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 16;
    return t;
  }, []);

/* ───────────── Satellit im Foto-Look ───────────── */

/** GPS-Satellit (Block-IIF-Stil) mit Goldknitterfolie, Lamellen, Antennenfeld nach −y und Solarflügeln entlang x. */
export const SatellitFoto: React.FC<{position?: [number, number, number]; rotation?: [number, number, number]; quaternion?: [number, number, number, number]; s?: number}> = ({position = [0, 0, 0], rotation = [0, 0, 0], quaternion, s = 1}) => {
  const folie = useFolienKarten();
  const solar = useSolarKarte();
  const goldMat = (
    <meshPhysicalMaterial map={folie.farbe} normalMap={folie.normal} normalScale={new Vector2(0.45, 0.45)} roughnessMap={folie.rau} roughness={1} metalness={1} />
  );
  return (
    <group position={position} {...(quaternion ? {quaternion} : {rotation})} scale={s}>
      <RoundedBox args={[1.3, 1.3, 1.5]} radius={0.04} smoothness={4}>
        {goldMat}
      </RoundedBox>
      {[-1, 1].flatMap((sz) =>
        Array.from({length: 5}, (_, k) => (
          <RoundedBox key={`${sz}${k}`} args={[0.16, 0.9, 0.04]} radius={0.01} smoothness={2} position={[-0.44 + k * 0.22, 0.05, sz * 0.77]}>
            <meshStandardMaterial color="#B9BDC7" roughness={0.6} />
          </RoundedBox>
        )),
      )}
      <RoundedBox args={[1.15, 0.06, 1.15]} radius={0.01} smoothness={2} position={[0, -0.7, 0]}>
        <meshStandardMaterial color="#C9CDD6" metalness={1} roughness={0.25} />
      </RoundedBox>
      {Array.from({length: 12}, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r = i % 2 ? 0.4 : 0.24;
        return (
          <mesh key={i} position={[Math.cos(a) * r, -0.88, Math.sin(a) * r]}>
            <cylinderGeometry args={[0.05, 0.05, 0.32, 24]} />
            <meshStandardMaterial color="#EEF0F4" roughness={0.38} />
          </mesh>
        );
      })}
      {[-1, 1].map((sx) => (
        <group key={sx}>
          <mesh position={[sx * 1.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 16]} />
            <meshStandardMaterial color="#C9CDD6" metalness={1} roughness={0.22} />
          </mesh>
          <mesh position={[sx * 1.58, 0, 0]}>
            <boxGeometry args={[0.08, 0.08, 1.3]} />
            <meshStandardMaterial color="#C9CDD6" metalness={1} roughness={0.22} />
          </mesh>
          {[0, 1, 2].map((k) => (
            <RoundedBox key={k} args={[1.15, 0.04, 1.9]} radius={0.008} smoothness={2} position={[sx * (2.25 + k * 1.2), 0, 0]}>
              <meshStandardMaterial map={solar} metalness={0.2} roughness={0.42} envMapIntensity={0.35} />
            </RoundedBox>
          ))}
        </group>
      ))}
    </group>
  );
};
