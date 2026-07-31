import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, a, E, prog } from '../tokens';
import { FONT } from '../fonts';
import { Typewriter } from './TextFX';

// ════════════════════════════════════════════════════════════════════════════
//  ChatUI — KI-Chat-Fenster (ChatGPT/Claude-Look). Nachrichten erscheinen
//  nacheinander; die KI-Antwort zeigt erst Tipp-Punkte, dann tippt sie sich
//  selbst (Typewriter). Kernbaustein für den KI-Kanal. Theme-fähig.
// ════════════════════════════════════════════════════════════════════════════
export type ChatMsg = { role: 'user' | 'ai'; text: string; at: number; cps?: number };

const TypingDots: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <span style={{ display: 'inline-flex', gap: 9, padding: '8px 2px' }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 13, height: 13, borderRadius: 7, background: C.gray,
          opacity: 0.3 + 0.7 * Math.max(0, Math.sin(f * 0.22 - i * 0.6)) }} />
      ))}
    </span>
  );
};

const AiText: React.FC<{ text: string; start: number; cps: number; size: number }> = ({ text, start, cps, size }) => {
  const f = useCurrentFrame();
  const dots = 16;
  if (f < start) return null;
  if (f < start + dots) return <TypingDots />;
  return <Typewriter text={text} start={start + dots} cps={cps} size={size} color={C.white} weight={500} />;
};

export const ChatUI: React.FC<{
  messages: ChatMsg[]; width?: number; title?: string; size?: number; style?: React.CSSProperties;
}> = ({ messages, width = 900, title = 'ChatGPT', size = 34, style }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width, borderRadius: 34, overflow: 'hidden', background: a('#0B0F14', 0.82),
      border: `1px solid ${a('var(--accent)', 0.28)}`,
      boxShadow: `0 30px 80px ${a('#000000', 0.5)}, 0 0 60px ${a('var(--accent)', 0.15)}`,
      backdropFilter: 'blur(10px)', ...style }}>
      {/* Kopf */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '22px 28px',
        borderBottom: `1px solid ${a('#FFFFFF', 0.08)}` }}>
        <div style={{ width: 34, height: 34, borderRadius: 11, background: 'var(--accent)',
          boxShadow: `0 0 18px var(--accent)` }} />
        <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 32, color: C.white }}>{title}</span>
      </div>
      {/* Nachrichten */}
      <div style={{ padding: '30px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {messages.map((m, i) => {
          const p = prog(f, m.at, m.at + 10, E.spring);
          if (p <= 0) return null;
          const isUser = m.role === 'user';
          return (
            <div key={i} style={{ alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '84%',
              opacity: Math.min(p * 1.4, 1), transform: `translateY(${(1 - p) * 26}px)` }}>
              <div style={{ padding: '20px 28px', borderRadius: 26, fontFamily: FONT.body, fontSize: size,
                lineHeight: 1.35, background: isUser ? 'var(--accent)' : a('#FFFFFF', 0.08),
                color: isUser ? '#0B0F14' : C.white, fontWeight: isUser ? 700 : 500,
                borderBottomRightRadius: isUser ? 8 : 26, borderBottomLeftRadius: isUser ? 26 : 8 }}>
                {isUser ? m.text : <AiText text={m.text} start={m.at + 8} cps={m.cps ?? 26} size={size} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
