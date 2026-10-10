import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, EASE, Icon, mix, Music, pop, progress, Sfx, type SfxName} from '../../kit';
import type {Project} from '../types';

/**
 * News-Probe „Deutschlandticket wird teurer“ – schnelles Nachrichten-Design.
 * Fakten (Stand 01.10.2026): 66,80 € ab 1.1.2027 (statt 63 €), 2023: 49 €, 2025: 58 €;
 * Preis-Index aus Personal-, Energie- und allgemeinen Kosten; Jobticket 63,46 €, Semesterticket 40,08 €;
 * Finanzierung bis Ende 2029; Zitat Ingo Wortmann (VDV). Quellen: ADAC 01.10.2026, LOK Report 30.09.2026.
 */

const FPS = 30;
const DAUER = 20.5;
const FONT = 'Inter, sans-serif';
const C = {
  bg: '#F4F5F8',
  navy: '#0B1F3A',
  navy2: '#16305A',
  rot: '#E63946',
  gruen: '#16A34A',
  ink: '#0B1F3A',
  soft: '#5B6577',
  line: '#DDE2EA',
  weiss: '#FFFFFF',
  gelb: '#FFC93C',
};

const fr = (s: number) => Math.round(s * FPS);

const useZeit = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {
    t: frame / FPS,
    p: (start: number, dauer = 0.4, ease: keyof typeof EASE = 'out') => progress(frame, fr(start), Math.max(1, fr(dauer)), ease),
    federn: (start: number, art: 'snappy' | 'smooth' | 'bouncy' = 'snappy') => pop(frame, fps, fr(start), art),
  };
};

/** Abschnitte: [Start, Ende] in Sekunden. Zwischen Abschnitten wischt ein Navy-Balken durchs Bild. */
const TEILE = {
  opener: [0, 3.8],
  verlauf: [3.8, 9.4],
  index: [9.4, 13.8],
  zitat: [13.8, 17.4],
  fazit: [17.4, DAUER],
} as const;
type Teil = keyof typeof TEILE;

/** Rein-/Raus-Bewegung eines Abschnitts (seitlich, mit Kurve). */
const useTeil = (teil: Teil) => {
  const {t, p} = useZeit();
  const [a, b] = TEILE[teil];
  const rein = a === 0 ? 1 : p(a + 0.15, 0.5);
  const raus = b >= DAUER ? 0 : p(b - 0.25, 0.35, 'in');
  return {aktiv: t >= a - 0.05 && t < b + 0.1, rein, raus, x: (1 - rein) * 160 - raus * 160, o: rein * (1 - raus)};
};

/* ───────────── Rahmen: Logo, Datum, Quelle, Fortschritt ───────────── */

const Rahmen: React.FC = () => {
  const {t, p} = useZeit();
  const auf = p(0, 0.5);
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 10, background: C.rot, transform: `scaleX(${auf})`, transformOrigin: 'left'}} />
      <div style={{position: 'absolute', left: 120, top: 62, display: 'flex', alignItems: 'center', gap: 18, opacity: auf}}>
        <div style={{background: C.navy, color: C.weiss, fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: '0.08em', padding: '8px 18px', borderRadius: 8}}>NEWS</div>
        <div style={{background: C.rot, color: C.weiss, fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: '0.1em', padding: '8px 16px', borderRadius: 8}}>VERKEHR</div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.soft}}>30.09.2026</div>
      </div>
      <div style={{position: 'absolute', left: 120, bottom: 60, fontFamily: FONT, fontWeight: 600, fontSize: 28, color: C.soft, opacity: auf}}>
        Quellen: ADAC (01.10.2026), LOK Report (30.09.2026)
      </div>
      <div style={{position: 'absolute', right: 120, bottom: 72, width: 360, height: 8, borderRadius: 4, background: C.line, overflow: 'hidden'}}>
        <div style={{width: `${clamp01(t / DAUER) * 100}%`, height: '100%', background: C.navy}} />
      </div>
    </>
  );
};

/** Wisch-Übergang: Navy-Balken fährt von links nach rechts über das Bild. */
const Wischer: React.FC = () => {
  const {t} = useZeit();
  const grenzen = [TEILE.verlauf[0], TEILE.index[0], TEILE.zitat[0], TEILE.fazit[0]];
  const g = grenzen.find((x) => t > x - 0.35 && t < x + 0.35);
  if (g === undefined) return null;
  const q = EASE.inOut(clamp01((t - (g - 0.35)) / 0.7));
  return <div style={{position: 'absolute', top: 0, bottom: 0, width: 260, left: mix(-300, 1940, q), background: C.navy, transform: 'skewX(-14deg)', boxShadow: `40px 0 0 ${C.rot}`}} />;
};

/* ───────────── 1 · Opener ───────────── */

const Ticket: React.FC<{x: number; y: number}> = ({x, y}) => {
  const {federn, p} = useZeit();
  const rein = federn(0.5, 'smooth');
  const flip = p(2.2, 0.5, 'inOut');
  const preisAlt = flip < 0.5;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 620,
        height: 380,
        borderRadius: 34,
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 100%)`,
        boxShadow: '0 30px 60px rgba(11,31,58,0.25)',
        transform: `translateX(${(1 - rein) * 400}px) rotate(${mix(8, -4, rein)}deg)`,
        opacity: clamp01(rein * 1.5),
        overflow: 'hidden',
        color: C.weiss,
        fontFamily: FONT,
      }}
    >
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 26, background: C.rot}} />
      <div style={{position: 'absolute', left: 64, top: 46, fontSize: 34, fontWeight: 800, letterSpacing: '0.04em', opacity: 0.85}}>DEUTSCHLAND</div>
      <div style={{position: 'absolute', left: 64, top: 90, fontSize: 64, fontWeight: 900}}>Ticket</div>
      <div style={{position: 'absolute', left: 66, top: 172, fontSize: 30, fontWeight: 700, opacity: 0.75}}>pro Monat</div>
      <div
        style={{
          position: 'absolute',
          right: 54,
          bottom: 40,
          fontSize: 118,
          fontWeight: 900,
          letterSpacing: '-0.04em',
          color: preisAlt ? C.weiss : C.gelb,
          transform: `scaleY(${Math.abs(Math.cos(flip * Math.PI))})`,
        }}
      >
        {preisAlt ? '63 €' : '66,80 €'}
      </div>
      <div style={{position: 'absolute', right: -60, top: -60, width: 220, height: 220, borderRadius: '50%', border: '26px solid rgba(255,255,255,0.08)'}} />
    </div>
  );
};

const Opener: React.FC = () => {
  const {p, federn} = useZeit();
  const tl = useTeil('opener');
  if (!tl.aktiv) return null;
  const woerter = ['Deutschlandticket', 'wird', 'teurer'];
  const plus = federn(2.75, 'bouncy');
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${tl.x}px)`, opacity: tl.o}}>
      <div style={{position: 'absolute', left: 120, top: 320, width: 980}}>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 112, lineHeight: 1.0, letterSpacing: '-0.045em', color: C.ink}}>
          {woerter.map((w, i) => {
            const q = p(0.35 + i * 0.16, 0.45);
            return (
              <span key={w} style={{display: 'inline-block', marginRight: 28, opacity: q, transform: `translateY(${(1 - q) * 50}px)`, color: i === 2 ? C.rot : undefined}}>
                {w}
              </span>
            );
          })}
        </div>
        <div style={{marginTop: 34, fontFamily: FONT, fontWeight: 700, fontSize: 48, color: C.soft, opacity: p(1.1, 0.4)}}>ab 1. Januar 2027</div>
        <div style={{marginTop: 18, height: 8, width: 240, background: C.rot, borderRadius: 4, transform: `scaleX(${p(1.3, 0.5)})`, transformOrigin: 'left'}} />
      </div>
      <Ticket x={1180} y={400} />
      <div style={{position: 'absolute', left: 1580, top: 320, transform: `scale(${Math.max(0, plus)}) rotate(-6deg)`, background: C.rot, color: C.weiss, fontFamily: FONT, fontWeight: 900, fontSize: 52, padding: '10px 26px', borderRadius: 14}}>
        + 3,80 €
      </div>
    </div>
  );
};

/* ───────────── 2 · Preisverlauf ───────────── */

const PREISE = [
  {jahr: '2023', wert: 49, label: '49 €'},
  {jahr: '2025', wert: 58, label: '58 €'},
  {jahr: '2026', wert: 63, label: '63 €'},
  {jahr: '2027', wert: 66.8, label: '66,80 €'},
];

const Verlauf: React.FC = () => {
  const {p, federn} = useZeit();
  const tl = useTeil('verlauf');
  if (!tl.aktiv) return null;
  const basis = 900;
  const max = 70;
  const hoehe = 470;
  const x0 = 220;
  const abst = 300;
  const tops = PREISE.map((pr, i) => ({x: x0 + i * abst + 80, y: basis - (pr.wert / max) * hoehe}));
  const linie = p(7.3, 0.8, 'inOut');
  const callout = federn(8.0, 'bouncy');
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${tl.x}px)`, opacity: tl.o}}>
      <div style={{position: 'absolute', left: 120, top: 150, fontFamily: FONT, fontWeight: 900, fontSize: 68, letterSpacing: '-0.035em', color: C.ink, opacity: p(4.0, 0.4)}}>Der Preis seit dem Start</div>
      <div style={{position: 'absolute', left: x0 - 60, top: basis, width: abst * 4 + 40, height: 4, background: C.line}} />
      {PREISE.map((pr, i) => {
        const at = 4.4 + i * 0.55;
        const g = p(at, 0.6);
        const h = (pr.wert / max) * hoehe * g;
        const neu = i === 3;
        return (
          <div key={pr.jahr}>
            <div style={{position: 'absolute', left: x0 + i * abst, top: basis - h, width: 160, height: h, borderRadius: '18px 18px 0 0', background: neu ? C.rot : C.navy2}} />
            <div style={{position: 'absolute', left: x0 + i * abst - 40, width: 240, top: basis - h - 76, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 52, color: neu ? C.rot : C.ink, opacity: p(at + 0.35, 0.3)}}>{pr.label}</div>
            <div style={{position: 'absolute', left: x0 + i * abst - 40, width: 240, top: basis + 18, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 36, color: C.soft, opacity: p(at, 0.3)}}>{pr.jahr}</div>
          </div>
        );
      })}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <polyline points={tops.map((q) => `${q.x},${q.y - 96}`).join(' ')} fill="none" stroke={C.rot} strokeWidth={6} strokeDasharray="14 12" pathLength={1} strokeDashoffset={0} opacity={linie} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 1480,
          top: 360,
          width: 330,
          padding: '26px 30px',
          borderRadius: 24,
          background: C.weiss,
          boxShadow: '0 20px 40px rgba(11,31,58,0.12)',
          transform: `scale(${Math.max(0, callout)})`,
          transformOrigin: 'left top',
          fontFamily: FONT,
        }}
      >
        <div style={{fontSize: 80, fontWeight: 900, color: C.rot, letterSpacing: '-0.04em'}}>+36 %</div>
        <div style={{fontSize: 32, fontWeight: 700, color: C.soft}}>seit dem Start 2023</div>
      </div>
    </div>
  );
};

/* ───────────── 3 · Wie entsteht der Preis? ───────────── */

const Index: React.FC = () => {
  const {p, federn} = useZeit();
  const tl = useTeil('index');
  if (!tl.aktiv) return null;
  const faktoren = [
    {text: 'Personal', icon: 'ph:users-three-fill', at: 10.1},
    {text: 'Energie', icon: 'ph:lightning-fill', at: 10.45},
    {text: 'allgemeine Kosten', icon: 'ph:receipt-fill', at: 10.8},
  ];
  const pfeil = p(11.4, 0.5, 'inOut');
  const ergebnis = federn(11.9, 'bouncy');
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${tl.x}px)`, opacity: tl.o}}>
      <div style={{position: 'absolute', left: 120, top: 150, fontFamily: FONT, fontWeight: 900, fontSize: 68, letterSpacing: '-0.035em', color: C.ink, opacity: p(9.6, 0.4)}}>So entsteht der Preis</div>
      <div style={{position: 'absolute', left: 120, top: 380, display: 'flex', flexDirection: 'column', gap: 28}}>
        {faktoren.map((f) => {
          const q = federn(f.at);
          return (
            <div key={f.text} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '22px 34px 22px 24px', borderRadius: 22, background: C.weiss, boxShadow: '0 12px 28px rgba(11,31,58,0.08)', transform: `translateX(${(1 - clamp01(q)) * -60}px)`, opacity: clamp01(q * 2), width: 520}}>
              <div style={{width: 72, height: 72, borderRadius: 18, background: '#E8EEF8', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon icon={f.icon} size={42} color={C.navy2} animate="none" />
              </div>
              <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.ink}}>{f.text}</div>
            </div>
          );
        })}
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <path d="M700,610 C820,610 860,610 980,610" stroke={C.navy2} strokeWidth={8} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - pfeil} />
        <path d="M960,586 L990,610 L960,634" stroke={C.navy2} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={pfeil > 0.95 ? 1 : 0} />
      </svg>
      <div style={{position: 'absolute', left: 1030, top: 430, width: 720, padding: '40px 46px', borderRadius: 30, background: C.navy, color: C.weiss, fontFamily: FONT, transform: `scale(${Math.max(0, ergebnis)})`, transformOrigin: 'left center'}}>
        <div style={{fontSize: 36, fontWeight: 700, opacity: 0.8}}>Preis-Index → neuer Preis</div>
        <div style={{fontSize: 130, fontWeight: 900, letterSpacing: '-0.045em', color: C.gelb, marginTop: 6}}>66,80 €</div>
        <div style={{fontSize: 32, fontWeight: 700, opacity: 0.8}}>wird jedes Jahr neu berechnet</div>
      </div>
    </div>
  );
};

/* ───────────── 4 · Zitat ───────────── */

const Zitat: React.FC = () => {
  const {p} = useZeit();
  const tl = useTeil('zitat');
  if (!tl.aktiv) return null;
  const worte = '„Das bringt mehr Transparenz und Planbarkeit für unsere Kunden sowie für die Branche.“'.split(' ');
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${tl.x}px)`, opacity: tl.o}}>
      <div style={{position: 'absolute', left: 120, top: 270, width: 12, height: 470, background: C.rot, transform: `scaleY(${p(14.0, 0.5)})`, transformOrigin: 'top'}} />
      <div style={{position: 'absolute', left: 190, top: 260, width: 1500, fontFamily: FONT, fontWeight: 800, fontSize: 76, lineHeight: 1.18, letterSpacing: '-0.03em', color: C.ink}}>
        {worte.map((w, i) => {
          const q = p(14.2 + i * 0.07, 0.3);
          return (
            <span key={i} style={{display: 'inline-block', marginRight: 22, opacity: q, transform: `translateY(${(1 - q) * 20}px)`}}>
              {w}
            </span>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 190, top: 660, display: 'flex', alignItems: 'center', gap: 22, opacity: p(15.4, 0.4)}}>
        <div style={{width: 74, height: 74, borderRadius: '50%', background: '#E8EEF8', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icon icon="ph:microphone-stage-fill" size={40} color={C.navy2} animate="none" />
        </div>
        <div style={{fontFamily: FONT}}>
          <div style={{fontSize: 40, fontWeight: 800, color: C.ink}}>Ingo Wortmann</div>
          <div style={{fontSize: 30, fontWeight: 600, color: C.soft}}>Präsident des Verbands Deutscher Verkehrsunternehmen (VDV)</div>
        </div>
      </div>
    </div>
  );
};

/* ───────────── 5 · Fazit ───────────── */

const Fazit: React.FC = () => {
  const {federn, p} = useZeit();
  const tl = useTeil('fazit');
  if (!tl.aktiv) return null;
  const karten = [
    {titel: 'Deutschlandticket', wert: '66,80 €', farbe: C.rot, at: 17.8},
    {titel: 'als Jobticket', wert: '63,46 €', farbe: C.navy2, at: 18.0},
    {titel: 'als Semesterticket', wert: '40,08 €', farbe: C.navy2, at: 18.2},
  ];
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${tl.x}px)`, opacity: tl.o}}>
      <div style={{position: 'absolute', left: 120, top: 150, fontFamily: FONT, fontWeight: 900, fontSize: 68, letterSpacing: '-0.035em', color: C.ink, opacity: p(17.6, 0.4)}}>Ab 2027 im Überblick</div>
      <div style={{position: 'absolute', left: 120, top: 360, display: 'flex', gap: 36}}>
        {karten.map((k) => {
          const q = federn(k.at);
          return (
            <div key={k.titel} style={{width: 530, padding: '40px 44px', borderRadius: 28, background: C.weiss, boxShadow: '0 16px 36px rgba(11,31,58,0.10)', borderTop: `10px solid ${k.farbe}`, transform: `translateY(${(1 - clamp01(q)) * 60}px)`, opacity: clamp01(q * 2), fontFamily: FONT}}>
              <div style={{fontSize: 36, fontWeight: 700, color: C.soft}}>{k.titel}</div>
              <div style={{fontSize: 100, fontWeight: 900, letterSpacing: '-0.04em', color: k.farbe, marginTop: 8}}>{k.wert}</div>
              <div style={{fontSize: 30, fontWeight: 600, color: C.soft}}>pro Monat</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 120, top: 760, display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT, fontWeight: 700, fontSize: 38, color: C.ink, opacity: p(18.6, 0.4)}}>
        <Icon icon="ph:shield-check-fill" size={44} color={C.gruen} animate="none" />
        Finanzierung gesichert bis Ende 2029
      </div>
    </div>
  );
};

/* ───────────── Töne ───────────── */

const TOENE: [number, SfxName, number][] = [
  [0.05, 'kNotify', 0.5],
  [0.5, 'kSwish', 0.35],
  [2.2, 'kTick', 0.4],
  [2.75, 'kPop', 0.45],
  ...[3.8, 9.4, 13.8, 17.4].map((at) => [at - 0.35, 'kWhoosh', 0.45] as [number, SfxName, number]),
  ...PREISE.map((_, i) => [4.4 + i * 0.55, (['kTick1', 'kTick2', 'kTick3', 'kTick5'] as SfxName[])[i], 0.45] as [number, SfxName, number]),
  [8.0, 'kPop', 0.45],
  [10.1, 'kTick2', 0.35],
  [10.45, 'kTick3', 0.35],
  [10.8, 'kTick4', 0.35],
  [11.4, 'kSwish', 0.3],
  [11.9, 'kDing', 0.4],
  [17.8, 'kTick1', 0.35],
  [18.0, 'kTick3', 0.35],
  [18.2, 'kTick5', 0.35],
  [18.6, 'kErfolg', 0.35],
];

/* ───────────── Video ───────────── */

const Video: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <div style={{position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${C.line} 1.6px, transparent 2px)`, backgroundSize: '34px 34px', opacity: 0.6}} />
    <Opener />
    <Verlauf />
    <Index />
    <Zitat />
    <Fazit />
    <Wischer />
    <Rahmen />
    {TOENE.map(([at, name, vol], i) => (
      <Sfx key={i} name={name} at={fr(at)} volume={vol} />
    ))}
    <Music src="projekte/news-probe/musik.wav" loop={false} volume={0.5} />
  </AbsoluteFill>
);

export const projekt: Project = {
  id: 'News-Probe',
  component: Video,
  format: 'landscape',
  durationInFrames: Math.round(DAUER * FPS),
  ordner: 'Tests',
};
