import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {Trail} from '@remotion/motion-blur';
import {noise2D} from '@remotion/noise';
import {E, Lucide, Shake, StampImpact, WhipIn, ZoomPunch, prog} from '@studio/core';
import {BRAND} from '../../../brand/brand';
import {Chat, Dateien, Ergebnis, Fortschritt, Loop, Suche} from '../agent-loop-explained/panels';
import {kette, Untertitel} from './Untertitel';

/**
 * Eine vollstaendige Szene mit Untertiteln statt Ton.
 *
 * Jeder Satz bekommt sein eigenes Bild und seine eigene Bewegungsart — kein
 * Beat sieht aus wie der davor. Das ist der Punkt: Wenn alles gleich einfaehrt,
 * wirkt das Video tot, auch wenn dauernd etwas passiert.
 *
 * Die Untertitel stehen hier, damit sich ohne Voiceover pruefen laesst, ob Bild
 * und Aussage zusammengehoeren.
 */

const SAETZE = [
  'Du gibst dem Agenten ein Ziel.',
  'Er sucht die passenden Informationen.',
  'Öffnet die Dateien, die dazu gehören.',
  'Und merkt: zwei Angaben widersprechen sich.',
  'Statt weiterzuschreiben, fragt er gezielt nach.',
  'Jeder Schritt fließt zurück in den Kontext.',
  'Am Ende steht ein geprüftes Ergebnis.',
];

export const BEATS = kette(SAETZE, 10, 10);
/** Gesamtlaenge inklusive Auslauf. */
export const UNTERTITEL_DAUER =
  BEATS[BEATS.length - 1].ab + BEATS[BEATS.length - 1].dauer + 40;

const purple = BRAND.accentDk;
const accent = BRAND.accent;

/** Beat 1 — das Ziel wird eingetippt. */
const Ziel: React.FC = () => (
  <Chat at={6} width={880} frage="Vergleiche die Angebote und empfiehl mir eines." zeilen={2} />
);

/** Beat 2 — die Suche fuellt sich. */
const Sucht: React.FC = () => (
  <Suche at={4} width={820} anfrage="preis pro nutzer 2026"
    treffer={['angebot-a · Seite 4', 'angebot-b · Seite 7', 'anforderungen · Punkt 3']} />
);

/** Beat 3 — die Dateien klappen auf, eine nach der anderen. */
const OeffnetDateien: React.FC = () => (
  <Dateien at={4} width={860} titel="Geöffnet" dateien={[
    {name: 'angebot-a.pdf', groesse: '240 KB', status: 'ok'},
    {name: 'angebot-b.pdf', groesse: '198 KB', status: 'ok'},
    {name: 'anforderungen.md', groesse: '12 KB', status: 'ok'},
  ]} />
);

/**
 * Beat 4 — der Widerspruch.
 *
 * Hier bewusst eine ganz andere Mechanik: zwei Werte fahren aufeinander zu,
 * schlagen an und wackeln. Kein Einfahren von unten wie in den Beats davor.
 */
const Widerspruch: React.FC = () => {
  const f = useCurrentFrame();
  const auf = prog(f, 6, 30, E.out);
  const Wert: React.FC<{text: string; quelle: string; von: number}> = ({text, quelle, von}) => (
    <div style={{
      padding: '26px 34px', borderRadius: 18, background: '#FDF2F4',
      border: '1.5px solid rgba(192,72,90,.32)', textAlign: 'center',
      translate: `${(1 - auf) * von}px 0px`,
    }}>
      <div style={{fontFamily: BRAND.font.body, fontWeight: 900, fontSize: 52, color: '#C0485A'}}>{text}</div>
      <div style={{fontFamily: BRAND.font.body, fontWeight: 650, fontSize: 22, color: '#8D8197', marginTop: 8}}>{quelle}</div>
    </div>
  );
  return (
    <Shake at={32} strength={11} durFrames={26}>
      <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
        <Wert text="49 € / Nutzer" quelle="angebot-b · Seite 7" von={-160} />
        <StampImpact at={32}>
          <Lucide name="triangle-alert" size={74} color="#C0485A" stroke={2.1} glow={false} />
        </StampImpact>
        <Wert text="39 € / Nutzer" quelle="anforderungen · Punkt 3" von={160} />
      </div>
    </Shake>
  );
};

/**
 * Beat 5 — die Nachfrage.
 *
 * Mechanik: eine Linie zeichnet sich vom Agenten zur Quelle, ein Impuls laeuft
 * darauf zurueck. Wieder anders als alles davor.
 */
const FragtNach: React.FC = () => {
  const f = useCurrentFrame();
  const d = 'M40 80 C 220 20, 420 140, 640 74';
  const {strokeDasharray, strokeDashoffset} = evolvePath(prog(f, 8, 44, E.out), d);
  const zurueck = prog(f, 46, 76, E.out);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 0}}>
        <WhipIn at={4} dir="left" dist={90}>
          <div style={{
            width: 96, height: 96, borderRadius: 26, background: purple,
            display: 'grid', placeItems: 'center',
          }}>
            <Lucide name="bot" size={52} color="#fff" stroke={2} glow={false} />
          </div>
        </WhipIn>
        <svg width={680} height={160} viewBox="0 0 680 160" fill="none" style={{margin: '0 -12px'}}>
          <path d={d} stroke={accent} strokeWidth={5} strokeLinecap="round"
            strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
          {zurueck > 0 ? (
            <circle cx={640 - (640 - 40) * zurueck} cy={74 + Math.sin(zurueck * Math.PI) * 28} r={11} fill={purple} />
          ) : null}
        </svg>
        <WhipIn at={16} dir="right" dist={90}>
          <div style={{
            width: 96, height: 96, borderRadius: 26, background: '#FBFAFD',
            border: '1.5px solid rgba(26,26,46,.1)', display: 'grid', placeItems: 'center',
          }}>
            <Lucide name="file-search" size={52} color={purple} stroke={2} glow={false} />
          </div>
        </WhipIn>
      </div>
      <div style={{
        fontFamily: BRAND.font.body, fontWeight: 750, fontSize: 27, color: '#8D8197',
        opacity: prog(f, 58, 76, E.out),
      }}>
        „Welcher Preis gilt laut Anforderungen?"
      </div>
    </div>
  );
};

/** Beat 6 — der Loop laeuft, ein Punkt zieht seine Spur zurueck. */
const ZurueckInKontext: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28}}>
      <Loop at={4} width={1120} proZustand={26}
        zustaende={['Beobachten', 'Entscheiden', 'Handeln', 'Prüfen']} />
      <div style={{position: 'relative', width: 900, height: 76}}>
        {/* Rauschen bewegt die Punkte organisch, nicht auf einer Sinuslinie. */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = 90 + i * 140 + noise2D('kontext', i * 2.3, f / 90) * 26;
          const y = 34 + noise2D('kontext-y', i * 4.1, f / 90) * 18;
          return (
            <Trail key={i} layers={5} lagInFrames={1.2} trailOpacity={0.4}>
              <div style={{
                position: 'absolute', left: x, top: y,
                width: 18, height: 18, borderRadius: 999,
                background: i % 2 === 0 ? purple : accent,
                opacity: prog(f, 40 + i * 5, 58 + i * 5, E.out),
              }} />
            </Trail>
          );
        })}
      </div>
    </div>
  );
};

/** Beat 7 — das Ergebnis, mit Zoom-Schlag hereingesetzt. */
const Geprueft: React.FC = () => (
  <div style={{display: 'flex', alignItems: 'flex-start', gap: 30}}>
    <ZoomPunch at={6} from={1.9}>
      <Ergebnis at={0} width={780} titel="Empfehlung" geprueft zeilen={[
        'Angebot B, zum Preis aus den Anforderungen.',
        'Widerspruch geklärt: 39 € pro Nutzer.',
      ]} />
    </ZoomPunch>
    <Fortschritt at={28} width={520} titel="Alles abgehakt" eintraege={[
      {text: 'Angebote gelesen', fertig: true},
      {text: 'Widerspruch geklärt', fertig: true},
      {text: 'Empfehlung geprüft', fertig: true},
    ]} />
  </div>
);

const BILDER = [Ziel, Sucht, OeffnetDateien, Widerspruch, FragtNach, ZurueckInKontext, Geprueft];

export const SzeneMitUntertitel: React.FC = () => (
  <AbsoluteFill style={{background: '#FFFFFF', fontFamily: BRAND.font.body}}>
    {/* Jedes Bild laeuft in seiner eigenen Sequence — dadurch faengt seine
        Zeitrechnung bei 0 an und die Bausteine brauchen keine Offsets. */}
    {BILDER.map((Bild, i) => (
      <Sequence
        key={i}
        from={BEATS[i].ab - 6}
        // Das letzte Bild bleibt bis zum Schluss stehen, statt einen leeren
        // Auslauf zu hinterlassen.
        durationInFrames={BEATS[i].dauer + 12 + (i === BILDER.length - 1 ? 40 : 0)}
        name={`Beat ${i + 1}`}
        layout="none"
      >
        <AbsoluteFill style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          paddingBottom: 190,
        }}>
          <Bild />
        </AbsoluteFill>
      </Sequence>
    ))}
    <Untertitel beats={BEATS} />
  </AbsoluteFill>
);
