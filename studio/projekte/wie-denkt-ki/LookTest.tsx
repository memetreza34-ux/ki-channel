import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BASIS, BODY, FOOT_Y, Hintergrund, KANAL, rounded, Shape, StilContext, Toki, useStil, type Blick, type Stil} from '../kanal-look/stil';
import {clamp01, mix, progress, Sfx} from '../../kit';
import type {Project} from '../types';

/**
 * Look-Test: dieselbe Szene in mehreren Designs mit dem Token-Wesen als
 * Hauptfigur. Farben haben feste Bedeutung: mensch = Eingabe,
 * ki = was die KI erzeugt, gut = richtig, fehler = falsch.
 */


const PAPIER: Stil = {
  ...BASIS,
  label: 'Papier (handgezeichnet)',
  bg: '#F3ECDD',
  surface: '#FBF7EE',
  ink: '#1F1B16',
  inkSoft: '#6B6152',
  faint: '#C9BCA4',
  line: '#D9CDB6',
  mensch: '#2563C9',
  ki: '#F2B21B',
  kiInk: '#1F1B16',
  gut: '#2E8B57',
  fehler: '#C8402F',
  head: 'Fraunces, Georgia, serif',
  headWeight: 800,
  hand: 'Caveat, cursive',
  rough: true,
  outline: 4.5,
  pattern: 'korn',
  titleStyle: 'marker',
};

const KLAR: Stil = {
  ...BASIS,
  label: 'Klar (hell, modern)',
  bg: '#F6F6F3',
  surface: '#FFFFFF',
  ink: '#121417',
  inkSoft: '#5D6470',
  faint: '#C3C7CE',
  line: '#E3E5E8',
  mensch: '#FF6B3D',
  ki: '#3B5BFF',
  kiInk: '#FFFFFF',
  gut: '#12B76A',
  fehler: '#F04438',
  head: 'Inter, sans-serif',
  headWeight: 800,
  hand: 'Inter, sans-serif',
  softShadow: '0 18px 30px rgba(20,30,60,0.14)',
  pattern: 'punkte',
};

const PASTELL: Stil = {
  ...BASIS,
  label: 'Pastell flach (wie Kurzgesagt, hell)',
  bg: '#EAF4F0',
  surface: '#FFFFFF',
  ink: '#22313A',
  inkSoft: '#5E727C',
  faint: '#BFD3CC',
  line: '#D3E6DF',
  mensch: '#5B7CFA',
  ki: '#FF8657',
  kiInk: '#FFFFFF',
  gut: '#2DB37A',
  fehler: '#E5484D',
  head: 'Nunito, sans-serif',
  headWeight: 900,
  body: 'Nunito, sans-serif',
  hand: 'Nunito, sans-serif',
  pattern: 'blobs',
  blobs: ['#D5ECE3', '#FBE3D6', '#DFE5FB'],
};

const TECHNIK: Stil = {
  ...BASIS,
  label: 'Technik-Heft (Raster, präzise)',
  bg: '#EEF3F8',
  surface: '#F8FBFE',
  ink: '#14304D',
  inkSoft: '#4E6782',
  faint: '#B9C9DA',
  line: '#D5E0EC',
  mensch: '#2F6FD6',
  ki: '#FF7A1A',
  kiInk: '#FFFFFF',
  gut: '#1E9E68',
  fehler: '#D9363E',
  head: '"Space Grotesk", sans-serif',
  headWeight: 700,
  hand: '"JetBrains Mono", monospace',
  outline: 3,
  pattern: 'raster',
};

const POP: Stil = {
  ...BASIS,
  label: 'Bold Pop (dicke Linien, harte Schatten)',
  bg: '#FFF3D1',
  surface: '#FFFFFF',
  ink: '#111111',
  inkSoft: '#3B3B3B',
  faint: '#BDB39A',
  line: '#EFE3BE',
  mensch: '#3D6BFF',
  ki: '#FFD12E',
  kiInk: '#111111',
  gut: '#16A34A',
  fehler: '#EF4444',
  head: '"Archivo Black", sans-serif',
  headWeight: 400,
  hand: '"Archivo Black", sans-serif',
  outline: 5,
  hardShadow: true,
  pattern: 'punkte',
  titleStyle: 'block',
};

const RISO: Stil = {
  ...BASIS,
  label: 'Riso-Druck (zwei Farben, Körnung)',
  bg: '#F5F0E6',
  surface: '#FBF8F2',
  ink: '#1E2340',
  inkSoft: '#555A78',
  faint: '#CFC8BA',
  line: '#E5DED0',
  mensch: '#2E5BE0',
  ki: '#FF4D8D',
  kiInk: '#FFFFFF',
  gut: '#1F9D74',
  fehler: '#E2462F',
  head: '"Archivo Black", sans-serif',
  headWeight: 400,
  hand: 'Caveat, cursive',
  pattern: 'korn',
  misprint: 'rgba(255,77,141,0.5)',
};

const KNETE: Stil = {
  ...BASIS,
  label: 'Soft 3D (weich, plastisch)',
  bg: '#F1EFFB',
  surface: '#FFFFFF',
  ink: '#1E1B2E',
  inkSoft: '#625D78',
  faint: '#CFCAE3',
  line: '#E4E0F3',
  mensch: '#00A99D',
  ki: '#7B5CFF',
  kiInk: '#FFFFFF',
  gut: '#10B981',
  fehler: '#F43F5E',
  head: 'Inter, sans-serif',
  headWeight: 900,
  hand: 'Inter, sans-serif',
  softShadow: '0 22px 34px rgba(76,52,180,0.28)',
  pattern: 'verlauf',
  kiGradient: ['#A28CFF', '#5A3CF0'],
};

const DUNKEL: Stil = {
  ...BASIS,
  label: 'Dunkel klar (Vergleich)',
  bg: '#0E0F13',
  surface: '#181A20',
  ink: '#F1F0EC',
  inkSoft: '#9EA3AD',
  faint: '#4A4F59',
  line: '#2B2E36',
  mensch: '#5AB0FF',
  ki: '#FFC940',
  kiInk: '#2A1F00',
  gut: '#4CD98A',
  fehler: '#FF5D5D',
  head: '"Space Grotesk", Inter, sans-serif',
  headWeight: 700,
  hand: '"Space Grotesk", Inter, sans-serif',
  pattern: 'vignette',
};

/* ───────────── Szene ───────────── */

const K = 1.25;
const GAP = {cx: 1000, cy: 600, w: 300, h: 236};
const NEXT_GAP = {cx: 1300, cy: 600, w: 220, h: 236};
const HOME: Blick = [1570, 900];
const LAND: Blick = [GAP.cx, GAP.cy + (FOOT_Y - (BODY.y + BODY.h / 2)) * K];
const PANEL = {x: 1290, y: 200};
const CANDIDATES = [
  {word: 'blau', value: 62},
  {word: 'grau', value: 21},
  {word: 'schön', value: 9},
];

const T = {bars: 28, pick: 98, fly: 112, flyEnd: 132, crouch: 138, jump: 148, land: 180, next: 200};

const Luecke: React.FC<{box: typeof GAP; seed: number; opacity: number; pulse?: boolean}> = ({box, seed, opacity, pulse}) => {
  const s = useStil();
  const frame = useCurrentFrame();
  const q = pulse ? 0.55 + 0.45 * Math.sin(frame / 6) : 1;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <Shape d={rounded(box.cx - box.w / 2, box.cy - box.h / 2, box.w, box.h, 34)} stroke={s.ki} strokeWidth={5} dashed seed={seed} opacity={opacity} />
      <text x={box.cx} y={box.cy + 34} textAnchor="middle" fontFamily={s.head} fontWeight={s.headWeight} fontSize={96} fill={s.ki} opacity={opacity * q}>
        ?
      </text>
    </svg>
  );
};

const Titel: React.FC = () => {
  const s = useStil();
  const frame = useCurrentFrame();
  const kickIn = progress(frame, 0, 16);
  const titleIn = progress(frame, 4, 20);
  const shadow = s.misprint ? `5px 4px 0 ${s.misprint}` : undefined;
  const wort =
    s.titleStyle === 'marker' ? (
      <span style={{background: `linear-gradient(transparent 58%, ${s.ki} 58%, ${s.ki} 92%, transparent 92%)`, padding: '0 6px'}}>Token</span>
    ) : s.titleStyle === 'block' ? (
      <span
        style={{
          background: s.ki,
          color: s.kiInk,
          padding: '0 18px',
          border: s.outline ? `${s.outline}px solid ${s.ink}` : undefined,
          boxShadow: s.hardShadow ? `7px 7px 0 ${s.ink}` : undefined,
          display: 'inline-block',
          transform: 'rotate(-2deg)',
        }}
      >
        Token
      </span>
    ) : (
      <span style={{color: s.ki}}>Token</span>
    );
  return (
    <div style={{position: 'absolute', left: 140, top: 96}}>
      <div style={{fontFamily: s.body, fontSize: 32, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: s.inkSoft, opacity: kickIn}}>
        So schreibt eine KI
      </div>
      <div
        style={{
          fontFamily: s.head,
          fontSize: 92,
          fontWeight: s.headWeight,
          letterSpacing: s.head.includes('Archivo') ? '-0.01em' : '-0.03em',
          color: s.ink,
          marginTop: 12,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 24}px)`,
          textShadow: shadow,
        }}
      >
        Token für {wort}
      </div>
    </div>
  );
};

const Szene: React.FC = () => {
  const s = useStil();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pick = progress(frame, T.pick, 12);

  const fly = progress(frame, T.fly, T.flyEnd - T.fly, 'inOut');
  const chipFrom: Blick = [PANEL.x + 70, PANEL.y + 96];
  const chipTo: Blick = [HOME[0], HOME[1] - (FOOT_Y - BODY.y - 135) * K];

  // Sprung: Ausholen → Flug mit Strecken → Landung mit Stauchen → Nachfedern
  const crouch = progress(frame, T.crouch, 10, 'out') * (1 - progress(frame, T.jump, 4, 'out'));
  const jp = progress(frame, T.jump, T.land - T.jump, 'inOut');
  const inAir = frame >= T.jump && frame < T.land;
  const landed = frame >= T.land;
  const settle = landed ? spring({frame: frame - T.land, fps, config: {damping: 9, stiffness: 180, mass: 0.6}}) : 0;
  const impact = landed ? 1 - settle : 0;
  const x = landed ? LAND[0] : inAir ? mix(HOME[0], LAND[0], jp) : HOME[0];
  const y = landed ? LAND[1] : inAir ? mix(HOME[1], LAND[1], jp) - Math.sin(jp * Math.PI) * 340 : HOME[1];
  const stretch = inAir ? Math.sin(jp * Math.PI) : 0;
  const sx = 1 + crouch * 0.14 - stretch * 0.1 + impact * 0.18;
  const sy = 1 - crouch * 0.18 + stretch * 0.14 - impact * 0.22;
  const rot = inAir ? Math.sin(jp * Math.PI * 2) * -9 : 0;

  let look: Blick = [-0.9, 0.1];
  if (frame >= 18 && frame < T.pick + 6) look = [-0.2, -1];
  if (frame >= T.pick + 6 && frame < T.fly + 12) look = [-0.5, -0.8];
  if (frame >= T.fly + 12 && frame < T.crouch) look = [0, 0.7];
  if (frame >= T.crouch && frame < T.land) look = [-1, 0.2];
  if (frame >= T.land + 8 && frame < T.next + 4) look = [0, 0];
  if (frame >= T.next + 4) look = [1, 0];
  const blinkAt = (at: number) => Math.max(0, 1 - Math.abs(frame - at) / 3);
  const blink = Math.max(blinkAt(52), blinkAt(T.land + 14), blinkAt(228));
  const smile = landed ? mix(0.4, 1, progress(frame, T.land + 6, 12)) : 0.4;
  const mouthO = inAir ? Math.sin(jp * Math.PI) : 0;

  const nextIn = progress(frame, T.next, 16);
  const impactLines = landed ? progress(frame, T.land, 10) : 0;
  const shadow = s.misprint ? `5px 4px 0 ${s.misprint}` : undefined;
  const barStroke = s.rough ? s.ink : s.outline ? s.ink : undefined;

  return (
    <AbsoluteFill>
      <Hintergrund />
      <Titel />

      <div
        style={{
          position: 'absolute',
          right: 1920 - (GAP.cx - GAP.w / 2 - 34),
          top: GAP.cy - 62,
          fontFamily: s.head,
          fontSize: 100,
          fontWeight: s.rough ? 600 : s.headWeight === 400 ? 400 : 600,
          letterSpacing: '-0.02em',
          color: s.ink,
          whiteSpace: 'nowrap',
          lineHeight: 1.2,
          textShadow: shadow,
        }}
      >
        Der Himmel ist
      </div>
      <Luecke box={GAP} seed={2} opacity={1 - progress(frame, T.land - 4, 8)} pulse={frame < T.crouch} />
      <div style={{opacity: nextIn, transform: `translateX(${(1 - nextIn) * 30}px)`, position: 'absolute', inset: 0}}>
        <Luecke box={NEXT_GAP} seed={5} opacity={1} pulse />
      </div>

      <div style={{position: 'absolute', left: PANEL.x, top: PANEL.y, opacity: 1 - progress(frame, T.crouch, 14)}}>
        <div style={{fontFamily: s.rough ? s.hand : s.body, fontSize: s.rough ? 46 : 32, fontWeight: 700, color: s.inkSoft, opacity: progress(frame, T.bars - 8, 14), marginBottom: 18}}>
          nächstes Wort?
        </div>
        <svg width={620} height={300} style={{overflow: 'visible'}}>
          {CANDIDATES.map((c, i) => {
            const at = T.bars + i * 8;
            const grow = progress(frame, at, 22);
            const win = i === 0;
            const dim = win ? 1 : mix(1, 0.3, pick);
            const rowY = i * 90;
            const barW = (c.value / 70) * 260 * grow;
            const hideWord = win && frame >= T.fly;
            return (
              <g key={c.word} opacity={progress(frame, at - 4, 10) * dim}>
                {hideWord ? null : (
                  <text x={0} y={rowY + 48} fontFamily={s.head} fontWeight={s.headWeight} fontSize={s.headWeight === 400 ? 44 : 50} fill={win && pick > 0 ? s.ki : s.ink}>
                    {c.word}
                  </text>
                )}
                <Shape d={rounded(170, rowY + 14, 260, 44, 22)} fill={s.rough ? undefined : s.line} stroke={s.rough ? s.faint : barStroke} strokeWidth={s.rough ? 2.5 : Math.min(3, s.outline)} seed={20 + i} />
                {barW > 8 ? <Shape d={rounded(170, rowY + 14, barW, 44, 22)} fill={win ? s.ki : s.inkSoft} stroke={barStroke} strokeWidth={s.rough ? 2.5 : Math.min(3, s.outline)} seed={30 + i} /> : null}
                <text x={448} y={rowY + 48} fontFamily={s.body} fontWeight={700} fontSize={36} fill={s.inkSoft} opacity={grow}>
                  {Math.round(c.value * grow)} %
                </text>
              </g>
            );
          })}
        </svg>
        <div style={{fontFamily: s.body, fontSize: 28, fontWeight: 600, color: s.inkSoft, opacity: progress(frame, 70, 14) * 0.8, marginTop: -14}}>Beispielwerte</div>
      </div>

      {frame >= T.fly && frame < T.flyEnd ? (
        <div
          style={{
            position: 'absolute',
            left: mix(chipFrom[0], chipTo[0], fly),
            top: mix(chipFrom[1], chipTo[1], fly) - Math.sin(fly * Math.PI) * 120,
            transform: `translate(-50%, -50%) scale(${mix(1, 0.85, fly)})`,
            fontFamily: s.head,
            fontWeight: s.headWeight,
            fontSize: 50,
            color: s.ki,
          }}
        >
          blau
        </div>
      ) : null}

      {impactLines > 0 && impactLines < 1 ? (
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          {[-1, 1].map((side) =>
            [0, 1, 2].map((kk) => {
              const a = (side < 0 ? Math.PI : 0) + (kk - 1) * 0.5 * side;
              const r0 = 200 + impactLines * 40;
              const r1 = r0 + 40 * (1 - impactLines);
              return (
                <line
                  key={`${side}${kk}`}
                  x1={GAP.cx + Math.cos(a) * r0}
                  y1={GAP.cy + Math.sin(a) * r0 * 0.7}
                  x2={GAP.cx + Math.cos(a) * r1}
                  y2={GAP.cy + Math.sin(a) * r1 * 0.7}
                  stroke={s.ki}
                  strokeWidth={7}
                  strokeLinecap="round"
                  opacity={1 - impactLines}
                />
              );
            }),
          )}
        </svg>
      ) : null}

      <Toki
        x={x}
        y={y}
        k={K}
        sx={sx}
        sy={sy}
        rot={rot}
        look={look}
        blink={blink}
        smile={smile}
        mouthO={mouthO}
        label={frame >= T.flyEnd ? 'blau' : undefined}
        labelIn={clamp01(progress(frame, T.flyEnd, 6))}
      />

      <Sfx name="pop" at={T.bars} volume={0.25} />
      <Sfx name="ding" at={T.pick} volume={0.3} />
      <Sfx name="whoosh" at={T.fly} volume={0.25} />
      <Sfx name="whooshFast" at={T.jump} volume={0.3} />
      <Sfx name="thud" at={T.land} volume={0.4} />
      <Sfx name="pop" at={T.next} volume={0.2} />
    </AbsoluteFill>
  );
};

const DESIGNS: [slug: string, stil: Stil][] = [
  ['Kanal', KANAL],
  ['Papier', PAPIER],
  ['Klar', KLAR],
  ['Pastell', PASTELL],
  ['Technik', TECHNIK],
  ['Pop', POP],
  ['Riso', RISO],
  ['Knete', KNETE],
  ['Dunkel', DUNKEL],
];

export const LOOK_LABELS: Record<string, string> = Object.fromEntries(DESIGNS.map(([slug, stil]) => [`Look-${slug}`, stil.label]));

export const lookTests: Project[] = DESIGNS.map(([slug, stil]) => {
  const Comp: React.FC = () => (
    <StilContext.Provider value={stil}>
      <Szene />
    </StilContext.Provider>
  );
  Comp.displayName = `Look${slug}`;
  return {id: `Look-${slug}`, component: Comp, format: 'landscape', durationInFrames: 250, ordner: 'Tests'};
});
