import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame} from 'remotion';
import {Sfx} from '../../kit/Stage';
import type {Project} from '../types';
import {AKZENT, Globus, clamp, outQuint} from './bausteine';
import {Mass, QuelleKlein, TitelStart, UntertitelSatz, UntertitelWort, ZahlPaar, probeZeiten} from './stil';
import {KameraStand, projiziere3D} from './technik-bausteine';
import {WeltAll, WeltInsel, WeltLandschaft, WeltNachtstrasse, WeltTunnel, WeltZimmer, WeltZimmer3D, Zahnrad3D} from './welten';

/**
 * Katalog der Welten und Text-Stile (Regelwerk 2026-11-08). Je 5 s: Welt + passender Text-Stil + Sounds.
 * Sprechtext hier nur als Platzhalter-Zeiten (`probeZeiten`), keine Stimme.
 */

const D = 150;

/* 1 · Zimmer + Überschrift am Anfang + Satz-Untertitel. Held: Wanduhr. Raum wechselt vom Büro in den Abend. */
const Zimmer: React.FC = () => {
  const f = useCurrentFrame();
  const wechsel = interpolate(f, [70, 95], [0, 1], {...clamp, easing: outQuint});
  const zeiger = f * 4.5 + wechsel * 240;
  const auf = spring({frame: f, fps: 30, config: {damping: 14, stiffness: 140}});
  return (
    <WeltZimmer stimmung="buero" naechste="abend" wechsel={wechsel}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(540 800) scale(${0.92 + 0.08 * auf})`}>
          <circle r={250} fill="#F6EBD6" stroke="#2B2B2B" strokeWidth={18} />
          <circle r={250} fill="none" stroke="#000" strokeOpacity={0.12} strokeWidth={40} transform="translate(8 14)" />
          {Array.from({length: 12}, (_, i) => {
            const w = (i * 30 * Math.PI) / 180;
            return <line key={i} x1={Math.sin(w) * 200} y1={-Math.cos(w) * 200} x2={Math.sin(w) * 228} y2={-Math.cos(w) * 228} stroke="#2B2B2B" strokeWidth={i % 3 === 0 ? 14 : 7} strokeLinecap="round" />;
          })}
          <line x1={0} y1={0} x2={Math.sin((zeiger / 12) * (Math.PI / 180)) * 120} y2={-Math.cos((zeiger / 12) * (Math.PI / 180)) * 120} stroke="#2B2B2B" strokeWidth={16} strokeLinecap="round" />
          <line x1={0} y1={0} x2={Math.sin(zeiger * (Math.PI / 180)) * 185} y2={-Math.cos(zeiger * (Math.PI / 180)) * 185} stroke={AKZENT} strokeWidth={9} strokeLinecap="round" />
          <circle r={16} fill="#2B2B2B" />
        </g>
      </svg>
      <TitelStart text={<>So viel Zeit <span style={{color: AKZENT}}>verschläfst</span> du</>} bis={60} />
      <UntertitelSatz captions={probeZeiten('Ein Tag hat 1.440 Minuten. Davon schläfst du rund 480.', 300)} />
      <QuelleKlein text="BEISPIEL · WELT ZIMMER + UNTERTITEL SATZ" />
      <Sfx name="kTick" at={4} volume={0.35} />
      <Sfx name="vBlaettern" at={70} volume={0.5} />
      <Sfx name="kPop" at={100} volume={0.35} />
    </WeltZimmer>
  );
};

/* 2 · Insel + Zahlenpaar. Held: Rathaus, Dach färbt sich mit Stempel-Klang. */
const Insel: React.FC = () => {
  const f = useCurrentFrame();
  const farbe = f < 75 ? '#8A93A8' : AKZENT;
  const hub = interpolate(f, [75, 82, 92], [0, 0.4, 0], clamp);
  return (
    <AbsoluteFill>
      <WeltInsel>
        <group>
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.6, 1.8, 2.2]} />
            <meshStandardMaterial color="#F2ECE0" roughness={0.8} />
          </mesh>
          <mesh position={[0, 2.25 + hub, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[2.25, 1, 4]} />
            <meshStandardMaterial color={farbe} roughness={0.6} />
          </mesh>
          {[-1.2, -0.4, 0.4, 1.2].map((x) => (
            <mesh key={x} position={[x, 0.75, 1.12]}>
              <boxGeometry args={[0.35, 0.8, 0.04]} />
              <meshStandardMaterial color="#5A6A8A" />
            </mesh>
          ))}
        </group>
      </WeltInsel>
      <ZahlPaar links={{wert: '41', label: 'SITZE 2021'}} rechts={{wert: '58', label: 'SITZE 2025'}} ab={20} abRechts={75} aufHell />
      <UntertitelSatz captions={probeZeiten('Vier Jahre später holt die Partei 17 Sitze mehr.', 600)} />
      <QuelleKlein text="BEISPIEL · WELT INSEL + ZAHLPAAR" />
      <Sfx name="kTick" at={20} volume={0.3} />
      <Sfx name="vStempel" at={75} volume={0.55} />
    </AbsoluteFill>
  );
};

/* 2b · Landschaft am Abend + Satz-Untertitel. Held: Lagerfeuer (in der Welt). */
const Landschaft: React.FC = () => (
  <AbsoluteFill>
    <WeltLandschaft />
    <TitelStart text={<>So weit sieht man ein <span style={{color: AKZENT}}>Lagerfeuer</span></>} bis={70} />
    <UntertitelSatz captions={probeZeiten('Bei Nacht ist ein Feuer kilometerweit zu sehen.', 900)} />
    <QuelleKlein text="BEISPIEL · WELT LANDSCHAFT" />
    <Sfx name="kPop" at={6} volume={0.3} />
  </AbsoluteFill>
);

/* 2c · Zimmer 3D: Licht wechselt von Tag zu Abend. */
const Zimmer3D: React.FC = () => {
  const f = useCurrentFrame();
  const licht = interpolate(f, [60, 90], [1, 0], {...clamp, easing: outQuint});
  return (
    <AbsoluteFill>
      <WeltZimmer3D licht={licht} />
      <UntertitelSatz captions={probeZeiten('Abends leuchtet nur noch die Lampe.', 1500)} />
      <QuelleKlein text="BEISPIEL · WELT ZIMMER 3D" />
      <Sfx name="kTipp" at={60} volume={0.4} />
    </AbsoluteFill>
  );
};

/* 3 · Tunnel + Wort-Untertitel mit Betonung + Maß am Objekt. Held: Zahnrad. */
const tunnelKamera = (t: number): KameraStand & {pos: [number, number, number]} => ({pos: [1.8 - t * 0.004, 1.9, 8.5 - t * 0.01], ziel: [0, 1.4, 0], fov: 36});

const Tunnel: React.FC = () => {
  const f = useCurrentFrame();
  const k = tunnelKamera(f);
  const links = projiziere3D([-0.8, 1.4, 0.2], k);
  const rechts = projiziere3D([0.8, 1.4, 0.2], k);
  return (
    <AbsoluteFill>
      <WeltTunnel farbe="#FFD2B0" kamera={tunnelKamera}>
        <Zahnrad3D y={1.4} r={0.8} winkel={f * 0.025} />
      </WeltTunnel>
      <Mass von={[links[0], links[1] - 260]} bis={[rechts[0], rechts[1] - 260]} text="12 cm" ab={60} />
      <UntertitelWort captions={probeZeiten('Für 15 Umdrehungen dreht sich das Rad nur einmal.', 400)} gross={['einmal']} unterstrichen={['umdrehungen']} />
      <Sfx name="vEinschlag" at={0} volume={0.6} />
      <Sfx name="vZahnrad" at={30} volume={0.5} />
      <Sfx name="vScan" at={60} volume={0.35} />
    </AbsoluteFill>
  );
};

/* 4 · Nachtstraße + Wort-Untertitel. Kamera fährt mit. */
const Strasse: React.FC = () => (
  <AbsoluteFill>
    <WeltNachtstrasse tempo={0.3} />
    <UntertitelWort captions={probeZeiten('Das Fernlicht reicht 600 Meter weit.', 500)} gross={['600']} />
    <Sfx name="vVorbei" at={8} volume={0.55} />
    <Sfx name="vServo" at={90} volume={0.35} />
  </AbsoluteFill>
);

/* 5 · All + Satz-Untertitel. Held: Erde. */
const All: React.FC = () => {
  const f = useCurrentFrame();
  const auf = spring({frame: f, fps: 30, config: {damping: 14, stiffness: 120}});
  return (
    <WeltAll>
      <div style={{position: 'absolute', left: 540 - 300, top: 820 - 300, transform: `scale(${0.92 + 0.08 * auf})`, filter: 'drop-shadow(0 0 60px rgba(110,150,255,0.35))'}}>
        <Globus R={280} lon0={10 + f * 0.25} lat0={30} id="katalog-erde" />
      </div>
      <UntertitelSatz captions={probeZeiten('Über dir kreisen gerade gut dreißig Satelliten.', 400)} />
      <QuelleKlein text="BEISPIEL · WELT ALL + UNTERTITEL SATZ" />
      <Sfx name="kPop" at={10} volume={0.35} />
    </WeltAll>
  );
};

const TEILE = [Zimmer, Insel, Landschaft, Zimmer3D, Tunnel, Strasse, All];

const StilKatalog: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {TEILE.map((Teil, i) => (
      <Sequence key={i} from={i * D} durationInFrames={D}>
        <Teil />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const stilKatalog: Project[] = [{id: 'Stil-Katalog', component: StilKatalog, format: 'vertical', durationInFrames: D * TEILE.length, ordner: 'Wissen'}];
