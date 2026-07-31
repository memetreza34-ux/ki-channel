import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {
  ThemeProvider, LivingBackground, WindowMock, ChatUI, PercentRing, Badge, Lucide, NeuralNet,
  PremiumIconLabel, KineticCaption, Checklist, MatrixDecode, WhipIn, ZoomPunch,
  a, prog, E, C,
} from '@studio/core';
import { BRAND } from '../../brand/brand';

// ════════════════════════════════════════════════════════════════════════════
//  REEL — "Warum ChatGPT manchmal lügt" (Halluzination, Mythos/Einordnung-Format).
//  Skript (6 Beats, DE, "du"):
//  1) Manchmal ist sich ChatGPT zu 100 Prozent sicher — und trotzdem komplett falsch.
//  2) Das nennt man Halluzination.
//  3) Die KI sagt nicht, was wahr ist — sie sagt, was am wahrscheinlichsten klingt.
//  4) Fehlt ihr Wissen, füllt sie die Lücke einfach plausibel auf.
//  5) Deshalb: wichtige Fakten immer selbst gegenchecken.
//  6) So bleibst du der Chef — nicht die KI. Folg mir für mehr ehrliche KI-Einblicke.
// ════════════════════════════════════════════════════════════════════════════
export const REEL_HALLUZINATION_FRAMES = 800; // ~26.7s @ 30fps

const B = [0, 90, 170, 330, 480, 630, 800];

const IconKicker: React.FC<{ icon: string; text: string; at: number }> = ({ icon, text, at }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 12, E.spring);
  return (
    <div style={{
      position: 'absolute', top: 84, left: '50%', transform: `translateX(-50%) scale(${0.85 + p * 0.15})`,
      opacity: p,
    }}>
      <PremiumIconLabel name={icon} label={text} size="md" at={at} fontSize={34} />
    </div>
  );
};

const Caption: React.FC<{ text: string; start: number; highlight?: string[]; size?: number }> = ({
  text, start, highlight = [], size = 52,
}) => (
  <div style={{ position: 'absolute', bottom: 190, width: 940, left: 70 }}>
    <KineticCaption text={text} start={start} perWord={4} size={size} highlight={highlight} />
  </div>
);

// Beat 1 — "Manchmal ist sich ChatGPT zu 100 Prozent sicher — und trotzdem komplett falsch."
const Beat1: React.FC = () => {
  const f = useCurrentFrame();
  const gone = prog(f, B[1] - 14, B[1], E.in);
  return (
    <AbsoluteFill style={{ opacity: 1 - gone, alignItems: 'center', justifyContent: 'center' }}>
      <IconKicker icon="triangle-alert" text="ACHTUNG" at={4} />
      <div style={{ position: 'relative' }}>
        <WindowMock title="chatgpt.com" w={820} h={460} at={16} light={false}>
          <ChatUI
            messages={[
              { role: 'user', text: 'Wann wurde die Glühbirne erfunden?', at: 22, cps: 30 },
              { role: 'ai', text: 'Am 14. März 1879 von Nikola Tesla.', at: 46, cps: 22 },
            ]}
            width={740} size={26}
          />
        </WindowMock>
        <div style={{ position: 'absolute', top: -50, right: -50, opacity: prog(f, 60, 76, E.spring) }}>
          <PercentRing cx={90} cy={90} radius={78} thickness={14} percent={100} color="#FF3333" start={60} end={78} label="SICHER" />
        </div>
      </div>
      <Caption text="Manchmal ist sich ChatGPT zu 100 Prozent sicher — und trotzdem komplett falsch"
        start={8} highlight={['chatgpt', 'falsch']} size={44} />
    </AbsoluteFill>
  );
};

// Beat 2 — "Das nennt man Halluzination."
// Vorher zu leer (nur 1 Badge im Nichts) — jetzt: NeuralNet als Kontext-Bewegung
// im Hintergrund (Signal-Welle läuft durch), Badge poppt davor.
const Beat2: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B[1];
  const enter = prog(local, 0, 16, E.spring);
  const gone = prog(local, (B[2] - B[1]) - 14, B[2] - B[1], E.in);
  const wave = Math.min(1, Math.max(0, (local - 6) / 60));
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - gone), alignItems: 'center', justifyContent: 'center' }}>
      <IconKicker icon="brain" text="DER BEGRIFF" at={B[1] + 2} />
      <div style={{ position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.55 }}>
        <NeuralNet layers={[3, 5, 5, 2]} w={820} h={420} wave={wave} dir="fwd" errorNode />
      </div>
      <WhipIn at={B[1] + 4}>
        <Badge text="HALLUZINATION" at={B[1] + 8} color="#B98CFF" rotate={-3} size={44} />
      </WhipIn>
      <Caption text="Das nennt man Halluzination" start={B[1] + 20} highlight={['halluzination']} size={54} />
    </AbsoluteFill>
  );
};

// Beat 3 — "Die KI sagt nicht, was wahr ist — sie sagt, was am wahrscheinlichsten klingt."
const CANDIDATES = [
  { word: 'Tesla', pct: 62, win: true },
  { word: 'Edison', pct: 31, win: false },
  { word: 'Swan', pct: 7, win: false },
];
const Beat3: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B[2];
  const enter = prog(local, 0, 16, E.spring);
  const gone = prog(local, (B[3] - B[2]) - 16, B[3] - B[2], E.in);
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - gone), alignItems: 'center', justifyContent: 'center' }}>
      <IconKicker icon="percent" text="SCHRITT 1 — WAHRSCHEINLICHKEIT" at={B[2] + 2} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 780 }}>
        {CANDIDATES.map((c, i) => {
          const barAt = B[2] + 20 + i * 14;
          const p = prog(local, 20 + i * 14, 20 + i * 14 + 20, E.out);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 130, fontFamily: 'monospace', fontWeight: 800, fontSize: 30,
                color: c.win ? 'var(--accent)' : a('#FFFFFF', 0.5) }}>{c.word}</div>
              <div style={{ flex: 1, height: 34, borderRadius: 10, background: a('#FFFFFF', 0.06), overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${c.pct * p}%`, borderRadius: 10,
                  background: c.win ? 'var(--accent)' : a('#FFFFFF', 0.22),
                  boxShadow: c.win ? '0 0 16px var(--accent)' : 'none' }} />
              </div>
              <div style={{ width: 60, fontFamily: 'monospace', fontWeight: 700, fontSize: 26,
                color: c.win ? 'var(--accent)' : C.gray, opacity: p }}>{c.pct}%</div>
            </div>
          );
        })}
        <div style={{ opacity: prog(local, 70, 86), fontFamily: 'monospace', fontSize: 24, color: C.gray, marginTop: 8 }}>
          gewählt = wahrscheinlichstes Wort, nicht zwingend wahr
        </div>
      </div>
      <Caption text="Die KI sagt nicht, was wahr ist — sie sagt, was am wahrscheinlichsten klingt"
        start={B[2] + 12} highlight={['wahr', 'wahrscheinlichsten']} size={42} />
    </AbsoluteFill>
  );
};

// Beat 4 — "Fehlt ihr Wissen, füllt sie die Lücke einfach plausibel auf."
const Beat4: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B[3];
  const enter = prog(local, 0, 16, E.spring);
  const gone = prog(local, (B[4] - B[3]) - 16, B[4] - B[3], E.in);
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - gone), alignItems: 'center', justifyContent: 'center' }}>
      <IconKicker icon="sparkles" text="SCHRITT 2 — LÜCKE FÜLLEN" at={B[3] + 2} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 34, alignItems: 'center' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 34, color: a('#FFFFFF', 0.55) }}>
          "Der Erfinder war …"
        </div>
        <MatrixDecode text="Nikola Tesla" at={B[3] + 20} per={4} size={64} />
      </div>
      <Caption text="Fehlt ihr Wissen, füllt sie die Lücke einfach plausibel auf"
        start={B[3] + 14} highlight={['plausibel']} size={46} />
    </AbsoluteFill>
  );
};

// Beat 5 — "Deshalb: wichtige Fakten immer selbst gegenchecken."
const Beat5: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B[4];
  const enter = prog(local, 0, 16, E.spring);
  const gone = prog(local, (B[5] - B[4]) - 16, B[5] - B[4], E.in);
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - gone), alignItems: 'center', justifyContent: 'center' }}>
      <IconKicker icon="search-check" text="DIE EINORDNUNG" at={B[4] + 2} />
      <ZoomPunch at={B[4] + 2}>
        <Checklist items={[
          { text: 'Quelle nennen lassen', appear: B[4] + 20 },
          { text: 'Kurz selbst googeln', appear: B[4] + 40 },
          { text: 'Bei Zahlen/Daten besonders wachsam', appear: B[4] + 60 },
        ]} />
      </ZoomPunch>
      <Caption text="Deshalb: wichtige Fakten immer selbst gegenchecken"
        start={B[4] + 14} highlight={['gegenchecken']} size={46} />
    </AbsoluteFill>
  );
};

// Beat 6 — Loop + CTA
const Beat6: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B[5];
  const enter = prog(local, 0, 16, E.spring);
  const spin = local * 1.6;
  const ringP = prog(local, 4, 20, E.spring);
  return (
    <AbsoluteFill style={{ opacity: enter, alignItems: 'center', justifyContent: 'center', gap: 46 }}>
      <div style={{ position: 'relative', width: 180, height: 180, opacity: ringP, transform: `scale(${ringP})` }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%',
          border: `2.5px dashed ${a('var(--accent)', 0.5)}`, transform: `rotate(${spin}deg)` }} />
        <div style={{ position: 'absolute', inset: 30, borderRadius: '50%',
          background: a('var(--accent)', 0.14), display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 40px ${a('var(--accent)', 0.4)}` }}>
          <Lucide name="shield-check" size={64} glow />
        </div>
      </div>
      <PremiumIconLabel name="sparkles" label="FOLGE FÜR MEHR EHRLICHE KI-EINBLICKE" size="md" at={B[5] + 10} fontSize={32} />
      <Caption text="So bleibst du der Chef — nicht die KI"
        start={B[5] + 40} highlight={['chef']} size={48} />
    </AbsoluteFill>
  );
};

export const ReelHalluzinationTest: React.FC = () => (
  <ThemeProvider value={BRAND}>
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <LivingBackground />
      <Beat1 /><Beat2 /><Beat3 /><Beat4 /><Beat5 /><Beat6 />
    </AbsoluteFill>
  </ThemeProvider>
);
