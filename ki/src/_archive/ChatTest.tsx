import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ThemeProvider, LivingBackground, FilmGrain, Vignette, ChatUI, type ChatMsg } from '@studio/core';
import { BRAND } from '../../brand/brand';

const msgs: ChatMsg[] = [
  { role: 'user', text: 'Erklär mir ETFs in einem Satz.', at: 6 },
  { role: 'ai', text: 'Ein ETF ist ein Korb aus vielen Aktien, den du mit einem einzigen Kauf besitzt.', at: 40, cps: 34 },
];

export const ChatTest: React.FC = () => (
  <ThemeProvider value={{ accent: BRAND.accent, accentDk: BRAND.accentDk, bg: BRAND.bg, bgDeep: BRAND.bgDeep }}>
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <LivingBackground />
      <FilmGrain opacity={0.05} />
      <div style={{ position: 'absolute', top: 620, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <ChatUI messages={msgs} width={920} title="ChatGPT" />
      </div>
      <Vignette />
    </AbsoluteFill>
  </ThemeProvider>
);
