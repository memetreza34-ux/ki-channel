import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Sfx} from '../../kit/Stage';
import type {Project} from '../types';
import {AKZENT, BG, HELL, STAHL, Titel, Zaehler, pulsBei, useAuftritt} from './bausteine';
import {Figur, Formel, Karte, Zeitleiste} from './erklaer-werkzeuge';
import {Videouhr} from './technik-bausteine';

/**
 * Vier Beispiel-Szenen für die neuen Werkzeuge:
 * Formel – E = mc², c = 299.792.458 m/s (SI-Definition, BIPM)
 * Karte – Deutschland hat 9 Nachbarländer (Auswärtiges Amt)
 * Zeitleiste – Raumfahrt: Sputnik 1957, Gagarin 1961, Apollo 11 1969, erstes ISS-Modul 1998 (NASA/ESA)
 * Figur – 206 Knochen im Erwachsenen (Standardwert der Anatomie)
 * Videouhr – Erdumfang am Äquator 40.075 km ÷ Sterntag 86.164 s ≈ 465 m/s (eigene Rechnung)
 */

const SZENE = 150;

const FormelSzene: React.FC = () => {
  const f = useCurrentFrame();
  const skala = useAuftritt();
  const PULS = 70;
  return (
    <AbsoluteFill>
      <Titel text={<>Die berühmteste <span style={{color: AKZENT}}>Formel</span> der Welt</>} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', transform: `scale(${skala})`}}>
        <Formel
          groesse={140}
          pulsAb={PULS}
          schritte={[
            {tex: 'E = m\\akzent{c^2}', ab: 0},
            {tex: 'E = m \\cdot \\akzent{c} \\cdot \\akzent{c}', ab: 46},
          ]}
        />
      </div>
      <Zaehler wert={299792} einheit="km/s" label="Lichtgeschwindigkeit c" quelle="QUELLE: SI-DEFINITION, BIPM" puls={pulsBei(f, PULS)} />
      <Sfx name="kWhoosh" at={0} volume={0.35} />
      <Sfx name="kDing" at={PULS} volume={0.5} />
    </AbsoluteFill>
  );
};

const NACHBARN = ['Denmark', 'Poland', 'Czechia', 'Austria', 'Switzerland', 'France', 'Luxembourg', 'Belgium', 'Netherlands'];

const KartenSzene: React.FC = () => {
  const f = useCurrentFrame();
  const ab = 50;
  const anzahl = NACHBARN.filter((_, i) => f >= ab + i * 6).length;
  const PULS = ab + 8 * 6 + 6;
  return (
    <AbsoluteFill>
      <Titel text={<>So viele <span style={{color: AKZENT}}>Nachbarn</span> hat Deutschland</>} />
      <div style={{position: 'absolute', left: 80, top: 470, width: 920, height: 680, borderRadius: 36, overflow: 'hidden'}}>
        <Karte
          breite={920}
          hoehe={680}
          von={{lon: 12, lat: 30, zoom: 1.6}}
          nach={{lon: 10.4, lat: 51, zoom: 9}}
          fahrtAb={4}
          fahrtDauer={40}
          laender={[{name: 'Germany', ab: 10, farbe: HELL}, ...NACHBARN.map((name, i) => ({name, ab: ab + i * 6}))]}
          punkte={[{lon: 13.4, lat: 52.52, label: 'Berlin', ab: 36}]}
        />
      </div>
      <Zaehler wert={anzahl} einheit={anzahl === 1 ? 'Land' : 'Länder'} label="grenzen an Deutschland" quelle="QUELLE: AUSWÄRTIGES AMT" puls={pulsBei(f, PULS)} />
      <Sfx name="kWhoosh" at={0} volume={0.35} />
      <Sfx name="kDing" at={PULS} volume={0.5} />
    </AbsoluteFill>
  );
};

const ZeitSzene: React.FC = () => (
  <AbsoluteFill>
    <Titel text={<>In nur <span style={{color: AKZENT}}>12 Jahren</span> zum Mond</>} />
    <Zeitleiste
      start={1955}
      ende={2000}
      top={540}
      hoehe={860}
      dauer={100}
      hervor={2}
      eintraege={[
        {jahr: 1957, text: 'Sputnik 1', zusatz: 'erster Satellit'},
        {jahr: 1961, text: 'Juri Gagarin', zusatz: 'erster Mensch im All'},
        {jahr: 1969, text: 'Apollo 11', zusatz: 'erste Mondlandung'},
        {jahr: 1998, text: 'ISS', zusatz: 'erstes Modul im Orbit'},
      ]}
    />
    <Sfx name="kWhoosh" at={0} volume={0.35} />
    <Sfx name="kAnstieg" at={6} volume={0.25} />
  </AbsoluteFill>
);

const FigurSzene: React.FC = () => {
  const f = useCurrentFrame();
  const PULS = 80;
  return (
    <AbsoluteFill>
      <Titel text={<>So viele <span style={{color: AKZENT}}>Knochen</span> hast du</>} />
      <div style={{position: 'absolute', left: 120, top: 520}}>
        <Figur
          groesse={600}
          posen={[
            {pose: 'stehen', ab: 0},
            {pose: 'denken', ab: 24},
            {pose: 'zeigen', ab: 60},
            {pose: 'jubeln', ab: PULS + 10},
          ]}
        />
      </div>
      <div style={{position: 'absolute', left: 560, top: 640, width: 400, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 46, lineHeight: 1.1, color: STAHL, opacity: f > 60 ? 1 : 0.4}}>
        Babys haben sogar mehr – viele wachsen später zusammen.
      </div>
      <Zaehler wert={Math.min(206, Math.round((f / PULS) * 206))} einheit="Knochen" label="im Körper eines Erwachsenen" quelle="QUELLE: ANATOMIE-LEHRBÜCHER" puls={pulsBei(f, PULS)} />
      <Sfx name="kWhoosh" at={0} volume={0.35} />
      <Sfx name="kDing" at={PULS} volume={0.5} />
    </AbsoluteFill>
  );
};

const UhrSzene: React.FC = () => (
  <AbsoluteFill>
    <Titel text={<>So weit dreht dich die <span style={{color: AKZENT}}>Erde</span>, während du schaust</>} />
    <Videouhr proSekunde={465} einheit="m" top={620} />
    <div style={{position: 'absolute', left: 80, right: 80, top: 760, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 42, color: STAHL}}>am Äquator · 465 m pro Sekunde</div>
    <div style={{position: 'absolute', left: 80, top: 1400, fontFamily: 'JetBrains Mono, monospace', fontSize: 28, letterSpacing: '0.06em', color: STAHL}}>RECHNUNG: 40.075 KM ÷ 86.164 S</div>
  </AbsoluteFill>
);

const Werkzeuge: React.FC = () => (
  <AbsoluteFill style={{background: BG, overflow: 'hidden', color: HELL}}>
    <AbsoluteFill style={{background: 'radial-gradient(900px 700px at 50% 45%, rgba(90,130,220,0.10), transparent 70%)'}} />
    {[FormelSzene, KartenSzene, ZeitSzene, FigurSzene, UhrSzene].map((Szene, i) => (
      <Sequence key={i} from={i * SZENE} durationInFrames={SZENE}>
        <Szene />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const werkzeuge: Project[] = [{id: 'Werkzeug-Beispiele', component: Werkzeuge, format: 'vertical', durationInFrames: SZENE * 5, ordner: 'Wissen'}];
