import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {
  ThemeProvider, WindowMock, ChatUI, Badge, Lucide, PremiumIconLabel,
  KineticCaption, WhipIn, a, prog, E,
} from '@studio/core';
import { BRAND } from '../../brand/brand';

// ════════════════════════════════════════════════════════════════════════════
//  TEST — komplett weißer Hintergrund statt dunkel-lila (Plan-Änderung, Test
//  vor globaler brand.ts-Umstellung). 3 kurze Beats, gleiches Thema wie das
//  Prompt-Trick-Reel, NUR zum Look-Vergleich. Dunkle Textfarbe statt Weiß,
//  WindowMock im light-Modus. Bausteine mit fest codierter weißer Schrift
//  (Checklist etc.) hier bewusst NICHT verwendet — bräuchten erst einen
//  Farb-Prop, falls wir uns für Weiß entscheiden.
// ════════════════════════════════════════════════════════════════════════════
export const STYLE_LIGHT_FRAMES = 450; // 15s @ 30fps

const B = [0, 150, 300, 450];
const INK = '#1A1A2E';

const IconKicker: React.FC<{ icon: string; text: string; at: number }> = ({ icon, text, at }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 12, E.spring);
  return (
    <div style={{
      position: 'absolute', top: 84, left: '50%', transform: `translateX(-50%) scale(${0.85 + p * 0.15})`,
      opacity: p,
    }}>
      <PremiumIconLabel name={icon} label={text} size="md" at={at} fontSize={34} textColor={INK} />
    </div>
  );
};

const Caption: React.FC<{ text: string; start: number; highlight?: string[]; size?: number }> = ({
  text, start, highlight = [], size = 50,
}) => (
  <div style={{ position: 'absolute', bottom: 190, width: 940, left: 70 }}>
    <KineticCaption text={text} start={start} perWord={4} size={size} highlight={highlight} color={INK} />
  </div>
);

// Beat 1 — Prompt-Frage
const Beat1: React.FC = () => {
  const f = useCurrentFrame();
  const gone = prog(f, B[1] - 14, B[1], E.in);
  return (
    <AbsoluteFill style={{ opacity: 1 - gone, alignItems: 'center', justifyContent: 'center' }}>
      <IconKicker icon="circle-help" text="DER FEHLER" at={4} />
      <WindowMock title="chatgpt.com" w={820} h={420} at={16} light>
        <ChatUI messages={[{ role: 'user', text: 'Schreib mir Werbetext.', at: 26, cps: 26 }]} width={720} size={28} />
      </WindowMock>
      <Caption text="Die meisten stellen ChatGPT eine schlechte Frage" start={8} highlight={['chatgpt']} />
    </AbsoluteFill>
  );
};

// Beat 2 — Begriff/Regel
const Beat2: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B[1];
  const enter = prog(local, 0, 16, E.spring);
  const gone = prog(local, (B[2] - B[1]) - 14, B[2] - B[1], E.in);
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - gone), alignItems: 'center', justifyContent: 'center' }}>
      <IconKicker icon="sparkles" text="DER HEBEL" at={B[1] + 2} />
      <WhipIn at={B[1] + 4}>
        <Badge text="KONTEXT SCHLÄGT KÜRZE" at={B[1] + 8} color="#B98CFF" rotate={-3} size={36} />
      </WhipIn>
      <Caption text="Ein einziges Detail ändert die ganze Antwort" start={B[1] + 20} highlight={['detail']} />
    </AbsoluteFill>
  );
};

// Beat 3 — Loop/CTA
const Beat3: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - B[2];
  const enter = prog(local, 0, 16, E.spring);
  const spin = local * 1.6;
  const ringP = prog(local, 4, 20, E.spring);
  return (
    <AbsoluteFill style={{ opacity: enter, alignItems: 'center', justifyContent: 'center', gap: 40 }}>
      <div style={{ position: 'relative', width: 170, height: 170, opacity: ringP, transform: `scale(${ringP})` }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%',
          border: `2.5px dashed ${a('var(--accent)', 0.6)}`, transform: `rotate(${spin}deg)` }} />
        <div style={{ position: 'absolute', inset: 28, borderRadius: '50%',
          background: a('var(--accent)', 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 30px ${a('var(--accent)', 0.3)}` }}>
          <Lucide name="repeat" size={56} color="var(--accent-dk)" />
        </div>
      </div>
      <PremiumIconLabel name="sparkles" label="FOLGE FÜR MEHR PROMPT-TRICKS" size="md" at={B[2] + 10} fontSize={30} textColor={INK} />
    </AbsoluteFill>
  );
};

export const StyleExperimentLight: React.FC = () => (
  <ThemeProvider value={BRAND}>
    <AbsoluteFill style={{ background: '#FFFFFF' }}>
      <Beat1 /><Beat2 /><Beat3 />
    </AbsoluteFill>
  </ThemeProvider>
);
