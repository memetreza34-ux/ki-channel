import React from 'react';
import {AbsoluteFill, Audio, interpolateColors, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Zap} from 'lucide';
import {
  Background,
  CameraRig,
  Caption,
  CaptionTrack,
  clamp01,
  EndCard,
  Headline,
  Icon,
  Lottie,
  mix,
  Pill,
  pop,
  progress,
  SafeArea,
  Scenes,
  scenesDuration,
  Sfx,
  ThemeProvider,
  useTheme,
  type CameraKey,
  type SceneItem,
} from '../../kit';
import type {Project} from '../types';
import untertitel from './untertitel.json';

/** Voiceover in studio/public/projekte/kuehlschrank/ ablegen und hier eintragen, z. B. 'projekte/kuehlschrank/voiceover.mp3'. */
const VOICEOVER: string | null = null;

// Look: Design „minimal“ + Farbcode Kälte (blau) / Wärme (rot).
const COLD = '#2F80ED';
const COLD_SOFT = '#8DB8F5';
const COLD_TINT = '#E6F0FD';
const HOT = '#E63B2E';
const WARM = '#F29A38';
const HOT_TINT = '#FDECEA';
const INK = '#0A0A0A';

/** Deterministische Pseudo-Zufallszahl 0–1. */
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ── Kältemittel-Kreislauf (Koordinaten im 1080×1920-Bild) ───────────────
type Pt = [number, number];
type SectionName = 'verdampfer' | 'zumKompressor' | 'kompressor' | 'verfluessiger' | 'zurDrossel' | 'kapillare';

const SECTIONS: Array<{name: SectionName; pts: Pt[]; color: string; width: number}> = [
  {name: 'verdampfer', color: COLD, width: 16, pts: [[170, 600], [500, 600], [500, 670], [170, 670], [170, 740], [500, 740]]},
  {name: 'zumKompressor', color: COLD_SOFT, width: 16, pts: [[500, 740], [680, 740], [680, 1300]]},
  {name: 'kompressor', color: INK, width: 16, pts: [[680, 1300], [680, 1360], [760, 1360], [760, 1300]]},
  {
    name: 'verfluessiger',
    color: HOT,
    width: 16,
    pts: [[760, 1300], [760, 1240], [880, 1240], [880, 1160], [760, 1160], [760, 1080], [880, 1080], [880, 1000], [760, 1000], [760, 920], [880, 920], [880, 840], [760, 840]],
  },
  {name: 'zurDrossel', color: WARM, width: 16, pts: [[760, 840], [760, 660]]},
  {name: 'kapillare', color: COLD, width: 8, pts: [[760, 660], [760, 420], [170, 420], [170, 600]]},
];

const segLen = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const polyLen = (pts: Pt[]) => pts.slice(1).reduce((sum, p, i) => sum + segLen(pts[i], p), 0);

const SECTION_START: Record<SectionName, number> = {} as Record<SectionName, number>;
const SECTION_LEN: Record<SectionName, number> = {} as Record<SectionName, number>;
let acc = 0;
for (const s of SECTIONS) {
  SECTION_START[s.name] = acc;
  SECTION_LEN[s.name] = polyLen(s.pts);
  acc += SECTION_LEN[s.name];
}
const LOOP: Pt[] = SECTIONS.flatMap((s, i) => (i === 0 ? s.pts : s.pts.slice(1)));
const LOOP_LEN = acc;

const pointAt = (dist: number): Pt => {
  let d = ((dist % LOOP_LEN) + LOOP_LEN) % LOOP_LEN;
  for (let i = 1; i < LOOP.length; i++) {
    const l = segLen(LOOP[i - 1], LOOP[i]);
    if (d <= l) {
      const k = l === 0 ? 0 : d / l;
      return [mix(LOOP[i - 1][0], LOOP[i][0], k), mix(LOOP[i - 1][1], LOOP[i][1], k)];
    }
    d -= l;
  }
  return LOOP[LOOP.length - 1];
};

const sectionOf = (dist: number): SectionName => {
  const d = ((dist % LOOP_LEN) + LOOP_LEN) % LOOP_LEN;
  let found: SectionName = 'verdampfer';
  for (const s of SECTIONS) if (d >= SECTION_START[s.name]) found = s.name;
  return found;
};

/** Farbe des Kältemittels an einer Stelle: kalt → (Kompressor) heiß → (hinten) abgekühlt → (Drossel) eiskalt. */
const fluidColor = (dist: number) => {
  const d = ((dist % LOOP_LEN) + LOOP_LEN) % LOOP_LEN;
  const s = SECTION_START;
  return interpolateColors(
    d,
    [0, s.zumKompressor, s.kompressor, s.verfluessiger, s.zurDrossel, s.kapillare, s.kapillare + 40, LOOP_LEN],
    [COLD, COLD_SOFT, COLD_SOFT, HOT, WARM, WARM, COLD, COLD],
  );
};

const FRIDGE = {x: 90, y: 470, w: 480, h: 960};

type DiagramState = {
  /** 0–1: Rohre zeichnen sich. */
  draw: number;
  /** Ab hier fließt das Kältemittel. */
  flowFrom: number;
  /** Hervorgehobene Abschnitte (Rest gedimmt); leer = alles normal. */
  active: SectionName[];
  /** 0–1: Innenraum kühlt ab. */
  cool: number;
  speed?: number;
};

/** Seitenansicht: Kühlschrank aufgeschnitten, Kreislauf innen und an der Rückseite. */
const Diagram: React.FC<DiagramState & {children?: React.ReactNode}> = ({draw, flowFrom, active, cool, speed = 7, children}) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const dim = (name: SectionName) => (active.length === 0 || active.includes(name) ? 1 : 0.22);
  const flowing = frame >= flowFrom;
  const dots = 34;
  const flowIn = progress(frame, flowFrom, 12, 'out');
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {/* Boden */}
        <line x1={40} x2={1040} y1={FRIDGE.y + FRIDGE.h} y2={FRIDGE.y + FRIDGE.h} stroke={INK} strokeWidth={4} />
        {/* Gehäuse */}
        <rect
          x={FRIDGE.x}
          y={FRIDGE.y}
          width={FRIDGE.w}
          height={FRIDGE.h}
          rx={22}
          fill={interpolateColors(cool, [0, 1], ['#FFFFFF', COLD_TINT])}
          stroke={INK}
          strokeWidth={8}
        />
        {/* Regale */}
        {[960, 1190].map((y) => (
          <line key={y} x1={FRIDGE.x + 20} x2={FRIDGE.x + FRIDGE.w - 20} y1={y} y2={y} stroke={INK} strokeWidth={4} opacity={0.35} />
        ))}
        {/* Rohre */}
        {SECTIONS.map((s) => {
          const f = clamp01((draw * LOOP_LEN - SECTION_START[s.name]) / SECTION_LEN[s.name]);
          return (
            <polyline
              key={s.name}
              points={s.pts.map((p) => p.join(',')).join(' ')}
              fill="none"
              stroke={s.color}
              strokeWidth={s.width}
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - f}
              opacity={dim(s.name)}
            />
          );
        })}
        {/* Engstelle (Drossel) */}
        <g opacity={draw > 0.9 ? dim('kapillare') : 0}>
          <path d="M732 640 L752 660 L732 680 Z" fill={INK} />
          <path d="M788 640 L768 660 L788 680 Z" fill={INK} />
        </g>
        {/* Kältemittel */}
        {flowing
          ? Array.from({length: dots}, (_, i) => {
              const dist = i * (LOOP_LEN / dots) + (frame - flowFrom) * speed;
              const [x, y] = pointAt(dist);
              const sec = sectionOf(dist);
              return (
                <circle key={i} cx={x} cy={y} r={11 * flowIn} fill={fluidColor(dist)} stroke="#FFFFFF" strokeWidth={3} opacity={dim(sec)} />
              );
            })
          : null}
        {/* Kompressor (über den Punkten, die darin verschwinden) */}
        <g opacity={draw > 0.45 ? 1 : 0}>
          <rect x={630} y={1290} width={180} height={140} rx={34} fill={INK} opacity={dim('kompressor')} />
        </g>
      </svg>
      {/* Beschriftung Rückseite */}
      <div
        style={{
          position: 'absolute',
          left: 625 - 300,
          top: 1060 - 30,
          width: 600,
          textAlign: 'center',
          transform: 'rotate(-90deg)',
          fontFamily: t.font.body,
          fontWeight: 900,
          fontSize: 34,
          letterSpacing: '0.2em',
          color: INK,
          opacity: 0.4 * progress(frame, 20, 14, 'soft'),
        }}
      >
        RÜCKSEITE
      </div>
      {/* Essen im Kühlschrank */}
      <div style={{position: 'absolute', left: 150, top: 1040, display: 'flex', gap: 60, opacity: progress(frame, 6, 12, 'soft')}}>
        <Icon icon="fluent-emoji-flat:cheese-wedge" size={130} animate="none" />
        <Icon icon="fluent-emoji-flat:glass-of-milk" size={130} animate="none" />
      </div>
      <div style={{position: 'absolute', left: 190, top: 1270, opacity: progress(frame, 10, 12, 'soft')}}>
        <Icon icon="fluent-emoji-flat:leafy-green" size={120} animate="none" />
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Kamera-Ziel: Punkt (px, py) landet bei Zoom z auf Bildschirmhöhe sy. */
const cam = (at: number, px: number, py: number, z: number, sy = 1010): CameraKey => ({at, zoom: z, x: -(px - 540) * z, y: sy - 960 - (py - 960) * z});

// ── Hilfen für die Erklärung ────────────────────────────────────────────
/** Rote Wärme-Punkte, die von a nach b wandern (Endlos-Schleife). */
const HeatFlow: React.FC<{from: [number, number, number, number]; to: [number, number]; count?: number; period?: number; delay?: number; size?: number; seed?: number}> = ({
  from,
  to,
  count = 10,
  period = 50,
  delay = 0,
  size = 16,
  seed = 1,
}) => {
  const frame = useCurrentFrame();
  if (frame < delay) return null;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      {Array.from({length: count}, (_, i) => {
        const p = ((frame - delay + (i * period) / count) % period) / period;
        const sx = mix(from[0], from[2], rnd(i, seed));
        const sy = mix(from[1], from[3], rnd(i, seed + 7));
        const x = mix(sx, to[0], p) + Math.sin((frame + i * 9) / 6) * 8;
        const y = mix(sy, to[1], p);
        const alpha = Math.min(p * 5, 1) * (1 - Math.max(0, (p - 0.7) / 0.3));
        return <circle key={i} cx={x} cy={y} r={size} fill={HOT} opacity={alpha * progress(frame, delay, 10, 'soft')} />;
      })}
    </svg>
  );
};

/** Wärmewellen, die sich von einem Punkt nach rechts ausbreiten. */
const HeatWaves: React.FC<{x: number; y: number; delay?: number; spread?: number}> = ({x, y, delay = 0, spread = 200}) => {
  const frame = useCurrentFrame();
  if (frame < delay) return null;
  const arc = (r: number) => {
    const a = (50 * Math.PI) / 180;
    return `M ${x + r * Math.cos(-a)} ${y + r * Math.sin(-a)} A ${r} ${r} 0 0 1 ${x + r * Math.cos(a)} ${y + r * Math.sin(a)}`;
  };
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      {[0, 1, 2].map((i) => {
        const p = ((frame - delay + i * 14) % 42) / 42;
        return <path key={i} d={arc(80 + p * spread)} fill="none" stroke={HOT} strokeWidth={10} strokeLinecap="round" opacity={(1 - p) * progress(frame, delay, 10, 'soft')} />;
      })}
    </svg>
  );
};

/** Feste Schritt-Karte oben (nicht im Kamerazoom). */
const StepCard: React.FC<{n?: number; title: string; sub: string; color: string}> = ({n, title, sub, color}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTheme();
  const s = pop(frame, fps, 0, 'snappy');
  return (
    <div
      style={{
        position: 'absolute',
        top: 250,
        left: 80,
        right: 80,
        display: 'flex',
        alignItems: 'center',
        gap: 34,
        padding: '28px 36px',
        background: '#FFFFFF',
        border: `4px solid ${INK}`,
        borderRadius: 14,
        boxShadow: `8px 8px 0 ${color}`,
        transform: `translateY(${(1 - Math.min(1, s)) * -40}px)`,
        opacity: clamp01(s * 2),
      }}
    >
      {n ? (
        <div
          style={{
            width: 120,
            height: 120,
            flexShrink: 0,
            background: color,
            color: '#FFFFFF',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: t.font.body,
            fontWeight: 900,
            fontSize: 80,
          }}
        >
          {n}
        </div>
      ) : null}
      <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
        <div style={{fontFamily: t.font.heading, fontWeight: 900, fontSize: 78, letterSpacing: '-0.04em', color: INK, lineHeight: 1}}>{title}</div>
        <div style={{fontFamily: t.font.body, fontWeight: 700, fontSize: 44, color: t.c.inkSoft}}>{sub}</div>
      </div>
    </div>
  );
};

/** Schild an einer Stelle im Diagramm (zoomt mit). */
const Tag: React.FC<{x: number; y: number; text: string; color: string; delay?: number; size?: number}> = ({x, y, text, color, delay = 0, size = 34}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTheme();
  const s = pop(frame, fps, delay, 'snappy');
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${Math.max(0, s)})`,
        background: color,
        color: '#FFFFFF',
        fontFamily: t.font.body,
        fontWeight: 900,
        fontSize: size,
        padding: `${size * 0.3}px ${size * 0.6}px`,
        borderRadius: 8,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

// ── PHASE 1 · HOOK ──────────────────────────────────────────────────────
const SWAP = 72;

const FridgeFront: React.FC<{cool: number}> = ({cool}) => (
  <svg width={420} height={680} viewBox="0 0 420 680">
    <rect x={6} y={6} width={408} height={668} rx={26} fill={interpolateColors(cool, [0, 1], ['#FFFFFF', COLD_TINT])} stroke={INK} strokeWidth={8} />
    <line x1={6} x2={414} y1={220} y2={220} stroke={INK} strokeWidth={8} />
    <rect x={340} y={70} width={18} height={100} rx={9} fill={INK} />
    <rect x={340} y={270} width={18} height={160} rx={9} fill={INK} />
  </svg>
);

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const out1 = progress(frame, SWAP - 8, 10, 'in');
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 290, left: 70, right: 70, display: 'flex', justifyContent: 'center', opacity: 1 - out1, transform: `translateY(${-out1 * 40}px)`}}>
        <Headline text="Dein Kühlschrank macht keine Kälte." size={110} align="center" highlight={['keine', 'Kälte.']} highlightColor={HOT} delay={-12} />
      </div>
      {frame >= SWAP - 2 ? (
        <div style={{position: 'absolute', top: 290, left: 70, right: 70, display: 'flex', justifyContent: 'center'}}>
          <Headline text="Er schaufelt Wärme raus." size={110} align="center" highlight={['Wärme']} highlightColor={HOT} marker delay={SWAP} />
        </div>
      ) : null}
      <div style={{position: 'absolute', left: 230, top: 700}}>
        <FridgeFront cool={progress(frame, SWAP, 50, 'inOut')} />
        <div style={{position: 'absolute', left: 60, top: 50}}>
          <Icon icon="fluent-emoji-flat:snowflake" size={120} animate="none" loop="float" />
        </div>
      </div>
      {/* Wärme strömt aus dem Kühlschrank in die Küche */}
      <HeatFlow from={[420, 1000, 600, 1300]} to={[1080, 1150]} count={14} period={46} delay={SWAP + 6} size={15} seed={3} />
      <div style={{position: 'absolute', left: 820, top: 900}}>{frame >= SWAP + 16 ? <Tag x={0} y={0} text="Wärme" color={HOT} delay={SWAP + 16} size={44} /> : null}</div>
      <Sfx name="thud" at={0} volume={0.35} />
      <Sfx name="whoosh" at={SWAP} volume={0.35} />
      <Caption text="Dein Kühlschrank macht gar keine Kälte." duration={SWAP} />
      <Sequence from={SWAP}>
        <Caption text="Er holt die Wärme raus – und gibt sie an die Küche ab." />
      </Sequence>
    </AbsoluteFill>
  );
};

// ── PHASE 2 · ERKLÄRUNG ─────────────────────────────────────────────────
const Tile: React.FC<{x: number; label: string; icon: string; color: string; tint: string; delay: number}> = ({x, label, icon, color, tint, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTheme();
  const s = pop(frame, fps, delay, 'snappy');
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 600,
        width: 320,
        height: 320,
        background: tint,
        border: `6px solid ${color}`,
        borderRadius: 18,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        transform: `scale(${mix(0.6, 1, Math.min(1, Math.max(0, s)))})`,
        opacity: clamp01(s * 2),
      }}
    >
      <Icon icon={icon} size={150} animate="none" />
      <div style={{fontFamily: t.font.body, fontWeight: 900, fontSize: 60, color}}>{label}</div>
    </div>
  );
};

const FlowArrow: React.FC<{y: number; dir: 1 | -1; color: string; delay: number}> = ({y, dir, color, delay}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, delay, 18, 'out');
  const x1 = dir === 1 ? 260 : 820;
  const x2 = dir === 1 ? 820 : 260;
  const xe = mix(x1, x2, p);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <line x1={x1} y1={y} x2={xe} y2={y} stroke={color} strokeWidth={12} strokeLinecap="round" />
      {p > 0.95 ? <path d={`M ${x2} ${y} l ${-dir * 40} -30 l 0 60 Z`} fill={color} /> : null}
    </svg>
  );
};

const PROBLEM_TURN = 96;

const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useTheme();
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 280, left: 70, right: 70, display: 'flex', justifyContent: 'center'}}>
        <Headline text="Wärme fließt nur von warm nach kalt" size={96} align="center" highlight={['warm']} highlightColor={HOT} delay={-6} />
      </div>
      <Tile x={110} label="warm" icon="fluent-emoji-flat:fire" color={HOT} tint={HOT_TINT} delay={8} />
      <Tile x={650} label="kalt" icon="fluent-emoji-flat:snowflake" color={COLD} tint={COLD_TINT} delay={14} />
      {/* von allein: warm → kalt */}
      <FlowArrow y={1020} dir={1} color={HOT} delay={24} />
      <HeatFlow from={[280, 1020, 300, 1020]} to={[800, 1020]} count={5} period={40} delay={36} size={14} seed={5} />
      <div style={{position: 'absolute', top: 1060, left: 0, right: 0, textAlign: 'center', fontFamily: t.font.body, fontWeight: 800, fontSize: 46, color: t.c.inkSoft, opacity: progress(frame, 34, 12, 'soft')}}>
        von allein
      </div>
      {/* Kühlschrank: andersrum, braucht Energie */}
      {frame >= PROBLEM_TURN ? (
        <>
          <FlowArrow y={1220} dir={-1} color={INK} delay={PROBLEM_TURN} />
          <div style={{position: 'absolute', top: 1270, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <Pill icon={Zap} tone="solid" size={44} delay={PROBLEM_TURN + 10}>
              Kühlschrank: andersrum – mit Strom
            </Pill>
          </div>
        </>
      ) : null}
      <Sfx name="pop" at={8} volume={0.3} />
      <Sfx name="pop" at={14} volume={0.3} />
      <Sfx name="swoosh" at={24} volume={0.3} />
      <Sfx name="energy" at={PROBLEM_TURN} volume={0.3} />
      <Caption text="Von allein fließt Wärme nur von warm nach kalt." duration={PROBLEM_TURN} />
      <Sequence from={PROBLEM_TURN}>
        <Caption text="Der Kühlschrank schiebt sie andersrum – und braucht dafür Strom." />
      </Sequence>
    </AbsoluteFill>
  );
};

// Kreislauf: ein durchgehendes Bild, die Kamera fährt von Schritt zu Schritt.
const K = {
  intro: 0,
  s1: 150,
  s2: 330,
  s3: 510,
  s4: 690,
  loop: 870,
  end: 990,
};

const OV = {px: 480, py: 925, z: 0.76};

const Kreislauf: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = progress(frame, 12, 70, 'inOut');
  const active: SectionName[] =
    frame >= K.loop || frame < K.s1
      ? []
      : frame < K.s2
        ? ['verdampfer']
        : frame < K.s3
          ? ['kompressor', 'zumKompressor']
          : frame < K.s4
            ? ['verfluessiger']
            : ['kapillare', 'zurDrossel'];
  const cool = progress(frame, K.s1 + 20, 120, 'inOut');
  const camKeys: CameraKey[] = [
    cam(0, OV.px, OV.py, OV.z, 990),
    cam(K.s1, OV.px, OV.py, OV.z, 990),
    cam(K.s1 + 26, 335, 700, 1.55, 960),
    cam(K.s2, 335, 700, 1.55, 960),
    cam(K.s2 + 26, 720, 1300, 1.7, 1060),
    cam(K.s3, 720, 1300, 1.7, 1060),
    cam(K.s3 + 26, 860, 1040, 1.45, 1000),
    cam(K.s4, 860, 1040, 1.45, 1000),
    cam(K.s4 + 26, 640, 580, 1.5, 1000),
    cam(K.loop, 640, 580, 1.5, 1000),
    cam(K.loop + 30, OV.px, OV.py, OV.z, 990),
  ];
  const pulse = frame >= K.s2 && frame < K.s3 ? Math.abs(Math.sin((frame - K.s2) / 3.2)) : 0;
  return (
    <AbsoluteFill>
      <CameraRig keys={camKeys}>
        <Diagram draw={draw} flowFrom={70} active={active} cool={cool} speed={frame >= K.loop ? 10 : 7}>
          {/* 1 · Wärme aus dem Innenraum steigt zum Verdampfer */}
          <Sequence from={K.s1 + 20} durationInFrames={K.s2 - K.s1 - 10} layout="none">
            <HeatFlow from={[150, 820, 520, 900]} to={[335, 680]} count={12} period={44} size={13} seed={9} />
          </Sequence>
          {/* Labels erscheinen beim Einführen des Kreislaufs */}
          <Sequence from={30} durationInFrames={K.s1 - 30} layout="none">
            <Tag x={335} y={520} text="Kältemittel" color={COLD} delay={50} size={40} />
          </Sequence>
          {/* 2 · Kompressor arbeitet */}
          <Sequence from={K.s2} durationInFrames={K.s3 - K.s2} layout="none">
            <div style={{position: 'absolute', left: 630, top: 1290, width: 180, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{transform: `scale(${1 + pulse * 0.08})`, fontFamily: 'Inter', fontWeight: 900, fontSize: 26, color: '#FFFFFF'}}>Kompressor</div>
            </div>
            <Tag x={720} y={1215} text="heiß!" color={HOT} delay={40} size={40} />
          </Sequence>
          {/* 3 · Wärme geht hinten in die Küche */}
          <Sequence from={K.s3 + 20} durationInFrames={K.s4 - K.s3 - 20} layout="none">
            <HeatWaves x={880} y={1040} spread={190} />
          </Sequence>
          {/* 4 · Engstelle: wird eiskalt */}
          <Sequence from={K.s4 + 30} durationInFrames={K.loop - K.s4 - 30} layout="none">
            <div style={{position: 'absolute', left: 840, top: 600}}>
              <Icon icon="fluent-emoji-flat:snowflake" size={110} animate="pop" loop="spin" />
            </div>
            <Tag x={560} y={500} text="eiskalt" color={COLD} delay={10} size={40} />
          </Sequence>
        </Diagram>
      </CameraRig>

      {/* Feste Karten oben */}
      <Sequence from={K.intro} durationInFrames={K.s1}>
        <StepCard title="Der Trick: ein Kreislauf" sub="Kältemittel kreist durchs Rohr" color={INK} />
      </Sequence>
      <Sequence from={K.s1} durationInFrames={K.s2 - K.s1}>
        <StepCard n={1} title="Verdampfen" sub="nimmt innen Wärme auf" color={COLD} />
      </Sequence>
      <Sequence from={K.s2} durationInFrames={K.s3 - K.s2}>
        <StepCard n={2} title="Verdichten" sub="wird dabei heiß" color={HOT} />
      </Sequence>
      <Sequence from={K.s3} durationInFrames={K.s4 - K.s3}>
        <StepCard n={3} title="Abgeben" sub="Wärme geht in die Küche" color={HOT} />
      </Sequence>
      <Sequence from={K.s4} durationInFrames={K.loop - K.s4}>
        <StepCard n={4} title="Entspannen" sub="Druck sinkt – wird eiskalt" color={COLD} />
      </Sequence>
      <Sequence from={K.loop}>
        <StepCard title="Und wieder von vorn" sub="solange der Kühlschrank läuft" color={INK} />
      </Sequence>

      {/* Ton */}
      <Sfx name="swoosh" at={12} volume={0.3} />
      <Sfx name="blip" at={70} volume={0.3} />
      <Sfx name="whoosh" at={K.s1} volume={0.3} />
      <Sfx name="whoosh" at={K.s2} volume={0.3} />
      <Sfx name="thud" at={K.s2 + 30} volume={0.35} />
      <Sfx name="whoosh" at={K.s3} volume={0.3} />
      <Sfx name="whoosh" at={K.s4} volume={0.3} />
      <Sfx name="chime" at={K.s4 + 30} volume={0.3} />
      <Sfx name="whoosh" at={K.loop} volume={0.3} />

      {/* Gesprochener Text */}
      <Sequence from={K.intro} durationInFrames={K.s1}>
        <Caption text="Dafür kreist ein Kältemittel durch ein Rohr – innen und hinten." />
      </Sequence>
      <Sequence from={K.s1} durationInFrames={K.s2 - K.s1}>
        <Caption text="Innen verdampft es – und nimmt dabei Wärme auf." />
      </Sequence>
      <Sequence from={K.s2} durationInFrames={K.s3 - K.s2}>
        <Caption text="Der Kompressor presst das Gas zusammen. Dabei wird es heiß." />
      </Sequence>
      <Sequence from={K.s3} durationInFrames={K.s4 - K.s3}>
        <Caption text="Hinten gibt es die Wärme an die Küche ab und wird wieder flüssig." />
      </Sequence>
      <Sequence from={K.s4} durationInFrames={K.loop - K.s4}>
        <Caption text="Hinter einer Engstelle sinkt der Druck – das Kältemittel wird eiskalt." />
      </Sequence>
      <Sequence from={K.loop}>
        <Caption text="Und dann geht es wieder von vorn." />
      </Sequence>
    </AbsoluteFill>
  );
};

// ── PHASE 3 · FAZIT ─────────────────────────────────────────────────────
const Fazit: React.FC = () => (
  <AbsoluteFill>
    <SafeArea gap={60}>
      <Icon icon="fluent-emoji-flat:snowflake" size={260} animate="pop" delay={4} loop="float" />
      <Headline text="Kälte ist weggeschaffte Wärme." size={112} align="center" highlight={['weggeschaffte']} highlightColor={HOT} marker delay={16} />
    </SafeArea>
    <Sfx name="pop" at={4} volume={0.3} />
    <Sfx name="success" at={30} volume={0.3} />
    <Caption text="Kälte ist also nur: Wärme, die weggeschafft wurde." delay={4} />
  </AbsoluteFill>
);

const TIPP_MOVE = 80;

const Tipp: React.FC = () => {
  const frame = useCurrentFrame();
  // Kühlschrank rückt von der Wand weg.
  const move = progress(frame, TIPP_MOVE, 26, 'inOut');
  const fx = mix(410, 300, move);
  const wallX = 790;
  const stuck = frame < TIPP_MOVE;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 280, left: 70, right: 70, display: 'flex', justifyContent: 'center'}}>
        <Headline text="Tipp: Rückseite frei lassen" size={100} align="center" highlight={['frei']} marker delay={-6} />
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <line x1={60} x2={1020} y1={1400} y2={1400} stroke={INK} strokeWidth={4} />
        {/* Wand */}
        <rect x={wallX} y={640} width={60} height={760} fill={INK} opacity={0.85} />
        {/* Kühlschrank seitlich */}
        <rect x={fx} y={720} width={340} height={680} rx={20} fill="#FFFFFF" stroke={INK} strokeWidth={8} />
        {/* Verflüssiger hinten */}
        <polyline
          points={[0, 1, 2, 3, 4, 5, 6].map((i) => `${fx + 352 + (i % 2) * 18},${800 + i * 80}`).join(' ')}
          fill="none"
          stroke={HOT}
          strokeWidth={10}
          strokeLinejoin="round"
        />
      </svg>
      {/* Wärme staut sich – oder steigt frei auf */}
      {stuck ? (
        <HeatFlow from={[fx + 340, 900, fx + 360, 1300]} to={[fx + 380, 820]} count={8} period={30} size={12} seed={11} />
      ) : (
        <HeatFlow from={[fx + 340, 900, fx + 380, 1300]} to={[fx + 400, 560]} count={14} period={44} delay={TIPP_MOVE + 20} size={13} seed={12} />
      )}
      <div style={{position: 'absolute', left: 150, top: 640}}>
        {stuck ? (
          <Tag x={160} y={0} text="✕ zu eng" color={HOT} delay={30} size={48} />
        ) : (
          <Tag x={160} y={0} text="✓ Wärme kann weg" color={INK} delay={TIPP_MOVE + 24} size={48} />
        )}
      </div>
      <Sfx name="wrong" at={30} volume={0.3} />
      <Sfx name="slideIn" at={TIPP_MOVE} volume={0.3} />
      <Sfx name="ding" at={TIPP_MOVE + 24} volume={0.3} />
      <Caption text="Darum: Rückseite nicht zustellen – die Wärme muss raus." delay={4} />
    </AbsoluteFill>
  );
};

const Ende: React.FC = () => (
  <AbsoluteFill>
    <Background seed="kuehlschrank-ende" variant="accent" />
    <SafeArea>
      <Lottie name="emoji/winken" size={220} delay={2} />
      <EndCard title="Mehr Alltag, einfach erklärt." button="Folgen" delay={8} size={1.45} />
    </SafeArea>
  </AbsoluteFill>
);

const ITEMS: SceneItem[] = [
  // Phase 1 · Hook
  {name: '1 Hook', duration: 160, content: <Hook />},
  // Phase 2 · Erklärung
  {name: '2 Problem', duration: 200, content: <Problem />, transition: 'slide-up'},
  {name: '3 Kreislauf', duration: K.end, content: <Kreislauf />, transition: 'zoom'},
  // Phase 3 · Fazit
  {name: '4 Fazit', duration: 130, content: <Fazit />, transition: 'slide-up'},
  {name: '5 Tipp', duration: 190, content: <Tipp />, transition: 'slide-left'},
  {name: '6 Ende', duration: 84, content: <Ende />, transition: 'slide-up'},
];

const Video: React.FC = () => (
  <ThemeProvider theme="minimal">
    <AbsoluteFill>
      <Background seed="kuehlschrank" />
      <Scenes items={ITEMS} />
      {VOICEOVER ? <Audio src={staticFile(VOICEOVER)} /> : null}
      {VOICEOVER ? <CaptionTrack captions={untertitel} /> : null}
    </AbsoluteFill>
  </ThemeProvider>
);

export const projekt: Project = {
  id: 'Kuehlschrank',
  component: Video,
  format: 'vertical',
  durationInFrames: scenesDuration(ITEMS),
};
