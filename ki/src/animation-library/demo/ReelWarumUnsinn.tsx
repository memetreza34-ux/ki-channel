import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {makeCircle, makeRect} from '@remotion/shapes';
import {REEL_CAPTION_SAFE} from '../../reels/captionSafe';
import {easedProgress, followThrough, staggerDelay} from '../../motion/easing';
import {REEL_CUES} from './reelSkript';
import {
  REEL_SZENEN,
  REEL_LAENGE_IN_FRAMES,
  type ReelSzene,
} from './reelSzenenAusSkript';

/**
 * "Warum KI manchmal Unsinn erzaehlt" - Reel ohne Ton.
 *
 * Aufbau nach Produktionsablauf: Sprechertext -> Untertitel-Cues -> Szenen.
 * Die Untertitel laufen durchgehend ueber den Cues, die Szenen wechseln
 * darueber. Deshalb sitzt der Untertitel fest und wird nicht je Szene neu
 * ein- und ausgeblendet.
 */

const F = {
  grund: '#F8F7FB',
  text: '#1A1A2E',
  akzent: '#6E45C9',
  hell: '#B98CFF',
  zart: '#EDE4FB',
  gedaempft: '#8B8399',
  weiss: '#FFFFFF',
  warn: '#E8833A',
  warnZart: '#FDF1E6',
  gut: '#35A06B',
} as const;

const MITTE_X = 540;
const MITTE_Y = 760;

const Korn: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
      backgroundSize: '180px 180px',
      opacity: 0.03,
      mixBlendMode: 'multiply',
    }}
  />
);

const Ueberschrift: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const auge = easedProgress(frame, followThrough(0, 0), 13);
  const zeile = easedProgress(frame, followThrough(0, 1), 17);
  return (
    <div style={{position: 'absolute', left: 92, right: 92, top: 156}}>
      <div
        style={{
          fontSize: 21,
          fontWeight: 900,
          letterSpacing: 5,
          color: F.akzent,
          opacity: auge,
          transform: `translateY(${(1 - auge) * -16}px)`,
        }}
      >
        KI ERKLÄRT
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: text.length > 26 ? 52 : 60,
          lineHeight: 1.04,
          fontWeight: 900,
          letterSpacing: -2,
          color: F.text,
          opacity: zeile,
          transform: `translateY(${(1 - zeile) * -20}px)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Untertitel laeuft ueber das ganze Reel, unabhaengig von den Szenen. */
const Untertitel: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = REEL_CUES.find((c) => frame >= c.startFrame && frame < c.endFrame);
  if (!cue) return null;
  const rein = easedProgress(frame, cue.startFrame, cue.startFrame + 5);
  const raus = easedProgress(frame, cue.endFrame - 5, cue.endFrame, 'exit');
  return (
    <div
      style={{
        position: 'absolute',
        left: REEL_CAPTION_SAFE.horizontalInset,
        right: REEL_CAPTION_SAFE.horizontalInset,
        bottom: REEL_CAPTION_SAFE.bottom,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxWidth: REEL_CAPTION_SAFE.maxWidth,
          textAlign: 'center',
          fontSize: 46,
          lineHeight: 1.18,
          fontWeight: 900,
          color: F.text,
          textShadow:
            '0 3px 16px rgba(248,247,251,.96), 0 0 34px rgba(248,247,251,.92)',
          opacity: rein * (1 - raus),
          transform: `translateY(${(1 - rein) * 12}px)`,
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};

const Karte: React.FC<{
  x: number;
  y: number;
  label: string;
  auftritt: number;
  ton?: 'neutral' | 'akzent' | 'warn' | 'gut';
  breite?: number;
  hoehe?: number;
  schrift?: number;
}> = ({x, y, label, auftritt, ton = 'neutral', breite = 300, hoehe = 92, schrift = 34}) => {
  const form = makeRect({width: breite, height: hoehe, cornerRadius: 26});
  const fuellung =
    ton === 'akzent' ? F.akzent : ton === 'warn' ? F.warnZart : ton === 'gut' ? '#E9F6EF' : F.weiss;
  const rahmen =
    ton === 'akzent' ? F.akzent : ton === 'warn' ? F.warn : ton === 'gut' ? F.gut : F.hell;
  const schriftfarbe = ton === 'akzent' ? F.weiss : ton === 'warn' ? F.warn : ton === 'gut' ? F.gut : F.text;
  return (
    <g opacity={auftritt}>
      <g transform={`translate(${x - breite / 2}, ${y - hoehe / 2 + (1 - auftritt) * 14})`}>
        <path d={form.path} fill={fuellung} stroke={rahmen} strokeWidth={3} />
      </g>
      <text
        x={x}
        y={y + schrift / 3 + (1 - auftritt) * 14}
        textAnchor="middle"
        fontSize={schrift}
        fontWeight={900}
        fill={schriftfarbe}
      >
        {label}
      </text>
    </g>
  );
};

const Buehne: React.FC<{szene: ReelSzene}> = ({szene}) => {
  const frame = useCurrentFrame();
  const m = szene.mechanik;

  if (m === 'frage') {
    const a = easedProgress(frame, 8, 30);
    const form = makeRect({width: 640, height: 150, cornerRadius: 36});
    return (
      <svg width="1080" height="1920">
        <g opacity={a} transform={`translate(${MITTE_X - 320}, ${MITTE_Y - 75 + (1 - a) * 16})`}>
          <path d={form.path} fill={F.weiss} stroke={F.hell} strokeWidth={3} />
        </g>
        <text x={MITTE_X} y={MITTE_Y + 14} textAnchor="middle" fontSize={38} fontWeight={800} fill={F.text} opacity={a}>
          „Welche Studie belegt das?“
        </text>
      </svg>
    );
  }

  if (m === 'antwort-schnell') {
    const a = easedProgress(frame, 6, 22);
    const b = easedProgress(frame, 20, 40);
    return (
      <svg width="1080" height="1920">
        <Karte x={MITTE_X} y={MITTE_Y - 110} label="„Welche Studie belegt das?“" auftritt={a} breite={640} schrift={32} />
        <Karte x={MITTE_X} y={MITTE_Y + 40} label="Müller et al., 2019" auftritt={b} ton="akzent" breite={560} schrift={36} />
        <text x={MITTE_X} y={MITTE_Y + 150} textAnchor="middle" fontSize={26} fontWeight={900} letterSpacing={3} fill={F.gedaempft} opacity={b}>
          IN 0,4 SEKUNDEN
        </text>
      </svg>
    );
  }

  if (m === 'erfunden') {
    const a = easedProgress(frame, 6, 22);
    const kippen = easedProgress(frame, 34, 66);
    return (
      <svg width="1080" height="1920">
        <Karte
          x={MITTE_X}
          y={MITTE_Y - 40}
          label="Müller et al., 2019"
          auftritt={a}
          ton={kippen > 0.5 ? 'warn' : 'akzent'}
          breite={560}
          schrift={36}
        />
        <g opacity={kippen}>
          <Karte x={MITTE_X} y={MITTE_Y + 110} label="frei erfunden" auftritt={kippen} ton="warn" breite={380} schrift={34} />
        </g>
      </svg>
    );
  }

  if (m === 'kein-suchen') {
    const durch = easedProgress(frame, 10, 44, 'exit');
    const neu = easedProgress(frame, 40, 74);
    return (
      <svg width="1080" height="1920">
        <g opacity={1 - durch}>
          <Karte x={MITTE_X} y={MITTE_Y - 60} label="sucht die Antwort" auftritt={1} breite={520} schrift={36} />
          <line x1={MITTE_X - 230} y1={MITTE_Y - 60} x2={MITTE_X + 230} y2={MITTE_Y - 60} stroke={F.warn} strokeWidth={6} strokeLinecap="round" opacity={durch} />
        </g>
        <g opacity={neu}>
          <Karte x={MITTE_X} y={MITTE_Y + 70} label="rechnet das nächste Wort" auftritt={neu} ton="akzent" breite={640} schrift={34} />
        </g>
      </svg>
    );
  }

  if (m === 'saeulen' || m === 'wahl') {
    const kandidaten = [
      {wort: 'Müller', anteil: 58},
      {wort: 'Schmidt', anteil: 27},
      {wort: 'Weber', anteil: 15},
    ];
    const abgang = m === 'wahl' ? easedProgress(frame, 22, 60, 'exit') : 0;
    const basis = MITTE_Y + 250;
    return (
      <svg width="1080" height="1920">
        {kandidaten.map((k, index) => {
          const start = 8 + staggerDelay(index, 8);
          const wachsen = easedProgress(frame, start, start + 30);
          const gewinner = index === 0;
          const hoehe = (k.anteil / 100) * 400 * wachsen;
          const x = MITTE_X + (index - 1) * 290;
          const weg = gewinner ? 0 : abgang;
          return (
            <g key={k.wort} opacity={1 - weg} transform={`translate(0, ${weg * 44})`}>
              <rect x={x - 95} y={basis - hoehe} width={190} height={Math.max(2, hoehe)} rx={24} fill={gewinner ? F.akzent : F.weiss} stroke={F.hell} strokeWidth={3} />
              <text x={x} y={basis - hoehe - 24} textAnchor="middle" fontSize={40} fontWeight={900} fill={gewinner ? F.akzent : F.text}>
                {Math.round(k.anteil * wachsen)} %
              </text>
              <text x={x} y={basis + 54} textAnchor="middle" fontSize={32} fontWeight={900} fill={gewinner ? F.akzent : F.gedaempft}>
                {k.wort}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  if (m === 'schleife') {
    const ring = 'M 540 700 m -160 0 a 160 160 0 1 1 320 0 a 160 160 0 1 1 -320 0';
    const laenge = getLength(ring);
    const fahrt = easedProgress(frame, 6, szene.dauer - 16, 'move');
    const punkt = getPointAtLength(ring, (fahrt % 1) * laenge);
    const kreis = makeCircle({radius: 17});
    return (
      <svg width="1080" height="1920">
        <path d={ring} fill="none" stroke={F.zart} strokeWidth={14} />
        <path d={ring} fill="none" stroke={F.akzent} strokeWidth={14} strokeLinecap="round" {...evolvePath(fahrt, ring)} />
        <g transform={`translate(${punkt.x - 17}, ${punkt.y - 17})`}>
          <path d={kreis.path} fill={F.akzent} />
        </g>
        <text x={MITTE_X} y={692} textAnchor="middle" fontSize={32} fontWeight={900} fill={F.text}>
          nächstes Wort
        </text>
        <text x={MITTE_X} y={736} textAnchor="middle" fontSize={26} fontWeight={800} fill={F.gedaempft}>
          und wieder
        </text>
      </svg>
    );
  }

  if (m === 'kein-pruefen') {
    const a = easedProgress(frame, 8, 30);
    const b = easedProgress(frame, 30, 56);
    return (
      <svg width="1080" height="1920">
        <Karte x={MITTE_X} y={MITTE_Y - 100} label="Wort gewählt" auftritt={a} ton="akzent" breite={460} schrift={34} />
        <Karte x={MITTE_X} y={MITTE_Y + 40} label="Fakt geprüft" auftritt={b} ton="warn" breite={460} schrift={34} />
        <g opacity={b}>
          <line x1={MITTE_X - 200} y1={MITTE_Y + 40} x2={MITTE_X + 200} y2={MITTE_Y + 40} stroke={F.warn} strokeWidth={7} strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  if (m === 'muster') {
    const woerter = ['Muster', 'Häufigkeit', 'Reihenfolge'];
    return (
      <svg width="1080" height="1920">
        {woerter.map((wort, index) => (
          <Karte
            key={wort}
            x={MITTE_X}
            y={MITTE_Y - 130 + index * 130}
            label={wort}
            auftritt={easedProgress(frame, 6 + staggerDelay(index, 9), 26 + staggerDelay(index, 9))}
            ton="akzent"
            breite={480}
            schrift={34}
          />
        ))}
        <g opacity={easedProgress(frame, 44, 70)}>
          <Karte x={MITTE_X} y={MITTE_Y + 260} label="Fakten" auftritt={easedProgress(frame, 44, 70)} ton="warn" breite={340} schrift={34} />
        </g>
      </svg>
    );
  }

  if (m === 'gleich-fluessig') {
    const a = easedProgress(frame, 6, 26);
    const b = easedProgress(frame, 24, 46);
    const marke = easedProgress(frame, 52, 78);
    return (
      <svg width="1080" height="1920">
        <Karte x={MITTE_X} y={MITTE_Y - 100} label="Müller et al., 2019" auftritt={a} ton="gut" breite={620} schrift={34} />
        <Karte x={MITTE_X} y={MITTE_Y + 40} label="Schmidt et al., 2021" auftritt={b} ton="gut" breite={620} schrift={34} />
        <g opacity={marke}>
          <text x={MITTE_X + 268} y={MITTE_Y + 52} textAnchor="middle" fontSize={40} fontWeight={900} fill={F.warn}>✕</text>
          <text x={MITTE_X} y={MITTE_Y + 156} textAnchor="middle" fontSize={30} fontWeight={900} fill={F.warn}>
            beide gibt es nicht
          </text>
        </g>
      </svg>
    );
  }

  if (m === 'entwurf') {
    const a = easedProgress(frame, 8, 30);
    const b = easedProgress(frame, 32, 58);
    return (
      <svg width="1080" height="1920">
        <Karte x={MITTE_X} y={MITTE_Y - 70} label="Entwurf" auftritt={a} ton="akzent" breite={420} schrift={40} />
        <g opacity={b}>
          <Karte x={MITTE_X} y={MITTE_Y + 80} label="Beleg" auftritt={b} ton="warn" breite={420} schrift={40} />
          <line x1={MITTE_X - 180} y1={MITTE_Y + 80} x2={MITTE_X + 180} y2={MITTE_Y + 80} stroke={F.warn} strokeWidth={7} strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  const pruefen = ['Zahlen', 'Namen', 'Quellen'];
  return (
    <svg width="1080" height="1920">
      {pruefen.map((wort, index) => (
        <Karte
          key={wort}
          x={MITTE_X}
          y={MITTE_Y - 140 + index * 140}
          label={wort}
          auftritt={easedProgress(frame, 6 + staggerDelay(index, 10), 28 + staggerDelay(index, 10))}
          ton="gut"
          breite={440}
          schrift={38}
        />
      ))}
      <text
        x={MITTE_X}
        y={MITTE_Y + 260}
        textAnchor="middle"
        fontSize={34}
        fontWeight={900}
        fill={F.gut}
        opacity={easedProgress(frame, 46, 74)}
      >
        immer nachprüfen
      </text>
    </svg>
  );
};

const Fusszeile: React.FC = () => {
  const frame = useCurrentFrame();
  const anteil = interpolate(frame, [0, REEL_LAENGE_IN_FRAMES - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <>
      <div style={{position: 'absolute', left: 104, right: 104, bottom: 300, height: 6}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 999, background: F.zart}} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${anteil * 100}%`,
            borderRadius: 999,
            background: F.akzent,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 104,
          right: 104,
          bottom: 234,
          textAlign: 'center',
          fontSize: 24,
          fontWeight: 900,
          letterSpacing: 4,
          color: F.gedaempft,
        }}
      >
        KI VERSTÄNDLICH ERKLÄRT
      </div>
    </>
  );
};

export const ReelWarumUnsinn: React.FC = () => (
  <AbsoluteFill style={{background: F.grund, fontFamily: 'Arial, Helvetica, sans-serif'}}>
    <Korn />
    {REEL_SZENEN.map((szene) => (
      <Sequence
        key={szene.id}
        from={szene.startFrame}
        durationInFrames={szene.dauer}
        name={szene.ueberschrift}
      >
        <Ueberschrift text={szene.ueberschrift} />
        <Buehne szene={szene} />
      </Sequence>
    ))}
    <Untertitel />
    <Fusszeile />
  </AbsoluteFill>
);
