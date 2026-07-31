import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { ThemeProvider, AIRipple, NotificationStack, PremiumIcon, Kicker, blindsWipe, prog } from '@studio/core';
import { BRAND } from '../../brand/brand';

const Scene: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', background: '#0A0A14' }}>
      <div style={{ position: 'absolute', top: 100, left: 0, right: 0, textAlign: 'center', opacity: Math.min(f / 12, 1) }}>
        <Kicker>{title}</Kicker>
      </div>
      {children}
    </AbsoluteFill>
  );
};

const BlindsDemo: React.FC = () => {
  const f = useCurrentFrame();
  const p = prog(f, 5, 45);
  return (
    <div style={{ width: 800, height: 500, position: 'relative', ...blindsWipe(p, 8, 'up') }}>
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--accent), var(--accent-dk))',
        borderRadius: 24 }} />
    </div>
  );
};

export const AnimationShowcaseNewKI: React.FC = () => (
  <ThemeProvider value={BRAND}>
    <AbsoluteFill style={{ background: '#0A0A14' }}>
      <Sequence from={0} durationInFrames={90}>
        <Scene title="AI RIPPLE">
          <AIRipple size={260}>
            <PremiumIcon name="sparkles" size="lg" at={0} />
          </AIRipple>
        </Scene>
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <Scene title="NOTIFICATION STACK">
          <NotificationStack
            width={650}
            items={[
              { title: 'Neues Modell', sub: 'Llama 4 ist da', at: 5 },
              { title: 'Prompt-Tipp', sub: 'Rolle zuerst definieren', at: 25 },
              { title: 'Tool-Update', sub: 'ChatGPT kann jetzt Bilder lesen', at: 45 },
            ]}
          />
        </Scene>
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <Scene title="BLINDS WIPE (ÜBERGANG)">
          <BlindsDemo />
        </Scene>
      </Sequence>
    </AbsoluteFill>
  </ThemeProvider>
);

export const ANIMATION_SHOWCASE_NEW_KI_FRAMES = 270;
