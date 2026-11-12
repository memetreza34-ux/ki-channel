import React, {useMemo} from 'react';
import {RoundedBox} from '@react-three/drei';
import {AbsoluteFill, Sequence} from 'remotion';
import {Shape} from 'three';
import type {Project} from '../types';
import {AKZENT} from './bausteine';
import deutschland from './deutschland.json';
import {HandyMittel, M, MittelBuehne, SatellitMittel, Schild, Signal, Ton, projiziereIso} from './mittel';
import type {IsoKamera} from './mittel';
import {QuelleKlein, TitelStart, UntertitelSatz, UntertitelWort, probeZeiten} from './stil';

/** Drei Stilbilder im „Mittelding“-Stil: Mechanik (Explosionsansicht), Geschichte (Handy + Satelliten), Daten (Karte). */

/* 1 · Mechanik: Handy auseinandergezogen, Beschriftung am Bauteil (scroll.engineer-Werkzeug) */
const MECH: IsoKamera = {ziel: [0, 1.7, 0], zoom: 125};
const Mechanik: React.FC = () => {
  const chip = projiziereIso([0.45, 1.58, -1.55], MECH);
  const akku = projiziereIso([-0.85, 1.52, 1.05], MECH);
  const display = projiziereIso([-1.05, 3.1, -0.6], MECH);
  return (
    <AbsoluteFill>
      <MittelBuehne kamera={MECH}>
        <HandyMittel auseinander={1} chipLeuchten={0.35} />
      </MittelBuehne>
      <Schild punkt={chip} text="GPS-Empfänger" akzent richtung="links" laenge={260} />
      <Schild punkt={akku} text="Akku" richtung="links" laenge={120} />
      <Schild punkt={display} text="Display" richtung="links" laenge={120} />
      <UntertitelWort captions={probeZeiten('Dieser Chip hört nur zu.', 0)} gross={['hört']} />
    </AbsoluteFill>
  );
};

/* 2 · Geschichte: Handy als Held, Satelliten senden (schraffuren-Grundlook) */
const SATS: Array<[number, number, number]> = [
  [-2.8, 5.0, -1.6],
  [2.6, 5.4, -2.4],
  [-0.6, 4.6, 2.8],
];
const Geschichte: React.FC = () => (
  <AbsoluteFill>
    <MittelBuehne kamera={{ziel: [0, 1.9, 0], zoom: 120}}>
      <HandyMittel />
      {SATS.map((p, i) => (
        <React.Fragment key={i}>
          <SatellitMittel position={p} />
          <Signal von={[p[0], p[1] - 0.35, p[2]]} nach={[0, 0.9, 0.1]} />
        </React.Fragment>
      ))}
    </MittelBuehne>
    <TitelStart text={<>So findet dich <span style={{color: AKZENT}}>dein Handy</span></>} bis={999} />
    <UntertitelSatz captions={probeZeiten('Ohne ein einziges Signal ins All.', 0)} top={1380} />
  </AbsoluteFill>
);

/* 3 · Daten: Deutschland als Relief, Säulen wachsen aus den Städten */
const K = 0.95;
const geo = (lon: number, lat: number): [number, number] => [(lon - 10.45) * 0.62 * K, (lat - 51.15) * K];
const STAEDTE: Array<[string, number, number, number]> = [
  ['Berlin', 52.52, 13.4, 2.6],
  ['Hamburg', 53.55, 10.0, 1.4],
  ['München', 48.14, 11.58, 1.1],
];
const DATEN: IsoKamera = {ziel: [0, 0.6, 0], zoom: 120};
const Daten: React.FC = () => {
  const formen = useMemo(
    () =>
      (deutschland as number[][][]).map((ring) => {
        const s = new Shape();
        ring.forEach(([lon, lat], i) => {
          const [x, y] = geo(lon, lat);
          if (i === 0) s.moveTo(x, y);
          else s.lineTo(x, y);
        });
        return s;
      }),
    [],
  );
  return (
    <AbsoluteFill>
      <MittelBuehne kamera={DATEN}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <extrudeGeometry args={[formen, {depth: 0.3, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2}]} />
          <Ton farbe={M.hell} />
        </mesh>
        {STAEDTE.map(([, lat, lon, h]) => {
          const [x, y] = geo(lon, lat);
          return (
            <RoundedBox key={lat} args={[0.32, h, 0.32]} radius={0.04} smoothness={2} position={[x, 0.33 + h / 2, -y]} castShadow>
              <Ton farbe={M.akzent} />
            </RoundedBox>
          );
        })}
      </MittelBuehne>
      {STAEDTE.map(([name, lat, lon, h], i) => {
        const [x, y] = geo(lon, lat);
        return <Schild key={name} punkt={projiziereIso([x, 0.33 + h, -y], DATEN)} text={name} richtung={i === 1 ? 'links' : 'rechts'} laenge={90} />;
      })}
      <TitelStart text={<>Hier wohnen die <span style={{color: AKZENT}}>meisten</span></>} bis={999} />
      <QuelleKlein text="BEISPIELWERTE · NUR STILPROBE" top={1300} />
    </AbsoluteFill>
  );
};

const TEILE = [Mechanik, Geschichte, Daten];

const MittelStilbilder: React.FC = () => (
  <AbsoluteFill style={{background: M.grund}}>
    {TEILE.map((Teil, i) => (
      <Sequence key={i} from={i * 60} durationInFrames={60}>
        <Teil />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const mittelStilbilder: Project[] = [{id: 'Mittel-Stilbilder', component: MittelStilbilder, format: 'vertical', durationInFrames: 180, ordner: 'Wissen'}];
