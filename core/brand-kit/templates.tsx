import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, life, sec } from './tokens';
import { Background, Vignette } from './components/Background';
import { Kicker, Title, WordReveal } from './components/Text';
import { CompareSplit as _CompareSplit, Checklist, Quote } from './components/Layouts';
import { NumberedSteps } from './components/Steps';
import { LogoIntro } from './components/Branding';
import { RollingNumber } from './components/Effects';
import { prog, E } from './tokens';
import { MEANING } from './tokens';
import type { IconName } from './components/Icon';

// ════════════════════════════════════════════════════════════════════════════
//  SZENEN-VORLAGEN — fertige Layouts. Timing in absoluten Frames (inF/outF).
//  Eine Szene = eine durchgehende Timeline; mehrere Szenen via <Sequence> stitchen.
// ════════════════════════════════════════════════════════════════════════════

// ─── HOOK — Kicker + starke Aussage (Wort-für-Wort) ───────────────────────────
export const HookScene: React.FC<{
  inF: number; outF: number; kicker?: string; statement: string; highlight?: string[]; color?: string;
}> = ({ inF, outF, kicker, statement, highlight = [], color = 'var(--accent)' }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 12), alignItems: 'center', justifyContent: 'center' }}>
      <Background grid glow />
      <div style={{ textAlign: 'center', paddingInline: 60, zIndex: 2 }}>
        {kicker && <div style={{ marginBottom: 40 }}><Kicker at={inF + 4} color={color}>{kicker}</Kicker></div>}
        <WordReveal text={statement} start={inF + 14} perWord={5} size={92}
          highlight={highlight} highlightColor={color} />
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── STAT — eine große Zahl (Odometer) + Label ────────────────────────────────
export const StatScene: React.FC<{
  inF: number; outF: number; value: number; label: string; color?: string; suffix?: string;
}> = ({ inF, outF, value, label, color = 'var(--accent)', suffix = ' €' }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 12), alignItems: 'center', justifyContent: 'center' }}>
      <Background grid glow />
      <div style={{ textAlign: 'center', zIndex: 2 }}>
        <RollingNumber to={value} start={inF + 8} end={inF + 50} size={200} color={color} suffix={suffix} />
        <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 52, color: C.white, marginTop: 24,
          opacity: life(f, inF + 12, outF, 10) }}>{label}</div>
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── VERGLEICH — A vs B ───────────────────────────────────────────────────────
export const CompareScene: React.FC<{
  inF: number; outF: number; title?: string;
  left: { title: string; value: string; sub?: string; icon?: any; color?: string };
  right: { title: string; value: string; sub?: string; icon?: any; color?: string };
}> = ({ inF, outF, title, left, right }) => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 12) }}>
      <Background grid glow />
      {title && <div style={{ position: 'absolute', top: 130, width: '100%', textAlign: 'center', zIndex: 2 }}>
        <Title at={inF + 4} size={84}>{title}</Title></div>}
      <div style={{ position: 'absolute', top: 440, left: 60, right: 60, zIndex: 2 }}>
        <_CompareSplit height={720}
          left={{ ...left, color: left.color ?? MEANING.problem, appear: inF + 14 }}
          right={{ ...right, color: right.color ?? MEANING.positive, appear: inF + 22 }} />
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── ERKLÄR — Titel oben + freier Inhalt (Chart/Diagramm) ─────────────────────
export const ExplainScene: React.FC<{
  inF: number; outF: number; title: string; children?: React.ReactNode;
}> = ({ inF, outF, title, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 12) }}>
      <Background grid glow />
      <div style={{ position: 'absolute', top: 120, width: '100%', textAlign: 'center', zIndex: 2 }}>
        <Title at={inF + 4} size={80}>{title}</Title>
      </div>
      <div style={{ zIndex: 2 }}>{children}</div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── CTA — zwei Zeilen + Pfeil ────────────────────────────────────────────────
export const CTAScene: React.FC<{
  inF: number; outF: number; line1: string; line2: string;
}> = ({ inF, outF, line1, line2 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 10), alignItems: 'center', justifyContent: 'center' }}>
      <Background grid glow />
      <div style={{ textAlign: 'center', zIndex: 2 }}>
        <Title at={inF + 4} size={110} color={C.white}>{line1}</Title>
        <div style={{ marginTop: 10 }}><Title at={inF + 14} size={110} color={'var(--accent)'}>{line2}</Title></div>
        <div style={{ marginTop: 40, fontSize: 90, opacity: life(f, inF + 24, outF, 8) }}>👇</div>
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── INTRO — Logo + Video-Titel zum Eröffnen ──────────────────────────────────
export const IntroScene: React.FC<{
  inF: number; outF: number; title: string; kicker?: string;
}> = ({ inF, outF, title, kicker = 'FinanzNeo' }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 12), alignItems: 'center', justifyContent: 'center' }}>
      <Background grid glow />
      <div style={{ position: 'absolute', top: '24%' }}><LogoIntro at={inF + 4} /></div>
      <div style={{ position: 'absolute', top: '58%', width: '100%', textAlign: 'center', paddingInline: 60 }}>
        <div style={{ opacity: prog(f, inF + 30, inF + 44) }}>
          <Kicker at={inF + 30}>{kicker}</Kicker>
        </div>
        <div style={{ marginTop: 24 }}>
          <Title at={inF + 38} size={88}>{title}</Title>
        </div>
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── STEPS — nummerierte Schritte („3 Schritte zum Depot") ────────────────────
export const StepsScene: React.FC<{
  inF: number; outF: number; title: string;
  steps: { label: string; icon?: IconName }[]; color?: string;
}> = ({ inF, outF, title, steps, color = 'var(--accent)' }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 12) }}>
      <Background grid glow />
      <div style={{ position: 'absolute', top: 130, width: '100%', textAlign: 'center', zIndex: 2 }}>
        <Title at={inF + 4} size={84}>{title}</Title>
      </div>
      <div style={{ position: 'absolute', top: 420, left: 130, right: 130, zIndex: 2 }}>
        <NumberedSteps color={color} steps={steps.map((s, i) => ({ label: s.label, icon: s.icon, appear: inF + 18 + i * 16 }))} />
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── LIST — Checkliste / Aufzählung ───────────────────────────────────────────
export const ListScene: React.FC<{
  inF: number; outF: number; title: string; items: string[]; solveAll?: boolean;
}> = ({ inF, outF, title, items, solveAll = false }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 12) }}>
      <Background grid glow />
      <div style={{ position: 'absolute', top: 140, width: '100%', textAlign: 'center', zIndex: 2 }}>
        <Title at={inF + 4} size={80}>{title}</Title>
      </div>
      <div style={{ position: 'absolute', top: 420, left: 120, right: 120, zIndex: 2 }}>
        <Checklist items={items.map((t, i) => ({ text: t, appear: inF + 18 + i * 16, solve: solveAll ? inF + 40 + i * 12 : undefined }))} />
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── QUOTE — starke Aussage / Zitat ───────────────────────────────────────────
export const QuoteScene: React.FC<{
  inF: number; outF: number; text: string; author?: string; color?: string;
}> = ({ inF, outF, text, author, color = 'var(--accent)' }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 12), alignItems: 'center', justifyContent: 'center' }}>
      <Background grid glow />
      <div style={{ zIndex: 2 }}>
        <Quote text={text} author={author} at={inF + 8} color={color} size={70} />
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

// ─── SECTION DIVIDER — Kapitel-Trenner („Teil 1 — Grundlagen") ────────────────
export const SectionDivider: React.FC<{
  inF: number; outF: number; part: string; title: string; color?: string;
}> = ({ inF, outF, part, title, color = 'var(--accent)' }) => {
  const f = useCurrentFrame();
  const lineW = prog(f, inF + 14, inF + 34, E.out);
  return (
    <AbsoluteFill style={{ opacity: life(f, inF, outF, 10), alignItems: 'center', justifyContent: 'center' }}>
      <Background grid glow />
      <div style={{ textAlign: 'center', zIndex: 2 }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 200, color, lineHeight: 0.9,
          opacity: prog(f, inF + 2, inF + 16, E.spring),
          transform: `scale(${0.7 + prog(f, inF + 2, inF + 16, E.spring) * 0.3})`,
          textShadow: `0 0 70px ${color}66` }}>{part}</div>
        <div style={{ width: lineW * 360, height: 5, background: color, margin: '24px auto', borderRadius: 3,
          boxShadow: `0 0 16px ${color}` }} />
        <Title at={inF + 22} size={76}>{title}</Title>
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};
