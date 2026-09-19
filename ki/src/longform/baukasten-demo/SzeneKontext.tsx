import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {
  AreaPremium, BarsPremium, DigitSlots, DramaticNumber, E, Lucide,
  MaskReveal, PiePremium, SplitFlap, Typewriter, WordStagger, prog,
} from '@studio/core';
import {BRAND} from '../../../brand/brand';
import {kette, Untertitel} from './Untertitel';
import {SfxSpur, tippen, type SfxCue} from './sfx';

/**
 * Szene: „Wie groß ist ein Kontextfenster?"
 *
 * Anderes Thema, andere Bausteine. Alles hier war im Kit vorhanden und noch
 * nie im Einsatz: Klappanzeige, Ziffernwalze, Zahl mit Fake-Stopp, wachsende
 * Balken, gezeichnete Flaeche, Donut, Schreibmaschine, Masken-Aufdeckung.
 *
 * Die Zahlen stimmen: 2022 lagen gaengige Modelle bei rund 4.000 Token,
 * inzwischen reichen die groessten bis zwei Millionen — das Fuenfhundertfache.
 * Der Einbruch in der Mitte langer Texte ist ebenfalls belegt („Lost in the
 * Middle", Liu et al. 2023): Modelle finden Angaben am Anfang und am Ende
 * zuverlaessiger als in der Mitte.
 */

const SAETZE = [
  'Das Kontextfenster ist der Arbeitsspeicher eines Sprachmodells.',
  'Zweitausendzweiundzwanzig passten dort rund viertausend Token hinein.',
  'Heute schaffen die größten Modelle zwei Millionen.',
  'Das ist das Fünfhundertfache in drei Jahren.',
  'Aber mehr Platz heißt nicht automatisch bessere Antworten.',
  'In der Mitte langer Texte übersieht das Modell Dinge.',
  'Entscheidend ist nicht die Größe, sondern was drin steht.',
];

export const KONTEXT_BEATS = kette(SAETZE, 12, 10);
export const KONTEXT_DAUER =
  KONTEXT_BEATS[KONTEXT_BEATS.length - 1].ab + KONTEXT_BEATS[KONTEXT_BEATS.length - 1].dauer + 45;

const purple = BRAND.accentDk;
const accent = BRAND.accent;
const ink = BRAND.ink;
const muted = '#8D8197';

/** Ueberschrift, die dauerhaft oben steht — man weiss jederzeit, worum es geht. */
const Ueberschrift: React.FC<{text: string; icon: string}> = ({text, icon}) => {
  const f = useCurrentFrame();
  const ein = prog(f, 0, 24, E.out);
  const strich = prog(f, 14, 44, E.out);
  return (
    <div style={{
      position: 'absolute', top: 58, left: 0, right: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      opacity: ein, translate: `0px ${(1 - ein) * -16}px`,
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        <div style={{
          width: 72, height: 72, borderRadius: 22,
          background: 'rgba(185,140,255,.15)', border: '1.5px solid rgba(110,69,201,.2)',
          display: 'grid', placeItems: 'center',
        }}>
          <Lucide name={icon} size={40} color={purple} stroke={2} glow={false} />
        </div>
        <div style={{
          fontFamily: BRAND.font.body, fontWeight: 900, fontSize: 50,
          letterSpacing: -1.4, color: purple,
        }}>{text}</div>
      </div>
      <div style={{
        height: 3, width: 420 * strich, borderRadius: 3,
        background: `linear-gradient(90deg, rgba(110,69,201,0), ${accent}, rgba(110,69,201,0))`,
      }} />
    </div>
  );
};

/** Beat 1 — der Begriff wird geschrieben, dann aufgedeckt, was er bedeutet. */
const Begriff: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
      <Typewriter text="Kontextfenster" start={6} cps={9} size={78} color={ink} />
      <MaskReveal at={44} dur={20}>
        <div style={{
          padding: '22px 34px', borderRadius: 16, background: '#FBFAFD',
          border: '1px solid rgba(26,26,46,.08)',
          fontFamily: BRAND.font.body, fontWeight: 700, fontSize: 30, color: muted,
        }}>
          alles, was das Modell gleichzeitig im Blick hat
        </div>
      </MaskReveal>
    </div>
  );
};

/** Beat 2 — Klappanzeige wie am Bahnhof. Ganz andere Mechanik als Tippen. */
const Damals: React.FC = () => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
    <div style={{fontFamily: BRAND.font.body, fontWeight: 750, fontSize: 30, color: muted}}>2022</div>
    <SplitFlap text="4 096" fontSize={96} color="#fff" tileBg={purple} startAt={8}
      staggerFrames={5} flapFrames={16} />
    <div style={{fontFamily: BRAND.font.body, fontWeight: 700, fontSize: 28, color: muted}}>Token</div>
  </div>
);

/** Beat 3 — Zahl rast hoch, taeuscht einen Stopp vor und laeuft weiter. */
const Heute: React.FC = () => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
    <div style={{fontFamily: BRAND.font.body, fontWeight: 750, fontSize: 30, color: muted}}>heute</div>
    <DramaticNumber
      to={2000000}
      from={4096}
      format={(n) => Math.round(n).toLocaleString('de-DE')}
      fontSize={122}
      color={purple}
      startAt={6}
      durationFrames={70}
      fakeStopAt={0.32}
    />
    <div style={{fontFamily: BRAND.font.body, fontWeight: 700, fontSize: 28, color: muted}}>Token</div>
  </div>
);

/** Beat 4 — Balken wachsen aus dem Boden. */
const Wachstum: React.FC = () => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
    <BarsPremium
      width={1020}
      height={400}
      growStart={8}
      growEnd={56}
      // Farbe explizit: BarsPremium setzt sonst `var(--accent)` in einen
      // SVG-Farbverlauf, und dort greift die CSS-Variable nicht — die Balken
      // wurden schwarz.
      data={[
        {name: '2022', value: 4096, color: '#D9CCF0'},
        {name: '2023', value: 32000, color: '#C3ADEA'},
        {name: '2024', value: 200000, color: BRAND.accent},
        {name: '2025', value: 2000000, color: BRAND.accentDk},
      ]}
    />
    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
      <Lucide name="trending-up" size={34} color={purple} stroke={2.2} glow={false} />
      <DigitSlots value="500x" fontSize={58} color={purple} startAt={60} spinFrames={22} stagger={5} />
    </div>
  </div>
);

/** Beat 5 — Wortweiser Aufbau, andere Mechanik als alles davor. */
const Aber: React.FC = () => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
    <WordStagger
      text="Mehr Platz ist nicht mehr Verständnis"
      start={6}
      perWord={5}
      size={62}
      color={ink}
      highlight={['nicht']}
      highlightColor={purple}
    />
    <div style={{display: 'flex', gap: 22}}>
      {['füllen', 'finden', 'gewichten'].map((w, i) => {
        const Chip: React.FC = () => {
          const f = useCurrentFrame();
          const p = prog(f, 46 + i * 9, 66 + i * 9, E.spring);
          return (
            <div style={{
              padding: '15px 26px', borderRadius: 999,
              background: i === 0 ? 'rgba(185,140,255,.16)' : '#FBFAFD',
              border: `1.5px solid ${i === 0 ? 'rgba(110,69,201,.3)' : 'rgba(26,26,46,.09)'}`,
              fontFamily: BRAND.font.body, fontWeight: 780, fontSize: 27,
              color: i === 0 ? purple : muted,
              opacity: p, scale: 0.8 + p * 0.2,
            }}>{w}</div>
          );
        };
        return <Chip key={w} />;
      })}
    </div>
  </div>
);

/**
 * Beat 6 — die Kurve zeichnet sich.
 *
 * Trefferquote ueber die Position im Text: vorne und hinten hoch, in der Mitte
 * ein Einbruch. Genau das beschreibt „Lost in the Middle".
 */
const Mitte: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
      <AreaPremium
        width={1060}
        height={380}
        drawStart={8}
        drawEnd={62}
        yMax={100}
        color={purple}
        data={[
          {x: 'Anfang', y: 92},
          {x: '25 %', y: 68},
          {x: 'Mitte', y: 41},
          {x: '75 %', y: 63},
          {x: 'Ende', y: 88},
        ]}
      />
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        opacity: prog(f, 66, 84, E.out),
        fontFamily: BRAND.font.body, fontWeight: 720, fontSize: 26, color: muted,
      }}>
        <Lucide name="search-x" size={26} color="#C0485A" stroke={2.2} glow={false} />
        Trefferquote nach Position im Text
      </div>
    </div>
  );
};

/** Beat 7 — Donut fuellt sich auf. */
const WasDrinSteht: React.FC = () => (
  <div style={{display: 'flex', alignItems: 'center', gap: 60}}>
    <PiePremium
      width={420}
      height={420}
      drawStart={8}
      drawEnd={54}
      donut
      centerLabel="Kontext"
      data={[
        {name: 'wirklich nötig', value: 30, color: BRAND.accentDk},
        {name: 'nice to have', value: 25, color: BRAND.accent},
        {name: 'Ballast', value: 45, color: '#DCD4E4'},
      ]}
    />
    <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
      {[
        {t: 'wirklich nötig', f: BRAND.accentDk, at: 58},
        {t: 'nice to have', f: BRAND.accent, at: 66},
        {t: 'Ballast', f: '#DCD4E4', at: 74},
      ].map((e) => {
        const Zeile: React.FC = () => {
          const fr = useCurrentFrame();
          const p = prog(fr, e.at, e.at + 18, E.out);
          return (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              opacity: p, translate: `${(1 - p) * 20}px 0px`,
            }}>
              <div style={{width: 22, height: 22, borderRadius: 7, background: e.f}} />
              <div style={{fontFamily: BRAND.font.body, fontWeight: 760, fontSize: 30, color: ink}}>{e.t}</div>
            </div>
          );
        };
        return <Zeile key={e.t} />;
      })}
    </div>
  </div>
);

const BILDER = [Begriff, Damals, Heute, Wachstum, Aber, Mitte, WasDrinSteht];

/**
 * Die Tonspur.
 *
 * Jeder Einsatz sitzt auf etwas Sichtbarem: Tastenklicks waehrend getippt wird,
 * ein Klicken je Klappe der Anzeige, ein Einschlag wenn der hoechste Balken
 * steht, ein Chime wenn der Donut fertig ist. Kein Dauerton.
 */
const B = (i: number) => KONTEXT_BEATS[i].ab;

const TON: SfxCue[] = [
  // Beat 1 — „Kontextfenster" wird getippt, dann faehrt die Erklaerung auf.
  ...tippen(B(0) + 6, 14, 9 / 30, 3),
  {name: 'whoosh-soft', at: B(0) + 44},

  // Beat 2 — die Klappanzeige: je Kachel ein Klicken.
  ...[0, 1, 2, 3, 4].map((k): SfxCue => ({name: 'click-ui', at: B(1) + 8 + k * 5, pegel: 0.24})),

  // Beat 3 — die Zahl rast hoch, haelt kurz, landet.
  {name: 'riser-tension', at: B(2) + 4, pegel: 0.26},
  {name: 'impact-soft', at: B(2) + 76},

  // Beat 4 — Balken wachsen, der hoechste landet, dann rollt die Walze.
  {name: 'whoosh-digital', at: B(3) + 8, pegel: 0.28},
  {name: 'impact-soft', at: B(3) + 52},
  {name: 'glitch-blip', at: B(3) + 60},
  {name: 'pop-soft', at: B(3) + 84},

  // Beat 5 — drei Chips poppen nacheinander auf.
  ...[0, 1, 2].map((k): SfxCue => ({name: 'pop-soft', at: B(4) + 46 + k * 9, pegel: 0.26})),

  // Beat 6 — die Kurve zeichnet sich, am Tiefpunkt ein Fehlerton.
  {name: 'reveal-swell', at: B(5) + 6, pegel: 0.22},
  {name: 'error-buzz', at: B(5) + 38, pegel: 0.22},

  // Beat 7 — der Donut fuellt sich, Legende hakt nach, Abschluss.
  {name: 'whoosh-soft', at: B(6) + 6},
  ...[0, 1, 2].map((k): SfxCue => ({name: 'click-ui', at: B(6) + 58 + k * 8, pegel: 0.2})),
  {name: 'chime-success', at: B(6) + 86},
];

export const SzeneKontext: React.FC = () => (
  <AbsoluteFill style={{background: '#FFFFFF', fontFamily: BRAND.font.body}}>
    <Ueberschrift text="Wie groß ist ein Kontextfenster?" icon="database" />

    {BILDER.map((Bild, i) => (
      <Sequence
        key={i}
        from={KONTEXT_BEATS[i].ab - 6}
        durationInFrames={KONTEXT_BEATS[i].dauer + 12 + (i === BILDER.length - 1 ? 45 : 0)}
        name={`Beat ${i + 1}`}
        layout="none"
      >
        <AbsoluteFill style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          paddingTop: 150, paddingBottom: 190,
        }}>
          <Bild />
        </AbsoluteFill>
      </Sequence>
    ))}

    <Untertitel beats={KONTEXT_BEATS} />
    <SfxSpur cues={TON} />
  </AbsoluteFill>
);
