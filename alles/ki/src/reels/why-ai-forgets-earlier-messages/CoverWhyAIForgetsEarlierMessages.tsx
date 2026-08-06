import React from 'react';
import {AbsoluteFill} from 'remotion';
import {contextFont, contextPalette, contextShadows} from './style';

const CoverCard: React.FC<{left: number; active: boolean; opacity?: number}> = ({left, active, opacity = 1}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top: 1065,
      width: 235,
      height: 150,
      borderRadius: 30,
      border: `3px solid ${active ? contextPalette.accent : contextPalette.line}66`,
      background: active ? contextPalette.surface : contextPalette.surfaceMuted,
      boxShadow: active ? contextShadows.accent : contextShadows.soft,
      opacity,
      padding: '30px 26px',
    }}
  >
    <div style={{height: 18, width: '86%', borderRadius: 99, background: active ? contextPalette.accent : contextPalette.muted, opacity: 0.3}} />
    <div style={{height: 18, width: '62%', borderRadius: 99, background: active ? contextPalette.accent : contextPalette.muted, opacity: 0.2, marginTop: 18}} />
  </div>
);

export const CoverWhyAIForgetsEarlierMessages: React.FC = () => (
  <AbsoluteFill style={{background: contextPalette.background, color: contextPalette.foreground, fontFamily: contextFont, overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 60%, rgba(125,73,223,0.17), transparent 45%)'}} />

    <div
      style={{
        position: 'absolute',
        left: 64,
        right: 64,
        top: 105,
        textAlign: 'center',
        fontSize: 82,
        lineHeight: 0.98,
        fontWeight: 980,
        letterSpacing: -4,
      }}
    >
      WARUM VERGISST<br />
      <span style={{color: contextPalette.accent}}>DEINE KI</span><br />
      FRÜHERE NACHRICHTEN?
    </div>

    <div style={{position: 'absolute', left: -220, right: -220, top: 1135, height: 16, borderRadius: 99, background: contextPalette.line}} />
    <CoverCard left={-90} active={false} opacity={0.22} />
    <CoverCard left={185} active={false} opacity={0.42} />
    <CoverCard left={460} active />
    <CoverCard left={735} active />
    <CoverCard left={1010} active />

    <div
      style={{
        position: 'absolute',
        left: 382,
        top: 900,
        width: 610,
        height: 520,
        borderRadius: 54,
        border: `7px solid ${contextPalette.accent}`,
        background: 'rgba(255,255,255,0.34)',
        boxShadow: contextShadows.accent,
        backdropFilter: 'blur(12px)',
      }}
    />
    <div style={{position: 'absolute', left: 370, top: 875, width: 24, height: 570, borderRadius: 99, background: contextPalette.danger, opacity: 0.75}} />
  </AbsoluteFill>
);