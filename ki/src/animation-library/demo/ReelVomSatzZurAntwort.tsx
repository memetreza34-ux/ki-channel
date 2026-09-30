import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {makeCircle, makeRect} from '@remotion/shapes';
import {REEL_CAPTION_SAFE} from '../../reels/captionSafe';
import {
  MOTION_EASING,
  easedProgress,
  followThrough,
  staggerDelay,
} from '../../motion/easing';
import {REEL_SZENEN, REEL_DAUER_IN_FRAMES, szenenStart, type ReelSzene} from './reelSzenen';

/**
 * Beispiel-Reel ohne Ton: 13 kurze Szenen, harte Schnitte, ein Gedanke je Szene.
 *
 * Haelt sich an ki/gehirn/BEWEGUNG.md (Corporate, kein Ueberschwinger, ein Held
 * pro Bild) und an ki/src/reels/captionSafe.ts fuer die Untertitelposition.
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
  gut: '#35A06B',
} as const;

const BUEHNE_OBEN = 390;
const BUEHNE_UNTEN = 1160;
const MITTE_X = 540;
const MITTE_Y = (BUEHNE_OBEN + BUEHNE_UNTEN) / 2;

const SATZ = ['Die', 'Katze', 'sitzt', 'auf', 'dem'];
const KANDIDATEN = [
  {wort: 'Sofa', anteil: 62},
  {wort: 'Dach', anteil: 24},
  {wort: 'Mond', anteil: 14},
] as const;

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
  const auge = easedProgress(frame, followThrough(0, 0), 14);
  const zeile = easedProgress(frame, followThrough(0, 1), 18);
  return (
    <div style={{position: 'absolute', left: 96, right: 96, top: 168}}>
      <div
        style={{
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: 5,
          color: F.akzent,
          opacity: auge,
          transform: `translateY(${(1 - auge) * -18}px)`,
        }}
      >
        KI ERKLÄRT
      </div>
      <div
        style={{
          marginTop: 14,
          fontSize: text.length > 30 ? 52 : 62,
          lineHeight: 1.03,
          fontWeight: 900,
          letterSpacing: -2,
          color: F.text,
          opacity: zeile,
          transform: `translateY(${(1 - zeile) * -22}px)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Untertitel: React.FC<{text: string; dauer: number}> = ({text, dauer}) => {
  const frame = useCurrentFrame();
  const rein = easedProgress(frame, 4, 14);
  const raus = easedProgress(frame, dauer - 10, dauer - 2, 'exit');
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
          fontSize: 44,
          lineHeight: 1.2,
          fontWeight: 900,
          color: F.text,
          textShadow: '0 4px 18px rgba(248,247,251,.95), 0 0 30px rgba(248,247,251,.9)',
          opacity: rein * (1 - raus),
          transform: `translateY(${(1 - rein) * 14}px)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Wortkarte: React.FC<{
  x: number;
  y: number;
  label: string;
  auftritt: number;
  aktiv?: boolean;
  breite?: number;
}> = ({x, y, label, auftritt, aktiv = false, breite = 150}) => {
  const form = makeRect({width: breite, height: 70, cornerRadius: 20});
  return (
    <g opacity={auftritt}>
      <g transform={`translate(${x - breite / 2}, ${y - 35 + (1 - auftritt) * 12})`}>
        <path
          d={form.path}
          fill={aktiv ? F.akzent : F.weiss}
          stroke={aktiv ? F.akzent : F.hell}
          strokeWidth={3}
        />
      </g>
      <text
        x={x}
        y={y + 11 + (1 - auftritt) * 12}
        textAnchor="middle"
        fontSize={30}
        fontWeight={800}
        fill={aktiv ? F.weiss : F.text}
      >
        {label}
      </text>
    </g>
  );
};

const reihe = (index: number, anzahl: number, abstand = 172): number =>
  MITTE_X + (index - (anzahl - 1) / 2) * abstand;

const Buehne: React.FC<{szene: ReelSzene}> = ({szene}) => {
  const frame = useCurrentFrame();
  const m = szene.mechanik;

  if (m === 'satz' || m === 'zerfall') {
    const zerfall = m === 'zerfall' ? easedProgress(frame, 16, 62, 'exit') : 0;
    return (
      <svg width="1080" height="1920">
        {SATZ.map((wort, index) => {
          const auftritt = easedProgress(
            frame,
            10 + staggerDelay(index, 5),
            26 + staggerDelay(index, 5),
          );
          const streu = (index % 2 === 0 ? -1 : 1) * zerfall * 46;
          return (
            <g key={wort} transform={`translate(0, ${streu})`} opacity={1 - zerfall * 0.72}>
              <Wortkarte
                x={reihe(index, SATZ.length)}
                y={MITTE_Y}
                label={wort}
                auftritt={auftritt}
              />
            </g>
          );
        })}
      </svg>
    );
  }

  if (m === 'tokens') {
    const teile = ['Die', 'Kat', 'ze', 'sitzt', 'auf', 'dem'];
    return (
      <svg width="1080" height="1920">
        {teile.map((teil, index) => {
          const auftritt = easedProgress(
            frame,
            8 + staggerDelay(index, 6),
            26 + staggerDelay(index, 6),
          );
          const x = reihe(index, teile.length, 150);
          return (
            <g key={`${teil}-${index}`}>
              <Wortkarte
                x={x}
                y={MITTE_Y}
                label={teil}
                auftritt={auftritt}
                aktiv={index === 1 || index === 2}
                breite={128}
              />
              <text
                x={x}
                y={MITTE_Y + 78}
                textAnchor="middle"
                fontSize={19}
                fontWeight={900}
                letterSpacing={2}
                fill={F.gedaempft}
                opacity={auftritt}
              >
                {index + 1}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  if (m === 'zahlen') {
    const teile = ['Die', 'Kat', 'ze', 'sitzt', 'auf', 'dem'];
    const zahlen = [412, 8801, 55, 1290, 77, 301];
    const wechsel = easedProgress(frame, 22, 74, 'move');
    return (
      <svg width="1080" height="1920">
        {teile.map((teil, index) => {
          const x = reihe(index, teile.length, 150);
          const eigen = Math.max(0, Math.min(1, (wechsel - index * 0.08) / 0.6));
          return (
            <g key={`${teil}-${index}`}>
              <g opacity={1 - eigen}>
                <Wortkarte x={x} y={MITTE_Y} label={teil} auftritt={1} breite={128} />
              </g>
              <g opacity={eigen}>
                <Wortkarte
                  x={x}
                  y={MITTE_Y}
                  label={String(zahlen[index])}
                  auftritt={1}
                  aktiv
                  breite={128}
                />
              </g>
            </g>
          );
        })}
      </svg>
    );
  }

  if (m === 'raum') {
    const punkte = [
      {label: 'Katze', x: 400, y: MITTE_Y - 120},
      {label: 'Hund', x: 520, y: MITTE_Y - 60},
      {label: 'Tier', x: 452, y: MITTE_Y + 34},
      {label: 'Auto', x: 800, y: MITTE_Y + 150},
    ];
    const kreis = makeCircle({radius: 13});
    return (
      <svg width="1080" height="1920">
        <g opacity={easedProgress(frame, 10, 40)}>
          <circle cx={460} cy={MITTE_Y - 30} r={185} fill={F.zart} opacity={0.55} />
        </g>
        {punkte.map((punkt, index) => {
          const auftritt = easedProgress(
            frame,
            14 + staggerDelay(index, 7),
            34 + staggerDelay(index, 7),
          );
          return (
            <g key={punkt.label} opacity={auftritt}>
              <g transform={`translate(${punkt.x - 13}, ${punkt.y - 13})`}>
                <path d={kreis.path} fill={index === 3 ? F.gedaempft : F.akzent} />
              </g>
              <text
                x={punkt.x}
                y={punkt.y - 30}
                textAnchor="middle"
                fontSize={28}
                fontWeight={900}
                fill={index === 3 ? F.gedaempft : F.text}
              >
                {punkt.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  if (m === 'kontext') {
    const bogen = 'M 250 700 C 380 560, 560 560, 690 700';
    const bogen2 = 'M 340 700 C 460 600, 640 600, 760 700';
    const l1 = evolvePath(easedProgress(frame, 16, 58), bogen);
    const l2 = evolvePath(easedProgress(frame, 34, 78), bogen2);
    return (
      <svg width="1080" height="1920">
        <path d={bogen} fill="none" stroke={F.akzent} strokeWidth={7} strokeLinecap="round" {...l1} />
        <path d={bogen2} fill="none" stroke={F.hell} strokeWidth={6} strokeLinecap="round" {...l2} />
        {['Die', 'Katze', 'sitzt', 'auf'].map((wort, index) => (
          <Wortkarte
            key={wort}
            x={250 + index * 170}
            y={740}
            label={wort}
            auftritt={easedProgress(frame, 6 + staggerDelay(index, 4), 22 + staggerDelay(index, 4))}
            aktiv={index === 1}
            breite={152}
          />
        ))}
      </svg>
    );
  }

  if (m === 'frage') {
    const puls = easedProgress(frame, 10, 40);
    const form = makeRect({width: 420, height: 160, cornerRadius: 40});
    return (
      <svg width="1080" height="1920">
        <g
          opacity={puls}
          transform={`translate(${MITTE_X - 210}, ${MITTE_Y - 80 + (1 - puls) * 18})`}
        >
          <path d={form.path} fill={F.akzent} />
        </g>
        <text
          x={MITTE_X}
          y={MITTE_Y + 20}
          textAnchor="middle"
          fontSize={92}
          fontWeight={900}
          fill={F.weiss}
          opacity={puls}
        >
          ?
        </text>
      </svg>
    );
  }

  if (m === 'saeulen' || m === 'wahl') {
    const abgang = m === 'wahl' ? easedProgress(frame, 26, 70, 'exit') : 0;
    const basis = BUEHNE_UNTEN - 90;
    return (
      <svg width="1080" height="1920">
        {KANDIDATEN.map((kandidat, index) => {
          const start = 10 + staggerDelay(index, 8);
          const wachsen = easedProgress(frame, start, start + 34);
          const gewinner = index === 0;
          const hoehe = (kandidat.anteil / 100) * 430 * wachsen;
          const x = reihe(index, KANDIDATEN.length, 280);
          const weg = gewinner ? 0 : abgang;
          return (
            <g key={kandidat.wort} opacity={1 - weg} transform={`translate(0, ${weg * 40})`}>
              <rect
                x={x - 95}
                y={basis - hoehe}
                width={190}
                height={Math.max(2, hoehe)}
                rx={24}
                fill={gewinner ? F.akzent : F.weiss}
                stroke={F.hell}
                strokeWidth={3}
              />
              <text
                x={x}
                y={basis - hoehe - 26}
                textAnchor="middle"
                fontSize={42}
                fontWeight={900}
                fill={gewinner ? F.akzent : F.text}
              >
                {Math.round(kandidat.anteil * wachsen)} %
              </text>
              <text
                x={x}
                y={basis + 56}
                textAnchor="middle"
                fontSize={34}
                fontWeight={900}
                fill={gewinner ? F.akzent : F.gedaempft}
              >
                {kandidat.wort}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  if (m === 'schleife') {
    const ring = 'M 540 620 m -150 0 a 150 150 0 1 1 300 0 a 150 150 0 1 1 -300 0';
    const laenge = getLength(ring);
    const fahrt = easedProgress(frame, 8, 92, 'move');
    const punkt = getPointAtLength(ring, fahrt * laenge) ?? {x: 390, y: 620};
    const kreis = makeCircle({radius: 16});
    return (
      <svg width="1080" height="1920">
        <path d={ring} fill="none" stroke={F.zart} strokeWidth={14} />
        <path
          d={ring}
          fill="none"
          stroke={F.akzent}
          strokeWidth={14}
          strokeLinecap="round"
          {...evolvePath(fahrt, ring)}
        />
        <g transform={`translate(${punkt.x - 16}, ${punkt.y - 16})`}>
          <path d={kreis.path} fill={F.akzent} />
        </g>
        <text x={MITTE_X} y={638} textAnchor="middle" fontSize={34} fontWeight={900} fill={F.text}>
          nächstes Wort
        </text>
      </svg>
    );
  }

  if (m === 'antwort') {
    const woerter = ['Die', 'Katze', 'sitzt', 'auf', 'dem', 'Sofa'];
    return (
      <svg width="1080" height="1920">
        {woerter.map((wort, index) => {
          const auftritt = easedProgress(
            frame,
            8 + staggerDelay(index, 16),
            28 + staggerDelay(index, 16),
          );
          const zeileIndex = index < 3 ? 0 : 1;
          const inZeile = index < 3 ? index : index - 3;
          return (
            <Wortkarte
              key={wort}
              x={reihe(inZeile, 3, 250)}
              y={MITTE_Y - 70 + zeileIndex * 150}
              label={wort}
              auftritt={auftritt}
              aktiv={index === 5}
              breite={220}
            />
          );
        })}
      </svg>
    );
  }

  if (m === 'grenze') {
    const auftritt = easedProgress(frame, 10, 36);
    const warnung = easedProgress(frame, 40, 72);
    const form = makeRect({width: 560, height: 190, cornerRadius: 36});
    return (
      <svg width="1080" height="1920">
        <g opacity={auftritt} transform={`translate(${MITTE_X - 280}, ${MITTE_Y - 165})`}>
          <path d={form.path} fill={F.weiss} stroke={F.hell} strokeWidth={4} />
        </g>
        <text x={MITTE_X} y={MITTE_Y - 55} textAnchor="middle" fontSize={40} fontWeight={900} fill={F.text} opacity={auftritt}>
          klingt richtig
        </text>
        <g opacity={warnung} transform={`translate(${MITTE_X - 280}, ${MITTE_Y + 40})`}>
          <path d={form.path} fill="#FDF3EA" stroke={F.warn} strokeWidth={4} />
        </g>
        <text x={MITTE_X} y={MITTE_Y + 150} textAnchor="middle" fontSize={40} fontWeight={900} fill={F.warn} opacity={warnung}>
          ist nicht geprüft
        </text>
      </svg>
    );
  }

  const schluss = easedProgress(frame, 12, 46);
  const zweite = easedProgress(frame, followThrough(30, 2), 74);
  return (
    <svg width="1080" height="1920">
      <text
        x={MITTE_X}
        y={MITTE_Y - 30}
        textAnchor="middle"
        fontSize={70}
        fontWeight={900}
        fill={F.akzent}
        opacity={schluss}
      >
        Wahrscheinlichkeit
      </text>
      <text
        x={MITTE_X}
        y={MITTE_Y + 70}
        textAnchor="middle"
        fontSize={54}
        fontWeight={900}
        fill={F.text}
        opacity={zweite}
      >
        ist keine Wahrheit
      </text>
    </svg>
  );
};

const Fortschritt: React.FC = () => {
  const frame = useCurrentFrame();
  const anteil = interpolate(frame, [0, REEL_DAUER_IN_FRAMES - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{position: 'absolute', left: 96, right: 96, bottom: 96, height: 7}}>
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
  );
};

export const ReelVomSatzZurAntwort: React.FC = () => (
  <AbsoluteFill style={{background: F.grund, fontFamily: 'Arial, Helvetica, sans-serif'}}>
    <Korn />
    {REEL_SZENEN.map((szene, index) => (
      <Sequence
        key={szene.id}
        from={szenenStart(index)}
        durationInFrames={szene.dauer}
        name={szene.ueberschrift}
      >
        <Ueberschrift text={szene.ueberschrift} />
        <Buehne szene={szene} />
        <Untertitel text={szene.untertitel} dauer={szene.dauer} />
      </Sequence>
    ))}
    <Fortschritt />
  </AbsoluteFill>
);
