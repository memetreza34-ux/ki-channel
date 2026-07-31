import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {
  ThemeProvider, LivingBackground, WindowMock, TokenStream, PremiumIconLabel, Lucide, Badge,
  Ranking, KineticCaption, WhipIn, ZoomPunch, PushThrough, a, prog, E, C,
} from '@studio/core';
import { BRAND } from '../../brand/brand';

// ════════════════════════════════════════════════════════════════════════════
//  REEL 30s — "KI baut dir eine Webseite aus einem Prompt" (v0 von Vercel).
//  Skript (7 Beats, DE, "du"):
//  1) Du tippst noch den ersten Satz in ChatGPT ein.
//  2) Diese KI hat deine Webseite da schon fertig gebaut.
//  3) Kein Code. Kein Baukasten. Nur ein Prompt.
//  4) Du beschreibst, was du willst — die KI zerlegt jeden Satz in Bedeutung.
//  5) Und baut daraus live, Block für Block, deine Seite.
//  6) Das Tool heißt v0 von Vercel — schneller als jeder Baukasten.
//  7) So baust du 2026 eine Webseite. Kommentier "KI", ich schick dir mehr solcher Tools.
//  v2: Icon-Zwischenüberschrift pro Beat (Lucide) + Animation enger an den Satz-Sinn
//  angepasst (Beat 1 wirkt "noch am Tippen", Beat 7 ist Loop/CTA statt Denk-Puls).
// ════════════════════════════════════════════════════════════════════════════
export const REEL_30S_FRAMES = 900; // 30s @ 30fps

const B = [0, 80, 160, 250, 430, 610, 760, 900]; // Beat-Grenzen (global frames)

// Icon+Text-Zwischenüberschrift oben (ersetzt reinen Text-Kicker)
const IconKicker: React.FC<{ icon: string; text: string; at: number }> = ({ icon, text, at }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 12, E.spring);
  return (
    <div style={{
      position: 'absolute', top: 84, left: '50%', transform: `translateX(-50%) scale(${0.85 + p * 0.15})`,
      opacity: p,
    }}>
      <PremiumIconLabel name={icon} label={text} size="md" at={at} fontSize={36} />
    </div>
  );
};

const Caption: React.FC<{ text: string; start: number; highlight?: string[]; size?: number }> = ({
  text, start, highlight = [], size = 54,
}) => (
  <div style={{ position: 'absolute', bottom: 200, width: 940, left: 70 }}>
    <KineticCaption text={text} start={start} perWord={4} size={size} highlight={highlight} />
  </div>
);

// Beat 1 — "Du tippst noch den ersten Satz in ChatGPT ein."
// Bewusst UNFERTIG: wachsender Text + blinkender Cursor, KEINE gesendete Bubble —
// spiegelt "tippst NOCH" statt einer bereits abgeschickten Nachricht.
const PROMPT_TEXT = 'Baue mir eine Landingpage für mein Café…';
const Beat1: React.FC = () => {
  const f = useCurrentFrame();
  const gone = prog(f, B[1] - 14, B[1], E.in);
  const typeStart = 24, cps = 14;
  const chars = Math.floor(Math.max(0, (f - typeStart)) / (30 / cps));
  const shown = PROMPT_TEXT.slice(0, Math.min(chars, PROMPT_TEXT.length));
  const cursorOn = Math.floor(f / 9) % 2 === 0;
  return (
    <AbsoluteFill style={{ opacity: 1 - gone, alignItems: 'center', justifyContent: 'center' }}>
      <IconKicker icon="message-circle" text="DU FORMULIERST GERADE" at={4} />
      <WindowMock title="chatgpt.com" w={860} h={480} at={16} light={false}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end' }}>
          <div style={{
            padding: '20px 26px', borderRadius: 20, background: a('#FFFFFF', 0.06),
            border: `1px solid ${a('var(--accent)', 0.3)}`, minHeight: 80,
            fontFamily: 'monospace', fontSize: 30, color: C.white,
          }}>
            {shown}
            <span style={{ opacity: cursorOn ? 1 : 0, color: 'var(--accent)' }}>▏</span>
          </div>
        </div>
      </WindowMock>
      <Caption text="Du tippst noch den ersten Satz in ChatGPT ein" start={6} highlight={['chatgpt']} />
    </AbsoluteFill>
  );
};

// Beat 2 — "Diese KI hat deine Webseite da schon fertig gebaut."
// Kontrast zu Beat 1: Seite ist bereits VOLLSTÄNDIG da (kein Aufbau-Effekt hier,
// das kommt erst in Beat 5) + Fertig-Haken als Pointe.
const Beat2: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B[1];
  const enter = prog(local, 0, 16, E.spring);
  const gone = prog(local, (B[2] - B[1]) - 14, B[2] - B[1], E.in);
  const checkP = prog(local, 28, 40, E.spring);
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - gone), alignItems: 'center', justifyContent: 'center' }}>
      <IconKicker icon="circle-check-big" text="SCHON FERTIG" at={B[1] + 2} />
      <ZoomPunch at={B[1] + 2}>
        <div style={{ position: 'relative' }}>
          <WindowMock title="deine-seite.com" w={860} h={480} light={false}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ height: 60, borderRadius: 12, background: a('var(--accent)', 0.35) }} />
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1, height: 90, borderRadius: 10, background: a('#FFFFFF', 0.08) }} />
                <div style={{ flex: 1, height: 90, borderRadius: 10, background: a('#FFFFFF', 0.08) }} />
                <div style={{ flex: 1, height: 90, borderRadius: 10, background: a('#FFFFFF', 0.08) }} />
              </div>
              <div style={{ height: 34, width: '60%', borderRadius: 8, background: a('#FFFFFF', 0.1) }} />
            </div>
          </WindowMock>
          <div style={{
            position: 'absolute', top: -26, right: -26, width: 76, height: 76, borderRadius: '50%',
            background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: checkP, transform: `scale(${checkP})`, boxShadow: `0 0 30px ${a(C.green, 0.7)}`,
          }}>
            <Lucide name="check" size={40} color="#0B0F14" glow={false} />
          </div>
        </div>
      </ZoomPunch>
      <Caption text="Diese KI hat deine Webseite da schon fertig gebaut" start={B[1] + 8} highlight={['ki']} />
    </AbsoluteFill>
  );
};

// Beat 3 — "Kein Code. Kein Baukasten. Nur ein Prompt."
const Beat3: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B[2];
  const enter = prog(local, 0, 14, E.spring);
  const gone = prog(local, (B[3] - B[2]) - 14, B[3] - B[2], E.in);
  const rows = [
    { txt: 'Kein Code.', strike: true, appear: 0 },
    { txt: 'Kein Baukasten.', strike: true, appear: 22 },
    { txt: 'Nur ein Prompt.', strike: false, appear: 46 },
  ];
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - gone), alignItems: 'center', justifyContent: 'center' }}>
      <IconKicker icon="ban" text="OHNE UMWEGE" at={4} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30, alignItems: 'center' }}>
        {rows.map((r, i) => {
          const p = prog(local, r.appear, r.appear + 12, E.spring);
          const strikeP = r.strike ? prog(local, r.appear + 14, r.appear + 26) : 0;
          return (
            <div key={i} style={{ position: 'relative', opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 58,
                color: r.strike ? a('#FFFFFF', 0.55) : 'var(--accent)',
                textShadow: r.strike ? 'none' : '0 0 30px var(--accent)' }}>{r.txt}</span>
              {r.strike && (
                <div style={{ position: 'absolute', left: 0, top: '50%', height: 4, background: '#FF3333',
                  width: `${strikeP * 100}%`, boxShadow: '0 0 10px #FF3333' }} />
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Beat 4 — "Du beschreibst, was du willst — die KI zerlegt jeden Satz in Bedeutung."
const Beat4: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B[3];
  const enter = prog(local, 0, 16, E.spring);
  const gone = prog(local, (B[4] - B[3]) - 20, B[4] - B[3], E.in);
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - gone), alignItems: 'center', justifyContent: 'center' }}>
      <IconKicker icon="brain" text="SCHRITT 1 — VERSTEHEN" at={B[3] + 2} />
      <div style={{
        transform: `scale(${1 + Math.sin(local * 0.05) * 0.018}) rotate(${Math.sin(local * 0.028) * 0.7}deg) translateY(${Math.sin(local * 0.04) * 6}px)`,
      }}>
        <TokenStream text="Landingpage für mein Café" start={B[3] + 16} w={860} />
      </div>
      <Caption text="Du beschreibst, was du willst — die KI zerlegt jeden Satz in Bedeutung"
        start={B[3] + 10} highlight={['ki', 'bedeutung']} size={46} />
    </AbsoluteFill>
  );
};

// Beat 5 — "Und baut daraus live, Block für Block, deine Seite."
const Beat5: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B[4];
  const enter = prog(local, 0, 16, E.spring);
  const gone = prog(local, (B[5] - B[4]) - 16, B[5] - B[4], E.in);
  const blocks = [0.9, 0.55, 0.7, 0.45, 0.6, 0.35];
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - gone), alignItems: 'center', justifyContent: 'center' }}>
      <IconKicker icon="layout-template" text="SCHRITT 2 — BAUEN" at={B[4] + 2} />
      <PushThrough at={B[4] + 2}>
        <WindowMock title="v0.dev" w={860} h={540} light={false}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {blocks.map((wf, i) => {
              const buildAt = 8 + i * 9;
              const p = prog(local, buildAt, buildAt + 14, E.out);
              return (
                <div key={i} style={{
                  height: 28, borderRadius: 8, width: `${wf * 100 * p}%`,
                  background: a('var(--accent)', 0.22 + p * 0.15),
                  border: `1px solid ${a('var(--accent)', 0.4)}`,
                }} />
              );
            })}
          </div>
        </WindowMock>
      </PushThrough>
      <Caption text="Und baut daraus live, Block für Block, deine Seite" start={B[4] + 8} highlight={['live']} />
    </AbsoluteFill>
  );
};

// Beat 6 — "Das Tool heißt v0 von Vercel — schneller als jeder Baukasten."
const Beat6: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B[5];
  const enter = prog(local, 0, 16, E.spring);
  const gone = prog(local, (B[6] - B[5]) - 16, B[6] - B[5], E.in);
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - gone), alignItems: 'center', justifyContent: 'center', gap: 50 }}>
      <IconKicker icon="rocket" text="DAS TOOL" at={B[5] + 2} />
      <WhipIn at={B[5] + 2}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 }}>
          <Badge text="v0 von Vercel" at={B[5] + 6} color="#B98CFF" rotate={-4} size={40} />
          <div style={{ width: 760 }}>
            <Ranking
              items={[
                { name: 'v0 (Prompt)', value: 'Sekunden', appear: B[5] + 30 },
                { name: 'Baukasten', value: 'Stunden', appear: B[5] + 40 },
                { name: 'Klassisch coden', value: 'Tage', appear: B[5] + 50 },
              ]}
            />
          </div>
        </div>
      </WhipIn>
      <Caption text="Das Tool heißt v0 von Vercel — schneller als jeder Baukasten"
        start={B[5] + 10} highlight={['v0']} size={48} />
    </AbsoluteFill>
  );
};

// Beat 7 — Loop + CTA. Ersetzt den "Denk-Puls" (passte inhaltlich nicht zu einem
// CTA-Satz) durch ein rotierendes Loop-Icon + Orbit-Ring — spiegelt "so baust du
// es IMMER WIEDER" / "folge für mehr" statt "KI verarbeitet gerade".
const Beat7: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B[6];
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
          <Lucide name="repeat" size={64} glow />
        </div>
      </div>
      <PremiumIconLabel name="sparkles" label="FOLGE FÜR MEHR KI-TOOLS" size="md" at={B[6] + 10} fontSize={36} />
      <Caption text="So baust du 2026 eine Webseite. Kommentier KI, ich schick dir mehr solcher Tools"
        start={B[6] + 40} highlight={['ki']} size={44} />
    </AbsoluteFill>
  );
};

export const Reel30sTest: React.FC = () => (
  <ThemeProvider value={BRAND}>
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <LivingBackground />
      <Beat1 /><Beat2 /><Beat3 /><Beat4 /><Beat5 /><Beat6 /><Beat7 />
    </AbsoluteFill>
  </ThemeProvider>
);
