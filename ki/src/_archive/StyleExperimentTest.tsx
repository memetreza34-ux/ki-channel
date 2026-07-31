import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {
  ThemeProvider, LivingBackground, WindowMock, BigStat, Badge, KineticCaption,
  Ranking, WhipIn, ZoomPunch, a, prog, E,
} from '@studio/core';
import { BRAND } from '../../brand/brand';

// ════════════════════════════════════════════════════════════════════════════
//  STYLE-EXPERIMENT — faceless Tech-Deck-Look (Referenz: "Loading a website" /
//  "The server builds the page" / Frontend-Ranking), in unserem Lila/KI-Ton.
//  EIN langer Satz, in 3 Beats zerlegt und passend visualisiert:
//  "Während du noch überlegst, was du in ChatGPT eingeben sollst — hat diese KI
//   deine Website in unter einer Sekunde schon gebaut."
// ════════════════════════════════════════════════════════════════════════════
export const STYLE_EXPERIMENT_FRAMES = 270;

const B1_END = 95;   // Beat 1: 0–95
const B2_END = 185;  // Beat 2: 95–185
const B3_END = 270;  // Beat 3: 185–270

// Nummer-Badge oben (01/02/03 — Schritt-Zähler durchs Reel)
const StepBadge: React.FC<{ n: string; at: number }> = ({ n, at }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 10, E.spring);
  return (
    <div style={{
      position: 'absolute', top: 90, left: '50%', transform: `translateX(-50%) scale(${p})`,
      padding: '10px 26px', borderRadius: 12, border: `1.5px solid ${a('var(--accent)', 0.5)}`,
      background: a('var(--accent)', 0.12), fontFamily: 'monospace', fontWeight: 800, fontSize: 32,
      color: 'var(--accent)', opacity: p, letterSpacing: 2,
    }}>{n}</div>
  );
};

// Beat 1 — "Während du noch überlegst, was du in ChatGPT eingeben sollst"
const Beat1: React.FC = () => {
  const f = useCurrentFrame();
  const gone = prog(f, B1_END - 14, B1_END, E.in);
  return (
    <AbsoluteFill style={{ opacity: 1 - gone, alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
      <StepBadge n="01" at={4} />
      <div style={{ transform: `translateY(${(1 - gone) * -30 * gone}px)` }}>
        <WindowMock title="chatgpt.com" w={860} h={480} at={22} light={false}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, height: '100%', justifyContent: 'center' }}>
            <div style={{ height: 22, width: '70%', borderRadius: 8, background: a('#FFFFFF', 0.08) }} />
            <div style={{ height: 22, width: '45%', borderRadius: 8, background: a('#FFFFFF', 0.08) }} />
            <div style={{
              marginTop: 20, height: 3, width: prog(f, 40, 92) * 60 + '%',
              background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)',
            }} />
          </div>
        </WindowMock>
      </div>
      <div style={{ position: 'absolute', bottom: 220, width: 940, left: 70 }}>
        <KineticCaption
          text="Während du noch überlegst, was du in ChatGPT eingeben sollst"
          start={8} perWord={4.2} size={54}
          highlight={['chatgpt']}
        />
      </div>
    </AbsoluteFill>
  );
};

// Beat 2 — "hat diese KI deine Website" (Seite baut sich progressiv auf)
const Beat2: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B1_END;
  const enter = prog(local, 0, 16, E.spring);
  const gone = prog(local, (B2_END - B1_END) - 14, B2_END - B1_END, E.in);
  const blocks = [0.9, 0.6, 0.75, 0.4, 0.55];
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - gone), alignItems: 'center', justifyContent: 'center' }}>
      <StepBadge n="02" at={B1_END + 2} />
      <ZoomPunch at={B1_END + 2}>
        <WindowMock title="deine-website.com" w={860} h={520} light={false}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {blocks.map((wf, i) => {
              const buildAt = 6 + i * 7;
              const p = prog(local, buildAt, buildAt + 14, E.out);
              return (
                <div key={i} style={{
                  height: 30, borderRadius: 8, width: `${wf * 100 * p}%`,
                  background: a('var(--accent)', 0.22 + p * 0.15),
                  border: `1px solid ${a('var(--accent)', 0.4)}`,
                }} />
              );
            })}
          </div>
        </WindowMock>
      </ZoomPunch>
      <div style={{ position: 'absolute', bottom: 220, width: 940, left: 70 }}>
        <KineticCaption text="hat diese KI deine Website" start={B1_END + 10} perWord={4.2} size={58}
          highlight={['ki']} />
      </div>
    </AbsoluteFill>
  );
};

// Beat 3 — "in unter einer Sekunde schon gebaut." (Stat-Reveal + Ranking)
const Beat3: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B2_END;
  const enter = prog(local, 0, 16, E.spring);
  return (
    <AbsoluteFill style={{ opacity: enter, alignItems: 'center', justifyContent: 'center', gap: 60 }}>
      <StepBadge n="03" at={B2_END + 2} />
      <WhipIn at={B2_END + 2}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50 }}>
          <BigStat value="0.9s" label="TIME TO WEBSITE" at={B2_END + 8} size={220} />
          <div style={{ width: 760 }}>
            <Ranking
              items={[
                { name: 'Diese KI', value: '0.9s', appear: B2_END + 40 },
                { name: 'Klassisch coden', value: '3 Tage', appear: B2_END + 50 },
                { name: 'Baukasten-Tool', value: '2 Std.', appear: B2_END + 60 },
              ]}
            />
          </div>
        </div>
      </WhipIn>
      <div style={{ position: 'absolute', bottom: 150, width: 940, left: 70 }}>
        <KineticCaption text="in unter einer Sekunde schon gebaut" start={B2_END + 4} perWord={4.2} size={58}
          highlight={['sekunde']} />
      </div>
    </AbsoluteFill>
  );
};

export const StyleExperimentTest: React.FC = () => (
  <ThemeProvider value={BRAND}>
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <LivingBackground />
      <Beat1 />
      <Beat2 />
      <Beat3 />
    </AbsoluteFill>
  </ThemeProvider>
);
