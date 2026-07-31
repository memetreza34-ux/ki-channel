import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {
  ThemeProvider, LivingBackground, WindowMock, ChatUI, PremiumIconLabel, Lucide,
  KineticCaption, a, prog, E, C,
} from '@studio/core';
import { BRAND } from '../../brand/brand';

// ════════════════════════════════════════════════════════════════════════════
//  REEL — "ChatGPT erinnert sich an nichts" (Konzept-Erklärer, kein Tool-Demo).
//  Standard-Layout ab jetzt: oben IMMER Icon-Kicker, Mitte = kontext-passende
//  Animation (muss nicht "premium" wirken, nur passend), unten Caption.
//  Skript (5 Beats, DE, "du"):
//  1) Du redest mit ChatGPT wie mit einem Freund.
//  2) Aber es erinnert sich an nichts von letztem Mal.
//  3) Jeder neue Chat startet komplett bei null.
//  4) Nur der aktuelle Verlauf zählt — sonst nichts.
//  5) Merk's dir: Wichtiges einfach nochmal reinschreiben. Folge für mehr KI-Basics.
// ════════════════════════════════════════════════════════════════════════════
export const REEL_MEMORY_FRAMES = 660; // 22s @ 30fps

const B = [0, 110, 230, 350, 470, 660];
const INK = '#1A1A2E'; // Standard-Textfarbe auf weißem BG statt Weiß

const IconKicker: React.FC<{ icon: string; text: string; at: number }> = ({ icon, text, at }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 12, E.spring);
  return (
    <div style={{
      position: 'absolute', top: 84, left: '50%', transform: `translateX(-50%) scale(${0.85 + p * 0.15})`,
      opacity: p,
    }}>
      <PremiumIconLabel name={icon} label={text} size="md" at={at} fontSize={32} textColor={INK} />
    </div>
  );
};

const Caption: React.FC<{ text: string; start: number; highlight?: string[]; size?: number }> = ({
  text, start, highlight = [], size = 50,
}) => (
  <div style={{ position: 'absolute', bottom: 190, width: 940, left: 70 }}>
    <KineticCaption text={text} start={start} perWord={6.5} size={size} highlight={highlight} color={INK} />
  </div>
);

// Beat 1 — "Du redest mit ChatGPT wie mit einem Freund."
const Beat1: React.FC = () => {
  const f = useCurrentFrame();
  const gone = prog(f, B[1] - 14, B[1], E.in);
  return (
    <AbsoluteFill style={{ opacity: 1 - gone, alignItems: 'center', justifyContent: 'center' }}>
      <IconKicker icon="message-circle" text="DER ALLTAG" at={4} />
      <WindowMock title="chatgpt.com" w={820} h={440} at={16} light={false}>
        <ChatUI messages={[
          { role: 'user', text: 'Guten Morgen! Wie war dein Tag?', at: 24, cps: 26 },
          { role: 'ai', text: 'Guten Morgen! Ich hoffe, deiner startet gut.', at: 48, cps: 24 },
        ]} width={720} size={26} />
      </WindowMock>
      <Caption text="Du redest mit ChatGPT wie mit einem Freund" start={8} highlight={['chatgpt', 'freund']} />
    </AbsoluteFill>
  );
};

// Beat 2 — "Aber es erinnert sich an nichts von letztem Mal."
// Animation: die Chat-Bubbles von eben lösen sich auf (blur+fade), Eraser-Icon zieht durch.
const Beat2: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B[1];
  const enter = prog(local, 0, 16, E.spring);
  const gone = prog(local, (B[2] - B[1]) - 16, B[2] - B[1], E.in);
  const erase = prog(local, 20, 60, E.out);
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - gone), alignItems: 'center', justifyContent: 'center' }}>
      <IconKicker icon="eraser" text="DAS GEDÄCHTNIS" at={B[1] + 2} />
      <div style={{ position: 'relative', width: 820, height: 300 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22,
          filter: `blur(${erase * 14}px)`, opacity: 1 - erase * 0.9 }}>
          <div style={{ alignSelf: 'flex-end', padding: '16px 26px', borderRadius: 18,
            background: a('var(--accent)', 0.22), border: `1px solid ${a('var(--accent)', 0.4)}`,
            fontFamily: 'monospace', fontSize: 24, color: INK }}>
            Guten Morgen! Wie war dein Tag?
          </div>
          <div style={{ alignSelf: 'flex-start', padding: '16px 26px', borderRadius: 18,
            background: a(INK, 0.06), border: `1px solid ${a(INK, 0.15)}`,
            fontFamily: 'monospace', fontSize: 24, color: INK }}>
            Guten Morgen! Ich hoffe, deiner startet gut.
          </div>
        </div>
        <div style={{ position: 'absolute', left: `${erase * 88}%`, top: '50%', transform: 'translate(-50%,-50%)' }}>
          <Lucide name="eraser" size={54} color={C.negative} />
        </div>
      </div>
      <Caption text="Aber es erinnert sich an nichts von letztem Mal" start={B[1] + 10} highlight={['nichts']} />
    </AbsoluteFill>
  );
};

// Beat 3 — "Jeder neue Chat startet komplett bei null."
const Beat3: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B[2];
  const enter = prog(local, 0, 16, E.spring);
  const gone = prog(local, (B[3] - B[2]) - 16, B[3] - B[2], E.in);
  const p = prog(local, 16, 34, E.spring);
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - gone), alignItems: 'center', justifyContent: 'center' }}>
      <IconKicker icon="refresh-ccw" text="NEUER CHAT" at={B[2] + 2} />
      <WindowMock title="chatgpt.com — neuer Chat" w={820} h={420} at={0} light={false}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100%', gap: 20, opacity: p }}>
          <Lucide name="message-square-text" size={72} color={a('#FFFFFF', 0.35)} glow={false} />
          <div style={{ fontFamily: 'monospace', fontSize: 26, color: a('#FFFFFF', 0.4) }}>
            leerer Verlauf — kein Kontext von vorher
          </div>
        </div>
      </WindowMock>
      <Caption text="Jeder neue Chat startet komplett bei null" start={B[2] + 10} highlight={['null']} />
    </AbsoluteFill>
  );
};

// Beat 4 — "Nur der aktuelle Verlauf zählt — sonst nichts."
const Beat4: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B[3];
  const enter = prog(local, 0, 16, E.spring);
  const gone = prog(local, (B[4] - B[3]) - 16, B[4] - B[3], E.in);
  const rows = [
    { txt: 'Dieser Chat', on: true, appear: 14 },
    { txt: 'Chat von gestern', on: false, appear: 30 },
    { txt: 'Chat letzte Woche', on: false, appear: 46 },
  ];
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - gone), alignItems: 'center', justifyContent: 'center' }}>
      <IconKicker icon="history" text="WAS ZÄHLT" at={B[3] + 2} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {rows.map((r, i) => {
          const p = prog(local, r.appear, r.appear + 14, E.spring);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18,
              opacity: p, transform: `translateX(${(1 - p) * -20}px)` }}>
              <div style={{ width: 16, height: 16, borderRadius: 8,
                background: r.on ? 'var(--accent)' : a('#FFFFFF', 0.2),
                boxShadow: r.on ? '0 0 14px var(--accent)' : 'none' }} />
              <span style={{ fontFamily: 'monospace', fontSize: 32, fontWeight: 700,
                color: r.on ? INK : a(INK, 0.35),
                textDecoration: r.on ? 'none' : 'line-through' }}>{r.txt}</span>
            </div>
          );
        })}
      </div>
      <Caption text="Nur der aktuelle Verlauf zählt — sonst nichts" start={B[3] + 10} highlight={['aktuelle']} />
    </AbsoluteFill>
  );
};

// Beat 5 — Loop + CTA
// Vorher zu statisch (nur ein still stehender Ring) — jetzt: kleine "Notiz"-Chips
// steigen durchgehend nach oben auf (spiegelt "Wichtiges nochmal reinschreiben"),
// plus sanftes Atmen des Save-Icons. Immer Bewegung im Bild, nicht nur 1 Icon.
const NOTE_CHIPS = ['Ziel', 'Zielgruppe', 'Kontext', 'Ton'];
const Beat5: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B[4];
  const enter = prog(local, 0, 16, E.spring);
  const spin = local * 1.4;
  const ringP = prog(local, 4, 20, E.spring);
  const breathe = 1 + Math.sin(local * 0.08) * 0.05;
  return (
    <AbsoluteFill style={{ opacity: enter, alignItems: 'center', justifyContent: 'center', gap: 40 }}>
      <IconKicker icon="pencil-line" text="DER TIPP" at={B[4] + 2} />
      <div style={{ position: 'relative', width: 260, height: 260 }}>
        {NOTE_CHIPS.map((label, i) => {
          const cycle = 90;
          const phase = (local - i * 22 + 400) % cycle;
          const rise = phase / cycle; // 0..1, loopt durchgehend
          const op = Math.sin(rise * Math.PI); // fade in, oben fade out
          const x = -70 + i * 48;
          const y = 90 - rise * 200;
          if (local < i * 22) return null;
          return (
            <div key={i} style={{ position: 'absolute', left: '50%', top: '50%',
              transform: `translate(${x}px, ${y}px)`, opacity: op * 0.85,
              padding: '6px 14px', borderRadius: 8, background: a('var(--accent)', 0.14),
              border: `1px solid ${a('var(--accent)', 0.4)}`, fontFamily: 'monospace',
              fontSize: 18, fontWeight: 700, color: 'var(--accent-dk)', whiteSpace: 'nowrap' }}>
              {label}
            </div>
          );
        })}
        <div style={{ position: 'absolute', inset: 50, opacity: ringP, transform: `scale(${ringP})` }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%',
            border: `2.5px dashed ${a('var(--accent)', 0.5)}`, transform: `rotate(${spin}deg)` }} />
          <div style={{ position: 'absolute', inset: 26, borderRadius: '50%',
            background: a('var(--accent)', 0.14), display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 36px ${a('var(--accent)', 0.4)}`, transform: `scale(${breathe})` }}>
            <Lucide name="save" size={58} glow />
          </div>
        </div>
      </div>
      <Caption text="Merk's dir: Wichtiges einfach nochmal reinschreiben. Folge für mehr KI-Basics"
        start={B[4] + 30} highlight={['wichtiges']} size={42} />
    </AbsoluteFill>
  );
};

export const ReelMemoryTest: React.FC = () => (
  <ThemeProvider value={BRAND}>
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <LivingBackground />
      <Beat1 /><Beat2 /><Beat3 /><Beat4 /><Beat5 />
    </AbsoluteFill>
  </ThemeProvider>
);
