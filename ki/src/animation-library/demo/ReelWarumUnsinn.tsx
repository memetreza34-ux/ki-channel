import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {REEL_CAPTION_SAFE} from '../../reels/captionSafe';
import {easedProgress, staggerDelay} from '../../motion/easing';
import {REEL_CUES} from './reelSkript';
import {
  REEL_SZENEN,
  type ReelSzene,
  type SzenenMechanik,
} from './reelSzenenAusSkript';

/**
 * "Warum KI manchmal Unsinn erzaehlt" - Creative-Demo ohne Ton.
 *
 * Diese Fassung vermeidet die alte Karten-Grammatik bewusst. Jede Szene hat
 * einen sichtbaren Mechanismus: Objekt entsteht, reist, wird ausgewaehlt,
 * umgeht eine Pruefung oder wird mit einer Quelle verbunden.
 */

const F = {
  grund: '#F8F7FB',
  text: '#1A1A2E',
  akzent: '#6E45C9',
  hell: '#B98CFF',
  zart: '#EDE4FB',
  gedaempft: '#8B8399',
  weiss: '#FFFFFF',
  warn: '#D9684B',
  warnZart: '#FCEAE5',
  gut: '#35A06B',
  gutZart: '#E9F6EF',
} as const;

const MITTE_X = 540;
const BUEHNE_Y = 730;

const Korn: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
      backgroundSize: '180px 180px',
      opacity: 0.028,
      mixBlendMode: 'multiply',
    }}
  />
);

const Icon: React.FC<{mechanik: SzenenMechanik; progress: number}> = ({mechanik, progress}) => {
  const common = {stroke: F.akzent, strokeWidth: 4, fill: 'none', strokeLinecap: 'round' as const};
  return (
    <svg width="66" height="66" viewBox="0 0 66 66" style={{opacity: progress}}>
      <circle cx="33" cy="33" r="30" fill={F.zart} />
      {mechanik === 'fake-source-hook' && (
        <>
          <path d="M22 16 H39 L47 24 V50 H22 Z" {...common} />
          <path d="M39 16 V25 H47" {...common} />
          <path d="M26 39 L42 29 M28 29 L43 43" stroke={F.warn} strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {mechanik === 'search-vs-generate' && (
        <>
          <circle cx="29" cy="29" r="11" {...common} />
          <path d="M37 37 L48 48" {...common} />
          <path d="M18 53 H48" stroke={F.warn} strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {mechanik === 'token-stream' && (
        <>
          <circle cx="20" cy="33" r="5" fill={F.akzent} />
          <circle cx="33" cy="33" r="7" fill={F.hell} />
          <circle cx="47" cy="33" r="9" fill={F.akzent} />
        </>
      )}
      {mechanik === 'probability-field' && (
        <>
          <path d="M18 48 V35 M33 48 V25 M48 48 V17" {...common} />
          <path d="M14 48 H52" {...common} />
        </>
      )}
      {mechanik === 'sampling' && (
        <>
          <circle cx="20" cy="37" r="5" fill={F.hell} />
          <circle cx="33" cy="28" r="7" fill={F.akzent} />
          <circle cx="48" cy="39" r="4" fill={F.hell} />
          <path d="M31 49 L39 41" {...common} />
        </>
      )}
      {mechanik === 'verification-gate' && (
        <>
          <path d="M18 22 H48 V46 H18 Z" {...common} />
          <path d="M25 34 L31 40 L42 27" stroke={F.warn} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )}
      {mechanik === 'same-fluency' && (
        <>
          <path d="M17 24 H49 M17 33 H49 M17 42 H49" {...common} />
        </>
      )}
      {mechanik === 'grounding-tools' && (
        <>
          <circle cx="21" cy="33" r="7" {...common} />
          <circle cx="45" cy="33" r="7" {...common} />
          <path d="M28 33 H38" {...common} />
        </>
      )}
      {mechanik === 'tool-limits' && (
        <>
          <path d="M33 15 L52 49 H14 Z" {...common} />
          <path d="M33 26 V37" {...common} />
          <circle cx="33" cy="44" r="2.5" fill={F.akzent} />
        </>
      )}
      {mechanik === 'manual-check' && (
        <path d="M17 34 L28 45 L50 20" stroke={F.akzent} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {mechanik === 'draft-vs-proof' && (
        <>
          <path d="M17 19 H30 V48 H17 Z M36 19 H49 V48 H36 Z" {...common} />
          <path d="M30 33 H36" {...common} />
        </>
      )}
    </svg>
  );
};

const Ueberschrift: React.FC<{text: string; mechanik: SzenenMechanik}> = ({text, mechanik}) => {
  const frame = useCurrentFrame();
  const icon = easedProgress(frame, 0, 12);
  const titel = easedProgress(frame, 5, 18);
  return (
    <div
      style={{
        position: 'absolute',
        top: 122,
        left: 100,
        right: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Icon mechanik={mechanik} progress={icon} />
      <div
        style={{
          marginTop: 14,
          maxWidth: 820,
          fontSize: text.length > 31 ? 42 : 48,
          lineHeight: 1.04,
          fontWeight: 900,
          letterSpacing: -1.4,
          color: F.akzent,
          opacity: titel,
          transform: `translateY(${(1 - titel) * 14}px)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/**
 * Caption bleibt global und folgt dem Sprecher statt dem Szenenschnitt.
 * Die aktive Wortmarkierung ist in Phase 1 gleichmaessig geschaetzt und wird
 * in Phase 3 durch echte Voiceover-Timestamps ersetzt.
 */
const Untertitel: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = REEL_CUES.find((c) => frame >= c.startFrame && frame < c.endFrame);
  if (!cue) return null;

  const rein = easedProgress(frame, cue.startFrame, cue.startFrame + 5);
  const raus = easedProgress(frame, cue.endFrame - 5, cue.endFrame, 'exit');
  const woerter = cue.text.split(' ');
  const lokalePosition = (frame - cue.startFrame) / Math.max(1, cue.endFrame - cue.startFrame);
  const aktiv = Math.min(woerter.length - 1, Math.floor(lokalePosition * woerter.length));

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
          textShadow: '0 3px 16px rgba(248,247,251,.96), 0 0 34px rgba(248,247,251,.92)',
          opacity: rein * (1 - raus),
          transform: `translateY(${(1 - rein) * 10}px)`,
        }}
      >
        {woerter.map((wort, index) => (
          <span key={`${wort}-${index}`} style={{color: index === aktiv ? F.akzent : F.text}}>
            {wort}{index < woerter.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

const Dokument: React.FC<{
  x: number;
  y: number;
  progress: number;
  titel: string;
  status?: 'neutral' | 'gut' | 'warn';
  scale?: number;
}> = ({x, y, progress, titel, status = 'neutral', scale = 1}) => {
  const stroke = status === 'gut' ? F.gut : status === 'warn' ? F.warn : F.hell;
  return (
    <g opacity={progress} transform={`translate(${x}, ${y + (1 - progress) * 22}) scale(${scale})`}>
      <path d="M-150 -160 H88 L150 -98 V160 H-150 Z" fill={F.weiss} stroke={stroke} strokeWidth={4} />
      <path d="M88 -160 V-98 H150" fill={F.zart} stroke={stroke} strokeWidth={4} />
      <text x="0" y="-72" textAnchor="middle" fontSize="27" fontWeight="900" fill={F.text}>{titel}</text>
      <line x1="-105" y1="-28" x2="105" y2="-28" stroke={F.zart} strokeWidth="13" strokeLinecap="round" />
      <line x1="-105" y1="12" x2="75" y2="12" stroke={F.zart} strokeWidth="13" strokeLinecap="round" />
      <line x1="-105" y1="52" x2="98" y2="52" stroke={F.zart} strokeWidth="13" strokeLinecap="round" />
      <line x1="-105" y1="92" x2="42" y2="92" stroke={F.zart} strokeWidth="13" strokeLinecap="round" />
    </g>
  );
};

const Buehne: React.FC<{szene: ReelSzene}> = ({szene}) => {
  const frame = useCurrentFrame();
  const m = szene.mechanik;

  if (m === 'fake-source-hook') {
    const quelle = easedProgress(frame, 3, 23);
    const alarm = easedProgress(frame, 48, 72);
    const stempel = 1.08 - alarm * 0.08;
    return (
      <svg width="1080" height="1240" style={{position: 'absolute', top: 330}}>
        <circle cx="250" cy="400" r="88" fill={F.zart} opacity={quelle} />
        <text x="250" y="411" textAnchor="middle" fontSize="27" fontWeight="900" fill={F.akzent} opacity={quelle}>KI</text>
        <path d="M340 400 C410 400 425 400 475 400" fill="none" stroke={F.hell} strokeWidth="9" strokeLinecap="round" opacity={quelle} />
        <Dokument x={650} y={400} progress={quelle} titel="Muster et al., 2024" status={alarm > 0.5 ? 'warn' : 'neutral'} scale={0.88} />
        <text x="650" y="250" textAnchor="middle" fontSize="20" fontWeight="900" letterSpacing="4" fill={F.gedaempft} opacity={quelle}>BEISPIELQUELLE</text>
        <g opacity={alarm} transform={`translate(650 400) scale(${stempel}) rotate(-8)`}>
          <rect x="-178" y="-46" width="356" height="92" rx="18" fill={F.warnZart} stroke={F.warn} strokeWidth="6" />
          <text x="0" y="14" textAnchor="middle" fontSize="38" fontWeight="900" fill={F.warn}>NICHT GEFUNDEN</text>
        </g>
      </svg>
    );
  }

  if (m === 'search-vs-generate') {
    const links = easedProgress(frame, 5, 24);
    const rechts = easedProgress(frame, 24, 48);
    const kreuz = easedProgress(frame, 46, 65);
    return (
      <svg width="1080" height="1240" style={{position: 'absolute', top: 330}}>
        <line x1="540" y1="250" x2="540" y2="760" stroke={F.zart} strokeWidth="4" />
        <g opacity={links}>
          <circle cx="285" cy="455" r="88" fill={F.weiss} stroke={F.hell} strokeWidth="5" />
          <circle cx="270" cy="440" r="35" fill="none" stroke={F.akzent} strokeWidth="8" />
          <line x1="295" y1="466" x2="330" y2="500" stroke={F.akzent} strokeWidth="8" strokeLinecap="round" />
          <text x="285" y="590" textAnchor="middle" fontSize="30" fontWeight="900" fill={F.gedaempft}>SUCHEN</text>
          <path d="M205 370 L365 540" stroke={F.warn} strokeWidth="10" strokeLinecap="round" opacity={kreuz} />
        </g>
        <g opacity={rechts}>
          <circle cx="795" cy="455" r="88" fill={F.akzent} />
          <text x="795" y="466" textAnchor="middle" fontSize="30" fontWeight="900" fill={F.weiss}>MODELL</text>
          {[0, 1, 2, 3].map((i) => {
            const p = easedProgress(frame, 30 + staggerDelay(i, 8), 48 + staggerDelay(i, 8));
            return <circle key={i} cx={680 + i * 74} cy={650} r={12 + i * 2} fill={i % 2 === 0 ? F.hell : F.akzent} opacity={p} />;
          })}
          <text x="795" y="724" textAnchor="middle" fontSize="30" fontWeight="900" fill={F.akzent}>FORTSETZEN</text>
        </g>
      </svg>
    );
  }

  if (m === 'token-stream') {
    const woerter = ['Diese', 'Studie', 'ist', 'nicht', 'echt'];
    return (
      <svg width="1080" height="1240" style={{position: 'absolute', top: 330}}>
        <path d="M125 470 C330 470 360 650 540 650 C720 650 750 470 950 470" fill="none" stroke={F.zart} strokeWidth="12" strokeLinecap="round" />
        {woerter.map((wort, index) => {
          const p = easedProgress(frame, 5 + staggerDelay(index, 9), 28 + staggerDelay(index, 9), 'move');
          const x = 150 + index * 190;
          const y = 470 + Math.sin(index * 1.35) * 78;
          return (
            <g key={wort} opacity={p} transform={`translate(${x}, ${y + (1 - p) * 45})`}>
              <circle cx="0" cy="0" r={45 + wort.length * 2} fill={index === 1 ? F.akzent : F.weiss} stroke={F.hell} strokeWidth="4" />
              <text x="0" y="9" textAnchor="middle" fontSize="24" fontWeight="900" fill={index === 1 ? F.weiss : F.text}>{wort}</text>
            </g>
          );
        })}
        <text x="540" y="805" textAnchor="middle" fontSize="31" fontWeight="900" fill={F.akzent}>TEXT → TOKEN-FOLGE</text>
      </svg>
    );
  }

  if (m === 'probability-field') {
    const kandidaten = [
      {label: 'Quelle', hoehe: 300},
      {label: 'Studie', hoehe: 210},
      {label: 'Bericht', hoehe: 135},
    ];
    return (
      <svg width="1080" height="1240" style={{position: 'absolute', top: 330}}>
        <line x1="160" y1="760" x2="920" y2="760" stroke={F.zart} strokeWidth="7" strokeLinecap="round" />
        {kandidaten.map((k, index) => {
          const p = easedProgress(frame, 4 + staggerDelay(index, 9), 34 + staggerDelay(index, 9));
          const x = 280 + index * 260;
          const h = k.hoehe * p;
          return (
            <g key={k.label}>
              <rect x={x - 62} y={760 - h} width="124" height={Math.max(2, h)} rx="38" fill={index === 0 ? F.akzent : F.hell} opacity={p} />
              <text x={x} y="820" textAnchor="middle" fontSize="31" fontWeight="900" fill={index === 0 ? F.akzent : F.text} opacity={p}>{k.label}</text>
            </g>
          );
        })}
        <text x="540" y="325" textAnchor="middle" fontSize="28" fontWeight="900" fill={F.gedaempft}>PLAUSIBILITÄT IM KONTEXT</text>
      </svg>
    );
  }

  if (m === 'sampling') {
    const wahl = easedProgress(frame, 8, 42, 'move');
    const zielX = 540 + Math.sin(wahl * Math.PI * 2.2) * (1 - wahl) * 210;
    const kandidaten = [330, 540, 750];
    return (
      <svg width="1080" height="1240" style={{position: 'absolute', top: 330}}>
        {kandidaten.map((x, i) => (
          <g key={x}>
            <circle cx={x} cy="530" r={i === 0 ? 78 : i === 1 ? 62 : 48} fill={i === 1 && wahl > 0.92 ? F.akzent : F.weiss} stroke={F.hell} strokeWidth="6" />
            <text x={x} y="540" textAnchor="middle" fontSize="30" fontWeight="900" fill={i === 1 && wahl > 0.92 ? F.weiss : F.text}>{['A', 'B', 'C'][i]}</text>
          </g>
        ))}
        <path d={`M${zielX - 30} 330 L${zielX + 30} 330 L${zielX} 390 Z`} fill={F.akzent} />
        <line x1={zielX} y1="390" x2={zielX} y2="435" stroke={F.akzent} strokeWidth="7" strokeLinecap="round" />
        <text x="540" y="710" textAnchor="middle" fontSize="31" fontWeight="900" fill={F.akzent}>AUSWAHL AUS DER VERTEILUNG</text>
        <text x="540" y="760" textAnchor="middle" fontSize="25" fontWeight="800" fill={F.gedaempft}>nicht zwingend immer Kandidat A</text>
      </svg>
    );
  }

  if (m === 'verification-gate') {
    const fahrt = easedProgress(frame, 8, 62, 'move');
    const x = 180 + fahrt * 700;
    const gate = easedProgress(frame, 22, 42);
    return (
      <svg width="1080" height="1240" style={{position: 'absolute', top: 330}}>
        <path d="M150 440 H900" stroke={F.zart} strokeWidth="14" strokeLinecap="round" />
        <circle cx={x} cy="440" r="34" fill={F.akzent} />
        <text x={x} y="449" textAnchor="middle" fontSize="22" fontWeight="900" fill={F.weiss}>?</text>
        <g opacity={gate}>
          <path d="M475 610 H605 V770 H475 Z" fill={F.warnZart} stroke={F.warn} strokeWidth="5" strokeDasharray="12 12" />
          <text x="540" y="685" textAnchor="middle" fontSize="28" fontWeight="900" fill={F.warn}>PRÜFEN</text>
          <text x="540" y="728" textAnchor="middle" fontSize="23" fontWeight="800" fill={F.gedaempft}>externes Werkzeug</text>
          <path d="M540 610 V525" stroke={F.warn} strokeWidth="5" strokeDasharray="10 12" />
          <circle cx="540" cy="525" r="10" fill={F.warn} />
        </g>
        <text x="540" y="320" textAnchor="middle" fontSize="28" fontWeight="900" fill={F.gedaempft}>OHNE WERKZEUG LÄUFT DIE ANTWORT WEITER</text>
      </svg>
    );
  }

  if (m === 'same-fluency') {
    const a = easedProgress(frame, 4, 22);
    const b = easedProgress(frame, 14, 32);
    const reveal = easedProgress(frame, 48, 72);
    return (
      <svg width="1080" height="1240" style={{position: 'absolute', top: 330}}>
        <Dokument x={330} y={500} progress={a} titel="Quelle A" status={reveal > 0.55 ? 'gut' : 'neutral'} scale={0.78} />
        <Dokument x={750} y={500} progress={b} titel="Quelle B" status={reveal > 0.55 ? 'warn' : 'neutral'} scale={0.78} />
        <g opacity={reveal}>
          <text x="330" y="785" textAnchor="middle" fontSize="30" fontWeight="900" fill={F.gut}>BELEGT</text>
          <text x="750" y="785" textAnchor="middle" fontSize="30" fontWeight="900" fill={F.warn}>ERFUNDEN</text>
        </g>
        <text x="540" y="910" textAnchor="middle" fontSize="26" fontWeight="900" fill={F.gedaempft} opacity={reveal}>gleiche Sprachglätte ≠ gleicher Wahrheitswert</text>
      </svg>
    );
  }

  if (m === 'grounding-tools') {
    const draw = easedProgress(frame, 5, 48, 'move');
    const rueck = easedProgress(frame, 48, 78, 'move');
    return (
      <svg width="1080" height="1240" style={{position: 'absolute', top: 330}}>
        <circle cx="200" cy="520" r="82" fill={F.akzent} />
        <text x="200" y="531" textAnchor="middle" fontSize="28" fontWeight="900" fill={F.weiss}>MODELL</text>
        <circle cx="540" cy="520" r="82" fill={F.weiss} stroke={F.hell} strokeWidth="6" />
        <circle cx="540" cy="505" r="29" fill="none" stroke={F.akzent} strokeWidth="7" />
        <line x1="560" y1="527" x2="588" y2="555" stroke={F.akzent} strokeWidth="7" strokeLinecap="round" />
        <text x="540" y="665" textAnchor="middle" fontSize="28" fontWeight="900" fill={F.text}>WEBSUCHE</text>
        <g opacity={rueck}>
          <Dokument x={860} y={520} progress={rueck} titel="Quelle" status="gut" scale={0.58} />
        </g>
        <path d="M290 520 H450" stroke={F.hell} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${draw * 160} 180`} />
        <path d="M630 520 H748" stroke={F.hell} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${rueck * 118} 140`} />
        <path d="M825 760 C650 880 390 880 230 650" fill="none" stroke={F.gut} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${rueck * 700} 760`} />
        <text x="540" y="900" textAnchor="middle" fontSize="30" fontWeight="900" fill={F.gut} opacity={rueck}>ABRUFEN → ABGLEICHEN → ANTWORTEN</text>
      </svg>
    );
  }

  if (m === 'tool-limits') {
    const weg = easedProgress(frame, 8, 48, 'exit');
    const punkte = [305, 420, 535, 650, 765];
    return (
      <svg width="1080" height="1240" style={{position: 'absolute', top: 330}}>
        <path d="M180 520 H900" stroke={F.gut} strokeWidth="12" strokeLinecap="round" />
        <circle cx="225" cy="520" r="56" fill={F.gutZart} stroke={F.gut} strokeWidth="5" />
        <text x="225" y="529" textAnchor="middle" fontSize="23" fontWeight="900" fill={F.gut}>TOOL</text>
        {punkte.map((x, i) => {
          const verschwindet = i < 4 ? weg : 0;
          return <circle key={x} cx={x} cy={520} r="19" fill={F.warn} opacity={1 - verschwindet} transform={`translate(0 ${verschwindet * -45})`} />;
        })}
        <text x="540" y="710" textAnchor="middle" fontSize="38" fontWeight="900" fill={F.text}>RISIKO WIRD KLEINER</text>
        <text x="540" y="770" textAnchor="middle" fontSize="31" fontWeight="900" fill={F.warn}>ABER NICHT AUTOMATISCH NULL</text>
      </svg>
    );
  }

  if (m === 'manual-check') {
    const items = [
      {label: 'ZAHLEN', x: 300},
      {label: 'NAMEN', x: 540},
      {label: 'QUELLEN', x: 780},
    ];
    return (
      <svg width="1080" height="1240" style={{position: 'absolute', top: 330}}>
        {items.map((item, index) => {
          const p = easedProgress(frame, 5 + staggerDelay(index, 12), 29 + staggerDelay(index, 12));
          const check = easedProgress(frame, 32 + staggerDelay(index, 12), 48 + staggerDelay(index, 12));
          return (
            <g key={item.label} opacity={p}>
              <circle cx={item.x} cy="520" r="92" fill={F.weiss} stroke={check > 0.6 ? F.gut : F.hell} strokeWidth="6" />
              <text x={item.x} y="535" textAnchor="middle" fontSize="27" fontWeight="900" fill={F.text}>{item.label}</text>
              <path d={`M${item.x - 34} 670 L${item.x - 5} 698 L${item.x + 45} 645`} fill="none" stroke={F.gut} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity={check} />
            </g>
          );
        })}
        <text x="540" y="850" textAnchor="middle" fontSize="31" fontWeight="900" fill={F.gut}>ÖFFNEN. ABGLEICHEN. BESTÄTIGEN.</text>
      </svg>
    );
  }

  const trenner = easedProgress(frame, 8, 30);
  const quelle = easedProgress(frame, 30, 58);
  return (
    <svg width="1080" height="1240" style={{position: 'absolute', top: 330}}>
      <g opacity={trenner}>
        <path d="M160 400 H460 V690 H160 Z" fill={F.zart} stroke={F.hell} strokeWidth="5" />
        <text x="310" y="515" textAnchor="middle" fontSize="37" fontWeight="900" fill={F.akzent}>ENTWURF</text>
        <text x="310" y="570" textAnchor="middle" fontSize="25" fontWeight="800" fill={F.gedaempft}>Idee · Struktur · Erklärung</text>
        <path d="M500 545 H610" stroke={F.akzent} strokeWidth="10" strokeLinecap="round" />
        <path d="M585 520 L620 545 L585 570" fill="none" stroke={F.akzent} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g opacity={quelle}>
        <path d="M650 400 H920 V690 H650 Z" fill={F.weiss} stroke={F.gut} strokeWidth="5" />
        <text x="785" y="495" textAnchor="middle" fontSize="33" fontWeight="900" fill={F.gut}>BELEG</text>
        <path d="M705 560 L760 615 L865 505" fill="none" stroke={F.gut} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
        <text x="785" y="760" textAnchor="middle" fontSize="25" fontWeight="900" fill={F.gedaempft}>braucht eine prüfbare Quelle</text>
      </g>
    </svg>
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
        <Ueberschrift text={szene.ueberschrift} mechanik={szene.mechanik} />
        <Buehne szene={szene} />
      </Sequence>
    ))}
    <Untertitel />
  </AbsoluteFill>
);
