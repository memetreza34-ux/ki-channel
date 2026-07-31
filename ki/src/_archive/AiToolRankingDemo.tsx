import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {
  ThemeProvider, C, prog, E, PremiumIconLabel, Ranking, BarsPremium, PremiumGrade,
} from '@studio/core';
import { BRAND } from '../../brand/brand';

export const AI_TOOL_RANKING_DEMO_FRAMES = 240;

const B1_OUT = 120; // Beat 1: Qualitäts-Ranking

// Beweis: dieselbe Karten-Optik (Ranking/Kosten-Balken) wie bei anderen faceless
// Tech-Creators geht mit unseren BESTEHENDEN Bausteinen, nur mit KI-Kanal-Lila
// statt Finanz-Grün — kein Finanz-Limit, core/brand-kit ist themenneutral.
// Korrektur nach Feedback: NICHT zwei unabhängige Vergleiche (Qualität + Preis)
// auf eine Fläche packen — jeder Beat zeigt GENAU EINEN Vergleich, wie in der
// Referenz (ein Slide pro Aussage). Emoji-Medaillen durch echte Rang-Badges ersetzt.
export const AiToolRankingDemo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <ThemeProvider value={BRAND}>
      <AbsoluteFill style={{ background: BRAND.bg }}>
        <div style={{ position: 'absolute', top: 100, left: 0, width: '100%', display: 'flex',
          justifyContent: 'center', opacity: prog(f, 0, 14, E.out) }}>
          <PremiumIconLabel
            name={f < B1_OUT ? 'trophy' : 'wallet'}
            label={f < B1_OUT ? 'WELCHES TOOL IST AM BESTEN?' : 'WAS KOSTET ES?'}
            size="sm" at={0} color={'var(--accent)'} fontSize={28}
          />
        </div>

        {/* ── BEAT 1 — Qualitäts-Ranking, für sich allein ── */}
        {f < B1_OUT && (
          <div style={{ position: 'absolute', top: 320, left: 100, width: 880 }}>
            <Ranking
              accent={'var(--accent)'}
              items={[
                { name: 'Claude Opus 4.8', value: '9.4', appear: 20 },
                { name: 'GPT-5', value: '9.1', appear: 34 },
                { name: 'Gemini 3', value: '8.7', appear: 48 },
              ]}
            />
          </div>
        )}

        {/* ── BEAT 2 — Preisvergleich, eigener Beat, eigene Fläche ── */}
        {f >= B1_OUT && (
          <>
            <div style={{ position: 'absolute', top: 320, left: 60, width: 960, height: 1160 }}>
              <BarsPremium
                width={960} height={1160} growStart={B1_OUT + 16} growEnd={B1_OUT + 60}
                data={[
                  { name: 'Claude', value: 20, color: 'var(--accent)' },
                  { name: 'GPT-5', value: 25, color: C.gold },
                  { name: 'Gemini', value: 19, color: C.negativeLt },
                ]}
              />
            </div>
            <div style={{ position: 'absolute', top: 1550, left: 0, width: '100%', textAlign: 'center',
              opacity: prog(f, B1_OUT + 30, B1_OUT + 44, E.out) }}>
              <span style={{ fontFamily: 'system-ui', fontWeight: 800, fontSize: 40, color: C.gray }}>
                Preis pro Monat in $
              </span>
            </div>
          </>
        )}

        <PremiumGrade intensity="subtle" />
      </AbsoluteFill>
    </ThemeProvider>
  );
};
