import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, Icon, mix, pop, progress, Sfx} from '../../kit';
import type {Project} from '../types';
import {BODY, FOOT_Y, Hintergrund, KANAL, rounded, SERIEN, Shape, StilContext, Toki, useStil, type Gesicht, type SerieName} from './stil';

/**
 * Kanal-Look: je ein Beispielbild pro Serie (News, Tool-Test, Erklärt, Recht).
 * Gemeinsam: heller Grund, Pastell-Formen in Serienfarbe, Inter, Token-Wesen in Koralle.
 */

const SerieContext = React.createContext<SerieName>('news');
const useSerie = () => SERIEN[React.useContext(SerieContext)];

/* ───────────── Bausteine ───────────── */

const Kopf: React.FC<{title: string; highlight?: string}> = ({title, highlight}) => {
  const s = useStil();
  const serie = useSerie();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pill = pop(frame, fps, 0, 'snappy');
  const words = title.split(' ');
  return (
    <div style={{position: 'absolute', left: 140, top: 92}}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          padding: '10px 22px 10px 18px',
          borderRadius: 999,
          background: serie.tint,
          fontFamily: s.body,
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: serie.farbe,
          opacity: clamp01(pill * 2),
          transform: `scale(${mix(0.8, 1, pill)})`,
          transformOrigin: 'left center',
        }}
      >
        <div style={{width: 16, height: 16, borderRadius: '50%', background: serie.farbe}} />
        {serie.label}
      </div>
      <div style={{marginTop: 22, fontFamily: s.head, fontSize: 84, fontWeight: s.headWeight, letterSpacing: '-0.035em', color: s.ink, lineHeight: 1.05}}>
        {words.map((w, i) => {
          const p = progress(frame, 4 + i * 3, 18);
          return (
            <span key={i} style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 26}px)`, marginRight: '0.24em', color: highlight && w.startsWith(highlight) ? serie.farbe : undefined}}>
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Karte: React.FC<{x: number; y: number; w: number; h?: number; delay?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, w, h, delay = 0, children, style}) => {
  const s = useStil();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, delay, 'smooth');
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: 32,
        background: s.surface,
        boxShadow: '0 24px 50px rgba(30,35,50,0.10), 0 2px 6px rgba(30,35,50,0.05)',
        ...style,
        // Eigene Durchsichtigkeit (style.opacity) wird mit der Einblendung verrechnet, nicht ersetzt.
        opacity: clamp01(p * 1.5) * (typeof style?.opacity === 'number' ? style.opacity : 1),
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const Stempel: React.FC<{text: string; delay: number; style?: React.CSSProperties}> = ({text, delay, style}) => {
  const s = useStil();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, delay, 'bouncy');
  return (
    <div
      style={{
        position: 'absolute',
        padding: '6px 16px',
        border: `3px solid ${s.inkSoft}`,
        borderRadius: 10,
        fontFamily: s.body,
        fontSize: 28,
        fontWeight: 800,
        letterSpacing: '0.12em',
        color: s.inkSoft,
        opacity: clamp01(p * 2) * 0.85,
        transform: `rotate(-6deg) scale(${mix(1.6, 1, p)})`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Token-Wesen, das mit kleinem Hüpfer auftritt. */
const AuftrittToki: React.FC<{x: number; y: number; k: number; delay: number; look?: [number, number]; smile?: number; mouthO?: number; gesicht?: Gesicht; armL?: number; armR?: number; label?: string}> = ({
  x,
  y,
  k,
  delay,
  ...rest
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame - delay;
  if (t < 0) return null;
  const jump = progress(frame, delay, 14, 'out');
  const land = spring({frame: t - 14, fps, config: {damping: 9, stiffness: 180, mass: 0.6}});
  const impact = t >= 14 ? 1 - land : 0;
  const yy = t < 14 ? y - Math.sin(jump * Math.PI) * 120 + (1 - jump) * 0 : y;
  return <Toki x={x} y={yy} k={k * Math.min(1, 0.4 + jump)} sx={1 + impact * 0.16} sy={1 - impact * 0.2} {...rest} />;
};

export const Sprechblase: React.FC<{x: number; y: number; text: string; delay: number}> = ({x, y, text, delay}) => {
  const s = useStil();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, delay, 'snappy');
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -100%) scale(${mix(0.6, 1, p)})`,
        transformOrigin: '50% 100%',
        opacity: clamp01(p * 2),
      }}
    >
      <div
        style={{
          padding: '20px 30px',
          borderRadius: 28,
          background: s.surface,
          border: `4px solid ${s.ki}`,
          fontFamily: s.head,
          fontSize: 40,
          fontWeight: 800,
          color: s.ink,
          whiteSpace: 'nowrap',
          boxShadow: '0 14px 30px rgba(30,35,50,0.10)',
        }}
      >
        {text}
      </div>
      <svg width={40} height={26} style={{position: 'absolute', left: '50%', marginLeft: -20, top: '100%', marginTop: -4}}>
        <path d="M2,0 L20,24 L38,0" fill={s.surface} stroke={s.ki} strokeWidth={4} strokeLinejoin="round" />
        <rect x={4} y={-4} width={32} height={6} fill={s.surface} />
      </svg>
    </div>
  );
};

/* ───────────── A · KI-News ───────────── */

const News: React.FC = () => {
  const s = useStil();
  const serie = useSerie();
  const frame = useCurrentFrame();
  const punkte = ['Versteht Videos bis 1 Stunde', 'Antwortet doppelt so schnell', 'Ab heute kostenlos testbar'];
  return (
    <AbsoluteFill>
      <Hintergrund blobs={[serie.tint2, serie.tint]} />
      <Kopf title="Neues Modell versteht Videos" highlight="Videos" />
      <Karte x={140} y={330} w={840} delay={8} style={{padding: '40px 48px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <div style={{width: 76, height: 76, borderRadius: 22, background: serie.tint, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon icon="ph:sparkle-fill" size={44} color={serie.farbe} animate="pop" delay={14} />
          </div>
          <div style={{fontFamily: s.body}}>
            <div style={{fontSize: 36, fontWeight: 800, color: s.ink}}>Beispiel-Firma</div>
            <div style={{fontSize: 28, fontWeight: 600, color: s.inkSoft}}>vor 2 Stunden</div>
          </div>
        </div>
        <div style={{height: 3, background: s.line, margin: '30px 0 26px', borderRadius: 2}} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
          {punkte.map((p, i) => {
            const at = 24 + i * 10;
            const q = progress(frame, at, 14);
            return (
              <div key={p} style={{display: 'flex', alignItems: 'center', gap: 20, opacity: q, transform: `translateX(${(1 - q) * -20}px)`}}>
                <Icon icon="ph:check-circle-fill" size={46} color={serie.farbe} animate="pop" delay={at} />
                <div style={{fontFamily: s.body, fontSize: 40, fontWeight: 600, color: s.ink}}>{p}</div>
              </div>
            );
          })}
        </div>
        <Stempel text="BEISPIEL" delay={60} style={{right: 34, top: 40}} />
      </Karte>
      <Karte x={1050} y={330} w={720} h={450} delay={16} style={{overflow: 'hidden'}}>
        <div style={{height: 58, background: '#F1F1F3', display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px'}}>
          {['#FF6159', '#FFBD2E', '#28C941'].map((c) => (
            <div key={c} style={{width: 16, height: 16, borderRadius: '50%', background: c}} />
          ))}
        </div>
        <div style={{position: 'absolute', inset: '58px 0 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: serie.tint2}}>
          <Icon icon="ph:image-duotone" size={84} color={serie.farbe} animate="none" />
          <div style={{fontFamily: s.body, fontSize: 32, fontWeight: 600, color: s.inkSoft}}>Platz für deinen Screenshot</div>
        </div>
      </Karte>
      <AuftrittToki x={1660} y={950} k={0.9} delay={34} look={[-0.9, -0.6]} gesicht={frame >= 50 ? 'staunen' : 'neutral'} armL={frame >= 50 ? 65 : 18} armR={frame >= 50 ? 65 : 18} />
      <div
        style={{
          position: 'absolute',
          left: 1770,
          top: 700,
          fontFamily: s.head,
          fontWeight: 900,
          fontSize: 96,
          color: serie.farbe,
          opacity: progress(frame, 52, 8),
          transform: `rotate(12deg) scale(${mix(0.4, 1, progress(frame, 52, 10))})`,
        }}
      >
        !
      </div>
      <Sfx name="kWhoosh" at={6} volume={0.45} />
      {[24, 34, 44].map((at) => (
        <Sfx key={at} name="kTick" at={at} volume={0.35} />
      ))}
      <Sfx name="kSprung" at={34} volume={0.45} />
      <Sfx name="kLanden" at={48} volume={0.5} />
      <Sfx name="kNotify" at={52} volume={0.45} />
      <Sfx name="kOh" at={56} volume={0.55} />
      <Sfx name="kPop" at={60} volume={0.3} />
    </AbsoluteFill>
  );
};

/* ───────────── B · Tool-Test ───────────── */

const TOOLS = [
  {name: 'ChatGPT', logo: 'logos:openai-icon'},
  {name: 'Claude', logo: 'logos:claude-icon'},
  {name: 'Gemini', logo: 'logos:google-gemini-icon'},
];
/** Erfundene Platzhalterwerte – im Bild als Beispiel gekennzeichnet. */
const KRITERIEN: {name: string; werte: number[]}[] = [
  {name: 'Texte', werte: [8.5, 9.0, 8.0]},
  {name: 'Code', werte: [8.0, 9.2, 8.4]},
  {name: 'Bilder', werte: [8.8, 6.5, 8.6]},
];

const Test: React.FC = () => {
  const s = useStil();
  const serie = useSerie();
  const frame = useCurrentFrame();
  const col0 = 250;
  const col = 360;
  return (
    <AbsoluteFill>
      <Hintergrund blobs={[serie.tint2, serie.tint]} />
      <Kopf title="ChatGPT vs. Claude vs. Gemini" highlight="vs." />
      <Karte x={140} y={320} w={col0 + col * 3 + 80} delay={6} style={{padding: '34px 40px'}}>
        <div style={{display: 'flex', alignItems: 'center', height: 110}}>
          <div style={{width: col0}} />
          {TOOLS.map((t, i) => (
            <div key={t.name} style={{width: col, display: 'flex', alignItems: 'center', gap: 18, paddingLeft: 24}}>
              <Icon icon={t.logo} size={64} animate="pop" delay={12 + i * 5} />
              <div style={{fontFamily: s.head, fontSize: 40, fontWeight: 800, color: s.ink}}>{t.name}</div>
            </div>
          ))}
        </div>
        {KRITERIEN.map((k, r) => {
          const best = k.werte.indexOf(Math.max(...k.werte));
          return (
            <div key={k.name} style={{display: 'flex', alignItems: 'center', height: 104, borderTop: `3px solid ${s.line}`}}>
              <div style={{width: col0, fontFamily: s.body, fontSize: 40, fontWeight: 700, color: s.ink}}>{k.name}</div>
              {k.werte.map((v, i) => {
                const at = 30 + r * 10 + i * 4;
                const g = progress(frame, at, 24);
                const win = i === best;
                const winIn = progress(frame, 80 + r * 6, 12);
                return (
                  <div key={i} style={{width: col, display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 24}}>
                    <div style={{width: 200, height: 26, borderRadius: 13, background: s.line, overflow: 'hidden'}}>
                      <div style={{width: `${(v / 10) * 100 * g}%`, height: '100%', borderRadius: 13, background: win && winIn > 0 ? serie.farbe : '#B9BDC6'}} />
                    </div>
                    <div style={{fontFamily: s.body, fontSize: 34, fontWeight: 800, color: win && winIn > 0 ? serie.farbe : s.inkSoft, opacity: g}}>{(v * g).toFixed(1).replace('.', ',')}</div>
                    {win ? (
                      <div style={{opacity: winIn, transform: `scale(${mix(0.3, 1, winIn)})`}}>
                        <Icon icon="ph:trophy-fill" size={38} color={serie.farbe} animate="none" />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          );
        })}
        <Stempel text="BEISPIELWERTE" delay={70} style={{right: 40, bottom: -22, background: s.surface}} />
      </Karte>
      <AuftrittToki x={1720} y={930} k={0.85} delay={40} look={frame < 84 ? [-0.6, -0.9] : undefined} gesicht={frame < 84 ? 'denken' : 'freude'} armL={frame < 84 ? 18 : 160} armR={frame < 84 ? 35 : 160} />
      <Sfx name="kWhoosh" at={4} volume={0.4} />
      {[12, 17, 22].map((at) => (
        <Sfx key={at} name="kPop" at={at} volume={0.35} />
      ))}
      {[30, 40, 50].map((at) => (
        <Sfx key={at} name="kTick" at={at} volume={0.3} />
      ))}
      <Sfx name="kSprung" at={40} volume={0.4} />
      <Sfx name="kLanden" at={54} volume={0.45} />
      <Sfx name="kDing" at={80} volume={0.45} />
      <Sfx name="kHmm" at={58} volume={0.45} />
      <Sfx name="kYay" at={86} volume={0.5} />
      <Sfx name="kPop" at={70} volume={0.25} />
    </AbsoluteFill>
  );
};

/* ───────────── C · KI erklärt ───────────── */

const GAP = {cx: 1000, cy: 650, w: 300, h: 236};
const NEXT_GAP = {cx: 1280, cy: 650, w: 200, h: 236};
const K_ERKL = 1.25;

const Erklaert: React.FC = () => {
  const s = useStil();
  const serie = useSerie();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const landY = GAP.cy + (FOOT_Y - (BODY.y + BODY.h / 2)) * K_ERKL;
  const dropAt = 52;
  const drop = progress(frame, dropAt, 16, 'in');
  const landed = frame >= dropAt + 16;
  const settle = landed ? spring({frame: frame - dropAt - 16, fps, config: {damping: 9, stiffness: 180, mass: 0.6}}) : 0;
  const impact = landed ? 1 - settle : 0;
  const pick = progress(frame, 40, 10);
  const kandidaten = [
    {w: 'blau', v: 62},
    {w: 'grau', v: 21},
    {w: 'schön', v: 9},
  ];
  return (
    <AbsoluteFill>
      <Hintergrund blobs={[serie.tint2, serie.tint]} />
      <Kopf title="Wie eine KI schreibt" highlight="schreibt" />
      <div style={{position: 'absolute', right: 1920 - (GAP.cx - GAP.w / 2 - 34), top: GAP.cy - 62, fontFamily: s.head, fontSize: 100, fontWeight: 700, letterSpacing: '-0.03em', color: s.ink, whiteSpace: 'nowrap', lineHeight: 1.2}}>
        Der Himmel ist
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Shape d={rounded(GAP.cx - GAP.w / 2, GAP.cy - GAP.h / 2, GAP.w, GAP.h, 34)} stroke={s.ki} strokeWidth={5} dashed seed={2} opacity={1 - progress(frame, dropAt + 12, 6)} />
        <g opacity={progress(frame, 100, 14)}>
          <Shape d={rounded(NEXT_GAP.cx - NEXT_GAP.w / 2, NEXT_GAP.cy - NEXT_GAP.h / 2, NEXT_GAP.w, NEXT_GAP.h, 34)} stroke={s.ki} strokeWidth={5} dashed seed={5} />
          <text x={NEXT_GAP.cx} y={NEXT_GAP.cy + 34} textAnchor="middle" fontFamily={s.head} fontWeight={800} fontSize={96} fill={s.ki} opacity={0.55 + 0.45 * Math.sin(frame / 6)}>
            ?
          </text>
        </g>
      </svg>
      <div style={{position: 'absolute', left: 1330, top: 160}}>
        <div style={{fontFamily: s.body, fontSize: 32, fontWeight: 700, color: s.inkSoft, marginBottom: 16}}>nächstes Wort?</div>
        {kandidaten.map((c, i) => {
          const g = progress(frame, 8 + i * 6, 22);
          const win = i === 0;
          return (
            <div key={c.w} style={{display: 'flex', alignItems: 'center', gap: 18, height: 76, opacity: win ? 1 : mix(1, 0.35, pick)}}>
              <div style={{width: 130, fontFamily: s.head, fontSize: 44, fontWeight: 800, color: win && pick > 0 ? s.ki : s.ink}}>{c.w}</div>
              <div style={{width: 220, height: 40, borderRadius: 20, background: s.line, overflow: 'hidden'}}>
                <div style={{width: `${(c.v / 70) * 100 * g}%`, height: '100%', borderRadius: 20, background: win ? s.ki : '#B9BDC6'}} />
              </div>
              <div style={{fontFamily: s.body, fontSize: 34, fontWeight: 700, color: s.inkSoft}}>{Math.round(c.v * g)} %</div>
            </div>
          );
        })}
        <div style={{fontFamily: s.body, fontSize: 28, fontWeight: 600, color: s.inkSoft, marginTop: 8, opacity: 0.8}}>Beispielwerte</div>
      </div>
      {frame >= dropAt ? (
        <Toki
          x={GAP.cx}
          y={landed ? landY : mix(landY - 420, landY, drop)}
          k={K_ERKL}
          sx={1 + impact * 0.18 - (landed ? 0 : drop * 0.08)}
          sy={1 - impact * 0.22 + (landed ? 0 : drop * 0.12)}
          label="blau"
          gesicht={landed && frame >= dropAt + 24 ? 'freude' : 'neutral'}
          mouthO={landed ? undefined : 0.6}
          look={frame > 104 ? [1, 0] : [0, 0]}
          armL={landed && frame >= dropAt + 24 && frame < 100 ? 160 : 18}
          armR={landed && frame >= dropAt + 24 && frame < 100 ? 160 : frame >= 100 ? 80 : 18}
        />
      ) : null}
      {[8, 14, 20].map((at) => (
        <Sfx key={at} name="kTick" at={at} volume={0.3} />
      ))}
      <Sfx name="kDing" at={40} volume={0.4} />
      <Sfx name="kSwish" at={dropAt} volume={0.4} />
      <Sfx name="kLanden" at={dropAt + 16} volume={0.55} />
      <Sfx name="kYay" at={dropAt + 26} volume={0.5} />
      <Sfx name="kPop" at={100} volume={0.3} />
    </AbsoluteFill>
  );
};

/* ───────────── D · Recht ───────────── */

const FRISTEN = [
  {datum: '2. Aug. 2026', text: 'Hinweis-Pflicht für Chatbots gilt'},
  {datum: '2. Dez. 2026', text: 'Kennzeichnung älterer KI-Systeme'},
  {datum: '2. Dez. 2027', text: 'Regeln für Hochrisiko-KI'},
];

const Recht: React.FC = () => {
  const s = useStil();
  const serie = useSerie();
  const frame = useCurrentFrame();
  const lineY = 838;
  const xs = [300, 960, 1620];
  const heuteX = 520;
  const line = progress(frame, 40, 40, 'inOut');
  return (
    <AbsoluteFill>
      <Hintergrund blobs={[serie.tint2, serie.tint]} />
      <Kopf title="KI muss sich zu erkennen geben" highlight="erkennen" />
      <Karte x={140} y={300} w={900} delay={8} style={{padding: '34px 44px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <div style={{width: 70, height: 70, borderRadius: 20, background: serie.tint, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon icon="ph:scales-fill" size={42} color={serie.farbe} animate="pop" delay={14} />
          </div>
          <div style={{fontFamily: s.body}}>
            <div style={{fontSize: 34, fontWeight: 800, color: s.ink}}>EU-KI-Verordnung</div>
            <div style={{fontSize: 28, fontWeight: 600, color: s.inkSoft}}>Art. 50 Abs. 1 · sinngemäß</div>
          </div>
        </div>
        <div style={{marginTop: 26, paddingLeft: 26, borderLeft: `6px solid ${serie.farbe}`, fontFamily: s.head, fontSize: 42, fontWeight: 600, lineHeight: 1.3, color: s.ink, opacity: progress(frame, 22, 18)}}>
          „Wer mit einer KI spricht, muss darüber informiert werden – außer es ist offensichtlich.“
        </div>
        <div style={{marginTop: 24, fontFamily: s.body, fontSize: 28, fontWeight: 600, color: s.inkSoft}}>Quelle: VO (EU) 2024/1689, geändert durch VO (EU) 2026/1744</div>
      </Karte>
      <AuftrittToki x={1480} y={700} k={0.95} delay={30} look={[-0.4, 0]} smile={0.9} armR={frame >= 50 && frame < 120 ? 140 + 22 * Math.sin(frame / 3.2) : 18} />
      <Sprechblase x={1480} y={470} text="Hallo! Ich bin eine KI." delay={50} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={xs[0]} y1={lineY} x2={mix(xs[0], heuteX, line)} y2={lineY} stroke={serie.farbe} strokeWidth={6} strokeLinecap="round" />
        <line x1={heuteX} y1={lineY} x2={mix(heuteX, xs[2], line)} y2={lineY} stroke={s.faint} strokeWidth={6} strokeDasharray="4 14" strokeLinecap="round" opacity={line > 0.15 ? 1 : 0} />
        {xs.map((x, i) => {
          const at = 44 + i * 12;
          const p = progress(frame, at, 12);
          const past = i === 0;
          return <circle key={x} cx={x} cy={lineY} r={14 * p} fill={past ? serie.farbe : s.surface} stroke={serie.farbe} strokeWidth={5} />;
        })}
        <g opacity={progress(frame, 80, 12)}>
          <circle cx={heuteX} cy={lineY} r={9} fill={s.ki} />
          <text x={heuteX} y={lineY - 26} textAnchor="middle" fontFamily={s.body} fontWeight={800} fontSize={28} fill={s.ki}>
            heute
          </text>
        </g>
      </svg>
      {FRISTEN.map((f, i) => {
        const p = progress(frame, 50 + i * 12, 14);
        return (
          <div key={f.datum} style={{position: 'absolute', left: xs[i], top: lineY + 26, transform: `translateX(-50%) translateY(${(1 - p) * 12}px)`, textAlign: 'center', width: 520, opacity: p}}>
            <div style={{fontFamily: s.body, fontSize: 34, fontWeight: 800, color: i === 0 ? serie.farbe : s.ink}}>{f.datum}</div>
            <div style={{fontFamily: s.body, fontSize: 28, fontWeight: 600, color: s.inkSoft, marginTop: 4}}>{f.text}</div>
          </div>
        );
      })}
      <Sfx name="kWhoosh" at={6} volume={0.4} />
      <Sfx name="kSprung" at={30} volume={0.4} />
      <Sfx name="kLanden" at={44} volume={0.45} />
      {[44, 56, 68].map((at) => (
        <Sfx key={at} name="kTick" at={at} volume={0.3} />
      ))}
      <Sfx name="kPop" at={50} volume={0.4} />
      <Sfx name="kHallo" at={52} volume={0.6} />
      <Sfx name="kNotify" at={80} volume={0.3} />
    </AbsoluteFill>
  );
};

/* ───────────── Registrierung ───────────── */

const mit = (serie: SerieName, Scene: React.FC): React.FC => {
  const Comp: React.FC = () => (
    <StilContext.Provider value={KANAL}>
      <SerieContext.Provider value={serie}>
        <Scene />
      </SerieContext.Provider>
    </StilContext.Provider>
  );
  Comp.displayName = `Kanal-${serie}`;
  return Comp;
};

const projekt = (id: string, serie: SerieName, Scene: React.FC): Project => ({id, component: mit(serie, Scene), format: 'landscape', durationInFrames: 180, ordner: 'Kanal-Look'});

export const kanalLook: Project[] = [
  projekt('Kanal-News', 'news', News),
  projekt('Kanal-Test', 'test', Test),
  projekt('Kanal-Erklaert', 'erklaert', Erklaert),
  projekt('Kanal-Recht', 'recht', Recht),
];
